// دوال التنقل
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// تحديث الوقت
function updateDateTime() {
    const now = new Date();
    document.getElementById('date-display').innerText = now.toLocaleDateString('ar-IQ');
    document.getElementById('time-display').innerText = now.toLocaleTimeString('ar-IQ');
}
setInterval(updateDateTime, 1000);

// صلاحيات المدير
function handleAuth() {
    if (localStorage.getItem("admin")) {
        localStorage.removeItem("admin");
        location.reload();
    } else {
        const pass = prompt("كلمة المرور:");
        if (pass === "1234") {
            localStorage.setItem("admin", "true");
            location.reload();
        }
    }
}

// وظائف الإضافة الحقيقية لـ Firebase
function addAnnouncement() {
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    database.ref('announcements').push({ title, text });
}

function addClass() {
    const name = document.getElementById('class-name').value;
    const section = document.getElementById('section-name').value;
    database.ref('classes').push({ name, section });
}

function addSchedule() {
    const sub = document.getElementById('sub-name').value;
    database.ref('schedule').push({ sub });
}

function addBook() {
    const name = document.getElementById('book-name').value;
    database.ref('library').push({ name });
}

// جلب البيانات من Firebase
database.ref('announcements').on('value', snap => {
    const list = document.getElementById('announcements-list');
    list.innerHTML = "";
    snap.forEach(c => {
        list.innerHTML += `<div class="card"><h4>${c.val().title}</h4><p>${c.val().text}</p></div>`;
    });
});

database.ref('classes').on('value', snap => {
    const list = document.getElementById('classes-list');
    list.innerHTML = "";
    snap.forEach(c => {
        list.innerHTML += `<div class="card">صف: ${c.val().name} - ${c.val().section}</div>`;
    });
});

// تهيئة الصفحة
window.onload = () => {
    updateDateTime();
    if (localStorage.getItem("admin")) {
        document.querySelectorAll('.admin-section').forEach(e => e.style.display = 'block');
        document.getElementById('school-vision').contentEditable = true;
    }
};
