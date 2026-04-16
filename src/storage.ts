import type { TripProject, PackingTemplate } from './types';
import { mockTripProjects, packingTemplates } from './data';

const STORAGE_KEY_PROJECTS = 'tripplanner_projects';
const STORAGE_KEY_TEMPLATES = 'tripplanner_templates';

export interface StorageProvider {
  saveProjects(projects: TripProject[]): Promise<void>;
  loadProjects(): Promise<TripProject[]>;
  saveTemplates(templates: PackingTemplate[]): Promise<void>;
  loadTemplates(): Promise<PackingTemplate[]>;
}

export class LocalStorageProvider implements StorageProvider {
  async saveProjects(projects: TripProject[]): Promise<void> {
    try {
      const data = JSON.stringify(projects);
      localStorage.setItem(STORAGE_KEY_PROJECTS, data);
    } catch (error) {
      console.error('Failed to save projects to localStorage:', error);
      throw error;
    }
  }

  async loadProjects(): Promise<TripProject[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (data) {
        return JSON.parse(data) as TripProject[];
      }
      return [];
    } catch (error) {
      console.error('Failed to load projects from localStorage:', error);
      return [];
    }
  }

  async saveTemplates(templates: PackingTemplate[]): Promise<void> {
    try {
      const data = JSON.stringify(templates);
      localStorage.setItem(STORAGE_KEY_TEMPLATES, data);
    } catch (error) {
      console.error('Failed to save templates to localStorage:', error);
      throw error;
    }
  }

  async loadTemplates(): Promise<PackingTemplate[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      if (data) {
        return JSON.parse(data) as PackingTemplate[];
      }
      return [];
    } catch (error) {
      console.error('Failed to load templates from localStorage:', error);
      return [];
    }
  }
}

export const storage = new LocalStorageProvider();

export const initializeData = async (): Promise<{
  projects: TripProject[];
  templates: PackingTemplate[];
}> => {
  let projects = await storage.loadProjects();
  let templates = await storage.loadTemplates();

  if (projects.length === 0) {
    projects = JSON.parse(JSON.stringify(mockTripProjects));
    await storage.saveProjects(projects);
  }

  if (templates.length === 0) {
    templates = JSON.parse(JSON.stringify(packingTemplates));
    await storage.saveTemplates(templates);
  }

  return { projects, templates };
};
