import * as THREE from 'three';
import { PLANETS_DATA } from '../data/planets.js';

/**
 * 太阳系3D渲染类
 * 负责创建和管理整个3D场景、相机、渲染器、行星、轨道等
 */
export class SolarSystem {
  /**
   * 构造函数
   * @param {HTMLCanvasElement} canvas - 渲染画布元素
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.planets = [];
    this.orbits = [];
    this.sun = null;
    this.planetLabels = [];
    
    this.orbitSpeed = 1;
    this.planetScale = 1;
    this.showOrbits = true;
    
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.cameraAngle = { theta: 0, phi: Math.PI / 3 };
    this.cameraDistance = 120;
    
    this.onPlanetClick = null;
    
    this.init();
  }

  /**
   * 初始化整个3D场景
   */
  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createStarfield();
    this.createSun();
    this.createPlanets();
    this.createOrbits();
    this.setupLighting();
    this.setupControls();
    this.createPlanetLabels();
    this.animate();
  }

  /**
   * 创建场景
   */
  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);
  }

  /**
   * 创建相机
   */
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.updateCameraPosition();
  }

  /**
   * 更新相机位置
   */
  updateCameraPosition() {
    const x = this.cameraDistance * Math.sin(this.cameraAngle.phi) * Math.cos(this.cameraAngle.theta);
    const y = this.cameraDistance * Math.cos(this.cameraAngle.phi);
    const z = this.cameraDistance * Math.sin(this.cameraAngle.phi) * Math.sin(this.cameraAngle.theta);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * 创建渲染器
   */
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /**
   * 创建星空背景
   */
  createStarfield() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(geometry, material);
    this.scene.add(stars);
  }

  /**
   * 创建太阳
   */
  createSun() {
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffdd00,
      transparent: true,
      opacity: 0.95
    });
    this.sun = new THREE.Mesh(geometry, material);
    this.scene.add(this.sun);

    const glowGeometry = new THREE.SphereGeometry(7, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.1 },
        p: { value: 4.5 },
        glowColor: { value: new THREE.Color(0xffaa00) },
        viewVector: { value: this.camera.position }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(0.7 - dot(vNormal, vNormel), 2.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, intensity * 0.8);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.sun.add(glow);
  }

  /**
   * 创建所有行星
   */
  createPlanets() {
    PLANETS_DATA.forEach((data, index) => {
      const geometry = new THREE.SphereGeometry(data.size, 48, 48);
      const material = new THREE.MeshPhongMaterial({
        color: data.color,
        shininess: 35,
        emissive: data.color,
        emissiveIntensity: 0.15
      });
      const planet = new THREE.Mesh(geometry, material);
      
      planet.userData = {
        id: data.id,
        name: data.name,
        angle: (index * Math.PI * 2) / 8,
        distance: data.distance,
        orbitPeriod: data.orbitPeriod,
        rotationPeriod: data.rotationPeriod,
        baseSize: data.size
      };

      if (data.id === 'saturn') {
        this.addSaturnRings(planet);
      }

      this.planets.push(planet);
      this.scene.add(planet);
    });
  }

  /**
   * 为土星添加光环
   * @param {THREE.Mesh} saturn - 土星网格对象
   */
  addSaturnRings(saturn) {
    const ringGeometry = new THREE.RingGeometry(2.8, 4.5, 64);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: 0xd4b87a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      emissive: 0xd4b87a,
      emissiveIntensity: 0.1
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2.5;
    saturn.add(rings);
  }

  /**
   * 创建轨道线
   */
  createOrbits() {
    PLANETS_DATA.forEach(data => {
      const points = [];
      for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * data.distance,
          0,
          Math.sin(angle) * data.distance
        ));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.15
      });
      const orbit = new THREE.Line(geometry, material);
      this.orbits.push(orbit);
      this.scene.add(orbit);
    });
  }

  /**
   * 设置光照
   */
  setupLighting() {
    const pointLight = new THREE.PointLight(0xffffff, 5, 500);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x444477, 0.6);
    this.scene.add(ambientLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4);
    fillLight.position.set(50, 50, 50);
    this.scene.add(fillLight);
  }

  /**
   * 设置交互控制
   */
  setupControls() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;
        
        this.cameraAngle.theta += deltaX * 0.005;
        this.cameraAngle.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.cameraAngle.phi + deltaY * 0.005));
        
        this.updateCameraPosition();
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraDistance = Math.max(30, Math.min(250, this.cameraDistance + e.deltaY * 0.1));
      this.updateCameraPosition();
    });

    this.canvas.addEventListener('click', () => {
      if (this.isDragging) return;
      
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.planets);
      
      if (intersects.length > 0 && this.onPlanetClick) {
        this.onPlanetClick(intersects[0].object.userData.id);
      }
    });
  }

  /**
   * 设置公转速度
   * @param {number} speed - 速度倍数
   */
  setOrbitSpeed(speed) {
    this.orbitSpeed = speed;
  }

  /**
   * 设置行星大小比例
   * @param {number} scale - 缩放比例
   */
  setPlanetScale(scale) {
    this.planetScale = scale;
    this.planets.forEach(planet => {
      planet.scale.setScalar(scale);
    });
  }

  /**
   * 设置是否显示轨道线
   * @param {boolean} show - 是否显示
   */
  setShowOrbits(show) {
    this.showOrbits = show;
    this.orbits.forEach(orbit => {
      orbit.visible = show;
    });
  }

  /**
   * 设置行星可见性
   * @param {string} planetId - 行星ID
   * @param {boolean} visible - 是否可见
   */
  setPlanetVisible(planetId, visible) {
    const planet = this.planets.find(p => p.userData.id === planetId);
    if (planet) {
      planet.visible = visible;
    }
  }

  /**
   * 创建行星名称标签
   */
  createPlanetLabels() {
    this.planets.forEach(planet => {
      const label = document.createElement('div');
      label.className = 'planet-label';
      label.textContent = planet.userData.name;
      label.dataset.planetId = planet.userData.id;
      document.body.appendChild(label);
      this.planetLabels.push(label);
    });
  }

  /**
   * 更新行星标签位置
   */
  updatePlanetLabels() {
    this.planets.forEach((planet, index) => {
      const vector = planet.position.clone();
      vector.project(this.camera);
      
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
      
      const label = this.planetLabels[index];
      label.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
      label.style.opacity = planet.visible ? Math.max(0.3, 1 - vector.z * 0.5) : 0;
    });
  }

  /**
   * 动画循环
   */
  animate() {
    requestAnimationFrame(() => this.animate());

    this.planets.forEach(planet => {
      planet.userData.angle += (0.3 / planet.userData.orbitPeriod) * this.orbitSpeed * 0.01;
      
      planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
      planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
      
      planet.rotation.y += (0.5 / planet.userData.rotationPeriod) * 0.01;
    });

    this.sun.rotation.y += 0.002;

    this.updatePlanetLabels();

    this.renderer.render(this.scene, this.camera);
  }
}
