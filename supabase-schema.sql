-- ==============================================================================
-- BREW & BITE / Mr. CAFE - SUPABASE DATABASE SCHEMA & SEED DATA
-- Run this complete script in your Supabase Project: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. DROP OLD TABLES (IF RECREATING)
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS menu_items CASCADE;
-- DROP TABLE IF EXISTS coupons CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP TABLE IF EXISTS cafe_settings CASCADE;

-- 2. CREATE MENU ITEMS TABLE
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

-- 3. CREATE ORDERS TABLE
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

-- 4. CREATE COUPONS TABLE
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

-- 5. CREATE PROFILES TABLE (Customers & Staff)
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

-- 6. CREATE CAFE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS cafe_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  cafe_name TEXT NOT NULL DEFAULT 'Mr. CAFE (Brew & Bite)',
  tagline TEXT DEFAULT 'Love At First Bite...!',
  upi_id TEXT DEFAULT 'mrcafe@upi',
  opening_time TEXT DEFAULT '08:00 AM',
  closing_time TEXT DEFAULT '11:00 PM',
  table_count INTEGER DEFAULT 12,
  sound_alerts BOOLEAN DEFAULT true,
  auto_accept_orders BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC POLICIES
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access to menu_items" ON menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to coupons" ON coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to cafe_settings" ON cafe_settings FOR ALL USING (true) WITH CHECK (true);

-- 8. ENABLE REALTIME BROADCAST FOR ORDERS AND MENU UPDATES
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;

-- ==============================================================================
-- 9. SEED ALL 70+ MENU ITEMS DIRECTLY INTO SUPABASE
-- ==============================================================================

