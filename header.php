<!DOCTYPE html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?> </head>
<body <?php body_class('antialiased flex flex-col min-h-screen'); ?>>

    <header class="hero-bg text-white py-16 px-4 text-center relative overflow-hidden">
        <div class="absolute top-4 left-4 flex gap-2">
            <button class="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-sm transition">بث مباشر مجاني</button>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-bold mb-4 mt-8"><?php bloginfo('name'); ?> – مباريات اليوم بث مباشر</h1>
        <p class="text-lg md:text-xl mb-8 opacity-90"><?php bloginfo('description'); ?></p>
        
        <div class="flex flex-wrap justify-center gap-3">
            <span class="bg-white/10 border border-white/30 px-4 py-2 rounded-full text-sm">بدون تسجيل</span>
            <span class="bg-white/10 border border-white/30 px-4 py-2 rounded-full text-sm">بث مجاني HD</span>
        </div>
    </header>