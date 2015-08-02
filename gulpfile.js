var gulp    = require('gulp')
var connect = require('gulp-connect')
var elm     = require('gulp-elm')
var watch   = require('gulp-watch')

var del         = require('del')
var runSequence = require('run-sequence')

gulp.task('clean', function(callback) {
    del(['public'], callback)
})

gulp.task('html', function() {
    gulp.src('src/html/index.html')
        .pipe(gulp.dest('public'))
        .pipe(connect.reload())
})

gulp.task('elm', function() {
    gulp.src('src/elm/app.elm')
        .pipe(elm())
        .pipe(gulp.dest('public'))
        .pipe(connect.reload())
})

gulp.task('connect', function() {
    connect.server({
        root: 'public',
        livereload: true
    })
})

gulp.task('watch', function() {
    gulp.watch('src/elm/app.elm', ['elm'])
    gulp.watch('src/html/index.html', ['html'])
})

gulp.task('build', function() {
    runSequence('clean', ['html', 'elm'])
})

gulp.task('dev', ['build', 'watch', 'connect'])
