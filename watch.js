(function() {
    'use strict';

    // التقاط الـ ID للمباراة من رابط الصفحة
    var urlParams = new URLSearchParams(window.location.search);
    var matchId   = urlParams.get('m');
    
    // الرابط المعتمد لسيرفر جلب البث الخارجي
    var STREAM_SERVER_URL = 'https://xyzyacineweb-org.panel001.com';
    var playerIframe      = document.getElementById('live-player');

    // التحقق من وجود معرف المباراة وبدء البث
    if (matchId) {
        playerIframe.src = STREAM_SERVER_URL + '/?m=' + matchId + '&lang=ar';
    } else {
        // رسالة افتراضية إذا لم يتم تمرير مباراة
        document.getElementById('match-title').innerText = "لم يتم تحديد مباراة";
        document.getElementById('match-subtitle').innerText = "يرجى العودة للصفحة الرئيسية واختيار بث";
    }
})();

// دالة تبديل السيرفرات (الأزرار الملونة)
function changeServer(serverIndex) {
    // إزالة تفعيل جميع الأزرار
    var allButtons = document.querySelectorAll('.srv-btn');
    allButtons.forEach(function(btn) {
        btn.classList.remove('active');
    });
    
    // تفعيل الزر المنقور
    event.currentTarget.classList.add('active');
    
    console.log("تم تفعيل السيرفر رقم: " + serverIndex);
    // يمكنك ربط كل زر بتغيير رابط الـ iframe حسب احتياجك هنا
}