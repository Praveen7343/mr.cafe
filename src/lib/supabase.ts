import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MenuItem, Order, OrderStatus, Coupon, UserProfile } from '../types/cafe';
import { INITIAL_MENU_ITEMS } from '../data/initialData';

let cachedClient: SupabaseClient | null = null;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getStoredSupabaseConfig = (): SupabaseConfig => {
  const url =
    import.meta.env.VITE_SUPABASE_URL ||
    localStorage.getItem('bnb_supabase_url') ||
    '';
  const anonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    localStorage.getItem('bnb_supabase_anon_key') ||
    '';
  return { url, anonKey };
};

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (!url || !anonKey) {
    return null;
  }
  if (!cachedClient) {
    try {
      cachedClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.error('Failed to create Supabase client:', err);
      return null;
    }
  }
  return cachedClient;
};

export const saveSupabaseConfig = (url: string, anonKey: string): boolean => {
  try {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();

    if (trimmedUrl) {
      localStorage.setItem('bnb_supabase_url', trimmedUrl);
    } else {
      localStorage.removeItem('bnb_supabase_url');
    }

    if (trimmedKey) {
      localStorage.setItem('bnb_supabase_anon_key', trimmedKey);
    } else {
      localStorage.removeItem('bnb_supabase_anon_key');
    }

    // Reset cached client
    cachedClient = null;
    if (trimmedUrl && trimmedKey) {
      cachedClient = createClient(trimmedUrl, trimmedKey);
    }
    return true;
  } catch (e) {
    console.error('Error saving Supabase config:', e);
    return false;
  }
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getStoredSupabaseConfig();
  return Boolean(url && anonKey);
};

export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL or Anon Key is missing. Please enter your credentials.',
    };
  }

  try {
    const { data, error } = await client.from('menu_items').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "menu_items" does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! Run the provided SQL script to create the tables.',
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully connected to Supabase database!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Connection failed' };
  }
};

// ==========================================
// MENU ITEMS CRUD (Directly with Supabase)
// ==========================================

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('price', { ascending: true });

    if (error || !data) {
      console.warn('Error fetching menu_items from Supabase:', error);
      return [];
    }

    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      price: Number(d.price),
      description: d.description || '',
      image: d.image || 'cappuccino',
      inStock: Boolean(d.in_stock),
      isActive: Boolean(d.is_active),
      isPopular: Boolean(d.is_popular),
      ordersCount: Number(d.orders_count || 0),
      dietary: d.dietary,
      variant: d.variant,
      prepTime: d.prep_time || '8 mins',
      rating: Number(d.rating || 4.8),
    }));
  } catch (err) {
    console.error('fetchMenuItems exception:', err);
    return [];
  }
};

export const createMenuItemInSupabase = async (
  item: Omit<MenuItem, 'id' | 'ordersCount'>
): Promise<MenuItem | null> => {
  const client = getSupabaseClient();
  const newId = `item-${Date.now()}`;
  const record = {
    id: newId,
    name: item.name,
    category: item.category,
    price: item.price,
    description: item.description,
    image: item.image,
    in_stock: item.inStock,
    is_active: item.isActive,
    is_popular: Boolean(item.isPopular),
    orders_count: 0,
    dietary: item.dietary,
    variant: item.variant,
    prep_time: item.prepTime,
    rating: item.rating || 4.8,
  };

  if (!client) {
    return { ...item, id: newId, ordersCount: 0 };
  }

  try {
    const { error } = await client.from('menu_items').insert([record]);
    if (error) {
      console.warn('createMenuItem error in Supabase:', error.message || error);
    }
    return {
      ...item,
      id: newId,
      ordersCount: 0,
    };
  } catch (err) {
    console.warn('createMenuItem exception in Supabase:', err);
    return { ...item, id: newId, ordersCount: 0 };
  }
};

