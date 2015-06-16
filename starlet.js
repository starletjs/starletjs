var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var UglifyJS = require("uglify-js");
var mustache = require("mustache");

var netscapeBookmarkFileTemplate = fs.readFileSync('./bookmark.html.mustache').toString();
//var prettyWebPageFileTemplate = fs.readFileSync('./pretty_bookmark.html.mustache').toString();

function BookmarkletPresenter(filename, fileContents){
  var makeTiny = function(someCode){
    var wrapped = '(function(){' + someCode + '})();';
    var modifiedCode = UglifyJS.minify(wrapped, { fromString: true }).code;
    modifiedCode = encodeURIComponent(modifiedCode);
    return 'javascript:' + modifiedCode; // jshint ignore:line
  };
  var prettyName = function(filename){
    return path.basename(filename, '.js');
  };

  this.name = prettyName(filename);
  this.uglifiedCode = makeTiny(fileContents);
}

function main() {
  var filenames = process.argv.slice(2);

  if (filenames.length > 0) {
    var bookmarkletPresenterCollection = _.map(filenames, function (filename) {
      var fileContents = fs.readFileSync(filename).toString();

      return new BookmarkletPresenter(filename, fileContents);
    });

    //var output = mustache.render(prettyWebPageFileTemplate, { bookmarklets: bookmarkletPresenterCollection });
    var output = mustache.render(netscapeBookmarkFileTemplate, { bookmarklets: bookmarkletPresenterCollection });

    console.log(output);
  } else {
    console.log("no file input");
  }
}

main();
