<?php
require_once __DIR__ . '/db.php';

/* ------------------------------- پایه ------------------------------- */

function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

function url($path = '') { return BASE_PATH . $path; }

/** آدرس‌های عمومی تمیز و یکتا برای صفحات محتوایی. */
function blog_url() { return url('/blog'); }
function post_url($post_or_slug) {
    $slug = is_array($post_or_slug) ? $post_or_slug['slug'] : $post_or_slug;
    return url('/blog/' . rawurlencode((string)$slug));
}

/* ----------------------------- فارسی‌سازی ----------------------------- */

function to_fa($s) {
    $en = ['0','1','2','3','4','5','6','7','8','9',','];
    $fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹','٬'];
    return str_replace($en, $fa, (string)$s);
}

function fa_number($n) { return to_fa(number_format((float)$n)); }

function gregorian_to_jalali($gy, $gm, $gd) {
    $g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
    $gy2 = ($gm > 2) ? ($gy + 1) : $gy;
    $days = 355666 + (365 * $gy) + intdiv($gy2 + 3, 4) - intdiv($gy2 + 99, 100)
          + intdiv($gy2 + 399, 400) + $gd + $g_d_m[$gm - 1];
    $jy = -1595 + (33 * intdiv($days, 12053));
    $days %= 12053;
    $jy += 4 * intdiv($days, 1461);
    $days %= 1461;
    if ($days > 365) { $jy += intdiv($days - 1, 365); $days = ($days - 1) % 365; }
    if ($days < 186) { $jm = 1 + intdiv($days, 31); $jd = 1 + ($days % 31); }
    else { $jm = 7 + intdiv($days - 186, 30); $jd = 1 + (($days - 186) % 30); }
    return [$jy, $jm, $jd];
}

function fa_date($datetime) {
    $t = strtotime($datetime);
    if (!$t) return '';
    $months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
               'مهر','آبان','آذر','دی','بهمن','اسفند'];
    list($jy, $jm, $jd) = gregorian_to_jalali((int)date('Y', $t), (int)date('n', $t), (int)date('j', $t));
    return to_fa($jd . ' ' . $months[$jm - 1] . ' ' . $jy);
}

/* ------------------------------ تنظیمات ------------------------------ */

function get_setting($key) {
    $row = db()->prepare("SELECT sval FROM settings WHERE skey = ?");
    $row->execute([$key]);
    $val = $row->fetchColumn();
    $defaults = default_settings();
    if ($val === false) return isset($defaults[$key]) ? $defaults[$key] : [];
    $decoded = json_decode($val, true);
    if (!is_array($decoded)) return isset($defaults[$key]) ? $defaults[$key] : [];
    // ادغام با پیش‌فرض تا اگر کلیدی جا افتاد، خطا ندهد
    if (isset($defaults[$key]) && is_array($defaults[$key])) {
        return array_merge($defaults[$key], $decoded);
    }
    return $decoded;
}

function save_setting($key, $value) {
    $stmt = db()->prepare("INSERT INTO settings (skey, sval) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE sval = VALUES(sval)");
    $stmt->execute([$key, json_encode($value, JSON_UNESCAPED_UNICODE)]);
}

function get_hero()            { return get_setting('hero'); }
function get_services_header() { return get_setting('services'); }
function get_blog_header()     { return get_setting('blog'); }
function get_about()           { return get_setting('about'); }
function get_contact()         { return get_setting('contact'); }

/* --------------------------- خدمات و آمار --------------------------- */

function get_services() {
    return db()->query("SELECT * FROM services ORDER BY sort ASC, id ASC")->fetchAll();
}
function get_service($id) {
    $s = db()->prepare("SELECT * FROM services WHERE id = ?");
    $s->execute([$id]);
    $r = $s->fetch();
    return $r ?: null;
}
function get_stats() {
    return db()->query("SELECT * FROM stats ORDER BY sort ASC, id ASC")->fetchAll();
}
function get_scenes() {
    return db()->query("SELECT * FROM scenes ORDER BY sort ASC, id ASC")->fetchAll();
}

/* ------------------------------- مقالات ------------------------------- */