INSERT INTO menu_items (id, name, category, price, description, image, in_stock, is_active, is_popular, dietary, variant, prep_time, rating)
VALUES
-- --- FRIED CHICKEN (Menu Page 1) ---
('fc-wings-4', 'Crispy Hot Wings (4 Pcs)', 'fried-chicken', 100, 'Crunchy, juicy, crispy, spicy & salty chicken hot wings', 'wings', true, true, true, 'non-veg', '4 Pcs', '8 mins', 4.90),
('fc-wings-6', 'Crispy Hot Wings (6 Pcs)', 'fried-chicken', 140, 'Crunchy, juicy, crispy, spicy & salty chicken wings', 'wings', true, true, false, 'non-veg', '6 Pcs', '10 mins', 4.80),
('fc-wings-8', 'Crispy Hot Wings (8 Pcs)', 'fried-chicken', 190, 'Party pack of 8 spicy crispy fried hot wings', 'wings', true, true, false, 'non-veg', '8 Pcs', '12 mins', 4.80),
('fc-wings-15', 'Crispy Hot Wings (15 Pcs)', 'fried-chicken', 350, 'Jumbo bucket of 15 signature hot wings', 'wings', true, true, false, 'non-veg', '15 Pcs', '15 mins', 4.90),
('fc-lollipops-4', 'Crispy Chicken Lollipops (4 Pcs)', 'fried-chicken', 120, 'Made from fresh chicken (never frozen) with savory glaze', 'lollipop', true, true, true, 'non-veg', '4 Pcs', '10 mins', 4.90),
('fc-lollipops-6', 'Crispy Chicken Lollipops (6 Pcs)', 'fried-chicken', 180, 'Fresh succulent chicken lollipops fried golden crisp', 'lollipop', true, true, false, 'non-veg', '6 Pcs', '12 mins', 4.80),
('fc-lollipops-8', 'Crispy Chicken Lollipops (8 Pcs)', 'fried-chicken', 230, '8 pcs crunchy fried drumette lollipops', 'lollipop', true, true, false, 'non-veg', '8 Pcs', '14 mins', 4.80),
('fc-lollipops-10', 'Crispy Chicken Lollipops (10 Pcs)', 'fried-chicken', 280, 'Family treat box of 10 golden chicken lollipops', 'lollipop', true, true, false, 'non-veg', '10 Pcs', '15 mins', 4.90),
('fc-big-2', 'Crispy Big Fried Chicken (2 Pcs)', 'fried-chicken', 180, 'Classic oversized fried chicken pieces with secret spice crust', 'fried-chicken', true, true, false, 'non-veg', '2 Pcs', '10 mins', 4.80),
('fc-big-4', 'Crispy Big Fried Chicken (4 Pcs)', 'fried-chicken', 350, '4 oversized crispy fried chicken pieces with dip', 'fried-chicken', true, true, false, 'non-veg', '4 Pcs', '12 mins', 4.90),
('fc-big-6', 'Crispy Big Fried Chicken (6 Pcs)', 'fried-chicken', 520, 'Mega bucket of 6 large crispy fried chicken pieces', 'fried-chicken', true, true, false, 'non-veg', '6 Pcs', '15 mins', 4.90),
('fc-strips-4', 'Crispy Boneless Strips (4 Pcs)', 'fried-chicken', 160, 'Tender 100% chicken breast strips in crunchy crumb batter', 'strips', true, true, false, 'non-veg', '4 Pcs', '8 mins', 4.70),
('fc-strips-6', 'Crispy Boneless Strips (6 Pcs)', 'fried-chicken', 220, '6 tender boneless chicken strips with signature dip', 'strips', true, true, false, 'non-veg', '6 Pcs', '10 mins', 4.80),
('fc-strips-8', 'Crispy Boneless Strips (8 Pcs)', 'fried-chicken', 280, '8 boneless crispy strips perfect for sharing', 'strips', true, true, false, 'non-veg', '8 Pcs', '12 mins', 4.80),
('fc-popcorn-reg', 'Crispy Chicken Popcorn (Regular)', 'fried-chicken', 120, 'Bite-sized crunchy chicken nuggets seasoned with peri-peri', 'popcorn', true, true, true, 'non-veg', 'Regular', '6 mins', 4.90),
('fc-popcorn-med', 'Crispy Chicken Popcorn (Medium)', 'fried-chicken', 220, 'Medium bucket of bite-sized crispy chicken popcorn', 'popcorn', true, true, false, 'non-veg', 'Medium', '8 mins', 4.80),
('fc-popcorn-fam', 'Crispy Chicken Popcorn (Family)', 'fried-chicken', 480, 'Giant family tub of crunchy chicken popcorn', 'popcorn', true, true, false, 'non-veg', 'Family', '12 mins', 4.90),

-- --- BURGERS (Menu Page 2) ---
('b-veg', 'Veg Burger', 'burgers', 100, 'Crispy mixed veg patty with lettuce, tomatoes and mayo', 'burger', true, true, false, 'veg', NULL, '8 mins', 4.60),
('b-aaloo-tikki', 'Aaloo Tikki Burger', 'burgers', 100, 'Spiced golden potato patty with tangy mint mayo & onions', 'burger', true, true, false, 'veg', NULL, '7 mins', 4.70),
('b-veg-cheese', 'Veg Cheese Burger', 'burgers', 120, 'Veg patty topped with melted cheddar cheese slice', 'burger', true, true, false, 'veg', NULL, '8 mins', 4.80),
('b-veg-tandoori', 'Veg Tandoori Burger', 'burgers', 140, 'Smoky tandoori sauce with grilled veggie patty & pickles', 'burger', true, true, false, 'veg', NULL, '9 mins', 4.60),
('b-double-decker', 'Double Decker Burger (Veg)', 'burgers', 170, 'Two crispy patties stacked high with double sauces', 'burger', true, true, false, 'veg', NULL, '10 mins', 4.80),
('b-paneer', 'Paneer Burger', 'burgers', 170, 'Crispy fried cottage cheese paneer block with herb dressing', 'burger', true, true, true, 'veg', NULL, '9 mins', 4.80),
('b-paneer-cheese', 'Paneer Cheese Burger', 'burgers', 190, 'Crispy paneer steak loaded with melting cheese slice', 'burger', true, true, false, 'veg', NULL, '10 mins', 4.90),
('b-chicken', 'Chicken Burger', 'burgers', 120, 'Classic grilled minced chicken patty with fresh coleslaw', 'burger', true, true, false, 'non-veg', NULL, '8 mins', 4.70),
('b-chicken-cheese', 'Chicken Cheese Burger', 'burgers', 140, 'Chicken patty blanketed in melted golden cheese', 'burger', true, true, false, 'non-veg', NULL, '8 mins', 4.80),
('b-zinger', 'Zinger Burger', 'burgers', 160, 'Signature extra crunchy chicken breast fillet with spicy dressing', 'burger', true, true, true, 'non-veg', NULL, '10 mins', 4.90),
('b-crispy-tandoori', 'Crispy Tandoori Burger (Chicken)', 'burgers', 180, 'Crunchy chicken with spicy tandoori marinade glaze', 'burger', true, true, false, 'non-veg', NULL, '10 mins', 4.80),
('b-crispy-double-decker', 'Crispy Double Decker Burger (Chicken)', 'burgers', 190, 'Two massive crunchy chicken fillets layered with special sauce', 'burger', true, true, false, 'non-veg', NULL, '12 mins', 4.90),
('b-crispy-double-cheese', 'Crispy Double Decker Cheese Burger', 'burgers', 210, 'Double crunchy chicken fillets with double cheddar cheese slices', 'burger', true, true, false, 'non-veg', NULL, '12 mins', 4.90),

