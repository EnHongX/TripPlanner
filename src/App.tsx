import { useState } from 'react';
import './App.css';

// 直接在文件中定义类型
interface Activity {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  budget: number;
}

interface DayPlan {
  id: string;
  date: string;
  activities: Activity[];
}

interface TripPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  totalBudget: number;
}

// 直接在文件中定义假数据
const mockTripPlan: TripPlan = {
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

function App() {
  const [tripPlan, setTripPlan] = useState<TripPlan>(mockTripPlan);
  const [selectedDay, setSelectedDay] = useState<DayPlan>(tripPlan.days[0]);
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    budget: 0
  });

  // 检查时间冲突
  const checkTimeConflict = (startTime: string, endTime: string): boolean => {
    const newStart = new Date(`2000-01-01 ${startTime}`);
    const newEnd = new Date(`2000-01-01 ${endTime}`);

    return selectedDay.activities.some(activity => {
      const existingStart = new Date(`2000-01-01 ${activity.startTime}`);
      const existingEnd = new Date(`2000-01-01 ${activity.endTime}`);

      // 检查时间是否重叠
      return (newStart < existingEnd && newEnd > existingStart);
    });
  };

  // 添加活动
  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.startTime || !newActivity.endTime) {
      alert('请填写活动标题和时间');
      return;
    }

    // 检查时间冲突
    if (checkTimeConflict(newActivity.startTime, newActivity.endTime)) {
      alert('该时间段已存在活动，请调整时间');
      return;
    }

    const activity: Activity = {
      ...newActivity,
      id: `act${Date.now()}`
    };

    const updatedDays = tripPlan.days.map(day => {
      if (day.id === selectedDay.id) {
        return {
          ...day,
          activities: [...day.activities, activity]
        };
      }
      return day;
    });

    const updatedTripPlan = {
      ...tripPlan,
      days: updatedDays
    };

    setTripPlan(updatedTripPlan);
    setSelectedDay(updatedDays.find(day => day.id === selectedDay.id)!);
    setNewActivity({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      budget: 0
    });
    setShowAddActivityForm(false);
  };

  // 添加新的一天
  const handleAddDay = () => {
    const lastDay = tripPlan.days[tripPlan.days.length - 1];
    const lastDate = new Date(lastDay.date);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 1);
    const nextDateString = nextDate.toISOString().split('T')[0];

    const newDay: DayPlan = {
      id: `day${tripPlan.days.length + 1}`,
      date: nextDateString,
      activities: []
    };

    const updatedDays = [...tripPlan.days, newDay];
    const updatedTripPlan = {
      ...tripPlan,
      days: updatedDays
    };

    setTripPlan(updatedTripPlan);
    setSelectedDay(newDay);
  };

  // 计算总预算
  const calculateTotalBudget = (): number => {
    return tripPlan.days.reduce((total, day) => {
      return total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.budget, 0);
    }, 0);
  };

  // 计算当日预算
  const calculateDayBudget = (): number => {
    return selectedDay.activities.reduce((sum, activity) => sum + activity.budget, 0);
  };

  const totalBudget = calculateTotalBudget();
  const dayBudget = calculateDayBudget();

  return (
    <div className="app">
      {/* 顶部导航栏 */}
      <header className="header">
        <h1>{tripPlan.name}</h1>
        <div className="trip-dates">
          <span>{tripPlan.startDate}</span> - <span>{tripPlan.endDate}</span>
        </div>
      </header>

      <div className="main-content">
        {/* 左侧日期选择 */}
        <aside className="sidebar">
          <h2>行程日期</h2>
          <div className="day-list">
            {tripPlan.days.map((day) => (
              <div
                key={day.id}
                className={`day-item ${selectedDay.id === day.id ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                <span className="day-date">{day.date}</span>
                <span className="activity-count">{day.activities.length} 个活动</span>
                <span className="day-budget">¥{day.activities.reduce((sum, activity) => sum + activity.budget, 0)}</span>
              </div>
            ))}
          </div>
          <button className="add-day-btn" onClick={handleAddDay}>添加新的一天</button>
        </aside>

        {/* 右侧行程详情 */}
        <main className="content">
          <div className="day-header">
            <h2>第 {tripPlan.days.indexOf(selectedDay) + 1} 天</h2>
            <span className="day-date-full">{selectedDay.date}</span>
          </div>

          <div className="activities-list">
            <h3>当日活动</h3>
            {selectedDay.activities.length === 0 ? (
              <p className="no-activities">暂无活动，点击下方按钮添加</p>
            ) : (
              selectedDay.activities.map((activity) => (
                <div key={activity.id} className="activity-card">
                  <div className="activity-time">
                    <span>{activity.startTime}</span> - <span>{activity.endTime}</span>
                  </div>
                  <div className="activity-info">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <div className="activity-location">{activity.location}</div>
                  </div>
                  <div className="activity-budget">¥{activity.budget}</div>
                </div>
              ))
            )}
          </div>

          {showAddActivityForm ? (
            <div className="add-activity-form">
              <h3>添加活动</h3>
              <div className="form-group">
                <label>活动标题</label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>活动描述</label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>开始时间</label>
                  <input
                    type="time"
                    value={newActivity.startTime}
                    onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>结束时间</label>
                  <input
                    type="time"
                    value={newActivity.endTime}
                    onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>地点</label>
                <input
                  type="text"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>预算</label>
                <input
                  type="number"
                  value={newActivity.budget}
                  onChange={(e) => setNewActivity({ ...newActivity, budget: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-actions">
                <button className="cancel-btn" onClick={() => setShowAddActivityForm(false)}>取消</button>
                <button className="save-btn" onClick={handleAddActivity}>保存</button>
              </div>
            </div>
          ) : (
            <button className="add-activity-btn" onClick={() => setShowAddActivityForm(true)}>添加活动</button>
          )}
        </main>

        {/* 右侧预算汇总 */}
        <aside className="budget-sidebar">
          <h2>预算汇总</h2>
          <div className="budget-item">
            <span>总预算</span>
            <span className="budget-amount">¥{totalBudget}</span>
          </div>
          <div className="budget-item">
            <span>当日已使用</span>
            <span className="budget-amount">¥{dayBudget}</span>
          </div>
          <div className="budget-item">
            <span>总剩余</span>
            <span className="budget-amount">¥{tripPlan.totalBudget - totalBudget}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;