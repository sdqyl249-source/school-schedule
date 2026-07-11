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
<script>
        // إعدادات الاتصال المباشر بقاعدة بيانات Firebase
        let isCurrentMemberAdmin = false;
        function setUIAzAdmin() {
            isCurrentMemberAdmin = true; // ✅ تحديث القيمة فقط، التعريف موجود في scriot.js
            const loginNavBtn = document.getElementById('login-nav-btn');
            if (loginNavBtn) { 
                loginNavBtn.innerHTML = `👋 الإدارة | <span onclick="logoutCurrentMember(event)" style="background:red; color:white; padding:2px 6px; border-radius:3px; font-size:11px;">خروج</span>`;
                loginNavBtn.removeAttribute('onclick');
            }
            if(document.getElementById('admin-main-dashboard')) document.getElementById('admin-main-dashboard').style.display = 'block';
            if(document.getElementById('admin-gallery-control')) document.getElementById('admin-gallery-control').style.display = 'block';
            if(document.getElementById('admin-th')) document.getElementById('admin-th').style.display = 'table-cell';
            loadHonorStudents(); loadGallery(); loadScheduleData();
        }

        function logoutCurrentMember(event) {
            if (event) event.stopPropagation();
            localStorage.removeItem('roya_session_active'); window.location.reload();
        }

        function logoutCurrentMember(event) {
            if (event) event.stopPropagation();
            localStorage.removeItem('roya_session_active'); window.location.reload();
        }

        function openLoginModal() { document.getElementById('loginModal').style.display = 'flex'; }
        function closeLoginModal() { document.getElementById('loginModal').style.display = 'none'; document.getElementById('direct-login-form').reset(); }
        function openGalleryModal() { document.getElementById('galleryModal').style.display = 'flex'; }
        function closeGalleryModal() { document.getElementById('galleryModal').style.display = 'none'; document.getElementById('gallery-upload-form').reset(); }
        function openScheduleModal() { document.getElementById('scheduleModal').style.display = 'flex'; }
        function closeScheduleModal() { document.getElementById('scheduleModal').style.display = 'none'; document.getElementById('schedule-upload-form').reset(); }

        document.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('roya_session_active') === "true") { setUIAzAdmin(); }
            
            loadTickerText();
            loadHonorStudents();
            loadGallery();
            loadScheduleData();

            document.getElementById('direct-login-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const phone = document.getElementById('modal-login-phone').value.trim();
                const code = document.getElementById('modal-login-code').value.trim();
                
                database.ref('members/' + phone).once('value').then((snapshot) => {
                    if (snapshot.exists() && String(snapshot.val().code) === String(code)) {
                        localStorage.setItem('roya_session_active', 'true'); 
                        alert('تم الدخول بنجاح بصلاحيات مسؤول الإدارة!');
                        window.location.reload();
                    } else { alert('خطأ في رقم الهاتف أو رمز التحقق السري!'); }
                });
            });

            document.getElementById('schedule-upload-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const subject = document.getElementById('sched-subject').value.trim();
                const teacher = document.getElementById('sched-teacher').value.trim();
                const time = document.getElementById('sched-time').value.trim();

                database.ref('lessons_schedule').push({ subject, teacher, time }).then(() => {
                    alert('تم حفظ الحصة في الجدول بنجاح!');
                    closeScheduleModal();
                });
            });

            document.getElementById('gallery-upload-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const title = document.getElementById('gallery-title').value.trim();
                const desc = document.getElementById('gallery-desc').value.trim();
                const fileInput = document.getElementById('gallery-file-input');
                const submitBtn = document.getElementById('gallery-submit-btn');
                
                if (fileInput.files.length === 0) return alert('الرجاء اختيار ملف صورة أو فيديو أولاً');
                const file = fileInput.files[0];
                const fileType = file.type.startsWith('video/') ? 'video' : 'image';
                if (file.size > 8 * 1024 * 1024) return alert('الملف كبير جداً، يرجى اختيار ملف بحجم أقل من 8 ميجابايت.');

                submitBtn.disabled = true;
                submitBtn.innerText = "جاري الرفع والمعالجة الفورية... ⏳";

                const reader = new FileReader();
                reader.onload = function(event) {
                    database.ref('gallery').push({
                        title: title,
                        description: desc,
                        mediaUrl: event.target.result,
                        mediaType: fileType,
                        date: new Date().toLocaleDateString('ar-IQ')
                    }).then(() => {
                        alert('تم النشر بنجاح على المعرض!');
                        submitBtn.disabled = false; submitBtn.innerText = "نشر الفعالية الفوري";
                        closeGalleryModal();
                    });
                };
                reader.readAsDataURL(file);
            });

            document.getElementById('suggestion-form').addEventListener('submit', function(e) {
                e.preventDefault();
                database.ref('suggestions').push({
                    senderName: document.getElementById('sug-name').value.trim() || 'فاعل خير',
                    senderPhone: document.getElementById('sug-phone').value.trim() || 'غير متوفر',
                    message: document.getElementById('sug-text').value.trim(),
                    date: new Date().toLocaleDateString('ar-IQ')
                }).then(() => {
                    alert('تم إرسال اقتراحك للإدارة بنجاح وسرية تامة!');
                    document.getElementById('suggestion-form').reset();
                });
            });
        });

        function loadTickerText() {
            database.ref('ticker_announcement').on('value', (snapshot) => {
                const val = snapshot.val();
                document.getElementById('ticker-text-container').innerText = val ? val : "أهلاً بكم في المنصة التعليمية الرسمية لمدرسة رؤية.. نلتزم ببناء مستقبل واعد لأبنائنا";
            });
        }

        // دالات فارغة لمنع حدوث أخطاء برمجية في Console المتصفح في حال لم تستدعِها بعد
        function loadHonorStudents() {}
        function loadGallery() {}
        function loadScheduleData() {}
   if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker مسجل بنجاح"))
    .catch(err => console.error("فشل التسجيل:", err));
}
   </script>
