export type Process = {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number; // Optional priority for MLFQ
};

export type ProcessResult = {
  id: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  startTime: number;
};

export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'RR' | 'MLFQ';

export type ResultMetrics = {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  ganttChart: Array<{
    processId: string;
    start: number;
    end: number;
  }>;
};