import { Shield, Scissors, User } from 'lucide-react';

export default function KaryawanPage() {
  const employees = [
    {
      name: 'Bapak Hendra',
      role: 'PEMILIK',
      roleBadge: 'bg-purple-100 text-purple-800 border-purple-200',
      phone: '081234567801',
      status: 'Aktif',
      detail: 'Penanggung jawab keuangan, persetujuan payroll, laba kotor & strategi usaha.',
      icon: Shield,
    },
    {
      name: 'Siti Rahma',
      role: 'ADMINISTRASI',
      roleBadge: 'bg-blue-100 text-blue-800 border-blue-200',
      phone: '081234567802',
      status: 'Aktif',
      detail: 'Pengelolaan reservasi WhatsApp, penjadwalan kapster, kasir harian & pencatatan kinerja.',
      icon: User,
    },
    {
      name: 'Rizky Fauzan',
      role: 'KAPSTER 1',
      roleBadge: 'bg-amber-100 text-amber-800 border-amber-200',
      phone: '081234567803',
      status: 'Aktif',
      detail: 'Spesialis Gentleman Fade & Undercut. Komisi 40% bagi hasil layanan.',
      icon: Scissors,
    },
    {
      name: 'Dimas Pratama',
      role: 'KAPSTER 2',
      roleBadge: 'bg-amber-100 text-amber-800 border-amber-200',
      phone: '081234567804',
      status: 'Aktif',
      detail: 'Spesialis Haircut & Wash, Hair Spa. Komisi 40% bagi hasil layanan.',
      icon: Scissors,
    },
    {
      name: 'Yoga Kurnia',
      role: 'KAPSTER 3',
      roleBadge: 'bg-amber-100 text-amber-800 border-amber-200',
      phone: '081234567805',
      status: 'Aktif',
      detail: 'Spesialis Coloring & Chemical Treatment. Komisi 40% bagi hasil layanan.',
      icon: Scissors,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen Karyawan & Struktur Tim</h2>
          <p className="text-xs text-slate-500 mt-1">
            Struktur organisasi Edamos Barbershop: 1 Pemilik, 1 Administrasi, dan 3 Kapster.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((e) => {
          const Icon = e.icon;
          return (
            <div key={e.name} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${e.roleBadge}`}>
                    {e.role}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {e.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                    <Icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{e.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{e.phone}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">{e.detail}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Catatan Kinerja</span>
                <span className="font-semibold text-amber-600">Terpantau</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
