package repository

import (
	"fmt"
	"gorm.io/gorm"
	"midterm/internal/models"
)

type TaskRepository struct {
	Conn *gorm.DB
}

type TaskRepositoryInterface interface {
	AddTask(task *models.Task) error
	GetAllTasks() ([]models.Task, error)
	UpdateTask(id int, newTask *models.Task) error
	DeleteTask(id int) error
	FindById(id int) (models.Task, error)
	ToggleTaskCompleted(id int, completed bool) error
}

func (repo *TaskRepository) AddTask(task *models.Task) error {
	res := repo.Conn.Create(&task)
	if res.Error != nil {
		return fmt.Errorf("failed to add task: %w", res.Error)
	}

	return nil
}

func (repo *TaskRepository) GetAllTasks() ([]models.Task, error) {
	var tasks []models.Task

	res := repo.Conn.Find(&tasks)
	if res.Error != nil {
		return nil, fmt.Errorf("failed to receive all tasks: %w", res.Error)
	}

	return tasks, nil
}

func (repo *TaskRepository) FindById(id int) (models.Task, error) {
	var task models.Task

	res := repo.Conn.First(&task, id)
	if res.Error != nil {
		return models.Task{}, fmt.Errorf("failed to find task: %w", res.Error)
	}

	return task, nil
}

func (repo *TaskRepository) UpdateTask(id int, newTask *models.Task) error {
	task, err := repo.FindById(id)

	if err != nil {
		return fmt.Errorf("failed to find task: %w", err)
	}

	task.Title = newTask.Title
	task.Description = newTask.Description
	task.Deadline = newTask.Deadline

	res := repo.Conn.Save(&task)
	if res.Error != nil {
		return fmt.Errorf("failed to find task: %w", res.Error)
	}

	return nil
}

func (repo *TaskRepository) DeleteTask(id int) error {
	task, err := repo.FindById(id)
	if err != nil {
		return fmt.Errorf("failed to find task: %w", err)
	}

	res := repo.Conn.Delete(&task)
	if res.Error != nil {
		return fmt.Errorf("failed to delete task: %w", res.Error)
	}

	return nil
}

func (repo *TaskRepository) ToggleTaskCompleted(id int, completed bool) error {
	var task models.Task

	res := repo.Conn.First(&task, id)
	if res.Error != nil {
		return fmt.Errorf("failed to find task: %w", res.Error)
	}

	task.Completed = completed

	res = repo.Conn.Save(&task)
	if res.Error != nil {
		return fmt.Errorf("failed to update completed: %w", res.Error)
	}

	return nil
}
