import { Process, ProcessResult, ResultMetrics } from '../types';

export const sjf = (processes: Process[]): { results: ProcessResult[]; metrics: ResultMetrics } => {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const remainingProcesses = [...sortedProcesses];
  const results: ProcessResult[] = [];
  const ganttChart = [];
  let currentTime = 0;

  while (remainingProcesses.length > 0) {
    const arrivedProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (arrivedProcesses.length === 0) {
      if (remainingProcesses.length > 0) {
        currentTime = remainingProcesses[0].arrivalTime;
      }
      continue;
    }
    
    arrivedProcesses.sort((a, b) => a.burstTime - b.burstTime);
    const p = arrivedProcesses[0];

    const completionTime = currentTime + p.burstTime;
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = currentTime - p.arrivalTime;

    results.push({
      ...p,
      startTime: currentTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    ganttChart.push({
      processId: p.id,
      start: currentTime,
      end: completionTime,
    });

    const index = remainingProcesses.findIndex(rp => rp.id === p.id);
    remainingProcesses.splice(index, 1);

    currentTime = completionTime;
  }

  const totalWaitingTime = results.reduce((sum, r) => sum + r.waitingTime, 0);
  const totalTurnaroundTime = results.reduce((sum, r) => sum + r.turnaroundTime, 0);

  const metrics: ResultMetrics = {
    averageWaitingTime: totalWaitingTime / results.length,
    averageTurnaroundTime: totalTurnaroundTime / results.length,
    ganttChart,
  };

  return { results, metrics };
};