// gulpfile.js

import gulp from 'gulp';
import terser from 'gulp-terser';
import cleanCSS from 'gulp-clean-css';
import phpMinify from '@cedx/gulp-php-minify';
import concat from 'gulp-concat';
import { deleteAsync } from 'del';
import merge from 'merge-stream';
import fs from 'fs';

const paths = {
  record: {
    js: [
      "./scripts/EasyEvents.js",
      "./scripts/EasyCompress.js",
      "./scripts/EasyRecorder.js"
    ],
    css: [
      // Add your CSS files here
    ],
    php: [
      // Add your PHP files here
    ],
    dist: "./dist/EasyHeatmap-record"
  },
};

// Define your desired mappings
const nameCache = {
  vars: {
    props: {}
  },
  props: {
    props: {}
  }
};

// Predefine mappings: Original name => Mangled name
const predefinedMappings = {
  // Map class names to specific letters
  'EasyRecorder': 'ehmA',
  'EasyCompress': 'ehmB',
  'EasyEvent': 'ehmC'
};

// Add mappings to nameCache
for (const [originalName, mangledName] of Object.entries(predefinedMappings)) {
  // For class names, they are stored in vars.props with a '$' prefix
  nameCache.vars.props['$' + originalName] = mangledName;
}

async function clean() {
  await deleteAsync(['./dist']);
}

function compile() {
  const tasks = [];

  for (const key of Object.keys(paths)) {
    const pkg = paths[key];

    // JavaScript processing
    if (pkg.js && pkg.js.length > 0) {
      const jsTask = gulp.src(pkg.js)
        .pipe(concat('bundle.js'))
        .pipe(terser({
          mangle: {
            toplevel: true,
            keep_classnames: false,
            keep_fnames: false,
          },
          compress: {
            passes: 2,
            keep_classnames: false,
            keep_fnames: false,
          },
          output: {
            comments: false,
          },
          nameCache: nameCache,
        }))
        .pipe(gulp.dest(`${pkg.dist}/js`));
      tasks.push(jsTask);
    }

    // CSS processing
    if (pkg.css && pkg.css.length > 0) {
      const cssTask = gulp.src(pkg.css)
        .pipe(concat('bundle.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${pkg.dist}/css`));
      tasks.push(cssTask);
    }

    // PHP processing
    if (pkg.php && pkg.php.length > 0) {
      const phpTask = gulp.src(pkg.php)
        .pipe(phpMinify())
        .pipe(gulp.dest(`${pkg.dist}/php`));
      tasks.push(phpTask);
    }
  }

  // Return a merged stream of all tasks
  return merge(...tasks);
}

export { clean, compile };
export default gulp.series(clean, compile);
