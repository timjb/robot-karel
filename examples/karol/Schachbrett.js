function markierezeile() {
  while (nichtIstWand()) {
    markeSetzen();
    if (nichtIstWand()) {
      schritt();
    }
    if (nichtIstWand()) {
      schritt();
    }
  }
}
function nachlinks() {
  linksDrehen();
  if (nichtIstWand()) {
    schritt();
    linksDrehen();
  }
}
function nachrechts() {
  rechtsDrehen();
  if (nichtIstWand()) {
    schritt();
    rechtsDrehen();
  }
}
while (nichtIstWand()) {
  markierezeile();
  if (istSueden()) {
    nachlinks();
  } else {
    nachrechts();
  }
}
