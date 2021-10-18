const debug = require("debug")("app:config.box-line2");

export default function (params) {
  
  return {
    legend: {
      show: false
    },
    tooltip: {
      trigger: 'item',
      formatter: function (p) {
        let time = p.value[0].split('.')[0];
        time = time.replace('T', ' ');
        let value = `${p.value[1]} ${params.engineeringUnits}` ;
        return `${time}<br />${value}`;
      }
    },

    dataset: {
      // Provide data.
      source: null
    },
    xAxis: { type: 'time' },
    yAxis: {name: params.engineeringUnits},
    series: [{ type: 'line', smooth: true }]
  };
}
