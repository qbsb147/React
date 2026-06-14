import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

// #endregion
const AreaChartGraph = ({ isAnimationActive = true, data }) => (
  <AreaChart
    style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
    responsive
    data = { data }
    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
  >
    <defs>
      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#185FA5" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#97C459" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#97C459" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="time" />
    <YAxis width="auto" />
    <Tooltip />
    <Area
      type="monotone"
      dataKey="newUser"
      stroke="#185FA5"
      fillOpacity={1}
      fill="url(#colorUv)"
      isAnimationActive={isAnimationActive}
    />
    <Area
      type="monotone"
      dataKey="existingUser"
      stroke="#97C459"
      fillOpacity={1}
      fill="url(#colorPv)"
      isAnimationActive={isAnimationActive}
    />
  </AreaChart>
);

export default AreaChartGraph;