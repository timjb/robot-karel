// http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking

// Führt eine Funktion n-mal aus
Number.prototype.mal = function(fn) {
  for (var i = 0; i < this; i++) {
    fn(i);
  }
}

// Erzeuge eine ganze Zufallszahl von einschließlich 0 bis ausschließlich n
function erzeugeZufallszahl(n) {
  return Math.floor(Math.random() * n);
}


/*
 * Hilfsfunktionen
 */

function geheInDieEcke() { // und schäme dich!
  (2).mal(function() {
    while (!istWand()) schritt();
    linksDrehen();
  });
}

function herumdrehen() {
  linksDrehen();
  linksDrehen();
}

// Sidesteps, wie im Sportunterricht
function sidestepLinks() {
  linksDrehen();
  schritt();
  rechtsDrehen();
}

function istVorneMarke() {
  schritt();
  var result = istMarke();
  schrittRueckwaerts();
  return result;
}

// Dreht Karel vier Mal, und führe nach jeder Drehung eine Funktion fn aus
function inJedeRichtung(fn) {
  (4).mal(function() {
    linksDrehen();
    fn();
  });
}


/*
 * Gitter aus Ziegeln zeichnen. Schaut ungefähr so aus:
 * 
 *  # # # # 
 * #########
 *  # # # # 
 * #########
 *  # # # # 
 * 
 * wobei alle # Felder mit einem Ziegel sind
 */

// Zeichnet einen Streifen (Linie von Ziegeln)
function zeichneStreifen() {
  while (!istWand()) {
    if (!istZiegel()) hinlegen();
    schritt();
  }
}

// Zeichne viele parallele Streifen mit einem Abstand von 1
function zeichneZebraStreifen() {
  aeussere_schleife: while (true) {
    zeichneStreifen();
    herumdrehen();
    zeichneStreifen();
    rechtsDrehen();
    for (var i = 0; i < 2; i++) {
      if (istWand()) break aeussere_schleife;
      schritt();
    }
    rechtsDrehen();
  }
}

function zeichneGitter() {
  geheInDieEcke(); // #1
  (2).mal(function() {
    sidestepLinks();
    zeichneZebraStreifen();
    herumdrehen();
  });
  geheInDieEcke(); // jetzt sind wir wieder in derselben Ecke wie bei #1
}


/*
 * Create Connections
 */


function zaehleMoeglichkeiten() {
  var result = 0;
  inJedeRichtung(function() {
    if (istMoeglichkeit()) result++;
  });
  return result;
}

function istMoeglichkeit() {
  return istZiegel(1);
}

function durchbrechen() {
  aufheben();
  inJedeRichtung(function() {
    if (istZiegel()) hinlegen();
  });
  (2).mal(function() {
    schritt();
    markeSetzen();
  });
}

// Dreht Karel wieder in die Richtung, aus der er gekommen ist und gibt
// true (= wahr) zurück. Gibt falsch zurück wenn Karel wieder am Startpunkt steht.
function zurueckDrehen() {
  for (var i = 0; i < 4; i++) {
    linksDrehen();
    if (!istWand() && !istZiegel() && istVorneMarke()) {
      return true;
    }
  }
  return false;
}

function baue3mMauer() {
  inJedeRichtung(function() {
    if (istZiegel(1) || istZiegel(2)) {
      while (!istZiegel(3)) {
        hinlegen();
      }
    }
  });
}

function zurueckGehen() {
  inJedeRichtung(function() {
    if (istZiegel()) hinlegen();
  });
  markeLoeschen();
  schritt();
  baue3mMauer();
  markeLoeschen();
  schritt();
  inJedeRichtung(function() {
    if (istZiegel()) aufheben();
  });
}

function bauen() {
  markeSetzen();
  while (true) {
    var anzahlMoeglichkeiten = zaehleMoeglichkeiten();
    if (anzahlMoeglichkeiten) {
      var drehungen = erzeugeZufallszahl(anzahlMoeglichkeiten) + 1;
      while (drehungen) {
        linksDrehen();
        if (istMoeglichkeit()) drehungen--;
      }
      durchbrechen();
    } else {
      if (!zurueckDrehen()) break;
      zurueckGehen();
    }
  }
}


/*
 * Hauptprogramm
 */

function hauptprogramm() {
  zeichneGitter();
  bauen();
  baue3mMauer();
}

hauptprogramm();
