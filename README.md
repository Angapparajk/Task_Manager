# 📝 Task Manager Application

A modern, full-stack task management application built with React and Node.js. This application allows users to create, manage, and track their tasks with features like user authentication, task filtering, and responsive design for all devices.

## ✨ Features

- **User Authentication**: Secure login and registration system
- **Task Management**: Create, edit, delete, and organize tasks
- **Task Filtering**: Filter tasks by status (All, Pending, Completed, Overdue)
- **Task Priority**: Set task priorities (Low, Medium, High)
- **Due Dates**: Set and track task deadlines
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dashboard**: Overview of your tasks with statistics
- **Profile Management**: Update your profile information
- **Real-time Updates**: Instant task updates across the application

## 🛠️ Technologies Used

### Frontend
- **React** - User interface library
- **Material-UI (MUI)** - React component library for beautiful UI
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
TaskManager/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── contexts/   # React context providers
│   │   ├── hooks/      # Custom React hooks
│   │   └── services/   # API service functions
│   └── package.json
├── backend/            # Node.js backend application
│   ├── routes/         # API route handlers
│   ├── models/         # Database models
│   ├── middleware/     # Express middleware
│   └── package.json
└── README.md          # This file
```

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud database)
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd TaskManager
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Environment Setup**
   
   Create a `.env` file in the `backend` folder:
   ```bash
   cd backend
   ```
   
   Create `.env` file with the following content:
   ```env
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```

   **Note**: Replace `your-super-secret-jwt-key-here` with a strong, unique secret key.

2. **MongoDB Setup**
   
   **Option A: Local MongoDB**
   - Install MongoDB on your computer
   - Start MongoDB service
   - Use connection string: `mongodb://localhost:27017/taskmanager`

   **Option B: MongoDB Atlas (Cloud)**
   - Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and get connection string
   - Replace `MONGODB_URI` in `.env` with your Atlas connection string

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser and visit**: `http://localhost:5173`

### Production Mode

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the Backend in Production Mode**
   ```bash
   cd backend
   npm start
   ```

## 📱 How to Use

### Getting Started
1. **Register**: Create a new account with your email and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your task overview and statistics

### Managing Tasks
1. **Create Task**: Click the "+" button to add a new task
2. **Edit Task**: Click the edit button on any task card
3. **Delete Task**: Click the delete button and confirm
4. **Mark Complete**: Toggle task status by clicking the checkbox
5. **Filter Tasks**: Use the filter buttons to view specific task types

### Features Overview
- **Dashboard**: See all your tasks and statistics at a glance
- **Tasks Page**: Detailed view of all tasks with filtering options
- **Profile**: Update your personal information
- **Responsive Design**: Use on any device - phone, tablet, or computer

## 🔧 Available Scripts

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
```

## 🐛 Troubleshooting

### Common Issues

1. **Cannot connect to MongoDB**
   - Make sure MongoDB is running
   - Check your connection string in `.env`
   - For Atlas: ensure your IP is whitelisted

2. **Port already in use**
   - Change the PORT in your `.env` file
   - Or stop the process using that port

3. **Frontend can't connect to backend**
   - Ensure backend is running on port 5000
   - Check the API base URL in frontend code

4. **Login/Register not working**
   - Check MongoDB connection
   - Verify JWT_SECRET is set in `.env`

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Check the terminal where your servers are running
3. Ensure all dependencies are installed (`npm install`)
4. Verify your `.env` configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Support

If you need help or have questions:
- Check the troubleshooting section above
- Create an issue in the repository
- Review the code comments for implementation details

---

**Happy Task Managing! 🎉**

Built with ❤️ using React and Node.js