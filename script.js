
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

let db = null;
let useFirebase = false;

// Check if production keys are set in firebase-config.js
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY" && !firebaseConfig.apiKey.includes("YOUR_")) {
    try {
        const app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        useFirebase = true;
        console.log("🔥 Firebase initialized successfully on Customer Website!");
    } catch (e) {
        console.warn("⚠️ Firebase failed to initialize. Using localStorage mode instead.", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // 1. HEADER SCROLL STATE & SCROLL PROGRESS BAR
    const header = document.querySelector('.site-header');
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Toggle header height/blur on scroll
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Calculate scroll progress percentage
        if (scrollProgress) {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (windowHeight > 0) {
                const scrolledPercentage = (window.scrollY / windowHeight) * 100;
                scrollProgress.style.width = scrolledPercentage + '%';
            }
        }
    });

    // 2. MOBILE NAVIGATION DRAWER
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('mobile-nav-active');
        });
    }

    // Close menu when clicking navigation links
    if (navMenu) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navToggle) navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('mobile-nav-active');
            });
        });
    }

    // 3. SOCIAL WALL DEFAULT DATA
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

    // 3. MENU DYNAMIC LOADING & CATEGORY FILTERING WITH TRANSITIONS
    const defaultMenu = [
        {
            id: "1",
            name: "Classic Vegetable Momo",
            priceHalf: 60,
            priceFull: 80,
            price: 60,
            desc: "Classic hand-folded steamed momos filled with fresh garden vegetables and mild herbs, served with spicy red chutney.",
            category: "steamed-fried",
            spice: 1,
            spiceText: "Mild Spicy",
            badge: "Classic",
            badgeClass: "badge-steamed",
            img: "images/steamed_momo.png"
        },
        {
            id: "2",
            name: "Paneer & Cheese Momo",
            priceHalf: 80,
            priceFull: 100,
            price: 80,
            desc: "Rich paneer and gooey cheese combined inside a soft wrapper, steamed to melt-in-the-mouth perfection.",
            category: "steamed-fried",
            spice: 1,
            spiceText: "Creamy & Mild",
            badge: "Classic",
            badgeClass: "badge-steamed",
            img: "images/steamed_momo.png"
        },
        {
            id: "3",
            name: "Soya Momo",
            priceHalf: 50,
            priceFull: 70,
            price: 50,
            desc: "Soft steamed momos packed with protein-rich soya chunks, finely chopped vegetables, and aromatic spices.",
            category: "steamed-fried",
            spice: 1,
            spiceText: "Mild Spicy",
            badge: "Classic",
            badgeClass: "badge-steamed",
            img: "images/steamed_momo.png"
        },
        {
            id: "4",
            name: "Paneer Momo",
            priceHalf: 70,
            priceFull: 90,
            price: 70,
            desc: "Delicate steamed wrappers loaded with spiced cottage cheese stuffing, a true classic comfort food.",
            category: "steamed-fried",
            spice: 1,
            spiceText: "Mild Spicy",
            badge: "Classic",
            badgeClass: "badge-steamed",
            img: "images/steamed_momo.png"
        },
        {
            id: "5",
            name: "Cheese Corn Momo",
            priceHalf: 80,
            priceFull: 100,
            price: 80,
            desc: "Sweet corn kernels and melted mozzarella cheese, creating a delicious creamy sweet-savory blend.",
            category: "steamed-fried",
            spice: 1,
            spiceText: "Creamy & Mild",
            badge: "Classic",
            badgeClass: "badge-steamed",
            img: "images/steamed_momo.png"
        },
        {
            id: "6",
            name: "Classic Vegetable Fried",
            priceHalf: 70,
            priceFull: 90,
            price: 70,
            desc: "Crispy deep-fried momos packed with vegetables, perfect for that crunchy evening craving.",
            category: "steamed-fried",
            spice: 1,
            spiceText: "Mild Spicy",
            badge: "Crispy",
            badgeClass: "badge-kurkure",
            img: "images/steamed_momo.png"
        },
        {
            id: "7",
            name: "Paneer & Cheese Fried",
            priceHalf: 90,
            priceFull: 110,
            price: 90,
            desc: "Crispy fried momos filled with premium paneer and melted cheese, served with mayonnaise and red chutney.",
            category: "steamed-fried",
            spice: 1,
            spiceText: "Creamy & Rich",
            badge: "Crispy",
            badgeClass: "badge-kurkure",
            img: "images/steamed_momo.png"
        },
        {
            id: "8",
            name: "Soya Fried Momo",
            priceHalf: 60,
            priceFull: 80,
            price: 60,
            desc: "Deep-fried golden momos stuffed with spiced soya mince and fresh green onions.",
            category: "steamed-fried",
            spice: 1,
            spiceText: "Mild Spicy",
            badge: "Crispy",
            badgeClass: "badge-kurkure",
            img: "images/steamed_momo.png"
        },
        {
            id: "9",
            name: "Paneer Fried Momo",
            priceHalf: 80,
            priceFull: 100,
            price: 80,
            desc: "Juicy cottage cheese stuffed momos fried to golden perfection, crispy on the outside and soft inside.",
            category: "steamed-fried",
            spice: 1,
            spiceText: "Mild Spicy",
            badge: "Crispy",
            badgeClass: "badge-kurkure",
            img: "images/steamed_momo.png"
        },
        {
            id: "10",
            name: "Cheese Corn Fried Momo",
            priceHalf: 90,
            priceFull: 110,
            price: 90,
            desc: "Golden fried crispy pocket momos overflowing with corn and piping hot melted cheese.",
            category: "steamed-fried",
            spice: 1,
            spiceText: "Creamy & Sweet",
            badge: "Crispy",
            badgeClass: "badge-kurkure",
            img: "images/steamed_momo.png"
        },
        {
            id: "11",
            name: "Classic Vegitables KurKure Momo",
            price: 90,
            desc: "Jaipur's special cornflake-crusted crispy kurkure momos stuffed with fresh chopped veggies.",
            category: "kurkure",
            spice: 2,
            spiceText: "Medium Spicy",
            badge: "Crunchy",
            badgeClass: "badge-kurkure",
            img: "images/kurkure_momo.png"
        },
        {
            id: "12",
            name: "Paneer Kurkure Momo",
            price: 110,
            desc: "Crunchy double-fried momos with a crispy outer coating and a rich paneer filling.",
            category: "kurkure",
            spice: 2,
            spiceText: "Medium Spicy",
            badge: "Crunchy",
            badgeClass: "badge-kurkure",
            img: "images/kurkure_momo.png"
        },
        {
            id: "13",
            name: "Paneer & Cheese Kurkure Momo",
            price: 120,
            desc: "Extra crunchy shell packed with rich paneer and cream cheese, a true crowd-pleaser.",
            category: "kurkure",
            spice: 2,
            spiceText: "Creamy Crunchy",
            badge: "Crunchy",
            badgeClass: "badge-kurkure",
            img: "images/kurkure_momo.png"
        },
        {
            id: "14",
            name: "Chessy & Corn Kurkure Momo",
            price: 130,
            desc: "Crispy, crunchy cornflakes coating outside, oozing with hot cheese and sweet corn inside.",
            category: "kurkure",
            spice: 2,
            spiceText: "Creamy Crunchy",
            badge: "Crunchy",
            badgeClass: "badge-kurkure",
            img: "images/kurkure_momo.png"
        },
        {
            id: "15",
            name: "Vegitables Spring Roll",
            price: 90,
            desc: "Crispy wrappers rolled with stir-fried Chinese vegetables and glass noodles, deep fried.",
            category: "spring-rolls",
            spice: 1,
            spiceText: "Mild Spicy",
            badge: "Fresh",
            badgeClass: "badge-steamed",
            img: "images/kurkure_momo.png"
        },
        {
            id: "16",
            name: "Paneer Spring Roll",
            price: 120,
            desc: "Golden crispy spring rolls stuffed with spiced scrambled paneer and spring vegetables.",
            category: "spring-rolls",
            spice: 1,
            spiceText: "Mild Spicy",
            badge: "Fresh",
            badgeClass: "badge-steamed",
            img: "images/kurkure_momo.png"
        },
        {
            id: "17",
            name: "Mexican Cheese Spring Roll",
            price: 130,
            desc: "Fusion spring rolls stuffed with jalapenos, corn, capsicum, and loaded with Mexican cheese blend.",
            category: "spring-rolls",
            spice: 2,
            spiceText: "Medium Spicy",
            badge: "Spicy",
            badgeClass: "badge-spicy",
            img: "images/kurkure_momo.png"
        },
        {
            id: "18",
            name: "Tandori Dip",
            price: 40,
            desc: "Spicy and smoky tandoori dip, perfect sidekick for steamed and fried momos.",
            category: "dips",
            spice: 2,
            spiceText: "Smoky Spicy",
            badge: "Sides",
            badgeClass: "badge-tandoori",
            img: "images/tandoori_momo.png"
        },
        {
            id: "19",
            name: "Makhni Dip",
            price: 50,
            desc: "Rich, buttery, Punjabi-style makhni dip made with tomatoes, fresh cream, and fenugreek.",
            category: "dips",
            spice: 1,
            spiceText: "Sweet & Mild",
            badge: "Sides",
            badgeClass: "badge-gravy",
            img: "images/makhni_momo.png"
        },
        {
            id: "20",
            name: "Afghani Dip",
            price: 50,
            desc: "Mildly sweet and rich creamy dip made with ground cashews, fresh cheese, and cream.",
            category: "dips",
            spice: 1,
            spiceText: "Sweet & Creamy",
            badge: "Sides",
            badgeClass: "badge-afghan",
            img: "images/afghani_momo.png"
        },
        {
            id: "21",
            name: "Jhol Momo with Indian Taste",
            price: 130,
            desc: "Our signature hot steamed momos floating in a rich, tangy, and flavorful tomato-sesame Jhol soup with Indian spices.",
            category: "speciality",
            spice: 2,
            spiceText: "Spicy Jhol",
            badge: "Special",
            badgeClass: "badge-tandoori",
            img: "images/makhni_momo.png"
        }
    ];

    function renderMenu() {
        const menuGrid = document.getElementById('menu-grid');
        if (!menuGrid) return;

        let menu = JSON.parse(localStorage.getItem('momo_menu'));
        // Force refresh if the menu has the old structure or items are missing
        if (!menu || menu.some(item => item.name === "Royal Steamed Veg Momos") || menu.length < 21) {
            menu = defaultMenu;
            localStorage.setItem('momo_menu', JSON.stringify(menu));
        }

        menuGrid.innerHTML = '';
        menu.forEach(item => {
            const itemEl = document.createElement('div');
            const isOutOfStock = item.outOfStock === true;
            itemEl.className = `menu-item ${item.category} ${isOutOfStock ? 'out-of-stock' : ''}`;
            itemEl.setAttribute('data-spice', item.spice);

            const chillies = '🌶️'.repeat(item.spice);
            
            // Define stock status badge text
            const badgeText = isOutOfStock ? 'स्टॉक समाप्त 🔴' : (item.badge || 'New');
            const badgeClass = isOutOfStock ? 'badge-out-of-stock' : (item.badgeClass || 'badge-steamed');

            const priceDisplay = item.priceHalf && item.priceFull 
                ? `₹${item.priceHalf} - ₹${item.priceFull}`
                : `₹${item.price}`;

            itemEl.innerHTML = `
                <div class="menu-item-img" style="background-image: url('${item.img || 'images/steamed_momo.png'}');">
                    <span class="menu-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-header">
                        <h3 class="menu-item-name">${item.name}</h3>
                        <span class="menu-item-price">${priceDisplay}</span>
                    </div>
                    <div class="menu-item-footer">
                        <span class="spice-level">${chillies} <span class="spice-text">${item.spiceText || 'Medium'}</span></span>
                        <div class="item-order-btns">
                            <a href="https://www.zomato.com" target="_blank" rel="noopener noreferrer" class="item-zomato-btn" title="Order on Zomato">Z</a>
                            <a href="https://www.swiggy.com" target="_blank" rel="noopener noreferrer" class="item-swiggy-btn" title="Order on Swiggy">S</a>
                        </div>
                    </div>
                    <div class="menu-item-actions">
                        ${isOutOfStock 
                            ? `<button class="btn-add-cart btn-out-of-stock" disabled>Stock Khatam</button>
                               <button class="btn-order-now btn-out-of-stock" disabled>Out of Stock</button>`
                            : `<button class="btn-add-cart" data-id="${item.id}">🛒 Add to Cart</button>
                               <button class="btn-order-now" data-id="${item.id}">⚡ Order Now</button>`
                        }
                    </div>
                </div>
            `;
            menuGrid.appendChild(itemEl);
        });

        // Initialize Menu item transition styles
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease';
        });

        // Apply Zomato/Swiggy Lock classes to newly created buttons
        if (typeof updatePartnerLocksUI === 'function') {
            updatePartnerLocksUI();
        }
    }

    function renderSocialWall() {
        const socialTrack = document.getElementById('social-track');
        if (!socialTrack) return;

        let posts = JSON.parse(localStorage.getItem('momo_social_posts'));
        if (!posts) {
            posts = defaultSocialPosts;
            localStorage.setItem('momo_social_posts', JSON.stringify(posts));
        }

        socialTrack.innerHTML = '';
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'social-card';
            
            const stickerHtml = post.sticker 
                ? `<div class="momo-sticker ${post.stickerClass || 'sticker-1'}">${post.sticker}</div>`
                : '';

            card.innerHTML = `
                <div class="social-img" style="background-image: url('${post.img}');"></div>
                <div class="social-content">
                    <p>${post.caption}</p>
                </div>
                ${stickerHtml}
            `;
            socialTrack.appendChild(card);
        });
    }

    // Render menu items first
    renderMenu();
    renderSocialWall();

    // Attach Category Filter Listener
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            const menuItems = document.querySelectorAll('.menu-item');

            menuItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.85) translateY(15px)';

                setTimeout(() => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'flex';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // 4. INTERACTIVE BRANCH DETAILS PANEL DATA SWITCHING (DYNAMIC)
    const defaultOutlets = [
        {
            id: 'mansarovar',
            name: 'Mansarovar',
            tag: 'मुख्य शाखा (Main Branch)',
            badge: 'Main Branch',
            badgeClass: 'main-badge',
            address: 'Plot 42, Ward 27, Main Vijay Path Crossing, Mansarovar, Jaipur - 302020',
            phone: '+91 98290 12345, +91 141 278940',
            hours: '6:00 PM - 11:00 PM (Everyday)',
            features: 'Outdoor Sitting, Live Tandoor Charcoal Grill, Free Parking, Cozy Vibes.',
            mapUrl: 'https://maps.google.com/?q=Vijay+Path+Mansarovar+Jaipur',
            status: 'Open'
        },
        {
            id: 'vijay-path',
            name: 'Vijay Path',
            tag: 'लोकप्रिय स्थान (Trending Spot)',
            badge: 'Trending',
            badgeClass: '',
            address: 'Shop 12, Sector 5 Shopping Complex, Vijay Path Road, Mansarovar, Jaipur - 302018',
            phone: '+91 98290 12346',
            hours: '6:00 PM - 11:00 PM (Everyday)',
            features: 'Jaipuri Kurkure Momo Specialty, Quick Service Counter, Standing Tables.',
            mapUrl: 'https://maps.google.com/?q=Sector+5+Vijay+Path+Jaipur',
            status: 'Open'
        }
    ];

    function renderOutlets() {
        const branchesList = document.querySelector('.branches-list');
        const branchDetailsWindow = document.getElementById('branch-details');
        if (!branchesList) return;

        let outlets = JSON.parse(localStorage.getItem('momo_outlets'));
        if (!outlets) {
            outlets = defaultOutlets;
            localStorage.setItem('momo_outlets', JSON.stringify(outlets));
        }

        branchesList.innerHTML = '';
        outlets.forEach((outlet, index) => {
            const activeClass = index === 0 ? 'active' : '';
            const badgeClass = outlet.badgeClass ? outlet.badgeClass : '';
            const isClosed = outlet.status === 'Closed';
            const badgeText = isClosed ? 'OFF TODAY 🔴' : (outlet.badge ? outlet.badge : 'Outlet');

            const card = document.createElement('div');
            card.className = `branch-card-select ${activeClass}`;
            if (isClosed) {
                card.style.opacity = '0.75';
                card.style.borderColor = '#ef5350';
            }
            card.setAttribute('data-branch', outlet.id);
            card.innerHTML = `
                <div class="branch-card-meta">
                    <span class="branch-badge ${badgeClass}" style="${isClosed ? 'background-color: #ef5350 !important; color: white !important; border-color: #ef5350 !important;' : ''}">${badgeText}</span>
                    <h3>${outlet.name}</h3>
                    <p>${outlet.address.split(',').slice(0, 2).join(',')}</p>
                </div>
                <span class="select-indicator">➔</span>
            `;
            branchesList.appendChild(card);
        });

        // Click handler to load info
        const branchCards = document.querySelectorAll('.branch-card-select');
        branchCards.forEach(card => {
            card.addEventListener('click', () => {
                branchCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                const branchKey = card.getAttribute('data-branch');
                const outletsList = JSON.parse(localStorage.getItem('momo_outlets')) || defaultOutlets;
                const data = outletsList.find(o => o.id === branchKey);

                if (data && branchDetailsWindow) {
                    branchDetailsWindow.style.opacity = '0';
                    branchDetailsWindow.style.transform = 'translateY(10px)';

                    const isClosed = data.status === 'Closed';
                    const statusText = isClosed ? 'Closed Today' : 'Open Now';
                    const statusClass = isClosed ? 'closed' : 'open';
                    const statusStyle = isClosed ? 'background:#ffcdd2; color:#d32f2f; border-color:#e53935; box-shadow:2px 2px 0 #e53935;' : '';

                    setTimeout(() => {
                        branchDetailsWindow.innerHTML = `
                            <div class="branch-detail-card">
                                <div class="detail-header">
                                    <div class="detail-title-wrap">
                                        <span class="detail-tag font-yatra font-bold text-terracotta" style="color: var(--primary-color);">${data.tag || 'शाखा (Outlet)'}</span>
                                        <h2>${data.name} Outlet</h2>
                                    </div>
                                    <span class="status-indicator ${statusClass}" style="${statusStyle}">${statusText}</span>
                                </div>
                                <div class="detail-body">
                                    <div class="detail-info-row">
                                        <span class="info-icon">📍</span>
                                        <div>
                                            <h4>Address</h4>
                                            <p>${data.address}</p>
                                        </div>
                                    </div>
                                    <div class="detail-info-row">
                                        <span class="info-icon">📞</span>
                                        <div>
                                            <h4>Phone Contact</h4>
                                            <p>${data.phone}</p>
                                        </div>
                                    </div>
                                    <div class="detail-info-row">
                                        <span class="info-icon">⏰</span>
                                        <div>
                                            <h4>Operating Hours</h4>
                                            <p>${data.hours}</p>
                                        </div>
                                    </div>
                                    <div class="detail-info-row">
                                        <span class="info-icon">✨</span>
                                        <div>
                                            <h4>Special Features</h4>
                                            <p>${data.features}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-footer">
                                    <a href="${data.mapUrl || 'https://maps.google.com'}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Get Directions ➔</a>
                                    ${isClosed 
                                        ? `<button class="btn btn-primary" style="background:#888!important; border-color:#555!important; cursor:not-allowed;" disabled>🚫 Outlet Closed Today</button>`
                                        : `<a href="#menu" class="btn btn-primary">Order From ${data.name}</a>`
                                    }
                                </div>
                            </div>
                        `;
                        branchDetailsWindow.style.opacity = '1';
                        branchDetailsWindow.style.transform = 'translateY(0)';
                    }, 200);
                }
            });
        });

        // Initialize with first outlet details
        if (outlets.length > 0 && branchDetailsWindow) {
            const data = outlets[0];
            const isClosed = data.status === 'Closed';
            const statusText = isClosed ? 'Closed Today' : 'Open Now';
            const statusClass = isClosed ? 'closed' : 'open';
            const statusStyle = isClosed ? 'background:#ffcdd2; color:#d32f2f; border-color:#e53935; box-shadow:2px 2px 0 #e53935;' : '';

            branchDetailsWindow.innerHTML = `
                <div class="branch-detail-card">
                    <div class="detail-header">
                        <div class="detail-title-wrap">
                            <span class="detail-tag font-yatra font-bold text-terracotta" style="color: var(--primary-color);">${data.tag || 'शाखा (Outlet)'}</span>
                            <h2>${data.name} Outlet</h2>
                        </div>
                        <span class="status-indicator ${statusClass}" style="${statusStyle}">${statusText}</span>
                    </div>
                    <div class="detail-body">
                        <div class="detail-info-row">
                            <span class="info-icon">📍</span>
                            <div>
                                <h4>Address</h4>
                                <p>${data.address}</p>
                            </div>
                        </div>
                        <div class="detail-info-row">
                            <span class="info-icon">📞</span>
                            <div>
                                <h4>Phone Contact</h4>
                                <p>${data.phone}</p>
                            </div>
                        </div>
                        <div class="detail-info-row">
                            <span class="info-icon">⏰</span>
                            <div>
                                <h4>Operating Hours</h4>
                                <p>${data.hours}</p>
                            </div>
                        </div>
                        <div class="detail-info-row">
                            <span class="info-icon">✨</span>
                            <div>
                                <h4>Special Features</h4>
                                <p>${data.features}</p>
                            </div>
                        </div>
                    </div>
                    <div class="detail-footer">
                        <a href="${data.mapUrl || 'https://maps.google.com'}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Get Directions ➔</a>
                        ${isClosed 
                            ? `<button class="btn btn-primary" style="background:#888!important; border-color:#555!important; cursor:not-allowed;" disabled>🚫 Outlet Closed Today</button>`
                            : `<a href="#menu" class="btn btn-primary">Order From ${data.name}</a>`
                        }
                    </div>
                </div>
            `;
        }

        if (branchDetailsWindow) {
            branchDetailsWindow.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        }
    }

    // Render branch list
    renderOutlets();

    // 5. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load to show elements already in viewport

    // 6. TRACK ACTIVE NAVIGATION LINK BASED ON SCROLL POSITION
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        if (navLinks && navLinks.length > 0) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === currentSection) {
                    link.classList.add('active');
                }
            });
        }
    });



    // 8. HANDLE APP DEEP LINK CLICK HINT
    // Standard Swiggy / Zomato links open the mobile web interface which automatically handles redirection to the native application if installed.
    const appButtons = document.querySelectorAll('.zomato-btn, .swiggy-btn, .option-btn, .item-zomato-btn, .item-swiggy-btn, .partner-btn');
    appButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log(`Redirecting user to deep link/store URL... Opening application gateway for ${btn.classList.contains('zomato-btn') || btn.classList.contains('item-zomato-btn') || btn.classList.contains('zomato-color') || btn.classList.contains('zomato-partner') ? 'Zomato' : 'Swiggy'}`);
        });
    });

    // 8. SCROLL JACKING FOR SOCIAL MEDIA SECTION
    const socialSection = document.getElementById('social');
    const socialTrack = document.getElementById('social-track');
    
    if (socialSection && socialTrack) {
        window.addEventListener('scroll', () => {
            const rect = socialSection.getBoundingClientRect();
            const maxScroll = socialSection.scrollHeight - window.innerHeight;
            
            // Check if sticky section is active
            if (rect.top <= 0 && maxScroll > 0) {
                // Determine how much is scrolled
                let currentScroll = Math.abs(rect.top);
                // Clamp it to maxScroll
                if (currentScroll > maxScroll) currentScroll = maxScroll;
                
                const scrollPercentage = currentScroll / maxScroll;
                const maxTranslate = socialTrack.scrollWidth - window.innerWidth;
                
                // Apply horizontal translation
                const translateX = scrollPercentage * maxTranslate;
                socialTrack.style.transform = `translateX(-${translateX}px)`;
            } else if (rect.top > 0) {
                // Above the section
                socialTrack.style.transform = `translateX(0)`;
            }
        });
    }

    // 9. CUSTOM BOX BUILDER LOGIC
    const boxDisplay = document.getElementById('box-display');
    const builderStatus = document.getElementById('builder-status');
    const builderPrice = document.getElementById('builder-price');
    const btnResetBox = document.getElementById('btn-reset-box');
    const sizeBtns = document.querySelectorAll('.size-btn');
    const addButtons = document.querySelectorAll('.add-momo-btn');
    
    let boxSize = 6;
    let selectedMomos = [];
    
    function initBoxSlots() {
        if (!boxDisplay) return;
        boxDisplay.innerHTML = '';
        if (boxSize === 12) {
            boxDisplay.classList.add('size-12');
            boxDisplay.classList.remove('size-6');
        } else {
            boxDisplay.classList.add('size-6');
            boxDisplay.classList.remove('size-12');
        }
        for (let i = 0; i < boxSize; i++) {
            const slot = document.createElement('div');
            slot.classList.add('box-slot');
            slot.setAttribute('data-slot', i);
            boxDisplay.appendChild(slot);
        }
        updateStatus();
    }
    
    function updateStatus() {
        if (!builderStatus || !builderPrice) return;
        const count = selectedMomos.length;
        if (count === 0) {
            builderStatus.textContent = `Box Empty (0/${boxSize} Pieces)`;
        } else if (count < boxSize) {
            builderStatus.textContent = `Box Filled (${count}/${boxSize} Pieces)`;
        } else {
            builderStatus.textContent = `Box Full! (${count}/${boxSize} Pieces)`;
        }
        
        let totalPrice = selectedMomos.reduce((sum, item) => sum + item.price, 0);
        builderPrice.textContent = `₹${totalPrice}`;
    }
    
    if (sizeBtns) {
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                boxSize = parseInt(btn.getAttribute('data-size'));
                selectedMomos = [];
                initBoxSlots();
            });
        });
    }
    
    if (addButtons) {
        addButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (selectedMomos.length >= boxSize) {
                    alert("Your box is already full! Reset or change size to add more.");
                    return;
                }
                const parent = btn.closest('.flavor-item');
                const flavor = parent.getAttribute('data-flavor');
                const img = parent.getAttribute('data-img');
                const price = parseInt(parent.getAttribute('data-price'));
                
                selectedMomos.push({ flavor, img, price });
                
                // Update visual slot
                const slotIdx = selectedMomos.length - 1;
                const slotEl = boxDisplay.querySelector(`[data-slot="${slotIdx}"]`);
                if (slotEl) {
                    slotEl.classList.add('filled');
                    slotEl.innerHTML = `<img src="${img}" alt="${flavor}">`;
                }
                
                updateStatus();
            });
        });
    }
    
    if (btnResetBox) {
        btnResetBox.addEventListener('click', () => {
            selectedMomos = [];
            const slots = boxDisplay.querySelectorAll('.box-slot');
            slots.forEach(slot => {
                slot.classList.remove('filled');
                slot.innerHTML = '';
            });
            updateStatus();
        });
    }
    
    // Initialize Box Slots
    initBoxSlots();

    // 10. MOMO SPIN WHEEL LOGIC
    const wheelCanvas = document.getElementById('wheel-canvas');
    const btnSpinWheel = document.getElementById('btn-spin-wheel');
    const couponResult = document.getElementById('coupon-result');
    const couponCodeVal = document.getElementById('coupon-code-val');
    
    if (wheelCanvas) {
        const ctx = wheelCanvas.getContext('2d');
        const prizes = [
            { text: "FREE CHUTNEY", color: "#FF6B00", textColor: "#FFF8F0", code: "FREECHUTNEY" },
            { text: "10% DISCOUNT", color: "#EBB63C", textColor: "#1E1A1A", code: "MOMOLOVE10" },
            { text: "BUY 1 GET 1", color: "#D15F7D", textColor: "#FFF8F0", code: "BOGOBOX" },
            { text: "FREE KURKURE", color: "#FFF8F0", textColor: "#1E1A1A", code: "CRUNCHYFREE" },
            { text: "20% DISCOUNT", color: "#376F53", textColor: "#FFF8F0", code: "ROYAL20" },
            { text: "FREE DRINK", color: "#F3ECE1", textColor: "#1E1A1A", code: "MOMODRINK" }
        ];
        
        let isSpinning = false;
        let currentRotation = 0;
        
        function drawWheel() {
            const numSlices = prizes.length;
            const arc = 2 * Math.PI / numSlices;
            ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
            
            // Draw outer border outline
            ctx.strokeStyle = "#1E1A1A";
            ctx.lineWidth = 10;
            
            for (let i = 0; i < numSlices; i++) {
                const angle = i * arc;
                ctx.fillStyle = prizes[i].color;
                
                ctx.beginPath();
                ctx.moveTo(250, 250);
                ctx.arc(250, 250, 240, angle, angle + arc);
                ctx.lineTo(250, 250);
                ctx.fill();
                ctx.stroke();
                
                // Draw text label
                ctx.save();
                ctx.translate(250, 250);
                ctx.rotate(angle + arc / 2);
                ctx.fillStyle = prizes[i].textColor || "#1E1A1A";
                ctx.font = "bold 16px Poppins";
                ctx.textAlign = "right";
                ctx.fillText(prizes[i].text, 220, 6);
                ctx.restore();
            }
            
            // Draw central hub pin
            ctx.fillStyle = "#1E1A1A";
            ctx.beginPath();
            ctx.arc(250, 250, 24, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#EBB63C";
            ctx.beginPath();
            ctx.arc(250, 250, 12, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = "#1E1A1A";
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        
        // Initial drawing of the wheel
        drawWheel();
        
        if (btnSpinWheel) {
            btnSpinWheel.addEventListener('click', () => {
                if (isSpinning) return;
                isSpinning = true;
                
                // Hide previous coupon result
                if (couponResult) couponResult.style.display = 'none';
                
                // Spins between 5 and 10 full turns + random offset
                const spins = 5 + Math.floor(Math.random() * 5);
                const extraDegrees = Math.floor(Math.random() * 360);
                const totalDegrees = spins * 360 + extraDegrees;
                currentRotation += totalDegrees;
                
                // Rotate canvas via CSS Transition
                wheelCanvas.style.transform = `rotate(${currentRotation}deg)`;
                
                // Calculate winner (Pointer is at top, i.e., 270 degrees)
                const numSlices = prizes.length;
                const degreesPerSlice = 360 / numSlices;
                
                let targetAngle = (270 - (currentRotation % 360)) % 360;
                if (targetAngle < 0) targetAngle += 360;
                
                const winningIdx = Math.floor(targetAngle / degreesPerSlice);
                const winner = prizes[winningIdx];
                
                // Wait for the transition to finish (6s as defined in CSS)
                setTimeout(() => {
                    isSpinning = false;
                    if (couponCodeVal) couponCodeVal.textContent = winner.code;
                    if (couponResult) {
                        couponResult.querySelector('h4').textContent = `🎉 Congratulations! You won: ${winner.text}`;
                        couponResult.style.display = 'block';
                    }
                }, 6000);
            });
        }
    }

    // 11. PLAYFUL HERO DISHES CAROUSEL LOGIC
    const heroSlides = document.querySelectorAll('.carousel-slide');
    const heroPrevBtn = document.getElementById('hero-prev-btn');
    const heroNextBtn = document.getElementById('hero-next-btn');

    if (heroSlides.length > 0) {
        let currentHeroIndex = 0;
        let heroPlayTimer = null;

        function showHeroSlide(index) {
            heroSlides.forEach(slide => slide.classList.remove('active'));
            heroSlides[index].classList.add('active');
            currentHeroIndex = index;
        }

        function nextHeroSlide() {
            let nextIndex = (currentHeroIndex + 1) % heroSlides.length;
            showHeroSlide(nextIndex);
        }

        function prevHeroSlide() {
            let prevIndex = (currentHeroIndex - 1 + heroSlides.length) % heroSlides.length;
            showHeroSlide(prevIndex);
        }

        function resetHeroTimer() {
            if (heroPlayTimer) clearInterval(heroPlayTimer);
            heroPlayTimer = setInterval(nextHeroSlide, 3500);
        }

        if (heroNextBtn) {
            heroNextBtn.addEventListener('click', () => {
                nextHeroSlide();
                resetHeroTimer();
            });
        }

        if (heroPrevBtn) {
            heroPrevBtn.addEventListener('click', () => {
                prevHeroSlide();
                resetHeroTimer();
            });
        }

        resetHeroTimer();
    }

    // ===== SHOPPING CART & COD SELF-ORDER LOGIC =====
    let cart = [];

    // Helper: Save/Load Cart from sessionStorage
    function loadCart() {
        const cached = sessionStorage.getItem('customer_cart');
        if (cached) {
            cart = JSON.parse(cached);
        }
        updateCartUI();
    }

    function saveCart() {
        sessionStorage.setItem('customer_cart', JSON.stringify(cart));
        updateCartUI();
    }

    // Plate Size Selector Modal elements
    const plateSizeModal = document.getElementById('plate-size-modal');
    const plateModalItemName = document.getElementById('plate-modal-item-name');
    const btnSelectHalf = document.getElementById('btn-select-half');
    const btnSelectFull = document.getElementById('btn-select-full');
    const priceLabelHalf = document.getElementById('price-label-half');
    const priceLabelFull = document.getElementById('price-label-full');
    const btnClosePlateModal = document.getElementById('btn-close-plate-modal');
    const btnCancelPlate = document.getElementById('btn-cancel-plate');

    let currentPlateItemCallback = null;

    function openPlateSizeModal(item, callback) {
        if (!plateSizeModal) return;
        
        plateModalItemName.textContent = item.name;
        priceLabelHalf.textContent = `₹${item.priceHalf}`;
        priceLabelFull.textContent = `₹${item.priceFull}`;
        
        currentPlateItemCallback = callback;
        plateSizeModal.classList.add('active');
    }

    function closePlateSizeModal() {
        if (plateSizeModal) {
            plateSizeModal.classList.remove('active');
        }
        currentPlateItemCallback = null;
    }

    if (btnClosePlateModal) btnClosePlateModal.addEventListener('click', closePlateSizeModal);
    if (btnCancelPlate) btnCancelPlate.addEventListener('click', closePlateSizeModal);

    if (btnSelectHalf) {
        btnSelectHalf.addEventListener('click', () => {
            if (currentPlateItemCallback) {
                currentPlateItemCallback('half');
            }
            closePlateSizeModal();
        });
    }

    if (btnSelectFull) {
        btnSelectFull.addEventListener('click', () => {
            if (currentPlateItemCallback) {
                currentPlateItemCallback('full');
            }
            closePlateSizeModal();
        });
    }

    // Function: Add item to cart
    function addToCart(itemId, quantity = 1, showDrawer = true, size = null) {
        let menu = JSON.parse(localStorage.getItem('momo_menu')) || defaultMenu;
        const item = menu.find(i => i.id === itemId);
        if (!item) return;

        // If it's a steamed-fried item and size is not selected yet, show the modal!
        if (item.category === 'steamed-fried' && !size) {
            openPlateSizeModal(item, (selectedSize) => {
                addToCart(itemId, quantity, showDrawer, selectedSize);
            });
            return;
        }

        const cartItemId = size ? `${item.id}-${size}` : item.id;
        const displayName = size ? `${item.name} (${size === 'half' ? 'Half - 5 Pcs' : 'Full - 9 Pcs'})` : item.name;
        const displayPrice = size === 'half' ? item.priceHalf : (size === 'full' ? item.priceFull : item.price);

        const existing = cart.find(c => c.id === cartItemId);
        if (existing) {
            existing.qty += quantity;
        } else {
            cart.push({
                id: cartItemId,
                menuId: item.id,
                name: displayName,
                price: displayPrice,
                qty: quantity,
                size: size
            });
        }
        saveCart();

        if (showDrawer) {
            openCartDrawer();
        }
    }

    function adjustCartQty(itemId, delta) {
        const item = cart.find(c => c.id === itemId);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(c => c.id !== itemId);
        }
        saveCart();
    }

    function removeCartItem(itemId) {
        cart = cart.filter(c => c.id !== itemId);
        saveCart();
    }

    // Function: Update cart drawer UI & floating badge
    function updateCartUI() {
        const floatingBtn = document.getElementById('cart-floating-btn');
        const badge = document.getElementById('cart-count-badge');
        const drawerItemsList = document.getElementById('cart-drawer-items-list');
        const drawerSubtotal = document.getElementById('cart-drawer-subtotal');
        const drawerTotal = document.getElementById('cart-drawer-total');

        const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // Update floating cart badge
        if (floatingBtn && badge) {
            if (totalItemsCount > 0) {
                floatingBtn.style.display = 'flex';
                badge.textContent = totalItemsCount;
            } else {
                floatingBtn.style.display = 'none';
            }
        }

        // Update navbar cart badge
        const navCartCount = document.getElementById('nav-cart-count');
        if (navCartCount) {
            navCartCount.textContent = totalItemsCount;
        }

        // Update drawer elements
        if (drawerItemsList) {
            drawerItemsList.innerHTML = '';
            if (cart.length === 0) {
                drawerItemsList.innerHTML = `
                    <div class="cart-empty-state">
                        <span>🛒</span>
                        <p style="font-weight:700;">Aapka cart khaali hai.</p>
                        <p style="font-size:0.75rem;">Menu se items add karein aur order karein!</p>
                    </div>
                `;
                if (drawerSubtotal) drawerSubtotal.textContent = '₹0';
                if (drawerTotal) drawerTotal.textContent = '₹0';
                const checkoutBtn = document.getElementById('btn-drawer-checkout');
                if (checkoutBtn) checkoutBtn.disabled = true;
            } else {
                const checkoutBtn = document.getElementById('btn-drawer-checkout');
                if (checkoutBtn) checkoutBtn.disabled = false;

                cart.forEach(item => {
                    const row = document.createElement('div');
                    row.className = 'cart-item-row';
                    row.innerHTML = `
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <span>₹${item.price} &times; ${item.qty}</span>
                        </div>
                        <div class="cart-item-actions">
                            <div class="qty-adjust">
                                <button class="btn-qty-dec" data-id="${item.id}">&minus;</button>
                                <span>${item.qty}</span>
                                <button class="btn-qty-inc" data-id="${item.id}">&plus;</button>
                            </div>
                            <span style="font-weight:800; min-width: 45px; text-align:right;">₹${item.price * item.qty}</span>
                            <button class="btn-remove-item" data-id="${item.id}">&times;</button>
                        </div>
                    `;
                    drawerItemsList.appendChild(row);
                });

                if (drawerSubtotal) drawerSubtotal.textContent = `₹${totalPrice}`;
                if (drawerTotal) drawerTotal.textContent = `₹${totalPrice}`;
            }
        }
    }

    // Function: Open/Close Drawer
    function openCartDrawer() {
        document.getElementById('cart-drawer').classList.add('active');
        document.getElementById('cart-drawer-overlay').classList.add('active');
    }
    function closeCartDrawer() {
        document.getElementById('cart-drawer').classList.remove('active');
        document.getElementById('cart-drawer-overlay').classList.remove('active');
    }

    // Dynamic QR code generation for the menu
    function initMenuQRCode() {
        const qrImage = document.getElementById('menu-qr-image');
        if (qrImage) {
            // Generate dynamic URL pointing to #menu
            const targetUrl = window.location.origin + window.location.pathname + '#menu';
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(targetUrl)}`;
        }
    }

    // Checkout Flow Modal actions
    function openCheckoutModal() {
        closeCartDrawer();
        
        // Populate outlet dropdown
        const outletSelect = document.getElementById('cust-outlet');
        if (outletSelect) {
            outletSelect.innerHTML = '<option value="" disabled selected>📍 Select Outlet Branch...</option>';
            const outlets = JSON.parse(localStorage.getItem('momo_outlets')) || defaultOutlets;
            outlets.forEach(out => {
                // Only show outlets that are active
                if (out.status !== 'Closed') {
                    outletSelect.innerHTML += `<option value="${out.id}">${out.name} Outlet</option>`;
                }
            });
        }
        
        document.getElementById('checkout-modal').classList.add('active');
    }

    function closeCheckoutModal() {
        document.getElementById('checkout-modal').classList.remove('active');
    }

    // Place Order Flow
    function placeCODOrder() {
        const nameInput = document.getElementById('cust-name');
        const outletSelect = document.getElementById('cust-outlet');
        
        const customerName = nameInput.value.trim();
        const outletId = outletSelect.value;
        
        if (!customerName || !outletId) {
            alert('Please fill out all required fields.');
            return;
        }

        const outlets = JSON.parse(localStorage.getItem('momo_outlets')) || defaultOutlets;
        const selectedOutlet = outlets.find(o => o.id === outletId);
        const outletName = selectedOutlet ? selectedOutlet.name : 'Unknown Outlet';

        // Load existing orders
        let orders = JSON.parse(localStorage.getItem('momo_orders')) || [];
        
        // Calculate next ID
        const lastId = (orders.length > 0) ? orders[0].id : "ORD-1000";
        const lastNum = parseInt(lastId.replace('ORD-', '')) || 1000;
        const nextId = `ORD-${lastNum + 1}`;

        const orderDate = new Date();
        const dateStr = orderDate.toISOString().split('T')[0];
        const monthStr = dateStr.slice(0, 7);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        const newOrder = {
            id: nextId,
            customerName: customerName,
            outletId: outletId,
            outletName: outletName,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty,
                total: item.price * item.qty
            })),
            totalAmount: totalPrice,
            status: "Pending",
            timestamp: orderDate.getTime(),
            date: dateStr,
            month: monthStr,
            servedBy: ''
        };

        // Save active order ID in session tracking
        sessionStorage.setItem('active_order_id', nextId);

        // Add to orders log (Firebase or Local fallback)
        if (useFirebase && db) {
            set(ref(db, 'orders/' + nextId), newOrder);
        } else {
            orders.unshift(newOrder);
            localStorage.setItem('momo_orders', JSON.stringify(orders));
            updateOrderTrackingUI();
            window.dispatchEvent(new Event('storage'));
        }

        // Show ticket confirmation popup
        showTicketConfirmation(newOrder);

        // Reset cart
        cart = [];
        saveCart();
        nameInput.value = '';
        
        closeCheckoutModal();
    }

    // Show Confirmation Ticket modal
    function showTicketConfirmation(order) {
        document.getElementById('ticket-order-id').textContent = order.id;
        document.getElementById('ticket-cust-name').textContent = order.customerName;
        document.getElementById('ticket-outlet').textContent = order.outletName;
        document.getElementById('ticket-total-price').textContent = `₹${order.totalAmount}`;

        const itemsList = document.getElementById('ticket-items-list');
        itemsList.innerHTML = '';
        order.items.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = 'ticket-item-row';
            itemRow.innerHTML = `
                <span>${item.qty}x ${item.name}</span>
                <span>₹${item.total}</span>
            `;
            itemsList.appendChild(itemRow);
        });

        document.getElementById('confirmation-modal').classList.add('active');
    }

    function closeConfirmationModal() {
        document.getElementById('confirmation-modal').classList.remove('active');
    }

    // Function: Update customer order tracking widget UI
    function updateOrderTrackingUI() {
        const tracker = document.getElementById('active-order-tracker');
        const trackId = document.getElementById('track-order-id');
        const trackStatus = document.getElementById('track-order-status');

        if (!tracker || !trackId || !trackStatus) return;

        const activeOrderId = sessionStorage.getItem('active_order_id');
        if (!activeOrderId) {
            tracker.style.display = 'none';
            return;
        }

        const orders = JSON.parse(localStorage.getItem('momo_orders')) || [];
        const order = orders.find(o => o.id === activeOrderId);

        if (!order) {
            tracker.style.display = 'none';
            return;
        }

        tracker.style.display = 'block';
        trackId.textContent = order.id;
        
        if (order.status === 'Pending') {
            trackStatus.textContent = 'PENDING ⏳';
            trackStatus.className = 'tracker-status-badge status-pending';
        } else if (order.status === 'Completed') {
            trackStatus.textContent = 'COMPLETED 🎉';
            trackStatus.className = 'tracker-status-badge status-completed';
        } else {
            trackStatus.textContent = order.status;
            trackStatus.className = 'tracker-status-badge';
        }
    }

    // Function: Enable/Disable (lock/unlock) Swiggy & Zomato partner buttons
    function updatePartnerLocksUI() {
        const isZomatoLocked = localStorage.getItem('momo_zomato_locked') === 'true';
        const isSwiggyLocked = localStorage.getItem('momo_swiggy_locked') === 'true';

        // Get Zomato buttons on customer page
        const zomatoBtns = document.querySelectorAll('.item-zomato-btn, .zomato-color, .zomato-partner');
        zomatoBtns.forEach(btn => {
            if (isZomatoLocked) {
                btn.classList.add('btn-locked');
                btn.title = "Offline (Locked by Admin)";
            } else {
                btn.classList.remove('btn-locked');
                btn.title = "Order on Zomato";
            }
        });

        // Get Swiggy buttons on customer page
        const swiggyBtns = document.querySelectorAll('.item-swiggy-btn, .swiggy-color, .swiggy-partner');
        swiggyBtns.forEach(btn => {
            if (isSwiggyLocked) {
                btn.classList.add('btn-locked');
                btn.title = "Offline (Locked by Admin)";
            } else {
                btn.classList.remove('btn-locked');
                btn.title = "Order on Swiggy";
            }
        });
    }

    // Function: Update shop closed lockdown UI
    function updateShopClosedUI() {
        const isShopClosed = localStorage.getItem('momo_shop_closed') === 'true';
        const overlay = document.getElementById('shop-closed-overlay');
        if (overlay) {
            if (isShopClosed) {
                overlay.style.display = 'flex';
                closeCartDrawer();
                closeCheckoutModal();
            } else {
                overlay.style.display = 'none';
            }
        }
    }

    // Initialize logic
    loadCart();
    initMenuQRCode();
    updateOrderTrackingUI();
    updatePartnerLocksUI();
    updateShopClosedUI();

    // Firebase listeners for customer site
    if (useFirebase && db) {
        // 1. Listen to settings
        onValue(ref(db, 'settings'), (snapshot) => {
            const val = snapshot.val() || {};
            localStorage.setItem('momo_shop_closed', val.shopClosed === true);
            localStorage.setItem('momo_zomato_locked', val.zomatoLocked === true);
            localStorage.setItem('momo_swiggy_locked', val.swiggyLocked === true);

            updateShopClosedUI();
            updatePartnerLocksUI();
        });

        // 2. Listen to menu items (out of stock, pricing)
        onValue(ref(db, 'menu'), (snapshot) => {
            const val = snapshot.val();
            if (val) {
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
                renderMenu();
            }
        });

        // 3. Listen to orders to sync tracking status
        onValue(ref(db, 'orders'), (snapshot) => {
            const val = snapshot.val();
            let orders = [];
            if (val) {
                orders = Object.values(val).sort((a, b) => b.timestamp - a.timestamp);
            }
            localStorage.setItem('momo_orders', JSON.stringify(orders));
            updateOrderTrackingUI();
        });

        // 4. Listen to social posts to sync social wall
        onValue(ref(db, 'social_posts'), (snapshot) => {
            const val = snapshot.val();
            if (val) {
                const postsList = Object.values(val);
                localStorage.setItem('momo_social_posts', JSON.stringify(postsList));
                renderSocialWall();
            }
        });
    }

    // Hook listeners
    const btnNavbarCart = document.getElementById('btn-navbar-cart');
    if (btnNavbarCart) btnNavbarCart.addEventListener('click', openCartDrawer);

    const btnCloseTracker = document.getElementById('btn-close-tracker');
    if (btnCloseTracker) {
        btnCloseTracker.addEventListener('click', () => {
            sessionStorage.removeItem('active_order_id');
            updateOrderTrackingUI();
        });
    }

    const cartFloatBtn = document.getElementById('cart-floating-btn');
    if (cartFloatBtn) cartFloatBtn.addEventListener('click', openCartDrawer);

    const closeCartBtn = document.getElementById('btn-close-cart');
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);

    const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
    if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCartDrawer);

    const btnShowQRModal = document.getElementById('btn-show-qr-modal');
    if (btnShowQRModal) {
        btnShowQRModal.addEventListener('click', () => {
            document.getElementById('qr-modal').classList.add('active');
        });
    }

    const btnCloseQR = document.getElementById('btn-close-qr');
    if (btnCloseQR) {
        btnCloseQR.addEventListener('click', () => {
            document.getElementById('qr-modal').classList.remove('active');
        });
    }

    const btnDrawerCheckout = document.getElementById('btn-drawer-checkout');
    if (btnDrawerCheckout) btnDrawerCheckout.addEventListener('click', openCheckoutModal);

    const btnCloseCheckout = document.getElementById('btn-close-checkout');
    if (btnCloseCheckout) btnCloseCheckout.addEventListener('click', closeCheckoutModal);

    const btnCancelCheckout = document.getElementById('btn-cancel-checkout');
    if (btnCancelCheckout) btnCancelCheckout.addEventListener('click', closeCheckoutModal);

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            placeCODOrder();
        });
    }

    const btnCloseConfirmation = document.getElementById('btn-close-confirmation');
    if (btnCloseConfirmation) btnCloseConfirmation.addEventListener('click', closeConfirmationModal);

    const btnConfirmDone = document.getElementById('btn-confirm-done');
    if (btnConfirmDone) btnConfirmDone.addEventListener('click', closeConfirmationModal);

    // Event delegation on Menu Grid for Cart buttons
    const menuGridElem = document.getElementById('menu-grid');
    if (menuGridElem) {
        menuGridElem.addEventListener('click', (e) => {
            const btnAddCart = e.target.closest('.btn-add-cart');
            const btnOrderNow = e.target.closest('.btn-order-now');
            
            if (btnAddCart) {
                const id = btnAddCart.getAttribute('data-id');
                addToCart(id, 1, true);
            }
            if (btnOrderNow) {
                const id = btnOrderNow.getAttribute('data-id');
                let menu = JSON.parse(localStorage.getItem('momo_menu')) || defaultMenu;
                const item = menu.find(i => i.id === id);
                if (item && item.category === 'steamed-fried') {
                    // Set custom callback to add to cart and immediately open checkout modal
                    openPlateSizeModal(item, (selectedSize) => {
                        addToCart(id, 1, false, selectedSize);
                        openCheckoutModal();
                    });
                } else {
                    addToCart(id, 1, false);
                    openCheckoutModal();
                }
            }
        });
    }

    // Event delegation on Cart drawer items list
    const cartItemsListElem = document.getElementById('cart-drawer-items-list');
    if (cartItemsListElem) {
        cartItemsListElem.addEventListener('click', (e) => {
            const btnInc = e.target.closest('.btn-qty-inc');
            const btnDec = e.target.closest('.btn-qty-dec');
            const btnRemove = e.target.closest('.btn-remove-item');
            
            if (btnInc) {
                const id = btnInc.getAttribute('data-id');
                adjustCartQty(id, 1);
            }
            if (btnDec) {
                const id = btnDec.getAttribute('data-id');
                adjustCartQty(id, -1);
            }
            if (btnRemove) {
                const id = btnRemove.getAttribute('data-id');
                removeCartItem(id);
            }
        });
    }

    // ===== CROSS-TAB REAL-TIME SYNC =====
    window.addEventListener('storage', (e) => {
        if (!e.key || e.key === 'momo_outlets') {
            renderOutlets();
        }
        if (!e.key || e.key === 'momo_menu') {
            if (typeof renderMenu === 'function') renderMenu();
        }
        if (!e.key || e.key === 'momo_orders') {
            if (typeof updateOrderTrackingUI === 'function') updateOrderTrackingUI();
        }
        if (!e.key || e.key === 'momo_zomato_locked' || e.key === 'momo_swiggy_locked') {
            if (typeof updatePartnerLocksUI === 'function') updatePartnerLocksUI();
        }
        if (!e.key || e.key === 'momo_shop_closed') {
            if (typeof updateShopClosedUI === 'function') updateShopClosedUI();
        }
    });
});
