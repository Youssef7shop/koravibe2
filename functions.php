<?php
function koravibe2_theme_setup() {
    add_theme_support('title-tag');
}
add_action('after_setup_theme', 'koravibe2_theme_setup');

function koravibe2_enqueue_scripts() {
    wp_enqueue_style('koravibe2-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'koravibe2_enqueue_scripts');
?>