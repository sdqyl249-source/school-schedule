// 1. التهيئة المركزية (Firebase)
// تهيئة Firebase (يجب أن تكون في بداية الملف)
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

const config = { days: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس"], subjects: ["رياضيات", "علوم", "عربي", "إنجليزي", "رياضة"] };
let state = { lessons: {} };
let isMember = localStorage.getItem("userRole") === "member";

// 2. الدوال الموحدة
function toggleSidebar() {
    const sidebar = document.getElementById('mySidebar');
    if (sidebar) sidebar.style.width = (sidebar.style.width === '280px') ? '0' : '280px';
}

function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    if (submenu) submenu.style.display = (submenu.style.display === 'block') ? 'none' : 'block';
}

function show(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const page = document.getElementById(pageId);
    if (page) page.style.display = 'block';
}

function openUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) modal.style.display = 'block';
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) modal.style.display = 'none';
}

function login() { if(prompt("كلمة المرور:")==="2026") { localStorage.setItem("userRole","member"); location.reload(); } }
function logout() { localStorage.setItem("userRole","visitor"); location.reload(); }

// 3. دوال قاعدة البيانات
database.ref('school_data').on('value', (snapshot) => { 
    if(snapshot.exists()) { 
        state = snapshot.val(); 
        render(); 
    } 
});

function addTable() {
    const g = document.getElementById("selG");
    const s = document.getElementById("selS");
    if(!g || !s) return;
    const key = g.value + "-" + s.value;
    if(!state.lessons[key]) { 
        state.lessons[key] = Array(4).fill(null).map(() => Array(5).fill({sub:"", tea:""})); 
        database.ref('school_data').set(state); 
    }
}

function deleteTable() {
    const g = document.getElementById("selG");
    const s = document.getElementById("selS");
    if(!g || !s) return;
    const key = g.value + "-" + s.value;
    if(state.lessons[key]) { delete state.lessons[key]; database.ref('school_data').set(state); }
}

function update(key, r, d, type, val) { 
    state.lessons[key][r][d][type] = val; 
    database.ref('school_data').set(state); 
}

// 4. دالة العرض (تم إضافة فحص للـ app)
function render() {
    const app = document.getElementById("app");
    const adminPanel = document.getElementById("adminPanel");
    const logoutBtn = document.getElementById("logoutBtn");
    
    if(!app) return; // الحماية من خطأ عدم وجود العنصر

    if(adminPanel) adminPanel.style.display = isMember ? "block" : "none";
    if(logoutBtn) logoutBtn.style.display = isMember ? "block" : "none";
    
    app.innerHTML = "";
    const colors = ["#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6", "#3498db", "#e67e22"];
    let colorIdx = 0;

    for (let key in state.lessons) {
        const btn = document.createElement("button");
        btn.className = "accordion";
        btn.innerText = `📋 جدول صف ${key}`;
        btn.onclick = function() { 
            const panel = this.nextElementSibling;
            panel.style.display = (panel.style.display === "block") ? "none" : "block"; 
        };
        app.appendChild(btn);

        const container = document.createElement("div");
        container.className = "full-day-card";
        container.style.borderColor = colors[colorIdx % colors.length];
        colorIdx++;
        
        let html = `<table><tr><th>حصة</th>${config.days.map(d=>`<th>${d}</th>`).join('')}</tr>`;
        for(let i=0; i<4; i++) {
            html += `<tr><td>${i+1}</td>`;
            for(let d=0; d<5; d++) {
                const l = state.lessons[key][i][d] || {sub:"", tea:""};
                const cellContent = isMember ? 
                    `<select onchange="update('${key}',${i},${d},'sub',this.value)"><option value="">-</option>${config.subjects.map(s=>`<option value="${s}" ${l.sub==s?'selected':''}>${s}</option>`).join('')}</select>
                     <input type="text" placeholder="أستاذ" value="${l.tea}" onchange="update('${key}',${i},${d},'tea',this.value)">`
                    : (l.sub || "-");
                html += `<td>${cellContent}</td>`;
            }
            html += `</tr>`;
        }
        container.innerHTML = html + "</table>";
        app.appendChild(container);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    updateUIState();
    renderNews();

    // استدعاء دالة الجداول إذا كانت موجودة
    if (typeof render === 'function') {
        render(); 
    }
    // ... باقي الدوال
});
