# Live Polling System

A real-time polling application built with React, Redux, Node.js, Express, and Socket.io. Perfect for classroom engagement and interactive sessions.

## Features

### Teacher Features
- Create and manage polling sessions
- Create polls with multiple choice questions
- Set custom time limits for polls (10-300 seconds)
- View real-time results with interactive charts
- Manage student participation (remove students)
- View poll history and session statistics
- Real-time student connection monitoring

### Student Features
- Join sessions with unique session IDs
- Answer poll questions with one-click selection
- View real-time results after submitting answers
- Automatic result display when time expires
- Clean, intuitive interface for easy participation

### System Features
- Real-time communication using Socket.io
- Responsive design for all devices
- Professional UI with smooth animations
- Toast notifications for user feedback
- Automatic session cleanup
- Connection status monitoring

## Tech Stack

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- React Hot Toast for notifications
- Socket.io Client for real-time communication

### Backend
- Node.js with Express
- Socket.io for WebSocket connections
- UUID for unique ID generation
- CORS for cross-origin requests
- In-memory data storage (easily replaceable with database)

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone and setup the project:**
```bash
# Clone the repository
git clone <your-repo-url>
cd live-polling-system

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

2. **Environment Setup:**
```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
```

3. **Start the development servers:**

```bash
# Start backend server (from backend directory)
cd backend
npm run dev

# Start frontend server (from root directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Usage

### For Teachers
1. Go to the homepage and click "Start as Teacher"
2. Create a new session (you'll get a unique session ID)
3. Share the session ID with your students
4. Create polls with questions and multiple choice options
5. Watch real-time results as students submit answers
6. Manage student participation as needed

### For Students
1. Go to the homepage and click "Join as Student"
2. Enter your name and the session ID provided by your teacher
3. Wait for polls to be created by your teacher
4. Answer questions by clicking on your preferred option
5. View results after submitting your answer or when time expires

## Deployment

### Frontend (Vercel)
1. Build the project: `npm run build`
2. Deploy to Vercel or your preferred hosting service
3. Set environment variable: `VITE_SERVER_URL=https://your-backend-url.com`

### Backend (Render/Railway)
1. Deploy the backend folder to Render, Railway, or similar service
2. Set environment variables:
   - `PORT=3001` (or your preferred port)
   - `FRONTEND_URL=https://your-frontend-url.com`

## Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Timer.tsx       # Poll countdown timer
│   │   ├── PollChart.tsx   # Results visualization
│   │   └── StudentList.tsx # Student management
│   ├── pages/              # Main application pages
│   │   ├── Home.tsx        # Landing page
│   │   ├── Teacher.tsx     # Teacher dashboard
│   │   └── Student.tsx     # Student interface
│   ├── store/              # Redux store and slices
│   │   ├── store.ts        # Store configuration
│   │   ├── pollSlice.ts    # Poll state management
│   │   └── sessionSlice.ts # Session state management
│   ├── services/           # External service integrations
│   │   └── socket.ts       # Socket.io client service
│   └── App.tsx             # Main application component
├── backend/
│   ├── server.js           # Express server with Socket.io
│   └── package.json        # Backend dependencies
└── README.md
```

## Key Features Detail

### Real-time Communication
- WebSocket connections for instant updates
- Automatic reconnection handling
- Connection status monitoring
- Graceful error handling

### Poll Management
- Time-limited polls with visual countdown
- Automatic result display when all students answer
- Poll history tracking
- Response rate monitoring

### Session Control
- Unique session IDs for secure access
- Student management (add/remove)
- Session cleanup on disconnect
- Multi-session support

### User Experience
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Toast notifications for feedback
- Loading states and error handling

## Customization

### Adding Database Support
Replace the in-memory storage in `backend/server.js` with your preferred database:
- MongoDB with Mongoose
- PostgreSQL with Prisma
- SQLite for simpler deployments

### Extending Features
- Add poll types (ranking, rating scales)
- Implement user authentication
- Add poll templates
- Export results to CSV/PDF
- Add real-time chat functionality

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.