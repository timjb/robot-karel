/* Jison generated parser */
var karol = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"block":4,"statement":5,"optSemicolon":6,"forceBlock":7,"identifier":8,"IDENTIFIER":9,"while":10,"import":11,"whileTrue":12,"doWhile":13,"for":14,"if":15,"functionDefinition":16,"functionInvocation":17,"conditionDefinition":18,"program":19,"bool":20,"EINFUEGEN":21,"STAR":22,"number":23,"NUMBER":24,"optNumber":25,"WAHR":26,"FALSCH":27,"SEMICOLON":28,"optKarolPrefix":29,"KAROL":30,"DOT":31,"optArgumentList":32,"ANWEISUNG":33,"BEDINGUNG":34,"condition":35,"NICHT":36,"PROGRAMM":37,"argumentList":38,"LPAREN":39,"RPAREN":40,"WENN":41,"DANN":42,"SONST":43,"WIEDERHOLE":44,"MAL":45,"SOLANGE":46,"TUE":47,"IMMER":48,"$accept":0,"$end":1},
terminals_: {2:"error",9:"IDENTIFIER",21:"EINFUEGEN",22:"STAR",24:"NUMBER",26:"WAHR",27:"FALSCH",28:"SEMICOLON",30:"KAROL",31:"DOT",33:"ANWEISUNG",34:"BEDINGUNG",36:"NICHT",37:"PROGRAMM",39:"LPAREN",40:"RPAREN",41:"WENN",42:"DANN",43:"SONST",44:"WIEDERHOLE",45:"MAL",46:"SOLANGE",47:"TUE",48:"IMMER"},
productions_: [0,[3,1],[4,0],[4,3],[7,2],[7,3],[8,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[11,4],[23,1],[25,0],[25,1],[20,1],[20,1],[6,0],[6,1],[29,0],[29,2],[17,3],[16,6],[18,5],[35,1],[35,2],[19,4],[38,3],[32,0],[32,1],[15,8],[15,6],[14,6],[10,6],[10,6],[12,5],[13,6]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return this.$ = $$[$0].dontIndent(); 
break;
case 2: this.$ = new yy.Block(); 
break;
case 3: this.$ = $$[$0-2].addStatement($$[$0-1]); 
break;
case 4: this.$ = (new yy.Block()).addStatement($$[$0-1]); 
break;
case 5: this.$ = $$[$0-2].addStatement($$[$0-1]); 
break;
case 6: this.$ = new yy.Identifier($$[$0]); 
break;
case 18: this.$ = new yy.Import($$[$0-2]); 
break;
case 19: this.$ = parseInt($$[$0], 10); 
break;
case 22: this.$ = new yy.Bool(true); 
break;
case 23: this.$ = new yy.Bool(false); 
break;
case 28: this.$ = new yy.FunctionInvocation($$[$0-1], $$[$0]); 
break;
case 29: this.$ = new yy.FunctionDefinition($$[$0-4], $$[$0-2]); 
break;
case 30: this.$ = new yy.ConditionDefinition($$[$0-3], $$[$0-2]); 
break;
case 31: this.$ = $$[$0].setInline(); 
break;
case 32: this.$ = new yy.Inversion($$[$0].setInline()); 
break;
case 33: this.$ = $$[$0-2].dontIndent(); 
break;
case 34: this.$ = new yy.ArgumentList($$[$0-1]); 
break;
case 35: this.$ = new yy.ArgumentList(); 
break;
case 37: this.$ = new yy.If($$[$0-6], $$[$0-4], $$[$0-2]); 
break;
case 38: this.$ = new yy.If($$[$0-4], $$[$0-2], null); 
break;
case 39: this.$ = new yy.For($$[$0-4], $$[$0-2]); 
break;
case 40: this.$ = new yy.While($$[$0-3], $$[$0-2]); 
break;
case 41: this.$ = new yy.While($$[$0-4], $$[$0-2]); 
break;
case 42: this.$ = new yy.WhileTrue($$[$0-2]); 
break;
case 43: this.$ = new yy.DoWhile($$[$0], $$[$0-4]); 
break;
}
},
table: [{1:[2,2],3:1,4:2,9:[2,2],21:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{1:[3]},{1:[2,1],5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{1:[2,24],6:26,9:[2,24],21:[2,24],22:[2,24],26:[2,24],27:[2,24],28:[1,27],30:[2,24],33:[2,24],34:[2,24],37:[2,24],41:[2,24],43:[2,24],44:[2,24],46:[2,24]},{1:[2,7],9:[2,7],21:[2,7],22:[2,7],26:[2,7],27:[2,7],28:[2,7],30:[2,7],33:[2,7],34:[2,7],37:[2,7],41:[2,7],43:[2,7],44:[2,7],46:[2,7]},{1:[2,8],9:[2,8],21:[2,8],22:[2,8],26:[2,8],27:[2,8],28:[2,8],30:[2,8],33:[2,8],34:[2,8],37:[2,8],41:[2,8],43:[2,8],44:[2,8],46:[2,8]},{1:[2,9],9:[2,9],21:[2,9],22:[2,9],26:[2,9],27:[2,9],28:[2,9],30:[2,9],33:[2,9],34:[2,9],37:[2,9],41:[2,9],43:[2,9],44:[2,9],46:[2,9]},{1:[2,10],9:[2,10],21:[2,10],22:[2,10],26:[2,10],27:[2,10],28:[2,10],30:[2,10],33:[2,10],34:[2,10],37:[2,10],41:[2,10],43:[2,10],44:[2,10],46:[2,10]},{1:[2,11],9:[2,11],21:[2,11],22:[2,11],26:[2,11],27:[2,11],28:[2,11],30:[2,11],33:[2,11],34:[2,11],37:[2,11],41:[2,11],43:[2,11],44:[2,11],46:[2,11]},{1:[2,12],9:[2,12],21:[2,12],22:[2,12],26:[2,12],27:[2,12],28:[2,12],30:[2,12],33:[2,12],34:[2,12],37:[2,12],41:[2,12],43:[2,12],44:[2,12],46:[2,12]},{1:[2,13],9:[2,13],21:[2,13],22:[2,13],26:[2,13],27:[2,13],28:[2,13],30:[2,13],33:[2,13],34:[2,13],37:[2,13],41:[2,13],43:[2,13],44:[2,13],46:[2,13]},{1:[2,14],9:[2,14],21:[2,14],22:[2,14],26:[2,14],27:[2,14],28:[2,14],30:[2,14],33:[2,14],34:[2,14],37:[2,14],41:[2,14],43:[2,14],44:[2,14],46:[2,14]},{1:[2,15],9:[2,15],21:[2,15],22:[2,15],26:[2,15],27:[2,15],28:[2,15],30:[2,15],33:[2,15],34:[2,15],37:[2,15],41:[2,15],43:[2,15],44:[2,15],46:[2,15]},{1:[2,16],9:[2,16],21:[2,16],22:[2,16],26:[2,16],27:[2,16],28:[2,16],30:[2,16],33:[2,16],34:[2,16],37:[2,16],41:[2,16],43:[2,16],44:[2,16],46:[2,16]},{1:[2,17],9:[2,17],21:[2,17],22:[2,17],26:[2,17],27:[2,17],28:[2,17],30:[2,17],33:[2,17],34:[2,17],37:[2,17],41:[2,17],43:[2,17],44:[2,17],46:[2,17]},{5:32,7:30,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],23:31,24:[1,33],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,28],48:[1,29]},{9:[2,26],17:35,29:20,30:[1,25],35:34,36:[1,36]},{8:37,9:[1,38]},{9:[2,26],17:35,29:20,30:[1,25],35:39,36:[1,36]},{8:40,9:[1,38]},{8:41,9:[1,38]},{8:42,9:[1,38]},{4:43,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{1:[2,22],9:[2,22],21:[2,22],22:[2,22],26:[2,22],27:[2,22],28:[2,22],30:[2,22],33:[2,22],34:[2,22],37:[2,22],41:[2,22],43:[2,22],44:[2,22],46:[2,22]},{1:[2,23],9:[2,23],21:[2,23],22:[2,23],26:[2,23],27:[2,23],28:[2,23],30:[2,23],33:[2,23],34:[2,23],37:[2,23],41:[2,23],43:[2,23],44:[2,23],46:[2,23]},{31:[1,44]},{1:[2,3],9:[2,3],21:[2,3],22:[2,3],26:[2,3],27:[2,3],30:[2,3],33:[2,3],34:[2,3],37:[2,3],41:[2,3],43:[2,3],44:[2,3],46:[2,3]},{1:[2,25],9:[2,25],21:[2,25],22:[2,25],26:[2,25],27:[2,25],30:[2,25],33:[2,25],34:[2,25],37:[2,25],41:[2,25],43:[2,25],44:[2,25],46:[2,25]},{9:[2,26],17:35,29:20,30:[1,25],35:45,36:[1,36]},{4:46,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{5:48,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,47],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{45:[1,49]},{6:50,9:[2,24],21:[2,24],22:[2,24],26:[2,24],27:[2,24],28:[1,27],30:[2,24],33:[2,24],34:[2,24],37:[2,24],41:[2,24],44:[2,24],46:[2,24]},{40:[2,19],45:[2,19]},{47:[1,51]},{1:[2,31],9:[2,31],21:[2,31],22:[2,31],26:[2,31],27:[2,31],28:[2,31],30:[2,31],33:[2,31],34:[2,31],37:[2,31],41:[2,31],42:[2,31],43:[2,31],44:[2,31],46:[2,31],47:[2,31]},{9:[2,26],17:52,29:20,30:[1,25]},{22:[1,53]},{1:[2,6],9:[2,6],21:[2,6],22:[2,6],26:[2,6],27:[2,6],28:[2,6],30:[2,6],33:[2,6],34:[2,6],37:[2,6],39:[2,6],41:[2,6],42:[2,6],43:[2,6],44:[2,6],46:[2,6],47:[2,6]},{42:[1,54]},{6:55,9:[2,24],21:[2,24],22:[2,24],26:[2,24],27:[2,24],28:[1,27],30:[2,24],33:[2,24],34:[2,24],37:[2,24],41:[2,24],44:[2,24],46:[2,24]},{1:[2,35],9:[2,35],21:[2,35],22:[2,35],26:[2,35],27:[2,35],28:[2,35],30:[2,35],32:56,33:[2,35],34:[2,35],37:[2,35],38:57,39:[1,58],41:[2,35],42:[2,35],43:[2,35],44:[2,35],46:[2,35],47:[2,35]},{4:59,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,60],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{9:[2,27]},{4:61,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2],47:[1,51]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,62],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{44:[1,63]},{6:64,9:[2,24],21:[2,24],22:[2,24],26:[2,24],27:[2,24],28:[1,27],30:[2,24],33:[2,24],34:[2,24],37:[2,24],41:[2,24],44:[2,24],46:[2,24]},{4:65,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{9:[2,4],21:[2,4],22:[2,4],26:[2,4],27:[2,4],30:[2,4],33:[2,4],34:[2,4],37:[2,4],41:[2,4],44:[2,4],46:[2,4]},{4:66,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{1:[2,32],9:[2,32],21:[2,32],22:[2,32],26:[2,32],27:[2,32],28:[2,32],30:[2,32],33:[2,32],34:[2,32],37:[2,32],41:[2,32],42:[2,32],43:[2,32],44:[2,32],46:[2,32],47:[2,32]},{21:[1,67]},{4:68,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],43:[2,2],44:[2,2],46:[2,2]},{4:69,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{1:[2,28],9:[2,28],21:[2,28],22:[2,28],26:[2,28],27:[2,28],28:[2,28],30:[2,28],33:[2,28],34:[2,28],37:[2,28],41:[2,28],42:[2,28],43:[2,28],44:[2,28],46:[2,28],47:[2,28]},{1:[2,36],9:[2,36],21:[2,36],22:[2,36],26:[2,36],27:[2,36],28:[2,36],30:[2,36],33:[2,36],34:[2,36],37:[2,36],41:[2,36],42:[2,36],43:[2,36],44:[2,36],46:[2,36],47:[2,36]},{23:71,24:[1,33],25:70,40:[2,20]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,72],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{37:[1,73]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,74],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{44:[1,75]},{46:[1,76]},{9:[2,5],21:[2,5],22:[2,5],26:[2,5],27:[2,5],30:[2,5],33:[2,5],34:[2,5],37:[2,5],41:[2,5],44:[2,5],46:[2,5]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,77],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,78],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{1:[2,18],9:[2,18],21:[2,18],22:[2,18],26:[2,18],27:[2,18],28:[2,18],30:[2,18],33:[2,18],34:[2,18],37:[2,18],41:[2,18],43:[2,18],44:[2,18],46:[2,18]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,80],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],43:[1,79],44:[1,15],46:[1,16]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,81],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{40:[1,82]},{40:[2,21]},{34:[1,83]},{1:[2,33],9:[2,33],21:[2,33],22:[2,33],26:[2,33],27:[2,33],28:[2,33],30:[2,33],33:[2,33],34:[2,33],37:[2,33],41:[2,33],43:[2,33],44:[2,33],46:[2,33]},{44:[1,84]},{1:[2,42],9:[2,42],21:[2,42],22:[2,42],26:[2,42],27:[2,42],28:[2,42],30:[2,42],33:[2,42],34:[2,42],37:[2,42],41:[2,42],43:[2,42],44:[2,42],46:[2,42]},{9:[2,26],17:35,29:20,30:[1,25],35:85,36:[1,36]},{44:[1,86]},{46:[1,87]},{4:88,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{41:[1,89]},{33:[1,90]},{1:[2,34],9:[2,34],21:[2,34],22:[2,34],26:[2,34],27:[2,34],28:[2,34],30:[2,34],33:[2,34],34:[2,34],37:[2,34],41:[2,34],42:[2,34],43:[2,34],44:[2,34],46:[2,34],47:[2,34]},{1:[2,30],9:[2,30],21:[2,30],22:[2,30],26:[2,30],27:[2,30],28:[2,30],30:[2,30],33:[2,30],34:[2,30],37:[2,30],41:[2,30],43:[2,30],44:[2,30],46:[2,30]},{1:[2,40],9:[2,40],21:[2,40],22:[2,40],26:[2,40],27:[2,40],28:[2,40],30:[2,40],33:[2,40],34:[2,40],37:[2,40],41:[2,40],43:[2,40],44:[2,40],46:[2,40]},{1:[2,43],9:[2,43],21:[2,43],22:[2,43],26:[2,43],27:[2,43],28:[2,43],30:[2,43],33:[2,43],34:[2,43],37:[2,43],41:[2,43],43:[2,43],44:[2,43],46:[2,43]},{1:[2,39],9:[2,39],21:[2,39],22:[2,39],26:[2,39],27:[2,39],28:[2,39],30:[2,39],33:[2,39],34:[2,39],37:[2,39],41:[2,39],43:[2,39],44:[2,39],46:[2,39]},{1:[2,41],9:[2,41],21:[2,41],22:[2,41],26:[2,41],27:[2,41],28:[2,41],30:[2,41],33:[2,41],34:[2,41],37:[2,41],41:[2,41],43:[2,41],44:[2,41],46:[2,41]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,91],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{1:[2,38],9:[2,38],21:[2,38],22:[2,38],26:[2,38],27:[2,38],28:[2,38],30:[2,38],33:[2,38],34:[2,38],37:[2,38],41:[2,38],43:[2,38],44:[2,38],46:[2,38]},{1:[2,29],9:[2,29],21:[2,29],22:[2,29],26:[2,29],27:[2,29],28:[2,29],30:[2,29],33:[2,29],34:[2,29],37:[2,29],41:[2,29],43:[2,29],44:[2,29],46:[2,29]},{41:[1,92]},{1:[2,37],9:[2,37],21:[2,37],22:[2,37],26:[2,37],27:[2,37],28:[2,37],30:[2,37],33:[2,37],34:[2,37],37:[2,37],41:[2,37],43:[2,37],44:[2,37],46:[2,37]}],
defaultActions: {44:[2,27],71:[2,21]},
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
case 1: return 24; 
break;
case 2:/*{ return 'BLOCK_COMMENT'; }*/
break;
case 3:/*{ return 'LINE_COMMENT'; }*/
break;
case 4: return 22; 
break;
case 5: return 28; 
break;
case 6: return 31; 
break;
case 7: return 39; 
break;
case 8: return 40; 
break;
case 9: return 46; 
break;
case 10: return 41; 
break;
case 11: return 44; 
break;
case 12: return 33; 
break;
case 13: return 34; 
break;
case 14: return 37; 
break;
case 15: return 21; 
break;
case 16: return 30; 
break;
case 17: return 47; 
break;
case 18: return 42; 
break;
case 19: return 43; 
break;
case 20: return 45; 
break;
case 21: return 48; 
break;
case 22: return 26; 
break;
case 23: return 27; 
break;
case 24: return 36; 
break;
case 25: return 9; 
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