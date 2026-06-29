// Detect referer-based site info (returns { url, label } or null)
// Extracts the subdomain from the referer, strips 'xyz' prefix,
// then converts the last '-' to '.' to get the clean domain label.
const getRefererSite = () => {
    try {
        const ref = document.referrer;
        if (!ref) return null;
        const refUrl = new URL(ref);
        const parts = refUrl.hostname.split('.');
        let sub = parts.length > 2 ? parts[0] : '';
        if (!sub.startsWith('xyz')) return null;
        sub = sub.substring(3); // strip 'xyz'
        const lastDash = sub.lastIndexOf('-');
        if (lastDash === -1) return null;
        const label = sub.substring(0, lastDash) + '.' + sub.substring(lastDash + 1);
        return { url: `https://${label}/`, label };
    } catch (e) {
        return null;
    }
};

// Get MAIN_URL based on subdomain
const getMainUrl = () => {
    // Check referer map first
    const refSite = getRefererSite();
    if (refSite) return refSite.url;

    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Get subdomain (first part before the domain)
    let subdomain = parts.length > 2 ? parts[0] : '';
    
    // Remove 'xyz' prefix if subdomain starts with it
    if (subdomain.startsWith('xyz')) {
        subdomain = subdomain.substring(3);
    }
    
    // If subdomain exists, convert last dash to dot and create URL
    if (subdomain) {
        // Find the last occurrence of dash and replace with dot
        const lastDashIndex = subdomain.lastIndexOf('-');
        if (lastDashIndex !== -1) {
            const convertedDomain = subdomain.substring(0, lastDashIndex) + '.' + subdomain.substring(lastDashIndex + 1);
            return `https://${convertedDomain}/`;
        }
    }
    
    // Default fallback
    return 'https://kooratv-1.vercel.app/';
};

// Configuration
const MAIN_URL = getMainUrl();
const CONFIG = {
    API_MATCHE_URL: 'https://ws.kora-api.top/',
    FALLBACK_FRAME_URLs: [
        'https://a13.kora-plus.app/frame.php',
        'https://a12.kora-plus.app/frame.php',
        'https://a11.kora-plus.app/frame.php'
    ],
    MAIN_URL: MAIN_URL,
    REDIRECT_URL: MAIN_URL,
    APP_NAME: 'Sport TV',
    P_VALUE: 12
};

// Edge balancing state
let edgeList = [];      // full frame URLs e.g. ["https://a11.kora-plus.mov/frame.php", ...]

// Build full frame URLs from edges + edge_domain
const initEdges = (matchData) => {
    const edges = Array.isArray(matchData.edges)
        ? matchData.edges
        : (typeof matchData.edges === 'string' ? JSON.parse(matchData.edges || '[]') : []);

    const edgeDomain = matchData.edge_domain || '';

    if (edges.length > 0 && edgeDomain) {
        edgeList = edges.map(e => `https://${e}.${edgeDomain}/frame.php`);
    } else {
        edgeList = [];
    }

    console.log('Edges initialized:', edgeList);
};

// Pick a random edge each time (pure random, no round-robin)
const getNextEdgeUrl = () => {
    const list = edgeList.length > 0 ? edgeList : CONFIG.FALLBACK_FRAME_URLs;
    return list[Math.floor(Math.random() * list.length)];
};

// Log the detected URL for debugging
console.log('Main URL detected:', CONFIG.MAIN_URL);

// State
let currentPlayer = null;
let matchData = null;

// Utility Functions
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

const getUrlParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const generateUUID = () => {
    const d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

const getVisitorId = () => {
    let visitorId = localStorage.getItem('visitorId1');
    if (!visitorId) {
        visitorId = generateUUID();
        localStorage.setItem('visitorId1', visitorId);
    }
    return visitorId;
};

const encryptUrl = (str) => {
    const hex = Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    return btoa(hex);
};

const goHome = () => {
    window.location.href = CONFIG.MAIN_URL;
};

// Theme Management
const getTheme = () => {
    return localStorage.getItem('theme') || 'dark';
};

const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
};

const updateThemeIcon = (theme) => {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
};

const toggleTheme = () => {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    console.log('Theme switched to:', newTheme);
};

// Initialize theme on load
const initTheme = () => {
    const savedTheme = getTheme();
    setTheme(savedTheme);
};

// Social Share Functions
const getCurrentUrl = () => {
    return window.location.href;
};

const getShareText = () => {
    const title = document.getElementById('matchTitle').textContent;
    return `Watch ${title} Live Stream on Hesgoal TV`;
};

