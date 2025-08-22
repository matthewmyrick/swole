package api

import (
	"database/sql"
	"time"
)

type WorkoutType string
type ExerciseType string

const (
	LowerBody WorkoutType = "lower_body"
	UpperBody WorkoutType = "upper_body"
	Abs       WorkoutType = "abs"
	
	Lift     ExerciseType = "lift"
	Timed    ExerciseType = "timed"
	Class    ExerciseType = "class"
	Activity ExerciseType = "activity"
)

type Workout struct {
	ID           string         `json:"id"`
	Name         string         `json:"name"`
	Type         *WorkoutType   `json:"type"`
	ExerciseType ExerciseType   `json:"exerciseType"`
	Weight       *float64       `json:"weight,omitempty"`
	Time         *int           `json:"time,omitempty"`
	Reps         *int           `json:"reps,omitempty"`
	Sets         *int           `json:"sets,omitempty"`
	Description  *string        `json:"description,omitempty"`
	UserWeight   *float64       `json:"userWeight,omitempty"`
	UserTime     *int           `json:"userTime,omitempty"`
	RoutineID    string         `json:"routine_id"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}

type Routine struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	Workouts    []Workout `json:"workouts"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type DaySchedule struct {
	ID        string    `json:"id"`
	Day       string    `json:"day"`
	WeekID    string    `json:"week_id"`
	Routines  []Routine `json:"routines"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type WeekSchedule struct {
	ID        string        `json:"id"`
	UserID    string        `json:"user_id"`
	WeekStart time.Time     `json:"week_start"`
	Schedule  []DaySchedule `json:"schedule"`
	CreatedAt time.Time     `json:"created_at"`
	UpdatedAt time.Time     `json:"updated_at"`
}

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UserProgress struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	WorkoutID string    `json:"workout_id"`
	Weight    *float64  `json:"weight,omitempty"`
	Time      *int      `json:"time,omitempty"`
	Date      time.Time `json:"date"`
	CreatedAt time.Time `json:"created_at"`
}

type DB struct {
	*sql.DB
}