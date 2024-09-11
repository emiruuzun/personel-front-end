export const chartOptions = {
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Yıllık İzin", "Mazeret İzni", "Hastalık İzni"],
  },
  yaxis: {
    title: {
      text: "Gün",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " gün";
      },
    },
  },
  title: {
    text: " İzin Kullanım Dağılımı",
    align: "center",
  },
};


export const generateChartSeries = (leaveData) => {
  if (!leaveData) {
    return [];
  }

  return [
    {
      name: "İzin Günleri",
      data: [
        leaveData["Yıllık İzin"] || 0,
        leaveData["Mazeret İzni"] || 0,
        leaveData["Hastalık İzni"] || 0,
      ],
    },
  ];
};