const updateShareLinks = () => {
    const url = encodeURIComponent(getCurrentUrl());
    const text = encodeURIComponent(getShareText());
    
    // Twitter/X
    const twitterBtn = document.getElementById('shareTwitter');
    if (twitterBtn) {
        twitterBtn.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    }
    
    // Facebook
    const facebookBtn = document.getElementById('shareFacebook');
    if (facebookBtn) {
        facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }
    
    // WhatsApp
    const whatsappBtn = document.getElementById('shareWhatsApp');
    if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/?text=${text}%20${url}`;
    }
    
    // Telegram
    const telegramBtn = document.getElementById('shareTelegram');
    if (telegramBtn) {
        telegramBtn.href = `https://t.me/share/url?url=${url}&text=${text}`;
    }
};

const copyToClipboard = async () => {
    const url = getCurrentUrl();
    const copyBtn = document.getElementById('copyLink');
    const svgIcon = copyBtn.querySelector('svg');
    
    try {
        await navigator.clipboard.writeText(url);
        
        // Visual feedback - change to checkmark
        const originalSvg = svgIcon.outerHTML;
        svgIcon.innerHTML = '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>';
        copyBtn.style.background = '#10b981';
        copyBtn.style.borderColor = '#10b981';
        copyBtn.style.color = '#ffffff';
        
        setTimeout(() => {
            svgIcon.outerHTML = originalSvg;
            copyBtn.style.background = '';
            copyBtn.style.borderColor = '';
            copyBtn.style.color = '';
        }, 2000);
        
        console.log('Link copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy:', err);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            const originalSvg = svgIcon.outerHTML;
            svgIcon.innerHTML = '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>';
            copyBtn.style.background = '#10b981';
            copyBtn.style.borderColor = '#10b981';
            setTimeout(() => {
                svgIcon.outerHTML = originalSvg;
                copyBtn.style.background = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        } catch (err2) {
            console.error('Fallback copy failed:', err2);
        }
        
        document.body.removeChild(textArea);
    }
};

// API Functions
const fetchMatchData = async (matcheId, lang = 'en') => {
    const timestamp = Date.now();
    const apiUrl = `${CONFIG.API_MATCHE_URL}api/matche/${matcheId}/${lang}?t=${timestamp}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('API request failed');
        return await response.json();
    } catch (error) {
        console.error('Error fetching match data:', error);
        throw error;
    }
};

// Player Functions
const updatePlayer = (link, kUrl, chLink, type, ch, edge, p) => {
    const t = Math.floor(Date.now() / 1000);
    const playerContainer = document.getElementById('playerContainer');
    
    // Decode URLs
    kUrl = decodeURIComponent(atob(kUrl).replace(/(.{1,2})/g, "%$1"));
    kUrl = `${kUrl}?kt=${t}`;
    link = decodeURIComponent(atob(link).replace(/(.{1,2})/g, "%$1"));
    
    // Clear container
    playerContainer.innerHTML = '';
    
    // Destroy previous player if exists
    if (currentPlayer && typeof currentPlayer.destroy === 'function') {
        currentPlayer.destroy();
        currentPlayer = null;
    }
    
    if (type === 'HLS') {
        // HLS Stream with Clappr
        currentPlayer = new Clappr.Player({
            source: chLink,
            mimeType: "application/x-mpegURL",
            disableErrorScreen: true,
            poster: `${CONFIG.MAIN_URL}assets/images/hesgoal.webp`,
            autoPlay: true,
            height: "100%",
            width: "100%",
            parentId: "#playerContainer",
            mediacontrol: { seekbar: "#667eea", buttons: "#fff" }
        });
    } else {
        // iFrame Stream
        const iframe = document.createElement('iframe');
        iframe.className = 'player-iframe';
        iframe.setAttribute('width', "100%");
        iframe.setAttribute('height', "100%");
        iframe.setAttribute('allow', "autoplay");
        iframe.setAttribute('scrolling', "no");
        iframe.setAttribute('allowfullscreen', "allowfullscreen");
        iframe.setAttribute('loading', "lazy");
        iframe.setAttribute('frameBorder', "0");
        
        if ((type === 'Landscape' || type === 'Frame') && edge == 0) {
            iframe.setAttribute('src', chLink);
        } else {
            const visitorId = getVisitorId();
            iframe.setAttribute('src', `${link}?ch=${ch}&p=${p}&token=${visitorId}&kt=${t}`);
        }
        
        playerContainer.appendChild(iframe);
    }
};

// UI Update Functions
const updateMatchInfo = (match, lang = 'en') => {
    // Select fields based on language
    const home = lang === 'ar' ? match.home : match.home_en;
    const away = lang === 'ar' ? match.away : match.away_en;
    const league = lang === 'ar' ? match.league : match.league_en;
    const vs = lang === 'ar' ? 'ضد' : 'vs';
    const isRTL = lang === 'ar';
    
    // Arabic translations
    const translations = {
        matchInfo: isRTL ? 'معلومات المباراة 📋' : '📋 Match Information',
        aboutStream: isRTL ? 'حول هذا البث 📺' : '📺 About This Stream',
        league: isRTL ? 'الدوري' : 'League',
        date: isRTL ? 'التاريخ' : 'Date',
        time: isRTL ? 'الوقت' : 'Time',
        score: isRTL ? 'النتيجة' : 'Score',
        watch: isRTL ? 'شاهد' : 'Watch',
        liveStream: isRTL ? 'بث مباشر مجاني بجودة عالية على' : 'live stream free in HD quality on',
        matchScheduled: isRTL ? 'مباراة' : 'match is scheduled for',
        at: isRTL ? 'في' : 'at',
        enjoy: isRTL ? 'استمتع بالبث الكامل للمباراة مع خيارات خوادم متعددة ودون الحاجة للتسجيل.' : 'Enjoy the full match broadcast with multiple server options and no registration required.'
    };
    
    // Update card headers and set RTL direction
    document.getElementById('matchInfoHeader').textContent = translations.matchInfo;
    document.getElementById('aboutStreamHeader').textContent = translations.aboutStream;
    document.getElementById('matchInfoCard').style.direction = isRTL ? 'rtl' : 'ltr';
    document.getElementById('aboutStreamCard').style.direction = isRTL ? 'rtl' : 'ltr';
    
    // Update title
    document.getElementById('matchTitle').textContent = `${home} ${vs} ${away}`;
    document.getElementById('matchLeague').textContent = league;
    
    // Update share links with match info
    updateShareLinks();
    
    // Update chat iframe with league room
    const chatIframe = document.getElementById('chatIframe');
    if (chatIframe && match.league_en) {
        const roomId = lang === 'ar' ? `${match.league_en}-${lang}` : match.league_en;
        const chatUrl = `https://chat.kora-api.top/?room_id=${encodeURIComponent(roomId)}`;
        chatIframe.setAttribute('src', chatUrl);
    }
    
    // Update match info grid
    const infoGrid = document.getElementById('matchInfo');
    infoGrid.innerHTML = `
        <div class="info-item">
            <div class="info-label">${translations.league}</div>
            <div class="info-value">${escapeHtml(league)}</div>
        </div>
        <div class="info-item">
            <div class="info-label">${translations.date}</div>
            <div class="info-value">${escapeHtml(match.date)}</div>
        </div>
        <div class="info-item">
            <div class="info-label">${translations.time}</div>
            <div class="info-value">${escapeHtml(match.time)} GMT</div>
        </div>
        ${match.score ? `
        <div class="info-item">
            <div class="info-label">${translations.score}</div>
            <div class="info-value">${escapeHtml(match.score)}</div>
        </div>
        ` : ''}
    `;
    
    // Update description
    if (isRTL) {
        document.getElementById('matchDescription').innerHTML = `
            ${translations.watch} <strong>${escapeHtml(home)} ${vs} ${escapeHtml(away)}</strong> ${translations.liveStream} ${CONFIG.APP_NAME}. 
            ${translations.matchScheduled} <strong>${escapeHtml(league)}</strong> ${translations.at} <strong>${escapeHtml(match.date)}</strong> ${translations.at} <strong>${escapeHtml(match.time)} GMT</strong>.
            ${translations.enjoy}
        `;
    } else {
        document.getElementById('matchDescription').innerHTML = `
            ${translations.watch} <strong>${escapeHtml(home)} ${vs} ${escapeHtml(away)}</strong> ${translations.liveStream} ${CONFIG.APP_NAME}. 
            This <strong>${escapeHtml(league)}</strong> ${translations.matchScheduled} <strong>${escapeHtml(match.date)}</strong> ${translations.at} <strong>${escapeHtml(match.time)} GMT</strong>.
            ${translations.enjoy}
        `;
    }
    
    // Update page title
    const titleSep = isRTL ? '-' : 'vs';
    document.title = `${home} ${titleSep} ${away}`;
};

