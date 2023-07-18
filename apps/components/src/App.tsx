import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

function App() {
  // @ts-ignore
  const data: any = window.document?.chartData;
  return (
    <div id="chart-loaded">
      <RadarChart
        cx={250}
        cy={180}
        outerRadius={150}
        width={500}
        height={350}
        data={data}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <Radar
          animationDuration={0}
          name="Mike"
          dataKey="percent"
          stroke="#0284c7"
          fill="#0284c7"
          fillOpacity={0.6}
        />
      </RadarChart>
    </div>
  );
}

export default App;