function get_published_posts($limit = null) {
    if ($limit !== null) {
        $s = db()->prepare("SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC, id DESC LIMIT ?");
        $s->bindValue(1, (int)$limit, PDO::PARAM_INT);
        $s->execute();
        return $s->fetchAll();
    }
    return db()->query("SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC, id DESC")->fetchAll();
}
function get_all_posts() {
    return db()->query("SELECT * FROM posts ORDER BY created_at DESC, id DESC")->fetchAll();
}
function get_post_by_slug($slug) {
    $s = db()->prepare("SELECT * FROM posts WHERE slug = ?");
    $s->execute([$slug]);
    return $s->fetch() ?: null;
}
function get_post_by_id($id) {
    $s = db()->prepare("SELECT * FROM posts WHERE id = ?");
    $s->execute([$id]);
    return $s->fetch() ?: null;
}
function slug_exists($slug, $except_id = null) {
    $s = db()->prepare("SELECT id FROM posts WHERE slug = ?");
    $s->execute([$slug]);
    $id = $s->fetchColumn();
    if ($id === false) return false;
    return $except_id ? ((int)$id !== (int)$except_id) : true;
}
function slugify($s) {
    $s = trim(strtolower($s)); // فقط حروف لاتین را کوچک می‌کند؛ فارسی دست‌نخورده
    $s = preg_replace('/\s+/u', '-', $s);
    $s = preg_replace('/[^\p{L}\p{N}\-]/u', '', $s);
    $s = preg_replace('/-+/', '-', $s);
    return trim($s, '-');
}

/** رندر ساده‌ی متن مقاله به HTML امن (## عنوان، ### زیرعنوان، پاراگراف). */
function render_post_body($text) {
    $blocks = preg_split('/\n{2,}/', trim((string)$text));
    $out = '';
    foreach ($blocks as $b) {
        $b = trim($b);
        if ($b === '') continue;
        // نشانگرهای «## » و «### » اسکی هستند؛ substr بایتی درست کار می‌کند.
        if (substr($b, 0, 4) === '### ') {
            $out .= '<h3>' . e(substr($b, 4)) . '</h3>';
        } elseif (substr($b, 0, 3) === '## ') {
            $out .= '<h2>' . e(substr($b, 3)) . '</h2>';
        } else {
            $out .= '<p>' . nl2br(e($b)) . '</p>';
        }
    }
    return $out;
}

/* --------------------------- مقالات: نوشتن --------------------------- */

function create_post($slug, $title, $excerpt, $body, $cover, $category, $published) {
    $now = date('Y-m-d H:i:s');
    $s = db()->prepare("INSERT INTO posts (slug, title, excerpt, body, cover, category, published, created_at, updated_at)
        VALUES (?,?,?,?,?,?,?,?,?)");
    $s->execute([$slug, $title, $excerpt, $body, $cover, $category, $published ? 1 : 0, $now, $now]);
    return (int)db()->lastInsertId();
}
function update_post($id, $slug, $title, $excerpt, $body, $cover, $category, $published) {
    $s = db()->prepare("UPDATE posts SET slug=?, title=?, excerpt=?, body=?, cover=?, category=?, published=?, updated_at=? WHERE id=?");
    $s->execute([$slug, $title, $excerpt, $body, $cover, $category, $published ? 1 : 0, date('Y-m-d H:i:s'), $id]);
}
function delete_post($id) {
    db()->prepare("DELETE FROM posts WHERE id = ?")->execute([$id]);
}

/* --------------------------- خدمات: نوشتن --------------------------- */

function update_service_text($id, $no, $title, $body, $sort) {
    $s = db()->prepare("UPDATE services SET `no`=?, title=?, body=?, sort=? WHERE id=?");
    $s->execute([$no, $title, $body, $sort, $id]);
}
function set_service_icon($id, $icon) { // $icon = data URL یا null
    $s = db()->prepare("UPDATE services SET icon=? WHERE id=?");
    $s->execute([$icon, $id]);
}
function insert_service($no, $title, $body, $icon, $sort) {
    $s = db()->prepare("INSERT INTO services (`no`, title, body, icon, sort) VALUES (?,?,?,?,?)");
    $s->execute([$no, $title, $body, $icon, $sort]);
}
function delete_service($id) {
    db()->prepare("DELETE FROM services WHERE id = ?")->execute([$id]);
}
function max_service_sort() {
    return (int)db()->query("SELECT COALESCE(MAX(sort), -1) FROM services")->fetchColumn();
}

/* --------------------- آمار و صحنه‌ها: جایگزینی کامل --------------------- */

function replace_stats($rows) { // هر ردیف: ['n'=>,'suffix'=>,'label'=>]
    $pdo = db();
    $pdo->beginTransaction();
    try {
        $pdo->exec("DELETE FROM stats");
        $ins = $pdo->prepare("INSERT INTO stats (n, suffix, label, sort) VALUES (?,?,?,?)");
        $i = 0;
        foreach ($rows as $r) { $ins->execute([(int)$r['n'], $r['suffix'], $r['label'], $i++]); }
        $pdo->commit();
    } catch (Exception $ex) { $pdo->rollBack(); throw $ex; }
}

function replace_scenes($rows) { // هر ردیف: ['no','kicker','title','body','src']
    $pdo = db();
    $pdo->beginTransaction();
    try {
        $pdo->exec("DELETE FROM scenes");
        $ins = $pdo->prepare("INSERT INTO scenes (`no`, kicker, title, body, src, sort) VALUES (?,?,?,?,?,?)");
        $i = 0;
        foreach ($rows as $r) { $ins->execute([$r['no'], $r['kicker'], $r['title'], $r['body'], $r['src'], $i++]); }
        $pdo->commit();
    } catch (Exception $ex) { $pdo->rollBack(); throw $ex; }
}

/* --------------------------- آپلود تصویر آیکون --------------------------- */

/** فایل آپلودشده را به data URL برمی‌گرداند؛ در صورت نبود/خطا null. */
function uploaded_image_data_url($field) {
    if (empty($_FILES[$field]) || $_FILES[$field]['error'] !== UPLOAD_ERR_OK) return null;
    $f = $_FILES[$field];
    if (!is_uploaded_file($f['tmp_name'])) return null;
    if ($f['size'] > 512 * 1024) return null; // بیش از ۵۱۲ کیلوبایت
    $mime = '';
    if (function_exists('finfo_open')) {
        $fi = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($fi, $f['tmp_name']);
        finfo_close($fi);
    }
    if (!$mime) $mime = $f['type'];
    $allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!in_array($mime, $allowed, true)) return null;
    $data = file_get_contents($f['tmp_name']);
    if ($data === false) return null;
    return 'data:' . $mime . ';base64,' . base64_encode($data);
}

