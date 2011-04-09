%start root

%%


root
  : block { return $$ = $1.dontIndent(); }
  ;

block
  : statement { $$ = (new yy.Block()).addStatement($1); }
  | block statement { $$ = $1.addStatement($2); }
  ;

identifier
  : IDENTIFIER { $$ = new yy.Identifier($1); }
  ;

statement
  : while
  | whileTrue
  | doWhile
  | for
  | if
  | functionDefinition
  | functionInvocation
  | conditionDefinition
  | program
  | bool
  ;

number
  : NUMBER { $$ = parseInt($1, 10); }
  ;

optNumber
  : 
  | number
  ;

bool
  : WAHR   { $$ = new yy.Bool(true); }
  | FALSCH { $$ = new yy.Bool(false); }
  ;

optSemicolon
  : 
  | SEMICOLON
  ;

optKarolPrefix
  : 
  | KAROL DOT
  ;

functionInvocation
  : optKarolPrefix identifier optArgumentList optSemicolon { $$ = new yy.FunctionInvocation($2, $3); }
  ;

functionDefinition
  : ANWEISUNG identifier block STAR ANWEISUNG { $$ = new yy.FunctionDefinition($2, $3); }
  ;

conditionDefinition
  : BEDINGUNG identifier block STAR BEDINGUNG { $$ = new yy.ConditionDefinition($2, $3); }
  ;

condition
  : identifier { $$ = new yy.Condition($1, false); }
  | NICHT identifier { $$ = new yy.Condition($2, true); }
  ;

program
  : PROGRAMM block STAR PROGRAMM { $$ = $2.dontIndent(); }
  ;

argumentList
  : ( OptNumber ) { $$ = new yy.ArgumentList($2); }
  ;

optArgumentList
  : { $$ = new yy.ArgumentList(); }
  | argumentList
  ;

if
  : WENN condition DANN block SONST block STAR WENN { $$ = new yy.If($2, $4, $6); }
  | WENN condition DANN block STAR WENN { $$ = new yy.If($2, $4, null); }
  ;

for
  : WIEDERHOLE number MAL block STAR WIEDERHOLE { $$ = new yy.For($2, $4); }
  ;

while
  : WIEDERHOLE SOLANGE condition block STAR WIEDERHOLE { $$ = new yy.While($3, $4); }
  | SOLANGE condition TUE block STAR SOLANGE { $$ = new yy.While($2, $4); }
  ;

whileTrue
  : WIEDERHOLE IMMER block STAR WIEDERHOLE { $$ = new yy.WhileTrue($3); }
  ;

doWhile
  : WIEDERHOLE block STAR WIEDERHOLE SOLANGE condition { $$ = new yy.DoWhile($6, $2); }
  ;