-- --- SANDWICHES (Menu Page 2) ---
('sw-veg', 'Veg Sandwich', 'sandwiches', 120, 'Layered fresh cucumber, tomato, potato and spicy mint chutney', 'sandwich', true, true, false, 'veg', NULL, '7 mins', 4.60),
('sw-veg-cheese', 'Veg Cheese Sandwich', 'sandwiches', 140, 'Toasted butter bread stuffed with garden veggies and mozzarella', 'sandwich', true, true, false, 'veg', NULL, '8 mins', 4.70),
('sw-veg-tandoori', 'Veg Tandoori Sandwich', 'sandwiches', 140, 'Smoky grilled vegetables with tandoori mayo in toasted sourdough', 'sandwich', true, true, false, 'veg', NULL, '8 mins', 4.60),
('sw-paneer', 'Paneer Sandwich', 'sandwiches', 160, 'Spiced cottage cheese cubes grilled with bell peppers and cheese', 'sandwich', true, true, true, 'veg', NULL, '8 mins', 4.80),
('sw-chicken', 'Chicken Sandwich', 'sandwiches', 130, 'Shredded roasted chicken in creamy black pepper mayo', 'sandwich', true, true, false, 'non-veg', NULL, '8 mins', 4.70),
('sw-chicken-cheese', 'Chicken Cheese Sandwich', 'sandwiches', 140, 'Tender chicken and molten cheese grilled crisp', 'sandwich', true, true, false, 'non-veg', NULL, '8 mins', 4.80),
('sw-crispy-chicken', 'Crispy Chicken Sandwich', 'sandwiches', 160, 'Golden fried chicken tenders layered in toasted bread', 'sandwich', true, true, false, 'non-veg', NULL, '10 mins', 4.80),
('sw-crispy-tandoori', 'Crispy Tandoori Sandwich (Chicken)', 'sandwiches', 170, 'Crunchy chicken with spicy roasted tandoori dressing', 'sandwich', true, true, false, 'non-veg', NULL, '10 mins', 4.80),

