var gulp = require("gulp");
var es = require('event-stream');
var clean = require("gulp-clean");
var log = require('gulp-util').log;

var files = [
];

process.chdir("../");


var toMove = [
  "lib/*.js",
  "lib/**/*",
  "lib/**/**/*"
];

gulp.task("move", function () {
  gulp.src(toMove)
    .pipe(gulp.dest(""));
});

gulp.task("remove", function () {
  gulp.src(["*.js", "source"])
    .pipe(clean())
})