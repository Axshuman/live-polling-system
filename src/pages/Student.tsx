import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { setSession, clearSession } from '../store/sessionSlice';
import { setHasAnswered, clearCurrentPoll } from '../store/pollSlice';
import { socketService } from '../services/socket';
import { 
  Users, 
  LogIn, 
  Clock,
  CheckCircle,
  User,
  AlertCircle,
  BarChart3,
  LogOut
} from 'lucide-react';
import PollChart from '../components/PollChart';
import Timer from '../components/Timer';
import toast from 'react-hot-toast';

const Student: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionId, studentId, studentName, isConnected } = useSelector((state: RootState) => state.session);
  const { currentPoll, hasAnswered, selectedOption } = useSelector((state: RootState) => state.poll);
  
  const [joinSessionId, setJoinSessionId] = useState('');
  const [joinStudentName, setJoinStudentName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

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

  const joinSession = async () => {
    if (!joinSessionId.trim() || !joinStudentName.trim()) {
      toast.error('Please enter both session ID and your name');
      return;
    }

    setIsJoining(true);
    try {
      const response = await socketService.joinSession(joinSessionId.trim(), joinStudentName.trim());
      if (response.success && response.sessionId && response.studentId) {
        dispatch(setSession({
          sessionId: response.sessionId,
          studentId: response.studentId,
          studentName: joinStudentName.trim(),
          userType: 'student'
        }));
        toast.success('Joined session successfully!');
      } else {
        toast.error(response.error || 'Failed to join session');
      }
    } catch (error) {
      toast.error('Failed to join session');
    } finally {
      setIsJoining(false);
    }
  };

  const submitAnswer = async (optionIndex: number) => {
    if (!currentPoll || !sessionId || hasAnswered) return;

    try {
      const response = await socketService.submitAnswer(currentPoll.id, optionIndex, sessionId);
      if (response.success) {
        dispatch(setHasAnswered({ answered: true, option: optionIndex }));
        toast.success('Answer submitted successfully!');
      } else {
        toast.error(response.error || 'Failed to submit answer');
      }
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  const leaveSession = () => {
    socketService.disconnect();
    dispatch(clearSession());
    dispatch(clearCurrentPoll());
    navigate('/');
    toast.success('Left session');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Session</h1>
            <p className="text-gray-600">Enter the session ID provided by your teacher</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={joinStudentName}
                onChange={(e) => setJoinStudentName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && joinSession()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session ID
              </label>
              <input
                type="text"
                value={joinSessionId}
                onChange={(e) => setJoinSessionId(e.target.value)}
                placeholder="Enter session ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && joinSession()}
              />
            </div>

            <button
              onClick={joinSession}
              disabled={isJoining || !joinSessionId.trim() || !joinStudentName.trim()}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isJoining ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Join Session</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="h-7 w-7 mr-3 text-green-600" />
                Student Dashboard
              </h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Welcome,</span>
                  <span className="font-medium text-gray-900">{studentName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Connected</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={leaveSession}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Leave Session</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!currentPoll ? (
          // Waiting for poll
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-6">
              <Clock className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Waiting for Poll</h2>
            <p className="text-gray-600 mb-6">
              Your teacher hasn't started a poll yet. Please wait for the next question.
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Waiting for teacher...</span>
            </div>
          </div>
        ) : !currentPoll.isActive || hasAnswered ? (
          // Show results
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Poll Results</h2>
                {hasAnswered && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Answer Submitted</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{currentPoll.question}</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentPoll.totalVotes}</div>
                    <div className="text-sm text-blue-800">Total Votes</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {hasAnswered && selectedOption !== null ? selectedOption + 1 : '-'}
                    </div>
                    <div className="text-sm text-purple-800">Your Choice</div>
                  </div>
                </div>
                
                <PollChart options={currentPoll.options} selectedOption={selectedOption} />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Detailed Results</h4>
                <div className="space-y-3">
                  {currentPoll.options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                        selectedOption === index 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {selectedOption === index && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        <span className="text-gray-900 font-medium">{option.text}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">
                          {option.percentage}%
                        </span>
                        <span className="text-sm text-gray-500 w-16 text-right">
                          ({option.votes} votes)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!currentPoll.isActive && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">Poll Ended</span>
                </div>
                <p className="text-yellow-700 mt-1 text-sm">
                  This poll has ended. Wait for your teacher to start a new poll.
                </p>
              </div>
            )}
          </div>
        ) : (
          // Active poll - show question and options
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Poll</h2>
              <Timer
                timeRemaining={currentPoll.timeRemaining}
                onTimeUp={() => {
                  toast.info('Time is up! Results will be shown shortly.');
                }}
              />
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {currentPoll.question}
              </h3>
              
              <div className="space-y-3">
                {currentPoll.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => submitAnswer(index)}
                    disabled={hasAnswered}
                    className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900">{option.text}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Option {index + 1}</span>
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Results will be shown after you submit your answer</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;