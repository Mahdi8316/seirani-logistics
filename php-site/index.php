<?php
require_once __DIR__ . '/inc/bootstrap.php';

// جلوگیری از نسخهٔ تکراری صفحهٔ اصلی با نام فایل.
$requestPath = parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH);
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $requestPath === url('/index.php')) {
    header('Location: ' . url('/'), true, 301);
    exit;
}

// --- پردازش فرم تماس (POST → Redirect → GET) ---
$form_error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact_submit'])) {
    $name  = trim($_POST['name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $svc   = trim($_POST['service'] ?? '');
    $desc  = trim($_POST['description'] ?? '');
    if ($name !== '' && $phone !== '') {
        create_submission($name, $phone, $svc, $desc);
        header('Location: ' . url('/') . '?sent=1#contact');
        exit;
    }
    $form_error = 'نام و شماره تماس الزامی است.';
}
$sent = isset($_GET['sent']);

$hero      = get_hero();
$scenes    = get_scenes();
$svcHead   = get_services_header();
$services  = get_services();
$blogHead  = get_blog_header();
$posts     = get_published_posts(3);
$about     = get_about();
$stats     = get_stats();
$contact   = get_contact();

$nav_base = '';
$page_title = 'ترخیص گمرکی و بازرگانی بین‌الملل | ' . SITE_NAME;
$meta_desc  = $hero['lead'];
$canonical  = SITE_URL . '/';
$json_ld = [seo_org(), seo_website()];
include __DIR__ . '/inc/header.php';
?>
<main>
  <!-- ============ Hero ============ -->
  <section id="hero" class="hero" aria-label="معرفی">
    <div class="hero-pin">
      <div class="hero-media">
        <video class="hero-video" src="<?= e(url('/assets/hero.mp4')) ?>" autoplay muted loop playsinline preload="auto" aria-hidden="true"></video>
      </div>
      <div class="ov-color"></div><div class="ov-overlay"></div><div class="ov-screen"></div><div class="ov-vignette"></div><div class="ov-scrim"></div>
      <div class="hero-copy">
        <div class="hero-center">
          <div class="hero-eyebrow"><span class="hero-eyebrow-line"></span><?= e($hero['eyebrow']) ?><span class="hero-eyebrow-line"></span></div>
          <h1 class="hero-h1"><?= e($hero['titleLine1']) ?><br><span class="hero-h1-accent"><?= e($hero['titleAccent']) ?></span></h1>
          <p class="hero-lead"><?= e($hero['lead']) ?></p>
          <div class="hero-actions">
            <a href="#services" class="btn-primary"><?= e($hero['ctaPrimary']) ?></a>
            <a href="#contact" class="btn-secondary"><?= e($hero['ctaSecondary']) ?></a>
          </div>
        </div>
        <div class="hero-bottom">
          <div class="hero-stats">
            <?php foreach (($hero['stats'] ?? []) as $st): ?>
              <div class="hero-stat"><div class="hero-stat-num"><?= e($st['num']) ?></div><div class="hero-stat-label"><?= e($st['label']) ?></div></div>
            <?php endforeach; ?>
          </div>
          <div class="scroll-hint">برای شروع سفر اسکرول کنید<span class="scroll-tick"></span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ Story ============ -->
  <section id="story" aria-label="مسیر ما">
    <?php foreach ($scenes as $sc): ?>
      <div class="scene">
        <video class="scene-video" src="<?= e(url($sc['src'])) ?>" autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>
        <div class="scene-ov-side"></div><div class="scene-ov-radial"></div>
        <div class="scene-caption-wrap" data-reveal>
          <div class="scene-caption">
            <div class="scene-eyebrow"><span class="scene-no"><?= e($sc['no']) ?></span><span class="scene-line"></span><?= e($sc['kicker']) ?></div>
            <h2 class="scene-title"><?= e($sc['title']) ?></h2>
            <p class="scene-body"><?= e($sc['body']) ?></p>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </section>

  <!-- ============ Services ============ -->
  <section id="services" class="section" aria-labelledby="services-title">
    <div class="section-inner">
      <div class="section-head" data-reveal>
        <div class="eyebrow"><span class="sec-line"></span><?= e($svcHead['eyebrow']) ?></div>
        <h2 id="services-title" class="section-title"><?= e($svcHead['title']) ?></h2>
        <p class="section-lead"><?= e($svcHead['lead']) ?></p>
      </div>
      <div class="services-grid">
        <?php foreach ($services as $sv): ?>
          <article class="service-card">
            <div class="service-card-top">
              <div class="service-icon-box">
                <?php if (!empty($sv['icon'])): ?>
                  <img class="service-icon-img" src="<?= e($sv['icon']) ?>" alt="">
                <?php else: ?>
                  <span class="service-glyph"></span>
                <?php endif; ?>
              </div>
              <span class="service-index"><?= e($sv['no']) ?></span>
            </div>
            <h3 class="service-title"><?= e($sv['title']) ?></h3>
            <p class="service-body"><?= e($sv['body']) ?></p>
          </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- ============ Blog ============ -->
  <section id="blog" class="section section--alt" aria-labelledby="blog-title">
    <div class="section-inner">
      <div class="blog-head" data-reveal>
        <div class="blog-head-text">
          <div class="eyebrow"><span class="sec-line"></span><?= e($blogHead['eyebrow']) ?></div>
          <h2 id="blog-title" class="section-title"><?= e($blogHead['title']) ?></h2>
          <p class="section-lead"><?= e($blogHead['lead']) ?></p>
        </div>
        <a href="<?= e(blog_url()) ?>" class="blog-all">همه مقالات <span aria-hidden="true">←</span></a>
      </div>
      <?php if (!$posts): ?>
        <p class="blog-empty">هنوز مقاله‌ای منتشر نشده است.</p>
      <?php else: ?>
        <div class="blog-grid">
          <?php foreach ($posts as $p): ?>
            <a href="<?= e(post_url($p)) ?>" class="blog-card">
              <div class="blog-cover">
                <?php if (!empty($p['cover'])): ?>
                  <img src="<?= e(url($p['cover'])) ?>" alt="تصویر مقاله <?= e($p['title']) ?>" width="1680" height="945" loading="lazy" decoding="async">
                <?php else: ?><span class="blog-cover-mark"></span><?php endif; ?>
              </div>
              <div class="blog-card-body">
                <div class="blog-meta"><span class="blog-cat"><?= e($p['category']) ?></span><span class="blog-date"><?= e(fa_date($p['created_at'])) ?></span></div>
                <h3 class="blog-card-title"><?= e($p['title']) ?></h3>
                <p class="blog-excerpt"><?= e($p['excerpt']) ?></p>
                <span class="blog-readmore">ادامه مطلب ←</span>
              </div>
            </a>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    </div>
  </section>

  <!-- ============ About ============ -->
  <section id="about" class="section" aria-labelledby="about-title">
    <div class="about-wrap">
      <div class="about-intro" data-reveal>
        <div class="eyebrow"><span class="sec-line"></span><?= e($about['eyebrow']) ?></div>
        <h2 id="about-title" class="section-title"><?= e($about['title']) ?></h2>
        <p class="about-lead"><?= e($about['lead']) ?></p>
        <a href="#contact" class="about-cta"><?= e($about['ctaText']) ?></a>
      </div>
      <div class="stats-grid">
        <?php foreach ($stats as $st): ?>
          <div class="stat-cell">
            <div class="stat-num" data-count="<?= e($st['n']) ?>" data-suffix="<?= e($st['suffix']) ?>"><?= e(fa_number($st['n']) . $st['suffix']) ?></div>
            <div class="stat-label"><?= e($st['label']) ?></div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- ============ Contact + Footer (پنل پایانی) ============ -->
  <div id="contact" class="contact-panel">
    <section class="contact" aria-labelledby="contact-title">
      <div class="contact-wrap">
        <div class="contact-info" data-reveal>
          <div class="eyebrow"><span class="sec-line"></span><?= e($contact['eyebrow']) ?></div>
          <h2 id="contact-title" class="contact-title"><?= nl2br(e($contact['title'])) ?></h2>
          <p class="contact-lead"><?= e($contact['lead']) ?></p>
          <div class="contact-rows">
            <div class="contact-row"><span class="contact-dot"></span><?= e($contact['address']) ?></div>
            <a class="contact-row" dir="ltr" href="tel:<?= e($contact['phoneHref']) ?>"><span class="contact-dot"></span><?= e($contact['phoneDisplay']) ?></a>
            <a class="contact-row" dir="ltr" href="mailto:<?= e($contact['email']) ?>"><span class="contact-dot"></span><?= e($contact['email']) ?></a>
          </div>
        </div>

        <form class="contact-form" method="post" action="<?= e(url('/')) ?>#contact" data-reveal>
          <input type="hidden" name="contact_submit" value="1">
          <div class="field">
            <label class="label" for="c-name">نام و نام خانوادگی</label>
            <input id="c-name" name="name" type="text" placeholder="نام شما" class="input" required>
          </div>
          <div class="two-col">
            <div class="field">
              <label class="label" for="c-phone">تلفن همراه</label>
              <input id="c-phone" name="phone" type="tel" dir="ltr" placeholder="0912 000 0000" class="input" required>
            </div>
            <div class="field">
              <label class="label" for="c-service">نوع خدمت</label>
              <select id="c-service" name="service" class="input">
                <option>ترخیص گمرکی</option><option>ترانزیت زمینی</option><option>بازرگانی بین‌الملل</option><option>سایر</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label" for="c-desc">توضیح محموله</label>
            <textarea id="c-desc" name="description" rows="4" placeholder="نوع کالا، مبدأ و مقصد …" class="textarea"></textarea>
          </div>
          <button type="submit" class="submit">ارسال درخواست</button>
          <?php if ($sent): ?>
            <p class="form-ok" role="status">درخواست شما ثبت شد ✓ کارشناسان ما به‌زودی تماس می‌گیرند.</p>
          <?php elseif ($form_error): ?>
            <p class="form-error" role="status"><?= e($form_error) ?></p>
          <?php endif; ?>
        </form>
      </div>
    </section>
    <?php include __DIR__ . '/inc/footer.php'; ?>
  </div>
</main>
<?php include __DIR__ . '/inc/foot.php'; ?>
