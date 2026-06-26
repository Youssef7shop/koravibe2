// تحديد عنصر المشغل في الصفحة
var playerIframe = document.getElementById('live-player');

// رابط سيرفر البث المباشر المعتمد
var STREAM_SERVER_URL = 'https://xyzyacineweb-org.panel001.com';

// التقاط رقم المباراة (m) تلقائياً وتشغيله داخل المشغل
var urlParams = new URLSearchParams(window.location.search);
var matchId = urlParams.get('m');

if (matchId) {
    // تشغيل البث المباشر فوراً للمباراة المحددة
    playerIframe.src = STREAM_SERVER_URL + '/?m=' + matchId + '&lang=ar';
}