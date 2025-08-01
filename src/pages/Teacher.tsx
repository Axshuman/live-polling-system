import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { setSession, clearSession } from '../store/sessionSlice';
import { clearCurrentPoll, setLoading } from '../store/pollSlice';
import { socketService } from '../services/socket';
import { 
  Users, 
  Plus, 
  Copy, 
  Play, 
  BarChart3, 
  Settings,
  LogOut,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import StudentList from '../components/StudentList';
import PollChart from '../components/PollChart';
import Timer from '../components/Timer';
import toast from 'react-hot-toast';

const Teacher: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionId, students, isConnected } = useSelector((state: RootState) => state.session);
  const { currentPoll, isLoading, pollHistory } = useSelector((state: RootState) => state.poll);
  
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!socketService) {
      socketService.connect();
    }

    return () => {
      if (sessionId) {
        socketService.disconnect();
      }
    };
  }, []);

  const createSession = async () => {
    dispatch(setLoading(true));
    try {
      const response = await socketService.createSession();
      if (response.success && response.sessionId) {
        dispatch(setSession({
          sessionId: response.sessionId,
          userType: 'teacher'
        }));
        toast.success('Session created successfully!');
      } else {
        toast.error(response.error || 'Failed to create session');
      }
    } catch (error) {
      toast.error('Failed to create session');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const copySessionId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      toast.success('Session ID copied to clipboard!');
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createPoll = async () => {
    if (!sessionId || !question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await socketService.createPoll(sessionId, question, validOptions, timeLimit);
      if (response.success) {
        setShowCreatePoll(false);
        setQuestion('');
        setOptions(['', '']);
        setTimeLimit(60);
        toast.success('Poll created successfully!');
      } else {
        toast.error(response.error || 'Failed to create poll');
      }
    } catch (error) {
      toast.error('Failed to create poll');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const removeStudent = async (studentId: string) => {
    if (!sessionId) return;
    
    try {
      const response = await socketService.removeStudent(sessionId, studentId);
      if (response.success) {
        toast.success('Student removed successfully');
      } else {
        toast.error(response.error || 'Failed to remove student');
      }
    } catch (error) {
      toast.error('Failed to remove student');
    }
  };

  const endSession = () => {
    socketService.disconnect();
    dispatch(clearSession());
    dispatch(clearCurrentPoll());
    navigate('/');
    toast.success('Session ended');
  };

  const canCreatePoll = () => {
    if (!currentPoll) return true;
    if (!currentPoll.isActive) return true;
    return students.every(student => student.hasAnswered);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
            <p className="text-gray-600">Create a new session to start polling</p>
          </div>

          <button
            onClick={createSession}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Create New Session</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-7 w-7 mr-3 text-blue-600" />
                Teacher Dashboard
              </h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Session ID:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{sessionId}</code>
                  <button
                    onClick={copySessionId}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy Session ID"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Connected</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <BarChart3 className="h-4 w-4" />
                <span>History</span>
              </button>
              
              <button
                onClick={endSession}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>End Session</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Poll Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Poll Management</h2>
                {!canCreatePoll() && (
                  <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Waiting for responses</span>
                  </div>
                )}
              </div>

              {!showCreatePoll ? (
                <button
                  onClick={() => setShowCreatePoll(true)}
                  disabled={!canCreatePoll()}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create New Poll</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Enter your poll question..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {options.length > 2 && (
                            <button
                              onClick={() => removeOption(index)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {options.length < 6 && (
                      <button
                        onClick={addOption}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Option</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (seconds)
                    </label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Math.max(10, parseInt(e.target.value) || 60))}
                      min="10"
                      max="300"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={createPoll}
                      disabled={isLoading}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          <span>Start Poll</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowCreatePoll(false)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Current Poll Results */}
            {currentPoll && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Current Poll</h3>
                  {currentPoll.isActive && (
                    <Timer
                      timeRemaining={currentPoll.timeRemaining}
                      onTimeUp={() => {
                        toast.success('Poll time expired!');
                      }}
                    />
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">{currentPoll.question}</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{currentPoll.totalVotes}</div>
                      <div className="text-sm text-blue-800">Total Votes</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {students.filter(s => s.hasAnswered).length}/{students.length}
                      </div>
                      <div className="text-sm text-green-800">Students Answered</div>
                    </div>
                  </div>
                  
                  <PollChart options={currentPoll.options} />
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Response Details</h5>
                  <div className="space-y-2">
                    {currentPoll.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{option.text}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{option.votes} votes</span>
                          <span className="text-sm text-gray-500">({option.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Poll History */}
            {showHistory && pollHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Poll History</h3>
                <div className="space-y-4">
                  {pollHistory.map((poll, index) => (
                    <div key={poll.id} className="border border-gray-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Poll #{pollHistory.length - index}</h4>
                        <span className="text-sm text-gray-500">{poll.totalVotes} votes</span>
                      </div>
                      <p className="text-gray-700 mb-3">{poll.question}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {poll.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{option.text}</span>
                            <span className="font-medium">{option.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StudentList 
              students={students} 
              onRemoveStudent={removeStudent}
              canRemove={true}
            />

            {/* Session Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-semibold text-gray-900">{students.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Polls Created</span>
                  <span className="font-semibold text-gray-900">{pollHistory.length + (currentPoll ? 1 : 0)}</span>
                </div>
                {currentPoll && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold text-gray-900">
                      {students.length > 0 
                        ? Math.round((students.filter(s => s.hasAnswered).length / students.length) * 100)
                        : 0}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacher;