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

// 2. نظام الصلاحيات الموحد
function login() {
    const code = prompt("يرجى إدخال رمز الدخول:");
    if (code === "ahmed") localStorage.setItem("userLevel", "admin");
    else if (code === "2026") localStorage.setItem("userLevel", "member");
    else localStorage.setItem("userLevel", "visitor");
    location.reload();
}

function logout() {
    localStorage.removeItem("userLevel");
    location.reload();
}

// 3. دالة الجلب والعرض (Render) للجدول
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

// 4. الدوال المساعدة
function update(key, r, d, type, val) {
    if (localStorage.getItem("userLevel") !== "admin") {
        alert("صلاحياتك لا تسمح بالتعديل!");
        location.reload();
        return;
    }
    database.ref(`school_data/lessons/${key}/data/${r}/${d}/${type}`).set(val); 
}

function addTable() {
    if (localStorage.getItem("userLevel") !== "admin") return alert("فقط المدير يمكنه إضافة جداول!");
    const cls = document.getElementById("selG").value;
    const sec = document.getElementById("selS").value;
    const newKey = database.ref('school_data/lessons').push().key;
    database.ref('school_data/lessons/' + newKey).set({ class: cls, section: sec, data: [] }).then(() => location.reload());
}

function deleteTable(key) {
    if(confirm("هل أنت متأكد؟")) database.ref('school_data/lessons/' + key).remove();
}
function uploadAnnouncement() {
    const title = document.getElementById('ann-title').value;
    const desc = document.getElementById('ann-desc').value;
    const file = document.getElementById('ann-media').files[0];
    const date = new Date().toLocaleDateString('ar-IQ');

    if (!title || !desc) return alert("يرجى ملء العنوان والوصف!");

    if (file) {
        // إذا كان هناك ملف، نرفعه أولاً
        const storageRef = firebase.storage().ref('announcements/' + file.name);
        storageRef.put(file).then(snapshot => {
            snapshot.ref.getDownloadURL().then(url => {
                saveToDatabase(title, desc, url, date);
            });
        });
    } else {
        // بدون ملف
        saveToDatabase(title, desc, null, date);
    }
}

function saveToDatabase(title, desc, url, date) {
    database.ref('announcements').push({
        title: title,
        desc: desc,
        mediaUrl: url,
        date: date
    }).then(() => {
        alert("تم نشر الإعلان بنجاح!");
        location.reload();
    });
}
// 5. قسم الإعلانات (المدمج)
function loadAnnouncements() {
    database.ref('announcements').on('value', (snapshot) => {
        const list = document.getElementById('announcements-list');
        if (!list) return;
        
        list.innerHTML = ''; 
        
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            
            // نتحقق إذا كان هناك رابط ملف وسائط
            let mediaHtml = '';
            if (data.mediaUrl) {
                // إذا كان الرابط ينتهي بصيغة فيديو
                if (data.mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
                    mediaHtml = `<video src="${data.mediaUrl}" controls style="width:100%; margin-top:10px;"></video>`;
                } else {
                    // افتراضياً نعرضه كصورة
                    mediaHtml = `<img src="${data.mediaUrl}" style="width:100%; margin-top:10px; border-radius:8px;">`;
                }
            }

            // عرض البطاقة بتنسيق احترافي
            list.innerHTML += `
                <div class="card" style="margin-bottom: 20px; padding: 15px; border-bottom: 2px solid #3498db;">
                    <h3 style="margin:0;">${data.title}</h3>
                    <p style="color:#555; margin: 10px 0;">${data.desc}</p>
                    ${mediaHtml}
                    <small style="color: #999; display:block; margin-top:10px;">نُشر في: ${data.date}</small>
                </div>
            `;
        });
    });
}
// 6. تهيئة الصفحة (دمج كل شيء في مكان واحد)
window.onload = function() {
    // تحديث نص زر تسجيل الدخول
    const btn = document.getElementById("authBtn");
    if(btn) btn.innerText = localStorage.getItem("userLevel") ? "🔓 خروج" : "🔐 تسجيل الدخول";
    
    // إظهار لوحة التحكم للمدير
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel && localStorage.getItem("userLevel") === "admin") {
        adminPanel.style.display = "block";
    }

    // تشغيل الإعلانات
    loadAnnouncements();
};
function loadLibrary() {
    database.ref('library').on('value', (snapshot) => {
        const list = document.getElementById('library-list');
        if (!list) return;
        
        list.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            list.innerHTML += `
                <div style="border:1px solid #ddd; padding:10px; border-radius:8px; text-align:center;">
                    <p><b>${item.name}</b></p>
                    <a href="${item.url}" target="_blank" style="text-decoration:none; background:#3498db; color:white; padding:5px 15px; border-radius:5px; display:inline-block;">تحميل الملف</a>
                </div>
            `;
        });
    });
}
function addLibraryItem() {
    const name = document.getElementById('lib-name').value;
    const url = document.getElementById('lib-url').value;
    
    if (name && url) {
        database.ref('library').push({ name: name, url: url });
        alert("تمت إضافة الملف بنجاح!");
        document.getElementById('lib-name').value = '';
        document.getElementById('lib-url').value = '';
    }
}
