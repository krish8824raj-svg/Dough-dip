// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

// ===== DOM ELEMENTS & STATE =====
let currentSessionUser = null;
let activeTab = 'analytics'; // Default admin tab
let activeStaffTab = 'billing'; // Default staff tab
let selectedCart = [];
let menuItems = [];
let outletsList = [];
let ordersList = [];
let uploadedMenuImgBase64 = '';
let socialPosts = [];
let uploadedSocialImgBase64 = '';

const defaultSocialPosts = [
    { id: "1", img: "social media/steamed_momo.png", caption: "Freshly steamed goodness! #DoughAndDip #Momos", platform: "instagram", sticker: "🥟", stickerClass: "sticker-1" },
    { id: "2", img: "social media/kurkure_momo.png", caption: "Craving that extra crunch? 💥 #KurkureMomos", platform: "instagram", sticker: "🥢", stickerClass: "sticker-2" },
    { id: "3", img: "social media/tandoori_momo.png", caption: "Smoky vibes on a Friday night 🔥 #Tandoori", platform: "instagram", sticker: "", stickerClass: "" },
    { id: "4", img: "social media/makhni_momo.png", caption: "Rich, creamy, delicious. 🍛 #MakhniGravy", platform: "instagram", sticker: "", stickerClass: "" },
    { id: "5", img: "social media/afghani_momo.png", caption: "Afghani cream perfection. 🤤 #FoodieJaipur", platform: "instagram", sticker: "", stickerClass: "" },
    { id: "6", img: "social media/schezwan_momo.png", caption: "Spice up your life with Schezwan! 🌶️ #Spicy", platform: "instagram", sticker: "🔥", stickerClass: "sticker-1" },
    { id: "7", img: "social media/steamed_momo.png", caption: "Behind the scenes of our royal blend. 👑", platform: "instagram", sticker: "", stickerClass: "" },
    { id: "8", img: "social media/kurkure_momo.png", caption: "Best snacks in town. Tag a friend! 👇", platform: "instagram", sticker: "", stickerClass: "" },
    { id: "9", img: "social media/steamed_momo.png", caption: "Healthy and hearty. ❤️ #EatFresh", platform: "instagram", sticker: "", stickerClass: "" },
    { id: "10", img: "social media/tandoori_momo.png", caption: "See you at our outlets! 👋 #DoughAndDip", platform: "instagram", sticker: "😋", stickerClass: "sticker-2" }
];

let db = null;
let useFirebase = false;

// Check if production keys are set in firebase-config.js
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY" && !firebaseConfig.apiKey.includes("YOUR_")) {
    try {
        const app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        useFirebase = true;
        console.log("🔥 Firebase initialized successfully in Admin Portal!");
    } catch (e) {
        console.warn("⚠️ Firebase failed to initialize. Using localStorage mode instead.", e);
    }
}

// Default Menu items for seeding
const defaultMenu = [
    { id: "1", name: "Classic Vegetable Momo", priceHalf: 60, priceFull: 80, price: 60, desc: "Classic hand-folded steamed momos filled with fresh garden vegetables and mild herbs, served with spicy red chutney.", category: "steamed-fried", spice: 1, spiceText: "Mild Spicy", badge: "Classic", badgeClass: "badge-steamed", img: "images/steamed_momo.png" },
    { id: "2", name: "Paneer & Cheese Momo", priceHalf: 80, priceFull: 100, price: 80, desc: "Rich paneer and gooey cheese combined inside a soft wrapper, steamed to melt-in-the-mouth perfection.", category: "steamed-fried", spice: 1, spiceText: "Creamy & Mild", badge: "Classic", badgeClass: "badge-steamed", img: "images/steamed_momo.png" },
    { id: "3", name: "Soya Momo", priceHalf: 50, priceFull: 70, price: 50, desc: "Soft steamed momos packed with protein-rich soya chunks, finely chopped vegetables, and aromatic spices.", category: "steamed-fried", spice: 1, spiceText: "Mild Spicy", badge: "Classic", badgeClass: "badge-steamed", img: "images/steamed_momo.png" },
    { id: "4", name: "Paneer Momo", priceHalf: 70, priceFull: 90, price: 70, desc: "Delicate steamed wrappers loaded with spiced cottage cheese stuffing, a true classic comfort food.", category: "steamed-fried", spice: 1, spiceText: "Mild Spicy", badge: "Classic", badgeClass: "badge-steamed", img: "images/steamed_momo.png" },
    { id: "5", name: "Cheese Corn Momo", priceHalf: 80, priceFull: 100, price: 80, desc: "Sweet corn kernels and melted mozzarella cheese, creating a delicious creamy sweet-savory blend.", category: "steamed-fried", spice: 1, spiceText: "Creamy & Mild", badge: "Classic", badgeClass: "badge-steamed", img: "images/steamed_momo.png" },
    { id: "6", name: "Classic Vegetable Fried", priceHalf: 70, priceFull: 90, price: 70, desc: "Crispy deep-fried momos packed with vegetables, perfect for that crunchy evening craving.", category: "steamed-fried", spice: 1, spiceText: "Mild Spicy", badge: "Crispy", badgeClass: "badge-kurkure", img: "images/steamed_momo.png" },
    { id: "7", name: "Paneer & Cheese Fried", priceHalf: 90, priceFull: 110, price: 90, desc: "Crispy fried momos filled with premium paneer and melted cheese, served with mayonnaise and red chutney.", category: "steamed-fried", spice: 1, spiceText: "Creamy & Rich", badge: "Crispy", badgeClass: "badge-kurkure", img: "images/steamed_momo.png" },
    { id: "8", name: "Soya Fried Momo", priceHalf: 60, priceFull: 80, price: 60, desc: "Deep-fried golden momos stuffed with spiced soya mince and fresh green onions.", category: "steamed-fried", spice: 1, spiceText: "Mild Spicy", badge: "Crispy", badgeClass: "badge-kurkure", img: "images/steamed_momo.png" },
    { id: "9", name: "Paneer Fried Momo", priceHalf: 80, priceFull: 100, price: 80, desc: "Juicy cottage cheese stuffed momos fried to golden perfection, crispy on the outside and soft inside.", category: "steamed-fried", spice: 1, spiceText: "Mild Spicy", badge: "Crispy", badgeClass: "badge-kurkure", img: "images/steamed_momo.png" },
    { id: "10", name: "Cheese Corn Fried Momo", priceHalf: 90, priceFull: 110, price: 90, desc: "Golden fried crispy pocket momos overflowing with corn and piping hot melted cheese.", category: "steamed-fried", spice: 1, spiceText: "Creamy & Sweet", badge: "Crispy", badgeClass: "badge-kurkure", img: "images/steamed_momo.png" },
    { id: "11", name: "Classic Vegitables KurKure Momo", price: 90, desc: "Jaipur's special cornflake-crusted crispy kurkure momos stuffed with fresh chopped veggies.", category: "kurkure", spice: 2, spiceText: "Medium Spicy", badge: "Crunchy", badgeClass: "badge-kurkure", img: "images/kurkure_momo.png" },
    { id: "12", name: "Paneer Kurkure Momo", price: 110, desc: "Crunchy double-fried momos with a crispy outer coating and a rich paneer filling.", category: "kurkure", spice: 2, spiceText: "Medium Spicy", badge: "Crunchy", badgeClass: "badge-kurkure", img: "images/kurkure_momo.png" },
    { id: "13", name: "Paneer & Cheese Kurkure Momo", price: 120, desc: "Extra crunchy shell packed with rich paneer and cream cheese, a true crowd-pleaser.", category: "kurkure", spice: 2, spiceText: "Creamy Crunchy", badge: "Crunchy", badgeClass: "badge-kurkure", img: "images/kurkure_momo.png" },
    { id: "14", name: "Chessy & Corn Kurkure Momo", price: 130, desc: "Crispy, crunchy cornflakes coating outside, oozing with hot cheese and sweet corn inside.", category: "kurkure", spice: 2, spiceText: "Creamy Crunchy", badge: "Crunchy", badgeClass: "badge-kurkure", img: "images/kurkure_momo.png" },
    { id: "15", name: "Vegitables Spring Roll", price: 90, desc: "Crispy wrappers rolled with stir-fried Chinese vegetables and glass noodles, deep fried.", category: "spring-rolls", spice: 1, spiceText: "Mild Spicy", badge: "Fresh", badgeClass: "badge-steamed", img: "images/kurkure_momo.png" },
    { id: "16", name: "Paneer Spring Roll", price: 120, desc: "Golden crispy spring rolls stuffed with spiced scrambled paneer and spring vegetables.", category: "spring-rolls", spice: 1, spiceText: "Mild Spicy", badge: "Fresh", badgeClass: "badge-steamed", img: "images/kurkure_momo.png" },
    { id: "17", name: "Mexican Cheese Spring Roll", price: 130, desc: "Fusion spring rolls stuffed with jalapenos, corn, capsicum, and loaded with Mexican cheese blend.", category: "spring-rolls", spice: 2, spiceText: "Medium Spicy", badge: "Spicy", badgeClass: "badge-spicy", img: "images/kurkure_momo.png" },
    { id: "18", name: "Tandori Dip", price: 40, desc: "Spicy and smoky tandoori dip, perfect sidekick for tandoori momos.", category: "dips", spice: 2, spiceText: "Smoky Spicy", badge: "Sides", badgeClass: "badge-tandoori", img: "images/tandoori_momo.png" },
    { id: "19", name: "Makhni Dip", price: 50, desc: "Rich, buttery, Punjabi-style makhni dip made with tomatoes, fresh cream, and fenugreek.", category: "dips", spice: 1, spiceText: "Sweet & Mild", badge: "Sides", badgeClass: "badge-gravy", img: "images/makhni_momo.png" },
    { id: "20", name: "Afghani Dip", price: 50, desc: "Mildly sweet and rich creamy dip made with ground cashews, fresh cheese, and cream.", category: "dips", spice: 1, spiceText: "Sweet & Creamy", badge: "Sides", badgeClass: "badge-afghan", img: "images/afghani_momo.png" },
    { id: "21", name: "Jhol Momo with Indian Taste", price: 130, desc: "Our signature hot steamed momos floating in a rich, tangy, and flavorful tomato-sesame Jhol soup with Indian spices.", category: "speciality", spice: 2, spiceText: "Spicy Jhol", badge: "Special", badgeClass: "badge-tandoori", img: "images/makhni_momo.png" }
];

