function View() {}

View.prototype.inject = function(p) {
  p.appendChild(this.getElement());
  this.dimensionsChanged();
};

View.prototype.dispose = function() {
  var el = this.getElement(),
      p  = el.parentElement;
  if (p) p.removeChild(el);
};

View.prototype.isVisible = function() {
  return !!this.getElement().parentElement;
};

View.prototype.dimensionsChanged = function() {
  var p = this.getElement().parentElement;
  if (p) this.updateSize(p.getBoundingClientRect());
  if (this.render) this.render();
};

View.prototype.delayRender = function() {
  if (this.isVisible()) {
    clearTimeout(this.renderTimeout);
    this.renderTimeout = setTimeout(bind(this.render, this), 50);
  }
};
