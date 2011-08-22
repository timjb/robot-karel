function pfeilersetzen() {
  if (istZiegel()) {
    aufheben();
    pfeilersetzen();
  } else {
    linksDrehen();
    linksDrehen();
  }
  hinlegen();
}
pfeilersetzen();
aufheben();
