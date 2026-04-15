import { TripPlan } from './types';

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
