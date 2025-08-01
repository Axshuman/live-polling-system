import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  onTimeUp?: () => void;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining, onTimeUp }) => {
  const [time, setTime] = useState(timeRemaining);

  useEffect(() => {
    setTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTime(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          onTimeUp?.();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time, onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const percentage = (time / timeRemaining) * 100;

  const getColorClass = () => {
    if (time <= 10) return 'text-red-500';
    if (time <= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className={`h-5 w-5 ${getColorClass()}`} />
      <div className="flex items-center space-x-2">
        <span className={`font-mono text-lg font-bold ${getColorClass()}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <div className="w-20 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              time <= 10 ? 'bg-red-500' : time <= 30 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;