// This is based on ACE's mode/javascript_highlight_rules.js

define('karel/mode/karol_highlight_rules', function(require, exports, module) {

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var DocCommentHighlightRules = require("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var KarolHighlightRules = function() {

    var docComment = new DocCommentHighlightRules();

    var commands = lang.arrayToMap(
        _(("probiere|schritt|schrittRückwaerts|linksDrehen|rechtsDrehen|" +
        "tonErzeugen|hinlegen|aufheben|markeSetzen|markeUmschalten|markeLöschen|" +
        "quaderAufstellen|quaderEntfernen|schnell|langsam").split("|")).map(function(a) {
          return a.toLowerCase();
        })
    );

    var conditions = lang.arrayToMap(
      ("istNorden|istSüden|istWesten|istOsten|istWand|istZiegel|istMarke|").split("|").map(function(a) { return a.toLowerCase(); })
    );

    var keywords = lang.arrayToMap(
        ("solange|wenn|wiederhole|anweisung|bedingung|programm|" +
        "einfügen|karol|tue|dann|sonst|mal|immer|nicht").split("|")
    );

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "\\/\\/.*$"
            },
            docComment.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                regex : "\\{",
                next : "comment"
            }, {
                token : "constant.numeric", // int
                regex : "\\d+\\b"
            }, {
                token : "constant.language.boolean",
                regex : "(?:wahr|falsch)\\b"
            }, {
                token : function(value) {
                    value = value.toLowerCase();
                    if (keywords.hasOwnProperty(value) ||
                        value.charAt(0) === '*' && keywords.hasOwnProperty(value.slice(1)))
                        return "keyword";
                    else if (commands.hasOwnProperty(value))
                        return "support.function";
                    else if (conditions.hasOwnProperty(value) ||
                        value.slice(0,5) === 'nicht' && conditions.hasOwnProperty(value.slice(5)))
                        // This is maybe not quite correct, but it gives us another color
                        return "variable.language";
                    else
                        return "identifier";
                },
                regex : "\\*?[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "lparen",
                regex : "[[({]"
            }, {
                token : "rparen",
                regex : "[\\])}]"
            }, {
                token : "semicolon",
                regex : ";"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\}",
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                regex : ".+"
            }
        ]
    };

    this.addRules(docComment.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start";
};

oop.inherits(KarolHighlightRules, TextHighlightRules);

exports.KarolHighlightRules = KarolHighlightRules;
});
