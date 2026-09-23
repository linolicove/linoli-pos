import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Menu,
  Edit3,
  LayoutGrid,
  Download,
  Building,
  HardDrive,
  Mail
} from 'lucide-react';
import { syncToCloud, subscribeToCloud } from './firebase'; // <-- ADD THIS LINE

const ROLE_PERMISSIONS = {
  Administrator: ['pos', 'kds', 'bar', 'billing', 'tables', 'stock', 'recipes', 'shifts', 'reports', 'menu_admin', 'cancelled', 'staff', 'settings'],
  Manager: ['pos', 'kds', 'bar', 'billing', 'tables', 'stock', 'recipes', 'shifts', 'reports', 'menu_admin', 'cancelled', 'settings'],
  Cashier: ['pos', 'billing', 'tables', 'shifts', 'reports'],
  'Kitchen Chef': ['kds', 'recipes', 'stock'],
  Bartender: ['bar', 'recipes', 'stock'],
  'Floor Server': ['pos', 'tables', 'billing']
};

const INITIAL_STAFF = [
  { id: 'usr_admin', name: 'System Administrator', role: 'Administrator', pin: '2022', avatar: 'SA', email: 'admin@linolicove.com' }
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
  { id: 'ing_calamari', name: 'Fresh Reef Calamari', category: 'Seafood', stock: 6500, unit: 'g', cost: 1.95, threshold: 1200 },
  { id: 'ing_rum', name: 'White Rum', category: 'Bar Supplies', stock: 4500, unit: 'ml', cost: 3.20, threshold: 1000 },
  { id: 'ing_lime', name: 'Fresh Lime Juice', category: 'Produce', stock: 3200, unit: 'ml', cost: 0.80, threshold: 500 },
  { id: 'ing_mint', name: 'Garden Fresh Mint', category: 'Produce', stock: 850, unit: 'g', cost: 1.50, threshold: 200 },
  { id: 'ing_soda', name: 'Sparkling Soda Water', category: 'Beverages', stock: 9500, unit: 'ml', cost: 0.15, threshold: 2000 },
  { id: 'ing_lion_lager', name: 'Lion Lager 625ml', category: 'Bar Supplies', stock: 54, unit: 'pcs', cost: 650.00, threshold: 15 }
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

function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (e) {
      console.warn(`LocalStorage read error for ${key}:`, e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.warn(`LocalStorage write error for ${key}:`, e);
    }
  }, [key, state]);

  return [state, setState];
}

