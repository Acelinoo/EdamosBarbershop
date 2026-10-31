import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Edamos Barbershop - Smart Barbershop & Payroll',
  description:
    'Sistem Informasi Reservasi Online dan Penggajian Karyawan pada Edamos Barbershop Katapang Kab. Bandung',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full bg-[#F8FAFC] text-slate-900 font-sans flex overflow-hidden">
        <ToastProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F8FAFC]">
            <Header />
            <main className="flex-1 overflow-y-auto px-6 md:px-8 py-3">
              <div className="max-w-7xl mx-auto pb-12">
                <Suspense
                  fallback={
                    <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
                      Memuat data sistem Edamos...
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
