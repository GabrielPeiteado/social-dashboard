"use client";
import { useMemo } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
);

export function BarChart({ data, userNames }) {
  const barChartData = useMemo(() => {
    return {
      labels: userNames,
      datasets: [
        {
          label: "Followers",
          data: userNames.map(
            (userName) =>
              data
                .filter((item) => item.userName === userName)
                .reduce((acc, item) => acc + item.followers, 0)
          ),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  }, [data, userNames]);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const userName = tooltipItem.label;
            const userPlatforms = data
              .filter((item) => item.userName === userName)
              .map((item) => item.platform)
              .join(", ");

            return `Followers: ${tooltipItem.raw} | Platforms: ${userPlatforms}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Followers per User</h2>
      <Bar data={barChartData} options={options} />
    </div>
  );
}

export function LineChart({ data, userNames }) {
  const lineChartData = useMemo(() => {
    const uniquePlatforms = [...new Set(data.map((item) => item.platform))];

    return {
      labels: uniquePlatforms,
      datasets: [
        {
          label: "Total Posts per Platform",
          data: uniquePlatforms.map((platform) => {
            const filteredData = data.filter(
              (item) => item.platform === platform
            );
            return filteredData.reduce((acc, item) => acc + item.postsCount, 0);
          }),
          borderColor: "rgb(255, 159, 64)",
          tension: 0.3,
        },
      ],
    };
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800">
      <h2 className="text-xl font-semibold mb-4">
        Engagement per User Over Time
      </h2>
      <Line data={lineChartData} />
    </div>
  );
}

export function PieChart({ data, userNames }) {
  const pieChartData = useMemo(() => {
    return {
      labels: userNames,
      datasets: [
        {
          label: "Total Posts",
          data: userNames.map((userName) =>
            data
              .filter((item) => item.userName === userName)
              .reduce((acc, item) => acc + item.postsCount, 0)
          ),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    };
  }, [data, userNames]);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const userName = tooltipItem.label;
            const userPlatforms = data
              .filter((item) => item.userName === userName)
              .map((item) => item.platform)
              .join(", ");
            return `Posts: ${tooltipItem.raw} | Platforms: ${userPlatforms}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800">
      <h2 className="text-xl font-semibold mb-4">
        Posts Distribution per User
      </h2>
      <Pie data={pieChartData} options={options} />
    </div>
  );
}

export function DoughnutChart({ data }) {
  const doughnutChartData = useMemo(() => {
    const platformCounts = data.reduce((acc, user) => {
      user.socialData.forEach((social) => {
        acc[social.platform] = (acc[social.platform] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      labels: Object.keys(platformCounts),
      datasets: [
        {
          label: "Users per Platform",
          data: Object.values(platformCounts),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    };
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Users per Platform</h2>
      <Doughnut data={doughnutChartData} />
    </div>
  );
}