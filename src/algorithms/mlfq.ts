import { Process, ProcessResult, ResultMetrics } from '../types';

type Queue = {
  quantum: number;
};

export const mlfq = (
  processes: Process[],
  quantums: number[]
): { results: ProcessResult[]; metrics: ResultMetrics } => {
  const queues: Queue[] = quantums.map(q => ({ quantum: q }));

  const remainingProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  const results: ProcessResult[] = [];
  const ganttChart: { processId: string; start: number; end: number }[] = [];

  const remainingBurstTime = new Map(processes.map(p => [p.id, p.burstTime]));
  const timeInCurrentQueue = new Map(processes.map(p => [p.id, 0]));

  let currentTime = 0;

  const arrivalMap = new Map<number, Process[]>();
  for (const p of processes) {
    if (!arrivalMap.has(p.arrivalTime)) arrivalMap.set(p.arrivalTime, []);
    arrivalMap.get(p.arrivalTime)!.push(p);
  }

  const readyQueues: Process[][] = queues.map(() => []);

  while (
    remainingProcesses.length > 0 ||
    readyQueues.some(q => q.length > 0)
  ) {
    // Add arrived processes to their assigned priority queue
    if (arrivalMap.has(currentTime)) {
      arrivalMap.get(currentTime)!.forEach(p => {
        const priority = Math.min(p.priority ?? 0, queues.length - 1);
        readyQueues[priority].push(p);
        timeInCurrentQueue.set(p.id, 0);
      });
      arrivalMap.delete(currentTime);
    }

    let currentQueueIndex = readyQueues.findIndex(q => q.length > 0);
    if (currentQueueIndex === -1) {
      if (remainingProcesses.length > 0) {
        currentTime = remainingProcesses[0].arrivalTime;
        continue;
      } else {
        break;
      }
    }

    const currentQueue = readyQueues[currentQueueIndex];
    const process = currentQueue.shift()!;

    const quantum = queues[currentQueueIndex].quantum;
    const burstLeft = remainingBurstTime.get(process.id)!;
    const timeInQueue = timeInCurrentQueue.get(process.id)!;
    let execTime = Math.min(burstLeft, quantum - timeInQueue);
    
    // Ensure we always execute at least 1 time unit if there's remaining burst time
    if (execTime <= 0 && burstLeft > 0) {
      execTime = 1;
    }

    const startTime = currentTime;
    const endTime = startTime + execTime;

    ganttChart.push({ processId: process.id, start: startTime, end: endTime });

    remainingBurstTime.set(process.id, burstLeft - execTime);
    timeInCurrentQueue.set(process.id, timeInQueue + execTime);
    currentTime = endTime;

    if (remainingBurstTime.get(process.id)! === 0) {
      const completionTime = currentTime;
      const turnaroundTime = completionTime - process.arrivalTime;
      const waitingTime = turnaroundTime - process.burstTime;

      results.push({
        ...process,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
      });

      const idx = remainingProcesses.findIndex(p => p.id === process.id);
      if (idx !== -1) remainingProcesses.splice(idx, 1);
    } else {
      // Check if process used up its time quantum
      if (timeInCurrentQueue.get(process.id)! >= quantum) {
        // Move to next lower priority queue
        timeInCurrentQueue.set(process.id, 0);
        if (currentQueueIndex < readyQueues.length - 1) {
          readyQueues[currentQueueIndex + 1].push(process);
        } else {
          // Already in lowest priority queue, put back at the end
          readyQueues[currentQueueIndex].push(process);
        }
      } else {
        // Process didn't use up quantum, put back in same queue
        readyQueues[currentQueueIndex].push(process);
      }
    }
  }

  const averageWaitingTime =
    results.reduce((acc, r) => acc + r.waitingTime, 0) / results.length || 0;
  const averageTurnaroundTime =
    results.reduce((acc, r) => acc + r.turnaroundTime, 0) / results.length || 0;

  return {
    results,
    metrics: {
      averageWaitingTime,
      averageTurnaroundTime,
      ganttChart,
    },
  };
};