-- --- WRAPS (Menu Page 2) ---
('wr-mixed-veg', 'Mixed Veg Wrap', 'wraps', 120, 'Crisp tortilla rolled with spiced vegetable filling and crunchy greens', 'wrap', true, true, false, 'veg', NULL, '7 mins', 4.50),
('wr-crispy-corn', 'Crispy Corn Wrap', 'wraps', 130, 'Golden fried sweet corn kernels with tangy sauce inside warm wrap', 'wrap', true, true, false, 'veg', NULL, '7 mins', 4.60),
('wr-paneer', 'Paneer Wrap', 'wraps', 150, 'Tender paneer tikka chunks wrapped with mint dressing', 'wrap', true, true, false, 'veg', NULL, '8 mins', 4.80),
('wr-crispy-chicken', 'Crispy Chicken Wrap', 'wraps', 130, 'Crunchy boneless chicken strips with garlic mayo & crisp lettuce', 'wrap', true, true, true, 'non-veg', NULL, '8 mins', 4.90),
('wr-crispy-double-chicken', 'Crispy Double Chicken Wrap', 'wraps', 160, 'Loaded with double portion of crunchy fried chicken strips', 'wrap', true, true, false, 'non-veg', NULL, '10 mins', 4.90),
('wr-crispy-prawn', 'Crispy Prawn Wrap', 'wraps', 180, 'Golden fried tempura prawns wrapped with thousand island drizzle', 'wrap', true, true, false, 'non-veg', NULL, '10 mins', 4.80),

-- --- PIZZA (Menu Page 3) ---
('pz-veg-onion', 'Veg Onion Pizza', 'pizza', 160, 'Crisp red onions on classic tomato herb sauce with mozzarella', 'pizza', true, true, false, 'veg', NULL, '12 mins', 4.60),
('pz-veg-margherita', 'Veg Margherita Pizza', 'pizza', 180, 'Fresh basil, Italian tomatoes and 100% mozzarella cheese', 'pizza', true, true, true, 'veg', NULL, '12 mins', 4.80),
('pz-veg-tandoori', 'Veg Tandoori Pizza', 'pizza', 200, 'Tandoori spiced onions, capsicum, paneer and smoky cheese', 'pizza', true, true, false, 'veg', NULL, '12 mins', 4.70),
('pz-veg-mexican', 'Veg Mexican Pizza', 'pizza', 220, 'Jalapenos, sweet corn, red paprika and Mexican herbs', 'pizza', true, true, false, 'veg', NULL, '12 mins', 4.70),
('pz-veg-italian', 'Veg Italian Pizza', 'pizza', 220, 'Black olives, sun-dried tomatoes, capsicum and extra virgin olive oil', 'pizza', true, true, false, 'veg', NULL, '12 mins', 4.70),
('pz-corn', 'Corn Pizza', 'pizza', 230, 'Sweet golden corn and overflowing mozzarella cheese blend', 'pizza', true, true, false, 'veg', NULL, '12 mins', 4.80),
('pz-paneer', 'Paneer Pizza', 'pizza', 250, 'Tender marinated paneer cubes with bell peppers and onion', 'pizza', true, true, false, 'veg', NULL, '12 mins', 4.80),
('pz-crispy-paneer', 'Crispy Paneer Pizza', 'pizza', 270, 'Golden fried crispy paneer bites on melted cheese crust', 'pizza', true, true, false, 'veg', NULL, '14 mins', 4.90),
('pz-veg-supreme', 'Veg Supreme Pizza', 'pizza', 290, 'Loaded with paneer, olives, corn, capsicum, mushroom & jalapenos', 'pizza', true, true, false, 'veg', NULL, '15 mins', 4.90),
('pz-crispy-chicken', 'Crispy Chicken Pizza', 'pizza', 220, 'Crunchy chicken popcorn chunks over melted cheese and marinara', 'pizza', true, true, true, 'non-veg', NULL, '14 mins', 4.90),
('pz-chicken-tandoori', 'Chicken Tandoori Pizza', 'pizza', 240, 'Clay-oven spiced roasted chicken tikka pieces with onion & capsicum', 'pizza', true, true, false, 'non-veg', NULL, '14 mins', 4.80),
('pz-chicken-margherita', 'Chicken Margherita Pizza', 'pizza', 250, 'Seasoned grilled chicken breast over Italian basil margherita', 'pizza', true, true, false, 'non-veg', NULL, '14 mins', 4.80),
('pz-chicken-mexican', 'Chicken Mexican Pizza', 'pizza', 260, 'Spicy chicken, jalapeno peppers, sweet corn and Mexican drizzle', 'pizza', true, true, false, 'non-veg', NULL, '14 mins', 4.80),
('pz-chicken-italiano', 'Chicken Italiano Pizza', 'pizza', 260, 'Italian herb chicken with sliced black olives and mushrooms', 'pizza', true, true, false, 'non-veg', NULL, '14 mins', 4.70),
('pz-chicken-tikka', 'Chicken Tikka Pizza', 'pizza', 280, 'Generous helping of authentic chicken tikka and red paprika', 'pizza', true, true, false, 'non-veg', NULL, '14 mins', 4.90),
('pz-chicken-cheese', 'Chicken Cheese Pizza', 'pizza', 280, 'Double layer cheese with seasoned herb chicken', 'pizza', true, true, false, 'non-veg', NULL, '14 mins', 4.80),
('pz-chicken-supreme', 'Chicken Supreme Pizza', 'pizza', 310, 'Grand feast with chicken tikka, crispy chicken, olives, corn & cheese', 'pizza', true, true, false, 'non-veg', NULL, '15 mins', 4.90),

