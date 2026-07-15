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
    const app = document.getElementById("app");
    const level = localStorage.getItem("userLevel") || "visitor";
    if(!app) return;

    app.innerHTML = "";
    for (let key in state.lessons) {
        let tableData = state.lessons[key];
        let color = getSectionColor(tableData.section);
        let html = `
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
        app.innerHTML += html;
    }
}

// 4. وظائف الإعلانات والمكتبة
function uploadAnnouncement() {
    const title = document.getElementById('ann-title').value;
    const desc = document.getElementById('ann-desc').value;
    const media = document.getElementById('ann-media').value;
    const date = new Date().toLocaleDateString('ar-IQ');

    if (!title || !desc) return alert("يرجى ملء العنوان والوصف!");
    
    database.ref('announcements').push({ title, desc, mediaUrl: media, date }).then(() => {
        alert("تم النشر!");
        location.reload();
    });
}

function uploadAnnouncement() {
    const title = document.getElementById('ann-title').value;
    const desc = document.getElementById('ann-desc').value;
    const mediaUrl = document.getElementById('ann-media').value; // جلب النص مباشرة
    const date = new Date().toLocaleDateString('ar-IQ');

    if (!title || !desc) return alert("يرجى ملء العنوان والوصف!");

    database.ref('announcements').push({
        title: title,
        desc: desc,
        mediaUrl: mediaUrl, // حفظ الرابط النصي
        date: date
    }).then(() => {
        alert("تم نشر الإعلان بنجاح!");
        location.reload();
    });
}
function loadLibrary() {
    database.ref('library').on('value', (snapshot) => {
        const list = document.getElementById('library-list');
        if (!list) return;
        list.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            list.innerHTML += `<div style="border:1px solid #ddd; padding:10px; text-align:center;"><p><b>${item.name}</b></p><a href="${item.url}" target="_blank">تحميل</a></div>`;
        });
    });
}
function uploadFileToStorage() {
    const name = document.getElementById('lib-name').value;
    const fileInput = document.getElementById('lib-file');
    const file = fileInput.files[0];

    if (!name || !file) return alert("يرجى كتابة الاسم واختيار ملف!");

    // إنشاء مرجع للملف في Firebase Storage
    const storageRef = firebase.storage().ref('library_files/' + file.name);
    
    // رفع الملف
    storageRef.put(file).then(snapshot => {
        // الحصول على رابط التحميل بعد الرفع
        snapshot.ref.getDownloadURL().then(url => {
            // حفظ الرابط في Realtime Database
            database.ref('library').push({ name: name, url: url });
            alert("تم رفع الملف بنجاح!");
            document.getElementById('lib-name').value = '';
        });
    }).catch(error => {
        alert("حدث خطأ أثناء الرفع: " + error.message);
    });
}
function addLibraryItem() {
    const name = document.getElementById('lib-name').value;
    const url = document.getElementById('lib-url').value;
    if (name && url) {
        database.ref('library').push({ name, url }).then(() => alert("تمت الإضافة!"));
    }
}

// 5. التهيئة النهائية
window.onload = function() {
    // 1. تحديث زر تسجيل الدخول
    const authBtn = document.getElementById("authBtn");
    if(authBtn) authBtn.innerText = localStorage.getItem("userLevel") ? "🔓 خروج" : "🔐 تسجيل الدخول";
    
    // 2. تشغيل البيانات
    loadAnnouncements();
    loadLibrary();
    
    // 3. ملاحظة: render() تعمل تلقائياً مع دالة الـ on('value') للجدول
};

// وظائف مساعدة
function toggleSidebar() { document.getElementById('mySidebar').classList.toggle('active'); }
function show(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    toggleSidebar();
}
function update(key, r, d, type, val) {
    if (localStorage.getItem("userLevel") !== "admin") return location.reload();
    database.ref(`school_data/lessons/${key}/data/${r}/${d}/${type}`).set(val); 
}
function deleteTable(key) { if(confirm("حذف؟")) database.ref('school_data/lessons/' + key).remove(); }
