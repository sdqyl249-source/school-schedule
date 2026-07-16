// تعريف المتغير العام الذي يأتي من ملف HTML
const database = window.database;

// 1. التنقل بين الصفحات
function showPage(id) {
    const pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
}
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.querySelector(".page").style.marginRight = "0"; // تمدد الصفحة
    document.getElementById("openBtn").style.display = "block"; // إظهار زر الفتح
}

function openNav() {
    document.getElementById("mySidebar").style.width = "280px";
    document.querySelector(".page").style.marginRight = "280px"; // إعادة الهامش
    document.getElementById("openBtn").style.display = "none"; // إخفاء زر الفتح
}
// 2. تحديث التاريخ والوقت
function updateDateTime() {
    const now = new Date();
    const dateEl = document.getElementById('date-display');
    const timeEl = document.getElementById('time-display');
    if (dateEl) dateEl.innerText = now.toLocaleDateString('ar-IQ');
    if (timeEl) timeEl.innerText = now.toLocaleTimeString('ar-IQ');
}
setInterval(updateDateTime, 1000);

// 3. نظام الصلاحيات (المدير)
function handleAuth() {
    if (localStorage.getItem("admin")) {
        localStorage.removeItem("admin");
        alert("تم تسجيل الخروج");
        location.reload();
    } else {
        const pass = prompt("يرجى إدخال كلمة مرور المدير:");
        if (pass === "1234") {
            localStorage.setItem("admin", "true");
            location.reload();
        } else {
            alert("كلمة مرور خاطئة!");
        }
    }
}

// 4. الرؤية والنبذة (التعديل المباشر)
function updateInfo(field, text) {
    if (!localStorage.getItem("admin")) return;
    database.ref('settings/' + field).set({ content: text });
}

// 5. إدارة الإعلانات
function addAnnouncement() {
    if (!localStorage.getItem("admin")) return alert("غير مصرح لك!");
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    if (!title || !text) return alert("يرجى ملء الحقول");
    database.ref('announcements').push({ 
        title, text, date: new Date().toLocaleDateString('ar-IQ') 
    });
    document.getElementById('ann-title').value = "";
    document.getElementById('ann-text').value = "";
}

function deleteAnnouncement(id) {
    database.ref('announcements/' + id).remove();
}

// 6. التحقق من الصلاحيات والبيانات عند تحميل الصفحة
window.onload = () => {
    updateDateTime();
    
    // --- كود عداد الزوار ---
    database.ref('visitors').transaction(function(current) {
        return (current || 0) + 1;
    });

    database.ref('visitors').on('value', snap => {
        const countEl = document.getElementById('visitor-count');
        if(countEl) countEl.innerText = snap.val() || 0;
    });
    // -----------------------
    
    const isAdmin = localStorage.getItem("admin");

    // تفعيل وضع التعديل للنصوص
    const editableElements = document.querySelectorAll('.editable');
    if (isAdmin) {
        editableElements.forEach(el => {
            el.contentEditable = "true";
            el.style.border = "2px dashed #e67e22";
        });
        
        document.querySelectorAll('.admin-section').forEach(e => e.style.display = 'block');
        const authBtn = document.getElementById("authBtn");
        if(authBtn) authBtn.innerText = "🔓 تسجيل الخروج";
    }

    // جلب الرؤية
    database.ref('settings/vision').on('value', snap => {
        if(snap.val()) document.getElementById('school-vision').innerText = snap.val().content;
    });

    // جلب الإعلانات
    database.ref('announcements').on('value', snap => {
        const list = document.getElementById('announcements-list');
        if(!list) return;
        list.innerHTML = "";
        snap.forEach(c => {
            const data = c.val();
            const id = c.key;
            list.innerHTML += `
                <div class="card" style="border-right-color: #27ae60;">
                    <small>${data.date || ''}</small>
                    <h3>${data.title}</h3>
                    <p>${data.text}</p>
                    ${isAdmin ? `<button onclick="deleteAnnouncement('${id}')" style="background:#e74c3c;">حذف الإعلان</button>` : ''}
                </div>`;
        });
    });
};
