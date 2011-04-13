function require (path) {
    // not EXACTLY like how node does it but more appropriate for the browser
    var mod
        = require.modules[path]
        || require.modules[path + '.js']
        || require.modules[path + '/index']
        || require.modules[path + '/index.js']
    ;
    
    if (!mod) throw new Error("Cannot find module '" + path + "'");
    return mod._cached ? mod._cached : mod();
}

var _browserifyRequire = require; // scoping >_<

require.paths = [];
require.modules = {};

require.fromFile = function (filename, path) {
    // require a file with respect to a path
    var resolved = _browserifyRequire.resolve(filename, path);
    return _browserifyRequire(resolved)
};

require.resolve = function (basefile, file) {
    if (!file.match(/^[\.\/]/)) return file;
    if (file.match(/^\//)) return file;
    
    var basedir = basefile.match(/^[\.\/]/)
        ? basefile.replace(/[^\/]+$/, '')
        : basefile
    ;
    if (basedir === '') {
        basedir = '.';
    }
    
    // normalize file path.
    var r1 = /[^\/.]+\/\.\./g;
    var r2 = /\/{2,}/g;
    for(
        var norm = file;
        norm.match(r1) != null || norm.match(r2) != null;
        norm = norm.replace(r1, '').replace(r2, '/')
    );
    
    while (norm.match(/^\.\.\//)) {
        if (basedir === '/' || basedir === '') {
            throw new Error("Couldn't resolve path"
                + "'" + file + "' with respect to filename '" + basefile + "': "
                + "file can't resolve past base"
            );
        }
        norm = norm.replace(/^\.\.\//, '');
        basedir = basedir.replace(/[^\/]+\/$/, '');
    }
    
    var n = basedir.match(/\//)
        ? basedir.replace(/[^\/]+$/,'') + norm
        : norm.replace(/^\.\//, basedir + '/');
    return n.replace(/\/.\//, '/');
};
if (typeof process === 'undefined') process = {
    nextTick : function (fn) {
        setTimeout(fn, 0);
    },
    title : 'browser'
};

// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
// -- tlrobinson Tom Robinson Copyright (C) 2009-2010 MIT License (Narwhal Project)
// -- dantman Daniel Friesen Copyright(C) 2010 XXX No License Specified
// -- fschaefer Florian Schäfer Copyright (C) 2010 MIT License

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

(function (undefined) {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-050.pdf
 *
 * NOTE: this is a draft, and as such, the URL is subject to change.  If the
 * link is broken, check in the parent directory for the latest TC39 PDF.
 * http://www.ecma-international.org/publications/files/drafts/
 *
 * Previous ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf
 * This is a broken link to the previous draft of ES5 on which most of the
 * numbered specification references and quotes herein were taken.  Updating
 * these references and quotes to reflect the new document would be a welcome
 * volunteer project.
 * 
 * @module
 */

/*whatsupdoc*/

// this is often accessed, so avoid multiple dereference costs universally
var has = Object.prototype.hasOwnProperty;

//
// Array
// =====
//

// ES5 15.4.3.2 
if (!Array.isArray) {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) == "[object Array]";
    };
}

// ES5 15.4.4.18
if (!Array.prototype.forEach) {
    Array.prototype.forEach =  function(block, thisObject) {
        var len = this.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                block.call(thisObject, this[i], i, this);
            }
        }
    };
}

// ES5 15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
          throw new TypeError();

        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                res[i] = fun.call(thisp, this[i], i, this);
        }

        return res;
    };
}

// ES5 15.4.4.20
if (!Array.prototype.filter) {
    Array.prototype.filter = function (block /*, thisp */) {
        var values = [];
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++)
            if (block.call(thisp, this[i]))
                values.push(this[i]);
        return values;
    };
}

// ES5 15.4.4.16
if (!Array.prototype.every) {
    Array.prototype.every = function (block /*, thisp */) {
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++)
            if (!block.call(thisp, this[i]))
                return false;
        return true;
    };
}

// ES5 15.4.4.17
if (!Array.prototype.some) {
    Array.prototype.some = function (block /*, thisp */) {
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++)
            if (block.call(thisp, this[i]))
                return true;
        return false;
    };
}

// ES5 15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(fun /*, initial*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        // no value to return if no initial value and an empty array
        if (len == 0 && arguments.length == 1)
            throw new TypeError();

        var i = 0;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= len)
                    throw new TypeError();
            } while (true);
        }

        for (; i < len; i++) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }

        return rv;
    };
}

// ES5 15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function(fun /*, initial*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        // no value to return if no initial value, empty array
        if (len == 0 && arguments.length == 1)
            throw new TypeError();

        var i = len - 1;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0)
                    throw new TypeError();
            } while (true);
        }

        for (; i >= 0; i--) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }

        return rv;
    };
}

// ES5 15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (value /*, fromIndex */ ) {
        var length = this.length;
        if (!length)
            return -1;
        var i = arguments[1] || 0;
        if (i >= length)
            return -1;
        if (i < 0)
            i += length;
        for (; i < length; i++) {
            if (!has.call(this, i))
                continue;
            if (value === this[i])
                return i;
        }
        return -1;
    };
}

// ES5 15.4.4.15
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (value /*, fromIndex */) {
        var length = this.length;
        if (!length)
            return -1;
        var i = arguments[1] || length;
        if (i < 0)
            i += length;
        i = Math.min(i, length - 1);
        for (; i >= 0; i--) {
            if (!has.call(this, i))
                continue;
            if (value === this[i])
                return i;
        }
        return -1;
    };
}

//
// Object
// ======
// 

// ES5 15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/kriskowal/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    Object.getPrototypeOf = function (object) {
        return object.__proto__ || object.constructor.prototype;
        // or undefined if not available in this engine
    };
}

// ES5 15.2.3.3
if (!Object.getOwnPropertyDescriptor) {
    Object.getOwnPropertyDescriptor = function (object) {
        if (typeof object !== "object" && typeof object !== "function" || object === null)
            throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object");

        return has.call(object, property) ? {
            value: object[property],
            enumerable: true,
            configurable: true,
            writeable: true
        } : undefined;
    };
}

