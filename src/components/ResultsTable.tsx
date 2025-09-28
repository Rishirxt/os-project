import { ProcessResult } from '../types';

type ResultsTableProps = {
  results: ProcessResult[];
};

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-xl border-b border-slate-200">
          <div className="grid grid-cols-6 gap-2 p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <div className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Process
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Arrival
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Burst
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completion
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Turnaround
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Waiting
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white rounded-b-xl overflow-hidden">
          {results.map((result, index) => (
            <div 
              key={result.id}
              className={`grid grid-cols-6 gap-2 p-3 transition-all duration-200 hover:bg-slate-50/50 ${
                index !== results.length - 1 ? 'border-b border-slate-100' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Process ID */}
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold text-sm shadow-md">
                  {result.id.replace('P', '')}
                </div>
              </div>

              {/* Arrival Time */}
              <div className="flex items-center justify-center">
                <span className="text-slate-700 font-semibold text-sm">
                  {result.arrivalTime}
                </span>
              </div>

              {/* Burst Time */}
              <div className="flex items-center justify-center">
                <span className="text-slate-700 font-semibold text-sm">
                  {result.burstTime}
                </span>
              </div>

              {/* Completion Time */}
              <div className="flex items-center justify-center">
                <span className="text-slate-700 font-semibold text-sm">
                  {result.completionTime}
                </span>
              </div>

              {/* Turnaround Time */}
              <div className="flex items-center justify-center">
                <span className="text-slate-700 font-semibold text-sm">
                  {result.turnaroundTime}
                </span>
              </div>

              {/* Waiting Time */}
              <div className="flex items-center justify-center">
                <span className="text-slate-700 font-semibold text-sm">
                  {result.waitingTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}