
import React from 'react';
import { useEffect, useState } from 'react';

import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from 'chart.js';
// import 'chartjs-plugin-zoom'
import { Chart } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import Hammer from "hammerjs";
import moment from 'moment';
// moment().format();

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    annotationPlugin,
    zoomPlugin
    // gradient
);


const labels = [

    moment('1:30:00', "HH:mm:ss").format("LT"),
    moment('4:31:00', "HH:mm:ss").format("LT"),
    moment('5:00:00', "HH:mm:ss").format("LT"),
    moment('12:10:00', "HH:mm:ss").format("LT"),
    moment('15:30:00', "HH:mm:ss").format("LT"),

];

const dataValue1 = [
    84.999,
    84.999,
    84.999,
    84.99699,
    84.99599,
];

// const dataValue2 = [
//     'LCL', 'MEAN', 'UCL'
// ];



 

const mainLine = {
    width: '70%',
    height: '0.1rem',
    // backgroundColor : "red",
    borderTop: "2px solid green ",
    display: 'flex',
    margin: 'auto',
    'justify-content': 'center',
    marginLeft: '10px !important',
}

const horizontalLineStyle = {
    borderTop: "2px solid green ",
}

const lineText = {
    color: 'blue',
    marginRight: "4rem",
    marginLeft: "4rem",
    marginTop: "-0.7rem",
    'z-index': 4,
    backgroundColor : "white",
}

const numberBox = {
    backgroundColor: "green",
    height: "1.5rem",
    width: "3px",
    marginTop: "-0.8rem",
}

const numberText = {
    color: "green",
    marginTop: "2rem",
    marginLeft: '-0.5rem',
}

const chart = {
    width: "90%",
    height: '65rem',
}

const mainChart ={
    width: '50%',
    height:'30rem'
  }

  