const createServerButtons = (channels) => {
    const serverButtonsContainer = document.getElementById('serverButtons');
    serverButtonsContainer.innerHTML = '';
    
    channels.forEach((channel, index) => {
        const button = document.createElement('button');
        button.className = 'btn-server';
        button.textContent = channel.server_name || `Server ${index + 1}`;
        button.dataset.index = index;
        
        button.onclick = function() {
            document.querySelectorAll('.btn-server').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Pick next edge (round-robin) for each server button click
            const frameUrl = getNextEdgeUrl();
            const uKey = encryptUrl(frameUrl);
            updatePlayer(uKey, uKey, channel.link, channel.type, channel.ch, channel.edge, CONFIG.P_VALUE);
        };
        
        serverButtonsContainer.appendChild(button);
    });
    
    // Auto-load first channel
    if (channels.length > 0) {
        const firstChannel = channels[0];
        const frameUrl = getNextEdgeUrl();
        const uKey = encryptUrl(frameUrl);
        updatePlayer(uKey, uKey, firstChannel.link, firstChannel.type, firstChannel.ch, firstChannel.edge, CONFIG.P_VALUE);
        
        const firstButton = serverButtonsContainer.querySelector('.btn-server');
        if (firstButton) {
            firstButton.classList.add('active');
        }
    }
};

