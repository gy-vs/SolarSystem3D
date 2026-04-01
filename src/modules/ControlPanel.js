import { PLANETS_DATA } from '../data/planets.js';

/**
 * 控制面板类
 * 负责管理所有UI控件和用户交互
 */
export class ControlPanel {
  /**
   * 构造函数
   * @param {SolarSystem} solarSystem - 太阳系渲染实例
   */
  constructor(solarSystem) {
    this.solarSystem = solarSystem;
    this.callbacks = {
      onSpeedChange: null,
      onScaleChange: null,
      onOrbitToggle: null,
      onPlanetToggle: null,
      onPlanetClick: null
    };

    this.init();
  }

  /**
   * 初始化所有控制面板元素
   */
  init() {
    this.setupSpeedSlider();
    this.setupScaleSlider();
    this.setupOrbitToggle();
    this.setupPlanetToggles();
  }

  /**
   * 设置公转速度滑块
   */
  setupSpeedSlider() {
    const slider = document.getElementById('speed-slider');
    const valueDisplay = document.getElementById('speed-value');

    slider.addEventListener('input', (e) => {
      const speed = parseFloat(e.target.value);
      valueDisplay.textContent = `${speed.toFixed(1)}x`;
      
      if (this.callbacks.onSpeedChange) {
        this.callbacks.onSpeedChange(speed);
      }
    });
  }

  /**
   * 设置行星大小比例滑块
   */
  setupScaleSlider() {
    const slider = document.getElementById('scale-slider');
    const valueDisplay = document.getElementById('scale-value');

    slider.addEventListener('input', (e) => {
      const scale = parseFloat(e.target.value);
      valueDisplay.textContent = `${scale.toFixed(1)}x`;
      
      if (this.callbacks.onScaleChange) {
        this.callbacks.onScaleChange(scale);
      }
    });
  }

  /**
   * 设置轨道线显示开关
   */
  setupOrbitToggle() {
    const toggle = document.getElementById('orbit-toggle');

    toggle.addEventListener('change', (e) => {
      if (this.callbacks.onOrbitToggle) {
        this.callbacks.onOrbitToggle(e.target.checked);
      }
    });
  }

  /**
   * 创建行星显示开关列表
   */
  setupPlanetToggles() {
    const container = document.getElementById('planet-toggles');

    PLANETS_DATA.forEach(planet => {
      const toggleElement = this.createPlanetToggle(planet);
      container.appendChild(toggleElement);
    });
  }

  /**
   * 创建单个行星显示开关
   * @param {Object} planet - 行星数据对象
   * @returns {HTMLElement} 行星开关元素
   */
  createPlanetToggle(planet) {
    const wrapper = document.createElement('div');
    wrapper.className = 'planet-toggle';

    const colorDot = document.createElement('div');
    colorDot.className = 'planet-color';
    colorDot.style.backgroundColor = `#${planet.color.toString(16).padStart(6, '0')}`;

    const name = document.createElement('span');
    name.className = 'planet-name';
    name.textContent = planet.name;

    const label = document.createElement('label');
    label.className = 'toggle-switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = true;
    input.dataset.planetId = planet.id;

    input.addEventListener('change', (e) => {
      if (this.callbacks.onPlanetToggle) {
        this.callbacks.onPlanetToggle(planet.id, e.target.checked);
      }
    });

    const slider = document.createElement('span');
    slider.className = 'toggle-slider';

    label.appendChild(input);
    label.appendChild(slider);

    wrapper.appendChild(colorDot);
    wrapper.appendChild(name);
    wrapper.appendChild(label);

    return wrapper;
  }

  /**
   * 注册速度变化回调函数
   * @param {Function} callback - 回调函数，接收速度参数
   */
  onSpeedChange(callback) {
    this.callbacks.onSpeedChange = callback;
  }

  /**
   * 注册缩放比例变化回调函数
   * @param {Function} callback - 回调函数，接收缩放比例参数
   */
  onScaleChange(callback) {
    this.callbacks.onScaleChange = callback;
  }

  /**
   * 注册轨道线开关回调函数
   * @param {Function} callback - 回调函数，接收是否显示参数
   */
  onOrbitToggle(callback) {
    this.callbacks.onOrbitToggle = callback;
  }

  /**
   * 注册行星显示开关回调函数
   * @param {Function} callback - 回调函数，接收行星ID和是否显示参数
   */
  onPlanetToggle(callback) {
    this.callbacks.onPlanetToggle = callback;
  }

  /**
   * 注册行星点击回调函数
   * @param {Function} callback - 回调函数，接收行星ID参数
   */
  onPlanetClick(callback) {
    this.callbacks.onPlanetClick = callback;
  }
}
