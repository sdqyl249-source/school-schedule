console.log("تم تحميل ملف schedule_only.js");

const tableBody = document.getElementById('table-body-id');
if (!tableBody) {
    console.error("خطأ: لم يتم العثور على العنصر الذي يحمل ID: table-body-id في صفحة الـ HTML");
} else {
    console.log("تم العثور على عنصر الجدول بنجاح!");
}

// اختبار Firebase
if (typeof firebase === 'undefined') {
    console.error("خطأ: مكتبة Firebase غير محملة!");
} else {
    console.log("مكتبة Firebase محملة وجاهزة.");
}