const showError = (message) => {
    document.getElementById('serverButtons').innerHTML = `<div class="error-message">${message}</div>`;
    document.getElementById('playerContainer').innerHTML = `<div class="loading"><div class="error-message">${message}</div></div>`;
};

// Update Logo
const updateLogo = (lang = 'en', domainName = null) => {
    const isAr = lang === 'ar';
    const logo = document.getElementById('siteLogo');
    
    const refSite = getRefererSite();
    const displayName = domainName || (refSite ? refSite.label : null);

    if (displayName) {
        logo.textContent = `⚽ ${displayName}`;
    } else {
        logo.textContent = isAr ? '⚽ سبورت' : '⚽ koora TV';
    }
};

// Update Home Button
const updateHomeButton = (lang = 'en', domainName = null) => {
    const isAr = lang === 'ar';
    const homeButtonWrapper = document.getElementById('homeButtonWrapper');
    const homeButtonText = document.getElementById('homeButtonText');

    const refSite = getRefererSite();
    const displayName = domainName || (refSite ? refSite.label : null);
    
    if (displayName) {
        homeButtonWrapper.style.display = 'block';
        homeButtonText.textContent = isAr 
            ? `الصفحة الرئيسية لموقع ${displayName}`
            : `Home ${displayName} website`;
    } else {
        homeButtonWrapper.style.display = 'block';
        homeButtonText.textContent = isAr 
            ? 'العودة للصفحة الرئيسية'
            : 'Return to home page';
    }
};

// Initialize App
const init = async () => {
    // Check if there are any URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // If no parameters at all, redirect to matches page
    if (!urlParams.has('m') && urlParams.toString() === '') {
        window.location.href = '/Watches.html';
        return;
    }
    
    // Initialize theme first
    initTheme();
    
    // Set current year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Get match ID and language from URL parameters
    const matcheId = getUrlParam('m');
    const lang = getUrlParam('lang') || 'en';
    const domainName = getUrlParam('domain_name') || null;
    const isAr = lang === 'ar';
    
    // Set RTL for Arabic
    if (isAr) {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.setAttribute('dir', 'ltr');
    }
    
    // Update logo
    updateLogo(lang, domainName);
    
    // Update home button
    updateHomeButton(lang, domainName);
    
    // Load marketing content and update modal language
    loadMarketingContent(lang);
    updateModalLanguage(lang);
    
    if (!matcheId || isNaN(matcheId)) {
        // Redirect to matches page if match ID is invalid
        window.location.href = '/matches.html';
        return;
    }
    
    try {
        // Fetch match data
        matchData = await fetchMatchData(matcheId, lang);
        
        if (!matchData || !matchData.home_en) {
            console.log('🔴 Match not found. Redirecting to soccer-streams.io...');
            window.location.href = CONFIG.REDIRECT_URL;
            return;
        }
        
        // Check if match is inactive - redirect immediately
        if (matchData.active == 0) {
            console.log('🔴 Match is inactive (active=0). Redirecting to soccer-streams.io...');
            window.location.href = CONFIG.REDIRECT_URL;
            return;
        }
        
        // Update UI with match info
        updateMatchInfo(matchData, lang);
        
        // Check if match is active and has channels
        if (matchData.active == 1 && matchData.has_channels == 1 && matchData.channels && matchData.channels.length > 0) {
            initEdges(matchData);
            createServerButtons(matchData.channels);
        } else {
            const refSite = getRefererSite();
            if (refSite) {
                window.location.href = refSite.url;
            } else {
                window.location.href = CONFIG.REDIRECT_URL;
            }
        }
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Error loading match data. Please refresh the page.');
    }
};

// Responsive height adjustment
const adjustPlayerHeight = () => {
    const playerContainer = document.getElementById('playerContainer');
    const isMobile = window.innerWidth <= 768;
    playerContainer.style.height = isMobile ? '400px' : '500px';
};

window.addEventListener('resize', adjustPlayerHeight);