-- --- MOMOS (Menu Page 3) ---
('mo-veg', 'Veg Momos (Steamed/Fried)', 'momos', 90, 'Fresh minced cabbage, carrot, ginger and herbs in delicate wrapper', 'momo', true, true, false, 'veg', NULL, '8 mins', 4.60),
('mo-veg-schezwan', 'Veg Schezwan Momos', 'momos', 120, 'Tossed in fiery homemade garlic Schezwan chili sauce', 'momo', true, true, false, 'veg', NULL, '9 mins', 4.80),
('mo-paneer-tikka', 'Paneer Tikka Momos', 'momos', 130, 'Filled with spicy grated cottage cheese and capsicum', 'momo', true, true, false, 'veg', NULL, '9 mins', 4.70),
('mo-mushroom', 'Mushroom Momos', 'momos', 130, 'Garlic butter button mushroom filling steamed soft', 'momo', true, true, false, 'veg', NULL, '9 mins', 4.60),
('mo-veg-kurkure', 'Veg Kurkure Momos', 'momos', 140, 'Coated in crispy seasoned cornflake crumb and fried crackling hot', 'momo', true, true, true, 'veg', NULL, '10 mins', 4.90),
('mo-chicken', 'Chicken Momos', 'momos', 100, 'Juicy steamed chicken dumplings served with spicy red chutney', 'momo', true, true, false, 'non-veg', NULL, '8 mins', 4.80),
('mo-chicken-tikka', 'Chicken Tikka Momos', 'momos', 110, 'Spiced smoky chicken tikka filling in tender dumplings', 'momo', true, true, false, 'non-veg', NULL, '9 mins', 4.80),
('mo-butter-chicken', 'Butter Chicken Momos', 'momos', 120, 'Tossed in velvety creamy butter chicken makhani gravy', 'momo', true, true, true, 'non-veg', NULL, '10 mins', 4.90),
('mo-chicken-schezwan', 'Chicken Schezwan Momos', 'momos', 130, 'Pan-fried chicken momos coated in spicy Schezwan glaze', 'momo', true, true, false, 'non-veg', NULL, '9 mins', 4.80),
('mo-chicken-kurkure', 'Chicken Kurkure Momos', 'momos', 150, 'Ultra crispy crumb coated fried chicken momos with mayo', 'momo', true, true, true, 'non-veg', NULL, '10 mins', 4.90),

