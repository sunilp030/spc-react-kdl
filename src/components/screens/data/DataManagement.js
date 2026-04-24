import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, dropdownValidator, inputWithRangeValidator, dateValidator } from '../../utils/Validator';
import { charactersticActionId, managementListUrl, managementAccessUrl, templateListUrl, managementActionId, managementDetailsUrl, deleteManagementUrl, appVersion, NA, inputMaxLength, statusActionId, fillListUrl, operationActionId, machineActionId, templateActionId, stationActionId, stationAccordingToOperationActionId } from '../../utils/constants';
import queryString from 'query-string';
import $, { isEmptyObject } from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import groupBy from 'lodash/groupBy';
import { FaCalendarAlt } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
// import { DatePicker } from '@material-ui/pickers'
// import Records from './records';
import Pagination from './pagination';

Modal.setAppElement("#root");

const DataManagement = (props) => {

  const errorMap = {
    from_Date: ' ',
    to_Date: '',
    operation_line: '',
    spc_station: '',
    machine: '',
    templete: '',
    pallet: '',
  };
  const [userData, setUserData] = useState({});
  const [managementList, setManagementList] = useState([]);
  const [managementAccessList, setManagementAccessList] = useState([]);
  const [managementDetails, setManagementDetails] = useState({});
  const [managementId, setManagementId] = useState('');
  const [managementCode, setManagementCode] = useState('');
  const [managementName, setManagementName] = useState('');
  const [noOfReading, setNoOfReading] = useState('');
  const [isATA, setATA] = useState(false);
  const [createdUser, setCreatedUser] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [createdVersion, setCreatedVersion] = useState('');
  const [modifiedUser, setModifiedUser] = useState('');
  const [modifiedDate, setModifiedDate] = useState('');
  const [modifiedVersion, setModifiedVersion] = useState('');
  const [deletedUser, setDeletedUser] = useState('');
  const [deletedDate, setDeletedDate] = useState('');
  const [deletedVersion, setDeletedVersion] = useState('');
  const [deleteManagementId, setManagementIdForDelete] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setError] = useState(errorMap);
  const history = useHistory();
  const [isWriteAccess, setWriteAccess] = useState(false);
  const [isDeleteAccess, setDeleteAccess] = useState(false);
  const [isActive, setIsActive] = useState('');
  const [statusName, setStatusName] = useState('');
  const [stationList, setStationList] = useState([]);
  const [sManagementCode, setSManagementCode] = useState('');
  const [sManagementName, setSManagementName] = useState('');
  const [sNoOfReading, setSNoOfReading] = useState('');
  const [statusId, setStatusId] = useState('');
  const [managementFromDate, setManagementFromDate] = useState();
  const [managementToDate, setManagementToDate] = useState();
  const [stationId, setStationId] = useState('');
  const [sMachineActionIdList, setSMachineActionIdList] = useState([]);
  const [sMachineActionId, setSMachineActionId,] = useState('');
  const [sTemplateActionIdList, setTemplateActionIdList] = useState([]);
  const [sTemplateActionId, setTemplateActionId] = useState('');
  const [sStationActionId, setSStationActionId] = useState('');
  const [sOperationActionIdList, setOperationActionIdList] = useState([]);
  const [sOperationActionId, setOperationActionId] = useState('');
  const [isCharacteristicsList, setIsCharacteristicsList] = useState([]);
  const [isCharacteristics, setIsCharacteristics] = useState(false);
  const [managementIdList, setManagementIdList] = useState([]);
  const [tempManagementList, setTempManagementList] = useState([]);
  const [dataa, setData] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [templateDetails, setTemplateDetails] = useState({});
  const [templateId, setTemplateId] = useState('');
  const [isShowChar, setIsShowChar] = useState(false);
  const [chartDesc, setChartDesc] = useState('');
  const [modelNo, setModelNo] = useState('');
  const [chartCharacterList, setChartCharacterList] = useState([]);
  const [chartName, setChartName] = useState('');
  const [selectedCharIdList, setSelectedCharIdList] = useState([]);
  const [isViewChar, setIsViewChar] = useState(false);
  const [managementCharTableList, setManagementCharTableList] = useState([]);
  const [charTabelRowClickList, setCharTabelRowClickList] = useState([]);
  // const [isCharCheck, setIsCharCheck] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isShowDeleteBtn, setIsShowDeleteBtn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isOperationSelected, setIsOperationSelected] = useState(true);
  const [isStationSelected, setIsStationSelected] = useState(true);

  const [recordsPerPage] = useState(10);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // Records to be displayed on the current page
  const currentRecords = managementCharTableList.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(managementCharTableList.length / recordsPerPage)
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
    if (props.location.state != null) {
      setManagementId(props.location.state.managementId);
    }
    getList(userData, '');
    getFillList(userData, stationActionId, "");
    getFillList(userData, operationActionId, '');
    getFillList(userData, templateActionId, '');
    getFillList(userData, machineActionId, '');
    getFillList(userData, managementActionId, '');
    // getManagementAccess(userData);
  }, []);

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
        setTemplateActionIdList(result['data']);
      }
      else if (actionId == machineActionId) {
        setSMachineActionIdList(result['data']);
      }
      else if (actionId == charactersticActionId) {
        setIsCharacteristicsList(result['data']);
      }
    }
  };

  const getList = async (data, search) => {
    setLoader(true);
    var result = await axiosGet(`${templateListUrl}?Login_Id=${data.ID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      setManagementList(result['data']);
      setManagementIdList(result['data']);
      setTempManagementList(result['data']);
      grouping(result['data']);
    }
  };

const grouping = (data) => {
  const a = groupBy(data, function (n) {
    return n.OperationLineName;
  });

  // grouping by operation name
  var groups = Object.keys(a).map(function (operationKey) {
    // grouping by station name
    const s = groupBy(a[operationKey], function (n) {
      return n.StationName;
    });

    var groups_station = Object.keys(s).map(function (stationKey) {
      var list = s[stationKey];
      var newList = [];

      for (var i = 0; i < list.length; i++) {
        var map = {
          value: list[i]['TemplateID'],     // already stable
          label: list[i]['TemplateName'],
          isToggle: false,
        };
        newList.push(map);
      }
      return {
        label: stationKey,
        value: stationKey,
        children: newList
      };
    });

    return {
      label: operationKey,
      value: operationKey,
      children: groups_station
    };
  });

  // No need to clear first
  setData(groups);
};


  const onTreeChecked = (checked_node) => {

    if (checked.length > 0) {
      if (checked_node.includes(checked[0])) {
        var index = checked_node.indexOf(checked[0]);
        checked_node.splice(index, 1);
      }
    }
    setChecked(checked_node)

    if (checked_node.length > 0) {
      for (var i = 0; i < sOperationActionIdList.length; i++) {
        if (sOperationActionIdList[i]['Name'] == checked_node['label']) {
          setOperationActionId(sOperationActionIdList[i]['ID']);
          setSelectedOperation(sOperationActionIdList[i]['ID']);
          getFillList(userData, stationAccordingToOperationActionId, sOperationActionIdList[i]['ID']);
        }
      }
      //set spc station name............................... 
      // for (var i = 0; i < stationList.length; i++) {
      //   if (stationList[i]['NAME'] == checked_node['label']) {
      //     setStationId(stationList[i]['ID']);
      //     setSelectedStation(stationList[i]['ID']);
      //     getFillList(userData,machineActionId, stationList[i]['ID']);
      //     getFillList(userData,templateActionId, stationList[i]['ID']);
      //   }
      // }
      setTemplateId(checked_node[0]);
      setManagementDetails(userData, checked_node[0])
      setTemplateActionId(checked_node[0]);
      getFillList(userData, charactersticActionId, checked_node[0]);
      setIsShowChar(true);
    } else {
      setTemplateId('');
      setManagementDetails('');
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
      // setExpanded([]);
      setExpanded(arr);
    } else {
      exp.push(checked_node['value'].toString());
      // setExpanded([]);
      setExpanded(exp);

    }
    if (checked_node['value'] != '') {
      if (!checked_node['value'].toString().includes('.')) {
        setTemplateActionId(checked_node['value']);
        // getTemplateDetails(userData, checked_node['value'])
      }

    }
    var idList = [];
    idList.push(checked_node['value'].toString());
    setChecked(idList);

    setIsShowChar(false);
    //set operation name............................... 
    for (var i = 0; i < sOperationActionIdList.length; i++) {
      if (sOperationActionIdList[i]['Name'] == checked_node['label']) {
        setOperationActionId(sOperationActionIdList[i]['ID']);
        setSelectedOperation(sOperationActionIdList[i]['ID']);
        getFillList(userData, stationAccordingToOperationActionId, sOperationActionIdList[i]['ID']);
        setIsOperationSelected(false);

      }
    }
    //set spc station name............................... 
    for (var i = 0; i < stationList.length; i++) {
      if (stationList[i]['NAME'] == checked_node['label']) {
        setStationId(stationList[i]['ID']);
        setSelectedStation(stationList[i]['ID']);
        getFillList(userData, machineActionId, stationList[i]['ID']);
        getFillList(userData, templateActionId, stationList[i]['ID']);
        setIsStationSelected(false);

      }
    }
    //set Template name............................... 
    for (var i = 0; i < sTemplateActionIdList.length; i++) {
      if (sTemplateActionIdList[i]['TemplateName'] == checked_node['label']) {
        setTemplateActionId(sTemplateActionIdList[i]['ID']);
        getFillList(userData, charactersticActionId, sTemplateActionIdList[i]['ID']);
        setIsShowChar(true);
        var idList = [];
        idList.push(sTemplateActionIdList[i]['ID'].toString());
        setChecked(idList);
      }
    }
  }

  const onExpand = (exp) => {
    setExpanded(exp)
  }

  // api call for management access list........................
  const getManagementAccess = async (data) => {

    setLoader(true);
    var result = await axiosGet(`${managementAccessUrl}?Login_Id=${data.ID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      setManagementAccessList(result['data']);
    }
  };
  // api call for management details........................
  const getManagementDetails = async (data, managementID) => {
    setLoader(true);
    var result = await axiosGet(`${managementDetailsUrl}?Login_Id=${data.ID}&Management_id=${managementID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      if (result['data'] != null) {
        setManagementDetails(result['data']);
        setManagementCode(result['data'][0]['ManagementCode'] ?? NA);
        setManagementName(result['data'][0]['Management_name'] ?? NA);
        setNoOfReading(result['data'][0]['NoOfReading'] ?? NA);
        setATA(result['data'][0]['ApplyAll'] ?? NA);
        setIsActive(result['data'][0]['StatusID']);
        setStatusName(result['data'][0]['StatusName']);
        setCreatedUser(result['data'][0]['CreatedUser'] ?? NA);
        setCreatedVersion(result['data'][0]['CreatedVersion'] ?? NA);
        setCreatedDate(result['data'][0]['CreatedDate'] != null ? moment(result['data'][0]['CreatedDate']).format('DD-MM-YYYY') : NA);

        setModifiedUser(result['data'][0]['ModifiedUser'] ?? NA);
        setModifiedVersion(result['data'][0]['ModifiedVersion'] ?? NA);
        setModifiedDate(result['data'][0]['ModifiedDate'] != null ? moment(result['data'][0]['ModifiedDate']).format('DD-MM-YYYY') : NA);

        setDeletedUser(result['data'][0]['DeletedUser'] ?? NA);
        setDeletedVersion(result['data'][0]['DeletedVersion'] ?? NA);
        setDeletedDate(result['data'][0]['DeletedDate'] != null ? moment(result['data'][0]['DeletedDate']).format('DD-MM-YYYY') : NA);
      }

    }
  };

  //management access checkbox changed...............................
  const onManagementAccessChanged = (index, isRead, isWrite, isDelete) => {
    const managementAccList = managementAccessList;
    managementAccList[index]['Read'] = isRead;
    managementAccList[index]['write'] = isWrite;
    managementAccList[index]['Delete'] = isDelete;
    setManagementAccessList([]);
    setManagementAccessList(managementAccList);
    // history.push({pathname :'/management',state : {'managementId' : managementId}});
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

  //toggle model for delete.................................
  function toggleModal(managementId) {
    setIsOpen(!isOpen);
    if (managementId == '') {
      return;
    } else {
      setManagementIdForDelete(managementId);
    }

  }

  //toggle model for filter .................................
  function toggleFilterModal(managementId) {
    setIsFilterOpen(!isFilterOpen);
    if (managementId == '') {
      return;
    } else {
      setManagementIdForDelete(managementId);
    }
  }


  //on delete button click............................................
  const onDeleteClick = async () => {
    setLoader(true);
    var charList = [];
    for (var i = 0; i < managementCharTableList.length; i++) {
      if (managementCharTableList[i]['isCharCheck']) {
        // setIsShowDeleteBtn(!isShowDeleteBtn);
        setIsSelected(!isSelected);
        var mapData = {
          // 'Login_Id': userData.ID,
          // 'SrNo': managementCharTableList[i]['SrNo'] ?? "",
          'DataHdrID': managementCharTableList[i]['DataHdrID'] ?? "",
          // 'SerialNo': managementCharTableList[i]['SerialNo'] ?? "",
          // 'DateTime': managementCharTableList[i]['DateTime'] ?? "",
          // 'SPCStation': managementCharTableList[i]['SPCStation'] ?? "",
          // 'Template': managementCharTableList[i]['Template'] ?? "",
          // 'CharacterID': managementCharTableList[i]['CharacterID'] ?? "",
          // 'Characteristic': managementCharTableList[i]['Characteristic'] ?? "",
          // 'Machine': managementCharTableList[i]['Machine'] ?? "",
          // 'Pallete': managementCharTableList[i]['Pallete'] ?? "",
          // 'PartNo': managementCharTableList[i]['PartNo'] ?? "",
          // 'Reading': managementCharTableList[i]['Reading'] ?? "",
          // 'Event': managementCharTableList[i]['Event'] ?? "",
          // 'Operator': managementCharTableList[i]['Operator'] ?? "",
          // 'Shifts': managementCharTableList[i]['Shifts'] ?? "",
        };
        charList.push(mapData);
      }
    }
    if (charList.length > 0) {
      var mapData = {
        'Login_id': userData.ID,
        'charList': charList
      }
      var result = await axiosPost(deleteManagementUrl, mapData);

      setLoader(false);
      if (result != null && result['error'] == 0) {
        setManagementCharTableList(managementCharTableList.filter(item => !item.isCharCheck));
        toast.success('Record deleted successfully.', {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true
        });
        // clearField()
        setIsShowDeleteBtn(false);
      } else {
        toast.error(result['msg'], {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true
        });
      }
      setIsViewChar(!isViewChar);
    } else {
      // setIsShowDeleteBtn(!isShowDeleteBtn);
      toast.error('Please select atleast one characteristics', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      setLoader(false);
    }

  };

  const clearField = () => {
    errorMap.from_Date = '';
    errorMap.to_Date = '';
    errorMap.operation_line = '';
    errorMap.spc_station = '';
    errorMap.machine = '';
    errorMap.templete = '';
    setError(errorMap);
    setManagementId('');
    setManagementCode('');
    setManagementName('');
    setNoOfReading('');
    setStatusName('');
    setIsActive('');
    getList(userData, '');
  }

  const onCharTabelSelectAllRowClick = (value) => {
    setIsAllChecked(value);
    var charTableList = managementCharTableList;
    for (var i = 0; i < charTableList.length; i++) {
      charTableList[i]['isCharCheck'] = value;
    }
    setManagementCharTableList([]);
    setManagementCharTableList(charTableList);
    setIsShowDeleteBtn(value);
  }

  const onCharTabelRowClick = (srNo, index) => {
    var charTableList = managementCharTableList;
    for (var i = 0; i < charTableList.length; i++) {
      if (charTableList[i]['SrNo'] == srNo) {
        charTableList[i]['isCharCheck'] = !charTableList[i]['isCharCheck'];
      }
    }
    var isSingleCheck = false;
    var isAllCheck = true;
    for (var i = 0; i < charTableList.length; i++) {
      if (charTableList[i]['isCharCheck']) {
        isSingleCheck = true;
      }
      if (!charTableList[i]['isCharCheck']) {
        isAllCheck = false;
      }
    }
    setManagementCharTableList([]);
    setManagementCharTableList(charTableList);
    setIsShowDeleteBtn(isSingleCheck ? true : false);
    setIsAllChecked(isAllCheck ? true : false);

  }

  //on back button click............................................
  const onBackClick = async () => {
    history.goBack();
  };

  // operation dropdown validate.........................................
  const onOperationDropdownChange = (value) => {
    // console.log("val");
    setOperationActionId(value);
    dropdownValidate(value, 'Operation');
    getFillList(userData, stationAccordingToOperationActionId, value);
   
    if(value == 'Choose one'){
      setIsOperationSelected(true);
    }else{
      setIsOperationSelected(false);
    }
    setStationId('');
  };


  // station dropdown validate.........................................
  const onStationDropdownChange = (value) => {
    setStationId(value);
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
    dropdownValidate(value, 'Station');
  };

  // template dropdown validate.........................................
  const onTemplateDropdownChange = (value) => {
    setTemplateActionId(value);

    getFillList(userData, charactersticActionId, value);
    setIsShowChar(true);
    dropdownValidate(value, 'Station');
  };


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

  const onViewClick = async () => {
    if (managementToDate == '' || managementToDate == null) {
      // modifyToDate = modifyFromDate;
      setManagementToDate(managementFromDate);
    }
    dateValidate(managementFromDate, 'from date', managementToDate)
    if (managementToDate != null && managementToDate != '') {
      dateValidate(managementToDate, 'to date', managementFromDate)
    }

    dropdownValidate(sOperationActionId, 'operation line');
    dropdownValidate(stationId, 'spc station');
    dropdownValidate(sMachineActionId, 'machine');
    dropdownValidate(sTemplateActionId, 'templete');

    if (!dateValidate(managementFromDate, 'from date', managementToDate)) {
      return;
    }
    if (managementToDate != null && managementToDate != '') {
      if (!dateValidate(managementToDate, 'to date', managementFromDate)) {
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
    // if (!isEmptyObject(selectedCharIdList)) {

      setLoader(true);
      var result = await axiosGet(`${managementListUrl}?ActionId=1&OperationLineId=${sOperationActionId}&StationId=${stationId}&TemplateId=${sTemplateActionId}&MachineId=${sMachineActionId}&CharacteristicsId=${selectedCharIdList.toString()}&FromDate=${moment(managementFromDate).format('YYYY-MM-DD').toString()}&ToDate=${managementToDate != null ? moment(managementToDate).format('YYYY-MM-DD').toString() : moment(managementFromDate).format('YYYY-MM-DD').toString()}`);

      if (result != null && result['error'] == 0) {
        for (var i = 0; i < result['data'].length; i++) {
          result['data'][i]['isCharCheck'] = false;
        }
        setManagementCharTableList(result['data'])
        setIsViewChar(true);
      } else {
        toast.error(result['msg'], {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true
        });
      }


      setLoader(false);
    // }
    // else {
    //   toast.error('Please select atleast one characteristics', {
    //     autoClose: 3000,
    //     hideProgressBar: true
    //   });
    // }

  }

  const onCancelBtnClick = () => {
    setIsViewChar(!isViewChar);
    setIsAllChecked(false);
    setIsShowDeleteBtn(!isShowDeleteBtn);
  }

  const Records = ({ list }) => {
    return (
      <table className="table table-bordered mg-b-15">
        <thead>
          <tr>
            <th>
              <label className="ckbox" key={list.SrNo}>
                <input key={list.SrNo} type="checkbox" defaultChecked={isAllChecked} onChange={() => onCharTabelSelectAllRowClick(!isAllChecked)} /><span> </span>
              </label>
            </th>
            <th>Serial No</th>
            <th>Date Time</th>
            <th>SPC Station</th>
            <th>Template</th>
            <th>Characteristics</th>
            <th>Machine</th>
            <th>Pallet</th>
            <th>Part No</th>
            <th>Reading</th>
            <th>Event</th>
            <th className='operator_class'>Operator</th>
            <th>Shift</th>
          </tr>
        </thead>
        <tbody>
            {list.length > 0 ? (
              list.map((data, i) => (
                <tr key={data.SrNo ?? i}>
                  <td>
                    <label className="ckbox">
                      <input
                        type="checkbox"
                        checked={data.isCharCheck}
                        onChange={() => onCharTabelRowClick(data.SrNo, i)}
                      />
                      <span> </span>
                    </label>
                  </td>

                  <td>{data.SrNo}</td>
                  <td>{moment(data.DateTime).format("DD-MM-YYYY HH:mm")}</td>
                  <td>{data.SPCStation}</td>
                  <td>{data.Template}</td>
                  <td>{data.Characteristic}</td>
                  <td>{data.Machine}</td>
                  <td>{data.Pallete}</td>
                  <td>{data.PartNo}</td>
                  <td>{data.Reading}</td>
                  <td>{data.Event}</td>
                  <td>{data.Operator}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{data.Shifts}</td>
                </tr>
              ))
            ) : (
              !isLoading && (
                <tr>
                  <td colSpan="13" className="text-center">
                    Data is not available
                  </td>
                </tr>
              )
            )}
        </tbody>

      </table>
    )
  }

  const toDateValidation = (date) => {
    if (date == null || date == '') {
      setManagementToDate(managementFromDate);
    }
    else {
      setManagementToDate(date);
    }
  }

  const getKeys = () => {
    if (typeof Object.keys(managementCharTableList) !== 'undefined' && Object.keys(managementCharTableList).length > 0) {
      //   Object.keys(null)
      // Object.assign(window.UndefinedVariable, {}) 
      return Object.keys(managementCharTableList[0]);
    }
  }

  const getHeader = () => {
    if (typeof Object.keys(managementCharTableList) !== 'undefined' && Object.keys(managementCharTableList).length > 0) {
      var keys = getKeys();
      return keys.map((key, index) => {
        console.log('value : ',index, " ",(managementCharTableList.length-1));
        return index == 1 || index == (keys.length -1) ? (null) : (<th title={key} key={key}>{key.toUpperCase()}</th>)
      })
    }
  }

  const RenderRow = (props) => {
    return props.keys.map((key, index) => {
      return (index == 1 || index == (props.keys.length -1) ? (null) : (<td key={props.data[key]}>{props.data[key]}</td>))
    })
  }

  const getRowsData = () => {
  const items = managementCharTableList;
  const keys = getKeys();

  return items.map((row, index) => (
    <tr key={row.SrNo ?? index}>
      <td className="text-center">
        <label className="ckbox" style={{ display: "initial" }}>
          <input
            type="checkbox"
            checked={row.isCharCheck}
            onChange={() => onCharTabelRowClick(row.SrNo, index)}
          />
          <span style={{ paddingLeft: "3px" }}></span>
        </label>
      </td>

      <RenderRow data={row} keys={keys} />
    </tr>
  ));
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
        isOpen={isOpen}
        onRequestClose={toggleModal}>
        {/* <div class="modal fade" id="delete_pop_modal" management="dialog"> */}
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content" style={{ borderRadius: '0px' }}>
            <div class="modal-header">
              <h4 class="modal-title modal_title_text">Confirm Delete</h4>
              <button type="button" class="close" data-bs-dismiss="modal" onClick={toggleModal}>&times;</button>

            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <h3 className='pop_label'>Do you really want to delete this management?</h3>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group text-right" style={{ marginTop: '25px' }}>
                    <a href="javascript:void(0);" class="btn save_btn" onClick={onDeleteClick}><i class='fa fa-check'></i>&nbsp; Yes</a>
                    <a href="javascript:void(0);" class="btn cancel_btn" data-bs-dismiss="modal" style={{ marginLeft: '5px' }} onClick={toggleModal}><i class="fa fa-times"></i>&nbsp; No</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Modal>

      <Header activeId={'isManagementActiveColor'} />

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
                  onExpand={(exp) => setExpanded(exp)}
                  onlyLeafCheckboxes={true}
                  showNodeIcon={false}
                />
              </nav>


              {/* <a href="#" className="btn btn-primary add_btn"><i className="fa fa-plus" /> </a> */}
            </div>
            <div className='version_class'>
              <p>Version : 1.0.0 Build 20220511</p>
              <p>Copyright © 2022 | All Rights Reserved</p>
            </div>
          </div>{/* az-content-left */}
          <div className="az-content-body pd-lg-l-40 d-flex flex-column" id='main'>

            <button className='wrapperrr_div_open' id="openNavi" onClick="openNav()">
              <i className='fa fa-chevron-right'></i>
            </button>
            <h2 className="az-content-title">Data Management</h2>
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
                <select className="form-control" value={sMachineActionId} disabled={isViewChar || isStationSelected || isOperationSelected} onChange={e => onMachineDropdownChange(e.currentTarget.value)}>
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
                <div className="col-md-3 ">
                  <div className="input-group" style={{ display: 'none' }}>
                    <input type="text" className="form-control fc-datepicker" id="datetimepicker3" placeholder="From Date" />
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <i className="typcn typcn-calendar-outline tx-24 lh--9 op-6" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group">
                    <div className='daterangecss'>
                      {/* <div class="input-group date" data-provide="datepicker">
                        <input type="text" class="form-control"/>
                          <div class="input-group-addon">
                            <span class="glyphicon glyphicon-th"></span>
                          </div>
                      </div> */}
                      <label className='d-flex'>
                        <DatePicker className="form-control" dateFormat="dd/MM/yyyy" selected={managementFromDate} disabled={isViewChar} onChange={(date) => setManagementFromDate(date)} placeholderText="From Date" />
                        <FaCalendarAlt className='form-control col-md-3 bg-light' style={{
                          flex: '0 0 19%',
                          maxWidth: '19%', color: '#bbbcbf'
                        }} />
                      </label>
                      {/* <input type="text" className="form-control fc-datepicker" placeholder="From Date" /> */}
                      {/* <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="typcn typcn-calendar-outline tx-24 lh--9 op-6" />
                        </div>
                      </div> */}
                    </div>
                    {errors.from_Date.length > 0 && <span className='error'>{errors.from_Date}</span>}

                  </div>
                </div>
                <div className="col-md-3">

                  <div className="input-group">
                    <div className='daterangecss'>

                      <label className='d-flex'>
                        <DatePicker className="form-control" dateFormat="dd/MM/yyyy" selected={managementToDate}
                          minDate={managementFromDate}
                          showDisabledMonthNavigation
                          disabled={isViewChar} onChange={(date) => toDateValidation(date)} placeholderText="To Date" />
                        <FaCalendarAlt className='form-control col-md-3 bg-light' style={{
                          flex: '0 0 19%',
                          maxWidth: '19%', color: '#bbbcbf'
                        }} />
                      </label>
                      {/* <input type="text" className="form-control fc-datepicker" placeholder="To Date" /> */}
                      {/* <div className="input-group-prepend">
                        <div className="input-group-text">
                          <i className="typcn typcn-calendar-outline tx-24 lh--9 op-6" />
                        </div>
                      </div> */}
                    </div>
                    {errors.to_Date.length > 0 && <span className='error'>{errors.to_Date}</span>}

                  </div>
                </div>

              </div>
            </div>

            <div className="form-group" style={{ backgroundColor: 'rgba(0, 0, 0, 0.06)', padding: '15px 15px' }}>
              <div className="az-content-label mg-b-5">Characteristics</div>

              <div className="row">
                {
                  isViewChar ?
                    <div className="row p-3">
                      <div className="col-md-12">
                        <div className="table_wrapper">
                          <div className="hack1">
                            <div className="hack2">
                              <table className="table table-bordered mg-b-15">
                                <thead>
                                  <tr>
                                    {managementCharTableList.length > 0 && (
                                      <th>
                                        <label className="ckbox">
                                          <input
                                            type="checkbox"
                                            checked={isAllChecked}
                                            onChange={() => onCharTabelSelectAllRowClick(!isAllChecked)}
                                          />
                                          <span> </span>
                                        </label>
                                      </th>
                                    )}
                                                                        
                                    {managementCharTableList.length > 0 ? (
                                      getHeader()
                                    ) : (
                                      null
                                    )}
                                    {/* <th>Serial No</th>
                                    <th>Date Time</th>
                                    <th>SPC Station</th>
                                    <th>Template</th>
                                    <th>Characteristics</th>
                                    <th>Machine</th>
                                    <th>Pallet</th>
                                    <th>Part No</th>
                                    <th>Reading</th>
                                    <th>Event</th>
                                    <th className='operator_class'>Operator</th>
                                    <th>Shift</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    managementCharTableList.length > 0 ? (

                                      // (managementCharTableList.map((data, i) => (
                                        // <tr key={Math.random()} >
                                        //   <td className='text-center'>
                                        //     <label className="ckbox" style={{ display: "initial" }} key={Math.random()} >
                                        //       <input key={Math.random()} type="checkbox" defaultChecked={data.isCharCheck} onChange={() => onCharTabelRowClick(data.SrNo, i)} /><span style={{ paddingLeft: "3px" }}></span>
                                        //     </label>
                                        //   </td>
                                        //   <td>{i + 1}</td>
                                        //   <td>{moment(data.DateTime).format('DD-MM-YYYY HH:MM')}</td>
                                        //   <td>{data.SPCStation}</td>
                                        //   <td>{data.Template}</td>
                                        //   <td>{data.Characteristic}</td>
                                        //   <td>{data.Machine}</td>
                                        //   <td>{data.Pallete}</td>
                                        //   <td>{data.PartNo}</td>
                                        //   <td>{data.Reading}</td>
                                        //   <td>{data.Event}</td>
                                        //   <td>{data.Operator}</td>
                                        //   <td style={{ whiteSpace: 'nowrap' }}>{data.Shifts}</td>
                                        // </tr>

                                      // ))
                                      getRowsData()
                                      ) : (
                                        <tr>
                                          <td colSpan={"13"} className="text-center">Data is not available</td>
                                        </tr>
                                      )
                                  }


                                </tbody>
                              </table>
                              {/* // table */}
                              {/* <Records list={currentRecords} />
                           <Pagination
                            nPages={nPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage} /> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        {/* // pagination start */}
                        {/* <div className="row">
                          <Records data={currentRecords} />
                          <Pagination
                            nPages={nPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage} />
                        </div> */}
                        {/* // pagination end */}
                      </div>
                    </div>
                    :
                   (isShowChar? isCharacteristicsList.map((element, index) => (
                        <div
                          className="col-md-3 padd_right_0"
                          key={element.CharacteristicsID ?? `${element.CharacteristicsName}_${index}`}
                        >
                          <label className="ckbox mg-b-5 font_12">
                            <input
                              type="checkbox"
                              checked={element.isCheck}
                              onChange={() => onCheckCharacteristicsManagement(index)}
                            />
                            <span>{element.CharacteristicsName}</span>
                          </label>
                        </div>
                      ))
                    : null
                )

                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="az-footer mg-t-auto" id="az_footer_id">
        <div className="container-fluid">
          <div className="row">

            <div className="col-md-12 text-right">
              {isViewChar ? (
                <div>
                  <a className="btn delete_btn" disabled={!isShowDeleteBtn} onClick={() => !isShowDeleteBtn ? "" : onDeleteClick()}><i class="fa fa-trash-o"></i>&nbsp; Delete</a>
                  <a className="btn cancel_btn" onClick={() => onCancelBtnClick()}><i class="fa fa-chevron-left"></i>&nbsp; Back</a>
                </div>
              ) : (<a className="btn exportToXL_btn" onClick={() => onViewClick()}><i class="fa fa-eye"></i>&nbsp; View Data</a>
              )}

            </div>
          </div>

        </div>
      </div>

    </>
  );
}
export default DataManagement;