var gulp = require("gulp");

var toMove = [
  "./src/*.js",
  "./src/**/*.js",
  "./src/***/*.js"
];

gulp.task("move", function () {
  gulp.src(toMove, { base: "./" })
    .pipe(gulp.dest("./"));
});