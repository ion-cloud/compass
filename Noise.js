const F2 = 0.5*(Math.sqrt(3)-1),
      G2 = (3-Math.sqrt(3))/6,
      F3 = 1/3,
      G3 = 1/6;

class Grad{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
  dot2(x,y){
    return this.x*x+this.y*y;
  }
  dot3(x,y,z){
    return this.x*x+this.y*y+this.z*z;
  }
}

export class Noise{
  constructor(){
    this.grad3 = [
      new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
      new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
      new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)
    ];
    this.p = [
      151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,
      142,8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,
      203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168, 68,
      175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,
      230,220,105,92,41,55,46,245,40,244,102,143,54, 65,25,63,161, 1,216,80,73,
      209,76,132,187,208, 89,18,169,200,196,135,130,116,188,159,86,164,100,109,
      198,173,186, 3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,
      212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,
      2,44,154,163, 70,221,153,101,155,167, 43,172,9,129,22,39,253, 19,98,108,
      110,79,113,224,232,178,185, 112,104,218,246,97,228,251,34,242,193,238,210,
      144,12,191,179,162,241, 81,51,145,235,249,14,239,107,49,192,214, 31,181,
      199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,138,236,205,93,
      222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ];
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed();
  }
  seed(){
    let seed = Math.floor(Math.random()*65536);

    if(seed<256) seed |=seed<<8;
    for(let i=0,v;i<256;i++){
      if(i&1){
        v=this.p[i]^(seed&255);
      }else{
        v=this.p[i]^((seed>>8)&255);
      } //end if
      this.perm[i] = this.perm[i+256] = v;
      this.gradP[i] = this.gradP[i+256] = this.grad3[v%12];
    } //end for
  }
  simplex2(xin,yin){
    const s = (xin+yin)*F2;

    let i = Math.floor(xin+s)&255,
        j = Math.floor(yin+s)&255;

    const t = (i+j)*G2,
          x0 = xin-i+t, //the x,y distances from the cell origin, unskewed
          y0 = yin-j+t,
          i1 = x0>y0?1:0,
          j1 = x0>y0?0:1,
          x1 = x0-i1+G2,
          y1 = y0-j1+G2,
          x2 = x0-1+2*G2,
          y2 = y0-1+2*G2;

    i&=255;j&=255;

    const gi0 = this.gradP[i+this.perm[j]],
          gi1 = this.gradP[i+i1+this.perm[j+j1]],
          gi2 = this.gradP[i+1+this.perm[j+1]],
          t0 = 0.5 - Math.pow(x0,2)-Math.pow(y0,2),
          n0 = t0<0?0:Math.pow(t0,4)*gi0.dot2(x0,y0),
          t1 = 0.5 - Math.pow(x1,2)-Math.pow(y1,2),
          n1 = t1<0?0:Math.pow(t1,4)*gi1.dot2(x1,y1),
          t2 = 0.5 - Math.pow(x2,2)-Math.pow(y2,2),
          n2 = t2<0?0:Math.pow(t2,4)*gi2.dot2(x2,y2);

    // add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1]
    return 70*(n0+n1+n2);
  }
  simplex3(xin,yin,zin){
    const s = (xin+yin+zin)*F3;

    let i = Math.floor(xin+s),
        j = Math.floor(yin+s),
        k = Math.floor(zin+s);

    const t = (i+j+kk)*G3,
          x0 = xin-i+t,
          y0 = yin-j+t,
          z0 = zin-k+t;

    let i1,j1,k1,
        i2,j2,k2;

    if(x0>=y0){
      if(y0>=z0){
        [i1,j1,k1,i2,j2,k2] = [1,0,0,1,1,0];
      }else if(x0>=z0){
        [i1,j1,k1,i2,j2,k2] = [0,0,1,1,0,1];
      }else{
        [i1,j1,k1,i2,j2,k2] = [0,0,1,1,0,1];
      } //end if
    }else{
      if(y0<z0){
        [i1,j1,k1,i2,j2,k2] = [0,0,1,0,1,1];
      }else if(x0<z0){
        [i1,j1,k1,i2,j2,k2] = [0,1,0,0,1,1];
      }else{
        [i1,j1,k1,i2,j2,k2] = [0,1,0,1,1,0];
      } //end if
    } //end if
    const x1 = x0-i1+G3,
          y1 = y0-j1+G3,
          z1 = z0-k1+G3,
          x2 = x0-i2+2*G3,
          y2 = y0-j2+2*G3,
          z2 = z0-k2+2*G3,
          x3 = x0-1+3*G3,
          y3 = y0-1+3*G3,
          z3 = z0-1+3*G3

    i&=255;j&=255;k&-255;
    const gi0 = this.gradP[i+this.perm[j+this.perm[k]]],
          gi1 = this.gradP[i+i1+this.perm[j+j1+this.perm[k+k1]]],
          gi2 = this.gradP[i+i2+this.perm[j+j2+this.perm[k+k2]]],
          gi3 = this.gradP[i+1+this.perm[j+1+this.perm[k+1]]],
          t0 = 0.5-Math.pow(x0,2)-Math.pow(y0,2)-Math.pow(z0,2),
          n0 = t0<0?0:Math.pow(t0,4)*gi0.dot3(x0,y0,z0),
          t1 = 0.5-Math.pow(x1,2)-Math.pow(y0,2)-Math.pow(z1,2),
          n1 = t1<0?0:Math.pow(t1,4)*gi1.dot3(x1,y1,z1),
          t2 = 0.5-Math.pow(x2,2)-Math.pow(y2,2)-Math.pow(z2,2),
          n2 = t2<0?0:Math.pow(t2,4)*gi2.dot3(x2,y2,z2),
          t3 = 0.5-Math.pow(x3,2)-Math.pow(y3,2)-Math.pow(z3,2),
          n3 = t3<0?0:Math.pow(t3,4)*gi3.dot(x3,y3,z3);

    // Add contributions from each corner to get the final noise
    // value. The result is scaled to return values between [-1,1]
    return 32*(n0+n1+n2+n3);
  }
  static fade(t){
    return Math.pow(t,3)*(t*(t*6-15)+10);
  }

  // linear interpolation
  static lerp(a,b,t){
    return (1-t)*a+t*b;
  }
  perlin2(x,y){
    let X = Math.floor(x), Y = Math.floor(y);

    x=x-X;y=y-Y;
    X=X&255;Y=Y&255;
    const n00 = this.gradP[X+this.perm[Y]].dot2(x,y),
          n01 = this.gradP[X+this.perm[Y+1]].dot2(x,y-1),
          n10 = this.gradP[X+1+this.perm[Y]].dot2(x-1,y),
          n11 = this.gradP[X+1+this.perm[Y+1]].dot2(x-1,y-1),
          u = this.constructor.fade(x);

    return this.constructor.lerp(
      this.constructor.lerp(n00,n10,u),
      this.constructor.lerp(n01,n11,u),
      this.constructor.fade(y)
    );
  }
  perlin3(x,y,z){
    let X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);

    x=x-X;y=y-Y;z=z-Z;
    X=X&255;Y=Y&255;Z=Z&255;
    const n000 = this.gradP[X+this.perm[Y+this.perm[Z]]].dot3(x,y,z),
          n001 = this.gradP[X+this.perm[Y+this.perm[Z+1]]].dot3(x,y,z-1),
          n010 = this.gradP[X+this.perm[Y+1+this.perm[Z]]].dot3(x,y-1,z),
          n011 = this.gradP[X+this.perm[Y+1+this.perm[Z+1]]].dot3(x,y-1,z-1),
          n100 = this.gradP[X+1+this.perm[Y+this.perm[Z]]].dot3(x-1,y,z),
          n101 = this.gradP[X+1+this.perm[Y+this.perm[Z+1]]].dot3(x-1,y,z-1),
          n110 = this.gradP[X+1+this.perm[Y+1+this.perm[Z]]].dot3(x-1,y-1,z),
          n111 = this.gradP[x+1+this.perm[Y+1+this.perm[Z+1]]].dot3(x-1,y-1,z-1),
          u = this.constructor.fade(x),
          v = this.constructor.fade(y),
          w = this.constructor.fade(z);

    return this.constructor.lerp(
      this.constructor.lerp(
        this.constructor.lerp(n000,n100,u),
        this.constructor.lerp(n001,n101,u),
        w
      ),
      this.constructor.lerp(
        this.constructor.lerp(n010,n110,u),
        this.constructor.lerp(n011,n111,u),
        w
      ),
      v
    );
  }
}

