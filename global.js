(function() {
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
    
    // تعريف قاعدة البيانات عالمياً بشكل فوري ومباشر
    window.database = firebase.database();
    console.log("تم تعريف window.database بنجاح في global.js");
})();
