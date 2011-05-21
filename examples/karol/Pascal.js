function umdrehen() {
  schnell();
  linksDrehen();
  linksDrehen();
}
function schnellzurueck() {
  schnell();
  while (nichtIstWand()) {
    schritt();
  }
}
function istlinksmarke() {
  var result;
  schnell();
  result = false;
  linksDrehen();
  schritt();
  if (istMarke()) {
    result = true;
  }
  umdrehen();
  schritt();
  linksDrehen();
  return result;
}
function isthintenmarke() {
  var result;
  schnell();
  result = false;
  umdrehen();
  schritt();
  if (istMarke()) {
    result = true;
  }
  umdrehen();
  schritt();
  return result;
}
function setzen() {
  var result;
  schnell();
  result = false;
  if (isthintenmarke()) {
    if (!istlinksmarke()) {
      result = true;
    }
  }
  if (!isthintenmarke()) {
    if (istlinksmarke()) {
      result = true;
    }
  }
  return result;
}
while (nichtIstWand()) {
  schritt();
  linksDrehen();
  while (nichtIstWand()) {
    schritt();
    if (setzen()) {
      markeSetzen();
    }
  }
  umdrehen();
  schnellzurueck();
  linksDrehen();
}
