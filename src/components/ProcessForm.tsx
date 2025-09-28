import { useState } from 'react';

type ProcessFormProps = {
  onAddProcess: (arrivalTime: number, burstTime: number) => void;
};

export default function ProcessForm({ onAddProcess }: ProcessFormProps) {
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (burstTime < 1) return;
    
    setIsSubmitting(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onAddProcess(arrivalTime, burstTime);
    setArrivalTime(0);
    setBurstTime(0);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="arrivalTime" className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Arrival Time
        </label>
        <div className="relative">
          <input
            type="number"
            id="arrivalTime"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(Number(e.target.value))}
            className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl py-4 px-6 text-slate-800 font-medium shadow-lg transition-all duration-200 hover:shadow-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500"
            min="0"
            required
            placeholder="Enter arrival time"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-slate-400 text-sm font-medium">units</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="burstTime" className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Burst Time
        </label>
        <div className="relative">
          <input
            type="number"
            id="burstTime"
            value={burstTime}
            onChange={(e) => setBurstTime(Number(e.target.value))}
            className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl py-4 px-6 text-slate-800 font-medium shadow-lg transition-all duration-200 hover:shadow-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500"
            min="1"
            required
            placeholder="Enter burst time"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-slate-400 text-sm font-medium">units</span>
          </div>
        </div>
        {burstTime < 1 && burstTime !== 0 && (
          <p className="text-red-500 text-xs font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Burst time must be at least 1
          </p>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting || burstTime < 1}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        {isSubmitting ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Adding Process...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Process
          </>
        )}
      </button>
    </form>
  );
}