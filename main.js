// main.js - الملف الموحد لكل الدوال

// 1. دوال القائمة الجانبية (Sidebar)
function toggleSidebar() {
    const sidebar = document.getElementById('mySidebar');
    sidebar.style.width = (sidebar.style.width === '280px') ? '0' : '280px';
}

function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    submenu.style.display = (submenu.style.display === 'block') ? 'none' : 'block';
}

// 2. دوال التنقل بين الصفحات
function show(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// 3. دوال المكتبة الرقمية (الرفع والتحميل)
function openUploadModal() {
    document.getElementById('uploadModal').style.display = 'block';
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
}

function filterBooks(className) {
    document.getElementById('current-class').innerText = className;
    // هنا سنضيف لاحقاً كود Firebase لجلب الكتب
    console.log("تم اختيار صف: " + className);
}
const firebaseConfig = { apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI", databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com", projectId: "roya-platform-26860" };
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const config = { days: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس"], subjects: ["رياضيات", "علوم", "عربي", "إنجليزي", "رياضة"] };
let state = { lessons: {} };
let isMember = localStorage.getItem("userRole") === "member";

// الدوال الموحدة
function login() { if(prompt("كلمة المرور:")==="2026") { localStorage.setItem("userRole","member"); location.reload(); } }
function logout() { localStorage.setItem("userRole","visitor"); location.reload(); }

database.ref('school_data').on('value', (snapshot) => { if(snapshot.exists()) { state = snapshot.val(); render(); } });

function addTable() {
    const key = document.getElementById("selG").value + "-" + document.getElementById("selS").value;
    if(!state.lessons[key]) { state.lessons[key] = Array(4).fill(null).map(() => Array(5).fill({sub:"", tea:""})); database.ref('school_data').set(state); }
}

function deleteTable() {
    const key = document.getElementById("selG").value + "-" + document.getElementById("selS").value;
    if(state.lessons[key]) { delete state.lessons[key]; database.ref('school_data').set(state); }
}

function update(key, r, d, type, val) { state.lessons[key][r][d][type] = val; database.ref('school_data').set(state); }

function render() {
    document.getElementById("adminPanel").style.display = isMember ? "block" : "none";
    document.getElementById("logoutBtn").style.display = isMember ? "block" : "none";
    const app = document.getElementById("app"); app.innerHTML = "";
    
    const colors = ["#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6", "#3498db", "#e67e22"];
    let colorIdx = 0;

    for (let key in state.lessons) {
        const btn = document.createElement("button");
        btn.className = "accordion";
        btn.innerText = `📋 جدول صف ${key}`;
        btn.onclick = function() { this.nextElementSibling.style.display = (this.nextElementSibling.style.display === "block") ? "none" : "block"; };
        app.appendChild(btn);

        const container = document.createElement("div");
        container.className = "full-day-card";
        container.style.borderColor = colors[colorIdx % colors.length];
        colorIdx++;
        
        let html = `<table><tr><th>حصة</th>${config.days.map(d=>`<th>${d}</th>`).join('')}</tr>`;
        for(let i=0; i<4; i++) {
            html += `<tr><td>${i+1}</td>`;
            for(let d=0; d<5; d++) {
                const l = state.lessons[key][i][d];
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