// Default Outlets for seeding
const defaultOutlets = [
    { id: 'mansarovar', name: 'Mansarovar', tag: 'मुख्य शाखा (Main Branch)', badge: 'Main Branch', badgeClass: 'main-badge', address: 'Plot 42, Ward 27, Main Vijay Path Crossing, Mansarovar, Jaipur - 302020', phone: '+91 98290 12345, +91 141 278940', hours: '6:00 PM - 11:00 PM (Everyday)', features: 'Outdoor Sitting, Live Tandoor Charcoal Grill, Free Parking, Cozy Vibes.', mapUrl: 'https://maps.google.com/?q=Vijay+Path+Mansarovar+Jaipur' },
    { id: 'vijay-path', name: 'Vijay Path', tag: 'लोकप्रिय स्थान (Trending Spot)', badge: 'Trending', badgeClass: '', address: 'Shop 12, Sector 5 Shopping Complex, Vijay Path Road, Mansarovar, Jaipur - 302018', phone: '+91 98290 12346', hours: '6:00 PM - 11:00 PM (Everyday)', features: 'Jaipuri Kurkure Momo Specialty, Quick Service Counter, Standing Tables.', mapUrl: 'https://maps.google.com/?q=Sector+5+Vijay+Path+Jaipur' }
];

document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    checkAuthSession();
    setupEventListeners();
    loadPartnerLocks();
    setupPartnerLockListeners();
    loadShopLock();
    setupShopLockListeners();

    // Initialize Firebase Live Cloud Database Syncing
    if (useFirebase && db) {
        // 1. Sync Settings (shop closed, partner locks)
        onValue(ref(db, 'settings'), (snapshot) => {
            const val = snapshot.val();
            if (!val) {
                console.log("🌱 Seeding Firebase database settings with defaults...");
                set(ref(db, 'settings'), {
                    shopClosed: false,
                    zomatoLocked: false,
                    swiggyLocked: false
                });
                return;
            }
            localStorage.setItem('momo_shop_closed', val.shopClosed === true);
            localStorage.setItem('momo_zomato_locked', val.zomatoLocked === true);
            localStorage.setItem('momo_swiggy_locked', val.swiggyLocked === true);
            
            loadPartnerLocks();
            loadShopLock();
        });

        // 2. Sync Menu Stock & Seed if empty
        onValue(ref(db, 'menu'), (snapshot) => {
            const val = snapshot.val();
            if (!val) {
                console.log("🌱 Seeding Firebase database menu with defaults...");
                const menuData = {};
                defaultMenu.forEach(item => {
                    menuData[item.id] = {
                        id: item.id,
                        name: item.name,
                        price: item.price || 0,
                        priceHalf: item.priceHalf || null,
                        priceFull: item.priceFull || null,
                        outOfStock: false
                    };
                });
                set(ref(db, 'menu'), menuData);
                return;
            }
            
            let localMenu = JSON.parse(localStorage.getItem('momo_menu')) || defaultMenu;
            localMenu.forEach(item => {
                if (val[item.id]) {
                    item.outOfStock = val[item.id].outOfStock === true;
                    if (val[item.id].price) item.price = val[item.id].price;
                    if (val[item.id].priceHalf) item.priceHalf = val[item.id].priceHalf;
                    if (val[item.id].priceFull) item.priceFull = val[item.id].priceFull;
                }
            });
            localStorage.setItem('momo_menu', JSON.stringify(localMenu));
            
            if (typeof loadMenuManager === 'function') loadMenuManager();
            if (typeof loadBillingTerminal === 'function') loadBillingTerminal();
        });

        // 3. Sync Orders
        onValue(ref(db, 'orders'), (snapshot) => {
            const val = snapshot.val();
            let orders = [];
            if (val) {
                orders = Object.values(val).sort((a, b) => b.timestamp - a.timestamp);
            }
            localStorage.setItem('momo_orders', JSON.stringify(orders));
            ordersList = orders;
            
            if (typeof loadOrdersQueue === 'function') loadOrdersQueue();
            if (typeof loadOrdersLog === 'function') loadOrdersLog();
            if (typeof loadAnalytics === 'function') loadAnalytics();
        });

        // 4. Sync Social Posts
        onValue(ref(db, 'social_posts'), (snapshot) => {
            const val = snapshot.val();
            if (!val) {
                console.log("🌱 Seeding Firebase database social posts with defaults...");
                const socialData = {};
                defaultSocialPosts.forEach(post => {
                    socialData[post.id] = post;
                });
                set(ref(db, 'social_posts'), socialData);
                return;
            }
            const postsList = Object.values(val);
            localStorage.setItem('momo_social_posts', JSON.stringify(postsList));
            socialPosts = postsList;
            
            if (activeTab === 'social-wall') {
                if (typeof loadSocialWallManager === 'function') loadSocialWallManager();
            }
        });
    }
});

// ===== DATABASE LOCALSTORAGE INITIALIZATION & SEEDING =====
function initDatabase() {
    // Load Menu
    const storedMenu = JSON.parse(localStorage.getItem('momo_menu'));
    if (!storedMenu || storedMenu.some(item => item.name === "Royal Steamed Veg Momos") || storedMenu.length < 21) {
        localStorage.setItem('momo_menu', JSON.stringify(defaultMenu));
    }
    menuItems = JSON.parse(localStorage.getItem('momo_menu'));

    // Load Outlets
    if (!localStorage.getItem('momo_outlets')) {
        localStorage.setItem('momo_outlets', JSON.stringify(defaultOutlets));
    }
    outletsList = JSON.parse(localStorage.getItem('momo_outlets'));

    // Load Orders & Seed if empty
    if (!localStorage.getItem('momo_orders')) {
        seedMockOrders();
    }
    ordersList = JSON.parse(localStorage.getItem('momo_orders'));

    // Load Social Wall Posts
    if (!localStorage.getItem('momo_social_posts')) {
        localStorage.setItem('momo_social_posts', JSON.stringify(defaultSocialPosts));
    }
    socialPosts = JSON.parse(localStorage.getItem('momo_social_posts'));
}

function seedMockOrders() {
    const mockOrders = [];
    const outlets = ['mansarovar', 'vijay-path'];
    const outletNames = { 'mansarovar': 'Mansarovar', 'vijay-path': 'Vijay Path' };
    const itemsPool = defaultMenu;
    
    // Seed orders over the last 30 days
    const today = new Date();
    let orderCounter = 1001;

    for (let i = 28; i >= 0; i--) {
        const orderDate = new Date(today);
        orderDate.setDate(today.getDate() - i);
        
        // Random number of orders per day (1 to 4)
        const dayOrdersCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < dayOrdersCount; j++) {
            const outletId = outlets[Math.floor(Math.random() * outlets.length)];
            const orderTime = new Date(orderDate);
            // Random hour between 6pm and 11pm (operating hours)
            orderTime.setHours(18 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 60), 0);
            
            // Pick 1 to 3 items
            const itemsCount = Math.floor(Math.random() * 3) + 1;
            const chosenItems = [];
            let totalAmount = 0;
            
            // Randomly select items without duplicates
            const poolShuffled = [...itemsPool].sort(() => 0.5 - Math.random());
            for (let k = 0; k < itemsCount; k++) {
                const item = poolShuffled[k];
                const qty = Math.floor(Math.random() * 2) + 1; // qty 1 or 2
                chosenItems.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    qty: qty,
                    total: item.price * qty
                });
                totalAmount += item.price * qty;
            }

            // Date string helpers
            const dateStr = orderTime.toISOString().split('T')[0];
            const monthStr = dateStr.slice(0, 7); // YYYY-MM
            
            mockOrders.push({
                id: `ORD-${orderCounter++}`,
                customerName: `Customer #${Math.floor(Math.random() * 50) + 1}`,
                outletId: outletId,
                outletName: outletNames[outletId],
                items: chosenItems,
                totalAmount: totalAmount,
                status: "Completed",
                timestamp: orderTime.getTime(),
                date: dateStr,
                month: monthStr,
                servedBy: 'staff'
            });
        }
    }
    
    // Sort chronologically
    mockOrders.sort((a, b) => b.timestamp - a.timestamp);
    localStorage.setItem('momo_orders', JSON.stringify(mockOrders));
}

// ===== AUTH MANAGEMENT =====
function checkAuthSession() {
    const cachedUser = sessionStorage.getItem('momo_user');
    if (cachedUser) {
        currentSessionUser = cachedUser;
        showDashboard(currentSessionUser);
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('portal-section').style.display = 'none';
}

function showDashboard(role) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('portal-section').style.display = 'flex';
    
    // Set Profile UI
    document.getElementById('profile-username').textContent = role === 'admin' ? 'Jaipur Admin' : 'Outlet Staff';
    document.getElementById('profile-role-badge').textContent = role;

    // Toggle Sidebar elements based on role
    const adminLinks = document.querySelectorAll('.admin-only');
    const staffLinks = document.querySelectorAll('.staff-only');
    
    if (role === 'admin') {
        adminLinks.forEach(el => el.style.display = 'flex');
        staffLinks.forEach(el => el.style.display = 'none');
        switchTab('analytics');
    } else {
        adminLinks.forEach(el => el.style.display = 'none');
        staffLinks.forEach(el => el.style.display = 'flex');
        switchStaffTab('billing');
    }
}

