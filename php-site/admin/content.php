<?php
require_once __DIR__ . '/../inc/bootstrap.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $action = $_POST['action'] ?? '';
    $t = function ($k) { return trim($_POST[$k] ?? ''); };

    if ($action === 'save_hero') {
        $stats = [];
        for ($i = 0; $i < 3; $i++) {
            $stats[] = ['num' => $t("stat_num_$i"), 'label' => $t("stat_label_$i")];
        }
        save_setting('hero', [
            'eyebrow' => $t('eyebrow'), 'titleLine1' => $t('titleLine1'), 'titleAccent' => $t('titleAccent'),
            'lead' => $t('lead'), 'ctaPrimary' => $t('ctaPrimary'), 'ctaSecondary' => $t('ctaSecondary'), 'stats' => $stats,
        ]);
        header('Location: ' . url('/admin/content.php?saved=hero')); exit;
    }
    if ($action === 'save_services_header') {
        save_setting('services', ['eyebrow' => $t('eyebrow'), 'title' => $t('title'), 'lead' => $t('lead')]);
        header('Location: ' . url('/admin/content.php?saved=services')); exit;
    }
    if ($action === 'save_blog_header') {
        save_setting('blog', ['eyebrow' => $t('eyebrow'), 'title' => $t('title'), 'lead' => $t('lead')]);
        header('Location: ' . url('/admin/content.php?saved=blog')); exit;
    }
    if ($action === 'save_about') {
        save_setting('about', ['eyebrow' => $t('eyebrow'), 'title' => $t('title'), 'lead' => $t('lead'), 'ctaText' => $t('ctaText')]);
        header('Location: ' . url('/admin/content.php?saved=about')); exit;
    }
    if ($action === 'save_contact') {
        save_setting('contact', [
            'eyebrow' => $t('eyebrow'), 'title' => trim($_POST['title'] ?? ''), 'lead' => $t('lead'),
            'address' => $t('address'), 'phoneDisplay' => $t('phoneDisplay'), 'phoneHref' => $t('phoneHref'), 'email' => $t('email'),
        ]);
        header('Location: ' . url('/admin/content.php?saved=contact')); exit;
    }
    if ($action === 'save_scenes') {
        $no = $_POST['s_no'] ?? []; $ki = $_POST['s_kicker'] ?? []; $ti = $_POST['s_title'] ?? [];
        $bo = $_POST['s_body'] ?? []; $sr = $_POST['s_src'] ?? [];
        $rows = [];
        for ($i = 0; $i < count($ti); $i++) {
            $title = trim($ti[$i] ?? '');
            if ($title === '') continue;
            $rows[] = ['no' => trim($no[$i] ?? ''), 'kicker' => trim($ki[$i] ?? ''), 'title' => $title,
                       'body' => trim($bo[$i] ?? ''), 'src' => trim($sr[$i] ?? '')];
        }
        replace_scenes($rows);
        header('Location: ' . url('/admin/content.php?saved=scenes')); exit;
    }
}

$hero = get_hero(); $svcH = get_services_header(); $blogH = get_blog_header();
$about = get_about(); $contact = get_contact(); $scenes = get_scenes();
$saved = $_GET['saved'] ?? '';
$savedLabels = ['hero'=>'بخش Hero','services'=>'سرتیتر خدمات','blog'=>'سرتیتر وبلاگ','about'=>'بخش درباره ما','contact'=>'اطلاعات تماس','scenes'=>'صحنه‌های مسیر'];

$active = 'content.php';
$admin_title = 'محتوای بخش‌ها';
include __DIR__ . '/_head.php';
?>
<div class="page-head"><div><h1 class="page-title">محتوای بخش‌ها</h1><p class="page-sub">ویرایش متن‌های بخش‌های اصلی صفحه</p></div></div>
<?php if ($saved && isset($savedLabels[$saved])): ?><div class="saved-msg"><?= e($savedLabels[$saved]) ?> ذخیره شد ✓</div><?php endif; ?>

<!-- Hero -->
<form method="post" class="form" style="margin-bottom:34px;">
  <?= csrf_field() ?><input type="hidden" name="action" value="save_hero">
  <div class="form-card">
    <h2 class="form-card-title">بخش نخست (Hero)</h2>
    <div class="field"><label class="label">خط بالا (eyebrow)</label><input name="eyebrow" class="input" value="<?= e($hero['eyebrow']) ?>"></div>
    <div class="two-col">
      <div class="field"><label class="label">عنوان — خط اول</label><input name="titleLine1" class="input" value="<?= e($hero['titleLine1']) ?>"></div>
      <div class="field"><label class="label">عنوان — بخش تأکیدی (طلایی)</label><input name="titleAccent" class="input" value="<?= e($hero['titleAccent']) ?>"></div>
    </div>
    <div class="field"><label class="label">توضیح</label><textarea name="lead" rows="3" class="textarea"><?= e($hero['lead']) ?></textarea></div>
    <div class="two-col">
      <div class="field"><label class="label">دکمه‌ی اصلی</label><input name="ctaPrimary" class="input" value="<?= e($hero['ctaPrimary']) ?>"></div>
      <div class="field"><label class="label">دکمه‌ی دوم</label><input name="ctaSecondary" class="input" value="<?= e($hero['ctaSecondary']) ?>"></div>
    </div>
    <label class="label">سه آمار کوچک پایین Hero</label>
    <?php for ($i = 0; $i < 3; $i++): $s = $hero['stats'][$i] ?? ['num'=>'','label'=>'']; ?>
      <div class="two-col">
        <div class="field"><input name="stat_num_<?= $i ?>" class="input" placeholder="عدد (مثلاً ۱۲+)" value="<?= e($s['num']) ?>"></div>
        <div class="field"><input name="stat_label_<?= $i ?>" class="input" placeholder="برچسب" value="<?= e($s['label']) ?>"></div>
      </div>
    <?php endfor; ?>
  </div>
  <div class="form-actions"><button type="submit" class="btn">ذخیره‌ی Hero</button></div>
