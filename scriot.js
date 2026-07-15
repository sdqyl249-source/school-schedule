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
    days: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس"], 
    subjects: ["رياضيات", "علوم", "عربي", "إنجليزي", "رياضة"] 
};
let state = { lessons: {} };

// 2. التحقق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateUIState();
    renderNews();
    render(); // عرض الجداول
});

// 3. الدوال الموحدة (UI & Navigation)
function toggleSidebar() {
    const sidebar = document.getElementById('mySidebar');
    if (sidebar) sidebar.style.width = (sidebar.style.width === '280px') ? '0' : '280px';
}

function toggleAuth() {
    let isAdmin = localStorage.getItem("isAdmin") === "true";
    let newState = !isAdmin;
    localStorage.setItem("isAdmin", newState);
    alert(newState ? "تم تفعيل وضع الإدارة" : "تم الخروج من وضع الإدارة");
    location.reload();
}

function updateUIState() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = isAdmin ? 'block' : 'none');
    if (isAdmin) setUIAzAdmin();
}

function setUIAzAdmin() {
    const loginNavBtn = document.getElementById('login-nav-btn');
    if (loginNavBtn) loginNavBtn.innerHTML = `👋 الإدارة | <span onclick="logoutCurrentMember(event)" style="color:red; cursor:pointer;">خروج</span>`;
}

function logoutCurrentMember(event) {
    if (event) event.stopPropagation();
    localStorage.setItem('isAdmin', "false");
    window.location.reload();
}

// 4. دوال الجداول والـ Firebase
database.ref('school_data').on('value', (snapshot) => {
    if(snapshot.exists()) { 
        state = snapshot.val(); 
        render(); 
    }
});

function render() {
    const app = document.getElementById("app");
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
                                    <div class="info-txt" contenteditable="true" onblur="update('${key}', ${r}, ${colIndex}, 'subject', this.innerText)">
                                        ${tableData.data?.[r]?.[colIndex]?.subject || "..."}
                                    </div>
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </table>
                ${localStorage.getItem("isAdmin") === "true" ? `<button onclick="deleteTable('${key}')" class="btn" style="background:red">🗑️ حذف</button>` : ''}
            </div>
        `;
        app.innerHTML += html;
    }
}

function addTable() {
    const cls = document.getElementById("selG").value;
    const sec = document.getElementById("selS").value;
    const newKey = database.ref('school_data/lessons').push().key;
    database.ref('school_data/lessons/' + newKey).set({ class: cls, section: sec, data: [] });
    alert("تمت إضافة الجدول!");
}

function deleteTable(key) {
    if(confirm("هل أنت متأكد؟")) database.ref('school_data/lessons/' + key).remove();
}

function update(key, r, d, type, val) { 
    database.ref(`school_data/lessons/${key}/data/${r}/${d}/${type}`).set(val); 
}

// 5. الأخبار والشكاوى
function renderNews() {
    const display = document.getElementById("news-display");
    if (!display) return;
    database.ref('news').on('value', (snapshot) => {
        const news = snapshot.val();
        if (news) display.innerHTML = `<div>${news.text}</div>`;
    });
}
