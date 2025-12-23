import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';

extend({ ShaderMaterial: THREE.ShaderMaterial });

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform sampler2D uDepthMap;
  uniform vec2 uMouse;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vec4 depth = texture2D(uDepthMap, vUv);
    float depthValue = depth.r;
    
    vec2 displacement = uMouse * depthValue * uIntensity;
    vec2 uv = vUv + displacement;
    
    vec4 color = texture2D(uTexture, uv);
    gl_FragColor = color;
  }
`;

interface DepthImagePlaneProps {
  imageUrl: string;
  depthUrl: string;
  mousePosition: { x: number; y: number };
  scrollOffset: number;
}

const DepthImagePlane = ({ imageUrl, depthUrl, mousePosition, scrollOffset }: DepthImagePlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const [textures, setTextures] = useState<{
    texture: THREE.Texture | null;
    depthMap: THREE.Texture | null;
  }>({ texture: null, depthMap: null });

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    Promise.all([
      loader.loadAsync(imageUrl),
      loader.loadAsync(depthUrl)
    ]).then(([texture, depthMap]) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      depthMap.minFilter = THREE.LinearFilter;
      depthMap.magFilter = THREE.LinearFilter;
      
      setTextures({ texture, depthMap });
    });
  }, [imageUrl, depthUrl]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: null },
        uDepthMap: { value: null },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uIntensity: { value: 0.04 }
      }
    });
  }, []);

  useEffect(() => {
    if (textures.texture && textures.depthMap && shaderMaterial) {
      shaderMaterial.uniforms.uTexture.value = textures.texture;
      shaderMaterial.uniforms.uDepthMap.value = textures.depthMap;
    }
  }, [textures, shaderMaterial]);

  useFrame(() => {
    if (shaderMaterial) {
      const targetX = mousePosition.x * 0.03 + scrollOffset * 0.02;
      const targetY = mousePosition.y * 0.03 - scrollOffset * 0.01;
      
      shaderMaterial.uniforms.uMouse.value.x += (targetX - shaderMaterial.uniforms.uMouse.value.x) * 0.1;
      shaderMaterial.uniforms.uMouse.value.y += (targetY - shaderMaterial.uniforms.uMouse.value.y) * 0.1;
    }
  });

  if (!textures.texture || !textures.depthMap) {
    return null;
  }

  const aspectRatio = 3 / 4;
  const planeHeight = viewport.height;
  const planeWidth = planeHeight * aspectRatio;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
};

interface DepthParallaxImageProps {
  imageUrl: string;
  depthUrl: string;
  className?: string;
}

const DepthParallaxImage = ({ imageUrl, depthUrl, className = '' }: DepthParallaxImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const offset = (windowHeight / 2 - elementCenter) / windowHeight;
        setScrollOffset(offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <DepthImagePlane
          imageUrl={imageUrl}
          depthUrl={depthUrl}
          mousePosition={mousePosition}
          scrollOffset={scrollOffset}
        />
      </Canvas>
    </div>
  );
};

export default DepthParallaxImage;

