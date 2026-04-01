/**
 * 行星信息面板类
 * 管理点击行星时弹出的详细信息面板
 */
export class InfoPanel {
    /**
     * 创建信息面板实例
     */
    constructor() {
        this.overlay = document.getElementById('info-overlay');
        this.panel = document.getElementById('info-panel');
        this.closeBtn = document.getElementById('close-info');
        
        this.init();
    }

    /**
     * 初始化事件监听
     */
    init() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.hide();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });
    }

    /**
     * 显示行星信息面板
     * @param {Object} planetData - 行星数据对象
     */
    show(planetData) {
        if (!this.overlay) return;

        this.updateContent(planetData);
        this.overlay.classList.add('active');
    }

    /**
     * 隐藏信息面板
     */
    hide() {
        if (!this.overlay) return;
        this.overlay.classList.remove('active');
    }

    /**
     * 更新面板内容
     * @param {Object} planetData - 行星数据对象
     */
    updateContent(planetData) {
        const colorHex = '#' + planetData.color.toString(16).padStart(6, '0');

        const iconEl = document.getElementById('planet-icon');
        const nameEl = document.getElementById('planet-name');
        const diameterEl = document.getElementById('planet-diameter');
        const distanceEl = document.getElementById('planet-distance');
        const periodEl = document.getElementById('planet-period');
        const rotationEl = document.getElementById('planet-rotation');
        const descriptionEl = document.getElementById('planet-description');

        if (iconEl) {
            iconEl.style.background = colorHex;
            iconEl.style.color = colorHex;
        }

        if (nameEl) {
            nameEl.textContent = `${planetData.name} (${planetData.nameEn})`;
        }

        if (diameterEl) {
            diameterEl.textContent = `${planetData.diameter.toLocaleString()} 公里`;
        }

        if (distanceEl) {
            distanceEl.textContent = `${planetData.distance} 百万公里`;
        }

        if (periodEl) {
            periodEl.textContent = this.formatPeriod(planetData.orbitalPeriod);
        }

        if (rotationEl) {
            rotationEl.textContent = this.formatRotation(planetData.rotationPeriod);
        }

        if (descriptionEl) {
            descriptionEl.textContent = planetData.description;
        }
    }

    /**
     * 格式化公转周期显示
     * @param {number} days - 天数
     * @returns {string} 格式化的字符串
     */
    formatPeriod(days) {
        if (days < 365) {
            return `${days} 地球日`;
        }
        const years = (days / 365).toFixed(1);
        return `${years} 地球年 (${days.toLocaleString()} 天)`;
    }

    /**
     * 格式化自转周期显示
     * @param {number} days - 天数
     * @returns {string} 格式化的字符串
     */
    formatRotation(days) {
        if (Math.abs(days - 1) < 0.1) {
            return `${(days * 24).toFixed(0)} 小时`;
        }
        if (days < 1) {
            return `${(days * 24).toFixed(1)} 小时`;
        }
        return `${days.toFixed(1)} 地球日`;
    }
}

export default InfoPanel;
