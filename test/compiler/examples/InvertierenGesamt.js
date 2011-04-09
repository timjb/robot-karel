function invertieren() {
  if (istZiegel()) {
    aufheben();
  } else {
    hinlegen();
  }
}
function einereihe() {
  while (!istWand()) {
    invertieren();
    schritt();
  }
}
function nachlinks() {
  linksDrehen();
  if (!istWand()) {
    invertieren();
    schritt();
    linksDrehen();
  }
}
function nachrechts() {
  rechtsDrehen();
  if (!istWand()) {
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
while (!istWand()) {
  einereihe();
  if (istSueden()) {
    nachlinks();
  } else {
    nachrechts();
  }
}
