<?php
// این فایل را با نام config.php کپی کنید و فقط روی محیط مقصد مقداردهی کنید.
// config.php در .gitignore است و نباید وارد Git یا GitHub شود.

define('DB_HOST', 'localhost');
define('DB_NAME', 'CPANELUSER_database');
define('DB_USER', 'CPANELUSER_dbuser');
define('DB_PASS', 'CHANGE_ME_DATABASE_PASSWORD');

// فقط برای ساخت نخستین کاربر در دیتابیس خالی استفاده می‌شود.
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'CHANGE_ME_ADMIN_PASSWORD');

define('SITE_URL', 'https://your-domain.example');
define('SITE_NAME', 'سیرانی');
define('SITE_TAGLINE', 'ترخیص گمرکی و بازرگانی بین‌الملل');
define('BASE_PATH', '');
