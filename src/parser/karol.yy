%start root

%%


root
  : block { return $$ = $1.setToplevel(); }
  ;

block
  : { $$ = new yy.Block(); }
  | block statement optSemicolon { $$ = $1.addStatement($2); }
  ;

forceBlock
  : statement optSemicolon { $$ = (new yy.Block()).addStatement($1); }
  | forceBlock statement optSemicolon { $$ = $1.addStatement($2); }
  ;

identifier
  : IDENTIFIER { $$ = new yy.Identifier($1); }
  ;

statement
  : while
  | import
  | whileTrue
  | doWhile
  | for
  | if
  | functionDefinition
  | functionInvocation
  | conditionDefinition
  | program
  | boolStatement
  ;

import
  : EINFUEGEN identifier STAR EINFUEGEN { $$ = new yy.Import($2).l(@$); }
  ;

number
  : NUMBER { $$ = new yy.Number($1); }
  ;

optNumber
  : 
  | number
  ;

boolStatement
  : WAHR   { $$ = new yy.BoolStatement(true).l(@$); }
  | FALSCH { $$ = new yy.BoolStatement(false).l(@$); }
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
  : optKarolPrefix identifier optParameters { $$ = new yy.FunctionInvocation($2, $3).l(@$); }
  ;

functionDefinition
  : ANWEISUNG identifier optFormalParameters optSemicolon block STAR ANWEISUNG { $$ = new yy.Definition($2, $3, $5, false).l(@$); }
  ;

conditionDefinition
  : BEDINGUNG identifier optFormalParameters optSemicolon block STAR BEDINGUNG { $$ = new yy.Definition($2, $3, $5, true).l(@$); }
  ;

condition
  : functionInvocation { $$ = $1.setInline(); }
  | NICHT functionInvocation { $$ = new yy.Inversion($2.setInline()).l(@$); }
  ;

program
  : PROGRAMM block STAR PROGRAMM { $$ = $2.setToplevel(); }
  ;

formalParameters
  : LPAREN identifier RPAREN { $$ = new yy.FormalParameters($2); }
  ;

optFormalParameters
  : { $$ = new yy.FormalParameters(); }
  | formalParameters
  ;

parameters
  : LPAREN optNumber  RPAREN { $$ = new yy.Parameters($2); }
  | LPAREN identifier RPAREN { $$ = new yy.Parameters($2); }
  ;

optParameters
  : { $$ = new yy.Parameters(); }
  | parameters
  ;

if
  : WENN condition DANN block SONST block STAR WENN { $$ = new yy.If($2, $4, $6).l(@$); }
  | WENN condition DANN block STAR WENN { $$ = new yy.If($2, $4, null).l(@$); }
  ;

for
  : WIEDERHOLE number MAL block STAR WIEDERHOLE { $$ = new yy.For($2, $4).l(@$); }
  ;

while
  : WIEDERHOLE SOLANGE condition block STAR WIEDERHOLE { $$ = new yy.While($3, $4).l(@$); }
  | SOLANGE condition TUE block STAR SOLANGE { $$ = new yy.While($2, $4).l(@$); }
  ;

whileTrue
  : WIEDERHOLE IMMER block STAR WIEDERHOLE { $$ = new yy.WhileTrue($3).l(@$); }
  ;

doWhile
  : WIEDERHOLE forceBlock STAR WIEDERHOLE SOLANGE condition { $$ = new yy.DoWhile($6, $2).l(@$); }
  ;
