while (istZiegel()) {
  aufheben();
  linksDrehen();
}
for (var i = 0; i < 3; i++) {
  linksDrehen();
  while (istZiegel()) {
    aufheben();
  }
}
linksDrehen();
