(()=>{"use strict";const t=new Uint8Array(128);for(let n=0;n<83;n++)t["0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~".charCodeAt(n)]=n;const n=(n,r,o)=>{let e=0;for(;r<o;)e*=83,e+=t[n.charCodeAt(r++)];return e},r=Math.pow,o=Math.PI,e=2*o,a=3294.6,c=269.025,f=t=>t>10.31475?r(t/c+.052132,2.4):t/a,s=t=>~~(t>1227e-8?c*r(t,.416666)-13.025:t*a+1),u=t=>(t<0?-1:1)*t*t,l=t=>{for(t+=o/2;t>o;)t-=e;const n=1.27323954*t-.405284735*u(t);return.225*(u(n)-n)+n};const d=document.getElementById("blurhash"),i=document.getElementById("canvas").getContext("2d");function m(){const t=d.value;if(!t)return;const r=function(t,r,e,a){const c=n(t,0,1),d=c%9+1,i=1+~~(c/9),m=d*i;let w=0,y=0,A=0,h=0,g=0,I=0,p=0,C=0,v=0,E=0,F=0,B=0;const D=(n(t,1,2)+1)/13446*(1|a),M=new Float64Array(3*m),U=function(t){const r=n(t,2,6);return[r>>16,r>>8&255,255&r]}(t);for(w=0;w<3;w++)M[w]=f(U[w]);for(w=1;w<m;w++)B=n(t,4+2*w,6+2*w),M[3*w]=u(~~(B/361)-9)*D,M[3*w+1]=u(~~(B/19)%19-9)*D,M[3*w+2]=u(B%19-9)*D;const b=new Float64Array(i*e),x=new Float64Array(d*r);for(y=0;y<i;y++)for(h=0;h<e;h++)b[y*e+h]=l(o*h*y/e);for(w=0;w<d;w++)for(A=0;A<r;A++)x[w*r+A]=l(o*A*w/r);const L=4*r,P=new Uint8ClampedArray(L*e);for(h=0;h<e;h++)for(A=0;A<r;A++){for(g=I=p=0,y=0;y<i;y++)for(v=b[y*e+h],w=0;w<d;w++)C=x[w*r+A]*v,E=3*(w+y*d),g+=M[E]*C,I+=M[E+1]*C,p+=M[E+2]*C;F=4*A+h*L,P[F]=s(g),P[F+1]=s(I),P[F+2]=s(p),P[F+3]=255}return P}(t,32,32),e=new ImageData(r,32,32);i.putImageData(e,0,0)}d.addEventListener("input",m),m()})();