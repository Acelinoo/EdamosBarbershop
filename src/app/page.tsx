import Link from 'next/link';
import {
  CalendarCheck,
  Receipt,
  Wallet,
  PlusCircle,
  Scissors,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Pendapatan Hari Ini',
      value: 'Rp 225.000',
      description: 'Dari 3 transaksi kasir selesai',
      icon: Receipt,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Reservasi Hari Ini',
      value: '5 Booking',
      description: '3 Selesai • 1 Dikonfirmasi • 1 Menunggu',
      icon: CalendarCheck,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    },
    {
      title: 'Kapster Bertugas',
      value: '3 Kapster',
      description: 'Rizky, Dimas, & Yoga aktif',
      icon: Scissors,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
    },
    {
      title: 'Est. Pool Gaji Bulan Ini',
      value: 'Rp 5.400.000',
      description: '50% dari estimasi laba kotor usaha',
      icon: Wallet,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    },
  ];

  const todayBookings = [
    {
      id: '1',
      code: 'BKG-20261007-001',
      customer: 'Ahmad Santoso',
      phone: '085712340001',
      service: 'Gentleman Regular Haircut',
      kapster: 'Rizky Fauzan (Kapster 1)',
      time: '10:00 - 10:30',
      status: 'SELESAI',
      statusClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: '2',
      code: 'BKG-20261007-002',
      customer: 'Budi Setiawan',
      phone: '085712340002',
      service: 'Premium Haircut & Wash',
      kapster: 'Dimas Pratama (Kapster 2)',
      time: '11:00 - 11:45',
      status: 'SELESAI',
      statusClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: '3',
      code: 'BKG-20261007-003',
      customer: 'Candra Wijaya',
      phone: '085712340003',
      service: 'Hair Coloring / Pengecatan',
      kapster: 'Yoga Kurnia (Kapster 3)',
      time: '13:00 - 14:00',
      status: 'SELESAI',
      statusClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: '4',
      code: 'BKG-20261007-004',
      customer: 'Denny Pratama',
      phone: '085712340004',
      service: 'Hair Design & Fade Styling',
      kapster: 'Rizky Fauzan (Kapster 1)',
      time: '15:00 - 15:45',
      status: 'DIKONFIRMASI',
      statusClass: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: '5',
      code: 'BKG-20261007-005',
      customer: 'Eko Ramadhan',
      phone: '085712340005',
      service: 'Gentleman Regular Haircut',
      kapster: 'Dimas Pratama (Kapster 2)',
      time: '16:30 - 17:00',
      status: 'MENUNGGU',
      statusClass: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  ];

  const kapsterPerformance = [
    { name: 'Rizky Fauzan (Kapster 1)', served: 1, upcoming: 1, revenue: 'Rp 45.000', commission: 'Rp 18.000' },
    { name: 'Dimas Pratama (Kapster 2)', served: 1, upcoming: 1, revenue: 'Rp 60.000', commission: 'Rp 24.000' },
    { name: 'Yoga Kurnia (Kapster 3)', served: 1, upcoming: 0, revenue: 'Rp 120.000', commission: 'Rp 48.000' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Selamat Datang */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white border border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
            Sistem Informasi Operasional & Gaji
          </span>
          <h2 className="text-2xl font-bold">Selamat Datang di Edamos Barbershop</h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Pantau reservasi online pelanggan, kelola jadwal kapster tanpa double booking, dan pantau kalkulasi penggajian berbasis kinerja secara otomatis.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/reservasi"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Booking</span>
          </Link>
          <Link
            href="/transaksi"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700"
          >
            <Receipt className="w-4 h-4" />
            <span>Kas Harian</span>
          </Link>
        </div>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{stat.title}</span>
                <div className={`p-2 rounded-lg border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Konten 2 Kolom: Jadwal Reservasi & Kinerja Kapster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri (2 span): Jadwal Hari Ini */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Jadwal Reservasi Hari Ini</h3>
              <p className="text-xs text-slate-500">Antrean layanan & pencegahan tumpang tindih waktu</p>
            </div>
            <Link
              href="/reservasi"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5 px-3">Kode / Jam</th>
                  <th className="py-2.5 px-3">Pelanggan</th>
                  <th className="py-2.5 px-3">Layanan</th>
                  <th className="py-2.5 px-3">Kapster</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{b.time}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{b.code}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900">{b.customer}</div>
                      <div className="text-[11px] text-slate-400">{b.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{b.service}</td>
                    <td className="py-3 px-3 text-slate-600">{b.kapster}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${b.statusClass}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kolom Kanan (1 span): Ringkasan Kinerja Kapster Hari Ini */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Kinerja Kapster</h3>
                <p className="text-xs text-slate-500">Rekap harian dasar perhitungan gaji</p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded">
                3 Kapster
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {kapsterPerformance.map((k, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">{k.name}</p>
                    <span className="text-[11px] font-semibold text-amber-600">{k.served} Selesai</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Omzet Layanan: <strong className="text-slate-700">{k.revenue}</strong></span>
                    <span>Komisi: <strong className="text-emerald-600">{k.commission}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/penggajian"
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Kelola Penggajian & Slip Gaji</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
