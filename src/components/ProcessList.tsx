import { Process, SchedulingAlgorithm } from '../types';
import { useState } from 'react';

type ProcessListProps = {
  processes: Process[];
  onDeleteProcess: (id: string) => void;
  selectedAlgorithm: SchedulingAlgorithm;
};

export default function ProcessList({ processes, onDeleteProcess, selectedAlgorithm }: ProcessListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await new Promise(resolve => setTimeout(resolve, 300));
    onDeleteProcess(id);
    setDeletingId(null);
  };

  if (processes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">No processes added yet</p>
        <p className="text-slate-400 text-sm mt-1">Add your first process to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {processes.map((process, index) => (
        <div 
          key={process.id} 
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-bold text-lg shadow-lg flex-shrink-0">
                {process.id.replace('P', '')}
              </div>
              <div className="space-y-2 min-w-0 flex-1">
                <h3 className="text-lg font-bold text-slate-800 truncate">{process.id}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Arrival: {process.arrivalTime}</span>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium">Burst: {process.burstTime}</span>
                  </div>
                  {selectedAlgorithm === 'MLFQ' && process.priority !== undefined && (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Priority: {process.priority}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleDelete(process.id)}
              disabled={deletingId === process.id}
              className="p-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:cursor-not-allowed flex-shrink-0 self-start sm:self-center"
            >
              {deletingId === process.id ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
                </button>
          </div>
        </div>
          ))}
    </div>
  );
}