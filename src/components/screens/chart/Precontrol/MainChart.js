import * as React from 'react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';
Chart.register(...registerables, zoomPlugin, annotationPlugin);

const labels = [
  '1:00 am', '2:03 am', '3:00 am', '4:00 am', '5:00 am', '6:00 am', '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am', '12:00 am',
  '13:00 pm', '14:00 pm', '15:00 pm', '16:00 pm', '17:00 pm', '18:00 pm', '19:00 pm', '20:00 pm',
  '21:00 pm', '22:00 pm', '23:00 pm', '24:00 pm',

];

const dataValue = [{
    x: '2022-03-25 00:00:00',
    y: 246.33
}, {
    x: '2022-03-27 01:00:28',
    y: 246.35
}, {
    x: '2022-03-30 00:00:00',
    y: 246.39
}];

const scrollTo = (position) => {
  const project = document.getElementById(position);
  window.scrollIntoView();
}

const rowStyle = {
  backgroundColor: "red",
}
const rowStyleWhite = {
  backgroundColor: "white",
}

const DataTableStyle = {
  margin: "2rem 2rem",
  width: "50%",
  height: '30rem',
  "overflow-y": "scroll ",
};

const table = {
  height: '40rem',
};

class MainChart extends React.Component {
  chart = null;
  ul_chart = '';
  ll_chart= '';
  m_chart = '';
  ucl_chart = '';
  lcl_chart = '';
  ulth_chart = '246.45';
  llth_chart = '246.34'; 

  dataLabels =[246.34,246.35,246.37,246.39,246.41,246.43,246.45];


  constructor(props) {
    super(props);
    this.state = {
      chartDataDetails: props,
      ul: '',
      ll: '',
      m: '',
      ucl: '',
      lcl: '',
      ulth: '',
      llth: '',
     

    };
    this.getData = this.getData.bind(this);
    this.getData();
  }

  getData = () => {}

  componentDidMount() {
    var confData = this.props.chartConfig;
    if(confData.length > 2){
      for(var i=0; i < confData.length; i++){
        if(confData[i]['Key'].toString().toLowerCase() == 'ul'){
          this.setState({
            ul : confData[i]['Value']
          });
          this.ul_chart = confData[i]['Value'];
        }else if(confData[i]['Key'].toString().toLowerCase() == 'll'){
          this.setState({
            ll : confData[i]['Value']
          });
          this.ll_chart = confData[i]['Value'];
        }else if(confData[i]['Key'].toString().toLowerCase() == 'm'){
          this.setState({
            m : confData[i]['Value']
          });
          this.m_chart = confData[i]['Value'];
        }else if(confData[i]['Key'].toString().toLowerCase() == 'ucl'){
          this.setState({
            ucl : confData[i]['Value']
          });
          this.ucl_chart = confData[i]['Value'];
        }else if(confData[i]['Key'].toString().toLowerCase() == 'lcl'){
          this.setState({
            lcl : confData[i]['Value']
          });
          this.lcl_chart = confData[i]['Value'];
        }else if(confData[i]['Key'].toString().toLowerCase() == 'ulth'){
          this.setState({
            ulth : confData[i]['Value']
          });
        }else if(confData[i]['Key'].toString().toLowerCase() == 'llth'){
          this.setState({
            llth : confData[i]['Value']
          });
        }
      }
    }
    this.annotation0['yMin'] = this.llth_chart;
    this.annotation0['yMax'] = this.ll_chart;
    this.annotation1['yMin'] = this.ll_chart;
    this.annotation1['yMax'] = this.lcl_chart;
    this.annotation2['yMin'] = this.lcl_chart;
    this.annotation2['yMax'] = this.m_chart;
    this.annotation3['yMin'] = this.m_chart;
    this.annotation3['yMax'] = this.ucl_chart;
    this.annotation4['yMin'] = this.ucl_chart;
    this.annotation4['yMax'] = this.ul_chart;
    this.annotation5['yMin'] = this.ul_chart;
    this.annotation5['yMax'] = this.ulth_chart;

    this.configureChart();
  }

  annotation0 = {
    type: 'box',
    yMin: '',
    yMax: '',
    backgroundColor: 'rgba(254, 108, 58, 1)',
    borderColor: 'black',
    drawTime: 'beforeDatasetsDraw',
    borderWidth: 0.2,
    borderRadius: 0,
  };
  
  annotation1 = {
    type: 'box',
    yMin: '',
    yMax: '',
    backgroundColor: 'rgba(255,222,173)',
    borderColor: 'black',
    drawTime: 'beforeDatasetsDraw',
    borderWidth: 0.2,
    borderRadius: 0,
  
  };
  
  annotation2 = {
    type: 'box',
    yMin: '',
    yMax: '',
    backgroundColor: 'green',
    borderColor: 'black',
    drawTime: 'beforeDatasetsDraw',
    borderWidth: 0.2,
    borderRadius: 0,
  };
  
