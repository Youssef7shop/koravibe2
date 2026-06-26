<?php get_header(); ?>

<main class="wrap">
  <div class="date-bar">
    <h2><span class="live-dot" aria-hidden="true"></span> مباريات اليوم على <?php bloginfo('name'); ?> — <span id="current-date-text"></span></h2>
    <span class="auto-label">🔄 يتحدث تلقائياً</span>
  </div>

  <div id="loading" class="state" role="status" aria-live="polite">
    <div class="spinner" aria-hidden="true"></div>
    <h3>جاري تحميل مباريات <?php bloginfo('name'); ?>…</h3>
    <p>تحميل مباريات اليوم بث مباشر على Raiss Live</p>
  </div>

  <div id="error" class="state" style="display:none" role="alert">
    <div class="state-icon" aria-hidden="true">⚠️</div>
    <h3>تعذّر تحميل المباريات</h3>
    <p>يرجى تحديث الصفحة لإعادة تحميل البث المباشر.</p>
  </div>

  <!-- هذا العنصر سيتم ملؤه تلقائياً بواسطة الجافاسكريبت -->
  <div id="grid" class="grid" style="display:none" aria-label="مباريات اليوم"></div>
</main>

<?php get_footer(); ?>