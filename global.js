// global.js - النسخة النهائية الموحدة

// 1. تهيئة Firebase (يجب أن تسبق كل شيء)
const firebaseConfig = {
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860",
    storageBucket: "roya-platform-26860.firebasestorage.app",
    messagingSenderId: "897544406776",
    appId: "1:897544406776:web:aa112013dea672fb141d0d"
};

// تهيئة قاعدة البيانات لتصبح متاحة عالمياً
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
window.database = firebase.database();

// 2. التحقق من الدخول وتطبيق الصلاحيات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // استثناء صفحة تسجيل الدخول
    const isLoginPage = window.location.pathname.endsWith("login.html");
    if (isLoginPage) return; 

    // التحقق من وجود المستخدم
    const userString = localStorage.getItem("currentUser");
    
    if (!userString) {
        alert("يرجى تسجيل الدخول أولاً للوصول إلى المنصة.");
        window.location.href = "login.html";
    } else {
        const userProfile = JSON.parse(userString);
        console.log("أهلاً بك يا " + userProfile.name + "، دورك هو: " + userProfile.role);
        
        applyPermissions(userProfile.role);
    }
});

// دالة تطبيق الصلاحيات (إخفاء أدوات الأستاذ عن الطلاب)
function applyPermissions(role) {
    if (role === "student") {
        const adminElements = document.querySelectorAll(".admin-only");
        adminElements.forEach(el => {
            el.style.display = 'none';
        });
        console.log("تم تطبيق صلاحيات الطالب: تم إخفاء عناصر التحكم.");
    }
}

// دالة تسجيل المستخدم (تُستدعى عند إنشاء حساب جديد في login.html)
window.registerUser = function(fullName, phone, role) {
    const userProfile = {
        name: fullName,
        phone: phone,
        role: role, 
        joinedClasses: [] 
    };
    
    localStorage.setItem("currentUser", JSON.stringify(userProfile));
    
    // حفظ البيانات في قاعدة البيانات أيضاً
    window.database.ref('users/' + phone).set(userProfile).then(() => {
        alert("أهلاً بك يا " + fullName + "، تم إنشاء حسابك بنجاح.");
        window.location.href = "index.html";
    });
};
