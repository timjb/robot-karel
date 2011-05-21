%%

\s+            /* whitespace: do nothing */
"{"[^\}]*"}"   /*{ return 'BLOCK_COMMENT'; }*/
"//"[^\n]*     /*{ return 'LINE_COMMENT'; }*/
[0-9]+         { return 'NUMBER'; }

"*"            { return 'STAR'; }
";"            { return 'SEMICOLON'; }
"."            { return 'DOT'; }
"("            { return 'LPAREN'; }
")"            { return 'RPAREN'; }

"solange"\b    { return 'SOLANGE'; }
"wenn"\b       { return 'WENN'; }
"wiederhole"\b { return 'WIEDERHOLE'; }
"anweisung"\b  { return 'ANWEISUNG'; }
"bedingung"\b  { return 'BEDINGUNG'; }
"programm"\b   { return 'PROGRAMM'; }
"einfügen"\b   { return 'EINFUEGEN'; }
"karol"\b      { return 'KAROL'; }
"tue"\b        { return 'TUE'; }
"dann"\b       { return 'DANN'; }
"sonst"\b      { return 'SONST'; }
"mal"\b        { return 'MAL'; }
"immer"\b      { return 'IMMER'; }
"wahr"\b       { return 'WAHR'; }
"falsch"\b     { return 'FALSCH'; }
"nicht"\b      { return 'NICHT'; }

[A-Za-zäöüß_-][A-Za-zÄÖÜäöüß0-9_-]* { return 'IDENTIFIER'; }

.              { return 'INVALID'; }
