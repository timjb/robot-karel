
/**
 * Main function giving a function stack trace with a forced or passed in Error
 *
 * @cfg {Error} e The error to create a stacktrace from (optional)
 * @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
 * @return {Array} of Strings with functions, lines, files, and arguments where possible
 */
function printStackTrace(options) {
    var ex = (options && options.e) ? options.e : null;
    var guess = options ? !!options.guess : true;

    var p = new printStackTrace.implementation();
    var result = p.run(ex);
    return (guess) ? p.guessFunctions(result) : result;
}

printStackTrace.implementation = function() {};

printStackTrace.implementation.prototype = {
    run: function(ex) {
        var mode = this._mode || this.mode();
        if (mode === 'other') {
            return this.other(arguments.callee);
        } else {
            ex = ex ||
                (function() {
                    try {
                        var _err = __undef__ << 1;
                    } catch (e) {
                        return e;
                    }
                })();
            return this[mode](ex);
        }
    },

    /**
     * @return {String} mode of operation for the environment in question.
     */
    mode: function() {
        try {
            var _err = __undef__ << 1;
        } catch (e) {
            if (e['arguments']) {
                return (this._mode = 'chrome');
            } else if (window.opera && e.stacktrace) {
                return (this._mode = 'opera10');
            } else if (e.stack) {
                return (this._mode = 'firefox');
            } else if (window.opera && !('stacktrace' in e)) { //Opera 9-
                return (this._mode = 'opera');
            }
        }
        return (this._mode = 'other');
    },

    /**
     * Given a context, function name, and callback function, overwrite it so that it calls
     * printStackTrace() first with a callback and then runs the rest of the body.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to instrument
     * @param {Function} function to call with a stack trace on invocation
     */
    instrumentFunction: function(context, functionName, callback) {
        context = context || window;
        context['_old' + functionName] = context[functionName];
        context[functionName] = function() {
            callback.call(this, printStackTrace());
            return context['_old' + functionName].apply(this, arguments);
        };
        context[functionName]._instrumented = true;
    },

    /**
     * Given a context and function name of a function that has been
     * instrumented, revert the function to it's original (non-instrumented)
     * state.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to de-instrument
     */
    deinstrumentFunction: function(context, functionName) {
        if (context[functionName].constructor === Function &&
                context[functionName]._instrumented &&
                context['_old' + functionName].constructor === Function) {
            context[functionName] = context['_old' + functionName];
        }
    },

    /**
     * Given an Error object, return a formatted Array based on Chrome's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    chrome: function(e) {
        return e.stack.replace(/^[^\n]*\n/, '').replace(/^[^\n]*\n/, '').replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@').split('\n');
    },

    /**
     * Given an Error object, return a formatted Array based on Firefox's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    firefox: function(e) {
        return e.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
    },

    /**
     * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    opera10: function(e) {
        var stack = e.stacktrace;
        var lines = stack.split('\n'), ANON = '{anonymous}',
            lineRE = /.*line (\d+), column (\d+) in ((<anonymous function\:?\s*(\S+))|([^\(]+)\([^\)]*\))(?: in )?(.*)\s*$/i, i, j, len;
        for (i = 2, j = 0, len = lines.length; i < len - 2; i++) {
            if (lineRE.test(lines[i])) {
                var location = RegExp.$6 + ':' + RegExp.$1 + ':' + RegExp.$2;
                var fnName = RegExp.$3;
                fnName = fnName.replace(/<anonymous function\s?(\S+)?>/g, ANON);
                lines[j++] = fnName + '@' + location;
            }
        }

        lines.splice(j, lines.length - j);
        return lines;
    },

    opera: function(e) {
        var lines = e.message.split('\n'), ANON = '{anonymous}',
            lineRE = /Line\s+(\d+).*script\s+(http\S+)(?:.*in\s+function\s+(\S+))?/i,
            i, j, len;

        for (i = 4, j = 0, len = lines.length; i < len; i += 2) {
            if (lineRE.test(lines[i])) {
                lines[j++] = (RegExp.$3 ? RegExp.$3 + '()@' + RegExp.$2 + RegExp.$1 : ANON + '()@' + RegExp.$2 + ':' + RegExp.$1) + ' -- ' + lines[i + 1].replace(/^\s+/, '');
            }
        }

        lines.splice(j, lines.length - j);
        return lines;
    },

    other: function(curr) {
        var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i,
            stack = [], j = 0, fn, args;

        var maxStackSize = 10;
        while (curr && stack.length < maxStackSize) {
            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
            args = Array.prototype.slice.call(curr['arguments']);
            stack[j++] = fn + '(' + this.stringifyArguments(args) + ')';
            curr = curr.caller;
        }
        return stack;
    },

    /**
     * Given arguments array as a String, subsituting type names for non-string types.
     *
     * @param {Arguments} object
     * @return {Array} of Strings with stringified arguments
     */
    stringifyArguments: function(args) {
        for (var i = 0; i < args.length; ++i) {
            var arg = args[i];
            if (arg === undefined) {
                args[i] = 'undefined';
            } else if (arg === null) {
                args[i] = 'null';
            } else if (arg.constructor) {
                if (arg.constructor === Array) {
                    if (arg.length < 3) {
                        args[i] = '[' + this.stringifyArguments(arg) + ']';
                    } else {
                        args[i] = '[' + this.stringifyArguments(Array.prototype.slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(Array.prototype.slice.call(arg, -1)) + ']';
                    }
                } else if (arg.constructor === Object) {
                    args[i] = '#object';
                } else if (arg.constructor === Function) {
                    args[i] = '#function';
                } else if (arg.constructor === String) {
                    args[i] = '"' + arg + '"';
                }
            }
        }
        return args.join(',');
    },

    sourceCache: {},

    /**
     * @return the text from a given URL.
     */
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

    /**
     * Try XHR methods in order and store XHR factory.
     *
     * @return <Function> XHR function or equivalent
     */
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

    /**
     * Given a URL, check if it is in the same domain (so we can get the source
     * via Ajax).
     *
     * @param url <String> source url
     * @return False if we need a cross-domain request
     */
    isSameDomain: function(url) {
        return url.indexOf(location.hostname) !== -1;
    },

    /**
     * Get source code from given URL if in the same domain.
     *
     * @param url <String> JS source URL
     * @return <String> Source code
     */
    getSource: function(url) {
        if (!(url in this.sourceCache)) {
            this.sourceCache[url] = this.ajax(url).split('\n');
        }
        return this.sourceCache[url];
    },

    guessFunctions: function(stack) {
        for (var i = 0; i < stack.length; ++i) {
            var reStack = /\{anonymous\}\(.*\)@(\w+:\/\/([\-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/;
            var frame = stack[i], m = reStack.exec(frame);
            if (m) {
                var file = m[1], lineno = m[4]; //m[7] is character position in Chrome
                if (file && this.isSameDomain(file) && lineno) {
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
        var line = "", maxLines = 10;
        for (var i = 0; i < maxLines; ++i) {
            line = source[lineNo - i] + line;
            if (line !== undefined) {
                var m = reGuessFunction.exec(line);
                if (m && m[1]) {
                    return m[1];
                } else {
                    m = reFunctionArgNames.exec(line);
                    if (m && m[1]) {
                        return m[1];
                    }
                }
            }
        }
        return '(?)';
    }
};
var THREE=THREE||{};THREE.Color=function(a){this.autoUpdate=true;this.setHex(a)};
THREE.Color.prototype={setRGB:function(a,b,f){this.r=a;this.g=b;this.b=f;if(this.autoUpdate){this.updateHex();this.updateStyleString()}},setHex:function(a){this.hex=~~a&16777215;if(this.autoUpdate){this.updateRGBA();this.updateStyleString()}},updateHex:function(){this.hex=~~(this.r*255)<<16^~~(this.g*255)<<8^~~(this.b*255)},updateRGBA:function(){this.r=(this.hex>>16&255)/255;this.g=(this.hex>>8&255)/255;this.b=(this.hex&255)/255},updateStyleString:function(){this.__styleString="rgb("+~~(this.r*255)+
","+~~(this.g*255)+","+~~(this.b*255)+")"},toString:function(){return"THREE.Color ( r: "+this.r+", g: "+this.g+", b: "+this.b+", hex: "+this.hex+" )"}};THREE.Vector2=function(a,b){this.x=a||0;this.y=b||0};
THREE.Vector2.prototype={set:function(a,b){this.x=a;this.y=b;return this},copy:function(a){this.x=a.x;this.y=a.y;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;return this},unit:function(){this.multiplyScalar(1/this.length());return this},length:function(){return Math.sqrt(this.x*
this.x+this.y*this.y)},lengthSq:function(){return this.x*this.x+this.y*this.y},negate:function(){this.x=-this.x;this.y=-this.y;return this},clone:function(){return new THREE.Vector2(this.x,this.y)},toString:function(){return"THREE.Vector2 ("+this.x+", "+this.y+")"}};THREE.Vector3=function(a,b,f){this.x=a||0;this.y=b||0;this.z=f||0};
THREE.Vector3.prototype={set:function(a,b,f){this.x=a;this.y=b;this.z=f;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z;return this},
cross:function(a,b){this.x=a.y*b.z-a.z*b.y;this.y=a.z*b.x-a.x*b.z;this.z=a.x*b.y-a.y*b.x;return this},crossSelf:function(a){var b=this.x,f=this.y,d=this.z;this.x=f*a.z-d*a.y;this.y=d*a.x-b*a.z;this.z=b*a.y-f*a.x;return this},multiply:function(a,b){this.x=a.x*b.x;this.y=a.y*b.y;this.z=a.z*b.z;return this},multiplySelf:function(a){this.x*=a.x;this.y*=a.y;this.z*=a.z;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;return this},divideScalar:function(a){this.x/=a;this.y/=a;this.z/=
a;return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},distanceTo:function(a){var b=this.x-a.x,f=this.y-a.y;a=this.z-a.z;return Math.sqrt(b*b+f*f+a*a)},distanceToSquared:function(a){var b=this.x-a.x,f=this.y-a.y;a=this.z-a.z;return b*b+f*f+a*a},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},negate:function(){this.x=-this.x;this.y=-this.y;this.z=-this.z;return this},normalize:function(){var a=
Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);a>0?this.multiplyScalar(1/a):this.set(0,0,0);return this},setLength:function(a){return this.normalize().multiplyScalar(a)},isZero:function(){return Math.abs(this.x)<1.0E-4&&Math.abs(this.y)<1.0E-4&&Math.abs(this.z)<1.0E-4},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)},toString:function(){return"THREE.Vector3 ( "+this.x+", "+this.y+", "+this.z+" )"}};
THREE.Vector4=function(a,b,f,d){this.x=a||0;this.y=b||0;this.z=f||0;this.w=d||1};
THREE.Vector4.prototype={set:function(a,b,f,d){this.x=a;this.y=b;this.z=f;this.w=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w||1;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;this.w=a.w+b.w;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z;this.w+=a.w;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;this.w=a.w-b.w;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z;this.w-=a.w;
return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;this.w*=a;return this},divideScalar:function(a){this.x/=a;this.y/=a;this.z/=a;this.w/=a;return this},lerpSelf:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;this.z+=(a.z-this.z)*b;this.w+=(a.w-this.w)*b},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)},toString:function(){return"THREE.Vector4 ("+this.x+", "+this.y+", "+this.z+", "+this.w+")"}};
THREE.Ray=function(a,b){this.origin=a||new THREE.Vector3;this.direction=b||new THREE.Vector3};
THREE.Ray.prototype={intersectScene:function(a){var b,f,d=a.objects,h=[];a=0;for(b=d.length;a<b;a++){f=d[a];if(f instanceof THREE.Mesh)h=h.concat(this.intersectObject(f))}h.sort(function(j,q){return j.distance-q.distance});return h},intersectObject:function(a){function b(N,t,R,D){D=D.clone().subSelf(t);R=R.clone().subSelf(t);var L=N.clone().subSelf(t);N=D.dot(D);t=D.dot(R);D=D.dot(L);var M=R.dot(R);R=R.dot(L);L=1/(N*M-t*t);M=(M*D-t*R)*L;N=(N*R-t*D)*L;return M>0&&N>0&&M+N<1}var f,d,h,j,q,m,p,c,C,A,
w,v=a.geometry,K=v.vertices,P=[];f=0;for(d=v.faces.length;f<d;f++){h=v.faces[f];A=this.origin.clone();w=this.direction.clone();j=a.matrix.multiplyVector3(K[h.a].position.clone());q=a.matrix.multiplyVector3(K[h.b].position.clone());m=a.matrix.multiplyVector3(K[h.c].position.clone());p=h instanceof THREE.Face4?a.matrix.multiplyVector3(K[h.d].position.clone()):null;c=a.rotationMatrix.multiplyVector3(h.normal.clone());C=w.dot(c);if(C<0){c=c.dot((new THREE.Vector3).sub(j,A))/C;A=A.addSelf(w.multiplyScalar(c));
if(h instanceof THREE.Face3){if(b(A,j,q,m)){h={distance:this.origin.distanceTo(A),point:A,face:h,object:a};P.push(h)}}else if(h instanceof THREE.Face4)if(b(A,j,q,p)||b(A,q,m,p)){h={distance:this.origin.distanceTo(A),point:A,face:h,object:a};P.push(h)}}}return P}};
THREE.Rectangle=function(){function a(){j=d-b;q=h-f}var b,f,d,h,j,q,m=true;this.getX=function(){return b};this.getY=function(){return f};this.getWidth=function(){return j};this.getHeight=function(){return q};this.getLeft=function(){return b};this.getTop=function(){return f};this.getRight=function(){return d};this.getBottom=function(){return h};this.set=function(p,c,C,A){m=false;b=p;f=c;d=C;h=A;a()};this.addPoint=function(p,c){if(m){m=false;b=p;f=c;d=p;h=c}else{b=b<p?b:p;f=f<c?f:c;d=d>p?d:p;h=h>c?
h:c}a()};this.add3Points=function(p,c,C,A,w,v){if(m){m=false;b=p<C?p<w?p:w:C<w?C:w;f=c<A?c<v?c:v:A<v?A:v;d=p>C?p>w?p:w:C>w?C:w;h=c>A?c>v?c:v:A>v?A:v}else{b=p<C?p<w?p<b?p:b:w<b?w:b:C<w?C<b?C:b:w<b?w:b;f=c<A?c<v?c<f?c:f:v<f?v:f:A<v?A<f?A:f:v<f?v:f;d=p>C?p>w?p>d?p:d:w>d?w:d:C>w?C>d?C:d:w>d?w:d;h=c>A?c>v?c>h?c:h:v>h?v:h:A>v?A>h?A:h:v>h?v:h}a()};this.addRectangle=function(p){if(m){m=false;b=p.getLeft();f=p.getTop();d=p.getRight();h=p.getBottom()}else{b=b<p.getLeft()?b:p.getLeft();f=f<p.getTop()?f:p.getTop();
d=d>p.getRight()?d:p.getRight();h=h>p.getBottom()?h:p.getBottom()}a()};this.inflate=function(p){b-=p;f-=p;d+=p;h+=p;a()};this.minSelf=function(p){b=b>p.getLeft()?b:p.getLeft();f=f>p.getTop()?f:p.getTop();d=d<p.getRight()?d:p.getRight();h=h<p.getBottom()?h:p.getBottom();a()};this.instersects=function(p){return Math.min(d,p.getRight())-Math.max(b,p.getLeft())>=0&&Math.min(h,p.getBottom())-Math.max(f,p.getTop())>=0};this.empty=function(){m=true;h=d=f=b=0;a()};this.isEmpty=function(){return m};this.toString=
function(){return"THREE.Rectangle ( left: "+b+", right: "+d+", top: "+f+", bottom: "+h+", width: "+j+", height: "+q+" )"}};THREE.Matrix3=function(){this.m=[]};THREE.Matrix3.prototype={transpose:function(){var a;a=this.m[1];this.m[1]=this.m[3];this.m[3]=a;a=this.m[2];this.m[2]=this.m[6];this.m[6]=a;a=this.m[5];this.m[5]=this.m[7];this.m[7]=a;return this}};
THREE.Matrix4=function(a,b,f,d,h,j,q,m,p,c,C,A,w,v,K,P){this.n11=a||1;this.n12=b||0;this.n13=f||0;this.n14=d||0;this.n21=h||0;this.n22=j||1;this.n23=q||0;this.n24=m||0;this.n31=p||0;this.n32=c||0;this.n33=C||1;this.n34=A||0;this.n41=w||0;this.n42=v||0;this.n43=K||0;this.n44=P||1};
THREE.Matrix4.prototype={identity:function(){this.n11=1;this.n21=this.n14=this.n13=this.n12=0;this.n22=1;this.n32=this.n31=this.n24=this.n23=0;this.n33=1;this.n43=this.n42=this.n41=this.n34=0;this.n44=1;return this},set:function(a,b,f,d,h,j,q,m,p,c,C,A,w,v,K,P){this.n11=a;this.n12=b;this.n13=f;this.n14=d;this.n21=h;this.n22=j;this.n23=q;this.n24=m;this.n31=p;this.n32=c;this.n33=C;this.n34=A;this.n41=w;this.n42=v;this.n43=K;this.n44=P;return this},copy:function(a){this.n11=a.n11;this.n12=a.n12;this.n13=
a.n13;this.n14=a.n14;this.n21=a.n21;this.n22=a.n22;this.n23=a.n23;this.n24=a.n24;this.n31=a.n31;this.n32=a.n32;this.n33=a.n33;this.n34=a.n34;this.n41=a.n41;this.n42=a.n42;this.n43=a.n43;this.n44=a.n44;return this},lookAt:function(a,b,f){var d=new THREE.Vector3,h=new THREE.Vector3,j=new THREE.Vector3;j.sub(a,b).normalize();d.cross(f,j).normalize();h.cross(j,d).normalize();this.n11=d.x;this.n12=d.y;this.n13=d.z;this.n14=-d.dot(a);this.n21=h.x;this.n22=h.y;this.n23=h.z;this.n24=-h.dot(a);this.n31=j.x;
this.n32=j.y;this.n33=j.z;this.n34=-j.dot(a);this.n43=this.n42=this.n41=0;this.n44=1;return this},multiplyVector3:function(a){var b=a.x,f=a.y,d=a.z,h=1/(this.n41*b+this.n42*f+this.n43*d+this.n44);a.x=(this.n11*b+this.n12*f+this.n13*d+this.n14)*h;a.y=(this.n21*b+this.n22*f+this.n23*d+this.n24)*h;a.z=(this.n31*b+this.n32*f+this.n33*d+this.n34)*h;return a},multiplyVector4:function(a){var b=a.x,f=a.y,d=a.z,h=a.w;a.x=this.n11*b+this.n12*f+this.n13*d+this.n14*h;a.y=this.n21*b+this.n22*f+this.n23*d+this.n24*
h;a.z=this.n31*b+this.n32*f+this.n33*d+this.n34*h;a.w=this.n41*b+this.n42*f+this.n43*d+this.n44*h;return a},crossVector:function(a){var b=new THREE.Vector4;b.x=this.n11*a.x+this.n12*a.y+this.n13*a.z+this.n14*a.w;b.y=this.n21*a.x+this.n22*a.y+this.n23*a.z+this.n24*a.w;b.z=this.n31*a.x+this.n32*a.y+this.n33*a.z+this.n34*a.w;b.w=a.w?this.n41*a.x+this.n42*a.y+this.n43*a.z+this.n44*a.w:1;return b},multiply:function(a,b){var f=a.n11,d=a.n12,h=a.n13,j=a.n14,q=a.n21,m=a.n22,p=a.n23,c=a.n24,C=a.n31,A=a.n32,
w=a.n33,v=a.n34,K=a.n41,P=a.n42,N=a.n43,t=a.n44,R=b.n11,D=b.n12,L=b.n13,M=b.n14,e=b.n21,k=b.n22,i=b.n23,g=b.n24,n=b.n31,l=b.n32,o=b.n33,r=b.n34,u=b.n41,E=b.n42,V=b.n43,x=b.n44;this.n11=f*R+d*e+h*n+j*u;this.n12=f*D+d*k+h*l+j*E;this.n13=f*L+d*i+h*o+j*V;this.n14=f*M+d*g+h*r+j*x;this.n21=q*R+m*e+p*n+c*u;this.n22=q*D+m*k+p*l+c*E;this.n23=q*L+m*i+p*o+c*V;this.n24=q*M+m*g+p*r+c*x;this.n31=C*R+A*e+w*n+v*u;this.n32=C*D+A*k+w*l+v*E;this.n33=C*L+A*i+w*o+v*V;this.n34=C*M+A*g+w*r+v*x;this.n41=K*R+P*e+N*n+t*u;
this.n42=K*D+P*k+N*l+t*E;this.n43=K*L+P*i+N*o+t*V;this.n44=K*M+P*g+N*r+t*x;return this},multiplySelf:function(a){var b=this.n11,f=this.n12,d=this.n13,h=this.n14,j=this.n21,q=this.n22,m=this.n23,p=this.n24,c=this.n31,C=this.n32,A=this.n33,w=this.n34,v=this.n41,K=this.n42,P=this.n43,N=this.n44,t=a.n11,R=a.n21,D=a.n31,L=a.n41,M=a.n12,e=a.n22,k=a.n32,i=a.n42,g=a.n13,n=a.n23,l=a.n33,o=a.n43,r=a.n14,u=a.n24,E=a.n34;a=a.n44;this.n11=b*t+f*R+d*D+h*L;this.n12=b*M+f*e+d*k+h*i;this.n13=b*g+f*n+d*l+h*o;this.n14=
b*r+f*u+d*E+h*a;this.n21=j*t+q*R+m*D+p*L;this.n22=j*M+q*e+m*k+p*i;this.n23=j*g+q*n+m*l+p*o;this.n24=j*r+q*u+m*E+p*a;this.n31=c*t+C*R+A*D+w*L;this.n32=c*M+C*e+A*k+w*i;this.n33=c*g+C*n+A*l+w*o;this.n34=c*r+C*u+A*E+w*a;this.n41=v*t+K*R+P*D+N*L;this.n42=v*M+K*e+P*k+N*i;this.n43=v*g+K*n+P*l+N*o;this.n44=v*r+K*u+P*E+N*a;return this},multiplyScalar:function(a){this.n11*=a;this.n12*=a;this.n13*=a;this.n14*=a;this.n21*=a;this.n22*=a;this.n23*=a;this.n24*=a;this.n31*=a;this.n32*=a;this.n33*=a;this.n34*=a;this.n41*=
a;this.n42*=a;this.n43*=a;this.n44*=a;return this},determinant:function(){return this.n14*this.n23*this.n32*this.n41-this.n13*this.n24*this.n32*this.n41-this.n14*this.n22*this.n33*this.n41+this.n12*this.n24*this.n33*this.n41+this.n13*this.n22*this.n34*this.n41-this.n12*this.n23*this.n34*this.n41-this.n14*this.n23*this.n31*this.n42+this.n13*this.n24*this.n31*this.n42+this.n14*this.n21*this.n33*this.n42-this.n11*this.n24*this.n33*this.n42-this.n13*this.n21*this.n34*this.n42+this.n11*this.n23*this.n34*
this.n42+this.n14*this.n22*this.n31*this.n43-this.n12*this.n24*this.n31*this.n43-this.n14*this.n21*this.n32*this.n43+this.n11*this.n24*this.n32*this.n43+this.n12*this.n21*this.n34*this.n43-this.n11*this.n22*this.n34*this.n43-this.n13*this.n22*this.n31*this.n44+this.n12*this.n23*this.n31*this.n44+this.n13*this.n21*this.n32*this.n44-this.n11*this.n23*this.n32*this.n44-this.n12*this.n21*this.n33*this.n44+this.n11*this.n22*this.n33*this.n44},transpose:function(){function a(b,f,d){var h=b[f];b[f]=b[d];
b[d]=h}a(this,"n21","n12");a(this,"n31","n13");a(this,"n32","n23");a(this,"n41","n14");a(this,"n42","n24");a(this,"n43","n34");return this},clone:function(){var a=new THREE.Matrix4;a.n11=this.n11;a.n12=this.n12;a.n13=this.n13;a.n14=this.n14;a.n21=this.n21;a.n22=this.n22;a.n23=this.n23;a.n24=this.n24;a.n31=this.n31;a.n32=this.n32;a.n33=this.n33;a.n34=this.n34;a.n41=this.n41;a.n42=this.n42;a.n43=this.n43;a.n44=this.n44;return a},flatten:function(){return[this.n11,this.n21,this.n31,this.n41,this.n12,
this.n22,this.n32,this.n42,this.n13,this.n23,this.n33,this.n43,this.n14,this.n24,this.n34,this.n44]},toString:function(){return"| "+this.n11+" "+this.n12+" "+this.n13+" "+this.n14+" |\n| "+this.n21+" "+this.n22+" "+this.n23+" "+this.n24+" |\n| "+this.n31+" "+this.n32+" "+this.n33+" "+this.n34+" |\n| "+this.n41+" "+this.n42+" "+this.n43+" "+this.n44+" |"}};THREE.Matrix4.translationMatrix=function(a,b,f){var d=new THREE.Matrix4;d.n14=a;d.n24=b;d.n34=f;return d};
THREE.Matrix4.scaleMatrix=function(a,b,f){var d=new THREE.Matrix4;d.n11=a;d.n22=b;d.n33=f;return d};THREE.Matrix4.rotationXMatrix=function(a){var b=new THREE.Matrix4;b.n22=b.n33=Math.cos(a);b.n32=Math.sin(a);b.n23=-b.n32;return b};THREE.Matrix4.rotationYMatrix=function(a){var b=new THREE.Matrix4;b.n11=b.n33=Math.cos(a);b.n13=Math.sin(a);b.n31=-b.n13;return b};THREE.Matrix4.rotationZMatrix=function(a){var b=new THREE.Matrix4;b.n11=b.n22=Math.cos(a);b.n21=Math.sin(a);b.n12=-b.n21;return b};
THREE.Matrix4.rotationAxisAngleMatrix=function(a,b){var f=new THREE.Matrix4,d=Math.cos(b),h=Math.sin(b),j=1-d,q=a.x,m=a.y,p=a.z;f.n11=j*q*q+d;f.n12=j*q*m-h*p;f.n13=j*q*p+h*m;f.n21=j*q*m+h*p;f.n22=j*m*m+d;f.n23=j*m*p-h*q;f.n31=j*q*p-h*m;f.n32=j*m*p+h*q;f.n33=j*p*p+d;return f};
THREE.Matrix4.makeInvert=function(a){var b=new THREE.Matrix4;b.n11=a.n23*a.n34*a.n42-a.n24*a.n33*a.n42+a.n24*a.n32*a.n43-a.n22*a.n34*a.n43-a.n23*a.n32*a.n44+a.n22*a.n33*a.n44;b.n12=a.n14*a.n33*a.n42-a.n13*a.n34*a.n42-a.n14*a.n32*a.n43+a.n12*a.n34*a.n43+a.n13*a.n32*a.n44-a.n12*a.n33*a.n44;b.n13=a.n13*a.n24*a.n42-a.n14*a.n23*a.n42+a.n14*a.n22*a.n43-a.n12*a.n24*a.n43-a.n13*a.n22*a.n44+a.n12*a.n23*a.n44;b.n14=a.n14*a.n23*a.n32-a.n13*a.n24*a.n32-a.n14*a.n22*a.n33+a.n12*a.n24*a.n33+a.n13*a.n22*a.n34-a.n12*
a.n23*a.n34;b.n21=a.n24*a.n33*a.n41-a.n23*a.n34*a.n41-a.n24*a.n31*a.n43+a.n21*a.n34*a.n43+a.n23*a.n31*a.n44-a.n21*a.n33*a.n44;b.n22=a.n13*a.n34*a.n41-a.n14*a.n33*a.n41+a.n14*a.n31*a.n43-a.n11*a.n34*a.n43-a.n13*a.n31*a.n44+a.n11*a.n33*a.n44;b.n23=a.n14*a.n23*a.n41-a.n13*a.n24*a.n41-a.n14*a.n21*a.n43+a.n11*a.n24*a.n43+a.n13*a.n21*a.n44-a.n11*a.n23*a.n44;b.n24=a.n13*a.n24*a.n31-a.n14*a.n23*a.n31+a.n14*a.n21*a.n33-a.n11*a.n24*a.n33-a.n13*a.n21*a.n34+a.n11*a.n23*a.n34;b.n31=a.n22*a.n34*a.n41-a.n24*a.n32*
a.n41+a.n24*a.n31*a.n42-a.n21*a.n34*a.n42-a.n22*a.n31*a.n44+a.n21*a.n32*a.n44;b.n32=a.n14*a.n32*a.n41-a.n12*a.n34*a.n41-a.n14*a.n31*a.n42+a.n11*a.n34*a.n42+a.n12*a.n31*a.n44-a.n11*a.n32*a.n44;b.n33=a.n13*a.n24*a.n41-a.n14*a.n22*a.n41+a.n14*a.n21*a.n42-a.n11*a.n24*a.n42-a.n12*a.n21*a.n44+a.n11*a.n22*a.n44;b.n34=a.n14*a.n22*a.n31-a.n12*a.n24*a.n31-a.n14*a.n21*a.n32+a.n11*a.n24*a.n32+a.n12*a.n21*a.n34-a.n11*a.n22*a.n34;b.n41=a.n23*a.n32*a.n41-a.n22*a.n33*a.n41-a.n23*a.n31*a.n42+a.n21*a.n33*a.n42+a.n22*
a.n31*a.n43-a.n21*a.n32*a.n43;b.n42=a.n12*a.n33*a.n41-a.n13*a.n32*a.n41+a.n13*a.n31*a.n42-a.n11*a.n33*a.n42-a.n12*a.n31*a.n43+a.n11*a.n32*a.n43;b.n43=a.n13*a.n22*a.n41-a.n12*a.n23*a.n41-a.n13*a.n21*a.n42+a.n11*a.n23*a.n42+a.n12*a.n21*a.n43-a.n11*a.n22*a.n43;b.n44=a.n12*a.n23*a.n31-a.n13*a.n22*a.n31+a.n13*a.n21*a.n32-a.n11*a.n23*a.n32-a.n12*a.n21*a.n33+a.n11*a.n22*a.n33;b.multiplyScalar(1/a.determinant());return b};
THREE.Matrix4.makeInvert3x3=function(a){var b=a.flatten();a=new THREE.Matrix3;var f=b[10]*b[5]-b[6]*b[9],d=-b[10]*b[1]+b[2]*b[9],h=b[6]*b[1]-b[2]*b[5],j=-b[10]*b[4]+b[6]*b[8],q=b[10]*b[0]-b[2]*b[8],m=-b[6]*b[0]+b[2]*b[4],p=b[9]*b[4]-b[5]*b[8],c=-b[9]*b[0]+b[1]*b[8],C=b[5]*b[0]-b[1]*b[4];b=b[0]*f+b[1]*j+b[2]*p;if(b==0)throw"matrix not invertible";b=1/b;a.m[0]=b*f;a.m[1]=b*d;a.m[2]=b*h;a.m[3]=b*j;a.m[4]=b*q;a.m[5]=b*m;a.m[6]=b*p;a.m[7]=b*c;a.m[8]=b*C;return a};
THREE.Matrix4.makeFrustum=function(a,b,f,d,h,j){var q,m,p;q=new THREE.Matrix4;m=2*h/(b-a);p=2*h/(d-f);a=(b+a)/(b-a);f=(d+f)/(d-f);d=-(j+h)/(j-h);h=-2*j*h/(j-h);q.n11=m;q.n12=0;q.n13=a;q.n14=0;q.n21=0;q.n22=p;q.n23=f;q.n24=0;q.n31=0;q.n32=0;q.n33=d;q.n34=h;q.n41=0;q.n42=0;q.n43=-1;q.n44=0;return q};THREE.Matrix4.makePerspective=function(a,b,f,d){var h;a=f*Math.tan(a*Math.PI/360);h=-a;return THREE.Matrix4.makeFrustum(h*b,a*b,h,a,f,d)};
THREE.Matrix4.makeOrtho=function(a,b,f,d,h,j){var q,m,p,c;q=new THREE.Matrix4;m=b-a;p=f-d;c=j-h;a=(b+a)/m;f=(f+d)/p;h=(j+h)/c;q.n11=2/m;q.n12=0;q.n13=0;q.n14=-a;q.n21=0;q.n22=2/p;q.n23=0;q.n24=-f;q.n31=0;q.n32=0;q.n33=-2/c;q.n34=-h;q.n41=0;q.n42=0;q.n43=0;q.n44=1;return q};
THREE.Vertex=function(a,b){this.position=a||new THREE.Vector3;this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.normal=b||new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.normalScreen=new THREE.Vector3;this.tangent=new THREE.Vector4;this.__visible=true};THREE.Vertex.prototype={toString:function(){return"THREE.Vertex ( position: "+this.position+", normal: "+this.normal+" )"}};
THREE.Face3=function(a,b,f,d,h){this.a=a;this.b=b;this.c=f;this.centroid=new THREE.Vector3;this.normal=d instanceof THREE.Vector3?d:new THREE.Vector3;this.vertexNormals=d instanceof Array?d:[];this.material=h instanceof Array?h:[h]};THREE.Face3.prototype={toString:function(){return"THREE.Face3 ( "+this.a+", "+this.b+", "+this.c+" )"}};
THREE.Face4=function(a,b,f,d,h,j){this.a=a;this.b=b;this.c=f;this.d=d;this.centroid=new THREE.Vector3;this.normal=h instanceof THREE.Vector3?h:new THREE.Vector3;this.vertexNormals=h instanceof Array?h:[];this.material=j instanceof Array?j:[j]};THREE.Face4.prototype={toString:function(){return"THREE.Face4 ( "+this.a+", "+this.b+", "+this.c+" "+this.d+" )"}};THREE.UV=function(a,b){this.u=a||0;this.v=b||0};
THREE.UV.prototype={copy:function(a){this.u=a.u;this.v=a.v},toString:function(){return"THREE.UV ("+this.u+", "+this.v+")"}};THREE.Geometry=function(){this.vertices=[];this.faces=[];this.uvs=[];this.boundingSphere=this.boundingBox=null;this.geometryChunks={};this.hasTangents=false};
THREE.Geometry.prototype={computeCentroids:function(){var a,b,f;a=0;for(b=this.faces.length;a<b;a++){f=this.faces[a];f.centroid.set(0,0,0);if(f instanceof THREE.Face3){f.centroid.addSelf(this.vertices[f.a].position);f.centroid.addSelf(this.vertices[f.b].position);f.centroid.addSelf(this.vertices[f.c].position);f.centroid.divideScalar(3)}else if(f instanceof THREE.Face4){f.centroid.addSelf(this.vertices[f.a].position);f.centroid.addSelf(this.vertices[f.b].position);f.centroid.addSelf(this.vertices[f.c].position);
f.centroid.addSelf(this.vertices[f.d].position);f.centroid.divideScalar(4)}}},computeFaceNormals:function(a){var b,f,d,h,j,q,m=new THREE.Vector3,p=new THREE.Vector3;d=0;for(h=this.vertices.length;d<h;d++){j=this.vertices[d];j.normal.set(0,0,0)}d=0;for(h=this.faces.length;d<h;d++){j=this.faces[d];if(a&&j.vertexNormals.length){m.set(0,0,0);b=0;for(f=j.normal.length;b<f;b++)m.addSelf(j.vertexNormals[b]);m.divideScalar(3)}else{b=this.vertices[j.a];f=this.vertices[j.b];q=this.vertices[j.c];m.sub(q.position,
f.position);p.sub(b.position,f.position);m.crossSelf(p)}m.isZero()||m.normalize();j.normal.copy(m)}},computeVertexNormals:function(){var a,b=[],f,d;a=0;for(vl=this.vertices.length;a<vl;a++)b[a]=new THREE.Vector3;a=0;for(f=this.faces.length;a<f;a++){d=this.faces[a];if(d instanceof THREE.Face3){b[d.a].addSelf(d.normal);b[d.b].addSelf(d.normal);b[d.c].addSelf(d.normal)}else if(d instanceof THREE.Face4){b[d.a].addSelf(d.normal);b[d.b].addSelf(d.normal);b[d.c].addSelf(d.normal);b[d.d].addSelf(d.normal)}}a=
0;for(vl=this.vertices.length;a<vl;a++)b[a].normalize();a=0;for(f=this.faces.length;a<f;a++){d=this.faces[a];if(d instanceof THREE.Face3){d.vertexNormals[0]=b[d.a].clone();d.vertexNormals[1]=b[d.b].clone();d.vertexNormals[2]=b[d.c].clone()}else if(d instanceof THREE.Face4){d.vertexNormals[0]=b[d.a].clone();d.vertexNormals[1]=b[d.b].clone();d.vertexNormals[2]=b[d.c].clone();d.vertexNormals[3]=b[d.d].clone()}}},computeTangents:function(){function a(r,u,E,V){j=r.vertices[u].position;q=r.vertices[E].position;
m=r.vertices[V].position;p=h[0];c=h[1];C=h[2];A=q.x-j.x;w=m.x-j.x;v=q.y-j.y;K=m.y-j.y;P=q.z-j.z;N=m.z-j.z;t=c.u-p.u;R=C.u-p.u;D=c.v-p.v;L=C.v-p.v;M=1/(t*L-R*D);g.set((L*A-D*w)*M,(L*v-D*K)*M,(L*P-D*N)*M);n.set((t*w-R*A)*M,(t*K-R*v)*M,(t*N-R*P)*M);k[u].addSelf(g);k[E].addSelf(g);k[V].addSelf(g);i[u].addSelf(n);i[E].addSelf(n);i[V].addSelf(n)}var b,f,d,h,j,q,m,p,c,C,A,w,v,K,P,N,t,R,D,L,M,e,k=[],i=[],g=new THREE.Vector3,n=new THREE.Vector3,l=new THREE.Vector3,o=new THREE.Vector3;e=new THREE.Vector3;b=
0;for(f=this.vertices.length;b<f;b++){k[b]=new THREE.Vector3;i[b]=new THREE.Vector3}b=0;for(f=this.faces.length;b<f;b++){d=this.faces[b];h=this.uvs[b];if(d instanceof THREE.Face3){a(this,d.a,d.b,d.c);this.vertices[d.a].normal.copy(d.vertexNormals[0]);this.vertices[d.b].normal.copy(d.vertexNormals[1]);this.vertices[d.c].normal.copy(d.vertexNormals[2])}else if(d instanceof THREE.Face4){a(this,d.a,d.b,d.c);this.vertices[d.a].normal.copy(d.vertexNormals[0]);this.vertices[d.b].normal.copy(d.vertexNormals[1]);
this.vertices[d.c].normal.copy(d.vertexNormals[2]);this.vertices[d.d].normal.copy(d.vertexNormals[3])}}b=0;for(f=this.vertices.length;b<f;b++){e.copy(this.vertices[b].normal);d=k[b];l.copy(d);l.subSelf(e.multiplyScalar(e.dot(d))).normalize();o.cross(this.vertices[b].normal,d);test=o.dot(i[b]);d=test<0?-1:1;this.vertices[b].tangent.set(l.x,l.y,l.z,d)}this.hasTangents=true},computeBoundingBox:function(){var a;if(this.vertices.length>0){this.bbox={x:[this.vertices[0].position.x,this.vertices[0].position.x],
y:[this.vertices[0].position.y,this.vertices[0].position.y],z:[this.vertices[0].position.z,this.vertices[0].position.z]};for(var b=1,f=this.vertices.length;b<f;b++){a=this.vertices[b];if(a.position.x<this.bbox.x[0])this.bbox.x[0]=a.position.x;else if(a.position.x>this.bbox.x[1])this.bbox.x[1]=a.position.x;if(a.position.y<this.bbox.y[0])this.bbox.y[0]=a.position.y;else if(a.position.y>this.bbox.y[1])this.bbox.y[1]=a.position.y;if(a.position.z<this.bbox.z[0])this.bbox.z[0]=a.position.z;else if(a.position.z>
this.bbox.z[1])this.bbox.z[1]=a.position.z}}},computeBoundingSphere:function(){for(var a=this.boundingSphere===null?0:this.boundingSphere.radius,b=0,f=this.vertices.length;b<f;b++)a=Math.max(a,this.vertices[b].position.length());this.boundingSphere={radius:a}},sortFacesByMaterial:function(){function a(C){var A=[];b=0;for(f=C.length;b<f;b++)C[b]==undefined?A.push("undefined"):A.push(C[b].toString());return A.join("_")}var b,f,d,h,j,q,m,p,c={};d=0;for(h=this.faces.length;d<h;d++){j=this.faces[d];q=
j.material;m=a(q);if(c[m]==undefined)c[m]={hash:m,counter:0};p=c[m].hash+"_"+c[m].counter;if(this.geometryChunks[p]==undefined)this.geometryChunks[p]={faces:[],material:q,vertices:0};j=j instanceof THREE.Face3?3:4;if(this.geometryChunks[p].vertices+j>65535){c[m].counter+=1;p=c[m].hash+"_"+c[m].counter;if(this.geometryChunks[p]==undefined)this.geometryChunks[p]={faces:[],material:q,vertices:0}}this.geometryChunks[p].faces.push(d);this.geometryChunks[p].vertices+=j}},toString:function(){return"THREE.Geometry ( vertices: "+
this.vertices+", faces: "+this.faces+", uvs: "+this.uvs+" )"}};
THREE.Camera=function(a,b,f,d){this.position=new THREE.Vector3;this.target={position:new THREE.Vector3};this.up=new THREE.Vector3(0,1,0);this.matrix=new THREE.Matrix4;this.projectionMatrix=THREE.Matrix4.makePerspective(a,b,f,d);this.autoUpdateMatrix=true;this.translateX=function(h){h=this.target.position.clone().subSelf(this.position).normalize().multiplyScalar(h);h.cross(h.clone(),this.up);this.position.addSelf(h);this.target.position.addSelf(h)};this.translateZ=function(h){h=this.target.position.clone().subSelf(this.position).normalize().multiplyScalar(h);
this.position.subSelf(h);this.target.position.subSelf(h)};this.updateMatrix=function(){this.matrix.lookAt(this.position,this.target.position,this.up)};this.toString=function(){return"THREE.Camera ( "+this.position+", "+this.target.position+" )"}};THREE.Light=function(a){this.color=new THREE.Color(a)};THREE.AmbientLight=function(a){THREE.Light.call(this,a)};THREE.AmbientLight.prototype=new THREE.Light;THREE.AmbientLight.prototype.constructor=THREE.AmbientLight;
THREE.DirectionalLight=function(a,b){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,1,0);this.intensity=b||1};THREE.DirectionalLight.prototype=new THREE.Light;THREE.DirectionalLight.prototype.constructor=THREE.DirectionalLight;THREE.PointLight=function(a,b){THREE.Light.call(this,a);this.position=new THREE.Vector3;this.intensity=b||1};THREE.DirectionalLight.prototype=new THREE.Light;THREE.DirectionalLight.prototype.constructor=THREE.PointLight;
THREE.Object3D=function(){this.id=THREE.Object3DCounter.value++;this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.scale=new THREE.Vector3(1,1,1);this.matrix=new THREE.Matrix4;this.translationMatrix=new THREE.Matrix4;this.rotationMatrix=new THREE.Matrix4;this.scaleMatrix=new THREE.Matrix4;this.screen=new THREE.Vector3;this.autoUpdateMatrix=this.visible=true;this.updateMatrix=function(){this.matrixPosition=THREE.Matrix4.translationMatrix(this.position.x,this.position.y,this.position.z);
this.rotationMatrix=THREE.Matrix4.rotationXMatrix(this.rotation.x);this.rotationMatrix.multiplySelf(THREE.Matrix4.rotationYMatrix(this.rotation.y));this.rotationMatrix.multiplySelf(THREE.Matrix4.rotationZMatrix(this.rotation.z));this.scaleMatrix=THREE.Matrix4.scaleMatrix(this.scale.x,this.scale.y,this.scale.z);this.matrix.copy(this.matrixPosition);this.matrix.multiplySelf(this.rotationMatrix);this.matrix.multiplySelf(this.scaleMatrix)}};THREE.Object3DCounter={value:0};
THREE.Particle=function(a){THREE.Object3D.call(this);this.material=a instanceof Array?a:[a];this.autoUpdateMatrix=false};THREE.Particle.prototype=new THREE.Object3D;THREE.Particle.prototype.constructor=THREE.Particle;THREE.Line=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b instanceof Array?b:[b]};THREE.Line.prototype=new THREE.Object3D;THREE.Line.prototype.constructor=THREE.Line;
THREE.Mesh=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b instanceof Array?b:[b];this.overdraw=this.doubleSided=this.flipSided=false;this.geometry.boundingSphere||this.geometry.computeBoundingSphere()};THREE.Mesh.prototype=new THREE.Object3D;THREE.Mesh.prototype.constructor=THREE.Mesh;THREE.FlatShading=0;THREE.SmoothShading=1;THREE.NormalBlending=0;THREE.AdditiveBlending=1;THREE.SubtractiveBlending=2;
THREE.LineBasicMaterial=function(a){this.color=new THREE.Color(16777215);this.opacity=1;this.blending=THREE.NormalBlending;this.linewidth=1;this.linejoin=this.linecap="round";if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending;if(a.linewidth!==undefined)this.linewidth=a.linewidth;if(a.linecap!==undefined)this.linecap=a.linecap;if(a.linejoin!==undefined)this.linejoin=a.linejoin}this.toString=function(){return"THREE.LineBasicMaterial (<br/>color: "+
this.color+"<br/>opacity: "+this.opacity+"<br/>blending: "+this.blending+"<br/>linewidth: "+this.linewidth+"<br/>linecap: "+this.linecap+"<br/>linejoin: "+this.linejoin+"<br/>)"}};
THREE.MeshBasicMaterial=function(a){this.id=THREE.MeshBasicMaterialCounter.value++;this.color=new THREE.Color(16777215);this.env_map=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refraction_ratio=0.98;this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.map!==undefined)this.map=
a.map;if(a.env_map!==undefined)this.env_map=a.env_map;if(a.combine!==undefined)this.combine=a.combine;if(a.reflectivity!==undefined)this.reflectivity=a.reflectivity;if(a.refraction_ratio!==undefined)this.refraction_ratio=a.refraction_ratio;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==undefined)this.wireframe_linewidth=
a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=a.wireframe_linejoin}this.toString=function(){return"THREE.MeshBasicMaterial (<br/>id: "+this.id+"<br/>color: "+this.color+"<br/>map: "+this.map+"<br/>env_map: "+this.env_map+"<br/>combine: "+this.combine+"<br/>reflectivity: "+this.reflectivity+"<br/>refraction_ratio: "+this.refraction_ratio+"<br/>opacity: "+this.opacity+"<br/>blending: "+
this.blending+"<br/>wireframe: "+this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/>)"}};THREE.MeshBasicMaterialCounter={value:0};
THREE.MeshLambertMaterial=function(a){this.id=THREE.MeshLambertMaterialCounter.value++;this.color=new THREE.Color(16777215);this.env_map=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refraction_ratio=0.98;this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.map!==undefined)this.map=
a.map;if(a.env_map!==undefined)this.env_map=a.env_map;if(a.combine!==undefined)this.combine=a.combine;if(a.reflectivity!==undefined)this.reflectivity=a.reflectivity;if(a.refraction_ratio!==undefined)this.refraction_ratio=a.refraction_ratio;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==undefined)this.wireframe_linewidth=
a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=a.wireframe_linejoin}this.toString=function(){return"THREE.MeshLambertMaterial (<br/>id: "+this.id+"<br/>color: "+this.color+"<br/>map: "+this.map+"<br/>env_map: "+this.env_map+"<br/>combine: "+this.combine+"<br/>reflectivity: "+this.reflectivity+"<br/>refraction_ratio: "+this.refraction_ratio+"<br/>opacity: "+this.opacity+"<br/>shading: "+
this.shading+"<br/>blending: "+this.blending+"<br/>wireframe: "+this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/> )"}};THREE.MeshLambertMaterialCounter={value:0};
THREE.MeshPhongMaterial=function(a){this.id=THREE.MeshPhongMaterialCounter.value++;this.color=new THREE.Color(16777215);this.ambient=new THREE.Color(328965);this.specular=new THREE.Color(1118481);this.shininess=30;this.env_map=this.specular_map=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refraction_ratio=0.98;this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap=
"round";if(a){if(a.color!==undefined)this.color=new THREE.Color(a.color);if(a.ambient!==undefined)this.ambient=new THREE.Color(a.ambient);if(a.specular!==undefined)this.specular=new THREE.Color(a.specular);if(a.shininess!==undefined)this.shininess=a.shininess;if(a.map!==undefined)this.map=a.map;if(a.specular_map!==undefined)this.specular_map=a.specular_map;if(a.env_map!==undefined)this.env_map=a.env_map;if(a.combine!==undefined)this.combine=a.combine;if(a.reflectivity!==undefined)this.reflectivity=
a.reflectivity;if(a.refraction_ratio!==undefined)this.refraction_ratio=a.refraction_ratio;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==undefined)this.wireframe_linewidth=a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=
a.wireframe_linejoin}this.toString=function(){return"THREE.MeshPhongMaterial (<br/>id: "+this.id+"<br/>color: "+this.color+"<br/>ambient: "+this.ambient+"<br/>specular: "+this.specular+"<br/>shininess: "+this.shininess+"<br/>map: "+this.map+"<br/>specular_map: "+this.specular_map+"<br/>env_map: "+this.env_map+"<br/>combine: "+this.combine+"<br/>reflectivity: "+this.reflectivity+"<br/>refraction_ratio: "+this.refraction_ratio+"<br/>opacity: "+this.opacity+"<br/>shading: "+this.shading+"<br/>wireframe: "+
this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/>"+ +")"}};THREE.MeshPhongMaterialCounter={value:0};
THREE.MeshDepthMaterial=function(a){this.near=1;this.far=1E3;this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){if(a.near!==undefined)this.near=a.near;if(a.far!==undefined)this.far=a.far;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending}this.__2near=2*this.near;this.__farPlusNear=this.far+this.near;this.__farMinusNear=
this.far-this.near;this.toString=function(){return"THREE.MeshDepthMaterial"}};THREE.MeshNormalMaterial=function(a){this.opacity=1;this.shading=THREE.FlatShading;this.blending=THREE.NormalBlending;if(a){if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending}this.toString=function(){return"THREE.MeshNormalMaterial"}};THREE.MeshFaceMaterial=function(){this.toString=function(){return"THREE.MeshFaceMaterial"}};
THREE.MeshShaderMaterial=function(a){this.id=THREE.MeshShaderMaterialCounter.value++;this.vertex_shader=this.fragment_shader="void main() {}";this.uniforms={};this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){if(a.fragment_shader!==undefined)this.fragment_shader=a.fragment_shader;if(a.vertex_shader!==undefined)this.vertex_shader=a.vertex_shader;if(a.uniforms!==
undefined)this.uniforms=a.uniforms;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==undefined)this.wireframe_linewidth=a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=a.wireframe_linejoin}this.toString=function(){return"THREE.MeshShaderMaterial (<br/>id: "+this.id+
"<br/>blending: "+this.blending+"<br/>wireframe: "+this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/>)"}};THREE.MeshShaderMaterialCounter={value:0};
THREE.ParticleBasicMaterial=function(a){this.color=new THREE.Color(16777215);this.map=null;this.opacity=1;this.blending=THREE.NormalBlending;this.offset=new THREE.Vector2;if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.map!==undefined)this.map=a.map;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending}this.toString=function(){return"THREE.ParticleBasicMaterial (<br/>color: "+this.color+"<br/>map: "+this.map+"<br/>opacity: "+this.opacity+"<br/>blending: "+
this.blending+"<br/>)"}};THREE.ParticleCircleMaterial=function(a){this.color=new THREE.Color(16777215);this.opacity=1;this.blending=THREE.NormalBlending;if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending}this.toString=function(){return"THREE.ParticleCircleMaterial (<br/>color: "+this.color+"<br/>opacity: "+this.opacity+"<br/>blending: "+this.blending+"<br/>)"}};
THREE.ParticleDOMMaterial=function(a){this.domElement=a;this.toString=function(){return"THREE.ParticleDOMMaterial ( domElement: "+this.domElement+" )"}};
THREE.Texture=function(a,b,f,d,h,j){this.image=a;this.mapping=b!==undefined?b:new THREE.UVMapping;this.wrap_s=f!==undefined?f:THREE.ClampToEdgeWrapping;this.wrap_t=d!==undefined?d:THREE.ClampToEdgeWrapping;this.mag_filter=h!==undefined?h:THREE.LinearFilter;this.min_filter=j!==undefined?j:THREE.LinearMipMapLinearFilter;this.toString=function(){return"THREE.Texture (<br/>image: "+this.image+"<br/>wrap_s: "+this.wrap_s+"<br/>wrap_t: "+this.wrap_t+"<br/>mag_filter: "+this.mag_filter+"<br/>min_filter: "+
this.min_filter+"<br/>)"}};THREE.MultiplyOperation=0;THREE.MixOperation=1;THREE.RepeatWrapping=0;THREE.ClampToEdgeWrapping=1;THREE.MirroredRepeatWrapping=2;THREE.NearestFilter=3;THREE.NearestMipMapNearestFilter=4;THREE.NearestMipMapLinearFilter=5;THREE.LinearFilter=6;THREE.LinearMipMapNearestFilter=7;THREE.LinearMipMapLinearFilter=8;THREE.CubeReflectionMapping=function(){};THREE.CubeRefractionMapping=function(){};THREE.LatitudeReflectionMapping=function(){};THREE.LatitudeRefractionMapping=function(){};
THREE.SphericalReflectionMapping=function(){};THREE.SphericalRefractionMapping=function(){};THREE.UVMapping=function(){};
THREE.Scene=function(){this.objects=[];this.lights=[];this.fog=null;this.addObject=function(a){this.objects.indexOf(a)===-1&&this.objects.push(a)};this.removeObject=function(a){a=this.objects.indexOf(a);a!==-1&&this.objects.splice(a,1)};this.addLight=function(a){this.lights.indexOf(a)===-1&&this.lights.push(a)};this.removeLight=function(a){a=this.lights.indexOf(a);a!==-1&&this.lights.splice(a,1)};this.toString=function(){return"THREE.Scene ( "+this.objects+" )"}};
THREE.Fog=function(a,b){this.color=new THREE.Color(a);this.density=b||2.5E-4};
THREE.Projector=function(){function a(k,i){return i.z-k.z}function b(k,i){var g=0,n=1,l=k.z+k.w,o=i.z+i.w,r=-k.z+k.w,u=-i.z+i.w;if(l>=0&&o>=0&&r>=0&&u>=0)return true;else if(l<0&&o<0||r<0&&u<0)return false;else{if(l<0)g=Math.max(g,l/(l-o));else if(o<0)n=Math.min(n,l/(l-o));if(r<0)g=Math.max(g,r/(r-u));else if(u<0)n=Math.min(n,r/(r-u));if(n<g)return false;else{k.lerpSelf(i,g);i.lerpSelf(k,1-n);return true}}}var f,d,h=[],j,q,m,p=[],c,C,A=[],w,v,K=[],P=new THREE.Vector4,N=new THREE.Vector4,t=new THREE.Matrix4,
R=new THREE.Matrix4,D=[],L=new THREE.Vector4,M=new THREE.Vector4,e;this.projectObjects=function(k,i,g){var n=[],l,o;d=0;t.multiply(i.projectionMatrix,i.matrix);D[0]=new THREE.Vector4(t.n41-t.n11,t.n42-t.n12,t.n43-t.n13,t.n44-t.n14);D[1]=new THREE.Vector4(t.n41+t.n11,t.n42+t.n12,t.n43+t.n13,t.n44+t.n14);D[2]=new THREE.Vector4(t.n41+t.n21,t.n42+t.n22,t.n43+t.n23,t.n44+t.n24);D[3]=new THREE.Vector4(t.n41-t.n21,t.n42-t.n22,t.n43-t.n23,t.n44-t.n24);D[4]=new THREE.Vector4(t.n41-t.n31,t.n42-t.n32,t.n43-
t.n33,t.n44-t.n34);D[5]=new THREE.Vector4(t.n41+t.n31,t.n42+t.n32,t.n43+t.n33,t.n44+t.n34);i=0;for(l=D.length;i<l;i++){o=D[i];o.divideScalar(Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z))}l=k.objects;k=0;for(i=l.length;k<i;k++){o=l[k];var r;if(!(r=!o.visible)){if(r=o instanceof THREE.Mesh){a:{r=void 0;for(var u=o.position,E=-o.geometry.boundingSphere.radius*Math.max(o.scale.x,Math.max(o.scale.y,o.scale.z)),V=0;V<6;V++){r=D[V].x*u.x+D[V].y*u.y+D[V].z*u.z+D[V].w;if(r<=E){r=false;break a}}r=true}r=!r}r=r}if(!r){f=
h[d]=h[d]||new THREE.RenderableObject;P.copy(o.position);t.multiplyVector3(P);f.object=o;f.z=P.z;n.push(f);d++}}g&&n.sort(a);return n};this.projectScene=function(k,i,g){var n=[],l,o,r,u,E,V,x,G,H,S,U,F,s,B,Q,I;m=C=v=0;i.autoUpdateMatrix&&i.updateMatrix();t.multiply(i.projectionMatrix,i.matrix);V=this.projectObjects(k,i,true);k=0;for(l=V.length;k<l;k++){x=V[k].object;if(x.visible){x.autoUpdateMatrix&&x.updateMatrix();G=x.matrix;H=x.rotationMatrix;S=x.material;U=x.overdraw;if(x instanceof THREE.Mesh){F=
x.geometry;s=F.vertices;o=0;for(r=s.length;o<r;o++){B=s[o];B.positionWorld.copy(B.position);G.multiplyVector3(B.positionWorld);u=B.positionScreen;u.copy(B.positionWorld);t.multiplyVector4(u);u.multiplyScalar(1/u.w);B.__visible=u.z>0&&u.z<1}F=F.faces;o=0;for(r=F.length;o<r;o++){B=F[o];if(B instanceof THREE.Face3){u=s[B.a];E=s[B.b];Q=s[B.c];if(u.__visible&&E.__visible&&Q.__visible)if(x.doubleSided||x.flipSided!=(Q.positionScreen.x-u.positionScreen.x)*(E.positionScreen.y-u.positionScreen.y)-(Q.positionScreen.y-
u.positionScreen.y)*(E.positionScreen.x-u.positionScreen.x)<0){j=p[m]=p[m]||new THREE.RenderableFace3;j.v1.positionWorld.copy(u.positionWorld);j.v2.positionWorld.copy(E.positionWorld);j.v3.positionWorld.copy(Q.positionWorld);j.v1.positionScreen.copy(u.positionScreen);j.v2.positionScreen.copy(E.positionScreen);j.v3.positionScreen.copy(Q.positionScreen);j.normalWorld.copy(B.normal);H.multiplyVector3(j.normalWorld);j.centroidWorld.copy(B.centroid);G.multiplyVector3(j.centroidWorld);j.centroidScreen.copy(j.centroidWorld);
t.multiplyVector3(j.centroidScreen);Q=B.vertexNormals;e=j.vertexNormalsWorld;u=0;for(E=Q.length;u<E;u++){I=e[u]=e[u]||new THREE.Vector3;I.copy(Q[u]);H.multiplyVector3(I)}j.z=j.centroidScreen.z;j.meshMaterial=S;j.faceMaterial=B.material;j.overdraw=U;if(x.geometry.uvs[o]){j.uvs[0]=x.geometry.uvs[o][0];j.uvs[1]=x.geometry.uvs[o][1];j.uvs[2]=x.geometry.uvs[o][2]}n.push(j);m++}}else if(B instanceof THREE.Face4){u=s[B.a];E=s[B.b];Q=s[B.c];I=s[B.d];if(u.__visible&&E.__visible&&Q.__visible&&I.__visible)if(x.doubleSided||
x.flipSided!=((I.positionScreen.x-u.positionScreen.x)*(E.positionScreen.y-u.positionScreen.y)-(I.positionScreen.y-u.positionScreen.y)*(E.positionScreen.x-u.positionScreen.x)<0||(E.positionScreen.x-Q.positionScreen.x)*(I.positionScreen.y-Q.positionScreen.y)-(E.positionScreen.y-Q.positionScreen.y)*(I.positionScreen.x-Q.positionScreen.x)<0)){j=p[m]=p[m]||new THREE.RenderableFace3;j.v1.positionWorld.copy(u.positionWorld);j.v2.positionWorld.copy(E.positionWorld);j.v3.positionWorld.copy(I.positionWorld);
j.v1.positionScreen.copy(u.positionScreen);j.v2.positionScreen.copy(E.positionScreen);j.v3.positionScreen.copy(I.positionScreen);j.normalWorld.copy(B.normal);H.multiplyVector3(j.normalWorld);j.centroidWorld.copy(B.centroid);G.multiplyVector3(j.centroidWorld);j.centroidScreen.copy(j.centroidWorld);t.multiplyVector3(j.centroidScreen);j.z=j.centroidScreen.z;j.meshMaterial=S;j.faceMaterial=B.material;j.overdraw=U;if(x.geometry.uvs[o]){j.uvs[0]=x.geometry.uvs[o][0];j.uvs[1]=x.geometry.uvs[o][1];j.uvs[2]=
x.geometry.uvs[o][3]}n.push(j);m++;q=p[m]=p[m]||new THREE.RenderableFace3;q.v1.positionWorld.copy(E.positionWorld);q.v2.positionWorld.copy(Q.positionWorld);q.v3.positionWorld.copy(I.positionWorld);q.v1.positionScreen.copy(E.positionScreen);q.v2.positionScreen.copy(Q.positionScreen);q.v3.positionScreen.copy(I.positionScreen);q.normalWorld.copy(j.normalWorld);q.centroidWorld.copy(j.centroidWorld);q.centroidScreen.copy(j.centroidScreen);q.z=q.centroidScreen.z;q.meshMaterial=S;q.faceMaterial=B.material;
q.overdraw=U;if(x.geometry.uvs[o]){q.uvs[0]=x.geometry.uvs[o][1];q.uvs[1]=x.geometry.uvs[o][2];q.uvs[2]=x.geometry.uvs[o][3]}n.push(q);m++}}}}else if(x instanceof THREE.Line){R.multiply(t,G);s=x.geometry.vertices;B=s[0];B.positionScreen.copy(B.position);R.multiplyVector4(B.positionScreen);o=1;for(r=s.length;o<r;o++){u=s[o];u.positionScreen.copy(u.position);R.multiplyVector4(u.positionScreen);E=s[o-1];L.copy(u.positionScreen);M.copy(E.positionScreen);if(b(L,M)){L.multiplyScalar(1/L.w);M.multiplyScalar(1/
M.w);c=A[C]=A[C]||new THREE.RenderableLine;c.v1.positionScreen.copy(L);c.v2.positionScreen.copy(M);c.z=Math.max(L.z,M.z);c.material=x.material;n.push(c);C++}}}else if(x instanceof THREE.Particle){N.set(x.position.x,x.position.y,x.position.z,1);t.multiplyVector4(N);N.z/=N.w;if(N.z>0&&N.z<1){w=K[v]=K[v]||new THREE.RenderableParticle;w.x=N.x/N.w;w.y=N.y/N.w;w.z=N.z;w.rotation=x.rotation.z;w.scale.x=x.scale.x*Math.abs(w.x-(N.x+i.projectionMatrix.n11)/(N.w+i.projectionMatrix.n14));w.scale.y=x.scale.y*
Math.abs(w.y-(N.y+i.projectionMatrix.n22)/(N.w+i.projectionMatrix.n24));w.material=x.material;n.push(w);v++}}}}g&&n.sort(a);return n};this.unprojectVector=function(k,i){var g=new THREE.Matrix4;g.multiply(THREE.Matrix4.makeInvert(i.matrix),THREE.Matrix4.makeInvert(i.projectionMatrix));g.multiplyVector3(k);return k}};
THREE.DOMRenderer=function(){THREE.Renderer.call(this);var a=null,b=new THREE.Projector,f,d,h,j;this.domElement=document.createElement("div");this.setSize=function(q,m){f=q;d=m;h=f/2;j=d/2};this.render=function(q,m){var p,c,C,A,w,v,K,P;a=b.projectScene(q,m);p=0;for(c=a.length;p<c;p++){w=a[p];if(w instanceof THREE.RenderableParticle){K=w.x*h+h;P=w.y*j+j;C=0;for(A=w.material.length;C<A;C++){v=w.material[C];if(v instanceof THREE.ParticleDOMMaterial){v=v.domElement;v.style.left=K+"px";v.style.top=P+"px"}}}}}};
THREE.CanvasRenderer=function(){var a=null,b=new THREE.Projector,f=document.createElement("canvas"),d,h,j,q,m=f.getContext("2d"),p=1,c=0,C=null,A=null,w=1,v,K,P,N,t,R,D,L,M,e=new THREE.Color,k=new THREE.Color,i=new THREE.Color,g=new THREE.Color,n=new THREE.Color,l,o,r,u,E,V,x,G,H,S,U=new THREE.Rectangle,F=new THREE.Rectangle,s=new THREE.Rectangle,B=false,Q=new THREE.Color,I=new THREE.Color,W=new THREE.Color,aa=new THREE.Color,Ja=Math.PI*2,Y=new THREE.Vector3,na,oa,Aa,da,pa,ta,la=16;na=document.createElement("canvas");
na.width=na.height=2;oa=na.getContext("2d");oa.fillStyle="rgba(0,0,0,1)";oa.fillRect(0,0,2,2);Aa=oa.getImageData(0,0,2,2);da=Aa.data;pa=document.createElement("canvas");pa.width=pa.height=la;ta=pa.getContext("2d");ta.translate(-la/2,-la/2);ta.scale(la,la);la--;this.domElement=f;this.sortElements=this.sortObjects=this.autoClear=true;this.setSize=function(ga,ua){d=ga;h=ua;j=d/2;q=h/2;f.width=d;f.height=h;U.set(-j,-q,j,q)};this.clear=function(){if(!F.isEmpty()){F.inflate(1);F.minSelf(U);m.clearRect(F.getX(),
F.getY(),F.getWidth(),F.getHeight());F.empty()}};this.render=function(ga,ua){function Ka(y){var T,O,z,J=y.lights;I.setRGB(0,0,0);W.setRGB(0,0,0);aa.setRGB(0,0,0);y=0;for(T=J.length;y<T;y++){O=J[y];z=O.color;if(O instanceof THREE.AmbientLight){I.r+=z.r;I.g+=z.g;I.b+=z.b}else if(O instanceof THREE.DirectionalLight){W.r+=z.r;W.g+=z.g;W.b+=z.b}else if(O instanceof THREE.PointLight){aa.r+=z.r;aa.g+=z.g;aa.b+=z.b}}}function va(y,T,O,z){var J,X,$,ba,ca=y.lights;y=0;for(J=ca.length;y<J;y++){X=ca[y];$=X.color;
ba=X.intensity;if(X instanceof THREE.DirectionalLight){X=O.dot(X.position)*ba;if(X>0){z.r+=$.r*X;z.g+=$.g*X;z.b+=$.b*X}}else if(X instanceof THREE.PointLight){Y.sub(X.position,T);Y.normalize();X=O.dot(Y)*ba;if(X>0){z.r+=$.r*X;z.g+=$.g*X;z.b+=$.b*X}}}}function La(y,T,O){if(O.opacity!=0){Ba(O.opacity);wa(O.blending);var z,J,X,$,ba,ca;if(O instanceof THREE.ParticleBasicMaterial){if(O.map){$=O.map;ba=$.width>>1;ca=$.height>>1;J=T.scale.x*j;X=T.scale.y*q;O=J*ba;z=X*ca;s.set(y.x-O,y.y-z,y.x+O,y.y+z);if(U.instersects(s)){m.save();
m.translate(y.x,y.y);m.rotate(-T.rotation);m.scale(J,-X);m.translate(-ba,-ca);m.drawImage($,0,0);m.restore()}}}else if(O instanceof THREE.ParticleCircleMaterial){if(B){Q.r=I.r+W.r+aa.r;Q.g=I.g+W.g+aa.g;Q.b=I.b+W.b+aa.b;e.r=O.color.r*Q.r;e.g=O.color.g*Q.g;e.b=O.color.b*Q.b;e.updateStyleString()}else e.__styleString=O.color.__styleString;O=T.scale.x*j;z=T.scale.y*q;s.set(y.x-O,y.y-z,y.x+O,y.y+z);if(U.instersects(s)){J=e.__styleString;if(A!=J)m.fillStyle=A=J;m.save();m.translate(y.x,y.y);m.rotate(-T.rotation);
m.scale(O,z);m.beginPath();m.arc(0,0,1,0,Ja,true);m.closePath();m.fill();m.restore()}}}}function Ma(y,T,O,z){if(z.opacity!=0){Ba(z.opacity);wa(z.blending);m.beginPath();m.moveTo(y.positionScreen.x,y.positionScreen.y);m.lineTo(T.positionScreen.x,T.positionScreen.y);m.closePath();if(z instanceof THREE.LineBasicMaterial){e.__styleString=z.color.__styleString;y=z.linewidth;if(w!=y)m.lineWidth=w=y;y=e.__styleString;if(C!=y)m.strokeStyle=C=y;m.stroke();s.inflate(z.linewidth*2)}}}function Fa(y,T,O,z,J,X){if(J.opacity!=
0){Ba(J.opacity);wa(J.blending);N=y.positionScreen.x;t=y.positionScreen.y;R=T.positionScreen.x;D=T.positionScreen.y;L=O.positionScreen.x;M=O.positionScreen.y;m.beginPath();m.moveTo(N,t);m.lineTo(R,D);m.lineTo(L,M);m.lineTo(N,t);m.closePath();if(J instanceof THREE.MeshBasicMaterial)if(J.map)J.map.image.loaded&&J.map.mapping instanceof THREE.UVMapping&&qa(N,t,R,D,L,M,J.map.image,z.uvs[0].u,z.uvs[0].v,z.uvs[1].u,z.uvs[1].v,z.uvs[2].u,z.uvs[2].v);else if(J.env_map){if(J.env_map.image.loaded)if(J.env_map.mapping instanceof
THREE.SphericalReflectionMapping){y=ua.matrix;Y.copy(z.vertexNormalsWorld[0]);E=(Y.x*y.n11+Y.y*y.n12+Y.z*y.n13)*0.5+0.5;V=-(Y.x*y.n21+Y.y*y.n22+Y.z*y.n23)*0.5+0.5;Y.copy(z.vertexNormalsWorld[1]);x=(Y.x*y.n11+Y.y*y.n12+Y.z*y.n13)*0.5+0.5;G=-(Y.x*y.n21+Y.y*y.n22+Y.z*y.n23)*0.5+0.5;Y.copy(z.vertexNormalsWorld[2]);H=(Y.x*y.n11+Y.y*y.n12+Y.z*y.n13)*0.5+0.5;S=-(Y.x*y.n21+Y.y*y.n22+Y.z*y.n23)*0.5+0.5;qa(N,t,R,D,L,M,J.env_map.image,E,V,x,G,H,S)}}else J.wireframe?xa(J.color.__styleString,J.wireframe_linewidth):
ya(J.color.__styleString);else if(J instanceof THREE.MeshLambertMaterial){if(J.map&&!J.wireframe){J.map.mapping instanceof THREE.UVMapping&&qa(N,t,R,D,L,M,J.map.image,z.uvs[0].u,z.uvs[0].v,z.uvs[1].u,z.uvs[1].v,z.uvs[2].u,z.uvs[2].v);wa(THREE.SubtractiveBlending)}if(B)if(!J.wireframe&&J.shading==THREE.SmoothShading&&z.vertexNormalsWorld.length==3){k.r=i.r=g.r=I.r;k.g=i.g=g.g=I.g;k.b=i.b=g.b=I.b;va(X,z.v1.positionWorld,z.vertexNormalsWorld[0],k);va(X,z.v2.positionWorld,z.vertexNormalsWorld[1],i);va(X,
z.v3.positionWorld,z.vertexNormalsWorld[2],g);n.r=(i.r+g.r)*0.5;n.g=(i.g+g.g)*0.5;n.b=(i.b+g.b)*0.5;u=Ga(k,i,g,n);qa(N,t,R,D,L,M,u,0,0,1,0,0,1)}else{Q.r=I.r;Q.g=I.g;Q.b=I.b;va(X,z.centroidWorld,z.normalWorld,Q);e.r=J.color.r*Q.r;e.g=J.color.g*Q.g;e.b=J.color.b*Q.b;e.updateStyleString();J.wireframe?xa(e.__styleString,J.wireframe_linewidth):ya(e.__styleString)}else J.wireframe?xa(J.color.__styleString,J.wireframe_linewidth):ya(J.color.__styleString)}else if(J instanceof THREE.MeshDepthMaterial){l=J.__2near;
o=J.__farPlusNear;r=J.__farMinusNear;k.r=k.g=k.b=1-l/(o-y.positionScreen.z*r);i.r=i.g=i.b=1-l/(o-T.positionScreen.z*r);g.r=g.g=g.b=1-l/(o-O.positionScreen.z*r);n.r=(i.r+g.r)*0.5;n.g=(i.g+g.g)*0.5;n.b=(i.b+g.b)*0.5;u=Ga(k,i,g,n);qa(N,t,R,D,L,M,u,0,0,1,0,0,1)}else if(J instanceof THREE.MeshNormalMaterial){e.r=Ca(z.normalWorld.x);e.g=Ca(z.normalWorld.y);e.b=Ca(z.normalWorld.z);e.updateStyleString();J.wireframe?xa(e.__styleString,J.wireframe_linewidth):ya(e.__styleString)}}}function xa(y,T){if(C!=y)m.strokeStyle=
C=y;if(w!=T)m.lineWidth=w=T;m.stroke();s.inflate(T*2)}function ya(y){if(A!=y)m.fillStyle=A=y;m.fill()}function qa(y,T,O,z,J,X,$,ba,ca,ha,ea,ia,ra){var ka,ja;ka=$.width-1;ja=$.height-1;ba*=ka;ca*=ja;ha*=ka;ea*=ja;ia*=ka;ra*=ja;O-=y;z-=T;J-=y;X-=T;ha-=ba;ea-=ca;ia-=ba;ra-=ca;ja=1/(ha*ra-ia*ea);ka=(ra*O-ea*J)*ja;ea=(ra*z-ea*X)*ja;O=(ha*J-ia*O)*ja;z=(ha*X-ia*z)*ja;y=y-ka*ba-O*ca;T=T-ea*ba-z*ca;m.save();m.transform(ka,ea,O,z,y,T);m.clip();m.drawImage($,0,0);m.restore()}function Ba(y){if(p!=y)m.globalAlpha=
p=y}function wa(y){if(c!=y){switch(y){case THREE.NormalBlending:m.globalCompositeOperation="source-over";break;case THREE.AdditiveBlending:m.globalCompositeOperation="lighter";break;case THREE.SubtractiveBlending:m.globalCompositeOperation="darker"}c=y}}function Ga(y,T,O,z){var J=~~(y.r*255),X=~~(y.g*255);y=~~(y.b*255);var $=~~(T.r*255),ba=~~(T.g*255);T=~~(T.b*255);var ca=~~(O.r*255),ha=~~(O.g*255);O=~~(O.b*255);var ea=~~(z.r*255),ia=~~(z.g*255);z=~~(z.b*255);da[0]=J<0?0:J>255?255:J;da[1]=X<0?0:X>
255?255:X;da[2]=y<0?0:y>255?255:y;da[4]=$<0?0:$>255?255:$;da[5]=ba<0?0:ba>255?255:ba;da[6]=T<0?0:T>255?255:T;da[8]=ca<0?0:ca>255?255:ca;da[9]=ha<0?0:ha>255?255:ha;da[10]=O<0?0:O>255?255:O;da[12]=ea<0?0:ea>255?255:ea;da[13]=ia<0?0:ia>255?255:ia;da[14]=z<0?0:z>255?255:z;oa.putImageData(Aa,0,0);ta.drawImage(na,0,0);return pa}function Ca(y){y=(y+1)*0.5;return y<0?0:y>1?1:y}function Da(y,T){var O=T.x-y.x,z=T.y-y.y,J=1/Math.sqrt(O*O+z*z);O*=J;z*=J;T.x+=O;T.y+=z;y.x-=O;y.y-=z}var za,Ha,Z,fa,ma,Ea,Ia,sa;
m.setTransform(1,0,0,-1,j,q);this.autoClear&&this.clear();a=b.projectScene(ga,ua,this.sortElements);(B=ga.lights.length>0)&&Ka(ga);za=0;for(Ha=a.length;za<Ha;za++){Z=a[za];s.empty();if(Z instanceof THREE.RenderableParticle){v=Z;v.x*=j;v.y*=q;fa=0;for(ma=Z.material.length;fa<ma;fa++)La(v,Z,Z.material[fa],ga)}else if(Z instanceof THREE.RenderableLine){v=Z.v1;K=Z.v2;v.positionScreen.x*=j;v.positionScreen.y*=q;K.positionScreen.x*=j;K.positionScreen.y*=q;s.addPoint(v.positionScreen.x,v.positionScreen.y);
s.addPoint(K.positionScreen.x,K.positionScreen.y);if(U.instersects(s)){fa=0;for(ma=Z.material.length;fa<ma;)Ma(v,K,Z,Z.material[fa++],ga)}}else if(Z instanceof THREE.RenderableFace3){v=Z.v1;K=Z.v2;P=Z.v3;v.positionScreen.x*=j;v.positionScreen.y*=q;K.positionScreen.x*=j;K.positionScreen.y*=q;P.positionScreen.x*=j;P.positionScreen.y*=q;if(Z.overdraw){Da(v.positionScreen,K.positionScreen);Da(K.positionScreen,P.positionScreen);Da(P.positionScreen,v.positionScreen)}s.add3Points(v.positionScreen.x,v.positionScreen.y,
K.positionScreen.x,K.positionScreen.y,P.positionScreen.x,P.positionScreen.y);if(U.instersects(s)){fa=0;for(ma=Z.meshMaterial.length;fa<ma;){sa=Z.meshMaterial[fa++];if(sa instanceof THREE.MeshFaceMaterial){Ea=0;for(Ia=Z.faceMaterial.length;Ea<Ia;)(sa=Z.faceMaterial[Ea++])&&Fa(v,K,P,Z,sa,ga)}else Fa(v,K,P,Z,sa,ga)}}}F.addRectangle(s)}m.setTransform(1,0,0,1,0,0)}};
THREE.SVGRenderer=function(){function a(G,H,S){var U,F,s,B;U=0;for(F=G.lights.length;U<F;U++){s=G.lights[U];if(s instanceof THREE.DirectionalLight){B=H.normalWorld.dot(s.position)*s.intensity;if(B>0){S.r+=s.color.r*B;S.g+=s.color.g*B;S.b+=s.color.b*B}}else if(s instanceof THREE.PointLight){g.sub(s.position,H.centroidWorld);g.normalize();B=H.normalWorld.dot(g)*s.intensity;if(B>0){S.r+=s.color.r*B;S.g+=s.color.g*B;S.b+=s.color.b*B}}}}function b(G,H,S,U,F,s){r=d(u++);r.setAttribute("d","M "+G.positionScreen.x+
" "+G.positionScreen.y+" L "+H.positionScreen.x+" "+H.positionScreen.y+" L "+S.positionScreen.x+","+S.positionScreen.y+"z");if(F instanceof THREE.MeshBasicMaterial)D.__styleString=F.color.__styleString;else if(F instanceof THREE.MeshLambertMaterial)if(R){L.r=M.r;L.g=M.g;L.b=M.b;a(s,U,L);D.r=F.color.r*L.r;D.g=F.color.g*L.g;D.b=F.color.b*L.b;D.updateStyleString()}else D.__styleString=F.color.__styleString;else if(F instanceof THREE.MeshDepthMaterial){i=1-F.__2near/(F.__farPlusNear-U.z*F.__farMinusNear);
D.setRGB(i,i,i)}else F instanceof THREE.MeshNormalMaterial&&D.setRGB(h(U.normalWorld.x),h(U.normalWorld.y),h(U.normalWorld.z));F.wireframe?r.setAttribute("style","fill: none; stroke: "+D.__styleString+"; stroke-width: "+F.wireframe_linewidth+"; stroke-opacity: "+F.opacity+"; stroke-linecap: "+F.wireframe_linecap+"; stroke-linejoin: "+F.wireframe_linejoin):r.setAttribute("style","fill: "+D.__styleString+"; fill-opacity: "+F.opacity);m.appendChild(r)}function f(G,H,S,U,F,s,B){r=d(u++);r.setAttribute("d",
"M "+G.positionScreen.x+" "+G.positionScreen.y+" L "+H.positionScreen.x+" "+H.positionScreen.y+" L "+S.positionScreen.x+","+S.positionScreen.y+" L "+U.positionScreen.x+","+U.positionScreen.y+"z");if(s instanceof THREE.MeshBasicMaterial)D.__styleString=s.color.__styleString;else if(s instanceof THREE.MeshLambertMaterial)if(R){L.r=M.r;L.g=M.g;L.b=M.b;a(B,F,L);D.r=s.color.r*L.r;D.g=s.color.g*L.g;D.b=s.color.b*L.b;D.updateStyleString()}else D.__styleString=s.color.__styleString;else if(s instanceof THREE.MeshDepthMaterial){i=
1-s.__2near/(s.__farPlusNear-F.z*s.__farMinusNear);D.setRGB(i,i,i)}else s instanceof THREE.MeshNormalMaterial&&D.setRGB(h(F.normalWorld.x),h(F.normalWorld.y),h(F.normalWorld.z));s.wireframe?r.setAttribute("style","fill: none; stroke: "+D.__styleString+"; stroke-width: "+s.wireframe_linewidth+"; stroke-opacity: "+s.opacity+"; stroke-linecap: "+s.wireframe_linecap+"; stroke-linejoin: "+s.wireframe_linejoin):r.setAttribute("style","fill: "+D.__styleString+"; fill-opacity: "+s.opacity);m.appendChild(r)}
function d(G){if(n[G]==null){n[G]=document.createElementNS("http://www.w3.org/2000/svg","path");x==0&&n[G].setAttribute("shape-rendering","crispEdges");return n[G]}return n[G]}function h(G){return G<0?Math.min((1+G)*0.5,0.5):0.5+Math.min(G*0.5,0.5)}var j=null,q=new THREE.Projector,m=document.createElementNS("http://www.w3.org/2000/svg","svg"),p,c,C,A,w,v,K,P,N=new THREE.Rectangle,t=new THREE.Rectangle,R=false,D=new THREE.Color(16777215),L=new THREE.Color(16777215),M=new THREE.Color(0),e=new THREE.Color(0),
k=new THREE.Color(0),i,g=new THREE.Vector3,n=[],l=[],o=[],r,u,E,V,x=1;this.domElement=m;this.sortElements=this.sortObjects=this.autoClear=true;this.setQuality=function(G){switch(G){case "high":x=1;break;case "low":x=0}};this.setSize=function(G,H){p=G;c=H;C=p/2;A=c/2;m.setAttribute("viewBox",-C+" "+-A+" "+p+" "+c);m.setAttribute("width",p);m.setAttribute("height",c);N.set(-C,-A,C,A)};this.clear=function(){for(;m.childNodes.length>0;)m.removeChild(m.childNodes[0])};this.render=function(G,H){var S,U,
F,s,B,Q,I,W;this.autoClear&&this.clear();j=q.projectScene(G,H,this.sortElements);V=E=u=0;if(R=G.lights.length>0){I=G.lights;M.setRGB(0,0,0);e.setRGB(0,0,0);k.setRGB(0,0,0);S=0;for(U=I.length;S<U;S++){F=I[S];s=F.color;if(F instanceof THREE.AmbientLight){M.r+=s.r;M.g+=s.g;M.b+=s.b}else if(F instanceof THREE.DirectionalLight){e.r+=s.r;e.g+=s.g;e.b+=s.b}else if(F instanceof THREE.PointLight){k.r+=s.r;k.g+=s.g;k.b+=s.b}}}S=0;for(U=j.length;S<U;S++){I=j[S];t.empty();if(I instanceof THREE.RenderableParticle){w=
I;w.x*=C;w.y*=-A;F=0;for(s=I.material.length;F<s;F++)if(W=I.material[F]){B=w;Q=I;W=W;var aa=E++;if(l[aa]==null){l[aa]=document.createElementNS("http://www.w3.org/2000/svg","circle");x==0&&l[aa].setAttribute("shape-rendering","crispEdges")}r=l[aa];r.setAttribute("cx",B.x);r.setAttribute("cy",B.y);r.setAttribute("r",Q.scale.x*C);if(W instanceof THREE.ParticleCircleMaterial){if(R){L.r=M.r+e.r+k.r;L.g=M.g+e.g+k.g;L.b=M.b+e.b+k.b;D.r=W.color.r*L.r;D.g=W.color.g*L.g;D.b=W.color.b*L.b;D.updateStyleString()}else D=
W.color;r.setAttribute("style","fill: "+D.__styleString)}m.appendChild(r)}}else if(I instanceof THREE.RenderableLine){w=I.v1;v=I.v2;w.positionScreen.x*=C;w.positionScreen.y*=-A;v.positionScreen.x*=C;v.positionScreen.y*=-A;t.addPoint(w.positionScreen.x,w.positionScreen.y);t.addPoint(v.positionScreen.x,v.positionScreen.y);if(N.instersects(t)){F=0;for(s=I.material.length;F<s;)if(W=I.material[F++]){B=w;Q=v;W=W;aa=V++;if(o[aa]==null){o[aa]=document.createElementNS("http://www.w3.org/2000/svg","line");
x==0&&o[aa].setAttribute("shape-rendering","crispEdges")}r=o[aa];r.setAttribute("x1",B.positionScreen.x);r.setAttribute("y1",B.positionScreen.y);r.setAttribute("x2",Q.positionScreen.x);r.setAttribute("y2",Q.positionScreen.y);if(W instanceof THREE.LineBasicMaterial){D.__styleString=W.color.__styleString;r.setAttribute("style","fill: none; stroke: "+D.__styleString+"; stroke-width: "+W.linewidth+"; stroke-opacity: "+W.opacity+"; stroke-linecap: "+W.linecap+"; stroke-linejoin: "+W.linejoin);m.appendChild(r)}}}}else if(I instanceof
THREE.RenderableFace3){w=I.v1;v=I.v2;K=I.v3;w.positionScreen.x*=C;w.positionScreen.y*=-A;v.positionScreen.x*=C;v.positionScreen.y*=-A;K.positionScreen.x*=C;K.positionScreen.y*=-A;t.addPoint(w.positionScreen.x,w.positionScreen.y);t.addPoint(v.positionScreen.x,v.positionScreen.y);t.addPoint(K.positionScreen.x,K.positionScreen.y);if(N.instersects(t)){F=0;for(s=I.meshMaterial.length;F<s;){W=I.meshMaterial[F++];if(W instanceof THREE.MeshFaceMaterial){B=0;for(Q=I.faceMaterial.length;B<Q;)(W=I.faceMaterial[B++])&&
b(w,v,K,I,W,G)}else W&&b(w,v,K,I,W,G)}}}else if(I instanceof THREE.RenderableFace4){w=I.v1;v=I.v2;K=I.v3;P=I.v4;w.positionScreen.x*=C;w.positionScreen.y*=-A;v.positionScreen.x*=C;v.positionScreen.y*=-A;K.positionScreen.x*=C;K.positionScreen.y*=-A;P.positionScreen.x*=C;P.positionScreen.y*=-A;t.addPoint(w.positionScreen.x,w.positionScreen.y);t.addPoint(v.positionScreen.x,v.positionScreen.y);t.addPoint(K.positionScreen.x,K.positionScreen.y);t.addPoint(P.positionScreen.x,P.positionScreen.y);if(N.instersects(t)){F=
0;for(s=I.meshMaterial.length;F<s;){W=I.meshMaterial[F++];if(W instanceof THREE.MeshFaceMaterial){B=0;for(Q=I.faceMaterial.length;B<Q;)(W=I.faceMaterial[B++])&&f(w,v,K,P,I,W,G)}else W&&f(w,v,K,P,I,W,G)}}}}}};
THREE.WebGLRenderer=function(a){function b(e,k,i){var g=c.createProgram();i=["#ifdef GL_ES\nprecision highp float;\n#endif",i?"#define USE_FOG":"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n");var n=[c.getParameter(c.MAX_VERTEX_TEXTURE_IMAGE_UNITS)>0?"#define VERTEX_TEXTURES":"","uniform mat4 objectMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\n"].join("\n");
c.attachShader(g,q("fragment",i+e));c.attachShader(g,q("vertex",n+k));c.linkProgram(g);c.getProgramParameter(g,c.LINK_STATUS)||alert("Could not initialise shaders\nVALIDATE_STATUS: "+c.getProgramParameter(g,c.VALIDATE_STATUS)+", gl error ["+c.getError()+"]");g.uniforms={};g.attributes={};return g}function f(e,k){if(e.image.length==6){if(!e.image.__webGLTextureCube&&!e.image.__cubeMapInitialized&&e.image.loadCount==6){e.image.__webGLTextureCube=c.createTexture();c.bindTexture(c.TEXTURE_CUBE_MAP,e.image.__webGLTextureCube);
c.texParameteri(c.TEXTURE_CUBE_MAP,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE);c.texParameteri(c.TEXTURE_CUBE_MAP,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE);c.texParameteri(c.TEXTURE_CUBE_MAP,c.TEXTURE_MAG_FILTER,c.LINEAR);c.texParameteri(c.TEXTURE_CUBE_MAP,c.TEXTURE_MIN_FILTER,c.LINEAR_MIPMAP_LINEAR);for(var i=0;i<6;++i)c.texImage2D(c.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,e.image[i]);c.generateMipmap(c.TEXTURE_CUBE_MAP);c.bindTexture(c.TEXTURE_CUBE_MAP,null);e.image.__cubeMapInitialized=true}c.activeTexture(c.TEXTURE0+
k);c.bindTexture(c.TEXTURE_CUBE_MAP,e.image.__webGLTextureCube)}}function d(e,k){if(!e.__webGLTexture&&e.image.loaded){e.__webGLTexture=c.createTexture();c.bindTexture(c.TEXTURE_2D,e.__webGLTexture);c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,e.image);c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,m(e.wrap_s));c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,m(e.wrap_t));c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,m(e.mag_filter));c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,
m(e.min_filter));c.generateMipmap(c.TEXTURE_2D);c.bindTexture(c.TEXTURE_2D,null)}c.activeTexture(c.TEXTURE0+k);c.bindTexture(c.TEXTURE_2D,e.__webGLTexture)}function h(e,k){var i,g,n;i=0;for(g=k.length;i<g;i++){n=k[i];e.uniforms[n]=c.getUniformLocation(e,n)}}function j(e,k){var i,g,n;i=0;for(g=k.length;i<g;i++){n=k[i];e.attributes[n]=c.getAttribLocation(e,n)}}function q(e,k){var i;if(e=="fragment")i=c.createShader(c.FRAGMENT_SHADER);else if(e=="vertex")i=c.createShader(c.VERTEX_SHADER);c.shaderSource(i,
k);c.compileShader(i);if(!c.getShaderParameter(i,c.COMPILE_STATUS)){alert(c.getShaderInfoLog(i));return null}return i}function m(e){switch(e){case THREE.RepeatWrapping:return c.REPEAT;case THREE.ClampToEdgeWrapping:return c.CLAMP_TO_EDGE;case THREE.MirroredRepeatWrapping:return c.MIRRORED_REPEAT;case THREE.NearestFilter:return c.NEAREST;case THREE.NearestMipMapNearestFilter:return c.NEAREST_MIPMAP_NEAREST;case THREE.NearestMipMapLinearFilter:return c.NEAREST_MIPMAP_LINEAR;case THREE.LinearFilter:return c.LINEAR;
case THREE.LinearMipMapNearestFilter:return c.LINEAR_MIPMAP_NEAREST;case THREE.LinearMipMapLinearFilter:return c.LINEAR_MIPMAP_LINEAR}return 0}var p=document.createElement("canvas"),c,C,A,w=new THREE.Matrix4,v,K=new Float32Array(16),P=new Float32Array(16),N=new Float32Array(16),t=new Float32Array(9),R=new Float32Array(16),D=function(e,k){if(e){var i,g,n,l=pointLights=maxDirLights=maxPointLights=0;i=0;for(g=e.lights.length;i<g;i++){n=e.lights[i];n instanceof THREE.DirectionalLight&&l++;n instanceof
THREE.PointLight&&pointLights++}if(pointLights+l<=k){maxDirLights=l;maxPointLights=pointLights}else{maxDirLights=Math.ceil(k*l/(pointLights+l));maxPointLights=k-maxDirLights}return{directional:maxDirLights,point:maxPointLights}}return{directional:1,point:k-1}}(a,4);fog=a?a.fog:null;this.domElement=p;this.autoClear=true;try{c=p.getContext("experimental-webgl",{antialias:true})}catch(L){}if(!c){alert("WebGL not supported");throw"cannot create webgl context";}c.clearColor(0,0,0,1);c.clearDepth(1);c.enable(c.DEPTH_TEST);
c.depthFunc(c.LEQUAL);c.frontFace(c.CCW);c.cullFace(c.BACK);c.enable(c.CULL_FACE);c.enable(c.BLEND);c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA);c.clearColor(0,0,0,0);C=A=function(e,k,i){var g=[e?"#define MAX_DIR_LIGHTS "+e:"",k?"#define MAX_POINT_LIGHTS "+k:"","uniform bool enableLighting;\nuniform bool useRefract;\nuniform int pointLightNumber;\nuniform int directionalLightNumber;\nuniform vec3 ambientLightColor;",e?"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];":"",e?"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];":
"",k?"uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];":"",k?"uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];":"","varying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vLightWeighting;",k?"varying vec3 vPointLightVector[ MAX_POINT_LIGHTS ];":"","varying vec3 vViewPosition;\nvarying vec3 vReflect;\nuniform float mRefractionRatio;\nvoid main(void) {\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\nvec3 nWorld = mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal;\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvec3 transformedNormal = normalize( normalMatrix * normal );\nif ( !enableLighting ) {\nvLightWeighting = vec3( 1.0, 1.0, 1.0 );\n} else {\nvLightWeighting = ambientLightColor;",
e?"for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {":"",e?"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );":"",e?"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );":"",e?"vLightWeighting += directionalLightColor[ i ] * directionalLightWeighting;":"",e?"}":"",k?"for( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {":"",k?"vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );":"",k?"vPointLightVector[ i ] = normalize( lPosition.xyz - mvPosition.xyz );":
"",k?"float pointLightWeighting = max( dot( transformedNormal, vPointLightVector[ i ] ), 0.0 );":"",k?"vLightWeighting += pointLightColor[ i ] * pointLightWeighting;":"",k?"}":"","}\nvNormal = transformedNormal;\nvUv = uv;\nif ( useRefract ) {\nvReflect = refract( normalize(mPosition.xyz - cameraPosition), normalize(nWorld.xyz), mRefractionRatio );\n} else {\nvReflect = reflect( normalize(mPosition.xyz - cameraPosition), normalize(nWorld.xyz) );\n}\ngl_Position = projectionMatrix * mvPosition;\n}"].join("\n"),
n=[e?"#define MAX_DIR_LIGHTS "+e:"",k?"#define MAX_POINT_LIGHTS "+k:"","uniform int material;\nuniform bool enableMap;\nuniform bool enableCubeMap;\nuniform bool mixEnvMap;\nuniform samplerCube tCube;\nuniform float mReflectivity;\nuniform sampler2D tMap;\nuniform vec4 mColor;\nuniform float mOpacity;\nuniform vec4 mAmbient;\nuniform vec4 mSpecular;\nuniform float mShininess;\n#ifdef USE_FOG\nuniform vec3 fogColor;\nuniform float fogDensity;\n#endif\nuniform int pointLightNumber;\nuniform int directionalLightNumber;",
e?"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];":"","varying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vLightWeighting;",k?"varying vec3 vPointLightVector[ MAX_POINT_LIGHTS ];":"","varying vec3 vViewPosition;\nvarying vec3 vReflect;\nvoid main() {\nvec4 mapColor = vec4( 1.0, 1.0, 1.0, 1.0 );\nvec4 cubeColor = vec4( 1.0, 1.0, 1.0, 1.0 );\nif ( enableMap ) {\nmapColor = texture2D( tMap, vUv );\n}\nif ( enableCubeMap ) {\ncubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\n}\nif ( material == 2 ) { \nvec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );",
k?"vec4 pointDiffuse  = vec4( 0.0, 0.0, 0.0, 0.0 );":"",k?"vec4 pointSpecular = vec4( 0.0, 0.0, 0.0, 0.0 );":"",k?"for( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {":"",k?"vec3 pointVector = normalize( vPointLightVector[ i ] );":"",k?"vec3 pointHalfVector = normalize( vPointLightVector[ i ] + vViewPosition );":"",k?"float pointDotNormalHalf = dot( normal, pointHalfVector );":"",k?"float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );":"",k?"float pointSpecularWeight = 0.0;":"",k?"if ( pointDotNormalHalf >= 0.0 )":
"",k?"pointSpecularWeight = pow( pointDotNormalHalf, mShininess );":"",k?"pointDiffuse  += mColor * pointDiffuseWeight;":"",k?"pointSpecular += mSpecular * pointSpecularWeight;":"",k?"}":"",e?"vec4 dirDiffuse  = vec4( 0.0, 0.0, 0.0, 0.0 );":"",e?"vec4 dirSpecular = vec4( 0.0, 0.0, 0.0, 0.0 );":"",e?"for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {":"",e?"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );":"",e?"vec3 dirVector = normalize( lDirection.xyz );":"",e?"vec3 dirHalfVector = normalize( lDirection.xyz + vViewPosition );":
"",e?"float dirDotNormalHalf = dot( normal, dirHalfVector );":"",e?"float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );":"",e?"float dirSpecularWeight = 0.0;":"",e?"if ( dirDotNormalHalf >= 0.0 )":"",e?"dirSpecularWeight = pow( dirDotNormalHalf, mShininess );":"",e?"dirDiffuse  += mColor * dirDiffuseWeight;":"",e?"dirSpecular += mSpecular * dirSpecularWeight;":"",e?"}":"","vec4 totalLight = mAmbient;",e?"totalLight += dirDiffuse + dirSpecular;":"",k?"totalLight += pointDiffuse + pointSpecular;":
"","if ( mixEnvMap ) {\ngl_FragColor = vec4( mix( mapColor.rgb * totalLight.xyz * vLightWeighting, cubeColor.rgb, mReflectivity ), mapColor.a );\n} else {\ngl_FragColor = vec4( mapColor.rgb * cubeColor.rgb * totalLight.xyz * vLightWeighting, mapColor.a );\n}\n} else if ( material == 1 ) {\nif ( mixEnvMap ) {\ngl_FragColor = vec4( mix( mColor.rgb * mapColor.rgb * vLightWeighting, cubeColor.rgb, mReflectivity ), mColor.a * mapColor.a );\n} else {\ngl_FragColor = vec4( mColor.rgb * mapColor.rgb * cubeColor.rgb * vLightWeighting, mColor.a * mapColor.a );\n}\n} else {\nif ( mixEnvMap ) {\ngl_FragColor = mix( mColor * mapColor, cubeColor, mReflectivity );\n} else {\ngl_FragColor = mColor * mapColor * cubeColor;\n}\n}\n#ifdef USE_FOG\nconst float LOG2 = 1.442695;\nfloat z = gl_FragCoord.z / gl_FragCoord.w;\nfloat fogFactor = exp2( - fogDensity * fogDensity * z * z * LOG2 );\nfogFactor = clamp( fogFactor, 0.0, 1.0 );\ngl_FragColor = mix( vec4( fogColor, 1.0 ), gl_FragColor, fogFactor );\n#endif\n}"].join("\n");
g=b(n,g,i);c.useProgram(g);h(g,["viewMatrix","modelViewMatrix","projectionMatrix","normalMatrix","objectMatrix","cameraPosition","enableLighting","ambientLightColor","material","mColor","mAmbient","mSpecular","mShininess","mOpacity","enableMap","tMap","enableCubeMap","tCube","mixEnvMap","mReflectivity","mRefractionRatio","useRefract"]);i&&h(g,["fogColor","fogDensity"]);e&&h(g,["directionalLightNumber","directionalLightColor","directionalLightDirection"]);k&&h(g,["pointLightNumber","pointLightColor",
"pointLightPosition"]);c.uniform1i(g.uniforms.enableMap,0);c.uniform1i(g.uniforms.tMap,0);c.uniform1i(g.uniforms.enableCubeMap,0);c.uniform1i(g.uniforms.tCube,1);c.uniform1i(g.uniforms.mixEnvMap,0);c.uniform1i(g.uniforms.useRefract,0);j(g,["position","normal","uv"]);return g}(D.directional,D.point,fog);this.setSize=function(e,k){p.width=e;p.height=k;c.viewport(0,0,p.width,p.height)};this.clear=function(){c.clear(c.COLOR_BUFFER_BIT|c.DEPTH_BUFFER_BIT)};this.setupLights=function(e,k){var i,g,n,l,o,
r=[],u=[],E=[];l=[];o=[];c.uniform1i(e.uniforms.enableLighting,k.length);i=0;for(g=k.length;i<g;i++){n=k[i];if(n instanceof THREE.AmbientLight)r.push(n);else if(n instanceof THREE.DirectionalLight)E.push(n);else n instanceof THREE.PointLight&&u.push(n)}i=n=l=o=0;for(g=r.length;i<g;i++){n+=r[i].color.r;l+=r[i].color.g;o+=r[i].color.b}c.uniform3f(e.uniforms.ambientLightColor,n,l,o);l=[];o=[];i=0;for(g=E.length;i<g;i++){n=E[i];l.push(n.color.r*n.intensity);l.push(n.color.g*n.intensity);l.push(n.color.b*
n.intensity);o.push(n.position.x);o.push(n.position.y);o.push(n.position.z)}if(E.length){c.uniform1i(e.uniforms.directionalLightNumber,E.length);c.uniform3fv(e.uniforms.directionalLightDirection,o);c.uniform3fv(e.uniforms.directionalLightColor,l)}l=[];o=[];i=0;for(g=u.length;i<g;i++){n=u[i];l.push(n.color.r*n.intensity);l.push(n.color.g*n.intensity);l.push(n.color.b*n.intensity);o.push(n.position.x);o.push(n.position.y);o.push(n.position.z)}if(u.length){c.uniform1i(e.uniforms.pointLightNumber,u.length);
c.uniform3fv(e.uniforms.pointLightPosition,o);c.uniform3fv(e.uniforms.pointLightColor,l)}};this.createBuffers=function(e,k){var i,g,n,l,o,r,u,E,V,x=[],G=[],H=[],S=[],U=[],F=[],s=0,B=e.geometry.geometryChunks[k],Q;n=false;i=0;for(g=e.material.length;i<g;i++){meshMaterial=e.material[i];if(meshMaterial instanceof THREE.MeshFaceMaterial){o=0;for(Q=B.material.length;o<Q;o++)if(B.material[o]&&B.material[o].shading!=undefined&&B.material[o].shading==THREE.SmoothShading){n=true;break}}else if(meshMaterial&&
meshMaterial.shading!=undefined&&meshMaterial.shading==THREE.SmoothShading){n=true;break}if(n)break}Q=n;i=0;for(g=B.faces.length;i<g;i++){n=B.faces[i];l=e.geometry.faces[n];o=l.vertexNormals;faceNormal=l.normal;n=e.geometry.uvs[n];if(l instanceof THREE.Face3){r=e.geometry.vertices[l.a].position;u=e.geometry.vertices[l.b].position;E=e.geometry.vertices[l.c].position;H.push(r.x,r.y,r.z);H.push(u.x,u.y,u.z);H.push(E.x,E.y,E.z);if(e.geometry.hasTangents){r=e.geometry.vertices[l.a].tangent;u=e.geometry.vertices[l.b].tangent;
E=e.geometry.vertices[l.c].tangent;U.push(r.x,r.y,r.z,r.w);U.push(u.x,u.y,u.z,u.w);U.push(E.x,E.y,E.z,E.w)}if(o.length==3&&Q)for(l=0;l<3;l++)S.push(o[l].x,o[l].y,o[l].z);else for(l=0;l<3;l++)S.push(faceNormal.x,faceNormal.y,faceNormal.z);if(n)for(l=0;l<3;l++)F.push(n[l].u,n[l].v);x.push(s,s+1,s+2);G.push(s,s+1);G.push(s,s+2);G.push(s+1,s+2);s+=3}else if(l instanceof THREE.Face4){r=e.geometry.vertices[l.a].position;u=e.geometry.vertices[l.b].position;E=e.geometry.vertices[l.c].position;V=e.geometry.vertices[l.d].position;
H.push(r.x,r.y,r.z);H.push(u.x,u.y,u.z);H.push(E.x,E.y,E.z);H.push(V.x,V.y,V.z);if(e.geometry.hasTangents){r=e.geometry.vertices[l.a].tangent;u=e.geometry.vertices[l.b].tangent;E=e.geometry.vertices[l.c].tangent;l=e.geometry.vertices[l.d].tangent;U.push(r.x,r.y,r.z,r.w);U.push(u.x,u.y,u.z,u.w);U.push(E.x,E.y,E.z,E.w);U.push(l.x,l.y,l.z,l.w)}if(o.length==4&&Q)for(l=0;l<4;l++)S.push(o[l].x,o[l].y,o[l].z);else for(l=0;l<4;l++)S.push(faceNormal.x,faceNormal.y,faceNormal.z);if(n)for(l=0;l<4;l++)F.push(n[l].u,
n[l].v);x.push(s,s+1,s+2);x.push(s,s+2,s+3);G.push(s,s+1);G.push(s,s+2);G.push(s,s+3);G.push(s+1,s+2);G.push(s+2,s+3);s+=4}}if(H.length){B.__webGLVertexBuffer=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,B.__webGLVertexBuffer);c.bufferData(c.ARRAY_BUFFER,new Float32Array(H),c.STATIC_DRAW);B.__webGLNormalBuffer=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,B.__webGLNormalBuffer);c.bufferData(c.ARRAY_BUFFER,new Float32Array(S),c.STATIC_DRAW);if(e.geometry.hasTangents){B.__webGLTangentBuffer=c.createBuffer();
c.bindBuffer(c.ARRAY_BUFFER,B.__webGLTangentBuffer);c.bufferData(c.ARRAY_BUFFER,new Float32Array(U),c.STATIC_DRAW)}if(F.length>0){B.__webGLUVBuffer=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,B.__webGLUVBuffer);c.bufferData(c.ARRAY_BUFFER,new Float32Array(F),c.STATIC_DRAW)}B.__webGLFaceBuffer=c.createBuffer();c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,B.__webGLFaceBuffer);c.bufferData(c.ELEMENT_ARRAY_BUFFER,new Uint16Array(x),c.STATIC_DRAW);B.__webGLLineBuffer=c.createBuffer();c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,
B.__webGLLineBuffer);c.bufferData(c.ELEMENT_ARRAY_BUFFER,new Uint16Array(G),c.STATIC_DRAW);B.__webGLFaceCount=x.length;B.__webGLLineCount=G.length}};this.renderBuffer=function(e,k,i,g,n){var l,o,r,u,E,V,x,G,H;if(g instanceof THREE.MeshShaderMaterial||g instanceof THREE.MeshDepthMaterial||g instanceof THREE.MeshNormalMaterial){if(!g.program){if(g instanceof THREE.MeshDepthMaterial){x=M.depth;g.fragment_shader=x.fragment_shader;g.vertex_shader=x.vertex_shader;g.uniforms=x.uniforms;g.uniforms.mNear.value=
g.near;g.uniforms.mFar.value=g.far}else if(g instanceof THREE.MeshNormalMaterial){x=M.normal;g.fragment_shader=x.fragment_shader;g.vertex_shader=x.vertex_shader;g.uniforms=x.uniforms}g.program=b(g.fragment_shader,g.vertex_shader,null);x=["viewMatrix","modelViewMatrix","projectionMatrix","normalMatrix","objectMatrix","cameraPosition"];for(H in g.uniforms)x.push(H);h(g.program,x);j(g.program,["position","normal","uv","tangent"])}H=g.program}else H=A;if(H!=C){c.useProgram(H);C=H}H==A&&this.setupLights(H,
k);this.loadCamera(H,e);this.loadMatrices(H);if(g instanceof THREE.MeshShaderMaterial||g instanceof THREE.MeshDepthMaterial||g instanceof THREE.MeshNormalMaterial){r=g.wireframe;u=g.wireframe_linewidth;e=H;k=g.uniforms;var S;for(l in k){G=k[l].type;x=k[l].value;S=e.uniforms[l];if(G=="i")c.uniform1i(S,x);else if(G=="f")c.uniform1f(S,x);else if(G=="v3")c.uniform3f(S,x.x,x.y,x.z);else if(G=="c")c.uniform3f(S,x.r,x.g,x.b);else if(G=="t"){c.uniform1i(S,x);if(G=k[l].texture)G.image instanceof Array&&G.image.length==
6?f(G,x):d(G,x)}}}if(g instanceof THREE.MeshPhongMaterial||g instanceof THREE.MeshLambertMaterial||g instanceof THREE.MeshBasicMaterial){l=g.color;o=g.opacity;r=g.wireframe;u=g.wireframe_linewidth;E=g.map;V=g.env_map;k=g.combine==THREE.MixOperation;e=g.reflectivity;G=g.env_map&&g.env_map.mapping instanceof THREE.CubeRefractionMapping;x=g.refraction_ratio;c.uniform4f(H.uniforms.mColor,l.r*o,l.g*o,l.b*o,o);c.uniform1i(H.uniforms.mixEnvMap,k);c.uniform1f(H.uniforms.mReflectivity,e);c.uniform1i(H.uniforms.useRefract,
G);c.uniform1f(H.uniforms.mRefractionRatio,x);if(i){c.uniform1f(H.uniforms.fogDensity,i.density);c.uniform3f(H.uniforms.fogColor,i.color.r,i.color.g,i.color.b)}}if(g instanceof THREE.MeshPhongMaterial){i=g.ambient;l=g.specular;g=g.shininess;c.uniform4f(H.uniforms.mAmbient,i.r,i.g,i.b,o);c.uniform4f(H.uniforms.mSpecular,l.r,l.g,l.b,o);c.uniform1f(H.uniforms.mShininess,g);c.uniform1i(H.uniforms.material,2)}else if(g instanceof THREE.MeshLambertMaterial)c.uniform1i(H.uniforms.material,1);else g instanceof
THREE.MeshBasicMaterial&&c.uniform1i(H.uniforms.material,0);if(E){d(E,0);c.uniform1i(H.uniforms.tMap,0);c.uniform1i(H.uniforms.enableMap,1)}else c.uniform1i(H.uniforms.enableMap,0);if(V){f(V,1);c.uniform1i(H.uniforms.tCube,1);c.uniform1i(H.uniforms.enableCubeMap,1)}else c.uniform1i(H.uniforms.enableCubeMap,0);o=H.attributes;c.bindBuffer(c.ARRAY_BUFFER,n.__webGLVertexBuffer);c.vertexAttribPointer(o.position,3,c.FLOAT,false,0,0);c.enableVertexAttribArray(o.position);if(o.normal>=0){c.bindBuffer(c.ARRAY_BUFFER,
n.__webGLNormalBuffer);c.vertexAttribPointer(o.normal,3,c.FLOAT,false,0,0);c.enableVertexAttribArray(o.normal)}if(o.tangent>=0){c.bindBuffer(c.ARRAY_BUFFER,n.__webGLTangentBuffer);c.vertexAttribPointer(o.tangent,4,c.FLOAT,false,0,0);c.enableVertexAttribArray(o.tangent)}if(o.uv>=0)if(n.__webGLUVBuffer){c.bindBuffer(c.ARRAY_BUFFER,n.__webGLUVBuffer);c.vertexAttribPointer(o.uv,2,c.FLOAT,false,0,0);c.enableVertexAttribArray(o.uv)}else c.disableVertexAttribArray(o.uv);if(r){c.lineWidth(u);c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,
n.__webGLLineBuffer);c.drawElements(c.LINES,n.__webGLLineCount,c.UNSIGNED_SHORT,0)}else{c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,n.__webGLFaceBuffer);c.drawElements(c.TRIANGLES,n.__webGLFaceCount,c.UNSIGNED_SHORT,0)}};this.renderPass=function(e,k,i,g,n,l,o){var r,u,E,V,x;E=0;for(V=g.material.length;E<V;E++){r=g.material[E];if(r instanceof THREE.MeshFaceMaterial){r=0;for(u=n.material.length;r<u;r++)if((x=n.material[r])&&x.blending==l&&x.opacity<1==o){this.setBlending(x.blending);this.renderBuffer(e,k,i,
x,n)}}else if((x=r)&&x.blending==l&&x.opacity<1==o){this.setBlending(x.blending);this.renderBuffer(e,k,i,x,n)}}};this.render=function(e,k){var i,g,n,l,o=e.lights,r=e.fog;this.initWebGLObjects(e);this.autoClear&&this.clear();k.autoUpdateMatrix&&k.updateMatrix();K.set(k.matrix.flatten());N.set(k.projectionMatrix.flatten());i=0;for(g=e.__webGLObjects.length;i<g;i++){n=e.__webGLObjects[i];l=n.object;n=n.buffer;if(l.visible){this.setupMatrices(l,k);this.renderPass(k,o,r,l,n,THREE.NormalBlending,false)}}i=
0;for(g=e.__webGLObjects.length;i<g;i++){n=e.__webGLObjects[i];l=n.object;n=n.buffer;if(l.visible){this.setupMatrices(l,k);this.renderPass(k,o,r,l,n,THREE.AdditiveBlending,false);this.renderPass(k,o,r,l,n,THREE.SubtractiveBlending,false);this.renderPass(k,o,r,l,n,THREE.AdditiveBlending,true);this.renderPass(k,o,r,l,n,THREE.SubtractiveBlending,true);this.renderPass(k,o,r,l,n,THREE.NormalBlending,true)}}};this.initWebGLObjects=function(e){var k,i,g,n,l,o;if(!e.__webGLObjects){e.__webGLObjects=[];e.__webGLObjectsMap=
{}}k=0;for(i=e.objects.length;k<i;k++){g=e.objects[k];if(e.__webGLObjectsMap[g.id]==undefined)e.__webGLObjectsMap[g.id]={};o=e.__webGLObjectsMap[g.id];if(g instanceof THREE.Mesh)for(l in g.geometry.geometryChunks){n=g.geometry.geometryChunks[l];n.__webGLVertexBuffer||this.createBuffers(g,l);if(o[l]==undefined){n={buffer:n,object:g};e.__webGLObjects.push(n);o[l]=1}}}};this.removeObject=function(e,k){var i,g;for(i=e.__webGLObjects.length-1;i>=0;i--){g=e.__webGLObjects[i].object;k==g&&e.__webGLObjects.splice(i,
1)}};this.setupMatrices=function(e,k){e.autoUpdateMatrix&&e.updateMatrix();w.multiply(k.matrix,e.matrix);P.set(w.flatten());v=THREE.Matrix4.makeInvert3x3(w).transpose();t.set(v.m);R.set(e.matrix.flatten())};this.loadMatrices=function(e){c.uniformMatrix4fv(e.uniforms.viewMatrix,false,K);c.uniformMatrix4fv(e.uniforms.modelViewMatrix,false,P);c.uniformMatrix4fv(e.uniforms.projectionMatrix,false,N);c.uniformMatrix3fv(e.uniforms.normalMatrix,false,t);c.uniformMatrix4fv(e.uniforms.objectMatrix,false,R)};
this.loadCamera=function(e,k){c.uniform3f(e.uniforms.cameraPosition,k.position.x,k.position.y,k.position.z)};this.setBlending=function(e){switch(e){case THREE.AdditiveBlending:c.blendEquation(c.FUNC_ADD);c.blendFunc(c.ONE,c.ONE);break;case THREE.SubtractiveBlending:c.blendFunc(c.DST_COLOR,c.ZERO);break;default:c.blendEquation(c.FUNC_ADD);c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA)}};this.setFaceCulling=function(e,k){if(e){!k||k=="ccw"?c.frontFace(c.CCW):c.frontFace(c.CW);if(e=="back")c.cullFace(c.BACK);
else e=="front"?c.cullFace(c.FRONT):c.cullFace(c.FRONT_AND_BACK);c.enable(c.CULL_FACE)}else c.disable(c.CULL_FACE)};this.supportsVertexTextures=function(){return c.getParameter(c.MAX_VERTEX_TEXTURE_IMAGE_UNITS)>0};var M={depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2E3}},fragment_shader:"uniform float mNear;\nuniform float mFar;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), 1.0 );\n}",
vertex_shader:"void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}"},normal:{uniforms:{},fragment_shader:"varying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, 1.0 );\n}",vertex_shader:"varying vec3 vNormal;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalize( normalMatrix * normal );\ngl_Position = projectionMatrix * mvPosition;\n}"}}};
THREE.RenderableObject=function(){this.z=this.object=null};THREE.RenderableFace3=function(){this.z=null;this.v1=new THREE.Vertex;this.v2=new THREE.Vertex;this.v3=new THREE.Vertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[];this.faceMaterial=this.meshMaterial=null;this.overdraw=false;this.uvs=[null,null,null]};
THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=null;this.scale=new THREE.Vector2;this.material=null};THREE.RenderableLine=function(){this.z=null;this.v1=new THREE.Vertex;this.v2=new THREE.Vertex;this.material=null};
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

		var w,
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

		for ( var i = 0, l = scope.faces.length; i < l; i ++ ) {

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

}

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

}

