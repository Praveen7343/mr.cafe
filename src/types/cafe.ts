export type MenuCategory =
  | 'all'
  | 'fried-chicken'
  | 'burgers'
  | 'pizza'
  | 'sandwiches'
  | 'wraps'
  | 'momos'
  | 'maggi'
  | 'sides'
  | 'desserts'
  | 'coffee-drinks';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'all'>;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  isActive: boolean;
  isPopular?: boolean;
  ordersCount: number;
  dietary?: 'veg' | 'non-veg';
  prepTime?: string;
  rating?: number;
  variant?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Completed' | 'Cancelled';

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: {
    item: MenuItem;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  serviceFee: number;
  total: number;
  pointsEarned: number;
  status: OrderStatus;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
  timeFormatted: string;
  paymentMethod: 'UPI' | 'Card' | 'Cash';
  paymentStatus: 'Paid' | 'Pending';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'owner' | 'staff';
  avatar?: string;
  loyaltyPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  tierLevel: number;
  phone?: string;
  memberSince?: string;
  addresses?: {
    id: string;
    label: string;
    address: string;
    isDefault: boolean;
  }[];
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrder: number;
  description: string;
  isActive: boolean;
}

export interface SalesDayData {
  day: string;
  thisWeek: number;
  lastWeek: number;
}
