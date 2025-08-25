import { Routine, WeekSchedule } from '../types';
import { EmojiMapper } from '../utils/emojiMapper';

// Enhanced mock routines based on the YAML file with emojis
export const mockRoutines: Routine[] = [
  {
    id: '1',
    name: 'Upper Body Power',
    description: 'Intense upper body workout focusing on strength',
    workouts: [
      {
        id: '1-1',
        name: 'Bench Press',
        type: 'upper_body',
        exerciseType: 'lift',
        weight: 135,
        reps: 8,
        sets: 4,
        description: 'Flat bench with barbell - Lower bar to chest, press up explosively',
      },
      {
        id: '1-2',
        name: 'Pull-ups',
        type: 'upper_body',
        exerciseType: 'lift',
        reps: 10,
        sets: 3,
        description: 'Wide grip pull-ups - Hang from bar, pull up until chin over bar',
      },
      {
        id: '1-3',
        name: 'Shoulder Press',
        type: 'upper_body',
        exerciseType: 'lift',
        weight: 95,
        reps: 10,
        sets: 3,
        description: 'Overhead press with barbell - Press barbell from shoulders to overhead',
      },
    ],
  },
  {
    id: '2',
    name: 'Leg Day',
    description: 'Complete lower body workout',
    workouts: [
      {
        id: '2-1',
        name: 'Squats',
        type: 'lower_body',
        exerciseType: 'lift',
        weight: 225,
        reps: 8,
        sets: 4,
        description: 'Back squats with proper depth - Squat down until thighs parallel to floor',
      },
      {
        id: '2-2',
        name: 'Romanian Deadlifts',
        type: 'lower_body',
        exerciseType: 'lift',
        weight: 185,
        reps: 10,
        sets: 3,
        description: 'Focus on hamstring stretch - Hinge at hips, lower bar while keeping legs straight',
      },
      {
        id: '2-3',
        name: 'Leg Press',
        type: 'lower_body',
        exerciseType: 'lift',
        weight: 360,
        reps: 12,
        sets: 3,
        description: 'Full range of motion - Press weight with legs, full extension',
      },
    ],
  },
  {
    id: '3',
    name: 'Core Circuit',
    description: 'Abs and core strengthening',
    workouts: [
      {
        id: '3-1',
        name: 'Plank',
        type: 'abs',
        exerciseType: 'timed',
        time: 60,
        sets: 3,
        description: 'Hold plank position - Hold straight body position on forearms',
      },
      {
        id: '3-2',
        name: 'Russian Twists',
        type: 'abs',
        exerciseType: 'lift',
        weight: 25,
        reps: 20,
        sets: 3,
        description: 'With medicine ball - Sit with knees bent, rotate torso side to side',
      },
      {
        id: '3-3',
        name: 'Leg Raises',
        type: 'abs',
        exerciseType: 'lift',
        reps: 15,
        sets: 3,
        description: 'Hanging leg raises - Hang from bar, raise legs to horizontal',
      },
    ],
  },
  {
    id: '4',
    name: 'Basketball Practice',
    description: 'Weekly basketball session',
    workouts: [
      {
        id: '4-1',
        name: 'Basketball',
        type: null,
        exerciseType: 'activity',
        time: 90,
        description: 'Full court games and drills - Mix of shooting drills, scrimmage, and conditioning',
      },
    ],
  },
  {
    id: '5',
    name: 'Yoga Class',
    description: 'Flexibility and mindfulness',
    workouts: [
      {
        id: '5-1',
        name: 'Vinyasa Yoga',
        type: null,
        exerciseType: 'class',
        time: 60,
        description: 'Flow yoga class - Follow instructor through flowing sequences',
      },
    ],
  },
  {
    id: '6',
    name: 'HIIT Cardio',
    description: 'High intensity interval training',
    workouts: [
      {
        id: '6-1',
        name: 'Burpees',
        type: 'abs',
        exerciseType: 'timed',
        time: 30,
        sets: 4,
        description: 'Full body explosive movement - Squat, jump back to plank, push-up, jump forward, jump up',
      },
      {
        id: '6-2',
        name: 'Mountain Climbers',
        type: 'abs',
        exerciseType: 'timed',
        time: 30,
        sets: 4,
        description: 'Fast alternating knee drives - Plank position, alternate bringing knees to chest quickly',
      },
      {
        id: '6-3',
        name: 'Jump Squats',
        type: 'lower_body',
        exerciseType: 'timed',
        time: 30,
        sets: 4,
        description: 'Explosive squat jumps - Squat down, jump up explosively, land softly',
      },
    ],
  },
];

// Enhanced week schedule with more variety
export const mockWeekSchedule: WeekSchedule = {
  schedule: [
    {
      day: 'Monday',
      routines: [mockRoutines[0]], // Upper Body Power
    },
    {
      day: 'Tuesday',
      routines: [mockRoutines[1]], // Leg Day
    },
    {
      day: 'Wednesday',
      routines: [mockRoutines[4]], // Yoga Class
    },
    {
      day: 'Thursday',
      routines: [mockRoutines[0]], // Upper Body Power
    },
    {
      day: 'Friday',
      routines: [mockRoutines[1]], // Leg Day
    },
    {
      day: 'Saturday',
      routines: [mockRoutines[2], mockRoutines[3]], // Core Circuit + Basketball
    },
    {
      day: 'Sunday',
      routines: [], // Rest day
    },
  ],
};

// Helper function to get routine with emoji
export function getRoutineWithEmoji(routine: Routine): Routine & { emoji: string } {
  return {
    ...routine,
    emoji: EmojiMapper.getRoutineEmoji(routine.name),
  };
}

// Helper function to get workout with emoji
export function getWorkoutWithEmoji(workout: any): any {
  return {
    ...workout,
    emoji: EmojiMapper.getExerciseEmoji(workout.name),
  };
}

// Export routines with emojis
export const mockRoutinesWithEmojis = mockRoutines.map(getRoutineWithEmoji);

// Categories from YAML
export const workoutCategories = [
  { name: 'strength', description: 'Weight lifting and resistance training', emoji: '💪' },
  { name: 'cardio', description: 'Cardiovascular and endurance training', emoji: '❤️' },
  { name: 'flexibility', description: 'Stretching and mobility work', emoji: '🤸' },
  { name: 'activity', description: 'Sports and recreational activities', emoji: '⚽' },
  { name: 'core', description: 'Core and abdominal focused workouts', emoji: '🎯' },
];

// Difficulty levels from YAML
export const difficultyLevels = [
  { name: 'beginner', description: 'New to exercise or this type of training', emoji: '🟢' },
  { name: 'intermediate', description: 'Some experience with exercise', emoji: '🟡' },
  { name: 'advanced', description: 'Experienced with this type of training', emoji: '🔴' },
];

// Equipment list from YAML
export const equipmentList = [
  { name: 'barbell', emoji: '🏋️' },
  { name: 'dumbbells', emoji: '🏋️' },
  { name: 'pull_up_bar', emoji: '🔄' },
  { name: 'bench', emoji: '💺' },
  { name: 'leg_press_machine', emoji: '🦵' },
  { name: 'medicine_ball', emoji: '⚽' },
  { name: 'yoga_mat', emoji: '🧘' },
  { name: 'basketball', emoji: '🏀' },
  { name: 'court', emoji: '🏀' },
];