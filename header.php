<!DOCTYPE html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title('|', true, 'right'); ?></title>
    <link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<nav class="top-nav">
    <div class="nav-logo">
        <i class="fas fa-futbol"></i> <span>كورة تيفي</span>
    </div>
    <div class="nav-title">
        <h1>مباريات اليوم</h1>
        <p>بث مباشر وحصري</p>
    </div>
    <div class="nav-socials">
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-facebook"></i></a>
    </div>
</nav>