import { useState } from 'react';
import './App.css';
import { TripPlan, DayPlan, Activity } from './types';
import { mockTripPlan } from './data';

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