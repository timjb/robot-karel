beforeEach(function() {
  this.addMatchers({
    toBeInstanceof: function(klass) {
      return this.actual instanceof klass
    },

    toHaveType: function(type) {
      return typeof this.actual === type
    },

    toBeContainedIn: function(arr) {
      return arr.indexOf(this.actual) !== -1
    }
  })
})
