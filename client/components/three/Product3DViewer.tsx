/**
 * 🎮 3D Product Viewer with Three.js
 */

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// ========================================
// 1. BASIC 3D PRODUCT VIEWER
// ========================================

export const Product3DViewer = ({ 
  modelUrl,
  width = 600,
  height = 400
}: {
  modelUrl: string;
  width?: number;
  height?: number;
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;

    // Load 3D model
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.multiplyScalar(scale);
        
        scene.add(model);
        setLoading(false);
      },
      (progress) => {
        console.log('Loading:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load 3D model');
        setLoading(false);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [modelUrl, width, height]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      <div ref={mountRef} />
    </div>
  );
};

// ========================================
// 2. 360° PRODUCT ROTATION
// ========================================

export const Product360Viewer = ({ 
  images,
  width = 600,
  height = 400
}: {
  images: string[];
  width?: number;
  height?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const threshold = 10;
    
    if (Math.abs(deltaX) > threshold) {
      const direction = deltaX > 0 ? 1 : -1;
      const newIndex = (currentIndex + direction + images.length) % images.length;
      setCurrentIndex(newIndex);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="relative cursor-grab select-none"
      style={{ width, height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Product view ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ========================================
// 3. PARTICLE SYSTEM
// ========================================

export const ParticleBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    // Create mesh
    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate particles
      particlesMesh.rotation.y = elapsedTime * 0.1;
      particlesMesh.rotation.x = -mouseY * 0.5;
      particlesMesh.rotation.y = mouseX * 0.5;
      
      // Wave animation
      const positions = particlesMesh.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        positions[i + 1] = Math.sin(elapsedTime + x) * 0.3;
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
};

// ========================================
// 4. INTERACTIVE 3D SCENE
// ========================================

export const Interactive3DScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 2, 100);
    pointLight.position.set(0, 10, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Create floating cubes
    const cubes: THREE.Mesh[] = [];
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    
    for (let i = 0; i < 20; i++) {
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
        emissive: new THREE.Color().setHSL(Math.random(), 0.7, 0.2),
        emissiveIntensity: 0.5
      });
      
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 10,
        (Math.random() - 0.5) * 20
      );
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      cube.castShadow = true;
      cube.receiveShadow = true;
      
      cubes.push(cube);
      scene.add(cube);
    }

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0f0f1e,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cubes);
      
      if (intersects.length > 0) {
        const object = intersects[0].object as THREE.Mesh;
        const material = object.material as THREE.MeshPhongMaterial;
        
        // Change color on click
        material.color.setHSL(Math.random(), 0.7, 0.5);
        
        // Animate scale
        const scale = { value: 1 };
        const targetScale = 1.5;
        
        const animateScale = () => {
          if (scale.value < targetScale) {
            scale.value += 0.05;
            object.scale.set(scale.value, scale.value, scale.value);
            requestAnimationFrame(animateScale);
          } else {
            const shrink = () => {
              if (scale.value > 1) {
                scale.value -= 0.05;
                object.scale.set(scale.value, scale.value, scale.value);
                requestAnimationFrame(shrink);
              }
            };
            shrink();
          }
        };
        animateScale();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Animate cubes
      cubes.forEach((cube, index) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.position.y = Math.sin(elapsedTime + index) * 0.5 + 3;
      });
      
      // Animate light
      pointLight.position.x = Math.sin(elapsedTime) * 10;
      pointLight.position.z = Math.cos(elapsedTime) * 10;
      
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0" />;
};
