(function() {
    function initialize() {
        // نتحقق إذا كانت مكتبة Firebase قد وصلت للمتصفح
        if (typeof firebase === 'undefined') {
            console.log("انتظار تحميل مكتبة Firebase...");
            setTimeout(initialize, 50); // جرب كل 50 ملي ثانية
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
        
        // الآن نضمن أنها موجودة
        window.database = firebase.database();
        console.log("تم تعريف window.database بنجاح وبشكل آمن.");
    }

    initialize();
})();
