function aufhebenreihe() {
  while (istZiegel()) {
    aufheben();
    schritt();
  }
}
function wenden() {
  if (istSueden()) {
    schritt();
    linksDrehen();
    schritt();
    linksDrehen();
  } else {
    schritt();
    rechtsDrehen();
    schritt();
    rechtsDrehen();
  }
}
while (istZiegel()) {
  aufhebenreihe();
  wenden();
}