// ES5 15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function (object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5 
if (!Object.create) {
    Object.create = function(prototype, properties) {
        var object;
        if (prototype === null) {
            object = {"__proto__": null};
        } else {
            if (typeof prototype != "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
        }
        if (typeof properties !== "undefined")
            Object.defineProperties(object, properties);
        return object;
    };
}

// ES5 15.2.3.6
if (!Object.defineProperty) {
    Object.defineProperty = function(object, property, descriptor) {
        if (typeof descriptor == "object" && object.__defineGetter__) {
            if (has.call(descriptor, "value")) {
                if (!object.__lookupGetter__(property) && !object.__lookupSetter__(property))
                    // data property defined and no pre-existing accessors
                    object[property] = descriptor.value;
                if (has.call(descriptor, "get") || has.call(descriptor, "set"))
                    // descriptor has a value property but accessor already exists
                    throw new TypeError("Object doesn't support this action");
            }
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(has.call(descriptor, "writable") ? descriptor.writable : true) ||
                !(has.call(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(has.call(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */
            else if (typeof descriptor.get == "function")
                object.__defineGetter__(property, descriptor.get);
            if (typeof descriptor.set == "function")
                object.__defineSetter__(property, descriptor.set);
        }
        return object;
    };
}

// ES5 15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function(object, properties) {
        for (var property in properties) {
            if (has.call(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}

// ES5 15.2.3.8
if (!Object.seal) {
    Object.seal = function (object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
if (!Object.freeze) {
    Object.freeze = function (object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function (freeze) {
        return function (object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freeze(object);
            }
        };
    })(Object.freeze);
}

// ES5 15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function (object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function (object) {
        return false;
    };
}

// ES5 15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function (object) {
        return false;
    };
}

// ES5 15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function (object) {
        return true;
    };
}

// ES5 15.2.3.14
// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
if (!Object.keys) {

    var hasDontEnumBug = true,
        dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null})
        hasDontEnumBug = false;

    Object.keys = function (object) {

        if (
            typeof object !== "object" && typeof object !== "function"
            || object === null
        )
            throw new TypeError("Object.keys called on a non-object");

        var keys = [];
        for (var name in object) {
            if (has.call(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (has.call(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }

        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// Format a Date object as a string according to a subset of the ISO-8601 standard.
// Useful in Atom, among other things.
if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function() {
        return (
            this.getUTCFullYear() + "-" +
            (this.getUTCMonth() + 1) + "-" +
            this.getUTCDate() + "T" +
            this.getUTCHours() + ":" +
            this.getUTCMinutes() + ":" +
            this.getUTCSeconds() + "Z"
        ); 
    }
}

// ES5 15.9.4.4
if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    };
}

// ES5 15.9.5.44
if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function (key) {
        // This function provides a String representation of a Date object for
        // use by JSON.stringify (15.12.3). When the toJSON method is called
        // with argument key, the following steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ToPrimitive(O, hint Number).
        // 3. If tv is a Number and is not finite, return null.
        // XXX
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof this.toISOString != "function")
            throw new TypeError();
        // 6. Return the result of calling the [[Call]] internal method of
        // toISO with O as the this value and an empty argument list.
        return this.toISOString();

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// 15.9.4.2 Date.parse (string)
// 15.9.1.15 Date Time String Format
// Date.parse
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (isNaN(Date.parse("T00:00"))) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        var Date = function(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length === 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format
        var isoDateExpression = new RegExp("^" +
            "(?:" + // optional year-month-day
                "(" + // year capture
                    "(?:[+-]\\d\\d)?" + // 15.9.1.15.1 Extended years
                    "\\d\\d\\d\\d" + // four-digit year
                ")" +
                "(?:-" + // optional month-day
                    "(\\d\\d)" + // month capture
                    "(?:-" + // optional day
                        "(\\d\\d)" + // day capture
                    ")?" +
                ")?" +
            ")?" + 
            "(?:T" + // hour:minute:second.subsecond
                "(\\d\\d)" + // hour capture
                ":(\\d\\d)" + // minute capture
                "(?::" + // optional :second.subsecond
                    "(\\d\\d)" + // second capture
                    "(?:\\.(\\d\\d\\d))?" + // milisecond capture
                ")?" +
            ")?" +
            "(?:" + // time zone
                "Z|" + // UTC capture
                "([+-])(\\d\\d):(\\d\\d)" + // timezone offset
                // capture sign, hour, minute
            ")?" +
        "$");

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate)
            Date[key] = NativeDate[key];

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle the ISO dates we use
        // TODO review specification to ascertain whether it is
        // necessary to implement partial ISO date strings.
        Date.parse = function(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                match.shift(); // kill match[0], the full match
                // recognize times without dates before normalizing the
                // numeric values, for later use
                var timeOnly = match[0] === undefined;
                // parse numerics
                for (var i = 0; i < 10; i++) {
                    // skip + or - for the timezone offset
                    if (i === 7)
                        continue;
                    // Note: parseInt would read 0-prefix numbers as
                    // octal.  Number constructor or unary + work better
                    // here:
                    match[i] = +(match[i] || (i < 3 ? 1 : 0));
                    // match[1] is the month. Months are 0-11 in JavaScript
                    // Date objects, but 1-12 in ISO notation, so we
                    // decrement.
                    if (i === 1)
                        match[i]--;
                }
                // if no year-month-date is provided, return a milisecond
                // quantity instead of a UTC date number value.
                if (timeOnly)
                    return ((match[3] * 60 + match[4]) * 60 + match[5]) * 1000 + match[6];

                // account for an explicit time zone offset if provided
                var offset = (match[8] * 60 + match[9]) * 60 * 1000;
                if (match[6] === "-")
                    offset = -offset;

                return NativeDate.UTC.apply(this, match.slice(0, 7)) + offset;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

// 
// Function
// ========
// 

// ES-5 15.3.4.5
// http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf
var slice = Array.prototype.slice;
if (!Function.prototype.bind) {
    Function.prototype.bind = function (that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        // XXX this gets pretty close, for all intents and purposes, letting 
        // some duck-types slide
        if (typeof target.apply != "function" || typeof target.call != "function")
            return new TypeError();
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        var args = slice.call(arguments);
        // 4. Let F be a new native ECMAScript object.
        // 9. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 10. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 11. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 12. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        // 13. The [[Scope]] internal property of F is unused and need not
        //   exist.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.

                var self = Object.create(target.prototype);
                target.apply(self, args.concat(slice.call(arguments)));
                return self;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the list
                //   boundArgs in the same order followed by the same values as
                //   the list ExtraArgs in the same order. 5.  Return the
                //   result of calling the [[Call]] internal method of target
                //   providing boundThis as the this value and providing args
                //   as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.call.apply(
                    target,
                    args.concat(slice.call(arguments))
                );

            }

        };
        // 5. Set the [[TargetFunction]] internal property of F to Target.
        // extra:
        bound.bound = target;
        // 6. Set the [[BoundThis]] internal property of F to the value of
        // thisArg.
        // extra:
        bound.boundTo = that;
        // 7. Set the [[BoundArgs]] internal property of F to A.
        // extra:
        bound.boundArgs = args;
        bound.length = (
            // 14. If the [[Class]] internal property of Target is "Function", then
            typeof target == "function" ?
            // a. Let L be the length property of Target minus the length of A.
            // b. Set the length own property of F to either 0 or L, whichever is larger.
            Math.max(target.length - args.length, 0) :
            // 15. Else set the length own property of F to 0.
            0
        )
        // 16. The length own property of F is given attributes as specified in
        //   15.3.5.1.
        // TODO
        // 17. Set the [[Extensible]] internal property of F to true.
        // TODO
        // 18. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // 19. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property.
        // XXX can't delete it in pure-js.
        return bound;
    };
}

//
// String
// ======
//

// ES5 15.5.4.20
if (!String.prototype.trim) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    var trimBeginRegexp = /^\s\s*/;
    var trimEndRegexp = /\s\s*$/;
    String.prototype.trim = function () {
        return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
    };
}

})();
_browserifyRequire.modules["events"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "events.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("events", path);
    };
    
    (function () {
        if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = Array.isArray;

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = list.indexOf(listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};
;
    }).call(module.exports);
    
    _browserifyRequire.modules["events"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["json_shim"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "json_shim.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("json_shim", path);
    };
    
    (function () {
        // https://github.com/douglascrockford/JSON-js/blob/master/json2.js

if (typeof JSON === 'undefined') {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
;
    }).call(module.exports);
    
    _browserifyRequire.modules["json_shim"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["fs"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "fs.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("fs", path);
    };
    
    (function () {
        // nothing to see here... no file methods for the browser
;
    }).call(module.exports);
    
    _browserifyRequire.modules["fs"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["path"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "path.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("path", path);
    };
    
    (function () {
        // resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(resolvedPath.split('/').filter(function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(path.split('/').filter(function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(paths.filter(function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};
;
    }).call(module.exports);
    
    _browserifyRequire.modules["path"]._cached = module.exports;
    return module.exports;
};
_browserifyRequire.modules["underscore"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "underscore";
    var __filename = "underscore/underscore";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("underscore", path);
    };
    
    (function () {
        //     Underscore.js 1.1.4
//     (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **CommonJS**, with backwards-compatibility
  // for the old `require()` API. If we're not in CommonJS, add `_` to the
  // global object.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = _;
    _._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.1.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects implementing `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    var value;
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (_.isNumber(obj.length)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = memo !== void 0;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial && index === 0) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError("Reduce of empty array with no initial value");
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return memo !== void 0 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = (_.isArray(obj) ? obj.slice() : _.toArray(obj)).reverse();
    return _.reduce(reversed, iterator, memo, context);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) return breaker;
    });
    return result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    any(obj, function(value) {
      if (found = value === target) return true;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator = iterator || _.identity;
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return iterable;
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return n && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, _.isUndefined(index) || guard ? 1 : index);
  };

  // Get the last element of an array.
  _.last = function(array) {
    return array[array.length - 1];
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    var values = slice.call(arguments, 1);
    return _.filter(array, function(value){ return !_.include(values, value); });
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted) {
    return _.reduce(array, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) memo[memo.length] = el;
      return memo;
    }, []);
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    if (isSorted) {
      var i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (var i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };


  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    var args  = slice.call(arguments),
        solo  = args.length <= 1,
        start = solo ? 0 : args[0],
        stop  = solo ? args[0] : args[1],
        step  = args[2] || 1,
        len   = Math.max(Math.ceil((stop - start) / step), 0),
        idx   = 0,
        range = new Array(len);
    while (idx < len) {
      range[idx++] = start;
      start += step;
    }
    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  _.bind = function(func, obj) {
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(obj || {}, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher = hasher || _.identity;
    return function() {
      var key = hasher.apply(this, arguments);
      return key in memo ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Internal function used to implement `_.throttle` and `_.debounce`.
  var limit = function(func, wait, debounce) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var throttler = function() {
        timeout = null;
        func.apply(context, args);
      };
      if (debounce) clearTimeout(timeout);
      if (debounce || !timeout) timeout = setTimeout(throttler, wait);
    };
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    return limit(func, wait, false);
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    return limit(func, wait, true);
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = slice.call(arguments);
    return function() {
      var args = slice.call(arguments);
      for (var i=funcs.length-1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (_.isArray(obj)) return _.range(0, obj.length);
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    return _.filter(_.keys(obj), function(key){ return _.isFunction(obj[key]); }).sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) obj[prop] = source[prop];
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    // Check dates' integer values.
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_.isNaN(a) && _.isNaN(b)) return false;
    // Compare regular expressions.
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = _.keys(a), bKeys = _.keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!(key in b) || !_.isEqual(a[key], b[key])) return false;
    return true;
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  // Is a given value a function?
  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
  };

  // Is the given value `NaN`? `NaN` happens to be the only value in JavaScript
  // that does not equal itself.
  _.isNaN = function(obj) {
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false;
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'") + ",'";
         })
         .replace(c.evaluate || null, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', tmpl);
    return data ? func(data) : func;
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();
;
    }).call(module.exports);
    
    _browserifyRequire.modules["underscore"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["underscore/index"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "underscore";
    var __filename = "underscore/underscore/index";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("underscore/index", path);
    };
    
    (function () {
        module.exports = require('./underscore');
;
    }).call(module.exports);
    
    _browserifyRequire.modules["underscore/index"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["underscore/underscore-min"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "underscore";
    var __filename = "underscore/underscore/underscore-min";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("underscore/underscore-min", path);
    };
    
    (function () {
        // Underscore.js 1.1.4
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var q=this,C=q._,m={},j=Array.prototype,n=Object.prototype,i=j.slice,D=j.unshift,E=n.toString,o=n.hasOwnProperty,s=j.forEach,t=j.map,u=j.reduce,v=j.reduceRight,w=j.filter,x=j.every,y=j.some,p=j.indexOf,z=j.lastIndexOf;n=Array.isArray;var F=Object.keys,c=function(a){return new l(a)};if(typeof module!=="undefined"&&module.exports){module.exports=c;c._=c}else q._=c;c.VERSION="1.1.4";var k=c.each=c.forEach=function(a,b,d){if(a!=null)if(s&&a.forEach===s)a.forEach(b,d);else if(c.isNumber(a.length))for(var e=
0,f=a.length;e<f;e++){if(b.call(d,a[e],e,a)===m)break}else for(e in a)if(o.call(a,e))if(b.call(d,a[e],e,a)===m)break};c.map=function(a,b,d){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(b,d);k(a,function(f,g,h){e[e.length]=b.call(d,f,g,h)});return e};c.reduce=c.foldl=c.inject=function(a,b,d,e){var f=d!==void 0;if(a==null)a=[];if(u&&a.reduce===u){if(e)b=c.bind(b,e);return f?a.reduce(b,d):a.reduce(b)}k(a,function(g,h,G){if(!f&&h===0){d=g;f=true}else d=b.call(e,d,g,h,G)});if(!f)throw new TypeError("Reduce of empty array with no initial value");
return d};c.reduceRight=c.foldr=function(a,b,d,e){if(a==null)a=[];if(v&&a.reduceRight===v){if(e)b=c.bind(b,e);return d!==void 0?a.reduceRight(b,d):a.reduceRight(b)}a=(c.isArray(a)?a.slice():c.toArray(a)).reverse();return c.reduce(a,b,d,e)};c.find=c.detect=function(a,b,d){var e;A(a,function(f,g,h){if(b.call(d,f,g,h)){e=f;return true}});return e};c.filter=c.select=function(a,b,d){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(b,d);k(a,function(f,g,h){if(b.call(d,f,g,h))e[e.length]=
f});return e};c.reject=function(a,b,d){var e=[];if(a==null)return e;k(a,function(f,g,h){b.call(d,f,g,h)||(e[e.length]=f)});return e};c.every=c.all=function(a,b,d){b=b||c.identity;var e=true;if(a==null)return e;if(x&&a.every===x)return a.every(b,d);k(a,function(f,g,h){if(!(e=e&&b.call(d,f,g,h)))return m});return e};var A=c.some=c.any=function(a,b,d){b=b||c.identity;var e=false;if(a==null)return e;if(y&&a.some===y)return a.some(b,d);k(a,function(f,g,h){if(e=b.call(d,f,g,h))return m});return e};c.include=
c.contains=function(a,b){var d=false;if(a==null)return d;if(p&&a.indexOf===p)return a.indexOf(b)!=-1;A(a,function(e){if(d=e===b)return true});return d};c.invoke=function(a,b){var d=i.call(arguments,2);return c.map(a,function(e){return(b?e[b]:e).apply(e,d)})};c.pluck=function(a,b){return c.map(a,function(d){return d[b]})};c.max=function(a,b,d){if(!b&&c.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};k(a,function(f,g,h){g=b?b.call(d,f,g,h):f;g>=e.computed&&(e={value:f,computed:g})});
return e.value};c.min=function(a,b,d){if(!b&&c.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};k(a,function(f,g,h){g=b?b.call(d,f,g,h):f;g<e.computed&&(e={value:f,computed:g})});return e.value};c.sortBy=function(a,b,d){return c.pluck(c.map(a,function(e,f,g){return{value:e,criteria:b.call(d,e,f,g)}}).sort(function(e,f){var g=e.criteria,h=f.criteria;return g<h?-1:g>h?1:0}),"value")};c.sortedIndex=function(a,b,d){d=d||c.identity;for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(b)?
e=g+1:f=g}return e};c.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(c.isArray(a))return a;if(c.isArguments(a))return i.call(a);return c.values(a)};c.size=function(a){return c.toArray(a).length};c.first=c.head=function(a,b,d){return b&&!d?i.call(a,0,b):a[0]};c.rest=c.tail=function(a,b,d){return i.call(a,c.isUndefined(b)||d?1:b)};c.last=function(a){return a[a.length-1]};c.compact=function(a){return c.filter(a,function(b){return!!b})};c.flatten=function(a){return c.reduce(a,function(b,
d){if(c.isArray(d))return b.concat(c.flatten(d));b[b.length]=d;return b},[])};c.without=function(a){var b=i.call(arguments,1);return c.filter(a,function(d){return!c.include(b,d)})};c.uniq=c.unique=function(a,b){return c.reduce(a,function(d,e,f){if(0==f||(b===true?c.last(d)!=e:!c.include(d,e)))d[d.length]=e;return d},[])};c.intersect=function(a){var b=i.call(arguments,1);return c.filter(c.uniq(a),function(d){return c.every(b,function(e){return c.indexOf(e,d)>=0})})};c.zip=function(){for(var a=i.call(arguments),
b=c.max(c.pluck(a,"length")),d=Array(b),e=0;e<b;e++)d[e]=c.pluck(a,""+e);return d};c.indexOf=function(a,b,d){if(a==null)return-1;if(d){d=c.sortedIndex(a,b);return a[d]===b?d:-1}if(p&&a.indexOf===p)return a.indexOf(b);d=0;for(var e=a.length;d<e;d++)if(a[d]===b)return d;return-1};c.lastIndexOf=function(a,b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};c.range=function(a,b,d){var e=i.call(arguments),f=e.length<=1;a=f?0:e[0];
b=f?e[0]:e[1];d=e[2]||1;e=Math.max(Math.ceil((b-a)/d),0);f=0;for(var g=Array(e);f<e;){g[f++]=a;a+=d}return g};c.bind=function(a,b){var d=i.call(arguments,2);return function(){return a.apply(b||{},d.concat(i.call(arguments)))}};c.bindAll=function(a){var b=i.call(arguments,1);if(b.length==0)b=c.functions(a);k(b,function(d){a[d]=c.bind(a[d],a)});return a};c.memoize=function(a,b){var d={};b=b||c.identity;return function(){var e=b.apply(this,arguments);return e in d?d[e]:d[e]=a.apply(this,arguments)}};
c.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};c.defer=function(a){return c.delay.apply(c,[a,1].concat(i.call(arguments,1)))};var B=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};c.throttle=function(a,b){return B(a,b,false)};c.debounce=function(a,b){return B(a,b,true)};c.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments));return b.apply(this,
d)}};c.compose=function(){var a=i.call(arguments);return function(){for(var b=i.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};c.keys=F||function(a){if(c.isArray(a))return c.range(0,a.length);var b=[],d;for(d in a)if(o.call(a,d))b[b.length]=d;return b};c.values=function(a){return c.map(a,c.identity)};c.functions=c.methods=function(a){return c.filter(c.keys(a),function(b){return c.isFunction(a[b])}).sort()};c.extend=function(a){k(i.call(arguments,1),function(b){for(var d in b)a[d]=
b[d]});return a};c.clone=function(a){return c.isArray(a)?a.slice():c.extend({},a)};c.tap=function(a,b){b(a);return a};c.isEqual=function(a,b){if(a===b)return true;var d=typeof a;if(d!=typeof b)return false;if(a==b)return true;if(!a&&b||a&&!b)return false;if(a._chain)a=a._wrapped;if(b._chain)b=b._wrapped;if(a.isEqual)return a.isEqual(b);if(c.isDate(a)&&c.isDate(b))return a.getTime()===b.getTime();if(c.isNaN(a)&&c.isNaN(b))return false;if(c.isRegExp(a)&&c.isRegExp(b))return a.source===b.source&&a.global===
b.global&&a.ignoreCase===b.ignoreCase&&a.multiline===b.multiline;if(d!=="object")return false;if(a.length&&a.length!==b.length)return false;d=c.keys(a);var e=c.keys(b);if(d.length!=e.length)return false;for(var f in a)if(!(f in b)||!c.isEqual(a[f],b[f]))return false;return true};c.isEmpty=function(a){if(c.isArray(a)||c.isString(a))return a.length===0;for(var b in a)if(o.call(a,b))return false;return true};c.isElement=function(a){return!!(a&&a.nodeType==1)};c.isArray=n||function(a){return E.call(a)===
"[object Array]"};c.isArguments=function(a){return!!(a&&o.call(a,"callee"))};c.isFunction=function(a){return!!(a&&a.constructor&&a.call&&a.apply)};c.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};c.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};c.isNaN=function(a){return a!==a};c.isBoolean=function(a){return a===true||a===false};c.isDate=function(a){return!!(a&&a.getTimezoneOffset&&a.setUTCFullYear)};c.isRegExp=function(a){return!!(a&&a.test&&a.exec&&(a.ignoreCase||
a.ignoreCase===false))};c.isNull=function(a){return a===null};c.isUndefined=function(a){return a===void 0};c.noConflict=function(){q._=C;return this};c.identity=function(a){return a};c.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};c.mixin=function(a){k(c.functions(a),function(b){H(b,c[b]=a[b])})};var I=0;c.uniqueId=function(a){var b=I++;return a?a+b:b};c.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};c.template=function(a,b){var d=c.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+
a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(e,f){return"',"+f.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(e,f){return"');"+f.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return b?d(b):d};var l=function(a){this._wrapped=a};c.prototype=l.prototype;var r=function(a,b){return b?c(a).chain():a},H=function(a,b){l.prototype[a]=function(){var d=
i.call(arguments);D.call(d,this._wrapped);return r(b.apply(c,d),this._chain)}};c.mixin(c);k(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=j[a];l.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});k(["concat","join","slice"],function(a){var b=j[a];l.prototype[a]=function(){return r(b.apply(this._wrapped,arguments),this._chain)}});l.prototype.chain=function(){this._chain=true;return this};l.prototype.value=function(){return this._wrapped}})();
;
    }).call(module.exports);
    
    _browserifyRequire.modules["underscore/underscore-min"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["backbone"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "backbone";
    var __filename = "backbone/backbone";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("backbone", path);
    };
    
    (function () {
        //     Backbone.js 0.3.3
//     (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://documentcloud.github.com/backbone

(function(){

  // Initial Setup
  // -------------

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = this.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.3.3';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = this._;
  if (!_ && (typeof require !== 'undefined')) _ = require("underscore")._;

  // For Backbone's purposes, either jQuery or Zepto owns the `$` variable.
  var $ = this.jQuery || this.Zepto;

  // Turn on `emulateHTTP` to use support legacy HTTP servers. Setting this option will
  // fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and set a
  // `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may `bind` or `unbind` a callback function to an event;
  // `trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.bind('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  Backbone.Events = {

    // Bind an event, specified by a string name, `ev`, to a `callback` function.
    // Passing `"all"` will bind the callback to all events fired.
    bind : function(ev, callback) {
      var calls = this._callbacks || (this._callbacks = {});
      var list  = this._callbacks[ev] || (this._callbacks[ev] = []);
      list.push(callback);
      return this;
    },

    // Remove one or many callbacks. If `callback` is null, removes all
    // callbacks for the event. If `ev` is null, removes all bound callbacks
    // for all events.
    unbind : function(ev, callback) {
      var calls;
      if (!ev) {
        this._callbacks = {};
      } else if (calls = this._callbacks) {
        if (!callback) {
          calls[ev] = [];
        } else {
          var list = calls[ev];
          if (!list) return this;
          for (var i = 0, l = list.length; i < l; i++) {
            if (callback === list[i]) {
              list.splice(i, 1);
              break;
            }
          }
        }
      }
      return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger : function(ev) {
      var list, calls, i, l;
      if (!(calls = this._callbacks)) return this;
      if (list = calls[ev]) {
        for (i = 0, l = list.length; i < l; i++) {
          list[i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
      }
      if (list = calls['all']) {
        for (i = 0, l = list.length; i < l; i++) {
          list[i].apply(this, arguments);
        }
      }
      return this;
    }

  };

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  Backbone.Model = function(attributes, options) {
    attributes || (attributes = {});
    if (this.defaults) attributes = _.extend({}, this.defaults, attributes);
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.set(attributes, {silent : true});
    this._previousAttributes = _.clone(this.attributes);
    if (options && options.collection) this.collection = options.collection;
    this.initialize(attributes, options);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Backbone.Model.prototype, Backbone.Events, {

    // A snapshot of the model's previous attributes, taken immediately
    // after the last `"change"` event was fired.
    _previousAttributes : null,

    // Has the item been changed since the last `"change"` event?
    _changed : false,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Return a copy of the model's `attributes` object.
    toJSON : function() {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get : function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape : function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.attributes[attr];
      return this._escapedAttributes[attr] = escapeHTML(val == null ? '' : val);
    },

    // Set a hash of model attributes on the object, firing `"change"` unless you
    // choose to silence it.
    set : function(attrs, options) {

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs.attributes) attrs = attrs.attributes;
      var now = this.attributes, escaped = this._escapedAttributes;

      // Run validation.
      if (!options.silent && this.validate && !this._performValidation(attrs, options)) return false;

      // Check for changes of `id`.
      if ('id' in attrs) this.id = attrs.id;

      // Update attributes.
      for (var attr in attrs) {
        var val = attrs[attr];
        if (!_.isEqual(now[attr], val)) {
          now[attr] = val;
          delete escaped[attr];
          if (!options.silent) {
            this._changed = true;
            this.trigger('change:' + attr, this, val, options);
          }
        }
      }

      // Fire the `"change"` event, if the model has been changed.
      if (!options.silent && this._changed) this.change(options);
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it.
    unset : function(attr, options) {
      options || (options = {});
      var value = this.attributes[attr];

      // Run validation.
      var validObj = {};
      validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      // Remove the attribute.
      delete this.attributes[attr];
      delete this._escapedAttributes[attr];
      if (!options.silent) {
        this._changed = true;
        this.trigger('change:' + attr, this, void 0, options);
        this.change(options);
      }
      return this;
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear : function(options) {
      options || (options = {});
      var old = this.attributes;

      // Run validation.
      var validObj = {};
      for (attr in old) validObj[attr] = void 0;
      if (!options.silent && this.validate && !this._performValidation(validObj, options)) return false;

      this.attributes = {};
      this._escapedAttributes = {};
      if (!options.silent) {
        this._changed = true;
        for (attr in old) {
          this.trigger('change:' + attr, this, void 0, options);
        }
        this.change(options);
      }
      return this;
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch : function(options) {
      options || (options = {});
      var model = this;
      var success = function(resp) {
        if (!model.set(model.parse(resp), options)) return false;
        if (options.success) options.success(model, resp);
      };
      var error = wrapError(options.error, model, options);
      (this.sync || Backbone.sync)('read', this, success, error);
      return this;
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save : function(attrs, options) {
      options || (options = {});
      if (attrs && !this.set(attrs, options)) return false;
      var model = this;
      var success = function(resp) {
        if (!model.set(model.parse(resp), options)) return false;
        if (options.success) options.success(model, resp);
      };
      var error = wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      (this.sync || Backbone.sync)(method, this, success, error);
      return this;
    },

    // Destroy this model on the server. Upon success, the model is removed
    // from its collection, if it has one.
    destroy : function(options) {
      options || (options = {});
      var model = this;
      var success = function(resp) {
        if (model.collection) model.collection.remove(model);
        if (options.success) options.success(model, resp);
      };
      var error = wrapError(options.error, model, options);
      (this.sync || Backbone.sync)('delete', this, success, error);
      return this;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url : function() {
      var base = getUrl(this.collection);
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse : function(resp) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone : function() {
      return new this.constructor(this);
    },

    // A model is new if it has never been saved to the server, and has a negative
    // ID.
    isNew : function() {
      return !this.id;
    },

    // Call this method to manually fire a `change` event for this model.
    // Calling this will cause all objects observing the model to update.
    change : function(options) {
      this.trigger('change', this, options);
      this._previousAttributes = _.clone(this.attributes);
      this._changed = false;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged : function(attr) {
      if (attr) return this._previousAttributes[attr] != this.attributes[attr];
      return this._changed;
    },

    // Return an object containing all the attributes that have changed, or false
    // if there are no changed attributes. Useful for determining what parts of a
    // view need to be updated and/or what attributes need to be persisted to
    // the server.
    changedAttributes : function(now) {
      now || (now = this.attributes);
      var old = this._previousAttributes;
      var changed = false;
      for (var attr in now) {
        if (!_.isEqual(old[attr], now[attr])) {
          changed = changed || {};
          changed[attr] = now[attr];
        }
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous : function(attr) {
      if (!attr || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes : function() {
      return _.clone(this._previousAttributes);
    },

    // Run validation against a set of incoming attributes, returning `true`
    // if all is well. If a specific `error` callback has been passed,
    // call that instead of firing the general `"error"` event.
    _performValidation : function(attrs, options) {
      var error = this.validate(attrs);
      if (error) {
        if (options.error) {
          options.error(this, error);
        } else {
          this.trigger('error', this, error, options);
        }
        return false;
      }
      return true;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.comparator) {
      this.comparator = options.comparator;
      delete options.comparator;
    }
    this._boundOnModelEvent = _.bind(this._onModelEvent, this);
    this._reset();
    if (models) this.refresh(models, {silent: true});
    this.initialize(models, options);
  };

  // Define the Collection's inheritable methods.
  _.extend(Backbone.Collection.prototype, Backbone.Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model : Backbone.Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON : function() {
      return this.map(function(model){ return model.toJSON(); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `added` event for every new model.
    add : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._add(models[i], options);
        }
      } else {
        this._add(models, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `removed` event for every model removed.
    remove : function(models, options) {
      if (_.isArray(models)) {
        for (var i = 0, l = models.length; i < l; i++) {
          this._remove(models[i], options);
        }
      } else {
        this._remove(models, options);
      }
      return this;
    },

    // Get a model from the set by id.
    get : function(id) {
      if (id == null) return null;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid : function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Force the collection to re-sort itself. You don't need to call this under normal
    // circumstances, as the set will maintain sort order as each item is added.
    sort : function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      this.models = this.sortBy(this.comparator);
      if (!options.silent) this.trigger('refresh', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck : function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can refresh the entire set with a new list of models, without firing
    // any `added` or `removed` events. Fires `refresh` when finished.
    refresh : function(models, options) {
      models  || (models = []);
      options || (options = {});
      this._reset();
      this.add(models, {silent: true});
      if (!options.silent) this.trigger('refresh', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, refreshing the
    // collection when they arrive.
    fetch : function(options) {
      options || (options = {});
      var collection = this;
      var success = function(resp) {
        collection.refresh(collection.parse(resp));
        if (options.success) options.success(collection, resp);
      };
      var error = wrapError(options.error, collection, options);
      (this.sync || Backbone.sync)('read', this, success, error);
      return this;
    },

    // Create a new instance of a model in this collection. After the model
    // has been created on the server, it will be added to the collection.
    create : function(model, options) {
      var coll = this;
      options || (options = {});
      if (!(model instanceof Backbone.Model)) {
        model = new this.model(model, {collection: coll});
      } else {
        model.collection = coll;
      }
      var success = function(nextModel, resp) {
        coll.add(nextModel);
        if (options.success) options.success(nextModel, resp);
      };
      return model.save(null, {success : success, error : options.error});
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse : function(resp) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is refreshed.
    _reset : function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Internal implementation of adding a single model to the set, updating
    // hash indexes for `id` and `cid` lookups.
    _add : function(model, options) {
      options || (options = {});
      if (!(model instanceof Backbone.Model)) {
        model = new this.model(model, {collection: this});
      }
      var already = this.getByCid(model);
      if (already) throw new Error(["Can't add the same model to a set twice", already.id]);
      this._byId[model.id] = model;
      this._byCid[model.cid] = model;
      model.collection = this;
      var index = this.comparator ? this.sortedIndex(model, this.comparator) : this.length;
      this.models.splice(index, 0, model);
      model.bind('all', this._boundOnModelEvent);
      this.length++;
      if (!options.silent) model.trigger('add', model, this, options);
      return model;
    },

    // Internal implementation of removing a single model from the set, updating
    // hash indexes for `id` and `cid` lookups.
    _remove : function(model, options) {
      options || (options = {});
      model = this.getByCid(model) || this.get(model);
      if (!model) return null;
      delete this._byId[model.id];
      delete this._byCid[model.cid];
      delete model.collection;
      this.models.splice(this.indexOf(model), 1);
      this.length--;
      if (!options.silent) model.trigger('remove', model, this, options);
      model.unbind('all', this._boundOnModelEvent);
      return model;
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through.
    _onModelEvent : function(ev, model) {
      if (ev === 'change:id') {
        delete this._byId[model.previous('id')];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect',
    'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size',
    'first', 'rest', 'last', 'without', 'indexOf', 'lastIndexOf', 'isEmpty'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Backbone.Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Controller
  // -------------------

  // Controllers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  Backbone.Controller = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize(options);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam = /:([\w\d]+)/g;
  var splatParam = /\*([\w\d]+)/g;

  // Set up all inheritable **Backbone.Controller** properties and methods.
  _.extend(Backbone.Controller.prototype, Backbone.Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route : function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
      }, this));
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history,
    // without triggering routes.
    saveLocation : function(fragment) {
      Backbone.history.saveLocation(fragment);
    },

    // Bind all defined routes to `Backbone.history`.
    _bindRoutes : function() {
      if (!this.routes) return;
      for (var route in this.routes) {
        var name = this.routes[route];
        this.route(route, name, this[name]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location fragment.
    _routeToRegExp : function(route) {
      route = route.replace(namedParam, "([^\/]*)").replace(splatParam, "(.*?)");
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters : function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL hashes. If the
  // browser does not support `onhashchange`, falls back to polling.
  Backbone.History = function() {
    this.handlers = [];
    this.fragment = this.getFragment();
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning hashes.
  var hashStrip = /^#*/;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(Backbone.History.prototype, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Get the cross-browser normalized URL fragment.
    getFragment : function(loc) {
      return (loc || window.location).hash.replace(hashStrip, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start : function() {
      var docMode = document.documentMode;
      var oldIE = ($.browser.msie && (!docMode || docMode <= 7));
      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
      }
      if ('onhashchange' in window && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else {
        setInterval(this.checkUrl, this.interval);
      }
      return this.loadUrl();
    },

    // Add a route to be tested when the hash changes. Routes are matched in the
    // order they are added.
    route : function(route, callback) {
      this.handlers.push({route : route, callback : callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl : function() {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) {
        current = this.getFragment(this.iframe.location);
      }
      if (current == this.fragment ||
          current == decodeURIComponent(this.fragment)) return false;
      if (this.iframe) {
        window.location.hash = this.iframe.location.hash = current;
      }
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl : function() {
      var fragment = this.fragment = this.getFragment();
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history. You are responsible for properly
    // URL-encoding the fragment in advance. This does not trigger
    // a `hashchange` event.
    saveLocation : function(fragment) {
      fragment = (fragment || '').replace(hashStrip, '');
      if (this.fragment == fragment) return;
      window.location.hash = this.fragment = fragment;
      if (this.iframe && (fragment != this.getFragment(this.iframe.location))) {
        this.iframe.document.open().close();
        this.iframe.location.hash = fragment;
      }
    }

  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  Backbone.View = function(options) {
    this._configure(options || {});
    this._ensureElement();
    this.delegateEvents();
    this.initialize(options);
  };

  // Element lookup, scoped to DOM elements within the current view.
  // This should be prefered to global lookups, if you're dealing with
  // a specific view.
  var selectorDelegate = function(selector) {
    return $(selector, this.el);
  };

  // Cached regex to split keys for `delegate`.
  var eventSplitter = /^(\w+)\s*(.*)$/;

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(Backbone.View.prototype, Backbone.Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName : 'div',

    // Attach the `selectorDelegate` function as the `$` property.
    $       : selectorDelegate,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize : function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render : function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove : function() {
      $(this.el).remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.get('title'));
    //
    make : function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Set callbacks, where `this.callbacks` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents : function(events) {
      if (!(events || (events = this.events))) return;
      $(this.el).unbind();
      for (var key in events) {
        var methodName = events[key];
        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        var method = _.bind(this[methodName], this);
        if (selector === '') {
          $(this.el).bind(eventName, method);
        } else {
          $(this.el).delegate(selector, eventName, method);
        }
      }
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure : function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      if (options.model)      this.model      = options.model;
      if (options.collection) this.collection = options.collection;
      if (options.el)         this.el         = options.el;
      if (options.id)         this.id         = options.id;
      if (options.className)  this.className  = options.className;
      if (options.tagName)    this.tagName    = options.tagName;
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    _ensureElement : function() {
      if (this.el) return;
      var attrs = {};
      if (this.id) attrs.id = this.id;
      if (this.className) attrs["class"] = this.className;
      this.el = this.make(this.tagName, attrs);
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Backbone.Model.extend = Backbone.Collection.extend =
    Backbone.Controller.extend = Backbone.View.extend = extend;

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, uses makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded` instead of
  // `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, success, error) {
    var type = methodMap[method];
    var modelJSON = (method === 'create' || method === 'update') ?
                    JSON.stringify(model.toJSON()) : null;

    // Default JSON-request options.
    var params = {
      url:          getUrl(model),
      type:         type,
      contentType:  'application/json',
      data:         modelJSON,
      dataType:     'json',
      processData:  false,
      success:      success,
      error:        error
    };

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.processData = true;
      params.data        = modelJSON ? {model : modelJSON} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader("X-HTTP-Method-Override", type);
        };
      }
    }

    // Make the request.
    $.ajax(params);
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call `super()`.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`, for `instanceof`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a URL from a Model or Collection as a property
  // or as a function.
  var getUrl = function(object) {
    if (!(object && object.url)) throw new Error("A 'url' property or function must be specified");
    return _.isFunction(object.url) ? object.url() : object.url;
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(onError, model, options) {
    return function(resp) {
      if (onError) {
        onError(model, resp);
      } else {
        model.trigger('error', model, resp, options);
      }
    };
  };

  // Helper function to escape a string for HTML rendering.
  var escapeHTML = function(string) {
    return string.replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

})();
;
    }).call(module.exports);
    
    _browserifyRequire.modules["backbone"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["backbone/backbone-min"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = "backbone";
    var __filename = "backbone/backbone/backbone-min";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("backbone/backbone-min", path);
    };
    
    (function () {
        // Backbone.js 0.3.3
// (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
// Backbone may be freely distributed under the MIT license.
// For all details and documentation:
// http://documentcloud.github.com/backbone
(function(){var e;e=typeof exports!=="undefined"?exports:this.Backbone={};e.VERSION="0.3.3";var f=this._;if(!f&&typeof require!=="undefined")f=require("underscore")._;var h=this.jQuery||this.Zepto;e.emulateHTTP=false;e.emulateJSON=false;e.Events={bind:function(a,b){this._callbacks||(this._callbacks={});(this._callbacks[a]||(this._callbacks[a]=[])).push(b);return this},unbind:function(a,b){var c;if(a){if(c=this._callbacks)if(b){c=c[a];if(!c)return this;for(var d=0,g=c.length;d<g;d++)if(b===c[d]){c.splice(d,
1);break}}else c[a]=[]}else this._callbacks={};return this},trigger:function(a){var b,c,d,g;if(!(c=this._callbacks))return this;if(b=c[a]){d=0;for(g=b.length;d<g;d++)b[d].apply(this,Array.prototype.slice.call(arguments,1))}if(b=c.all){d=0;for(g=b.length;d<g;d++)b[d].apply(this,arguments)}return this}};e.Model=function(a,b){a||(a={});if(this.defaults)a=f.extend({},this.defaults,a);this.attributes={};this._escapedAttributes={};this.cid=f.uniqueId("c");this.set(a,{silent:true});this._previousAttributes=
f.clone(this.attributes);if(b&&b.collection)this.collection=b.collection;this.initialize(a,b)};f.extend(e.Model.prototype,e.Events,{_previousAttributes:null,_changed:false,initialize:function(){},toJSON:function(){return f.clone(this.attributes)},get:function(a){return this.attributes[a]},escape:function(a){var b;if(b=this._escapedAttributes[a])return b;b=this.attributes[a];return this._escapedAttributes[a]=(b==null?"":b).replace(/&(?!\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,
"&quot;")},set:function(a,b){b||(b={});if(!a)return this;if(a.attributes)a=a.attributes;var c=this.attributes,d=this._escapedAttributes;if(!b.silent&&this.validate&&!this._performValidation(a,b))return false;if("id"in a)this.id=a.id;for(var g in a){var i=a[g];if(!f.isEqual(c[g],i)){c[g]=i;delete d[g];if(!b.silent){this._changed=true;this.trigger("change:"+g,this,i,b)}}}!b.silent&&this._changed&&this.change(b);return this},unset:function(a,b){b||(b={});var c={};c[a]=void 0;if(!b.silent&&this.validate&&
!this._performValidation(c,b))return false;delete this.attributes[a];delete this._escapedAttributes[a];if(!b.silent){this._changed=true;this.trigger("change:"+a,this,void 0,b);this.change(b)}return this},clear:function(a){a||(a={});var b=this.attributes,c={};for(attr in b)c[attr]=void 0;if(!a.silent&&this.validate&&!this._performValidation(c,a))return false;this.attributes={};this._escapedAttributes={};if(!a.silent){this._changed=true;for(attr in b)this.trigger("change:"+attr,this,void 0,a);this.change(a)}return this},
fetch:function(a){a||(a={});var b=this,c=j(a.error,b,a);(this.sync||e.sync)("read",this,function(d){if(!b.set(b.parse(d),a))return false;a.success&&a.success(b,d)},c);return this},save:function(a,b){b||(b={});if(a&&!this.set(a,b))return false;var c=this,d=j(b.error,c,b),g=this.isNew()?"create":"update";(this.sync||e.sync)(g,this,function(i){if(!c.set(c.parse(i),b))return false;b.success&&b.success(c,i)},d);return this},destroy:function(a){a||(a={});var b=this,c=j(a.error,b,a);(this.sync||e.sync)("delete",
this,function(d){b.collection&&b.collection.remove(b);a.success&&a.success(b,d)},c);return this},url:function(){var a=k(this.collection);if(this.isNew())return a;return a+(a.charAt(a.length-1)=="/"?"":"/")+this.id},parse:function(a){return a},clone:function(){return new this.constructor(this)},isNew:function(){return!this.id},change:function(a){this.trigger("change",this,a);this._previousAttributes=f.clone(this.attributes);this._changed=false},hasChanged:function(a){if(a)return this._previousAttributes[a]!=
this.attributes[a];return this._changed},changedAttributes:function(a){a||(a=this.attributes);var b=this._previousAttributes,c=false,d;for(d in a)if(!f.isEqual(b[d],a[d])){c=c||{};c[d]=a[d]}return c},previous:function(a){if(!a||!this._previousAttributes)return null;return this._previousAttributes[a]},previousAttributes:function(){return f.clone(this._previousAttributes)},_performValidation:function(a,b){var c=this.validate(a);if(c){b.error?b.error(this,c):this.trigger("error",this,c,b);return false}return true}});
e.Collection=function(a,b){b||(b={});if(b.comparator){this.comparator=b.comparator;delete b.comparator}this._boundOnModelEvent=f.bind(this._onModelEvent,this);this._reset();a&&this.refresh(a,{silent:true});this.initialize(a,b)};f.extend(e.Collection.prototype,e.Events,{model:e.Model,initialize:function(){},toJSON:function(){return this.map(function(a){return a.toJSON()})},add:function(a,b){if(f.isArray(a))for(var c=0,d=a.length;c<d;c++)this._add(a[c],b);else this._add(a,b);return this},remove:function(a,
b){if(f.isArray(a))for(var c=0,d=a.length;c<d;c++)this._remove(a[c],b);else this._remove(a,b);return this},get:function(a){if(a==null)return null;return this._byId[a.id!=null?a.id:a]},getByCid:function(a){return a&&this._byCid[a.cid||a]},at:function(a){return this.models[a]},sort:function(a){a||(a={});if(!this.comparator)throw Error("Cannot sort a set without a comparator");this.models=this.sortBy(this.comparator);a.silent||this.trigger("refresh",this,a);return this},pluck:function(a){return f.map(this.models,
function(b){return b.get(a)})},refresh:function(a,b){a||(a=[]);b||(b={});this._reset();this.add(a,{silent:true});b.silent||this.trigger("refresh",this,b);return this},fetch:function(a){a||(a={});var b=this,c=j(a.error,b,a);(this.sync||e.sync)("read",this,function(d){b.refresh(b.parse(d));a.success&&a.success(b,d)},c);return this},create:function(a,b){var c=this;b||(b={});if(a instanceof e.Model)a.collection=c;else a=new this.model(a,{collection:c});return a.save(null,{success:function(d,g){c.add(d);
b.success&&b.success(d,g)},error:b.error})},parse:function(a){return a},chain:function(){return f(this.models).chain()},_reset:function(){this.length=0;this.models=[];this._byId={};this._byCid={}},_add:function(a,b){b||(b={});a instanceof e.Model||(a=new this.model(a,{collection:this}));var c=this.getByCid(a);if(c)throw Error(["Can't add the same model to a set twice",c.id]);this._byId[a.id]=a;this._byCid[a.cid]=a;a.collection=this;this.models.splice(this.comparator?this.sortedIndex(a,this.comparator):
this.length,0,a);a.bind("all",this._boundOnModelEvent);this.length++;b.silent||a.trigger("add",a,this,b);return a},_remove:function(a,b){b||(b={});a=this.getByCid(a)||this.get(a);if(!a)return null;delete this._byId[a.id];delete this._byCid[a.cid];delete a.collection;this.models.splice(this.indexOf(a),1);this.length--;b.silent||a.trigger("remove",a,this,b);a.unbind("all",this._boundOnModelEvent);return a},_onModelEvent:function(a,b){if(a==="change:id"){delete this._byId[b.previous("id")];this._byId[b.id]=
b}this.trigger.apply(this,arguments)}});f.each(["forEach","each","map","reduce","reduceRight","find","detect","filter","select","reject","every","all","some","any","include","invoke","max","min","sortBy","sortedIndex","toArray","size","first","rest","last","without","indexOf","lastIndexOf","isEmpty"],function(a){e.Collection.prototype[a]=function(){return f[a].apply(f,[this.models].concat(f.toArray(arguments)))}});e.Controller=function(a){a||(a={});if(a.routes)this.routes=a.routes;this._bindRoutes();
this.initialize(a)};var o=/:([\w\d]+)/g,p=/\*([\w\d]+)/g;f.extend(e.Controller.prototype,e.Events,{initialize:function(){},route:function(a,b,c){e.history||(e.history=new e.History);f.isRegExp(a)||(a=this._routeToRegExp(a));e.history.route(a,f.bind(function(d){d=this._extractParameters(a,d);c.apply(this,d);this.trigger.apply(this,["route:"+b].concat(d))},this))},saveLocation:function(a){e.history.saveLocation(a)},_bindRoutes:function(){if(this.routes)for(var a in this.routes){var b=this.routes[a];
this.route(a,b,this[b])}},_routeToRegExp:function(a){a=a.replace(o,"([^/]*)").replace(p,"(.*?)");return RegExp("^"+a+"$")},_extractParameters:function(a,b){return a.exec(b).slice(1)}});e.History=function(){this.handlers=[];this.fragment=this.getFragment();f.bindAll(this,"checkUrl")};var l=/^#*/;f.extend(e.History.prototype,{interval:50,getFragment:function(a){return(a||window.location).hash.replace(l,"")},start:function(){var a=document.documentMode;if(a=h.browser.msie&&(!a||a<=7))this.iframe=h('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;
"onhashchange"in window&&!a?h(window).bind("hashchange",this.checkUrl):setInterval(this.checkUrl,this.interval);return this.loadUrl()},route:function(a,b){this.handlers.push({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();if(a==this.fragment&&this.iframe)a=this.getFragment(this.iframe.location);if(a==this.fragment||a==decodeURIComponent(this.fragment))return false;if(this.iframe)window.location.hash=this.iframe.location.hash=a;this.loadUrl()},loadUrl:function(){var a=this.fragment=
this.getFragment();return f.any(this.handlers,function(b){if(b.route.test(a)){b.callback(a);return true}})},saveLocation:function(a){a=(a||"").replace(l,"");if(this.fragment!=a){window.location.hash=this.fragment=a;if(this.iframe&&a!=this.getFragment(this.iframe.location)){this.iframe.document.open().close();this.iframe.location.hash=a}}}});e.View=function(a){this._configure(a||{});this._ensureElement();this.delegateEvents();this.initialize(a)};var q=/^(\w+)\s*(.*)$/;f.extend(e.View.prototype,e.Events,
{tagName:"div",$:function(a){return h(a,this.el)},initialize:function(){},render:function(){return this},remove:function(){h(this.el).remove();return this},make:function(a,b,c){a=document.createElement(a);b&&h(a).attr(b);c&&h(a).html(c);return a},delegateEvents:function(a){if(a||(a=this.events)){h(this.el).unbind();for(var b in a){var c=a[b],d=b.match(q),g=d[1];d=d[2];c=f.bind(this[c],this);d===""?h(this.el).bind(g,c):h(this.el).delegate(d,g,c)}}},_configure:function(a){if(this.options)a=f.extend({},
this.options,a);if(a.model)this.model=a.model;if(a.collection)this.collection=a.collection;if(a.el)this.el=a.el;if(a.id)this.id=a.id;if(a.className)this.className=a.className;if(a.tagName)this.tagName=a.tagName;this.options=a},_ensureElement:function(){if(!this.el){var a={};if(this.id)a.id=this.id;if(this.className)a["class"]=this.className;this.el=this.make(this.tagName,a)}}});var m=function(a,b){var c=r(this,a,b);c.extend=m;return c};e.Model.extend=e.Collection.extend=e.Controller.extend=e.View.extend=
m;var s={create:"POST",update:"PUT","delete":"DELETE",read:"GET"};e.sync=function(a,b,c,d){var g=s[a];a=a==="create"||a==="update"?JSON.stringify(b.toJSON()):null;b={url:k(b),type:g,contentType:"application/json",data:a,dataType:"json",processData:false,success:c,error:d};if(e.emulateJSON){b.contentType="application/x-www-form-urlencoded";b.processData=true;b.data=a?{model:a}:{}}if(e.emulateHTTP)if(g==="PUT"||g==="DELETE"){if(e.emulateJSON)b.data._method=g;b.type="POST";b.beforeSend=function(i){i.setRequestHeader("X-HTTP-Method-Override",
g)}}h.ajax(b)};var n=function(){},r=function(a,b,c){var d;d=b&&b.hasOwnProperty("constructor")?b.constructor:function(){return a.apply(this,arguments)};n.prototype=a.prototype;d.prototype=new n;b&&f.extend(d.prototype,b);c&&f.extend(d,c);d.prototype.constructor=d;d.__super__=a.prototype;return d},k=function(a){if(!(a&&a.url))throw Error("A 'url' property or function must be specified");return f.isFunction(a.url)?a.url():a.url},j=function(a,b,c){return function(d){a?a(b,d):b.trigger("error",b,d,c)}}})();
;
    }).call(module.exports);
    
    _browserifyRequire.modules["backbone/backbone-min"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./controllers/application"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./application.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./controllers/application", path);
    };
    
    (function () {
        var _        = require('underscore')
,   Backbone = require('backbone')

var MainToolbar  = require('../views/main_toolbar')
,   WorldToolbar = require('../views/world_toolbar')
,   Editor       = require('../views/editor')
,   World2D      = require('../views/world_2d')
,   World3D      = require('../views/world_3d')
,   Toggle       = require('../views/toggle')
,   Split        = require('../views/split')

var World = require('../models/world')


module.exports = Backbone.Controller.extend({

  initialize: function() {
    this.mainToolbar = new MainToolbar({ el: $('#main-toolbar') })
    this.mainToolbar.bind('change:view', _.bind(function(x) {
      this.toggle.show(['2D', '3D'].indexOf(x))
    }, this))
    this.mainToolbar.bind('run', _.bind(this.run, this))
    
    this.editor = new Editor()
    this.world  = new World(this.mainToolbar.getNewDimensions())
    
    this.initWorld()
    
    this.mainToolbar.model = this.world
    this.worldToolbar = new WorldToolbar({
      el: $('#world-toolbar'),
      model: this.world
    })
  },

  initWorld: function() {
    this.world.bind('line', _.bind(this.editor.gotoLine, this.editor))
    
    $('#world').html('') // clear
    this.world2D = new World2D({ model: this.world })
    this.world3D = new World3D({ model: this.world })
    
    var onDropWorld = _.bind(function(textData) {
      this.world = World.fromString(textData)
      this.initWorld()
      this.world.trigger('change:all')
      this.world.trigger('change', 'all')
    }, this)
    
    this.world2D.bind('drop-world', onDropWorld)
    this.world3D.bind('drop-world', onDropWorld)
    
    this.toggle = new Toggle({
      subviews: [this.world2D, this.world3D]
    })
    if (this.split) this.split.el.html('')
    this.split = new Split({
      el: $('#split-view'),
      left: this.editor,
      right: this.toggle,
      ratio: 0.4
    })
    this.split.render()
    
    this.mainToolbar.changeView()
  },

  routes: {
    'examples/:name': 'loadExample',
    'export': 'showSource'
  },

  loadExample: function(name) {
    $.ajax({
      url: 'examples/'+name+'.js',
      dataType: 'text',
      success: _.bind(this.editor.setValue, this.editor)
    })
  },

  showSource: function() {
    history.pushState(null, "export", 'welt.kdw')
    var overlay = $('<div class="export" />')
      .text(this.world.toString())
      .appendTo($('body'))
    
    var selection = window.getSelection()
    var range = document.createRange()
    range.selectNodeContents(overlay.get(0))
    selection.removeAllRanges()
    selection.addRange(range)
    
    window.onpopstate = function() {
      overlay.remove()
      delete window.onpushstate
    }
  },

  run: function() {
    this.world.run(this.editor.getValue())
  }

})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./controllers/application"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./models/position_and_direction"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./position_and_direction.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./models/position_and_direction", path);
    };
    
    (function () {
        function Position(x, y) {
  this.x = x
  this.y = y
}

Position.prototype.plus = function(another) {
  return new Position(this.x + another.x, this.y + another.y)
}


function Direction(x, y) {
  this.x = x
  this.y = y
}

Direction.NORTH = new Direction(0, -1)
Direction.prototype.isNorth = function() {
  return this.equals(Direction.NORTH)
}

Direction.SOUTH = new Direction(0, 1)
Direction.prototype.isSouth = function() {
  return this.equals(Direction.SOUTH)
}

Direction.WEST = new Direction(-1, 0)
Direction.prototype.isWest = function() {
  return this.equals(Direction.WEST)
}

Direction.EAST = new Direction(1, 0)
Direction.prototype.isEast = function() {
  return this.equals(Direction.EAST)
}

Direction.prototype.turnRight = function() {
  return new Direction(-this.y, this.x)
}

Direction.prototype.turnLeft = function() {
  return new Direction(this.y, -this.x)
}


Position.prototype.clone = Direction.prototype.clone = function() {
  return new this.constructor(this.x, this.y)
}

Position.prototype.equals = Direction.prototype.equals = function(another) {
  return another instanceof this.constructor
    && another.x == this.x
    && another.y == this.y
}

module.exports = {
  Position:  Position,
  Direction: Direction
}
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./models/position_and_direction"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./models/robot"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./robot.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./models/robot", path);
    };
    
    (function () {
        var _         = require('underscore')
,   Backbone  = require('backbone')
,   settings  = require('../settings')
,   beep      = require('../helpers/beep')
,   Position  = require('../models/position_and_direction').Position
,   Direction = require('../models/position_and_direction').Direction


function error(key) {
  throw new Error(settings.ERRORS[key])
}

function errorFunction(msg) {
  return _(error).bind(null, msg)
}


var Robot = Backbone.Model.extend({

  /*
   * Internals
   */

  defaults: {
    position: new Position(0, 0),
    direction: Direction.SOUTH
  },

  initialize: function(opts) {
    // Cache (for performance reasons)
    var setCurrentField = _.bind(function() {
      this.$currentField = this.getField(this.$position)
    }, this)
    setCurrentField()
    this.bind('change:position', setCurrentField)
    this.$world.bind('change:fields', setCurrentField)
  },

  // Overwrite backbone's set method for performance reasons
  set: function(attrs, options) {
    // - validations, - escaped attributes, - changes tracking
    if (attrs.attributes) attrs = attrs.attributes
    var silent = options && options.silent
    var change = false
    for (var attr in attrs) {
      change = true
      var val = attrs[attr]
      this.attributes[attr] = val
      this['$'+attr] = val
      if (!silent) this.trigger('change:'+attr)
    }
    if (change && !silent) this.trigger('change')
  },

  getField: function(position) {
    return this.$world.getField(position)
  },

  forward: function() {
    return this.$position.plus(this.$direction)
  },

  isValid: function(position) {
    var x = position.x
    ,   z = position.y
    return x >= 0 && x < this.$world.get('width') && z >= 0 && z < this.$world.get('depth')
  },


  /*
   * API
   */

  isBrick: function(n) {
    if (this.istWand()) return false
    var bricks = this.getField(this.forward()).bricks
    return n ? (bricks == n) : !!bricks
  },

  putBrick: function() {
    if (this.istWand()) error('put_brick_wall')
    var nextPosition = this.forward()
    this.getField(nextPosition).bricks += 1
    this.$world.triggerChangeField(nextPosition)
    return this
  },

  removeBrick: function() {
    if (this.istWand()) error('remove_brick_wall')
    var nextPosition = this.forward()
    var field = this.getField(nextPosition)
    if (!field.bricks) error('remove_brick_no_brick')
    field.bricks--
    this.$world.triggerChangeField(nextPosition)
    return this
  },

  putMarker: function() {
    this.$currentField.marker = true
    this.$world.triggerChangeField(this.$position)
    return this
  },

  removeMarker: function() {
    this.$currentField.marker = false
    this.$world.triggerChangeField(this.$position)
    return this
  },

  toggleMarker: function() {
    this.$currentField.marker = !this.$currentField.marker
    this.$world.triggerChangeField(this.$position)
    return this
  },

  isMarker: function() {
    return this.$currentField.marker
  },

  isWall: function() {
    var next = this.forward()
    return !this.isValid(next) || this.getField(next).block
  },

  turnLeft: function() {
    this.set({ direction: this.$direction.turnLeft() })
    return this
  },

  turnRight: function() {
    this.set({ direction: this.$direction.turnRight() })
    return this
  },

  move: function() {
    if (this.istWand()) error('move_wall')
    var newPosition = this.forward()
    if (Math.abs(this.$currentField.bricks - this.getField(newPosition).bricks) > settings.MAX_JUMP_HEIGHT) {
      error('move_too_high')
    }
    this.set({ position: newPosition })
    return this
  },

  moveBackwards: function() {
    var newPosition = this.$position.plus(this.$direction.turnLeft().turnLeft())
    var field = this.getField(newPosition)
    if (!this.isValid(newPosition) || field.block) error('move_wall')
    if (Math.abs(this.$currentField.bricks - field.bricks) > settings.MAX_JUMP_HEIGHT) {
      error('move_too_high')
    }
    this.set({ position: newPosition })
    return this
  },

  putBlock: function() {
    var position = this.forward()
    if (!this.isValid(position)) error('put_block_wall')
    var field = this.getField(position)
    if (field.block) error('put_block_already_is_block')
    if (field.bricks) error('put_block_is_brick')
    field.block = true
    this.$world.triggerChangeField(position)
    return this
  },

  removeBlock: function() {
    var position = this.forward()
    if (!this.isValid(position)) error('remove_block_wall')
    var field = this.getField(position)
    if (!field.block) error('remove_block_no_block')
    field.block = false
    this.$world.triggerChangeField(position)
    return this
  },

  beep: function() {
    beep()
    return this
  },

  isNorth: function() { return this.$direction.isNorth() },
  isSouth: function() { return this.$direction.isSouth() },
  isWest:  function() { return this.$direction.isWest() },
  isEast:  function() { return this.$direction.isEast() },

  attempt: function(fn) {
    var clone = this.clone()
    try {
      return fn()
    } catch(exc) {
      this.set(clone)
      this.trigger('change:all')
      this.trigger('change')
    }
    return this
  },

})

var translate = function(dict) {
  for (var word in dict) {
    if (dict.hasOwnProperty(word)) {
      Robot.prototype[dict[word]] = Robot.prototype[word]
    }
  }
  return dict
}

// German
var GERMAN_TRANSLATION = translate({
  attempt:       'probiere',
  move:          'schritt',
  moveBackwards: 'schrittRueckwaerts',
  turnLeft:      'linksDrehen',
  turnRight:     'rechtsDrehen',
  beep:          'tonErzeugen',
  isNorth:       'istNorden',
  isSouth:       'istSueden',
  isWest:        'istWesten',
  isEast:        'istOsten',
  isWall:        'istWand',
  isBrick:       'istZiegel',
  putBrick:      'hinlegen',
  removeBrick:   'aufheben',
  isMarker:      'istMarke',
  putMarker:     'markeSetzen',
  toggleMarker:  'markeUmschalten',
  removeMarker:  'markeLoeschen',
  putBlock:      'quaderAufstellen',
  removeBlock:   'quaderEntfernen'
})

// Export German commands for compiling .kdp files
Robot.BUILT_IN_CMDS = Object.keys(GERMAN_TRANSLATION)
  .map(function(key) {
    return GERMAN_TRANSLATION[key]
  })
  .concat(['schnell', 'langsam', 'istLeer', 'istVoll']) // TODO: implement these commands

module.exports = Robot
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./models/robot"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./models/world"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./world.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./models/world", path);
    };
    
    (function () {
        var _             = require('underscore')
,   Backbone      = require('backbone')
,   clone         = require('../helpers/clone')
,   getLineNumber = require('../helpers/get_line_number')
,   matrix        = require('../helpers/matrix')
,   settings      = require('../settings')
,   sandbox       = require('../helpers/sandbox')
,   Position      = require('../models/position_and_direction').Position
,   Robot         = require('../models/robot')


function Field() {
  this.bricks = 0
  this.marker = false
  this.block  = false
}

Field.prototype.clone = function() {
  var f = new Field()
  f.bricks = this.bricks
  f.marker = this.marker
  f.block  = this.block 
  return f
}


module.exports = Backbone.Model.extend({

  initialize: function(opts) {
    if (!this.get('fields')) {
      this.set({
        fields: matrix(
          this.get('width'),
          this.get('depth'),
          function() { return new Field() }
        )
      })
    }
    
    this.$fields = this.get('fields')
    this.bind('change:fields', function() {
      this.trigger('change:all')
      this.$fields = this.get('fields')
    })
    
    this.createRobot(opts.robotOptions)
  },

  createRobot: function(opts) {
    opts = opts || {}
    opts.world = this
    var r = new Robot(opts)
    
    r.bind('change', _.bind(function() {
      this.trigger('change:robot')
      this.trigger('change', 'robot')
    }, this))
    
    this.set({ robot: r })
    return r
  },

  // Overwrite backbone's clone method
  clone: function() {
    // + make a copy of the attributes
    return new this.constructor(clone(this.attributes))
  },

  triggerChangeField: function(p) {
    this.trigger('change:field', p.x, p.y, this.getField(p))
    this.trigger('change')
  },

  getField: function(position) {
    return this.$fields[position.x][position.y]
  },

  run: function(code) {
    this.backup = this.clone()
    
    var self = this
    this.execute(code, function(stack) {
      console.log('Commands: ', stack)
      self.stack = stack
    })
  },

  execute: function(code, callback) {
    // TODO: refactor?
    var stack = []
    var self = this
    var timed = []
    var addTimed = _.bind(timed.push, timed)
    var removeTimed = function(obj) {
      var index = timed.indexOf(obj)
      if (index != -1) timed.splice(index, 1)
    }
    var END_EXC = new Error('end')
    
    function stop(obj) {
      clearTimeout(obj)
      clearInterval(obj)
      if (typeof obj.abort == 'function') obj.abort()
    }
    
    function stopAll() {
      _(timed).each(stop)
      timed = []
    }
    
    function exec(fn) {
      try {
        fn()
      } catch (exc) {
        if (exc != END_EXC) {
          stack.push(exc)
        }
        stopAll()
      }
      end()
    }
    
    function end() {
      if (!timed.length) {
        callback(stack)
      }
    }
    
    var globals = {}
    
    var robot = this.get('robot')
    ,   karel = globals.karel = {}
    _.each(['istWand', 'schritt', 'linksDrehen', 'rechtsDrehen', 'hinlegen', 'aufheben', 'istZiegel', 'markeSetzen', 'markeLoeschen', 'istMarke', 'istNorden', 'istSueden', 'istWesten', 'istOsten', 'ton', 'probiere'], function(name) {
      karel[name] = function(n) {
        n = n || 1
        
        if (settings.HIGHLIGHT_LINE) {
          try {
            throw new Error()
          } catch (exc) {
            var lineNumber = getLineNumber(exc.stack, 1)
          }
        } else {
          var lineNumber = null
        }
        
        if (robot[name].length == 0) {
          for (var i = 0; i < n; i++) {
            var result = robot[name]()
            stack.push([name, lineNumber])
          }
        } else {
          var result = robot[name].apply(robot, arguments)
          stack.push([name, lineNumber])
        }
        return result
      }
    })
    
    globals.warten = function(fn, ms) {
      var timeout = setTimeout(function() {
        removeTimed(timeout)
        exec(fn)
      }, ms)
      addTimed(timeout)
      return timeout
    }
    
    globals.periode = function(fn, ms) {
      var interval = setInterval(function() {
        exec(fn)
      }, ms)
      addTimed(interval)
      return interval
    }
    
    globals.laden = function(opts, fn) {
      var req = $.ajax(opts)
        .success(function(responseText) {
          removeTimed(req)
          exec(_.bind(fn, null, responseText))
        })
        .error(function() {
          removeTimed(req)
        })
      addTimed(req)
      return req
    }
    
    globals.stoppen = function(obj) {
      stop(obj)
      removeTimed(obj)
      end()
    }
    
    globals.beenden = function() {
      throw END_EXC
    }
    
    exec(function() {
      sandbox.run(code, globals)
    })
  },

  next: function() {
    var pair = this.stack.shift()
    ,   command = pair[0]
    ,   lineNumber = pair[1]
    
    if (typeof command == 'string') {
      this[command]()
    } else if (command instanceof Error) {
      alert(command)
    }
    
    if (lineNumber) this.trigger('line', lineNumber)
  },

  replay: function() {
    this.reset()
    
    var self = this
    var interval = setInterval(function() {
      if (self.stack.length == 0) {
        clearInterval(interval)
      } else {
        self.next()
      }
    }, 150)
  },

  reset: function() {
    this.set(this.backup.attributes)
    this.trigger('change:all')
    this.trigger('change')
  },

  eachField: function(fn) {
    var fields = this.$fields
    ,   w = this.get('width')
    ,   d = this.get('depth')
    for (var x = 0; x < w; x++) {
      for (var y = 0; y < d; y++) {
        fn(x, y, fields[x][y])
      }
    }
  },

  toString: function() {
    var tokens = []
    var p = function(c) { field_height--; tokens.push(c) }
    
    var fields = this.get('fields')
    var height = Math.max(5, 1 + _.max(_.map(fields, function(row) {
      return _.max(_.pluck(row, 'bricks'))
    })))
    
    p('KarolVersion2Deutsch')
    
    p(this.get('width'))
    p(this.get('depth'))
    p(height)
    
    var position = this.get('robot').get('position')
    p(position.x)
    p(position.y)
    p(this.getField(position).bricks)
    
    var x = this.get('width')
    ,   y = this.get('depth')
    for (var i = 0; i < x; i++) {
      for (var j = 0; j < y; j++) {
        var field = fields[i][j]
        ,   field_height = height
        if (field.block) {
          p('q'); p('q')
        } else {
          _.times(field.bricks, function() { p('z') })
        }
        while (field_height > 0) p('n')
        p(field.marker ? 'm' : 'o')
      }
    }
    
    return tokens.join(' ') + ' '
  }

}, {
  path: 'models/world',
  
  Field: Field,
  
  fromString: function(str) {
    // Parse .kdw files
    
    var tokens = str.split(/\s/)
    var shift = _(tokens.shift).bind(tokens)
    var _int = function() { return parseInt(shift(), 10) }
    
    tokens.shift() // "KarolVersion2Deutsch"
    
    // Dimensions of the world
    var x = _int(), y = _int(), z = _int()
    
    // Position of the robot
    var px = _int(), py = _int(), pz = _int()
    
    var world = new this({
      width: x,
      depth: y,
      robotOptions: {
        position: new Position(px, py)
      }
    })
    
    var fields = world.get('fields')
    
    for (var i = 0; i < x; i++) {
      for (var j = 0; j < y; j++) {
        var field = new Field()
        if (tokens[0] == 'q') field.block = true
        for (var k = 0; k < z; k++) {
          if (shift() == 'z') field.bricks++
        }
        field.marker = (shift() == 'm')
        fields[i][j] = field
      }
    }
    
    return world
  }

})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./models/world"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./helpers/sandbox"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./sandbox.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./helpers/sandbox", path);
    };
    
    (function () {
        var _ = require('underscore')

var run
if (typeof document == 'object') { // assume we're in the browser
  run = function(code, globals) {
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    var win = iframe.contentWindow
    win.parent = null
    _.extend(win, globals)
    win.document.write('<script>'+code+'</script>') // evil, I know
  }
} else { // Node.js
  run = require('vm').runInNewContext
}

exports.run = run
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./helpers/sandbox"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./helpers/clone"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./clone.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./helpers/clone", path);
    };
    
    (function () {
        // deep clone
function clone(obj) {
  if (typeof obj.clone == 'function') {
    return obj.clone()
  } else if (obj instanceof Array) {
    var n = []
    for (var i = 0, l = obj.length; i < l; i++) {
      n[i] = clone(obj[i])
    }
    return n
  } else if (typeof obj == 'object') {
    var n = {}
    for (var key in obj) {
      n[key] = clone(obj[key])
    }
    return n
  } else {
    return obj
  }
}

module.exports = clone
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./helpers/clone"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./helpers/beep"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./beep.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./helpers/beep", path);
    };
    
    (function () {
        //this.initBeepSound() // Because Chrome can't replay
if (this.window && window.Audio) {
  var sound = new Audio()
  if (sound.canPlayType('audio/ogg; codecs="vorbis"')) {
    sound.src = 'assets/beep.ogg'
  } else if (sound.canPlayType('audio/mpeg;')) {
    sound.src = 'assets/beep.mp3'
  }
  var beep = function() { sound.play() }
} else {
  var beep = function() {}
}

module.exports = beep
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./helpers/beep"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./helpers/get_key"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./get_key.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./helpers/get_key", path);
    };
    
    (function () {
        function getKey(evt) {
  var key = getKey.table[evt.keyCode]
  if (!key) {
    key = String.fromCharCode(evt.keyCode)
    if (!evt.shiftKey) {
      key = key.toLowerCase()
    }
  }
  return key
}

getKey.table = {
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
}

module.exports = getKey
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./helpers/get_key"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./helpers/get_line_number"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./get_line_number.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./helpers/get_line_number", path);
    };
    
    (function () {
        function getLineNumber(stack, n) {
  var fn
  if ($.browser.webkit)  fn = getLineNumber.webkit
  if ($.browser.mozilla) fn = getLineNumber.mozilla
  return fn ? fn(stack, n) : null
}

getLineNumber.webkit = function(stack, n) {
  var lines = stack.split("\n")
  var line = lines[1+n]
  var match = line.match(/:(\d+):\d+\)?$/)
  if (match) {
    return Number(match[1])
  } else {
    return null
  }
}

getLineNumber.mozilla = function(stack, n) {
  var lines = stack.split("\n")
  var line = lines[1+n]
  var match = line.match(/:(\d+)$/)
  if (match) {
    return Number(match[1])
  } else {
    return null
  }
}

getLineNumber.possible = function() {
  return $.browser.webkit || $.browser.mozilla
}

module.exports = getLineNumber
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./helpers/get_line_number"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./helpers/matrix"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./matrix.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./helpers/matrix", path);
    };
    
    (function () {
        function matrix(x, y, fn) {
  var result = []
  for (var i = 0; i < x; i++) {
    var row = []
    for (var j = 0; j < y; j++) {
      row.push(fn())
    }
    result.push(row)
  }
  return result
}

module.exports = matrix
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./helpers/matrix"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./extend_backbone"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./extend_backbone.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./extend_backbone", path);
    };
    
    (function () {
        // Freedom-patch Backbone

var _        = require('underscore')
,   Backbone = require('backbone')

_.extend(Backbone.View.prototype, {

  // handy in events hash
  preventDefault: function(evt) {
    evt.preventDefault()
  },

  appendTo: function(p) {
    $(p).append(this.el)
    this.trigger('dom:insert')
    return this
  },

  remove: function() {
    $(this.el).remove()
    this.trigger('dom:remove')
    return this
  },

  detach: function() {
    $(this.el).detach()
    this.trigger('dom:remove')
    return this
  }

})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./extend_backbone"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./views/world_toolbar"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./world_toolbar.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./views/world_toolbar", path);
    };
    
    (function () {
        var _        = require('underscore')
,   Backbone = require('backbone')
,   getKey   = require('../helpers/get_key')

module.exports = Backbone.View.extend({

  initialize: function() {
    this.initButtons()
    this.initKeyboard()
  },

  initButtons: function() {
    var robot = this.model.get('robot')
    this.$('input[type=button]').live('click', function() {
      robot[$(this).attr('data-method')]()
    })
  },

  initKeyboard: function() {
    var actions = {
           left: 'turnLeft',
          right: 'turnRight',
             up: 'move',
           down: 'moveBackwards',
          space: 'toggleMarker',
          enter: 'putBrick',
      backspace: 'removeBrick',
       'delete': 'removeBlock',
              h: 'putBrick',     // Ziegel *h*inlegen
              a: 'removeBrick',  // Ziegel *a*ufheben
              m: 'toggleMarker', // *M*arke umschalten
              q: 'putBlock',     // *Q*uader aufstellen
              e: 'removeBlock'   // Quader *e*ntfernen
    }
    
    $(document).keydown(_(function(evt) {
      var key = getKey(evt)
      console.log('key pressed: ' + key)
      if (actions.hasOwnProperty(key)) {
        this.model.get('robot')[actions[key]]()
      }
    }).bind(this))
  }

})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./views/world_toolbar"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./views/main_toolbar"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./main_toolbar.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./views/main_toolbar", path);
    };
    
    (function () {
        var Backbone = require('backbone')

module.exports = Backbone.View.extend({

  events: {
    'click #run-button': 'run',
    'click #replay-button': 'replay',
    'click #reset-button': 'reset',
    'click input[name=view-select]': 'clickChangeView',
    'change input[name=view-select]': 'changeView',
    
    'click #new-button, #new-cancel-button': 'toggleNewPane',
    'click #new-apply-button': 'newApply'
  },

  run: function() {
    this.trigger('run')
  },

  replay: function() {
    this.model.replay()
  },

  reset: function() {
    this.model.reset()
  },

  // mainly for testing with zombie.js
  clickChangeView: function(evt) {
    $('input[name=view-select]').attr('checked', false)
    $(evt.target).attr('checked', true)
    this.changeView()
  },

  changeView: function() {
    this.trigger('change:view', $('input[name=view-select]:checked').val())
  },

  toggleNewPane: function() {
    this.$('#new-pane').toggleClass('visible')
  },

  newApply: function() {
    this.controller.initialize()
    this.toggleNewPane()
  },

  getNewDimensions: function() {
    return {
      width: parseInt(this.$('#width').val(), 10),
      depth: parseInt(this.$('#depth').val(), 10)
    }
  }

})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./views/main_toolbar"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./views/split"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./split.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./views/split", path);
    };
    
    (function () {
        var _        = require('underscore')
,   Backbone = require('backbone')

module.exports = Backbone.View.extend({

  className: 'split-view',

  initialize: function(opts) {
    _.bindAll(this, 'onMousedown', 'onMousemove', 'render')
    
    this.left  = opts.left
    this.right = opts.right
    this.ratio = opts.ratio || 0.5
    
    this.leftEl    = $(this.left.el)
    this.separator = $('<div class="separator" />')
    this.rightEl   = $(this.right.el)
    
    this.el.append(this.leftEl)
    this.el.append(this.separator)
    this.el.append(this.rightEl)
    
    $(window).resize(this.render)
    this.separator.mousedown(this.onMousedown)
  },

  onMousedown: function(evt) {
    this.x = evt.pageX
    
    $(document)
      .mousemove(this.onMousemove)
      .mouseup(function onMouseup() {
        $(this)
          .unbind('mousemove', this.onMousemove)
          .unbind('mouseup',   onMouseup)
      })
  },

  onMousemove: function(evt) {
    this.resizeSubviews(evt.pageX - this.x)
    this.x = evt.pageX
  },

  resizeSubviews: function(deltaX) {
    var left  = this.leftEl
    ,   right = this.rightEl
    ,   leftWidth = left.width() + deltaX
    ,   rightWidth = right.width() - deltaX
    
    this.ratio = leftWidth / (leftWidth+rightWidth)
    
    left.width(leftWidth)
    if (typeof this.left.resize == 'function') this.left.resize()
    right.width(rightWidth)
    if (typeof this.right.resize == 'function') this.right.resize()
  },

  resize: function() {
    this.render()
  },

  render: function() {
    var availWidth = $(this.el).width() - this.separator.width()
    ,   leftWidth  = Math.round(this.ratio * availWidth)
    ,   rightWidth = availWidth - leftWidth
    
    this.leftEl.width(leftWidth)
    this.rightEl.width(rightWidth)
    
    this.left.render()
    this.right.render()
    
    return this
  }

})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./views/split"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./views/editor"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./editor.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./views/editor", path);
    };
    
    (function () {
        var _ = require('underscore')
,   Backbone = require('backbone')

module.exports = Backbone.View.extend({

  className: 'editor',

  initialize: function() {
    $(this.el).css({ position: 'relative' })
    var el = $('<div />')
      .css({ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 })
      .appendTo(this.el)
    
    try {
      var e = this.editor  = ace.edit(el.get(0))
      var s = this.session = e.getSession()
      
      // Use ACE's require function, thus `window`
      s.setMode(new (window.require('ace/mode/javascript').Mode))
      s.setTabSize(2)
      s.setUseSoftTabs(true)
      e.setShowPrintMargin(false)
      
      var focused = false
      e.onBlur = _.wrap(e.onBlur, function(old) {
        focused = false
        old.apply(this)
      })
      e.onFocus = _.wrap(e.onFocus, function(old) {
        focused = true
        old.apply(this)
      })
      
      $(this.el).keydown(function(evt) {
        if (focused) evt.stopPropagation()
      })
    } catch (exc) {
      // this happens when testing with zombie.js
      console.error(exc)
    }
  },

  resize: function() {
    this.editor.resize()
  },

  getValue: function() {
    return this.session.getValue()
  },

  setValue: function(v) {
    return this.session.setValue(v)
  },

  gotoLine: function(n) {
    this.editor.gotoLine(n)
  }
})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./views/editor"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./views/world_3d"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./world_3d.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./views/world_3d", path);
    };
    
    (function () {
        var _         = require('underscore')
,   settings  = require('../settings')
,   matrix    = require('../helpers/matrix')
,   WorldBase = require('../views/world_base')

var hasCanvasSupport =
  typeof document.createElement('canvas').getContext == 'function'

module.exports = WorldBase.extend(!hasCanvasSupport ? {} : {

  initialize: function() {
    _(this).bindAll(
      'updateRobot', 'updateField', 'updateAllFields',
      'resize', 'render', 'delayRender'
    )
    
    this.model
      .bind('change:field', this.updateField)
      .bind('change:robot', this.updateRobot)
      .bind('change:all', this.updateAllFields)
      .bind('change:all', this.updateRobot)
      .bind('change', this.delayRender)
    
    this.bind('dom:insert', this.resize)
    
    this.createFields()
    this.renderer = new THREE.CanvasRenderer()
    $(this.el).append(this.renderer.domElement)
    this.scene = new THREE.Scene()
    this.degrees = 45
    this.cameraZ = 120
    this.radius = 400
    this.createGrid()
    this.createLights()
    
    this.initScrollEvents()
  },

  GW: 40, // Grid Width
  GH: 22, // Grid Height
  WALL_HEIGHT: 5,

  events: {
    mousedown: 'onMousedown',
    dragover:  'preventDefault',
    dragenter: 'preventDefault',
    drop:      'onDrop'
  },

  onMousedown: function(evt) {
    var down = { x: evt.clientX, y: evt.clientY }
    
    $('body')
      .css('cursor', 'move')
      .mousemove(_(function(evt) {
        var newDown = { x: evt.clientX, y: evt.clientY }
        var d_x = down.x - newDown.x
        ,   d_y = down.y - newDown.y
        this.degrees += d_x / 4
        this.cameraZ -= d_y * 2
        this.updateCameraPosition()
        this.render()
        down = newDown
      }).bind(this))
      .mouseup(function() {
        $('body')
          .css('cursor', 'default')
          .unbind('mousemove')
          .unbind('mouseup')
      })
  },

  initScrollEvents: function() {
    var hover = false
    $(this.el)
      .mouseover(function() { hover = true })
      .mouseout (function() { hover = false })
    
    var zoom = _(function(r) {
      if (hover) {
        this.radius *= r
        this.updateCameraPosition()
        this.render()
      }
    }).bind(this)
    
    // IE, Webkit, Opera
    $(document).bind('mousewheel', function(evt) {
      zoom(1 - evt.wheelDelta/2400)
    })
    // Firefox
    $(window).bind('DOMMouseScroll', function(evt) {
      zoom(1 + evt.detail/20)
    })
  },

  createGrid: function() {
    var model = this.model
    var w = model.get('width')
    ,   d = model.get('depth')
    ,   h = this.WALL_HEIGHT
    
    var material = new THREE.MeshBasicMaterial({
      color: 0x5555cc,
      wireframe: true
    })
    var GW = this.GW
    ,   GH = this.GH
    
    // Ground
    var plane = new THREE.Mesh(new THREE.Plane(w*GW, d*GW, w, d), material)
    plane.doubleSided = true
    this.scene.addObject(plane)
    
    // Back
    var plane = new THREE.Mesh(new THREE.Plane(w*GW, h*GH, w, h), material)
    plane.position.y = (d/2)*GW
    plane.position.z = (h/2)*GH
    plane.rotation.x = Math.PI/2
    plane.doubleSided = true
    this.scene.addObject(plane)
    
    // Left Side
    var plane = new THREE.Mesh(new THREE.Plane(h*GH, d*GW, h, d), material)
    plane.position.x = -(w/2)*GW
    plane.position.z = (h/2)*GH
    plane.rotation.y = Math.PI/2
    plane.doubleSided = true
    this.scene.addObject(plane)
  },

  createLights: function() {
    var l = new THREE.AmbientLight(0x888888)
    this.scene.addLight(l)
    
    var l = this.light = new THREE.DirectionalLight(0xaaaaaa)
    this.scene.addLight(l)
  },

  createFields: function() {
    var m = this.model
    this.fields = matrix(m.get('width'), m.get('depth'), function() {
      return { bricks: [], marker: null }
    })
  },

  updateAllFields: function() {
    this.model.eachField(_.bind(this.updateField, this))
  },

  updateField: function(x, y, field) {
    var model = this.model
    var scene = this.scene
    var fieldObj = this.fields[x][y]
    
    var GW = this.GW
    ,   GH = this.GH
    var x0 = -GW*(model.get('width')/2)
    ,   y0 = GW*(model.get('depth')/2)
    
    while (field.bricks < fieldObj.bricks.length) {
      scene.removeObject(fieldObj.bricks.pop())
      if (fieldObj.marker) {
        fieldObj.marker.position.z = fieldObj.bricks.length*GH
      }
    }
    
    while (field.bricks > fieldObj.bricks.length) {
      var z = fieldObj.bricks.length
      var cube = new THREE.Mesh(
        new THREE.Cube(GW, GW, GH, 1, 1),
        new THREE.MeshLambertMaterial({
          color: settings.COLORS.BRICK,
          shading: THREE.FlatShading
        })
      )
      cube.position.x = GW/2 + x0 + x*GW
      cube.position.y = -GW/2 + y0 - y*GW
      cube.position.z = GH/2 + z*GH
      scene.addObject(cube)
      fieldObj.bricks.push(cube)
      if (fieldObj.marker) {
        fieldObj.marker.position.z = fieldObj.bricks.length*GH
      }
    }
    
    if (!field.marker && fieldObj.marker) {
      scene.removeObject(fieldObj.marker)
      delete fieldObj.marker
    }
    
    if (field.marker && !fieldObj.marker) {
      var marker = new THREE.Mesh(
        new THREE.Plane(GW, GW, 1, 1),
        new THREE.MeshBasicMaterial({ color: settings.COLORS.MARKER })
      )
      marker.position.x = GW/2 + x0 + x*GW
      marker.position.y = -GW/2 + y0 - y*GW
      marker.position.z = fieldObj.bricks.length*GH + 1
      scene.addObject(marker)
      fieldObj.marker = marker
    }
    
    if (field.block && !fieldObj.block) {
      var cube = new THREE.Mesh(
        new THREE.Cube(GW, GW, 2*GH, 1, 1),
        new THREE.MeshLambertMaterial({
          color: settings.COLORS.BLOCK,
          shading: THREE.FlatShading
        })
      )
      cube.position.x = GW/2 + x0 + x*GW
      cube.position.y = -GW/2 + y0 - y*GW
      cube.position.z = GH
      scene.addObject(cube)
      fieldObj.block = cube
    }
    
    if (!field.block && fieldObj.block) {
      scene.removeObject(fieldObj.block)
      delete fieldObj.block
    }
  },

  updateRobot: function() {
    // TODO: Update the position of the robot
  },

  resize: function() {
    var parent = $(this.el).parent()
    ,   width  = parent.innerWidth()
    ,   height = parent.innerHeight()
    
    this.createCamera(width, height)
    this.renderer.setSize(width, height)
    
    if (this.isVisible()) this.render()
  },

  render: function() {
    console.log('Render 3D')
    this.renderer.render(this.scene, this.camera)
    return this
  },

  createCamera: function(width, height) {
    this.camera = new THREE.Camera(75, width/height, 1, 1e5)
    this.camera.up = new THREE.Vector3(0, 0, 1)
    this.updateCameraPosition()
  },

  updateCameraPosition: function() {
    var degrees = this.degrees
    var radian = degrees * (Math.PI/180)
    var p1 = this.camera.position
    var p2 = this.light.position
    
    p1.x = p2.x =  Math.sin(radian) * this.radius
    p1.y = p2.y = -Math.cos(radian) * this.radius
    p1.z = p2.z = this.cameraZ
    
    p2.normalize()
  }

})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./views/world_3d"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./views/world_base"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./world_base.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./views/world_base", path);
    };
    
    (function () {
        var _ = require('underscore')
,   Backbone = require('backbone')

module.exports = Backbone.View.extend({

  onDrop: function(evt) {
    evt.preventDefault()
    evt = evt.originalEvent
    var reader = new FileReader()
    reader.onloadend = _.bind(function(evt) {
      this.trigger('drop-world', evt.target.result)
    }, this)
    reader.readAsText(evt.dataTransfer.files[0])
  },

  isVisible: function() {
    return !!$(this.el).parent().length
  },

  delayRender: function() {
    if (this.isVisible()) {
      clearTimeout(this.renderTimeout)
      this.renderTimeout = setTimeout(_.bind(this.render, this), 20)
    }
  }

})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./views/world_base"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./views/toggle"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./toggle.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./views/toggle", path);
    };
    
    (function () {
        var _        = require('underscore')
,   Backbone = require('backbone')

module.exports = Backbone.View.extend({

  className: 'toggle-view',

  initialize: function(opts) {
    this.subviews = opts.subviews
    this.show(0)
  },

  show: function(n) {
    _.each(this.subviews, function(v) {
      v.detach()
    })
    
    this.subviews[n].appendTo(this.el).render()
  },

  resize: function() {
    _.each(this.subviews, function(v) {
      if (typeof v.resize == 'function') v.resize()
    })
  }

})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./views/toggle"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./views/world_2d"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./world_2d.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./views/world_2d", path);
    };
    
    (function () {
        var _         = require('underscore')
,   Position  = require('../models/position_and_direction').Position
,   WorldBase = require('../views/world_base')

module.exports = WorldBase.extend({

  initialize: function() {
    _(this).bindAll('render', 'delayRender')
    
    this.model.bind('change', this.delayRender)
    
    this.bind('dom:insert', this.render)
    
    this.createTable()
  },

  createTable: function() {
    var width     = this.model.get('width')
    ,   height    = this.model.get('depth')
    
    this.fields = []
    
    var el = $(this.el)
    for (var i = 0; i < height; i++) {
      var tr = $('<tr />')
      this.fields[i] = []
      for (var j = 0; j < width; j++) {
        var td = $('<td />')
        td.attr('data-x', j)
        td.attr('data-y', i)
        this.fields[i][j] = td
        tr.append(td)
      }
      el.append(tr)
    }
  },

  tagName: 'table',
  className: 'world-2d',

  events: {
    mousedown:   'onMousedown',
    contextmenu: 'preventDefault',
    dragover:    'preventDefault',
    dragenter:   'preventDefault',
    drop:        'onDrop'
  },

  onMousedown: function(evt) {
    var td = $(evt.target)
    if (!td.is('td')) return
    
    var position = new Position(
      parseInt(td.attr('data-x'), 10),
      parseInt(td.attr('data-y'), 10)
    )
    
    if (evt.which == 1) { // left click
      this.model.get('robot').set({ position: position })
    } else {
      var field = this.model.getField(position)
      field.marker = !field.marker
      this.model.triggerChangeField(position)
    }
  },

  render: function() {
    console.log('Render 2D')
    
    var el = $(this.el)
    el.css('display', 'none')
    
    var model = this.model
    var fields = this.fields
    
    model.eachField(function(x, y, field) {
      var td = fields[y][x]
      td[field.marker ? 'addClass' : 'removeClass']('marker')
      td[field.block  ? 'addClass' : 'removeClass']('block')
      td[field.bricks ? 'addClass' : 'removeClass']('brick')
      td.text(field.bricks ? field.bricks : '')
    })
    
    ;(function() {
      var robot        = model.get('robot')
      ,   position     = robot.get('position')
      ,   direction    = robot.get('direction')
      ,   currentField = model.getField(position)
      ,   currentTd    = fields[position.y][position.x]
      
      var char
      if      (direction.isNorth()) char = '\u25b2'
      else if (direction.isSouth()) char = '\u25bc'
      else if (direction.isWest())  char = '\u25c4'
      else    /* east */            char = '\u25ba'
      currentTd.html(char)
    })()
    
    el.css('display', '')
    
    return this
  }

})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./views/world_2d"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./compiler/karol"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./karol.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./compiler/karol", path);
    };
    
    (function () {
        var fs       = require('fs')
,   parser   = require('./parser').parser
,   nodes    = require('./nodes')
,   COMMANDS = require('../models/robot').COMMANDS

if (require.extensions) {
  require.extensions['.kdp'] = function (module, filename) {
    var content = compile(fs.readFileSync(filename, 'utf8'))
    module._compile(content, filename)
  }
}

var comment = /(?:\{[^\}]*\}|\/{2}[^\n]*\n)/g

function stripComments (str) {
  return str.replace(comment, '')
}

function replaceUmlaute (str) {
  return str
    .replace(/ü/g, 'ue')
    .replace(/ö/g, 'oe')
    .replace(/ä/g, 'ae')
    .replace(/ß/g, 'ss')
}

var compile = exports.compile = function (code) {
  nodes.reset()
  var code = stripComments(replaceUmlaute(code.toLowerCase()))
  ,   tree = parser.parse(code)
  //console.log(require('util').inspect(tree, false, 5))
  var js = tree.compile()
  return js
}

parser.yy = nodes
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./compiler/karol"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./compiler/parser"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./parser.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./compiler/parser", path);
    };
    
    (function () {
        /* Jison generated parser */
var karol = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"block":4,"statement":5,"optSemicolon":6,"forceBlock":7,"identifier":8,"IDENTIFIER":9,"while":10,"import":11,"whileTrue":12,"doWhile":13,"for":14,"if":15,"functionDefinition":16,"functionInvocation":17,"conditionDefinition":18,"program":19,"bool":20,"EINFUEGEN":21,"STAR":22,"number":23,"NUMBER":24,"optNumber":25,"WAHR":26,"FALSCH":27,"SEMICOLON":28,"optKarolPrefix":29,"KAROL":30,"DOT":31,"optArgumentList":32,"ANWEISUNG":33,"BEDINGUNG":34,"condition":35,"NICHT":36,"PROGRAMM":37,"argumentList":38,"LPAREN":39,"RPAREN":40,"WENN":41,"DANN":42,"SONST":43,"WIEDERHOLE":44,"MAL":45,"SOLANGE":46,"TUE":47,"IMMER":48,"$accept":0,"$end":1},
terminals_: {2:"error",9:"IDENTIFIER",21:"EINFUEGEN",22:"STAR",24:"NUMBER",26:"WAHR",27:"FALSCH",28:"SEMICOLON",30:"KAROL",31:"DOT",33:"ANWEISUNG",34:"BEDINGUNG",36:"NICHT",37:"PROGRAMM",39:"LPAREN",40:"RPAREN",41:"WENN",42:"DANN",43:"SONST",44:"WIEDERHOLE",45:"MAL",46:"SOLANGE",47:"TUE",48:"IMMER"},
productions_: [0,[3,1],[4,0],[4,3],[7,2],[7,3],[8,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[5,1],[11,4],[23,1],[25,0],[25,1],[20,1],[20,1],[6,0],[6,1],[29,0],[29,2],[17,3],[16,6],[18,5],[35,1],[35,2],[19,4],[38,3],[32,0],[32,1],[15,8],[15,6],[14,6],[10,6],[10,6],[12,5],[13,6]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return this.$ = $$[$0].dontIndent(); 
break;
case 2: this.$ = new yy.Block(); 
break;
case 3: this.$ = $$[$0-2].addStatement($$[$0-1]); 
break;
case 4: this.$ = (new yy.Block()).addStatement($$[$0-1]); 
break;
case 5: this.$ = $$[$0-2].addStatement($$[$0-1]); 
break;
case 6: this.$ = new yy.Identifier($$[$0]); 
break;
case 18: this.$ = new yy.Import($$[$0-2]); 
break;
case 19: this.$ = parseInt($$[$0], 10); 
break;
case 22: this.$ = new yy.Bool(true); 
break;
case 23: this.$ = new yy.Bool(false); 
break;
case 28: this.$ = new yy.FunctionInvocation($$[$0-1], $$[$0]); 
break;
case 29: this.$ = new yy.FunctionDefinition($$[$0-4], $$[$0-2]); 
break;
case 30: this.$ = new yy.ConditionDefinition($$[$0-3], $$[$0-2]); 
break;
case 31: this.$ = $$[$0].setInline(); 
break;
case 32: this.$ = new yy.Inversion($$[$0].setInline()); 
break;
case 33: this.$ = $$[$0-2].dontIndent(); 
break;
case 34: this.$ = new yy.ArgumentList($$[$0-1]); 
break;
case 35: this.$ = new yy.ArgumentList(); 
break;
case 37: this.$ = new yy.If($$[$0-6], $$[$0-4], $$[$0-2]); 
break;
case 38: this.$ = new yy.If($$[$0-4], $$[$0-2], null); 
break;
case 39: this.$ = new yy.For($$[$0-4], $$[$0-2]); 
break;
case 40: this.$ = new yy.While($$[$0-3], $$[$0-2]); 
break;
case 41: this.$ = new yy.While($$[$0-4], $$[$0-2]); 
break;
case 42: this.$ = new yy.WhileTrue($$[$0-2]); 
break;
case 43: this.$ = new yy.DoWhile($$[$0], $$[$0-4]); 
break;
}
},
table: [{1:[2,2],3:1,4:2,9:[2,2],21:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{1:[3]},{1:[2,1],5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{1:[2,24],6:26,9:[2,24],21:[2,24],22:[2,24],26:[2,24],27:[2,24],28:[1,27],30:[2,24],33:[2,24],34:[2,24],37:[2,24],41:[2,24],43:[2,24],44:[2,24],46:[2,24]},{1:[2,7],9:[2,7],21:[2,7],22:[2,7],26:[2,7],27:[2,7],28:[2,7],30:[2,7],33:[2,7],34:[2,7],37:[2,7],41:[2,7],43:[2,7],44:[2,7],46:[2,7]},{1:[2,8],9:[2,8],21:[2,8],22:[2,8],26:[2,8],27:[2,8],28:[2,8],30:[2,8],33:[2,8],34:[2,8],37:[2,8],41:[2,8],43:[2,8],44:[2,8],46:[2,8]},{1:[2,9],9:[2,9],21:[2,9],22:[2,9],26:[2,9],27:[2,9],28:[2,9],30:[2,9],33:[2,9],34:[2,9],37:[2,9],41:[2,9],43:[2,9],44:[2,9],46:[2,9]},{1:[2,10],9:[2,10],21:[2,10],22:[2,10],26:[2,10],27:[2,10],28:[2,10],30:[2,10],33:[2,10],34:[2,10],37:[2,10],41:[2,10],43:[2,10],44:[2,10],46:[2,10]},{1:[2,11],9:[2,11],21:[2,11],22:[2,11],26:[2,11],27:[2,11],28:[2,11],30:[2,11],33:[2,11],34:[2,11],37:[2,11],41:[2,11],43:[2,11],44:[2,11],46:[2,11]},{1:[2,12],9:[2,12],21:[2,12],22:[2,12],26:[2,12],27:[2,12],28:[2,12],30:[2,12],33:[2,12],34:[2,12],37:[2,12],41:[2,12],43:[2,12],44:[2,12],46:[2,12]},{1:[2,13],9:[2,13],21:[2,13],22:[2,13],26:[2,13],27:[2,13],28:[2,13],30:[2,13],33:[2,13],34:[2,13],37:[2,13],41:[2,13],43:[2,13],44:[2,13],46:[2,13]},{1:[2,14],9:[2,14],21:[2,14],22:[2,14],26:[2,14],27:[2,14],28:[2,14],30:[2,14],33:[2,14],34:[2,14],37:[2,14],41:[2,14],43:[2,14],44:[2,14],46:[2,14]},{1:[2,15],9:[2,15],21:[2,15],22:[2,15],26:[2,15],27:[2,15],28:[2,15],30:[2,15],33:[2,15],34:[2,15],37:[2,15],41:[2,15],43:[2,15],44:[2,15],46:[2,15]},{1:[2,16],9:[2,16],21:[2,16],22:[2,16],26:[2,16],27:[2,16],28:[2,16],30:[2,16],33:[2,16],34:[2,16],37:[2,16],41:[2,16],43:[2,16],44:[2,16],46:[2,16]},{1:[2,17],9:[2,17],21:[2,17],22:[2,17],26:[2,17],27:[2,17],28:[2,17],30:[2,17],33:[2,17],34:[2,17],37:[2,17],41:[2,17],43:[2,17],44:[2,17],46:[2,17]},{5:32,7:30,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],23:31,24:[1,33],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,28],48:[1,29]},{9:[2,26],17:35,29:20,30:[1,25],35:34,36:[1,36]},{8:37,9:[1,38]},{9:[2,26],17:35,29:20,30:[1,25],35:39,36:[1,36]},{8:40,9:[1,38]},{8:41,9:[1,38]},{8:42,9:[1,38]},{4:43,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{1:[2,22],9:[2,22],21:[2,22],22:[2,22],26:[2,22],27:[2,22],28:[2,22],30:[2,22],33:[2,22],34:[2,22],37:[2,22],41:[2,22],43:[2,22],44:[2,22],46:[2,22]},{1:[2,23],9:[2,23],21:[2,23],22:[2,23],26:[2,23],27:[2,23],28:[2,23],30:[2,23],33:[2,23],34:[2,23],37:[2,23],41:[2,23],43:[2,23],44:[2,23],46:[2,23]},{31:[1,44]},{1:[2,3],9:[2,3],21:[2,3],22:[2,3],26:[2,3],27:[2,3],30:[2,3],33:[2,3],34:[2,3],37:[2,3],41:[2,3],43:[2,3],44:[2,3],46:[2,3]},{1:[2,25],9:[2,25],21:[2,25],22:[2,25],26:[2,25],27:[2,25],30:[2,25],33:[2,25],34:[2,25],37:[2,25],41:[2,25],43:[2,25],44:[2,25],46:[2,25]},{9:[2,26],17:35,29:20,30:[1,25],35:45,36:[1,36]},{4:46,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{5:48,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,47],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{45:[1,49]},{6:50,9:[2,24],21:[2,24],22:[2,24],26:[2,24],27:[2,24],28:[1,27],30:[2,24],33:[2,24],34:[2,24],37:[2,24],41:[2,24],44:[2,24],46:[2,24]},{40:[2,19],45:[2,19]},{47:[1,51]},{1:[2,31],9:[2,31],21:[2,31],22:[2,31],26:[2,31],27:[2,31],28:[2,31],30:[2,31],33:[2,31],34:[2,31],37:[2,31],41:[2,31],42:[2,31],43:[2,31],44:[2,31],46:[2,31],47:[2,31]},{9:[2,26],17:52,29:20,30:[1,25]},{22:[1,53]},{1:[2,6],9:[2,6],21:[2,6],22:[2,6],26:[2,6],27:[2,6],28:[2,6],30:[2,6],33:[2,6],34:[2,6],37:[2,6],39:[2,6],41:[2,6],42:[2,6],43:[2,6],44:[2,6],46:[2,6],47:[2,6]},{42:[1,54]},{6:55,9:[2,24],21:[2,24],22:[2,24],26:[2,24],27:[2,24],28:[1,27],30:[2,24],33:[2,24],34:[2,24],37:[2,24],41:[2,24],44:[2,24],46:[2,24]},{1:[2,35],9:[2,35],21:[2,35],22:[2,35],26:[2,35],27:[2,35],28:[2,35],30:[2,35],32:56,33:[2,35],34:[2,35],37:[2,35],38:57,39:[1,58],41:[2,35],42:[2,35],43:[2,35],44:[2,35],46:[2,35],47:[2,35]},{4:59,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,60],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{9:[2,27]},{4:61,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2],47:[1,51]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,62],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{44:[1,63]},{6:64,9:[2,24],21:[2,24],22:[2,24],26:[2,24],27:[2,24],28:[1,27],30:[2,24],33:[2,24],34:[2,24],37:[2,24],41:[2,24],44:[2,24],46:[2,24]},{4:65,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{9:[2,4],21:[2,4],22:[2,4],26:[2,4],27:[2,4],30:[2,4],33:[2,4],34:[2,4],37:[2,4],41:[2,4],44:[2,4],46:[2,4]},{4:66,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{1:[2,32],9:[2,32],21:[2,32],22:[2,32],26:[2,32],27:[2,32],28:[2,32],30:[2,32],33:[2,32],34:[2,32],37:[2,32],41:[2,32],42:[2,32],43:[2,32],44:[2,32],46:[2,32],47:[2,32]},{21:[1,67]},{4:68,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],43:[2,2],44:[2,2],46:[2,2]},{4:69,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{1:[2,28],9:[2,28],21:[2,28],22:[2,28],26:[2,28],27:[2,28],28:[2,28],30:[2,28],33:[2,28],34:[2,28],37:[2,28],41:[2,28],42:[2,28],43:[2,28],44:[2,28],46:[2,28],47:[2,28]},{1:[2,36],9:[2,36],21:[2,36],22:[2,36],26:[2,36],27:[2,36],28:[2,36],30:[2,36],33:[2,36],34:[2,36],37:[2,36],41:[2,36],42:[2,36],43:[2,36],44:[2,36],46:[2,36],47:[2,36]},{23:71,24:[1,33],25:70,40:[2,20]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,72],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{37:[1,73]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,74],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{44:[1,75]},{46:[1,76]},{9:[2,5],21:[2,5],22:[2,5],26:[2,5],27:[2,5],30:[2,5],33:[2,5],34:[2,5],37:[2,5],41:[2,5],44:[2,5],46:[2,5]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,77],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,78],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{1:[2,18],9:[2,18],21:[2,18],22:[2,18],26:[2,18],27:[2,18],28:[2,18],30:[2,18],33:[2,18],34:[2,18],37:[2,18],41:[2,18],43:[2,18],44:[2,18],46:[2,18]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,80],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],43:[1,79],44:[1,15],46:[1,16]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,81],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{40:[1,82]},{40:[2,21]},{34:[1,83]},{1:[2,33],9:[2,33],21:[2,33],22:[2,33],26:[2,33],27:[2,33],28:[2,33],30:[2,33],33:[2,33],34:[2,33],37:[2,33],41:[2,33],43:[2,33],44:[2,33],46:[2,33]},{44:[1,84]},{1:[2,42],9:[2,42],21:[2,42],22:[2,42],26:[2,42],27:[2,42],28:[2,42],30:[2,42],33:[2,42],34:[2,42],37:[2,42],41:[2,42],43:[2,42],44:[2,42],46:[2,42]},{9:[2,26],17:35,29:20,30:[1,25],35:85,36:[1,36]},{44:[1,86]},{46:[1,87]},{4:88,9:[2,2],21:[2,2],22:[2,2],26:[2,2],27:[2,2],30:[2,2],33:[2,2],34:[2,2],37:[2,2],41:[2,2],44:[2,2],46:[2,2]},{41:[1,89]},{33:[1,90]},{1:[2,34],9:[2,34],21:[2,34],22:[2,34],26:[2,34],27:[2,34],28:[2,34],30:[2,34],33:[2,34],34:[2,34],37:[2,34],41:[2,34],42:[2,34],43:[2,34],44:[2,34],46:[2,34],47:[2,34]},{1:[2,30],9:[2,30],21:[2,30],22:[2,30],26:[2,30],27:[2,30],28:[2,30],30:[2,30],33:[2,30],34:[2,30],37:[2,30],41:[2,30],43:[2,30],44:[2,30],46:[2,30]},{1:[2,40],9:[2,40],21:[2,40],22:[2,40],26:[2,40],27:[2,40],28:[2,40],30:[2,40],33:[2,40],34:[2,40],37:[2,40],41:[2,40],43:[2,40],44:[2,40],46:[2,40]},{1:[2,43],9:[2,43],21:[2,43],22:[2,43],26:[2,43],27:[2,43],28:[2,43],30:[2,43],33:[2,43],34:[2,43],37:[2,43],41:[2,43],43:[2,43],44:[2,43],46:[2,43]},{1:[2,39],9:[2,39],21:[2,39],22:[2,39],26:[2,39],27:[2,39],28:[2,39],30:[2,39],33:[2,39],34:[2,39],37:[2,39],41:[2,39],43:[2,39],44:[2,39],46:[2,39]},{1:[2,41],9:[2,41],21:[2,41],22:[2,41],26:[2,41],27:[2,41],28:[2,41],30:[2,41],33:[2,41],34:[2,41],37:[2,41],41:[2,41],43:[2,41],44:[2,41],46:[2,41]},{5:3,9:[2,26],10:4,11:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:[1,17],22:[1,91],26:[1,23],27:[1,24],29:20,30:[1,25],33:[1,19],34:[1,21],37:[1,22],41:[1,18],44:[1,15],46:[1,16]},{1:[2,38],9:[2,38],21:[2,38],22:[2,38],26:[2,38],27:[2,38],28:[2,38],30:[2,38],33:[2,38],34:[2,38],37:[2,38],41:[2,38],43:[2,38],44:[2,38],46:[2,38]},{1:[2,29],9:[2,29],21:[2,29],22:[2,29],26:[2,29],27:[2,29],28:[2,29],30:[2,29],33:[2,29],34:[2,29],37:[2,29],41:[2,29],43:[2,29],44:[2,29],46:[2,29]},{41:[1,92]},{1:[2,37],9:[2,37],21:[2,37],22:[2,37],26:[2,37],27:[2,37],28:[2,37],30:[2,37],33:[2,37],34:[2,37],37:[2,37],41:[2,37],43:[2,37],44:[2,37],46:[2,37]}],
defaultActions: {44:[2,27],71:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match.length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:/* whitespace: do nothing */
break;
case 1: return 24; 
break;
case 2:/*{ return 'BLOCK_COMMENT'; }*/
break;
case 3:/*{ return 'LINE_COMMENT'; }*/
break;
case 4: return 22; 
break;
case 5: return 28; 
break;
case 6: return 31; 
break;
case 7: return 39; 
break;
case 8: return 40; 
break;
case 9: return 46; 
break;
case 10: return 41; 
break;
case 11: return 44; 
break;
case 12: return 33; 
break;
case 13: return 34; 
break;
case 14: return 37; 
break;
case 15: return 21; 
break;
case 16: return 30; 
break;
case 17: return 47; 
break;
case 18: return 42; 
break;
case 19: return 43; 
break;
case 20: return 45; 
break;
case 21: return 48; 
break;
case 22: return 26; 
break;
case 23: return 27; 
break;
case 24: return 36; 
break;
case 25: return 9; 
break;
case 26: return 'INVALID'; 
break;
}
};
lexer.rules = [/^\s+/,/^[0-9]+/,/^\{[^\}]*\}/,/^\/\/[^\n]*\n\b/,/^\*/,/^;/,/^\./,/^\(/,/^\)/,/^solange\b\b/,/^wenn\b\b/,/^wiederhole\b\b/,/^anweisung\b\b/,/^bedingung\b\b/,/^programm\b\b/,/^einfuegen\b\b/,/^karol\b\b/,/^tue\b\b/,/^dann\b\b/,/^sonst\b\b/,/^mal\b\b/,/^immer\b\b/,/^wahr\b\b/,/^falsch\b\b/,/^nicht\b\b/,/^[A-Za-z_-][A-Za-z0-9_-]*/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = karol;
exports.parse = function () { return karol.parse.apply(karol, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
};
    }).call(module.exports);
    
    _browserifyRequire.modules["./compiler/parser"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./compiler/command"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./command.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./compiler/command", path);
    };
    
    (function () {
        var fs = require('fs')
,   karol = require('./karol')

fs.readFile(process.ARGV[2], 'utf-8', function (err, contents) {
  if (err) throw err
  console.log(karol.compile(contents))
})
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./compiler/command"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./compiler/nodes"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./nodes.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./compiler/nodes", path);
    };
    
    (function () {
        var BUILT_IN_CMDS = require('../models/robot').BUILT_IN_CMDS
var BUILT_IN = {}
BUILT_IN_CMDS.forEach(function (cmd) {
  BUILT_IN[cmd.toLowerCase()] = cmd
})


exports.reset = function () {
  For.currentCharCode = 'i'.charCodeAt(0)
}


// Nodes

var Block = exports.Block = function () {
  this.statements = []
  this.indent = true
}

Block.prototype.dontIndent = function () {
  this.indent = false
  return this
}

Block.prototype.addStatement = function (statement) {
  this.statements.push(statement)
  return this
}

Block.prototype.compile = function () {
  var str = this.statements
      .map(function (statement) { return statement.compile() })
      .join('\n')
    if (this.indent) {
      str = str.split('\n')
        .map(function (line) { return TAB + line })
        .join('\n')
    }
    return str
}


// Definitions

var ConditionDefinition = exports.ConditionDefinition = function (id, block) {
  this.identifier = id
  this.block      = block
}

ConditionDefinition.prototype.compile = function () {
  return 'function ' + this.identifier.compile() + '() {\n'
       + TAB + 'var result;\n'
       + this.block.compile() + '\n'
       + TAB + 'return result;\n'
       + '}'
}


var FunctionDefinition = exports.FunctionDefinition = function (id, block) {
  this.identifier = id
  this.block      = block
}

FunctionDefinition.prototype.compile = function () {
  return 'function ' + this.identifier.compile() + '() {\n'
       + this.block.compile() + '\n'
       + '}'
}


// Control Structures

var If = exports.If = function (condition, blockIf, blockElse) {
  this.condition = condition
  this.blockIf   = blockIf
  this.blockElse = blockElse
}

If.prototype.compile = function () {
  return 'if (' + this.condition.compile() + ') {\n'
       + this.blockIf.compile() + '\n'
       + '}'
       + (this.blockElse ? ' else {\n' + this.blockElse.compile() + '\n}' : '')
}


var While = exports.While = function (condition, block) {
  this.condition = condition
  this.block     = block
}

While.prototype.compile = function () {
  return 'while (' + this.condition.compile() + ') {\n'
       + this.block.compile() + '\n'
       + '}'
}


var DoWhile = exports.DoWhile = function (condition, block) {
  this.condition = condition
  this.block     = block
}

DoWhile.prototype.compile = function () {
  return 'do {\n'
       + this.block.compile() + '\n'
       + '} while (' + this.condition.compile() + ');'
}


var WhileTrue = exports.WhileTrue = function (block) {
  this.block = block
}

WhileTrue.prototype.compile = function () {
  return 'while (true) {\n'
       + this.block.compile() + '\n'
       + '}'
}


var For = exports.For = function (times, block) {
  this.times = times
  this.block = block
}

For.prototype.compile = function () {
  var v = String.fromCharCode(For.currentCharCode)
  For.currentCharCode++
  return 'for (var '+v+' = 0; ' +v+' < '+this.times+'; '+v+'++) {\n'
       + this.block.compile() + '\n'
       + '}'
}


// Elementary

var Identifier = exports.Identifier = function (name) {
  this.name = name
}

// Turns an identifier into javaScriptCamelCase
Identifier.jsify = function (name) {
    parts = name
      .split(/[_-]/g)
      .filter(function (a) { return !!a }) // compact
    return parts[0].toLowerCase() + parts.slice(1).map(function (part) {
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
}

Identifier.prototype.compile = function () {
  var jsName = Identifier.jsify(this.name)
  if (jsName in BUILT_IN) {
    jsName = BUILT_IN[jsName]
  }
  var rest
  if (jsName.match(/^nicht/) && (rest = jsName.slice(5)) in BUILT_IN) {
    jsName = '!' + BUILT_IN[rest]
  }
  return jsName
}


var Bool = exports.Bool = function (value) {
  this.value = value
}

// TODO: this is really a statement
Bool.prototype.compile = function () {
  return 'result = ' + this.value + ';'
}


var Inversion = exports.Inversion = function (wrapped) {
  this.wrapped = wrapped
}

Inversion.prototype.compile = function () {
  return '!' + this.wrapped.compile()
}


var Import = exports.Import = function (identifier) {
  this.identifier = identifier
}

Import.prototype.compile = function () {
  return 'require(\'' + this.identifier.compile() + '\');'
}


var FunctionInvocation = exports.FunctionInvocation = function (id, argumentList) {
  this.identifier = id
  this.argumentList = argumentList
}

FunctionInvocation.prototype.setInline = function () {
  this.inline = true
  return this
}

FunctionInvocation.prototype.compile = function () {
  return this.identifier.compile() + this.argumentList.compile()
       + (this.inline ? '' : ';')
}

var ArgumentList = exports.ArgumentList = function (argument) {
  this.argument = argument
}

ArgumentList.prototype.compile = function () {
  return '(' + (this.argument ? this.argument : '') + ')'
}

var TAB = '  '
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./compiler/nodes"]._cached = module.exports;
    return module.exports;
};

_browserifyRequire.modules["./settings"] = function () {
    var module = { exports : {} };
    var exports = module.exports;
    var __dirname = ".";
    var __filename = "./settings.js";
    
    var require = function (path) {
        return _browserifyRequire.fromFile("./settings", path);
    };
    
    (function () {
        module.exports = {
  HIGHLIGHT_LINE: false,
  MAX_JUMP_HEIGHT: 1,
  COLORS: {
    BRICK:  0xff0000,
    BLOCK:  0x666666,
    MARKER: 0xcccc55
  },
  ERRORS: {
    put_brick_wall: "Karel kann keinen Ziegel hinlegen. Er steht vor einer Wand.",
    remove_brick_wall: "Karel kann keinen Ziegel aufheben. Er steht vor einer Wand.",
    remove_brick_no_brick: "Karel kann keinen Ziegel aufheben, da kein Ziegel vor ihm liegt.",
    move_wall: "karel kann keinen Schritt machen, er steht vor einer Wand.",
    move_too_high: "karel kann nur einen Ziegel pro Schritt nach oben oder unten springen.",
    put_block_wall: "karel kann keinen Quader hinlegen. Er steht vor einer Wand.",
    put_block_already_is_block: "karel kann keinen Quader hinlegen, da schon einer liegt.",
    put_block_is_brick: "karel kann keinen Quader hinlegen, da auf dem Feld schon Ziegel liegen.",
    remove_block_wall: "karel kann keinen Quader entfernen. Er steht vor einer Wand.",
    remove_block_no_block: "karel kann keinen Quader entfernen, da auf dem Feld kein Quader liegt."
  }
}
;
    }).call(module.exports);
    
    _browserifyRequire.modules["./settings"]._cached = module.exports;
    return module.exports;
};
