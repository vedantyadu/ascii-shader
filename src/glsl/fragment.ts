
const fragment_shader = `

varying vec3 vNormal;
uniform vec3 cameraPos;

void main() {

  vec3 viewSource = normalize(cameraPos);
  vec3 lightColor = vec3(1.0, 1.0, 1.0);
  vec3 lightSource = vec3(5.0, 3.0, -2.0);
  
  float diffuseStrength = max(0.0, dot(lightSource, vNormal));
  vec3 reflectiveSource = normalize(reflect(-lightSource, vNormal));
  float specularStrength = max(0.0, dot(viewSource, reflectiveSource));
  specularStrength = pow(specularStrength, 32.0);

  vec3 specular = lightColor * specularStrength;
  
  vec3 modelColor = vec3(0.4, 0.4, 0.4);
  vec3 color = lightColor * diffuseStrength * 0.1;

  gl_FragColor = vec4(modelColor + color + specular, 1.0);
}
`

export default fragment_shader
