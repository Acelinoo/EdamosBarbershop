import { Plus, AlertTriangle } from 'lucide-react';

export default function ReservasiPage() {
  const bookings = [
    {
      code: 'BKG-20261007-001',
      customer: 'Ahmad Santoso',
      phone: '085712340001',
      service: 'Gentleman Regular Haircut',
      kapster: 'Rizky Fauzan (Kapster 1)',
      date: '07 Okt 2026',
      time: '10:00 - 10:30',
      status: 'SELESAI',
      statusClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      code: 'BKG-20261007-002',
      customer: 'Budi Setiawan',
      phone: '085712340002',
      service: 'Premium Haircut & Wash',
      kapster: 'Dimas Pratama (Kapster 2)',
      date: '07 Okt 2026',
      time: '11:00 - 11:45',
      status: 'SELESAI',
      statusClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      code: 'BKG-20261007-003',
      customer: 'Candra Wijaya',
      phone: '085712340003',
      service: 'Hair Coloring / Pengecatan',
      kapster: 'Yoga Kurnia (Kapster 3)',
      date: '07 Okt 2026',
      time: '13:00 - 14:00',
      status: 'SELESAI',
      statusClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      code: 'BKG-20261007-004',
      customer: 'Denny Pratama',
      phone: '085712340004',
      service: 'Hair Design & Fade Styling',
      kapster: 'Rizky Fauzan (Kapster 1)',
      date: '07 Okt 2026',
      time: '15:00 - 15:45',
      status: 'DIKONFIRMASI',
      statusClass: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      code: 'BKG-20261007-005',
      customer: 'Eko Ramadhan',
      phone: '085712340005',
      service: 'Gentleman Regular Haircut',
      kapster: 'Dimas Pratama (Kapster 2)',
      date: '07 Okt 2026',
      time: '16:30 - 17:00',
      status: 'MENUNGGU',
      statusClass: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen Reservasi & Jadwal</h2>
          <p className="text-xs text-slate-500 mt-1">
            Penjadwalan reservasi pelanggan, alokasi kapster, dan pencegahan double booking otomatis.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Reservasi</span>
        </button>
      </div>

      {/* Info Pencegahan Double Booking */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold">Fitur Validasi Bebas Tumpang Tindih (Anti Double Booking)</h4>
          <p className="mt-0.5 text-amber-800">
            Sistem secara otomatis memeriksa ketersediaan jam kapster yang dipilih. Jika kapster sedang menangani pelanggan lain pada slot waktu tersebut, sistem akan meminta pemilihan jam atau kapster alternatif.
          </p>
        </div>
      </div>

      {/* Tabel Reservasi */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Daftar Reservasi Hari Ini</h3>
          <span className="text-xs text-slate-500">Total: 5 Reservasi</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                <th className="py-2.5 px-3">Kode Booking</th>
                <th className="py-2.5 px-3">Pelanggan</th>
                <th className="py-2.5 px-3">Layanan</th>
                <th className="py-2.5 px-3">Kapster</th>
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.code} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-800">{b.code}</td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-900">{b.customer}</div>
                    <div className="text-[11px] text-slate-400">{b.phone}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{b.service}</td>
                  <td className="py-3 px-3 text-slate-700">{b.kapster}</td>
                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-medium">{b.time}</div>
                    <div className="text-[11px] text-slate-400">{b.date}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${b.statusClass}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
