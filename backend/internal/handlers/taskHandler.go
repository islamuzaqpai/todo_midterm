package handlers

import (
	"github.com/gin-gonic/gin"
	"midterm/internal/models"
	"midterm/internal/service"
	"strconv"
)

type TaskHandlerInterface interface {
	AddTask(c *gin.Context)
	GetAllTasks(c *gin.Context)
	UpdateTask(c *gin.Context)
	DeleteTask(c *gin.Context)
	ToggleTaskCompleted(c *gin.Context)
}

type TaskHandler struct {
	S *service.TaskService
}

func (h *TaskHandler) AddTask(c *gin.Context) {
	var task models.Task

	err := c.BindJSON(&task)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad Request"})
		return
	}

	err = h.S.AddTask(task)
	if err != nil {
		c.JSON(500, gin.H{"error": "Internal Server Error"})
		return
	}

	c.JSON(200, gin.H{"status": "ok"})
}

func (h *TaskHandler) GetAllTasks(c *gin.Context) {
	tasks, err := h.S.GetAllTasks()
	if err != nil {
		c.JSON(500, gin.H{"error": "Internal Server Error"})
		return
	}

	c.JSON(200, tasks)
}

func (h *TaskHandler) UpdateTask(c *gin.Context) {
	idStr := c.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}
	var task models.Task

	err = c.BindJSON(&task)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad Request"})
		return
	}

	err = h.S.UpdateTask(id, &task)
	if err != nil {
		c.JSON(500, gin.H{"error": "Internal Server Error"})
		return
	}

	c.JSON(200, gin.H{"status": "ok"})
}

func (h *TaskHandler) DeleteTask(c *gin.Context) {
	idStr := c.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid id"})
		return
	}

	err = h.S.Repo.DeleteTask(id)
	if err != nil {
		c.JSON(500, gin.H{"error": "Internal Server Error"})
		return
	}

	c.JSON(200, gin.H{"status": "ok"})
}

func (h *TaskHandler) ToggleTaskCompleted(c *gin.Context) {
	idStr := c.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid id"})
		return
	}

	var task models.Task

	err = c.BindJSON(&task)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad Request"})
		return
	}

	err = h.S.ToggleTaskCompleted(id, task.Completed)
	if err != nil {
		c.JSON(500, gin.H{"error": "Internal Server Error"})
		return
	}

	c.JSON(200, gin.H{"status": "ok"})
}
