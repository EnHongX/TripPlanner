import type { TripPlan, PackingItem, PackingCategory, PackingList } from './types';

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
