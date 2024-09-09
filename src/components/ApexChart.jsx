import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ data }) => {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: data.map((item) => item.topic),
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 3,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return '$ ' + val + ' thousands';
        },
      },
    },
  };

  const series = [
    {
      name: 'Doğru Cevaplar',
      data: data.map((item) => item.correct),
    },
    {
      name: 'Yanlış Cevaplar',
      data: data.map((item) => item.wrong),
    },
    {
      name: 'Toplam Sorular',
      data: data.map((item) => item.total),
    },
  ];

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ApexChart;
