/*
* Shaderto
* https://www.shadertoy.com/view/MtKXRh
*/

#define PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uFrequenceAverage;
uniform float uFrequenceBassAverage;
uniform float uFrequenceMidAverage;
uniform float uFrequenceHightAverage;
uniform float uColorChange;
uniform float uCurrentStep;
uniform float uShot;

varying vec2 vUv;
varying vec4 vTexture;


//  Classic Perlin 2D Noise 
//  by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}


vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}


float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439 ) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main()
{

    float tCur = uTime * 0.01;
    vec2 p = vUv * 0.01;
    vec2 vUv2 = vUv * vec2(2.0 );

    vec2 wavedUv = vec2(
        vUv.x,
        vUv.y + sin(vUv.x * 7.0 ) * 0.5 * cos(vUv.y * 2.0 + uTime * -0.0001)
    );

    float strength = 1.0;
    float strength2 = 1.0;

    
    vec3 color = vec3(  strength2 );

    // color = vec3(uColorChange);
    // Stripes
    float stripes = mod((vUv2.y - uTime * 0.00005 )* 20.0, 1.0);
    stripes = pow(stripes, 3.0);
    stripes = 1.0;

    if(uCurrentStep == 0.0)
    {
        // Blanc little effect
        strength2 =  sin(cnoise( (mod(vUv2 * 100.0 ,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 6.0 + uTime * 0.0001 ) * 100.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;

        // TO DO : 0.1 to animate from 0 -> 0.1
        strength2 = 1.0 - (strength2 * 0.1);

        color = vec3(strength2);
    }
    else if(uCurrentStep == 1.0)
    {
        // rott and wander
        strength2 = uColorChange * 1.0 +  sin(cnoise( (mod(vUv2 * 100.0 ,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 6.0 + uTime * 0.0001 ) * 100.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;
        float strength2R = uColorChange * 1.0 +  sin(cnoise( (mod((vUv2 + vec2(uShot * 0.1)) * 100.0 ,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 6.0 + uTime * 0.0001 ) * 100.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;


        // strength2 = (pow(cnoise(wavedUv * 10.0), 2.0) + cnoise(vUv * 10.0 * uFrequenceBassAverage + uTime * 0.005))  * uFrequenceBassAverage * 0.001 ;
        // strength2 = strength2 * mod(vUv.y * 10.0, 1.0);

        color = vec3(
            strength2R,
            strength2,
            strength2
        );
    }
    else if(uCurrentStep > 1.0 && uCurrentStep <= 2.0) {
        // Explosion

        float mixStrength = mix(100.0, 4.0, (uCurrentStep - 1.0));
        mixStrength = mix(100.0, 1.0, uFrequenceBassAverage * 1.5);


        strength2 = uColorChange * 1.0 +  sin(cnoise( (mod(vUv2 * mixStrength,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 6.0 + uTime * 0.0001 ) * 100.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;


        color = vec3(
            strength2 , 
            strength2 , 
            strength2  
        );
    }
    else if(uCurrentStep > 2.0 && uCurrentStep <= 3.0) {

        // Under water bliss
        float mixStrengthYo = mix(100.0, 1.0, uFrequenceBassAverage * 1.5);

        float strengthOld = uColorChange * 1.0 +  sin(cnoise( (mod(vUv2 * mixStrengthYo,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 6.0 + uTime * 0.0001 ) * 100.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;
        // strength = sin(cnoise((mod(vUv2 +cos(uTime * 0.01) * uTime * 0.000001 , 1.0) * vUv2 - uTime * 0.01 * step(0.0, 0.5)) * 10.0) * 20.0 * 5.0 * 10.0 * 0.01);
        // strength2 = sin(cnoise( (mod(vUv2 * 200.0 ,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 6.0 + uTime * 0.0001 ) * 100.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;
        // strength2 = sin(cnoise( (mod(vUv2 * 200.0 ,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.0001 ) * cnoise( sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 6.0 + uTime * 0.0001 ) * 100.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;
        strength2 =  1.2 * sin( cnoise( (mod((vUv2) * 200.0 ,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.00001 ) * cnoise( sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 10.1 + uTime * 0.0001 ) * 100.0 + uTime * 0.0001  ) ;

        float mixStrength = mix(strengthOld, strength2,  uCurrentStep - 2.0);

        color = vec3(
            1.0 - (uCurrentStep - 2.0),
            mixStrength,
            mixStrength
        );
        // color.r = 0.0;
    }
    else if(uCurrentStep == 4.0) {
        // 80's animation
        // float mixStrength = mix(40.0, 100.0, uFrequenceBassAverage * 0.0001);
        

        // strength2 =  sin(cnoise(uFrequenceBassAverage * 0.005 * (mod((vUv2) * mixStrength ,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 6.0 + uTime * 0.0001 ) * 200.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;
        // float strength2G =  sin(cnoise(uFrequenceBassAverage * 0.005 * (mod((vUv2 + vec2(mixStrength * 0.001)) * 100.0 ,  1.0  ) * (vUv2.x + (uFrequenceBassAverage * 0.001))  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * (vUv2 + vec2(uFrequenceBassAverage * 0.001)) * 0.01  ) * 6.0 + uTime * 0.0001 ) * 200.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;
        // color = vec3(strength2,strength2G, strength2);

        float mixStrength = mix(40.0, 100.0, uFrequenceBassAverage * 0.0001);
        

        strength2 =  sin(cnoise(uFrequenceBassAverage * 0.005 * (mod((vUv2) * mixStrength ,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 6.0 + uTime * 0.0001 ) * 200.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;
        float strength2G =  sin(cnoise(uFrequenceBassAverage * 0.005 * (mod((vUv2 + vec2(mixStrength * 0.001)) * 100.0 ,  1.0  ) * (vUv2.x + (uFrequenceBassAverage * 0.001))  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * (vUv2 + vec2(uFrequenceBassAverage * 0.001)) * 0.01  ) * 6.0 + uTime * 0.0001 ) * 200.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;
        color = vec3(strength2,strength2G, strength2);
    }
    else if(uCurrentStep == 5.0) {
        // outro
        // Blanc little effect
        strength2 =  sin(cnoise( (mod(vUv2 * 100.0 ,  1.0  ) * vUv2.x  ) * 0.5 + uTime * 0.0001 ) * cnoise(uFrequenceBassAverage * 0.001 * sin(vUv2.y) + (sin(vUv2.x * 0.0001) * vUv2 * 0.01  ) * 6.0 + uTime * 0.0001 ) * 100.0 * (uColorChange + 1.0 )+ uTime * 0.001  ) ;


        strength2 = 1.0 - (strength2 * 0.1);
        color = vec3(strength2);
    }

    // Alexis jamet ish 
    //strength2 = 1.0 - cnoise( (mod(vUv * 10.0  , 10.0 ) * wavedUv.y +   uTime * 0.0001 )  * 20.0 ) * 0.001 * uFrequenceBassAverage;
    // PEtit rond arorndi au milieu 
    //color = vec3( 1.0 - (0.0001 * uFrequenceBassAverage * 0.75) / (distance(wavedUv,vec2(0.5))));
    



    gl_FragColor = vec4(color, 1.0);

}