function handleLogin(role, username, password) {
    const errorBanner = document.getElementById('login-error-banner');
    errorBanner.style.display = 'none';
    
    if (role === 'admin') {
        if (username === 'admin' && password === 'admin123') {
            sessionStorage.setItem('momo_user', 'admin');
            currentSessionUser = 'admin';
            showDashboard('admin');
        } else {
            showLoginError('Invalid Admin credentials!');
        }
    } else if (role === 'staff') {
        if (username === 'staff' && password === '123') {
            sessionStorage.setItem('momo_user', 'staff');
            currentSessionUser = 'staff';
            showDashboard('staff');
        } else {
            showLoginError('Invalid Staff PIN / credentials!');
        }
    }
}

function showLoginError(msg) {
    const errorBanner = document.getElementById('login-error-banner');
    errorBanner.textContent = msg;
    errorBanner.style.display = 'block';
}

function handleLogout() {
    sessionStorage.removeItem('momo_user');
    currentSessionUser = null;
    selectedCart = [];
    showLoginScreen();
}

// ===== TAB CONTROLLER =====
function switchTab(tabId) {
    activeTab = tabId;
    
    // Update sidebar UI
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.sidebar-link[data-tab="${tabId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update view panels
    document.querySelectorAll('.dashboard-view').forEach(view => {
        view.classList.remove('active');
    });
    const activeView = document.getElementById(`${tabId}-view`);
    if (activeView) activeView.classList.add('active');

    // Trigger tab-specific loads
    if (tabId === 'analytics') {
        loadAnalytics();
    } else if (tabId === 'outlet-manager') {
        loadOutletsManager();
    } else if (tabId === 'orders-log') {
        loadOrdersLog();
    } else if (tabId === 'social-wall') {
        loadSocialWallManager();
    }
}

function switchStaffTab(tabId) {
    activeStaffTab = tabId;
    
    // Update sidebar UI
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.sidebar-link[data-tab="${tabId}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update view panels
    document.querySelectorAll('.dashboard-view').forEach(view => {
        view.classList.remove('active');
    });
    const activeView = document.getElementById(`${tabId}-view`);
    if (activeView) activeView.classList.add('active');

    // Trigger loads
    if (tabId === 'billing') {
        loadBillingTerminal();
    } else if (tabId === 'orders-queue') {
        loadOrdersQueue();
    } else if (tabId === 'menu-manager') {
        loadMenuManager();
    }
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    // Login Option Switch cards
    const optCards = document.querySelectorAll('.login-option-card');
    optCards.forEach(card => {
        card.addEventListener('click', () => {
            optCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const selectedRole = card.getAttribute('data-role');
            document.getElementById('login-role').value = selectedRole;
            
            // Adjust label text
            const labelUser = document.querySelector('label[for="username"]');
            const inputUser = document.getElementById('username');
            
            if (selectedRole === 'admin') {
                labelUser.textContent = 'Admin Username';
                inputUser.placeholder = 'e.g. admin';
                inputUser.value = 'admin';
            } else {
                labelUser.textContent = 'Staff Code Name';
                inputUser.placeholder = 'e.g. staff';
                inputUser.value = 'staff';
            }
        });
    });

    // Login Form Submit
    document.getElementById('btn-login-submit').addEventListener('click', (e) => {
        e.preventDefault();
        const role = document.getElementById('login-role').value;
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value;
        
        handleLogin(role, user, pass);
    });

    // Logout click
    document.getElementById('btn-logout').addEventListener('click', handleLogout);

    // Sidebar menu navigation links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');
            if (currentSessionUser === 'admin') {
                switchTab(tabId);
            } else {
                switchStaffTab(tabId);
            }
        });
    });

    // --- Analytics Form Filters ---
    const filterDate = document.getElementById('filter-analytics-date');
    const filterMonth = document.getElementById('filter-analytics-month');
    
    if (filterDate) {
        // Default select to today's date
        filterDate.value = new Date().toISOString().split('T')[0];
        filterDate.addEventListener('change', loadAnalytics);
    }
    if (filterMonth) {
        // Default select to current month YYYY-MM
        filterMonth.value = new Date().toISOString().split('T')[0].slice(0, 7);
        filterMonth.addEventListener('change', loadAnalytics);
    }

    // --- Outlet Momo Sales Breakdown Filter ---
    const filterBreakdownOutlet = document.getElementById('filter-breakdown-outlet');
    if (filterBreakdownOutlet) {
        filterBreakdownOutlet.addEventListener('change', loadOutletMomoBreakdown);
    }

    // --- Menu Manager Modal Add Item ---
    const btnAddNewItem = document.getElementById('btn-add-new-item');
    if (btnAddNewItem) {
        btnAddNewItem.addEventListener('click', () => {
            openMenuFormModal();
        });
    }

    // Image file upload handler for menu item
    const menuImgFileInput = document.getElementById('menu-item-file');
    const menuImgPreview = document.getElementById('menu-item-img-preview');
    if (menuImgFileInput) {
        menuImgFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    uploadedMenuImgBase64 = evt.target.result;
                    if (menuImgPreview) {
                        menuImgPreview.src = uploadedMenuImgBase64;
                        menuImgPreview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const catSelect = document.getElementById('menu-item-category');
    if (catSelect) {
        catSelect.addEventListener('change', () => {
            togglePriceFields(catSelect.value);
        });
    }

    // Save menu item form submit
    const menuForm = document.getElementById('menu-item-form');
    if (menuForm) {
        menuForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveMenuItem();
        });
    }

    // Image file upload handler for social post
    const socialImgFileInput = document.getElementById('social-post-file');
    const socialImgPreview = document.getElementById('social-post-img-preview');
    if (socialImgFileInput) {
        socialImgFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    uploadedSocialImgBase64 = evt.target.result;
                    if (socialImgPreview) {
                        socialImgPreview.src = uploadedSocialImgBase64;
                        socialImgPreview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Save social post form submit
    const socialPostForm = document.getElementById('social-post-form');
    if (socialPostForm) {
        socialPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveSocialPost();
        });
    }

    // Close Menu Form modal
    const btnCloseMenuForm = document.getElementById('btn-close-menu-modal');
    if (btnCloseMenuForm) {
        btnCloseMenuForm.addEventListener('click', () => {
            document.getElementById('menu-item-modal').style.display = 'none';
        });
    }

    // --- Outlet Manager Modal Add Outlet ---
    const btnAddNewOutlet = document.getElementById('btn-add-new-outlet');
    if (btnAddNewOutlet) {
        btnAddNewOutlet.addEventListener('click', () => {
            openOutletFormModal();
        });
    }

    // Save outlet form submit
    const outletForm = document.getElementById('outlet-item-form');
    if (outletForm) {
        outletForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveOutletItem();
        });
    }

    // Close Outlet Form modal
    const btnCloseOutletForm = document.getElementById('btn-close-outlet-modal');
    if (btnCloseOutletForm) {
        btnCloseOutletForm.addEventListener('click', () => {
            document.getElementById('outlet-item-modal').style.display = 'none';
        });
    }

    // --- Log search filters ---
    const logSearchInput = document.getElementById('log-search-id');
    const logOutletFilter = document.getElementById('log-filter-outlet');
    const logStartDateFilter = document.getElementById('log-filter-start-date');
    const logEndDateFilter = document.getElementById('log-filter-end-date');
    
    if (logSearchInput) logSearchInput.addEventListener('input', loadOrdersLog);
    if (logOutletFilter) logOutletFilter.addEventListener('change', loadOrdersLog);
    if (logStartDateFilter) logStartDateFilter.addEventListener('change', loadOrdersLog);
    if (logEndDateFilter) logEndDateFilter.addEventListener('change', loadOrdersLog);

    // Statement Actions
    const btnDownload = document.getElementById('btn-download-statement');
    if (btnDownload) btnDownload.addEventListener('click', downloadStatementCSV);

    const btnClearLogs = document.getElementById('btn-clear-logs');
    if (btnClearLogs) btnClearLogs.addEventListener('click', clearAllLogsData);

    // Close invoice popup
    document.getElementById('btn-close-invoice').addEventListener('click', () => {
        document.getElementById('invoice-popup').classList.remove('active');
    });
    
    document.getElementById('btn-print-invoice').addEventListener('click', () => {
        window.print();
    });
}

