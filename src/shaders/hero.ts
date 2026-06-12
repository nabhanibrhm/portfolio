export const heroVertex = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export const heroFragment = /* glsl */ `
  precision highp float;

  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform float uTime;
  uniform float uClickAge;
  uniform vec2  uClickPos;
  uniform float uHeld;

  const vec3 C_BG      = vec3(0.000, 0.000, 0.000); // #000000
  const vec3 C_TEXT    = vec3(0.882, 0.863, 0.788); // #E1DCC9
  const vec3 C_TEAL    = vec3(0.255, 0.176, 0.082); // #412D15
  const vec3 C_TEAL_HI = vec3(0.882, 0.863, 0.788); // #E1DCC9
  const vec3 C_TEAL_DK = vec3(0.122, 0.082, 0.047); // #1F150C

  float hash1(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float gauss(vec2 p, vec2 c, float r) {
    vec2 d = (p - c) / r;
    return exp(-dot(d, d));
  }

  void main() {
    vec2 R  = uResolution;
    vec2 uv = (gl_FragCoord.xy - 0.5 * R) / R.y;
    vec2 mo = (uMouse        - 0.5 * R) / R.y;
    vec2 cp = (uClickPos     - 0.5 * R) / R.y;
    float t = uTime * 0.16;

    vec2 c1 = vec2(cos(t * 0.70)       * 0.55, sin(t * 0.55)       * 0.30);
    vec2 c2 = vec2(cos(t * 0.45 + 2.1) * 0.62, sin(t * 0.62 + 1.3) * 0.38);
    vec2 c3 = vec2(cos(t * 0.32 + 4.2) * 0.48, sin(t * 0.78 + 2.8) * 0.46);
    vec2 c4 = vec2(cos(t * 0.55 + 5.6) * 0.40, sin(t * 0.40 + 0.6) * 0.42);

    float wTeal1 = gauss(uv, c1, 0.62);
    float wTeal2 = gauss(uv, c2, 0.58);
    float wTeal3 = gauss(uv, c3, 0.50);
    float wTeal4 = gauss(uv, c4, 0.46);

    float mRad   = 0.55 + 0.25 * uHeld;
    float wMouse = gauss(uv, mo, mRad) * (1.10 + 0.55 * uHeld);

    float age       = max(uClickAge, 0.0);
    float clickRad  = 0.25 + age * 0.75;
    float wClick    = gauss(uv, cp, clickRad) * exp(-age * 1.10) * 1.8;

    float wTotal = wTeal1 + wTeal2 + wTeal3 + wTeal4 + wMouse + wClick + 1e-3;
    vec3 colSum =
        C_TEAL    * (wTeal1 + wTeal3)
      + C_TEAL_HI *  wTeal2
      + C_TEAL_DK *  wTeal4
      + C_TEXT    *  wMouse
      + mix(C_TEXT, C_TEAL_HI, smoothstep(0.0, 0.6, age)) * wClick;
    vec3 col = colSum / wTotal;

    float field = wTeal1 + wTeal2 + wTeal3 + wTeal4 + wMouse * 0.95 + wClick;
    float blend = smoothstep(0.05, 1.10, field);
    col = mix(C_BG, col, blend);

    float dM    = length(uv - mo);
    float halo  = exp(-dM * 2.4) * (0.20 + 0.30 * uHeld);
    float spark = exp(-dM * 8.0) * (0.40 + 0.50 * uHeld);
    col += C_TEXT * (halo * 0.40 + spark * 0.65);

    vec2  toC   = uv - cp;
    float dC    = length(toC);
    float ringR = age * 0.95;
    float ring  = exp(-pow((dC - ringR) / 0.06, 2.0)) * exp(-age * 1.4);
    col += mix(C_TEXT, C_TEAL_HI, smoothstep(0.0, 0.6, age)) * ring * 0.85;

    float vig = 1.0 - dot(uv, uv) * 0.38;
    col *= vig;

    col += (hash1(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.018;
    col  = pow(max(col, 0.0), vec3(0.95));

    gl_FragColor = vec4(col, 1.0);
  }
`;
