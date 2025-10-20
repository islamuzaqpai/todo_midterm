package service

import (
	"fmt"
	"midterm/internal/models"
	"midterm/internal/repository"
)

type TaskServiceInterface interface {
	AddTask(task models.Task) error
	GetAllTasks() ([]models.Task, error)
	UpdateTask(id int, newTask *models.Task) error
	DeleteTask(id int) error
	ToggleTaskCompleted(id int, completed bool) error
}

type TaskService struct {
	Repo *repository.TaskRepository
}

func (s *TaskService) AddTask(task models.Task) error {
	err := s.Repo.AddTask(&task)
	if err != nil {
		return fmt.Errorf("failed to add task: %w", err)
	}

	return nil
}

func (s *TaskService) GetAllTasks() ([]models.Task, error) {
	tasks, err := s.Repo.GetAllTasks()
	if err != nil {
		return nil, fmt.Errorf("failed to receive all tasks: %w", err)
	}

	return tasks, nil
}

func (s *TaskService) UpdateTask(id int, newTask *models.Task) error {
	err := s.Repo.UpdateTask(id, newTask)
	if err != nil {
		return fmt.Errorf("failed to update task: %w", err)
	}

	return nil
}

func (s *TaskService) DeleteTask(id int) error {
	err := s.Repo.DeleteTask(id)

	if err != nil {
		return fmt.Errorf("failed to delete task: %w", err)
	}

	return nil
}

func (s *TaskService) ToggleTaskCompleted(id int, completed bool) error {
	err := s.Repo.ToggleTaskCompleted(id, completed)
	if err != nil {
		return fmt.Errorf("failed to update task: %w", err)
	}

	return nil
}
