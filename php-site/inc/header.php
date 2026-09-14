<?php
$nav_base   = isset($nav_base) ? $nav_base : '';
$page_title = isset($page_title) ? $page_title : (SITE_NAME . ' | ' . SITE_TAGLINE);
$meta_desc  = isset($meta_desc) ? $meta_desc : 'ترخیص گمرکی، بازرگانی بین‌الملل و ترانزیت زمینی؛ مهندسی‌شده برای جابه‌جایی روان بار در مسیر ایران، ترکیه و اروپا.';
$canonical  = isset($canonical) ? $canonical : SITE_URL . '/';
$og_type    = isset($og_type) ? $og_type : 'website';
$og_image   = isset($og_image) ? $og_image : (SITE_URL . url('/assets/og-seirani.jpg'));
$json_ld    = isset($json_ld) ? $json_ld : null;       // آرایه‌ای از گراف‌های schema.org
$article_meta = isset($article_meta) ? $article_meta : null; // برای مقالات
$robots     = isset($robots) ? $robots : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

$nav = [
    ['#hero', 'خانه'],
    ['#story', 'مسیر ما'],
    ['#services', 'خدمات'],
    ['#blog', 'مقالات'],
    ['#about', 'توانمندی‌ها'],
    ['#contact', 'تماس'],
];
?>
<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#181a1d">
<title><?= e($page_title) ?></title>
<meta name="description" content="<?= e($meta_desc) ?>">
<meta name="robots" content="<?= e($robots) ?>">
<meta name="author" content="<?= e(SITE_NAME) ?>">
<link rel="canonical" href="<?= e($canonical) ?>">
<link rel="alternate" hreflang="fa-IR" href="<?= e($canonical) ?>">
<link rel="alternate" hreflang="x-default" href="<?= e($canonical) ?>">
<!-- Open Graph -->
<meta property="og:type" content="<?= e($og_type) ?>">
<meta property="og:site_name" content="<?= e(SITE_NAME) ?>">
<meta property="og:locale" content="fa_IR">
<meta property="og:url" content="<?= e($canonical) ?>">
<meta property="og:title" content="<?= e($page_title) ?>">
<meta property="og:description" content="<?= e($meta_desc) ?>">
<meta property="og:image" content="<?= e($og_image) ?>">
<meta property="og:image:secure_url" content="<?= e($og_image) ?>">
<meta property="og:image:width" content="1680">
<meta property="og:image:height" content="945">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="<?= e($page_title) ?>">
<?php if ($article_meta): ?>
<?php if (!empty($article_meta['published'])): ?><meta property="article:published_time" content="<?= e($article_meta['published']) ?>"><?php endif; ?>
<?php if (!empty($article_meta['modified'])): ?><meta property="article:modified_time" content="<?= e($article_meta['modified']) ?>"><?php endif; ?>
<?php if (!empty($article_meta['section'])): ?><meta property="article:section" content="<?= e($article_meta['section']) ?>"><?php endif; ?>
<?php endif; ?>
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($page_title) ?>">
<meta name="twitter:description" content="<?= e($meta_desc) ?>">
<meta name="twitter:image" content="<?= e($og_image) ?>">
<meta name="twitter:image:alt" content="<?= e($page_title) ?>">
<link rel="icon" type="image/png" href="<?= e(url('/assets/logo-seirani.png')) ?>">
<link rel="apple-touch-icon" href="<?= e(url('/assets/logo-seirani.png')) ?>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?= e(url('/css/style.css?v=20260914-seo')) ?>">
<?php render_json_ld($json_ld); ?>
</head>
<body>
<header class="site-header">
  <a href="<?= e($nav_base ?: '#hero') ?>" class="logo-link" aria-label="<?= e(SITE_NAME) ?> — خانه">
    <img src="<?= e(url('/assets/logo-seirani.png')) ?>" alt="لوگوی <?= e(SITE_NAME) ?>" width="56" height="56" class="logo">
  </a>
  <nav class="nav" aria-label="ناوبری اصلی">
    <?php foreach ($nav as $i => $item): ?>
      <a href="<?= e($nav_base . $item[0]) ?>" class="nav-link<?= ($i === 0 && $nav_base === '') ? ' is-active' : '' ?>"><?= e($item[1]) ?></a>
    <?php endforeach; ?>
  </nav>
  <a href="<?= e($nav_base . '#contact') ?>" class="cta">درخواست مشاوره</a>
</header>
