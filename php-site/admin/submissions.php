<?php
require_once __DIR__ . '/../inc/bootstrap.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $action = $_POST['action'] ?? '';
    $id = (int)($_POST['id'] ?? 0);
    if ($id && $action === 'toggle') mark_submission($id, (int)($_POST['read'] ?? 0));
    if ($id && $action === 'delete') delete_submission($id);
    header('Location: ' . url('/admin/submissions.php'));
    exit;
}

$subs = get_submissions();
$active = 'submissions.php';
$admin_title = 'درخواست‌های تماس';
include __DIR__ . '/_head.php';
?>
<div class="page-head"><div><h1 class="page-title">درخواست‌های تماس</h1><p class="page-sub">پیام‌های ارسال‌شده از فرم تماس سایت</p></div></div>

<?php if (!$subs): ?>
  <div class="empty">هنوز درخواستی ثبت نشده است.</div>
<?php else: ?>
  <div class="table-wrap">
    <table class="table">
      <thead><tr><th>نام</th><th>تلفن</th><th>خدمت</th><th>توضیح</th><th>تاریخ</th><th>عملیات</th></tr></thead>
      <tbody>
        <?php foreach ($subs as $s): ?>
          <tr>
            <td><?php if ((int)$s['is_read'] === 0): ?><span class="pill pill-new">جدید</span><?php endif; ?><?= e($s['name']) ?></td>
            <td dir="ltr" style="text-align:right;"><?= e($s['phone']) ?></td>
            <td><?= e($s['service'] ?: '—') ?></td>
            <td style="max-width:320px;white-space:pre-wrap;"><?= e($s['description'] ?: '—') ?></td>
            <td><?= e(fa_date($s['created_at'])) ?></td>
            <td>
              <div class="row-actions">
                <form method="post">
                  <?= csrf_field() ?>
                  <input type="hidden" name="action" value="toggle">
                  <input type="hidden" name="id" value="<?= (int)$s['id'] ?>">
                  <input type="hidden" name="read" value="<?= (int)$s['is_read'] === 0 ? 1 : 0 ?>">
                  <button type="submit" class="link-action"><?= (int)$s['is_read'] === 0 ? 'علامت‌گذاری خوانده‌شده' : 'علامت‌گذاری نخوانده' ?></button>
                </form>
                <form method="post" onsubmit="return confirm('این درخواست حذف شود؟');">
                  <?= csrf_field() ?>
                  <input type="hidden" name="action" value="delete">
                  <input type="hidden" name="id" value="<?= (int)$s['id'] ?>">
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
