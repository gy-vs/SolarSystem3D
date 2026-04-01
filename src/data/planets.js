/**
 * 行星天文数据（基于真实数据缩放）
 * 数据来源：NASA 太阳系行星数据
 * 大小和距离均经过适当缩放以便于可视化
 */
export const PLANETS_DATA = [
  {
    id: 'mercury',
    name: '水星',
    color: 0xaaaaaa,
    size: 0.38,
    distance: 8,
    orbitPeriod: 0.24,
    rotationPeriod: 58.6,
    diameter: '4,879 km',
    distanceFromSun: '5,790万 km',
    orbitalPeriod: '88 地球日',
    description: '水星是太阳系中最小的行星，也是距离太阳最近的行星。它的表面布满陨石坑，没有大气层保护，昼夜温差极大。'
  },
  {
    id: 'venus',
    name: '金星',
    color: 0xffd699,
    size: 0.95,
    distance: 12,
    orbitPeriod: 0.62,
    rotationPeriod: 243,
    diameter: '12,104 km',
    distanceFromSun: '1.082亿 km',
    orbitalPeriod: '225 地球日',
    description: '金星被称为地球的"姊妹星"，大小相近。它拥有浓厚的二氧化碳大气层，产生强烈的温室效应，是太阳系中最热的行星。'
  },
  {
    id: 'earth',
    name: '地球',
    color: 0x4a90d9,
    size: 1,
    distance: 16,
    orbitPeriod: 1,
    rotationPeriod: 1,
    diameter: '12,742 km',
    distanceFromSun: '1.496亿 km',
    orbitalPeriod: '365.25 地球日',
    description: '地球是目前已知唯一存在生命的星球。它拥有液态水、适宜的大气层和磁场，为生命提供了完美的环境。'
  },
  {
    id: 'mars',
    name: '火星',
    color: 0xe27b58,
    size: 0.53,
    distance: 22,
    orbitPeriod: 1.88,
    rotationPeriod: 1.03,
    diameter: '6,779 km',
    distanceFromSun: '2.279亿 km',
    orbitalPeriod: '687 地球日',
    description: '火星被称为"红色星球"，表面有巨大的火山和峡谷。它是人类太空探索的主要目标，也是寻找外星生命的重点对象。'
  },
  {
    id: 'jupiter',
    name: '木星',
    color: 0xd4a574,
    size: 2.5,
    distance: 35,
    orbitPeriod: 11.86,
    rotationPeriod: 0.41,
    diameter: '139,820 km',
    distanceFromSun: '7.786亿 km',
    orbitalPeriod: '11.86 地球年',
    description: '木星是太阳系中最大的行星，质量是其他所有行星总和的2.5倍。著名的大红斑是一个持续了数百年的巨大风暴。'
  },
  {
    id: 'saturn',
    name: '土星',
    color: 0xe8c886,
    size: 2.2,
    distance: 50,
    orbitPeriod: 29.46,
    rotationPeriod: 0.45,
    diameter: '116,460 km',
    distanceFromSun: '14.29亿 km',
    orbitalPeriod: '29.46 地球年',
    description: '土星以其壮丽的光环系统而闻名，主要由冰粒和岩石碎片组成。它的密度非常低，如果有足够大的海洋，土星可以漂浮在水面上。'
  },
  {
    id: 'uranus',
    name: '天王星',
    color: 0x7de3f4,
    size: 1.6,
    distance: 65,
    orbitPeriod: 84.01,
    rotationPeriod: 0.72,
    diameter: '50,724 km',
    distanceFromSun: '28.71亿 km',
    orbitalPeriod: '84.01 地球年',
    description: '天王星是太阳系中最特别的行星，它的自转轴几乎与公转平面平行，像是"躺着"转。它呈现美丽的蓝绿色，因为大气中含有甲烷。'
  },
  {
    id: 'neptune',
    name: '海王星',
    color: 0x4b70dd,
    size: 1.5,
    distance: 80,
    orbitPeriod: 164.8,
    rotationPeriod: 0.67,
    diameter: '49,244 km',
    distanceFromSun: '45.04亿 km',
    orbitalPeriod: '164.8 地球年',
    description: '海王星是太阳系中风速最快的行星，风速可达每小时2000公里。它深邃的蓝色来自大气中的甲烷和未知的蓝色物质。'
  }
];

/**
 * 根据行星ID获取行星数据
 * @param {string} id - 行星ID
 * @returns {Object|null} 行星数据对象，未找到则返回null
 */
export function getPlanetById(id) {
  return PLANETS_DATA.find(planet => planet.id === id) || null;
}