const NPChart=({chartConfig,chartData,xyPairList})=> {

    const [xchartConfig, setChartConfig] = useState([]);
    const [xchartData, setChartData] = useState([]);
    const [x_xyPairData, setXYPairData] = useState([]);
    const [xChart_xyPairData, setXChartXYPairData] = useState([]);
    const [rChart_xyPairData, setRChartXYPairData] = useState([]);
    const [charNameList, setCharNameList] = useState([]);
    const [ul, setUl] = useState('');
    const [ll, setLL] = useState('');
    const [ucl, setUcl] = useState('');
    const [lcl, setLcl] = useState('');
    const [m, setM] = useState('');
    const [llth, setLlth] = useState('246.34');
    const [ulth, setUlth] = useState('246.45');

    useEffect(async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        console.log('chartConfig : ',chartConfig);
        console.log('chartData : ',chartData);
        console.log('xyPairList : ',xyPairList);
        if (chartConfig != null && chartData != null) {
            setChartConfig(chartConfig);
            setChartData(chartData);
            setXYPairData(xyPairList);
            var ucl = '';
            var lcl = '';
            var confData = chartConfig;
            if(confData.length > 2){
              for(var i=0; i < confData.length; i++){
                if(confData[i]['Key'].toString().toLowerCase() == 'ul'){
                    setUl(confData[i]['Value']);
                }else if(confData[i]['Key'].toString().toLowerCase() == 'll'){
                    setLL(confData[i]['Value']);
                }else if(confData[i]['Key'].toString().toLowerCase() == 'm'){
                    setM(confData[i]['Value']);
                }else if(confData[i]['Key'].toString().toLowerCase() == 'ucl'){
                    setUcl(confData[i]['Value']);
                    ucl = confData[i]['Value'];
                }else if(confData[i]['Key'].toString().toLowerCase() == 'lcl'){
                    setLcl(confData[i]['Value']);
                    lcl = confData[i]['Value'];
                }else if(confData[i]['Key'].toString().toLowerCase() == 'ulth'){
                    // setUlth(confData[i]['Value']);
                }else if(confData[i]['Key'].toString().toLowerCase() == 'llth'){
                    // setLlth(confData[i]['Value']);
                }
              }
            }
            var xChartList =[];
            var rChartList =[];
            for(var i=0; i < xyPairList.length; i++){
                if(xyPairList[i]['y'] >= ucl){
                    xChartList.push(xyPairList[i]);
                }else if(xyPairList[i]['y'] <= lcl){
                    rChartList.push(xyPairList[i]);
                }
            }
            setXChartXYPairData(xChartList);
            setRChartXYPairData(rChartList);
            // setCharNameList(props.location.state.charList);
        }

    }, []);

    const data = {
        datasets: [
            {
                type: 'line',
                label: " ",
                lineTension: 0.1,
                fill: false,
                // backgroundColor: 'transparent',
                // padding : '5%',
                borderWidth: 1,
                borderColor: "blue",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderWidth: 2,
                pointHoverRadius: 2,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: xChart_xyPairData,
                yAxisId: "y",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (e, element) => {
            alert(JSON.stringify(element[0].element.$context.parsed));
        },
        plugins: {
            legend: false,
            zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  drag:{
                    enabled: true
                  },
                  pinch: {
                    enabled: true
                  },
                  mode: 'x',
                }
              },
        },
        scales: {
            y: {
                display: true,
                position: "left",
                min: ucl,
                max: ulth,
                ticks: {
                    // stepSize: 2.5,
                    precisioin: 0,
                    padding: 50,
                    callback: (value,index,values) =>{
                        console.log("callback value: ",index," ",value," ",values);
                        if(value === ulth || value === ul || value === ucl){
                            return value;
                        }
                    }
                },
                grid: {
                    // borderDash: [1, 3],
                    color: ($context) => {
                        // console.log($context.tick.value);
                        if ($context.tick.value === ul) {
                            return "green";
                        }
                        else {
                            return "red";
                        }
                    },
                    borderColor: 'grey',
                    tickColor: 'grey'
                },
            },
            label: {
                position: "right",
                beginAtZero: true,
                // stepSize : 3.5,
                grid: {
                    drawOnChartArea: false,
                    borderColor: 'white',
                },
                ticks: {
                    callback: function (value, index, values) {
                        if (index == 0) {
                            return "UCL";
                        }
                        else if (index == 5) {
                            return "MEAN";
                        }
                        else if (index == 10) {
                            return "LCL";
                        }
                    }
                }
            },
            x: {
                display: true,
                type: 'time',
                min: '2022-03-25 00:00:00',
                max: '2022-04-30 24:00:00',
                time: {
                    // unit: 'hour'
                    unit: 'day'
                },
                // offset: true,
                // display: true,
                // grid: {
                //     color: "transparent",
                //     tickColor: "black",
                //     borderColor: "black",
                // }
            },
        },
    }

    const dataForR = {
        datasets: [
            {
                type: 'line',
                label: " ",
                lineTension: 0.1,
                fill: false,
                // backgroundColor: 'transparent',
                // padding : '5%',
                borderWidth: 1,
                borderColor: "blue",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderWidth: 2,
                pointHoverRadius: 2,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: rChart_xyPairData,
                yAxisId: "y",
            },
        ],
    };

    const optionsForR = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (e, element) => {
            alert(JSON.stringify(element[0].element.$context.parsed));
        },
        plugins: {
            legend: false,
            zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  drag:{
                    enabled: true
                  },
                  pinch: {
                    enabled: true
                  },
                  mode: 'x',
                }
              },
        },
        scales: {
            y: {
                display: true,
                position: "left",
                min: llth,
                max: lcl,
                ticks: {
                    // stepSize: 2.5,
                    precisioin: 0,
                    padding: 50,
                    callback: (value,index,values) =>{
                        console.log("callback value: ",index," ",value," ",values);
                        // if(value === lcl || value === ll || value === llth){
                        //     return value;
                        // }
                        return value;
                    }
                },
                grid: {
                    // borderDash: [1, 3],
                    color: ($context) => {
                        // console.log($context.tick.value);
                        if ($context.tick.value === ll) {
                            return "green";
                        }
                        else {
                            return "red";
                        }
                    },
                    borderColor: 'grey',
                    tickColor: 'grey'
                },
            },
            label: {
                position: "right",
                beginAtZero: true,
                // stepSize : 3.5,
                grid: {
                    drawOnChartArea: false,
                    borderColor: 'white',
                },
                ticks: {
                    callback: function (value, index, values) {
                        if (index == 0) {
                            return "UCL";
                        }
                        else if (index == 5) {
                            return "MEAN";
                        }
                        else if (index == 10) {
                            return "LCL";
                        }
                    }
                }
            },
            x: {
                display: true,
                type: 'time',
                min: '2022-03-25 00:00:00',
                max: '2022-04-30 24:00:00',
                time: {
                    // unit: 'hour'
                    unit: 'day'
                },
                // offset: true,
                // display: true,
                // grid: {
                //     color: "transparent",
                //     tickColor: "black",
                //     borderColor: "black",
                // }
            },
        },
    }

    return (
    <div>
        <div style={mainChart}>
            {xChart_xyPairData.length > 0 ? (
                <Chart type='line' data={data} options={options} />
            ) : (null)}
        </div>
        {/* <hr></hr> */}
        <div style={mainLine}>
            <div style={horizontalLineStyle}></div>
            <span style={numberBox}><p style={numberText}>21</p></span>

            <h5 style={lineText}>S2</h5>
            <span style={numberBox}><p style={numberText}>27</p></span>

            <div style={horizontalLineStyle}></div>
            <h5 style={lineText}>S2</h5>
            <span style={numberBox}><p style={numberText}>30</p></span>

            <div style={horizontalLineStyle}></div>
            <h5 style={lineText}>S1</h5>
            <span style={numberBox}><p style={numberText}>31</p></span>

            <div style={horizontalLineStyle}></div>
            <h5 style={lineText}>S1</h5>
            <span style={numberBox}><p style={numberText}>31</p></span>

            <div style={horizontalLineStyle}></div>
        </div>
        {/* <input type="range" ></input> */}
        <div style={mainChart}>
        {rChart_xyPairData.length > 0 ? (
                <Chart type='line' data={dataForR} options={optionsForR} />
            ) : (null)}
        </div>
    </div>
    );
}

export default NPChart;