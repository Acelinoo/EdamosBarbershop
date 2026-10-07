import { Role, BookingStatus, PaymentMethod, PaymentStatus, PayrollStatus } from '@prisma/client';

export type UserRole = Role;
export type AppBookingStatus = BookingStatus;
export type AppPaymentMethod = PaymentMethod;
export type AppPaymentStatus = PaymentStatus;
export type AppPayrollStatus = PayrollStatus;

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  description?: string;
}

export interface DashboardMetric {
  title: string;
  value: string;
  subtext: string;
  change?: string;
  isPositive?: boolean;
}

export interface BookingSummaryItem {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  kapsterName: string;
  timeSlot: string;
  status: BookingStatus;
  totalPrice: number;
}
