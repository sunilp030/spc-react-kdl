
import React from 'react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from "../../../utils/Loader";

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
import { Chart } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Hammer from "hammerjs";
import moment from 'moment';
import Modal from "react-modal";
Modal.setAppElement("#root");

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    annotationPlugin,
    zoomPlugin,
    ChartDataLabels
);


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
    backgroundColor: "white",
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

const mainChart = {
    width: '100%',
    height: '30rem'
}
const body = {
    overflow: "auto"
}


const XbarChart = ({ chartConfig, chartData, xyPairList, charId, dataTable }) => {

    const [xchartConfig, setChartConfig] = useState([]);
    const [xchartData, setChartData] = useState([]);
    const [x_xyPairData, setXYPairData] = useState([]);
    const [xChart_xyPairData, setXChartXYPairData] = useState([]);
    const [rChart_xyPairData, setRChartXYPairData] = useState([]);
    const [dataTableList, setDataTableList] = useState([]);
    const [charNameList, setCharNameList] = useState([]);
    const [xul, setXUl] = useState('');
    const [xll, setXLL] = useState('');
    const [xm, setXM] = useState('');
    const [rul, setRUl] = useState('');
    const [rll, setRLL] = useState('');
    const [rm, setRM] = useState('');
    const [llth, setLlth] = useState('');
    const [ulth, setUlth] = useState('');
    const [meanDate, setMeanDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [meanReading, setMeanReading] = useState('');
    const [maxReading, setMaxReading] = useState('');
    const [cp, setCp] = useState('');
    const [cpk, setCpk] = useState('');
    const [x_xAxisMaxLength, setX_XAxisMaxLength] = useState();
    const [r_xAxisMaxLength, setR_XAxisMaxLength] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setLoader] = useState(false);
    const [xBarlabels, setXBarLabels] = useState([]);
    const [rBarlabels, setRBarLabels] = useState([]);

    useEffect(async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (chartConfig != null && chartData != null) {
            var tempChartConfig = [];
            if (chartConfig.length > 0) {
                for (var i = 0; i < chartConfig.length; i++) {
                    if (chartConfig[i]['CharacteristicsId'] == charId) {
                        tempChartConfig.push(chartConfig[i]);
                    }
                }
            }
            setChartConfig(tempChartConfig);
            var tempChartData = [];
            var no = 1;
            if (chartData.length > 0) {
                for (var i = 0; i < chartData.length; i++) {
                    if (chartData[i]['characterID'] == charId) {
                        chartData[i]['srNo'] = no.toString();
                        tempChartData.push(chartData[i]);
                        no++;
                    }
                }
            }
            setChartData(tempChartData);
            var tempDataTable = [];
            if (dataTable.length > 0) {
                for (var i = 0; i < dataTable.length; i++) {
                    if (dataTable[i]['character_id'] == charId) {
                        tempDataTable.push(dataTable[i]);
                    }
                }
            }
            setDataTableList(tempDataTable);
            var xChartList = [];
            var rChartList = [];
            for (var i = 0; i < tempChartData.length; i++) {
                var xMap = {
                    x: tempChartData[i]['srNo'].toString(),
                    y: tempChartData[i]['XReading'].toString(),
                    label: '',
                    desc: ''
                };
                xChartList.push(xMap);
                var rMap = {
                    x: tempChartData[i]['srNo'].toString(),
                    y: tempChartData[i]['RReading'].toString(),
                    label: '',
                    desc: ''
                };
                rChartList.push(rMap);
            }
            setX_XAxisMaxLength(xChartList.length);
            setR_XAxisMaxLength(rChartList.length);
            setXChartXYPairData(xChartList);
            setRChartXYPairData(rChartList);
            var xll = '';
            var xm = '';
            var xul = '';
            var rll = '';
            var rm = '';
            var rul = '';


            var confData = tempChartConfig;
            if (confData.length > 2) {
                console.log("xbar conf data", confData);
                for (var i = 0; i < confData.length; i++) {
                    if (confData[i]['Key'].toString().toLowerCase() == 'xul') {
                        setXUl(confData[i]['Value']);
                        xul = confData[i]['Value'];
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'xll') {
                        setXLL(confData[i]['Value']);
                        xll = confData[i]['Value'];
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'xm') {
                        setXM(confData[i]['Value']);
                        xm = confData[i]['Value'];
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'rul') {
                        setRUl(confData[i]['Value']);
                        rul = confData[i]['Value'];
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'rll') {
                        setRLL(confData[i]['Value']);
                        rll = confData[i]['Value'];
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'rm') {
                        setRM(confData[i]['Value']);
                        rm = confData[i]['Value'];
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'mindate') {
                        setMeanDate(confData[i]['Value'] + '00:00:00');
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'maxdate') {
                        setMaxDate(confData[i]['Value'] + '24:00:00');
                    } else if (confData[i]['Key'].toString().toLowerCase() == "minreadingx") {
                        setMeanReading(confData[i]['Value']);
                    } else if (confData[i]['Key'].toString().toLowerCase() == "maxreadingx") {
                        setMaxReading(confData[i]['Value']);
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'cp') {
                        setCp(confData[i]['Value']);
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'cpk') {
                        setCpk(confData[i]['Value']);
                    }
                }
                var xlabelList = [xll,xm,xul];
                var rlabelList = [rll,rm,rul];
                setXBarLabels(xlabelList);
                setRBarLabels(rlabelList);
            }
        }

    }, []);

    const refs = dataTableList.reduce((acc, value) => {
        acc[value.srNo] = React.createRef();
        return acc;
    }, {});

    const handleClick = (id) => {
        try {
            refs[id].current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        } catch (e) {
            console.log('exception : ', e);
        }

    }

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
            var chartData = xchartData;
            var chartPointsX = element[0].element.$context.raw.x;
            var chartPointsY = element[0].element.$context.raw.y;
            var groupId = '';
            for (var i = 0; i < xchartData.length; i++) {
                if (chartData[i]['srNo'].toString() == chartPointsX.toString() && chartData[i]['XReading'] == chartPointsY) {
                    groupId = chartData[i]['grp'];
                } else {
                    chartData[i].isBackgroundColor = false;
                }
            }
            var dataTable = dataTableList;
            var srNo;
            for (var i = 0; i < dataTable.length; i++) {
                if (dataTable[i]['grp'] == groupId) {
                    dataTable[i].isBackgroundColor = true;
                    srNo = dataTable[i].srNo;
                } else {
                    dataTable[i].isBackgroundColor = false;
                }
            }
            setDataTableList([]);
            setDataTableList(dataTable);
            toggleModal(srNo);

        },
        resize: "0",
        plugins: {
            legend: false,
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    drag: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x'
                },
                pan: {
                    enabled: true,
                    mode: 'x'
                },
                limits: {
                    x: { min: 0, max: x_xAxisMaxLength },
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.parsed.y;
                        return label;
                    },
                    afterLabel: function (tooltipItem, data) {
                        return tooltipItem['raw']['desc'];
                    }
                }
            },
            datalabels: {
                color: 'black',
                align: 'end',
                labels: {
                    title: {
                        font: {
                            weight: 'bold'
                        },
                    },
                    value: {
                        color: 'black',

                    }
                }
            }
        },
        scales: {
            y: {
                display: true,
                position: "left",
                min: meanReading,
                max: maxReading,
                ticks: {
                    callback: (value, index, values) => {
                        console.log('callback values : ',values);
                        if (index == 0) {
                            value = xll
                            return value;
                        }
                        else if (index == Math.round((values.length - 1) / 2)) {
                            value = xm;
                            return value;
                        }
                        else if (index == (values.length - 1)) {
                            value = xul;
                            return value;
                        }
                    }
                },
                afterBuildTicks: axis => axis.ticks = xBarlabels.map(v => ({ value: v })),
                grid: {
                    color: ($context) => {
                        console.log('context is : ',$context);
                        if ($context.tick.label == xm) {
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
                min: meanReading,
                max: maxReading,
                position: "right",
                // beginAtZero: true,
                grid: {
                    drawOnChartArea: false,
                    borderColor: 'white',
                },
                ticks: {
                    callback: function (value, index, values) {
                        console.log('value is : ',value);
                        console.log('index is : ',index);
                        console.log('values is : ',values);
                        if (index == 0) {
                            return "LCL";
                        }
                        else if (index == Math.round((values.length - 1) / 2)) {
                            return "MEAN";
                        }
                        else if (index == (values.length - 1)) {
                            return "UCL";
                        }
                    }
                },
                afterBuildTicks: (axis)=> {
                    console.log('label after : ',axis);
                    axis.ticks = [xll,xm,xul].map(v => ({
                         value: v 
                        }))
                    console.log('label after return : ',axis.ticks);
                },
            },
            x: {
                display: true,
                type: 'linear',
                min: 0,
                max: x_xAxisMaxLength,
                grid: {
                    color: "white",
                    borderColor: xul == maxReading ? "red" : "grey",
                    ticks: "white",
                },
                ticks: {
                    callback: function (value) {
                        if (Math.floor(value) === value) {
                            return value
                        }
                    }
                }
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
                // yAxisId: "y",
            },
        ],
    };

    const optionsForR = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (e, element) => {
            var chartData = xchartData;
            var chartPointsX = element[0].element.$context.raw.x;
            var chartPointsY = element[0].element.$context.raw.y;
            var groupId = '';
            for (var i = 0; i < xchartData.length; i++) {
                if (chartData[i]['srNo'].toString() == chartPointsX.toString() && chartData[i]['XReading'] == chartPointsY) {
                    groupId = chartData[i]['grp'];
                } else {
                    chartData[i].isBackgroundColor = false;
                }
            }
            var dataTable = dataTableList;
            var srNo;
            for (var i = 0; i < dataTable.length; i++) {
                if (dataTable[i]['grp'] == groupId) {
                    dataTable[i].isBackgroundColor = true;
                    srNo = dataTable[i].srNo;
                    // handleClick(dataTable[i].srNo)
                } else {
                    dataTable[i].isBackgroundColor = false;
                }
            }
            setDataTableList([]);
            setDataTableList(dataTable);
            toggleModal(srNo);
            // e.preventDefault();
        },
        plugins: {
            legend: false,
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    drag: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x'
                },
                pan: {
                    enabled: true,
                    mode: 'x'
                },
                // pan: {enabled:'true', mode: 'xy'},
                limits: {
                    x: { min: 0, max: r_xAxisMaxLength },
                },

            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.parsed.y;
                        return label;
                    },
                    afterLabel: function (tooltipItem, data) {
                        return tooltipItem['raw']['desc'];
                    }
                }
            },
            datalabels: {
                color: 'black',
                align: 'end',
                labels: {
                    title: {
                        font: {
                            weight: 'bold'
                        },
                    },
                    value: {
                        color: 'black',

                    }
                }
            }

        },
        scales: {
            y: {
                display: true,
                position: "left",
                min: rll,
                max: rul,
                ticks: {
                    precision: 0,
                    callback: (value, index, values) => {
                        // return value;
                        if (index == 0) {
                            return rll;
                        }
                        else if (index == Math.round((values.length - 1) / 2)) {
                            return rm;
                        }
                        else if (index == (values.length - 1)) {
                            return rul;
                        }
                    }
                },
                afterBuildTicks: axis => axis.ticks = rBarlabels.map(v => ({ value: v })),
                grid: {
                    color: ($context) => {
                        if ($context.tick.label == rm) {
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
                            return "LCL";
                        }
                        else if (index == Math.round((values.length - 1) / 2)) {
                            return "MEAN";
                        }
                        else if (index == (values.length - 1)) {
                            return "UCL";
                        }
                    }
                }
            },
            x: {
                display: true,
                type: 'linear',
                min: 0,
                max: r_xAxisMaxLength,
                grid: {
                    color: "white",
                    borderColor: "red",
                    ticks: "white",
                },
                ticks: {
                    callback: function (value) {
                        if (Math.floor(value) === value) {
                            return value
                        }
                    }
                }
            },
        },
    }

    const rowStyle = {
        backgroundColor: "yellow",
    }
    const rowStyleWhite = {
        backgroundColor: "white",
    }

    const DataTable = ({ srNo, xreading, rreading, isBackgroundColor, data1reading, data1timestamp, data2reading, data2timestamp, data3reading, data3timestamp, data4reading, data4timestamp }) => {
        return (
            <tbody
                id={srNo}>
                <tr key={srNo} ref={refs[srNo]} style={isBackgroundColor ? rowStyle : rowStyleWhite} id={isBackgroundColor ? 'isActive' : ""}>
                    <td>{srNo}</td>
                    <td>{xreading}</td>
                    <td>{rreading}</td>
                    <td>{data1reading}</td>
                    <td>{data1timestamp}</td>
                    <td>{data2reading}</td>
                    <td>{data2timestamp}</td>
                    <td>{data3reading}</td>
                    <td>{data3timestamp}</td>
                    <td>{data4reading}</td>
                    <td>{data4timestamp}</td>
                </tr>
            </tbody>
        );
    };

    //toggle model for delete.................................
    function toggleModal(srNo) {
        setIsOpen(!isOpen);
        if (srNo != null && srNo != undefined && srNo != '') {
            handleClick(srNo)
        }

    }

    return (
        <>
            {isLoading ? (
                <Loader></Loader>
            ) : (
                null
            )}
            <ToastContainer autoClose={5000} hideProgressBar={false} />

            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}>
                <div class="modal-dialog custom_modal_dialog" style={{ maxWidth: '800px' }}>
                    <div class="modal-content" style={{ borderRadius: '0px' }}>
                        <div class="modal-header">

                            <h4 class="modal-title modal_title_text">Chart Details</h4>
                            <button type="button" class="close" data-dismiss="modal" onClick={toggleModal}>&times;</button>
                        </div>
                        <div class="modal-body">
                            <div className='col-md-12 chart_table' id="DataTableStyle1">

                                <div class="table_wrapper">
                                    <div class="hack1">
                                        <div class="hack2 fixed_table_header" style={{ overflowY: 'scroll', maxHeight: '65rem', display: 'inline-block', marginTop: '0.8rem' }}>
                                            <table class="table table-bordered table-striped mg-b-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr No.</th>
                                                        <th>X-Reading</th>
                                                        <th>R-Reading</th>
                                                        <th>First Reading</th>
                                                        <th>First Timestamp</th>
                                                        <th>Second Reading</th>
                                                        <th>Second Timestamp</th>
                                                        <th>Third Reading</th>
                                                        <th>Third Timestamp</th>
                                                        <th>Fourth Reading</th>
                                                        <th>Fourth Timestamp</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataTableList.map((px, index) => (
                                                        <DataTable
                                                            key={px.srNo}
                                                            srNo={px.srNo}
                                                            xreading={px.XBar}
                                                            rreading={px.RBar}
                                                            isBackgroundColor={px.isBackgroundColor}
                                                            data1reading={px.data1reading}
                                                            data1timestamp={px.data1timestamp}
                                                            data2reading={px.data2reading}
                                                            data2timestamp={px.data2timestamp}
                                                            data3reading={px.data3reading}
                                                            data3timestamp={px.data3timestamp}
                                                            data4reading={px.data4reading}
                                                            data4timestamp={px.data4timestamp}
                                                        />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </Modal>
            <div style={{ display: 'flex', height: '72vh', overflow: 'auto' }}>
                {xChart_xyPairData.length > 0 ?
                    (<> <div className='col-md-9' style={{ width: '100%' }}>
                        <h4>X Bar Chart</h4>
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <div style={{ width: '100%', height: '280px' }}>
                                
                                {xChart_xyPairData.length > 0 ? (
                                    <Chart type='line' data={data} options={options} plugins={ChartDataLabels} width="0" height="300" />
                                ) : (null)}
                            </div>
                        </div>
                        <hr/>
                        <h4>R Bar Chart</h4>
                        <div style={{ width: '100%', overflowX: 'auto', paddingTop: '3rem' }}>
                            <div style={{ width: '100%', height: '280px' }}>
                                
                                {rChart_xyPairData.length > 0 ? (
                                    <Chart type='line' data={dataForR} options={optionsForR} plugins={ChartDataLabels} width="0" height="300" />
                                ) : (null)}
                            </div>
                        </div>

                    </div>
                        <div className='col-md-3' style={{ width: '100%' }}>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <lable><b>CP</b></lable>
                                    <h3>{cp}</h3>
                                </div>
                                <div className='col-md-4'>
                                    <lable><b>CPK</b></lable>
                                    <h3>{cpk}</h3>
                                </div>
                            </div>
                            <button type="button" class="btn ViewChart_btn" onClick={()=> toggleModal('')} style={{ margin: '10px 5px', position: 'absolute', top: '0rem', right: '0rem', zIndex: '1' }}><i class="fa fa-eye" title='View Data'></i> </button>

                        </div>

                    </>) : (<div className='text-center m-auto'>No data found</div>)}
            </div>
            <hr/>

            
        </>
    );
}

export default XbarChart;