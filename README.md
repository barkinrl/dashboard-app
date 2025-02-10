# Mindset Institute - Backend Developer - Case Study

This project is a microservice-based backend system developed according to the requirements specified by Mindset Institute. The project includes features such as user management, customer management, and sales tracking.

## 🔮 Technologies

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (NoSQL)
- **Authentication:** JWT
- **API Gateway:** Express Gateway(axios)
- **Testing:** Jest
- **Documentation:** Swagger
- **Containerization:** Docker, Docker Compose

## ⚡ Setup and Running

1. **Clone the Project:**

   ```bash
   git clone [<repo-link>](https://github.com/barkinrl/dashboard-app/tree/version-1.0.0)
   cd <project-folder>
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Entire System with Docker:**
   ```bash
   docker-compose up --build
   ```

## 🛠️ Microservices

### 1. User Management

- User login and registration
- Roles (Admin, Sales Representative, etc.)
- JWT-based authentication

### 2. Customer Management

- CRUD operations
- Customer notes
- Sorting

### 3. Sales Tracking

- Pipeline management ("New", "Contact", "Deal", "Closed")
- Record date when sales status changes

## 💡 API Usage

API documentation is provided via Swagger. Once the project is running with Docker, you can access it at **http://localhost:3000/api-docs**.

## 💪 Testing

Run unit tests with:

```bash
npm test
```

## 📝 Submission Details

- **Version control system:** Git
- **Containerization:** Docker & Docker Compose

For more information, check the API documentation and project source code.(or write directly to me via anywhere)

stay metal \m/
