package app

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"midterm/internal/database"
	"midterm/internal/handlers"
	"midterm/internal/middleware"
	"midterm/internal/repository"
	"midterm/internal/service"
)

func Run() {
	conn, err := database.Connect()
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}

	sqlDb, err := conn.DB()
	if err != nil {
		log.Fatalf("Failed to get sql.DB: %v", err)
	}

	defer sqlDb.Close()

	fmt.Println("Success!", conn)

	//------------------------------------------------------------
	repo := repository.TaskRepository{Conn: conn}
	s := service.TaskService{Repo: &repo}
	h := handlers.TaskHandler{S: &s}

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	router.POST("/task", h.AddTask)
	router.GET("/task", h.GetAllTasks)
	router.PUT("/task/:id", h.UpdateTask)
	router.DELETE("/task/:id", h.DeleteTask)
	router.PATCH("/task/:id", h.ToggleTaskCompleted)

	err = router.Run(":8080")
	if err != nil {
		log.Fatalf("Failed to run: %v", err)
	}
}
