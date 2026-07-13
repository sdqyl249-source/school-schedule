// 1. التهيئة المركزية (Firebase)
// تهيئة Firebase (يجب أن تكون في بداية الملف)
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

// 2. التحقق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تحديث حالة الأزرار والحقول فوراً
    updateUIState(); 

    if (localStorage.getItem('roya_session_active') === "true") {
        setUIAzAdmin();
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    }
    renderNews(); 
    
    if(typeof loadTickerText === 'function') loadTickerText();
    if(typeof loadHonorStudents === 'function') loadHonorStudents();
    if(typeof loadGallery === 'function') loadGallery();
    if(typeof loadScheduleData === 'function') loadScheduleData();
});

// 3. نظام الصلاحيات (الدالة الموحدة)
function toggleAuth() {
    let isAdmin = localStorage.getItem("isAdmin") === "true";
    let newState = !isAdmin;
    
    // حفظ الحالة الجديدة
    localStorage.setItem("isAdmin", newState);
    localStorage.setItem("roya_session_active", newState ? "true" : "false");
    
    // تحديث الواجهة فوراً
    updateUIState();
    
    // الرسالة التي تظهر لك
    alert("تم تفعيل وضع الإدارة");
    
    // إعادة التحميل ليظهر كل شيء بشكل سليم
    location.reload(); 
}

// 4. نظام التبليغات (الدالة الموحدة والمطورة)
// 1. إرسال التبليغ إلى Firebase
function addNews() {
    const newsText = prompt("أدخل التبليغ الجديد:");
    if (!newsText) return;

    const newsData = {
        text: newsText,
        date: new Date().toLocaleDateString('ar-IQ'),
        time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
    };
    
    // التخزين في Firebase
    database.ref('news').set(newsData)
        .then(() => alert("تم تحديث التبليغ للجميع!"))
        .catch(err => alert("خطأ في الاتصال: " + err));
}

// 2. جلب التبليغ لحظياً من Firebase (تلقائي)
function renderNews() {
    const display = document.getElementById("news-display");
    if (!display) return;
    
    // الاستماع لأي تغيير في قاعدة البيانات
    database.ref('news').on('value', (snapshot) => {
        const news = snapshot.val();
        if (news) {
            display.innerHTML = `
                <div style="padding: 15px; background: #e3f2fd; border-radius: 10px; border-right: 5px solid var(--main-blue);">
                    <p style="font-size: 1.1em; color: #1a237e;">${news.text}</p>
                    <small style="color: #666;">${news.date} | ${news.time}</small>
                </div>`;
        }
    });
}
// 5. نظام الشكاوي (الدالة الموحدة)
function sendComplaint() {
    const input = document.getElementById("compText");
    if (!input || !input.value) return alert("الرجاء كتابة الشكوى");
    
    // إضافة الشكوى إلى قاعدة البيانات
    database.ref('complaints').push({
        content: input.value,
        timestamp: new Date().toLocaleString('ar-IQ'),
        status: 'جديدة' // إضافة حالة للشكوى
    }).then(() => {
        alert("تم إرسال شكواك للإدارة بنجاح!");
        input.value = "";
    }).catch(err => alert("حدث خطأ أثناء الإرسال: " + err));
}

function viewComplaints() {
    const listContent = document.getElementById("list-content");
    if (!listContent) return;

    listContent.innerHTML = "جاري تحميل الشكاوى...";

    database.ref('complaints').once('value').then((snapshot) => {
        const complaints = snapshot.val();
        if (!complaints) {
            listContent.innerHTML = "<p>لا توجد شكاوى حالياً.</p>";
            return;
        }

        // تحويل البيانات من Firebase إلى مصفوفة لعرضها
        let html = "";
        Object.keys(complaints).forEach(key => {
            const c = complaints[key];
            html += `
                <div style="padding: 15px; border-bottom: 2px solid #eee; margin-bottom: 10px; background: #fff;">
                    <p style="font-size: 1em;">${c.content}</p>
                    <small style="color: #666;">تاريخ الإرسال: ${c.timestamp}</small>
                </div>`;
        });
        listContent.innerHTML = html;
    });
}
// 6. دوال إضافية
function show(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function downloadCert() {
    if(typeof html2pdf !== 'undefined') {
        html2pdf().from(document.getElementById('cert')).save('شهادة_تقدير.pdf');
    } else {
        alert("مكتبة PDF غير محملة");
    }
}

function setUIAzAdmin() {
    const loginNavBtn = document.getElementById('login-nav-btn');
    if (loginNavBtn) { 
        loginNavBtn.innerHTML = `👋 الإدارة | <span onclick="logoutCurrentMember(event)" style="color:red; cursor:pointer;">خروج</span>`;
    }
}

function logoutCurrentMember(event) {
    if (event) event.stopPropagation();
    localStorage.removeItem('roya_session_active'); 
    localStorage.setItem('isAdmin', "false");
    window.location.reload();
}
// 7. الدالة المفقودة التي تسبب الخطأ
function updateUIState() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const authBtn = document.getElementById("authBtn");
    
    // تحديث نص زر تسجيل الدخول
    if (authBtn) {
        authBtn.innerText = isAdmin ? "🔓 تسجيل الخروج" : "🔐 تسجيل الدخول";
    }
    
    // تحديث ظهور العناصر المخصصة للإدارة
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? 'block' : 'none';
    });
}
function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar.style.width === "0px") {
        sidebar.style.width = "280px";
    } else {
        sidebar.style.width = "0px";
    }
}
