import type { TripPlan, PackingItem, PackingCategory, PackingList, PackingTemplate } from './types';

export const packingCategories: PackingCategory[] = [
  { id: 'documents', name: '证件', icon: '📄' },
  { id: 'clothes', name: '衣物', icon: '👕' },
  { id: 'toiletries', name: '洗漱', icon: '🧴' },
  { id: 'electronics', name: '电子设备', icon: '📱' }
];

export const mockPackingItems: PackingItem[] = [
  { id: '1', name: '护照', category: 'documents', isPacked: true },
  { id: '2', name: '身份证', category: 'documents', isPacked: false },
  { id: '3', name: '机票', category: 'documents', isPacked: true },
  { id: '4', name: '酒店预订确认单', category: 'documents', isPacked: false },
  { id: '5', name: 'T恤 x5', category: 'clothes', isPacked: false },
  { id: '6', name: '牛仔裤 x2', category: 'clothes', isPacked: true },
  { id: '7', name: '内衣裤 x7', category: 'clothes', isPacked: true },
  { id: '8', name: '外套', category: 'clothes', isPacked: false },
  { id: '9', name: '牙刷牙膏', category: 'toiletries', isPacked: true },
  { id: '10', name: '洗面奶', category: 'toiletries', isPacked: true },
  { id: '11', name: '洗发水', category: 'toiletries', isPacked: false },
  { id: '12', name: '防晒霜', category: 'toiletries', isPacked: false },
  { id: '13', name: '手机', category: 'electronics', isPacked: true },
  { id: '14', name: '充电器', category: 'electronics', isPacked: true },
  { id: '15', name: '相机', category: 'electronics', isPacked: false },
  { id: '16', name: '耳机', category: 'electronics', isPacked: true }
];

export const mockPackingList: PackingList = {
  id: '1',
  tripId: '1',
  items: mockPackingItems
};

export const mockTripPlan: TripPlan = {
  id: '1',
  name: '东京旅行',
  startDate: '2024-05-01',
  endDate: '2024-05-05',
  totalBudget: 50000,
  days: [
    {
      id: 'day1',
      date: '2024-05-01',
      activities: [
        {
          id: 'act1',
          title: '抵达东京',
          description: '乘坐飞机抵达东京成田机场',
          startTime: '10:00',
          endTime: '12:00',
          location: '成田机场',
          budget: 0
        },
        {
          id: 'act2',
          title: '酒店入住',
          description: '入住位于新宿的酒店',
          startTime: '13:00',
          endTime: '14:00',
          location: '新宿',
          budget: 8000
        },
        {
          id: 'act3',
          title: '新宿御苑',
          description: '游览新宿御苑公园',
          startTime: '14:30',
          endTime: '16:30',
          location: '新宿御苑',
          budget: 500
        }
      ]
    },
    {
      id: 'day2',
      date: '2024-05-02',
      activities: [
        {
          id: 'act4',
          title: '明治神宫',
          description: '参观明治神宫',
          startTime: '09:00',
          endTime: '11:00',
          location: '明治神宫',
          budget: 0
        },
        {
          id: 'act5',
          title: '原宿购物',
          description: '在原宿购物和午餐',
          startTime: '11:30',
          endTime: '14:30',
          location: '原宿',
          budget: 3000
        },
        {
          id: 'act6',
          title: '涩谷十字路口',
          description: '游览涩谷十字路口',
          startTime: '15:00',
          endTime: '17:00',
          location: '涩谷',
          budget: 0
        }
      ]
    },
    {
      id: 'day3',
      date: '2024-05-03',
      activities: [
        {
          id: 'act7',
          title: '东京塔',
          description: '参观东京塔',
          startTime: '10:00',
          endTime: '12:00',
          location: '东京塔',
          budget: 1200
        },
        {
          id: 'act8',
          title: '筑地市场',
          description: '在筑地市场品尝美食',
          startTime: '12:30',
          endTime: '14:30',
          location: '筑地市场',
          budget: 2000
        }
      ]
    }
  ]
};

