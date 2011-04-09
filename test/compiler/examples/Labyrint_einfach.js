function umdrehen() {
  schnell();
  linksDrehen();
  linksDrehen();
}
function reihehoch() {
  schritt();
  schritt();
  rechtsDrehen();
}
function istlinksziegel() {
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
function istrechtsziegel() {
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
function istlinksziegelundfrei() {
  var result;
  result = false;
  if (istlinksziegel()) {
    if (!istZiegel()) {
      result = true;
    }
  }
  return result;
}
function istrechtsziegelundfrei() {
  var result;
  result = false;
  if (istrechtsziegel()) {
    if (!istZiegel()) {
      result = true;
    }
  }
  return result;
}
while (!istOsten()) {
  linksDrehen();
}
while (!istMarke()) {
  while (istlinksziegelundfrei()) {
    schritt();
  }
  if (istlinksziegel()) {
    umdrehen();
    while (istrechtsziegelundfrei()) {
      schritt();
    }
    if (istrechtsziegel()) {
      ton();
      beenden();
    } else {
      rechtsDrehen();
      reihehoch();
    }
  } else {
    linksDrehen();
    reihehoch();
  }
}
linksDrehen();
