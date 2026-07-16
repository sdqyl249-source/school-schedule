const database = window.database;
function showPage(id) {
    const pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
}
 <script> 
     window.database = firebase.database();
<script>
<script src="scriot.js"><script>
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
    console.log("تم الضغط على زر النشر!"); // أضف هذا السطر
    if (!localStorage.getItem("admin")) return alert("غير مصرح لك!");
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    database.ref('announcements').push({ title, text, date: new Date().toLocaleDateString('ar-IQ') });
    document.getElementById('ann-title').value = "";
    document.getElementById('ann-text').value = "";
}

function deleteAnnouncement(id) {
    database.ref('announcements/' + id).remove();
}

// 6. التحقق من الصلاحيات عند تحميل الصفحة (هذا هو الجزء الأهم)
window.onload = () => {
    updateDateTime();
    
    const isAdmin = localStorage.getItem("admin");

    // تفعيل وضع التعديل للنصوص (الرؤية والنبذة)
    const editableElements = document.querySelectorAll('.editable');
    if (isAdmin) {
        editableElements.forEach(el => {
            el.contentEditable = "true";
            el.style.border = "2px dashed #e67e22"; // إطار يخبرك أنك في وضع التعديل
        });
        
        // إظهار حقول المدير
        document.querySelectorAll('.admin-section').forEach(e => e.style.display = 'block');
        const authBtn = document.getElementById("authBtn");
        if(authBtn) authBtn.innerText = "🔓 تسجيل الخروج";
    }

    // جلب البيانات من Firebase
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