export const packingTemplates: PackingTemplate[] = [
  {
    id: 'abroad',
    name: '出国旅行',
    description: '适合国际长途旅行的物品清单',
    icon: '✈️',
    categories: [
      { id: 'abroad-documents', name: '证件文件', icon: '📄' },
      { id: 'abroad-clothes', name: '衣物', icon: '👕' },
      { id: 'abroad-electronics', name: '电子设备', icon: '📱' },
      { id: 'abroad-toiletries', name: '洗漱用品', icon: '🧴' },
      { id: 'abroad-medicine', name: '药品', icon: '💊' }
    ],
    items: [
      { id: 'abroad-1', name: '护照', categoryId: 'abroad-documents' },
      { id: 'abroad-2', name: '身份证', categoryId: 'abroad-documents' },
      { id: 'abroad-3', name: '签证', categoryId: 'abroad-documents' },
      { id: 'abroad-4', name: '机票行程单', categoryId: 'abroad-documents' },
      { id: 'abroad-5', name: '酒店预订确认单', categoryId: 'abroad-documents' },
      { id: 'abroad-6', name: '保险单', categoryId: 'abroad-documents' },
      { id: 'abroad-7', name: '国际驾照', categoryId: 'abroad-documents' },
      { id: 'abroad-8', name: 'T恤 x5', categoryId: 'abroad-clothes' },
      { id: 'abroad-9', name: '长袖衬衫 x2', categoryId: 'abroad-clothes' },
      { id: 'abroad-10', name: '牛仔裤 x2', categoryId: 'abroad-clothes' },
      { id: 'abroad-11', name: '外套', categoryId: 'abroad-clothes' },
      { id: 'abroad-12', name: '内衣裤 x7', categoryId: 'abroad-clothes' },
      { id: 'abroad-13', name: '袜子 x7', categoryId: 'abroad-clothes' },
      { id: 'abroad-14', name: '睡衣', categoryId: 'abroad-clothes' },
      { id: 'abroad-15', name: '泳衣', categoryId: 'abroad-clothes' },
      { id: 'abroad-16', name: '手机', categoryId: 'abroad-electronics' },
      { id: 'abroad-17', name: '充电器', categoryId: 'abroad-electronics' },
      { id: 'abroad-18', name: '转换插头', categoryId: 'abroad-electronics' },
      { id: 'abroad-19', name: '移动电源', categoryId: 'abroad-electronics' },
      { id: 'abroad-20', name: '相机', categoryId: 'abroad-electronics' },
      { id: 'abroad-21', name: '耳机', categoryId: 'abroad-electronics' },
      { id: 'abroad-22', name: '平板电脑', categoryId: 'abroad-electronics' },
      { id: 'abroad-23', name: '牙刷牙膏', categoryId: 'abroad-toiletries' },
      { id: 'abroad-24', name: '洗面奶', categoryId: 'abroad-toiletries' },
      { id: 'abroad-25', name: '洗发水', categoryId: 'abroad-toiletries' },
      { id: 'abroad-26', name: '沐浴露', categoryId: 'abroad-toiletries' },
      { id: 'abroad-27', name: '防晒霜', categoryId: 'abroad-toiletries' },
      { id: 'abroad-28', name: '护肤品套装', categoryId: 'abroad-toiletries' },
      { id: 'abroad-29', name: '剃须刀', categoryId: 'abroad-toiletries' },
      { id: 'abroad-30', name: '创可贴', categoryId: 'abroad-medicine' },
      { id: 'abroad-31', name: '感冒药', categoryId: 'abroad-medicine' },
      { id: 'abroad-32', name: '肠胃药', categoryId: 'abroad-medicine' },
      { id: 'abroad-33', name: '晕车药', categoryId: 'abroad-medicine' },
      { id: 'abroad-34', name: '驱蚊液', categoryId: 'abroad-medicine' }
    ]
  },
  {
    id: 'local',
    name: '市内游玩',
    description: '适合城市短途旅行的物品清单',
    icon: '🏙️',
    categories: [
      { id: 'local-essentials', name: '随身物品', icon: '🎒' },
      { id: 'local-electronics', name: '电子设备', icon: '📱' },
      { id: 'local-clothes', name: '衣物', icon: '👕' }
    ],
    items: [
      { id: 'local-1', name: '手机', categoryId: 'local-essentials' },
      { id: 'local-2', name: '钱包', categoryId: 'local-essentials' },
      { id: 'local-3', name: '身份证', categoryId: 'local-essentials' },
      { id: 'local-4', name: '钥匙', categoryId: 'local-essentials' },
      { id: 'local-5', name: '口罩', categoryId: 'local-essentials' },
      { id: 'local-6', name: '纸巾', categoryId: 'local-essentials' },
      { id: 'local-7', name: '充电器', categoryId: 'local-electronics' },
      { id: 'local-8', name: '移动电源', categoryId: 'local-electronics' },
      { id: 'local-9', name: '耳机', categoryId: 'local-electronics' },
      { id: 'local-10', name: '相机', categoryId: 'local-electronics' },
      { id: 'local-11', name: '外套', categoryId: 'local-clothes' },
      { id: 'local-12', name: '帽子', categoryId: 'local-clothes' },
      { id: 'local-13', name: '墨镜', categoryId: 'local-clothes' }
    ]
  },
  {
    id: 'business',
    name: '商务出差',
    description: '适合商务旅行的物品清单',
    icon: '💼',
    categories: [
      { id: 'business-documents', name: '证件文件', icon: '📄' },
      { id: 'business-clothes', name: '正装衣物', icon: '👔' },
      { id: 'business-electronics', name: '电子设备', icon: '💻' },
      { id: 'business-toiletries', name: '洗漱用品', icon: '🧴' }
    ],
    items: [
      { id: 'business-1', name: '身份证', categoryId: 'business-documents' },
      { id: 'business-2', name: '名片', categoryId: 'business-documents' },
      { id: 'business-3', name: '机票行程单', categoryId: 'business-documents' },
      { id: 'business-4', name: '酒店预订确认单', categoryId: 'business-documents' },
      { id: 'business-5', name: '笔记本电脑', categoryId: 'business-electronics' },
      { id: 'business-6', name: '电脑充电器', categoryId: 'business-electronics' },
      { id: 'business-7', name: '手机', categoryId: 'business-electronics' },
      { id: 'business-8', name: '手机充电器', categoryId: 'business-electronics' },
      { id: 'business-9', name: '移动电源', categoryId: 'business-electronics' },
      { id: 'business-10', name: '耳机', categoryId: 'business-electronics' },
      { id: 'business-11', name: 'U盘', categoryId: 'business-electronics' },
      { id: 'business-12', name: '西装套装 x2', categoryId: 'business-clothes' },
      { id: 'business-13', name: '衬衫 x4', categoryId: 'business-clothes' },
      { id: 'business-14', name: '领带 x3', categoryId: 'business-clothes' },
      { id: 'business-15', name: '皮带', categoryId: 'business-clothes' },
      { id: 'business-16', name: '皮鞋', categoryId: 'business-clothes' },
      { id: 'business-17', name: '休闲装', categoryId: 'business-clothes' },
      { id: 'business-18', name: '内衣裤 x5', categoryId: 'business-clothes' },
      { id: 'business-19', name: '牙刷牙膏', categoryId: 'business-toiletries' },
      { id: 'business-20', name: '洗面奶', categoryId: 'business-toiletries' },
      { id: 'business-21', name: '剃须刀', categoryId: 'business-toiletries' },
      { id: 'business-22', name: '护肤品', categoryId: 'business-toiletries' }
    ]
  }
];
