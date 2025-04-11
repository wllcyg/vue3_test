import house from '@/assets/house.jpg'
import plane from '@/assets/plane.jpg'
import road from '@/assets/road.jpg'
import sunshine from '@/assets/sunshine.jpg'

export const cardData = [
  {
    imgSrc: sunshine, // 替换为你的图片实际路径
    title: '仰望星空',
    subtitle: '探索宇宙的奥秘',
    primaryText: '浩瀚星辰，点亮你前行的路。',
    secondaryText: '即使在寂静中，也蕴藏着无限可能。',
    buttonColor: 'deep-purple accent-4',
    shareButtonText: '分享此刻',
    exploreButtonText: '了解更多'
  },
  {
    imgSrc: plane, // 替换为你的图片实际路径
    title: '梦想启航',
    subtitle: '开启新的旅程',
    primaryText: '每一次起飞，都是探索新世界的机会。',
    secondaryText: '让视野更开阔，让心灵去远方。',
    buttonColor: 'primary', // Vuetify 默认主题色
    shareButtonText: '分享旅途',
    exploreButtonText: '探索目的地'
  },
  {
    imgSrc: house, // 替换为你的图片实际路径
    title: '智慧生活',
    subtitle: '科技点亮未来',
    primaryText: '让科技融入日常，享受更舒适、节能的生活。',
    secondaryText: '智能家居，为您打造个性化的居住体验。',
    buttonColor: 'teal', // 或者 'green'
    shareButtonText: '分享体验',
    exploreButtonText: '了解方案'
  },
  {
    imgSrc:road, // 替换为你的图片实际路径
    title: '探索之旅',
    subtitle: '发现沿途的风景',
    primaryText: '重要的不是终点，是沿途风景。',
    secondaryText: '勇敢地踏上未知道路，总有惊喜在等待。',
    buttonColor: 'orange darken-2',
    shareButtonText: '分享路线',
    exploreButtonText: '规划行程'
  }
];


export const commonCardProps = {
  maxWidth: 344, // 示例最大宽度
  imgHeight: 200  // 示例图片高度
};
