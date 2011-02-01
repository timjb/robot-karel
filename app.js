(function(win, doc, undefined) {
  var HIGHLIGHT_LINE = false;

var THREE=THREE||{};THREE.Color=function(a){this.autoUpdate=true;this.setHex(a)};
THREE.Color.prototype={setRGB:function(a,c,d){this.r=a;this.g=c;this.b=d;if(this.autoUpdate){this.updateHex();this.updateStyleString()}},setHSV:function(a,c,d){var e,i,b,n,o,l;if(d==0)e=i=b=0;else{n=Math.floor(a*6);o=a*6-n;a=d*(1-c);l=d*(1-c*o);c=d*(1-c*(1-o));switch(n){case 1:e=l;i=d;b=a;break;case 2:e=a;i=d;b=c;break;case 3:e=a;i=l;b=d;break;case 4:e=c;i=a;b=d;break;case 5:e=d;i=a;b=l;break;case 6:case 0:e=d;i=c;b=a}}this.r=e;this.g=i;this.b=b;if(this.autoUpdate){this.updateHex();this.updateStyleString()}},
setHex:function(a){this.hex=~~a&16777215;if(this.autoUpdate){this.updateRGBA();this.updateStyleString()}},updateHex:function(){this.hex=~~(this.r*255)<<16^~~(this.g*255)<<8^~~(this.b*255)},updateRGBA:function(){this.r=(this.hex>>16&255)/255;this.g=(this.hex>>8&255)/255;this.b=(this.hex&255)/255},updateStyleString:function(){this.__styleString="rgb("+~~(this.r*255)+","+~~(this.g*255)+","+~~(this.b*255)+")"},clone:function(){return new THREE.Color(this.hex)},toString:function(){return"THREE.Color ( r: "+
this.r+", g: "+this.g+", b: "+this.b+", hex: "+this.hex+" )"}};THREE.Vector2=function(a,c){this.x=a||0;this.y=c||0};
THREE.Vector2.prototype={set:function(a,c){this.x=a;this.y=c;return this},copy:function(a){this.x=a.x;this.y=a.y;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;return this},add:function(a,c){this.x=a.x+c.x;this.y=a.y+c.y;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;return this},sub:function(a,c){this.x=a.x-c.x;this.y=a.y-c.y;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;return this},unit:function(){this.multiplyScalar(1/this.length());return this},length:function(){return Math.sqrt(this.x*
this.x+this.y*this.y)},lengthSq:function(){return this.x*this.x+this.y*this.y},negate:function(){this.x=-this.x;this.y=-this.y;return this},clone:function(){return new THREE.Vector2(this.x,this.y)},toString:function(){return"THREE.Vector2 ("+this.x+", "+this.y+")"}};THREE.Vector3=function(a,c,d){this.x=a||0;this.y=c||0;this.z=d||0};
THREE.Vector3.prototype={set:function(a,c,d){this.x=a;this.y=c;this.z=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,c){this.x=a.x+c.x;this.y=a.y+c.y;this.z=a.z+c.z;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;return this},sub:function(a,c){this.x=a.x-c.x;this.y=a.y-c.y;this.z=a.z-c.z;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z;return this},
cross:function(a,c){this.x=a.y*c.z-a.z*c.y;this.y=a.z*c.x-a.x*c.z;this.z=a.x*c.y-a.y*c.x;return this},crossSelf:function(a){var c=this.x,d=this.y,e=this.z;this.x=d*a.z-e*a.y;this.y=e*a.x-c*a.z;this.z=c*a.y-d*a.x;return this},multiply:function(a,c){this.x=a.x*c.x;this.y=a.y*c.y;this.z=a.z*c.z;return this},multiplySelf:function(a){this.x*=a.x;this.y*=a.y;this.z*=a.z;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;return this},divideSelf:function(a){this.x/=a.x;this.y/=a.y;this.z/=
a.z;return this},divideScalar:function(a){this.x/=a;this.y/=a;this.z/=a;return this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},distanceTo:function(a){var c=this.x-a.x,d=this.y-a.y;a=this.z-a.z;return Math.sqrt(c*c+d*d+a*a)},distanceToSquared:function(a){var c=this.x-a.x,d=this.y-a.y;a=this.z-a.z;return c*c+d*d+a*a},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},negate:function(){this.x=
-this.x;this.y=-this.y;this.z=-this.z;return this},normalize:function(){var a=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);a>0?this.multiplyScalar(1/a):this.set(0,0,0);return this},setLength:function(a){return this.normalize().multiplyScalar(a)},isZero:function(){return Math.abs(this.x)<1.0E-4&&Math.abs(this.y)<1.0E-4&&Math.abs(this.z)<1.0E-4},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)},toString:function(){return"THREE.Vector3 ( "+this.x+", "+this.y+", "+this.z+" )"}};
THREE.Vector4=function(a,c,d,e){this.x=a||0;this.y=c||0;this.z=d||0;this.w=e||1};
THREE.Vector4.prototype={set:function(a,c,d,e){this.x=a;this.y=c;this.z=d;this.w=e;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w||1;return this},add:function(a,c){this.x=a.x+c.x;this.y=a.y+c.y;this.z=a.z+c.z;this.w=a.w+c.w;return this},addSelf:function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z;this.w+=a.w;return this},sub:function(a,c){this.x=a.x-c.x;this.y=a.y-c.y;this.z=a.z-c.z;this.w=a.w-c.w;return this},subSelf:function(a){this.x-=a.x;this.y-=a.y;this.z-=a.z;this.w-=a.w;
return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;this.w*=a;return this},divideScalar:function(a){this.x/=a;this.y/=a;this.z/=a;this.w/=a;return this},lerpSelf:function(a,c){this.x+=(a.x-this.x)*c;this.y+=(a.y-this.y)*c;this.z+=(a.z-this.z)*c;this.w+=(a.w-this.w)*c},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)},toString:function(){return"THREE.Vector4 ("+this.x+", "+this.y+", "+this.z+", "+this.w+")"}};
THREE.Ray=function(a,c){this.origin=a||new THREE.Vector3;this.direction=c||new THREE.Vector3};
THREE.Ray.prototype={intersectScene:function(a){var c,d,e=a.objects,i=[];a=0;for(c=e.length;a<c;a++){d=e[a];if(d instanceof THREE.Mesh)i=i.concat(this.intersectObject(d))}i.sort(function(b,n){return b.distance-n.distance});return i},intersectObject:function(a){function c(I,p,g,h){h=h.clone().subSelf(p);g=g.clone().subSelf(p);var f=I.clone().subSelf(p);I=h.dot(h);p=h.dot(g);h=h.dot(f);var j=g.dot(g);g=g.dot(f);f=1/(I*j-p*p);j=(j*h-p*g)*f;I=(I*g-p*h)*f;return j>0&&I>0&&j+I<1}var d,e,i,b,n,o,l,m,z,y,
u,x=a.geometry,G=x.vertices,H=[];d=0;for(e=x.faces.length;d<e;d++){i=x.faces[d];y=this.origin.clone();u=this.direction.clone();b=a.matrix.multiplyVector3(G[i.a].position.clone());n=a.matrix.multiplyVector3(G[i.b].position.clone());o=a.matrix.multiplyVector3(G[i.c].position.clone());l=i instanceof THREE.Face4?a.matrix.multiplyVector3(G[i.d].position.clone()):null;m=a.rotationMatrix.multiplyVector3(i.normal.clone());z=u.dot(m);if(z<0){m=m.dot((new THREE.Vector3).sub(b,y))/z;y=y.addSelf(u.multiplyScalar(m));
if(i instanceof THREE.Face3){if(c(y,b,n,o)){i={distance:this.origin.distanceTo(y),point:y,face:i,object:a};H.push(i)}}else if(i instanceof THREE.Face4)if(c(y,b,n,l)||c(y,n,o,l)){i={distance:this.origin.distanceTo(y),point:y,face:i,object:a};H.push(i)}}}return H}};
THREE.Rectangle=function(){function a(){b=e-c;n=i-d}var c,d,e,i,b,n,o=true;this.getX=function(){return c};this.getY=function(){return d};this.getWidth=function(){return b};this.getHeight=function(){return n};this.getLeft=function(){return c};this.getTop=function(){return d};this.getRight=function(){return e};this.getBottom=function(){return i};this.set=function(l,m,z,y){o=false;c=l;d=m;e=z;i=y;a()};this.addPoint=function(l,m){if(o){o=false;c=l;d=m;e=l;i=m}else{c=c<l?c:l;d=d<m?d:m;e=e>l?e:l;i=i>m?
i:m}a()};this.add3Points=function(l,m,z,y,u,x){if(o){o=false;c=l<z?l<u?l:u:z<u?z:u;d=m<y?m<x?m:x:y<x?y:x;e=l>z?l>u?l:u:z>u?z:u;i=m>y?m>x?m:x:y>x?y:x}else{c=l<z?l<u?l<c?l:c:u<c?u:c:z<u?z<c?z:c:u<c?u:c;d=m<y?m<x?m<d?m:d:x<d?x:d:y<x?y<d?y:d:x<d?x:d;e=l>z?l>u?l>e?l:e:u>e?u:e:z>u?z>e?z:e:u>e?u:e;i=m>y?m>x?m>i?m:i:x>i?x:i:y>x?y>i?y:i:x>i?x:i}a()};this.addRectangle=function(l){if(o){o=false;c=l.getLeft();d=l.getTop();e=l.getRight();i=l.getBottom()}else{c=c<l.getLeft()?c:l.getLeft();d=d<l.getTop()?d:l.getTop();
e=e>l.getRight()?e:l.getRight();i=i>l.getBottom()?i:l.getBottom()}a()};this.inflate=function(l){c-=l;d-=l;e+=l;i+=l;a()};this.minSelf=function(l){c=c>l.getLeft()?c:l.getLeft();d=d>l.getTop()?d:l.getTop();e=e<l.getRight()?e:l.getRight();i=i<l.getBottom()?i:l.getBottom();a()};this.instersects=function(l){return Math.min(e,l.getRight())-Math.max(c,l.getLeft())>=0&&Math.min(i,l.getBottom())-Math.max(d,l.getTop())>=0};this.empty=function(){o=true;i=e=d=c=0;a()};this.isEmpty=function(){return o};this.toString=
function(){return"THREE.Rectangle ( left: "+c+", right: "+e+", top: "+d+", bottom: "+i+", width: "+b+", height: "+n+" )"}};THREE.Matrix3=function(){this.m=[]};THREE.Matrix3.prototype={transpose:function(){var a,c=this.m;a=c[1];c[1]=c[3];c[3]=a;a=c[2];c[2]=c[6];c[6]=a;a=c[5];c[5]=c[7];c[7]=a;return this}};
THREE.Matrix4=function(a,c,d,e,i,b,n,o,l,m,z,y,u,x,G,H){this.n11=a||1;this.n12=c||0;this.n13=d||0;this.n14=e||0;this.n21=i||0;this.n22=b||1;this.n23=n||0;this.n24=o||0;this.n31=l||0;this.n32=m||0;this.n33=z||1;this.n34=y||0;this.n41=u||0;this.n42=x||0;this.n43=G||0;this.n44=H||1;this.flat=Array(16);this.m33=new THREE.Matrix3};
THREE.Matrix4.prototype={identity:function(){this.n11=1;this.n21=this.n14=this.n13=this.n12=0;this.n22=1;this.n32=this.n31=this.n24=this.n23=0;this.n33=1;this.n43=this.n42=this.n41=this.n34=0;this.n44=1;return this},set:function(a,c,d,e,i,b,n,o,l,m,z,y,u,x,G,H){this.n11=a;this.n12=c;this.n13=d;this.n14=e;this.n21=i;this.n22=b;this.n23=n;this.n24=o;this.n31=l;this.n32=m;this.n33=z;this.n34=y;this.n41=u;this.n42=x;this.n43=G;this.n44=H;return this},copy:function(a){this.n11=a.n11;this.n12=a.n12;this.n13=
a.n13;this.n14=a.n14;this.n21=a.n21;this.n22=a.n22;this.n23=a.n23;this.n24=a.n24;this.n31=a.n31;this.n32=a.n32;this.n33=a.n33;this.n34=a.n34;this.n41=a.n41;this.n42=a.n42;this.n43=a.n43;this.n44=a.n44;return this},lookAt:function(a,c,d){var e=THREE.Matrix4.__tmpVec1,i=THREE.Matrix4.__tmpVec2,b=THREE.Matrix4.__tmpVec3;b.sub(a,c).normalize();e.cross(d,b).normalize();i.cross(b,e).normalize();this.n11=e.x;this.n12=e.y;this.n13=e.z;this.n14=-e.dot(a);this.n21=i.x;this.n22=i.y;this.n23=i.z;this.n24=-i.dot(a);
this.n31=b.x;this.n32=b.y;this.n33=b.z;this.n34=-b.dot(a);this.n43=this.n42=this.n41=0;this.n44=1;return this},multiplyVector3:function(a){var c=a.x,d=a.y,e=a.z,i=1/(this.n41*c+this.n42*d+this.n43*e+this.n44);a.x=(this.n11*c+this.n12*d+this.n13*e+this.n14)*i;a.y=(this.n21*c+this.n22*d+this.n23*e+this.n24)*i;a.z=(this.n31*c+this.n32*d+this.n33*e+this.n34)*i;return a},multiplyVector4:function(a){var c=a.x,d=a.y,e=a.z,i=a.w;a.x=this.n11*c+this.n12*d+this.n13*e+this.n14*i;a.y=this.n21*c+this.n22*d+this.n23*
e+this.n24*i;a.z=this.n31*c+this.n32*d+this.n33*e+this.n34*i;a.w=this.n41*c+this.n42*d+this.n43*e+this.n44*i;return a},crossVector:function(a){var c=new THREE.Vector4;c.x=this.n11*a.x+this.n12*a.y+this.n13*a.z+this.n14*a.w;c.y=this.n21*a.x+this.n22*a.y+this.n23*a.z+this.n24*a.w;c.z=this.n31*a.x+this.n32*a.y+this.n33*a.z+this.n34*a.w;c.w=a.w?this.n41*a.x+this.n42*a.y+this.n43*a.z+this.n44*a.w:1;return c},multiply:function(a,c){var d=a.n11,e=a.n12,i=a.n13,b=a.n14,n=a.n21,o=a.n22,l=a.n23,m=a.n24,z=a.n31,
y=a.n32,u=a.n33,x=a.n34,G=a.n41,H=a.n42,I=a.n43,p=a.n44,g=c.n11,h=c.n12,f=c.n13,j=c.n14,s=c.n21,t=c.n22,k=c.n23,A=c.n24,q=c.n31,C=c.n32,r=c.n33,v=c.n34,D=c.n41,W=c.n42,E=c.n43,O=c.n44;this.n11=d*g+e*s+i*q+b*D;this.n12=d*h+e*t+i*C+b*W;this.n13=d*f+e*k+i*r+b*E;this.n14=d*j+e*A+i*v+b*O;this.n21=n*g+o*s+l*q+m*D;this.n22=n*h+o*t+l*C+m*W;this.n23=n*f+o*k+l*r+m*E;this.n24=n*j+o*A+l*v+m*O;this.n31=z*g+y*s+u*q+x*D;this.n32=z*h+y*t+u*C+x*W;this.n33=z*f+y*k+u*r+x*E;this.n34=z*j+y*A+u*v+x*O;this.n41=G*g+H*s+
I*q+p*D;this.n42=G*h+H*t+I*C+p*W;this.n43=G*f+H*k+I*r+p*E;this.n44=G*j+H*A+I*v+p*O;return this},multiplySelf:function(a){var c=this.n11,d=this.n12,e=this.n13,i=this.n14,b=this.n21,n=this.n22,o=this.n23,l=this.n24,m=this.n31,z=this.n32,y=this.n33,u=this.n34,x=this.n41,G=this.n42,H=this.n43,I=this.n44,p=a.n11,g=a.n21,h=a.n31,f=a.n41,j=a.n12,s=a.n22,t=a.n32,k=a.n42,A=a.n13,q=a.n23,C=a.n33,r=a.n43,v=a.n14,D=a.n24,W=a.n34;a=a.n44;this.n11=c*p+d*g+e*h+i*f;this.n12=c*j+d*s+e*t+i*k;this.n13=c*A+d*q+e*C+i*
r;this.n14=c*v+d*D+e*W+i*a;this.n21=b*p+n*g+o*h+l*f;this.n22=b*j+n*s+o*t+l*k;this.n23=b*A+n*q+o*C+l*r;this.n24=b*v+n*D+o*W+l*a;this.n31=m*p+z*g+y*h+u*f;this.n32=m*j+z*s+y*t+u*k;this.n33=m*A+z*q+y*C+u*r;this.n34=m*v+z*D+y*W+u*a;this.n41=x*p+G*g+H*h+I*f;this.n42=x*j+G*s+H*t+I*k;this.n43=x*A+G*q+H*C+I*r;this.n44=x*v+G*D+H*W+I*a;return this},multiplyScalar:function(a){this.n11*=a;this.n12*=a;this.n13*=a;this.n14*=a;this.n21*=a;this.n22*=a;this.n23*=a;this.n24*=a;this.n31*=a;this.n32*=a;this.n33*=a;this.n34*=
a;this.n41*=a;this.n42*=a;this.n43*=a;this.n44*=a;return this},determinant:function(){var a=this.n11,c=this.n12,d=this.n13,e=this.n14,i=this.n21,b=this.n22,n=this.n23,o=this.n24,l=this.n31,m=this.n32,z=this.n33,y=this.n34,u=this.n41,x=this.n42,G=this.n43,H=this.n44;return e*n*m*u-d*o*m*u-e*b*z*u+c*o*z*u+d*b*y*u-c*n*y*u-e*n*l*x+d*o*l*x+e*i*z*x-a*o*z*x-d*i*y*x+a*n*y*x+e*b*l*G-c*o*l*G-e*i*m*G+a*o*m*G+c*i*y*G-a*b*y*G-d*b*l*H+c*n*l*H+d*i*m*H-a*n*m*H-c*i*z*H+a*b*z*H},transpose:function(){function a(c,d,
e){var i=c[d];c[d]=c[e];c[e]=i}a(this,"n21","n12");a(this,"n31","n13");a(this,"n32","n23");a(this,"n41","n14");a(this,"n42","n24");a(this,"n43","n34");return this},clone:function(){var a=new THREE.Matrix4;a.n11=this.n11;a.n12=this.n12;a.n13=this.n13;a.n14=this.n14;a.n21=this.n21;a.n22=this.n22;a.n23=this.n23;a.n24=this.n24;a.n31=this.n31;a.n32=this.n32;a.n33=this.n33;a.n34=this.n34;a.n41=this.n41;a.n42=this.n42;a.n43=this.n43;a.n44=this.n44;return a},flatten:function(){var a=this.flat;a[0]=this.n11;
a[1]=this.n21;a[2]=this.n31;a[3]=this.n41;a[4]=this.n12;a[5]=this.n22;a[6]=this.n32;a[7]=this.n42;a[8]=this.n13;a[9]=this.n23;a[10]=this.n33;a[11]=this.n43;a[12]=this.n14;a[13]=this.n24;a[14]=this.n34;a[15]=this.n44;return a},setTranslation:function(a,c,d){this.set(1,0,0,a,0,1,0,c,0,0,1,d,0,0,0,1);return this},setScale:function(a,c,d){this.set(a,0,0,0,0,c,0,0,0,0,d,0,0,0,0,1);return this},setRotX:function(a){var c=Math.cos(a);a=Math.sin(a);this.set(1,0,0,0,0,c,-a,0,0,a,c,0,0,0,0,1);return this},setRotY:function(a){var c=
Math.cos(a);a=Math.sin(a);this.set(c,0,a,0,0,1,0,0,-a,0,c,0,0,0,0,1);return this},setRotZ:function(a){var c=Math.cos(a);a=Math.sin(a);this.set(c,-a,0,0,a,c,0,0,0,0,1,0,0,0,0,1);return this},setRotAxis:function(a,c){var d=Math.cos(c),e=Math.sin(c),i=1-d,b=a.x,n=a.y,o=a.z,l=i*b,m=i*n;this.set(l*b+d,l*n-e*o,l*o+e*n,0,l*n+e*o,m*n+d,m*o-e*b,0,l*o-e*n,m*o+e*b,i*o*o+d,0,0,0,0,1);return this},toString:function(){return"| "+this.n11+" "+this.n12+" "+this.n13+" "+this.n14+" |\n| "+this.n21+" "+this.n22+" "+
this.n23+" "+this.n24+" |\n| "+this.n31+" "+this.n32+" "+this.n33+" "+this.n34+" |\n| "+this.n41+" "+this.n42+" "+this.n43+" "+this.n44+" |"}};THREE.Matrix4.translationMatrix=function(a,c,d){var e=new THREE.Matrix4;e.setTranslation(a,c,d);return e};THREE.Matrix4.scaleMatrix=function(a,c,d){var e=new THREE.Matrix4;e.setScale(a,c,d);return e};THREE.Matrix4.rotationXMatrix=function(a){var c=new THREE.Matrix4;c.setRotX(a);return c};
THREE.Matrix4.rotationYMatrix=function(a){var c=new THREE.Matrix4;c.setRotY(a);return c};THREE.Matrix4.rotationZMatrix=function(a){var c=new THREE.Matrix4;c.setRotZ(a);return c};THREE.Matrix4.rotationAxisAngleMatrix=function(a,c){var d=new THREE.Matrix4;d.setRotAxis(a,c);return d};
THREE.Matrix4.makeInvert=function(a){var c=a.n11,d=a.n12,e=a.n13,i=a.n14,b=a.n21,n=a.n22,o=a.n23,l=a.n24,m=a.n31,z=a.n32,y=a.n33,u=a.n34,x=a.n41,G=a.n42,H=a.n43,I=a.n44,p=new THREE.Matrix4;p.n11=o*u*G-l*y*G+l*z*H-n*u*H-o*z*I+n*y*I;p.n12=i*y*G-e*u*G-i*z*H+d*u*H+e*z*I-d*y*I;p.n13=e*l*G-i*o*G+i*n*H-d*l*H-e*n*I+d*o*I;p.n14=i*o*z-e*l*z-i*n*y+d*l*y+e*n*u-d*o*u;p.n21=l*y*x-o*u*x-l*m*H+b*u*H+o*m*I-b*y*I;p.n22=e*u*x-i*y*x+i*m*H-c*u*H-e*m*I+c*y*I;p.n23=i*o*x-e*l*x-i*b*H+c*l*H+e*b*I-c*o*I;p.n24=e*l*m-i*o*m+
i*b*y-c*l*y-e*b*u+c*o*u;p.n31=n*u*x-l*z*x+l*m*G-b*u*G-n*m*I+b*z*I;p.n32=i*z*x-d*u*x-i*m*G+c*u*G+d*m*I-c*z*I;p.n33=e*l*x-i*n*x+i*b*G-c*l*G-d*b*I+c*n*I;p.n34=i*n*m-d*l*m-i*b*z+c*l*z+d*b*u-c*n*u;p.n41=o*z*x-n*y*x-o*m*G+b*y*G+n*m*H-b*z*H;p.n42=d*y*x-e*z*x+e*m*G-c*y*G-d*m*H+c*z*H;p.n43=e*n*x-d*o*x-e*b*G+c*o*G+d*b*H-c*n*H;p.n44=d*o*m-e*n*m+e*b*z-c*o*z-d*b*y+c*n*y;p.multiplyScalar(1/a.determinant());return p};
THREE.Matrix4.makeInvert3x3=function(a){var c=a.flatten();a=a.m33;var d=a.m,e=c[10]*c[5]-c[6]*c[9],i=-c[10]*c[1]+c[2]*c[9],b=c[6]*c[1]-c[2]*c[5],n=-c[10]*c[4]+c[6]*c[8],o=c[10]*c[0]-c[2]*c[8],l=-c[6]*c[0]+c[2]*c[4],m=c[9]*c[4]-c[5]*c[8],z=-c[9]*c[0]+c[1]*c[8],y=c[5]*c[0]-c[1]*c[4];c=c[0]*e+c[1]*n+c[2]*m;if(c==0)throw"matrix not invertible";c=1/c;d[0]=c*e;d[1]=c*i;d[2]=c*b;d[3]=c*n;d[4]=c*o;d[5]=c*l;d[6]=c*m;d[7]=c*z;d[8]=c*y;return a};
THREE.Matrix4.makeFrustum=function(a,c,d,e,i,b){var n,o,l;n=new THREE.Matrix4;o=2*i/(c-a);l=2*i/(e-d);a=(c+a)/(c-a);d=(e+d)/(e-d);e=-(b+i)/(b-i);i=-2*b*i/(b-i);n.n11=o;n.n12=0;n.n13=a;n.n14=0;n.n21=0;n.n22=l;n.n23=d;n.n24=0;n.n31=0;n.n32=0;n.n33=e;n.n34=i;n.n41=0;n.n42=0;n.n43=-1;n.n44=0;return n};THREE.Matrix4.makePerspective=function(a,c,d,e){var i;a=d*Math.tan(a*Math.PI/360);i=-a;return THREE.Matrix4.makeFrustum(i*c,a*c,i,a,d,e)};
THREE.Matrix4.makeOrtho=function(a,c,d,e,i,b){var n,o,l,m;n=new THREE.Matrix4;o=c-a;l=d-e;m=b-i;a=(c+a)/o;d=(d+e)/l;i=(b+i)/m;n.n11=2/o;n.n12=0;n.n13=0;n.n14=-a;n.n21=0;n.n22=2/l;n.n23=0;n.n24=-d;n.n31=0;n.n32=0;n.n33=-2/m;n.n34=-i;n.n41=0;n.n42=0;n.n43=0;n.n44=1;return n};THREE.Matrix4.__tmpVec1=new THREE.Vector3;THREE.Matrix4.__tmpVec2=new THREE.Vector3;THREE.Matrix4.__tmpVec3=new THREE.Vector3;
THREE.Vertex=function(a,c){this.position=a||new THREE.Vector3;this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.normal=c||new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.normalScreen=new THREE.Vector3;this.tangent=new THREE.Vector4;this.__visible=true};THREE.Vertex.prototype={toString:function(){return"THREE.Vertex ( position: "+this.position+", normal: "+this.normal+" )"}};
THREE.Face3=function(a,c,d,e,i){this.a=a;this.b=c;this.c=d;this.centroid=new THREE.Vector3;this.normal=e instanceof THREE.Vector3?e:new THREE.Vector3;this.vertexNormals=e instanceof Array?e:[];this.materials=i instanceof Array?i:[i]};THREE.Face3.prototype={toString:function(){return"THREE.Face3 ( "+this.a+", "+this.b+", "+this.c+" )"}};
THREE.Face4=function(a,c,d,e,i,b){this.a=a;this.b=c;this.c=d;this.d=e;this.centroid=new THREE.Vector3;this.normal=i instanceof THREE.Vector3?i:new THREE.Vector3;this.vertexNormals=i instanceof Array?i:[];this.materials=b instanceof Array?b:[b]};THREE.Face4.prototype={toString:function(){return"THREE.Face4 ( "+this.a+", "+this.b+", "+this.c+" "+this.d+" )"}};THREE.UV=function(a,c){this.u=a||0;this.v=c||0};
THREE.UV.prototype={copy:function(a){this.u=a.u;this.v=a.v},toString:function(){return"THREE.UV ("+this.u+", "+this.v+")"}};THREE.Geometry=function(){this.vertices=[];this.faces=[];this.uvs=[];this.uvs2=[];this.boundingSphere=this.boundingBox=null;this.geometryChunks={};this.hasTangents=false};
THREE.Geometry.prototype={computeCentroids:function(){var a,c,d;a=0;for(c=this.faces.length;a<c;a++){d=this.faces[a];d.centroid.set(0,0,0);if(d instanceof THREE.Face3){d.centroid.addSelf(this.vertices[d.a].position);d.centroid.addSelf(this.vertices[d.b].position);d.centroid.addSelf(this.vertices[d.c].position);d.centroid.divideScalar(3)}else if(d instanceof THREE.Face4){d.centroid.addSelf(this.vertices[d.a].position);d.centroid.addSelf(this.vertices[d.b].position);d.centroid.addSelf(this.vertices[d.c].position);
d.centroid.addSelf(this.vertices[d.d].position);d.centroid.divideScalar(4)}}},computeFaceNormals:function(a){var c,d,e,i,b,n,o=new THREE.Vector3,l=new THREE.Vector3;e=0;for(i=this.vertices.length;e<i;e++){b=this.vertices[e];b.normal.set(0,0,0)}e=0;for(i=this.faces.length;e<i;e++){b=this.faces[e];if(a&&b.vertexNormals.length){o.set(0,0,0);c=0;for(d=b.normal.length;c<d;c++)o.addSelf(b.vertexNormals[c]);o.divideScalar(3)}else{c=this.vertices[b.a];d=this.vertices[b.b];n=this.vertices[b.c];o.sub(n.position,
d.position);l.sub(c.position,d.position);o.crossSelf(l)}o.isZero()||o.normalize();b.normal.copy(o)}},computeVertexNormals:function(){var a,c,d,e;if(this.__tmpVertices==undefined){e=this.__tmpVertices=Array(this.vertices.length);a=0;for(c=this.vertices.length;a<c;a++)e[a]=new THREE.Vector3;a=0;for(c=this.faces.length;a<c;a++){d=this.faces[a];if(d instanceof THREE.Face3)d.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];else if(d instanceof THREE.Face4)d.vertexNormals=[new THREE.Vector3,
new THREE.Vector3,new THREE.Vector3,new THREE.Vector3]}}else{e=this.__tmpVertices;a=0;for(c=this.vertices.length;a<c;a++)e[a].set(0,0,0)}a=0;for(c=this.faces.length;a<c;a++){d=this.faces[a];if(d instanceof THREE.Face3){e[d.a].addSelf(d.normal);e[d.b].addSelf(d.normal);e[d.c].addSelf(d.normal)}else if(d instanceof THREE.Face4){e[d.a].addSelf(d.normal);e[d.b].addSelf(d.normal);e[d.c].addSelf(d.normal);e[d.d].addSelf(d.normal)}}a=0;for(c=this.vertices.length;a<c;a++)e[a].normalize();a=0;for(c=this.faces.length;a<
c;a++){d=this.faces[a];if(d instanceof THREE.Face3){d.vertexNormals[0].copy(e[d.a]);d.vertexNormals[1].copy(e[d.b]);d.vertexNormals[2].copy(e[d.c])}else if(d instanceof THREE.Face4){d.vertexNormals[0].copy(e[d.a]);d.vertexNormals[1].copy(e[d.b]);d.vertexNormals[2].copy(e[d.c]);d.vertexNormals[3].copy(e[d.d])}}},computeTangents:function(){function a(v,D,W,E,O,M,J){b=v.vertices[D].position;n=v.vertices[W].position;o=v.vertices[E].position;l=i[O];m=i[M];z=i[J];y=n.x-b.x;u=o.x-b.x;x=n.y-b.y;G=o.y-b.y;
H=n.z-b.z;I=o.z-b.z;p=m.u-l.u;g=z.u-l.u;h=m.v-l.v;f=z.v-l.v;j=1/(p*f-g*h);k.set((f*y-h*u)*j,(f*x-h*G)*j,(f*H-h*I)*j);A.set((p*u-g*y)*j,(p*G-g*x)*j,(p*I-g*H)*j);s[D].addSelf(k);s[W].addSelf(k);s[E].addSelf(k);t[D].addSelf(A);t[W].addSelf(A);t[E].addSelf(A)}var c,d,e,i,b,n,o,l,m,z,y,u,x,G,H,I,p,g,h,f,j,s=[],t=[],k=new THREE.Vector3,A=new THREE.Vector3,q=new THREE.Vector3,C=new THREE.Vector3,r=new THREE.Vector3;c=0;for(d=this.vertices.length;c<d;c++){s[c]=new THREE.Vector3;t[c]=new THREE.Vector3}c=0;
for(d=this.faces.length;c<d;c++){e=this.faces[c];i=this.uvs[c];if(e instanceof THREE.Face3){a(this,e.a,e.b,e.c,0,1,2);this.vertices[e.a].normal.copy(e.vertexNormals[0]);this.vertices[e.b].normal.copy(e.vertexNormals[1]);this.vertices[e.c].normal.copy(e.vertexNormals[2])}else if(e instanceof THREE.Face4){a(this,e.a,e.b,e.c,0,1,2);a(this,e.a,e.b,e.d,0,1,3);this.vertices[e.a].normal.copy(e.vertexNormals[0]);this.vertices[e.b].normal.copy(e.vertexNormals[1]);this.vertices[e.c].normal.copy(e.vertexNormals[2]);
this.vertices[e.d].normal.copy(e.vertexNormals[3])}}c=0;for(d=this.vertices.length;c<d;c++){r.copy(this.vertices[c].normal);e=s[c];q.copy(e);q.subSelf(r.multiplyScalar(r.dot(e))).normalize();C.cross(this.vertices[c].normal,e);e=C.dot(t[c]);e=e<0?-1:1;this.vertices[c].tangent.set(q.x,q.y,q.z,e)}this.hasTangents=true},computeBoundingBox:function(){var a;if(this.vertices.length>0){this.boundingBox={x:[this.vertices[0].position.x,this.vertices[0].position.x],y:[this.vertices[0].position.y,this.vertices[0].position.y],
z:[this.vertices[0].position.z,this.vertices[0].position.z]};for(var c=1,d=this.vertices.length;c<d;c++){a=this.vertices[c];if(a.position.x<this.boundingBox.x[0])this.boundingBox.x[0]=a.position.x;else if(a.position.x>this.boundingBox.x[1])this.boundingBox.x[1]=a.position.x;if(a.position.y<this.boundingBox.y[0])this.boundingBox.y[0]=a.position.y;else if(a.position.y>this.boundingBox.y[1])this.boundingBox.y[1]=a.position.y;if(a.position.z<this.boundingBox.z[0])this.boundingBox.z[0]=a.position.z;else if(a.position.z>
this.boundingBox.z[1])this.boundingBox.z[1]=a.position.z}}},computeBoundingSphere:function(){for(var a=this.boundingSphere===null?0:this.boundingSphere.radius,c=0,d=this.vertices.length;c<d;c++)a=Math.max(a,this.vertices[c].position.length());this.boundingSphere={radius:a}},sortFacesByMaterial:function(){function a(z){var y=[];c=0;for(d=z.length;c<d;c++)z[c]==undefined?y.push("undefined"):y.push(z[c].toString());return y.join("_")}var c,d,e,i,b,n,o,l,m={};e=0;for(i=this.faces.length;e<i;e++){b=this.faces[e];
n=b.materials;o=a(n);if(m[o]==undefined)m[o]={hash:o,counter:0};l=m[o].hash+"_"+m[o].counter;if(this.geometryChunks[l]==undefined)this.geometryChunks[l]={faces:[],materials:n,vertices:0};b=b instanceof THREE.Face3?3:4;if(this.geometryChunks[l].vertices+b>65535){m[o].counter+=1;l=m[o].hash+"_"+m[o].counter;if(this.geometryChunks[l]==undefined)this.geometryChunks[l]={faces:[],materials:n,vertices:0}}this.geometryChunks[l].faces.push(e);this.geometryChunks[l].vertices+=b}},toString:function(){return"THREE.Geometry ( vertices: "+
this.vertices+", faces: "+this.faces+", uvs: "+this.uvs+" )"}};
THREE.Camera=function(a,c,d,e){this.fov=a;this.aspect=c;this.near=d;this.far=e;this.position=new THREE.Vector3;this.target={position:new THREE.Vector3};this.autoUpdateMatrix=true;this.projectionMatrix=null;this.matrix=new THREE.Matrix4;this.up=new THREE.Vector3(0,1,0);this.tmpVec=new THREE.Vector3;this.translateX=function(i){this.tmpVec.sub(this.target.position,this.position).normalize().multiplyScalar(i);this.tmpVec.crossSelf(this.up);this.position.addSelf(this.tmpVec);this.target.position.addSelf(this.tmpVec)};
this.translateZ=function(i){this.tmpVec.sub(this.target.position,this.position).normalize().multiplyScalar(i);this.position.subSelf(this.tmpVec);this.target.position.subSelf(this.tmpVec)};this.updateMatrix=function(){this.matrix.lookAt(this.position,this.target.position,this.up)};this.updateProjectionMatrix=function(){this.projectionMatrix=THREE.Matrix4.makePerspective(this.fov,this.aspect,this.near,this.far)};this.updateProjectionMatrix()};
THREE.Camera.prototype={toString:function(){return"THREE.Camera ( "+this.position+", "+this.target.position+" )"}};THREE.Light=function(a){this.color=new THREE.Color(a)};THREE.AmbientLight=function(a){THREE.Light.call(this,a)};THREE.AmbientLight.prototype=new THREE.Light;THREE.AmbientLight.prototype.constructor=THREE.AmbientLight;THREE.DirectionalLight=function(a,c){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,1,0);this.intensity=c||1};THREE.DirectionalLight.prototype=new THREE.Light;
THREE.DirectionalLight.prototype.constructor=THREE.DirectionalLight;THREE.PointLight=function(a,c){THREE.Light.call(this,a);this.position=new THREE.Vector3;this.intensity=c||1};THREE.PointLight.prototype=new THREE.Light;THREE.PointLight.prototype.constructor=THREE.PointLight;
THREE.Object3D=function(){this.id=THREE.Object3DCounter.value++;this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.scale=new THREE.Vector3(1,1,1);this.matrix=new THREE.Matrix4;this.rotationMatrix=new THREE.Matrix4;this.tmpMatrix=new THREE.Matrix4;this.screen=new THREE.Vector3;this.visible=this.autoUpdateMatrix=true};
THREE.Object3D.prototype={updateMatrix:function(){var a=this.position,c=this.rotation,d=this.scale,e=this.tmpMatrix;this.matrix.setTranslation(a.x,a.y,a.z);this.rotationMatrix.setRotX(c.x);if(c.y!=0){e.setRotY(c.y);this.rotationMatrix.multiplySelf(e)}if(c.z!=0){e.setRotZ(c.z);this.rotationMatrix.multiplySelf(e)}this.matrix.multiplySelf(this.rotationMatrix);if(d.x!=0||d.y!=0||d.z!=0){e.setScale(d.x,d.y,d.z);this.matrix.multiplySelf(e)}}};THREE.Object3DCounter={value:0};
THREE.Particle=function(a){THREE.Object3D.call(this);this.materials=a instanceof Array?a:[a];this.autoUpdateMatrix=false};THREE.Particle.prototype=new THREE.Object3D;THREE.Particle.prototype.constructor=THREE.Particle;THREE.ParticleSystem=function(a,c){THREE.Object3D.call(this);this.geometry=a;this.materials=c instanceof Array?c:[c];this.autoUpdateMatrix=false};THREE.ParticleSystem.prototype=new THREE.Object3D;THREE.ParticleSystem.prototype.constructor=THREE.ParticleSystem;
THREE.Line=function(a,c,d){THREE.Object3D.call(this);this.geometry=a;this.materials=c instanceof Array?c:[c];this.type=d!=undefined?d:THREE.LineStrip};THREE.LineStrip=0;THREE.LinePieces=1;THREE.Line.prototype=new THREE.Object3D;THREE.Line.prototype.constructor=THREE.Line;THREE.Mesh=function(a,c){THREE.Object3D.call(this);this.geometry=a;this.materials=c instanceof Array?c:[c];this.overdraw=this.doubleSided=this.flipSided=false;this.geometry.boundingSphere||this.geometry.computeBoundingSphere()};
THREE.Mesh.prototype=new THREE.Object3D;THREE.Mesh.prototype.constructor=THREE.Mesh;THREE.FlatShading=0;THREE.SmoothShading=1;THREE.NormalBlending=0;THREE.AdditiveBlending=1;THREE.SubtractiveBlending=2;
THREE.LineBasicMaterial=function(a){this.color=new THREE.Color(16777215);this.opacity=1;this.blending=THREE.NormalBlending;this.linewidth=1;this.linejoin=this.linecap="round";if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending;if(a.linewidth!==undefined)this.linewidth=a.linewidth;if(a.linecap!==undefined)this.linecap=a.linecap;if(a.linejoin!==undefined)this.linejoin=a.linejoin}};
THREE.LineBasicMaterial.prototype={toString:function(){return"THREE.LineBasicMaterial (<br/>color: "+this.color+"<br/>opacity: "+this.opacity+"<br/>blending: "+this.blending+"<br/>linewidth: "+this.linewidth+"<br/>linecap: "+this.linecap+"<br/>linejoin: "+this.linejoin+"<br/>)"}};
THREE.MeshBasicMaterial=function(a){this.id=THREE.MeshBasicMaterialCounter.value++;this.color=new THREE.Color(16777215);this.env_map=this.light_map=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refraction_ratio=0.98;this.fog=true;this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.map!==
undefined)this.map=a.map;if(a.light_map!==undefined)this.light_map=a.light_map;if(a.env_map!==undefined)this.env_map=a.env_map;if(a.combine!==undefined)this.combine=a.combine;if(a.reflectivity!==undefined)this.reflectivity=a.reflectivity;if(a.refraction_ratio!==undefined)this.refraction_ratio=a.refraction_ratio;if(a.fog!==undefined)this.fog=a.fog;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==
undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==undefined)this.wireframe_linewidth=a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=a.wireframe_linejoin}};
THREE.MeshBasicMaterial.prototype={toString:function(){return"THREE.MeshBasicMaterial (<br/>id: "+this.id+"<br/>color: "+this.color+"<br/>map: "+this.map+"<br/>light_map: "+this.light_map+"<br/>env_map: "+this.env_map+"<br/>combine: "+this.combine+"<br/>reflectivity: "+this.reflectivity+"<br/>refraction_ratio: "+this.refraction_ratio+"<br/>opacity: "+this.opacity+"<br/>blending: "+this.blending+"<br/>wireframe: "+this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+
this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/>)"}};THREE.MeshBasicMaterialCounter={value:0};
THREE.MeshLambertMaterial=function(a){this.id=THREE.MeshLambertMaterialCounter.value++;this.color=new THREE.Color(16777215);this.env_map=this.light_map=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refraction_ratio=0.98;this.fog=true;this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){a.color!==undefined&&this.color.setHex(a.color);
if(a.map!==undefined)this.map=a.map;if(a.light_map!==undefined)this.light_map=a.light_map;if(a.env_map!==undefined)this.env_map=a.env_map;if(a.combine!==undefined)this.combine=a.combine;if(a.reflectivity!==undefined)this.reflectivity=a.reflectivity;if(a.refraction_ratio!==undefined)this.refraction_ratio=a.refraction_ratio;if(a.fog!==undefined)this.fog=a.fog;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;
if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==undefined)this.wireframe_linewidth=a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=a.wireframe_linejoin}};
THREE.MeshLambertMaterial.prototype={toString:function(){return"THREE.MeshLambertMaterial (<br/>id: "+this.id+"<br/>color: "+this.color+"<br/>map: "+this.map+"<br/>env_map: "+this.env_map+"<br/>combine: "+this.combine+"<br/>reflectivity: "+this.reflectivity+"<br/>refraction_ratio: "+this.refraction_ratio+"<br/>opacity: "+this.opacity+"<br/>shading: "+this.shading+"<br/>blending: "+this.blending+"<br/>wireframe: "+this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+
this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/> )"}};THREE.MeshLambertMaterialCounter={value:0};
THREE.MeshPhongMaterial=function(a){this.id=THREE.MeshPhongMaterialCounter.value++;this.color=new THREE.Color(16777215);this.ambient=new THREE.Color(328965);this.specular=new THREE.Color(1118481);this.shininess=30;this.env_map=this.light_map=this.specular_map=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refraction_ratio=0.98;this.fog=true;this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=
1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){if(a.color!==undefined)this.color=new THREE.Color(a.color);if(a.ambient!==undefined)this.ambient=new THREE.Color(a.ambient);if(a.specular!==undefined)this.specular=new THREE.Color(a.specular);if(a.shininess!==undefined)this.shininess=a.shininess;if(a.light_map!==undefined)this.light_map=a.light_map;if(a.map!==undefined)this.map=a.map;if(a.specular_map!==undefined)this.specular_map=a.specular_map;if(a.env_map!==undefined)this.env_map=a.env_map;
if(a.combine!==undefined)this.combine=a.combine;if(a.reflectivity!==undefined)this.reflectivity=a.reflectivity;if(a.refraction_ratio!==undefined)this.refraction_ratio=a.refraction_ratio;if(a.fog!==undefined)this.fog=a.fog;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==undefined)this.wireframe_linewidth=a.wireframe_linewidth;
if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=a.wireframe_linejoin}};
THREE.MeshPhongMaterial.prototype={toString:function(){return"THREE.MeshPhongMaterial (<br/>id: "+this.id+"<br/>color: "+this.color+"<br/>ambient: "+this.ambient+"<br/>specular: "+this.specular+"<br/>shininess: "+this.shininess+"<br/>map: "+this.map+"<br/>specular_map: "+this.specular_map+"<br/>env_map: "+this.env_map+"<br/>combine: "+this.combine+"<br/>reflectivity: "+this.reflectivity+"<br/>refraction_ratio: "+this.refraction_ratio+"<br/>opacity: "+this.opacity+"<br/>shading: "+this.shading+"<br/>wireframe: "+
this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/>)"}};THREE.MeshPhongMaterialCounter={value:0};
THREE.MeshDepthMaterial=function(a){this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending}};THREE.MeshDepthMaterial.prototype={toString:function(){return"THREE.MeshDepthMaterial"}};
THREE.MeshNormalMaterial=function(a){this.opacity=1;this.shading=THREE.FlatShading;this.blending=THREE.NormalBlending;if(a){if(a.opacity!==undefined)this.opacity=a.opacity;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending}};THREE.MeshNormalMaterial.prototype={toString:function(){return"THREE.MeshNormalMaterial"}};THREE.MeshFaceMaterial=function(){};THREE.MeshFaceMaterial.prototype={toString:function(){return"THREE.MeshFaceMaterial"}};
THREE.MeshShaderMaterial=function(a){this.id=THREE.MeshShaderMaterialCounter.value++;this.vertex_shader=this.fragment_shader="void main() {}";this.uniforms={};this.opacity=1;this.shading=THREE.SmoothShading;this.blending=THREE.NormalBlending;this.wireframe=false;this.wireframe_linewidth=1;this.wireframe_linejoin=this.wireframe_linecap="round";if(a){if(a.fragment_shader!==undefined)this.fragment_shader=a.fragment_shader;if(a.vertex_shader!==undefined)this.vertex_shader=a.vertex_shader;if(a.uniforms!==
undefined)this.uniforms=a.uniforms;if(a.shading!==undefined)this.shading=a.shading;if(a.blending!==undefined)this.blending=a.blending;if(a.wireframe!==undefined)this.wireframe=a.wireframe;if(a.wireframe_linewidth!==undefined)this.wireframe_linewidth=a.wireframe_linewidth;if(a.wireframe_linecap!==undefined)this.wireframe_linecap=a.wireframe_linecap;if(a.wireframe_linejoin!==undefined)this.wireframe_linejoin=a.wireframe_linejoin}};
THREE.MeshShaderMaterial.prototype={toString:function(){return"THREE.MeshShaderMaterial (<br/>id: "+this.id+"<br/>blending: "+this.blending+"<br/>wireframe: "+this.wireframe+"<br/>wireframe_linewidth: "+this.wireframe_linewidth+"<br/>wireframe_linecap: "+this.wireframe_linecap+"<br/>wireframe_linejoin: "+this.wireframe_linejoin+"<br/>)"}};THREE.MeshShaderMaterialCounter={value:0};
THREE.ParticleBasicMaterial=function(a){this.color=new THREE.Color(16777215);this.map=null;this.size=this.opacity=1;this.blending=THREE.NormalBlending;this.offset=new THREE.Vector2;if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.map!==undefined)this.map=a.map;if(a.opacity!==undefined)this.opacity=a.opacity;if(a.size!==undefined)this.size=a.size;if(a.blending!==undefined)this.blending=a.blending}};
THREE.ParticleBasicMaterial.prototype={toString:function(){return"THREE.ParticleBasicMaterial (<br/>color: "+this.color+"<br/>map: "+this.map+"<br/>opacity: "+this.opacity+"<br/>size: "+this.size+"<br/>blending: "+this.blending+"<br/>)"}};
THREE.ParticleCircleMaterial=function(a){this.color=new THREE.Color(16777215);this.opacity=1;this.blending=THREE.NormalBlending;if(a){a.color!==undefined&&this.color.setHex(a.color);if(a.opacity!==undefined)this.opacity=a.opacity;if(a.blending!==undefined)this.blending=a.blending}};THREE.ParticleCircleMaterial.prototype={toString:function(){return"THREE.ParticleCircleMaterial (<br/>color: "+this.color+"<br/>opacity: "+this.opacity+"<br/>blending: "+this.blending+"<br/>)"}};
THREE.ParticleDOMMaterial=function(a){this.domElement=a};THREE.ParticleDOMMaterial.prototype={toString:function(){return"THREE.ParticleDOMMaterial ( domElement: "+this.domElement+" )"}};THREE.Texture=function(a,c,d,e,i,b){this.image=a;this.mapping=c!==undefined?c:new THREE.UVMapping;this.wrap_s=d!==undefined?d:THREE.ClampToEdgeWrapping;this.wrap_t=e!==undefined?e:THREE.ClampToEdgeWrapping;this.mag_filter=i!==undefined?i:THREE.LinearFilter;this.min_filter=b!==undefined?b:THREE.LinearMipMapLinearFilter};
THREE.Texture.prototype={clone:function(){return new THREE.Texture(this.image,this.mapping,this.wrap_s,this.wrap_t,this.mag_filter,this.min_filter)},toString:function(){return"THREE.Texture (<br/>image: "+this.image+"<br/>wrap_s: "+this.wrap_s+"<br/>wrap_t: "+this.wrap_t+"<br/>mag_filter: "+this.mag_filter+"<br/>min_filter: "+this.min_filter+"<br/>)"}};THREE.MultiplyOperation=0;THREE.MixOperation=1;THREE.RepeatWrapping=0;THREE.ClampToEdgeWrapping=1;THREE.MirroredRepeatWrapping=2;
THREE.NearestFilter=3;THREE.NearestMipMapNearestFilter=4;THREE.NearestMipMapLinearFilter=5;THREE.LinearFilter=6;THREE.LinearMipMapNearestFilter=7;THREE.LinearMipMapLinearFilter=8;THREE.ByteType=9;THREE.UnsignedByteType=10;THREE.ShortType=11;THREE.UnsignedShortType=12;THREE.IntType=13;THREE.UnsignedIntType=14;THREE.FloatType=15;THREE.AlphaFormat=16;THREE.RGBFormat=17;THREE.RGBAFormat=18;THREE.LuminanceFormat=19;THREE.LuminanceAlphaFormat=20;
THREE.RenderTarget=function(a,c,d){this.width=a;this.height=c;d=d||{};this.wrap_s=d.wrap_s!==undefined?d.wrap_s:THREE.ClampToEdgeWrapping;this.wrap_t=d.wrap_t!==undefined?d.wrap_t:THREE.ClampToEdgeWrapping;this.mag_filter=d.mag_filter!==undefined?d.mag_filter:THREE.LinearFilter;this.min_filter=d.min_filter!==undefined?d.min_filter:THREE.LinearMipMapLinearFilter;this.format=d.format!==undefined?d.format:THREE.RGBFormat;this.type=d.type!==undefined?d.type:THREE.UnsignedByteType};
var Uniforms={clone:function(a){var c,d,e,i={};for(c in a){i[c]={};for(d in a[c]){e=a[c][d];i[c][d]=e instanceof THREE.Color||e instanceof THREE.Vector3||e instanceof THREE.Texture?e.clone():e}}return i},merge:function(a){var c,d,e,i={};for(c=0;c<a.length;c++){e=this.clone(a[c]);for(d in e)i[d]=e[d]}return i}};THREE.CubeReflectionMapping=function(){};THREE.CubeRefractionMapping=function(){};THREE.LatitudeReflectionMapping=function(){};THREE.LatitudeRefractionMapping=function(){};
THREE.SphericalReflectionMapping=function(){};THREE.SphericalRefractionMapping=function(){};THREE.UVMapping=function(){};
THREE.Scene=function(){this.objects=[];this.lights=[];this.fog=null;this.addObject=function(a){this.objects.indexOf(a)===-1&&this.objects.push(a)};this.removeObject=function(a){a=this.objects.indexOf(a);a!==-1&&this.objects.splice(a,1)};this.addLight=function(a){this.lights.indexOf(a)===-1&&this.lights.push(a)};this.removeLight=function(a){a=this.lights.indexOf(a);a!==-1&&this.lights.splice(a,1)};this.toString=function(){return"THREE.Scene ( "+this.objects+" )"}};
THREE.Fog=function(a,c,d){this.color=new THREE.Color(a);this.near=c||1;this.far=d||1E3};THREE.FogExp2=function(a,c){this.color=new THREE.Color(a);this.density=c||2.5E-4};
THREE.Projector=function(){function a(t,k){return k.z-t.z}function c(t,k){var A=0,q=1,C=t.z+t.w,r=k.z+k.w,v=-t.z+t.w,D=-k.z+k.w;if(C>=0&&r>=0&&v>=0&&D>=0)return true;else if(C<0&&r<0||v<0&&D<0)return false;else{if(C<0)A=Math.max(A,C/(C-r));else if(r<0)q=Math.min(q,C/(C-r));if(v<0)A=Math.max(A,v/(v-D));else if(D<0)q=Math.min(q,v/(v-D));if(q<A)return false;else{t.lerpSelf(k,A);k.lerpSelf(t,1-q);return true}}}var d,e,i=[],b,n,o,l=[],m,z,y=[],u,x,G=[],H=new THREE.Vector4,I=new THREE.Vector4,p=new THREE.Matrix4,
g=new THREE.Matrix4,h=[],f=new THREE.Vector4,j=new THREE.Vector4,s;this.projectObjects=function(t,k,A){var q=[],C,r;e=0;p.multiply(k.projectionMatrix,k.matrix);h[0]=new THREE.Vector4(p.n41-p.n11,p.n42-p.n12,p.n43-p.n13,p.n44-p.n14);h[1]=new THREE.Vector4(p.n41+p.n11,p.n42+p.n12,p.n43+p.n13,p.n44+p.n14);h[2]=new THREE.Vector4(p.n41+p.n21,p.n42+p.n22,p.n43+p.n23,p.n44+p.n24);h[3]=new THREE.Vector4(p.n41-p.n21,p.n42-p.n22,p.n43-p.n23,p.n44-p.n24);h[4]=new THREE.Vector4(p.n41-p.n31,p.n42-p.n32,p.n43-
p.n33,p.n44-p.n34);h[5]=new THREE.Vector4(p.n41+p.n31,p.n42+p.n32,p.n43+p.n33,p.n44+p.n34);k=0;for(C=h.length;k<C;k++){r=h[k];r.divideScalar(Math.sqrt(r.x*r.x+r.y*r.y+r.z*r.z))}C=t.objects;t=0;for(k=C.length;t<k;t++){r=C[t];var v;if(!(v=!r.visible)){if(v=r instanceof THREE.Mesh){a:{v=void 0;for(var D=r.position,W=-r.geometry.boundingSphere.radius*Math.max(r.scale.x,Math.max(r.scale.y,r.scale.z)),E=0;E<6;E++){v=h[E].x*D.x+h[E].y*D.y+h[E].z*D.z+h[E].w;if(v<=W){v=false;break a}}v=true}v=!v}v=v}if(!v){d=
i[e]=i[e]||new THREE.RenderableObject;H.copy(r.position);p.multiplyVector3(H);d.object=r;d.z=H.z;q.push(d);e++}}A&&q.sort(a);return q};this.projectScene=function(t,k,A){var q=[],C=k.near,r=k.far,v,D,W,E,O,M,J,S,V,N,K,U,R,w,L,P;o=z=x=0;k.autoUpdateMatrix&&k.updateMatrix();p.multiply(k.projectionMatrix,k.matrix);M=this.projectObjects(t,k,true);t=0;for(v=M.length;t<v;t++){J=M[t].object;if(J.visible){J.autoUpdateMatrix&&J.updateMatrix();S=J.matrix;V=J.rotationMatrix;N=J.materials;K=J.overdraw;if(J instanceof
THREE.Mesh){U=J.geometry;R=U.vertices;D=0;for(W=R.length;D<W;D++){w=R[D];w.positionWorld.copy(w.position);S.multiplyVector3(w.positionWorld);E=w.positionScreen;E.copy(w.positionWorld);p.multiplyVector4(E);E.x/=E.w;E.y/=E.w;w.__visible=E.z>C&&E.z<r}U=U.faces;D=0;for(W=U.length;D<W;D++){w=U[D];if(w instanceof THREE.Face3){E=R[w.a];O=R[w.b];L=R[w.c];if(E.__visible&&O.__visible&&L.__visible)if(J.doubleSided||J.flipSided!=(L.positionScreen.x-E.positionScreen.x)*(O.positionScreen.y-E.positionScreen.y)-
(L.positionScreen.y-E.positionScreen.y)*(O.positionScreen.x-E.positionScreen.x)<0){b=l[o]=l[o]||new THREE.RenderableFace3;b.v1.positionWorld.copy(E.positionWorld);b.v2.positionWorld.copy(O.positionWorld);b.v3.positionWorld.copy(L.positionWorld);b.v1.positionScreen.copy(E.positionScreen);b.v2.positionScreen.copy(O.positionScreen);b.v3.positionScreen.copy(L.positionScreen);b.normalWorld.copy(w.normal);V.multiplyVector3(b.normalWorld);b.centroidWorld.copy(w.centroid);S.multiplyVector3(b.centroidWorld);
b.centroidScreen.copy(b.centroidWorld);p.multiplyVector3(b.centroidScreen);L=w.vertexNormals;s=b.vertexNormalsWorld;E=0;for(O=L.length;E<O;E++){P=s[E]=s[E]||new THREE.Vector3;P.copy(L[E]);V.multiplyVector3(P)}b.z=b.centroidScreen.z;b.meshMaterials=N;b.faceMaterials=w.materials;b.overdraw=K;if(J.geometry.uvs[D]){b.uvs[0]=J.geometry.uvs[D][0];b.uvs[1]=J.geometry.uvs[D][1];b.uvs[2]=J.geometry.uvs[D][2]}q.push(b);o++}}else if(w instanceof THREE.Face4){E=R[w.a];O=R[w.b];L=R[w.c];P=R[w.d];if(E.__visible&&
O.__visible&&L.__visible&&P.__visible)if(J.doubleSided||J.flipSided!=((P.positionScreen.x-E.positionScreen.x)*(O.positionScreen.y-E.positionScreen.y)-(P.positionScreen.y-E.positionScreen.y)*(O.positionScreen.x-E.positionScreen.x)<0||(O.positionScreen.x-L.positionScreen.x)*(P.positionScreen.y-L.positionScreen.y)-(O.positionScreen.y-L.positionScreen.y)*(P.positionScreen.x-L.positionScreen.x)<0)){b=l[o]=l[o]||new THREE.RenderableFace3;b.v1.positionWorld.copy(E.positionWorld);b.v2.positionWorld.copy(O.positionWorld);
b.v3.positionWorld.copy(P.positionWorld);b.v1.positionScreen.copy(E.positionScreen);b.v2.positionScreen.copy(O.positionScreen);b.v3.positionScreen.copy(P.positionScreen);b.normalWorld.copy(w.normal);V.multiplyVector3(b.normalWorld);b.centroidWorld.copy(w.centroid);S.multiplyVector3(b.centroidWorld);b.centroidScreen.copy(b.centroidWorld);p.multiplyVector3(b.centroidScreen);b.z=b.centroidScreen.z;b.meshMaterials=N;b.faceMaterials=w.materials;b.overdraw=K;if(J.geometry.uvs[D]){b.uvs[0]=J.geometry.uvs[D][0];
b.uvs[1]=J.geometry.uvs[D][1];b.uvs[2]=J.geometry.uvs[D][3]}q.push(b);o++;n=l[o]=l[o]||new THREE.RenderableFace3;n.v1.positionWorld.copy(O.positionWorld);n.v2.positionWorld.copy(L.positionWorld);n.v3.positionWorld.copy(P.positionWorld);n.v1.positionScreen.copy(O.positionScreen);n.v2.positionScreen.copy(L.positionScreen);n.v3.positionScreen.copy(P.positionScreen);n.normalWorld.copy(b.normalWorld);n.centroidWorld.copy(b.centroidWorld);n.centroidScreen.copy(b.centroidScreen);n.z=n.centroidScreen.z;n.meshMaterials=
N;n.faceMaterials=w.materials;n.overdraw=K;if(J.geometry.uvs[D]){n.uvs[0]=J.geometry.uvs[D][1];n.uvs[1]=J.geometry.uvs[D][2];n.uvs[2]=J.geometry.uvs[D][3]}q.push(n);o++}}}}else if(J instanceof THREE.Line){g.multiply(p,S);R=J.geometry.vertices;w=R[0];w.positionScreen.copy(w.position);g.multiplyVector4(w.positionScreen);D=1;for(W=R.length;D<W;D++){E=R[D];E.positionScreen.copy(E.position);g.multiplyVector4(E.positionScreen);O=R[D-1];f.copy(E.positionScreen);j.copy(O.positionScreen);if(c(f,j)){f.multiplyScalar(1/
f.w);j.multiplyScalar(1/j.w);m=y[z]=y[z]||new THREE.RenderableLine;m.v1.positionScreen.copy(f);m.v2.positionScreen.copy(j);m.z=Math.max(f.z,j.z);m.materials=J.materials;q.push(m);z++}}}else if(J instanceof THREE.Particle){I.set(J.position.x,J.position.y,J.position.z,1);p.multiplyVector4(I);I.z/=I.w;if(I.z>0&&I.z<1){u=G[x]=G[x]||new THREE.RenderableParticle;u.x=I.x/I.w;u.y=I.y/I.w;u.z=I.z;u.rotation=J.rotation.z;u.scale.x=J.scale.x*Math.abs(u.x-(I.x+k.projectionMatrix.n11)/(I.w+k.projectionMatrix.n14));
u.scale.y=J.scale.y*Math.abs(u.y-(I.y+k.projectionMatrix.n22)/(I.w+k.projectionMatrix.n24));u.materials=J.materials;q.push(u);x++}}}}A&&q.sort(a);return q};this.unprojectVector=function(t,k){var A=THREE.Matrix4.makeInvert(k.matrix);A.multiplySelf(THREE.Matrix4.makeInvert(k.projectionMatrix));A.multiplyVector3(t);return t}};
THREE.DOMRenderer=function(){THREE.Renderer.call(this);var a=null,c=new THREE.Projector,d,e,i,b;this.domElement=document.createElement("div");this.setSize=function(n,o){d=n;e=o;i=d/2;b=e/2};this.render=function(n,o){var l,m,z,y,u,x,G,H;a=c.projectScene(n,o);l=0;for(m=a.length;l<m;l++){u=a[l];if(u instanceof THREE.RenderableParticle){G=u.x*i+i;H=u.y*b+b;z=0;for(y=u.material.length;z<y;z++){x=u.material[z];if(x instanceof THREE.ParticleDOMMaterial){x=x.domElement;x.style.left=G+"px";x.style.top=H+"px"}}}}}};
THREE.CanvasRenderer=function(){function a(ea){if(u!=ea)m.globalAlpha=u=ea}function c(ea){if(x!=ea){switch(ea){case THREE.NormalBlending:m.globalCompositeOperation="source-over";break;case THREE.AdditiveBlending:m.globalCompositeOperation="lighter";break;case THREE.SubtractiveBlending:m.globalCompositeOperation="darker"}x=ea}}var d=null,e=new THREE.Projector,i=document.createElement("canvas"),b,n,o,l,m=i.getContext("2d"),z=new THREE.Color(0),y=0,u=1,x=0,G=null,H=null,I=1,p,g,h,f,j,s,t,k,A,q=new THREE.Color,
C=new THREE.Color,r=new THREE.Color,v=new THREE.Color,D=new THREE.Color,W,E,O,M,J,S,V,N,K,U=new THREE.Rectangle,R=new THREE.Rectangle,w=new THREE.Rectangle,L=false,P=new THREE.Color,ga=new THREE.Color,ja=new THREE.Color,ca=new THREE.Color,$=Math.PI*2,Y=new THREE.Vector3,da,qa,la,aa,ra,va,sa=16;da=document.createElement("canvas");da.width=da.height=2;qa=da.getContext("2d");qa.fillStyle="rgba(0,0,0,1)";qa.fillRect(0,0,2,2);la=qa.getImageData(0,0,2,2);aa=la.data;ra=document.createElement("canvas");ra.width=
ra.height=sa;va=ra.getContext("2d");va.translate(-sa/2,-sa/2);va.scale(sa,sa);sa--;this.domElement=i;this.sortElements=this.sortObjects=this.autoClear=true;this.setSize=function(ea,ta){b=ea;n=ta;o=b/2;l=n/2;i.width=b;i.height=n;U.set(-o,-l,o,l);u=1;x=0;H=G=null;I=1};this.setClearColor=function(ea,ta){z.setHex(ea);y=ta;R.set(-o,-l,o,l);m.setTransform(1,0,0,-1,o,l);this.clear()};this.clear=function(){m.setTransform(1,0,0,-1,o,l);if(!R.isEmpty()){R.inflate(1);R.minSelf(U);if(z.hex==0&&y==0)m.clearRect(R.getX(),
R.getY(),R.getWidth(),R.getHeight());else{c(THREE.NormalBlending);a(1);m.fillStyle="rgba("+Math.floor(z.r*255)+","+Math.floor(z.g*255)+","+Math.floor(z.b*255)+","+y+")";m.fillRect(R.getX(),R.getY(),R.getWidth(),R.getHeight())}R.empty()}};this.render=function(ea,ta){function Ma(B){var X,T,F,Q=B.lights;ga.setRGB(0,0,0);ja.setRGB(0,0,0);ca.setRGB(0,0,0);B=0;for(X=Q.length;B<X;B++){T=Q[B];F=T.color;if(T instanceof THREE.AmbientLight){ga.r+=F.r;ga.g+=F.g;ga.b+=F.b}else if(T instanceof THREE.DirectionalLight){ja.r+=
F.r;ja.g+=F.g;ja.b+=F.b}else if(T instanceof THREE.PointLight){ca.r+=F.r;ca.g+=F.g;ca.b+=F.b}}}function Aa(B,X,T,F){var Q,Z,fa,ha,ia=B.lights;B=0;for(Q=ia.length;B<Q;B++){Z=ia[B];fa=Z.color;ha=Z.intensity;if(Z instanceof THREE.DirectionalLight){Z=T.dot(Z.position)*ha;if(Z>0){F.r+=fa.r*Z;F.g+=fa.g*Z;F.b+=fa.b*Z}}else if(Z instanceof THREE.PointLight){Y.sub(Z.position,X);Y.normalize();Z=T.dot(Y)*ha;if(Z>0){F.r+=fa.r*Z;F.g+=fa.g*Z;F.b+=fa.b*Z}}}}function Na(B,X,T){if(T.opacity!=0){a(T.opacity);c(T.blending);
var F,Q,Z,fa,ha,ia;if(T instanceof THREE.ParticleBasicMaterial){if(T.map&&T.map.image.loaded){fa=T.map.image;ha=fa.width>>1;ia=fa.height>>1;Q=X.scale.x*o;Z=X.scale.y*l;T=Q*ha;F=Z*ia;w.set(B.x-T,B.y-F,B.x+T,B.y+F);if(U.instersects(w)){m.save();m.translate(B.x,B.y);m.rotate(-X.rotation);m.scale(Q,-Z);m.translate(-ha,-ia);m.drawImage(fa,0,0);m.restore()}}}else if(T instanceof THREE.ParticleCircleMaterial){if(L){P.r=ga.r+ja.r+ca.r;P.g=ga.g+ja.g+ca.g;P.b=ga.b+ja.b+ca.b;q.r=T.color.r*P.r;q.g=T.color.g*
P.g;q.b=T.color.b*P.b;q.updateStyleString()}else q.__styleString=T.color.__styleString;T=X.scale.x*o;F=X.scale.y*l;w.set(B.x-T,B.y-F,B.x+T,B.y+F);if(U.instersects(w)){Q=q.__styleString;if(H!=Q)m.fillStyle=H=Q;m.save();m.translate(B.x,B.y);m.rotate(-X.rotation);m.scale(T,F);m.beginPath();m.arc(0,0,1,0,$,true);m.closePath();m.fill();m.restore()}}}}function Oa(B,X,T,F){if(F.opacity!=0){a(F.opacity);c(F.blending);m.beginPath();m.moveTo(B.positionScreen.x,B.positionScreen.y);m.lineTo(X.positionScreen.x,
X.positionScreen.y);m.closePath();if(F instanceof THREE.LineBasicMaterial){q.__styleString=F.color.__styleString;B=F.linewidth;if(I!=B)m.lineWidth=I=B;B=q.__styleString;if(G!=B)m.strokeStyle=G=B;m.stroke();w.inflate(F.linewidth*2)}}}function Ia(B,X,T,F,Q,Z){if(Q.opacity!=0){a(Q.opacity);c(Q.blending);f=B.positionScreen.x;j=B.positionScreen.y;s=X.positionScreen.x;t=X.positionScreen.y;k=T.positionScreen.x;A=T.positionScreen.y;m.beginPath();m.moveTo(f,j);m.lineTo(s,t);m.lineTo(k,A);m.lineTo(f,j);m.closePath();
if(Q instanceof THREE.MeshBasicMaterial)if(Q.map)Q.map.image.loaded&&Q.map.mapping instanceof THREE.UVMapping&&xa(f,j,s,t,k,A,Q.map.image,F.uvs[0].u,F.uvs[0].v,F.uvs[1].u,F.uvs[1].v,F.uvs[2].u,F.uvs[2].v);else if(Q.env_map){if(Q.env_map.image.loaded)if(Q.env_map.mapping instanceof THREE.SphericalReflectionMapping){B=ta.matrix;Y.copy(F.vertexNormalsWorld[0]);M=(Y.x*B.n11+Y.y*B.n12+Y.z*B.n13)*0.5+0.5;J=-(Y.x*B.n21+Y.y*B.n22+Y.z*B.n23)*0.5+0.5;Y.copy(F.vertexNormalsWorld[1]);S=(Y.x*B.n11+Y.y*B.n12+Y.z*
B.n13)*0.5+0.5;V=-(Y.x*B.n21+Y.y*B.n22+Y.z*B.n23)*0.5+0.5;Y.copy(F.vertexNormalsWorld[2]);N=(Y.x*B.n11+Y.y*B.n12+Y.z*B.n13)*0.5+0.5;K=-(Y.x*B.n21+Y.y*B.n22+Y.z*B.n23)*0.5+0.5;xa(f,j,s,t,k,A,Q.env_map.image,M,J,S,V,N,K)}}else Q.wireframe?Ba(Q.color.__styleString,Q.wireframe_linewidth):Ca(Q.color.__styleString);else if(Q instanceof THREE.MeshLambertMaterial){if(Q.map&&!Q.wireframe){Q.map.mapping instanceof THREE.UVMapping&&xa(f,j,s,t,k,A,Q.map.image,F.uvs[0].u,F.uvs[0].v,F.uvs[1].u,F.uvs[1].v,F.uvs[2].u,
F.uvs[2].v);c(THREE.SubtractiveBlending)}if(L)if(!Q.wireframe&&Q.shading==THREE.SmoothShading&&F.vertexNormalsWorld.length==3){C.r=r.r=v.r=ga.r;C.g=r.g=v.g=ga.g;C.b=r.b=v.b=ga.b;Aa(Z,F.v1.positionWorld,F.vertexNormalsWorld[0],C);Aa(Z,F.v2.positionWorld,F.vertexNormalsWorld[1],r);Aa(Z,F.v3.positionWorld,F.vertexNormalsWorld[2],v);D.r=(r.r+v.r)*0.5;D.g=(r.g+v.g)*0.5;D.b=(r.b+v.b)*0.5;O=Ja(C,r,v,D);xa(f,j,s,t,k,A,O,0,0,1,0,0,1)}else{P.r=ga.r;P.g=ga.g;P.b=ga.b;Aa(Z,F.centroidWorld,F.normalWorld,P);q.r=
Q.color.r*P.r;q.g=Q.color.g*P.g;q.b=Q.color.b*P.b;q.updateStyleString();Q.wireframe?Ba(q.__styleString,Q.wireframe_linewidth):Ca(q.__styleString)}else Q.wireframe?Ba(Q.color.__styleString,Q.wireframe_linewidth):Ca(Q.color.__styleString)}else if(Q instanceof THREE.MeshDepthMaterial){W=ta.near;E=ta.far;C.r=C.g=C.b=1-Ea(B.positionScreen.z,W,E);r.r=r.g=r.b=1-Ea(X.positionScreen.z,W,E);v.r=v.g=v.b=1-Ea(T.positionScreen.z,W,E);D.r=(r.r+v.r)*0.5;D.g=(r.g+v.g)*0.5;D.b=(r.b+v.b)*0.5;O=Ja(C,r,v,D);xa(f,j,s,
t,k,A,O,0,0,1,0,0,1)}else if(Q instanceof THREE.MeshNormalMaterial){q.r=Fa(F.normalWorld.x);q.g=Fa(F.normalWorld.y);q.b=Fa(F.normalWorld.z);q.updateStyleString();Q.wireframe?Ba(q.__styleString,Q.wireframe_linewidth):Ca(q.__styleString)}}}function Ba(B,X){if(G!=B)m.strokeStyle=G=B;if(I!=X)m.lineWidth=I=X;m.stroke();w.inflate(X*2)}function Ca(B){if(H!=B)m.fillStyle=H=B;m.fill()}function xa(B,X,T,F,Q,Z,fa,ha,ia,na,ka,oa,ya){var ua,pa;ua=fa.width-1;pa=fa.height-1;ha*=ua;ia*=pa;na*=ua;ka*=pa;oa*=ua;ya*=
pa;T-=B;F-=X;Q-=B;Z-=X;na-=ha;ka-=ia;oa-=ha;ya-=ia;pa=1/(na*ya-oa*ka);ua=(ya*T-ka*Q)*pa;ka=(ya*F-ka*Z)*pa;T=(na*Q-oa*T)*pa;F=(na*Z-oa*F)*pa;B=B-ua*ha-T*ia;X=X-ka*ha-F*ia;m.save();m.transform(ua,ka,T,F,B,X);m.clip();m.drawImage(fa,0,0);m.restore()}function Ja(B,X,T,F){var Q=~~(B.r*255),Z=~~(B.g*255);B=~~(B.b*255);var fa=~~(X.r*255),ha=~~(X.g*255);X=~~(X.b*255);var ia=~~(T.r*255),na=~~(T.g*255);T=~~(T.b*255);var ka=~~(F.r*255),oa=~~(F.g*255);F=~~(F.b*255);aa[0]=Q<0?0:Q>255?255:Q;aa[1]=Z<0?0:Z>255?255:
Z;aa[2]=B<0?0:B>255?255:B;aa[4]=fa<0?0:fa>255?255:fa;aa[5]=ha<0?0:ha>255?255:ha;aa[6]=X<0?0:X>255?255:X;aa[8]=ia<0?0:ia>255?255:ia;aa[9]=na<0?0:na>255?255:na;aa[10]=T<0?0:T>255?255:T;aa[12]=ka<0?0:ka>255?255:ka;aa[13]=oa<0?0:oa>255?255:oa;aa[14]=F<0?0:F>255?255:F;qa.putImageData(la,0,0);va.drawImage(da,0,0);return ra}function Ea(B,X,T){B=(B-X)/(T-X);return B*B*(3-2*B)}function Fa(B){B=(B+1)*0.5;return B<0?0:B>1?1:B}function Ga(B,X){var T=X.x-B.x,F=X.y-B.y,Q=1/Math.sqrt(T*T+F*F);T*=Q;F*=Q;X.x+=T;X.y+=
F;B.x-=T;B.y-=F}var Da,Ka,ba,ma,wa,Ha,La,za;this.autoClear?this.clear():m.setTransform(1,0,0,-1,o,l);d=e.projectScene(ea,ta,this.sortElements);(L=ea.lights.length>0)&&Ma(ea);Da=0;for(Ka=d.length;Da<Ka;Da++){ba=d[Da];w.empty();if(ba instanceof THREE.RenderableParticle){p=ba;p.x*=o;p.y*=l;ma=0;for(wa=ba.materials.length;ma<wa;ma++)Na(p,ba,ba.materials[ma],ea)}else if(ba instanceof THREE.RenderableLine){p=ba.v1;g=ba.v2;p.positionScreen.x*=o;p.positionScreen.y*=l;g.positionScreen.x*=o;g.positionScreen.y*=
l;w.addPoint(p.positionScreen.x,p.positionScreen.y);w.addPoint(g.positionScreen.x,g.positionScreen.y);if(U.instersects(w)){ma=0;for(wa=ba.materials.length;ma<wa;)Oa(p,g,ba,ba.materials[ma++],ea)}}else if(ba instanceof THREE.RenderableFace3){p=ba.v1;g=ba.v2;h=ba.v3;p.positionScreen.x*=o;p.positionScreen.y*=l;g.positionScreen.x*=o;g.positionScreen.y*=l;h.positionScreen.x*=o;h.positionScreen.y*=l;if(ba.overdraw){Ga(p.positionScreen,g.positionScreen);Ga(g.positionScreen,h.positionScreen);Ga(h.positionScreen,
p.positionScreen)}w.add3Points(p.positionScreen.x,p.positionScreen.y,g.positionScreen.x,g.positionScreen.y,h.positionScreen.x,h.positionScreen.y);if(U.instersects(w)){ma=0;for(wa=ba.meshMaterials.length;ma<wa;){za=ba.meshMaterials[ma++];if(za instanceof THREE.MeshFaceMaterial){Ha=0;for(La=ba.faceMaterials.length;Ha<La;)(za=ba.faceMaterials[Ha++])&&Ia(p,g,h,ba,za,ea)}else Ia(p,g,h,ba,za,ea)}}}R.addRectangle(w)}m.setTransform(1,0,0,1,0,0)}};
THREE.SVGRenderer=function(){function a(M,J,S){var V,N,K,U;V=0;for(N=M.lights.length;V<N;V++){K=M.lights[V];if(K instanceof THREE.DirectionalLight){U=J.normalWorld.dot(K.position)*K.intensity;if(U>0){S.r+=K.color.r*U;S.g+=K.color.g*U;S.b+=K.color.b*U}}else if(K instanceof THREE.PointLight){A.sub(K.position,J.centroidWorld);A.normalize();U=J.normalWorld.dot(A)*K.intensity;if(U>0){S.r+=K.color.r*U;S.g+=K.color.g*U;S.b+=K.color.b*U}}}}function c(M,J,S,V,N,K){v=e(D++);v.setAttribute("d","M "+M.positionScreen.x+
" "+M.positionScreen.y+" L "+J.positionScreen.x+" "+J.positionScreen.y+" L "+S.positionScreen.x+","+S.positionScreen.y+"z");if(N instanceof THREE.MeshBasicMaterial)h.__styleString=N.color.__styleString;else if(N instanceof THREE.MeshLambertMaterial)if(g){f.r=j.r;f.g=j.g;f.b=j.b;a(K,V,f);h.r=N.color.r*f.r;h.g=N.color.g*f.g;h.b=N.color.b*f.b;h.updateStyleString()}else h.__styleString=N.color.__styleString;else if(N instanceof THREE.MeshDepthMaterial){k=1-N.__2near/(N.__farPlusNear-V.z*N.__farMinusNear);
h.setRGB(k,k,k)}else N instanceof THREE.MeshNormalMaterial&&h.setRGB(i(V.normalWorld.x),i(V.normalWorld.y),i(V.normalWorld.z));N.wireframe?v.setAttribute("style","fill: none; stroke: "+h.__styleString+"; stroke-width: "+N.wireframe_linewidth+"; stroke-opacity: "+N.opacity+"; stroke-linecap: "+N.wireframe_linecap+"; stroke-linejoin: "+N.wireframe_linejoin):v.setAttribute("style","fill: "+h.__styleString+"; fill-opacity: "+N.opacity);o.appendChild(v)}function d(M,J,S,V,N,K,U){v=e(D++);v.setAttribute("d",
"M "+M.positionScreen.x+" "+M.positionScreen.y+" L "+J.positionScreen.x+" "+J.positionScreen.y+" L "+S.positionScreen.x+","+S.positionScreen.y+" L "+V.positionScreen.x+","+V.positionScreen.y+"z");if(K instanceof THREE.MeshBasicMaterial)h.__styleString=K.color.__styleString;else if(K instanceof THREE.MeshLambertMaterial)if(g){f.r=j.r;f.g=j.g;f.b=j.b;a(U,N,f);h.r=K.color.r*f.r;h.g=K.color.g*f.g;h.b=K.color.b*f.b;h.updateStyleString()}else h.__styleString=K.color.__styleString;else if(K instanceof THREE.MeshDepthMaterial){k=
1-K.__2near/(K.__farPlusNear-N.z*K.__farMinusNear);h.setRGB(k,k,k)}else K instanceof THREE.MeshNormalMaterial&&h.setRGB(i(N.normalWorld.x),i(N.normalWorld.y),i(N.normalWorld.z));K.wireframe?v.setAttribute("style","fill: none; stroke: "+h.__styleString+"; stroke-width: "+K.wireframe_linewidth+"; stroke-opacity: "+K.opacity+"; stroke-linecap: "+K.wireframe_linecap+"; stroke-linejoin: "+K.wireframe_linejoin):v.setAttribute("style","fill: "+h.__styleString+"; fill-opacity: "+K.opacity);o.appendChild(v)}
function e(M){if(q[M]==null){q[M]=document.createElementNS("http://www.w3.org/2000/svg","path");O==0&&q[M].setAttribute("shape-rendering","crispEdges");return q[M]}return q[M]}function i(M){return M<0?Math.min((1+M)*0.5,0.5):0.5+Math.min(M*0.5,0.5)}var b=null,n=new THREE.Projector,o=document.createElementNS("http://www.w3.org/2000/svg","svg"),l,m,z,y,u,x,G,H,I=new THREE.Rectangle,p=new THREE.Rectangle,g=false,h=new THREE.Color(16777215),f=new THREE.Color(16777215),j=new THREE.Color(0),s=new THREE.Color(0),
t=new THREE.Color(0),k,A=new THREE.Vector3,q=[],C=[],r=[],v,D,W,E,O=1;this.domElement=o;this.sortElements=this.sortObjects=this.autoClear=true;this.setQuality=function(M){switch(M){case "high":O=1;break;case "low":O=0}};this.setSize=function(M,J){l=M;m=J;z=l/2;y=m/2;o.setAttribute("viewBox",-z+" "+-y+" "+l+" "+m);o.setAttribute("width",l);o.setAttribute("height",m);I.set(-z,-y,z,y)};this.clear=function(){for(;o.childNodes.length>0;)o.removeChild(o.childNodes[0])};this.render=function(M,J){var S,V,
N,K,U,R,w,L;this.autoClear&&this.clear();b=n.projectScene(M,J,this.sortElements);E=W=D=0;if(g=M.lights.length>0){w=M.lights;j.setRGB(0,0,0);s.setRGB(0,0,0);t.setRGB(0,0,0);S=0;for(V=w.length;S<V;S++){N=w[S];K=N.color;if(N instanceof THREE.AmbientLight){j.r+=K.r;j.g+=K.g;j.b+=K.b}else if(N instanceof THREE.DirectionalLight){s.r+=K.r;s.g+=K.g;s.b+=K.b}else if(N instanceof THREE.PointLight){t.r+=K.r;t.g+=K.g;t.b+=K.b}}}S=0;for(V=b.length;S<V;S++){w=b[S];p.empty();if(w instanceof THREE.RenderableParticle){u=
w;u.x*=z;u.y*=-y;N=0;for(K=w.materials.length;N<K;N++)if(L=w.materials[N]){U=u;R=w;L=L;var P=W++;if(C[P]==null){C[P]=document.createElementNS("http://www.w3.org/2000/svg","circle");O==0&&C[P].setAttribute("shape-rendering","crispEdges")}v=C[P];v.setAttribute("cx",U.x);v.setAttribute("cy",U.y);v.setAttribute("r",R.scale.x*z);if(L instanceof THREE.ParticleCircleMaterial){if(g){f.r=j.r+s.r+t.r;f.g=j.g+s.g+t.g;f.b=j.b+s.b+t.b;h.r=L.color.r*f.r;h.g=L.color.g*f.g;h.b=L.color.b*f.b;h.updateStyleString()}else h=
L.color;v.setAttribute("style","fill: "+h.__styleString)}o.appendChild(v)}}else if(w instanceof THREE.RenderableLine){u=w.v1;x=w.v2;u.positionScreen.x*=z;u.positionScreen.y*=-y;x.positionScreen.x*=z;x.positionScreen.y*=-y;p.addPoint(u.positionScreen.x,u.positionScreen.y);p.addPoint(x.positionScreen.x,x.positionScreen.y);if(I.instersects(p)){N=0;for(K=w.materials.length;N<K;)if(L=w.materials[N++]){U=u;R=x;L=L;P=E++;if(r[P]==null){r[P]=document.createElementNS("http://www.w3.org/2000/svg","line");O==
0&&r[P].setAttribute("shape-rendering","crispEdges")}v=r[P];v.setAttribute("x1",U.positionScreen.x);v.setAttribute("y1",U.positionScreen.y);v.setAttribute("x2",R.positionScreen.x);v.setAttribute("y2",R.positionScreen.y);if(L instanceof THREE.LineBasicMaterial){h.__styleString=L.color.__styleString;v.setAttribute("style","fill: none; stroke: "+h.__styleString+"; stroke-width: "+L.linewidth+"; stroke-opacity: "+L.opacity+"; stroke-linecap: "+L.linecap+"; stroke-linejoin: "+L.linejoin);o.appendChild(v)}}}}else if(w instanceof
THREE.RenderableFace3){u=w.v1;x=w.v2;G=w.v3;u.positionScreen.x*=z;u.positionScreen.y*=-y;x.positionScreen.x*=z;x.positionScreen.y*=-y;G.positionScreen.x*=z;G.positionScreen.y*=-y;p.addPoint(u.positionScreen.x,u.positionScreen.y);p.addPoint(x.positionScreen.x,x.positionScreen.y);p.addPoint(G.positionScreen.x,G.positionScreen.y);if(I.instersects(p)){N=0;for(K=w.meshMaterials.length;N<K;){L=w.meshMaterials[N++];if(L instanceof THREE.MeshFaceMaterial){U=0;for(R=w.faceMaterials.length;U<R;)(L=w.faceMaterials[U++])&&
c(u,x,G,w,L,M)}else L&&c(u,x,G,w,L,M)}}}else if(w instanceof THREE.RenderableFace4){u=w.v1;x=w.v2;G=w.v3;H=w.v4;u.positionScreen.x*=z;u.positionScreen.y*=-y;x.positionScreen.x*=z;x.positionScreen.y*=-y;G.positionScreen.x*=z;G.positionScreen.y*=-y;H.positionScreen.x*=z;H.positionScreen.y*=-y;p.addPoint(u.positionScreen.x,u.positionScreen.y);p.addPoint(x.positionScreen.x,x.positionScreen.y);p.addPoint(G.positionScreen.x,G.positionScreen.y);p.addPoint(H.positionScreen.x,H.positionScreen.y);if(I.instersects(p)){N=
0;for(K=w.meshMaterials.length;N<K;){L=w.meshMaterials[N++];if(L instanceof THREE.MeshFaceMaterial){U=0;for(R=w.faceMaterials.length;U<R;)(L=w.faceMaterials[U++])&&d(u,x,G,H,w,L,M)}else L&&d(u,x,G,H,w,L,M)}}}}}};
THREE.WebGLRenderer=function(a){function c(g,h){g.fragment_shader=h.fragment_shader;g.vertex_shader=h.vertex_shader;g.uniforms=Uniforms.clone(h.uniforms)}function d(g,h){var f;if(g=="fragment")f=b.createShader(b.FRAGMENT_SHADER);else if(g=="vertex")f=b.createShader(b.VERTEX_SHADER);b.shaderSource(f,h);b.compileShader(f);if(!b.getShaderParameter(f,b.COMPILE_STATUS)){alert(b.getShaderInfoLog(f));return null}return f}function e(g){switch(g){case THREE.RepeatWrapping:return b.REPEAT;case THREE.ClampToEdgeWrapping:return b.CLAMP_TO_EDGE;
case THREE.MirroredRepeatWrapping:return b.MIRRORED_REPEAT;case THREE.NearestFilter:return b.NEAREST;case THREE.NearestMipMapNearestFilter:return b.NEAREST_MIPMAP_NEAREST;case THREE.NearestMipMapLinearFilter:return b.NEAREST_MIPMAP_LINEAR;case THREE.LinearFilter:return b.LINEAR;case THREE.LinearMipMapNearestFilter:return b.LINEAR_MIPMAP_NEAREST;case THREE.LinearMipMapLinearFilter:return b.LINEAR_MIPMAP_LINEAR;case THREE.ByteType:return b.BYTE;case THREE.UnsignedByteType:return b.UNSIGNED_BYTE;case THREE.ShortType:return b.SHORT;
case THREE.UnsignedShortType:return b.UNSIGNED_SHORT;case THREE.IntType:return b.INT;case THREE.UnsignedShortType:return b.UNSIGNED_INT;case THREE.FloatType:return b.FLOAT;case THREE.AlphaFormat:return b.ALPHA;case THREE.RGBFormat:return b.RGB;case THREE.RGBAFormat:return b.RGBA;case THREE.LuminanceFormat:return b.LUMINANCE;case THREE.LuminanceAlphaFormat:return b.LUMINANCE_ALPHA}return 0}var i=document.createElement("canvas"),b,n=null,o=null,l=new THREE.Matrix4,m,z=new Float32Array(16),y=new Float32Array(16),
u=new Float32Array(16),x=new Float32Array(9),G=new Float32Array(16),H=true,I=new THREE.Color(0),p=0;if(a){if(a.antialias!==undefined)H=a.antialias;a.clearColor!==undefined&&I.setHex(a.clearColor);if(a.clearAlpha!==undefined)p=a.clearAlpha}this.domElement=i;this.autoClear=true;(function(g,h,f){try{b=i.getContext("experimental-webgl",{antialias:g})}catch(j){}if(!b){alert("WebGL not supported");throw"cannot create webgl context";}b.clearColor(0,0,0,1);b.clearDepth(1);b.enable(b.DEPTH_TEST);b.depthFunc(b.LEQUAL);
b.frontFace(b.CCW);b.cullFace(b.BACK);b.enable(b.CULL_FACE);b.enable(b.BLEND);b.blendFunc(b.ONE,b.ONE_MINUS_SRC_ALPHA);b.clearColor(h.r,h.g,h.b,f)})(H,I,p);this.context=b;this.lights={ambient:[0,0,0],directional:{length:0,colors:[],positions:[]},point:{length:0,colors:[],positions:[]}};this.setSize=function(g,h){i.width=g;i.height=h;b.viewport(0,0,i.width,i.height)};this.setClearColor=function(g,h){var f=new THREE.Color(g);b.clearColor(f.r,f.g,f.b,h)};this.clear=function(){b.clear(b.COLOR_BUFFER_BIT|
b.DEPTH_BUFFER_BIT)};this.setupLights=function(g,h){var f,j,s,t=0,k=0,A=0,q,C,r,v=this.lights,D=v.directional.colors,W=v.directional.positions,E=v.point.colors,O=v.point.positions,M=0,J=0;f=0;for(j=h.length;f<j;f++){s=h[f];q=s.color;C=s.position;r=s.intensity;if(s instanceof THREE.AmbientLight){t+=q.r;k+=q.g;A+=q.b}else if(s instanceof THREE.DirectionalLight){D[M*3]=q.r*r;D[M*3+1]=q.g*r;D[M*3+2]=q.b*r;W[M*3]=C.x;W[M*3+1]=C.y;W[M*3+2]=C.z;M+=1}else if(s instanceof THREE.PointLight){E[J*3]=q.r*r;E[J*
3+1]=q.g*r;E[J*3+2]=q.b*r;O[J*3]=C.x;O[J*3+1]=C.y;O[J*3+2]=C.z;J+=1}}v.point.length=J;v.directional.length=M;v.ambient[0]=t;v.ambient[1]=k;v.ambient[2]=A};this.createParticleBuffers=function(g){g.__webGLVertexBuffer=b.createBuffer();g.__webGLParticleBuffer=b.createBuffer()};this.createLineBuffers=function(g){g.__webGLVertexBuffer=b.createBuffer();g.__webGLLineBuffer=b.createBuffer()};this.createMeshBuffers=function(g){g.__webGLVertexBuffer=b.createBuffer();g.__webGLNormalBuffer=b.createBuffer();g.__webGLTangentBuffer=
b.createBuffer();g.__webGLUVBuffer=b.createBuffer();g.__webGLUV2Buffer=b.createBuffer();g.__webGLFaceBuffer=b.createBuffer();g.__webGLLineBuffer=b.createBuffer()};this.initLineBuffers=function(g){var h=g.vertices.length;g.__vertexArray=new Float32Array(h*3);g.__lineArray=new Uint16Array(h);g.__webGLLineCount=h};this.initParticleBuffers=function(g){var h=g.vertices.length;g.__vertexArray=new Float32Array(h*3);g.__particleArray=new Uint16Array(h);g.__webGLParticleCount=h};this.initMeshBuffers=function(g,
h){var f,j,s=0,t=0,k=0,A=h.geometry.faces,q=g.faces;f=0;for(j=q.length;f<j;f++){fi=q[f];face=A[fi];if(face instanceof THREE.Face3){s+=3;t+=1;k+=3}else if(face instanceof THREE.Face4){s+=4;t+=2;k+=4}}g.__vertexArray=new Float32Array(s*3);g.__normalArray=new Float32Array(s*3);g.__tangentArray=new Float32Array(s*4);g.__uvArray=new Float32Array(s*2);g.__uv2Array=new Float32Array(s*2);g.__faceArray=new Uint16Array(t*3);g.__lineArray=new Uint16Array(k*2);s=false;f=0;for(j=h.materials.length;f<j;f++){A=
h.materials[f];if(A instanceof THREE.MeshFaceMaterial){A=0;for(q=g.materials.length;A<q;A++)if(g.materials[A]&&g.materials[A].shading!=undefined&&g.materials[A].shading==THREE.SmoothShading){s=true;break}}else if(A&&A.shading!=undefined&&A.shading==THREE.SmoothShading){s=true;break}if(s)break}g.__needsSmoothNormals=s;g.__webGLFaceCount=t*3;g.__webGLLineCount=k*2};this.setMeshBuffers=function(g,h,f,j,s,t,k,A){var q,C,r,v,D,W,E,O,M,J,S=0,V=0,N=0,K=0,U=0,R=0,w=0,L=0,P=g.__vertexArray,ga=g.__uvArray,
ja=g.__uv2Array,ca=g.__normalArray,$=g.__tangentArray,Y=g.__faceArray,da=g.__lineArray,qa=g.__needsSmoothNormals,la=h.geometry,aa=la.vertices,ra=g.faces,va=la.faces,sa=la.uvs,ea=la.uvs2;h=0;for(q=ra.length;h<q;h++){C=ra[h];r=va[C];W=sa[C];C=ea[C];v=r.vertexNormals;D=r.normal;if(r instanceof THREE.Face3){if(j){E=aa[r.a].position;O=aa[r.b].position;M=aa[r.c].position;P[V]=E.x;P[V+1]=E.y;P[V+2]=E.z;P[V+3]=O.x;P[V+4]=O.y;P[V+5]=O.z;P[V+6]=M.x;P[V+7]=M.y;P[V+8]=M.z;V+=9}if(A&&la.hasTangents){E=aa[r.a].tangent;
O=aa[r.b].tangent;M=aa[r.c].tangent;$[w]=E.x;$[w+1]=E.y;$[w+2]=E.z;$[w+3]=E.w;$[w+4]=O.x;$[w+5]=O.y;$[w+6]=O.z;$[w+7]=O.w;$[w+8]=M.x;$[w+9]=M.y;$[w+10]=M.z;$[w+11]=M.w;w+=12}if(k)if(v.length==3&&qa)for(r=0;r<3;r++){D=v[r];ca[R]=D.x;ca[R+1]=D.y;ca[R+2]=D.z;R+=3}else for(r=0;r<3;r++){ca[R]=D.x;ca[R+1]=D.y;ca[R+2]=D.z;R+=3}if(t&&W)for(r=0;r<3;r++){v=W[r];ga[N]=v.u;ga[N+1]=v.v;N+=2}if(t&&C)for(r=0;r<3;r++){W=C[r];ja[K]=W.u;ja[K+1]=W.v;K+=2}if(s){Y[U]=S;Y[U+1]=S+1;Y[U+2]=S+2;U+=3;da[L]=S;da[L+1]=S+1;da[L+
2]=S;da[L+3]=S+2;da[L+4]=S+1;da[L+5]=S+2;L+=6;S+=3}}else if(r instanceof THREE.Face4){if(j){E=aa[r.a].position;O=aa[r.b].position;M=aa[r.c].position;J=aa[r.d].position;P[V]=E.x;P[V+1]=E.y;P[V+2]=E.z;P[V+3]=O.x;P[V+4]=O.y;P[V+5]=O.z;P[V+6]=M.x;P[V+7]=M.y;P[V+8]=M.z;P[V+9]=J.x;P[V+10]=J.y;P[V+11]=J.z;V+=12}if(A&&la.hasTangents){E=aa[r.a].tangent;O=aa[r.b].tangent;M=aa[r.c].tangent;r=aa[r.d].tangent;$[w]=E.x;$[w+1]=E.y;$[w+2]=E.z;$[w+3]=E.w;$[w+4]=O.x;$[w+5]=O.y;$[w+6]=O.z;$[w+7]=O.w;$[w+8]=M.x;$[w+
9]=M.y;$[w+10]=M.z;$[w+11]=M.w;$[w+12]=r.x;$[w+13]=r.y;$[w+14]=r.z;$[w+15]=r.w;w+=16}if(k)if(v.length==4&&qa)for(r=0;r<4;r++){D=v[r];ca[R]=D.x;ca[R+1]=D.y;ca[R+2]=D.z;R+=3}else for(r=0;r<4;r++){ca[R]=D.x;ca[R+1]=D.y;ca[R+2]=D.z;R+=3}if(t&&W)for(r=0;r<4;r++){v=W[r];ga[N]=v.u;ga[N+1]=v.v;N+=2}if(t&&C)for(r=0;r<4;r++){W=C[r];ja[K]=W.u;ja[K+1]=W.v;K+=2}if(s){Y[U]=S;Y[U+1]=S+1;Y[U+2]=S+2;Y[U+3]=S;Y[U+4]=S+2;Y[U+5]=S+3;U+=6;da[L]=S;da[L+1]=S+1;da[L+2]=S;da[L+3]=S+3;da[L+4]=S+1;da[L+5]=S+2;da[L+6]=S+2;da[L+
7]=S+3;L+=8;S+=4}}}if(j){b.bindBuffer(b.ARRAY_BUFFER,g.__webGLVertexBuffer);b.bufferData(b.ARRAY_BUFFER,P,f)}if(k){b.bindBuffer(b.ARRAY_BUFFER,g.__webGLNormalBuffer);b.bufferData(b.ARRAY_BUFFER,ca,f)}if(A&&la.hasTangents){b.bindBuffer(b.ARRAY_BUFFER,g.__webGLTangentBuffer);b.bufferData(b.ARRAY_BUFFER,$,f)}if(t&&N>0){b.bindBuffer(b.ARRAY_BUFFER,g.__webGLUVBuffer);b.bufferData(b.ARRAY_BUFFER,ga,f)}if(t&&K>0){b.bindBuffer(b.ARRAY_BUFFER,g.__webGLUV2Buffer);b.bufferData(b.ARRAY_BUFFER,ja,f)}if(s){b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,
g.__webGLFaceBuffer);b.bufferData(b.ELEMENT_ARRAY_BUFFER,Y,f);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,g.__webGLLineBuffer);b.bufferData(b.ELEMENT_ARRAY_BUFFER,da,f)}};this.setLineBuffers=function(g,h,f,j){var s,t,k=g.vertices,A=k.length,q=g.__vertexArray,C=g.__lineArray;if(f)for(f=0;f<A;f++){s=k[f].position;t=f*3;q[t]=s.x;q[t+1]=s.y;q[t+2]=s.z}if(j)for(f=0;f<A;f++)C[f]=f;b.bindBuffer(b.ARRAY_BUFFER,g.__webGLVertexBuffer);b.bufferData(b.ARRAY_BUFFER,q,h);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,g.__webGLLineBuffer);
b.bufferData(b.ELEMENT_ARRAY_BUFFER,C,h)};this.setParticleBuffers=function(g,h,f,j){var s,t,k=g.vertices,A=k.length,q=g.__vertexArray,C=g.__particleArray;if(f)for(f=0;f<A;f++){s=k[f].position;t=f*3;q[t]=s.x;q[t+1]=s.y;q[t+2]=s.z}if(j)for(f=0;f<A;f++)C[f]=f;b.bindBuffer(b.ARRAY_BUFFER,g.__webGLVertexBuffer);b.bufferData(b.ARRAY_BUFFER,q,h);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,g.__webGLParticleBuffer);b.bufferData(b.ELEMENT_ARRAY_BUFFER,C,h)};this.initMaterial=function(g,h,f){if(!g.program){var j,s;
if(g instanceof THREE.MeshDepthMaterial)c(g,THREE.ShaderLib.depth);else if(g instanceof THREE.MeshNormalMaterial)c(g,THREE.ShaderLib.normal);else if(g instanceof THREE.MeshBasicMaterial)c(g,THREE.ShaderLib.basic);else if(g instanceof THREE.MeshLambertMaterial)c(g,THREE.ShaderLib.lambert);else if(g instanceof THREE.MeshPhongMaterial)c(g,THREE.ShaderLib.phong);else if(g instanceof THREE.LineBasicMaterial)c(g,THREE.ShaderLib.basic);else g instanceof THREE.ParticleBasicMaterial&&c(g,THREE.ShaderLib.particle_basic);
var t,k,A,q;s=A=q=0;for(t=h.length;s<t;s++){k=h[s];k instanceof THREE.DirectionalLight&&A++;k instanceof THREE.PointLight&&q++}if(q+A<=4){h=A;q=q}else{h=Math.ceil(4*A/(q+A));q=4-h}s={directional:h,point:q};q=g.fragment_shader;h=g.vertex_shader;t={fog:f,map:g.map,env_map:g.env_map,light_map:g.light_map,maxDirLights:s.directional,maxPointLights:s.point};f=b.createProgram();s=["#ifdef GL_ES\nprecision highp float;\n#endif","#define MAX_DIR_LIGHTS "+t.maxDirLights,"#define MAX_POINT_LIGHTS "+t.maxPointLights,
t.fog?"#define USE_FOG":"",t.fog instanceof THREE.FogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.env_map?"#define USE_ENVMAP":"",t.light_map?"#define USE_LIGHTMAP":"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n");t=[b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS)>0?"#define VERTEX_TEXTURES":"","#define MAX_DIR_LIGHTS "+t.maxDirLights,"#define MAX_POINT_LIGHTS "+t.maxPointLights,t.map?"#define USE_MAP":"",t.env_map?"#define USE_ENVMAP":"",t.light_map?"#define USE_LIGHTMAP":
"","uniform mat4 objectMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n"].join("\n");b.attachShader(f,d("fragment",s+q));b.attachShader(f,d("vertex",t+h));b.linkProgram(f);b.getProgramParameter(f,b.LINK_STATUS)||alert("Could not initialise shaders\nVALIDATE_STATUS: "+b.getProgramParameter(f,b.VALIDATE_STATUS)+
", gl error ["+b.getError()+"]");f.uniforms={};f.attributes={};g.program=f;f=["viewMatrix","modelViewMatrix","projectionMatrix","normalMatrix","objectMatrix","cameraPosition"];for(j in g.uniforms)f.push(j);j=g.program;q=0;for(h=f.length;q<h;q++){s=f[q];j.uniforms[s]=b.getUniformLocation(j,s)}g=g.program;j=["position","normal","uv","uv2","tangent"];f=0;for(q=j.length;f<q;f++){h=j[f];g.attributes[h]=b.getAttribLocation(g,h)}}};this.renderBuffer=function(g,h,f,j,s,t){var k;this.initMaterial(j,h,f);k=
j.program;if(k!=n){b.useProgram(k);n=k}this.loadCamera(k,g);this.loadMatrices(k);if(j instanceof THREE.MeshPhongMaterial||j instanceof THREE.MeshLambertMaterial){this.setupLights(k,h);h=this.lights;j.uniforms.enableLighting.value=h.directional.length+h.point.length;j.uniforms.ambientLightColor.value=h.ambient;j.uniforms.directionalLightColor.value=h.directional.colors;j.uniforms.directionalLightDirection.value=h.directional.positions;j.uniforms.pointLightColor.value=h.point.colors;j.uniforms.pointLightPosition.value=
h.point.positions}if(j instanceof THREE.MeshBasicMaterial||j instanceof THREE.MeshLambertMaterial||j instanceof THREE.MeshPhongMaterial){j.uniforms.color.value.setRGB(j.color.r*j.opacity,j.color.g*j.opacity,j.color.b*j.opacity);j.uniforms.opacity.value=j.opacity;j.uniforms.map.texture=j.map;j.uniforms.light_map.texture=j.light_map;j.uniforms.env_map.texture=j.env_map;j.uniforms.reflectivity.value=j.reflectivity;j.uniforms.refraction_ratio.value=j.refraction_ratio;j.uniforms.combine.value=j.combine;
j.uniforms.useRefract.value=j.env_map&&j.env_map.mapping instanceof THREE.CubeRefractionMapping;if(f){j.uniforms.fogColor.value.setHex(f.color.hex);if(f instanceof THREE.Fog){j.uniforms.fogNear.value=f.near;j.uniforms.fogFar.value=f.far}else if(f instanceof THREE.FogExp2)j.uniforms.fogDensity.value=f.density}}if(j instanceof THREE.LineBasicMaterial){j.uniforms.color.value.setRGB(j.color.r*j.opacity,j.color.g*j.opacity,j.color.b*j.opacity);j.uniforms.opacity.value=j.opacity;if(f){j.uniforms.fogColor.value.setHex(f.color.hex);
if(f instanceof THREE.Fog){j.uniforms.fogNear.value=f.near;j.uniforms.fogFar.value=f.far}else if(f instanceof THREE.FogExp2)j.uniforms.fogDensity.value=f.density}}if(j instanceof THREE.ParticleBasicMaterial){j.uniforms.color.value.setRGB(j.color.r*j.opacity,j.color.g*j.opacity,j.color.b*j.opacity);j.uniforms.opacity.value=j.opacity;j.uniforms.size.value=j.size;j.uniforms.map.texture=j.map;if(f){j.uniforms.fogColor.value.setHex(f.color.hex);if(f instanceof THREE.Fog){j.uniforms.fogNear.value=f.near;
j.uniforms.fogFar.value=f.far}else if(f instanceof THREE.FogExp2)j.uniforms.fogDensity.value=f.density}}if(j instanceof THREE.MeshPhongMaterial){j.uniforms.ambient.value.setRGB(j.ambient.r,j.ambient.g,j.ambient.b);j.uniforms.specular.value.setRGB(j.specular.r,j.specular.g,j.specular.b);j.uniforms.shininess.value=j.shininess}if(j instanceof THREE.MeshDepthMaterial){j.uniforms.mNear.value=g.near;j.uniforms.mFar.value=g.far}g=j.uniforms;var A,q,C;for(A in g)if(C=k.uniforms[A]){h=g[A];q=h.type;f=h.value;
if(q=="i")b.uniform1i(C,f);else if(q=="f")b.uniform1f(C,f);else if(q=="fv1")b.uniform1fv(C,f);else if(q=="fv")b.uniform3fv(C,f);else if(q=="v2")b.uniform2f(C,f.x,f.y);else if(q=="v3")b.uniform3f(C,f.x,f.y,f.z);else if(q=="c")b.uniform3f(C,f.r,f.g,f.b);else if(q=="t"){b.uniform1i(C,f);if(h=h.texture)if(h.image instanceof Array&&h.image.length==6){h=h;f=f;if(h.image.length==6){if(!h.image.__webGLTextureCube&&!h.image.__cubeMapInitialized&&h.image.loadCount==6){h.image.__webGLTextureCube=b.createTexture();
b.bindTexture(b.TEXTURE_CUBE_MAP,h.image.__webGLTextureCube);b.texParameteri(b.TEXTURE_CUBE_MAP,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_CUBE_MAP,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_CUBE_MAP,b.TEXTURE_MAG_FILTER,b.LINEAR);b.texParameteri(b.TEXTURE_CUBE_MAP,b.TEXTURE_MIN_FILTER,b.LINEAR_MIPMAP_LINEAR);for(q=0;q<6;++q)b.texImage2D(b.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,b.RGBA,b.RGBA,b.UNSIGNED_BYTE,h.image[q]);b.generateMipmap(b.TEXTURE_CUBE_MAP);b.bindTexture(b.TEXTURE_CUBE_MAP,
null);h.image.__cubeMapInitialized=true}b.activeTexture(b.TEXTURE0+f);b.bindTexture(b.TEXTURE_CUBE_MAP,h.image.__webGLTextureCube)}}else{h=h;f=f;if(!h.__webGLTexture&&h.image.loaded){h.__webGLTexture=b.createTexture();b.bindTexture(b.TEXTURE_2D,h.__webGLTexture);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,b.RGBA,b.UNSIGNED_BYTE,h.image);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,e(h.wrap_s));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,e(h.wrap_t));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,e(h.mag_filter));
b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,e(h.min_filter));b.generateMipmap(b.TEXTURE_2D);b.bindTexture(b.TEXTURE_2D,null)}b.activeTexture(b.TEXTURE0+f);b.bindTexture(b.TEXTURE_2D,h.__webGLTexture)}}}k=k.attributes;b.bindBuffer(b.ARRAY_BUFFER,s.__webGLVertexBuffer);b.vertexAttribPointer(k.position,3,b.FLOAT,false,0,0);b.enableVertexAttribArray(k.position);if(k.normal>=0){b.bindBuffer(b.ARRAY_BUFFER,s.__webGLNormalBuffer);b.vertexAttribPointer(k.normal,3,b.FLOAT,false,0,0);b.enableVertexAttribArray(k.normal)}if(k.tangent>=
0){b.bindBuffer(b.ARRAY_BUFFER,s.__webGLTangentBuffer);b.vertexAttribPointer(k.tangent,4,b.FLOAT,false,0,0);b.enableVertexAttribArray(k.tangent)}if(k.uv>=0)if(s.__webGLUVBuffer){b.bindBuffer(b.ARRAY_BUFFER,s.__webGLUVBuffer);b.vertexAttribPointer(k.uv,2,b.FLOAT,false,0,0);b.enableVertexAttribArray(k.uv)}else b.disableVertexAttribArray(k.uv);if(k.uv2>=0)if(s.__webGLUV2Buffer){b.bindBuffer(b.ARRAY_BUFFER,s.__webGLUV2Buffer);b.vertexAttribPointer(k.uv2,2,b.FLOAT,false,0,0);b.enableVertexAttribArray(k.uv2)}else b.disableVertexAttribArray(k.uv2);
if(j.wireframe||j instanceof THREE.LineBasicMaterial){k=j.wireframe_linewidth!==undefined?j.wireframe_linewidth:j.linewidth!==undefined?j.linewidth:1;j=j instanceof THREE.LineBasicMaterial&&t.type==THREE.LineStrip?b.LINE_STRIP:b.LINES;b.lineWidth(k);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,s.__webGLLineBuffer);b.drawElements(j,s.__webGLLineCount,b.UNSIGNED_SHORT,0)}else if(j instanceof THREE.ParticleBasicMaterial){b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,s.__webGLParticleBuffer);b.drawElements(b.POINTS,s.__webGLParticleCount,
b.UNSIGNED_SHORT,0)}else{b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,s.__webGLFaceBuffer);b.drawElements(b.TRIANGLES,s.__webGLFaceCount,b.UNSIGNED_SHORT,0)}};this.renderPass=function(g,h,f,j,s,t,k){var A,q,C,r,v;C=0;for(r=j.materials.length;C<r;C++){A=j.materials[C];if(A instanceof THREE.MeshFaceMaterial){A=0;for(q=s.materials.length;A<q;A++)if((v=s.materials[A])&&v.blending==t&&v.opacity<1==k){this.setBlending(v.blending);this.renderBuffer(g,h,f,v,s,j)}}else if((v=A)&&v.blending==t&&v.opacity<1==k){this.setBlending(v.blending);
this.renderBuffer(g,h,f,v,s,j)}}};this.render=function(g,h,f,j){var s,t,k,A=g.lights,q=g.fog;this.initWebGLObjects(g);j=j!==undefined?j:true;if(f&&!f.__webGLFramebuffer){f.__webGLFramebuffer=b.createFramebuffer();f.__webGLRenderbuffer=b.createRenderbuffer();f.__webGLTexture=b.createTexture();b.bindRenderbuffer(b.RENDERBUFFER,f.__webGLRenderbuffer);b.renderbufferStorage(b.RENDERBUFFER,b.DEPTH_COMPONENT16,f.width,f.height);b.bindTexture(b.TEXTURE_2D,f.__webGLTexture);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,
e(f.wrap_s));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,e(f.wrap_t));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,e(f.mag_filter));b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,e(f.min_filter));b.texImage2D(b.TEXTURE_2D,0,e(f.format),f.width,f.height,0,e(f.format),e(f.type),null);b.bindFramebuffer(b.FRAMEBUFFER,f.__webGLFramebuffer);b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,f.__webGLTexture,0);b.framebufferRenderbuffer(b.FRAMEBUFFER,b.DEPTH_ATTACHMENT,b.RENDERBUFFER,
f.__webGLRenderbuffer);b.bindTexture(b.TEXTURE_2D,null);b.bindRenderbuffer(b.RENDERBUFFER,null);b.bindFramebuffer(b.FRAMEBUFFER,null)}if(f){s=f.__webGLFramebuffer;k=f.width;t=f.height}else{s=null;k=i.width;t=i.height}if(s!=o){b.bindFramebuffer(b.FRAMEBUFFER,s);b.viewport(0,0,k,t);j&&b.clear(b.COLOR_BUFFER_BIT|b.DEPTH_BUFFER_BIT);o=s}this.autoClear&&this.clear();h.autoUpdateMatrix&&h.updateMatrix();z.set(h.matrix.flatten());u.set(h.projectionMatrix.flatten());j=0;for(s=g.__webGLObjects.length;j<s;j++){t=
g.__webGLObjects[j];k=t.object;t=t.buffer;if(k.visible){this.setupMatrices(k,h);this.renderPass(h,A,q,k,t,THREE.NormalBlending,false)}}j=0;for(s=g.__webGLObjects.length;j<s;j++){t=g.__webGLObjects[j];k=t.object;t=t.buffer;if(k.visible){this.setupMatrices(k,h);if(k.doubleSided)b.disable(b.CULL_FACE);else{b.enable(b.CULL_FACE);k.flipSided?b.frontFace(b.CW):b.frontFace(b.CCW)}this.renderPass(h,A,q,k,t,THREE.AdditiveBlending,false);this.renderPass(h,A,q,k,t,THREE.SubtractiveBlending,false);this.renderPass(h,
A,q,k,t,THREE.AdditiveBlending,true);this.renderPass(h,A,q,k,t,THREE.SubtractiveBlending,true);this.renderPass(h,A,q,k,t,THREE.NormalBlending,true)}}if(f&&f.min_filter!==THREE.NearestFilter&&f.min_filter!==THREE.LinearFilter){b.bindTexture(b.TEXTURE_2D,f.__webGLTexture);b.generateMipmap(b.TEXTURE_2D);b.bindTexture(b.TEXTURE_2D,null)}};this.initWebGLObjects=function(g){function h(C,r,v,D){if(C[r]==undefined){g.__webGLObjects.push({buffer:v,object:D});C[r]=1}}var f,j,s,t,k,A,q;if(!g.__webGLObjects){g.__webGLObjects=
[];g.__webGLObjectsMap={}}f=0;for(j=g.objects.length;f<j;f++){s=g.objects[f];k=s.geometry;if(g.__webGLObjectsMap[s.id]==undefined)g.__webGLObjectsMap[s.id]={};q=g.__webGLObjectsMap[s.id];if(s instanceof THREE.Mesh){for(t in k.geometryChunks){A=k.geometryChunks[t];if(!A.__webGLVertexBuffer){this.createMeshBuffers(A);this.initMeshBuffers(A,s);k.__dirtyVertices=true;k.__dirtyElements=true;k.__dirtyUvs=true;k.__dirtyNormals=true;k.__dirtyTangents=true}if(k.__dirtyVertices||k.__dirtyElements||k.__dirtyUvs)this.setMeshBuffers(A,
s,b.DYNAMIC_DRAW,k.__dirtyVertices,k.__dirtyElements,k.__dirtyUvs,k.__dirtyNormals,k.__dirtyTangents);h(q,t,A,s)}k.__dirtyVertices=false;k.__dirtyElements=false;k.__dirtyUvs=false;k.__dirtyNormals=false;k.__dirtyTangents=false}else if(s instanceof THREE.Line){if(!k.__webGLVertexBuffer){this.createLineBuffers(k);this.initLineBuffers(k);k.__dirtyVertices=true;k.__dirtyElements=true}k.__dirtyVertices&&this.setLineBuffers(k,b.DYNAMIC_DRAW,k.__dirtyVertices,k.__dirtyElements);h(q,0,k,s);k.__dirtyVertices=
false;k.__dirtyElements=false}else if(s instanceof THREE.ParticleSystem){if(!k.__webGLVertexBuffer){this.createParticleBuffers(k);this.initParticleBuffers(k);k.__dirtyVertices=true;k.__dirtyElements=true}k.__dirtyVertices&&this.setParticleBuffers(k,b.DYNAMIC_DRAW,k.__dirtyVertices,k.__dirtyElements);h(q,0,k,s);k.__dirtyVertices=false;k.__dirtyElements=false}}};this.removeObject=function(g,h){var f,j;for(f=g.__webGLObjects.length-1;f>=0;f--){j=g.__webGLObjects[f].object;h==j&&g.__webGLObjects.splice(f,
1)}};this.setupMatrices=function(g,h){g.autoUpdateMatrix&&g.updateMatrix();l.multiply(h.matrix,g.matrix);y.set(l.flatten());m=THREE.Matrix4.makeInvert3x3(l).transpose();x.set(m.m);G.set(g.matrix.flatten())};this.loadMatrices=function(g){b.uniformMatrix4fv(g.uniforms.viewMatrix,false,z);b.uniformMatrix4fv(g.uniforms.modelViewMatrix,false,y);b.uniformMatrix4fv(g.uniforms.projectionMatrix,false,u);b.uniformMatrix3fv(g.uniforms.normalMatrix,false,x);b.uniformMatrix4fv(g.uniforms.objectMatrix,false,G)};
this.loadCamera=function(g,h){b.uniform3f(g.uniforms.cameraPosition,h.position.x,h.position.y,h.position.z)};this.setBlending=function(g){switch(g){case THREE.AdditiveBlending:b.blendEquation(b.FUNC_ADD);b.blendFunc(b.ONE,b.ONE);break;case THREE.SubtractiveBlending:b.blendFunc(b.DST_COLOR,b.ZERO);break;default:b.blendEquation(b.FUNC_ADD);b.blendFunc(b.ONE,b.ONE_MINUS_SRC_ALPHA)}};this.setFaceCulling=function(g,h){if(g){!h||h=="ccw"?b.frontFace(b.CCW):b.frontFace(b.CW);if(g=="back")b.cullFace(b.BACK);
else g=="front"?b.cullFace(b.FRONT):b.cullFace(b.FRONT_AND_BACK);b.enable(b.CULL_FACE)}else b.disable(b.CULL_FACE)};this.supportsVertexTextures=function(){return b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS)>0}};
THREE.Snippets={fog_pars_fragment:"#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#endif",fog_fragment:"#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, 1.0 ), fogFactor );\n#endif",envmap_pars_fragment:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float reflectivity;\nuniform samplerCube env_map;\nuniform int combine;\n#endif",
envmap_fragment:"#ifdef USE_ENVMAP\ncubeColor = textureCube( env_map, vec3( -vReflect.x, vReflect.yz ) );\nif ( combine == 1 ) {\ngl_FragColor = mix( gl_FragColor, cubeColor, reflectivity );\n} else {\ngl_FragColor = gl_FragColor * cubeColor;\n}\n#endif",envmap_pars_vertex:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float refraction_ratio;\nuniform bool useRefract;\n#endif",envmap_vertex:"#ifdef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal;\nif ( useRefract ) {\nvReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refraction_ratio );\n} else {\nvReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );\n}\n#endif",
map_particle_pars_fragment:"#ifdef USE_MAP\nuniform sampler2D map;\n#endif",map_particle_fragment:"#ifdef USE_MAP\nmapColor = texture2D( map, gl_PointCoord );\n#endif",map_pars_fragment:"#ifdef USE_MAP\nvarying vec2 vUv;\nuniform sampler2D map;\n#endif",map_pars_vertex:"#ifdef USE_MAP\nvarying vec2 vUv;\n#endif",map_fragment:"#ifdef USE_MAP\nmapColor = texture2D( map, vUv );\n#endif",map_vertex:"#ifdef USE_MAP\nvUv = uv;\n#endif",lightmap_pars_fragment:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\nuniform sampler2D light_map;\n#endif",
lightmap_pars_vertex:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\n#endif",lightmap_fragment:"#ifdef USE_LIGHTMAP\nlightmapColor = texture2D( light_map, vUv2 );\n#endif",lightmap_vertex:"#ifdef USE_LIGHTMAP\nvUv2 = uv2;\n#endif",lights_pars_vertex:"uniform bool enableLighting;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n#ifdef PHONG\nvarying vec3 vPointLightVector[ MAX_POINT_LIGHTS ];\n#endif\n#endif",
lights_vertex:"if ( !enableLighting ) {\nvLightWeighting = vec3( 1.0 );\n} else {\nvLightWeighting = ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nfloat directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );\nvLightWeighting += directionalLightColor[ i ] * directionalLightWeighting;\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 pointLightVector = normalize( lPosition.xyz - mvPosition.xyz );\nfloat pointLightWeighting = max( dot( transformedNormal, pointLightVector ), 0.0 );\nvLightWeighting += pointLightColor[ i ] * pointLightWeighting;\n#ifdef PHONG\nvPointLightVector[ i ] = pointLightVector;\n#endif\n}\n#endif\n}",
lights_pars_fragment:"#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nvarying vec3 vPointLightVector[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",lights_fragment:"vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\nvec4 mSpecular = vec4( specular, opacity );\n#if MAX_POINT_LIGHTS > 0\nvec4 pointDiffuse  = vec4( 0.0 );\nvec4 pointSpecular = vec4( 0.0 );\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec3 pointVector = normalize( vPointLightVector[ i ] );\nvec3 pointHalfVector = normalize( vPointLightVector[ i ] + vViewPosition );\nfloat pointDotNormalHalf = dot( normal, pointHalfVector );\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\nfloat pointSpecularWeight = 0.0;\nif ( pointDotNormalHalf >= 0.0 )\npointSpecularWeight = pow( pointDotNormalHalf, shininess );\npointDiffuse  += mColor * pointDiffuseWeight;\npointSpecular += mSpecular * pointSpecularWeight;\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec4 dirDiffuse  = vec4( 0.0 );\nvec4 dirSpecular = vec4( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nvec3 dirHalfVector = normalize( lDirection.xyz + vViewPosition );\nfloat dirDotNormalHalf = dot( normal, dirHalfVector );\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\nfloat dirSpecularWeight = 0.0;\nif ( dirDotNormalHalf >= 0.0 )\ndirSpecularWeight = pow( dirDotNormalHalf, shininess );\ndirDiffuse  += mColor * dirDiffuseWeight;\ndirSpecular += mSpecular * dirSpecularWeight;\n}\n#endif\nvec4 totalLight = vec4( ambient, opacity );\n#if MAX_DIR_LIGHTS > 0\ntotalLight += dirDiffuse + dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalLight += pointDiffuse + pointSpecular;\n#endif"};
THREE.UniformsLib={common:{color:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},map:{type:"t",value:0,texture:null},light_map:{type:"t",value:2,texture:null},env_map:{type:"t",value:1,texture:null},useRefract:{type:"i",value:0},reflectivity:{type:"f",value:1},refraction_ratio:{type:"f",value:0.98},combine:{type:"i",value:0},fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},lights:{enableLighting:{type:"i",
value:1},ambientLightColor:{type:"fv",value:[]},directionalLightDirection:{type:"fv",value:[]},directionalLightColor:{type:"fv",value:[]},pointLightPosition:{type:"fv",value:[]},pointLightColor:{type:"fv",value:[]}},particle:{color:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},size:{type:"f",value:1},map:{type:"t",value:0,texture:null},fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}}};
THREE.ShaderLib={depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2E3}},fragment_shader:"uniform float mNear;\nuniform float mFar;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), 1.0 );\n}",vertex_shader:"void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}"},normal:{uniforms:{},fragment_shader:"varying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, 1.0 );\n}",
vertex_shader:"varying vec3 vNormal;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalize( normalMatrix * normal );\ngl_Position = projectionMatrix * mvPosition;\n}"},basic:{uniforms:THREE.UniformsLib.common,fragment_shader:["uniform vec3 color;\nuniform float opacity;",THREE.Snippets.map_pars_fragment,THREE.Snippets.lightmap_pars_fragment,THREE.Snippets.envmap_pars_fragment,THREE.Snippets.fog_pars_fragment,"void main() {\nvec4 mColor = vec4( color, opacity );\nvec4 mapColor = vec4( 1.0 );\nvec4 lightmapColor = vec4( 1.0 );\nvec4 cubeColor = vec4( 1.0 );",
THREE.Snippets.map_fragment,THREE.Snippets.lightmap_fragment,"gl_FragColor = mColor * mapColor * lightmapColor;",THREE.Snippets.envmap_fragment,THREE.Snippets.fog_fragment,"}"].join("\n"),vertex_shader:[THREE.Snippets.map_pars_vertex,THREE.Snippets.lightmap_pars_vertex,THREE.Snippets.envmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.Snippets.map_vertex,THREE.Snippets.lightmap_vertex,THREE.Snippets.envmap_vertex,"gl_Position = projectionMatrix * mvPosition;\n}"].join("\n")},
lambert:{uniforms:Uniforms.merge([THREE.UniformsLib.common,THREE.UniformsLib.lights]),fragment_shader:["uniform vec3 color;\nuniform float opacity;\nvarying vec3 vLightWeighting;",THREE.Snippets.map_pars_fragment,THREE.Snippets.lightmap_pars_fragment,THREE.Snippets.envmap_pars_fragment,THREE.Snippets.fog_pars_fragment,"void main() {\nvec4 mColor = vec4( color, opacity );\nvec4 mapColor = vec4( 1.0 );\nvec4 lightmapColor = vec4( 1.0 );\nvec4 cubeColor = vec4( 1.0 );",THREE.Snippets.map_fragment,THREE.Snippets.lightmap_fragment,
"gl_FragColor =  mColor * mapColor * lightmapColor * vec4( vLightWeighting, 1.0 );",THREE.Snippets.envmap_fragment,THREE.Snippets.fog_fragment,"}"].join("\n"),vertex_shader:["varying vec3 vLightWeighting;",THREE.Snippets.map_pars_vertex,THREE.Snippets.lightmap_pars_vertex,THREE.Snippets.envmap_pars_vertex,THREE.Snippets.lights_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.Snippets.map_vertex,THREE.Snippets.lightmap_vertex,THREE.Snippets.envmap_vertex,
"vec3 transformedNormal = normalize( normalMatrix * normal );",THREE.Snippets.lights_vertex,"gl_Position = projectionMatrix * mvPosition;\n}"].join("\n")},phong:{uniforms:Uniforms.merge([THREE.UniformsLib.common,THREE.UniformsLib.lights,{ambient:{type:"c",value:new THREE.Color(328965)},specular:{type:"c",value:new THREE.Color(1118481)},shininess:{type:"f",value:30}}]),fragment_shader:["uniform vec3 color;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 specular;\nuniform float shininess;\nvarying vec3 vLightWeighting;",
THREE.Snippets.map_pars_fragment,THREE.Snippets.lightmap_pars_fragment,THREE.Snippets.envmap_pars_fragment,THREE.Snippets.fog_pars_fragment,THREE.Snippets.lights_pars_fragment,"void main() {\nvec4 mColor = vec4( color, opacity );\nvec4 mapColor = vec4( 1.0 );\nvec4 lightmapColor = vec4( 1.0 );\nvec4 cubeColor = vec4( 1.0 );",THREE.Snippets.map_fragment,THREE.Snippets.lights_fragment,THREE.Snippets.lightmap_fragment,"gl_FragColor =  mapColor * lightmapColor * totalLight * vec4( vLightWeighting, 1.0 );",
THREE.Snippets.envmap_fragment,THREE.Snippets.fog_fragment,"}"].join("\n"),vertex_shader:["#define PHONG\nvarying vec3 vLightWeighting;\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",THREE.Snippets.map_pars_vertex,THREE.Snippets.lightmap_pars_vertex,THREE.Snippets.envmap_pars_vertex,THREE.Snippets.lights_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.Snippets.map_vertex,THREE.Snippets.lightmap_vertex,THREE.Snippets.envmap_vertex,"#ifndef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\n#endif\nvViewPosition = cameraPosition - mPosition.xyz;\nvec3 transformedNormal = normalize( normalMatrix * normal );\nvNormal = transformedNormal;",
THREE.Snippets.lights_vertex,"gl_Position = projectionMatrix * mvPosition;\n}"].join("\n")},particle_basic:{uniforms:THREE.UniformsLib.particle,fragment_shader:["uniform vec3 color;\nuniform float opacity;",THREE.Snippets.map_particle_pars_fragment,THREE.Snippets.fog_pars_fragment,"void main() {\nvec4 mColor = vec4( color, opacity );\nvec4 mapColor = vec4( 1.0 );",THREE.Snippets.map_particle_fragment,"gl_FragColor = mColor * mapColor;",THREE.Snippets.fog_fragment,"}"].join("\n"),vertex_shader:"uniform float size;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\ngl_Position = projectionMatrix * mvPosition;\ngl_PointSize = size;\n}"}};
THREE.RenderableObject=function(){this.z=this.object=null};THREE.RenderableFace3=function(){this.z=null;this.v1=new THREE.Vertex;this.v2=new THREE.Vertex;this.v3=new THREE.Vertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[];this.faceMaterials=this.meshMaterials=null;this.overdraw=false;this.uvs=[null,null,null]};
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

  Environment.prototype.probiere = function(fn) {
    var clone = this.clone();
    try {
      return fn();
    } catch(exc) {
      this.copy(clone);
      this._fireEvent('complete-change');
    }
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

    each(['istWand', 'schritt', 'linksDrehen', 'rechtsDrehen', 'hinlegen', 'aufheben', 'istZiegel', 'markeSetzen', 'markeLoeschen', 'istMarke', 'istNorden', 'istSueden', 'istWesten', 'istOsten', 'ton', 'probiere'], function(name) {
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
  EnvironmentView3D.GH = 22; // Grid Height

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
      var cube = new T.Mesh(new Cube(GW, GW, 2*GH, 1, 1), new T.MeshLambertMaterial({ color: ENVIRONMENT_COLORS.quader.hex, shading: T.FlatShading }));
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


  /*
   * Controller
   */

  function AppController() {
    this.initModelAndView();
    this.initEditor();
    this.loadExampleCode();
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
      self.editor.gotoLine(lineNumber);
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

  AppController.prototype.initEditor = function() {
    var e = this.editor = ace.edit($('editor'));
    var s = e.getSession();
    e.setTheme('ace/theme/textmate');
    s.setMode(new (require('ace/mode/javascript').Mode));
    s.setTabSize(2);
    s.setUseSoftTabs(true);
    e.setShowPrintMargin(false);
  };

  AppController.prototype.loadExampleCode = function() {
    var s = this.editor.getSession();
    get('examples/conways_game_of_life.js', bind(s.setValue, s));
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
    this.environment.run(this.editor.getSession().getValue());
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
