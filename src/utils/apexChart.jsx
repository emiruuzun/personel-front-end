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
    background: "#f4f4f4", // Arka plan rengini açık gri yaparak grafiği öne çıkaralım
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800, // Yumuşak animasyonlarla çubukların belirmesini sağlıyoruz
    },
    toolbar: {
      show: true, // Grafik üzerine toolbar ekliyoruz
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
      borderRadius: 8, // Çubuklara hafif köşe yumuşatması ekleyerek modern bir görünüm kazandırıyoruz
    },
  },
  xaxis: {
    categories: workData
      ? workData.map((job) => `${job.companyName} - ${job.jobName}`)
      : [],
    labels: {
      style: {
        colors: "#333",
        fontSize: "12px",
        fontWeight: 600,
      },
      rotate: -45, // Etiketleri 45 derece eğik yapar
      maxHeight: 180, // Etiketlerin maksimum yüksekliğini sınırlar
    },
  },

  yaxis: {
    title: {
      text: "Saat",
      style: {
        color: "#333", // Y ekseni başlığını koyu ve dikkat çekici yapıyoruz
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    labels: {
      style: {
        colors: "#333", // Y ekseni etiketlerini daha belirgin hale getiriyoruz
        fontSize: "12px",
      },
      formatter: function (val) {
        const hours = Math.floor(val);
        const minutes = Math.round((val - hours) * 60);
        return `${hours} saat ${minutes} dakika`;
      },
    },
  },
  fill: {
    opacity: 1,
    colors: ["#1E90FF", "#32CD32", "#FFA500"], // Farklı veri serileri için dikkat çekici renkler
  },
  tooltip: {
    y: {
      formatter: function (val) {
        const hours = Math.floor(val);
        const minutes = Math.round((val - hours) * 60);
        return `${hours} saat ${minutes} dakika`;
      },
    },
    theme: "dark", // Tooltip temasını karanlık yaparak çubuklarla kontrast sağlıyoruz
  },
  title: {
    text: "Kullanıcı İş Detayları ve Çalışma Saatleri",
    align: "center",
    style: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#333", // Başlık rengini belirgin yapıyoruz
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "center",
    labels: {
      colors: "#333", // Efsane etiketlerini daha belirgin yapıyoruz
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "12px",
      colors: ["#333"], // Veri etiketlerini koyu renkle daha dikkat çekici yapıyoruz
    },
    formatter: function (val) {
      const hours = Math.floor(val);
      const minutes = Math.round((val - hours) * 60);
      return `${hours} saat ${minutes} dakika`;
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 2,
      color: "#000",
      opacity: 0.25, // Veri etiketlerine hafif gölge ekliyoruz
    },
  },
});

export const generateChartSeries2 = (workData) => {
  return workData
    ? [
        {
          name: "Çalışma Saatleri",
          data: workData.map((job) => {
            const match = job.workHours.match(/(\d+)\s*saat\s*(\d+)\s*dakika/);
            if (match) {
              const hours = parseFloat(match[1]);
              const minutes = parseFloat(match[2]);
              return (hours + minutes / 60).toFixed(2); // Ondalık basamak sayısını 2 ile sınırla
            }
            return 0;
          }),
        },
        {
          name: "Mesai Saatleri",
          data: workData.map((job) => {
            const match = job.overtimeHours.match(
              /(\d+)\s*saat\s*(\d+)\s*dakika/
            );
            if (match) {
              const hours = parseFloat(match[1]);
              const minutes = parseFloat(match[2]);
              return (hours + minutes / 60).toFixed(2); // Ondalık basamak sayısını 2 ile sınırla
            }
            return 0;
          }),
        },
      ]
    : [];
};
