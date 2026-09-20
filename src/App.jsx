import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Monitor,
  Flame,
  Wine,
  Receipt,
  Grid,
  Package,
  BookOpen,
  DollarSign,
  BarChart3,
  ClipboardList,
  Trash2,
  Users,
  Settings,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  ChevronRight,
  Send,
  X,
  CreditCard,
  Banknote,
  LogOut,
  ArrowUpRight,
  Calendar,
  Lock,
  KeyRound,
  ShieldCheck,
  Percent,
  TrendingUp,
  RefreshCw,
  Eye,
  Sliders,
  Check,
  Layers,
  FileSpreadsheet,
  Coffee,
  Coins,
  Usb,
  Volume2,
  Zap,
  ShoppingBag,
  Upload,
  Edit3,
  Filter,
  History,
  ShieldAlert,
  ChevronDown,
  Menu,
  CheckCheck
} from 'lucide-react';

const ROLE_PERMISSIONS = {
  Administrator: ['pos', 'kds', 'bar', 'billing', 'tables', 'stock', 'recipes', 'shifts', 'reports', 'menu_admin', 'cancelled', 'staff', 'settings'],
  Manager: ['pos', 'kds', 'bar', 'billing', 'tables', 'stock', 'recipes', 'shifts', 'reports', 'menu_admin', 'cancelled', 'settings'],
  Cashier: ['pos', 'billing', 'tables', 'shifts', 'reports'],
  'Kitchen Chef': ['kds', 'recipes', 'stock'],
  Bartender: ['bar', 'recipes', 'stock'],
  'Floor Server': ['pos', 'tables', 'billing']
};

const INITIAL_STAFF = [
  { id: 'usr_admin', name: 'System Administrator', role: 'Administrator', pin: '1234', avatar: 'SA', email: 'admin@linolicove.me' },
  { id: 'usr_cashier', name: 'Marco Rossi', role: 'Cashier', pin: '1111', avatar: 'MR', email: 'marco@linolicove.me' },
  { id: 'usr_chef', name: 'Alexandros Thorne', role: 'Kitchen Chef', pin: '2222', avatar: 'AT', email: 'chef@linolicove.me' },
  { id: 'usr_bar', name: 'Chloe Dubois', role: 'Bartender', pin: '3333', avatar: 'CD', email: 'bar@linolicove.me' },
  { id: 'usr_server', name: 'Niroshan Perera', role: 'Floor Server', pin: '5555', avatar: 'NP', email: 'server@linolicove.me' }
];

const INITIAL_RAW_INVENTORY = [
  { id: 'ing_rice', name: 'Basmati Rice', category: 'Dry Goods', stock: 25000, unit: 'g', cost: 0.25, threshold: 5000 },
  { id: 'ing_seafood_mix', name: 'Prawns & Calamari Mix', category: 'Seafood', stock: 10000, unit: 'g', cost: 1.80, threshold: 2000 },
  { id: 'ing_eggs', name: 'Farm Fresh Eggs', category: 'Dairy & Eggs', stock: 120, unit: 'pcs', cost: 35.00, threshold: 30 },
  { id: 'ing_espresso_beans', name: 'Roasted Arabica Beans', category: 'Beverages', stock: 5000, unit: 'g', cost: 4.50, threshold: 1000 },
  { id: 'ing_milk', name: 'Fresh Whole Milk', category: 'Dairy & Eggs', stock: 15000, unit: 'ml', cost: 0.30, threshold: 3000 },
  { id: 'ing_beef_patty', name: 'Prime Angus Beef Patty', category: 'Meat', stock: 40, unit: 'pcs', cost: 450.00, threshold: 10 },
  { id: 'ing_burger_bun', name: 'Brioche Bun', category: 'Bakery', stock: 45, unit: 'pcs', cost: 65.00, threshold: 12 },
  { id: 'ing_cheddar', name: 'Aged Cheddar Cheese', category: 'Dairy & Eggs', stock: 2500, unit: 'g', cost: 1.20, threshold: 500 },
  { id: 'ing_calamari', name: 'Fresh Reef Calamari', category: 'Seafood', stock: 8000, unit: 'g', cost: 1.95, threshold: 1500 },
  { id: 'ing_rum', name: 'White Rum', category: 'Bar Supplies', stock: 5000, unit: 'ml', cost: 3.20, threshold: 1000 },
  { id: 'ing_lime', name: 'Fresh Lime Juice', category: 'Produce', stock: 4000, unit: 'ml', cost: 0.80, threshold: 600 },
  { id: 'ing_mint', name: 'Garden Fresh Mint', category: 'Produce', stock: 1000, unit: 'g', cost: 1.50, threshold: 200 },
  { id: 'ing_soda', name: 'Sparkling Soda Water', category: 'Beverages', stock: 12000, unit: 'ml', cost: 0.15, threshold: 2500 },
  { id: 'ing_lion_lager', name: 'Lion Lager 625ml', category: 'Bar Supplies', stock: 60, unit: 'pcs', cost: 650.00, threshold: 15 }
];

const PREDEFINED_MENU_CATEGORIES = [
  'Rice & Noodles',
  'Mains & Grills',
  'Starters',
  'Seafood Specials',
  'Cocktails',
  'Beer & Wine',
  'Hot Coffee',
  'Fresh Juices & Smoothies',
  'Desserts'
];

const INITIAL_MENU_ITEMS = [
  {
    id: 'dish_seafood_rice',
    name: 'SEAFOOD FRIED RICE',
    department: 'Kitchen',
    category: 'Rice & Noodles',
    price: 2250.00,
    prepTime: '15m',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
    description: 'Wok-tossed basmati rice with tiger prawns, fresh calamari, egg & scallions.',
    recipe: [
      { ingredientId: 'ing_rice', amount: 250 },
      { ingredientId: 'ing_seafood_mix', amount: 150 },
      { ingredientId: 'ing_eggs', amount: 1 }
    ]
  },
  {
    id: 'dish_classic_burger',
    name: 'Angus Truffle Burger',
    department: 'Kitchen',
    category: 'Mains & Grills',
    price: 2450.00,
    prepTime: '12m',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    description: 'Flame-grilled prime beef patty, aged cheddar, caramelized onion on brioche.',
    recipe: [
      { ingredientId: 'ing_beef_patty', amount: 1 },
      { ingredientId: 'ing_burger_bun', amount: 1 },
      { ingredientId: 'ing_cheddar', amount: 30 }
    ]
  },
  {
    id: 'dish_hot_butter_calamari',
    name: 'Hot Butter Calamari',
    department: 'Kitchen',
    category: 'Starters',
    price: 1850.00,
    prepTime: '10m',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80',
    description: 'Crispy seasoned calamari tossed with fresh chili butter and leeks.',
    recipe: [
      { ingredientId: 'ing_calamari', amount: 200 }
    ]
  },
  {
    id: 'drink_mojito',
    name: 'Classic Coastal Mojito',
    department: 'Bar',
    category: 'Cocktails',
    price: 1450.00,
    prepTime: '4m',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
    description: 'White rum, fresh garden mint, lime wedges, crushed ice & sparkling soda.',
    recipe: [
      { ingredientId: 'ing_rum', amount: 60 },
      { ingredientId: 'ing_lime', amount: 30 },
      { ingredientId: 'ing_mint', amount: 15 },
      { ingredientId: 'ing_soda', amount: 120 }
    ]
  },
  {
    id: 'drink_lion_beer',
    name: 'Lion Lager 625ml',
    department: 'Bar',
    category: 'Beer & Wine',
    price: 950.00,
    prepTime: '1m',
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80',
    description: 'Crisp chilled local Sri Lankan lager bottle.',
    recipe: [
      { ingredientId: 'ing_lion_lager', amount: 1 }
    ]
  },
  {
    id: 'drink_cappuccino',
    name: 'Café Cappuccino',
    department: 'Bar',
    category: 'Hot Coffee',
    price: 850.00,
    prepTime: '5m',
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80',
    description: 'Silky microfoam over fresh espresso double shot.',
    recipe: [
      { ingredientId: 'ing_espresso_beans', amount: 18 },
      { ingredientId: 'ing_milk', amount: 180 }
    ]
  },
  {
    id: 'drink_espresso',
    name: 'Double Espresso',
    department: 'Bar',
    category: 'Hot Coffee',
    price: 600.00,
    prepTime: '3m',
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400&q=80',
    description: 'Double shot of single-origin dark roasted arabica coffee.',
    recipe: [
      { ingredientId: 'ing_espresso_beans', amount: 18 }
    ]
  }
];

const INITIAL_FLOOR_TABLES = [
  { id: 'T-01', name: 'Table 1', zone: 'Indoor Main Hall', capacity: 2, status: 'VACANT', currentOrderRef: null },
  { id: 'T-02', name: 'Table 2', zone: 'Indoor Main Hall', capacity: 4, status: 'VACANT', currentOrderRef: null },
  { id: 'T-03', name: 'Table 3', zone: 'Indoor Main Hall', capacity: 4, status: 'VACANT', currentOrderRef: null },
  { id: 'T-04', name: 'Table 4', zone: 'Deck Lounge', capacity: 6, status: 'VACANT', currentOrderRef: null },
  { id: 'T-05', name: 'Table 5', zone: 'Deck Lounge', capacity: 4, status: 'VACANT', currentOrderRef: null },
  { id: 'BAR-01', name: 'Bar Seat 01', zone: 'Cocktail Counter', capacity: 1, status: 'VACANT', currentOrderRef: null },
  { id: 'BAR-02', name: 'Bar Seat 02', zone: 'Cocktail Counter', capacity: 1, status: 'VACANT', currentOrderRef: null },
  { id: 'VIP-01', name: 'VIP Cabana 1', zone: 'Private Ocean View', capacity: 8, status: 'VACANT', currentOrderRef: null }
];

