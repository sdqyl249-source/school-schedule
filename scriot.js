// 1. التهيئة المركزية (Firebase)
firebase.initializeApp({
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860",
    storageBucket: "roya-platform-26860.firebasestorage.app",
    messagingSenderId: "897544406776",
    appId: "1:897544406776:web:aa112013dea672fb141d0d"
});
const database = firebase.database();

const config = { 
    days: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس"]
};
let state = { lessons: {} };

// 2. نظام الصلاحيات
function handleAuth() {
    const currentLevel = localStorage.getItem("userLevel");
    if (currentLevel) {
        localStorage.removeItem("userLevel");
        alert("تم تسجيل الخروج");
    } else {
        const code = prompt("يرجى إدخال رمز الدخول:");
        if (code === "ahmed") localStorage.setItem("userLevel", "admin");
        else if (code === "2026") localStorage.setItem("userLevel", "member");
        else localStorage.setItem("userLevel", "visitor");
    }
    location.reload();
}

// 3. الجدول الدراسي
database.ref('school_data/lessons').on('value', (snapshot) => {
    state.lessons = snapshot.val() || {}; 
    render();
});

function getSectionColor(section) {
    const colors = { "أ": "#e74c3c", "ب": "#27ae60", "ج": "#3498db" };
    return colors[section] || "#95a5a6";
}

function render() {
    const app = document.getElementById("schedule-container");
    const level = localStorage.getItem("userLevel") || "visitor";
    if(!app) return;

    app.innerHTML = "";
    for (let key in state.lessons) {
        let tableData = state.lessons[key];
        let color = getSectionColor(tableData.section);
        app.innerHTML += `
        <div class="card" style="border-right: 8px solid ${color};">
            <h4 style="color: ${color}; margin: 0;">جدول الصف: ${tableData.class} - شعبة ${tableData.section}</h4>
            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                <tr><th>الحصة</th>${config.days.map(d => `<th style="padding:8px; border:1px solid #ccc;">${d}</th>`).join('')}</tr>
                ${[0,1,2,3].map(r => `
                    <tr>
                        <td style="padding:8px; border:1px solid #ccc;">الحصة ${r+1}</td>
                        ${config.days.map((d, colIndex) => `
                            <td style="padding:8px; border:1px solid #ccc;">
                                <div class="info-txt" contenteditable="${level === 'admin'}" onblur="update('${key}', ${r}, ${colIndex}, 'subject', this.innerText)">
                                    ${tableData.data?.[r]?.[colIndex]?.subject || "..."}
                                </div>
                                ${(level === 'admin' || level === 'member') ? `
                                    <div class="info-txt teacher" contenteditable="${level === 'admin'}" onblur="update('${key}', ${r}, ${colIndex}, 'teacher', this.innerText)" style="color:#9333ea; font-size:0.8em; border-top:1px dashed #ccc; margin-top:2px;">
                                        ${tableData.data?.[r]?.[colIndex]?.teacher || "الأستاذ..."}
                                    </div>
                                ` : ''}
                            </td>
                        `).join('')}
                    </tr>
                `).join('')}
            </table>
            ${level === 'admin' ? `<button onclick="deleteTable('${key}')" class="btn" style="background:red; color:white; border:none; padding:5px 10px; margin-top:10px; cursor:pointer;">🗑️ حذف الجدول</button>` : ''}
        </div>`;
    }
}

// 4. وظائف الإعلانات والمكتبة
function uploadAnnouncement() {
    console.log("تم الضغط على زر النشر!"); // أضف هذا السطر
    if (localStorage.getItem("userLevel") !== "admin") {
        alert("❌ عذراً، الإدارة فقط مخولة بنشر الإعلانات!");
        return;
    }
    const titleElement = document.getElementById('ann-title');
    const descElement = document.getElementById('ann-desc');
    const mediaElement = document.getElementById('ann-media');
    const submitBtn = document.getElementById('submit-btn');

    const title = titleElement.value.trim();
    const desc = descElement.value.trim();
    const mediaUrl = mediaElement.value.trim();
    const date = new Date().toLocaleDateString('ar-IQ');

    if (!title || !desc) {
        alert("⚠️ يرجى ملء العنوان والوصف!");
        return;
    }
    if (submitBtn) submitBtn.disabled = true;

    database.ref('announcements').push({
        title: title,
        desc: desc,
        mediaUrl: mediaUrl,
        date: date,
        admin_key: 'ahmed'
    }).then(() => {
        alert("✅ تم نشر الإعلان بنجاح!");
        titleElement.value = '';
        descElement.value = '';
        mediaElement.value = '';
    }).catch(err => alert("❌ خطأ: " + err.message))
    .finally(() => { if (submitBtn) submitBtn.disabled = false; });
}

