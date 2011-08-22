function umdrehen() {
  schnell();
  linksDrehen();
  linksDrehen();
}
function schrittzurueck() {
  schnell();
  umdrehen();
  schritt();
  umdrehen();
}
function reihestapeln() {
  linksDrehen();
  while (nichtIstWand()) {
    while (istZiegel()) {
      aufheben();
    }
    schritt();
  }
  schrittzurueck();
  while (nichtIstLeer()) {
    hinlegen();
  }
  umdrehen();
  while (nichtIstWand()) {
    schritt();
  }
  linksDrehen();
}
while (nichtIstWand()) {
  reihestapeln();
  if (nichtIstWand()) {
    schritt();
  }
}
reihestapeln();