// Toggle Marketing Section
const toggleMarketing = () => {
    const content = document.getElementById('marketingContent');
    const toggle = document.getElementById('marketingToggle');
    
    content.classList.toggle('active');
    toggle.classList.toggle('active');
};

// Marketing Section Content
const loadMarketingContent = (lang = 'en') => {
    const isAr = lang === 'ar';
    const marketingSection = document.getElementById('marketingSection');
    const marketingContentInner = document.querySelector('#marketingSection .marketing-content-inner');
    
    if (!marketingContentInner) return;
    
    // Set direction based on language
    if (marketingSection) {
        marketingSection.style.direction = isAr ? 'rtl' : 'ltr';
    }
    
    // Update header text
    const headerText = document.getElementById('marketingHeaderText');
    if (headerText) {
        headerText.textContent = isAr 
            ? 'للمطورين: دمج روابط المباريات في مدونتك أو موقعك'
            : 'For Developers: Integrate match links in your blog or website';
    }
    
    if (isAr) {
        marketingContentInner.innerHTML = `
            <h2>توقف عن خسارة زوارك لصالح مواقع البث</h2>
            <div class="subtitle">
                كل رابط تنشره لصفحة بث خارجية = خسارة زيارات (ذهاب بلا عودة ) + صفر SEO + بدون علامة تجارية<br>
                أنت حرفياً تتخلص من زوارك الى الأبد و تبيعهم بالمجان لمواقع أخرى بلا عودة  ( تخسر علامتك التجارية و اسم موقعك )<br><br>
                <strong style="color: var(--text-primary);">لماذا لا ترسل الزوار لمشاهدة المباريات و  العودة بعدها لموقعك ؟</strong><br>
                <strong style="color: var(--text-primary);">لماذا لا تحصل على مداخيل اضافية من زوارك و الاحتفاظ بقوة علامتك التجارية و اسم موقعك ؟</strong>
            </div>
            
            <div class="highlight-box">
                <h3>✨ لماذا روابطنا تتفوق على الجميع</h3>
                <p style="font-size: 17px; line-height: 1.9; color: var(--text-secondary); margin-bottom: 20px;">
                    <strong style="color: var(--text-primary);">مواقع البث الأخرى:</strong> تسرق زياراتك للأبد. بدون قيمة SEO. تجربة عامة.<br><br>
                    <strong style="color: var(--button-bg-start);">منصتنا تمنحك:</strong><br>
                    ✅ <strong>عودة تلقائية للزوار</strong> - الزوار ينقرون على زر الصفحة الرئيسية ويعودون لموقعك<br>
                    ✅ <strong>روابط follow backlinks مجانية</strong> - كل بث = قيمة SEO بـ 50-200 دولار لا تدفع مقابلها<br>
                    ✅ <strong>ظهور العلامة التجارية</strong> - اسم موقعك يظهر بوضوح فوق كل مشغل<br>
                    ✅ <strong>مظهر احترافي</strong> - يبني الثقة مع زر "الصفحة الرئيسية لموقع [اسم موقعك]"<br>
                    ✅ <strong>دعم متعدد اللغات</strong> - وصول للجمهور العربي والإنجليزي<br><br>
                    <strong style="color: var(--text-primary);">شارك 100 مباراة = 100 رابط follow = قيمة SEO مجانية بـ 5,000-20,000 دولار!</strong>
                </p>
            </div>
            
            <div class="benefits-grid">
                <div class="benefit-card">
                    <div class="icon">🔗</div>
                    <strong>روابط SEO مجانية</strong>
                    <small>احصل على follow backlinks لتحسين ترتيب جوجل</small>
                </div>
                <div class="benefit-card">
                    <div class="icon">📢</div>
                    <strong>ظهور العلامة التجارية</strong>
                    <small>اسم موقعك يظهر بوضوح فوق كل بث</small>
                </div>
                <div class="benefit-card">
                    <div class="icon">📈</div>
                    <strong>الاحتفاظ بالزيارات</strong>
                    <small>احتفظ بزياراتك بدلاً من خسارتها</small>
                </div>
                <div class="benefit-card">
                    <div class="icon">💰</div>
                    <strong>المزيد من الإيرادات</strong>
                    <small>المزيد من المشاهدات = المزيد من عائدات الإعلانات</small>
                </div>
            </div>
            
            <p style="font-size: 17px; margin: 20px 0; color: var(--text-primary);">
                <strong>إعداد مجاني 100% • بدون عقود • بدون رسوم مخفية • جاهز في دقيقتين</strong><br>
                <span style="font-size: 15px; color: var(--text-secondary);">بينما منافسوك يهدرون المال على الـ SEO، أنت تحصل عليه مجاناً.</span>
            </p>
            
            <div class="cta-buttons">
                <button class="btn-primary" onclick="openModal('subdomainModal')">
                    <span>🎯</span>
                    <span>احصل على نطاقك الفرعي</span>
                </button>
                <button class="btn-featured" data-lang="ar" onclick="openModal('streamLinkModal')">
                    <span>🔗</span>
                    <span>أنشئ رابط البث</span>
                </button>
                <button class="btn-primary" onclick="window.location.href='matches.html'">
                    <span>📋</span>
                    <span>عرض جميع المباريات</span>
                </button>
            </div>
        `;
    } else {
        marketingContentInner.innerHTML = `
            <h2>Stop Losing Your Visitors to Streaming Sites</h2>
            <div class="subtitle">
                Every link to external streaming pages = Lost traffic (gone forever) + Zero SEO + No branding<br>
                You're literally giving away your visitors forever and selling them for free to other sites with no return (you lose your brand power and website name)<br><br>
                <strong style="color: var(--text-primary);">Why not send visitors to watch matches and have them return to YOUR site?</strong><br>
                <strong style="color: var(--text-primary);">Why not earn additional revenue from your visitors while keeping your brand strength and website name?</strong>
            </div>
            
            <div class="highlight-box">
                <h3>✨ Why Our Links Beat Everyone Else</h3>
                <p style="font-size: 17px; line-height: 1.9; color: var(--text-secondary); margin-bottom: 20px;">
                    <strong style="color: var(--text-primary);">Other streaming sites:</strong> Steal your traffic forever. Zero SEO value. Generic experience.<br><br>
                    <strong style="color: var(--button-bg-start);">Our platform gives you:</strong><br>
                    ✅ <strong>Automatic traffic return</strong> - Viewers click the home button and land back on YOUR site<br>
                    ✅ <strong>Free follow backlinks</strong> - Each stream = $50-200 in SEO value you don't have to pay for<br>
                    ✅ <strong>Brand visibility</strong> - Your website name displayed prominently above every player<br>
                    ✅ <strong>Professional look</strong> - Builds trust with "Home [Your Site] Website" button<br>
                    ✅ <strong>Multi-language support</strong> - Reach Arabic and English audiences<br><br>
                    <strong style="color: var(--text-primary);">Share 100 matches = 100 follow backlinks = $5,000-$20,000 in FREE SEO value!</strong>
                </p>
            </div>
            
            <div class="benefits-grid">
                <div class="benefit-card">
                    <div class="icon">🔗</div>
                    <strong>Free SEO Backlinks</strong>
                    <small>Get follow backlinks to boost your Google ranking</small>
                </div>
                <div class="benefit-card">
                    <div class="icon">📢</div>
                    <strong>Brand Visibility</strong>
                    <small>Your website name prominently displayed on every stream</small>
                </div>
                <div class="benefit-card">
                    <div class="icon">📈</div>
                    <strong>Traffic Retention</strong>
                    <small>Keep your traffic instead of losing it</small>
                </div>
                <div class="benefit-card">
                    <div class="icon">💰</div>
                    <strong>More Revenue</strong>
                    <small>More page views = more ad revenue</small>
                </div>
            </div>
            
            <p style="font-size: 17px; margin: 20px 0; color: var(--text-primary);">
                <strong>100% Free Setup • No Contracts • No Hidden Fees • Ready in 2 Minutes</strong><br>
                <span style="font-size: 15px; color: var(--text-secondary);">While your competitors waste money on SEO, you're getting it free.</span>
            </p>
            
            <div class="cta-buttons">
                <button class="btn-primary" onclick="openModal('subdomainModal')">
                    <span>🎯</span>
                    <span id="getSubdomainBtn">Get Your Subdomain</span>
                </button>
                <button class="btn-featured" onclick="openModal('streamLinkModal')">
                    <span>🔗</span>
                    <span id="generateStreamBtn2">Generate Stream Link</span>
                </button>
                <button class="btn-primary" onclick="window.location.href='matches.html'">
                    <span>📋</span>
                    <span id="viewMatchesBtn">View All Matches</span>
                </button>
            </div>
        `;
    }
};

