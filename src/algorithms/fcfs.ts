import { Process, ProcessResult, ResultMetrics } from '../types';

export const fcfs = (processes: Process[]): { results: ProcessResult[]; metrics: ResultMetrics } => {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  const results: ProcessResult[] = [];
  const ganttChart = [];

  for (const p of sortedProcesses) {
    const startTime = Math.max(currentTime, p.arrivalTime);
    const completionTime = startTime + p.burstTime;
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = startTime - p.arrivalTime;

    results.push({
      ...p,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    ganttChart.push({
      processId: p.id,
      start: startTime,
      end: completionTime,
    });
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