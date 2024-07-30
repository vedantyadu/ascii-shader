
const ascii_fragment_shader = `
uniform sampler2D tDiffuse;
uniform sampler2D asciiTex;
uniform vec2 resolution;
varying vec2 vUv;

const float charSize = 8.0;
const float totalChars = 7.0;

void main() {
  vec2 samplePoint = floor(gl_FragCoord.xy / charSize) * charSize / resolution;
  vec4 color = texture2D(tDiffuse, samplePoint);

  float luminance = clamp(dot(vec3(0.299, 0.587, 0.114), color.rgb), 0.0, 1.0);

  float asciiIndex;
  modf(luminance * totalChars, asciiIndex);
  asciiIndex = totalChars - asciiIndex;
  vec2 asciiStartUV = vec2(asciiIndex / totalChars, 0.0);
  vec2 currentAsciiUV = asciiStartUV + vec2(mod(gl_FragCoord.x, charSize) / (charSize * totalChars), mod(gl_FragCoord.y, charSize) / charSize);

  vec4 finalColor = texture2D(asciiTex, currentAsciiUV);

  float Hue;

  float minimum = min(min(color.r, color.g), color.b);
  float maximum = max(max(color.r, color.g), color.b);

  if (maximum == color.r) {
    Hue = (color.g - color.b) / (maximum - minimum);
  }
  if (maximum == color.g) {
    Hue = (2.0 + (color.b - color.r)) / (maximum - minimum);
  }
  if (maximum == color.b) {
    Hue = (4.0 + (color.r - color.g)) / (maximum - minimum);
  }

  gl_FragColor = vec4(finalColor.rgb * color.rgb, 1.0);
}
`

export default ascii_fragment_shader
