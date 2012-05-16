/* Jison generated parser */
var karol = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"block":4,"statement":5,"optSemicolon":6,"forceBlock":7,"identifier":8,"IDENTIFIER":9,"while":10,"import":11,"whileTrue":12,"doWhile":13,"for":14,"if":15,"functionDefinition":16,"functionInvocation":17,"conditionDefinition":18,"program":19,"boolStatement":20,"EINFUEGEN":21,"STAR":22,"number":23,"NUMBER":24,"WAHR":25,"FALSCH":26,"SEMICOLON":27,"optKarolPrefix":28,"KAROL":29,"DOT":30,"optParameters":31,"ANWEISUNG":32,"optFormalParameters":33,"BEDINGUNG":34,"condition":35,"NICHT":36,"PROGRAMM":37,"formalParametersList":38,"COMMA":39,"formalParameters":40,"LPAREN":41,"RPAREN":42,"parameter":43,"parametersList":44,"parameters":45,"WENN":46,"DANN":47,"SONST":48,"WIEDERHOLE":49,"MAL":50,"SOLANGE":51,"TUE":52,"IMMER":53,"$accept":0,"$end":1},
terminals_: {2:"error",9:"IDENTIFIER",21:"EINFUEGEN",22:"STAR",24:"NUMBER",25:"WAHR",26:"FALSCH",27:"SEMICOLON",29:"KAROL",30:"DOT",32:"ANWEISUNG",34:"BEDINGUNG",36:"NICHT",37:"PROGRAMM",39:"COMMA",41:"LPAREN",42:"RPAREN",46:"WENN",47:"DANN",48:"SONST",49:"WIEDERHOLE",50:"MAL",51:"SOLANGE",52:"TUE",53:"IMMER"},
productions_: [0,[3,1],[4,0],[4,3],[7,2],[7,3],[8,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[11,4],[23,1],[20,1],[20,1],[6,0],[6,1],[28,0],[28,2],[17,3],[16,7],[18,7],[35,1],[35,2],[19,4],[38,1],[38,3],[40,3],[33,0],[33,1],[43,1],[43,1],[44,1],[44,3],[45,2],[45,3],[31,0],[31,1],[15,8],[15,6],[14,6],[10,6],[10,6],[12,5],[13,6]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return this.$ = $$[$0].setToplevel(); 
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
case 18: this.$ = new yy.Import($$[$0-2]).l(this._$); 
break;
case 19: this.$ = new yy.Number($$[$0]); 
break;
case 20: this.$ = new yy.BoolStatement(true).l(this._$); 
break;
case 21: this.$ = new yy.BoolStatement(false).l(this._$); 
break;
case 26: this.$ = new yy.FunctionInvocation($$[$0-1], $$[$0]).l(this._$); 
break;
case 27: this.$ = new yy.Definition($$[$0-5], $$[$0-4], $$[$0-2], false).l(this._$); 
break;
case 28: this.$ = new yy.Definition($$[$0-5], $$[$0-4], $$[$0-2], true).l(this._$); 
break;
case 29: this.$ = $$[$0].setInline(); 
break;
case 30: this.$ = new yy.Inversion($$[$0].setInline()).l(this._$); 
break;
case 31: this.$ = $$[$0-2].setToplevel(); 
break;
case 32: this.$ = [$$[$0]]; 
break;
case 33: this.$ = $$[$0-2].concat([$$[$0]]); 
break;
case 34: this.$ = new yy.FormalParameters($$[$0-1]); 
break;
case 35: this.$ = new yy.FormalParameters(); 
break;
case 39: this.$ = [$$[$0]]; 
break;
case 40: this.$ = $$[$0-2].concat([$$[$0]]); 
break;
case 41: this.$ = new yy.Parameters([]); 
break;
case 42: this.$ = new yy.Parameters($$[$0-1]); 
break;
case 43: this.$ = new yy.Parameters(); 
break;
case 45: this.$ = new yy.If($$[$0-6], $$[$0-4], $$[$0-2]).l(this._$); 
break;
case 46: this.$ = new yy.If($$[$0-4], $$[$0-2], null).l(this._$); 
break;
case 47: this.$ = new yy.For($$[$0-4], $$[$0-2]).l(this._$); 
break;
case 48: this.$ = new yy.While($$[$0-3], $$[$0-2]).l(this._$); 
break;
case 49: this.$ = new yy.While($$[$0-4], $$[$0-2]).l(this._$); 
break;
case 50: this.$ = new yy.WhileTrue($$[$0-2]).l(this._$); 
break;
case 51: this.$ = new yy.DoWhile($$[$0], $$[$0-4]).l(this._$); 
break;
}
},
table: [{1:[2,2],3:1,4:2,9:[2,2],21:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],34:[2,2],37:[2,2],46:[2,2],49:[2,2],51:[2,2]},{1:[3]},{1:[2,1],5:3,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,16]},{1:[2,22],6:26,9:[2,22],21:[2,22],22:[2,22],25:[2,22],26:[2,22],27:[1,27],29:[2,22],32:[2,22],34:[2,22],37:[2,22],46:[2,22],48:[2,22],49:[2,22],51:[2,22]},{1:[2,7],9:[2,7],21:[2,7],22:[2,7],25:[2,7],26:[2,7],27:[2,7],29:[2,7],32:[2,7],34:[2,7],37:[2,7],46:[2,7],48:[2,7],49:[2,7],51:[2,7]},{1:[2,8],9:[2,8],21:[2,8],22:[2,8],25:[2,8],26:[2,8],27:[2,8],29:[2,8],32:[2,8],34:[2,8],37:[2,8],46:[2,8],48:[2,8],49:[2,8],51:[2,8]},{1:[2,9],9:[2,9],21:[2,9],22:[2,9],25:[2,9],26:[2,9],27:[2,9],29:[2,9],32:[2,9],34:[2,9],37:[2,9],46:[2,9],48:[2,9],49:[2,9],51:[2,9]},{1:[2,10],9:[2,10],21:[2,10],22:[2,10],25:[2,10],26:[2,10],27:[2,10],29:[2,10],32:[2,10],34:[2,10],37:[2,10],46:[2,10],48:[2,10],49:[2,10],51:[2,10]},{1:[2,11],9:[2,11],21:[2,11],22:[2,11],25:[2,11],26:[2,11],27:[2,11],29:[2,11],32:[2,11],34:[2,11],37:[2,11],46:[2,11],48:[2,11],49:[2,11],51:[2,11]},{1:[2,12],9:[2,12],21:[2,12],22:[2,12],25:[2,12],26:[2,12],27:[2,12],29:[2,12],32:[2,12],34:[2,12],37:[2,12],46:[2,12],48:[2,12],49:[2,12],51:[2,12]},{1:[2,13],9:[2,13],21:[2,13],22:[2,13],25:[2,13],26:[2,13],27:[2,13],29:[2,13],32:[2,13],34:[2,13],37:[2,13],46:[2,13],48:[2,13],49:[2,13],51:[2,13]},{1:[2,14],9:[2,14],21:[2,14],22:[2,14],25:[2,14],26:[2,14],27:[2,14],29:[2,14],32:[2,14],34:[2,14],37:[2,14],46:[2,14],48:[2,14],49:[2,14],51:[2,14]},{1:[2,15],9:[2,15],21:[2,15],22:[2,15],25:[2,15],26:[2,15],27:[2,15],29:[2,15],32:[2,15],34:[2,15],37:[2,15],46:[2,15],48:[2,15],49:[2,15],51:[2,15]},{1:[2,16],9:[2,16],21:[2,16],22:[2,16],25:[2,16],26:[2,16],27:[2,16],29:[2,16],32:[2,16],34:[2,16],37:[2,16],46:[2,16],48:[2,16],49:[2,16],51:[2,16]},{1:[2,17],9:[2,17],21:[2,17],22:[2,17],25:[2,17],26:[2,17],27:[2,17],29:[2,17],32:[2,17],34:[2,17],37:[2,17],46:[2,17],48:[2,17],49:[2,17],51:[2,17]},{5:32,7:30,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],23:31,24:[1,33],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,28],53:[1,29]},{9:[2,24],17:35,28:20,29:[1,25],35:34,36:[1,36]},{8:37,9:[1,38]},{9:[2,24],17:35,28:20,29:[1,25],35:39,36:[1,36]},{8:40,9:[1,38]},{8:41,9:[1,38]},{8:42,9:[1,38]},{4:43,9:[2,2],21:[2,2],22:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],34:[2,2],37:[2,2],46:[2,2],49:[2,2],51:[2,2]},{1:[2,20],9:[2,20],21:[2,20],22:[2,20],25:[2,20],26:[2,20],27:[2,20],29:[2,20],32:[2,20],34:[2,20],37:[2,20],46:[2,20],48:[2,20],49:[2,20],51:[2,20]},{1:[2,21],9:[2,21],21:[2,21],22:[2,21],25:[2,21],26:[2,21],27:[2,21],29:[2,21],32:[2,21],34:[2,21],37:[2,21],46:[2,21],48:[2,21],49:[2,21],51:[2,21]},{30:[1,44]},{1:[2,3],9:[2,3],21:[2,3],22:[2,3],25:[2,3],26:[2,3],29:[2,3],32:[2,3],34:[2,3],37:[2,3],46:[2,3],48:[2,3],49:[2,3],51:[2,3]},{1:[2,23],9:[2,23],21:[2,23],22:[2,23],25:[2,23],26:[2,23],29:[2,23],32:[2,23],34:[2,23],37:[2,23],46:[2,23],48:[2,23],49:[2,23],51:[2,23]},{9:[2,24],17:35,28:20,29:[1,25],35:45,36:[1,36]},{4:46,9:[2,2],21:[2,2],22:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],34:[2,2],37:[2,2],46:[2,2],49:[2,2],51:[2,2]},{5:48,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,47],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,16]},{50:[1,49]},{6:50,9:[2,22],21:[2,22],22:[2,22],25:[2,22],26:[2,22],27:[1,27],29:[2,22],32:[2,22],34:[2,22],37:[2,22],46:[2,22],49:[2,22],51:[2,22]},{39:[2,19],42:[2,19],50:[2,19]},{52:[1,51]},{1:[2,29],9:[2,29],21:[2,29],22:[2,29],25:[2,29],26:[2,29],27:[2,29],29:[2,29],32:[2,29],34:[2,29],37:[2,29],46:[2,29],47:[2,29],48:[2,29],49:[2,29],51:[2,29],52:[2,29]},{9:[2,24],17:52,28:20,29:[1,25]},{22:[1,53]},{1:[2,6],9:[2,6],21:[2,6],22:[2,6],25:[2,6],26:[2,6],27:[2,6],29:[2,6],32:[2,6],34:[2,6],37:[2,6],39:[2,6],41:[2,6],42:[2,6],46:[2,6],47:[2,6],48:[2,6],49:[2,6],51:[2,6],52:[2,6]},{47:[1,54]},{9:[2,35],21:[2,35],22:[2,35],25:[2,35],26:[2,35],27:[2,35],29:[2,35],32:[2,35],33:55,34:[2,35],37:[2,35],40:56,41:[1,57],46:[2,35],49:[2,35],51:[2,35]},{1:[2,43],9:[2,43],21:[2,43],22:[2,43],25:[2,43],26:[2,43],27:[2,43],29:[2,43],31:58,32:[2,43],34:[2,43],37:[2,43],41:[1,60],45:59,46:[2,43],47:[2,43],48:[2,43],49:[2,43],51:[2,43],52:[2,43]},{9:[2,35],21:[2,35],22:[2,35],25:[2,35],26:[2,35],27:[2,35],29:[2,35],32:[2,35],33:61,34:[2,35],37:[2,35],40:56,41:[1,57],46:[2,35],49:[2,35],51:[2,35]},{5:3,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,62],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,16]},{9:[2,25]},{4:63,9:[2,2],21:[2,2],22:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],34:[2,2],37:[2,2],46:[2,2],49:[2,2],51:[2,2],52:[1,51]},{5:3,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,64],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,16]},{49:[1,65]},{6:66,9:[2,22],21:[2,22],22:[2,22],25:[2,22],26:[2,22],27:[1,27],29:[2,22],32:[2,22],34:[2,22],37:[2,22],46:[2,22],49:[2,22],51:[2,22]},{4:67,9:[2,2],21:[2,2],22:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],34:[2,2],37:[2,2],46:[2,2],49:[2,2],51:[2,2]},{9:[2,4],21:[2,4],22:[2,4],25:[2,4],26:[2,4],29:[2,4],32:[2,4],34:[2,4],37:[2,4],46:[2,4],49:[2,4],51:[2,4]},{4:68,9:[2,2],21:[2,2],22:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],34:[2,2],37:[2,2],46:[2,2],49:[2,2],51:[2,2]},{1:[2,30],9:[2,30],21:[2,30],22:[2,30],25:[2,30],26:[2,30],27:[2,30],29:[2,30],32:[2,30],34:[2,30],37:[2,30],46:[2,30],47:[2,30],48:[2,30],49:[2,30],51:[2,30],52:[2,30]},{21:[1,69]},{4:70,9:[2,2],21:[2,2],22:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],34:[2,2],37:[2,2],46:[2,2],48:[2,2],49:[2,2],51:[2,2]},{6:71,9:[2,22],21:[2,22],22:[2,22],25:[2,22],26:[2,22],27:[1,27],29:[2,22],32:[2,22],34:[2,22],37:[2,22],46:[2,22],49:[2,22],51:[2,22]},{9:[2,36],21:[2,36],22:[2,36],25:[2,36],26:[2,36],27:[2,36],29:[2,36],32:[2,36],34:[2,36],37:[2,36],46:[2,36],49:[2,36],51:[2,36]},{8:73,9:[1,38],38:72},{1:[2,26],9:[2,26],21:[2,26],22:[2,26],25:[2,26],26:[2,26],27:[2,26],29:[2,26],32:[2,26],34:[2,26],37:[2,26],46:[2,26],47:[2,26],48:[2,26],49:[2,26],51:[2,26],52:[2,26]},{1:[2,44],9:[2,44],21:[2,44],22:[2,44],25:[2,44],26:[2,44],27:[2,44],29:[2,44],32:[2,44],34:[2,44],37:[2,44],46:[2,44],47:[2,44],48:[2,44],49:[2,44],51:[2,44],52:[2,44]},{8:78,9:[1,38],23:77,24:[1,33],42:[1,74],43:76,44:75},{6:79,9:[2,22],21:[2,22],22:[2,22],25:[2,22],26:[2,22],27:[1,27],29:[2,22],32:[2,22],34:[2,22],37:[2,22],46:[2,22],49:[2,22],51:[2,22]},{37:[1,80]},{5:3,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,81],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,16]},{49:[1,82]},{51:[1,83]},{9:[2,5],21:[2,5],22:[2,5],25:[2,5],26:[2,5],29:[2,5],32:[2,5],34:[2,5],37:[2,5],46:[2,5],49:[2,5],51:[2,5]},{5:3,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,84],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,16]},{5:3,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,85],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,16]},{1:[2,18],9:[2,18],21:[2,18],22:[2,18],25:[2,18],26:[2,18],27:[2,18],29:[2,18],32:[2,18],34:[2,18],37:[2,18],46:[2,18],48:[2,18],49:[2,18],51:[2,18]},{5:3,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,87],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],48:[1,86],49:[1,15],51:[1,16]},{4:88,9:[2,2],21:[2,2],22:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],34:[2,2],37:[2,2],46:[2,2],49:[2,2],51:[2,2]},{39:[1,90],42:[1,89]},{39:[2,32],42:[2,32]},{1:[2,41],9:[2,41],21:[2,41],22:[2,41],25:[2,41],26:[2,41],27:[2,41],29:[2,41],32:[2,41],34:[2,41],37:[2,41],46:[2,41],47:[2,41],48:[2,41],49:[2,41],51:[2,41],52:[2,41]},{39:[1,92],42:[1,91]},{39:[2,39],42:[2,39]},{39:[2,37],42:[2,37]},{39:[2,38],42:[2,38]},{4:93,9:[2,2],21:[2,2],22:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],34:[2,2],37:[2,2],46:[2,2],49:[2,2],51:[2,2]},{1:[2,31],9:[2,31],21:[2,31],22:[2,31],25:[2,31],26:[2,31],27:[2,31],29:[2,31],32:[2,31],34:[2,31],37:[2,31],46:[2,31],48:[2,31],49:[2,31],51:[2,31]},{49:[1,94]},{1:[2,50],9:[2,50],21:[2,50],22:[2,50],25:[2,50],26:[2,50],27:[2,50],29:[2,50],32:[2,50],34:[2,50],37:[2,50],46:[2,50],48:[2,50],49:[2,50],51:[2,50]},{9:[2,24],17:35,28:20,29:[1,25],35:95,36:[1,36]},{49:[1,96]},{51:[1,97]},{4:98,9:[2,2],21:[2,2],22:[2,2],25:[2,2],26:[2,2],29:[2,2],32:[2,2],34:[2,2],37:[2,2],46:[2,2],49:[2,2],51:[2,2]},{46:[1,99]},{5:3,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,100],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,16]},{9:[2,34],21:[2,34],22:[2,34],25:[2,34],26:[2,34],27:[2,34],29:[2,34],32:[2,34],34:[2,34],37:[2,34],46:[2,34],49:[2,34],51:[2,34]},{8:101,9:[1,38]},{1:[2,42],9:[2,42],21:[2,42],22:[2,42],25:[2,42],26:[2,42],27:[2,42],29:[2,42],32:[2,42],34:[2,42],37:[2,42],46:[2,42],47:[2,42],48:[2,42],49:[2,42],51:[2,42],52:[2,42]},{8:78,9:[1,38],23:77,24:[1,33],43:102},{5:3,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,103],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,16]},{1:[2,48],9:[2,48],21:[2,48],22:[2,48],25:[2,48],26:[2,48],27:[2,48],29:[2,48],32:[2,48],34:[2,48],37:[2,48],46:[2,48],48:[2,48],49:[2,48],51:[2,48]},{1:[2,51],9:[2,51],21:[2,51],22:[2,51],25:[2,51],26:[2,51],27:[2,51],29:[2,51],32:[2,51],34:[2,51],37:[2,51],46:[2,51],48:[2,51],49:[2,51],51:[2,51]},{1:[2,47],9:[2,47],21:[2,47],22:[2,47],25:[2,47],26:[2,47],27:[2,47],29:[2,47],32:[2,47],34:[2,47],37:[2,47],46:[2,47],48:[2,47],49:[2,47],51:[2,47]},{1:[2,49],9:[2,49],21:[2,49],22:[2,49],25:[2,49],26:[2,49],27:[2,49],29:[2,49],32:[2,49],34:[2,49],37:[2,49],46:[2,49],48:[2,49],49:[2,49],51:[2,49]},{5:3,9:[2,24],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,104],25:[1,23],26:[1,24],28:20,29:[1,25],32:[1,19],34:[1,21],37:[1,22],46:[1,18],49:[1,15],51:[1,16]},{1:[2,46],9:[2,46],21:[2,46],22:[2,46],25:[2,46],26:[2,46],27:[2,46],29:[2,46],32:[2,46],34:[2,46],37:[2,46],46:[2,46],48:[2,46],49:[2,46],51:[2,46]},{32:[1,105]},{39:[2,33],42:[2,33]},{39:[2,40],42:[2,40]},{34:[1,106]},{46:[1,107]},{1:[2,27],9:[2,27],21:[2,27],22:[2,27],25:[2,27],26:[2,27],27:[2,27],29:[2,27],32:[2,27],34:[2,27],37:[2,27],46:[2,27],48:[2,27],49:[2,27],51:[2,27]},{1:[2,28],9:[2,28],21:[2,28],22:[2,28],25:[2,28],26:[2,28],27:[2,28],29:[2,28],32:[2,28],34:[2,28],37:[2,28],46:[2,28],48:[2,28],49:[2,28],51:[2,28]},{1:[2,45],9:[2,45],21:[2,45],22:[2,45],25:[2,45],26:[2,45],27:[2,45],29:[2,45],32:[2,45],34:[2,45],37:[2,45],46:[2,45],48:[2,45],49:[2,45],51:[2,45]}],
defaultActions: {44:[2,25]},
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
    }

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
        _handle_error:
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
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
}};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
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
less:function (n) {
        this._input = this.match.slice(n) + this._input;
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
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/\n.*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
            this.yytext += match[0];
            this.match += match[0];
            this.yyleng = this.yytext.length;
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
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
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:/* whitespace: do nothing */
break;
case 1:/*{ return 'BLOCK_COMMENT'; }*/
break;
case 2:/*{ return 'LINE_COMMENT'; }*/
break;
case 3: return 24; 
break;
case 4: return 22; 
break;
case 5: return 27; 
break;
case 6: return 39; 
break;
case 7: return 30; 
break;
case 8: return 41; 
break;
case 9: return 42; 
break;
case 10: return 51; 
break;
case 11: return 46; 
break;
case 12: return 49; 
break;
case 13: return 32; 
break;
case 14: return 34; 
break;
case 15: return 37; 
break;
case 16: return 21; 
break;
case 17: return 29; 
break;
case 18: return 52; 
break;
case 19: return 47; 
break;
case 20: return 48; 
break;
case 21: return 50; 
break;
case 22: return 53; 
break;
case 23: return 25; 
break;
case 24: return 26; 
break;
case 25: return 36; 
break;
case 26: return 9; 
break;
case 27: return 'INVALID'; 
break;
}
};
lexer.rules = [/^(?:\s+)/,/^(?:\{[^\}]*\})/,/^(?:\/\/[^\n]*)/,/^(?:[0-9]+)/,/^(?:\*)/,/^(?:;)/,/^(?:,)/,/^(?:\.)/,/^(?:\()/,/^(?:\))/,/^(?:solange\b)/,/^(?:wenn\b)/,/^(?:wiederhole\b)/,/^(?:anweisung\b)/,/^(?:bedingung\b)/,/^(?:programm\b)/,/^(?:einfügen\b)/,/^(?:karol\b)/,/^(?:tue\b)/,/^(?:dann\b)/,/^(?:sonst\b)/,/^(?:mal\b)/,/^(?:immer\b)/,/^(?:wahr\b)/,/^(?:falsch\b)/,/^(?:nicht\b)/,/^(?:[A-Za-zäöüß_-][A-Za-zÄÖÜäöüß0-9_-]*)/,/^(?:.)/];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],"inclusive":true}};
return lexer;})()
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