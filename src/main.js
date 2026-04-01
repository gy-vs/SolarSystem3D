import { SolarSystemScene } from './scene.js';
import { UIController } from './ui.js';

/**
 * 主应用入口
 */
let scene = null;
let ui = null;

/**
 * 初始化应用
 */
function init() {
  const container = document.getElementById('canvas-container');

  scene = new SolarSystemScene(container, {
    onPlanetClick: (planetData) => {
      ui.showInfoPanel(planetData);
    }
  });

  ui = new UIController({
    onOrbitSpeedChange: (speed) => {
      scene.setOrbitSpeed(speed);
    },
    onPlanetScaleChange: (scale) => {
      scene.setPlanetScale(scale);
    },
    onShowOrbitsChange: (show) => {
      scene.setShowOrbits(show);
    },
    onPlanetVisibilityChange: (planetId, visible) => {
      scene.setPlanetVisible(planetId, visible);
    },
    onCameraMove: (angle, distance) => {
      updateCamera(angle, distance);
    }
  });
}

/**
 * 更新相机位置
 * @param {Object} angle - 角度对象 { theta, phi }
 * @param {number} distance - 距离
 */
function updateCamera(angle, distance) {
  if (!scene) return;

  const x = distance * Math.sin(angle.phi) * Math.cos(angle.theta);
  const y = distance * Math.cos(angle.phi);
  const z = distance * Math.sin(angle.phi) * Math.sin(angle.theta);

  scene.camera.position.set(x, y, z);
  scene.camera.lookAt(0, 0, 0);
}

/**
 * 页面加载完成后初始化
 */
window.addEventListener('DOMContentLoaded', init);
