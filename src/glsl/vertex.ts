
const vertex_shader = `

varying vec3 vNormal;

void main() {
  vNormal = normalize(normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export default vertex_shader
