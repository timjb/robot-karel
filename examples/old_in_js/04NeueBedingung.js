function zweiziegel() {
  var result;
  result = false;
  if (istZiegel()) {
    aufheben();
    if (istZiegel()) {
      aufheben();
      result = true;
      if (istZiegel()) {
        result = false;
      }
      hinlegen();
    }
    hinlegen();
  }
  return result;
}
if (zweiziegel()) {
  linksDrehen();
} else {
  rechtsDrehen();
}