const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  // Authentication & Navigation
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPinInput, setLoginPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('pos');
  const [reportSubTab, setReportSubTab] = useState('Daily Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posViewMode, setPosViewMode] = useState('grid'); // 'grid' | 'compact' | 'list'
  const [adminMenuCategory, setAdminMenuCategory] = useState('All');

  // Persistent collections
  const [staffList, setStaffList] = usePersistentState('linoli_staff_list', INITIAL_STAFF);
  const [currentUser, setCurrentUser] = useState(INITIAL_STAFF[0]);
  const [inventory, setInventory] = usePersistentState('linoli_inventory', INITIAL_RAW_INVENTORY);
  const [menuItems, setMenuItems] = usePersistentState('linoli_menu_items', INITIAL_MENU_ITEMS);
  const [floorTables, setFloorTables] = usePersistentState('linoli_floor_tables', INITIAL_FLOOR_TABLES);
  const [activeOrders, setActiveOrders] = usePersistentState('linoli_active_orders', []);
  const [transactions, setTransactions] = usePersistentState('linoli_transactions', []);
  const [auditLogs, setAuditLogs] = usePersistentState('linoli_audit_logs', []);
  const [cancelledTickets, setCancelledTickets] = usePersistentState('linoli_cancelled_tickets', []);

  // System Settings
  const [settings, setSettings] = usePersistentState('linoli_system_settings', {
    restaurantName: 'Linoli Cove Midigama',
    tagline: 'RESTAURANT & BAR',
    legalName: 'Linoli Cove Leisure (Pvt) Ltd',
    businessRegNo: 'PV-00289144',
    taxId: 'TIN-109284719',
    terminalId: 'LINOLI-MAIN-01',
    phone: '+94 74 036 6741',
    email: 'info@linolicove.me',
    website: 'www.linolicove.me',
    address: '380 A Matara Road, Midigama, 81700',
    currency: 'Rs.',
    serviceChargeRate: 10,
    taxRate: 8,
    receiptRollWidth: '80mm',
    receiptFontSize: '11px',
    receiptFontFamily: 'monospace',
    receiptMargin: '2mm',
    autoPrintOrder: true,
    autoPrintBill: true,
    autoDrawerKick: 'ENABLED',
    drawerKickTrigger: 'CASH_ONLY',
    drawerPinout: 'PIN_2',
    chimeAudio: true,
    receiptHeader: 'Linoli Cove Beach Resort & Dining\nBeach Road, Midigama\nTel: +94 74 036 6741',
    receiptFooter: 'Thank you for your visit!\nPlease come again.'
  });

  // Shifts state
  const [currentShift, setCurrentShift] = usePersistentState('linoli_current_shift', {
    shiftId: `SHIFT-${getLocalDateStr().replace(/-/g, '')}-01`,
    openedDate: getLocalDateStr(), // <-- ADD THIS
    openedAt: '09:00 AM',
    openedBy: 'Marco Rossi',
    startingFloat: 10000.00,
    status: 'OPEN',
    payouts: []
  });

  const [shiftHistory, setShiftHistory] = usePersistentState('linoli_shift_history', []);
  const [denominations, setDenominations] = usePersistentState('linoli_denominations', { 
    5000: 0, 1000: 0, 500: 0, 100: 0, 50: 0, 20: 0 });
  const [payoutForm, setPayoutForm] = useState({ amount: '', reason: '' });

  const [cashOutForm, setCashOutForm] = useState({
    amount: '',
    category: 'Supplier / Vendor',
    reason: '',
    recipient: ''
  });
  const [cashOutApprovalModal, setCashOutApprovalModal] = useState({
    open: false,
    item: null,
    managerPin: '',
    error: ''
  });

  // POS State
  const [orderMode, setOrderMode] = useState('DINING');
  const [selectedTable, setSelectedTable] = useState(INITIAL_FLOOR_TABLES[0]);
  const [takeawayInfo, setTakeawayInfo] = useState({ name: 'Walk-in Guest', phone: '', token: 'TK-101' });
  const [guestCount, setGuestCount] = useState(2);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [serviceChargeActive, setServiceChargeActive] = useState(true);
  const [taxActive, setTaxActive] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Date Filter State for Reports
  const [reportStartDate, setReportStartDate] = useState(getLocalDateStr());
  const [reportEndDate, setReportEndDate] = useState(getLocalDateStr());

  // Hardware State
  const [pairedUsbDevice, setPairedUsbDevice] = useState(null);
  const [usbStatusMessage, setUsbStatusMessage] = useState('');
  const [settingsNotice, setSettingsNotice] = useState(null);

  const [emailSettings, setEmailSettings] = usePersistentState('linoli_email_settings', {
    enabled: true,
    recipient: 'linolicove@gmail.com',
    scheduledTime: '23:30',
    webhookUrl: '',
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: '',
    lastSentDate: ''
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Background Auto-Print State (No blocking modal)
  const [activePrintSlip, setActivePrintSlip] = useState(null);
  const [printNotice, setPrintNotice] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [settlingOrder, setSettlingOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [cashTendered, setCashTendered] = useState('');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [targetStaffForSwitch, setTargetStaffForSwitch] = useState(null);
  const [pinError, setPinError] = useState('');
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({ name: '', role: 'Cashier', pin: '', email: '' });
  const [staffFormError, setStaffFormError] = useState('');
  const [addTableModalOpen, setAddTableModalOpen] = useState(false);
  const [newTableForm, setNewTableForm] = useState({ name: '', zone: 'Indoor Main Hall', capacity: 4 });
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [voidModalOpen, setVoidModalOpen] = useState(false);
  const [voidPayload, setVoidPayload] = useState({ item: null, reason: '' });

  // Bill Editing Modal (Billing queue)
  const [editBillModalOpen, setEditBillModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  // Inventory & Recipe Modals
  const [addInventoryModalOpen, setAddInventoryModalOpen] = useState(false);
  const [newInventoryForm, setNewInventoryForm] = useState({ name: '', category: 'Dry Goods', stock: '', unit: 'g', cost: '', threshold: '' });
  const [receiveStockModalOpen, setReceiveStockModalOpen] = useState(false);
  const [receiveStockForm, setReceiveStockForm] = useState({ ingredientId: '', quantity: '', supplier: '', invoiceRef: '', newCost: '' });
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
  const [recipeConfigModalOpen, setRecipeConfigModalOpen] = useState(false);
  const [editingDishForRecipe, setEditingDishForRecipe] = useState(null);
  const [currentRecipeIngredients, setCurrentRecipeIngredients] = useState([]);
  const [tempIngredientSelect, setTempIngredientSelect] = useState({ ingredientId: '', amount: '' });
 // Refs to prevent premature uploads and re-render loops
  const isCloudSynced = useRef(false);
  const prevOrdersRef = useRef('');
  const prevTransRef = useRef('');
  const prevTablesRef = useRef('');
  const prevAuditsRef = useRef('');
  const prevMenuRef = useRef('');
  const prevInventoryRef = useRef(''); // <-- ADD THIS
  const prevExpensesRef = useRef('');  // <-- ADD THIS
  const prevStaffRef = useRef('');
  const prevShiftRef = useRef('');
  const [expenses, setExpenses] = useState(() => {
  try {
    const local = localStorage.getItem('linoli_expenses');
    return local ? JSON.parse(local) : [];
  } catch (e) {
    return [];
  }
  });

  // ============================================================
  // 1. REAL-TIME CLOUD LISTENERS (Download from Firebase)
  // ============================================================
  useEffect(() => {
    // 1. Receive incoming active orders
    const unsubOrders = subscribeToCloud('active_orders', (remoteOrders) => {
      isCloudSynced.current = true;
      if (Array.isArray(remoteOrders)) {
        const serialized = JSON.stringify(remoteOrders);
        if (prevOrdersRef.current === serialized) return;
        prevOrdersRef.current = serialized;
        setActiveOrders(remoteOrders);
        localStorage.setItem('linoli_active_orders', serialized);
      }
    });

    // 2. Receive incoming settled transactions
    const unsubTrans = subscribeToCloud('transactions', (remoteTrans) => {
      isCloudSynced.current = true;
      if (Array.isArray(remoteTrans)) {
        const serialized = JSON.stringify(remoteTrans);
        if (prevTransRef.current === serialized) return;
        prevTransRef.current = serialized;
        setTransactions(remoteTrans);
        localStorage.setItem('linoli_transactions', serialized);
      }
    });

    // 3. Receive incoming table occupancy / floor status
    const unsubTables = subscribeToCloud('floor_tables', (remoteTables) => {
      isCloudSynced.current = true;
      if (Array.isArray(remoteTables)) {
        const serialized = JSON.stringify(remoteTables);
        if (prevTablesRef.current === serialized) return;
        prevTablesRef.current = serialized;
        setFloorTables(remoteTables);
        localStorage.setItem('linoli_floor_tables', serialized);
      }
    });

    // 4. Receive incoming audit trail activity logs
    const unsubAudits = subscribeToCloud('audit_logs', (remoteAudits) => {
      isCloudSynced.current = true;
      if (Array.isArray(remoteAudits)) {
        const serialized = JSON.stringify(remoteAudits);
        if (prevAuditsRef.current === serialized) return;
        prevAuditsRef.current = serialized;
        setAuditLogs(remoteAudits);
        localStorage.setItem('linoli_audit_logs', serialized);
      }
    });

    // 5. Receive incoming menu items
    const unsubMenu = subscribeToCloud('menu_items', (remoteMenu) => {
      isCloudSynced.current = true;
      if (Array.isArray(remoteMenu)) {
        const serialized = JSON.stringify(remoteMenu);
        if (prevMenuRef.current === serialized) return;
        prevMenuRef.current = serialized;
        setMenuItems(remoteMenu);
        localStorage.setItem('linoli_menu_items', serialized);
      }
    });
    // 6. Receive raw inventory adjustments
  const unsubInventory = subscribeToCloud('inventory', (remoteInv) => {
    isCloudSynced.current = true;
    if (Array.isArray(remoteInv)) {
      const serialized = JSON.stringify(remoteInv);
      if (prevInventoryRef.current === serialized) return;
      prevInventoryRef.current = serialized;
      setInventory(remoteInv);
      localStorage.setItem('linoli_inventory', serialized);
    }
  });

  // 7. Receive recorded cash expenses
  const unsubExpenses = subscribeToCloud('expenses', (remoteExp) => {
    isCloudSynced.current = true;
    if (Array.isArray(remoteExp)) {
      const serialized = JSON.stringify(remoteExp);
      if (prevExpensesRef.current === serialized) return;
      prevExpensesRef.current = serialized;
      setExpenses(remoteExp);
      localStorage.setItem('linoli_expenses', serialized);
    }
  }); 
  // 8. Receive incoming cashier shift updates
const unsubShift = subscribeToCloud('current_shift', (remoteShift) => {
  isCloudSynced.current = true;
  if (remoteShift && typeof remoteShift === 'object') {
    const serialized = JSON.stringify(remoteShift);
    if (prevShiftRef.current === serialized) return;
    prevShiftRef.current = serialized;
    setCurrentShift(remoteShift);
    localStorage.setItem('linoli_current_shift', serialized);
  }
});
  // 8. Receive incoming staff list
    const unsubStaff = subscribeToCloud('staff_list', (remoteStaff) => {
      isCloudSynced.current = true;
      if (Array.isArray(remoteStaff) && remoteStaff.length > 0) {
        const serialized = JSON.stringify(remoteStaff);
        if (prevStaffRef.current === serialized) return;
        prevStaffRef.current = serialized;
        setStaffList(remoteStaff);
        localStorage.setItem('linoli_staff_list', serialized);
      }
    });
    return () => {
      if (typeof unsubOrders === 'function') unsubOrders();
      if (typeof unsubTrans === 'function') unsubTrans();
      if (typeof unsubTables === 'function') unsubTables();
      if (typeof unsubAudits === 'function') unsubAudits();
      if (typeof unsubMenu === 'function') unsubMenu();
      if (typeof unsubInventory === 'function') unsubInventory();
      if (typeof unsubExpenses === 'function') unsubExpenses();
      if (typeof unsubShift === 'function') unsubShift();
      if (typeof unsubStaff === 'function') unsubStaff();
    };
  }, []);

  // ============================================================
  // 2. BROADCAST LOCAL CHANGES UP TO FIREBASE (Guarded)
  // ============================================================
  useEffect(() => {
    if (!isCloudSynced.current) return;
    if (activeOrders !== undefined) {
      const current = JSON.stringify(activeOrders);
      if (current !== prevOrdersRef.current) {
        prevOrdersRef.current = current;
        syncToCloud('active_orders', activeOrders);
      }
    }
  }, [activeOrders]);

  useEffect(() => {
    if (!isCloudSynced.current) return;
    if (transactions !== undefined) {
      const current = JSON.stringify(transactions);
      if (current !== prevTransRef.current) {
        prevTransRef.current = current;
        syncToCloud('transactions', transactions);
      }
    }
  }, [transactions]);

  useEffect(() => {
    if (!isCloudSynced.current) return;
    if (floorTables !== undefined) {
      const current = JSON.stringify(floorTables);
      if (current !== prevTablesRef.current) {
        prevTablesRef.current = current;
        syncToCloud('floor_tables', floorTables);
      }
    }
  }, [floorTables]);

  useEffect(() => {
    if (!isCloudSynced.current) return;
    if (auditLogs !== undefined) {
      const current = JSON.stringify(auditLogs);
      if (current !== prevAuditsRef.current) {
        prevAuditsRef.current = current;
        syncToCloud('audit_logs', auditLogs);
      }
    }
  }, [auditLogs]);

  useEffect(() => {
    if (!isCloudSynced.current) return;
    if (menuItems !== undefined && menuItems.length > 0) {
      const current = JSON.stringify(menuItems);
      if (current !== prevMenuRef.current) {
        prevMenuRef.current = current;
        syncToCloud('menu_items', menuItems);
      }
    }
  }, [menuItems]);
  useEffect(() => {
    if (!isCloudSynced.current) return;
    if (inventory !== undefined && inventory.length > 0) {
      const current = JSON.stringify(inventory);
      if (current !== prevInventoryRef.current) {
        prevInventoryRef.current = current;
        syncToCloud('inventory', inventory);
      }
    }
  }, [inventory]);

  useEffect(() => {
    if (!isCloudSynced.current) return;
    if (expenses !== undefined) {
      const current = JSON.stringify(expenses);
      if (current !== prevExpensesRef.current) {
        prevExpensesRef.current = current;
        syncToCloud('expenses', expenses);
      }
    }
  }, [expenses]);
  
  useEffect(() => {
  if (!isCloudSynced.current) return;
  if (currentShift !== undefined) {
    const current = JSON.stringify(currentShift);
    if (current !== prevShiftRef.current) {
      prevShiftRef.current = current;
      syncToCloud('current_shift', currentShift);
    }
  }
  }, [currentShift]);

  useEffect(() => {
    if (!isCloudSynced.current) return;
    if (staffList !== undefined && staffList.length > 0) {
      const current = JSON.stringify(staffList);
      if (current !== prevStaffRef.current) {
        prevStaffRef.current = current;
        syncToCloud('staff_list', staffList);
      }
    }
  }, [staffList]);

  const handleCreateStaff = (e) => {
    e.preventDefault();
    setStaffFormError('');
    if (!newStaffForm.name.trim()) {
      setStaffFormError('Staff name is required.');
      return;
    }
    const cleanPin = newStaffForm.pin.trim();
    if (!cleanPin || cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      setStaffFormError('PIN must be exactly 4 numeric digits.');
      return;
    }
    if (staffList.some(s => s.pin === cleanPin)) {
      setStaffFormError('This 4-digit PIN is already in use by another employee.');
      return;
    }

    const nameParts = newStaffForm.name.trim().split(' ');
    const initials = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : newStaffForm.name.trim().substring(0, 2).toUpperCase();

    const newStaff = {
      id: `usr_${Date.now().toString().slice(-6)}`,
      name: newStaffForm.name.trim(),
      role: newStaffForm.role,
      pin: cleanPin,
      avatar: initials || 'ST',
      email: newStaffForm.email.trim() || `${newStaffForm.name.trim().toLowerCase().replace(/\s+/g, '')}@linolicove.me`
    };

    setStaffList(prev => [...prev, newStaff]);
    recordAuditLog('STAFF_CREATED', newStaff.id, `Created staff member ${newStaff.name} with role ${newStaff.role} (PIN: ${newStaff.pin})`);
    setAddStaffModalOpen(false);
    setNewStaffForm({ name: '', role: 'Cashier', pin: '', email: '' });
    setStaffFormError('');
  };

  const handleCreateInventoryItem = (e) => {
    e.preventDefault();
    if (!newInventoryForm.name.trim() || !newInventoryForm.cost) return;

    const newItem = {
      id: `ing_${Date.now().toString().slice(-6)}`,
      name: newInventoryForm.name.trim(),
      category: newInventoryForm.category || 'Dry Goods',
      stock: parseFloat(newInventoryForm.stock) || 0,
      unit: newInventoryForm.unit || 'g',
      cost: parseFloat(newInventoryForm.cost) || 0,
      threshold: parseFloat(newInventoryForm.threshold) || 10
    };

    setInventory(prev => [...prev, newItem]);
    recordAuditLog(
      'INVENTORY_ITEM_CREATED',
      newItem.id,
      `Added raw material ${newItem.name} (${newItem.stock} ${newItem.unit} @ ${settings.currency} ${newItem.cost}/${newItem.unit})`
    );

    setAddInventoryModalOpen(false);
    setNewInventoryForm({ name: '', category: 'Dry Goods', stock: '', unit: 'g', cost: '', threshold: '' });
  };

  const handleReceiveStock = (e) => {
    e.preventDefault();
    if (!receiveStockForm.ingredientId || !receiveStockForm.quantity) return;

    const qtyToAdd = parseFloat(receiveStockForm.quantity);
    if (isNaN(qtyToAdd) || qtyToAdd <= 0) return;

    const targetItem = inventoryMap[receiveStockForm.ingredientId];
    const oldStock = targetItem ? targetItem.stock : 0;
    const newStock = Number((oldStock + qtyToAdd).toFixed(2));
    const newCost = receiveStockForm.newCost ? parseFloat(receiveStockForm.newCost) : (targetItem?.cost || 0);

    setInventory(prev => prev.map(item => {
      if (item.id === receiveStockForm.ingredientId) {
        return {
          ...item,
          stock: newStock,
          cost: !isNaN(newCost) && newCost > 0 ? newCost : item.cost
        };
      }
      return item;
    }));

    recordAuditLog(
      'STOCK_RECEIVED',
      receiveStockForm.ingredientId,
      `Received ${qtyToAdd} ${targetItem?.unit || 'units'} of ${targetItem?.name || receiveStockForm.ingredientId}. Supplier: ${receiveStockForm.supplier || 'N/A'}. Invoice: ${receiveStockForm.invoiceRef || 'N/A'}`
    );

    setReceiveStockModalOpen(false);
    setReceiveStockForm({ ingredientId: '', quantity: '', supplier: '', invoiceRef: '', newCost: '' });
  };

  const handleCreateTable = (e) => {
    e.preventDefault();
    if (!newTableForm.name.trim()) return;

    const count = floorTables.length + 1;
    const tableId = `T-${String(count).padStart(2, '0')}`;
    const newTable = {
      id: tableId,
      name: newTableForm.name.trim(),
      zone: newTableForm.zone || 'Indoor Main Hall',
      capacity: parseInt(newTableForm.capacity) || 4,
      status: 'VACANT',
      currentOrderRef: null
    };

    setFloorTables(prev => [...prev, newTable]);
    recordAuditLog(
      'TABLE_CREATED',
      newTable.id,
      `Created table "${newTable.name}" in ${newTable.zone} with capacity of ${newTable.capacity} seats`
    );

    setAddTableModalOpen(false);
    setNewTableForm({ name: '', zone: 'Indoor Main Hall', capacity: 4 });
  };

  // Backup & Restore Handlers
  const handleExportBackup = () => {
    const backupData = {
      app: 'Linoli Cove POS & ERP',
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser.name,
      settings,
      staffList,
      inventory,
      menuItems,
      floorTables,
      activeOrders,
      transactions,
      auditLogs,
      cancelledTickets,
      currentShift,
      shiftHistory
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linoli_cove_backup_${getLocalDateStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    recordAuditLog('BACKUP_EXPORTED', 'DATABASE', `Full system backup file downloaded by ${currentUser.name}`);
    setSettingsNotice({
      title: 'Backup Downloaded Successfully',
      detail: 'All menus, staff, inventory, invoices & audit records exported to JSON.'
    });
    setTimeout(() => setSettingsNotice(null), 4000);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed || (!parsed.settings && !parsed.menuItems)) {
          setSettingsNotice({
            title: 'Invalid Backup File',
            detail: 'The selected file is not a valid Linoli Cove POS database backup.'
          });
          setTimeout(() => setSettingsNotice(null), 4500);
          return;
        }
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.staffList) setStaffList(parsed.staffList);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.menuItems) setMenuItems(parsed.menuItems);
        if (parsed.floorTables) setFloorTables(parsed.floorTables);
        if (parsed.activeOrders) setActiveOrders(parsed.activeOrders);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.cancelledTickets) setCancelledTickets(parsed.cancelledTickets);
        if (parsed.currentShift) setCurrentShift(parsed.currentShift);
        if (parsed.shiftHistory) setShiftHistory(parsed.shiftHistory);

        recordAuditLog('BACKUP_RESTORED', file.name, `System restored from backup file by ${currentUser.name}`);
        setSettingsNotice({
          title: 'Database Restored Successfully',
          detail: `System data loaded from ${file.name}. All records synchronized.`
        });
        setTimeout(() => setSettingsNotice(null), 4500);
      } catch (err) {
        setSettingsNotice({
          title: 'Import Failed',
          detail: `Could not parse backup JSON file: ${err.message}`
        });
        setTimeout(() => setSettingsNotice(null), 4500);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (navigator.usb) {
      navigator.usb.getDevices().then(devices => {
        if (devices.length > 0) {
          setPairedUsbDevice(devices[0]);
          setUsbStatusMessage(`Auto-connected to ${devices[0].productName || 'USB Thermal Printer'}`);
        }
      }).catch(err => console.warn('WebUSB auto-detect notice:', err));
    }
  }, []);

  // Direct push-to-print trigger (Dispatches immediately without opening any modal dialog)
  const triggerAutoPrint = (slipConfig, noticeText = 'Printing thermal receipt...') => {
    setActivePrintSlip(slipConfig);
    setPrintNotice({
      title: slipConfig.type === 'KOT_BOT_DISPATCH'
        ? 'Order Sent • Auto-Printing KOT & BOT'
        : slipConfig.type === 'FINAL_BILL'
        ? 'Bill Settled • Auto-Printing Tax Invoice'
        : slipConfig.type === 'TEMP_BILL'
        ? 'Auto-Printing Proforma Temp Bill'
        : slipConfig.type === 'CASH_OUT_VOUCHER'
        ? 'Auto-Printing Cash Out Voucher'
        : 'Auto-Printing...',
      detail: noticeText
    });
    setTimeout(() => setPrintNotice(null), 2500);
  };

  // Instant print invocation as soon as slip data is staged
  useEffect(() => {
    if (activePrintSlip) {
      const timer = setTimeout(() => {
        try {
          window.print();
        } catch (e) {
          console.warn('Auto print spooler notice:', e);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activePrintSlip]);

  const recordAuditLog = (action, targetRef, details) => {
    const newLog = {
      id: `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleString(),
      action,
      targetRef,
      staff: currentUser.name,
      role: currentUser.role,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const inventoryMap = useMemo(() => {
    const map = {};
    inventory.forEach(item => { map[item.id] = item; });
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

  const generateEodReportData = (targetDate = getLocalDateStr()) => {
    const dayTransactions = transactions.filter(t => extractDateStr(t.date) === targetDate);
    const dayVoids = cancelledTickets.filter(v => extractDateStr(v.timestamp) === targetDate);
    const dayLogs = auditLogs.filter(l => extractDateStr(l.timestamp) === targetDate);
    const dayCashOuts = (currentShift.payouts || []).filter(p => (p.date === targetDate || !p.date));

    let gross = 0;
    let net = 0;
    let service = 0;
    let tax = 0;
    let discount = 0;
    const paymentBreakdown = {};

    dayTransactions.forEach(t => {
      gross += t.total;
      net += t.subtotal;
      service += t.serviceCharge;
      tax += t.tax;
      discount += (t.discount || 0);
      paymentBreakdown[t.paymentMethod] = (paymentBreakdown[t.paymentMethod] || 0) + t.total;
    });

    return {
      restaurant: settings.restaurantName,
      terminal: settings.terminalId,
      date: targetDate,
      generatedAt: new Date().toLocaleString(),
      summary: {
        totalSettledBills: dayTransactions.length,
        grossRevenue: gross,
        netSubtotal: net,
        serviceCharge: service,
        tax: tax,
        discounts: discount,
        paymentMethods: paymentBreakdown
      },
      cashierShift: {
        shiftId: currentShift.shiftId,
        openedBy: currentShift.openedBy,
        openedAt: currentShift.openedAt,
        startingFloat: currentShift.startingFloat,
        cashPayouts: dayCashOuts
      },
      invoices: dayTransactions,
      voidedTickets: dayVoids,
      activityAuditLogs: dayLogs
    };
  };

  const sendDailyEodEmail = async (isManual = false) => {
    const todayStr = getLocalDateStr();
    setIsSendingEmail(true);

    const report = generateEodReportData(todayStr);
    const recipient = emailSettings.recipient || 'linolicove@gmail.com';

    try {
      let sentSuccessfully = false;

      // Transport 1: Custom Webhook Endpoint (e.g. Zapier, Make, n8n, custom server)
      if (emailSettings.webhookUrl) {
        const res = await fetch(emailSettings.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient,
            subject: `[EOD REPORT] ${settings.restaurantName} - ${todayStr}`,
            report
          })
        });
        if (res.ok) sentSuccessfully = true;
      }

      // Transport 2: EmailJS API
      if (!sentSuccessfully && emailSettings.emailjsServiceId && emailSettings.emailjsTemplateId && emailSettings.emailjsPublicKey) {
        const emailjsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: emailSettings.emailjsServiceId,
            template_id: emailSettings.emailjsTemplateId,
            user_id: emailSettings.emailjsPublicKey,
            template_params: {
              to_email: recipient,
              subject: `[Daily Summary] ${settings.restaurantName} - ${todayStr}`,
              summary: `Gross: ${settings.currency} ${report.summary.grossRevenue.toFixed(2)} | Net: ${settings.currency} ${report.summary.netSubtotal.toFixed(2)} | Bills: ${report.summary.totalSettledBills}`,
              report_json: JSON.stringify(report, null, 2)
            }
          })
        });
        if (emailjsRes.ok) sentSuccessfully = true;
      }

      // Transport 3: Client-side mailto & JSON download fallback
      if (!sentSuccessfully) {
        const subject = encodeURIComponent(`[Daily Activity Report] ${settings.restaurantName} - ${todayStr}`);
        const bodyText = encodeURIComponent(
          `Linoli Cove Daily Business & Activity Report\n` +
          `Date: ${todayStr}\n` +
          `Terminal: ${settings.terminalId}\n\n` +
          `--- FINANCIAL SUMMARY ---\n` +
          `Gross Revenue: ${settings.currency} ${report.summary.grossRevenue.toFixed(2)}\n` +
          `Net Sales: ${settings.currency} ${report.summary.netSubtotal.toFixed(2)}\n` +
          `Service Charge: ${settings.currency} ${report.summary.serviceCharge.toFixed(2)}\n` +
          `Taxes: ${settings.currency} ${report.summary.tax.toFixed(2)}\n` +
          `Discounts: ${settings.currency} ${report.summary.discounts.toFixed(2)}\n` +
          `Total Settled Invoices: ${report.summary.totalSettledBills}\n\n` +
          `--- CASH DRAWER ---\n` +
          `Opening Float: ${settings.currency} ${report.cashierShift.startingFloat.toFixed(2)}\n` +
          `Cash Out Disbursements: ${report.cashierShift.cashPayouts.length} records\n\n` +
          `--- AUDIT & VOIDS ---\n` +
          `Voided Tickets: ${report.voidedTickets.length}\n` +
          `Activity Audit Logs: ${report.activityAuditLogs.length} events\n\n` +
          `(Full complete JSON data bundle has also been exported for archive)`
        );

        if (isManual) {
          window.open(`mailto:${recipient}?subject=${subject}&body=${bodyText}`, '_blank');
        }

        // Also download complete JSON archive
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `EOD_Complete_Report_${todayStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        sentSuccessfully = true;
      }

      // Update state and record audit log
      setEmailSettings(prev => ({ ...prev, lastSentDate: todayStr }));
      recordAuditLog('DAILY_EOD_EMAIL_DISPATCHED', recipient, `Dispatched complete day activity & financial report to ${recipient} (Date: ${todayStr})`);

      setSettingsNotice({
        title: 'Daily Report Dispatched',
        detail: `Complete operational report sent to ${recipient} for ${todayStr}.`
      });
      setTimeout(() => setSettingsNotice(null), 5000);
    } catch (err) {
      setSettingsNotice({
        title: 'Email Dispatch Notice',
        detail: `Could not send automatically: ${err.message}`
      });
      setTimeout(() => setSettingsNotice(null), 5000);
    } finally {
      setIsSendingEmail(false);
    }
  };

  useEffect(() => {
    if (!emailSettings.enabled) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;
      const todayStr = getLocalDateStr(now);

      const targetTime = emailSettings.scheduledTime || '23:30';

      // Fire when time matches 11:30 PM (23:30) and has not yet been sent today
      if (currentTimeStr === targetTime && emailSettings.lastSentDate !== todayStr && !isSendingEmail) {
        sendDailyEodEmail(false);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [emailSettings, isSendingEmail]);

  // Cart financials
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

  const playCashRegisterChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio notice:', e);
    }
  };

  const extractDateStr = (dateVal) => {
    if (!dateVal) return '';
    if (typeof dateVal !== 'string') return '';
    if (dateVal.includes('T')) return dateVal.split('T')[0];
    const firstToken = dateVal.split(' ')[0].replace(/,/g, '');
    if (/^\d{4}-\d{2}-\d{2}$/.test(firstToken)) return firstToken;
    const parts = firstToken.split('/');
    if (parts.length === 3 && parts[2].length === 4) {
      return `${parts[2]}-${String(parts[0]).padStart(2, '0')}-${String(parts[1]).padStart(2, '0')}`;
    }
    return firstToken;
  };

  const filteredTransactions = useMemo(() => {
    if (!reportStartDate && !reportEndDate) return transactions;
    return transactions.filter(t => {
      const tDate = extractDateStr(t.date);
      if (!tDate) return true;
      if (reportStartDate && tDate < reportStartDate) return false;
      if (reportEndDate && tDate > reportEndDate) return false;
      return true;
    });
  }, [transactions, reportStartDate, reportEndDate]);

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
    const ingredientUsageMap = {};

    filteredTransactions.forEach(t => {
      grossRevenue += t.total;
      itemSubtotal += t.subtotal;
      serviceCharge += t.serviceCharge;
      taxes += t.tax;
      discounts += (t.discount || 0);

      paymentMethods[t.paymentMethod] = (paymentMethods[t.paymentMethod] || { count: 0, total: 0 });
      paymentMethods[t.paymentMethod].count += 1;
      paymentMethods[t.paymentMethod].total += t.total;

      (t.items || []).forEach(item => {
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
            id: item.id,
            name: item.name,
            department: item.department || (isKitchen ? 'Kitchen' : 'Bar'),
            category: item.category || 'General',
            unitPrice: item.price || 0,
            sold: 0,
            revenue: 0,
            cogs: item.cogs || 0
          };
        }
        itemSalesMap[item.name].sold += item.qty;
        itemSalesMap[item.name].revenue += (item.price * item.qty);

        // Track raw ingredients consumed
        const menuItemRef = menuItems.find(m => m.name === item.name || m.id === item.id);
        if (menuItemRef?.recipe && Array.isArray(menuItemRef.recipe)) {
          menuItemRef.recipe.forEach(r => {
            const consumed = r.amount * item.qty;
            if (!ingredientUsageMap[r.ingredientId]) {
              ingredientUsageMap[r.ingredientId] = {
                ingredientId: r.ingredientId,
                totalConsumed: 0
              };
            }
            ingredientUsageMap[r.ingredientId].totalConsumed += consumed;
          });
        }
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
      ingredientUsageMap,
      paidBillsCount: filteredTransactions.length
    };
  }, [filteredTransactions, menuItems]);

  const categoriesList = useMemo(() => {
    const cats = new Set(['All']);
    menuItems.forEach(m => cats.add(m.category));
    return Array.from(cats);
  }, [menuItems]);

  const hasAccess = (tabKey) => {
    const allowed = ROLE_PERMISSIONS[currentUser.role] || [];
    return allowed.includes(tabKey);
  };

  const handleSendOrder = () => {
    if (cart.length === 0) return;

    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const orderPayload = {
      orderId: newOrderId,
      mode: orderMode,
      tableId: orderMode === 'DINING' ? selectedTable.id : null,
      tableName: orderMode === 'DINING' ? selectedTable.name : takeawayInfo.token,
      zone: orderMode === 'DINING' ? selectedTable.zone : 'Takeaway Express',
      guestCount: orderMode === 'DINING' ? guestCount : 1,
      customerName: orderMode === 'TAKEAWAY' ? takeawayInfo.name : undefined,
      server: currentUser.name,
      sentAt: nowTime,
      status: 'PREPARING',
      serviceChargeActive,
      taxActive,
      discountPercent,
      items: [...cart]
    };

    setActiveOrders(prev => [orderPayload, ...prev]);

    if (orderMode === 'DINING') {
      setFloorTables(prev => prev.map(t => t.id === selectedTable.id ? { ...t, status: 'OCCUPIED', currentOrderRef: newOrderId } : t));
    }

    recordAuditLog('ORDER_DISPATCHED', newOrderId, `Dispatched order ${newOrderId} (${orderPayload.tableName}) with ${cart.length} items.`);

    const kitchenItems = cart.filter(i => i.department === 'Kitchen');
    const barItems = cart.filter(i => i.department === 'Bar');

    // Immediately auto-push KOT & BOT to thermal printer without modal popup
    triggerAutoPrint({
      type: 'KOT_BOT_DISPATCH',
      data: {
        order: orderPayload,
        kitchenItems,
        barItems
      }
    }, `${orderPayload.tableName} • 2 Slips (KOT & BOT)`);

    setCart([]);
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

    // Inventory BOM deduction
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
      shiftId: currentShift.shiftId,
      date: `${getLocalDateStr()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      table: targetOrder.tableName,
      mode: targetOrder.mode,
      cashier: currentUser.name,
      items: targetOrder.items.map(i => ({
        id: i.id,
        name: i.name,
        department: i.department,
        category: i.category || 'General',
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

    recordAuditLog('BILL_SETTLED', newInvoice.invoiceNo, `Settled ${newInvoice.invoiceNo} (${newInvoice.table}) for ${settings.currency} ${newInvoice.total.toFixed(2)} via ${paymentMethod}.`);

    if (settings.autoDrawerKick === 'ENABLED' && (settings.drawerKickTrigger === 'ALL' || (settings.drawerKickTrigger === 'CASH_ONLY' && paymentMethod === 'CASH'))) {
      if (settings.chimeAudio) playCashRegisterChime();
    }

    // Immediately auto-push Final Tax Invoice to thermal printer without modal popup
    triggerAutoPrint({
      type: 'FINAL_BILL',
      data: newInvoice
    }, `${newInvoice.table} • ${settings.currency} ${newInvoice.total.toFixed(2)}`);

    setSettlingOrder(null);
    setCheckoutModalOpen(false);
    setCashTendered('');
    setCart([]);
  };

  const handlePinSubmit = (pinVal) => {
    const pin = pinVal || loginPinInput;
    setLoginError('');
    const found = staffList.find(s => s.pin === pin);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      setLoginPinInput('');
      const allowed = ROLE_PERMISSIONS[found.role] || [];
      setActiveTab(allowed.includes('pos') ? 'pos' : (allowed[0] || 'pos'));
      recordAuditLog('STAFF_LOGIN', found.id, `User ${found.name} logged in with ${found.role} role.`);
    } else {
      setLoginError('Invalid security PIN. Default Admin: 1234, Cashier: 1111');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#070b14] p-4 font-sans select-none antialiased">
        <div className="w-full max-w-[390px] rounded-[32px] border border-[#1b253b] bg-[#0c1424]/95 p-8 shadow-2xl shadow-black/80 backdrop-blur-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ff4500] to-[#ff6a00] text-2xl font-black text-white shadow-lg shadow-orange-600/40">
              LC
            </div>
            <h1 className="mt-3.5 text-2xl font-black tracking-tight text-white">{settings.restaurantName}</h1>
            <p className="mt-0.5 text-[10px] font-extrabold tracking-[0.2em] text-[#ff5500] uppercase">
              RESTAURANT &amp; BAR ERP
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Terminal Ready • Enter PIN
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center">
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
            <p className="mt-2 text-center text-xs font-bold text-rose-500">{loginError}</p>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  if (loginPinInput.length < 4) {
                    const next = loginPinInput + num;
                    setLoginPinInput(next);
                    if (next.length === 4) handlePinSubmit(next);
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
                  if (next.length === 4) handlePinSubmit(next);
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

          <div className="mt-5 border-t border-zinc-800/80 pt-3 text-center">
            <p className="text-[10px] text-zinc-500">
              Default PINs: Admin (1234) • Cashier (1111) • Chef (2222) • Bar (3333)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0b0f19] text-zinc-100 font-sans select-none overflow-hidden antialiased">
      
      {/* Global CSS fix for select dropdowns & options to prevent white-on-white text */}
      <style>{`
        select, option {
          color: #0f172a !important;
          background-color: #ffffff !important;
        }
        select:focus, option:focus, option:checked {
          color: #ff5500 !important;
          background-color: #fff7ed !important;
        }

        @media print {
          @page {
            margin: ${settings.receiptMargin || '2mm'};
            size: auto;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #thermal-print-area, #thermal-print-area * {
            visibility: visible !important;
          }
          #thermal-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: ${settings.receiptMargin || '2mm'} !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>

      {/* Floating edge tab to open menu on touch */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-[#ff5500] hover:bg-orange-600 text-white px-2 py-4 rounded-r-2xl shadow-2xl flex flex-col items-center gap-1.5 transition-transform hover:scale-105"
        title="Touch to Open Menu"
      >
        <Menu className="h-4 w-4" />
        <span className="text-[9px] font-black uppercase tracking-widest [writing-mode:vertical-lr]">MENU</span>
      </button>

      {/* Backdrop overlay for slide menu */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* SLIDE-OUT DRAWER SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#060813] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 z-50 transition-transform duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Brand header */}
          <div className="p-5 pb-4 flex items-center justify-between border-b border-zinc-900">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#ff5500] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-orange-600/30">
                LC
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-white leading-none">
                  {settings.restaurantName}
                </h1>
                <p className="text-[9px] font-bold tracking-widest text-[#ff5500] uppercase mt-1">
                  {settings.tagline}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
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

        {/* User profile footer */}
        <div className="p-3 border-t border-zinc-900 flex items-center justify-between shrink-0">
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
            onClick={() => setIsAuthenticated(false)}
            title="Lock Terminal"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-800"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 text-slate-900">
        
        {/* Top Header Bar */}
        <header className="h-14 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <Menu className="h-4 w-4 text-[#ff5500]" />
              <span className="hidden sm:inline">Menu</span>
            </button>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
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
                className="px-3.5 py-1.5 bg-[#ff5500] hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-600/20 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Item</span>
              </button>
            )}

            <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700">
              Currency: {settings.currency}
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </header>

        {/* VIEW 1: POS TERMINAL */}
        {activeTab === 'pos' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Catalog Grid Area */}
            <div className="flex-1 flex flex-col p-5 overflow-hidden min-h-0">
              
              {/* Category selector and search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl">
                  {categoriesList.map(cat => {
                    const count = cat === 'All'
                      ? menuItems.length
                      : menuItems.filter(m => m.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                          selectedCategory === cat
                            ? 'bg-[#ff5500] text-white shadow-sm shadow-orange-600/20'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Density switcher */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
                    <button
                      onClick={() => setPosViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors ${posViewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                      title="Visual Grid"
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setPosViewMode('compact')}
                      className={`p-1.5 rounded-lg transition-colors ${posViewMode === 'compact' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                      title="Compact Tiles"
                    >
                      <Grid className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setPosViewMode('list')}
                      className={`p-1.5 rounded-lg transition-colors ${posViewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                      title="Compact List"
                    >
                      <Layers className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="relative w-48">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={menuSearchQuery}
                      onChange={e => setMenuSearchQuery(e.target.value)}
                      placeholder="Search 150+ items..."
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#ff5500]"
                    />
                  </div>
                </div>
              </div>

              {/* Responsive fluid grid with multi-breakpoint scaling */}
              <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                {(() => {
                  const filteredDishes = menuItems.filter(item => {
                    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
                    const matchQuery = item.name.toLowerCase().includes(menuSearchQuery.toLowerCase());
                    return matchCat && matchQuery;
                  });

                  if (filteredDishes.length === 0) {
                    return (
                      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
                        <Coffee className="h-10 w-10 mb-2 stroke-[1]" />
                        <p className="text-xs font-bold text-slate-600">No matching menu items</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Try searching a different item or category.</p>
                      </div>
                    );
                  }

                  if (posViewMode === 'compact') {
                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2.5">
                        {filteredDishes.map(dish => {
                          const { portions } = calculateDishAvailability(dish.recipe);
                          return (
                            <button
                              key={dish.id}
                              onClick={() => {
                                setCart(prev => {
                                  const existing = prev.find(i => i.id === dish.id);
                                  if (existing) {
                                    return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i);
                                  }
                                  return [...prev, { ...dish, cartItemId: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`, qty: 1, notes: '' }];
                                });
                              }}
                              className="p-3 rounded-xl border text-left flex flex-col justify-between transition-all bg-white border-slate-200 hover:border-[#ff5500] hover:shadow-sm active:scale-95"
                            >
                              <div>
                                <span className={`text-[8px] font-black px-1 py-0.2 rounded uppercase ${
                                  dish.department === 'Bar' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {dish.department}
                                </span>
                                <p className="font-extrabold text-xs text-slate-900 mt-1 line-clamp-1">{dish.name}</p>
                              </div>
                              <div className="mt-2 flex justify-between items-center text-[10px]">
                                <span className="font-mono font-bold text-[#ff5500]">{settings.currency} {dish.price.toFixed(0)}</span>
                                <span className={portions <= 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                                  {portions <= 0 ? '0 in stock' : `${portions} left`}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  }

                  if (posViewMode === 'list') {
                    return (
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                        {filteredDishes.map(dish => {
                          const { portions } = calculateDishAvailability(dish.recipe);
                          return (
                            <div
                              key={dish.id}
                              onClick={() => {
                                setCart(prev => {
                                  const existing = prev.find(i => i.id === dish.id);
                                  if (existing) {
                                    return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i);
                                  }
                                  return [...prev, { ...dish, cartItemId: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`, qty: 1, notes: '' }];
                                });
                              }}
                              className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                  dish.department === 'Bar' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {dish.department}
                                </span>
                                <div>
                                  <p className="font-bold text-xs text-slate-900">{dish.name}</p>
                                  <span className="text-[10px] text-slate-400">{dish.category} • {dish.prepTime}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`text-xs font-mono ${portions <= 0 ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                                  {portions <= 0 ? '0 ready' : `${portions} ready`}
                                </span>
                                <span className="font-mono font-bold text-sm text-[#ff5500]">{settings.currency} {dish.price.toFixed(2)}</span>
                                <button className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">+ Add</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  // Default Visual Grid
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3.5">
                      {filteredDishes.map(dish => {
                        const { cogs, portions } = calculateDishAvailability(dish.recipe);
                        return (
                          <div
                            key={dish.id}
                            onClick={() => {
                              setCart(prev => {
                                const existing = prev.find(i => i.id === dish.id);
                                if (existing) {
                                  return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i);
                                }
                                return [...prev, { ...dish, cartItemId: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`, qty: 1, notes: '' }];
                              });
                            }}
                            className="bg-white rounded-2xl border border-slate-200 hover:border-[#ff5500] hover:shadow-md cursor-pointer active:scale-[0.99] overflow-hidden flex flex-col justify-between transition-all"
                          >
                            {dish.imageUrl ? (
                              <div className="relative h-28 w-full bg-slate-100 overflow-hidden shrink-0">
                                <img
                                  src={dish.imageUrl}
                                  alt={dish.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <span className={`absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded shadow-xs text-white ${
                                  dish.department === 'Bar' ? 'bg-indigo-600' : 'bg-rose-600'
                                }`}>
                                  {dish.department}
                                </span>
                                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-xs text-white font-mono font-black text-xs">
                                  {settings.currency} {dish.price.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <div className="p-3 pb-0 flex justify-between items-start">
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                  dish.department === 'Bar' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {dish.department}
                                </span>
                                <span className="text-xs font-mono font-bold text-[#ff5500]">
                                  {settings.currency} {dish.price.toFixed(2)}
                                </span>
                              </div>
                            )}

                            <div className="p-3.5 pb-2">
                              <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{dish.name}</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{dish.description}</p>
                            </div>

                            <div className="p-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] bg-slate-50/50">
                              {portions <= 0 ? (
                                <span className="text-amber-600 font-bold flex items-center gap-1 text-[10px]">
                                  <AlertTriangle className="h-3 w-3" /> 0 ready
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[10px]">
                                  <CheckCircle2 className="h-3 w-3" /> {portions} ready
                                </span>
                              )}
                              <span className="text-slate-400 font-mono text-[10px]">BOM: {settings.currency} {cogs.toFixed(0)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right Ticket Bar */}
            <div className="w-96 bg-white border-l border-slate-200 flex flex-col justify-between shrink-0 shadow-lg min-h-0">
              <div className="p-3.5 border-b border-slate-200 space-y-2.5 shrink-0 bg-white">
                {/* Order Assignment with Tick Selectors */}
                <div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block mb-1.5">
                    Order Assignment
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Dining Tick Card */}
                    <button
                      type="button"
                      onClick={() => setOrderMode('DINING')}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                        orderMode === 'DINING'
                          ? 'bg-orange-50/80 border-[#ff5500] text-slate-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Grid className="h-3.5 w-3.5 text-[#ff5500]" />
                        <span>Dine-In Table</span>
                      </div>
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center border transition-all ${
                        orderMode === 'DINING'
                          ? 'bg-[#ff5500] border-[#ff5500] text-white'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {orderMode === 'DINING' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                      </div>
                    </button>

                    {/* Takeaway Tick Card */}
                    <button
                      type="button"
                      onClick={() => setOrderMode('TAKEAWAY')}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                        orderMode === 'TAKEAWAY'
                          ? 'bg-orange-50/80 border-[#ff5500] text-slate-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="h-3.5 w-3.5 text-[#ff5500]" />
                        <span>Takeaway</span>
                      </div>
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center border transition-all ${
                        orderMode === 'TAKEAWAY'
                          ? 'bg-[#ff5500] border-[#ff5500] text-white'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {orderMode === 'TAKEAWAY' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Inline Table / Guest Picker based on ticked mode */}
                {orderMode === 'DINING' ? (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-700 flex items-center gap-1">
                        <span>Assigned Table:</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setAllocationModalOpen(true)}
                        className="text-[10px] font-bold text-[#ff5500] hover:underline flex items-center gap-1"
                      >
                        <LayoutGrid className="h-3 w-3" /> View Floor Map
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTable.id}
                        onChange={(e) => {
                          const tbl = floorTables.find(t => t.id === e.target.value);
                          if (tbl) setSelectedTable(tbl);
                        }}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-[#ff5500]"
                      >
                        {floorTables.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.zone}) - {t.capacity} Seats [{t.status}]
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center bg-white border border-slate-200 rounded-lg px-1.5 py-0.5" title="Guest Count">
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          className="text-xs font-bold px-1 text-slate-500 hover:text-slate-900"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1.5 font-mono text-slate-800">{guestCount}p</span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(guestCount + 1)}
                          className="text-xs font-bold px-1 text-slate-500 hover:text-slate-900"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Takeaway Details:</span>
                      <span className="font-mono font-bold text-xs bg-orange-100 text-[#ff5500] px-2 py-0.5 rounded-md">
                        Token: {takeawayInfo.token}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={takeawayInfo.name}
                        onChange={(e) => setTakeawayInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Guest Name"
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#ff5500]"
                      />
                      <input
                        type="text"
                        value={takeawayInfo.phone}
                        onChange={(e) => setTakeawayInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone (Optional)"
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-[#ff5500]"
                      />
                    </div>
                  </div>
                )}

                {/* Surcharges and Discounts */}
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

                {/* Discount Presets */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Discount:</span>
                  <div className="flex gap-1 mt-1">
                    {[0, 5, 10, 15, 20].map(pct => (
                      <button
                        key={pct}
                        onClick={() => setDiscountPercent(pct)}
                        className={`flex-1 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                          discountPercent === pct
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pct === 0 ? 'None' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cart item list with scroll containment */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 min-h-0">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6">
                    <Monitor className="h-10 w-10 mb-2 stroke-[1]" />
                    <p className="text-xs font-bold text-slate-600">Ticket is empty</p>
                    <p className="text-[11px] text-slate-400 mt-1">Tap items to build order.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.cartItemId} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
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

              {/* Order totals and actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-slate-900">{settings.currency} {cartSubtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-rose-600 font-medium">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-mono">-{settings.currency} {cartDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}
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
                  className="w-full py-3 bg-[#ff5500] hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm shadow-orange-600/30 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Order (Prints KOT / BOT)</span>
                </button>

                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    setSettlingOrder(null);
                    setPaymentMethod('CASH');
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

        {/* VIEW 2: BILLING & SETTLEMENT QUEUE */}
        {activeTab === 'billing' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Billing &amp; Settlement Queue</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage active tables, edit line items, print temporary bills, and settle final accounts.
                </p>
              </div>
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700">
                {activeOrders.length} Open Bills
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
                    <div key={order.orderId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
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
                        <div className="grid grid-cols-3 gap-1.5 text-xs">
                          {/* Edit Items in Active Bill */}
                          <button
                            onClick={() => {
                              setEditingBill(order);
                              setEditBillModalOpen(true);
                            }}
                            className="py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center justify-center gap-1"
                          >
                            <Edit3 className="h-3 w-3" /> Edit Items
                          </button>

                          {/* Print Proforma Temp Bill */}
                          <button
                            onClick={() => {
                              triggerAutoPrint({
                                type: 'TEMP_BILL',
                                data: {
                                  table: order.tableName,
                                  server: order.server,
                                  items: order.items,
                                  subtotal: fin.subtotal,
                                  discount: fin.discount,
                                  service: fin.service,
                                  tax: fin.tax,
                                  total: fin.total
                                }
                              }, `Proforma Bill for ${order.tableName}`);
                            }}
                            className="py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-bold flex items-center justify-center gap-1"
                          >
                            <Printer className="h-3 w-3" /> Temp Bill
                          </button>

                          {/* Settle Bill */}
                          <button
                            onClick={() => {
                              setSettlingOrder(order);
                              setPaymentMethod('CASH');
                              setCheckoutModalOpen(true);
                            }}
                            className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1 shadow-xs"
                          >
                            <DollarSign className="h-3 w-3" /> Settle
                          </button>
                        </div>

                        {/* Admin-Only Active Bill Deletion */}
                        {currentUser.role === 'Administrator' && (
                          <button
                            onClick={() => {
                              setActiveOrders(prev => prev.filter(o => o.orderId !== order.orderId));
                              if (order.tableId) {
                                setFloorTables(prev => prev.map(t => t.id === order.tableId ? { ...t, status: 'VACANT', currentOrderRef: null } : t));
                              }
                              recordAuditLog('ADMIN_DELETE_ACTIVE_BILL', order.orderId, `Admin deleted open bill ${order.orderId} (${order.tableName})`);
                            }}
                            className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-colors border border-rose-200"
                            title="Admin Only: Delete this active open bill"
                          >
                            <Trash2 className="h-3 w-3" /> Delete Active Bill (Admin)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: SALES & REVENUE REPORTS WITH DATE FILTERS */}
        {activeTab === 'reports' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center gap-6 border-b border-slate-200 pb-3 text-xs font-bold overflow-x-auto">
              {['Daily Overview', 'All Items Sales', 'Sales Detail', 'KOT Report', 'BOT Report', 'Sales Summary', 'Food vs Beverage', 'Stock Usage', 'Audit Trail'].map(sub => (
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

            {/* Date Filters Header */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#ff5500]" /> Date Filter:
                </span>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={e => setReportStartDate(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
                <span className="text-slate-400 text-xs">to</span>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={e => setReportEndDate(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { label: 'Today', start: getLocalDateStr(), end: getLocalDateStr() },
                  { label: 'Yesterday', start: getLocalDateStr(new Date(Date.now() - 86400000)), end: getLocalDateStr(new Date(Date.now() - 86400000)) },
                  { label: 'Last 7 Days', start: getLocalDateStr(new Date(Date.now() - 7 * 86400000)), end: getLocalDateStr() },
                  { label: 'All Time', start: '', end: '' }
                ].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setReportStartDate(preset.start);
                      setReportEndDate(preset.end);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg whitespace-nowrap"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Overview */}
            {reportSubTab === 'Daily Overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">GROSS REVENUE</p>
                    <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
                      {settings.currency} {salesMetrics.grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{salesMetrics.paidBillsCount} Paid Bills</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">ITEM SUBTOTAL</p>
                    <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
                      {settings.currency} {salesMetrics.itemSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Food &amp; Beverage Sales</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">SERVICE CHARGE</p>
                    <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
                      {settings.currency} {salesMetrics.serviceCharge.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Collected for staff pool</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">TAXES / DISCOUNTS</p>
                    <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
                      {settings.currency} {salesMetrics.taxes.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Discounts: {settings.currency} {salesMetrics.discounts.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
                      Payment Methods Breakdown
                    </h3>
                    <div className="space-y-3">
                      {Object.keys(salesMetrics.paymentMethods).length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No payments collected in selected period.</p>
                      ) : (
                        Object.entries(salesMetrics.paymentMethods).map(([method, data]) => (
                          <div key={method} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-xs font-bold text-slate-900">{method} ({data.count} bills)</span>
                            <span className="text-sm font-black font-mono text-slate-900">
                              {settings.currency} {data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
                      Preparation Area Sales
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-bold text-slate-900">Kitchen ({salesMetrics.kitchenItemsCount} items)</span>
                        <span className="text-sm font-black font-mono text-slate-900">
                          {settings.currency} {salesMetrics.kitchenRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-bold text-slate-900">Bar ({salesMetrics.barItemsCount} drinks)</span>
                        <span className="text-sm font-black font-mono text-slate-900">
                          {settings.currency} {salesMetrics.barRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* All Items & Top Selling Menu Items Table */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      Top &amp; All Sold Menu Items
                    </h3>
                    <span className="text-xs font-mono text-slate-500">{salesMetrics.topItems.length} Products Sold</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5">Menu Item</th>
                          <th className="py-2.5">Area</th>
                          <th className="py-2.5">Category</th>
                          <th className="py-2.5 text-center">Portions Sold</th>
                          <th className="py-2.5 text-right">Price</th>
                          <th className="py-2.5 text-right">Total Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {salesMetrics.topItems.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-slate-400 italic">No menu items sold in this period.</td>
                          </tr>
                        ) : (
                          salesMetrics.topItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-3 font-bold text-slate-900">{item.name}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.department === 'Kitchen' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                  {item.department}
                                </span>
                              </td>
                              <td className="py-3 text-slate-500">{item.category}</td>
                              <td className="py-3 text-center font-mono font-bold text-slate-800">{item.sold}</td>
                              <td className="py-3 text-right font-mono text-slate-600">{settings.currency} {(item.unitPrice || 0).toFixed(2)}</td>
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

            {/* Subtab: All Items Sales */}
            {reportSubTab === 'All Items Sales' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase">Itemized Menu Sales Report</h3>
                    <p className="text-xs text-slate-500">Every menu item ordered within the selected date filter range</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 rounded-xl text-slate-700">
                    {salesMetrics.topItems.reduce((acc, i) => acc + i.sold, 0)} Total Portions
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5">Menu Item</th>
                        <th className="py-2.5">Department</th>
                        <th className="py-2.5">Category</th>
                        <th className="py-2.5 text-center">Portions Sold</th>
                        <th className="py-2.5 text-right">Selling Price</th>
                        <th className="py-2.5 text-right">Total Revenue</th>
                        <th className="py-2.5 text-right">% of Item Sales</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesMetrics.topItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 italic">No sales recorded for any items in this period.</td>
                        </tr>
                      ) : (
                        salesMetrics.topItems.map((item, idx) => {
                          const pct = salesMetrics.itemSubtotal > 0
                            ? ((item.revenue / salesMetrics.itemSubtotal) * 100).toFixed(1)
                            : '0.0';
                          return (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-3 font-bold text-slate-900">{item.name}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.department === 'Kitchen' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                  {item.department}
                                </span>
                              </td>
                              <td className="py-3 text-slate-500">{item.category}</td>
                              <td className="py-3 text-center font-mono font-bold text-slate-800">{item.sold}</td>
                              <td className="py-3 text-right font-mono text-slate-600">{settings.currency} {(item.unitPrice || 0).toFixed(2)}</td>
                              <td className="py-3 text-right font-mono font-black text-slate-900">
                                {settings.currency} {item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-3 text-right font-mono text-slate-500">{pct}%</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Subtab: KOT Report */}
            {reportSubTab === 'KOT Report' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase">Kitchen Order Tickets (KOT) Production Report</h3>
                    <p className="text-xs text-slate-500">Breakdown of all kitchen items prepped in the filtered period</p>
                  </div>
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-xl">
                    {salesMetrics.kitchenItemsCount} Kitchen Items • {settings.currency} {salesMetrics.kitchenRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5">Kitchen Dish</th>
                        <th className="py-2.5">Category</th>
                        <th className="py-2.5 text-center">Portions Prepared</th>
                        <th className="py-2.5 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesMetrics.topItems.filter(i => i.department === 'Kitchen').length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400 italic">No kitchen orders recorded in this date range.</td>
                        </tr>
                      ) : (
                        salesMetrics.topItems.filter(i => i.department === 'Kitchen').map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-3 font-bold text-slate-900">{item.name}</td>
                            <td className="py-3 text-slate-500">{item.category}</td>
                            <td className="py-3 text-center font-mono font-bold text-slate-800">{item.sold}</td>
                            <td className="py-3 text-right font-mono font-bold text-slate-900">{settings.currency} {item.revenue.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Subtab: BOT Report */}
            {reportSubTab === 'BOT Report' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase">Bar Order Tickets (BOT) Dispense Report</h3>
                    <p className="text-xs text-slate-500">Breakdown of all bar beverages, cocktails &amp; coffees served</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl">
                    {salesMetrics.barItemsCount} Drinks Served • {settings.currency} {salesMetrics.barRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5">Beverage / Drink</th>
                        <th className="py-2.5">Category</th>
                        <th className="py-2.5 text-center">Glasses / Units</th>
                        <th className="py-2.5 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesMetrics.topItems.filter(i => i.department === 'Bar').length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400 italic">No bar beverage orders recorded in this date range.</td>
                        </tr>
                      ) : (
                        salesMetrics.topItems.filter(i => i.department === 'Bar').map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-3 font-bold text-slate-900">{item.name}</td>
                            <td className="py-3 text-slate-500">{item.category}</td>
                            <td className="py-3 text-center font-mono font-bold text-slate-800">{item.sold}</td>
                            <td className="py-3 text-right font-mono font-bold text-slate-900">{settings.currency} {item.revenue.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Subtab: Sales Summary */}
            {reportSubTab === 'Sales Summary' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-2xl">
                <h3 className="text-base font-black text-slate-900 uppercase">Executive Financial Summary</h3>
                <div className="space-y-2.5 text-xs divide-y divide-slate-100">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Total Settled Invoices</span>
                    <span className="font-mono font-bold text-slate-900">{salesMetrics.paidBillsCount}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Average Order Value (AOV)</span>
                    <span className="font-mono font-bold text-slate-900">
                      {settings.currency} {salesMetrics.paidBillsCount > 0 ? (salesMetrics.grossRevenue / salesMetrics.paidBillsCount).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Net Food &amp; Beverage Subtotal</span>
                    <span className="font-mono font-bold text-slate-900">{settings.currency} {salesMetrics.itemSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Service Charge Pool ({settings.serviceChargeRate}%)</span>
                    <span className="font-mono font-bold text-emerald-600">+{settings.currency} {salesMetrics.serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Statutory Taxes / VAT ({settings.taxRate}%)</span>
                    <span className="font-mono font-bold text-slate-900">+{settings.currency} {salesMetrics.taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Total Discounts Deducted</span>
                    <span className="font-mono font-bold text-rose-600">-{settings.currency} {salesMetrics.discounts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-sm font-black text-slate-900 border-t-2 border-slate-900">
                    <span>Total Gross Revenue</span>
                    <span className="font-mono text-base text-[#ff5500]">{settings.currency} {salesMetrics.grossRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Subtab: Food vs Beverage */}
            {reportSubTab === 'Food vs Beverage' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
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
                    <span className="text-xs font-bold text-slate-700">Total Kitchen Portions: {salesMetrics.kitchenItemsCount}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
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
                    <span className="text-xs font-bold text-slate-700">Total Bar Drinks: {salesMetrics.barItemsCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Subtab: Stock Usage */}
            {reportSubTab === 'Stock Usage' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase">Raw Ingredient Depletion &amp; Usage</h3>
                    <p className="text-xs text-slate-500">Calculated through dish recipes for all sold orders in this period</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5">Raw Material</th>
                        <th className="py-2.5">Category</th>
                        <th className="py-2.5 text-center">Depleted (Used)</th>
                        <th className="py-2.5 text-center">Remaining In Stock</th>
                        <th className="py-2.5 text-right">Unit Cost</th>
                        <th className="py-2.5 text-right">Total Depletion Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventory.map(ing => {
                        const used = salesMetrics.ingredientUsageMap[ing.id]?.totalConsumed || 0;
                        const cost = used * ing.cost;
                        return (
                          <tr key={ing.id} className="hover:bg-slate-50">
                            <td className="py-3 font-bold text-slate-900">{ing.name}</td>
                            <td className="py-3 text-slate-500">{ing.category}</td>
                            <td className="py-3 text-center font-mono font-bold text-slate-800">
                              {used > 0 ? `${used.toFixed(1)} ${ing.unit}` : '-'}
                            </td>
                            <td className="py-3 text-center font-mono text-slate-600">{ing.stock} {ing.unit}</td>
                            <td className="py-3 text-right font-mono text-slate-500">{settings.currency} {ing.cost.toFixed(2)}</td>
                            <td className="py-3 text-right font-mono font-black text-slate-900">
                              {cost > 0 ? `${settings.currency} ${cost.toFixed(2)}` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sales Detail Subtab with Admin Deletion */}
            {reportSubTab === 'Sales Detail' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase">Paid Invoices Ledger</h3>
                  <span className="text-xs font-mono text-slate-500">{filteredTransactions.length} Filtered Records</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5">Invoice #</th>
                        <th className="py-2.5">Date &amp; Time</th>
                        <th className="py-2.5">Table</th>
                        <th className="py-2.5">Cashier</th>
                        <th className="py-2.5">Method</th>
                        <th className="py-2.5 text-right">Subtotal</th>
                        <th className="py-2.5 text-right">Grand Total</th>
                        {currentUser.role === 'Administrator' && (
                          <th className="py-2.5 text-right">Admin Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={currentUser.role === 'Administrator' ? 8 : 7} className="py-4 text-center text-slate-400 italic">No transactions recorded.</td>
                        </tr>
                      ) : (
                        filteredTransactions.map(t => (
                          <tr key={t.invoiceNo} className="hover:bg-slate-50">
                            <td className="py-3 font-mono font-bold text-slate-800">{t.invoiceNo}</td>
                            <td className="py-3 text-slate-500">{t.date}</td>
                            <td className="py-3 font-semibold text-slate-900">{t.table}</td>
                            <td className="py-3 text-slate-600">{t.cashier}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700">
                                {t.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3 text-right font-mono">{settings.currency} {t.subtotal.toFixed(2)}</td>
                            <td className="py-3 text-right font-mono font-black text-slate-900">{settings.currency} {t.total.toFixed(2)}</td>
                            {currentUser.role === 'Administrator' && (
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    setTransactions(prev => prev.filter(inv => inv.invoiceNo !== t.invoiceNo));
                                    recordAuditLog('ADMIN_DELETE_TRANSACTION', t.invoiceNo, `Admin deleted invoice ${t.invoiceNo} for ${settings.currency} ${t.total.toFixed(2)}`);
                                  }}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                  title="Admin Delete Transaction"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
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

            {/* Audit Trail Subtab */}
            {reportSubTab === 'Audit Trail' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase">System Activity &amp; Change Audit Log</h3>
                  {currentUser.role === 'Administrator' && auditLogs.length > 0 && (
                    <button
                      onClick={() => {
                        setAuditLogs([]);
                        recordAuditLog('ADMIN_CLEAR_AUDIT_LOGS', 'ALL', 'Purged all audit log entries');
                      }}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" /> Clear Audit Logs (Admin)
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5">Time</th>
                        <th className="py-2.5">Action</th>
                        <th className="py-2.5">Authorized User</th>
                        <th className="py-2.5">Role</th>
                        <th className="py-2.5">Target / Reference</th>
                        <th className="py-2.5">Details</th>
                        {currentUser.role === 'Administrator' && (
                          <th className="py-2.5 text-right">Admin Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={currentUser.role === 'Administrator' ? 7 : 6} className="py-4 text-center text-slate-400 italic">No activity logs recorded yet.</td>
                        </tr>
                      ) : (
                        auditLogs.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50">
                            <td className="py-2.5 font-mono text-slate-500">{log.timestamp}</td>
                            <td className="py-2.5 font-bold text-slate-900 font-mono">{log.action}</td>
                            <td className="py-2.5 font-semibold text-slate-800">{log.staff}</td>
                            <td className="py-2.5 text-[10px] text-slate-500">{log.role}</td>
                            <td className="py-2.5 font-mono text-slate-600">{log.targetRef}</td>
                            <td className="py-2.5 text-slate-600">{log.details}</td>
                            {currentUser.role === 'Administrator' && (
                              <td className="py-2.5 text-right">
                                <button
                                  onClick={() => {
                                    setAuditLogs(prev => prev.filter(l => l.id !== log.id));
                                  }}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                  title="Admin Delete Log Entry"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
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
          </div>
        )}

        {/* VIEW 4: RECIPES & PORTIONS */}
        {activeTab === 'recipes' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Recipes &amp; BOM Portion Costing</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cost of Goods Sold (COGS), profit margins, and remaining portions linked to raw inventory.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map(dish => {
                const { cogs, portions, isSoldOut } = calculateDishAvailability(dish.recipe);
                const margin = dish.price > 0 ? (((dish.price - cogs) / dish.price) * 100).toFixed(1) : 0;
                return (
                  <div key={dish.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{dish.department} • {dish.category}</span>
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
                        <p className="text-[10px] font-black uppercase text-slate-400">Bill of Materials (BOM)</p>
                        <button
                          onClick={() => {
                            setEditingDishForRecipe(dish);
                            setCurrentRecipeIngredients(dish.recipe ? [...dish.recipe] : []);
                            setTempIngredientSelect({ ingredientId: inventory[0]?.id || '', amount: '' });
                            setRecipeConfigModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-[#ff5500] hover:underline flex items-center gap-1"
                        >
                          <Sliders className="h-3 w-3" /> Configure Recipe
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
                        Live Portions: <strong className={isSoldOut ? 'text-rose-600 font-mono' : 'text-slate-900 font-mono'}>{portions}</strong>
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

        {/* VIEW 5: STOCK & RAW INVENTORY */}
        {activeTab === 'stock' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Stock &amp; Raw Inventory</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Raw ingredients and inventory tracked and depleted by recipe Bill of Materials.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setReceiveStockForm({
                      ingredientId: inventory[0]?.id || '',
                      quantity: '',
                      supplier: '',
                      invoiceRef: '',
                      newCost: ''
                    });
                    setReceiveStockModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Package className="h-3.5 w-3.5" />
                  <span>Receive Stock</span>
                </button>

                <button
                  onClick={() => setAddInventoryModalOpen(true)}
                  className="px-3.5 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Material</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
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
                          {isLow && <span className="ml-2 px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] rounded font-bold">Low</span>}
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
                            + Intake
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

        {/* VIEW 6: TABLE MANAGEMENT */}
        {activeTab === 'tables' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Table &amp; Floor Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">Floor layout, real-time occupancy status, and table launching.</p>
              </div>
              <button
                onClick={() => setAddTableModalOpen(true)}
                className="px-3.5 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Table
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {floorTables.map(tbl => {
                const isOccupied = tbl.status === 'OCCUPIED';
                return (
                  <div key={tbl.id} className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between ${
                    isOccupied ? 'border-orange-300 ring-2 ring-orange-500/10' : 'border-slate-200'
                  }`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400">{tbl.id}</span>
                          <h3 className="text-base font-black text-slate-900">{tbl.name}</h3>
                          <p className="text-xs text-slate-500">{tbl.zone}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isOccupied ? 'bg-orange-100 text-[#ff5500]' : 'bg-emerald-100 text-emerald-700'
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
                      {currentUser.role === 'Administrator' && !isOccupied && floorTables.length > 1 && (
                        <button
                          onClick={() => {
                            setFloorTables(prev => prev.filter(t => t.id !== tbl.id));
                            recordAuditLog('TABLE_DELETED', tbl.id, `Admin removed table ${tbl.name} (${tbl.id})`);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Admin: Delete Table"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 7: CASHIER SHIFTS & DRAWER */}
        {activeTab === 'shifts' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Cashier Shift &amp; Drawer Balancing</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Shift: <strong className="font-mono text-slate-800">{currentShift.shiftId}</strong> • Opened by {currentShift.openedBy} at {currentShift.openedAt}
                </p>
              </div>

              <button
                onClick={() => {
                  const countedCash = Object.entries(denominations).reduce(
                    (sum, [denom, count]) => sum + (Number(denom) * (Number(count) || 0)),
                    0
                  );
                  const closedShift = {
                    ...currentShift,
                    closedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    closedBy: currentUser.name,
                    status: 'CLOSED',
                    metrics: {
                      startingFloat: currentShift.startingFloat,
                      countedCash
                    }
                  };

                  // 1. Archive closed shift
                  setShiftHistory(prev => [closedShift, ...prev]);

                  // 2. Print Z-Report slip
                  triggerAutoPrint({
                    type: 'Z_REPORT',
                    data: closedShift
                  }, `Shift ${closedShift.shiftId} Closed`);

                  // 3. Open fresh shift for next cashier
                  const nextDate = getLocalDateStr();
                  setCurrentShift({
                    shiftId: `SHIFT-${nextDate.replace(/-/g, '')}-01`,
                    openedDate: nextDate,
                    openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    openedBy: currentUser.name,
                    startingFloat: countedCash || 15000.00,
                    status: 'OPEN',
                    payouts: []
                  });

                  // Retain denomination inputs (no reset)
                  recordAuditLog('SHIFT_CLOSED', closedShift.shiftId, `Shift closed by ${currentUser.name}. Z-Report generated.`);
                }}
                className="px-4 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs"
              >
                <Lock className="h-4 w-4" />
                <span>Close Shift &amp; Print Z-Report</span>
              </button>
            </div>

            {(() => {
              const allPayouts = currentShift.payouts || [];
              const approvedPayouts = allPayouts.filter(p => p.status === 'APPROVED' || !p.status);
              const pendingPayouts = allPayouts.filter(p => p.status === 'PENDING');
              const totalApprovedCashOut = approvedPayouts.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
              const totalPendingCashOut = pendingPayouts.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);

              const todayStr = getLocalDateStr();
              let shiftCashSales = 0;
              if (Array.isArray(transactions)) {
                for (let i = 0; i < transactions.length; i++) {
                  const t = transactions[i];
                  if (!t) continue;
                  
                  const isCash = String(t.paymentMethod || '').trim().toUpperCase() === 'CASH';
                  
                  // 1. Primary rule: If the transaction has this shift's ID, it belongs to this shift forever
                  // 2. Fallback rule: If the invoice was created after the shift opened
                  const matchesShiftId = t.shiftId && t.shiftId === currentShift.shiftId;
                  const matchesFallback = !t.shiftId && (extractDateStr(t.date) === currentShift.openedDate || extractDateStr(t.date) === getLocalDateStr());

                  if (isCash && (matchesShiftId || matchesFallback)) {
                    shiftCashSales += Number(t.total) || 0;
                  }
                }
              }

              let countedCash = 0;
              if (denominations && typeof denominations === 'object') {
                const entries = Object.entries(denominations);
                for (let j = 0; j < entries.length; j++) {
                  const [denom, count] = entries[j];
                  countedCash += Number(denom) * (Number(count) || 0);
                }
              }

              const expectedCash = Number(((currentShift.startingFloat || 0) + shiftCashSales - totalApprovedCashOut).toFixed(2));
              const variance = Number((countedCash - expectedCash).toFixed(2));
              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <p className="text-[10px] font-black uppercase text-slate-400">Opening Float</p>
                      <p className="text-xl font-black font-mono text-slate-900 mt-1">
                        {settings.currency} {currentShift.startingFloat.toFixed(2)}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">Drawer base float</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <p className="text-[10px] font-black uppercase text-slate-400">Cash Sales</p>
                      <p className="text-xl font-black font-mono text-emerald-600 mt-1">
                        +{settings.currency} {shiftCashSales.toFixed(2)}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">Collected this shift</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase text-slate-400">Approved Cash Out</p>
                        {pendingPayouts.length > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                            {pendingPayouts.length} Pending
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-black font-mono text-rose-600 mt-1">
                        -{settings.currency} {totalApprovedCashOut.toFixed(2)}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">Authorized expenses</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <p className="text-[10px] font-black uppercase text-slate-400">Expected in Drawer</p>
                      <p className="text-xl font-black font-mono text-slate-900 mt-1">
                        {settings.currency} {expectedCash.toFixed(2)}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">Base + Sales - CashOut</span>
                    </div>

                    <div className={`p-4 rounded-2xl border shadow-xs ${
                      variance === 0
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : variance > 0
                        ? 'bg-blue-50/60 border-blue-200 text-blue-900'
                        : 'bg-rose-50/60 border-rose-200 text-rose-900'
                    }`}>
                      <p className="text-[10px] font-black uppercase tracking-wider opacity-70">Drawer Variance</p>
                      <p className="text-xl font-black font-mono mt-1">
                        {variance > 0 ? '+' : ''}{settings.currency} {variance.toFixed(2)}
                      </p>
                      <span className="text-[10px] font-bold">
                        {variance === 0 ? 'Balanced' : variance > 0 ? 'Overage' : 'Shortage'}
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Request Cash Out Form */}
                    <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                            <Banknote className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                              Request Drawer Cash Out
                            </h3>
                            <p className="text-[10px] text-slate-400">Requires supervisor/manager authorization</p>
                          </div>
                        </div>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const amt = parseFloat(cashOutForm.amount);
                          if (isNaN(amt) || amt <= 0 || !cashOutForm.reason.trim()) return;

                          const isManager = currentUser.role === 'Administrator' || currentUser.role === 'Manager';
                          const newCashOut = {
                            id: `CO-${Date.now().toString().slice(-6)}`,
                            amount: amt,
                            category: cashOutForm.category,
                            reason: cashOutForm.reason.trim(),
                            recipient: cashOutForm.recipient.trim() || 'General Expense',
                            requestedBy: currentUser.name,
                            requestedRole: currentUser.role,
                            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            date: getLocalDateStr(),
                            status: isManager ? 'APPROVED' : 'PENDING',
                            approvedBy: isManager ? currentUser.name : null,
                            approvedAt: isManager ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
                          };

                          setCurrentShift(prev => ({
                            ...prev,
                            payouts: [newCashOut, ...(prev.payouts || [])]
                          }));

                          recordAuditLog(
                            isManager ? 'CASH_OUT_APPROVED_DIRECT' : 'CASH_OUT_REQUESTED',
                            newCashOut.id,
                            `Cash out of ${settings.currency} ${amt.toFixed(2)} for "${newCashOut.reason}" (${newCashOut.category}) by ${currentUser.name}`
                          );

                          setCashOutForm({
                            amount: '',
                            category: 'Supplier / Vendor',
                            reason: '',
                            recipient: ''
                          });
                        }}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                              Amount ({settings.currency})
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="1"
                              required
                              value={cashOutForm.amount}
                              onChange={e => setCashOutForm(prev => ({ ...prev, amount: e.target.value }))}
                              placeholder="e.g. 2500.00"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                              Category
                            </label>
                            <select
                              value={cashOutForm.category}
                              onChange={e => setCashOutForm(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                            >
                              <option value="Supplier / Vendor">Supplier / Vendor</option>
                              <option value="Market Produce">Market Produce</option>
                              <option value="Safe Drop">Safe Drop (Cash Deposit)</option>
                              <option value="Petty Cash / Store Supplies">Petty Cash / Supplies</option>
                              <option value="Staff Tip Out">Staff Tip Out</option>
                              <option value="Other Emergency">Other Emergency</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                            Reason &amp; Description
                          </label>
                          <input
                            type="text"
                            required
                            value={cashOutForm.reason}
                            onChange={e => setCashOutForm(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder="e.g. Paid seafood driver for 5kg reef fish"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                            Paid To / Recipient (Optional)
                          </label>
                          <input
                            type="text"
                            value={cashOutForm.recipient}
                            onChange={e => setCashOutForm(prev => ({ ...prev, recipient: e.target.value }))}
                            placeholder="e.g. Fish Vendor Sunil / Safe Vault"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit Cash Out Request</span>
                        </button>
                      </form>
                    </div>

                    {/* Right: Cash Out Approval & History Ledger */}
                    <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                                Cash Out Authorization Queue &amp; History
                              </h3>
                              <p className="text-[10px] text-slate-400">Approve payouts and generate printed audit slips</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {(currentShift.payouts || []).length} Records
                          </span>
                        </div>

                        <div className="mt-3 divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                          {(currentShift.payouts || []).length === 0 ? (
                            <div className="py-8 text-center text-slate-400 text-xs italic">
                              No cash out transactions requested during this shift.
                            </div>
                          ) : (
                            (currentShift.payouts || []).map((item) => {
                              const isApproved = item.status === 'APPROVED' || !item.status;
                              const isPending = item.status === 'PENDING';
                              const isRejected = item.status === 'REJECTED';
                              const canDirectApprove = currentUser.role === 'Administrator' || currentUser.role === 'Manager';

                              return (
                                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs text-slate-900">{item.reason}</span>
                                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                                        isApproved
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : isPending
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-rose-100 text-rose-800'
                                      }`}>
                                        {item.status || 'APPROVED'}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500">
                                      <span className="font-semibold text-slate-700">{item.category}</span> • Recipient: {item.recipient || 'N/A'} • Req by {item.requestedBy} at {item.createdAt || item.time}
                                    </p>
                                    {isApproved && item.approvedBy && (
                                      <p className="text-[9px] font-mono text-emerald-700">
                                        ✓ Approved by {item.approvedBy} ({item.approvedAt || 'Verified'})
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-mono font-black text-sm text-slate-900">
                                      {settings.currency} {(parseFloat(item.amount) || 0).toFixed(2)}
                                    </span>

                                    {/* Action Buttons */}
                                    {isPending && (
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (canDirectApprove) {
                                              setCurrentShift(prev => ({
                                                ...prev,
                                                payouts: prev.payouts.map(p => p.id === item.id ? {
                                                  ...p,
                                                  status: 'APPROVED',
                                                  approvedBy: currentUser.name,
                                                  approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                } : p)
                                              }));
                                              recordAuditLog('CASH_OUT_APPROVED', item.id, `Manager ${currentUser.name} approved cash out ${item.id} of ${settings.currency} ${item.amount}`);
                                            } else {
                                              setCashOutApprovalModal({
                                                open: true,
                                                item,
                                                managerPin: '',
                                                error: ''
                                              });
                                            }
                                          }}
                                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs"
                                        >
                                          <Check className="h-3 w-3 stroke-[3]" />
                                          <span>Approve</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCurrentShift(prev => ({
                                              ...prev,
                                              payouts: prev.payouts.map(p => p.id === item.id ? {
                                                ...p,
                                                status: 'REJECTED',
                                                rejectedBy: currentUser.name
                                              } : p)
                                            }));
                                            recordAuditLog('CASH_OUT_REJECTED', item.id, `${currentUser.name} rejected cash out request ${item.id}`);
                                          }}
                                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    )}

                                    {/* Print Voucher Button */}
                                    {isApproved && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          triggerAutoPrint({
                                            type: 'CASH_OUT_VOUCHER',
                                            data: item
                                          }, `Cash Out Ref ${item.id}`);
                                        }}
                                        className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                                        title="Print Cash Out Voucher"
                                      >
                                        <Printer className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Denomination Counter */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Coins className="h-4 w-4 text-[#ff5500]" /> Physical Denomination Count
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[5000, 1000, 500, 100, 50, 20].map(denom => (
                  <div key={denom} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono font-bold text-xs text-slate-700">{settings.currency} {denom}</span>
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
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 8: KITCHEN DISPLAY (KDS) */}
        {activeTab === 'kds' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h2 className="text-xl font-black text-slate-900">Live Kitchen Display (KOT)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeOrders.filter(o => o.items.some(i => i.department === 'Kitchen')).map(order => (
                <div key={order.orderId} className="bg-white rounded-2xl border-2 border-rose-200 p-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{order.tableName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Order #{order.orderId}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold text-xs rounded-full">
                      {order.sentAt}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.filter(i => i.department === 'Kitchen').map((item, idx) => (
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

        {/* VIEW 9: BAR DISPLAY (BOT) */}
        {activeTab === 'bar' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h2 className="text-xl font-black text-slate-900">Live Bar Display (BOT)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeOrders.filter(o => o.items.some(i => i.department === 'Bar')).map(order => (
                <div key={order.orderId} className="bg-white rounded-2xl border-2 border-indigo-200 p-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{order.tableName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Order #{order.orderId}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-full">
                      {order.sentAt}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.filter(i => i.department === 'Bar').map((item, idx) => (
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

        {/* VIEW 10: MENU MANAGEMENT */}
        {activeTab === 'menu_admin' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Menu Management &amp; Dishes</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage 150+ dishes, upload food photos, configure categories, and link recipes.</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Category Filter Dropdown with High-Contrast Legibility */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500">Category:</span>
                  <select
                    value={adminMenuCategory}
                    onChange={e => setAdminMenuCategory(e.target.value)}
                    className="text-xs font-bold text-slate-900 bg-white focus:outline-none cursor-pointer py-1 pr-1"
                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat} style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                        {cat === 'All' ? `All (${menuItems.length})` : `${cat} (${menuItems.filter(m => m.category === cat).length})`}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setAddItemModalOpen(true)}
                  className="px-4 py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs shrink-0"
                >
                  <Plus className="h-4 w-4" /> Add New Menu Item
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Item &amp; Photo</th>
                    <th className="py-3 px-4">Dept</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Selling Price</th>
                    <th className="py-3 px-4">BOM Raw Cost</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {menuItems
                    .filter(item => adminMenuCategory === 'All' || item.category === adminMenuCategory)
                    .map(item => {
                    const { cogs } = calculateDishAvailability(item.recipe);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <label className="relative group cursor-pointer shrink-0" title="Click to upload/change photo">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="h-11 w-11 rounded-xl object-cover border border-slate-200 group-hover:opacity-75 transition-opacity" />
                              ) : (
                                <div className="h-11 w-11 rounded-xl bg-orange-50 border border-orange-200 flex flex-col items-center justify-center text-orange-600 font-bold text-[9px] group-hover:bg-orange-100 transition-colors">
                                  <Upload className="h-3.5 w-3.5 mb-0.5" />
                                  <span>ADD</span>
                                </div>
                              )}
                              <span className="absolute inset-0 bg-black/40 text-white rounded-xl text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                Change
                              </span>
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
                                        setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, imageUrl: ev.target.result } : m));
                                        recordAuditLog('UPDATE_DISH_PHOTO', item.id, `Uploaded new photo for ${item.name}`);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
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
                        <td className="py-3 px-4 text-slate-600 font-medium">{item.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#ff5500]">{settings.currency} {item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{settings.currency} {cogs.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setMenuItems(prev => prev.filter(m => m.id !== item.id));
                              recordAuditLog('DELETE_MENU_ITEM', item.id, `Removed ${item.name} from menu.`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
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

        {/* VIEW 11: CANCELLED TICKETS */}
        {activeTab === 'cancelled' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Cancelled Tickets &amp; Voids Audit</h2>
                <p className="text-xs text-slate-500 mt-0.5">Audit log of all voided items and cancelled line tickets.</p>
              </div>
              {currentUser.role === 'Administrator' && cancelledTickets.length > 0 && (
                <button
                  onClick={() => {
                    setCancelledTickets([]);
                    recordAuditLog('ADMIN_CLEAR_CANCELLED_TICKETS', 'ALL', 'Purged all void ticket history');
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear Void History (Admin)
                </button>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Audit ID</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Dish / Item</th>
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Mandatory Reason</th>
                    <th className="py-3 px-4">Authorized Staff</th>
                    {currentUser.role === 'Administrator' && (
                      <th className="py-3 px-4 text-right">Admin Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cancelledTickets.length === 0 ? (
                    <tr>
                      <td colSpan={currentUser.role === 'Administrator' ? 7 : 6} className="py-4 text-center text-slate-400 italic">No voids logged.</td>
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
                        {currentUser.role === 'Administrator' && (
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setCancelledTickets(prev => prev.filter(v => v.id !== voidItem.id));
                                recordAuditLog('ADMIN_DELETE_VOID_ENTRY', voidItem.id, `Deleted void record ${voidItem.id} (${voidItem.itemName})`);
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Admin Delete Void Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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

        {/* VIEW 12: STAFF MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Staff Management &amp; Roles</h2>
                <p className="text-xs text-slate-500 mt-0.5">Configure employee credentials and 4-digit security PINs.</p>
              </div>
              <button
                onClick={() => setAddStaffModalOpen(true)}
                className="px-4 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs"
              >
                <Plus className="h-4 w-4" /> Add Employee
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Security PIN</th>
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
                      <td className="py-3 px-4 text-right">
                        {currentUser.role === 'Administrator' && member.id !== currentUser.id && (
                          <button
                            onClick={() => {
                             setStaffList(prev => prev.filter(s => s.id !== member.id));
                             recordAuditLog('STAFF_DELETED', member.id, `Removed staff member ${member.name} (${member.role})`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Remove Employee"
                         >
                           <Trash2 className="h-4 w-4" />
                           </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 13: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
            {/* Settings Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#ff5500]" />
                  System, Business &amp; Peripheral Settings
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage company identity, thermal printing options, automated cash drawer solenoid, and database backup files.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  title="Export complete system database to JSON file"
                >
                  <Download className="h-3.5 w-3.5 text-slate-600" />
                  <span>Download Backup</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSettingsNotice({
                      title: 'Settings Saved',
                      detail: `Configuration for ${settings.restaurantName} updated successfully.`
                    });
                    setTimeout(() => setSettingsNotice(null), 3500);
                  }}
                  className="px-4 py-2 bg-[#008f5d] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: FULL COMPANY & BUSINESS DETAILS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-50 text-[#ff5500] rounded-xl">
                    <Building className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Company &amp; Business Information
                    </h3>
                    <p className="text-[10px] text-slate-400">Printed on official receipts, tax invoices, and Z-reports</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trading / Brand Name</label>
                  <input
                    type="text"
                    value={settings.restaurantName}
                    onChange={e => setSettings(prev => ({ ...prev, restaurantName: e.target.value }))}
                    placeholder="e.g. Linoli Cove Midigama"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand Tagline / Slogan</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={e => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="e.g. RESTAURANT & BAR"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registered Legal Entity Name</label>
                  <input
                    type="text"
                    value={settings.legalName || ''}
                    onChange={e => setSettings(prev => ({ ...prev, legalName: e.target.value }))}
                    placeholder="e.g. Linoli Cove Leisure (Pvt) Ltd"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Registration No. (BRN / Company ID)</label>
                  <input
                    type="text"
                    value={settings.businessRegNo || ''}
                    onChange={e => setSettings(prev => ({ ...prev, businessRegNo: e.target.value }))}
                    placeholder="e.g. PV-00289144"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tax Identification / VAT / GST No.</label>
                  <input
                    type="text"
                    value={settings.taxId || ''}
                    onChange={e => setSettings(prev => ({ ...prev, taxId: e.target.value }))}
                    placeholder="e.g. TIN-109284719"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Terminal Hardware Identifier</label>
                  <input
                    type="text"
                    value={settings.terminalId}
                    onChange={e => setSettings(prev => ({ ...prev, terminalId: e.target.value }))}
                    placeholder="e.g. LINOLI-MAIN-01"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={settings.phone || ''}
                    onChange={e => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. +94 74 036 6741"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Email Address</label>
                  <input
                    type="email"
                    value={settings.email || ''}
                    onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. info@linolicove.me"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Website or Social Link</label>
                  <input
                    type="text"
                    value={settings.website || ''}
                    onChange={e => setSettings(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="e.g. www.linolicove.me / @linolicove"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Physical Street Address</label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={e => setSettings(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="e.g. 380 A Matara Road, Midigama, 81700, Sri Lanka"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-50 text-[#ff5500] rounded-xl">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Automated Daily 11:30 PM Email Dispatch
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Auto-transmits complete end-of-day sales, settlements, invoices, voids &amp; audit records
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                    emailSettings.enabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {emailSettings.enabled ? `● Scheduled: ${emailSettings.scheduledTime || '23:30'} Daily` : 'Disabled'}
                  </span>
                  {emailSettings.lastSentDate && (
                    <span className="text-[10px] font-mono text-slate-500">
                      Last Sent: {emailSettings.lastSentDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Recipient Email</label>
                  <input
                    type="email"
                    value={emailSettings.recipient}
                    onChange={e => setEmailSettings(prev => ({ ...prev, recipient: e.target.value }))}
                    placeholder="linolicove@gmail.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Receives complete daily business data</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Time (24h)</label>
                  <input
                    type="text"
                    value={emailSettings.scheduledTime}
                    onChange={e => setEmailSettings(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    placeholder="23:30"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Default: 23:30 (11:30 PM)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Automation Status</label>
                  <select
                    value={emailSettings.enabled ? 'YES' : 'NO'}
                    onChange={e => setEmailSettings(prev => ({ ...prev, enabled: e.target.value === 'YES' }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="YES">Enabled (Auto-send at 11:30 PM)</option>
                    <option value="NO">Disabled (Manual trigger only)</option>
                  </select>
                </div>
              </div>

              {/* Data Inclusions Summary and Manual Test Trigger */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold text-slate-800">What data is transmitted in the 11:30 PM package?</p>
                  <p className="text-[11px] text-slate-500">
                    Gross revenue, net sales, taxes, service pool, discounts, individual invoice ledgers, cashier drawer count &amp; cash-outs, cancelled ticket voids, and the complete day's audit trail.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={isSendingEmail}
                    onClick={() => sendDailyEodEmail(true)}
                    className="px-4 py-2 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSendingEmail ? 'Dispatching...' : 'Send Daily Report Now'}</span>
                  </button>
                </div>
              </div>

              {/* Optional Webhook / EmailJS Backend Integration */}
              <details className="text-xs text-slate-600 pt-1">
                <summary className="font-bold cursor-pointer text-slate-700 hover:text-[#ff5500] select-none">
                  Advanced: Direct Silent Webhook or EmailJS API Keys (Optional)
                </summary>
                <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                      Webhook POST URL (Zapier / Make / Cloud Function)
                    </label>
                    <input
                      type="url"
                      value={emailSettings.webhookUrl}
                      onChange={e => setEmailSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                      placeholder="https://hook.eu2.make.com/... or https://api.yoursite.com/eod-report"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Posts JSON payload containing complete sales, shifts &amp; audit data directly.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">EmailJS Service ID</label>
                    <input
                      type="text"
                      value={emailSettings.emailjsServiceId}
                      onChange={e => setEmailSettings(prev => ({ ...prev, emailjsServiceId: e.target.value }))}
                      placeholder="service_..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">EmailJS Template ID</label>
                    <input
                      type="text"
                      value={emailSettings.emailjsTemplateId}
                      onChange={e => setEmailSettings(prev => ({ ...prev, emailjsTemplateId: e.target.value }))}
                      placeholder="template_..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>
              </details>
            </div>

            {/* SECTION 2: STREAMLINED AUTO-PRINTER CONFIGURATION */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Printer className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Thermal Auto-Printer Configuration
                    </h3>
                    <p className="text-[10px] text-slate-400">ESC/POS thermal slips for KOT, BOT, proforma bills &amp; tax invoices</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {pairedUsbDevice ? `USB: ${pairedUsbDevice.productName || 'Connected'}` : 'System Default Spooler'}
                </span>
              </div>

              {}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Paper Roll Width</label>
                  <select
                    value={settings.receiptRollWidth || '80mm'}
                    onChange={e => setSettings(prev => ({ ...prev, receiptRollWidth: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="80mm">80mm Thermal Paper (Standard POS)</option>
                    <option value="58mm">58mm Thermal Paper (Compact)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receipt Font Size</label>
                  <select
                    value={settings.receiptFontSize || '11px'}
                    onChange={e => setSettings(prev => ({ ...prev, receiptFontSize: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="10px">10px - Compact (Fits More Items)</option>
                    <option value="11px">11px - Standard (Recommended)</option>
                    <option value="12px">12px - Medium Large</option>
                    <option value="13px">13px - Large Text</option>
                    <option value="14px">14px - Extra Bold &amp; Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receipt Font Type</label>
                  <select
                    value={settings.receiptFontFamily || 'monospace'}
                    onChange={e => setSettings(prev => ({ ...prev, receiptFontFamily: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="monospace">Monospace (Classic ESC/POS Receipt)</option>
                    <option value="sans-serif">Sans-Serif (Modern Clean Helvetica/Arial)</option>
                    <option value="serif">Serif (Classic Traditional)</option>
                  </select>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thermal Slip Margins</label>
                  <select
                    value={settings.receiptMargin || '2mm'}
                    onChange={e => setSettings(prev => ({ ...prev, receiptMargin: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="0mm">0mm - Full Width (Edge-to-Edge)</option>
                    <option value="2mm">2mm - Standard Thermal Margin</option>
                    <option value="4mm">4mm - Comfortable Margin</option>
                    <option value="6mm">6mm - Wide Margin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Auto-Print on Send Order</label>
                  <select
                    value={settings.autoPrintOrder !== false ? 'ENABLED' : 'DISABLED'}
                    onChange={e => setSettings(prev => ({ ...prev, autoPrintOrder: e.target.value === 'ENABLED' }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="ENABLED">Yes - Print KOT &amp; BOT Slips</option>
                    <option value="DISABLED">No - Manual Print Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Auto-Print on Settlement</label>
                  <select
                    value={settings.autoPrintBill !== false ? 'ENABLED' : 'DISABLED'}
                    onChange={e => setSettings(prev => ({ ...prev, autoPrintBill: e.target.value === 'ENABLED' }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="ENABLED">Yes - Print Final Tax Invoice</option>
                    <option value="DISABLED">No - Manual Print Only</option>
                  </select>
                </div>
              </div>

              {/* Hardware Pairing & Test Diagnostic */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">Direct WebUSB Thermal Printer Connection</p>
                  <p className="text-[10px] text-slate-500">
                    Pair once with your USB printer for fast ESC/POS output, or run via OS print spooler.
                  </p>
                  {usbStatusMessage && (
                    <p className="text-[10px] font-mono text-[#ff5500] mt-0.5">{usbStatusMessage}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.usb) {
                        navigator.usb.requestDevice({ filters: [] }).then(dev => {
                          setPairedUsbDevice(dev);
                          setUsbStatusMessage(`Paired with ${dev.productName || 'USB Printer'}`);
                        }).catch(err => {
                          setUsbStatusMessage('Pairing cancelled or printer busy.');
                        });
                      } else {
                        setUsbStatusMessage('WebUSB not supported; standard OS spooler active.');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Usb className="h-3.5 w-3.5" />
                    <span>Pair USB Printer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerAutoPrint({
                        type: 'TEMP_BILL',
                        data: {
                          table: 'TEST-PRINTER',
                          server: currentUser.name,
                          items: [
                            { name: 'Diagnostic Test Print', qty: 1, price: 0.00 }
                          ],
                          subtotal: 0,
                          discount: 0,
                          service: 0,
                          tax: 0,
                          total: 0
                        }
                      }, 'Diagnostic Slip');
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5 text-slate-500" />
                    <span>Test Slip</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 3: AUTOMATED CASH DRAWER SOLENOID */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Automated Cash Drawer Solenoid
                    </h3>
                    <p className="text-[10px] text-slate-400">Triggers physical RJ11/RJ12 drawer pop via printer kick pulse</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Auto Drawer Kick</label>
                  <select
                    value={settings.autoDrawerKick}
                    onChange={e => setSettings(prev => ({ ...prev, autoDrawerKick: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="ENABLED">Enabled (Auto-Pop on Payment)</option>
                    <option value="DISABLED">Disabled (Manual Key Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Drawer Kick Trigger</label>
                  <select
                    value={settings.drawerKickTrigger}
                    onChange={e => setSettings(prev => ({ ...prev, drawerKickTrigger: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="CASH_ONLY">Cash Payments Only</option>
                    <option value="ALL">All Payments (Cash, Card &amp; Split)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">RJ11 / RJ12 Pinout</label>
                  <select
                    value={settings.drawerPinout || 'PIN_2'}
                    onChange={e => setSettings(prev => ({ ...prev, drawerPinout: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  >
                    <option value="PIN_2">Pin 2 / ESC p 0 (Epson, Rongta, Xprinter)</option>
                    <option value="PIN_5">Pin 5 / ESC p 1 (Star Micronics, Custom)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Register Chime Sound</span>
                    <p className="text-[10px] text-slate-500">Plays brass bell tone upon successful payment settlement</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, chimeAudio: !prev.chimeAudio }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        settings.chimeAudio
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {settings.chimeAudio ? 'Chime ON' : 'Chime OFF'}
                    </button>
                    <button
                      type="button"
                      onClick={playCashRegisterChime}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200"
                      title="Test Audio Chime"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Manual Solenoid Kick Test</span>
                    <p className="text-[10px] text-slate-500">Fires test pulse without creating a transaction</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (settings.chimeAudio) playCashRegisterChime();
                      setSettingsNotice({
                        title: 'Cash Drawer Pulse Fired',
                        detail: `Trigger pulse sent via ${settings.drawerPinout || 'Pin 2'} • Register chime sounded.`
                      });
                      setTimeout(() => setSettingsNotice(null), 3500);
                    }}
                    className="px-3.5 py-1.5 bg-[#ff5500] hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>Pop Drawer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 4: TAX, SERVICE CHARGE & CURRENCY */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <Percent className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Currency, Taxes &amp; Surcharge Rates
                    </h3>
                    <p className="text-[10px] text-slate-400">Default rates applied across tables and receipts</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Currency Symbol / Code</label>
                  <input
                    type="text"
                    value={settings.currency}
                    onChange={e => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                    placeholder="e.g. Rs., $, €, LKR"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Displayed on menu, POS &amp; receipts</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Default Service Charge (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={settings.serviceChargeRate}
                    onChange={e => setSettings(prev => ({ ...prev, serviceChargeRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Staff gratuity pool</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sales Tax / VAT Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={settings.taxRate}
                    onChange={e => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Statutory tax rate</span>
                </div>
              </div>

              {/* Receipt Header & Footer Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thermal Receipt Header Notes</label>
                  <textarea
                    rows={3}
                    value={settings.receiptHeader}
                    onChange={e => setSettings(prev => ({ ...prev, receiptHeader: e.target.value }))}
                    placeholder="Address, phone, tax reg line"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thermal Receipt Footer Message</label>
                  <textarea
                    rows={3}
                    value={settings.receiptFooter}
                    onChange={e => setSettings(prev => ({ ...prev, receiptFooter: e.target.value }))}
                    placeholder="Thank you message, wifi password, or return policy"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: SYSTEM DATABASE BACKUP & RESTORE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                    <HardDrive className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      System Database Backup &amp; Disaster Recovery
                    </h3>
                    <p className="text-[10px] text-slate-400">Export or restore full store database (Menu, Staff, Inventory, Shifts &amp; Sales)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Download className="h-4 w-4 text-[#ff5500]" /> Export JSON Database Backup
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Download a complete snapshot of all {menuItems.length} dishes, {inventory.length} ingredients, staff credentials, and {transactions.length} sales records.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> Download System Backup (.json)
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Upload className="h-4 w-4 text-emerald-600" /> Restore System from Backup File
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Upload a previously exported `.json` file to restore settings, inventory levels, menus, and transaction history.
                    </p>
                  </div>

                  <label className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                    <Upload className="h-3.5 w-3.5 text-slate-600" />
                    <span>Select Backup File (.json)</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* SECTION 6: ADMIN FACTORY RESET / WIPE TEST DATA */}
            {currentUser.role === 'Administrator' && (
              <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                      Administrator Data Purge (Reset Test Data)
                    </h3>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      Clear test transactions, reset all tables to VACANT, and start with a clean ledger.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTransactions([]);
                      setActiveOrders([]);
                      setCancelledTickets([]);
                      setAuditLogs([]);
                      setFloorTables(prev => prev.map(t => ({ ...t, status: 'VACANT', currentOrderRef: null })));
                      setCurrentShift({
                        shiftId: `SHIFT-${getLocalDateStr().replace(/-/g, '')}-01`,
                        openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        openedBy: currentUser.name,
                        startingFloat: 15000.00,
                        status: 'OPEN',
                        payouts: []
                      });
                      recordAuditLog('ADMIN_RESET_LEDGER', 'ALL', `Administrator ${currentUser.name} purged all sales and reset tables.`);
                      setSettingsNotice({
                        title: 'All Invoices & Orders Cleared',
                        detail: 'Ledger cleared and all floor tables set to VACANT.'
                      });
                      setTimeout(() => setSettingsNotice(null), 4000);
                    }}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Purge Test Records</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL: EDIT ACTIVE BILL (Billing Queue) */}
      {editBillModalOpen && editingBill && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Edit Active Bill: {editingBill.tableName}</h3>
                <p className="text-xs text-slate-500 font-mono">Order #{editingBill.orderId}</p>
              </div>
              <button onClick={() => setEditBillModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Add item to this bill */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-800">Add Item to Bill</span>
                <div className="flex gap-2">
                  <select
                    id="addDishToBillSelect"
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900"
                  >
                    {menuItems.map(dish => (
                      <option key={dish.id} value={dish.id}>{dish.name} - {settings.currency} {dish.price.toFixed(2)}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const selectEl = document.getElementById('addDishToBillSelect');
                      const selectedDish = menuItems.find(m => m.id === selectEl?.value);
                      if (selectedDish) {
                        setEditingBill(prev => {
                          const existing = prev.items.find(i => i.id === selectedDish.id);
                          const updatedItems = existing
                            ? prev.items.map(i => i.id === selectedDish.id ? { ...i, qty: i.qty + 1 } : i)
                            : [...prev.items, { ...selectedDish, cartItemId: `bill_${Date.now()}`, qty: 1, notes: '' }];
                          return { ...prev, items: updatedItems };
                        });
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Items in the active bill */}
              <div className="space-y-2 max-h-56 overflow-y-auto">
                <span className="text-xs font-black uppercase text-slate-400">Current Items</span>
                {editingBill.items.map(item => (
                  <div key={item.cartItemId || item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{item.name}</p>
                      <span className="font-mono text-xs text-[#ff5500]">{settings.currency} {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingBill(prev => ({
                            ...prev,
                            items: prev.items.map(i => (i.cartItemId || i.id) === (item.cartItemId || item.id) ? { ...i, qty: Math.max(1, i.qty - 1) } : i)
                          }));
                        }}
                        className="h-6 w-6 bg-white border border-slate-200 rounded text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-xs">{item.qty}</span>
                      <button
                        onClick={() => {
                          setEditingBill(prev => ({
                            ...prev,
                            items: prev.items.map(i => (i.cartItemId || i.id) === (item.cartItemId || item.id) ? { ...i, qty: i.qty + 1 } : i)
                          }));
                        }}
                        className="h-6 w-6 bg-white border border-slate-200 rounded text-xs font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          setEditingBill(prev => ({
                            ...prev,
                            items: prev.items.filter(i => (i.cartItemId || i.id) !== (item.cartItemId || item.id))
                          }));
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setEditBillModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setActiveOrders(prev => prev.map(o => o.orderId === editingBill.orderId ? editingBill : o));
                    recordAuditLog('BILL_UPDATED', editingBill.orderId, `Updated items for open bill ${editingBill.orderId} (${editingBill.tableName})`);
                    setEditBillModalOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Save Changes to Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW MENU ITEM WITH INLINE RECIPE BOM */}
      {addItemModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Add New Menu Dish / Drink</h3>
              <button onClick={() => setAddItemModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newDishForm.name.trim() || !newDishForm.price) return;
                const finalCategory = newDishForm.category === 'CUSTOM'
                  ? (newDishForm.customCategory.trim() || 'Specials')
                  : newDishForm.category;

                const newItem = {
                  id: `dish_${Date.now()}`,
                  name: newDishForm.name.trim(),
                  department: newDishForm.department,
                  category: finalCategory,
                  price: parseFloat(newDishForm.price) || 0,
                  prepTime: newDishForm.prepTime || '10m',
                  description: newDishForm.description || '',
                  imageUrl: newDishForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
                  recipe: [...newDishForm.recipeIngredients]
                };

                setMenuItems(prev => [newItem, ...prev]);
                recordAuditLog('CREATE_MENU_ITEM', newItem.id, `Created new ${newItem.department} item: ${newItem.name} (${settings.currency} ${newItem.price})`);
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
              }}
              className="mt-4 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newDishForm.name}
                    onChange={e => setNewDishForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Garlic Butter Prawns"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
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
                    placeholder="e.g. 2400.00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newDishForm.department}
                    onChange={e => setNewDishForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 font-bold focus:outline-none focus:border-[#ff5500]"
                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                  >
                    <option value="Kitchen" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Kitchen (Sends KOT)</option>
                    <option value="Bar" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Bar (Sends BOT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newDishForm.category}
                    onChange={e => setNewDishForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 font-bold focus:outline-none focus:border-[#ff5500]"
                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                  >
                    <option value="Rice & Noodles" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Rice &amp; Noodles</option>
                    <option value="Mains & Grills" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Mains &amp; Grills</option>
                    <option value="Starters" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Starters</option>
                    <option value="Seafood Specials" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Seafood Specials</option>
                    <option value="Cocktails" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Cocktails</option>
                    <option value="Beer & Wine" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Beer &amp; Wine</option>
                    <option value="Hot Coffee" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Hot Coffee</option>
                    <option value="Fresh Juices & Smoothies" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Fresh Juices &amp; Smoothies</option>
                    <option value="Desserts" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>Desserts</option>
                    <option value="CUSTOM" style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>+ Custom Category</option>
                  </select>
                </div>
              </div>

              {newDishForm.category === 'CUSTOM' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter Custom Category</label>
                  <input
                    type="text"
                    value={newDishForm.customCategory}
                    onChange={e => setNewDishForm(prev => ({ ...prev, customCategory: e.target.value }))}
                    placeholder="e.g. Sri Lankan Curries"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              )}

              {/* Dedicated Image Upload Dropzone (No URL required) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Photo (Upload File)</label>
                {newDishForm.imageUrl ? (
                  <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={newDishForm.imageUrl}
                        alt="Preview"
                        className="h-14 w-14 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Photo Attached</p>
                        <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="h-3 w-3" /> Ready for Menu &amp; POS cards
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs shadow-xs transition-colors">
                        <span>Change</span>
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
                      <button
                        type="button"
                        onClick={() => setNewDishForm(prev => ({ ...prev, imageUrl: '' }))}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove Photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-[#ff5500] hover:bg-orange-50/20 bg-slate-50/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all group">
                    <div className="h-10 w-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#ff5500] transition-colors">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#ff5500] transition-colors">
                        Click to Upload Dish Photo
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG, WEBP from your device</p>
                    </div>
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
                )}
              </div>

              {/* Inline Recipe BOM builder */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[#ff5500]" /> Link Recipe Ingredients (BOM)
                </span>
                <div className="flex gap-2">
                  <select id="newDishIngSelect" className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-white">
                    {inventory.map(ing => (
                      <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                    ))}
                  </select>
                  <input
                    id="newDishIngAmount"
                    type="number"
                    min="0.1"
                    step="any"
                    placeholder="Qty/portion"
                    className="w-28 px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-mono bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const sel = document.getElementById('newDishIngSelect');
                      const amtInput = document.getElementById('newDishIngAmount');
                      const ingId = sel?.value;
                      const amt = parseFloat(amtInput?.value);
                      if (!ingId || isNaN(amt) || amt <= 0) return;
                      setNewDishForm(prev => ({
                        ...prev,
                        recipeIngredients: [...prev.recipeIngredients, { ingredientId: ingId, amount: amt }]
                      }));
                      if (amtInput) amtInput.value = '';
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    + Add
                  </button>
                </div>

                {newDishForm.recipeIngredients.length > 0 && (
                  <div className="space-y-1 max-h-28 overflow-y-auto">
                    {newDishForm.recipeIngredients.map((r, i) => (
                      <div key={i} className="flex justify-between items-center text-xs p-1.5 bg-white rounded-lg border border-slate-200">
                        <span className="font-bold">{inventoryMap[r.ingredientId]?.name || r.ingredientId}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500">{r.amount} {inventoryMap[r.ingredientId]?.unit}</span>
                          <button
                            type="button"
                            onClick={() => setNewDishForm(prev => ({ ...prev, recipeIngredients: prev.recipeIngredients.filter((_, idx) => idx !== i) }))}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
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
                  className="flex-1 py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Save &amp; Add to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHECKOUT & SETTLEMENT */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Settle Bill: {settlingOrder ? settlingOrder.tableName : selectedTable.name}
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
                            ? 'bg-[#ff5500] text-white border-[#ff5500]'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'CASH' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">Cash Tendered ({settings.currency})</label>
                        <button
                          type="button"
                          onClick={() => setCashTendered(fin.total.toFixed(2))}
                          className="text-[10px] font-bold text-[#ff5500] hover:underline"
                        >
                          Exact Amount
                        </button>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={cashTendered}
                        onChange={e => setCashTendered(e.target.value)}
                        placeholder={fin.total.toFixed(2)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-[#ff5500]"
                      />

                      {/* Quick cash denomination shortcuts */}
                      <div className="flex gap-1.5 overflow-x-auto pt-0.5">
                        {[
                          Math.ceil(fin.total / 100) * 100,
                          Math.ceil(fin.total / 500) * 500,
                          Math.ceil(fin.total / 1000) * 1000,
                          5000
                        ]
                          .filter((val, idx, arr) => val >= fin.total && arr.indexOf(val) === idx)
                          .slice(0, 3)
                          .map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setCashTendered(val.toString())}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-mono font-bold transition-colors"
                            >
                              {settings.currency} {val}
                            </button>
                          ))}
                      </div>

                      {parseFloat(cashTendered) >= fin.total && (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono font-bold text-emerald-800 flex justify-between items-center">
                          <span>Balance / Change to Return:</span>
                          <span className="text-sm text-emerald-700">
                            {settings.currency} {(parseFloat(cashTendered) - fin.total).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-mono">{settings.currency} {fin.subtotal.toFixed(2)}</span>
                    </div>
                    {fin.discount > 0 && (
                      <div className="flex justify-between text-rose-600">
                        <span>Discount</span>
                        <span className="font-mono">-{settings.currency} {fin.discount.toFixed(2)}</span>
                      </div>
                    )}
                    {fin.service > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Service Charge</span>
                        <span className="font-mono">+{settings.currency} {fin.service.toFixed(2)}</span>
                      </div>
                    )}
                    {fin.tax > 0 && (
                      <div className="flex justify-between text-indigo-700 font-medium">
                        <span>Taxes</span>
                        <span className="font-mono">+{settings.currency} {fin.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Due</span>
                      <span className="text-base font-mono text-[#ff5500]">{settings.currency} {fin.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCompleteSettlement}
                    className="w-full py-3 bg-[#008f5d] hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-xs"
                  >
                    Confirm Settlement &amp; Deduct BOM Stock
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* STREAMLINED NON-BLOCKING PRINT NOTIFICATION TOAST */}
      {printNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-md transition-all">
          <div className="h-9 w-9 rounded-xl bg-orange-500/20 text-[#ff5500] flex items-center justify-center shrink-0">
            <Printer className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{printNotice.title}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{printNotice.detail}</p>
          </div>
        </div>
      )}

      {/* HIDDEN OFF-SCREEN THERMAL PRINT AREA (Visible ONLY to physical print engine) */}
      <div
        id="thermal-print-area"
        style={{
          fontSize: settings.receiptFontSize || '11px',
          fontFamily: settings.receiptFontFamily || 'monospace',
          padding: settings.receiptMargin || '2mm'
        }}
        className="hidden print:block w-full bg-white text-slate-900 leading-tight space-y-4"
      >
        {activePrintSlip && (
          <>
            {/* 2-Slip Order Dispatch: KOT & BOT */}
            {activePrintSlip.type === 'KOT_BOT_DISPATCH' && (
              <div className="space-y-4">
                {activePrintSlip.data.kitchenItems?.length > 0 && (
                  <div className="border-b-2 border-dashed border-slate-800 pb-3 text-center">
                    <p className="font-black text-xs">** KITCHEN ORDER TICKET (KOT) **</p>
                    <p className="font-bold text-xs mt-1">{activePrintSlip.data.order.tableName}</p>
                    <p className="text-[10px]">Time: {activePrintSlip.data.order.sentAt}</p>
                    <div className="text-left py-2 space-y-1">
                      {activePrintSlip.data.kitchenItems.map((item, idx) => (
                        <div key={idx}>
                          <p className="font-bold">{item.qty}x {item.name}</p>
                          {item.notes && <p className="text-[10px] pl-2 italic">&gt; {item.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePrintSlip.data.barItems?.length > 0 && (
                  <div className="border-b-2 border-dashed border-slate-800 pb-3 text-center">
                    <p className="font-black text-xs">** BAR ORDER TICKET (BOT) **</p>
                    <p className="font-bold text-xs mt-1">{activePrintSlip.data.order.tableName}</p>
                    <p className="text-[10px]">Time: {activePrintSlip.data.order.sentAt}</p>
                    <div className="text-left py-2 space-y-1">
                      {activePrintSlip.data.barItems.map((item, idx) => (
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

            {/* Temporary Proforma Bill */}
            {activePrintSlip.type === 'TEMP_BILL' && (
              <div className="space-y-2">
                <div className="text-center border-b-2 border-dashed border-slate-800 pb-2">
                  <p className="font-black text-sm">{settings.restaurantName}</p>
                  <p className="font-bold text-xs mt-1">*** PROFORMA TEMPORARY BILL ***</p>
                  <p className="text-[10px]">Table: {activePrintSlip.data.table} • Server: {activePrintSlip.data.server}</p>
                  <p className="text-[9px]">{new Date().toLocaleString()}</p>
                </div>
                <div className="py-1 border-b border-slate-300 space-y-1">
                  {activePrintSlip.data.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.qty}x {item.name}</span>
                      <span>{settings.currency} {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{settings.currency} {activePrintSlip.data.subtotal.toFixed(2)}</span>
                  </div>
                  {activePrintSlip.data.discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Discount:</span>
                      <span>-{settings.currency} {activePrintSlip.data.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {activePrintSlip.data.service > 0 && (
                    <div className="flex justify-between">
                      <span>Service Charge:</span>
                      <span>+{settings.currency} {activePrintSlip.data.service.toFixed(2)}</span>
                    </div>
                  )}
                  {activePrintSlip.data.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Taxes:</span>
                      <span>+{settings.currency} {activePrintSlip.data.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-800">
                    <span>ESTIMATED TOTAL:</span>
                    <span>{settings.currency} {activePrintSlip.data.total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-center text-[9px] italic pt-2">Not a tax invoice • For guest review only</p>
              </div>
            )}

            {/* Final Settlement Tax Invoice */}
            {activePrintSlip.type === 'FINAL_BILL' && (
              <div className="space-y-2">
                <div className="text-center border-b-2 border-dashed border-slate-800 pb-2">
                  <p className="font-black text-sm">{settings.restaurantName}</p>
                  <p className="text-[9px] whitespace-pre-line">{settings.receiptHeader}</p>
                  <p className="font-bold text-xs mt-1">TAX INVOICE #{activePrintSlip.data.invoiceNo}</p>
                  <p className="text-[9px]">{activePrintSlip.data.date} • {activePrintSlip.data.table}</p>
                </div>
                <div className="py-1 border-b border-slate-300 space-y-1">
                  {activePrintSlip.data.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.qty}x {item.name}</span>
                      <span>{settings.currency} {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{settings.currency} {(activePrintSlip.data.subtotal || 0).toFixed(2)}</span>
                  </div>
                  {activePrintSlip.data.discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Discount ({activePrintSlip.data.discountPercent || 0}%):</span>
                      <span>-{settings.currency} {activePrintSlip.data.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {activePrintSlip.data.serviceCharge > 0 && (
                    <div className="flex justify-between">
                      <span>Service Charge ({settings.serviceChargeRate}%):</span>
                      <span>+{settings.currency} {activePrintSlip.data.serviceCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {activePrintSlip.data.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Taxes ({settings.taxRate}%):</span>
                      <span>+{settings.currency} {activePrintSlip.data.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-800">
                    <span>TOTAL AMOUNT DUE:</span>
                    <span>{settings.currency} {activePrintSlip.data.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>PAYMENT METHOD:</span>
                    <span>{activePrintSlip.data.paymentMethod}</span>
                  </div>

                  {/* Cash Given & Change Breakdown */}
                  {activePrintSlip.data.paymentMethod === 'CASH' && (
                    <div className="pt-1.5 mt-1 border-t border-dashed border-slate-800 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>CASH TENDERED (GIVEN):</span>
                        <span>
                          {settings.currency} {(activePrintSlip.data.cashTendered !== undefined ? activePrintSlip.data.cashTendered : activePrintSlip.data.total).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-black">
                        <span>BALANCE / CHANGE DUE:</span>
                        <span>
                          {settings.currency} {(activePrintSlip.data.changeDue || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-center font-bold text-[9px] pt-2 whitespace-pre-line">{settings.receiptFooter}</p>
              </div>
            )}

            {/* Cash Out Voucher */}
            {activePrintSlip.type === 'CASH_OUT_VOUCHER' && (
              <div className="space-y-2">
                <div className="text-center border-b-2 border-dashed border-slate-800 pb-2">
                  <p className="font-black text-sm">{settings.restaurantName}</p>
                  <p className="font-bold text-xs mt-1">*** CASH OUT VOUCHER ***</p>
                  <p className="text-[10px]">Ref: {activePrintSlip.data.id} • Terminal: {settings.terminalId}</p>
                  <p className="text-[9px]">{activePrintSlip.data.date || getLocalDateStr()} {activePrintSlip.data.createdAt || activePrintSlip.data.time}</p>
                </div>

                <div className="py-2 border-b border-slate-300 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold">CATEGORY:</span>
                    <span>{activePrintSlip.data.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">PAID TO:</span>
                    <span>{activePrintSlip.data.recipient || 'General Expense'}</span>
                  </div>
                  <div className="text-left pt-1">
                    <span className="font-bold">DESCRIPTION:</span>
                    <p className="italic text-[10px]">{activePrintSlip.data.reason}</p>
                  </div>
                </div>

                <div className="py-1 border-b border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between font-black text-sm">
                    <span>AMOUNT DISBURSED:</span>
                    <span>{settings.currency} {(parseFloat(activePrintSlip.data.amount) || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] space-y-3">
                  <div className="flex justify-between">
                    <span>Requested By: {activePrintSlip.data.requestedBy}</span>
                    <span>Approved By: {activePrintSlip.data.approvedBy || 'Supervisor'}</span>
                  </div>

                  <div className="pt-4 border-t border-dotted border-slate-400 flex justify-between text-[9px]">
                    <div>
                      <p>___________________</p>
                      <p>Cashier Signature</p>
                    </div>
                    <div className="text-right">
                      <p>___________________</p>
                      <p>Manager Signature</p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-[9px] italic pt-2">Official Cash Drawer Disbursement Voucher</p>
              </div>
            )}

            {/* Z-Report Shift Close */}
            {activePrintSlip.type === 'Z_REPORT' && (
              <div className="space-y-2">
                <div className="text-center border-b-2 border-dashed border-slate-800 pb-2">
                  <p className="font-black text-sm">{settings.restaurantName}</p>
                  <p className="font-bold text-xs mt-1">*** Z-REPORT (SHIFT CLOSE) ***</p>
                  <p className="text-[10px]">Shift: {activePrintSlip.data.shiftId}</p>
                  <p className="text-[9px]">Closed by: {activePrintSlip.data.closedBy} at {activePrintSlip.data.closedAt}</p>
                </div>
                <div className="py-2 border-b border-slate-300 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>OPENING FLOAT:</span>
                    <span>{settings.currency} {activePrintSlip.data.startingFloat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>COUNTED CASH:</span>
                    <span>{settings.currency} {activePrintSlip.data.metrics.countedCash.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-center font-bold text-[9px] pt-1">REGISTER AUDITED &amp; CLOSED</p>
              </div>
            )}
          </>
        )}
      </div>

      {}
      {cashOutApprovalModal.open && cashOutApprovalModal.item && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">Manager Authorization</h3>
              </div>
              <button
                onClick={() => setCashOutApprovalModal({ open: false, item: null, managerPin: '', error: '' })}
                className="text-slate-400 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Expense:</span>
                  <span className="font-bold text-slate-900">{cashOutApprovalModal.item.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-mono font-black text-[#ff5500]">
                    {settings.currency} {(parseFloat(cashOutApprovalModal.item.amount) || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Requested By:</span>
                  <span className="font-medium text-slate-700">{cashOutApprovalModal.item.requestedBy}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                  Enter Manager / Admin 4-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={cashOutApprovalModal.managerPin}
                  onChange={(e) => setCashOutApprovalModal(prev => ({ ...prev, managerPin: e.target.value, error: '' }))}
                  placeholder="••••"
                  className="w-full px-3 py-2 text-center text-xl font-mono tracking-widest border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                />
                {cashOutApprovalModal.error && (
                  <p className="text-xs text-rose-600 font-bold mt-1 text-center">{cashOutApprovalModal.error}</p>
                )}
                <p className="text-[10px] text-slate-400 text-center mt-1">Default Admin PIN: 1234</p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCashOutApprovalModal({ open: false, item: null, managerPin: '', error: '' })}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const manager = staffList.find(s => (s.role === 'Administrator' || s.role === 'Manager') && s.pin === cashOutApprovalModal.managerPin.trim());
                    if (!manager) {
                      setCashOutApprovalModal(prev => ({ ...prev, error: 'Invalid Manager/Admin PIN' }));
                      return;
                    }

                    const targetItem = cashOutApprovalModal.item;
                    setCurrentShift(prev => ({
                      ...prev,
                      payouts: prev.payouts.map(p => p.id === targetItem.id ? {
                        ...p,
                        status: 'APPROVED',
                        approvedBy: manager.name,
                        approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      } : p)
                    }));

                    recordAuditLog(
                      'CASH_OUT_APPROVED_PIN',
                      targetItem.id,
                      `Manager ${manager.name} authorized cash out ${targetItem.id} for ${settings.currency} ${targetItem.amount}`
                    );

                    setCashOutApprovalModal({ open: false, item: null, managerPin: '', error: '' });
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Authorize Payout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TABLE ALLOCATION WITH VISUAL TICKS */}
      {allocationModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Grid className="h-4 w-4 text-[#ff5500]" /> Assign Table or Order Mode
              </h3>
              <button onClick={() => setAllocationModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mode selection with tick indicators */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderMode('DINING')}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  orderMode === 'DINING'
                    ? 'border-[#ff5500] bg-orange-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4 text-[#ff5500]" />
                  <span className="font-bold text-xs text-slate-900">Dine-In Tables</span>
                </div>
                <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                  orderMode === 'DINING' ? 'bg-[#ff5500] border-[#ff5500] text-white' : 'border-slate-300'
                }`}>
                  {orderMode === 'DINING' && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrderMode('TAKEAWAY')}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  orderMode === 'TAKEAWAY'
                    ? 'border-[#ff5500] bg-orange-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[#ff5500]" />
                  <span className="font-bold text-xs text-slate-900">Takeaway Express</span>
                </div>
                <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                  orderMode === 'TAKEAWAY' ? 'bg-[#ff5500] border-[#ff5500] text-white' : 'border-slate-300'
                }`}>
                  {orderMode === 'TAKEAWAY' && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </button>
            </div>

            {/* Visual table grid with tick marks on the selected table */}
            {orderMode === 'DINING' ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Select Table:</span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500">Guests:</span>
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="h-6 w-6 rounded bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold w-5 text-center">{guestCount}</span>
                    <button
                      type="button"
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="h-6 w-6 rounded bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {floorTables.map(tbl => {
                    const isSelected = selectedTable.id === tbl.id;
                    const isOccupied = tbl.status === 'OCCUPIED';
                    return (
                      <button
                        key={tbl.id}
                        type="button"
                        onClick={() => {
                          setSelectedTable(tbl);
                          setAllocationModalOpen(false);
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-start justify-between transition-all ${
                          isSelected
                            ? 'border-[#ff5500] bg-orange-50/80 ring-2 ring-orange-500/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs text-slate-900">{tbl.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              isOccupied ? 'bg-orange-100 text-[#ff5500]' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {tbl.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{tbl.zone}</p>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Capacity: {tbl.capacity} Seats</span>
                        </div>
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center border shrink-0 transition-all ${
                          isSelected ? 'bg-[#ff5500] border-[#ff5500] text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">Express Token:</span>
                  <span className="font-mono font-bold text-xs bg-orange-100 text-[#ff5500] px-2 py-0.5 rounded-md">
                    {takeawayInfo.token}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer / Guest Name</label>
                  <input
                    type="text"
                    value={takeawayInfo.name}
                    onChange={(e) => setTakeawayInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={takeawayInfo.phone}
                    onChange={(e) => setTakeawayInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+94..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono bg-white text-slate-900 focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setAllocationModalOpen(false)}
                  className="w-full py-2.5 bg-[#ff5500] text-white font-bold rounded-xl text-xs"
                >
                  Confirm Takeaway Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {/* MODAL: ADD NEW STAFF MEMBER */}
      {addStaffModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#ff5500]" />
                <h3 className="text-base font-black text-slate-900">Add New Staff Member</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddStaffModalOpen(false);
                  setStaffFormError('');
                  setNewStaffForm({ name: '', role: 'Cashier', pin: '', email: '' });
                }}
                className="text-slate-400 hover:text-slate-900"
              >
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
                  placeholder="e.g. Kasun Fernando"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role / Access Level</label>
                  <select
                    value={newStaffForm.role}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                  >
                    {Object.keys(ROLE_PERMISSIONS).map(role => (
                      <option key={role} value={role} style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">4-Digit Security PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={newStaffForm.pin}
                    onChange={e => setNewStaffForm(prev => ({ ...prev, pin: e.target.value }))}
                    placeholder="e.g. 4321"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm font-mono font-bold text-slate-900 tracking-widest focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newStaffForm.email}
                  onChange={e => setNewStaffForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. kasun@linolicove.me"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              {staffFormError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center">
                  {staffFormError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddStaffModalOpen(false);
                    setStaffFormError('');
                    setNewStaffForm({ name: '', role: 'Cashier', pin: '', email: '' });
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW RAW MATERIAL */}
      {addInventoryModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[#ff5500]" />
                <h3 className="text-base font-black text-slate-900">Add Raw Material to Inventory</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddInventoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInventoryItem} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Material / Ingredient Name</label>
                <input
                  type="text"
                  required
                  value={newInventoryForm.name}
                  onChange={e => setNewInventoryForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Single Malt Scotch, Fresh Lime"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newInventoryForm.category}
                    onChange={e => setNewInventoryForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                  >
                    <option value="Dry Goods">Dry Goods</option>
                    <option value="Dairy & Eggs">Dairy &amp; Eggs</option>
                    <option value="Meat">Meat</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Bar Supplies">Bar Supplies</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Produce">Produce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit of Measure</label>
                  <select
                    value={newInventoryForm.unit}
                    onChange={e => setNewInventoryForm(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
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
                    min="0.01"
                    required
                    value={newInventoryForm.cost}
                    onChange={e => setNewInventoryForm(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="e.g. 1.50"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={newInventoryForm.stock}
                    onChange={e => setNewInventoryForm(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Low Alert Level</label>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    value={newInventoryForm.threshold}
                    onChange={e => setNewInventoryForm(prev => ({ ...prev, threshold: e.target.value }))}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddInventoryModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECEIVE STOCK INTAKE (GRN) */}
      {receiveStockModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Receive Stock Intake (GRN)</h3>
              </div>
              <button
                type="button"
                onClick={() => setReceiveStockModalOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReceiveStock} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Material / Ingredient</label>
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
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                >
                  {inventory.map(item => (
                    <option key={item.id} value={item.id} style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                      {item.name} ({item.stock} {item.unit} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Qty Received ({inventoryMap[receiveStockForm.ingredientId]?.unit || 'units'})
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    required
                    value={receiveStockForm.quantity}
                    onChange={e => setReceiveStockForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Updated Unit Cost ({settings.currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={receiveStockForm.newCost}
                    onChange={e => setReceiveStockForm(prev => ({ ...prev, newCost: e.target.value }))}
                    placeholder="Current cost"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
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
                    placeholder="e.g. Colombo Central Market"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Invoice / Ref #</label>
                  <input
                    type="text"
                    value={receiveStockForm.invoiceRef}
                    onChange={e => setReceiveStockForm(prev => ({ ...prev, invoiceRef: e.target.value }))}
                    placeholder="e.g. GRN-804"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              {receiveStockForm.ingredientId && receiveStockForm.quantity && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Intake Projection:
                  </p>
                  <p>
                    Material: <strong>{inventoryMap[receiveStockForm.ingredientId]?.name}</strong>
                  </p>
                  <p className="font-mono">
                    Stock: {inventoryMap[receiveStockForm.ingredientId]?.stock} →{' '}
                    <strong>
                      {Number(((inventoryMap[receiveStockForm.ingredientId]?.stock || 0) + (parseFloat(receiveStockForm.quantity) || 0)).toFixed(2))}{' '}
                      {inventoryMap[receiveStockForm.ingredientId]?.unit}
                    </strong>
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReceiveStockModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
                >
                  Confirm Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {addTableModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Grid className="h-5 w-5 text-[#ff5500]" />
                <h3 className="text-base font-black text-slate-900">Add New Floor Table</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddTableModalOpen(false);
                  setNewTableForm({ name: '', zone: 'Indoor Main Hall', capacity: 4 });
                }}
                className="text-slate-400 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTable} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Table Name / Identifier</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTableForm.name}
                  onChange={e => setNewTableForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Table 6, Cabana 2, Bar Seat 03"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Floor Zone</label>
                  <select
                    value={newTableForm.zone}
                    onChange={e => setNewTableForm(prev => ({ ...prev, zone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                  >
                    <option value="Indoor Main Hall">Indoor Main Hall</option>
                    <option value="Deck Lounge">Deck Lounge</option>
                    <option value="Cocktail Counter">Cocktail Counter</option>
                    <option value="Private Ocean View">Private Ocean View</option>
                    <option value="Beachfront Garden">Beachfront Garden</option>
                    <option value="Rooftop Terrace">Rooftop Terrace</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={newTableForm.capacity}
                    onChange={e => setNewTableForm(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="4"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddTableModalOpen(false);
                    setNewTableForm({ name: '', zone: 'Indoor Main Hall', capacity: 4 });
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#ff5500] hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}