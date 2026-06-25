<?php
// تفعيل بعض ميزات ووردبريس الأساسية
function koravibe2_theme_setup() {
    add_theme_support('title-tag'); // تفعيل العنوان الديناميكي
    add_theme_support('post-thumbnails'); // تفعيل الصور البارزة للمقالات/المباريات
}
add_action('after_setup_theme', 'koravibe2_theme_setup');

// استدعاء ملفات CSS و الجافاسكريبت
function koravibe2_enqueue_scripts() {
    // استدعاء مكتبة Tailwind CSS
    wp_enqueue_script('tailwindcss', 'https://cdn.tailwindcss.com', array(), null, false);
    
    // استدعاء ملف التنسيقات الرئيسي style.css
    wp_enqueue_style('koravibe2-style', get_stylesheet_uri());
    
    // استدعاء ملف الجافاسكريبت (في حال أنشأت ملف script.js في المجلد)
    // wp_enqueue_script('koravibe2-script', get_template_directory_uri() . '/script.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'koravibe2_enqueue_scripts');
?>