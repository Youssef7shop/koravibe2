<!DOCTYPE html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- إزالة روابط CDN و Preconnect لتسريع الموقع -->
    <link rel="preconnect" href="https://ws.kora-api.space" crossorigin>
    <link rel="preconnect" href="https://cdn.kora-api.space" crossorigin>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<nav class="nav" aria-label="Site navigation">
    <div class="nav-brand">
        <div class="nav-brand-text">
            <span class="nav-brand-ar">رايس لايف</span>
            <span class="nav-brand-en">Raiss<em>Live</em></span>
        </div>
    </div>
    <div class="nav-right">
        <span class="nav-tag nav-tag-free">مجاني 100%</span>
        <span class="nav-tag">بث مباشر HD</span>
    </div>
</nav>

<div class="hero" id="home">
    <div class="hero-eyebrow">🔴 بث مباشر الآن · Raiss Live <?php echo date('Y'); ?></div>
    <h1><?php bloginfo('name'); ?> — <em>بث مباشر مجاني</em> HD بدون اشتراك</h1>
</div>