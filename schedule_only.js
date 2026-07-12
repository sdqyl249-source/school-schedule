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
database.ref('school_data/lessons').on('value', (snapshot) => {
    const data = snapshot.val();
    const tableBody = document.getElementById('table-body-id');
    
    if (tableBody) {
        tableBody.innerHTML = ''; // تفريغ الجدول أولاً
        
        if (data) {
            Object.keys(data).forEach(key => {
                const lesson = data[key];
                // تأكد أن أسماء الحقول (subject, teacher, time) مطابقة لما هو مخزن فعلياً
                tableBody.innerHTML += `
                    <tr>
                        <td>${lesson.subject || '-'}</td>
                        <td>${lesson.teacher || '-'}</td>
                        <td>${lesson.time || '-'}</td>
                    </tr>`;
            });
        } else {
            console.log("لا توجد دروس في قاعدة البيانات حالياً.");
        }
    } else {
        console.error("خطأ: لم يتم العثور على العنصر الذي يحمل المعرف 'table-body-id' في صفحة الـ HTML.");
    }
}, (error) => {
    console.error("حدث خطأ أثناء جلب البيانات:", error);
});
