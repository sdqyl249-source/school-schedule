// ==========================================
// ملف scriot.js - المنصة التعليمية "رؤية"
// ==========================================

// 1. التنقل بين الصفحات
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// 2. تحديث التاريخ والوقت (تلقائي كل ثانية)
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    const dateEl = document.getElementById('date-display');
    const timeEl = document.getElementById('time-display');
    
    if (dateEl) dateEl.innerText = now.toLocaleDateString('ar-IQ', options);
    if (timeEl) timeEl.innerText = now.toLocaleTimeString('ar-IQ');
}
setInterval(updateDateTime, 1000);

// 3. إدارة نظام تسجيل الدخول البسيط
function handleAuth() {
    const level = localStorage.getItem("userLevel");
    if (level) { 
        localStorage.removeItem("userLevel"); 
        alert("تم تسجيل الخروج بنجاح"); 
    } else {
        const code = prompt("يرجى إدخال رمز الدخول:");
        if (code === "ahmed") {
            localStorage.setItem("userLevel", "admin");
            alert("تم تسجيل الدخول كمدير");
        } else {
            alert("رمز خاطئ");
        }
    }
    location.reload();
}

// 4. وظائف الإضافة (محاكاة محلية حتى نربط القاعدة)
function addAnnouncement() {
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    if (!title) return alert("يرجى كتابة عنوان الإعلان");
    
    const list = document.getElementById('announcements-list');
    list.innerHTML += `<div class="card"><h4>${title}</h4><p>${text}</p></div>`;
    
    document.getElementById('ann-title').value = '';
    document.getElementById('ann-text').value = '';
}

function addClass() {
    const name = document.getElementById('class-name').value;
    const section = document.getElementById('section-name').value;
    if (!name) return alert("يرجى كتابة اسم الصف");
    
    const list = document.getElementById('classes-list');
    list.innerHTML += `<div class="card">الصف: ${name} - الشعبة: ${section}</div>`;
    
    document.getElementById('class-name').value = '';
}

function addSchedule() {
    alert("تمت إضافة الحصة للجدول (نظام محلي)");
}

function addBook() {
    alert("تمت إضافة الكتاب للمكتبة (نظام محلي)");
}

// 5. التهيئة عند تحميل الصفحة
window.onload = function() {
    updateDateTime();
    
    // تحديث حالة زر تسجيل الدخول
    const btn = document.getElementById("authBtn");
    if (btn) {
        btn.innerText = localStorage.getItem("userLevel") ? "🔓 خروج" : "🔐 تسجيل الدخول";
    }
    
    // تحديث نبذة المدرسة (عرض مبدئي)
    const vision = document.getElementById('school-vision');
    if (vision) vision.contentEditable = (localStorage.getItem("userLevel") === "admin");
};
