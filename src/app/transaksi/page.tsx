import { Plus } from 'lucide-react';

export default function TransaksiPage() {
  const transactions = [
    {
      invoice: 'INV-20261007-001',
      bookingCode: 'BKG-20261007-001',
      customer: 'Ahmad Santoso',
      service: 'Gentleman Regular Haircut',
      amount: 'Rp 45.000',
      method: 'CASH',
      status: 'LUNAS',
      time: '10:35 WIB',
      admin: 'Siti Rahma (Admin)',
    },
    {
      invoice: 'INV-20261007-002',
      bookingCode: 'BKG-20261007-002',
      customer: 'Budi Setiawan',
      service: 'Premium Haircut & Wash',
      amount: 'Rp 60.000',
      method: 'QRIS',
      status: 'LUNAS',
      time: '11:48 WIB',
      admin: 'Siti Rahma (Admin)',
    },
    {
      invoice: 'INV-20261007-003',
      bookingCode: 'BKG-20261007-003',
      customer: 'Candra Wijaya',
      service: 'Hair Coloring / Pengecatan',
      amount: 'Rp 120.000',
      method: 'TRANSFER',
      status: 'LUNAS',
      time: '14:05 WIB',
      admin: 'Siti Rahma (Admin)',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pencatatan Transaksi & Kas Harian</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan pembayaran layanan kasir, metode pembayaran, dan rekapitulasi kas harian otomatis.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Input Transaksi Kasir</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Total Kas Masuk Hari Ini</span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">Rp 225.000</h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">3 Transaksi Lunas</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Pembayaran Non-Tunai</span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">Rp 180.000</h3>
          <p className="text-[11px] text-blue-600 font-medium mt-1">QRIS & Transfer</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Pembayaran Tunai (Cash)</span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">Rp 45.000</h3>
          <p className="text-[11px] text-slate-600 font-medium mt-1">Kas Laci Kasir</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Riwayat Transaksi Pembayaran</h3>
          <span className="text-xs text-slate-500">Kas Harian 07 Okt 2026</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                <th className="py-2.5 px-3">No. Invoice / Waktu</th>
                <th className="py-2.5 px-3">Pelanggan</th>
                <th className="py-2.5 px-3">Layanan</th>
                <th className="py-2.5 px-3">Metode Bayar</th>
                <th className="py-2.5 px-3">Kasir / Admin</th>
                <th className="py-2.5 px-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.invoice} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono font-semibold text-slate-900">{tx.invoice}</div>
                    <div className="text-[11px] text-slate-400">{tx.time}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">{tx.customer}</td>
                  <td className="py-3 px-3 text-slate-600">{tx.service}</td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {tx.method}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{tx.admin}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600">{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
