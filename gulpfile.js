const {src, dest, watch, series, parallel} = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemaps = require(`gulp-sourcemaps`);
const sass = require(`gulp-sass`);
const autoprefixer = require(`gulp-autoprefixer`);
const cleanCSS = require(`gulp-clean-css`);
const rename = require(`gulp-rename`);
const posthtml = require(`gulp-posthtml`);
const include = require(`posthtml-include`);
const htmlmin = require(`gulp-htmlmin`);
const babel = require(`gulp-babel`);
const uglify = require(`gulp-uglify`);
const pipeline = require(`readable-stream`).pipeline;
const modernizr = require(`gulp-modernizr`);
const imagemin = require(`gulp-imagemin`);
const imageminPngquant = require(`imagemin-pngquant`);
const imageminMozjpeg = require(`imagemin-mozjpeg`);
const webp = require(`gulp-webp`);
const svgstore = require(`gulp-svgstore`);
const path = require(`path`);
const del = require(`del`);
const browserSync = require(`browser-sync`).create();

// Компиляция файлов *.css из *.scss с автопрефиксером и минификацией
function css() {
  return src(`source/scss/style.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: require(`scss-resets`).includePaths
    }).on(`error`, sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`build/css`))
    .pipe(browserSync.stream());
}
exports.css = css;

// Минификация файлов *.html
function html() {
  return src(`source/*.html`)
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true
    }))
    .pipe(dest(`build`));
}
exports.html = html;

// Минификация файлов скриптов *.js
function js() {
  return src(`source/js/*.js`)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [`@babel/env`]
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`build/js`));
}
exports.js = js;

// Копирование файлов библиотек *.css
function csslibs() {
  return src([
    `node_modules/fullpage.js/dist/fullpage.min.{css,css.map}`,
    `node_modules/swiper/css/swiper.min.{css,css.map}`
  ])
    .pipe(dest(`build/css`));
}
exports.csslibs = csslibs;

// Копирование файлов библиотек *.js
function jslibs() {
  return src([
    `node_modules/fullpage.js/dist/fullpage.min.{js,js.map}`,
    `node_modules/fullpage.js/vendors/scrolloverflow.min.{js,js.map}`,
    `node_modules/swiper/js/swiper.min.{js,js.map}`,
    `node_modules/scrollbooster/dist/scrollbooster.min.{js,js.map}`
  ])
    .pipe(dest(`build/js`));
}
exports.jslibs = jslibs;

// Генерация файла библиотеки Modernizr
function modzr() {
  return src(`fake`, {
    allowEmpty: true
  })
    .pipe(modernizr({
      options: [`setClasses`],
      crawl: false,
      tests: [`webp`]
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`build/js`));
}
exports.modzr = modzr;

// Сжатие файлов изображений
exports.img = () => {
  return src([
    `source/img/*.{png,jpg,svg}`,
    `!source/img/icon-*.svg`
  ])
    .pipe(imagemin([
      imageminPngquant({
        speed: 1,
        strip: true,
        quality: [0.7, 0.9]
      }),
      imageminMozjpeg({
        quality: 75
      }),
      imagemin.svgo()
    ]))
    .pipe(dest(`build/img`));
};

// Генерация файлов изображений в формате *.webp
exports.webp = () => {
  return src(`source/img/*.{png,jpg}`)
    .pipe(webp({
      quality: 75,
      alphaQuality: 75,
      method: 6
    }))
    .pipe(dest(`build/img`));
};

// Сборка SVG-спрайта
function sprite() {
  return src(`source/img/icon-*.svg`)
    .pipe(imagemin([
      imagemin.svgo((file) => {
        let prefix = path.basename(file.relative, path.extname(file.relative));
        return {
          plugins: [{
            cleanupIDs: {
              prefix: prefix + `-`,
              minify: true
            }
          }]
        };
      })
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename(`sprite.svg`))
    .pipe(dest(`build/img`));
}
exports.sprite = sprite;

// Удаление файлов в папке build перед копированием
function clean() {
  return del(`build`);
}
exports.clean = clean;

// Копирование файлов в папку build
function copy() {
  return src([
    `source/fonts/**/*.{woff,woff2}`,
    `source/img/**`,
    `!source/img/icon-*.svg`,
    `source/*.ico`
  ], {
    base: `source`
  })
    .pipe(dest(`build`));
}
exports.copy = copy;

// Запуск сервера Browsersync
function server() {
  browserSync.init({
    server: `build/`,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  watch(`source/scss/**/*.{scss,sass}`, css);
  watch(`source/img/icon-*.svg`, series(sprite, html, refresh));
  watch(`source/*.html`, series(html, refresh));
}
exports.server = server;

// Автообновление страницы
function refresh(done) {
  browserSync.reload();
  done();
}
exports.refresh = refresh;

// Создание сборки проекта
exports.build = series(
  clean,
  parallel(
    copy,
    css,
    js,
    csslibs,
    jslibs,
    modzr,
    series(sprite, html)
  )
);

// Создание сборки проекта и запуск сервера Browsersync
exports.start = series(
  clean,
  parallel(
    copy,
    css,
    js,
    csslibs,
    jslibs,
    modzr,
    series(sprite, html)
  ),
  server
);
