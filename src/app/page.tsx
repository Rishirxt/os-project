'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Process, ProcessResult, ResultMetrics } from '../types';
import { fcfs } from '../algorithms/fcfs';
import { sjf } from '../algorithms/sjf';
import { roundRobin } from '../algorithms/rr';

import ProcessForm from '../components/ProcessForm';
import ProcessList from '../components/ProcessList';
import ResultsTable from '../components/ResultsTable';
import GanttChart from '../components/GanttChart';

export default function HomePage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [results, setResults] = useState<ProcessResult[] | null>(null);
  const [metrics, setMetrics] = useState<ResultMetrics | null>(null);
  const [quantum, setQuantum] = useState<number>(2);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'FCFS' | 'SJF' | 'RR'>('FCFS');

  const addProcess = (arrivalTime: number, burstTime: number) => {
    const newProcess: Process = {
      id: `P${processes.length + 1}`,
      arrivalTime,
      burstTime,
    };
    setProcesses([...processes, newProcess]);
  };

  const deleteProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
    setResults(null);
    setMetrics(null);
  };

  const handleStartSimulation = () => {
    if (processes.length === 0) {
      alert("Please add at least one process to simulate");
      return;
    }

    let simulationResult;
    switch (selectedAlgorithm) {
      case 'FCFS':
        simulationResult = fcfs(processes);
        break;
      case 'SJF':
        simulationResult = sjf(processes);
        break;
      case 'RR':
        simulationResult = roundRobin(processes, quantum);
        break;
      default:
        return;
    }
    
    setResults(simulationResult.results);
    setMetrics(simulationResult.metrics);
  };

  const resetSimulation = () => {
    setProcesses([]);
    setResults(null);
    setMetrics(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative container mx-auto p-4 max-w-7xl">
        <header className="text-center py-8 lg:py-12 mb-8 lg:mb-12 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 lg:mb-6 shadow-lg">
            <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-3 lg:mb-4 px-4 leading-tight">
            CPU Scheduling Simulator
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
            Visualize and compare different CPU scheduling algorithms with beautiful interactive charts and real-time metrics
          </p>
        </header>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Panel - Process Management */}
          <div className="xl:col-span-1 space-y-6 lg:space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-white/20 card-hover slide-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Add New Process</h2>
              </div>
              <ProcessForm onAddProcess={addProcess} />
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-white/20 card-hover slide-in">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Process List</h2>
                </div>
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                  {processes.length} processes
                </span>
              </div>
              <ProcessList processes={processes} onDeleteProcess={deleteProcess} />
            </div>
          </div>
          
          {/* Right Panel - Simulation & Results */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-white/20 card-hover slide-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Simulation Control</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mb-8">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Scheduling Algorithm</label>
                  <div className="relative">
                    <select
                      value={selectedAlgorithm}
                      onChange={(e) => setSelectedAlgorithm(e.target.value as 'FCFS' | 'SJF' | 'RR')}
                      className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl py-4 px-6 appearance-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                    >
                      <option value="FCFS">First-Come, First-Served (FCFS)</option>
                      <option value="SJF">Shortest Job First (SJF)</option>
                      <option value="RR">Round Robin (RR)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {selectedAlgorithm === 'RR' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Time Quantum</label>
                    <input
                      type="number"
                      value={quantum}
                      onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl py-4 px-6 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                      min="1"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                <button 
                  onClick={handleStartSimulation} 
                  disabled={processes.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Simulation
                </button>
                
                <button 
                  onClick={resetSimulation}
                  className="flex-1 bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 border-2 border-slate-300 text-slate-800 font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset All
                </button>
              </div>
            </div>
            
            {results && metrics && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 card-hover fade-in">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800">Simulation Results</h2>
                </div>
                
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-6 text-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                    Gantt Chart
                  </h3>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 shadow-lg">
                    <GanttChart ganttChart={metrics.ganttChart} />
                  </div>
                </div>
                
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-6 text-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                    Process Details
                  </h3>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 shadow-lg">
                    <ResultsTable results={results} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-blue-700 font-semibold mb-2">Average Waiting Time</p>
                      <p className="text-4xl font-bold text-blue-800">{metrics.averageWaitingTime.toFixed(2)}</p>
                      <p className="text-xs text-blue-600 mt-1">time units</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <p className="text-sm text-purple-700 font-semibold mb-2">Average Turnaround Time</p>
                      <p className="text-4xl font-bold text-purple-800">{metrics.averageTurnaroundTime.toFixed(2)}</p>
                      <p className="text-xs text-purple-600 mt-1">time units</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}