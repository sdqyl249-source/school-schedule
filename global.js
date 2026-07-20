
// نستخدم Event Listener لضمان أن Firebase جاهز تماماً
window.database = null;

function setupFirebase() {
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
    
    // إرسال إشارة لكل ملفاتك أن القاعدة أصبحت جاهزة الآن
    window.dispatchEvent(new Event('databaseReady'));
    console.log("تمت التهيئة بنجاح.");
}

// محاولة التهيئة فوراً
if (typeof firebase !== 'undefined') {
    setupFirebase();
} else {
    // إذا لم تحمل المكتبة بعد، انتظرها
    window.addEventListener('load', setupFirebase);
}
