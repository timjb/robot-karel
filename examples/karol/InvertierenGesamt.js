function invertieren() {
  if (istZiegel()) {
    aufheben();
  } else {
    hinlegen();
  }
}
function einereihe() {
  while (nichtIstWand()) {
    invertieren();
    schritt();
  }
}
function nachlinks() {
  linksDrehen();
  if (nichtIstWand()) {
    invertieren();
    schritt();
    linksDrehen();
  }
}
function nachrechts() {
  rechtsDrehen();
  if (nichtIstWand()) {
    invertieren();
    schritt();
    rechtsDrehen();
  }
}
function ursprung() {
  schritt();
  linksDrehen();
  linksDrehen();
  invertieren();
  schritt();
  linksDrehen();
  linksDrehen();
}
ursprung();
while (nichtIstWand()) {
  einereihe();
  if (istSueden()) {
    nachlinks();
  } else {
    nachrechts();
  }
}
