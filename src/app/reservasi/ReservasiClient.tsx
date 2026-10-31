'use client';

import React, { useState, useTransition } from 'react';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Search,
  ChevronDown,
  Plus,
  Scissors,
  Calendar,
  Trash2,
  Edit2,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  createBookingAction,
  updateBookingAction,
  updateBookingStatusAction,
  deleteBookingAction,
} from '@/app/actions/reservasi';
import { BookingStatus } from '@prisma/client';

export interface SerializedBooking {
  id: string;
  bookingCode: string;
  customerId: string;
  kapsterId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes: string | null;
  completedAt: string | null;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  kapster: {
    id: string;
    name: string;
    role: string;
  };
  items: {
    id: string;
    price: number;
    service: {
      id: string;
      name: string;
      price: number;
      durationMinutes: number;
    };
  }[];
  transaction?: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paymentStatus: string;
  } | null;
}

export interface CustomerOption {
  id: string;
  name: string;
  phone: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface KapsterOption {
  id: string;
  name: string;
  role: string;
}

interface Props {
  initialBookings: SerializedBooking[];
  customers: CustomerOption[];
  services: ServiceOption[];
  kapsters: KapsterOption[];
}

export default function ReservasiClient({
  initialBookings,
  customers,
  services,
  kapsters,
}: Props) {
  const { success, error: showError } = useToast();
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<SerializedBooking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<SerializedBooking | null>(null);

  // Form states for double-booking conflict warning
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formKapster, setFormKapster] = useState<string>(kapsters[0]?.id || '');
  const [formStart, setFormStart] = useState<string>('09:00');
  const [formEnd, setFormEnd] = useState<string>('09:45');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');