// Modal Functions
const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Set default language for stream link modal
        if (modalId === 'streamLinkModal') {
            const currentLang = getUrlParam('lang') || 'en';
            const streamPageLangSelect = document.getElementById('streamPageLangSelect');
            if (streamPageLangSelect) {
                streamPageLangSelect.value = currentLang;
            }
        }
    }
};

const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset forms
        if (modalId === 'subdomainModal') {
            document.getElementById('domainInput').value = '';
            document.getElementById('subdomainResult').classList.remove('show');
        } else if (modalId === 'streamLinkModal') {
            document.getElementById('streamDomainInput').value = '';
            document.getElementById('domainNameInput').value = '';
            const streamPageLangSelect = document.getElementById('streamPageLangSelect');
            if (streamPageLangSelect) {
                streamPageLangSelect.value = 'en';
            }
            document.getElementById('streamLinkResult').classList.remove('show');
        }
    }
};

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Generate Subdomain
const generateSubdomain = () => {
    const lang = getUrlParam('lang') || 'en';
    const isAr = lang === 'ar';
    const domainInput = document.getElementById('domainInput');
    const domain = domainInput.value.trim().toLowerCase();
    
    if (!domain) {
        alert(isAr ? 'الرجاء إدخال اسم النطاق' : 'Please enter a domain name');
        return;
    }
    
    // Clean domain (remove http://, https://, www.)
    let cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
    
    // Convert dots to dashes
    const subdomain = 'xyz' + cleanDomain.replace(/\./g, '-');
    const fullSubdomain = `${subdomain}.goalz.zip`;
    
    // Show result
    const resultBox = document.getElementById('subdomainResult');
    const resultValue = document.getElementById('resultValue');
    resultValue.textContent = fullSubdomain;
    resultBox.classList.add('show');
    
    // Update button text
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.textContent = isAr ? 'نسخ إلى الحافظة' : 'Copy to Clipboard';
    copyBtn.classList.remove('copied');
    
    // Auto-scroll to result after a brief delay
    setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
};

