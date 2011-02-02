function EnvironmentView2D(model) {
  this.model = model;
  
  var boundDelayRender = bind(this.delayRender, this);
  model.addEvent('change-field', boundDelayRender);
  model.addEvent('change-robot', boundDelayRender);
  model.addEvent('complete-change', bind(this.render, this));
  
  this.canvas = document.createElement('canvas');
  this.initMouse();
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

EnvironmentView2D.prototype.updateSize = function(dimensions) {
  var w = this.canvas.width  = dimensions.width;
  var h = this.canvas.height = dimensions.height;
  var m = this.model;
  var GAP = this.GAP = 4;
  this.GW = Math.min((w-GAP) / m.width, (h-GAP) / m.depth); // GridWidth
};

EnvironmentView2D.prototype.getElement = function() {
  return this.canvas;
};

EnvironmentView2D.prototype.initMouse = function() {
  addEvent(this.canvas, 'mousedown', bind(function(evt) {
    var rect = this.canvas.getBoundingClientRect(),
        x = evt.clientX - rect.left,
        y = evt.clientY - rect.top;
    var position = new Position(
      Math.floor((x-this.GAP) / this.GW),
      Math.floor((y-this.GAP) / this.GW)
    );
    
    if (evt.button == 0) { // left click
      this.model.position = position;
      this.model._fireEvent('change-robot');
    } else {
      var field = this.model.getField(position);
      field.marke = !field.marke;
      this.model._fireEvent('change-field', position);
    }
  }, this));
  addEvent(this.canvas, 'contextmenu', function(evt) {
    evt.preventDefault();
    return false;
  });
};
