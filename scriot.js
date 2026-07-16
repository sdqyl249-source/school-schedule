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
const app = document.getElementById("schedule-container"); // تم التصحيح هنا
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
    // 1. التحقق من صلاحية الأدمن محلياً قبل أي خطوة
    if (localStorage.getItem("userLevel") !== "admin") {
        alert("❌ عذراً، الإدارة فقط مخولة بنشر الإعلانات!");
        return;
    }

    // 2. جلب القيم من حقول الإدخال
    const titleElement = document.getElementById('ann-title');
    const descElement = document.getElementById('ann-desc');
    const mediaElement = document.getElementById('ann-media');

    const title = titleElement.value.trim();
    const desc = descElement.value.trim();
    const mediaUrl = mediaElement.value.trim();
    const date = new Date().toLocaleDateString('ar-IQ');

    // 3. التحقق من أن الحقول الأساسية ليست فارغة
    if (title === "" || desc === "") {
        alert("يرجى ملء العنوان والوصف!");
        return;
    }

    // 4. إرسال البيانات إلى قاعدة بيانات Firebase مع تضمين المفتاح السري
    database.ref('announcements').push({
        title: title,
        desc: desc,
        mediaUrl: mediaUrl,
        date: date,
        admin_key: 'ahmed' // المفتاح السري الذي يتطلبه Firebase الآن
    }).then(function() {
        // 5. في حالة النجاح: تنظيف الحقول وإظهار رسالة
        alert("✅ تم نشر الإعلان بنجاح!");
        titleElement.value = '';
        descElement.value = '';
        mediaElement.value = '';
    }).catch(function(error) {
        // 6. في حالة حدوث خطأ
        alert("حدث خطأ أثناء النشر: " + error.message);
    });
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
            
            // نتحقق من وجود البيانات لضمان عدم حدوث خطأ
            if (!item) return;

            list.innerHTML += `
                <div id="ann-${key}" style="border:1px solid #ddd; padding:15px; margin:10px 0; border-radius:8px; position:relative; background:#fff;">
                    <h4 style="margin-bottom:5px;">${item.title}</h4>
                    <p style="margin-bottom:10px;">${item.desc}</p>
                    ${item.mediaUrl ? `<p><a href="${item.mediaUrl}" target="_blank" style="color:#3498db;">📎 رابط مرفق</a></p>` : ''}
                    <small style="color:#888;">${item.date}</small>
                    
                    ${level === 'admin' ? `
                        <div style="margin-top:10px; border-top:1px solid #eee; padding-top:10px;">
                            <button onclick="deleteAnnouncement('${key}')" style="background:#e74c3c; color:white; border:none; padding:6px 12px; cursor:pointer; border-radius:4px; font-size:12px;">🗑️ حذف</button>
                        </div>
                    ` : ''}
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
            list.innerHTML += `<div style="border:1px solid #ddd; padding:10px; text-align:center;"><p><b>${item.name}</b></p><a href="${item.url}" target="_blank">تحميل</a></div>`;
        });
    });
}

function uploadFileToStorage() {
    const name = document.getElementById('lib-name').value;
    const fileInput = document.getElementById('lib-file');
    const file = fileInput.files[0];

    if (!name || !file) return alert("يرجى كتابة الاسم واختيار ملف!");

    const storageRef = firebase.storage().ref('library_files/' + file.name);
    storageRef.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
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

// وظائف مساعدة (خارج الـ onload)
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

function update(key, r, d, type, val) {
    if (localStorage.getItem("userLevel") !== "admin") return;
    
    // التحديث يتطلب إرسال المفتاح
    database.ref(`school_data/lessons/${key}/data/${r}/${d}/${type}`).parent.update({
        [type]: val,
        admin_key: 'ahmed'
    });
}
function deleteAnnouncement(key) {
    // 1. التحقق من صلاحية الأدمن
    if (localStorage.getItem("userLevel") !== "admin") {
        alert("❌ غير مصرح لك بالحذف!");
        return;
    }

    // 2. تأكيد الحذف
    if (confirm("هل أنت متأكد من حذف هذا الإعلان نهائياً؟")) {
        // 3. الخطوة الأولى: تحديث البيانات لإضافة المفتاح السري المطلوب في القواعد
        database.ref('announcements/' + key).update({
            admin_key: 'ahmed' 
        }).then(() => {
            // 4. الخطوة الثانية: حذف الإعلان بعد التحديث الناجح
            database.ref('announcements/' + key).remove()
                .then(() => {
                    alert("✅ تم حذف الإعلان بنجاح.");
                })
                .catch((error) => {
                    alert("خطأ أثناء الحذف: " + error.message);
                });
        }).catch((error) => {
            alert("خطأ في التحقق من الصلاحية: " + error.message);
        });
    }
}
