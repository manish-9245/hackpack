import { useEffect, useRef } from 'react';

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SRC = `#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
out vec4 fragColor;

float flow(vec2 uv, float t) {
  float a = sin(uv.x * 2.6 + t * 0.35) * 0.5 + 0.5;
  float b = cos(uv.y * 2.1 - t * 0.28) * 0.5 + 0.5;
  float c = sin((uv.x + uv.y) * 1.7 + t * 0.22) * 0.5 + 0.5;
  return (a + b + c) / 3.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 aspectUv = uv;
  aspectUv.x *= uResolution.x / uResolution.y;

  vec2 mouseInfluence = (uMouse - uv) * 0.06;
  vec2 warped = aspectUv + mouseInfluence;

  float layer1 = flow(warped * 1.4, uTime);
  float layer2 = flow(warped * 2.3 + 4.0, uTime * 1.3);
  float mixed = mix(layer1, layer2, 0.45);

  vec3 amber = vec3(1.0, 0.929, 0.769);
  vec3 blue = vec3(0.780, 0.871, 1.0);
  vec3 pink = vec3(1.0, 0.839, 0.922);
  vec3 white = vec3(1.0, 1.0, 1.0);

  vec3 color = mix(white, amber, layer1 * 0.85);
  color = mix(color, blue, layer2 * 0.65);
  color = mix(color, pink, smoothstep(0.5, 0.95, mixed) * 0.55);

  float glow = smoothstep(0.45, 0.0, distance(uv, uMouse));
  color = mix(color, vec3(1.0, 1.0, 1.0), glow * 0.35);

  float vignette = smoothstep(1.15, 0.3, distance(uv, vec2(0.5, 0.42)));
  color = mix(color * 0.94, color, vignette);

  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * 0.012;

  fragColor = vec4(color, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Layered flow-field mesh gradient in the brand's light palette. Static single
 * frame when the visitor prefers reduced motion; otherwise drifts continuously
 * and eases toward the pointer, pausing while the tab is hidden. */
export default function ShaderMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { antialias: false });
    if (!gl) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'uTime');
    const resolutionLoc = gl.getUniformLocation(program, 'uResolution');
    const mouseLoc = gl.getUniformLocation(program, 'uMouse');

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };
    const onPointerMove = (e: PointerEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1 - e.clientY / window.innerHeight;
    };

    let raf = 0;
    let hidden = false;
    const start = performance.now();

    const draw = (t: number) => {
      mouse.x += (targetMouse.x - mouse.x) * 0.04;
      mouse.y += (targetMouse.y - mouse.y) * 0.04;
      gl.uniform1f(timeLoc, (t - start) / 1000);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduceMotion && !hidden) raf = requestAnimationFrame(draw);
    };

    draw(start);

    if (reduceMotion) {
      // one frame is enough — no rAF loop registered above
    } else {
      window.addEventListener('resize', resize);
      window.addEventListener('pointermove', onPointerMove);
      document.addEventListener('visibilitychange', () => {
        hidden = document.hidden;
        if (!hidden) raf = requestAnimationFrame(draw);
        else cancelAnimationFrame(raf);
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full" aria-hidden="true" />;
}
