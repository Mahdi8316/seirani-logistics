<?php
require_once __DIR__ . '/../inc/bootstrap.php';
require_admin();

$error = '';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$post = $id ? get_post_by_id($id) : null;
if ($id && !$post) { http_response_code(404); die('مقاله یافت نشد.'); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $id        = (int)($_POST['id'] ?? 0);
    $title     = trim($_POST['title'] ?? '');
    $excerpt   = trim($_POST['excerpt'] ?? '');
    $body      = trim($_POST['body'] ?? '');
    $category  = trim($_POST['category'] ?? '');
    $cover     = trim($_POST['cover'] ?? '');
    $cover     = $cover !== '' ? $cover : null;
    $published = isset($_POST['published']) ? 1 : 0;
    $slug      = slugify($_POST['slug'] ?? '');
    if ($slug === '') $slug = slugify($title);
    if ($slug === '') $slug = 'post-' . time();

    if ($title === '') {
        $error = 'عنوان مقاله الزامی است.';
    } elseif (slug_exists($slug, $id ?: null)) {
        $error = 'این نامک (slug) قبلاً استفاده شده است.';
    } else {
        if ($id) update_post($id, $slug, $title, $excerpt, $body, $cover, $category, $published);
        else     create_post($slug, $title, $excerpt, $body, $cover, $category, $published);
        header('Location: ' . url('/admin/posts.php'));
        exit;
    }
    // در صورت خطا، مقادیر واردشده را نگه دار
    $post = ['id' => $id, 'title' => $title, 'slug' => $slug, 'category' => $category,
             'cover' => $cover, 'excerpt' => $excerpt, 'body' => $body, 'published' => $published];
}

$v = function ($k, $d = '') use ($post) { return $post && isset($post[$k]) ? $post[$k] : $d; };
$isPub = $post ? ((int)$v('published', 1) === 1) : true;

$active = 'posts.php';
$admin_title = $id ? 'ویرایش مقاله' : 'مقاله‌ی جدید';
include __DIR__ . '/_head.php';
?>
<div class="page-head">
  <div><h1 class="page-title"><?= $id ? 'ویرایش مقاله' : 'مقاله‌ی جدید' ?></h1>
  <p class="page-sub"><?= $id ? e($v('title')) : 'یک مقاله‌ی تازه برای وبلاگ بنویسید' ?></p></div>
</div>

<form method="post" class="form">
  <?= csrf_field() ?>
  <?php if ($id): ?><input type="hidden" name="id" value="<?= (int)$id ?>"><?php endif; ?>
  <div class="form-card">
    <div class="field">
      <label class="label" for="title">عنوان مقاله *</label>
      <input id="title" name="title" class="input" value="<?= e($v('title')) ?>" required>
    </div>
    <div class="two-col">
      <div class="field">
        <label class="label" for="slug">نامک (slug)</label>
        <input id="slug" name="slug" dir="ltr" class="input" value="<?= e($v('slug')) ?>" placeholder="در صورت خالی‌بودن از عنوان ساخته می‌شود">
        <span class="hint">در آدرس مقاله استفاده می‌شود.</span>
      </div>
      <div class="field">
        <label class="label" for="category">دسته‌بندی</label>
        <input id="category" name="category" class="input" value="<?= e($v('category')) ?>" placeholder="مثلاً: گمرک، ترانزیت">
      </div>
    </div>
    <div class="field">
      <label class="label" for="cover">نشانی تصویر شاخص (اختیاری)</label>
      <input id="cover" name="cover" dir="ltr" class="input" value="<?= e($v('cover')) ?>" placeholder="/assets/cover.jpg یا آدرس کامل تصویر">
    </div>
    <div class="field">
      <label class="label" for="excerpt">خلاصه</label>
      <textarea id="excerpt" name="excerpt" rows="3" class="textarea"><?= e($v('excerpt')) ?></textarea>
    </div>
    <div class="field">
      <label class="label" for="body">متن مقاله</label>
      <textarea id="body" name="body" rows="16" class="textarea" placeholder="با ## برای عنوان و خط خالی برای جدا کردن پاراگراف‌ها بنویسید."><?= e($v('body')) ?></textarea>
      <span class="hint">برای عنوان‌ها از «## عنوان» و «### زیرعنوان» و برای جدا کردن پاراگراف‌ها از خط خالی استفاده کنید.</span>
    </div>
    <label class="check-row"><input type="checkbox" name="published" <?= $isPub ? 'checked' : '' ?>> انتشار روی سایت (در غیر این صورت پیش‌نویس می‌ماند)</label>
  </div>
  <?php if ($error): ?><p class="error-msg"><?= e($error) ?></p><?php endif; ?>
  <div class="form-actions">
    <button type="submit" class="btn"><?= $id ? 'ذخیره‌ی تغییرات' : 'ثبت مقاله' ?></button>
    <a href="<?= e(url('/admin/posts.php')) ?>" class="btn-ghost">انصراف</a>
  </div>
</form>
<?php include __DIR__ . '/_foot.php'; ?>
