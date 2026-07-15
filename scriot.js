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

// 3. دالة الجلب والـ Render
database.ref('school_data/lessons').on('value', (snapshot) => {
    state.lessons = snapshot.val() || {}; 
    render();
});

function render() {
    const app = document.getElementById("app");
    const level = localStorage.getItem("userLevel") || "visitor";
    if(!app) return;

    app.innerHTML = "";
    for (let key in state.lessons) {
        let tableData = state.lessons[key];
        let html = `
            <div class="card">
                <h4>جدول الصف: ${tableData.class} - ${tableData.section}</h4>
                <table>
                    <tr><th>الحصة</th>${config.days.map(d => `<th>${d}</th>`).join('')}</tr>
                    ${[0,1,2,3].map(r => `
                        <tr>
                            <td>الحصة ${r+1}</td>
                            ${config.days.map((d, colIndex) => `
                                <td>
                                    <!-- المادة للجميع -->
                                    <div class="info-txt" contenteditable="${level === 'admin'}" 
                                         onblur="update('${key}', ${r}, ${colIndex}, 'subject', this.innerText)">
                                        ${tableData.data?.[r]?.[colIndex]?.subject || "..."}
                                    </div>
                                    <!-- الأستاذ للمدير والعضو فقط -->
                                    ${(level === 'admin' || level === 'member') ? `
                                        <div class="info-txt teacher" contenteditable="${level === 'admin'}"
                                             onblur="update('${key}', ${r}, ${colIndex}, 'teacher', this.innerText)"
                                             style="color:#9333ea; font-size:0.8em;">
                                            ${tableData.data?.[r]?.[colIndex]?.teacher || "الأستاذ..."}
                                        </div>
                                    ` : ''}
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </table>
                ${level === 'admin' ? `<button onclick="deleteTable('${key}')" class="btn" style="background:red; margin-top:10px;">🗑️ حذف الجدول</button>` : ''}
            </div>
        `;
        app.innerHTML += html;
    }
}

// 4. دالة التحديث مع حماية الصلاحيات
function update(key, r, d, type, val) {
    if (localStorage.getItem("userLevel") !== "admin") {
        alert("صلاحياتك لا تسمح بالتعديل!");
        location.reload();
        return;
    }
    database.ref(`school_data/lessons/${key}/data/${r}/${d}/${type}`).set(val); 
}

// 5. دوال مساعدة
function deleteTable(key) {
    if(confirm("هل أنت متأكد من حذف هذا الجدول؟")) {
        database.ref('school_data/lessons/' + key).remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // تحديث زر الدخول في الواجهة
    const btn = document.getElementById("authBtn");
    if(btn) btn.innerText = localStorage.getItem("userLevel") ? "🔓 خروج" : "🔐 تسجيل الدخول";
});
