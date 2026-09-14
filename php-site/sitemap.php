<?php
require_once __DIR__ . '/inc/bootstrap.php';
$requestPath = parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH);
if ($requestPath === url('/sitemap.php')) {
    header('Location: ' . url('/sitemap.xml'), true, 301);
    exit;
}
header('Content-Type: application/xml; charset=utf-8');
$posts = get_published_posts();
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";
$u = function ($path) { return e(SITE_URL . url($path)); };
echo '  <url><loc>' . e(SITE_URL . url('/')) . '</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>' . "\n";
echo '  <url><loc>' . e(SITE_URL . blog_url()) . '</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>' . "\n";
foreach ($posts as $p) {
    echo '  <url><loc>' . e(SITE_URL . post_url($p))
       . '</loc><lastmod>' . e(date('Y-m-d', strtotime($p['updated_at'])))
       . '</lastmod><changefreq>monthly</changefreq><priority>0.6</priority>';
    if (!empty($p['cover'])) {
        echo '<image:image><image:loc>' . e(abs_url($p['cover'])) . '</image:loc>'
           . '<image:title>' . e($p['title']) . '</image:title></image:image>';
    }
    echo '</url>' . "\n";
}
echo '</urlset>' . "\n";
