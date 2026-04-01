import { getPlanetById } from '../data/planets.js';

/**
 * 行星信息面板类
 * 负责管理行星详情面板的显示和隐藏
 */
export class InfoPanel {
  /**
   * 构造函数
   */
  constructor() {
    this.panel = document.getElementById('info-panel');
    this.closeBtn = document.getElementById('close-panel');
    this.isVisible = false;

    this.setupEvents();
  }

  /**
   * 设置事件监听
   */
  setupEvents() {
    this.closeBtn.addEventListener('click', () => {
      this.hide();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  /**
   * 显示行星信息面板
   * @param {string} planetId - 行星ID
   */
  show(planetId) {
    const planet = getPlanetById(planetId);
    if (!planet) return;

    document.getElementById('planet-name').textContent = planet.name;
    document.getElementById('planet-diameter').textContent = planet.diameter;
    document.getElementById('planet-distance').textContent = planet.distanceFromSun;
    document.getElementById('planet-period').textContent = planet.orbitalPeriod;
    document.getElementById('planet-description').textContent = planet.description;

    this.panel.classList.remove('hidden');
    this.isVisible = true;
  }

  /**
   * 隐藏行星信息面板
   */
  hide() {
    this.panel.classList.add('hidden');
    this.isVisible = false;
  }

  /**
   * 切换面板显示状态
   * @param {string} planetId - 行星ID
   */
  toggle(planetId) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(planetId);
    }
  }
}