</form>

<?php
function header_form($action, $title, $data) {
    $csrf = csrf_field();
    echo '<form method="post" class="form" style="margin-bottom:34px;">' . $csrf
       . '<input type="hidden" name="action" value="' . e($action) . '"><div class="form-card">'
       . '<h2 class="form-card-title">' . e($title) . '</h2>'
       . '<div class="field"><label class="label">خط بالا</label><input name="eyebrow" class="input" value="' . e($data['eyebrow']) . '"></div>'
       . '<div class="field"><label class="label">عنوان</label><input name="title" class="input" value="' . e($data['title']) . '"></div>'
       . '<div class="field"><label class="label">توضیح</label><textarea name="lead" rows="3" class="textarea">' . e($data['lead']) . '</textarea></div>'
       . '</div><div class="form-actions"><button type="submit" class="btn">ذخیره</button></div></form>';
}
header_form('save_services_header', 'سرتیتر بخش خدمات', $svcH);
?>

<!-- صحنه‌های مسیر -->
<form method="post" class="form" style="margin-bottom:34px;">
  <?= csrf_field() ?><input type="hidden" name="action" value="save_scenes">
  <h2 class="form-card-title" style="border:none;padding-bottom:4px;">صحنه‌های بخش «مسیر ما»</h2>
  <p class="hint" style="margin:-6px 0 6px;">برای حذف یک صحنه، «عنوان» آن را خالی کنید. ردیف خالیِ پایین برای افزودن است.</p>
  <?php $srows = $scenes; $srows[] = ['no'=>'','kicker'=>'','title'=>'','body'=>'','src'=>''];
  foreach ($srows as $i => $sc): ?>
    <div class="editor-row">
      <div class="two-col">
        <div class="field"><label class="label">شماره</label><input class="input" name="s_no[]" value="<?= e($sc['no']) ?>"></div>
        <div class="field"><label class="label">عنوان کوچک</label><input class="input" name="s_kicker[]" value="<?= e($sc['kicker']) ?>"></div>
      </div>
      <div class="field"><label class="label">عنوان</label><input class="input" name="s_title[]" value="<?= e($sc['title']) ?>"></div>
      <div class="field"><label class="label">متن</label><textarea class="textarea" rows="2" name="s_body[]"><?= e($sc['body']) ?></textarea></div>
      <div class="field"><label class="label">مسیر ویدئو</label><input dir="ltr" class="input" name="s_src[]" value="<?= e($sc['src']) ?>" placeholder="/assets/clip-2.mp4"></div>
    </div>
  <?php endforeach; ?>
  <div class="form-actions"><button type="submit" class="btn">ذخیره‌ی صحنه‌ها</button></div>
</form>

<?php header_form('save_blog_header', 'سرتیتر بخش مقالات', $blogH); ?>

<!-- درباره ما -->
<form method="post" class="form" style="margin-bottom:34px;">
  <?= csrf_field() ?><input type="hidden" name="action" value="save_about">
  <div class="form-card">
    <h2 class="form-card-title">بخش درباره ما</h2>
    <div class="field"><label class="label">خط بالا</label><input name="eyebrow" class="input" value="<?= e($about['eyebrow']) ?>"></div>
    <div class="field"><label class="label">عنوان</label><input name="title" class="input" value="<?= e($about['title']) ?>"></div>
    <div class="field"><label class="label">توضیح</label><textarea name="lead" rows="4" class="textarea"><?= e($about['lead']) ?></textarea></div>
    <div class="field"><label class="label">متن دکمه</label><input name="ctaText" class="input" value="<?= e($about['ctaText']) ?>"></div>
  </div>
  <div class="form-actions"><button type="submit" class="btn">ذخیره‌ی درباره ما</button></div>
</form>

<!-- تماس -->
<form method="post" class="form">
  <?= csrf_field() ?><input type="hidden" name="action" value="save_contact">
  <div class="form-card">
    <h2 class="form-card-title">بخش تماس و اطلاعات تماس</h2>
    <div class="field"><label class="label">خط بالا</label><input name="eyebrow" class="input" value="<?= e($contact['eyebrow']) ?>"></div>
    <div class="field"><label class="label">عنوان (برای شکستن خط، Enter بزنید)</label><textarea name="title" rows="2" class="textarea"><?= e($contact['title']) ?></textarea></div>
    <div class="field"><label class="label">توضیح</label><textarea name="lead" rows="2" class="textarea"><?= e($contact['lead']) ?></textarea></div>
    <div class="field"><label class="label">آدرس</label><input name="address" class="input" value="<?= e($contact['address']) ?>"></div>
    <div class="three-col">
      <div class="field"><label class="label">تلفن (نمایشی)</label><input name="phoneDisplay" class="input" value="<?= e($contact['phoneDisplay']) ?>"></div>
      <div class="field"><label class="label">تلفن (پیوند tel:)</label><input name="phoneHref" dir="ltr" class="input" value="<?= e($contact['phoneHref']) ?>"></div>
      <div class="field"><label class="label">ایمیل</label><input name="email" dir="ltr" class="input" value="<?= e($contact['email']) ?>"></div>
    </div>
  </div>
  <div class="form-actions"><button type="submit" class="btn">ذخیره‌ی تماس</button></div>
</form>
<?php include __DIR__ . '/_foot.php'; ?>
