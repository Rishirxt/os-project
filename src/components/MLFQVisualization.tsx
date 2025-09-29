import { Process, ProcessResult, ResultMetrics } from '../types';
import ResultsTable from './ResultsTable';

type MLFQVisualizationProps = {
  ganttChart: ResultMetrics['ganttChart'];
  results: ProcessResult[];
  timeQuanta: number[];
  metrics: ResultMetrics;
};

export default function MLFQVisualization({ ganttChart, results, timeQuanta, metrics }: MLFQVisualizationProps) {
  if (!ganttChart || ganttChart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">No MLFQ simulation data available</p>
        <p className="text-slate-400 text-sm mt-1">Run an MLFQ simulation to see the visualization</p>
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
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-teal-500 to-teal-600',
  ];

  // Get unique processes in order of appearance
  const uniqueProcesses = Array.from(new Set(ganttChart.map(item => item.processId)))
    .sort((a, b) => {
      const aNum = parseInt(a.replace('P', ''));
      const bNum = parseInt(b.replace('P', ''));
      return aNum - bNum;
    });

  const getProcessColor = (processId: string, index: number) => {
    const processNumber = parseInt(processId.replace('P', '')) - 1;
    return colors[processNumber % colors.length];
  };

  // Create a consistent color mapping for all processes
  const processColorMap = new Map<string, string>();
  uniqueProcesses.forEach((processId, index) => {
    processColorMap.set(processId, colors[index % colors.length]);
  });

  return (
    <div className="space-y-8">
      {/* MLFQ Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-xl">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Multi-Level Feedback Queue</h2>
        <p className="text-slate-600">Advanced CPU scheduling with priority-based queues</p>
      </div>

      {/* Queue Configuration */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          Queue Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {timeQuanta.map((quantum, index) => (
            <div key={index} className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Queue {index + 1}</h4>
                  <p className="text-sm text-slate-600">Time Quantum: {quantum} units</p>
                  <p className="text-xs text-slate-500">
                    Priority: {index === 0 ? 'Highest' : index === timeQuanta.length - 1 ? 'Lowest' : 'Medium'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Execution Timeline
        </h3>
        
        {/* Chart Container */}
        <div className="relative">
          <div className="flex w-full h-16 relative overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl shadow-inner border-2 border-slate-200">
            {ganttChart.map((item, index) => {
              const widthPercentage = ((item.end - item.start) / totalTime) * 100;
              const leftPosition = (item.start / totalTime) * 100;
              const actualWidth = Math.max(widthPercentage, 2);

              return (
                <div
                  key={`${item.processId}-${item.start}-${item.end}-block-${index}`}
                  className={`bg-gradient-to-r ${processColorMap.get(item.processId) || getProcessColor(item.processId, index)} h-full flex items-center justify-center text-white text-sm font-bold whitespace-nowrap overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-r-2 border-white/30`}
                  style={{ 
                    width: `${actualWidth}%`, 
                    left: `${leftPosition}%`, 
                    position: 'absolute',
                    animationDelay: `${index * 100}ms`
                  }}
                  title={`${item.processId}: ${item.start} - ${item.end}`}
                >
                  <span className="drop-shadow-lg" style={{ 
                    fontSize: actualWidth < 6 ? '10px' : actualWidth < 10 ? '12px' : '14px',
                    display: actualWidth < 2 ? 'none' : 'block'
                  }}>
                    {actualWidth >= 2 ? item.processId : ''}
                  </span>
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
                key={`${item.processId}-${item.start}-${item.end}-time-${index}`}
                className="absolute text-sm font-semibold text-slate-600 bg-white px-2 py-1 rounded-lg shadow-sm transform -translate-x-1/2"
                style={{ left: `${(item.end / totalTime) * 100}%` }}
              >
                {item.end}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Process Legend
          </h4>
          <div className="flex flex-wrap gap-3">
            {uniqueProcesses.map((processId, index) => (
              <div key={processId} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <div className={`w-4 h-4 bg-gradient-to-r ${processColorMap.get(processId) || getProcessColor(processId, index)} rounded shadow-sm`}></div>
                <span className="text-sm font-semibold text-slate-700">{processId}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Details - Using existing ResultsTable */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          Process Details
        </h3>
        
        <ResultsTable results={results} />
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Average Waiting Time</h4>
              <p className="text-xs text-slate-600">Time processes wait</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-800">{metrics.averageWaitingTime.toFixed(2)}</p>
          <p className="text-sm text-blue-600">time units</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Average Turnaround Time</h4>
              <p className="text-xs text-slate-600">Total execution time</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-800">{metrics.averageTurnaroundTime.toFixed(2)}</p>
          <p className="text-sm text-purple-600">time units</p>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Total Processes</h4>
              <p className="text-xs text-slate-600">Processes executed</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-800">{results.length}</p>
          <p className="text-sm text-emerald-600">processes</p>
        </div>
      </div>

      {/* MLFQ Explanation */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          How MLFQ Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Queue Rules:</h4>
            <ul className="space-y-1">
              <li>• Higher priority queues have shorter time quanta</li>
              <li>• Processes start in the highest priority queue</li>
              <li>• If a process uses its full quantum, it's demoted</li>
              <li>• If a process completes before quantum, it stays in the same queue</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Benefits:</h4>
            <ul className="space-y-1">
              <li>• Interactive processes get quick response</li>
              <li>• CPU-bound processes don't starve</li>
              <li>• Automatic priority adjustment</li>
              <li>• Balances responsiveness and efficiency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}