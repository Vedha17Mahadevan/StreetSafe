import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { HistoricalData } from '../types';

interface CurrentChartProps {
  data: HistoricalData[];
  predictions: HistoricalData[];
  deviceId: string;
  confidence?: 'Low' | 'Medium' | 'High';
}

export function CurrentChart({ data, predictions, deviceId, confidence }: CurrentChartProps) {
  // Combine historical and predicted data
  const combinedData = [...data, ...predictions];
  
  // Separate predicted data for the second line
  const predictedData = predictions.map(p => ({ ...p, predicted: true }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      const isPredicted = point.predicted;
      
      return (
        <div className="border border-gray-300 dark:border-[#00aa2b]/40 bg-white dark:bg-black p-3 rounded shadow-lg">
          <p className="text-xs text-gray-600 dark:text-[#00aa2b] mb-1">
            {new Date(point.timestamp).toLocaleString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-[#00ff41]">
            Current: {point.current} A
          </p>
          {isPredicted && (
            <p className="text-xs text-amber-600 dark:text-[#ffaa00] mt-1">Predicted</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Format timestamp for X-axis
  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border border-gray-300 dark:border-[#00ff41]/30 rounded-lg p-6 bg-white dark:bg-black/90 shadow-sm">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-[#00ff41] mb-1">
            CURRENT vs TIME - {deviceId}
          </h3>
          <p className="text-xs text-gray-500 dark:text-[#00aa2b]">
            Real-time monitoring with predictive analytics
          </p>
        </div>
        {confidence && (
          <div className="px-4 py-2 rounded border border-amber-400/30 bg-amber-50 dark:bg-[#ffaa00]/10">
            <p className="text-xs text-amber-700 dark:text-[#ffaa00]">
              Prediction Confidence: <span className="font-bold">{confidence}</span>
            </p>
          </div>
        )}
      </div>

      {/* Chart container - white in light mode, dark in dark mode */}
      <div className="bg-white dark:bg-black/50 border border-gray-200 dark:border-[#00ff41]/30 rounded p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={combinedData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="currentColor" 
              opacity={0.15} 
              className="text-gray-300 dark:text-[#00aa2b]" 
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="currentColor"
              tick={{ fill: 'currentColor', fontSize: 11 }}
              tickLine={{ stroke: 'currentColor' }}
              className="text-gray-700 dark:text-[#00ff41]"
            />
            <YAxis
              stroke="currentColor"
              tick={{ fill: 'currentColor', fontSize: 11 }}
              tickLine={{ stroke: 'currentColor' }}
              label={{ 
                value: 'Current (A)', 
                angle: -90, 
                position: 'insideLeft', 
                fill: 'currentColor',
                className: 'text-gray-700 dark:text-[#00ff41]' 
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                color: 'currentColor', 
                fontFamily: 'system-ui, sans-serif', 
                fontSize: '12px' 
              }}
              className="text-gray-700 dark:text-[#00ff41]"
            />
            
            {/* Warning threshold line */}
            <ReferenceLine
              y={15}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={{ value: 'Warning (15A)', fill: '#f59e0b', fontSize: 10 }}
            />
            
            {/* Critical threshold line */}
            <ReferenceLine
              y={30}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: 'Critical (30A)', fill: '#ef4444', fontSize: 10 }}
            />
            
            {/* Historical data line */}
            <Line
              type="monotone"
              dataKey="current"
              stroke="#10b981"           // emerald-500 - nice visible green
              strokeWidth={2}
              dot={false}
              name="Actual Current"
              connectNulls
            />

            {/* Optional: add predicted line with lower opacity */}
            <Line
              type="monotone"
              dataKey="current"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              opacity={0.6}
              name="Predicted"
              activeDot={{ r: 6 }}
              connectNulls
              data={predictedData}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-[#00ff41]/90">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-[#10b981]"></div>
          <span>Actual Reading</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-[#10b981] opacity-50"></div>
          <span>Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 border-t border-dashed border-amber-500"></div>
          <span>Warning Threshold</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 border-t border-dashed border-red-500"></div>
          <span>Critical Threshold</span>
        </div>
      </div>
    </div>
  );
}