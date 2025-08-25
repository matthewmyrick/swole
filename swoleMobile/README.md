# Swole Mobile App 💪

A beautiful React Native workout tracking app with modern UI and comprehensive backend integration.

## ✨ Features

### 🎨 **Modern UI Design**
- Beautiful gradient backgrounds and animations
- Custom icon system with emoji fallbacks
- Smooth transitions and micro-interactions
- Professional typography and spacing
- Glass-morphism effects for modals

### 📱 **Core Functionality**
- **Weekly Schedule View** - See your workout plan for each day
- **Routine Management** - Browse and select workout routines
- **Progress Tracking** - Update weights, times, and reps
- **Exercise Details** - Detailed instructions and muscle groups
- **Rest Day Handling** - Dedicated rest and recovery UI

### 🔄 **Backend Integration**
- **Robust API Service** with fallback to mock data
- **Real-time Progress Updates** to Go backend + PostgreSQL
- **YAML-based Routine Configuration** from `swoleBackend/data/jobs/routines/routines.yaml`
- **Automatic Emoji Mapping** for all exercises and routines

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or physical device

### Installation
```bash
cd swoleMobile
npm install
```

### Running the App
```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android
```

## 🏗️ Backend Setup

Your backend is located at `../swoleBackend/` and provides:

### API Endpoints
- `GET /api/week-schedule` - Weekly workout schedule
- `GET /api/routines` - All available routines  
- `GET /api/routines/{id}` - Specific routine details
- `POST /api/workouts/{id}/progress` - Update workout progress
- `GET /api/progress` - User progress history
- `GET /health` - Health check

### Starting the Backend
```bash
cd ../swoleBackend

# Using Docker (recommended)
docker-compose up -d

# Or run directly (requires PostgreSQL)
go run main.go
```

The app will automatically:
1. Try to connect to the backend at `http://localhost:8080`
2. Fall back to mock data if backend is unavailable
3. Show warnings in console when using fallback mode

## 📊 Data Flow

```
YAML Routines → Go Backend → PostgreSQL → REST API → React Native App
     ↓              ↓            ↓            ↓            ↓
routines.yaml → Seed Data → Database → JSON API → Beautiful UI
```

### Routine Configuration
All workout routines are defined in:
```
../swoleBackend/data/jobs/routines/routines.yaml
```

The app automatically maps:
- **Routine names** → **Emojis** (Upper Body Power → 💪)
- **Exercise types** → **Icons** (Squats → ⬇️, Basketball → 🏀)
- **Categories** → **Colors** (Strength → Blue, Cardio → Red)
- **Difficulty** → **Badges** (Beginner → 🟢, Advanced → 🔴)

## 🎯 Key Components

### Screens
- **WeekView** - Weekly schedule with day cards
- **RoutinesList** - Browse all available routines
- **RoutineDetail** - Exercise details and progress tracking
- **DayDetail** - Daily workout overview

### Services
- **ApiService** - Smart API client with fallback logic
- **EmojiMapper** - Comprehensive emoji mapping system

### Theme System
- **Unified colors** with gradients and shadows
- **Typography scale** for consistent text
- **Spacing system** for layout consistency

## 🛠️ Configuration

### API Configuration
Update `src/config/env.ts`:
```typescript
export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
};
```

### Mock Data Mode
To force mock data (useful for development):
```typescript
import { ApiService } from './src/services/api';
ApiService.setMockDataMode(true);
```

## 🎨 Emoji Mapping

The app includes 60+ emoji mappings:
- **Routines**: Upper Body Power → 💪, Yoga → 🧘, Basketball → 🏀
- **Exercises**: Squats → ⬇️, Plank → 🏁, Burpees → 🔥
- **Categories**: Strength → 💪, Cardio → ❤️, Flexibility → 🤸
- **Equipment**: Barbell → 🏋️, Medicine Ball → ⚽, Yoga Mat → 🧘

## 📱 Platform Support

- **iOS**: Full support with native navigation gestures
- **Android**: Material Design components and behaviors
- **Web**: Responsive design for development/testing

## 🔧 Development

### Folder Structure
```
src/
├── components/     # Reusable UI components
├── screens/       # Main app screens
├── services/      # API and data services  
├── theme/         # Colors, typography, spacing
├── types/         # TypeScript type definitions
├── utils/         # Helper functions and emoji mapping
└── data/          # Mock data and fixtures
```

### Adding New Routines
1. Update `swoleBackend/data/jobs/routines/routines.yaml`
2. Restart the backend to reload data
3. Add emoji mappings in `src/utils/emojiMapper.ts` (optional)

### Customizing UI
- **Colors**: Edit `src/theme/colors.ts`
- **Icons**: Update `src/components/Icon.tsx`
- **Animations**: Modify screen components directly

## 🐛 Troubleshooting

### Backend Connection Issues
- Check if backend is running: `curl http://localhost:8080/health`
- Verify database connection in backend logs
- App will show console warnings and use mock data as fallback

### Icon Display Issues
- Icons are text-based emojis for maximum compatibility
- If icons show as "?", check device emoji support
- Fallback icons are provided for all components

### Performance
- Animations use native driver for 60fps
- Images and gradients are optimized
- API calls include timeout and retry logic

## 📈 Next Steps

1. **Authentication** - Add user login/signup
2. **Push Notifications** - Workout reminders
3. **Analytics** - Progress tracking and charts
4. **Social Features** - Share workouts and progress
5. **Offline Mode** - Local data caching

---

**Happy Lifting! 💪🚀**