<?php get_header(); ?>

<main class="main-container" style="max-width: 1400px; margin: 0 auto; padding: 20px;">
    <div id="current-date" style="text-align: center; margin-bottom: 20px; color: #fff;"></div>
    
    <div id="loading" style="text-align: center; padding: 50px;">جاري تحميل المباريات...</div>
    
    <div class="grid" id="grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
    </div>
</main>

<script>
    // تأكد من وضع رابط ملف script.js الخاص بك هنا أو استدعاءه في functions.php
    // ونفس الكود السابق الذي كتبناه للـ card سيعمل هنا تماماً
</script>

<?php get_footer(); ?>