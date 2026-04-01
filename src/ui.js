import { PLANETS_DATA } from './data.js';

/**
 * UI 控制面板管理类
 */
export class UIController {
  /**
   * 构造函数
   * @param {Object} callbacks - 回调函数对象
   */
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.infoPanel = null;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.cameraAngle = { theta: 0, phi: Math.PI / 4 };
    this.cameraDistance = 80;

    this.init();
  }

  /**
   * 初始化 UI
   */
  init() {
    this.createControlPanel();
    this.createInfoPanel();
    this.setupMouseControls();
  }

  /**
   * 创建控制面板
   */
  createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'control-panel';
    panel.className = 'control-panel';

    panel.innerHTML = `
      <div class="panel-header">
        <h2>控制面板</h2>
      </div>
      
      <div class="panel-section">
        <h3>动画控制</h3>
        <div class="control-item">
          <label for="orbit-speed">公转速度</label>
          <div class="slider-container">
            <input type="range" id="orbit-speed" min="0.1" max="10" step="0.1" value="1">
            <span class="slider-value">1.0x</span>
          </div>
        </div>
        <div class="control-item">
          <label for="planet-scale">行星大小</label>
          <div class="slider-container">
            <input type="range" id="planet-scale" min="0.5" max="3" step="0.1" value="1">
            <span class="slider-value">1.0x</span>
          </div>
        </div>
      </div>
      
      <div class="panel-section">
        <h3>显示设置</h3>
        <div class="control-item">
          <label class="toggle-label">
            <span class="planet-name">显示轨道线</span>
            <div class="toggle-wrapper">
              <input type="checkbox" id="show-orbits" checked>
              <span class="toggle-slider"></span>
            </div>
          </label>
        </div>
      </div>
      
      <div class="panel-section">
        <h3>行星显示</h3>
        <div class="planets-list">
          ${PLANETS_DATA.map(planet => `
            <div class="control-item">
              <label class="toggle-label">
                <span class="planet-name">${planet.name}</span>
                <div class="toggle-wrapper">
                  <input type="checkbox" class="planet-toggle" data-planet="${planet.id}" checked>
                  <span class="toggle-slider"></span>
                </div>
              </label>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    this.setupControlEvents();
  }

  /**
   * 设置控制事件
   */
  setupControlEvents() {
    const orbitSpeedSlider = document.getElementById('orbit-speed');
    const planetScaleSlider = document.getElementById('planet-scale');
    const showOrbitsCheckbox = document.getElementById('show-orbits');
    const planetToggles = document.querySelectorAll('.planet-toggle');

    orbitSpeedSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = value.toFixed(1) + 'x';
      if (this.callbacks.onOrbitSpeedChange) {
        this.callbacks.onOrbitSpeedChange(value);
      }
    });

    planetScaleSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      e.target.nextElementSibling.textContent = value.toFixed(1) + 'x';
      if (this.callbacks.onPlanetScaleChange) {
        this.callbacks.onPlanetScaleChange(value);
      }
    });

    showOrbitsCheckbox.addEventListener('change', (e) => {
      if (this.callbacks.onShowOrbitsChange) {
        this.callbacks.onShowOrbitsChange(e.target.checked);
      }
    });

    planetToggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const planetId = e.target.dataset.planet;
        if (this.callbacks.onPlanetVisibilityChange) {
          this.callbacks.onPlanetVisibilityChange(planetId, e.target.checked);
        }
      });
    });
  }

  /**
   * 创建信息面板
   */
  createInfoPanel() {
    this.infoPanel = document.createElement('div');
    this.infoPanel.id = 'info-panel';
    this.infoPanel.className = 'info-panel hidden';

    this.infoPanel.innerHTML = `
      <button class="close-btn" id="close-info">&times;</button>
      <div class="info-content">
        <h2 class="planet-title" id="planet-title"></h2>
        <div class="planet-data">
          <div class="data-item">
            <span class="data-icon">📏</span>
            <div class="data-text">
              <span class="data-label">直径</span>
              <span class="data-value" id="planet-diameter"></span>
            </div>
          </div>
          <div class="data-item">
            <span class="data-icon">🌍</span>
            <div class="data-text">
              <span class="data-label">与太阳距离</span>
              <span class="data-value" id="planet-distance"></span>
            </div>
          </div>
          <div class="data-item">
            <span class="data-icon">⏱️</span>
            <div class="data-text">
              <span class="data-label">公转周期</span>
              <span class="data-value" id="planet-period"></span>
            </div>
          </div>
        </div>
        <p class="planet-description" id="planet-description"></p>
      </div>
    `;

    document.body.appendChild(this.infoPanel);

    document.getElementById('close-info').addEventListener('click', () => {
      this.hideInfoPanel();
    });
  }

  /**
   * 显示信息面板
   * @param {Object} planetData - 行星数据
   */
  showInfoPanel(planetData) {
    document.getElementById('planet-title').textContent = planetData.name + ' (' + planetData.nameEn + ')';
    document.getElementById('planet-diameter').textContent = (planetData.diameter * 12742).toFixed(0) + ' km';
    document.getElementById('planet-distance').textContent = (planetData.distance * 149.6).toFixed(1) + ' 百万 km';
    document.getElementById('planet-period').textContent = (planetData.orbitalPeriod * 365.25).toFixed(1) + ' 地球日';
    document.getElementById('planet-description').textContent = planetData.description;

    this.infoPanel.classList.remove('hidden');
    setTimeout(() => {
      this.infoPanel.classList.add('visible');
    }, 10);
  }

  /**
   * 隐藏信息面板
   */
  hideInfoPanel() {
    this.infoPanel.classList.remove('visible');
    setTimeout(() => {
      this.infoPanel.classList.add('hidden');
    }, 300);
  }

  /**
   * 设置鼠标控制
   */
  setupMouseControls() {
    const canvasContainer = document.getElementById('canvas-container');

    canvasContainer.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.cameraAngle.theta -= deltaX * 0.005;
      this.cameraAngle.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.cameraAngle.phi + deltaY * 0.005));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };

      if (this.callbacks.onCameraMove) {
        this.callbacks.onCameraMove(this.cameraAngle, this.cameraDistance);
      }
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    canvasContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraDistance = Math.max(30, Math.min(200, this.cameraDistance + e.deltaY * 0.1));

      if (this.callbacks.onCameraMove) {
        this.callbacks.onCameraMove(this.cameraAngle, this.cameraDistance);
      }
    });
  }
}
