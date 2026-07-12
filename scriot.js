<script>
    // 1. التهيئة المركزية (تُنفذ مرة واحدة فقط)
    const firebaseConfig = {
        apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
        authDomain: "roya-platform-26860.firebaseapp.com",
        databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
        projectId: "roya-platform-26860",
        storageBucket: "roya-platform-26860.firebasestorage.app",
        messagingSenderId: "897544406776",
        appId: "1:897544406776:web:aa112013dea672fb141d0d"
    };
    const database = firebase.database();

    // 2. دوال الإدارة والتحكم (موحدة)
    function setUIAzAdmin() {
        const loginNavBtn = document.getElementById('login-nav-btn');
        if (loginNavBtn) { 
            loginNavBtn.innerHTML = `👋 الإدارة | <span onclick="logoutCurrentMember(event)" style="color:red; cursor:pointer;">خروج</span>`;
        }
        if(document.getElementById('admin-main-dashboard')) document.getElementById('admin-main-dashboard').style.display = 'block';
        if(document.getElementById('admin-gallery-control')) document.getElementById('admin-gallery-control').style.display = 'block';
    }

    function logoutCurrentMember(event) {
        if (event) event.stopPropagation();
        localStorage.removeItem('roya_session_active'); 
        window.location.reload();
    }

    // 3. التحقق من حالة الدخول عند التحميل
    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem('roya_session_active') === "true") {
            setUIAzAdmin();
        }

        // استدعاء دوال تحميل البيانات (تأكد من تعريفها لاحقاً في الكود)
        if(typeof loadTickerText === 'function') loadTickerText();
        if(typeof loadHonorStudents === 'function') loadHonorStudents();
        if(typeof loadGallery === 'function') loadGallery();
        if(typeof loadScheduleData === 'function') loadScheduleData();
    });

    // 4. تسجيل الـ Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('✅ Service Worker مسجل'))
                .catch(err => console.error('❌ خطأ:', err));
        });
    }
</script>
