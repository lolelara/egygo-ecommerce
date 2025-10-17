/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Cf="176",fs={ROTATE:0,DOLLY:1,PAN:2},ds={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ug=0,_d=1,Ng=2,_p=1,Bg=2,ki=3,xr=0,An=1,Gi=2,pr=0,Us=1,vd=2,xd=3,Sd=4,zg=5,Br=100,kg=101,Vg=102,Hg=103,Gg=104,Wg=200,Xg=201,qg=202,Yg=203,su=204,au=205,$g=206,jg=207,Zg=208,Kg=209,Jg=210,Qg=211,e_=212,t_=213,n_=214,ou=0,lu=1,cu=2,Ws=3,uu=4,fu=5,du=6,hu=7,Af=0,i_=1,r_=2,mr=0,s_=1,a_=2,o_=3,l_=4,c_=5,u_=6,f_=7,vp=300,Xs=301,qs=302,pu=303,mu=304,Gl=306,gu=1e3,kr=1001,_u=1002,_i=1003,d_=1004,po=1005,Ti=1006,Ql=1007,Vr=1008,wi=1009,xp=1010,Sp=1011,Wa=1012,wf=1013,Qr=1014,Xi=1015,lo=1016,Rf=1017,Pf=1018,Xa=1020,yp=35902,Mp=1021,Ep=1022,mi=1023,qa=1026,Ya=1027,Tp=1028,Lf=1029,bp=1030,Ff=1031,If=1033,sl=33776,al=33777,ol=33778,ll=33779,vu=35840,xu=35841,Su=35842,yu=35843,Mu=36196,Eu=37492,Tu=37496,bu=37808,Du=37809,Cu=37810,Au=37811,wu=37812,Ru=37813,Pu=37814,Lu=37815,Fu=37816,Iu=37817,Ou=37818,Uu=37819,Nu=37820,Bu=37821,cl=36492,zu=36494,ku=36495,Dp=36283,Vu=36284,Hu=36285,Gu=36286,h_=3200,p_=3201,Cp=0,m_=1,or="",ti="srgb",Ys="srgb-linear",Tl="linear",vt="srgb",hs=7680,yd=519,g_=512,__=513,v_=514,Ap=515,x_=516,S_=517,y_=518,M_=519,Md=35044,Ed="300 es",qi=2e3,bl=2001;let ia=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const r=n[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}};const an=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ec=Math.PI/180,Wu=180/Math.PI;function ra(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(an[i&255]+an[i>>8&255]+an[i>>16&255]+an[i>>24&255]+"-"+an[e&255]+an[e>>8&255]+"-"+an[e>>16&15|64]+an[e>>24&255]+"-"+an[t&63|128]+an[t>>8&255]+"-"+an[t>>16&255]+an[t>>24&255]+an[n&255]+an[n>>8&255]+an[n>>16&255]+an[n>>24&255]).toLowerCase()}function rt(i,e,t){return Math.max(e,Math.min(t,i))}function E_(i,e){return(i%e+e)%e}function tc(i,e,t){return(1-t)*i+t*e}function oa(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Dn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class ge{constructor(e=0,t=0){ge.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class tt{constructor(e,t,n,r,s,a,o,l,c){tt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],f=n[7],h=n[2],d=n[5],g=n[8],_=r[0],m=r[3],p=r[6],S=r[1],v=r[4],x=r[7],C=r[2],D=r[5],T=r[8];return s[0]=a*_+o*S+l*C,s[3]=a*m+o*v+l*D,s[6]=a*p+o*x+l*T,s[1]=c*_+u*S+f*C,s[4]=c*m+u*v+f*D,s[7]=c*p+u*x+f*T,s[2]=h*_+d*S+g*C,s[5]=h*m+d*v+g*D,s[8]=h*p+d*x+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,h=o*l-u*s,d=c*s-a*l,g=t*f+n*h+r*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=f*_,e[1]=(r*c-u*n)*_,e[2]=(o*n-r*a)*_,e[3]=h*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-o*t)*_,e[6]=d*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(nc.makeScale(e,t)),this}rotate(e){return this.premultiply(nc.makeRotation(-e)),this}translate(e,t){return this.premultiply(nc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const nc=new tt;function wp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Dl(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function T_(){const i=Dl("canvas");return i.style.display="block",i}const Td={};function ul(i){i in Td||(Td[i]=!0,console.warn(i))}function b_(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function D_(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function C_(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const bd=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Dd=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function A_(){const i={enabled:!0,workingColorSpace:Ys,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===vt&&(r.r=ji(r.r),r.g=ji(r.g),r.b=ji(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===vt&&(r.r=Ns(r.r),r.g=Ns(r.g),r.b=Ns(r.b))),r},fromWorkingColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},toWorkingColorSpace:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===or?Tl:this.spaces[r].transfer},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ys]:{primaries:e,whitePoint:n,transfer:Tl,toXYZ:bd,fromXYZ:Dd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ti},outputColorSpaceConfig:{drawingBufferColorSpace:ti}},[ti]:{primaries:e,whitePoint:n,transfer:vt,toXYZ:bd,fromXYZ:Dd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ti}}}),i}const dt=A_();function ji(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ns(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ps;class w_{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ps===void 0&&(ps=Dl("canvas")),ps.width=e.width,ps.height=e.height;const r=ps.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=ps}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Dl("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=ji(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ji(t[n]/255)*255):t[n]=ji(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let R_=0;class Of{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:R_++}),this.uuid=ra(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ic(r[a].image)):s.push(ic(r[a]))}else s=ic(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function ic(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?w_.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let P_=0;class wn extends ia{constructor(e=wn.DEFAULT_IMAGE,t=wn.DEFAULT_MAPPING,n=kr,r=kr,s=Ti,a=Vr,o=mi,l=wi,c=wn.DEFAULT_ANISOTROPY,u=or){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:P_++}),this.uuid=ra(),this.name="",this.source=new Of(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ge(0,0),this.repeat=new ge(1,1),this.center=new ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isTextureArray=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isTextureArray=e.isTextureArray,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vp)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case gu:e.x=e.x-Math.floor(e.x);break;case kr:e.x=e.x<0?0:1;break;case _u:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case gu:e.y=e.y-Math.floor(e.y);break;case kr:e.y=e.y<0?0:1;break;case _u:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}wn.DEFAULT_IMAGE=null;wn.DEFAULT_MAPPING=vp;wn.DEFAULT_ANISOTROPY=1;class xt{constructor(e=0,t=0,n=0,r=1){xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,x=(d+1)/2,C=(p+1)/2,D=(u+h)/4,T=(f+_)/4,E=(g+m)/4;return v>x&&v>C?v<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(v),r=D/n,s=T/n):x>C?x<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),n=D/r,s=E/r):C<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(C),n=T/s,r=E/s),this.set(n,r,s,t),this}let S=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(f-_)/S,this.z=(h-u)/S,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this.z=rt(this.z,e.z,t.z),this.w=rt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this.z=rt(this.z,e,t),this.w=rt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class L_ extends ia{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth?n.depth:1,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);const r={width:e,height:t,depth:this.depth};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ti,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,multiview:!1},n);const s=new wn(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Of(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class es extends L_{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Rp extends wn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=_i,this.minFilter=_i,this.wrapR=kr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class F_ extends wn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=_i,this.minFilter=_i,this.wrapR=kr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ts{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],u=n[r+2],f=n[r+3];const h=s[a+0],d=s[a+1],g=s[a+2],_=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(o===1){e[t+0]=h,e[t+1]=d,e[t+2]=g,e[t+3]=_;return}if(f!==_||l!==h||c!==d||u!==g){let m=1-o;const p=l*h+c*d+u*g+f*_,S=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const C=Math.sqrt(v),D=Math.atan2(C,p*S);m=Math.sin(m*D)/C,o=Math.sin(o*D)/C}const x=o*S;if(l=l*m+h*x,c=c*m+d*x,u=u*m+g*x,f=f*m+_*x,m===1-o){const C=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=C,c*=C,u*=C,f*=C}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],l=n[r+1],c=n[r+2],u=n[r+3],f=s[a],h=s[a+1],d=s[a+2],g=s[a+3];return e[t]=o*g+u*f+l*d-c*h,e[t+1]=l*g+u*h+c*f-o*d,e[t+2]=c*g+u*d+o*h-l*f,e[t+3]=u*g-o*f-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(r/2),f=o(s/2),h=l(n/2),d=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"YXZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"ZXY":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"ZYX":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"YZX":this._x=h*u*f+c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f-h*d*g;break;case"XZY":this._x=h*u*f-c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f+h*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],h=n+o+f;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(a-r)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(u-l)/d,this._x=.25*d,this._y=(r+a)/d,this._z=(s+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(s-c)/d,this._x=(r+a)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(a-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(rt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-r*o,this._w=a*u-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const d=1-t;return this._w=d*a+t*this._w,this._x=d*n+t*this._x,this._y=d*r+t*this._y,this._z=d*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),f=Math.sin((1-t)*u)/c,h=Math.sin(t*u)/c;return this._w=a*f+this._w*h,this._x=n*f+this._x*h,this._y=r*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class z{constructor(e=0,t=0,n=0){z.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Cd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Cd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),u=2*(o*t-s*r),f=2*(s*n-a*t);return this.x=t+l*c+a*f-o*u,this.y=n+l*u+o*c-s*f,this.z=r+l*f+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this.z=rt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this.z=rt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return rc.copy(this).projectOnVector(e),this.sub(rc)}reflect(e){return this.sub(rc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const rc=new z,Cd=new ts;class co{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ci.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ci.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=ci.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ci):ci.fromBufferAttribute(s,a),ci.applyMatrix4(e.matrixWorld),this.expandByPoint(ci);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),mo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),mo.copy(n.boundingBox)),mo.applyMatrix4(e.matrixWorld),this.union(mo)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ci),ci.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(la),go.subVectors(this.max,la),ms.subVectors(e.a,la),gs.subVectors(e.b,la),_s.subVectors(e.c,la),Qi.subVectors(gs,ms),er.subVectors(_s,gs),Dr.subVectors(ms,_s);let t=[0,-Qi.z,Qi.y,0,-er.z,er.y,0,-Dr.z,Dr.y,Qi.z,0,-Qi.x,er.z,0,-er.x,Dr.z,0,-Dr.x,-Qi.y,Qi.x,0,-er.y,er.x,0,-Dr.y,Dr.x,0];return!sc(t,ms,gs,_s,go)||(t=[1,0,0,0,1,0,0,0,1],!sc(t,ms,gs,_s,go))?!1:(_o.crossVectors(Qi,er),t=[_o.x,_o.y,_o.z],sc(t,ms,gs,_s,go))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ci).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ci).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ii),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ii=[new z,new z,new z,new z,new z,new z,new z,new z],ci=new z,mo=new co,ms=new z,gs=new z,_s=new z,Qi=new z,er=new z,Dr=new z,la=new z,go=new z,_o=new z,Cr=new z;function sc(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Cr.fromArray(i,s);const o=r.x*Math.abs(Cr.x)+r.y*Math.abs(Cr.y)+r.z*Math.abs(Cr.z),l=e.dot(Cr),c=t.dot(Cr),u=n.dot(Cr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const I_=new co,ca=new z,ac=new z;class uo{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):I_.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ca.subVectors(e,this.center);const t=ca.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(ca,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ac.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ca.copy(e.center).add(ac)),this.expandByPoint(ca.copy(e.center).sub(ac))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Oi=new z,oc=new z,vo=new z,tr=new z,lc=new z,xo=new z,cc=new z;class Wl{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Oi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Oi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Oi.copy(this.origin).addScaledVector(this.direction,t),Oi.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){oc.copy(e).add(t).multiplyScalar(.5),vo.copy(t).sub(e).normalize(),tr.copy(this.origin).sub(oc);const s=e.distanceTo(t)*.5,a=-this.direction.dot(vo),o=tr.dot(this.direction),l=-tr.dot(vo),c=tr.lengthSq(),u=Math.abs(1-a*a);let f,h,d,g;if(u>0)if(f=a*l-o,h=a*o-l,g=s*u,f>=0)if(h>=-g)if(h<=g){const _=1/u;f*=_,h*=_,d=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=s,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-a*s+o)),h=f>0?-s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),d=h*(h+2*l)+c):(f=Math.max(0,-(a*s+o)),h=f>0?s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c);else h=a>0?-s:s,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(oc).addScaledVector(vo,h),d}intersectSphere(e,t){Oi.subVectors(e.center,this.origin);const n=Oi.dot(this.direction),r=Oi.dot(Oi)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Oi)!==null}intersectTriangle(e,t,n,r,s){lc.subVectors(t,e),xo.subVectors(n,e),cc.crossVectors(lc,xo);let a=this.direction.dot(cc),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;tr.subVectors(this.origin,e);const l=o*this.direction.dot(xo.crossVectors(tr,xo));if(l<0)return null;const c=o*this.direction.dot(lc.cross(tr));if(c<0||l+c>a)return null;const u=-o*tr.dot(cc);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Dt{constructor(e,t,n,r,s,a,o,l,c,u,f,h,d,g,_,m){Dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,u,f,h,d,g,_,m)}set(e,t,n,r,s,a,o,l,c,u,f,h,d,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Dt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/vs.setFromMatrixColumn(e,0).length(),s=1/vs.setFromMatrixColumn(e,1).length(),a=1/vs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const h=a*u,d=a*f,g=o*u,_=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=d+g*c,t[5]=h-_*c,t[9]=-o*l,t[2]=_-h*c,t[6]=g+d*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*u,d=l*f,g=c*u,_=c*f;t[0]=h+_*o,t[4]=g*o-d,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=d*o-g,t[6]=_+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*u,d=l*f,g=c*u,_=c*f;t[0]=h-_*o,t[4]=-a*f,t[8]=g+d*o,t[1]=d+g*o,t[5]=a*u,t[9]=_-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*u,d=a*f,g=o*u,_=o*f;t[0]=l*u,t[4]=g*c-d,t[8]=h*c+_,t[1]=l*f,t[5]=_*c+h,t[9]=d*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,d=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=_-h*f,t[8]=g*f+d,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=d*f+g,t[10]=h-_*f}else if(e.order==="XZY"){const h=a*l,d=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=h*f+_,t[5]=a*u,t[9]=d*f-g,t[2]=g*f-d,t[6]=o*u,t[10]=_*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(O_,e,U_)}lookAt(e,t,n){const r=this.elements;return Nn.subVectors(e,t),Nn.lengthSq()===0&&(Nn.z=1),Nn.normalize(),nr.crossVectors(n,Nn),nr.lengthSq()===0&&(Math.abs(n.z)===1?Nn.x+=1e-4:Nn.z+=1e-4,Nn.normalize(),nr.crossVectors(n,Nn)),nr.normalize(),So.crossVectors(Nn,nr),r[0]=nr.x,r[4]=So.x,r[8]=Nn.x,r[1]=nr.y,r[5]=So.y,r[9]=Nn.y,r[2]=nr.z,r[6]=So.z,r[10]=Nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],f=n[5],h=n[9],d=n[13],g=n[2],_=n[6],m=n[10],p=n[14],S=n[3],v=n[7],x=n[11],C=n[15],D=r[0],T=r[4],E=r[8],M=r[12],y=r[1],w=r[5],I=r[9],U=r[13],V=r[2],q=r[6],X=r[10],H=r[14],N=r[3],Q=r[7],L=r[11],ae=r[15];return s[0]=a*D+o*y+l*V+c*N,s[4]=a*T+o*w+l*q+c*Q,s[8]=a*E+o*I+l*X+c*L,s[12]=a*M+o*U+l*H+c*ae,s[1]=u*D+f*y+h*V+d*N,s[5]=u*T+f*w+h*q+d*Q,s[9]=u*E+f*I+h*X+d*L,s[13]=u*M+f*U+h*H+d*ae,s[2]=g*D+_*y+m*V+p*N,s[6]=g*T+_*w+m*q+p*Q,s[10]=g*E+_*I+m*X+p*L,s[14]=g*M+_*U+m*H+p*ae,s[3]=S*D+v*y+x*V+C*N,s[7]=S*T+v*w+x*q+C*Q,s[11]=S*E+v*I+x*X+C*L,s[15]=S*M+v*U+x*H+C*ae,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],d=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+s*l*f-r*c*f-s*o*h+n*c*h+r*o*d-n*l*d)+_*(+t*l*d-t*c*h+s*a*h-r*a*d+r*c*u-s*l*u)+m*(+t*c*f-t*o*d-s*a*f+n*a*d+s*o*u-n*c*u)+p*(-r*o*u-t*l*f+t*o*h+r*a*f-n*a*h+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],d=e[11],g=e[12],_=e[13],m=e[14],p=e[15],S=f*m*c-_*h*c+_*l*d-o*m*d-f*l*p+o*h*p,v=g*h*c-u*m*c-g*l*d+a*m*d+u*l*p-a*h*p,x=u*_*c-g*f*c+g*o*d-a*_*d-u*o*p+a*f*p,C=g*f*l-u*_*l-g*o*h+a*_*h+u*o*m-a*f*m,D=t*S+n*v+r*x+s*C;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/D;return e[0]=S*T,e[1]=(_*h*s-f*m*s-_*r*d+n*m*d+f*r*p-n*h*p)*T,e[2]=(o*m*s-_*l*s+_*r*c-n*m*c-o*r*p+n*l*p)*T,e[3]=(f*l*s-o*h*s-f*r*c+n*h*c+o*r*d-n*l*d)*T,e[4]=v*T,e[5]=(u*m*s-g*h*s+g*r*d-t*m*d-u*r*p+t*h*p)*T,e[6]=(g*l*s-a*m*s-g*r*c+t*m*c+a*r*p-t*l*p)*T,e[7]=(a*h*s-u*l*s+u*r*c-t*h*c-a*r*d+t*l*d)*T,e[8]=x*T,e[9]=(g*f*s-u*_*s-g*n*d+t*_*d+u*n*p-t*f*p)*T,e[10]=(a*_*s-g*o*s+g*n*c-t*_*c-a*n*p+t*o*p)*T,e[11]=(u*o*s-a*f*s-u*n*c+t*f*c+a*n*d-t*o*d)*T,e[12]=C*T,e[13]=(u*_*r-g*f*r+g*n*h-t*_*h-u*n*m+t*f*m)*T,e[14]=(g*o*r-a*_*r-g*n*l+t*_*l+a*n*m-t*o*m)*T,e[15]=(a*f*r-u*o*r+u*n*l-t*f*l-a*n*h+t*o*h)*T,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+n,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,f=o+o,h=s*c,d=s*u,g=s*f,_=a*u,m=a*f,p=o*f,S=l*c,v=l*u,x=l*f,C=n.x,D=n.y,T=n.z;return r[0]=(1-(_+p))*C,r[1]=(d+x)*C,r[2]=(g-v)*C,r[3]=0,r[4]=(d-x)*D,r[5]=(1-(h+p))*D,r[6]=(m+S)*D,r[7]=0,r[8]=(g+v)*T,r[9]=(m-S)*T,r[10]=(1-(h+_))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let s=vs.set(r[0],r[1],r[2]).length();const a=vs.set(r[4],r[5],r[6]).length(),o=vs.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ui.copy(this);const c=1/s,u=1/a,f=1/o;return ui.elements[0]*=c,ui.elements[1]*=c,ui.elements[2]*=c,ui.elements[4]*=u,ui.elements[5]*=u,ui.elements[6]*=u,ui.elements[8]*=f,ui.elements[9]*=f,ui.elements[10]*=f,t.setFromRotationMatrix(ui),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,r,s,a,o=qi){const l=this.elements,c=2*s/(t-e),u=2*s/(n-r),f=(t+e)/(t-e),h=(n+r)/(n-r);let d,g;if(o===qi)d=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===bl)d=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=qi){const l=this.elements,c=1/(t-e),u=1/(n-r),f=1/(a-s),h=(t+e)*c,d=(n+r)*u;let g,_;if(o===qi)g=(a+s)*f,_=-2*f;else if(o===bl)g=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const vs=new z,ui=new Dt,O_=new z(0,0,0),U_=new z(1,1,1),nr=new z,So=new z,Nn=new z,Ad=new Dt,wd=new ts;class Ri{constructor(e=0,t=0,n=0,r=Ri.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],d=r[10];switch(t){case"XYZ":this._y=Math.asin(rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-rt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(rt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-rt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(rt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-rt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ad.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ad,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wd.setFromEuler(this),this.setFromQuaternion(wd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ri.DEFAULT_ORDER="XYZ";class Pp{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let N_=0;const Rd=new z,xs=new ts,Ui=new Dt,yo=new z,ua=new z,B_=new z,z_=new ts,Pd=new z(1,0,0),Ld=new z(0,1,0),Fd=new z(0,0,1),Id={type:"added"},k_={type:"removed"},Ss={type:"childadded",child:null},uc={type:"childremoved",child:null};class en extends ia{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:N_++}),this.uuid=ra(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=en.DEFAULT_UP.clone();const e=new z,t=new Ri,n=new ts,r=new z(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Dt},normalMatrix:{value:new tt}}),this.matrix=new Dt,this.matrixWorld=new Dt,this.matrixAutoUpdate=en.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Pp,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return xs.setFromAxisAngle(e,t),this.quaternion.multiply(xs),this}rotateOnWorldAxis(e,t){return xs.setFromAxisAngle(e,t),this.quaternion.premultiply(xs),this}rotateX(e){return this.rotateOnAxis(Pd,e)}rotateY(e){return this.rotateOnAxis(Ld,e)}rotateZ(e){return this.rotateOnAxis(Fd,e)}translateOnAxis(e,t){return Rd.copy(e).applyQuaternion(this.quaternion),this.position.add(Rd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Pd,e)}translateY(e){return this.translateOnAxis(Ld,e)}translateZ(e){return this.translateOnAxis(Fd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ui.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?yo.copy(e):yo.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),ua.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ui.lookAt(ua,yo,this.up):Ui.lookAt(yo,ua,this.up),this.quaternion.setFromRotationMatrix(Ui),r&&(Ui.extractRotation(r.matrixWorld),xs.setFromRotationMatrix(Ui),this.quaternion.premultiply(xs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Id),Ss.child=e,this.dispatchEvent(Ss),Ss.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(k_),uc.child=e,this.dispatchEvent(uc),uc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Id),Ss.child=e,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ua,e,B_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ua,z_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?{min:o.boundingBox.min.toArray(),max:o.boundingBox.max.toArray()}:void 0,boundingSphere:o.boundingSphere?{radius:o.boundingSphere.radius,center:o.boundingSphere.center.toArray()}:void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:this.boundingSphere.center.toArray(),radius:this.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:this.boundingBox.min.toArray(),max:this.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),h=a(e.skeletons),d=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}en.DEFAULT_UP=new z(0,1,0);en.DEFAULT_MATRIX_AUTO_UPDATE=!0;en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const fi=new z,Ni=new z,fc=new z,Bi=new z,ys=new z,Ms=new z,Od=new z,dc=new z,hc=new z,pc=new z,mc=new xt,gc=new xt,_c=new xt;class pi{constructor(e=new z,t=new z,n=new z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),fi.subVectors(e,t),r.cross(fi);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){fi.subVectors(r,t),Ni.subVectors(n,t),fc.subVectors(e,t);const a=fi.dot(fi),o=fi.dot(Ni),l=fi.dot(fc),c=Ni.dot(Ni),u=Ni.dot(fc),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const h=1/f,d=(c*l-o*u)*h,g=(a*u-o*l)*h;return s.set(1-d-g,g,d)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Bi)===null?!1:Bi.x>=0&&Bi.y>=0&&Bi.x+Bi.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,Bi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Bi.x),l.addScaledVector(a,Bi.y),l.addScaledVector(o,Bi.z),l)}static getInterpolatedAttribute(e,t,n,r,s,a){return mc.setScalar(0),gc.setScalar(0),_c.setScalar(0),mc.fromBufferAttribute(e,t),gc.fromBufferAttribute(e,n),_c.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(mc,s.x),a.addScaledVector(gc,s.y),a.addScaledVector(_c,s.z),a}static isFrontFacing(e,t,n,r){return fi.subVectors(n,t),Ni.subVectors(e,t),fi.cross(Ni).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fi.subVectors(this.c,this.b),Ni.subVectors(this.a,this.b),fi.cross(Ni).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return pi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return pi.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;ys.subVectors(r,n),Ms.subVectors(s,n),dc.subVectors(e,n);const l=ys.dot(dc),c=Ms.dot(dc);if(l<=0&&c<=0)return t.copy(n);hc.subVectors(e,r);const u=ys.dot(hc),f=Ms.dot(hc);if(u>=0&&f<=u)return t.copy(r);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(ys,a);pc.subVectors(e,s);const d=ys.dot(pc),g=Ms.dot(pc);if(g>=0&&d<=g)return t.copy(s);const _=d*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Ms,o);const m=u*g-d*f;if(m<=0&&f-u>=0&&d-g>=0)return Od.subVectors(s,r),o=(f-u)/(f-u+(d-g)),t.copy(r).addScaledVector(Od,o);const p=1/(m+_+h);return a=_*p,o=h*p,t.copy(n).addScaledVector(ys,a).addScaledVector(Ms,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Lp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ir={h:0,s:0,l:0},Mo={h:0,s:0,l:0};function vc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class ct{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ti){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=dt.workingColorSpace){return this.r=e,this.g=t,this.b=n,dt.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=dt.workingColorSpace){if(e=E_(e,1),t=rt(t,0,1),n=rt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=vc(a,s,e+1/3),this.g=vc(a,s,e),this.b=vc(a,s,e-1/3)}return dt.toWorkingColorSpace(this,r),this}setStyle(e,t=ti){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ti){const n=Lp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ji(e.r),this.g=ji(e.g),this.b=ji(e.b),this}copyLinearToSRGB(e){return this.r=Ns(e.r),this.g=Ns(e.g),this.b=Ns(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ti){return dt.fromWorkingColorSpace(on.copy(this),e),Math.round(rt(on.r*255,0,255))*65536+Math.round(rt(on.g*255,0,255))*256+Math.round(rt(on.b*255,0,255))}getHexString(e=ti){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.fromWorkingColorSpace(on.copy(this),t);const n=on.r,r=on.g,s=on.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-n)/f+2;break;case s:l=(n-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=dt.workingColorSpace){return dt.fromWorkingColorSpace(on.copy(this),t),e.r=on.r,e.g=on.g,e.b=on.b,e}getStyle(e=ti){dt.fromWorkingColorSpace(on.copy(this),e);const t=on.r,n=on.g,r=on.b;return e!==ti?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(ir),this.setHSL(ir.h+e,ir.s+t,ir.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ir),e.getHSL(Mo);const n=tc(ir.h,Mo.h,t),r=tc(ir.s,Mo.s,t),s=tc(ir.l,Mo.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const on=new ct;ct.NAMES=Lp;let V_=0;class ls extends ia{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:V_++}),this.uuid=ra(),this.name="",this.type="Material",this.blending=Us,this.side=xr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=su,this.blendDst=au,this.blendEquation=Br,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ct(0,0,0),this.blendAlpha=0,this.depthFunc=Ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hs,this.stencilZFail=hs,this.stencilZPass=hs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Us&&(n.blending=this.blending),this.side!==xr&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==su&&(n.blendSrc=this.blendSrc),this.blendDst!==au&&(n.blendDst=this.blendDst),this.blendEquation!==Br&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ws&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==yd&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==hs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==hs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Fp extends ls{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ri,this.combine=Af,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const zt=new z,Eo=new ge;let H_=0;class Ci{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:H_++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Md,this.updateRanges=[],this.gpuType=Xi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Eo.fromBufferAttribute(this,t),Eo.applyMatrix3(e),this.setXY(t,Eo.x,Eo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix3(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix4(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyNormalMatrix(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.transformDirection(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=oa(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Dn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=oa(t,this.array)),t}setX(e,t){return this.normalized&&(t=Dn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=oa(t,this.array)),t}setY(e,t){return this.normalized&&(t=Dn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=oa(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Dn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=oa(t,this.array)),t}setW(e,t){return this.normalized&&(t=Dn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Dn(t,this.array),n=Dn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Dn(t,this.array),n=Dn(n,this.array),r=Dn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Dn(t,this.array),n=Dn(n,this.array),r=Dn(r,this.array),s=Dn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Md&&(e.usage=this.usage),e}}class Ip extends Ci{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Op extends Ci{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class vi extends Ci{constructor(e,t,n){super(new Float32Array(e),t,n)}}let G_=0;const Qn=new Dt,xc=new en,Es=new z,Bn=new co,fa=new co,Zt=new z;class Li extends ia{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:G_++}),this.uuid=ra(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(wp(e)?Op:Ip)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new tt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Qn.makeRotationFromQuaternion(e),this.applyMatrix4(Qn),this}rotateX(e){return Qn.makeRotationX(e),this.applyMatrix4(Qn),this}rotateY(e){return Qn.makeRotationY(e),this.applyMatrix4(Qn),this}rotateZ(e){return Qn.makeRotationZ(e),this.applyMatrix4(Qn),this}translate(e,t,n){return Qn.makeTranslation(e,t,n),this.applyMatrix4(Qn),this}scale(e,t,n){return Qn.makeScale(e,t,n),this.applyMatrix4(Qn),this}lookAt(e){return xc.lookAt(e),xc.updateMatrix(),this.applyMatrix4(xc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Es).negate(),this.translate(Es.x,Es.y,Es.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new vi(n,3))}else{const n=Math.min(e.length,t.count);for(let r=0;r<n;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new co);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Bn.setFromBufferAttribute(s),this.morphTargetsRelative?(Zt.addVectors(this.boundingBox.min,Bn.min),this.boundingBox.expandByPoint(Zt),Zt.addVectors(this.boundingBox.max,Bn.max),this.boundingBox.expandByPoint(Zt)):(this.boundingBox.expandByPoint(Bn.min),this.boundingBox.expandByPoint(Bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new uo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(e){const n=this.boundingSphere.center;if(Bn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];fa.setFromBufferAttribute(o),this.morphTargetsRelative?(Zt.addVectors(Bn.min,fa.min),Bn.expandByPoint(Zt),Zt.addVectors(Bn.max,fa.max),Bn.expandByPoint(Zt)):(Bn.expandByPoint(fa.min),Bn.expandByPoint(fa.max))}Bn.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)Zt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Zt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Zt.fromBufferAttribute(o,c),l&&(Es.fromBufferAttribute(e,c),Zt.add(Es)),r=Math.max(r,n.distanceToSquared(Zt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ci(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let E=0;E<n.count;E++)o[E]=new z,l[E]=new z;const c=new z,u=new z,f=new z,h=new ge,d=new ge,g=new ge,_=new z,m=new z;function p(E,M,y){c.fromBufferAttribute(n,E),u.fromBufferAttribute(n,M),f.fromBufferAttribute(n,y),h.fromBufferAttribute(s,E),d.fromBufferAttribute(s,M),g.fromBufferAttribute(s,y),u.sub(c),f.sub(c),d.sub(h),g.sub(h);const w=1/(d.x*g.y-g.x*d.y);isFinite(w)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(w),m.copy(f).multiplyScalar(d.x).addScaledVector(u,-g.x).multiplyScalar(w),o[E].add(_),o[M].add(_),o[y].add(_),l[E].add(m),l[M].add(m),l[y].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let E=0,M=S.length;E<M;++E){const y=S[E],w=y.start,I=y.count;for(let U=w,V=w+I;U<V;U+=3)p(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const v=new z,x=new z,C=new z,D=new z;function T(E){C.fromBufferAttribute(r,E),D.copy(C);const M=o[E];v.copy(M),v.sub(C.multiplyScalar(C.dot(M))).normalize(),x.crossVectors(D,M);const w=x.dot(l[E])<0?-1:1;a.setXYZW(E,v.x,v.y,v.z,w)}for(let E=0,M=S.length;E<M;++E){const y=S[E],w=y.start,I=y.count;for(let U=w,V=w+I;U<V;U+=3)T(e.getX(U+0)),T(e.getX(U+1)),T(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ci(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,d=n.count;h<d;h++)n.setXYZ(h,0,0,0);const r=new z,s=new z,a=new z,o=new z,l=new z,c=new z,u=new z,f=new z;if(e)for(let h=0,d=e.count;h<d;h+=3){const g=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=t.count;h<d;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Zt.fromBufferAttribute(e,t),Zt.normalize(),e.setXYZ(t,Zt.x,Zt.y,Zt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,h=new c.constructor(l.length*u);let d=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*u;for(let p=0;p<u;p++)h[g++]=c[d++]}return new Ci(h,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Li,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,f=c.length;u<f;u++){const h=c[u],d=e(h,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const d=c[f];u.push(d.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ud=new Dt,Ar=new Wl,To=new uo,Nd=new z,bo=new z,Do=new z,Co=new z,Sc=new z,Ao=new z,Bd=new z,wo=new z;class Yi extends en{constructor(e=new Li,t=new Fp){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Ao.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],f=s[l];u!==0&&(Sc.fromBufferAttribute(f,e),a?Ao.addScaledVector(Sc,u):Ao.addScaledVector(Sc.sub(t),u))}t.add(Ao)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),To.copy(n.boundingSphere),To.applyMatrix4(s),Ar.copy(e.ray).recast(e.near),!(To.containsPoint(Ar.origin)===!1&&(Ar.intersectSphere(To,Nd)===null||Ar.origin.distanceToSquared(Nd)>(e.far-e.near)**2))&&(Ud.copy(s).invert(),Ar.copy(e.ray).applyMatrix4(Ud),!(n.boundingBox!==null&&Ar.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ar)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=a[m.materialIndex],S=Math.max(m.start,d.start),v=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let x=S,C=v;x<C;x+=3){const D=o.getX(x),T=o.getX(x+1),E=o.getX(x+2);r=Ro(this,p,e,n,c,u,f,D,T,E),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const S=o.getX(m),v=o.getX(m+1),x=o.getX(m+2);r=Ro(this,a,e,n,c,u,f,S,v,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=a[m.materialIndex],S=Math.max(m.start,d.start),v=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let x=S,C=v;x<C;x+=3){const D=x,T=x+1,E=x+2;r=Ro(this,p,e,n,c,u,f,D,T,E),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const S=m,v=m+1,x=m+2;r=Ro(this,a,e,n,c,u,f,S,v,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function W_(i,e,t,n,r,s,a,o){let l;if(e.side===An?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===xr,o),l===null)return null;wo.copy(o),wo.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(wo);return c<t.near||c>t.far?null:{distance:c,point:wo.clone(),object:i}}function Ro(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,bo),i.getVertexPosition(l,Do),i.getVertexPosition(c,Co);const u=W_(i,e,t,n,bo,Do,Co,Bd);if(u){const f=new z;pi.getBarycoord(Bd,bo,Do,Co,f),r&&(u.uv=pi.getInterpolatedAttribute(r,o,l,c,f,new ge)),s&&(u.uv1=pi.getInterpolatedAttribute(s,o,l,c,f,new ge)),a&&(u.normal=pi.getInterpolatedAttribute(a,o,l,c,f,new z),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new z,materialIndex:0};pi.getNormal(bo,Do,Co,h.normal),u.face=h,u.barycoord=f}return u}class fo extends Li{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],f=[];let h=0,d=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,r,a,2),g("x","z","y",1,-1,e,n,-t,r,a,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new vi(c,3)),this.setAttribute("normal",new vi(u,3)),this.setAttribute("uv",new vi(f,2));function g(_,m,p,S,v,x,C,D,T,E,M){const y=x/T,w=C/E,I=x/2,U=C/2,V=D/2,q=T+1,X=E+1;let H=0,N=0;const Q=new z;for(let L=0;L<X;L++){const ae=L*w-U;for(let Ie=0;Ie<q;Ie++){const qe=Ie*y-I;Q[_]=qe*S,Q[m]=ae*v,Q[p]=V,c.push(Q.x,Q.y,Q.z),Q[_]=0,Q[m]=0,Q[p]=D>0?1:-1,u.push(Q.x,Q.y,Q.z),f.push(Ie/T),f.push(1-L/E),H+=1}}for(let L=0;L<E;L++)for(let ae=0;ae<T;ae++){const Ie=h+ae+q*L,qe=h+ae+q*(L+1),Z=h+(ae+1)+q*(L+1),oe=h+(ae+1)+q*L;l.push(Ie,qe,oe),l.push(qe,Z,oe),N+=6}o.addGroup(d,N,M),d+=N,h+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function $s(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function _n(i){const e={};for(let t=0;t<i.length;t++){const n=$s(i[t]);for(const r in n)e[r]=n[r]}return e}function X_(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Up(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}const q_={clone:$s,merge:_n};var Y_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Sr extends ls{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Y_,this.fragmentShader=$_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$s(e.uniforms),this.uniformsGroups=X_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Np extends en{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Dt,this.projectionMatrix=new Dt,this.projectionMatrixInverse=new Dt,this.coordinateSystem=qi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const rr=new z,zd=new ge,kd=new ge;class yn extends Np{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Wu*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ec*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Wu*2*Math.atan(Math.tan(ec*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){rr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(rr.x,rr.y).multiplyScalar(-e/rr.z),rr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(rr.x,rr.y).multiplyScalar(-e/rr.z)}getViewSize(e,t){return this.getViewBounds(e,zd,kd),t.subVectors(kd,zd)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ec*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ts=-90,bs=1;class j_ extends en{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new yn(Ts,bs,e,t);r.layers=this.layers,this.add(r);const s=new yn(Ts,bs,e,t);s.layers=this.layers,this.add(s);const a=new yn(Ts,bs,e,t);a.layers=this.layers,this.add(a);const o=new yn(Ts,bs,e,t);o.layers=this.layers,this.add(o);const l=new yn(Ts,bs,e,t);l.layers=this.layers,this.add(l);const c=new yn(Ts,bs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===qi)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===bl)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(f,h,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Bp extends wn{constructor(e=[],t=Xs,n,r,s,a,o,l,c,u){super(e,t,n,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Z_ extends es{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Bp(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ti}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new fo(5,5,5),s=new Sr({name:"CubemapFromEquirect",uniforms:$s(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:An,blending:pr});s.uniforms.tEquirect.value=t;const a=new Yi(r,s),o=t.minFilter;return t.minFilter===Vr&&(t.minFilter=Ti),new j_(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}class Po extends en{constructor(){super(),this.isGroup=!0,this.type="Group"}}const K_={type:"move"};class yc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Po,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Po,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Po,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&h>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(K_)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Po;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Zb extends en{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ri,this.environmentIntensity=1,this.environmentRotation=new Ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Mc=new z,J_=new z,Q_=new tt;class ar{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=Mc.subVectors(n,t).cross(J_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Mc),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Q_.getNormalMatrix(e),r=this.coplanarPoint(Mc).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const wr=new uo,Lo=new z;class Uf{constructor(e=new ar,t=new ar,n=new ar,r=new ar,s=new ar,a=new ar){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=qi){const n=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],f=r[6],h=r[7],d=r[8],g=r[9],_=r[10],m=r[11],p=r[12],S=r[13],v=r[14],x=r[15];if(n[0].setComponents(l-s,h-c,m-d,x-p).normalize(),n[1].setComponents(l+s,h+c,m+d,x+p).normalize(),n[2].setComponents(l+a,h+u,m+g,x+S).normalize(),n[3].setComponents(l-a,h-u,m-g,x-S).normalize(),n[4].setComponents(l-o,h-f,m-_,x-v).normalize(),t===qi)n[5].setComponents(l+o,h+f,m+_,x+v).normalize();else if(t===bl)n[5].setComponents(o,f,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),wr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),wr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(wr)}intersectsSprite(e){return wr.center.set(0,0,0),wr.radius=.7071067811865476,wr.applyMatrix4(e.matrixWorld),this.intersectsSphere(wr)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(Lo.x=r.normal.x>0?e.max.x:e.min.x,Lo.y=r.normal.y>0?e.max.y:e.min.y,Lo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Lo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class e0 extends ls{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ct(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Cl=new z,Al=new z,Vd=new Dt,da=new Wl,Fo=new uo,Ec=new z,Hd=new z;class t0 extends en{constructor(e=new Li,t=new e0){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let r=1,s=t.count;r<s;r++)Cl.fromBufferAttribute(t,r-1),Al.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=Cl.distanceTo(Al);e.setAttribute("lineDistance",new vi(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fo.copy(n.boundingSphere),Fo.applyMatrix4(r),Fo.radius+=s,e.ray.intersectsSphere(Fo)===!1)return;Vd.copy(r).invert(),da.copy(e.ray).applyMatrix4(Vd);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){const d=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=d,m=g-1;_<m;_+=c){const p=u.getX(_),S=u.getX(_+1),v=Io(this,e,da,l,p,S,_);v&&t.push(v)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(d),p=Io(this,e,da,l,_,m,g-1);p&&t.push(p)}}else{const d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=d,m=g-1;_<m;_+=c){const p=Io(this,e,da,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=Io(this,e,da,l,g-1,d,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Io(i,e,t,n,r,s,a){const o=i.geometry.attributes.position;if(Cl.fromBufferAttribute(o,r),Al.fromBufferAttribute(o,s),t.distanceSqToSegment(Cl,Al,Ec,Hd)>n)return;Ec.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Ec);if(!(c<e.near||c>e.far))return{distance:c,point:Hd.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const Gd=new z,Wd=new z;class Kb extends t0{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let r=0,s=t.count;r<s;r+=2)Gd.fromBufferAttribute(t,r),Wd.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+Gd.distanceTo(Wd);e.setAttribute("lineDistance",new vi(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class n0 extends ls{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ct(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Xd=new Dt,Xu=new Wl,Oo=new uo,Uo=new z;class Jb extends en{constructor(e=new Li,t=new n0){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Oo.copy(n.boundingSphere),Oo.applyMatrix4(r),Oo.radius+=s,e.ray.intersectsSphere(Oo)===!1)return;Xd.copy(r).invert(),Xu.copy(e.ray).applyMatrix4(Xd);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){const h=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let g=h,_=d;g<_;g++){const m=c.getX(g);Uo.fromBufferAttribute(f,m),qd(Uo,m,l,r,e,t,this)}}else{const h=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let g=h,_=d;g<_;g++)Uo.fromBufferAttribute(f,g),qd(Uo,g,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function qd(i,e,t,n,r,s,a){const o=Xu.distanceSqToPoint(i);if(o<t){const l=new z;Xu.closestPointToPoint(i,l),l.applyMatrix4(n);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class zp extends wn{constructor(e,t,n=Qr,r,s,a,o=_i,l=_i,c,u=qa){if(u!==qa&&u!==Ya)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super(null,r,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Of(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Fi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(r),t.push(s),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let r=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(r=Math.floor(o+(l-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,n[r]===a)return r/(s-1);const u=n[r],h=n[r+1]-u,d=(a-u)/h;return(r+d)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),l=t||(a.isVector2?new ge:new z);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new z,r=[],s=[],a=[],o=new z,l=new Dt;for(let d=0;d<=e;d++){const g=d/e;r[d]=this.getTangentAt(g,new z)}s[0]=new z,a[0]=new z;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),f=Math.abs(r[0].y),h=Math.abs(r[0].z);u<=c&&(c=u,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let d=1;d<=e;d++){if(s[d]=s[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(r[d-1],r[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(rt(r[d-1].dot(r[d]),-1,1));s[d].applyMatrix4(l.makeRotationAxis(o,g))}a[d].crossVectors(r[d],s[d])}if(t===!0){let d=Math.acos(rt(s[0].dot(s[e]),-1,1));d/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(d=-d);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],d*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Nf extends Fi{constructor(e=0,t=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new ge){const n=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),h=l-this.aX,d=c-this.aY;l=h*u-d*f+this.aX,c=h*f+d*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class i0 extends Nf{constructor(e,t,n,r,s,a){super(e,t,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Bf(){let i=0,e=0,t=0,n=0;function r(s,a,o,l){i=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,u,f){let h=(a-s)/c-(o-s)/(c+u)+(o-a)/u,d=(o-a)/u-(l-a)/(u+f)+(l-o)/f;h*=u,d*=u,r(a,o,h,d)},calc:function(s){const a=s*s,o=a*s;return i+e*s+t*a+n*o}}}const No=new z,Tc=new Bf,bc=new Bf,Dc=new Bf;class r0 extends Fi{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new z){const n=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,u;this.closed||o>0?c=r[(o-1)%s]:(No.subVectors(r[0],r[1]).add(r[0]),c=No);const f=r[o%s],h=r[(o+1)%s];if(this.closed||o+2<s?u=r[(o+2)%s]:(No.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=No),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),d),_=Math.pow(f.distanceToSquared(h),d),m=Math.pow(h.distanceToSquared(u),d);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Tc.initNonuniformCatmullRom(c.x,f.x,h.x,u.x,g,_,m),bc.initNonuniformCatmullRom(c.y,f.y,h.y,u.y,g,_,m),Dc.initNonuniformCatmullRom(c.z,f.z,h.z,u.z,g,_,m)}else this.curveType==="catmullrom"&&(Tc.initCatmullRom(c.x,f.x,h.x,u.x,this.tension),bc.initCatmullRom(c.y,f.y,h.y,u.y,this.tension),Dc.initCatmullRom(c.z,f.z,h.z,u.z,this.tension));return n.set(Tc.calc(l),bc.calc(l),Dc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new z().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Yd(i,e,t,n,r){const s=(n-e)*.5,a=(r-t)*.5,o=i*i,l=i*o;return(2*t-2*n+s+a)*l+(-3*t+3*n-2*s-a)*o+s*i+t}function s0(i,e){const t=1-i;return t*t*e}function a0(i,e){return 2*(1-i)*i*e}function o0(i,e){return i*i*e}function wa(i,e,t,n){return s0(i,e)+a0(i,t)+o0(i,n)}function l0(i,e){const t=1-i;return t*t*t*e}function c0(i,e){const t=1-i;return 3*t*t*i*e}function u0(i,e){return 3*(1-i)*i*i*e}function f0(i,e){return i*i*i*e}function Ra(i,e,t,n,r){return l0(i,e)+c0(i,t)+u0(i,n)+f0(i,r)}class kp extends Fi{constructor(e=new ge,t=new ge,n=new ge,r=new ge){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new ge){const n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ra(e,r.x,s.x,a.x,o.x),Ra(e,r.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class d0 extends Fi{constructor(e=new z,t=new z,n=new z,r=new z){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new z){const n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ra(e,r.x,s.x,a.x,o.x),Ra(e,r.y,s.y,a.y,o.y),Ra(e,r.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Vp extends Fi{constructor(e=new ge,t=new ge){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ge){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ge){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class h0 extends Fi{constructor(e=new z,t=new z){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new z){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new z){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Hp extends Fi{constructor(e=new ge,t=new ge,n=new ge){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ge){const n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(wa(e,r.x,s.x,a.x),wa(e,r.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class p0 extends Fi{constructor(e=new z,t=new z,n=new z){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new z){const n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(wa(e,r.x,s.x,a.x),wa(e,r.y,s.y,a.y),wa(e,r.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Gp extends Fi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ge){const n=t,r=this.points,s=(r.length-1)*e,a=Math.floor(s),o=s-a,l=r[a===0?a:a-1],c=r[a],u=r[a>r.length-2?r.length-1:a+1],f=r[a>r.length-3?r.length-1:a+2];return n.set(Yd(o,l.x,c.x,u.x,f.x),Yd(o,l.y,c.y,u.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new ge().fromArray(r))}return this}}var qu=Object.freeze({__proto__:null,ArcCurve:i0,CatmullRomCurve3:r0,CubicBezierCurve:kp,CubicBezierCurve3:d0,EllipseCurve:Nf,LineCurve:Vp,LineCurve3:h0,QuadraticBezierCurve:Hp,QuadraticBezierCurve3:p0,SplineCurve:Gp});class m0 extends Fi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new qu[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const a=r[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const r=e.curves[t];this.curves.push(new qu[r.type]().fromJSON(r))}return this}}class Yu extends m0{constructor(e){super(),this.type="Path",this.currentPoint=new ge,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Vp(this.currentPoint.clone(),new ge(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){const s=new Hp(this.currentPoint.clone(),new ge(e,t),new ge(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,s,a){const o=new kp(this.currentPoint.clone(),new ge(e,t),new ge(n,r),new ge(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Gp(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,r,s,a),this}absarc(e,t,n,r,s,a){return this.absellipse(e,t,n,n,r,s,a),this}ellipse(e,t,n,r,s,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,r,s,a,o,l),this}absellipse(e,t,n,r,s,a,o,l){const c=new Nf(e,t,n,r,s,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class fl extends Yu{constructor(e){super(e),this.uuid=ra(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const r=e.holes[t];this.holes.push(new Yu().fromJSON(r))}return this}}function g0(i,e,t=2){const n=e&&e.length,r=n?e[0]*t:i.length;let s=Wp(i,0,r,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(n&&(s=y0(i,e,s,t)),i.length>80*t){o=1/0,l=1/0;let u=-1/0,f=-1/0;for(let h=t;h<r;h+=t){const d=i[h],g=i[h+1];d<o&&(o=d),g<l&&(l=g),d>u&&(u=d),g>f&&(f=g)}c=Math.max(u-o,f-l),c=c!==0?32767/c:0}return $a(s,a,t,o,l,c,0),a}function Wp(i,e,t,n,r){let s;if(r===L0(i,e,t,n)>0)for(let a=e;a<t;a+=n)s=$d(a/n|0,i[a],i[a+1],s);else for(let a=t-n;a>=e;a-=n)s=$d(a/n|0,i[a],i[a+1],s);return s&&js(s,s.next)&&(Za(s),s=s.next),s}function ns(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(js(t,t.next)||Pt(t.prev,t,t.next)===0)){if(Za(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function $a(i,e,t,n,r,s,a){if(!i)return;!a&&s&&D0(i,n,r,s);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(s?v0(i,n,r,s):_0(i)){e.push(l.i,i.i,c.i),Za(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=x0(ns(i),e),$a(i,e,t,n,r,s,2)):a===2&&S0(i,e,t,n,r,s):$a(ns(i),e,t,n,r,s,1);break}}}function _0(i){const e=i.prev,t=i,n=i.next;if(Pt(e,t,n)>=0)return!1;const r=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,u=Math.min(r,s,a),f=Math.min(o,l,c),h=Math.max(r,s,a),d=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=h&&g.y>=f&&g.y<=d&&va(r,o,s,l,a,c,g.x,g.y)&&Pt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function v0(i,e,t,n){const r=i.prev,s=i,a=i.next;if(Pt(r,s,a)>=0)return!1;const o=r.x,l=s.x,c=a.x,u=r.y,f=s.y,h=a.y,d=Math.min(o,l,c),g=Math.min(u,f,h),_=Math.max(o,l,c),m=Math.max(u,f,h),p=$u(d,g,e,t,n),S=$u(_,m,e,t,n);let v=i.prevZ,x=i.nextZ;for(;v&&v.z>=p&&x&&x.z<=S;){if(v.x>=d&&v.x<=_&&v.y>=g&&v.y<=m&&v!==r&&v!==a&&va(o,u,l,f,c,h,v.x,v.y)&&Pt(v.prev,v,v.next)>=0||(v=v.prevZ,x.x>=d&&x.x<=_&&x.y>=g&&x.y<=m&&x!==r&&x!==a&&va(o,u,l,f,c,h,x.x,x.y)&&Pt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;v&&v.z>=p;){if(v.x>=d&&v.x<=_&&v.y>=g&&v.y<=m&&v!==r&&v!==a&&va(o,u,l,f,c,h,v.x,v.y)&&Pt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;x&&x.z<=S;){if(x.x>=d&&x.x<=_&&x.y>=g&&x.y<=m&&x!==r&&x!==a&&va(o,u,l,f,c,h,x.x,x.y)&&Pt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function x0(i,e){let t=i;do{const n=t.prev,r=t.next.next;!js(n,r)&&qp(n,t,t.next,r)&&ja(n,r)&&ja(r,n)&&(e.push(n.i,t.i,r.i),Za(t),Za(t.next),t=i=r),t=t.next}while(t!==i);return ns(t)}function S0(i,e,t,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&w0(a,o)){let l=Yp(a,o);a=ns(a,a.next),l=ns(l,l.next),$a(a,e,t,n,r,s,0),$a(l,e,t,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function y0(i,e,t,n){const r=[];for(let s=0,a=e.length;s<a;s++){const o=e[s]*n,l=s<a-1?e[s+1]*n:i.length,c=Wp(i,o,l,n,!1);c===c.next&&(c.steiner=!0),r.push(A0(c))}r.sort(M0);for(let s=0;s<r.length;s++)t=E0(r[s],t);return t}function M0(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),r=(e.next.y-e.y)/(e.next.x-e.x);t=n-r}return t}function E0(i,e){const t=T0(i,e);if(!t)return e;const n=Yp(t,i);return ns(n,n.next),ns(t,t.next)}function T0(i,e){let t=e;const n=i.x,r=i.y;let s=-1/0,a;if(js(i,t))return t;do{if(js(i,t.next))return t.next;if(r<=t.y&&r>=t.next.y&&t.next.y!==t.y){const f=t.x+(r-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=n&&f>s&&(s=f,a=t.x<t.next.x?t:t.next,f===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Xp(r<c?n:s,r,l,c,r<c?s:n,r,t.x,t.y)){const f=Math.abs(r-t.y)/(n-t.x);ja(t,i)&&(f<u||f===u&&(t.x>a.x||t.x===a.x&&b0(a,t)))&&(a=t,u=f)}t=t.next}while(t!==o);return a}function b0(i,e){return Pt(i.prev,i,e.prev)<0&&Pt(e.next,i,i.next)<0}function D0(i,e,t,n){let r=i;do r.z===0&&(r.z=$u(r.x,r.y,e,t,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,C0(r)}function C0(i){let e,t=1;do{let n=i,r;i=null;let s=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(r=n,n=n.nextZ,o--):(r=a,a=a.nextZ,l--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=a}s.nextZ=null,t*=2}while(e>1);return i}function $u(i,e,t,n,r){return i=(i-t)*r|0,e=(e-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function A0(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Xp(i,e,t,n,r,s,a,o){return(r-a)*(e-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(r-a)*(n-o)}function va(i,e,t,n,r,s,a,o){return!(i===a&&e===o)&&Xp(i,e,t,n,r,s,a,o)}function w0(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!R0(i,e)&&(ja(i,e)&&ja(e,i)&&P0(i,e)&&(Pt(i.prev,i,e.prev)||Pt(i,e.prev,e))||js(i,e)&&Pt(i.prev,i,i.next)>0&&Pt(e.prev,e,e.next)>0)}function Pt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function js(i,e){return i.x===e.x&&i.y===e.y}function qp(i,e,t,n){const r=zo(Pt(i,e,t)),s=zo(Pt(i,e,n)),a=zo(Pt(t,n,i)),o=zo(Pt(t,n,e));return!!(r!==s&&a!==o||r===0&&Bo(i,t,e)||s===0&&Bo(i,n,e)||a===0&&Bo(t,i,n)||o===0&&Bo(t,e,n))}function Bo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function zo(i){return i>0?1:i<0?-1:0}function R0(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&qp(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ja(i,e){return Pt(i.prev,i,i.next)<0?Pt(i,e,i.next)>=0&&Pt(i,i.prev,e)>=0:Pt(i,e,i.prev)<0||Pt(i,i.next,e)<0}function P0(i,e){let t=i,n=!1;const r=(i.x+e.x)/2,s=(i.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Yp(i,e){const t=ju(i.i,i.x,i.y),n=ju(e.i,e.x,e.y),r=i.next,s=e.prev;return i.next=e,e.prev=i,t.next=r,r.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function $d(i,e,t,n){const r=ju(i,e,t);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Za(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ju(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function L0(i,e,t,n){let r=0;for(let s=e,a=t-n;s<t;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}class F0{static triangulate(e,t,n=2){return g0(e,t,n)}}class Hr{static area(e){const t=e.length;let n=0;for(let r=t-1,s=0;s<t;r=s++)n+=e[r].x*e[s].y-e[s].x*e[r].y;return n*.5}static isClockWise(e){return Hr.area(e)<0}static triangulateShape(e,t){const n=[],r=[],s=[];jd(e),Zd(n,e);let a=e.length;t.forEach(jd);for(let l=0;l<t.length;l++)r.push(a),a+=t[l].length,Zd(n,t[l]);const o=F0.triangulate(n,r);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function jd(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Zd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class zf extends Li{constructor(e=new fl([new ge(.5,.5),new ge(-.5,.5),new ge(-.5,-.5),new ge(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,r=[],s=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new vi(r,3)),this.setAttribute("uv",new vi(s,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,f=t.depth!==void 0?t.depth:1;let h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:d-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,S=t.UVGenerator!==void 0?t.UVGenerator:I0;let v,x=!1,C,D,T,E;p&&(v=p.getSpacedPoints(u),x=!0,h=!1,C=p.computeFrenetFrames(u,!1),D=new z,T=new z,E=new z),h||(m=0,d=0,g=0,_=0);const M=o.extractPoints(c);let y=M.shape;const w=M.holes;if(!Hr.isClockWise(y)){y=y.reverse();for(let P=0,de=w.length;P<de;P++){const re=w[P];Hr.isClockWise(re)&&(w[P]=re.reverse())}}function U(P){const re=10000000000000001e-36;let O=P[0];for(let ne=1;ne<=P.length;ne++){const Ce=ne%P.length,se=P[Ce],R=se.x-O.x,b=se.y-O.y,G=R*R+b*b,J=Math.max(Math.abs(se.x),Math.abs(se.y),Math.abs(O.x),Math.abs(O.y)),ie=re*J*J;if(G<=ie){P.splice(Ce,1),ne--;continue}O=se}}U(y),w.forEach(U);const V=w.length,q=y;for(let P=0;P<V;P++){const de=w[P];y=y.concat(de)}function X(P,de,re){return de||console.error("THREE.ExtrudeGeometry: vec does not exist"),P.clone().addScaledVector(de,re)}const H=y.length;function N(P,de,re){let O,ne,Ce;const se=P.x-de.x,R=P.y-de.y,b=re.x-P.x,G=re.y-P.y,J=se*se+R*R,ie=se*G-R*b;if(Math.abs(ie)>Number.EPSILON){const K=Math.sqrt(J),me=Math.sqrt(b*b+G*G),he=de.x-R/K,Pe=de.y+se/K,Ue=re.x-G/me,le=re.y+b/me,pe=((Ue-he)*G-(le-Pe)*b)/(se*G-R*b);O=he+se*pe-P.x,ne=Pe+R*pe-P.y;const Ve=O*O+ne*ne;if(Ve<=2)return new ge(O,ne);Ce=Math.sqrt(Ve/2)}else{let K=!1;se>Number.EPSILON?b>Number.EPSILON&&(K=!0):se<-Number.EPSILON?b<-Number.EPSILON&&(K=!0):Math.sign(R)===Math.sign(G)&&(K=!0),K?(O=-R,ne=se,Ce=Math.sqrt(J)):(O=se,ne=R,Ce=Math.sqrt(J/2))}return new ge(O/Ce,ne/Ce)}const Q=[];for(let P=0,de=q.length,re=de-1,O=P+1;P<de;P++,re++,O++)re===de&&(re=0),O===de&&(O=0),Q[P]=N(q[P],q[re],q[O]);const L=[];let ae,Ie=Q.concat();for(let P=0,de=V;P<de;P++){const re=w[P];ae=[];for(let O=0,ne=re.length,Ce=ne-1,se=O+1;O<ne;O++,Ce++,se++)Ce===ne&&(Ce=0),se===ne&&(se=0),ae[O]=N(re[O],re[Ce],re[se]);L.push(ae),Ie=Ie.concat(ae)}let qe;if(m===0)qe=Hr.triangulateShape(q,w);else{const P=[],de=[];for(let re=0;re<m;re++){const O=re/m,ne=d*Math.cos(O*Math.PI/2),Ce=g*Math.sin(O*Math.PI/2)+_;for(let se=0,R=q.length;se<R;se++){const b=X(q[se],Q[se],Ce);Ne(b.x,b.y,-ne),O===0&&P.push(b)}for(let se=0,R=V;se<R;se++){const b=w[se];ae=L[se];const G=[];for(let J=0,ie=b.length;J<ie;J++){const K=X(b[J],ae[J],Ce);Ne(K.x,K.y,-ne),O===0&&G.push(K)}O===0&&de.push(G)}}qe=Hr.triangulateShape(P,de)}const Z=qe.length,oe=g+_;for(let P=0;P<H;P++){const de=h?X(y[P],Ie[P],oe):y[P];x?(T.copy(C.normals[0]).multiplyScalar(de.x),D.copy(C.binormals[0]).multiplyScalar(de.y),E.copy(v[0]).add(T).add(D),Ne(E.x,E.y,E.z)):Ne(de.x,de.y,0)}for(let P=1;P<=u;P++)for(let de=0;de<H;de++){const re=h?X(y[de],Ie[de],oe):y[de];x?(T.copy(C.normals[P]).multiplyScalar(re.x),D.copy(C.binormals[P]).multiplyScalar(re.y),E.copy(v[P]).add(T).add(D),Ne(E.x,E.y,E.z)):Ne(re.x,re.y,f/u*P)}for(let P=m-1;P>=0;P--){const de=P/m,re=d*Math.cos(de*Math.PI/2),O=g*Math.sin(de*Math.PI/2)+_;for(let ne=0,Ce=q.length;ne<Ce;ne++){const se=X(q[ne],Q[ne],O);Ne(se.x,se.y,f+re)}for(let ne=0,Ce=w.length;ne<Ce;ne++){const se=w[ne];ae=L[ne];for(let R=0,b=se.length;R<b;R++){const G=X(se[R],ae[R],O);x?Ne(G.x,G.y+v[u-1].y,v[u-1].x+re):Ne(G.x,G.y,f+re)}}}xe(),fe();function xe(){const P=r.length/3;if(h){let de=0,re=H*de;for(let O=0;O<Z;O++){const ne=qe[O];Oe(ne[2]+re,ne[1]+re,ne[0]+re)}de=u+m*2,re=H*de;for(let O=0;O<Z;O++){const ne=qe[O];Oe(ne[0]+re,ne[1]+re,ne[2]+re)}}else{for(let de=0;de<Z;de++){const re=qe[de];Oe(re[2],re[1],re[0])}for(let de=0;de<Z;de++){const re=qe[de];Oe(re[0]+H*u,re[1]+H*u,re[2]+H*u)}}n.addGroup(P,r.length/3-P,0)}function fe(){const P=r.length/3;let de=0;Ae(q,de),de+=q.length;for(let re=0,O=w.length;re<O;re++){const ne=w[re];Ae(ne,de),de+=ne.length}n.addGroup(P,r.length/3-P,1)}function Ae(P,de){let re=P.length;for(;--re>=0;){const O=re;let ne=re-1;ne<0&&(ne=P.length-1);for(let Ce=0,se=u+m*2;Ce<se;Ce++){const R=H*Ce,b=H*(Ce+1),G=de+O+R,J=de+ne+R,ie=de+ne+b,K=de+O+b;et(G,J,ie,K)}}}function Ne(P,de,re){l.push(P),l.push(de),l.push(re)}function Oe(P,de,re){Ye(P),Ye(de),Ye(re);const O=r.length/3,ne=S.generateTopUV(n,r,O-3,O-2,O-1);Se(ne[0]),Se(ne[1]),Se(ne[2])}function et(P,de,re,O){Ye(P),Ye(de),Ye(O),Ye(de),Ye(re),Ye(O);const ne=r.length/3,Ce=S.generateSideWallUV(n,r,ne-6,ne-3,ne-2,ne-1);Se(Ce[0]),Se(Ce[1]),Se(Ce[3]),Se(Ce[1]),Se(Ce[2]),Se(Ce[3])}function Ye(P){r.push(l[P*3+0]),r.push(l[P*3+1]),r.push(l[P*3+2])}function Se(P){s.push(P.x),s.push(P.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return O0(t,n,e)}static fromJSON(e,t){const n=[];for(let s=0,a=e.shapes.length;s<a;s++){const o=t[e.shapes[s]];n.push(o)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new qu[r.type]().fromJSON(r)),new zf(n,e.options)}}const I0={generateTopUV:function(i,e,t,n,r){const s=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[r*3],u=e[r*3+1];return[new ge(s,a),new ge(o,l),new ge(c,u)]},generateSideWallUV:function(i,e,t,n,r,s){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],u=e[n*3+1],f=e[n*3+2],h=e[r*3],d=e[r*3+1],g=e[r*3+2],_=e[s*3],m=e[s*3+1],p=e[s*3+2];return Math.abs(o-u)<Math.abs(a-c)?[new ge(a,1-l),new ge(c,1-f),new ge(h,1-g),new ge(_,1-p)]:[new ge(o,1-l),new ge(u,1-f),new ge(d,1-g),new ge(m,1-p)]}};function O0(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Xl extends Li{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,u=l+1,f=e/o,h=t/l,d=[],g=[],_=[],m=[];for(let p=0;p<u;p++){const S=p*h-a;for(let v=0;v<c;v++){const x=v*f-s;g.push(x,-S,0),_.push(0,0,1),m.push(v/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<o;S++){const v=S+c*p,x=S+c*(p+1),C=S+1+c*(p+1),D=S+1+c*p;d.push(v,x,D),d.push(x,C,D)}this.setIndex(d),this.setAttribute("position",new vi(g,3)),this.setAttribute("normal",new vi(_,3)),this.setAttribute("uv",new vi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xl(e.width,e.height,e.widthSegments,e.heightSegments)}}class Qb extends ls{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new ct(16777215),this.specular=new ct(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ct(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cp,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ri,this.combine=Af,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class U0 extends ls{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=h_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class N0 extends ls{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Kd={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class B0{constructor(e,t,n){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){const f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){const d=c[f],g=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null}}}const z0=new B0;class kf{constructor(e){this.manager=e!==void 0?e:z0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}kf.DEFAULT_MATERIAL_NAME="__DEFAULT";const zi={};class k0 extends Error{constructor(e,t){super(e),this.response=t}}class V0 extends kf{constructor(e){super(e),this.mimeType="",this.responseType=""}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=Kd.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(zi[e]!==void 0){zi[e].push({onLoad:t,onProgress:n,onError:r});return}zi[e]=[],zi[e].push({onLoad:t,onProgress:n,onError:r});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=zi[e],f=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=h?parseInt(h):0,g=d!==0;let _=0;const m=new ReadableStream({start(p){S();function S(){f.read().then(({done:v,value:x})=>{if(v)p.close();else{_+=x.byteLength;const C=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:d});for(let D=0,T=u.length;D<T;D++){const E=u[D];E.onProgress&&E.onProgress(C)}p.enqueue(x),S()}},v=>{p.error(v)})}}});return new Response(m)}else throw new k0(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(o),h=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(h);return c.arrayBuffer().then(g=>d.decode(g))}}}).then(c=>{Kd.add(e,c);const u=zi[e];delete zi[e];for(let f=0,h=u.length;f<h;f++){const d=u[f];d.onLoad&&d.onLoad(c)}}).catch(c=>{const u=zi[e];if(u===void 0)throw this.manager.itemError(e),c;delete zi[e];for(let f=0,h=u.length;f<h;f++){const d=u[f];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Vf extends en{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ct(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Cc=new Dt,Jd=new z,Qd=new z;class $p{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ge(512,512),this.mapType=wi,this.map=null,this.mapPass=null,this.matrix=new Dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Uf,this._frameExtents=new ge(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Jd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Jd),Qd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Qd),t.updateMatrixWorld(),Cc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Cc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Cc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const eh=new Dt,ha=new z,Ac=new z;class H0 extends $p{constructor(){super(new yn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ge(4,2),this._viewportCount=6,this._viewports=[new xt(2,1,1,1),new xt(0,1,1,1),new xt(3,1,1,1),new xt(1,1,1,1),new xt(3,0,1,1),new xt(1,0,1,1)],this._cubeDirections=[new z(1,0,0),new z(-1,0,0),new z(0,0,1),new z(0,0,-1),new z(0,1,0),new z(0,-1,0)],this._cubeUps=[new z(0,1,0),new z(0,1,0),new z(0,1,0),new z(0,1,0),new z(0,0,1),new z(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),ha.setFromMatrixPosition(e.matrixWorld),n.position.copy(ha),Ac.copy(n.position),Ac.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Ac),n.updateMatrixWorld(),r.makeTranslation(-ha.x,-ha.y,-ha.z),eh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(eh)}}class eD extends Vf{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new H0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Pa extends Np{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class G0 extends $p{constructor(){super(new Pa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class tD extends Vf{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.shadow=new G0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class nD extends Vf{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class W0 extends yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class iD{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=th(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=th();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function th(){return performance.now()}class nh{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=rt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(rt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class X0{constructor(){this.type="ShapePath",this.color=new ct,this.subPaths=[],this.currentPath=null}moveTo(e,t){return this.currentPath=new Yu,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,r){return this.currentPath.quadraticCurveTo(e,t,n,r),this}bezierCurveTo(e,t,n,r,s,a){return this.currentPath.bezierCurveTo(e,t,n,r,s,a),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(e){function t(p){const S=[];for(let v=0,x=p.length;v<x;v++){const C=p[v],D=new fl;D.curves=C.curves,S.push(D)}return S}function n(p,S){const v=S.length;let x=!1;for(let C=v-1,D=0;D<v;C=D++){let T=S[C],E=S[D],M=E.x-T.x,y=E.y-T.y;if(Math.abs(y)>Number.EPSILON){if(y<0&&(T=S[D],M=-M,E=S[C],y=-y),p.y<T.y||p.y>E.y)continue;if(p.y===T.y){if(p.x===T.x)return!0}else{const w=y*(p.x-T.x)-M*(p.y-T.y);if(w===0)return!0;if(w<0)continue;x=!x}}else{if(p.y!==T.y)continue;if(E.x<=p.x&&p.x<=T.x||T.x<=p.x&&p.x<=E.x)return!0}}return x}const r=Hr.isClockWise,s=this.subPaths;if(s.length===0)return[];let a,o,l;const c=[];if(s.length===1)return o=s[0],l=new fl,l.curves=o.curves,c.push(l),c;let u=!r(s[0].getPoints());u=e?!u:u;const f=[],h=[];let d=[],g=0,_;h[g]=void 0,d[g]=[];for(let p=0,S=s.length;p<S;p++)o=s[p],_=o.getPoints(),a=r(_),a=e?!a:a,a?(!u&&h[g]&&g++,h[g]={s:new fl,p:_},h[g].s.curves=o.curves,u&&g++,d[g]=[]):d[g].push({h:o,p:_[0]});if(!h[0])return t(s);if(h.length>1){let p=!1,S=0;for(let v=0,x=h.length;v<x;v++)f[v]=[];for(let v=0,x=h.length;v<x;v++){const C=d[v];for(let D=0;D<C.length;D++){const T=C[D];let E=!0;for(let M=0;M<h.length;M++)n(T.p,h[M].p)&&(v!==M&&S++,E?(E=!1,f[M].push(T)):p=!0);E&&f[v].push(T)}}S>0&&p===!1&&(d=f)}let m;for(let p=0,S=h.length;p<S;p++){l=h[p].s,c.push(l),m=d[p];for(let v=0,x=m.length;v<x;v++)l.holes.push(m[v].h)}return c}}function ih(i,e,t,n){const r=q0(n);switch(t){case Mp:return i*e;case Tp:return i*e/r.components*r.byteLength;case Lf:return i*e/r.components*r.byteLength;case bp:return i*e*2/r.components*r.byteLength;case Ff:return i*e*2/r.components*r.byteLength;case Ep:return i*e*3/r.components*r.byteLength;case mi:return i*e*4/r.components*r.byteLength;case If:return i*e*4/r.components*r.byteLength;case sl:case al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ol:case ll:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case xu:case yu:return Math.max(i,16)*Math.max(e,8)/4;case vu:case Su:return Math.max(i,8)*Math.max(e,8)/2;case Mu:case Eu:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Tu:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case bu:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Du:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Cu:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Au:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case wu:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ru:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Pu:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Lu:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Fu:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Iu:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ou:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Uu:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Nu:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Bu:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case cl:case zu:case ku:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Dp:case Vu:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Hu:case Gu:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function q0(i){switch(i){case wi:case xp:return{byteLength:1,components:1};case Wa:case Sp:case lo:return{byteLength:2,components:1};case Rf:case Pf:return{byteLength:2,components:4};case Qr:case wf:case Xi:return{byteLength:4,components:1};case yp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cf);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function jp(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Y0(i){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,f=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const u=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,u);else{f.sort((d,g)=>d.start-g.start);let h=0;for(let d=1;d<f.length;d++){const g=f[h],_=f[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,f[h]=_)}f.length=h+1;for(let d=0,g=f.length;d<g;d++){const _=f[d];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var $0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,j0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Z0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,K0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,J0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Q0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ev=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,tv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,iv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,rv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,av=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ov=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,lv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,uv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,fv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,dv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,pv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,mv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gv=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,_v=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,vv=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,xv=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Sv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,yv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Mv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ev=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Tv="gl_FragColor = linearToOutputTexel( gl_FragColor );",bv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Dv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Cv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Av=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Rv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Pv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Iv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ov=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Uv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Nv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bv=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zv=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,kv=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Vv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hv=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Wv=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Xv=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,qv=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Yv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$v=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,jv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Zv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Kv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ex=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,nx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ix=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ax=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ox=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ux=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,dx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,hx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,px=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,_x=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Sx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,yx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Mx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ex=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Dx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Cx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ax=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Rx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Px=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Fx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ix=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ox=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ux=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Nx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Vx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Hx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Gx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,qx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Yx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$x=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,eS=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,tS=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,nS=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,iS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sS=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,aS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,oS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,lS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cS=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uS=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fS=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,dS=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hS=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,pS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,mS=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gS=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_S=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,vS=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,SS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,MS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ES=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,TS=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,bS=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,DS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,nt={alphahash_fragment:$0,alphahash_pars_fragment:j0,alphamap_fragment:Z0,alphamap_pars_fragment:K0,alphatest_fragment:J0,alphatest_pars_fragment:Q0,aomap_fragment:ev,aomap_pars_fragment:tv,batching_pars_vertex:nv,batching_vertex:iv,begin_vertex:rv,beginnormal_vertex:sv,bsdfs:av,iridescence_fragment:ov,bumpmap_pars_fragment:lv,clipping_planes_fragment:cv,clipping_planes_pars_fragment:uv,clipping_planes_pars_vertex:fv,clipping_planes_vertex:dv,color_fragment:hv,color_pars_fragment:pv,color_pars_vertex:mv,color_vertex:gv,common:_v,cube_uv_reflection_fragment:vv,defaultnormal_vertex:xv,displacementmap_pars_vertex:Sv,displacementmap_vertex:yv,emissivemap_fragment:Mv,emissivemap_pars_fragment:Ev,colorspace_fragment:Tv,colorspace_pars_fragment:bv,envmap_fragment:Dv,envmap_common_pars_fragment:Cv,envmap_pars_fragment:Av,envmap_pars_vertex:wv,envmap_physical_pars_fragment:kv,envmap_vertex:Rv,fog_vertex:Pv,fog_pars_vertex:Lv,fog_fragment:Fv,fog_pars_fragment:Iv,gradientmap_pars_fragment:Ov,lightmap_pars_fragment:Uv,lights_lambert_fragment:Nv,lights_lambert_pars_fragment:Bv,lights_pars_begin:zv,lights_toon_fragment:Vv,lights_toon_pars_fragment:Hv,lights_phong_fragment:Gv,lights_phong_pars_fragment:Wv,lights_physical_fragment:Xv,lights_physical_pars_fragment:qv,lights_fragment_begin:Yv,lights_fragment_maps:$v,lights_fragment_end:jv,logdepthbuf_fragment:Zv,logdepthbuf_pars_fragment:Kv,logdepthbuf_pars_vertex:Jv,logdepthbuf_vertex:Qv,map_fragment:ex,map_pars_fragment:tx,map_particle_fragment:nx,map_particle_pars_fragment:ix,metalnessmap_fragment:rx,metalnessmap_pars_fragment:sx,morphinstance_vertex:ax,morphcolor_vertex:ox,morphnormal_vertex:lx,morphtarget_pars_vertex:cx,morphtarget_vertex:ux,normal_fragment_begin:fx,normal_fragment_maps:dx,normal_pars_fragment:hx,normal_pars_vertex:px,normal_vertex:mx,normalmap_pars_fragment:gx,clearcoat_normal_fragment_begin:_x,clearcoat_normal_fragment_maps:vx,clearcoat_pars_fragment:xx,iridescence_pars_fragment:Sx,opaque_fragment:yx,packing:Mx,premultiplied_alpha_fragment:Ex,project_vertex:Tx,dithering_fragment:bx,dithering_pars_fragment:Dx,roughnessmap_fragment:Cx,roughnessmap_pars_fragment:Ax,shadowmap_pars_fragment:wx,shadowmap_pars_vertex:Rx,shadowmap_vertex:Px,shadowmask_pars_fragment:Lx,skinbase_vertex:Fx,skinning_pars_vertex:Ix,skinning_vertex:Ox,skinnormal_vertex:Ux,specularmap_fragment:Nx,specularmap_pars_fragment:Bx,tonemapping_fragment:zx,tonemapping_pars_fragment:kx,transmission_fragment:Vx,transmission_pars_fragment:Hx,uv_pars_fragment:Gx,uv_pars_vertex:Wx,uv_vertex:Xx,worldpos_vertex:qx,background_vert:Yx,background_frag:$x,backgroundCube_vert:jx,backgroundCube_frag:Zx,cube_vert:Kx,cube_frag:Jx,depth_vert:Qx,depth_frag:eS,distanceRGBA_vert:tS,distanceRGBA_frag:nS,equirect_vert:iS,equirect_frag:rS,linedashed_vert:sS,linedashed_frag:aS,meshbasic_vert:oS,meshbasic_frag:lS,meshlambert_vert:cS,meshlambert_frag:uS,meshmatcap_vert:fS,meshmatcap_frag:dS,meshnormal_vert:hS,meshnormal_frag:pS,meshphong_vert:mS,meshphong_frag:gS,meshphysical_vert:_S,meshphysical_frag:vS,meshtoon_vert:xS,meshtoon_frag:SS,points_vert:yS,points_frag:MS,shadow_vert:ES,shadow_frag:TS,sprite_vert:bS,sprite_frag:DS},be={common:{diffuse:{value:new ct(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ct(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ct(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new ct(16777215)},opacity:{value:1},center:{value:new ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},Mi={basic:{uniforms:_n([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:nt.meshbasic_vert,fragmentShader:nt.meshbasic_frag},lambert:{uniforms:_n([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new ct(0)}}]),vertexShader:nt.meshlambert_vert,fragmentShader:nt.meshlambert_frag},phong:{uniforms:_n([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new ct(0)},specular:{value:new ct(1118481)},shininess:{value:30}}]),vertexShader:nt.meshphong_vert,fragmentShader:nt.meshphong_frag},standard:{uniforms:_n([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new ct(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag},toon:{uniforms:_n([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new ct(0)}}]),vertexShader:nt.meshtoon_vert,fragmentShader:nt.meshtoon_frag},matcap:{uniforms:_n([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:nt.meshmatcap_vert,fragmentShader:nt.meshmatcap_frag},points:{uniforms:_n([be.points,be.fog]),vertexShader:nt.points_vert,fragmentShader:nt.points_frag},dashed:{uniforms:_n([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:nt.linedashed_vert,fragmentShader:nt.linedashed_frag},depth:{uniforms:_n([be.common,be.displacementmap]),vertexShader:nt.depth_vert,fragmentShader:nt.depth_frag},normal:{uniforms:_n([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:nt.meshnormal_vert,fragmentShader:nt.meshnormal_frag},sprite:{uniforms:_n([be.sprite,be.fog]),vertexShader:nt.sprite_vert,fragmentShader:nt.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:nt.background_vert,fragmentShader:nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:nt.backgroundCube_vert,fragmentShader:nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:nt.cube_vert,fragmentShader:nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:nt.equirect_vert,fragmentShader:nt.equirect_frag},distanceRGBA:{uniforms:_n([be.common,be.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:nt.distanceRGBA_vert,fragmentShader:nt.distanceRGBA_frag},shadow:{uniforms:_n([be.lights,be.fog,{color:{value:new ct(0)},opacity:{value:1}}]),vertexShader:nt.shadow_vert,fragmentShader:nt.shadow_frag}};Mi.physical={uniforms:_n([Mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new ct(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new ct(0)},specularColor:{value:new ct(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag};const ko={r:0,b:0,g:0},Rr=new Ri,CS=new Dt;function AS(i,e,t,n,r,s,a){const o=new ct(0);let l=s===!0?0:1,c,u,f=null,h=0,d=null;function g(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?t:e).get(x)),x}function _(v){let x=!1;const C=g(v);C===null?p(o,l):C&&C.isColor&&(p(C,1),x=!0);const D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(v,x){const C=g(x);C&&(C.isCubeTexture||C.mapping===Gl)?(u===void 0&&(u=new Yi(new fo(1,1,1),new Sr({name:"BackgroundCubeMaterial",uniforms:$s(Mi.backgroundCube.uniforms),vertexShader:Mi.backgroundCube.vertexShader,fragmentShader:Mi.backgroundCube.fragmentShader,side:An,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(D,T,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Rr.copy(x.backgroundRotation),Rr.x*=-1,Rr.y*=-1,Rr.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Rr.y*=-1,Rr.z*=-1),u.material.uniforms.envMap.value=C,u.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(CS.makeRotationFromEuler(Rr)),u.material.toneMapped=dt.getTransfer(C.colorSpace)!==vt,(f!==C||h!==C.version||d!==i.toneMapping)&&(u.material.needsUpdate=!0,f=C,h=C.version,d=i.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new Yi(new Xl(2,2),new Sr({name:"BackgroundMaterial",uniforms:$s(Mi.background.uniforms),vertexShader:Mi.background.vertexShader,fragmentShader:Mi.background.fragmentShader,side:xr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=dt.getTransfer(C.colorSpace)!==vt,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(f!==C||h!==C.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,f=C,h=C.version,d=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function p(v,x){v.getRGB(ko,Up(i)),n.buffers.color.setClear(ko.r,ko.g,ko.b,x,a)}function S(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,x=1){o.set(v),l=x,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,p(o,l)},render:_,addToRenderList:m,dispose:S}}function wS(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=h(null);let s=r,a=!1;function o(y,w,I,U,V){let q=!1;const X=f(U,I,w);s!==X&&(s=X,c(s.object)),q=d(y,U,I,V),q&&g(y,U,I,V),V!==null&&e.update(V,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,x(y,w,I,U),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function u(y){return i.deleteVertexArray(y)}function f(y,w,I){const U=I.wireframe===!0;let V=n[y.id];V===void 0&&(V={},n[y.id]=V);let q=V[w.id];q===void 0&&(q={},V[w.id]=q);let X=q[U];return X===void 0&&(X=h(l()),q[U]=X),X}function h(y){const w=[],I=[],U=[];for(let V=0;V<t;V++)w[V]=0,I[V]=0,U[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:I,attributeDivisors:U,object:y,attributes:{},index:null}}function d(y,w,I,U){const V=s.attributes,q=w.attributes;let X=0;const H=I.getAttributes();for(const N in H)if(H[N].location>=0){const L=V[N];let ae=q[N];if(ae===void 0&&(N==="instanceMatrix"&&y.instanceMatrix&&(ae=y.instanceMatrix),N==="instanceColor"&&y.instanceColor&&(ae=y.instanceColor)),L===void 0||L.attribute!==ae||ae&&L.data!==ae.data)return!0;X++}return s.attributesNum!==X||s.index!==U}function g(y,w,I,U){const V={},q=w.attributes;let X=0;const H=I.getAttributes();for(const N in H)if(H[N].location>=0){let L=q[N];L===void 0&&(N==="instanceMatrix"&&y.instanceMatrix&&(L=y.instanceMatrix),N==="instanceColor"&&y.instanceColor&&(L=y.instanceColor));const ae={};ae.attribute=L,L&&L.data&&(ae.data=L.data),V[N]=ae,X++}s.attributes=V,s.attributesNum=X,s.index=U}function _(){const y=s.newAttributes;for(let w=0,I=y.length;w<I;w++)y[w]=0}function m(y){p(y,0)}function p(y,w){const I=s.newAttributes,U=s.enabledAttributes,V=s.attributeDivisors;I[y]=1,U[y]===0&&(i.enableVertexAttribArray(y),U[y]=1),V[y]!==w&&(i.vertexAttribDivisor(y,w),V[y]=w)}function S(){const y=s.newAttributes,w=s.enabledAttributes;for(let I=0,U=w.length;I<U;I++)w[I]!==y[I]&&(i.disableVertexAttribArray(I),w[I]=0)}function v(y,w,I,U,V,q,X){X===!0?i.vertexAttribIPointer(y,w,I,V,q):i.vertexAttribPointer(y,w,I,U,V,q)}function x(y,w,I,U){_();const V=U.attributes,q=I.getAttributes(),X=w.defaultAttributeValues;for(const H in q){const N=q[H];if(N.location>=0){let Q=V[H];if(Q===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(Q=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(Q=y.instanceColor)),Q!==void 0){const L=Q.normalized,ae=Q.itemSize,Ie=e.get(Q);if(Ie===void 0)continue;const qe=Ie.buffer,Z=Ie.type,oe=Ie.bytesPerElement,xe=Z===i.INT||Z===i.UNSIGNED_INT||Q.gpuType===wf;if(Q.isInterleavedBufferAttribute){const fe=Q.data,Ae=fe.stride,Ne=Q.offset;if(fe.isInstancedInterleavedBuffer){for(let Oe=0;Oe<N.locationSize;Oe++)p(N.location+Oe,fe.meshPerAttribute);y.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Oe=0;Oe<N.locationSize;Oe++)m(N.location+Oe);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let Oe=0;Oe<N.locationSize;Oe++)v(N.location+Oe,ae/N.locationSize,Z,L,Ae*oe,(Ne+ae/N.locationSize*Oe)*oe,xe)}else{if(Q.isInstancedBufferAttribute){for(let fe=0;fe<N.locationSize;fe++)p(N.location+fe,Q.meshPerAttribute);y.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let fe=0;fe<N.locationSize;fe++)m(N.location+fe);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let fe=0;fe<N.locationSize;fe++)v(N.location+fe,ae/N.locationSize,Z,L,ae*oe,ae/N.locationSize*fe*oe,xe)}}else if(X!==void 0){const L=X[H];if(L!==void 0)switch(L.length){case 2:i.vertexAttrib2fv(N.location,L);break;case 3:i.vertexAttrib3fv(N.location,L);break;case 4:i.vertexAttrib4fv(N.location,L);break;default:i.vertexAttrib1fv(N.location,L)}}}}S()}function C(){E();for(const y in n){const w=n[y];for(const I in w){const U=w[I];for(const V in U)u(U[V].object),delete U[V];delete w[I]}delete n[y]}}function D(y){if(n[y.id]===void 0)return;const w=n[y.id];for(const I in w){const U=w[I];for(const V in U)u(U[V].object),delete U[V];delete w[I]}delete n[y.id]}function T(y){for(const w in n){const I=n[w];if(I[y.id]===void 0)continue;const U=I[y.id];for(const V in U)u(U[V].object),delete U[V];delete I[y.id]}}function E(){M(),a=!0,s!==r&&(s=r,c(s.object))}function M(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:E,resetDefaultState:M,dispose:C,releaseStatesOfGeometry:D,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function RS(i,e,t){let n;function r(c){n=c}function s(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,f){f!==0&&(i.drawArraysInstanced(n,c,u,f),t.update(u,n,f))}function o(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,f);let d=0;for(let g=0;g<f;g++)d+=u[g];t.update(d,n,1)}function l(c,u,f,h){if(f===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)a(c[g],u[g],h[g]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,u,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_]*h[_];t.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function PS(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(T){return!(T!==mi&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const E=T===lo&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==wi&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==Xi&&!E)}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,D=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:h,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:v,maxFragmentUniforms:x,vertexTextures:C,maxSamples:D}}function LS(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new ar,o=new tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const d=f.length!==0||h||n!==0||r;return r=h,n=f.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){t=u(f,h,0)},this.setState=function(f,h,d){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,p=i.get(f);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const S=s?0:n,v=S*4;let x=p.clippingState||null;l.value=x,x=u(g,h,v,d);for(let C=0;C!==v;++C)x[C]=t[C];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(f,h,d,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=d+_*4,S=h.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,x=d;v!==_;++v,x+=4)a.copy(f[v]).applyMatrix4(S,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function FS(i){let e=new WeakMap;function t(a,o){return o===pu?a.mapping=Xs:o===mu&&(a.mapping=qs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===pu||o===mu)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Z_(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}const Ls=4,rh=[.125,.215,.35,.446,.526,.582],zr=20,wc=new Pa,sh=new ct;let Rc=null,Pc=0,Lc=0,Fc=!1;const Ir=(1+Math.sqrt(5))/2,Ds=1/Ir,ah=[new z(-Ir,Ds,0),new z(Ir,Ds,0),new z(-Ds,0,Ir),new z(Ds,0,Ir),new z(0,Ir,-Ds),new z(0,Ir,Ds),new z(-1,1,-1),new z(1,1,-1),new z(-1,1,1),new z(1,1,1)],IS=new z;class oh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100,s={}){const{size:a=256,position:o=IS}=s;Rc=this._renderer.getRenderTarget(),Pc=this._renderer.getActiveCubeFace(),Lc=this._renderer.getActiveMipmapLevel(),Fc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,r,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=uh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ch(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Rc,Pc,Lc),this._renderer.xr.enabled=Fc,e.scissorTest=!1,Vo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Xs||e.mapping===qs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Rc=this._renderer.getRenderTarget(),Pc=this._renderer.getActiveCubeFace(),Lc=this._renderer.getActiveMipmapLevel(),Fc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ti,minFilter:Ti,generateMipmaps:!1,type:lo,format:mi,colorSpace:Ys,depthBuffer:!1},r=lh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lh(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=OS(s)),this._blurMaterial=US(s,e,t)}return r}_compileMaterial(e){const t=new Yi(this._lodPlanes[0],e);this._renderer.compile(t,wc)}_sceneToCubeUV(e,t,n,r,s){const l=new yn(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(sh),f.toneMapping=mr,f.autoClear=!1;const g=new Fp({name:"PMREM.Background",side:An,depthWrite:!1,depthTest:!1}),_=new Yi(new fo,g);let m=!1;const p=e.background;p?p.isColor&&(g.color.copy(p),e.background=null,m=!0):(g.color.copy(sh),m=!0);for(let S=0;S<6;S++){const v=S%3;v===0?(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[S],s.y,s.z)):v===1?(l.up.set(0,0,c[S]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[S],s.z)):(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[S]));const x=this._cubeSize;Vo(r,v*x,S>2?x:0,x,x),f.setRenderTarget(r),m&&f.render(_,l),f.render(e,l)}_.geometry.dispose(),_.material.dispose(),f.toneMapping=d,f.autoClear=h,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===Xs||e.mapping===qs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=uh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ch());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Yi(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Vo(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,wc)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=ah[(r-s-1)%ah.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Yi(this._lodPlanes[r],c),h=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*zr-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):zr;m>zr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${zr}`);const p=[];let S=0;for(let T=0;T<zr;++T){const E=T/_,M=Math.exp(-E*E/2);p.push(M),T===0?S+=M:T<m&&(S+=2*M)}for(let T=0;T<p.length;T++)p[T]=p[T]/S;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:v}=this;h.dTheta.value=g,h.mipInt.value=v-n;const x=this._sizeLods[r],C=3*x*(r>v-Ls?r-v+Ls:0),D=4*(this._cubeSize-x);Vo(t,C,D,3*x,2*x),l.setRenderTarget(t),l.render(f,wc)}}function OS(i){const e=[],t=[],n=[];let r=i;const s=i-Ls+1+rh.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>i-Ls?l=rh[a-i+Ls-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,f=1+c,h=[u,u,f,u,f,f,u,u,f,f,u,f],d=6,g=6,_=3,m=2,p=1,S=new Float32Array(_*g*d),v=new Float32Array(m*g*d),x=new Float32Array(p*g*d);for(let D=0;D<d;D++){const T=D%3*2/3-1,E=D>2?0:-1,M=[T,E,0,T+2/3,E,0,T+2/3,E+1,0,T,E,0,T+2/3,E+1,0,T,E+1,0];S.set(M,_*g*D),v.set(h,m*g*D);const y=[D,D,D,D,D,D];x.set(y,p*g*D)}const C=new Li;C.setAttribute("position",new Ci(S,_)),C.setAttribute("uv",new Ci(v,m)),C.setAttribute("faceIndex",new Ci(x,p)),e.push(C),r>Ls&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function lh(i,e,t){const n=new es(i,e,t);return n.texture.mapping=Gl,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Vo(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function US(i,e,t){const n=new Float32Array(zr),r=new z(0,1,0);return new Sr({name:"SphericalGaussianBlur",defines:{n:zr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Hf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:pr,depthTest:!1,depthWrite:!1})}function ch(){return new Sr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:pr,depthTest:!1,depthWrite:!1})}function uh(){return new Sr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:pr,depthTest:!1,depthWrite:!1})}function Hf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function NS(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===pu||l===mu,u=l===Xs||l===qs;if(c||u){let f=e.get(o);const h=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new oh(i)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const d=o.image;return c&&d&&d.height>0||u&&d&&r(d)?(t===null&&(t=new oh(i)),f=c?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",s),f.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function BS(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&ul("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function zS(i,e,t,n){const r={},s=new WeakMap;function a(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete r[h.id];const d=s.get(h);d&&(e.remove(d),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(f,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,t.memory.geometries++),h}function l(f){const h=f.attributes;for(const d in h)e.update(h[d],i.ARRAY_BUFFER)}function c(f){const h=[],d=f.index,g=f.attributes.position;let _=0;if(d!==null){const S=d.array;_=d.version;for(let v=0,x=S.length;v<x;v+=3){const C=S[v+0],D=S[v+1],T=S[v+2];h.push(C,D,D,T,T,C)}}else if(g!==void 0){const S=g.array;_=g.version;for(let v=0,x=S.length/3-1;v<x;v+=3){const C=v+0,D=v+1,T=v+2;h.push(C,D,D,T,T,C)}}else return;const m=new(wp(h)?Op:Ip)(h,1);m.version=_;const p=s.get(f);p&&e.remove(p),s.set(f,m)}function u(f){const h=s.get(f);if(h){const d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function kS(i,e,t){let n;function r(h){n=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,d){i.drawElements(n,d,s,h*a),t.update(d,n,1)}function c(h,d,g){g!==0&&(i.drawElementsInstanced(n,d,s,h*a,g),t.update(d,n,g))}function u(h,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,h,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];t.update(m,n,1)}function f(h,d,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)c(h[p]/a,d[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,s,h,0,_,0,g);let p=0;for(let S=0;S<g;S++)p+=d[S]*_[S];t.update(p,n,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function VS(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function HS(i,e,t){const n=new WeakMap,r=new xt;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let h=n.get(o);if(h===void 0||h.count!==f){let M=function(){T.dispose(),n.delete(o),o.removeEventListener("dispose",M)};h!==void 0&&h.texture.dispose();const d=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let v=0;d===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let x=o.attributes.position.count*v,C=1;x>e.maxTextureSize&&(C=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const D=new Float32Array(x*C*4*f),T=new Rp(D,x,C,f);T.type=Xi,T.needsUpdate=!0;const E=v*4;for(let y=0;y<f;y++){const w=m[y],I=p[y],U=S[y],V=x*C*4*y;for(let q=0;q<w.count;q++){const X=q*E;d===!0&&(r.fromBufferAttribute(w,q),D[V+X+0]=r.x,D[V+X+1]=r.y,D[V+X+2]=r.z,D[V+X+3]=0),g===!0&&(r.fromBufferAttribute(I,q),D[V+X+4]=r.x,D[V+X+5]=r.y,D[V+X+6]=r.z,D[V+X+7]=0),_===!0&&(r.fromBufferAttribute(U,q),D[V+X+8]=r.x,D[V+X+9]=r.y,D[V+X+10]=r.z,D[V+X+11]=U.itemSize===4?r.w:1)}}h={count:f,texture:T,size:new ge(x,C)},n.set(o,h),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];const g=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:s}}function GS(i,e,t,n){let r=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return f}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}const Zp=new wn,fh=new zp(1,1),Kp=new Rp,Jp=new F_,Qp=new Bp,dh=[],hh=[],ph=new Float32Array(16),mh=new Float32Array(9),gh=new Float32Array(4);function sa(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=dh[r];if(s===void 0&&(s=new Float32Array(r),dh[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function $t(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function jt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ql(i,e){let t=hh[e];t===void 0&&(t=new Int32Array(e),hh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function WS(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function XS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2fv(this.addr,e),jt(t,e)}}function qS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if($t(t,e))return;i.uniform3fv(this.addr,e),jt(t,e)}}function YS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4fv(this.addr,e),jt(t,e)}}function $S(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),jt(t,e)}else{if($t(t,n))return;gh.set(n),i.uniformMatrix2fv(this.addr,!1,gh),jt(t,n)}}function jS(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),jt(t,e)}else{if($t(t,n))return;mh.set(n),i.uniformMatrix3fv(this.addr,!1,mh),jt(t,n)}}function ZS(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),jt(t,e)}else{if($t(t,n))return;ph.set(n),i.uniformMatrix4fv(this.addr,!1,ph),jt(t,n)}}function KS(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function JS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2iv(this.addr,e),jt(t,e)}}function QS(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;i.uniform3iv(this.addr,e),jt(t,e)}}function ey(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4iv(this.addr,e),jt(t,e)}}function ty(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function ny(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2uiv(this.addr,e),jt(t,e)}}function iy(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;i.uniform3uiv(this.addr,e),jt(t,e)}}function ry(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4uiv(this.addr,e),jt(t,e)}}function sy(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(fh.compareFunction=Ap,s=fh):s=Zp,t.setTexture2D(e||s,r)}function ay(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Jp,r)}function oy(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Qp,r)}function ly(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Kp,r)}function cy(i){switch(i){case 5126:return WS;case 35664:return XS;case 35665:return qS;case 35666:return YS;case 35674:return $S;case 35675:return jS;case 35676:return ZS;case 5124:case 35670:return KS;case 35667:case 35671:return JS;case 35668:case 35672:return QS;case 35669:case 35673:return ey;case 5125:return ty;case 36294:return ny;case 36295:return iy;case 36296:return ry;case 35678:case 36198:case 36298:case 36306:case 35682:return sy;case 35679:case 36299:case 36307:return ay;case 35680:case 36300:case 36308:case 36293:return oy;case 36289:case 36303:case 36311:case 36292:return ly}}function uy(i,e){i.uniform1fv(this.addr,e)}function fy(i,e){const t=sa(e,this.size,2);i.uniform2fv(this.addr,t)}function dy(i,e){const t=sa(e,this.size,3);i.uniform3fv(this.addr,t)}function hy(i,e){const t=sa(e,this.size,4);i.uniform4fv(this.addr,t)}function py(i,e){const t=sa(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function my(i,e){const t=sa(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function gy(i,e){const t=sa(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function _y(i,e){i.uniform1iv(this.addr,e)}function vy(i,e){i.uniform2iv(this.addr,e)}function xy(i,e){i.uniform3iv(this.addr,e)}function Sy(i,e){i.uniform4iv(this.addr,e)}function yy(i,e){i.uniform1uiv(this.addr,e)}function My(i,e){i.uniform2uiv(this.addr,e)}function Ey(i,e){i.uniform3uiv(this.addr,e)}function Ty(i,e){i.uniform4uiv(this.addr,e)}function by(i,e,t){const n=this.cache,r=e.length,s=ql(t,r);$t(n,s)||(i.uniform1iv(this.addr,s),jt(n,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||Zp,s[a])}function Dy(i,e,t){const n=this.cache,r=e.length,s=ql(t,r);$t(n,s)||(i.uniform1iv(this.addr,s),jt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Jp,s[a])}function Cy(i,e,t){const n=this.cache,r=e.length,s=ql(t,r);$t(n,s)||(i.uniform1iv(this.addr,s),jt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Qp,s[a])}function Ay(i,e,t){const n=this.cache,r=e.length,s=ql(t,r);$t(n,s)||(i.uniform1iv(this.addr,s),jt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Kp,s[a])}function wy(i){switch(i){case 5126:return uy;case 35664:return fy;case 35665:return dy;case 35666:return hy;case 35674:return py;case 35675:return my;case 35676:return gy;case 5124:case 35670:return _y;case 35667:case 35671:return vy;case 35668:case 35672:return xy;case 35669:case 35673:return Sy;case 5125:return yy;case 36294:return My;case 36295:return Ey;case 36296:return Ty;case 35678:case 36198:case 36298:case 36306:case 35682:return by;case 35679:case 36299:case 36307:return Dy;case 35680:case 36300:case 36308:case 36293:return Cy;case 36289:case 36303:case 36311:case 36292:return Ay}}class Ry{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=cy(t.type)}}class Py{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=wy(t.type)}}class Ly{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const Ic=/(\w+)(\])?(\[|\.)?/g;function _h(i,e){i.seq.push(e),i.map[e.id]=e}function Fy(i,e,t){const n=i.name,r=n.length;for(Ic.lastIndex=0;;){const s=Ic.exec(n),a=Ic.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){_h(t,c===void 0?new Ry(o,i,e):new Py(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new Ly(o),_h(t,f)),t=f}}}class dl{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);Fy(s,a,this)}}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function vh(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Iy=37297;let Oy=0;function Uy(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const xh=new tt;function Ny(i){dt._getMatrix(xh,dt.workingColorSpace,i);const e=`mat3( ${xh.elements.map(t=>t.toFixed(4))} )`;switch(dt.getTransfer(i)){case Tl:return[e,"LinearTransferOETF"];case vt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Sh(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Uy(i.getShaderSource(e),a)}else return r}function By(i,e){const t=Ny(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function zy(i,e){let t;switch(e){case s_:t="Linear";break;case a_:t="Reinhard";break;case o_:t="Cineon";break;case l_:t="ACESFilmic";break;case u_:t="AgX";break;case f_:t="Neutral";break;case c_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ho=new z;function ky(){dt.getLuminanceCoefficients(Ho);const i=Ho.x.toFixed(4),e=Ho.y.toFixed(4),t=Ho.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Vy(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xa).join(`
`)}function Hy(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Gy(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function xa(i){return i!==""}function yh(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Mh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Wy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zu(i){return i.replace(Wy,qy)}const Xy=new Map;function qy(i,e){let t=nt[e];if(t===void 0){const n=Xy.get(e);if(n!==void 0)t=nt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Zu(t)}const Yy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Eh(i){return i.replace(Yy,$y)}function $y(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Th(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function jy(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===_p?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Bg?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ki&&(e="SHADOWMAP_TYPE_VSM"),e}function Zy(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Xs:case qs:e="ENVMAP_TYPE_CUBE";break;case Gl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ky(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case qs:e="ENVMAP_MODE_REFRACTION";break}return e}function Jy(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Af:e="ENVMAP_BLENDING_MULTIPLY";break;case i_:e="ENVMAP_BLENDING_MIX";break;case r_:e="ENVMAP_BLENDING_ADD";break}return e}function Qy(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function eM(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=jy(t),c=Zy(t),u=Ky(t),f=Jy(t),h=Qy(t),d=Vy(t),g=Hy(s),_=r.createProgram();let m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(xa).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(xa).join(`
`),p.length>0&&(p+=`
`)):(m=[Th(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xa).join(`
`),p=[Th(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==mr?"#define TONE_MAPPING":"",t.toneMapping!==mr?nt.tonemapping_pars_fragment:"",t.toneMapping!==mr?zy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",nt.colorspace_pars_fragment,By("linearToOutputTexel",t.outputColorSpace),ky(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(xa).join(`
`)),a=Zu(a),a=yh(a,t),a=Mh(a,t),o=Zu(o),o=yh(o,t),o=Mh(o,t),a=Eh(a),o=Eh(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Ed?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ed?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=S+m+a,x=S+p+o,C=vh(r,r.VERTEX_SHADER,v),D=vh(r,r.FRAGMENT_SHADER,x);r.attachShader(_,C),r.attachShader(_,D),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function T(w){if(i.debug.checkShaderErrors){const I=r.getProgramInfoLog(_).trim(),U=r.getShaderInfoLog(C).trim(),V=r.getShaderInfoLog(D).trim();let q=!0,X=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,C,D);else{const H=Sh(r,C,"vertex"),N=Sh(r,D,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+I+`
`+H+`
`+N)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(U===""||V==="")&&(X=!1);X&&(w.diagnostics={runnable:q,programLog:I,vertexShader:{log:U,prefix:m},fragmentShader:{log:V,prefix:p}})}r.deleteShader(C),r.deleteShader(D),E=new dl(r,_),M=Gy(r,_)}let E;this.getUniforms=function(){return E===void 0&&T(this),E};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(_,Iy)),y},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Oy++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=C,this.fragmentShader=D,this}let tM=0;class nM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new iM(e),t.set(e,n)),n}}class iM{constructor(e){this.id=tM++,this.code=e,this.usedTimes=0}}function rM(i,e,t,n,r,s,a){const o=new Pp,l=new nM,c=new Set,u=[],f=r.logarithmicDepthBuffer,h=r.vertexTextures;let d=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,y,w,I,U){const V=I.fog,q=U.geometry,X=M.isMeshStandardMaterial?I.environment:null,H=(M.isMeshStandardMaterial?t:e).get(M.envMap||X),N=H&&H.mapping===Gl?H.image.height:null,Q=g[M.type];M.precision!==null&&(d=r.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const L=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ae=L!==void 0?L.length:0;let Ie=0;q.morphAttributes.position!==void 0&&(Ie=1),q.morphAttributes.normal!==void 0&&(Ie=2),q.morphAttributes.color!==void 0&&(Ie=3);let qe,Z,oe,xe;if(Q){const Me=Mi[Q];qe=Me.vertexShader,Z=Me.fragmentShader}else qe=M.vertexShader,Z=M.fragmentShader,l.update(M),oe=l.getVertexShaderID(M),xe=l.getFragmentShaderID(M);const fe=i.getRenderTarget(),Ae=i.state.buffers.depth.getReversed(),Ne=U.isInstancedMesh===!0,Oe=U.isBatchedMesh===!0,et=!!M.map,Ye=!!M.matcap,Se=!!H,P=!!M.aoMap,de=!!M.lightMap,re=!!M.bumpMap,O=!!M.normalMap,ne=!!M.displacementMap,Ce=!!M.emissiveMap,se=!!M.metalnessMap,R=!!M.roughnessMap,b=M.anisotropy>0,G=M.clearcoat>0,J=M.dispersion>0,ie=M.iridescence>0,K=M.sheen>0,me=M.transmission>0,he=b&&!!M.anisotropyMap,Pe=G&&!!M.clearcoatMap,Ue=G&&!!M.clearcoatNormalMap,le=G&&!!M.clearcoatRoughnessMap,pe=ie&&!!M.iridescenceMap,Ve=ie&&!!M.iridescenceThicknessMap,ze=K&&!!M.sheenColorMap,De=K&&!!M.sheenRoughnessMap,B=!!M.specularMap,ee=!!M.specularColorMap,ye=!!M.specularIntensityMap,F=me&&!!M.transmissionMap,ue=me&&!!M.thicknessMap,$=!!M.gradientMap,te=!!M.alphaMap,_e=M.alphaTest>0,ve=!!M.alphaHash,ke=!!M.extensions;let Je=mr;M.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(Je=i.toneMapping);const _t={shaderID:Q,shaderType:M.type,shaderName:M.name,vertexShader:qe,fragmentShader:Z,defines:M.defines,customVertexShaderID:oe,customFragmentShaderID:xe,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:Oe,batchingColor:Oe&&U._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&U.instanceColor!==null,instancingMorph:Ne&&U.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:fe===null?i.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:Ys,alphaToCoverage:!!M.alphaToCoverage,map:et,matcap:Ye,envMap:Se,envMapMode:Se&&H.mapping,envMapCubeUVHeight:N,aoMap:P,lightMap:de,bumpMap:re,normalMap:O,displacementMap:h&&ne,emissiveMap:Ce,normalMapObjectSpace:O&&M.normalMapType===m_,normalMapTangentSpace:O&&M.normalMapType===Cp,metalnessMap:se,roughnessMap:R,anisotropy:b,anisotropyMap:he,clearcoat:G,clearcoatMap:Pe,clearcoatNormalMap:Ue,clearcoatRoughnessMap:le,dispersion:J,iridescence:ie,iridescenceMap:pe,iridescenceThicknessMap:Ve,sheen:K,sheenColorMap:ze,sheenRoughnessMap:De,specularMap:B,specularColorMap:ee,specularIntensityMap:ye,transmission:me,transmissionMap:F,thicknessMap:ue,gradientMap:$,opaque:M.transparent===!1&&M.blending===Us&&M.alphaToCoverage===!1,alphaMap:te,alphaTest:_e,alphaHash:ve,combine:M.combine,mapUv:et&&_(M.map.channel),aoMapUv:P&&_(M.aoMap.channel),lightMapUv:de&&_(M.lightMap.channel),bumpMapUv:re&&_(M.bumpMap.channel),normalMapUv:O&&_(M.normalMap.channel),displacementMapUv:ne&&_(M.displacementMap.channel),emissiveMapUv:Ce&&_(M.emissiveMap.channel),metalnessMapUv:se&&_(M.metalnessMap.channel),roughnessMapUv:R&&_(M.roughnessMap.channel),anisotropyMapUv:he&&_(M.anisotropyMap.channel),clearcoatMapUv:Pe&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Ue&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:le&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:Ve&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:ze&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:De&&_(M.sheenRoughnessMap.channel),specularMapUv:B&&_(M.specularMap.channel),specularColorMapUv:ee&&_(M.specularColorMap.channel),specularIntensityMapUv:ye&&_(M.specularIntensityMap.channel),transmissionMapUv:F&&_(M.transmissionMap.channel),thicknessMapUv:ue&&_(M.thicknessMap.channel),alphaMapUv:te&&_(M.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(O||b),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!q.attributes.uv&&(et||te),fog:!!V,useFog:M.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Ae,skinning:U.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:Ie,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&w.length>0,shadowMapType:i.shadowMap.type,toneMapping:Je,decodeVideoTexture:et&&M.map.isVideoTexture===!0&&dt.getTransfer(M.map.colorSpace)===vt,decodeVideoTextureEmissive:Ce&&M.emissiveMap.isVideoTexture===!0&&dt.getTransfer(M.emissiveMap.colorSpace)===vt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Gi,flipSided:M.side===An,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:ke&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ke&&M.extensions.multiDraw===!0||Oe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return _t.vertexUv1s=c.has(1),_t.vertexUv2s=c.has(2),_t.vertexUv3s=c.has(3),c.clear(),_t}function p(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const w in M.defines)y.push(w),y.push(M.defines[w]);return M.isRawShaderMaterial===!1&&(S(y,M),v(y,M),y.push(i.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function S(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function v(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function x(M){const y=g[M.type];let w;if(y){const I=Mi[y];w=q_.clone(I.uniforms)}else w=M.uniforms;return w}function C(M,y){let w;for(let I=0,U=u.length;I<U;I++){const V=u[I];if(V.cacheKey===y){w=V,++w.usedTimes;break}}return w===void 0&&(w=new eM(i,y,M,s),u.push(w)),w}function D(M){if(--M.usedTimes===0){const y=u.indexOf(M);u[y]=u[u.length-1],u.pop(),M.destroy()}}function T(M){l.remove(M)}function E(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:C,releaseProgram:D,releaseShaderCache:T,programs:u,dispose:E}}function sM(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,l){i.get(a)[o]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function aM(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function bh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Dh(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(f,h,d,g,_,m){let p=i[e];return p===void 0?(p={id:f.id,object:f,geometry:h,material:d,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},i[e]=p):(p.id=f.id,p.object=f,p.geometry=h,p.material=d,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=_,p.group=m),e++,p}function o(f,h,d,g,_,m){const p=a(f,h,d,g,_,m);d.transmission>0?n.push(p):d.transparent===!0?r.push(p):t.push(p)}function l(f,h,d,g,_,m){const p=a(f,h,d,g,_,m);d.transmission>0?n.unshift(p):d.transparent===!0?r.unshift(p):t.unshift(p)}function c(f,h){t.length>1&&t.sort(f||aM),n.length>1&&n.sort(h||bh),r.length>1&&r.sort(h||bh)}function u(){for(let f=e,h=i.length;f<h;f++){const d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function oM(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new Dh,i.set(n,[a])):r>=s.length?(a=new Dh,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function lM(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new z,color:new ct};break;case"SpotLight":t={position:new z,direction:new z,color:new ct,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new z,color:new ct,distance:0,decay:0};break;case"HemisphereLight":t={direction:new z,skyColor:new ct,groundColor:new ct};break;case"RectAreaLight":t={color:new ct,position:new z,halfWidth:new z,halfHeight:new z};break}return i[e.id]=t,t}}}function cM(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let uM=0;function fM(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function dM(i){const e=new lM,t=cM(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new z);const r=new z,s=new Dt,a=new Dt;function o(c){let u=0,f=0,h=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let d=0,g=0,_=0,m=0,p=0,S=0,v=0,x=0,C=0,D=0,T=0;c.sort(fM);for(let M=0,y=c.length;M<y;M++){const w=c[M],I=w.color,U=w.intensity,V=w.distance,q=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)u+=I.r*U,f+=I.g*U,h+=I.b*U;else if(w.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(w.sh.coefficients[X],U);T++}else if(w.isDirectionalLight){const X=e.get(w);if(X.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const H=w.shadow,N=t.get(w);N.shadowIntensity=H.intensity,N.shadowBias=H.bias,N.shadowNormalBias=H.normalBias,N.shadowRadius=H.radius,N.shadowMapSize=H.mapSize,n.directionalShadow[d]=N,n.directionalShadowMap[d]=q,n.directionalShadowMatrix[d]=w.shadow.matrix,S++}n.directional[d]=X,d++}else if(w.isSpotLight){const X=e.get(w);X.position.setFromMatrixPosition(w.matrixWorld),X.color.copy(I).multiplyScalar(U),X.distance=V,X.coneCos=Math.cos(w.angle),X.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),X.decay=w.decay,n.spot[_]=X;const H=w.shadow;if(w.map&&(n.spotLightMap[C]=w.map,C++,H.updateMatrices(w),w.castShadow&&D++),n.spotLightMatrix[_]=H.matrix,w.castShadow){const N=t.get(w);N.shadowIntensity=H.intensity,N.shadowBias=H.bias,N.shadowNormalBias=H.normalBias,N.shadowRadius=H.radius,N.shadowMapSize=H.mapSize,n.spotShadow[_]=N,n.spotShadowMap[_]=q,x++}_++}else if(w.isRectAreaLight){const X=e.get(w);X.color.copy(I).multiplyScalar(U),X.halfWidth.set(w.width*.5,0,0),X.halfHeight.set(0,w.height*.5,0),n.rectArea[m]=X,m++}else if(w.isPointLight){const X=e.get(w);if(X.color.copy(w.color).multiplyScalar(w.intensity),X.distance=w.distance,X.decay=w.decay,w.castShadow){const H=w.shadow,N=t.get(w);N.shadowIntensity=H.intensity,N.shadowBias=H.bias,N.shadowNormalBias=H.normalBias,N.shadowRadius=H.radius,N.shadowMapSize=H.mapSize,N.shadowCameraNear=H.camera.near,N.shadowCameraFar=H.camera.far,n.pointShadow[g]=N,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=w.shadow.matrix,v++}n.point[g]=X,g++}else if(w.isHemisphereLight){const X=e.get(w);X.skyColor.copy(w.color).multiplyScalar(U),X.groundColor.copy(w.groundColor).multiplyScalar(U),n.hemi[p]=X,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=be.LTC_FLOAT_1,n.rectAreaLTC2=be.LTC_FLOAT_2):(n.rectAreaLTC1=be.LTC_HALF_1,n.rectAreaLTC2=be.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=h;const E=n.hash;(E.directionalLength!==d||E.pointLength!==g||E.spotLength!==_||E.rectAreaLength!==m||E.hemiLength!==p||E.numDirectionalShadows!==S||E.numPointShadows!==v||E.numSpotShadows!==x||E.numSpotMaps!==C||E.numLightProbes!==T)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=x+C-D,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=D,n.numLightProbes=T,E.directionalLength=d,E.pointLength=g,E.spotLength=_,E.rectAreaLength=m,E.hemiLength=p,E.numDirectionalShadows=S,E.numPointShadows=v,E.numSpotShadows=x,E.numSpotMaps=C,E.numLightProbes=T,n.version=uM++)}function l(c,u){let f=0,h=0,d=0,g=0,_=0;const m=u.matrixWorldInverse;for(let p=0,S=c.length;p<S;p++){const v=c[p];if(v.isDirectionalLight){const x=n.directional[f];x.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),f++}else if(v.isSpotLight){const x=n.spot[d];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),d++}else if(v.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),a.identity(),s.copy(v.matrixWorld),s.premultiply(m),a.extractRotation(s),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(v.isPointLight){const x=n.point[h];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),h++}else if(v.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function Ch(i){const e=new dM(i),t=[],n=[];function r(u){c.camera=u,t.length=0,n.length=0}function s(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function hM(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Ch(i),e.set(r,[o])):s>=a.length?(o=new Ch(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const pM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,mM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function gM(i,e,t){let n=new Uf;const r=new ge,s=new ge,a=new xt,o=new U0({depthPacking:p_}),l=new N0,c={},u=t.maxTextureSize,f={[xr]:An,[An]:xr,[Gi]:Gi},h=new Sr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ge},radius:{value:4}},vertexShader:pM,fragmentShader:mM}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const g=new Li;g.setAttribute("position",new Ci(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Yi(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_p;let p=this.type;this.render=function(D,T,E){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||D.length===0)return;const M=i.getRenderTarget(),y=i.getActiveCubeFace(),w=i.getActiveMipmapLevel(),I=i.state;I.setBlending(pr),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const U=p!==ki&&this.type===ki,V=p===ki&&this.type!==ki;for(let q=0,X=D.length;q<X;q++){const H=D[q],N=H.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const Q=N.getFrameExtents();if(r.multiply(Q),s.copy(N.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/Q.x),r.x=s.x*Q.x,N.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/Q.y),r.y=s.y*Q.y,N.mapSize.y=s.y)),N.map===null||U===!0||V===!0){const ae=this.type!==ki?{minFilter:_i,magFilter:_i}:{};N.map!==null&&N.map.dispose(),N.map=new es(r.x,r.y,ae),N.map.texture.name=H.name+".shadowMap",N.camera.updateProjectionMatrix()}i.setRenderTarget(N.map),i.clear();const L=N.getViewportCount();for(let ae=0;ae<L;ae++){const Ie=N.getViewport(ae);a.set(s.x*Ie.x,s.y*Ie.y,s.x*Ie.z,s.y*Ie.w),I.viewport(a),N.updateMatrices(H,ae),n=N.getFrustum(),x(T,E,N.camera,H,this.type)}N.isPointLightShadow!==!0&&this.type===ki&&S(N,E),N.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,y,w)};function S(D,T){const E=e.update(_);h.defines.VSM_SAMPLES!==D.blurSamples&&(h.defines.VSM_SAMPLES=D.blurSamples,d.defines.VSM_SAMPLES=D.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),D.mapPass===null&&(D.mapPass=new es(r.x,r.y)),h.uniforms.shadow_pass.value=D.map.texture,h.uniforms.resolution.value=D.mapSize,h.uniforms.radius.value=D.radius,i.setRenderTarget(D.mapPass),i.clear(),i.renderBufferDirect(T,null,E,h,_,null),d.uniforms.shadow_pass.value=D.mapPass.texture,d.uniforms.resolution.value=D.mapSize,d.uniforms.radius.value=D.radius,i.setRenderTarget(D.map),i.clear(),i.renderBufferDirect(T,null,E,d,_,null)}function v(D,T,E,M){let y=null;const w=E.isPointLight===!0?D.customDistanceMaterial:D.customDepthMaterial;if(w!==void 0)y=w;else if(y=E.isPointLight===!0?l:o,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const I=y.uuid,U=T.uuid;let V=c[I];V===void 0&&(V={},c[I]=V);let q=V[U];q===void 0&&(q=y.clone(),V[U]=q,T.addEventListener("dispose",C)),y=q}if(y.visible=T.visible,y.wireframe=T.wireframe,M===ki?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:f[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,E.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const I=i.properties.get(y);I.light=E}return y}function x(D,T,E,M,y){if(D.visible===!1)return;if(D.layers.test(T.layers)&&(D.isMesh||D.isLine||D.isPoints)&&(D.castShadow||D.receiveShadow&&y===ki)&&(!D.frustumCulled||n.intersectsObject(D))){D.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,D.matrixWorld);const U=e.update(D),V=D.material;if(Array.isArray(V)){const q=U.groups;for(let X=0,H=q.length;X<H;X++){const N=q[X],Q=V[N.materialIndex];if(Q&&Q.visible){const L=v(D,Q,M,y);D.onBeforeShadow(i,D,T,E,U,L,N),i.renderBufferDirect(E,null,U,L,D,N),D.onAfterShadow(i,D,T,E,U,L,N)}}}else if(V.visible){const q=v(D,V,M,y);D.onBeforeShadow(i,D,T,E,U,q,null),i.renderBufferDirect(E,null,U,q,D,null),D.onAfterShadow(i,D,T,E,U,q,null)}}const I=D.children;for(let U=0,V=I.length;U<V;U++)x(I[U],T,E,M,y)}function C(D){D.target.removeEventListener("dispose",C);for(const E in c){const M=c[E],y=D.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}const _M={[ou]:lu,[cu]:du,[uu]:hu,[Ws]:fu,[lu]:ou,[du]:cu,[hu]:uu,[fu]:Ws};function vM(i,e){function t(){let F=!1;const ue=new xt;let $=null;const te=new xt(0,0,0,0);return{setMask:function(_e){$!==_e&&!F&&(i.colorMask(_e,_e,_e,_e),$=_e)},setLocked:function(_e){F=_e},setClear:function(_e,ve,ke,Je,_t){_t===!0&&(_e*=Je,ve*=Je,ke*=Je),ue.set(_e,ve,ke,Je),te.equals(ue)===!1&&(i.clearColor(_e,ve,ke,Je),te.copy(ue))},reset:function(){F=!1,$=null,te.set(-1,0,0,0)}}}function n(){let F=!1,ue=!1,$=null,te=null,_e=null;return{setReversed:function(ve){if(ue!==ve){const ke=e.get("EXT_clip_control");ve?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT),ue=ve;const Je=_e;_e=null,this.setClear(Je)}},getReversed:function(){return ue},setTest:function(ve){ve?fe(i.DEPTH_TEST):Ae(i.DEPTH_TEST)},setMask:function(ve){$!==ve&&!F&&(i.depthMask(ve),$=ve)},setFunc:function(ve){if(ue&&(ve=_M[ve]),te!==ve){switch(ve){case ou:i.depthFunc(i.NEVER);break;case lu:i.depthFunc(i.ALWAYS);break;case cu:i.depthFunc(i.LESS);break;case Ws:i.depthFunc(i.LEQUAL);break;case uu:i.depthFunc(i.EQUAL);break;case fu:i.depthFunc(i.GEQUAL);break;case du:i.depthFunc(i.GREATER);break;case hu:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}te=ve}},setLocked:function(ve){F=ve},setClear:function(ve){_e!==ve&&(ue&&(ve=1-ve),i.clearDepth(ve),_e=ve)},reset:function(){F=!1,$=null,te=null,_e=null,ue=!1}}}function r(){let F=!1,ue=null,$=null,te=null,_e=null,ve=null,ke=null,Je=null,_t=null;return{setTest:function(Me){F||(Me?fe(i.STENCIL_TEST):Ae(i.STENCIL_TEST))},setMask:function(Me){ue!==Me&&!F&&(i.stencilMask(Me),ue=Me)},setFunc:function(Me,Le,Ze){($!==Me||te!==Le||_e!==Ze)&&(i.stencilFunc(Me,Le,Ze),$=Me,te=Le,_e=Ze)},setOp:function(Me,Le,Ze){(ve!==Me||ke!==Le||Je!==Ze)&&(i.stencilOp(Me,Le,Ze),ve=Me,ke=Le,Je=Ze)},setLocked:function(Me){F=Me},setClear:function(Me){_t!==Me&&(i.clearStencil(Me),_t=Me)},reset:function(){F=!1,ue=null,$=null,te=null,_e=null,ve=null,ke=null,Je=null,_t=null}}}const s=new t,a=new n,o=new r,l=new WeakMap,c=new WeakMap;let u={},f={},h=new WeakMap,d=[],g=null,_=!1,m=null,p=null,S=null,v=null,x=null,C=null,D=null,T=new ct(0,0,0),E=0,M=!1,y=null,w=null,I=null,U=null,V=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,H=0;const N=i.getParameter(i.VERSION);N.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(N)[1]),X=H>=1):N.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),X=H>=2);let Q=null,L={};const ae=i.getParameter(i.SCISSOR_BOX),Ie=i.getParameter(i.VIEWPORT),qe=new xt().fromArray(ae),Z=new xt().fromArray(Ie);function oe(F,ue,$,te){const _e=new Uint8Array(4),ve=i.createTexture();i.bindTexture(F,ve),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ke=0;ke<$;ke++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(ue,0,i.RGBA,1,1,te,0,i.RGBA,i.UNSIGNED_BYTE,_e):i.texImage2D(ue+ke,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_e);return ve}const xe={};xe[i.TEXTURE_2D]=oe(i.TEXTURE_2D,i.TEXTURE_2D,1),xe[i.TEXTURE_CUBE_MAP]=oe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),xe[i.TEXTURE_2D_ARRAY]=oe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),xe[i.TEXTURE_3D]=oe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),fe(i.DEPTH_TEST),a.setFunc(Ws),re(!1),O(_d),fe(i.CULL_FACE),P(pr);function fe(F){u[F]!==!0&&(i.enable(F),u[F]=!0)}function Ae(F){u[F]!==!1&&(i.disable(F),u[F]=!1)}function Ne(F,ue){return f[F]!==ue?(i.bindFramebuffer(F,ue),f[F]=ue,F===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ue),F===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ue),!0):!1}function Oe(F,ue){let $=d,te=!1;if(F){$=h.get(ue),$===void 0&&($=[],h.set(ue,$));const _e=F.textures;if($.length!==_e.length||$[0]!==i.COLOR_ATTACHMENT0){for(let ve=0,ke=_e.length;ve<ke;ve++)$[ve]=i.COLOR_ATTACHMENT0+ve;$.length=_e.length,te=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,te=!0);te&&i.drawBuffers($)}function et(F){return g!==F?(i.useProgram(F),g=F,!0):!1}const Ye={[Br]:i.FUNC_ADD,[kg]:i.FUNC_SUBTRACT,[Vg]:i.FUNC_REVERSE_SUBTRACT};Ye[Hg]=i.MIN,Ye[Gg]=i.MAX;const Se={[Wg]:i.ZERO,[Xg]:i.ONE,[qg]:i.SRC_COLOR,[su]:i.SRC_ALPHA,[Jg]:i.SRC_ALPHA_SATURATE,[Zg]:i.DST_COLOR,[$g]:i.DST_ALPHA,[Yg]:i.ONE_MINUS_SRC_COLOR,[au]:i.ONE_MINUS_SRC_ALPHA,[Kg]:i.ONE_MINUS_DST_COLOR,[jg]:i.ONE_MINUS_DST_ALPHA,[Qg]:i.CONSTANT_COLOR,[e_]:i.ONE_MINUS_CONSTANT_COLOR,[t_]:i.CONSTANT_ALPHA,[n_]:i.ONE_MINUS_CONSTANT_ALPHA};function P(F,ue,$,te,_e,ve,ke,Je,_t,Me){if(F===pr){_===!0&&(Ae(i.BLEND),_=!1);return}if(_===!1&&(fe(i.BLEND),_=!0),F!==zg){if(F!==m||Me!==M){if((p!==Br||x!==Br)&&(i.blendEquation(i.FUNC_ADD),p=Br,x=Br),Me)switch(F){case Us:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vd:i.blendFunc(i.ONE,i.ONE);break;case xd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Sd:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Us:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vd:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case xd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Sd:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}S=null,v=null,C=null,D=null,T.set(0,0,0),E=0,m=F,M=Me}return}_e=_e||ue,ve=ve||$,ke=ke||te,(ue!==p||_e!==x)&&(i.blendEquationSeparate(Ye[ue],Ye[_e]),p=ue,x=_e),($!==S||te!==v||ve!==C||ke!==D)&&(i.blendFuncSeparate(Se[$],Se[te],Se[ve],Se[ke]),S=$,v=te,C=ve,D=ke),(Je.equals(T)===!1||_t!==E)&&(i.blendColor(Je.r,Je.g,Je.b,_t),T.copy(Je),E=_t),m=F,M=!1}function de(F,ue){F.side===Gi?Ae(i.CULL_FACE):fe(i.CULL_FACE);let $=F.side===An;ue&&($=!$),re($),F.blending===Us&&F.transparent===!1?P(pr):P(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),s.setMask(F.colorWrite);const te=F.stencilWrite;o.setTest(te),te&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ce(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?fe(i.SAMPLE_ALPHA_TO_COVERAGE):Ae(i.SAMPLE_ALPHA_TO_COVERAGE)}function re(F){y!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),y=F)}function O(F){F!==Ug?(fe(i.CULL_FACE),F!==w&&(F===_d?i.cullFace(i.BACK):F===Ng?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ae(i.CULL_FACE),w=F}function ne(F){F!==I&&(X&&i.lineWidth(F),I=F)}function Ce(F,ue,$){F?(fe(i.POLYGON_OFFSET_FILL),(U!==ue||V!==$)&&(i.polygonOffset(ue,$),U=ue,V=$)):Ae(i.POLYGON_OFFSET_FILL)}function se(F){F?fe(i.SCISSOR_TEST):Ae(i.SCISSOR_TEST)}function R(F){F===void 0&&(F=i.TEXTURE0+q-1),Q!==F&&(i.activeTexture(F),Q=F)}function b(F,ue,$){$===void 0&&(Q===null?$=i.TEXTURE0+q-1:$=Q);let te=L[$];te===void 0&&(te={type:void 0,texture:void 0},L[$]=te),(te.type!==F||te.texture!==ue)&&(Q!==$&&(i.activeTexture($),Q=$),i.bindTexture(F,ue||xe[F]),te.type=F,te.texture=ue)}function G(){const F=L[Q];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function J(){try{i.compressedTexImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ie(){try{i.compressedTexImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function K(){try{i.texSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function me(){try{i.texSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function he(){try{i.compressedTexSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Pe(){try{i.compressedTexSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ue(){try{i.texStorage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function le(){try{i.texStorage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function pe(){try{i.texImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ve(){try{i.texImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ze(F){qe.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),qe.copy(F))}function De(F){Z.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),Z.copy(F))}function B(F,ue){let $=c.get(ue);$===void 0&&($=new WeakMap,c.set(ue,$));let te=$.get(F);te===void 0&&(te=i.getUniformBlockIndex(ue,F.name),$.set(F,te))}function ee(F,ue){const te=c.get(ue).get(F);l.get(ue)!==te&&(i.uniformBlockBinding(ue,te,F.__bindingPointIndex),l.set(ue,te))}function ye(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},Q=null,L={},f={},h=new WeakMap,d=[],g=null,_=!1,m=null,p=null,S=null,v=null,x=null,C=null,D=null,T=new ct(0,0,0),E=0,M=!1,y=null,w=null,I=null,U=null,V=null,qe.set(0,0,i.canvas.width,i.canvas.height),Z.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:fe,disable:Ae,bindFramebuffer:Ne,drawBuffers:Oe,useProgram:et,setBlending:P,setMaterial:de,setFlipSided:re,setCullFace:O,setLineWidth:ne,setPolygonOffset:Ce,setScissorTest:se,activeTexture:R,bindTexture:b,unbindTexture:G,compressedTexImage2D:J,compressedTexImage3D:ie,texImage2D:pe,texImage3D:Ve,updateUBOMapping:B,uniformBlockBinding:ee,texStorage2D:Ue,texStorage3D:le,texSubImage2D:K,texSubImage3D:me,compressedTexSubImage2D:he,compressedTexSubImage3D:Pe,scissor:ze,viewport:De,reset:ye}}function xM(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ge,u=new WeakMap;let f;const h=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,b){return d?new OffscreenCanvas(R,b):Dl("canvas")}function _(R,b,G){let J=1;const ie=se(R);if((ie.width>G||ie.height>G)&&(J=G/Math.max(ie.width,ie.height)),J<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const K=Math.floor(J*ie.width),me=Math.floor(J*ie.height);f===void 0&&(f=g(K,me));const he=b?g(K,me):f;return he.width=K,he.height=me,he.getContext("2d").drawImage(R,0,0,K,me),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+K+"x"+me+")."),he}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),R;return R}function m(R){return R.generateMipmaps}function p(R){i.generateMipmap(R)}function S(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(R,b,G,J,ie=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let K=b;if(b===i.RED&&(G===i.FLOAT&&(K=i.R32F),G===i.HALF_FLOAT&&(K=i.R16F),G===i.UNSIGNED_BYTE&&(K=i.R8)),b===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(K=i.R8UI),G===i.UNSIGNED_SHORT&&(K=i.R16UI),G===i.UNSIGNED_INT&&(K=i.R32UI),G===i.BYTE&&(K=i.R8I),G===i.SHORT&&(K=i.R16I),G===i.INT&&(K=i.R32I)),b===i.RG&&(G===i.FLOAT&&(K=i.RG32F),G===i.HALF_FLOAT&&(K=i.RG16F),G===i.UNSIGNED_BYTE&&(K=i.RG8)),b===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(K=i.RG8UI),G===i.UNSIGNED_SHORT&&(K=i.RG16UI),G===i.UNSIGNED_INT&&(K=i.RG32UI),G===i.BYTE&&(K=i.RG8I),G===i.SHORT&&(K=i.RG16I),G===i.INT&&(K=i.RG32I)),b===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(K=i.RGB8UI),G===i.UNSIGNED_SHORT&&(K=i.RGB16UI),G===i.UNSIGNED_INT&&(K=i.RGB32UI),G===i.BYTE&&(K=i.RGB8I),G===i.SHORT&&(K=i.RGB16I),G===i.INT&&(K=i.RGB32I)),b===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),G===i.UNSIGNED_INT&&(K=i.RGBA32UI),G===i.BYTE&&(K=i.RGBA8I),G===i.SHORT&&(K=i.RGBA16I),G===i.INT&&(K=i.RGBA32I)),b===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),b===i.RGBA){const me=ie?Tl:dt.getTransfer(J);G===i.FLOAT&&(K=i.RGBA32F),G===i.HALF_FLOAT&&(K=i.RGBA16F),G===i.UNSIGNED_BYTE&&(K=me===vt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function x(R,b){let G;return R?b===null||b===Qr||b===Xa?G=i.DEPTH24_STENCIL8:b===Xi?G=i.DEPTH32F_STENCIL8:b===Wa&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Qr||b===Xa?G=i.DEPTH_COMPONENT24:b===Xi?G=i.DEPTH_COMPONENT32F:b===Wa&&(G=i.DEPTH_COMPONENT16),G}function C(R,b){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==_i&&R.minFilter!==Ti?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function D(R){const b=R.target;b.removeEventListener("dispose",D),E(b),b.isVideoTexture&&u.delete(b)}function T(R){const b=R.target;b.removeEventListener("dispose",T),y(b)}function E(R){const b=n.get(R);if(b.__webglInit===void 0)return;const G=R.source,J=h.get(G);if(J){const ie=J[b.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&M(R),Object.keys(J).length===0&&h.delete(G)}n.remove(R)}function M(R){const b=n.get(R);i.deleteTexture(b.__webglTexture);const G=R.source,J=h.get(G);delete J[b.__cacheKey],a.memory.textures--}function y(R){const b=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(b.__webglFramebuffer[J]))for(let ie=0;ie<b.__webglFramebuffer[J].length;ie++)i.deleteFramebuffer(b.__webglFramebuffer[J][ie]);else i.deleteFramebuffer(b.__webglFramebuffer[J]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[J])}else{if(Array.isArray(b.__webglFramebuffer))for(let J=0;J<b.__webglFramebuffer.length;J++)i.deleteFramebuffer(b.__webglFramebuffer[J]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let J=0;J<b.__webglColorRenderbuffer.length;J++)b.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[J]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const G=R.textures;for(let J=0,ie=G.length;J<ie;J++){const K=n.get(G[J]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),a.memory.textures--),n.remove(G[J])}n.remove(R)}let w=0;function I(){w=0}function U(){const R=w;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),w+=1,R}function V(R){const b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function q(R,b){const G=n.get(R);if(R.isVideoTexture&&ne(R),R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){const J=R.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(G,R,b);return}}t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+b)}function X(R,b){const G=n.get(R);if(R.version>0&&G.__version!==R.version){Z(G,R,b);return}t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+b)}function H(R,b){const G=n.get(R);if(R.version>0&&G.__version!==R.version){Z(G,R,b);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+b)}function N(R,b){const G=n.get(R);if(R.version>0&&G.__version!==R.version){oe(G,R,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+b)}const Q={[gu]:i.REPEAT,[kr]:i.CLAMP_TO_EDGE,[_u]:i.MIRRORED_REPEAT},L={[_i]:i.NEAREST,[d_]:i.NEAREST_MIPMAP_NEAREST,[po]:i.NEAREST_MIPMAP_LINEAR,[Ti]:i.LINEAR,[Ql]:i.LINEAR_MIPMAP_NEAREST,[Vr]:i.LINEAR_MIPMAP_LINEAR},ae={[g_]:i.NEVER,[M_]:i.ALWAYS,[__]:i.LESS,[Ap]:i.LEQUAL,[v_]:i.EQUAL,[y_]:i.GEQUAL,[x_]:i.GREATER,[S_]:i.NOTEQUAL};function Ie(R,b){if(b.type===Xi&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Ti||b.magFilter===Ql||b.magFilter===po||b.magFilter===Vr||b.minFilter===Ti||b.minFilter===Ql||b.minFilter===po||b.minFilter===Vr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,Q[b.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,Q[b.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,Q[b.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,L[b.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,L[b.minFilter]),b.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,ae[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===_i||b.minFilter!==po&&b.minFilter!==Vr||b.type===Xi&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function qe(R,b){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",D));const J=b.source;let ie=h.get(J);ie===void 0&&(ie={},h.set(J,ie));const K=V(b);if(K!==R.__cacheKey){ie[K]===void 0&&(ie[K]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),ie[K].usedTimes++;const me=ie[R.__cacheKey];me!==void 0&&(ie[R.__cacheKey].usedTimes--,me.usedTimes===0&&M(b)),R.__cacheKey=K,R.__webglTexture=ie[K].texture}return G}function Z(R,b,G){let J=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(J=i.TEXTURE_3D);const ie=qe(R,b),K=b.source;t.bindTexture(J,R.__webglTexture,i.TEXTURE0+G);const me=n.get(K);if(K.version!==me.__version||ie===!0){t.activeTexture(i.TEXTURE0+G);const he=dt.getPrimaries(dt.workingColorSpace),Pe=b.colorSpace===or?null:dt.getPrimaries(b.colorSpace),Ue=b.colorSpace===or||he===Pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ue);let le=_(b.image,!1,r.maxTextureSize);le=Ce(b,le);const pe=s.convert(b.format,b.colorSpace),Ve=s.convert(b.type);let ze=v(b.internalFormat,pe,Ve,b.colorSpace,b.isVideoTexture);Ie(J,b);let De;const B=b.mipmaps,ee=b.isVideoTexture!==!0,ye=me.__version===void 0||ie===!0,F=K.dataReady,ue=C(b,le);if(b.isDepthTexture)ze=x(b.format===Ya,b.type),ye&&(ee?t.texStorage2D(i.TEXTURE_2D,1,ze,le.width,le.height):t.texImage2D(i.TEXTURE_2D,0,ze,le.width,le.height,0,pe,Ve,null));else if(b.isDataTexture)if(B.length>0){ee&&ye&&t.texStorage2D(i.TEXTURE_2D,ue,ze,B[0].width,B[0].height);for(let $=0,te=B.length;$<te;$++)De=B[$],ee?F&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,De.width,De.height,pe,Ve,De.data):t.texImage2D(i.TEXTURE_2D,$,ze,De.width,De.height,0,pe,Ve,De.data);b.generateMipmaps=!1}else ee?(ye&&t.texStorage2D(i.TEXTURE_2D,ue,ze,le.width,le.height),F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,le.width,le.height,pe,Ve,le.data)):t.texImage2D(i.TEXTURE_2D,0,ze,le.width,le.height,0,pe,Ve,le.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){ee&&ye&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,ze,B[0].width,B[0].height,le.depth);for(let $=0,te=B.length;$<te;$++)if(De=B[$],b.format!==mi)if(pe!==null)if(ee){if(F)if(b.layerUpdates.size>0){const _e=ih(De.width,De.height,b.format,b.type);for(const ve of b.layerUpdates){const ke=De.data.subarray(ve*_e/De.data.BYTES_PER_ELEMENT,(ve+1)*_e/De.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,ve,De.width,De.height,1,pe,ke)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,De.width,De.height,le.depth,pe,De.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,$,ze,De.width,De.height,le.depth,0,De.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ee?F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,De.width,De.height,le.depth,pe,Ve,De.data):t.texImage3D(i.TEXTURE_2D_ARRAY,$,ze,De.width,De.height,le.depth,0,pe,Ve,De.data)}else{ee&&ye&&t.texStorage2D(i.TEXTURE_2D,ue,ze,B[0].width,B[0].height);for(let $=0,te=B.length;$<te;$++)De=B[$],b.format!==mi?pe!==null?ee?F&&t.compressedTexSubImage2D(i.TEXTURE_2D,$,0,0,De.width,De.height,pe,De.data):t.compressedTexImage2D(i.TEXTURE_2D,$,ze,De.width,De.height,0,De.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ee?F&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,De.width,De.height,pe,Ve,De.data):t.texImage2D(i.TEXTURE_2D,$,ze,De.width,De.height,0,pe,Ve,De.data)}else if(b.isDataArrayTexture)if(ee){if(ye&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,ze,le.width,le.height,le.depth),F)if(b.layerUpdates.size>0){const $=ih(le.width,le.height,b.format,b.type);for(const te of b.layerUpdates){const _e=le.data.subarray(te*$/le.data.BYTES_PER_ELEMENT,(te+1)*$/le.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,te,le.width,le.height,1,pe,Ve,_e)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,pe,Ve,le.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ze,le.width,le.height,le.depth,0,pe,Ve,le.data);else if(b.isData3DTexture)ee?(ye&&t.texStorage3D(i.TEXTURE_3D,ue,ze,le.width,le.height,le.depth),F&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,pe,Ve,le.data)):t.texImage3D(i.TEXTURE_3D,0,ze,le.width,le.height,le.depth,0,pe,Ve,le.data);else if(b.isFramebufferTexture){if(ye)if(ee)t.texStorage2D(i.TEXTURE_2D,ue,ze,le.width,le.height);else{let $=le.width,te=le.height;for(let _e=0;_e<ue;_e++)t.texImage2D(i.TEXTURE_2D,_e,ze,$,te,0,pe,Ve,null),$>>=1,te>>=1}}else if(B.length>0){if(ee&&ye){const $=se(B[0]);t.texStorage2D(i.TEXTURE_2D,ue,ze,$.width,$.height)}for(let $=0,te=B.length;$<te;$++)De=B[$],ee?F&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,pe,Ve,De):t.texImage2D(i.TEXTURE_2D,$,ze,pe,Ve,De);b.generateMipmaps=!1}else if(ee){if(ye){const $=se(le);t.texStorage2D(i.TEXTURE_2D,ue,ze,$.width,$.height)}F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,pe,Ve,le)}else t.texImage2D(i.TEXTURE_2D,0,ze,pe,Ve,le);m(b)&&p(J),me.__version=K.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function oe(R,b,G){if(b.image.length!==6)return;const J=qe(R,b),ie=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+G);const K=n.get(ie);if(ie.version!==K.__version||J===!0){t.activeTexture(i.TEXTURE0+G);const me=dt.getPrimaries(dt.workingColorSpace),he=b.colorSpace===or?null:dt.getPrimaries(b.colorSpace),Pe=b.colorSpace===or||me===he?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);const Ue=b.isCompressedTexture||b.image[0].isCompressedTexture,le=b.image[0]&&b.image[0].isDataTexture,pe=[];for(let te=0;te<6;te++)!Ue&&!le?pe[te]=_(b.image[te],!0,r.maxCubemapSize):pe[te]=le?b.image[te].image:b.image[te],pe[te]=Ce(b,pe[te]);const Ve=pe[0],ze=s.convert(b.format,b.colorSpace),De=s.convert(b.type),B=v(b.internalFormat,ze,De,b.colorSpace),ee=b.isVideoTexture!==!0,ye=K.__version===void 0||J===!0,F=ie.dataReady;let ue=C(b,Ve);Ie(i.TEXTURE_CUBE_MAP,b);let $;if(Ue){ee&&ye&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ue,B,Ve.width,Ve.height);for(let te=0;te<6;te++){$=pe[te].mipmaps;for(let _e=0;_e<$.length;_e++){const ve=$[_e];b.format!==mi?ze!==null?ee?F&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,_e,0,0,ve.width,ve.height,ze,ve.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,_e,B,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ee?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,_e,0,0,ve.width,ve.height,ze,De,ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,_e,B,ve.width,ve.height,0,ze,De,ve.data)}}}else{if($=b.mipmaps,ee&&ye){$.length>0&&ue++;const te=se(pe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ue,B,te.width,te.height)}for(let te=0;te<6;te++)if(le){ee?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,pe[te].width,pe[te].height,ze,De,pe[te].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,B,pe[te].width,pe[te].height,0,ze,De,pe[te].data);for(let _e=0;_e<$.length;_e++){const ke=$[_e].image[te].image;ee?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,_e+1,0,0,ke.width,ke.height,ze,De,ke.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,_e+1,B,ke.width,ke.height,0,ze,De,ke.data)}}else{ee?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,ze,De,pe[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,B,ze,De,pe[te]);for(let _e=0;_e<$.length;_e++){const ve=$[_e];ee?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,_e+1,0,0,ze,De,ve.image[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,_e+1,B,ze,De,ve.image[te])}}}m(b)&&p(i.TEXTURE_CUBE_MAP),K.__version=ie.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function xe(R,b,G,J,ie,K){const me=s.convert(G.format,G.colorSpace),he=s.convert(G.type),Pe=v(G.internalFormat,me,he,G.colorSpace),Ue=n.get(b),le=n.get(G);if(le.__renderTarget=b,!Ue.__hasExternalTextures){const pe=Math.max(1,b.width>>K),Ve=Math.max(1,b.height>>K);ie===i.TEXTURE_3D||ie===i.TEXTURE_2D_ARRAY?t.texImage3D(ie,K,Pe,pe,Ve,b.depth,0,me,he,null):t.texImage2D(ie,K,Pe,pe,Ve,0,me,he,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),O(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,ie,le.__webglTexture,0,re(b)):(ie===i.TEXTURE_2D||ie>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,ie,le.__webglTexture,K),t.bindFramebuffer(i.FRAMEBUFFER,null)}function fe(R,b,G){if(i.bindRenderbuffer(i.RENDERBUFFER,R),b.depthBuffer){const J=b.depthTexture,ie=J&&J.isDepthTexture?J.type:null,K=x(b.stencilBuffer,ie),me=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=re(b);O(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,he,K,b.width,b.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,he,K,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,K,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,me,i.RENDERBUFFER,R)}else{const J=b.textures;for(let ie=0;ie<J.length;ie++){const K=J[ie],me=s.convert(K.format,K.colorSpace),he=s.convert(K.type),Pe=v(K.internalFormat,me,he,K.colorSpace),Ue=re(b);G&&O(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ue,Pe,b.width,b.height):O(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ue,Pe,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,Pe,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ae(R,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=n.get(b.depthTexture);J.__renderTarget=b,(!J.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),q(b.depthTexture,0);const ie=J.__webglTexture,K=re(b);if(b.depthTexture.format===qa)O(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0);else if(b.depthTexture.format===Ya)O(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function Ne(R){const b=n.get(R),G=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){const J=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),J){const ie=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,J.removeEventListener("dispose",ie)};J.addEventListener("dispose",ie),b.__depthDisposeCallback=ie}b.__boundDepthTexture=J}if(R.depthTexture&&!b.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");const J=R.texture.mipmaps;J&&J.length>0?Ae(b.__webglFramebuffer[0],R):Ae(b.__webglFramebuffer,R)}else if(G){b.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[J]),b.__webglDepthbuffer[J]===void 0)b.__webglDepthbuffer[J]=i.createRenderbuffer(),fe(b.__webglDepthbuffer[J],R,!1);else{const ie=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=b.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,K)}}else{const J=R.texture.mipmaps;if(J&&J.length>0?t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),fe(b.__webglDepthbuffer,R,!1);else{const ie=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,K)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(R,b,G){const J=n.get(R);b!==void 0&&xe(J.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Ne(R)}function et(R){const b=R.texture,G=n.get(R),J=n.get(b);R.addEventListener("dispose",T);const ie=R.textures,K=R.isWebGLCubeRenderTarget===!0,me=ie.length>1;if(me||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=b.version,a.memory.textures++),K){G.__webglFramebuffer=[];for(let he=0;he<6;he++)if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer[he]=[];for(let Pe=0;Pe<b.mipmaps.length;Pe++)G.__webglFramebuffer[he][Pe]=i.createFramebuffer()}else G.__webglFramebuffer[he]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer=[];for(let he=0;he<b.mipmaps.length;he++)G.__webglFramebuffer[he]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(me)for(let he=0,Pe=ie.length;he<Pe;he++){const Ue=n.get(ie[he]);Ue.__webglTexture===void 0&&(Ue.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&O(R)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let he=0;he<ie.length;he++){const Pe=ie[he];G.__webglColorRenderbuffer[he]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[he]);const Ue=s.convert(Pe.format,Pe.colorSpace),le=s.convert(Pe.type),pe=v(Pe.internalFormat,Ue,le,Pe.colorSpace,R.isXRRenderTarget===!0),Ve=re(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ve,pe,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,G.__webglColorRenderbuffer[he])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),fe(G.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),Ie(i.TEXTURE_CUBE_MAP,b);for(let he=0;he<6;he++)if(b.mipmaps&&b.mipmaps.length>0)for(let Pe=0;Pe<b.mipmaps.length;Pe++)xe(G.__webglFramebuffer[he][Pe],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+he,Pe);else xe(G.__webglFramebuffer[he],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);m(b)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(me){for(let he=0,Pe=ie.length;he<Pe;he++){const Ue=ie[he],le=n.get(Ue);t.bindTexture(i.TEXTURE_2D,le.__webglTexture),Ie(i.TEXTURE_2D,Ue),xe(G.__webglFramebuffer,R,Ue,i.COLOR_ATTACHMENT0+he,i.TEXTURE_2D,0),m(Ue)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let he=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(he=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(he,J.__webglTexture),Ie(he,b),b.mipmaps&&b.mipmaps.length>0)for(let Pe=0;Pe<b.mipmaps.length;Pe++)xe(G.__webglFramebuffer[Pe],R,b,i.COLOR_ATTACHMENT0,he,Pe);else xe(G.__webglFramebuffer,R,b,i.COLOR_ATTACHMENT0,he,0);m(b)&&p(he),t.unbindTexture()}R.depthBuffer&&Ne(R)}function Ye(R){const b=R.textures;for(let G=0,J=b.length;G<J;G++){const ie=b[G];if(m(ie)){const K=S(R),me=n.get(ie).__webglTexture;t.bindTexture(K,me),p(K),t.unbindTexture()}}}const Se=[],P=[];function de(R){if(R.samples>0){if(O(R)===!1){const b=R.textures,G=R.width,J=R.height;let ie=i.COLOR_BUFFER_BIT;const K=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=n.get(R),he=b.length>1;if(he)for(let Ue=0;Ue<b.length;Ue++)t.bindFramebuffer(i.FRAMEBUFFER,me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ue,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ue,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer);const Pe=R.texture.mipmaps;Pe&&Pe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let Ue=0;Ue<b.length;Ue++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ie|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ie|=i.STENCIL_BUFFER_BIT)),he){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,me.__webglColorRenderbuffer[Ue]);const le=n.get(b[Ue]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,le,0)}i.blitFramebuffer(0,0,G,J,0,0,G,J,ie,i.NEAREST),l===!0&&(Se.length=0,P.length=0,Se.push(i.COLOR_ATTACHMENT0+Ue),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Se.push(K),P.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,P)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Se))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),he)for(let Ue=0;Ue<b.length;Ue++){t.bindFramebuffer(i.FRAMEBUFFER,me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ue,i.RENDERBUFFER,me.__webglColorRenderbuffer[Ue]);const le=n.get(b[Ue]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ue,i.TEXTURE_2D,le,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const b=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function re(R){return Math.min(r.maxSamples,R.samples)}function O(R){const b=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ne(R){const b=a.render.frame;u.get(R)!==b&&(u.set(R,b),R.update())}function Ce(R,b){const G=R.colorSpace,J=R.format,ie=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||G!==Ys&&G!==or&&(dt.getTransfer(G)===vt?(J!==mi||ie!==wi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),b}function se(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=I,this.setTexture2D=q,this.setTexture2DArray=X,this.setTexture3D=H,this.setTextureCube=N,this.rebindTextures=Oe,this.setupRenderTarget=et,this.updateRenderTargetMipmap=Ye,this.updateMultisampleRenderTarget=de,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=O}function SM(i,e){function t(n,r=or){let s;const a=dt.getTransfer(r);if(n===wi)return i.UNSIGNED_BYTE;if(n===Rf)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Pf)return i.UNSIGNED_SHORT_5_5_5_1;if(n===yp)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===xp)return i.BYTE;if(n===Sp)return i.SHORT;if(n===Wa)return i.UNSIGNED_SHORT;if(n===wf)return i.INT;if(n===Qr)return i.UNSIGNED_INT;if(n===Xi)return i.FLOAT;if(n===lo)return i.HALF_FLOAT;if(n===Mp)return i.ALPHA;if(n===Ep)return i.RGB;if(n===mi)return i.RGBA;if(n===qa)return i.DEPTH_COMPONENT;if(n===Ya)return i.DEPTH_STENCIL;if(n===Tp)return i.RED;if(n===Lf)return i.RED_INTEGER;if(n===bp)return i.RG;if(n===Ff)return i.RG_INTEGER;if(n===If)return i.RGBA_INTEGER;if(n===sl||n===al||n===ol||n===ll)if(a===vt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===sl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===al)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ol)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ll)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===sl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===al)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ol)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ll)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===vu||n===xu||n===Su||n===yu)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===vu)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===xu)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Su)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===yu)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Mu||n===Eu||n===Tu)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Mu||n===Eu)return a===vt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Tu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===bu||n===Du||n===Cu||n===Au||n===wu||n===Ru||n===Pu||n===Lu||n===Fu||n===Iu||n===Ou||n===Uu||n===Nu||n===Bu)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===bu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Du)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Cu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Au)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===wu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ru)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Pu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Lu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Fu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Iu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ou)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Uu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Nu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Bu)return a===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===cl||n===zu||n===ku)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===cl)return a===vt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===zu)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ku)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Dp||n===Vu||n===Hu||n===Gu)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===cl)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Vu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Hu)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Gu)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Xa?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const yM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,MM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class EM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new wn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Sr({vertexShader:yM,fragmentShader:MM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Yi(new Xl(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class TM extends ia{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,g=null;const _=new EM,m=t.getContextAttributes();let p=null,S=null;const v=[],x=[],C=new ge;let D=null;const T=new yn;T.viewport=new xt;const E=new yn;E.viewport=new xt;const M=[T,E],y=new W0;let w=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let oe=v[Z];return oe===void 0&&(oe=new yc,v[Z]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(Z){let oe=v[Z];return oe===void 0&&(oe=new yc,v[Z]=oe),oe.getGripSpace()},this.getHand=function(Z){let oe=v[Z];return oe===void 0&&(oe=new yc,v[Z]=oe),oe.getHandSpace()};function U(Z){const oe=x.indexOf(Z.inputSource);if(oe===-1)return;const xe=v[oe];xe!==void 0&&(xe.update(Z.inputSource,Z.frame,c||a),xe.dispatchEvent({type:Z.type,data:Z.inputSource}))}function V(){r.removeEventListener("select",U),r.removeEventListener("selectstart",U),r.removeEventListener("selectend",U),r.removeEventListener("squeeze",U),r.removeEventListener("squeezestart",U),r.removeEventListener("squeezeend",U),r.removeEventListener("end",V),r.removeEventListener("inputsourceschange",q);for(let Z=0;Z<v.length;Z++){const oe=x[Z];oe!==null&&(x[Z]=null,v[Z].disconnect(oe))}w=null,I=null,_.reset(),e.setRenderTarget(p),d=null,h=null,f=null,r=null,S=null,qe.stop(),n.isPresenting=!1,e.setPixelRatio(D),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Z){if(r=Z,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",U),r.addEventListener("selectstart",U),r.addEventListener("selectend",U),r.addEventListener("squeeze",U),r.addEventListener("squeezestart",U),r.addEventListener("squeezeend",U),r.addEventListener("end",V),r.addEventListener("inputsourceschange",q),m.xrCompatible!==!0&&await t.makeXRCompatible(),D=e.getPixelRatio(),e.getSize(C),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let xe=null,fe=null,Ae=null;m.depth&&(Ae=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,xe=m.stencil?Ya:qa,fe=m.stencil?Xa:Qr);const Ne={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:s};f=new XRWebGLBinding(r,t),h=f.createProjectionLayer(Ne),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),S=new es(h.textureWidth,h.textureHeight,{format:mi,type:wi,depthTexture:new zp(h.textureWidth,h.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,xe),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const xe={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,t,xe),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),S=new es(d.framebufferWidth,d.framebufferHeight,{format:mi,type:wi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),qe.setContext(r),qe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function q(Z){for(let oe=0;oe<Z.removed.length;oe++){const xe=Z.removed[oe],fe=x.indexOf(xe);fe>=0&&(x[fe]=null,v[fe].disconnect(xe))}for(let oe=0;oe<Z.added.length;oe++){const xe=Z.added[oe];let fe=x.indexOf(xe);if(fe===-1){for(let Ne=0;Ne<v.length;Ne++)if(Ne>=x.length){x.push(xe),fe=Ne;break}else if(x[Ne]===null){x[Ne]=xe,fe=Ne;break}if(fe===-1)break}const Ae=v[fe];Ae&&Ae.connect(xe)}}const X=new z,H=new z;function N(Z,oe,xe){X.setFromMatrixPosition(oe.matrixWorld),H.setFromMatrixPosition(xe.matrixWorld);const fe=X.distanceTo(H),Ae=oe.projectionMatrix.elements,Ne=xe.projectionMatrix.elements,Oe=Ae[14]/(Ae[10]-1),et=Ae[14]/(Ae[10]+1),Ye=(Ae[9]+1)/Ae[5],Se=(Ae[9]-1)/Ae[5],P=(Ae[8]-1)/Ae[0],de=(Ne[8]+1)/Ne[0],re=Oe*P,O=Oe*de,ne=fe/(-P+de),Ce=ne*-P;if(oe.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Ce),Z.translateZ(ne),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Ae[10]===-1)Z.projectionMatrix.copy(oe.projectionMatrix),Z.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{const se=Oe+ne,R=et+ne,b=re-Ce,G=O+(fe-Ce),J=Ye*et/R*se,ie=Se*et/R*se;Z.projectionMatrix.makePerspective(b,G,J,ie,se,R),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function Q(Z,oe){oe===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(oe.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(r===null)return;let oe=Z.near,xe=Z.far;_.texture!==null&&(_.depthNear>0&&(oe=_.depthNear),_.depthFar>0&&(xe=_.depthFar)),y.near=E.near=T.near=oe,y.far=E.far=T.far=xe,(w!==y.near||I!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),w=y.near,I=y.far),T.layers.mask=Z.layers.mask|2,E.layers.mask=Z.layers.mask|4,y.layers.mask=T.layers.mask|E.layers.mask;const fe=Z.parent,Ae=y.cameras;Q(y,fe);for(let Ne=0;Ne<Ae.length;Ne++)Q(Ae[Ne],fe);Ae.length===2?N(y,T,E):y.projectionMatrix.copy(T.projectionMatrix),L(Z,y,fe)};function L(Z,oe,xe){xe===null?Z.matrix.copy(oe.matrixWorld):(Z.matrix.copy(xe.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(oe.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(oe.projectionMatrix),Z.projectionMatrixInverse.copy(oe.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Wu*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(Z){l=Z,h!==null&&(h.fixedFoveation=Z),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let ae=null;function Ie(Z,oe){if(u=oe.getViewerPose(c||a),g=oe,u!==null){const xe=u.views;d!==null&&(e.setRenderTargetFramebuffer(S,d.framebuffer),e.setRenderTarget(S));let fe=!1;xe.length!==y.cameras.length&&(y.cameras.length=0,fe=!0);for(let Oe=0;Oe<xe.length;Oe++){const et=xe[Oe];let Ye=null;if(d!==null)Ye=d.getViewport(et);else{const P=f.getViewSubImage(h,et);Ye=P.viewport,Oe===0&&(e.setRenderTargetTextures(S,P.colorTexture,P.depthStencilTexture),e.setRenderTarget(S))}let Se=M[Oe];Se===void 0&&(Se=new yn,Se.layers.enable(Oe),Se.viewport=new xt,M[Oe]=Se),Se.matrix.fromArray(et.transform.matrix),Se.matrix.decompose(Se.position,Se.quaternion,Se.scale),Se.projectionMatrix.fromArray(et.projectionMatrix),Se.projectionMatrixInverse.copy(Se.projectionMatrix).invert(),Se.viewport.set(Ye.x,Ye.y,Ye.width,Ye.height),Oe===0&&(y.matrix.copy(Se.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),fe===!0&&y.cameras.push(Se)}const Ae=r.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&f){const Oe=f.getDepthInformation(xe[0]);Oe&&Oe.isValid&&Oe.texture&&_.init(e,Oe,r.renderState)}}for(let xe=0;xe<v.length;xe++){const fe=x[xe],Ae=v[xe];fe!==null&&Ae!==void 0&&Ae.update(fe,oe,c||a)}ae&&ae(Z,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),g=null}const qe=new jp;qe.setAnimationLoop(Ie),this.setAnimationLoop=function(Z){ae=Z},this.dispose=function(){}}}const Pr=new Ri,bM=new Dt;function DM(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Up(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,S,v,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&d(m,p,x)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,S,v):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===An&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===An&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=e.get(p),v=S.envMap,x=S.envMapRotation;v&&(m.envMap.value=v,Pr.copy(x),Pr.x*=-1,Pr.y*=-1,Pr.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Pr.y*=-1,Pr.z*=-1),m.envMapRotation.value.setFromMatrix4(bM.makeRotationFromEuler(Pr)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=v*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===An&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function CM(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,v){const x=v.program;n.uniformBlockBinding(S,x)}function c(S,v){let x=r[S.id];x===void 0&&(g(S),x=u(S),r[S.id]=x,S.addEventListener("dispose",m));const C=v.program;n.updateUBOMapping(S,C);const D=e.render.frame;s[S.id]!==D&&(h(S),s[S.id]=D)}function u(S){const v=f();S.__bindingPointIndex=v;const x=i.createBuffer(),C=S.__size,D=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,C,D),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,x),x}function f(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){const v=r[S.id],x=S.uniforms,C=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let D=0,T=x.length;D<T;D++){const E=Array.isArray(x[D])?x[D]:[x[D]];for(let M=0,y=E.length;M<y;M++){const w=E[M];if(d(w,D,M,C)===!0){const I=w.__offset,U=Array.isArray(w.value)?w.value:[w.value];let V=0;for(let q=0;q<U.length;q++){const X=U[q],H=_(X);typeof X=="number"||typeof X=="boolean"?(w.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,I+V,w.__data)):X.isMatrix3?(w.__data[0]=X.elements[0],w.__data[1]=X.elements[1],w.__data[2]=X.elements[2],w.__data[3]=0,w.__data[4]=X.elements[3],w.__data[5]=X.elements[4],w.__data[6]=X.elements[5],w.__data[7]=0,w.__data[8]=X.elements[6],w.__data[9]=X.elements[7],w.__data[10]=X.elements[8],w.__data[11]=0):(X.toArray(w.__data,V),V+=H.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,w.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(S,v,x,C){const D=S.value,T=v+"_"+x;if(C[T]===void 0)return typeof D=="number"||typeof D=="boolean"?C[T]=D:C[T]=D.clone(),!0;{const E=C[T];if(typeof D=="number"||typeof D=="boolean"){if(E!==D)return C[T]=D,!0}else if(E.equals(D)===!1)return E.copy(D),!0}return!1}function g(S){const v=S.uniforms;let x=0;const C=16;for(let T=0,E=v.length;T<E;T++){const M=Array.isArray(v[T])?v[T]:[v[T]];for(let y=0,w=M.length;y<w;y++){const I=M[y],U=Array.isArray(I.value)?I.value:[I.value];for(let V=0,q=U.length;V<q;V++){const X=U[V],H=_(X),N=x%C,Q=N%H.boundary,L=N+Q;x+=Q,L!==0&&C-L<H.storage&&(x+=C-L),I.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=x,x+=H.storage}}}const D=x%C;return D>0&&(x+=C-D),S.__size=x,S.__cache={},this}function _(S){const v={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(v.boundary=4,v.storage=4):S.isVector2?(v.boundary=8,v.storage=8):S.isVector3||S.isColor?(v.boundary=16,v.storage=12):S.isVector4?(v.boundary=16,v.storage=16):S.isMatrix3?(v.boundary=48,v.storage=48):S.isMatrix4?(v.boundary=64,v.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),v}function m(S){const v=S.target;v.removeEventListener("dispose",m);const x=a.indexOf(v.__bindingPointIndex);a.splice(x,1),i.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function p(){for(const S in r)i.deleteBuffer(r[S]);a=[],r={},s={}}return{bind:l,update:c,dispose:p}}class rD{constructor(e={}){const{canvas:t=T_(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const S=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=mr,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let C=!1;this._outputColorSpace=ti;let D=0,T=0,E=null,M=-1,y=null;const w=new xt,I=new xt;let U=null;const V=new ct(0);let q=0,X=t.width,H=t.height,N=1,Q=null,L=null;const ae=new xt(0,0,X,H),Ie=new xt(0,0,X,H);let qe=!1;const Z=new Uf;let oe=!1,xe=!1;const fe=new Dt,Ae=new Dt,Ne=new z,Oe=new xt,et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function Se(){return E===null?N:1}let P=n;function de(A,W){return t.getContext(A,W)}try{const A={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Cf}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",_e,!1),t.addEventListener("webglcontextcreationerror",ve,!1),P===null){const W="webgl2";if(P=de(W,A),P===null)throw de(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let re,O,ne,Ce,se,R,b,G,J,ie,K,me,he,Pe,Ue,le,pe,Ve,ze,De,B,ee,ye,F;function ue(){re=new BS(P),re.init(),ee=new SM(P,re),O=new PS(P,re,e,ee),ne=new vM(P,re),O.reverseDepthBuffer&&h&&ne.buffers.depth.setReversed(!0),Ce=new VS(P),se=new sM,R=new xM(P,re,ne,se,O,ee,Ce),b=new FS(x),G=new NS(x),J=new Y0(P),ye=new wS(P,J),ie=new zS(P,J,Ce,ye),K=new GS(P,ie,J,Ce),ze=new HS(P,O,R),le=new LS(se),me=new rM(x,b,G,re,O,ye,le),he=new DM(x,se),Pe=new oM,Ue=new hM(re),Ve=new AS(x,b,G,ne,K,d,l),pe=new gM(x,K,O),F=new CM(P,Ce,O,ne),De=new RS(P,re,Ce),B=new kS(P,re,Ce),Ce.programs=me.programs,x.capabilities=O,x.extensions=re,x.properties=se,x.renderLists=Pe,x.shadowMap=pe,x.state=ne,x.info=Ce}ue();const $=new TM(x,P);this.xr=$,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const A=re.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=re.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(A){A!==void 0&&(N=A,this.setSize(X,H,!1))},this.getSize=function(A){return A.set(X,H)},this.setSize=function(A,W,j=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=A,H=W,t.width=Math.floor(A*N),t.height=Math.floor(W*N),j===!0&&(t.style.width=A+"px",t.style.height=W+"px"),this.setViewport(0,0,A,W)},this.getDrawingBufferSize=function(A){return A.set(X*N,H*N).floor()},this.setDrawingBufferSize=function(A,W,j){X=A,H=W,N=j,t.width=Math.floor(A*j),t.height=Math.floor(W*j),this.setViewport(0,0,A,W)},this.getCurrentViewport=function(A){return A.copy(w)},this.getViewport=function(A){return A.copy(ae)},this.setViewport=function(A,W,j,Y){A.isVector4?ae.set(A.x,A.y,A.z,A.w):ae.set(A,W,j,Y),ne.viewport(w.copy(ae).multiplyScalar(N).round())},this.getScissor=function(A){return A.copy(Ie)},this.setScissor=function(A,W,j,Y){A.isVector4?Ie.set(A.x,A.y,A.z,A.w):Ie.set(A,W,j,Y),ne.scissor(I.copy(Ie).multiplyScalar(N).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(A){ne.setScissorTest(qe=A)},this.setOpaqueSort=function(A){Q=A},this.setTransparentSort=function(A){L=A},this.getClearColor=function(A){return A.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(A=!0,W=!0,j=!0){let Y=0;if(A){let k=!1;if(E!==null){const ce=E.texture.format;k=ce===If||ce===Ff||ce===Lf}if(k){const ce=E.texture.type,Te=ce===wi||ce===Qr||ce===Wa||ce===Xa||ce===Rf||ce===Pf,Re=Ve.getClearColor(),we=Ve.getClearAlpha(),Ge=Re.r,We=Re.g,He=Re.b;Te?(g[0]=Ge,g[1]=We,g[2]=He,g[3]=we,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Ge,_[1]=We,_[2]=He,_[3]=we,P.clearBufferiv(P.COLOR,0,_))}else Y|=P.COLOR_BUFFER_BIT}W&&(Y|=P.DEPTH_BUFFER_BIT),j&&(Y|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",_e,!1),t.removeEventListener("webglcontextcreationerror",ve,!1),Ve.dispose(),Pe.dispose(),Ue.dispose(),se.dispose(),b.dispose(),G.dispose(),K.dispose(),ye.dispose(),F.dispose(),me.dispose(),$.dispose(),$.removeEventListener("sessionstart",Ee),$.removeEventListener("sessionend",Ke),Be.stop()};function te(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function _e(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const A=Ce.autoReset,W=pe.enabled,j=pe.autoUpdate,Y=pe.needsUpdate,k=pe.type;ue(),Ce.autoReset=A,pe.enabled=W,pe.autoUpdate=j,pe.needsUpdate=Y,pe.type=k}function ve(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ke(A){const W=A.target;W.removeEventListener("dispose",ke),Je(W)}function Je(A){_t(A),se.remove(A)}function _t(A){const W=se.get(A).programs;W!==void 0&&(W.forEach(function(j){me.releaseProgram(j)}),A.isShaderMaterial&&me.releaseShaderCache(A))}this.renderBufferDirect=function(A,W,j,Y,k,ce){W===null&&(W=et);const Te=k.isMesh&&k.matrixWorld.determinant()<0,Re=On(A,W,j,Y,k);ne.setMaterial(Y,Te);let we=j.index,Ge=1;if(Y.wireframe===!0){if(we=ie.getWireframeAttribute(j),we===void 0)return;Ge=2}const We=j.drawRange,He=j.attributes.position;let Qe=We.start*Ge,pt=(We.start+We.count)*Ge;ce!==null&&(Qe=Math.max(Qe,ce.start*Ge),pt=Math.min(pt,(ce.start+ce.count)*Ge)),we!==null?(Qe=Math.max(Qe,0),pt=Math.min(pt,we.count)):He!=null&&(Qe=Math.max(Qe,0),pt=Math.min(pt,He.count));const Bt=pt-Qe;if(Bt<0||Bt===1/0)return;ye.setup(k,Y,Re,j,we);let Ft,ft=De;if(we!==null&&(Ft=J.get(we),ft=B,ft.setIndex(Ft)),k.isMesh)Y.wireframe===!0?(ne.setLineWidth(Y.wireframeLinewidth*Se()),ft.setMode(P.LINES)):ft.setMode(P.TRIANGLES);else if(k.isLine){let $e=Y.linewidth;$e===void 0&&($e=1),ne.setLineWidth($e*Se()),k.isLineSegments?ft.setMode(P.LINES):k.isLineLoop?ft.setMode(P.LINE_LOOP):ft.setMode(P.LINE_STRIP)}else k.isPoints?ft.setMode(P.POINTS):k.isSprite&&ft.setMode(P.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)ul("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ft.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(re.get("WEBGL_multi_draw"))ft.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const $e=k._multiDrawStarts,nn=k._multiDrawCounts,mt=k._multiDrawCount,li=we?J.get(we).bytesPerElement:1,us=se.get(Y).currentProgram.getUniforms();for(let Un=0;Un<mt;Un++)us.setValue(P,"_gl_DrawID",Un),ft.render($e[Un]/li,nn[Un])}else if(k.isInstancedMesh)ft.renderInstances(Qe,Bt,k.count);else if(j.isInstancedBufferGeometry){const $e=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,nn=Math.min(j.instanceCount,$e);ft.renderInstances(Qe,Bt,nn)}else ft.render(Qe,Bt)};function Me(A,W,j){A.transparent===!0&&A.side===Gi&&A.forceSinglePass===!1?(A.side=An,A.needsUpdate=!0,St(A,W,j),A.side=xr,A.needsUpdate=!0,St(A,W,j),A.side=Gi):St(A,W,j)}this.compile=function(A,W,j=null){j===null&&(j=A),p=Ue.get(j),p.init(W),v.push(p),j.traverseVisible(function(k){k.isLight&&k.layers.test(W.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),A!==j&&A.traverseVisible(function(k){k.isLight&&k.layers.test(W.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights();const Y=new Set;return A.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ce=k.material;if(ce)if(Array.isArray(ce))for(let Te=0;Te<ce.length;Te++){const Re=ce[Te];Me(Re,j,k),Y.add(Re)}else Me(ce,j,k),Y.add(ce)}),p=v.pop(),Y},this.compileAsync=function(A,W,j=null){const Y=this.compile(A,W,j);return new Promise(k=>{function ce(){if(Y.forEach(function(Te){se.get(Te).currentProgram.isReady()&&Y.delete(Te)}),Y.size===0){k(A);return}setTimeout(ce,10)}re.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let Le=null;function Ze(A){Le&&Le(A)}function Ee(){Be.stop()}function Ke(){Be.start()}const Be=new jp;Be.setAnimationLoop(Ze),typeof self<"u"&&Be.setContext(self),this.setAnimationLoop=function(A){Le=A,$.setAnimationLoop(A),A===null?Be.stop():Be.start()},$.addEventListener("sessionstart",Ee),$.addEventListener("sessionend",Ke),this.render=function(A,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(W),W=$.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,W,E),p=Ue.get(A,v.length),p.init(W),v.push(p),Ae.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),Z.setFromProjectionMatrix(Ae),xe=this.localClippingEnabled,oe=le.init(this.clippingPlanes,xe),m=Pe.get(A,S.length),m.init(),S.push(m),$.enabled===!0&&$.isPresenting===!0){const ce=x.xr.getDepthSensingMesh();ce!==null&&je(ce,W,-1/0,x.sortObjects)}je(A,W,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(Q,L),Ye=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,Ye&&Ve.addToRenderList(m,A),this.info.render.frame++,oe===!0&&le.beginShadows();const j=p.state.shadowsArray;pe.render(j,A,W),oe===!0&&le.endShadows(),this.info.autoReset===!0&&this.info.reset();const Y=m.opaque,k=m.transmissive;if(p.setupLights(),W.isArrayCamera){const ce=W.cameras;if(k.length>0)for(let Te=0,Re=ce.length;Te<Re;Te++){const we=ce[Te];st(Y,k,A,we)}Ye&&Ve.render(A);for(let Te=0,Re=ce.length;Te<Re;Te++){const we=ce[Te];Ot(m,A,we,we.viewport)}}else k.length>0&&st(Y,k,A,W),Ye&&Ve.render(A),Ot(m,A,W);E!==null&&T===0&&(R.updateMultisampleRenderTarget(E),R.updateRenderTargetMipmap(E)),A.isScene===!0&&A.onAfterRender(x,A,W),ye.resetDefaultState(),M=-1,y=null,v.pop(),v.length>0?(p=v[v.length-1],oe===!0&&le.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function je(A,W,j,Y){if(A.visible===!1)return;if(A.layers.test(W.layers)){if(A.isGroup)j=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(W);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Z.intersectsSprite(A)){Y&&Oe.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Ae);const Te=K.update(A),Re=A.material;Re.visible&&m.push(A,Te,Re,j,Oe.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Z.intersectsObject(A))){const Te=K.update(A),Re=A.material;if(Y&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Oe.copy(A.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),Oe.copy(Te.boundingSphere.center)),Oe.applyMatrix4(A.matrixWorld).applyMatrix4(Ae)),Array.isArray(Re)){const we=Te.groups;for(let Ge=0,We=we.length;Ge<We;Ge++){const He=we[Ge],Qe=Re[He.materialIndex];Qe&&Qe.visible&&m.push(A,Te,Qe,j,Oe.z,He)}}else Re.visible&&m.push(A,Te,Re,j,Oe.z,null)}}const ce=A.children;for(let Te=0,Re=ce.length;Te<Re;Te++)je(ce[Te],W,j,Y)}function Ot(A,W,j,Y){const k=A.opaque,ce=A.transmissive,Te=A.transparent;p.setupLightsView(j),oe===!0&&le.setGlobalState(x.clippingPlanes,j),Y&&ne.viewport(w.copy(Y)),k.length>0&&Tt(k,W,j),ce.length>0&&Tt(ce,W,j),Te.length>0&&Tt(Te,W,j),ne.buffers.depth.setTest(!0),ne.buffers.depth.setMask(!0),ne.buffers.color.setMask(!0),ne.setPolygonOffset(!1)}function st(A,W,j,Y){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Y.id]===void 0&&(p.state.transmissionRenderTarget[Y.id]=new es(1,1,{generateMipmaps:!0,type:re.has("EXT_color_buffer_half_float")||re.has("EXT_color_buffer_float")?lo:wi,minFilter:Vr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:dt.workingColorSpace}));const ce=p.state.transmissionRenderTarget[Y.id],Te=Y.viewport||w;ce.setSize(Te.z*x.transmissionResolutionScale,Te.w*x.transmissionResolutionScale);const Re=x.getRenderTarget();x.setRenderTarget(ce),x.getClearColor(V),q=x.getClearAlpha(),q<1&&x.setClearColor(16777215,.5),x.clear(),Ye&&Ve.render(j);const we=x.toneMapping;x.toneMapping=mr;const Ge=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),p.setupLightsView(Y),oe===!0&&le.setGlobalState(x.clippingPlanes,Y),Tt(A,j,Y),R.updateMultisampleRenderTarget(ce),R.updateRenderTargetMipmap(ce),re.has("WEBGL_multisampled_render_to_texture")===!1){let We=!1;for(let He=0,Qe=W.length;He<Qe;He++){const pt=W[He],Bt=pt.object,Ft=pt.geometry,ft=pt.material,$e=pt.group;if(ft.side===Gi&&Bt.layers.test(Y.layers)){const nn=ft.side;ft.side=An,ft.needsUpdate=!0,Gt(Bt,j,Y,Ft,ft,$e),ft.side=nn,ft.needsUpdate=!0,We=!0}}We===!0&&(R.updateMultisampleRenderTarget(ce),R.updateRenderTargetMipmap(ce))}x.setRenderTarget(Re),x.setClearColor(V,q),Ge!==void 0&&(Y.viewport=Ge),x.toneMapping=we}function Tt(A,W,j){const Y=W.isScene===!0?W.overrideMaterial:null;for(let k=0,ce=A.length;k<ce;k++){const Te=A[k],Re=Te.object,we=Te.geometry,Ge=Te.group;let We=Te.material;We.allowOverride===!0&&Y!==null&&(We=Y),Re.layers.test(j.layers)&&Gt(Re,W,j,we,We,Ge)}}function Gt(A,W,j,Y,k,ce){A.onBeforeRender(x,W,j,Y,k,ce),A.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),k.onBeforeRender(x,W,j,Y,A,ce),k.transparent===!0&&k.side===Gi&&k.forceSinglePass===!1?(k.side=An,k.needsUpdate=!0,x.renderBufferDirect(j,W,Y,k,A,ce),k.side=xr,k.needsUpdate=!0,x.renderBufferDirect(j,W,Y,k,A,ce),k.side=Gi):x.renderBufferDirect(j,W,Y,k,A,ce),A.onAfterRender(x,W,j,Y,k,ce)}function St(A,W,j){W.isScene!==!0&&(W=et);const Y=se.get(A),k=p.state.lights,ce=p.state.shadowsArray,Te=k.state.version,Re=me.getParameters(A,k.state,ce,W,j),we=me.getProgramCacheKey(Re);let Ge=Y.programs;Y.environment=A.isMeshStandardMaterial?W.environment:null,Y.fog=W.fog,Y.envMap=(A.isMeshStandardMaterial?G:b).get(A.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&A.envMap===null?W.environmentRotation:A.envMapRotation,Ge===void 0&&(A.addEventListener("dispose",ke),Ge=new Map,Y.programs=Ge);let We=Ge.get(we);if(We!==void 0){if(Y.currentProgram===We&&Y.lightsStateVersion===Te)return ht(A,Re),We}else Re.uniforms=me.getUniforms(A),A.onBeforeCompile(Re,x),We=me.acquireProgram(Re,we),Ge.set(we,We),Y.uniforms=Re.uniforms;const He=Y.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(He.clippingPlanes=le.uniform),ht(A,Re),Y.needsLights=hn(A),Y.lightsStateVersion=Te,Y.needsLights&&(He.ambientLightColor.value=k.state.ambient,He.lightProbe.value=k.state.probe,He.directionalLights.value=k.state.directional,He.directionalLightShadows.value=k.state.directionalShadow,He.spotLights.value=k.state.spot,He.spotLightShadows.value=k.state.spotShadow,He.rectAreaLights.value=k.state.rectArea,He.ltc_1.value=k.state.rectAreaLTC1,He.ltc_2.value=k.state.rectAreaLTC2,He.pointLights.value=k.state.point,He.pointLightShadows.value=k.state.pointShadow,He.hemisphereLights.value=k.state.hemi,He.directionalShadowMap.value=k.state.directionalShadowMap,He.directionalShadowMatrix.value=k.state.directionalShadowMatrix,He.spotShadowMap.value=k.state.spotShadowMap,He.spotLightMatrix.value=k.state.spotLightMatrix,He.spotLightMap.value=k.state.spotLightMap,He.pointShadowMap.value=k.state.pointShadowMap,He.pointShadowMatrix.value=k.state.pointShadowMatrix),Y.currentProgram=We,Y.uniformsList=null,We}function yt(A){if(A.uniformsList===null){const W=A.currentProgram.getUniforms();A.uniformsList=dl.seqWithValue(W.seq,A.uniforms)}return A.uniformsList}function ht(A,W){const j=se.get(A);j.outputColorSpace=W.outputColorSpace,j.batching=W.batching,j.batchingColor=W.batchingColor,j.instancing=W.instancing,j.instancingColor=W.instancingColor,j.instancingMorph=W.instancingMorph,j.skinning=W.skinning,j.morphTargets=W.morphTargets,j.morphNormals=W.morphNormals,j.morphColors=W.morphColors,j.morphTargetsCount=W.morphTargetsCount,j.numClippingPlanes=W.numClippingPlanes,j.numIntersection=W.numClipIntersection,j.vertexAlphas=W.vertexAlphas,j.vertexTangents=W.vertexTangents,j.toneMapping=W.toneMapping}function On(A,W,j,Y,k){W.isScene!==!0&&(W=et),R.resetTextureUnits();const ce=W.fog,Te=Y.isMeshStandardMaterial?W.environment:null,Re=E===null?x.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Ys,we=(Y.isMeshStandardMaterial?G:b).get(Y.envMap||Te),Ge=Y.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,We=!!j.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),He=!!j.morphAttributes.position,Qe=!!j.morphAttributes.normal,pt=!!j.morphAttributes.color;let Bt=mr;Y.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Bt=x.toneMapping);const Ft=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ft=Ft!==void 0?Ft.length:0,$e=se.get(Y),nn=p.state.lights;if(oe===!0&&(xe===!0||A!==y)){const pn=A===y&&Y.id===M;le.setState(Y,A,pn)}let mt=!1;Y.version===$e.__version?($e.needsLights&&$e.lightsStateVersion!==nn.state.version||$e.outputColorSpace!==Re||k.isBatchedMesh&&$e.batching===!1||!k.isBatchedMesh&&$e.batching===!0||k.isBatchedMesh&&$e.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&$e.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&$e.instancing===!1||!k.isInstancedMesh&&$e.instancing===!0||k.isSkinnedMesh&&$e.skinning===!1||!k.isSkinnedMesh&&$e.skinning===!0||k.isInstancedMesh&&$e.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&$e.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&$e.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&$e.instancingMorph===!1&&k.morphTexture!==null||$e.envMap!==we||Y.fog===!0&&$e.fog!==ce||$e.numClippingPlanes!==void 0&&($e.numClippingPlanes!==le.numPlanes||$e.numIntersection!==le.numIntersection)||$e.vertexAlphas!==Ge||$e.vertexTangents!==We||$e.morphTargets!==He||$e.morphNormals!==Qe||$e.morphColors!==pt||$e.toneMapping!==Bt||$e.morphTargetsCount!==ft)&&(mt=!0):(mt=!0,$e.__version=Y.version);let li=$e.currentProgram;mt===!0&&(li=St(Y,W,k));let us=!1,Un=!1,aa=!1;const At=li.getUniforms(),Kn=$e.uniforms;if(ne.useProgram(li.program)&&(us=!0,Un=!0,aa=!0),Y.id!==M&&(M=Y.id,Un=!0),us||y!==A){ne.buffers.depth.getReversed()?(fe.copy(A.projectionMatrix),D_(fe),C_(fe),At.setValue(P,"projectionMatrix",fe)):At.setValue(P,"projectionMatrix",A.projectionMatrix),At.setValue(P,"viewMatrix",A.matrixWorldInverse);const bn=At.map.cameraPosition;bn!==void 0&&bn.setValue(P,Ne.setFromMatrixPosition(A.matrixWorld)),O.logarithmicDepthBuffer&&At.setValue(P,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&At.setValue(P,"isOrthographic",A.isOrthographicCamera===!0),y!==A&&(y=A,Un=!0,aa=!0)}if(k.isSkinnedMesh){At.setOptional(P,k,"bindMatrix"),At.setOptional(P,k,"bindMatrixInverse");const pn=k.skeleton;pn&&(pn.boneTexture===null&&pn.computeBoneTexture(),At.setValue(P,"boneTexture",pn.boneTexture,R))}k.isBatchedMesh&&(At.setOptional(P,k,"batchingTexture"),At.setValue(P,"batchingTexture",k._matricesTexture,R),At.setOptional(P,k,"batchingIdTexture"),At.setValue(P,"batchingIdTexture",k._indirectTexture,R),At.setOptional(P,k,"batchingColorTexture"),k._colorsTexture!==null&&At.setValue(P,"batchingColorTexture",k._colorsTexture,R));const Jn=j.morphAttributes;if((Jn.position!==void 0||Jn.normal!==void 0||Jn.color!==void 0)&&ze.update(k,j,li),(Un||$e.receiveShadow!==k.receiveShadow)&&($e.receiveShadow=k.receiveShadow,At.setValue(P,"receiveShadow",k.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Kn.envMap.value=we,Kn.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&W.environment!==null&&(Kn.envMapIntensity.value=W.environmentIntensity),Un&&(At.setValue(P,"toneMappingExposure",x.toneMappingExposure),$e.needsLights&&Ct(Kn,aa),ce&&Y.fog===!0&&he.refreshFogUniforms(Kn,ce),he.refreshMaterialUniforms(Kn,Y,N,H,p.state.transmissionRenderTarget[A.id]),dl.upload(P,yt($e),Kn,R)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(dl.upload(P,yt($e),Kn,R),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&At.setValue(P,"center",k.center),At.setValue(P,"modelViewMatrix",k.modelViewMatrix),At.setValue(P,"normalMatrix",k.normalMatrix),At.setValue(P,"modelMatrix",k.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const pn=Y.uniformsGroups;for(let bn=0,Jl=pn.length;bn<Jl;bn++){const br=pn[bn];F.update(br,li),F.bind(br,li)}}return li}function Ct(A,W){A.ambientLightColor.needsUpdate=W,A.lightProbe.needsUpdate=W,A.directionalLights.needsUpdate=W,A.directionalLightShadows.needsUpdate=W,A.pointLights.needsUpdate=W,A.pointLightShadows.needsUpdate=W,A.spotLights.needsUpdate=W,A.spotLightShadows.needsUpdate=W,A.rectAreaLights.needsUpdate=W,A.hemisphereLights.needsUpdate=W}function hn(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(A,W,j){const Y=se.get(A);Y.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),se.get(A.texture).__webglTexture=W,se.get(A.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:j,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,W){const j=se.get(A);j.__webglFramebuffer=W,j.__useDefaultFramebuffer=W===void 0};const Zn=P.createFramebuffer();this.setRenderTarget=function(A,W=0,j=0){E=A,D=W,T=j;let Y=!0,k=null,ce=!1,Te=!1;if(A){const we=se.get(A);if(we.__useDefaultFramebuffer!==void 0)ne.bindFramebuffer(P.FRAMEBUFFER,null),Y=!1;else if(we.__webglFramebuffer===void 0)R.setupRenderTarget(A);else if(we.__hasExternalTextures)R.rebindTextures(A,se.get(A.texture).__webglTexture,se.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const He=A.depthTexture;if(we.__boundDepthTexture!==He){if(He!==null&&se.has(He)&&(A.width!==He.image.width||A.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(A)}}const Ge=A.texture;(Ge.isData3DTexture||Ge.isDataArrayTexture||Ge.isCompressedArrayTexture)&&(Te=!0);const We=se.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(We[W])?k=We[W][j]:k=We[W],ce=!0):A.samples>0&&R.useMultisampledRTT(A)===!1?k=se.get(A).__webglMultisampledFramebuffer:Array.isArray(We)?k=We[j]:k=We,w.copy(A.viewport),I.copy(A.scissor),U=A.scissorTest}else w.copy(ae).multiplyScalar(N).floor(),I.copy(Ie).multiplyScalar(N).floor(),U=qe;if(j!==0&&(k=Zn),ne.bindFramebuffer(P.FRAMEBUFFER,k)&&Y&&ne.drawBuffers(A,k),ne.viewport(w),ne.scissor(I),ne.setScissorTest(U),ce){const we=se.get(A.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+W,we.__webglTexture,j)}else if(Te){const we=se.get(A.texture),Ge=W;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,we.__webglTexture,j,Ge)}else if(A!==null&&j!==0){const we=se.get(A.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,we.__webglTexture,j)}M=-1},this.readRenderTargetPixels=function(A,W,j,Y,k,ce,Te){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=se.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re){ne.bindFramebuffer(P.FRAMEBUFFER,Re);try{const we=A.texture,Ge=we.format,We=we.type;if(!O.textureFormatReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!O.textureTypeReadable(We)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=A.width-Y&&j>=0&&j<=A.height-k&&P.readPixels(W,j,Y,k,ee.convert(Ge),ee.convert(We),ce)}finally{const we=E!==null?se.get(E).__webglFramebuffer:null;ne.bindFramebuffer(P.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(A,W,j,Y,k,ce,Te){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=se.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re)if(W>=0&&W<=A.width-Y&&j>=0&&j<=A.height-k){ne.bindFramebuffer(P.FRAMEBUFFER,Re);const we=A.texture,Ge=we.format,We=we.type;if(!O.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!O.textureTypeReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const He=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,He),P.bufferData(P.PIXEL_PACK_BUFFER,ce.byteLength,P.STREAM_READ),P.readPixels(W,j,Y,k,ee.convert(Ge),ee.convert(We),0);const Qe=E!==null?se.get(E).__webglFramebuffer:null;ne.bindFramebuffer(P.FRAMEBUFFER,Qe);const pt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await b_(P,pt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,He),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ce),P.deleteBuffer(He),P.deleteSync(pt),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,W=null,j=0){const Y=Math.pow(2,-j),k=Math.floor(A.image.width*Y),ce=Math.floor(A.image.height*Y),Te=W!==null?W.x:0,Re=W!==null?W.y:0;R.setTexture2D(A,0),P.copyTexSubImage2D(P.TEXTURE_2D,j,0,0,Te,Re,k,ce),ne.unbindTexture()};const Wt=P.createFramebuffer(),Xt=P.createFramebuffer();this.copyTextureToTexture=function(A,W,j=null,Y=null,k=0,ce=null){ce===null&&(k!==0?(ul("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ce=k,k=0):ce=0);let Te,Re,we,Ge,We,He,Qe,pt,Bt;const Ft=A.isCompressedTexture?A.mipmaps[ce]:A.image;if(j!==null)Te=j.max.x-j.min.x,Re=j.max.y-j.min.y,we=j.isBox3?j.max.z-j.min.z:1,Ge=j.min.x,We=j.min.y,He=j.isBox3?j.min.z:0;else{const Jn=Math.pow(2,-k);Te=Math.floor(Ft.width*Jn),Re=Math.floor(Ft.height*Jn),A.isDataArrayTexture?we=Ft.depth:A.isData3DTexture?we=Math.floor(Ft.depth*Jn):we=1,Ge=0,We=0,He=0}Y!==null?(Qe=Y.x,pt=Y.y,Bt=Y.z):(Qe=0,pt=0,Bt=0);const ft=ee.convert(W.format),$e=ee.convert(W.type);let nn;W.isData3DTexture?(R.setTexture3D(W,0),nn=P.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(R.setTexture2DArray(W,0),nn=P.TEXTURE_2D_ARRAY):(R.setTexture2D(W,0),nn=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,W.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,W.unpackAlignment);const mt=P.getParameter(P.UNPACK_ROW_LENGTH),li=P.getParameter(P.UNPACK_IMAGE_HEIGHT),us=P.getParameter(P.UNPACK_SKIP_PIXELS),Un=P.getParameter(P.UNPACK_SKIP_ROWS),aa=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,Ft.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ft.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ge),P.pixelStorei(P.UNPACK_SKIP_ROWS,We),P.pixelStorei(P.UNPACK_SKIP_IMAGES,He);const At=A.isDataArrayTexture||A.isData3DTexture,Kn=W.isDataArrayTexture||W.isData3DTexture;if(A.isDepthTexture){const Jn=se.get(A),pn=se.get(W),bn=se.get(Jn.__renderTarget),Jl=se.get(pn.__renderTarget);ne.bindFramebuffer(P.READ_FRAMEBUFFER,bn.__webglFramebuffer),ne.bindFramebuffer(P.DRAW_FRAMEBUFFER,Jl.__webglFramebuffer);for(let br=0;br<we;br++)At&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,se.get(A).__webglTexture,k,He+br),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,se.get(W).__webglTexture,ce,Bt+br)),P.blitFramebuffer(Ge,We,Te,Re,Qe,pt,Te,Re,P.DEPTH_BUFFER_BIT,P.NEAREST);ne.bindFramebuffer(P.READ_FRAMEBUFFER,null),ne.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(k!==0||A.isRenderTargetTexture||se.has(A)){const Jn=se.get(A),pn=se.get(W);ne.bindFramebuffer(P.READ_FRAMEBUFFER,Wt),ne.bindFramebuffer(P.DRAW_FRAMEBUFFER,Xt);for(let bn=0;bn<we;bn++)At?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Jn.__webglTexture,k,He+bn):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Jn.__webglTexture,k),Kn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,pn.__webglTexture,ce,Bt+bn):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,pn.__webglTexture,ce),k!==0?P.blitFramebuffer(Ge,We,Te,Re,Qe,pt,Te,Re,P.COLOR_BUFFER_BIT,P.NEAREST):Kn?P.copyTexSubImage3D(nn,ce,Qe,pt,Bt+bn,Ge,We,Te,Re):P.copyTexSubImage2D(nn,ce,Qe,pt,Ge,We,Te,Re);ne.bindFramebuffer(P.READ_FRAMEBUFFER,null),ne.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Kn?A.isDataTexture||A.isData3DTexture?P.texSubImage3D(nn,ce,Qe,pt,Bt,Te,Re,we,ft,$e,Ft.data):W.isCompressedArrayTexture?P.compressedTexSubImage3D(nn,ce,Qe,pt,Bt,Te,Re,we,ft,Ft.data):P.texSubImage3D(nn,ce,Qe,pt,Bt,Te,Re,we,ft,$e,Ft):A.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,ce,Qe,pt,Te,Re,ft,$e,Ft.data):A.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,ce,Qe,pt,Ft.width,Ft.height,ft,Ft.data):P.texSubImage2D(P.TEXTURE_2D,ce,Qe,pt,Te,Re,ft,$e,Ft);P.pixelStorei(P.UNPACK_ROW_LENGTH,mt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,li),P.pixelStorei(P.UNPACK_SKIP_PIXELS,us),P.pixelStorei(P.UNPACK_SKIP_ROWS,Un),P.pixelStorei(P.UNPACK_SKIP_IMAGES,aa),ce===0&&W.generateMipmaps&&P.generateMipmap(nn),ne.unbindTexture()},this.copyTextureToTexture3D=function(A,W,j=null,Y=null,k=0){return ul('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,W,j,Y,k)},this.initRenderTarget=function(A){se.get(A).__webglFramebuffer===void 0&&R.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?R.setTextureCube(A,0):A.isData3DTexture?R.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?R.setTexture2DArray(A,0):R.setTexture2D(A,0),ne.unbindTexture()},this.resetState=function(){D=0,T=0,E=null,ne.reset(),ye.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return qi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=dt._getUnpackColorSpace()}}function Vi(i){if(i===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return i}function em(i,e){i.prototype=Object.create(e.prototype),i.prototype.constructor=i,i.__proto__=e}/*!
 * GSAP 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var Yn={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Zs={duration:.5,overwrite:!1,delay:0},Gf,sn,wt,ri=1e8,Et=1/ri,Ku=Math.PI*2,AM=Ku/4,wM=0,tm=Math.sqrt,RM=Math.cos,PM=Math.sin,tn=function(e){return typeof e=="string"},It=function(e){return typeof e=="function"},Ki=function(e){return typeof e=="number"},Wf=function(e){return typeof e>"u"},Pi=function(e){return typeof e=="object"},Rn=function(e){return e!==!1},Xf=function(){return typeof window<"u"},Go=function(e){return It(e)||tn(e)},nm=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},dn=Array.isArray,Ju=/(?:-?\.?\d|\.)+/gi,im=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,Fs=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Oc=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,rm=/[+-]=-?[.\d]+/,sm=/[^,'"\[\]\s]+/gi,LM=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,Rt,Si,Qu,qf,$n={},wl={},am,om=function(e){return(wl=Ks(e,$n))&&In},Yf=function(e,t){return console.warn("Invalid property",e,"set to",t,"Missing plugin? gsap.registerPlugin()")},Ka=function(e,t){return!t&&console.warn(e)},lm=function(e,t){return e&&($n[e]=t)&&wl&&(wl[e]=t)||$n},Ja=function(){return 0},FM={suppressEvents:!0,isStart:!0,kill:!1},hl={suppressEvents:!0,kill:!1},IM={suppressEvents:!0},$f={},gr=[],ef={},cm,Vn={},Uc={},Ah=30,pl=[],jf="",Zf=function(e){var t=e[0],n,r;if(Pi(t)||It(t)||(e=[e]),!(n=(t._gsap||{}).harness)){for(r=pl.length;r--&&!pl[r].targetTest(t););n=pl[r]}for(r=e.length;r--;)e[r]&&(e[r]._gsap||(e[r]._gsap=new Fm(e[r],n)))||e.splice(r,1);return e},Xr=function(e){return e._gsap||Zf(si(e))[0]._gsap},um=function(e,t,n){return(n=e[t])&&It(n)?e[t]():Wf(n)&&e.getAttribute&&e.getAttribute(t)||n},Pn=function(e,t){return(e=e.split(",")).forEach(t)||e},Ut=function(e){return Math.round(e*1e5)/1e5||0},Ht=function(e){return Math.round(e*1e7)/1e7||0},Bs=function(e,t){var n=t.charAt(0),r=parseFloat(t.substr(2));return e=parseFloat(e),n==="+"?e+r:n==="-"?e-r:n==="*"?e*r:e/r},OM=function(e,t){for(var n=t.length,r=0;e.indexOf(t[r])<0&&++r<n;);return r<n},Rl=function(){var e=gr.length,t=gr.slice(0),n,r;for(ef={},gr.length=0,n=0;n<e;n++)r=t[n],r&&r._lazy&&(r.render(r._lazy[0],r._lazy[1],!0)._lazy=0)},Kf=function(e){return!!(e._initted||e._startAt||e.add)},fm=function(e,t,n,r){gr.length&&!sn&&Rl(),e.render(t,n,!!(sn&&t<0&&Kf(e))),gr.length&&!sn&&Rl()},dm=function(e){var t=parseFloat(e);return(t||t===0)&&(e+"").match(sm).length<2?t:tn(e)?e.trim():e},hm=function(e){return e},jn=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},UM=function(e){return function(t,n){for(var r in n)r in t||r==="duration"&&e||r==="ease"||(t[r]=n[r])}},Ks=function(e,t){for(var n in t)e[n]=t[n];return e},wh=function i(e,t){for(var n in t)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(e[n]=Pi(t[n])?i(e[n]||(e[n]={}),t[n]):t[n]);return e},Pl=function(e,t){var n={},r;for(r in e)r in t||(n[r]=e[r]);return n},La=function(e){var t=e.parent||Rt,n=e.keyframes?UM(dn(e.keyframes)):jn;if(Rn(e.inherit))for(;t;)n(e,t.vars.defaults),t=t.parent||t._dp;return e},NM=function(e,t){for(var n=e.length,r=n===t.length;r&&n--&&e[n]===t[n];);return n<0},pm=function(e,t,n,r,s){var a=e[r],o;if(s)for(o=t[s];a&&a[s]>o;)a=a._prev;return a?(t._next=a._next,a._next=t):(t._next=e[n],e[n]=t),t._next?t._next._prev=t:e[r]=t,t._prev=a,t.parent=t._dp=e,t},Yl=function(e,t,n,r){n===void 0&&(n="_first"),r===void 0&&(r="_last");var s=t._prev,a=t._next;s?s._next=a:e[n]===t&&(e[n]=a),a?a._prev=s:e[r]===t&&(e[r]=s),t._next=t._prev=t.parent=null},yr=function(e,t){e.parent&&(!t||e.parent.autoRemoveChildren)&&e.parent.remove&&e.parent.remove(e),e._act=0},qr=function(e,t){if(e&&(!t||t._end>e._dur||t._start<0))for(var n=e;n;)n._dirty=1,n=n.parent;return e},BM=function(e){for(var t=e.parent;t&&t.parent;)t._dirty=1,t.totalDuration(),t=t.parent;return e},tf=function(e,t,n,r){return e._startAt&&(sn?e._startAt.revert(hl):e.vars.immediateRender&&!e.vars.autoRevert||e._startAt.render(t,!0,r))},zM=function i(e){return!e||e._ts&&i(e.parent)},Rh=function(e){return e._repeat?Js(e._tTime,e=e.duration()+e._rDelay)*e:0},Js=function(e,t){var n=Math.floor(e=Ht(e/t));return e&&n===e?n-1:n},Ll=function(e,t){return(e-t._start)*t._ts+(t._ts>=0?0:t._dirty?t.totalDuration():t._tDur)},$l=function(e){return e._end=Ht(e._start+(e._tDur/Math.abs(e._ts||e._rts||Et)||0))},jl=function(e,t){var n=e._dp;return n&&n.smoothChildTiming&&e._ts&&(e._start=Ht(n._time-(e._ts>0?t/e._ts:((e._dirty?e.totalDuration():e._tDur)-t)/-e._ts)),$l(e),n._dirty||qr(n,e)),e},mm=function(e,t){var n;if((t._time||!t._dur&&t._initted||t._start<e._time&&(t._dur||!t.add))&&(n=Ll(e.rawTime(),t),(!t._dur||ho(0,t.totalDuration(),n)-t._tTime>Et)&&t.render(n,!0)),qr(e,t)._dp&&e._initted&&e._time>=e._dur&&e._ts){if(e._dur<e.duration())for(n=e;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;e._zTime=-Et}},Ei=function(e,t,n,r){return t.parent&&yr(t),t._start=Ht((Ki(n)?n:n||e!==Rt?ei(e,n,t):e._time)+t._delay),t._end=Ht(t._start+(t.totalDuration()/Math.abs(t.timeScale())||0)),pm(e,t,"_first","_last",e._sort?"_start":0),nf(t)||(e._recent=t),r||mm(e,t),e._ts<0&&jl(e,e._tTime),e},gm=function(e,t){return($n.ScrollTrigger||Yf("scrollTrigger",t))&&$n.ScrollTrigger.create(t,e)},_m=function(e,t,n,r,s){if(Qf(e,t,s),!e._initted)return 1;if(!n&&e._pt&&!sn&&(e._dur&&e.vars.lazy!==!1||!e._dur&&e.vars.lazy)&&cm!==Wn.frame)return gr.push(e),e._lazy=[s,r],1},kM=function i(e){var t=e.parent;return t&&t._ts&&t._initted&&!t._lock&&(t.rawTime()<0||i(t))},nf=function(e){var t=e.data;return t==="isFromStart"||t==="isStart"},VM=function(e,t,n,r){var s=e.ratio,a=t<0||!t&&(!e._start&&kM(e)&&!(!e._initted&&nf(e))||(e._ts<0||e._dp._ts<0)&&!nf(e))?0:1,o=e._rDelay,l=0,c,u,f;if(o&&e._repeat&&(l=ho(0,e._tDur,t),u=Js(l,o),e._yoyo&&u&1&&(a=1-a),u!==Js(e._tTime,o)&&(s=1-a,e.vars.repeatRefresh&&e._initted&&e.invalidate())),a!==s||sn||r||e._zTime===Et||!t&&e._zTime){if(!e._initted&&_m(e,t,r,n,l))return;for(f=e._zTime,e._zTime=t||(n?Et:0),n||(n=t&&!f),e.ratio=a,e._from&&(a=1-a),e._time=0,e._tTime=l,c=e._pt;c;)c.r(a,c.d),c=c._next;t<0&&tf(e,t,n,!0),e._onUpdate&&!n&&qn(e,"onUpdate"),l&&e._repeat&&!n&&e.parent&&qn(e,"onRepeat"),(t>=e._tDur||t<0)&&e.ratio===a&&(a&&yr(e,1),!n&&!sn&&(qn(e,a?"onComplete":"onReverseComplete",!0),e._prom&&e._prom()))}else e._zTime||(e._zTime=t)},HM=function(e,t,n){var r;if(n>t)for(r=e._first;r&&r._start<=n;){if(r.data==="isPause"&&r._start>t)return r;r=r._next}else for(r=e._last;r&&r._start>=n;){if(r.data==="isPause"&&r._start<t)return r;r=r._prev}},Qs=function(e,t,n,r){var s=e._repeat,a=Ht(t)||0,o=e._tTime/e._tDur;return o&&!r&&(e._time*=a/e._dur),e._dur=a,e._tDur=s?s<0?1e10:Ht(a*(s+1)+e._rDelay*s):a,o>0&&!r&&jl(e,e._tTime=e._tDur*o),e.parent&&$l(e),n||qr(e.parent,e),e},Ph=function(e){return e instanceof Mn?qr(e):Qs(e,e._dur)},GM={_start:0,endTime:Ja,totalDuration:Ja},ei=function i(e,t,n){var r=e.labels,s=e._recent||GM,a=e.duration()>=ri?s.endTime(!1):e._dur,o,l,c;return tn(t)&&(isNaN(t)||t in r)?(l=t.charAt(0),c=t.substr(-1)==="%",o=t.indexOf("="),l==="<"||l===">"?(o>=0&&(t=t.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(t.substr(1))||0)*(c?(o<0?s:n).totalDuration()/100:1)):o<0?(t in r||(r[t]=a),r[t]):(l=parseFloat(t.charAt(o-1)+t.substr(o+1)),c&&n&&(l=l/100*(dn(n)?n[0]:n).totalDuration()),o>1?i(e,t.substr(0,o-1),n)+l:a+l)):t==null?a:+t},Fa=function(e,t,n){var r=Ki(t[1]),s=(r?2:1)+(e<2?0:1),a=t[s],o,l;if(r&&(a.duration=t[1]),a.parent=n,e){for(o=a,l=n;l&&!("immediateRender"in o);)o=l.vars.defaults||{},l=Rn(l.vars.inherit)&&l.parent;a.immediateRender=Rn(o.immediateRender),e<2?a.runBackwards=1:a.startAt=t[s-1]}return new Vt(t[0],a,t[s+1])},Tr=function(e,t){return e||e===0?t(e):t},ho=function(e,t,n){return n<e?e:n>t?t:n},un=function(e,t){return!tn(e)||!(t=LM.exec(e))?"":t[1]},WM=function(e,t,n){return Tr(n,function(r){return ho(e,t,r)})},rf=[].slice,vm=function(e,t){return e&&Pi(e)&&"length"in e&&(!t&&!e.length||e.length-1 in e&&Pi(e[0]))&&!e.nodeType&&e!==Si},XM=function(e,t,n){return n===void 0&&(n=[]),e.forEach(function(r){var s;return tn(r)&&!t||vm(r,1)?(s=n).push.apply(s,si(r)):n.push(r)})||n},si=function(e,t,n){return wt&&!t&&wt.selector?wt.selector(e):tn(e)&&!n&&(Qu||!ea())?rf.call((t||qf).querySelectorAll(e),0):dn(e)?XM(e,n):vm(e)?rf.call(e,0):e?[e]:[]},sf=function(e){return e=si(e)[0]||Ka("Invalid scope")||{},function(t){var n=e.current||e.nativeElement||e;return si(t,n.querySelectorAll?n:n===e?Ka("Invalid scope")||qf.createElement("div"):e)}},xm=function(e){return e.sort(function(){return .5-Math.random()})},Sm=function(e){if(It(e))return e;var t=Pi(e)?e:{each:e},n=Yr(t.ease),r=t.from||0,s=parseFloat(t.base)||0,a={},o=r>0&&r<1,l=isNaN(r)||o,c=t.axis,u=r,f=r;return tn(r)?u=f={center:.5,edges:.5,end:1}[r]||0:!o&&l&&(u=r[0],f=r[1]),function(h,d,g){var _=(g||t).length,m=a[_],p,S,v,x,C,D,T,E,M;if(!m){if(M=t.grid==="auto"?0:(t.grid||[1,ri])[1],!M){for(T=-ri;T<(T=g[M++].getBoundingClientRect().left)&&M<_;);M<_&&M--}for(m=a[_]=[],p=l?Math.min(M,_)*u-.5:r%M,S=M===ri?0:l?_*f/M-.5:r/M|0,T=0,E=ri,D=0;D<_;D++)v=D%M-p,x=S-(D/M|0),m[D]=C=c?Math.abs(c==="y"?x:v):tm(v*v+x*x),C>T&&(T=C),C<E&&(E=C);r==="random"&&xm(m),m.max=T-E,m.min=E,m.v=_=(parseFloat(t.amount)||parseFloat(t.each)*(M>_?_-1:c?c==="y"?_/M:M:Math.max(M,_/M))||0)*(r==="edges"?-1:1),m.b=_<0?s-_:s,m.u=un(t.amount||t.each)||0,n=n&&_<0?Rm(n):n}return _=(m[h]-m.min)/m.max||0,Ht(m.b+(n?n(_):_)*m.v)+m.u}},af=function(e){var t=Math.pow(10,((e+"").split(".")[1]||"").length);return function(n){var r=Ht(Math.round(parseFloat(n)/e)*e*t);return(r-r%1)/t+(Ki(n)?0:un(n))}},ym=function(e,t){var n=dn(e),r,s;return!n&&Pi(e)&&(r=n=e.radius||ri,e.values?(e=si(e.values),(s=!Ki(e[0]))&&(r*=r)):e=af(e.increment)),Tr(t,n?It(e)?function(a){return s=e(a),Math.abs(s-a)<=r?s:a}:function(a){for(var o=parseFloat(s?a.x:a),l=parseFloat(s?a.y:0),c=ri,u=0,f=e.length,h,d;f--;)s?(h=e[f].x-o,d=e[f].y-l,h=h*h+d*d):h=Math.abs(e[f]-o),h<c&&(c=h,u=f);return u=!r||c<=r?e[u]:a,s||u===a||Ki(a)?u:u+un(a)}:af(e))},Mm=function(e,t,n,r){return Tr(dn(e)?!t:n===!0?!!(n=0):!r,function(){return dn(e)?e[~~(Math.random()*e.length)]:(n=n||1e-5)&&(r=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((e-n/2+Math.random()*(t-e+n*.99))/n)*n*r)/r})},qM=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(r){return t.reduce(function(s,a){return a(s)},r)}},YM=function(e,t){return function(n){return e(parseFloat(n))+(t||un(n))}},$M=function(e,t,n){return Tm(e,t,0,1,n)},Em=function(e,t,n){return Tr(n,function(r){return e[~~t(r)]})},jM=function i(e,t,n){var r=t-e;return dn(e)?Em(e,i(0,e.length),t):Tr(n,function(s){return(r+(s-e)%r)%r+e})},ZM=function i(e,t,n){var r=t-e,s=r*2;return dn(e)?Em(e,i(0,e.length-1),t):Tr(n,function(a){return a=(s+(a-e)%s)%s||0,e+(a>r?s-a:a)})},Qa=function(e){for(var t=0,n="",r,s,a,o;~(r=e.indexOf("random(",t));)a=e.indexOf(")",r),o=e.charAt(r+7)==="[",s=e.substr(r+7,a-r-7).match(o?sm:Ju),n+=e.substr(t,r-t)+Mm(o?s:+s[0],o?0:+s[1],+s[2]||1e-5),t=a+1;return n+e.substr(t,e.length-t)},Tm=function(e,t,n,r,s){var a=t-e,o=r-n;return Tr(s,function(l){return n+((l-e)/a*o||0)})},KM=function i(e,t,n,r){var s=isNaN(e+t)?0:function(d){return(1-d)*e+d*t};if(!s){var a=tn(e),o={},l,c,u,f,h;if(n===!0&&(r=1)&&(n=null),a)e={p:e},t={p:t};else if(dn(e)&&!dn(t)){for(u=[],f=e.length,h=f-2,c=1;c<f;c++)u.push(i(e[c-1],e[c]));f--,s=function(g){g*=f;var _=Math.min(h,~~g);return u[_](g-_)},n=t}else r||(e=Ks(dn(e)?[]:{},e));if(!u){for(l in t)Jf.call(o,e,l,"get",t[l]);s=function(g){return nd(g,o)||(a?e.p:e)}}}return Tr(n,s)},Lh=function(e,t,n){var r=e.labels,s=ri,a,o,l;for(a in r)o=r[a]-t,o<0==!!n&&o&&s>(o=Math.abs(o))&&(l=a,s=o);return l},qn=function(e,t,n){var r=e.vars,s=r[t],a=wt,o=e._ctx,l,c,u;if(s)return l=r[t+"Params"],c=r.callbackScope||e,n&&gr.length&&Rl(),o&&(wt=o),u=l?s.apply(c,l):s.call(c),wt=a,u},Sa=function(e){return yr(e),e.scrollTrigger&&e.scrollTrigger.kill(!!sn),e.progress()<1&&qn(e,"onInterrupt"),e},Is,bm=[],Dm=function(e){if(e)if(e=!e.name&&e.default||e,Xf()||e.headless){var t=e.name,n=It(e),r=t&&!n&&e.init?function(){this._props=[]}:e,s={init:Ja,render:nd,add:Jf,kill:hE,modifier:dE,rawVars:0},a={targetTest:0,get:0,getSetter:td,aliases:{},register:0};if(ea(),e!==r){if(Vn[t])return;jn(r,jn(Pl(e,s),a)),Ks(r.prototype,Ks(s,Pl(e,a))),Vn[r.prop=t]=r,e.targetTest&&(pl.push(r),$f[t]=1),t=(t==="css"?"CSS":t.charAt(0).toUpperCase()+t.substr(1))+"Plugin"}lm(t,r),e.register&&e.register(In,r,Ln)}else bm.push(e)},Mt=255,ya={aqua:[0,Mt,Mt],lime:[0,Mt,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,Mt],navy:[0,0,128],white:[Mt,Mt,Mt],olive:[128,128,0],yellow:[Mt,Mt,0],orange:[Mt,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[Mt,0,0],pink:[Mt,192,203],cyan:[0,Mt,Mt],transparent:[Mt,Mt,Mt,0]},Nc=function(e,t,n){return e+=e<0?1:e>1?-1:0,(e*6<1?t+(n-t)*e*6:e<.5?n:e*3<2?t+(n-t)*(2/3-e)*6:t)*Mt+.5|0},Cm=function(e,t,n){var r=e?Ki(e)?[e>>16,e>>8&Mt,e&Mt]:0:ya.black,s,a,o,l,c,u,f,h,d,g;if(!r){if(e.substr(-1)===","&&(e=e.substr(0,e.length-1)),ya[e])r=ya[e];else if(e.charAt(0)==="#"){if(e.length<6&&(s=e.charAt(1),a=e.charAt(2),o=e.charAt(3),e="#"+s+s+a+a+o+o+(e.length===5?e.charAt(4)+e.charAt(4):"")),e.length===9)return r=parseInt(e.substr(1,6),16),[r>>16,r>>8&Mt,r&Mt,parseInt(e.substr(7),16)/255];e=parseInt(e.substr(1),16),r=[e>>16,e>>8&Mt,e&Mt]}else if(e.substr(0,3)==="hsl"){if(r=g=e.match(Ju),!t)l=+r[0]%360/360,c=+r[1]/100,u=+r[2]/100,a=u<=.5?u*(c+1):u+c-u*c,s=u*2-a,r.length>3&&(r[3]*=1),r[0]=Nc(l+1/3,s,a),r[1]=Nc(l,s,a),r[2]=Nc(l-1/3,s,a);else if(~e.indexOf("="))return r=e.match(im),n&&r.length<4&&(r[3]=1),r}else r=e.match(Ju)||ya.transparent;r=r.map(Number)}return t&&!g&&(s=r[0]/Mt,a=r[1]/Mt,o=r[2]/Mt,f=Math.max(s,a,o),h=Math.min(s,a,o),u=(f+h)/2,f===h?l=c=0:(d=f-h,c=u>.5?d/(2-f-h):d/(f+h),l=f===s?(a-o)/d+(a<o?6:0):f===a?(o-s)/d+2:(s-a)/d+4,l*=60),r[0]=~~(l+.5),r[1]=~~(c*100+.5),r[2]=~~(u*100+.5)),n&&r.length<4&&(r[3]=1),r},Am=function(e){var t=[],n=[],r=-1;return e.split(_r).forEach(function(s){var a=s.match(Fs)||[];t.push.apply(t,a),n.push(r+=a.length+1)}),t.c=n,t},Fh=function(e,t,n){var r="",s=(e+r).match(_r),a=t?"hsla(":"rgba(",o=0,l,c,u,f;if(!s)return e;if(s=s.map(function(h){return(h=Cm(h,t,1))&&a+(t?h[0]+","+h[1]+"%,"+h[2]+"%,"+h[3]:h.join(","))+")"}),n&&(u=Am(e),l=n.c,l.join(r)!==u.c.join(r)))for(c=e.replace(_r,"1").split(Fs),f=c.length-1;o<f;o++)r+=c[o]+(~l.indexOf(o)?s.shift()||a+"0,0,0,0)":(u.length?u:s.length?s:n).shift());if(!c)for(c=e.split(_r),f=c.length-1;o<f;o++)r+=c[o]+s[o];return r+c[f]},_r=function(){var i="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",e;for(e in ya)i+="|"+e+"\\b";return new RegExp(i+")","gi")}(),JM=/hsl[a]?\(/,wm=function(e){var t=e.join(" "),n;if(_r.lastIndex=0,_r.test(t))return n=JM.test(t),e[1]=Fh(e[1],n),e[0]=Fh(e[0],n,Am(e[1])),!0},eo,Wn=function(){var i=Date.now,e=500,t=33,n=i(),r=n,s=1e3/240,a=s,o=[],l,c,u,f,h,d,g=function _(m){var p=i()-r,S=m===!0,v,x,C,D;if((p>e||p<0)&&(n+=p-t),r+=p,C=r-n,v=C-a,(v>0||S)&&(D=++f.frame,h=C-f.time*1e3,f.time=C=C/1e3,a+=v+(v>=s?4:s-v),x=1),S||(l=c(_)),x)for(d=0;d<o.length;d++)o[d](C,h,D,m)};return f={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(m){return h/(1e3/(m||60))},wake:function(){am&&(!Qu&&Xf()&&(Si=Qu=window,qf=Si.document||{},$n.gsap=In,(Si.gsapVersions||(Si.gsapVersions=[])).push(In.version),om(wl||Si.GreenSockGlobals||!Si.gsap&&Si||{}),bm.forEach(Dm)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&f.sleep(),c=u||function(m){return setTimeout(m,a-f.time*1e3+1|0)},eo=1,g(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(l),eo=0,c=Ja},lagSmoothing:function(m,p){e=m||1/0,t=Math.min(p||33,e)},fps:function(m){s=1e3/(m||240),a=f.time*1e3+s},add:function(m,p,S){var v=p?function(x,C,D,T){m(x,C,D,T),f.remove(v)}:m;return f.remove(m),o[S?"unshift":"push"](v),ea(),v},remove:function(m,p){~(p=o.indexOf(m))&&o.splice(p,1)&&d>=p&&d--},_listeners:o},f}(),ea=function(){return!eo&&Wn.wake()},ut={},QM=/^[\d.\-M][\d.\-,\s]/,eE=/["']/g,tE=function(e){for(var t={},n=e.substr(1,e.length-3).split(":"),r=n[0],s=1,a=n.length,o,l,c;s<a;s++)l=n[s],o=s!==a-1?l.lastIndexOf(","):l.length,c=l.substr(0,o),t[r]=isNaN(c)?c.replace(eE,"").trim():+c,r=l.substr(o+1).trim();return t},nE=function(e){var t=e.indexOf("(")+1,n=e.indexOf(")"),r=e.indexOf("(",t);return e.substring(t,~r&&r<n?e.indexOf(")",n+1):n)},iE=function(e){var t=(e+"").split("("),n=ut[t[0]];return n&&t.length>1&&n.config?n.config.apply(null,~e.indexOf("{")?[tE(t[1])]:nE(e).split(",").map(dm)):ut._CE&&QM.test(e)?ut._CE("",e):n},Rm=function(e){return function(t){return 1-e(1-t)}},Pm=function i(e,t){for(var n=e._first,r;n;)n instanceof Mn?i(n,t):n.vars.yoyoEase&&(!n._yoyo||!n._repeat)&&n._yoyo!==t&&(n.timeline?i(n.timeline,t):(r=n._ease,n._ease=n._yEase,n._yEase=r,n._yoyo=t)),n=n._next},Yr=function(e,t){return e&&(It(e)?e:ut[e]||iE(e))||t},cs=function(e,t,n,r){n===void 0&&(n=function(l){return 1-t(1-l)}),r===void 0&&(r=function(l){return l<.5?t(l*2)/2:1-t((1-l)*2)/2});var s={easeIn:t,easeOut:n,easeInOut:r},a;return Pn(e,function(o){ut[o]=$n[o]=s,ut[a=o.toLowerCase()]=n;for(var l in s)ut[a+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=ut[o+"."+l]=s[l]}),s},Lm=function(e){return function(t){return t<.5?(1-e(1-t*2))/2:.5+e((t-.5)*2)/2}},Bc=function i(e,t,n){var r=t>=1?t:1,s=(n||(e?.3:.45))/(t<1?t:1),a=s/Ku*(Math.asin(1/r)||0),o=function(u){return u===1?1:r*Math.pow(2,-10*u)*PM((u-a)*s)+1},l=e==="out"?o:e==="in"?function(c){return 1-o(1-c)}:Lm(o);return s=Ku/s,l.config=function(c,u){return i(e,c,u)},l},zc=function i(e,t){t===void 0&&(t=1.70158);var n=function(a){return a?--a*a*((t+1)*a+t)+1:0},r=e==="out"?n:e==="in"?function(s){return 1-n(1-s)}:Lm(n);return r.config=function(s){return i(e,s)},r};Pn("Linear,Quad,Cubic,Quart,Quint,Strong",function(i,e){var t=e<5?e+1:e;cs(i+",Power"+(t-1),e?function(n){return Math.pow(n,t)}:function(n){return n},function(n){return 1-Math.pow(1-n,t)},function(n){return n<.5?Math.pow(n*2,t)/2:1-Math.pow((1-n)*2,t)/2})});ut.Linear.easeNone=ut.none=ut.Linear.easeIn;cs("Elastic",Bc("in"),Bc("out"),Bc());(function(i,e){var t=1/e,n=2*t,r=2.5*t,s=function(o){return o<t?i*o*o:o<n?i*Math.pow(o-1.5/e,2)+.75:o<r?i*(o-=2.25/e)*o+.9375:i*Math.pow(o-2.625/e,2)+.984375};cs("Bounce",function(a){return 1-s(1-a)},s)})(7.5625,2.75);cs("Expo",function(i){return Math.pow(2,10*(i-1))*i+i*i*i*i*i*i*(1-i)});cs("Circ",function(i){return-(tm(1-i*i)-1)});cs("Sine",function(i){return i===1?1:-RM(i*AM)+1});cs("Back",zc("in"),zc("out"),zc());ut.SteppedEase=ut.steps=$n.SteppedEase={config:function(e,t){e===void 0&&(e=1);var n=1/e,r=e+(t?0:1),s=t?1:0,a=1-Et;return function(o){return((r*ho(0,a,o)|0)+s)*n}}};Zs.ease=ut["quad.out"];Pn("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(i){return jf+=i+","+i+"Params,"});var Fm=function(e,t){this.id=wM++,e._gsap=this,this.target=e,this.harness=t,this.get=t?t.get:um,this.set=t?t.getSetter:td},to=function(){function i(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,Qs(this,+t.duration,1,1),this.data=t.data,wt&&(this._ctx=wt,wt.data.push(this)),eo||Wn.wake()}var e=i.prototype;return e.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},e.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},e.totalDuration=function(n){return arguments.length?(this._dirty=0,Qs(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},e.totalTime=function(n,r){if(ea(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(jl(this,n),!s._dp||s.parent||mm(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&Ei(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!r||this._initted&&Math.abs(this._zTime)===Et||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),fm(this,n,r)),this},e.time=function(n,r){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+Rh(this))%(this._dur+this._rDelay)||(n?this._dur:0),r):this._time},e.totalProgress=function(n,r){return arguments.length?this.totalTime(this.totalDuration()*n,r):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},e.progress=function(n,r){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+Rh(this),r):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},e.iteration=function(n,r){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*s,r):this._repeat?Js(this._tTime,s)+1:1},e.timeScale=function(n,r){if(!arguments.length)return this._rts===-Et?0:this._rts;if(this._rts===n)return this;var s=this.parent&&this._ts?Ll(this.parent._time,this):this._tTime;return this._rts=+n||0,this._ts=this._ps||n===-Et?0:this._rts,this.totalTime(ho(-Math.abs(this._delay),this.totalDuration(),s),r!==!1),$l(this),BM(this)},e.paused=function(n){return arguments.length?(this._ps!==n&&(this._ps=n,n?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(ea(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==Et&&(this._tTime-=Et)))),this):this._ps},e.startTime=function(n){if(arguments.length){this._start=n;var r=this.parent||this._dp;return r&&(r._sort||!this.parent)&&Ei(r,this,n-this._delay),this}return this._start},e.endTime=function(n){return this._start+(Rn(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},e.rawTime=function(n){var r=this.parent||this._dp;return r?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Ll(r.rawTime(n),this):this._tTime:this._tTime},e.revert=function(n){n===void 0&&(n=IM);var r=sn;return sn=n,Kf(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),sn=r,this},e.globalTime=function(n){for(var r=this,s=arguments.length?n:r.rawTime();r;)s=r._start+s/(Math.abs(r._ts)||1),r=r._dp;return!this.parent&&this._sat?this._sat.globalTime(n):s},e.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,Ph(this)):this._repeat===-2?1/0:this._repeat},e.repeatDelay=function(n){if(arguments.length){var r=this._time;return this._rDelay=n,Ph(this),r?this.time(r):this}return this._rDelay},e.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},e.seek=function(n,r){return this.totalTime(ei(this,n),Rn(r))},e.restart=function(n,r){return this.play().totalTime(n?-this._delay:0,Rn(r)),this._dur||(this._zTime=-Et),this},e.play=function(n,r){return n!=null&&this.seek(n,r),this.reversed(!1).paused(!1)},e.reverse=function(n,r){return n!=null&&this.seek(n||this.totalDuration(),r),this.reversed(!0).paused(!1)},e.pause=function(n,r){return n!=null&&this.seek(n,r),this.paused(!0)},e.resume=function(){return this.paused(!1)},e.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-Et:0)),this):this._rts<0},e.invalidate=function(){return this._initted=this._act=0,this._zTime=-Et,this},e.isActive=function(){var n=this.parent||this._dp,r=this._start,s;return!!(!n||this._ts&&this._initted&&n.isActive()&&(s=n.rawTime(!0))>=r&&s<this.endTime(!0)-Et)},e.eventCallback=function(n,r,s){var a=this.vars;return arguments.length>1?(r?(a[n]=r,s&&(a[n+"Params"]=s),n==="onUpdate"&&(this._onUpdate=r)):delete a[n],this):a[n]},e.then=function(n){var r=this;return new Promise(function(s){var a=It(n)?n:hm,o=function(){var c=r.then;r.then=null,It(a)&&(a=a(r))&&(a.then||a===r)&&(r.then=c),s(a),r.then=c};r._initted&&r.totalProgress()===1&&r._ts>=0||!r._tTime&&r._ts<0?o():r._prom=o})},e.kill=function(){Sa(this)},i}();jn(to.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-Et,_prom:0,_ps:!1,_rts:1});var Mn=function(i){em(e,i);function e(n,r){var s;return n===void 0&&(n={}),s=i.call(this,n)||this,s.labels={},s.smoothChildTiming=!!n.smoothChildTiming,s.autoRemoveChildren=!!n.autoRemoveChildren,s._sort=Rn(n.sortChildren),Rt&&Ei(n.parent||Rt,Vi(s),r),n.reversed&&s.reverse(),n.paused&&s.paused(!0),n.scrollTrigger&&gm(Vi(s),n.scrollTrigger),s}var t=e.prototype;return t.to=function(r,s,a){return Fa(0,arguments,this),this},t.from=function(r,s,a){return Fa(1,arguments,this),this},t.fromTo=function(r,s,a,o){return Fa(2,arguments,this),this},t.set=function(r,s,a){return s.duration=0,s.parent=this,La(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new Vt(r,s,ei(this,a),1),this},t.call=function(r,s,a){return Ei(this,Vt.delayedCall(0,r,s),a)},t.staggerTo=function(r,s,a,o,l,c,u){return a.duration=s,a.stagger=a.stagger||o,a.onComplete=c,a.onCompleteParams=u,a.parent=this,new Vt(r,a,ei(this,l)),this},t.staggerFrom=function(r,s,a,o,l,c,u){return a.runBackwards=1,La(a).immediateRender=Rn(a.immediateRender),this.staggerTo(r,s,a,o,l,c,u)},t.staggerFromTo=function(r,s,a,o,l,c,u,f){return o.startAt=a,La(o).immediateRender=Rn(o.immediateRender),this.staggerTo(r,s,o,l,c,u,f)},t.render=function(r,s,a){var o=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,u=r<=0?0:Ht(r),f=this._zTime<0!=r<0&&(this._initted||!c),h,d,g,_,m,p,S,v,x,C,D,T;if(this!==Rt&&u>l&&r>=0&&(u=l),u!==this._tTime||a||f){if(o!==this._time&&c&&(u+=this._time-o,r+=this._time-o),h=u,x=this._start,v=this._ts,p=!v,f&&(c||(o=this._zTime),(r||!s)&&(this._zTime=r)),this._repeat){if(D=this._yoyo,m=c+this._rDelay,this._repeat<-1&&r<0)return this.totalTime(m*100+r,s,a);if(h=Ht(u%m),u===l?(_=this._repeat,h=c):(C=Ht(u/m),_=~~C,_&&_===C&&(h=c,_--),h>c&&(h=c)),C=Js(this._tTime,m),!o&&this._tTime&&C!==_&&this._tTime-C*m-this._dur<=0&&(C=_),D&&_&1&&(h=c-h,T=1),_!==C&&!this._lock){var E=D&&C&1,M=E===(D&&_&1);if(_<C&&(E=!E),o=E?0:u%c?c:u,this._lock=1,this.render(o||(T?0:Ht(_*m)),s,!c)._lock=0,this._tTime=u,!s&&this.parent&&qn(this,"onRepeat"),this.vars.repeatRefresh&&!T&&(this.invalidate()._lock=1),o&&o!==this._time||p!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,M&&(this._lock=2,o=E?c:-1e-4,this.render(o,!0),this.vars.repeatRefresh&&!T&&this.invalidate()),this._lock=0,!this._ts&&!p)return this;Pm(this,T)}}if(this._hasPause&&!this._forcing&&this._lock<2&&(S=HM(this,Ht(o),Ht(h)),S&&(u-=h-(h=S._start))),this._tTime=u,this._time=h,this._act=!v,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=r,o=0),!o&&u&&!s&&!C&&(qn(this,"onStart"),this._tTime!==u))return this;if(h>=o&&r>=0)for(d=this._first;d;){if(g=d._next,(d._act||h>=d._start)&&d._ts&&S!==d){if(d.parent!==this)return this.render(r,s,a);if(d.render(d._ts>0?(h-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(h-d._start)*d._ts,s,a),h!==this._time||!this._ts&&!p){S=0,g&&(u+=this._zTime=-Et);break}}d=g}else{d=this._last;for(var y=r<0?r:h;d;){if(g=d._prev,(d._act||y<=d._end)&&d._ts&&S!==d){if(d.parent!==this)return this.render(r,s,a);if(d.render(d._ts>0?(y-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(y-d._start)*d._ts,s,a||sn&&Kf(d)),h!==this._time||!this._ts&&!p){S=0,g&&(u+=this._zTime=y?-Et:Et);break}}d=g}}if(S&&!s&&(this.pause(),S.render(h>=o?0:-Et)._zTime=h>=o?1:-1,this._ts))return this._start=x,$l(this),this.render(r,s,a);this._onUpdate&&!s&&qn(this,"onUpdate",!0),(u===l&&this._tTime>=this.totalDuration()||!u&&o)&&(x===this._start||Math.abs(v)!==Math.abs(this._ts))&&(this._lock||((r||!c)&&(u===l&&this._ts>0||!u&&this._ts<0)&&yr(this,1),!s&&!(r<0&&!o)&&(u||o||!l)&&(qn(this,u===l&&r>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom())))}return this},t.add=function(r,s){var a=this;if(Ki(s)||(s=ei(this,s,r)),!(r instanceof to)){if(dn(r))return r.forEach(function(o){return a.add(o,s)}),this;if(tn(r))return this.addLabel(r,s);if(It(r))r=Vt.delayedCall(0,r);else return this}return this!==r?Ei(this,r,s):this},t.getChildren=function(r,s,a,o){r===void 0&&(r=!0),s===void 0&&(s=!0),a===void 0&&(a=!0),o===void 0&&(o=-ri);for(var l=[],c=this._first;c;)c._start>=o&&(c instanceof Vt?s&&l.push(c):(a&&l.push(c),r&&l.push.apply(l,c.getChildren(!0,s,a)))),c=c._next;return l},t.getById=function(r){for(var s=this.getChildren(1,1,1),a=s.length;a--;)if(s[a].vars.id===r)return s[a]},t.remove=function(r){return tn(r)?this.removeLabel(r):It(r)?this.killTweensOf(r):(r.parent===this&&Yl(this,r),r===this._recent&&(this._recent=this._last),qr(this))},t.totalTime=function(r,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=Ht(Wn.time-(this._ts>0?r/this._ts:(this.totalDuration()-r)/-this._ts))),i.prototype.totalTime.call(this,r,s),this._forcing=0,this):this._tTime},t.addLabel=function(r,s){return this.labels[r]=ei(this,s),this},t.removeLabel=function(r){return delete this.labels[r],this},t.addPause=function(r,s,a){var o=Vt.delayedCall(0,s||Ja,a);return o.data="isPause",this._hasPause=1,Ei(this,o,ei(this,r))},t.removePause=function(r){var s=this._first;for(r=ei(this,r);s;)s._start===r&&s.data==="isPause"&&yr(s),s=s._next},t.killTweensOf=function(r,s,a){for(var o=this.getTweensOf(r,a),l=o.length;l--;)lr!==o[l]&&o[l].kill(r,s);return this},t.getTweensOf=function(r,s){for(var a=[],o=si(r),l=this._first,c=Ki(s),u;l;)l instanceof Vt?OM(l._targets,o)&&(c?(!lr||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&a.push(l):(u=l.getTweensOf(o,s)).length&&a.push.apply(a,u),l=l._next;return a},t.tweenTo=function(r,s){s=s||{};var a=this,o=ei(a,r),l=s,c=l.startAt,u=l.onStart,f=l.onStartParams,h=l.immediateRender,d,g=Vt.to(a,jn({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:o,overwrite:"auto",duration:s.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale())||Et,onStart:function(){if(a.pause(),!d){var m=s.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale());g._dur!==m&&Qs(g,m,0,1).render(g._time,!0,!0),d=1}u&&u.apply(g,f||[])}},s));return h?g.render(0):g},t.tweenFromTo=function(r,s,a){return this.tweenTo(s,jn({startAt:{time:ei(this,r)}},a))},t.recent=function(){return this._recent},t.nextLabel=function(r){return r===void 0&&(r=this._time),Lh(this,ei(this,r))},t.previousLabel=function(r){return r===void 0&&(r=this._time),Lh(this,ei(this,r),1)},t.currentLabel=function(r){return arguments.length?this.seek(r,!0):this.previousLabel(this._time+Et)},t.shiftChildren=function(r,s,a){a===void 0&&(a=0);for(var o=this._first,l=this.labels,c;o;)o._start>=a&&(o._start+=r,o._end+=r),o=o._next;if(s)for(c in l)l[c]>=a&&(l[c]+=r);return qr(this)},t.invalidate=function(r){var s=this._first;for(this._lock=0;s;)s.invalidate(r),s=s._next;return i.prototype.invalidate.call(this,r)},t.clear=function(r){r===void 0&&(r=!0);for(var s=this._first,a;s;)a=s._next,this.remove(s),s=a;return this._dp&&(this._time=this._tTime=this._pTime=0),r&&(this.labels={}),qr(this)},t.totalDuration=function(r){var s=0,a=this,o=a._last,l=ri,c,u,f;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-r:r));if(a._dirty){for(f=a.parent;o;)c=o._prev,o._dirty&&o.totalDuration(),u=o._start,u>l&&a._sort&&o._ts&&!a._lock?(a._lock=1,Ei(a,o,u-o._delay,1)._lock=0):l=u,u<0&&o._ts&&(s-=u,(!f&&!a._dp||f&&f.smoothChildTiming)&&(a._start+=u/a._ts,a._time-=u,a._tTime-=u),a.shiftChildren(-u,!1,-1/0),l=0),o._end>s&&o._ts&&(s=o._end),o=c;Qs(a,a===Rt&&a._time>s?a._time:s,1,1),a._dirty=0}return a._tDur},e.updateRoot=function(r){if(Rt._ts&&(fm(Rt,Ll(r,Rt)),cm=Wn.frame),Wn.frame>=Ah){Ah+=Yn.autoSleep||120;var s=Rt._first;if((!s||!s._ts)&&Yn.autoSleep&&Wn._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||Wn.sleep()}}},e}(to);jn(Mn.prototype,{_lock:0,_hasPause:0,_forcing:0});var rE=function(e,t,n,r,s,a,o){var l=new Ln(this._pt,e,t,0,1,zm,null,s),c=0,u=0,f,h,d,g,_,m,p,S;for(l.b=n,l.e=r,n+="",r+="",(p=~r.indexOf("random("))&&(r=Qa(r)),a&&(S=[n,r],a(S,e,t),n=S[0],r=S[1]),h=n.match(Oc)||[];f=Oc.exec(r);)g=f[0],_=r.substring(c,f.index),d?d=(d+1)%5:_.substr(-5)==="rgba("&&(d=1),g!==h[u++]&&(m=parseFloat(h[u-1])||0,l._pt={_next:l._pt,p:_||u===1?_:",",s:m,c:g.charAt(1)==="="?Bs(m,g)-m:parseFloat(g)-m,m:d&&d<4?Math.round:0},c=Oc.lastIndex);return l.c=c<r.length?r.substring(c,r.length):"",l.fp=o,(rm.test(r)||p)&&(l.e=0),this._pt=l,l},Jf=function(e,t,n,r,s,a,o,l,c,u){It(r)&&(r=r(s||0,e,a));var f=e[t],h=n!=="get"?n:It(f)?c?e[t.indexOf("set")||!It(e["get"+t.substr(3)])?t:"get"+t.substr(3)](c):e[t]():f,d=It(f)?c?cE:Nm:ed,g;if(tn(r)&&(~r.indexOf("random(")&&(r=Qa(r)),r.charAt(1)==="="&&(g=Bs(h,r)+(un(h)||0),(g||g===0)&&(r=g))),!u||h!==r||of)return!isNaN(h*r)&&r!==""?(g=new Ln(this._pt,e,t,+h||0,r-(h||0),typeof f=="boolean"?fE:Bm,0,d),c&&(g.fp=c),o&&g.modifier(o,this,e),this._pt=g):(!f&&!(t in e)&&Yf(t,r),rE.call(this,e,t,h,r,d,l||Yn.stringFilter,c))},sE=function(e,t,n,r,s){if(It(e)&&(e=Ia(e,s,t,n,r)),!Pi(e)||e.style&&e.nodeType||dn(e)||nm(e))return tn(e)?Ia(e,s,t,n,r):e;var a={},o;for(o in e)a[o]=Ia(e[o],s,t,n,r);return a},Im=function(e,t,n,r,s,a){var o,l,c,u;if(Vn[e]&&(o=new Vn[e]).init(s,o.rawVars?t[e]:sE(t[e],r,s,a,n),n,r,a)!==!1&&(n._pt=l=new Ln(n._pt,s,e,0,1,o.render,o,0,o.priority),n!==Is))for(c=n._ptLookup[n._targets.indexOf(s)],u=o._props.length;u--;)c[o._props[u]]=l;return o},lr,of,Qf=function i(e,t,n){var r=e.vars,s=r.ease,a=r.startAt,o=r.immediateRender,l=r.lazy,c=r.onUpdate,u=r.runBackwards,f=r.yoyoEase,h=r.keyframes,d=r.autoRevert,g=e._dur,_=e._startAt,m=e._targets,p=e.parent,S=p&&p.data==="nested"?p.vars.targets:m,v=e._overwrite==="auto"&&!Gf,x=e.timeline,C,D,T,E,M,y,w,I,U,V,q,X,H;if(x&&(!h||!s)&&(s="none"),e._ease=Yr(s,Zs.ease),e._yEase=f?Rm(Yr(f===!0?s:f,Zs.ease)):0,f&&e._yoyo&&!e._repeat&&(f=e._yEase,e._yEase=e._ease,e._ease=f),e._from=!x&&!!r.runBackwards,!x||h&&!r.stagger){if(I=m[0]?Xr(m[0]).harness:0,X=I&&r[I.prop],C=Pl(r,$f),_&&(_._zTime<0&&_.progress(1),t<0&&u&&o&&!d?_.render(-1,!0):_.revert(u&&g?hl:FM),_._lazy=0),a){if(yr(e._startAt=Vt.set(m,jn({data:"isStart",overwrite:!1,parent:p,immediateRender:!0,lazy:!_&&Rn(l),startAt:null,delay:0,onUpdate:c&&function(){return qn(e,"onUpdate")},stagger:0},a))),e._startAt._dp=0,e._startAt._sat=e,t<0&&(sn||!o&&!d)&&e._startAt.revert(hl),o&&g&&t<=0&&n<=0){t&&(e._zTime=t);return}}else if(u&&g&&!_){if(t&&(o=!1),T=jn({overwrite:!1,data:"isFromStart",lazy:o&&!_&&Rn(l),immediateRender:o,stagger:0,parent:p},C),X&&(T[I.prop]=X),yr(e._startAt=Vt.set(m,T)),e._startAt._dp=0,e._startAt._sat=e,t<0&&(sn?e._startAt.revert(hl):e._startAt.render(-1,!0)),e._zTime=t,!o)i(e._startAt,Et,Et);else if(!t)return}for(e._pt=e._ptCache=0,l=g&&Rn(l)||l&&!g,D=0;D<m.length;D++){if(M=m[D],w=M._gsap||Zf(m)[D]._gsap,e._ptLookup[D]=V={},ef[w.id]&&gr.length&&Rl(),q=S===m?D:S.indexOf(M),I&&(U=new I).init(M,X||C,e,q,S)!==!1&&(e._pt=E=new Ln(e._pt,M,U.name,0,1,U.render,U,0,U.priority),U._props.forEach(function(N){V[N]=E}),U.priority&&(y=1)),!I||X)for(T in C)Vn[T]&&(U=Im(T,C,e,q,M,S))?U.priority&&(y=1):V[T]=E=Jf.call(e,M,T,"get",C[T],q,S,0,r.stringFilter);e._op&&e._op[D]&&e.kill(M,e._op[D]),v&&e._pt&&(lr=e,Rt.killTweensOf(M,V,e.globalTime(t)),H=!e.parent,lr=0),e._pt&&l&&(ef[w.id]=1)}y&&km(e),e._onInit&&e._onInit(e)}e._onUpdate=c,e._initted=(!e._op||e._pt)&&!H,h&&t<=0&&x.render(ri,!0,!0)},aE=function(e,t,n,r,s,a,o,l){var c=(e._pt&&e._ptCache||(e._ptCache={}))[t],u,f,h,d;if(!c)for(c=e._ptCache[t]=[],h=e._ptLookup,d=e._targets.length;d--;){if(u=h[d][t],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==t&&u.fp!==t;)u=u._next;if(!u)return of=1,e.vars[t]="+=0",Qf(e,o),of=0,l?Ka(t+" not eligible for reset"):1;c.push(u)}for(d=c.length;d--;)f=c[d],u=f._pt||f,u.s=(r||r===0)&&!s?r:u.s+(r||0)+a*u.c,u.c=n-u.s,f.e&&(f.e=Ut(n)+un(f.e)),f.b&&(f.b=u.s+un(f.b))},oE=function(e,t){var n=e[0]?Xr(e[0]).harness:0,r=n&&n.aliases,s,a,o,l;if(!r)return t;s=Ks({},t);for(a in r)if(a in s)for(l=r[a].split(","),o=l.length;o--;)s[l[o]]=s[a];return s},lE=function(e,t,n,r){var s=t.ease||r||"power1.inOut",a,o;if(dn(t))o=n[e]||(n[e]=[]),t.forEach(function(l,c){return o.push({t:c/(t.length-1)*100,v:l,e:s})});else for(a in t)o=n[a]||(n[a]=[]),a==="ease"||o.push({t:parseFloat(e),v:t[a],e:s})},Ia=function(e,t,n,r,s){return It(e)?e.call(t,n,r,s):tn(e)&&~e.indexOf("random(")?Qa(e):e},Om=jf+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",Um={};Pn(Om+",id,stagger,delay,duration,paused,scrollTrigger",function(i){return Um[i]=1});var Vt=function(i){em(e,i);function e(n,r,s,a){var o;typeof r=="number"&&(s.duration=r,r=s,s=null),o=i.call(this,a?r:La(r))||this;var l=o.vars,c=l.duration,u=l.delay,f=l.immediateRender,h=l.stagger,d=l.overwrite,g=l.keyframes,_=l.defaults,m=l.scrollTrigger,p=l.yoyoEase,S=r.parent||Rt,v=(dn(n)||nm(n)?Ki(n[0]):"length"in r)?[n]:si(n),x,C,D,T,E,M,y,w;if(o._targets=v.length?Zf(v):Ka("GSAP target "+n+" not found. https://gsap.com",!Yn.nullTargetWarn)||[],o._ptLookup=[],o._overwrite=d,g||h||Go(c)||Go(u)){if(r=o.vars,x=o.timeline=new Mn({data:"nested",defaults:_||{},targets:S&&S.data==="nested"?S.vars.targets:v}),x.kill(),x.parent=x._dp=Vi(o),x._start=0,h||Go(c)||Go(u)){if(T=v.length,y=h&&Sm(h),Pi(h))for(E in h)~Om.indexOf(E)&&(w||(w={}),w[E]=h[E]);for(C=0;C<T;C++)D=Pl(r,Um),D.stagger=0,p&&(D.yoyoEase=p),w&&Ks(D,w),M=v[C],D.duration=+Ia(c,Vi(o),C,M,v),D.delay=(+Ia(u,Vi(o),C,M,v)||0)-o._delay,!h&&T===1&&D.delay&&(o._delay=u=D.delay,o._start+=u,D.delay=0),x.to(M,D,y?y(C,M,v):0),x._ease=ut.none;x.duration()?c=u=0:o.timeline=0}else if(g){La(jn(x.vars.defaults,{ease:"none"})),x._ease=Yr(g.ease||r.ease||"none");var I=0,U,V,q;if(dn(g))g.forEach(function(X){return x.to(v,X,">")}),x.duration();else{D={};for(E in g)E==="ease"||E==="easeEach"||lE(E,g[E],D,g.easeEach);for(E in D)for(U=D[E].sort(function(X,H){return X.t-H.t}),I=0,C=0;C<U.length;C++)V=U[C],q={ease:V.e,duration:(V.t-(C?U[C-1].t:0))/100*c},q[E]=V.v,x.to(v,q,I),I+=q.duration;x.duration()<c&&x.to({},{duration:c-x.duration()})}}c||o.duration(c=x.duration())}else o.timeline=0;return d===!0&&!Gf&&(lr=Vi(o),Rt.killTweensOf(v),lr=0),Ei(S,Vi(o),s),r.reversed&&o.reverse(),r.paused&&o.paused(!0),(f||!c&&!g&&o._start===Ht(S._time)&&Rn(f)&&zM(Vi(o))&&S.data!=="nested")&&(o._tTime=-Et,o.render(Math.max(0,-u)||0)),m&&gm(Vi(o),m),o}var t=e.prototype;return t.render=function(r,s,a){var o=this._time,l=this._tDur,c=this._dur,u=r<0,f=r>l-Et&&!u?l:r<Et?0:r,h,d,g,_,m,p,S,v,x;if(!c)VM(this,r,s,a);else if(f!==this._tTime||!r||a||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(h=f,v=this.timeline,this._repeat){if(_=c+this._rDelay,this._repeat<-1&&u)return this.totalTime(_*100+r,s,a);if(h=Ht(f%_),f===l?(g=this._repeat,h=c):(m=Ht(f/_),g=~~m,g&&g===m?(h=c,g--):h>c&&(h=c)),p=this._yoyo&&g&1,p&&(x=this._yEase,h=c-h),m=Js(this._tTime,_),h===o&&!a&&this._initted&&g===m)return this._tTime=f,this;g!==m&&(v&&this._yEase&&Pm(v,p),this.vars.repeatRefresh&&!p&&!this._lock&&h!==_&&this._initted&&(this._lock=a=1,this.render(Ht(_*g),!0).invalidate()._lock=0))}if(!this._initted){if(_m(this,u?r:h,a,s,f))return this._tTime=0,this;if(o!==this._time&&!(a&&this.vars.repeatRefresh&&g!==m))return this;if(c!==this._dur)return this.render(r,s,a)}if(this._tTime=f,this._time=h,!this._act&&this._ts&&(this._act=1,this._lazy=0),this.ratio=S=(x||this._ease)(h/c),this._from&&(this.ratio=S=1-S),!o&&f&&!s&&!m&&(qn(this,"onStart"),this._tTime!==f))return this;for(d=this._pt;d;)d.r(S,d.d),d=d._next;v&&v.render(r<0?r:v._dur*v._ease(h/this._dur),s,a)||this._startAt&&(this._zTime=r),this._onUpdate&&!s&&(u&&tf(this,r,s,a),qn(this,"onUpdate")),this._repeat&&g!==m&&this.vars.onRepeat&&!s&&this.parent&&qn(this,"onRepeat"),(f===this._tDur||!f)&&this._tTime===f&&(u&&!this._onUpdate&&tf(this,r,!0,!0),(r||!c)&&(f===this._tDur&&this._ts>0||!f&&this._ts<0)&&yr(this,1),!s&&!(u&&!o)&&(f||o||p)&&(qn(this,f===l?"onComplete":"onReverseComplete",!0),this._prom&&!(f<l&&this.timeScale()>0)&&this._prom()))}return this},t.targets=function(){return this._targets},t.invalidate=function(r){return(!r||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(r),i.prototype.invalidate.call(this,r)},t.resetTo=function(r,s,a,o,l){eo||Wn.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||Qf(this,c),u=this._ease(c/this._dur),aE(this,r,s,a,o,u,c,l)?this.resetTo(r,s,a,o,1):(jl(this,0),this.parent||pm(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},t.kill=function(r,s){if(s===void 0&&(s="all"),!r&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?Sa(this):this.scrollTrigger&&this.scrollTrigger.kill(!!sn),this;if(this.timeline){var a=this.timeline.totalDuration();return this.timeline.killTweensOf(r,s,lr&&lr.vars.overwrite!==!0)._first||Sa(this),this.parent&&a!==this.timeline.totalDuration()&&Qs(this,this._dur*this.timeline._tDur/a,0,1),this}var o=this._targets,l=r?si(r):o,c=this._ptLookup,u=this._pt,f,h,d,g,_,m,p;if((!s||s==="all")&&NM(o,l))return s==="all"&&(this._pt=0),Sa(this);for(f=this._op=this._op||[],s!=="all"&&(tn(s)&&(_={},Pn(s,function(S){return _[S]=1}),s=_),s=oE(o,s)),p=o.length;p--;)if(~l.indexOf(o[p])){h=c[p],s==="all"?(f[p]=s,g=h,d={}):(d=f[p]=f[p]||{},g=s);for(_ in g)m=h&&h[_],m&&((!("kill"in m.d)||m.d.kill(_)===!0)&&Yl(this,m,"_pt"),delete h[_]),d!=="all"&&(d[_]=1)}return this._initted&&!this._pt&&u&&Sa(this),this},e.to=function(r,s){return new e(r,s,arguments[2])},e.from=function(r,s){return Fa(1,arguments)},e.delayedCall=function(r,s,a,o){return new e(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:r,onComplete:s,onReverseComplete:s,onCompleteParams:a,onReverseCompleteParams:a,callbackScope:o})},e.fromTo=function(r,s,a){return Fa(2,arguments)},e.set=function(r,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new e(r,s)},e.killTweensOf=function(r,s,a){return Rt.killTweensOf(r,s,a)},e}(to);jn(Vt.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});Pn("staggerTo,staggerFrom,staggerFromTo",function(i){Vt[i]=function(){var e=new Mn,t=rf.call(arguments,0);return t.splice(i==="staggerFromTo"?5:4,0,0),e[i].apply(e,t)}});var ed=function(e,t,n){return e[t]=n},Nm=function(e,t,n){return e[t](n)},cE=function(e,t,n,r){return e[t](r.fp,n)},uE=function(e,t,n){return e.setAttribute(t,n)},td=function(e,t){return It(e[t])?Nm:Wf(e[t])&&e.setAttribute?uE:ed},Bm=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e6)/1e6,t)},fE=function(e,t){return t.set(t.t,t.p,!!(t.s+t.c*e),t)},zm=function(e,t){var n=t._pt,r="";if(!e&&t.b)r=t.b;else if(e===1&&t.e)r=t.e;else{for(;n;)r=n.p+(n.m?n.m(n.s+n.c*e):Math.round((n.s+n.c*e)*1e4)/1e4)+r,n=n._next;r+=t.c}t.set(t.t,t.p,r,t)},nd=function(e,t){for(var n=t._pt;n;)n.r(e,n.d),n=n._next},dE=function(e,t,n,r){for(var s=this._pt,a;s;)a=s._next,s.p===r&&s.modifier(e,t,n),s=a},hE=function(e){for(var t=this._pt,n,r;t;)r=t._next,t.p===e&&!t.op||t.op===e?Yl(this,t,"_pt"):t.dep||(n=1),t=r;return!n},pE=function(e,t,n,r){r.mSet(e,t,r.m.call(r.tween,n,r.mt),r)},km=function(e){for(var t=e._pt,n,r,s,a;t;){for(n=t._next,r=s;r&&r.pr>t.pr;)r=r._next;(t._prev=r?r._prev:a)?t._prev._next=t:s=t,(t._next=r)?r._prev=t:a=t,t=n}e._pt=s},Ln=function(){function i(t,n,r,s,a,o,l,c,u){this.t=n,this.s=s,this.c=a,this.p=r,this.r=o||Bm,this.d=l||this,this.set=c||ed,this.pr=u||0,this._next=t,t&&(t._prev=this)}var e=i.prototype;return e.modifier=function(n,r,s){this.mSet=this.mSet||this.set,this.set=pE,this.m=n,this.mt=s,this.tween=r},i}();Pn(jf+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger",function(i){return $f[i]=1});$n.TweenMax=$n.TweenLite=Vt;$n.TimelineLite=$n.TimelineMax=Mn;Rt=new Mn({sortChildren:!1,defaults:Zs,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});Yn.stringFilter=wm;var $r=[],ml={},mE=[],Ih=0,gE=0,kc=function(e){return(ml[e]||mE).map(function(t){return t()})},lf=function(){var e=Date.now(),t=[];e-Ih>2&&(kc("matchMediaInit"),$r.forEach(function(n){var r=n.queries,s=n.conditions,a,o,l,c;for(o in r)a=Si.matchMedia(r[o]).matches,a&&(l=1),a!==s[o]&&(s[o]=a,c=1);c&&(n.revert(),l&&t.push(n))}),kc("matchMediaRevert"),t.forEach(function(n){return n.onMatch(n,function(r){return n.add(null,r)})}),Ih=e,kc("matchMedia"))},Vm=function(){function i(t,n){this.selector=n&&sf(n),this.data=[],this._r=[],this.isReverted=!1,this.id=gE++,t&&this.add(t)}var e=i.prototype;return e.add=function(n,r,s){It(n)&&(s=r,r=n,n=It);var a=this,o=function(){var c=wt,u=a.selector,f;return c&&c!==a&&c.data.push(a),s&&(a.selector=sf(s)),wt=a,f=r.apply(a,arguments),It(f)&&a._r.push(f),wt=c,a.selector=u,a.isReverted=!1,f};return a.last=o,n===It?o(a,function(l){return a.add(null,l)}):n?a[n]=o:o},e.ignore=function(n){var r=wt;wt=null,n(this),wt=r},e.getTweens=function(){var n=[];return this.data.forEach(function(r){return r instanceof i?n.push.apply(n,r.getTweens()):r instanceof Vt&&!(r.parent&&r.parent.data==="nested")&&n.push(r)}),n},e.clear=function(){this._r.length=this.data.length=0},e.kill=function(n,r){var s=this;if(n?function(){for(var o=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(u){return o.splice(o.indexOf(u),1)}));for(o.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,f){return f.g-u.g||-1/0}).forEach(function(u){return u.t.revert(n)}),l=s.data.length;l--;)c=s.data[l],c instanceof Mn?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof Vt)&&c.revert&&c.revert(n);s._r.forEach(function(u){return u(n,s)}),s.isReverted=!0}():this.data.forEach(function(o){return o.kill&&o.kill()}),this.clear(),r)for(var a=$r.length;a--;)$r[a].id===this.id&&$r.splice(a,1)},e.revert=function(n){this.kill(n||{})},i}(),_E=function(){function i(t){this.contexts=[],this.scope=t,wt&&wt.data.push(this)}var e=i.prototype;return e.add=function(n,r,s){Pi(n)||(n={matches:n});var a=new Vm(0,s||this.scope),o=a.conditions={},l,c,u;wt&&!a.selector&&(a.selector=wt.selector),this.contexts.push(a),r=a.add("onMatch",r),a.queries=n;for(c in n)c==="all"?u=1:(l=Si.matchMedia(n[c]),l&&($r.indexOf(a)<0&&$r.push(a),(o[c]=l.matches)&&(u=1),l.addListener?l.addListener(lf):l.addEventListener("change",lf)));return u&&r(a,function(f){return a.add(null,f)}),this},e.revert=function(n){this.kill(n||{})},e.kill=function(n){this.contexts.forEach(function(r){return r.kill(n,!0)})},i}(),Fl={registerPlugin:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];t.forEach(function(r){return Dm(r)})},timeline:function(e){return new Mn(e)},getTweensOf:function(e,t){return Rt.getTweensOf(e,t)},getProperty:function(e,t,n,r){tn(e)&&(e=si(e)[0]);var s=Xr(e||{}).get,a=n?hm:dm;return n==="native"&&(n=""),e&&(t?a((Vn[t]&&Vn[t].get||s)(e,t,n,r)):function(o,l,c){return a((Vn[o]&&Vn[o].get||s)(e,o,l,c))})},quickSetter:function(e,t,n){if(e=si(e),e.length>1){var r=e.map(function(u){return In.quickSetter(u,t,n)}),s=r.length;return function(u){for(var f=s;f--;)r[f](u)}}e=e[0]||{};var a=Vn[t],o=Xr(e),l=o.harness&&(o.harness.aliases||{})[t]||t,c=a?function(u){var f=new a;Is._pt=0,f.init(e,n?u+n:u,Is,0,[e]),f.render(1,f),Is._pt&&nd(1,Is)}:o.set(e,l);return a?c:function(u){return c(e,l,n?u+n:u,o,1)}},quickTo:function(e,t,n){var r,s=In.to(e,jn((r={},r[t]="+=0.1",r.paused=!0,r.stagger=0,r),n||{})),a=function(l,c,u){return s.resetTo(t,l,c,u)};return a.tween=s,a},isTweening:function(e){return Rt.getTweensOf(e,!0).length>0},defaults:function(e){return e&&e.ease&&(e.ease=Yr(e.ease,Zs.ease)),wh(Zs,e||{})},config:function(e){return wh(Yn,e||{})},registerEffect:function(e){var t=e.name,n=e.effect,r=e.plugins,s=e.defaults,a=e.extendTimeline;(r||"").split(",").forEach(function(o){return o&&!Vn[o]&&!$n[o]&&Ka(t+" effect requires "+o+" plugin.")}),Uc[t]=function(o,l,c){return n(si(o),jn(l||{},s),c)},a&&(Mn.prototype[t]=function(o,l,c){return this.add(Uc[t](o,Pi(l)?l:(c=l)&&{},this),c)})},registerEase:function(e,t){ut[e]=Yr(t)},parseEase:function(e,t){return arguments.length?Yr(e,t):ut},getById:function(e){return Rt.getById(e)},exportRoot:function(e,t){e===void 0&&(e={});var n=new Mn(e),r,s;for(n.smoothChildTiming=Rn(e.smoothChildTiming),Rt.remove(n),n._dp=0,n._time=n._tTime=Rt._time,r=Rt._first;r;)s=r._next,(t||!(!r._dur&&r instanceof Vt&&r.vars.onComplete===r._targets[0]))&&Ei(n,r,r._start-r._delay),r=s;return Ei(Rt,n,0),n},context:function(e,t){return e?new Vm(e,t):wt},matchMedia:function(e){return new _E(e)},matchMediaRefresh:function(){return $r.forEach(function(e){var t=e.conditions,n,r;for(r in t)t[r]&&(t[r]=!1,n=1);n&&e.revert()})||lf()},addEventListener:function(e,t){var n=ml[e]||(ml[e]=[]);~n.indexOf(t)||n.push(t)},removeEventListener:function(e,t){var n=ml[e],r=n&&n.indexOf(t);r>=0&&n.splice(r,1)},utils:{wrap:jM,wrapYoyo:ZM,distribute:Sm,random:Mm,snap:ym,normalize:$M,getUnit:un,clamp:WM,splitColor:Cm,toArray:si,selector:sf,mapRange:Tm,pipe:qM,unitize:YM,interpolate:KM,shuffle:xm},install:om,effects:Uc,ticker:Wn,updateRoot:Mn.updateRoot,plugins:Vn,globalTimeline:Rt,core:{PropTween:Ln,globals:lm,Tween:Vt,Timeline:Mn,Animation:to,getCache:Xr,_removeLinkedListItem:Yl,reverting:function(){return sn},context:function(e){return e&&wt&&(wt.data.push(e),e._ctx=wt),wt},suppressOverwrites:function(e){return Gf=e}}};Pn("to,from,fromTo,delayedCall,set,killTweensOf",function(i){return Fl[i]=Vt[i]});Wn.add(Mn.updateRoot);Is=Fl.to({},{duration:0});var vE=function(e,t){for(var n=e._pt;n&&n.p!==t&&n.op!==t&&n.fp!==t;)n=n._next;return n},xE=function(e,t){var n=e._targets,r,s,a;for(r in t)for(s=n.length;s--;)a=e._ptLookup[s][r],a&&(a=a.d)&&(a._pt&&(a=vE(a,r)),a&&a.modifier&&a.modifier(t[r],e,n[s],r))},Vc=function(e,t){return{name:e,headless:1,rawVars:1,init:function(r,s,a){a._onInit=function(o){var l,c;if(tn(s)&&(l={},Pn(s,function(u){return l[u]=1}),s=l),t){l={};for(c in s)l[c]=t(s[c]);s=l}xE(o,s)}}}},In=Fl.registerPlugin({name:"attr",init:function(e,t,n,r,s){var a,o,l;this.tween=n;for(a in t)l=e.getAttribute(a)||"",o=this.add(e,"setAttribute",(l||0)+"",t[a],r,s,0,0,a),o.op=a,o.b=l,this._props.push(a)},render:function(e,t){for(var n=t._pt;n;)sn?n.set(n.t,n.p,n.b,n):n.r(e,n.d),n=n._next}},{name:"endArray",headless:1,init:function(e,t){for(var n=t.length;n--;)this.add(e,n,e[n]||0,t[n],0,0,0,0,0,1)}},Vc("roundProps",af),Vc("modifiers"),Vc("snap",ym))||Fl;Vt.version=Mn.version=In.version="3.13.0";am=1;Xf()&&ea();ut.Power0;ut.Power1;ut.Power2;ut.Power3;ut.Power4;ut.Linear;ut.Quad;ut.Cubic;ut.Quart;ut.Quint;ut.Strong;ut.Elastic;ut.Back;ut.SteppedEase;ut.Bounce;ut.Sine;ut.Expo;ut.Circ;/*!
 * CSSPlugin 3.13.0
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var Oh,cr,zs,id,Gr,Uh,rd,SE=function(){return typeof window<"u"},Ji={},Or=180/Math.PI,ks=Math.PI/180,Cs=Math.atan2,Nh=1e8,sd=/([A-Z])/g,yE=/(left|right|width|margin|padding|x)/i,ME=/[\s,\(]\S/,bi={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},cf=function(e,t){return t.set(t.t,t.p,Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},EE=function(e,t){return t.set(t.t,t.p,e===1?t.e:Math.round((t.s+t.c*e)*1e4)/1e4+t.u,t)},TE=function(e,t){return t.set(t.t,t.p,e?Math.round((t.s+t.c*e)*1e4)/1e4+t.u:t.b,t)},bE=function(e,t){var n=t.s+t.c*e;t.set(t.t,t.p,~~(n+(n<0?-.5:.5))+t.u,t)},Hm=function(e,t){return t.set(t.t,t.p,e?t.e:t.b,t)},Gm=function(e,t){return t.set(t.t,t.p,e!==1?t.b:t.e,t)},DE=function(e,t,n){return e.style[t]=n},CE=function(e,t,n){return e.style.setProperty(t,n)},AE=function(e,t,n){return e._gsap[t]=n},wE=function(e,t,n){return e._gsap.scaleX=e._gsap.scaleY=n},RE=function(e,t,n,r,s){var a=e._gsap;a.scaleX=a.scaleY=n,a.renderTransform(s,a)},PE=function(e,t,n,r,s){var a=e._gsap;a[t]=n,a.renderTransform(s,a)},Lt="transform",Fn=Lt+"Origin",LE=function i(e,t){var n=this,r=this.target,s=r.style,a=r._gsap;if(e in Ji&&s){if(this.tfm=this.tfm||{},e!=="transform")e=bi[e]||e,~e.indexOf(",")?e.split(",").forEach(function(o){return n.tfm[o]=Hi(r,o)}):this.tfm[e]=a.x?a[e]:Hi(r,e),e===Fn&&(this.tfm.zOrigin=a.zOrigin);else return bi.transform.split(",").forEach(function(o){return i.call(n,o,t)});if(this.props.indexOf(Lt)>=0)return;a.svg&&(this.svgo=r.getAttribute("data-svg-origin"),this.props.push(Fn,t,"")),e=Lt}(s||t)&&this.props.push(e,t,s[e])},Wm=function(e){e.translate&&(e.removeProperty("translate"),e.removeProperty("scale"),e.removeProperty("rotate"))},FE=function(){var e=this.props,t=this.target,n=t.style,r=t._gsap,s,a;for(s=0;s<e.length;s+=3)e[s+1]?e[s+1]===2?t[e[s]](e[s+2]):t[e[s]]=e[s+2]:e[s+2]?n[e[s]]=e[s+2]:n.removeProperty(e[s].substr(0,2)==="--"?e[s]:e[s].replace(sd,"-$1").toLowerCase());if(this.tfm){for(a in this.tfm)r[a]=this.tfm[a];r.svg&&(r.renderTransform(),t.setAttribute("data-svg-origin",this.svgo||"")),s=rd(),(!s||!s.isStart)&&!n[Lt]&&(Wm(n),r.zOrigin&&n[Fn]&&(n[Fn]+=" "+r.zOrigin+"px",r.zOrigin=0,r.renderTransform()),r.uncache=1)}},Xm=function(e,t){var n={target:e,props:[],revert:FE,save:LE};return e._gsap||In.core.getCache(e),t&&e.style&&e.nodeType&&t.split(",").forEach(function(r){return n.save(r)}),n},qm,uf=function(e,t){var n=cr.createElementNS?cr.createElementNS((t||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),e):cr.createElement(e);return n&&n.style?n:cr.createElement(e)},ai=function i(e,t,n){var r=getComputedStyle(e);return r[t]||r.getPropertyValue(t.replace(sd,"-$1").toLowerCase())||r.getPropertyValue(t)||!n&&i(e,ta(t)||t,1)||""},Bh="O,Moz,ms,Ms,Webkit".split(","),ta=function(e,t,n){var r=t||Gr,s=r.style,a=5;if(e in s&&!n)return e;for(e=e.charAt(0).toUpperCase()+e.substr(1);a--&&!(Bh[a]+e in s););return a<0?null:(a===3?"ms":a>=0?Bh[a]:"")+e},ff=function(){SE()&&window.document&&(Oh=window,cr=Oh.document,zs=cr.documentElement,Gr=uf("div")||{style:{}},uf("div"),Lt=ta(Lt),Fn=Lt+"Origin",Gr.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",qm=!!ta("perspective"),rd=In.core.reverting,id=1)},zh=function(e){var t=e.ownerSVGElement,n=uf("svg",t&&t.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),r=e.cloneNode(!0),s;r.style.display="block",n.appendChild(r),zs.appendChild(n);try{s=r.getBBox()}catch{}return n.removeChild(r),zs.removeChild(n),s},kh=function(e,t){for(var n=t.length;n--;)if(e.hasAttribute(t[n]))return e.getAttribute(t[n])},Ym=function(e){var t,n;try{t=e.getBBox()}catch{t=zh(e),n=1}return t&&(t.width||t.height)||n||(t=zh(e)),t&&!t.width&&!t.x&&!t.y?{x:+kh(e,["x","cx","x1"])||0,y:+kh(e,["y","cy","y1"])||0,width:0,height:0}:t},$m=function(e){return!!(e.getCTM&&(!e.parentNode||e.ownerSVGElement)&&Ym(e))},is=function(e,t){if(t){var n=e.style,r;t in Ji&&t!==Fn&&(t=Lt),n.removeProperty?(r=t.substr(0,2),(r==="ms"||t.substr(0,6)==="webkit")&&(t="-"+t),n.removeProperty(r==="--"?t:t.replace(sd,"-$1").toLowerCase())):n.removeAttribute(t)}},ur=function(e,t,n,r,s,a){var o=new Ln(e._pt,t,n,0,1,a?Gm:Hm);return e._pt=o,o.b=r,o.e=s,e._props.push(n),o},Vh={deg:1,rad:1,turn:1},IE={grid:1,flex:1},Mr=function i(e,t,n,r){var s=parseFloat(n)||0,a=(n+"").trim().substr((s+"").length)||"px",o=Gr.style,l=yE.test(t),c=e.tagName.toLowerCase()==="svg",u=(c?"client":"offset")+(l?"Width":"Height"),f=100,h=r==="px",d=r==="%",g,_,m,p;if(r===a||!s||Vh[r]||Vh[a])return s;if(a!=="px"&&!h&&(s=i(e,t,n,"px")),p=e.getCTM&&$m(e),(d||a==="%")&&(Ji[t]||~t.indexOf("adius")))return g=p?e.getBBox()[l?"width":"height"]:e[u],Ut(d?s/g*f:s/100*g);if(o[l?"width":"height"]=f+(h?a:r),_=r!=="rem"&&~t.indexOf("adius")||r==="em"&&e.appendChild&&!c?e:e.parentNode,p&&(_=(e.ownerSVGElement||{}).parentNode),(!_||_===cr||!_.appendChild)&&(_=cr.body),m=_._gsap,m&&d&&m.width&&l&&m.time===Wn.time&&!m.uncache)return Ut(s/m.width*f);if(d&&(t==="height"||t==="width")){var S=e.style[t];e.style[t]=f+r,g=e[u],S?e.style[t]=S:is(e,t)}else(d||a==="%")&&!IE[ai(_,"display")]&&(o.position=ai(e,"position")),_===e&&(o.position="static"),_.appendChild(Gr),g=Gr[u],_.removeChild(Gr),o.position="absolute";return l&&d&&(m=Xr(_),m.time=Wn.time,m.width=_[u]),Ut(h?g*s/f:g&&s?f/g*s:0)},Hi=function(e,t,n,r){var s;return id||ff(),t in bi&&t!=="transform"&&(t=bi[t],~t.indexOf(",")&&(t=t.split(",")[0])),Ji[t]&&t!=="transform"?(s=io(e,r),s=t!=="transformOrigin"?s[t]:s.svg?s.origin:Ol(ai(e,Fn))+" "+s.zOrigin+"px"):(s=e.style[t],(!s||s==="auto"||r||~(s+"").indexOf("calc("))&&(s=Il[t]&&Il[t](e,t,n)||ai(e,t)||um(e,t)||(t==="opacity"?1:0))),n&&!~(s+"").trim().indexOf(" ")?Mr(e,t,s,n)+n:s},OE=function(e,t,n,r){if(!n||n==="none"){var s=ta(t,e,1),a=s&&ai(e,s,1);a&&a!==n?(t=s,n=a):t==="borderColor"&&(n=ai(e,"borderTopColor"))}var o=new Ln(this._pt,e.style,t,0,1,zm),l=0,c=0,u,f,h,d,g,_,m,p,S,v,x,C;if(o.b=n,o.e=r,n+="",r+="",r.substring(0,6)==="var(--"&&(r=ai(e,r.substring(4,r.indexOf(")")))),r==="auto"&&(_=e.style[t],e.style[t]=r,r=ai(e,t)||r,_?e.style[t]=_:is(e,t)),u=[n,r],wm(u),n=u[0],r=u[1],h=n.match(Fs)||[],C=r.match(Fs)||[],C.length){for(;f=Fs.exec(r);)m=f[0],S=r.substring(l,f.index),g?g=(g+1)%5:(S.substr(-5)==="rgba("||S.substr(-5)==="hsla(")&&(g=1),m!==(_=h[c++]||"")&&(d=parseFloat(_)||0,x=_.substr((d+"").length),m.charAt(1)==="="&&(m=Bs(d,m)+x),p=parseFloat(m),v=m.substr((p+"").length),l=Fs.lastIndex-v.length,v||(v=v||Yn.units[t]||x,l===r.length&&(r+=v,o.e+=v)),x!==v&&(d=Mr(e,t,_,v)||0),o._pt={_next:o._pt,p:S||c===1?S:",",s:d,c:p-d,m:g&&g<4||t==="zIndex"?Math.round:0});o.c=l<r.length?r.substring(l,r.length):""}else o.r=t==="display"&&r==="none"?Gm:Hm;return rm.test(r)&&(o.e=0),this._pt=o,o},Hh={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},UE=function(e){var t=e.split(" "),n=t[0],r=t[1]||"50%";return(n==="top"||n==="bottom"||r==="left"||r==="right")&&(e=n,n=r,r=e),t[0]=Hh[n]||n,t[1]=Hh[r]||r,t.join(" ")},NE=function(e,t){if(t.tween&&t.tween._time===t.tween._dur){var n=t.t,r=n.style,s=t.u,a=n._gsap,o,l,c;if(s==="all"||s===!0)r.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)o=s[c],Ji[o]&&(l=1,o=o==="transformOrigin"?Fn:Lt),is(n,o);l&&(is(n,Lt),a&&(a.svg&&n.removeAttribute("transform"),r.scale=r.rotate=r.translate="none",io(n,1),a.uncache=1,Wm(r)))}},Il={clearProps:function(e,t,n,r,s){if(s.data!=="isFromStart"){var a=e._pt=new Ln(e._pt,t,n,0,0,NE);return a.u=r,a.pr=-10,a.tween=s,e._props.push(n),1}}},no=[1,0,0,1,0,0],jm={},Zm=function(e){return e==="matrix(1, 0, 0, 1, 0, 0)"||e==="none"||!e},Gh=function(e){var t=ai(e,Lt);return Zm(t)?no:t.substr(7).match(im).map(Ut)},ad=function(e,t){var n=e._gsap||Xr(e),r=e.style,s=Gh(e),a,o,l,c;return n.svg&&e.getAttribute("transform")?(l=e.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?no:s):(s===no&&!e.offsetParent&&e!==zs&&!n.svg&&(l=r.display,r.display="block",a=e.parentNode,(!a||!e.offsetParent&&!e.getBoundingClientRect().width)&&(c=1,o=e.nextElementSibling,zs.appendChild(e)),s=Gh(e),l?r.display=l:is(e,"display"),c&&(o?a.insertBefore(e,o):a?a.appendChild(e):zs.removeChild(e))),t&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},df=function(e,t,n,r,s,a){var o=e._gsap,l=s||ad(e,!0),c=o.xOrigin||0,u=o.yOrigin||0,f=o.xOffset||0,h=o.yOffset||0,d=l[0],g=l[1],_=l[2],m=l[3],p=l[4],S=l[5],v=t.split(" "),x=parseFloat(v[0])||0,C=parseFloat(v[1])||0,D,T,E,M;n?l!==no&&(T=d*m-g*_)&&(E=x*(m/T)+C*(-_/T)+(_*S-m*p)/T,M=x*(-g/T)+C*(d/T)-(d*S-g*p)/T,x=E,C=M):(D=Ym(e),x=D.x+(~v[0].indexOf("%")?x/100*D.width:x),C=D.y+(~(v[1]||v[0]).indexOf("%")?C/100*D.height:C)),r||r!==!1&&o.smooth?(p=x-c,S=C-u,o.xOffset=f+(p*d+S*_)-p,o.yOffset=h+(p*g+S*m)-S):o.xOffset=o.yOffset=0,o.xOrigin=x,o.yOrigin=C,o.smooth=!!r,o.origin=t,o.originIsAbsolute=!!n,e.style[Fn]="0px 0px",a&&(ur(a,o,"xOrigin",c,x),ur(a,o,"yOrigin",u,C),ur(a,o,"xOffset",f,o.xOffset),ur(a,o,"yOffset",h,o.yOffset)),e.setAttribute("data-svg-origin",x+" "+C)},io=function(e,t){var n=e._gsap||new Fm(e);if("x"in n&&!t&&!n.uncache)return n;var r=e.style,s=n.scaleX<0,a="px",o="deg",l=getComputedStyle(e),c=ai(e,Fn)||"0",u,f,h,d,g,_,m,p,S,v,x,C,D,T,E,M,y,w,I,U,V,q,X,H,N,Q,L,ae,Ie,qe,Z,oe;return u=f=h=_=m=p=S=v=x=0,d=g=1,n.svg=!!(e.getCTM&&$m(e)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(r[Lt]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[Lt]!=="none"?l[Lt]:"")),r.scale=r.rotate=r.translate="none"),T=ad(e,n.svg),n.svg&&(n.uncache?(N=e.getBBox(),c=n.xOrigin-N.x+"px "+(n.yOrigin-N.y)+"px",H=""):H=!t&&e.getAttribute("data-svg-origin"),df(e,H||c,!!H||n.originIsAbsolute,n.smooth!==!1,T)),C=n.xOrigin||0,D=n.yOrigin||0,T!==no&&(w=T[0],I=T[1],U=T[2],V=T[3],u=q=T[4],f=X=T[5],T.length===6?(d=Math.sqrt(w*w+I*I),g=Math.sqrt(V*V+U*U),_=w||I?Cs(I,w)*Or:0,S=U||V?Cs(U,V)*Or+_:0,S&&(g*=Math.abs(Math.cos(S*ks))),n.svg&&(u-=C-(C*w+D*U),f-=D-(C*I+D*V))):(oe=T[6],qe=T[7],L=T[8],ae=T[9],Ie=T[10],Z=T[11],u=T[12],f=T[13],h=T[14],E=Cs(oe,Ie),m=E*Or,E&&(M=Math.cos(-E),y=Math.sin(-E),H=q*M+L*y,N=X*M+ae*y,Q=oe*M+Ie*y,L=q*-y+L*M,ae=X*-y+ae*M,Ie=oe*-y+Ie*M,Z=qe*-y+Z*M,q=H,X=N,oe=Q),E=Cs(-U,Ie),p=E*Or,E&&(M=Math.cos(-E),y=Math.sin(-E),H=w*M-L*y,N=I*M-ae*y,Q=U*M-Ie*y,Z=V*y+Z*M,w=H,I=N,U=Q),E=Cs(I,w),_=E*Or,E&&(M=Math.cos(E),y=Math.sin(E),H=w*M+I*y,N=q*M+X*y,I=I*M-w*y,X=X*M-q*y,w=H,q=N),m&&Math.abs(m)+Math.abs(_)>359.9&&(m=_=0,p=180-p),d=Ut(Math.sqrt(w*w+I*I+U*U)),g=Ut(Math.sqrt(X*X+oe*oe)),E=Cs(q,X),S=Math.abs(E)>2e-4?E*Or:0,x=Z?1/(Z<0?-Z:Z):0),n.svg&&(H=e.getAttribute("transform"),n.forceCSS=e.setAttribute("transform","")||!Zm(ai(e,Lt)),H&&e.setAttribute("transform",H))),Math.abs(S)>90&&Math.abs(S)<270&&(s?(d*=-1,S+=_<=0?180:-180,_+=_<=0?180:-180):(g*=-1,S+=S<=0?180:-180)),t=t||n.uncache,n.x=u-((n.xPercent=u&&(!t&&n.xPercent||(Math.round(e.offsetWidth/2)===Math.round(-u)?-50:0)))?e.offsetWidth*n.xPercent/100:0)+a,n.y=f-((n.yPercent=f&&(!t&&n.yPercent||(Math.round(e.offsetHeight/2)===Math.round(-f)?-50:0)))?e.offsetHeight*n.yPercent/100:0)+a,n.z=h+a,n.scaleX=Ut(d),n.scaleY=Ut(g),n.rotation=Ut(_)+o,n.rotationX=Ut(m)+o,n.rotationY=Ut(p)+o,n.skewX=S+o,n.skewY=v+o,n.transformPerspective=x+a,(n.zOrigin=parseFloat(c.split(" ")[2])||!t&&n.zOrigin||0)&&(r[Fn]=Ol(c)),n.xOffset=n.yOffset=0,n.force3D=Yn.force3D,n.renderTransform=n.svg?zE:qm?Km:BE,n.uncache=0,n},Ol=function(e){return(e=e.split(" "))[0]+" "+e[1]},Hc=function(e,t,n){var r=un(t);return Ut(parseFloat(t)+parseFloat(Mr(e,"x",n+"px",r)))+r},BE=function(e,t){t.z="0px",t.rotationY=t.rotationX="0deg",t.force3D=0,Km(e,t)},Lr="0deg",pa="0px",Fr=") ",Km=function(e,t){var n=t||this,r=n.xPercent,s=n.yPercent,a=n.x,o=n.y,l=n.z,c=n.rotation,u=n.rotationY,f=n.rotationX,h=n.skewX,d=n.skewY,g=n.scaleX,_=n.scaleY,m=n.transformPerspective,p=n.force3D,S=n.target,v=n.zOrigin,x="",C=p==="auto"&&e&&e!==1||p===!0;if(v&&(f!==Lr||u!==Lr)){var D=parseFloat(u)*ks,T=Math.sin(D),E=Math.cos(D),M;D=parseFloat(f)*ks,M=Math.cos(D),a=Hc(S,a,T*M*-v),o=Hc(S,o,-Math.sin(D)*-v),l=Hc(S,l,E*M*-v+v)}m!==pa&&(x+="perspective("+m+Fr),(r||s)&&(x+="translate("+r+"%, "+s+"%) "),(C||a!==pa||o!==pa||l!==pa)&&(x+=l!==pa||C?"translate3d("+a+", "+o+", "+l+") ":"translate("+a+", "+o+Fr),c!==Lr&&(x+="rotate("+c+Fr),u!==Lr&&(x+="rotateY("+u+Fr),f!==Lr&&(x+="rotateX("+f+Fr),(h!==Lr||d!==Lr)&&(x+="skew("+h+", "+d+Fr),(g!==1||_!==1)&&(x+="scale("+g+", "+_+Fr),S.style[Lt]=x||"translate(0, 0)"},zE=function(e,t){var n=t||this,r=n.xPercent,s=n.yPercent,a=n.x,o=n.y,l=n.rotation,c=n.skewX,u=n.skewY,f=n.scaleX,h=n.scaleY,d=n.target,g=n.xOrigin,_=n.yOrigin,m=n.xOffset,p=n.yOffset,S=n.forceCSS,v=parseFloat(a),x=parseFloat(o),C,D,T,E,M;l=parseFloat(l),c=parseFloat(c),u=parseFloat(u),u&&(u=parseFloat(u),c+=u,l+=u),l||c?(l*=ks,c*=ks,C=Math.cos(l)*f,D=Math.sin(l)*f,T=Math.sin(l-c)*-h,E=Math.cos(l-c)*h,c&&(u*=ks,M=Math.tan(c-u),M=Math.sqrt(1+M*M),T*=M,E*=M,u&&(M=Math.tan(u),M=Math.sqrt(1+M*M),C*=M,D*=M)),C=Ut(C),D=Ut(D),T=Ut(T),E=Ut(E)):(C=f,E=h,D=T=0),(v&&!~(a+"").indexOf("px")||x&&!~(o+"").indexOf("px"))&&(v=Mr(d,"x",a,"px"),x=Mr(d,"y",o,"px")),(g||_||m||p)&&(v=Ut(v+g-(g*C+_*T)+m),x=Ut(x+_-(g*D+_*E)+p)),(r||s)&&(M=d.getBBox(),v=Ut(v+r/100*M.width),x=Ut(x+s/100*M.height)),M="matrix("+C+","+D+","+T+","+E+","+v+","+x+")",d.setAttribute("transform",M),S&&(d.style[Lt]=M)},kE=function(e,t,n,r,s){var a=360,o=tn(s),l=parseFloat(s)*(o&&~s.indexOf("rad")?Or:1),c=l-r,u=r+c+"deg",f,h;return o&&(f=s.split("_")[1],f==="short"&&(c%=a,c!==c%(a/2)&&(c+=c<0?a:-a)),f==="cw"&&c<0?c=(c+a*Nh)%a-~~(c/a)*a:f==="ccw"&&c>0&&(c=(c-a*Nh)%a-~~(c/a)*a)),e._pt=h=new Ln(e._pt,t,n,r,c,EE),h.e=u,h.u="deg",e._props.push(n),h},Wh=function(e,t){for(var n in t)e[n]=t[n];return e},VE=function(e,t,n){var r=Wh({},n._gsap),s="perspective,force3D,transformOrigin,svgOrigin",a=n.style,o,l,c,u,f,h,d,g;r.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),a[Lt]=t,o=io(n,1),is(n,Lt),n.setAttribute("transform",c)):(c=getComputedStyle(n)[Lt],a[Lt]=t,o=io(n,1),a[Lt]=c);for(l in Ji)c=r[l],u=o[l],c!==u&&s.indexOf(l)<0&&(d=un(c),g=un(u),f=d!==g?Mr(n,l,c,g):parseFloat(c),h=parseFloat(u),e._pt=new Ln(e._pt,o,l,f,h-f,cf),e._pt.u=g||0,e._props.push(l));Wh(o,r)};Pn("padding,margin,Width,Radius",function(i,e){var t="Top",n="Right",r="Bottom",s="Left",a=(e<3?[t,n,r,s]:[t+s,t+n,r+n,r+s]).map(function(o){return e<2?i+o:"border"+o+i});Il[e>1?"border"+i:i]=function(o,l,c,u,f){var h,d;if(arguments.length<4)return h=a.map(function(g){return Hi(o,g,c)}),d=h.join(" "),d.split(h[0]).length===5?h[0]:d;h=(u+"").split(" "),d={},a.forEach(function(g,_){return d[g]=h[_]=h[_]||h[(_-1)/2|0]}),o.init(l,d,f)}});var Jm={name:"css",register:ff,targetTest:function(e){return e.style&&e.nodeType},init:function(e,t,n,r,s){var a=this._props,o=e.style,l=n.vars.startAt,c,u,f,h,d,g,_,m,p,S,v,x,C,D,T,E;id||ff(),this.styles=this.styles||Xm(e),E=this.styles.props,this.tween=n;for(_ in t)if(_!=="autoRound"&&(u=t[_],!(Vn[_]&&Im(_,t,n,r,e,s)))){if(d=typeof u,g=Il[_],d==="function"&&(u=u.call(n,r,e,s),d=typeof u),d==="string"&&~u.indexOf("random(")&&(u=Qa(u)),g)g(this,e,_,u,n)&&(T=1);else if(_.substr(0,2)==="--")c=(getComputedStyle(e).getPropertyValue(_)+"").trim(),u+="",_r.lastIndex=0,_r.test(c)||(m=un(c),p=un(u)),p?m!==p&&(c=Mr(e,_,c,p)+p):m&&(u+=m),this.add(o,"setProperty",c,u,r,s,0,0,_),a.push(_),E.push(_,0,o[_]);else if(d!=="undefined"){if(l&&_ in l?(c=typeof l[_]=="function"?l[_].call(n,r,e,s):l[_],tn(c)&&~c.indexOf("random(")&&(c=Qa(c)),un(c+"")||c==="auto"||(c+=Yn.units[_]||un(Hi(e,_))||""),(c+"").charAt(1)==="="&&(c=Hi(e,_))):c=Hi(e,_),h=parseFloat(c),S=d==="string"&&u.charAt(1)==="="&&u.substr(0,2),S&&(u=u.substr(2)),f=parseFloat(u),_ in bi&&(_==="autoAlpha"&&(h===1&&Hi(e,"visibility")==="hidden"&&f&&(h=0),E.push("visibility",0,o.visibility),ur(this,o,"visibility",h?"inherit":"hidden",f?"inherit":"hidden",!f)),_!=="scale"&&_!=="transform"&&(_=bi[_],~_.indexOf(",")&&(_=_.split(",")[0]))),v=_ in Ji,v){if(this.styles.save(_),d==="string"&&u.substring(0,6)==="var(--"&&(u=ai(e,u.substring(4,u.indexOf(")"))),f=parseFloat(u)),x||(C=e._gsap,C.renderTransform&&!t.parseTransform||io(e,t.parseTransform),D=t.smoothOrigin!==!1&&C.smooth,x=this._pt=new Ln(this._pt,o,Lt,0,1,C.renderTransform,C,0,-1),x.dep=1),_==="scale")this._pt=new Ln(this._pt,C,"scaleY",C.scaleY,(S?Bs(C.scaleY,S+f):f)-C.scaleY||0,cf),this._pt.u=0,a.push("scaleY",_),_+="X";else if(_==="transformOrigin"){E.push(Fn,0,o[Fn]),u=UE(u),C.svg?df(e,u,0,D,0,this):(p=parseFloat(u.split(" ")[2])||0,p!==C.zOrigin&&ur(this,C,"zOrigin",C.zOrigin,p),ur(this,o,_,Ol(c),Ol(u)));continue}else if(_==="svgOrigin"){df(e,u,1,D,0,this);continue}else if(_ in jm){kE(this,C,_,h,S?Bs(h,S+u):u);continue}else if(_==="smoothOrigin"){ur(this,C,"smooth",C.smooth,u);continue}else if(_==="force3D"){C[_]=u;continue}else if(_==="transform"){VE(this,u,e);continue}}else _ in o||(_=ta(_)||_);if(v||(f||f===0)&&(h||h===0)&&!ME.test(u)&&_ in o)m=(c+"").substr((h+"").length),f||(f=0),p=un(u)||(_ in Yn.units?Yn.units[_]:m),m!==p&&(h=Mr(e,_,c,p)),this._pt=new Ln(this._pt,v?C:o,_,h,(S?Bs(h,S+f):f)-h,!v&&(p==="px"||_==="zIndex")&&t.autoRound!==!1?bE:cf),this._pt.u=p||0,m!==p&&p!=="%"&&(this._pt.b=c,this._pt.r=TE);else if(_ in o)OE.call(this,e,_,c,S?S+u:u);else if(_ in e)this.add(e,_,c||e[_],S?S+u:u,r,s);else if(_!=="parseTransform"){Yf(_,u);continue}v||(_ in o?E.push(_,0,o[_]):typeof e[_]=="function"?E.push(_,2,e[_]()):E.push(_,1,c||e[_])),a.push(_)}}T&&km(this)},render:function(e,t){if(t.tween._time||!rd())for(var n=t._pt;n;)n.r(e,n.d),n=n._next;else t.styles.revert()},get:Hi,aliases:bi,getSetter:function(e,t,n){var r=bi[t];return r&&r.indexOf(",")<0&&(t=r),t in Ji&&t!==Fn&&(e._gsap.x||Hi(e,"x"))?n&&Uh===n?t==="scale"?wE:AE:(Uh=n||{})&&(t==="scale"?RE:PE):e.style&&!Wf(e.style[t])?DE:~t.indexOf("-")?CE:td(e,t)},core:{_removeProperty:is,_getMatrix:ad}};In.utils.checkPrefix=ta;In.core.getStyleSaver=Xm;(function(i,e,t,n){var r=Pn(i+","+e+","+t,function(s){Ji[s]=1});Pn(e,function(s){Yn.units[s]="deg",jm[s]=1}),bi[r[13]]=i+","+e,Pn(n,function(s){var a=s.split(":");bi[a[1]]=r[a[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");Pn("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(i){Yn.units[i]="px"});In.registerPlugin(Jm);var HE=In.registerPlugin(Jm)||In;HE.core.Tween;var GE=Object.defineProperty,WE=(i,e,t)=>e in i?GE(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,XE=(i,e,t)=>(WE(i,e+"",t),t);class qE{constructor(){XE(this,"_listeners")}addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}var YE=Object.defineProperty,$E=(i,e,t)=>e in i?YE(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,Xe=(i,e,t)=>($E(i,typeof e!="symbol"?e+"":e,t),t);const Wo=new Wl,Xh=new ar,jE=Math.cos(70*(Math.PI/180)),qh=(i,e)=>(i%e+e)%e;class sD extends qE{constructor(e,t){super(),Xe(this,"object"),Xe(this,"domElement"),Xe(this,"enabled",!0),Xe(this,"target",new z),Xe(this,"minDistance",0),Xe(this,"maxDistance",1/0),Xe(this,"minZoom",0),Xe(this,"maxZoom",1/0),Xe(this,"minPolarAngle",0),Xe(this,"maxPolarAngle",Math.PI),Xe(this,"minAzimuthAngle",-1/0),Xe(this,"maxAzimuthAngle",1/0),Xe(this,"enableDamping",!1),Xe(this,"dampingFactor",.05),Xe(this,"enableZoom",!0),Xe(this,"zoomSpeed",1),Xe(this,"enableRotate",!0),Xe(this,"rotateSpeed",1),Xe(this,"enablePan",!0),Xe(this,"panSpeed",1),Xe(this,"screenSpacePanning",!0),Xe(this,"keyPanSpeed",7),Xe(this,"zoomToCursor",!1),Xe(this,"autoRotate",!1),Xe(this,"autoRotateSpeed",2),Xe(this,"reverseOrbit",!1),Xe(this,"reverseHorizontalOrbit",!1),Xe(this,"reverseVerticalOrbit",!1),Xe(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),Xe(this,"mouseButtons",{LEFT:fs.ROTATE,MIDDLE:fs.DOLLY,RIGHT:fs.PAN}),Xe(this,"touches",{ONE:ds.ROTATE,TWO:ds.DOLLY_PAN}),Xe(this,"target0"),Xe(this,"position0"),Xe(this,"zoom0"),Xe(this,"_domElementKeyEvents",null),Xe(this,"getPolarAngle"),Xe(this,"getAzimuthalAngle"),Xe(this,"setPolarAngle"),Xe(this,"setAzimuthalAngle"),Xe(this,"getDistance"),Xe(this,"getZoomScale"),Xe(this,"listenToKeyEvents"),Xe(this,"stopListenToKeyEvents"),Xe(this,"saveState"),Xe(this,"reset"),Xe(this,"update"),Xe(this,"connect"),Xe(this,"dispose"),Xe(this,"dollyIn"),Xe(this,"dollyOut"),Xe(this,"getScale"),Xe(this,"setScale"),this.object=e,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>u.phi,this.getAzimuthalAngle=()=>u.theta,this.setPolarAngle=B=>{let ee=qh(B,2*Math.PI),ye=u.phi;ye<0&&(ye+=2*Math.PI),ee<0&&(ee+=2*Math.PI);let F=Math.abs(ee-ye);2*Math.PI-F<F&&(ee<ye?ee+=2*Math.PI:ye+=2*Math.PI),f.phi=ee-ye,n.update()},this.setAzimuthalAngle=B=>{let ee=qh(B,2*Math.PI),ye=u.theta;ye<0&&(ye+=2*Math.PI),ee<0&&(ee+=2*Math.PI);let F=Math.abs(ee-ye);2*Math.PI-F<F&&(ee<ye?ee+=2*Math.PI:ye+=2*Math.PI),f.theta=ee-ye,n.update()},this.getDistance=()=>n.object.position.distanceTo(n.target),this.listenToKeyEvents=B=>{B.addEventListener("keydown",he),this._domElementKeyEvents=B},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",he),this._domElementKeyEvents=null},this.saveState=()=>{n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=()=>{n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(r),n.update(),l=o.NONE},this.update=(()=>{const B=new z,ee=new z(0,1,0),ye=new ts().setFromUnitVectors(e.up,ee),F=ye.clone().invert(),ue=new z,$=new ts,te=2*Math.PI;return function(){const ve=n.object.position;ye.setFromUnitVectors(e.up,ee),F.copy(ye).invert(),B.copy(ve).sub(n.target),B.applyQuaternion(ye),u.setFromVector3(B),n.autoRotate&&l===o.NONE&&V(I()),n.enableDamping?(u.theta+=f.theta*n.dampingFactor,u.phi+=f.phi*n.dampingFactor):(u.theta+=f.theta,u.phi+=f.phi);let ke=n.minAzimuthAngle,Je=n.maxAzimuthAngle;isFinite(ke)&&isFinite(Je)&&(ke<-Math.PI?ke+=te:ke>Math.PI&&(ke-=te),Je<-Math.PI?Je+=te:Je>Math.PI&&(Je-=te),ke<=Je?u.theta=Math.max(ke,Math.min(Je,u.theta)):u.theta=u.theta>(ke+Je)/2?Math.max(ke,u.theta):Math.min(Je,u.theta)),u.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,u.phi)),u.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(d,n.dampingFactor):n.target.add(d),n.zoomToCursor&&M||n.object.isOrthographicCamera?u.radius=qe(u.radius):u.radius=qe(u.radius*h),B.setFromSpherical(u),B.applyQuaternion(F),ve.copy(n.target).add(B),n.object.matrixAutoUpdate||n.object.updateMatrix(),n.object.lookAt(n.target),n.enableDamping===!0?(f.theta*=1-n.dampingFactor,f.phi*=1-n.dampingFactor,d.multiplyScalar(1-n.dampingFactor)):(f.set(0,0,0),d.set(0,0,0));let _t=!1;if(n.zoomToCursor&&M){let Me=null;if(n.object instanceof yn&&n.object.isPerspectiveCamera){const Le=B.length();Me=qe(Le*h);const Ze=Le-Me;n.object.position.addScaledVector(T,Ze),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const Le=new z(E.x,E.y,0);Le.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),_t=!0;const Ze=new z(E.x,E.y,0);Ze.unproject(n.object),n.object.position.sub(Ze).add(Le),n.object.updateMatrixWorld(),Me=B.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Me!==null&&(n.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Me).add(n.object.position):(Wo.origin.copy(n.object.position),Wo.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Wo.direction))<jE?e.lookAt(n.target):(Xh.setFromNormalAndCoplanarPoint(n.object.up,n.target),Wo.intersectPlane(Xh,n.target))))}else n.object instanceof Pa&&n.object.isOrthographicCamera&&(_t=h!==1,_t&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix()));return h=1,M=!1,_t||ue.distanceToSquared(n.object.position)>c||8*(1-$.dot(n.object.quaternion))>c?(n.dispatchEvent(r),ue.copy(n.object.position),$.copy(n.object.quaternion),_t=!1,!0):!1}})(),this.connect=B=>{n.domElement=B,n.domElement.style.touchAction="none",n.domElement.addEventListener("contextmenu",le),n.domElement.addEventListener("pointerdown",b),n.domElement.addEventListener("pointercancel",J),n.domElement.addEventListener("wheel",me)},this.dispose=()=>{var B,ee,ye,F,ue,$;n.domElement&&(n.domElement.style.touchAction="auto"),(B=n.domElement)==null||B.removeEventListener("contextmenu",le),(ee=n.domElement)==null||ee.removeEventListener("pointerdown",b),(ye=n.domElement)==null||ye.removeEventListener("pointercancel",J),(F=n.domElement)==null||F.removeEventListener("wheel",me),(ue=n.domElement)==null||ue.ownerDocument.removeEventListener("pointermove",G),($=n.domElement)==null||$.ownerDocument.removeEventListener("pointerup",J),n._domElementKeyEvents!==null&&n._domElementKeyEvents.removeEventListener("keydown",he)};const n=this,r={type:"change"},s={type:"start"},a={type:"end"},o={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let l=o.NONE;const c=1e-6,u=new nh,f=new nh;let h=1;const d=new z,g=new ge,_=new ge,m=new ge,p=new ge,S=new ge,v=new ge,x=new ge,C=new ge,D=new ge,T=new z,E=new ge;let M=!1;const y=[],w={};function I(){return 2*Math.PI/60/60*n.autoRotateSpeed}function U(){return Math.pow(.95,n.zoomSpeed)}function V(B){n.reverseOrbit||n.reverseHorizontalOrbit?f.theta+=B:f.theta-=B}function q(B){n.reverseOrbit||n.reverseVerticalOrbit?f.phi+=B:f.phi-=B}const X=(()=>{const B=new z;return function(ye,F){B.setFromMatrixColumn(F,0),B.multiplyScalar(-ye),d.add(B)}})(),H=(()=>{const B=new z;return function(ye,F){n.screenSpacePanning===!0?B.setFromMatrixColumn(F,1):(B.setFromMatrixColumn(F,0),B.crossVectors(n.object.up,B)),B.multiplyScalar(ye),d.add(B)}})(),N=(()=>{const B=new z;return function(ye,F){const ue=n.domElement;if(ue&&n.object instanceof yn&&n.object.isPerspectiveCamera){const $=n.object.position;B.copy($).sub(n.target);let te=B.length();te*=Math.tan(n.object.fov/2*Math.PI/180),X(2*ye*te/ue.clientHeight,n.object.matrix),H(2*F*te/ue.clientHeight,n.object.matrix)}else ue&&n.object instanceof Pa&&n.object.isOrthographicCamera?(X(ye*(n.object.right-n.object.left)/n.object.zoom/ue.clientWidth,n.object.matrix),H(F*(n.object.top-n.object.bottom)/n.object.zoom/ue.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function Q(B){n.object instanceof yn&&n.object.isPerspectiveCamera||n.object instanceof Pa&&n.object.isOrthographicCamera?h=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function L(B){Q(h/B)}function ae(B){Q(h*B)}function Ie(B){if(!n.zoomToCursor||!n.domElement)return;M=!0;const ee=n.domElement.getBoundingClientRect(),ye=B.clientX-ee.left,F=B.clientY-ee.top,ue=ee.width,$=ee.height;E.x=ye/ue*2-1,E.y=-(F/$)*2+1,T.set(E.x,E.y,1).unproject(n.object).sub(n.object.position).normalize()}function qe(B){return Math.max(n.minDistance,Math.min(n.maxDistance,B))}function Z(B){g.set(B.clientX,B.clientY)}function oe(B){Ie(B),x.set(B.clientX,B.clientY)}function xe(B){p.set(B.clientX,B.clientY)}function fe(B){_.set(B.clientX,B.clientY),m.subVectors(_,g).multiplyScalar(n.rotateSpeed);const ee=n.domElement;ee&&(V(2*Math.PI*m.x/ee.clientHeight),q(2*Math.PI*m.y/ee.clientHeight)),g.copy(_),n.update()}function Ae(B){C.set(B.clientX,B.clientY),D.subVectors(C,x),D.y>0?L(U()):D.y<0&&ae(U()),x.copy(C),n.update()}function Ne(B){S.set(B.clientX,B.clientY),v.subVectors(S,p).multiplyScalar(n.panSpeed),N(v.x,v.y),p.copy(S),n.update()}function Oe(B){Ie(B),B.deltaY<0?ae(U()):B.deltaY>0&&L(U()),n.update()}function et(B){let ee=!1;switch(B.code){case n.keys.UP:N(0,n.keyPanSpeed),ee=!0;break;case n.keys.BOTTOM:N(0,-n.keyPanSpeed),ee=!0;break;case n.keys.LEFT:N(n.keyPanSpeed,0),ee=!0;break;case n.keys.RIGHT:N(-n.keyPanSpeed,0),ee=!0;break}ee&&(B.preventDefault(),n.update())}function Ye(){if(y.length==1)g.set(y[0].pageX,y[0].pageY);else{const B=.5*(y[0].pageX+y[1].pageX),ee=.5*(y[0].pageY+y[1].pageY);g.set(B,ee)}}function Se(){if(y.length==1)p.set(y[0].pageX,y[0].pageY);else{const B=.5*(y[0].pageX+y[1].pageX),ee=.5*(y[0].pageY+y[1].pageY);p.set(B,ee)}}function P(){const B=y[0].pageX-y[1].pageX,ee=y[0].pageY-y[1].pageY,ye=Math.sqrt(B*B+ee*ee);x.set(0,ye)}function de(){n.enableZoom&&P(),n.enablePan&&Se()}function re(){n.enableZoom&&P(),n.enableRotate&&Ye()}function O(B){if(y.length==1)_.set(B.pageX,B.pageY);else{const ye=De(B),F=.5*(B.pageX+ye.x),ue=.5*(B.pageY+ye.y);_.set(F,ue)}m.subVectors(_,g).multiplyScalar(n.rotateSpeed);const ee=n.domElement;ee&&(V(2*Math.PI*m.x/ee.clientHeight),q(2*Math.PI*m.y/ee.clientHeight)),g.copy(_)}function ne(B){if(y.length==1)S.set(B.pageX,B.pageY);else{const ee=De(B),ye=.5*(B.pageX+ee.x),F=.5*(B.pageY+ee.y);S.set(ye,F)}v.subVectors(S,p).multiplyScalar(n.panSpeed),N(v.x,v.y),p.copy(S)}function Ce(B){const ee=De(B),ye=B.pageX-ee.x,F=B.pageY-ee.y,ue=Math.sqrt(ye*ye+F*F);C.set(0,ue),D.set(0,Math.pow(C.y/x.y,n.zoomSpeed)),L(D.y),x.copy(C)}function se(B){n.enableZoom&&Ce(B),n.enablePan&&ne(B)}function R(B){n.enableZoom&&Ce(B),n.enableRotate&&O(B)}function b(B){var ee,ye;n.enabled!==!1&&(y.length===0&&((ee=n.domElement)==null||ee.ownerDocument.addEventListener("pointermove",G),(ye=n.domElement)==null||ye.ownerDocument.addEventListener("pointerup",J)),pe(B),B.pointerType==="touch"?Pe(B):ie(B))}function G(B){n.enabled!==!1&&(B.pointerType==="touch"?Ue(B):K(B))}function J(B){var ee,ye,F;Ve(B),y.length===0&&((ee=n.domElement)==null||ee.releasePointerCapture(B.pointerId),(ye=n.domElement)==null||ye.ownerDocument.removeEventListener("pointermove",G),(F=n.domElement)==null||F.ownerDocument.removeEventListener("pointerup",J)),n.dispatchEvent(a),l=o.NONE}function ie(B){let ee;switch(B.button){case 0:ee=n.mouseButtons.LEFT;break;case 1:ee=n.mouseButtons.MIDDLE;break;case 2:ee=n.mouseButtons.RIGHT;break;default:ee=-1}switch(ee){case fs.DOLLY:if(n.enableZoom===!1)return;oe(B),l=o.DOLLY;break;case fs.ROTATE:if(B.ctrlKey||B.metaKey||B.shiftKey){if(n.enablePan===!1)return;xe(B),l=o.PAN}else{if(n.enableRotate===!1)return;Z(B),l=o.ROTATE}break;case fs.PAN:if(B.ctrlKey||B.metaKey||B.shiftKey){if(n.enableRotate===!1)return;Z(B),l=o.ROTATE}else{if(n.enablePan===!1)return;xe(B),l=o.PAN}break;default:l=o.NONE}l!==o.NONE&&n.dispatchEvent(s)}function K(B){if(n.enabled!==!1)switch(l){case o.ROTATE:if(n.enableRotate===!1)return;fe(B);break;case o.DOLLY:if(n.enableZoom===!1)return;Ae(B);break;case o.PAN:if(n.enablePan===!1)return;Ne(B);break}}function me(B){n.enabled===!1||n.enableZoom===!1||l!==o.NONE&&l!==o.ROTATE||(B.preventDefault(),n.dispatchEvent(s),Oe(B),n.dispatchEvent(a))}function he(B){n.enabled===!1||n.enablePan===!1||et(B)}function Pe(B){switch(ze(B),y.length){case 1:switch(n.touches.ONE){case ds.ROTATE:if(n.enableRotate===!1)return;Ye(),l=o.TOUCH_ROTATE;break;case ds.PAN:if(n.enablePan===!1)return;Se(),l=o.TOUCH_PAN;break;default:l=o.NONE}break;case 2:switch(n.touches.TWO){case ds.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;de(),l=o.TOUCH_DOLLY_PAN;break;case ds.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;re(),l=o.TOUCH_DOLLY_ROTATE;break;default:l=o.NONE}break;default:l=o.NONE}l!==o.NONE&&n.dispatchEvent(s)}function Ue(B){switch(ze(B),l){case o.TOUCH_ROTATE:if(n.enableRotate===!1)return;O(B),n.update();break;case o.TOUCH_PAN:if(n.enablePan===!1)return;ne(B),n.update();break;case o.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;se(B),n.update();break;case o.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;R(B),n.update();break;default:l=o.NONE}}function le(B){n.enabled!==!1&&B.preventDefault()}function pe(B){y.push(B)}function Ve(B){delete w[B.pointerId];for(let ee=0;ee<y.length;ee++)if(y[ee].pointerId==B.pointerId){y.splice(ee,1);return}}function ze(B){let ee=w[B.pointerId];ee===void 0&&(ee=new ge,w[B.pointerId]=ee),ee.set(B.pageX,B.pageY)}function De(B){const ee=B.pointerId===y[0].pointerId?y[1]:y[0];return w[ee.pointerId]}this.dollyIn=(B=U())=>{ae(B),n.update()},this.dollyOut=(B=U())=>{L(B),n.update()},this.getScale=()=>h,this.setScale=B=>{Q(B),n.update()},this.getZoomScale=()=>U(),t!==void 0&&this.connect(t),this.update()}}class aD extends zf{constructor(e,t={}){const{bevelEnabled:n=!1,bevelSize:r=8,bevelThickness:s=10,font:a,height:o=50,size:l=100,lineHeight:c=1,letterSpacing:u=0,...f}=t;if(a===void 0)super();else{const h=a.generateShapes(e,l,{lineHeight:c,letterSpacing:u});super(h,{...f,bevelEnabled:n,bevelSize:r,bevelThickness:s,depth:o})}this.type="TextGeometry"}}var ZE=Object.defineProperty,KE=(i,e,t)=>e in i?ZE(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,Gc=(i,e,t)=>(KE(i,typeof e!="symbol"?e+"":e,t),t);class oD extends kf{constructor(e){super(e)}load(e,t,n,r){const s=new V0(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,a=>{if(typeof a!="string")throw new Error("unsupported data type");const o=JSON.parse(a),l=this.parse(o);t&&t(l)},n,r)}loadAsync(e,t){return super.loadAsync(e,t)}parse(e){return new JE(e)}}class JE{constructor(e){Gc(this,"data"),Gc(this,"isFont",!0),Gc(this,"type","Font"),this.data=e}generateShapes(e,t=100,n){const r=[],s={letterSpacing:0,lineHeight:1,...n},a=QE(e,t,this.data,s);for(let o=0,l=a.length;o<l;o++)Array.prototype.push.apply(r,a[o].toShapes(!1));return r}}function QE(i,e,t,n){const r=Array.from(i),s=e/t.resolution,a=(t.boundingBox.yMax-t.boundingBox.yMin+t.underlineThickness)*s,o=[];let l=0,c=0;for(let u=0;u<r.length;u++){const f=r[u];if(f===`
`)l=0,c-=a*n.lineHeight;else{const h=eT(f,s,l,c,t);h&&(l+=h.offsetX+n.letterSpacing,o.push(h.path))}}return o}function eT(i,e,t,n,r){const s=r.glyphs[i]||r.glyphs["?"];if(!s){console.error('THREE.Font: character "'+i+'" does not exists in font family '+r.familyName+".");return}const a=new X0;let o,l,c,u,f,h,d,g;if(s.o){const _=s._cachedOutline||(s._cachedOutline=s.o.split(" "));for(let m=0,p=_.length;m<p;)switch(_[m++]){case"m":o=parseInt(_[m++])*e+t,l=parseInt(_[m++])*e+n,a.moveTo(o,l);break;case"l":o=parseInt(_[m++])*e+t,l=parseInt(_[m++])*e+n,a.lineTo(o,l);break;case"q":c=parseInt(_[m++])*e+t,u=parseInt(_[m++])*e+n,f=parseInt(_[m++])*e+t,h=parseInt(_[m++])*e+n,a.quadraticCurveTo(f,h,c,u);break;case"b":c=parseInt(_[m++])*e+t,u=parseInt(_[m++])*e+n,f=parseInt(_[m++])*e+t,h=parseInt(_[m++])*e+n,d=parseInt(_[m++])*e+t,g=parseInt(_[m++])*e+n,a.bezierCurveTo(f,h,d,g,c,u);break}}return{offsetX:s.ha*e,path:a}}function Yh(i){return i!==null&&typeof i=="object"&&"constructor"in i&&i.constructor===Object}function od(i={},e={}){const t=["__proto__","constructor","prototype"];Object.keys(e).filter(n=>t.indexOf(n)<0).forEach(n=>{typeof i[n]>"u"?i[n]=e[n]:Yh(e[n])&&Yh(i[n])&&Object.keys(e[n]).length>0&&od(i[n],e[n])})}const Qm={body:{},addEventListener(){},removeEventListener(){},activeElement:{blur(){},nodeName:""},querySelector(){return null},querySelectorAll(){return[]},getElementById(){return null},createEvent(){return{initEvent(){}}},createElement(){return{children:[],childNodes:[],style:{},setAttribute(){},getElementsByTagName(){return[]}}},createElementNS(){return{}},importNode(){return null},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""}};function xi(){const i=typeof document<"u"?document:{};return od(i,Qm),i}const tT={document:Qm,navigator:{userAgent:""},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""},history:{replaceState(){},pushState(){},go(){},back(){}},CustomEvent:function(){return this},addEventListener(){},removeEventListener(){},getComputedStyle(){return{getPropertyValue(){return""}}},Image(){},Date(){},screen:{},setTimeout(){},clearTimeout(){},matchMedia(){return{}},requestAnimationFrame(i){return typeof setTimeout>"u"?(i(),null):setTimeout(i,0)},cancelAnimationFrame(i){typeof setTimeout>"u"||clearTimeout(i)}};function Tn(){const i=typeof window<"u"?window:{};return od(i,tT),i}function nT(i=""){return i.trim().split(" ").filter(e=>!!e.trim())}function iT(i){const e=i;Object.keys(e).forEach(t=>{try{e[t]=null}catch{}try{delete e[t]}catch{}})}function eg(i,e=0){return setTimeout(i,e)}function jr(){return Date.now()}function rT(i){const e=Tn();let t;return e.getComputedStyle&&(t=e.getComputedStyle(i,null)),!t&&i.currentStyle&&(t=i.currentStyle),t||(t=i.style),t}function sT(i,e="x"){const t=Tn();let n,r,s;const a=rT(i);return t.WebKitCSSMatrix?(r=a.transform||a.webkitTransform,r.split(",").length>6&&(r=r.split(", ").map(o=>o.replace(",",".")).join(", ")),s=new t.WebKitCSSMatrix(r==="none"?"":r)):(s=a.MozTransform||a.OTransform||a.MsTransform||a.msTransform||a.transform||a.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),n=s.toString().split(",")),e==="x"&&(t.WebKitCSSMatrix?r=s.m41:n.length===16?r=parseFloat(n[12]):r=parseFloat(n[4])),e==="y"&&(t.WebKitCSSMatrix?r=s.m42:n.length===16?r=parseFloat(n[13]):r=parseFloat(n[5])),r||0}function Ma(i){return typeof i=="object"&&i!==null&&i.constructor&&Object.prototype.toString.call(i).slice(8,-1)==="Object"}function aT(i){return typeof window<"u"&&typeof window.HTMLElement<"u"?i instanceof HTMLElement:i&&(i.nodeType===1||i.nodeType===11)}function Hn(...i){const e=Object(i[0]),t=["__proto__","constructor","prototype"];for(let n=1;n<i.length;n+=1){const r=i[n];if(r!=null&&!aT(r)){const s=Object.keys(Object(r)).filter(a=>t.indexOf(a)<0);for(let a=0,o=s.length;a<o;a+=1){const l=s[a],c=Object.getOwnPropertyDescriptor(r,l);c!==void 0&&c.enumerable&&(Ma(e[l])&&Ma(r[l])?r[l].__swiper__?e[l]=r[l]:Hn(e[l],r[l]):!Ma(e[l])&&Ma(r[l])?(e[l]={},r[l].__swiper__?e[l]=r[l]:Hn(e[l],r[l])):e[l]=r[l])}}}return e}function Xo(i,e,t){i.style.setProperty(e,t)}function tg({swiper:i,targetPosition:e,side:t}){const n=Tn(),r=-i.translate;let s=null,a;const o=i.params.speed;i.wrapperEl.style.scrollSnapType="none",n.cancelAnimationFrame(i.cssModeFrameID);const l=e>r?"next":"prev",c=(f,h)=>l==="next"&&f>=h||l==="prev"&&f<=h,u=()=>{a=new Date().getTime(),s===null&&(s=a);const f=Math.max(Math.min((a-s)/o,1),0),h=.5-Math.cos(f*Math.PI)/2;let d=r+h*(e-r);if(c(d,e)&&(d=e),i.wrapperEl.scrollTo({[t]:d}),c(d,e)){i.wrapperEl.style.overflow="hidden",i.wrapperEl.style.scrollSnapType="",setTimeout(()=>{i.wrapperEl.style.overflow="",i.wrapperEl.scrollTo({[t]:d})}),n.cancelAnimationFrame(i.cssModeFrameID);return}i.cssModeFrameID=n.requestAnimationFrame(u)};u()}function ld(i){return i.querySelector(".swiper-slide-transform")||i.shadowRoot&&i.shadowRoot.querySelector(".swiper-slide-transform")||i}function gi(i,e=""){const t=Tn(),n=[...i.children];return t.HTMLSlotElement&&i instanceof HTMLSlotElement&&n.push(...i.assignedElements()),e?n.filter(r=>r.matches(e)):n}function oT(i,e){const t=[e];for(;t.length>0;){const n=t.shift();if(i===n)return!0;t.push(...n.children,...n.shadowRoot?n.shadowRoot.children:[],...n.assignedElements?n.assignedElements():[])}}function lT(i,e){const t=Tn();let n=e.contains(i);return!n&&t.HTMLSlotElement&&e instanceof HTMLSlotElement&&(n=[...e.assignedElements()].includes(i),n||(n=oT(i,e))),n}function Ul(i){try{console.warn(i);return}catch{}}function ro(i,e=[]){const t=document.createElement(i);return t.classList.add(...Array.isArray(e)?e:nT(e)),t}function cT(i,e){const t=[];for(;i.previousElementSibling;){const n=i.previousElementSibling;e?n.matches(e)&&t.push(n):t.push(n),i=n}return t}function uT(i,e){const t=[];for(;i.nextElementSibling;){const n=i.nextElementSibling;e?n.matches(e)&&t.push(n):t.push(n),i=n}return t}function fr(i,e){return Tn().getComputedStyle(i,null).getPropertyValue(e)}function Nl(i){let e=i,t;if(e){for(t=0;(e=e.previousSibling)!==null;)e.nodeType===1&&(t+=1);return t}}function ng(i,e){const t=[];let n=i.parentElement;for(;n;)e?n.matches(e)&&t.push(n):t.push(n),n=n.parentElement;return t}function Wc(i,e){function t(n){n.target===i&&(e.call(i,n),i.removeEventListener("transitionend",t))}e&&i.addEventListener("transitionend",t)}function hf(i,e,t){const n=Tn();return i[e==="width"?"offsetWidth":"offsetHeight"]+parseFloat(n.getComputedStyle(i,null).getPropertyValue(e==="width"?"margin-right":"margin-top"))+parseFloat(n.getComputedStyle(i,null).getPropertyValue(e==="width"?"margin-left":"margin-bottom"))}function Qt(i){return(Array.isArray(i)?i:[i]).filter(e=>!!e)}function fT(i){return e=>Math.abs(e)>0&&i.browser&&i.browser.need3dFix&&Math.abs(e)%90===0?e+.001:e}function so(i,e=""){typeof trustedTypes<"u"?i.innerHTML=trustedTypes.createPolicy("html",{createHTML:t=>t}).createHTML(e):i.innerHTML=e}let Xc;function dT(){const i=Tn(),e=xi();return{smoothScroll:e.documentElement&&e.documentElement.style&&"scrollBehavior"in e.documentElement.style,touch:!!("ontouchstart"in i||i.DocumentTouch&&e instanceof i.DocumentTouch)}}function ig(){return Xc||(Xc=dT()),Xc}let qc;function hT({userAgent:i}={}){const e=ig(),t=Tn(),n=t.navigator.platform,r=i||t.navigator.userAgent,s={ios:!1,android:!1},a=t.screen.width,o=t.screen.height,l=r.match(/(Android);?[\s\/]+([\d.]+)?/);let c=r.match(/(iPad)(?!\1).*OS\s([\d_]+)/);const u=r.match(/(iPod)(.*OS\s([\d_]+))?/),f=!c&&r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),h=n==="Win32";let d=n==="MacIntel";const g=["1024x1366","1366x1024","834x1194","1194x834","834x1112","1112x834","768x1024","1024x768","820x1180","1180x820","810x1080","1080x810"];return!c&&d&&e.touch&&g.indexOf(`${a}x${o}`)>=0&&(c=r.match(/(Version)\/([\d.]+)/),c||(c=[0,1,"13_0_0"]),d=!1),l&&!h&&(s.os="android",s.android=!0),(c||f||u)&&(s.os="ios",s.ios=!0),s}function rg(i={}){return qc||(qc=hT(i)),qc}let Yc;function pT(){const i=Tn(),e=rg();let t=!1;function n(){const o=i.navigator.userAgent.toLowerCase();return o.indexOf("safari")>=0&&o.indexOf("chrome")<0&&o.indexOf("android")<0}if(n()){const o=String(i.navigator.userAgent);if(o.includes("Version/")){const[l,c]=o.split("Version/")[1].split(" ")[0].split(".").map(u=>Number(u));t=l<16||l===16&&c<2}}const r=/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(i.navigator.userAgent),s=n(),a=s||r&&e.ios;return{isSafari:t||s,needPerspectiveFix:t,need3dFix:a,isWebView:r}}function sg(){return Yc||(Yc=pT()),Yc}function mT({swiper:i,on:e,emit:t}){const n=Tn();let r=null,s=null;const a=()=>{!i||i.destroyed||!i.initialized||(t("beforeResize"),t("resize"))},o=()=>{!i||i.destroyed||!i.initialized||(r=new ResizeObserver(u=>{s=n.requestAnimationFrame(()=>{const{width:f,height:h}=i;let d=f,g=h;u.forEach(({contentBoxSize:_,contentRect:m,target:p})=>{p&&p!==i.el||(d=m?m.width:(_[0]||_).inlineSize,g=m?m.height:(_[0]||_).blockSize)}),(d!==f||g!==h)&&a()})}),r.observe(i.el))},l=()=>{s&&n.cancelAnimationFrame(s),r&&r.unobserve&&i.el&&(r.unobserve(i.el),r=null)},c=()=>{!i||i.destroyed||!i.initialized||t("orientationchange")};e("init",()=>{if(i.params.resizeObserver&&typeof n.ResizeObserver<"u"){o();return}n.addEventListener("resize",a),n.addEventListener("orientationchange",c)}),e("destroy",()=>{l(),n.removeEventListener("resize",a),n.removeEventListener("orientationchange",c)})}function gT({swiper:i,extendParams:e,on:t,emit:n}){const r=[],s=Tn(),a=(c,u={})=>{const f=s.MutationObserver||s.WebkitMutationObserver,h=new f(d=>{if(i.__preventObserver__)return;if(d.length===1){n("observerUpdate",d[0]);return}const g=function(){n("observerUpdate",d[0])};s.requestAnimationFrame?s.requestAnimationFrame(g):s.setTimeout(g,0)});h.observe(c,{attributes:typeof u.attributes>"u"?!0:u.attributes,childList:i.isElement||(typeof u.childList>"u"?!0:u).childList,characterData:typeof u.characterData>"u"?!0:u.characterData}),r.push(h)},o=()=>{if(i.params.observer){if(i.params.observeParents){const c=ng(i.hostEl);for(let u=0;u<c.length;u+=1)a(c[u])}a(i.hostEl,{childList:i.params.observeSlideChildren}),a(i.wrapperEl,{attributes:!1})}},l=()=>{r.forEach(c=>{c.disconnect()}),r.splice(0,r.length)};e({observer:!1,observeParents:!1,observeSlideChildren:!1}),t("init",o),t("destroy",l)}var _T={on(i,e,t){const n=this;if(!n.eventsListeners||n.destroyed||typeof e!="function")return n;const r=t?"unshift":"push";return i.split(" ").forEach(s=>{n.eventsListeners[s]||(n.eventsListeners[s]=[]),n.eventsListeners[s][r](e)}),n},once(i,e,t){const n=this;if(!n.eventsListeners||n.destroyed||typeof e!="function")return n;function r(...s){n.off(i,r),r.__emitterProxy&&delete r.__emitterProxy,e.apply(n,s)}return r.__emitterProxy=e,n.on(i,r,t)},onAny(i,e){const t=this;if(!t.eventsListeners||t.destroyed||typeof i!="function")return t;const n=e?"unshift":"push";return t.eventsAnyListeners.indexOf(i)<0&&t.eventsAnyListeners[n](i),t},offAny(i){const e=this;if(!e.eventsListeners||e.destroyed||!e.eventsAnyListeners)return e;const t=e.eventsAnyListeners.indexOf(i);return t>=0&&e.eventsAnyListeners.splice(t,1),e},off(i,e){const t=this;return!t.eventsListeners||t.destroyed||!t.eventsListeners||i.split(" ").forEach(n=>{typeof e>"u"?t.eventsListeners[n]=[]:t.eventsListeners[n]&&t.eventsListeners[n].forEach((r,s)=>{(r===e||r.__emitterProxy&&r.__emitterProxy===e)&&t.eventsListeners[n].splice(s,1)})}),t},emit(...i){const e=this;if(!e.eventsListeners||e.destroyed||!e.eventsListeners)return e;let t,n,r;return typeof i[0]=="string"||Array.isArray(i[0])?(t=i[0],n=i.slice(1,i.length),r=e):(t=i[0].events,n=i[0].data,r=i[0].context||e),n.unshift(r),(Array.isArray(t)?t:t.split(" ")).forEach(a=>{e.eventsAnyListeners&&e.eventsAnyListeners.length&&e.eventsAnyListeners.forEach(o=>{o.apply(r,[a,...n])}),e.eventsListeners&&e.eventsListeners[a]&&e.eventsListeners[a].forEach(o=>{o.apply(r,n)})}),e}};function vT(){const i=this;let e,t;const n=i.el;typeof i.params.width<"u"&&i.params.width!==null?e=i.params.width:e=n.clientWidth,typeof i.params.height<"u"&&i.params.height!==null?t=i.params.height:t=n.clientHeight,!(e===0&&i.isHorizontal()||t===0&&i.isVertical())&&(e=e-parseInt(fr(n,"padding-left")||0,10)-parseInt(fr(n,"padding-right")||0,10),t=t-parseInt(fr(n,"padding-top")||0,10)-parseInt(fr(n,"padding-bottom")||0,10),Number.isNaN(e)&&(e=0),Number.isNaN(t)&&(t=0),Object.assign(i,{width:e,height:t,size:i.isHorizontal()?e:t}))}function xT(){const i=this;function e(y,w){return parseFloat(y.getPropertyValue(i.getDirectionLabel(w))||0)}const t=i.params,{wrapperEl:n,slidesEl:r,rtlTranslate:s,wrongRTL:a}=i,o=i.virtual&&t.virtual.enabled,l=o?i.virtual.slides.length:i.slides.length,c=gi(r,`.${i.params.slideClass}, swiper-slide`),u=o?i.virtual.slides.length:c.length;let f=[];const h=[],d=[];let g=t.slidesOffsetBefore;typeof g=="function"&&(g=t.slidesOffsetBefore.call(i));let _=t.slidesOffsetAfter;typeof _=="function"&&(_=t.slidesOffsetAfter.call(i));const m=i.snapGrid.length,p=i.slidesGrid.length,S=i.size-g-_;let v=t.spaceBetween,x=-g,C=0,D=0;if(typeof S>"u")return;typeof v=="string"&&v.indexOf("%")>=0?v=parseFloat(v.replace("%",""))/100*S:typeof v=="string"&&(v=parseFloat(v)),i.virtualSize=-v-g-_,c.forEach(y=>{s?y.style.marginLeft="":y.style.marginRight="",y.style.marginBottom="",y.style.marginTop=""}),t.centeredSlides&&t.cssMode&&(Xo(n,"--swiper-centered-offset-before",""),Xo(n,"--swiper-centered-offset-after",""));const T=t.grid&&t.grid.rows>1&&i.grid;T?i.grid.initSlides(c):i.grid&&i.grid.unsetSlides();let E;const M=t.slidesPerView==="auto"&&t.breakpoints&&Object.keys(t.breakpoints).filter(y=>typeof t.breakpoints[y].slidesPerView<"u").length>0;for(let y=0;y<u;y+=1){E=0;const w=c[y];if(!(w&&(T&&i.grid.updateSlide(y,w,c),fr(w,"display")==="none"))){if(o&&t.slidesPerView==="auto")t.virtual.slidesPerViewAutoSlideSize&&(E=t.virtual.slidesPerViewAutoSlideSize),E&&w&&(t.roundLengths&&(E=Math.floor(E)),w.style[i.getDirectionLabel("width")]=`${E}px`);else if(t.slidesPerView==="auto"){M&&(w.style[i.getDirectionLabel("width")]="");const I=getComputedStyle(w),U=w.style.transform,V=w.style.webkitTransform;if(U&&(w.style.transform="none"),V&&(w.style.webkitTransform="none"),t.roundLengths)E=i.isHorizontal()?hf(w,"width"):hf(w,"height");else{const q=e(I,"width"),X=e(I,"padding-left"),H=e(I,"padding-right"),N=e(I,"margin-left"),Q=e(I,"margin-right"),L=I.getPropertyValue("box-sizing");if(L&&L==="border-box")E=q+N+Q;else{const{clientWidth:ae,offsetWidth:Ie}=w;E=q+X+H+N+Q+(Ie-ae)}}U&&(w.style.transform=U),V&&(w.style.webkitTransform=V),t.roundLengths&&(E=Math.floor(E))}else E=(S-(t.slidesPerView-1)*v)/t.slidesPerView,t.roundLengths&&(E=Math.floor(E)),w&&(w.style[i.getDirectionLabel("width")]=`${E}px`);w&&(w.swiperSlideSize=E),d.push(E),t.centeredSlides?(x=x+E/2+C/2+v,C===0&&y!==0&&(x=x-S/2-v),y===0&&(x=x-S/2-v),Math.abs(x)<1/1e3&&(x=0),t.roundLengths&&(x=Math.floor(x)),D%t.slidesPerGroup===0&&f.push(x),h.push(x)):(t.roundLengths&&(x=Math.floor(x)),(D-Math.min(i.params.slidesPerGroupSkip,D))%i.params.slidesPerGroup===0&&f.push(x),h.push(x),x=x+E+v),i.virtualSize+=E+v,C=E,D+=1}}if(i.virtualSize=Math.max(i.virtualSize,S)+_,s&&a&&(t.effect==="slide"||t.effect==="coverflow")&&(n.style.width=`${i.virtualSize+v}px`),t.setWrapperSize&&(n.style[i.getDirectionLabel("width")]=`${i.virtualSize+v}px`),T&&i.grid.updateWrapperSize(E,f),!t.centeredSlides){const y=[];for(let w=0;w<f.length;w+=1){let I=f[w];t.roundLengths&&(I=Math.floor(I)),f[w]<=i.virtualSize-S&&y.push(I)}f=y,Math.floor(i.virtualSize-S)-Math.floor(f[f.length-1])>1&&f.push(i.virtualSize-S)}if(o&&t.loop){const y=d[0]+v;if(t.slidesPerGroup>1){const w=Math.ceil((i.virtual.slidesBefore+i.virtual.slidesAfter)/t.slidesPerGroup),I=y*t.slidesPerGroup;for(let U=0;U<w;U+=1)f.push(f[f.length-1]+I)}for(let w=0;w<i.virtual.slidesBefore+i.virtual.slidesAfter;w+=1)t.slidesPerGroup===1&&f.push(f[f.length-1]+y),h.push(h[h.length-1]+y),i.virtualSize+=y}if(f.length===0&&(f=[0]),v!==0){const y=i.isHorizontal()&&s?"marginLeft":i.getDirectionLabel("marginRight");c.filter((w,I)=>!t.cssMode||t.loop?!0:I!==c.length-1).forEach(w=>{w.style[y]=`${v}px`})}if(t.centeredSlides&&t.centeredSlidesBounds){let y=0;d.forEach(I=>{y+=I+(v||0)}),y-=v;const w=y>S?y-S:0;f=f.map(I=>I<=0?-g:I>w?w+_:I)}if(t.centerInsufficientSlides){let y=0;d.forEach(I=>{y+=I+(v||0)}),y-=v;const w=(g||0)+(_||0);if(y+w<S){const I=(S-y-w)/2;f.forEach((U,V)=>{f[V]=U-I}),h.forEach((U,V)=>{h[V]=U+I})}}if(Object.assign(i,{slides:c,snapGrid:f,slidesGrid:h,slidesSizesGrid:d}),t.centeredSlides&&t.cssMode&&!t.centeredSlidesBounds){Xo(n,"--swiper-centered-offset-before",`${-f[0]}px`),Xo(n,"--swiper-centered-offset-after",`${i.size/2-d[d.length-1]/2}px`);const y=-i.snapGrid[0],w=-i.slidesGrid[0];i.snapGrid=i.snapGrid.map(I=>I+y),i.slidesGrid=i.slidesGrid.map(I=>I+w)}if(u!==l&&i.emit("slidesLengthChange"),f.length!==m&&(i.params.watchOverflow&&i.checkOverflow(),i.emit("snapGridLengthChange")),h.length!==p&&i.emit("slidesGridLengthChange"),t.watchSlidesProgress&&i.updateSlidesOffset(),i.emit("slidesUpdated"),!o&&!t.cssMode&&(t.effect==="slide"||t.effect==="fade")){const y=`${t.containerModifierClass}backface-hidden`,w=i.el.classList.contains(y);u<=t.maxBackfaceHiddenSlides?w||i.el.classList.add(y):w&&i.el.classList.remove(y)}}function ST(i){const e=this,t=[],n=e.virtual&&e.params.virtual.enabled;let r=0,s;typeof i=="number"?e.setTransition(i):i===!0&&e.setTransition(e.params.speed);const a=o=>n?e.slides[e.getSlideIndexByData(o)]:e.slides[o];if(e.params.slidesPerView!=="auto"&&e.params.slidesPerView>1)if(e.params.centeredSlides)(e.visibleSlides||[]).forEach(o=>{t.push(o)});else for(s=0;s<Math.ceil(e.params.slidesPerView);s+=1){const o=e.activeIndex+s;if(o>e.slides.length&&!n)break;t.push(a(o))}else t.push(a(e.activeIndex));for(s=0;s<t.length;s+=1)if(typeof t[s]<"u"){const o=t[s].offsetHeight;r=o>r?o:r}(r||r===0)&&(e.wrapperEl.style.height=`${r}px`)}function yT(){const i=this,e=i.slides,t=i.isElement?i.isHorizontal()?i.wrapperEl.offsetLeft:i.wrapperEl.offsetTop:0;for(let n=0;n<e.length;n+=1)e[n].swiperSlideOffset=(i.isHorizontal()?e[n].offsetLeft:e[n].offsetTop)-t-i.cssOverflowAdjustment()}const $h=(i,e,t)=>{e&&!i.classList.contains(t)?i.classList.add(t):!e&&i.classList.contains(t)&&i.classList.remove(t)};function MT(i=this&&this.translate||0){const e=this,t=e.params,{slides:n,rtlTranslate:r,snapGrid:s}=e;if(n.length===0)return;typeof n[0].swiperSlideOffset>"u"&&e.updateSlidesOffset();let a=-i;r&&(a=i),e.visibleSlidesIndexes=[],e.visibleSlides=[];let o=t.spaceBetween;typeof o=="string"&&o.indexOf("%")>=0?o=parseFloat(o.replace("%",""))/100*e.size:typeof o=="string"&&(o=parseFloat(o));for(let l=0;l<n.length;l+=1){const c=n[l];let u=c.swiperSlideOffset;t.cssMode&&t.centeredSlides&&(u-=n[0].swiperSlideOffset);const f=(a+(t.centeredSlides?e.minTranslate():0)-u)/(c.swiperSlideSize+o),h=(a-s[0]+(t.centeredSlides?e.minTranslate():0)-u)/(c.swiperSlideSize+o),d=-(a-u),g=d+e.slidesSizesGrid[l],_=d>=0&&d<=e.size-e.slidesSizesGrid[l],m=d>=0&&d<e.size-1||g>1&&g<=e.size||d<=0&&g>=e.size;m&&(e.visibleSlides.push(c),e.visibleSlidesIndexes.push(l)),$h(c,m,t.slideVisibleClass),$h(c,_,t.slideFullyVisibleClass),c.progress=r?-f:f,c.originalProgress=r?-h:h}}function ET(i){const e=this;if(typeof i>"u"){const u=e.rtlTranslate?-1:1;i=e&&e.translate&&e.translate*u||0}const t=e.params,n=e.maxTranslate()-e.minTranslate();let{progress:r,isBeginning:s,isEnd:a,progressLoop:o}=e;const l=s,c=a;if(n===0)r=0,s=!0,a=!0;else{r=(i-e.minTranslate())/n;const u=Math.abs(i-e.minTranslate())<1,f=Math.abs(i-e.maxTranslate())<1;s=u||r<=0,a=f||r>=1,u&&(r=0),f&&(r=1)}if(t.loop){const u=e.getSlideIndexByData(0),f=e.getSlideIndexByData(e.slides.length-1),h=e.slidesGrid[u],d=e.slidesGrid[f],g=e.slidesGrid[e.slidesGrid.length-1],_=Math.abs(i);_>=h?o=(_-h)/g:o=(_+g-d)/g,o>1&&(o-=1)}Object.assign(e,{progress:r,progressLoop:o,isBeginning:s,isEnd:a}),(t.watchSlidesProgress||t.centeredSlides&&t.autoHeight)&&e.updateSlidesProgress(i),s&&!l&&e.emit("reachBeginning toEdge"),a&&!c&&e.emit("reachEnd toEdge"),(l&&!s||c&&!a)&&e.emit("fromEdge"),e.emit("progress",r)}const $c=(i,e,t)=>{e&&!i.classList.contains(t)?i.classList.add(t):!e&&i.classList.contains(t)&&i.classList.remove(t)};function TT(){const i=this,{slides:e,params:t,slidesEl:n,activeIndex:r}=i,s=i.virtual&&t.virtual.enabled,a=i.grid&&t.grid&&t.grid.rows>1,o=f=>gi(n,`.${t.slideClass}${f}, swiper-slide${f}`)[0];let l,c,u;if(s)if(t.loop){let f=r-i.virtual.slidesBefore;f<0&&(f=i.virtual.slides.length+f),f>=i.virtual.slides.length&&(f-=i.virtual.slides.length),l=o(`[data-swiper-slide-index="${f}"]`)}else l=o(`[data-swiper-slide-index="${r}"]`);else a?(l=e.find(f=>f.column===r),u=e.find(f=>f.column===r+1),c=e.find(f=>f.column===r-1)):l=e[r];l&&(a||(u=uT(l,`.${t.slideClass}, swiper-slide`)[0],t.loop&&!u&&(u=e[0]),c=cT(l,`.${t.slideClass}, swiper-slide`)[0],t.loop&&!c===0&&(c=e[e.length-1]))),e.forEach(f=>{$c(f,f===l,t.slideActiveClass),$c(f,f===u,t.slideNextClass),$c(f,f===c,t.slidePrevClass)}),i.emitSlidesClasses()}const gl=(i,e)=>{if(!i||i.destroyed||!i.params)return;const t=()=>i.isElement?"swiper-slide":`.${i.params.slideClass}`,n=e.closest(t());if(n){let r=n.querySelector(`.${i.params.lazyPreloaderClass}`);!r&&i.isElement&&(n.shadowRoot?r=n.shadowRoot.querySelector(`.${i.params.lazyPreloaderClass}`):requestAnimationFrame(()=>{n.shadowRoot&&(r=n.shadowRoot.querySelector(`.${i.params.lazyPreloaderClass}`),r&&r.remove())})),r&&r.remove()}},jc=(i,e)=>{if(!i.slides[e])return;const t=i.slides[e].querySelector('[loading="lazy"]');t&&t.removeAttribute("loading")},pf=i=>{if(!i||i.destroyed||!i.params)return;let e=i.params.lazyPreloadPrevNext;const t=i.slides.length;if(!t||!e||e<0)return;e=Math.min(e,t);const n=i.params.slidesPerView==="auto"?i.slidesPerViewDynamic():Math.ceil(i.params.slidesPerView),r=i.activeIndex;if(i.params.grid&&i.params.grid.rows>1){const a=r,o=[a-e];o.push(...Array.from({length:e}).map((l,c)=>a+n+c)),i.slides.forEach((l,c)=>{o.includes(l.column)&&jc(i,c)});return}const s=r+n-1;if(i.params.rewind||i.params.loop)for(let a=r-e;a<=s+e;a+=1){const o=(a%t+t)%t;(o<r||o>s)&&jc(i,o)}else for(let a=Math.max(r-e,0);a<=Math.min(s+e,t-1);a+=1)a!==r&&(a>s||a<r)&&jc(i,a)};function bT(i){const{slidesGrid:e,params:t}=i,n=i.rtlTranslate?i.translate:-i.translate;let r;for(let s=0;s<e.length;s+=1)typeof e[s+1]<"u"?n>=e[s]&&n<e[s+1]-(e[s+1]-e[s])/2?r=s:n>=e[s]&&n<e[s+1]&&(r=s+1):n>=e[s]&&(r=s);return t.normalizeSlideIndex&&(r<0||typeof r>"u")&&(r=0),r}function DT(i){const e=this,t=e.rtlTranslate?e.translate:-e.translate,{snapGrid:n,params:r,activeIndex:s,realIndex:a,snapIndex:o}=e;let l=i,c;const u=d=>{let g=d-e.virtual.slidesBefore;return g<0&&(g=e.virtual.slides.length+g),g>=e.virtual.slides.length&&(g-=e.virtual.slides.length),g};if(typeof l>"u"&&(l=bT(e)),n.indexOf(t)>=0)c=n.indexOf(t);else{const d=Math.min(r.slidesPerGroupSkip,l);c=d+Math.floor((l-d)/r.slidesPerGroup)}if(c>=n.length&&(c=n.length-1),l===s&&!e.params.loop){c!==o&&(e.snapIndex=c,e.emit("snapIndexChange"));return}if(l===s&&e.params.loop&&e.virtual&&e.params.virtual.enabled){e.realIndex=u(l);return}const f=e.grid&&r.grid&&r.grid.rows>1;let h;if(e.virtual&&r.virtual.enabled&&r.loop)h=u(l);else if(f){const d=e.slides.find(_=>_.column===l);let g=parseInt(d.getAttribute("data-swiper-slide-index"),10);Number.isNaN(g)&&(g=Math.max(e.slides.indexOf(d),0)),h=Math.floor(g/r.grid.rows)}else if(e.slides[l]){const d=e.slides[l].getAttribute("data-swiper-slide-index");d?h=parseInt(d,10):h=l}else h=l;Object.assign(e,{previousSnapIndex:o,snapIndex:c,previousRealIndex:a,realIndex:h,previousIndex:s,activeIndex:l}),e.initialized&&pf(e),e.emit("activeIndexChange"),e.emit("snapIndexChange"),(e.initialized||e.params.runCallbacksOnInit)&&(a!==h&&e.emit("realIndexChange"),e.emit("slideChange"))}function CT(i,e){const t=this,n=t.params;let r=i.closest(`.${n.slideClass}, swiper-slide`);!r&&t.isElement&&e&&e.length>1&&e.includes(i)&&[...e.slice(e.indexOf(i)+1,e.length)].forEach(o=>{!r&&o.matches&&o.matches(`.${n.slideClass}, swiper-slide`)&&(r=o)});let s=!1,a;if(r){for(let o=0;o<t.slides.length;o+=1)if(t.slides[o]===r){s=!0,a=o;break}}if(r&&s)t.clickedSlide=r,t.virtual&&t.params.virtual.enabled?t.clickedIndex=parseInt(r.getAttribute("data-swiper-slide-index"),10):t.clickedIndex=a;else{t.clickedSlide=void 0,t.clickedIndex=void 0;return}n.slideToClickedSlide&&t.clickedIndex!==void 0&&t.clickedIndex!==t.activeIndex&&t.slideToClickedSlide()}var AT={updateSize:vT,updateSlides:xT,updateAutoHeight:ST,updateSlidesOffset:yT,updateSlidesProgress:MT,updateProgress:ET,updateSlidesClasses:TT,updateActiveIndex:DT,updateClickedSlide:CT};function wT(i=this.isHorizontal()?"x":"y"){const e=this,{params:t,rtlTranslate:n,translate:r,wrapperEl:s}=e;if(t.virtualTranslate)return n?-r:r;if(t.cssMode)return r;let a=sT(s,i);return a+=e.cssOverflowAdjustment(),n&&(a=-a),a||0}function RT(i,e){const t=this,{rtlTranslate:n,params:r,wrapperEl:s,progress:a}=t;let o=0,l=0;const c=0;t.isHorizontal()?o=n?-i:i:l=i,r.roundLengths&&(o=Math.floor(o),l=Math.floor(l)),t.previousTranslate=t.translate,t.translate=t.isHorizontal()?o:l,r.cssMode?s[t.isHorizontal()?"scrollLeft":"scrollTop"]=t.isHorizontal()?-o:-l:r.virtualTranslate||(t.isHorizontal()?o-=t.cssOverflowAdjustment():l-=t.cssOverflowAdjustment(),s.style.transform=`translate3d(${o}px, ${l}px, ${c}px)`);let u;const f=t.maxTranslate()-t.minTranslate();f===0?u=0:u=(i-t.minTranslate())/f,u!==a&&t.updateProgress(i),t.emit("setTranslate",t.translate,e)}function PT(){return-this.snapGrid[0]}function LT(){return-this.snapGrid[this.snapGrid.length-1]}function FT(i=0,e=this.params.speed,t=!0,n=!0,r){const s=this,{params:a,wrapperEl:o}=s;if(s.animating&&a.preventInteractionOnTransition)return!1;const l=s.minTranslate(),c=s.maxTranslate();let u;if(n&&i>l?u=l:n&&i<c?u=c:u=i,s.updateProgress(u),a.cssMode){const f=s.isHorizontal();if(e===0)o[f?"scrollLeft":"scrollTop"]=-u;else{if(!s.support.smoothScroll)return tg({swiper:s,targetPosition:-u,side:f?"left":"top"}),!0;o.scrollTo({[f?"left":"top"]:-u,behavior:"smooth"})}return!0}return e===0?(s.setTransition(0),s.setTranslate(u),t&&(s.emit("beforeTransitionStart",e,r),s.emit("transitionEnd"))):(s.setTransition(e),s.setTranslate(u),t&&(s.emit("beforeTransitionStart",e,r),s.emit("transitionStart")),s.animating||(s.animating=!0,s.onTranslateToWrapperTransitionEnd||(s.onTranslateToWrapperTransitionEnd=function(h){!s||s.destroyed||h.target===this&&(s.wrapperEl.removeEventListener("transitionend",s.onTranslateToWrapperTransitionEnd),s.onTranslateToWrapperTransitionEnd=null,delete s.onTranslateToWrapperTransitionEnd,s.animating=!1,t&&s.emit("transitionEnd"))}),s.wrapperEl.addEventListener("transitionend",s.onTranslateToWrapperTransitionEnd))),!0}var IT={getTranslate:wT,setTranslate:RT,minTranslate:PT,maxTranslate:LT,translateTo:FT};function OT(i,e){const t=this;t.params.cssMode||(t.wrapperEl.style.transitionDuration=`${i}ms`,t.wrapperEl.style.transitionDelay=i===0?"0ms":""),t.emit("setTransition",i,e)}function ag({swiper:i,runCallbacks:e,direction:t,step:n}){const{activeIndex:r,previousIndex:s}=i;let a=t;a||(r>s?a="next":r<s?a="prev":a="reset"),i.emit(`transition${n}`),e&&a==="reset"?i.emit(`slideResetTransition${n}`):e&&r!==s&&(i.emit(`slideChangeTransition${n}`),a==="next"?i.emit(`slideNextTransition${n}`):i.emit(`slidePrevTransition${n}`))}function UT(i=!0,e){const t=this,{params:n}=t;n.cssMode||(n.autoHeight&&t.updateAutoHeight(),ag({swiper:t,runCallbacks:i,direction:e,step:"Start"}))}function NT(i=!0,e){const t=this,{params:n}=t;t.animating=!1,!n.cssMode&&(t.setTransition(0),ag({swiper:t,runCallbacks:i,direction:e,step:"End"}))}var BT={setTransition:OT,transitionStart:UT,transitionEnd:NT};function zT(i=0,e,t=!0,n,r){typeof i=="string"&&(i=parseInt(i,10));const s=this;let a=i;a<0&&(a=0);const{params:o,snapGrid:l,slidesGrid:c,previousIndex:u,activeIndex:f,rtlTranslate:h,wrapperEl:d,enabled:g}=s;if(!g&&!n&&!r||s.destroyed||s.animating&&o.preventInteractionOnTransition)return!1;typeof e>"u"&&(e=s.params.speed);const _=Math.min(s.params.slidesPerGroupSkip,a);let m=_+Math.floor((a-_)/s.params.slidesPerGroup);m>=l.length&&(m=l.length-1);const p=-l[m];if(o.normalizeSlideIndex)for(let T=0;T<c.length;T+=1){const E=-Math.floor(p*100),M=Math.floor(c[T]*100),y=Math.floor(c[T+1]*100);typeof c[T+1]<"u"?E>=M&&E<y-(y-M)/2?a=T:E>=M&&E<y&&(a=T+1):E>=M&&(a=T)}if(s.initialized&&a!==f&&(!s.allowSlideNext&&(h?p>s.translate&&p>s.minTranslate():p<s.translate&&p<s.minTranslate())||!s.allowSlidePrev&&p>s.translate&&p>s.maxTranslate()&&(f||0)!==a))return!1;a!==(u||0)&&t&&s.emit("beforeSlideChangeStart"),s.updateProgress(p);let S;a>f?S="next":a<f?S="prev":S="reset";const v=s.virtual&&s.params.virtual.enabled;if(!(v&&r)&&(h&&-p===s.translate||!h&&p===s.translate))return s.updateActiveIndex(a),o.autoHeight&&s.updateAutoHeight(),s.updateSlidesClasses(),o.effect!=="slide"&&s.setTranslate(p),S!=="reset"&&(s.transitionStart(t,S),s.transitionEnd(t,S)),!1;if(o.cssMode){const T=s.isHorizontal(),E=h?p:-p;if(e===0)v&&(s.wrapperEl.style.scrollSnapType="none",s._immediateVirtual=!0),v&&!s._cssModeVirtualInitialSet&&s.params.initialSlide>0?(s._cssModeVirtualInitialSet=!0,requestAnimationFrame(()=>{d[T?"scrollLeft":"scrollTop"]=E})):d[T?"scrollLeft":"scrollTop"]=E,v&&requestAnimationFrame(()=>{s.wrapperEl.style.scrollSnapType="",s._immediateVirtual=!1});else{if(!s.support.smoothScroll)return tg({swiper:s,targetPosition:E,side:T?"left":"top"}),!0;d.scrollTo({[T?"left":"top"]:E,behavior:"smooth"})}return!0}const D=sg().isSafari;return v&&!r&&D&&s.isElement&&s.virtual.update(!1,!1,a),s.setTransition(e),s.setTranslate(p),s.updateActiveIndex(a),s.updateSlidesClasses(),s.emit("beforeTransitionStart",e,n),s.transitionStart(t,S),e===0?s.transitionEnd(t,S):s.animating||(s.animating=!0,s.onSlideToWrapperTransitionEnd||(s.onSlideToWrapperTransitionEnd=function(E){!s||s.destroyed||E.target===this&&(s.wrapperEl.removeEventListener("transitionend",s.onSlideToWrapperTransitionEnd),s.onSlideToWrapperTransitionEnd=null,delete s.onSlideToWrapperTransitionEnd,s.transitionEnd(t,S))}),s.wrapperEl.addEventListener("transitionend",s.onSlideToWrapperTransitionEnd)),!0}function kT(i=0,e,t=!0,n){typeof i=="string"&&(i=parseInt(i,10));const r=this;if(r.destroyed)return;typeof e>"u"&&(e=r.params.speed);const s=r.grid&&r.params.grid&&r.params.grid.rows>1;let a=i;if(r.params.loop)if(r.virtual&&r.params.virtual.enabled)a=a+r.virtual.slidesBefore;else{let o;if(s){const _=a*r.params.grid.rows;o=r.slides.find(m=>m.getAttribute("data-swiper-slide-index")*1===_).column}else o=r.getSlideIndexByData(a);const l=s?Math.ceil(r.slides.length/r.params.grid.rows):r.slides.length,{centeredSlides:c,slidesOffsetBefore:u,slidesOffsetAfter:f}=r.params,h=c||!!u||!!f;let d=r.params.slidesPerView;d==="auto"?d=r.slidesPerViewDynamic():(d=Math.ceil(parseFloat(r.params.slidesPerView,10)),h&&d%2===0&&(d=d+1));let g=l-o<d;if(h&&(g=g||o<Math.ceil(d/2)),n&&h&&r.params.slidesPerView!=="auto"&&!s&&(g=!1),g){const _=h?o<r.activeIndex?"prev":"next":o-r.activeIndex-1<r.params.slidesPerView?"next":"prev";r.loopFix({direction:_,slideTo:!0,activeSlideIndex:_==="next"?o+1:o-l+1,slideRealIndex:_==="next"?r.realIndex:void 0})}if(s){const _=a*r.params.grid.rows;a=r.slides.find(m=>m.getAttribute("data-swiper-slide-index")*1===_).column}else a=r.getSlideIndexByData(a)}return requestAnimationFrame(()=>{r.slideTo(a,e,t,n)}),r}function VT(i,e=!0,t){const n=this,{enabled:r,params:s,animating:a}=n;if(!r||n.destroyed)return n;typeof i>"u"&&(i=n.params.speed);let o=s.slidesPerGroup;s.slidesPerView==="auto"&&s.slidesPerGroup===1&&s.slidesPerGroupAuto&&(o=Math.max(n.slidesPerViewDynamic("current",!0),1));const l=n.activeIndex<s.slidesPerGroupSkip?1:o,c=n.virtual&&s.virtual.enabled;if(s.loop){if(a&&!c&&s.loopPreventsSliding)return!1;if(n.loopFix({direction:"next"}),n._clientLeft=n.wrapperEl.clientLeft,n.activeIndex===n.slides.length-1&&s.cssMode)return requestAnimationFrame(()=>{n.slideTo(n.activeIndex+l,i,e,t)}),!0}return s.rewind&&n.isEnd?n.slideTo(0,i,e,t):n.slideTo(n.activeIndex+l,i,e,t)}function HT(i,e=!0,t){const n=this,{params:r,snapGrid:s,slidesGrid:a,rtlTranslate:o,enabled:l,animating:c}=n;if(!l||n.destroyed)return n;typeof i>"u"&&(i=n.params.speed);const u=n.virtual&&r.virtual.enabled;if(r.loop){if(c&&!u&&r.loopPreventsSliding)return!1;n.loopFix({direction:"prev"}),n._clientLeft=n.wrapperEl.clientLeft}const f=o?n.translate:-n.translate;function h(S){return S<0?-Math.floor(Math.abs(S)):Math.floor(S)}const d=h(f),g=s.map(S=>h(S)),_=r.freeMode&&r.freeMode.enabled;let m=s[g.indexOf(d)-1];if(typeof m>"u"&&(r.cssMode||_)){let S;s.forEach((v,x)=>{d>=v&&(S=x)}),typeof S<"u"&&(m=_?s[S]:s[S>0?S-1:S])}let p=0;if(typeof m<"u"&&(p=a.indexOf(m),p<0&&(p=n.activeIndex-1),r.slidesPerView==="auto"&&r.slidesPerGroup===1&&r.slidesPerGroupAuto&&(p=p-n.slidesPerViewDynamic("previous",!0)+1,p=Math.max(p,0))),r.rewind&&n.isBeginning){const S=n.params.virtual&&n.params.virtual.enabled&&n.virtual?n.virtual.slides.length-1:n.slides.length-1;return n.slideTo(S,i,e,t)}else if(r.loop&&n.activeIndex===0&&r.cssMode)return requestAnimationFrame(()=>{n.slideTo(p,i,e,t)}),!0;return n.slideTo(p,i,e,t)}function GT(i,e=!0,t){const n=this;if(!n.destroyed)return typeof i>"u"&&(i=n.params.speed),n.slideTo(n.activeIndex,i,e,t)}function WT(i,e=!0,t,n=.5){const r=this;if(r.destroyed)return;typeof i>"u"&&(i=r.params.speed);let s=r.activeIndex;const a=Math.min(r.params.slidesPerGroupSkip,s),o=a+Math.floor((s-a)/r.params.slidesPerGroup),l=r.rtlTranslate?r.translate:-r.translate;if(l>=r.snapGrid[o]){const c=r.snapGrid[o],u=r.snapGrid[o+1];l-c>(u-c)*n&&(s+=r.params.slidesPerGroup)}else{const c=r.snapGrid[o-1],u=r.snapGrid[o];l-c<=(u-c)*n&&(s-=r.params.slidesPerGroup)}return s=Math.max(s,0),s=Math.min(s,r.slidesGrid.length-1),r.slideTo(s,i,e,t)}function XT(){const i=this;if(i.destroyed)return;const{params:e,slidesEl:t}=i,n=e.slidesPerView==="auto"?i.slidesPerViewDynamic():e.slidesPerView;let r=i.getSlideIndexWhenGrid(i.clickedIndex),s;const a=i.isElement?"swiper-slide":`.${e.slideClass}`,o=i.grid&&i.params.grid&&i.params.grid.rows>1;if(e.loop){if(i.animating)return;s=parseInt(i.clickedSlide.getAttribute("data-swiper-slide-index"),10),e.centeredSlides?i.slideToLoop(s):r>(o?(i.slides.length-n)/2-(i.params.grid.rows-1):i.slides.length-n)?(i.loopFix(),r=i.getSlideIndex(gi(t,`${a}[data-swiper-slide-index="${s}"]`)[0]),eg(()=>{i.slideTo(r)})):i.slideTo(r)}else i.slideTo(r)}var qT={slideTo:zT,slideToLoop:kT,slideNext:VT,slidePrev:HT,slideReset:GT,slideToClosest:WT,slideToClickedSlide:XT};function YT(i,e){const t=this,{params:n,slidesEl:r}=t;if(!n.loop||t.virtual&&t.params.virtual.enabled)return;const s=()=>{gi(r,`.${n.slideClass}, swiper-slide`).forEach((g,_)=>{g.setAttribute("data-swiper-slide-index",_)})},a=()=>{const d=gi(r,`.${n.slideBlankClass}`);d.forEach(g=>{g.remove()}),d.length>0&&(t.recalcSlides(),t.updateSlides())},o=t.grid&&n.grid&&n.grid.rows>1;n.loopAddBlankSlides&&(n.slidesPerGroup>1||o)&&a();const l=n.slidesPerGroup*(o?n.grid.rows:1),c=t.slides.length%l!==0,u=o&&t.slides.length%n.grid.rows!==0,f=d=>{for(let g=0;g<d;g+=1){const _=t.isElement?ro("swiper-slide",[n.slideBlankClass]):ro("div",[n.slideClass,n.slideBlankClass]);t.slidesEl.append(_)}};if(c){if(n.loopAddBlankSlides){const d=l-t.slides.length%l;f(d),t.recalcSlides(),t.updateSlides()}else Ul("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");s()}else if(u){if(n.loopAddBlankSlides){const d=n.grid.rows-t.slides.length%n.grid.rows;f(d),t.recalcSlides(),t.updateSlides()}else Ul("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");s()}else s();const h=n.centeredSlides||!!n.slidesOffsetBefore||!!n.slidesOffsetAfter;t.loopFix({slideRealIndex:i,direction:h?void 0:"next",initial:e})}function $T({slideRealIndex:i,slideTo:e=!0,direction:t,setTranslate:n,activeSlideIndex:r,initial:s,byController:a,byMousewheel:o}={}){const l=this;if(!l.params.loop)return;l.emit("beforeLoopFix");const{slides:c,allowSlidePrev:u,allowSlideNext:f,slidesEl:h,params:d}=l,{centeredSlides:g,slidesOffsetBefore:_,slidesOffsetAfter:m,initialSlide:p}=d,S=g||!!_||!!m;if(l.allowSlidePrev=!0,l.allowSlideNext=!0,l.virtual&&d.virtual.enabled){e&&(!S&&l.snapIndex===0?l.slideTo(l.virtual.slides.length,0,!1,!0):S&&l.snapIndex<d.slidesPerView?l.slideTo(l.virtual.slides.length+l.snapIndex,0,!1,!0):l.snapIndex===l.snapGrid.length-1&&l.slideTo(l.virtual.slidesBefore,0,!1,!0)),l.allowSlidePrev=u,l.allowSlideNext=f,l.emit("loopFix");return}let v=d.slidesPerView;v==="auto"?v=l.slidesPerViewDynamic():(v=Math.ceil(parseFloat(d.slidesPerView,10)),S&&v%2===0&&(v=v+1));const x=d.slidesPerGroupAuto?v:d.slidesPerGroup;let C=S?Math.max(x,Math.ceil(v/2)):x;C%x!==0&&(C+=x-C%x),C+=d.loopAdditionalSlides,l.loopedSlides=C;const D=l.grid&&d.grid&&d.grid.rows>1;c.length<v+C||l.params.effect==="cards"&&c.length<v+C*2?Ul("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"):D&&d.grid.fill==="row"&&Ul("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");const T=[],E=[],M=D?Math.ceil(c.length/d.grid.rows):c.length,y=s&&M-p<v&&!S;let w=y?p:l.activeIndex;typeof r>"u"?r=l.getSlideIndex(c.find(N=>N.classList.contains(d.slideActiveClass))):w=r;const I=t==="next"||!t,U=t==="prev"||!t;let V=0,q=0;const H=(D?c[r].column:r)+(S&&typeof n>"u"?-v/2+.5:0);if(H<C){V=Math.max(C-H,x);for(let N=0;N<C-H;N+=1){const Q=N-Math.floor(N/M)*M;if(D){const L=M-Q-1;for(let ae=c.length-1;ae>=0;ae-=1)c[ae].column===L&&T.push(ae)}else T.push(M-Q-1)}}else if(H+v>M-C){q=Math.max(H-(M-C*2),x),y&&(q=Math.max(q,v-M+p+1));for(let N=0;N<q;N+=1){const Q=N-Math.floor(N/M)*M;D?c.forEach((L,ae)=>{L.column===Q&&E.push(ae)}):E.push(Q)}}if(l.__preventObserver__=!0,requestAnimationFrame(()=>{l.__preventObserver__=!1}),l.params.effect==="cards"&&c.length<v+C*2&&(E.includes(r)&&E.splice(E.indexOf(r),1),T.includes(r)&&T.splice(T.indexOf(r),1)),U&&T.forEach(N=>{c[N].swiperLoopMoveDOM=!0,h.prepend(c[N]),c[N].swiperLoopMoveDOM=!1}),I&&E.forEach(N=>{c[N].swiperLoopMoveDOM=!0,h.append(c[N]),c[N].swiperLoopMoveDOM=!1}),l.recalcSlides(),d.slidesPerView==="auto"?l.updateSlides():D&&(T.length>0&&U||E.length>0&&I)&&l.slides.forEach((N,Q)=>{l.grid.updateSlide(Q,N,l.slides)}),d.watchSlidesProgress&&l.updateSlidesOffset(),e){if(T.length>0&&U){if(typeof i>"u"){const N=l.slidesGrid[w],L=l.slidesGrid[w+V]-N;o?l.setTranslate(l.translate-L):(l.slideTo(w+Math.ceil(V),0,!1,!0),n&&(l.touchEventsData.startTranslate=l.touchEventsData.startTranslate-L,l.touchEventsData.currentTranslate=l.touchEventsData.currentTranslate-L))}else if(n){const N=D?T.length/d.grid.rows:T.length;l.slideTo(l.activeIndex+N,0,!1,!0),l.touchEventsData.currentTranslate=l.translate}}else if(E.length>0&&I)if(typeof i>"u"){const N=l.slidesGrid[w],L=l.slidesGrid[w-q]-N;o?l.setTranslate(l.translate-L):(l.slideTo(w-q,0,!1,!0),n&&(l.touchEventsData.startTranslate=l.touchEventsData.startTranslate-L,l.touchEventsData.currentTranslate=l.touchEventsData.currentTranslate-L))}else{const N=D?E.length/d.grid.rows:E.length;l.slideTo(l.activeIndex-N,0,!1,!0)}}if(l.allowSlidePrev=u,l.allowSlideNext=f,l.controller&&l.controller.control&&!a){const N={slideRealIndex:i,direction:t,setTranslate:n,activeSlideIndex:r,byController:!0};Array.isArray(l.controller.control)?l.controller.control.forEach(Q=>{!Q.destroyed&&Q.params.loop&&Q.loopFix({...N,slideTo:Q.params.slidesPerView===d.slidesPerView?e:!1})}):l.controller.control instanceof l.constructor&&l.controller.control.params.loop&&l.controller.control.loopFix({...N,slideTo:l.controller.control.params.slidesPerView===d.slidesPerView?e:!1})}l.emit("loopFix")}function jT(){const i=this,{params:e,slidesEl:t}=i;if(!e.loop||!t||i.virtual&&i.params.virtual.enabled)return;i.recalcSlides();const n=[];i.slides.forEach(r=>{const s=typeof r.swiperSlideIndex>"u"?r.getAttribute("data-swiper-slide-index")*1:r.swiperSlideIndex;n[s]=r}),i.slides.forEach(r=>{r.removeAttribute("data-swiper-slide-index")}),n.forEach(r=>{t.append(r)}),i.recalcSlides(),i.slideTo(i.realIndex,0)}var ZT={loopCreate:YT,loopFix:$T,loopDestroy:jT};function KT(i){const e=this;if(!e.params.simulateTouch||e.params.watchOverflow&&e.isLocked||e.params.cssMode)return;const t=e.params.touchEventsTarget==="container"?e.el:e.wrapperEl;e.isElement&&(e.__preventObserver__=!0),t.style.cursor="move",t.style.cursor=i?"grabbing":"grab",e.isElement&&requestAnimationFrame(()=>{e.__preventObserver__=!1})}function JT(){const i=this;i.params.watchOverflow&&i.isLocked||i.params.cssMode||(i.isElement&&(i.__preventObserver__=!0),i[i.params.touchEventsTarget==="container"?"el":"wrapperEl"].style.cursor="",i.isElement&&requestAnimationFrame(()=>{i.__preventObserver__=!1}))}var QT={setGrabCursor:KT,unsetGrabCursor:JT};function eb(i,e=this){function t(n){if(!n||n===xi()||n===Tn())return null;n.assignedSlot&&(n=n.assignedSlot);const r=n.closest(i);return!r&&!n.getRootNode?null:r||t(n.getRootNode().host)}return t(e)}function jh(i,e,t){const n=Tn(),{params:r}=i,s=r.edgeSwipeDetection,a=r.edgeSwipeThreshold;return s&&(t<=a||t>=n.innerWidth-a)?s==="prevent"?(e.preventDefault(),!0):!1:!0}function tb(i){const e=this,t=xi();let n=i;n.originalEvent&&(n=n.originalEvent);const r=e.touchEventsData;if(n.type==="pointerdown"){if(r.pointerId!==null&&r.pointerId!==n.pointerId)return;r.pointerId=n.pointerId}else n.type==="touchstart"&&n.targetTouches.length===1&&(r.touchId=n.targetTouches[0].identifier);if(n.type==="touchstart"){jh(e,n,n.targetTouches[0].pageX);return}const{params:s,touches:a,enabled:o}=e;if(!o||!s.simulateTouch&&n.pointerType==="mouse"||e.animating&&s.preventInteractionOnTransition)return;!e.animating&&s.cssMode&&s.loop&&e.loopFix();let l=n.target;if(s.touchEventsTarget==="wrapper"&&!lT(l,e.wrapperEl)||"which"in n&&n.which===3||"button"in n&&n.button>0||r.isTouched&&r.isMoved)return;const c=!!s.noSwipingClass&&s.noSwipingClass!=="",u=n.composedPath?n.composedPath():n.path;c&&n.target&&n.target.shadowRoot&&u&&(l=u[0]);const f=s.noSwipingSelector?s.noSwipingSelector:`.${s.noSwipingClass}`,h=!!(n.target&&n.target.shadowRoot);if(s.noSwiping&&(h?eb(f,l):l.closest(f))){e.allowClick=!0;return}if(s.swipeHandler&&!l.closest(s.swipeHandler))return;a.currentX=n.pageX,a.currentY=n.pageY;const d=a.currentX,g=a.currentY;if(!jh(e,n,d))return;Object.assign(r,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),a.startX=d,a.startY=g,r.touchStartTime=jr(),e.allowClick=!0,e.updateSize(),e.swipeDirection=void 0,s.threshold>0&&(r.allowThresholdMove=!1);let _=!0;l.matches(r.focusableElements)&&(_=!1,l.nodeName==="SELECT"&&(r.isTouched=!1)),t.activeElement&&t.activeElement.matches(r.focusableElements)&&t.activeElement!==l&&(n.pointerType==="mouse"||n.pointerType!=="mouse"&&!l.matches(r.focusableElements))&&t.activeElement.blur();const m=_&&e.allowTouchMove&&s.touchStartPreventDefault;(s.touchStartForcePreventDefault||m)&&!l.isContentEditable&&n.preventDefault(),s.freeMode&&s.freeMode.enabled&&e.freeMode&&e.animating&&!s.cssMode&&e.freeMode.onTouchStart(),e.emit("touchStart",n)}function nb(i){const e=xi(),t=this,n=t.touchEventsData,{params:r,touches:s,rtlTranslate:a,enabled:o}=t;if(!o||!r.simulateTouch&&i.pointerType==="mouse")return;let l=i;if(l.originalEvent&&(l=l.originalEvent),l.type==="pointermove"&&(n.touchId!==null||l.pointerId!==n.pointerId))return;let c;if(l.type==="touchmove"){if(c=[...l.changedTouches].find(C=>C.identifier===n.touchId),!c||c.identifier!==n.touchId)return}else c=l;if(!n.isTouched){n.startMoving&&n.isScrolling&&t.emit("touchMoveOpposite",l);return}const u=c.pageX,f=c.pageY;if(l.preventedByNestedSwiper){s.startX=u,s.startY=f;return}if(!t.allowTouchMove){l.target.matches(n.focusableElements)||(t.allowClick=!1),n.isTouched&&(Object.assign(s,{startX:u,startY:f,currentX:u,currentY:f}),n.touchStartTime=jr());return}if(r.touchReleaseOnEdges&&!r.loop)if(t.isVertical()){if(f<s.startY&&t.translate<=t.maxTranslate()||f>s.startY&&t.translate>=t.minTranslate()){n.isTouched=!1,n.isMoved=!1;return}}else{if(a&&(u>s.startX&&-t.translate<=t.maxTranslate()||u<s.startX&&-t.translate>=t.minTranslate()))return;if(!a&&(u<s.startX&&t.translate<=t.maxTranslate()||u>s.startX&&t.translate>=t.minTranslate()))return}if(e.activeElement&&e.activeElement.matches(n.focusableElements)&&e.activeElement!==l.target&&l.pointerType!=="mouse"&&e.activeElement.blur(),e.activeElement&&l.target===e.activeElement&&l.target.matches(n.focusableElements)){n.isMoved=!0,t.allowClick=!1;return}n.allowTouchCallbacks&&t.emit("touchMove",l),s.previousX=s.currentX,s.previousY=s.currentY,s.currentX=u,s.currentY=f;const h=s.currentX-s.startX,d=s.currentY-s.startY;if(t.params.threshold&&Math.sqrt(h**2+d**2)<t.params.threshold)return;if(typeof n.isScrolling>"u"){let C;t.isHorizontal()&&s.currentY===s.startY||t.isVertical()&&s.currentX===s.startX?n.isScrolling=!1:h*h+d*d>=25&&(C=Math.atan2(Math.abs(d),Math.abs(h))*180/Math.PI,n.isScrolling=t.isHorizontal()?C>r.touchAngle:90-C>r.touchAngle)}if(n.isScrolling&&t.emit("touchMoveOpposite",l),typeof n.startMoving>"u"&&(s.currentX!==s.startX||s.currentY!==s.startY)&&(n.startMoving=!0),n.isScrolling||l.type==="touchmove"&&n.preventTouchMoveFromPointerMove){n.isTouched=!1;return}if(!n.startMoving)return;t.allowClick=!1,!r.cssMode&&l.cancelable&&l.preventDefault(),r.touchMoveStopPropagation&&!r.nested&&l.stopPropagation();let g=t.isHorizontal()?h:d,_=t.isHorizontal()?s.currentX-s.previousX:s.currentY-s.previousY;r.oneWayMovement&&(g=Math.abs(g)*(a?1:-1),_=Math.abs(_)*(a?1:-1)),s.diff=g,g*=r.touchRatio,a&&(g=-g,_=-_);const m=t.touchesDirection;t.swipeDirection=g>0?"prev":"next",t.touchesDirection=_>0?"prev":"next";const p=t.params.loop&&!r.cssMode,S=t.touchesDirection==="next"&&t.allowSlideNext||t.touchesDirection==="prev"&&t.allowSlidePrev;if(!n.isMoved){if(p&&S&&t.loopFix({direction:t.swipeDirection}),n.startTranslate=t.getTranslate(),t.setTransition(0),t.animating){const C=new window.CustomEvent("transitionend",{bubbles:!0,cancelable:!0,detail:{bySwiperTouchMove:!0}});t.wrapperEl.dispatchEvent(C)}n.allowMomentumBounce=!1,r.grabCursor&&(t.allowSlideNext===!0||t.allowSlidePrev===!0)&&t.setGrabCursor(!0),t.emit("sliderFirstMove",l)}if(new Date().getTime(),r._loopSwapReset!==!1&&n.isMoved&&n.allowThresholdMove&&m!==t.touchesDirection&&p&&S&&Math.abs(g)>=1){Object.assign(s,{startX:u,startY:f,currentX:u,currentY:f,startTranslate:n.currentTranslate}),n.loopSwapReset=!0,n.startTranslate=n.currentTranslate;return}t.emit("sliderMove",l),n.isMoved=!0,n.currentTranslate=g+n.startTranslate;let v=!0,x=r.resistanceRatio;if(r.touchReleaseOnEdges&&(x=0),g>0?(p&&S&&n.allowThresholdMove&&n.currentTranslate>(r.centeredSlides?t.minTranslate()-t.slidesSizesGrid[t.activeIndex+1]-(r.slidesPerView!=="auto"&&t.slides.length-r.slidesPerView>=2?t.slidesSizesGrid[t.activeIndex+1]+t.params.spaceBetween:0)-t.params.spaceBetween:t.minTranslate())&&t.loopFix({direction:"prev",setTranslate:!0,activeSlideIndex:0}),n.currentTranslate>t.minTranslate()&&(v=!1,r.resistance&&(n.currentTranslate=t.minTranslate()-1+(-t.minTranslate()+n.startTranslate+g)**x))):g<0&&(p&&S&&n.allowThresholdMove&&n.currentTranslate<(r.centeredSlides?t.maxTranslate()+t.slidesSizesGrid[t.slidesSizesGrid.length-1]+t.params.spaceBetween+(r.slidesPerView!=="auto"&&t.slides.length-r.slidesPerView>=2?t.slidesSizesGrid[t.slidesSizesGrid.length-1]+t.params.spaceBetween:0):t.maxTranslate())&&t.loopFix({direction:"next",setTranslate:!0,activeSlideIndex:t.slides.length-(r.slidesPerView==="auto"?t.slidesPerViewDynamic():Math.ceil(parseFloat(r.slidesPerView,10)))}),n.currentTranslate<t.maxTranslate()&&(v=!1,r.resistance&&(n.currentTranslate=t.maxTranslate()+1-(t.maxTranslate()-n.startTranslate-g)**x))),v&&(l.preventedByNestedSwiper=!0),!t.allowSlideNext&&t.swipeDirection==="next"&&n.currentTranslate<n.startTranslate&&(n.currentTranslate=n.startTranslate),!t.allowSlidePrev&&t.swipeDirection==="prev"&&n.currentTranslate>n.startTranslate&&(n.currentTranslate=n.startTranslate),!t.allowSlidePrev&&!t.allowSlideNext&&(n.currentTranslate=n.startTranslate),r.threshold>0)if(Math.abs(g)>r.threshold||n.allowThresholdMove){if(!n.allowThresholdMove){n.allowThresholdMove=!0,s.startX=s.currentX,s.startY=s.currentY,n.currentTranslate=n.startTranslate,s.diff=t.isHorizontal()?s.currentX-s.startX:s.currentY-s.startY;return}}else{n.currentTranslate=n.startTranslate;return}!r.followFinger||r.cssMode||((r.freeMode&&r.freeMode.enabled&&t.freeMode||r.watchSlidesProgress)&&(t.updateActiveIndex(),t.updateSlidesClasses()),r.freeMode&&r.freeMode.enabled&&t.freeMode&&t.freeMode.onTouchMove(),t.updateProgress(n.currentTranslate),t.setTranslate(n.currentTranslate))}function ib(i){const e=this,t=e.touchEventsData;let n=i;n.originalEvent&&(n=n.originalEvent);let r;if(n.type==="touchend"||n.type==="touchcancel"){if(r=[...n.changedTouches].find(C=>C.identifier===t.touchId),!r||r.identifier!==t.touchId)return}else{if(t.touchId!==null||n.pointerId!==t.pointerId)return;r=n}if(["pointercancel","pointerout","pointerleave","contextmenu"].includes(n.type)&&!(["pointercancel","contextmenu"].includes(n.type)&&(e.browser.isSafari||e.browser.isWebView)))return;t.pointerId=null,t.touchId=null;const{params:a,touches:o,rtlTranslate:l,slidesGrid:c,enabled:u}=e;if(!u||!a.simulateTouch&&n.pointerType==="mouse")return;if(t.allowTouchCallbacks&&e.emit("touchEnd",n),t.allowTouchCallbacks=!1,!t.isTouched){t.isMoved&&a.grabCursor&&e.setGrabCursor(!1),t.isMoved=!1,t.startMoving=!1;return}a.grabCursor&&t.isMoved&&t.isTouched&&(e.allowSlideNext===!0||e.allowSlidePrev===!0)&&e.setGrabCursor(!1);const f=jr(),h=f-t.touchStartTime;if(e.allowClick){const C=n.path||n.composedPath&&n.composedPath();e.updateClickedSlide(C&&C[0]||n.target,C),e.emit("tap click",n),h<300&&f-t.lastClickTime<300&&e.emit("doubleTap doubleClick",n)}if(t.lastClickTime=jr(),eg(()=>{e.destroyed||(e.allowClick=!0)}),!t.isTouched||!t.isMoved||!e.swipeDirection||o.diff===0&&!t.loopSwapReset||t.currentTranslate===t.startTranslate&&!t.loopSwapReset){t.isTouched=!1,t.isMoved=!1,t.startMoving=!1;return}t.isTouched=!1,t.isMoved=!1,t.startMoving=!1;let d;if(a.followFinger?d=l?e.translate:-e.translate:d=-t.currentTranslate,a.cssMode)return;if(a.freeMode&&a.freeMode.enabled){e.freeMode.onTouchEnd({currentPos:d});return}const g=d>=-e.maxTranslate()&&!e.params.loop;let _=0,m=e.slidesSizesGrid[0];for(let C=0;C<c.length;C+=C<a.slidesPerGroupSkip?1:a.slidesPerGroup){const D=C<a.slidesPerGroupSkip-1?1:a.slidesPerGroup;typeof c[C+D]<"u"?(g||d>=c[C]&&d<c[C+D])&&(_=C,m=c[C+D]-c[C]):(g||d>=c[C])&&(_=C,m=c[c.length-1]-c[c.length-2])}let p=null,S=null;a.rewind&&(e.isBeginning?S=a.virtual&&a.virtual.enabled&&e.virtual?e.virtual.slides.length-1:e.slides.length-1:e.isEnd&&(p=0));const v=(d-c[_])/m,x=_<a.slidesPerGroupSkip-1?1:a.slidesPerGroup;if(h>a.longSwipesMs){if(!a.longSwipes){e.slideTo(e.activeIndex);return}e.swipeDirection==="next"&&(v>=a.longSwipesRatio?e.slideTo(a.rewind&&e.isEnd?p:_+x):e.slideTo(_)),e.swipeDirection==="prev"&&(v>1-a.longSwipesRatio?e.slideTo(_+x):S!==null&&v<0&&Math.abs(v)>a.longSwipesRatio?e.slideTo(S):e.slideTo(_))}else{if(!a.shortSwipes){e.slideTo(e.activeIndex);return}e.navigation&&(n.target===e.navigation.nextEl||n.target===e.navigation.prevEl)?n.target===e.navigation.nextEl?e.slideTo(_+x):e.slideTo(_):(e.swipeDirection==="next"&&e.slideTo(p!==null?p:_+x),e.swipeDirection==="prev"&&e.slideTo(S!==null?S:_))}}function Zh(){const i=this,{params:e,el:t}=i;if(t&&t.offsetWidth===0)return;e.breakpoints&&i.setBreakpoint();const{allowSlideNext:n,allowSlidePrev:r,snapGrid:s}=i,a=i.virtual&&i.params.virtual.enabled;i.allowSlideNext=!0,i.allowSlidePrev=!0,i.updateSize(),i.updateSlides(),i.updateSlidesClasses();const o=a&&e.loop;(e.slidesPerView==="auto"||e.slidesPerView>1)&&i.isEnd&&!i.isBeginning&&!i.params.centeredSlides&&!o?i.slideTo(i.slides.length-1,0,!1,!0):i.params.loop&&!a?i.slideToLoop(i.realIndex,0,!1,!0):i.slideTo(i.activeIndex,0,!1,!0),i.autoplay&&i.autoplay.running&&i.autoplay.paused&&(clearTimeout(i.autoplay.resizeTimeout),i.autoplay.resizeTimeout=setTimeout(()=>{i.autoplay&&i.autoplay.running&&i.autoplay.paused&&i.autoplay.resume()},500)),i.allowSlidePrev=r,i.allowSlideNext=n,i.params.watchOverflow&&s!==i.snapGrid&&i.checkOverflow()}function rb(i){const e=this;e.enabled&&(e.allowClick||(e.params.preventClicks&&i.preventDefault(),e.params.preventClicksPropagation&&e.animating&&(i.stopPropagation(),i.stopImmediatePropagation())))}function sb(){const i=this,{wrapperEl:e,rtlTranslate:t,enabled:n}=i;if(!n)return;i.previousTranslate=i.translate,i.isHorizontal()?i.translate=-e.scrollLeft:i.translate=-e.scrollTop,i.translate===0&&(i.translate=0),i.updateActiveIndex(),i.updateSlidesClasses();let r;const s=i.maxTranslate()-i.minTranslate();s===0?r=0:r=(i.translate-i.minTranslate())/s,r!==i.progress&&i.updateProgress(t?-i.translate:i.translate),i.emit("setTranslate",i.translate,!1)}function ab(i){const e=this;gl(e,i.target),!(e.params.cssMode||e.params.slidesPerView!=="auto"&&!e.params.autoHeight)&&e.update()}function ob(){const i=this;i.documentTouchHandlerProceeded||(i.documentTouchHandlerProceeded=!0,i.params.touchReleaseOnEdges&&(i.el.style.touchAction="auto"))}const og=(i,e)=>{const t=xi(),{params:n,el:r,wrapperEl:s,device:a}=i,o=!!n.nested,l=e==="on"?"addEventListener":"removeEventListener",c=e;!r||typeof r=="string"||(t[l]("touchstart",i.onDocumentTouchStart,{passive:!1,capture:o}),r[l]("touchstart",i.onTouchStart,{passive:!1}),r[l]("pointerdown",i.onTouchStart,{passive:!1}),t[l]("touchmove",i.onTouchMove,{passive:!1,capture:o}),t[l]("pointermove",i.onTouchMove,{passive:!1,capture:o}),t[l]("touchend",i.onTouchEnd,{passive:!0}),t[l]("pointerup",i.onTouchEnd,{passive:!0}),t[l]("pointercancel",i.onTouchEnd,{passive:!0}),t[l]("touchcancel",i.onTouchEnd,{passive:!0}),t[l]("pointerout",i.onTouchEnd,{passive:!0}),t[l]("pointerleave",i.onTouchEnd,{passive:!0}),t[l]("contextmenu",i.onTouchEnd,{passive:!0}),(n.preventClicks||n.preventClicksPropagation)&&r[l]("click",i.onClick,!0),n.cssMode&&s[l]("scroll",i.onScroll),n.updateOnWindowResize?i[c](a.ios||a.android?"resize orientationchange observerUpdate":"resize observerUpdate",Zh,!0):i[c]("observerUpdate",Zh,!0),r[l]("load",i.onLoad,{capture:!0}))};function lb(){const i=this,{params:e}=i;i.onTouchStart=tb.bind(i),i.onTouchMove=nb.bind(i),i.onTouchEnd=ib.bind(i),i.onDocumentTouchStart=ob.bind(i),e.cssMode&&(i.onScroll=sb.bind(i)),i.onClick=rb.bind(i),i.onLoad=ab.bind(i),og(i,"on")}function cb(){og(this,"off")}var ub={attachEvents:lb,detachEvents:cb};const Kh=(i,e)=>i.grid&&e.grid&&e.grid.rows>1;function fb(){const i=this,{realIndex:e,initialized:t,params:n,el:r}=i,s=n.breakpoints;if(!s||s&&Object.keys(s).length===0)return;const a=xi(),o=n.breakpointsBase==="window"||!n.breakpointsBase?n.breakpointsBase:"container",l=["window","container"].includes(n.breakpointsBase)||!n.breakpointsBase?i.el:a.querySelector(n.breakpointsBase),c=i.getBreakpoint(s,o,l);if(!c||i.currentBreakpoint===c)return;const f=(c in s?s[c]:void 0)||i.originalParams,h=Kh(i,n),d=Kh(i,f),g=i.params.grabCursor,_=f.grabCursor,m=n.enabled;h&&!d?(r.classList.remove(`${n.containerModifierClass}grid`,`${n.containerModifierClass}grid-column`),i.emitContainerClasses()):!h&&d&&(r.classList.add(`${n.containerModifierClass}grid`),(f.grid.fill&&f.grid.fill==="column"||!f.grid.fill&&n.grid.fill==="column")&&r.classList.add(`${n.containerModifierClass}grid-column`),i.emitContainerClasses()),g&&!_?i.unsetGrabCursor():!g&&_&&i.setGrabCursor(),["navigation","pagination","scrollbar"].forEach(D=>{if(typeof f[D]>"u")return;const T=n[D]&&n[D].enabled,E=f[D]&&f[D].enabled;T&&!E&&i[D].disable(),!T&&E&&i[D].enable()});const p=f.direction&&f.direction!==n.direction,S=n.loop&&(f.slidesPerView!==n.slidesPerView||p),v=n.loop;p&&t&&i.changeDirection(),Hn(i.params,f);const x=i.params.enabled,C=i.params.loop;Object.assign(i,{allowTouchMove:i.params.allowTouchMove,allowSlideNext:i.params.allowSlideNext,allowSlidePrev:i.params.allowSlidePrev}),m&&!x?i.disable():!m&&x&&i.enable(),i.currentBreakpoint=c,i.emit("_beforeBreakpoint",f),t&&(S?(i.loopDestroy(),i.loopCreate(e),i.updateSlides()):!v&&C?(i.loopCreate(e),i.updateSlides()):v&&!C&&i.loopDestroy()),i.emit("breakpoint",f)}function db(i,e="window",t){if(!i||e==="container"&&!t)return;let n=!1;const r=Tn(),s=e==="window"?r.innerHeight:t.clientHeight,a=Object.keys(i).map(o=>{if(typeof o=="string"&&o.indexOf("@")===0){const l=parseFloat(o.substr(1));return{value:s*l,point:o}}return{value:o,point:o}});a.sort((o,l)=>parseInt(o.value,10)-parseInt(l.value,10));for(let o=0;o<a.length;o+=1){const{point:l,value:c}=a[o];e==="window"?r.matchMedia(`(min-width: ${c}px)`).matches&&(n=l):c<=t.clientWidth&&(n=l)}return n||"max"}var hb={setBreakpoint:fb,getBreakpoint:db};function pb(i,e){const t=[];return i.forEach(n=>{typeof n=="object"?Object.keys(n).forEach(r=>{n[r]&&t.push(e+r)}):typeof n=="string"&&t.push(e+n)}),t}function mb(){const i=this,{classNames:e,params:t,rtl:n,el:r,device:s}=i,a=pb(["initialized",t.direction,{"free-mode":i.params.freeMode&&t.freeMode.enabled},{autoheight:t.autoHeight},{rtl:n},{grid:t.grid&&t.grid.rows>1},{"grid-column":t.grid&&t.grid.rows>1&&t.grid.fill==="column"},{android:s.android},{ios:s.ios},{"css-mode":t.cssMode},{centered:t.cssMode&&t.centeredSlides},{"watch-progress":t.watchSlidesProgress}],t.containerModifierClass);e.push(...a),r.classList.add(...e),i.emitContainerClasses()}function gb(){const i=this,{el:e,classNames:t}=i;!e||typeof e=="string"||(e.classList.remove(...t),i.emitContainerClasses())}var _b={addClasses:mb,removeClasses:gb};function vb(){const i=this,{isLocked:e,params:t}=i,{slidesOffsetBefore:n}=t;if(n){const r=i.slides.length-1,s=i.slidesGrid[r]+i.slidesSizesGrid[r]+n*2;i.isLocked=i.size>s}else i.isLocked=i.snapGrid.length===1;t.allowSlideNext===!0&&(i.allowSlideNext=!i.isLocked),t.allowSlidePrev===!0&&(i.allowSlidePrev=!i.isLocked),e&&e!==i.isLocked&&(i.isEnd=!1),e!==i.isLocked&&i.emit(i.isLocked?"lock":"unlock")}var xb={checkOverflow:vb},mf={init:!0,direction:"horizontal",oneWayMovement:!1,swiperElementNodeName:"SWIPER-CONTAINER",touchEventsTarget:"wrapper",initialSlide:0,speed:300,cssMode:!1,updateOnWindowResize:!0,resizeObserver:!0,nested:!1,createElements:!1,eventsPrefix:"swiper",enabled:!0,focusableElements:"input, select, option, textarea, button, video, label",width:null,height:null,preventInteractionOnTransition:!1,userAgent:null,url:null,edgeSwipeDetection:!1,edgeSwipeThreshold:20,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,breakpointsBase:"window",spaceBetween:0,slidesPerView:1,slidesPerGroup:1,slidesPerGroupSkip:0,slidesPerGroupAuto:!1,centeredSlides:!1,centeredSlidesBounds:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,watchOverflow:!0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:5,touchMoveStopPropagation:!1,touchStartPreventDefault:!0,touchStartForcePreventDefault:!1,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,loop:!1,loopAddBlankSlides:!0,loopAdditionalSlides:0,loopPreventsSliding:!0,rewind:!1,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,maxBackfaceHiddenSlides:10,containerModifierClass:"swiper-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-blank",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideFullyVisibleClass:"swiper-slide-fully-visible",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",lazyPreloaderClass:"swiper-lazy-preloader",lazyPreloadPrevNext:0,runCallbacksOnInit:!0,_emitClasses:!1};function Sb(i,e){return function(n={}){const r=Object.keys(n)[0],s=n[r];if(typeof s!="object"||s===null){Hn(e,n);return}if(i[r]===!0&&(i[r]={enabled:!0}),r==="navigation"&&i[r]&&i[r].enabled&&!i[r].prevEl&&!i[r].nextEl&&(i[r].auto=!0),["pagination","scrollbar"].indexOf(r)>=0&&i[r]&&i[r].enabled&&!i[r].el&&(i[r].auto=!0),!(r in i&&"enabled"in s)){Hn(e,n);return}typeof i[r]=="object"&&!("enabled"in i[r])&&(i[r].enabled=!0),i[r]||(i[r]={enabled:!1}),Hn(e,n)}}const Zc={eventsEmitter:_T,update:AT,translate:IT,transition:BT,slide:qT,loop:ZT,grabCursor:QT,events:ub,breakpoints:hb,checkOverflow:xb,classes:_b},Kc={};class hi{constructor(...e){let t,n;e.length===1&&e[0].constructor&&Object.prototype.toString.call(e[0]).slice(8,-1)==="Object"?n=e[0]:[t,n]=e,n||(n={}),n=Hn({},n),t&&!n.el&&(n.el=t);const r=xi();if(n.el&&typeof n.el=="string"&&r.querySelectorAll(n.el).length>1){const l=[];return r.querySelectorAll(n.el).forEach(c=>{const u=Hn({},n,{el:c});l.push(new hi(u))}),l}const s=this;s.__swiper__=!0,s.support=ig(),s.device=rg({userAgent:n.userAgent}),s.browser=sg(),s.eventsListeners={},s.eventsAnyListeners=[],s.modules=[...s.__modules__],n.modules&&Array.isArray(n.modules)&&s.modules.push(...n.modules);const a={};s.modules.forEach(l=>{l({params:n,swiper:s,extendParams:Sb(n,a),on:s.on.bind(s),once:s.once.bind(s),off:s.off.bind(s),emit:s.emit.bind(s)})});const o=Hn({},mf,a);return s.params=Hn({},o,Kc,n),s.originalParams=Hn({},s.params),s.passedParams=Hn({},n),s.params&&s.params.on&&Object.keys(s.params.on).forEach(l=>{s.on(l,s.params.on[l])}),s.params&&s.params.onAny&&s.onAny(s.params.onAny),Object.assign(s,{enabled:s.params.enabled,el:t,classNames:[],slides:[],slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal(){return s.params.direction==="horizontal"},isVertical(){return s.params.direction==="vertical"},activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,cssOverflowAdjustment(){return Math.trunc(this.translate/2**23)*2**23},allowSlideNext:s.params.allowSlideNext,allowSlidePrev:s.params.allowSlidePrev,touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,focusableElements:s.params.focusableElements,lastClickTime:0,clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,startMoving:void 0,pointerId:null,touchId:null},allowClick:!0,allowTouchMove:s.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),s.emit("_swiper"),s.params.init&&s.init(),s}getDirectionLabel(e){return this.isHorizontal()?e:{width:"height","margin-top":"margin-left","margin-bottom ":"margin-right","margin-left":"margin-top","margin-right":"margin-bottom","padding-left":"padding-top","padding-right":"padding-bottom",marginRight:"marginBottom"}[e]}getSlideIndex(e){const{slidesEl:t,params:n}=this,r=gi(t,`.${n.slideClass}, swiper-slide`),s=Nl(r[0]);return Nl(e)-s}getSlideIndexByData(e){return this.getSlideIndex(this.slides.find(t=>t.getAttribute("data-swiper-slide-index")*1===e))}getSlideIndexWhenGrid(e){return this.grid&&this.params.grid&&this.params.grid.rows>1&&(this.params.grid.fill==="column"?e=Math.floor(e/this.params.grid.rows):this.params.grid.fill==="row"&&(e=e%Math.ceil(this.slides.length/this.params.grid.rows))),e}recalcSlides(){const e=this,{slidesEl:t,params:n}=e;e.slides=gi(t,`.${n.slideClass}, swiper-slide`)}enable(){const e=this;e.enabled||(e.enabled=!0,e.params.grabCursor&&e.setGrabCursor(),e.emit("enable"))}disable(){const e=this;e.enabled&&(e.enabled=!1,e.params.grabCursor&&e.unsetGrabCursor(),e.emit("disable"))}setProgress(e,t){const n=this;e=Math.min(Math.max(e,0),1);const r=n.minTranslate(),a=(n.maxTranslate()-r)*e+r;n.translateTo(a,typeof t>"u"?0:t),n.updateActiveIndex(),n.updateSlidesClasses()}emitContainerClasses(){const e=this;if(!e.params._emitClasses||!e.el)return;const t=e.el.className.split(" ").filter(n=>n.indexOf("swiper")===0||n.indexOf(e.params.containerModifierClass)===0);e.emit("_containerClasses",t.join(" "))}getSlideClasses(e){const t=this;return t.destroyed?"":e.className.split(" ").filter(n=>n.indexOf("swiper-slide")===0||n.indexOf(t.params.slideClass)===0).join(" ")}emitSlidesClasses(){const e=this;if(!e.params._emitClasses||!e.el)return;const t=[];e.slides.forEach(n=>{const r=e.getSlideClasses(n);t.push({slideEl:n,classNames:r}),e.emit("_slideClass",n,r)}),e.emit("_slideClasses",t)}slidesPerViewDynamic(e="current",t=!1){const n=this,{params:r,slides:s,slidesGrid:a,slidesSizesGrid:o,size:l,activeIndex:c}=n;let u=1;if(typeof r.slidesPerView=="number")return r.slidesPerView;if(r.centeredSlides){let f=s[c]?Math.ceil(s[c].swiperSlideSize):0,h;for(let d=c+1;d<s.length;d+=1)s[d]&&!h&&(f+=Math.ceil(s[d].swiperSlideSize),u+=1,f>l&&(h=!0));for(let d=c-1;d>=0;d-=1)s[d]&&!h&&(f+=s[d].swiperSlideSize,u+=1,f>l&&(h=!0))}else if(e==="current")for(let f=c+1;f<s.length;f+=1)(t?a[f]+o[f]-a[c]<l:a[f]-a[c]<l)&&(u+=1);else for(let f=c-1;f>=0;f-=1)a[c]-a[f]<l&&(u+=1);return u}update(){const e=this;if(!e||e.destroyed)return;const{snapGrid:t,params:n}=e;n.breakpoints&&e.setBreakpoint(),[...e.el.querySelectorAll('[loading="lazy"]')].forEach(a=>{a.complete&&gl(e,a)}),e.updateSize(),e.updateSlides(),e.updateProgress(),e.updateSlidesClasses();function r(){const a=e.rtlTranslate?e.translate*-1:e.translate,o=Math.min(Math.max(a,e.maxTranslate()),e.minTranslate());e.setTranslate(o),e.updateActiveIndex(),e.updateSlidesClasses()}let s;if(n.freeMode&&n.freeMode.enabled&&!n.cssMode)r(),n.autoHeight&&e.updateAutoHeight();else{if((n.slidesPerView==="auto"||n.slidesPerView>1)&&e.isEnd&&!n.centeredSlides){const a=e.virtual&&n.virtual.enabled?e.virtual.slides:e.slides;s=e.slideTo(a.length-1,0,!1,!0)}else s=e.slideTo(e.activeIndex,0,!1,!0);s||r()}n.watchOverflow&&t!==e.snapGrid&&e.checkOverflow(),e.emit("update")}changeDirection(e,t=!0){const n=this,r=n.params.direction;return e||(e=r==="horizontal"?"vertical":"horizontal"),e===r||e!=="horizontal"&&e!=="vertical"||(n.el.classList.remove(`${n.params.containerModifierClass}${r}`),n.el.classList.add(`${n.params.containerModifierClass}${e}`),n.emitContainerClasses(),n.params.direction=e,n.slides.forEach(s=>{e==="vertical"?s.style.width="":s.style.height=""}),n.emit("changeDirection"),t&&n.update()),n}changeLanguageDirection(e){const t=this;t.rtl&&e==="rtl"||!t.rtl&&e==="ltr"||(t.rtl=e==="rtl",t.rtlTranslate=t.params.direction==="horizontal"&&t.rtl,t.rtl?(t.el.classList.add(`${t.params.containerModifierClass}rtl`),t.el.dir="rtl"):(t.el.classList.remove(`${t.params.containerModifierClass}rtl`),t.el.dir="ltr"),t.update())}mount(e){const t=this;if(t.mounted)return!0;let n=e||t.params.el;if(typeof n=="string"&&(n=document.querySelector(n)),!n)return!1;n.swiper=t,n.parentNode&&n.parentNode.host&&n.parentNode.host.nodeName===t.params.swiperElementNodeName.toUpperCase()&&(t.isElement=!0);const r=()=>`.${(t.params.wrapperClass||"").trim().split(" ").join(".")}`;let a=n&&n.shadowRoot&&n.shadowRoot.querySelector?n.shadowRoot.querySelector(r()):gi(n,r())[0];return!a&&t.params.createElements&&(a=ro("div",t.params.wrapperClass),n.append(a),gi(n,`.${t.params.slideClass}`).forEach(o=>{a.append(o)})),Object.assign(t,{el:n,wrapperEl:a,slidesEl:t.isElement&&!n.parentNode.host.slideSlots?n.parentNode.host:a,hostEl:t.isElement?n.parentNode.host:n,mounted:!0,rtl:n.dir.toLowerCase()==="rtl"||fr(n,"direction")==="rtl",rtlTranslate:t.params.direction==="horizontal"&&(n.dir.toLowerCase()==="rtl"||fr(n,"direction")==="rtl"),wrongRTL:fr(a,"display")==="-webkit-box"}),!0}init(e){const t=this;if(t.initialized||t.mount(e)===!1)return t;t.emit("beforeInit"),t.params.breakpoints&&t.setBreakpoint(),t.addClasses(),t.updateSize(),t.updateSlides(),t.params.watchOverflow&&t.checkOverflow(),t.params.grabCursor&&t.enabled&&t.setGrabCursor(),t.params.loop&&t.virtual&&t.params.virtual.enabled?t.slideTo(t.params.initialSlide+t.virtual.slidesBefore,0,t.params.runCallbacksOnInit,!1,!0):t.slideTo(t.params.initialSlide,0,t.params.runCallbacksOnInit,!1,!0),t.params.loop&&t.loopCreate(void 0,!0),t.attachEvents();const r=[...t.el.querySelectorAll('[loading="lazy"]')];return t.isElement&&r.push(...t.hostEl.querySelectorAll('[loading="lazy"]')),r.forEach(s=>{s.complete?gl(t,s):s.addEventListener("load",a=>{gl(t,a.target)})}),pf(t),t.initialized=!0,pf(t),t.emit("init"),t.emit("afterInit"),t}destroy(e=!0,t=!0){const n=this,{params:r,el:s,wrapperEl:a,slides:o}=n;return typeof n.params>"u"||n.destroyed||(n.emit("beforeDestroy"),n.initialized=!1,n.detachEvents(),r.loop&&n.loopDestroy(),t&&(n.removeClasses(),s&&typeof s!="string"&&s.removeAttribute("style"),a&&a.removeAttribute("style"),o&&o.length&&o.forEach(l=>{l.classList.remove(r.slideVisibleClass,r.slideFullyVisibleClass,r.slideActiveClass,r.slideNextClass,r.slidePrevClass),l.removeAttribute("style"),l.removeAttribute("data-swiper-slide-index")})),n.emit("destroy"),Object.keys(n.eventsListeners).forEach(l=>{n.off(l)}),e!==!1&&(n.el&&typeof n.el!="string"&&(n.el.swiper=null),iT(n)),n.destroyed=!0),null}static extendDefaults(e){Hn(Kc,e)}static get extendedDefaults(){return Kc}static get defaults(){return mf}static installModule(e){hi.prototype.__modules__||(hi.prototype.__modules__=[]);const t=hi.prototype.__modules__;typeof e=="function"&&t.indexOf(e)<0&&t.push(e)}static use(e){return Array.isArray(e)?(e.forEach(t=>hi.installModule(t)),hi):(hi.installModule(e),hi)}}Object.keys(Zc).forEach(i=>{Object.keys(Zc[i]).forEach(e=>{hi.prototype[e]=Zc[i][e]})});hi.use([mT,gT]);const lg=["eventsPrefix","injectStyles","injectStylesUrls","modules","init","_direction","oneWayMovement","swiperElementNodeName","touchEventsTarget","initialSlide","_speed","cssMode","updateOnWindowResize","resizeObserver","nested","focusableElements","_enabled","_width","_height","preventInteractionOnTransition","userAgent","url","_edgeSwipeDetection","_edgeSwipeThreshold","_freeMode","_autoHeight","setWrapperSize","virtualTranslate","_effect","breakpoints","breakpointsBase","_spaceBetween","_slidesPerView","maxBackfaceHiddenSlides","_grid","_slidesPerGroup","_slidesPerGroupSkip","_slidesPerGroupAuto","_centeredSlides","_centeredSlidesBounds","_slidesOffsetBefore","_slidesOffsetAfter","normalizeSlideIndex","_centerInsufficientSlides","_watchOverflow","roundLengths","touchRatio","touchAngle","simulateTouch","_shortSwipes","_longSwipes","longSwipesRatio","longSwipesMs","_followFinger","allowTouchMove","_threshold","touchMoveStopPropagation","touchStartPreventDefault","touchStartForcePreventDefault","touchReleaseOnEdges","uniqueNavElements","_resistance","_resistanceRatio","_watchSlidesProgress","_grabCursor","preventClicks","preventClicksPropagation","_slideToClickedSlide","_loop","loopAdditionalSlides","loopAddBlankSlides","loopPreventsSliding","_rewind","_allowSlidePrev","_allowSlideNext","_swipeHandler","_noSwiping","noSwipingClass","noSwipingSelector","passiveListeners","containerModifierClass","slideClass","slideActiveClass","slideVisibleClass","slideFullyVisibleClass","slideNextClass","slidePrevClass","slideBlankClass","wrapperClass","lazyPreloaderClass","lazyPreloadPrevNext","runCallbacksOnInit","observer","observeParents","observeSlideChildren","a11y","_autoplay","_controller","coverflowEffect","cubeEffect","fadeEffect","flipEffect","creativeEffect","cardsEffect","hashNavigation","history","keyboard","mousewheel","_navigation","_pagination","parallax","_scrollbar","_thumbs","virtual","zoom","control"];function rs(i){return typeof i=="object"&&i!==null&&i.constructor&&Object.prototype.toString.call(i).slice(8,-1)==="Object"&&!i.__swiper__}function _l(i,e){const t=["__proto__","constructor","prototype"];Object.keys(e).filter(n=>t.indexOf(n)<0).forEach(n=>{typeof i[n]>"u"?i[n]=e[n]:rs(e[n])&&rs(i[n])&&Object.keys(e[n]).length>0?e[n].__swiper__?i[n]=e[n]:_l(i[n],e[n]):i[n]=e[n]})}function yb(i={}){return i.navigation&&typeof i.navigation.nextEl>"u"&&typeof i.navigation.prevEl>"u"}function Mb(i={}){return i.pagination&&typeof i.pagination.el>"u"}function Eb(i={}){return i.scrollbar&&typeof i.scrollbar.el>"u"}function lD(i=""){const e=i.split(" ").map(n=>n.trim()).filter(n=>!!n),t=[];return e.forEach(n=>{t.indexOf(n)<0&&t.push(n)}),t.join(" ")}function cD(i=""){return i?i.includes("swiper-wrapper")?i:`swiper-wrapper ${i}`:"swiper-wrapper"}function uD({swiper:i,slides:e,passedParams:t,changedParams:n,nextEl:r,prevEl:s,scrollbarEl:a,paginationEl:o}){const l=n.filter(E=>E!=="children"&&E!=="direction"&&E!=="wrapperClass"),{params:c,pagination:u,navigation:f,scrollbar:h,virtual:d,thumbs:g}=i;let _,m,p,S,v,x,C,D;n.includes("thumbs")&&t.thumbs&&t.thumbs.swiper&&!t.thumbs.swiper.destroyed&&c.thumbs&&(!c.thumbs.swiper||c.thumbs.swiper.destroyed)&&(_=!0),n.includes("controller")&&t.controller&&t.controller.control&&c.controller&&!c.controller.control&&(m=!0),n.includes("pagination")&&t.pagination&&(t.pagination.el||o)&&(c.pagination||c.pagination===!1)&&u&&!u.el&&(p=!0),n.includes("scrollbar")&&t.scrollbar&&(t.scrollbar.el||a)&&(c.scrollbar||c.scrollbar===!1)&&h&&!h.el&&(S=!0),n.includes("navigation")&&t.navigation&&(t.navigation.prevEl||s)&&(t.navigation.nextEl||r)&&(c.navigation||c.navigation===!1)&&f&&!f.prevEl&&!f.nextEl&&(v=!0);const T=E=>{i[E]&&(i[E].destroy(),E==="navigation"?(i.isElement&&(i[E].prevEl.remove(),i[E].nextEl.remove()),c[E].prevEl=void 0,c[E].nextEl=void 0,i[E].prevEl=void 0,i[E].nextEl=void 0):(i.isElement&&i[E].el.remove(),c[E].el=void 0,i[E].el=void 0))};n.includes("loop")&&i.isElement&&(c.loop&&!t.loop?x=!0:!c.loop&&t.loop?C=!0:D=!0),l.forEach(E=>{if(rs(c[E])&&rs(t[E]))Object.assign(c[E],t[E]),(E==="navigation"||E==="pagination"||E==="scrollbar")&&"enabled"in t[E]&&!t[E].enabled&&T(E);else{const M=t[E];(M===!0||M===!1)&&(E==="navigation"||E==="pagination"||E==="scrollbar")?M===!1&&T(E):c[E]=t[E]}}),l.includes("controller")&&!m&&i.controller&&i.controller.control&&c.controller&&c.controller.control&&(i.controller.control=c.controller.control),n.includes("children")&&e&&d&&c.virtual.enabled?(d.slides=e,d.update(!0)):n.includes("virtual")&&d&&c.virtual.enabled&&(e&&(d.slides=e),d.update(!0)),n.includes("children")&&e&&c.loop&&(D=!0),_&&g.init()&&g.update(!0),m&&(i.controller.control=c.controller.control),p&&(i.isElement&&(!o||typeof o=="string")&&(o=document.createElement("div"),o.classList.add("swiper-pagination"),o.part.add("pagination"),i.el.appendChild(o)),o&&(c.pagination.el=o),u.init(),u.render(),u.update()),S&&(i.isElement&&(!a||typeof a=="string")&&(a=document.createElement("div"),a.classList.add("swiper-scrollbar"),a.part.add("scrollbar"),i.el.appendChild(a)),a&&(c.scrollbar.el=a),h.init(),h.updateSize(),h.setTranslate()),v&&(i.isElement&&((!r||typeof r=="string")&&(r=document.createElement("div"),r.classList.add("swiper-button-next"),so(r,i.hostEl.constructor.nextButtonSvg),r.part.add("button-next"),i.el.appendChild(r)),(!s||typeof s=="string")&&(s=document.createElement("div"),s.classList.add("swiper-button-prev"),so(s,i.hostEl.constructor.prevButtonSvg),s.part.add("button-prev"),i.el.appendChild(s))),r&&(c.navigation.nextEl=r),s&&(c.navigation.prevEl=s),f.init(),f.update()),n.includes("allowSlideNext")&&(i.allowSlideNext=t.allowSlideNext),n.includes("allowSlidePrev")&&(i.allowSlidePrev=t.allowSlidePrev),n.includes("direction")&&i.changeDirection(t.direction,!1),(x||D)&&i.loopDestroy(),(C||D)&&i.loopCreate(),i.update()}function fD(i={},e=!0){const t={on:{}},n={},r={};_l(t,mf),t._emitClasses=!0,t.init=!1;const s={},a=lg.map(l=>l.replace(/_/,"")),o=Object.assign({},i);return Object.keys(o).forEach(l=>{typeof i[l]>"u"||(a.indexOf(l)>=0?rs(i[l])?(t[l]={},r[l]={},_l(t[l],i[l]),_l(r[l],i[l])):(t[l]=i[l],r[l]=i[l]):l.search(/on[A-Z]/)===0&&typeof i[l]=="function"?e?n[`${l[2].toLowerCase()}${l.substr(3)}`]=i[l]:t.on[`${l[2].toLowerCase()}${l.substr(3)}`]=i[l]:s[l]=i[l])}),["navigation","pagination","scrollbar"].forEach(l=>{t[l]===!0&&(t[l]={}),t[l]===!1&&delete t[l]}),{params:t,passedParams:r,rest:s,events:n}}function dD({el:i,nextEl:e,prevEl:t,paginationEl:n,scrollbarEl:r,swiper:s},a){yb(a)&&e&&t&&(s.params.navigation.nextEl=e,s.originalParams.navigation.nextEl=e,s.params.navigation.prevEl=t,s.originalParams.navigation.prevEl=t),Mb(a)&&n&&(s.params.pagination.el=n,s.originalParams.pagination.el=n),Eb(a)&&r&&(s.params.scrollbar.el=r,s.originalParams.scrollbar.el=r),s.init(i)}function hD(i,e,t,n,r){const s=[];if(!e)return s;const a=l=>{s.indexOf(l)<0&&s.push(l)};if(t&&n){const l=n.map(r),c=t.map(r);l.join("")!==c.join("")&&a("children"),n.length!==t.length&&a("children")}return lg.filter(l=>l[0]==="_").map(l=>l.replace(/_/,"")).forEach(l=>{if(l in i&&l in e)if(rs(i[l])&&rs(e[l])){const c=Object.keys(i[l]),u=Object.keys(e[l]);c.length!==u.length?a(l):(c.forEach(f=>{i[l][f]!==e[l][f]&&a(l)}),u.forEach(f=>{i[l][f]!==e[l][f]&&a(l)}))}else i[l]!==e[l]&&a(l)}),s}const pD=i=>{!i||i.destroyed||!i.params.virtual||i.params.virtual&&!i.params.virtual.enabled||(i.updateSlides(),i.updateProgress(),i.updateSlidesClasses(),i.emit("_virtualUpdated"),i.parallax&&i.params.parallax&&i.params.parallax.enabled&&i.parallax.setTranslate())};function cg(i,e,t,n){return i.params.createElements&&Object.keys(n).forEach(r=>{if(!t[r]&&t.auto===!0){let s=gi(i.el,`.${n[r]}`)[0];s||(s=ro("div",n[r]),s.className=n[r],i.el.append(s)),t[r]=s,e[r]=s}}),t}const Tb='<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/></svg>';function mD({swiper:i,extendParams:e,on:t,emit:n}){e({navigation:{nextEl:null,prevEl:null,addIcons:!0,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock",navigationDisabledClass:"swiper-navigation-disabled"}}),i.navigation={nextEl:null,prevEl:null};function r(d){let g;return d&&typeof d=="string"&&i.isElement&&(g=i.el.querySelector(d)||i.hostEl.querySelector(d),g)?g:(d&&(typeof d=="string"&&(g=[...document.querySelectorAll(d)]),i.params.uniqueNavElements&&typeof d=="string"&&g&&g.length>1&&i.el.querySelectorAll(d).length===1?g=i.el.querySelector(d):g&&g.length===1&&(g=g[0])),d&&!g?d:g)}function s(d,g){const _=i.params.navigation;d=Qt(d),d.forEach(m=>{m&&(m.classList[g?"add":"remove"](..._.disabledClass.split(" ")),m.tagName==="BUTTON"&&(m.disabled=g),i.params.watchOverflow&&i.enabled&&m.classList[i.isLocked?"add":"remove"](_.lockClass))})}function a(){const{nextEl:d,prevEl:g}=i.navigation;if(i.params.loop){s(g,!1),s(d,!1);return}s(g,i.isBeginning&&!i.params.rewind),s(d,i.isEnd&&!i.params.rewind)}function o(d){d.preventDefault(),!(i.isBeginning&&!i.params.loop&&!i.params.rewind)&&(i.slidePrev(),n("navigationPrev"))}function l(d){d.preventDefault(),!(i.isEnd&&!i.params.loop&&!i.params.rewind)&&(i.slideNext(),n("navigationNext"))}function c(){const d=i.params.navigation;if(i.params.navigation=cg(i,i.originalParams.navigation,i.params.navigation,{nextEl:"swiper-button-next",prevEl:"swiper-button-prev"}),!(d.nextEl||d.prevEl))return;let g=r(d.nextEl),_=r(d.prevEl);Object.assign(i.navigation,{nextEl:g,prevEl:_}),g=Qt(g),_=Qt(_);const m=(p,S)=>{if(p){if(d.addIcons&&p.matches(".swiper-button-next,.swiper-button-prev")&&!p.querySelector("svg")){const v=document.createElement("div");so(v,Tb),p.appendChild(v.querySelector("svg")),v.remove()}p.addEventListener("click",S==="next"?l:o)}!i.enabled&&p&&p.classList.add(...d.lockClass.split(" "))};g.forEach(p=>m(p,"next")),_.forEach(p=>m(p,"prev"))}function u(){let{nextEl:d,prevEl:g}=i.navigation;d=Qt(d),g=Qt(g);const _=(m,p)=>{m.removeEventListener("click",p==="next"?l:o),m.classList.remove(...i.params.navigation.disabledClass.split(" "))};d.forEach(m=>_(m,"next")),g.forEach(m=>_(m,"prev"))}t("init",()=>{i.params.navigation.enabled===!1?h():(c(),a())}),t("toEdge fromEdge lock unlock",()=>{a()}),t("destroy",()=>{u()}),t("enable disable",()=>{let{nextEl:d,prevEl:g}=i.navigation;if(d=Qt(d),g=Qt(g),i.enabled){a();return}[...d,...g].filter(_=>!!_).forEach(_=>_.classList.add(i.params.navigation.lockClass))}),t("click",(d,g)=>{let{nextEl:_,prevEl:m}=i.navigation;_=Qt(_),m=Qt(m);const p=g.target;let S=m.includes(p)||_.includes(p);if(i.isElement&&!S){const v=g.path||g.composedPath&&g.composedPath();v&&(S=v.find(x=>_.includes(x)||m.includes(x)))}if(i.params.navigation.hideOnClick&&!S){if(i.pagination&&i.params.pagination&&i.params.pagination.clickable&&(i.pagination.el===p||i.pagination.el.contains(p)))return;let v;_.length?v=_[0].classList.contains(i.params.navigation.hiddenClass):m.length&&(v=m[0].classList.contains(i.params.navigation.hiddenClass)),n(v===!0?"navigationShow":"navigationHide"),[..._,...m].filter(x=>!!x).forEach(x=>x.classList.toggle(i.params.navigation.hiddenClass))}});const f=()=>{i.el.classList.remove(...i.params.navigation.navigationDisabledClass.split(" ")),c(),a()},h=()=>{i.el.classList.add(...i.params.navigation.navigationDisabledClass.split(" ")),u()};Object.assign(i.navigation,{enable:f,disable:h,update:a,init:c,destroy:u})}function ma(i=""){return`.${i.trim().replace(/([\.:!+\/()[\]])/g,"\\$1").replace(/ /g,".")}`}function gD({swiper:i,extendParams:e,on:t,emit:n}){const r="swiper-pagination";e({pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:p=>p,formatFractionTotal:p=>p,bulletClass:`${r}-bullet`,bulletActiveClass:`${r}-bullet-active`,modifierClass:`${r}-`,currentClass:`${r}-current`,totalClass:`${r}-total`,hiddenClass:`${r}-hidden`,progressbarFillClass:`${r}-progressbar-fill`,progressbarOppositeClass:`${r}-progressbar-opposite`,clickableClass:`${r}-clickable`,lockClass:`${r}-lock`,horizontalClass:`${r}-horizontal`,verticalClass:`${r}-vertical`,paginationDisabledClass:`${r}-disabled`}}),i.pagination={el:null,bullets:[]};let s,a=0;function o(){return!i.params.pagination.el||!i.pagination.el||Array.isArray(i.pagination.el)&&i.pagination.el.length===0}function l(p,S){const{bulletActiveClass:v}=i.params.pagination;p&&(p=p[`${S==="prev"?"previous":"next"}ElementSibling`],p&&(p.classList.add(`${v}-${S}`),p=p[`${S==="prev"?"previous":"next"}ElementSibling`],p&&p.classList.add(`${v}-${S}-${S}`)))}function c(p,S,v){if(p=p%v,S=S%v,S===p+1)return"next";if(S===p-1)return"previous"}function u(p){const S=p.target.closest(ma(i.params.pagination.bulletClass));if(!S)return;p.preventDefault();const v=Nl(S)*i.params.slidesPerGroup;if(i.params.loop){if(i.realIndex===v)return;const x=c(i.realIndex,v,i.slides.length);x==="next"?i.slideNext():x==="previous"?i.slidePrev():i.slideToLoop(v)}else i.slideTo(v)}function f(){const p=i.rtl,S=i.params.pagination;if(o())return;let v=i.pagination.el;v=Qt(v);let x,C;const D=i.virtual&&i.params.virtual.enabled?i.virtual.slides.length:i.slides.length,T=i.params.loop?Math.ceil(D/i.params.slidesPerGroup):i.snapGrid.length;if(i.params.loop?(C=i.previousRealIndex||0,x=i.params.slidesPerGroup>1?Math.floor(i.realIndex/i.params.slidesPerGroup):i.realIndex):typeof i.snapIndex<"u"?(x=i.snapIndex,C=i.previousSnapIndex):(C=i.previousIndex||0,x=i.activeIndex||0),S.type==="bullets"&&i.pagination.bullets&&i.pagination.bullets.length>0){const E=i.pagination.bullets;let M,y,w;if(S.dynamicBullets&&(s=hf(E[0],i.isHorizontal()?"width":"height"),v.forEach(I=>{I.style[i.isHorizontal()?"width":"height"]=`${s*(S.dynamicMainBullets+4)}px`}),S.dynamicMainBullets>1&&C!==void 0&&(a+=x-(C||0),a>S.dynamicMainBullets-1?a=S.dynamicMainBullets-1:a<0&&(a=0)),M=Math.max(x-a,0),y=M+(Math.min(E.length,S.dynamicMainBullets)-1),w=(y+M)/2),E.forEach(I=>{const U=[...["","-next","-next-next","-prev","-prev-prev","-main"].map(V=>`${S.bulletActiveClass}${V}`)].map(V=>typeof V=="string"&&V.includes(" ")?V.split(" "):V).flat();I.classList.remove(...U)}),v.length>1)E.forEach(I=>{const U=Nl(I);U===x?I.classList.add(...S.bulletActiveClass.split(" ")):i.isElement&&I.setAttribute("part","bullet"),S.dynamicBullets&&(U>=M&&U<=y&&I.classList.add(...`${S.bulletActiveClass}-main`.split(" ")),U===M&&l(I,"prev"),U===y&&l(I,"next"))});else{const I=E[x];if(I&&I.classList.add(...S.bulletActiveClass.split(" ")),i.isElement&&E.forEach((U,V)=>{U.setAttribute("part",V===x?"bullet-active":"bullet")}),S.dynamicBullets){const U=E[M],V=E[y];for(let q=M;q<=y;q+=1)E[q]&&E[q].classList.add(...`${S.bulletActiveClass}-main`.split(" "));l(U,"prev"),l(V,"next")}}if(S.dynamicBullets){const I=Math.min(E.length,S.dynamicMainBullets+4),U=(s*I-s)/2-w*s,V=p?"right":"left";E.forEach(q=>{q.style[i.isHorizontal()?V:"top"]=`${U}px`})}}v.forEach((E,M)=>{if(S.type==="fraction"&&(E.querySelectorAll(ma(S.currentClass)).forEach(y=>{y.textContent=S.formatFractionCurrent(x+1)}),E.querySelectorAll(ma(S.totalClass)).forEach(y=>{y.textContent=S.formatFractionTotal(T)})),S.type==="progressbar"){let y;S.progressbarOpposite?y=i.isHorizontal()?"vertical":"horizontal":y=i.isHorizontal()?"horizontal":"vertical";const w=(x+1)/T;let I=1,U=1;y==="horizontal"?I=w:U=w,E.querySelectorAll(ma(S.progressbarFillClass)).forEach(V=>{V.style.transform=`translate3d(0,0,0) scaleX(${I}) scaleY(${U})`,V.style.transitionDuration=`${i.params.speed}ms`})}S.type==="custom"&&S.renderCustom?(so(E,S.renderCustom(i,x+1,T)),M===0&&n("paginationRender",E)):(M===0&&n("paginationRender",E),n("paginationUpdate",E)),i.params.watchOverflow&&i.enabled&&E.classList[i.isLocked?"add":"remove"](S.lockClass)})}function h(){const p=i.params.pagination;if(o())return;const S=i.virtual&&i.params.virtual.enabled?i.virtual.slides.length:i.grid&&i.params.grid.rows>1?i.slides.length/Math.ceil(i.params.grid.rows):i.slides.length;let v=i.pagination.el;v=Qt(v);let x="";if(p.type==="bullets"){let C=i.params.loop?Math.ceil(S/i.params.slidesPerGroup):i.snapGrid.length;i.params.freeMode&&i.params.freeMode.enabled&&C>S&&(C=S);for(let D=0;D<C;D+=1)p.renderBullet?x+=p.renderBullet.call(i,D,p.bulletClass):x+=`<${p.bulletElement} ${i.isElement?'part="bullet"':""} class="${p.bulletClass}"></${p.bulletElement}>`}p.type==="fraction"&&(p.renderFraction?x=p.renderFraction.call(i,p.currentClass,p.totalClass):x=`<span class="${p.currentClass}"></span> / <span class="${p.totalClass}"></span>`),p.type==="progressbar"&&(p.renderProgressbar?x=p.renderProgressbar.call(i,p.progressbarFillClass):x=`<span class="${p.progressbarFillClass}"></span>`),i.pagination.bullets=[],v.forEach(C=>{p.type!=="custom"&&so(C,x||""),p.type==="bullets"&&i.pagination.bullets.push(...C.querySelectorAll(ma(p.bulletClass)))}),p.type!=="custom"&&n("paginationRender",v[0])}function d(){i.params.pagination=cg(i,i.originalParams.pagination,i.params.pagination,{el:"swiper-pagination"});const p=i.params.pagination;if(!p.el)return;let S;typeof p.el=="string"&&i.isElement&&(S=i.el.querySelector(p.el)),!S&&typeof p.el=="string"&&(S=[...document.querySelectorAll(p.el)]),S||(S=p.el),!(!S||S.length===0)&&(i.params.uniqueNavElements&&typeof p.el=="string"&&Array.isArray(S)&&S.length>1&&(S=[...i.el.querySelectorAll(p.el)],S.length>1&&(S=S.find(v=>ng(v,".swiper")[0]===i.el))),Array.isArray(S)&&S.length===1&&(S=S[0]),Object.assign(i.pagination,{el:S}),S=Qt(S),S.forEach(v=>{p.type==="bullets"&&p.clickable&&v.classList.add(...(p.clickableClass||"").split(" ")),v.classList.add(p.modifierClass+p.type),v.classList.add(i.isHorizontal()?p.horizontalClass:p.verticalClass),p.type==="bullets"&&p.dynamicBullets&&(v.classList.add(`${p.modifierClass}${p.type}-dynamic`),a=0,p.dynamicMainBullets<1&&(p.dynamicMainBullets=1)),p.type==="progressbar"&&p.progressbarOpposite&&v.classList.add(p.progressbarOppositeClass),p.clickable&&v.addEventListener("click",u),i.enabled||v.classList.add(p.lockClass)}))}function g(){const p=i.params.pagination;if(o())return;let S=i.pagination.el;S&&(S=Qt(S),S.forEach(v=>{v.classList.remove(p.hiddenClass),v.classList.remove(p.modifierClass+p.type),v.classList.remove(i.isHorizontal()?p.horizontalClass:p.verticalClass),p.clickable&&(v.classList.remove(...(p.clickableClass||"").split(" ")),v.removeEventListener("click",u))})),i.pagination.bullets&&i.pagination.bullets.forEach(v=>v.classList.remove(...p.bulletActiveClass.split(" ")))}t("changeDirection",()=>{if(!i.pagination||!i.pagination.el)return;const p=i.params.pagination;let{el:S}=i.pagination;S=Qt(S),S.forEach(v=>{v.classList.remove(p.horizontalClass,p.verticalClass),v.classList.add(i.isHorizontal()?p.horizontalClass:p.verticalClass)})}),t("init",()=>{i.params.pagination.enabled===!1?m():(d(),h(),f())}),t("activeIndexChange",()=>{typeof i.snapIndex>"u"&&f()}),t("snapIndexChange",()=>{f()}),t("snapGridLengthChange",()=>{h(),f()}),t("destroy",()=>{g()}),t("enable disable",()=>{let{el:p}=i.pagination;p&&(p=Qt(p),p.forEach(S=>S.classList[i.enabled?"remove":"add"](i.params.pagination.lockClass)))}),t("lock unlock",()=>{f()}),t("click",(p,S)=>{const v=S.target,x=Qt(i.pagination.el);if(i.params.pagination.el&&i.params.pagination.hideOnClick&&x&&x.length>0&&!v.classList.contains(i.params.pagination.bulletClass)){if(i.navigation&&(i.navigation.nextEl&&v===i.navigation.nextEl||i.navigation.prevEl&&v===i.navigation.prevEl))return;const C=x[0].classList.contains(i.params.pagination.hiddenClass);n(C===!0?"paginationShow":"paginationHide"),x.forEach(D=>D.classList.toggle(i.params.pagination.hiddenClass))}});const _=()=>{i.el.classList.remove(i.params.pagination.paginationDisabledClass);let{el:p}=i.pagination;p&&(p=Qt(p),p.forEach(S=>S.classList.remove(i.params.pagination.paginationDisabledClass))),d(),h(),f()},m=()=>{i.el.classList.add(i.params.pagination.paginationDisabledClass);let{el:p}=i.pagination;p&&(p=Qt(p),p.forEach(S=>S.classList.add(i.params.pagination.paginationDisabledClass))),g()};Object.assign(i.pagination,{enable:_,disable:m,render:h,update:f,init:d,destroy:g})}function _D({swiper:i,extendParams:e,on:t,emit:n,params:r}){i.autoplay={running:!1,paused:!1,timeLeft:0},e({autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!1,stopOnLastSlide:!1,reverseDirection:!1,pauseOnMouseEnter:!1}});let s,a,o=r&&r.autoplay?r.autoplay.delay:3e3,l=r&&r.autoplay?r.autoplay.delay:3e3,c,u=new Date().getTime(),f,h,d,g,_,m,p;function S(H){!i||i.destroyed||!i.wrapperEl||H.target===i.wrapperEl&&(i.wrapperEl.removeEventListener("transitionend",S),!(p||H.detail&&H.detail.bySwiperTouchMove)&&M())}const v=()=>{if(i.destroyed||!i.autoplay.running)return;i.autoplay.paused?f=!0:f&&(l=c,f=!1);const H=i.autoplay.paused?c:u+l-new Date().getTime();i.autoplay.timeLeft=H,n("autoplayTimeLeft",H,H/o),a=requestAnimationFrame(()=>{v()})},x=()=>{let H;return i.virtual&&i.params.virtual.enabled?H=i.slides.find(Q=>Q.classList.contains("swiper-slide-active")):H=i.slides[i.activeIndex],H?parseInt(H.getAttribute("data-swiper-autoplay"),10):void 0},C=H=>{if(i.destroyed||!i.autoplay.running)return;cancelAnimationFrame(a),v();let N=typeof H>"u"?i.params.autoplay.delay:H;o=i.params.autoplay.delay,l=i.params.autoplay.delay;const Q=x();!Number.isNaN(Q)&&Q>0&&typeof H>"u"&&(N=Q,o=Q,l=Q),c=N;const L=i.params.speed,ae=()=>{!i||i.destroyed||(i.params.autoplay.reverseDirection?!i.isBeginning||i.params.loop||i.params.rewind?(i.slidePrev(L,!0,!0),n("autoplay")):i.params.autoplay.stopOnLastSlide||(i.slideTo(i.slides.length-1,L,!0,!0),n("autoplay")):!i.isEnd||i.params.loop||i.params.rewind?(i.slideNext(L,!0,!0),n("autoplay")):i.params.autoplay.stopOnLastSlide||(i.slideTo(0,L,!0,!0),n("autoplay")),i.params.cssMode&&(u=new Date().getTime(),requestAnimationFrame(()=>{C()})))};return N>0?(clearTimeout(s),s=setTimeout(()=>{ae()},N)):requestAnimationFrame(()=>{ae()}),N},D=()=>{u=new Date().getTime(),i.autoplay.running=!0,C(),n("autoplayStart")},T=()=>{i.autoplay.running=!1,clearTimeout(s),cancelAnimationFrame(a),n("autoplayStop")},E=(H,N)=>{if(i.destroyed||!i.autoplay.running)return;clearTimeout(s),H||(m=!0);const Q=()=>{n("autoplayPause"),i.params.autoplay.waitForTransition?i.wrapperEl.addEventListener("transitionend",S):M()};if(i.autoplay.paused=!0,N){_&&(c=i.params.autoplay.delay),_=!1,Q();return}c=(c||i.params.autoplay.delay)-(new Date().getTime()-u),!(i.isEnd&&c<0&&!i.params.loop)&&(c<0&&(c=0),Q())},M=()=>{i.isEnd&&c<0&&!i.params.loop||i.destroyed||!i.autoplay.running||(u=new Date().getTime(),m?(m=!1,C(c)):C(),i.autoplay.paused=!1,n("autoplayResume"))},y=()=>{if(i.destroyed||!i.autoplay.running)return;const H=xi();H.visibilityState==="hidden"&&(m=!0,E(!0)),H.visibilityState==="visible"&&M()},w=H=>{H.pointerType==="mouse"&&(m=!0,p=!0,!(i.animating||i.autoplay.paused)&&E(!0))},I=H=>{H.pointerType==="mouse"&&(p=!1,i.autoplay.paused&&M())},U=()=>{i.params.autoplay.pauseOnMouseEnter&&(i.el.addEventListener("pointerenter",w),i.el.addEventListener("pointerleave",I))},V=()=>{i.el&&typeof i.el!="string"&&(i.el.removeEventListener("pointerenter",w),i.el.removeEventListener("pointerleave",I))},q=()=>{xi().addEventListener("visibilitychange",y)},X=()=>{xi().removeEventListener("visibilitychange",y)};t("init",()=>{i.params.autoplay.enabled&&(U(),q(),D())}),t("destroy",()=>{V(),X(),i.autoplay.running&&T()}),t("_freeModeStaticRelease",()=>{(d||m)&&M()}),t("_freeModeNoMomentumRelease",()=>{i.params.autoplay.disableOnInteraction?T():E(!0,!0)}),t("beforeTransitionStart",(H,N,Q)=>{i.destroyed||!i.autoplay.running||(Q||!i.params.autoplay.disableOnInteraction?E(!0,!0):T())}),t("sliderFirstMove",()=>{if(!(i.destroyed||!i.autoplay.running)){if(i.params.autoplay.disableOnInteraction){T();return}h=!0,d=!1,m=!1,g=setTimeout(()=>{m=!0,d=!0,E(!0)},200)}}),t("touchEnd",()=>{if(!(i.destroyed||!i.autoplay.running||!h)){if(clearTimeout(g),clearTimeout(s),i.params.autoplay.disableOnInteraction){d=!1,h=!1;return}d&&i.params.cssMode&&M(),d=!1,h=!1}}),t("slideChange",()=>{i.destroyed||!i.autoplay.running||(_=!0)}),Object.assign(i.autoplay,{start:D,stop:T,pause:E,resume:M})}function vD({swiper:i,extendParams:e,on:t}){e({thumbs:{swiper:null,multipleActiveThumbs:!0,autoScrollOffset:0,slideThumbActiveClass:"swiper-slide-thumb-active",thumbsContainerClass:"swiper-thumbs"}});let n=!1,r=!1;i.thumbs={swiper:null};function s(){const l=i.thumbs.swiper;if(!l||l.destroyed)return;const c=l.clickedIndex,u=l.clickedSlide;if(u&&u.classList.contains(i.params.thumbs.slideThumbActiveClass)||typeof c>"u"||c===null)return;let f;l.params.loop?f=parseInt(l.clickedSlide.getAttribute("data-swiper-slide-index"),10):f=c,i.params.loop?i.slideToLoop(f):i.slideTo(f)}function a(){const{thumbs:l}=i.params;if(n)return!1;n=!0;const c=i.constructor;if(l.swiper instanceof c){if(l.swiper.destroyed)return n=!1,!1;i.thumbs.swiper=l.swiper,Object.assign(i.thumbs.swiper.originalParams,{watchSlidesProgress:!0,slideToClickedSlide:!1}),Object.assign(i.thumbs.swiper.params,{watchSlidesProgress:!0,slideToClickedSlide:!1}),i.thumbs.swiper.update()}else if(Ma(l.swiper)){const u=Object.assign({},l.swiper);Object.assign(u,{watchSlidesProgress:!0,slideToClickedSlide:!1}),i.thumbs.swiper=new c(u),r=!0}return i.thumbs.swiper.el.classList.add(i.params.thumbs.thumbsContainerClass),i.thumbs.swiper.on("tap",s),!0}function o(l){const c=i.thumbs.swiper;if(!c||c.destroyed)return;const u=c.params.slidesPerView==="auto"?c.slidesPerViewDynamic():c.params.slidesPerView;let f=1;const h=i.params.thumbs.slideThumbActiveClass;if(i.params.slidesPerView>1&&!i.params.centeredSlides&&(f=i.params.slidesPerView),i.params.thumbs.multipleActiveThumbs||(f=1),f=Math.floor(f),c.slides.forEach(_=>_.classList.remove(h)),c.params.loop||c.params.virtual&&c.params.virtual.enabled)for(let _=0;_<f;_+=1)gi(c.slidesEl,`[data-swiper-slide-index="${i.realIndex+_}"]`).forEach(m=>{m.classList.add(h)});else for(let _=0;_<f;_+=1)c.slides[i.realIndex+_]&&c.slides[i.realIndex+_].classList.add(h);const d=i.params.thumbs.autoScrollOffset,g=d&&!c.params.loop;if(i.realIndex!==c.realIndex||g){const _=c.activeIndex;let m,p;if(c.params.loop){const S=c.slides.find(v=>v.getAttribute("data-swiper-slide-index")===`${i.realIndex}`);m=c.slides.indexOf(S),p=i.activeIndex>i.previousIndex?"next":"prev"}else m=i.realIndex,p=m>i.previousIndex?"next":"prev";g&&(m+=p==="next"?d:-1*d),c.visibleSlidesIndexes&&c.visibleSlidesIndexes.indexOf(m)<0&&(c.params.centeredSlides?m>_?m=m-Math.floor(u/2)+1:m=m+Math.floor(u/2)-1:m>_&&c.params.slidesPerGroup,c.slideTo(m,l?0:void 0))}}t("beforeInit",()=>{const{thumbs:l}=i.params;if(!(!l||!l.swiper))if(typeof l.swiper=="string"||l.swiper instanceof HTMLElement){const c=xi(),u=()=>{const h=typeof l.swiper=="string"?c.querySelector(l.swiper):l.swiper;if(h&&h.swiper)l.swiper=h.swiper,a(),o(!0);else if(h){const d=`${i.params.eventsPrefix}init`,g=_=>{l.swiper=_.detail[0],h.removeEventListener(d,g),a(),o(!0),l.swiper.update(),i.update()};h.addEventListener(d,g)}return h},f=()=>{if(i.destroyed)return;u()||requestAnimationFrame(f)};requestAnimationFrame(f)}else a(),o(!0)}),t("slideChange update resize observerUpdate",()=>{o()}),t("setTransition",(l,c)=>{const u=i.thumbs.swiper;!u||u.destroyed||u.setTransition(c)}),t("beforeDestroy",()=>{const l=i.thumbs.swiper;!l||l.destroyed||r&&l.destroy()}),Object.assign(i.thumbs,{init:a,update:o})}function xD({swiper:i,extendParams:e,emit:t,once:n}){e({freeMode:{enabled:!1,momentum:!0,momentumRatio:1,momentumBounce:!0,momentumBounceRatio:1,momentumVelocityRatio:1,sticky:!1,minimumVelocity:.02}});function r(){if(i.params.cssMode)return;const o=i.getTranslate();i.setTranslate(o),i.setTransition(0),i.touchEventsData.velocities.length=0,i.freeMode.onTouchEnd({currentPos:i.rtl?i.translate:-i.translate})}function s(){if(i.params.cssMode)return;const{touchEventsData:o,touches:l}=i;o.velocities.length===0&&o.velocities.push({position:l[i.isHorizontal()?"startX":"startY"],time:o.touchStartTime}),o.velocities.push({position:l[i.isHorizontal()?"currentX":"currentY"],time:jr()})}function a({currentPos:o}){if(i.params.cssMode)return;const{params:l,wrapperEl:c,rtlTranslate:u,snapGrid:f,touchEventsData:h}=i,g=jr()-h.touchStartTime;if(o<-i.minTranslate()){i.slideTo(i.activeIndex);return}if(o>-i.maxTranslate()){i.slides.length<f.length?i.slideTo(f.length-1):i.slideTo(i.slides.length-1);return}if(l.freeMode.momentum){if(h.velocities.length>1){const D=h.velocities.pop(),T=h.velocities.pop(),E=D.position-T.position,M=D.time-T.time;i.velocity=E/M,i.velocity/=2,Math.abs(i.velocity)<l.freeMode.minimumVelocity&&(i.velocity=0),(M>150||jr()-D.time>300)&&(i.velocity=0)}else i.velocity=0;i.velocity*=l.freeMode.momentumVelocityRatio,h.velocities.length=0;let _=1e3*l.freeMode.momentumRatio;const m=i.velocity*_;let p=i.translate+m;u&&(p=-p);let S=!1,v;const x=Math.abs(i.velocity)*20*l.freeMode.momentumBounceRatio;let C;if(p<i.maxTranslate())l.freeMode.momentumBounce?(p+i.maxTranslate()<-x&&(p=i.maxTranslate()-x),v=i.maxTranslate(),S=!0,h.allowMomentumBounce=!0):p=i.maxTranslate(),l.loop&&l.centeredSlides&&(C=!0);else if(p>i.minTranslate())l.freeMode.momentumBounce?(p-i.minTranslate()>x&&(p=i.minTranslate()+x),v=i.minTranslate(),S=!0,h.allowMomentumBounce=!0):p=i.minTranslate(),l.loop&&l.centeredSlides&&(C=!0);else if(l.freeMode.sticky){let D;for(let T=0;T<f.length;T+=1)if(f[T]>-p){D=T;break}Math.abs(f[D]-p)<Math.abs(f[D-1]-p)||i.swipeDirection==="next"?p=f[D]:p=f[D-1],p=-p}if(C&&n("transitionEnd",()=>{i.loopFix()}),i.velocity!==0){if(u?_=Math.abs((-p-i.translate)/i.velocity):_=Math.abs((p-i.translate)/i.velocity),l.freeMode.sticky){const D=Math.abs((u?-p:p)-i.translate),T=i.slidesSizesGrid[i.activeIndex];D<T?_=l.speed:D<2*T?_=l.speed*1.5:_=l.speed*2.5}}else if(l.freeMode.sticky){i.slideToClosest();return}l.freeMode.momentumBounce&&S?(i.updateProgress(v),i.setTransition(_),i.setTranslate(p),i.transitionStart(!0,i.swipeDirection),i.animating=!0,Wc(c,()=>{!i||i.destroyed||!h.allowMomentumBounce||(t("momentumBounce"),i.setTransition(l.speed),setTimeout(()=>{i.setTranslate(v),Wc(c,()=>{!i||i.destroyed||i.transitionEnd()})},0))})):i.velocity?(t("_freeModeNoMomentumRelease"),i.updateProgress(p),i.setTransition(_),i.setTranslate(p),i.transitionStart(!0,i.swipeDirection),i.animating||(i.animating=!0,Wc(c,()=>{!i||i.destroyed||i.transitionEnd()}))):i.updateProgress(p),i.updateActiveIndex(),i.updateSlidesClasses()}else if(l.freeMode.sticky){i.slideToClosest();return}else l.freeMode&&t("_freeModeNoMomentumRelease");(!l.freeMode.momentum||g>=l.longSwipesMs)&&(t("_freeModeStaticRelease"),i.updateProgress(),i.updateActiveIndex(),i.updateSlidesClasses())}Object.assign(i,{freeMode:{onTouchStart:r,onTouchMove:s,onTouchEnd:a}})}function bb(i){const{effect:e,swiper:t,on:n,setTranslate:r,setTransition:s,overwriteParams:a,perspective:o,recreateShadows:l,getEffectParams:c}=i;n("beforeInit",()=>{if(t.params.effect!==e)return;t.classNames.push(`${t.params.containerModifierClass}${e}`),o&&o()&&t.classNames.push(`${t.params.containerModifierClass}3d`);const f=a?a():{};Object.assign(t.params,f),Object.assign(t.originalParams,f)}),n("setTranslate _virtualUpdated",()=>{t.params.effect===e&&r()}),n("setTransition",(f,h)=>{t.params.effect===e&&s(h)}),n("transitionEnd",()=>{if(t.params.effect===e&&l){if(!c||!c().slideShadows)return;t.slides.forEach(f=>{f.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(h=>h.remove())}),l()}});let u;n("virtualUpdate",()=>{t.params.effect===e&&(t.slides.length||(u=!0),requestAnimationFrame(()=>{u&&t.slides&&t.slides.length&&(r(),u=!1)}))})}function Db(i,e){const t=ld(e);return t!==e&&(t.style.backfaceVisibility="hidden",t.style["-webkit-backface-visibility"]="hidden"),t}function Jh(i,e,t){const n=`swiper-slide-shadow${t?`-${t}`:""}${` swiper-slide-shadow-${i}`}`,r=ld(e);let s=r.querySelector(`.${n.split(" ").join(".")}`);return s||(s=ro("div",n.split(" ")),r.append(s)),s}function SD({swiper:i,extendParams:e,on:t}){e({coverflowEffect:{rotate:50,stretch:0,depth:100,scale:1,modifier:1,slideShadows:!0}}),bb({effect:"coverflow",swiper:i,on:t,setTranslate:()=>{const{width:s,height:a,slides:o,slidesSizesGrid:l}=i,c=i.params.coverflowEffect,u=i.isHorizontal(),f=i.translate,h=u?-f+s/2:-f+a/2,d=u?c.rotate:-c.rotate,g=c.depth,_=fT(i);for(let m=0,p=o.length;m<p;m+=1){const S=o[m],v=l[m],x=S.swiperSlideOffset,C=(h-x-v/2)/v,D=typeof c.modifier=="function"?c.modifier(C):C*c.modifier;let T=u?d*D:0,E=u?0:d*D,M=-g*Math.abs(D),y=c.stretch;typeof y=="string"&&y.indexOf("%")!==-1&&(y=parseFloat(c.stretch)/100*v);let w=u?0:y*D,I=u?y*D:0,U=1-(1-c.scale)*Math.abs(D);Math.abs(I)<.001&&(I=0),Math.abs(w)<.001&&(w=0),Math.abs(M)<.001&&(M=0),Math.abs(T)<.001&&(T=0),Math.abs(E)<.001&&(E=0),Math.abs(U)<.001&&(U=0);const V=`translate3d(${I}px,${w}px,${M}px)  rotateX(${_(E)}deg) rotateY(${_(T)}deg) scale(${U})`,q=Db(c,S);if(q.style.transform=V,S.style.zIndex=-Math.abs(Math.round(D))+1,c.slideShadows){let X=u?S.querySelector(".swiper-slide-shadow-left"):S.querySelector(".swiper-slide-shadow-top"),H=u?S.querySelector(".swiper-slide-shadow-right"):S.querySelector(".swiper-slide-shadow-bottom");X||(X=Jh("coverflow",S,u?"left":"top")),H||(H=Jh("coverflow",S,u?"right":"bottom")),X&&(X.style.opacity=D>0?D:0),H&&(H.style.opacity=-D>0?-D:0)}}},setTransition:s=>{i.slides.map(o=>ld(o)).forEach(o=>{o.style.transitionDuration=`${s}ms`,o.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(l=>{l.style.transitionDuration=`${s}ms`})})},perspective:()=>!0,overwriteParams:()=>({watchSlidesProgress:!0})})}function Cb(i,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(i,n.key,n)}}function Ab(i,e,t){return e&&Cb(i.prototype,e),i}/*!
 * Observer 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var rn,vl,Xn,dr,hr,Vs,ug,Ur,Oa,fg,$i,di,dg,hg=function(){return rn||typeof window<"u"&&(rn=window.gsap)&&rn.registerPlugin&&rn},pg=1,Os=[],ot=[],Ai=[],Ua=Date.now,gf=function(e,t){return t},wb=function(){var e=Oa.core,t=e.bridge||{},n=e._scrollers,r=e._proxies;n.push.apply(n,ot),r.push.apply(r,Ai),ot=n,Ai=r,gf=function(a,o){return t[a](o)}},vr=function(e,t){return~Ai.indexOf(e)&&Ai[Ai.indexOf(e)+1][t]},Na=function(e){return!!~fg.indexOf(e)},gn=function(e,t,n,r,s){return e.addEventListener(t,n,{passive:r!==!1,capture:!!s})},mn=function(e,t,n,r){return e.removeEventListener(t,n,!!r)},qo="scrollLeft",Yo="scrollTop",_f=function(){return $i&&$i.isPressed||ot.cache++},Bl=function(e,t){var n=function r(s){if(s||s===0){pg&&(Xn.history.scrollRestoration="manual");var a=$i&&$i.isPressed;s=r.v=Math.round(s)||($i&&$i.iOS?1:0),e(s),r.cacheID=ot.cache,a&&gf("ss",s)}else(t||ot.cache!==r.cacheID||gf("ref"))&&(r.cacheID=ot.cache,r.v=e());return r.v+r.offset};return n.offset=0,e&&n},En={s:qo,p:"left",p2:"Left",os:"right",os2:"Right",d:"width",d2:"Width",a:"x",sc:Bl(function(i){return arguments.length?Xn.scrollTo(i,Yt.sc()):Xn.pageXOffset||dr[qo]||hr[qo]||Vs[qo]||0})},Yt={s:Yo,p:"top",p2:"Top",os:"bottom",os2:"Bottom",d:"height",d2:"Height",a:"y",op:En,sc:Bl(function(i){return arguments.length?Xn.scrollTo(En.sc(),i):Xn.pageYOffset||dr[Yo]||hr[Yo]||Vs[Yo]||0})},Cn=function(e,t){return(t&&t._ctx&&t._ctx.selector||rn.utils.toArray)(e)[0]||(typeof e=="string"&&rn.config().nullTargetWarn!==!1?console.warn("Element not found:",e):null)},Rb=function(e,t){for(var n=t.length;n--;)if(t[n]===e||t[n].contains(e))return!0;return!1},Er=function(e,t){var n=t.s,r=t.sc;Na(e)&&(e=dr.scrollingElement||hr);var s=ot.indexOf(e),a=r===Yt.sc?1:2;!~s&&(s=ot.push(e)-1),ot[s+a]||gn(e,"scroll",_f);var o=ot[s+a],l=o||(ot[s+a]=Bl(vr(e,n),!0)||(Na(e)?r:Bl(function(c){return arguments.length?e[n]=c:e[n]})));return l.target=e,o||(l.smooth=rn.getProperty(e,"scrollBehavior")==="smooth"),l},vf=function(e,t,n){var r=e,s=e,a=Ua(),o=a,l=t||50,c=Math.max(500,l*3),u=function(g,_){var m=Ua();_||m-a>l?(s=r,r=g,o=a,a=m):n?r+=g:r=s+(g-s)/(m-o)*(a-o)},f=function(){s=r=n?0:r,o=a=0},h=function(g){var _=o,m=s,p=Ua();return(g||g===0)&&g!==r&&u(g),a===o||p-o>c?0:(r+(n?m:-m))/((n?p:a)-_)*1e3};return{update:u,reset:f,getVelocity:h}},ga=function(e,t){return t&&!e._gsapAllow&&e.preventDefault(),e.changedTouches?e.changedTouches[0]:e},Qh=function(e){var t=Math.max.apply(Math,e),n=Math.min.apply(Math,e);return Math.abs(t)>=Math.abs(n)?t:n},mg=function(){Oa=rn.core.globals().ScrollTrigger,Oa&&Oa.core&&wb()},gg=function(e){return rn=e||hg(),!vl&&rn&&typeof document<"u"&&document.body&&(Xn=window,dr=document,hr=dr.documentElement,Vs=dr.body,fg=[Xn,dr,hr,Vs],rn.utils.clamp,dg=rn.core.context||function(){},Ur="onpointerenter"in Vs?"pointer":"mouse",ug=Nt.isTouch=Xn.matchMedia&&Xn.matchMedia("(hover: none), (pointer: coarse)").matches?1:"ontouchstart"in Xn||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?2:0,di=Nt.eventTypes=("ontouchstart"in hr?"touchstart,touchmove,touchcancel,touchend":"onpointerdown"in hr?"pointerdown,pointermove,pointercancel,pointerup":"mousedown,mousemove,mouseup,mouseup").split(","),setTimeout(function(){return pg=0},500),mg(),vl=1),vl};En.op=Yt;ot.cache=0;var Nt=function(){function i(t){this.init(t)}var e=i.prototype;return e.init=function(n){vl||gg(rn)||console.warn("Please gsap.registerPlugin(Observer)"),Oa||mg();var r=n.tolerance,s=n.dragMinimum,a=n.type,o=n.target,l=n.lineHeight,c=n.debounce,u=n.preventDefault,f=n.onStop,h=n.onStopDelay,d=n.ignore,g=n.wheelSpeed,_=n.event,m=n.onDragStart,p=n.onDragEnd,S=n.onDrag,v=n.onPress,x=n.onRelease,C=n.onRight,D=n.onLeft,T=n.onUp,E=n.onDown,M=n.onChangeX,y=n.onChangeY,w=n.onChange,I=n.onToggleX,U=n.onToggleY,V=n.onHover,q=n.onHoverEnd,X=n.onMove,H=n.ignoreCheck,N=n.isNormalizer,Q=n.onGestureStart,L=n.onGestureEnd,ae=n.onWheel,Ie=n.onEnable,qe=n.onDisable,Z=n.onClick,oe=n.scrollSpeed,xe=n.capture,fe=n.allowClicks,Ae=n.lockAxis,Ne=n.onLockAxis;this.target=o=Cn(o)||hr,this.vars=n,d&&(d=rn.utils.toArray(d)),r=r||1e-9,s=s||0,g=g||1,oe=oe||1,a=a||"wheel,touch,pointer",c=c!==!1,l||(l=parseFloat(Xn.getComputedStyle(Vs).lineHeight)||22);var Oe,et,Ye,Se,P,de,re,O=this,ne=0,Ce=0,se=n.passive||!u&&n.passive!==!1,R=Er(o,En),b=Er(o,Yt),G=R(),J=b(),ie=~a.indexOf("touch")&&!~a.indexOf("pointer")&&di[0]==="pointerdown",K=Na(o),me=o.ownerDocument||dr,he=[0,0,0],Pe=[0,0,0],Ue=0,le=function(){return Ue=Ua()},pe=function(Le,Ze){return(O.event=Le)&&d&&Rb(Le.target,d)||Ze&&ie&&Le.pointerType!=="touch"||H&&H(Le,Ze)},Ve=function(){O._vx.reset(),O._vy.reset(),et.pause(),f&&f(O)},ze=function(){var Le=O.deltaX=Qh(he),Ze=O.deltaY=Qh(Pe),Ee=Math.abs(Le)>=r,Ke=Math.abs(Ze)>=r;w&&(Ee||Ke)&&w(O,Le,Ze,he,Pe),Ee&&(C&&O.deltaX>0&&C(O),D&&O.deltaX<0&&D(O),M&&M(O),I&&O.deltaX<0!=ne<0&&I(O),ne=O.deltaX,he[0]=he[1]=he[2]=0),Ke&&(E&&O.deltaY>0&&E(O),T&&O.deltaY<0&&T(O),y&&y(O),U&&O.deltaY<0!=Ce<0&&U(O),Ce=O.deltaY,Pe[0]=Pe[1]=Pe[2]=0),(Se||Ye)&&(X&&X(O),Ye&&(m&&Ye===1&&m(O),S&&S(O),Ye=0),Se=!1),de&&!(de=!1)&&Ne&&Ne(O),P&&(ae(O),P=!1),Oe=0},De=function(Le,Ze,Ee){he[Ee]+=Le,Pe[Ee]+=Ze,O._vx.update(Le),O._vy.update(Ze),c?Oe||(Oe=requestAnimationFrame(ze)):ze()},B=function(Le,Ze){Ae&&!re&&(O.axis=re=Math.abs(Le)>Math.abs(Ze)?"x":"y",de=!0),re!=="y"&&(he[2]+=Le,O._vx.update(Le,!0)),re!=="x"&&(Pe[2]+=Ze,O._vy.update(Ze,!0)),c?Oe||(Oe=requestAnimationFrame(ze)):ze()},ee=function(Le){if(!pe(Le,1)){Le=ga(Le,u);var Ze=Le.clientX,Ee=Le.clientY,Ke=Ze-O.x,Be=Ee-O.y,je=O.isDragging;O.x=Ze,O.y=Ee,(je||(Ke||Be)&&(Math.abs(O.startX-Ze)>=s||Math.abs(O.startY-Ee)>=s))&&(Ye=je?2:1,je||(O.isDragging=!0),B(Ke,Be))}},ye=O.onPress=function(Me){pe(Me,1)||Me&&Me.button||(O.axis=re=null,et.pause(),O.isPressed=!0,Me=ga(Me),ne=Ce=0,O.startX=O.x=Me.clientX,O.startY=O.y=Me.clientY,O._vx.reset(),O._vy.reset(),gn(N?o:me,di[1],ee,se,!0),O.deltaX=O.deltaY=0,v&&v(O))},F=O.onRelease=function(Me){if(!pe(Me,1)){mn(N?o:me,di[1],ee,!0);var Le=!isNaN(O.y-O.startY),Ze=O.isDragging,Ee=Ze&&(Math.abs(O.x-O.startX)>3||Math.abs(O.y-O.startY)>3),Ke=ga(Me);!Ee&&Le&&(O._vx.reset(),O._vy.reset(),u&&fe&&rn.delayedCall(.08,function(){if(Ua()-Ue>300&&!Me.defaultPrevented){if(Me.target.click)Me.target.click();else if(me.createEvent){var Be=me.createEvent("MouseEvents");Be.initMouseEvent("click",!0,!0,Xn,1,Ke.screenX,Ke.screenY,Ke.clientX,Ke.clientY,!1,!1,!1,!1,0,null),Me.target.dispatchEvent(Be)}}})),O.isDragging=O.isGesturing=O.isPressed=!1,f&&Ze&&!N&&et.restart(!0),Ye&&ze(),p&&Ze&&p(O),x&&x(O,Ee)}},ue=function(Le){return Le.touches&&Le.touches.length>1&&(O.isGesturing=!0)&&Q(Le,O.isDragging)},$=function(){return(O.isGesturing=!1)||L(O)},te=function(Le){if(!pe(Le)){var Ze=R(),Ee=b();De((Ze-G)*oe,(Ee-J)*oe,1),G=Ze,J=Ee,f&&et.restart(!0)}},_e=function(Le){if(!pe(Le)){Le=ga(Le,u),ae&&(P=!0);var Ze=(Le.deltaMode===1?l:Le.deltaMode===2?Xn.innerHeight:1)*g;De(Le.deltaX*Ze,Le.deltaY*Ze,0),f&&!N&&et.restart(!0)}},ve=function(Le){if(!pe(Le)){var Ze=Le.clientX,Ee=Le.clientY,Ke=Ze-O.x,Be=Ee-O.y;O.x=Ze,O.y=Ee,Se=!0,f&&et.restart(!0),(Ke||Be)&&B(Ke,Be)}},ke=function(Le){O.event=Le,V(O)},Je=function(Le){O.event=Le,q(O)},_t=function(Le){return pe(Le)||ga(Le,u)&&Z(O)};et=O._dc=rn.delayedCall(h||.25,Ve).pause(),O.deltaX=O.deltaY=0,O._vx=vf(0,50,!0),O._vy=vf(0,50,!0),O.scrollX=R,O.scrollY=b,O.isDragging=O.isGesturing=O.isPressed=!1,dg(this),O.enable=function(Me){return O.isEnabled||(gn(K?me:o,"scroll",_f),a.indexOf("scroll")>=0&&gn(K?me:o,"scroll",te,se,xe),a.indexOf("wheel")>=0&&gn(o,"wheel",_e,se,xe),(a.indexOf("touch")>=0&&ug||a.indexOf("pointer")>=0)&&(gn(o,di[0],ye,se,xe),gn(me,di[2],F),gn(me,di[3],F),fe&&gn(o,"click",le,!0,!0),Z&&gn(o,"click",_t),Q&&gn(me,"gesturestart",ue),L&&gn(me,"gestureend",$),V&&gn(o,Ur+"enter",ke),q&&gn(o,Ur+"leave",Je),X&&gn(o,Ur+"move",ve)),O.isEnabled=!0,O.isDragging=O.isGesturing=O.isPressed=Se=Ye=!1,O._vx.reset(),O._vy.reset(),G=R(),J=b(),Me&&Me.type&&ye(Me),Ie&&Ie(O)),O},O.disable=function(){O.isEnabled&&(Os.filter(function(Me){return Me!==O&&Na(Me.target)}).length||mn(K?me:o,"scroll",_f),O.isPressed&&(O._vx.reset(),O._vy.reset(),mn(N?o:me,di[1],ee,!0)),mn(K?me:o,"scroll",te,xe),mn(o,"wheel",_e,xe),mn(o,di[0],ye,xe),mn(me,di[2],F),mn(me,di[3],F),mn(o,"click",le,!0),mn(o,"click",_t),mn(me,"gesturestart",ue),mn(me,"gestureend",$),mn(o,Ur+"enter",ke),mn(o,Ur+"leave",Je),mn(o,Ur+"move",ve),O.isEnabled=O.isPressed=O.isDragging=!1,qe&&qe(O))},O.kill=O.revert=function(){O.disable();var Me=Os.indexOf(O);Me>=0&&Os.splice(Me,1),$i===O&&($i=0)},Os.push(O),N&&Na(o)&&($i=O),O.enable(_)},Ab(i,[{key:"velocityX",get:function(){return this._vx.getVelocity()}},{key:"velocityY",get:function(){return this._vy.getVelocity()}}]),i}();Nt.version="3.13.0";Nt.create=function(i){return new Nt(i)};Nt.register=gg;Nt.getAll=function(){return Os.slice()};Nt.getById=function(i){return Os.filter(function(e){return e.vars.id===i})[0]};hg()&&rn.registerPlugin(Nt);/*!
 * ScrollTrigger 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var Fe,Rs,at,bt,Gn,gt,cd,zl,ao,Ba,Ea,$o,ln,Zl,xf,xn,ep,tp,Ps,_g,Jc,vg,vn,Sf,xg,Sg,sr,yf,ud,Hs,fd,kl,Mf,Qc,jo=1,cn=Date.now,eu=cn(),oi=0,Ta=0,np=function(e,t,n){var r=kn(e)&&(e.substr(0,6)==="clamp("||e.indexOf("max")>-1);return n["_"+t+"Clamp"]=r,r?e.substr(6,e.length-7):e},ip=function(e,t){return t&&(!kn(e)||e.substr(0,6)!=="clamp(")?"clamp("+e+")":e},Pb=function i(){return Ta&&requestAnimationFrame(i)},rp=function(){return Zl=1},sp=function(){return Zl=0},yi=function(e){return e},ba=function(e){return Math.round(e*1e5)/1e5||0},yg=function(){return typeof window<"u"},Mg=function(){return Fe||yg()&&(Fe=window.gsap)&&Fe.registerPlugin&&Fe},ss=function(e){return!!~cd.indexOf(e)},Eg=function(e){return(e==="Height"?fd:at["inner"+e])||Gn["client"+e]||gt["client"+e]},Tg=function(e){return vr(e,"getBoundingClientRect")||(ss(e)?function(){return El.width=at.innerWidth,El.height=fd,El}:function(){return Wi(e)})},Lb=function(e,t,n){var r=n.d,s=n.d2,a=n.a;return(a=vr(e,"getBoundingClientRect"))?function(){return a()[r]}:function(){return(t?Eg(s):e["client"+s])||0}},Fb=function(e,t){return!t||~Ai.indexOf(e)?Tg(e):function(){return El}},Di=function(e,t){var n=t.s,r=t.d2,s=t.d,a=t.a;return Math.max(0,(n="scroll"+r)&&(a=vr(e,n))?a()-Tg(e)()[s]:ss(e)?(Gn[n]||gt[n])-Eg(r):e[n]-e["offset"+r])},Zo=function(e,t){for(var n=0;n<Ps.length;n+=3)(!t||~t.indexOf(Ps[n+1]))&&e(Ps[n],Ps[n+1],Ps[n+2])},kn=function(e){return typeof e=="string"},fn=function(e){return typeof e=="function"},Da=function(e){return typeof e=="number"},Nr=function(e){return typeof e=="object"},_a=function(e,t,n){return e&&e.progress(t?0:1)&&n&&e.pause()},tu=function(e,t){if(e.enabled){var n=e._ctx?e._ctx.add(function(){return t(e)}):t(e);n&&n.totalTime&&(e.callbackAnimation=n)}},As=Math.abs,bg="left",Dg="top",dd="right",hd="bottom",Zr="width",Kr="height",za="Right",ka="Left",Va="Top",Ha="Bottom",kt="padding",ni="margin",na="Width",pd="Height",qt="px",ii=function(e){return at.getComputedStyle(e)},Ib=function(e){var t=ii(e).position;e.style.position=t==="absolute"||t==="fixed"?t:"relative"},ap=function(e,t){for(var n in t)n in e||(e[n]=t[n]);return e},Wi=function(e,t){var n=t&&ii(e)[xf]!=="matrix(1, 0, 0, 1, 0, 0)"&&Fe.to(e,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),r=e.getBoundingClientRect();return n&&n.progress(0).kill(),r},Vl=function(e,t){var n=t.d2;return e["offset"+n]||e["client"+n]||0},Cg=function(e){var t=[],n=e.labels,r=e.duration(),s;for(s in n)t.push(n[s]/r);return t},Ob=function(e){return function(t){return Fe.utils.snap(Cg(e),t)}},md=function(e){var t=Fe.utils.snap(e),n=Array.isArray(e)&&e.slice(0).sort(function(r,s){return r-s});return n?function(r,s,a){a===void 0&&(a=.001);var o;if(!s)return t(r);if(s>0){for(r-=a,o=0;o<n.length;o++)if(n[o]>=r)return n[o];return n[o-1]}else for(o=n.length,r+=a;o--;)if(n[o]<=r)return n[o];return n[0]}:function(r,s,a){a===void 0&&(a=.001);var o=t(r);return!s||Math.abs(o-r)<a||o-r<0==s<0?o:t(s<0?r-e:r+e)}},Ub=function(e){return function(t,n){return md(Cg(e))(t,n.direction)}},Ko=function(e,t,n,r){return n.split(",").forEach(function(s){return e(t,s,r)})},Jt=function(e,t,n,r,s){return e.addEventListener(t,n,{passive:!r,capture:!!s})},Kt=function(e,t,n,r){return e.removeEventListener(t,n,!!r)},Jo=function(e,t,n){n=n&&n.wheelHandler,n&&(e(t,"wheel",n),e(t,"touchmove",n))},op={startColor:"green",endColor:"red",indent:0,fontSize:"16px",fontWeight:"normal"},Qo={toggleActions:"play",anticipatePin:0},Hl={top:0,left:0,center:.5,bottom:1,right:1},xl=function(e,t){if(kn(e)){var n=e.indexOf("="),r=~n?+(e.charAt(n-1)+1)*parseFloat(e.substr(n+1)):0;~n&&(e.indexOf("%")>n&&(r*=t/100),e=e.substr(0,n-1)),e=r+(e in Hl?Hl[e]*t:~e.indexOf("%")?parseFloat(e)*t/100:parseFloat(e)||0)}return e},el=function(e,t,n,r,s,a,o,l){var c=s.startColor,u=s.endColor,f=s.fontSize,h=s.indent,d=s.fontWeight,g=bt.createElement("div"),_=ss(n)||vr(n,"pinType")==="fixed",m=e.indexOf("scroller")!==-1,p=_?gt:n,S=e.indexOf("start")!==-1,v=S?c:u,x="border-color:"+v+";font-size:"+f+";color:"+v+";font-weight:"+d+";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";return x+="position:"+((m||l)&&_?"fixed;":"absolute;"),(m||l||!_)&&(x+=(r===Yt?dd:hd)+":"+(a+parseFloat(h))+"px;"),o&&(x+="box-sizing:border-box;text-align:left;width:"+o.offsetWidth+"px;"),g._isStart=S,g.setAttribute("class","gsap-marker-"+e+(t?" marker-"+t:"")),g.style.cssText=x,g.innerText=t||t===0?e+"-"+t:e,p.children[0]?p.insertBefore(g,p.children[0]):p.appendChild(g),g._offset=g["offset"+r.op.d2],Sl(g,0,r,S),g},Sl=function(e,t,n,r){var s={display:"block"},a=n[r?"os2":"p2"],o=n[r?"p2":"os2"];e._isFlipped=r,s[n.a+"Percent"]=r?-100:0,s[n.a]=r?"1px":0,s["border"+a+na]=1,s["border"+o+na]=0,s[n.p]=t+"px",Fe.set(e,s)},it=[],Ef={},oo,lp=function(){return cn()-oi>34&&(oo||(oo=requestAnimationFrame(Zi)))},ws=function(){(!vn||!vn.isPressed||vn.startX>gt.clientWidth)&&(ot.cache++,vn?oo||(oo=requestAnimationFrame(Zi)):Zi(),oi||os("scrollStart"),oi=cn())},nu=function(){Sg=at.innerWidth,xg=at.innerHeight},Ca=function(e){ot.cache++,(e===!0||!ln&&!vg&&!bt.fullscreenElement&&!bt.webkitFullscreenElement&&(!Sf||Sg!==at.innerWidth||Math.abs(at.innerHeight-xg)>at.innerHeight*.25))&&zl.restart(!0)},as={},Nb=[],Ag=function i(){return Kt(lt,"scrollEnd",i)||Wr(!0)},os=function(e){return as[e]&&as[e].map(function(t){return t()})||Nb},zn=[],wg=function(e){for(var t=0;t<zn.length;t+=5)(!e||zn[t+4]&&zn[t+4].query===e)&&(zn[t].style.cssText=zn[t+1],zn[t].getBBox&&zn[t].setAttribute("transform",zn[t+2]||""),zn[t+3].uncache=1)},gd=function(e,t){var n;for(xn=0;xn<it.length;xn++)n=it[xn],n&&(!t||n._ctx===t)&&(e?n.kill(1):n.revert(!0,!0));kl=!0,t&&wg(t),t||os("revert")},Rg=function(e,t){ot.cache++,(t||!Sn)&&ot.forEach(function(n){return fn(n)&&n.cacheID++&&(n.rec=0)}),kn(e)&&(at.history.scrollRestoration=ud=e)},Sn,Jr=0,cp,Bb=function(){if(cp!==Jr){var e=cp=Jr;requestAnimationFrame(function(){return e===Jr&&Wr(!0)})}},Pg=function(){gt.appendChild(Hs),fd=!vn&&Hs.offsetHeight||at.innerHeight,gt.removeChild(Hs)},up=function(e){return ao(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t){return t.style.display=e?"none":"block"})},Wr=function(e,t){if(Gn=bt.documentElement,gt=bt.body,cd=[at,bt,Gn,gt],oi&&!e&&!kl){Jt(lt,"scrollEnd",Ag);return}Pg(),Sn=lt.isRefreshing=!0,ot.forEach(function(r){return fn(r)&&++r.cacheID&&(r.rec=r())});var n=os("refreshInit");_g&&lt.sort(),t||gd(),ot.forEach(function(r){fn(r)&&(r.smooth&&(r.target.style.scrollBehavior="auto"),r(0))}),it.slice(0).forEach(function(r){return r.refresh()}),kl=!1,it.forEach(function(r){if(r._subPinOffset&&r.pin){var s=r.vars.horizontal?"offsetWidth":"offsetHeight",a=r.pin[s];r.revert(!0,1),r.adjustPinSpacing(r.pin[s]-a),r.refresh()}}),Mf=1,up(!0),it.forEach(function(r){var s=Di(r.scroller,r._dir),a=r.vars.end==="max"||r._endClamp&&r.end>s,o=r._startClamp&&r.start>=s;(a||o)&&r.setPositions(o?s-1:r.start,a?Math.max(o?s:r.start+1,s):r.end,!0)}),up(!1),Mf=0,n.forEach(function(r){return r&&r.render&&r.render(-1)}),ot.forEach(function(r){fn(r)&&(r.smooth&&requestAnimationFrame(function(){return r.target.style.scrollBehavior="smooth"}),r.rec&&r(r.rec))}),Rg(ud,1),zl.pause(),Jr++,Sn=2,Zi(2),it.forEach(function(r){return fn(r.vars.onRefresh)&&r.vars.onRefresh(r)}),Sn=lt.isRefreshing=!1,os("refresh")},Tf=0,yl=1,Ga,Zi=function(e){if(e===2||!Sn&&!kl){lt.isUpdating=!0,Ga&&Ga.update(0);var t=it.length,n=cn(),r=n-eu>=50,s=t&&it[0].scroll();if(yl=Tf>s?-1:1,Sn||(Tf=s),r&&(oi&&!Zl&&n-oi>200&&(oi=0,os("scrollEnd")),Ea=eu,eu=n),yl<0){for(xn=t;xn-- >0;)it[xn]&&it[xn].update(0,r);yl=1}else for(xn=0;xn<t;xn++)it[xn]&&it[xn].update(0,r);lt.isUpdating=!1}oo=0},bf=[bg,Dg,hd,dd,ni+Ha,ni+za,ni+Va,ni+ka,"display","flexShrink","float","zIndex","gridColumnStart","gridColumnEnd","gridRowStart","gridRowEnd","gridArea","justifySelf","alignSelf","placeSelf","order"],Ml=bf.concat([Zr,Kr,"boxSizing","max"+na,"max"+pd,"position",ni,kt,kt+Va,kt+za,kt+Ha,kt+ka]),zb=function(e,t,n){Gs(n);var r=e._gsap;if(r.spacerIsNative)Gs(r.spacerState);else if(e._gsap.swappedIn){var s=t.parentNode;s&&(s.insertBefore(e,t),s.removeChild(t))}e._gsap.swappedIn=!1},iu=function(e,t,n,r){if(!e._gsap.swappedIn){for(var s=bf.length,a=t.style,o=e.style,l;s--;)l=bf[s],a[l]=n[l];a.position=n.position==="absolute"?"absolute":"relative",n.display==="inline"&&(a.display="inline-block"),o[hd]=o[dd]="auto",a.flexBasis=n.flexBasis||"auto",a.overflow="visible",a.boxSizing="border-box",a[Zr]=Vl(e,En)+qt,a[Kr]=Vl(e,Yt)+qt,a[kt]=o[ni]=o[Dg]=o[bg]="0",Gs(r),o[Zr]=o["max"+na]=n[Zr],o[Kr]=o["max"+pd]=n[Kr],o[kt]=n[kt],e.parentNode!==t&&(e.parentNode.insertBefore(t,e),t.appendChild(e)),e._gsap.swappedIn=!0}},kb=/([A-Z])/g,Gs=function(e){if(e){var t=e.t.style,n=e.length,r=0,s,a;for((e.t._gsap||Fe.core.getCache(e.t)).uncache=1;r<n;r+=2)a=e[r+1],s=e[r],a?t[s]=a:t[s]&&t.removeProperty(s.replace(kb,"-$1").toLowerCase())}},tl=function(e){for(var t=Ml.length,n=e.style,r=[],s=0;s<t;s++)r.push(Ml[s],n[Ml[s]]);return r.t=e,r},Vb=function(e,t,n){for(var r=[],s=e.length,a=n?8:0,o;a<s;a+=2)o=e[a],r.push(o,o in t?t[o]:e[a+1]);return r.t=e.t,r},El={left:0,top:0},fp=function(e,t,n,r,s,a,o,l,c,u,f,h,d,g){fn(e)&&(e=e(l)),kn(e)&&e.substr(0,3)==="max"&&(e=h+(e.charAt(4)==="="?xl("0"+e.substr(3),n):0));var _=d?d.time():0,m,p,S;if(d&&d.seek(0),isNaN(e)||(e=+e),Da(e))d&&(e=Fe.utils.mapRange(d.scrollTrigger.start,d.scrollTrigger.end,0,h,e)),o&&Sl(o,n,r,!0);else{fn(t)&&(t=t(l));var v=(e||"0").split(" "),x,C,D,T;S=Cn(t,l)||gt,x=Wi(S)||{},(!x||!x.left&&!x.top)&&ii(S).display==="none"&&(T=S.style.display,S.style.display="block",x=Wi(S),T?S.style.display=T:S.style.removeProperty("display")),C=xl(v[0],x[r.d]),D=xl(v[1]||"0",n),e=x[r.p]-c[r.p]-u+C+s-D,o&&Sl(o,D,r,n-D<20||o._isStart&&D>20),n-=n-D}if(g&&(l[g]=e||-.001,e<0&&(e=0)),a){var E=e+n,M=a._isStart;m="scroll"+r.d2,Sl(a,E,r,M&&E>20||!M&&(f?Math.max(gt[m],Gn[m]):a.parentNode[m])<=E+1),f&&(c=Wi(o),f&&(a.style[r.op.p]=c[r.op.p]-r.op.m-a._offset+qt))}return d&&S&&(m=Wi(S),d.seek(h),p=Wi(S),d._caScrollDist=m[r.p]-p[r.p],e=e/d._caScrollDist*h),d&&d.seek(_),d?e:Math.round(e)},Hb=/(webkit|moz|length|cssText|inset)/i,dp=function(e,t,n,r){if(e.parentNode!==t){var s=e.style,a,o;if(t===gt){e._stOrig=s.cssText,o=ii(e);for(a in o)!+a&&!Hb.test(a)&&o[a]&&typeof s[a]=="string"&&a!=="0"&&(s[a]=o[a]);s.top=n,s.left=r}else s.cssText=e._stOrig;Fe.core.getCache(e).uncache=1,t.appendChild(e)}},Lg=function(e,t,n){var r=t,s=r;return function(a){var o=Math.round(e());return o!==r&&o!==s&&Math.abs(o-r)>3&&Math.abs(o-s)>3&&(a=o,n&&n()),s=r,r=Math.round(a),r}},nl=function(e,t,n){var r={};r[t.p]="+="+n,Fe.set(e,r)},hp=function(e,t){var n=Er(e,t),r="_scroll"+t.p2,s=function a(o,l,c,u,f){var h=a.tween,d=l.onComplete,g={};c=c||n();var _=Lg(n,c,function(){h.kill(),a.tween=0});return f=u&&f||0,u=u||o-c,h&&h.kill(),l[r]=o,l.inherit=!1,l.modifiers=g,g[r]=function(){return _(c+u*h.ratio+f*h.ratio*h.ratio)},l.onUpdate=function(){ot.cache++,a.tween&&Zi()},l.onComplete=function(){a.tween=0,d&&d.call(h)},h=a.tween=Fe.to(e,l),h};return e[r]=n,n.wheelHandler=function(){return s.tween&&s.tween.kill()&&(s.tween=0)},Jt(e,"wheel",n.wheelHandler),lt.isTouch&&Jt(e,"touchmove",n.wheelHandler),s},lt=function(){function i(t,n){Rs||i.register(Fe)||console.warn("Please gsap.registerPlugin(ScrollTrigger)"),yf(this),this.init(t,n)}var e=i.prototype;return e.init=function(n,r){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),!Ta){this.update=this.refresh=this.kill=yi;return}n=ap(kn(n)||Da(n)||n.nodeType?{trigger:n}:n,Qo);var s=n,a=s.onUpdate,o=s.toggleClass,l=s.id,c=s.onToggle,u=s.onRefresh,f=s.scrub,h=s.trigger,d=s.pin,g=s.pinSpacing,_=s.invalidateOnRefresh,m=s.anticipatePin,p=s.onScrubComplete,S=s.onSnapComplete,v=s.once,x=s.snap,C=s.pinReparent,D=s.pinSpacer,T=s.containerAnimation,E=s.fastScrollEnd,M=s.preventOverlaps,y=n.horizontal||n.containerAnimation&&n.horizontal!==!1?En:Yt,w=!f&&f!==0,I=Cn(n.scroller||at),U=Fe.core.getCache(I),V=ss(I),q=("pinType"in n?n.pinType:vr(I,"pinType")||V&&"fixed")==="fixed",X=[n.onEnter,n.onLeave,n.onEnterBack,n.onLeaveBack],H=w&&n.toggleActions.split(" "),N="markers"in n?n.markers:Qo.markers,Q=V?0:parseFloat(ii(I)["border"+y.p2+na])||0,L=this,ae=n.onRefreshInit&&function(){return n.onRefreshInit(L)},Ie=Lb(I,V,y),qe=Fb(I,V),Z=0,oe=0,xe=0,fe=Er(I,y),Ae,Ne,Oe,et,Ye,Se,P,de,re,O,ne,Ce,se,R,b,G,J,ie,K,me,he,Pe,Ue,le,pe,Ve,ze,De,B,ee,ye,F,ue,$,te,_e,ve,ke,Je;if(L._startClamp=L._endClamp=!1,L._dir=y,m*=45,L.scroller=I,L.scroll=T?T.time.bind(T):fe,et=fe(),L.vars=n,r=r||n.animation,"refreshPriority"in n&&(_g=1,n.refreshPriority===-9999&&(Ga=L)),U.tweenScroll=U.tweenScroll||{top:hp(I,Yt),left:hp(I,En)},L.tweenTo=Ae=U.tweenScroll[y.p],L.scrubDuration=function(Ee){ue=Da(Ee)&&Ee,ue?F?F.duration(Ee):F=Fe.to(r,{ease:"expo",totalProgress:"+=0",inherit:!1,duration:ue,paused:!0,onComplete:function(){return p&&p(L)}}):(F&&F.progress(1).kill(),F=0)},r&&(r.vars.lazy=!1,r._initted&&!L.isReverted||r.vars.immediateRender!==!1&&n.immediateRender!==!1&&r.duration()&&r.render(0,!0,!0),L.animation=r.pause(),r.scrollTrigger=L,L.scrubDuration(f),ee=0,l||(l=r.vars.id)),x&&((!Nr(x)||x.push)&&(x={snapTo:x}),"scrollBehavior"in gt.style&&Fe.set(V?[gt,Gn]:I,{scrollBehavior:"auto"}),ot.forEach(function(Ee){return fn(Ee)&&Ee.target===(V?bt.scrollingElement||Gn:I)&&(Ee.smooth=!1)}),Oe=fn(x.snapTo)?x.snapTo:x.snapTo==="labels"?Ob(r):x.snapTo==="labelsDirectional"?Ub(r):x.directional!==!1?function(Ee,Ke){return md(x.snapTo)(Ee,cn()-oe<500?0:Ke.direction)}:Fe.utils.snap(x.snapTo),$=x.duration||{min:.1,max:2},$=Nr($)?Ba($.min,$.max):Ba($,$),te=Fe.delayedCall(x.delay||ue/2||.1,function(){var Ee=fe(),Ke=cn()-oe<500,Be=Ae.tween;if((Ke||Math.abs(L.getVelocity())<10)&&!Be&&!Zl&&Z!==Ee){var je=(Ee-Se)/R,Ot=r&&!w?r.totalProgress():je,st=Ke?0:(Ot-ye)/(cn()-Ea)*1e3||0,Tt=Fe.utils.clamp(-je,1-je,As(st/2)*st/.185),Gt=je+(x.inertia===!1?0:Tt),St,yt,ht=x,On=ht.onStart,Ct=ht.onInterrupt,hn=ht.onComplete;if(St=Oe(Gt,L),Da(St)||(St=Gt),yt=Math.max(0,Math.round(Se+St*R)),Ee<=P&&Ee>=Se&&yt!==Ee){if(Be&&!Be._initted&&Be.data<=As(yt-Ee))return;x.inertia===!1&&(Tt=St-je),Ae(yt,{duration:$(As(Math.max(As(Gt-Ot),As(St-Ot))*.185/st/.05||0)),ease:x.ease||"power3",data:As(yt-Ee),onInterrupt:function(){return te.restart(!0)&&Ct&&Ct(L)},onComplete:function(){L.update(),Z=fe(),r&&!w&&(F?F.resetTo("totalProgress",St,r._tTime/r._tDur):r.progress(St)),ee=ye=r&&!w?r.totalProgress():L.progress,S&&S(L),hn&&hn(L)}},Ee,Tt*R,yt-Ee-Tt*R),On&&On(L,Ae.tween)}}else L.isActive&&Z!==Ee&&te.restart(!0)}).pause()),l&&(Ef[l]=L),h=L.trigger=Cn(h||d!==!0&&d),Je=h&&h._gsap&&h._gsap.stRevert,Je&&(Je=Je(L)),d=d===!0?h:Cn(d),kn(o)&&(o={targets:h,className:o}),d&&(g===!1||g===ni||(g=!g&&d.parentNode&&d.parentNode.style&&ii(d.parentNode).display==="flex"?!1:kt),L.pin=d,Ne=Fe.core.getCache(d),Ne.spacer?b=Ne.pinState:(D&&(D=Cn(D),D&&!D.nodeType&&(D=D.current||D.nativeElement),Ne.spacerIsNative=!!D,D&&(Ne.spacerState=tl(D))),Ne.spacer=ie=D||bt.createElement("div"),ie.classList.add("pin-spacer"),l&&ie.classList.add("pin-spacer-"+l),Ne.pinState=b=tl(d)),n.force3D!==!1&&Fe.set(d,{force3D:!0}),L.spacer=ie=Ne.spacer,B=ii(d),le=B[g+y.os2],me=Fe.getProperty(d),he=Fe.quickSetter(d,y.a,qt),iu(d,ie,B),J=tl(d)),N){Ce=Nr(N)?ap(N,op):op,O=el("scroller-start",l,I,y,Ce,0),ne=el("scroller-end",l,I,y,Ce,0,O),K=O["offset"+y.op.d2];var _t=Cn(vr(I,"content")||I);de=this.markerStart=el("start",l,_t,y,Ce,K,0,T),re=this.markerEnd=el("end",l,_t,y,Ce,K,0,T),T&&(ke=Fe.quickSetter([de,re],y.a,qt)),!q&&!(Ai.length&&vr(I,"fixedMarkers")===!0)&&(Ib(V?gt:I),Fe.set([O,ne],{force3D:!0}),Ve=Fe.quickSetter(O,y.a,qt),De=Fe.quickSetter(ne,y.a,qt))}if(T){var Me=T.vars.onUpdate,Le=T.vars.onUpdateParams;T.eventCallback("onUpdate",function(){L.update(0,0,1),Me&&Me.apply(T,Le||[])})}if(L.previous=function(){return it[it.indexOf(L)-1]},L.next=function(){return it[it.indexOf(L)+1]},L.revert=function(Ee,Ke){if(!Ke)return L.kill(!0);var Be=Ee!==!1||!L.enabled,je=ln;Be!==L.isReverted&&(Be&&(_e=Math.max(fe(),L.scroll.rec||0),xe=L.progress,ve=r&&r.progress()),de&&[de,re,O,ne].forEach(function(Ot){return Ot.style.display=Be?"none":"block"}),Be&&(ln=L,L.update(Be)),d&&(!C||!L.isActive)&&(Be?zb(d,ie,b):iu(d,ie,ii(d),pe)),Be||L.update(Be),ln=je,L.isReverted=Be)},L.refresh=function(Ee,Ke,Be,je){if(!((ln||!L.enabled)&&!Ke)){if(d&&Ee&&oi){Jt(i,"scrollEnd",Ag);return}!Sn&&ae&&ae(L),ln=L,Ae.tween&&!Be&&(Ae.tween.kill(),Ae.tween=0),F&&F.pause(),_&&r&&(r.revert({kill:!1}).invalidate(),r.getChildren&&r.getChildren(!0,!0,!1).forEach(function(Qe){return Qe.vars.immediateRender&&Qe.render(0,!0,!0)})),L.isReverted||L.revert(!0,!0),L._subPinOffset=!1;var Ot=Ie(),st=qe(),Tt=T?T.duration():Di(I,y),Gt=R<=.01||!R,St=0,yt=je||0,ht=Nr(Be)?Be.end:n.end,On=n.endTrigger||h,Ct=Nr(Be)?Be.start:n.start||(n.start===0||!h?0:d?"0 0":"0 100%"),hn=L.pinnedContainer=n.pinnedContainer&&Cn(n.pinnedContainer,L),Zn=h&&Math.max(0,it.indexOf(L))||0,Wt=Zn,Xt,A,W,j,Y,k,ce,Te,Re,we,Ge,We,He;for(N&&Nr(Be)&&(We=Fe.getProperty(O,y.p),He=Fe.getProperty(ne,y.p));Wt-- >0;)k=it[Wt],k.end||k.refresh(0,1)||(ln=L),ce=k.pin,ce&&(ce===h||ce===d||ce===hn)&&!k.isReverted&&(we||(we=[]),we.unshift(k),k.revert(!0,!0)),k!==it[Wt]&&(Zn--,Wt--);for(fn(Ct)&&(Ct=Ct(L)),Ct=np(Ct,"start",L),Se=fp(Ct,h,Ot,y,fe(),de,O,L,st,Q,q,Tt,T,L._startClamp&&"_startClamp")||(d?-.001:0),fn(ht)&&(ht=ht(L)),kn(ht)&&!ht.indexOf("+=")&&(~ht.indexOf(" ")?ht=(kn(Ct)?Ct.split(" ")[0]:"")+ht:(St=xl(ht.substr(2),Ot),ht=kn(Ct)?Ct:(T?Fe.utils.mapRange(0,T.duration(),T.scrollTrigger.start,T.scrollTrigger.end,Se):Se)+St,On=h)),ht=np(ht,"end",L),P=Math.max(Se,fp(ht||(On?"100% 0":Tt),On,Ot,y,fe()+St,re,ne,L,st,Q,q,Tt,T,L._endClamp&&"_endClamp"))||-.001,St=0,Wt=Zn;Wt--;)k=it[Wt],ce=k.pin,ce&&k.start-k._pinPush<=Se&&!T&&k.end>0&&(Xt=k.end-(L._startClamp?Math.max(0,k.start):k.start),(ce===h&&k.start-k._pinPush<Se||ce===hn)&&isNaN(Ct)&&(St+=Xt*(1-k.progress)),ce===d&&(yt+=Xt));if(Se+=St,P+=St,L._startClamp&&(L._startClamp+=St),L._endClamp&&!Sn&&(L._endClamp=P||-.001,P=Math.min(P,Di(I,y))),R=P-Se||(Se-=.01)&&.001,Gt&&(xe=Fe.utils.clamp(0,1,Fe.utils.normalize(Se,P,_e))),L._pinPush=yt,de&&St&&(Xt={},Xt[y.a]="+="+St,hn&&(Xt[y.p]="-="+fe()),Fe.set([de,re],Xt)),d&&!(Mf&&L.end>=Di(I,y)))Xt=ii(d),j=y===Yt,W=fe(),Pe=parseFloat(me(y.a))+yt,!Tt&&P>1&&(Ge=(V?bt.scrollingElement||Gn:I).style,Ge={style:Ge,value:Ge["overflow"+y.a.toUpperCase()]},V&&ii(gt)["overflow"+y.a.toUpperCase()]!=="scroll"&&(Ge.style["overflow"+y.a.toUpperCase()]="scroll")),iu(d,ie,Xt),J=tl(d),A=Wi(d,!0),Te=q&&Er(I,j?En:Yt)(),g?(pe=[g+y.os2,R+yt+qt],pe.t=ie,Wt=g===kt?Vl(d,y)+R+yt:0,Wt&&(pe.push(y.d,Wt+qt),ie.style.flexBasis!=="auto"&&(ie.style.flexBasis=Wt+qt)),Gs(pe),hn&&it.forEach(function(Qe){Qe.pin===hn&&Qe.vars.pinSpacing!==!1&&(Qe._subPinOffset=!0)}),q&&fe(_e)):(Wt=Vl(d,y),Wt&&ie.style.flexBasis!=="auto"&&(ie.style.flexBasis=Wt+qt)),q&&(Y={top:A.top+(j?W-Se:Te)+qt,left:A.left+(j?Te:W-Se)+qt,boxSizing:"border-box",position:"fixed"},Y[Zr]=Y["max"+na]=Math.ceil(A.width)+qt,Y[Kr]=Y["max"+pd]=Math.ceil(A.height)+qt,Y[ni]=Y[ni+Va]=Y[ni+za]=Y[ni+Ha]=Y[ni+ka]="0",Y[kt]=Xt[kt],Y[kt+Va]=Xt[kt+Va],Y[kt+za]=Xt[kt+za],Y[kt+Ha]=Xt[kt+Ha],Y[kt+ka]=Xt[kt+ka],G=Vb(b,Y,C),Sn&&fe(0)),r?(Re=r._initted,Jc(1),r.render(r.duration(),!0,!0),Ue=me(y.a)-Pe+R+yt,ze=Math.abs(R-Ue)>1,q&&ze&&G.splice(G.length-2,2),r.render(0,!0,!0),Re||r.invalidate(!0),r.parent||r.totalTime(r.totalTime()),Jc(0)):Ue=R,Ge&&(Ge.value?Ge.style["overflow"+y.a.toUpperCase()]=Ge.value:Ge.style.removeProperty("overflow-"+y.a));else if(h&&fe()&&!T)for(A=h.parentNode;A&&A!==gt;)A._pinOffset&&(Se-=A._pinOffset,P-=A._pinOffset),A=A.parentNode;we&&we.forEach(function(Qe){return Qe.revert(!1,!0)}),L.start=Se,L.end=P,et=Ye=Sn?_e:fe(),!T&&!Sn&&(et<_e&&fe(_e),L.scroll.rec=0),L.revert(!1,!0),oe=cn(),te&&(Z=-1,te.restart(!0)),ln=0,r&&w&&(r._initted||ve)&&r.progress()!==ve&&r.progress(ve||0,!0).render(r.time(),!0,!0),(Gt||xe!==L.progress||T||_||r&&!r._initted)&&(r&&!w&&(r._initted||xe||r.vars.immediateRender!==!1)&&r.totalProgress(T&&Se<-.001&&!xe?Fe.utils.normalize(Se,P,0):xe,!0),L.progress=Gt||(et-Se)/R===xe?0:xe),d&&g&&(ie._pinOffset=Math.round(L.progress*Ue)),F&&F.invalidate(),isNaN(We)||(We-=Fe.getProperty(O,y.p),He-=Fe.getProperty(ne,y.p),nl(O,y,We),nl(de,y,We-(je||0)),nl(ne,y,He),nl(re,y,He-(je||0))),Gt&&!Sn&&L.update(),u&&!Sn&&!se&&(se=!0,u(L),se=!1)}},L.getVelocity=function(){return(fe()-Ye)/(cn()-Ea)*1e3||0},L.endAnimation=function(){_a(L.callbackAnimation),r&&(F?F.progress(1):r.paused()?w||_a(r,L.direction<0,1):_a(r,r.reversed()))},L.labelToScroll=function(Ee){return r&&r.labels&&(Se||L.refresh()||Se)+r.labels[Ee]/r.duration()*R||0},L.getTrailing=function(Ee){var Ke=it.indexOf(L),Be=L.direction>0?it.slice(0,Ke).reverse():it.slice(Ke+1);return(kn(Ee)?Be.filter(function(je){return je.vars.preventOverlaps===Ee}):Be).filter(function(je){return L.direction>0?je.end<=Se:je.start>=P})},L.update=function(Ee,Ke,Be){if(!(T&&!Be&&!Ee)){var je=Sn===!0?_e:L.scroll(),Ot=Ee?0:(je-Se)/R,st=Ot<0?0:Ot>1?1:Ot||0,Tt=L.progress,Gt,St,yt,ht,On,Ct,hn,Zn;if(Ke&&(Ye=et,et=T?fe():je,x&&(ye=ee,ee=r&&!w?r.totalProgress():st)),m&&d&&!ln&&!jo&&oi&&(!st&&Se<je+(je-Ye)/(cn()-Ea)*m?st=1e-4:st===1&&P>je+(je-Ye)/(cn()-Ea)*m&&(st=.9999)),st!==Tt&&L.enabled){if(Gt=L.isActive=!!st&&st<1,St=!!Tt&&Tt<1,Ct=Gt!==St,On=Ct||!!st!=!!Tt,L.direction=st>Tt?1:-1,L.progress=st,On&&!ln&&(yt=st&&!Tt?0:st===1?1:Tt===1?2:3,w&&(ht=!Ct&&H[yt+1]!=="none"&&H[yt+1]||H[yt],Zn=r&&(ht==="complete"||ht==="reset"||ht in r))),M&&(Ct||Zn)&&(Zn||f||!r)&&(fn(M)?M(L):L.getTrailing(M).forEach(function(W){return W.endAnimation()})),w||(F&&!ln&&!jo?(F._dp._time-F._start!==F._time&&F.render(F._dp._time-F._start),F.resetTo?F.resetTo("totalProgress",st,r._tTime/r._tDur):(F.vars.totalProgress=st,F.invalidate().restart())):r&&r.totalProgress(st,!!(ln&&(oe||Ee)))),d){if(Ee&&g&&(ie.style[g+y.os2]=le),!q)he(ba(Pe+Ue*st));else if(On){if(hn=!Ee&&st>Tt&&P+1>je&&je+1>=Di(I,y),C)if(!Ee&&(Gt||hn)){var Wt=Wi(d,!0),Xt=je-Se;dp(d,gt,Wt.top+(y===Yt?Xt:0)+qt,Wt.left+(y===Yt?0:Xt)+qt)}else dp(d,ie);Gs(Gt||hn?G:J),ze&&st<1&&Gt||he(Pe+(st===1&&!hn?Ue:0))}}x&&!Ae.tween&&!ln&&!jo&&te.restart(!0),o&&(Ct||v&&st&&(st<1||!Qc))&&ao(o.targets).forEach(function(W){return W.classList[Gt||v?"add":"remove"](o.className)}),a&&!w&&!Ee&&a(L),On&&!ln?(w&&(Zn&&(ht==="complete"?r.pause().totalProgress(1):ht==="reset"?r.restart(!0).pause():ht==="restart"?r.restart(!0):r[ht]()),a&&a(L)),(Ct||!Qc)&&(c&&Ct&&tu(L,c),X[yt]&&tu(L,X[yt]),v&&(st===1?L.kill(!1,1):X[yt]=0),Ct||(yt=st===1?1:3,X[yt]&&tu(L,X[yt]))),E&&!Gt&&Math.abs(L.getVelocity())>(Da(E)?E:2500)&&(_a(L.callbackAnimation),F?F.progress(1):_a(r,ht==="reverse"?1:!st,1))):w&&a&&!ln&&a(L)}if(De){var A=T?je/T.duration()*(T._caScrollDist||0):je;Ve(A+(O._isFlipped?1:0)),De(A)}ke&&ke(-je/T.duration()*(T._caScrollDist||0))}},L.enable=function(Ee,Ke){L.enabled||(L.enabled=!0,Jt(I,"resize",Ca),V||Jt(I,"scroll",ws),ae&&Jt(i,"refreshInit",ae),Ee!==!1&&(L.progress=xe=0,et=Ye=Z=fe()),Ke!==!1&&L.refresh())},L.getTween=function(Ee){return Ee&&Ae?Ae.tween:F},L.setPositions=function(Ee,Ke,Be,je){if(T){var Ot=T.scrollTrigger,st=T.duration(),Tt=Ot.end-Ot.start;Ee=Ot.start+Tt*Ee/st,Ke=Ot.start+Tt*Ke/st}L.refresh(!1,!1,{start:ip(Ee,Be&&!!L._startClamp),end:ip(Ke,Be&&!!L._endClamp)},je),L.update()},L.adjustPinSpacing=function(Ee){if(pe&&Ee){var Ke=pe.indexOf(y.d)+1;pe[Ke]=parseFloat(pe[Ke])+Ee+qt,pe[1]=parseFloat(pe[1])+Ee+qt,Gs(pe)}},L.disable=function(Ee,Ke){if(L.enabled&&(Ee!==!1&&L.revert(!0,!0),L.enabled=L.isActive=!1,Ke||F&&F.pause(),_e=0,Ne&&(Ne.uncache=1),ae&&Kt(i,"refreshInit",ae),te&&(te.pause(),Ae.tween&&Ae.tween.kill()&&(Ae.tween=0)),!V)){for(var Be=it.length;Be--;)if(it[Be].scroller===I&&it[Be]!==L)return;Kt(I,"resize",Ca),V||Kt(I,"scroll",ws)}},L.kill=function(Ee,Ke){L.disable(Ee,Ke),F&&!Ke&&F.kill(),l&&delete Ef[l];var Be=it.indexOf(L);Be>=0&&it.splice(Be,1),Be===xn&&yl>0&&xn--,Be=0,it.forEach(function(je){return je.scroller===L.scroller&&(Be=1)}),Be||Sn||(L.scroll.rec=0),r&&(r.scrollTrigger=null,Ee&&r.revert({kill:!1}),Ke||r.kill()),de&&[de,re,O,ne].forEach(function(je){return je.parentNode&&je.parentNode.removeChild(je)}),Ga===L&&(Ga=0),d&&(Ne&&(Ne.uncache=1),Be=0,it.forEach(function(je){return je.pin===d&&Be++}),Be||(Ne.spacer=0)),n.onKill&&n.onKill(L)},it.push(L),L.enable(!1,!1),Je&&Je(L),r&&r.add&&!R){var Ze=L.update;L.update=function(){L.update=Ze,ot.cache++,Se||P||L.refresh()},Fe.delayedCall(.01,L.update),R=.01,Se=P=0}else L.refresh();d&&Bb()},i.register=function(n){return Rs||(Fe=n||Mg(),yg()&&window.document&&i.enable(),Rs=Ta),Rs},i.defaults=function(n){if(n)for(var r in n)Qo[r]=n[r];return Qo},i.disable=function(n,r){Ta=0,it.forEach(function(a){return a[r?"kill":"disable"](n)}),Kt(at,"wheel",ws),Kt(bt,"scroll",ws),clearInterval($o),Kt(bt,"touchcancel",yi),Kt(gt,"touchstart",yi),Ko(Kt,bt,"pointerdown,touchstart,mousedown",rp),Ko(Kt,bt,"pointerup,touchend,mouseup",sp),zl.kill(),Zo(Kt);for(var s=0;s<ot.length;s+=3)Jo(Kt,ot[s],ot[s+1]),Jo(Kt,ot[s],ot[s+2])},i.enable=function(){if(at=window,bt=document,Gn=bt.documentElement,gt=bt.body,Fe&&(ao=Fe.utils.toArray,Ba=Fe.utils.clamp,yf=Fe.core.context||yi,Jc=Fe.core.suppressOverwrites||yi,ud=at.history.scrollRestoration||"auto",Tf=at.pageYOffset||0,Fe.core.globals("ScrollTrigger",i),gt)){Ta=1,Hs=document.createElement("div"),Hs.style.height="100vh",Hs.style.position="absolute",Pg(),Pb(),Nt.register(Fe),i.isTouch=Nt.isTouch,sr=Nt.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),Sf=Nt.isTouch===1,Jt(at,"wheel",ws),cd=[at,bt,Gn,gt],Fe.matchMedia?(i.matchMedia=function(c){var u=Fe.matchMedia(),f;for(f in c)u.add(f,c[f]);return u},Fe.addEventListener("matchMediaInit",function(){return gd()}),Fe.addEventListener("matchMediaRevert",function(){return wg()}),Fe.addEventListener("matchMedia",function(){Wr(0,1),os("matchMedia")}),Fe.matchMedia().add("(orientation: portrait)",function(){return nu(),nu})):console.warn("Requires GSAP 3.11.0 or later"),nu(),Jt(bt,"scroll",ws);var n=gt.hasAttribute("style"),r=gt.style,s=r.borderTopStyle,a=Fe.core.Animation.prototype,o,l;for(a.revert||Object.defineProperty(a,"revert",{value:function(){return this.time(-.01,!0)}}),r.borderTopStyle="solid",o=Wi(gt),Yt.m=Math.round(o.top+Yt.sc())||0,En.m=Math.round(o.left+En.sc())||0,s?r.borderTopStyle=s:r.removeProperty("border-top-style"),n||(gt.setAttribute("style",""),gt.removeAttribute("style")),$o=setInterval(lp,250),Fe.delayedCall(.5,function(){return jo=0}),Jt(bt,"touchcancel",yi),Jt(gt,"touchstart",yi),Ko(Jt,bt,"pointerdown,touchstart,mousedown",rp),Ko(Jt,bt,"pointerup,touchend,mouseup",sp),xf=Fe.utils.checkPrefix("transform"),Ml.push(xf),Rs=cn(),zl=Fe.delayedCall(.2,Wr).pause(),Ps=[bt,"visibilitychange",function(){var c=at.innerWidth,u=at.innerHeight;bt.hidden?(ep=c,tp=u):(ep!==c||tp!==u)&&Ca()},bt,"DOMContentLoaded",Wr,at,"load",Wr,at,"resize",Ca],Zo(Jt),it.forEach(function(c){return c.enable(0,1)}),l=0;l<ot.length;l+=3)Jo(Kt,ot[l],ot[l+1]),Jo(Kt,ot[l],ot[l+2])}},i.config=function(n){"limitCallbacks"in n&&(Qc=!!n.limitCallbacks);var r=n.syncInterval;r&&clearInterval($o)||($o=r)&&setInterval(lp,r),"ignoreMobileResize"in n&&(Sf=i.isTouch===1&&n.ignoreMobileResize),"autoRefreshEvents"in n&&(Zo(Kt)||Zo(Jt,n.autoRefreshEvents||"none"),vg=(n.autoRefreshEvents+"").indexOf("resize")===-1)},i.scrollerProxy=function(n,r){var s=Cn(n),a=ot.indexOf(s),o=ss(s);~a&&ot.splice(a,o?6:2),r&&(o?Ai.unshift(at,r,gt,r,Gn,r):Ai.unshift(s,r))},i.clearMatchMedia=function(n){it.forEach(function(r){return r._ctx&&r._ctx.query===n&&r._ctx.kill(!0,!0)})},i.isInViewport=function(n,r,s){var a=(kn(n)?Cn(n):n).getBoundingClientRect(),o=a[s?Zr:Kr]*r||0;return s?a.right-o>0&&a.left+o<at.innerWidth:a.bottom-o>0&&a.top+o<at.innerHeight},i.positionInViewport=function(n,r,s){kn(n)&&(n=Cn(n));var a=n.getBoundingClientRect(),o=a[s?Zr:Kr],l=r==null?o/2:r in Hl?Hl[r]*o:~r.indexOf("%")?parseFloat(r)*o/100:parseFloat(r)||0;return s?(a.left+l)/at.innerWidth:(a.top+l)/at.innerHeight},i.killAll=function(n){if(it.slice(0).forEach(function(s){return s.vars.id!=="ScrollSmoother"&&s.kill()}),n!==!0){var r=as.killAll||[];as={},r.forEach(function(s){return s()})}},i}();lt.version="3.13.0";lt.saveStyles=function(i){return i?ao(i).forEach(function(e){if(e&&e.style){var t=zn.indexOf(e);t>=0&&zn.splice(t,5),zn.push(e,e.style.cssText,e.getBBox&&e.getAttribute("transform"),Fe.core.getCache(e),yf())}}):zn};lt.revert=function(i,e){return gd(!i,e)};lt.create=function(i,e){return new lt(i,e)};lt.refresh=function(i){return i?Ca(!0):(Rs||lt.register())&&Wr(!0)};lt.update=function(i){return++ot.cache&&Zi(i===!0?2:0)};lt.clearScrollMemory=Rg;lt.maxScroll=function(i,e){return Di(i,e?En:Yt)};lt.getScrollFunc=function(i,e){return Er(Cn(i),e?En:Yt)};lt.getById=function(i){return Ef[i]};lt.getAll=function(){return it.filter(function(i){return i.vars.id!=="ScrollSmoother"})};lt.isScrolling=function(){return!!oi};lt.snapDirectional=md;lt.addEventListener=function(i,e){var t=as[i]||(as[i]=[]);~t.indexOf(e)||t.push(e)};lt.removeEventListener=function(i,e){var t=as[i],n=t&&t.indexOf(e);n>=0&&t.splice(n,1)};lt.batch=function(i,e){var t=[],n={},r=e.interval||.016,s=e.batchMax||1e9,a=function(c,u){var f=[],h=[],d=Fe.delayedCall(r,function(){u(f,h),f=[],h=[]}).pause();return function(g){f.length||d.restart(!0),f.push(g.trigger),h.push(g),s<=f.length&&d.progress(1)}},o;for(o in e)n[o]=o.substr(0,2)==="on"&&fn(e[o])&&o!=="onRefreshInit"?a(o,e[o]):e[o];return fn(s)&&(s=s(),Jt(lt,"refresh",function(){return s=e.batchMax()})),ao(i).forEach(function(l){var c={};for(o in n)c[o]=n[o];c.trigger=l,t.push(lt.create(c))}),t};var pp=function(e,t,n,r){return t>r?e(r):t<0&&e(0),n>r?(r-t)/(n-t):n<0?t/(t-n):1},ru=function i(e,t){t===!0?e.style.removeProperty("touch-action"):e.style.touchAction=t===!0?"auto":t?"pan-"+t+(Nt.isTouch?" pinch-zoom":""):"none",e===Gn&&i(gt,t)},il={auto:1,scroll:1},Gb=function(e){var t=e.event,n=e.target,r=e.axis,s=(t.changedTouches?t.changedTouches[0]:t).target,a=s._gsap||Fe.core.getCache(s),o=cn(),l;if(!a._isScrollT||o-a._isScrollT>2e3){for(;s&&s!==gt&&(s.scrollHeight<=s.clientHeight&&s.scrollWidth<=s.clientWidth||!(il[(l=ii(s)).overflowY]||il[l.overflowX]));)s=s.parentNode;a._isScroll=s&&s!==n&&!ss(s)&&(il[(l=ii(s)).overflowY]||il[l.overflowX]),a._isScrollT=o}(a._isScroll||r==="x")&&(t.stopPropagation(),t._gsapAllow=!0)},Fg=function(e,t,n,r){return Nt.create({target:e,capture:!0,debounce:!1,lockAxis:!0,type:t,onWheel:r=r&&Gb,onPress:r,onDrag:r,onScroll:r,onEnable:function(){return n&&Jt(bt,Nt.eventTypes[0],gp,!1,!0)},onDisable:function(){return Kt(bt,Nt.eventTypes[0],gp,!0)}})},Wb=/(input|label|select|textarea)/i,mp,gp=function(e){var t=Wb.test(e.target.tagName);(t||mp)&&(e._gsapAllow=!0,mp=t)},Xb=function(e){Nr(e)||(e={}),e.preventDefault=e.isNormalizer=e.allowClicks=!0,e.type||(e.type="wheel,touch"),e.debounce=!!e.debounce,e.id=e.id||"normalizer";var t=e,n=t.normalizeScrollX,r=t.momentum,s=t.allowNestedScroll,a=t.onRelease,o,l,c=Cn(e.target)||Gn,u=Fe.core.globals().ScrollSmoother,f=u&&u.get(),h=sr&&(e.content&&Cn(e.content)||f&&e.content!==!1&&!f.smooth()&&f.content()),d=Er(c,Yt),g=Er(c,En),_=1,m=(Nt.isTouch&&at.visualViewport?at.visualViewport.scale*at.visualViewport.width:at.outerWidth)/at.innerWidth,p=0,S=fn(r)?function(){return r(o)}:function(){return r||2.8},v,x,C=Fg(c,e.type,!0,s),D=function(){return x=!1},T=yi,E=yi,M=function(){l=Di(c,Yt),E=Ba(sr?1:0,l),n&&(T=Ba(0,Di(c,En))),v=Jr},y=function(){h._gsap.y=ba(parseFloat(h._gsap.y)+d.offset)+"px",h.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+parseFloat(h._gsap.y)+", 0, 1)",d.offset=d.cacheID=0},w=function(){if(x){requestAnimationFrame(D);var N=ba(o.deltaY/2),Q=E(d.v-N);if(h&&Q!==d.v+d.offset){d.offset=Q-d.v;var L=ba((parseFloat(h&&h._gsap.y)||0)-d.offset);h.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+L+", 0, 1)",h._gsap.y=L+"px",d.cacheID=ot.cache,Zi()}return!0}d.offset&&y(),x=!0},I,U,V,q,X=function(){M(),I.isActive()&&I.vars.scrollY>l&&(d()>l?I.progress(1)&&d(l):I.resetTo("scrollY",l))};return h&&Fe.set(h,{y:"+=0"}),e.ignoreCheck=function(H){return sr&&H.type==="touchmove"&&w()||_>1.05&&H.type!=="touchstart"||o.isGesturing||H.touches&&H.touches.length>1},e.onPress=function(){x=!1;var H=_;_=ba((at.visualViewport&&at.visualViewport.scale||1)/m),I.pause(),H!==_&&ru(c,_>1.01?!0:n?!1:"x"),U=g(),V=d(),M(),v=Jr},e.onRelease=e.onGestureStart=function(H,N){if(d.offset&&y(),!N)q.restart(!0);else{ot.cache++;var Q=S(),L,ae;n&&(L=g(),ae=L+Q*.05*-H.velocityX/.227,Q*=pp(g,L,ae,Di(c,En)),I.vars.scrollX=T(ae)),L=d(),ae=L+Q*.05*-H.velocityY/.227,Q*=pp(d,L,ae,Di(c,Yt)),I.vars.scrollY=E(ae),I.invalidate().duration(Q).play(.01),(sr&&I.vars.scrollY>=l||L>=l-1)&&Fe.to({},{onUpdate:X,duration:Q})}a&&a(H)},e.onWheel=function(){I._ts&&I.pause(),cn()-p>1e3&&(v=0,p=cn())},e.onChange=function(H,N,Q,L,ae){if(Jr!==v&&M(),N&&n&&g(T(L[2]===N?U+(H.startX-H.x):g()+N-L[1])),Q){d.offset&&y();var Ie=ae[2]===Q,qe=Ie?V+H.startY-H.y:d()+Q-ae[1],Z=E(qe);Ie&&qe!==Z&&(V+=Z-qe),d(Z)}(Q||N)&&Zi()},e.onEnable=function(){ru(c,n?!1:"x"),lt.addEventListener("refresh",X),Jt(at,"resize",X),d.smooth&&(d.target.style.scrollBehavior="auto",d.smooth=g.smooth=!1),C.enable()},e.onDisable=function(){ru(c,!0),Kt(at,"resize",X),lt.removeEventListener("refresh",X),C.kill()},e.lockAxis=e.lockAxis!==!1,o=new Nt(e),o.iOS=sr,sr&&!d()&&d(1),sr&&Fe.ticker.add(yi),q=o._dc,I=Fe.to(o,{ease:"power4",paused:!0,inherit:!1,scrollX:n?"+=0.1":"+=0",scrollY:"+=0.1",modifiers:{scrollY:Lg(d,d(),function(){return I.pause()})},onUpdate:Zi,onComplete:q.vars.onComplete}),o};lt.sort=function(i){if(fn(i))return it.sort(i);var e=at.pageYOffset||0;return lt.getAll().forEach(function(t){return t._sortY=t.trigger?e+t.trigger.getBoundingClientRect().top:t.start+at.innerHeight}),it.sort(i||function(t,n){return(t.vars.refreshPriority||0)*-1e6+(t.vars.containerAnimation?1e6:t._sortY)-((n.vars.containerAnimation?1e6:n._sortY)+(n.vars.refreshPriority||0)*-1e6)})};lt.observe=function(i){return new Nt(i)};lt.normalizeScroll=function(i){if(typeof i>"u")return vn;if(i===!0&&vn)return vn.enable();if(i===!1){vn&&vn.kill(),vn=i;return}var e=i instanceof Nt?i:Xb(i);return vn&&vn.target===e.target&&vn.kill(),ss(e.target)&&(vn=e),e};lt.core={_getVelocityProp:vf,_inputObserver:Fg,_scrollers:ot,_proxies:Ai,bridge:{ss:function(){oi||os("scrollStart"),oi=cn()},ref:function(){return ln}}};Mg()&&Fe.registerPlugin(lt);/*!
 * strings: 3.13.0
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var qb=/(?:^\s+|\s+$)/g,Yb=/([\uD800-\uDBFF][\uDC00-\uDFFF](?:[\u200D\uFE0F][\uD800-\uDBFF][\uDC00-\uDFFF]){2,}|\uD83D\uDC69(?:\u200D(?:(?:\uD83D\uDC69\u200D)?\uD83D\uDC67|(?:\uD83D\uDC69\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2642\u2640]\uFE0F|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDD27\uDCBC\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC6F\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3C-\uDD3E\uDDD6-\uDDDF])\u200D[\u2640\u2642]\uFE0F|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|(?:\u26F9|\uD83C[\uDFCC\uDFCB]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])\uFE0F|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC69\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708]))\uFE0F|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83D\uDC69\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\u200D(?:(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F)/;function Ig(i){var e=i.nodeType,t="";if(e===1||e===9||e===11){if(typeof i.textContent=="string")return i.textContent;for(i=i.firstChild;i;i=i.nextSibling)t+=Ig(i)}else if(e===3||e===4)return i.nodeValue;return t}function Df(i,e,t,n,r){for(var s=i.firstChild,a=[],o;s;)s.nodeType===3?(o=(s.nodeValue+"").replace(/^\n+/g,""),n||(o=o.replace(/\s+/g," ")),a.push.apply(a,Og(o,e,t,n,r))):(s.nodeName+"").toLowerCase()==="br"?a[a.length-1]+="<br>":a.push(s.outerHTML),s=s.nextSibling;if(!r)for(o=a.length;o--;)a[o]==="&"&&a.splice(o,1,"&amp;");return a}function Og(i,e,t,n,r){if(i+="",t&&(i=i.trim?i.trim():i.replace(qb,"")),e&&e!=="")return i.replace(/>/g,"&gt;").replace(/</g,"&lt;").split(e);for(var s=[],a=i.length,o=0,l,c;o<a;o++)c=i.charAt(o),(c.charCodeAt(0)>=55296&&c.charCodeAt(0)<=56319||i.charCodeAt(o+1)>=65024&&i.charCodeAt(o+1)<=65039)&&(l=((i.substr(o,12).split(Yb)||[])[1]||"").length||2,c=i.substr(o,l),s.emoji=1,o+=l-1),s.push(r?c:c===">"?"&gt;":c==="<"?"&lt;":n&&c===" "&&(i.charAt(o-1)===" "||i.charAt(o+1)===" ")?"&nbsp;":c);return s}/*!
 * TextPlugin 3.13.0
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var Aa,rl,$b=function(){return Aa||typeof window<"u"&&(Aa=window.gsap)&&Aa.registerPlugin&&Aa},Kl={version:"3.13.0",name:"text",init:function(e,t,n){typeof t!="object"&&(t={value:t});var r=e.nodeName.toUpperCase(),s=this,a=t,o=a.newClass,l=a.oldClass,c=a.preserveSpaces,u=a.rtl,f=s.delimiter=t.delimiter||"",h=s.fillChar=t.fillChar||(t.padSpace?"&nbsp;":""),d,g,_,m,p,S,v,x;if(s.svg=e.getBBox&&(r==="TEXT"||r==="TSPAN"),!("innerHTML"in e)&&!s.svg)return!1;if(s.target=e,!("value"in t)){s.text=s.original=[""];return}for(_=Df(e,f,!1,c,s.svg),rl||(rl=document.createElement("div")),rl.innerHTML=t.value,g=Df(rl,f,!1,c,s.svg),s.from=n._from,(s.from||u)&&!(u&&s.from)&&(r=_,_=g,g=r),s.hasClass=!!(o||l),s.newClass=u?l:o,s.oldClass=u?o:l,r=_.length-g.length,d=r<0?_:g,r<0&&(r=-r);--r>-1;)d.push(h);if(t.type==="diff"){for(m=0,p=[],S=[],v="",r=0;r<g.length;r++)x=g[r],x===_[r]?v+=x:(p[m]=v+x,S[m++]=v+_[r],v="");g=p,_=S,v&&(g.push(v),_.push(v))}t.speed&&n.duration(Math.min(.05/t.speed*d.length,t.maxDuration||9999)),s.rtl=u,s.original=_,s.text=g,s._props.push("text")},render:function(e,t){e>1?e=1:e<0&&(e=0),t.from&&(e=1-e);var n=t.text,r=t.hasClass,s=t.newClass,a=t.oldClass,o=t.delimiter,l=t.target,c=t.fillChar,u=t.original,f=t.rtl,h=n.length,d=(f?1-e:e)*h+.5|0,g,_,m;r&&e?(g=s&&d,_=a&&d!==h,m=(g?"<span class='"+s+"'>":"")+n.slice(0,d).join(o)+(g?"</span>":"")+(_?"<span class='"+a+"'>":"")+o+u.slice(d).join(o)+(_?"</span>":"")):m=n.slice(0,d).join(o)+o+u.slice(d).join(o),t.svg?l.textContent=m:l.innerHTML=c==="&nbsp;"&&~m.indexOf("  ")?m.split("  ").join("&nbsp;&nbsp;"):m}};Kl.splitInnerHTML=Df;Kl.emojiSafeSplit=Og;Kl.getText=Ig;$b()&&Aa.registerPlugin(Kl);export{nD as A,An as B,ct as C,tD as D,gD as E,oD as F,Po as G,_D as H,SD as I,lt as J,Kl as K,e0 as L,Qb as M,mD as N,sD as O,yn as P,hi as S,aD as T,rD as W,Eb as a,Mb as b,hD as c,uD as d,_l as e,pD as f,fD as g,HE as h,Zb as i,eD as j,Yi as k,Fp as l,dD as m,yb as n,fo as o,Li as p,Ci as q,Kb as r,n0 as s,vd as t,lD as u,Jb as v,cD as w,iD as x,xD as y,vD as z};
