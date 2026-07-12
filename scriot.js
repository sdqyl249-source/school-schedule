// 1. إعدادات Firebase (استبدل بالبيانات الخاصة بك)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// تهيئة آمنة لـ Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();
let state = { lessons: {} };

// 2. دالة الرسم (Render) - تم إصلاحها لتعرض البيانات في الجدول
function render() {
    const tableBody = document.getElementById('table-body-id'); // تأكد أن الـ ID في HTML هو نفس هذا
    if (!tableBody) return;

    tableBody.innerHTML = ''; 

    if (state.lessons) {
        Object.keys(state.lessons).forEach(key => {
            const lesson = state.lessons[key];
            tableBody.innerHTML += `<tr>
                <td>${lesson.subject || ''}</td>
                <td>${lesson.teacher || ''}</td>
                <td>${lesson.time || ''}</td>
            </tr>`;
        });
    }
}

// 3. جلب البيانات لحظياً
database.ref('lessons_schedule').on('value', (snapshot) => {
    const data = snapshot.val();
    state.lessons = data || {}; 
    render();
});

// 4. دالة الحفظ
function saveData() {
    database.ref('lessons_schedule').set(state.lessons);
}

// 5. العمليات الرئيسية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التحقق من الجلسة
    if (localStorage.getItem('roya_session_active') === "true") {
        setUIAzAdmin();
    }

    // معالجة إرسال الجدول (إضافة حصة جديدة)
    const scheduleForm = document.getElementById('schedule-upload-form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const subject = document.getElementById('sched-subject').value.trim();
            const teacher = document.getElementById('sched-teacher').value.trim();
            const time = document.getElementById('sched-time').value.trim();
            
            database.ref('lessons_schedule').push({ subject, teacher, time }).then(() => {
                alert('تم حفظ الحصة بنجاح!');
                document.getElementById('scheduleModal').style.display = 'none';
                scheduleForm.reset();
            });
        });
    }
});

// دوال الواجهة (الإدارة)
function setUIAzAdmin() {
    const loginNavBtn = document.getElementById('login-nav-btn');
    if (loginNavBtn) {
        loginNavBtn.innerHTML = `👋 الإدارة | <span onclick="localStorage.removeItem('roya_session_active'); window.location.reload();" style="background:red; color:white; padding:2px 6px; border-radius:3px; cursor:pointer;">خروج</span>`;
    }
}
