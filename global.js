(function() {
    const firebaseConfig = {
        apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
        authDomain: "roya-platform-26860.firebaseapp.com",
        databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
        projectId: "roya-platform-26860",
        storageBucket: "roya-platform-26860.appspot.com",
        messagingSenderId: "897544406776",
        appId: "1:897544406776:web:aa112013dea672fb141d0d"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // إنشاء كائن قاعدة البيانات عالمياً ليكون متاحاً لجميع الملفات
    window.database = firebase.database();
    console.log("تم تعريف window.database بنجاح في ملف global.js");
})();

document.addEventListener('DOMContentLoaded', function() {
    const isLoginPage = window.location.pathname.endsWith("login.html");
    if (isLoginPage) return; 

    const userString = localStorage.getItem("currentUser");
    if (!userString) {
        window.location.href = "login.html";
    }
});
