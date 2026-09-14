<?php
require_once __DIR__ . '/../inc/bootstrap.php';
require_admin();

$saved = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $action = $_POST['action'] ?? '';

    if ($action === 'save_services') {
        $ids = $_POST['existing_ids'] ?? [];
        foreach ($ids as $id) {
            $id = (int)$id;
            if (!empty($_POST["delete_$id"])) { delete_service($id); continue; }
            $no    = trim($_POST["no_$id"] ?? '');
            $title = trim($_POST["title_$id"] ?? '');
            $body  = trim($_POST["body_$id"] ?? '');
            $sort  = (int)($_POST["sort_$id"] ?? 0);
            update_service_text($id, $no, $title, $body, $sort);
            if (!empty($_POST["remove_icon_$id"])) {
                set_service_icon($id, null);
            } else {
                $data = uploaded_image_data_url("icon_$id");
                if ($data !== null) set_service_icon($id, $data);
            }
        }
        // خدمت جدید
        $newTitle = trim($_POST['new_title'] ?? '');
        if ($newTitle !== '') {
            $newNo   = trim($_POST['new_no'] ?? '');
            $newBody = trim($_POST['new_body'] ?? '');
            $newIcon = uploaded_image_data_url('new_icon');
            insert_service($newNo, $newTitle, $newBody, $newIcon, max_service_sort() + 1);
        }
        header('Location: ' . url('/admin/services.php?saved=services'));
        exit;
    }

    if ($action === 'save_stats') {
        $ns = $_POST['n'] ?? [];
        $sf = $_POST['suffix'] ?? [];
        $lb = $_POST['label'] ?? [];
        $rows = [];
        for ($i = 0; $i < count($lb); $i++) {
            $label = trim($lb[$i] ?? '');
            if ($label === '') continue;
            $rows[] = ['n' => (int)($ns[$i] ?? 0), 'suffix' => trim($sf[$i] ?? ''), 'label' => $label];
        }
        replace_stats($rows);
        header('Location: ' . url('/admin/services.php?saved=stats'));
        exit;
    }
}

$services = get_services();
$stats = get_stats();
$saved = $_GET['saved'] ?? '';

$active = 'services.php';
$admin_title = 'خدمات و آمار';
include __DIR__ . '/_head.php';
?>
<div class="page-head">
  <div><h1 class="page-title">خدمات و آمار</h1><p class="page-sub">ویرایش کارت‌های خدمات (با آپلود آیکون) و اعداد آماری</p></div>
</div>

<?php if ($saved === 'services'): ?><div class="saved-msg">خدمات ذخیره شد ✓</div>
<?php elseif ($saved === 'stats'): ?><div class="saved-msg">آمار ذخیره شد ✓</div><?php endif; ?>

<!-- ================= خدمات ================= -->
<form method="post" enctype="multipart/form-data" class="form">
  <?= csrf_field() ?>
  <input type="hidden" name="action" value="save_services">
  <h2 class="form-card-title" style="border:none;padding-bottom:4px;">کارت‌های خدمات</h2>

  <?php foreach ($services as $i => $sv): $id = (int)$sv['id']; ?>
    <div class="editor-row">
      <input type="hidden" name="existing_ids[]" value="<?= $id ?>">
      <div class="editor-row-head">
        <span class="editor-row-num">خدمت #<?= e(to_fa($i + 1)) ?></span>
        <label class="check-row" style="font-size:13px;"><input type="checkbox" name="delete_<?= $id ?>"> حذف این خدمت</label>
      </div>
      <div class="three-col">
        <div class="field"><label class="label">ترتیب</label><input type="number" dir="ltr" class="input" name="sort_<?= $id ?>" value="<?= (int)$sv['sort'] ?>"></div>
        <div class="field"><label class="label">شماره</label><input class="input" name="no_<?= $id ?>" value="<?= e($sv['no']) ?>"></div>
        <div class="field"><label class="label">عنوان</label><input class="input" name="title_<?= $id ?>" value="<?= e($sv['title']) ?>"></div>
      </div>
      <div class="field"><label class="label">توضیح</label><textarea class="textarea" rows="2" name="body_<?= $id ?>"><?= e($sv['body']) ?></textarea></div>
      <div class="field">
        <label class="label">آیکون (اختیاری — PNG/SVG، کمتر از ۵۱۲KB)</label>
        <div class="icon-row">
          <div class="icon-preview"><?php if (!empty($sv['icon'])): ?><img src="<?= e($sv['icon']) ?>" alt=""><?php else: ?><span>—</span><?php endif; ?></div>
          <label class="upload-btn"><?= !empty($sv['icon']) ? 'تغییر آیکون' : 'بارگذاری آیکون' ?><input type="file" name="icon_<?= $id ?>" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden></label>
          <?php if (!empty($sv['icon'])): ?><label class="check-row" style="font-size:13px;"><input type="checkbox" name="remove_icon_<?= $id ?>"> حذف آیکون</label><?php endif; ?>
        </div>
      </div>
    </div>
  <?php endforeach; ?>

  <!-- افزودن خدمت جدید -->
  <div class="editor-row" style="border-style:dashed;">
    <span class="editor-row-num">افزودن خدمت جدید</span>
    <div class="two-col">
      <div class="field"><label class="label">شماره</label><input class="input" name="new_no" placeholder="مثلاً ۰۹"></div>
      <div class="field"><label class="label">عنوان</label><input class="input" name="new_title" placeholder="عنوان خدمت جدید"></div>
    </div>
    <div class="field"><label class="label">توضیح</label><textarea class="textarea" rows="2" name="new_body"></textarea></div>
    <div class="field"><label class="label">آیکون</label><label class="upload-btn">بارگذاری آیکون<input type="file" name="new_icon" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden></label></div>
  </div>

  <div class="form-actions"><button type="submit" class="btn">ذخیره‌ی خدمات</button></div>
</form>

<!-- ================= آمار ================= -->
<form method="post" class="form" style="margin-top:40px;">
  <?= csrf_field() ?>
  <input type="hidden" name="action" value="save_stats">
  <h2 class="form-card-title" style="border:none;padding-bottom:4px;">اعداد آماری (بخش «درباره ما»)</h2>
  <p class="hint" style="margin:-6px 0 6px;">برای حذف یک ردیف، «برچسب» آن را خالی کنید. ردیف‌های خالیِ پایین برای افزودن هستند.</p>

  <?php
  $rows = $stats;
  // دو ردیف خالی برای افزودن
  $rows[] = ['n' => '', 'suffix' => '', 'label' => ''];
  $rows[] = ['n' => '', 'suffix' => '', 'label' => ''];
  foreach ($rows as $i => $r): ?>
    <div class="editor-row">
      <div class="three-col">
        <div class="field"><label class="label">عدد</label><input type="number" dir="ltr" class="input" name="n[]" value="<?= e($r['n']) ?>"></div>
        <div class="field"><label class="label">پسوند</label><input class="input" name="suffix[]" value="<?= e($r['suffix']) ?>" placeholder="مثلاً + یا ٪"></div>
        <div class="field"><label class="label">برچسب</label><input class="input" name="label[]" value="<?= e($r['label']) ?>"></div>
      </div>
    </div>
  <?php endforeach; ?>

  <div class="form-actions"><button type="submit" class="btn">ذخیره‌ی آمار</button></div>
</form>
<?php include __DIR__ . '/_foot.php'; ?>
