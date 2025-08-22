package api

import (
	"log"
)

func (db *DB) SeedData() error {
	// Check if data already exists
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM routines").Scan(&count)
	if err != nil {
		return err
	}
	
	if count > 0 {
		log.Println("Data already exists, skipping seed")
		return nil
	}
	
	// Create default user
	var userID string
	err = db.QueryRow(`
		INSERT INTO users (email, name) 
		VALUES ('user@example.com', 'Default User') 
		RETURNING id`).Scan(&userID)
	if err != nil {
		return err
	}
	
	// Create routines and workouts
	routines := []struct {
		Name        string
		Description string
		Workouts    []struct {
			Name         string
			Type         *string
			ExerciseType string
			Weight       *float64
			Time         *int
			Reps         *int
			Sets         *int
			Description  *string
		}
	}{
		{
			Name:        "Upper Body Power",
			Description: "Intense upper body workout focusing on strength",
			Workouts: []struct {
				Name         string
				Type         *string
				ExerciseType string
				Weight       *float64
				Time         *int
				Reps         *int
				Sets         *int
				Description  *string
			}{
				{
					Name:         "Bench Press",
					Type:         stringPtr("upper_body"),
					ExerciseType: "lift",
					Weight:       float64Ptr(135),
					Reps:         intPtr(8),
					Sets:         intPtr(4),
					Description:  stringPtr("Flat bench with barbell"),
				},
				{
					Name:         "Pull-ups",
					Type:         stringPtr("upper_body"),
					ExerciseType: "lift",
					Reps:         intPtr(10),
					Sets:         intPtr(3),
					Description:  stringPtr("Wide grip pull-ups"),
				},
				{
					Name:         "Shoulder Press",
					Type:         stringPtr("upper_body"),
					ExerciseType: "lift",
					Weight:       float64Ptr(95),
					Reps:         intPtr(10),
					Sets:         intPtr(3),
					Description:  stringPtr("Overhead press with barbell"),
				},
			},
		},
		{
			Name:        "Leg Day",
			Description: "Complete lower body workout",
			Workouts: []struct {
				Name         string
				Type         *string
				ExerciseType string
				Weight       *float64
				Time         *int
				Reps         *int
				Sets         *int
				Description  *string
			}{
				{
					Name:         "Squats",
					Type:         stringPtr("lower_body"),
					ExerciseType: "lift",
					Weight:       float64Ptr(225),
					Reps:         intPtr(8),
					Sets:         intPtr(4),
					Description:  stringPtr("Back squats with proper depth"),
				},
				{
					Name:         "Romanian Deadlifts",
					Type:         stringPtr("lower_body"),
					ExerciseType: "lift",
					Weight:       float64Ptr(185),
					Reps:         intPtr(10),
					Sets:         intPtr(3),
					Description:  stringPtr("Focus on hamstring stretch"),
				},
				{
					Name:         "Leg Press",
					Type:         stringPtr("lower_body"),
					ExerciseType: "lift",
					Weight:       float64Ptr(360),
					Reps:         intPtr(12),
					Sets:         intPtr(3),
					Description:  stringPtr("Full range of motion"),
				},
			},
		},
		{
			Name:        "Core Circuit",
			Description: "Abs and core strengthening",
			Workouts: []struct {
				Name         string
				Type         *string
				ExerciseType string
				Weight       *float64
				Time         *int
				Reps         *int
				Sets         *int
				Description  *string
			}{
				{
					Name:         "Plank",
					Type:         stringPtr("abs"),
					ExerciseType: "timed",
					Time:         intPtr(60),
					Sets:         intPtr(3),
					Description:  stringPtr("Hold plank position"),
				},
				{
					Name:         "Russian Twists",
					Type:         stringPtr("abs"),
					ExerciseType: "lift",
					Weight:       float64Ptr(25),
					Reps:         intPtr(20),
					Sets:         intPtr(3),
					Description:  stringPtr("With medicine ball"),
				},
				{
					Name:         "Leg Raises",
					Type:         stringPtr("abs"),
					ExerciseType: "lift",
					Reps:         intPtr(15),
					Sets:         intPtr(3),
					Description:  stringPtr("Hanging leg raises"),
				},
			},
		},
		{
			Name:        "Basketball Practice",
			Description: "Weekly basketball session",
			Workouts: []struct {
				Name         string
				Type         *string
				ExerciseType string
				Weight       *float64
				Time         *int
				Reps         *int
				Sets         *int
				Description  *string
			}{
				{
					Name:         "Basketball",
					Type:         nil,
					ExerciseType: "activity",
					Time:         intPtr(90),
					Description:  stringPtr("Full court games and drills"),
				},
			},
		},
		{
			Name:        "Yoga Class",
			Description: "Flexibility and mindfulness",
			Workouts: []struct {
				Name         string
				Type         *string
				ExerciseType string
				Weight       *float64
				Time         *int
				Reps         *int
				Sets         *int
				Description  *string
			}{
				{
					Name:         "Vinyasa Yoga",
					Type:         nil,
					ExerciseType: "class",
					Time:         intPtr(60),
					Description:  stringPtr("Flow yoga class"),
				},
			},
		},
	}
	
	var routineIDs []string
	
	// Insert routines and workouts
	for _, routine := range routines {
		var routineID string
		err = db.QueryRow(`
			INSERT INTO routines (name, description) 
			VALUES ($1, $2) 
			RETURNING id`, 
			routine.Name, routine.Description).Scan(&routineID)
		if err != nil {
			return err
		}
		
		routineIDs = append(routineIDs, routineID)
		
		// Insert workouts for this routine
		for _, workout := range routine.Workouts {
			_, err = db.Exec(`
				INSERT INTO workouts (routine_id, name, type, exercise_type, weight, time, reps, sets, description)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
				routineID, workout.Name, workout.Type, workout.ExerciseType,
				workout.Weight, workout.Time, workout.Reps, workout.Sets, workout.Description)
			if err != nil {
				return err
			}
		}
	}
	
	// Create week schedule
	var weekID string
	err = db.QueryRow(`
		INSERT INTO week_schedules (user_id, week_start) 
		VALUES ($1, CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER) 
		RETURNING id`, userID).Scan(&weekID)
	if err != nil {
		return err
	}
	
	// Create day schedules with routines
	days := []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
	scheduleMap := map[string][]int{
		"Monday":    {0},       // Upper Body Power
		"Tuesday":   {1},       // Leg Day
		"Wednesday": {4},       // Yoga Class
		"Thursday":  {0},       // Upper Body Power
		"Friday":    {1},       // Leg Day
		"Saturday":  {2, 3},    // Core Circuit, Basketball Practice
		"Sunday":    {},        // Rest day
	}
	
	for _, day := range days {
		var dayID string
		err = db.QueryRow(`
			INSERT INTO day_schedules (week_id, day) 
			VALUES ($1, $2) 
			RETURNING id`, weekID, day).Scan(&dayID)
		if err != nil {
			return err
		}
		
		// Add routines to this day
		if routineIndices, exists := scheduleMap[day]; exists {
			for pos, routineIndex := range routineIndices {
				if routineIndex < len(routineIDs) {
					_, err = db.Exec(`
						INSERT INTO day_routines (day_id, routine_id, position)
						VALUES ($1, $2, $3)`,
						dayID, routineIDs[routineIndex], pos)
					if err != nil {
						return err
					}
				}
			}
		}
	}
	
	log.Println("Seed data inserted successfully!")
	return nil
}

func stringPtr(s string) *string {
	return &s
}

func float64Ptr(f float64) *float64 {
	return &f
}

func intPtr(i int) *int {
	return &i
}