  // Helper to recompute formEnd when service or startTime changes
  const updateEndTime = (start: string, sId: string) => {
    const s = services.find((srv) => srv.id === sId);
    const duration = s?.durationMinutes || 30;
    const [h, m] = start.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      const total = h * 60 + m + duration;
      const endH = Math.floor(total / 60) % 24;
      const endM = total % 60;
      setFormEnd(`${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`);
    }
  };

  const handleStartTimeChange = (newStart: string) => {
    setFormStart(newStart);
    updateEndTime(newStart, selectedServiceId);
  };

  const handleServiceChange = (newServiceId: string) => {
    setSelectedServiceId(newServiceId);
    updateEndTime(formStart, newServiceId);
  };

  const handleOpenAdd = () => {
    const defaultServiceId = services[0]?.id || '';
    const defaultStart = '09:00';
    setSelectedServiceId(defaultServiceId);
    setFormStart(defaultStart);
    setFormKapster(kapsters[0]?.id || '');
    setFormDate(new Date().toISOString().slice(0, 10));
    updateEndTime(defaultStart, defaultServiceId);
    setIsAddOpen(true);
  };

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [kapsterFilter, setKapsterFilter] = useState<string>('ALL');

  // Calculate live statistics
  const totalBookings = initialBookings.length;
  const pendingCount = initialBookings.filter(
    (b) => b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED
  ).length;
  const completedCount = initialBookings.filter(
    (b) => b.status === BookingStatus.COMPLETED
  ).length;

  // Real-time conflict preview
  const conflictDetected = initialBookings.some((b) => {
    if (editingBooking && b.id === editingBooking.id) return false;
    if (b.status === BookingStatus.CANCELLED) return false;
    const sameKapster = b.kapsterId === formKapster;
    const sameDate = b.bookingDate.slice(0, 10) === formDate;
    if (!sameKapster || !sameDate) return false;

    return formStart < b.endTime && formEnd > b.startTime;
  });

  // Filter bookings
  const filteredBookings = initialBookings.filter((b) => {
    const matchSearch =
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      b.kapster.name.toLowerCase().includes(search.toLowerCase()) ||
      b.items[0]?.service.name.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchKapster = kapsterFilter === 'ALL' || b.kapsterId === kapsterFilter;

    return matchSearch && matchStatus && matchKapster;
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createBookingAction(formData);
      if (res.success) {
        success(res.message);
        setIsAddOpen(false);
        form.reset();
      } else {
        showError(res.message);
      }
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBooking) return;
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await updateBookingAction(formData);
      if (res.success) {
        success(res.message);
        setEditingBooking(null);
      } else {
        showError(res.message);
      }
    });
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    startTransition(async () => {
      const res = await updateBookingStatusAction(bookingId, newStatus);
      if (res.success) {
        success(res.message);
      } else {
        showError(res.message);
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingBooking) return;

    startTransition(async () => {
      const res = await deleteBookingAction(deletingBooking.id);
      if (res.success) {
        success(res.message);
        setDeletingBooking(null);
      } else {
        showError(res.message);
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. 3 Top Stat Cards matching Monetira */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Total Reservasi Terdata</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-2xl lg:text-[28px] font-extrabold text-slate-900 tracking-tight mt-3">
            {totalBookings} Booking
          </p>
          <p className="text-xs text-slate-400 mt-1">Keseluruhan jadwal reservasi pelanggan</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Antrean Aktif / Terjadwal</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-2xl lg:text-[28px] font-extrabold text-slate-900 tracking-tight mt-3">
            {pendingCount} Antrean
          </p>
          <p className="text-xs text-slate-400 mt-1">Menunggu waktu layanan atau dikonfirmasi</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Layanan Selesai</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-2xl lg:text-[28px] font-extrabold text-slate-900 tracking-tight mt-3">
            {completedCount} Selesai
          </p>
          <p className="text-xs text-slate-400 mt-1">Telah selesai dilayani kapster bertugas</p>
        </div>
      </div>

      {/* 2. Banner Monetira Style */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs flex items-center justify-between hover:border-blue-200 transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Sistem Otomatis Pencegahan Double Booking
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">
              Setiap penambahan atau perubahan jam langsung divalidasi dengan jadwal kapster bersangkutan
            </p>
          </div>
        </div>
        <div className="text-slate-400 p-2">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Search, Filter & Action Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode booking, nama pelanggan, kapster..."
              className="w-full bg-white border border-slate-200/90 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                aria-label="Filter status booking"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200/90 rounded-2xl pl-4 pr-9 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-[#0066FF] cursor-pointer shadow-xs transition-all"
              >
                <option value="ALL">Semua Status</option>
                <option value={BookingStatus.PENDING}>Menunggu</option>
                <option value={BookingStatus.CONFIRMED}>Dikonfirmasi</option>
                <option value={BookingStatus.IN_PROGRESS}>Sedang Layanan</option>
                <option value={BookingStatus.COMPLETED}>Selesai</option>
                <option value={BookingStatus.CANCELLED}>Dibatalkan</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                aria-label="Filter kapster"
                value={kapsterFilter}
                onChange={(e) => setKapsterFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200/90 rounded-2xl pl-4 pr-9 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-[#0066FF] cursor-pointer shadow-xs transition-all"
              >
                <option value="ALL">Semua Kapster</option>
                {kapsters.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-semibold text-sm rounded-2xl px-5 py-2.5 flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Reservasi</span>
        </button>
      </div>

      {/* 4. Daftar Reservasi - Monetira Floating Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-slate-900">Daftar Reservasi & Antrean</h2>
          <span className="text-xs font-semibold text-slate-400">
            {filteredBookings.length} dari {totalBookings} Reservasi
          </span>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada reservasi ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba ubah filter atau tambah jadwal baru.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-blue-100 transition-all duration-200 flex items-center justify-between group"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                    <Scissors className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm md:text-base font-bold text-slate-900 truncate group-hover:text-[#0066FF] transition-colors">
                        {b.customer.name}
                      </h4>
                      <span className="text-xs font-mono text-slate-400">[{b.bookingCode}]</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="font-semibold text-slate-700">
                        {b.items[0]?.service.name || 'Pangkas Rambut'}
                      </span>
                      <span>•</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        Kapster: {b.kapster.name}
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {b.startTime} - {b.endTime}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(b.bookingDate).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Status, Price & Actions */}
                <div className="flex items-center gap-4 shrink-0 pl-3">
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === BookingStatus.COMPLETED
                          ? 'bg-emerald-50 text-emerald-600'
                          : b.status === BookingStatus.CONFIRMED
                          ? 'bg-blue-50 text-blue-600'
                          : b.status === BookingStatus.IN_PROGRESS
                          ? 'bg-purple-50 text-purple-600'
                          : b.status === BookingStatus.CANCELLED
                          ? 'bg-rose-50 text-rose-500'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {b.status === BookingStatus.COMPLETED
                        ? 'Selesai'
                        : b.status === BookingStatus.CONFIRMED
                        ? 'Dikonfirmasi'
                        : b.status === BookingStatus.IN_PROGRESS
                        ? 'Layanan'
                        : b.status === BookingStatus.CANCELLED
                        ? 'Batal'
                        : 'Menunggu'}
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      Rp {(b.items[0]?.price || 0).toLocaleString('id-ID')}
                    </p>
                  </div>

                  {/* Actions Dropdown / Buttons */}
                  <div className="flex items-center gap-1">
                    {b.status !== BookingStatus.COMPLETED && b.status !== BookingStatus.CANCELLED && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(b.id, BookingStatus.COMPLETED)}
                        title="Tandai Selesai"
                        className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBooking(b);
                        const bDate = b.bookingDate.slice(0, 10);
                        const bKapster = b.kapsterId;
                        const bStart = b.startTime;
                        const bServiceId = b.items[0]?.service.id || services[0]?.id || '';
                        setFormDate(bDate);
                        setFormKapster(bKapster);
                        setFormStart(bStart);
                        setSelectedServiceId(bServiceId);
                        updateEndTime(bStart, bServiceId);
                      }}
                      title="Edit Reservasi"
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingBooking(b)}
                      title="Hapus Reservasi"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Tambah Reservasi */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900">Tambah Reservasi Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              {conflictDetected && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>
                    <strong>Peringatan Bentrok Jadwal:</strong> Kapster yang dipilih sudah memiliki
                    jadwal aktif pada rentang waktu ini. Silakan pilih jam atau kapster lain.
                  </span>
                </div>
              )}

              {/* Pelanggan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pelanggan <span className="text-rose-500">*</span>
                </label>
                <select
                  name="customerId"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Layanan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Layanan <span className="text-rose-500">*</span>
                </label>
                <select
                  name="serviceId"
                  value={selectedServiceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - Rp {s.price.toLocaleString('id-ID')} ({s.durationMinutes} menit)
                    </option>
                  ))}
                </select>
              </div>

              {/* Kapster & Tanggal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kapster <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="kapsterId"
                    value={formKapster}
                    onChange={(e) => setFormKapster(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                  >
                    {kapsters.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tanggal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Jam Mulai & Selesai */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jam Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    value={formStart}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jam Selesai <span className="text-slate-400 font-normal">(Otomatis)</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    value={formEnd}
                    readOnly
                    title="Jam selesai dihitung otomatis berdasarkan durasi layanan"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Catatan</label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Permintaan gaya rambut khusus, dsb."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending || conflictDetected}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0066FF] text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Reservasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Reservasi */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900">
                Edit Reservasi [{editingBooking.bookingCode}]
              </h3>
              <button
                type="button"
                onClick={() => setEditingBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              <input type="hidden" name="id" value={editingBooking.id} />
              {conflictDetected && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>
                    <strong>Peringatan Bentrok:</strong> Kapster sudah memiliki jadwal lain pada jam
                    ini.
                  </span>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status Booking</label>
                <select
                  name="status"
                  defaultValue={editingBooking.status}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                >
                  <option value={BookingStatus.PENDING}>Menunggu</option>
                  <option value={BookingStatus.CONFIRMED}>Dikonfirmasi</option>
                  <option value={BookingStatus.IN_PROGRESS}>Sedang Layanan</option>
                  <option value={BookingStatus.COMPLETED}>Selesai</option>
                  <option value={BookingStatus.CANCELLED}>Dibatalkan</option>
                </select>
              </div>

              {/* Layanan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Layanan <span className="text-rose-500">*</span>
                </label>
                <select
                  name="serviceId"
                  value={selectedServiceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - Rp {s.price.toLocaleString('id-ID')} ({s.durationMinutes} menit)
                    </option>
                  ))}
                </select>
              </div>

              {/* Kapster & Tanggal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kapster</label>
                  <select
                    name="kapsterId"
                    value={formKapster}
                    onChange={(e) => setFormKapster(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                  >
                    {kapsters.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    name="bookingDate"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Jam */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jam Mulai</label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    value={formStart}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jam Selesai <span className="text-slate-400 font-normal">(Otomatis)</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    value={formEnd}
                    readOnly
                    title="Jam selesai dihitung otomatis berdasarkan durasi layanan"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending || conflictDetected}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0066FF] text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Perbarui Reservasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deletingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-scale-in">
            <h3 className="font-bold text-base text-slate-900">Hapus Reservasi?</h3>
            <p className="text-xs text-slate-500 mt-2">
              Reservasi <strong className="text-slate-800">{deletingBooking.bookingCode}</strong> ({deletingBooking.customer.name}) akan dihapus permanen.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
