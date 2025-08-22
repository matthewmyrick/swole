package api

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func InitDB() (*DB, error) {
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}
	
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432"
	}
	
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "postgres"
	}
	
	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		password = "postgres"
	}
	
	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "swole_db"
	}
	
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, err
	}
	
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	
	log.Println("Successfully connected to PostgreSQL database!")
	
	return &DB{db}, nil
}

func (db *DB) CreateTables() error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			email VARCHAR(255) UNIQUE NOT NULL,
			name VARCHAR(255) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		
		`CREATE TABLE IF NOT EXISTS routines (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name VARCHAR(255) NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		
		`CREATE TABLE IF NOT EXISTS workouts (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
			name VARCHAR(255) NOT NULL,
			type VARCHAR(50),
			exercise_type VARCHAR(50) NOT NULL,
			weight DECIMAL,
			time INTEGER,
			reps INTEGER,
			sets INTEGER,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		
		`CREATE TABLE IF NOT EXISTS week_schedules (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id UUID REFERENCES users(id) ON DELETE CASCADE,
			week_start DATE NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		
		`CREATE TABLE IF NOT EXISTS day_schedules (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			week_id UUID REFERENCES week_schedules(id) ON DELETE CASCADE,
			day VARCHAR(20) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		
		`CREATE TABLE IF NOT EXISTS day_routines (
			day_id UUID REFERENCES day_schedules(id) ON DELETE CASCADE,
			routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
			position INTEGER DEFAULT 0,
			PRIMARY KEY (day_id, routine_id)
		)`,
		
		`CREATE TABLE IF NOT EXISTS user_progress (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id UUID REFERENCES users(id) ON DELETE CASCADE,
			workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
			weight DECIMAL,
			time INTEGER,
			date DATE NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(user_id, workout_id, date)
		)`,
	}
	
	for _, query := range queries {
		_, err := db.Exec(query)
		if err != nil {
			return fmt.Errorf("error creating table: %v", err)
		}
	}
	
	log.Println("All tables created successfully!")
	return nil
}