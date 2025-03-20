# Web Quiz Master

A Spring Boot application for creating and managing interactive quizzes with video content.

## Deployment Options

### Option 1: Deploy to Render (Recommended for Preview)

1. Create a free account on [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/*.jar`
   - Environment Variables:
     - `SPRING_DATASOURCE_URL`: Your PostgreSQL database URL
     - `SPRING_DATASOURCE_USERNAME`: Your database username
     - `SPRING_DATASOURCE_PASSWORD`: Your database password

### Option 2: Local Development with Docker

1. Install Docker Desktop
2. Run the following commands:
   ```bash
   docker-compose up --build
   ```
3. Access the application at http://localhost:8080/api

### Option 3: Deploy to Railway

1. Create a free account on [Railway](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Add a PostgreSQL database
5. Deploy the application

## Features

- User authentication and authorization
- Video upload and management
- Quiz creation and management
- Interactive quiz taking
- Progress tracking
- Analytics dashboard

## Tech Stack

- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- PostgreSQL
- Thymeleaf
- Bootstrap 5
- Docker 