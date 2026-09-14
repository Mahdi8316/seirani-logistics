<?php $nav_base = isset($nav_base) ? $nav_base : ''; ?>
<footer class="site-footer">
  <div class="footer-brand">
    <img src="<?= e(url('/assets/logo-seirani.png')) ?>" alt="لوگوی <?= e(SITE_NAME) ?>" width="52" height="52" class="footer-logo">
    <span class="footer-copy">© ۱۴۰۴ — تمامی حقوق محفوظ است</span>
  </div>
  <nav class="footer-links" aria-label="ناوبری پاورقی">
    <a href="<?= e($nav_base . '#services') ?>">خدمات</a>
    <a href="<?= e(blog_url()) ?>">مقالات</a>
    <a href="<?= e($nav_base . '#contact') ?>">تماس</a>
  </nav>
</footer>
