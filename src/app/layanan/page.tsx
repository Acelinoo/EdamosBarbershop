import { Plus, Clock } from 'lucide-react';

export default function LayananPage() {
  const services = [
    { name: 'Gentleman Regular Haircut', category: 'Haircut', price: 'Rp 45.000', duration: '30 Menit', status: 'Aktif' },
    { name: 'Premium Haircut & Wash', category: 'Haircut', price: 'Rp 60.000', duration: '45 Menit', status: 'Aktif' },
    { name: 'Hair Design & Fade Styling', category: 'Styling', price: 'Rp 75.000', duration: '45 Menit', status: 'Aktif' },
    { name: 'Hair Coloring / Pengecatan', category: 'Coloring', price: 'Rp 120.000', duration: '60 Menit', status: 'Aktif' },
    { name: 'Chemical Service / Perming', category: 'Chemical', price: 'Rp 150.000', duration: '90 Menit', status: 'Aktif' },
    { name: 'Hair Spa & Scalp Treatment', category: 'Treatment', price: 'Rp 50.000', duration: '30 Menit', status: 'Aktif' },
    { name: 'Cuci Rambut & Pijat Relaksasi', category: 'Perawatan', price: 'Rp 25.000', duration: '20 Menit', status: 'Aktif' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Katalog Layanan & Tarif</h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar jenis perawatan rambut, durasi estimasi pengerjaan, dan penetapan harga layanan Edamos Barbershop.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.name} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {s.category}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {s.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-3">{s.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{s.duration}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Tarif Layanan</span>
              <span className="text-base font-extrabold text-amber-600">{s.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
