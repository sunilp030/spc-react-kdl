import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, dropdownValidator, inputWithRangeValidator, dateValidator } from '../../utils/Validator';
import { charactersticActionId, templateListUrl, templateDetailsUrl, modifyAccessUrl, insertModifyUrl, stationActionId, modifyDetailsUrl, updateModifyUrl, deleteModifyUrl, appVersion, NA, inputMaxLength, statusActionId, fillListUrl, operationActionId, machineActionId, templateActionId, eventListUrl, timeout, managementListUrl, stationAccordingToOperationActionId, palletActionId } from '../../utils/constants';
import queryString from 'query-string';
import $, { isEmptyObject } from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import groupBy from 'lodash/groupBy';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { FaCalendarAlt } from 'react-icons/fa';
import Pagination from './pagination';
import { FaCheck,FaBeer  } from 'react-icons/fa';

Modal.setAppElement("#root");

const Modify = (props) => {


    const errorMap = {
        modify_no: '',
        modify_name: '',
        no_of_reading: '',
        date_time: '',
        spcStation_data: '',
        machine_data: '',
        operation_data: '',
        characteristics_data: '',
        template_data: '',
        pallet_data: '',
        partNo_data: '',
        reading_data: '',
        modify_data: '',
        operator_data: '',
        shift_data: '',
        from_Date: ' ',
        to_Date: '',
        operation_line: '',
        spc_station: '',
        machine: '',
        templete: '',
        pallete: '',

    };
    const [userData, setUserData] = useState({});
    const [modifyList, setModifyList] = useState([]);
    const [tempModifyList, setTempModifyList] = useState([]);
    const [modifyAccessList, setModifyAccessList] = useState([]);
    const [modifyId, setModifyId] = useState('');
    const [modifyCode, setModifyCode] = useState('');
    const [modifyName, setModifyName] = useState('');
    const [isLoading, setLoader] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setError] = useState(errorMap);
    const history = useHistory();
    const [isWriteAccess, setWriteAccess] = useState(false);
    const [isDeleteAccess, setDeleteAccess] = useState(false);
    const [isActive, setIsActive] = useState('');
    const [statusName, setStatusName] = useState('');
    const [stationList, setStationList] = useState([]);
    const [modifyFromDate, setModifyFromDate] = useState();
    const [modifyToDate, setModifyToDate] = useState();
    const [stationId, setStationId] = useState('');
    const [sMachineActionIdList, setSMachineActionIdList] = useState([]);
    const [sMachineActionId, setSMachineActionId,] = useState('');
    const [sTemplateActionIdList, setTemplateActionIdList] = useState([]);
    const [sTemplateActionId, setTemplateActionId] = useState('');
    const [sOperationActionIdList, setOperationActionIdList] = useState([]);
    const [sOperationActionId, setOperationActionId] = useState('');
    const [deleteTemplateId, setTemplateIdForDelete] = useState('');
    const [isEditCharOpen, setIsEditCharOpen] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());
    const [spcStation, setSPCStation] = useState('');
    const [template, setTemplate] = useState('');
    const [characteristics, setCharacteristics] = useState('');
    const [machine, setMachine] = useState('');
    const [pallet, setPallet] = useState('');
    const [partNo, setPartNo] = useState('');
    const [reading, setReading] = useState('');
    const [modify, setModifys] = useState('');
    const [operator, setOperator] = useState('');
    const [shifts, setShifts] = useState('');
    const [isCharacteristicsList, setIsCharacteristicsList] = useState([]);
    const [dataa, setData] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [templateId, setTemplateId] = useState('');
    const [isShowChar, setIsShowChar] = useState(false);
    const [managementDetails, setManagementDetails] = useState({});
    const [chartDesc, setChartDesc] = useState('');
    const [modelNo, setModelNo] = useState('');
    const [chartCharacterList, setChartCharacterList] = useState([]);
    const [chartName, setChartName] = useState('');
    const [sStationActionId, setSStationActionId] = useState('');
    const [modifyCharTableList, setModifyCharTableList] = useState([]);
    const [srNo, setSrNo] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [dataHrdId, setDataHrdID] = useState('');
    const [event, setEvent] = useState('');
    const [isViewChar, setIsViewChar] = useState(false);
    const [selectedCharIdList, setSelectedCharIdList] = useState([]);
    const [palletActionIdList, setPalletActionIdList] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const [isOperationSelected, setIsOperationSelected] = useState(true);
    const [isStationSelected, setIsStationSelected] = useState(true);



    const currentRecords = modifyCharTableList.length > 0 ? modifyCharTableList.slice(indexOfFirstRecord, indexOfLastRecord) : '';
    const nPages = Math.ceil(modifyCharTableList.length / recordsPerPage)
    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)
    const nextPage = () => {
        if (currentPage !== nPages)
            setCurrentPage(currentPage + 1)
    }
    const prevPage = () => {
        if (currentPage !== 1)
            setCurrentPage(currentPage - 1)
    }


    useEffect(async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData != null) {
            setUserData(userData);
            if (userData['userAccess'].length > 0) {
                for (var i = 0; i < userData['userAccess'].length; i++) {
                    if (userData['userAccess'][i]['ModuleID'] == 7) {
                        if (userData['userAccess'][i]['Read']) {
                            setWriteAccess(userData['userAccess'][i]['Write']);
                            setDeleteAccess(userData['userAccess'][i]['Delete']);
                        } else {
                            toast.error('You do not have access to view this page.', {
                                theme: "colored",
                                autoClose: 3000,
                                hideProgressBar: true,
                                

                            });
                            history.goBack();
                        }
                    }
                }
            }
        } else {
            history.push('/login');
        }
        if (props.location.state != null) {
            setModifyId(props.location.state.modifyId);
        }
        getList(userData, '');
        getFillList(userData, stationActionId, "");
        getFillList(userData, operationActionId, '');
        getFillList(userData, templateActionId, '');
        getFillList(userData, machineActionId, '');
        getFillList(userData, palletActionId, '');

    }, []);


    // dropdown list data
    const getFillList = async (data, actionId, stationId) => {
        var result = await axiosGet(`${fillListUrl}?actionid=${actionId}&userid=${data.ID}&String=${stationId}`);
        if (result != null && result['error'] == 0) {
            if (actionId == stationActionId || actionId == stationAccordingToOperationActionId) {
                setStationList(result['data']);
            }
            else if (actionId == operationActionId) {
                setOperationActionIdList(result['data']);
            }
            else if (actionId == templateActionId) {
                setTemplateActionIdList([]);
                setTemplateActionIdList(result['data']);
            }
            else if (actionId == machineActionId) {
                setSMachineActionIdList(result['data']);
            }
            else if (actionId == charactersticActionId) {
                setIsCharacteristicsList([]);
                setIsCharacteristicsList(result['data']);
            } else if (actionId == palletActionId) {
                setPalletActionIdList(result['data']);
            }
        }
    };

    // api call for modify list...........................
    const getList = async (data, search) => {
        setLoader(true);
        var result = await axiosGet(`${templateListUrl}?Login_Id=${data.ID}`);
        setLoader(false);
        if (result != null && result['error'] == 0) {
            setModifyList(result['data']);
            setTempModifyList(result['data']);
            grouping(result['data']);
        }
    };

    const grouping = (data) => {
    const a = groupBy(data, function (n) {
        return n.OperationLineName;
    });
    //grouping by operational name.......................
    var groups = Object.keys(a).map(function (key) {
        //grouping by station name.......................
        const s = groupBy(a[key], function (n) {
            return n.StationName;
        });
        var groups_station = Object.keys(s).map(function (key) {
            var list = s[key];
            var newList = [];

            for (var i = 0; i < list.length; i++) {
                var map = {
                    value: list[i]['TemplateID'],
                    label: list[i]['TemplateName'],
                    isToggle: false,
                };
                newList.push(map);
            }

            return { label: key, value: key, children: newList };
        });

        return { label: key, value: key, children: groups_station };
    });

    var mapData = {
        name: 'operation',
        children: groups
    };
    // setData([]);

    setData(groups);
};


    const onTreeChecked = (checked_node) => {
        console.log('checked_node' );
        if (checked.length > 0) {
            if (checked_node.includes(checked[0])) {
                var index = checked_node.indexOf(checked[0]);
                checked_node.splice(index, 1);
            }
        }
        setChecked(checked_node)
        if (checked_node.length > 0) {
            setTemplateId(checked_node[0]);
            setTemplateActionId(checked_node[0]);
            setIsShowChar(true);
            getFillList(userData, charactersticActionId, checked_node[0]);
        } else {
            setTemplateId('');
            setChartDesc('');
            setChartName('');
            setStationId('');
            setModelNo('');
            setIsShowChar(false);
            setChartCharacterList([]);
            getList(userData);
        }

    }
    const onTreeClicked = (checked_node) => {
        var exp = expanded;
        if (expanded.includes(checked_node['value'].toString())) {
            const arr = expanded.filter((item) => item !== checked_node['value'].toString());
            setExpanded(arr);
        } else {
            exp.push(checked_node['value'].toString());
            setExpanded(exp);

        }
        if (checked_node['value'] != '') {
            if (!checked_node['value'].toString().includes('.')) {
                setTemplateActionId(checked_node['value']);
            }
        }
        var idList = [];
        idList.push(checked_node['value'].toString());
        setChecked(idList);


        //set operation name............................... 
        for (var i = 0; i < sOperationActionIdList.length; i++) {
            if (sOperationActionIdList[i]['Name'] == checked_node['label']) {
                setOperationActionId(sOperationActionIdList[i]['ID']);
                getFillList(userData, stationAccordingToOperationActionId, sOperationActionIdList[i]['ID']);
                setIsOperationSelected(false);
               
            }
        }

        //set spc station name............................... 
        for (var i = 0; i < stationList.length; i++) {
            if (stationList[i]['NAME'] == checked_node['label']) {
                setStationId(stationList[i]['ID']);
                setSStationActionId(stationList[i]['ID']);
                setSPCStation(stationList[i]['ID']);
                getFillList(userData, machineActionId, stationList[i]['ID']);
                getFillList(userData, templateActionId, stationList[i]['ID']);
                setIsStationSelected(false);

            }
        }
        //set Template name............................... 
        for (var i = 0; i < sTemplateActionIdList.length; i++) {
            if (sTemplateActionIdList[i]['TemplateName'] == checked_node['label']) {
                setTemplateActionId(sTemplateActionIdList[i]['ID']);
                setIsShowChar(true);
                getFillList(userData, charactersticActionId, sTemplateActionIdList[i]['ID']);
                var idList = [];
                idList.push(sTemplateActionIdList[i]['ID'].toString());
                setChecked(idList);
            }
        }

    }

    const onExpand = (exp) => {
        console.log('onExpand' );

        setExpanded(exp)
        console.log("hi expanded coloumn",exp)
    }

    // To store characteristic checked value
    const onCheckCharacteristicsManagement = (index) => {
        var charList = isCharacteristicsList;
        charList[index]['isCheck'] = !charList[index]['isCheck'];
        var selectedChar = [];
        for (var i = 0; i < charList.length; i++) {
            if (charList[i]['isCheck']) {
                selectedChar.push(charList[i]['ID']);
            }
        }
        setSelectedCharIdList(selectedChar);
    }


    // api call for char list for table...........................
    const getCharList = async (mode) => {
        if (modifyToDate == '' || modifyToDate == null) {
            // modifyToDate = modifyFromDate;
            setModifyToDate(modifyFromDate);
        }
        dateValidate(modifyFromDate, 'from date', modifyToDate)
        if (modifyToDate != null && modifyToDate != '') {
            dateValidate(modifyToDate, 'to date', modifyFromDate)
        }

        dropdownValidate(sOperationActionId, 'operation line');
        dropdownValidate(stationId, 'spc station');
        dropdownValidate(sMachineActionId, 'machine');
        dropdownValidate(sTemplateActionId, 'templete');

        if (!dateValidate(modifyFromDate, 'from date', modifyToDate)) {
            return;
        }
        if (modifyToDate != null && modifyToDate != '') {
            if (!dateValidate(modifyToDate, 'to date', modifyFromDate)) {
                return;
            }
        }
        if (!dropdownValidate(sOperationActionId, 'operation line')) {
            return;
        }
        if (!dropdownValidate(stationId, 'spc station')) {
            return;
        }
        if (!dropdownValidate(sMachineActionId, 'machine')) {
            return;
        }
        if (!dropdownValidate(sTemplateActionId, 'templete')) {
            return;
        }
        if (!isEmptyObject(selectedCharIdList)) {

            setLoader(true);
            var result = await axiosGet(`${managementListUrl}?ActionId=2&OperationLineId=${sOperationActionId}&StationId=${sStationActionId}&TemplateId=${sTemplateActionId}&MachineId=${sMachineActionId}&CharacteristicsId=${selectedCharIdList.toString()}&FromDate=${moment(modifyFromDate).format('YYYY-MM-DD')}&ToDate=${modifyToDate != null ? moment(modifyToDate).format('YYYY-MM-DD') : moment(modifyFromDate).format('YYYY-MM-DD')}`);
            setLoader(false);
            if (result != null && result['error'] == 0) {
                setModifyCharTableList(result['data'])
                if (mode == 1) {
                    setIsViewChar(true)
                }
            } else {
                toast.error(result['msg'], {
                    theme: "colored",
                    autoClose: 3000,
                    hideProgressBar: true
                });
            }

        }
        else {
            toast.error('Please select atleast one characteristic', {
                theme: "colored",
                autoClose: 3000,
                hideProgressBar: true,       
                });
        }
    };

    //input validation.................................................
    const inputValidate = (value, fieldName, digit) => {
        var errorValue;
        if (fieldName == 'modify code') {
            errorValue = inputWithRangeValidator(value, fieldName, digit);
        } else {
            errorValue = inputValidator(value, fieldName);
        }


        if (errorValue !== '') {
            if (fieldName == 'Date Time') {
                errorMap.date_time = errorValue;
            } else if (fieldName == 'Pallet') {
                errorMap.pallet_data = errorValue;
            } else if (fieldName == 'part no') {
                errorMap.partNo_data = errorValue;
            } else if (fieldName == 'Reading') {
                errorMap.reading_data = errorValue;
            } else if (fieldName == 'Modify') {
                errorMap.modify_data = errorValue;
            } else if (fieldName == 'Operator') {
                errorMap.operator_data = errorValue;
            } else if (fieldName == 'Shift') {
                errorMap.shift_data = errorValue;
            } else if (fieldName == 'Template') {
                errorMap.template_data = errorValue;
            } else if (fieldName == 'Characteristics') {
                errorMap.characteristics_data = errorValue;
            } else if (fieldName == 'Machine') {
                errorMap.machine_data = errorValue;
            } else if (fieldName == 'SpcStation') {
                errorMap.spcStation_data = errorValue;
            }
            setError(errorMap);
            return false;
        } else {
            if (fieldName == 'Date Time') {
                errorMap.date_time = errorValue;
            } else if (fieldName == 'Pallet') {
                errorMap.pallet_data = errorValue;
            } else if (fieldName == 'part no') {
                errorMap.partNo_data = errorValue;
            } else if (fieldName == 'Reading') {
                errorMap.reading_data = errorValue;
            } else if (fieldName == 'Modify') {
                errorMap.modify_data = errorValue;
            } else if (fieldName == 'Operator') {
                errorMap.operator_data = errorValue;
            } else if (fieldName == 'Shift') {
                errorMap.shift_data = errorValue;
            } else if (fieldName == 'Template') {
                errorMap.template_data = errorValue;
            } else if (fieldName == 'Characteristics') {
                errorMap.characteristics_data = errorValue;
            } else if (fieldName == 'Machine') {
                errorMap.machine_data = errorValue;
            } else if (fieldName == 'SpcStation') {
                errorMap.spcStation_data = errorValue;
            }
            setError(errorMap);
            return true;
        }

    };

    //dropdown validation.................................................
    const dropdownValidate = (value, fieldName) => {
        const errorValue = dropdownValidator(value, fieldName);
        if (errorValue !== '') {
            if (fieldName === 'operation line') {
                errorMap.operation_line = errorValue;
            } else if (fieldName === 'spc station') {
                errorMap.spc_station = errorValue;
            } else if (fieldName === 'machine') {
                errorMap.machine = errorValue;
            } else if (fieldName === 'templete') {
                errorMap.templete = errorValue;
            } else if (fieldName === 'pallete') {
                errorMap.pallete = errorValue;
            }

            setError(errorMap);
            return false;
        } else {
            if (fieldName === 'operation line') {
                errorMap.operation_line = errorValue;
            } else if (fieldName === 'spc station') {
                errorMap.spc_station = errorValue;
            } else if (fieldName === 'machine') {
                errorMap.machine = errorValue;
            } else if (fieldName === 'templete') {
                errorMap.templete = errorValue;
            } else if (fieldName === 'pallete') {
                errorMap.pallete = errorValue;
            }
            setError(errorMap);
            return true;
        }

    };

    //date validation.................................................
    const dateValidate = (value, fieldName, compaireField) => {
        var errorValue;
        errorValue = dateValidator(value, fieldName, compaireField);
        if (errorValue !== '') {
            if (fieldName == 'from date') {
                errorMap.from_Date = errorValue;
            } else if (fieldName == 'to date') {
                errorMap.to_Date = errorValue;
            }
            setError(errorMap);
            return false;
        } else {
            if (fieldName == 'from date') {
                errorMap.from_Date = errorValue;
            } else if (fieldName == 'to date') {
                errorMap.to_Date = errorValue;
            }
            setError(errorMap);
            return true;
        }

    };

    const clearField = () => {
        errorMap.modify_no = '';
        errorMap.modify_name = '';
        errorMap.no_of_reading = '';
        errorMap.date_time = '';
        errorMap.spcStation_data = '';
        errorMap.machine_data = '';
        errorMap.operation_data = '';
        errorMap.characteristics_data = '';
        errorMap.template_data = '';
        errorMap.pallet_data = '';
        errorMap.partNo_data = '';
        errorMap.reading_data = '';
        errorMap.modify_data = '';
        errorMap.operator_data = '';
        errorMap.shift_data = '';
        errorMap.from_Date = '';
        errorMap.to_Date = '';
        errorMap.operation_line = '';
        errorMap.spc_station = '';
        errorMap.machine = '';
        errorMap.templete = '';

        setError(errorMap);
        setModifyId('');
        setModifyCode('');
        setModifyName('');
        setStatusName('');
        setIsActive('');
        setModifyId('');
        getList(userData, '');
        setSrNo('');
        setSerialNo('');
        setDataHrdID('');
        setEvent('');
        setDateTime('');
        setSPCStation('');
        setTemplate([]);
        setCharacteristics([]);
        setMachine([]);
        setPallet('');
        setPartNo('');
        setReading('');
        setModifys('');
        setOperator('');
        setShifts('');
    }

    //on back button click............................................
    const onBackClick = async () => {
        history.goBack();
    };


    // operation dropdown validate.........................................
    const onOperationDropdownChange = (value) => {
        setOperationActionId(value);
        getFillList(userData, stationAccordingToOperationActionId, value);
        dropdownValidate(value, 'Operation');
        if(value == 'Choose one'){
            setIsOperationSelected(true);
          }else{
            setIsOperationSelected(false);
          }
        // setSStationActionId('');
        // setSPCStation('');
        setStationId('');
    };


    // station dropdown validate.........................................
    const onStationDropdownChange = (value) => {
        setSPCStation(value);
        setStationId(value);
        setSStationActionId(value);
        getFillList(userData, machineActionId, value);
        getFillList(userData, templateActionId, value);
        dropdownValidate(value, 'Station');
        if(value == 'Choose one'){
            setIsStationSelected(true);
          }else{
            setIsStationSelected(false);
          }
         
    };

    // operation dropdown validate.........................................
    const onMachineDropdownChange = (value) => {
        setSMachineActionId(value);
        setMachine(value);
        dropdownValidate(value, 'Machine');
    };

    // operation dropdown validate.........................................
    const onPalleteDropdownChange = (value) => {
        setPallet(value);
        dropdownValidate(value, 'Machine');
    };


    // template dropdown validate.........................................
    const onTemplateDropdownChange = (value) => {
        setTemplateActionId(value);
        setTemplate(value);
        setIsShowChar(true);
        getFillList(userData, charactersticActionId, value);
        dropdownValidate(value, 'Template');
    }

    // characteristics dropdown validate.........................................
    const onCharacteristicsDropdownChange = (value) => {
        setCharacteristics(value);
        dropdownValidate(value, 'Characteristics');
    };
    const closeUpdateModal = () => {
        setIsEditCharOpen(!isEditCharOpen);
    }

    // //toggle model for edit characterstics.................................
    function toggleModalEditChar(data, index, e) {
        setIsEditCharOpen(!isEditCharOpen);
        if (data != undefined) {
            setSrNo(data.SrNo);
            setSerialNo(data.SerialNo);
            setDataHrdID(data.DataHdrID);
            setEvent(data.Event);
            setDateTime(data.DateTime);
            setPallet(data.Pallete)
            setPartNo(data.PartNo)
            setReading(data.Reading)
            setModifys(data.Modifys)
            setOperator(data.Operator)
            setShifts(data.Shifts)
            setCharacteristics(data.CharacterID)
            setPallet(data.Pallete.toString().trim());
            //set Template name............................... 
            for (var i = 0; i < sTemplateActionIdList.length; i++) {
                if (sTemplateActionIdList[i]['TemplateName'] == data.Template) {
                    setTemplate(sTemplateActionIdList[i]['ID']);
                    getFillList(userData, charactersticActionId, sTemplateActionIdList[i]['ID']);
                }
            }
            //set MachineName name...............................
            for (var i = 0; i < sMachineActionIdList.length; i++) {
                if (sMachineActionIdList[i]['MachineName'] == data.Machine) {
                    setMachine(sMachineActionIdList[i]['ID'])
                }
            }
            //set spc station name...............................
            for (var i = 0; i < stationList.length; i++) {
                if (stationList[i]['NAME'] == data.SPCStation) {
                    setSPCStation(stationList[i]['ID']);
                }
            }
        }
    }

    //on edit  characteristics button click............................................
    const onCharUpdateClick = async () => {
        setLoader(true);
        var mapData = {
            'Login_id': userData.ID,
            'SrNo': srNo,
            'DataHdrID': dataHrdId,
            'SerialNo': serialNo,
            'DateTime': dateTime,
            'SPCStation': spcStation,
            'Template': template,
            'Characteristic': characteristics,
            'Machine': machine,
            'Pallete': pallet,
            'PartNo': partNo,
            'Reading': reading,
            'Event': event,
            'Operator': operator,
            'Shifts': shifts,
            'modified_version': appVersion,
        }
        var result = await axiosPost(updateModifyUrl, mapData);
        if (result != null && result['error'] == 0) {
            setIsEditCharOpen(!isEditCharOpen);
            toast.success('Characteristic updated successfully.', {
                theme: "colored",
                autoClose: 3000,
                hideProgressBar: true,
                // icon: (<FaBeer style={{color:"black",height:"2rem",width:"2rem"}}/> )  
                // icon: ({theme, type}) =>  <img src='assets/warning.jpg'/>
                // icon: ('C:/Users/dell/Desktop/Monika/NodeJs_Project/spc_react/public/assets/warning.jpg')
            });
            getCharList(2);
        } else {
            toast.error(result['msg'], {
                theme: "colored",
                autoClose: 3000,
                hideProgressBar: true
            });
        }
        setLoader(false);
    }

    const Records = ({ list }) => {
        return (
            <table className="table table-bordered mg-b-15 modfy_characterstc">
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Date Time</th>
                        <th>SPC Station</th>
                        <th>Template</th>
                        <th>Characteristics</th>
                        <th>Machine</th>
                        <th>Pallet</th>
                        <th>Part No</th>
                        <th>Reading</th>
                        <th>Event</th>
                        <th>Operator</th>
                        <th>Shift</th>
                    </tr>
                </thead>
                <tbody>
                    {list.length > 0 ? (
                        list.map((data, i) => (
                        <tr
                            key={data.SrNo ?? i}data-toggle="modal"onDoubleClick={() => toggleModalEditChar(data, i)}>
                            <td>{data.SrNo}</td>
                            <td>{moment(data.DateTime).format('DD-MM-YYYY HH:mm')}</td>
                            <td>{data.SPCStation}</td>
                            <td>{data.Template}</td>
                            <td>{data.Characteristic}</td>
                            <td>{data.Machine}</td>
                            <td>{data.Pallete}</td>
                            <td>{data.PartNo}</td>
                            <td>{data.Reading}</td>
                            <td>{data.Event}</td>
                            <td>{data.Operator}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{data.Shifts}</td>
                        </tr>
                        ))
                        ) : (
                        <tr>
                        <td colSpan="13" className="text-center">
                            {!isLoading ? 'Data is not available' : ''}
                        </td>
                        </tr>
                        )}
                </tbody>

            </table>

        )
    }


    const toDateValidation = (date) => {
        if (date == null || date == '') {
            setModifyToDate(modifyFromDate);
        }
        else {
            setModifyToDate(date);
        }
    }

    const handleEscapeOutside = (e) => {
        setIsEditCharOpen(!isEditCharOpen);
        if (e.keyCode == "27") {
            setIsEditCharOpen(!isEditCharOpen);
        }
    }
    const handleOnKeyDown = (e) => {
        if (e.key === 'Escape') {
            window.location.reload(false);
            setIsEditCharOpen(!isEditCharOpen);
        }
    };

    return (
        <>
            {isLoading ? (
                <Loader></Loader>
            ) : (
                null
            )}
            <ToastContainer autoClose={5000}
                hideProgressBar={false} />

            <Modal
                isOpen={isEditCharOpen}
                onRequestClose={() => closeUpdateModal()}
            // disableEscapeKeyDown={false}
            // onClick={e => handleOnKeyDown(e)}
            >

                <div className="modal-dialog custom_modal_dialog">
                    <div className="modal-content">
                        <div className="modal-header header_bg_color_blue">
                            <h4 className="modal-title modal_title_text">Update Characteristics</h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={() => closeUpdateModal()}>×</button>
                        </div>
                        <div className="modal-body border_bottom_blue" style={{ height: 'auto', overflow: 'auto' }}>
                            <div className="row" style={{ margin: '0px' }}>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label">Date Time <span className="star_mark">*</span></label>
                                    <DatePicker selected={new Date(dateTime)} className="form-control" disabled dateFormat="dd/MM/yyyy" onChange={(date) => setDateTime(date)} />
                                    {errors.date_time.length > 0 && <span className='error'>{errors.date_time}</span>}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label">SPC Station <span className="star_mark">*</span></label>
                                    <select className="form-control select2-no-search" disabled value={spcStation} onChange={e => onStationDropdownChange(e.currentTarget.value)}>
                                        <option>Choose one</option>
                                        {stationList.map(item => (
                                            <option
                                                key={item.ID}
                                                value={item.ID}>
                                                {item.NAME}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.spcStation_data.length > 0 && <span className='error'>{errors.spcStation_data}</span>}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label">Template <span className="star_mark">*</span></label>
                                    <select className="form-control select2-no-search" disabled value={template} onChange={e => onTemplateDropdownChange(e.currentTarget.value)}>
                                        <option>Choose one</option>
                                        {sTemplateActionIdList.map(item => (
                                            <option
                                                key={item.ID}
                                                value={item.ID}>
                                                {item.TemplateName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.template_data.length > 0 && <span className='error'>{errors.template_data}</span>}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label">Characteristic<span className="star_mark">*</span></label>
                                    <select className="form-control select2-no-search" disabled value={characteristics} onChange={e => onCharacteristicsDropdownChange(e.currentTarget.value)}>
                                        <option>Choose one</option>
                                        {isCharacteristicsList.map(item => (
                                            <option
                                                key={item.ID}
                                                value={item.ID}>
                                                {item.CharacteristicsName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.characteristics_data.length > 0 && <span className='error'>{errors.characteristics_data}</span>}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label"> Machine <span className="star_mark">*</span></label>
                                    <select className="form-control select2-no-search" disabled value={machine} onChange={e => onMachineDropdownChange(e.currentTarget.value)}>
                                        <option>Choose one</option>
                                        {sMachineActionIdList.map(item => (
                                            <option
                                                key={item.ID}
                                                value={item.ID}>
                                                {item.MachineName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.machine_data.length > 0 && <span className='error'>{errors.machine_data}</span>}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label">Pallet <span className="star_mark">*</span></label>

                                    <select className="form-control select2-no-search" value={pallet} onChange={e => onPalleteDropdownChange(e.currentTarget.value)}>
                                        <option>Choose one</option>
                                        {palletActionIdList.map(item => (
                                            <option
                                                key={item.PalletNo}
                                                value={item.PalletNo}>
                                                {item.PalletNo}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.pallete.length > 0 && <span className='error'>{errors.pallete}</span>}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label">Part No <span className="star_mark">*</span></label>
                                    <input className="form-control" placeholder="Part No " disabled value={partNo} onInput={e => setPartNo(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'partNo')} />
                                    {errors.partNo_data.length > 0 && <span className='error'>{errors.partNo_data}</span>}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label">Reading <span className="star_mark">*</span></label>
                                    <input className="form-control" placeholder="Reading" value={reading} onInput={e => setReading(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'reading')} />
                                    {errors.reading_data.length > 0 && <span className='error'>{errors.reading_data}</span>}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label">Event <span className="star_mark">*</span></label>
                                    <input className="form-control" placeholder="Event" disabled value={modify} onInput={e => setModifys(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'modify')} />
                                    {errors.modify_data.length > 0 && <span className='error'>{errors.modify_data}</span>}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label">Operator <span className="star_mark">*</span></label>
                                    <input className="form-control" placeholder="Operator" disabled value={operator} onInput={e => setOperator(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'operator')} />
                                    {errors.operator_data.length > 0 && <span className='error'>{errors.operator_data}</span>}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="custom_label">Shift <span className="star_mark">*</span></label>
                                    <input className="form-control" placeholder="Shift" disabled value={shifts} onInput={e => setShifts(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'shift')} />
                                    {errors.shift_data.length > 0 && <span className='error'>{errors.shift_data}</span>}
                                </div>

                                <div className="col-md-12 text-right mt-3">
                                    <button type="button" className="btn update_btn" data-dismiss="modal" onClick={onCharUpdateClick}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal>


            <Header activeId={'isModifyActiveColor'} />
            <div className="az-content pd-y-0 pd-lg-y-0 pd-xl-y-0">
                <div className="container-fluid">
                    <div className="az-content-left az-content-left-components" id='mySidebar'>
                        <button className='wrapperrr_div_close' id="closeNavi" onClick="closenNav()">
                            <i className='fa fa-times'></i>
                        </button>
                        <div className="component-item">
                            <label className="list_name_class">List</label>

                            <nav className="nav flex-column left_menu tree_part_padd_left">
                                <CheckboxTree
                                    nodes={dataa}
                                    checked={checked}
                                    expanded={expanded}
                                    onClick={(value) => onTreeClicked(value)}
                                    onCheck={(checked) => onTreeChecked(checked)}
                                    // onExpand={(exp) => setExpanded(exp)}
                                    onExpand={(exp) => onExpand(exp)}
                                    onlyLeafCheckboxes={true}
                                    showNodeIcon={false}
                                />
                            </nav>

                        </div>
                        <div className='version_class'>
                            <p>Version : 1.0.0 Build 20220511</p>
                            <p>Copyright © 2022 | All Rights Reserved</p>
                        </div>
                    </div>
                    <div className="az-content-body pd-lg-l-40 d-flex flex-column" id='main'>

                        <button className='wrapperrr_div_open' id="openNavi" onClick="openNav()">
                            <i className='fa fa-chevron-right'></i>
                        </button>


                        <h2 className="az-content-title">Data Modify</h2>
                        <h6 class={isActive == 1 ? "active_status" : "active_status text-danger"}>{statusName != '' ? statusName : ''}</h6>
                        <div className="row">
                            <div className="col-md-3 form-group">
                                <label className="custom_label">Operation Line <span className="star_mark">*</span></label>
                                <select className="form-control" value={sOperationActionId} disabled={isViewChar} onChange={e => onOperationDropdownChange(e.currentTarget.value)}>
                                    <option>Choose one</option>
                                    {sOperationActionIdList.map(item => (
                                        <option
                                            key={item.ID}
                                            value={item.ID}>
                                            {item.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.operation_line.length > 0 && <span className='error'>{errors.operation_line}</span>}
                            </div>
                            <div className="col-md-3 form-group">
                                <label className="custom_label">SPC Station <span className="star_mark">*</span></label>
                                <select className="form-control" value={stationId} disabled={isViewChar || isOperationSelected} onChange={e => onStationDropdownChange(e.currentTarget.value)}>
                                    <option>Choose one</option>
                                    {stationList.map(item => (
                                        <option
                                            key={item.ID}
                                            value={item.ID}>
                                            {item.NAME}
                                        </option>
                                    ))}
                                </select>
                                {errors.spc_station.length > 0 && <span className='error'>{errors.spc_station}</span>}
                            </div>
                            <div className="col-md-3 form-group">
                                <label className="custom_label">Template <span className="star_mark">*</span></label>
                                <select className="form-control" value={sTemplateActionId} disabled={isViewChar || isStationSelected || isOperationSelected} onChange={e => onTemplateDropdownChange(e.currentTarget.value)}>
                                    <option>Choose one</option>
                                    {sTemplateActionIdList.map(item => (
                                        <option
                                            key={item.ID}
                                            value={item.ID}>
                                            {item.TemplateName}
                                        </option>
                                    ))}
                                </select>
                                {errors.templete.length > 0 && <span className='error'>{errors.templete}</span>}
                            </div>
                            <div className="col-md-3 form-group">
                                <label className="custom_label">Machine <span className="star_mark">*</span></label>
                                <select className="form-control" value={sMachineActionId} disabled={isViewChar || isStationSelected  || isOperationSelected} onChange={e => onMachineDropdownChange(e.currentTarget.value)}>
                                    <option>Choose one</option>
                                    {sMachineActionIdList.map(item => (
                                        <option
                                            key={item.ID}
                                            value={item.ID}>
                                            {item.MachineName}
                                        </option>
                                    ))}
                                </select>
                                {errors.machine.length > 0 && <span className='error'>{errors.machine}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="az-content-label mg-b-5">Date Range <span className="star_mark">*</span></div>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="input-group" style={{ display: 'none' }}>
                                        <input type="text" className="form-control fc-datepicker" id="datetimepicker3" defaultValue placeholder="From Date" />
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">
                                                <i className="typcn typcn-calendar-outline tx-24 lh--9 op-6" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className='daterangecss'>
                                            <label className='d-flex'>
                                                <DatePicker className="form-control" dateFormat="dd/MM/yyyy" selected={modifyFromDate} disabled={isViewChar}
                                                    onChange={(date) => setModifyFromDate(date)} placeholderText="From Date" />
                                                <FaCalendarAlt className='form-control col-md-3 bg-light' style={{
                                                    flex: '0 0 19%',
                                                    maxWidth: '19%', color: '#bbbcbf'
                                                }} />
                                            </label>
                                        </div>
                                        {errors.from_Date.length > 0 && <span className='error'>{errors.from_Date}</span>}

                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="input-group">
                                        <div className='daterangecss'>
                                            <label className='d-flex'>
                                                <DatePicker className="form-control" dateFormat="dd/MM/yyyy"
                                                    minDate={modifyFromDate}
                                                    showDisabledMonthNavigation
                                                    selected={modifyToDate} disabled={isViewChar} onChange={(date) => toDateValidation(date)} placeholderText="To Date" />
                                                <FaCalendarAlt className='form-control col-md-3 bg-light' style={{
                                                    flex: '0 0 19%',
                                                    maxWidth: '19%', color: '#bbbcbf'
                                                }} />
                                            </label>
                                        </div>
                                        {errors.to_Date.length > 0 && <span className='error'>{errors.to_Date}</span>}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group" style={{ backgroundColor: 'rgba(0, 0, 0, 0.06)', padding: '15px 15px' }}>
                            <div className="row" style={{ display: 'block' }}>
                                {
                                    isViewChar ?
                                        <div>
                                            <div className="az-content-label mg-b-5" style={{ paddingLeft: '15px' }}>Characteristics <span className="star_mark">(Double click on the row, to modify the data)</span></div>
                                            <div className="col-md-12">
                                                <div className="table_wrapper">
                                                    <div className="hack1">
                                                        <div className="hack2">
                                                            <table className="table table-bordered mg-b-15 modfy_characterstc">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Sr No</th>
                                                                        <th>Date Time</th>
                                                                        <th>SPC Station</th>
                                                                        <th>Template</th>
                                                                        <th>Characteristics</th>
                                                                        <th>Machine</th>
                                                                        <th>Pallet</th>
                                                                        <th>Part No</th>
                                                                        <th>Reading</th>
                                                                        <th>Event</th>
                                                                        <th>Operator</th>
                                                                        <th>Shift</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {modifyCharTableList.length > 0 ?
                                                                        (
                                                                            modifyCharTableList.map((data, i) => (
                                                                                <tr key={data.SrNo} data-toggle="modal" onDoubleClick={() => toggleModalEditChar(data, i)}>
                                                                                    <td>{data.SrNo}</td>
                                                                                    <td>{moment(data.DateTime).format('DD-MM-YYYY HH:MM')}</td>
                                                                                    <td>{data.SPCStation}</td>
                                                                                    <td>{data.Template}</td>
                                                                                    <td>{data.Characteristic}</td>
                                                                                    <td>{data.Machine}</td>
                                                                                    <td>{data.Pallete}</td>
                                                                                    <td>{data.PartNo}</td>
                                                                                    <td>{data.Reading}</td>
                                                                                    <td>{data.Event}</td>
                                                                                    <td>{data.Operator}</td>
                                                                                    <td style={{ whiteSpace: 'nowrap' }}>{data.Shifts}</td>
                                                                                </tr>
                                                                            ))
                                                                        ) :
                                                                        (
                                                                            <tr>
                                                                                <td colSpan={"13"} className="text-center">{!isLoading ? 'Data is not available' : ''}</td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                </tbody>
                                                            </table>

                                                            {/* <Records list={currentRecords} />
                                                            <Pagination
                                                                nPages={nPages}
                                                                currentPage={currentPage}
                                                                setCurrentPage={setCurrentPage}  />
                                                           */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                       <div>
                                                <div className="az-content-label mg-b-5" style={{ paddingLeft: '15px' }}>
                                                Characteristics
                                            </div>

                                            {isShowChar? isCharacteristicsList.map((element, index) => (
                                                    <div
                                                    className="col-md-3 padd_right_0"
                                                    style={{ paddingRight: '0px' }}
                                                    key={element.CharacteristicsID ?? `${element.CharacteristicsName}_${index}`}
                                                    >
                                                    <label className="ckbox mg-b-5 font_12">
                                                        <input type="checkbox" checked={element.isCheck} onChange={() => onCheckCharacteristicsManagement(index)} />
                                                        <span>{element.CharacteristicsName}</span>
                                                    </label>
                                                    </div>
                                                ))
                                                : null}
                                            </div>
                                }
                            </div>
                        </div>
                        <hr className="mg-y-15" />
                        <div className="az-footer mg-t-auto" id="az_footer_id">
                            <div className="container-fluid">
                                <div className="row">
                                    {isViewChar ?
                                        (
                                            <div className="col-md-12 text-right">
                                                <a className="btn cancel_btn" onClick={() => setIsViewChar(!isViewChar)}><i class="fa fa-times"></i> Cancel</a>
                                            </div>

                                        ) : (
                                            <div className="col-12 text-right">
                                                <a className="btn exportToXL_btn" onClick={() => getCharList(1)}><i class="fa fa-paper-plane-o"></i> Proceed</a>

                                            </div>
                                        )
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modify;