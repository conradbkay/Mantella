import React from 'react'
import { Line } from 'react-chartjs-2'

/* have a few graphs and for each they can select a project */

export const Dashboard = () => {
  return (
    <div style={{ maxWidth: 1000 }}>
      <Line data={{ datasets: [{ label: 'label', data: [4, 5, 7] }] }} />
    </div>
  )
}
