<?php
require_once __DIR__ . '/inc/bootstrap.php';

$slug = isset($_GET['slug']) ? $_GET['slug'] : '';
$post = $slug !== '' ? get_post_by_slug($slug) : null;

// URL قدیمی Query String را به آدرس خوانا و canonical منتقل کن.
$requestPath = parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH);
if ($post && $requestPath === url('/post.php')) {
    header('Location: ' . post_url($post), true, 301);
    exit;
}

if (!$post || (int)$post['published'] !== 1) {
    http_response_code(404);
    $nav_base   = url('/');
    $page_title = 'مقاله یافت نشد | ' . SITE_NAME;
    $robots     = 'noindex,follow';
    include __DIR__ . '/inc/header.php';
    echo '<main class="page"><h1 class="page-title">مقاله یافت نشد</h1>'
       . '<p class="section-lead"><a href="' . e(blog_url()) . '">بازگشت به مقالات</a></p></main>';
    include __DIR__ . '/inc/footer.php';
    include __DIR__ . '/inc/foot.php';
    exit;
}

// مقالات مرتبط
$related = array_values(array_filter(get_published_posts(4), function ($p) use ($post) {
    return (int)$p['id'] !== (int)$post['id'];
}));
$related = array_slice($related, 0, 3);

$nav_base   = url('/');
$page_title = $post['title'] . ' | ' . SITE_NAME;
$meta_desc  = $post['excerpt'];
$canonical  = SITE_URL . post_url($post);
$og_type    = 'article';
$og_image   = !empty($post['cover']) ? abs_url($post['cover']) : (SITE_URL . url('/assets/og-seirani.jpg'));
$article_meta = [
    'published' => date('c', strtotime($post['created_at'])),
    'modified'  => date('c', strtotime($post['updated_at'])),
    'section'   => $post['category'],
];
$json_ld = [
    seo_org(),
    seo_article($post),
    seo_breadcrumb([
        ['خانه', SITE_URL . '/'],
        ['مقالات', SITE_URL . blog_url()],
        [$post['title'], $canonical],
    ]),
];
include __DIR__ . '/inc/header.php';
?>
<main class="page">
  <article class="article">
    <a href="<?= e(blog_url()) ?>" class="article-back">→ بازگشت به مقالات</a>
    <div class="article-meta"><span class="blog-cat"><?= e($post['category']) ?></span><span class="blog-date"><?= e(fa_date($post['created_at'])) ?></span></div>
    <h1 class="article-title"><?= e($post['title']) ?></h1>
    <?php if ($post['excerpt']): ?><p class="article-excerpt"><?= e($post['excerpt']) ?></p><?php endif; ?>
    <?php if (!empty($post['cover'])): ?><img class="article-cover" src="<?= e(url($post['cover'])) ?>" alt="تصویر مقاله <?= e($post['title']) ?>" width="1680" height="945" fetchpriority="high" decoding="async"><?php endif; ?>
    <div class="article-body"><?= render_post_body($post['body']) ?></div>
  </article>

  <?php if ($related): ?>
    <aside class="related" style="max-width:820px;margin:clamp(56px,8vh,90px) auto 0;border-top:1px solid var(--hairline);padding-top:36px;">
      <h2 style="margin:0 0 22px;font-size:20px;font-weight:700;">مقالات مرتبط</h2>
      <div class="blog-grid">
        <?php foreach ($related as $r): ?>
          <a href="<?= e(post_url($r)) ?>" class="blog-card">
            <div class="blog-cover">
              <?php if (!empty($r['cover'])): ?>
                <img src="<?= e(url($r['cover'])) ?>" alt="تصویر مقاله <?= e($r['title']) ?>" width="1680" height="945" loading="lazy" decoding="async">
              <?php else: ?><span class="blog-cover-mark"></span><?php endif; ?>
            </div>
            <div class="blog-card-body">
              <div class="blog-meta"><span class="blog-cat"><?= e($r['category']) ?></span><span class="blog-date"><?= e(fa_date($r['created_at'])) ?></span></div>
              <h3 class="blog-card-title"><?= e($r['title']) ?></h3>
            </div>
          </a>
        <?php endforeach; ?>
      </div>
    </aside>
  <?php endif; ?>
</main>
<?php include __DIR__ . '/inc/footer.php'; ?>
<?php include __DIR__ . '/inc/foot.php'; ?>