// ===== 1. ADMIN - SALES ANALYTICS =====
function loadAnalytics() {
    const orders = JSON.parse(localStorage.getItem('momo_orders')) || [];
    const completedOrders = orders.filter(o => o.status === 'Completed');
    
    // Calculate global stats
    let totalRevenue = 0;
    completedOrders.forEach(o => totalRevenue += o.totalAmount);
    
    document.getElementById('stat-total-revenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('stat-total-orders').textContent = completedOrders.length;
    
    // Outlets Earnings breakdown
    const outletStats = {};
    // Pre-populate with all active outlets
    outletsList.forEach(out => {
        outletStats[out.name] = { earnings: 0, ordersCount: 0 };
    });
    
    completedOrders.forEach(o => {
        if (outletStats[o.outletName] !== undefined) {
            outletStats[o.outletName].earnings += o.totalAmount;
            outletStats[o.outletName].ordersCount += 1;
        } else {
            outletStats[o.outletName] = { earnings: o.totalAmount, ordersCount: 1 };
        }
    });

    const outletEarningsList = document.getElementById('outlet-earnings-list');
    if (outletEarningsList) {
        outletEarningsList.innerHTML = '';
        
        Object.keys(outletStats).forEach(name => {
            const stat = outletStats[name];
            const row = document.createElement('div');
            row.className = 'outlet-earning-row';
            row.innerHTML = `
                <div class="outlet-earning-name">
                    <span>📍</span>
                    <span><strong>${name} Outlet</strong></span>
                    <span style="font-size:0.75rem; color:#666; margin-left:8px;">(${stat.ordersCount} orders)</span>
                </div>
                <span class="text-primary font-bold">₹${stat.earnings.toLocaleString()}</span>
            `;
            outletEarningsList.appendChild(row);
        });
    }

    // Populate outlet plate breakdown choices dynamically
    const selectBreakdownOutlet = document.getElementById('filter-breakdown-outlet');
    if (selectBreakdownOutlet) {
        const currentSelected = selectBreakdownOutlet.value || 'all';
        selectBreakdownOutlet.innerHTML = '<option value="all">📊 All Locations Combined</option>';
        outletsList.forEach(out => {
            selectBreakdownOutlet.innerHTML += `<option value="${out.id}">${out.name} Outlet</option>`;
        });
        
        if (Array.from(selectBreakdownOutlet.options).some(opt => opt.value === currentSelected)) {
            selectBreakdownOutlet.value = currentSelected;
        } else {
            selectBreakdownOutlet.value = 'all';
        }
    }

    // Best Selling Item - DAY WISE
    const selectedDate = document.getElementById('filter-analytics-date').value;
    const dayOrders = completedOrders.filter(o => o.date === selectedDate);
    const daySalesCount = {};
    let dayTotalQty = 0;
    
    dayOrders.forEach(order => {
        order.items.forEach(item => {
            daySalesCount[item.name] = (daySalesCount[item.name] || 0) + item.qty;
            dayTotalQty += item.qty;
        });
    });

    renderChartBarList('day-chart-list', daySalesCount, dayTotalQty, 'No items sold on this day.');

    // Best Selling Item - MONTH WISE
    const selectedMonth = document.getElementById('filter-analytics-month').value; // YYYY-MM
    const monthOrders = completedOrders.filter(o => o.month === selectedMonth);
    const monthSalesCount = {};
    let monthTotalQty = 0;

    monthOrders.forEach(order => {
        order.items.forEach(item => {
            monthSalesCount[item.name] = (monthSalesCount[item.name] || 0) + item.qty;
            monthTotalQty += item.qty;
        });
    });

    renderChartBarList('month-chart-list', monthSalesCount, monthTotalQty, 'No items sold in this month.');

    // Load dynamic outlet breakdown chart
    loadOutletMomoBreakdown();
}

function loadOutletMomoBreakdown() {
    const orders = JSON.parse(localStorage.getItem('momo_orders')) || [];
    const completedOrders = orders.filter(o => o.status === 'Completed');
    const filterSelect = document.getElementById('filter-breakdown-outlet');
    if (!filterSelect) return;
    
    const selectedOutletId = filterSelect.value;
    
    const filteredOrders = selectedOutletId === 'all' 
        ? completedOrders 
        : completedOrders.filter(o => o.outletId === selectedOutletId);
        
    const salesCount = {};
    let totalQty = 0;
    
    filteredOrders.forEach(order => {
        order.items.forEach(item => {
            salesCount[item.name] = (salesCount[item.name] || 0) + item.qty;
            totalQty += item.qty;
        });
    });
    
    renderChartBarList('outlet-breakdown-chart-list', salesCount, totalQty, 'No items sold at this outlet yet.');
}

function renderChartBarList(elementId, salesCountMap, totalQty, emptyMessage) {
    const listContainer = document.getElementById(elementId);
    listContainer.innerHTML = '';

    const itemsSorted = Object.keys(salesCountMap).map(name => {
        return { name: name, qty: salesCountMap[name] };
    }).sort((a, b) => b.qty - a.qty);

    if (itemsSorted.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center; padding: 20px; font-weight:700; color:var(--text-muted);">${emptyMessage}</div>`;
        return;
    }

    // Render bar chart tracks
    const maxQty = itemsSorted[0].qty; // Highest quantity represents 100% of graph bar

    itemsSorted.forEach(item => {
        const percentage = maxQty > 0 ? (item.qty / maxQty) * 100 : 0;
        const barItem = document.createElement('div');
        barItem.className = 'chart-bar-item';
        barItem.innerHTML = `
            <div class="chart-bar-info">
                <span>🥟 ${item.name}</span>
                <span>${item.qty} units sold (${Math.round((item.qty / totalQty) * 100)}%)</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width: ${percentage}%;"></div>
            </div>
        `;
        listContainer.appendChild(barItem);
        
        // Trigger animations
        setTimeout(() => {
            const fill = barItem.querySelector('.chart-bar-fill');
            if (fill) fill.style.width = `${percentage}%`;
        }, 100);
    });
}

// ===== 2. ADMIN - OUTLETS MANAGER =====
function loadOutletsManager() {
    const grid = document.getElementById('outlets-management-grid');
    if (!grid) return;
    
    outletsList = JSON.parse(localStorage.getItem('momo_outlets')) || defaultOutlets;
    grid.innerHTML = '';

    outletsList.forEach(outlet => {
        const card = document.createElement('div');
        card.className = 'neo-card';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';

        const isClosed = outlet.status === 'Closed';
        const statusBadge = isClosed ? '<span class="neo-badge" style="background:#ffcdd2; color:#d32f2f; border-color:#e53935; font-size: 0.65rem;">CLOSED TODAY 🔴</span>' : '<span class="neo-badge" style="background:#e8f8f0; color:#2ecc71; border-color:#27ae60; font-size: 0.65rem;">ACTIVE 🟢</span>';
        const toggleBtnText = isClosed ? '🟢 Mark Open' : '🔴 Mark Closed';
        const toggleBtnClass = isClosed ? 'neo-btn-success' : 'neo-btn-danger';

        card.innerHTML = `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                    <h3 style="font-family:var(--font-heading); font-size:1.4rem;">${outlet.name}</h3>
                    <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-end;">
                        <span class="neo-badge ${outlet.badgeClass || ''}">${outlet.badge || 'Outlet'}</span>
                        ${statusBadge}
                    </div>
                </div>
                <div style="font-size:0.85rem; font-weight:600; display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">
                    <p><strong>📍 Addr:</strong> ${outlet.address}</p>
                    <p><strong>📞 Contact:</strong> ${outlet.phone}</p>
                    <p><strong>⏰ Hours:</strong> ${outlet.hours}</p>
                    <p><strong>✨ Features:</strong> ${outlet.features}</p>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; border-top:1px dashed #ddd; padding-top:12px;">
                <div class="table-actions" style="width:100%;">
                    <button class="neo-btn btn-qty" onclick="openOutletFormModal('${outlet.id}')" style="border-radius:6px; flex:1; font-size:0.8rem; padding:6px 12px; justify-content:center;">✏️ Edit</button>
                    <button class="neo-btn btn-qty" onclick="deleteOutletItem('${outlet.id}')" style="border-radius:6px; border-color:#e53935; color:#e53935; flex:1; font-size:0.8rem; padding:6px 12px; justify-content:center;">🗑️ Delete</button>
                </div>
                <button class="neo-btn ${toggleBtnClass}" onclick="toggleOutletStatus('${outlet.id}')" style="border-radius:6px; width:100%; font-size:0.8rem; padding:6px 12px; justify-content:center;">
                    ${toggleBtnText}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.toggleOutletStatus = function(outletId) {
    outletsList = JSON.parse(localStorage.getItem('momo_outlets')) || defaultOutlets;
    const index = outletsList.findIndex(o => o.id === outletId);
    if (index !== -1) {
        const current = outletsList[index].status || 'Open';
        outletsList[index].status = current === 'Closed' ? 'Open' : 'Closed';
        localStorage.setItem('momo_outlets', JSON.stringify(outletsList));
        loadOutletsManager();
    }
};

window.openOutletFormModal = function(outletId = '') {
    const modal = document.getElementById('outlet-item-modal');
    const modalTitle = document.getElementById('outlet-modal-title');
    const form = document.getElementById('outlet-item-form');
    
    modal.style.display = 'flex';
    form.reset();

    if (outletId) {
        modalTitle.textContent = '✏️ Edit Jaipur Outlet';
        document.getElementById('outlet-action-type').value = 'edit';
        document.getElementById('outlet-edit-id').value = outletId;
        
        const outlet = outletsList.find(o => o.id === outletId);
        if (outlet) {
            document.getElementById('outlet-name').value = outlet.name;
            document.getElementById('outlet-tag').value = outlet.tag;
            document.getElementById('outlet-badge').value = outlet.badge;
            document.getElementById('outlet-badge-class').value = outlet.badgeClass || '';
            document.getElementById('outlet-address').value = outlet.address;
            document.getElementById('outlet-phone').value = outlet.phone;
            document.getElementById('outlet-hours').value = outlet.hours;
            document.getElementById('outlet-features').value = outlet.features;
            document.getElementById('outlet-map-url').value = outlet.mapUrl || '';
            document.getElementById('outlet-status').value = outlet.status || 'Open';
        }
    } else {
        modalTitle.textContent = '📍 Add New Jaipur Outlet';
        document.getElementById('outlet-action-type').value = 'add';
        document.getElementById('outlet-edit-id').value = '';
        document.getElementById('outlet-status').value = 'Open';
    }
};

window.deleteOutletItem = function(outletId) {
    if (confirm('Are you sure you want to delete this outlet? It will remove it from the main website as well.')) {
        outletsList = outletsList.filter(o => o.id !== outletId);
        localStorage.setItem('momo_outlets', JSON.stringify(outletsList));
        loadOutletsManager();
    }
};

function saveOutletItem() {
    const action = document.getElementById('outlet-action-type').value;
    const name = document.getElementById('outlet-name').value.trim();
    const tag = document.getElementById('outlet-tag').value.trim();
    const badge = document.getElementById('outlet-badge').value.trim();
    const badgeClass = document.getElementById('outlet-badge-class').value;
    const address = document.getElementById('outlet-address').value.trim();
    const phone = document.getElementById('outlet-phone').value.trim();
    const hours = document.getElementById('outlet-hours').value.trim();
    const features = document.getElementById('outlet-features').value.trim();
    const mapUrl = document.getElementById('outlet-map-url').value.trim();
    const status = document.getElementById('outlet-status').value || 'Open';

    if (!name || !address || !phone || !hours) {
        alert('Please fill out all required fields.');
        return;
    }

    if (action === 'add') {
        const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newOutlet = {
            id: newId,
            name,
            tag,
            badge,
            badgeClass,
            address,
            phone,
            hours,
            features,
            mapUrl: mapUrl || `https://maps.google.com/?q=${encodeURIComponent(name + ' Jaipur')}`,
            status: status
        };
        outletsList.push(newOutlet);
    } else if (action === 'edit') {
        const editId = document.getElementById('outlet-edit-id').value;
        const index = outletsList.findIndex(o => o.id === editId);
        if (index !== -1) {
            outletsList[index] = {
                id: editId,
                name,
                tag,
                badge,
                badgeClass,
                address,
                phone,
                hours,
                features,
                mapUrl: mapUrl || outletsList[index].mapUrl,
                status: status
            };
        }
    }

    localStorage.setItem('momo_outlets', JSON.stringify(outletsList));
    document.getElementById('outlet-item-modal').style.display = 'none';
    loadOutletsManager();
}

// ===== 3. ADMIN - COMPLETED ORDERS LOG =====
function loadOrdersLog() {
    const tbody = document.getElementById('orders-log-tbody');
    if (!tbody) return;

    ordersList = JSON.parse(localStorage.getItem('momo_orders')) || [];
    
    // Set filter options dynamically based on available outlets
    const selectFilter = document.getElementById('log-filter-outlet');
    const currentFilterVal = selectFilter.value;
    selectFilter.innerHTML = '<option value="all">📍 All Locations</option>';
    outletsList.forEach(out => {
        selectFilter.innerHTML += `<option value="${out.name}">${out.name}</option>`;
    });
    selectFilter.value = currentFilterVal; // Preserve filter selection

    // Filter list
    const searchVal = document.getElementById('log-search-id').value.trim().toLowerCase();
    const outletVal = selectFilter.value;
    const startDateVal = document.getElementById('log-filter-start-date').value;
    const endDateVal = document.getElementById('log-filter-end-date').value;

    const filtered = ordersList.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchVal) || 
                              order.customerName.toLowerCase().includes(searchVal);
        const matchesOutlet = outletVal === 'all' || order.outletName === outletVal;
        
        let matchesStartDate = true;
        if (startDateVal) {
            matchesStartDate = order.date >= startDateVal;
        }
        let matchesEndDate = true;
        if (endDateVal) {
            matchesEndDate = order.date <= endDateVal;
        }
        
        return matchesSearch && matchesOutlet && matchesStartDate && matchesEndDate;
    });

    tbody.innerHTML = '';
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; font-weight:700;">No transactions matching filters.</td></tr>';
        return;
    }

    filtered.forEach(order => {
        const dateObj = new Date(order.timestamp);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const itemsSummary = order.items.map(item => `${item.qty}x ${item.name}`).join('<br>');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="neo-badge" style="background:#F5EDE3;">${order.id}</span></td>
            <td>${dateStr}</td>
            <td><strong>📍 ${order.outletName}</strong></td>
            <td>👤 ${order.customerName}</td>
            <td><div style="font-size:0.8rem; line-height:1.3;">${itemsSummary}</div></td>
            <td class="text-primary font-bold">₹${order.totalAmount}</td>
            <td><span class="neo-badge" style="background:${order.status === 'Pending' ? '#ffeaa7' : '#2ecc71'}; color:${order.status === 'Pending' ? '#1A1A1A' : 'white'}; border-color:${order.status === 'Pending' ? '#f39c12' : '#27ae60'};">${order.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function clearAllLogsData() {
    if (confirm('⚠️ WARNING: Kya aap saare completed orders aur transaction logs clear karna chahte hain? Yeh operation undo nahi ho sakta.')) {
        localStorage.setItem('momo_orders', JSON.stringify([]));
        ordersList = [];
        loadOrdersLog();
        loadAnalytics();
        alert('🗑️ All completed order logs cleared successfully!');
    }
}

function downloadStatementCSV() {
    const orders = JSON.parse(localStorage.getItem('momo_orders')) || [];
    const completedOrders = orders.filter(o => o.status === 'Completed');

    const searchVal = document.getElementById('log-search-id').value.trim().toLowerCase();
    const outletVal = document.getElementById('log-filter-outlet').value;
    const startDateVal = document.getElementById('log-filter-start-date').value;
    const endDateVal = document.getElementById('log-filter-end-date').value;

    const filtered = completedOrders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchVal) || 
                              order.customerName.toLowerCase().includes(searchVal);
        const matchesOutlet = outletVal === 'all' || order.outletName === outletVal;
        
        let matchesStartDate = true;
        if (startDateVal) {
            matchesStartDate = order.date >= startDateVal;
        }
        let matchesEndDate = true;
        if (endDateVal) {
            matchesEndDate = order.date <= endDateVal;
        }

        return matchesSearch && matchesOutlet && matchesStartDate && matchesEndDate;
    });

    if (filtered.length === 0) {
        alert('Statement download fail: No completed orders found in the selected date range and filters.');
        return;
    }

    let csvContent = "Dough & Dip Momos - Sales Statement\n";
    csvContent += `Generated On,${new Date().toLocaleString()}\n`;
    csvContent += `Filters,Outlet: ${outletVal} | Date Range: ${startDateVal || 'Any'} to ${endDateVal || 'Any'}\n\n`;
    csvContent += "Order ID,Date & Time,Outlet Branch,Customer Name,Items Ordered,Total Amount (INR),Served By\n";

    let grandTotalAmount = 0;
    filtered.forEach(order => {
        const dateStr = new Date(order.timestamp).toLocaleString().replace(/,/g, '');
        const itemsStr = order.items.map(item => `${item.qty}x ${item.name}`).join(' | ');
        csvContent += `"${order.id}","${dateStr}","${order.outletName}","${order.customerName}","${itemsStr}",${order.totalAmount},"${order.servedBy || 'staff'}"\n`;
        grandTotalAmount += order.totalAmount;
    });

    csvContent += `\nSUMMARY,Total Orders: ${filtered.length},,,Total Earnings (INR),${grandTotalAmount},\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    let filename = `dough_dip_sales_statement`;
    if (startDateVal) filename += `_from_${startDateVal}`;
    if (endDateVal) filename += `_to_${endDateVal}`;
    filename += `.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== 4. STAFF - MENU MANAGER =====
function togglePriceFields(category) {
    const groupSingle = document.getElementById('group-price-single');
    const groupHalf = document.getElementById('group-price-half');
    const groupFull = document.getElementById('group-price-full');
    
    if (category === 'steamed-fried') {
        if (groupSingle) groupSingle.style.display = 'none';
        if (groupHalf) groupHalf.style.display = 'block';
        if (groupFull) groupFull.style.display = 'block';
        
        document.getElementById('menu-item-price').required = false;
        document.getElementById('menu-item-price-half').required = true;
        document.getElementById('menu-item-price-full').required = true;
    } else {
        if (groupSingle) groupSingle.style.display = 'block';
        if (groupHalf) groupHalf.style.display = 'none';
        if (groupFull) groupFull.style.display = 'none';
        
        document.getElementById('menu-item-price').required = true;
        document.getElementById('menu-item-price-half').required = false;
        document.getElementById('menu-item-price-full').required = false;
    }
}

function loadMenuManager() {
    const tbody = document.getElementById('menu-manager-tbody');
    if (!tbody) return;

    menuItems = JSON.parse(localStorage.getItem('momo_menu')) || defaultMenu;
    tbody.innerHTML = '';

    menuItems.forEach(item => {
        const tr = document.createElement('tr');
        const isAvailable = !item.outOfStock;
        const pricingText = item.priceHalf && item.priceFull
            ? `₹${item.priceHalf} (H) / ₹${item.priceFull} (F)`
            : `₹${item.price}`;

        tr.innerHTML = `
            <td><img src="${item.img || 'images/steamed_momo.png'}" onerror="this.src='images/steamed_momo.png'"></td>
            <td><strong>${item.name}</strong><br><span style="font-size:0.75rem; color:#888;">ID: ${item.id} | Cat: ${item.category}</span></td>
            <td style="font-size:0.8rem; max-width:240px; color:#555;">${item.desc}</td>
            <td class="text-primary font-bold">${pricingText}</td>
            <td>${'🌶️'.repeat(item.spice)}</td>
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <label class="toggle-switch">
                        <input type="checkbox" class="stock-toggle" data-id="${item.id}" ${isAvailable ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    <span style="font-size:0.72rem; font-weight:800; min-width: 60px; color:${isAvailable ? '#2ecc71' : '#d32f2f'};">
                        ${isAvailable ? 'Available 🟢' : 'Out of Stock 🔴'}
                    </span>
                </div>
            </td>
            <td>
                <div class="table-actions">
                    <button class="neo-btn action-btn-sm" onclick="openMenuFormModal('${item.id}')">✏️ Edit</button>
                    <button class="neo-btn action-btn-sm" onclick="deleteMenuItem('${item.id}')" style="background:#ffcdd2; color:#d32f2f;">🗑️ Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Attach listeners to stock toggles
    tbody.querySelectorAll('.stock-toggle').forEach(toggle => {
        toggle.addEventListener('change', () => {
            const itemId = toggle.getAttribute('data-id');
            const isAvailable = toggle.checked;
            toggleMomoStock(itemId, !isAvailable);
        });
    });
}

window.openMenuFormModal = function(itemId = '') {
    const modal = document.getElementById('menu-item-modal');
    const modalTitle = document.getElementById('menu-modal-title');
    const form = document.getElementById('menu-item-form');
    
    modal.style.display = 'flex';
    form.reset();

    // Reset gallery upload state
    uploadedMenuImgBase64 = '';
    const fileInput = document.getElementById('menu-item-file');
    if (fileInput) fileInput.value = '';
    const imgPreview = document.getElementById('menu-item-img-preview');
    if (imgPreview) {
        imgPreview.src = '';
        imgPreview.style.display = 'none';
    }

    if (itemId) {
        modalTitle.textContent = '🥟 Edit Momo Dish Details';
        document.getElementById('menu-action-type').value = 'edit';
        document.getElementById('menu-edit-id').value = itemId;
        
        const item = menuItems.find(i => i.id === itemId);
        if (item) {
            document.getElementById('menu-item-name').value = item.name;
            document.getElementById('menu-item-desc').value = item.desc;
            document.getElementById('menu-item-category').value = item.category;
            document.getElementById('menu-item-spice').value = item.spice;
            document.getElementById('menu-item-spice-text').value = item.spiceText || 'Medium Spicy';
            document.getElementById('menu-item-badge').value = item.badge || '';
            document.getElementById('menu-item-badge-class').value = item.badgeClass || '';
            document.getElementById('menu-item-img').value = item.img || '';

            if (imgPreview && item.img) {
                imgPreview.src = item.img;
                imgPreview.style.display = 'block';
            }

            togglePriceFields(item.category);
            if (item.category === 'steamed-fried') {
                document.getElementById('menu-item-price-half').value = item.priceHalf || '';
                document.getElementById('menu-item-price-full').value = item.priceFull || '';
                document.getElementById('menu-item-price').value = '';
            } else {
                document.getElementById('menu-item-price').value = item.price || '';
                document.getElementById('menu-item-price-half').value = '';
                document.getElementById('menu-item-price-full').value = '';
            }
        }
    } else {
        modalTitle.textContent = '🥟 Add New Momo Dish to Menu';
        document.getElementById('menu-action-type').value = 'add';
        document.getElementById('menu-edit-id').value = '';
        
        document.getElementById('menu-item-category').value = 'steamed-fried';
        togglePriceFields('steamed-fried');
    }
};

window.deleteMenuItem = function(itemId) {
    if (confirm('Are you sure you want to delete this menu dish? It will disappear from the main website menu.')) {
        menuItems = menuItems.filter(i => i.id !== itemId);
        localStorage.setItem('momo_menu', JSON.stringify(menuItems));
        loadMenuManager();
    }
};

function saveMenuItem() {
    const action = document.getElementById('menu-action-type').value;
    const name = document.getElementById('menu-item-name').value.trim();
    const desc = document.getElementById('menu-item-desc').value.trim();
    const category = document.getElementById('menu-item-category').value;
    const spice = parseInt(document.getElementById('menu-item-spice').value);
    const spiceText = document.getElementById('menu-item-spice-text').value.trim();
    const badge = document.getElementById('menu-item-badge').value.trim();
    const badgeClass = document.getElementById('menu-item-badge-class').value;
    
    // Compute final image
    let finalImg = 'images/steamed_momo.png';
    if (uploadedMenuImgBase64) {
        finalImg = uploadedMenuImgBase64;
    } else if (action === 'edit') {
        const editId = document.getElementById('menu-edit-id').value;
        const originalItem = menuItems.find(i => i.id === editId);
        const selectedPreset = document.getElementById('menu-item-img').value;
        if (originalItem) {
            if (selectedPreset && selectedPreset !== "") {
                finalImg = selectedPreset;
            } else {
                finalImg = originalItem.img || 'images/steamed_momo.png';
            }
        }
    } else {
        finalImg = document.getElementById('menu-item-img').value || 'images/steamed_momo.png';
    }

    let price = 0;
    let priceHalf = null;
    let priceFull = null;

    if (category === 'steamed-fried') {
        priceHalf = parseInt(document.getElementById('menu-item-price-half').value);
        priceFull = parseInt(document.getElementById('menu-item-price-full').value);
        price = priceHalf; // fallback
        if (isNaN(priceHalf) || isNaN(priceFull)) {
            alert('Please enter both Half and Full plate prices.');
            return;
        }
    } else {
        price = parseInt(document.getElementById('menu-item-price').value);
        if (isNaN(price)) {
            alert('Please enter a price.');
            return;
        }
    }

    if (!name || !desc) {
        alert('Please fill out all required fields.');
        return;
    }

    if (action === 'add') {
        const newId = (menuItems.length > 0) ? (Math.max(...menuItems.map(i => parseInt(i.id))) + 1).toString() : "1";
        const newItem = {
            id: newId,
            name,
            price,
            priceHalf,
            priceFull,
            desc,
            category,
            spice,
            spiceText,
            badge: badge || 'New',
            badgeClass: badgeClass || 'badge-steamed',
            img: finalImg
        };
        menuItems.push(newItem);
    } else if (action === 'edit') {
        const editId = document.getElementById('menu-edit-id').value;
        const index = menuItems.findIndex(i => i.id === editId);
        if (index !== -1) {
            menuItems[index] = {
                id: editId,
                name,
                price,
                priceHalf,
                priceFull,
                desc,
                category,
                spice,
                spiceText,
                badge: badge || 'New',
                badgeClass: badgeClass || 'badge-steamed',
                img: finalImg
            };
        }
    }

    localStorage.setItem('momo_menu', JSON.stringify(menuItems));

    // Sync to Firebase if enabled
    if (useFirebase && db) {
        const menuData = {};
        menuItems.forEach(item => {
            menuData[item.id] = {
                id: item.id,
                name: item.name,
                price: item.price,
                priceHalf: item.priceHalf || null,
                priceFull: item.priceFull || null,
                outOfStock: item.outOfStock === true
            };
        });
        set(ref(db, 'menu'), menuData);
    }

    document.getElementById('menu-item-modal').style.display = 'none';
    loadMenuManager();
}

// ===== 5. STAFF - BILLING Counter (Parchi Cut) =====
function loadBillingTerminal() {
    // Populate outlets selection in billing
    const selectOutlet = document.getElementById('billing-outlet-select');
    selectOutlet.innerHTML = '';
    outletsList.forEach(out => {
        selectOutlet.innerHTML += `<option value="${out.id}">${out.name} Outlet</option>`;
    });

    // Populate billing item cards
    const menuItemsGrid = document.getElementById('billing-menu-items');
    menuItemsGrid.innerHTML = '';
    
    // Sort items by category
    const activeCat = document.querySelector('.billing-tab-btn.active')?.getAttribute('data-cat') || 'all';
    
    // Bind category switch buttons
    const catBtns = document.querySelectorAll('.billing-tab-btn');
    catBtns.forEach(btn => {
        // Remove existing listener to avoid stacking
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => {
            document.querySelectorAll('.billing-tab-btn').forEach(b => b.classList.remove('active'));
            newBtn.classList.add('active');
            loadBillingTerminal();
        });
    });

    const filteredMenu = activeCat === 'all' ? menuItems : menuItems.filter(i => i.category === activeCat);

    filteredMenu.forEach(item => {
        const card = document.createElement('div');
        card.className = 'billing-menu-card';
        const pricingText = item.priceHalf && item.priceFull
            ? `₹${item.priceHalf} - ₹${item.priceFull}`
            : `₹${item.price}`;
        card.innerHTML = `
            <img src="${item.img || 'images/steamed_momo.png'}" onerror="this.src='images/steamed_momo.png'">
            <h4>${item.name}</h4>
            <span>${pricingText}</span>
        `;
        card.addEventListener('click', () => {
            addToCart(item);
        });
        menuItemsGrid.appendChild(card);
    });

    renderCart();
}

// Staff Plate Size Selector elements and controller
const staffPlateSizeModal = document.getElementById('staff-plate-size-modal');
const staffPlateModalItemName = document.getElementById('staff-plate-modal-item-name');
const btnStaffSelectHalf = document.getElementById('btn-staff-select-half');
const btnStaffSelectFull = document.getElementById('btn-staff-select-full');
const staffPriceLabelHalf = document.getElementById('staff-price-label-half');
const staffPriceLabelFull = document.getElementById('staff-price-label-full');
const btnStaffCancelPlate = document.getElementById('btn-staff-cancel-plate');

let currentStaffPlateCallback = null;

function openStaffPlateSizeModal(item, callback) {
    if (!staffPlateSizeModal) return;
    staffPlateModalItemName.textContent = item.name;
    staffPriceLabelHalf.textContent = `₹${item.priceHalf}`;
    staffPriceLabelFull.textContent = `₹${item.priceFull}`;
    currentStaffPlateCallback = callback;
    staffPlateSizeModal.style.display = 'flex';
}

function closeStaffPlateSizeModal() {
    if (staffPlateSizeModal) staffPlateSizeModal.style.display = 'none';
    currentStaffPlateCallback = null;
}

if (btnStaffCancelPlate) btnStaffCancelPlate.addEventListener('click', closeStaffPlateSizeModal);
if (btnStaffSelectHalf) {
    btnStaffSelectHalf.onclick = () => {
        if (currentStaffPlateCallback) currentStaffPlateCallback('half');
        closeStaffPlateSizeModal();
    };
}
if (btnStaffSelectFull) {
    btnStaffSelectFull.onclick = () => {
        if (currentStaffPlateCallback) currentStaffPlateCallback('full');
        closeStaffPlateSizeModal();
    };
}

function addToCart(item, size = null) {
    if (item.category === 'steamed-fried' && !size) {
        openStaffPlateSizeModal(item, (selectedSize) => {
            addToCart(item, selectedSize);
        });
        return;
    }

    const cartItemId = size ? `${item.id}-${size}` : item.id;
    const displayName = size ? `${item.name} (${size === 'half' ? 'Half - 5 Pcs' : 'Full - 9 Pcs'})` : item.name;
    const displayPrice = size === 'half' ? item.priceHalf : (size === 'full' ? item.priceFull : item.price);

    const existing = selectedCart.find(c => c.id === cartItemId);
    if (existing) {
        existing.qty++;
    } else {
        selectedCart.push({
            id: cartItemId,
            menuId: item.id,
            name: displayName,
            price: displayPrice,
            qty: 1
        });
    }
    renderCart();
}

function adjustCartQty(itemId, amt) {
    const index = selectedCart.findIndex(c => c.id === itemId);
    if (index !== -1) {
        selectedCart[index].qty += amt;
        if (selectedCart[index].qty <= 0) {
            selectedCart.splice(index, 1);
        }
    }
    renderCart();
}

function renderCart() {
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    
    if (selectedCart.length === 0) {
        list.innerHTML = `
            <div class="cart-empty-state">
                <span>🛒</span>
                <p style="font-weight:700;">Cart is empty.</p>
                <p style="font-size:0.75rem; text-align:center;">Click items on the left to build order parchi</p>
            </div>
        `;
        document.getElementById('cart-subtotal').textContent = '₹0';
        document.getElementById('cart-grandtotal').textContent = '₹0';
        document.getElementById('btn-generate-parchi').disabled = true;
        return;
    }

    document.getElementById('btn-generate-parchi').disabled = false;
    let subtotal = 0;
    
    selectedCart.forEach(item => {
        subtotal += item.price * item.qty;
        
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>₹${item.price} &times; ${item.qty}</span>
            </div>
            <div class="cart-item-actions">
                <div class="qty-adjust">
                    <button class="btn-qty" onclick="adjustCartQty('${item.id}', -1)">&minus;</button>
                    <span style="font-weight:800; font-size:0.9rem;">${item.qty}</span>
                    <button class="btn-qty" onclick="adjustCartQty('${item.id}', 1)">&plus;</button>
                </div>
                <span class="font-bold" style="font-size:0.9rem; min-width:50px; text-align:right; margin: 0 10px 0 6px;">₹${item.price * item.qty}</span>
                <button class="btn-qty" onclick="adjustCartQty('${item.id}', -${item.qty})" style="background:#ffcdd2; color:#d32f2f; border-color:#e53935; font-size:1.1rem; width:22px; height:22px;" title="Remove Momo Plate">&times;</button>
            </div>
        `;
        list.appendChild(row);
    });

    document.getElementById('cart-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('cart-grandtotal').textContent = `₹${subtotal}`;

    // Hook Parchi counter click
    const btnParchi = document.getElementById('btn-generate-parchi');
    // Remove existing listener
    const newBtn = btnParchi.cloneNode(true);
    btnParchi.parentNode.replaceChild(newBtn, btnParchi);

    newBtn.addEventListener('click', () => {
        createOrderParchi(subtotal);
    });
}

function createOrderParchi(totalAmount) {
    const customer = document.getElementById('billing-customer-name').value.trim() || 'Walk-in Guest';
    const outletId = document.getElementById('billing-outlet-select').value;
    const outletObj = outletsList.find(o => o.id === outletId);
    const outletName = outletObj ? outletObj.name : 'Unknown Outlet';
    
    // Create new order record
    ordersList = JSON.parse(localStorage.getItem('momo_orders')) || [];
    
    // Find next order number
    const lastId = (ordersList.length > 0) ? ordersList[0].id : "ORD-1000";
    const lastNum = parseInt(lastId.replace('ORD-', '')) || 1000;
    const nextId = `ORD-${lastNum + 1}`;

    const orderDate = new Date();
    const dateStr = orderDate.toISOString().split('T')[0];
    const monthStr = dateStr.slice(0, 7);

    const newOrder = {
        id: nextId,
        customerName: customer,
        outletId: outletId,
        outletName: outletName,
        items: selectedCart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            total: item.price * item.qty
        })),
        totalAmount: totalAmount,
        status: "Pending", // Starts as pending, staff has to mark served
        timestamp: orderDate.getTime(),
        date: dateStr,
        month: monthStr,
        servedBy: ''
    };

    if (useFirebase && db) {
        set(ref(db, 'orders/' + nextId), newOrder);
    } else {
        ordersList.unshift(newOrder); // Add to beginning of queue
        localStorage.setItem('momo_orders', JSON.stringify(ordersList));
        window.dispatchEvent(new Event('storage'));
    }

    // Reset Billing cart
    selectedCart = [];
    document.getElementById('billing-customer-name').value = '';
    loadBillingTerminal();
    
    alert(`🎉 Parchi Generated Successfully!\nOrder ID: ${nextId}\nStatus: PENDING (Serve this order to complete billing)`);
}

