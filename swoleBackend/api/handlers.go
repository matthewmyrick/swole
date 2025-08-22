package api

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"github.com/gorilla/mux"
	"log"
)

func (db *DB) GetWeekSchedule(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		userID = "default" // For now, use a default user
	}
	
	// Get current week schedule
	query := `
		SELECT ws.id, ws.week_start, ds.id, ds.day, r.id, r.name, r.description
		FROM week_schedules ws
		LEFT JOIN day_schedules ds ON ds.week_id = ws.id
		LEFT JOIN day_routines dr ON dr.day_id = ds.id
		LEFT JOIN routines r ON r.id = dr.routine_id
		WHERE ws.user_id = (SELECT id FROM users WHERE email = $1 OR id::text = $1 LIMIT 1)
		ORDER BY ws.week_start DESC, 
			CASE ds.day
				WHEN 'Monday' THEN 1
				WHEN 'Tuesday' THEN 2
				WHEN 'Wednesday' THEN 3
				WHEN 'Thursday' THEN 4
				WHEN 'Friday' THEN 5
				WHEN 'Saturday' THEN 6
				WHEN 'Sunday' THEN 7
			END,
			dr.position
		LIMIT 100`
	
	rows, err := db.Query(query, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	
	weekSchedule := WeekSchedule{
		Schedule: []DaySchedule{},
	}
	
	dayMap := make(map[string]*DaySchedule)
	days := []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
	
	// Initialize all days
	for _, day := range days {
		ds := DaySchedule{
			Day:      day,
			Routines: []Routine{},
		}
		weekSchedule.Schedule = append(weekSchedule.Schedule, ds)
		dayMap[day] = &weekSchedule.Schedule[len(weekSchedule.Schedule)-1]
	}
	
	for rows.Next() {
		var wsID, weekStart, dsID, dsDay sql.NullString
		var rID, rName, rDesc sql.NullString
		
		err := rows.Scan(&wsID, &weekStart, &dsID, &dsDay, &rID, &rName, &rDesc)
		if err != nil {
			continue
		}
		
		if dsDay.Valid && rID.Valid {
			if day, exists := dayMap[dsDay.String]; exists {
				routine := Routine{
					ID:   rID.String,
					Name: rName.String,
				}
				if rDesc.Valid {
					routine.Description = &rDesc.String
				}
				
				// Get workouts for this routine with user progress
				routine.Workouts = db.getWorkoutsForRoutineWithProgress(rID.String, userID)
				day.Routines = append(day.Routines, routine)
			}
		}
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(weekSchedule)
}

func (db *DB) getWorkoutsForRoutine(routineID string) []Workout {
	return db.getWorkoutsForRoutineWithProgress(routineID, "")
}

func (db *DB) getWorkoutsForRoutineWithProgress(routineID string, userID string) []Workout {
	// Get the actual user UUID
	var actualUserID string
	if userID != "" {
		// First try to get user by email, then by ID
		err := db.QueryRow("SELECT id FROM users WHERE email = $1 LIMIT 1", userID).Scan(&actualUserID)
		if err != nil {
			// If not found by email, try by ID
			err = db.QueryRow("SELECT id FROM users WHERE id::text = $1 LIMIT 1", userID).Scan(&actualUserID)
			if err != nil {
				// Default to first user if no specific user found
				db.QueryRow("SELECT id FROM users LIMIT 1").Scan(&actualUserID)
			}
		}
	} else {
		// Default to first user
		db.QueryRow("SELECT id FROM users LIMIT 1").Scan(&actualUserID)
	}

	query := `
		SELECT w.id, w.name, w.type, w.exercise_type, w.weight, w.time, w.reps, w.sets, w.description,
		       up.weight as user_weight, up.time as user_time
		FROM workouts w
		LEFT JOIN user_progress up ON w.id = up.workout_id 
			AND up.user_id = $2
			AND up.date = CURRENT_DATE
		WHERE w.routine_id = $1
		ORDER BY w.created_at`
	
	rows, err := db.Query(query, routineID, actualUserID)
	if err != nil {
		return []Workout{}
	}
	defer rows.Close()
	
	var workouts []Workout
	for rows.Next() {
		var w Workout
		var workoutType, description sql.NullString
		var weight, userWeight sql.NullFloat64
		var time, userTime, reps, sets sql.NullInt64
		
		err := rows.Scan(&w.ID, &w.Name, &workoutType, &w.ExerciseType,
			&weight, &time, &reps, &sets, &description, &userWeight, &userTime)
		if err != nil {
			continue
		}
		
		if workoutType.Valid {
			wt := WorkoutType(workoutType.String)
			w.Type = &wt
		}
		if weight.Valid {
			w.Weight = &weight.Float64
		}
		if time.Valid {
			t := int(time.Int64)
			w.Time = &t
		}
		if reps.Valid {
			r := int(reps.Int64)
			w.Reps = &r
		}
		if sets.Valid {
			s := int(sets.Int64)
			w.Sets = &s
		}
		if description.Valid {
			w.Description = &description.String
		}
		
		// Add user progress if available
		if userWeight.Valid {
			w.UserWeight = &userWeight.Float64
		}
		if userTime.Valid {
			t := int(userTime.Int64)
			w.UserTime = &t
		}
		
		workouts = append(workouts, w)
	}
	
	return workouts
}

func (db *DB) GetRoutines(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	
	query := `SELECT id, name, description FROM routines ORDER BY name`
	
	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	
	var routines []Routine
	for rows.Next() {
		var routine Routine
		var description sql.NullString
		
		err := rows.Scan(&routine.ID, &routine.Name, &description)
		if err != nil {
			continue
		}
		
		if description.Valid {
			routine.Description = &description.String
		}
		
		// Get workouts for each routine with user progress
		routine.Workouts = db.getWorkoutsForRoutineWithProgress(routine.ID, userID)
		routines = append(routines, routine)
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(routines)
}

func (db *DB) GetRoutine(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	routineID := vars["id"]
	userID := r.URL.Query().Get("user_id")
	
	var routine Routine
	var description sql.NullString
	
	query := `SELECT id, name, description FROM routines WHERE id = $1`
	err := db.QueryRow(query, routineID).Scan(&routine.ID, &routine.Name, &description)
	if err != nil {
		http.Error(w, "Routine not found", http.StatusNotFound)
		return
	}
	
	if description.Valid {
		routine.Description = &description.String
	}
	
	routine.Workouts = db.getWorkoutsForRoutineWithProgress(routineID, userID)
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(routine)
}

func (db *DB) UpdateWorkoutProgress(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	workoutID := vars["id"]
	
	var update struct {
		UserID     string   `json:"user_id"`
		UserWeight *float64 `json:"userWeight"`
		UserTime   *int     `json:"userTime"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	// Get the actual user UUID
	var actualUserID string
	if update.UserID != "" {
		// First try to get user by email, then by ID
		err := db.QueryRow("SELECT id FROM users WHERE email = $1 LIMIT 1", update.UserID).Scan(&actualUserID)
		if err != nil {
			// If not found by email, try by ID
			err = db.QueryRow("SELECT id FROM users WHERE id::text = $1 LIMIT 1", update.UserID).Scan(&actualUserID)
			if err != nil {
				http.Error(w, "User not found", http.StatusBadRequest)
				return
			}
		}
	} else {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}
	
	// Insert progress record
	query := `
		INSERT INTO user_progress (user_id, workout_id, weight, time, date)
		VALUES ($1, $2, $3, $4, CURRENT_DATE)
		ON CONFLICT (user_id, workout_id, date) 
		DO UPDATE SET weight = $3, time = $4`
	
	_, err := db.Exec(query, actualUserID, workoutID, update.UserWeight, update.UserTime)
	if err != nil {
		log.Printf("Error updating progress: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

func (db *DB) GetUserProgress(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	workoutID := r.URL.Query().Get("workout_id")
	
	// Get the actual user UUID
	var actualUserID string
	if userID != "" {
		// First try to get user by email, then by ID
		err := db.QueryRow("SELECT id FROM users WHERE email = $1 LIMIT 1", userID).Scan(&actualUserID)
		if err != nil {
			// If not found by email, try by ID
			err = db.QueryRow("SELECT id FROM users WHERE id::text = $1 LIMIT 1", userID).Scan(&actualUserID)
			if err != nil {
				http.Error(w, "User not found", http.StatusBadRequest)
				return
			}
		}
	} else {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}
	
	query := `
		SELECT weight, time, date 
		FROM user_progress 
		WHERE user_id = $1 AND workout_id = $2
		ORDER BY date DESC
		LIMIT 10`
	
	rows, err := db.Query(query, actualUserID, workoutID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	
	var progress []map[string]interface{}
	for rows.Next() {
		var weight sql.NullFloat64
		var time sql.NullInt64
		var date string
		
		err := rows.Scan(&weight, &time, &date)
		if err != nil {
			continue
		}
		
		p := map[string]interface{}{
			"date": date,
		}
		if weight.Valid {
			p["weight"] = weight.Float64
		}
		if time.Valid {
			p["time"] = time.Int64
		}
		
		progress = append(progress, p)
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(progress)
}