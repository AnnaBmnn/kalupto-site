#define PI 3.1415926535897932384626433832795

uniform float uOpacity;

varying vec2 vUv;
varying vec4 vTexture;
varying vec4 vTextureAlpha;
varying float vFrequenceAverage;

varying float vTime;


void main()
{
    float median = ((vTexture.r + vTexture.g + vTexture.b) / 3.0) ;
    
    vec4 textureBloom = mix(vTexture, vTextureAlpha, vFrequenceAverage);
    gl_FragColor = vec4(vTexture.r, vTexture.g, vTexture.b, max(uOpacity,median * 1.5));

}
