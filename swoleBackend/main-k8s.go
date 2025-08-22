package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/matthewmyrick/swole/swoleBackend/api"
)

func main() {
	// Load environment variables (optional in K8s, usually handled by ConfigMaps/Secrets)
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables from K8s")
	}

	// Initialize database connection only
	// Tables are created by K8s init scripts
	db, err := api.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	log.Println("Successfully connected to PostgreSQL database!")
	log.Println("Assuming database schema is initialized by K8s init scripts")

	// Create router
	r := mux.NewRouter()

	// API routes
	apiRouter := r.PathPrefix("/api").Subrouter()
	
	// Workout routes
	apiRouter.HandleFunc("/week-schedule", db.GetWeekSchedule).Methods("GET")
	apiRouter.HandleFunc("/routines", db.GetRoutines).Methods("GET")
	apiRouter.HandleFunc("/routines/{id}", db.GetRoutine).Methods("GET")
	apiRouter.HandleFunc("/workouts/{id}/progress", db.UpdateWorkoutProgress).Methods("POST")
	apiRouter.HandleFunc("/progress", db.GetUserProgress).Methods("GET")

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Health check with database connectivity
	r.HandleFunc("/health/db", func(w http.ResponseWriter, r *http.Request) {
		err := db.Ping()
		if err != nil {
			http.Error(w, "Database connection failed", http.StatusServiceUnavailable)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Database OK"))
	}).Methods("GET")

	// Setup CORS for mobile app
	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"*", // For development - restrict in production
		},
		AllowedMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
			http.MethodOptions,
		},
		AllowedHeaders: []string{
			"Content-Type",
			"Authorization",
			"X-Requested-With",
		},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Swole API server starting on port %s", port)
	log.Printf("Health check: http://localhost:%s/health", port)
	log.Printf("Database health: http://localhost:%s/health/db", port)
	log.Printf("API endpoints: http://localhost:%s/api/", port)
	
	log.Fatal(http.ListenAndServe(":"+port, handler))
}