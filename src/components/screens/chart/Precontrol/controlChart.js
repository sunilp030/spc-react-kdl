
import React from 'react';
import { useEffect, useState,useRef } from 'react';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import Hammer from "hammerjs";
import Modal from "react-modal";
import moment from 'moment';
import { useMemo } from 'react';

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


const mainChart = {
    width: '100%',
    height: '30rem',
    overflowX: 'scroll'
}

const ControlChart = ({ chartConfig, chartData, xyPairList, charId, dataTable, chartView }) => {

    const [isLoading, setLoader] = useState(false);
    const [xchartConfig, setChartConfig] = useState([]);
    const [xchartData, setChartData] = useState([]);
    const [x_xyPairData, setXYPairData] = useState([]);
    const [x_xyPairPointWiseData, setXYPairPointWiseData] = useState([]);
    const [dataTableList, setDataTableList] = useState([]);
    const [charNameList, setCharNameList] = useState([]);
    const [ul, setUl] = useState('');
    const [ll, setLL] = useState('');
    const [ucl, setUcl] = useState('');
    const [lcl, setLcl] = useState('');
    const [m, setM] = useState('');
    const [llth, setLlth] = useState('');
    const [ulth, setUlth] = useState('');
    const [meanDate, setMeanDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [labels, setLabels] = useState([]);
    const [xAxisMaxLength, setXAxisMaxLength] = useState();
    const [xlabels, setXLabels] = useState([]);
    const [isOpen, setIsOpen] = useState(false);




    useEffect(async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setLoader(true);
        var date = '2022-04-03 15:50:00'
        if (chartConfig != null && chartData != null) {
            var tempChartConfig = [];
            if(chartConfig.length > 0){
                for(var i=0; i < chartConfig.length; i++){
                    if(chartConfig[i]['CharacteristicsId'] == charId){
                        tempChartConfig.push(chartConfig[i]);
                    }
                }
            }
            setChartConfig(tempChartConfig);
            console.log('config data : ',tempChartConfig);
            var tempChartData = [];
            var no=1;
            if(chartData.length > 0){
                for(var i=0; i < chartData.length; i++){
                    if(chartData[i]['CharacterID'] == charId){
                        chartData[i]['srNo'] = no;
                        tempChartData.push(chartData[i]);
                        no++;
                    }
                }
            }
            setChartData(tempChartData);
            console.log('chart data : ',tempChartData);
            var xyList = [];
            for (var i = 0; i < tempChartData.length; i++) {
                var xyMap = {
                  x: tempChartData[i]['DateTime'],
                  y: tempChartData[i]['Reading'],
                  label: tempChartData[i]['Event'] != null ? tempChartData[i]['Event'] : '',
                  desc: tempChartData[i]['Description'] != null ? tempChartData[i]['Description'] : '',
                };
                xyList.push(xyMap);
            }
            setXYPairData(xyList);
            console.log('xy data : ',xyList);

            var xyPointWiseList = [];
            var labelValue = [];
            for (var i = 0; i < tempChartData.length; i++) {
                var xyMap = {
                  x: i+1,
                  y: tempChartData[i]['Reading'],
                  label: tempChartData[i]['Event'] != null ? tempChartData[i]['Event'] : '',
                  desc: tempChartData[i]['Description'] != null ? tempChartData[i]['Description'] : '',
                };
                xyPointWiseList.push(xyMap);
                labelValue.push(i);
            }
            setXYPairPointWiseData(xyPointWiseList);
            setXAxisMaxLength(xyPointWiseList.length)
            setXLabels(labelValue)

            var tempDataTable = [];
            var no = 1;
            if(dataTable.length > 0){
                for(var i=0; i < dataTable.length; i++){
                    if(dataTable[i]['CharacterID'] == charId){
                        dataTable[i]['srNo'] = no;
                        tempDataTable.push(dataTable[i]);
                        no++;
                    }
                }
            }
            setDataTableList(tempDataTable);

            var confData = tempChartConfig;
            var l_llth='';
            var l_ll='';
            var l_lcl='';
            var l_m='';
            var l_ucl='';
            var l_ul='';
            var l_ulth='';
            if (confData.length > 2) {
                for (var i = 0; i < confData.length; i++) {
                    if (confData[i]['Key'].toString().toLowerCase() == 'ul') {
                        setUl(confData[i]['Value']?? '');
                        l_ul = confData[i]['Value']?? '';
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'll') {
                        setLL(confData[i]['Value']?? '');
                        l_ll = confData[i]['Value']?? '';
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'm') {
                        setM(confData[i]['Value']?? '');
                        l_m = confData[i]['Value']?? '';
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'ucl') {
                        setUcl(confData[i]['Value']?? '');
                        l_ucl = confData[i]['Value']?? '';
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'lcl') {
                        setLcl(confData[i]['Value']?? '');
                        l_lcl = confData[i]['Value']?? '';
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'ulth') {
                        setUlth(confData[i]['Value']?? '');
                        l_ulth = confData[i]['Value']?? '';
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'llth') {
                        setLlth(confData[i]['Value']?? '');
                        l_llth = confData[i]['Value']?? '';
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'mindate') {
                       setMeanDate(moment(confData[i]['Value']+' 00:00:00').format('DD-MM-yyyy HH:mm:ss'));
                    } else if (confData[i]['Key'].toString().toLowerCase() == 'maxdate') {
                        var mnDate = moment(confData[i]['Value'], "DD-MM-YYYY").add(2, 'days')
                        setMaxDate(moment(confData[i]['Value']+' 23:59:59').format('DD-MM-yyyy HH:mm:ss'));
                    }
                }
                var labelList = [l_llth,l_ll,l_lcl,l_m,l_ucl,l_ul,l_ulth];
                setLabels(labelList);
                }
        }
        setLoader(false);

    }, []);

    const refs = dataTableList.reduce((acc, value) => {
        acc[value.srNo] = React.createRef();
        return acc;
      }, {});

    const handleClick =(id)=>{
        try{
            refs[id].current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              }); 
        }catch(e){
        }
       
    }
        

    const data = {
        datasets: [
            {
                type: 'line',
                label: '',
                lineTension: 0.1,
                fill: false,
                pointBorderColor: "blue",
                borderWidth: 1,
                borderColor: "blue",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderWidth: 4,
                pointHoverRadius: 2,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: chartView == '1' ? x_xyPairData : x_xyPairPointWiseData,
              
            },
        ],
    };

    const annotation0 = {
        type: 'box',
        yMin: llth,
        yMax: ll,
        backgroundColor: 'rgba(255,80,80)',
        borderColor: 'black',
        drawTime: 'beforeDatasetsDraw',
        borderWidth: 0.2,
        borderRadius: 0,
    };

    const annotation1 = {
        type: 'box',
        yMin: ll,
        yMax: lcl,
        backgroundColor: 'rgba(241,235,156)',
        borderColor: 'black',
        drawTime: 'beforeDatasetsDraw',
        borderWidth: 0.2,
        borderRadius: 0,

    };

    const annotation2 = {
        type: 'box',
        yMin: lcl,
        yMax: m,
        backgroundColor: 'rgba(144,238,144)',
        borderColor: 'black',
        drawTime: 'beforeDatasetsDraw',
        borderWidth: 0.2,
        borderRadius: 0,
    };

    const annotation3 = {
        type: 'box',
        yMin: m,
        yMax: ucl,
        backgroundColor: 'rgba(144,238,144)',
        drawTime: 'beforeDatasetsDraw',
        borderColor: 'black',
        borderWidth: 0.2,
        borderRadius: 0,
    };

    const annotation4 = {
        type: 'box',
        yMin: ucl,
        yMax: ul,
        backgroundColor: 'rgba(241,235,156)',
        drawTime: 'beforeDatasetsDraw',
        borderColor: 'black',
        borderWidth: 0.2,
        borderRadius: 0,
        tricksColor: 'black'
    };

    const annotation5 = {
        type: 'box',
        yMin: ul,
        yMax: ulth,
        backgroundColor: 'rgba(255,80,80)',
        drawTime: 'beforeDatasetsDraw',
        borderWidth: 0.2,
        borderRadius: 0,
        borderColor: "black"
    };

    const zoomDateConfig =useMemo(()=>({
        zoom: {
            
            wheel: {
                enabled: true,
            },
            pinch: {
                enabled: true
            },
            mode: 'x',
            drag: true,
        },
        pan: {
            enabled: true,
            mode: 'x',
        },
        
    }),[90]);

    const zoomPointConfig = {
        
        zoom: {
            wheel: {
                enabled: true,
            },
            pinch: {
                enabled: true
            },
            mode: 'x',
            drag: true,
        },
        pan: {
            enabled: true,
            mode: 'x',
            zoom: 0.9
        },
        limits: {
            x: { min: 0, max: xAxisMaxLength },
        },
        
    };

    const x_dateConfig = {
        display: true,
        type: 'time',
        min: meanDate,
        max: maxDate,
        time: {
            unit: 'day',
            tooltipFormat: 'YYYY-MM-DD HH:mm:ss',
        },
    };

    const x_pointConfig = {
        display: true,
        type: 'linear',
        min: 0,
        max: xAxisMaxLength,
        
        grid: {
            color: "white",
            borderColor: "red",
            ticks: "white",
        },
        ticks: {
            stepSize: 10,
            callback: function(value,index) {
              if (Math.floor(value) === value) {
                return value
              }
            }
          },       
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        onClick: (e, element) => {            
            if(element.length > 0){
            var chartData = xchartData;
            var chartPointsX = element[0].element.$context.raw.x;
            var chartPointsY = element[0].element.$context.raw.y;
            var chartDtlId = '';
            for (var i = 0; i < xchartData.length; i++) {
                if (chartData[i]['DateTime'].toString() == chartPointsX.toString() && chartData[i]['Reading'] == chartPointsY) {
                    chartDtlId = chartData[i]['DataDtlID'];
                }else if(chartData[i]['srNo'].toString() == chartPointsX.toString() && chartData[i]['Reading'] == chartPointsY){
                    chartDtlId = chartData[i]['DataDtlID'];
                } 
            }
            var dataTable = dataTableList;
            var srNo;
            for(var i = 0; i < dataTable.length; i++){
                if(dataTable[i]['DataDtlID'] == chartDtlId){
                    dataTable[i].isBackgroundColor = true;
                    srNo = dataTable[i].srNo;
                }else {
                    dataTable[i].isBackgroundColor = false;
                }
            }
            setDataTableList([]);
            setDataTableList(dataTable);
            toggleModal(srNo);
            }
            
        },
        plugins: {
            zoom: chartView == '1' ? zoomDateConfig : zoomPointConfig,
            annotation: {
                annotations: {
                    annotation0: annotation0,
                    annotation1: annotation1,
                    annotation2: annotation2,
                    annotation3: annotation3,
                    annotation4: annotation4,
                    annotation5: annotation5,
                }
            },
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.parsed.y;
                        return label;
                    },
                    afterLabel:function(tooltipItem, data){
                        return tooltipItem['raw']['desc'];
                    }
                }
            },
            datalabels: {
                color: 'black',
                align:'end',
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
            },
        },
        scales: {
            y: {
                type: 'linear',
                min: llth,
                max: ulth,
                position: "left",
                ticks: {
                    autoSkip: false,
                    callback: function(value, index, values){
                        if (index == 0) {
                            value = llth.toString()
                            return value;
                        }
                        if (index == 1) {
                            value = ll.toString()
                            return value;
                        }
                        if (index == 2) {
                            value = lcl.toString()
                            return value;
                        }
                        if (index == 3) {
                            value = m.toString()
                            return value;
                        }
                        if (index == 4) {
                            value = ucl.toString()
                            return value;
                        }
                        if (index == 5) {
                            value = ul.toString()
                            return value;
                        }
                        if (index == 6) {
                            value = ulth.toString()
                            return value;
                        }
                    },
                },
                afterBuildTicks: axis => axis.ticks = labels.map(v => ({ value: v })),
                grid: {
                    borderColor: 'black',
                    color: "black",
                    tickColor: "white",
                    lineWidth: 1,
                    drawBorder: true,
                },
                
            },
            x: chartView == '1' ? x_dateConfig : x_pointConfig
        },
    }

    const DataTable = ({ srNo, date, reading, isBackgroundColor, Machine,Model,NOTE,Operator,Pallete,SHIFT,SerialNo,TimeStamp,Event,EventDesc }) => {
        return (
            <tbody
                id={srNo}>
                <tr key={srNo}  ref={refs[srNo]} style={isBackgroundColor ? rowStyle : rowStyleWhite} id={isBackgroundColor ? 'isActive' : ""}>
                    <td>{srNo}</td>
                    <td>{date}</td>
                    <td>{reading}</td>
                    <td>{Machine}</td>
                    <td>{Model}</td>
                    <td>{NOTE}</td>
                    <td>{Operator}</td>
                    <td>{Pallete}</td>
                    <td>{SHIFT}</td>
                    <td>{SerialNo}</td>
                    <td>{TimeStamp}</td>
                    <td>{Event}</td>
                    <td>{EventDesc}</td>
                </tr>
            </tbody>
        );
    };

    const rowStyle = {
        backgroundColor: "yellow",
    }
    const rowStyleWhite = {
        backgroundColor: "white",
    }

     //toggle model for delete.................................
     function toggleModal(srNo) {
        setIsOpen(!isOpen);
        if(srNo != null && srNo != undefined && srNo != ''){
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
                <div class="modal-dialog custom_modal_dialog" style={{maxWidth: '800px'}}>
                    <div class="modal-content" style={{ borderRadius: '0px' }}>
                        <div class="modal-header">
                            
                            <h4 class="modal-title modal_title_text">Chart Details</h4>
                            <button type="button" class="close" data-bs-dismiss="modal" onClick={toggleModal}>&times;</button>
                        </div>
                        <div class="modal-body">
                        <div className='col-md-12 chart_table' id="DataTableStyle1">
                            <div class="table_wrapper">
                                <div class="hack1">
                                    <div class="hack2 fixed_table_header" style={{overflowY:'scroll', display:'inline-block',marginTop:'0.8rem'}}>
                                        <table class="table table-bordered table-striped mg-b-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr No.</th>
                                                    <th>Date</th>
                                                    <th>Reading</th>
                                                    <th>Machine Name</th>
                                                    <th>Model No.</th>
                                                    <th>NOTE</th>
                                                    <th>Operator Name</th>
                                                    <th>Pallet</th>
                                                    <th>SHIFT</th>
                                                    <th>SerialNo</th>
                                                    <th>TimeStamp</th>
                                                    <th>Event Code</th>
                                                    <th>Event Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataTableList.map((px, index) => (
                                                    <DataTable
                                                        key={px.srNo}
                                                        srNo={px.srNo}
                                                        date={px.DATE}
                                                        reading={px.value}
                                                        isBackgroundColor={px.isBackgroundColor}
                                                        Machine={px.Machine}
                                                        Model={px.Model}
                                                        NOTE={px.NOTE}
                                                        Operator={px.Operator}
                                                        Pallete={px.Pallete}
                                                        SHIFT={px.SHIFT}
                                                        SerialNo={px.SerialNo}
                                                        TimeStamp={px.TimeStamp}
                                                        Event={px.Event}
                                                        EventDesc={px.Description}
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

        <div style={{ display: 'flex' }}>
{
    x_xyPairData.length > 0 ? ( <div className='col-md-12'>
                <div id="myChart">
                    <div className='row'>
                        <div className='col-md-11'>
                            <div style={{width: '100%', overflowX: 'auto', overflowY: 'hidden'}}>
                                <div style={{width: '100%', height: '450px'}}>
                                {x_xyPairData.length > 0 || x_xyPairPointWiseData.length > 0 ? (
                                    <Chart id="chart" type='line' data={data} options={options} plugins={ChartDataLabels} height="300" width="1000" />
                                ) : (<Loader></Loader>)}
                                </div>
                            </div>
                        </div>
                        <div className='col-md-1'>
                            <button type="button" class="btn ViewChart_btn" onClick={()=> toggleModal('')} style={{ margin: '10px 5px', position: 'absolute', top: '0rem', right: '0rem', zIndex: '1' }}><i class="fa fa-eye" title='View Data'></i> </button>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            
       ) : (<h4>No data found</h4>) }
       
        </div>
        </>
    );
}

export default ControlChart;