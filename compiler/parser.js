/* Jison generated parser */
var karol = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"block":4,"statement":5,"optSemicolon":6,"identifier":7,"IDENTIFIER":8,"while":9,"import":10,"whileTrue":11,"doWhile":12,"for":13,"if":14,"functionDefinition":15,"functionInvocation":16,"conditionDefinition":17,"program":18,"bool":19,"EINFUEGEN":20,"STAR":21,"number":22,"NUMBER":23,"optNumber":24,"WAHR":25,"FALSCH":26,"SEMICOLON":27,"optKarolPrefix":28,"KAROL":29,"DOT":30,"optArgumentList":31,"ANWEISUNG":32,"BEDINGUNG":33,"condition":34,"NICHT":35,"PROGRAMM":36,"argumentList":37,"LPAREN":38,"RPAREN":39,"WENN":40,"DANN":41,"SONST":42,"WIEDERHOLE":43,"MAL":44,"SOLANGE":45,"TUE":46,"IMMER":47,"$accept":0,"$end":1},
terminals_: {2:"error",8:"IDENTIFIER",20:"EINFUEGEN",21:"STAR",23:"NUMBER",25:"WAHR",26:"FALSCH",27:"SEMICOLON",29:"KAROL",30:"DOT",32:"ANWEISUNG",33:"BEDINGUNG",35:"NICHT",36:"PROGRAMM",38:"LPAREN",39:"RPAREN",40:"WENN",41:"DANN",42:"SONST",43:"WIEDERHOLE",44:"MAL",45:"SOLANGE",46:"TUE",47:"IMMER"},
productions_: [0,[3,1],[4,2],[4,3],[7,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[10,4],[22,1],[24,0],[24,1],[19,1],[19,1],[6,0],[6,1],[28,0],[28,2],[16,3],[15,6],[17,5],[34,1],[34,2],[18,4],[37,3],[31,0],[31,1],[14,8],[14,6],[13,6],[9,6],[9,6],[11,5],[12,6]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return this.$ = $$[$0].dontIndent(); 
break;
case 2: this.$ = (new yy.Block()).addStatement($$[$0-1]); 
break;
case 3: this.$ = $$[$0-2].addStatement($$[$0-1]); 
break;
case 4: this.$ = new yy.Identifier($$[$0]); 
break;
case 16: this.$ = new yy.Import($$[$0-2]); 
break;
case 17: this.$ = parseInt($$[$0], 10); 
break;
case 20: this.$ = new yy.Bool(true); 
break;
case 21: this.$ = new yy.Bool(false); 
break;
case 26: this.$ = new yy.FunctionInvocation($$[$0-1], $$[$0]); 
break;
case 27: this.$ = new yy.FunctionDefinition($$[$0-4], $$[$0-2]); 
break;
case 28: this.$ = new yy.ConditionDefinition($$[$0-3], $$[$0-2]); 
break;
case 29: this.$ = $$[$0].setInline(); 
break;
case 30: this.$ = new yy.Inversion($$[$0].setInline()); 
break;
case 31: this.$ = $$[$0-2].dontIndent(); 
break;
case 32: this.$ = new yy.ArgumentList($$[$0-1]); 
break;
case 33: this.$ = new yy.ArgumentList(); 
break;
case 35: this.$ = new yy.If($$[$0-6], $$[$0-4], $$[$0-2]); 
break;
case 36: this.$ = new yy.If($$[$0-4], $$[$0-2], null); 
break;
case 37: this.$ = new yy.For($$[$0-4], $$[$0-2]); 
break;
case 38: this.$ = new yy.While($$[$0-3], $$[$0-2]); 
break;
case 39: this.$ = new yy.While($$[$0-4], $$[$0-2]); 
break;
case 40: this.$ = new yy.WhileTrue($$[$0-2]); 
break;
case 41: this.$ = new yy.DoWhile($$[$0], $$[$0-4]); 
break;
}
},
table: [{3:1,4:2,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{1:[3]},{1:[2,1],5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{1:[2,22],6:27,8:[2,22],20:[2,22],21:[2,22],25:[2,22],26:[2,22],27:[1,28],29:[2,22],32:[2,22],33:[2,22],36:[2,22],40:[2,22],42:[2,22],43:[2,22],45:[2,22]},{1:[2,5],8:[2,5],20:[2,5],21:[2,5],25:[2,5],26:[2,5],27:[2,5],29:[2,5],32:[2,5],33:[2,5],36:[2,5],40:[2,5],42:[2,5],43:[2,5],45:[2,5]},{1:[2,6],8:[2,6],20:[2,6],21:[2,6],25:[2,6],26:[2,6],27:[2,6],29:[2,6],32:[2,6],33:[2,6],36:[2,6],40:[2,6],42:[2,6],43:[2,6],45:[2,6]},{1:[2,7],8:[2,7],20:[2,7],21:[2,7],25:[2,7],26:[2,7],27:[2,7],29:[2,7],32:[2,7],33:[2,7],36:[2,7],40:[2,7],42:[2,7],43:[2,7],45:[2,7]},{1:[2,8],8:[2,8],20:[2,8],21:[2,8],25:[2,8],26:[2,8],27:[2,8],29:[2,8],32:[2,8],33:[2,8],36:[2,8],40:[2,8],42:[2,8],43:[2,8],45:[2,8]},{1:[2,9],8:[2,9],20:[2,9],21:[2,9],25:[2,9],26:[2,9],27:[2,9],29:[2,9],32:[2,9],33:[2,9],36:[2,9],40:[2,9],42:[2,9],43:[2,9],45:[2,9]},{1:[2,10],8:[2,10],20:[2,10],21:[2,10],25:[2,10],26:[2,10],27:[2,10],29:[2,10],32:[2,10],33:[2,10],36:[2,10],40:[2,10],42:[2,10],43:[2,10],45:[2,10]},{1:[2,11],8:[2,11],20:[2,11],21:[2,11],25:[2,11],26:[2,11],27:[2,11],29:[2,11],32:[2,11],33:[2,11],36:[2,11],40:[2,11],42:[2,11],43:[2,11],45:[2,11]},{1:[2,12],8:[2,12],20:[2,12],21:[2,12],25:[2,12],26:[2,12],27:[2,12],29:[2,12],32:[2,12],33:[2,12],36:[2,12],40:[2,12],42:[2,12],43:[2,12],45:[2,12]},{1:[2,13],8:[2,13],20:[2,13],21:[2,13],25:[2,13],26:[2,13],27:[2,13],29:[2,13],32:[2,13],33:[2,13],36:[2,13],40:[2,13],42:[2,13],43:[2,13],45:[2,13]},{1:[2,14],8:[2,14],20:[2,14],21:[2,14],25:[2,14],26:[2,14],27:[2,14],29:[2,14],32:[2,14],33:[2,14],36:[2,14],40:[2,14],42:[2,14],43:[2,14],45:[2,14]},{1:[2,15],8:[2,15],20:[2,15],21:[2,15],25:[2,15],26:[2,15],27:[2,15],29:[2,15],32:[2,15],33:[2,15],36:[2,15],40:[2,15],42:[2,15],43:[2,15],45:[2,15]},{4:31,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],22:32,23:[1,33],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,29],47:[1,30]},{8:[2,24],16:35,28:20,29:[1,25],34:34,35:[1,36]},{7:37,8:[1,38]},{8:[2,24],16:35,28:20,29:[1,25],34:39,35:[1,36]},{7:40,8:[1,38]},{7:41,8:[1,38]},{7:42,8:[1,38]},{4:43,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{1:[2,20],8:[2,20],20:[2,20],21:[2,20],25:[2,20],26:[2,20],27:[2,20],29:[2,20],32:[2,20],33:[2,20],36:[2,20],40:[2,20],42:[2,20],43:[2,20],45:[2,20]},{1:[2,21],8:[2,21],20:[2,21],21:[2,21],25:[2,21],26:[2,21],27:[2,21],29:[2,21],32:[2,21],33:[2,21],36:[2,21],40:[2,21],42:[2,21],43:[2,21],45:[2,21]},{30:[1,44]},{1:[2,22],6:45,8:[2,22],20:[2,22],21:[2,22],25:[2,22],26:[2,22],27:[1,28],29:[2,22],32:[2,22],33:[2,22],36:[2,22],40:[2,22],42:[2,22],43:[2,22],45:[2,22]},{1:[2,2],8:[2,2],20:[2,2],21:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],33:[2,2],36:[2,2],40:[2,2],42:[2,2],43:[2,2],45:[2,2]},{1:[2,23],8:[2,23],20:[2,23],21:[2,23],25:[2,23],26:[2,23],29:[2,23],32:[2,23],33:[2,23],36:[2,23],40:[2,23],42:[2,23],43:[2,23],45:[2,23]},{8:[2,24],16:35,28:20,29:[1,25],34:46,35:[1,36]},{4:47,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],21:[1,48],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{44:[1,49]},{39:[2,17],44:[2,17]},{46:[1,50]},{1:[2,29],8:[2,29],20:[2,29],21:[2,29],25:[2,29],26:[2,29],27:[2,29],29:[2,29],32:[2,29],33:[2,29],36:[2,29],40:[2,29],41:[2,29],42:[2,29],43:[2,29],45:[2,29],46:[2,29]},{8:[2,24],16:51,28:20,29:[1,25]},{21:[1,52]},{1:[2,4],8:[2,4],20:[2,4],21:[2,4],25:[2,4],26:[2,4],27:[2,4],29:[2,4],32:[2,4],33:[2,4],36:[2,4],38:[2,4],40:[2,4],41:[2,4],42:[2,4],43:[2,4],45:[2,4],46:[2,4]},{41:[1,53]},{6:54,8:[2,22],20:[2,22],25:[2,22],26:[2,22],27:[1,28],29:[2,22],32:[2,22],33:[2,22],36:[2,22],40:[2,22],43:[2,22],45:[2,22]},{1:[2,33],8:[2,33],20:[2,33],21:[2,33],25:[2,33],26:[2,33],27:[2,33],29:[2,33],31:55,32:[2,33],33:[2,33],36:[2,33],37:56,38:[1,57],40:[2,33],41:[2,33],42:[2,33],43:[2,33],45:[2,33],46:[2,33]},{4:58,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],21:[1,59],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{8:[2,25]},{1:[2,3],8:[2,3],20:[2,3],21:[2,3],25:[2,3],26:[2,3],29:[2,3],32:[2,3],33:[2,3],36:[2,3],40:[2,3],42:[2,3],43:[2,3],45:[2,3]},{4:60,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16],46:[1,50]},{5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],21:[1,61],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{43:[1,62]},{4:63,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{4:64,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{1:[2,30],8:[2,30],20:[2,30],21:[2,30],25:[2,30],26:[2,30],27:[2,30],29:[2,30],32:[2,30],33:[2,30],36:[2,30],40:[2,30],41:[2,30],42:[2,30],43:[2,30],45:[2,30],46:[2,30]},{20:[1,65]},{4:66,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{4:67,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{1:[2,26],8:[2,26],20:[2,26],21:[2,26],25:[2,26],26:[2,26],27:[2,26],29:[2,26],32:[2,26],33:[2,26],36:[2,26],40:[2,26],41:[2,26],42:[2,26],43:[2,26],45:[2,26],46:[2,26]},{1:[2,34],8:[2,34],20:[2,34],21:[2,34],25:[2,34],26:[2,34],27:[2,34],29:[2,34],32:[2,34],33:[2,34],36:[2,34],40:[2,34],41:[2,34],42:[2,34],43:[2,34],45:[2,34],46:[2,34]},{22:69,23:[1,33],24:68,39:[2,18]},{5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],21:[1,70],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{36:[1,71]},{5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],21:[1,72],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{43:[1,73]},{45:[1,74]},{5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],21:[1,75],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],21:[1,76],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{1:[2,16],8:[2,16],20:[2,16],21:[2,16],25:[2,16],26:[2,16],27:[2,16],29:[2,16],32:[2,16],33:[2,16],36:[2,16],40:[2,16],42:[2,16],43:[2,16],45:[2,16]},{5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],21:[1,78],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],42:[1,77],43:[1,15],45:[1,16]},{5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],21:[1,79],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{39:[1,80]},{39:[2,19]},{33:[1,81]},{1:[2,31],8:[2,31],20:[2,31],21:[2,31],25:[2,31],26:[2,31],27:[2,31],29:[2,31],32:[2,31],33:[2,31],36:[2,31],40:[2,31],42:[2,31],43:[2,31],45:[2,31]},{43:[1,82]},{1:[2,40],8:[2,40],20:[2,40],21:[2,40],25:[2,40],26:[2,40],27:[2,40],29:[2,40],32:[2,40],33:[2,40],36:[2,40],40:[2,40],42:[2,40],43:[2,40],45:[2,40]},{8:[2,24],16:35,28:20,29:[1,25],34:83,35:[1,36]},{43:[1,84]},{45:[1,85]},{4:86,5:3,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{40:[1,87]},{32:[1,88]},{1:[2,32],8:[2,32],20:[2,32],21:[2,32],25:[2,32],26:[2,32],27:[2,32],29:[2,32],32:[2,32],33:[2,32],36:[2,32],40:[2,32],41:[2,32],42:[2,32],43:[2,32],45:[2,32],46:[2,32]},{1:[2,28],8:[2,28],20:[2,28],21:[2,28],25:[2,28],26:[2,28],27:[2,28],29:[2,28],32:[2,28],33:[2,28],36:[2,28],40:[2,28],42:[2,28],43:[2,28],45:[2,28]},{1:[2,38],8:[2,38],20:[2,38],21:[2,38],25:[2,38],26:[2,38],27:[2,38],29:[2,38],32:[2,38],33:[2,38],36:[2,38],40:[2,38],42:[2,38],43:[2,38],45:[2,38]},{1:[2,41],8:[2,41],20:[2,41],21:[2,41],25:[2,41],26:[2,41],27:[2,41],29:[2,41],32:[2,41],33:[2,41],36:[2,41],40:[2,41],42:[2,41],43:[2,41],45:[2,41]},{1:[2,37],8:[2,37],20:[2,37],21:[2,37],25:[2,37],26:[2,37],27:[2,37],29:[2,37],32:[2,37],33:[2,37],36:[2,37],40:[2,37],42:[2,37],43:[2,37],45:[2,37]},{1:[2,39],8:[2,39],20:[2,39],21:[2,39],25:[2,39],26:[2,39],27:[2,39],29:[2,39],32:[2,39],33:[2,39],36:[2,39],40:[2,39],42:[2,39],43:[2,39],45:[2,39]},{5:26,8:[2,24],9:4,10:5,11:6,12:7,13:8,14:9,15:10,16:11,17:12,18:13,19:14,20:[1,17],21:[1,89],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],33:[1,21],36:[1,22],40:[1,18],43:[1,15],45:[1,16]},{1:[2,36],8:[2,36],20:[2,36],21:[2,36],25:[2,36],26:[2,36],27:[2,36],29:[2,36],32:[2,36],33:[2,36],36:[2,36],40:[2,36],42:[2,36],43:[2,36],45:[2,36]},{1:[2,27],8:[2,27],20:[2,27],21:[2,27],25:[2,27],26:[2,27],27:[2,27],29:[2,27],32:[2,27],33:[2,27],36:[2,27],40:[2,27],42:[2,27],43:[2,27],45:[2,27]},{40:[1,90]},{1:[2,35],8:[2,35],20:[2,35],21:[2,35],25:[2,35],26:[2,35],27:[2,35],29:[2,35],32:[2,35],33:[2,35],36:[2,35],40:[2,35],42:[2,35],43:[2,35],45:[2,35]}],
defaultActions: {44:[2,25],69:[2,19]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match.length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:/* whitespace: do nothing */
break;
case 1: return 23; 
break;
case 2:/*{ return 'BLOCK_COMMENT'; }*/
break;
case 3:/*{ return 'LINE_COMMENT'; }*/
break;
case 4: return 21; 
break;
case 5: return 27; 
break;
case 6: return 30; 
break;
case 7: return 38; 
break;
case 8: return 39; 
break;
case 9: return 45; 
break;
case 10: return 40; 
break;
case 11: return 43; 
break;
case 12: return 32; 
break;
case 13: return 33; 
break;
case 14: return 36; 
break;
case 15: return 20; 
break;
case 16: return 29; 
break;
case 17: return 46; 
break;
case 18: return 41; 
break;
case 19: return 42; 
break;
case 20: return 44; 
break;
case 21: return 47; 
break;
case 22: return 25; 
break;
case 23: return 26; 
break;
case 24: return 35; 
break;
case 25: return 8; 
break;
case 26: return 'INVALID'; 
break;
}
};
lexer.rules = [/^\s+/,/^[0-9]+/,/^\{[^\}]*\}/,/^\/\/[^\n]*\n\b/,/^\*/,/^;/,/^\./,/^\(/,/^\)/,/^solange\b\b/,/^wenn\b\b/,/^wiederhole\b\b/,/^anweisung\b\b/,/^bedingung\b\b/,/^programm\b\b/,/^einfuegen\b\b/,/^karol\b\b/,/^tue\b\b/,/^dann\b\b/,/^sonst\b\b/,/^mal\b\b/,/^immer\b\b/,/^wahr\b\b/,/^falsch\b\b/,/^nicht\b\b/,/^[A-Za-z_-][A-Za-z0-9_-]*/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = karol;
exports.parse = function () { return karol.parse.apply(karol, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}