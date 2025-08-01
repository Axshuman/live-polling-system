import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { socketService } from './services/socket';
import Home from './pages/Home';
import Teacher from './pages/Teacher';
import Student from './pages/Student';

function App() {
  useEffect(() => {
    // Connect to socket when app loads
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teacher" element={<Teacher />} />
            <Route path="/student" element={<Student />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;