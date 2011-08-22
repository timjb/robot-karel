function umdrehen() {
  schnell();
  linksDrehen();
  linksDrehen();
}
function schrittRueckwaerts() {
  schnell();
  umdrehen();
  schritt();
  umdrehen();
}
function hintenhinlegen() {
  schnell();
  umdrehen();
  hinlegen();
  umdrehen();
}
function schrittlinks() {
  schnell();
  linksDrehen();
  schritt();
  rechtsDrehen();
}
function schrittrechts() {
  schnell();
  rechtsDrehen();
  schritt();
  linksDrehen();
}
function schaunachsueden() {
  while (!istSueden()) {
    linksDrehen();
  }
}
function istziegellinks() {
  var result;
  schnell();
  result = false;
  linksDrehen();
  if (istZiegel()) {
    result = true;
  }
  rechtsDrehen();
  return result;
}
function istziegelrechts() {
  var result;
  schnell();
  result = false;
  rechtsDrehen();
  if (istZiegel()) {
    result = true;
  }
  linksDrehen();
  return result;
}
function istwandlinks() {
  var result;
  schnell();
  result = false;
  linksDrehen();
  if (istWand()) {
    result = true;
  }
  rechtsDrehen();
  return result;
}
function istwandrechts() {
  var result;
  schnell();
  result = false;
  rechtsDrehen();
  if (istWand()) {
    result = true;
  }
  linksDrehen();
  return result;
}
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
function istrundumfrei() {
  var result;
  schnell();
  result = true;
  if (!istfrei()) {
    result = false;
  }
  linksDrehen();
  if (!istfrei()) {
    result = false;
  }
  linksDrehen();
  if (!istfrei()) {
    result = false;
  }
  linksDrehen();
  if (!istfrei()) {
    result = false;
  }
  linksDrehen();
  return result;
}
