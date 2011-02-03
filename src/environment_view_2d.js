function EnvironmentView2D(model) {
  this.model = model;
  
  var boundDelayRender = _.bind(this.delayRender, this);
  model.bind('change-field', boundDelayRender);
  model.bind('change-robot', boundDelayRender);
  model.bind('complete-change', _.bind(this.render, this));
  
  this.canvas = document.createElement('canvas');
}

EnvironmentView2D.prototype = new View();

EnvironmentView2D.prototype.render = function() {
  log('render 2d');
  
  var model = this.model;
  var ctx = this.canvas.getContext('2d');
  
  var GAP = this.GAP, GW = this.GW;
  
  ctx.save();
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  ctx.restore();
  
  function fill(x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(GAP+x*GW, GAP+y*GW, GW-GAP, GW-GAP);
    ctx.restore();
  }
  
  function letter(x, y, color, letter) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = (0.5*GW) + 'px Helvetica, Arial, sans-serif';
    ctx.fillText(letter, GAP + x*GW + 0.5*(GW-GAP), GAP + y*GW + 0.5*(GW-GAP));
    ctx.restore();
  }
  
  var position = model.position;
  var direction = model.direction;
  
  model.eachField(function(x, y, field) {
    var bg, fg;
    if (field.quader)      { bg = ENVIRONMENT_COLORS.quader.css; }
    else if (field.marke)  { bg = ENVIRONMENT_COLORS.marke.css;  fg = '#000'; }
    else if (field.ziegel) { bg = ENVIRONMENT_COLORS.ziegel.css; fg = '#fff'; }
    else                   { bg = '#fff'; fg = '#000'; }
    fill(x, y, bg);
    if (position.x == x && position.y == y) {
      var char;
      if (direction.isNorth())      char = '\u25b2';
      else if (direction.isSouth()) char = '\u25bc';
      else if (direction.isWest())  char = '\u25c4';
      else                          char = '\u25ba';
      letter(x, y, fg, char);
    }
    else if (field.ziegel) letter(x, y, fg, field.ziegel);
  });
};

EnvironmentView2D.prototype.updateSize = function(width, height) {
  var w = this.canvas.width  = width;
  var h = this.canvas.height = height;
  var m = this.model;
  var GAP = this.GAP = 4;
  this.GW = Math.min((w-GAP) / m.width, (h-GAP) / m.depth); // GridWidth
};

EnvironmentView2D.prototype.getElement = function() {
  return $(this.canvas);
};

EnvironmentView2D.prototype.initMouse = function() {
  var self = this;
  $(this.canvas)
    .mousedown(function(evt) {
      var rect = $(this).offset(),
          x = evt.clientX - rect.left,
          y = evt.clientY - rect.top;
      var position = new Position(
        Math.floor((x-self.GAP) / self.GW),
        Math.floor((y-self.GAP) / self.GW)
      );
      
      if (evt.which == 1) { // left click
        self.model.position = position;
        self.model.trigger('change-robot');
      } else {
        var field = self.model.getField(position);
        field.marke = !field.marke;
        self.model.trigger('change-field', position);
      }
    })
    .bind('contextmenu', false);
};

EnvironmentView2D.prototype.inject = function() {
  View.prototype.inject.apply(this, arguments);
  this.initMouse();
};
