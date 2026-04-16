import { useState, useEffect } from 'react';
import './App.css';
import { mockPackingList, mockTripPlan, mockTravelInfo, mockReminderList, mockReviewList, packingCategories } from './data';
import { storage, initializeData } from './storage';
import type { PackingItem, PackingList, PackingCategory, TripPlan, DayPlan, Activity, PackingTemplate, TemplateCategory, TemplateItem, TravelInfo, Accommodation, Transportation, TravelType, Reminder, ReminderList, ReminderType, ReviewList, DayReview, PhotoNote, TripProject } from './types';

type PageType = 'projects' | 'itinerary' | 'packing' | 'templates' | 'travel' | 'reminders' | 'reviews';

function App() {
  const [projects, setProjects] = useState<TripProject[]>([]);
  const [templates, setTemplates] = useState<PackingTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('projects');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  const [tripPlan, setTripPlan] = useState<TripPlan>(mockTripPlan);
  const [selectedDay, setSelectedDay] = useState<DayPlan>(mockTripPlan.days[0]);
  const [packingList, setPackingList] = useState<PackingList>(mockPackingList);
  
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [showEditActivityForm, setShowEditActivityForm] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [showDeleteDayConfirm, setShowDeleteDayConfirm] = useState(false);
  const [showDeleteActivityConfirm, setShowDeleteActivityConfirm] = useState<string | null>(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editedTotalBudget, setEditedTotalBudget] = useState<string>('0');
  
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

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showEditTemplate, setShowEditTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PackingTemplate | null>(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddTemplateItemForm, setShowAddTemplateItemForm] = useState(false);
  const [showDeleteTemplateConfirm, setShowDeleteTemplateConfirm] = useState<string | null>(null);
  const [showDeleteCategoryConfirm, setShowDeleteCategoryConfirm] = useState<{ templateId: string; categoryId: string } | null>(null);
  const [showDeleteItemConfirmTemplate, setShowDeleteItemConfirmTemplate] = useState<{ templateId: string; itemId: string } | null>(null);
  const [showApplyTemplateConfirm, setShowApplyTemplateConfirm] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📁');
  const [newTemplateItemName, setNewTemplateItemName] = useState('');
  const [newTemplateItemCategoryId, setNewTemplateItemCategoryId] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ templateId: string; category: TemplateCategory } | null>(null);
  const [editingItem, setEditingItem] = useState<{ templateId: string; item: TemplateItem } | null>(null);

  const [travelInfo, setTravelInfo] = useState<TravelInfo>(mockTravelInfo);
  const [reminderList, setReminderList] = useState<ReminderList>(mockReminderList);
  
  const [showAddAccommodationForm, setShowAddAccommodationForm] = useState(false);
  const [showAddTransportationForm, setShowAddTransportationForm] = useState(false);
  const [showEditAccommodationForm, setShowEditAccommodationForm] = useState(false);
  const [showEditTransportationForm, setShowEditTransportationForm] = useState(false);
  const [showDeleteAccommodationConfirm, setShowDeleteAccommodationConfirm] = useState<string | null>(null);
  const [showDeleteTransportationConfirm, setShowDeleteTransportationConfirm] = useState<string | null>(null);

  const [newAccommodation, setNewAccommodation] = useState<Omit<Accommodation, 'id'>>({
    name: '',
    address: '',
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    price: 0,
    bookingNumber: '',
    notes: ''
  });

  const [newTransportation, setNewTransportation] = useState<Omit<Transportation, 'id'>>({
    type: 'flight',
    number: '',
    fromLocation: '',
    toLocation: '',
    departureTime: '',
    arrivalTime: '',
    price: 0,
    seatNumber: '',
    bookingNumber: '',
    notes: ''
  });

  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation>({
    id: '',
    name: '',
    address: '',
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    price: 0,
    bookingNumber: '',
    notes: ''
  });

  const [editingTransportation, setEditingTransportation] = useState<Transportation>({
    id: '',
    type: 'flight',
    number: '',
    fromLocation: '',
    toLocation: '',
    departureTime: '',
    arrivalTime: '',
    price: 0,
    seatNumber: '',
    bookingNumber: '',
    notes: ''
  });

  const [reminderFilterType, setReminderFilterType] = useState<ReminderType | 'all'>('all');
  const [reminderFilterStatus, setReminderFilterStatus] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [showAddReminderForm, setShowAddReminderForm] = useState(false);
  const [showDeleteReminderConfirm, setShowDeleteReminderConfirm] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState<Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>>({
    title: '',
    description: '',
    type: 'other',
    date: '',
    time: ''
  });

  const [reviewList, setReviewList] = useState<ReviewList>(mockReviewList);
  const [selectedReviewDate, setSelectedReviewDate] = useState<string>('');
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [showEditReviewForm, setShowEditReviewForm] = useState(false);
  const [showDeleteReviewConfirm, setShowDeleteReviewConfirm] = useState<string | null>(null);
  const [showAddPhotoForm, setShowAddPhotoForm] = useState(false);
  const [showEditPhotoForm, setShowEditPhotoForm] = useState(false);
  const [showDeletePhotoConfirm, setShowDeletePhotoConfirm] = useState<string | null>(null);
  
  const [newReview, setNewReview] = useState<Omit<DayReview, 'id' | 'createdAt' | 'updatedAt'>>({
    date: '',
    content: '',
    mood: '😊',
    weather: '☀️'
  });

  const [editingReview, setEditingReview] = useState<DayReview>({
    id: '',
    date: '',
    content: '',
    mood: '😊',
    weather: '☀️',
    createdAt: '',
    updatedAt: ''
  });

  const [newPhotoNote, setNewPhotoNote] = useState<Omit<PhotoNote, 'id' | 'createdAt'>>({
    date: '',
    imageUrl: '',
    note: ''
  });

  const [editingPhotoNote, setEditingPhotoNote] = useState<PhotoNote>({
    id: '',
    date: '',
    imageUrl: '',
    note: '',
    createdAt: ''
  });

  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showEditProjectForm, setShowEditProjectForm] = useState(false);
  const [showDeleteProjectConfirm, setShowDeleteProjectConfirm] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Omit<TripProject, 'id' | 'createdAt' | 'tripPlan' | 'packingList' | 'travelInfo' | 'reminderList' | 'reviewList'>>({
    name: '',
    startDate: '',
    endDate: '',
    totalBudget: 0
  });
  const [editingProject, setEditingProject] = useState<TripProject | null>(null);

  const moodOptions = [
    { value: '😊', label: '开心' },
    { value: '😄', label: '兴奋' },
    { value: '😌', label: '平静' },
    { value: '😴', label: '疲惫' },
    { value: '😢', label: '难过' },
    { value: '😤', label: '生气' }
  ];

  const weatherOptions = [
    { value: '☀️', label: '晴天' },
    { value: '⛅', label: '多云' },
    { value: '🌧️', label: '雨天' },
    { value: '❄️', label: '雪天' },
    { value: '🌤️', label: '晴转多云' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const { projects: loadedProjects, templates: loadedTemplates } = await initializeData();
        setProjects(loadedProjects);
        setTemplates(loadedTemplates);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      storage.saveProjects(projects).catch(error => {
        console.error('Failed to save projects:', error);
      });
    }
  }, [projects, isLoading]);

  useEffect(() => {
    if (!isLoading && templates.length > 0) {
      storage.saveTemplates(templates).catch(error => {
        console.error('Failed to save templates:', error);
      });
    }
  }, [templates, isLoading]);

  const handleSwitchProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setCurrentProjectId(projectId);
    setTripPlan(JSON.parse(JSON.stringify(project.tripPlan)));
    setPackingList(JSON.parse(JSON.stringify(project.packingList)));
    setTravelInfo(JSON.parse(JSON.stringify(project.travelInfo)));
    setReminderList(JSON.parse(JSON.stringify(project.reminderList)));
    setReviewList(JSON.parse(JSON.stringify(project.reviewList)));
    setSelectedDay(JSON.parse(JSON.stringify(project.tripPlan.days[0])));
    setSelectedReviewDate(project.tripPlan.days[0]?.date || '');
    setEditedTotalBudget(project.tripPlan.totalBudget.toString());
    setCurrentPage('itinerary');
  };

  const handleBackToProjects = () => {
    if (currentProjectId) {
      const updatedProjects = projects.map(p => {
        if (p.id === currentProjectId) {
          return {
            ...p,
            tripPlan: JSON.parse(JSON.stringify(tripPlan)),
            packingList: JSON.parse(JSON.stringify(packingList)),
            travelInfo: JSON.parse(JSON.stringify(travelInfo)),
            reminderList: JSON.parse(JSON.stringify(reminderList)),
            reviewList: JSON.parse(JSON.stringify(reviewList))
          };
        }
        return p;
      });
      setProjects(updatedProjects);
    }
    setCurrentProjectId(null);
    setCurrentPage('projects');
    setShowMoreMenu(false);
  };

  const handleAddProject = () => {
    if (!newProject.name.trim() || !newProject.startDate || !newProject.endDate) {
      alert('请填写项目名称、开始日期和结束日期');
      return;
    }

    const startDate = new Date(newProject.startDate);
    const endDate = new Date(newProject.endDate);
    const days: DayPlan[] = [];
    // eslint-disable-next-line prefer-const
    let currentDate = new Date(startDate);
    let dayIndex = 1;

    while (currentDate <= endDate) {
      days.push({
        id: `day${dayIndex}`,
        date: currentDate.toISOString().split('T')[0],
        activities: []
      });
      currentDate.setDate(currentDate.getDate() + 1);
      dayIndex++;
    }

    const newProjectId = `proj${Date.now()}`;
    const newProjectFull: TripProject = {
      id: newProjectId,
      name: newProject.name.trim(),
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      totalBudget: newProject.totalBudget,
      createdAt: new Date().toISOString().split('T')[0],
      tripPlan: {
        id: `tp${Date.now()}`,
        name: newProject.name.trim(),
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        totalBudget: newProject.totalBudget,
        days: days
      },
      packingList: {
        id: `pl${Date.now()}`,
        tripId: newProjectId,
        items: [],
        categories: JSON.parse(JSON.stringify(packingCategories))
      },
      travelInfo: {
        id: `ti${Date.now()}`,
        tripId: newProjectId,
        accommodations: [],
        transportations: []
      },
      reminderList: {
        id: `rl${Date.now()}`,
        tripId: newProjectId,
        reminders: []
      },
      reviewList: {
        id: `rev${Date.now()}`,
        tripId: newProjectId,
        reviews: [],
        photoNotes: []
      }
    };

    setProjects([...projects, newProjectFull]);
    setNewProject({
      name: '',
      startDate: '',
      endDate: '',
      totalBudget: 0
    });
    setShowAddProjectForm(false);
  };

  const handleEditProject = (project: TripProject) => {
    setEditingProject({ ...project });
    setShowEditProjectForm(true);
  };

  const handleSaveEditProject = () => {
    if (!editingProject || !editingProject.name.trim() || !editingProject.startDate || !editingProject.endDate) {
      alert('请填写项目名称、开始日期和结束日期');
      return;
    }

    const updatedProjects = projects.map(p => {
      if (p.id === editingProject.id) {
        return {
          ...editingProject,
          tripPlan: {
            ...p.tripPlan,
            name: editingProject.name.trim(),
            startDate: editingProject.startDate,
            endDate: editingProject.endDate,
            totalBudget: editingProject.totalBudget
          }
        };
      }
      return p;
    });

    setProjects(updatedProjects);

    if (currentProjectId === editingProject.id) {
      setTripPlan(prev => ({
        ...prev,
        name: editingProject.name.trim(),
        startDate: editingProject.startDate,
        endDate: editingProject.endDate,
        totalBudget: editingProject.totalBudget
      }));
    }

    setShowEditProjectForm(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    setShowDeleteProjectConfirm(null);

    if (currentProjectId === projectId) {
      setCurrentProjectId(null);
      setCurrentPage('projects');
    }
  };

  const calculateProjectDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

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

  const handleActivityBudgetInputChange = <T extends { budget: number }>(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<T>>,
    state: T
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

  const getTemplateById = (templateId: string): PackingTemplate | undefined => {
    return templates.find(t => t.id === templateId);
  };

  const handleEditTemplate = (template: PackingTemplate) => {
    setEditingTemplate({ ...template });
    setShowEditTemplate(true);
  };

  const handleSaveEditTemplate = () => {
    if (!editingTemplate || !editingTemplate.name.trim()) {
      alert('请输入模板名称');
      return;
    }

    const updatedTemplates = templates.map(t =>
      t.id === editingTemplate.id ? editingTemplate : t
    );
    setTemplates(updatedTemplates);
    setShowEditTemplate(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    setShowDeleteTemplateConfirm(null);
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(null);
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim() || !editingTemplate) {
      alert('请输入类别名称');
      return;
    }

    const newCategory: TemplateCategory = {
      id: `cat${Date.now()}`,
      name: newCategoryName.trim(),
      icon: newCategoryIcon
    };

    const updatedTemplate = {
      ...editingTemplate,
      categories: [...editingTemplate.categories, newCategory]
    };

    setEditingTemplate(updatedTemplate);
    setNewCategoryName('');
    setNewCategoryIcon('📁');
    setShowAddCategoryForm(false);
  };

  const handleEditCategory = (templateId: string, category: TemplateCategory) => {
    setEditingCategory({ templateId, category: { ...category } });
  };

  const handleSaveEditCategory = () => {
    if (!editingCategory || !editingCategory.category.name.trim()) {
      alert('请输入类别名称');
      return;
    }

    const updatedTemplates = templates.map(template => {
      if (template.id === editingCategory.templateId) {
        return {
          ...template,
          categories: template.categories.map(cat =>
            cat.id === editingCategory.category.id ? editingCategory.category : cat
          )
        };
      }
      return template;
    });

    setTemplates(updatedTemplates);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (templateId: string, categoryId: string) => {
    const updatedTemplates = templates.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          categories: template.categories.filter(cat => cat.id !== categoryId),
          items: template.items.filter(item => item.categoryId !== categoryId)
        };
      }
      return template;
    });

    setTemplates(updatedTemplates);
    setShowDeleteCategoryConfirm(null);
  };

  const handleAddTemplateItem = (templateId: string) => {
    if (!newTemplateItemName.trim() || !newTemplateItemCategoryId) {
      alert('请输入物品名称并选择类别');
      return;
    }

    const newItem: TemplateItem = {
      id: `item${Date.now()}`,
      name: newTemplateItemName.trim(),
      categoryId: newTemplateItemCategoryId
    };

    const updatedTemplates = templates.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          items: [...template.items, newItem]
        };
      }
      return template;
    });

    setTemplates(updatedTemplates);
    setNewTemplateItemName('');
    setNewTemplateItemCategoryId('');
    setShowAddTemplateItemForm(false);
  };

  const handleEditItem = (templateId: string, item: TemplateItem) => {
    setEditingItem({ templateId, item: { ...item } });
  };

  const handleSaveEditItem = () => {
    if (!editingItem || !editingItem.item.name.trim()) {
      alert('请输入物品名称');
      return;
    }

    const updatedTemplates = templates.map(template => {
      if (template.id === editingItem.templateId) {
        return {
          ...template,
          items: template.items.map(item =>
            item.id === editingItem.item.id ? editingItem.item : item
          )
        };
      }
      return template;
    });

    setTemplates(updatedTemplates);
    setEditingItem(null);
  };

  const handleDeleteItemTemplate = (templateId: string, itemId: string) => {
    const updatedTemplates = templates.map(template => {
      if (template.id === templateId) {
        return {
          ...template,
          items: template.items.filter(item => item.id !== itemId)
        };
      }
      return template;
    });

    setTemplates(updatedTemplates);
    setShowDeleteItemConfirmTemplate(null);
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (!template) return;

    const newCategories: PackingCategory[] = template.categories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon
    }));

    const newItems: PackingItem[] = template.items.map(item => ({
      id: `item${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: item.name,
      category: item.categoryId,
      isPacked: false
    }));

    setPackingList({
      ...packingList,
      categories: newCategories,
      items: newItems
    });

    setShowApplyTemplateConfirm(null);
    alert(`模板 "${template.name}" 已应用到当前物品清单！`);
  };

  const handleAddAccommodation = () => {
    if (!newAccommodation.name.trim() || !newAccommodation.checkInDate || !newAccommodation.checkOutDate) {
      alert('请填写酒店名称、入住和退房日期');
      return;
    }

    const accommodation: Accommodation = {
      ...newAccommodation,
      id: `acc${Date.now()}`
    };

    setTravelInfo({
      ...travelInfo,
      accommodations: [...travelInfo.accommodations, accommodation]
    });

    setNewAccommodation({
      name: '',
      address: '',
      checkInDate: '',
      checkOutDate: '',
      roomType: '',
      price: 0,
      bookingNumber: '',
      notes: ''
    });
    setShowAddAccommodationForm(false);
  };

  const handleEditAccommodation = (accommodation: Accommodation) => {
    setEditingAccommodation({ ...accommodation });
    setShowEditAccommodationForm(true);
  };

  const handleSaveEditAccommodation = () => {
    if (!editingAccommodation.name.trim() || !editingAccommodation.checkInDate || !editingAccommodation.checkOutDate) {
      alert('请填写酒店名称、入住和退房日期');
      return;
    }

    const updatedAccommodations = travelInfo.accommodations.map(acc =>
      acc.id === editingAccommodation.id ? editingAccommodation : acc
    );

    setTravelInfo({
      ...travelInfo,
      accommodations: updatedAccommodations
    });
    setShowEditAccommodationForm(false);
  };

  const handleDeleteAccommodation = (id: string) => {
    setTravelInfo({
      ...travelInfo,
      accommodations: travelInfo.accommodations.filter(acc => acc.id !== id)
    });
    setShowDeleteAccommodationConfirm(null);
  };

  const handleAddTransportation = () => {
    if (!newTransportation.number.trim() || !newTransportation.departureTime) {
      alert('请填写班次号和出发时间');
      return;
    }

    const transportation: Transportation = {
      ...newTransportation,
      id: `trans${Date.now()}`
    };

    setTravelInfo({
      ...travelInfo,
      transportations: [...travelInfo.transportations, transportation]
    });

    setNewTransportation({
      type: 'flight',
      number: '',
      fromLocation: '',
      toLocation: '',
      departureTime: '',
      arrivalTime: '',
      price: 0,
      seatNumber: '',
      bookingNumber: '',
      notes: ''
    });
    setShowAddTransportationForm(false);
  };

  const handleEditTransportation = (transportation: Transportation) => {
    setEditingTransportation({ ...transportation });
    setShowEditTransportationForm(true);
  };

  const handleSaveEditTransportation = () => {
    if (!editingTransportation.number.trim() || !editingTransportation.departureTime) {
      alert('请填写班次号和出发时间');
      return;
    }

    const updatedTransportations = travelInfo.transportations.map(trans =>
      trans.id === editingTransportation.id ? editingTransportation : trans
    );

    setTravelInfo({
      ...travelInfo,
      transportations: updatedTransportations
    });
    setShowEditTransportationForm(false);
  };

  const handleDeleteTransportation = (id: string) => {
    setTravelInfo({
      ...travelInfo,
      transportations: travelInfo.transportations.filter(trans => trans.id !== id)
    });
    setShowDeleteTransportationConfirm(null);
  };

  const getReminderTypeIcon = (type: ReminderType): string => {
    switch (type) {
      case 'document': return '📄';
      case 'booking': return '📅';
      case 'packing': return '🎒';
      case 'activity': return '📍';
      case 'other': return '📝';
      default: return '📝';
    }
  };

  const getReminderTypeName = (type: ReminderType): string => {
    switch (type) {
      case 'document': return '证件文件';
      case 'booking': return '预订确认';
      case 'packing': return '打包准备';
      case 'activity': return '活动安排';
      case 'other': return '其他';
      default: return '其他';
    }
  };

  const handleToggleReminderCompleted = (reminderId: string) => {
    const updatedReminders = reminderList.reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, isCompleted: !reminder.isCompleted } : reminder
    );
    setReminderList({ ...reminderList, reminders: updatedReminders });
  };

  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.date) {
      alert('请填写提醒标题和日期');
      return;
    }

    const reminder: Reminder = {
      ...newReminder,
      id: `rem${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isCompleted: false
    };

    setReminderList({
      ...reminderList,
      reminders: [...reminderList.reminders, reminder]
    });

    setNewReminder({
      title: '',
      description: '',
      type: 'other',
      date: '',
      time: ''
    });
    setShowAddReminderForm(false);
  };

  const handleDeleteReminder = (reminderId: string) => {
    const updatedReminders = reminderList.reminders.filter(reminder => reminder.id !== reminderId);
    setReminderList({ ...reminderList, reminders: updatedReminders });
    setShowDeleteReminderConfirm(null);
  };

  const getFilteredReminders = (): Reminder[] => {
    let filtered = [...reminderList.reminders];

    if (reminderFilterType !== 'all') {
      filtered = filtered.filter(reminder => reminder.type === reminderFilterType);
    }

    if (reminderFilterStatus === 'completed') {
      filtered = filtered.filter(reminder => reminder.isCompleted);
    } else if (reminderFilterStatus === 'incomplete') {
      filtered = filtered.filter(reminder => !reminder.isCompleted);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00'}`);
      const dateB = new Date(`${b.date} ${b.time || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const getCompletedRemindersCount = (): number => {
    return reminderList.reminders.filter(reminder => reminder.isCompleted).length;
  };

  const getIncompleteRemindersCount = (): number => {
    return reminderList.reminders.filter(reminder => !reminder.isCompleted).length;
  };

  const getReviewByDate = (date: string): DayReview | undefined => {
    return reviewList.reviews.find(review => review.date === date);
  };

  const getPhotosByDate = (date: string): PhotoNote[] => {
    return reviewList.photoNotes.filter(photo => photo.date === date);
  };

  const getReviewsCount = (): number => {
    return reviewList.reviews.length;
  };

  const getPhotosCount = (): number => {
    return reviewList.photoNotes.length;
  };

  const handleAddReview = () => {
    if (!newReview.content.trim()) {
      alert('请填写回顾内容');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const review: DayReview = {
      ...newReview,
      id: `rev${Date.now()}`,
      createdAt: today,
      updatedAt: today
    };

    const updatedReviews = [...reviewList.reviews, review];
    setReviewList({ ...reviewList, reviews: updatedReviews });
    setNewReview({
      date: '',
      content: '',
      mood: '😊',
      weather: '☀️'
    });
    setShowAddReviewForm(false);
  };

  const handleEditReview = (review: DayReview) => {
    setEditingReview({ ...review });
    setShowEditReviewForm(true);
  };

  const handleSaveEditReview = () => {
    if (!editingReview.content.trim()) {
      alert('请填写回顾内容');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const updatedReviews = reviewList.reviews.map(review =>
      review.id === editingReview.id
        ? { ...editingReview, updatedAt: today }
        : review
    );
    setReviewList({ ...reviewList, reviews: updatedReviews });
    setShowEditReviewForm(false);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updatedReviews = reviewList.reviews.filter(review => review.id !== reviewId);
    setReviewList({ ...reviewList, reviews: updatedReviews });
    setShowDeleteReviewConfirm(null);
  };

  const handleAddPhotoNote = () => {
    if (!newPhotoNote.note.trim()) {
      alert('请填写照片备注');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const photoNote: PhotoNote = {
      ...newPhotoNote,
      id: `photo${Date.now()}`,
      createdAt: today
    };

    const updatedPhotoNotes = [...reviewList.photoNotes, photoNote];
    setReviewList({ ...reviewList, photoNotes: updatedPhotoNotes });
    setNewPhotoNote({
      date: '',
      imageUrl: '',
      note: ''
    });
    setShowAddPhotoForm(false);
  };

  const handleEditPhotoNote = (photo: PhotoNote) => {
    setEditingPhotoNote({ ...photo });
    setShowEditPhotoForm(true);
  };

  const handleSaveEditPhotoNote = () => {
    if (!editingPhotoNote.note.trim()) {
      alert('请填写照片备注');
      return;
    }

    const updatedPhotoNotes = reviewList.photoNotes.map(photo =>
      photo.id === editingPhotoNote.id ? editingPhotoNote : photo
    );
    setReviewList({ ...reviewList, photoNotes: updatedPhotoNotes });
    setShowEditPhotoForm(false);
  };

  const handleDeletePhotoNote = (photoId: string) => {
    const updatedPhotoNotes = reviewList.photoNotes.filter(photo => photo.id !== photoId);
    setReviewList({ ...reviewList, photoNotes: updatedPhotoNotes });
    setShowDeletePhotoConfirm(null);
  };

  const getTravelTypeIcon = (type: TravelType): string => {
    switch (type) {
      case 'flight': return '✈️';
      case 'train': return '🚄';
      case 'bus': return '🚌';
      case 'taxi': return '🚕';
      default: return '🚗';
    }
  };

  const getTravelTypeName = (type: TravelType): string => {
    switch (type) {
      case 'flight': return '航班';
      case 'train': return '火车';
      case 'bus': return '大巴';
      case 'taxi': return '出租车';
      default: return '其他';
    }
  };

  const calculateTotalAccommodationBudget = (): number => {
    return travelInfo.accommodations.reduce((sum, acc) => sum + acc.price, 0);
  };

  const calculateTotalTransportationBudget = (): number => {
    return travelInfo.transportations.reduce((sum, trans) => sum + trans.price, 0);
  };

  const totalBudget = calculateTotalBudget();
  const dayBudget = calculateDayBudget();

  const renderTravelPage = () => (
    <div className="main-content">
      <aside className="sidebar">
        <h2>信息分类</h2>
        <div className="category-list">
          <div className="category-item">
            <div className="category-item-content">
              <span className="category-icon">🏨</span>
              <span className="category-name">住宿信息</span>
              <span className="category-count">{travelInfo.accommodations.length}</span>
            </div>
          </div>
          <div className="category-item">
            <div className="category-item-content">
              <span className="category-icon">✈️</span>
              <span className="category-name">交通信息</span>
              <span className="category-count">{travelInfo.transportations.length}</span>
            </div>
          </div>
        </div>
        <div className="sidebar-actions">
          <button className="add-item-btn" onClick={() => setShowAddAccommodationForm(true)}>添加住宿</button>
          <button className="add-item-btn" onClick={() => setShowAddTransportationForm(true)}>添加交通</button>
        </div>
      </aside>

      <main className="content">
        <div className="travel-header">
          <h2>住宿与交通信息</h2>
        </div>

        <div className="travel-section">
          <div className="section-header">
            <h3>
              <span className="category-icon">🏨</span>
              住宿信息
            </h3>
            {!showAddAccommodationForm && !showEditAccommodationForm && (
              <button 
                className="add-btn-small" 
                onClick={() => setShowAddAccommodationForm(true)}
              >
                + 添加住宿
              </button>
            )}
          </div>

          {travelInfo.accommodations.length === 0 ? (
            <p className="no-items">暂无住宿信息，点击上方按钮添加</p>
          ) : (
            <div className="accommodation-list">
              {travelInfo.accommodations.map((accommodation) => (
                <div key={accommodation.id} className="accommodation-card">
                  <div className="accommodation-header">
                    <h4>{accommodation.name}</h4>
                    <div className="accommodation-price">¥{accommodation.price}</div>
                  </div>
                  <div className="accommodation-address">
                    <span>📍 {accommodation.address}</span>
                  </div>
                  <div className="accommodation-dates">
                    <span className="date-label">入住:</span>
                    <span className="date-value">{accommodation.checkInDate}</span>
                    <span className="date-separator">→</span>
                    <span className="date-label">退房:</span>
                    <span className="date-value">{accommodation.checkOutDate}</span>
                  </div>
                  {accommodation.roomType && (
                    <div className="accommodation-room">
                      <span>🛏️ 房型: {accommodation.roomType}</span>
                    </div>
                  )}
                  {accommodation.bookingNumber && (
                    <div className="accommodation-booking">
                      <span>📋 预订号: {accommodation.bookingNumber}</span>
                    </div>
                  )}
                  {accommodation.notes && (
                    <div className="accommodation-notes">
                      <span>📝 {accommodation.notes}</span>
                    </div>
                  )}
                  <div className="accommodation-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEditAccommodation(accommodation)}
                    >
                      编辑
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => setShowDeleteAccommodationConfirm(accommodation.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="travel-section">
          <div className="section-header">
            <h3>
              <span className="category-icon">✈️</span>
              交通信息
            </h3>
            {!showAddTransportationForm && !showEditTransportationForm && (
              <button 
                className="add-btn-small" 
                onClick={() => setShowAddTransportationForm(true)}
              >
                + 添加交通
              </button>
            )}
          </div>

          {travelInfo.transportations.length === 0 ? (
            <p className="no-items">暂无交通信息，点击上方按钮添加</p>
          ) : (
            <div className="transportation-list">
              {travelInfo.transportations.map((transportation) => (
                <div key={transportation.id} className="transportation-card">
                  <div className="transportation-header">
                    <div className="transportation-type">
                      <span className="category-icon">{getTravelTypeIcon(transportation.type)}</span>
                      <span className="type-name">{getTravelTypeName(transportation.type)}</span>
                    </div>
                    <div className="transportation-number">{transportation.number}</div>
                    <div className="transportation-price">¥{transportation.price}</div>
                  </div>
                  <div className="transportation-route">
                    <div className="route-from">
                      <div className="location">{transportation.fromLocation}</div>
                      <div className="time">{transportation.departureTime}</div>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="route-to">
                      <div className="location">{transportation.toLocation}</div>
                      <div className="time">{transportation.arrivalTime}</div>
                    </div>
                  </div>
                  {transportation.seatNumber && (
                    <div className="transportation-seat">
                      <span>💺 座位: {transportation.seatNumber}</span>
                    </div>
                  )}
                  {transportation.bookingNumber && (
                    <div className="transportation-booking">
                      <span>📋 预订号: {transportation.bookingNumber}</span>
                    </div>
                  )}
                  {transportation.notes && (
                    <div className="transportation-notes">
                      <span>📝 {transportation.notes}</span>
                    </div>
                  )}
                  <div className="transportation-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEditTransportation(transportation)}
                    >
                      编辑
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => setShowDeleteTransportationConfirm(transportation.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showAddAccommodationForm && (
          <div className="add-form-container">
            <div className="add-activity-form">
              <h3>添加住宿信息</h3>
              <div className="form-group">
                <label>酒店名称 *</label>
                <input
                  type="text"
                  value={newAccommodation.name}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, name: e.target.value })}
                  placeholder="请输入酒店名称"
                />
              </div>
              <div className="form-group">
                <label>地址</label>
                <input
                  type="text"
                  value={newAccommodation.address}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, address: e.target.value })}
                  placeholder="请输入酒店地址"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>入住日期 *</label>
                  <input
                    type="date"
                    value={newAccommodation.checkInDate}
                    onChange={(e) => setNewAccommodation({ ...newAccommodation, checkInDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>退房日期 *</label>
                  <input
                    type="date"
                    value={newAccommodation.checkOutDate}
                    onChange={(e) => setNewAccommodation({ ...newAccommodation, checkOutDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>房型</label>
                  <input
                    type="text"
                    value={newAccommodation.roomType}
                    onChange={(e) => setNewAccommodation({ ...newAccommodation, roomType: e.target.value })}
                    placeholder="如：标准双人间"
                  />
                </div>
                <div className="form-group">
                  <label>价格</label>
                  <input
                    type="text"
                    value={newAccommodation.price.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setNewAccommodation({ ...newAccommodation, price: value });
                    }}
                    placeholder="请输入价格"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>预订号</label>
                <input
                  type="text"
                  value={newAccommodation.bookingNumber}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, bookingNumber: e.target.value })}
                  placeholder="请输入预订号"
                />
              </div>
              <div className="form-group">
                <label>备注</label>
                <textarea
                  value={newAccommodation.notes}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, notes: e.target.value })}
                  placeholder="输入备注信息"
                />
              </div>
              <div className="form-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => {
                    setShowAddAccommodationForm(false);
                    setNewAccommodation({
                      name: '',
                      address: '',
                      checkInDate: '',
                      checkOutDate: '',
                      roomType: '',
                      price: 0,
                      bookingNumber: '',
                      notes: ''
                    });
                  }}
                >
                  取消
                </button>
                <button className="save-btn" onClick={handleAddAccommodation}>保存</button>
              </div>
            </div>
          </div>
        )}

        {showEditAccommodationForm && (
          <div className="add-form-container">
            <div className="edit-activity-form">
              <h3>编辑住宿信息</h3>
              <div className="form-group">
                <label>酒店名称 *</label>
                <input
                  type="text"
                  value={editingAccommodation.name}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>地址</label>
                <input
                  type="text"
                  value={editingAccommodation.address}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, address: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>入住日期 *</label>
                  <input
                    type="date"
                    value={editingAccommodation.checkInDate}
                    onChange={(e) => setEditingAccommodation({ ...editingAccommodation, checkInDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>退房日期 *</label>
                  <input
                    type="date"
                    value={editingAccommodation.checkOutDate}
                    onChange={(e) => setEditingAccommodation({ ...editingAccommodation, checkOutDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>房型</label>
                  <input
                    type="text"
                    value={editingAccommodation.roomType}
                    onChange={(e) => setEditingAccommodation({ ...editingAccommodation, roomType: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>价格</label>
                  <input
                    type="text"
                    value={editingAccommodation.price.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setEditingAccommodation({ ...editingAccommodation, price: value });
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>预订号</label>
                <input
                  type="text"
                  value={editingAccommodation.bookingNumber}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, bookingNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>备注</label>
                <textarea
                  value={editingAccommodation.notes}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, notes: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowEditAccommodationForm(false)}
                >
                  取消
                </button>
                <button className="save-btn" onClick={handleSaveEditAccommodation}>保存</button>
              </div>
            </div>
          </div>
        )}

        {showAddTransportationForm && (
          <div className="add-form-container">
            <div className="add-activity-form">
              <h3>添加交通信息</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>交通类型</label>
                  <select
                    value={newTransportation.type}
                    onChange={(e) => setNewTransportation({ ...newTransportation, type: e.target.value as TravelType })}
                  >
                    <option value="flight">✈️ 航班</option>
                    <option value="train">🚄 火车</option>
                    <option value="bus">🚌 大巴</option>
                    <option value="taxi">🚕 出租车</option>
                    <option value="other">🚗 其他</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>班次号 *</label>
                  <input
                    type="text"
                    value={newTransportation.number}
                    onChange={(e) => setNewTransportation({ ...newTransportation, number: e.target.value })}
                    placeholder="如：MU271"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>出发地</label>
                  <input
                    type="text"
                    value={newTransportation.fromLocation}
                    onChange={(e) => setNewTransportation({ ...newTransportation, fromLocation: e.target.value })}
                    placeholder="如：上海浦东机场"
                  />
                </div>
                <div className="form-group">
                  <label>目的地</label>
                  <input
                    type="text"
                    value={newTransportation.toLocation}
                    onChange={(e) => setNewTransportation({ ...newTransportation, toLocation: e.target.value })}
                    placeholder="如：东京成田机场"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>出发时间 *</label>
                  <input
                    type="datetime-local"
                    value={newTransportation.departureTime}
                    onChange={(e) => setNewTransportation({ ...newTransportation, departureTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>到达时间</label>
                  <input
                    type="datetime-local"
                    value={newTransportation.arrivalTime}
                    onChange={(e) => setNewTransportation({ ...newTransportation, arrivalTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>座位号</label>
                  <input
                    type="text"
                    value={newTransportation.seatNumber}
                    onChange={(e) => setNewTransportation({ ...newTransportation, seatNumber: e.target.value })}
                    placeholder="如：12A"
                  />
                </div>
                <div className="form-group">
                  <label>价格</label>
                  <input
                    type="text"
                    value={newTransportation.price.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setNewTransportation({ ...newTransportation, price: value });
                    }}
                    placeholder="请输入价格"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>预订号</label>
                <input
                  type="text"
                  value={newTransportation.bookingNumber}
                  onChange={(e) => setNewTransportation({ ...newTransportation, bookingNumber: e.target.value })}
                  placeholder="请输入预订号"
                />
              </div>
              <div className="form-group">
                <label>备注</label>
                <textarea
                  value={newTransportation.notes}
                  onChange={(e) => setNewTransportation({ ...newTransportation, notes: e.target.value })}
                  placeholder="输入备注信息"
                />
              </div>
              <div className="form-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => {
                    setShowAddTransportationForm(false);
                    setNewTransportation({
                      type: 'flight',
                      number: '',
                      fromLocation: '',
                      toLocation: '',
                      departureTime: '',
                      arrivalTime: '',
                      price: 0,
                      seatNumber: '',
                      bookingNumber: '',
                      notes: ''
                    });
                  }}
                >
                  取消
                </button>
                <button className="save-btn" onClick={handleAddTransportation}>保存</button>
              </div>
            </div>
          </div>
        )}

        {showEditTransportationForm && (
          <div className="add-form-container">
            <div className="edit-activity-form">
              <h3>编辑交通信息</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>交通类型</label>
                  <select
                    value={editingTransportation.type}
                    onChange={(e) => setEditingTransportation({ ...editingTransportation, type: e.target.value as TravelType })}
                  >
                    <option value="flight">✈️ 航班</option>
                    <option value="train">🚄 火车</option>
                    <option value="bus">🚌 大巴</option>
                    <option value="taxi">🚕 出租车</option>
                    <option value="other">🚗 其他</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>班次号 *</label>
                  <input
                    type="text"
                    value={editingTransportation.number}
                    onChange={(e) => setEditingTransportation({ ...editingTransportation, number: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>出发地</label>
                  <input
                    type="text"
                    value={editingTransportation.fromLocation}
                    onChange={(e) => setEditingTransportation({ ...editingTransportation, fromLocation: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>目的地</label>
                  <input
                    type="text"
                    value={editingTransportation.toLocation}
                    onChange={(e) => setEditingTransportation({ ...editingTransportation, toLocation: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>出发时间 *</label>
                  <input
                    type="datetime-local"
                    value={editingTransportation.departureTime}
                    onChange={(e) => setEditingTransportation({ ...editingTransportation, departureTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>到达时间</label>
                  <input
                    type="datetime-local"
                    value={editingTransportation.arrivalTime}
                    onChange={(e) => setEditingTransportation({ ...editingTransportation, arrivalTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>座位号</label>
                  <input
                    type="text"
                    value={editingTransportation.seatNumber}
                    onChange={(e) => setEditingTransportation({ ...editingTransportation, seatNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>价格</label>
                  <input
                    type="text"
                    value={editingTransportation.price.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setEditingTransportation({ ...editingTransportation, price: value });
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>预订号</label>
                <input
                  type="text"
                  value={editingTransportation.bookingNumber}
                  onChange={(e) => setEditingTransportation({ ...editingTransportation, bookingNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>备注</label>
                <textarea
                  value={editingTransportation.notes}
                  onChange={(e) => setEditingTransportation({ ...editingTransportation, notes: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowEditTransportationForm(false)}
                >
                  取消
                </button>
                <button className="save-btn" onClick={handleSaveEditTransportation}>保存</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <aside className="budget-sidebar">
        <h2>信息统计</h2>
        <div className="stat-item">
          <span>🏨 住宿数量</span>
          <span className="stat-value">{travelInfo.accommodations.length}</span>
        </div>
        <div className="stat-item">
          <span>✈️ 交通数量</span>
          <span className="stat-value">{travelInfo.transportations.length}</span>
        </div>
        <div className="stat-item">
          <span>住宿总费用</span>
          <span className="stat-value">¥{calculateTotalAccommodationBudget()}</span>
        </div>
        <div className="stat-item">
          <span>交通总费用</span>
          <span className="stat-value">¥{calculateTotalTransportationBudget()}</span>
        </div>
        <div className="stat-item">
          <span><strong>住宿+交通合计</strong></span>
          <span className="stat-value">
            ¥{calculateTotalAccommodationBudget() + calculateTotalTransportationBudget()}
          </span>
        </div>
      </aside>
    </div>
  );

  const renderRemindersPage = () => {
    const filteredReminders = getFilteredReminders();
    const reminderTypes: (ReminderType | 'all')[] = ['all', 'document', 'booking', 'packing', 'activity', 'other'];
    const statusFilters: ('all' | 'completed' | 'incomplete')[] = ['all', 'completed', 'incomplete'];

    return (
      <div className="main-content">
        <aside className="sidebar">
          <h2>筛选条件</h2>
          
          <div className="filter-section">
            <h3 className="filter-title">按类型筛选</h3>
            <div className="filter-list">
              {reminderTypes.map((type) => (
                <div
                  key={type}
                  className={`filter-item ${reminderFilterType === type ? 'active' : ''}`}
                  onClick={() => setReminderFilterType(type)}
                >
                  <div className="filter-item-content">
                    <span className="filter-icon">
                      {type === 'all' ? '📋' : getReminderTypeIcon(type)}
                    </span>
                    <span className="filter-name">
                      {type === 'all' ? '全部类型' : getReminderTypeName(type)}
                    </span>
                    <span className="filter-count">
                      {type === 'all' 
                        ? reminderList.reminders.length 
                        : reminderList.reminders.filter(r => r.type === type).length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">按状态筛选</h3>
            <div className="filter-list">
              {statusFilters.map((status) => (
                <div
                  key={status}
                  className={`filter-item ${reminderFilterStatus === status ? 'active' : ''}`}
                  onClick={() => setReminderFilterStatus(status)}
                >
                  <div className="filter-item-content">
                    <span className="filter-icon">
                      {status === 'all' ? '📋' : status === 'completed' ? '✅' : '⏳'}
                    </span>
                    <span className="filter-name">
                      {status === 'all' ? '全部状态' : status === 'completed' ? '已完成' : '未完成'}
                    </span>
                    <span className="filter-count">
                      {status === 'all' 
                        ? reminderList.reminders.length 
                        : status === 'completed' 
                          ? getCompletedRemindersCount() 
                          : getIncompleteRemindersCount()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-actions">
            <button className="add-item-btn" onClick={() => setShowAddReminderForm(true)}>添加提醒</button>
          </div>
        </aside>

        <main className="content">
          <div className="reminders-header">
            <h2>旅行提醒与待办</h2>
            <div className="reminders-stats">
              <span className="reminders-progress">
                已完成: <strong className="completed">{getCompletedRemindersCount()}</strong> / {reminderList.reminders.length}
              </span>
            </div>
          </div>

          {filteredReminders.length === 0 ? (
            <div className="no-items">
              <p>暂无符合条件的提醒事项</p>
            </div>
          ) : (
            <div className="reminders-list">
              {filteredReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`reminder-card ${reminder.isCompleted ? 'completed' : ''}`}
                >
                  <div className="reminder-header">
                    <input
                      type="checkbox"
                      checked={reminder.isCompleted}
                      onChange={() => handleToggleReminderCompleted(reminder.id)}
                      className="item-checkbox"
                    />
                    <div className="reminder-type-badge">
                      <span className="category-icon">{getReminderTypeIcon(reminder.type)}</span>
                      <span className="type-name">{getReminderTypeName(reminder.type)}</span>
                    </div>
                    <div className="reminder-datetime">
                      <span className="reminder-date">{reminder.date}</span>
                      {reminder.time && <span className="reminder-time">{reminder.time}</span>}
                    </div>
                  </div>
                  <div className="reminder-content">
                    <h4 className={`reminder-title ${reminder.isCompleted ? 'completed' : ''}`}>
                      {reminder.title}
                    </h4>
                    {reminder.description && (
                      <p className="reminder-description">{reminder.description}</p>
                    )}
                  </div>
                  <div className="reminder-actions">
                    <button
                      className="delete-btn"
                      onClick={() => setShowDeleteReminderConfirm(reminder.id)}
                      title="删除提醒"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showAddReminderForm && (
            <button className="add-reminder-btn" onClick={() => setShowAddReminderForm(true)}>
              + 添加新提醒
            </button>
          )}

          {showAddReminderForm && (
            <div className="add-reminder-form">
              <h3>添加新提醒</h3>
              <div className="form-group">
                <label>提醒标题 *</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  placeholder="输入提醒标题"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>提醒描述</label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  placeholder="输入提醒描述（可选）"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>提醒类型</label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as ReminderType })}
                  >
                    <option value="document">📄 证件文件</option>
                    <option value="booking">📅 预订确认</option>
                    <option value="packing">🎒 打包准备</option>
                    <option value="activity">📍 活动安排</option>
                    <option value="other">📝 其他</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>提醒日期 *</label>
                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>提醒时间（可选）</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddReminderForm(false);
                    setNewReminder({
                      title: '',
                      description: '',
                      type: 'other',
                      date: '',
                      time: ''
                    });
                  }}
                >
                  取消
                </button>
                <button className="save-btn" onClick={handleAddReminder}>保存</button>
              </div>
            </div>
          )}
        </main>

        <aside className="budget-sidebar">
          <h2>提醒统计</h2>
          <div className="stat-item">
            <span>总提醒数</span>
            <span className="stat-value">{reminderList.reminders.length}</span>
          </div>
          <div className="stat-item">
            <span>已完成</span>
            <span className="stat-value packed">{getCompletedRemindersCount()}</span>
          </div>
          <div className="stat-item">
            <span>未完成</span>
            <span className="stat-value unpacked">{getIncompleteRemindersCount()}</span>
          </div>
          <div className="stat-item progress-item">
            <span>完成进度</span>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${reminderList.reminders.length > 0 
                    ? (getCompletedRemindersCount() / reminderList.reminders.length) * 100 
                    : 0}%`
                }}
              ></div>
            </div>
            <span className="progress-text">
              {reminderList.reminders.length > 0 
                ? Math.round((getCompletedRemindersCount() / reminderList.reminders.length) * 100) 
                : 0}%
            </span>
          </div>
          <div className="reminder-types-stats">
            <h3>类型分布</h3>
            {(['document', 'booking', 'packing', 'activity', 'other'] as ReminderType[]).map((type) => {
              const count = reminderList.reminders.filter(r => r.type === type).length;
              if (count === 0) return null;
              return (
                <div key={type} className="stat-item">
                  <span>
                    {getReminderTypeIcon(type)} {getReminderTypeName(type)}
                  </span>
                  <span className="stat-value">{count}</span>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    );
  };

  const renderReviewsPage = () => {
    const currentReview = getReviewByDate(selectedReviewDate);
    const currentPhotos = getPhotosByDate(selectedReviewDate);

    return (
      <div className="main-content">
        <aside className="sidebar">
          <h2>旅行日期</h2>
          <div className="day-list">
            {tripPlan.days.map((day) => {
              const hasReview = reviewList.reviews.some(r => r.date === day.date);
              const hasPhotos = reviewList.photoNotes.some(p => p.date === day.date);
              
              return (
                <div
                  key={day.id}
                  className={`day-item ${selectedReviewDate === day.date ? 'active' : ''}`}
                  onClick={() => setSelectedReviewDate(day.date)}
                >
                  <div className="day-item-content">
                    <span className="day-date">{day.date}</span>
                    <span className="activity-count">
                      {hasReview && '📝 有回顾'}
                      {hasReview && hasPhotos && ' | '}
                      {hasPhotos && '📷 有照片'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="sidebar-actions">
            <button 
              className="add-item-btn" 
              onClick={() => {
                setNewReview({ ...newReview, date: selectedReviewDate });
                setShowAddReviewForm(true);
              }}
            >
              添加回顾
            </button>
            <button 
              className="add-item-btn" 
              onClick={() => {
                setNewPhotoNote({ ...newPhotoNote, date: selectedReviewDate });
                setShowAddPhotoForm(true);
              }}
            >
              添加照片备注
            </button>
          </div>
        </aside>

        <main className="content">
          <div className="reviews-header">
            <h2>旅行回顾 - {selectedReviewDate}</h2>
          </div>

          <div className="review-section">
            <div className="section-header">
              <h3>
                <span className="category-icon">📝</span>
                当日回顾
              </h3>
              {currentReview && !showEditReviewForm && (
                <div className="section-actions">
                  <button 
                    className="edit-btn-small" 
                    onClick={() => handleEditReview(currentReview)}
                  >
                    编辑
                  </button>
                  <button 
                    className="delete-btn-small" 
                    onClick={() => setShowDeleteReviewConfirm(currentReview.id)}
                  >
                    删除
                  </button>
                </div>
              )}
            </div>

            {currentReview ? (
              <div className="review-card">
                <div className="review-meta">
                  <div className="review-mood-weather">
                    <span className="review-mood">心情: {currentReview.mood}</span>
                    <span className="review-weather">天气: {currentReview.weather}</span>
                  </div>
                  <div className="review-dates">
                    <span className="review-date">创建于: {currentReview.createdAt}</span>
                    {currentReview.updatedAt !== currentReview.createdAt && (
                      <span className="review-date">更新于: {currentReview.updatedAt}</span>
                    )}
                  </div>
                </div>
                <div className="review-content">
                  <p>{currentReview.content}</p>
                </div>
              </div>
            ) : (
              <p className="no-items">暂无当日回顾，点击左侧按钮添加</p>
            )}
          </div>

          <div className="review-section">
            <div className="section-header">
              <h3>
                <span className="category-icon">📷</span>
                照片备注 ({currentPhotos.length})
              </h3>
            </div>

            {currentPhotos.length === 0 ? (
              <p className="no-items">暂无照片备注，点击左侧按钮添加</p>
            ) : (
              <div className="photo-grid">
                {currentPhotos.map((photo) => (
                  <div key={photo.id} className="photo-card">
                    <div className="photo-image">
                      <img src={photo.imageUrl} alt="旅行照片" />
                    </div>
                    <div className="photo-note-content">
                      <p>{photo.note}</p>
                    </div>
                    <div className="photo-actions">
                      <button 
                        className="edit-btn-small" 
                        onClick={() => handleEditPhotoNote(photo)}
                      >
                        编辑
                      </button>
                      <button 
                        className="delete-btn-small" 
                        onClick={() => setShowDeletePhotoConfirm(photo.id)}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showAddReviewForm && (
            <div className="add-form-container">
              <div className="add-review-form">
                <h3>添加旅行回顾</h3>
                <div className="form-group">
                  <label>选择日期</label>
                  <select
                    value={newReview.date}
                    onChange={(e) => setNewReview({ ...newReview, date: e.target.value })}
                  >
                    <option value="">请选择日期</option>
                    {tripPlan.days.map((day) => (
                      <option key={day.id} value={day.date}>{day.date}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>心情</label>
                    <select
                      value={newReview.mood}
                      onChange={(e) => setNewReview({ ...newReview, mood: e.target.value })}
                    >
                      {moodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>天气</label>
                    <select
                      value={newReview.weather}
                      onChange={(e) => setNewReview({ ...newReview, weather: e.target.value })}
                    >
                      {weatherOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>回顾内容 *</label>
                  <textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    placeholder="记录今天的旅行体验..."
                    rows={6}
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="cancel-btn" 
                    onClick={() => {
                      setShowAddReviewForm(false);
                      setNewReview({
                        date: '',
                        content: '',
                        mood: '😊',
                        weather: '☀️'
                      });
                    }}
                  >
                    取消
                  </button>
                  <button className="save-btn" onClick={handleAddReview}>保存</button>
                </div>
              </div>
            </div>
          )}

          {showEditReviewForm && (
            <div className="add-form-container">
              <div className="edit-review-form">
                <h3>编辑旅行回顾</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>心情</label>
                    <select
                      value={editingReview.mood}
                      onChange={(e) => setEditingReview({ ...editingReview, mood: e.target.value })}
                    >
                      {moodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>天气</label>
                    <select
                      value={editingReview.weather}
                      onChange={(e) => setEditingReview({ ...editingReview, weather: e.target.value })}
                    >
                      {weatherOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>回顾内容 *</label>
                  <textarea
                    value={editingReview.content}
                    onChange={(e) => setEditingReview({ ...editingReview, content: e.target.value })}
                    placeholder="记录今天的旅行体验..."
                    rows={6}
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="cancel-btn" 
                    onClick={() => setShowEditReviewForm(false)}
                  >
                    取消
                  </button>
                  <button className="save-btn" onClick={handleSaveEditReview}>保存</button>
                </div>
              </div>
            </div>
          )}

          {showAddPhotoForm && (
            <div className="add-form-container">
              <div className="add-photo-form">
                <h3>添加照片备注</h3>
                <div className="form-group">
                  <label>关联日期</label>
                  <select
                    value={newPhotoNote.date}
                    onChange={(e) => setNewPhotoNote({ ...newPhotoNote, date: e.target.value })}
                  >
                    <option value="">请选择日期</option>
                    {tripPlan.days.map((day) => (
                      <option key={day.id} value={day.date}>{day.date}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>照片 (模拟，不用真实上传)</label>
                  <div className="photo-placeholder">
                    <div className="photo-placeholder-content">
                      <span className="photo-icon">📷</span>
                      <p>演示模式：将使用示例图片</p>
                      <p className="photo-hint">选择以下场景之一：</p>
                      <div className="scene-options">
                        <button 
                          type="button"
                          className={`scene-btn ${newPhotoNote.imageUrl.includes('landscape') ? 'active' : ''}`}
                          onClick={() => setNewPhotoNote({ 
                            ...newPhotoNote, 
                            imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20travel%20landscape%20scenery%20with%20mountains%20and%20lake&image_size=square_hd' 
                          })}
                        >
                          🏔️ 风景
                        </button>
                        <button 
                          type="button"
                          className={`scene-btn ${newPhotoNote.imageUrl.includes('city') ? 'active' : ''}`}
                          onClick={() => setNewPhotoNote({ 
                            ...newPhotoNote, 
                            imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20city%20street%20with%20people%20walking%20tourist%20travel&image_size=square_hd' 
                          })}
                        >
                          🏙️ 城市
                        </button>
                        <button 
                          type="button"
                          className={`scene-btn ${newPhotoNote.imageUrl.includes('food') ? 'active' : ''}`}
                          onClick={() => setNewPhotoNote({ 
                            ...newPhotoNote, 
                            imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20local%20food%20cuisine%20travel%20dining&image_size=square_hd' 
                          })}
                        >
                          🍜 美食
                        </button>
                        <button 
                          type="button"
                          className={`scene-btn ${newPhotoNote.imageUrl.includes('sunset') ? 'active' : ''}`}
                          onClick={() => setNewPhotoNote({ 
                            ...newPhotoNote, 
                            imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20sunset%20beach%20ocean%20travel%20vacation&image_size=square_hd' 
                          })}
                        >
                          🌅 日落
                        </button>
                      </div>
                      {newPhotoNote.imageUrl && (
                        <div className="selected-preview">
                          <p className="preview-label">已选择：</p>
                          <img src={newPhotoNote.imageUrl} alt="预览" className="preview-image" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>照片备注 *</label>
                  <textarea
                    value={newPhotoNote.note}
                    onChange={(e) => setNewPhotoNote({ ...newPhotoNote, note: e.target.value })}
                    placeholder="记录这张照片的故事..."
                    rows={4}
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="cancel-btn" 
                    onClick={() => {
                      setShowAddPhotoForm(false);
                      setNewPhotoNote({
                        date: '',
                        imageUrl: '',
                        note: ''
                      });
                    }}
                  >
                    取消
                  </button>
                  <button className="save-btn" onClick={handleAddPhotoNote}>保存</button>
                </div>
              </div>
            </div>
          )}

          {showEditPhotoForm && (
            <div className="add-form-container">
              <div className="edit-photo-form">
                <h3>编辑照片备注</h3>
                <div className="form-group">
                  <label>当前照片</label>
                  <div className="photo-preview-edit">
                    <img src={editingPhotoNote.imageUrl} alt="照片预览" />
                  </div>
                </div>
                <div className="form-group">
                  <label>照片备注 *</label>
                  <textarea
                    value={editingPhotoNote.note}
                    onChange={(e) => setEditingPhotoNote({ ...editingPhotoNote, note: e.target.value })}
                    placeholder="记录这张照片的故事..."
                    rows={4}
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="cancel-btn" 
                    onClick={() => setShowEditPhotoForm(false)}
                  >
                    取消
                  </button>
                  <button className="save-btn" onClick={handleSaveEditPhotoNote}>保存</button>
                </div>
              </div>
            </div>
          )}
        </main>

        <aside className="budget-sidebar">
          <h2>回顾统计</h2>
          <div className="stat-item">
            <span>已写回顾</span>
            <span className="stat-value">{getReviewsCount()}</span>
          </div>
          <div className="stat-item">
            <span>照片数量</span>
            <span className="stat-value">{getPhotosCount()}</span>
          </div>
          <div className="stat-item">
            <span>行程天数</span>
            <span className="stat-value">{tripPlan.days.length}</span>
          </div>
          <div className="stat-item progress-item">
            <span>回顾完成率</span>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${tripPlan.days.length > 0 
                    ? (getReviewsCount() / tripPlan.days.length) * 100 
                    : 0}%`
                }}
              ></div>
            </div>
            <span className="progress-text">
              {tripPlan.days.length > 0 
                ? Math.round((getReviewsCount() / tripPlan.days.length) * 100) 
                : 0}%
            </span>
          </div>
        </aside>
      </div>
    );
  };

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
          {packingList.categories.map((category) => (
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
          {packingList.categories.map((category) => {
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
                {packingList.categories.map((category) => (
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

  const renderTemplatesPage = () => {
    const selectedTemplate = selectedTemplateId ? getTemplateById(selectedTemplateId) : null;

    return (
      <div className="main-content">
        <main className="content templates-main">
          <div className="templates-page-header">
            <h2>清单模板</h2>
            <p className="templates-subtitle">选择或编辑一个模板，应用到您的旅行清单</p>
          </div>

          {!selectedTemplate ? (
            <div className="template-cards-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="template-card"
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  <div className="template-card-header">
                    <span className="template-card-icon">{template.icon}</span>
                    <h3 className="template-card-name">{template.name}</h3>
                  </div>
                  <p className="template-card-description">{template.description}</p>
                  <div className="template-card-footer">
                    <div className="template-card-stats">
                      <span className="template-stat">
                        <strong>{template.categories.length}</strong> 个类别
                      </span>
                      <span className="template-stat">
                        <strong>{template.items.length}</strong> 个物品
                      </span>
                    </div>
                    <div className="template-card-actions">
                      <button
                        className="template-card-btn edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTemplate(template);
                        }}
                      >
                        编辑
                      </button>
                      <button
                        className="template-card-btn apply-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowApplyTemplateConfirm(template.id);
                        }}
                      >
                        应用
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="template-detail-header">
                <button
                  className="back-btn"
                  onClick={() => setSelectedTemplateId(null)}
                >
                  ← 返回模板列表
                </button>
                <div className="template-detail-info">
                  <span className="template-detail-icon">{selectedTemplate.icon}</span>
                  <div>
                    <h2>{selectedTemplate.name}</h2>
                    <p className="template-description">{selectedTemplate.description}</p>
                  </div>
                </div>
                <div className="template-detail-actions">
                  <button
                    className="apply-btn"
                    onClick={() => setShowApplyTemplateConfirm(selectedTemplate.id)}
                  >
                    应用模板
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditTemplate(selectedTemplate)}
                  >
                    编辑模板
                  </button>
                </div>
              </div>

              <div className="template-categories">
                {selectedTemplate.categories.map((category) => {
                  const categoryItems = selectedTemplate.items.filter(
                    (item) => item.categoryId === category.id
                  );

                  return (
                    <div key={category.id} className="template-category">
                      <div className="template-category-header">
                        <h3>
                          <span className="category-icon">{category.icon}</span>
                          {category.name}
                        </h3>
                        <div className="category-header-actions">
                          <span className="category-item-count">
                            {categoryItems.length} 个物品
                          </span>
                          <button
                            className="template-edit-btn"
                            onClick={() => handleEditCategory(selectedTemplate.id, category)}
                            title="编辑类别"
                          >
                            编辑
                          </button>
                          <button
                            className="item-delete-btn"
                            onClick={() =>
                              setShowDeleteCategoryConfirm({
                                templateId: selectedTemplate.id,
                                categoryId: category.id
                              })
                            }
                            title="删除类别"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                      <div className="template-items">
                        {categoryItems.length === 0 ? (
                          <p className="no-items-in-category">暂无物品，点击下方按钮添加</p>
                        ) : (
                          categoryItems.map((item) => (
                            <div key={item.id} className="template-item-row">
                              <span className="item-name">{item.name}</span>
                              <div className="item-actions">
                                <button
                                  className="template-edit-btn"
                                  onClick={() => handleEditItem(selectedTemplate.id, item)}
                                  title="编辑物品"
                                >
                                  编辑
                                </button>
                                <button
                                  className="item-delete-btn"
                                  onClick={() =>
                                    setShowDeleteItemConfirmTemplate({
                                      templateId: selectedTemplate.id,
                                      itemId: item.id
                                    })
                                  }
                                  title="删除物品"
                                >
                                  删除
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="template-bottom-actions">
                <button
                  className="add-category-btn"
                  onClick={() => {
                    setEditingTemplate({ ...selectedTemplate });
                    setShowAddCategoryForm(true);
                  }}
                >
                  添加类别
                </button>
                <button
                  className="add-item-btn"
                  onClick={() => {
                    setNewTemplateItemCategoryId(selectedTemplate.categories[0]?.id || '');
                    setShowAddTemplateItemForm(true);
                  }}
                >
                  添加物品
                </button>
              </div>
            </>
          )}
        </main>

        <aside className="budget-sidebar">
          <h2>模板统计</h2>
          {selectedTemplate ? (
            <>
              <div className="stat-item">
                <span>类别数量</span>
                <span className="stat-value">{selectedTemplate.categories.length}</span>
              </div>
              <div className="stat-item">
                <span>物品总数</span>
                <span className="stat-value">{selectedTemplate.items.length}</span>
              </div>
              {selectedTemplate.categories.map((category) => {
                const itemCount = selectedTemplate.items.filter(
                  (item) => item.categoryId === category.id
                ).length;
                return (
                  <div key={category.id} className="stat-item">
                    <span>
                      {category.icon} {category.name}
                    </span>
                    <span className="stat-value">{itemCount}</span>
                  </div>
                );
              })}
            </>
          ) : (
            <p className="no-stats">请选择一个模板查看统计</p>
          )}
        </aside>
      </div>
    );
  };

  const renderProjectsPage = () => (
    <div className="projects-main">
      <div className="projects-page-header">
        <div className="projects-header-left">
          <h2>我的旅行项目</h2>
          <p className="projects-subtitle">管理您的所有旅行计划</p>
        </div>
        <button className="add-project-btn" onClick={() => setShowAddProjectForm(true)}>
          <span className="add-project-icon">+</span>
          创建新项目
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects">
          <div className="no-projects-icon">🌍</div>
          <h3>还没有旅行项目</h3>
          <p>点击上方按钮创建您的第一个旅行计划</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <div className="project-icon">
                  {project.totalBudget > 10000 ? '✈️' : '🚄'}
                </div>
                <div className="project-info">
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-dates">
                    {project.startDate} - {project.endDate}
                  </p>
                </div>
              </div>
              <div className="project-stats">
                <div className="project-stat">
                  <span className="stat-label">行程天数</span>
                  <span className="stat-value">{calculateProjectDays(project.startDate, project.endDate)} 天</span>
                </div>
                <div className="project-stat">
                  <span className="stat-label">总预算</span>
                  <span className="stat-value">¥{project.totalBudget.toLocaleString()}</span>
                </div>
                <div className="project-stat">
                  <span className="stat-label">活动数</span>
                  <span className="stat-value">
                    {project.tripPlan.days.reduce((sum, day) => sum + day.activities.length, 0)} 个
                  </span>
                </div>
                <div className="project-stat">
                  <span className="stat-label">创建时间</span>
                  <span className="stat-value">{project.createdAt}</span>
                </div>
              </div>
              <div className="project-actions">
                <button
                  className="enter-project-btn"
                  onClick={() => handleSwitchProject(project.id)}
                >
                  进入项目
                </button>
                <button
                  className="edit-project-btn"
                  onClick={() => handleEditProject(project)}
                >
                  编辑
                </button>
                <button
                  className="delete-project-btn"
                  onClick={() => setShowDeleteProjectConfirm(project.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddProjectForm && (
        <div className="modal-overlay" onClick={() => setShowAddProjectForm(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>创建新旅行项目</h3>
            <div className="form-group">
              <label>项目名称 *</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="例如：东京五日游"
                autoFocus
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>开始日期 *</label>
                <input
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>结束日期 *</label>
                <input
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>总预算</label>
              <input
                type="text"
                value={newProject.totalBudget.toString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setNewProject({ ...newProject, totalBudget: value });
                }}
                placeholder="请输入预算金额"
              />
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowAddProjectForm(false);
                  setNewProject({
                    name: '',
                    startDate: '',
                    endDate: '',
                    totalBudget: 0
                  });
                }}
              >
                取消
              </button>
              <button className="save-btn" onClick={handleAddProject}>
                创建项目
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditProjectForm && editingProject && (
        <div className="modal-overlay" onClick={() => setShowEditProjectForm(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>编辑旅行项目</h3>
            <div className="form-group">
              <label>项目名称 *</label>
              <input
                type="text"
                value={editingProject.name}
                onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>开始日期 *</label>
                <input
                  type="date"
                  value={editingProject.startDate}
                  onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>结束日期 *</label>
                <input
                  type="date"
                  value={editingProject.endDate}
                  onChange={(e) => setEditingProject({ ...editingProject, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>总预算</label>
              <input
                type="text"
                value={editingProject.totalBudget.toString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setEditingProject({ ...editingProject, totalBudget: value });
                }}
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowEditProjectForm(false)}>
                取消
              </button>
              <button className="save-btn" onClick={handleSaveEditProject}>
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app">
      {currentPage !== 'projects' ? (
        <header className="header">
          <div className="header-left">
            <button className="back-to-projects-btn" onClick={handleBackToProjects}>
              ← 返回项目列表
            </button>
            <h1>{tripPlan.name}</h1>
          </div>
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
                <span className="nav-badge">{getUnpackedCount()}</span>
              )}
            </button>
            <button
              className={`nav-btn ${currentPage === 'travel' ? 'active' : ''}`}
              onClick={() => setCurrentPage('travel')}
            >
              住宿交通
            </button>
            <button
              className={`nav-btn ${currentPage === 'reminders' ? 'active' : ''}`}
              onClick={() => setCurrentPage('reminders')}
            >
              提醒待办
              {getIncompleteRemindersCount() > 0 && (
                <span className="nav-badge">{getIncompleteRemindersCount()}</span>
              )}
            </button>
            <div className="more-menu-container">
              <button
                className={`nav-btn more-btn ${
                  currentPage === 'templates' || currentPage === 'reviews' ? 'active' : ''
                }`}
                onClick={() => setShowMoreMenu(!showMoreMenu)}
              >
                更多 ▼
              </button>
              {showMoreMenu && (
                <div className="more-menu-dropdown">
                  <button
                    className={`more-menu-item ${currentPage === 'templates' ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentPage('templates');
                      setShowMoreMenu(false);
                    }}
                  >
                    清单模板
                  </button>
                  <button
                    className={`more-menu-item ${currentPage === 'reviews' ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentPage('reviews');
                      setShowMoreMenu(false);
                    }}
                  >
                    旅行回顾
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* <div className="trip-dates">
            <span>{tripPlan.startDate}</span> - <span>{tripPlan.endDate}</span>
          </div> */}
        </header>
      ) : (
        <header className="header projects-header">
          <h1>🌍 旅行计划器</h1>
          <p className="header-subtitle">管理您的所有旅行项目</p>
        </header>
      )}

      {currentPage === 'projects'
        ? renderProjectsPage()
        : currentPage === 'itinerary'
        ? renderItineraryPage()
        : currentPage === 'packing'
        ? renderPackingPage()
        : currentPage === 'templates'
        ? renderTemplatesPage()
        : currentPage === 'travel'
        ? renderTravelPage()
        : currentPage === 'reminders'
        ? renderRemindersPage()
        : renderReviewsPage()}

      {showDeleteProjectConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteProjectConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这个旅行项目吗？该项目下的所有行程、物品清单、住宿交通、提醒待办等内容都将被删除。此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteProjectConfirm(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeleteProject(showDeleteProjectConfirm!)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

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

      {showEditTemplate && editingTemplate && (
        <div className="modal-overlay" onClick={() => setShowEditTemplate(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>编辑模板</h3>
            <div className="form-group">
              <label>模板名称</label>
              <input
                type="text"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>模板描述</label>
              <textarea
                value={editingTemplate.description}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>模板图标</label>
              <input
                type="text"
                value={editingTemplate.icon}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, icon: e.target.value })}
                placeholder="输入 emoji 图标"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowEditTemplate(false)}>取消</button>
              <button className="save-btn" onClick={handleSaveEditTemplate}>保存</button>
            </div>
          </div>
        </div>
      )}

      {showAddCategoryForm && editingTemplate && (
        <div className="modal-overlay" onClick={() => setShowAddCategoryForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>添加类别</h3>
            <div className="form-group">
              <label>类别名称</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="输入类别名称"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>类别图标</label>
              <input
                type="text"
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                placeholder="输入 emoji 图标"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddCategoryForm(false)}>取消</button>
              <button className="save-btn" onClick={handleAddCategory}>保存</button>
            </div>
          </div>
        </div>
      )}

      {showAddTemplateItemForm && selectedTemplateId && (
        <div className="modal-overlay" onClick={() => setShowAddTemplateItemForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>添加物品</h3>
            <div className="form-group">
              <label>物品名称</label>
              <input
                type="text"
                value={newTemplateItemName}
                onChange={(e) => setNewTemplateItemName(e.target.value)}
                placeholder="输入物品名称"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>所属类别</label>
              <select
                value={newTemplateItemCategoryId}
                onChange={(e) => setNewTemplateItemCategoryId(e.target.value)}
              >
                {(getTemplateById(selectedTemplateId)?.categories || []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddTemplateItemForm(false)}>取消</button>
              <button className="save-btn" onClick={() => handleAddTemplateItem(selectedTemplateId)}>保存</button>
            </div>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="modal-overlay" onClick={() => setEditingCategory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>编辑类别</h3>
            <div className="form-group">
              <label>类别名称</label>
              <input
                type="text"
                value={editingCategory.category.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    category: { ...editingCategory.category, name: e.target.value }
                  })
                }
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>类别图标</label>
              <input
                type="text"
                value={editingCategory.category.icon}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    category: { ...editingCategory.category, icon: e.target.value }
                  })
                }
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setEditingCategory(null)}>取消</button>
              <button className="save-btn" onClick={handleSaveEditCategory}>保存</button>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>编辑物品</h3>
            <div className="form-group">
              <label>物品名称</label>
              <input
                type="text"
                value={editingItem.item.name}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, name: e.target.value }
                  })
                }
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>所属类别</label>
              <select
                value={editingItem.item.categoryId}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, categoryId: e.target.value }
                  })
                }
              >
                {(getTemplateById(editingItem.templateId)?.categories || []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setEditingItem(null)}>取消</button>
              <button className="save-btn" onClick={handleSaveEditItem}>保存</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteTemplateConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteTemplateConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这个模板吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteTemplateConfirm(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeleteTemplate(showDeleteTemplateConfirm!)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteCategoryConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteCategoryConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这个类别吗？该类别下的所有物品也将被删除。此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteCategoryConfirm(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeleteCategory(showDeleteCategoryConfirm.templateId, showDeleteCategoryConfirm.categoryId)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteItemConfirmTemplate && (
        <div className="modal-overlay" onClick={() => setShowDeleteItemConfirmTemplate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这个物品吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteItemConfirmTemplate(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeleteItemTemplate(showDeleteItemConfirmTemplate.templateId, showDeleteItemConfirmTemplate.itemId)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showApplyTemplateConfirm && (
        <div className="modal-overlay" onClick={() => setShowApplyTemplateConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>应用模板</h3>
            <p>确定要将此模板应用到当前物品清单吗？模板中的所有物品将被添加到当前清单中。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowApplyTemplateConfirm(null)}>取消</button>
              <button className="save-btn" onClick={() => handleApplyTemplate(showApplyTemplateConfirm!)}>确认应用</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteAccommodationConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteAccommodationConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这条住宿信息吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteAccommodationConfirm(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeleteAccommodation(showDeleteAccommodationConfirm!)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteTransportationConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteTransportationConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这条交通信息吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteTransportationConfirm(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeleteTransportation(showDeleteTransportationConfirm!)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteReminderConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteReminderConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这条提醒吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteReminderConfirm(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeleteReminder(showDeleteReminderConfirm!)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteReviewConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteReviewConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这篇旅行回顾吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteReviewConfirm(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeleteReview(showDeleteReviewConfirm!)}>确认删除</button>
            </div>
          </div>
        </div>
      )}

      {showDeletePhotoConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeletePhotoConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这张照片备注吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeletePhotoConfirm(null)}>取消</button>
              <button className="delete-btn" onClick={() => handleDeletePhotoNote(showDeletePhotoConfirm!)}>确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;