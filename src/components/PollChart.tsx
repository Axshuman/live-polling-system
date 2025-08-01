import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PollOption {
  text: string;
  votes: number;
  percentage: number;
}

interface PollChartProps {
  options: PollOption[];
  selectedOption?: number;
}

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green  
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
];

const PollChart: React.FC<PollChartProps> = ({ options, selectedOption }) => {
  const data = options.map((option, index) => ({
    name: `Option ${index + 1}`,
    fullText: option.text,
    votes: option.votes,
    percentage: option.percentage,
    isSelected: selectedOption === index,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullText}</p>
          <p className="text-blue-600">
            Votes: <span className="font-bold">{data.votes}</span>
          </p>
          <p className="text-green-600">
            Percentage: <span className="font-bold">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#9CA3AF"
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            stroke="#9CA3AF"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isSelected ? '#F59E0B' : COLORS[index % COLORS.length]}
                stroke={entry.isSelected ? '#D97706' : 'none'}
                strokeWidth={entry.isSelected ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PollChart;