// ===== 6. STAFF - PENDING ORDERS QUEUE & BILLING FULFILLMENT =====
function loadOrdersQueue() {
    const grid = document.getElementById('orders-queue-grid');
    if (!grid) return;

    ordersList = JSON.parse(localStorage.getItem('momo_orders')) || [];
    const pendingOrders = ordersList.filter(o => o.status === 'Pending');

    grid.innerHTML = '';
    if (pendingOrders.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:50px; border:3px dashed var(--text-charcoal); border-radius:12px; background:#fff; font-weight:700;">
            <p style="font-size:2rem; margin-bottom:8px;">🥟</p>
            <p>Sabhi orders serve ho chuke hain! No pending orders right now.</p>
        </div>`;
        return;
    }

    pendingOrders.forEach(order => {
        const dateObj = new Date(order.timestamp);
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const card = document.createElement('div');
        card.className = 'neo-card order-queue-card pending';
        
        let itemsHTML = '';
        order.items.forEach(item => {
            itemsHTML += `
                <div class="order-item-snippet">
                    <span>${item.qty} &times; ${item.name}</span>
                    <span>₹${item.total}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <div>
                <div class="order-card-header">
                    <div>
                        <span class="order-id-label">${order.id}</span>
                        <p class="order-timestamp">Time: ${timeStr} | ${order.customerName}</p>
                    </div>
                    <span class="neo-badge" style="background:#ffeaa7; font-size:0.6rem;">Pending</span>
                </div>
                <span class="order-outlet-label">📍 ${order.outletName}</span>
                <div class="order-items-list">
                    ${itemsHTML}
                </div>
            </div>
            <div class="order-card-footer">
                <div class="order-total-amount">₹${order.totalAmount}</div>
                <button class="neo-btn neo-btn-success" onclick="serveOrderFulfill('${order.id}')" style="padding:6px 14px; font-size:0.8rem; border-radius:6px; box-shadow:2px 2px 0 #000;">✔️ Serve & Bill</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.serveOrderFulfill = function(orderId) {
    ordersList = JSON.parse(localStorage.getItem('momo_orders')) || [];
    const index = ordersList.findIndex(o => o.id === orderId);
    
    if (index !== -1) {
        const completedOrder = {...ordersList[index]};
        completedOrder.status = 'Completed';
        completedOrder.servedBy = 'staff';
        completedOrder.timestamp = new Date().getTime(); // Update checkout time
        
        if (useFirebase && db) {
            set(ref(db, 'orders/' + orderId), completedOrder);
            showReceiptPopup(completedOrder);
        } else {
            ordersList[index] = completedOrder;
            localStorage.setItem('momo_orders', JSON.stringify(ordersList));
            showReceiptPopup(ordersList[index]);
            loadOrdersQueue();
            window.dispatchEvent(new Event('storage'));
        }
    }
};

function showReceiptPopup(order) {
    const overlay = document.getElementById('invoice-popup');
    
    // Set ticket date/details
    document.getElementById('inv-order-id').textContent = order.id;
    document.getElementById('inv-date').textContent = new Date(order.timestamp).toLocaleString();
    document.getElementById('inv-outlet').textContent = `${order.outletName} Branch`;
    document.getElementById('inv-customer').textContent = order.customerName;
    
    // Fill items
    const list = document.getElementById('inv-items-list');
    list.innerHTML = '';
    
    order.items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'invoice-item-row';
        row.innerHTML = `
            <span>${item.qty} x ${item.name}</span>
            <span>₹${item.total}</span>
        `;
        list.appendChild(row);
    });
    
    // Fill totals
    document.getElementById('inv-subtotal').textContent = `₹${order.totalAmount}`;
    document.getElementById('inv-total').textContent = `₹${order.totalAmount}`;
    
    overlay.classList.add('active');
}

