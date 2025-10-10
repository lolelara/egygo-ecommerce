import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Palette, 
  Sun, 
  Camera,
  Maximize,
  Play,
  Pause
} from 'lucide-react';

interface Three3DShowcaseProps {
  modelUrl?: string;
  productImage?: string;
  productName?: string;
  enableControls?: boolean;
  autoRotate?: boolean;
  showStats?: boolean;
}

export default function Three3DShowcase({
  modelUrl,
  productImage = 'https://via.placeholder.com/800x800',
  productName = 'منتج ثلاثي الأبعاد',
  enableControls = true,
  autoRotate = true,
  showStats = false
}: Three3DShowcaseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const meshRef = useRef<THREE.Mesh>();
  const animationIdRef = useRef<number>();

  const [isRotating, setIsRotating] = useState(autoRotate);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [meshColor, setMeshColor] = useState('#8b5cf6');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 5 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    scene.fog = new THREE.Fog(0xf0f0f0, 10, 50);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 0.5);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = enableControls;
    controls.enablePan = enableControls;
    controls.autoRotate = isRotating;
    controls.autoRotateSpeed = 2;
    controlsRef.current = controls;

    // Create 3D Object or Load Model
    if (modelUrl) {
      // Load GLTF model
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(1, 1, 1);
          model.position.set(0, 0, 0);
          model.castShadow = true;
          model.receiveShadow = true;
          scene.add(model);
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
        },
        (error) => {
          console.error('Error loading model:', error);
          // Fallback to default geometry
          createDefaultGeometry();
        }
      );
    } else {
      createDefaultGeometry();
    }

    function createDefaultGeometry() {
      // Create animated product box
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const textureLoader = new THREE.TextureLoader();
      
      // Load product image as texture
      const texture = textureLoader.load(productImage);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      
      const materials = [
        new THREE.MeshPhongMaterial({ map: texture }),
        new THREE.MeshPhongMaterial({ map: texture }),
        new THREE.MeshPhongMaterial({ color: meshColor }),
        new THREE.MeshPhongMaterial({ color: meshColor }),
        new THREE.MeshPhongMaterial({ map: texture }),
        new THREE.MeshPhongMaterial({ map: texture }),
      ];
      
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      meshRef.current = mesh;
      scene.add(mesh);

      // Add floating particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 500;
      const positions = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x8b5cf6,
        size: 0.05,
        transparent: true,
        opacity: 0.6
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Animate particles
      gsap.to(particles.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: 'none'
      });
    }

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (meshRef.current && !isRotating) {
        meshRef.current.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl, productImage, enableControls, meshColor, lightIntensity]);

  // Update controls autoRotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isRotating;
    }
  }, [isRotating]);

  // Camera controls
  const handleCameraReset = () => {
    if (cameraRef.current && controlsRef.current) {
      gsap.to(cameraRef.current.position, {
        x: 0,
        y: 0,
        z: 5,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => controlsRef.current?.update()
      });
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        z: cameraRef.current.position.z - 1,
        duration: 0.5,
        ease: 'power2.inOut'
      });
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        z: cameraRef.current.position.z + 1,
        duration: 0.5,
        ease: 'power2.inOut'
      });
    }
  };

  const handleColorChange = (color: string) => {
    setMeshColor(color);
    if (meshRef.current && meshRef.current.material) {
      const materials = meshRef.current.material as THREE.MeshPhongMaterial[];
      materials[2].color.set(color);
      materials[3].color.set(color);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      mountRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleScreenshot = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      const dataURL = rendererRef.current.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${productName}-3d.png`;
      link.click();
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xl font-bold text-white bg-black/50 px-3 py-1 rounded-lg backdrop-blur">
          {productName}
        </h3>
      </div>

      {/* 3D Canvas */}
      <div 
        ref={mountRef} 
        className={`bg-gradient-to-br from-purple-100 to-pink-100 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[500px]'}`}
      />

      {/* Controls Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-lg rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            {/* Rotation Toggle */}
            <Button
              size="icon"
              variant={isRotating ? 'default' : 'outline'}
              onClick={() => setIsRotating(!isRotating)}
              title={isRotating ? 'إيقاف الدوران' : 'تشغيل الدوران'}
            >
              {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            {/* Zoom Controls */}
            <div className="flex gap-1">
              <Button size="icon" variant="outline" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Reset Camera */}
            <Button size="icon" variant="outline" onClick={handleCameraReset}>
              <RotateCw className="h-4 w-4" />
            </Button>

            {/* Color Picker */}
            <div className="flex gap-1">
              {['#8b5cf6', '#ef4444', '#10b981', '#3b82f6', '#f59e0b'].map(color => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>

            {/* Light Intensity */}
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Slider
                value={[lightIntensity]}
                onValueChange={([value]) => setLightIntensity(value)}
                min={0.1}
                max={2}
                step={0.1}
                className="w-24"
              />
            </div>

            {/* Screenshot */}
            <Button size="icon" variant="outline" onClick={handleScreenshot}>
              <Camera className="h-4 w-4" />
            </Button>

            {/* Fullscreen */}
            <Button size="icon" variant="outline" onClick={handleFullscreen}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showStats && (
        <div className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-lg text-xs backdrop-blur">
          <div>Camera: ({cameraPosition.x.toFixed(1)}, {cameraPosition.y.toFixed(1)}, {cameraPosition.z.toFixed(1)})</div>
          <div>Auto-rotate: {isRotating ? 'ON' : 'OFF'}</div>
          <div>Light: {(lightIntensity * 100).toFixed(0)}%</div>
        </div>
      )}
    </Card>
  );
}
