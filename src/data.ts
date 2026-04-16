import type { TripPlan, PackingItem, PackingCategory, PackingList, PackingTemplate, TravelInfo, Transportation, Accommodation, Reminder, ReminderList, DayReview, PhotoNote, ReviewList } from './types';

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
  items: [],
  categories: packingCategories
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

export const mockAccommodations: Accommodation[] = [
  {
    id: 'acc1',
    name: '新宿王子酒店',
    address: '日本东京都新宿区西新宿1-1-1',
    checkInDate: '2024-05-01',
    checkOutDate: '2024-05-03',
    roomType: '标准双人间',
    price: 16000,
    bookingNumber: 'ACC20240501001',
    notes: '含早餐，免费WiFi，靠近新宿站'
  },
  {
    id: 'acc2',
    name: '浅草微笑酒店',
    address: '日本东京都台东区浅草1-2-3',
    checkInDate: '2024-05-03',
    checkOutDate: '2024-05-05',
    roomType: '豪华大床房',
    price: 20000,
    bookingNumber: 'ACC20240503002',
    notes: '靠近浅草寺，可观赏晴空塔'
  }
];

export const mockTransportations: Transportation[] = [
  {
    id: 'trans1',
    type: 'flight',
    number: 'MU271',
    fromLocation: '上海浦东机场(PVG)',
    toLocation: '东京成田机场(NRT)',
    departureTime: '2024-05-01 08:30',
    arrivalTime: '2024-05-01 12:30',
    price: 3500,
    seatNumber: '12A',
    bookingNumber: 'FL20240501001',
    notes: '东方航空，含20kg托运行李'
  },
  {
    id: 'trans2',
    type: 'train',
    number: "N'EX成田特快",
    fromLocation: '成田机场',
    toLocation: '新宿站',
    departureTime: '2024-05-01 13:00',
    arrivalTime: '2024-05-01 14:30',
    price: 300,
    seatNumber: '自由席',
    bookingNumber: 'TR20240501001',
    notes: 'JR东日本，可使用Suica卡'
  },
  {
    id: 'trans3',
    type: 'flight',
    number: 'MU272',
    fromLocation: '东京成田机场(NRT)',
    toLocation: '上海浦东机场(PVG)',
    departureTime: '2024-05-05 14:00',
    arrivalTime: '2024-05-05 16:00',
    price: 3200,
    seatNumber: '15B',
    bookingNumber: 'FL20240505001',
    notes: '东方航空，含20kg托运行李'
  }
];

export const mockTravelInfo: TravelInfo = {
  id: '1',
  tripId: '1',
  accommodations: mockAccommodations,
  transportations: mockTransportations
};

export const mockReminders: Reminder[] = [
  {
    id: 'rem1',
    title: '确认护照有效期',
    description: '检查护照是否在有效期内，确保至少还有6个月有效期',
    type: 'document',
    date: '2024-04-20',
    time: '10:00',
    isCompleted: true,
    createdAt: '2024-04-10'
  },
  {
    id: 'rem2',
    title: '预订东京酒店',
    description: '预订新宿地区的酒店，靠近地铁站',
    type: 'booking',
    date: '2024-04-25',
    time: '14:00',
    isCompleted: true,
    createdAt: '2024-04-12'
  },
  {
    id: 'rem3',
    title: '购买旅行保险',
    description: '购买涵盖医疗和行李损失的旅行保险',
    type: 'other',
    date: '2024-04-28',
    time: '16:00',
    isCompleted: false,
    createdAt: '2024-04-15'
  },
  {
    id: 'rem4',
    title: '准备随身物品清单',
    description: '列出需要随身携带的物品，避免遗漏',
    type: 'packing',
    date: '2024-04-30',
    time: '09:00',
    isCompleted: false,
    createdAt: '2024-04-18'
  },
  {
    id: 'rem5',
    title: '确认机票行程',
    description: '再次确认航班时间和座位选择',
    type: 'booking',
    date: '2024-05-01',
    time: '08:00',
    isCompleted: false,
    createdAt: '2024-04-20'
  },
  {
    id: 'rem6',
    title: '安排机场接送',
    description: '预订从酒店到成田机场的接送服务',
    type: 'activity',
    date: '2024-05-05',
    time: '10:00',
    isCompleted: false,
    createdAt: '2024-04-22'
  }
];

export const mockReminderList: ReminderList = {
  id: '1',
  tripId: '1',
  reminders: mockReminders
};

export const mockDayReviews: DayReview[] = [
  {
    id: 'rev1',
    date: '2024-05-01',
    content: '今天抵达东京，一切顺利。成田机场比想象中更大，入关效率很高。乘坐N\'EX成田特快到新宿站，然后步行到酒店，沿途欣赏了新宿的繁华街景。下午去了新宿御苑，公园里樱花还在盛开，非常漂亮。晚上在新宿站附近的居酒屋吃了晚餐，体验了当地的居酒屋文化。',
    mood: '😊',
    weather: '☀️',
    createdAt: '2024-05-01',
    updatedAt: '2024-05-01'
  },
  {
    id: 'rev2',
    date: '2024-05-02',
    content: '今天天气很好，适合观光。上午去了明治神宫，在茂密的森林中漫步，感受到了东京的宁静一面。然后去了原宿，沿着竹下通逛街，看到了很多独特的时尚风格。中午在原宿吃了有名的拉面。下午去涩谷，在十字路口看人来人往，真的很震撼。晚上在涩谷的一家烧肉店吃了晚餐。',
    mood: '😄',
    weather: '☀️',
    createdAt: '2024-05-02',
    updatedAt: '2024-05-02'
  }
];

export const mockPhotoNotes: PhotoNote[] = [
  {
    id: 'photo1',
    date: '2024-05-01',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Tokyo%20Narita%20Airport%20terminal%20building%20with%20clear%20sky&image_size=square_hd',
    note: '成田机场T2航站楼，第一次来东京，心情有点激动。机场指示牌很清晰，不用担心迷路。',
    createdAt: '2024-05-01'
  },
  {
    id: 'photo2',
    date: '2024-05-01',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cherry%20blossom%20in%20Shinjuku%20Gyoen%20park%20Tokyo%20spring&image_size=square_hd',
    note: '新宿御苑的樱花，比想象中更美。公园里人不多，可以安静地欣赏樱花。',
    createdAt: '2024-05-01'
  },
  {
    id: 'photo3',
    date: '2024-05-02',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Meiji%20Shrine%20torii%20gate%20in%20Tokyo%20forest&image_size=square_hd',
    note: '明治神宫的大鸟居，非常壮观。走在森林里，完全感觉不到是在东京市中心。',
    createdAt: '2024-05-02'
  },
  {
    id: 'photo4',
    date: '2024-05-02',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Shibuya%20crossing%20Tokyo%20busy%20intersection%20crowd&image_size=square_hd',
    note: '涩谷十字路口，真的是世界最繁忙的路口之一。绿灯亮起时，四面八方的人同时过马路，场面很震撼。',
    createdAt: '2024-05-02'
  }
];

export const mockReviewList: ReviewList = {
  id: '1',
  tripId: '1',
  reviews: mockDayReviews,
  photoNotes: mockPhotoNotes
};
