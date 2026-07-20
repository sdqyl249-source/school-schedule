(function initializeDatabase() {
    // التحقق من أن مكتبة firebase تم تحميلها
    if (typeof firebase === 'undefined') {
        console.warn("مكتبة Firebase لم تُحمل بعد، انتظر 100ms...");
        setTimeout(initializeDatabase, 100);
        return;
    }

    const config = {
        apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
        databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
        projectId: "roya-platform-26860",
        storageBucket: "roya-platform-26860.appspot.com",
        messagingSenderId: "897544406776",
        appId: "1:897544406776:web:aa112013dea672fb141d0d"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    
    window.database = firebase.database();
    console.log("تم تهيئة window.database بنجاح وبشكل آمن.");
})();

document.addEventListener('DOMContentLoaded', function() {
    const isLoginPage = window.location.pathname.endsWith("login.html");
    if (isLoginPage) return; 

    const userString = localStorage.getItem("currentUser");
    if (!userString) {
        window.location.href = "login.html";
    }
});
