export type WorkoutType = 'lower_body' | 'upper_body' | 'abs';
export type ExerciseType = 'lift' | 'timed' | 'class' | 'activity';

export interface Workout {
  id: string;
  name: string;
  type: WorkoutType | null;
  exerciseType: ExerciseType;
  weight?: number;
  time?: number;
  reps?: number;
  sets?: number;
  description?: string;
  userWeight?: number;
  userTime?: number;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  workouts: Workout[];
}

export interface DaySchedule {
  day: string;
  routines: Routine[];
}

export interface WeekSchedule {
  schedule: DaySchedule[];
}