export const updateMenuItemInSupabase = async (item: MenuItem): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const { error } = await client
      .from('menu_items')
      .update({
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        image: item.image,
        in_stock: item.inStock,
        is_active: item.isActive,
        is_popular: Boolean(item.isPopular),
        dietary: item.dietary,
        variant: item.variant,
        prep_time: item.prepTime,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    return !error;
  } catch (err) {
    console.error('updateMenuItem error in Supabase:', err);
    return false;
  }
};

export const updateItemPriceInSupabase = async (id: string, price: number): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const { error } = await client
      .from('menu_items')
      .update({ price, updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  } catch (err) {
    console.error('updateItemPrice error:', err);
    return false;
  }
};

export const bulkUpdatePricesInSupabase = async (
  updates: { id: string; price: number }[]
): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    // Process updates in parallel
    await Promise.all(
      updates.map((u) =>
        client
          .from('menu_items')
          .update({ price: u.price, updated_at: new Date().toISOString() })
          .eq('id', u.id)
      )
    );
    return true;
  } catch (err) {
    console.error('bulkUpdatePricesInSupabase error:', err);
    return false;
  }
};

export const deleteMenuItemInSupabase = async (id: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const { error } = await client.from('menu_items').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('deleteMenuItem error:', err);
    return false;
  }
};

// ==========================================
// ORDERS CRUD (Directly with Supabase)
// ==========================================

export const fetchOrdersFromSupabase = async (): Promise<Order[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Error fetching orders from Supabase:', error);
      return [];
    }

    return data.map((d: any) => ({
      id: d.id,
      customerName: d.customer_name,
      customerEmail: d.customer_email || '',
      customerPhone: d.customer_phone || '',
      items: Array.isArray(d.items) ? d.items : [],
      subtotal: Number(d.subtotal),
      discount: Number(d.discount || 0),
      couponCode: d.coupon_code,
      serviceFee: Number(d.service_fee || 0),
      total: Number(d.total),
      pointsEarned: Number(d.points_earned || 0),
      status: d.status as OrderStatus,
      orderType: d.order_type,
      tableNumber: d.table_number,
      deliveryAddress: d.delivery_address,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
      timeFormatted: d.time_formatted || new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: d.payment_method,
      paymentStatus: d.payment_status,
    }));
  } catch (err) {
    console.error('fetchOrders exception:', err);
    return [];
  }
};

export const createOrderInSupabase = async (order: Order): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const { error } = await client.from('orders').insert([
      {
        id: order.id,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        coupon_code: order.couponCode,
        service_fee: order.serviceFee,
        total: order.total,
        points_earned: order.pointsEarned,
        status: order.status,
        order_type: order.orderType,
        table_number: order.tableNumber,
        delivery_address: order.deliveryAddress,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
        time_formatted: order.timeFormatted,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
      },
    ]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('createOrderInSupabase error:', err);
    return false;
  }
};

export const updateOrderStatusInSupabase = async (
  orderId: string,
  status: OrderStatus
): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const { error } = await client
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    return !error;
  } catch (err) {
    console.error('updateOrderStatusInSupabase error:', err);
    return false;
  }
};

// ==========================================
// COUPONS CRUD (Directly with Supabase)
// ==========================================

export const fetchCouponsFromSupabase = async (): Promise<Coupon[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client.from('coupons').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];

    return data.map((c: any) => ({
      id: c.id,
      code: c.code,
      discountPercent: c.discount_percent ? Number(c.discount_percent) : undefined,
      discountAmount: c.discount_amount ? Number(c.discount_amount) : undefined,
      minOrder: Number(c.min_order || 0),
      description: c.description || '',
      isActive: Boolean(c.is_active),
    }));
  } catch (err) {
    return [];
  }
};

export const createCouponInSupabase = async (coupon: Coupon): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const { error } = await client.from('coupons').insert([
      {
        id: coupon.id,
        code: coupon.code,
        discount_percent: coupon.discountPercent,
        discount_amount: coupon.discountAmount,
        min_order: coupon.minOrder,
        description: coupon.description,
        is_active: coupon.isActive,
      },
    ]);
    return !error;
  } catch (err) {
    return false;
  }
};

