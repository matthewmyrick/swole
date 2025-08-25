// Comprehensive emoji mapping for workout routines and exercises
export interface EmojiMapping {
  routine: string;
  exercise: string;
  category: string;
  difficulty: string;
}

// Routine name to emoji mapping
const routineEmojiMap: { [key: string]: string } = {
  // Strength routines
  'Upper Body Power': '💪',
  'upper body power': '💪',
  'Leg Day': '🦵',
  'leg day': '🦵',
  'Core Circuit': '🎯',
  'core circuit': '🎯',
  'HIIT Cardio': '🔥',
  'hiit cardio': '🔥',
  'Full Body': '🏋️',
  'full body': '🏋️',
  
  // Activity routines
  'Basketball Practice': '🏀',
  'basketball practice': '🏀',
  'Yoga Class': '🧘',
  'yoga class': '🧘',
  'Running': '🏃',
  'running': '🏃',
  'Swimming': '🏊',
  'swimming': '🏊',
  'Cycling': '🚴',
  'cycling': '🚴',
  
  // Default fallbacks
  'strength': '💪',
  'cardio': '❤️',
  'flexibility': '🤸',
  'activity': '⚽',
  'core': '🎯',
};

// Exercise name to emoji mapping
const exerciseEmojiMap: { [key: string]: string } = {
  // Upper body exercises
  'bench press': '💺',
  'pull-ups': '🔄',
  'pullups': '🔄',
  'shoulder press': '⬆️',
  'push-ups': '💪',
  'pushups': '💪',
  'bicep curls': '💪',
  'tricep dips': '💪',
  'rows': '🚣',
  
  // Lower body exercises
  'squats': '⬇️',
  'deadlifts': '⚡',
  'romanian deadlifts': '⚡',
  'leg press': '🦵',
  'lunges': '🦵',
  'calf raises': '🦵',
  'leg curls': '🦵',
  
  // Core exercises
  'plank': '🏁',
  'russian twists': '🌀',
  'leg raises': '⬆️',
  'crunches': '🎯',
  'mountain climbers': '⛰️',
  'burpees': '🔥',
  'jump squats': '🦘',
  
  // Cardio exercises
  'running': '🏃',
  'cycling': '🚴',
  'swimming': '🏊',
  'jumping jacks': '🦘',
  'high knees': '🦵',
  
  // Sports/Activities
  'basketball': '🏀',
  'yoga': '🧘',
  'vinyasa yoga': '🧘',
  'pilates': '🤸',
  'tennis': '🎾',
  'soccer': '⚽',
  
  // Equipment-based
  'barbell': '🏋️',
  'dumbbell': '🏋️',
  'kettlebell': '🏋️',
  'medicine ball': '⚽',
};

// Category to emoji mapping
const categoryEmojiMap: { [key: string]: string } = {
  'strength': '💪',
  'cardio': '❤️',
  'flexibility': '🤸',
  'activity': '⚽',
  'core': '🎯',
  'endurance': '🏃',
  'power': '⚡',
  'balance': '⚖️',
};

// Difficulty to emoji mapping
const difficultyEmojiMap: { [key: string]: string } = {
  'beginner': '🟢',
  'intermediate': '🟡',
  'advanced': '🔴',
  'expert': '🟣',
};

// Muscle group to emoji mapping
const muscleGroupEmojiMap: { [key: string]: string } = {
  'chest': '💪',
  'back': '🏋️',
  'shoulders': '⬆️',
  'biceps': '💪',
  'triceps': '💪',
  'quadriceps': '🦵',
  'hamstrings': '🦵',
  'glutes': '🍑',
  'calves': '🦵',
  'core': '🎯',
  'abs': '🎯',
  'obliques': '🌀',
  'full_body': '🏋️',
  'cardio': '❤️',
  'flexibility': '🤸',
};

// Default emojis
const defaultEmojis = {
  routine: '🏋️',
  exercise: '💪',
  category: '⚡',
  difficulty: '🟡',
  muscleGroup: '💪',
};

export class EmojiMapper {
  static getRoutineEmoji(routineName: string): string {
    const lowerName = routineName.toLowerCase();
    
    // First try exact match
    if (routineEmojiMap[lowerName]) {
      return routineEmojiMap[lowerName];
    }
    
    // Then try partial matches
    for (const [key, emoji] of Object.entries(routineEmojiMap)) {
      if (lowerName.includes(key.toLowerCase())) {
        return emoji;
      }
    }
    
    return defaultEmojis.routine;
  }

  static getExerciseEmoji(exerciseName: string): string {
    const lowerName = exerciseName.toLowerCase();
    
    // First try exact match
    if (exerciseEmojiMap[lowerName]) {
      return exerciseEmojiMap[lowerName];
    }
    
    // Then try partial matches
    for (const [key, emoji] of Object.entries(exerciseEmojiMap)) {
      if (lowerName.includes(key)) {
        return emoji;
      }
    }
    
    return defaultEmojis.exercise;
  }

  static getCategoryEmoji(category: string): string {
    const lowerCategory = category.toLowerCase();
    return categoryEmojiMap[lowerCategory] || defaultEmojis.category;
  }

  static getDifficultyEmoji(difficulty: string): string {
    const lowerDifficulty = difficulty.toLowerCase();
    return difficultyEmojiMap[lowerDifficulty] || defaultEmojis.difficulty;
  }

  static getMuscleGroupEmoji(muscleGroup: string): string {
    const lowerGroup = muscleGroup.toLowerCase();
    return muscleGroupEmojiMap[lowerGroup] || defaultEmojis.muscleGroup;
  }

  static getWorkoutTypeEmoji(workoutType?: string, exerciseType?: string): string {
    if (exerciseType) {
      switch (exerciseType.toLowerCase()) {
        case 'class': return '👥';
        case 'activity': return '🏃';
        case 'timed': return '⏱️';
        case 'lift': return '🏋️';
        default: return '💪';
      }
    }

    if (workoutType) {
      switch (workoutType.toLowerCase()) {
        case 'upper_body': return '💪';
        case 'lower_body': return '🦵';
        case 'abs': return '🎯';
        case 'cardio': return '❤️';
        default: return '🏋️';
      }
    }

    return defaultEmojis.exercise;
  }

  static getComprehensiveMapping(
    routineName?: string,
    exerciseName?: string,
    category?: string,
    difficulty?: string,
    workoutType?: string,
    exerciseType?: string
  ): EmojiMapping {
    return {
      routine: routineName ? this.getRoutineEmoji(routineName) : defaultEmojis.routine,
      exercise: exerciseName ? this.getExerciseEmoji(exerciseName) : this.getWorkoutTypeEmoji(workoutType, exerciseType),
      category: category ? this.getCategoryEmoji(category) : defaultEmojis.category,
      difficulty: difficulty ? this.getDifficultyEmoji(difficulty) : defaultEmojis.difficulty,
    };
  }
}