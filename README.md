# gulp-base64ify

`npm i --save-dev gulp-base64ify`

## Usage
```
var base64ify  = require('gulp-base64ify');

gulp.src('images/*.png')
        .pipe(base64ify({
            injectSizes: false, // defaults to true
            filename: 'base64-icons.less', // .css .less. .scss -  whatever
            namePrefix: 'icon', // .icon.icon-filename {width:'', height:'' background-image: ''}
        }))
        .pipe(gulp.dest('./stylesheets/')) // puts base64-icons.less in there
```
