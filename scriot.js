alert("تم التحميل");// إعدادات Firebase (يجب وضع بيانات مشروعك الخاصة من لوحة تحكم Firebase)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// تهيئة Firebase
// بدلاً من السطر القديم، استخدم هذا الكود:
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // إذا كان موجوداً، استخدمه كما هو
}
const database = firebase.database();const database = firebase.database();
// ... كود تهيئة Firebase (initialize) ...

// هذا الجزء يوضع مرة واحدة في بداية الملف لجلب البيانات فور تحميل الصفحة
database.ref('lessons_schedule').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        state.lessons = data; // تأكد من وضع البيانات في المكان الصحيح داخل الـ state
        render(); 
    }
});
// اجعل التحديث مركزياً
function update(key, r, d, type, val) { 
    state.lessons[key][r][d][type] = val; 
    saveData(); // هي ستتولى الحفظ والرسم
}

function saveData() { 
    // لكي يتم الحفظ في نفس المسار
    database.ref('lessons_schedule').set(state.lessons);
    render(); 
}
let isCurrentMemberAdmin = false;

// 2. دوال الإدارة والواجهة
function setUIAzAdmin() {
    isCurrentMemberAdmin = true;
    const loginNavBtn = document.getElementById('login-nav-btn');
    if (loginNavBtn) {
        loginNavBtn.innerHTML = `👋 الإدارة | <span onclick="logoutCurrentMember(event)" style="background:red; color:white; padding:2px 6px; border-radius:3px; cursor:pointer;">خروج</span>`;
        loginNavBtn.style.backgroundColor = '#ffe4c4';
        loginNavBtn.style.color = '#4a3b32';
    }
    
    // إظهار عناصر لوحة التحكم
    const adminElements = ['admin-main-dashboard', 'admin-gallery-control', 'admin-th'];
    adminElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === 'admin-th') ? 'table-cell' : 'block';
    });
    
    loadHonorStudents();
    loadGallery();
    loadScheduleData();
}

function logoutCurrentMember(event) {
    if (event) event.stopPropagation();
    localStorage.removeItem('roya_session_active');
    window.location.reload();
}

// 3. دوال النوافذ المنبثقة (Modals)
function openLoginModal() { document.getElementById('loginModal').style.display = 'flex'; }
function closeLoginModal() { document.getElementById('loginModal').style.display = 'none'; document.getElementById('direct-login-form').reset(); }
function openGalleryModal() { document.getElementById('galleryModal').style.display = 'flex'; }
function closeGalleryModal() { document.getElementById('galleryModal').style.display = 'none'; document.getElementById('gallery-upload-form').reset(); }
function openScheduleModal() { document.getElementById('scheduleModal').style.display = 'flex'; }
function closeScheduleModal() { document.getElementById('scheduleModal').style.display = 'none'; document.getElementById('schedule-upload-form').reset(); }

// 4. العمليات الرئيسية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('roya_session_active') === "true") {
        setUIAzAdmin();
    }
    
    loadTickerText();

    // معالجة تسجيل الدخول المباشر
    const directLoginForm = document.getElementById('direct-login-form');
    if (directLoginForm) {
        directLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phone = document.getElementById('modal-login-phone').value.trim();
            const code = document.getElementById('modal-login-code').value.trim();
            
            database.ref('members/' + phone).once('value').then((snapshot) => {
                if (snapshot.exists() && String(snapshot.val().code) === String(code)) {
                    localStorage.setItem('roya_session_active', 'true');
                    alert('تم الدخول بنجاح بصلاحيات مسؤول الإدارة!');
                    window.location.reload();
                } else {
                    alert('خطأ في رقم الهاتف أو رمز التحقق السري!');
                }
            });
        });
    }

    // معالجة الجدول
    const scheduleForm = document.getElementById('schedule-upload-form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const subject = document.getElementById('sched-subject').value.trim();
            const teacher = document.getElementById('sched-teacher').value.trim();
            const time = document.getElementById('sched-time').value.trim();
            database.ref('lessons_schedule').push({ subject, teacher, time }).then(() => {
                alert('تم حفظ الحصة في الجدول بنجاح!');
                closeScheduleModal();
            });
        });
    }

    // معالجة المعرض
    const galleryForm = document.getElementById('gallery-upload-form');
    if (galleryForm) {
        galleryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('gallery-title').value.trim();
            const desc = document.getElementById('gallery-desc').value.trim();
            const fileInput = document.getElementById('gallery-file-input');
            const submitBtn = document.getElementById('gallery-submit-btn');
            
            if (fileInput.files.length === 0) return alert('الرجاء اختيار ملف!');
            const file = fileInput.files[0];
            if (file.size > 8 * 1024 * 1024) return alert('الملف كبير جداً!');

            submitBtn.disabled = true;
            const reader = new FileReader();
            reader.onload = function(event) {
                database.ref('gallery').push({
                    title, description: desc, mediaUrl: event.target.result,
                    mediaType: file.type.startsWith('video/') ? 'video' : 'image',
                    date: new Date().toLocaleDateString('ar-IQ')
                }).then(() => {
                    alert('تم النشر بنجاح!');
                    submitBtn.disabled = false;
                    closeGalleryModal();
                });
            };
            reader.readAsDataURL(file);
        });
    }

    // معالجة الاقتراحات
    const sugForm = document.getElementById('suggestion-form');
    if (sugForm) {
        sugForm.addEventListener('submit', function(e) {
            e.preventDefault();
            database.ref('suggestions').push({
                senderName: document.getElementById('sug-name').value.trim() || 'فاعل خير',
                senderPhone: document.getElementById('sug-phone').value.trim() || 'غير متوفر',
                message: document.getElementById('sug-text').value.trim(),
                date: new Date().toLocaleDateString('ar-IQ')
            }).then(() => {
                alert('تم إرسال اقتراحك للإدارة بنجاح!');
                sugForm.reset();
            });
        });
    }
});

function loadTickerText() {
    database.ref('ticker_announcement').on('value', (snapshot) => {
        const val = snapshot.val();
        const container = document.getElementById('ticker-text-container');
        if (container) container.innerText = val ? val : "أهلاً بكم في المنصة التعليمية الرسمية لمدرسة رؤية.. نلتزم ببناء مستقبل واعد لأبنائنا";
    });
}

// دوال فارغة (يمكنك ملؤها لاحقاً)
function loadHonorStudents() {}
function loadGallery() {}
function loadScheduleData() {}
function loadBooksFromFirebase() {}
function loadNotificationsFromFirebase() {}

// تسجيل Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .catch(err => console.error("فشل التسجيل:", err));
}
