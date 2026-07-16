function showPage(id) {
    // إخفاء جميع الصفحات
    const pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    // إظهار الصفحة المطلوبة
    document.getElementById(id).style.display = 'block';
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('date-display').innerText = now.toLocaleDateString('ar-IQ');
    document.getElementById('time-display').innerText = now.toLocaleTimeString('ar-IQ');
}
setInterval(updateDateTime, 1000);

function handleAuth() {
    const level = localStorage.getItem("userLevel");
    if (level) { localStorage.removeItem("userLevel"); alert("تم تسجيل الخروج"); }
    else {
        const code = prompt("يرجى إدخال رمز الدخول:");
        if (code === "ahmed") localStorage.setItem("userLevel", "admin");
        else alert("رمز خاطئ");
    }
    location.reload();
}

function addAnnouncement() {
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    const list = document.getElementById('announcements-list');
    list.innerHTML += `<div class="card"><h4>${title}</h4><p>${text}</p></div>`;
}

function addClass() {
    const name = document.getElementById('class-name').value;
    const list = document.getElementById('classes-list');
    list.innerHTML += `<div class="card">صف: ${name}</div>`;
}

function addSchedule() { alert("تمت الإضافة"); }
function addBook() { alert("تمت الإضافة"); }

window.onload = function() {
    updateDateTime();
};
