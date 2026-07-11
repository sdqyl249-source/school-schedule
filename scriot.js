// 1. إعدادات الاتصال المباشر (تأكد أنها مطابقة لما حصلت عليه من لوحة تحكم Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860",
    storageBucket: "roya-platform-26860.appspot.com",
    messagingSenderId: "897544406776",
    appId: "1:897544406776:web:aa112013dea672fb141d0d"
};

// تهيئة Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database(); // ✅ تعريف مرة واحدة فقط

// متغير عالمي لحفظ حالة صلاحيات العضو (Admin)
let isCurrentMemberAdmin = false; // ✅ تعريف واحد فقط

// تحويل الواجهة لنمط لوحة التحكم للعضو المصرح له
function setUIAzAdmin() {
    const loginNavBtn = document.getElementById('login-nav-btn');
    if (loginNavBtn) {
        loginNavBtn.innerHTML = `👋 أهلاً بك (لوحة التحكم)`;
        loginNavBtn.style.backgroundColor = '#ffe4c4';
        loginNavBtn.style.color = '#4a3b32';
    }
    const loginMenuForm = document.getElementById('login-menu-form');
    if (loginMenuForm) {
        loginMenuForm.style.display = 'none';
    }
}

// 2. فحص الجلسة المحفوظة تلقائياً عند فتح الصفحة
function checkSavedSession() {
    const sessionToken = localStorage.getItem('roya_session_active');
    if (sessionToken === "true") {
        isCurrentMemberAdmin = true; // ✅ تحديث القيمة فقط
        setUIAzAdmin();
    }
    loadBooksFromFirebase();
    loadNotificationsFromFirebase();
}

// 3. نظام الأكواد المطور والمضمون لحماية تسجيل الدخول
document.addEventListener('DOMContentLoaded', () => {
    checkSavedSession();

    const loginForm = document.getElementById('firebase-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phoneInput = document.getElementById('login-phone').value.trim();
            const codeInput = document.getElementById('login-code').value.trim();

            if (!phoneInput || !codeInput) {
                alert('الرجاء إدخال رقم الهاتف والكود السري.');
                return;
            }

            database.ref('members/' + phoneInput).once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    if (String(userData.code) === String(codeInput)) {
                        alert('مرحباً بك! تم التحقق من الكود بنجاح وتفعيل صلاحيات التحكم.');
                        localStorage.setItem('roya_session_active', 'true');
                        isCurrentMemberAdmin = true; // ✅ تحديث القيمة فقط
                        setUIAzAdmin();
                        loadBooksFromFirebase();
                        loadNotificationsFromFirebase();
                    } else {
                        alert('عذراً! الكود السري غير صحيح.');
                    }
                } else {
                    alert('عذراً! رقم الهاتف هذا غير مسجل في نظام المنصة.');
                }
            }).catch((error) => {
                alert('خطأ في الاتصال بالخادم: ' + error.message);
                console.error("خطأ في الاتصال بالخادم السحابي:", error);
            });
        });
    }
});

// باقي الدوال تبقى كما هي بدون تغيير
