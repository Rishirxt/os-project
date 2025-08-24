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
    if (processes.length === 0) return;

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
    <div className="bg-white text-black min-h-screen">
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-4xl font-extrabold text-center my-8">OS-PROJECT</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center col-span-1 md:col-span-1 lg:col-span-1">
            <div className="w-full max-w-sm p-6 border border-gray-300 rounded-md shadow-lg bg-gray-100">
              <h2 className="text-xl font-bold mb-4">Add New Process</h2>
              <ProcessForm onAddProcess={addProcess} />
            </div>
            <div className="w-full max-w-sm mt-8 p-6 border border-gray-300 rounded-md shadow-lg bg-gray-100">
              <h2 className="text-2xl font-bold mb-4">Processes</h2>
              <ProcessList processes={processes} onDeleteProcess={deleteProcess} />
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-8">
            <div className="p-6 border border-gray-300 rounded-md shadow-lg bg-gray-100">
              <h2 className="text-2xl font-bold mb-4">Run Simulation</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                 <div className="flex flex-col gap-4">
                    <label htmlFor="algorithm-select" className="block text-sm font-medium text-black">Algorithm</label>
                    <select
                        id="algorithm-select"
                        value={selectedAlgorithm}
                        onChange={(e) => setSelectedAlgorithm(e.target.value as 'FCFS' | 'SJF' | 'RR')}
                        className="p-2 border border-gray-300 rounded-md text-black"
                    >
                        <option value="FCFS">FCFS</option>
                        <option value="SJF">SJF</option>
                        <option value="RR">Round Robin</option>
                    </select>
                    {selectedAlgorithm === 'RR' && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm">Quantum:</label>
                            <input
                                type="number"
                                value={quantum}
                                onChange={(e) => setQuantum(Number(e.target.value))}
                                className="w-24 p-2 border border-gray-300 rounded-md text-black"
                                min="1"
                            />
                        </div>
                    )}
                 </div>
              </div>
              <button onClick={handleStartSimulation} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                Start Simulation
              </button>
              <button onClick={resetSimulation} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 ml-4">
                Reset
              </button>
            </div>
            
            {results && metrics && (
              <div className="p-6 border border-gray-300 rounded-md shadow-lg bg-gray-100 text-black">
                <h2 className="text-2xl font-bold mb-4">Simulation Results</h2>
                <div className="mb-6">
                  <GanttChart ganttChart={metrics.ganttChart} />
                </div>
                <ResultsTable results={results} />
                <div className="mt-4 text-center">
                  <p className="font-semibold">Average Waiting Time: <span className="text-lg text-gray-700">{metrics.averageWaitingTime.toFixed(2)}</span></p>
                  <p className="font-semibold">Average Turnaround Time: <span className="text-lg text-gray-700">{metrics.averageTurnaroundTime.toFixed(2)}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}