/* --------------------------- درخواست تماس --------------------------- */

function create_submission($name, $phone, $service, $description) {
    $s = db()->prepare("INSERT INTO submissions (name, phone, service, description, created_at, is_read)
        VALUES (?,?,?,?,?,0)");
    $s->execute([$name, $phone, $service, $description, date('Y-m-d H:i:s')]);
}
function get_submissions() {
    return db()->query("SELECT * FROM submissions ORDER BY created_at DESC, id DESC")->fetchAll();
}
function unread_count() {
    return (int)db()->query("SELECT COUNT(*) FROM submissions WHERE is_read = 0")->fetchColumn();
}
function mark_submission($id, $read) {
    $s = db()->prepare("UPDATE submissions SET is_read = ? WHERE id = ?");
    $s->execute([$read ? 1 : 0, $id]);
}
function delete_submission($id) {
    db()->prepare("DELETE FROM submissions WHERE id = ?")->execute([$id]);
}

/* ------------------------------ احراز هویت ------------------------------ */

function start_session() {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_name('seirani_admin');
        session_start();
    }
}
function is_logged_in() {
    start_session();
    return !empty($_SESSION['uid']);
}
function current_username() {
    start_session();
    return isset($_SESSION['uname']) ? $_SESSION['uname'] : '';
}
function login_user($username, $password) {
    $s = db()->prepare("SELECT * FROM users WHERE username = ?");
    $s->execute([$username]);
    $u = $s->fetch();
    if (!$u) return false;
    if (!password_verify($password, $u['password_hash'])) return false;
    start_session();
    session_regenerate_id(true);
    $_SESSION['uid'] = $u['id'];
    $_SESSION['uname'] = $u['username'];
    return true;
}
function logout_user() {
    start_session();
    $_SESSION = [];
    session_destroy();
}
function require_admin() {
    if (!is_logged_in()) {
        header('Location: ' . url('/admin/login.php'));
        exit;
    }
}

/* --------------------------------- CSRF --------------------------------- */

function csrf_token() {
    start_session();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}
function csrf_field() {
    return '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">';
}
function check_csrf() {
    start_session();
    $token = isset($_POST['csrf']) ? $_POST['csrf'] : '';
    if (empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $token)) {
        http_response_code(400);
        die('توکن امنیتی نامعتبر است. صفحه را دوباره باز کنید.');
    }
}

/* ============================ سئو / داده‌ی ساختاری ============================ */

