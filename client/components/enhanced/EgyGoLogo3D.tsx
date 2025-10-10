import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three-stdlib';
import { FontLoader } from 'three-stdlib';
import { TextGeometry } from 'three-stdlib';
import { motion } from 'framer-motion';

interface EgyGoLogo3DProps {
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  autoRotate?: boolean;
  showParticles?: boolean;
  colorScheme?: 'gradient' | 'solid' | 'neon';
}

export default function EgyGoLogo3D({
  size = 'medium',
  interactive = true,
  autoRotate = true,
  showParticles = true,
  colorScheme = 'gradient'
}: EgyGoLogo3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const logoGroupRef = useRef<THREE.Group>();
  const particlesRef = useRef<THREE.Points>();
  const [isHovered, setIsHovered] = useState(false);

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { width: 200, height: 100, fontSize: 30 };
      case 'large':
        return { width: 600, height: 300, fontSize: 90 };
      default:
        return { width: 400, height: 200, fontSize: 60 };
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const config = getSizeConfig();
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      config.width / config.height,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(config.width, config.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x8b5cf6, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xec4899, 0.6);
    directionalLight2.position.set(-5, -5, 5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Create logo group
    const logoGroup = new THREE.Group();
    logoGroupRef.current = logoGroup;
    scene.add(logoGroup);

    // Create "Egy" text
    const egyGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.3);
    const egyMaterial = new THREE.MeshPhongMaterial({
      color: colorScheme === 'gradient' ? 0x8b5cf6 : 
             colorScheme === 'neon' ? 0x00ff00 : 0x3b82f6,
      emissive: colorScheme === 'neon' ? 0x00ff00 : 0x000000,
      emissiveIntensity: colorScheme === 'neon' ? 0.5 : 0,
      shininess: 100,
      specular: 0xffffff
    });
    const egyMesh = new THREE.Mesh(egyGeometry, egyMaterial);
    egyMesh.position.x = -1;
    logoGroup.add(egyMesh);

    // Create "Go" text with special "o" animation
    const goGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.3);
    const goMaterial = new THREE.MeshPhongMaterial({
      color: colorScheme === 'gradient' ? 0xec4899 : 
             colorScheme === 'neon' ? 0xff00ff : 0xef4444,
      emissive: colorScheme === 'neon' ? 0xff00ff : 0x000000,
      emissiveIntensity: colorScheme === 'neon' ? 0.5 : 0,
      shininess: 100,
      specular: 0xffffff
    });
    const goMesh = new THREE.Mesh(goGeometry, goMaterial);
    goMesh.position.x = 0.5;
    logoGroup.add(goMesh);

    // Create animated "o" (speed effect)
    const oGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 100);
    const oMaterial = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.3,
      shininess: 200,
      specular: 0xffffff
    });
    const oMesh = new THREE.Mesh(oGeometry, oMaterial);
    oMesh.position.set(1.2, 0, 0.2);
    logoGroup.add(oMesh);

    // Speed lines for "o"
    const speedLinesGeometry = new THREE.BufferGeometry();
    const speedLinesCount = 20;
    const speedPositions = new Float32Array(speedLinesCount * 6);
    
    for (let i = 0; i < speedLinesCount; i++) {
      const angle = (i / speedLinesCount) * Math.PI * 2;
      const radius = 0.4;
      
      // Start point
      speedPositions[i * 6] = 1.2 + Math.cos(angle) * radius;
      speedPositions[i * 6 + 1] = Math.sin(angle) * radius;
      speedPositions[i * 6 + 2] = 0.2;
      
      // End point (trailing)
      speedPositions[i * 6 + 3] = 1.2 + Math.cos(angle) * (radius + 0.5);
      speedPositions[i * 6 + 4] = Math.sin(angle) * radius;
      speedPositions[i * 6 + 5] = 0.2 - 0.3;
    }
    
    speedLinesGeometry.setAttribute('position', new THREE.BufferAttribute(speedPositions, 3));
    const speedLinesMaterial = new THREE.LineBasicMaterial({
      color: 0xffd700,
      opacity: 0.6,
      transparent: true,
      linewidth: 2
    });
    const speedLines = new THREE.LineSegments(speedLinesGeometry, speedLinesMaterial);
    logoGroup.add(speedLines);

    // Particles
    if (showParticles) {
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 500;
      const positions = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
        
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.5);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      particlesRef.current = particles;
      scene.add(particles);
    }

    // Controls
    let controls: OrbitControls | null = null;
    if (interactive) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false;
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 2;
    }

    // Animations
    const animateO = () => {
      // Rotate "o" for speed effect
      gsap.to(oMesh.rotation, {
        z: Math.PI * 2,
        duration: 2,
        repeat: -1,
        ease: 'none'
      });

      // Pulse effect
      gsap.to(oMesh.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });

      // Animate speed lines
      gsap.to(speedLines.rotation, {
        z: -Math.PI * 2,
        duration: 3,
        repeat: -1,
        ease: 'none'
      });

      // Glow effect animation
      gsap.to(oMaterial, {
        emissiveIntensity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    };

    animateO();

    // Hover effects
    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      if (logoGroup) {
        gsap.to(logoGroup.rotation, {
          y: x * 0.5,
          x: y * 0.3,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseenter', () => setIsHovered(true));
    renderer.domElement.addEventListener('mouseleave', () => {
      setIsHovered(false);
      if (logoGroup) {
        gsap.to(logoGroup.rotation, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Auto-rotate logo if not interactive
      if (!interactive && autoRotate && logoGroup) {
        logoGroup.rotation.y = elapsedTime * 0.5;
      }
      
      // Animate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.1;
        particlesRef.current.rotation.x = elapsedTime * 0.05;
      }
      
      // Float animation
      if (logoGroup) {
        logoGroup.position.y = Math.sin(elapsedTime * 2) * 0.1;
      }
      
      if (controls) {
        controls.update();
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [size, interactive, autoRotate, showParticles, colorScheme]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative inline-block"
    >
      <div 
        ref={mountRef} 
        className={`
          ${isHovered ? 'cursor-grab' : 'cursor-pointer'}
          transition-all duration-300
          ${isHovered ? 'drop-shadow-2xl' : 'drop-shadow-lg'}
        `}
        style={{
          filter: isHovered 
            ? 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.5))' 
            : 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.3))'
        }}
      />
      
      {/* Glow effect background */}
      <div 
        className="absolute inset-0 -z-10 blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, #8b5cf6 0%, #ec4899 50%, transparent 70%)'
        }}
      />
    </motion.div>
  );
}

// Simplified 2D fallback version
export function EgyGoLogo2D({ 
  size = 'medium',
  animated = true 
}: { 
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}) {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`font-bold ${sizeClasses[size]} relative inline-block`}
    >
      <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Egy
      </span>
      <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
        G
      </span>
      <motion.span
        animate={animated ? {
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
      >
        o
      </motion.span>
      
      {/* Speed lines */}
      {animated && (
        <motion.div
          className="absolute -right-8 top-1/2 -translate-y-1/2"
          animate={{
            opacity: [0, 1, 0],
            x: [0, 20, 40]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          <div className="space-y-1">
            <div className="h-0.5 w-8 bg-gradient-to-r from-yellow-400 to-transparent" />
            <div className="h-0.5 w-6 bg-gradient-to-r from-orange-400 to-transparent" />
            <div className="h-0.5 w-4 bg-gradient-to-r from-red-400 to-transparent" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