-- --- SIDE KICKS & DIPS (Menu Page 1 & 3) ---
('sd-french-fries', 'French Fries', 'sides', 80, 'Golden crispy salted potato fries', 'fries', true, true, true, 'veg', NULL, '6 mins', 4.70),
('sd-peri-peri-fries', 'Peri Peri Fries', 'sides', 90, 'Crispy fries dusted with fiery peri-peri seasoning', 'fries', true, true, true, 'veg', NULL, '6 mins', 4.90),
('sd-veg-nuggets', 'Veg Nuggets', 'sides', 90, 'Crispy vegetable bites filled with potato, peas and corn', 'fries', true, true, false, 'veg', NULL, '7 mins', 4.60),
('sd-crispy-corn', 'Crispy Corn', 'sides', 120, 'Batter fried sweet corn kernels tossed with spices, onion & lemon', 'fries', true, true, false, 'veg', NULL, '7 mins', 4.80),
('sd-cheese-corn-nuggets', 'Cheese Corn Nuggets', 'sides', 130, 'Melting cheddar and sweet corn filled crunchy nuggets', 'fries', true, true, false, 'veg', NULL, '8 mins', 4.80),
('sd-paneer-popcorn', 'Paneer Pop Corn', 'sides', 140, 'Bite-sized crunchy cottage cheese cubes with herb dusting', 'fries', true, true, false, 'veg', NULL, '8 mins', 4.80),
('sd-chicken-nuggets', 'Chicken Nuggets', 'sides', 120, 'Crispy tender chicken breast nuggets served with dip', 'strips', true, true, false, 'non-veg', NULL, '7 mins', 4.80),
('dip-garlic-mayo', 'Garlic Mayo Dip', 'sides', 25, 'Creamy roasted garlic mayonnaise dip', 'dip', true, true, false, 'veg', NULL, '1 min', 4.90),
('dip-chilly-garlic', 'Chilly Garlic Dip', 'sides', 25, 'Spicy chili infused garlic dipping sauce', 'dip', true, true, false, 'veg', NULL, '1 min', 4.80),
('dip-thousand-island', 'Thousand Island Dip', 'sides', 25, 'Classic tangy sweet relish and herb mayonnaise dip', 'dip', true, true, false, 'veg', NULL, '1 min', 4.70),

-- --- MAGGI (Menu Page 4) ---
('mg-veg', 'Veg Maggi', 'maggi', 70, 'Classic masala Maggi noodles cooked with fresh veggies and butter', 'maggi', true, true, true, 'veg', NULL, '6 mins', 4.80),
('mg-paneer-popcorn', 'Paneer Popcorn Maggi', 'maggi', 140, 'Masala Maggi noodles topped with crispy golden paneer popcorn', 'maggi', true, true, false, 'veg', NULL, '8 mins', 4.80),
('mg-veg-special', 'Veg Special Maggi', 'maggi', 150, 'Loaded with cheese, sweet corn, paneer and secret spices', 'maggi', true, true, false, 'veg', NULL, '8 mins', 4.90),
('mg-chicken', 'Chicken Maggi', 'maggi', 100, 'Masala noodles cooked with tender seasoned chicken chunks', 'maggi', true, true, false, 'non-veg', NULL, '8 mins', 4.80),
('mg-chicken-popcorn', 'Chicken Popcorn Maggi', 'maggi', 160, 'Steaming Maggi bowls crowned with crunchy chicken popcorn', 'maggi', true, true, true, 'non-veg', NULL, '9 mins', 4.90),
('mg-chicken-lollipop', 'Chicken Lollipop Maggi', 'maggi', 180, 'Special cafe creation: Masala Maggi served with crispy chicken lollipops', 'maggi', true, true, false, 'non-veg', NULL, '10 mins', 4.90),