// ==========================================
// PROFILES & CUSTOMERS (Directly with Supabase)
// ==========================================

export const fetchProfilesFromSupabase = async (): Promise<UserProfile[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client.from('profiles').select('*');
    if (error || !data) return [];

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      avatar: p.avatar,
      loyaltyPoints: Number(p.loyalty_points || 0),
      tier: p.tier,
      tierLevel: Number(p.tier_level || 1),
      phone: p.phone,
      memberSince: p.member_since,
      addresses: Array.isArray(p.addresses) ? p.addresses : [],
    }));
  } catch (err) {
    return [];
  }
};

export const updateProfileInSupabase = async (profile: Partial<UserProfile> & { id: string }) => {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client
      .from('profiles')
      .update({
        name: profile.name,
        loyalty_points: profile.loyaltyPoints,
        tier: profile.tier,
        tier_level: profile.tierLevel,
        phone: profile.phone,
        addresses: profile.addresses,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);
  } catch (err) {
    console.error('updateProfile error:', err);
  }
};

// ==========================================
// SYNC MENU ITEMS TO SUPABASE
// ==========================================

export const syncMenuItemsToSupabase = async (
  items: MenuItem[]
): Promise<{ success: boolean; count: number; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, count: 0, error: 'Supabase client not initialized. Please enter URL and Anon Key.' };
  }

  try {
    const records = items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      image: item.image || 'cappuccino',
      in_stock: Boolean(item.inStock),
      is_active: item.isActive !== false,
      is_popular: Boolean(item.isPopular),
      orders_count: item.ordersCount || 0,
      dietary: item.dietary || null,
      variant: item.variant || null,
      prep_time: item.prepTime || '8 mins',
      rating: item.rating || 4.8,
      updated_at: new Date().toISOString(),
    }));

    // Upsert in batches of 25 to avoid any payload limits
    const chunkSize = 25;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const { error } = await client.from('menu_items').upsert(chunk, { onConflict: 'id' });
      if (error) throw error;
    }

    return { success: true, count: records.length };
  } catch (err: any) {
    console.error('syncMenuItemsToSupabase error:', err);
    return { success: false, count: 0, error: err.message || 'Failed to sync menu items' };
  }
};