/** نشانی مطلق از یک مسیر یا آدرس (اگر از قبل کامل بود، دست‌نخورده). */
function abs_url($path) {
    if ($path === '' || $path === null) return '';
    if (preg_match('#^https?://#i', $path)) return $path;
    if ($path[0] === '/') return SITE_URL . url($path);
    return SITE_URL . url('/' . $path);
}

/** گراف Organization برای schema.org */
function seo_org() {
    $c = get_contact();
    $org = [
        '@type'       => 'Organization',
        '@id'         => SITE_URL . '/#organization',
        'name'        => SITE_NAME,
        'url'         => SITE_URL . '/',
        'logo'        => abs_url('/assets/logo-seirani.png'),
        'image'       => abs_url('/assets/og-seirani.jpg'),
        'description' => SITE_TAGLINE,
    ];
    $cp = ['@type' => 'ContactPoint', 'contactType' => 'customer service'];
    if (!empty($c['phoneHref'])) $cp['telephone'] = $c['phoneHref'];
    if (!empty($c['email']))     $cp['email']     = $c['email'];
    if (isset($cp['telephone']) || isset($cp['email'])) $org['contactPoint'] = $cp;
    if (!empty($c['address'])) {
        $org['address'] = ['@type' => 'PostalAddress', 'streetAddress' => $c['address'], 'addressCountry' => 'IR'];
    }
    return $org;
}

/** گراف WebSite */
function seo_website() {
    return [
        '@type'      => 'WebSite',
        '@id'        => SITE_URL . '/#website',
        'name'       => SITE_NAME,
        'url'        => SITE_URL . '/',
        'inLanguage' => 'fa-IR',
        'publisher'  => ['@id' => SITE_URL . '/#organization'],
    ];
}

/** گراف صفحهٔ آرشیو وبلاگ */
function seo_blog($posts) {
    $items = [];
    $position = 1;
    foreach ($posts as $post) {
        $items[] = [
            '@type'    => 'ListItem',
            'position' => $position++,
            'url'      => SITE_URL . post_url($post),
            'name'     => $post['title'],
        ];
    }
    return [
        '@type'       => 'Blog',
        '@id'         => SITE_URL . blog_url() . '#blog',
        'url'         => SITE_URL . blog_url(),
        'name'        => 'مقالات ' . SITE_NAME,
        'description' => 'مقالات تخصصی ترخیص گمرکی، ترانزیت و بازرگانی بین‌الملل',
        'inLanguage'  => 'fa-IR',
        'publisher'   => ['@id' => SITE_URL . '/#organization'],
        'mainEntity'  => ['@type' => 'ItemList', 'itemListElement' => $items],
    ];
}

/** گراف مقاله (BlogPosting) */
function seo_article($post) {
    $img = !empty($post['cover']) ? abs_url($post['cover']) : abs_url('/assets/og-seirani.jpg');
    $pageUrl = SITE_URL . post_url($post);
    return [
        '@type'            => 'BlogPosting',
        'headline'         => $post['title'],
        'description'      => $post['excerpt'],
        'image'            => $img,
        'datePublished'    => date('c', strtotime($post['created_at'])),
        'dateModified'     => date('c', strtotime($post['updated_at'])),
        'inLanguage'       => 'fa-IR',
        'articleSection'   => $post['category'],
        'wordCount'        => count(preg_split('/\s+/u', trim(strip_tags($post['body'])), -1, PREG_SPLIT_NO_EMPTY)),
        'author'           => ['@id' => SITE_URL . '/#organization'],
        'publisher'        => ['@id' => SITE_URL . '/#organization'],
        'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $pageUrl],
    ];
}

/** گراف مسیر راهنما (BreadcrumbList). ورودی: [[name, url|null], ...] */
function seo_breadcrumb($items) {
    $list = [];
    $i = 1;
    foreach ($items as $it) {
        $entry = ['@type' => 'ListItem', 'position' => $i++, 'name' => $it[0]];
        if (!empty($it[1])) $entry['item'] = $it[1];
        $list[] = $entry;
    }
    return ['@type' => 'BreadcrumbList', 'itemListElement' => $list];
}

/** چاپ اسکریپت JSON-LD از آرایه‌ای از گراف‌ها. */
function render_json_ld($nodes) {
    if (!$nodes) return;
    $graph = ['@context' => 'https://schema.org', '@graph' => array_values($nodes)];
    echo '<script type="application/ld+json">'
       . json_encode($graph, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
       . '</script>' . "\n";
}
