import { ENV } from '../config/env';
import { WeekSchedule, Routine, Workout } from '../types';
import { mockWeekSchedule, mockRoutines } from '../data/mockData';

const API_BASE_URL = ENV.API_BASE_URL;

// Default user ID for now - in production this would come from authentication
const DEFAULT_USER_ID = 'user@example.com';

// Configuration for fallback behavior
const CONFIG = {
  USE_MOCK_DATA: false, // Set to true to always use mock data
  TIMEOUT_MS: 5000, // API timeout in milliseconds
  RETRY_ATTEMPTS: 2,
};

// Enhanced fetch with timeout and retry logic
async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeoutMs = CONFIG.TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Retry wrapper for API calls
async function withRetry<T>(
  operation: () => Promise<T>, 
  attempts = CONFIG.RETRY_ATTEMPTS
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === attempts - 1) throw error;
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retry attempts reached');
}

export class ApiService {
  static async getWeekSchedule(userId: string = DEFAULT_USER_ID): Promise<WeekSchedule> {
    // Force mock data if configured or if we're in development without backend
    if (CONFIG.USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockWeekSchedule;
    }

    try {
      return await withRetry(async () => {
        const response = await fetchWithTimeout(`${API_BASE_URL}/week-schedule?user_id=${encodeURIComponent(userId)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate response structure
        if (!data || !Array.isArray(data.schedule)) {
          throw new Error('Invalid week schedule response format');
        }
        
        return data;
      });
    } catch (error) {
      console.warn('Failed to fetch week schedule from API, falling back to mock data:', error);
      
      // Fallback to mock data with simulated delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockWeekSchedule;
    }
  }

  static async getRoutines(userId: string = DEFAULT_USER_ID): Promise<Routine[]> {
    if (CONFIG.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockRoutines;
    }

    try {
      return await withRetry(async () => {
        const response = await fetchWithTimeout(`${API_BASE_URL}/routines?user_id=${encodeURIComponent(userId)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate response structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid routines response format');
        }
        
        return data;
      });
    } catch (error) {
      console.warn('Failed to fetch routines from API, falling back to mock data:', error);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockRoutines;
    }
  }

  static async getRoutine(routineId: string, userId: string = DEFAULT_USER_ID): Promise<Routine> {
    if (CONFIG.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const routine = mockRoutines.find(r => r.id === routineId);
      if (!routine) {
        throw new Error('Routine not found');
      }
      return routine;
    }

    try {
      return await withRetry(async () => {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/routines/${encodeURIComponent(routineId)}?user_id=${encodeURIComponent(userId)}`
        );
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Routine not found');
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate response structure
        if (!data || !data.id || !data.name) {
          throw new Error('Invalid routine response format');
        }
        
        return data;
      });
    } catch (error) {
      console.warn(`Failed to fetch routine ${routineId} from API, falling back to mock data:`, error);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      const routine = mockRoutines.find(r => r.id === routineId);
      if (!routine) {
        throw new Error('Routine not found');
      }
      return routine;
    }
  }

  static async updateWorkoutProgress(
    workoutId: string, 
    userWeight?: number, 
    userTime?: number,
    userId: string = DEFAULT_USER_ID
  ): Promise<{ status: string }> {
    if (CONFIG.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { status: 'success' };
    }

    try {
      return await withRetry(async () => {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/workouts/${encodeURIComponent(workoutId)}/progress`,
          {
            method: 'POST',
            body: JSON.stringify({
              user_id: userId,
              userWeight,
              userTime,
            }),
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
      });
    } catch (error) {
      console.warn('Failed to update workout progress via API, using mock response:', error);
      
      // Simulate successful update locally
      await new Promise(resolve => setTimeout(resolve, 300));
      return { status: 'success' };
    }
  }

  static async getUserProgress(
    userId: string = DEFAULT_USER_ID, 
    workoutId: string
  ): Promise<Array<{ date: string; weight?: number; time?: number }>> {
    if (CONFIG.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      // Return some mock progress data
      return [
        { date: new Date().toISOString().split('T')[0], weight: 135, time: 45 },
        { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], weight: 130, time: 50 },
      ];
    }

    try {
      return await withRetry(async () => {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/progress?user_id=${encodeURIComponent(userId)}&workout_id=${encodeURIComponent(workoutId)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate response structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid progress response format');
        }
        
        return data;
      });
    } catch (error) {
      console.warn('Failed to fetch user progress from API, returning empty array:', error);
      return [];
    }
  }

  // Health check method
  static async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL.replace('/api', '')}/health`, {}, 3000);
      return response.ok;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }

  // Method to toggle between mock and real data
  static setMockDataMode(useMockData: boolean): void {
    CONFIG.USE_MOCK_DATA = useMockData;
  }

  // Get current configuration
  static getConfig() {
    return { ...CONFIG };
  }
}