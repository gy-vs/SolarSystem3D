import { SolarSystem } from './modules/SolarSystem.js';
import { ControlPanel } from './modules/ControlPanel.js';
import { InfoPanel } from './modules/InfoPanel.js';

/**
 * 应用主入口函数
 * 初始化所有模块并建立连接
 */
function initApp() {
  const canvas = document.getElementById('canvas');

  const solarSystem = new SolarSystem(canvas);
  const controlPanel = new ControlPanel(solarSystem);
  const infoPanel = new InfoPanel();

  controlPanel.onSpeedChange((speed) => {
    solarSystem.setOrbitSpeed(speed);
  });

  controlPanel.onScaleChange((scale) => {
    solarSystem.setPlanetScale(scale);
  });

  controlPanel.onOrbitToggle((show) => {
    solarSystem.setShowOrbits(show);
  });

  controlPanel.onPlanetToggle((planetId, visible) => {
    solarSystem.setPlanetVisible(planetId, visible);
  });

  solarSystem.onPlanetClick = (planetId) => {
    infoPanel.show(planetId);
  };
}

document.addEventListener('DOMContentLoaded', initApp);
