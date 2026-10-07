import { Calculator } from 'lucide-react';

export default function PenggajianPage() {
  const slips = [
    {
      slipNumber: 'SLIP-202609-001',
      employee: 'Siti Rahma',
      role: 'ADMINISTRASI',
      served: '85 Booking & Transaksi Kasir',
      base: 'Rp 2.500.000',
      commission: 'Rp 0',
      bonus: 'Rp 200.000',
      total: 'Rp 2.700.000',
      status: 'TERBAYAR',
    },
    {
      slipNumber: 'SLIP-202609-002',
      employee: 'Rizky Fauzan',
      role: 'KAPSTER 1',
      served: '35 Layanan Pelanggan',
      base: 'Rp 0',
      commission: 'Rp 950.000',
      bonus: 'Rp 50.000',
      total: 'Rp 1.000.000',
      status: 'TERBAYAR',
    },
    {
      slipNumber: 'SLIP-202609-003',
      employee: 'Dimas Pratama',
      role: 'KAPSTER 2',
      served: '30 Layanan Pelanggan',
      base: 'Rp 0',
      commission: 'Rp 850.000',
      bonus: 'Rp 50.000',
      total: 'Rp 900.000',
      status: 'TERBAYAR',
    },
    {
      slipNumber: 'SLIP-202609-004',
      employee: 'Yoga Kurnia',
      role: 'KAPSTER 3',
      served: '28 Layanan Pelanggan',
      base: 'Rp 0',
      commission: 'Rp 750.000',
      bonus: 'Rp 50.000',
      total: 'Rp 800.000',
      status: 'TERBAYAR',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Perhitungan Penggajian & Slip Gaji</h2>
          <p className="text-xs text-slate-500 mt-1">
            Kalkulasi berbasis kinerja kapster & pembagian laba kotor sesuai alur operasional Edamos Barbershop.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition-colors self-start sm:self-auto"
        >
          <Calculator className="w-4 h-4" />
          <span>Kalkulasi Gaji Periode Baru</span>
        </button>
      </div>

      {/* Ringkasan Finansial Penggajian Terakhir (September 2026) */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
              Rekap Periode Penggajian: September 2026
            </span>
            <h3 className="text-lg font-bold">Ringkasan Laba Kotor & Pool Dana Gaji</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            Status: Telah Disetujui Pemilik
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-[11px] text-slate-400">Total Omzet Penjualan</p>
            <p className="text-base font-bold text-white mt-0.5">Rp 12.000.000</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Biaya Operasional</p>
            <p className="text-base font-bold text-rose-400 mt-0.5">- Rp 1.200.000</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Laba Kotor Usaha</p>
            <p className="text-base font-bold text-emerald-400 mt-0.5">Rp 10.800.000</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Alokasi Pool Gaji (50%)</p>
            <p className="text-base font-bold text-amber-400 mt-0.5">Rp 5.400.000</p>
          </div>
        </div>
      </div>

      {/* Tabel Slip Gaji Karyawan */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Daftar Slip Gaji Karyawan</h3>
          <span className="text-xs text-slate-500">4 Karyawan (1 Admin + 3 Kapster)</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                <th className="py-2.5 px-3">No. Slip</th>
                <th className="py-2.5 px-3">Nama Karyawan</th>
                <th className="py-2.5 px-3">Peran</th>
                <th className="py-2.5 px-3">Kinerja Layanan</th>
                <th className="py-2.5 px-3">Gaji Pokok</th>
                <th className="py-2.5 px-3">Komisi / Bagi Hasil</th>
                <th className="py-2.5 px-3 text-right">Total Gaji Bersih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slips.map((s) => (
                <tr key={s.slipNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900">{s.slipNumber}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{s.employee}</td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {s.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{s.served}</td>
                  <td className="py-3 px-3 text-slate-600">{s.base}</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">{s.commission}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">{s.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
