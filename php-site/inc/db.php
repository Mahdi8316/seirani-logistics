<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/defaults.php';

/** اتصال PDO به‌صورت singleton. */
function db() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            die('خطای اتصال به دیتابیس. لطفاً مقادیر inc/config.php را بررسی کنید.');
        }
    }
    return $pdo;
}

/** ساخت جدول‌ها (در صورت نبود) و کاشت محتوای اولیه (فقط یک‌بار). */
function ensure_schema() {
    $pdo = db();

    $pdo->exec("CREATE TABLE IF NOT EXISTS settings (
        skey VARCHAR(64) PRIMARY KEY,
        sval LONGTEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        `no` VARCHAR(16) NOT NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        icon LONGTEXT NULL,
        sort INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        n INT NOT NULL,
        suffix VARCHAR(16) NOT NULL DEFAULT '',
        label VARCHAR(255) NOT NULL,
        sort INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS scenes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        `no` VARCHAR(16) NOT NULL,
        kicker VARCHAR(128) NOT NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        src VARCHAR(255) NOT NULL,
        sort INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(191) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        body MEDIUMTEXT NOT NULL,
        cover VARCHAR(255) NULL,
        category VARCHAR(128) NOT NULL DEFAULT '',
        published TINYINT NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL DEFAULT '',
        phone VARCHAR(64) NOT NULL DEFAULT '',
        service VARCHAR(128) NOT NULL DEFAULT '',
        description TEXT NOT NULL,
        created_at DATETIME NOT NULL,
        is_read TINYINT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(128) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    seed_if_empty($pdo);
}

function seed_if_empty($pdo) {
    $now = date('Y-m-d H:i:s');

    // ---- settings ----
    $has = $pdo->query("SELECT 1 FROM settings WHERE skey='hero' LIMIT 1")->fetchColumn();
    if (!$has) {
        $defaults = default_settings();
        $stmt = $pdo->prepare("INSERT INTO settings (skey, sval) VALUES (?, ?)");
        foreach ($defaults as $k => $v) {
            $stmt->execute([$k, json_encode($v, JSON_UNESCAPED_UNICODE)]);
        }
    }

    // ---- services ----
    if (!$pdo->query("SELECT 1 FROM services LIMIT 1")->fetchColumn()) {
        $stmt = $pdo->prepare("INSERT INTO services (`no`, title, body, icon, sort) VALUES (?,?,?,?,?)");
        $i = 0;
        foreach (default_services() as $s) {
            $stmt->execute([$s[0], $s[1], $s[2], $s[3], $i++]);
        }
    }

    // ---- stats ----
    if (!$pdo->query("SELECT 1 FROM stats LIMIT 1")->fetchColumn()) {
        $stmt = $pdo->prepare("INSERT INTO stats (n, suffix, label, sort) VALUES (?,?,?,?)");
        $i = 0;
        foreach (default_stats() as $s) {
            $stmt->execute([$s[0], $s[1], $s[2], $i++]);
        }
    }

    // ---- scenes ----
    if (!$pdo->query("SELECT 1 FROM scenes LIMIT 1")->fetchColumn()) {
        $stmt = $pdo->prepare("INSERT INTO scenes (`no`, kicker, title, body, src, sort) VALUES (?,?,?,?,?,?)");
        $i = 0;
        foreach (default_scenes() as $s) {
            $stmt->execute([$s[0], $s[1], $s[2], $s[3], $s[4], $i++]);
        }
    }

    // ---- posts ----
    if (!$pdo->query("SELECT 1 FROM posts LIMIT 1")->fetchColumn()) {
        $stmt = $pdo->prepare("INSERT INTO posts (slug, title, excerpt, body, cover, category, published, created_at, updated_at)
            VALUES (?,?,?,?,?,?,1,?,?)");
        $i = 0;
        foreach (default_posts() as $p) {
            $ts = date('Y-m-d H:i:s', time() - $i * 86400);
            $stmt->execute([$p[0], $p[1], $p[2], $p[3], $p[5], $p[4], $ts, $ts]);
            $i++;
        }
    }

    // ---- admin user ----
    if (!$pdo->query("SELECT 1 FROM users LIMIT 1")->fetchColumn()) {
        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, created_at) VALUES (?,?,?)");
        $stmt->execute([ADMIN_USERNAME, password_hash(ADMIN_PASSWORD, PASSWORD_DEFAULT), $now]);
    }
}
