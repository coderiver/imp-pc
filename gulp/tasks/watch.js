var gulp   = require('gulp');
var config = require('../config');

gulp.task('watch', [
    'nunjucks:watch',
    'iconfont:watch',
    'svgo:watch',
    'sass:watch'
]);
