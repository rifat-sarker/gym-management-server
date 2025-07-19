# 🏋️ Gym Class Scheduling and Membership Management System

A complete backend solution for managing gym operations, including class scheduling, user roles, and booking. Built with TypeScript, Express.js, and PostgreSQL using the Prisma ORM, this application supports role-based access for **Admin**, **Trainer**, and **Trainee** users.

## 🔗 Live URL

**[https://gym-management-server-seven.vercel.app](https://gym-management-server-seven.vercel.app)**

## 🚀 Project Overview

This system allows admins to manage trainers and schedules, trainees to book and manage class bookings, and trainers to view their assigned schedules. The app enforces strict business rules like maximum class per day, maximum trainees per schedule, and proper authentication using JWT.

---

## 🧠 Features & Business Rules

### 🔐 Authentication
- JWT-based access for all users
- Role-based authorization: Admin, Trainer, Trainee

### 🗓️ Class Scheduling
- Max 5 schedules per day
- Each schedule lasts for 2 hours
- Max 10 trainees per schedule

### 🧑‍🏫 Admin
- Create/update/delete class schedules
- Assign trainers
- Create trainers
- View all users & schedules

### 🧍‍♂️ Trainer
- View own class schedules only

### 🧍 Trainee
- Register & login
- Book classes if available
- Cannot book multiple classes at the same time
- Cancel bookings
- View and update own profile

---

## 📊 Relational Diagram

![Relational Diagram](https://i.imgur.com/SmXvxWy.png)

> 🔗 If image not visible, [click here to view](https://i.imgur.com/SmXvxWy.png)

---

## 🛠️ Technology Stack

| Category       | Technology               |
|----------------|---------------------------|
| Language       | TypeScript               |
| Framework      | Express.js               |
| ORM            | Prisma                   |
| Database       | PostgreSQL               |
| Authentication | JWT                      |
| Validation     | Zod                      |
| Hosting        | Vercel                   |

---

## 🗂️ Project Structure

src/
├── app/
│ ├── config/
│ ├── errors/
│ ├── middlewares/
│ ├── modules/
│ │ ├── Auth/
│ │ ├── Booking/
│ │ ├── Schedule/
│ │ └── User/
│ ├── routes/
│ ├── types/
│ └── utils/
├── prisma/
├── dist/
├── .vercel/



---

## 🔑 Admin Credentials

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

## 📡 API Endpoints
🔐 Auth Routes /auth

| Method | Endpoint    | Description           |
| ------ | ----------- | --------------------- |
| POST   | `/register` | Register as a trainee |
| POST   | `/login`    | Login for any user    |

## 👤User Routes /users
| Method | Endpoint          | Role     | Description              |
| ------ | ----------------- | -------- | ------------------------ |
| POST   | `/create-trainer` | Admin    | Create a trainer account |
| GET    | `/`               | Admin    | View all users           |
| GET    | `/me`             | Any Auth | View own profile         |
| PATCH  | `/me`             | Any Auth | Update own profile       |
| GET    | `/:id`            | Admin    | Get user by ID           |

## 📅 Schedule Routes /schedules
| Method | Endpoint | Role  | Description             |
| ------ | -------- | ----- | ----------------------- |
| POST   | `/`      | Admin | Create a class schedule |
| GET    | `/`      | Admin | Get all schedules       |
| GET    | `/:id`   | Admin | Get schedule by ID      |
| PATCH  | `/:id`   | Admin | Update a schedule       |
| DELETE | `/:id`   | Admin | Delete a schedule       |


## 📖 Booking Routes /bookings
| Method | Endpoint             | Role    | Description            |
| ------ | -------------------- | ------- | ---------------------- |
| GET    | `/`                  | Admin   | Get all bookings       |
| GET    | `/my-bookings`       | Trainee | View personal bookings |
| POST   | `/:scheduleId`       | Trainee | Book a schedule        |
| POST   | `/cancel/:bookingId` | Trainee | Cancel a booking       |


## 🧱 Database Schema (Prisma)
model User {
  id        String     @id @default(uuid())
  name      String
  email     String     @unique
  password  String
  role      Role
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  schedules Schedule[] @relation("TrainerSchedules")
  bookings  Booking[]  @relation("TraineeBookings")

  @@map("users")
}

model Schedule {
  id        String   @id @default(uuid())
  date      DateTime
  startTime DateTime
  endTime   DateTime
  trainerId String

  createdBy String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  trainer  User      @relation("TrainerSchedules", fields: [trainerId], references: [id])
  bookings Booking[]


  @@unique([date, startTime])
  @@index([date, startTime, trainerId])
  @@map("schedules")
}

model Booking {
  id         String   @id @default(uuid())
  traineeId  String
  scheduleId String
  createdAt  DateTime @default(now())

  trainee  User     @relation("TraineeBookings", fields: [traineeId], references: [id])
  schedule Schedule @relation(fields: [scheduleId], references: [id])

 
  @@unique([traineeId, scheduleId])
  @@map("bookings")
}

enum Role {
  ADMIN
  TRAINER
  TRAINEE
}


## ⚙️ How to Run Locally
# 1. Clone the repository
git clone https://github.com/rifat-sarker/gym-management-server.git

# 2. Navigate to the project
cd gym-management-server

# 3. Install dependencies
bun install

# 4. Setup Environment Variables
cp .env.example .env
# fill in your DB connection string

# 5. Migrate Database
bun run migrate

# 6. Open Prisma Studio (optional)
bun run studio

# 7. Start Development Server
bun dev


## 🧪 Testing Instructions
✅ Admin
Login as Admin using credentials

Create trainers using /users/create-trainer

Create schedules via /schedules

Assign trainers

✅ Trainer
Login with trainer credentials

View assigned classes

✅ Trainee
Register & Login

Book class using /bookings/:scheduleId

View & cancel bookings


## ✍️ Author

**Rifat Sarker**  
🔗 [GitHub Profile](https://github.com/rifat-sarker)  
📧 rifatswd@gmail.com  
🌍 Based in: Bangladesh




