-- --- BROWNIE & DESSERTS (Menu Page 4) ---
('ds-chocolate-brownie', 'Chocolate Brownie', 'desserts', 80, 'Fudgy Dutch chocolate brownie slice baked fresh daily', 'brownie', true, true, false, 'veg', NULL, '3 mins', 4.70),
('ds-walnut-brownie', 'Walnut Brownie', 'desserts', 100, 'Dark chocolate fudge brownie studded with toasted California walnuts', 'brownie', true, true, false, 'veg', NULL, '3 mins', 4.80),
('ds-choco-lava', 'Choco Lava Cake', 'desserts', 100, 'Warm chocolate cake with molten chocolate river inside', 'brownie', true, true, true, 'veg', NULL, '4 mins', 4.90),
('ds-sizzling-brownie', 'Sizzling Brownie With Ice Cream', 'desserts', 150, 'Hot sizzling cast iron plate with brownie, vanilla scoop & hot fudge', 'brownie', true, true, true, 'veg', NULL, '5 mins', 4.90),
('ds-sizzling-walnut', 'Sizzling Walnut Brownie with Ice Cream', 'desserts', 160, 'Sizzling walnut brownie with creamy vanilla ice cream and chocolate drizzle', 'brownie', true, true, false, 'veg', NULL, '5 mins', 4.90),

-- --- BEVERAGES & COFFEE ---
('bv-cappuccino', 'Cappuccino', 'coffee-drinks', 120, 'Rich espresso with steamed milk & velvety microfoam', 'cappuccino', true, true, true, 'veg', NULL, '5 mins', 4.80),
('bv-cold-coffee', 'Cold Coffee', 'coffee-drinks', 140, 'Chilled blended brew with ice cream and chocolate syrup', 'cold-coffee', true, true, true, 'veg', NULL, '5 mins', 4.90),
('bv-latte', 'Caffe Latte', 'coffee-drinks', 130, 'Smooth and creamy espresso with velvety steamed milk', 'cappuccino', true, true, false, 'veg', NULL, '5 mins', 4.70),
('bv-chocolate-shake', 'Thick Chocolate Shake', 'coffee-drinks', 150, 'Decadent chocolate milkshake with brownie crumble and whipped cream', 'cold-coffee', true, true, false, 'veg', NULL, '5 mins', 4.80),
('bv-blue-mojito', 'Blue Curacao Mojito', 'coffee-drinks', 120, 'Sparkling chilled citrus cooler with mint, lime and blue curacao', 'cold-coffee', true, true, false, 'veg', NULL, '4 mins', 4.80)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  in_stock = EXCLUDED.in_stock,
  is_active = EXCLUDED.is_active,
  is_popular = EXCLUDED.is_popular,
  dietary = EXCLUDED.dietary,
  variant = EXCLUDED.variant,
  prep_time = EXCLUDED.prep_time,
  rating = EXCLUDED.rating;

-- 10. SEED PROMO COUPONS
INSERT INTO coupons (id, code, discount_percent, min_order, description, is_active)
VALUES
('c1', 'BREW10', 10, 200, '10% OFF on all orders above ₹200', true),
('c2', 'WELCOME50', NULL, 250, 'Flat ₹50 OFF on orders above ₹250', true),
('c3', 'CRISPY20', 20, 400, '20% OFF on Fried Chicken & Pizza combos', true)
ON CONFLICT (code) DO NOTHING;

-- 11. SEED DEFAULT CAFE SETTINGS
INSERT INTO cafe_settings (id, cafe_name, tagline, upi_id, opening_time, closing_time, table_count, sound_alerts, auto_accept_orders)
VALUES ('default_settings', 'Mr. CAFE (Brew & Bite)', 'Love At First Bite...!', 'mrcafe@upi', '08:00 AM', '11:00 PM', 12, true, false)
ON CONFLICT (id) DO NOTHING;

-- 12. SEED DEFAULT USERS (Bhanu Prakash Customer & Manager)
INSERT INTO profiles (id, name, email, role, loyalty_points, tier, tier_level, phone, member_since)
VALUES
('user-bhanu-cust', 'Bhanu Prakash', 'bhanu@gmail.com', 'customer', 1250, 'Gold', 3, '+91 98450 12345', 'March 2024'),
('user-bhanu-owner', 'Bhanu Prakash', 'manager@mrcafe.com', 'owner', 2480, 'Platinum', 4, '+91 98450 12345', 'January 2023')
ON CONFLICT (id) DO NOTHING;
