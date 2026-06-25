<footer class="bg-[#5c0f14] text-white py-10 mt-12">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-xl md:text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                ⚽ <?php bloginfo('name'); ?> – بث مباشر مجاني HD
            </h2>
            <p class="text-sm md:text-base text-gray-300 mb-6">
                بث مباشر <?php bloginfo('name'); ?> | بث مجاني بدون اشتراك
            </p>
            <div class="flex flex-wrap justify-center gap-2 mb-8">
                <span class="bg-white/10 border border-white/20 hover:bg-white/20 transition cursor-pointer px-4 py-1.5 rounded-full text-sm">بث مباشر مجاني</span>
                <span class="bg-white/10 border border-white/20 hover:bg-white/20 transition cursor-pointer px-4 py-1.5 rounded-full text-sm">raiss tv live</span>
            </div>
            <div class="text-xs text-gray-400" dir="ltr">
                .<?php bloginfo('name'); ?>. All rights reserved <?php echo date('Y'); ?> ©
            </div>
        </div>
    </footer>

    <?php wp_footer(); ?> <script>
        document.addEventListener("DOMContentLoaded", () => {
            const dateElement = document.getElementById('current-date');
            if (dateElement) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                dateElement.textContent = `مباريات اليوم — ${new Date().toLocaleDateString('ar-EG', options)}`;
            }
        });
    </script>
</body>
</html>