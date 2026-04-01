import * as THREE from 'three';
import { PLANET_DATA, SOLAR_SYSTEM_CONFIG } from './planetData.js';

/**
 * 太阳系3D场景类
 * 负责创建和管理太阳、行星、轨道、星空等3D元素
 */
export class SolarSystem {
    /**
     * 创建太阳系实例
     * @param {HTMLCanvasElement} canvas - 渲染画布元素
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.planets = [];
        this.orbits = [];
        this.stars = null;
        this.sun = null;
        this.orbitSpeed = 1;
        this.planetScale = 1;
        this.showOrbits = true;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.onPlanetClick = null;

        this.init();
    }

    /**
     * 初始化Three.js场景、相机、渲染器
     */
    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a1a);

        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        this.camera.position.set(0, 80, 120);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.addLights();
        this.createStarfield();
        this.createSun();
        this.createPlanets();
        this.createOrbits();
        this.setupControls();

        window.addEventListener('resize', () => this.onWindowResize());
        this.canvas.addEventListener('click', (e) => this.onMouseClick(e));
    }

    /**
     * 添加场景光源（太阳光和环境光）
     */
    addLights() {
        const sunLight = new THREE.PointLight(0xffffff, 3.5, 1000, 0.5);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
    }

    /**
     * 创建星空背景
     */
    createStarfield() {
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 10000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            const radius = 500 + Math.random() * 500;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);

            const brightness = 0.5 + Math.random() * 0.5;
            colors[i] = brightness;
            colors[i + 1] = brightness;
            colors[i + 2] = brightness;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.stars);
    }

    /**
     * 创建太阳（带发光效果）
     */
    createSun() {
        const sunGeometry = new THREE.SphereGeometry(12, 64, 64);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffdd00,
            transparent: true,
            opacity: 1
        });

        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);

        const glowGeometry = new THREE.SphereGeometry(18, 32, 32);
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

        const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(sunGlow);
    }

    /**
     * 创建所有行星
     */
    createPlanets() {
        PLANET_DATA.forEach((data, index) => {
            const planetGroup = new THREE.Group();
            planetGroup.userData = { ...data, index };

            const size = data.diameter * SOLAR_SYSTEM_CONFIG.sizeScale * data.scale;
            const distance = data.distance * SOLAR_SYSTEM_CONFIG.distanceScale;

            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: data.color,
                emissive: data.color,
                emissiveIntensity: 0.35,
                shininess: 50
            });

            const planet = new THREE.Mesh(geometry, material);
            planet.position.x = distance;
            planetGroup.add(planet);

            if (data.hasRings) {
                const innerRadius = size * 1.4;
                const outerRadius = size * 2.5;
                const tube = 0.05;
                const radialSegments = 128;
                const tubularSegments = 8;
                
                const ringColors = [0xe8d5a3, 0xd4be8d, 0xc9ad7a, 0xb89b6a];
                
                for (let i = 0; i < 4; i++) {
                    const ringRadius = innerRadius + (outerRadius - innerRadius) * (0.2 + i * 0.2);
                    const ringGeometry = new THREE.TorusGeometry(ringRadius, tube * (0.8 + i * 0.15), tubularSegments, radialSegments);
                    const ringMaterial = new THREE.MeshBasicMaterial({
                        color: ringColors[i],
                        transparent: true,
                        opacity: 0.4 + i * 0.08,
                        side: THREE.DoubleSide
                    });
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.rotation.x = Math.PI / 2.3;
                    ring.position.x = distance;
                    planetGroup.add(ring);
                }
            }

            planetGroup.userData = {
                ...planetGroup.userData,
                mesh: planet,
                distance: distance,
                size: size,
                angle: Math.random() * Math.PI * 2,
                baseSize: size
            };

            this.planets.push(planetGroup);
            this.scene.add(planetGroup);
        });
    }

    /**
     * 创建行星轨道线
     */
    createOrbits() {
        PLANET_DATA.forEach((data) => {
            const distance = data.distance * SOLAR_SYSTEM_CONFIG.distanceScale;
            const points = [];

            for (let i = 0; i <= 128; i++) {
                const angle = (i / 128) * Math.PI * 2;
                points.push(new THREE.Vector3(
                    Math.cos(angle) * distance,
                    0,
                    Math.sin(angle) * distance
                ));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0x667eea,
                transparent: true,
                opacity: 0.3
            });

            const orbit = new THREE.Line(geometry, material);
            this.orbits.push(orbit);
            this.scene.add(orbit);
        });
    }

    /**
     * 设置轨道控制器（鼠标交互）
     */
    setupControls() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let spherical = new THREE.Spherical(550, Math.PI / 3.5, 0);

        const updateCameraPosition = () => {
            this.camera.position.setFromSpherical(spherical);
            this.camera.lookAt(0, 0, 0);
        };

        updateCameraPosition();

        this.canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            spherical.theta -= deltaX * 0.005;
            spherical.phi += deltaY * 0.005;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

            updateCameraPosition();
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            spherical.radius += e.deltaY * 0.3;
            spherical.radius = Math.max(20, Math.min(1200, spherical.radius));
            updateCameraPosition();
        }, { passive: false });
    }

    /**
     * 处理窗口大小变化
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * 处理鼠标点击事件（检测点击行星）
     * @param {MouseEvent} event - 鼠标事件
     */
    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const planetMeshes = this.planets.map(p => p.userData.mesh);
        const intersects = this.raycaster.intersectObjects(planetMeshes);

        if (intersects.length > 0) {
            const clickedPlanet = intersects[0].object;
            const planetGroup = this.planets.find(p => p.userData.mesh === clickedPlanet);
            
            if (planetGroup && this.onPlanetClick) {
                this.onPlanetClick(planetGroup.userData);
            }
        }
    }

    /**
     * 更新行星位置和旋转动画
     * @param {number} deltaTime - 时间增量
     */
    update(deltaTime) {
        this.planets.forEach((planet) => {
            const { distance, baseSize } = planet.userData;
            const orbitalPeriod = planet.userData.orbitalPeriod;
            
            planet.userData.angle += SOLAR_SYSTEM_CONFIG.baseOrbitSpeed * this.orbitSpeed * (365 / orbitalPeriod);
            
            const mesh = planet.userData.mesh;
            mesh.position.x = Math.cos(planet.userData.angle) * distance;
            mesh.position.z = Math.sin(planet.userData.angle) * distance;
            
            mesh.scale.setScalar(this.planetScale);
            
            mesh.rotation.y += SOLAR_SYSTEM_CONFIG.baseRotationSpeed / planet.userData.rotationPeriod;

            if (planet.userData.hasRings) {
                for (let i = 1; i < planet.children.length; i++) {
                    planet.children[i].position.x = mesh.position.x;
                    planet.children[i].position.z = mesh.position.z;
                    planet.children[i].scale.setScalar(this.planetScale);
                }
            }
        });

        if (this.sun) {
            this.sun.rotation.y += 0.002;
        }

        if (this.stars) {
            this.stars.rotation.y += 0.0001;
        }
    }

    /**
     * 渲染场景
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 设置公转速度
     * @param {number} speed - 速度倍率 (0.1 ~ 10)
     */
    setOrbitSpeed(speed) {
        this.orbitSpeed = speed;
    }

    /**
     * 设置行星大小比例
     * @param {number} scale - 缩放倍率 (0.5 ~ 5)
     */
    setPlanetScale(scale) {
        this.planetScale = scale;
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
     * 设置行星是否可见
     * @param {number} index - 行星索引
     * @param {boolean} visible - 是否可见
     */
    setPlanetVisible(index, visible) {
        if (this.planets[index]) {
            this.planets[index].visible = visible;
        }
        if (this.orbits[index]) {
            this.orbits[index].visible = visible && this.showOrbits;
        }
    }
}

export default SolarSystem;
