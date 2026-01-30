import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, dropdownValidator, inputWithRangeValidator } from '../../utils/Validator';
import { stationListUrl, chartListUrl, chartDataUrl, chartAccessUrl, insertChartUrl, chartUrl, chartDetailsUrl, updateChartUrl, deleteChartUrl, appVersion, NA, statusActionId, fillListUrl, stationActionId, templateActionId, palletActionId, machineActionId, charactersticActionId, eventActionId, exportOptionActionId } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal from "react-modal";
// import Precontrol from './Precontrol/precontrol';
import MainChart from './Precontrol/MainChart';
import XbarChart from './Xbar/xbarChart';
import NPChart from './npchart/NpChart';
import CChart from './cchart/CChart';
import PChart from './pchart/PChart';
import ControlChart from './Precontrol/controlChart';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

Modal.setAppElement("#root");

// const ChartDetails = (props) => {
const ChartDetails = ({ mchartConfig, mchartData, mxyPairList, mcharList, mchartType, mdataTable, mchartViewType }) => {


    const errorMap = {
        chart_no: '',
        chart_name: '',
        no_of_reading: '',
    };
    const [userData, setUserData] = useState({});
    const [isLoading, setLoader] = useState(false);
    const history = useHistory();
    const [isWriteAccess, setWriteAccess] = useState(false);
    const [isDeleteAccess, setDeleteAccess] = useState(false);
    const [chartConfig, setChartConfig] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [xyPairData, setXYPairData] = useState([]);
    const [charNameList, setCharNameList] = useState([]);
    const [dataTableList, setDataTableList] = useState([]);
    const [chartType, setChartType] = useState('');
    const [chartViewType, setChartViewType] = useState('');



    useEffect(async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData != null) {
            setUserData(userData);
            if (userData['userAccess'].length > 0) {
                for (var i = 0; i < userData['userAccess'].length; i++) {
                    if (userData['userAccess'][i]['ModuleID'] == 9) {
                        if (userData['userAccess'][i]['Read']) {
                            setWriteAccess(userData['userAccess'][i]['Write']);
                            setDeleteAccess(userData['userAccess'][i]['Delete']);
                        } else {
                            toast('You do not have access to view this page.', {
                                autoClose: 3000,
                                hideProgressBar: true
                            });
                            // await timeout(1000); 
                            history.goBack();
                        }
                    }
                }
            }
        } else {
            history.push('/login');
        }
        setChartConfig(mchartConfig);
        setChartData(mchartData);
        setXYPairData(mxyPairList);
        setCharNameList(mcharList);
        setChartType(mchartType);
        setDataTableList(mdataTable);
        setChartViewType(mchartViewType);

    }, []);


    const onTabClose = (data) => {
        var charList = charNameList;
        charList = charNameList.filter(list => list.id != data.id);
        setCharNameList([]);
        setCharNameList(charList);
    }

    return (
        <>
            {isLoading ? (
                <Loader></Loader>
            ) : (
                null
            )}
            <ToastContainer autoClose={5000} hideProgressBar={false} />


            {/* <Header activeId={'isChartActiveColor'}/> */}
            <div className="az-content pd-y-0 pd-lg-y-0 pd-xl-y-0">
                <div className="">
                    <div className=''>
                        <div className=''>
                            <div className="az-content-body pd-lg-l-40 d-flex flex-column" style={{ paddingTop: '0px', paddingLeft: '20px', paddingRight: '20px' }}>
                                <Tabs>
                                    <TabList>
                                        {charNameList.map((data, index) => (
                                            <Tab>{data.name} <i className='fa fa-times tabclose_icon' onClick={() => onTabClose(data)}></i> </Tab>
                                        ))}
                                    </TabList>
                                    {charNameList.map((data, index) => (
                                        <TabPanel>
                                            {/* {chartConfig.length > 0 && chartData.length > 0 ? (<MainChart chartConfig={chartConfig} chartData={chartData} xyPairList={xyPairData}/>) : (null)} */}
                                            {chartType == '1' ? (
                                                <ControlChart chartConfig={chartConfig} chartData={chartData} xyPairList={xyPairData} charId={data.id} dataTable={dataTableList} chartView={chartViewType} />
                                            ) : (null)}
                                            {chartType == '2' ? (
                                                <XbarChart chartConfig={chartConfig} chartData={chartData} xyPairList={xyPairData} charId={data.id} dataTable={dataTableList} />
                                            ) : (null)}
                                            {chartType == '3' ? (
                                                <PChart chartConfig={chartConfig} chartData={chartData} xyPairList={xyPairData} />
                                            ) : (null)}
                                            {chartType == '4' ? (
                                                <CChart chartConfig={chartConfig} chartData={chartData} xyPairList={xyPairData} />
                                            ) : (null)}
                                            {chartType == '5' ? (
                                                <NPChart chartConfig={chartConfig} chartData={chartData} xyPairList={xyPairData} />
                                            ) : (null)}
                                        </TabPanel>
                                    ))}
                                </Tabs>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
export default ChartDetails;