import * as THREE from 'three';
import { PLANETS_DATA } from './data.js';

/**
 * 太阳系 3D 场景管理类
 */
export class SolarSystemScene {
  /**
   * 构造函数
   * @param {HTMLElement} container - 渲染容器
   * @param {Object} callbacks - 回调函数对象
   */
  constructor(container, callbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.sun = null;
    this.planets = [];
    this.orbits = [];
    this.stars = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.orbitSpeed = 1;
    this.planetScale = 1;
    this.showOrbits = true;
    this.visiblePlanets = PLANETS_DATA.map(p => p.id);
    this.animationId = null;

    this.init();
    this.setupEventListeners();
  }

  /**
   * 初始化场景
   */
  init() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 40, 80);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x0a0e27, 1);
    this.container.appendChild(this.renderer.domElement);

    this.createSun();
    this.createPlanets();
    this.createStars();
    this.setupLights();
    this.animate();
  }

  /**
   * 创建太阳
   */
  createSun() {
    const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffdd00,
      emissive: 0xffaa00
    });
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.scene.add(this.sun);

    const sunLight = new THREE.PointLight(0xffffff, 3, 800);
    this.sun.add(sunLight);

    const glowGeometry = new THREE.SphereGeometry(6, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.sun.add(glow);
  }

  /**
   * 创建行星
   */
  createPlanets() {
    PLANETS_DATA.forEach((data, index) => {
      const distance = data.distance * 8;
      const size = data.diameter * 0.5;

      const orbitGeometry = new THREE.RingGeometry(distance - 0.05, distance + 0.05, 128);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a5568,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      this.scene.add(orbit);
      this.orbits.push({ mesh: orbit, planetId: data.id });

      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: data.emissive || 0x000000,
        shininess: 50
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.userData = { ...data, index };
      this.scene.add(planet);
      this.planets.push({ mesh: planet, data, angle: Math.random() * Math.PI * 2, distance });
    });
  }

  /**
   * 创建星空背景
   */
  createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 400;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      sizeAttenuation: true
    });
    this.stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(this.stars);
  }

  /**
   * 设置灯光
   */
  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());
    this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.container.addEventListener('click', (e) => this.onClick(e));
  }

  /**
   * 窗口大小调整处理
   */
  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * 鼠标移动处理
   * @param {MouseEvent} event - 鼠标事件
   */
  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  /**
   * 点击事件处理
   * @param {MouseEvent} event - 鼠标事件
   */
  onClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planets.map(p => p.mesh));

    if (intersects.length > 0) {
      const planetData = intersects[0].object.userData;
      if (this.callbacks.onPlanetClick) {
        this.callbacks.onPlanetClick(planetData);
      }
    }
  }

  /**
   * 设置公转速度
   * @param {number} speed - 速度倍率
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
    this.planets.forEach((planet, index) => {
      const data = PLANETS_DATA[index];
      const baseSize = data.diameter * 0.5;
      planet.mesh.geometry.dispose();
      planet.mesh.geometry = new THREE.SphereGeometry(baseSize * scale, 32, 32);
    });
  }

  /**
   * 设置行星可见性
   * @param {string} planetId - 行星 ID
   * @param {boolean} visible - 是否可见
   */
  setPlanetVisible(planetId, visible) {
    const planet = this.planets.find(p => p.data.id === planetId);
    if (planet) {
      planet.mesh.visible = visible;
    }
    const orbit = this.orbits.find(o => o.planetId === planetId);
    if (orbit && this.showOrbits) {
      orbit.mesh.visible = visible;
    }
    if (visible && !this.visiblePlanets.includes(planetId)) {
      this.visiblePlanets.push(planetId);
    } else if (!visible) {
      this.visiblePlanets = this.visiblePlanets.filter(id => id !== planetId);
    }
  }

  /**
   * 设置轨道线可见性
   * @param {boolean} show - 是否显示轨道线
   */
  setShowOrbits(show) {
    this.showOrbits = show;
    this.orbits.forEach(orbit => {
      orbit.mesh.visible = show && this.visiblePlanets.includes(orbit.planetId);
    });
  }

  /**
   * 动画循环
   */
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    this.sun.rotation.y += 0.002;

    this.planets.forEach((planet, index) => {
      const data = PLANETS_DATA[index];
      const orbitSpeed = this.orbitSpeed * 0.005 / data.orbitalPeriod;
      planet.angle += orbitSpeed;
      planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
      planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
      planet.mesh.rotation.y += 0.02 / data.rotationPeriod;
    });

    this.stars.rotation.y += 0.0002;

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 销毁场景
   */
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
  }
}
