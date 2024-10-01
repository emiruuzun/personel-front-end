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

export const generateChartOptions2 = (workData) => ({
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  xaxis: {
    // Firma adı ve iş adını göstermek için kategoriler
    categories: workData
      ? workData.map((job) => `${job.companyName} - ${job.jobName}`)
      : [],
  },
  yaxis: {
    title: {
      text: "Saat",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " saat";
      },
    },
  },
  title: {
    text: "Kullanıcı İş Detayları ve Çalışma Saatleri",
    align: "center",
  },
  legend: {
    position: "top",
  },
});

// export const generateChartSeries2 = (workData) => {
//   if (!workData) {
//     return [];
//   }

//   return [
//     {
//       name: "Çalışma Saatleri",
//       data: workData.map((firm) => firm.workingHours || 0), // Çalışma saatleri verileri
//     },
//     {
//       name: "Mesai Saatleri",
//       data: workData.map((firm) => firm.overtimeHours || 0), // Mesai saatleri verileri
//     },
//   ];
// };
