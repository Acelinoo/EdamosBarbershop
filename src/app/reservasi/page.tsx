import prisma from '@/lib/prisma';
import ReservasiClient, {
  SerializedBooking,
  ServiceOption,
  KapsterOption,
} from './ReservasiClient';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function ReservasiPage() {
  const [rawBookings, customers, rawServices, rawKapsters] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { scheduledAt: 'desc' },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        kapster: { select: { id: true, name: true, role: true } },
        items: {
          include: {
            service: { select: { id: true, name: true, price: true, durationMinutes: true } },
          },
        },
        transaction: {
          select: { id: true, invoiceNumber: true, totalAmount: true, paymentStatus: true },
        },
      },
    }),
    prisma.customer.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, phone: true },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, price: true, durationMinutes: true },
    }),
    prisma.employee.findMany({
      where: { role: Role.KAPSTER, status: 'ACTIVE' },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, role: true },
    }),
  ]);

  const bookings: SerializedBooking[] = rawBookings.map((b) => ({
    id: b.id,
    bookingCode: b.bookingCode,
    customerId: b.customerId,
    kapsterId: b.kapsterId,
    bookingDate: b.bookingDate.toISOString(),
    startTime: b.startTime,
    endTime: b.endTime,
    status: b.status,
    notes: b.notes,
    completedAt: b.completedAt ? b.completedAt.toISOString() : null,
    createdAt: b.createdAt.toISOString(),
    customer: b.customer,
    kapster: {
      id: b.kapster.id,
      name: b.kapster.name,
      role: b.kapster.role,
    },
    items: b.items.map((it) => ({
      id: it.id,
      price: Number(it.price),
      service: {
        id: it.service.id,
        name: it.service.name,
        price: Number(it.service.price),
        durationMinutes: it.service.durationMinutes,
      },
    })),
    transaction: b.transaction
      ? {
          id: b.transaction.id,
          invoiceNumber: b.transaction.invoiceNumber,
          totalAmount: Number(b.transaction.totalAmount),
          paymentStatus: b.transaction.paymentStatus,
        }
      : null,
  }));

  const services: ServiceOption[] = rawServices.map((s) => ({
    id: s.id,
    name: s.name,
    price: Number(s.price),
    durationMinutes: s.durationMinutes,
  }));

  const kapsters: KapsterOption[] = rawKapsters.map((k) => ({
    id: k.id,
    name: k.name,
    role: k.role,
  }));

  return (
    <ReservasiClient
      initialBookings={bookings}
      customers={customers}
      services={services}
      kapsters={kapsters}
    />
  );
}
