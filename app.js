/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof(bespin) === 'undefined') {
    bespin = {};
}

if (typeof(document) !== 'undefined') {
    var link = document.getElementById("bespin_base");
    if (link) {
        var href = link.href;
        bespin.base = href.substring(href.length - 1) !== "/" ? href + "/" : href;
    } else {
        bespin.base = "";
    }
}


(function() {
/*! @license
==========================================================================
Tiki 1.0 - CommonJS Runtime
copyright 2009-2010, Apple Inc., Sprout Systems Inc., and contributors.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

Tiki is part of the SproutCore project.

SproutCore and the SproutCore logo are trademarks of Sprout Systems, Inc.

For more information visit http://www.sproutcore.com/tiki

==========================================================================
@license */

/*globals tiki ENV ARGV ARGS */

"use modules false";
"use loader false";

/**
  Implements a very simple handler for the loader registration API so that
  additional scripts can load without throwing exceptions.  This loader can
  also return module instances for modules registered with an actual factory
  function.

  Note that this stub loader cannot be used on its own.  You must load the
  regular tiki package as well, which will replace this loader as soon as it
  is fetched.
*/
if ("undefined" === typeof tiki) { var tiki = function() {

  var T_UNDEFINED = 'undefined',
      queue = [];

  function _record(method, args) {
    queue.push({ m: method, a: args });
  }

  var tiki = {

    isBootstrap: true,

    queue: queue,

    register: function(packageId, opts) {

      if (packageId.match(/^tiki/) && this.ENV) {
        if ((this.ENV.app === 'tiki') && (this.ENV.mode === 'test')) {
          if (!opts.dependencies) opts.dependencies = {};
          opts.dependencies['core_test'] = '~';
        }
      }

      _record('register', arguments);
       return this;
    },


    module: function(moduleId, factory) {
      if (moduleId.match(/\:tiki$/)) this.tikiFactory = factory;
      _record('module', arguments);
      return this ;
    },

    start: function() {
      var exp = {}, ret;
      this.tikiFactory(null, exp, null); // no require or module!
      ret = exp.Browser.start(this.ENV, this.ARGS, queue);
      queue = null;
      return ret ;
    }

  };

  if (T_UNDEFINED !== typeof ENV) tiki.ENV = ENV;
  if (T_UNDEFINED !== typeof ARGV) tiki.ARGS = ARGV; // for older versions
  if (T_UNDEFINED !== typeof ARGS) tiki.ARGS = ARGS;

  return tiki;

}(); }


tiki.register('::tiki/1.0.0', {
"name": "tiki",
"version": "1.0.0"
});

tiki.module('::tiki/1.0.0:tiki', function(require, exports, module) {
/*jslint evil:true */

/**
  @file

  This file implements the core building blocks needed to implement the
  tiki runtime in an environment.  If you can require this one module, you can
  setup a runtime that will load additional packages.

  It is important that this module NOT require() any other modules since a
  functioning require() statement may not be available.  The module can
  populate, but not replace, the exports object.

  To configure a Tiki runtime, you need to create a Sandbox and Loader
  instance from this API with one or more loader Sources.  The BrowserSource
  object implements the basic source you need to work in the browser.  The
  Repository object implemented in the server-side only 'file' API can be
  used to load from a local repository of packages.
*/

var T_FUNCTION = 'function',
    T_STRING   = 'string',
    T_UNDEFINED = 'undefined';


var IS_CANONICAL = /^::/; // must begin with ::
var isCanonicalId = function(id) {
  return !!IS_CANONICAL.exec(id);
};

var DEBUG = function() {
  exports.debug.apply(this, arguments);
};

exports.debug = function() {
  var msg = Array.prototype.join.call(arguments, '');
  require('sys').debug(msg);
};


var TMP_ARY = [];

/**
  Tests whether the passed object is an array or not.
*/
var isArray;

if (Array.isArray) {
  isArray = Array.isArray;
} else {
  isArray = function(obj) {
    if ('object' !== typeof obj) return false;
    if (obj instanceof Array) return true;
    return obj.constructor && (obj.constructor.name==='Array');
  };
}
exports.isArray = isArray;

/**
  Create a new object with the passed object as the prototype.
*/
var createObject;
if (Object.create) {
  createObject = Object.create;
} else {
  var K = function() {},
      Kproto = K.prototype;
  createObject = function(obj) {
    if (!obj) obj = Object.prototype;
    K.prototype = obj;

    var ret = new K();
    ret.prototype = obj;
    K.prototype = Kproto;

    return ret ;
  };
}
exports.createObject = createObject;

var _constructor, _extend, extend;

_constructor = function() {
  return function() {
    if (this.init) return this.init.apply(this, arguments);
    else return this;
  };
};

_extend = function() {
  return extend(this);
};

/**
  Creates a "subclass" of the passed constructor.  The default constructor
  will call look for a local "init" method and call it.

  If you don't pass an initial constructor, this will create a new based
  object.
*/
extend = function(Constructor) {
  var Ret = _constructor();
  Ret.prototype = createObject(Constructor.prototype);
  Ret.prototype.constructor = Ret;
  Ret.super_ = Constructor;
  Ret.extend = _extend;
  return Ret;
};
exports.extend = extend;

/**
  Invokes the passed fn on each item in the array in parallel.  Invokes
  done when finished.

  # Example

      parallel([1,2,3], function(item, done) {
        done();
      })(function(err) {
      });

  @param {Array} array
    items to iterate

  @param {Function} fn
    callback to invoke

  @returns {void}
*/
var parallel = function(array, fn) {
  if (fn && !fn.displayName) fn.displayName = 'parallel#fn';

  return function(done) {
    if (array.length === 0) return done(null, []);

    var len = array.length,
        cnt = len,
        cancelled = false,
        idx;

    var tail = function(err) {
      if (cancelled) return; // nothing to do

      if (err) {
        cancelled = true;
        return done(err);
      }

      if (--cnt <= 0) done();
    };
    tail.displayName = 'parallel#tail';

    for(idx=0;idx<len;idx++) fn(array[idx], tail);
  };
};
parallel.displayName = 'parallel';

/**
  @private

  Implements the sync map() on all platforms
*/
var map;
if (Array.prototype.map) {
  map = function(array, fn) {
    return array.map(fn);
  };

} else {
  map = function(array, fn) {
    var idx, len = array.length, ret = [];
    for(idx=0;idx<len;idx++) {
      ret[idx] = fn(array[idx], idx);
    }
    return ret ;
  };
}
map.displayName = 'map';


var PENDING = 'pending',
    READY   = 'ready',
    RUNNING = 'running';

/**
  Returns a function that will execute the continuable exactly once and
  then cache the result.  Invoking the same return function more than once
  will simply return the old result.

  This is a good replacement for promises in many cases.

  h3. Example

  {{{
    var loadit = Co.once(Co.fs.loadFile(pathToFile));

    loadit(function(content) {
    });

    loadit(function(content) {
    });

  }}}

  @param {Function} cont
    Continuable to invoke

  @returns {Function}
    A new continuable that will only execute once then returns the cached
    result.
*/
var once = function(action, context) {
  var state = PENDING,
      queue = [],
      makePending = false,
      args  = null;

  var ret = function(callback) {
    if (!context) context = this;

    switch(state) {

      case READY:
        callback.apply(null, args);
        break;

      case RUNNING:
        queue.push(callback);
        break;

      case PENDING:
        queue.push(callback);
        state = RUNNING;

        action.call(context, function(err) {
          args  = Array.prototype.slice.call(arguments);

          var oldQueue = queue, oldArgs = args;

          if (makePending) {
            state = PENDING;
            queue = [];
            args  = null;
            makePending = false;

          } else {
            state = READY;
            queue = null;
          }

          if (oldQueue) {
            oldQueue.forEach(function(q) { q.apply(null, oldArgs); });
          }
        });
        break;
    }
    return this;
  };
  ret.displayName = 'once#handler';

  ret.reset = function() {
    switch(state) {

      case READY:
        state = PENDING;
        queue = [];
        args  = null;
        break;

      case RUNNING:
        makePending = true;
        break;

    }
  };
  ret.reset.displayName = 'once#handler.reset';

  return ret ;
};
exports.once = once;


/**
  Iterate over a property, setting display names on functions as needed.
  Call this on your own exports to setup display names for debugging.
*/
var displayNames = function(obj, root) {
  var k,v;
  for(k in obj) {
    if (!obj.hasOwnProperty(k)) continue ;
    v = obj[k];
    if ('function' === typeof v) {
      if (!v.displayName) {
        v.displayName = root ? (root+'.'+k) : k;
        displayNames(v.prototype, v.displayName);
      }

    }
  }
  return obj;
};


var NotFound = extend(Error);
NotFound.prototype.init = function(canonicalId, pkgId) {
  var msg = canonicalId+' not found';
  if (pkgId) {
    if (T_STRING === typeof pkgId) msg = msg+' '+pkgId;
    else msg = msg+' in package '+(pkgId.id || '(unknown)');
  }
  this.message = msg;
  return this;
};
exports.NotFound = NotFound;

var InvalidPackageDef = extend(Error);
InvalidPackageDef.prototype.init = function(def, reason) {
  if ('undefined' !== typeof JSON) def = JSON.stringify(def);
  this.message = "Invalid package definition. "+reason+" "+def;
};
exports.InvalidPackageDef = InvalidPackageDef;



/*
natcompare.js -- Perform 'natural order' comparisons of strings in JavaScript.
Copyright (C) 2005 by SCK-CEN (Belgian Nucleair Research Centre)
Written by Kristof Coomans <kristof[dot]coomans[at]sckcen[dot]be>

Based on the Java version by Pierre-Luc Paour, of which this is more or less a straight conversion.
Copyright (C) 2003 by Pierre-Luc Paour <natorder@paour.com>

The Java version was based on the C version by Martin Pool.
Copyright (C) 2000 by Martin Pool <mbp@humbug.org.au>

This software is provided 'as-is', without any express or implied
warranty.  In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
claim that you wrote the original software. If you use this software
in a product, an acknowledgment in the product documentation would be
appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be
misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.
*/
var natcompare = function() {

  var isWhitespaceChar = function(a) {
    var charCode = a.charCodeAt(0);
    return charCode <= 32;
  };

  var isDigitChar = function(a) {
    var charCode = a.charCodeAt(0);
    return ( charCode >= 48  && charCode <= 57 );
  };

  var compareRight = function(a,b) {
    var bias = 0,
        ia   = 0,
        ib   = 0,
        ca, cb;

    for (;; ia++, ib++) {
      ca = a.charAt(ia);
      cb = b.charAt(ib);

      if (!isDigitChar(ca) && !isDigitChar(cb)) return bias;
      else if (!isDigitChar(ca)) return -1;
      else if (!isDigitChar(cb)) return +1;
      else if (ca < cb) if (bias === 0) bias = -1;
      else if (ca > cb) if (bias === 0) bias = +1;
      else if (ca === 0 && cb === 0) return bias;
    }
  };

  var natcompare = function(a,b) {

    var ia  = 0,
    ib  = 0,
    nza = 0,
    nzb = 0,
    ca, cb, result;

    while (true) {
      nza = nzb = 0;

      ca = a.charAt(ia);
      cb = b.charAt(ib);

      while ( isWhitespaceChar( ca ) || ca =='0' ) {
        if (ca == '0') nza++;
        else nza = 0; // only count consecutive zeroes
        ca = a.charAt(++ia);
      }

      while ( isWhitespaceChar( cb ) || cb == '0') {
        if (cb == '0') nzb++;
        else nzb = 0; // only count consecutive zeroes
        cb = b.charAt(++ib);
      }

      if (isDigitChar(ca) && isDigitChar(cb)) {
        if ((result = compareRight(a.substring(ia), b.substring(ib))) !== 0) {
          return result;
        }
      }

      if (ca === 0 && cb === 0) return nza - nzb;

      if (ca < cb) return -1;
      else if (ca > cb) return +1;

      ++ia; ++ib;
    }
  };

  return natcompare;
}();
exports.natcompare = natcompare;


var invalidVers = function(vers) {
  return new Error('' + vers + ' is an invalid version string');
};
invalidVers.displayName = 'invalidVers';

var compareNum = function(vers1, vers2, num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);
  if (isNaN(num1)) throw invalidVers(vers1);
  if (isNaN(num2)) throw invalidVers(vers2);
  return num1 - num2 ;
};
compareNum.displayName = 'compareNum';


var vparse;
var semver = {

  /**
    Parse the version number into its components.  Returns result of a regex.
  */
  parse: function(vers) {
    var ret = vers.match(/^(=|~)?([\d]+?)(\.([\d]+?)(\.(.+))?)?$/);
    if (!ret) return null; // no match
    return [ret, ret[2], ret[4] || '0', ret[6] || '0', ret[1]];
  },


  /**
    Returns the major version number of a version string.

    @param {String} vers
      version string

    @returns {Number} version number or null if could not be parsed
  */
  major: function(vers) {
    return Number(vparse(vers)[1]);
  },

  /**
    Returns the minor version number of a version string


    @param {String} vers
      version string

    @returns {Number} version number or null if could not be parsed
  */
  minor: function(vers) {
    return Number(vparse(vers)[2]);
  },

  /**
    Returns the patch of a version string.  The patch value is always a string
    not a number
  */
  patch: function(vers) {
    var ret = vparse(vers)[3];
    return isNaN(Number(ret)) ? ret : Number(ret);
  },

  STRICT: 'strict',
  NORMAL: 'normal',

  /**
    Returns the comparison mode.  Will be one of NORMAL or STRICT
  */
  mode: function(vers) {
    var ret = vparse(vers)[4];
    return ret === '=' ? semver.STRICT : semver.NORMAL;
  },

  /**
    Compares two patch strings using the proper matching formula defined by
    semver.org.  Returns:

    @param {String} patch1 first patch to compare
    @param {String} patch2 second patch to compare
    @returns {Number} -1 if patch1 < patch2, 1 if patch1 > patch2, 0 if equal
  */
  comparePatch: function(patch1, patch2) {
    var num1, num2;

    if (patch1 === patch2) return 0; // equal

    num1   = Number(patch1);
    num2   = Number(patch2);

    if (isNaN(num1)) {
      if (isNaN(num2)) {
        return natcompare(patch1, patch2);

      } else return -1; // num2 is a number therefore num1 < num2

    } else if (isNaN(num2)) {
      return 1 ;
    } else {
      return num1<num2 ? -1 : (num1>num2 ? 1 : 0) ;
    }
  },

  /**
    Compares two version strings, using natural sorting for the patch.
  */
  compare: function(vers1, vers2) {
    var ret ;

    if (vers1 === vers2) return 0;
    if (vers1) vers1 = vparse(vers1);
    if (vers2) vers2 = vparse(vers2);

    if (!vers1 && !vers2) return 0;
    if (!vers1) return -1;
    if (!vers2) return 1;


    ret = compareNum(vers1[0], vers2[0], vers1[1], vers2[1]);
    if (ret === 0) {
      ret = compareNum(vers1[0], vers2[0], vers1[2], vers2[2]);
      if (ret === 0) ret = semver.comparePatch(vers1[3], vers2[3]);
    }

    return (ret < 0) ? -1 : (ret>0 ? 1 : 0);
  },

  /**
    Returns true if the second version string represents a version compatible
    with the first version.  In general this means the second version must be
    greater than or equal to the first version but its major version must not
    be different.
  */
  compatible: function(reqVers, curVers) {
    if (!reqVers) return true; // always compatible with no version
    if (reqVers === curVers) return true; // fast path

    if (reqVers && !vparse(reqVers)) reqVers = null;
    if (curVers && !vparse(curVers)) curVers = null;

    if (!reqVers) return true; // always compatible with no version
    if (reqVers === curVers) return true; // fast path

    if (semver.mode(reqVers) === semver.STRICT) {
      return curVers && (semver.compare(reqVers, curVers)===0);

    } else {
      if (!curVers) return true; // if no vers, always assume compat

      if (semver.major(reqVers) !== semver.major(curVers)) return false;
      return semver.compare(reqVers, curVers) <= 0;
    }
  },

  /**
    Normalizes version numbers so that semantically equivalent will be treated
    the same.
  */
  normalize: function(vers) {
    var patch;

    if (!vers || vers.length===0) return null;
    vers = semver.parse(vers);
    if (!vers) return null;

    patch = Number(vers[3]);
    if (isNaN(patch)) patch = vers[3];

    return [Number(vers[1]), Number(vers[2]), patch].join('.');
  }

};
exports.semver = semver;
vparse = semver.parse;



/**
  @constructor

  A factory knows how to instantiate a new module for a sandbox, including
  generating the require() method used by the module itself.  You can return
  custom factories when you install a plugin.  Your module should export
  loadFactory().

  The default factory here actually expects to receive a module descriptor
  as generated by the build tools.
*/
var Factory = exports.extend(Object);
exports.Factory = Factory;

Factory.prototype.init = function(moduleId, pkg, factory) {
  this.id  = moduleId;
  this.pkg = pkg;
  this.factory = factory;
};

/**
  Actually generates a new set of exports for the named sandbox.  The sandbox
  must return a module object that can be used to generate the factory.

  If the current value of the local factory is a string, then we will actually
  eval/compile the factory as well.

  @param sandbox {Sandbox}
    The sandbox the will own the module instance

  @param module {Module}
    The module object the exports will belong to

  @returns {Hash} exports from instantiated module
*/
Factory.prototype.call = function(sandbox, module) {

  var func = this.factory,
      filename = this.__filename,
      dirname  = this.__dirname;

  if (T_STRING === typeof(func)) {
    func = this.factory = Factory.compile(func, this.pkg.id+':'+this.id);
  }

  var req = sandbox.createRequire(module),
      exp = module.exports;
  func.call(exp, req, exp, module, filename, dirname);
  return module.exports;
};


var MODULE_WRAPPER = [
  '(function(require, exports, module) {',
  null,
  '\n});\n//@ sourceURL=',
  null,
  '\n'];

/**
  Evaluates the passed string.  Returns a function.

  @param moduleText {String}
    The module text to compile

  @param moduleId {String}
    Optional moduleId.  If provided will be used for debug

  @returns {Function} compiled factory
*/
Factory.compile = function(moduleText, moduleId) {
  var ret;

  MODULE_WRAPPER[1] = moduleText;
  MODULE_WRAPPER[3] = moduleId || '(unknown module)';

  ret = MODULE_WRAPPER.join('');
  ret = eval(ret);

  MODULE_WRAPPER[1] = MODULE_WRAPPER[3] = null;
  return ret;
};

exports.Factory = Factory;


/**
  A Module describes a single module, including its id, ownerPackage, and
  the actual module exports once the module has been instantiated.  It also
  implements the resource() method which can lookup a resource on the module's
  package.
*/
var Module = exports.extend(Object);
exports.Module = Module;

Module.prototype.init = function(id, ownerPackage, sandbox) {
  this.id           = id;
  this.ownerPackage = ownerPackage;
  this.exports      = {};
  var module        = this;

  /**
    Lookup a resource on the module's ownerPackage.  Returns a URL or path
    for the discovered resource.  The method used to detect the module or
    package is implemented in the package.

    Note that this method is generated for each module we create because some
    code will try to pluck this method off of the module and call it in a
    different context.

    @param resourceId {String}
      Full or partial name of resource to retrieve

    @param done {Function}
      Optional.  Makes the resource discovery asyncronous

    @returns {String} url or path if not called async
  */
  this.resource = function(id) {
    return sandbox.resource(id, module.id, ownerPackage);
  };
};


/**
  Package expects you to register the package with a config having the
  following keys:

    {
      "name": "name-of-package" (vs canonical id)
      "version": current version of package (if known)

      "dependencies": {
         "package-name": "version"
      },

      "tiki:packages": {
        "package-name": [
          { "version": "1.0.0", "id": "canonicalId", "url": "url" }
        ]
      },

      "tiki:scripts": {
        "id": "url"
      },

      "tiki:stylesheets": {
        "id": "url",
        "id": "url"
      },

      "tiki:resources": {
        "asset/path": "url",
        "asset/path": "url"
      }
    }

  This registration ensures that the package and it's related assets are
  loaded.
*/

var Package = exports.extend(Object);
exports.Package = Package;

Package.prototype.init = function(id, config) {
  if (!isCanonicalId(id)) id = '::'+id; // normalize
  this.id = id;
  this.config = config;
  this.isReady = true;
};


/**
  Retrieves the named config property.  This method can be overidden by
  subclasses to perform more advanced processing on the key data

  @param {String} key
    The key to retrieve

  @returns {Object} the key value or undefined
*/
Package.prototype.get = function(key) {
  return this.config ? this.config[key] : undefined;
};

/**
  Updates the named config property.

  @param {String} key
    The key to update

  @param {Object} value
    The object value to change

  @returns {Package} receiver
*/
Package.prototype.set = function(key, value) {
  if (!this.config) this.config = {};
  this.config[key] = value;
  return this;
};

/**
  Determines the required version of the named packageId, if any, specified
  in this package.

  @param {String} packageId
    The packageId to lookup

  @returns {String} The required version or null (meaning any)
*/
Package.prototype.requiredVersion = function(packageId) {
  var deps = this.get('dependencies');
  return deps ? deps[packageId] : null;
};


/**
  Attempts to match the passed packageId and version to the receiver or a
  nested package inside the receiver.  If a match is found, returns the
  packages canonicalId.  Otherwise returns null.

  This does not search remote sources for the package.  It only looks at
  what packages are available locally.

  This method is called after a package version has been checked for
  compatibility with the package dependencies.  It is not necessary to
  validate the requested version against any dependencies.

  @param {String} packageId
    The package id to look up

  @param {String} vers
    The expected version.  If null, then return the newest version for the
    package.

  @param {String} Canonical packageId or null
*/
Package.prototype.canonicalPackageId = function(packageId, vers) {
  if ((packageId === this.get('name')) &&
      semver.compatible(vers, this.get('version'))) {
      return this.id;
  }
  return null;
};

/**
  Returns the receiver or an instance of a nested package if it matches the
  canonicalId passed here.  This method will only be called with a canonicalId
  returned from a previous call to Package#canonicalPackageId.

  If the package identified by the canonicalId is not available locally for
  some reason, return null.

  @param {String} canonicalId
    The canonical packageId.

  @returns {Package} a package instance or null
*/
Package.prototype.packageFor = function(canonicalId) {
  if (canonicalId === this.id) return this;
  return null;
};

/**
  Verifies that the package identified by the passed canonical id is available
  locally and ready for use.  If it is not available, this method should
  attempt to download the package from a remote source.

  Invokes the `done` callback when complete.

  If for some reason you cannot download and install the package you should
  invoke the callback with an error object describing the reason.  There are
  a number of standard errors defined on Package such as NotFound.

  @param {String} canonicalId
    The canonical packageId

  @param {Function} done
    Callback to invoke with result.  Pass an error object if the package
    could not be loaded for some reason.  Otherwise invoke with no params

  @returns {void}
*/
Package.prototype.ensurePackage = function(canonicalId, done) {
  if (canonicalId === this.id) return done();
  else return done(new NotFound(canonicalId, this));
};

/**
  Returns all packages in the package including the package itself and any
  nested packages.  Default just returns self.
*/
Package.prototype.catalogPackages = function() {
  return [this];
};


/**
  Detects whether the moduleId exists in the current package.

  @param {String} moduleId
    The moduleId to check

  @returns {Boolean} true if the module exists
*/
Package.prototype.exists = function(moduleId) {
  return !!(this.factories && this.factories[moduleId]);
};

/**
  Returns a Factory object for the passed moduleId or null if no matching
  factory could be found.

  @param {String} moduleId
    The moduleId to check

  @returns {Factory} factory object
*/
Package.prototype.load = function(moduleId) {
  return this.factories ? this.factories[moduleId] : null;
};


var joinPackageId = function joinPackageId(packageId, moduleId) {
  return packageId+':'+moduleId;
};

/**
  A loader is responsible for finding and loading factory functions.  The
  primary purpose of the loader is to find packages and modules in those
  packages.  The loader typically relies on one or more sources to actually
  find a particular package.
*/
var Loader = exports.extend(Object);
exports.Loader = Loader;

Loader.prototype.init = function(sources) {
  this.sources = sources || [];
  this.clear();
};

/**
  Clear caches in the loader causing future requests to go back to the
  sources.
*/
Loader.prototype.clear = function() {
  this.factories = {};
  this.canonicalIds = {};
  this.packages ={};
  this.packageSources = {};
  this.canonicalPackageIds = {};
};

/**
  The default package.  This can be replaced but normally it is empty, meaning
  it will never match a module.

  @property {Package}
*/
Loader.prototype.defaultPackage = new Package('default', {
  name: "default"
});

/**
  The anonymous package.  This can be used when loading files outside of a
  package.

  @property {Package}
*/
Loader.prototype.anonymousPackage = new Package('(anonymous)', {
  name: "(anonymous)"
});


/**

  Discovers the canonical id for a module.  A canonicalId is a valid URN that
  can be used to uniquely identify a module.
  that looks like:

    ::packageId:moduleId

  For example:

    ::sproutcore-runtime/1.2.0:mixins/enumerable

  Canonical Ids are discovered according to the following algorithm:

  1.  If you pass in an already canonicalId, return it
  2.  If you pass in a relative moduleId, it will be expanded and attached
      to the workingPackage.
  3.  If you pass in a moduleId with a packageId embedded, lookup the latest
      version of the package that is compatible with the passed workingPackage
  4.  If you pass a moduleId with no packageId embedded, then first look
      for the module on the workingPackage.
  5.  If not found there, look for a packageId with the same name.  If that is
      found, return either packageId:index or packageId:packageId as module.
  6.  Otherwise, assume it is part of the default package.

  @param {String} moduleId
    The moduleId to lookup.  May be a canonicalId, packageId:moduleId,
    absolute moduleId or relative moduleId

  @param {String} curModuleId
    Optional.  moduleId of the module requesting the lookup.  Only needed if
    the moduleId param might be relative.

  @param {Package} workingPackage
    The working package making the request.  When searching for a package,
    only use packages that are compatible with the workingPackage.

    This parameter is also optional, though if you omit it, this method
    assumes the anonymousPackage.

  @returns {void}
*/
Loader.prototype.canonical = function(moduleId, curModuleId, workingPackage) {

  var cache, cacheId, idx, packageId, canonicalId, pkg, ret;

  if (curModuleId && (T_STRING !== typeof curModuleId)) {
    workingPackage = curModuleId;
    curModuleId = null;
  }

  if (isCanonicalId(moduleId)) return moduleId;

  if (!workingPackage) workingPackage = this.anonymousPackage;

  moduleId = this._resolve(moduleId, curModuleId, workingPackage);
  if (isCanonicalId(moduleId)) return moduleId;

  cacheId = workingPackage ? workingPackage.id : '(null)';
  cache = this.canonicalIds;
  if (!cache) cache = this.canonicalIds = {};
  if (!cache[cacheId]) cache[cacheId] = {};
  cache = cache[cacheId];
  if (cache[moduleId]) return cache[moduleId];
  cacheId = moduleId; // save for later

  idx = moduleId.indexOf(':');
  if (idx>=0) {
    packageId = moduleId.slice(0,idx);
    moduleId  = moduleId.slice(idx+1);
    if (moduleId[0]==='/') {
      throw new Error('Absolute path not allowed with packageId');
    }
  }

  ret = null;
  if (packageId && (packageId.length>0)) {
    canonicalId = this._canonicalPackageId(packageId, null, workingPackage);
    if (canonicalId) ret = joinPackageId(canonicalId, moduleId);

  } else {

    if (workingPackage && workingPackage.exists(moduleId)) {
      ret = joinPackageId(workingPackage.id, moduleId);

    } else {
      canonicalId = this._canonicalPackageId(moduleId, null, workingPackage);
      if (canonicalId) pkg = this._packageFor(canonicalId, workingPackage);
      if (pkg) {
        if (pkg.exists('index')) ret = joinPackageId(pkg.id, 'index');
        else if (pkg.exists(moduleId)) ret = joinPackageId(pkg.id,moduleId);
      }
    }

    if (!ret) {
      if (this.defaultPackage) packageId = this.defaultPackage.id;
      else if (this.workingPackage) packageId = this.workingPackage.id;
      else if (this.anonymousPackage) packageId = this.anonymousPackage.id;
      else return packageId = null;

      if (packageId) ret = joinPackageId(packageId, moduleId);
    }
  }

  cache[cacheId] = ret;
  return ret ;
};

/**

  Loads a factory for the named canonical module Id.  If you did not obtain
  the canonical module id through the loader's canonical() method, then you
  must also pass a workingPackage property so that the loader can locate the
  package that owns the module.

  The returns factory function can be used to actually generate a module.

  @param {String} canonicalId
    A canonical module id

  @param {Package} workingPackage
    Optional working package.  Only required if you pass in a canonical id
    that you did not obtain from the loader's canonical() method.

  @returns {void}

*/
Loader.prototype.load = function(canonicalId, workingPackage, sandbox) {

  var cache, ret, idx, packageId, moduleId, pkg;

  if (!workingPackage) workingPackage = this.anonymousPackage;

  cache = this.factories;
  if (!cache) cache = this.factories = {};
  if (cache[canonicalId]) return cache[canonicalId];

  idx       = canonicalId.indexOf(':',2);
  packageId = canonicalId.slice(0,idx);
  moduleId  = canonicalId.slice(idx+1);

  pkg = this._packageFor(packageId, workingPackage);

  if (!pkg) DEBUG('Loader#load - '+packageId+' not found for '+moduleId);

  if (!pkg) return null; // not found

  ret = pkg.load(moduleId, sandbox);
  cache[canonicalId] = ret;
  return ret ;
};

/**
  Returns a catalog of all known packages visible to the workingPackage.
  The catalog is simply an array of package objects in no particular order
*/
Loader.prototype.catalogPackages = function(workingPackage) {
  if (!workingPackage) workingPackage = this.anonymousPackage;
  var catalog = [], sources, idx, len, seen = {};
  if (this.defaultPackage) catalog.push(this.defaultPackage);


  var append = function(packages) {
    var idx, len, check, cur;

    if (!packages) return; // nothing to do
    len = packages.length;
    for(idx=0;idx<len;idx++) {
      cur = packages[idx];
      check = seen[cur.get('name')];
      if (!check) check = seen[cur.get('name')] = {};
      if (!check[cur.get('version')]) {
        catalog.push(cur);
        check[cur.get('version')] = cur;
      }
    }
  };

  if (workingPackage) append(workingPackage.catalogPackages());

  sources = this.sources;
  len = sources.length;
  for(idx=0;idx<len;idx++) append(sources[idx].catalogPackages());

  seen = null; // no longer needed.
  return catalog;
};

/**
  Discovers the canonical id for a package.  A cnaonicalID is a URN that can
  be used to uniquely identify a package.  It looks like:

    ::packageId

  for example:

    ::sproutcore-datastore/1.2.0/1ef3ab23ce23ff938

  If you need to perform some low-level operation on a package, this method
  is the best way to identify the package you want to work with specifically.

  ## Examples

  Find a compatible package named 'foo' in the current owner module:

      loader.canonicalPackage('foo', ownerPackage, function(err, pkg) {
      });

  Find the package named 'foo', exactly version '1.0.0'.  This may return a
  packes nested in the ownerPackage:

      loader.canonicalPackage('foo', '=1.0.0', ownerPackage, function(err, pkg) {
      });

  Find the latest version of 'foo' installed in the system - not specific to
  any particular package

      loader.canonicalPackage('foo', loader.anonymousPackage, function(err, pkg) {
      });

  @param {String|Package} packageId
    The packageId to load.  If you pass a package, the package itself will
    be returned.

  @param {String} vers
    The required version.  Pass null or omit this parameter to use the latest
    version (compatible with the workingPackage).

  @param {Package} workingPackage
    The working package.  This method will search in this package first for
    nested packages.  It will also consult the workingPackage to determine
    the required version if you don't name a version explicitly.

    You may pass null or omit this parameter, in which case the anonymous
    package will be used for context.

  @param {Function} done
    Callback.  Invoked with an error and the loaded package.  If no matching
    package can be found, invoked with null for the package.

  @returns {void}
*/
Loader.prototype.canonicalPackageId = function(packageId, vers, workingPackage) {

  var idx;

  if (packageId instanceof Package) return packageId.id;

  if (isCanonicalId(packageId)) {
    idx = packageId.indexOf(':', 2);
    if (idx>=0) packageId = packageId.slice(0,idx);
    return packageId;
  }

  if (vers && (T_STRING !== typeof vers)) {
    workingPackage = vers;
    vers = null;
  }

  if (!workingPackage) workingPackage = this.anonymousPackage;

  idx = packageId.indexOf(':');
  if (idx>=0) packageId = packageId.slice(0, idx);

  return this._canonicalPackageId(packageId, vers, workingPackage);
};


/**
  Primitive returns the package instance for the named canonicalId.  You can
  pass in a canonicalId for a package only or a package and module.  In either
  case, this method will only return the package instance itself.

  Note that to load a canonicalId that was not resolved through the
  canonicalPackageId() or canonical() method, you will need to also pass in
  a workingPackage so the loader can find the package.

  @param {String} canonicalId
    The canonicalId to load a package for.  May contain only the packageId or
    a moduleId as well.

  @param {Package} workingPackage
    Optional workingPackage used to locate the package.  This is only needed
    if you request a canonicalId that you did not obtain through the
    canonical*() methods on the loader.

  @returns {void}
*/
Loader.prototype.packageFor = function(canonicalId, workingPackage){

  if (!workingPackage) workingPackage = this.anonymousPackage;

  var idx = canonicalId.indexOf(':', 2);
  if (idx>=0) canonicalId = canonicalId.slice(0, idx);

  return this._packageFor(canonicalId, workingPackage);
};

/**
  Verifies that the named canonicalId is ready for use, including any of its
  dependencies.  You can pass in either a canonical packageId only or a
  moduleId.   In either case, this method will actually only check the package
  properties for dependency resolution since dependencies are not tracked for
  individual modules.

  @param {String} canonicalId
    The canonicalId to use for lookup

  @param
*/
Loader.prototype.ready = function(canonicalId, workingPackage) {

  if (!workingPackage) workingPackage = this.anonymousPackage;

  var idx = canonicalId.indexOf(':', 2),
      moduleId, pkg;

  if (idx >= 0) {
    moduleId    = canonicalId.slice(idx+1);
    canonicalId = canonicalId.slice(0, idx);
  }

  if (this._packageReady(canonicalId, workingPackage, {})) {
    pkg = this._packageFor(canonicalId, workingPackage);
    if (!pkg) return false;
    return !!pkg.exists(moduleId);
  } else return false;

};

/**
  Ensures the package that maps to the passed packageId/vers combo and all
  of its known dependencies are loaded and ready for use.  If anything is not
  loaded, it will load them also.

  Invokes the passed callback when loading is complete.

  This method ends up calling ensurePackage() on one or more of its sources
  to get the actual packages to load.

  @param {String} packageId
    The packageID to load.  May be a packageId name or a canonical packageId

  @param {String} vers
    Optional version used to constrain the compatible package

  @param {Package} workingPackage
    Optional working package used to match the packageId.  If the package
    might be nested you should always pass a workingPackage.  Default assumes
    anonymousPackage.

  @param {Function} done
    Callback invoked when package is loaded.  Passes an error if there was an
    error.  Otherwise no params.

  @returns {void}
*/
Loader.prototype.ensurePackage = function(packageId, vers, workingPackage, done) {

  if (vers && (T_STRING !== typeof vers)) {
    done = workingPackage ;
    workingPackage = vers;
    vers = null;
  }

  if (workingPackage && (T_FUNCTION === typeof workingPackage)) {
    done = workingPackage;
    workingPackage = null;
  }

  if (!workingPackage) workingPackage = this.anonymousPackage;

  this._ensurePackage(packageId, vers, workingPackage, {}, done);
};

/**
  @private

  Primitive for ensurePackage().  Does no param normalization.  Called
  recursively for dependencies.
*/
Loader.prototype._ensurePackage = function(packageId, vers, workingPackage, seen, done) {

  var loader = this, canonicalId, source;

  canonicalId = this._canonicalPackageId(packageId, vers, workingPackage);
  if (!canonicalId) {
    return done(new NotFound(packageId, workingPackage));
  }

  if (seen[canonicalId]) return done(); // success
  seen[canonicalId] = true;

  source = this._sourceForCanonicalPackageId(canonicalId, workingPackage);
  if (!source) {
    return done(new NotFound(canonicalId, workingPackage));
  }

  source.ensurePackage(canonicalId, function(err) {
    var pkg, deps, packageId, packageIds;

    if (err) return done(err);
    pkg = loader.packageFor(canonicalId, workingPackage);
    if (!pkg) {
      return done(new NotFound(canonicalId, workingPackage));
    }

    deps = pkg.get('dependencies');
    if (!deps) return done(); // nothing to do

    packageIds = [];
    for(packageId in deps) {
      if (!deps.hasOwnProperty(packageId)) continue;
      packageIds.push({ packageId: packageId, vers: deps[packageId] });
    }

    parallel(packageIds, function(info, done) {
      loader._ensurePackage(info.packageId, info.vers, pkg, seen, done);
    })(done);

  });

};

/**
  @private

  Discovers the canonical packageId for the named packageId, version and
  working package.  This will also store in cache the source where you can
  locare and load the associated package, if needed.

  This primitive is used by all other package methods to resolve a package
  into a canonicalId that can be used to reference a specific package instance

  It does not perform any error checking on passed in parameters which is why
  it should never be called directly outside of the Loader itself.

  @param {String|Package} packageId
    The packageId to load.  If you pass a package, the package itself will
    be returned.

  @param {String} vers
    The required version.  Pass null or omit this parameter to use the latest
    version (compatible with the workingPackage).

  @param {Package} workingPackage
    The working package.  This method will search in this package first for
    nested packages.  It will also consult the workingPackage to determine
    the required version if you don't name a version explicitly.

  @returns {String}
*/
Loader.prototype._canonicalPackageId = function(packageId, vers, workingPackage) {

  if (packageId instanceof Package) return packageId.id;
  if (isCanonicalId(packageId)) return packageId;
  if ((packageId === 'default') && this.defaultPackage) {
    return this.defaultPackage.id;
  }

  var cache = this.canonicalPackageIds,
      cacheId, sources, ret, idx, len, source;

  if (!workingPackage) workingPackage = this.anonymousPackage;
  if (!workingPackage) throw new Error('working package is required');

  if (!vers) vers = workingPackage.requiredVersion(packageId);

  cacheId = workingPackage.id;
  if (!cache) cache = this.canonicalPackageIds = {};
  if (!cache[cacheId]) cache[cacheId] = {};
  cache = cache[cacheId];
  if (!cache[packageId]) cache[packageId] = {};
  cache = cache[packageId];
  if (cache[vers]) return cache[vers];

  sources = this.sources;

  ret = workingPackage.canonicalPackageId(packageId, vers);
  source = workingPackage;


  if (!ret) {
    ret = workingPackage.canonicalPackageId(packageId, null);
    if (ret) {
      throw new Error(
        workingPackage.get('name')+" contains an incompatible nested"+
        " package "+packageId+" (expected: "+vers+")");
    }
  }


  if (!ret && sources) {
    len = sources.length;
    for(idx=0;!ret && (idx<len);idx++) {
      source = sources[idx];
      ret = source.canonicalPackageId(packageId, vers);
    }
  }

  if (ret) this._cachePackageSource(ret, workingPackage, source);
  cache[vers] = ret;
  return ret ;
};

Loader.prototype._cachePackageSource = function(id, workingPackage, source) {
  var scache = this.packageSources, pkgId = workingPackage.id;

  if (!scache) scache = this.packageSources = {};
  if (!scache[pkgId]) scache[pkgId] = {};
  scache = scache[pkgId];
  scache[id] = source;
};

/**
  Looks up the source for the named canonicalId in the cache.  Returns null
  if no match is found.
*/
Loader.prototype._sourceForCanonicalPackageId = function(canonicalId, workingPackage) {
  var scache = this.packageSources,
      wpackageId = workingPackage.id,
      pkg, sources, len, idx, ret;

  if (!scache) scache = this.packageSources = {};
  if (!scache[wpackageId]) scache[wpackageId] = {};
  scache = scache[wpackageId];
  if (scache[canonicalId]) return scache[canonicalId];

  sources = this.sources;

  if (workingPackage) {
    pkg = workingPackage.packageFor(canonicalId);
    if (pkg) ret = workingPackage;
  }

  if (!ret && sources) {
    len = sources.length;
    for(idx=0;!ret && (idx<len); idx++) {
      ret = sources[idx];
      if (!ret.packageFor(canonicalId)) ret = null;
    }
  }

  scache[canonicalId] = ret;
  return ret ;
};

/**
  Primitive actually loads a package from a canonicalId.  Throws an exception
  if source for package is not already in cache.  Also caches loaded package.
*/
Loader.prototype._packageFor = function(canonicalId, workingPackage) {
  var cache, source, ret;

  if (this.defaultPackage && (canonicalId === this.defaultPackage.id)) {
    return this.defaultPackage;
  }

  cache = this.packages;
  if (!cache) cache = this.packages = {};
  if (cache[canonicalId]) return cache[canonicalId];

  source = this._sourceForCanonicalPackageId(canonicalId, workingPackage);
  if (source) ret = source.packageFor(canonicalId);
  cache[canonicalId] = ret;
  return ret ;
};

/**
  Primitive simply checks to see if the named canonicalId is ready or not
  along with any dependencies
*/
Loader.prototype._packageReady = function(canonicalId, workingPackage, seen) {
  var cache = this.packages, pkg, deps, packageId, vers;

  if (seen[canonicalId]) return true;
  seen[canonicalId] = true;

  pkg = this._packageFor(canonicalId, workingPackage);
  if (!pkg) return false; // nothing to do.

  deps = pkg.get('dependencies');
  for(packageId in deps) {
    if (!deps.hasOwnProperty(packageId)) continue;
    vers = deps[packageId];
    canonicalId = this._canonicalPackageId(packageId, vers, pkg);
    if (!canonicalId) return false;
    return this._packageReady(canonicalId, pkg, seen);
  }

  return true;
};

/**
  Take a relative or fully qualified module name as well as an optional
  base module Id name and returns a fully qualified module name.  If you
  pass a relative module name and no baseId, throws an exception.

  Any embedded package name will remain in-tact.

  resolve('foo', 'bar', 'my_package') => 'foo'
  resolve('./foo', 'bar/baz', 'my_package') => 'my_package:bar/foo'
  resolve('/foo/bar/baz', 'bar/baz', 'my_package') => 'default:/foo/bar/baz'
  resolve('foo/../bar', 'baz', 'my_package') => 'foo/bar'
  resolve('your_package:foo', 'baz', 'my_package') => 'your_package:foo'

  If the returned id does not include a packageId then the canonical()
  method will attempt to resolve the ID by searching the default package,
  then the current package, then looking for a package by the same name.

  @param {String} moduleId relative or fully qualified module id
  @param {String} baseId fully qualified base id
  @returns {String} fully qualified name
*/
Loader.prototype._resolve = function(moduleId, curModuleId, pkg){
  var path, len, idx, part, parts, packageId, err;

  if (moduleId[0]==='/' && moduleId.indexOf(':')<0) {
    return this.anonymousPackage.id + ':' + moduleId;
  }

  if (moduleId.match(/(^\.\.?\/)|(\/\.\.?\/)|(\/\.\.?\/?$)/)) {

    if ((idx=moduleId.indexOf(':'))>=0) {
      packageId = moduleId.slice(0,idx);
      moduleId  = moduleId.slice(idx+1);
      path      = []; // path must always be absolute.

    } else if (moduleId.match(/^\.\.?\//)) {
      if (!curModuleId) {
        throw new Error("id required to resolve relative id: "+moduleId);
      }

      if (curModuleId.indexOf(':')>=0) {
        throw new Error("current moduleId cannot contain packageId");
      }

      if (pkg) packageId = pkg.id;

      path = curModuleId.split('/');
      path.pop();

    } else path = [];

    parts = moduleId.split('/');
    len   = parts.length;
    for(idx=0;idx<len;idx++) {
      part = parts[idx];
      if (part === '..') {
        if (path.length<1) throw new Error("invalid path: "+moduleId);
        path.pop();

      } else if (part !== '.') path.push(part);
    }

    moduleId = path.join('/');
    if (packageId) moduleId = joinPackageId(packageId, moduleId);
  }

  return moduleId ;
};



/**
  A Sandbox maintains a cache of instantiated modules.  Whenever a modules
  is instantiated, it will always be owned by a single sandbox.  This way
  when you required the same module more than once, you will always get the
  same module.

  Each sandbox is owned by a single loader, which is responsible for providing
  the sandbox with Factory objects to instantiate new modules.

  A sandbox can also have a 'main' module which can be used as a primary
  entry point for finding other related modules.

*/
var Sandbox = exports.extend(Object);
exports.Sandbox = Sandbox;

Sandbox.prototype.init = function(loader, env, args, mainModuleId) {
  this.loader = loader;
  this.env    = env;
  this.args   = args;
  if (mainModuleId) this.main(mainModuleId);

  this.clear();
};

Sandbox.prototype.catalogPackages = function(workingPackage) {
  return this.loader.catalogPackages(workingPackage);
};

Sandbox.prototype.createRequire = function(module) {

  var sandbox = this,
      curId   = module.id,
      curPkg  = module.ownerPackage,
      reqd;

  var req = function(moduleId, packageId) {
    if (packageId && moduleId.indexOf(':')<0) {
      if (packageId.isPackage) packageId = packageId.id;
      moduleId = packageId+':'+moduleId;
    }
    return sandbox.require(moduleId, curId, curPkg);
  };
  reqd = req.displayName = (curId||'(unknown)')+'#require';

  req.nativeRequire = sandbox.nativeRequire;

  req.ensure = function(moduleIds, done) {
    if (!isArray(moduleIds)) {
      moduleIds = Array.prototype.slice.call(arguments);
      done = moduleIds.pop();
    }

    parallel(moduleIds, function(moduleId, done) {
      sandbox.ensure(moduleId, curId, curPkg, done);

    })(function(err) {
      if (err) return done(err);
      if (done.length<=1) return done(); // don't lookup modules themselves

      done(null, map(moduleIds, function(moduleId) {
        return sandbox.require(moduleId, curId, curPkg);
      }));
    });
  };
  req.ensure.displayName = reqd+'.ensure';

  req.ready = function(moduleIds) {
    var idx, len ;

    if (!isArray(moduleIds)) {
      moduleIds = Array.prototype.slice.call(arguments);
    }

    len = moduleIds.length;
    for(idx=0;idx<len;idx++) {
      if (!sandbox.ready(moduleIds[idx], curId, curPkg)) return false;
    }
    return true;
  };
  req.ready.displayName = reqd+'.ready';

  /**
    Returns the package for the named packageId and optional version from
    the perspective of the current package.  This invokes a similar method
    on the sandbox, which will pass it along to the loader, though a secure
    sandbox may actually wrap the responses as well.

    This method only acts on packages available locally.  To get possibly
    remote packages, you must first call require.ensurePackage() to ensure
    the package and its dependencies have been loaded.

    @param {String} packageId
      The packageId to load

    @param {String} vers
      Optional version

    @returns {Package} the package or null
  */
  req.packageFor = function(packageId, vers) {
    return sandbox.packageFor(packageId, vers, curPkg);
  };
  req.packageFor.displayName = reqd+'.packageFor';

  /**
    Asynchronously loads the named package and any dependencies if needed.
    This is only required if you suspect your package may not be available
    locally.  If your callback accepts only one parameter, then the packages
    will be loaded but not instantiated. The first parameter is always an
    error object or null.

    If your callback accepts more than one parameter, then the packages will
    be instantiated and passed to your callback as well.

    If a package cannot be loaded for some reason, your callback will be
    invoked with an error of type NotFound.

    @param {String} packageId
      The packageId to load

    @param {String} vers
      Optional version

    @param {Function} done
      Callback invoked once packages have loaded.

    @returns {Package} the package or null
  */
  req.ensurePackage = function(packageId, vers, done) {
    sandbox.ensurePackage(packageId, vers, curPkg, function(err) {
      if (err) return done(err);
      if (done.length <= 1) return done();
      done(null, sandbox.packageFor(packageId, vers, curPkg));
    });
  };
  req.ensurePackage.displayName = reqd+'.ensurePackage.displayName';

  /**
    Returns a catalog of all packages visible to the current module without
    any additional loading.  This may be an expensive operation; you should
    only use it when necessary to detect plugins, etc.
  */
  req.catalogPackages = function() {
    return sandbox.catalogPackages(curPkg);
  };

  req.main = sandbox.main();
  req.env  = sandbox.env;
  req.args = sandbox.args;
  req.sandbox = sandbox;
  req.loader  = sandbox.loader;

  req.isTiki = true; // walk like a duck

  return req;
};


Sandbox.prototype.Module = Module;

/**
  Retrieves a module object for the passed moduleId.  You can also pass
  optional package information, including an optional curModuleId and a
  workingPackage.  You MUST pass at least a workingPackage.

  The returned module object represents the module but the module exports may
  not yet be instantiated.  Use require() to retrieve the module exports.

  @param {String} moduleId
    The module id to lookup.  Should include a nested packageId

  @param {String} curModuleId
    Optional current module id to resolve relative modules.

  @param {Package} workingPackage
    The working package making the request

  @returns {void}
*/
Sandbox.prototype.module = function(moduleId, curModuleId, workingPackage) {

  var ret, canonicalId, cache, packageId, idx, pkg;

  canonicalId = this.loader.canonical(moduleId, curModuleId, workingPackage);
  if (!canonicalId) throw(new NotFound(moduleId, workingPackage));

  cache = this.modules;
  if (!cache) cache = this.modules = {};
  if (ret = cache[canonicalId]) return ret;

  idx       = canonicalId.indexOf(':', 2);
  moduleId  = canonicalId.slice(idx+1);
  packageId = canonicalId.slice(0, idx);
  pkg = this.loader.packageFor(packageId, workingPackage);
  if (!pkg) throw(new NotFound(packageId, workingPackage));
  ret = cache[canonicalId] = new this.Module(moduleId, pkg, this);

  return ret ;
};

/**
  Returns the main module for the sandbox.  This should only be called
  from the factory when it is setting main on itself.  Otherwise the main
  module may not exist yet.

  Note that the mainModule will be resolved using the anonymousPackage so
  the named module must be visible from there.
*/
Sandbox.prototype.main = function(newMainModuleId, workingPackage) {
  if (newMainModuleId !== undefined) {
    this._mainModule = null;
    this._mainModuleId = newMainModuleId;
    this._mainModuleWorkingPackage = workingPackage;
    return this;

  } else {
    if (!this._mainModule && this._mainModuleId) {
      workingPackage = this._mainModuleWorkingPackage;
      this._mainModule = this.module(this._mainModuleId, workingPackage);
    }
    return this._mainModule;
  }
};

/**
  Returns the exports for the named module.

  @param {String} moduleId
    The module id to lookup.  Should include a nested packageId

  @param {String} curModuleId
    Optional current module id to resolve relative modules.

  @param {Package} workingPackage
    The working package making the request

  @param {Function} done
    Callback to invoke when the module has been retrieved.

  @returns {void}
*/
Sandbox.prototype.require = function(moduleId, curModuleId, workingPackage) {

  var ret, canonicalId, cache, used, factory, module, exp;

  canonicalId = this.loader.canonical(moduleId, curModuleId, workingPackage);
  if (!canonicalId) throw new NotFound(moduleId, workingPackage);

  cache = this.exports; used  = this.usedExports;
  if (!cache) cache = this.exports = {};
  if (!used)  used  = this.usedExports = {};
  if (ret = cache[canonicalId]) {
    ret = ret.exports;
    if (!used[canonicalId]) used[canonicalId] = ret;
    return ret;
  }

  factory = this.loader.load(canonicalId, workingPackage, this);
  if (!factory) throw(new NotFound(canonicalId, workingPackage));

  module  = this.module(canonicalId, workingPackage);
  cache[canonicalId] = module;

  exp = factory.call(this, module);
  module.exports = exp;

  if (used[canonicalId] && (used[canonicalId] !== exp)) {
    throw new Error("cyclical requires() in "+canonicalId);
  }

  return exp;
};

/**
  Returns true if the given module is ready. This checks the local cache
  first then hands this off to the loader.
*/
Sandbox.prototype.ready = function(moduleId, curModuleId, workingPackage) {
  var id = this.loader.canonical(moduleId, curModuleId, workingPackage);
  return id ? this.loader.ready(id) : false;
};

/**
  Ensures the passed moduleId and all of its dependencies are available in
  the local domain.  If any dependencies are not available locally, attempts
  to retrieve them from a remote server.

  You don't usually call this method directly.  Instead you should call the
  require.ensure() method defined on a module's local require() method.

*/
Sandbox.prototype.ensure = function(moduleId, curModuleId, workingPackage, done) {

  var id, loader, packageId, idx;

  if (curModuleId && (T_STRING !== typeof curModuleId)) {
    done = workingPackage;
    workingPackage = curModuleId;
    curModuleId = null;
  }

  if (workingPackage && (T_FUNCTION === typeof workingPackage)) {
    done = workingPackage ;
    workingPackage = null;
  }

  id = this.loader.canonical(moduleId, curModuleId, workingPackage);
  if (!id) return done(new NotFound(moduleId, workingPackage));

  idx       = id.indexOf(':', 2);
  moduleId  = id.slice(idx+1);
  packageId = id.slice(0, idx);
  loader    = this.loader;

  loader.ensurePackage(packageId, workingPackage, function(err) {
    if (err) return done(err);
    var pkg = loader.packageFor(packageId, workingPackage);
    if (!pkg.exists(moduleId)) done(new NotFound(moduleId, pkg));
    else done(); // all clear
  });
};

/**
  TODO: document
*/
Sandbox.prototype.packageFor = function(packageId, vers, workingPackage) {

  var id = this.loader.canonicalPackageId(packageId, vers, workingPackage);
  if (!id) return null;
  return this.loader.packageFor(id);
};

/**
  TODO: document
*/
Sandbox.prototype.ensurePackage = function(packageId, vers, workingPackage, done) {

  if (vers && (T_STRING !== typeof vers)) {
    done = workingPackage;
    workingPackage = vers;
    vers = null;
  }

  if (workingPackage && (T_FUNCTION === typeof workingPackage)) {
    done = workingPackage ;
    workingPackage = null;
  }

  var id = this.loader.canonicalPackageId(packageId, vers, workingPackage);
  if (!id) return done(new NotFound(packageId, workingPackage));
  this.loader.ensurePackage(id, done);
};


/**
  Returns the path or URL to a resource in the named package.
*/
Sandbox.prototype.resource = function(resourceId, moduleId, ownerPackage) {
  if (!ownerPackage.resource) return null;
  return ownerPackage.resource(resourceId, moduleId);
};

/**
  Clears the sandbox.  requiring modules will cause them to be reinstantied
*/
Sandbox.prototype.clear = function() {
  this.exports = {};
  this.modules = {};
  this.usedExports = {};
  return this;
};



var Browser = exports.extend(Object);
exports.Browser = Browser;

Browser.prototype.init = function() {
  this._ready  = {};
  this._unload = {};

  this.clear();
};

/**
  Reset the browser caches.  This would require all packages and modules
  to register themselves.  You should also clear the associated loader and
  sandbox if you use this.
*/
Browser.prototype.clear = function() {
  this.packageInfoByName = {}; // stores package info sorted by name/version
  this.packageInfoById   = {}; // stores package info sorted by id
  this.packages    = {}; // instantiated packages
  this.factories   = {}; // registered module factories by id

  this.stylesheetActions = {}; // resolvable stylesheet load actions
  this.scriptActions     = {}; // resolvable script actions
  this.ensureActions     = {}; // resolvable package actions
};

/**
  Configures a basic sandbox environment based on the browser.  Now you can
  register and require from it.

  @returns {Browser} new instance
*/
Browser.start = function(env, args, queue) {
  var browser, len, idx, action;

  browser         = new Browser();
  browser.loader  = new Loader([browser]);
  browser.sandbox = new Sandbox(browser.loader, env, args);
  browser.queue   = queue;

  var mod = {
    id: 'index',
    ownerPackage: browser.loader.anonymousPackage
  };

  browser.require = browser.sandbox.createRequire(mod);

  return browser;
};

Browser.prototype.replay = function() {
  var queue = this.queue,
      len   = queue ? queue.length : 0,
      idx, action;

  this.queue = null;
  for(idx=0;idx<len;idx++) {
    action = queue[idx];
    this[action.m].apply(this, action.a);
  }

  return this;
};

Browser.prototype.start = function() {
  return this;
};

/**
  Makes all dependencies of the passed canonical packageId global.  Used
  for backwards compatibility with non-CommonJS libraries.
*/
Browser.prototype.global = function(canonicalId) {
  if (!domAvailable && !xhrAvailable) return this;  // don't work out of brsr
  var GLOBAL = (function() { return this; })();

  var globals, pkg, deps, packageId, exports, keys, key, idx, len;

  globals = this.globals;
  if (!globals) globals = this.globals = {};

  pkg = this.packageFor(canonicalId);
  if (!pkg) throw new Error(canonicalId+' package not found');

  deps = pkg.get('dependencies');
  if (!deps) return this; // nothing to do

  for(packageId in deps) {
    if (!deps.hasOwnProperty(packageId)) continue;
    canonicalId  = this.loader.canonical(packageId, pkg);
    if (globals[canonicalId]) continue;
    globals[canonicalId] = true;

    if (!this.sandbox.ready(packageId, pkg)) continue;

    exports = this.sandbox.require(packageId, pkg);
    if (keys = exports.__globals__) {
      len = keys.length;
      for(idx=0;idx<len;idx++) {
        key = keys[idx];
        GLOBAL[key] = exports[key];
      }

    } else {
      for(key in exports) {
        if (!exports.hasOwnProperty(key)) continue;
        GLOBAL[key] = exports[key];
      }
    }

  }

  return this;
};


var buildInvocation = function(args) {
  var context, method;

  if (args.length === 1) {
    context = null;
    method  = args[0];
    args = Array.prototype.slice.call(args, 1);
  } else {
    context = args[0];
    method  = args[1];
    args    = Array.prototype.slice.call(args, 2);
  }

  return { target: context, method: method, args: args };
};

var queueListener = function(base, queueName, args) {
  if (!base[queueName]) base[queueName] = [];
  base[queueName].push(buildInvocation(args));
};

/**
  Invoke the passed callback when the document is ready.  You can pass
  either an object/function or a moduleId and property name plus additional
  arguments.
*/
Browser.prototype.addReadyListener = function(context, method) {
  if (this._ready && this._ready.isReady) {
    this._invoke(buildInvocation(arguments));
  } else {
    this._setupReadyListener();
    queueListener(this._ready, 'queue', arguments);
  }
};

/**
  Invoke the passed callback just after any ready listeners have fired but
  just before the main moduleId is required.  This is primarily provided as
  a way for legacy environments to hook in their own main function.
*/
Browser.prototype.addMainListener = function(context, method) {
  if (this._ready && this._ready.isReady) {
    this._invoke(buildInvocation(arguments));
  } else {
    this._setupReadyListener();
    queueListener(this._ready, 'mqueue', arguments);
  }
};

/**
  Invoke the passed callback when the browser is about to unload.
*/
Browser.prototype.addUnloadListener = function(context, method) {
  if (this._unload && this._unload.isUnloading) {
    this._invoke(buildInvocation(arguments));
  } else {
    this._setupUnloadListener();
    queueListener(this._unload, 'queue', arguments);
  }
};


Browser.prototype._invoke = function(inv) {
  var target = inv.target, method = inv.method;
  if (T_STRING === typeof target) target = this.require(target);
  if (T_STRING === typeof method) method = target[method];
  if (method) method.apply(target, inv.args);
  inv.target = inv.method = inv.args = null;
};

Browser.prototype._setupReadyListener = function() {
  if (this._ready.setup) return this;
  this._ready.setup =true;

  var ready = this._ready, source = this, fire;

  fire = function() {
    if (ready.isReady) return;
    ready.isReady = true;

    if (ready.cleanup) ready.cleanup();
    ready.cleanup = null;

    var q, len, idx;

    q = ready.queue;
    len = q ? q.length : 0;
    ready.queue = null;
    for(idx=0;idx<len;idx++) source._invoke(q[idx]);

    q = ready.mqueue;
    len = q ? q.length : 0 ;
    ready.mqueue = null;
    for(idx=0;idx<len;idx++) source._invoke(q[idx]);

    source._runMain(); // get main module.
  };

  if (T_UNDEFINED === typeof document) {

  } else if (document.addEventListener) {

    ready.cleanup = function() {
      document.removeEventListener('DOMContentLoaded', fire, false);
      document.removeEventListener('load', fire, false);
    };

    document.addEventListener('DOMContentLoaded', fire, false);
    document.addEventListener('load', fire, false);

  } else if (document.attachEvent) {

    ready.cleanup = function() {
      document.detachEvent('onreadystatechange', fire);
      document.detachEvent('onload', fire);
      ready.ieHandler = null; // will stop the ieHandler from firing again
    };

    document.attachEvent('onreadystatechange', fire);
    document.attachEvent('onload', fire);

    if ( document.documentElement.doScroll && window == window.top ) {
      ready.ieHandler = function() {

        if (ready.ieHandler && !ready.isReady) {
          try {
            document.documentElement.doScroll("left");
          } catch( error ) {
            setTimeout( ready.ieHandler, 0 );
            return;
          }
        }

        fire();
      };

      ready.ieHandler();
    }

  }
};

Browser._scheduleUnloadListener = function() {
  if (this._unload.setup) return this;
  this._unload.setup =true;

  var unload = this._unload, source = this, fire;

  unload.isUnloading = false;
  fire = function() {
    if (unload.isUnloading) return;
    unload.isUnloading = true;

    if (unload.cleanup) unload.cleanup();
    unload.cleanup = null;

    var q = unload.queue,
        len = q ? q.length : 0,
        idx, inv;

    unload.queue = null;
    for(idx=0;idx<len;idx++) source._invoke(q[idx]);
  };

  if (T_UNDEFINED === typeof document) {

  } else if (document.addEventListener) {
    unload.cleanup = function() {
      document.removeEventListener('unload', fire);
    };
    document.addEventListener('unload', fire, false);

  } else if (document.attachEvent) {
    unload.cleanup = function() {
      document.detachEvent('onunload', fire);
    };
    document.attachEvent('unload', fire);
  }

};


/**
  Sets the main moduleId on the sandbox.  This module will be automatically
  required after all other ready and main handlers have run when the document
  is ready.

  @param {String} moduleId
    A moduleId with packageId included ideally.  Can be canonicalId.

  @returns {void}
*/
Browser.prototype.main = function(moduleId, method) {
  if (this.sandbox) this.sandbox.main(moduleId);
  this._setupReadyListener(); // make sure we listen for ready event
  this._main = { id: moduleId, method: method };
};

Browser.prototype._runMain = function() {
  if (!this._main) return ;

  var moduleId = this._main.id,
      method   = this._main.method,
      req      = this.require;

  if (!moduleId || !req) return ;
  this._main = null;

  req.ensure(moduleId, function(err) {
    if (err) throw err;
    var exp = req(moduleId);
    if (T_STRING === typeof method) method = exp[method];
    if (method) method.call(exp);
  });
};


Browser.prototype._action  = function(action) {
  var ret;

  ret = once(function(done) {
    ret.resolve = function(err, val) {
      ret.resolve = null; // no more...
      done(err, val);
    };
    action();
  });
  return ret;

};

Browser.prototype._resolve = function(dict, key, value) {

  if (!dict[key]) dict[key] = function(done) { done(null, value); };

  else if (dict[key].resolve) dict[key].resolve(null, value);
  return this;
};

Browser.prototype._fail = function(dict, key, err) {
  if (dict[key].resolve) dict[key].resolve(err);
};

var T_SCRIPT     = 'script',
    T_STYLESHEET = 'stylesheet',
    T_RESOURCE   = 'resource';

/**
  Normalizes package info, expanding some compacted items out to full
  info needed.
*/
Browser.prototype._normalize = function(def, packageId) {
  if (!isCanonicalId(packageId)) packageId = '::'+packageId;
  def.id = packageId;
  def.version = semver.normalize(def.version);
  def['tiki:external'] = !!def['tiki:external'];
  def['tiki:private']  = !!def['tiki:private'];  // ditto

  var base = def['tiki:base'];
  if (def['tiki:resources']) {

    def['tiki:resources'] = map(def['tiki:resources'], function(item) {

      if (T_STRING === typeof item) {
        item = {
          id: packageId+':'+item,
          name: item
        };
      }

      if (!item.name) {
        throw new InvalidPackageDef(def, 'resources must have a name');
      }

      if (!item.id) {
        item.id = packageId+':'+item.name;
      }
      if (!isCanonicalId(item.id)) item.id = '::'+item.id;

      if (!item.type) {
        if (item.name.match(/\.js$/)) item.type = T_SCRIPT;
        else if (item.name.match(/\.css$/)) item.type = T_STYLESHEET;
        else item.type = T_RESOURCE;
      }

      if (!item.url) {
        if (base) item.url = base+'/'+item.name;
        else item.url = item.id+item.name;
      }

      return item;
    });
  }

  if (!def.dependencies) def.dependencies = {};

  var nested = def['tiki:nested'], key;
  if (nested) {
    for(key in nested) {
      if (!nested.hasOwnProperty(key)) continue;
      if (!isCanonicalId(nested[key])) nested[key] = '::'+nested[key];
    }

  } else def['tiki:nested'] = {};

  return def;
};

/**
  Register new package information.
*/
Browser.prototype.register = function(packageId, def) {
  var reg, replace, name, vers, idx = -1;

  def = this._normalize(def, packageId);
  packageId = def.id; // make sure to get normalized packageId

  reg = this.packageInfoById;
  if (!reg) reg = this.packageInfoById = {};
  if (reg[packageId]) {
    if (!reg[packageId]['tiki:external']) return this;
    replace = reg[packageId];
  }
  reg[packageId] = def;

  if (def.name) {
    name = def.name;
    vers = def.version;

    reg = this.packageInfoByName;
    if (!reg) reg = this.packageInfoByName = {};
    if (!reg[name]) reg[name] = {};
    reg = reg[name];

    if (!reg[vers] || (reg[vers].length<=1)) {
      reg[vers] = [def];
    } else {
      if (replace) idx = reg[vers].indexOf(replace);
      if (idx>=0) {
        reg[vers] = reg[vers].slice(0, idx).concat(reg[vers].slice(idx+1));
      }
      reg[vers].push(def);
    }

  }

  return this;
};

/**
  Main registration API for all modules.  Simply registers a module for later
  use by a package.
*/
Browser.prototype.module = function(key, def) {
  if (!isCanonicalId(key)) key = '::'+key;
  this.factories[key] = def;
  return this;
};

/**
  Register a script that has loaded
*/
Browser.prototype.script = function(scriptId) {
  if (!isCanonicalId(scriptId)) scriptId = '::'+scriptId;
  this._resolve(this.scriptActions, scriptId, true);
};

/**
  Register a stylesheet that has loaded.
*/
Browser.prototype.stylesheet = function(stylesheetId) {
  if (!isCanonicalId(stylesheetId)) stylesheetId = '::'+stylesheetId;
  this._resolve(this.stylesheetActions, stylesheetId, true);
};


var domAvailable = T_UNDEFINED !== typeof document && document.createElement;
var xhrAvailable = T_UNDEFINED !== typeof XMLHttpRequest;

/**
  Whether to use XHR by default. If true, XHR is tried first to fetch script
  resources; script tag injection is only used as a fallback if XHR fails. If
  false (the default if the DOM is available), script tag injection is tried
  first, and XHR is used as the fallback.
*/
Browser.prototype.xhr = !domAvailable;

/**
  Whether to automatically wrap the fetched JavaScript in tiki.module() and
  tiki.script() calls. With this on, CommonJS modules will "just work" without
  preprocessing. Setting this to true requires, and implies, that XHR will be
  used to fetch the files.
*/
Browser.prototype.autowrap = false;

var findPublicPackageInfo = function(infos) {
  if (!infos) return null;

  var loc = infos.length;
  while(--loc>=0) {
    if (!infos[loc]['tiki:private']) return infos[loc];
  }
  return null;
};

/**
  Find the canonical package ID for the passed package ID and optional
  version.  This will look through all the registered package infos, only
  searching those that are not private, but including external references.
*/
Browser.prototype.canonicalPackageId = function(packageId, vers) {
  var info = this.packageInfoByName[packageId],
      ret, cur, cvers, rvers;

  if (vers) vers = semver.normalize(vers);
  if (!info) return null; // not found

  if (info[vers] && (info[vers].length===1)) return info[vers][0].id;

  for(cvers in info) {
    if (!info.hasOwnProperty(cvers)) continue;
    if (!semver.compatible(vers, cvers)) continue;
    if (!ret || (semver.compare(rvers, cvers)<0)) {
      ret = findPublicPackageInfo(info[cvers]);
      if (ret) rvers = cvers;
    }
  }

  return ret ? ret.id : null;
};

Browser.prototype.packageFor = function(canonicalId) {
  var ret = this.packages[canonicalId];
  if (ret) return ret ;

  ret = this.packageInfoById[canonicalId];
  if (ret && !ret['tiki:external']) { // external refs can't be instantiated
    ret = new this.Package(canonicalId, ret, this);
    this.packages[canonicalId] = ret;
    return ret ;
  }

  return null ; // not found
};

/**
  Ensures the named canonical packageId and all of its dependent scripts are
  loaded.
*/
Browser.prototype.ensurePackage = function(canonicalId, done) {
  var action = this.ensureActions[canonicalId];
  if (action) return action(done); // add another listener

  var info = this.packageInfoById[canonicalId];
  if (!info) {
    return done(new NotFound(canonicalId, 'browser package info'));
  }

  var source = this;

  action = once(function(done) {
    var cnt = 1, ready = false, cancelled;

    var cleanup = function(err) {
      if (cancelled) return;
      if (err) {
        cancelled = true;
        return done(err);
      }

      cnt = cnt-1;
      if (cnt<=0 && ready) return done(null, info);
    };

    var dependencies = info.dependencies,
        nested       = info['tiki:nested'],
        packageId, vers, depInfo, curId;

    for(packageId in dependencies) {
      if (!dependencies.hasOwnProperty(packageId)) continue;
      curId = nested[packageId];
      if (!curId) {
        vers = dependencies[packageId];
        curId = source.canonicalPackageId(packageId, vers);
      }

      if (curId && source.packageInfoById[canonicalId]) {
        cnt++;
        source.ensurePackage(curId, cleanup);
      }
    }

    var resources = info['tiki:resources'],
        lim = resources ? resources.length : 0,
        loc, rsrc;
    for(loc=0;loc<lim;loc++) {
      rsrc = resources[loc];
      if (rsrc.type === T_RESOURCE) continue;
      if (rsrc.type === T_SCRIPT) {
        cnt++;
        source.ensureScript(rsrc.id, rsrc.url, cleanup);
      } else if (rsrc.type === T_STYLESHEET) {
        cnt++;
        source.ensureStylesheet(rsrc.id, rsrc.url, cleanup);
      }
    }

    ready = true;
    cleanup();

  });

  this.ensureActions[canonicalId] = action;
  action(done); // kick off
};

Browser.prototype.ensureScript = function(id, url, done) {
  var action = this.scriptActions[id];
  if (action) return action(done);

  var source = this;
  action = this._action(function() {
    source._loadScript(id, url);
  });

  this.scriptActions[id] = action;
  return action(done);
};

Browser.prototype.ensureStylesheet = function(id, url, done) {
  var action = this.stylesheetActions[id];
  if (action) return action(done);

  var source = this;
  action = this._action(function() {
    source._loadStylesheet(id, url);
  });

  this.stylesheetActions[id] = action;
  return action(done);
};

Browser.prototype._injectScript = function(id, url) {
  var body, el;

  body = document.body;
  el = document.createElement('script');
  el.src = url;
  body.appendChild(el);
  body = el = null;
};

Browser.prototype._xhrScript = function(id, url) {
  var autowrap = this.autowrap;

  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onreadystatechange = function(evt) {
    if (req.readyState !== 4 || (req.status !== 200 && req.status !== 0)) {
      return;
    }

    var src = req.responseText;
    if (autowrap) {
      src = "tiki.module('" + id + "', function(require, exports, module) {" +
        src + "});" + "tiki.script('" + id + "');";
    }

    eval(src + "\n//@ sourceURL=" + url);

  };

  req.send(null);
};

Browser.prototype._loadScript = function(id, url) {
    if (this.autowrap) {
        this.xhr = true;
        if (!xhrAvailable) {
            DEBUG('Autowrap is on but XHR is not available. Danger ahead.');
        }
    }

    if (xhrAvailable && domAvailable) {
        if (this.xhr) {
            try {
                return this._xhrScript(id, url);
            } catch (e) {
                return this._injectScript(id, url);
            }
        } else {
            try {
                return this._injectScript(id, url);
            } catch (e) {
                return this._xhrScript(id, url);
            }
        }
    } else if (xhrAvailable) {
        return this._xhrScript(id, url);
    } else if (domAvailable) {
        return this._injectScript(id, url);
    }

    DEBUG('Browser#_loadScript() not supported on this platform.');
    this.script(id);
};

if (domAvailable) {
  Browser.prototype._loadStylesheet = function(id, url) {
    var body, el;

    body = document.getElementsByTagName('head')[0] || document.body;
    el   = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = url;
    el.type = 'text/css';
    body.appendChild(el);
    el = body = null;

    this.stylesheet(id); // no onload support - just notify now.
  };
} else {
  Browser.prototype._loadStylesheet = function(id, url) {
    DEBUG('Browser#_loadStylesheet() not supported on this platform.');
    this.stylesheet(id);
  };
}




/**
  Special edition of Package designed to work with the Browser source.  This
  kind of package knows how to get its data out of the Browser source on
  demand.
*/
var BrowserPackage = Package.extend();
Browser.prototype.Package = BrowserPackage;

BrowserPackage.prototype.init = function(id, config, source) {
  Package.prototype.init.call(this, id, config);
  this.source = source;
};

BrowserPackage.prototype.canonicalPackageId = function(packageId, vers) {
  var ret, nested, info;

  ret = Package.prototype.canonicalPackageId.call(this, packageId, vers);
  if (ret) return ret ;

  nested = this.get('tiki:nested') || {};
  ret = nested[packageId];
  if (!ret) return null;

  info = this.source.packageInfoById[ret];
  return info && semver.compatible(vers,info.version) ? ret : null;
};

BrowserPackage.prototype.packageFor = function(canonicalId) {
  var ret = Package.prototype.packageFor.call(this, canonicalId);
  return ret ? ret : this.source.packageFor(canonicalId);
};

BrowserPackage.prototype.ensurePackage = function(canonicalId, done) {
  if (canonicalId === this.id) return done();
  this.source.ensurePackage(canonicalId, done);
};

BrowserPackage.prototype.catalogPackages = function() {
  var ret = [this], nested, key;

  nested = this.get('tiki:nested') || {};
  for(key in nested) {
    if (!nested.hasOwnProperty(key)) continue;
    ret.push(this.source.packageFor(nested[key]));
  }

  return ret ;
};

BrowserPackage.prototype.exists = function(moduleId) {
  var canonicalId = this.id+':'+moduleId;
  return !!this.source.factories[canonicalId];
};

BrowserPackage.prototype.load = function(moduleId) {
  var canonicalId, factory;

  canonicalId = this.id+':'+moduleId;
  factory  = this.source.factories[canonicalId];
  return factory ? new this.Factory(moduleId, this, factory) : null;
};

BrowserPackage.prototype.Factory = Factory;


displayNames(exports, 'tiki');

});
/*globals tiki ENV ARGS */

"use modules false";
"use loader false";

tiki = tiki.start();
tiki.replay(); // replay queue

bespin.tiki = tiki;
})();

;bespin.tiki.register("::bespin", {
    name: "bespin",
    dependencies: {  }
});bespin.bootLoaded = true;
bespin.tiki.module("bespin:builtins",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

exports.metadata =
{
    "bespin":
    {
        "provides":
        [
            {
                "ep": "extensionpoint",
                "name": "extensionpoint",
                "indexOx": "name",
                "register": "plugins#registerExtensionPoint",
                "unregister": "plugins#unregisterExtensionPoint",
                "description": "Defines a new extension point",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "description": "the extension point's name",
                        "required": true
                    },
                    {
                        "name": "description",
                        "type": "string",
                        "description": "description of what the extension point is for"
                    },
                    {
                        "name": "params",
                        "type": "array of objects",
                        "description": "parameters that provide the metadata for a given extension. Each object should have name and description, minimally. It can also have a 'type' (eg string, pointer, or array) and required to denote whether or not this parameter must be present on the extension."
                    },
                    {
                        "name": "indexOn",
                        "type": "string",
                        "description": "You can provide an 'indexOn' property to name a property of extensions through which you'd like to be able to easily look up the extension."
                    },
                    {
                        "name": "register",
                        "type": "pointer",
                        "description": "function that is called when a new extension is discovered. Note that this should be used sparingly, because it will cause your plugin to be loaded whenever a matching plugin appears."
                    },
                    {
                        "name": "unregister",
                        "type": "pointer",
                        "description": "function that is called when an extension is removed. Note that this should be used sparingly, because it will cause your plugin to be loaded whenever a matching plugin appears."
                    }
                ]
            },
            {
                "ep": "extensionpoint",
                "name": "extensionhandler",
                "register": "plugins#registerExtensionHandler",
                "unregister": "plugins#unregisterExtensionHandler",
                "description": "Used to attach listeners ",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "description": "name of the extension point to listen to",
                        "required": true
                    },
                    {
                        "name": "register",
                        "type": "pointer",
                        "description": "function that is called when a new extension is discovered. Note that this should be used sparingly, because it will cause your plugin to be loaded whenever a matching plugin appears."
                    },
                    {
                        "name": "unregister",
                        "type": "pointer",
                        "description": "function that is called when an extension is removed. Note that this should be used sparingly, because it will cause your plugin to be loaded whenever a matching plugin appears."
                    }
                ]
            },
            {
                "ep": "extensionpoint",
                "name": "factory",
                "description": "Provides a factory for singleton components. Each extension needs to provide a name, a pointer and an action. The action can be 'call' (if the pointer refers to a function), 'new' (if the pointer refers to a traditional JS object) or 'value' (if the pointer refers to the object itself that is the component).",
                "indexOn": "name"
            },
            {
                "ep": "factory",
                "name": "hub",
                "action": "create",
                "pointer": "util/hub#Hub"
            },
            {
                "ep": "extensionpoint",
                "name": "command",
                "description": "Editor commands/actions. TODO: list parameters here."
            }
        ]
    }
};

});

bespin.tiki.module("bespin:console",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var util = require("util/util");

/**
 * This object represents a "safe console" object that forwards debugging
 * messages appropriately without creating a dependency on Firebug in Firefox.
 */


var noop = function() {
};

var NAMES = [
    "assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd",
    "info", "log", "profile", "profileEnd", "time", "timeEnd", "trace", "warn"
];

if (typeof(window) === 'undefined') {
    var console = {};
    NAMES.forEach(function(name) {
        console[name] = function() {
            var args = Array.prototype.slice.call(arguments);
            var msg = { op: 'log', method: name, args: args };
            postMessage(JSON.stringify(msg));
        };
    });

    exports.console = console;
} else if (util.isSafari || util.isChrome) {
    exports.console = window.console;
} else {
    exports.console = { };

    NAMES.forEach(function(name) {
        if (window.console && window.console[name]) {
            exports.console[name] = window.console[name];
        } else {
            exports.console[name] = noop;
        }
    });
}


});

bespin.tiki.module("bespin:globals",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/*
* Installs ES5 and SproutCore monkeypatches as needed.
*/
var installGlobals = function() {
    /**
     * Array detector.
     * Firefox 3.5 and Safari 4 have this already. Chrome 4 however ...
     * Note to Dojo - your isArray is still broken: instanceof doesn't work with
     * Arrays taken from a different frame/window.
     */
    if (!Array.isArray) {
        Array.isArray = function(data) {
            return (data && Object.prototype.toString.call(data) == "[object Array]");
        };
    }

    /**
     * Retrieves the list of keys on an object.
     */
    if (!Object.keys) {
        Object.keys = function(obj) {
            var k, ret = [];
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    ret.push(k);
                }
            }
            return ret;
        };
    }

    if (!Function.prototype.bind) {
        Function.prototype.bind = function () {
            var args = Array.prototype.slice.call(arguments);
            var self = this;
            var bound = function () {
                return self.call.apply(
                    self,
                    args.concat(
                        Array.prototype.slice.call(arguments)
                    )
                );
            };
            bound.name = this.name;
            bound.displayName = this.displayName;
            bound.length = this.length;
            bound.unbound = self;
            return bound;
        };
    }
};


if (!Object.defineProperty) {
    Object.defineProperty = function(object, property, descriptor) {
        var has = Object.prototype.hasOwnProperty;
        if (typeof descriptor == "object" && object.__defineGetter__) {
            if (has.call(descriptor, "value")) {
                if (!object.__lookupGetter__(property) && !object.__lookupSetter__(property)) {
                    object[property] = descriptor.value;
                }
                if (has.call(descriptor, "get") || has.call(descriptor, "set")) {
                    throw new TypeError("Object doesn't support this action");
                }
            }
            /*
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
            else if (typeof descriptor.get == "function") {
                object.__defineGetter__(property, descriptor.get);
            }
            if (typeof descriptor.set == "function") {
                object.__defineSetter__(property, descriptor.set);
            }
        }
        return object;
    };
}

if (!Object.defineProperties) {
    Object.defineProperties = function(object, properties) {
        for (var property in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, property)) {
                Object.defineProperty(object, property, properties[property]);
            }
        }
        return object;
    };
}



installGlobals();

});

bespin.tiki.module("bespin:index",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/** The core version of the Bespin system */
exports.versionNumber = '0.9a1';

/** The version number to display to users */
exports.versionCodename = 'Edison';

/** The version number of the API (to ensure that the client and server are talking the same language) */
exports.apiVersion = '4';



});

bespin.tiki.module("bespin:plugins",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

require("globals");

var Promise = require("promise").Promise;
var group = require("promise").group;
var builtins = require("builtins");
var console = require("console").console;
var util = require("util/util");
var Trace = require("util/stacktrace").Trace;
var proxy = require('proxy');

var r = require;

var loader = require.loader;
var browser = loader.sources[0];

var USER_DEACTIVATED    = 'USER';
var DEPENDS_DEACTIVATED = 'DEPENDS';

/**
 * Split an extension pointer from module/path#objectName into an object of the
 * type { modName:"module/path", objName:"objectName" } using a pluginName
 * as the base to which roots the pointer
 */
var _splitPointer = function(pluginName, pointer) {
    if (!pointer) {
        return undefined;
    }

    var parts = pointer.split("#");
    var modName;

    if (parts[0]) {
        modName = pluginName + ":" + parts[0];
    } else {
        modName = pluginName;
    }

    return {
        modName: modName,
        objName: parts[1]
    };
};

var _retrieveObject = function(pointerObj) {
    var module = r(pointerObj.modName);
    if (pointerObj.objName) {
        return module[pointerObj.objName];
    }
    return module;
};

/**
 * An Extension represents some code that can be lazy-loaded when needed.
 * @constructor
 */
exports.Extension = function(metadata) {
    this.pluginName = null;

    for (property in metadata) {
        if (metadata.hasOwnProperty(property)) {
            this[property] = metadata[property];
        }
    }

    this._observers = [];
};

exports.Extension.prototype = {
    /**
     * Asynchronously load the actual code represented by this Extension
     * @param callback Function to call when the load has finished (deprecated)
     * @param property Extension property to load (default 'pointer')
     * @returns A promise to be fulfilled on completion. Preferred over using the
     * <tt>callback</tt> parameter.
     */
    load: function(callback, property, catalog) {
        catalog = catalog || exports.catalog;
        var promise = new Promise();

        var onComplete = function(func) {
            if (callback) {
                callback(func);
            }
            promise.resolve(func);
        };

        var pointerVal = this[property || 'pointer'];
        if (util.isFunction(pointerVal)) {
            onComplete(pointerVal);
            return promise;
        }

        var pointerObj = _splitPointer(this.pluginName, pointerVal);

        if (!pointerObj) {
            console.error('Extension cannot be loaded because it has no \'pointer\'');
            console.log(this);

            promise.reject(new Error('Extension has no \'pointer\' to call'));
            return promise;
        }

        var pluginName = this.pluginName;
        catalog.loadPlugin(pluginName).then(function() {
            require.ensure(pointerObj.modName, function() {
                var func = _retrieveObject(pointerObj);
                onComplete(func);

            });
        }, function(err) {
            console.error('Failed to load plugin ', pluginName, err);
        });

        return promise;
    },

    /**
     * Loads this extension and passes the result to the callback.
     * Any time this extension changes, the callback is called with the new value.
     * Note that if this extension goes away, the callback will be called with
     * undefined.
     * <p>observingPlugin is required, because if that plugin is torn down,
     * all of its observing callbacks need to be torn down as well.
     */
    observe: function(observingPlugin, callback, property) {
        this._observers.push({
            plugin: observingPlugin,
            callback: callback,
            property: property
        });
        this.load(callback, property);
    },

    /**
     * Returns the name of the plugin that provides this extension.
     */
    getPluginName: function() {
        return this.pluginName;
    },

    /**
     *
     */
    _getLoaded: function(property) {
        var pointerObj = this._getPointer(property);
        return _retrieveObject(pointerObj);
    }
};

/**
 * An ExtensionPoint is a get of Extensions grouped under the same name
 * for fast access.
 * @constructor
 */
exports.ExtensionPoint = function(name, catalog) {
    this.name = name;
    this.catalog = catalog;

    this.pluginName = undefined;
    this.indexOn = undefined;

    this.extensions = [];
    this.handlers = [];
};

/**
 * Implementation of ExtensionPoint
 */
exports.ExtensionPoint.prototype = {
    /**
    * Retrieves the list of plugins which provide extensions
    * for this extension point.
    */
    getImplementingPlugins: function() {
        var pluginSet = {};
        this.extensions.forEach(function(ext) {
            pluginSet[ext.pluginName] = true;
        });
        var matches = Object.keys(pluginSet);
        matches.sort();
        return matches;
    },

    /**
     * Get the name of the plugin that defines this extension point.
     */
    getDefiningPluginName: function() {
        return this.pluginName;
    },

    /**
     * If we are keeping an index (an indexOn property is set on the
     * extension point), you can look up an extension by key.
     */
    getByKey: function(key) {
        var indexOn = this.indexOn;

        if (!indexOn) {
            return undefined;
        }

        for (var i = 0; i < this.extensions.length; i++) {
            if (this.extensions[i][indexOn] == key) {
                return this.extensions[i];
            }
        }
        return undefined;
    },

    register: function(extension) {
        var catalog = this.catalog;
        this.extensions.push(extension);
        this.handlers.forEach(function(handler) {
            if (handler.register) {
                handler.load(function(register) {
                    if (!register) {
                        console.error('missing register function for pluginName=', extension.pluginName, ", extension=", extension.name);
                    } else {
                         register(extension, catalog);
                    }
                }, "register", catalog);
            }
        });
    },

    unregister: function(extension) {
        var catalog = this.catalog;
        this.extensions.splice(this.extensions.indexOf(extension), 1);
        this.handlers.forEach(function(handler) {
            if (handler.unregister) {
                handler.load(function(unregister) {
                    if (!unregister) {
                        console.error('missing unregister function for pluginName=', extension.pluginName, ", extension=", extension.name);
                    } else {
                         unregister(extension, catalog);
                    }
                }, "unregister", catalog);
            }
        });
    },

    /**
     * Order the extensions by a plugin order.
     */
    orderExtensions: function(pluginOrder) {
        var orderedExt = [];

        for (var i = 0; i < pluginOrder.length; i++) {
            var n = 0;
            while (n != this.extensions.length) {
                if (this.extensions[n].pluginName === pluginOrder[i]) {
                    orderedExt.push(this.extensions[n]);
                    this.extensions.splice(n, 1);
                } else {
                    n ++;
                }
            }
        }

        this.extensions = orderedExt.concat(this.extensions);
    }
};

/**
 * A Plugin is a set of Extensions that are loaded as a unit
 * @constructor
 */
exports.Plugin = function(metadata) {
    this.catalog = null;
    this.name = null;
    this.provides = [];
    this.stylesheets = [];
    this.reloadURL = null;
    this.reloadPointer = null;

    for (property in metadata) {
        if (metadata.hasOwnProperty(property)) {
            this[property] = metadata[property];
        }
    }
};

/**
 * Implementation of Plugin
 */
exports.Plugin.prototype = {
    register: function() {
        this.provides.forEach(function(extension) {
            var ep = this.catalog.getExtensionPoint(extension.ep, true);
            ep.register(extension);
        }, this);
    },

    unregister: function() {
        this.provides.forEach(function(extension) {
            var ep = this.catalog.getExtensionPoint(extension.ep, true);
            ep.unregister(extension);
        }, this);
    },

    _getObservers: function() {
        var result = {};
        this.provides.forEach(function(extension) {
            console.log('ep: ', extension.ep);
            console.log(extension._observers);
            result[extension.ep] = extension._observers;
        });
        return result;
    },

    /**
     * Figure out which plugins depend on a given plugin. This
     * will allow the reload behavior to unregister/reregister
     * all of the plugins that depend on the one being reloaded.
     * If firstLevelOnly is true, only direct dependent plugins are listed.
     */
    _findDependents: function(pluginList, dependents, firstLevelOnly) {
        var pluginName = this.name;
        var self = this;
        pluginList.forEach(function(testPluginName) {
            if (testPluginName == pluginName) {
                return;
            }
            var plugin = self.catalog.plugins[testPluginName];
            if (plugin && plugin.dependencies) {
                for (dependName in plugin.dependencies) {
                    if (dependName == pluginName && !dependents[testPluginName]) {
                        dependents[testPluginName] = {
                            keepModule: false
                        };
                        if (!firstLevelOnly) {
                            plugin._findDependents(pluginList, dependents);
                        }
                    }
                }
            }
        });
    },

    /**
     * Removes the plugin from Tiki's registries.
     * As with the new multiple Bespins, this only clears the current sandbox.
     */
    _cleanup: function(leaveLoader) {
        this.stylesheets.forEach(function(stylesheet) {
            var links = document.getElementsByTagName('link');
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.indexOf(stylesheet.url) != -1) {
                    links[i].parentNode.removeChild(links[i]);
                    break;
                }
            }
        });

        var pluginName = this.name;

        var nameMatch = new RegExp("^" + pluginName + '$');
        var moduleMatch = new RegExp('^::' + pluginName + ':');
        var packageMatch = new RegExp("^::" + pluginName + '$');

        var sandbox = require.sandbox;
        var loader = require.loader;
        var source = browser;

        if (!leaveLoader) {
            _removeFromObject(moduleMatch, loader.factories);
            _removeFromObject(packageMatch, loader.canonicalIds);
            _removeFromObject(packageMatch, loader.canonicalPackageIds);
            _removeFromObject(packageMatch, loader.packageSources);
            _removeFromObject(packageMatch, loader.packages);

            _removeFromObject(nameMatch, source.packageInfoByName);
            _removeFromObject(moduleMatch, source.factories);
            _removeFromObject(moduleMatch, source.scriptActions);
            _removeFromObject(moduleMatch, source.stylesheetActions);
            _removeFromObject(packageMatch, source.packages);
            _removeFromObject(packageMatch, source.ensureActions);
            _removeFromObject(packageMatch, source.packageInfoById);
        }

        _removeFromObject(moduleMatch, sandbox.exports);
        _removeFromObject(moduleMatch, sandbox.modules);
        _removeFromObject(moduleMatch, sandbox.usedExports);
    },

    /**
     * reloads the plugin and reinitializes all
     * dependent plugins
     */
    reload: function(callback) {

        if (!this.reloadURL) {
            return;
        }

        if (this.reloadPointer) {
            var pointer = _splitPointer(this.name, this.reloadPointer);
            func = _retrieveObject(pointer);
            if (func) {
                func();
            } else {
                console.error("Reload function could not be loaded. Aborting reload.");
                return;
            }
        }

        var dependents = {};

        var pluginList = Object.keys(this.catalog.plugins);

        this._findDependents(pluginList, dependents);

        var reloadDescription = {
            pluginName: this.name,
            dependents: dependents
        };

        for (var dependName in dependents) {
            var plugin = this.catalog.plugins[dependName];
            if (plugin.preRefresh) {
                var parts = _splitPointer(dependName, plugin.preRefresh);
                func = _retrieveObject(parts);
                if (func) {
                    dependents[dependName] = func(reloadDescription);
                }
            }
        }

        this.unregister();

        for (dependName in dependents) {
            this.catalog.plugins[dependName].unregister();
        }

        this._cleanup(this.name);

        var fullModList = [];
        var sandbox = require.sandbox;

        var modulesKey = Object.keys(sandbox.modules);
        var i = modulesKey.length;
        var dependRegexes = [];
        for (dependName in dependents) {
            if (!dependents[dependName].keepModule) {
                dependRegexes.push(new RegExp("^::" + dependName + ":"));
            }
        }

        var nameMatch = new RegExp("^::" + this.name + ":");

        while (--i >= 0) {
            var item = modulesKey[i];
            if (nameMatch.exec(item)) {
                fullModList.push(item);
            } else {
                var j = dependRegexes.length;
                while (--j >= 0) {
                    if (dependRegexes[j].exec(item)) {
                        fullModList.push(item);
                        break;
                    }
                }
            }
        }

        fullModList.forEach(function(item) {
            delete sandbox.exports[item];
            delete sandbox.modules[item];
            delete sandbox.usedExports[item];
        });

        var onLoad = function() {
            this.catalog.loadPlugin(this.name).then(function() {
                for (dependName in dependents) {
                    this.catalog.plugins[dependName].register();
                }

                for (dependName in dependents) {
                    if (dependents[dependName].callPointer) {
                        var parts = _splitPointer(dependName,
                            dependents[dependName].callPointer);
                        var func = _retrieveObject(parts);
                        if (func) {
                            func(reloadDescription);
                        }
                    }
                }

                if (callback) {
                    callback();
                }
            }.bind(this));
        }.bind(this);

        var onError = function() {
            console.error('Failed to load metadata from ' + this.reloadURL);
        }.bind(this);

        this.catalog.loadMetadataFromURL(this.reloadURL).then(onLoad, onError);
    }
};

var _setPath = function(root, path, value) {
    var segments = path.split('.');
    var current = root;
    var top = segments.length - 1;
    if (top > 0) {
        for (var i = 0; i < top; i++) {
            current = current[segments[i]];
        }
    }
    current[top] = value;
};

exports.Catalog = function() {
    this.points = {};
    this.plugins = {};
    this.metadata = {};

    this.USER_DEACTIVATED = USER_DEACTIVATED;
    this.DEPENDS_DEACTIVATED = DEPENDS_DEACTIVATED;

    this.deactivatedPlugins = {};
    this._extensionsOrdering = [];
    this.instances = {};
    this.instancesLoadPromises = {};
    this._objectDescriptors = {};

    this.children = [];

    var ep = this.getExtensionPoint("extensionpoint", true);
    ep.indexOn = "name";
    this.registerMetadata(builtins.metadata);
};

exports.Catalog.prototype = {

    /**
     * Returns true if the extension is shared.
     */
    shareExtension: function(ext) {
        return this.plugins[ext.pluginName].share;
    },

    /**
     * Returns true, if the plugin is loaded (checks if there is a module in the
     * current sandbox).
     */
    isPluginLoaded: function(pluginName) {
        var usedExports = Object.keys(require.sandbox.usedExports);

        return usedExports.some(function(item) {
            return item.indexOf('::' + pluginName + ':') == 0;
        });
    },

    /**
     * Registers information about an instance that will be tracked
     * by the catalog. The first parameter is the name used for looking up
     * the object. The descriptor should contain:
     * - factory (optional): name of the factory extension used to create the
     *                       object. defaults to the same value as the name
     *                       property.
     * - arguments (optional): array that is passed in if the factory is a
     *                      function.
     * - objects (optional): object that describes other objects that are
     *                      required when constructing this one (see below)
     *
     * The objects object defines objects that must be created before this
     * one and how they should be passed in. The key defines how they
     * are passed in, and the value is the name of the object to pass in.
     * You define how they are passed in relative to the arguments
     * array, using a very simple interface of dot separated keys.
     * For example, if you have an arguments array of [null, {foo: null}, "bar"]
     * you can have an object array like this:
     * {
     *  "0": "myCoolObject",
     *  "1.foo": "someOtherObject"
     * }
     *
     * which will result in arguments like this:
     * [myCoolObject, {foo: someOtherObject}, "bar"]
     * where myCoolObject and someOtherObject are the actual objects
     * created elsewhere.
     *
     * If the plugin containing the factory is reloaded, the object will
     * be recreated. The object will also be recreated if objects passed in
     * are reloaded.
     *
     * This method returns nothing and does not actually create the objects.
     * The objects are created via the createObject method and retrieved
     * via the getObject method.
     */
    registerObject: function(name, descriptor) {
        this._objectDescriptors[name] = descriptor;
    },

    /**
     * Stores an object directly in the instance cache. This should
     * not generally be used because reloading cannot work with
     * these objects.
     */
    _setObject: function(name, obj) {
        this.instances[name] = obj;
    },

    /**
     * Creates an object with a previously registered descriptor.
     *
     * Returns a promise that will be resolved (with the created object)
     * once the object has been made. The promise will be resolved
     * immediately if the instance is already there.
     *
     * throws an exception if the object is not registered or if
     * the factory cannot be found.
     */
    createObject: function(name) {

        if (this.instancesLoadPromises[name] !== undefined) {
            return this.instancesLoadPromises[name];
        }

        var descriptor = this._objectDescriptors[name];
        if (descriptor === undefined) {
            throw new Error('Tried to create object "' + name +
                '" but that object is not registered.');
        }

        var factoryName = descriptor.factory || name;
        var ext = this.getExtensionByKey("factory", factoryName);
        if (ext === undefined) {
            throw new Error('When creating object "' + name +
                '", there is no factory called "' + factoryName +
                '" available."');
        }

        if (this.parent && this.shareExtension(ext)) {
            return this.instancesLoadPromises[name] = this.parent.createObject(name);
        }

        var pr = this.instancesLoadPromises[name] = new Promise();

        var factoryArguments = descriptor.arguments || [];
        var argumentPromises = [];
        if (descriptor.objects) {
            var objects = descriptor.objects;
            for (var key in objects) {
                var objectName = objects[key];
                var ropr = this.createObject(objectName);
                argumentPromises.push(ropr);
                ropr.location = key;
                ropr.then(function(obj) {
                    _setPath(factoryArguments, ropr.location, obj);
                });
            }
        }

        group(argumentPromises).then(function() {
            ext.load().then(function(factory) {
                var action = ext.action;
                var obj;

                if (action === "call") {
                    obj = factory.apply(factory, factoryArguments);
                } else if (action === "new") {
                    if (factoryArguments.length > 1) {
                        pr.reject(new Error('For object ' + name + ', create a simple factory function and change the action to call because JS cannot handle this case.'));
                        return;
                    }
                    obj = new factory(factoryArguments[0]);
                } else if (action === "value") {
                    obj = factory;
                } else {
                    pr.reject(new Error("Create action must be call|new|value. " +
                            "Found" + action));
                    return;
                }

                this.instances[name] = obj;
                pr.resolve(obj);
            }.bind(this));
        }.bind(this));

        return pr;
    },

    /**
     * Retrieve a registered object. Returns undefined
     * if the instance has not been created.
     */
    getObject: function(name) {
        return this.instances[name] || (this.parent ? this.parent.getObject(name) : undefined);
    },

    /** Retrieve an extension point object by name, optionally creating it if it
    * does not exist.
    */
    getExtensionPoint: function(name, create) {
        if (create && this.points[name] === undefined) {
            this.points[name] = new exports.ExtensionPoint(name, this);
        }
        return this.points[name];
    },

    /**
     * Retrieve the list of extensions for the named extension point.
     * If none are defined, this will return an empty array.
     */
    getExtensions: function(name) {
        var ep = this.getExtensionPoint(name);
        if (ep === undefined) {
            return [];
        }
        return ep.extensions;
    },

    /**
     * Sets the order of the plugin's extensions. Note that this orders *only*
     * Extensions and nothing else (load order of CSS files e.g.)
     */
    orderExtensions: function(pluginOrder) {
        pluginOrder = pluginOrder || this._extensionsOrdering;

        for (name in this.points) {
            this.points[name].orderExtensions(pluginOrder);
        }
        this._extensionsOrdering = pluginOrder;
    },

    /**
     * Returns the current plugin exentions ordering.
     */
    getExtensionsOrdering: function() {
        return this._extensionsOrdering;
    },

    /**
     * Look up an extension in an indexed extension point by the given key. If
     * the extension point or the key are unknown, undefined will be returned.
     */
    getExtensionByKey: function(name, key) {
        var ep = this.getExtensionPoint(name);
        if (ep === undefined) {
            return undefined;
        }

        return ep.getByKey(key);
    },

    _toposort: function(metadata) {
        var sorted = [];
        var visited = {};
        var visit = function(key) {
            if (key in visited || !(key in metadata)) {
                return;
            }

            visited[key] = true;
            var depends = metadata[key].dependencies;
            if (!util.none(depends)) {
                for (var dependName in depends) {
                    visit(dependName);
                }
            }

            sorted.push(key);
        };

        for (var key in metadata) {
            visit(key);
        }

        return sorted;
    },

    /**
     * Register new metadata. If the current catalog is not the master catalog,
     * then the master catalog registerMetadata function is called. The master
     * catalog then makes some basic operations on the metadata and calls the
     * _registerMetadata function on all the child catalogs and for itself as
     * well.
     */
    registerMetadata: function(metadata) {
        if (this.parent) {
            this.parent.registerMetadata(metadata);
        } else {
            for (var pluginName in metadata) {
                var md = metadata[pluginName];
                if (md.errors) {
                    console.error("Plugin ", pluginName, " has errors:");
                    md.errors.forEach(function(error) {
                        console.error(error);
                    });
                    delete metadata[pluginName];
                    continue;
                }

                if (md.dependencies) {
                    md.depends = Object.keys(md.dependencies);
                }

                md.name = pluginName;
                md.version = null;

                var packageId = browser.canonicalPackageId(pluginName);
                if (packageId === null) {
                    browser.register('::' + pluginName, md);
                    continue;
                }
            }

            util.mixin(this.metadata, util.clone(metadata, true));

            this.children.forEach(function(child) {
                child._registerMetadata(util.clone(metadata, true));
            });
            this._registerMetadata(util.clone(metadata, true));
        }
    },

    /**
     * Registers plugin metadata. See comments inside of the function.
     */
    _registerMetadata: function(metadata) {
        var pluginName, plugin;
        var plugins = this.plugins;

        this._toposort(metadata).forEach(function(name) {
            if (this.plugins[name]) {
                if (this.isPluginLoaded(name)) {
                    return;
                } else {
                    var plugin = this.plugins[name];
                    plugin.unregister();
                }
            }

            var md = metadata[name];
            var activated = !(this.deactivatedPlugins[name]);

            if (activated && md.depends && md.depends.length != 0) {
                var works = md.depends.some(function(name) {
                    return !(this.deactivatedPlugins[name]);
                }, this);
                if (!works) {
                    this.deactivatedPlugins[name] = DEPENDS_DEACTIVATED;
                    activated = false;
                }
            }

            md.catalog = this;
            md.name = name;
            plugin = new exports.Plugin(md);
            plugins[name] = plugin;

            if (md.provides) {
                var provides = md.provides;
                for (var i = 0; i < provides.length; i++) {
                    var extension = new exports.Extension(provides[i]);
                    extension.pluginName = name;
                    provides[i] = extension;

                    var epname = extension.ep;
                    if (epname == "extensionpoint" && extension.name == 'extensionpoint') {
                        exports.registerExtensionPoint(extension, this, false);
                    } else {
                        if (activated) {
                            var ep = this.getExtensionPoint(extension.ep, true);
                            ep.register(extension);

                        } else if (epname == "extensionpoint") {
                            exports.registerExtensionPoint(extension, this, true);
                        }
                    }
                }
            } else {
                md.provides = [];
            }
        }, this);

        for (pluginName in metadata) {
            this._checkLoops(pluginName, plugins, []);
        }

        this.orderExtensions();
    },

    /**
     * Loads the named plugin, returning a promise called
     * when the plugin is loaded. This function is a convenience
     * for unusual situations and debugging only. Generally,
     * you should load plugins by calling load() on an Extension
     * object.
     */
    loadPlugin: function(pluginName) {
        var pr = new Promise();
        var plugin = this.plugins[pluginName];
        if (plugin.objects) {
            var objectPromises = [];
            plugin.objects.forEach(function(objectName) {
                objectPromises.push(this.createObject(objectName));
            }.bind(this));
            group(objectPromises).then(function() {
                require.ensurePackage(pluginName, function() {
                    pr.resolve();
                });
            });
        } else {
            require.ensurePackage(pluginName, function(err) {
                if (err) {
                    pr.reject(err);
                } else {
                    pr.resolve();
                }
            });
        }
        return pr;
    },

    /**
     * Retrieve metadata from the server. Returns a promise that is
     * resolved when the metadata has been loaded.
     */
    loadMetadataFromURL: function(url, type) {
        var pr = new Promise();
        proxy.xhr('GET', url, true).then(function(response) {
            this.registerMetadata(JSON.parse(response));
            pr.resolve();
        }.bind(this), function(err) {
            pr.reject(err);
        });

        return pr;
    },

    /**
     * Dactivates a plugin. If no plugin was deactivated, then a string is
     * returned which contains the reason why deactivating was not possible.
     * Otherwise the plugin is deactivated as well as all plugins that depend on
     * this plugin and a array is returned holding all depending plugins that were
     * deactivated.
     *
     * @param pluginName string Name of the plugin to deactivate
     * @param recursion boolean True if the funciton is called recursive.
     */
    deactivatePlugin: function(pluginName, recursion) {
        var plugin = this.plugins[pluginName];
        if (!plugin) {
            if (!recursion) {
                this.deactivatedPlugins[pluginName] = USER_DEACTIVATED;
            }
            return 'There is no plugin named "' + pluginName + '" in this catalog.';
        }

        if (this.deactivatedPlugins[pluginName]) {
            if (!recursion) {
                this.deactivatedPlugins[pluginName] = USER_DEACTIVATED;
            }
            return 'The plugin "' + pluginName + '" is already deactivated';
        }

        this.deactivatedPlugins[pluginName] = (recursion ? DEPENDS_DEACTIVATED
                                                          : USER_DEACTIVATED);

        var dependents = {};
        var deactivated = [];
        plugin._findDependents(Object.keys(this.plugins), dependents, true);

        Object.keys(dependents).forEach(function(plugin) {
            var ret = this.deactivatePlugin(plugin, true);
            if (Array.isArray(ret)) {
                deactivated = deactivated.concat(ret);
            }
        }, this);

        plugin.unregister();

        if (recursion) {
            deactivated.push(pluginName);
        }

        return deactivated;
    },

    /**
     * Activates a plugin. If the plugin can't be activated a string is returned
     * explaining why. Otherwise the plugin is activated, all plugins that depend
     * on this plugin are tried to activated and an array with all the activated
     * depending plugins is returned.
     * Note: Depending plugins are not activated if they user called
     * deactivatePlugin on them to deactivate them explicit.
     *
     * @param pluginName string Name of the plugin to activate.
     * @param recursion boolean True if the funciton is called recursive.
     */
    activatePlugin: function(pluginName, recursion) {
        var plugin = this.plugins[pluginName];
        if (!plugin) {
            return 'There is no plugin named "' + pluginName + '" in this catalog.';
        }

        if (!this.deactivatedPlugins[pluginName]) {
            return 'The plugin "' + pluginName + '" is already activated';
        }

        if (recursion && this.deactivatedPlugins[pluginName] === USER_DEACTIVATED) {
            return;
        }

        if (plugin.depends && plugin.depends.length != 0) {
            var works = plugin.depends.some(function(plugin) {
                return !this.deactivatedPlugins[plugin];
            }, this);

            if (!works) {
                this.deactivatedPlugins[pluginName] = DEPENDS_DEACTIVATED;
                return 'Can not activate plugin "' + pluginName +
                        '" as some of its dependent plugins are not activated';
            }
        }

        plugin.register();
        this.orderExtensions();
        delete this.deactivatedPlugins[pluginName];

        var activated = [];
        var dependents = {};
        plugin._findDependents(Object.keys(this.plugins), dependents, true);
        Object.keys(dependents).forEach(function(pluginName) {
            var ret = this.activatePlugin(pluginName, true);
            if (Array.isArray(ret)) {
                activated = activated.concat(ret);
            }
        }, this);

        if (recursion) {
            activated.push(pluginName);
        }

        return activated;
    },

    /**
     * Removes a plugin, unregistering it and cleaning up.
     */
    removePlugin: function(pluginName) {
        var plugin = this.plugins[pluginName];
        if (plugin == undefined) {
            throw new Error("Attempted to remove plugin " + pluginName
                                            + " which does not exist.");
        }

        plugin.unregister();
        plugin._cleanup(true /* leaveLoader */);
        delete this.metadata[pluginName];
        delete this.plugins[pluginName];
    },

    /**
     * for the given plugin, get the first part of the URL required to
     * get at that plugin's resources (images, etc.).
     */
    getResourceURL: function(pluginName) {
        var link = document.getElementById("bespin_base");
        var base = "";
        if (link) {
            base += link.href;
            if (!util.endsWith(base, "/")) {
                base += "/";
            }
        }
        var plugin = this.plugins[pluginName];
        if (plugin == undefined) {
            return undefined;
        }
        return base + plugin.resourceURL;
    },

    /**
     * Check the dependency graph to ensure we don't have cycles.
     */
    _checkLoops: function(pluginName, data, trail) {
        var circular = false;
        trail.forEach(function(node) {
            if (pluginName === node) {
                console.error("Circular dependency", pluginName, trail);
                circular = true;
            }
        });
        if (circular) {
            return true;
        }
        trail.push(pluginName);
        if (!data[pluginName]) {
            console.error("Missing metadata for ", pluginName);
        } else {
            if (data[pluginName].dependencies) {
                for (var dependency in data[pluginName].dependencies) {
                    var trailClone = trail.slice();
                    var errors = this._checkLoops(dependency, data, trailClone);
                    if (errors) {
                        console.error("Errors found when looking at ", pluginName);
                        return true;
                    }
                }
            }
        }
        return false;
    },

    /**
     * Retrieve an array of the plugin objects.
     * The opts object can include the following options:
     * onlyType (string): only include plugins of this type
     * sortBy (array): list of keys to sort by (the primary sort is first).
     *                 default is sorted alphabetically by name.
     */
    getPlugins: function(opts) {
        var result = [];
        var onlyType = opts.onlyType;

        for (var key in this.plugins) {
            var plugin = this.plugins[key];

            if ((onlyType && plugin.type && plugin.type != onlyType)
                || plugin.name == "bespin") {
                continue;
            }

            result.push(plugin);
        }

        var sortBy = opts.sortBy;
        if (!sortBy) {
            sortBy = ["name"];
        }

        var sortfunc = function(a, b) {
            for (var i = 0; i < sortBy.length; i++) {
                key = sortBy[i];
                if (a[key] < b[key]) {
                    return -1;
                } else if (b[key] < a[key]) {
                    return 1;
                }
            }
            return 0;
        };

        result.sort(sortfunc);
        return result;
    },

    /**
     * Returns a promise to retrieve the object at the given property path,
     * loading the plugin if necessary.
     */
    loadObjectForPropertyPath: function(path, context) {
        var promise = new Promise();
        var parts = /^([^:]+):([^#]+)#(.*)$/.exec(path);
        if (parts === null) {
            throw new Error("loadObjectForPropertyPath: malformed path: '" +
                path + "'");
        }

        var pluginName = parts[1];
        if (pluginName === "") {
            if (util.none(context)) {
                throw new Error("loadObjectForPropertyPath: no plugin name " +
                    "supplied and no context is present");
            }

            pluginName = context;
        }

        require.ensurePackage(pluginName, function() {
            promise.resolve(this.objectForPropertyPath(path));
        }.bind(this));

        return promise;
    },

    /**
     * Finds the object for the passed path or array of path components.  This is
     * the standard method used in SproutCore to traverse object paths.
     * @param path {String} the path
     * @param root {Object} optional root object.  window is used otherwise
     * @param stopAt {Integer} optional point to stop searching the path.
     * @returns {Object} the found object or undefined.
     */
    objectForPropertyPath: function(path, root, stopAt) {
        stopAt = (stopAt == undefined) ? path.length : stopAt;
        if (!root) {
            root = window;
        }

        var hashed = path.split("#");
        if (hashed.length !== 1) {
            var module = require(hashed[0]);
            if (module === undefined) {
                return undefined;
            }

            path = hashed[1];
            root = module;
            stopAt = stopAt - hashed[0].length;
        }

        var loc = 0;
        while (root && loc < stopAt) {
            var nextDotAt = path.indexOf('.', loc);
            if (nextDotAt < 0 || nextDotAt > stopAt) {
                nextDotAt = stopAt;
            }
            var key = path.slice(loc, nextDotAt);
            root = root[key];
            loc = nextDotAt + 1;
        }

        if (loc < stopAt) {
            root = undefined; // hit a dead end. :(
        }

        return root;
    },

    /**
     * Publish <tt>value</tt> to all plugins that match both <tt>ep</tt> and
     * <tt>key</tt>.
     * @param source {object} The source calling the publish function.
     * @param epName {string} An extension point (indexed by the catalog) to which
     * we publish the information.
     * @param key {string} A key to which we publish (linearly searched, allowing
     * for regex matching).
     * @param value {object} The data to be passed to the subscribing function.
     */
    publish: function(source, epName, key, value) {
        var ep = this.getExtensionPoint(epName);

        if (this.shareExtension(ep)) {
            if (this.parent) {
                this.parent.publish(source, epName, key, value);
            } else {
                this.children.forEach(function(child) {
                    child._publish(source, epName, key, value);
                });
                this._publish(source, epName, key, value);
            }
        } else {
            this._publish(source, epName, key, value);
        }
    },

    _publish: function(source, epName, key, value) {
        var subscriptions = this.getExtensions(epName);
        subscriptions.forEach(function(sub) {
            if (sub.match && !sub.regexp) {
                sub.regexp = new RegExp(sub.match);
            }
            if (sub.regexp && sub.regexp.test(key)
                    || sub.key === key
                    || (util.none(sub.key) && util.none(key))) {
                sub.load().then(function(handler) {
                    handler(source, key, value);
                });
            }
        });
    },

    /**
     * The subscribe side of #publish for use when the object which will
     * publishes is created dynamically.
     * @param ep The extension point name to subscribe to
     * @param metadata An object containing:
     * <ul>
     * <li>pointer: A function which should be called on matching publish().
     * This can also be specified as a pointer string, however if you can do
     * that, you should be placing the metadata in package.json.
     * <li>key: A string that exactly matches the key passed to the publish()
     * function. For smarter matching, you can use 'match' instead...
     * <li>match: A regexp to be used in place of key
     * </ul>
     */
    registerExtension: function(ep, metadata) {
        var extension = new exports.Extension(metadata);
        extension.pluginName = '__dynamic';
        this.getExtensionPoint(ep).register(extension);
    }
};

/**
 * Register handler for extension points.
 * The argument `deactivated` is set to true or false when this method is called
 * by the _registerMetadata function.
 */
exports.registerExtensionPoint = function(extension, catalog, deactivated) {
    var ep = catalog.getExtensionPoint(extension.name, true);
    ep.description = extension.description;
    ep.pluginName = extension.pluginName;
    ep.params = extension.params;
    if (extension.indexOn) {
        ep.indexOn = extension.indexOn;
    }

    if (!deactivated && (extension.register || extension.unregister)) {
        exports.registerExtensionHandler(extension, catalog);
    }
};

/**
 * Register handler for extension handler.
 */
exports.registerExtensionHandler = function(extension, catalog) {
    if (catalog.parent && catalog.shareExtension(extension)) {
        return;
    }

    var ep = catalog.getExtensionPoint(extension.name, true);
    ep.handlers.push(extension);
    if (extension.register) {
        var extensions = util.clone(ep.extensions);

        extension.load(function(register) {
            if (!register) {
                throw extension.name + " is not ready";
            }
            extensions.forEach(function(ext) {
                register(ext, catalog);
            });
        }, "register", catalog);
    }
};

/**
 * Unregister handler for extension point.
 */
exports.unregisterExtensionPoint = function(extension, catalog) {
    if (extension.register || extension.unregister) {
        exports.unregisterExtensionHandler(extension);
    }
};

/**
 * Unregister handler for extension handler.
 */
exports.unregisterExtensionHandler = function(extension, catalog) {
    if (catalog.parent && catalog.shareExtension(extension)) {
        return;
    }

    var ep = catalog.getExtensionPoint(extension.name, true);
    if (ep.handlers.indexOf(extension) == -1) {
        return;
    }
    ep.handlers.splice(ep.handlers.indexOf(extension), 1);
    if (extension.unregister) {
        var extensions = util.clone(ep.extensions);

        extension.load(function(unregister) {
            if (!unregister) {
                throw extension.name + " is not ready";
            }
            extensions.forEach(function(ext) {
                unregister(ext);
            });
        }, "unregister");
    }
};

exports.catalog = new exports.Catalog();

var _removeFromList = function(regex, array, matchFunc) {
    var i = 0;
    while (i < array.length) {
        if (regex.exec(array[i])) {
            var item = array.splice(i, 1);
            if (matchFunc) {
                matchFunc(item);
            }
            continue;
        }
        i++;
    }
};

var _removeFromObject = function(regex, obj) {
    var keys = Object.keys(obj);
    var i = keys.length;
    while (--i > 0) {
        if (regex.exec(keys[i])) {
            delete obj[keys[i]];
        }
    }
};

exports.getUserPlugins = function() {
    return exports.catalog.getPlugins({ onlyType: 'user' });
};

});

bespin.tiki.module("bespin:promise",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var console = require('bespin:console').console;
var Trace = require('bespin:util/stacktrace').Trace;

/**
 * A promise can be in one of 2 states.
 * The ERROR and SUCCESS states are terminal, the PENDING state is the only
 * start state.
 */
var ERROR = -1;
var PENDING = 0;
var SUCCESS = 1;

/**
 * We give promises and ID so we can track which are outstanding
 */
var _nextId = 0;

/**
 * Debugging help if 2 things try to complete the same promise.
 * This can be slow (especially on chrome due to the stack trace unwinding) so
 * we should leave this turned off in normal use.
 */
var _traceCompletion = false;

/**
 * Outstanding promises. Handy list for debugging only.
 */
exports._outstanding = [];

/**
 * Recently resolved promises. Also for debugging only.
 */
exports._recent = [];

/**
 * Create an unfulfilled promise
 */
exports.Promise = function () {
    this._status = PENDING;
    this._value = undefined;
    this._onSuccessHandlers = [];
    this._onErrorHandlers = [];

    this._id = _nextId++;
    exports._outstanding[this._id] = this;
};

/**
 * Yeay for RTTI.
 */
exports.Promise.prototype.isPromise = true;

/**
 * Have we either been resolve()ed or reject()ed?
 */
exports.Promise.prototype.isComplete = function() {
    return this._status != PENDING;
};

/**
 * Have we resolve()ed?
 */
exports.Promise.prototype.isResolved = function() {
    return this._status == SUCCESS;
};

/**
 * Have we reject()ed?
 */
exports.Promise.prototype.isRejected = function() {
    return this._status == ERROR;
};

/**
 * Take the specified action of fulfillment of a promise, and (optionally)
 * a different action on promise rejection.
 */
exports.Promise.prototype.then = function(onSuccess, onError) {
    if (typeof onSuccess === 'function') {
        if (this._status === SUCCESS) {
            onSuccess.call(null, this._value);
        } else if (this._status === PENDING) {
            this._onSuccessHandlers.push(onSuccess);
        }
    }

    if (typeof onError === 'function') {
        if (this._status === ERROR) {
            onError.call(null, this._value);
        } else if (this._status === PENDING) {
            this._onErrorHandlers.push(onError);
        }
    }

    return this;
};

/**
 * Like then() except that rather than returning <tt>this</tt> we return
 * a promise which
 */
exports.Promise.prototype.chainPromise = function(onSuccess) {
    var chain = new exports.Promise();
    chain._chainedFrom = this;
    this.then(function(data) {
        try {
            chain.resolve(onSuccess(data));
        } catch (ex) {
            chain.reject(ex);
        }
    }, function(ex) {
        chain.reject(ex);
    });
    return chain;
};

/**
 * Supply the fulfillment of a promise
 */
exports.Promise.prototype.resolve = function(data) {
    return this._complete(this._onSuccessHandlers, SUCCESS, data, 'resolve');
};

/**
 * Renege on a promise
 */
exports.Promise.prototype.reject = function(data) {
    return this._complete(this._onErrorHandlers, ERROR, data, 'reject');
};

/**
 * Internal method to be called on resolve() or reject().
 * @private
 */
exports.Promise.prototype._complete = function(list, status, data, name) {
    if (this._status != PENDING) {
        console.group('Promise already closed');
        console.error('Attempted ' + name + '() with ', data);
        console.error('Previous status = ', this._status,
                ', previous value = ', this._value);
        console.trace();

        if (this._completeTrace) {
            console.error('Trace of previous completion:');
            this._completeTrace.log(5);
        }
        console.groupEnd();
        return this;
    }

    if (_traceCompletion) {
        this._completeTrace = new Trace(new Error());
    }

    this._status = status;
    this._value = data;

    list.forEach(function(handler) {
        handler.call(null, this._value);
    }, this);
    this._onSuccessHandlers.length = 0;
    this._onErrorHandlers.length = 0;

    delete exports._outstanding[this._id];
    exports._recent.push(this);
    while (exports._recent.length > 20) {
        exports._recent.shift();
    }

    return this;
};


/**
 * Takes an array of promises and returns a promise that that is fulfilled once
 * all the promises in the array are fulfilled
 * @param group The array of promises
 * @return the promise that is fulfilled when all the array is fulfilled
 */
exports.group = function(promiseList) {
    if (!(promiseList instanceof Array)) {
        promiseList = Array.prototype.slice.call(arguments);
    }

    if (promiseList.length === 0) {
        return new exports.Promise().resolve([]);
    }

    var groupPromise = new exports.Promise();
    var results = [];
    var fulfilled = 0;

    var onSuccessFactory = function(index) {
        return function(data) {
            results[index] = data;
            fulfilled++;
            if (groupPromise._status !== ERROR) {
                if (fulfilled === promiseList.length) {
                    groupPromise.resolve(results);
                }
            }
        };
    };

    promiseList.forEach(function(promise, index) {
        var onSuccess = onSuccessFactory(index);
        var onError = groupPromise.reject.bind(groupPromise);
        promise.then(onSuccess, onError);
    });

    return groupPromise;
};

});

bespin.tiki.module("bespin:proxy",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var util = require("util/util");
var Promise = require("promise").Promise;

exports.xhr = function(method, url, async, beforeSendCallback) {
    var pr = new Promise();

    if (!bespin.proxy || !bespin.proxy.xhr) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState !== 4) {
                return;
            }

            var status = req.status;
            if (status !== 0 && status !== 200) {
                var error = new Error(req.responseText + ' (Status ' + req.status + ")");
                error.xhr = req;
                pr.reject(error);
                return;
            }

            pr.resolve(req.responseText);
        }.bind(this);

        req.open("GET", url, async);
        if (beforeSendCallback) {
            beforeSendCallback(req);
        }
        req.send();
    } else {
        bespin.proxy.xhr.call(this, method, url, async, beforeSendCallback, pr);
    }

    return pr;
};

exports.Worker = function(url) {
    if (!bespin.proxy || !bespin.proxy.worker) {
        return new Worker(url);
    } else {
        return new bespin.proxy.worker(url);
    }
};

});

bespin.tiki.module("bespin:sandbox",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var tiki = require('tiki');
var util = require('bespin:util/util');
var catalog = require('bespin:plugins').catalog;

/**
 * A sandbox can only be used from inside of the `master` catalog.
 */
if (catalog.parent) {
    throw new Error('The sandbox module can\'t be used inside of a slave catalog!');
}

/**
 * A special Bespin subclass of the tiki sandbox class. When the sandbox is
 * created, the catalog for the new sandbox is setup based on the catalog
 * data that is already in the so called `master` catalog.
 */
var Sandbox = function() {
    tiki.Sandbox.call(this, bespin.tiki.require.loader, {}, []);

    var sandboxCatalog = this.require('bespin:plugins').catalog;

    sandboxCatalog.parent = catalog;
    catalog.children.push(sandboxCatalog);

    sandboxCatalog.deactivatePlugin = util.clone(catalog.deactivatePlugin);
    sandboxCatalog._extensionsOrdering = util.clone(catalog._extensionsOrdering);

    sandboxCatalog._registerMetadata(util.clone(catalog.metadata, true));
};

Sandbox.prototype = new tiki.Sandbox();

/**
 * Overrides the standard tiki.Sandbox.require function. If the requested
 * module/plugin is shared between the sandboxes, then the require function
 * on the `master` sandbox is called. Otherwise it calls the overridden require
 * function.
 */
Sandbox.prototype.require = function(moduleId, curModuleId, workingPackage) {
    var canonicalId = this.loader.canonical(moduleId, curModuleId, workingPackage);
    var pluginName = canonicalId.substring(2).split(':')[0];

    if (catalog.plugins[pluginName].share) {
        return bespin.tiki.sandbox.require(moduleId, curModuleId, workingPackage);
    } else {
        return tiki.Sandbox.prototype.require.call(this, moduleId,
                                                    curModuleId, workingPackage);
    }
}

exports.Sandbox = Sandbox;

});

bespin.tiki.module("bespin:util/cookie",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Adds escape sequences for special characters in regular expressions
 * @param {String} str a String with special characters to be left unescaped
 */
var escapeString = function(str, except){
    return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function(ch){
        if(except && except.indexOf(ch) != -1){
            return ch;
        }
        return "\\" + ch;
    });
};

/**
 * Get a cookie value by name
 * @param {String} name The cookie value to retrieve
 * @return The value, or undefined if the cookie was not found
 */
exports.get = function(name) {
    var matcher = new RegExp("(?:^|; )" + escapeString(name) + "=([^;]*)");
    var matches = document.cookie.match(matcher);
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * Set a cookie value
 * @param {String} name The cookie value to alter
 * @param {String} value The new value for the cookie
 * @param {Object} props (Optional) cookie properties. One of:<ul>
 * <li>expires: Date|String|Number|null If a number, the number of days from
 * today at which the cookie will expire. If a date, the date past which the
 * cookie will expire. If expires is in the past, the cookie will be deleted.
 * If expires is omitted or is 0, the cookie will expire either directly (ff3)
 * or when the browser closes
 * <li>path: String|null The path to use for the cookie.
 * <li>domain: String|null The domain to use for the cookie.
 * <li>secure: Boolean|null Whether to only send the cookie on secure connections
 * </ul>
 */
exports.set = function(name, value, props) {
    props = props || {};

    if (typeof props.expires == "number") {
        var date = new Date();
        date.setTime(date.getTime() + props.expires * 24 * 60 * 60 * 1000);
        props.expires = date;
    }
    if (props.expires && props.expires.toUTCString) {
        props.expires = props.expires.toUTCString();
    }

    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value, propName;
    for (propName in props) {
        updatedCookie += "; " + propName;
        var propValue = props[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
};

/**
 * Remove a cookie by name. Depending on the browser, the cookie will either
 * be deleted directly or at browser close.
 * @param {String} name The cookie value to retrieve
 */
exports.remove = function(name) {
    exports.set(name, "", { expires: -1 });
};

/**
 * Use to determine if the current browser supports cookies or not.
 * @return Returns true if user allows cookies, false otherwise
 */
exports.isSupported = function() {
    if (!("cookieEnabled" in navigator)) {
        exports.set("__djCookieTest__", "CookiesAllowed");
        navigator.cookieEnabled = exports.get("__djCookieTest__") == "CookiesAllowed";
        if (navigator.cookieEnabled) {
            exports.remove("__djCookieTest__");
        }
    }
    return navigator.cookieEnabled;
};

});

bespin.tiki.module("bespin:util/scratchcanvas",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var util = require('bespin:util/util');

/**
 * A invisible singleton canvas on the page, useful whenever a canvas context
 * is needed (e.g. for computing text sizes), but an actual canvas isn't handy
 * at the moment.
 * @constructor
 */
var ScratchCanvas = function() {
    this._canvas = document.getElementById('bespin-scratch-canvas');

    if (util.none(this._canvas)) {
        this._canvas = document.createElement('canvas');
        this._canvas.id = 'bespin-scratch-canvas';
        this._canvas.width = 400;
        this._canvas.height = 300;
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = "-10000px";
        this._canvas.style.left = "-10000px";
        document.body.appendChild(this._canvas);
    }
};

ScratchCanvas.prototype.getContext = function() {
    return this._canvas.getContext('2d');
};

/**
 * Returns the width in pixels of the given string ("M", by default) in the
 * given font.
 */
ScratchCanvas.prototype.measureStringWidth = function(font, str) {
    if (util.none(str)) {
        str = "M";
    }

    var context = this.getContext();
    context.save();
    context.font = font;
    var width = context.measureText(str).width;
    context.restore();
    return width;
};

var singleton = null;

/**
 * Returns the instance of the scratch canvas on the page, creating it if
 * necessary.
 */
exports.get = function() {
    if (singleton === null) {
        singleton = new ScratchCanvas();
    }
    return singleton;
};

});

bespin.tiki.module("bespin:util/stacktrace",function(require,exports,module) {



var util = require('bespin:util/util');
var console = require("bespin:console").console;

/**
 * Different browsers create stack traces in different ways.
 * <strike>Feature</strike> Browser detection baby ;).
 */
var mode = (function() {

    if (util.isMozilla) {
        return 'firefox';
    } else if (util.isOpera) {
        return 'opera';
    } else if (util.isSafari) {
        return 'other';
    }


    try {
        (0)();
    } catch (e) {
        if (e.arguments) {
            return 'chrome';
        }
        if (e.stack) {
            return 'firefox';
        }
        if (window.opera && !('stacktrace' in e)) { //Opera 9-
            return 'opera';
        }
    }
    return 'other';
})();

/**
 *
 */
function stringifyArguments(args) {
    for (var i = 0; i < args.length; ++i) {
        var argument = args[i];
        if (typeof argument == 'object') {
            args[i] = '#object';
        } else if (typeof argument == 'function') {
            args[i] = '#function';
        } else if (typeof argument == 'string') {
            args[i] = '"' + argument + '"';
        }
    }
    return args.join(',');
}

/**
 * Extract a stack trace from the format emitted by each browser.
 */
var decoders = {
    chrome: function(e) {
        var stack = e.stack;
        if (!stack) {
            console.log(e);
            return [];
        }
        return stack.replace(/^.*?\n/, '').
                replace(/^.*?\n/, '').
                replace(/^.*?\n/, '').
                replace(/^[^\(]+?[\n$]/gm, '').
                replace(/^\s+at\s+/gm, '').
                replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@').
                split('\n');
    },

    firefox: function(e) {
        var stack = e.stack;
        if (!stack) {
            console.log(e);
            return [];
        }
        stack = stack.replace(/(?:\n@:0)?\s+$/m, '');
        stack = stack.replace(/^\(/gm, '{anonymous}(');
        return stack.split('\n');
    },

    opera: function(e) {
        var lines = e.message.split('\n'), ANON = '{anonymous}',
            lineRE = /Line\s+(\d+).*?script\s+(http\S+)(?:.*?in\s+function\s+(\S+))?/i, i, j, len;

        for (i = 4, j = 0, len = lines.length; i < len; i += 2) {
            if (lineRE.test(lines[i])) {
                lines[j++] = (RegExp.$3 ? RegExp.$3 + '()@' + RegExp.$2 + RegExp.$1 : ANON + '()@' + RegExp.$2 + ':' + RegExp.$1) +
                ' -- ' +
                lines[i + 1].replace(/^\s+/, '');
            }
        }

        lines.splice(j, lines.length - j);
        return lines;
    },

    other: function(curr) {
        var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], j = 0, fn, args;

        var maxStackSize = 10;
        while (curr && stack.length < maxStackSize) {
            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
            args = Array.prototype.slice.call(curr['arguments']);
            stack[j++] = fn + '(' + stringifyArguments(args) + ')';

            if (curr === curr.caller && window.opera) {
                break;
            }
            curr = curr.caller;
        }
        return stack;
    }
};

/**
 *
 */
function NameGuesser() {
}

NameGuesser.prototype = {

    sourceCache: {},

    ajax: function(url) {
        var req = this.createXMLHTTPObject();
        if (!req) {
            return;
        }
        req.open('GET', url, false);
        req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
        req.send('');
        return req.responseText;
    },

    createXMLHTTPObject: function() {
        var xmlhttp, XMLHttpFactories = [
            function() {
                return new XMLHttpRequest();
            }, function() {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function() {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }, function() {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
                this.createXMLHTTPObject = XMLHttpFactories[i];
                return xmlhttp;
            } catch (e) {}
        }
    },

    getSource: function(url) {
        if (!(url in this.sourceCache)) {
            this.sourceCache[url] = this.ajax(url).split('\n');
        }
        return this.sourceCache[url];
    },

    guessFunctions: function(stack) {
        for (var i = 0; i < stack.length; ++i) {
            var reStack = /{anonymous}\(.*\)@(\w+:\/\/([-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/;
            var frame = stack[i], m = reStack.exec(frame);
            if (m) {
                var file = m[1], lineno = m[4]; //m[7] is character position in Chrome
                if (file && lineno) {
                    var functionName = this.guessFunctionName(file, lineno);
                    stack[i] = frame.replace('{anonymous}', functionName);
                }
            }
        }
        return stack;
    },

    guessFunctionName: function(url, lineNo) {
        try {
            return this.guessFunctionNameFromLines(lineNo, this.getSource(url));
        } catch (e) {
            return 'getSource failed with url: ' + url + ', exception: ' + e.toString();
        }
    },

    guessFunctionNameFromLines: function(lineNo, source) {
        var reFunctionArgNames = /function ([^(]*)\(([^)]*)\)/;
        var reGuessFunction = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(function|eval|new Function)/;
        var line = '', maxLines = 10;
        for (var i = 0; i < maxLines; ++i) {
            line = source[lineNo - i] + line;
            if (line !== undefined) {
                var m = reGuessFunction.exec(line);
                if (m) {
                    return m[1];
                }
                else {
                    m = reFunctionArgNames.exec(line);
                }
                if (m && m[1]) {
                    return m[1];
                }
            }
        }
        return '(?)';
    }
};

var guesser = new NameGuesser();

var frameIgnorePatterns = [
    /http:\/\/localhost:4020\/sproutcore.js:/
];

exports.ignoreFramesMatching = function(regex) {
    frameIgnorePatterns.push(regex);
};

/**
 * Create a stack trace from an exception
 * @param ex {Error} The error to create a stacktrace from (optional)
 * @param guess {Boolean} If we should try to resolve the names of anonymous functions
 */
exports.Trace = function Trace(ex, guess) {
    this._ex = ex;
    this._stack = decoders[mode](ex);

    if (guess) {
        this._stack = guesser.guessFunctions(this._stack);
    }
};

/**
 * Log to the console a number of lines (default all of them)
 * @param lines {number} Maximum number of lines to wrote to console
 */
exports.Trace.prototype.log = function(lines) {
    if (lines <= 0) {
        lines = 999999999;
    }

    var printed = 0;
    for (var i = 0; i < this._stack.length && printed < lines; i++) {
        var frame = this._stack[i];
        var display = true;
        frameIgnorePatterns.forEach(function(regex) {
            if (regex.test(frame)) {
                display = false;
            }
        });
        if (display) {
            console.debug(frame);
            printed++;
        }
    }
};

});

bespin.tiki.module("bespin:util/util",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Create an object representing a de-serialized query section of a URL.
 * Query keys with multiple values are returned in an array.
 * <p>Example: The input "foo=bar&foo=baz&thinger=%20spaces%20=blah&zonk=blarg&"
 * Produces the output object:
 * <pre>{
 *   foo: [ "bar", "baz" ],
 *   thinger: " spaces =blah",
 *   zonk: "blarg"
 * }
 * </pre>
 * <p>Note that spaces and other urlencoded entities are correctly handled
 * @see dojo.queryToObject()
 * While dojo.queryToObject() is mainly for URL query strings, this version
 * allows to specify a separator character
 */
exports.queryToObject = function(str, seperator) {
    var ret = {};
    var qp = str.split(seperator || "&");
    var dec = decodeURIComponent;
    qp.forEach(function(item) {
        if (item.length) {
            var parts = item.split("=");
            var name = dec(parts.shift());
            var val = dec(parts.join("="));
            if (exports.isString(ret[name])){
                ret[name] = [ret[name]];
            }
            if (Array.isArray(ret[name])){
                ret[name].push(val);
            } else {
                ret[name] = val;
            }
        }
    });
    return ret;
};

/**
 * Takes a name/value mapping object and returns a string representing a
 * URL-encoded version of that object for use in a GET request
 * <p>For example, given the input:
 * <code>{ blah: "blah", multi: [ "thud", "thonk" ] }</code>
 * The following string would be returned:
 * <code>"blah=blah&multi=thud&multi=thonk"</code>
 * @param map {Object} The object to convert
 * @return {string} A URL-encoded version of the input
 */
exports.objectToQuery = function(map) {
    var enc = encodeURIComponent;
    var pairs = [];
    var backstop = {};
    for (var name in map) {
        var value = map[name];
        if (value != backstop[name]) {
            var assign = enc(name) + "=";
            if (value.isArray) {
                for (var i = 0; i < value.length; i++) {
                    pairs.push(assign + enc(value[i]));
                }
            } else {
                pairs.push(assign + enc(value));
            }
        }
    }
    return pairs.join("&");
};

/**
 * Holds the count to keep a unique value for setTimeout
 * @private See rateLimit()
 */
var nextRateLimitId = 0;

/**
 * Holds the timeouts so they can be cleared later
 * @private See rateLimit()
 */
var rateLimitTimeouts = {};

/**
 * Delay calling some function to check that it's not called again inside a
 * maxRate. The real function is called after maxRate ms unless the return
 * value of this function is called before, in which case the clock is restarted
 */
exports.rateLimit = function(maxRate, scope, func) {
    if (maxRate) {
        var rateLimitId = nextRateLimitId++;

        return function() {
            if (rateLimitTimeouts[rateLimitId]) {
                clearTimeout(rateLimitTimeouts[rateLimitId]);
            }

            rateLimitTimeouts[rateLimitId] = setTimeout(function() {
                func.apply(scope, arguments);
                delete rateLimitTimeouts[rateLimitId];
            }, maxRate);
        };
    }
};

/**
 * Return true if it is a String
 */
exports.isString = function(it) {
    return (typeof it == "string" || it instanceof String);
};

/**
 * Returns true if it is a Boolean.
 */
exports.isBoolean = function(it) {
    return (typeof it == 'boolean');
};

/**
 * Returns true if it is a Number.
 */
exports.isNumber = function(it) {
    return (typeof it == 'number' && isFinite(it));
};

/**
 * Hack copied from dojo.
 */
exports.isObject = function(it) {
    return it !== undefined &&
        (it === null || typeof it == "object" ||
        Array.isArray(it) || exports.isFunction(it));
};

/**
 * Is the passed object a function?
 * From dojo.isFunction()
 */
exports.isFunction = (function() {
    var _isFunction = function(it) {
        var t = typeof it; // must evaluate separately due to bizarre Opera bug. See #8937
        return it && (t == "function" || it instanceof Function) && !it.nodeType; // Boolean
    };

    return exports.isSafari ?
        function(/*anything*/ it) {
            if (typeof it == "function" && it == "[object NodeList]") {
                return false;
            }
            return _isFunction(it); // Boolean
        } : _isFunction;
})();

/**
 * A la Prototype endsWith(). Takes a regex excluding the '$' end marker
 */
exports.endsWith = function(str, end) {
    if (!str) {
        return false;
    }
    return str.match(new RegExp(end + "$"));
};

/**
 * A la Prototype include().
 */
exports.include = function(array, item) {
    return array.indexOf(item) > -1;
};

/**
 * Like include, but useful when you're checking for a specific
 * property on each object in the list...
 *
 * Returns null if the item is not in the list, otherwise
 * returns the index of the item.
 */
exports.indexOfProperty = function(array, propertyName, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][propertyName] == item) {
            return i;
        }
    }
    return null;
};

/**
 * A la Prototype last().
 */
exports.last = function(array) {
    if (Array.isArray(array)) {
        return array[array.length - 1];
    }
};

/**
 * Knock off any undefined items from the end of an array
 */
exports.shrinkArray = function(array) {
    var newArray = [];

    var stillAtBeginning = true;
    array.reverse().forEach(function(item) {
        if (stillAtBeginning && item === undefined) {
            return;
        }

        stillAtBeginning = false;

        newArray.push(item);
    });

    return newArray.reverse();
};

/**
 * Create an array
 * @param number The size of the new array to create
 * @param character The item to put in the array, defaults to ' '
 */
exports.makeArray = function(number, character) {
    if (number < 1) {
        return []; // give us a normal number please!
    }
    if (!character){character = ' ';}

    var newArray = [];
    for (var i = 0; i < number; i++) {
        newArray.push(character);
    }
    return newArray;
};

/**
 * Repeat a string a given number of times.
 * @param string String to repeat
 * @param repeat Number of times to repeat
 */
exports.repeatString = function(string, repeat) {
    var newstring = '';

    for (var i = 0; i < repeat; i++) {
        newstring += string;
    }

    return newstring;
};

/**
 * Given a row, find the number of leading spaces.
 * E.g. an array with the string "  aposjd" would return 2
 * @param row The row to hunt through
 */
exports.leadingSpaces = function(row) {
    var numspaces = 0;
    for (var i = 0; i < row.length; i++) {
        if (row[i] == ' ' || row[i] == '' || row[i] === undefined) {
            numspaces++;
        } else {
            return numspaces;
        }
    }
    return numspaces;
};

/**
 * Given a row, find the number of leading tabs.
 * E.g. an array with the string "\t\taposjd" would return 2
 * @param row The row to hunt through
 */
exports.leadingTabs = function(row) {
    var numtabs = 0;
    for (var i = 0; i < row.length; i++) {
        if (row[i] == '\t' || row[i] == '' || row[i] === undefined) {
            numtabs++;
        } else {
            return numtabs;
        }
    }
    return numtabs;
};

/**
 * Given a row, extract a copy of the leading spaces or tabs.
 * E.g. an array with the string "\t    \taposjd" would return an array with the
 * string "\t    \t".
 * @param row The row to hunt through
 */
exports.leadingWhitespace = function(row) {
    var leading = [];
    for (var i = 0; i < row.length; i++) {
        if (row[i] == ' ' || row[i] == '\t' || row[i] == '' || row[i] === undefined) {
            leading.push(row[i]);
        } else {
            return leading;
        }
    }
    return leading;
};

/**
 * Given a camelCaseWord convert to "Camel Case Word"
 */
exports.englishFromCamel = function(camel) {
    camel.replace(/([A-Z])/g, function(str) {
        return " " + str.toLowerCase();
    }).trim();
};

/**
 * I hate doing this, but we need some way to determine if the user is on a Mac
 * The reason is that users have different expectations of their key combinations.
 *
 * Take copy as an example, Mac people expect to use CMD or APPLE + C
 * Windows folks expect to use CTRL + C
 */
exports.OS = {
    LINUX: 'LINUX',
    MAC: 'MAC',
    WINDOWS: 'WINDOWS'
};

var ua = navigator.userAgent;
var av = navigator.appVersion;

/** Is the user using a browser that identifies itself as Linux */
exports.isLinux = av.indexOf("Linux") >= 0;

/** Is the user using a browser that identifies itself as Windows */
exports.isWindows = av.indexOf("Win") >= 0;

/** Is the user using a browser that identifies itself as WebKit */
exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;

/** Is the user using a browser that identifies itself as Chrome */
exports.isChrome = parseFloat(ua.split("Chrome/")[1]) || undefined;

/** Is the user using a browser that identifies itself as Mac OS */
exports.isMac = av.indexOf("Macintosh") >= 0;

/* Is this Firefox or related? */
exports.isMozilla = av.indexOf('Gecko/') >= 0;

if (ua.indexOf("AdobeAIR") >= 0) {
    exports.isAIR = 1;
}

/**
 * Is the user using a browser that identifies itself as Safari
 * See also:
 * - http://developer.apple.com/internet/safari/faq.html#anchor2
 * - http://developer.apple.com/internet/safari/uamatrix.html
 */
var index = Math.max(av.indexOf("WebKit"), av.indexOf("Safari"), 0);
if (index && !exports.isChrome) {
    exports.isSafari = parseFloat(av.split("Version/")[1]);
    if (!exports.isSafari || parseFloat(av.substr(index + 7)) <= 419.3) {
        exports.isSafari = 2;
    }
}

if (ua.indexOf("Gecko") >= 0 && !exports.isWebKit) {
    exports.isMozilla = parseFloat(av);
}

/**
 * Return a exports.OS constant
 */
exports.getOS = function() {
    if (exports.isMac) {
        return exports.OS['MAC'];
    } else if (exports.isLinux) {
        return exports.OS['LINUX'];
    } else {
        return exports.OS['WINDOWS'];
    }
};

/** Returns true if the DOM element "b" is inside the element "a". */
if (typeof(document) !== 'undefined' && document.compareDocumentPosition) {
    exports.contains = function(a, b) {
        return a.compareDocumentPosition(b) & 16;
    };
} else {
    exports.contains = function(a, b) {
        return a !== b && (a.contains ? a.contains(b) : true);
    };
}

/**
 * Prevents propagation and clobbers the default action of the passed event
 */
exports.stopEvent = function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
};

/**
 * Create a random password of the given length (default 16 chars)
 */
exports.randomPassword = function(length) {
    length = length || 16;
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var charIndex = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(charIndex);
    }
    return pass;
};

/**
 * Is the passed object free of members, i.e. are there any enumerable
 * properties which the objects claims as it's own using hasOwnProperty()
 */
exports.isEmpty = function(object) {
    for (var x in object) {
        if (object.hasOwnProperty(x)) {
            return false;
        }
    }
    return true;
};

/**
 * Does the name of a project indicate that it is owned by someone else
 * TODO: This is a major hack. We really should have a File object that include
 * separate owner information.
 */
exports.isMyProject = function(project) {
    return project.indexOf("+") == -1;
};

/**
 * Format a date as dd MMM yyyy
 */
exports.formatDate = function (date) {
    if (!date) {
        return "Unknown";
    }
    return date.getDate() + " " +
        exports.formatDate.shortMonths[date.getMonth()] + " " +
        date.getFullYear();
};

/**
 * Month data for exports.formatDate
 */
exports.formatDate.shortMonths = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

/**
 * Add a CSS class to the list of classes on the given node
 */
exports.addClass = function(node, className) {
    var parts = className.split(/\s+/);
    var cls = " " + node.className + " ";
    for (var i = 0, len = parts.length, c; i < len; ++i) {
        c = parts[i];
        if (c && cls.indexOf(" " + c + " ") < 0) {
            cls += c + " ";
        }
    }
    node.className = cls.trim();
};

/**
 * Remove a CSS class from the list of classes on the given node
 */
exports.removeClass = function(node, className) {
    var cls;
    if (className !== undefined) {
        var parts = className.split(/\s+/);
        cls = " " + node.className + " ";
        for (var i = 0, len = parts.length; i < len; ++i) {
            cls = cls.replace(" " + parts[i] + " ", " ");
        }
        cls = cls.trim();
    } else {
        cls = "";
    }
    if (node.className != cls) {
        node.className = cls;
    }
};

/**
 * Add or remove a CSS class from the list of classes on the given node
 * depending on the value of <tt>include</tt>
 */
exports.setClass = function(node, className, include) {
    if (include) {
        exports.addClass(node, className);
    } else {
        exports.removeClass(node, className);
    }
};

/**
 * Is the passed object either null or undefined (using ===)
 */
exports.none = function(obj) {
    return obj === null || obj === undefined;
};

/**
 * Creates a clone of the passed object.  This function can take just about
 * any type of object and create a clone of it, including primitive values
 * (which are not actually cloned because they are immutable).
 * If the passed object implements the clone() method, then this function
 * will simply call that method and return the result.
 * @param object {Object} the object to clone
 * @returns {Object} the cloned object
 */
exports.clone = function(object, deep) {
    if (Array.isArray(object) && !deep) {
        return object.slice();
    }

    if (typeof object === 'object' || Array.isArray(object)) {
        if (object === null) {
            return null;
        }

        var reply = (Array.isArray(object) ? [] : {});
        for (var key in object) {
            if (deep && (typeof object[key] === 'object'
                            || Array.isArray(object[key]))) {
                reply[key] = exports.clone(object[key], true);
            } else {
                 reply[key] = object[key];
            }
        }
        return reply;
    }

    if (object.clone && typeof(object.clone) === 'function') {
        return object.clone();
    }

    return object;
};


/**
 * Helper method for extending one object with another
 * Copies all properties from source to target. Returns the extended target
 * object.
 * Taken from John Resig, http://ejohn.org/blog/javascript-getters-and-setters/.
 */
exports.mixin = function(a, b) {
    for (var i in b) {
        var g = b.__lookupGetter__(i);
        var s = b.__lookupSetter__(i);

        if (g || s) {
            if (g) {
                a.__defineGetter__(i, g);
            }
            if (s) {
                a.__defineSetter__(i, s);
            }
        } else {
            a[i] = b[i];
        }
    }

    return a;
};

/**
 * Basically taken from Sproutcore.
 * Replaces the count items from idx with objects.
 */
exports.replace = function(arr, idx, amt, objects) {
    return arr.slice(0, idx).concat(objects).concat(arr.slice(idx + amt));
};

/**
 * Return true if the two frames match.  You can also pass only points or sizes.
 * @param r1 {Rect} the first rect
 * @param r2 {Rect} the second rect
 * @param delta {Float} an optional delta that allows for rects that do not match exactly. Defaults to 0.1
 * @returns {Boolean} true if rects match
 */
exports.rectsEqual = function(r1, r2, delta) {
    if (!r1 || !r2) {
        return r1 == r2;
    }

    if (!delta && delta !== 0) {
        delta = 0.1;
    }

    if ((r1.y != r2.y) && (Math.abs(r1.y - r2.y) > delta)) {
        return false;
    }

    if ((r1.x != r2.x) && (Math.abs(r1.x - r2.x) > delta)) {
        return false;
    }

    if ((r1.width != r2.width) && (Math.abs(r1.width - r2.width) > delta)) {
        return false;
    }

    if ((r1.height != r2.height) && (Math.abs(r1.height - r2.height) > delta)) {
        return false;
    }

    return true;
};

});
;bespin.tiki.register("::syntax_directory", {
    name: "syntax_directory",
    dependencies: {  }
});
bespin.tiki.module("syntax_directory:index",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

"define metadata";
({
    "description": "Catalogs the available syntax engines",
    "dependencies": {},
    "environments": { "main": true, "worker": true },
    "provides": [
        {
            "ep": "extensionhandler",
            "name": "syntax",
            "register": "#discoveredNewSyntax"
        }
    ]
});
"end";

var plugins = require("bespin:plugins");

function SyntaxInfo(ext) {
    this.extension = ext;
    this.name = ext.name;
    this.fileExts = ext.hasOwnProperty('fileexts') ? ext.fileexts : [];
}

/**
 * Stores metadata for all of the syntax plugins.
 *
 * @exports syntaxDirectory as syntax_directory:syntaxDirectory
 */
var syntaxDirectory = {
    _fileExts: {},
    _syntaxInfo: {},

    get: function(syntaxName) {
        return this._syntaxInfo[syntaxName];
    },

    hasSyntax: function(syntax) {
        return this._syntaxInfo.hasOwnProperty(syntax);
    },

    register: function(extension) {
        var syntaxInfo = new SyntaxInfo(extension);
        this._syntaxInfo[syntaxInfo.name] = syntaxInfo;

        var fileExts = this._fileExts;
        syntaxInfo.fileExts.forEach(function(fileExt) {
            fileExts[fileExt] = syntaxInfo.name;
        });
    },

    syntaxForFileExt: function(fileExt) {
        fileExt = fileExt.toLowerCase();
        var fileExts = this._fileExts;
        return fileExts.hasOwnProperty(fileExt) ? fileExts[fileExt] : 'plain';
    }
};

function discoveredNewSyntax(syntaxExtension) {
    syntaxDirectory.register(syntaxExtension);
}

exports.syntaxDirectory = syntaxDirectory;
exports.discoveredNewSyntax = discoveredNewSyntax;


});
;bespin.tiki.register("::underscore", {
    name: "underscore",
    dependencies: {  }
});
bespin.tiki.module("underscore:index",function(require,exports,module) {

"define metadata";
({
    "description": "Functional Programming Aid for Javascript. Works well with jQuery."
});
"end";

(function() {

  var root = this;

  var previousUnderscore = root._;

  var breaker = typeof StopIteration !== 'undefined' ? StopIteration : '__break__';

  var escapeRegExp = function(s) { return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1'); };

  var ArrayProto = Array.prototype, ObjProto = Object.prototype;

  var slice                 = ArrayProto.slice,
      unshift               = ArrayProto.unshift,
      toString              = ObjProto.toString,
      hasOwnProperty        = ObjProto.hasOwnProperty,
      propertyIsEnumerable  = ObjProto.propertyIsEnumerable;

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

  var _ = function(obj) { return new wrapper(obj); };

  if (typeof exports !== 'undefined') exports._ = _;

  root._ = _;

  _.VERSION = '1.0.2';


  var each = _.forEach = function(obj, iterator, context) {
    try {
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (_.isNumber(obj.length)) {
        for (var i = 0, l = obj.length; i < l; i++) iterator.call(context, obj[i], i, obj);
      } else {
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) iterator.call(context, obj[key], key, obj);
        }
      }
    } catch(e) {
      if (e != breaker) throw e;
    }
    return obj;
  };

  _.map = function(obj, iterator, context) {
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    var results = [];
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  _.reduce = function(obj, memo, iterator, context) {
    if (nativeReduce && obj.reduce === nativeReduce) return obj.reduce(_.bind(iterator, context), memo);
    each(obj, function(value, index, list) {
      memo = iterator.call(context, memo, value, index, list);
    });
    return memo;
  };

  _.reduceRight = function(obj, memo, iterator, context) {
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) return obj.reduceRight(_.bind(iterator, context), memo);
    var reversed = _.clone(_.toArray(obj)).reverse();
    return _.reduce(reversed, memo, iterator, context);
  };

  _.detect = function(obj, iterator, context) {
    var result;
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        _.breakLoop();
      }
    });
    return result;
  };

  _.filter = function(obj, iterator, context) {
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    var results = [];
    each(obj, function(value, index, list) {
      iterator.call(context, value, index, list) && results.push(value);
    });
    return results;
  };

  _.reject = function(obj, iterator, context) {
    var results = [];
    each(obj, function(value, index, list) {
      !iterator.call(context, value, index, list) && results.push(value);
    });
    return results;
  };

  _.every = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    var result = true;
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) _.breakLoop();
    });
    return result;
  };

  _.some = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    var result = false;
    each(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) _.breakLoop();
    });
    return result;
  };

  _.include = function(obj, target) {
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    var found = false;
    each(obj, function(value) {
      if (found = value === target) _.breakLoop();
    });
    return found;
  };

  _.invoke = function(obj, method) {
    var args = _.rest(arguments, 2);
    return _.map(obj, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  };

  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

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

  _.sortedIndex = function(array, obj, iterator) {
    iterator = iterator || _.identity;
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return iterable;
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  _.size = function(obj) {
    return _.toArray(obj).length;
  };


  _.first = function(array, n, guard) {
    return n && !guard ? slice.call(array, 0, n) : array[0];
  };

  _.rest = function(array, index, guard) {
    return slice.call(array, _.isUndefined(index) || guard ? 1 : index);
  };

  _.last = function(array) {
    return array[array.length - 1];
  };

  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  _.flatten = function(array) {
    return _.reduce(array, [], function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo.push(value);
      return memo;
    });
  };

  _.without = function(array) {
    var values = _.rest(arguments);
    return _.filter(array, function(value){ return !_.include(values, value); });
  };

  _.uniq = function(array, isSorted) {
    return _.reduce(array, [], function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) memo.push(el);
      return memo;
    });
  };

  _.intersect = function(array) {
    var rest = _.rest(arguments);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  _.zip = function() {
    var args = _.toArray(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, String(i));
    return results;
  };

  _.indexOf = function(array, item) {
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (var i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };


  _.lastIndexOf = function(array, item) {
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  _.range = function(start, stop, step) {
    var a     = _.toArray(arguments);
    var solo  = a.length <= 1;
    var start = solo ? 0 : a[0], stop = solo ? a[0] : a[1], step = a[2] || 1;
    var len   = Math.ceil((stop - start) / step);
    if (len <= 0) return [];
    var range = new Array(len);
    for (var i = start, idx = 0; true; i += step) {
      if ((step > 0 ? i - stop : stop - i) >= 0) return range;
      range[idx++] = i;
    }
  };


  _.bind = function(func, obj) {
    var args = _.rest(arguments, 2);
    return function() {
      return func.apply(obj || {}, args.concat(_.toArray(arguments)));
    };
  };

  _.bindAll = function(obj) {
    var funcs = _.rest(arguments);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  _.delay = function(func, wait) {
    var args = _.rest(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(_.rest(arguments)));
  };

  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(_.toArray(arguments));
      return wrapper.apply(wrapper, args);
    };
  };

  _.compose = function() {
    var funcs = _.toArray(arguments);
    return function() {
      var args = _.toArray(arguments);
      for (var i=funcs.length-1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };


  _.keys = nativeKeys || function(obj) {
    if (_.isArray(obj)) return _.range(0, obj.length);
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
    return keys;
  };

  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  _.functions = function(obj) {
    return _.filter(_.keys(obj), function(key){ return _.isFunction(obj[key]); }).sort();
  };

  _.extend = function(obj) {
    each(_.rest(arguments), function(source) {
      for (var prop in source) obj[prop] = source[prop];
    });
    return obj;
  };

  _.clone = function(obj) {
    if (_.isArray(obj)) return obj.slice(0);
    return _.extend({}, obj);
  };

  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  _.isEqual = function(a, b) {
    if (a === b) return true;
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    if (a == b) return true;
    if ((!a && b) || (a && !b)) return false;
    if (a.isEqual) return a.isEqual(b);
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    if (_.isNaN(a) && _.isNaN(b)) return true;
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    if (atype !== 'object') return false;
    if (a.length && (a.length !== b.length)) return false;
    var aKeys = _.keys(a), bKeys = _.keys(b);
    if (aKeys.length != bKeys.length) return false;
    for (var key in a) if (!(key in b) || !_.isEqual(a[key], b[key])) return false;
    return true;
  };

  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  _.isArray = nativeIsArray || function(obj) {
    return !!(obj && obj.concat && obj.unshift && !obj.callee);
  };

  _.isArguments = function(obj) {
    return obj && obj.callee;
  };

  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  _.isNumber = function(obj) {
    return (obj === +obj) || (toString.call(obj) === '[object Number]');
  };

  _.isBoolean = function(obj) {
    return obj === true || obj === false;
  };

  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  _.isNull = function(obj) {
    return obj === null;
  };

  _.isUndefined = function(obj) {
    return typeof obj == 'undefined';
  };


  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  _.identity = function(value) {
    return value;
  };

  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  _.breakLoop = function() {
    throw breaker;
  };

  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  _.templateSettings = {
    start       : '<%',
    end         : '%>',
    interpolate : /<%=(.+?)%>/g
  };

  _.template = function(str, data) {
    var c  = _.templateSettings;
    var endMatch = new RegExp("'(?=[^"+c.end.substr(0, 1)+"]*"+escapeRegExp(c.end)+")","g");
    var fn = new Function('obj',
      'var p=[],print=function(){p.push.apply(p,arguments);};' +
      'with(obj){p.push(\'' +
      str.replace(/[\r\t\n]/g, " ")
         .replace(endMatch,"\t")
         .split("'").join("\\'")
         .split("\t").join("'")
         .replace(c.interpolate, "',$1,'")
         .split(c.start).join("');")
         .split(c.end).join("p.push('")
         + "');}return p.join('');");
    return data ? fn(data) : fn;
  };


  _.each     = _.forEach;
  _.foldl    = _.inject       = _.reduce;
  _.foldr    = _.reduceRight;
  _.select   = _.filter;
  _.all      = _.every;
  _.any      = _.some;
  _.head     = _.first;
  _.tail     = _.rest;
  _.methods  = _.functions;


  var wrapper = function(obj) { this._wrapped = obj; };

  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = _.toArray(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  _.mixin(_);

  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();

exports._.noConflict();
});

bespin.tiki.require("bespin:plugins").catalog.registerMetadata({"bespin": {"testmodules": [], "resourceURL": "resources/bespin/", "name": "bespin", "environments": {"main": true, "worker": true}, "type": "plugins/boot"}, "syntax_directory": {"resourceURL": "resources/syntax_directory/", "name": "syntax_directory", "environments": {"main": true, "worker": true}, "dependencies": {}, "testmodules": [], "provides": [{"register": "#discoveredNewSyntax", "ep": "extensionhandler", "name": "syntax"}], "type": "plugins/supported", "description": "Catalogs the available syntax engines"}, "underscore": {"testmodules": [], "type": "plugins/thirdparty", "resourceURL": "resources/underscore/", "description": "Functional Programming Aid for Javascript. Works well with jQuery.", "name": "underscore"}});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


if (typeof(window) === "undefined") {
    importScripts("BespinWorker.js");
} else {
    (function() {
        var mainscript = document.createElement("script");
        mainscript.setAttribute("src", bespin.base + "BespinMain.js");
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(mainscript);
    })();
}

(function(win, doc, undefined) {
  var HIGHLIGHT_LINE = false;

var THREE=THREE||{};THREE.Color=function(a){this.autoUpdate=true;this.setHex(a)};
THREE.Color.prototype={setRGB:function(a,c,d){this.r=a;this.g=c;this.b=d;if(this.autoUpdate){this.updateHex();this.updateStyleString()}},setHex:function(a){this.hex=~~a&16777215;if(this.autoUpdate){this.updateRGBA();this.updateStyleString()}},updateHex:function(){this.hex=~~(this.r*255)<<16^~~(this.g*255)<<8^~~(this.b*255)},updateRGBA:function(){this.r=(this.hex>>16&255)/255;this.g=(this.hex>>8&255)/255;this.b=(this.hex&255)/255},updateStyleString:function(){this.__styleString="rgb("+~~(this.r*255)+
","+~~(this.g*255)+","+~~(this.b*255)+")"},clone:function(){return new THREE.Color(this.hex)},toString:function(){return"THREE.Color ( r: "+this.r+", g: "+this.g+", b: "+this.b+", hex: "+this.hex+" )"}};THREE.Vector2=function(a,c){this.x=a||0;this.y=c||0};
THREE.Vector2.prototype={set:function(a,c){this.x=a;this.y=c;return this},copy:function(a){this.x=a.x;this.y=a.y;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;return this},add:function(a,c){this.x=a.x+c.x;this.y=a.y+c.y;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;return this},sub:function(a,c){this.x=a.x-c.x;this.y=a.y-c.y;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;return this},unit:function(){this.multiplyScalar(1/this.length());return this},length:function(){return Math.sqrt(this.x*
this.x+this.y*this.y)},lengthSq:function(){return this.x*this.x+this.y*this.y},negate:function(){this.x=-this.x;this.y=-this.y;return this},clone:function(){return new THREE.Vector2(this.x,this.y)},toString:function(){return"THREE.Vector2 ("+this.x+", "+this.y+")"}};THREE.Vector3=function(a,c,d){this.x=a||0;this.y=c||0;this.z=d||0};
THREE.Vector3.prototype={set:function(a,c,d){this.x=a;this.y=c;this.z=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,c){this.x=a.x+c.x;this.y=a.y+c.y;this.z=a.z+c.z;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;return this},sub:function(a,c){this.x=a.x-c.x;this.y=a.y-c.y;this.z=a.z-c.z;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z;return this},
cross:function(a,c){this.x=a.y*c.z-a.z*c.y;this.y=a.z*c.x-a.x*c.z;this.z=a.x*c.y-a.y*c.x;return this},crossSelf:function(a){var c=this.x,d=this.y,f=this.z;this.x=d*a.z-f*a.y;this.y=f*a.x-c*a.z;this.z=c*a.y-d*a.x;return this},multiply:function(a,c){this.x=a.x*c.x;this.y=a.y*c.y;this.z=a.z*c.z;return this},multiplySelf:function(a){this.x*=a.x;this.y*=a.y;this.z*=a.z;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;return this},divideSelf:function(a){this.x/=a.x;this.y/=a.y;this.z/=
a.z;return this},divideScalar:function(a){this.x/=a;this.y/=a;this.z/=a;return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},distanceTo:function(a){var c=this.x-a.x,d=this.y-a.y;a=this.z-a.z;return Math.sqrt(c*c+d*d+a*a)},distanceToSquared:function(a){var c=this.x-a.x,d=this.y-a.y;a=this.z-a.z;return c*c+d*d+a*a},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},negate:function(){this.x=
-this.x;this.y=-this.y;this.z=-this.z;return this},normalize:function(){var a=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);a>0?this.multiplyScalar(1/a):this.set(0,0,0);return this},setLength:function(a){return this.normalize().multiplyScalar(a)},isZero:function(){return Math.abs(this.x)<1.0E-4&&Math.abs(this.y)<1.0E-4&&Math.abs(this.z)<1.0E-4},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)},toString:function(){return"THREE.Vector3 ( "+this.x+", "+this.y+", "+this.z+" )"}};
THREE.Vector4=function(a,c,d,f){this.x=a||0;this.y=c||0;this.z=d||0;this.w=f||1};
THREE.Vector4.prototype={set:function(a,c,d,f){this.x=a;this.y=c;this.z=d;this.w=f;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w||1;return this},add:function(a,c){this.x=a.x+c.x;this.y=a.y+c.y;this.z=a.z+c.z;this.w=a.w+c.w;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z;this.w+=a.w;return this},sub:function(a,c){this.x=a.x-c.x;this.y=a.y-c.y;this.z=a.z-c.z;this.w=a.w-c.w;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z;this.w-=a.w;
return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;this.w*=a;return this},divideScalar:function(a){this.x/=a;this.y/=a;this.z/=a;this.w/=a;return this},lerpSelf:function(a,c){this.x+=(a.x-this.x)*c;this.y+=(a.y-this.y)*c;this.z+=(a.z-this.z)*c;this.w+=(a.w-this.w)*c},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)},toString:function(){return"THREE.Vector4 ("+this.x+", "+this.y+", "+this.z+", "+this.w+")"}};
THREE.Ray=function(a,c){this.origin=a||new THREE.Vector3;this.direction=c||new THREE.Vector3};
THREE.Ray.prototype={intersectScene:function(a){var c,d,f=a.objects,g=[];a=0;for(c=f.length;a<c;a++){d=f[a];if(d instanceof THREE.Mesh)g=g.concat(this.intersectObject(d))}g.sort(function(h,o){return h.distance-o.distance});return g},intersectObject:function(a){function c(K,p,U,F){F=F.clone().subSelf(p);U=U.clone().subSelf(p);var e=K.clone().subSelf(p);K=F.dot(F);p=F.dot(U);F=F.dot(e);var j=U.dot(U);U=U.dot(e);e=1/(K*j-p*p);j=(j*F-p*U)*e;K=(K*U-p*F)*e;return j>0&&K>0&&j+K<1}var d,f,g,h,o,b,i,k,y,z,
u,x=a.geometry,H=x.vertices,J=[];d=0;for(f=x.faces.length;d<f;d++){g=x.faces[d];z=this.origin.clone();u=this.direction.clone();h=a.matrix.multiplyVector3(H[g.a].position.clone());o=a.matrix.multiplyVector3(H[g.b].position.clone());b=a.matrix.multiplyVector3(H[g.c].position.clone());i=g instanceof THREE.Face4?a.matrix.multiplyVector3(H[g.d].position.clone()):null;k=a.rotationMatrix.multiplyVector3(g.normal.clone());y=u.dot(k);if(y<0){k=k.dot((new THREE.Vector3).sub(h,z))/y;z=z.addSelf(u.multiplyScalar(k));
if(g instanceof THREE.Face3){if(c(z,h,o,b)){g={distance:this.origin.distanceTo(z),point:z,face:g,object:a};J.push(g)}}else if(g instanceof THREE.Face4)if(c(z,h,o,i)||c(z,o,b,i)){g={distance:this.origin.distanceTo(z),point:z,face:g,object:a};J.push(g)}}}return J}};
THREE.Rectangle=function(){function a(){h=f-c;o=g-d}var c,d,f,g,h,o,b=true;this.getX=function(){return c};this.getY=function(){return d};this.getWidth=function(){return h};this.getHeight=function(){return o};this.getLeft=function(){return c};this.getTop=function(){return d};this.getRight=function(){return f};this.getBottom=function(){return g};this.set=function(i,k,y,z){b=false;c=i;d=k;f=y;g=z;a()};this.addPoint=function(i,k){if(b){b=false;c=i;d=k;f=i;g=k}else{c=c<i?c:i;d=d<k?d:k;f=f>i?f:i;g=g>k?
g:k}a()};this.add3Points=function(i,k,y,z,u,x){if(b){b=false;c=i<y?i<u?i:u:y<u?y:u;d=k<z?k<x?k:x:z<x?z:x;f=i>y?i>u?i:u:y>u?y:u;g=k>z?k>x?k:x:z>x?z:x}else{c=i<y?i<u?i<c?i:c:u<c?u:c:y<u?y<c?y:c:u<c?u:c;d=k<z?k<x?k<d?k:d:x<d?x:d:z<x?z<d?z:d:x<d?x:d;f=i>y?i>u?i>f?i:f:u>f?u:f:y>u?y>f?y:f:u>f?u:f;g=k>z?k>x?k>g?k:g:x>g?x:g:z>x?z>g?z:g:x>g?x:g}a()};this.addRectangle=function(i){if(b){b=false;c=i.getLeft();d=i.getTop();f=i.getRight();g=i.getBottom()}else{c=c<i.getLeft()?c:i.getLeft();d=d<i.getTop()?d:i.getTop();
f=f>i.getRight()?f:i.getRight();g=g>i.getBottom()?g:i.getBottom()}a()};this.inflate=function(i){c-=i;d-=i;f+=i;g+=i;a()};this.minSelf=function(i){c=c>i.getLeft()?c:i.getLeft();d=d>i.getTop()?d:i.getTop();f=f<i.getRight()?f:i.getRight();g=g<i.getBottom()?g:i.getBottom();a()};this.instersects=function(i){return Math.min(f,i.getRight())-Math.max(c,i.getLeft())>=0&&Math.min(g,i.getBottom())-Math.max(d,i.getTop())>=0};this.empty=function(){b=true;g=f=d=c=0;a()};this.isEmpty=function(){return b};this.toString=
function(){return"THREE.Rectangle ( left: "+c+", right: "+f+", top: "+d+", bottom: "+g+", width: "+h+", height: "+o+" )"}};THREE.Matrix3=function(){this.m=[]};THREE.Matrix3.prototype={transpose:function(){var a;a=this.m[1];this.m[1]=this.m[3];this.m[3]=a;a=this.m[2];this.m[2]=this.m[6];this.m[6]=a;a=this.m[5];this.m[5]=this.m[7];this.m[7]=a;return this}};
THREE.Matrix4=function(a,c,d,f,g,h,o,b,i,k,y,z,u,x,H,J){this.n11=a||1;this.n12=c||0;this.n13=d||0;this.n14=f||0;this.n21=g||0;this.n22=h||1;this.n23=o||0;this.n24=b||0;this.n31=i||0;this.n32=k||0;this.n33=y||1;this.n34=z||0;this.n41=u||0;this.n42=x||0;this.n43=H||0;this.n44=J||1;this.flat=Array(16);this.m33=new THREE.Matrix3};
THREE.Matrix4.prototype={identity:function(){this.n11=1;this.n21=this.n14=this.n13=this.n12=0;this.n22=1;this.n32=this.n31=this.n24=this.n23=0;this.n33=1;this.n43=this.n42=this.n41=this.n34=0;this.n44=1;return this},set:function(a,c,d,f,g,h,o,b,i,k,y,z,u,x,H,J){this.n11=a;this.n12=c;this.n13=d;this.n14=f;this.n21=g;this.n22=h;this.n23=o;this.n24=b;this.n31=i;this.n32=k;this.n33=y;this.n34=z;this.n41=u;this.n42=x;this.n43=H;this.n44=J;return this},copy:function(a){this.n11=a.n11;this.n12=a.n12;this.n13=
a.n13;this.n14=a.n14;this.n21=a.n21;this.n22=a.n22;this.n23=a.n23;this.n24=a.n24;this.n31=a.n31;this.n32=a.n32;this.n33=a.n33;this.n34=a.n34;this.n41=a.n41;this.n42=a.n42;this.n43=a.n43;this.n44=a.n44;return this},lookAt:function(a,c,d){var f=THREE.Matrix4.__tmpVec1,g=THREE.Matrix4.__tmpVec2,h=THREE.Matrix4.__tmpVec3;h.sub(a,c).normalize();f.cross(d,h).normalize();g.cross(h,f).normalize();this.n11=f.x;this.n12=f.y;this.n13=f.z;this.n14=-f.dot(a);this.n21=g.x;this.n22=g.y;this.n23=g.z;this.n24=-g.dot(a);
this.n31=h.x;this.n32=h.y;this.n33=h.z;this.n34=-h.dot(a);this.n43=this.n42=this.n41=0;this.n44=1;return this},multiplyVector3:function(a){var c=a.x,d=a.y,f=a.z,g=1/(this.n41*c+this.n42*d+this.n43*f+this.n44);a.x=(this.n11*c+this.n12*d+this.n13*f+this.n14)*g;a.y=(this.n21*c+this.n22*d+this.n23*f+this.n24)*g;a.z=(this.n31*c+this.n32*d+this.n33*f+this.n34)*g;return a},multiplyVector4:function(a){var c=a.x,d=a.y,f=a.z,g=a.w;a.x=this.n11*c+this.n12*d+this.n13*f+this.n14*g;a.y=this.n21*c+this.n22*d+this.n23*
f+this.n24*g;a.z=this.n31*c+this.n32*d+this.n33*f+this.n34*g;a.w=this.n41*c+this.n42*d+this.n43*f+this.n44*g;return a},crossVector:function(a){var c=new THREE.Vector4;c.x=this.n11*a.x+this.n12*a.y+this.n13*a.z+this.n14*a.w;c.y=this.n21*a.x+this.n22*a.y+this.n23*a.z+this.n24*a.w;c.z=this.n31*a.x+this.n32*a.y+this.n33*a.z+this.n34*a.w;c.w=a.w?this.n41*a.x+this.n42*a.y+this.n43*a.z+this.n44*a.w:1;return c},multiply:function(a,c){var d=a.n11,f=a.n12,g=a.n13,h=a.n14,o=a.n21,b=a.n22,i=a.n23,k=a.n24,y=a.n31,
z=a.n32,u=a.n33,x=a.n34,H=a.n41,J=a.n42,K=a.n43,p=a.n44,U=c.n11,F=c.n12,e=c.n13,j=c.n14,q=c.n21,l=c.n22,r=c.n23,C=c.n24,m=c.n31,t=c.n32,v=c.n33,s=c.n34,n=c.n41,E=c.n42,A=c.n43,O=c.n44;this.n11=d*U+f*q+g*m+h*n;this.n12=d*F+f*l+g*t+h*E;this.n13=d*e+f*r+g*v+h*A;this.n14=d*j+f*C+g*s+h*O;this.n21=o*U+b*q+i*m+k*n;this.n22=o*F+b*l+i*t+k*E;this.n23=o*e+b*r+i*v+k*A;this.n24=o*j+b*C+i*s+k*O;this.n31=y*U+z*q+u*m+x*n;this.n32=y*F+z*l+u*t+x*E;this.n33=y*e+z*r+u*v+x*A;this.n34=y*j+z*C+u*s+x*O;this.n41=H*U+J*q+
K*m+p*n;this.n42=H*F+J*l+K*t+p*E;this.n43=H*e+J*r+K*v+p*A;this.n44=H*j+J*C+K*s+p*O;return this},multiplySelf:function(a){var c=this.n11,d=this.n12,f=this.n13,g=this.n14,h=this.n21,o=this.n22,b=this.n23,i=this.n24,k=this.n31,y=this.n32,z=this.n33,u=this.n34,x=this.n41,H=this.n42,J=this.n43,K=this.n44,p=a.n11,U=a.n21,F=a.n31,e=a.n41,j=a.n12,q=a.n22,l=a.n32,r=a.n42,C=a.n13,m=a.n23,t=a.n33,v=a.n43,s=a.n14,n=a.n24,E=a.n34;a=a.n44;this.n11=c*p+d*U+f*F+g*e;this.n12=c*j+d*q+f*l+g*r;this.n13=c*C+d*m+f*t+g*
v;this.n14=c*s+d*n+f*E+g*a;this.n21=h*p+o*U+b*F+i*e;this.n22=h*j+o*q+b*l+i*r;this.n23=h*C+o*m+b*t+i*v;this.n24=h*s+o*n+b*E+i*a;this.n31=k*p+y*U+z*F+u*e;this.n32=k*j+y*q+z*l+u*r;this.n33=k*C+y*m+z*t+u*v;this.n34=k*s+y*n+z*E+u*a;this.n41=x*p+H*U+J*F+K*e;this.n42=x*j+H*q+J*l+K*r;this.n43=x*C+H*m+J*t+K*v;this.n44=x*s+H*n+J*E+K*a;return this},multiplyScalar:function(a){this.n11*=a;this.n12*=a;this.n13*=a;this.n14*=a;this.n21*=a;this.n22*=a;this.n23*=a;this.n24*=a;this.n31*=a;this.n32*=a;this.n33*=a;this.n34*=
a;this.n41*=a;this.n42*=a;this.n43*=a;this.n44*=a;return this},determinant:function(){var a=this.n11,c=this.n12,d=this.n13,f=this.n14,g=this.n21,h=this.n22,o=this.n23,b=this.n24,i=this.n31,k=this.n32,y=this.n33,z=this.n34,u=this.n41,x=this.n42,H=this.n43,J=this.n44;return f*o*k*u-d*b*k*u-f*h*y*u+c*b*y*u+d*h*z*u-c*o*z*u-f*o*i*x+d*b*i*x+f*g*y*x-a*b*y*x-d*g*z*x+a*o*z*x+f*h*i*H-c*b*i*H-f*g*k*H+a*b*k*H+c*g*z*H-a*h*z*H-d*h*i*J+c*o*i*J+d*g*k*J-a*o*k*J-c*g*y*J+a*h*y*J},transpose:function(){function a(c,d,
f){var g=c[d];c[d]=c[f];c[f]=g}a(this,"n21","n12");a(this,"n31","n13");a(this,"n32","n23");a(this,"n41","n14");a(this,"n42","n24");a(this,"n43","n34");return this},clone:function(){var a=new THREE.Matrix4;a.n11=this.n11;a.n12=this.n12;a.n13=this.n13;a.n14=this.n14;a.n21=this.n21;a.n22=this.n22;a.n23=this.n23;a.n24=this.n24;a.n31=this.n31;a.n32=this.n32;a.n33=this.n33;a.n34=this.n34;a.n41=this.n41;a.n42=this.n42;a.n43=this.n43;a.n44=this.n44;return a},flatten:function(){this.flat[0]=this.n11;this.flat[1]=
this.n21;this.flat[2]=this.n31;this.flat[3]=this.n41;this.flat[4]=this.n12;this.flat[5]=this.n22;this.flat[6]=this.n32;this.flat[7]=this.n42;this.flat[8]=this.n13;this.flat[9]=this.n23;this.flat[10]=this.n33;this.flat[11]=this.n43;this.flat[12]=this.n14;this.flat[13]=this.n24;this.flat[14]=this.n34;this.flat[15]=this.n44;return this.flat},setTranslation:function(a,c,d){this.set(1,0,0,a,0,1,0,c,0,0,1,d,0,0,0,1);return this},setScale:function(a,c,d){this.set(a,0,0,0,0,c,0,0,0,0,d,0,0,0,0,1);return this},
setRotX:function(a){var c=Math.cos(a);a=Math.sin(a);this.set(1,0,0,0,0,c,-a,0,0,a,c,0,0,0,0,1);return this},setRotY:function(a){var c=Math.cos(a);a=Math.sin(a);this.set(c,0,a,0,0,1,0,0,-a,0,c,0,0,0,0,1);return this},setRotZ:function(a){var c=Math.cos(a);a=Math.sin(a);this.set(c,-a,0,0,a,c,0,0,0,0,1,0,0,0,0,1);return this},setRotAxis:function(a,c){var d=Math.cos(c),f=Math.sin(c),g=1-d,h=a.x,o=a.y,b=a.z,i=g*h,k=g*o;this.set(i*h+d,i*o-f*b,i*b+f*o,0,i*o+f*b,k*o+d,k*b-f*h,0,i*b-f*o,k*b+f*h,g*b*b+d,0,0,
0,0,1);return this},toString:function(){return"| "+this.n11+" "+this.n12+" "+this.n13+" "+this.n14+" |\n| "+this.n21+" "+this.n22+" "+this.n23+" "+this.n24+" |\n| "+this.n31+" "+this.n32+" "+this.n33+" "+this.n34+" |\n| "+this.n41+" "+this.n42+" "+this.n43+" "+this.n44+" |"}};THREE.Matrix4.translationMatrix=function(a,c,d){var f=new THREE.Matrix4;f.setTranslation(a,c,d);return f};THREE.Matrix4.scaleMatrix=function(a,c,d){var f=new THREE.Matrix4;f.setScale(a,c,d);return f};
THREE.Matrix4.rotationXMatrix=function(a){var c=new THREE.Matrix4;c.setRotX(a);return c};THREE.Matrix4.rotationYMatrix=function(a){var c=new THREE.Matrix4;c.setRotY(a);return c};THREE.Matrix4.rotationZMatrix=function(a){var c=new THREE.Matrix4;c.setRotZ(a);return c};THREE.Matrix4.rotationAxisAngleMatrix=function(a,c){var d=new THREE.Matrix4;d.setRotAxis(a,c);return d};
THREE.Matrix4.makeInvert=function(a){var c=a.n11,d=a.n12,f=a.n13,g=a.n14,h=a.n21,o=a.n22,b=a.n23,i=a.n24,k=a.n31,y=a.n32,z=a.n33,u=a.n34,x=a.n41,H=a.n42,J=a.n43,K=a.n44,p=new THREE.Matrix4;p.n11=b*u*H-i*z*H+i*y*J-o*u*J-b*y*K+o*z*K;p.n12=g*z*H-f*u*H-g*y*J+d*u*J+f*y*K-d*z*K;p.n13=f*i*H-g*b*H+g*o*J-d*i*J-f*o*K+d*b*K;p.n14=g*b*y-f*i*y-g*o*z+d*i*z+f*o*u-d*b*u;p.n21=i*z*x-b*u*x-i*k*J+h*u*J+b*k*K-h*z*K;p.n22=f*u*x-g*z*x+g*k*J-c*u*J-f*k*K+c*z*K;p.n23=g*b*x-f*i*x-g*h*J+c*i*J+f*h*K-c*b*K;p.n24=f*i*k-g*b*k+
g*h*z-c*i*z-f*h*u+c*b*u;p.n31=o*u*x-i*y*x+i*k*H-h*u*H-o*k*K+h*y*K;p.n32=g*y*x-d*u*x-g*k*H+c*u*H+d*k*K-c*y*K;p.n33=f*i*x-g*o*x+g*h*H-c*i*H-d*h*K+c*o*K;p.n34=g*o*k-d*i*k-g*h*y+c*i*y+d*h*u-c*o*u;p.n41=b*y*x-o*z*x-b*k*H+h*z*H+o*k*J-h*y*J;p.n42=d*z*x-f*y*x+f*k*H-c*z*H-d*k*J+c*y*J;p.n43=f*o*x-d*b*x-f*h*H+c*b*H+d*h*J-c*o*J;p.n44=d*b*k-f*o*k+f*h*y-c*b*y-d*h*z+c*o*z;p.multiplyScalar(1/a.determinant());return p};
THREE.Matrix4.makeInvert3x3=function(a){var c=a.flatten();a=a.m33;var d=c[10]*c[5]-c[6]*c[9],f=-c[10]*c[1]+c[2]*c[9],g=c[6]*c[1]-c[2]*c[5],h=-c[10]*c[4]+c[6]*c[8],o=c[10]*c[0]-c[2]*c[8],b=-c[6]*c[0]+c[2]*c[4],i=c[9]*c[4]-c[5]*c[8],k=-c[9]*c[0]+c[1]*c[8],y=c[5]*c[0]-c[1]*c[4];c=c[0]*d+c[1]*h+c[2]*i;if(c==0)throw"matrix not invertible";c=1/c;a.m[0]=c*d;a.m[1]=c*f;a.m[2]=c*g;a.m[3]=c*h;a.m[4]=c*o;a.m[5]=c*b;a.m[6]=c*i;a.m[7]=c*k;a.m[8]=c*y;return a};
THREE.Matrix4.makeFrustum=function(a,c,d,f,g,h){var o,b,i;o=new THREE.Matrix4;b=2*g/(c-a);i=2*g/(f-d);a=(c+a)/(c-a);d=(f+d)/(f-d);f=-(h+g)/(h-g);g=-2*h*g/(h-g);o.n11=b;o.n12=0;o.n13=a;o.n14=0;o.n21=0;o.n22=i;o.n23=d;o.n24=0;o.n31=0;o.n32=0;o.n33=f;o.n34=g;o.n41=0;o.n42=0;o.n43=-1;o.n44=0;return o};THREE.Matrix4.makePerspective=function(a,c,d,f){var g;a=d*Math.tan(a*Math.PI/360);g=-a;return THREE.Matrix4.makeFrustum(g*c,a*c,g,a,d,f)};
THREE.Matrix4.makeOrtho=function(a,c,d,f,g,h){var o,b,i,k;o=new THREE.Matrix4;b=c-a;i=d-f;k=h-g;a=(c+a)/b;d=(d+f)/i;g=(h+g)/k;o.n11=2/b;o.n12=0;o.n13=0;o.n14=-a;o.n21=0;o.n22=2/i;o.n23=0;o.n24=-d;o.n31=0;o.n32=0;o.n33=-2/k;o.n34=-g;o.n41=0;o.n42=0;o.n43=0;o.n44=1;return o};THREE.Matrix4.__tmpVec1=new THREE.Vector3;THREE.Matrix4.__tmpVec2=new THREE.Vector3;THREE.Matrix4.__tmpVec3=new THREE.Vector3;
THREE.Vertex=function(a,c){this.position=a||new THREE.Vector3;this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.normal=c||new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.normalScreen=new THREE.Vector3;this.tangent=new THREE.Vector4;this.__visible=true};THREE.Vertex.prototype={toString:function(){return"THREE.Vertex ( position: "+this.position+", normal: "+this.normal+" )"}};
THREE.Face3=function(a,c,d,f,g){this.a=a;this.b=c;this.c=d;this.centroid=new THREE.Vector3;this.normal=f instanceof THREE.Vector3?f:new THREE.Vector3;this.vertexNormals=f instanceof Array?f:[];this.materials=g instanceof Array?g:[g]};THREE.Face3.prototype={toString:function(){return"THREE.Face3 ( "+this.a+", "+this.b+", "+this.c+" )"}};
THREE.Face4=function(a,c,d,f,g,h){this.a=a;this.b=c;this.c=d;this.d=f;this.centroid=new THREE.Vector3;this.normal=g instanceof THREE.Vector3?g:new THREE.Vector3;this.vertexNormals=g instanceof Array?g:[];this.materials=h instanceof Array?h:[h]};THREE.Face4.prototype={toString:function(){return"THREE.Face4 ( "+this.a+", "+this.b+", "+this.c+" "+this.d+" )"}};THREE.UV=function(a,c){this.u=a||0;this.v=c||0};
THREE.UV.prototype={copy:function(a){this.u=a.u;this.v=a.v},toString:function(){return"THREE.UV ("+this.u+", "+this.v+")"}};THREE.Geometry=function(){this.vertices=[];this.faces=[];this.uvs=[];this.boundingSphere=this.boundingBox=null;this.geometryChunks={};this.hasTangents=false};
THREE.Geometry.prototype={computeCentroids:function(){var a,c,d;a=0;for(c=this.faces.length;a<c;a++){d=this.faces[a];d.centroid.set(0,0,0);if(d instanceof THREE.Face3){d.centroid.addSelf(this.vertices[d.a].position);d.centroid.addSelf(this.vertices[d.b].position);d.centroid.addSelf(this.vertices[d.c].position);d.centroid.divideScalar(3)}else if(d instanceof THREE.Face4){d.centroid.addSelf(this.vertices[d.a].position);d.centroid.addSelf(this.vertices[d.b].position);d.centroid.addSelf(this.vertices[d.c].position);
d.centroid.addSelf(this.vertices[d.d].position);d.centroid.divideScalar(4)}}},computeFaceNormals:function(a){var c,d,f,g,h,o,b=new THREE.Vector3,i=new THREE.Vector3;f=0;for(g=this.vertices.length;f<g;f++){h=this.vertices[f];h.normal.set(0,0,0)}f=0;for(g=this.faces.length;f<g;f++){h=this.faces[f];if(a&&h.vertexNormals.length){b.set(0,0,0);c=0;for(d=h.normal.length;c<d;c++)b.addSelf(h.vertexNormals[c]);b.divideScalar(3)}else{c=this.vertices[h.a];d=this.vertices[h.b];o=this.vertices[h.c];b.sub(o.position,
d.position);i.sub(c.position,d.position);b.crossSelf(i)}b.isZero()||b.normalize();h.normal.copy(b)}},computeVertexNormals:function(){var a,c,d,f;if(this.__tmpVertices==undefined){f=this.__tmpVertices=Array(this.vertices.length);a=0;for(c=this.vertices.length;a<c;a++)f[a]=new THREE.Vector3;a=0;for(c=this.faces.length;a<c;a++){d=this.faces[a];if(d instanceof THREE.Face3)d.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];else if(d instanceof THREE.Face4)d.vertexNormals=[new THREE.Vector3,
new THREE.Vector3,new THREE.Vector3,new THREE.Vector3]}}else{f=this.__tmpVertices;a=0;for(c=this.vertices.length;a<c;a++)f[a].set(0,0,0)}a=0;for(c=this.faces.length;a<c;a++){d=this.faces[a];if(d instanceof THREE.Face3){f[d.a].addSelf(d.normal);f[d.b].addSelf(d.normal);f[d.c].addSelf(d.normal)}else if(d instanceof THREE.Face4){f[d.a].addSelf(d.normal);f[d.b].addSelf(d.normal);f[d.c].addSelf(d.normal);f[d.d].addSelf(d.normal)}}a=0;for(c=this.vertices.length;a<c;a++)f[a].normalize();a=0;for(c=this.faces.length;a<
c;a++){d=this.faces[a];if(d instanceof THREE.Face3){d.vertexNormals[0].copy(f[d.a]);d.vertexNormals[1].copy(f[d.b]);d.vertexNormals[2].copy(f[d.c])}else if(d instanceof THREE.Face4){d.vertexNormals[0].copy(f[d.a]);d.vertexNormals[1].copy(f[d.b]);d.vertexNormals[2].copy(f[d.c]);d.vertexNormals[3].copy(f[d.d])}}},computeTangents:function(){function a(s,n,E,A,O,N,G){h=s.vertices[n].position;o=s.vertices[E].position;b=s.vertices[A].position;i=g[O];k=g[N];y=g[G];z=o.x-h.x;u=b.x-h.x;x=o.y-h.y;H=b.y-h.y;
J=o.z-h.z;K=b.z-h.z;p=k.u-i.u;U=y.u-i.u;F=k.v-i.v;e=y.v-i.v;j=1/(p*e-U*F);r.set((e*z-F*u)*j,(e*x-F*H)*j,(e*J-F*K)*j);C.set((p*u-U*z)*j,(p*H-U*x)*j,(p*K-U*J)*j);q[n].addSelf(r);q[E].addSelf(r);q[A].addSelf(r);l[n].addSelf(C);l[E].addSelf(C);l[A].addSelf(C)}var c,d,f,g,h,o,b,i,k,y,z,u,x,H,J,K,p,U,F,e,j,q=[],l=[],r=new THREE.Vector3,C=new THREE.Vector3,m=new THREE.Vector3,t=new THREE.Vector3,v=new THREE.Vector3;c=0;for(d=this.vertices.length;c<d;c++){q[c]=new THREE.Vector3;l[c]=new THREE.Vector3}c=0;
for(d=this.faces.length;c<d;c++){f=this.faces[c];g=this.uvs[c];if(f instanceof THREE.Face3){a(this,f.a,f.b,f.c,0,1,2);this.vertices[f.a].normal.copy(f.vertexNormals[0]);this.vertices[f.b].normal.copy(f.vertexNormals[1]);this.vertices[f.c].normal.copy(f.vertexNormals[2])}else if(f instanceof THREE.Face4){a(this,f.a,f.b,f.c,0,1,2);a(this,f.a,f.b,f.d,0,1,3);this.vertices[f.a].normal.copy(f.vertexNormals[0]);this.vertices[f.b].normal.copy(f.vertexNormals[1]);this.vertices[f.c].normal.copy(f.vertexNormals[2]);
this.vertices[f.d].normal.copy(f.vertexNormals[3])}}c=0;for(d=this.vertices.length;c<d;c++){v.copy(this.vertices[c].normal);f=q[c];m.copy(f);m.subSelf(v.multiplyScalar(v.dot(f))).normalize();t.cross(this.vertices[c].normal,f);f=t.dot(l[c]);f=f<0?-1:1;this.vertices[c].tangent.set(m.x,m.y,m.z,f)}this.hasTangents=true},computeBoundingBox:function(){var a;if(this.vertices.length>0){this.boundingBox={x:[this.vertices[0].position.x,this.vertices[0].position.x],y:[this.vertices[0].position.y,this.vertices[0].position.y],
z:[this.vertices[0].position.z,this.vertices[0].position.z]};for(var c=1,d=this.vertices.length;c<d;c++){a=this.vertices[c];if(a.position.x<this.boundingBox.x[0])this.boundingBox.x[0]=a.position.x;else if(a.position.x>this.boundingBox.x[1])this.boundingBox.x[1]=a.position.x;if(a.position.y<this.boundingBox.y[0])this.boundingBox.y[0]=a.position.y;else if(a.position.y>this.boundingBox.y[1])this.boundingBox.y[1]=a.position.y;if(a.position.z<this.boundingBox.z[0])this.boundingBox.z[0]=a.position.z;else if(a.position.z>
this.boundingBox.z[1])this.boundingBox.z[1]=a.position.z}}},computeBoundingSphere:function(){for(var a=this.boundingSphere===null?0:this.boundingSphere.radius,c=0,d=this.vertices.length;c<d;c++)a=Math.max(a,this.vertices[c].position.length());this.boundingSphere={radius:a}},sortFacesByMaterial:function(){function a(y){var z=[];c=0;for(d=y.length;c<d;c++)y[c]==undefined?z.push("undefined"):z.push(y[c].toString());return z.join("_")}var c,d,f,g,h,o,b,i,k={};f=0;for(g=this.faces.length;f<g;f++){h=this.faces[f];
o=h.materials;b=a(o);if(k[b]==undefined)k[b]={hash:b,counter:0};i=k[b].hash+"_"+k[b].counter;if(this.geometryChunks[i]==undefined)this.geometryChunks[i]={faces:[],materials:o,vertices:0};h=h instanceof THREE.Face3?3:4;if(this.geometryChunks[i].vertices+h>65535){k[b].counter+=1;i=k[b].hash+"_"+k[b].counter;if(this.geometryChunks[i]==undefined)this.geometryChunks[i]={faces:[],materials:o,vertices:0}}this.geometryChunks[i].faces.push(f);this.geometryChunks[i].vertices+=h}},toString:function(){return"THREE.Geometry ( vertices: "+
this.vertices+", faces: "+this.faces+", uvs: "+this.uvs+" )"}};
THREE.Camera=function(a,c,d,f){this.fov=a;this.aspect=c;this.near=d;this.far=f;this.position=new THREE.Vector3;this.target={position:new THREE.Vector3};this.autoUpdateMatrix=true;this.projectionMatrix=null;this.matrix=new THREE.Matrix4;this.up=new THREE.Vector3(0,1,0);this.tmpVec=new THREE.Vector3;this.translateX=function(g){this.tmpVec.sub(this.target.position,this.position).normalize().multiplyScalar(g);this.tmpVec.crossSelf(this.up);this.position.addSelf(this.tmpVec);this.target.position.addSelf(this.tmpVec)};
this.translateZ=function(g){this.tmpVec.sub(this.target.position,this.position).normalize().multiplyScalar(g);this.position.subSelf(this.tmpVec);this.target.position.subSelf(this.tmpVec)};this.updateMatrix=function(){this.matrix.lookAt(this.position,this.target.position,this.up)};this.updateProjectionMatrix=function(){this.projectionMatrix=THREE.Matrix4.makePerspective(this.fov,this.aspect,this.near,this.far)};this.updateProjectionMatrix()};
THREE.Camera.prototype={toString:function(){return"THREE.Camera ( "+this.position+", "+this.target.position+" )"}};THREE.Light=function(a){this.color=new THREE.Color(a)};THREE.AmbientLight=function(a){THREE.Light.call(this,a)};THREE.AmbientLight.prototype=new THREE.Light;THREE.AmbientLight.prototype.constructor=THREE.AmbientLight;THREE.DirectionalLight=function(a,c){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,1,0);this.intensity=c||1};THREE.DirectionalLight.prototype=new THREE.Light;
THREE.DirectionalLight.prototype.constructor=THREE.DirectionalLight;THREE.PointLight=function(a,c){THREE.Light.call(this,a);this.position=new THREE.Vector3;this.intensity=c||1};THREE.DirectionalLight.prototype=new THREE.Light;THREE.DirectionalLight.prototype.constructor=THREE.PointLight;
THREE.Object3D=function(){this.id=THREE.Object3DCounter.value++;this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.scale=new THREE.Vector3(1,1,1);this.matrix=new THREE.Matrix4;this.rotationMatrix=new THREE.Matrix4;this.tmpMatrix=new THREE.Matrix4;this.screen=new THREE.Vector3;this.visible=this.autoUpdateMatrix=true};
THREE.Object3D.prototype={updateMatrix:function(){var a=this.position,c=this.rotation,d=this.scale,f=this.tmpMatrix;this.matrix.setTranslation(a.x,a.y,a.z);this.rotationMatrix.setRotX(c.x);if(c.y!=0){f.setRotY(c.y);this.rotationMatrix.multiplySelf(f)}if(c.z!=0){f.setRotZ(c.z);this.rotationMatrix.multiplySelf(f)}this.matrix.multiplySelf(this.rotationMatrix);if(d.x!=0||d.y!=0||d.z!=0){f.setScale(d.x,d.y,d.z);this.matrix.multiplySelf(f)}}};THREE.Object3DCounter={value:0};
THREE.Particle=function(a){THREE.Object3D.call(this);this.materials=a instanceof Array?a:[a];this.autoUpdateMatrix=false};THREE.Particle.prototype=new THREE.Object3D;THREE.Particle.prototype.constructor=THREE.Particle;THREE.ParticleSystem=function(a,c){THREE.Object3D.call(this);this.geometry=a;this.materials=c instanceof Array?c:[c];this.autoUpdateMatrix=false};THREE.ParticleSystem.prototype=new THREE.Object3D;THREE.ParticleSystem.prototype.constructor=THREE.ParticleSystem;
THREE.Line=function(a,c,d){THREE.Object3D.call(this);this.geometry=a;this.materials=c instanceof Array?c:[c];this.type=d!=undefined?d:THREE.LineStrip};THREE.LineStrip=0;THREE.LinePieces=1;THREE.Line.prototype=new THREE.Object3D;THREE.Line.prototype.constructor=THREE.Line;THREE.Mesh=function(a,c){THREE.Object3D.call(this);this.geometry=a;this.materials=c instanceof Array?c:[c];this.overdraw=this.doubleSided=this.flipSided=false;this.geometry.boundingSphere||this.geometry.computeBoundingSphere()};
THREE.Mesh.prototype=new THREE.Object3D;THREE.Mesh.prototype.constructor=THREE.Mesh;THREE.FlatShading=0;THREE.SmoothShading=1;THREE.NormalBlending=0;THREE.AdditiveBlending=1;THREE.SubtractiveBlending=2;
THREE.LineBasicMaterial=function(a){this.color=new THREE.Color(16777215);this.opacity=1;this.blending=THREE.NormalBlending;this.linewidth=1;this.linejoin=this.linecap="round";if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending;if(a.linewidth!==undefined)this.linewidth=a.linewidth;if(a.linecap!==undefined)this.linecap=a.linecap;if(a.linejoin!==undefined)this.linejoin=a.linejoin}};
THREE.LineBasicMaterial.prototype={toString:function(){return"THREE.LineBasicMaterial (<br/>color: "+this.color+"<br/>opacity: "+this.opacity+"<br/>blending: "+this.blending+"<br/>linewidth: "+this.linewidth+"<br/>linecap: "+this.linecap+"<br/>linejoin: "+this.linejoin+"<br/>)"}};
THREE.MeshBasicMaterial=function(a){this.id=THREE.MeshBasicMaterialCounter.value++;this.color=new THREE.Color(16777215);this.env_map=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refraction_ratio=0.98;this.fog=true;this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.map!==undefined)this.map=
a.map;if(a.env_map!==undefined)this.env_map=a.env_map;if(a.combine!==undefined)this.combine=a.combine;if(a.reflectivity!==undefined)this.reflectivity=a.reflectivity;if(a.refraction_ratio!==undefined)this.refraction_ratio=a.refraction_ratio;if(a.fog!==undefined)this.fog=a.fog;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==
undefined)this.wireframe_linewidth=a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=a.wireframe_linejoin}};
THREE.MeshBasicMaterial.prototype={toString:function(){return"THREE.MeshBasicMaterial (<br/>id: "+this.id+"<br/>color: "+this.color+"<br/>map: "+this.map+"<br/>env_map: "+this.env_map+"<br/>combine: "+this.combine+"<br/>reflectivity: "+this.reflectivity+"<br/>refraction_ratio: "+this.refraction_ratio+"<br/>opacity: "+this.opacity+"<br/>blending: "+this.blending+"<br/>wireframe: "+this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+this.wireframe_linecap+
"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/>)"}};THREE.MeshBasicMaterialCounter={value:0};
THREE.MeshLambertMaterial=function(a){this.id=THREE.MeshLambertMaterialCounter.value++;this.color=new THREE.Color(16777215);this.env_map=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refraction_ratio=0.98;this.fog=true;this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.map!==undefined)this.map=
a.map;if(a.env_map!==undefined)this.env_map=a.env_map;if(a.combine!==undefined)this.combine=a.combine;if(a.reflectivity!==undefined)this.reflectivity=a.reflectivity;if(a.refraction_ratio!==undefined)this.refraction_ratio=a.refraction_ratio;if(a.fog!==undefined)this.fog=a.fog;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==
undefined)this.wireframe_linewidth=a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=a.wireframe_linejoin}};
THREE.MeshLambertMaterial.prototype={toString:function(){return"THREE.MeshLambertMaterial (<br/>id: "+this.id+"<br/>color: "+this.color+"<br/>map: "+this.map+"<br/>env_map: "+this.env_map+"<br/>combine: "+this.combine+"<br/>reflectivity: "+this.reflectivity+"<br/>refraction_ratio: "+this.refraction_ratio+"<br/>opacity: "+this.opacity+"<br/>shading: "+this.shading+"<br/>blending: "+this.blending+"<br/>wireframe: "+this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+
this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/> )"}};THREE.MeshLambertMaterialCounter={value:0};
THREE.MeshPhongMaterial=function(a){this.id=THREE.MeshPhongMaterialCounter.value++;this.color=new THREE.Color(16777215);this.ambient=new THREE.Color(328965);this.specular=new THREE.Color(1118481);this.shininess=30;this.env_map=this.specular_map=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refraction_ratio=0.98;this.fog=true;this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=
this.wireframe_linecap="round";if(a){if(a.color!==undefined)this.color=new THREE.Color(a.color);if(a.ambient!==undefined)this.ambient=new THREE.Color(a.ambient);if(a.specular!==undefined)this.specular=new THREE.Color(a.specular);if(a.shininess!==undefined)this.shininess=a.shininess;if(a.map!==undefined)this.map=a.map;if(a.specular_map!==undefined)this.specular_map=a.specular_map;if(a.env_map!==undefined)this.env_map=a.env_map;if(a.combine!==undefined)this.combine=a.combine;if(a.reflectivity!==undefined)this.reflectivity=
a.reflectivity;if(a.refraction_ratio!==undefined)this.refraction_ratio=a.refraction_ratio;if(a.fog!==undefined)this.fog=a.fog;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==undefined)this.wireframe_linewidth=a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==
undefined)this.wireframe_linejoin=a.wireframe_linejoin}};
THREE.MeshPhongMaterial.prototype={toString:function(){return"THREE.MeshPhongMaterial (<br/>id: "+this.id+"<br/>color: "+this.color+"<br/>ambient: "+this.ambient+"<br/>specular: "+this.specular+"<br/>shininess: "+this.shininess+"<br/>map: "+this.map+"<br/>specular_map: "+this.specular_map+"<br/>env_map: "+this.env_map+"<br/>combine: "+this.combine+"<br/>reflectivity: "+this.reflectivity+"<br/>refraction_ratio: "+this.refraction_ratio+"<br/>opacity: "+this.opacity+"<br/>shading: "+this.shading+"<br/>wireframe: "+
this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/>)"}};THREE.MeshPhongMaterialCounter={value:0};
THREE.MeshDepthMaterial=function(a){this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending}};THREE.MeshDepthMaterial.prototype={toString:function(){return"THREE.MeshDepthMaterial"}};
THREE.MeshNormalMaterial=function(a){this.opacity=1;this.shading=THREE.FlatShading;this.blending=THREE.NormalBlending;if(a){if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending}};THREE.MeshNormalMaterial.prototype={toString:function(){return"THREE.MeshNormalMaterial"}};THREE.MeshFaceMaterial=function(){};THREE.MeshFaceMaterial.prototype={toString:function(){return"THREE.MeshFaceMaterial"}};
THREE.MeshShaderMaterial=function(a){this.id=THREE.MeshShaderMaterialCounter.value++;this.vertex_shader=this.fragment_shader="void main() {}";this.uniforms={};this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){if(a.fragment_shader!==undefined)this.fragment_shader=a.fragment_shader;if(a.vertex_shader!==undefined)this.vertex_shader=a.vertex_shader;if(a.uniforms!==
undefined)this.uniforms=a.uniforms;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==undefined)this.wireframe_linewidth=a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=a.wireframe_linejoin}};
THREE.MeshShaderMaterial.prototype={toString:function(){return"THREE.MeshShaderMaterial (<br/>id: "+this.id+"<br/>blending: "+this.blending+"<br/>wireframe: "+this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/>)"}};THREE.MeshShaderMaterialCounter={value:0};
THREE.ParticleBasicMaterial=function(a){this.color=new THREE.Color(16777215);this.map=null;this.opacity=1;this.blending=THREE.NormalBlending;this.offset=new THREE.Vector2;if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.map!==undefined)this.map=a.map;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending}};
THREE.ParticleBasicMaterial.prototype={toString:function(){return"THREE.ParticleBasicMaterial (<br/>color: "+this.color+"<br/>map: "+this.map+"<br/>opacity: "+this.opacity+"<br/>blending: "+this.blending+"<br/>)"}};THREE.ParticleCircleMaterial=function(a){this.color=new THREE.Color(16777215);this.opacity=1;this.blending=THREE.NormalBlending;if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending}};
THREE.ParticleCircleMaterial.prototype={toString:function(){return"THREE.ParticleCircleMaterial (<br/>color: "+this.color+"<br/>opacity: "+this.opacity+"<br/>blending: "+this.blending+"<br/>)"}};THREE.ParticleDOMMaterial=function(a){this.domElement=a};THREE.ParticleDOMMaterial.prototype={toString:function(){return"THREE.ParticleDOMMaterial ( domElement: "+this.domElement+" )"}};
THREE.Texture=function(a,c,d,f,g,h){this.image=a;this.mapping=c!==undefined?c:new THREE.UVMapping;this.wrap_s=d!==undefined?d:THREE.ClampToEdgeWrapping;this.wrap_t=f!==undefined?f:THREE.ClampToEdgeWrapping;this.mag_filter=g!==undefined?g:THREE.LinearFilter;this.min_filter=h!==undefined?h:THREE.LinearMipMapLinearFilter};
THREE.Texture.prototype={clone:function(){return new THREE.Texture(this.image,this.mapping,this.wrap_s,this.wrap_t,this.mag_filter,this.min_filter)},toString:function(){return"THREE.Texture (<br/>image: "+this.image+"<br/>wrap_s: "+this.wrap_s+"<br/>wrap_t: "+this.wrap_t+"<br/>mag_filter: "+this.mag_filter+"<br/>min_filter: "+this.min_filter+"<br/>)"}};THREE.MultiplyOperation=0;THREE.MixOperation=1;THREE.RepeatWrapping=0;THREE.ClampToEdgeWrapping=1;THREE.MirroredRepeatWrapping=2;
THREE.NearestFilter=3;THREE.NearestMipMapNearestFilter=4;THREE.NearestMipMapLinearFilter=5;THREE.LinearFilter=6;THREE.LinearMipMapNearestFilter=7;THREE.LinearMipMapLinearFilter=8;THREE.ByteType=9;THREE.UnsignedByteType=10;THREE.ShortType=11;THREE.UnsignedShortType=12;THREE.IntType=13;THREE.UnsignedIntType=14;THREE.FloatType=15;THREE.AlphaFormat=16;THREE.RGBFormat=17;THREE.RGBAFormat=18;THREE.LuminanceFormat=19;THREE.LuminanceAlphaFormat=20;
THREE.RenderTarget=function(a,c,d){this.width=a;this.height=c;d=d||{};this.wrap_s=d.wrap_s!==undefined?d.wrap_s:THREE.ClampToEdgeWrapping;this.wrap_t=d.wrap_t!==undefined?d.wrap_t:THREE.ClampToEdgeWrapping;this.mag_filter=d.mag_filter!==undefined?d.mag_filter:THREE.LinearFilter;this.min_filter=d.min_filter!==undefined?d.min_filter:THREE.LinearMipMapLinearFilter;this.format=d.format!==undefined?d.format:THREE.RGBFormat;this.type=d.type!==undefined?d.type:THREE.UnsignedByteType};
var Uniforms={clone:function(a){var c,d,f,g={};for(c in a){g[c]={};for(d in a[c]){f=a[c][d];g[c][d]=f instanceof THREE.Color||f instanceof THREE.Vector3||f instanceof THREE.Texture?f.clone():f}}return g},merge:function(a){var c,d,f,g={};for(c=0;c<a.length;c++){f=this.clone(a[c]);for(d in f)g[d]=f[d]}return g}};THREE.CubeReflectionMapping=function(){};THREE.CubeRefractionMapping=function(){};THREE.LatitudeReflectionMapping=function(){};THREE.LatitudeRefractionMapping=function(){};
THREE.SphericalReflectionMapping=function(){};THREE.SphericalRefractionMapping=function(){};THREE.UVMapping=function(){};
THREE.Scene=function(){this.objects=[];this.lights=[];this.fog=null;this.addObject=function(a){this.objects.indexOf(a)===-1&&this.objects.push(a)};this.removeObject=function(a){a=this.objects.indexOf(a);a!==-1&&this.objects.splice(a,1)};this.addLight=function(a){this.lights.indexOf(a)===-1&&this.lights.push(a)};this.removeLight=function(a){a=this.lights.indexOf(a);a!==-1&&this.lights.splice(a,1)};this.toString=function(){return"THREE.Scene ( "+this.objects+" )"}};
THREE.Fog=function(a,c,d){this.color=new THREE.Color(a);this.near=c||1;this.far=d||1E3};THREE.FogExp2=function(a,c){this.color=new THREE.Color(a);this.density=c||2.5E-4};
THREE.Projector=function(){function a(l,r){return r.z-l.z}function c(l,r){var C=0,m=1,t=l.z+l.w,v=r.z+r.w,s=-l.z+l.w,n=-r.z+r.w;if(t>=0&&v>=0&&s>=0&&n>=0)return true;else if(t<0&&v<0||s<0&&n<0)return false;else{if(t<0)C=Math.max(C,t/(t-v));else if(v<0)m=Math.min(m,t/(t-v));if(s<0)C=Math.max(C,s/(s-n));else if(n<0)m=Math.min(m,s/(s-n));if(m<C)return false;else{l.lerpSelf(r,C);r.lerpSelf(l,1-m);return true}}}var d,f,g=[],h,o,b,i=[],k,y,z=[],u,x,H=[],J=new THREE.Vector4,K=new THREE.Vector4,p=new THREE.Matrix4,
U=new THREE.Matrix4,F=[],e=new THREE.Vector4,j=new THREE.Vector4,q;this.projectObjects=function(l,r,C){var m=[],t,v;f=0;p.multiply(r.projectionMatrix,r.matrix);F[0]=new THREE.Vector4(p.n41-p.n11,p.n42-p.n12,p.n43-p.n13,p.n44-p.n14);F[1]=new THREE.Vector4(p.n41+p.n11,p.n42+p.n12,p.n43+p.n13,p.n44+p.n14);F[2]=new THREE.Vector4(p.n41+p.n21,p.n42+p.n22,p.n43+p.n23,p.n44+p.n24);F[3]=new THREE.Vector4(p.n41-p.n21,p.n42-p.n22,p.n43-p.n23,p.n44-p.n24);F[4]=new THREE.Vector4(p.n41-p.n31,p.n42-p.n32,p.n43-
p.n33,p.n44-p.n34);F[5]=new THREE.Vector4(p.n41+p.n31,p.n42+p.n32,p.n43+p.n33,p.n44+p.n34);r=0;for(t=F.length;r<t;r++){v=F[r];v.divideScalar(Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z))}t=l.objects;l=0;for(r=t.length;l<r;l++){v=t[l];var s;if(!(s=!v.visible)){if(s=v instanceof THREE.Mesh){a:{s=void 0;for(var n=v.position,E=-v.geometry.boundingSphere.radius*Math.max(v.scale.x,Math.max(v.scale.y,v.scale.z)),A=0;A<6;A++){s=F[A].x*n.x+F[A].y*n.y+F[A].z*n.z+F[A].w;if(s<=E){s=false;break a}}s=true}s=!s}s=s}if(!s){d=
g[f]=g[f]||new THREE.RenderableObject;J.copy(v.position);p.multiplyVector3(J);d.object=v;d.z=J.z;m.push(d);f++}}C&&m.sort(a);return m};this.projectScene=function(l,r,C){var m=[],t=r.near,v=r.far,s,n,E,A,O,N,G,W,P,I,L,V,S,w,M,Q;b=y=x=0;r.autoUpdateMatrix&&r.updateMatrix();p.multiply(r.projectionMatrix,r.matrix);N=this.projectObjects(l,r,true);l=0;for(s=N.length;l<s;l++){G=N[l].object;if(G.visible){G.autoUpdateMatrix&&G.updateMatrix();W=G.matrix;P=G.rotationMatrix;I=G.materials;L=G.overdraw;if(G instanceof
THREE.Mesh){V=G.geometry;S=V.vertices;n=0;for(E=S.length;n<E;n++){w=S[n];w.positionWorld.copy(w.position);W.multiplyVector3(w.positionWorld);A=w.positionScreen;A.copy(w.positionWorld);p.multiplyVector4(A);A.x/=A.w;A.y/=A.w;w.__visible=A.z>t&&A.z<v}V=V.faces;n=0;for(E=V.length;n<E;n++){w=V[n];if(w instanceof THREE.Face3){A=S[w.a];O=S[w.b];M=S[w.c];if(A.__visible&&O.__visible&&M.__visible)if(G.doubleSided||G.flipSided!=(M.positionScreen.x-A.positionScreen.x)*(O.positionScreen.y-A.positionScreen.y)-
(M.positionScreen.y-A.positionScreen.y)*(O.positionScreen.x-A.positionScreen.x)<0){h=i[b]=i[b]||new THREE.RenderableFace3;h.v1.positionWorld.copy(A.positionWorld);h.v2.positionWorld.copy(O.positionWorld);h.v3.positionWorld.copy(M.positionWorld);h.v1.positionScreen.copy(A.positionScreen);h.v2.positionScreen.copy(O.positionScreen);h.v3.positionScreen.copy(M.positionScreen);h.normalWorld.copy(w.normal);P.multiplyVector3(h.normalWorld);h.centroidWorld.copy(w.centroid);W.multiplyVector3(h.centroidWorld);
h.centroidScreen.copy(h.centroidWorld);p.multiplyVector3(h.centroidScreen);M=w.vertexNormals;q=h.vertexNormalsWorld;A=0;for(O=M.length;A<O;A++){Q=q[A]=q[A]||new THREE.Vector3;Q.copy(M[A]);P.multiplyVector3(Q)}h.z=h.centroidScreen.z;h.meshMaterials=I;h.faceMaterials=w.materials;h.overdraw=L;if(G.geometry.uvs[n]){h.uvs[0]=G.geometry.uvs[n][0];h.uvs[1]=G.geometry.uvs[n][1];h.uvs[2]=G.geometry.uvs[n][2]}m.push(h);b++}}else if(w instanceof THREE.Face4){A=S[w.a];O=S[w.b];M=S[w.c];Q=S[w.d];if(A.__visible&&
O.__visible&&M.__visible&&Q.__visible)if(G.doubleSided||G.flipSided!=((Q.positionScreen.x-A.positionScreen.x)*(O.positionScreen.y-A.positionScreen.y)-(Q.positionScreen.y-A.positionScreen.y)*(O.positionScreen.x-A.positionScreen.x)<0||(O.positionScreen.x-M.positionScreen.x)*(Q.positionScreen.y-M.positionScreen.y)-(O.positionScreen.y-M.positionScreen.y)*(Q.positionScreen.x-M.positionScreen.x)<0)){h=i[b]=i[b]||new THREE.RenderableFace3;h.v1.positionWorld.copy(A.positionWorld);h.v2.positionWorld.copy(O.positionWorld);
h.v3.positionWorld.copy(Q.positionWorld);h.v1.positionScreen.copy(A.positionScreen);h.v2.positionScreen.copy(O.positionScreen);h.v3.positionScreen.copy(Q.positionScreen);h.normalWorld.copy(w.normal);P.multiplyVector3(h.normalWorld);h.centroidWorld.copy(w.centroid);W.multiplyVector3(h.centroidWorld);h.centroidScreen.copy(h.centroidWorld);p.multiplyVector3(h.centroidScreen);h.z=h.centroidScreen.z;h.meshMaterials=I;h.faceMaterials=w.materials;h.overdraw=L;if(G.geometry.uvs[n]){h.uvs[0]=G.geometry.uvs[n][0];
h.uvs[1]=G.geometry.uvs[n][1];h.uvs[2]=G.geometry.uvs[n][3]}m.push(h);b++;o=i[b]=i[b]||new THREE.RenderableFace3;o.v1.positionWorld.copy(O.positionWorld);o.v2.positionWorld.copy(M.positionWorld);o.v3.positionWorld.copy(Q.positionWorld);o.v1.positionScreen.copy(O.positionScreen);o.v2.positionScreen.copy(M.positionScreen);o.v3.positionScreen.copy(Q.positionScreen);o.normalWorld.copy(h.normalWorld);o.centroidWorld.copy(h.centroidWorld);o.centroidScreen.copy(h.centroidScreen);o.z=o.centroidScreen.z;o.meshMaterials=
I;o.faceMaterials=w.materials;o.overdraw=L;if(G.geometry.uvs[n]){o.uvs[0]=G.geometry.uvs[n][1];o.uvs[1]=G.geometry.uvs[n][2];o.uvs[2]=G.geometry.uvs[n][3]}m.push(o);b++}}}}else if(G instanceof THREE.Line){U.multiply(p,W);S=G.geometry.vertices;w=S[0];w.positionScreen.copy(w.position);U.multiplyVector4(w.positionScreen);n=1;for(E=S.length;n<E;n++){A=S[n];A.positionScreen.copy(A.position);U.multiplyVector4(A.positionScreen);O=S[n-1];e.copy(A.positionScreen);j.copy(O.positionScreen);if(c(e,j)){e.multiplyScalar(1/
e.w);j.multiplyScalar(1/j.w);k=z[y]=z[y]||new THREE.RenderableLine;k.v1.positionScreen.copy(e);k.v2.positionScreen.copy(j);k.z=Math.max(e.z,j.z);k.materials=G.materials;m.push(k);y++}}}else if(G instanceof THREE.Particle){K.set(G.position.x,G.position.y,G.position.z,1);p.multiplyVector4(K);K.z/=K.w;if(K.z>0&&K.z<1){u=H[x]=H[x]||new THREE.RenderableParticle;u.x=K.x/K.w;u.y=K.y/K.w;u.z=K.z;u.rotation=G.rotation.z;u.scale.x=G.scale.x*Math.abs(u.x-(K.x+r.projectionMatrix.n11)/(K.w+r.projectionMatrix.n14));
u.scale.y=G.scale.y*Math.abs(u.y-(K.y+r.projectionMatrix.n22)/(K.w+r.projectionMatrix.n24));u.materials=G.materials;m.push(u);x++}}}}C&&m.sort(a);return m};this.unprojectVector=function(l,r){var C=new THREE.Matrix4;C.multiply(THREE.Matrix4.makeInvert(r.matrix),THREE.Matrix4.makeInvert(r.projectionMatrix));C.multiplyVector3(l);return l}};
THREE.DOMRenderer=function(){THREE.Renderer.call(this);var a=null,c=new THREE.Projector,d,f,g,h;this.domElement=document.createElement("div");this.setSize=function(o,b){d=o;f=b;g=d/2;h=f/2};this.render=function(o,b){var i,k,y,z,u,x,H,J;a=c.projectScene(o,b);i=0;for(k=a.length;i<k;i++){u=a[i];if(u instanceof THREE.RenderableParticle){H=u.x*g+g;J=u.y*h+h;y=0;for(z=u.material.length;y<z;y++){x=u.material[y];if(x instanceof THREE.ParticleDOMMaterial){x=x.domElement;x.style.left=H+"px";x.style.top=J+"px"}}}}}};
THREE.CanvasRenderer=function(){function a(da){if(u!=da)k.globalAlpha=u=da}function c(da){if(x!=da){switch(da){case THREE.NormalBlending:k.globalCompositeOperation="source-over";break;case THREE.AdditiveBlending:k.globalCompositeOperation="lighter";break;case THREE.SubtractiveBlending:k.globalCompositeOperation="darker"}x=da}}var d=null,f=new THREE.Projector,g=document.createElement("canvas"),h,o,b,i,k=g.getContext("2d"),y=null,z=null,u=1,x=0,H=null,J=null,K=1,p,U,F,e,j,q,l,r,C,m=new THREE.Color,
t=new THREE.Color,v=new THREE.Color,s=new THREE.Color,n=new THREE.Color,E,A,O,N,G,W,P,I,L,V=new THREE.Rectangle,S=new THREE.Rectangle,w=new THREE.Rectangle,M=false,Q=new THREE.Color,ea=new THREE.Color,ba=new THREE.Color,Z=new THREE.Color,ja=Math.PI*2,Y=new THREE.Vector3,qa,ka,fa,ha,sa,ua,va=16;qa=document.createElement("canvas");qa.width=qa.height=2;ka=qa.getContext("2d");ka.fillStyle="rgba(0,0,0,1)";ka.fillRect(0,0,2,2);fa=ka.getImageData(0,0,2,2);ha=fa.data;sa=document.createElement("canvas");sa.width=
sa.height=va;ua=sa.getContext("2d");ua.translate(-va/2,-va/2);ua.scale(va,va);va--;this.domElement=g;this.sortElements=this.sortObjects=this.autoClear=true;this.setSize=function(da,ra){h=da;o=ra;b=h/2;i=o/2;g.width=h;g.height=o;V.set(-b,-i,b,i);u=1;x=0;J=H=null;K=1};this.setClearColor=function(da,ra){y=da!==null?new THREE.Color(da):null;z=ra;S.set(-b,-i,b,i);k.setTransform(1,0,0,-1,b,i);this.clear()};this.clear=function(){if(!S.isEmpty()){S.inflate(1);S.minSelf(V);if(y!==null){c(THREE.NormalBlending);
a(1);k.fillStyle="rgba("+Math.floor(y.r*255)+","+Math.floor(y.g*255)+","+Math.floor(y.b*255)+","+z+")";k.fillRect(S.getX(),S.getY(),S.getWidth(),S.getHeight())}else k.clearRect(S.getX(),S.getY(),S.getWidth(),S.getHeight());S.empty()}};this.render=function(da,ra){function Ma(B){var X,T,D,R=B.lights;ea.setRGB(0,0,0);ba.setRGB(0,0,0);Z.setRGB(0,0,0);B=0;for(X=R.length;B<X;B++){T=R[B];D=T.color;if(T instanceof THREE.AmbientLight){ea.r+=D.r;ea.g+=D.g;ea.b+=D.b}else if(T instanceof THREE.DirectionalLight){ba.r+=
D.r;ba.g+=D.g;ba.b+=D.b}else if(T instanceof THREE.PointLight){Z.r+=D.r;Z.g+=D.g;Z.b+=D.b}}}function Aa(B,X,T,D){var R,$,ca,ga,ia=B.lights;B=0;for(R=ia.length;B<R;B++){$=ia[B];ca=$.color;ga=$.intensity;if($ instanceof THREE.DirectionalLight){$=T.dot($.position)*ga;if($>0){D.r+=ca.r*$;D.g+=ca.g*$;D.b+=ca.b*$}}else if($ instanceof THREE.PointLight){Y.sub($.position,X);Y.normalize();$=T.dot(Y)*ga;if($>0){D.r+=ca.r*$;D.g+=ca.g*$;D.b+=ca.b*$}}}}function Na(B,X,T){if(T.opacity!=0){a(T.opacity);c(T.blending);
var D,R,$,ca,ga,ia;if(T instanceof THREE.ParticleBasicMaterial){if(T.map){ca=T.map;ga=ca.width>>1;ia=ca.height>>1;R=X.scale.x*b;$=X.scale.y*i;T=R*ga;D=$*ia;w.set(B.x-T,B.y-D,B.x+T,B.y+D);if(V.instersects(w)){k.save();k.translate(B.x,B.y);k.rotate(-X.rotation);k.scale(R,-$);k.translate(-ga,-ia);k.drawImage(ca,0,0);k.restore()}}}else if(T instanceof THREE.ParticleCircleMaterial){if(M){Q.r=ea.r+ba.r+Z.r;Q.g=ea.g+ba.g+Z.g;Q.b=ea.b+ba.b+Z.b;m.r=T.color.r*Q.r;m.g=T.color.g*Q.g;m.b=T.color.b*Q.b;m.updateStyleString()}else m.__styleString=
T.color.__styleString;T=X.scale.x*b;D=X.scale.y*i;w.set(B.x-T,B.y-D,B.x+T,B.y+D);if(V.instersects(w)){R=m.__styleString;if(J!=R)k.fillStyle=J=R;k.save();k.translate(B.x,B.y);k.rotate(-X.rotation);k.scale(T,D);k.beginPath();k.arc(0,0,1,0,ja,true);k.closePath();k.fill();k.restore()}}}}function Oa(B,X,T,D){if(D.opacity!=0){a(D.opacity);c(D.blending);k.beginPath();k.moveTo(B.positionScreen.x,B.positionScreen.y);k.lineTo(X.positionScreen.x,X.positionScreen.y);k.closePath();if(D instanceof THREE.LineBasicMaterial){m.__styleString=
D.color.__styleString;B=D.linewidth;if(K!=B)k.lineWidth=K=B;B=m.__styleString;if(H!=B)k.strokeStyle=H=B;k.stroke();w.inflate(D.linewidth*2)}}}function Ia(B,X,T,D,R,$){if(R.opacity!=0){a(R.opacity);c(R.blending);e=B.positionScreen.x;j=B.positionScreen.y;q=X.positionScreen.x;l=X.positionScreen.y;r=T.positionScreen.x;C=T.positionScreen.y;k.beginPath();k.moveTo(e,j);k.lineTo(q,l);k.lineTo(r,C);k.lineTo(e,j);k.closePath();if(R instanceof THREE.MeshBasicMaterial)if(R.map)R.map.image.loaded&&R.map.mapping instanceof
THREE.UVMapping&&xa(e,j,q,l,r,C,R.map.image,D.uvs[0].u,D.uvs[0].v,D.uvs[1].u,D.uvs[1].v,D.uvs[2].u,D.uvs[2].v);else if(R.env_map){if(R.env_map.image.loaded)if(R.env_map.mapping instanceof THREE.SphericalReflectionMapping){B=ra.matrix;Y.copy(D.vertexNormalsWorld[0]);N=(Y.x*B.n11+Y.y*B.n12+Y.z*B.n13)*0.5+0.5;G=-(Y.x*B.n21+Y.y*B.n22+Y.z*B.n23)*0.5+0.5;Y.copy(D.vertexNormalsWorld[1]);W=(Y.x*B.n11+Y.y*B.n12+Y.z*B.n13)*0.5+0.5;P=-(Y.x*B.n21+Y.y*B.n22+Y.z*B.n23)*0.5+0.5;Y.copy(D.vertexNormalsWorld[2]);I=
(Y.x*B.n11+Y.y*B.n12+Y.z*B.n13)*0.5+0.5;L=-(Y.x*B.n21+Y.y*B.n22+Y.z*B.n23)*0.5+0.5;xa(e,j,q,l,r,C,R.env_map.image,N,G,W,P,I,L)}}else R.wireframe?Ba(R.color.__styleString,R.wireframe_linewidth):Ca(R.color.__styleString);else if(R instanceof THREE.MeshLambertMaterial){if(R.map&&!R.wireframe){R.map.mapping instanceof THREE.UVMapping&&xa(e,j,q,l,r,C,R.map.image,D.uvs[0].u,D.uvs[0].v,D.uvs[1].u,D.uvs[1].v,D.uvs[2].u,D.uvs[2].v);c(THREE.SubtractiveBlending)}if(M)if(!R.wireframe&&R.shading==THREE.SmoothShading&&
D.vertexNormalsWorld.length==3){t.r=v.r=s.r=ea.r;t.g=v.g=s.g=ea.g;t.b=v.b=s.b=ea.b;Aa($,D.v1.positionWorld,D.vertexNormalsWorld[0],t);Aa($,D.v2.positionWorld,D.vertexNormalsWorld[1],v);Aa($,D.v3.positionWorld,D.vertexNormalsWorld[2],s);n.r=(v.r+s.r)*0.5;n.g=(v.g+s.g)*0.5;n.b=(v.b+s.b)*0.5;O=Ja(t,v,s,n);xa(e,j,q,l,r,C,O,0,0,1,0,0,1)}else{Q.r=ea.r;Q.g=ea.g;Q.b=ea.b;Aa($,D.centroidWorld,D.normalWorld,Q);m.r=R.color.r*Q.r;m.g=R.color.g*Q.g;m.b=R.color.b*Q.b;m.updateStyleString();R.wireframe?Ba(m.__styleString,
R.wireframe_linewidth):Ca(m.__styleString)}else R.wireframe?Ba(R.color.__styleString,R.wireframe_linewidth):Ca(R.color.__styleString)}else if(R instanceof THREE.MeshDepthMaterial){E=ra.near;A=ra.far;t.r=t.g=t.b=1-Ea(B.positionScreen.z,E,A);v.r=v.g=v.b=1-Ea(X.positionScreen.z,E,A);s.r=s.g=s.b=1-Ea(T.positionScreen.z,E,A);n.r=(v.r+s.r)*0.5;n.g=(v.g+s.g)*0.5;n.b=(v.b+s.b)*0.5;O=Ja(t,v,s,n);xa(e,j,q,l,r,C,O,0,0,1,0,0,1)}else if(R instanceof THREE.MeshNormalMaterial){m.r=Fa(D.normalWorld.x);m.g=Fa(D.normalWorld.y);
m.b=Fa(D.normalWorld.z);m.updateStyleString();R.wireframe?Ba(m.__styleString,R.wireframe_linewidth):Ca(m.__styleString)}}}function Ba(B,X){if(H!=B)k.strokeStyle=H=B;if(K!=X)k.lineWidth=K=X;k.stroke();w.inflate(X*2)}function Ca(B){if(J!=B)k.fillStyle=J=B;k.fill()}function xa(B,X,T,D,R,$,ca,ga,ia,na,la,oa,ya){var ta,pa;ta=ca.width-1;pa=ca.height-1;ga*=ta;ia*=pa;na*=ta;la*=pa;oa*=ta;ya*=pa;T-=B;D-=X;R-=B;$-=X;na-=ga;la-=ia;oa-=ga;ya-=ia;pa=1/(na*ya-oa*la);ta=(ya*T-la*R)*pa;la=(ya*D-la*$)*pa;T=(na*R-
oa*T)*pa;D=(na*$-oa*D)*pa;B=B-ta*ga-T*ia;X=X-la*ga-D*ia;k.save();k.transform(ta,la,T,D,B,X);k.clip();k.drawImage(ca,0,0);k.restore()}function Ja(B,X,T,D){var R=~~(B.r*255),$=~~(B.g*255);B=~~(B.b*255);var ca=~~(X.r*255),ga=~~(X.g*255);X=~~(X.b*255);var ia=~~(T.r*255),na=~~(T.g*255);T=~~(T.b*255);var la=~~(D.r*255),oa=~~(D.g*255);D=~~(D.b*255);ha[0]=R<0?0:R>255?255:R;ha[1]=$<0?0:$>255?255:$;ha[2]=B<0?0:B>255?255:B;ha[4]=ca<0?0:ca>255?255:ca;ha[5]=ga<0?0:ga>255?255:ga;ha[6]=X<0?0:X>255?255:X;ha[8]=ia<
0?0:ia>255?255:ia;ha[9]=na<0?0:na>255?255:na;ha[10]=T<0?0:T>255?255:T;ha[12]=la<0?0:la>255?255:la;ha[13]=oa<0?0:oa>255?255:oa;ha[14]=D<0?0:D>255?255:D;ka.putImageData(fa,0,0);ua.drawImage(qa,0,0);return sa}function Ea(B,X,T){B=(B-X)/(T-X);return B*B*(3-2*B)}function Fa(B){B=(B+1)*0.5;return B<0?0:B>1?1:B}function Ga(B,X){var T=X.x-B.x,D=X.y-B.y,R=1/Math.sqrt(T*T+D*D);T*=R;D*=R;X.x+=T;X.y+=D;B.x-=T;B.y-=D}var Da,Ka,aa,ma,wa,Ha,La,za;k.setTransform(1,0,0,-1,b,i);this.autoClear&&this.clear();d=f.projectScene(da,
ra,this.sortElements);(M=da.lights.length>0)&&Ma(da);Da=0;for(Ka=d.length;Da<Ka;Da++){aa=d[Da];w.empty();if(aa instanceof THREE.RenderableParticle){p=aa;p.x*=b;p.y*=i;ma=0;for(wa=aa.materials.length;ma<wa;ma++)Na(p,aa,aa.materials[ma],da)}else if(aa instanceof THREE.RenderableLine){p=aa.v1;U=aa.v2;p.positionScreen.x*=b;p.positionScreen.y*=i;U.positionScreen.x*=b;U.positionScreen.y*=i;w.addPoint(p.positionScreen.x,p.positionScreen.y);w.addPoint(U.positionScreen.x,U.positionScreen.y);if(V.instersects(w)){ma=
0;for(wa=aa.materials.length;ma<wa;)Oa(p,U,aa,aa.materials[ma++],da)}}else if(aa instanceof THREE.RenderableFace3){p=aa.v1;U=aa.v2;F=aa.v3;p.positionScreen.x*=b;p.positionScreen.y*=i;U.positionScreen.x*=b;U.positionScreen.y*=i;F.positionScreen.x*=b;F.positionScreen.y*=i;if(aa.overdraw){Ga(p.positionScreen,U.positionScreen);Ga(U.positionScreen,F.positionScreen);Ga(F.positionScreen,p.positionScreen)}w.add3Points(p.positionScreen.x,p.positionScreen.y,U.positionScreen.x,U.positionScreen.y,F.positionScreen.x,
F.positionScreen.y);if(V.instersects(w)){ma=0;for(wa=aa.meshMaterials.length;ma<wa;){za=aa.meshMaterials[ma++];if(za instanceof THREE.MeshFaceMaterial){Ha=0;for(La=aa.faceMaterials.length;Ha<La;)(za=aa.faceMaterials[Ha++])&&Ia(p,U,F,aa,za,da)}else Ia(p,U,F,aa,za,da)}}}S.addRectangle(w)}k.setTransform(1,0,0,1,0,0)}};
THREE.SVGRenderer=function(){function a(N,G,W){var P,I,L,V;P=0;for(I=N.lights.length;P<I;P++){L=N.lights[P];if(L instanceof THREE.DirectionalLight){V=G.normalWorld.dot(L.position)*L.intensity;if(V>0){W.r+=L.color.r*V;W.g+=L.color.g*V;W.b+=L.color.b*V}}else if(L instanceof THREE.PointLight){C.sub(L.position,G.centroidWorld);C.normalize();V=G.normalWorld.dot(C)*L.intensity;if(V>0){W.r+=L.color.r*V;W.g+=L.color.g*V;W.b+=L.color.b*V}}}}function c(N,G,W,P,I,L){s=f(n++);s.setAttribute("d","M "+N.positionScreen.x+
" "+N.positionScreen.y+" L "+G.positionScreen.x+" "+G.positionScreen.y+" L "+W.positionScreen.x+","+W.positionScreen.y+"z");if(I instanceof THREE.MeshBasicMaterial)F.__styleString=I.color.__styleString;else if(I instanceof THREE.MeshLambertMaterial)if(U){e.r=j.r;e.g=j.g;e.b=j.b;a(L,P,e);F.r=I.color.r*e.r;F.g=I.color.g*e.g;F.b=I.color.b*e.b;F.updateStyleString()}else F.__styleString=I.color.__styleString;else if(I instanceof THREE.MeshDepthMaterial){r=1-I.__2near/(I.__farPlusNear-P.z*I.__farMinusNear);
F.setRGB(r,r,r)}else I instanceof THREE.MeshNormalMaterial&&F.setRGB(g(P.normalWorld.x),g(P.normalWorld.y),g(P.normalWorld.z));I.wireframe?s.setAttribute("style","fill: none; stroke: "+F.__styleString+"; stroke-width: "+I.wireframe_linewidth+"; stroke-opacity: "+I.opacity+"; stroke-linecap: "+I.wireframe_linecap+"; stroke-linejoin: "+I.wireframe_linejoin):s.setAttribute("style","fill: "+F.__styleString+"; fill-opacity: "+I.opacity);b.appendChild(s)}function d(N,G,W,P,I,L,V){s=f(n++);s.setAttribute("d",
"M "+N.positionScreen.x+" "+N.positionScreen.y+" L "+G.positionScreen.x+" "+G.positionScreen.y+" L "+W.positionScreen.x+","+W.positionScreen.y+" L "+P.positionScreen.x+","+P.positionScreen.y+"z");if(L instanceof THREE.MeshBasicMaterial)F.__styleString=L.color.__styleString;else if(L instanceof THREE.MeshLambertMaterial)if(U){e.r=j.r;e.g=j.g;e.b=j.b;a(V,I,e);F.r=L.color.r*e.r;F.g=L.color.g*e.g;F.b=L.color.b*e.b;F.updateStyleString()}else F.__styleString=L.color.__styleString;else if(L instanceof THREE.MeshDepthMaterial){r=
1-L.__2near/(L.__farPlusNear-I.z*L.__farMinusNear);F.setRGB(r,r,r)}else L instanceof THREE.MeshNormalMaterial&&F.setRGB(g(I.normalWorld.x),g(I.normalWorld.y),g(I.normalWorld.z));L.wireframe?s.setAttribute("style","fill: none; stroke: "+F.__styleString+"; stroke-width: "+L.wireframe_linewidth+"; stroke-opacity: "+L.opacity+"; stroke-linecap: "+L.wireframe_linecap+"; stroke-linejoin: "+L.wireframe_linejoin):s.setAttribute("style","fill: "+F.__styleString+"; fill-opacity: "+L.opacity);b.appendChild(s)}
function f(N){if(m[N]==null){m[N]=document.createElementNS("http://www.w3.org/2000/svg","path");O==0&&m[N].setAttribute("shape-rendering","crispEdges");return m[N]}return m[N]}function g(N){return N<0?Math.min((1+N)*0.5,0.5):0.5+Math.min(N*0.5,0.5)}var h=null,o=new THREE.Projector,b=document.createElementNS("http://www.w3.org/2000/svg","svg"),i,k,y,z,u,x,H,J,K=new THREE.Rectangle,p=new THREE.Rectangle,U=false,F=new THREE.Color(16777215),e=new THREE.Color(16777215),j=new THREE.Color(0),q=new THREE.Color(0),
l=new THREE.Color(0),r,C=new THREE.Vector3,m=[],t=[],v=[],s,n,E,A,O=1;this.domElement=b;this.sortElements=this.sortObjects=this.autoClear=true;this.setQuality=function(N){switch(N){case "high":O=1;break;case "low":O=0}};this.setSize=function(N,G){i=N;k=G;y=i/2;z=k/2;b.setAttribute("viewBox",-y+" "+-z+" "+i+" "+k);b.setAttribute("width",i);b.setAttribute("height",k);K.set(-y,-z,y,z)};this.clear=function(){for(;b.childNodes.length>0;)b.removeChild(b.childNodes[0])};this.render=function(N,G){var W,P,
I,L,V,S,w,M;this.autoClear&&this.clear();h=o.projectScene(N,G,this.sortElements);A=E=n=0;if(U=N.lights.length>0){w=N.lights;j.setRGB(0,0,0);q.setRGB(0,0,0);l.setRGB(0,0,0);W=0;for(P=w.length;W<P;W++){I=w[W];L=I.color;if(I instanceof THREE.AmbientLight){j.r+=L.r;j.g+=L.g;j.b+=L.b}else if(I instanceof THREE.DirectionalLight){q.r+=L.r;q.g+=L.g;q.b+=L.b}else if(I instanceof THREE.PointLight){l.r+=L.r;l.g+=L.g;l.b+=L.b}}}W=0;for(P=h.length;W<P;W++){w=h[W];p.empty();if(w instanceof THREE.RenderableParticle){u=
w;u.x*=y;u.y*=-z;I=0;for(L=w.materials.length;I<L;I++)if(M=w.materials[I]){V=u;S=w;M=M;var Q=E++;if(t[Q]==null){t[Q]=document.createElementNS("http://www.w3.org/2000/svg","circle");O==0&&t[Q].setAttribute("shape-rendering","crispEdges")}s=t[Q];s.setAttribute("cx",V.x);s.setAttribute("cy",V.y);s.setAttribute("r",S.scale.x*y);if(M instanceof THREE.ParticleCircleMaterial){if(U){e.r=j.r+q.r+l.r;e.g=j.g+q.g+l.g;e.b=j.b+q.b+l.b;F.r=M.color.r*e.r;F.g=M.color.g*e.g;F.b=M.color.b*e.b;F.updateStyleString()}else F=
M.color;s.setAttribute("style","fill: "+F.__styleString)}b.appendChild(s)}}else if(w instanceof THREE.RenderableLine){u=w.v1;x=w.v2;u.positionScreen.x*=y;u.positionScreen.y*=-z;x.positionScreen.x*=y;x.positionScreen.y*=-z;p.addPoint(u.positionScreen.x,u.positionScreen.y);p.addPoint(x.positionScreen.x,x.positionScreen.y);if(K.instersects(p)){I=0;for(L=w.materials.length;I<L;)if(M=w.materials[I++]){V=u;S=x;M=M;Q=A++;if(v[Q]==null){v[Q]=document.createElementNS("http://www.w3.org/2000/svg","line");O==
0&&v[Q].setAttribute("shape-rendering","crispEdges")}s=v[Q];s.setAttribute("x1",V.positionScreen.x);s.setAttribute("y1",V.positionScreen.y);s.setAttribute("x2",S.positionScreen.x);s.setAttribute("y2",S.positionScreen.y);if(M instanceof THREE.LineBasicMaterial){F.__styleString=M.color.__styleString;s.setAttribute("style","fill: none; stroke: "+F.__styleString+"; stroke-width: "+M.linewidth+"; stroke-opacity: "+M.opacity+"; stroke-linecap: "+M.linecap+"; stroke-linejoin: "+M.linejoin);b.appendChild(s)}}}}else if(w instanceof
THREE.RenderableFace3){u=w.v1;x=w.v2;H=w.v3;u.positionScreen.x*=y;u.positionScreen.y*=-z;x.positionScreen.x*=y;x.positionScreen.y*=-z;H.positionScreen.x*=y;H.positionScreen.y*=-z;p.addPoint(u.positionScreen.x,u.positionScreen.y);p.addPoint(x.positionScreen.x,x.positionScreen.y);p.addPoint(H.positionScreen.x,H.positionScreen.y);if(K.instersects(p)){I=0;for(L=w.meshMaterials.length;I<L;){M=w.meshMaterials[I++];if(M instanceof THREE.MeshFaceMaterial){V=0;for(S=w.faceMaterials.length;V<S;)(M=w.faceMaterials[V++])&&
c(u,x,H,w,M,N)}else M&&c(u,x,H,w,M,N)}}}else if(w instanceof THREE.RenderableFace4){u=w.v1;x=w.v2;H=w.v3;J=w.v4;u.positionScreen.x*=y;u.positionScreen.y*=-z;x.positionScreen.x*=y;x.positionScreen.y*=-z;H.positionScreen.x*=y;H.positionScreen.y*=-z;J.positionScreen.x*=y;J.positionScreen.y*=-z;p.addPoint(u.positionScreen.x,u.positionScreen.y);p.addPoint(x.positionScreen.x,x.positionScreen.y);p.addPoint(H.positionScreen.x,H.positionScreen.y);p.addPoint(J.positionScreen.x,J.positionScreen.y);if(K.instersects(p)){I=
0;for(L=w.meshMaterials.length;I<L;){M=w.meshMaterials[I++];if(M instanceof THREE.MeshFaceMaterial){V=0;for(S=w.faceMaterials.length;V<S;)(M=w.faceMaterials[V++])&&d(u,x,H,J,w,M,N)}else M&&d(u,x,H,J,w,M,N)}}}}}};
THREE.WebGLRenderer=function(a){function c(e,j){e.fragment_shader=j.fragment_shader;e.vertex_shader=j.vertex_shader;e.uniforms=Uniforms.clone(j.uniforms)}function d(e,j){e.uniforms.color.value.setRGB(e.color.r*e.opacity,e.color.g*e.opacity,e.color.b*e.opacity);e.uniforms.opacity.value=e.opacity;e.uniforms.map.texture=e.map;e.uniforms.env_map.texture=e.env_map;e.uniforms.reflectivity.value=e.reflectivity;e.uniforms.refraction_ratio.value=e.refraction_ratio;e.uniforms.combine.value=e.combine;e.uniforms.useRefract.value=
e.env_map&&e.env_map.mapping instanceof THREE.CubeRefractionMapping;if(j){e.uniforms.fogColor.value.setHex(j.color.hex);if(j instanceof THREE.Fog){e.uniforms.fogNear.value=j.near;e.uniforms.fogFar.value=j.far}else if(j instanceof THREE.FogExp2)e.uniforms.fogDensity.value=j.density}}function f(e,j){e.uniforms.color.value.setRGB(e.color.r*e.opacity,e.color.g*e.opacity,e.color.b*e.opacity);e.uniforms.opacity.value=e.opacity;if(j){e.uniforms.fogColor.value.setHex(j.color.hex);if(j instanceof THREE.Fog){e.uniforms.fogNear.value=
j.near;e.uniforms.fogFar.value=j.far}else if(j instanceof THREE.FogExp2)e.uniforms.fogDensity.value=j.density}}function g(e,j){var q;if(e=="fragment")q=b.createShader(b.FRAGMENT_SHADER);else if(e=="vertex")q=b.createShader(b.VERTEX_SHADER);b.shaderSource(q,j);b.compileShader(q);if(!b.getShaderParameter(q,b.COMPILE_STATUS)){alert(b.getShaderInfoLog(q));return null}return q}function h(e){switch(e){case THREE.RepeatWrapping:return b.REPEAT;case THREE.ClampToEdgeWrapping:return b.CLAMP_TO_EDGE;case THREE.MirroredRepeatWrapping:return b.MIRRORED_REPEAT;
case THREE.NearestFilter:return b.NEAREST;case THREE.NearestMipMapNearestFilter:return b.NEAREST_MIPMAP_NEAREST;case THREE.NearestMipMapLinearFilter:return b.NEAREST_MIPMAP_LINEAR;case THREE.LinearFilter:return b.LINEAR;case THREE.LinearMipMapNearestFilter:return b.LINEAR_MIPMAP_NEAREST;case THREE.LinearMipMapLinearFilter:return b.LINEAR_MIPMAP_LINEAR;case THREE.ByteType:return b.BYTE;case THREE.UnsignedByteType:return b.UNSIGNED_BYTE;case THREE.ShortType:return b.SHORT;case THREE.UnsignedShortType:return b.UNSIGNED_SHORT;
case THREE.IntType:return b.INT;case THREE.UnsignedShortType:return b.UNSIGNED_INT;case THREE.FloatType:return b.FLOAT;case THREE.AlphaFormat:return b.ALPHA;case THREE.RGBFormat:return b.RGB;case THREE.RGBAFormat:return b.RGBA;case THREE.LuminanceFormat:return b.LUMINANCE;case THREE.LuminanceAlphaFormat:return b.LUMINANCE_ALPHA}return 0}var o=document.createElement("canvas"),b,i=null,k=null,y=new THREE.Matrix4,z,u=new Float32Array(16),x=new Float32Array(16),H=new Float32Array(16),J=new Float32Array(9),
K=new Float32Array(16),p=true,U=new THREE.Color(0),F=0;if(a){if(a.antialias!==undefined)p=a.antialias;a.clearColor!==undefined&&U.setHex(a.clearColor);if(a.clearAlpha!==undefined)F=a.clearAlpha}this.domElement=o;this.autoClear=true;(function(e,j,q){try{b=o.getContext("experimental-webgl",{antialias:e})}catch(l){}if(!b){alert("WebGL not supported");throw"cannot create webgl context";}b.clearColor(0,0,0,1);b.clearDepth(1);b.enable(b.DEPTH_TEST);b.depthFunc(b.LEQUAL);b.frontFace(b.CCW);b.cullFace(b.BACK);
b.enable(b.CULL_FACE);b.enable(b.BLEND);b.blendFunc(b.ONE,b.ONE_MINUS_SRC_ALPHA);b.clearColor(j.r,j.g,j.b,q)})(p,U,F);this.context=b;this.lights={ambient:[0,0,0],directional:{length:0,colors:[],positions:[]},point:{length:0,colors:[],positions:[]}};this.setSize=function(e,j){o.width=e;o.height=j;b.viewport(0,0,o.width,o.height)};this.setClearColor=function(e,j){var q=new THREE.Color(e);b.clearColor(q.r,q.g,q.b,j)};this.clear=function(){b.clear(b.COLOR_BUFFER_BIT|b.DEPTH_BUFFER_BIT)};this.setupLights=
function(e,j){var q,l,r,C=0,m=0,t=0,v,s,n,E=this.lights,A=E.directional.colors,O=E.directional.positions,N=E.point.colors,G=E.point.positions,W=0,P=0;q=0;for(l=j.length;q<l;q++){r=j[q];v=r.color;s=r.position;n=r.intensity;if(r instanceof THREE.AmbientLight){C+=v.r;m+=v.g;t+=v.b}else if(r instanceof THREE.DirectionalLight){A[W*3]=v.r*n;A[W*3+1]=v.g*n;A[W*3+2]=v.b*n;O[W*3]=s.x;O[W*3+1]=s.y;O[W*3+2]=s.z;W+=1}else if(r instanceof THREE.PointLight){N[P*3]=v.r*n;N[P*3+1]=v.g*n;N[P*3+2]=v.b*n;G[P*3]=s.x;
G[P*3+1]=s.y;G[P*3+2]=s.z;P+=1}}E.point.length=P;E.directional.length=W;E.ambient[0]=C;E.ambient[1]=m;E.ambient[2]=t};this.createParticleBuffers=function(e){e.__webGLVertexBuffer=b.createBuffer();e.__webGLFaceBuffer=b.createBuffer()};this.createLineBuffers=function(e){e.__webGLVertexBuffer=b.createBuffer();e.__webGLLineBuffer=b.createBuffer()};this.createMeshBuffers=function(e){e.__webGLVertexBuffer=b.createBuffer();e.__webGLNormalBuffer=b.createBuffer();e.__webGLTangentBuffer=b.createBuffer();e.__webGLUVBuffer=
b.createBuffer();e.__webGLFaceBuffer=b.createBuffer();e.__webGLLineBuffer=b.createBuffer()};this.initLineBuffers=function(e){var j=e.vertices.length;e.__vertexArray=new Float32Array(j*3);e.__lineArray=new Uint16Array(j);e.__webGLLineCount=j};this.initMeshBuffers=function(e,j){var q,l,r=0,C=0,m=0,t=j.geometry.faces,v=e.faces;q=0;for(l=v.length;q<l;q++){fi=v[q];face=t[fi];if(face instanceof THREE.Face3){r+=3;C+=1;m+=3}else if(face instanceof THREE.Face4){r+=4;C+=2;m+=4}}e.__vertexArray=new Float32Array(r*
3);e.__normalArray=new Float32Array(r*3);e.__tangentArray=new Float32Array(r*4);e.__uvArray=new Float32Array(r*2);e.__faceArray=new Uint16Array(C*3);e.__lineArray=new Uint16Array(m*2);r=false;q=0;for(l=j.materials.length;q<l;q++){t=j.materials[q];if(t instanceof THREE.MeshFaceMaterial){t=0;for(v=e.materials.length;t<v;t++)if(e.materials[t]&&e.materials[t].shading!=undefined&&e.materials[t].shading==THREE.SmoothShading){r=true;break}}else if(t&&t.shading!=undefined&&t.shading==THREE.SmoothShading){r=
true;break}if(r)break}e.__needsSmoothNormals=r;e.__webGLFaceCount=C*3;e.__webGLLineCount=m*2};this.setMeshBuffers=function(e,j,q,l,r,C,m,t){var v,s,n,E,A,O,N,G,W,P=0,I=0,L=0,V=0,S=0,w=0,M=0,Q=e.__vertexArray,ea=e.__uvArray,ba=e.__normalArray,Z=e.__tangentArray,ja=e.__faceArray,Y=e.__lineArray,qa=e.__needsSmoothNormals,ka=j.geometry,fa=ka.vertices,ha=e.faces,sa=ka.faces,ua=ka.uvs;j=0;for(v=ha.length;j<v;j++){s=ha[j];n=sa[s];s=ua[s];E=n.vertexNormals;A=n.normal;if(n instanceof THREE.Face3){if(l){O=
fa[n.a].position;N=fa[n.b].position;G=fa[n.c].position;Q[I]=O.x;Q[I+1]=O.y;Q[I+2]=O.z;Q[I+3]=N.x;Q[I+4]=N.y;Q[I+5]=N.z;Q[I+6]=G.x;Q[I+7]=G.y;Q[I+8]=G.z;I+=9}if(t&&ka.hasTangents){O=fa[n.a].tangent;N=fa[n.b].tangent;G=fa[n.c].tangent;Z[w]=O.x;Z[w+1]=O.y;Z[w+2]=O.z;Z[w+3]=O.w;Z[w+4]=N.x;Z[w+5]=N.y;Z[w+6]=N.z;Z[w+7]=N.w;Z[w+8]=G.x;Z[w+9]=G.y;Z[w+10]=G.z;Z[w+11]=G.w;w+=12}if(m)if(E.length==3&&qa)for(n=0;n<3;n++){A=E[n];ba[S]=A.x;ba[S+1]=A.y;ba[S+2]=A.z;S+=3}else for(n=0;n<3;n++){ba[S]=A.x;ba[S+1]=A.y;
ba[S+2]=A.z;S+=3}if(C&&s)for(n=0;n<3;n++){E=s[n];ea[L]=E.u;ea[L+1]=E.v;L+=2}if(r){ja[V]=P;ja[V+1]=P+1;ja[V+2]=P+2;V+=3;Y[M]=P;Y[M+1]=P+1;Y[M+2]=P;Y[M+3]=P+2;Y[M+4]=P+1;Y[M+5]=P+2;M+=6;P+=3}}else if(n instanceof THREE.Face4){if(l){O=fa[n.a].position;N=fa[n.b].position;G=fa[n.c].position;W=fa[n.d].position;Q[I]=O.x;Q[I+1]=O.y;Q[I+2]=O.z;Q[I+3]=N.x;Q[I+4]=N.y;Q[I+5]=N.z;Q[I+6]=G.x;Q[I+7]=G.y;Q[I+8]=G.z;Q[I+9]=W.x;Q[I+10]=W.y;Q[I+11]=W.z;I+=12}if(t&&ka.hasTangents){O=fa[n.a].tangent;N=fa[n.b].tangent;
G=fa[n.c].tangent;n=fa[n.d].tangent;Z[w]=O.x;Z[w+1]=O.y;Z[w+2]=O.z;Z[w+3]=O.w;Z[w+4]=N.x;Z[w+5]=N.y;Z[w+6]=N.z;Z[w+7]=N.w;Z[w+8]=G.x;Z[w+9]=G.y;Z[w+10]=G.z;Z[w+11]=G.w;Z[w+12]=n.x;Z[w+13]=n.y;Z[w+14]=n.z;Z[w+15]=n.w;w+=16}if(m)if(E.length==4&&qa)for(n=0;n<4;n++){A=E[n];ba[S]=A.x;ba[S+1]=A.y;ba[S+2]=A.z;S+=3}else for(n=0;n<4;n++){ba[S]=A.x;ba[S+1]=A.y;ba[S+2]=A.z;S+=3}if(C&&s)for(n=0;n<4;n++){E=s[n];ea[L]=E.u;ea[L+1]=E.v;L+=2}if(r){ja[V]=P;ja[V+1]=P+1;ja[V+2]=P+2;ja[V+3]=P;ja[V+4]=P+2;ja[V+5]=P+3;
V+=6;Y[M]=P;Y[M+1]=P+1;Y[M+2]=P;Y[M+3]=P+3;Y[M+4]=P+1;Y[M+5]=P+2;Y[M+6]=P+2;Y[M+7]=P+3;M+=8;P+=4}}}if(l){b.bindBuffer(b.ARRAY_BUFFER,e.__webGLVertexBuffer);b.bufferData(b.ARRAY_BUFFER,Q,q)}if(m){b.bindBuffer(b.ARRAY_BUFFER,e.__webGLNormalBuffer);b.bufferData(b.ARRAY_BUFFER,ba,q)}if(t&&ka.hasTangents){b.bindBuffer(b.ARRAY_BUFFER,e.__webGLTangentBuffer);b.bufferData(b.ARRAY_BUFFER,Z,q)}if(C&&L>0){b.bindBuffer(b.ARRAY_BUFFER,e.__webGLUVBuffer);b.bufferData(b.ARRAY_BUFFER,ea,q)}if(r){b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,
e.__webGLFaceBuffer);b.bufferData(b.ELEMENT_ARRAY_BUFFER,ja,q);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,e.__webGLLineBuffer);b.bufferData(b.ELEMENT_ARRAY_BUFFER,Y,q)}};this.setLineBuffers=function(e,j,q,l){var r,C,m=e.vertices,t=m.length,v=e.__vertexArray,s=e.__lineArray;if(q)for(q=0;q<t;q++){r=m[q].position;C=q*3;v[C]=r.x;v[C+1]=r.y;v[C+2]=r.z}if(l)for(q=0;q<t;q++)s[q]=q;b.bindBuffer(b.ARRAY_BUFFER,e.__webGLVertexBuffer);b.bufferData(b.ARRAY_BUFFER,v,j);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,e.__webGLLineBuffer);
b.bufferData(b.ELEMENT_ARRAY_BUFFER,s,j)};this.setParticleBuffers=function(){};this.renderBuffer=function(e,j,q,l,r,C){var m,t,v,s;if(!l.program){if(l instanceof THREE.MeshDepthMaterial){c(l,THREE.ShaderLib.depth);l.uniforms.mNear.value=e.near;l.uniforms.mFar.value=e.far}else if(l instanceof THREE.MeshNormalMaterial)c(l,THREE.ShaderLib.normal);else if(l instanceof THREE.MeshBasicMaterial){c(l,THREE.ShaderLib.basic);d(l,q)}else if(l instanceof THREE.MeshLambertMaterial){c(l,THREE.ShaderLib.lambert);
d(l,q)}else if(l instanceof THREE.MeshPhongMaterial){c(l,THREE.ShaderLib.phong);d(l,q)}else if(l instanceof THREE.LineBasicMaterial){c(l,THREE.ShaderLib.basic);f(l,q)}var n,E,A;n=s=t=0;for(E=j.length;n<E;n++){A=j[n];A instanceof THREE.DirectionalLight&&s++;A instanceof THREE.PointLight&&t++}if(t+s<=4){n=s;t=t}else{n=Math.ceil(4*s/(t+s));t=4-n}t={directional:n,point:t};s={fog:q,map:l.map,env_map:l.env_map,maxDirLights:t.directional,maxPointLights:t.point};t=l.fragment_shader;n=l.vertex_shader;E=b.createProgram();
A=["#ifdef GL_ES\nprecision highp float;\n#endif","#define MAX_DIR_LIGHTS "+s.maxDirLights,"#define MAX_POINT_LIGHTS "+s.maxPointLights,s.fog?"#define USE_FOG":"",s.fog instanceof THREE.FogExp2?"#define FOG_EXP2":"",s.map?"#define USE_MAP":"",s.env_map?"#define USE_ENVMAP":"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n");s=[b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS)>0?"#define VERTEX_TEXTURES":"","#define MAX_DIR_LIGHTS "+s.maxDirLights,"#define MAX_POINT_LIGHTS "+s.maxPointLights,
s.map?"#define USE_MAP":"",s.env_map?"#define USE_ENVMAP":"","uniform mat4 objectMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\n"].join("\n");b.attachShader(E,g("fragment",A+t));b.attachShader(E,g("vertex",s+n));b.linkProgram(E);b.getProgramParameter(E,b.LINK_STATUS)||alert("Could not initialise shaders\nVALIDATE_STATUS: "+
b.getProgramParameter(E,b.VALIDATE_STATUS)+", gl error ["+b.getError()+"]");E.uniforms={};E.attributes={};l.program=E;t=["viewMatrix","modelViewMatrix","projectionMatrix","normalMatrix","objectMatrix","cameraPosition"];for(m in l.uniforms)t.push(m);m=l.program;n=0;for(E=t.length;n<E;n++){A=t[n];m.uniforms[A]=b.getUniformLocation(m,A)}m=l.program;t=["position","normal","uv","tangent"];n=0;for(E=t.length;n<E;n++){A=t[n];m.attributes[A]=b.getAttribLocation(m,A)}}m=l.program;if(m!=i){b.useProgram(m);
i=m}this.loadCamera(m,e);this.loadMatrices(m);if(l instanceof THREE.MeshPhongMaterial||l instanceof THREE.MeshLambertMaterial){this.setupLights(m,j);e=this.lights;l.uniforms.enableLighting.value=e.directional.length+e.point.length;l.uniforms.ambientLightColor.value=e.ambient;l.uniforms.directionalLightColor.value=e.directional.colors;l.uniforms.directionalLightDirection.value=e.directional.positions;l.uniforms.pointLightColor.value=e.point.colors;l.uniforms.pointLightPosition.value=e.point.positions}if(l instanceof
THREE.MeshBasicMaterial||l instanceof THREE.MeshLambertMaterial||l instanceof THREE.MeshPhongMaterial)d(l,q);l instanceof THREE.LineBasicMaterial&&f(l,q);if(l instanceof THREE.MeshPhongMaterial){l.uniforms.ambient.value.setRGB(l.ambient.r,l.ambient.g,l.ambient.b);l.uniforms.specular.value.setRGB(l.specular.r,l.specular.g,l.specular.b);l.uniforms.shininess.value=l.shininess}q=l.uniforms;for(v in q)if(n=m.uniforms[v]){j=q[v];t=j.type;e=j.value;if(t=="i")b.uniform1i(n,e);else if(t=="f")b.uniform1f(n,
e);else if(t=="fv1")b.uniform1fv(n,e);else if(t=="fv")b.uniform3fv(n,e);else if(t=="v2")b.uniform2f(n,e.x,e.y);else if(t=="v3")b.uniform3f(n,e.x,e.y,e.z);else if(t=="c")b.uniform3f(n,e.r,e.g,e.b);else if(t=="t"){b.uniform1i(n,e);if(j=j.texture)if(j.image instanceof Array&&j.image.length==6){j=j;e=e;if(j.image.length==6){if(!j.image.__webGLTextureCube&&!j.image.__cubeMapInitialized&&j.image.loadCount==6){j.image.__webGLTextureCube=b.createTexture();b.bindTexture(b.TEXTURE_CUBE_MAP,j.image.__webGLTextureCube);
b.texParameteri(b.TEXTURE_CUBE_MAP,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_CUBE_MAP,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_CUBE_MAP,b.TEXTURE_MAG_FILTER,b.LINEAR);b.texParameteri(b.TEXTURE_CUBE_MAP,b.TEXTURE_MIN_FILTER,b.LINEAR_MIPMAP_LINEAR);for(t=0;t<6;++t)b.texImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,b.RGBA,b.RGBA,b.UNSIGNED_BYTE,j.image[t]);b.generateMipmap(b.TEXTURE_CUBE_MAP);b.bindTexture(b.TEXTURE_CUBE_MAP,null);j.image.__cubeMapInitialized=true}b.activeTexture(b.TEXTURE0+
e);b.bindTexture(b.TEXTURE_CUBE_MAP,j.image.__webGLTextureCube)}}else{j=j;e=e;if(!j.__webGLTexture&&j.image.loaded){j.__webGLTexture=b.createTexture();b.bindTexture(b.TEXTURE_2D,j.__webGLTexture);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,b.RGBA,b.UNSIGNED_BYTE,j.image);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,h(j.wrap_s));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,h(j.wrap_t));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,h(j.mag_filter));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,h(j.min_filter));
b.generateMipmap(b.TEXTURE_2D);b.bindTexture(b.TEXTURE_2D,null)}b.activeTexture(b.TEXTURE0+e);b.bindTexture(b.TEXTURE_2D,j.__webGLTexture)}}}v=m.attributes;b.bindBuffer(b.ARRAY_BUFFER,r.__webGLVertexBuffer);b.vertexAttribPointer(v.position,3,b.FLOAT,false,0,0);b.enableVertexAttribArray(v.position);if(v.normal>=0){b.bindBuffer(b.ARRAY_BUFFER,r.__webGLNormalBuffer);b.vertexAttribPointer(v.normal,3,b.FLOAT,false,0,0);b.enableVertexAttribArray(v.normal)}if(v.tangent>=0){b.bindBuffer(b.ARRAY_BUFFER,r.__webGLTangentBuffer);
b.vertexAttribPointer(v.tangent,4,b.FLOAT,false,0,0);b.enableVertexAttribArray(v.tangent)}if(v.uv>=0)if(r.__webGLUVBuffer){b.bindBuffer(b.ARRAY_BUFFER,r.__webGLUVBuffer);b.vertexAttribPointer(v.uv,2,b.FLOAT,false,0,0);b.enableVertexAttribArray(v.uv)}else b.disableVertexAttribArray(v.uv);if(l.wireframe||l instanceof THREE.LineBasicMaterial){v=l.wireframe_linewidth!==undefined?l.wireframe_linewidth:l.linewidth!==undefined?l.linewidth:1;l=l instanceof THREE.LineBasicMaterial&&C.type==THREE.LineStrip?
b.LINE_STRIP:b.LINES;b.lineWidth(v);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,r.__webGLLineBuffer);b.drawElements(l,r.__webGLLineCount,b.UNSIGNED_SHORT,0)}else{b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,r.__webGLFaceBuffer);b.drawElements(b.TRIANGLES,r.__webGLFaceCount,b.UNSIGNED_SHORT,0)}};this.renderPass=function(e,j,q,l,r,C,m){var t,v,s,n,E;s=0;for(n=l.materials.length;s<n;s++){t=l.materials[s];if(t instanceof THREE.MeshFaceMaterial){t=0;for(v=r.materials.length;t<v;t++)if((E=r.materials[t])&&E.blending==C&&
E.opacity<1==m){this.setBlending(E.blending);this.renderBuffer(e,j,q,E,r,l)}}else if((E=t)&&E.blending==C&&E.opacity<1==m){this.setBlending(E.blending);this.renderBuffer(e,j,q,E,r,l)}}};this.render=function(e,j,q,l){var r,C,m,t=e.lights,v=e.fog;this.initWebGLObjects(e);l=l!==undefined?l:true;if(q&&!q.__webGLFramebuffer){q.__webGLFramebuffer=b.createFramebuffer();q.__webGLRenderbuffer=b.createRenderbuffer();q.__webGLTexture=b.createTexture();b.bindRenderbuffer(b.RENDERBUFFER,q.__webGLRenderbuffer);
b.renderbufferStorage(b.RENDERBUFFER,b.DEPTH_COMPONENT16,q.width,q.height);b.bindTexture(b.TEXTURE_2D,q.__webGLTexture);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,h(q.wrap_s));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,h(q.wrap_t));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,h(q.mag_filter));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,h(q.min_filter));b.texImage2D(b.TEXTURE_2D,0,h(q.format),q.width,q.height,0,h(q.format),h(q.type),null);b.bindFramebuffer(b.FRAMEBUFFER,q.__webGLFramebuffer);
b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,q.__webGLTexture,0);b.framebufferRenderbuffer(b.FRAMEBUFFER,b.DEPTH_ATTACHMENT,b.RENDERBUFFER,q.__webGLRenderbuffer);b.bindTexture(b.TEXTURE_2D,null);b.bindRenderbuffer(b.RENDERBUFFER,null);b.bindFramebuffer(b.FRAMEBUFFER,null)}if(q){r=q.__webGLFramebuffer;m=q.width;C=q.height}else{r=null;m=o.width;C=o.height}if(r!=k){b.bindFramebuffer(b.FRAMEBUFFER,r);b.viewport(0,0,m,C);l&&b.clear(b.COLOR_BUFFER_BIT|b.DEPTH_BUFFER_BIT);k=r}this.autoClear&&
this.clear();j.autoUpdateMatrix&&j.updateMatrix();u.set(j.matrix.flatten());H.set(j.projectionMatrix.flatten());l=0;for(r=e.__webGLObjects.length;l<r;l++){C=e.__webGLObjects[l];m=C.object;C=C.buffer;if(m.visible){this.setupMatrices(m,j);this.renderPass(j,t,v,m,C,THREE.NormalBlending,false)}}l=0;for(r=e.__webGLObjects.length;l<r;l++){C=e.__webGLObjects[l];m=C.object;C=C.buffer;if(m.visible){this.setupMatrices(m,j);if(m.doubleSided)b.disable(b.CULL_FACE);else{b.enable(b.CULL_FACE);m.flipSided?b.frontFace(b.CW):
b.frontFace(b.CCW)}this.renderPass(j,t,v,m,C,THREE.AdditiveBlending,false);this.renderPass(j,t,v,m,C,THREE.SubtractiveBlending,false);this.renderPass(j,t,v,m,C,THREE.AdditiveBlending,true);this.renderPass(j,t,v,m,C,THREE.SubtractiveBlending,true);this.renderPass(j,t,v,m,C,THREE.NormalBlending,true)}}if(q&&q.min_filter!==THREE.NearestFilter&&q.min_filter!==THREE.LinearFilter){b.bindTexture(b.TEXTURE_2D,q.__webGLTexture);b.generateMipmap(b.TEXTURE_2D);b.bindTexture(b.TEXTURE_2D,null)}};this.initWebGLObjects=
function(e){function j(s,n,E,A){if(s[n]==undefined){e.__webGLObjects.push({buffer:E,object:A});s[n]=1}}var q,l,r,C,m,t,v;if(!e.__webGLObjects){e.__webGLObjects=[];e.__webGLObjectsMap={}}q=0;for(l=e.objects.length;q<l;q++){r=e.objects[q];m=r.geometry;if(e.__webGLObjectsMap[r.id]==undefined)e.__webGLObjectsMap[r.id]={};v=e.__webGLObjectsMap[r.id];if(r instanceof THREE.Mesh){for(C in m.geometryChunks){t=m.geometryChunks[C];if(!t.__webGLVertexBuffer){this.createMeshBuffers(t);this.initMeshBuffers(t,r);
m.__dirtyVertices=true;m.__dirtyElements=true;m.__dirtyUvs=true;m.__dirtyNormals=true;m.__dirtyTangents=true}if(m.__dirtyVertices||m.__dirtyElements||m.__dirtyUvs)this.setMeshBuffers(t,r,b.DYNAMIC_DRAW,m.__dirtyVertices,m.__dirtyElements,m.__dirtyUvs,m.__dirtyNormals,m.__dirtyTangents);j(v,C,t,r)}m.__dirtyVertices=false;m.__dirtyElements=false;m.__dirtyUvs=false;m.__dirtyNormals=false;m.__dirtyTangents=false}else if(r instanceof THREE.Line){if(!m.__webGLVertexBuffer){this.createLineBuffers(m);this.initLineBuffers(m);
m.__dirtyVertices=true;m.__dirtyElements=true}m.__dirtyVertices&&this.setLineBuffers(m,b.DYNAMIC_DRAW,m.__dirtyVertices,m.__dirtyElements);j(v,0,m,r);m.__dirtyVertices=false;m.__dirtyElements=false}else if(r instanceof THREE.ParticleSystem){m.__webGLVertexBuffer||this.createParticleBuffers(m);j(v,0,m,r)}}};this.removeObject=function(e,j){var q,l;for(q=e.__webGLObjects.length-1;q>=0;q--){l=e.__webGLObjects[q].object;j==l&&e.__webGLObjects.splice(q,1)}};this.setupMatrices=function(e,j){e.autoUpdateMatrix&&
e.updateMatrix();y.multiply(j.matrix,e.matrix);x.set(y.flatten());z=THREE.Matrix4.makeInvert3x3(y).transpose();J.set(z.m);K.set(e.matrix.flatten())};this.loadMatrices=function(e){b.uniformMatrix4fv(e.uniforms.viewMatrix,false,u);b.uniformMatrix4fv(e.uniforms.modelViewMatrix,false,x);b.uniformMatrix4fv(e.uniforms.projectionMatrix,false,H);b.uniformMatrix3fv(e.uniforms.normalMatrix,false,J);b.uniformMatrix4fv(e.uniforms.objectMatrix,false,K)};this.loadCamera=function(e,j){b.uniform3f(e.uniforms.cameraPosition,
j.position.x,j.position.y,j.position.z)};this.setBlending=function(e){switch(e){case THREE.AdditiveBlending:b.blendEquation(b.FUNC_ADD);b.blendFunc(b.ONE,b.ONE);break;case THREE.SubtractiveBlending:b.blendFunc(b.DST_COLOR,b.ZERO);break;default:b.blendEquation(b.FUNC_ADD);b.blendFunc(b.ONE,b.ONE_MINUS_SRC_ALPHA)}};this.setFaceCulling=function(e,j){if(e){!j||j=="ccw"?b.frontFace(b.CCW):b.frontFace(b.CW);if(e=="back")b.cullFace(b.BACK);else e=="front"?b.cullFace(b.FRONT):b.cullFace(b.FRONT_AND_BACK);
b.enable(b.CULL_FACE)}else b.disable(b.CULL_FACE)};this.supportsVertexTextures=function(){return b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS)>0}};
THREE.Snippets={fog_pars_fragment:"#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#endif",fog_fragment:"#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, 1.0 ), fogFactor );\n#endif",envmap_pars_fragment:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float reflectivity;\nuniform samplerCube env_map;\nuniform int combine;\n#endif",
envmap_fragment:"#ifdef USE_ENVMAP\ncubeColor = textureCube( env_map, vec3( -vReflect.x, vReflect.yz ) );\nif ( combine == 1 ) {\ngl_FragColor = mix( gl_FragColor, cubeColor, reflectivity );\n} else {\ngl_FragColor = gl_FragColor * cubeColor;\n}\n#endif",envmap_pars_vertex:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float refraction_ratio;\nuniform bool useRefract;\n#endif",envmap_vertex:"#ifdef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal;\nif ( useRefract ) {\nvReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refraction_ratio );\n} else {\nvReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );\n}\n#endif",
map_pars_fragment:"#ifdef USE_MAP\nvarying vec2 vUv;\nuniform sampler2D map;\n#endif",map_pars_vertex:"#ifdef USE_MAP\nvarying vec2 vUv;\n#endif",map_fragment:"#ifdef USE_MAP\nmapColor = texture2D( map, vUv );\n#endif",map_vertex:"#ifdef USE_MAP\nvUv = uv;\n#endif",lights_pars_vertex:"uniform bool enableLighting;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n#ifdef PHONG\nvarying vec3 vPointLightVector[ MAX_POINT_LIGHTS ];\n#endif\n#endif",
lights_vertex:"if ( !enableLighting ) {\nvLightWeighting = vec3( 1.0 );\n} else {\nvLightWeighting = ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nfloat directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );\nvLightWeighting += directionalLightColor[ i ] * directionalLightWeighting;\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 pointLightVector = normalize( lPosition.xyz - mvPosition.xyz );\nfloat pointLightWeighting = max( dot( transformedNormal, pointLightVector ), 0.0 );\nvLightWeighting += pointLightColor[ i ] * pointLightWeighting;\n#ifdef PHONG\nvPointLightVector[ i ] = pointLightVector;\n#endif\n}\n#endif\n}",
lights_pars_fragment:"#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nvarying vec3 vPointLightVector[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",lights_fragment:"vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\nvec4 mSpecular = vec4( specular, opacity );\n#if MAX_POINT_LIGHTS > 0\nvec4 pointDiffuse  = vec4( 0.0 );\nvec4 pointSpecular = vec4( 0.0 );\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec3 pointVector = normalize( vPointLightVector[ i ] );\nvec3 pointHalfVector = normalize( vPointLightVector[ i ] + vViewPosition );\nfloat pointDotNormalHalf = dot( normal, pointHalfVector );\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\nfloat pointSpecularWeight = 0.0;\nif ( pointDotNormalHalf >= 0.0 )\npointSpecularWeight = pow( pointDotNormalHalf, shininess );\npointDiffuse  += mColor * pointDiffuseWeight;\npointSpecular += mSpecular * pointSpecularWeight;\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec4 dirDiffuse  = vec4( 0.0 );\nvec4 dirSpecular = vec4( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nvec3 dirHalfVector = normalize( lDirection.xyz + vViewPosition );\nfloat dirDotNormalHalf = dot( normal, dirHalfVector );\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\nfloat dirSpecularWeight = 0.0;\nif ( dirDotNormalHalf >= 0.0 )\ndirSpecularWeight = pow( dirDotNormalHalf, shininess );\ndirDiffuse  += mColor * dirDiffuseWeight;\ndirSpecular += mSpecular * dirSpecularWeight;\n}\n#endif\nvec4 totalLight = vec4( ambient, opacity );\n#if MAX_DIR_LIGHTS > 0\ntotalLight += dirDiffuse + dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalLight += pointDiffuse + pointSpecular;\n#endif"};
THREE.UniformsLib={common:{color:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},map:{type:"t",value:0,texture:null},env_map:{type:"t",value:1,texture:null},useRefract:{type:"i",value:0},reflectivity:{type:"f",value:1},refraction_ratio:{type:"f",value:0.98},combine:{type:"i",value:0},fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},lights:{enableLighting:{type:"i",value:1},ambientLightColor:{type:"fv",
value:[]},directionalLightDirection:{type:"fv",value:[]},directionalLightColor:{type:"fv",value:[]},pointLightPosition:{type:"fv",value:[]},pointLightColor:{type:"fv",value:[]}}};
THREE.ShaderLib={depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2E3}},fragment_shader:"uniform float mNear;\nuniform float mFar;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), 1.0 );\n}",vertex_shader:"void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}"},normal:{uniforms:{},fragment_shader:"varying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, 1.0 );\n}",
vertex_shader:"varying vec3 vNormal;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalize( normalMatrix * normal );\ngl_Position = projectionMatrix * mvPosition;\n}"},basic:{uniforms:THREE.UniformsLib.common,fragment_shader:["uniform vec3 color;\nuniform float opacity;",THREE.Snippets.map_pars_fragment,THREE.Snippets.envmap_pars_fragment,THREE.Snippets.fog_pars_fragment,"void main() {\nvec4 mColor = vec4( color, opacity );\nvec4 mapColor = vec4( 1.0 );\nvec4 cubeColor = vec4( 1.0 );",
THREE.Snippets.map_fragment,"gl_FragColor = mColor * mapColor;",THREE.Snippets.envmap_fragment,THREE.Snippets.fog_fragment,"}"].join("\n"),vertex_shader:[THREE.Snippets.map_pars_vertex,THREE.Snippets.envmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.Snippets.map_vertex,THREE.Snippets.envmap_vertex,"gl_Position = projectionMatrix * mvPosition;\n}"].join("\n")},lambert:{uniforms:Uniforms.merge([THREE.UniformsLib.common,THREE.UniformsLib.lights]),fragment_shader:["uniform vec3 color;\nuniform float opacity;\nvarying vec3 vLightWeighting;",
THREE.Snippets.map_pars_fragment,THREE.Snippets.envmap_pars_fragment,THREE.Snippets.fog_pars_fragment,"void main() {\nvec4 mColor = vec4( color, opacity );\nvec4 mapColor = vec4( 1.0 );\nvec4 cubeColor = vec4( 1.0 );",THREE.Snippets.map_fragment,"gl_FragColor =  mColor * mapColor * vec4( vLightWeighting, 1.0 );",THREE.Snippets.envmap_fragment,THREE.Snippets.fog_fragment,"}"].join("\n"),vertex_shader:["varying vec3 vLightWeighting;",THREE.Snippets.map_pars_vertex,THREE.Snippets.envmap_pars_vertex,
THREE.Snippets.lights_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.Snippets.map_vertex,THREE.Snippets.envmap_vertex,"vec3 transformedNormal = normalize( normalMatrix * normal );",THREE.Snippets.lights_vertex,"gl_Position = projectionMatrix * mvPosition;\n}"].join("\n")},phong:{uniforms:Uniforms.merge([THREE.UniformsLib.common,THREE.UniformsLib.lights,{ambient:{type:"c",value:new THREE.Color(328965)},specular:{type:"c",value:new THREE.Color(1118481)},
shininess:{type:"f",value:30}}]),fragment_shader:["uniform vec3 color;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 specular;\nuniform float shininess;\nvarying vec3 vLightWeighting;",THREE.Snippets.map_pars_fragment,THREE.Snippets.envmap_pars_fragment,THREE.Snippets.fog_pars_fragment,THREE.Snippets.lights_pars_fragment,"void main() {\nvec4 mColor = vec4( color, opacity );\nvec4 mapColor = vec4( 1.0 );\nvec4 cubeColor = vec4( 1.0 );",THREE.Snippets.map_fragment,THREE.Snippets.lights_fragment,
"gl_FragColor =  mapColor * totalLight * vec4( vLightWeighting, 1.0 );",THREE.Snippets.envmap_fragment,THREE.Snippets.fog_fragment,"}"].join("\n"),vertex_shader:["#define PHONG\nvarying vec3 vLightWeighting;\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",THREE.Snippets.map_pars_vertex,THREE.Snippets.envmap_pars_vertex,THREE.Snippets.lights_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.Snippets.map_vertex,THREE.Snippets.envmap_vertex,"#ifndef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\n#endif\nvViewPosition = cameraPosition - mPosition.xyz;\nvec3 transformedNormal = normalize( normalMatrix * normal );\nvNormal = transformedNormal;",
THREE.Snippets.lights_vertex,"gl_Position = projectionMatrix * mvPosition;\n}"].join("\n")}};THREE.RenderableObject=function(){this.z=this.object=null};THREE.RenderableFace3=function(){this.z=null;this.v1=new THREE.Vertex;this.v2=new THREE.Vertex;this.v3=new THREE.Vertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[];this.faceMaterials=this.meshMaterials=null;this.overdraw=false;this.uvs=[null,null,null]};
THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=null;this.scale=new THREE.Vector2;this.materials=null};THREE.RenderableLine=function(){this.z=null;this.v1=new THREE.Vertex;this.v2=new THREE.Vertex;this.materials=null};
  var T = THREE;
/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
 */

var Cube = function ( width, height, depth, segments_width, segments_height, materials, flipped, sides ) {

	THREE.Geometry.call( this );

	var scope = this,
	width_half = width / 2,
	height_half = height / 2,
	depth_half = depth / 2,
	flip = flipped ? - 1 : 1;

	if ( materials !== undefined ) {

		if ( materials instanceof Array ) {

			this.materials = materials;

		} else {

			this.materials = [];

			for ( var i = 0; i < 6; i ++ ) {

				this.materials.push( [ materials ] );

			}

		}

	} else {

		this.materials = [];

	}

	this.sides = { px: true, nx: true, py: true, ny: true, pz: true, nz: true };

	if( sides != undefined ) {

		for( var s in sides ) {

			if ( this.sides[ s ] != undefined ) {

				this.sides[ s ] = sides[ s ];

			}

		}

	}

	this.sides.px && buildPlane( 'z', 'y',   1 * flip, - 1, depth, height, - width_half, this.materials[ 0 ] ); // px
	this.sides.nx && buildPlane( 'z', 'y', - 1 * flip, - 1, depth, height, width_half, this.materials[ 1 ] );   // nx
	this.sides.py && buildPlane( 'x', 'z',   1 * flip,   1, width, depth, height_half, this.materials[ 2 ] );   // py
	this.sides.ny && buildPlane( 'x', 'z',   1 * flip, - 1, width, depth, - height_half, this.materials[ 3 ] ); // ny
	this.sides.pz && buildPlane( 'x', 'y',   1 * flip, - 1, width, height, depth_half, this.materials[ 4 ] );   // pz
	this.sides.nz && buildPlane( 'x', 'y', - 1 * flip, - 1, width, height, - depth_half, this.materials[ 5 ] ); // nz

	mergeVertices();

	function buildPlane( u, v, udir, vdir, width, height, depth, material ) {

		var w, ix, iy,
		gridX = segments_width || 1,
		gridY = segments_height || 1,
		gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		width_half = width / 2,
		height_half = height / 2,
		segment_width = width / gridX,
		segment_height = height / gridY,
		offset = scope.vertices.length;

		if ( ( u == 'x' && v == 'y' ) || ( u == 'y' && v == 'x' ) ) {

			w = 'z';

		} else if ( ( u == 'x' && v == 'z' ) || ( u == 'z' && v == 'x' ) ) {

			w = 'y';

		} else if ( ( u == 'z' && v == 'y' ) || ( u == 'y' && v == 'z' ) ) {

			w = 'x';

		}


		for( iy = 0; iy < gridY1; iy++ ) {

			for( ix = 0; ix < gridX1; ix++ ) {

				var vector = new THREE.Vector3();
				vector[ u ] = ( ix * segment_width - width_half ) * udir;
				vector[ v ] = ( iy * segment_height - height_half ) * vdir;
				vector[ w ] = depth;

				scope.vertices.push( new THREE.Vertex( vector ) );

			}

		}

		for( iy = 0; iy < gridY; iy++ ) {

			for( ix = 0; ix < gridX; ix++ ) {

				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				scope.faces.push( new THREE.Face4( a + offset, b + offset, c + offset, d + offset, null, material ) );
				scope.uvs.push( [
							new THREE.UV( ix / gridX, iy / gridY ),
							new THREE.UV( ix / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, iy / gridY )
						] );

			}

		}

	}

	function mergeVertices() {

		var unique = [], changes = [];

		for ( var i = 0, il = scope.vertices.length; i < il; i ++ ) {

			var v = scope.vertices[ i ],
			duplicate = false;

			for ( var j = 0, jl = unique.length; j < jl; j ++ ) {

				var vu = unique[ j ];

				if( v.position.x == vu.position.x && v.position.y == vu.position.y && v.position.z == vu.position.z ) {

					changes[ i ] = j;
					duplicate = true;
					break;

				}

			}

			if ( ! duplicate ) {

				changes[ i ] = unique.length;
				unique.push( new THREE.Vertex( v.position.clone() ) );

			}

		}

		for ( i = 0, il = scope.faces.length; i < il; i ++ ) {

			var face = scope.faces[ i ];

			face.a = changes[ face.a ];
			face.b = changes[ face.b ];
			face.c = changes[ face.c ];
			face.d = changes[ face.d ];

		}

		scope.vertices = unique;

	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.sortFacesByMaterial();

};

Cube.prototype = new THREE.Geometry();
Cube.prototype.constructor = Cube;
/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

var Plane = function ( width, height, segments_width, segments_height ) {

	THREE.Geometry.call( this );

	var ix, iy,
	width_half = width / 2,
	height_half = height / 2,
	gridX = segments_width || 1,
	gridY = segments_height || 1,
	gridX1 = gridX + 1,
	gridY1 = gridY + 1,
	segment_width = width / gridX,
	segment_height = height / gridY;


	for( iy = 0; iy < gridY1; iy++ ) {

		for( ix = 0; ix < gridX1; ix++ ) {

			var x = ix * segment_width - width_half;
			var y = iy * segment_height - height_half;

			this.vertices.push( new THREE.Vertex( new THREE.Vector3( x, - y, 0 ) ) );

		}

	}

	for( iy = 0; iy < gridY; iy++ ) {

		for( ix = 0; ix < gridX; ix++ ) {

			var a = ix + gridX1 * iy;
			var b = ix + gridX1 * ( iy + 1 );
			var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
			var d = ( ix + 1 ) + gridX1 * iy;

			this.faces.push( new THREE.Face4( a, b, c, d ) );
			this.uvs.push( [
						new THREE.UV( ix / gridX, iy / gridY ),
						new THREE.UV( ix / gridX, ( iy + 1 ) / gridY ),
						new THREE.UV( ( ix + 1 ) / gridX, ( iy + 1 ) / gridY ),
						new THREE.UV( ( ix + 1 ) / gridX, iy / gridY )
					] );

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.sortFacesByMaterial();

};

Plane.prototype = new THREE.Geometry();
Plane.prototype.constructor = Plane;


  /*
   * Helpers
   */

function xhr(options, successCallback, errorCallback) {
	if(typeof options == 'string') {
		options = { url: options };
	}
	var url = (typeof options == 'string') ? options : options.url;
	var method = (options.method || 'get').toUpperCase();
	var data = options.data || null;
	var headers = options.headers || {};
	if(method == 'POST') {
		headers['Content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
	}

	if (typeof XMLHttpRequest == 'function') {
		var request = new XMLHttpRequest;
	} else if (typeof ActiveXObject == 'function') {
		var request = new XMLHttpRequest('Microsoft.XMLHTTP');
	}
	if (request) {
		request.onreadystatechange = function() {
			if(request.readyState == 4) {
				var status = Math.floor(request.status / 100);
				if(status == 0 || status == 4 || status == 5) {
					if(errorCallback) {
						errorCallback();
					}
				} else {
					successCallback(request.responseText, request.responseXML);
				}
			}
		};
		request.open(method, url, true);
		for(var key in headers) {
			if(headers.hasOwnProperty(key)) {
				request.setRequestHeader(key, headers[key]);
			}
		}
		request.send(data);
		return request;
	}
}
  var get = xhr;
function each(obj, fn) {
	if(obj.length) {
		if(obj.forEach) {
			obj.forEach(fn);
		} else {
			for(var i = 0, l = obj.length; i < l; i++) {
				fn(obj[i], i);
			}
		}
	} else {
		for(var key in obj) {
			if(obj.hasOwnProperty(key)) {
				fn(obj[key], key);
			}
		}
	}
}
function bind(fn, thisVal) {
	if(typeof fn.bind == 'function') {
		return fn.bind.apply(fn, Array.prototype.slice.call(arguments, 1));
	}
	var args = Array.prototype.slice.call(arguments, 2);
	return function() {
		return fn.apply(thisVal, args.concat(Array.prototype.slice.apply(arguments)));
	};
}
function addEvent(element, type, fn) {
	if(element.addEventListener) {
		element.addEventListener(type, fn, false);
	} else if(element.attachEvent) {
		element.attachEvent('on' + type, fn);
	}
}

function removeEvent(element, type, fn) {
	if(element.removeEventListener) {
		element.removeEventListener(type, fn, false);
	} else if(element.detachEvent) {
		element.detachEvent('on' + type, fn);
	}
}

function mixin(obj, mixin) {
	for(var key in mixin) {
		if(mixin.hasOwnProperty(key)) {
			obj[key] = mixin[key];
		}
	}
}

var Events = {
	addEvent: function(type, fn) {
		if(!this.events) {
			this.events = {};
		}
		if(!this.events[type]) {
			this.events[type] = [];
		}
		this.events[type].push(fn);
	},
	removeEvent: function(type, fn) {
		if(this.events) {
			var fns = this.events[type];
			for(var i = 0, l = fns.length; i < l; i += 1) {
				if(fns[i] == fn) {
					fns.splice(i, 1);
					break;
				}
			}
		}
	},
	_fireEvent: function(type) {
		if(this.events) {
			var fns = this.events[type];
			if(fns.length) {
				var args = Array.prototype.slice.call(arguments, 1);
				for(var i = 0, l = fns.length; i < l; i++) {
					fns[i].apply(null, args);
				}
			}
		}
	}
};

  function $(id) {
    return doc.getElementById(id);
  }

  function log() {
    if (win.console && typeof win.console.log == 'function') {
      win.console.log.apply(console, arguments);
    }
  }

  function clone(obj) {
    if (obj instanceof Array) {
      var n = [];
      for (var i = 0, l = obj.length; i < l; i++) {
        n[i] = clone(obj[i]);
      }
      return n;
    } else {
      if (typeof obj.clone == 'function') {
        obj = obj.clone();
      }
      return obj;
    }
  }

  function toArray(obj) {
    if (obj instanceof Array) return obj;
    if (obj != undefined && obj != null) return [obj];
    return [];
  }

  function errorFunction(msg) {
    var error = new Error(msg);
    return function() {
      throw error;
    };
  }

  function removeFromArray(arr, obj) {
    var index = arr.indexOf(obj);
    if (index != -1) arr.splice(index, 1);
  }

  function stop(obj) {
    clearTimeout(obj);
    clearInterval(obj);
    if (typeof obj.abort == 'function') obj.abort();
  }

  function capitalize(str) {
    return str.replace(/(?:\s|-|_)([a-z])/g, function(x, letter) {
      return letter.toUpperCase();
    });
  }

  var keys = {
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
  };

  function getKey(evt) {
    var key = keys[evt.keyCode];
    if (!key) {
      key = String.fromCharCode(evt.keyCode);
      if (!evt.shiftKey) {
        key = key.toLowerCase();
      }
    }
    return key;
  }

  var browser = (function() {
    var ua = navigator.userAgent.toLowerCase();
    var UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0];
    return (UA[1] == 'version') ? UA[3] : UA[1];
  })();

  log('browser detected: ' + browser);

  function getLineNumber(stack, n) {
    var self = getLineNumber;
    if (self.hasOwnProperty(browser)) {
      return self[browser](stack, n);
    } else {
      return null;
    }
  }

  getLineNumber.chrome = function(stack, n) {
    var lines = stack.split("\n");
    var line = lines[1+n];
    var match = line.match(/:(\d+):\d+\)?$/);
    if (match) {
      return Number(match[1]);
    } else {
      return null;
    }
  };

  getLineNumber.firefox = function(stack, n) {
    var lines = stack.split("\n");
    var line = lines[1+n];
    var match = line.match(/:(\d+)$/);
    if (match) {
      return Number(match[1]);
    } else {
      return null;
    }
  };

  getLineNumber.possible = function() {
    return this.hasOwnProperty(browser);
  };


  /*
   * Model
   */

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


  function Position(x, y) {
    this.x = x;
    this.y = y;
  }

  Position.prototype.clone = function() {
    return new Position(this.x, this.y);
  };

  Position.prototype.plus = function(another) {
    return new Position(this.x + another.x, this.y + another.y);
  };

  Position.prototype.equals = function(another) {
    return another instanceof Position
           && another.x == this.x
           && another.y == this.y;
  };

  Position.NORTH = new Position(0, -1);
  Position.prototype.isNorth = function() {
    return this.equals(Position.NORTH);
  };

  Position.SOUTH = new Position(0, 1);
  Position.prototype.isSouth = function() {
    return this.equals(Position.SOUTH);
  };

  Position.WEST = new Position(-1, 0);
  Position.prototype.isWest = function() {
    return this.equals(Position.WEST);
  };

  Position.EAST = new Position(1, 0);
  Position.prototype.isEast = function() {
    return this.equals(Position.EAST);
  };


  function Environment(width, depth, height) {
    this.width = width;
    this.depth = depth;
    this.height = height;

    this.position = new Position(0, 0);
    this.direction = Position.SOUTH.clone();

    this.createFields();
    this.initBeepSound();
  }

  mixin(Environment.prototype, Events);

  Environment.prototype.createFields = function() {
    var w = this.width,
        d = this.depth;

    var fields = this.fields = [];
    for (var i = 0; i < w; i++) {
      var row = [];
      for (var j = 0; j < d; j++) {
        row.push(new Field());
      }
      fields.push(row);
    }
  };

  Environment.prototype.getField = function(position) {
    return this.fields[position.x][position.y];
  };

  Environment.prototype.forward = function() {
    return this.position.plus(this.direction);
  };

  Environment.prototype.istZiegel = function(n) {
    if (this.istWand()) return false;
    var ziegel = this.getField(this.forward()).ziegel;
    return n ? (ziegel == n) : !!ziegel;
  };

  Environment.prototype.hinlegen = function() {
    if (this.istWand()) throw new Error("Karol kann keinen Ziegel hinlegen. Er steht vor einer Wand.");
    var nextPosition = this.forward();
    var field = this.getField(nextPosition);
    if (field.ziegel >= this.height) throw new Error("Karol kann keinen Ziegel hinlegen, da die Maximalhoehe erreicht wurde.");
    field.ziegel += 1;
    this._fireEvent('change-field', nextPosition);
  };

  Environment.prototype.aufheben = function() {
    if (this.istWand()) throw new Error("Karol kann keinen Ziegel aufheben. Er steht vor einer Wand.");
    var nextPosition = this.forward();
    var field = this.getField(nextPosition);
    if (!field.ziegel) throw new Error("Karol kann keinen Ziegel aufheben, da kein Ziegel vor ihm liegt.");
    field.ziegel--;
    this._fireEvent('change-field', nextPosition);
  };

  Environment.prototype.markeSetzen = function() {
    this.getField(this.position).marke = true;
    this._fireEvent('change-field', this.position);
  };

  Environment.prototype.markeLoeschen = function() {
    this.getField(this.position).marke = false;
    this._fireEvent('change-field', this.position);
  };

  Environment.prototype.marke = function() {
    var field = this.getField(this.position);
    field.marke = !field.marke;
    this._fireEvent('change-field', this.position);
  };

  Environment.prototype.istMarke = function() {
    return this.getField(this.position).marke;
  };

  Environment.prototype.isValid = function(position) {
    var x = position.x,
        z = position.y;
    return x >= 0 && x < this.width && z >= 0 && z < this.depth;
  };

  Environment.prototype.istWand = function() {
    var next = this.forward();
    return !this.isValid(next) || this.getField(next).quader;
  };

  Environment.prototype.linksDrehen = function() {
    this.direction = new Position(this.direction.y, -this.direction.x);
    this._fireEvent('change-robot');
  };

  Environment.prototype.rechtsDrehen = function() {
    this.direction = new Position(-this.direction.y, this.direction.x);
    this._fireEvent('change-robot');
  };

  Environment.prototype.schritt = function() {
    if (this.istWand()) throw new Error("Karol kann keinen Schritt machen, er steht vor einer Wand.");
    var newPosition = this.forward();
    if (Math.abs(this.getField(this.position).ziegel - this.getField(newPosition).ziegel) > 1)
      throw new Error("Karol kann nur einen Ziegel pro Schritt nach oben oder unten springen.");
    this.position = newPosition;
    this._fireEvent('change-robot');
  };

  Environment.prototype.quader = function() {
    var position = this.forward();
    if (!this.isValid(position)) throw new Error("Karol kann keinen Quader hinlegen. Er steht vor einer Wand.");
    var field = this.getField(position);
    if (field.quader) throw new Error("Karol kann keinen Quader hinlegen, da schon einer liegt.");
    if (field.ziegel) throw new Error("Karol kann keinen Quader hinlegen, da auf dem Feld schon Ziegel liegen.");
    field.quader = true;
    this._fireEvent('change-field', position);
  };

  Environment.prototype.entfernen = function() {
    var position = this.forward();
    if (!this.isValid(position)) throw new Error("Karol kann keinen Quader entfernen. Er steht vor einer Wand.");
    var field = this.getField(position);
    if (!field.quader) throw new Error("Karol kann keinen Quader entfernen, da auf dem Feld kein Quader liegt.");
    field.quader = false;
    this._fireEvent('change-field', position);
  };

  Environment.prototype.initBeepSound = function() {
    if (win.Audio) {
      var sound = this.beepSound = new win.Audio();
      if (sound.canPlayType('audio/ogg; codecs="vorbis"')) {
        sound.src = 'beep.ogg';
      } else if (sound.canPlayType('audio/mpeg;')) {
        sound.src = 'beep.mp3';
      }
    }
  };

  Environment.prototype.ton = function() {
    var sound = this.beepSound;
    if (sound) {
      sound.play();
      this.initBeepSound(); // Because Chrome can't replay
    }
  };

  Environment.prototype.istNorden = function() {
    return this.direction.equals(new Position(0, -1));
  };

  Environment.prototype.istSueden = function() {
    return this.direction.equals(new Position(0, 1));
  };

  Environment.prototype.istWesten = function() {
    return this.direction.equals(new Position(-1, 0));
  };

  Environment.prototype.istOsten = function() {
    return this.direction.equals(new Position(1, 0));
  };

  Environment.prototype.run = function(code) {
    this.backup = this.clone();

    var self = this;
    this.execute(code, function(stack) {
      log('Commands: ' + stack.join(', '));
      self.stack = stack;
    });
  };

  Environment.prototype.clone = function() {
    var env = new Environment(this.width, this.depth, this.height);
    env.copy(this);
    return env;
  };

  Environment.prototype.copy = function(other) {
    this.position  = other.position.clone();
    this.direction = other.direction.clone();
    this.fields = clone(other.fields);
  };

  Environment.prototype.execute = function(code, callback) {
    var iframe = doc.createElement('iframe');
    iframe.style.display = 'none';
    doc.body.appendChild(iframe);
    var win = iframe.contentWindow;
    win.parent = null;
    var karol = win.karol = {};
    var stack = [];
    var self = this;
    var timed = [];
    var END_EXC = new Error('end');

    function stopAll() {
      each(timed, stop);
      timed = [];
    }

    function exec(fn) {
      try {
        fn();
      } catch (exc) {
        if (exc != END_EXC) {
          stack.push(exc);
        }
        stopAll();
      }
      end();
    }

    function end() {
      if (!timed.length) {
        doc.body.removeChild(iframe);
        callback(stack);
      }
    }

    each(['istWand', 'schritt', 'linksDrehen', 'rechtsDrehen', 'hinlegen', 'aufheben', 'istZiegel', 'markeSetzen', 'markeLoeschen', 'istMarke', 'istNorden', 'istSueden', 'istWesten', 'istOsten', 'ton'], function(name) {
      karol[name] = function(n) {
        n = n || 1;

        if (HIGHLIGHT_LINE) {
          try {
            throw new Error();
          } catch (exc) {
            var lineNumber = getLineNumber(exc.stack, 1);
          }
        } else {
          var lineNumber = null;
        }

        if (self[name].length == 0) {
          for (var i = 0; i < n; i++) {
            var result = self[name]();
            stack.push([name, lineNumber]);
          }
        } else {
          var result = self[name].apply(self, arguments);
          stack.push([name, lineNumber]);
        }
        return result;
      };
    });

    win.warten = function(fn, ms) {
      var timeout = setTimeout(function() {
        removeFromArray(timed, timeout);
        exec(fn);
      }, ms);
      timed.push(timeout);
      return timeout;
    };

    win.periode = function(fn, ms) {
      var interval = setInterval(function() {
        exec(fn);
      }, ms);
      timed.push(interval);
      return interval;
    };

    win.laden = function(url, fn) {
      var xhr = get(url, function(responseText, responseXML) {
        log(url, responseText, responseXML);
        removeFromArray(timed, xhr);
        exec(bind(fn, null, responseText, responseXML));
      }, function() {
        log('Loading failed: ' + url);
      });
      timed.push(xhr);
      return xhr;
    };

    win.stoppen = function(obj) {
      stop(obj);
      removeFromArray(timed, obj);
      end();
    };

    win.beenden = function() {
      throw END_EXC;
    };

    exec(function() {
      win.document.write('<script>'+code+'</script>'); // evil, I know
    });
  };

  Environment.prototype.next = function() {
    var pair = this.stack.shift()
    ,   command = pair[0]
    ,   lineNumber = pair[1];

    if (typeof command == 'string') {
      this[command]();
    } else if (command instanceof Error) {
      win.alert(command);
    }

    if (lineNumber) {
      this._fireEvent('line', lineNumber);
    }
  };

  Environment.prototype.replay = function() {
    this.reset();

    var self = this;
    var interval = setInterval(function() {
      if (self.stack.length == 0) {
        clearInterval(interval);
      } else {
        self.next();
        self.onchange && self.onchange();
      }
    }, 150);
  };

  Environment.prototype.reset = function() {
    this.copy(this.backup);
    this._fireEvent('complete-change');
  };

  Environment.prototype.eachField = function(fn) {
    var w = this.width
    ,   d = this.depth;
    for (var x = 0; x < w; x++) {
      for (var y = 0; y < d; y++) {
        fn(x, y, this.fields[x][y]);
      }
    }
  };


  /*
   * View
   */

  var ENVIRONMENT_COLORS = (function() {
    var C = {};
    function def(name, hex) {
      C[name] = {
        css: '#'+hex,
        hex: parseInt(hex, 16)
      };
    }

    def('ziegel', 'ff0000');
    def('quader', '666666');
    def('marke',  'cccc55');

    return C;
  })();


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


  function EnvironmentView3D(model) {
    this.model = model;
    this.createFields();

    var self = this;
    model.addEvent('change-field', function (position) {
      var x = position.x, y = position.y;
      self.updateField(x, y, model.fields[x][y]);
      self.delayRender();
    });
    model.addEvent('change-robot', function() {
      self.delayRender();
    });
    model.addEvent('complete-change', function() {
      self.updateAllFields();
      self.render();
    });

    this.renderer = new T.CanvasRenderer();
    this.createMouseListener();
    this.scene = new T.Scene();
    this.degrees = 45;
    this.cameraZ = 120;
    this.createGrid();
    this.createLights();
  }

  EnvironmentView3D.GW = 40; // Grid Width
  EnvironmentView3D.GH = 25; // Grid Height

  EnvironmentView3D.prototype = new View();

  EnvironmentView3D.prototype.createMouseListener = function() {
    var self = this;

    addEvent(this.renderer.domElement, 'mousedown', function(evt) {
      var down = { x: evt.clientX, y: evt.clientY };
      doc.body.style.cursor = 'move';

      function onMouseMove(evt) {
        var newDown = { x: evt.clientX, y: evt.clientY };
        var d_x = down.x - newDown.x,
            d_y = down.y - newDown.y;
        self.degrees += d_x / 4;
        self.cameraZ -= d_y * 2;
        self.updateCameraPosition();
        self.render();
        down = newDown;
      }

      function onMouseUp() {
        doc.body.style.cursor = 'default';
        removeEvent(doc.body, 'mousemove', onMouseMove);
        removeEvent(doc.body, 'mouseup', onMouseUp);
      }

      addEvent(doc.body, 'mousemove', onMouseMove);
      addEvent(doc.body, 'mouseup', onMouseUp);
    });
  };

  EnvironmentView3D.prototype.createGrid = function() {
    var model = this.model;
    var w = model.width,
        d = model.depth,
        h = model.height;

    var material = new T.MeshBasicMaterial({ color: 0x5555cc, wireframe: true });
    var GW = EnvironmentView3D.GW;
    var GH = EnvironmentView3D.GH;

    var plane = new T.Mesh(new Plane(w*GW, d*GW, w, d), material);
    plane.doubleSided = true;
    this.scene.addObject(plane);

    var plane = new T.Mesh(new Plane(w*GW, h*GH, w, h), material);
    plane.position.y = (d/2)*GW;
    plane.position.z = (h/2)*GH;
    plane.rotation.x = Math.PI/2;
    plane.doubleSided = true;
    this.scene.addObject(plane);

    var plane = new T.Mesh(new Plane(h*GH, d*GW, h, d), material);
    plane.position.x = -(w/2)*GW;
    plane.position.z = (h/2)*GH;
    plane.rotation.y = Math.PI/2;
    plane.doubleSided = true;
    this.scene.addObject(plane);
  };

  EnvironmentView3D.prototype.createLights = function() {
    var l = new T.AmbientLight(0x888888);
    this.scene.addLight(l);

    var l = this.light = new T.DirectionalLight(0xaaaaaa);
    this.scene.addLight(l);
  };

  EnvironmentView3D.prototype.createFields = function() {
    var model = this.model;
    var w = model.width,
        d = model.depth;

    var fields = this.fields = [];
    for (var i = 0; i < w; i++) {
      var row = [];
      for (var j = 0; j < d; j++) {
        row.push({ ziegel: [], marke: null });
      }
      fields.push(row);
    }
  };

  EnvironmentView3D.prototype.updateAllFields = function() {
    this.model.eachField(bind(this.updateField, this));
  };

  EnvironmentView3D.prototype.updateField = function(x, y, field) {
    var model = this.model;
    var scene = this.scene;
    var fieldObj = this.fields[x][y];

    var GW = EnvironmentView3D.GW,
        GH = EnvironmentView3D.GH;
    var x0 = -GW*(model.width/2),
        y0 = GW*(model.depth/2);

    function createCubeMaterial(props) {
      var materials = [];
      for (var i = 0; i < 6; i++) {
        materials.push([new T.MeshBasicMaterial(props)]);
      }
      return materials;
    }

    var QUADER_MATERIAL = createCubeMaterial({ color: ENVIRONMENT_COLORS.quader.hex });


    while (field.ziegel < fieldObj.ziegel.length) {
      scene.removeObject(fieldObj.ziegel.pop());
      if (fieldObj.marke) {
        fieldObj.marke.position.z = fieldObj.ziegel.length*GH;
      }
    }

    while (field.ziegel > fieldObj.ziegel.length) {
      var z = fieldObj.ziegel.length;
      var cube = new T.Mesh(
        new Cube(GW, GW, GH, 1, 1, new T.MeshLambertMaterial({ color: ENVIRONMENT_COLORS.ziegel.hex, shading: T.FlatShading })),
        new T.MeshFaceMaterial()
      );
      cube.position.x = GW/2 + x0 + x*GW;
      cube.position.y = -GW/2 + y0 - y*GW;
      cube.position.z = GH/2 + z*GH;
      scene.addObject(cube);
      fieldObj.ziegel.push(cube);
      if (fieldObj.marke) {
        fieldObj.marke.position.z = fieldObj.ziegel.length*GH;
      }
    }

    if (!field.marke && fieldObj.marke) {
      scene.removeObject(fieldObj.marke);
      delete fieldObj.marke;
    }

    if (field.marke && !fieldObj.marke) {
      var marke = new T.Mesh(
        new Plane(GW, GW, 1, 1),
        new T.MeshBasicMaterial({ color: ENVIRONMENT_COLORS.marke.hex })
      );
      marke.position.x = GW/2 + x0 + x*GW;
      marke.position.y = -GW/2 + y0 - y*GW;
      marke.position.z = fieldObj.ziegel.length*GH + 1;
      scene.addObject(marke);
      fieldObj.marke = marke;
    }

    if (field.quader && !fieldObj.quader) {
      var cube = new T.Mesh(new Cube(GW, GW, 2*GH, 1, 1, QUADER_MATERIAL), new T.MeshFaceMaterial());
      cube.position.x = GW/2 + x0 + x*GW;
      cube.position.y = -GW/2 + y0 - y*GW;
      cube.position.z = GH;
      scene.addObject(cube);
      fieldObj.quader = cube;
    }

    if (!field.quader && fieldObj.quader) {
      scene.removeObject(fieldObj.quader);
      delete fieldObj.quader;
    }
  };

  EnvironmentView3D.prototype.render = function() {
    log('render 3d');
    this.renderer.render(this.scene, this.camera);
  };

  EnvironmentView3D.prototype.updateSize = function(dimensions) {
    var w = dimensions.width, h = dimensions.height;
    this.createCamera(w, h);
    this.renderer.setSize(w, h);
  };

  EnvironmentView3D.prototype.createCamera = function(width, height) {
    var camera = this.camera = new T.Camera(75, width/height, 1, 1e5);
    camera.up = new T.Vector3(0, 0, 1);
    this.updateCameraPosition();
  };

  EnvironmentView3D.prototype.updateCameraPosition = function() {
    var degrees = this.degrees;
    var radian = degrees * (Math.PI/180);
    var p1 = this.camera.position;
    var p2 = this.light.position;

    var RADIUS = 400;
    p1.x = p2.x =  Math.sin(radian) * RADIUS;
    p1.y = p2.y = -Math.cos(radian) * RADIUS;
    p1.z = p2.z = this.cameraZ;

    p2.normalize();
  };

  EnvironmentView3D.prototype.getElement = function() {
    return this.renderer.domElement;
  };


  function EnvironmentView2D(model) {
    this.model = model;

    var boundDelayRender = bind(this.delayRender, this);
    model.addEvent('change-field', boundDelayRender);
    model.addEvent('change-robot', boundDelayRender);
    model.addEvent('complete-change', bind(this.render, this));

    this.canvas = doc.createElement('canvas');
  }

  EnvironmentView2D.prototype = new View();

  EnvironmentView2D.prototype.render = function() {
    log('render 2d');

    var model = this.model;
    var ctx = this.canvas.getContext('2d');

    var GAP = 4;
    var GW = Math.min((this.width-GAP) / model.width, (this.height-GAP) / model.depth); // GridWidth

    ctx.save();
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, this.width, this.height);
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
    this.width  = this.canvas.width  = dimensions.width;
    this.height = this.canvas.height = dimensions.height;
  };

  EnvironmentView2D.prototype.getElement = function() {
    return this.canvas;
  };


  /*
   * Controller
   */

  function AppController() {
    this.initModelAndView();

    win.onBespinLoad = bind(this.initBespin, this);
    var self = this;
    get('examples/pyramid.js', function(text) {
      self.exampleCode = text;
      self.initExampleCode();
    });

    this.initButtons();
    this.initKeyboard();
    this.addEvents();
  }

  AppController.prototype.initModelAndView = function() {
    this.environment = new Environment(
      parseInt($('width').value, 10),
      parseInt($('depth').value, 10),
      parseInt($('height').value, 10)
    );
    var self = this;
    this.environment.addEvent('line', function(lineNumber) {
      self.editor.setLineNumber(lineNumber);
    });

    $('environment').innerHTML = '';
    this.environmentView3D = new EnvironmentView3D(this.environment);
    this.environmentView2D = new EnvironmentView2D(this.environment);
    this.updateViewPrecedence();
  };

  AppController.prototype.updateViewPrecedence = function() {
    var environmentEl = $('environment');
    var d3 = this.environmentView3D,
        d2 = this.environmentView2D;
    if ($('view-select-3d').checked) {
      d2.dispose();
      d3.inject(environmentEl);
    } else {
      d3.dispose();
      d2.inject(environmentEl);
    }
  };

  AppController.prototype.initBespin = function() {
    var self = this;
    bespin.useBespin($('editor')).then(function(env) {
      self.bespinEnv = env;
      self.editor = env.editor;
      self.editor.syntax = 'js';
      self.initExampleCode();
    }, function() {
      log('Bespin launch failed');
    });
  };

  AppController.prototype.initExampleCode = function() {
    if (this.exampleCode && this.editor) {
      this.editor.value = this.exampleCode;
    }
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

    addEvent($('run-button'),        'click', bind(this.run, this));
    addEvent($('replay-button'),     'click', bind(this.replay, this));
    addEvent($('reset-button'),      'click', bind(this.reset, this));
    addEvent($('view-select-3d'),    'change', bind(this.updateViewPrecedence, this));
    addEvent($('view-select-2d'),    'change', bind(this.updateViewPrecedence, this));
    addEvent($('new-button'),        'click', bind(this.toggleNewPane, this));
    addEvent($('new-cancel-button'), 'click', bind(this.toggleNewPane, this));
    addEvent($('new-apply-button'),  'click', function() {
      self.initModelAndView();
      self.toggleNewPane();
    });

    each(['links-drehen', 'schritt', 'rechts-drehen', 'hinlegen', 'aufheben', 'marke', 'quader', 'entfernen'], function(name) {
      var button = $(name);
      var command = capitalize(name);
      addEvent(button, 'click', function() {
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
    addEvent(doc, 'keydown', function(evt) {
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
      self.bespinEnv.dimensionsChanged();
      self.environmentView2D.dimensionsChanged();
      self.environmentView3D.dimensionsChanged();
    }

    var resizeTimeout = null;
    addEvent(win, 'resize', function() {
      win.clearTimeout(resizeTimeout);
      win.setTimeout(resize, 25);
    });
  };

  AppController.prototype.run = function() {
    this.environment.run(this.editor.value);
  };

  AppController.prototype.replay = function() {
    this.environment.replay();
  };

  AppController.prototype.reset = function() {
    this.environment.reset();
  };

  AppController.prototype.toggleNewPane = function() {
    var el = $('new-pane');
    var classRegex = /(^|\s)visible(\s|$)/
    if (el.className.match(classRegex)) {
      el.className = el.className.replace(classRegex, ' ');
    } else {
      el.className += ' visible';
    }
  };

  new AppController();
})(window, document);
