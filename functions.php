<?php
function koravibe_scripts() {
    wp_enqueue_script('main-script', get_template_directory_uri() . '/script.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'koravibe_scripts');
?>