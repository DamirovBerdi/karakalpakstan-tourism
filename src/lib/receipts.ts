export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PlatformReceipt {
  id: string;
  receiptNumber: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  serviceType: 'taxi' | 'hotel' | 'aral_tour' | 'guide_booking' | 'custom_request';
  serviceTitle: string;
  providerType: 'Agency' | 'Guide' | 'Hotel' | 'Driver' | 'Platform';
  providerName: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  paymentMethod: 'Credit Card' | 'Cash' | 'Click / Payme' | 'Bank Transfer';
  status: 'paid' | 'pending' | 'completed' | 'refunded';
  createdAt: string;
  notes?: string;
}

export function generateSampleReceipts(): PlatformReceipt[] {
  const now = new Date();
  return [
    {
      id: 'rec-1001',
      receiptNumber: 'REC-2026-8941',
      userName: 'Elena Rostova',
      userPhone: '+491512345678',
      userEmail: 'elena.rostova@gmail.com',
      serviceType: 'aral_tour',
      serviceTitle: '2-Day Aral Sea & Moynaq Jeep Expedition',
      providerType: 'Agency',
      providerName: 'Aral Sea Discovery Tours',
      items: [
        { name: '4x4 Offroad SUV Rental & Fuel (2 Days)', quantity: 1, unitPrice: 280, total: 280 },
        { name: 'Yurt Camp Accommodation & Dinner', quantity: 2, unitPrice: 40, total: 80 },
        { name: 'English Speaking Guide Fee', quantity: 2, unitPrice: 45, total: 90 },
      ],
      subtotal: 450,
      tax: 0,
      totalAmount: 450,
      commissionRate: 10,
      commissionAmount: 45,
      paymentMethod: 'Credit Card',
      status: 'completed',
      createdAt: new Date(now.getTime() - 86400000 * 1.5).toISOString(),
      notes: 'Pickup from Pana Hotel Nukus at 08:00 AM',
    },
    {
      id: 'rec-1002',
      receiptNumber: 'REC-2026-8942',
      userName: 'Markus Weber',
      userPhone: '+41791234567',
      userEmail: 'm.weber@swiss-travel.ch',
      serviceType: 'hotel',
      serviceTitle: 'Jipek Joli Hotel — Deluxe Room (3 Nights)',
      providerType: 'Hotel',
      providerName: 'Jipek Joli Hotel Nukus',
      items: [
        { name: 'Deluxe Double Room (Nightly Rate)', quantity: 3, unitPrice: 55, total: 165 },
        { name: 'Traditional Karakalpak Breakfast', quantity: 3, unitPrice: 0, total: 0 },
      ],
      subtotal: 165,
      tax: 0,
      totalAmount: 165,
      commissionRate: 12,
      commissionAmount: 19.8,
      paymentMethod: 'Click / Payme',
      status: 'paid',
      createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
    },
    {
      id: 'rec-1003',
      receiptNumber: 'REC-2026-8943',
      userName: 'Алишер Каримов',
      userPhone: '+998901234567',
      userEmail: 'alisher.karimov@mail.ru',
      serviceType: 'guide_booking',
      serviceTitle: 'Personal Guided Tour — Savitsky Museum & Mizdakhan',
      providerType: 'Guide',
      providerName: 'Аманбай Оразбаев (Certified Guide)',
      items: [
        { name: 'Full-Day Historical Guide Services', quantity: 1, unitPrice: 45, total: 45 },
        { name: 'Savitsky Museum Entry Ticket Assistance', quantity: 1, unitPrice: 10, total: 10 },
      ],
      subtotal: 55,
      tax: 0,
      totalAmount: 55,
      commissionRate: 10,
      commissionAmount: 5.5,
      paymentMethod: 'Cash',
      status: 'completed',
      createdAt: new Date(now.getTime() - 86400000 * 0.5).toISOString(),
    },
    {
      id: 'rec-1004',
      receiptNumber: 'REC-2026-8944',
      userName: 'Sophie Laurent',
      userPhone: '+33612345678',
      userEmail: 'sophie.laurent@free.fr',
      serviceType: 'taxi',
      serviceTitle: '1222 Express Intercity Taxi — Nukus to Moynaq',
      providerType: 'Driver',
      providerName: 'Express Taxi #1222 (Nukus Hub)',
      items: [
        { name: 'Private Sedan Transfer (Nukus → Moynaq)', quantity: 1, unitPrice: 40, total: 40 },
        { name: 'Luggage Storage & Return Transfer', quantity: 1, unitPrice: 35, total: 35 },
      ],
      subtotal: 75,
      tax: 0,
      totalAmount: 75,
      commissionRate: 8,
      commissionAmount: 6,
      paymentMethod: 'Credit Card',
      status: 'paid',
      createdAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
    },
  ];
}
