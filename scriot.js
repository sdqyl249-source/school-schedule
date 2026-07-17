// الاستيرادات (يجب وضعها في أعلى الملف)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase, ref, set, push, remove, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
  authDomain: "roya-platform-26860.firebaseapp.com",
  databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
  projectId: "roya-platform-26860",
  storageBucket: "roya-platform-26860.firebasestorage.app",
  messagingSenderId: "897544406776",
  appId: "1:897544406776:web:aa112013dea672fb141d0d",
  measurementId: "G-Y88LCNKED2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app); 

// 1. التنقل بين الصفحات (باقي كودك كما هو)
function showPage(id) {
    const pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) { pages[i].style.display = 'none'; }
    document.getElementById(id).style.display = 'block';
}
// ... (دوال openNav و closeNav كما هي)

// 4. الرؤية والنبذة
window.updateInfo = function(field, text) {
    if (!localStorage.getItem("admin")) return;
    set(ref(db, 'settings/' + field), { content: text });
};

// 5. إدارة الإعلانات
window.addAnnouncement = function() {
    if (!localStorage.getItem("admin")) return alert("غير مصرح لك!");
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    if (!title || !text) return alert("يرجى ملء الحقول");
    push(ref(db, 'announcements'), { 
        title, text, date: new Date().toLocaleDateString('ar-IQ') 
    });
    document.getElementById('ann-title').value = "";
    document.getElementById('ann-text').value = "";
};

window.deleteAnnouncement = function(id) {
    remove(ref(db, 'announcements/' + id));
};

// 6. تحميل الصفحة
window.onload = () => {
    updateDateTime();
    
    // عداد الزوار
    const visitorsRef = ref(db, 'visitors');
    runTransaction(visitorsRef, (current) => (current || 0) + 1);
    onValue(visitorsRef, (snap) => {
        const countEl = document.getElementById('visitor-count');
        if(countEl) countEl.innerText = snap.val() || 0;
    });

    const isAdmin = localStorage.getItem("admin");
    // (باقي كود الـ isAdmin كما هو)

    // جلب الرؤية
    onValue(ref(db, 'settings/vision'), (snap) => {
        if(snap.val()) document.getElementById('school-vision').innerText = snap.val().content;
    });

    // جلب الإعلانات
    onValue(ref(db, 'announcements'), (snap) => {
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
