// global.js - النسخة المصححة لضمان التهيئة
(function() {
    const config = {
        apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
        authDomain: "roya-platform-26860.firebaseapp.com",
        databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
        projectId: "roya-platform-26860",
        storageBucket: "roya-platform-26860.appspot.com", // ✅ تم التصحيح هنا
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
    console.log("تم تحميل ملف global.js بنجاح");

    const isLoginPage = window.location.pathname.endsWith("login.html");
    if (isLoginPage) return; 

    const userString = localStorage.getItem("currentUser");
    if (!userString) {
        // إذا لم يكن هناك مستخدم مسجل، نعيده لصفحة تسجيل الدخول
        window.location.href = "login.html";
    } else {
        const userProfile = JSON.parse(userString);
        applyPermissions(userProfile.role);
    }
});

// دالة لتطبيق الصلاحيات حسب الدور
function applyPermissions(role) {
    if (role === "student") {
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = 'none');
    }
}

// دالة لإنشاء مستخدم جديد في قاعدة البيانات
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