// ===== GLOBAL BINDINGS FOR INLINE TRIGGERS =====
window.adjustCartQty = adjustCartQty;
window.addToCart = addToCart;
window.clearAllLogsData = clearAllLogsData;
window.downloadStatementCSV = downloadStatementCSV;

// ===== CROSS-TAB REAL-TIME SYNC =====
window.addEventListener('storage', (e) => {
    if (e.key === 'momo_orders') {
        ordersList = JSON.parse(localStorage.getItem('momo_orders')) || [];
        if (typeof loadAnalytics === 'function') loadAnalytics();
        if (typeof loadOrdersLog === 'function') loadOrdersLog();
        if (typeof loadOrdersQueue === 'function') loadOrdersQueue();
    }
    if (e.key === 'momo_outlets') {
        outletsList = JSON.parse(localStorage.getItem('momo_outlets')) || [];
        if (typeof loadOutletsManager === 'function') loadOutletsManager();
        if (typeof loadBillingTerminal === 'function') loadBillingTerminal();
    }
    if (e.key === 'momo_menu') {
        menuItems = JSON.parse(localStorage.getItem('momo_menu')) || [];
        if (typeof loadMenuManager === 'function') loadMenuManager();
        if (typeof loadBillingTerminal === 'function') loadBillingTerminal();
    }
});

