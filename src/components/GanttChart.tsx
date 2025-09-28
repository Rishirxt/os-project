import { ResultMetrics } from '../types';

type GanttChartProps = {
  ganttChart: ResultMetrics['ganttChart'];
};

export default function GanttChart({ ganttChart }: GanttChartProps) {
  if (ganttChart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">No simulation data available</p>
        <p className="text-slate-400 text-sm mt-1">Run a simulation to see the Gantt chart</p>
      </div>
    );
  }

  const totalTime = ganttChart[ganttChart.length - 1].end;
  
  // Color palette for different processes
  const colors = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-cyan-500 to-cyan-600',
    'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-teal-500 to-teal-600',
  ];

  const getProcessColor = (processId: string, index: number) => {
    const processNumber = parseInt(processId.replace('P', '')) - 1;
    return colors[processNumber % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Chart Container */}
      <div className="relative">
        <div className="flex w-full h-16 relative overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl shadow-inner border-2 border-slate-200">
          {ganttChart.map((item, index) => {
            const widthPercentage = ((item.end - item.start) / totalTime) * 100;
            const leftPosition = (item.start / totalTime) * 100;

            return (
              <div
                key={index}
                className={`bg-gradient-to-r ${getProcessColor(item.processId, index)} h-full flex items-center justify-center text-white text-sm font-bold whitespace-nowrap overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-r-2 border-white/30`}
                style={{ 
                  width: `${widthPercentage}%`, 
                  left: `${leftPosition}%`, 
                  position: 'absolute',
                  animationDelay: `${index * 100}ms`
                }}
                title={`${item.processId}: ${item.start} - ${item.end}`}
              >
                <span className="drop-shadow-lg">{item.processId}</span>
              </div>
            );
          })}
        </div>
        
        {/* Time Scale */}
        <div className="flex w-full mt-4 relative">
          <div className="absolute left-0 text-sm font-semibold text-slate-600 bg-white px-2 py-1 rounded-lg shadow-sm">
            {ganttChart[0].start}
          </div>
          {ganttChart.map((item, index) => (
            <div
              key={item.end}
              className="absolute text-sm font-semibold text-slate-600 bg-white px-2 py-1 rounded-lg shadow-sm transform -translate-x-1/2"
              style={{ left: `${(item.end / totalTime) * 100}%` }}
            >
              {item.end}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Process Legend
        </h4>
        <div className="flex flex-wrap gap-3">
          {Array.from(new Set(ganttChart.map(item => item.processId))).map((processId, index) => (
            <div key={processId} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
              <div className={`w-4 h-4 bg-gradient-to-r ${getProcessColor(processId, index)} rounded shadow-sm`}></div>
              <span className="text-sm font-semibold text-slate-700">{processId}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-blue-700">Total Time</span>
          </div>
          <p className="text-2xl font-bold text-blue-800">{totalTime}</p>
          <p className="text-xs text-blue-600">time units</p>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm font-semibold text-emerald-700">Processes</span>
          </div>
          <p className="text-2xl font-bold text-emerald-800">{new Set(ganttChart.map(item => item.processId)).size}</p>
          <p className="text-xs text-emerald-600">unique processes</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-semibold text-purple-700">Context Switches</span>
          </div>
          <p className="text-2xl font-bold text-purple-800">{ganttChart.length - 1}</p>
          <p className="text-xs text-purple-600">switches</p>
        </div>
      </div>
    </div>
  );
}