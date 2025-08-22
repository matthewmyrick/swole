import { ENV } from '../config/env';
import { WeekSchedule, Routine, Workout } from '../types';

const API_BASE_URL = ENV.API_BASE_URL;

// Default user ID for now - in production this would come from authentication
const DEFAULT_USER_ID = 'user@example.com';

export class ApiService {
  static async getWeekSchedule(userId: string = DEFAULT_USER_ID): Promise<WeekSchedule> {
    const response = await fetch(`${API_BASE_URL}/week-schedule?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch week schedule');
    }
    return response.json();
  }

  static async getRoutines(userId: string = DEFAULT_USER_ID): Promise<Routine[]> {
    const response = await fetch(`${API_BASE_URL}/routines?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch routines');
    }
    return response.json();
  }

  static async getRoutine(routineId: string, userId: string = DEFAULT_USER_ID): Promise<Routine> {
    const response = await fetch(`${API_BASE_URL}/routines/${routineId}?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch routine');
    }
    return response.json();
  }

  static async updateWorkoutProgress(
    workoutId: string, 
    userWeight?: number, 
    userTime?: number,
    userId: string = DEFAULT_USER_ID
  ): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/workouts/${workoutId}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        userWeight,
        userTime,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update workout progress');
    }
    return response.json();
  }

  static async getUserProgress(
    userId: string = DEFAULT_USER_ID, 
    workoutId: string
  ): Promise<Array<{ date: string; weight?: number; time?: number }>> {
    const response = await fetch(`${API_BASE_URL}/user-progress?user_id=${userId}&workout_id=${workoutId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user progress');
    }
    return response.json();
  }
}