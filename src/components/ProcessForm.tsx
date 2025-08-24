import { useState } from 'react';

type ProcessFormProps = {
  onAddProcess: (arrivalTime: number, burstTime: number) => void;
};

export default function ProcessForm({ onAddProcess }: ProcessFormProps) {
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProcess(arrivalTime, burstTime);
    setArrivalTime(0);
    setBurstTime(0);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700">Arrival Time</label>
        <input
          type="number"
          id="arrivalTime"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm text-black p-2"
          min="0"
          required
        />
      </div>
      <div>
        <label htmlFor="burstTime" className="block text-sm font-medium text-gray-700">Burst Time</label>
        <input
          type="number"
          id="burstTime"
          value={burstTime}
          onChange={(e) => setBurstTime(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm text-black p-2"
          min="1"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
        Add Process
      </button>
    </form>
  );
}