import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  Order,
  CartItem,
  UserProfile,
  Coupon,
  OrderStatus,
  OrderType,
  MenuCategory
} from '../types/cafe';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  DEFAULT_CUSTOMER,
  DEFAULT_OWNER,
  INITIAL_COUPONS
} from '../data/initialData';
import {
  isSupabaseConfigured,
  getSupabaseClient,
  fetchMenuItems,
  createMenuItemInSupabase,
  updateMenuItemInSupabase,
  updateItemPriceInSupabase,
  bulkUpdatePricesInSupabase,
  deleteMenuItemInSupabase,
  fetchOrdersFromSupabase,
  createOrderInSupabase,
  updateOrderStatusInSupabase,
  fetchCouponsFromSupabase,
  syncMenuItemsToSupabase,
} from '../lib/supabase';

export type CustomerScreen = 'home' | 'menu' | 'cart' | 'order-success' | 'orders' | 'profile';
export type OwnerScreen = 'dashboard' | 'orders' | 'menu' | 'customers' | 'coupons' | 'settings';
export type DeviceMode = 'responsive' | 'mobile-mock';

export const ADMIN_EMAIL = 'bhanu934785@gmail.com';

export const isEmailAdmin = (email?: string): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

interface CafeContextType {
  activeRole: 'customer' | 'owner';
  setActiveRole: (role: 'customer' | 'owner') => void;
  activeUser: UserProfile;
  customerView: CustomerScreen;
  setCustomerView: (view: CustomerScreen) => void;
  ownerView: OwnerScreen;
  setOwnerView: (view: OwnerScreen) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;

  // Authentication State & Actions
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithEmail: (email: string, name?: string, avatar?: string) => void;
  loginWithGoogle: (email?: string, name?: string) => Promise<void>;
  
  menuItems: MenuItem[];
  orders: Order[];
  cart: CartItem[];
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  lastPlacedOrder: Order | null;
  isLoadingData: boolean;
  
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  cartItemCount: number;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: MenuCategory;
  setSelectedCategory: (cat: MenuCategory) => void;
  
  // Cart Actions
  addToCart: (item: MenuItem, qty?: number) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  placeOrder: (
    orderType: OrderType,
    details: {
      tableNumber?: string;
      deliveryAddress?: string;
      paymentMethod: 'UPI' | 'Card' | 'Cash';
      notes?: string;
    }
  ) => Order;

