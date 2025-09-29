import { Process, ProcessResult, ResultMetrics } from '../types';

type Queue = {
  quantum: number;
};

export const mlfq = (
  processes: Process[],
  quantums: number[]
): { results: ProcessResult[]; metrics: ResultMetrics } => {
  const queues: Queue[] = quantums.map(q => ({ quantum: q }));

  const results: ProcessResult[] = [];
  const ganttChart: { processId: string; start: number; end: number }[] = [];

  // Initialize process tracking
  const remainingBurstTime = new Map(processes.map(p => [p.id, p.burstTime]));
  const timeInCurrentQueue = new Map(processes.map(p => [p.id, 0]));
  const processArrivalTimes = new Map(processes.map(p => [p.id, p.arrivalTime]));

  let currentTime = 0;
  const readyQueues: Process[][] = queues.map(() => []);

  // Sort processes by arrival time for proper scheduling
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  while (true) {
    // Add processes that have arrived to their appropriate queues
    for (const process of sortedProcesses) {
      if (processArrivalTimes.get(process.id)! <= currentTime && 
          remainingBurstTime.get(process.id)! > 0) {
        // Check if process is already in a ready queue
        const alreadyInQueue = readyQueues.some(queue => 
          queue.some(p => p.id === process.id)
        );
        
        if (!alreadyInQueue) {
          const priority = Math.min(process.priority ?? 0, queues.length - 1);
          readyQueues[priority].push(process);
          timeInCurrentQueue.set(process.id, 0);
        }
      }
    }

    // Find the highest priority non-empty queue
    let currentQueueIndex = -1;
    for (let i = 0; i < readyQueues.length; i++) {
      if (readyQueues[i].length > 0) {
        currentQueueIndex = i;
        break;
      }
    }

    // If no processes are ready, advance time to next arrival
    if (currentQueueIndex === -1) {
      const nextArrival = sortedProcesses.find(p => 
        processArrivalTimes.get(p.id)! > currentTime && 
        remainingBurstTime.get(p.id)! > 0
      );
      
      if (nextArrival) {
        currentTime = processArrivalTimes.get(nextArrival.id)!;
        continue;
      } else {
        break; // No more processes to schedule
      }
    }

    const currentQueue = readyQueues[currentQueueIndex];
    const process = currentQueue.shift()!;

    const quantum = queues[currentQueueIndex].quantum;
    const burstLeft = remainingBurstTime.get(process.id)!;
    const timeInQueue = timeInCurrentQueue.get(process.id)!;
    
    // Calculate execution time
    let execTime = Math.min(burstLeft, quantum - timeInQueue);
    
    // Ensure we always execute at least 1 time unit if there's remaining burst time
    if (execTime <= 0 && burstLeft > 0) {
      execTime = 1;
    }

    const startTime = currentTime;
    const endTime = startTime + execTime;

    ganttChart.push({ processId: process.id, start: startTime, end: endTime });

    // Update remaining burst time and time in current queue
    remainingBurstTime.set(process.id, burstLeft - execTime);
    timeInCurrentQueue.set(process.id, timeInQueue + execTime);
    currentTime = endTime;

    // Check if process is completed
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
    } else {
      // Process not completed, decide where to put it next
      const totalTimeInQueue = timeInCurrentQueue.get(process.id)!;
      
      if (totalTimeInQueue >= quantum) {
        // Process used up its time quantum, move to lower priority queue
        timeInCurrentQueue.set(process.id, 0);
        
        if (currentQueueIndex < readyQueues.length - 1) {
          // Move to next lower priority queue
          readyQueues[currentQueueIndex + 1].push(process);
        } else {
          // Already in lowest priority queue, put back at the end of same queue
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