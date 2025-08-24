import { ResultMetrics } from '../types';

type GanttChartProps = {
  ganttChart: ResultMetrics['ganttChart'];
};

export default function GanttChart({ ganttChart }: GanttChartProps) {
  if (ganttChart.length === 0) {
    return null;
  }

  const totalTime = ganttChart[ganttChart.length - 1].end;

  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h3 className="text-lg font-bold mb-4">Gantt Chart</h3>
      <div className="flex w-full h-12 relative overflow-hidden bg-gray-200 rounded-md">
        {ganttChart.map((item, index) => {
          const widthPercentage = ((item.end - item.start) / totalTime) * 100;
          const leftPosition = (item.start / totalTime) * 100;

          return (
            <div
              key={index}
              className="bg-gray-800 h-full flex items-center justify-center text-white text-xs font-bold whitespace-nowrap overflow-hidden border-r border-black"
              style={{ width: `${widthPercentage}%`, left: `${leftPosition}%`, position: 'absolute' }}
            >
              {item.processId}
            </div>
          );
        })}
      </div>
      <div className="flex w-full mt-2 relative text-black">
        <div className="absolute left-0 text-sm">{ganttChart[0].start}</div>
        {ganttChart.map((item) => (
          <div
            key={item.end}
            className="absolute text-sm"
            style={{ left: `${(item.end / totalTime) * 100}%` }}
          >
            {item.end}
          </div>
        ))}
      </div>
    </div>
  );
}