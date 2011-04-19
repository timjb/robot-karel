// This is based on ACE's mode/javascript.js


define('karel/mode/karol', function(require, exports, module) {

var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var KarolHighlightRules = require("karel/mode/karol_highlight_rules").KarolHighlightRules;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new KarolHighlightRules().getRules());
};
oop.inherits(Mode, TextMode);

exports.Mode = Mode;
});
