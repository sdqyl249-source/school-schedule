// global.js
// global.js - النسخة المصححة لضمان التهيئة
(function() {
    const config = {
        apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
        authDomain: "roya-platform-26860.firebaseapp.com",
        databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
        projectId: "roya-platform-26860",
        storageBucket: "roya-platform-26860.firebasestorage.app",
        messagingSenderId: "897544406776",
        appId: "1:897544406776:web:aa112013dea672fb141d0d"
    };
    
    // تهيئة Firebase هنا لضمان توفرها لجميع الملفات الأخرى
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    window.database = firebase.database();
})();

// الآن نكمل كود الـ DOMContentLoaded الخاص بك...
document.addEventListener('DOMContentLoaded', function() {
    // ... باقي الكود الخاص بك
document.addEventListener('DOMContentLoaded', function() {
    const isLoginPage = window.location.pathname.endsWith("login.html");
    if (isLoginPage) return; 

    const userString = localStorage.getItem("currentUser");
    if (!userString) {
        window.location.href = "login.html";
    } else {
        const userProfile = JSON.parse(userString);
        applyPermissions(userProfile.role);
    }
});

function applyPermissions(role) {
    if (role === "student") {
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = 'none');
    }
}

// قمنا بتحويل الكود الخاص بالـ ref إلى دالة ليتم استدعاؤها لاحقاً
window.createNewUser = function(phone, fullName, userProfile) {
    if (!window.database) {
        console.error("قاعدة البيانات غير متوفرة حالياً");
        return;
    }
    window.database.ref('users/' + phone).set(userProfile).then(() => {
        alert("أهلاً بك يا " + fullName + "، تم إنشاء حسابك بنجاح.");
        window.location.href = "index.html";
    }).catch(error => {
        console.error("خطأ في إنشاء المستخدم:", error);
    });
};
