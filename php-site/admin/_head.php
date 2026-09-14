<?php
$active      = isset($active) ? $active : '';
$admin_title = isset($admin_title) ? $admin_title : 'مدیریت';
$unread      = unread_count();
$items = [
    ['index.php', 'داشبورد'],
    ['posts.php', 'مقالات و وبلاگ'],
    ['services.php', 'خدمات و آمار'],
    ['content.php', 'محتوای بخش‌ها'],
    ['submissions.php', 'درخواست‌های تماس'],
];
?>
<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title><?= e($admin_title) ?> | <?= e(SITE_NAME) ?></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(url('/css/style.css?v=20260912-brand')) ?>">
  <link rel="stylesheet" href="<?= e(url('/admin/admin.css?v=20260912-brand')) ?>">
</head>
<body>
<div class="shell">
  <aside class="sidebar">
    <div class="brand">
      <img src="<?= e(url('/assets/logo-seirani.png')) ?>" alt="لوگوی <?= e(SITE_NAME) ?>" width="46" height="46" class="brand-logo">
      <div><div class="brand-name"><?= e(SITE_NAME) ?></div><div class="brand-sub">پنل مدیریت</div></div>
    </div>
    <nav style="display:grid;gap:6px;">
      <?php foreach ($items as $it): ?>
        <a href="<?= e(url('/admin/' . $it[0])) ?>" class="nav-item<?= $active === $it[0] ? ' is-active' : '' ?>">
          <span><?= e($it[1]) ?></span>
          <?php if ($it[0] === 'submissions.php' && $unread > 0): ?><span class="badge"><?= e(to_fa($unread)) ?></span><?php endif; ?>
        </a>
      <?php endforeach; ?>
    </nav>
    <div class="sidebar-foot">
      <a href="<?= e(url('/')) ?>" class="view-site" target="_blank">مشاهده‌ی سایت ↗</a>
      <form method="post" action="<?= e(url('/admin/logout.php')) ?>">
        <?= csrf_field() ?>
        <button type="submit" class="logout-btn">خروج از حساب</button>
      </form>
    </div>
  </aside>
  <main class="main">