  annotation3 = {
    type: 'box',
    yMin: '',
    yMax: '',
    backgroundColor: 'green',
    drawTime: 'beforeDatasetsDraw',
    borderColor: 'black',
    borderWidth: 0.2,
    borderRadius: 0,
  };
  
  annotation4 = {
    type: 'box',
    yMin: '',
    yMax: '',
    backgroundColor: 'rgba(255,222,173)',
    drawTime: 'beforeDatasetsDraw',
    borderColor: 'black',
    borderWidth: 0.2,
    borderRadius: 0,
    tricksColor: 'black'
  };
  
  annotation5 = {
    type: 'box',
    yMin: '',
    yMax: '',
    backgroundColor: 'rgba(254, 108, 58, 1)',
    drawTime: 'beforeDatasetsDraw',
    borderWidth: 0.2,
    borderRadius: 0,
    borderColor: "black"
  };

  
  
  options= {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (e, element) => {
      var chartPointsX = element[0].element.$context.raw.x;
      var chartPointsY = element[0].element.$context.raw.y;
      for (var i = 0; i < this.props.chartData.length; i++) {
        if (this.props.chartData[i]['DateTime'].toString() == chartPointsX.toString() && this.props.chartData[i]['Reading'] == chartPointsY) {
          this.props.chartData[i].isBackgroundColor = true;
          scrollTo(this.props.chartData[i].srNo);
          this.setState({});
        } else {
          this.props.chartData[i].isBackgroundColor = false;
        }
      }
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
        }
      },
      annotation: {
        annotations: {
          annotation0 : this.annotation0,
          annotation1 : this.annotation1,
          annotation2 : this.annotation2,
          annotation3 : this.annotation3,
          annotation4 : this.annotation4,
          annotation5 : this.annotation5,
        }
      },
      
      legend: {
        display: false,
      }
  
    },
    scales: {
      y: {
        min: this.llth_chart,
        max: this.ulth_chart,
        ticks: {
          autoSkip: false,
          precisioin: 0,
          min: 0,
          callback:  (value, index, values) => {
            
            if(index == 0){
              return this.llth_chart;
            }
            if(index == 1){
              return this.ll_chart;
            }
            if(index == 2){
              return this.lcl_chart;
            }
            if(index == 3){
              return this.m_chart;
            }
            if(index == 4){
              return this.ucl_chart;
            }
            if(index == 5){
              return this.ul_chart;
            }
            if(index == 6){
              return this.ulth_chart;
            }
          }
        },
        grid: {
          borderColor: 'black',
          color: "black",
          tickColor: "white",
          lineWidth: 1,
          drawBorder: true,
        },
      },
      x: {
        display: true,
        type: 'time',
        min: '2022-03-25 00:00:00',
        max: '2022-04-30 24:00:00',
        time: {
            unit: 'day'
        },
        
      }
    },
  }

  configureChart = () => {
    const chartCanvas = ReactDOM.findDOMNode(this.chart);
    var chartNew = new Chart(chartCanvas, {
      id: `chart_${this.props.xyPairList.length}`,
      type: "line",
      redraw: true,
      data: {
        datasets: [
          {
            type: 'line',
            label: '',
            lineTension: 0.2,
            fill: false,
            pointBorderColor: "blue",
            borderWidth: 2,
            borderColor: "blue",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderWidth: 3,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.props.xyPairList,
          },
        ],
      },
      options: this.options,
    });
    chartNew.update()
  };

  DataTable = ({srNo, date, reading, isBackgroundColor }) => {
    return (
      <tbody
        id={srNo}> 
        <tr key={srNo} style={isBackgroundColor ? rowStyle : rowStyleWhite} id={isBackgroundColor  ? 'isActive' : ""}>
          <td>{srNo}</td>
          <td>{date}</td>
          <td>{reading}</td>
        </tr>
      </tbody>
    );
  };

  render() {
    return (
     
    <div className='container'>
      <div className='row d-flex '>
      <div className='col-md-6'>
        <canvas ref={chart => {
          this.chart = chart}} redraw={true}
        />
        </div>

      <div className='col-md-6' style={DataTableStyle} id="DataTableStyle1">
        <tbody style={table} id={"myTable"} >
          <thead>
            <tr>
              <th>Id</th>
              <th>X Axis</th>
              <th>Y Axis</th>
            </tr>
          </thead>
          {this.props.chartData.map((px, index) => (
            <this.DataTable
              key={index}
              srNo ={px.srNo}
              date={px.DateTime}
              reading={px.Reading}
              isBackgroundColor={px.isBackgroundColor}
            />
          ))}
        </tbody>
    </div>
    </div>
    </div>
    );
  }
}

export default MainChart;