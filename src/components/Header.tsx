import { MapPin, Bell, Calendar, ShieldCheck } from 'lucide-react';

export default function Header() {
  const currentDate = 'Rabu, 7 Oktober 2026';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span>Katapang, Kab. Bandung</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span className="font-medium">Sistem Informasi Aktif</span>
        </div>

        <button
          type="button"
          aria-label="Notifikasi sistem"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5"></span>
        </button>
      </div>
    </header>
  );
}
