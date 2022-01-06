varying vec2 vUv;
uniform float uTime;

uniform sampler2D uTexture;

void main() {
  float time = uTime;

  vec2 repeat = vec2(2., 1.);
  // vec2 uv = vUv;
  vec2 uv = fract(vUv * repeat - vec2(time, 0.)); // The sign of time change direction of movement

  vec4 color = texture2D(uTexture, uv);
  // texture *= vec3(uv.x, uv.y, 1.); // To help visualize the repeated uvs

  gl_FragColor = color;
}