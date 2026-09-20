import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  Phone,
  MapPin,
  Building2
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
  { id: 'ing_rice', name: 'Basmati Rice', category: 'Dry Goods', stock: 24500, unit: 'g', cost: 0.25, threshold: 5000 },
  { id: 'ing_seafood_mix', name: 'Prawns & Calamari Mix', category: 'Seafood', stock: 7200, unit: 'g', cost: 1.80, threshold: 1500 },
  { id: 'ing_eggs', name: 'Farm Fresh Eggs', category: 'Dairy & Eggs', stock: 118, unit: 'pcs', cost: 35.00, threshold: 30 },
  { id: 'ing_espresso_beans', name: 'Roasted Arabica Beans', category: 'Beverages', stock: 4320, unit: 'g', cost: 4.50, threshold: 1000 },
  { id: 'ing_milk', name: 'Fresh Whole Milk', category: 'Dairy & Eggs', stock: 11800, unit: 'ml', cost: 0.30, threshold: 2500 },
  { id: 'ing_beef_patty', name: 'Prime Angus Beef Patty', category: 'Meat', stock: 32, unit: 'pcs', cost: 450.00, threshold: 10 },
  { id: 'ing_burger_bun', name: 'Brioche Bun', category: 'Bakery', stock: 38, unit: 'pcs', cost: 65.00, threshold: 12 },
  { id: 'ing_cheddar', name: 'Aged Cheddar Cheese', category: 'Dairy & Eggs', stock: 2100, unit: 'g', cost: 1.20, threshold: 400 },
  { id: 'ing_chicken', name: 'Chicken Breast Fillet', category: 'Poultry', stock: 8500, unit: 'g', cost: 1.10, threshold: 2000 },
  { id: 'ing_syrup_spiced', name: 'Demerara Cocktail Syrup', category: 'Bar Supplies', stock: 1750, unit: 'ml', cost: 0.80, threshold: 300 }
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
    id: 'drink_espresso',
    name: 'Espresso',
    department: 'Bar',
    category: 'Hot Coffee',
    price: 600.00,
    prepTime: '3m',
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400&q=80',
    description: 'Double shot of single-origin dark roasted arabica coffee.',
    recipe: [
      { ingredientId: 'ing_espresso_beans', amount: 18 }
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
  }
];

const INITIAL_FLOOR_TABLES = [
  { id: 'T-01', name: 'Table 1', zone: 'Indoor Main Hall', capacity: 2, status: 'VACANT', currentOrderRef: null },
  { id: 'T-02', name: 'Table 2', zone: 'Indoor Main Hall', capacity: 4, status: 'OCCUPIED', currentOrderRef: 'ORD-1001' },
  { id: 'T-03', name: 'Table 3', zone: 'Deck Lounge', capacity: 4, status: 'VACANT', currentOrderRef: null },
  { id: 'T-04', name: 'Table 4', zone: 'Deck Lounge', capacity: 6, status: 'RESERVED', currentOrderRef: null },
  { id: 'BAR-01', name: 'Bar Seat 01', zone: 'Cocktail Counter', capacity: 1, status: 'VACANT', currentOrderRef: null },
  { id: 'BAR-02', name: 'Bar Seat 02', zone: 'Cocktail Counter', capacity: 1, status: 'VACANT', currentOrderRef: null },
  { id: 'VIP-01', name: 'VIP Cabana 1', zone: 'Private Ocean View', capacity: 8, status: 'VACANT', currentOrderRef: null }
];

const playCashRegisterChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Primary metallic strike bell (1320 Hz - High E)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1320, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1280, ctx.currentTime + 0.35);

    gain1.gain.setValueAtTime(0.7, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.65);

    // Secondary resonant harmonic bell (2640 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2640, ctx.currentTime);
    gain2.gain.setValueAtTime(0.4, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.5);

    // Metallic latch mechanical click
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'square';
    osc3.frequency.setValueAtTime(440, ctx.currentTime + 0.05);
    gain3.gain.setValueAtTime(0.3, ctx.currentTime + 0.05);
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(ctx.currentTime + 0.05);
    osc3.stop(ctx.currentTime + 0.15);
  } catch (err) {
    console.warn('Audio chime warning:', err);
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('settings');
  const [reportSubTab, setReportSubTab] = useState('Daily Overview');
  const [currentUser, setCurrentUser] = useState(INITIAL_STAFF[0]);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);

  // Exact Linoli Cove Midigama settings matching your screenshot
  const [settings, setSettings] = useState({
    restaurantName: 'Linoli Cove Midigama',
    phone: '+94 74 036 6741',
    address: '380 A Matara Road,Midigama, 81700',
    currency: 'RS.',
    serviceChargeRate: 10.00,
    taxRate: 0.00,
    receiptHeader: 'Welcome to Down South!\nFresh Seafood & Craft Drinks',
    receiptFooter: 'Thank you for dining with us!\nPlease come again.',
    terminalId: 'LINOLI-MAIN-01',
    tagline: 'RESTAURANT & BAR',
    // Hardware thermal & drawer settings
    autoDrawerKick: 'ENABLED',
    drawerKickTrigger: 'CASH_ONLY', // 'CASH_ONLY' or 'ALL'
    drawerPinout: 'PIN_2', // 'PIN_2' = ESC p 0, 'PIN_5' = ESC p 1
    receiptRollWidth: '80mm', // '80mm' or '58mm'
    chimeAudio: true
  });

  // Direct USB ESC/POS Printer Pairing state
  const [pairedUsbDevice, setPairedUsbDevice] = useState(null);
  const [usbStatusMessage, setUsbStatusMessage] = useState('');
  const [drawerAlertBanner, setDrawerAlertBanner] = useState(null);

  // Core collections
  const [inventory, setInventory] = useState(INITIAL_RAW_INVENTORY);
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [floorTables, setFloorTables] = useState(INITIAL_FLOOR_TABLES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // POS Order Staging
  const [orderMode, setOrderMode] = useState('DINING');
  const [selectedTable, setSelectedTable] = useState(INITIAL_FLOOR_TABLES[1]);
  const [takeawayInfo, setTakeawayInfo] = useState({ name: 'Walk-in Guest', phone: '', token: 'TK-102' });
  const [guestCount, setGuestCount] = useState(2);
  const [cart, setCart] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);

  // Surcharges on Current Cart
  const [serviceChargeActive, setServiceChargeActive] = useState(true);
  const [taxActive, setTaxActive] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Active Orders in Kitchen / Floor
  const [activeOrders, setActiveOrders] = useState([
    {
      orderId: 'ORD-1001',
      mode: 'DINING',
      tableId: 'T-02',
      tableName: 'Table 2',
      zone: 'Indoor Main Hall',
      guestCount: 2,
      server: 'Marco Rossi',
      sentAt: '12:45 PM',
      status: 'PREPARING',
      serviceChargeActive: true,
      taxActive: false,
      discountPercent: 0,
      items: [
        { ...INITIAL_MENU_ITEMS[0], cartItemId: 'c_init_1', qty: 1, notes: 'Less spicy please' },
        { ...INITIAL_MENU_ITEMS[1], cartItemId: 'c_init_2', qty: 1, notes: 'Sugar on the side' }
      ]
    }
  ]);

  // Settled Transactions History
  const [transactions, setTransactions] = useState([
    {
      invoiceNo: 'INV-8801',
      orderRef: 'ORD-0998',
      date: '09/19/2026 13:10:45',
      table: 'Table 2',
      mode: 'DINING',
      cashier: 'System Administrator',
      items: [
        { name: 'SEAFOOD FRIED RICE', department: 'Kitchen', qty: 1, price: 2250.00 },
        { name: 'Espresso', department: 'Bar', qty: 1, price: 600.00 }
      ],
      subtotal: 2850.00,
      serviceCharge: 285.00,
      tax: 0.00,
      discount: 0.00,
      total: 3135.00,
      paymentMethod: 'CASH',
      cogs: 620.00
    }
  ]);

  // Cancelled Tickets / Voids Audit Log
  const [cancelledTickets, setCancelledTickets] = useState([
    {
      id: 'VOID-301',
      timestamp: '09/19/2026 11:20 AM',
      itemName: 'Angus Truffle Burger',
      qty: 1,
      table: 'Table 1',
      reason: 'Customer cancelled prior to prep',
      authorizedBy: 'System Administrator'
    }
  ]);

  // Cashier Shifts
  const [currentShift, setCurrentShift] = useState({
    shiftId: 'SHIFT-20260919-01',
    openedAt: '09:00 AM',
    openedBy: 'Marco Rossi',
    startingFloat: 15000.00,
    status: 'OPEN',
    payouts: [
      { id: 'po_1', time: '11:15 AM', amount: 1200.00, reason: 'Fresh Lime & Mint Market Purchase', staff: 'Marco Rossi' }
    ]
  });

  const [shiftHistory, setShiftHistory] = useState([]);
  const [denominations, setDenominations] = useState({ 5000: 0, 1000: 0, 500: 0, 100: 0, 50: 0, 20: 0 });
  const [payoutForm, setPayoutForm] = useState({ amount: '', reason: '' });

  // Dialog & Modal Triggers
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
    category: 'Mains & Grills',
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

  const inventoryMap = useMemo(() => {
    const map = {};
    inventory.forEach(item => {
      map[item.id] = item;
    });
    return map;
  }, [inventory]);

  const calculateDishAvailability = (recipe) => {
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
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartDiscountAmount = (cartSubtotal * discountPercent) / 100;
  const taxableBasis = Math.max(0, cartSubtotal - cartDiscountAmount);
  const cartServiceCharge = serviceChargeActive ? (taxableBasis * settings.serviceChargeRate) / 100 : 0;
  const cartTax = taxActive ? (taxableBasis * settings.taxRate) / 100 : 0;
  const cartGrandTotal = taxableBasis + cartServiceCharge + cartTax;

  const calculateOrderFinancials = (order) => {
    if (!order || !order.items) return { subtotal: 0, discount: 0, service: 0, tax: 0, total: 0 };
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = (subtotal * (order.discountPercent || 0)) / 100;
    const basis = Math.max(0, subtotal - discount);
    const service = order.serviceChargeActive ? (basis * settings.serviceChargeRate) / 100 : 0;
    const tax = order.taxActive ? (basis * settings.taxRate) / 100 : 0;
    const total = basis + service + tax;
    return { subtotal, discount, service, tax, total };
  };

  const handlePairUsbPrinter = async () => {
    if (!navigator.usb) {
      setUsbStatusMessage('WebUSB not supported in this browser. Windows Printer Driver is active.');
      return;
    }
    try {
      setUsbStatusMessage('Requesting USB device selection...');
      const device = await navigator.usb.requestDevice({
        filters: [] // Allow user to choose any USB thermal printer (Epson, Rongta, Xprinter, etc.)
      });
      await device.open();
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }
      await device.claimInterface(0);
      setPairedUsbDevice(device);
      setUsbStatusMessage(`Connected to ${device.productName || 'Thermal USB Printer'}`);
    } catch (err) {
      console.error('USB Pairing Error:', err);
      setUsbStatusMessage('Device pairing cancelled or using Windows Print Spooler.');
    }
  };

  // Sends the RJ11/RJ12 Solenoid kick pulse (ESC p m t1 t2)
  const triggerCashDrawerKick = async (reason = 'Cash Settlement') => {
    if (settings.chimeAudio) {
      playCashRegisterChime();
    }

    setDrawerAlertBanner({
      title: 'Cash Drawer Kicked Open',
      detail: `${reason} • RJ11/RJ12 Solenoid Pulse sent (${settings.drawerPinout === 'PIN_2' ? 'Pin 2 / ESC p 0' : 'Pin 5 / ESC p 1'})`
    });
    setTimeout(() => setDrawerAlertBanner(null), 4500);

    // If paired via direct WebUSB, transmit raw binary ESC/POS pulse bytes
    if (pairedUsbDevice && pairedUsbDevice.opened) {
      try {
        // ESC p m t1 t2: 27, 112, (0 or 1), 50 (pulse on 100ms), 50 (pulse off 100ms)
        const pinCode = settings.drawerPinout === 'PIN_2' ? 0 : 1;
        const kickCommand = new Uint8Array([27, 112, pinCode, 50, 50]);
        // Transfer to out endpoint
        const endpoint = pairedUsbDevice.configuration.interfaces[0].alternate.endpoints.find(e => e.direction === 'out');
        if (endpoint) {
          await pairedUsbDevice.transferOut(endpoint.endpointNumber, kickCommand);
        }
      } catch (usbErr) {
        console.warn('USB Direct drawer kick fallback:', usbErr);
      }
    }
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

    setPrintModalConfig({
      type: 'MULTI_DISPATCH',
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

  const handleCompleteSettlement = () => {
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

    // Deplete Inventory Based on Recipe BOM
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

    const newInvoice = {
      invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      orderRef: targetOrder.orderId,
      date: new Date().toLocaleString(),
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

    setTransactions(prev => [newInvoice, ...prev]);
    setActiveOrders(prev => prev.filter(o => o.orderId !== targetOrder.orderId));

    if (targetOrder.tableId) {
      setFloorTables(prev => prev.map(t => t.id === targetOrder.tableId ? { ...t, status: 'VACANT', currentOrderRef: null } : t));
    }

    // AUTOMATIC CASH DRAWER OPENING CHECK
    const shouldKickDrawer = settings.autoDrawerKick === 'ENABLED' && (
      settings.drawerKickTrigger === 'ALL' ||
      (settings.drawerKickTrigger === 'CASH_ONLY' && paymentMethod === 'CASH')
    );

    if (shouldKickDrawer) {
      triggerCashDrawerKick(`Settlement: ${newInvoice.invoiceNo} (${paymentMethod})`);
    }

    setPrintModalConfig({
      type: 'FINAL_BILL',
      data: newInvoice
    });

    if (editingOrderId === targetOrder.orderId) {
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

    const newItemId = `dish_${Date.now()}`;
    const dishItem = {
      id: newItemId,
      name: newDishForm.name.trim(),
      department: newDishForm.department,
      category: newDishForm.category || 'Mains & Grills',
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
      category: 'Mains & Grills',
      price: '',
      prepTime: '10m',
      description: '',
      imageUrl: '',
      recipeIngredients: []
    });
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
      shiftId: `SHIFT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      openedBy: currentUser.name,
      startingFloat: 15000.00,
      status: 'OPEN',
      payouts: []
    });

    setDenominations({ 5000: 0, 1000: 0, 500: 0, 100: 0, 50: 0, 20: 0 });
  };

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

    transactions.forEach(t => {
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
      paidBillsCount: transactions.length
    };
  }, [transactions]);

  const categoriesList = useMemo(() => {
    const cats = new Set(['All']);
    menuItems.forEach(m => cats.add(m.category));
    return Array.from(cats);
  }, [menuItems]);

  return (
    <div className="flex h-screen w-full bg-[#0b0f19] text-zinc-100 font-sans select-none overflow-hidden antialiased">

      {/* Pop-up Hardware Notification Toast */}
      {drawerAlertBanner && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <div className="p-2 bg-emerald-700 rounded-xl">
            <Zap className="h-5 w-5 text-yellow-300" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider">{drawerAlertBanner.title}</p>
            <p className="text-[11px] font-mono opacity-90">{drawerAlertBanner.detail}</p>
          </div>
        </div>
      )}

      {}
      <aside className="w-64 bg-[#060813] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 z-20 overflow-y-auto">
        <div>
          {/* Logo Header */}
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
          </div>

          {/* Navigation Items */}
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
                  onClick={() => setActiveTab(item.id)}
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
                  onClick={() => setActiveTab(item.id)}
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

        {/* User Footer */}
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
          <button
            onClick={() => {
              setTargetStaffForSwitch(staffList.find(s => s.id !== currentUser.id) || staffList[0]);
              setPinModalOpen(true);
            }}
            title="Fast PIN Role Switch"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <KeyRound className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 text-slate-900">

        {/* Top Header */}
        <header className="h-14 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              TERMINAL: {settings.terminalId}
            </span>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Online
            </div>
            {pairedUsbDevice && (
              <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                <Usb className="h-3 w-3" />
                USB Printer Active
              </div>
            )}
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
              Currency: {settings.currency}
            </div>

            <button
              onClick={() => {
                setTargetStaffForSwitch(staffList[0]);
                setPinModalOpen(true);
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Switch / Lock</span>
            </button>
          </div>
        </header>

        {}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-xl font-black text-slate-900">System &amp; Restaurant Settings</h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure restaurant details, currency, default service charge rate, and thermal receipt headers/footers.
              </p>
            </div>

            {/* RESTAURANT IDENTITY */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ff5500]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  RESTAURANT IDENTITY
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    value={settings.restaurantName}
                    onChange={e => setSettings(prev => ({ ...prev, restaurantName: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={e => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={e => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            {/* CURRENCY & CHARGES */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  CURRENCY &amp; CHARGES
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={settings.currency}
                    onChange={e => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Default Service Charge (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.serviceChargeRate}
                    onChange={e => setSettings(prev => ({ ...prev, serviceChargeRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tax / VAT Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={e => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

            {/* RECEIPT CUSTOMIZATION */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                RECEIPT CUSTOMIZATION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Receipt Header Message</label>
                  <textarea
                    rows={3}
                    value={settings.receiptHeader}
                    onChange={e => setSettings(prev => ({ ...prev, receiptHeader: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Receipt Footer Message</label>
                  <textarea
                    rows={3}
                    value={settings.receiptFooter}
                    onChange={e => setSettings(prev => ({ ...prev, receiptFooter: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

            {}
            <div className="space-y-6 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Printer className="h-4 w-4 text-[#ff5500]" />
                    THERMAL PRINTER &amp; CASH DRAWER HARDWARE
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct WebUSB ESC/POS hardware, RJ11/RJ12 solenoid pulse, and Windows print spooler integration
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                  {pairedUsbDevice ? `USB: ${pairedUsbDevice.productName || 'Connected'}` : 'Windows Printer Driver (Active)'}
                </span>
              </div>

              {/* USB Hardware Pairing Card */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-black rounded-lg">
                    USB
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">
                      Supports direct WebUSB ESC/POS kick + standard Windows thermal printer drivers
                    </p>
                    {usbStatusMessage && (
                      <p className="text-[11px] font-mono text-indigo-600 mt-0.5">{usbStatusMessage}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePairUsbPrinter}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Usb className="h-4 w-4" />
                    <span>Pair USB Printer</span>
                  </button>
                </div>
              </div>

              {/* Cash Drawer & Solenoid Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-800">Cash Drawer Auto-Kick</label>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">Automatic</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Automatically sends a pulse to open cash drawer when final bill is settled.
                  </p>
                  <select
                    value={settings.autoDrawerKick}
                    onChange={e => setSettings(prev => ({ ...prev, autoDrawerKick: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="ENABLED">Enabled (Auto-Open)</option>
                    <option value="DISABLED">Disabled (Manual Only)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-800">Drawer Kick Trigger</label>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Trigger Mode</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Controls which customer payment settlement methods pop open the cash drawer.
                  </p>
                  <select
                    value={settings.drawerKickTrigger}
                    onChange={e => setSettings(prev => ({ ...prev, drawerKickTrigger: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="CASH_ONLY">On CASH Payments Only (Recommended)</option>
                    <option value="ALL">On All Settlements (Cash, Card, Split)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-800">RJ11/RJ12 Connector Pin</label>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">Pinout</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Solenoid pulse signal pinout for your printer manufacturer (Epson, Xprinter, etc).
                  </p>
                  <select
                    value={settings.drawerPinout}
                    onChange={e => setSettings(prev => ({ ...prev, drawerPinout: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="PIN_2">Pin 2 - ESC p 0 (Standard Epson, Xprinter, Rongta)</option>
                    <option value="PIN_5">Pin 5 - ESC p 1 (Star Micronics, Custom)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-800">Thermal Receipt Roll Width</label>
                    <span className="text-[10px] font-bold text-purple-600 uppercase">Paper Size</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Default paper roll width format for printed customer bills, KOT, and BOT tickets.
                  </p>
                  <select
                    value={settings.receiptRollWidth}
                    onChange={e => setSettings(prev => ({ ...prev, receiptRollWidth: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="80mm">80mm Standard Thermal Roll (76mm printable)</option>
                    <option value="58mm">58mm Compact Thermal Roll (48mm printable)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-800">Cash Register Chime (Audio)</label>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Web Audio</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Synthesizes an authentic "ka-ching" metallic bell chime via Web Audio API.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, chimeAudio: !prev.chimeAudio }))}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        settings.chimeAudio
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                    >
                      {settings.chimeAudio ? 'Chime Enabled (Active)' : 'Chime Muted'}
                    </button>
                    <button
                      onClick={playCashRegisterChime}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Volume2 className="h-3.5 w-3.5" /> Test Sound
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-800">Hardware Kick Diagnostic</label>
                    <span className="text-[10px] font-bold text-rose-600 uppercase">Test Tool</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Fire a test pulse now to verify physical solenoid drawer kick and chime output.
                  </p>
                  <button
                    onClick={() => triggerCashDrawerKick('Manual Diagnostic Test')}
                    className="w-full py-2 bg-[#ff5500] hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all"
                  >
                    <Zap className="h-4 w-4" /> Pop Open Cash Drawer Now
                  </button>
                </div>
              </div>
            </div>

            {/* Save Settings Confirmation */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  setDrawerAlertBanner({
                    title: 'System Settings Saved',
                    detail: 'Identity, receipt headers, and hardware parameters are active.'
                  });
                  setTimeout(() => setDrawerAlertBanner(null), 3000);
                }}
                className="px-6 py-2.5 bg-[#008f5d] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 flex items-center gap-2 transition-all"
              >
                <CheckCircle2 className="h-4 w-4" /> Save System Settings
              </button>
            </div>
          </div>
        )}

        {}
        {activeTab === 'pos' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Catalog Grid */}
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

              {/* Dish Cards */}
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
                            <span className={`absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded shadow-sm ${
                              dish.department === 'Bar' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'
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

            {/* Right Side Ticket Sidebar */}
            <div className="w-96 bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 shadow-lg">
              
              {/* Order Target & Allocation Bar */}
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

                {/* Surcharges and Cash Drawer Fast Pop */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => setServiceChargeActive(!serviceChargeActive)}
                    className={`py-1 px-2 rounded-lg border text-xs font-bold transition-all ${
                      serviceChargeActive
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    Svc ({settings.serviceChargeRate}%): {serviceChargeActive ? 'ON' : 'OFF'}
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

                  <button
                    onClick={() => triggerCashDrawerKick('POS Manual Kick')}
                    title="Pop Cash Drawer Now"
                    className="py-1 px-2 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Zap className="h-3 w-3 text-[#ff5500]" />
                    <span>Drawer</span>
                  </button>
                </div>
              </div>

              {/* Ticket Items List */}
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

        {}
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
                'Stock Usage'
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Sales &amp; Revenue Reports
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Financial performance for {settings.restaurantName} ({settings.currency}).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPrintModalConfig({ type: 'DAILY_SUMMARY', data: salesMetrics })}
                      className="px-4 py-2 bg-[#008f5d] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print Thermal ({settings.receiptRollWidth})</span>
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
              </>
            )}
          </div>
        )}

        {}
        {activeTab === 'billing' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Billing &amp; Settlement Queue</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage sent orders, print interim proforma bills, and settle final payments.
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
                            <div key={idx} className="flex justify-between">
                              <span className="font-bold text-slate-800">{item.qty}x {item.name}</span>
                              <span className="font-mono text-slate-500">{settings.currency} {(item.price * item.qty).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
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

                          <button
                            onClick={() => {
                              setSettlingOrder(order);
                              setPaymentMethod('CASH');
                              setCheckoutModalOpen(true);
                            }}
                            className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1 shadow-sm"
                          >
                            <DollarSign className="h-3.5 w-3.5" /> Settle Bill
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {}
        {activeTab === 'kds' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h2 className="text-xl font-black text-slate-900">Live Kitchen Display (KOT)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeOrders
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
                ))}
            </div>
          </div>
        )}

        {activeTab === 'bar' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h2 className="text-xl font-black text-slate-900">Live Bar Display (BOT)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeOrders
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
                ))}
            </div>
          </div>
        )}

        {activeTab === 'tables' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Table &amp; Floor Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time floor occupancy and seating.</p>
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
              {floorTables.map(tbl => (
                <div key={tbl.id} className="bg-white rounded-2xl border p-5 shadow-sm border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">{tbl.id}</span>
                        <h3 className="text-base font-black text-slate-900">{tbl.name}</h3>
                        <p className="text-xs text-slate-500">{tbl.zone}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tbl.status === 'OCCUPIED' ? 'bg-orange-100 text-[#ff5500]' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {tbl.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-600 mt-3">Capacity: {tbl.capacity} Seats</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedTable(tbl);
                        setOrderMode('DINING');
                        setActiveTab('pos');
                      }}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                    >
                      {tbl.status === 'OCCUPIED' ? 'Open Order' : 'Seat Table'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Stock &amp; Raw Inventory</h2>
                <p className="text-xs text-slate-500 mt-0.5">Raw materials automatically depleted on bill settlement.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setReceiveStockModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Package className="h-3.5 w-3.5" /> Receive Stock
                </button>
                <button
                  onClick={() => setAddInventoryModalOpen(true)}
                  className="px-3.5 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Material
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
                    <th className="py-3 px-4">Unit Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map(ing => (
                    <tr key={ing.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">{ing.name}</td>
                      <td className="py-3 px-4 text-slate-600">{ing.category}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{ing.stock} {ing.unit}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{settings.currency} {ing.cost.toFixed(2)} / {ing.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {}
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cash Tendered ({settings.currency})
                      </label>
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
                      {settings.autoDrawerKick === 'ENABLED' && (
                        <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5" /> Cash Drawer will automatically pop open upon confirming.
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
                        <span>Service Charge ({settings.serviceChargeRate}%)</span>
                        <span className="font-mono">+{settings.currency} {fin.service.toFixed(2)}</span>
                      </div>
                    )}
                    {fin.tax > 0 && (
                      <div className="flex justify-between text-indigo-700 font-medium">
                        <span>Taxes ({settings.taxRate}%)</span>
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
                    Confirm Settlement &amp; Open Drawer
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {}
      {printModalConfig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center">
            
            <div className="flex items-center justify-between w-full mb-3 text-white">
              <span className="text-xs font-bold font-mono text-orange-400 uppercase">
                {settings.receiptRollWidth} Thermal Dispatch
              </span>
              <button onClick={() => setPrintModalConfig(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="w-full bg-white text-slate-900 p-4 rounded font-mono text-[11px] leading-tight shadow-md max-h-[60vh] overflow-y-auto space-y-4">
              
              {/* Final Settlement Tax Invoice */}
              {printModalConfig.type === 'FINAL_BILL' && (
                <div className="space-y-2">
                  <div className="text-center border-b-2 border-dashed border-slate-800 pb-2">
                    <p className="font-black text-sm">{settings.restaurantName}</p>
                    <p className="text-[10px]">{settings.address}</p>
                    <p className="text-[10px]">Tel: {settings.phone}</p>
                    <p className="text-[9px] whitespace-pre-line mt-1">{settings.receiptHeader}</p>
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

              {/* Multi Dispatch KOT / BOT */}
              {printModalConfig.type === 'MULTI_DISPATCH' && (
                <div className="space-y-3">
                  <div className="border-b-2 border-dashed border-slate-800 pb-3 text-center">
                    <p className="font-black text-xs">** KITCHEN ORDER TICKET (KOT) **</p>
                    <p className="font-bold text-xs mt-1">{printModalConfig.data.order.tableName}</p>
                    <p className="text-[10px]">Time: {printModalConfig.data.order.sentAt}</p>
                    <div className="text-left py-2 space-y-1">
                      {printModalConfig.data.kitchenItems.map((item, idx) => (
                        <div key={idx}>
                          <p className="font-bold">{item.qty}x {item.name}</p>
                          {item.notes && <p className="text-[10px] pl-2 italic">&gt; {item.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {printModalConfig.data.barItems.length > 0 && (
                    <div className="border-b-2 border-dashed border-slate-800 pb-3 text-center">
                      <p className="font-black text-xs">** BAR ORDER TICKET (BOT) **</p>
                      <p className="font-bold text-xs mt-1">{printModalConfig.data.order.tableName}</p>
                      <div className="text-left py-2 space-y-1">
                        {printModalConfig.data.barItems.map((item, idx) => (
                          <div key={idx}>
                            <p className="font-bold">{item.qty}x {item.name}</p>
                            {item.notes && <p className="text-[10px] pl-2 italic">&gt; {item.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            <button
              onClick={() => window.print()}
              className="w-full mt-4 py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/30"
            >
              <Printer className="h-4 w-4" /> Print Thermal Slip
            </button>
          </div>
        </div>
      )}

      {/* PIN Security Switch Modal */}
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

      {/* Void Item Reason Modal */}
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

    </div>
  );
}