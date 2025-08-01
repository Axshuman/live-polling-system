import React from 'react';
import { User, UserMinus } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  hasAnswered: boolean;
  joinedAt: string;
}

interface StudentListProps {
  students: Student[];
  onRemoveStudent?: (studentId: string) => void;
  canRemove?: boolean;
}

const StudentList: React.FC<StudentListProps> = ({ students, onRemoveStudent, canRemove = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Connected Students ({students.length})
        </h3>
      </div>
      
      {students.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No students connected yet</p>
          <p className="text-sm">Share your session ID for students to join</p>
        </div>
      ) : (
        <div className="space-y-2">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  student.hasAnswered ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">
                    {student.hasAnswered ? 'Answered' : 'Waiting for answer'}
                  </p>
                </div>
              </div>
              
              {canRemove && onRemoveStudent && (
                <button
                  onClick={() => onRemoveStudent(student.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove student"
                >
                  <UserMinus className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;