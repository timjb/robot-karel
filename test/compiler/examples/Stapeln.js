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
  while (!istWand()) {
    while (istZiegel()) {
      aufheben();
    }
    schritt();
  }
  schrittzurueck();
  while (!istLeer()) {
    hinlegen();
  }
  umdrehen();
  while (!istWand()) {
    schritt();
  }
  linksDrehen();
}
while (!istWand()) {
  reihestapeln();
  if (!istWand()) {
    schritt();
  }
}
reihestapeln();
