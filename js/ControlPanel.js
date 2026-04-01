import { PLANET_DATA } from './planetData.js';

/**
 * 控制面板类
 * 管理UI控件与太阳系场景的交互
 */
export class ControlPanel {
    /**
     * 创建控制面板实例
     * @param {SolarSystem} solarSystem - 太阳系实例
     */
    constructor(solarSystem) {
        this.solarSystem = solarSystem;
        this.init();
    }

    /**
     * 初始化所有控制面板控件
     */
    init() {
        this.initOrbitSpeedSlider();
        this.initPlanetScaleSlider();
        this.initOrbitToggle();
        this.initPlanetToggles();
    }

    /**
     * 初始化公转速度滑块
     */
    initOrbitSpeedSlider() {
        const slider = document.getElementById('orbit-speed');
        const valueDisplay = document.getElementById('orbit-speed-value');

        if (!slider || !valueDisplay) return;

        slider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.solarSystem.setOrbitSpeed(speed);
            valueDisplay.textContent = `${speed.toFixed(1)}x`;
        });
    }

    /**
     * 初始化行星大小比例滑块
     */
    initPlanetScaleSlider() {
        const slider = document.getElementById('planet-scale');
        const valueDisplay = document.getElementById('planet-scale-value');

        if (!slider || !valueDisplay) return;

        slider.addEventListener('input', (e) => {
            const scale = parseFloat(e.target.value);
            this.solarSystem.setPlanetScale(scale);
            valueDisplay.textContent = `${scale.toFixed(1)}x`;
        });
    }

    /**
     * 初始化轨道线显示开关
     */
    initOrbitToggle() {
        const toggle = document.getElementById('show-orbits');

        if (!toggle) return;

        toggle.addEventListener('change', (e) => {
            this.solarSystem.setShowOrbits(e.target.checked);
        });
    }

    /**
     * 初始化各行星显示/隐藏开关
     */
    initPlanetToggles() {
        const container = document.getElementById('planet-toggles');

        if (!container) return;

        PLANET_DATA.forEach((planet, index) => {
            const toggleHtml = this.createPlanetToggleHtml(planet, index);
            container.insertAdjacentHTML('beforeend', toggleHtml);

            const toggle = document.getElementById(`planet-${index}`);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    this.solarSystem.setPlanetVisible(index, e.target.checked);
                });
            }
        });
    }

    /**
     * 创进行星开关的HTML
     * @param {Object} planet - 行星数据
     * @param {number} index - 行星索引
     * @returns {string} HTML字符串
     */
    createPlanetToggleHtml(planet, index) {
        const colorHex = '#' + planet.color.toString(16).padStart(6, '0');
        
        return `
            <div class="planet-toggle">
                <label>
                    <span class="planet-dot" style="background: ${colorHex}; color: ${colorHex}"></span>
                    ${planet.name}
                </label>
                <label class="toggle-switch">
                    <input type="checkbox" id="planet-${index}" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;
    }
}

export default ControlPanel;