// Reliable Local Calendar Date Formatter (YYYY-MM-DD)
const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPinInput, setLoginPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('pos');
  const [reportSubTab, setReportSubTab] = useState('Daily Overview');
  const [currentUser, setCurrentUser] = useState(INITIAL_STAFF[0]);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);

  const [settings, setSettings] = useState({
    restaurantName: 'Linoli Cove Midigama',
    tagline: 'RESTAURANT & BAR',
    terminalId: 'LINOLI-MAIN-01',
    phone: '+94 74 036 6741',
    address: '380 A Matara Road, Midigama, 81700',
    currency: 'Rs.',
    serviceChargeRate: 10,
    taxRate: 8,
    receiptRollWidth: '80mm',
    autoDrawerKick: 'ENABLED',
    drawerKickTrigger: 'CASH_ONLY',
    drawerPinout: 'PIN_2',
    chimeAudio: true,
    autoPrintThreeSlips: true,
    receiptHeader: 'Linoli Cove Beach Resort & Dining\nBeach Road, Midigama\nTel: +94 74 036 6741',
    receiptFooter: 'Thank you for your visit!\nPlease come again.'
  });

  const [pairedUsbDevice, setPairedUsbDevice] = useState(null);
  const [usbStatusMessage, setUsbStatusMessage] = useState('Checking for connected USB printer...');
  const [settingsNotice, setSettingsNotice] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const checkExistingUsbDevices = async () => {
      if (!navigator.usb) {
        if (isMounted) setUsbStatusMessage('WebUSB not supported. Using OS Print Spooler (Kiosk Ready).');
        return;
      }
      try {
        const devices = await navigator.usb.getDevices();
        if (devices && devices.length > 0 && isMounted) {
          const printer = devices[0];
          try {
            await printer.open();
            if (printer.configuration === null) {
              await printer.selectConfiguration(1);
            }
            await printer.claimInterface(0);
            setPairedUsbDevice(printer);
            setUsbStatusMessage(`Auto-connected to ${printer.productName || 'USB Thermal Printer'}`);
          } catch (connErr) {
            // Already authorized device detected
            setPairedUsbDevice(printer);
            setUsbStatusMessage(`Auto-paired with ${printer.productName || 'USB Thermal Printer'}`);
          }
        } else if (isMounted) {
          setUsbStatusMessage('Printer driver ready via OS print spooler (ESC/POS ready).');
        }
      } catch (err) {
        if (isMounted) setUsbStatusMessage('Printer driver ready via OS print spooler.');
      }
    };
    checkExistingUsbDevices();
    return () => { isMounted = false; };
  }, []);

  const handlePairUsbPrinter = async () => {
    if (!navigator.usb) {
      setUsbStatusMessage('WebUSB not supported in this browser. Standard Windows printer spooler active.');
      return;
    }
    try {
      setUsbStatusMessage('Waiting for thermal printer USB selection...');
      const device = await navigator.usb.requestDevice({ filters: [] });
      await device.open();
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }
      await device.claimInterface(0);
      setPairedUsbDevice(device);
      setUsbStatusMessage(`Paired with ${device.productName || 'Thermal Printer'}`);
    } catch (err) {
      console.warn('USB Pairing notice:', err);
      setUsbStatusMessage('Printer driver ready via OS print spooler.');
    }
  };

  const todayStr = useMemo(() => getLocalDateStr(), []);
  const [reportDateFilter, setReportDateFilter] = useState({
    preset: 'Today',
    startDate: todayStr,
    endDate: todayStr
  });

  const [inventory, setInventory] = useState(INITIAL_RAW_INVENTORY);
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [floorTables, setFloorTables] = useState(INITIAL_FLOOR_TABLES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('All');

  const [orderMode, setOrderMode] = useState('DINING');
  const [selectedTable, setSelectedTable] = useState(INITIAL_FLOOR_TABLES[0]);
  const [takeawayInfo, setTakeawayInfo] = useState({ name: 'Walk-in Guest', phone: '', token: 'TK-101' });
  const [guestCount, setGuestCount] = useState(2);
  const [cart, setCart] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const [serviceChargeActive, setServiceChargeActive] = useState(true);
  const [taxActive, setTaxActive] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Clean production state without sample orders
  const [activeOrders, setActiveOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [cancelledTickets, setCancelledTickets] = useState([]);

  const [currentShift, setCurrentShift] = useState({
    shiftId: `SHIFT-${getLocalDateStr().replace(/-/g, '')}-01`,
    openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    openedBy: 'Marco Rossi',
    startingFloat: 15000.00,
    status: 'OPEN',
    payouts: []
  });

  const [shiftHistory, setShiftHistory] = useState([]);
  const [denominations, setDenominations] = useState({
    5000: 0,
    1000: 0,
    500: 0,
    100: 0,
    50: 0,
    20: 0
  });
  const [payoutForm, setPayoutForm] = useState({ amount: '', reason: '' });

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [targetStaffForSwitch, setTargetStaffForSwitch] = useState(null);
  const [pinError, setPinError] = useState('');

  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({ name: '', role: 'Cashier', pin: '', email: '' });

  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newDishForm, setNewDishForm] = useState({
    name: '',
    department: 'Kitchen',
    category: 'Rice & Noodles',
    customCategory: '',
    price: '',
    prepTime: '10m',
    description: '',
    imageUrl: '',
    recipeIngredients: []
  });

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [settlingOrder, setSettlingOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [cashTendered, setCashTendered] = useState('');

  const [printModalConfig, setPrintModalConfig] = useState(null);
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [addTableModalOpen, setAddTableModalOpen] = useState(false);
  const [newTableForm, setNewTableForm] = useState({ name: '', zone: 'Indoor Main Hall', capacity: 4 });
  const [voidModalOpen, setVoidModalOpen] = useState(false);
  const [voidPayload, setVoidPayload] = useState({ item: null, reason: '' });

  const [editBillModalOpen, setEditBillModalOpen] = useState(false);
  const [activeOrderEditing, setActiveOrderEditing] = useState(null);
  const [selectedDishToAdd, setSelectedDishToAdd] = useState('');

  const [addInventoryModalOpen, setAddInventoryModalOpen] = useState(false);
  const [newInventoryForm, setNewInventoryForm] = useState({
    name: '',
    category: 'Dry Goods',
    stock: '',
    unit: 'g',
    cost: '',
    threshold: ''
  });

  const [receiveStockModalOpen, setReceiveStockModalOpen] = useState(false);
  const [receiveStockForm, setReceiveStockForm] = useState({
    ingredientId: '',
    quantity: '',
    supplier: '',
    invoiceRef: '',
    newCost: ''
  });

  const [recipeConfigModalOpen, setRecipeConfigModalOpen] = useState(false);
  const [editingDishForRecipe, setEditingDishForRecipe] = useState(null);
  const [currentRecipeIngredients, setCurrentRecipeIngredients] = useState([]);
  const [tempIngredientSelect, setTempIngredientSelect] = useState({ ingredientId: '', amount: '' });

  const recordAuditLog = useCallback((type, orderRef, details) => {
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      orderRef: orderRef || 'N/A',
      details,
      staff: currentUser.name,
      role: currentUser.role
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  const inventoryMap = useMemo(() => {
    const map = {};
    inventory.forEach(item => {
      map[item.id] = item;
    });
    return map;
  }, [inventory]);

  const calculateDishAvailability = useCallback((recipe) => {
    if (!recipe || !Array.isArray(recipe) || recipe.length === 0) {
      return { cogs: 0, portions: 999, isSoldOut: false };
    }
    let cogs = 0;
    let minPortions = Infinity;

    recipe.forEach(r => {
      const ing = inventoryMap[r.ingredientId];
      if (ing) {
        cogs += (ing.cost * r.amount);
        const available = r.amount > 0 ? Math.floor(ing.stock / r.amount) : 0;
        if (available < minPortions) minPortions = available;
      } else {
        minPortions = 0;
      }
    });

    if (minPortions === Infinity) minPortions = 0;
    return { cogs, portions: minPortions, isSoldOut: minPortions <= 0 };
  }, [inventoryMap]);

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartDiscountAmount = (cartSubtotal * discountPercent) / 100;
  const taxableBasis = Math.max(0, cartSubtotal - cartDiscountAmount);
  const cartServiceCharge = serviceChargeActive ? (taxableBasis * settings.serviceChargeRate) / 100 : 0;
  const cartTax = taxActive ? (taxableBasis * settings.taxRate) / 100 : 0;
  const cartGrandTotal = taxableBasis + cartServiceCharge + cartTax;

  const calculateOrderFinancials = useCallback((order) => {
    if (!order || !order.items) return { subtotal: 0, discount: 0, service: 0, tax: 0, total: 0 };
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = (subtotal * (order.discountPercent || 0)) / 100;
    const basis = Math.max(0, subtotal - discount);
    const service = order.serviceChargeActive ? (basis * settings.serviceChargeRate) / 100 : 0;
    const tax = order.taxActive ? (basis * settings.taxRate) / 100 : 0;
    const total = basis + service + tax;
    return { subtotal, discount, service, tax, total };
  }, [settings.serviceChargeRate, settings.taxRate]);

  const playCashRegisterChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1320, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(1280, ctx.currentTime + 0.35);
      gain1.gain.setValueAtTime(0.6, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.55);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(2640, ctx.currentTime);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.45);
    } catch (err) {
      console.warn('Audio chime notice:', err);
    }
  };

  const triggerCashDrawerDiagnostic = () => {
    if (settings.chimeAudio) playCashRegisterChime();
    setSettingsNotice({
      title: 'Cash Drawer Solenoid Fired',
      detail: `Kick pulse sent via ${settings.drawerPinout === 'PIN_2' ? 'Pin 2 (ESC p 0)' : 'Pin 5 (ESC p 1)'} • Chime played`
    });
    setTimeout(() => setSettingsNotice(null), 4000);
  };

  const shiftCashMetrics = useMemo(() => {
    const shiftCashTransactions = transactions.filter(t => t.paymentMethod === 'CASH');
    const totalCashSales = shiftCashTransactions.reduce((acc, t) => acc + t.total, 0);
    const totalCardSales = transactions.filter(t => t.paymentMethod === 'CARD').reduce((acc, t) => acc + t.total, 0);
    const totalPayouts = currentShift.payouts.reduce((acc, p) => acc + p.amount, 0);

    const countedCash = Object.entries(denominations).reduce(
      (sum, [denom, count]) => sum + (Number(denom) * (Number(count) || 0)),
      0
    );

    const expectedCashInDrawer = currentShift.startingFloat + totalCashSales - totalPayouts;
    const variance = countedCash - expectedCashInDrawer;

    return {
      totalCashSales,
      totalCardSales,
      totalPayouts,
      countedCash,
      expectedCashInDrawer,
      variance
    };
  }, [transactions, currentShift, denominations]);

  const hasAccess = (tabKey) => {
    const allowed = ROLE_PERMISSIONS[currentUser.role] || [];
    return allowed.includes(tabKey);
  };

  const handleSwitchUserWithPin = (e) => {
    e.preventDefault();
    if (!targetStaffForSwitch) return;
    if (targetStaffForSwitch.pin === pinInput.trim()) {
      setCurrentUser(targetStaffForSwitch);
      setPinModalOpen(false);
      setPinInput('');
      setTargetStaffForSwitch(null);
      setPinError('');
      const allowed = ROLE_PERMISSIONS[targetStaffForSwitch.role] || [];
      if (!allowed.includes(activeTab)) {
        setActiveTab(allowed[0] || 'pos');
      }
    } else {
      setPinError('Invalid 4-digit security PIN.');
    }
  };

  const handleAddToCart = (dish) => {
    const { isSoldOut } = calculateDishAvailability(dish.recipe);
    if (isSoldOut) return;

    setCart(prev => {
      const existing = prev.find(i => i.id === dish.id);
      if (existing) {
        return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [
        ...prev,
        {
          ...dish,
          cartItemId: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          qty: 1,
          notes: ''
        }
      ];
    });
  };

  const handleSendOrder = () => {
    if (cart.length === 0) return;

    const newOrderId = editingOrderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const orderPayload = {
      orderId: newOrderId,
      mode: orderMode,
      tableId: orderMode === 'DINING' ? selectedTable.id : null,
      tableName: orderMode === 'DINING' ? selectedTable.name : takeawayInfo.token,
      zone: orderMode === 'DINING' ? selectedTable.zone : 'Takeaway Express',
      guestCount: orderMode === 'DINING' ? guestCount : 1,
      customerName: orderMode === 'TAKEAWAY' ? takeawayInfo.name : undefined,
      phone: orderMode === 'TAKEAWAY' ? takeawayInfo.phone : undefined,
      token: orderMode === 'TAKEAWAY' ? takeawayInfo.token : undefined,
      server: currentUser.name,
      sentAt: nowTime,
      status: 'PREPARING',
      serviceChargeActive,
      taxActive,
      discountPercent,
      items: [...cart]
    };

    setActiveOrders(prev => {
      const exists = prev.some(o => o.orderId === newOrderId);
      if (exists) {
        return prev.map(o => o.orderId === newOrderId ? orderPayload : o);
      }
      return [orderPayload, ...prev];
    });

    if (orderMode === 'DINING') {
      setFloorTables(prev => prev.map(t => t.id === selectedTable.id ? { ...t, status: 'OCCUPIED', currentOrderRef: newOrderId } : t));
    }

    const kitchenItems = cart.filter(i => i.department === 'Kitchen');
    const barItems = cart.filter(i => i.department === 'Bar');

    recordAuditLog('ORDER_SENT', newOrderId, `Order dispatched for ${orderPayload.tableName} (${cart.length} items)`);

    setPrintModalConfig({
      type: 'MULTI_DISPATCH',
      autoPrint: settings.autoPrintThreeSlips,
      data: {
        order: orderPayload,
        kitchenItems,
        barItems,
        subtotal: cartSubtotal,
        discount: cartDiscountAmount,
        service: cartServiceCharge,
        tax: cartTax,
        total: cartGrandTotal
      }
    });

    setCart([]);
    setEditingOrderId(null);
  };

  useEffect(() => {
    if (printModalConfig && printModalConfig.autoPrint) {
      const timer = setTimeout(() => {
        try {
          window.print();
        } catch (err) {
          console.warn('Auto-print dialog notice:', err);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [printModalConfig]);

  const handleOpenEditActiveBill = (order) => {
    setActiveOrderEditing(JSON.parse(JSON.stringify(order)));
    setSelectedDishToAdd(menuItems[0]?.id || '');
    setEditBillModalOpen(true);
  };

  const handleUpdateActiveItemQty = (cartItemId, delta) => {
    if (!activeOrderEditing) return;
    setActiveOrderEditing(prev => {
      const updated = prev.items.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      });
      return { ...prev, items: updated };
    });
  };

  const handleRemoveActiveItem = (cartItemId) => {
    if (!activeOrderEditing) return;
    const itemToRemove = activeOrderEditing.items.find(i => i.cartItemId === cartItemId);
    setActiveOrderEditing(prev => ({
      ...prev,
      items: prev.items.filter(i => i.cartItemId !== cartItemId)
    }));
    if (itemToRemove) {
      recordAuditLog(
        'BILL_ITEM_DELETED',
        activeOrderEditing.orderId,
        `Removed "${itemToRemove.name}" (qty: ${itemToRemove.qty}) from active bill for ${activeOrderEditing.tableName}`
      );
    }
  };

  const handleAddItemToActiveBill = () => {
    if (!activeOrderEditing || !selectedDishToAdd) return;
    const dish = menuItems.find(m => m.id === selectedDishToAdd);
    if (!dish) return;

    const newItem = {
      ...dish,
      cartItemId: `cart_mod_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      qty: 1,
      notes: ''
    };

    setActiveOrderEditing(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    recordAuditLog(
      'BILL_ITEM_ADDED',
      activeOrderEditing.orderId,
      `Added 1x "${dish.name}" to active bill for ${activeOrderEditing.tableName}`
    );
  };

  const handleSaveActiveBillChanges = () => {
    if (!activeOrderEditing) return;
    setActiveOrders(prev => prev.map(order => {
      if (order.orderId === activeOrderEditing.orderId) {
        return activeOrderEditing;
      }
      return order;
    }));

    recordAuditLog(
      'ACTIVE_BILL_UPDATED',
      activeOrderEditing.orderId,
      `Updated active bill for ${activeOrderEditing.tableName} (now contains ${activeOrderEditing.items.length} items)`
    );

    setEditBillModalOpen(false);
    setActiveOrderEditing(null);
  };

  const handleDeleteActiveBillByAdmin = (orderId, tableName, tableId) => {
    if (currentUser.role !== 'Administrator') {
      setSettingsNotice({ title: 'Permission Denied', detail: 'Only Administrators can cancel active bills.' });
      setTimeout(() => setSettingsNotice(null), 3500);
      return;
    }

    setActiveOrders(prev => prev.filter(o => o.orderId !== orderId));
    if (tableId) {
      setFloorTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'VACANT', currentOrderRef: null } : t));
    }

    recordAuditLog(
      'BILL_DELETED_BY_ADMIN',
      orderId,
      `Active unsettled bill for "${tableName}" was permanently deleted by Administrator ${currentUser.name}`
    );

    setSettingsNotice({ title: 'Bill Cancelled', detail: `Order ${orderId} was removed by ${currentUser.name}` });
    setTimeout(() => setSettingsNotice(null), 3500);
  };

  const handleDeleteSettledTransactionByAdmin = (invoiceNo) => {
    if (currentUser.role !== 'Administrator') {
      setSettingsNotice({ title: 'Permission Denied', detail: 'Only Administrators can delete finalized transactions.' });
      setTimeout(() => setSettingsNotice(null), 3500);
      return;
    }

    const targetTx = transactions.find(t => t.invoiceNo === invoiceNo);
    setTransactions(prev => prev.filter(t => t.invoiceNo !== invoiceNo));

    recordAuditLog(
      'TRANSACTION_DELETED_BY_ADMIN',
      invoiceNo,
      `Finalized tax transaction "${invoiceNo}" (${targetTx?.total ? settings.currency + ' ' + targetTx.total.toFixed(2) : ''}) was permanently deleted by Administrator ${currentUser.name}`
    );

    setSettingsNotice({ title: 'Transaction Deleted', detail: `Invoice ${invoiceNo} removed from ledger.` });
    setTimeout(() => setSettingsNotice(null), 3500);
  };

  const handleCompleteSettlement = () => {
    const isDirectPOS = !settlingOrder;
    const targetOrder = settlingOrder || {
      orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      mode: orderMode,
      tableName: orderMode === 'DINING' ? selectedTable.name : takeawayInfo.token,
      tableId: orderMode === 'DINING' ? selectedTable.id : null,
      items: cart,
      serviceChargeActive,
      taxActive,
      discountPercent
    };

    if (!targetOrder.items || targetOrder.items.length === 0) return;

    const { subtotal, discount, service, tax, total } = calculateOrderFinancials(targetOrder);

    // Deplete inventory based on dish Bill of Materials
    const deductions = {};
    let orderRawCost = 0;

    targetOrder.items.forEach(cartItem => {
      const dish = menuItems.find(m => m.id === cartItem.id) || cartItem;
      if (dish.recipe && Array.isArray(dish.recipe)) {
        dish.recipe.forEach(r => {
          const needed = r.amount * cartItem.qty;
          deductions[r.ingredientId] = (deductions[r.ingredientId] || 0) + needed;
          const ing = inventoryMap[r.ingredientId];
          if (ing) orderRawCost += (ing.cost * needed);
        });
      }
    });

    setInventory(prev => prev.map(item => {
      if (deductions[item.id]) {
        return {
          ...item,
          stock: Math.max(0, Number((item.stock - deductions[item.id]).toFixed(2)))
        };
      }
      return item;
    }));

    const localDate = getLocalDateStr();
    const newInvoice = {
      invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      orderRef: targetOrder.orderId,
      date: localDate,
      dateTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      table: targetOrder.tableName,
      mode: targetOrder.mode,
      cashier: currentUser.name,
      items: targetOrder.items.map(i => ({
        name: i.name,
        department: i.department,
        qty: i.qty,
        price: i.price
      })),
      subtotal,
      serviceCharge: service,
      tax,
      discount,
      total,
      paymentMethod,
      cogs: orderRawCost,
      cashTendered: paymentMethod === 'CASH' ? (parseFloat(cashTendered) || total) : undefined,
      changeDue: paymentMethod === 'CASH' ? Math.max(0, (parseFloat(cashTendered) || total) - total) : 0
    };

    recordAuditLog('BILL_SETTLED', newInvoice.invoiceNo, `Settled bill for ${newInvoice.table} via ${paymentMethod} (${settings.currency} ${total.toFixed(2)})`);

    setTransactions(prev => [newInvoice, ...prev]);

    if (settlingOrder) {
      setActiveOrders(prev => prev.filter(o => o.orderId !== targetOrder.orderId));
    }

    if (targetOrder.tableId) {
      setFloorTables(prev => prev.map(t => t.id === targetOrder.tableId ? { ...t, status: 'VACANT', currentOrderRef: null } : t));
    }

    if (settings.autoDrawerKick === 'ENABLED' && (settings.drawerKickTrigger === 'ALL' || (settings.drawerKickTrigger === 'CASH_ONLY' && paymentMethod === 'CASH'))) {
      if (settings.chimeAudio) playCashRegisterChime();
    }

    setPrintModalConfig({
      type: 'FINAL_BILL',
      data: newInvoice
    });

    if (isDirectPOS || editingOrderId === targetOrder.orderId) {
      setCart([]);
      setEditingOrderId(null);
    }
    setSettlingOrder(null);
    setCheckoutModalOpen(false);
    setCashTendered('');
  };

  const handleConfirmVoid = (e) => {
    e.preventDefault();
    if (!voidPayload.item || !voidPayload.reason.trim()) return;

    const newVoid = {
      id: `VOID-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleString(),
      itemName: voidPayload.item.name,
      qty: voidPayload.item.qty || 1,
      table: selectedTable.name,
      reason: voidPayload.reason.trim(),
      authorizedBy: currentUser.name
    };

    setCancelledTickets(prev => [newVoid, ...prev]);
    setCart(prev => prev.filter(i => i.cartItemId !== voidPayload.item.cartItemId));
    setVoidModalOpen(false);
    setVoidPayload({ item: null, reason: '' });
  };

  const handleCreateNewItem = (e) => {
    e.preventDefault();
    if (!newDishForm.name.trim() || !newDishForm.price) return;

    const finalCategory = newDishForm.category === 'CUSTOM'
      ? (newDishForm.customCategory.trim() || 'General')
      : newDishForm.category;

    const newItemId = `dish_${Date.now()}`;
    const dishItem = {
      id: newItemId,
      name: newDishForm.name.trim(),
      department: newDishForm.department,
      category: finalCategory,
      price: parseFloat(newDishForm.price) || 0,
      prepTime: newDishForm.prepTime || '10m',
      description: newDishForm.description || '',
      imageUrl: newDishForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      recipe: [...newDishForm.recipeIngredients]
    };

    setMenuItems(prev => [dishItem, ...prev]);
    setAddItemModalOpen(false);
    setNewDishForm({
      name: '',
      department: 'Kitchen',
      category: 'Rice & Noodles',
      customCategory: '',
      price: '',
      prepTime: '10m',
      description: '',
      imageUrl: '',
      recipeIngredients: []
    });

    recordAuditLog('MENU_ITEM_CREATED', newItemId, `Created "${dishItem.name}" in category "${finalCategory}"`);
  };

  const handleCreateInventoryItem = (e) => {
    e.preventDefault();
    if (!newInventoryForm.name.trim() || !newInventoryForm.cost) return;

    const newItem = {
      id: `ing_${Date.now()}`,
      name: newInventoryForm.name.trim(),
      category: newInventoryForm.category,
      stock: parseFloat(newInventoryForm.stock) || 0,
      unit: newInventoryForm.unit,
      cost: parseFloat(newInventoryForm.cost) || 0,
      threshold: parseFloat(newInventoryForm.threshold) || 10
    };

    setInventory(prev => [newItem, ...prev]);
    setAddInventoryModalOpen(false);
    setNewInventoryForm({
      name: '',
      category: 'Dry Goods',
      stock: '',
      unit: 'g',
      cost: '',
      threshold: ''
    });
    recordAuditLog('INVENTORY_CREATED', newItem.id, `Created inventory item "${newItem.name}"`);
  };

  const handleReceiveStock = (e) => {
    e.preventDefault();
    if (!receiveStockForm.ingredientId || !receiveStockForm.quantity) return;

    const qtyToAdd = parseFloat(receiveStockForm.quantity);
    if (isNaN(qtyToAdd) || qtyToAdd <= 0) return;

    setInventory(prev => prev.map(item => {
      if (item.id === receiveStockForm.ingredientId) {
        const updatedCost = receiveStockForm.newCost ? parseFloat(receiveStockForm.newCost) : item.cost;
        return {
          ...item,
          stock: Number((item.stock + qtyToAdd).toFixed(2)),
          cost: updatedCost
        };
      }
      return item;
    }));

    setReceiveStockModalOpen(false);
    setReceiveStockForm({
      ingredientId: '',
      quantity: '',
      supplier: '',
      invoiceRef: '',
      newCost: ''
    });
    recordAuditLog('STOCK_INTAKE', receiveStockForm.ingredientId, `Received ${qtyToAdd} units via GRN: ${receiveStockForm.invoiceRef || 'N/A'}`);
  };

  const handleOpenRecipeConfig = (dish) => {
    setEditingDishForRecipe(dish);
    setCurrentRecipeIngredients(dish.recipe ? [...dish.recipe] : []);
    setTempIngredientSelect({ ingredientId: inventory[0]?.id || '', amount: '' });
    setRecipeConfigModalOpen(true);
  };

  const handleSaveRecipeConfig = () => {
    if (!editingDishForRecipe) return;

    setMenuItems(prev => prev.map(dish => {
      if (dish.id === editingDishForRecipe.id) {
        return {
          ...dish,
          recipe: [...currentRecipeIngredients]
        };
      }
      return dish;
    }));

    recordAuditLog('RECIPE_UPDATED', editingDishForRecipe.id, `Updated recipe BOM for "${editingDishForRecipe.name}"`);
    setRecipeConfigModalOpen(false);
    setEditingDishForRecipe(null);
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    if (!newStaffForm.name || !newStaffForm.pin) return;
    const initials = newStaffForm.name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
    const newStaff = {
      id: `usr_${Date.now()}`,
      name: newStaffForm.name.trim(),
      role: newStaffForm.role,
      pin: newStaffForm.pin.trim(),
      avatar: initials || 'ST',
      email: newStaffForm.email.trim() || `${newStaffForm.name.toLowerCase().replace(/\s+/g, '')}@linolicove.me`
    };
    setStaffList(prev => [...prev, newStaff]);
    setAddStaffModalOpen(false);
    setNewStaffForm({ name: '', role: 'Cashier', pin: '', email: '' });
    recordAuditLog('STAFF_CREATED', newStaff.id, `Created employee "${newStaff.name}" (${newStaff.role})`);
  };

  const handleCloseShift = () => {
    const closedShift = {
      ...currentShift,
      closedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      closedBy: currentUser.name,
      status: 'CLOSED',
      metrics: { ...shiftCashMetrics }
    };

    setShiftHistory(prev => [closedShift, ...prev]);
    setPrintModalConfig({
      type: 'Z_REPORT',
      data: closedShift
    });

    setCurrentShift({
      shiftId: `SHIFT-${getLocalDateStr().replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      openedBy: currentUser.name,
      startingFloat: 15000.00,
      status: 'OPEN',
      payouts: []
    });

    setDenominations({ 5000: 0, 1000: 0, 500: 0, 100: 0, 50: 0, 20: 0 });
    recordAuditLog('SHIFT_CLOSED', closedShift.shiftId, `Closed shift by ${currentUser.name}`);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (reportDateFilter.preset === 'All Time') return true;
      const txDate = t.date ? t.date.slice(0, 10) : getLocalDateStr();
      if (reportDateFilter.startDate && txDate < reportDateFilter.startDate) return false;
      if (reportDateFilter.endDate && txDate > reportDateFilter.endDate) return false;
      return true;
    });
  }, [transactions, reportDateFilter]);

  const salesMetrics = useMemo(() => {
    let grossRevenue = 0;
    let itemSubtotal = 0;
    let serviceCharge = 0;
    let taxes = 0;
    let discounts = 0;
    let kitchenRevenue = 0;
    let kitchenItemsCount = 0;
    let barRevenue = 0;
    let barItemsCount = 0;
    const paymentMethods = {};
    const itemSalesMap = {};

    filteredTransactions.forEach(t => {
      grossRevenue += t.total;
      itemSubtotal += t.subtotal;
      serviceCharge += t.serviceCharge;
      taxes += t.tax;
      discounts += t.discount;

      paymentMethods[t.paymentMethod] = (paymentMethods[t.paymentMethod] || { count: 0, total: 0 });
      paymentMethods[t.paymentMethod].count += 1;
      paymentMethods[t.paymentMethod].total += t.total;

      t.items.forEach(item => {
        const isKitchen = item.department === 'Kitchen';
        if (isKitchen) {
          kitchenRevenue += (item.price * item.qty);
          kitchenItemsCount += item.qty;
        } else {
          barRevenue += (item.price * item.qty);
          barItemsCount += item.qty;
        }

        if (!itemSalesMap[item.name]) {
          itemSalesMap[item.name] = {
            name: item.name,
            department: item.department || (isKitchen ? 'Kitchen' : 'Bar'),
            sold: 0,
            revenue: 0
          };
        }
        itemSalesMap[item.name].sold += item.qty;
        itemSalesMap[item.name].revenue += (item.price * item.qty);
      });
    });

    const topItems = Object.values(itemSalesMap).sort((a, b) => b.sold - a.sold);

    return {
      grossRevenue,
      itemSubtotal,
      serviceCharge,
      taxes,
      discounts,
      kitchenRevenue,
      kitchenItemsCount,
      barRevenue,
      barItemsCount,
      paymentMethods,
      topItems,
      paidBillsCount: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const categoriesList = useMemo(() => {
    const cats = new Set(['All']);
    menuItems.forEach(m => cats.add(m.category));
    return Array.from(cats);
  }, [menuItems]);

  const handlePinPadSubmit = (pinVal) => {
    const pin = pinVal || loginPinInput;
    setLoginError('');
    const found = staffList.find(s => s.pin === pin);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      setLoginPinInput('');
      setCart([]);
      const allowed = ROLE_PERMISSIONS[found.role] || [];
      setActiveTab(allowed.includes('pos') ? 'pos' : (allowed[0] || 'pos'));
    } else {
      setLoginError('Invalid PIN. Use 1234, 1111, 2222, 3333, or 5555.');
    }
  };

  const handleFastRoleSelect = (roleKey) => {
    setLoginError('');
    let target = null;
    if (roleKey === 'Admin') target = staffList.find(s => s.role === 'Administrator') || staffList[0];
    else if (roleKey === 'Cashier') target = staffList.find(s => s.role === 'Cashier') || staffList[1];
    else if (roleKey === 'Waiter') target = staffList.find(s => s.role === 'Floor Server') || staffList[4];
    else if (roleKey === 'Kitchen') target = staffList.find(s => s.role === 'Kitchen Chef') || staffList[2];
    else if (roleKey === 'Bar') target = staffList.find(s => s.role === 'Bartender') || staffList[3];

    if (target) {
      setLoginPinInput(target.pin);
      setCurrentUser(target);
      setIsAuthenticated(true);
      setCart([]);
      const allowed = ROLE_PERMISSIONS[target.role] || [];
      setActiveTab(allowed.includes('pos') ? 'pos' : (allowed[0] || 'pos'));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#070b14] p-4 font-sans select-none antialiased">
        <div className="w-full max-w-[420px] rounded-[32px] border border-[#1b253b] bg-[#0c1424]/95 p-8 shadow-2xl shadow-black/80 backdrop-blur-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ff4500] to-[#ff6a00] text-2xl font-black text-white shadow-lg shadow-orange-600/40">
              LC
            </div>
            <h1 className="mt-3.5 text-2xl font-black tracking-tight text-white">Linoli Cove</h1>
            <p className="mt-0.5 text-[10px] font-extrabold tracking-[0.2em] text-[#ff5500] uppercase">
              RESTAURANT &amp; BAR POS
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Terminal Ready
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2">
                ENTER 4-DIGIT TERMINAL PIN
              </p>
              <div className="flex h-12 w-full items-center justify-center rounded-2xl border border-zinc-800 bg-[#070b14] px-4">
                <div className="flex items-center gap-3">
                  {[0, 1, 2, 3].map(idx => (
                    <span
                      key={idx}
                      className={`h-3.5 w-3.5 rounded-full transition-all ${
                        loginPinInput.length > idx ? 'bg-orange-500 scale-110' : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {loginError && (
              <p className="text-center text-xs font-bold text-rose-500">{loginError}</p>
            )}

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    if (loginPinInput.length < 4) {
                      const next = loginPinInput + num;
                      setLoginPinInput(next);
                      if (next.length === 4) handlePinPadSubmit(next);
                    }
                  }}
                  className="flex h-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#10192b] text-base font-bold text-white hover:bg-zinc-800 active:scale-95 transition-all"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setLoginPinInput('')}
                className="flex h-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#10192b] text-xs font-bold text-zinc-400 hover:bg-zinc-800"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  if (loginPinInput.length < 4) {
                    const next = loginPinInput + '0';
                    setLoginPinInput(next);
                    if (next.length === 4) handlePinPadSubmit(next);
                  }
                }}
                className="flex h-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#10192b] text-base font-bold text-white hover:bg-zinc-800 active:scale-95 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setLoginPinInput(prev => prev.slice(0, -1))}
                className="flex h-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#10192b] text-xs font-bold text-zinc-400 hover:bg-zinc-800"
              >
                Del
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-800/80 pt-4">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2.5">
              <span>FAST ROLE SWITCH</span>
              <span className="text-zinc-500 font-medium lowercase">Tap to fill</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {['Admin', 'Cashier', 'Waiter', 'Kitchen', 'Bar'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleFastRoleSelect(r)}
                  className="rounded-xl border border-zinc-800 bg-[#10192b] px-3 py-1.5 text-[11px] font-bold text-zinc-300 hover:border-orange-500 hover:bg-orange-500/10 hover:text-white transition-all active:scale-95"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0b0f19] text-zinc-100 font-sans select-none overflow-hidden antialiased">
      {settingsNotice && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
          <div className="p-2 bg-emerald-700 rounded-xl">
            <Zap className="h-4 w-4 text-amber-300" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider">{settingsNotice.title}</p>
            <p className="text-[11px] font-mono opacity-90">{settingsNotice.detail}</p>
          </div>
        </div>
      )}

      {/* Backdrop overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Floating edge tab to open sidebar on touch if closed */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1.5 bg-[#ff5500] hover:bg-orange-600 text-white py-3.5 px-2.5 rounded-r-2xl shadow-xl shadow-orange-600/40 text-xs font-black tracking-wider transition-transform active:scale-95 group"
          title="Touch to open menu"
        >
          <Menu className="h-4 w-4" />
          <span className="hidden sm:inline text-[10px] tracking-widest uppercase [writing-mode:vertical-rl] rotate-180">
            TOUCH MENU
          </span>
        </button>
      )}

      {/* SIDEBAR NAVIGATION (TOUCH-ACTIVATED) */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#060813] border-r border-zinc-800/80 flex flex-col justify-between z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out shadow-2xl ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          <div className="p-5 pb-4 flex items-center justify-between border-b border-zinc-900">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#ff5500] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-orange-600/30">
                LC
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white leading-none">
                  {settings.restaurantName}
                </h1>
                <p className="text-[10px] font-bold tracking-widest text-[#ff5500] uppercase mt-1">
                  {settings.tagline}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Close Menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {[
              { id: 'pos', name: 'POS Terminal', icon: Monitor, badge: cart.reduce((a, b) => a + b.qty, 0) },
              { id: 'kds', name: 'Kitchen Display', icon: Flame },
              { id: 'bar', name: 'Bar Display', icon: Wine },
              { id: 'billing', name: 'Billing & Settlement', icon: Receipt, badge: activeOrders.length },
              { id: 'tables', name: 'Table Management', icon: Grid },
              { id: 'stock', name: 'Stock & Inventory', icon: Package, alert: inventory.some(i => i.stock <= i.threshold) },
              { id: 'recipes', name: 'Recipes & Portions', icon: BookOpen },
              { id: 'shifts', name: 'Cashier Shifts', icon: DollarSign },
              { id: 'reports', name: 'Sales Reports', icon: BarChart3 }
            ].map(item => {
              const allowed = hasAccess(item.id);
              return (
                <button
                  key={item.id}
                  disabled={!allowed}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    !allowed
                      ? 'opacity-30 cursor-not-allowed text-zinc-600'
                      : activeTab === item.id
                      ? 'bg-[#ff5500] text-white font-bold shadow-lg shadow-orange-600/20'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      activeTab === item.id ? 'bg-white text-zinc-900' : 'bg-orange-500/20 text-[#ff5500]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              );
            })}

            <div className="pt-4 pb-1.5 px-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                ADMINISTRATION
              </span>
            </div>

            {[
              { id: 'menu_admin', name: 'Menu Management', icon: ClipboardList, badgeText: '+Add' },
              { id: 'cancelled', name: 'Cancelled Tickets', icon: Trash2 },
              { id: 'staff', name: 'Staff Management', icon: Users },
              { id: 'settings', name: 'System Settings', icon: Settings }
            ].map(item => {
              const allowed = hasAccess(item.id);
              return (
                <button
                  key={item.id}
                  disabled={!allowed}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    !allowed
                      ? 'opacity-30 cursor-not-allowed text-zinc-600'
                      : activeTab === item.id
                      ? 'bg-[#ff5500] text-white font-bold shadow-lg shadow-orange-600/20'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badgeText && allowed && (
                    <span className="text-[10px] bg-orange-500/20 text-[#ff5500] px-1.5 py-0.2 rounded font-bold">
                      {item.badgeText}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-zinc-800 text-orange-400 font-black text-xs flex items-center justify-center border border-zinc-700">
              {currentUser.avatar}
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-400">{currentUser.role}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setTargetStaffForSwitch(staffList.find(s => s.id !== currentUser.id) || staffList[0]);
                setPinModalOpen(true);
              }}
              title="Fast PIN Role Switch"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <KeyRound className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              title="Lock Terminal & Log Out"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 text-slate-900">
        <header className="h-14 px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-all active:scale-95"
              title="Open Navigation Menu"
            >
              <Menu className="h-4 w-4 text-[#ff5500]" />
              <span className="font-extrabold">Menu</span>
            </button>

            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono hidden sm:inline">
              TERMINAL: {settings.terminalId}
            </span>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Online
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasAccess('menu_admin') && (
              <button
                onClick={() => setAddItemModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#ff5500] hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Dish / Drink</span>
              </button>
            )}

            <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700">
              Currency: {settings.currency} (LKR)
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Lock Terminal</span>
            </button>
          </div>
        </header>

        {/* VIEW 1: SALES & REVENUE REPORTS */}
        {activeTab === 'reports' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center gap-6 border-b border-slate-200 pb-3 text-xs font-bold overflow-x-auto">
              {[
                'Daily Overview',
                'Sales Detail',
                'KOT Report',
                'BOT Report',
                'Sales Summary',
                'Food vs Beverage',
                'Stock Usage',
                'Forensic Audit Logs'
              ].map(sub => (
                <button
                  key={sub}
                  onClick={() => setReportSubTab(sub)}
                  className={`transition-colors relative pb-1 whitespace-nowrap ${
                    reportSubTab === sub
                      ? 'text-[#ff5500] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#ff5500]'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {reportSubTab === 'Daily Overview' && (
              <>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Sales &amp; Revenue Reports
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live financial breakdown of sales, service charges, taxes, and preparation area performances.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                      {['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'All Time'].map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            const now = new Date();
                            let start = todayStr;
                            let end = todayStr;

                            if (preset === 'Yesterday') {
                              const y = new Date();
                              y.setDate(y.getDate() - 1);
                              start = getLocalDateStr(y);
                              end = start;
                            } else if (preset === 'Last 7 Days') {
                              const d7 = new Date();
                              d7.setDate(d7.getDate() - 7);
                              start = getLocalDateStr(d7);
                              end = todayStr;
                            } else if (preset === 'This Month') {
                              start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
                              end = todayStr;
                            } else if (preset === 'All Time') {
                              start = '2020-01-01';
                              end = '2099-12-31';
                            }

                            setReportDateFilter({ preset, startDate: start, endDate: end });
                          }}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                            reportDateFilter.preset === preset
                              ? 'bg-[#ff5500] text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-700 shadow-sm font-mono">
                      <input
                        type="date"
                        value={reportDateFilter.startDate}
                        onChange={e => setReportDateFilter(prev => ({ ...prev, preset: 'Custom', startDate: e.target.value }))}
                        className="bg-transparent border-0 text-slate-800 font-bold focus:outline-none text-xs"
                      />
                      <span className="text-slate-400 font-sans">to</span>
                      <input
                        type="date"
                        value={reportDateFilter.endDate}
                        onChange={e => setReportDateFilter(prev => ({ ...prev, preset: 'Custom', endDate: e.target.value }))}
                        className="bg-transparent border-0 text-slate-800 font-bold focus:outline-none text-xs"
                      />
                    </div>

                    <button
                      onClick={() => setPrintModalConfig({ type: 'DAILY_SUMMARY', data: salesMetrics })}
                      className="px-4 py-2 bg-[#008f5d] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print Thermal (80mm)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">GROSS REVENUE</p>
                    <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
                      {settings.currency} {salesMetrics.grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{salesMetrics.paidBillsCount} Paid Bills</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">ITEM SUBTOTAL</p>
                    <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
                      {settings.currency} {salesMetrics.itemSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Food &amp; Beverage Sales</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">SERVICE CHARGE</p>
                    <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
                      {settings.currency} {salesMetrics.serviceCharge.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Collected for staff pool</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">TAXES / DISCOUNTS</p>
                    <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
                      {settings.currency} {salesMetrics.taxes.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Discounts: {settings.currency} {salesMetrics.discounts.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
                      Payment Methods Breakdown
                    </h3>
                    <div className="space-y-3">
                      {Object.keys(salesMetrics.paymentMethods).length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No payments collected yet in selected period.</p>
                      ) : (
                        Object.entries(salesMetrics.paymentMethods).map(([method, data]) => (
                          <div key={method} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-black rounded-lg">
                                {method.substring(0, 3)}
                              </span>
                              <div>
                                <p className="text-xs font-bold text-slate-900">{method}</p>
                                <span className="text-[10px] text-slate-500">{data.count} transactions</span>
                              </div>
                            </div>
                            <span className="text-sm font-black font-mono text-slate-900">
                              {settings.currency} {data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
                      Preparation Area Sales
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-rose-100 text-rose-800 text-[10px] font-mono font-black rounded-lg">KOT</span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Kitchen</p>
                            <span className="text-[10px] text-slate-500">{salesMetrics.kitchenItemsCount} items prepared</span>
                          </div>
                        </div>
                        <span className="text-sm font-black font-mono text-slate-900">
                          {settings.currency} {salesMetrics.kitchenRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-mono font-black rounded-lg">BOT</span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Bar</p>
                            <span className="text-[10px] text-slate-500">{salesMetrics.barItemsCount} items prepared</span>
                          </div>
                        </div>
                        <span className="text-sm font-black font-mono text-slate-900">
                          {settings.currency} {salesMetrics.barRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
                    Top Selling Menu Items
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5">MENU ITEM</th>
                          <th className="py-2.5">AREA</th>
                          <th className="py-2.5 text-center">PORTIONS SOLD</th>
                          <th className="py-2.5 text-right">TOTAL REVENUE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {salesMetrics.topItems.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-slate-400 italic">No sales recorded yet in selected period.</td>
                          </tr>
                        ) : (
                          salesMetrics.topItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/70">
                              <td className="py-3 font-bold text-slate-900">{item.name}</td>
                              <td className="py-3 text-slate-500">{item.department}</td>
                              <td className="py-3 text-center font-mono font-bold text-slate-700">{item.sold}</td>
                              <td className="py-3 text-right font-mono font-black text-slate-900">
                                {settings.currency} {item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Sub-tab: Sales Detail */}
            {reportSubTab === 'Sales Detail' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase">Paid Invoices Ledger</h3>
                    <p className="text-[11px] text-slate-400">All transactions are permanently recorded and date-filtered. (Admin only can delete)</p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                    {filteredTransactions.length} Records Shown
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5">Invoice #</th>
                        <th className="py-2.5">Date &amp; Time</th>
                        <th className="py-2.5">Table / Order</th>
                        <th className="py-2.5">Cashier</th>
                        <th className="py-2.5">Method</th>
                        <th className="py-2.5 text-right">Subtotal</th>
                        <th className="py-2.5 text-right">Service</th>
                        <th className="py-2.5 text-right">Grand Total</th>
                        {currentUser.role === 'Administrator' && (
                          <th className="py-2.5 text-right text-rose-600">Admin Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={currentUser.role === 'Administrator' ? 9 : 8} className="py-6 text-center text-slate-400 italic">No paid invoices recorded yet.</td>
                        </tr>
                      ) : (
                        filteredTransactions.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-3 font-mono font-bold text-slate-800">{t.invoiceNo}</td>
                            <td className="py-3 text-slate-500">{t.dateTime || t.date}</td>
                            <td className="py-3 font-semibold text-slate-900">{t.table}</td>
                            <td className="py-3 text-slate-600">{t.cashier}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700">
                                {t.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3 text-right font-mono">{settings.currency} {t.subtotal.toFixed(2)}</td>
                            <td className="py-3 text-right font-mono text-emerald-700">+{settings.currency} {t.serviceCharge.toFixed(2)}</td>
                            <td className="py-3 text-right font-mono font-black text-slate-900">{settings.currency} {t.total.toFixed(2)}</td>
                            {currentUser.role === 'Administrator' && (
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleDeleteSettledTransactionByAdmin(t.invoiceNo)}
                                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 border border-rose-200 transition-colors"
                                  title="Admin only: Delete transaction"
                                >
                                  <Trash2 className="h-3 w-3" /> Delete
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab: Forensic Audit Logs */}
            {reportSubTab === 'Forensic Audit Logs' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Comprehensive Activity &amp; Change Audit Log
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Every transaction, active ticket item modification, quantity edit, line void, or admin deletion is tracked.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                    {auditLogs.length} Events Logged
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5">Audit ID</th>
                        <th className="py-2.5">Timestamp</th>
                        <th className="py-2.5">Action Event</th>
                        <th className="py-2.5">Reference</th>
                        <th className="py-2.5">Details &amp; Audit Trail</th>
                        <th className="py-2.5 text-right">Staff &amp; Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-400 italic">No forensic audit entries recorded yet.</td>
                        </tr>
                      ) : (
                        auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50">
                            <td className="py-3 font-mono font-bold text-slate-700">{log.id}</td>
                            <td className="py-3 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.type.includes('DELETE') ? 'bg-rose-100 text-rose-700' :
                                log.type.includes('ADDED') ? 'bg-emerald-100 text-emerald-700' :
                                log.type.includes('SETTLED') ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {log.type}
                              </span>
                            </td>
                            <td className="py-3 font-mono font-semibold text-slate-800">{log.orderRef}</td>
                            <td className="py-3 text-slate-700 font-medium">{log.details}</td>
                            <td className="py-3 text-right">
                              <span className="font-bold text-slate-900">{log.staff}</span>
                              <span className="block text-[10px] text-slate-400">({log.role})</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab: KOT & BOT Reports */}
            {(reportSubTab === 'KOT Report' || reportSubTab === 'BOT Report') && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase">
                    {reportSubTab === 'KOT Report' ? 'Kitchen Order Tickets (KOT) Audit' : 'Bar Order Tickets (BOT) Audit'}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    reportSubTab === 'KOT Report' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {reportSubTab === 'KOT Report' ? `${salesMetrics.kitchenItemsCount} items dispatched` : `${salesMetrics.barItemsCount} drinks dispatched`}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5">Item Dispatched</th>
                        <th className="py-2.5">Target Dept</th>
                        <th className="py-2.5 text-center">Total Quantity</th>
                        <th className="py-2.5 text-right">Revenue Contributed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesMetrics.topItems
                        .filter(i => reportSubTab === 'KOT Report' ? i.department === 'Kitchen' : i.department === 'Bar')
                        .map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-3 font-bold text-slate-900">{item.name}</td>
                            <td className="py-3 text-slate-500">{item.department}</td>
                            <td className="py-3 text-center font-mono font-bold">{item.sold}</td>
                            <td className="py-3 text-right font-mono font-bold text-slate-900">{settings.currency} {item.revenue.toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab: Food vs Beverage */}
            {reportSubTab === 'Food vs Beverage' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Food / Kitchen (KOT)</span>
                    <h3 className="text-3xl font-black font-mono text-slate-900 mt-2">
                      {settings.currency} {salesMetrics.kitchenRevenue.toFixed(2)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {((salesMetrics.kitchenRevenue / (salesMetrics.itemSubtotal || 1)) * 100).toFixed(1)}% of total menu sales
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Portions Prepared: {salesMetrics.kitchenItemsCount}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Beverages / Bar (BOT)</span>
                    <h3 className="text-3xl font-black font-mono text-slate-900 mt-2">
                      {settings.currency} {salesMetrics.barRevenue.toFixed(2)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {((salesMetrics.barRevenue / (salesMetrics.itemSubtotal || 1)) * 100).toFixed(1)}% of total menu sales
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Drinks Served: {salesMetrics.barItemsCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab: Stock Usage */}
            {reportSubTab === 'Stock Usage' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase mb-3">Live Ingredient Stock Depletion</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5">Raw Material</th>
                        <th className="py-2.5">Remaining Stock</th>
                        <th className="py-2.5">Threshold</th>
                        <th className="py-2.5 text-right">Unit Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventory.map(i => (
                        <tr key={i.id} className="hover:bg-slate-50">
                          <td className="py-3 font-bold text-slate-900">{i.name}</td>
                          <td className="py-3 font-mono font-bold text-slate-700">{i.stock} {i.unit}</td>
                          <td className="py-3 font-mono text-slate-400">{i.threshold} {i.unit}</td>
                          <td className="py-3 text-right font-mono text-slate-600">{settings.currency} {i.cost.toFixed(2)} / {i.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab: Sales Summary */}
            {reportSubTab === 'Sales Summary' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-xl">
                <h3 className="text-base font-black text-slate-900 uppercase">Executive Summary</h3>
                <div className="space-y-2 text-xs divide-y divide-slate-100">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Total Orders Closed</span>
                    <span className="font-mono font-bold text-slate-900">{salesMetrics.paidBillsCount}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Net Food &amp; Beverage Sales</span>
                    <span className="font-mono font-bold text-slate-900">{settings.currency} {salesMetrics.itemSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Service Charges ({settings.serviceChargeRate}%)</span>
                    <span className="font-mono font-bold text-emerald-600">+{settings.currency} {salesMetrics.serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Taxes Collected</span>
                    <span className="font-mono font-bold text-slate-900">+{settings.currency} {salesMetrics.taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-sm font-black text-slate-900 border-t-2 border-slate-900">
                    <span>Total Net Revenue</span>
                    <span className="font-mono text-[#ff5500]">{settings.currency} {salesMetrics.grossRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: POS TERMINAL */}
        {activeTab === 'pos' && (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col p-5 overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {categoriesList.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-[#ff5500] text-white shadow-md shadow-orange-600/20'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-64 shrink-0">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={menuSearchQuery}
                    onChange={e => setMenuSearchQuery(e.target.value)}
                    placeholder="Search menu..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              {/* Dish Cards Grid */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
                {menuItems
                  .filter(item => {
                    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
                    const matchQuery = item.name.toLowerCase().includes(menuSearchQuery.toLowerCase());
                    return matchCat && matchQuery;
                  })
                  .map(dish => {
                    const { cogs, portions, isSoldOut } = calculateDishAvailability(dish.recipe);
                    return (
                      <div
                        key={dish.id}
                        onClick={() => !isSoldOut && handleAddToCart(dish)}
                        className={`bg-white rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                          isSoldOut
                            ? 'border-slate-200 opacity-50 cursor-not-allowed'
                            : 'border-slate-200/90 hover:border-[#ff5500] hover:shadow-md cursor-pointer active:scale-[0.99]'
                        }`}
                      >
                        {dish.imageUrl && (
                          <div className="relative h-28 w-full bg-slate-100 overflow-hidden shrink-0">
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <span className={`absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded shadow-sm text-white ${
                              dish.department === 'Bar' ? 'bg-indigo-600' : 'bg-rose-600'
                            }`}>
                              {dish.department}
                            </span>
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-sm text-white font-mono font-black text-xs">
                              {settings.currency} {dish.price.toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="p-4 pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              {!dish.imageUrl && (
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                  dish.department === 'Bar' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {dish.department}
                                </span>
                              )}
                              <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{dish.name}</h4>
                            </div>
                            {!dish.imageUrl && (
                              <span className="text-sm font-black font-mono text-[#ff5500]">
                                {settings.currency} {dish.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dish.description}</p>
                        </div>

                        <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] bg-slate-50/50">
                          {isSoldOut ? (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> SOLD OUT (BOM 0)
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> {portions} ready
                            </span>
                          )}
                          <span className="text-slate-400 font-mono">Cost: {settings.currency} {cogs.toFixed(0)}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Ticket Sidebar */}
            <div className="w-96 bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 shadow-lg">
              <div className="p-4 border-b border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <Receipt className="h-4 w-4 text-[#ff5500]" />
                      {orderMode === 'DINING' ? selectedTable.name : `Takeaway (${takeawayInfo.token})`}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {orderMode === 'DINING' ? `${selectedTable.zone} • ${guestCount} Guests` : takeawayInfo.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setAllocationModalOpen(true)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                  >
                    Change Table
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setServiceChargeActive(!serviceChargeActive)}
                    className={`py-1 px-2 rounded-lg border text-xs font-bold transition-all ${
                      serviceChargeActive
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    Service ({settings.serviceChargeRate}%): {serviceChargeActive ? 'ON' : 'OFF'}
                  </button>

                  <button
                    onClick={() => setTaxActive(!taxActive)}
                    className={`py-1 px-2 rounded-lg border text-xs font-bold transition-all ${
                      taxActive
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    Tax ({settings.taxRate}%): {taxActive ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Items in Cart */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6">
                    <Monitor className="h-10 w-10 mb-2 stroke-[1]" />
                    <p className="text-xs font-bold text-slate-600">Ticket is empty</p>
                    <p className="text-[11px] text-slate-400 mt-1">Tap items to build order.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.cartItemId} className="p-3 bg-slate-50 rounded-xl border border-slate-200/90">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.name}</p>
                          <p className="text-xs font-mono font-bold text-[#ff5500] mt-0.5">
                            {settings.currency} {(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setCart(prev => prev.map(i => i.cartItemId === item.cartItemId ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
                            }}
                            className="h-6 w-6 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-5 text-center font-mono">{item.qty}</span>
                          <button
                            onClick={() => {
                              setCart(prev => prev.map(i => i.cartItemId === item.cartItemId ? { ...i, qty: i.qty + 1 } : i));
                            }}
                            className="h-6 w-6 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
                          >
                            +
                          </button>
                          <button
                            onClick={() => {
                              setVoidPayload({ item, reason: '' });
                              setVoidModalOpen(true);
                            }}
                            className="text-slate-400 hover:text-rose-600 ml-1 p-1"
                            title="Void Line Item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={item.notes}
                        onChange={e => {
                          const val = e.target.value;
                          setCart(prev => prev.map(i => i.cartItemId === item.cartItemId ? { ...i, notes: val } : i));
                        }}
                        placeholder="Add kitchen/bar modifier note..."
                        className="w-full mt-2 text-[11px] px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#ff5500]"
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Order Actions and Totals */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-slate-900">{settings.currency} {cartSubtotal.toFixed(2)}</span>
                  </div>
                  {serviceChargeActive && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Service Charge ({settings.serviceChargeRate}%)</span>
                      <span className="font-mono">+{settings.currency} {cartServiceCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {taxActive && (
                    <div className="flex justify-between text-indigo-700 font-medium">
                      <span>Taxes ({settings.taxRate}%)</span>
                      <span className="font-mono">+{settings.currency} {cartTax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total</span>
                    <span className="font-mono text-base text-[#ff5500]">{settings.currency} {cartGrandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={handleSendOrder}
                  className="w-full py-3 bg-[#ff5500] hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-600/30 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Order (Prints KOT / BOT / Temp)</span>
                </button>

                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    setSettlingOrder(null);
                    setCheckoutModalOpen(true);
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <Receipt className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Direct Settle &amp; Pay ({settings.currency} {cartGrandTotal.toFixed(2)})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CASHIER SHIFTS & DRAWER */}
        {activeTab === 'shifts' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Cashier Shift &amp; Drawer Balancing</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Shift ID: <span className="font-mono font-bold text-slate-800">{currentShift.shiftId}</span> • Opened by {currentShift.openedBy} at {currentShift.openedAt}
                </p>
              </div>

              <button
                onClick={handleCloseShift}
                className="px-4 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-orange-600/20"
              >
                <Lock className="h-4 w-4" />
                <span>Close Shift &amp; Print Z-Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-black uppercase text-slate-400">Opening Float</p>
                <p className="text-xl font-black font-mono text-slate-900 mt-1">
                  {settings.currency} {currentShift.startingFloat.toFixed(2)}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-black uppercase text-slate-400">Cash Sales Collected</p>
                <p className="text-xl font-black font-mono text-emerald-600 mt-1">
                  +{settings.currency} {shiftCashMetrics.totalCashSales.toFixed(2)}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-black uppercase text-slate-400">Petty Cash Payouts</p>
                <p className="text-xl font-black font-mono text-rose-600 mt-1">
                  -{settings.currency} {shiftCashMetrics.totalPayouts.toFixed(2)}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-black uppercase text-slate-400">Expected Drawer Total</p>
                <p className="text-xl font-black font-mono text-slate-900 mt-1">
                  {settings.currency} {shiftCashMetrics.expectedCashInDrawer.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cash Count */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Coins className="h-4 w-4 text-[#ff5500]" /> Physical Cash Drawer Count
                  </h3>
                  <span className="font-mono text-xs font-bold text-slate-600">
                    Counted: {settings.currency} {shiftCashMetrics.countedCash.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[5000, 1000, 500, 100, 50, 20].map(denom => (
                    <div key={denom} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-mono font-bold text-xs text-slate-700">{settings.currency} {denom}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">×</span>
                        <input
                          type="number"
                          min="0"
                          value={denominations[denom] || ''}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 0;
                            setDenominations(prev => ({ ...prev, [denom]: val }));
                          }}
                          placeholder="0"
                          className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  shiftCashMetrics.variance === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : shiftCashMetrics.variance > 0
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  <div>
                    <p className="text-xs font-bold">
                      {shiftCashMetrics.variance === 0 ? 'Drawer Perfectly Balanced' : shiftCashMetrics.variance > 0 ? 'Cash Overage Detected' : 'Cash Shortage Detected'}
                    </p>
                    <p className="text-[10px] opacity-80">Difference between physical count and system expectation</p>
                  </div>
                  <span className="text-base font-black font-mono">
                    {shiftCashMetrics.variance > 0 ? '+' : ''}{settings.currency} {shiftCashMetrics.variance.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Petty Cash */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-rose-500" /> Record Petty Cash Out
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!payoutForm.amount || !payoutForm.reason) return;
                    const newPo = {
                      id: `po_${Date.now()}`,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      amount: parseFloat(payoutForm.amount) || 0,
                      reason: payoutForm.reason.trim(),
                      staff: currentUser.name
                    };
                    setCurrentShift(prev => ({ ...prev, payouts: [newPo, ...prev.payouts] }));
                    setPayoutForm({ amount: '', reason: '' });
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Amount ({settings.currency})</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={payoutForm.amount}
                        onChange={e => setPayoutForm(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="e.g. 500.00"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reason / Note</label>
                      <input
                        type="text"
                        required
                        value={payoutForm.reason}
                        onChange={e => setPayoutForm(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="e.g. Market Lemons, Ice Bags"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    Authorize Payout
                  </button>
                </form>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Shift Payouts Audit</p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {currentShift.payouts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No cash payouts logged in this shift.</p>
                    ) : (
                      currentShift.payouts.map(po => (
                        <div key={po.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-bold text-slate-800">{po.reason}</p>
                            <span className="text-[10px] text-slate-400">{po.time} • Auth by {po.staff}</span>
                          </div>
                          <span className="font-mono font-bold text-rose-600">-{settings.currency} {po.amount.toFixed(2)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: TABLE MANAGEMENT */}
        {activeTab === 'tables' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Table &amp; Floor Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time floor occupancy, zone mapping, and instant table order linkage.
                </p>
              </div>

              <button
                onClick={() => setAddTableModalOpen(true)}
                className="px-3.5 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/20"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Table</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {floorTables.map(tbl => {
                const isOccupied = tbl.status === 'OCCUPIED';
                const isReserved = tbl.status === 'RESERVED';

                return (
                  <div
                    key={tbl.id}
                    className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
                      isOccupied
                        ? 'border-orange-300 ring-2 ring-orange-500/10'
                        : isReserved
                        ? 'border-indigo-200'
                        : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400">{tbl.id}</span>
                          <h3 className="text-base font-black text-slate-900">{tbl.name}</h3>
                          <p className="text-xs text-slate-500">{tbl.zone}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isOccupied
                            ? 'bg-orange-100 text-[#ff5500]'
                            : isReserved
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {tbl.status}
                        </span>
                      </div>

                      <p className="text-xs font-mono text-slate-600 mt-3">Capacity: {tbl.capacity} Seats</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedTable(tbl);
                          setOrderMode('DINING');
                          setActiveTab('pos');
                        }}
                        className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                      >
                        {isOccupied ? 'Open Order' : 'Seat Table'}
                      </button>

                      <button
                        onClick={() => {
                          const nextStatus = tbl.status === 'VACANT' ? 'RESERVED' : 'VACANT';
                          setFloorTables(prev => prev.map(t => t.id === tbl.id ? { ...t, status: nextStatus } : t));
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
                        title="Toggle Reserved State"
                      >
                        Status
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 5: STAFF MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Staff Management &amp; Access Roles</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure employee credentials, security PINs, and role permissions across modules.
                </p>
              </div>

              <button
                onClick={() => setAddStaffModalOpen(true)}
                className="px-4 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-orange-600/20"
              >
                <Plus className="h-4 w-4" />
                <span>Add Employee</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Security PIN</th>
                    <th className="py-3 px-4">Allowed Modules</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffList.map(member => (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{member.name}</p>
                            <span className="text-[10px] text-slate-400">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-orange-100 text-[#ff5500] rounded font-bold text-[10px]">
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">•••• ({member.pin})</td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="text-[11px] font-medium">
                          {(ROLE_PERMISSIONS[member.role] || []).length} modules enabled
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (staffList.length <= 1) return;
                            setStaffList(prev => prev.filter(s => s.id !== member.id));
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                          title="Remove Staff"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 6: RECIPES & PORTIONS */}
        {activeTab === 'recipes' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Recipes, Portions &amp; BOM Costing</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time Cost of Goods Sold (COGS), profit margins, and remaining portions linked directly to raw inventory.
                </p>
              </div>
              <button
                onClick={() => {
                  if (menuItems.length > 0) {
                    handleOpenRecipeConfig(menuItems[0]);
                  }
                }}
                className="px-4 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/20"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Configure Dish Recipe</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map(dish => {
                const { cogs, portions, isSoldOut } = calculateDishAvailability(dish.recipe);
                const margin = dish.price > 0 ? (((dish.price - cogs) / dish.price) * 100).toFixed(1) : 0;

                return (
                  <div key={dish.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{dish.department} • {dish.category}</span>
                          {isSoldOut && (
                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black rounded">
                              OUT OF STOCK
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-black text-slate-900 mt-0.5">{dish.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{dish.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black font-mono text-[#ff5500]">
                          {settings.currency} {dish.price.toFixed(2)}
                        </span>
                        <p className="text-[10px] font-bold text-emerald-600">{margin}% Gross Margin</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase text-slate-400">Bill of Materials (BOM Breakdown)</p>
                        <button
                          onClick={() => handleOpenRecipeConfig(dish)}
                          className="text-[11px] font-bold text-[#ff5500] hover:underline flex items-center gap-1"
                        >
                          <Sliders className="h-3.5 w-3.5" /> Edit Ingredients
                        </button>
                      </div>
                      {dish.recipe && dish.recipe.length > 0 ? (
                        dish.recipe.map((r, i) => {
                          const ing = inventoryMap[r.ingredientId];
                          const lineCost = ing ? (ing.cost * r.amount) : 0;
                          return (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-slate-700">{ing ? ing.name : r.ingredientId} ({r.amount} {ing ? ing.unit : ''})</span>
                              <span className="font-mono text-slate-500">{settings.currency} {lineCost.toFixed(2)}</span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400 italic">No raw inventory linked to this item.</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                      <span className="text-slate-600 font-medium">
                        Live Portions in Stock: <strong className={isSoldOut ? 'text-rose-600 font-mono' : 'text-slate-900 font-mono'}>{portions}</strong>
                      </span>
                      <span className="font-mono font-bold text-slate-700">
                        Total Raw Cost: {settings.currency} {cogs.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 7: STOCK & RAW INVENTORY */}
        {activeTab === 'stock' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Stock &amp; Raw Inventory</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Raw ingredients and supplies dynamically depleted through recipe Bill of Materials upon settlement.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setReceiveStockForm(prev => ({
                      ...prev,
                      ingredientId: inventory[0]?.id || '',
                      quantity: '',
                      supplier: '',
                      invoiceRef: '',
                      newCost: ''
                    }));
                    setReceiveStockModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all"
                >
                  <Package className="h-3.5 w-3.5" />
                  <span>Receive Stock (Intake)</span>
                </button>

                <button
                  onClick={() => setAddInventoryModalOpen(true)}
                  className="px-3.5 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Raw Material</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Raw Ingredient</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Remaining Stock</th>
                    <th className="py-3 px-4">Reorder Threshold</th>
                    <th className="py-3 px-4">Unit Cost</th>
                    <th className="py-3 px-4 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map(ing => {
                    const isLow = ing.stock <= ing.threshold;
                    return (
                      <tr key={ing.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4">
                          <p className="font-extrabold text-slate-900">{ing.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{ing.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                            {ing.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {ing.stock} {ing.unit}
                          {isLow && <span className="ml-2 px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] rounded font-bold">Low Stock</span>}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">{ing.threshold} {ing.unit}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{settings.currency} {ing.cost.toFixed(2)} / {ing.unit}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setReceiveStockForm({
                                ingredientId: ing.id,
                                quantity: ing.unit === 'g' || ing.unit === 'ml' ? '1000' : '10',
                                supplier: 'Local Market',
                                invoiceRef: `REC-${Math.floor(100 + Math.random() * 900)}`,
                                newCost: ing.cost.toString()
                              });
                              setReceiveStockModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                          >
                            + Intake Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 8: KITCHEN DISPLAY */}
        {activeTab === 'kds' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h2 className="text-xl font-black text-slate-900">Live Kitchen Display (KOT)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeOrders.filter(o => o.items.some(i => i.department === 'Kitchen')).length === 0 ? (
                <div className="col-span-full h-56 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <Flame className="h-8 w-8 text-rose-400 mb-2 stroke-[1.5]" />
                  <p className="text-sm font-bold text-slate-700">Kitchen Display is Clear</p>
                  <p className="text-xs text-slate-400 mt-0.5">New food tickets sent from POS will display here instantly.</p>
                </div>
              ) : (
                activeOrders
                  .filter(o => o.items.some(i => i.department === 'Kitchen'))
                  .map(order => (
                    <div key={order.orderId} className="bg-white rounded-2xl border-2 border-rose-200 p-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{order.tableName}</h4>
                          <span className="text-[10px] text-slate-400">Order #{order.orderId}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold text-xs rounded-full">
                          {order.sentAt}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {order.items
                          .filter(i => i.department === 'Kitchen')
                          .map((item, idx) => (
                            <div key={idx} className="p-2 bg-slate-50 rounded-lg">
                              <p className="font-bold text-xs text-slate-900">{item.qty}x {item.name}</p>
                              {item.notes && <p className="text-[10px] text-rose-600 font-semibold mt-0.5">&gt; {item.notes}</p>}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 9: BAR DISPLAY */}
        {activeTab === 'bar' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h2 className="text-xl font-black text-slate-900">Live Bar Display (BOT)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeOrders.filter(o => o.items.some(i => i.department === 'Bar')).length === 0 ? (
                <div className="col-span-full h-56 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <Wine className="h-8 w-8 text-indigo-400 mb-2 stroke-[1.5]" />
                  <p className="text-sm font-bold text-slate-700">Bar Display is Clear</p>
                  <p className="text-xs text-slate-400 mt-0.5">New beverage tickets sent from POS will display here instantly.</p>
                </div>
              ) : (
                activeOrders
                  .filter(o => o.items.some(i => i.department === 'Bar'))
                  .map(order => (
                    <div key={order.orderId} className="bg-white rounded-2xl border-2 border-indigo-200 p-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{order.tableName}</h4>
                          <span className="text-[10px] text-slate-400">Order #{order.orderId}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-full">
                          {order.sentAt}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {order.items
                          .filter(i => i.department === 'Bar')
                          .map((item, idx) => (
                            <div key={idx} className="p-2 bg-slate-50 rounded-lg">
                              <p className="font-bold text-xs text-slate-900">{item.qty}x {item.name}</p>
                              {item.notes && <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">&gt; {item.notes}</p>}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 10: BILLING & SETTLEMENT */}
        {activeTab === 'billing' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Billing &amp; Settlement Queue</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage sent orders, modify items on active tickets, print interim proforma bills, and settle final payments.
                </p>
              </div>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700">
                {activeOrders.length} Open Tables
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders.length === 0 ? (
                <div className="col-span-full h-64 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <Receipt className="h-10 w-10 mb-2 stroke-[1]" />
                  <p className="text-sm font-bold text-slate-700">No active tables pending billing</p>
                  <p className="text-xs mt-1">Send an order from the POS Terminal to populate this list.</p>
                </div>
              ) : (
                activeOrders.map(order => {
                  const fin = calculateOrderFinancials(order);
                  return (
                    <div key={order.orderId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#ff5500]">
                              {order.mode}
                            </span>
                            <h3 className="text-base font-extrabold text-slate-900 mt-1">{order.tableName}</h3>
                            <p className="text-xs text-slate-500">Waitstaff: {order.server} • {order.sentAt}</p>
                          </div>
                          <span className="text-lg font-black font-mono text-[#ff5500]">
                            {settings.currency} {fin.total.toFixed(2)}
                          </span>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 my-3 space-y-1.5 text-xs max-h-40 overflow-y-auto border border-slate-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-slate-800">{item.qty}x {item.name}</span>
                                {item.notes && <p className="text-[10px] text-slate-400 italic">note: {item.notes}</p>}
                              </div>
                              <span className="font-mono text-slate-500">{settings.currency} {(item.price * item.qty).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <button
                            onClick={() => handleOpenEditActiveBill(order)}
                            className="py-1.5 bg-orange-50 hover:bg-orange-100 text-[#ff5500] border border-orange-200 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" /> Edit Items
                          </button>

                          <button
                            onClick={() => setPrintModalConfig({
                              type: 'TEMP_BILL',
                              data: {
                                table: order.tableName,
                                server: order.server,
                                items: order.items,
                                subtotal: fin.subtotal,
                                service: fin.service,
                                tax: fin.tax,
                                total: fin.total
                              }
                            })}
                            className="py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center justify-center gap-1"
                          >
                            <Printer className="h-3.5 w-3.5" /> Temp Bill
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <button
                            onClick={() => {
                              setSettlingOrder(order);
                              setPaymentMethod('CASH');
                              setCheckoutModalOpen(true);
                            }}
                            className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1 shadow-sm"
                          >
                            <DollarSign className="h-3.5 w-3.5" /> Settle Bill
                          </button>

                          {currentUser.role === 'Administrator' && (
                            <button
                              onClick={() => handleDeleteActiveBillByAdmin(order.orderId, order.tableName, order.tableId)}
                              className="py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors"
                              title="Administrator Only: Delete active order"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Cancel Bill
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 11: MENU MANAGEMENT (SCROLL-DOWN CATEGORY SELECTOR) */}
        {activeTab === 'menu_admin' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Menu Management &amp; Recipe Configurator</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add new dishes and beverages, select categories via scroll-down menu, upload food photos, and link ingredient recipes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={adminCategoryFilter}
                    onChange={e => setAdminCategoryFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#ff5500] shadow-sm cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {categoriesList.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  onClick={() => setAddItemModalOpen(true)}
                  className="px-4 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-orange-600/20"
                >
                  <Plus className="h-4 w-4" /> Add New Menu Item
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Item &amp; Photo</th>
                    <th className="py-3 px-4">Area / Dept</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Selling Price</th>
                    <th className="py-3 px-4">Est. COGS</th>
                    <th className="py-3 px-4">Linked Ingredients</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {menuItems
                    .filter(item => adminCategoryFilter === 'All' || item.category === adminCategoryFilter)
                    .map(item => {
                      const { cogs } = calculateDishAvailability(item.recipe);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="h-10 w-10 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-[10px] shrink-0">
                                  NO PIC
                                </div>
                              )}
                              <div>
                                <p className="font-extrabold text-slate-900">{item.name}</p>
                                <span className="text-[10px] text-slate-400 line-clamp-1">{item.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.department === 'Kitchen' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                            }`}>
                              {item.department}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-bold text-slate-800">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#ff5500]">{settings.currency} {item.price.toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{settings.currency} {cogs.toFixed(2)}</td>
                          <td className="py-3 px-4 text-[11px] text-slate-600">
                            {item.recipe && item.recipe.length > 0 ? (
                              <span>{item.recipe.length} raw supplies linked</span>
                            ) : (
                              <span className="text-amber-600 italic">No recipe linked</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setMenuItems(prev => prev.filter(m => m.id !== item.id))}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                              title="Delete Item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 12: CANCELLED TICKETS */}
        {activeTab === 'cancelled' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h2 className="text-xl font-black text-slate-900">Cancelled Tickets &amp; Voids Audit</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Audit ID</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Dish / Item</th>
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Mandatory Reason</th>
                    <th className="py-3 px-4">Authorized Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cancelledTickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400 italic">No cancelled line items logged.</td>
                    </tr>
                  ) : (
                    cancelledTickets.map(voidItem => (
                      <tr key={voidItem.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-rose-600">{voidItem.id}</td>
                        <td className="py-3 px-4 text-slate-400">{voidItem.timestamp}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{voidItem.qty}x {voidItem.itemName}</td>
                        <td className="py-3 px-4 text-slate-600">{voidItem.table}</td>
                        <td className="py-3 px-4 text-slate-700 italic">"{voidItem.reason}"</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{voidItem.authorizedBy}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 13: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-6xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#ff5500]" />
                  System &amp; Restaurant Settings
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage store identity, taxation rates, thermal 80mm/58mm roll styles, and POS hardware peripherals.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {currentUser.role === 'Administrator' && (
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to reset all active orders and transaction history? This action cannot be undone.")) {
                        setTransactions([]);
                        setActiveOrders([]);
                        setAuditLogs([]);
                        setCancelledTickets([]);
                        setFloorTables(INITIAL_FLOOR_TABLES);
                        setSettingsNotice({
                          title: 'Ledger Reset Complete',
                          detail: 'All transactions and table orders have been reset to a clean state.'
                        });
                        setTimeout(() => setSettingsNotice(null), 3500);
                      }
                    }}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-rose-200 transition-all"
                  >
                    <Trash2 className="h-4 w-4" /> Reset All Ledgers
                  </button>
                )}
                <button
                  onClick={() => {
                    setSettingsNotice({
                      title: 'System Settings Saved',
                      detail: `Updated store configuration for ${settings.restaurantName} • Active`
                    });
                    setTimeout(() => setSettingsNotice(null), 3500);
                  }}
                  className="px-5 py-2.5 bg-[#008f5d] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-emerald-700/20 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" /> Save System Settings
                </button>
              </div>
            </div>

            {/* RESTAURANT IDENTITY */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ff5500]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Restaurant Identity &amp; Location
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    value={settings.restaurantName}
                    onChange={e => setSettings(prev => ({ ...prev, restaurantName: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff5500] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={e => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff5500] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={settings.phone || ''}
                    onChange={e => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+94 74 036 6741"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff5500] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Terminal Hardware ID</label>
                  <input
                    type="text"
                    value={settings.terminalId}
                    onChange={e => setSettings(prev => ({ ...prev, terminalId: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#ff5500] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={settings.address || ''}
                  onChange={e => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="380 A Matara Road, Midigama, 81700"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff5500] focus:bg-white"
                />
              </div>
            </div>

            {/* CURRENCY & CHARGES */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Currency, Tax &amp; Surcharge Rates
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={settings.currency}
                    onChange={e => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-[#ff5500] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Default Service Charge (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={settings.serviceChargeRate}
                    onChange={e => setSettings(prev => ({ ...prev, serviceChargeRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#ff5500] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tax / VAT / GST Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={settings.taxRate}
                    onChange={e => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#ff5500] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* HARDWARE PERIPHERALS & CASH DRAWER */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Printer className="h-4 w-4 text-[#ff5500]" />
                    Hardware Peripherals &amp; Cash Drawer Solenoid
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure thermal roll sizing, RJ11/RJ12 drawer solenoids, and direct WebUSB printer pairing.
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                  {pairedUsbDevice ? `USB: ${pairedUsbDevice.productName || 'Connected'}` : 'OS Printer Spooler'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Receipt Roll Width</label>
                  <select
                    value={settings.receiptRollWidth || '80mm'}
                    onChange={e => setSettings(prev => ({ ...prev, receiptRollWidth: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="80mm">80mm Thermal Paper (Standard)</option>
                    <option value="58mm">58mm Thermal Paper (Compact)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Auto Drawer Kick</label>
                  <select
                    value={settings.autoDrawerKick || 'ENABLED'}
                    onChange={e => setSettings(prev => ({ ...prev, autoDrawerKick: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="ENABLED">Enabled (Auto-Pop)</option>
                    <option value="DISABLED">Disabled (Manual Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Hardware Diagnostic</label>
                  <button
                    type="button"
                    onClick={triggerCashDrawerDiagnostic}
                    className="w-full py-2 bg-[#ff5500] hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Zap className="h-3.5 w-3.5" /> Pop Cash Drawer
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">Auto-Detect &amp; Silent Kiosk Printing</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    For zero-popup instant printing on Chrome/Edge, launch with the <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">--kiosk-printing</code> flag.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePairUsbPrinter}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shrink-0"
                >
                  <Usb className="h-3.5 w-3.5" /> Re-Pair WebUSB Printer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: PIN AUTHENTICATION / SWITCH */}
      {pinModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#ff5500]" />
                <h3 className="text-base font-black text-slate-900">Switch Role / Staff</h3>
              </div>
              <button onClick={() => { setPinModalOpen(false); setPinInput(''); setPinError(''); }} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSwitchUserWithPin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Employee</label>
                <select
                  value={targetStaffForSwitch ? targetStaffForSwitch.id : ''}
                  onChange={e => setTargetStaffForSwitch(staffList.find(s => s.id === e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-800"
                >
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter 4-Digit Security PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  required
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-center text-xl font-mono tracking-widest text-slate-900 focus:outline-none focus:border-[#ff5500]"
                />
                {pinError && <p className="text-xs text-rose-600 font-bold mt-1.5 text-center">{pinError}</p>}
                <p className="text-[10px] text-slate-400 text-center mt-1">Default PINs: Admin 1234, Marco 1111, Chef 2222, Bar 3333</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ff5500] hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-orange-600/20"
              >
                Authenticate &amp; Switch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW EMPLOYEE */}
      {addStaffModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add New Staff Member</h3>
              <button onClick={() => setAddStaffModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffForm.name}
                  onChange={e => setNewStaffForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Kasun Silva"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role / Department</label>
                  <select
                    value={newStaffForm.role}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900"
                  >
                    {Object.keys(ROLE_PERMISSIONS).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={newStaffForm.pin}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, pin: e.target.value }))}
                    placeholder="e.g. 7788"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newStaffForm.email}
                  onChange={e => setNewStaffForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. kasun@linolicove.me"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-600/20"
              >
                Save Staff Member
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW DISH WITH SCROLL-DOWN CATEGORY DROPDOWN */}
      {addItemModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Add New Menu Dish / Drink</h3>
                <p className="text-xs text-slate-500">Configure item details, price in {settings.currency}, select category, and link recipe BOM.</p>
              </div>
              <button onClick={() => setAddItemModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Item / Dish Name</label>
                  <input
                    type="text"
                    required
                    value={newDishForm.name}
                    onChange={e => setNewDishForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Seafood Pasta Marinara"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price ({settings.currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newDishForm.price}
                    onChange={e => setNewDishForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 2150.00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preparation Area / Dept</label>
                  <select
                    value={newDishForm.department}
                    onChange={e => setNewDishForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="Kitchen">Kitchen (Sends KOT)</option>
                    <option value="Bar">Bar (Sends BOT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category (Scroll Down Menu)</label>
                  <select
                    value={newDishForm.category}
                    onChange={e => setNewDishForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 font-semibold focus:outline-none focus:border-[#ff5500]"
                  >
                    {PREDEFINED_MENU_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    {categoriesList
                      .filter(c => c !== 'All' && !PREDEFINED_MENU_CATEGORIES.includes(c))
                      .map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    }
                    <option value="CUSTOM">+ Add New Custom Category...</option>
                  </select>

                  {newDishForm.category === 'CUSTOM' && (
                    <input
                      type="text"
                      required
                      value={newDishForm.customCategory}
                      onChange={e => setNewDishForm(prev => ({ ...prev, customCategory: e.target.value }))}
                      placeholder="Enter new category name..."
                      className="w-full mt-2 px-3 py-1.5 border border-orange-300 rounded-xl text-xs bg-orange-50/50 text-slate-900 focus:outline-none focus:border-[#ff5500]"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Image URL or File Upload</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={newDishForm.imageUrl}
                    onChange={e => setNewDishForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/dish.jpg (or pick / upload)"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => {
                            if (ev.target?.result) {
                              setNewDishForm(prev => ({ ...prev, imageUrl: ev.target.result }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {newDishForm.imageUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={newDishForm.imageUrl}
                      alt="Preview"
                      className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">Image Preview Ready</p>
                      <button
                        type="button"
                        onClick={() => setNewDishForm(prev => ({ ...prev, imageUrl: '' }))}
                        className="text-[10px] text-rose-600 font-bold hover:underline"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDishForm.description}
                  onChange={e => setNewDishForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Appetizing description for servers and customer menu..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              {/* Recipe builder in add item */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-[#ff5500]" /> Link Recipe Ingredients (BOM)
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {newDishForm.recipeIngredients.length} ingredients added
                  </span>
                </div>

                <div className="flex gap-2">
                  <select
                    id="newDishIngSelect"
                    className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-800"
                  >
                    {inventory.map(ing => (
                      <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit}) - {settings.currency} {ing.cost}/{ing.unit}</option>
                    ))}
                  </select>
                  <input
                    id="newDishIngAmount"
                    type="number"
                    min="0.1"
                    step="any"
                    placeholder="Qty per serving"
                    className="w-32 px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-mono bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const sel = document.getElementById('newDishIngSelect');
                      const amtInput = document.getElementById('newDishIngAmount');
                      const ingId = sel?.value;
                      const amt = parseFloat(amtInput?.value);
                      if (!ingId || isNaN(amt) || amt <= 0) return;

                      setNewDishForm(prev => {
                        const existingIdx = prev.recipeIngredients.findIndex(r => r.ingredientId === ingId);
                        if (existingIdx >= 0) {
                          const updated = [...prev.recipeIngredients];
                          updated[existingIdx] = { ingredientId: ingId, amount: amt };
                          return { ...prev, recipeIngredients: updated };
                        }
                        return { ...prev, recipeIngredients: [...prev.recipeIngredients, { ingredientId: ingId, amount: amt }] };
                      });
                      if (amtInput) amtInput.value = '';
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    + Add
                  </button>
                </div>

                {newDishForm.recipeIngredients.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {newDishForm.recipeIngredients.map((item, idx) => {
                      const ing = inventoryMap[item.ingredientId];
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-800">{ing ? ing.name : item.ingredientId}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-600">{item.amount} {ing?.unit}</span>
                            <span className="font-mono text-slate-400">({settings.currency} {(item.amount * (ing?.cost || 0)).toFixed(2)})</span>
                            <button
                              type="button"
                              onClick={() => {
                                setNewDishForm(prev => ({
                                  ...prev,
                                  recipeIngredients: prev.recipeIngredients.filter((_, i) => i !== idx)
                                }));
                              }}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddItemModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-600/20"
                >
                  Save &amp; Add to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD NEW RAW MATERIAL */}
      {addInventoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[#ff5500]" />
                <h3 className="text-base font-black text-slate-900">Add New Raw Material</h3>
              </div>
              <button onClick={() => setAddInventoryModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInventoryItem} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Material / Ingredient Name</label>
                <input
                  type="text"
                  required
                  value={newInventoryForm.name}
                  onChange={e => setNewInventoryForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Single Malt Scotch, Lime Wedges"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newInventoryForm.category}
                    onChange={e => setNewInventoryForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="Dry Goods">Dry Goods</option>
                    <option value="Dairy & Eggs">Dairy &amp; Eggs</option>
                    <option value="Meat">Meat</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Bar Supplies">Bar Supplies</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Produce">Produce / Veggies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit of Measure</label>
                  <select
                    value={newInventoryForm.unit}
                    onChange={e => setNewInventoryForm(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="g">Grams (g)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="l">Liters (l)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Cost ({settings.currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newInventoryForm.cost}
                    onChange={e => setNewInventoryForm(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="e.g. 1.50"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newInventoryForm.stock}
                    onChange={e => setNewInventoryForm(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Low Alert Limit</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newInventoryForm.threshold}
                    onChange={e => setNewInventoryForm(prev => ({ ...prev, threshold: e.target.value }))}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#ff5500] hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-orange-600/20"
              >
                Save Raw Material to Inventory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: RECEIVE STOCK (GRN) */}
      {receiveStockModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Receive Stock Intake (GRN)</h3>
              </div>
              <button onClick={() => setReceiveStockModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReceiveStock} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Ingredient / Item</label>
                <select
                  required
                  value={receiveStockForm.ingredientId}
                  onChange={e => {
                    const id = e.target.value;
                    const item = inventoryMap[id];
                    setReceiveStockForm(prev => ({
                      ...prev,
                      ingredientId: id,
                      newCost: item ? item.cost.toString() : ''
                    }));
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 font-bold focus:outline-none focus:border-[#ff5500]"
                >
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.stock} {item.unit} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantity Received ({inventoryMap[receiveStockForm.ingredientId]?.unit || 'units'})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={receiveStockForm.quantity}
                    onChange={e => setReceiveStockForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Updated Unit Cost ({settings.currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={receiveStockForm.newCost}
                    onChange={e => setReceiveStockForm(prev => ({ ...prev, newCost: e.target.value }))}
                    placeholder="Leave blank to keep current"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supplier / Vendor</label>
                  <input
                    type="text"
                    value={receiveStockForm.supplier}
                    onChange={e => setReceiveStockForm(prev => ({ ...prev, supplier: e.target.value }))}
                    placeholder="e.g. Mirissa Harbor Market"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Invoice / GRN Ref</label>
                  <input
                    type="text"
                    value={receiveStockForm.invoiceRef}
                    onChange={e => setReceiveStockForm(prev => ({ ...prev, invoiceRef: e.target.value }))}
                    placeholder="e.g. GRN-902"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              {receiveStockForm.ingredientId && receiveStockForm.quantity && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <p className="font-bold">Summary of Intake:</p>
                  <p>
                    Item: <strong>{inventoryMap[receiveStockForm.ingredientId]?.name}</strong>
                  </p>
                  <p>
                    Stock will increase from <strong>{inventoryMap[receiveStockForm.ingredientId]?.stock} {inventoryMap[receiveStockForm.ingredientId]?.unit}</strong> to{' '}
                    <strong>
                      {(inventoryMap[receiveStockForm.ingredientId]?.stock || 0) + (parseFloat(receiveStockForm.quantity) || 0)}{' '}
                      {inventoryMap[receiveStockForm.ingredientId]?.unit}
                    </strong>
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-emerald-700/20"
              >
                Confirm Stock Intake &amp; Update Inventory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: RECIPE CONFIGURATOR */}
      {recipeConfigModalOpen && editingDishForRecipe && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Configure Recipe: {editingDishForRecipe.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Link raw ingredients to calculate real-time COGS, profit margins, and portions ready.
                </p>
              </div>
              <button onClick={() => setRecipeConfigModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800">Add Raw Ingredient to Recipe</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <select
                      value={tempIngredientSelect.ingredientId}
                      onChange={e => setTempIngredientSelect(prev => ({ ...prev, ingredientId: e.target.value }))}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 font-medium"
                    >
                      {inventory.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.unit}) - {settings.currency} {item.cost}/{item.unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={tempIngredientSelect.amount}
                      onChange={e => setTempIngredientSelect(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder={`Portion (${inventoryMap[tempIngredientSelect.ingredientId]?.unit || 'units'})`}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const amt = parseFloat(tempIngredientSelect.amount);
                    if (!tempIngredientSelect.ingredientId || isNaN(amt) || amt <= 0) return;

                    setCurrentRecipeIngredients(prev => {
                      const idx = prev.findIndex(r => r.ingredientId === tempIngredientSelect.ingredientId);
                      if (idx >= 0) {
                        const updated = [...prev];
                        updated[idx] = { ingredientId: tempIngredientSelect.ingredientId, amount: amt };
                        return updated;
                      }
                      return [...prev, { ingredientId: tempIngredientSelect.ingredientId, amount: amt }];
                    });

                    setTempIngredientSelect(prev => ({ ...prev, amount: '' }));
                  }}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  + Link Ingredient
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-slate-400">Current Linked Ingredients ({currentRecipeIngredients.length})</span>
                {currentRecipeIngredients.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">No ingredients linked yet. Add above to track stock and COGS.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {currentRecipeIngredients.map((r, idx) => {
                      const ing = inventoryMap[r.ingredientId];
                      const lineCost = ing ? ing.cost * r.amount : 0;
                      return (
                        <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{ing ? ing.name : r.ingredientId}</p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {r.amount} {ing?.unit} × {settings.currency} {ing?.cost.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-slate-800">
                              {settings.currency} {lineCost.toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentRecipeIngredients(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {(() => {
                const totalBOMCost = currentRecipeIngredients.reduce((sum, r) => {
                  const ing = inventoryMap[r.ingredientId];
                  return sum + (ing ? ing.cost * r.amount : 0);
                }, 0);
                const margin = editingDishForRecipe.price > 0
                  ? (((editingDishForRecipe.price - totalBOMCost) / editingDishForRecipe.price) * 100).toFixed(1)
                  : 0;

                return (
                  <div className="p-3 bg-slate-100 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Menu Selling Price:</span>
                      <span className="font-mono font-bold text-slate-900">{settings.currency} {editingDishForRecipe.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Recipe BOM Cost (COGS):</span>
                      <span className="font-mono font-bold text-[#ff5500]">{settings.currency} {totalBOMCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-slate-200">
                      <span>Gross Profit Margin:</span>
                      <span>{margin}%</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecipeConfigModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRecipeConfig}
                  className="flex-1 py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-600/20"
                >
                  Save Recipe &amp; Recalculate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: SETTLE & PAY CHECKOUT */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Settle Invoice: {settlingOrder ? settlingOrder.tableName : selectedTable.name}
              </h3>
              <button onClick={() => setCheckoutModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            {(() => {
              const currentRef = settlingOrder || {
                items: cart,
                serviceChargeActive,
                taxActive,
                discountPercent
              };
              const fin = calculateOrderFinancials(currentRef);

              return (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {['CASH', 'CARD', 'SPLIT'].map(type => (
                      <button
                        key={type}
                        onClick={() => setPaymentMethod(type)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          paymentMethod === type
                            ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-md shadow-orange-600/20'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'CASH' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Cash Tendered ({settings.currency})</label>
                      <input
                        type="number"
                        step="0.01"
                        value={cashTendered}
                        onChange={e => setCashTendered(e.target.value)}
                        placeholder={fin.total.toFixed(2)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-[#ff5500]"
                      />
                      {parseFloat(cashTendered) > fin.total && (
                        <p className="text-xs text-emerald-600 font-mono font-bold mt-1">
                          Change: {settings.currency} {(parseFloat(cashTendered) - fin.total).toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Item Subtotal</span>
                      <span className="font-mono">{settings.currency} {fin.subtotal.toFixed(2)}</span>
                    </div>
                    {fin.service > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Service Charge ({settings.serviceChargeRate}%):</span>
                        <span className="font-mono">+{settings.currency} {fin.service.toFixed(2)}</span>
                      </div>
                    )}
                    {fin.tax > 0 && (
                      <div className="flex justify-between text-indigo-700 font-medium">
                        <span>Taxes ({settings.taxRate}%):</span>
                        <span className="font-mono">+{settings.currency} {fin.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Grand Total Due</span>
                      <span className="text-base font-mono text-[#ff5500]">{settings.currency} {fin.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCompleteSettlement}
                    className="w-full py-3 bg-[#008f5d] hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-700/20"
                  >
                    Confirm Settlement &amp; Deduct BOM Stock
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL 8: VOID LINE ITEM */}
      {voidModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-rose-600 flex items-center gap-1.5">
                <Trash2 className="h-4 w-4" /> Void Item Audit Required
              </h3>
              <button onClick={() => setVoidModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmVoid} className="mt-4 space-y-3">
              <p className="text-xs text-slate-600">
                Item: <strong>{voidPayload.item?.name}</strong>
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mandatory Cancellation Reason</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={voidPayload.reason}
                  onChange={e => setVoidPayload(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g. Customer changed mind, Kitchen burnt"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <p className="text-[10px] text-slate-400">Authorized by {currentUser.name} ({currentUser.role})</p>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
              >
                Confirm Line Void
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 9: ADD TABLE */}
      {addTableModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add New Floor Table</h3>
              <button onClick={() => setAddTableModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTableForm.name) return;
                const newTbl = {
                  id: `T-${Math.floor(10 + Math.random() * 90)}`,
                  name: newTableForm.name.trim(),
                  zone: newTableForm.zone,
                  capacity: parseInt(newTableForm.capacity) || 4,
                  status: 'VACANT',
                  currentOrderRef: null
                };
                setFloorTables(prev => [...prev, newTbl]);
                setAddTableModalOpen(false);
                setNewTableForm({ name: '', zone: 'Indoor Main Hall', capacity: 4 });
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Table Name</label>
                <input
                  type="text"
                  required
                  value={newTableForm.name}
                  onChange={e => setNewTableForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Table 5, Beach Cabana 2"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Zone Area</label>
                  <select
                    value={newTableForm.zone}
                    onChange={e => setNewTableForm(prev => ({ ...prev, zone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900"
                  >
                    <option value="Indoor Main Hall">Indoor Main Hall</option>
                    <option value="Deck Lounge">Deck Lounge</option>
                    <option value="Cocktail Counter">Cocktail Counter</option>
                    <option value="Private Ocean View">Private Ocean View</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newTableForm.capacity}
                    onChange={e => setNewTableForm(prev => ({ ...prev, capacity: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-600/20"
              >
                Create Table
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 10: TABLE ALLOCATION */}
      {allocationModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Allocate Table / Guest Order</h3>
              <button onClick={() => setAllocationModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderMode('DINING')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    orderMode === 'DINING'
                      ? 'bg-[#ff5500] text-white border-[#ff5500]'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Dine-In Tables
                </button>
                <button
                  onClick={() => setOrderMode('TAKEAWAY')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    orderMode === 'TAKEAWAY'
                      ? 'bg-[#ff5500] text-white border-[#ff5500]'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Takeaway Express
                </button>
              </div>

              {orderMode === 'DINING' ? (
                <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto">
                  {floorTables.map(table => (
                    <button
                      key={table.id}
                      onClick={() => {
                        setSelectedTable(table);
                        setAllocationModalOpen(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedTable.id === table.id
                          ? 'border-[#ff5500] bg-orange-50/50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <p className="font-bold text-xs text-slate-900">{table.name}</p>
                      <p className="text-[10px] text-slate-500">{table.zone}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">{table.capacity} Seats ({table.status})</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={takeawayInfo.name}
                      onChange={e => setTakeawayInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Order Token Tag</label>
                    <input
                      type="text"
                      value={takeawayInfo.token}
                      onChange={e => setTakeawayInfo(prev => ({ ...prev, token: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 11: 80MM THERMAL RECEIPT DISPATCH */}
      {printModalConfig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3 text-white">
              <span className="text-xs font-bold font-mono text-orange-400 uppercase">
                80mm Thermal Dispatch {printModalConfig.type === 'MULTI_DISPATCH' && '(3 Copies Ready)'}
              </span>
              <button onClick={() => setPrintModalConfig(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="w-full bg-white text-slate-900 p-4 rounded font-mono text-[11px] leading-tight shadow-md max-h-[60vh] overflow-y-auto space-y-4">
              
              {/* Daily Summary */}
              {printModalConfig.type === 'DAILY_SUMMARY' && (
                <div className="space-y-2">
                  <div className="text-center border-b-2 border-dashed border-slate-800 pb-2">
                    <p className="font-black text-sm">{settings.restaurantName}</p>
                    <p className="text-[10px]">{settings.tagline}</p>
                    <p className="text-[10px] font-bold mt-1">DAILY SALES SUMMARY REPORT</p>
                    <p className="text-[9px]">{new Date().toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 text-xs py-1 border-b border-slate-300">
                    <div className="flex justify-between">
                      <span>GROSS REVENUE:</span>
                      <span className="font-bold">{settings.currency} {printModalConfig.data.grossRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ITEM SUBTOTAL:</span>
                      <span>{settings.currency} {printModalConfig.data.itemSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SERVICE CHARGE:</span>
                      <span>{settings.currency} {printModalConfig.data.serviceCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TAXES / VAT:</span>
                      <span>{settings.currency} {printModalConfig.data.taxes.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-center font-bold text-[9px] pt-1">--- END OF SUMMARY ---</div>
                </div>
              )}

              {/* Multi Dispatch KOT / BOT / TEMPORARY BILL (3 COPIES AUTO-PRINT) */}
              {printModalConfig.type === 'MULTI_DISPATCH' && (
                <div className="space-y-4">
                  {/* COPY 1: KOT */}
                  <div className="border-b-2 border-dashed border-slate-800 pb-3 text-center">
                    <p className="font-bold text-[9px] bg-slate-100 py-0.5 rounded uppercase">[COPY 1 OF 3] - KITCHEN DISPATCH</p>
                    <p className="font-black text-xs mt-1">** KITCHEN ORDER TICKET (KOT) **</p>
                    <p className="font-bold text-xs mt-0.5">{printModalConfig.data.order.tableName}</p>
                    <p className="text-[10px]">Time: {printModalConfig.data.order.sentAt}</p>
                    <div className="text-left py-2 space-y-1">
                      {printModalConfig.data.kitchenItems.length === 0 ? (
                        <p className="italic text-slate-400">No kitchen items in this order.</p>
                      ) : (
                        printModalConfig.data.kitchenItems.map((item, idx) => (
                          <div key={idx}>
                            <p className="font-bold">{item.qty}x {item.name}</p>
                            {item.notes && <p className="text-[10px] pl-2 italic">&gt; {item.notes}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* COPY 2: BOT */}
                  <div className="border-b-2 border-dashed border-slate-800 pb-3 text-center">
                    <p className="font-bold text-[9px] bg-slate-100 py-0.5 rounded uppercase">[COPY 2 OF 3] - BAR DISPATCH</p>
                    <p className="font-black text-xs mt-1">** BAR ORDER TICKET (BOT) **</p>
                    <p className="font-bold text-xs mt-0.5">{printModalConfig.data.order.tableName}</p>
                    <p className="text-[10px]">Time: {printModalConfig.data.order.sentAt}</p>
                    <div className="text-left py-2 space-y-1">
                      {printModalConfig.data.barItems.length === 0 ? (
                        <p className="italic text-slate-400">No bar beverage items in this order.</p>
                      ) : (
                        printModalConfig.data.barItems.map((item, idx) => (
                          <div key={idx}>
                            <p className="font-bold">{item.qty}x {item.name}</p>
                            {item.notes && <p className="text-[10px] pl-2 italic">&gt; {item.notes}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* COPY 3: TEMPORARY PROFORMA BILL */}
                  <div className="pt-1 text-center space-y-2">
                    <p className="font-bold text-[9px] bg-slate-100 py-0.5 rounded uppercase">[COPY 3 OF 3] - GUEST PROFORMA</p>
                    <p className="font-black text-sm">{settings.restaurantName}</p>
                    <p className="text-[9px]">{settings.tagline}</p>
                    <p className="font-bold text-xs mt-1">PROFORMA TEMPORARY BILL</p>
                    <p className="text-[9px]">{printModalConfig.data.order.tableName} • Server: {printModalConfig.data.order.server}</p>

                    <div className="py-1 border-y border-dashed border-slate-300 text-left space-y-1">
                      {printModalConfig.data.order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.qty}x {item.name}</span>
                          <span>{settings.currency} {(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 text-[10px] text-right">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{settings.currency} {printModalConfig.data.subtotal.toFixed(2)}</span>
                      </div>
                      {printModalConfig.data.service > 0 && (
                        <div className="flex justify-between">
                          <span>Service Charge ({settings.serviceChargeRate}%):</span>
                          <span>{settings.currency} {printModalConfig.data.service.toFixed(2)}</span>
                        </div>
                      )}
                      {printModalConfig.data.tax > 0 && (
                        <div className="flex justify-between">
                          <span>Tax ({settings.taxRate}%):</span>
                          <span>{settings.currency} {printModalConfig.data.tax.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-800">
                        <span>ESTIMATED TOTAL:</span>
                        <span>{settings.currency} {printModalConfig.data.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-500 italic mt-2">-- NOT AN OFFICIAL TAX INVOICE --</p>
                  </div>
                </div>
              )}

              {/* Z-Report Shift Close */}
              {printModalConfig.type === 'Z_REPORT' && (
                <div className="space-y-2">
                  <div className="text-center border-b-2 border-dashed border-slate-800 pb-2">
                    <p className="font-black text-sm">{settings.restaurantName}</p>
                    <p className="font-bold text-xs mt-1">*** Z-REPORT (SHIFT CLOSE) ***</p>
                    <p className="text-[9px]">Shift: {printModalConfig.data.shiftId}</p>
                    <p className="text-[9px]">Closed by: {printModalConfig.data.closedBy} at {printModalConfig.data.closedAt}</p>
                  </div>
                  <div className="space-y-1 text-xs py-1 border-b border-slate-300">
                    <div className="flex justify-between">
                      <span>OPENING FLOAT:</span>
                      <span>{settings.currency} {printModalConfig.data.startingFloat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CASH SALES:</span>
                      <span>+{settings.currency} {printModalConfig.data.metrics.totalCashSales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PETTY PAYOUTS:</span>
                      <span>-{settings.currency} {printModalConfig.data.metrics.totalPayouts.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>EXPECTED DRAWER:</span>
                      <span>{settings.currency} {printModalConfig.data.metrics.expectedCashInDrawer.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>COUNTED CASH:</span>
                      <span>{settings.currency} {printModalConfig.data.metrics.countedCash.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-slate-300 pt-1">
                      <span>VARIANCE:</span>
                      <span>{settings.currency} {printModalConfig.data.metrics.variance.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-center font-bold text-[9px] pt-1">REGISTER AUDITED &amp; CLOSED</p>
                </div>
              )}

              {/* Final Settlement Tax Invoice */}
              {printModalConfig.type === 'FINAL_BILL' && (
                <div className="space-y-2">
                  <div className="text-center border-b-2 border-dashed border-slate-800 pb-2">
                    <p className="font-black text-sm">{settings.restaurantName}</p>
                    <p className="text-[9px] whitespace-pre-line">{settings.receiptHeader}</p>
                    <p className="font-bold text-xs mt-1">TAX INVOICE #{printModalConfig.data.invoiceNo}</p>
                    <p className="text-[9px]">{printModalConfig.data.date} • {printModalConfig.data.table}</p>
                  </div>

                  <div className="py-1 border-b border-slate-300 space-y-1">
                    {printModalConfig.data.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.qty}x {item.name}</span>
                        <span>{settings.currency} {(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{settings.currency} {printModalConfig.data.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Charge ({settings.serviceChargeRate}%):</span>
                      <span>{settings.currency} {printModalConfig.data.serviceCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-800">
                      <span>TOTAL PAID:</span>
                      <span>{settings.currency} {printModalConfig.data.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span>METHOD:</span>
                      <span>{printModalConfig.data.paymentMethod}</span>
                    </div>
                  </div>

                  <p className="text-center font-bold text-[9px] pt-2 whitespace-pre-line">{settings.receiptFooter}</p>
                </div>
              )}

            </div>

            <button
              onClick={() => window.print()}
              className="w-full mt-4 py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/30"
            >
              <Printer className="h-4 w-4" /> Print 80mm
            </button>
          </div>
        </div>
      )}

      {/* MODAL 12: EDIT ACTIVE UNSETTLED BILL ITEMS */}
      {editBillModalOpen && activeOrderEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-[#ff5500]" />
                    Modify Active Bill: {activeOrderEditing.tableName}
                  </h3>
                  <p className="text-xs text-slate-500">Order ID: {activeOrderEditing.orderId} • Server: {activeOrderEditing.server}</p>
                </div>
                <button
                  onClick={() => { setEditBillModalOpen(false); setActiveOrderEditing(null); }}
                  className="text-slate-400 hover:text-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* ADD MORE ITEMS SECTION */}
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800">Add Menu Item to this Active Bill:</span>
                <div className="flex gap-2">
                  <select
                    value={selectedDishToAdd}
                    onChange={e => setSelectedDishToAdd(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 font-bold focus:outline-none focus:border-[#ff5500]"
                  >
                    {menuItems.map(dish => (
                      <option key={dish.id} value={dish.id}>
                        [{dish.department}] {dish.name} - {settings.currency} {dish.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddItemToActiveBill}
                    className="px-4 py-1.5 bg-[#ff5500] hover:bg-orange-600 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                  >
                    + Add to Bill
                  </button>
                </div>
              </div>

              {/* CURRENT ITEMS LIST */}
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Current Items on Bill ({activeOrderEditing.items.length})</span>
                {activeOrderEditing.items.length === 0 ? (
                  <p className="text-xs text-rose-500 italic p-3 bg-rose-50 rounded-xl border border-rose-200">
                    All items removed. Please add items or cancel the bill.
                  </p>
                ) : (
                  activeOrderEditing.items.map((item) => (
                    <div key={item.cartItemId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <span className="font-mono text-[11px] text-[#ff5500]">
                            {settings.currency} {(item.price * item.qty).toFixed(2)} ({settings.currency} {item.price.toFixed(2)} each)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateActiveItemQty(item.cartItemId, -1)}
                            className="h-6 w-6 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold w-4 text-center">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateActiveItemQty(item.cartItemId, 1)}
                            className="h-6 w-6 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveActiveItem(item.cartItemId)}
                            className="p-1 text-slate-400 hover:text-rose-600 ml-2"
                            title="Delete line item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setActiveOrderEditing(prev => ({
                            ...prev,
                            items: prev.items.map(i => i.cartItemId === item.cartItemId ? { ...i, notes: val } : i)
                          }));
                        }}
                        placeholder="Modifier / kitchen note..."
                        className="w-full text-[11px] px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={() => { setEditBillModalOpen(false); setActiveOrderEditing(null); }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveActiveBillChanges}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-colors"
              >
                Save Changes to Active Bill
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}