import { PrismaClient, Role, EmployeeStatus, BookingStatus, PaymentMethod, PaymentStatus, PayrollStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Memulai Seeding Data Edamos Barbershop ---');
  console.log('Catatan: Data yang digunakan merupakan kombinasi antara struktur bisnis resmi');
  console.log('dari laporan KSI (1 Pemilik, 1 Admin, 3 Kapster, kategori layanan, & rumus gaji)');
  console.log('dengan data dummy/fiktif untuk kebutuhan testing (nama, kontak, & transaksi).');

  // Bersihkan data lama jika ada
  await prisma.payrollDetail.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.operationalExpense.deleteMany();
  await prisma.performanceRecord.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.service.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  // ---------------------------------------------------------------------------
  // 1. DATA AKUN & KARYAWAN
  // [FAKTA LAPORAN]: Struktur organisasi terdiri dari 1 Pemilik, 1 Administrasi, dan 3 Kapster.
  // [DATA DUMMY]: Nama individu, username, email, dan nomor telepon bersifat fiktif untuk pengujian.
  // ---------------------------------------------------------------------------
  const ownerUser = await prisma.user.create({
    data: {
      username: 'owner_edamos',
      email: 'owner@edamosbarbershop.com',
      password: 'password_hash_dummy_owner',
      role: Role.OWNER,
    },
  });

  await prisma.employee.create({
    data: {
      userId: ownerUser.id,
      name: 'Bapak Hendra (Pemilik)',
      phone: '081234567801',
      role: Role.OWNER,
      status: EmployeeStatus.ACTIVE,
      baseSalary: 0,
      commissionRate: 0,
      hiredAt: new Date('2021-01-01'),
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      username: 'admin_edamos',
      email: 'admin@edamosbarbershop.com',
      password: 'password_hash_dummy_admin',
      role: Role.ADMIN,
    },
  });

  const adminEmployee = await prisma.employee.create({
    data: {
      userId: adminUser.id,
      name: 'Siti Rahma (Administrasi)',
      phone: '081234567802',
      role: Role.ADMIN,
      status: EmployeeStatus.ACTIVE,
      baseSalary: 2500000,
      commissionRate: 0,
      hiredAt: new Date('2022-03-01'),
    },
  });

  // 3 Kapster
  const kapster1User = await prisma.user.create({
    data: {
      username: 'kapster_rizky',
      email: 'rizky@edamosbarbershop.com',
      password: 'password_hash_dummy_kapster1',
      role: Role.KAPSTER,
    },
  });

  const kapster1 = await prisma.employee.create({
    data: {
      userId: kapster1User.id,
      name: 'Rizky Fauzan (Kapster 1)',
      phone: '081234567803',
      role: Role.KAPSTER,
      status: EmployeeStatus.ACTIVE,
      baseSalary: 0,
      commissionRate: 40, // 40% bagi hasil layanan
      hiredAt: new Date('2022-05-10'),
    },
  });

  const kapster2User = await prisma.user.create({
    data: {
      username: 'kapster_dimas',
      email: 'dimas@edamosbarbershop.com',
      password: 'password_hash_dummy_kapster2',
      role: Role.KAPSTER,
    },
  });

  const kapster2 = await prisma.employee.create({
    data: {
      userId: kapster2User.id,
      name: 'Dimas Pratama (Kapster 2)',
      phone: '081234567804',
      role: Role.KAPSTER,
      status: EmployeeStatus.ACTIVE,
      baseSalary: 0,
      commissionRate: 40,
      hiredAt: new Date('2023-02-15'),
    },
  });

  const kapster3User = await prisma.user.create({
    data: {
      username: 'kapster_yoga',
      email: 'yoga@edamosbarbershop.com',
      password: 'password_hash_dummy_kapster3',
      role: Role.KAPSTER,
    },
  });

  const kapster3 = await prisma.employee.create({
    data: {
      userId: kapster3User.id,
      name: 'Yoga Kurnia (Kapster 3)',
      phone: '081234567805',
      role: Role.KAPSTER,
      status: EmployeeStatus.ACTIVE,
      baseSalary: 0,
      commissionRate: 40,
      hiredAt: new Date('2023-08-01'),
    },
  });

  console.log('✓ Master Data Karyawan & Akun (1 Owner, 1 Admin, 3 Kapster) selesai dibuat');

  // ---------------------------------------------------------------------------
  // 2. MASTER LAYANAN (SERVICES)
  // [FAKTA LAPORAN]: Kategori layanan resmi Edamos Barbershop: potong rambut, hair design,
  //                  coloring, chemical service, dan perawatan rambut (Bab 3 Profil Objek).
  // [DATA DUMMY]: Estimasi durasi dan nominal tarif rupiah disimulasikan secara realistis.
  // ---------------------------------------------------------------------------
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Gentleman Regular Haircut',
        category: 'Haircut',
        price: 45000,
        durationMinutes: 30,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Premium Haircut & Wash',
        category: 'Haircut',
        price: 60000,
        durationMinutes: 45,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Hair Design & Fade Styling',
        category: 'Styling',
        price: 75000,
        durationMinutes: 45,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Hair Coloring / Pengecatan',
        category: 'Coloring',
        price: 120000,
        durationMinutes: 60,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Chemical Service / Perming',
        category: 'Chemical',
        price: 150000,
        durationMinutes: 90,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Hair Spa & Scalp Treatment',
        category: 'Treatment',
        price: 50000,
        durationMinutes: 30,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Cuci Rambut & Pijat Relaksasi',
        category: 'Perawatan',
        price: 25000,
        durationMinutes: 20,
        isActive: true,
      },
    }),
  ]);

  console.log(`✓ Master Layanan (${services.length} layanan) selesai dibuat`);

  // ---------------------------------------------------------------------------
  // 3. MASTER PELANGGAN (CUSTOMERS)
  // [DATA DUMMY]: Data nama pelanggan, nomor WhatsApp, dan catatan preferensi
  //               merupakan data tiruan (dummy) untuk simulasi reservasi.
  // ---------------------------------------------------------------------------
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Ahmad Santoso (Dummy)',
        phone: '085712340001',
        email: 'ahmad@example.com',
        notes: 'Pelanggan reguler gaya undercut',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Budi Setiawan (Dummy)',
        phone: '085712340002',
        email: 'budi@example.com',
        notes: 'Suka cuci rambut air hangat',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Candra Wijaya (Dummy)',
        phone: '085712340003',
        email: 'candra@example.com',
        notes: 'Pewarnaan ash grey',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Denny Pratama (Dummy)',
        phone: '085712340004',
        email: 'denny@example.com',
        notes: 'Hair design garis samping',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Eko Ramadhan (Dummy)',
        phone: '085712340005',
        email: 'eko@example.com',
        notes: 'Booking via WhatsApp',
      },
    }),
  ]);

  console.log(`✓ Master Pelanggan (${customers.length} pelanggan dummy) selesai dibuat`);

  // ---------------------------------------------------------------------------
  // 4. DATA TRANSAKSIONAL: BOOKING, KASIR, & KINERJA
  // [FAKTA LAPORAN]: Alur operasional WhatsApp booking -> verifikasi toko ->
  //                  layanan selesai -> bayar kasir harian -> pencatatan kinerja kapster.
  // [DATA DUMMY]: Sampel 5 transaksi reservasi dan nominal kasir untuk uji alur sistem.
  // ---------------------------------------------------------------------------
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Booking 1: Selesai & Dibayar (Ahmad -> Kapster 1, Gentleman Regular Haircut)
  const booking1 = await prisma.booking.create({
    data: {
      bookingCode: 'BKG-20261007-001',
      customerId: customers[0].id,
      kapsterId: kapster1.id,
      bookingDate: today,
      startTime: '10:00',
      endTime: '10:30',
      scheduledAt: new Date(today.getTime() + 10 * 3600000),
      status: BookingStatus.COMPLETED,
      completedAt: new Date(today.getTime() + 10.5 * 3600000),
      notes: 'Booking via WhatsApp',
      items: {
        create: [
          {
            serviceId: services[0].id,
            price: services[0].price,
          },
        ],
      },
    },
  });

  await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-20261007-001',
      bookingId: booking1.id,
      adminId: adminEmployee.id,
      customerName: customers[0].name,
      subtotal: 45000,
      discount: 0,
      totalAmount: 45000,
      paymentMethod: PaymentMethod.CASH,
      paymentStatus: PaymentStatus.PAID,
      paidAt: new Date(today.getTime() + 10.5 * 3600000),
      notes: 'Pembayaran tunai kasir harian',
    },
  });

  await prisma.performanceRecord.create({
    data: {
      employeeId: kapster1.id,
      bookingId: booking1.id,
      serviceDate: today,
      serviceName: services[0].name,
      serviceFee: 45000,
      commissionAmount: 18000, // 40% dari 45000
      notes: 'Layanan potong reguler selesai rapi',
    },
  });

  // Booking 2: Selesai & Dibayar (Budi -> Kapster 2, Premium Haircut & Wash)
  const booking2 = await prisma.booking.create({
    data: {
      bookingCode: 'BKG-20261007-002',
      customerId: customers[1].id,
      kapsterId: kapster2.id,
      bookingDate: today,
      startTime: '11:00',
      endTime: '11:45',
      scheduledAt: new Date(today.getTime() + 11 * 3600000),
      status: BookingStatus.COMPLETED,
      completedAt: new Date(today.getTime() + 11.75 * 3600000),
      notes: 'Selesai tepat waktu',
      items: {
        create: [
          {
            serviceId: services[1].id,
            price: services[1].price,
          },
        ],
      },
    },
  });

  await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-20261007-002',
      bookingId: booking2.id,
      adminId: adminEmployee.id,
      customerName: customers[1].name,
      subtotal: 60000,
      discount: 0,
      totalAmount: 60000,
      paymentMethod: PaymentMethod.QRIS,
      paymentStatus: PaymentStatus.PAID,
      paidAt: new Date(today.getTime() + 11.75 * 3600000),
      notes: 'Pembayaran QRIS scan kasir',
    },
  });

  await prisma.performanceRecord.create({
    data: {
      employeeId: kapster2.id,
      bookingId: booking2.id,
      serviceDate: today,
      serviceName: services[1].name,
      serviceFee: 60000,
      commissionAmount: 24000,
      notes: 'Premium Haircut & Wash',
    },
  });

  // Booking 3: Selesai & Dibayar (Candra -> Kapster 3, Hair Coloring)
  const booking3 = await prisma.booking.create({
    data: {
      bookingCode: 'BKG-20261007-003',
      customerId: customers[2].id,
      kapsterId: kapster3.id,
      bookingDate: today,
      startTime: '13:00',
      endTime: '14:00',
      scheduledAt: new Date(today.getTime() + 13 * 3600000),
      status: BookingStatus.COMPLETED,
      completedAt: new Date(today.getTime() + 14 * 3600000),
      notes: 'Pewarnaan rambut',
      items: {
        create: [
          {
            serviceId: services[3].id,
            price: services[3].price,
          },
        ],
      },
    },
  });

  await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-20261007-003',
      bookingId: booking3.id,
      adminId: adminEmployee.id,
      customerName: customers[2].name,
      subtotal: 120000,
      discount: 0,
      totalAmount: 120000,
      paymentMethod: PaymentMethod.TRANSFER,
      paymentStatus: PaymentStatus.PAID,
      paidAt: new Date(today.getTime() + 14 * 3600000),
      notes: 'Transfer Bank BCA',
    },
  });

  await prisma.performanceRecord.create({
    data: {
      employeeId: kapster3.id,
      bookingId: booking3.id,
      serviceDate: today,
      serviceName: services[3].name,
      serviceFee: 120000,
      commissionAmount: 48000,
      notes: 'Coloring service',
    },
  });

  // Booking 4: Terkonfirmasi (Denny -> Kapster 1, Hair Design & Fade, jam 15:00)
  await prisma.booking.create({
    data: {
      bookingCode: 'BKG-20261007-004',
      customerId: customers[3].id,
      kapsterId: kapster1.id,
      bookingDate: today,
      startTime: '15:00',
      endTime: '15:45',
      scheduledAt: new Date(today.getTime() + 15 * 3600000),
      status: BookingStatus.CONFIRMED,
      notes: 'Jadwal terkonfirmasi admin via WhatsApp',
      items: {
        create: [
          {
            serviceId: services[2].id,
            price: services[2].price,
          },
        ],
      },
    },
  });

  // Booking 5: Menunggu Konfirmasi (Eko -> Kapster 2, jam 16:30)
  await prisma.booking.create({
    data: {
      bookingCode: 'BKG-20261007-005',
      customerId: customers[4].id,
      kapsterId: kapster2.id,
      bookingDate: today,
      startTime: '16:30',
      endTime: '17:00',
      scheduledAt: new Date(today.getTime() + 16.5 * 3600000),
      status: BookingStatus.PENDING,
      notes: 'Menunggu konfirmasi admin',
      items: {
        create: [
          {
            serviceId: services[0].id,
            price: services[0].price,
          },
        ],
      },
    },
  });

  console.log('✓ Data Booking, Transaksi, & Kinerja Karyawan selesai dibuat');

  // ---------------------------------------------------------------------------
  // 5. BIAYA OPERASIONAL (OPERATIONAL EXPENSES)
  // [FAKTA LAPORAN]: Disebutkan eksplisit pada Bab 3 (baris 189) bahwa biaya operasional
  //                  seperti listrik, air, dan perlengkapan mengurangi omzet untuk
  //                  menghasilkan laba kotor sebelum alokasi gaji.
  // [DATA DUMMY]: Tanggal dan nominal rupiah operasional disimulasikan secara realistis.
  // ---------------------------------------------------------------------------
  await Promise.all([
    prisma.operationalExpense.create({
      data: {
        expenseName: 'Tagihan Listrik PLN Barbershop (September)',
        category: 'LISTRIK',
        amount: 450000,
        expenseDate: new Date('2026-09-28'),
        notes: 'Listrik operasional AC, lampu, clipper charger',
      },
    }),
    prisma.operationalExpense.create({
      data: {
        expenseName: 'Tagihan PDAM Air Bersih (September)',
        category: 'AIR',
        amount: 150000,
        expenseDate: new Date('2026-09-28'),
        notes: 'Air operasional cuci rambut',
      },
    }),
    prisma.operationalExpense.create({
      data: {
        expenseName: 'Restock Pomade, Shaving Cream & Mata Pisau',
        category: 'PERLENGKAPAN',
        amount: 600000,
        expenseDate: new Date('2026-09-15'),
        notes: 'Perlengkapan cukur bulanan',
      },
    }),
  ]);

  console.log('✓ Data Pengeluaran Operasional selesai dibuat');

  // ---------------------------------------------------------------------------
  // 6. DATA PENGGAJIAN & SLIP GAJI (PAYROLL)
  // [FAKTA LAPORAN]: Sesuai prosedur Bab 3 (baris 189-192):
  //                  1. Pemilik menghitung laba kotor = Omzet - Biaya Operasional.
  //                  2. Pemilik menentukan pool gaji = 50% dari laba kotor.
  //                  3. Pemilik menghitung gaji proporsional berdasarkan laporan kinerja.
  //                  4. Pemilik membuat slip gaji dan laporan total gaji karyawan.
  // [DATA DUMMY]: Sampel data omzet Rp 12.000.000, biaya Rp 1.200.000, laba kotor Rp 10.800.000,
  //               pool gaji Rp 5.400.000, dan 4 lembar slip gaji untuk pengujian fungsionalitas.
  // ---------------------------------------------------------------------------
  await prisma.payroll.create({
    data: {
      payrollPeriod: 'September 2026',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-30'),
      totalRevenue: 12000000,
      totalExpenses: 1200000,
      grossProfit: 10800000, // 12.000.000 - 1.200.000
      salaryPool: 5400000,   // 50% dari laba kotor
      totalNetPaid: 5400000,
      status: PayrollStatus.PAID,
      approvedAt: new Date('2026-10-01'),
      paidAt: new Date('2026-10-01'),
      notes: 'Penggajian periode September 2026 telah disetujui Pemilik',
      details: {
        create: [
          {
            employeeId: adminEmployee.id,
            slipNumber: 'SLIP-202609-001',
            employeeName: adminEmployee.name,
            employeeRole: Role.ADMIN,
            totalServicesServed: 85, // 85 transaksi dikelola
            baseSalary: 2500000,
            performanceCommission: 0,
            bonus: 200000,
            deductions: 0,
            netSalary: 2700000,
            paymentStatus: PaymentStatus.PAID,
            notes: 'Gaji pokok admin + bonus ketepatan pencatatan kas',
          },
          {
            employeeId: kapster1.id,
            slipNumber: 'SLIP-202609-002',
            employeeName: kapster1.name,
            employeeRole: Role.KAPSTER,
            totalServicesServed: 35,
            baseSalary: 0,
            performanceCommission: 950000,
            bonus: 50000,
            deductions: 0,
            netSalary: 1000000,
            paymentStatus: PaymentStatus.PAID,
            notes: 'Bagi hasil 35 pelanggan dilayani',
          },
          {
            employeeId: kapster2.id,
            slipNumber: 'SLIP-202609-003',
            employeeName: kapster2.name,
            employeeRole: Role.KAPSTER,
            totalServicesServed: 30,
            baseSalary: 0,
            performanceCommission: 850000,
            bonus: 50000,
            deductions: 0,
            netSalary: 900000,
            paymentStatus: PaymentStatus.PAID,
            notes: 'Bagi hasil 30 pelanggan dilayani',
          },
          {
            employeeId: kapster3.id,
            slipNumber: 'SLIP-202609-004',
            employeeName: kapster3.name,
            employeeRole: Role.KAPSTER,
            totalServicesServed: 28,
            baseSalary: 0,
            performanceCommission: 750000,
            bonus: 50000,
            deductions: 0,
            netSalary: 800000,
            paymentStatus: PaymentStatus.PAID,
            notes: 'Bagi hasil 28 pelanggan dilayani',
          },
        ],
      },
    },
  });

  console.log('✓ Rekap Penggajian & 4 Slip Gaji (Admin + 3 Kapster) selesai dibuat');
  console.log('=== Database Seeding Edamos Barbershop Sukses! ===');
}

main()
  .catch((e) => {
    console.error('Error saat seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
