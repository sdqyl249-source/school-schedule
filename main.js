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
