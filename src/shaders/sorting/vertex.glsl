uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uTextureAlpha;
uniform float uFrequenceAverage;



varying vec2 vUv;
varying vec4 vTexture;
varying vec4 vTextureAlpha;
varying float vFrequenceAverage;
varying float vTime;


void main()
{
    vec2 deformUv = uv;
    vTexture = texture2D(uTexture, deformUv);  
    vTextureAlpha = texture2D(uTextureAlpha, deformUv);    
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // elevation
    modelPosition.z += uFrequenceAverage * 0.004 * vTexture.g ;

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // modelPosition.z += length(vTexture.xyz) * 0.2;
    //modelPosition.x += length(vTexture.r) * 0.2;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition ;

    // Varying
    vUv = uv;
    vTime = uTime;
    vFrequenceAverage = uFrequenceAverage;
}