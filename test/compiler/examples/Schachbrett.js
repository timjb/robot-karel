function markierezeile() {
  while (!istWand()) {
    markeSetzen();
    if (!istWand()) {
      schritt();
    }
    if (!istWand()) {
      schritt();
    }
  }
}
function nachlinks() {
  linksDrehen();
  if (!istWand()) {
    schritt();
    linksDrehen();
  }
}
function nachrechts() {
  rechtsDrehen();
  if (!istWand()) {
    schritt();
    rechtsDrehen();
  }
}
while (!istWand()) {
  markierezeile();
  if (istSueden()) {
    nachlinks();
  } else {
    nachrechts();
  }
}
