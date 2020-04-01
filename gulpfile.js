//Подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const imagemin = require('gulp-imagemin')
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const gcmq = require('gulp-group-css-media-queries');


const cssFiles = [  //Порядок подключения файлов CSS
    // './src/css/style.css',    //Выбрать все файлы './src/css/**/*.css'
		// './src/css/media.css'
		
    // './src/precss/style.less',
    // './src/precss/media.less'
    
    './src/precss/**/*.less'
    
    
]

const jsFiles = [
    // './src/js/main.js',
		// './src/js/lib.js'
		
		'./src/js/**/*.js'
]

//Таск на стилей CSS
function styles() {
    return gulp.src(cssFiles) //Шаблон для поиска файлов CSS. 
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(gcmq())
        .pipe(concat('all.css'))  //Обьединение файлов в один    
        .pipe(autoprefixer({  //Автопрефиксер
					overrideBrowserslist:  ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
            cascade: false
        }))
        .pipe(cleanCSS({  //Сжатия файла
           level: 2
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/css')) //Выходная папка для стилей
        .pipe(browserSync.stream()); //Обновить файлы
}

//Таск на скрипты
function scripts() {
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(uglify({  //Сжатие JS файла
            toplevel: true
        }))  
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

//Удалить все в указанной папке
function clean() {
    return del(['build/*'])
}

//Сжатие изображений
function imgCompress() {
	return gulp.src('./src/img/**')
	.pipe(imagemin({
    progressive: true,
	}))
	.pipe(gulp.dest('./build/img'))
}

//Прослеживать файлы
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        } //,
        //tunnel: true
    });
    
    //Следить за CSS файлами
  	// gulp.watch('./src/css/**/*.css', styles);
    //Следить за LESS файлами
    gulp.watch('./src/precss/**/*.less', styles);
    //Следить за JS файлами
    gulp.watch('./src/js/**/*.js', scripts);
    //При изменении HTML запустить сихранзацию
    gulp.watch("./*.html").on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);  //Таск для очистки папки build
gulp.task('del', clean);  //Для отслежевания изменений
gulp.task('watch', watch);
//Таск для удаления файлов из build и запуска scrits, styles и сжатия изображений
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
gulp.task('image-compres', gulp.series(clean, gulp.parallel(styles, scripts, imgCompress)));
gulp.task('dev', gulp.series('build', 'watch'));
gulp.task('dev-image', gulp.series('image-compres', 'watch'));

// watch - зупускает отслеживание в изменениях
// build - удаляет файлы в паке build и заменяет их на новые,  и styles scripts
// dev - запускает watch и build 
// image-compres - запускает build и сжатие картинок
// dev-image - запускает watch и image-compres