// Generate Stream Link
const generateStreamLink = () => {
    const pageLang = getUrlParam('lang') || 'en';
    const isAr = pageLang === 'ar';
    const matcheId = getUrlParam('m');
    const domainInput = document.getElementById('streamDomainInput');
    const domain = domainInput.value.trim().toLowerCase();
    const domainNameInput = document.getElementById('domainNameInput');
    const domainName = domainNameInput.value.trim();
    const streamPageLangSelect = document.getElementById('streamPageLangSelect');
    const streamPageLang = streamPageLangSelect ? streamPageLangSelect.value : 'en';
    
    if (!domain) {
        alert(isAr ? 'الرجاء إدخال اسم النطاق' : 'Please enter a domain name');
        return;
    }
    
    if (!matcheId) {
        alert(isAr ? 'معرف المباراة غير موجود' : 'Match ID not found');
        return;
    }
    
    // Clean domain
    let cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
    
    // Convert dots to dashes
    const subdomain = 'xyz' + cleanDomain.replace(/\./g, '-');
    let streamLink = `https://${subdomain}.goalz.zip/?m=${matcheId}&lang=${streamPageLang}`;
    
    // Add domain_name parameter if provided
    if (domainName) {
        streamLink += `&domain_name=${encodeURIComponent(domainName)}`;
    }
    
    // Show result
    const resultBox = document.getElementById('streamLinkResult');
    const resultValue = document.getElementById('streamResultValue');
    resultValue.textContent = streamLink;
    resultBox.classList.add('show');
    
    // Update button text
    const copyBtn = document.getElementById('copyStreamBtn');
    copyBtn.textContent = isAr ? 'نسخ إلى الحافظة' : 'Copy to Clipboard';
    copyBtn.classList.remove('copied');
    
    // Auto-scroll to result after a brief delay to allow the result box to render
    setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
};

// Copy to Clipboard for Modals
const copyModalContent = async (elementId, button) => {
    const lang = getUrlParam('lang') || 'en';
    const isAr = lang === 'ar';
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    try {
        await navigator.clipboard.writeText(text);
        button.textContent = isAr ? '✓ تم النسخ!' : '✓ Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = isAr ? 'نسخ إلى الحافظة' : 'Copy to Clipboard';
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        alert(isAr ? 'فشل النسخ. الرجاء النسخ يدوياً.' : 'Failed to copy. Please copy manually.');
    }
};

