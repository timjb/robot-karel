%%

\s+            /* whitespace: do nothing */
[0-9]+         { return 'NUMBER'; }
"{"[^\}]*"}"   /*{ return 'BLOCK_COMMENT'; }*/
"//"[^\n]*\n   /*{ return 'LINE_COMMENT'; }*/

"*"            { return 'STAR'; }
";"            { return 'SEMICOLON'; }
"."            { return 'DOT'; }
"("            { return '('; }
")"            { return ')'; }

"solange"\b    { return 'SOLANGE'; }
"wenn"\b       { return 'WENN'; }
"wiederhole"\b { return 'WIEDERHOLE'; }
"anweisung"\b  { return 'ANWEISUNG'; }
"bedingung"\b  { return 'BEDINGUNG'; }
"programm"\b   { return 'PROGRAMM'; }
"karol"\b      { return 'KAROL'; }
"tue"\b        { return 'TUE'; }
"dann"\b       { return 'DANN'; }
"sonst"\b      { return 'SONST'; }
"mal"\b        { return 'MAL'; }
"immer"\b      { return 'IMMER'; }
"wahr"\b       { return 'WAHR'; }
"falsch"\b     { return 'FALSCH'; }
"nicht"\b      { return 'NICHT'; }

[A-Za-z_-][A-Za-z0-9_-]* { return 'IDENTIFIER'; }

.              { return 'INVALID'; }
