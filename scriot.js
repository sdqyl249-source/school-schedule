// =========================================================
// ملف scriot.js - منصة الوادي التعليمية
// =========================================================

// 1. التنقل بين الصفحات
function showPage(id) {
    const pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
}

// 2. تحديث التاريخ والوقت
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateEl = document.getElementById('date-display');
    const timeEl = document.getElementById('time-display');
    
    if (dateEl) dateEl.innerText = now.toLocaleDateString('ar-IQ', options);
    if (timeEl) timeEl.innerText = now.toLocaleTimeString('ar-IQ');
}
setInterval(updateDateTime, 1000);

// 3. نظام الصلاحيات (تسجيل الدخول للمدير)
function handleAuth() {
    if (localStorage.getItem("admin")) {
        localStorage.removeItem("admin");
        alert("تم تسجيل الخروج بنجاح");
        location.reload();
    } else {
        const pass = prompt("يرجى إدخال كلمة مرور المدير:");
        if (pass === "1234") { // كلمة المرور الافتراضية
            localStorage.setItem("admin", "true");
            alert("تم الدخول بنظام الإدارة");
            location.reload();
        } else {
            alert("كلمة مرور خاطئة!");
        }
    }
}

// 4. إدارة لوحة الإعلانات (نشر، تعديل، حذف)
function addAnnouncement() {
    if (!localStorage.getItem("admin")) return alert("هذه الصلاحية للمدير فقط!");
    
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    
    if (title.trim() === "" || text.trim() === "") return alert("يرجى تعبئة الحقول!");
    
    database.ref('announcements').push({ 
        title: title, 
        text: text, 
        date: new Date().toLocaleDateString('ar-IQ') 
    }).then(() => {
        document.getElementById('ann-title').value = "";
        document.getElementById('ann-text').value = "";
        alert("تم نشر الإعلان بنجاح!");
    });
}

function deleteAnnouncement(id) {
    if (!localStorage.getItem("admin")) return;
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;
    database.ref('announcements/' + id).remove();
}

function editAnnouncement(id, oldTitle, oldText) {
    if (!localStorage.getItem("admin")) return;
    const newTitle = prompt("تعديل العنوان:", oldTitle);
    const newText = prompt("تعديل النص:", oldText);
    
    if (newTitle !== null && newText !== null) {
        database.ref('announcements/' + id).update({ title: newTitle, text: newText });
    }
}

// 5. إدارة الصفوف
function addClass() {
    if (!localStorage.getItem("admin")) return;
    const name = document.getElementById('class-name').value;
    const section = document.getElementById('section-name').value;
    database.ref('classes').push({ name, section });
}

// 6. إدارة الجدول
function addSchedule() {
    if (!localStorage.getItem("admin")) return;
    const sub = document.getElementById('sub-name').value;
    database.ref('schedule').push({ sub });
}

// 7. إدارة المكتبة
function addBook() {
    if (!localStorage.getItem("admin")) return;
    const name = document.getElementById('book-name').value;
    database.ref('library').push({ name });
}

// 8. جلب البيانات وعرضها فورياً من Firebase
database.ref('announcements').on('value', snap => {
    const list = document.getElementById('announcements-list');
    const isAdmin = localStorage.getItem("admin");
    list.innerHTML = "";
    snap.forEach(c => {
        const data = c.val();
        const id = c.key;
        list.innerHTML += `
            <div class="card" style="border-right-color: #27ae60;">
                <small>${data.date || ''}</small>
                <h3>${data.title}</h3>
                <p>${data.text}</p>
                ${isAdmin ? `
                    <div style="margin-top:10px; border-top:1px solid #ddd; padding-top:10px;">
                        <button onclick="editAnnouncement('${id}', '${data.title}', '${data.text}')" style="background:#3498db;">تعديل</button>
                        <button onclick="deleteAnnouncement('${id}')" style="background:#e74c3c;">حذف</button>
                    </div>` : ''}
            </div>`;
    });
});

database.ref('classes').on('value', snap => {
    const list = document.getElementById('classes-list');
    list.innerHTML = "";
    snap.forEach(c => {
        list.innerHTML += `<div class="card">صف: ${c.val().name} - شعبة: ${c.val().section}</div>`;
    });
});

// 9. تهيئة عند تحميل الصفحة
window.onload = () => {
    updateDateTime();
    
    // إظهار حقول المدير
    if (localStorage.getItem("admin")) {
        document.querySelectorAll('.admin-section').forEach(e => e.style.display = 'block');
        const btn = document.getElementById("authBtn");
        if(btn) btn.innerText = "🔓 تسجيل الخروج";
    }
};