// Update modal content based on language
const updateModalLanguage = (lang = 'en') => {
    const isAr = lang === 'ar';
    
    // Subdomain Modal
    document.getElementById('subdomainModalTitle').textContent = isAr ? 'أنشئ نطاقك الفرعي' : 'Generate Your Subdomain';
    document.getElementById('subdomainModalSubtitle').textContent = isAr ? 'أدخل نطاق موقعك للحصول على نطاقك الفرعي المخصص' : 'Enter your website domain to get your custom subdomain';
    document.getElementById('domainLabel').textContent = isAr ? 'نطاق موقعك:' : 'Your Website Domain:';
    document.getElementById('domainInput').placeholder = isAr ? 'example.com أو example.net' : 'example.com or example.net';
    document.getElementById('domainHint').textContent = isAr ? 'أدخل بدون http:// أو www' : 'Enter without http:// or www';
    document.getElementById('resultLabel').textContent = isAr ? 'نطاقك الفرعي المخصص:' : 'Your Custom Subdomain:';
    document.getElementById('copyBtn').textContent = isAr ? 'نسخ إلى الحافظة' : 'Copy to Clipboard';
    document.getElementById('cancelBtn1').textContent = isAr ? 'إلغاء' : 'Cancel';
    document.getElementById('generateBtn').textContent = isAr ? 'أنشئ النطاق الفرعي' : 'Generate Subdomain';
    // Stream Link Modal
    document.getElementById('streamLinkModalTitle').textContent = isAr ? 'أنشئ رابط البث' : 'Generate Stream Link';
    document.getElementById('streamLinkModalSubtitle').textContent = isAr ? 'أنشئ رابط بث لهذه المباراة مع نطاقك الفرعي' : 'Create a stream link for this match with your subdomain';
    document.getElementById('streamDomainLabel').textContent = isAr ? 'نطاق موقعك:' : 'Your Website Domain:';
    document.getElementById('streamDomainInput').placeholder = isAr ? 'example.com أو example.net' : 'example.com or example.net';
    document.getElementById('streamDomainHint').textContent = isAr ? 'أدخل بدون http:// أو www' : 'Enter without http:// or www';
    document.getElementById('domainNameLabel').textContent = isAr ? 'اسم موقعك (اختياري - لتحسين SEO):' : 'Website Name (Optional - for SEO):';
    document.getElementById('domainNameInput').placeholder = isAr ? 'يلا شوت' : 'Yalla Shoot';
    document.getElementById('domainNameHint').textContent = isAr ? 'اسم علامتك التجارية سيظهر فوق المشغل مع رابط follow backlink' : 'Your brand name will appear above the player with a follow backlink';
    document.getElementById('streamPageLangLabel').textContent = isAr ? 'لغة صفحة البث:' : 'Stream Page Language:';
    document.getElementById('streamPageLangHint').textContent = isAr ? 'اللغة التي ستظهر بها صفحة البث' : 'Language for the streaming page interface';
    document.getElementById('streamResultLabel').textContent = isAr ? 'رابط البث الخاص بك:' : 'Your Stream Link:';
    document.getElementById('copyStreamBtn').textContent = isAr ? 'نسخ إلى الحافظة' : 'Copy to Clipboard';
    document.getElementById('howToUseLabel').textContent = isAr ? 'كيفية الاستخدام:' : 'How to use:';
    document.getElementById('howToUseText').textContent = isAr 
        ? 'هذا الرابط جاهز للمشاركة! يتضمن معرف المباراة واللغة المحددة. إذا أضفت اسم موقعك، سيظهر بوضوح فوق المشغل مع رابط SEO مجاني!'
        : 'This link is ready to share! It includes the match ID and selected language. If you added your website name, it will be prominently displayed above the player with a free SEO backlink!';
    document.getElementById('cancelBtn2').textContent = isAr ? 'إلغاء' : 'Cancel';
    document.getElementById('generateStreamBtn').textContent = isAr ? 'أنشئ الرابط' : 'Generate Link';
};

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
    document.addEventListener("DOMContentLoaded", () => {
    // الكلمات المفتاحية الشائعة لروابط ومعرفات الإعلانات
    const adKeywords = ['ad', 'ads', 'doubleclick', 'banner', 'popup', 'sponsor'];

    // دالة للتحقق مما إذا كان العنصر إعلاناً
    const isAdElement = (element) => {
        if (!element || element.nodeType !== 1) return false;
        
        const id = (element.id || '').toLowerCase();
        const className = (element.className || '').toString().toLowerCase();
        const src = (element.src || '').toLowerCase();

        return adKeywords.some(keyword => 
            id.includes(keyword) || 
            className.includes(keyword) || 
            (element.tagName === 'IFRAME' && src.includes(keyword))
        );
    };

    // إزالة الإعلانات الموجودة عند تحميل الصفحة
    document.querySelectorAll('*').forEach(el => {
        if (isAdElement(el)) {
            el.remove();
        }
    });

    // مراقبة الصفحة لاكتشاف أي إعلانات تضاف لاحقاً وحذفها فوراً
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (isAdElement(node)) {
                    node.remove();
                } else if (node.querySelectorAll) {
                    // البحث داخل العناصر الجديدة المضافة
                    node.querySelectorAll('*').forEach(child => {
                        if (isAdElement(child)) {
                            child.remove();
                        }
                    });
                }
            });
        });
    });

    // تشغيل المراقبة على كامل جسم الصفحة
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
});

</body>