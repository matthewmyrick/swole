import { Routine, WeekSchedule } from '../types';

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
        description: 'Flat bench with barbell',
      },
      {
        id: '1-2',
        name: 'Pull-ups',
        type: 'upper_body',
        exerciseType: 'lift',
        reps: 10,
        sets: 3,
        description: 'Wide grip pull-ups',
      },
      {
        id: '1-3',
        name: 'Shoulder Press',
        type: 'upper_body',
        exerciseType: 'lift',
        weight: 95,
        reps: 10,
        sets: 3,
        description: 'Overhead press with barbell',
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
        description: 'Back squats with proper depth',
      },
      {
        id: '2-2',
        name: 'Romanian Deadlifts',
        type: 'lower_body',
        exerciseType: 'lift',
        weight: 185,
        reps: 10,
        sets: 3,
        description: 'Focus on hamstring stretch',
      },
      {
        id: '2-3',
        name: 'Leg Press',
        type: 'lower_body',
        exerciseType: 'lift',
        weight: 360,
        reps: 12,
        sets: 3,
        description: 'Full range of motion',
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
        description: 'Hold plank position',
      },
      {
        id: '3-2',
        name: 'Russian Twists',
        type: 'abs',
        exerciseType: 'lift',
        weight: 25,
        reps: 20,
        sets: 3,
        description: 'With medicine ball',
      },
      {
        id: '3-3',
        name: 'Leg Raises',
        type: 'abs',
        exerciseType: 'lift',
        reps: 15,
        sets: 3,
        description: 'Hanging leg raises',
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
        description: 'Full court games and drills',
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
        description: 'Flow yoga class',
      },
    ],
  },
];

export const mockWeekSchedule: WeekSchedule = {
  schedule: [
    {
      day: 'Monday',
      routines: [mockRoutines[0]],
    },
    {
      day: 'Tuesday',
      routines: [mockRoutines[1]],
    },
    {
      day: 'Wednesday',
      routines: [mockRoutines[4]],
    },
    {
      day: 'Thursday',
      routines: [mockRoutines[0]],
    },
    {
      day: 'Friday',
      routines: [mockRoutines[1]],
    },
    {
      day: 'Saturday',
      routines: [mockRoutines[2], mockRoutines[3]],
    },
    {
      day: 'Sunday',
      routines: [],
    },
  ],
};