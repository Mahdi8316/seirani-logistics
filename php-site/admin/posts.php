<?php
require_once __DIR__ . '/../inc/bootstrap.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    check_csrf();
    $id = (int)($_POST['id'] ?? 0);
    if ($id) delete_post($id);
    header('Location: ' . url('/admin/posts.php'));
    exit;
}

$posts = get_all_posts();
$active = 'posts.php';
$admin_title = 'مقالات';
include __DIR__ . '/_head.php';
?>
<div class="page-head">
  <div><h1 class="page-title">مقالات و وبلاگ</h1><p class="page-sub">مدیریت مقالات منتشرشده و پیش‌نویس‌ها</p></div>
  <a href="<?= e(url('/admin/post-edit.php')) ?>" class="btn">+ مقاله‌ی جدید</a>
</div>

<?php if (!$posts): ?>
  <div class="empty">هنوز مقاله‌ای ثبت نشده است.</div>
<?php else: ?>
  <div class="table-wrap">
    <table class="table">
      <thead><tr><th>عنوان</th><th>دسته</th><th>وضعیت</th><th>تاریخ</th><th>عملیات</th></tr></thead>
      <tbody>
        <?php foreach ($posts as $p): ?>
          <tr>
            <td><?= e($p['title']) ?></td>
            <td><?= e($p['category'] ?: '—') ?></td>
            <td><span class="pill <?= (int)$p['published'] === 1 ? 'pill-on' : 'pill-off' ?>"><?= (int)$p['published'] === 1 ? 'منتشرشده' : 'پیش‌نویس' ?></span></td>
            <td><?= e(fa_date($p['created_at'])) ?></td>
            <td>
              <div class="row-actions">
                <a href="<?= e(url('/admin/post-edit.php?id=' . (int)$p['id'])) ?>" class="link-action">ویرایش</a>
                <?php if ((int)$p['published'] === 1): ?>
                  <a href="<?= e(post_url($p)) ?>" target="_blank" class="link-action">مشاهده</a>
                <?php endif; ?>
                <form method="post" onsubmit="return confirm('این مقاله حذف شود؟');">
                  <?= csrf_field() ?>
                  <input type="hidden" name="action" value="delete">
                  <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
                  <button type="submit" class="btn-danger">حذف</button>
                </form>
              </div>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
<?php endif; ?>
<?php include __DIR__ . '/_foot.php'; ?>
