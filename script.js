// التأكد من تحميل محتوى الصفحة بالكامل قبل تنفيذ الكود
document.addEventListener("DOMContentLoaded", () => {
    
    // جلب العنصر الذي سيعرض التاريخ
    const dateElement = document.getElementById('current-date');
    
    // التحقق من وجود العنصر لتفادي الأخطاء
    if (dateElement) {
        // إعدادات التنسيق باللغة العربية
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        // جلب التاريخ الحالي وتنسيقه
        const today = new Date().toLocaleDateString('ar-EG', options);
        
        // دمج النص مع التاريخ ووضعه داخل العنصر
        dateElement.textContent = `مباريات اليوم — ${today}`;
    }

});