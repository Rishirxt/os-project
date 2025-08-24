import { Process } from '../types';

type ProcessListProps = {
  processes: Process[];
  onDeleteProcess: (id: string) => void;
};

export default function ProcessList({ processes, onDeleteProcess }: ProcessListProps) {
  if (processes.length === 0) {
    return <p className="text-center text-gray-700">No processes added yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Process ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Arrival Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Burst Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          {processes.map((p) => (
            <tr key={p.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{p.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.arrivalTime}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.burstTime}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button onClick={() => onDeleteProcess(p.id)} className="px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}