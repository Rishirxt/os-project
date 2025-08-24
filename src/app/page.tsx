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
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-4 max-w-7xl">
        <header className="text-center py-8 mb-8 border-b border-gray-200">
          <h1 className="text-5xl font-bold text-blue-800">
            CPU Scheduling Simulator
          </h1>
          <p className="mt-2 text-gray-600">Visualize and compare different CPU scheduling algorithms</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Process Management */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Process
              </h2>
              <ProcessForm onAddProcess={addProcess} />
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2zm2 4v-2h2v2h-2zm2-4h-2v-2h2v2zm0-4h-2V6h2v2z" clipRule="evenodd" />
                  </svg>
                  Process List
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {processes.length} processes
                </span>
              </div>
              <ProcessList processes={processes} onDeleteProcess={deleteProcess} />
            </div>
          </div>
          
          {/* Right Panel - Simulation & Results */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Simulation Control
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduling Algorithm</label>
                  <div className="relative">
                    <select
                      value={selectedAlgorithm}
                      onChange={(e) => setSelectedAlgorithm(e.target.value as 'FCFS' | 'SJF' | 'RR')}
                      className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    >
                      <option value="FCFS">First-Come, First-Served (FCFS)</option>
                      <option value="SJF">Shortest Job First (SJF)</option>
                      <option value="RR">Round Robin (RR)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {selectedAlgorithm === 'RR' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Quantum</label>
                    <input
                      type="number"
                      value={quantum}
                      onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      min="1"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleStartSimulation} 
                  disabled={processes.length === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start Simulation
                </button>
                
                <button 
                  onClick={resetSimulation}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset All
                </button>
              </div>
            </div>
            
            {results && metrics && (
              <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Simulation Results
                </h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Gantt Chart</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <GanttChart ganttChart={metrics.ganttChart} />
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Process Details</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <ResultsTable results={results} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <div className="text-center">
                      <p className="text-sm text-blue-700 font-medium">Average Waiting Time</p>
                      <p className="text-3xl font-bold mt-2 text-blue-800">{metrics.averageWaitingTime.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                    <div className="text-center">
                      <p className="text-sm text-purple-700 font-medium">Average Turnaround Time</p>
                      <p className="text-3xl font-bold mt-2 text-purple-800">{metrics.averageTurnaroundTime.toFixed(2)}</p>
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