function Field() {
  this.ziegel = 0;
  this.marke = false;
  this.quader = false;
}

Field.prototype.clone = function() {
  var f = new Field();
  f.ziegel = this.ziegel;
  f.marke = this.marke;
  f.quader = this.quader;
  return f;
};
