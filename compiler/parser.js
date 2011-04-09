/* Jison generated parser */
var karol = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"block":4,"statement":5,"identifier":6,"IDENTIFIER":7,"while":8,"whileTrue":9,"doWhile":10,"for":11,"if":12,"functionDefinition":13,"functionInvocation":14,"conditionDefinition":15,"program":16,"bool":17,"number":18,"NUMBER":19,"optNumber":20,"WAHR":21,"FALSCH":22,"optSemicolon":23,"SEMICOLON":24,"optKarolPrefix":25,"KAROL":26,"DOT":27,"optArgumentList":28,"ANWEISUNG":29,"STAR":30,"BEDINGUNG":31,"condition":32,"NICHT":33,"PROGRAMM":34,"argumentList":35,"OptNumber":36,"WENN":37,"DANN":38,"SONST":39,"WIEDERHOLE":40,"MAL":41,"SOLANGE":42,"TUE":43,"IMMER":44,"$accept":0,"$end":1},
terminals_: {2:"error",7:"IDENTIFIER",19:"NUMBER",21:"WAHR",22:"FALSCH",24:"SEMICOLON",26:"KAROL",27:"DOT",29:"ANWEISUNG",30:"STAR",31:"BEDINGUNG",33:"NICHT",34:"PROGRAMM",36:"OptNumber",37:"WENN",38:"DANN",39:"SONST",40:"WIEDERHOLE",41:"MAL",42:"SOLANGE",43:"TUE",44:"IMMER"},
productions_: [0,[3,1],[4,1],[4,2],[6,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[18,1],[20,0],[20,1],[17,1],[17,1],[23,0],[23,1],[25,0],[25,2],[14,4],[13,5],[15,5],[32,1],[32,2],[16,4],[35,1],[28,0],[28,1],[12,8],[12,6],[11,6],[8,6],[8,6],[9,5],[10,6]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return this.$ = $$[$0].dontIndent(); 
break;
case 2: this.$ = (new yy.Block()).addStatement($$[$0]); 
break;
case 3: this.$ = $$[$0-1].addStatement($$[$0]); 
break;
case 4: this.$ = new yy.Identifier($$[$0]); 
break;
case 15: this.$ = parseInt($$[$0], 10); 
break;
case 18: this.$ = new yy.Bool(true); 
break;
case 19: this.$ = new yy.Bool(false); 
break;
case 24: this.$ = new yy.FunctionInvocation($$[$0-2], $$[$0-1]); 
break;
case 25: this.$ = new yy.FunctionDefinition($$[$0-3], $$[$0-2]); 
break;
case 26: this.$ = new yy.ConditionDefinition($$[$0-3], $$[$0-2]); 
break;
case 27: this.$ = new yy.Condition($$[$0], false); 
break;
case 28: this.$ = new yy.Condition($$[$0], true); 
break;
case 29: this.$ = $$[$0-2].dontIndent(); 
break;
case 30: this.$ = new yy.ArgumentList($$[$01]); 
break;
case 31: this.$ = new yy.ArgumentList(); 
break;
case 33: this.$ = new yy.If($$[$0-6], $$[$0-4], $$[$0-2]); 
break;
case 34: this.$ = new yy.If($$[$0-4], $$[$0-2], null); 
break;
case 35: this.$ = new yy.For($$[$0-4], $$[$0-2]); 
break;
case 36: this.$ = new yy.While($$[$0-3], $$[$0-2]); 
break;
case 37: this.$ = new yy.While($$[$0-4], $$[$0-2]); 
break;
case 38: this.$ = new yy.WhileTrue($$[$0-2]); 
break;
case 39: this.$ = new yy.DoWhile($$[$0], $$[$0-4]); 
break;
}
},
table: [{3:1,4:2,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{1:[3]},{1:[2,1],5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{1:[2,2],7:[2,2],21:[2,2],22:[2,2],26:[2,2],29:[2,2],30:[2,2],31:[2,2],34:[2,2],37:[2,2],39:[2,2],40:[2,2],42:[2,2]},{1:[2,5],7:[2,5],21:[2,5],22:[2,5],26:[2,5],29:[2,5],30:[2,5],31:[2,5],34:[2,5],37:[2,5],39:[2,5],40:[2,5],42:[2,5]},{1:[2,6],7:[2,6],21:[2,6],22:[2,6],26:[2,6],29:[2,6],30:[2,6],31:[2,6],34:[2,6],37:[2,6],39:[2,6],40:[2,6],42:[2,6]},{1:[2,7],7:[2,7],21:[2,7],22:[2,7],26:[2,7],29:[2,7],30:[2,7],31:[2,7],34:[2,7],37:[2,7],39:[2,7],40:[2,7],42:[2,7]},{1:[2,8],7:[2,8],21:[2,8],22:[2,8],26:[2,8],29:[2,8],30:[2,8],31:[2,8],34:[2,8],37:[2,8],39:[2,8],40:[2,8],42:[2,8]},{1:[2,9],7:[2,9],21:[2,9],22:[2,9],26:[2,9],29:[2,9],30:[2,9],31:[2,9],34:[2,9],37:[2,9],39:[2,9],40:[2,9],42:[2,9]},{1:[2,10],7:[2,10],21:[2,10],22:[2,10],26:[2,10],29:[2,10],30:[2,10],31:[2,10],34:[2,10],37:[2,10],39:[2,10],40:[2,10],42:[2,10]},{1:[2,11],7:[2,11],21:[2,11],22:[2,11],26:[2,11],29:[2,11],30:[2,11],31:[2,11],34:[2,11],37:[2,11],39:[2,11],40:[2,11],42:[2,11]},{1:[2,12],7:[2,12],21:[2,12],22:[2,12],26:[2,12],29:[2,12],30:[2,12],31:[2,12],34:[2,12],37:[2,12],39:[2,12],40:[2,12],42:[2,12]},{1:[2,13],7:[2,13],21:[2,13],22:[2,13],26:[2,13],29:[2,13],30:[2,13],31:[2,13],34:[2,13],37:[2,13],39:[2,13],40:[2,13],42:[2,13]},{1:[2,14],7:[2,14],21:[2,14],22:[2,14],26:[2,14],29:[2,14],30:[2,14],31:[2,14],34:[2,14],37:[2,14],39:[2,14],40:[2,14],42:[2,14]},{4:27,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:28,19:[1,29],21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,25],44:[1,26]},{6:31,7:[1,33],32:30,33:[1,32]},{6:31,7:[1,33],32:34,33:[1,32]},{6:35,7:[1,33]},{6:36,7:[1,33]},{6:37,7:[1,33]},{4:38,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{1:[2,18],7:[2,18],21:[2,18],22:[2,18],26:[2,18],29:[2,18],30:[2,18],31:[2,18],34:[2,18],37:[2,18],39:[2,18],40:[2,18],42:[2,18]},{1:[2,19],7:[2,19],21:[2,19],22:[2,19],26:[2,19],29:[2,19],30:[2,19],31:[2,19],34:[2,19],37:[2,19],39:[2,19],40:[2,19],42:[2,19]},{27:[1,39]},{1:[2,3],7:[2,3],21:[2,3],22:[2,3],26:[2,3],29:[2,3],30:[2,3],31:[2,3],34:[2,3],37:[2,3],39:[2,3],40:[2,3],42:[2,3]},{6:31,7:[1,33],32:40,33:[1,32]},{4:41,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],30:[1,42],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{41:[1,43]},{41:[2,15]},{43:[1,44]},{1:[2,27],7:[2,27],21:[2,27],22:[2,27],26:[2,27],29:[2,27],30:[2,27],31:[2,27],34:[2,27],37:[2,27],38:[2,27],39:[2,27],40:[2,27],42:[2,27],43:[2,27]},{6:45,7:[1,33]},{1:[2,4],7:[2,4],21:[2,4],22:[2,4],24:[2,4],26:[2,4],29:[2,4],30:[2,4],31:[2,4],34:[2,4],36:[2,4],37:[2,4],38:[2,4],39:[2,4],40:[2,4],42:[2,4],43:[2,4]},{38:[1,46]},{4:47,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{1:[2,31],7:[2,31],21:[2,31],22:[2,31],24:[2,31],26:[2,31],28:48,29:[2,31],30:[2,31],31:[2,31],34:[2,31],35:49,36:[1,50],37:[2,31],39:[2,31],40:[2,31],42:[2,31]},{4:51,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],30:[1,52],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{7:[2,23]},{4:53,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15],43:[1,44]},{5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],30:[1,54],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{40:[1,55]},{4:56,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{4:57,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{1:[2,28],7:[2,28],21:[2,28],22:[2,28],26:[2,28],29:[2,28],30:[2,28],31:[2,28],34:[2,28],37:[2,28],38:[2,28],39:[2,28],40:[2,28],42:[2,28],43:[2,28]},{4:58,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],30:[1,59],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{1:[2,20],7:[2,20],21:[2,20],22:[2,20],23:60,24:[1,61],26:[2,20],29:[2,20],30:[2,20],31:[2,20],34:[2,20],37:[2,20],39:[2,20],40:[2,20],42:[2,20]},{1:[2,32],7:[2,32],21:[2,32],22:[2,32],24:[2,32],26:[2,32],29:[2,32],30:[2,32],31:[2,32],34:[2,32],37:[2,32],39:[2,32],40:[2,32],42:[2,32]},{1:[2,30],7:[2,30],21:[2,30],22:[2,30],24:[2,30],26:[2,30],29:[2,30],30:[2,30],31:[2,30],34:[2,30],37:[2,30],39:[2,30],40:[2,30],42:[2,30]},{5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],30:[1,62],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{34:[1,63]},{5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],30:[1,64],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{40:[1,65]},{42:[1,66]},{5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],30:[1,67],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],30:[1,68],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],30:[1,70],31:[1,19],34:[1,20],37:[1,16],39:[1,69],40:[1,14],42:[1,15]},{29:[1,71]},{1:[2,24],7:[2,24],21:[2,24],22:[2,24],26:[2,24],29:[2,24],30:[2,24],31:[2,24],34:[2,24],37:[2,24],39:[2,24],40:[2,24],42:[2,24]},{1:[2,21],7:[2,21],21:[2,21],22:[2,21],26:[2,21],29:[2,21],30:[2,21],31:[2,21],34:[2,21],37:[2,21],39:[2,21],40:[2,21],42:[2,21]},{31:[1,72]},{1:[2,29],7:[2,29],21:[2,29],22:[2,29],26:[2,29],29:[2,29],30:[2,29],31:[2,29],34:[2,29],37:[2,29],39:[2,29],40:[2,29],42:[2,29]},{40:[1,73]},{1:[2,38],7:[2,38],21:[2,38],22:[2,38],26:[2,38],29:[2,38],30:[2,38],31:[2,38],34:[2,38],37:[2,38],39:[2,38],40:[2,38],42:[2,38]},{6:31,7:[1,33],32:74,33:[1,32]},{40:[1,75]},{42:[1,76]},{4:77,5:3,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{37:[1,78]},{1:[2,25],7:[2,25],21:[2,25],22:[2,25],26:[2,25],29:[2,25],30:[2,25],31:[2,25],34:[2,25],37:[2,25],39:[2,25],40:[2,25],42:[2,25]},{1:[2,26],7:[2,26],21:[2,26],22:[2,26],26:[2,26],29:[2,26],30:[2,26],31:[2,26],34:[2,26],37:[2,26],39:[2,26],40:[2,26],42:[2,26]},{1:[2,36],7:[2,36],21:[2,36],22:[2,36],26:[2,36],29:[2,36],30:[2,36],31:[2,36],34:[2,36],37:[2,36],39:[2,36],40:[2,36],42:[2,36]},{1:[2,39],7:[2,39],21:[2,39],22:[2,39],26:[2,39],29:[2,39],30:[2,39],31:[2,39],34:[2,39],37:[2,39],39:[2,39],40:[2,39],42:[2,39]},{1:[2,35],7:[2,35],21:[2,35],22:[2,35],26:[2,35],29:[2,35],30:[2,35],31:[2,35],34:[2,35],37:[2,35],39:[2,35],40:[2,35],42:[2,35]},{1:[2,37],7:[2,37],21:[2,37],22:[2,37],26:[2,37],29:[2,37],30:[2,37],31:[2,37],34:[2,37],37:[2,37],39:[2,37],40:[2,37],42:[2,37]},{5:24,7:[2,22],8:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,21:[1,21],22:[1,22],25:18,26:[1,23],29:[1,17],30:[1,79],31:[1,19],34:[1,20],37:[1,16],40:[1,14],42:[1,15]},{1:[2,34],7:[2,34],21:[2,34],22:[2,34],26:[2,34],29:[2,34],30:[2,34],31:[2,34],34:[2,34],37:[2,34],39:[2,34],40:[2,34],42:[2,34]},{37:[1,80]},{1:[2,33],7:[2,33],21:[2,33],22:[2,33],26:[2,33],29:[2,33],30:[2,33],31:[2,33],34:[2,33],37:[2,33],39:[2,33],40:[2,33],42:[2,33]}],
defaultActions: {29:[2,15],39:[2,23]},
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
case 1: return 19; 
break;
case 2:/*{ return 'BLOCK_COMMENT'; }*/
break;
case 3:/*{ return 'LINE_COMMENT'; }*/
break;
case 4: return 30; 
break;
case 5: return 24; 
break;
case 6: return 27; 
break;
case 7: return '('; 
break;
case 8: return ')'; 
break;
case 9: return 42; 
break;
case 10: return 37; 
break;
case 11: return 40; 
break;
case 12: return 29; 
break;
case 13: return 31; 
break;
case 14: return 34; 
break;
case 15: return 26; 
break;
case 16: return 43; 
break;
case 17: return 38; 
break;
case 18: return 39; 
break;
case 19: return 41; 
break;
case 20: return 44; 
break;
case 21: return 21; 
break;
case 22: return 22; 
break;
case 23: return 33; 
break;
case 24: return 7; 
break;
case 25: return 'INVALID'; 
break;
}
};
lexer.rules = [/^\s+/,/^[0-9]+/,/^\{[^\}]*\}/,/^\/\/[^\n]*\n\b/,/^\*/,/^;/,/^\./,/^\(/,/^\)/,/^solange\b\b/,/^wenn\b\b/,/^wiederhole\b\b/,/^anweisung\b\b/,/^bedingung\b\b/,/^programm\b\b/,/^karol\b\b/,/^tue\b\b/,/^dann\b\b/,/^sonst\b\b/,/^mal\b\b/,/^immer\b\b/,/^wahr\b\b/,/^falsch\b\b/,/^nicht\b\b/,/^[A-Za-z_-][A-Za-z0-9_-]*/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"inclusive":true}};return lexer;})()
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