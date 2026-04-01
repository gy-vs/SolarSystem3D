/**
 * 行星数据模块
 * 包含太阳系 8 大行星的真实天文数据（经过适当缩放以便可视化）
 */

export const PLANETS_DATA = [
  {
    id: 'mercury',
    name: '水星',
    nameEn: 'Mercury',
    color: 0x999999,
    emissive: 0x333333,
    diameter: 0.38,
    distance: 0.39,
    orbitalPeriod: 0.24,
    rotationPeriod: 58.6,
    description: '水星是太阳系中最小的行星，也是距离太阳最近的行星。它的表面布满陨石坑，温度变化极大。'
  },
  {
    id: 'venus',
    name: '金星',
    nameEn: 'Venus',
    color: 0xffd700,
    emissive: 0x443300,
    diameter: 0.95,
    distance: 0.72,
    orbitalPeriod: 0.62,
    rotationPeriod: -243,
    description: '金星是太阳系中最热的行星，拥有浓厚的二氧化碳大气层。它的自转方向与其他行星相反。'
  },
  {
    id: 'earth',
    name: '地球',
    nameEn: 'Earth',
    color: 0x4a9eff,
    emissive: 0x113366,
    diameter: 1.0,
    distance: 1.0,
    orbitalPeriod: 1.0,
    rotationPeriod: 1.0,
    description: '地球是我们的家园，是目前已知唯一存在生命的星球。它拥有液态水和适宜的大气层。'
  },
  {
    id: 'mars',
    name: '火星',
    nameEn: 'Mars',
    color: 0xff4500,
    emissive: 0x441100,
    diameter: 0.53,
    distance: 1.52,
    orbitalPeriod: 1.88,
    rotationPeriod: 1.03,
    description: '火星被称为"红色星球"，因其表面富含氧化铁而呈现红色。它是人类探索的重要目标。'
  },
  {
    id: 'jupiter',
    name: '木星',
    nameEn: 'Jupiter',
    color: 0xdaa520,
    emissive: 0x443300,
    diameter: 11.2,
    distance: 5.2,
    orbitalPeriod: 11.86,
    rotationPeriod: 0.41,
    description: '木星是太阳系中最大的行星，拥有著名的大红斑和至少 95 个已知卫星。它主要由氢和氦组成。'
  },
  {
    id: 'saturn',
    name: '土星',
    nameEn: 'Saturn',
    color: 0xffd700,
    emissive: 0x443300,
    diameter: 9.45,
    distance: 9.58,
    orbitalPeriod: 29.46,
    rotationPeriod: 0.45,
    description: '土星以其壮观的环系统而闻名，这些环主要由冰块和岩石碎片组成。它是太阳系中密度最小的行星。'
  },
  {
    id: 'uranus',
    name: '天王星',
    nameEn: 'Uranus',
    color: 0x00ffff,
    emissive: 0x003333,
    diameter: 4.01,
    distance: 19.22,
    orbitalPeriod: 84.01,
    rotationPeriod: -0.72,
    description: '天王星是一颗冰巨星，其独特之处在于它几乎是"躺着"公转的，自转轴倾斜角度约 98 度。'
  },
  {
    id: 'neptune',
    name: '海王星',
    nameEn: 'Neptune',
    color: 0x4169e1,
    emissive: 0x112244,
    diameter: 3.88,
    distance: 30.05,
    orbitalPeriod: 164.8,
    rotationPeriod: 0.67,
    description: '海王星是太阳系最外层的行星，拥有强烈的风暴系统。它的深蓝色来自于大气中的甲烷。'
  }
];

/**
 * 获取所有行星数据
 * @returns {Array} 行星数据数组
 */
export function getPlanetsData() {
  return PLANETS_DATA;
}

/**
 * 根据 ID 获取行星数据
 * @param {string} id - 行星 ID
 * @returns {Object|null} 行星数据对象，如果未找到则返回 null
 */
export function getPlanetById(id) {
  return PLANETS_DATA.find(planet => planet.id === id) || null;
}
