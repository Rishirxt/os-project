import { Process, ProcessResult, ResultMetrics } from '../types';

export const roundRobin = (processes: Process[], quantum: number): { results: ProcessResult[]; metrics: ResultMetrics } => {
  const remainingProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const readyQueue: Process[] = [];
  const results: ProcessResult[] = [];
  const ganttChart = [];

  let currentTime = 0;
  const remainingBurstTime = new Map(processes.map(p => [p.id, p.burstTime]));
  const startTimes = new Map<string, number>();

  while (remainingProcesses.length > 0 || readyQueue.length > 0) {
    while (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime <= currentTime) {
      const p = remainingProcesses.shift()!;
      readyQueue.push(p);
    }

    if (readyQueue.length === 0) {
      if (remainingProcesses.length > 0) {
        currentTime = remainingProcesses[0].arrivalTime;
      }
      continue;
    }

    const currentProcess = readyQueue.shift()!;
    const executionTime = Math.min(remainingBurstTime.get(currentProcess.id)!, quantum);

    if (!startTimes.has(currentProcess.id)) {
      startTimes.set(currentProcess.id, currentTime);
    }
    
    const startTime = currentTime;
    currentTime += executionTime;
    remainingBurstTime.set(currentProcess.id, remainingBurstTime.get(currentProcess.id)! - executionTime);
    
    ganttChart.push({
        processId: currentProcess.id,
        start: startTime,
        end: currentTime
    });

    while (remainingProcesses.length > 0 && remainingProcesses[0].arrivalTime <= currentTime) {
        const p = remainingProcesses.shift()!;
        readyQueue.push(p);
    }

    if (remainingBurstTime.get(currentProcess.id)! > 0) {
        readyQueue.push(currentProcess);
    } else {
        const p = processes.find(p => p.id === currentProcess.id)!;
        const completionTime = currentTime;
        const turnaroundTime = completionTime - p.arrivalTime;
        const waitingTime = turnaroundTime - p.burstTime;

        results.push({
            ...p,
            startTime: startTimes.get(p.id)!,
            completionTime,
            turnaroundTime,
            waitingTime,
        });
    }
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