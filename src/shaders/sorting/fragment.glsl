#define PI 3.1415926535897932384626433832795

uniform float uOpacity;
uniform float uShape;

varying vec2 vUv;
varying vec4 vTexture;
varying vec4 vTextureAlpha;
varying float vFrequenceAverage;

varying float vTime;


void main()
{
    float median = ((vTexture.r + vTexture.g + vTexture.b) / 3.0) ;
    float alpha = max(uOpacity,median * 1.5);
    // image noir transparent noir = 0
    // 1.0
    float alphaTexture = max(((vTextureAlpha.r + vTextureAlpha.g + vTextureAlpha.b) / 3.0), 1.0 - uShape);
    alpha = min(alpha, alphaTexture);
    gl_FragColor = vec4(vTexture.r, vTexture.g, vTexture.b, alpha);

}
