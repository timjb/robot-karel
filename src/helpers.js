function $(id) {
  return document.getElementById(id);
}

function log() {
  if (window.console && typeof window.console.log == 'function') {
    window.console.log.apply(console, arguments);
  }
}

function clone(obj) {
  if (obj instanceof Array) {
    var n = [];
    for (var i = 0, l = obj.length; i < l; i++) {
      n[i] = clone(obj[i]);
    }
    return n;
  } else {
    if (typeof obj.clone == 'function') {
      obj = obj.clone();
    }
    return obj;
  }
}

function toArray(obj) {
  if (obj instanceof Array) return obj;
  if (obj != undefined && obj != null) return [obj];
  return [];
}

function errorFunction(msg) {
  var error = new Error(msg);
  return function() {
    throw error;
  };
}

function removeFromArray(arr, obj) {
  var index = arr.indexOf(obj);
  if (index != -1) arr.splice(index, 1);
}

function stop(obj) {
  clearTimeout(obj);
  clearInterval(obj);
  if (typeof obj.abort == 'function') obj.abort();
}

function capitalize(str) {
  return str.replace(/(?:\s|-|_)([a-z])/g, function(x, letter) {
    return letter.toUpperCase();
  });
}

var keys = {
  13: 'enter',
  38: 'up',
  40: 'down',
  37: 'left',
  39: 'right',
  27: 'esc',
  32: 'space',
  8:  'backspace',
  9:  'tab',
  46: 'delete',
  16: 'shift'
};

function getKey(evt) {
  var key = keys[evt.keyCode];
  if (!key) {
    key = String.fromCharCode(evt.keyCode);
    if (!evt.shiftKey) {
      key = key.toLowerCase();
    }
  }
  return key;
}

// Browser detection
// https://github.com/mootools/mootools-core/blob/601c6dd6a6a98d8635c1a8e6ee840b8b3f7022d1/Source/Browser/Browser.js
var browser = (function() {
  var ua = navigator.userAgent.toLowerCase();
  var UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0];
  return (UA[1] == 'version') ? UA[3] : UA[1];
})();

log('browser detected: ' + browser);

function getLineNumber(stack, n) {
  var self = getLineNumber;
  if (self.hasOwnProperty(browser)) {
    return self[browser](stack, n);
  } else {
    return null;
  }
}

getLineNumber.chrome = function(stack, n) {
  var lines = stack.split("\n");
  var line = lines[1+n];
  var match = line.match(/:(\d+):\d+\)?$/);
  if (match) {
    return Number(match[1]);
  } else {
    return null;
  }
};

getLineNumber.firefox = function(stack, n) {
  var lines = stack.split("\n");
  var line = lines[1+n];
  var match = line.match(/:(\d+)$/);
  if (match) {
    return Number(match[1]);
  } else {
    return null;
  }
};

getLineNumber.possible = function() {
  return this.hasOwnProperty(browser);
};
