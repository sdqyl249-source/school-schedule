// 1. التهيئة المركزية
const firebaseConfig = {
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860",
    storageBucket: "roya-platform-26860.firebasestorage.app",
    messagingSenderId: "897544406776",
    appId: "1:897544406776:web:aa112013dea672fb141d0d"
};
// firebase.initializeApp(firebaseConfig); // تأكد من وجود هذا السطر إذا لم يكن مضافاً مسبقاً
const database = firebase.database();

// 2. التحقق من حالة الدخول
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('roya_session_active') === "true") {
        setUIAzAdmin();
    }
    
    // تفعيل الاستماع للتبليغات فور تحميل الصفحة
    listenToNews();
});

// 3. نظام التبليغات (مع دالة الاستماع الديناميكية)
function listenToNews() {
    database.ref('news').on('value', (snapshot) => {
        const news = snapshot.val();
        const display = document.getElementById("news-display");
        if (display && news) {
            display.innerHTML = `<div>${news.text}</div>
                                 <small style="color: gray;">${news.date}</small>`;
        }
    });
}

function addNews() {
    const newsText = prompt("اكتب التبليغ الجديد:");
    if (!newsText) return;

    const newsData = {
        text: newsText,
        date: new Date().toLocaleString('ar-IQ')
    };

    database.ref('news').set(newsData)
        .then(() => alert("تم تحديث التبليغ!"))
        .catch(err => alert("خطأ: " + err));
}

// 4. نظام الشكاوي
function sendComplaint() {
    const compText = document.getElementById("compText").value;
    if (!compText) return alert("يرجى كتابة الشكوى");

    database.ref('complaints').push({
        content: compText,
        timestamp: new Date().toLocaleString('ar-IQ')
    }).then(() => {
        alert("تم إرسال الشكوى للإدارة.");
        document.getElementById("compText").value = "";
    });
}

function loadComplaintsForAdmin() {
    if (localStorage.getItem('roya_session_active') !== "true") return;

    database.ref('complaints').once('value').then((snapshot) => {
        const data = snapshot.val();
        const listContent = document.getElementById("list-content");
        if(listContent && data) {
            listContent.innerHTML = Object.values(data).map(c => 
                `<p style="border-bottom:1px solid #ccc; padding:5px;">${c.content} <br><small>${c.timestamp}</small></p>`
            ).join('');
        }
    });
}

// 5. دوال الإدارة الأصلية الخاصة بك
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
    window.location.reload();
}

// Service Worker (كما في كودك الأصلي)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js');
    });
}