  // Order Actions
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Menu Actions
  addMenuItem: (item: Omit<MenuItem, 'id' | 'ordersCount'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  updateItemPrice: (id: string, newPrice: number) => void;
  bulkUpdatePrices: (updates: { id: string; price: number }[]) => void;
  adjustAllPricesByPercent: (percentChange: number) => void;
  resetMenuToOriginal: () => void;
  deleteMenuItem: (id: string) => void;
  toggleItemStock: (id: string) => void;
  toggleItemActive: (id: string) => void;

  // Supabase Database Sync
  isSupabaseConnected: boolean;
  syncMenuToSupabaseAction: () => Promise<boolean>;
  reloadSupabaseData: () => Promise<void>;

  // User Actions
  loginAs: (user: UserProfile) => void;
  loginAsCustomerDemo: () => void;
  loginAsOwnerDemo: () => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  redeemPoints: (points: number) => boolean;

  // Notification Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bnb_is_logged_in') === 'true';
  });

  const [activeUser, setActiveUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bnb_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.email) {
          const admin = isEmailAdmin(parsed.email);
          return {
            ...parsed,
            role: admin ? 'owner' : 'customer',
          };
        }
      } catch {}
    }
    return DEFAULT_CUSTOMER;
  });

  const [activeRole, setActiveRoleState] = useState<'customer' | 'owner'>(() => {
    const saved = localStorage.getItem('bnb_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.email && isEmailAdmin(parsed.email)) {
          return 'owner';
        }
      } catch {}
    }
    const savedRole = localStorage.getItem('bnb_active_role');
    return (savedRole as 'customer' | 'owner') || 'customer';
  });

  const isAdmin = isEmailAdmin(activeUser.email);

  const [customerView, setCustomerView] = useState<CustomerScreen>('home');
  const [ownerView, setOwnerView] = useState<OwnerScreen>('dashboard');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');

  // Supabase-first data states: initialized from local cache or fallback, updated live from Supabase
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('bnb_menu_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    return INITIAL_MENU_ITEMS;
  });

  // Orders: NO MOCK DATA. Real orders from Supabase!
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bnb_orders_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bnb_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('bnb_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_COUPONS;
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(() => isSupabaseConfigured());

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bnb_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('bnb_user', JSON.stringify(activeUser));
  }, [activeUser]);

  useEffect(() => {
    localStorage.setItem('bnb_menu_v3', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('bnb_orders_v3', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bnb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bnb_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Load live data directly from Supabase
  const reloadSupabaseData = async () => {
    if (!isSupabaseConfigured()) {
      setIsSupabaseConnected(false);
      return;
    }

    setIsLoadingData(true);
    setIsSupabaseConnected(true);

    try {
      const [dbMenu, dbOrders, dbCoupons] = await Promise.all([
        fetchMenuItems(),
        fetchOrdersFromSupabase(),
        fetchCouponsFromSupabase(),
      ]);

      if (dbMenu && dbMenu.length > 0) {
        setMenuItems(dbMenu);
      }
      if (dbOrders) {
        setOrders(dbOrders);
      }
      if (dbCoupons && dbCoupons.length > 0) {
        setCoupons(dbCoupons);
      }
    } catch (err) {
      console.warn('Error loading live data from Supabase:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Load from Supabase on mount and set up realtime subscription
  useEffect(() => {
    reloadSupabaseData();

    const client = getSupabaseClient();
    if (!client) return;

    // Listen for realtime changes in orders table
    const ordersSubscription = client
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        fetchOrdersFromSupabase().then((latestOrders) => {
          if (latestOrders) {
            setOrders(latestOrders);
          }
        });
      })
      .subscribe();

    // Listen for realtime changes in menu_items table
    const menuSubscription = client
      .channel('public:menu_items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => {
        fetchMenuItems().then((latestItems) => {
          if (latestItems && latestItems.length > 0) {
            setMenuItems(latestItems);
          }
        });
      })
      .subscribe();

    return () => {
      client.removeChannel(ordersSubscription);
      client.removeChannel(menuSubscription);
    };
  }, []);

  // Supabase Auth listener: handles Google OAuth redirects and persistent sessions
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;

    // Check if session exists (e.g. after Google OAuth callback redirect)
    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        const email = session.user.email;
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        const avatar = session.user.user_metadata?.avatar_url;
        loginWithEmail(email, name, avatar);
      }
    });

    const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        const email = session.user.email;
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        const avatar = session.user.user_metadata?.avatar_url;
        loginWithEmail(email, name, avatar);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        localStorage.removeItem('bnb_is_logged_in');
        localStorage.removeItem('bnb_user');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const setActiveRole = (role: 'customer' | 'owner') => {
    if (role === 'owner' && !isEmailAdmin(activeUser.email)) {
      showToast('Admin access restricted to bhanu934785@gmail.com');
      return;
    }
    setActiveRoleState(role);
    localStorage.setItem('bnb_active_role', role);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const cartItemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  let cartDiscount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountPercent) {
      cartDiscount = Math.round((cartSubtotal * activeCoupon.discountPercent) / 100);
    } else if (activeCoupon.discountAmount) {
      cartDiscount = Math.min(activeCoupon.discountAmount, cartSubtotal);
    }
  }
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  // Cart operations
  const addToCart = (item: MenuItem, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + qty } : ci
        );
      }
      return [...prev, { item, quantity: qty }];
    });
    showToast(`Added ${item.name} to cart`);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Min order value of ₹${found.minOrder} required for ${found.code}`,
      };
    }
    setActiveCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  // Place Order directly with Supabase
  const placeOrder = (
    orderType: OrderType,
    details: {
      tableNumber?: string;
      deliveryAddress?: string;
      paymentMethod: 'UPI' | 'Card' | 'Cash';
      notes?: string;
    }
  ): Order => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const newId = `#CB${dateStr}${randomSuffix}`;

    const pointsEarned = Math.max(30, Math.round(cartSubtotal * 0.1));
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: newId,
      customerName: activeUser.name,
      customerEmail: activeUser.email,
      customerPhone: activeUser.phone || '+91 98450 12345',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: activeCoupon?.code,
      serviceFee: 0,
      total: cartTotal,
      pointsEarned,
      status: 'Preparing',
      orderType,
      tableNumber: details.tableNumber,
      deliveryAddress: details.deliveryAddress,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timeFormatted,
      paymentMethod: details.paymentMethod,
      paymentStatus: 'Paid',
    };

    // Save directly to Supabase
    createOrderInSupabase(newOrder);

    // Update state
    setOrders((prev) => [newOrder, ...prev]);

    // Update loyalty points
    setActiveUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + pointsEarned,
    }));

    setLastPlacedOrder(newOrder);
    clearCart();
    setCustomerView('order-success');
    return newOrder;
  };

  // Order status update directly with Supabase
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );
    updateOrderStatusInSupabase(orderId, status);
    showToast(`Order ${orderId} updated to ${status}`);
  };

  // Menu items CRUD directly with Supabase
  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'ordersCount'>) => {
    const created = await createMenuItemInSupabase(item);
    if (created) {
      setMenuItems((prev) => [created, ...prev]);
      showToast(`Added "${created.name}" to database`);
    }
  };

  const updateMenuItem = async (item: MenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
    await updateMenuItemInSupabase(item);
    showToast(`Updated "${item.name}"`);
  };

  const updateItemPrice = async (id: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, price: Math.max(0, newPrice) } : m))
    );
    await updateItemPriceInSupabase(id, newPrice);
    const item = menuItems.find((m) => m.id === id);
    showToast(`Updated price of "${item?.name || 'item'}" to ₹${newPrice}`);
  };

  const bulkUpdatePrices = async (updates: { id: string; price: number }[]) => {
    const updateMap = new Map(updates.map((u) => [u.id, u.price]));
    setMenuItems((prev) =>
      prev.map((m) => {
        if (updateMap.has(m.id)) {
          return { ...m, price: Math.max(0, updateMap.get(m.id)!) };
        }
        return m;
      })
    );
    await bulkUpdatePricesInSupabase(updates);
    showToast(`Updated prices for ${updates.length} items in Supabase`);
  };

  const adjustAllPricesByPercent = async (percentChange: number) => {
    const factor = 1 + percentChange / 100;
    const updates = menuItems.map((m) => ({
      id: m.id,
      price: Math.max(10, Math.round(m.price * factor)),
    }));
    await bulkUpdatePrices(updates);
    showToast(
      `${percentChange >= 0 ? 'Increased' : 'Decreased'} all menu prices by ${Math.abs(percentChange)}%`
    );
  };

  const resetMenuToOriginal = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    localStorage.setItem('bnb_menu_v3', JSON.stringify(INITIAL_MENU_ITEMS));
    if (isSupabaseConfigured()) {
      syncMenuItemsToSupabase(INITIAL_MENU_ITEMS);
    }
    showToast('Reset all menu items and prices to catalog');
  };

  const deleteMenuItem = async (id: string) => {
    const item = menuItems.find((m) => m.id === id);
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    await deleteMenuItemInSupabase(id);
    showToast(`Removed "${item?.name || 'item'}" from database`);
  };

  const toggleItemStock = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStock = !m.inStock;
          updateMenuItemInSupabase({ ...m, inStock: nextStock });
          showToast(`${m.name} marked as ${nextStock ? 'In Stock' : 'Out of Stock'}`);
          return { ...m, inStock: nextStock };
        }
        return m;
      })
    );
  };

  const toggleItemActive = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextActive = !m.isActive;
          updateMenuItemInSupabase({ ...m, isActive: nextActive });
          showToast(`${m.name} is now ${nextActive ? 'Active' : 'Hidden'}`);
          return { ...m, isActive: nextActive };
        }
        return m;
      })
    );
  };

  const syncMenuToSupabaseAction = async (): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      showToast('Please configure Supabase URL & Anon Key in Cafe Settings first.');
      return false;
    }
    showToast('Syncing all menu items to Supabase...');
    const result = await syncMenuItemsToSupabase(menuItems);
    if (result.success) {
      setIsSupabaseConnected(true);
      showToast(`Successfully synced ${result.count} items to Supabase!`);
      return true;
    } else {
      showToast(`Supabase sync failed: ${result.error || 'Check SQL schema'}`);
      return false;
    }
  };

  // Auth & Profile
  const loginWithEmail = (email: string, name?: string, avatar?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const admin = isEmailAdmin(cleanEmail);
    const role: 'owner' | 'customer' = admin ? 'owner' : 'customer';

    const user: UserProfile = {
      id: admin ? 'admin-bhanu' : `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '-')}`,
      name: name || (admin ? 'Bhanu Prakash (Admin)' : cleanEmail.split('@')[0]),
      email: cleanEmail,
      role,
      avatar: avatar || (admin
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || cleanEmail)}`),
      loyaltyPoints: admin ? 2480 : 150,
      tier: admin ? 'Platinum' : 'Bronze',
      tierLevel: admin ? 4 : 1,
      phone: admin ? '+91 93478 50000' : '+91 98450 12345',
      memberSince: 'October 2026',
    };

    setActiveUser(user);
    setActiveRoleState(role);
    setIsAuthenticated(true);
    localStorage.setItem('bnb_is_logged_in', 'true');
    localStorage.setItem('bnb_user', JSON.stringify(user));
    localStorage.setItem('bnb_active_role', role);

    if (admin) {
      setOwnerView('dashboard');
      showToast(`Welcome Admin! Signed in as ${cleanEmail}`);
    } else {
      setCustomerView('home');
      showToast(`Welcome! Signed in as Customer (${cleanEmail})`);
    }
  };

  const loginWithGoogle = async (email?: string, name?: string) => {
    if (email) {
      loginWithEmail(email, name);
      return;
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          console.warn('Supabase Google OAuth notice:', error.message);
        }
      } catch (e) {
        console.warn('OAuth redirect notice:', e);
      }
    }
  };

  const loginAs = (user: UserProfile) => {
    loginWithEmail(user.email, user.name);
  };

  const loginAsCustomerDemo = () => {
    loginWithEmail('customer@gmail.com', 'Customer Guest');
  };

  const loginAsOwnerDemo = () => {
    loginWithEmail(ADMIN_EMAIL, 'Bhanu Prakash (Admin)');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('bnb_is_logged_in');
    localStorage.removeItem('bnb_user');
    const client = getSupabaseClient();
    if (client) {
      client.auth.signOut().catch(() => {});
    }
    showToast('Signed out successfully');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setActiveUser((prev) => ({ ...prev, ...profile }));
    showToast('Profile updated');
  };

  const redeemPoints = (points: number): boolean => {
    if (activeUser.loyaltyPoints < points) {
      showToast('Insufficient loyalty points');
      return false;
    }
    setActiveUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints - points,
    }));
    showToast(`Redeemed ${points} points! Coupon discount applied.`);
    return true;
  };

  return (
    <CafeContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeUser,
        customerView,
        setCustomerView,
        ownerView,
        setOwnerView,
        deviceMode,
        setDeviceMode,
        isAuthenticated,
        isAdmin,
        loginWithEmail,
        loginWithGoogle,
        menuItems,
        orders,
        cart,
        coupons,
        activeCoupon,
        lastPlacedOrder,
        isLoadingData,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        cartItemCount,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        placeOrder,
        updateOrderStatus,
        addMenuItem,
        updateMenuItem,
        updateItemPrice,
        bulkUpdatePrices,
        adjustAllPricesByPercent,
        resetMenuToOriginal,
        deleteMenuItem,
        toggleItemStock,
        toggleItemActive,
        isSupabaseConnected,
        syncMenuToSupabaseAction,
        reloadSupabaseData,
        loginAs,
        loginAsCustomerDemo,
        loginAsOwnerDemo,
        logout,
        updateUserProfile,
        redeemPoints,
        toast,
        showToast,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
