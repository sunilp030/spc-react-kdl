
import React from 'react';
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
'Jan',
'Feb',
'Mar',
'Apr',
'May',
'Jun',
'July',
'Aug',
'Sept',
'Oct',
'Nov',
'Dec'
];

const dataValue1 = [
 1,2,3,4,5,6,7,8,9,
];

// const dataValue2 = [
//     'LCL', 'MEAN', 'UCL'
// ];

export const data = {
   labels,
    datasets: [
        {
            type: 'line',
            label: " ",
            // lineTension: 0.1,
            // fill: false,
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
            data: dataValue1,
            // yAxisId: "y",
        }
    ],
};

export const options = {
    onClick: (e, element) => {
        alert(JSON.stringify(element[0].element.$context.parsed));
    },
    plugins: {
        legend: false ,
    },
    scales: {
        y: {
            display: true,
            grid: {
            
                borderColor: 'grey',
                tickColor: 'grey'
            },
        },
        // label: {
        //     // position: "right",
        //     beginAtZero: true,
        //     // stepSize : 3.5,
        //     grid: {
        //         // drawOnChartArea: false,
        //         borderColor: 'white',
        //     },
        // },
        x: {
            // type: 'time',
            // time: {
            //     unit: 'minute'
            //   },
            //   min: '2021-08-08T00:00:00',
            //   max: '2021-08-08T23:59:59',
            //   axisLabel: {
            //     formatter: (function(value){
            //         return moment(value).format('HH:mm');
            //     })
            // },
            // offset: true,
            display: true,
            grid: {
                color: "transparent",
                tickColor: "black",
                borderColor: "black",
            }
        },
    },
}

const mainLine = {
    width: '100%',
    height: '0.1rem',
    // backgroundColor : "red",
    borderTop: "2px solid green ",
    display: 'flex',
    margin: 'auto',
    'justify-content': 'center',
    marginLeft: '3rem !important',
}

const horizontalLineStyle = {
    borderTop: "2px solid green ",
}

const lineText = {
    color: 'blue',
    marginRight: "7rem",
    marginLeft: "7rem",
    marginTop: "-0.8rem",
    'z-index': '4',
    backgroundColor : "white",
    fontSize : "1.5rem",
}

const numberBox = {
    backgroundColor : "green",
    height:"1.5rem",
    width: "3px",
    marginTop: "-0.8rem",
} 

const numberText = {
 color : "green",
 marginTop: "2rem",
 marginLeft : '-0.5rem',
} 

const chart = {
    width: "90%",
    height: '65rem',
  }

export function PChart() {
    return <div>
        <Chart type='line' data={data} options={options}/>
    </div>;
}

export default PChart;