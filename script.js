/*
Theme Name: Koora Vibe
Theme URI: https://koravibe.nfy.fyi
Author: Your haytam
Description: هذا قالب ووردبريس
Version: 1.0.1
*/
(function() {
    'use strict';
    
   var API      = 'https://ws.kora-api.space/';
    var TIMG     = 'https://cdn.kora-api.space/uploads/team/';
    var LIMG     = 'https://cdn.kora-api.space/uploads/league/';
    var FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'%3E%3Crect fill='%23fff5f5' width='44' height='44' rx='6'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' font-size='22'%3E&#x26bd;%3C/text%3E%3C/svg%3E"

    // تحديث التاريخ والوقت
    function updateDateDisplay() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const dateString = now.toLocaleDateString('er-US', { weekday: 'long', month: 'long', day: 'numeric' });
            const timeString = now.toLocaleTimeString('er-US', { hour: '2-digit', minute: '2-digit' });
            dateElement.textContent = dateString + ' - ' + timeString;
        }
    }
    setInterval(updateDateDisplay, 1000);

    function pad(n) { return String(n).padStart(2, '0'); }
    function today() { return new Date().toISOString().split('T')[0]; }
    function ts() { var d = new Date(); return '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()); }

    function status(s) {
        s = parseInt(s);
        if (s === 1) return { label: '<span class="dot" aria-hidden="true"></span>مباشر', cls: 'badge-live', live: true };
        if (s === 2) return { label: 'انتهت', cls: 'badge-finished', live: false };
        return { label: 'قادمة', cls: 'badge-upcoming', live: false };
    }

    // تم إزالة التحقق من الوقت: ستعتمد الحالة الآن على بيانات السيرفر فقط
    function getRealStatus(m) {
        return parseInt(m.status);
    }

    function card(m) {
        var realStatus = getRealStatus(m);
        var st = status(realStatus);
        
        // التعديل تم هنا: توجيه مباشر إلى Match.html
        var link = 'Match.html';

        var center;
        // عرض النتيجة إذا كانت مباشرة (1) أو انتهت (2)
        if (realStatus === 1 || realStatus === 2) {
            var sc = m.score && m.score !== '-' ? m.score : '0 - 0';
            center = '<div class="score">' + sc + '</div>';
        } else {
            center = '<div class="kick-time">' + m.time + '</div><div class="kick-label">انطلاق</div>';
        }
        
        // التعديل هنا: الزر يظهر فقط للمباريات المباشرة (1)
        var foot = '';
        if (realStatus === 1) { 
            foot = '<a href="' + link + '" class="card-foot">شاهد على كورة تيفي &#x25c0;</a>';
        }

        var inner = 
            '<div class="card-head">' +
                '<div class="league-row">' +
                    '<img src="' + LIMG + m.league_logo + '" class="league-img" width="20" height="20" onerror="this.style.display=\'none\'">' +
                    '<span class="league-name">' + m.league_en + '</span>' +
                '</div>' +
                '<span class="badge ' + st.cls + '">' + st.label + '</span>' +
            '</div>' +
            '<div class="card-body">' +
                '<div class="teams">' +
                    '<div class="team"><img src="' + TIMG + m.home_logo + '" class="team-logo" onerror="this.src=\'' + FALLBACK + '\'"><span class="team-name">' + m.home_en + '</span></div>' +
                    '<div class="center-col">' + center + '</div>' +
                    '<div class="team"><img src="' + TIMG + m.away_logo + '" class="team-logo" onerror="this.src=\'' + FALLBACK + '\'"><span class="team-name">' + m.away_en + '</span></div>' +
                '</div>' +
            '</div>' + foot;

        return '<div class="card' + (realStatus === 2 ? ' finished' : '') + '" data-id="' + m.id + '">' + inner + '</div>';
    }

 function show(id, block) { document.getElementById(id).style.display = block || 'block'; }
    function hide(id) { document.getElementById(id).style.display = 'none'; }

    function load() {
        updateDateDisplay();
        var url = API + 'api/matches/' + today() + '/1?t=' + ts();
        fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                hide('loading');
                var grid = document.getElementById('grid');
                grid.innerHTML = data.matches.map(card).join('');
                show('grid', 'grid');
            });
    }

    document.addEventListener('DOMContentLoaded', load);
    setInterval(load, 30000); 
})();
// دالة تحديث التاريخ تلقائياً باللغة الفرنسية
function updateDateDisplay() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        // 'en-US' لعرض التاريخ باللغة الإنجليزية
        const today = new Date().toLocaleDateString('en-US', options);
        dateElement.textContent = today;
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateDateDisplay);