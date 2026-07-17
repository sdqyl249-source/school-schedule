// classesDatabase.js

// 1. قاعدة بيانات الصفوف (يتحكم بها الأستاذ)
const allClasses = [
    {
        id: "MATH-2026",
        name: "رياضيات متقدمة",
        teacher: "أ. عقيل السعد",
        students: ["علي", "محمد", "فاطمة"], // قائمة الطلاب المسجلين
        lessons: [
            { title: "الدرس الأول: الدوال", content: "..." },
            { title: "الدرس الثاني: النهايات", content: "..." }
        ],
        grades: {
            "علي": 85,
            "محمد": 90,
            "فاطمة": 95
        }
    },
    {
        id: "ECON-2026",
        name: "اقتصاد كلي",
        teacher: "أ. عقيل السعد",
        students: [],
        lessons: [],
        grades: {}
    }
];

// دالة لجلب صف معين عبر الرمز
function getClassById(code) {
    return allClasses.find(c => c.id === code);
}
