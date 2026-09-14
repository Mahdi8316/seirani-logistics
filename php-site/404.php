<?php
require_once __DIR__ . '/inc/bootstrap.php';
http_response_code(404);
$nav_base   = url('/');
$page_title = 'صفحه یافت نشد | ' . SITE_NAME;
$meta_desc  = 'صفحهٔ موردنظر پیدا نشد. از صفحهٔ اصلی یا بخش مقالات سیرانی مسیر خود را ادامه دهید.';
$canonical  = SITE_URL . url('/404');
$robots     = 'noindex,follow';
include __DIR__ . '/inc/header.php';
?>
<main class="page">
  <div class="page-head">
    <div class="eyebrow"><span class="sec-line"></span>خطای ۴۰۴</div>
    <h1 class="page-title">این صفحه پیدا نشد</h1>
    <p class="section-lead">ممکن است آدرس تغییر کرده باشد. می‌توانید به صفحهٔ اصلی یا مقالات برگردید.</p>
    <div class="hero-actions" style="justify-content:center;margin-top:28px">
      <a class="btn-primary" href="<?= e(url('/')) ?>">صفحهٔ اصلی</a>
      <a class="btn-secondary" href="<?= e(blog_url()) ?>">مشاهدهٔ مقالات</a>
    </div>
  </div>
</main>
<?php include __DIR__ . '/inc/footer.php'; ?>
<?php include __DIR__ . '/inc/foot.php'; ?>