const formatMenuItemsForSql = (items: MenuItem[]): string => {
  return items
    .map((item) => {
      const safeDesc = (item.description || '').replace(/'/g, "''");
      const safeName = item.name.replace(/'/g, "''");
      const safeVariant = item.variant ? `'${item.variant.replace(/'/g, "''")}'` : 'NULL';
      const safeDietary = item.dietary ? `'${item.dietary}'` : 'NULL';
      return `('${item.id}', '${safeName}', '${item.category}', ${item.price}, '${safeDesc}', '${item.image}', ${Boolean(item.inStock)}, ${item.isActive !== false}, ${Boolean(item.isPopular)}, ${item.ordersCount || 0}, ${safeDietary}, ${safeVariant}, '${item.prepTime || '8 mins'}', ${item.rating || 4.8})`;
    })
    .join(',\\n');
};

export const SUPABASE_SQL_SETUP_SCRIPT = `-- ==============================================================================
-- BREW & BITE / Mr. CAFE - SUPABASE DATABASE SCHEMA & SEED DATA
-- Copy and run this in your Supabase SQL Editor:
-- ==============================================================================

-- 1. CREATE MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  image TEXT NOT NULL DEFAULT 'cappuccino',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  orders_count INTEGER NOT NULL DEFAULT 0,
  dietary TEXT CHECK (dietary IN ('veg', 'non-veg')),
  variant TEXT,
  prep_time TEXT DEFAULT '8 mins',
  rating NUMERIC(3,2) DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  coupon_code TEXT,
  service_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Preparing', 'Ready', 'Delivered', 'Completed', 'Cancelled')),
  order_type TEXT NOT NULL DEFAULT 'dine-in' CHECK (order_type IN ('dine-in', 'takeaway', 'delivery')),
  table_number TEXT,
  delivery_address TEXT,
  payment_method TEXT NOT NULL DEFAULT 'UPI' CHECK (payment_method IN ('UPI', 'Card', 'Cash')),
  payment_status TEXT NOT NULL DEFAULT 'Paid' CHECK (payment_status IN ('Paid', 'Pending')),
  time_formatted TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER,
  discount_amount NUMERIC(10,2),
  min_order NUMERIC(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE PROFILES TABLE (Customers & Staff)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'owner', 'staff')),
  avatar TEXT,
  loyalty_points INTEGER NOT NULL DEFAULT 100,
  tier TEXT NOT NULL DEFAULT 'Bronze',
  tier_level INTEGER NOT NULL DEFAULT 1,
  phone TEXT,
  addresses JSONB DEFAULT '[]'::jsonb,
  member_since TEXT DEFAULT 'October 2026',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GRANT SCHEMA & TABLE PRIVILEGES TO ANON AND AUTHENTICATED ROLES
-- (This resolves Postgres Error 42501 "permission denied for table ...")
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 6. ENABLE ROW LEVEL SECURITY & PUBLIC ACCESS POLICIES
ALTER TABLE IF EXISTS public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public full access to menu_items" ON public.menu_items;
CREATE POLICY "Public full access to menu_items" ON public.menu_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to orders" ON public.orders;
CREATE POLICY "Public full access to orders" ON public.orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to coupons" ON public.coupons;
CREATE POLICY "Public full access to coupons" ON public.coupons FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to profiles" ON public.profiles;
CREATE POLICY "Public full access to profiles" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 7. ENABLE REALTIME BROADCAST
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;

-- 8. SEED PROMO COUPONS
INSERT INTO coupons (id, code, discount_percent, min_order, description, is_active)
VALUES
('c1', 'BREW10', 10, 200, '10% OFF on all orders above ₹200', true),
('c2', 'WELCOME50', NULL, 250, 'Flat ₹50 OFF on orders above ₹250', true),
('c3', 'CRISPY20', 20, 400, '20% OFF on Fried Chicken & Pizza combos', true)
ON CONFLICT (code) DO NOTHING;

-- 8. SEED DEFAULT PROFILES
INSERT INTO profiles (id, name, email, role, loyalty_points, tier, tier_level, phone, member_since)
VALUES
('user-bhanu-cust', 'Bhanu Prakash', 'bhanu@gmail.com', 'customer', 1250, 'Gold', 3, '+91 98450 12345', 'March 2024'),
('user-bhanu-owner', 'Bhanu Prakash', 'manager@mrcafe.com', 'owner', 2480, 'Platinum', 4, '+91 98450 12345', 'January 2023')
ON CONFLICT (id) DO NOTHING;

-- 9. SEED ALL CAFE MENU ITEMS (74 Items with Prices, Categories, Descriptions)
INSERT INTO menu_items (
  id, name, category, price, description, image, in_stock, is_active, is_popular, orders_count, dietary, variant, prep_time, rating
) VALUES
${formatMenuItemsForSql(INITIAL_MENU_ITEMS)}
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  in_stock = EXCLUDED.in_stock,
  is_active = EXCLUDED.is_active;
`;

export const SUPABASE_FIX_PERMISSIONS_SQL = `-- ==============================================================================
-- QUICK FIX: GRANT PERMISSIONS TO ANON & AUTHENTICATED ROLES (Error 42501 Fix)
-- Copy and run this in your Supabase SQL Editor:
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Ensure Row Level Security allows full anon access
ALTER TABLE IF EXISTS public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public full access to menu_items" ON public.menu_items;
CREATE POLICY "Public full access to menu_items" ON public.menu_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to orders" ON public.orders;
CREATE POLICY "Public full access to orders" ON public.orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to coupons" ON public.coupons;
CREATE POLICY "Public full access to coupons" ON public.coupons FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to profiles" ON public.profiles;
CREATE POLICY "Public full access to profiles" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
`;