// ===== PARTNER LOCK CONTROLLER =====
function loadPartnerLocks() {
    const isZomatoLocked = localStorage.getItem('momo_zomato_locked') === 'true';
    const isSwiggyLocked = localStorage.getItem('momo_swiggy_locked') === 'true';

    const zLabel = document.getElementById('zomato-lock-status');
    const zBtn = document.getElementById('btn-toggle-zomato-lock');
    const sLabel = document.getElementById('swiggy-lock-status');
    const sBtn = document.getElementById('btn-toggle-swiggy-lock');

    if (zLabel && zBtn) {
        if (isZomatoLocked) {
            zLabel.textContent = "Status: Locked 🔒 (Offline)";
            zLabel.style.color = "#d32f2f";
            zBtn.textContent = "🔓 Unlock";
            zBtn.style.background = "#ffcdd2";
            zBtn.style.borderColor = "#e53935";
            zBtn.style.color = "#d32f2f";
        } else {
            zLabel.textContent = "Status: Unlocked 🔓 (Active)";
            zLabel.style.color = "#2ecc71";
            zBtn.textContent = "🔒 Lock";
            zBtn.style.background = "white";
            zBtn.style.borderColor = "var(--text-charcoal)";
            zBtn.style.color = "var(--text-charcoal)";
        }
    }

    if (sLabel && sBtn) {
        if (isSwiggyLocked) {
            sLabel.textContent = "Status: Locked 🔒 (Offline)";
            sLabel.style.color = "#d32f2f";
            sBtn.textContent = "🔓 Unlock";
            sBtn.style.background = "#ffcdd2";
            sBtn.style.borderColor = "#e53935";
            sBtn.style.color = "#d32f2f";
        } else {
            sLabel.textContent = "Status: Unlocked 🔓 (Active)";
            sLabel.style.color = "#2ecc71";
            sBtn.textContent = "🔒 Lock";
            sBtn.style.background = "white";
            sBtn.style.borderColor = "var(--text-charcoal)";
            sBtn.style.color = "var(--text-charcoal)";
        }
    }
}

