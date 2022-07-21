const {src, dest, series, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const include = require('gulp-file-include');
// const htmlmin = require('gulp-htmlmin');
var imagemin = require("gulp-webp");
// var svgstore = require("gulp-svgstore");
const del = require('del');
const sync = require('browser-sync').create();


function html () {
    return src('src/**.html')
    .pipe(include({
        prefix: '@@'
    }))
    .pipe(dest('dist'))
}

function scss () {
    return src('src/scss/**.scss')
    .pipe(sass())
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist'))
}

function clear () {
    return del('dist')
}

function serve () {
    sync.init({
        server: './dist'
    })
    watch('./src/**.html', series(html)).on('change', sync.reload)
    watch('./src/scss/**.scss', series(scss)).on('change', sync.reload)
}
/* Минифицирует изображения*/
gulp.task("images", function() {
    return gulp.src("./src/image/**/*.{png,jpg,svg}")
      .pipe(imagemin([    /* imagemin сам по себе содержит в себе множество плагинов (работа с png,svg,jpg и тд) */
        imagemin.optipng({optimizationLevel: 3}),  /* 1 - максимальное сжатие, 3 - безопасное сжатие, 10 - без сжатия */
        imagemin.jpegtran({progressive: true}),    /* прогрессивная загрузка jpg (сначала пиксельная, позже проявляется) */
        imagemin.svgo()   /*Минификация svg от лишних тегов*/
        ]))
      .pipe(gulp.dest("dist/img"));
  });
/* Сборка спрайта */
// gulp.task("sprite", function() {
//     return gulp.src("./build/img/inline-icons/*.svg")
//       .pipe(svgstore({    /* Делает спрайт из SVG-файлов */
//         inLineSvg: true
//       }))
//        .pipe(imagemin([
//         imagemin.svgo()
//         ]))
//       .pipe(rename("sprite.svg"))
//       .pipe(gulp.dest("./build/img"))
//       .pipe(server.stream());
//   });
exports.build = series(clear, scss, html)
exports.serve = series(clear, scss, html, serve)
exports.clear = clear;