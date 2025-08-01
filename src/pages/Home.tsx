import React from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, BarChart3, Timer, Zap } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-2xl">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Live Polling System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create engaging real-time polls for your classroom. Get instant feedback from students 
            with beautiful visualizations and seamless interaction.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Results</h3>
            <p className="text-gray-600">
              See poll results update instantly as students submit their answers. Perfect for live classroom engagement.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <Timer className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Timed Polls</h3>
            <p className="text-gray-600">
              Set time limits for your polls to keep discussions moving. Automatic results display when time expires.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Management</h3>
            <p className="text-gray-600">
              Manage students, track participation, and view detailed analytics for better classroom insights.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/teacher"
            className="group relative overflow-hidden bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-6 w-6" />
              <span>Start as Teacher</span>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </Link>

          <Link
            to="/student"
            className="group relative overflow-hidden bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6" />
              <span>Join as Student</span>
            </div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </Link>
        </div>

        {/* How it works */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                <GraduationCap className="h-6 w-6 mr-2" />
                For Teachers
              </h3>
              <ol className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  Create a new session and share the session ID with students
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  Create polls with multiple choice questions
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  Watch real-time results and manage student participation
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2" />
                For Students
              </h3>
              <ol className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  Enter your name and the session ID provided by your teacher
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  Answer poll questions when they appear
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  View results after submitting your answer or when time expires
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;