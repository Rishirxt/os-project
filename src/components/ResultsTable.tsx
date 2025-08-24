import { ProcessResult } from '../types';

type ResultsTableProps = {
  results: ProcessResult[];
};

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnaround Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting Time</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((r) => (
            <tr key={r.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.arrivalTime}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.burstTime}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.completionTime}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.turnaroundTime}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.waitingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}