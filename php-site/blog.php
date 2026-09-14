<?php
require_once __DIR__ . '/inc/bootstrap.php';

// فقط یک URL عمومی برای آرشیو؛ نسخهٔ قدیمی برای حفظ سئو ریدایرکت می‌شود.
$requestPath = parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH);
if ($requestPath === url('/blog.php')) {
    header('Location: ' . blog_url(), true, 301);
    exit;
}

$blogHead = get_blog_header();
$posts    = get_all_posts();
$posts    = array_filter($posts, function ($p) { return (int)$p['published'] === 1; });

$nav_base   = url('/');
$page_title = 'مقالات ترخیص گمرکی و بازرگانی بین‌الملل | ' . SITE_NAME;
$meta_desc  = 'یادداشت‌ها و مقالات درباره‌ی ترخیص گمرکی، ترانزیت زمینی و بازرگانی بین‌الملل.';
$canonical  = SITE_URL . blog_url();
$json_ld = [
    seo_org(),
    seo_blog(array_values($posts)),
    seo_breadcrumb([['خانه', SITE_URL . '/'], ['مقالات', $canonical]]),
];
include __DIR__ . '/inc/header.php';
?>
<main class="page">
  <div class="page-head">
    <div class="eyebrow"><span class="sec-line"></span><?= e($blogHead['eyebrow']) ?></div>
    <h1 class="page-title"><?= e($blogHead['title']) ?></h1>
    <p class="section-lead"><?= e($blogHead['lead']) ?></p>
  </div>

  <?php if (!$posts): ?>
    <p class="blog-empty">هنوز مقاله‌ای منتشر نشده است.</p>
  <?php else: ?>
    <div class="blog-grid">
      <?php foreach ($posts as $p): ?>
        <a href="<?= e(post_url($p)) ?>" class="blog-card">
          <div class="blog-cover">
            <?php if (!empty($p['cover'])): ?>
              <img src="<?= e(url($p['cover'])) ?>" alt="تصویر مقاله <?= e($p['title']) ?>" width="1680" height="945" loading="lazy" decoding="async">
            <?php else: ?><span class="blog-cover-mark"></span><?php endif; ?>
          </div>
          <div class="blog-card-body">
            <div class="blog-meta"><span class="blog-cat"><?= e($p['category']) ?></span><span class="blog-date"><?= e(fa_date($p['created_at'])) ?></span></div>
            <h2 class="blog-card-title"><?= e($p['title']) ?></h2>
            <p class="blog-excerpt"><?= e($p['excerpt']) ?></p>
            <span class="blog-readmore">ادامه مطلب ←</span>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</main>
<?php include __DIR__ . '/inc/footer.php'; ?>
<?php include __DIR__ . '/inc/foot.php'; ?>
