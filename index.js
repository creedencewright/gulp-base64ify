var through2       = require('through2');
var sizeOf         = require('image-size');
var gutil          = require('gulp-util');
var mime           = require("mime");
var path           = require('path');
var fs             = require('fs');
var handlebars     = require('handlebars');

var templateSource = fs.readFileSync(__dirname + '/base64ify-template.handlebars', 'utf8');

var handler = function(opts) {
    var styleStream  = through2.obj();
    opts.injectSizes = opts.injectSizes === undefined ? true : opts.injectSizes;

    var images = [];

    var onData = function(file, encoding, cb) {
        images.push(file);
        cb(null);
    };

    var getFileData = function(img) {
        var name = path.parse(img.path).name;

        return {
            size: sizeOf(img.contents),
            name: name,
            mime: mime.lookup(img.path),
            content: img.contents.toString('base64')
        };
    }

    var onEnd = function(cb) {
        if (images.length === 0) {
            styleStream.push(null);
            return cb();
        }

        var template = handlebars.compile(templateSource);

        var templateData = {
            images: images.map(getFileData),
            prefix: opts.namePrefix,
            injectSizes: opts.injectSizes
        };

        var cssStr = template(templateData);

        var cssFile = new gutil.File({
            path: './' + opts.filename,
            contents: new Buffer(cssStr)
        });

        styleStream.push(cssFile);

        this.push(cssFile);
        cb();
    }

    var retStream = through2.obj(onData, onEnd);

    return retStream;
}

module.exports = handler;