function setupPartnerLockListeners() {
    const zBtn = document.getElementById('btn-toggle-zomato-lock');
    const sBtn = document.getElementById('btn-toggle-swiggy-lock');

    if (zBtn) {
        zBtn.addEventListener('click', () => {
            const current = localStorage.getItem('momo_zomato_locked') === 'true';
            const nextVal = !current;
            if (useFirebase && db) {
                set(ref(db, 'settings/zomatoLocked'), nextVal);
            } else {
                localStorage.setItem('momo_zomato_locked', nextVal);
                loadPartnerLocks();
                window.dispatchEvent(new Event('storage'));
            }
        });
    }

    if (sBtn) {
        sBtn.addEventListener('click', () => {
            const current = localStorage.getItem('momo_swiggy_locked') === 'true';
            const nextVal = !current;
            if (useFirebase && db) {
                set(ref(db, 'settings/swiggyLocked'), nextVal);
            } else {
                localStorage.setItem('momo_swiggy_locked', nextVal);
                loadPartnerLocks();
                window.dispatchEvent(new Event('storage'));
            }
        });
    }
}

// ===== SHOP LOCK CONTROLLER (DUKAN BAND) =====
function loadShopLock() {
    const isShopLocked = localStorage.getItem('momo_shop_closed') === 'true';
    const sLabel = document.getElementById('shop-lock-status');
    const sBtn = document.getElementById('btn-toggle-shop-lock');

    if (sLabel && sBtn) {
        if (isShopLocked) {
            sLabel.innerHTML = "Status: Closed 🔴 (Dukan Band)";
            sLabel.style.color = "#d32f2f";
            sBtn.textContent = "🟢 Open Shop";
            sBtn.style.background = "#ffcdd2";
            sBtn.style.borderColor = "#e53935";
            sBtn.style.color = "#d32f2f";
        } else {
            sLabel.innerHTML = "Status: Open 🟢 (Accepting Orders)";
            sLabel.style.color = "#2ecc71";
            sBtn.textContent = "🔴 Close Shop";
            sBtn.style.background = "white";
            sBtn.style.borderColor = "var(--text-charcoal)";
            sBtn.style.color = "var(--text-charcoal)";
        }
    }
}

function setupShopLockListeners() {
    const sBtn = document.getElementById('btn-toggle-shop-lock');
    if (sBtn) {
        sBtn.addEventListener('click', () => {
            const current = localStorage.getItem('momo_shop_closed') === 'true';
            const nextVal = !current;
            if (useFirebase && db) {
                set(ref(db, 'settings/shopClosed'), nextVal);
            } else {
                localStorage.setItem('momo_shop_closed', nextVal);
                loadShopLock();
                window.dispatchEvent(new Event('storage'));
            }
        });
    }
}

// ===== MENU OUT OF STOCK TOGGLE =====
window.toggleMomoStock = function(itemId, outOfStock) {
    if (useFirebase && db) {
        set(ref(db, 'menu/' + itemId + '/outOfStock'), outOfStock);
    } else {
        menuItems = JSON.parse(localStorage.getItem('momo_menu')) || defaultMenu;
        const index = menuItems.findIndex(i => i.id === itemId);
        if (index !== -1) {
            menuItems[index].outOfStock = outOfStock;
            localStorage.setItem('momo_menu', JSON.stringify(menuItems));
            loadMenuManager();
            window.dispatchEvent(new Event('storage'));
        }
    }
};

// ===== 6. STAFF - SOCIAL WALL MANAGEMENT =====
function loadSocialWallManager() {
    const tbody = document.getElementById('social-wall-tbody');
    if (!tbody) return;

    socialPosts = JSON.parse(localStorage.getItem('momo_social_posts')) || defaultSocialPosts;
    tbody.innerHTML = '';

    socialPosts.forEach(post => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${post.img}" onerror="this.src='social media/steamed_momo.png'" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;"></td>
            <td style="font-weight: 800; text-transform: uppercase; font-size: 0.8rem; color: var(--primary-color);">${post.platform} ${post.sticker ? '(' + post.sticker + ')' : ''}</td>
            <td style="font-size: 0.8rem; max-width: 280px; color: var(--text-charcoal); line-height: 1.4;">${post.caption}</td>
            <td>
                <button class="neo-btn action-btn-sm" onclick="deleteSocialPost('${post.id}')" style="background:#ffcdd2; color:#d32f2f;">🗑️ Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function saveSocialPost() {
    const caption = document.getElementById('social-post-caption').value.trim();
    const platform = document.getElementById('social-post-platform').value;
    const sticker = document.getElementById('social-post-sticker').value;
    const presetImg = document.getElementById('social-post-img-preset').value;

    const finalImg = uploadedSocialImgBase64 || presetImg || 'social media/steamed_momo.png';

    if (!caption) {
        alert('Please enter a caption.');
        return;
    }

    // Determine stickerClass
    let stickerClass = '';
    if (sticker) {
        stickerClass = Math.random() > 0.5 ? 'sticker-1' : 'sticker-2';
    }

    // Load active posts
    socialPosts = JSON.parse(localStorage.getItem('momo_social_posts')) || defaultSocialPosts;
    
    // Generate new ID
    const newId = (socialPosts.length > 0) ? (Math.max(...socialPosts.map(p => parseInt(p.id) || 0)) + 1).toString() : "1";

    const newPost = {
        id: newId,
        img: finalImg,
        caption: caption,
        platform: platform,
        sticker: sticker,
        stickerClass: stickerClass
    };

    socialPosts.push(newPost);
    localStorage.setItem('momo_social_posts', JSON.stringify(socialPosts));

    // Sync to Firebase if enabled
    if (useFirebase && db) {
        const postsData = {};
        socialPosts.forEach(post => {
            postsData[post.id] = post;
        });
        set(ref(db, 'social_posts'), postsData);
    } else {
        loadSocialWallManager();
        window.dispatchEvent(new Event('storage'));
    }

    // Reset Form & Preview
    document.getElementById('social-post-form').reset();
    uploadedSocialImgBase64 = '';
    const previewImg = document.getElementById('social-post-img-preview');
    if (previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none';
    }
}

window.deleteSocialPost = function(postId) {
    if (confirm('Are you sure you want to delete this social wall post? It will disappear from the main website.')) {
        socialPosts = JSON.parse(localStorage.getItem('momo_social_posts')) || defaultSocialPosts;
        socialPosts = socialPosts.filter(post => post.id !== postId);
        localStorage.setItem('momo_social_posts', JSON.stringify(socialPosts));

        // Sync to Firebase if enabled
        if (useFirebase && db) {
            set(ref(db, 'social_posts/' + postId), null);
        } else {
            loadSocialWallManager();
            window.dispatchEvent(new Event('storage'));
        }
    }
};
