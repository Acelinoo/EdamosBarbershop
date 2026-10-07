import { Download } from 'lucide-react';

export default function LaporanPage() {
  const dailySummary = [
    { date: '07 Okt 2026 (Hari Ini)', customers: 3, grossRevenue: 'Rp 225.000', cash: 'Rp 45.000', nonCash: 'Rp 180.000' },
    { date: '06 Okt 2026', customers: 14, grossRevenue: 'Rp 820.000', cash: 'Rp 350.000', nonCash: 'Rp 470.000' },
    { date: '05 Okt 2026', customers: 16, grossRevenue: 'Rp 950.000', cash: 'Rp 400.000', nonCash: 'Rp 550.000' },
    { date: '04 Okt 2026', customers: 12, grossRevenue: 'Rp 710.000', cash: 'Rp 280.000', nonCash: 'Rp 430.000' },
    { date: '03 Okt 2026', customers: 18, grossRevenue: 'Rp 1.150.000', cash: 'Rp 520.000', nonCash: 'Rp 630.000' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Laporan Pendapatan & Rekapitulasi</h2>
          <p className="text-xs text-slate-500 mt-1">
            Laporan pendapatan harian dan bulanan otomatis untuk Pemilik dan Administrasi Edamos Barbershop.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Laporan (PDF/Excel)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Laporan Harian (Hari Ini)</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Aktif</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">Rp 225.000</h3>
            <span className="text-xs text-slate-500">3 Pelanggan Terlayani</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Dibuat otomatis dari pencatatan buku kas harian oleh Administrasi.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Laporan Bulanan (Bulan Lalu)</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">Final</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">Rp 12.000.000</h3>
            <span className="text-xs text-slate-500">September 2026</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Digunakan Pemilik sebagai dasar alokasi laba kotor & dana gaji 50%.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Rekapitulasi Pendapatan Harian Terakhir</h3>
          <span className="text-xs text-slate-500">Otomatisasi Laporan</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3 text-center">Jumlah Pelanggan</th>
                <th className="py-2.5 px-3">Kas Tunai</th>
                <th className="py-2.5 px-3">Non-Tunai (QRIS/Transfer)</th>
                <th className="py-2.5 px-3 text-right">Total Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dailySummary.map((d) => (
                <tr key={d.date} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-900">{d.date}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {d.customers} Orang
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{d.cash}</td>
                  <td className="py-3 px-3 text-slate-600">{d.nonCash}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600">{d.grossRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
