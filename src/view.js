function View() {}

View.prototype.inject = function(p) {
  p.append(this.getElement());
  this.dimensionsChanged();
};

View.prototype.dispose = function() {
  this.getElement().remove();
};

View.prototype.isVisible = function() {
  return !!this.getElement().parent().length;
};

View.prototype.dimensionsChanged = function() {
  var p = this.getElement().parent();
  if (p.length) this.updateSize(p.innerWidth(), p.innerHeight());
  if (this.render) this.render();
};

View.prototype.delayRender = function() {
  if (this.isVisible()) {
    clearTimeout(this.renderTimeout);
    this.renderTimeout = setTimeout(_.bind(this.render, this), 50);
  }
};
