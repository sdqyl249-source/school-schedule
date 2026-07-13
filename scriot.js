// 1. التهيئة المركزية (Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860",
    storageBucket: "roya-platform-26860.firebasestorage.app",
    messagingSenderId: "897544406776",
    appId: "1:897544406776:web:aa112013dea672fb141d0d"
};
const database = firebase.database();

// 2. التحقق من حالة الدخول عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التحقق من حالة الجلسة الخاصة بك
    if (localStorage.getItem('roya_session_active') === "true") {
        setUIAzAdmin();
    }
    
    // تفعيل عرض التبليغات
    renderNews();
    
    // استدعاء الدوال الأصلية الخاصة بك
    if(typeof loadTickerText === 'function') loadTickerText();
    if(typeof loadHonorStudents === 'function') loadHonorStudents();
    if(typeof loadGallery === 'function') loadGallery();
    if(typeof loadScheduleData === 'function') loadScheduleData();
});

// 3. نظام الصلاحيات (دمج الدوال الجديدة)
function updateUIState() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const authBtn = document.getElementById("authBtn");
    
    if (authBtn) authBtn.innerText = isAdmin ? "🔓 تسجيل الخروج" : "🔐 تسجيل الدخول";
    
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? 'block' : 'none';
    });
    
    const stuNameField = document.getElementById('stuName');
    if (stuNameField) stuNameField.disabled = !isAdmin;
}

function toggleAuth() {
    let isAdmin = localStorage.getItem("isAdmin") === "true";
    localStorage.setItem("isAdmin", !isAdmin);
    localStorage.setItem("roya_session_active", !isAdmin ? "true" : "false");
    updateUIState();
    location.reload();
}

// 4. نظام التبليغات (باستخدام localStorage كما طلبت)
function addNews() {
    const newsText = prompt("أدخل التبليغ الجديد:");
    if (!newsText) return;

    const newsData = {
        text: newsText,
        date: new Date().toLocaleDateString('ar-IQ'),
        time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
    };
    
    localStorage.setItem("newsData", JSON.stringify(newsData));
    renderNews();
}

function renderNews() {
    const news = JSON.parse(localStorage.getItem("newsData"));
    const display = document.getElementById("news-display");
    if (display && news) {
        display.innerHTML = `
            <div style="padding: 10px; background: #eef2f3; border-radius: 5px; border-right: 4px solid #1a237e;">
                ${news.text} <br>
                <small style="color: #666;">${news.date} | ${news.time}</small>
            </div>`;
    }
}

// 5. نظام الشكاوي
function sendComplaint() {
    const input = document.getElementById("compText");
    if (!input || !input.value) return alert("الرجاء كتابة الشكوى");
    
    let complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    complaints.push({
        content: input.value,
        timestamp: new Date().toLocaleString('ar-IQ')
    });
    
    localStorage.setItem("complaints", JSON.stringify(complaints));
    input.value = "";
    alert("تم إرسال شكواك للإدارة.");
}

// 6. الدوال الأصلية الخاصة بمنصتك
function setUIAzAdmin() {
    const loginNavBtn = document.getElementById('login-nav-btn');
    if (loginNavBtn) { 
        loginNavBtn.innerHTML = `👋 الإدارة | <span onclick="logoutCurrentMember(event)" style="color:red; cursor:pointer;">خروج</span>`;
    }
    if(document.getElementById('admin-main-dashboard')) document.getElementById('admin-main-dashboard').style.display = 'block';
    if(document.getElementById('admin-gallery-control')) document.getElementById('admin-gallery-control').style.display = 'block';
}

function logoutCurrentMember(event) {
    if (event) event.stopPropagation();
    localStorage.removeItem('roya_session_active'); 
    localStorage.setItem('isAdmin', "false");
    window.location.reload();
}

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js');
    });
}
