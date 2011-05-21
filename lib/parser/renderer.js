(function(exports) {

var n      = require('./nodes')   || Karel.Parser
,   parser = (require('./parser') || { parser: karol }).parser

parser.yy = n

exports.render = function (code) {
  return parser.parse(code.toLowerCase()).render()
}


// Nodes
// -----

n.Block.prototype.render = function () {
  function renderStatement(s) { return '<li>'+s.render()+'</li>' }
  return '<ul>'
       + _.map(this.statements, renderStatement).join("\n")
       + '</ul>'
}

n.ConditionDefinition.prototype.render = function () {
  return '<h4>'+"Bedingung "+'<strong>'+this.identifier.render()+'</strong></h4>'
       + this.block.render()
}

n.FunctionDefinition.prototype.render = function () {
  return '<h4>'+"Anweisung "+'<strong>'+this.identifier.render()+'</strong></h4>'
       + this.block.render()
}

n.If.prototype.render = function () {
  return '<table>'
       +   '<thead>'
       +     '<tr>'
       +       '<th colspan="2">'
       +         '<strong>'+"wenn"+'</strong>'+" "+this.condition.render()
       +       '</th>'
       +     '</tr>'
       +     '<tr>'
       +       '<th><strong>' + "wahr"   + '</strong></th>'
       +       '<th><strong>' + "falsch" + '</strong></th>'
       +     '</tr>'
       +   '</thead>'
       +   '<tbody>'
       +     '<tr>'
       +       '<td>'+this.ifBlock.render()+'</td>'
       +       '<td>'+(this.elseBlock ? this.elseBlock.render() : '')+'</td>'
       +     '</tr>'
       +   '</tbody>'
       + '</table>'
}

n.While.prototype.render = function () {
  return '<strong>' + "solange" + '</strong>' + " " + this.condition.render()
       + '<div class="loop-body">' + this.block.render() + '</div>'
}

n.DoWhile.prototype.render = function () {
  return '<div class="loop-body">' + this.block.render() + '</div>'
       + '<strong>' + "solange" + '</strong>' + " " + this.condition.render()
}

n.WhileTrue.prototype.render = function () {
  return "wiederhole immer"
       + '<div class="loop-body">' + this.block.render() + '</div>'
}

n.For.prototype.render = function () {
  return "wiederhole " + this.times.compile() + '</strong>'+" mal"
       + '<div class="loop-body">' + this.block.render() + '</div>'
}

n.Number.prototype.compile = function () {
  return '<strong>' + this.value + '</strong>'
}

n.Identifier.prototype.render = function () {
  return this.toString("nicht ")
}

n.BoolStatement.prototype.render = function () {
  return '<strong>' + (this.value ? "wahr" : "falsch") + '</strong>'
}

n.Inversion.prototype.render = function () {
  return "nicht " + this.wrapped.render()
}

n.Import.prototype.render = function () {
  return "einfügen: " + this.identifier
}

n.FunctionInvocation.prototype.render = function () {
  return this.identifier.render() + this.parameters.render()
}

n.Parameters.prototype.render = function () {
  return this.argument ? "("+this.argument+")" : ""
}


})(exports || Karel.Parser)
