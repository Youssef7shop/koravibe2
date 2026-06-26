(function() {
    'use strict';

    // 1. التقاط معرّفات الروابط (Query Parameters) القادمة من الصفحة الرئيسية
    var urlParams = new URLSearchParams(window.location.search);
    var matchId   = urlParams.get('m');
    
    // الرابط الأساسي لسيرفر البث الخارجي
    var STREAM_BASE = 'https://xyzyacineweb-org.panel001.com';
    var player      = document.getElementById('live-player');

    // 2. التحقق من وجود المعرف وتحديث مصدر الـ iframe
    if (matchId) {
        player.src = STREAM_BASE + '/?m=' + matchId + '&lang=ar';
    } else {
        // في حال تم الدخول للصفحة بدون تحديد مباراة
        document.getElementById('player-title').innerText = 'تنبيه: لم يتم تحديد مباراة للبث';
        player.style.display = 'none';
    }
})();

// دالة تبديل السيرفرات (يمكنك ربطها بروابط سيرفراتك الخارجية مستقبلاً)
function changeServer(serverNumber) {
    var buttons = document.querySelectorAll('.server-btn');
    buttons.forEach(function(btn) { btn.classList.remove('active'); });
    
    // تفعيل الزر المضغوط
    event.currentTarget.classList.add('active');
    
    // هنا يمكنك تغيير الـ src الخاص بالمشغل بناءً على السيرفر المختار
    console.log("تم التبديل إلى السيرفر رقم: " + serverNumber);
}