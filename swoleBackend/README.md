# Swole Backend - Go REST API

A Go REST API backend for the Swole workout tracking application, connected to PostgreSQL database.

## Features

- **PostgreSQL Database**: Stores routines, workouts, schedules, and user progress
- **REST API**: Full CRUD operations for workout data
- **CORS Enabled**: Ready for mobile app integration
- **Auto-Migration**: Creates tables automatically on startup
- **Seed Data**: Populates database with sample workouts matching frontend mock data
- **Docker Compose**: Easy PostgreSQL setup

## Project Structure

```
swoleBackend/
├── api/
│   ├── models.go       # Database models and types
│   ├── database.go     # DB connection and table creation
│   ├── handlers.go     # HTTP request handlers
│   └── seed.go         # Sample data seeding
├── main.go             # Server entry point
├── docker-compose.yml  # PostgreSQL setup
├── .env.example        # Environment variables template
└── README.md
```

## Quick Start

### 1. Start PostgreSQL with Docker
```bash
docker-compose up -d
```

### 2. Install Dependencies
```bash
go mod tidy
```

### 3. Run the Server
```bash
go run main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Workout Data
- `GET /api/week-schedule?user_id={id}` - Get weekly workout schedule
- `GET /api/routines` - Get all workout routines
- `GET /api/routines/{id}` - Get specific routine with workouts
- `POST /api/workouts/{id}/progress` - Update workout progress
- `GET /api/progress?user_id={id}&workout_id={id}` - Get user progress history

## Database Schema

### Tables
- **users**: User accounts
- **routines**: Workout routines (e.g., "Upper Body Power")
- **workouts**: Individual exercises within routines
- **week_schedules**: Weekly workout plans
- **day_schedules**: Daily workout assignments
- **day_routines**: Mapping of routines to specific days
- **user_progress**: User workout progress tracking

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=swole_db
PORT=8080
```

## Sample Data

The API includes seed data matching the frontend mock data:

**Routines:**
- Upper Body Power (Bench Press, Pull-ups, Shoulder Press)
- Leg Day (Squats, Romanian Deadlifts, Leg Press)
- Core Circuit (Plank, Russian Twists, Leg Raises)
- Basketball Practice (90min activity)
- Yoga Class (60min class)

**Weekly Schedule:**
- Monday: Upper Body Power
- Tuesday: Leg Day
- Wednesday: Yoga Class
- Thursday: Upper Body Power
- Friday: Leg Day
- Saturday: Core Circuit + Basketball Practice
- Sunday: Rest Day

## Database Management

**View Database:**
- Access Adminer at `http://localhost:8081`
- Server: `postgres`, Username: `postgres`, Password: `postgres`, Database: `swole_db`

**Reset Database:**
```bash
docker-compose down -v  # Remove data
docker-compose up -d    # Restart with fresh data
```

## Development

**Install Dependencies:**
```bash
go mod tidy
```

**Run with Auto-Reload:** (install air first: `go install github.com/cosmtrek/air@latest`)
```bash
air
```

**Build for Production:**
```bash
go build -o swole-api main.go
```

## Integration with Frontend

The API is designed to work seamlessly with the React Native Expo frontend:

1. **Start backend**: `go run main.go` (port 8080)
2. **Start frontend**: `cd ../swoleMobile && npx expo start`
3. **Update frontend API URL** to point to `http://localhost:8080/api`

## Production Deployment

1. Set environment variables for production database
2. Update CORS settings to restrict origins
3. Build binary: `go build -o swole-api main.go`
4. Deploy with PostgreSQL instance

## Dependencies

- **Gorilla Mux**: HTTP router
- **lib/pq**: PostgreSQL driver
- **godotenv**: Environment variable loading
- **rs/cors**: CORS middleware