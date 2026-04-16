import { useState } from 'react';
import './App.css';
import { packingCategories, mockPackingList, mockTripPlan } from './data';
import type { PackingItem, PackingList, PackingCategory, TripPlan, DayPlan, Activity } from './types';

type PageType = 'itinerary' | 'packing';

const initialTripPlan: TripPlan = mockTripPlan;
const initialPackingList: PackingList = mockPackingList;

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('itinerary');
  const [tripPlan, setTripPlan] = useState<TripPlan>(initialTripPlan);
  const [selectedDay, setSelectedDay] = useState<DayPlan>(initialTripPlan.days[0]);
  const [packingList, setPackingList] = useState<PackingList>(initialPackingList);
  
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [showEditActivityForm, setShowEditActivityForm] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [showDeleteDayConfirm, setShowDeleteDayConfirm] = useState(false);
  const [showDeleteActivityConfirm, setShowDeleteActivityConfirm] = useState<string | null>(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editedTotalBudget, setEditedTotalBudget] = useState<string>(initialTripPlan.totalBudget.toString());
  
  const [showDeleteItemConfirm, setShowDeleteItemConfirm] = useState<string | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('documents');

  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    budget: 0
  });

  const [editingActivity, setEditingActivity] = useState<Activity>({
    id: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    budget: 0
  });

  const checkTimeConflict = (startTime: string, endTime: string, excludeActivityId?: string): boolean => {
    const newStart = new Date(`2000-01-01 ${startTime}`);
    const newEnd = new Date(`2000-01-01 ${endTime}`);

    return selectedDay.activities.some(activity => {
      if (excludeActivityId && activity.id === excludeActivityId) {
        return false;
      }
      const existingStart = new Date(`2000-01-01 ${activity.startTime}`);
      const existingEnd = new Date(`2000-01-01 ${activity.endTime}`);

      return (newStart < existingEnd && newEnd > existingStart);
    });
  };

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.startTime || !newActivity.endTime) {
      alert('请填写活动标题和时间');
      return;
    }

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

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity({ ...activity });
    setEditingActivityId(activity.id);
    setShowEditActivityForm(true);
  };

  const handleSaveEditActivity = () => {
    if (!editingActivity.title || !editingActivity.startTime || !editingActivity.endTime) {
      alert('请填写活动标题和时间');
      return;
    }

    if (checkTimeConflict(editingActivity.startTime, editingActivity.endTime, editingActivityId || undefined)) {
      alert('该时间段已存在活动，请调整时间');
      return;
    }

    const updatedDays = tripPlan.days.map(day => {
      if (day.id === selectedDay.id) {
        return {
          ...day,
          activities: day.activities.map(act => 
            act.id === editingActivityId ? editingActivity : act
          )
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
    setShowEditActivityForm(false);
    setEditingActivityId(null);
  };

  const handleDeleteActivity = (activityId: string) => {
    const updatedDays = tripPlan.days.map(day => {
      if (day.id === selectedDay.id) {
        return {
          ...day,
          activities: day.activities.filter(act => act.id !== activityId)
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
    setShowDeleteActivityConfirm(null);
  };

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

  const handleDeleteDay = () => {
    if (tripPlan.days.length <= 1) {
      alert('至少需要保留一天行程');
      return;
    }

    const updatedDays = tripPlan.days.filter(day => day.id !== selectedDay.id);
    const updatedTripPlan = {
      ...tripPlan,
      days: updatedDays
    };

    setTripPlan(updatedTripPlan);
    setSelectedDay(updatedDays[0]);
    setShowDeleteDayConfirm(false);
  };

  const sanitizeBudgetInput = (value: string): string => {
    const cleanedValue = value.replace(/[^0-9]/g, '');
    if (cleanedValue === '') return '';
    if (cleanedValue.length > 1 && cleanedValue.startsWith('0')) {
      return cleanedValue.replace(/^0+/, '') || '0';
    }
    return cleanedValue;
  };

  const handleBudgetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = sanitizeBudgetInput(value);
    setEditedTotalBudget(sanitizedValue);
  };

  const handleActivityBudgetInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<any>>,
    state: any
  ) => {
    const value = e.target.value;
    const sanitizedValue = sanitizeBudgetInput(value);
    const budgetValue = parseInt(sanitizedValue) || 0;
    setter({ ...state, budget: budgetValue });
  };

  const handleStartEditingBudget = () => {
    setEditedTotalBudget(tripPlan.totalBudget.toString());
    setIsEditingBudget(true);
  };

  const handleSaveBudget = () => {
    const budgetValue = parseInt(editedTotalBudget) || 0;
    if (budgetValue < 0) {
      alert('预算不能为负数');
      return;
    }
    const updatedTripPlan = {
      ...tripPlan,
      totalBudget: budgetValue
    };
    setTripPlan(updatedTripPlan);
    setIsEditingBudget(false);
  };

  const handleCancelBudgetEdit = () => {
    setEditedTotalBudget(tripPlan.totalBudget.toString());
    setIsEditingBudget(false);
  };

  const calculateTotalBudget = (): number => {
    return tripPlan.days.reduce((total, day) => {
      return total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.budget, 0);
    }, 0);
  };

  const calculateDayBudget = (): number => {
    return selectedDay.activities.reduce((sum, activity) => sum + activity.budget, 0);
  };

  const handleToggleItemPacked = (itemId: string) => {
    const updatedItems = packingList.items.map(item => 
      item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
    );
    setPackingList({ ...packingList, items: updatedItems });
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      alert('请输入物品名称');
      return;
    }

    const newItem: PackingItem = {
      id: `item${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      isPacked: false
    };

    setPackingList({
      ...packingList,
      items: [...packingList.items, newItem]
    });
    setNewItemName('');
    setShowAddItemForm(false);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = packingList.items.filter(item => item.id !== itemId);
    setPackingList({ ...packingList, items: updatedItems });
    setShowDeleteItemConfirm(null);
  };

  const getUnpackedCount = (): number => {
    return packingList.items.filter(item => !item.isPacked).length;
  };

  const getCategoryUnpackedCount = (categoryId: string): number => {
    return packingList.items.filter(item => item.category === categoryId && !item.isPacked).length;
  };

  const getTotalCount = (): number => {
    return packingList.items.length;
  };

  const totalBudget = calculateTotalBudget();
  const dayBudget = calculateDayBudget();

  const renderItineraryPage = () => (
    <div className="main-content">
      <aside className="sidebar">
        <h2>行程日期</h2>
        <div className="day-list">
          {tripPlan.days.map((day) => (
            <div
              key={day.id}
              className={`day-item ${selectedDay.id === day.id ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <div className="day-item-content">
                <span className="day-date">{day.date}</span>
                <span className="activity-count">{day.activities.length} 个活动</span>
                <span className="day-budget">¥{day.activities.reduce((sum, activity) => sum + activity.budget, 0)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="sidebar-actions">
          <button className="add-day-btn" onClick={handleAddDay}>添加新的一天</button>
          <button className="delete-day-btn" onClick={() => setShowDeleteDayConfirm(true)}>删除当天</button>
        </div>
      </aside>

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
                <div className="activity-actions">
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEditActivity(activity)}
                    title="编辑活动"
                  >
                    编辑
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => setShowDeleteActivityConfirm(activity.id)}
                    title="删除活动"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showEditActivityForm ? (
          <div className="edit-activity-form">
            <h3>编辑活动</h3>
            <div className="form-group">
              <label>活动标题</label>
              <input
                type="text"
                value={editingActivity.title}
                onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>活动描述</label>
              <textarea
                value={editingActivity.description}
                onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>开始时间</label>
                <input
                  type="time"
                  value={editingActivity.startTime}
                  onChange={(e) => setEditingActivity({ ...editingActivity, startTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>结束时间</label>
                <input
                  type="time"
                  value={editingActivity.endTime}
                  onChange={(e) => setEditingActivity({ ...editingActivity, endTime: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>地点</label>
              <input
                type="text"
                value={editingActivity.location}
                onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>预算</label>
              <input
                type="text"
                value={editingActivity.budget.toString()}
                onChange={(e) => handleActivityBudgetInputChange(e, setEditingActivity, editingActivity)}
              />
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => {
                setShowEditActivityForm(false);
                setEditingActivityId(null);
              }}>取消</button>
              <button className="save-btn" onClick={handleSaveEditActivity}>保存</button>
            </div>
          </div>
        ) : showAddActivityForm ? (
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
                type="text"
                value={newActivity.budget.toString()}
                onChange={(e) => handleActivityBudgetInputChange(e, setNewActivity, newActivity)}
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

      <aside className="budget-sidebar">
        <h2>预算汇总</h2>
        <div className="budget-item">
          <span>总预算</span>
          {isEditingBudget ? (
            <div className="budget-edit-container">
              <span>¥</span>
              <input
                type="text"
                value={editedTotalBudget}
                onChange={handleBudgetInputChange}
                className="budget-input"
                autoFocus
              />
            </div>
          ) : (
            <span className="budget-amount">¥{tripPlan.totalBudget}</span>
          )}
        </div>
        {isEditingBudget ? (
          <div className="budget-edit-actions">
            <button className="cancel-btn" onClick={handleCancelBudgetEdit}>取消</button>
            <button className="save-btn" onClick={handleSaveBudget}>保存</button>
          </div>
        ) : (
          <button className="edit-budget-btn" onClick={handleStartEditingBudget}>编辑总预算</button>
        )}
        <div className="budget-item">
          <span>当日已使用</span>
          <span className="budget-amount">¥{dayBudget}</span>
        </div>
        <div className="budget-item">
          <span>总剩余</span>
          <span className={`budget-amount ${tripPlan.totalBudget - totalBudget < 0 ? 'budget-over' : ''}`}>
            ¥{tripPlan.totalBudget - totalBudget}
          </span>
        </div>
      </aside>
    </div>
  );

  const renderPackingPage = () => (
    <div className="main-content">
      <aside className="sidebar">
        <h2>物品类别</h2>
        <div className="category-list">
          {packingCategories.map((category) => (
            <div
              key={category.id}
              className="category-item"
            >
              <div className="category-item-content">
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">
                  {getCategoryUnpackedCount(category.id)}/{packingList.items.filter(item => item.category === category.id).length}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="sidebar-actions">
          <button className="add-item-btn" onClick={() => setShowAddItemForm(true)}>添加物品</button>
        </div>
      </aside>

      <main className="content">
        <div className="packing-header">
          <h2>旅行物品清单</h2>
          <div className="packing-stats">
            <span className="packing-progress">
              未完成: <strong>{getUnpackedCount()}</strong> / {getTotalCount()}
            </span>
          </div>
        </div>

        <div className="packing-categories">
          {packingCategories.map((category) => {
            const categoryItems = packingList.items.filter(item => item.category === category.id);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category.id} className="packing-category">
                <div className="packing-category-header">
                  <h3>
                    <span className="category-icon">{category.icon}</span>
                    {category.name}
                  </h3>
                  <span className="category-progress">
                    {categoryItems.filter(item => item.isPacked).length}/{categoryItems.length}
                  </span>
                </div>
                <div className="packing-items">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={`packing-item ${item.isPacked ? 'packed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={item.isPacked}
                        onChange={() => handleToggleItemPacked(item.id)}
                        className="item-checkbox"
                      />
                      <span className="item-name">{item.name}</span>
                      <button
                        className="item-delete-btn"
                        onClick={() => setShowDeleteItemConfirm(item.id)}
                        title="删除物品"
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {packingList.items.length === 0 && (
          <div className="no-items">
            <p>暂无物品，点击下方按钮添加</p>
          </div>
        )}

        {!showAddItemForm && packingList.items.length > 0 && (
          <button className="add-item-main-btn" onClick={() => setShowAddItemForm(true)}>添加物品</button>
        )}

        {showAddItemForm && (
          <div className="add-item-form">
            <h3>添加物品</h3>
            <div className="form-group">
              <label>物品名称</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="输入物品名称"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>所属类别</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
              >
                {packingCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => {
                setShowAddItemForm(false);
                setNewItemName('');
              }}>取消</button>
              <button className="save-btn" onClick={handleAddItem}>保存</button>
            </div>
          </div>
        )}
      </main>

      <aside className="budget-sidebar">
        <h2>物品统计</h2>
        <div className="stat-item">
          <span>总物品数</span>
          <span className="stat-value">{getTotalCount()}</span>
        </div>
        <div className="stat-item">
          <span>已准备</span>
          <span className="stat-value packed">{getTotalCount() - getUnpackedCount()}</span>
        </div>
        <div className="stat-item">
          <span>未准备</span>
          <span className="stat-value unpacked">{getUnpackedCount()}</span>
        </div>
        <div className="stat-item progress-item">
          <span>准备进度</span>
          <div className="progress-bar-container">
            <div 
              className="progress-bar"
              style={{ width: `${getTotalCount() > 0 ? ((getTotalCount() - getUnpackedCount()) / getTotalCount()) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {getTotalCount() > 0 ? Math.round(((getTotalCount() - getUnpackedCount()) / getTotalCount()) * 100) : 0}%
          </span>
        </div>
      </aside>
    </div>
  );

  return (
    <div className="app">
      <header className="header">
        <h1>{tripPlan.name}</h1>
        <div className="header-nav">
          <button
            className={`nav-btn ${currentPage === 'itinerary' ? 'active' : ''}`}
            onClick={() => setCurrentPage('itinerary')}
          >
            行程安排
          </button>
          <button
            className={`nav-btn ${currentPage === 'packing' ? 'active' : ''}`}
            onClick={() => setCurrentPage('packing')}
          >
            物品清单
            {getUnpackedCount() > 0 && (
              <span className="unpacked-badge">{getUnpackedCount()}</span>
            )}
          </button>
        </div>
        <div className="trip-dates">
          <span>{tripPlan.startDate}</span> - <span>{tripPlan.endDate}</span>
        </div>
      </header>

      {currentPage === 'itinerary' ? renderItineraryPage() : renderPackingPage()}

      {showDeleteDayConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteDayConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除当天的所有行程吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteDayConfirm(false)}>取消</button>
              <button className="delete-btn" onClick={handleDeleteDay}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteActivityConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteActivityConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这个活动吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteActivityConfirm(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeleteActivity(showDeleteActivityConfirm!)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteItemConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteItemConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这个物品吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteItemConfirm(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeleteItem(showDeleteItemConfirm!)}>确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;