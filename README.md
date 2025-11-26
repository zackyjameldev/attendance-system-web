# Attendance System - Web Dashboard

This is the Next.js web application for the Attendance System, providing an admin dashboard for managing users, fields, subjects, and attendances.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Session-based)
- **Styling**: Tailwind CSS

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd web
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `web` directory:
   ```env
   DATABASE_URL="mongodb://localhost:27017/attendance_system"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

#### POST /api/auth/login
Login endpoint for API usage (e.g., Postman)

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMINISTRATOR"
  }
}
```

**Note**: For web UI, use NextAuth's built-in signIn function. For API testing, you'll need to handle session cookies manually.

#### POST /api/auth/mobile-login
Mobile-friendly login endpoint that returns a token

**Request Body:**
```json
{
  "email": "teacher@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "base64_encoded_token",
  "user": {
    "id": "user_id",
    "email": "teacher@example.com",
    "name": "Teacher Name",
    "role": "TEACHER"
  }
}
```

**Note**: Use this endpoint for mobile apps. Include the token in the Authorization header as `Bearer {token}` for subsequent API requests.

### Administrator Endpoints

All administrator endpoints require authentication and ADMINISTRATOR role.

#### GET /api/admin/users
Get all users

**Response:**
```json
{
  "users": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "STUDENT",
      "fieldId": "field_id",
      "field": {
        "id": "field_id",
        "name": "Software Engineering"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/admin/users
Create a new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "STUDENT",
  "fieldId": "field_id" // Optional for STUDENT and TEACHER
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "STUDENT",
    "fieldId": "field_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/admin/fields
Get all fields

**Response:**
```json
{
  "fields": [
    {
      "id": "field_id",
      "name": "Software Engineering",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "users": 10,
        "subjects": 5
      }
    }
  ]
}
```

#### POST /api/admin/fields
Create a new field

**Request Body:**
```json
{
  "name": "Software Engineering"
}
```

**Response:**
```json
{
  "field": {
    "id": "field_id",
    "name": "Software Engineering",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/admin/subjects
Get all subjects

**Response:**
```json
{
  "subjects": [
    {
      "id": "subject_id",
      "name": "Database Systems",
      "year": 2,
      "term": 1,
      "field": {
        "id": "field_id",
        "name": "Software Engineering"
      },
      "teacher": {
        "id": "teacher_id",
        "name": "Teacher Name",
        "email": "teacher@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/admin/subjects
Create a new subject

**Request Body:**
```json
{
  "name": "Database Systems",
  "fieldId": "field_id",
  "teacherId": "teacher_id",
  "year": 2,
  "term": 1
}
```

**Response:**
```json
{
  "subject": {
    "id": "subject_id",
    "name": "Database Systems",
    "fieldId": "field_id",
    "teacherId": "teacher_id",
    "year": 2,
    "term": 1,
    "field": {
      "id": "field_id",
      "name": "Software Engineering"
    },
    "teacher": {
      "id": "teacher_id",
      "name": "Teacher Name",
      "email": "teacher@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/admin/attendances
Get all attendances

**Response:**
```json
{
  "attendances": [
    {
      "id": "attendance_id",
      "fieldId": "field_id",
      "subjectId": "subject_id",
      "teacherId": "teacher_id",
      "numberOfDays": 10,
      "dates": ["2024-01-01", "2024-01-02", ...],
      "timeStart": "09:00",
      "timeEnd": "12:00",
      "studentIds": ["student_id1", "student_id2"],
      "field": {
        "id": "field_id",
        "name": "Software Engineering"
      },
      "subject": {
        "id": "subject_id",
        "name": "Database Systems",
        "year": 2,
        "term": 1
      },
      "teacher": {
        "id": "teacher_id",
        "name": "Teacher Name",
        "email": "teacher@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/admin/attendances
Create a new attendance

**Request Body:**
```json
{
  "fieldId": "field_id",
  "subjectId": "subject_id",
  "teacherId": "teacher_id",
  "numberOfDays": 10,
  "dates": ["2024-01-01", "2024-01-02", "2024-01-03", ...],
  "timeStart": "09:00",
  "timeEnd": "12:00",
  "studentIds": ["student_id1", "student_id2", "student_id3"]
}
```

**Response:**
```json
{
  "attendance": {
    "id": "attendance_id",
    "fieldId": "field_id",
    "subjectId": "subject_id",
    "teacherId": "teacher_id",
    "numberOfDays": 10,
    "dates": ["2024-01-01", "2024-01-02", ...],
    "timeStart": "09:00",
    "timeEnd": "12:00",
    "studentIds": ["student_id1", "student_id2"],
    "field": {
      "id": "field_id",
      "name": "Software Engineering"
    },
    "subject": {
      "id": "subject_id",
      "name": "Database Systems",
      "year": 2,
      "term": 1
    },
    "teacher": {
      "id": "teacher_id",
      "name": "Teacher Name",
      "email": "teacher@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/admin/students
Get all students (optionally filtered by field)

**Query Parameters:**
- `fieldId` (optional): Filter students by field

**Response:**
```json
{
  "students": [
    {
      "id": "student_id",
      "email": "student@example.com",
      "name": "Student Name",
      "fieldId": "field_id",
      "field": {
        "id": "field_id",
        "name": "Software Engineering"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Teacher Endpoints

All teacher endpoints require authentication and TEACHER role.

#### GET /api/teacher/attendances
Get active attendances for logged-in teacher

**Response:**
```json
{
  "activeAttendances": [
    {
      "id": "attendance_id",
      "fieldId": "field_id",
      "subjectId": "subject_id",
      "numberOfDays": 10,
      "dates": ["2024-01-01", ...],
      "timeStart": "09:00",
      "timeEnd": "12:00",
      "isActiveToday": true,
      "field": {
        "id": "field_id",
        "name": "Software Engineering"
      },
      "subject": {
        "id": "subject_id",
        "name": "Database Systems",
        "year": 2,
        "term": 1
      }
    }
  ],
  "fields": [
    {
      "id": "field_id",
      "name": "Software Engineering",
      "subjects": [
        {
          "id": "subject_id",
          "name": "Database Systems",
          "year": 2,
          "term": 1,
          "attendances": [...]
        }
      ]
    }
  ]
}
```

#### GET /api/teacher/attendances/[id]
Get attendance details with students list

**Response:**
```json
{
  "attendance": {
    "id": "attendance_id",
    "fieldId": "field_id",
    "subjectId": "subject_id",
    "numberOfDays": 10,
    "dates": ["2024-01-01", ...],
    "timeStart": "09:00",
    "timeEnd": "12:00",
    "isActive": true,
    "field": {
      "id": "field_id",
      "name": "Software Engineering"
    },
    "subject": {
      "id": "subject_id",
      "name": "Database Systems",
      "year": 2,
      "term": 1
    }
  },
  "students": [
    {
      "id": "student_id",
      "email": "student@example.com",
      "name": "Student Name",
      "isPresent": false,
      "recordId": "record_id"
    }
  ]
}
```

#### POST /api/teacher/attendances/[id]/mark
Mark student attendance

**Request Body:**
```json
{
  "studentId": "student_id",
  "isPresent": true,
  "date": "2024-01-01" // Optional, defaults to today
}
```

**Response:**
```json
{
  "record": {
    "id": "record_id",
    "attendanceId": "attendance_id",
    "studentId": "student_id",
    "date": "2024-01-01",
    "isPresent": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Student Endpoints

All student endpoints require authentication and STUDENT role.

#### GET /api/student/attendance
Get attendance results for logged-in student

**Response:**
```json
{
  "field": {
    "id": "field_id",
    "name": "Software Engineering"
  },
  "subjects": [
    {
      "id": "subject_id",
      "name": "Database Systems",
      "year": 2,
      "term": 1,
      "teacher": {
        "id": "teacher_id",
        "name": "Teacher Name",
        "email": "teacher@example.com"
      },
      "attendances": [
        {
          "id": "attendance_id",
          "numberOfDays": 10,
          "dates": ["2024-01-01", ...],
          "timeStart": "09:00",
          "timeEnd": "12:00",
          "presentDays": 8,
          "absentDays": 2,
          "attendanceRate": 80.0,
          "records": [
            {
              "date": "2024-01-01",
              "isPresent": true
            }
          ]
        }
      ]
    }
  ]
}
```

## Authentication

The system uses NextAuth.js with session-based authentication. For API testing with Postman:

1. First, login through the web interface to get session cookies
2. Use those cookies in your Postman requests
3. Alternatively, use the `/api/auth/login` endpoint and handle cookies manually

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message",
  "details": [...] // Optional, for validation errors
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (wrong role)
- `404`: Not Found
- `500`: Internal Server Error

## Database Schema

The system uses MongoDB with Prisma ORM. Key models:

- **User**: Users with roles (ADMINISTRATOR, TEACHER, STUDENT)
- **Field**: University fields/programs
- **Subject**: Subjects within fields
- **Attendance**: Attendance sessions
- **AttendanceRecord**: Individual student attendance records

See `prisma/schema.prisma` for full schema details.

