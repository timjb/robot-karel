beforeEach(function() {
  this.addMatchers({
    toBeInstanceof: function(klass) {
      return this.actual instanceof klass
    },

    toEquals: function(expected) { // note the 's' at the end
      return this.actual.equals(expected)
    },

    toHaveType: function(type) {
      return typeof this.actual === type
    },

    toBeContainedIn: function(arr) {
      return arr.indexOf(this.actual) !== -1
    },

    toHavePosition: function(position) {
      return this.actual.get('position').equals(position)
    },

    toHaveDirection: function(direction) {
      return this.actual.get('direction').equals(direction)
    }
  })
})