function loadAnnouncements() {
    database.ref('announcements').on('value', (snapshot) => {
        const list = document.getElementById('ann-list');
        if (!list) return;
        list.innerHTML = '';
        const level = localStorage.getItem("userLevel");
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            const key = childSnapshot.key;
            if (!item) return;
            list.innerHTML += `
                <div style="border:1px solid #ddd; padding:15px; margin:10px 0; border-radius:8px; background:#fff;">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                    ${item.mediaUrl ? `<p><a href="${item.mediaUrl}" target="_blank">📎 رابط مرفق</a></p>` : ''}
                    <small>${item.date}</small>
                    ${level === 'admin' ? `<button onclick="deleteAnnouncement('${key}')" style="background:#e74c3c; color:white; border:none; padding:5px; cursor:pointer;">🗑️ حذف</button>` : ''}
                </div>`;
        });
    });
}

function loadLibrary() {
    database.ref('library').on('value', (snapshot) => {
        const list = document.getElementById('library-list');
        if (!list) return;
        list.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            list.innerHTML += `<div style="border:1px solid #ddd; padding:10px; margin:5px; text-align:center;"><p><b>${item.name}</b></p><a href="${item.url}" target="_blank">تحميل</a></div>`;
        });
    });
}

function update(key, r, d, type, val) {
    if (localStorage.getItem("userLevel") !== "admin") return;
    database.ref(`school_data/lessons/${key}/data/${r}/${d}`).update({
        [type]: val,
        admin_key: 'ahmed'
    });
}

function deleteAnnouncement(key) {
    if (confirm("⚠️ هل أنت متأكد من الحذف؟")) {
        database.ref('announcements/' + key).remove()
        .then(() => alert("✅ تم الحذف"))
        .catch(err => alert("خطأ: " + err.message));
    }
}

// 5. التهيئة النهائية
window.onload = function() {
    const authBtn = document.getElementById("authBtn");
    if(authBtn) authBtn.innerText = localStorage.getItem("userLevel") ? "🔓 خروج" : "🔐 تسجيل الدخول";
    loadAnnouncements();
    loadLibrary();
    const level = localStorage.getItem("userLevel");
    if (level === "admin") {
        const annBox = document.getElementById("admin-add-ann");
        const libBox = document.getElementById("admin-library-add");
        if (annBox) annBox.style.display = "block";
        if (libBox) libBox.style.display = "block";
    }
};

function toggleSidebar() { document.getElementById('mySidebar').classList.toggle('active'); }
function show(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    toggleSidebar();
}
    // نظام الصلاحيات
    function handleAuth() {
        const currentLevel = localStorage.getItem("userLevel");
        if (currentLevel) {
            localStorage.removeItem("userLevel");
            alert("تم تسجيل الخروج");
        } else {
            const code = prompt("يرجى إدخال رمز الدخول:");
            if (code === "ahmed") localStorage.setItem("userLevel", "admin");
            else if (code === "2026") localStorage.setItem("userLevel", "member");
            else localStorage.setItem("userLevel", "visitor");
        }
        location.reload();
    }

    // دالة عرض الجدول
    function renderSchedule() {
        const level = localStorage.getItem("userLevel") || "visitor";
        const container = document.getElementById("schedule-container");
        
        const subject = "رياضيات";
        const teacher = "أ. أحمد";

        let html = `<table><tr><th>الحصة</th><th>المادة</th></tr><tr><td>1</td><td>`;
        
        html += `<div contenteditable="${level === 'admin'}">${subject}</div>`;
        
        if (level === 'admin' || level === 'member') {
            html += `<div class="teacher-text" contenteditable="${level === 'admin'}">${teacher}</div>`;
        }
        
        html += `</td></tr></table>`;
        container.innerHTML = html;
    }

    // منع التعديل لغير الإدارة
    document.addEventListener("input", (e) => {
        if (localStorage.getItem("userLevel") !== "admin" && e.target.hasAttribute("contenteditable")) {
            alert("عذراً، الإدارة فقط مخولة بالتعديل!");
            location.reload(); 
        }
    });

    // التحكم بالسايدبار والتنقل بين الصفحات
    function toggleSidebar() { 
        document.getElementById('mySidebar').classList.toggle('active'); 
    }
    
    function show(id) {
        // إخفاء جميع الأقسام التي تحمل كلاس page
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        // إظهار القسم المطلوب فقط
        document.getElementById(id).style.display = 'block';
        toggleSidebar(); // إغلاق القائمة بعد الاختيار
    }

    // إعدادات عند تحميل الصفحة
    window.onload = () => {
        renderSchedule();
        const level = localStorage.getItem("userLevel");
        const authBtn = document.getElementById("authBtn");
        
        if (authBtn) {
            authBtn.innerText = level ? "🔓 خروج" : "🔐 تسجيل الدخول";
        }

        // إظهار أدوات المدير (إضافة إعلانات ومكتبة) إذا كان المستخدم هو الإدارة
        if (level === "admin") {
            document.getElementById("admin-add-ann").style.display = "block";
            document.getElementById("admin-library-add").style.display = "block";
        }
    };
