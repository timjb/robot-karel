function istfrei() {
  var result;
  result = true;
  if (istWand()) {
    result = false;
  }
  if (istZiegel()) {
    result = false;
  }
  return result;
}
while (istfrei()) {
  while (istfrei()) {
    hinlegen();
    schritt();
  }
  linksDrehen();
}
