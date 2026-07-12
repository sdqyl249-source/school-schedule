// 1. إعدادات الاتصال (قم بوضع بيانات مشروعك الحقيقية هنا)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID"
    // ... باقي الإعدادات (لا تحذفها)
};

// 2. تهيئة Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

// 3. جلب البيانات وعرضها في الجدول
// تم تعديل المسار إلى 'school_data/lessons' كما هو موجود في قاعدة بياناتك
// احذف الكود القديم الخاص بالجدول وضع هذا مكانه
database.ref('school_data/lessons').on('value', (snapshot) => {
    const data = snapshot.val();
    const tableBody = document.getElementById('table-body-id');
    
    if (tableBody) {
        tableBody.innerHTML = ''; // مسح المحتوى القديم للجدول
        
        if (data && Array.isArray(data)) {
            data.forEach((row) => {
                // ملاحظة: تأكد من ترتيب الأعمدة (0، 1، 2) 
                // إذا كان الجدول يظهر بيانات خاطئة، غير الأرقام أدناه
                tableBody.innerHTML += `
                    <tr>
                        <td>${row[0] || ''}</td>
                        <td>${row[1] || ''}</td>
                        <td>${row[2] || ''}</td>
                    </tr>`;
            });
        }
    }
});
