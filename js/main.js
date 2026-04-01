import { SolarSystem } from './SolarSystem.js';
import { ControlPanel } from './ControlPanel.js';
import { InfoPanel } from './InfoPanel.js';

/**
 * 应用主入口
 * 初始化所有模块并启动动画循环
 */
class App {
    /**
     * 创建应用实例
     */
    constructor() {
        this.solarSystem = null;
        this.controlPanel = null;
        this.infoPanel = null;
        this.lastTime = 0;

        this.init();
        this.animate();
    }

    /**
     * 初始化所有模块
     */
    init() {
        const canvas = document.getElementById('scene-canvas');
        
        this.solarSystem = new SolarSystem(canvas);
        this.controlPanel = new ControlPanel(this.solarSystem);
        this.infoPanel = new InfoPanel();

        this.solarSystem.onPlanetClick = (planetData) => {
            this.infoPanel.show(planetData);
        };
    }

    /**
     * 动画循环
     * @param {number} currentTime - 当前时间戳
     */
    animate(currentTime = 0) {
        requestAnimationFrame((time) => this.animate(time));

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.solarSystem.update(deltaTime);
        this.solarSystem.render();
    }
}

/**
 * 启动应用
 */
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
