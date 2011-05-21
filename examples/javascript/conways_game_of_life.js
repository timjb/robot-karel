// http://en.wikipedia.org/wiki/Conway's_Game_of_Life

/*
 * Marks are used to indicate whether a field is "living" or not.
 * 
 * The algorithm used for each step:
 * 1. Add a ziegel underneath all marks
 * 2. For each field, count the living neighbors (those with a ziegel) and
 *    a) Let the field die (remove mark) if it has fewer than 2 or more than 3 living neighbors
 *    b) Let a dead field come to life (add mark) if it has exactly 3 living neighbors
 * 3. Remove all ziegels
 */

function herumdrehen() {
  linksDrehen();
  linksDrehen();
}

// Führt eine Funktion, nunja, für jedes Feld bis zur nächsten Wand aus
function fuerJedesFeldBisZurWand(fn) {
  while (true) {
    fn();
    if (istWand()) break;
    schritt();
  }
}

function zurWandGehen() {
  while (!istWand()) schritt();
}

// Führt eine Funktion für jedes Feld in der Welt aus
function fuerJedesFeld(fn) {
  while (true) {
    linksDrehen();
    fuerJedesFeldBisZurWand(fn);
    herumdrehen();
    zurWandGehen();
    linksDrehen();
    if (istWand()) break;
    schritt();
  }
  herumdrehen();
  zurWandGehen();
  herumdrehen();
}

// Führt eine Funktion für jede Himmelsrichtung ein Mal aus
function inJedeRichtung(fn) {
  for (var i = 0; i < 4; i++) {
    linksDrehen();
    fn();
  }
}

// Legt einen Ziegel dorthin, wo Karel momentan steht
// Karel steht danach umgekehrt herum
function hierZiegelLegen() {
  schritt();
  herumdrehen();
  hinlegen();
  schritt();
}

// Legt einen Ziegel dorthin, wo Karel momentan steht
// Kommt auch mit der Situation klar, wenn vor Karel eine Wand ist.
function hierZiegelLegenSicher() {
  if (istMarke()) {
    if (istWand()) {
      herumdrehen();
      hierZiegelLegen();
    } else {
      hierZiegelLegen();
      herumdrehen();
    }
  }
}

function zaehleLebendeNachbarn() {
  var result = 0;
  inJedeRichtung(function() {
    // count the horizontal or vertically neighbors:
    if (istZiegel()) result++;
    // count the diagonal neighbors:
    if (!istWand()) {
      schritt();
      linksDrehen();
      if (istZiegel()) result++;
      linksDrehen();
      schritt();
      herumdrehen();
    }
  });
  return result;
}

function lebeOderSterbe() {
  // Jetzt entscheidet's sich!
  var n = zaehleLebendeNachbarn();
  if (istMarke()) { // living
    if (n < 2 || n > 3) markeLoeschen(); // die
  } else {
    if (n == 3) markeSetzen(); // new cell
  }
}

function nachbarZiegelEntfernen() {
  inJedeRichtung(function() {
    if (istZiegel()) aufheben();
  });
}

function step() {
  fuerJedesFeld(hierZiegelLegenSicher);
  fuerJedesFeld(lebeOderSterbe);
  fuerJedesFeld(nachbarZiegelEntfernen);
}

function hauptprogramm() {
  //var interval = setInterval(step, 500);
  for (var i = 0; i < 2; i++) {
    zurWandGehen();
    linksDrehen();
  }
  step();
}

hauptprogramm();
