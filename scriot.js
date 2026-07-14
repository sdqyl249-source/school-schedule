// 1. التهيئة المركزية (Firebase)
firebase.initializeApp({
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860",
    storageBucket: "roya-platform-26860.firebasestorage.app",
    messagingSenderId: "897544406776",
    appId: "1:897544406776:web:aa112013dea672fb141d0d"
});
const database = firebase.database();

const config = { days: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس"], subjects: ["رياضيات", "علوم", "عربي", "إنجليزي", "رياضة"] };
let state = { lessons: {} };

// 2. التحقق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateUIState();
    renderNews();
    render(); // عرض الجداول عند التحميل
    
    if(typeof loadTickerText === 'function') loadTickerText();
    if(typeof loadHonorStudents === 'function') loadHonorStudents();
    if(typeof loadGallery === 'function') loadGallery();
});

// 3. الدوال الموحدة (UI & Navigation)
function toggleSidebar() {
    const sidebar = document.getElementById('mySidebar');
    if (sidebar) sidebar.style.width = (sidebar.style.width === '280px') ? '0' : '280px';
}

function show(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(id);
    if(el) el.classList.add('active');
}

function openUploadModal() { document.getElementById('uploadModal').style.display = 'block'; }
function closeUploadModal() { document.getElementById('uploadModal').style.display = 'none'; }

// 4. نظام الصلاحيات
function toggleAuth() {
    let isAdmin = localStorage.getItem("isAdmin") === "true";
    let newState = !isAdmin;
    localStorage.setItem("isAdmin", newState);
    localStorage.setItem("roya_session_active", newState ? "true" : "false");
    alert("تم تفعيل وضع الإدارة");
    location.reload();
}

function updateUIState() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const authBtn = document.getElementById("authBtn");
    if (authBtn) authBtn.innerText = isAdmin ? "🔓 تسجيل الخروج" : "🔐 تسجيل الدخول";
    
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = isAdmin ? 'block' : 'none');
    
    if (isAdmin) setUIAzAdmin();
}

function setUIAzAdmin() {
    const loginNavBtn = document.getElementById('login-nav-btn');
    if (loginNavBtn) loginNavBtn.innerHTML = `👋 الإدارة | <span onclick="logoutCurrentMember(event)" style="color:red; cursor:pointer;">خروج</span>`;
}

function logoutCurrentMember(event) {
    if (event) event.stopPropagation();
    localStorage.removeItem('roya_session_active');
    localStorage.setItem('isAdmin', "false");
    window.location.reload();
}

// 5. دوال الجداول
database.ref('school_data').on('value', (snapshot) => {
    if(snapshot.exists()) { state = snapshot.val(); render(); }
});

function render() {
    const app = document.getElementById("app");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if(!app) return;

    app.innerHTML = "";
    for (let key in state.lessons) {
        // ... (كود بناء الجدول كما كان)
        let html = `<table><tr><th>حصة</th>${config.days.map(d=>`<th>${d}</th>`).join('')}</tr>`;
        // ... استمر في بناء الجدول
    }
}

function update(key, r, d, type, val) { state.lessons[key][r][d][type] = val; database.ref('school_data').set(state); }

// 6. التبليغات والشكاوى
function addNews() {
    const newsText = prompt("أدخل التبليغ الجديد:");
    if (!newsText) return;
    database.ref('news').set({ text: newsText, date: new Date().toLocaleDateString('ar-IQ'), time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })});
}

function renderNews() {
    const display = document.getElementById("news-display");
    if (!display) return;
    database.ref('news').on('value', (snapshot) => {
        const news = snapshot.val();
        if (news) display.innerHTML = `<div>${news.text}</div>`;
    });
}

function sendComplaint() {
    const input = document.getElementById("compText");
    if (!input || !input.value) return;
    database.ref('complaints').push({ content: input.value, timestamp: new Date().toLocaleString('ar-IQ') });
    alert("تم الإرسال");
}
