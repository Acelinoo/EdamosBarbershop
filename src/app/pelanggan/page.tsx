import { Plus, Phone } from 'lucide-react';

export default function PelangganPage() {
  const customers = [
    { name: 'Ahmad Santoso', phone: '085712340001', email: 'ahmad@example.com', visits: 12, notes: 'Pelanggan reguler gaya undercut' },
    { name: 'Budi Setiawan', phone: '085712340002', email: 'budi@example.com', visits: 8, notes: 'Suka cuci rambut air hangat' },
    { name: 'Candra Wijaya', phone: '085712340003', email: 'candra@example.com', visits: 5, notes: 'Pewarnaan ash grey' },
    { name: 'Denny Pratama', phone: '085712340004', email: 'denny@example.com', visits: 3, notes: 'Hair design garis samping' },
    { name: 'Eko Ramadhan', phone: '085712340005', email: 'eko@example.com', visits: 1, notes: 'Booking via WhatsApp' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen Data Pelanggan</h2>
          <p className="text-xs text-slate-500 mt-1">
            Basis data pelanggan Edamos Barbershop untuk mempermudah konfirmasi WhatsApp dan riwayat kunjungan.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Daftar Pelanggan Terdaftar</h3>
          <span className="text-xs text-slate-500">Total: {customers.length} Pelanggan</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                <th className="py-2.5 px-3">Nama Pelanggan</th>
                <th className="py-2.5 px-3">Kontak WhatsApp</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3 text-center">Total Kunjungan</th>
                <th className="py-2.5 px-3">Catatan Preferensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.phone} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{c.name}</td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="inline-flex items-center gap-1.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {c.phone}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{c.email}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold">
                      {c.visits}x
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{c.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
