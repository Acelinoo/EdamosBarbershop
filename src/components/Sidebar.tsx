'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Scissors,
  Receipt,
  UserCheck,
  Wallet,
  FileBarChart,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/reservasi', label: 'Reservasi', icon: CalendarCheck, badge: '5' },
  { href: '/pelanggan', label: 'Pelanggan', icon: Users },
  { href: '/layanan', label: 'Layanan', icon: Scissors },
  { href: '/transaksi', label: 'Transaksi', icon: Receipt },
  { href: '/karyawan', label: 'Karyawan', icon: UserCheck, badge: '4' },
  { href: '/penggajian', label: 'Penggajian', icon: Wallet },
  { href: '/laporan', label: 'Laporan', icon: FileBarChart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Scissors className="w-5 h-5 rotate-45" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-wide text-white">EDAMOS</h1>
          <p className="text-xs text-slate-400 font-medium">Barbershop & Payroll</p>
        </div>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Info Status Toko & Profil */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">Status: Buka</span>
          </div>
          <span className="text-[11px] text-emerald-500">3 Kapster Aktif</span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400">
            EB
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">Siti Rahma</p>
            <p className="text-[10px] text-slate-400">Administrasi</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