Plane.prototype = new THREE.Geometry();
Plane.prototype.constructor = Plane;
(function(win, doc, T, undefined) {
  var setInterval = win.setInterval;
  var clearInterval = win.clearInterval;
  var setTimeout = win.setTimeout;
  var clearTimeout = win.clearTimeout;
  var XMLHttpRequest = win.XMLHttpRequest;

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

	var request = new (window.XMLHttpRequest || window.ActiveXObject)('Microsoft.XMLHTTP');
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

  function $(id) {
    return doc.getElementById(id);
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


  function Environment(width, depth, height) {
    this.width = width;
    this.depth = depth;
    this.height = height;

    this.position = new Position(0, 0);
    this.direction = new Position(0, 1);

    this.createFields();
    this.initBeepSound();
  }

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

  Environment.prototype.istZiegel = function() {
    return this.getField(this.forward()).ziegel > 0;
  };

  Environment.prototype.hinlegen = function() {
    if (this.istWand()) throw new Error("Karol kann keinen Ziegel hinlegen. Er steht vor einer Wand.");
    var field = this.getField(this.forward());
    if (field.ziegel >= this.height) throw new Error("Karol kann keinen Ziegel hinlegen, da die Maximalhoehe erreicht wurde.");
    field.ziegel += 1;
  };

  Environment.prototype.aufheben = function() {
    if (this.istWand()) throw new Error("Karol kann keinen Ziegel aufheben. Er steht vor einer Wand.");
    var field = this.getField(this.forward());
    if (!field.ziegel) throw new Error("Karol kann keinen Ziegel aufheben, da kein Ziegel vor ihm liegt.");
    field.ziegel--;
  };

  Environment.prototype.markeSetzen = function() {
    this.getField(this.position).marke = true;
  };

  Environment.prototype.markeLoeschen = function() {
    this.getField(this.position).marke = false;
  };

  Environment.prototype.marke = function() {
    var field = this.getField(this.position);
    field.marke = !field.marke;
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
  };

  Environment.prototype.rechtsDrehen = function() {
    this.direction = new Position(-this.direction.y, this.direction.x);
  };

  Environment.prototype.schritt = function() {
    if (this.istWand()) throw new Error("Karol kann keinen Schritt machen, er steht vor einer Wand.");
    var newPosition = this.forward();
    if (Math.abs(this.getField(this.position).ziegel - this.getField(newPosition).ziegel) > 1)
      throw new Error("Karol kann nur einen Ziegel pro Schritt nach oben oder unten springen.");
    this.position = newPosition;
  };

  Environment.prototype.quader = function() {
    var position = this.forward();
    if (!this.isValid(position)) throw new Error("Karol kann keinen Quader hinlegen. Er steht vor einer Wand.");
    var field = this.getField(position);
    if (field.quader) throw new Error("Karol kann keinen Quader hinlegen, da schon einer liegt.");
    if (field.ziegel) throw new Error("Karol kann keinen Quader hinlegen, da auf dem Feld schon Ziegel liegen.");
    field.quader = true;
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

  Environment.prototype.entfernen = function() {
    var position = this.forward();
    if (!this.isValid(position)) throw new Error("Karol kann keinen Quader entfernen. Er steht vor einer Wand.");
    var field = this.getField(position);
    if (!field.quader) throw new Error("Karol kann keinen Quader entfernen, da auf dem Feld kein Quader liegt.");
    field.quader = false;
  };

  Environment.prototype.run = function(code) {
    var self = this;
    this.clone().execute(code, function(stack) {
      self.stack = stack;
      self.slowly();
    });
  };

  Environment.prototype.clone = function() {
    var env = new Environment(this.width, this.depth, this.height);
    env.position  = this.position.clone();
    env.direction = this.direction.clone();
    env.fields = clone(this.fields);
    return env;
  };

  Environment.prototype.execute = function(code, callback) {
    var karol = win.karol = {};
    var stack = [];
    var self = this;
    var timed = [];
    var cached = {};
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

    function cleanup() {
      delete win.karol;

      each(newGlobalFunctions, function(newFn, oldFn) {
        delete win[newFn];
      });

      each(cached, function(fn, name) {
        win[name] = fn;
      });
    }

    function end() {
      if (!timed.length) {
        cleanup();
        callback(stack);
      }
    }

    each(['istWand', 'schritt', 'linksDrehen', 'rechtsDrehen', 'hinlegen', 'aufheben', 'istZiegel', 'markeSetzen', 'markeLoeschen', 'istMarke'], function(name) {
      karol[name] = function(n) {
        n = n || 1;


        for (var i = 0; i < n; i++) {
          var result = self[name]();
          stack.push(name);
        }
        return result;
      };
    });

    karol.ton = function() {
      stack.push('ton');
    };

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
        removeFromArray(timed, xhr);
        exec(fn);
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

    newGlobalFunctions = {
      'laden': 'XMLHttpRequest',
      'warten': 'setTimeout',
      'periode': 'setInterval',
      'stop': ['clearInterval', 'clearTimeout'],
      'beenden': null,
    };

    each(newGlobalFunctions, function(oldFn, newFn) {
      each(toArray(oldFn), function(oldFn) {
        cached[oldFn] = win[oldFn];
        win[oldFn] = errorFunction("Verwenden Sie anstatt '"+oldFn+"' die Funktion '"+newFn+"' wie in der Dokumentation beschrieben.");
      });
      karol[newFn] = errorFunction("Die Funktion '"+newFn+"'ist kein Methode von Karol, sondern eine globale Funktion. Sie muss ohne 'karol.' aufgerufen werden.");
    });

    exec(function() {
      win.eval(code); // evil, I know
    });
  };

  Environment.prototype.next = function() {
    var command = this.stack.shift();
    if (typeof command == 'string') {
      this[command]();
    } else if (command instanceof Error) {
      win.alert(command);
    }
  };

  Environment.prototype.slowly = function() {
    var self = this;
    var interval = win.setInterval(function() {
      if (self.stack.length == 0) {
        clearInterval(interval);
      } else {
        self.next();
        self.onchange && self.onchange();
      }
    }, 150);
  };


  /*
   * View
   */

  function EnvironmentView(el, model) {
    this.model = model;
    this.createFields();

    var self = this;
    model.onchange = function() {
      self.updateFields();
      self.render();
    };

    this.el = el;
    this.renderer = new T.CanvasRenderer();
    this.createMouseListener();
    this.scene = new T.Scene();
    this.updateSize();
    this.degrees = 45;
    this.cameraZ = 120;
    this.updateCameraPosition();
    this.createGrid();
    this.render();
    this.inject();
  }

  EnvironmentView.GW = 40; // Grid Width
  EnvironmentView.GH = 25; // Grid Height

  EnvironmentView.prototype.createMouseListener = function() {
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

  EnvironmentView.prototype.createGrid = function() {
    var model = this.model;
    var w = model.width,
        d = model.depth,
        h = model.height;

    var material = new T.MeshBasicMaterial({ color: 0x5555cc, wireframe: true });
    var GW = EnvironmentView.GW;
    var GH = EnvironmentView.GH;

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

  EnvironmentView.prototype.createFields = function() {
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

  EnvironmentView.prototype.updateFields = function() {
    var model = this.model;
    var w = model.width,
        d = model.depth;

    var scene = this.scene;

    var GW = EnvironmentView.GW,
        GH = EnvironmentView.GH;
    var x0 = -GW*(model.width/2),
        y0 = GW*(model.depth/2);

    function createCubeMaterial(props) {
      var materials = [];
      for (var i = 0; i < 6; i++) {
        materials.push([new T.MeshBasicMaterial(props)]);
      }
      return materials;
    }

    var ZIEGEL_MATERIAL = createCubeMaterial({ color: 0xff0000, wireframe: true });
    var QUADER_MATERIAL = createCubeMaterial({ color: 0x666666 });


    var fields = this.fields;
    for (var x = 0; x < w; x++) {
      var row = fields[x];
      for (var y = 0; y < d; y++) {
        var fieldObj = row[y];
        var field = model.fields[x][y];

        while (field.ziegel < fieldObj.ziegel.length) {
          scene.removeObject(fieldObj.ziegel.pop());
          if (fieldObj.marke) {
            fieldObj.marke.position.z = fieldObj.ziegel.length*GH;
          }
        }

        while (field.ziegel > fieldObj.ziegel.length) {
          var z = fieldObj.ziegel.length;
          var cube = new T.Mesh(new Cube(GW, GW, GH, 1, 1, ZIEGEL_MATERIAL), new T.MeshFaceMaterial());
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
            new T.MeshBasicMaterial({ color: 0xcccc55 })
          );
          marke.position.x = GW/2 + x0 + x*GW;
          marke.position.y = -GW/2 + y0 - y*GW;
          marke.position.z = fieldObj.ziegel.length*GH;
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
      }
    }
  };

  EnvironmentView.prototype.render = function() {
    this.renderer.render(this.scene, this.camera);
  };

  EnvironmentView.prototype.updateSize = function() {
    var box = this.el.getBoundingClientRect(),
        width = box.width,
        height = box.height;

    var camera = this.camera = new T.Camera(75, width/height, 1, 1e5);
    camera.up = new T.Vector3(0, 0, 1);

    this.renderer.setSize(width, height);
  };

  EnvironmentView.prototype.updateCameraPosition = function() {
    var degrees = this.degrees;
    var radian = degrees * (Math.PI/180);
    var position = this.camera.position;

    var RADIUS = 400;
    position.x =  Math.sin(radian) * RADIUS;
    position.y = -Math.cos(radian) * RADIUS;
    position.z = this.cameraZ;
  };

  EnvironmentView.prototype.dimensionsChanged = function() {
    this.updateSize();
    this.render();
  };

  EnvironmentView.prototype.inject = function() {
    this.el.appendChild(this.renderer.domElement);
  };

  EnvironmentView.prototype.dispose = function() {
    this.el.removeChild(this.renderer.domElement);
  };


  /*
   * Controller
   */

  function AppController() {
    this.initModelAndView();

    win.onBespinLoad = bind(this.initBespin, this);
    var self = this;
    get('example.js', function(text) {
      self.exampleCode = text;
      self.initExampleCode();
    });

    this.initButtons();
    this.addEvents();
  }

  AppController.prototype.initModelAndView = function() {
    this.environment = new Environment(
      Number($('width').value),
      Number($('depth').value),
      Number($('height').value)
    );
    this.environmentView = new EnvironmentView($('environment'), this.environment);
  };

  AppController.prototype.initBespin = function() {
    var self = this;
    bespin.useBespin($('editor')).then(function(env) {
      self.bespinEnv = env;
      self.editor = env.editor;
      self.editor.syntax = 'js';
      self.initExampleCode();
    }, function() {
      win.console && win.console.log && console.log('Bespin launch failed');
    });
  };

  AppController.prototype.initExampleCode = function() {
    if (this.exampleCode && this.editor) {
      this.editor.value = this.exampleCode;
    }
  };

  AppController.prototype.initButtons = function() {
    addEvent($('run-button'),   'click', bind(this.run, this));
    addEvent($('reset-button'), 'click', bind(this.reset, this));

    var self = this;
    each(['links-drehen', 'schritt', 'rechts-drehen', 'hinlegen', 'aufheben', 'marke', 'quader', 'entfernen'], function(name) {
      var button = $(name);
      var method = capitalize(name);
      addEvent(button, 'click', function() {
        try {
          self.environment[method]();
        } catch (exc) {
          alert(exc);
        }
        self.environmentView.updateFields();
        self.environmentView.render();
      });
    });
  };

  AppController.prototype.addEvents = function() {
    var self = this;
    function resize() {
      self.bespinEnv.dimensionsChanged();
      self.environmentView.dimensionsChanged();
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

  AppController.prototype.reset = function() {
    this.environmentView.dispose();
    this.initModelAndView();
  };

  new AppController();
})(window, document, THREE);
