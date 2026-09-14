<?php
require_once __DIR__ . '/../inc/bootstrap.php';
if (is_logged_in()) { header('Location: ' . url('/admin/index.php')); exit; }

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $u = trim($_POST['username'] ?? '');
    $p = $_POST['password'] ?? '';
    if ($u === '' || $p === '') {
        $error = 'نام‌کاربری و رمز عبور را وارد کنید.';
    } elseif (login_user($u, $p)) {
        header('Location: ' . url('/admin/index.php'));
        exit;
    } else {
        $error = 'نام‌کاربری یا رمز عبور نادرست است.';
    }
}
?>
<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ورود مدیریت | <?= e(SITE_NAME) ?></title>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?= e(url('/css/style.css')) ?>">
<link rel="stylesheet" href="<?= e(url('/admin/admin.css')) ?>">
</head>
<body>
<div class="login-wrap">
  <div class="login-card">
    <div class="login-head">
      <h1 class="login-title">ورود به پنل مدیریت</h1>
      <p class="login-sub"><?= e(SITE_NAME) ?> — بخش مدیریت محتوا</p>
    </div>
    <form method="post" class="form" style="gap:16px;max-width:none;">
      <?= csrf_field() ?>
      <div class="field">
        <label class="label" for="username">نام‌کاربری</label>
        <input id="username" name="username" type="text" autocomplete="username" class="input" required>
      </div>
      <div class="field">
        <label class="label" for="password">رمز عبور</label>
        <input id="password" name="password" type="password" autocomplete="current-password" class="input" required>
      </div>
      <?php if ($error): ?><p class="error-msg"><?= e($error) ?></p><?php endif; ?>
      <button type="submit" class="btn" style="width:100%;justify-content:center;">ورود</button>
    </form>
  </div>
</div>
</body>
</html>
