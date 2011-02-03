function AppController() {
  this.initModelAndView();
  this.initEditor();
  this.loadExampleCode();
  this.initButtons();
  this.initKeyboard();
  this.addEvents();
}

AppController.prototype.initModelAndView = function() {
  this.environment = new Environment(
    parseInt($('#width' ).val(), 10),
    parseInt($('#depth' ).val(), 10),
    parseInt($('#height').val(), 10)
  );
  var self = this;
  this.environment.bind('line', function(lineNumber) {
    self.editor.gotoLine(lineNumber);
  });
  
  $('#environment').innerHTML = '';
  this.environmentView3D = new EnvironmentView3D(this.environment);
  this.environmentView2D = new EnvironmentView2D(this.environment);
  this.updateViewPrecedence();
};

AppController.prototype.updateViewPrecedence = function() {
  var environmentEl = $('#environment');
  var d3 = this.environmentView3D,
      d2 = this.environmentView2D;
  if ($('input[name=view-select]:checked').val() == '3d') {
    d2.dispose();
    d3.inject(environmentEl);
  } else {
    d3.dispose();
    d2.inject(environmentEl);
  }
};

AppController.prototype.initEditor = function() {
  var e = this.editor = ace.edit('editor');
  var s = e.getSession();
  s.setMode(new (require('ace/mode/javascript').Mode));
  s.setTabSize(2);
  s.setUseSoftTabs(true);
  e.setShowPrintMargin(false);
};

AppController.prototype.loadExampleCode = function() {
  var s = this.editor.getSession();
  $.ajax({
    url: 'examples/conways_game_of_life.js',
    dataType: 'text',
    success: _.bind(s.setValue, s)
  });
};

AppController.prototype.sendCommand = function(cmd) {
  if (!(cmd instanceof Array)) cmd = [cmd];
  var env = this.environment;
  try {
    each(cmd, function(c) { env[c](); });
  } catch (exc) {
    alert(exc);
  }
};

AppController.prototype.initButtons = function() {
  var self = this;
  
  $('#run-button').click(_.bind(this.run, this));
  $('#replay-button').click(_.bind(this.replay, this));
  $('#reset-button').click(_.bind(this.reset, this));
  $('input[name=view-select]').change(_.bind(this.updateViewPrecedence, this));
  $('#new-button, #new-cancel-button').click(_.bind(this.toggleNewPane, this));
  $('#new-apply-button' ).click(function() {
    self.initModelAndView();
    self.toggleNewPane();
  });
  
  _.each(['links-drehen', 'schritt', 'rechts-drehen', 'hinlegen', 'aufheben', 'marke', 'quader', 'entfernen'], function(name) {
    var button = $('#'+name);
    var command = capitalize(name);
    button.click(function() {
      self.sendCommand(command);
    });
  });
};

AppController.prototype.initKeyboard = function() {
  var self = this;
  var actions = {
    left:  'linksDrehen',
    right: 'rechtsDrehen',
    up:    'schritt',
    down:  ['linksDrehen', 'linksDrehen', 'schritt', 'linksDrehen', 'linksDrehen'],
    space: 'marke',
    h:     'hinlegen',
    enter: 'hinlegen',
    a:     'aufheben',
    backspace: 'aufheben',
    m:     'marke',
    q:     'quader',
    e:     'entfernen',
    'delete': 'entfernen'
  };
  $(document).keydown(function(evt) {
    if (!self.editor.focus) {
      var key = getKey(evt);
      if (actions.hasOwnProperty(key)) {
        self.sendCommand(actions[key]);
      }
    }
  });
};

AppController.prototype.addEvents = function() {
  var self = this;
  function resize() {
    self.environmentView2D.dimensionsChanged();
    self.environmentView3D.dimensionsChanged();
  }
  
  var resizeTimeout = null;
  $(window).resize(function() {
    window.clearTimeout(resizeTimeout);
    window.setTimeout(resize, 25);
  });
};

AppController.prototype.run = function() {
  this.environment.run(this.editor.getSession().getValue());
};

AppController.prototype.replay = function() {
  this.environment.replay();
};

AppController.prototype.reset = function() {
  this.environment.reset();
};

AppController.prototype.toggleNewPane = function() {
  var el = $('#new-pane');
  var classRegex = /(^|\s)visible(\s|$)/
  if (el.className.match(classRegex)) {
    el.className = el.className.replace(classRegex, ' ');
  } else {
    el.className += ' visible';
  }
};
