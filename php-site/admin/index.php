<?php
require_once __DIR__ . '/../inc/bootstrap.php';
require_admin();

$posts = get_all_posts();
$published = 0;
foreach ($posts as $p) { if ((int)$p['published'] === 1) $published++; }
$services = get_services();
$subs = get_submissions();
$unread = unread_count();

$cards = [
    [count($posts), 'کل مقالات'],
    [$published, 'مقالات منتشرشده'],
    [count($services), 'خدمات'],
    [count($subs), 'درخواست‌های تماس'],
];
$tiles = [
    ['post-edit.php', 'نوشتن مقاله‌ی جدید', 'افزودن مقاله به وبلاگ با عنوان، خلاصه، دسته و متن کامل.'],
    ['posts.php', 'مدیریت مقالات', 'ویرایش، انتشار/پیش‌نویس و حذف مقالات موجود.'],
    ['services.php', 'خدمات و آمار', 'ویرایش کارت‌های خدمات (با آپلود آیکون) و اعداد آماری.'],
    ['content.php', 'محتوای بخش‌ها', 'ویرایش متن‌های Hero، مسیر ما، درباره، وبلاگ و اطلاعات تماس.'],
    ['submissions.php', 'درخواست‌های تماس' . ($unread > 0 ? ' (' . to_fa($unread) . ' جدید)' : ''), 'مشاهده و مدیریت پیام‌های فرم تماس.'],
];

$active = 'index.php';
$admin_title = 'داشبورد';
include __DIR__ . '/_head.php';
?>
<div class="page-head">
  <div><h1 class="page-title">داشبورد</h1><p class="page-sub">نمای کلی محتوای سایت</p></div>
</div>
<div class="cards">
  <?php foreach ($cards as $c): ?>
    <div class="stat-card"><div class="stat-card-num"><?= e(to_fa($c[0])) ?></div><div class="stat-card-label"><?= e($c[1]) ?></div></div>
  <?php endforeach; ?>
</div>
<div class="tiles">
  <?php foreach ($tiles as $t): ?>
    <a href="<?= e(url('/admin/' . $t[0])) ?>" class="tile"><div class="tile-title"><?= e($t[1]) ?></div><div class="tile-desc"><?= e($t[2]) ?></div></a>
  <?php endforeach; ?>
</div>
<?php include __DIR__ . '/_foot.php'; ?>
