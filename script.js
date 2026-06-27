(function() {
    'use strict';
    
    // إعدادات الروابط (تم الإبقاء على الروابط الضرورية لجلب البيانات)
    var API      = 'https://ws.kora-api.space/';
    var TIMG     = 'https://cdn.kora-api.space/uploads/team/';
    var LIMG     = 'https://cdn.kora-api.space/uploads/league/';
    var FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'%3E%3Crect fill='%23fff5f5' width='44' height='44' rx='6'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' font-size='22'%3E⚽%3C/text%3E%3C/svg%3E";

    function pad(n) { return String(n).padStart(2, '0'); }
    function today() { return new Date().toISOString().split('T')[0]; }
    
    function ts() {
        var d = new Date();
        return '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes());
    }

    function status(s) {
        s = parseInt(s);
        if (s === 1) return { label: '<span class="dot" aria-hidden="true"></span>مباشر', cls: 'badge-live', live: true };
        if (s === 2) return { label: 'انتهت', cls: 'badge-finished', live: false };
        return { label: 'قادمة', cls: 'badge-upcoming', live: false };
    }

    // بناء وتصميم بطاقة المباراة ديناميكياً
    function card(m) {
        var st   = status(m.status);
        
        // الرابط الجديد الذي يوجهك إلى صفحة المشاهدة الخاصة بك
        var link = 'watch.html?id=' + m.id;

        var center;
        if (m.status === 1 || m.status === 2) {
            var sc = m.score && m.score !== '-' ? m.score : '0 - 0';
            center = '<div class="score">' + sc + '</div>';
        } else {
            center = '<div class="kick-time">' + m.time + '</div><div class="kick-label">انطلاق</div>';
        }
        
        var foot = '<div class="card-foot"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><polygon points="2,1 11,6 2,11" fill="#fff"/></svg>شاهد على كورة تيفي</div>';

        var inner = 
            '<div class="card-head">' +
                '<div class="league-row">' +
                    '<img src="' + LIMG + m.league_logo + '" alt="' + m.league_en + ' - كورة تيفي" class="league-img" loading="lazy" width="20" height="20" onerror="this.style.display=\'none\'">' +
                    '<span class="league-name">' + m.league_en + '</span>' +
                '</div>' +
                '<span class="badge ' + st.cls + '">' + st.label + '</span>' +
            '</div>' +
            '<div class="card-body">' +
                '<div class="teams">' +
                    '<div class="team">' +
                        '<img src="' + TIMG + m.home_logo + '" alt="' + m.home_en + '" class="team-logo" loading="lazy" width="46" height="46" onerror="this.src=\'' + FALLBACK + '\'">' +
                        '<span class="team-name">' + m.home_en + '</span>' +
                    '</div>' +
                    '<div class="center-col">' + center + '</div>' +
                    '<div class="team">' +
                        '<img src="' + TIMG + m.away_logo + '" alt="' + m.away_en + '" class="team-logo" loading="lazy" width="46" height="46" onerror="this.src=\'' + FALLBACK + '\'">' +
                        '<span class="team-name">' + m.away_en + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>' + foot;

        // جميع البطاقات الآن أصبحت روابط لصفحة watch.html
        return '<a href="' + link + '" class="card' + (m.status === 2 ? ' finished' : '') + '" aria-label="شاهد ' + m.home_en + ' ضد ' + m.away_en + ' على كورة تيفي">' + inner + '</a>';
    }

    function show(id, block) { document.getElementById(id).style.display = block || 'block'; }
    function hide(id) { document.getElementById(id).style.display = 'none'; }

    function load() {
        var url = API + 'api/matches/' + today() + '/1?t=' + ts();
        fetch(url)
            .then(function(r) { if (!r.ok) throw new Error('err'); return r.json(); })
            .then(function(data) {
                hide('loading');
                var matches = data.matches;
                if (!matches.length) {
                    show('loading');
                    document.getElementById('loading').innerHTML =
                        '<div class="state-icon">⚽</div><h3>لا توجد مباريات اليوم</h3><p>عد لاحقاً لمشاهدة البث المباشر على كورة تيفي.</p>';
                    return;
                }
                var grid = document.getElementById('grid');
                grid.innerHTML = matches.map(card).join('');
                show('grid', 'grid');
            })
            .catch(function() {
                hide('loading');
                show('error');
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', load);
    } else {
        load();
    }
    
    setInterval(load, 60000);
})();