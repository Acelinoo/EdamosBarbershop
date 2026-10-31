'use server';

import prisma from '@/lib/prisma';
import { safeRevalidatePath as revalidatePath } from '@/lib/revalidate';
import { BookingStatus } from '@prisma/client';

export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CreateBookingInput {
  customerId: string;
  kapsterId: string;
  serviceId: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:MM
  notes?: string;
}

export interface UpdateBookingInput {
  id: string;
  kapsterId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  status: BookingStatus;
  notes?: string;
}

// Helper untuk menghitung endTime berdasarkan startTime dan durasi layanan
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
}

export async function createBookingAction(
  inputOrFormData: FormData | CreateBookingInput
): Promise<ActionResponse> {
  try {
    let customerId: string;
    let kapsterId: string;
    let serviceId: string;
    let bookingDate: string;
    let startTime: string;
    let notes: string | undefined;

    if (inputOrFormData instanceof FormData) {
      customerId = (inputOrFormData.get('customerId') as string)?.trim();
      kapsterId = (inputOrFormData.get('kapsterId') as string)?.trim();
      serviceId = (inputOrFormData.get('serviceId') as string)?.trim();
      bookingDate = (inputOrFormData.get('bookingDate') as string)?.trim();
      startTime = (inputOrFormData.get('startTime') as string)?.trim();
      notes = (inputOrFormData.get('notes') as string)?.trim() || undefined;
    } else {
      customerId = inputOrFormData.customerId?.trim();
      kapsterId = inputOrFormData.kapsterId?.trim();
      serviceId = inputOrFormData.serviceId?.trim();
      bookingDate = inputOrFormData.bookingDate?.trim();
      startTime = inputOrFormData.startTime?.trim();
      notes = inputOrFormData.notes?.trim() || undefined;
    }

    if (!customerId || !kapsterId || !serviceId || !bookingDate || !startTime) {
      return { success: false, message: 'Pelanggan, kapster, layanan, tanggal, dan jam wajib diisi.' };
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return { success: false, message: 'Layanan tidak ditemukan.' };
    }

    const duration = service.durationMinutes || 30;
    const endTime = calculateEndTime(startTime, duration);
    const dateObj = new Date(`${bookingDate}T00:00:00.000Z`);

    if (startTime >= endTime) {
      return {
        success: false,
        message: `Jam selesai (${endTime}) harus lebih besar dari jam mulai (${startTime}).`,
      };
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const scheduledAt = new Date(`${bookingDate}T${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}:00.000Z`);

    // ANTI DOUBLE BOOKING VALIDATION (Server-Side)
    // Cek apakah ada jadwal kapster yang bertabrakan pada tanggal dan rentang waktu yang sama
    const existingBookings = await prisma.booking.findMany({
      where: {
        kapsterId,
        bookingDate: dateObj,
        status: { notIn: [BookingStatus.CANCELLED] },
      },
    });

    // Validasi bentrok jam: startA < endB && endA > startB
    const isConflict = existingBookings.some((b) => {
      return startTime < b.endTime && endTime > b.startTime;
    });

    if (isConflict) {
      return {
        success: false,
        message: `Jadwal kapster pada waktu ${startTime} - ${endTime} sudah terisi. Silakan pilih jam atau kapster alternatif.`,
      };
    }

    // Generate kode booking unik
    const dateCode = bookingDate.replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const bookingCode = `BKG-${dateCode}-${randomSuffix}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingCode,
        customerId,
        kapsterId,
        bookingDate: dateObj,
        startTime,
        endTime,
        scheduledAt,
        status: BookingStatus.CONFIRMED,
        notes: notes || null,
        items: {
          create: [
            {
              serviceId: service.id,
              price: service.price,
            },
          ],
        },
      },
    });

    revalidatePath('/reservasi');
    revalidatePath('/');
    return {
      success: true,
      message: `Reservasi ${bookingCode} berhasil dibuat!`,
      data: newBooking,
    };
  } catch (error: unknown) {
    console.error('Error createBookingAction:', error);
    const msg = error instanceof Error ? error.message : 'Gagal membuat reservasi.';
    return { success: false, message: msg };
  }
}

export async function updateBookingAction(
  inputOrFormData: FormData | UpdateBookingInput
): Promise<ActionResponse> {
  try {
    let id: string;
    let kapsterId: string;
    let serviceId: string;
    let bookingDate: string;
    let startTime: string;
    let status: BookingStatus;
    let notes: string | undefined;

    if (inputOrFormData instanceof FormData) {
      id = (inputOrFormData.get('id') as string)?.trim();
      kapsterId = (inputOrFormData.get('kapsterId') as string)?.trim();
      serviceId = (inputOrFormData.get('serviceId') as string)?.trim();
      bookingDate = (inputOrFormData.get('bookingDate') as string)?.trim();
      startTime = (inputOrFormData.get('startTime') as string)?.trim();
      status = (inputOrFormData.get('status') as BookingStatus) || BookingStatus.CONFIRMED;
      notes = (inputOrFormData.get('notes') as string)?.trim() || undefined;
    } else {
      id = inputOrFormData.id?.trim();
      kapsterId = inputOrFormData.kapsterId?.trim();
      serviceId = inputOrFormData.serviceId?.trim();
      bookingDate = inputOrFormData.bookingDate?.trim();
      startTime = inputOrFormData.startTime?.trim();
      status = inputOrFormData.status;
      notes = inputOrFormData.notes?.trim() || undefined;
    }

    const existing = await prisma.booking.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      return { success: false, message: 'Data reservasi tidak ditemukan.' };
    }

    const targetServiceId = serviceId || (existing.items.length > 0 ? existing.items[0].serviceId : '');
    const service = await prisma.service.findUnique({
      where: { id: targetServiceId },
    });

    if (!service) {
      return { success: false, message: 'Layanan tidak ditemukan.' };
    }

    const duration = service.durationMinutes || 30;
    const endTime = calculateEndTime(startTime, duration);
    const dateObj = new Date(`${bookingDate}T00:00:00.000Z`);

    if (startTime >= endTime) {
      return {
        success: false,
        message: `Jam selesai (${endTime}) harus lebih besar dari jam mulai (${startTime}).`,
      };
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const scheduledAt = new Date(`${bookingDate}T${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}:00.000Z`);

    // ANTI DOUBLE BOOKING VALIDATION (Kecuali booking ini sendiri)
    if (status !== BookingStatus.CANCELLED) {
      const otherBookings = await prisma.booking.findMany({
        where: {
          id: { not: id },
          kapsterId,
          bookingDate: dateObj,
          status: { notIn: [BookingStatus.CANCELLED] },
        },
      });

      const isConflict = otherBookings.some((b) => {
        return startTime < b.endTime && endTime > b.startTime;
      });

      if (isConflict) {
        return {
          success: false,
          message: `Jadwal kapster pada waktu ${startTime} - ${endTime} sudah terisi. Silakan pilih jam atau kapster alternatif.`,
        };
      }
    }

    // Update booking & item
    await prisma.booking.update({
      where: { id },
      data: {
        kapsterId,
        bookingDate: dateObj,
        startTime,
        endTime,
        scheduledAt,
        status,
        notes: notes || null,
        completedAt: status === BookingStatus.COMPLETED ? new Date() : null,
      },
    });

    // Update booking item jika layanan berubah
    if (existing.items.length > 0) {
      await prisma.bookingItem.update({
        where: { id: existing.items[0].id },
        data: {
          serviceId: service.id,
          price: service.price,
        },
      });
    }

    revalidatePath('/reservasi');
    revalidatePath('/');
    return { success: true, message: 'Reservasi berhasil diperbarui.' };
  } catch (error: unknown) {
    console.error('Error updateBookingAction:', error);
    const msg = error instanceof Error ? error.message : 'Gagal memperbarui reservasi.';
    return { success: false, message: msg };
  }
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus
): Promise<ActionResponse> {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        completedAt: status === BookingStatus.COMPLETED ? new Date() : null,
      },
    });

    revalidatePath('/reservasi');
    revalidatePath('/');
    return { success: true, message: `Status reservasi diubah menjadi ${status}.` };
  } catch (error: unknown) {
    console.error('Error updateBookingStatusAction:', error);
    const msg = error instanceof Error ? error.message : 'Gagal mengubah status reservasi.';
    return { success: false, message: msg };
  }
}

export async function deleteBookingAction(bookingId: string): Promise<ActionResponse> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { transaction: true },
    });

    if (!booking) {
      return { success: false, message: 'Reservasi tidak ditemukan.' };
    }

    if (booking.transaction) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });
      revalidatePath('/reservasi');
      revalidatePath('/');
      return {
        success: true,
        message: 'Reservasi memiliki riwayat transaksi, status telah diubah menjadi DIBATALKAN.',
      };
    }

    await prisma.bookingItem.deleteMany({ where: { bookingId } });
    await prisma.performanceRecord.deleteMany({ where: { bookingId } });
    await prisma.booking.delete({ where: { id: bookingId } });

    revalidatePath('/reservasi');
    revalidatePath('/');
    return { success: true, message: 'Reservasi berhasil dihapus.' };
  } catch (error: unknown) {
    console.error('Error deleteBookingAction:', error);
    const msg = error instanceof Error ? error.message : 'Gagal menghapus reservasi.';
    return { success: false, message: msg };
  }
}
