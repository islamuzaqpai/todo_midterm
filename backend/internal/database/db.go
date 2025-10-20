package database

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() (*gorm.DB, error) {
	dsn := "host=host.docker.internal user=postgres password=0303 dbname=midterm_db port=5432 sslmode=disable"
	conn, err := gorm.Open(postgres.Open(dsn))
	if err != nil {
		return nil, fmt.Errorf("Failed to connect to db: %w", err)
	}

	return conn, nil
}
