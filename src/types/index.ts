export type Process = {
  id: string;
  arrivalTime: number;
  burstTime: number;
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

export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'RR';

export type ResultMetrics = {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  ganttChart: Array<{
    processId: string;
    start: number;
    end: number;
  }>;
};