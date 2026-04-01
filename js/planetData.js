/**
 * 行星天文数据（基于真实数据缩放）
 * 来源: NASA 行星概况数据
 * @type {Array<Object>}
 */
export const PLANET_DATA = [
    {
        name: '水星',
        nameEn: 'Mercury',
        color: 0xadacac,
        diameter: 4879,
        distance: 57.9,
        orbitalPeriod: 88,
        rotationPeriod: 58.6,
        description: '水星是太阳系中最小的行星，也是距离太阳最近的行星。它的表面布满了陨石坑，没有大气层保护，昼夜温差极大。',
        scale: 0.5
    },
    {
        name: '金星',
        nameEn: 'Venus',
        color: 0xffc649,
        diameter: 12104,
        distance: 108.2,
        orbitalPeriod: 225,
        rotationPeriod: 243,
        description: '金星是太阳系中最热的行星，被厚厚的二氧化碳大气层包围，产生强烈的温室效应。它是夜空中最亮的天体之一。',
        scale: 0.9
    },
    {
        name: '地球',
        nameEn: 'Earth',
        color: 0x4a90d9,
        diameter: 12742,
        distance: 149.6,
        orbitalPeriod: 365,
        rotationPeriod: 1,
        description: '地球是我们的家园，也是目前已知唯一存在生命的星球。它拥有液态水和适宜生命存在的大气层。',
        scale: 1
    },
    {
        name: '火星',
        nameEn: 'Mars',
        color: 0xff5733,
        diameter: 6779,
        distance: 227.9,
        orbitalPeriod: 687,
        rotationPeriod: 1.03,
        description: '火星被称为红色星球，表面有着太阳系最大的火山奥林匹斯山和最大的峡谷水手号峡谷。是人类太空探索的重点目标。',
        scale: 0.6
    },
    {
        name: '木星',
        nameEn: 'Jupiter',
        color: 0xe8c480,
        diameter: 139820,
        distance: 778.5,
        orbitalPeriod: 4333,
        rotationPeriod: 0.41,
        description: '木星是太阳系中最大的行星，质量是其他所有行星总和的2.5倍。著名的大红斑是一个持续了数百年的巨大风暴。',
        scale: 3.0
    },
    {
        name: '土星',
        nameEn: 'Saturn',
        color: 0xf4d59e,
        diameter: 116460,
        distance: 1433.5,
        orbitalPeriod: 10759,
        rotationPeriod: 0.45,
        description: '土星以其壮观的环系统而闻名，主要由冰和岩石碎片组成。它是太阳系中密度最低的行星，甚至可以漂浮在水上。',
        scale: 2.7,
        hasRings: true
    },
    {
        name: '天王星',
        nameEn: 'Uranus',
        color: 0x72e2e2,
        diameter: 50724,
        distance: 2872.5,
        orbitalPeriod: 30687,
        rotationPeriod: 0.72,
        description: '天王星是一个冰巨星，其自转轴几乎与公转平面平行，像是"躺着"绕太阳运行。它呈现出独特的蓝绿色。',
        scale: 2.1
    },
    {
        name: '海王星',
        nameEn: 'Neptune',
        color: 0x4b70dd,
        diameter: 49244,
        distance: 4495.1,
        orbitalPeriod: 60190,
        rotationPeriod: 0.67,
        description: '海王星是太阳系最远的行星，有着太阳系最强的风暴。它的深蓝色来自大气中的甲烷吸收红光。',
        scale: 2.0
    }
];

/**
 * 太阳系配置参数
 * @type {Object}
 */
export const SOLAR_SYSTEM_CONFIG = {
    distanceScale: 0.08,
    sizeScale: 0.00008,
    baseOrbitSpeed: 0.001,
    baseRotationSpeed: 0.02
};

export default PLANET_DATA;
