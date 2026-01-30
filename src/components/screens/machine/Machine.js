import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, dropdownValidator, palletValidator } from '../../utils/Validator';
import { stationListUrl, machineListUrl, spcFilterStationActionId, machineAccessUrl, insertMachineUrl, machineDetailsUrl, updateMachineUrl, deleteMachineUrl, appVersion, NA, inputMaxLength, statusActionId, machinePalletActionId, fillListUrl, stationActionId, stationWithOperationActionId } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal, { setAppElement } from "react-modal";

Modal.setAppElement("#root");
var selectedMachineId = '';
const Machine = (props) => {


  const errorMap = {
    machine_no: '',
    machine_name: '',
    station: '',
    pallet:''
  };
  const [userData, setUserData] = useState({});
  const [machineList, setMachineList] = useState([]);
  const [tempMachineList, setTempMachineList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [machineAccessList, setMachineAccessList] = useState([]);
  const [machineDetails, setMachineDetails] = useState({});
  const [machineId, setMachineId] = useState('');
  const [machineNo, setMachineNo] = useState('');
  const [machineName, setMachineName] = useState('');
  const [stationId, setStationId] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [createdUser, setCreatedUser] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [createdVersion, setCreatedVersion] = useState('');
  const [modifiedUser, setModifiedUser] = useState('');
  const [modifiedDate, setModifiedDate] = useState('');
  const [modifiedVersion, setModifiedVersion] = useState('');
  const [deletedUser, setDeletedUser] = useState('');
  const [deletedDate, setDeletedDate] = useState('');
  const [deletedVersion, setDeletedVersion] = useState('');
  const [deleteMachineId, setMachineIdForDelete] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setError] = useState(errorMap);
  const history = useHistory();
  const [isWriteAccess, setWriteAccess] = useState(false);
  const [isDeleteAccess, setDeleteAccess] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [sMachineSpcStaionIdList, setSMachineSpcStaionIdList] = useState([]);
  const [sMachineName, setSMachineName] = useState('');
  const [sMachineNo, setSMachineNo] = useState('');
  const [statusId, setStatusId] = useState('');
  const [sMachineSpcStaionId, setSMachineSpcStaionId,] = useState('');
  const [isActive, setIsActive] = useState('');
  const [statusName, setStatusName] = useState('');
  const [filterStationList, setFilterStationList] = useState([]);
  const [machinePalletList, setMachinePalletList] = useState([]);
  const [filterStationId, setFilterStationId] = useState('');
  const [isShowDeleteIcon, setIsShowDeleteIcon] = useState(false);
  const [isActiveMachineList, setIsActiveMachineList] = useState(false);

  useEffect(async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData != null) {
      setUserData(userData);
      if (userData['userAccess'].length > 0) {
        for (var i = 0; i < userData['userAccess'].length; i++) {
          if (userData['userAccess'][i]['ModuleID'] == 5) {
            if (userData['userAccess'][i]['Read']) {
              setWriteAccess(userData['userAccess'][i]['Write']);
              setDeleteAccess(userData['userAccess'][i]['Delete']);
            } else {
              toast.error('You do not have access to view this page.', {
                theme: "colored",
                autoClose: 3000,
                hideProgressBar: true
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
      setMachineId(props.location.state.machineId);
    }
    getList(userData, '');
    getFillList(userData, statusActionId, '');
    getFillList(userData, stationWithOperationActionId, '');
    getFillList(userData, spcFilterStationActionId, '');
  }, []);

  // dropdown
  const getFillList = async (data, actionId,reference) => {
    var result = await axiosGet(`${fillListUrl}?actionid=${actionId}&userid=${data.ID}&String=${reference}`);
    if (result != null && result['error'] == 0) {
      if (actionId == statusActionId) {
        setStatusList(result['data']);
      }
      else if (actionId == stationWithOperationActionId) {
        setStationList(result['data']);
      }
      else if (actionId == spcFilterStationActionId) {
        setFilterStationList(result['data']);
      }
      else if (actionId == machinePalletActionId) {
        setMachinePalletList(result['data']);
      }
    }
  };

  // api call for machine list...........................
  const getList = async (data, search) => {
    setIsShowDeleteIcon(false);
    setSearch('');
    const machineListQueryParam = {
      'Login_Id': data.ID,
      'Search': search
    };
    setLoader(true);
    var result = await axiosGet(`${machineListUrl}`, machineListQueryParam);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      var data = result['data'];
      for (var i = 0; i < data.length; i++) {
        data[i]['isSelected'] = false;
      }
      setMachineList(result['data']);
      setTempMachineList(result['data']);
    }
  };

  // api call for machine details........................
  const getMachineDetails = async (data, machineID) => {
    setLoader(true);
    var result = await axiosGet(`${machineDetailsUrl}?Login_Id=${data.ID}&machine_id=${machineID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      if (result['data'] != null) {
        setMachineDetails(result['data']);
        setMachineNo(result['data'][0]['MachineNo'] ?? NA);
        setMachineName(result['data'][0]['machine_name'] ?? NA);
        setStationId(result['data'][0]['station_id'] ?? NA);
        setIsActive(result['data'][0]['StatusID']);
        setStatusName(result['data'][0]['StatusName']);

        for (var i = 0; i < stationList.length; i++) {
          if (stationList[i]['ID'] == result['data'][0]['station_id'] && stationList[i]['EnableMachinewisepalletmapping']) {
            if (machineID != '') {
              getFillList(userData, machinePalletActionId, machineID);
            } else {
              getFillList(userData, machinePalletActionId, '');
            }
          }else {
            setMachinePalletList([]);
          }
        }

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
  //doing search function.................................
  const onSearch = async (searchField) => {
    setSearch(searchField);
    if (searchField.length > 0) {
      setIsShowDeleteIcon(true);
      const searchList = tempMachineList.filter(data => {
        return (
          data
            .machine_name
            .toLowerCase()
            .includes(searchField.toLowerCase())
        );
      });
      setMachineList(searchList);
    } else {
      setMachineList([]);
      setTempMachineList([]);
      getList(userData, '');
    }
  };

  //doing clear search function.................................
  const onSearchClear = () => {
    setSearch('');
    setMachineList([]);
    setTempMachineList([]);
    getList(userData, '');
  };

  //on machine list item click...................................
  const onMachineItemClick = (machineId, index) => {
    setIsShowDeleteIcon(false);
    setSearch('');
    selectedMachineId = machineId;
    var data = machineList;
    for (var i = 0; i < data.length; i++) {
      if (i == index) {
        data[i]['isSelected'] = true;
      } else {
        data[i]['isSelected'] = false;
      }
    }
    setMachineList([]);
    setTempMachineList([]);
    setMachineList(data);
    setTempMachineList(data);
    setMachineId(machineId);
    getMachineDetails(userData, machineId);
  };

  //input validation.................................................
  const inputValidate = (value, fieldName) => {
    var errorValue;
    if(fieldName == 'pallet'){
      errorValue = palletValidator(value, fieldName);
    }else{
      errorValue = inputValidator(value, fieldName);
    }
    

    if (errorValue !== '') {
      if (fieldName == 'machine no') {
        errorMap.machine_no = errorValue;
      } else if (fieldName == 'machine name') {
        errorMap.machine_name = errorValue;
      }else if (fieldName == 'pallet') {
        errorMap.pallet = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (fieldName == 'machine no') {
        errorMap.machine_no = errorValue;
      } else if (fieldName == 'machine name') {
        errorMap.machine_name = errorValue;
      }else if (fieldName == 'pallet') {
        errorMap.pallet = errorValue;
      }
      setError(errorMap);
      return true;
    }

  };

  //dropdown validation.................................................
  const dropdownValidate = (value, fieldName) => {
    const errorValue = dropdownValidator(value, fieldName);
    if (errorValue !== '') {
      errorMap.station = errorValue;
      setError(errorMap);
      return false;
    } else {
      errorMap.station = errorValue;
      setError(errorMap);
      return true;
    }

  };

  //on save button click............................................
  const onSaveClick = async () => {
    inputValidate(machineNo, 'machine no')
    inputValidate(machineName, 'machine name')
    dropdownValidate(stationId, 'station')
    if (!inputValidate(machineNo, 'machine no')) {
      return;
    }
    if (!inputValidate(machineName, 'machine name')) {
      return;
    }
    if (!dropdownValidate(stationId, 'station')) {
      return;
    }
    var isAllPalletBlank = true;
    var selectedPalletList = [];
    console.log('pallet list : ',machinePalletList)
    for(var i=0; i < machinePalletList.length; i++){
      if(machinePalletList[i]['dotsRequired'] != ''){
        isAllPalletBlank = false;
      }
      if(machinePalletList[i]['dotsRequired'] != '' && machinePalletList[i]['dotsRequired'] != 'null'){
        selectedPalletList.push(machinePalletList[i])
      }
    }
    if(machinePalletList.length > 0 && isAllPalletBlank){
      toast.error('Atleast one pallet required.', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      return;
    }

     //check for duplicate data....
     if(machinePalletList.length > 0){
      let len = 0;
      const dotsArray = machinePalletList.map(elem => {
        if(elem.dotsRequired != ''){
          return elem.dotsRequired;
        }
      });
      // for(var i=0; i < machinePalletList.length; i++){
      //   if(machinePalletList[i]['dotsRequired'] != ''){
      //     len = dotsArray.filter(dots => dots === machinePalletList[i]['dotsRequired']).length;
      //     if(len > 1){
      //       break;
      //     }
      //   }
      // }
      // if(len > 1){
      //   toast.error('Duplicate pallet value not allowed.', {
      //     theme: "colored",
      //     autoClose: 3000,
      //     hideProgressBar: true
      //   });
      //   return;
      // }
    }

    var mapData = {
      'Login_id': userData.ID,
      'machine_no': machineNo,
      'machine_name': machineName,
      'station_id': stationId,
      'palletList' : selectedPalletList,
      'created_version': appVersion,
    };
    setLoader(true);
    var result = await axiosPost(insertMachineUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('Machine added successfully.', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      clearField()
    } else {
      toast.error(result['msg'], {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
    }

  };

  //on update button click............................................
  const onUpdateClick = async () => {
    inputValidate(machineNo, 'machine no')
    inputValidate(machineName, 'machine name')
    dropdownValidate(stationId, 'station')
    if (!inputValidate(machineNo, 'machine no')) {
      return;
    }
    if (!inputValidate(machineName, 'machine name')) {
      return;
    }
    if (!dropdownValidate(stationId, 'station')) {
      return;
    }

    var isAllPalletBlank = true;
    var selectedPalletList = [];
    for(var i=0; i < machinePalletList.length; i++){
      if(machinePalletList[i]['dotsRequired'] != ''){
        isAllPalletBlank = false;
      }
      if(machinePalletList[i]['dotsRequired'] != '' && machinePalletList[i]['dotsRequired'] != 'null'){
        selectedPalletList.push(machinePalletList[i])
      }
    }
    if(machinePalletList.length > 0 && isAllPalletBlank){
      toast.error('Atleast one pallet required.', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      return;
    }
    //check for duplicate data....
    if(machinePalletList.length > 0){
      let len = 0;
      const dotsArray = machinePalletList.map(elem => {
        if(elem.dotsRequired != ''){
          return elem.dotsRequired;
        }
      });
      // for(var i=0; i < machinePalletList.length; i++){
      //   if(machinePalletList[i]['dotsRequired'] != ''){
      //     len = dotsArray.filter(dots => dots === machinePalletList[i]['dotsRequired']).length;
      //     if(len > 1){
      //       break;
      //     }
      //   }
      // }
      // if(len > 1){
      //   toast.error('Duplicate pallet value not allowed.', {
      //     theme: "colored",
      //     autoClose: 3000,
      //     hideProgressBar: true
      //   });
      //   return;
      // }
    }


    var mapData = {
      'Login_id': userData.ID,
      'machine_id': machineId,
      'machine_no': machineNo,
      'machine_name': machineName,
      'station_id': stationId,
      'palletList' : selectedPalletList,
      'Modified_Version': appVersion,
    };
    setLoader(true);
    var result = await axiosPost(updateMachineUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('Machine updated successfully.', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      clearField()
    } else {
      toast.error(result['msg'], {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
    }
  };

  const clearField = () => {
    errorMap.machine_no = '';
    errorMap.machine_name = '';
    errorMap.station = '';
    setError(errorMap);
    setMachineId('');
    setMachineNo('');
    setMachineName('');
    setStationId('');
    setStatusName('');
    setIsActive('');
    setMachinePalletList([]);
    getList(userData, '');

  }

  //toggle model for delete.................................
  function toggleModal(machineId) {
    setIsOpen(!isOpen);
    if (machineId == '') {
      return;
    } else {
      setMachineIdForDelete(machineId);
    }

  }

  //toggle model for filter .................................
  function toggleFilterModal(machineId) {
    setIsFilterOpen(!isFilterOpen);
    if (machineId == '') {
      return;
    } else {
      setMachineIdForDelete(machineId);
    }

  }


  // on filter click
  const onFilterClick = async () => {
    var searchString = '';
    if (sMachineName != '') {
      searchString = `Name like '%${sMachineName}%'`;
    }
    if (sMachineNo != '') {
      if (searchString != '') {
        searchString = searchString + ' and ';
      }
      searchString = `MachineNo like '%${sMachineNo}%'`;
    }
    if (sMachineSpcStaionId != '' && sMachineSpcStaionId != 'Choose one') {
      if (searchString != '') {
        searchString = searchString + ' and ';
      }
      searchString = searchString + `StationID=${sMachineSpcStaionId}`;
    }
    if (statusId != '' && statusId != 'Choose one') {
      if (searchString != '') {
        searchString = searchString + ' and ';
      }
      searchString = searchString + `StatusID=${statusId}`;
    }
    getList(userData, searchString);
    toggleFilterModal()
  }


  const onFilterCancel = async () => {
    setSMachineName('')
    setSMachineNo('')
    setSMachineSpcStaionId('')
    setStatusId('')
    toggleFilterModal()
    clearField()
    getList(userData, '');
  }

  //on delete button click............................................
  const onDeleteClick = async () => {
    setLoader(true);
    var result = await axiosGet(`${deleteMachineUrl}?Login_id=${userData.ID}&machine_id=${machineId}&Deleted_Version=${appVersion}`);
    setLoader(false);
    toggleModal();
    if (result != null && result['error'] == 0) {
      toast.success('Machine deleted successfully.', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      clearField();
    } else {
      toast.error(result['msg'], {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
    }
  };

  // station dropdown validate.........................................
  const onStationDropdownChange = (value) => {
    console.log('selected station id : ', value)
    setStationId(value);
    dropdownValidate(value, 'station');
    for (var i = 0; i < stationList.length; i++) {
      if (stationList[i]['ID'] == value && stationList[i]['EnableMachinewisepalletmapping']) {
        if (machineId != '') {
          getFillList(userData, machinePalletActionId, machineId);
        } else {
          getFillList(userData, machinePalletActionId, '');
        }
        return;
      }else {
        setMachinePalletList([]);
      }
    }

  };

  const preventMinus = (e) => {
    if (e.code === 'Minus') {
      e.preventDefault();
    }
  }



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
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content">
            <div class="modal-header header_bg_color_red">
              <h4 class="modal-title modal_title_text">Confirm Delete</h4>
              <button type="button" class="close" data-dismiss="modal" onClick={toggleModal}>&times;</button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <h3 className='pop_label'>Do you really want to delete this machine?</h3>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group text-right mt-5">
                    <a href="javascript:void(0);" class="btn save_btn" onClick={onDeleteClick}><i class='fa fa-check'></i>&nbsp; Yes</a>
                    <a href="javascript:void(0);" class="btn cancel_btn" data-dismiss="modal" onClick={toggleModal}><i class="fa fa-times"></i>&nbsp; No</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>


      <Modal
        isOpen={isFilterOpen}
        onRequestClose={toggleFilterModal}>
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content">
            <div class="modal-header header_bg_color_blue">
              <h4 class="modal-title modal_title_text">Machine Filter</h4>
              <button type="button" class="close" data-dismiss="modal" onClick={toggleFilterModal}>&times;</button>
            </div>
            <div class="modal-body border_bottom_blue">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="custom_label">Machine Name</label>
                    <input type="text" class="form-control" placeholder="" value={sMachineName} onInput={e => setSMachineName(e.currentTarget.value)} />
                  </div>
                  <div class="form-group">
                    <label class="custom_label">Machine No</label>
                    <input type="text" class="form-control" placeholder="" value={sMachineNo} onInput={e => setSMachineNo(e.currentTarget.value)} />
                  </div>
                  <div class="form-group">
                    <label class="custom_label">SPC station/Terminal</label>
                    <select class="form-control" value={filterStationId} onChange={e => setFilterStationId(e.currentTarget.value)}>
                      <option>Choose one</option>
                      {filterStationList.map(item => (
                        <option
                          key={item.ID}
                          value={item.ID}>
                          {item.NAME}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="custom_label">Status</label>
                    <select class="form-control" value={statusId} onChange={e => setStatusId(e.currentTarget.value)}>
                      <option>Choose one</option>
                      {statusList.map(item => (
                        <option
                          key={item.ID}
                          value={item.ID}>
                          {item.statusName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="form-group text-right mt-5">
                    <button type="button" class="btn search_btn" data-dismiss="modal" onClick={() => onFilterClick()}><i class="fa fa-search"></i>&nbsp; Search</button>
                    <button type="button" class="btn cancel_btn" data-dismiss="modal" onClick={() => onFilterCancel()}><i class="fa fa-times"></i>&nbsp; Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>


      <Header activeId={'isMachineActiveColor'} />


      <div className="az-content pd-y-0 pd-lg-y-0 pd-xl-y-0">
        <div className="container-fluid">
          <div className="az-content-left az-content-left-components" id='mySidebar'>
            <button className='wrapperrr_div_close' id="closeNavi" onClick="openNav()">
              <i className='fa fa-times'></i>
            </button>
            <div className="component-item">
              <label className="list_name_class">List</label>
              <div className="search-form">
                <input type="search" placeholder="Search" className="search-input" value={search} onInput={e => onSearch(e.currentTarget.value)} />
                <i className="fa fa-search search-button" />
                <div className="search-option">
                  {isShowDeleteIcon ? <div>
                    <input name="type" type="radio" defaultValue="type-posts" id="type-posts" />
                    <label htmlFor="type-posts">
                      <i className="fa fa-times-circle edit-pen-title" onClick={onSearchClear} />
                      <span>Cancel</span>
                    </label>
                  </div> : <div className='p-0 m-0'>  <input name="type" type="radio" defaultValue="type-posts" id="type-posts" /></div>}
                  <div data-toggle="modal" data-target="#delete_pop_modal" onClick={() => toggleFilterModal(machineId)}>
                    <input name="type" type="radio" defaultValue="user_filter" id="user_filter" />
                    <label htmlFor="type-users">
                      <i className="fa fa-filter edit-pen-title" />
                      <span>Filter</span>
                    </label>
                  </div>
                </div>
              </div>
              <nav className="nav flex-column left_menu">
                {machineList.map((data, i) => (
                  <>
                    <div class="nav_menu_dv">

                      <a className={data.StatusID != 1 ? "nav-link text-danger" : !data.isSelected ? "nav-link " : 'nav-link text-danger'} key={i} onClick={() => onMachineItemClick(data.machine_id, i)} >
                        {/* style={{ display: 'flex' }} */}
                        <p className='op_style'><i class="fas fa-cog"></i><span className='leftmenu_style'>{data.OperationLineName}</span></p>
                        <p className='op_style'><i class="fa fa-university"></i><span className='leftmenu_style'>{data.StationName}</span></p>

                        <i class="fa fa-desktop"></i><span className='leftmenu_style'>{data.machine_name}</span></a>
                      {/* <span className='leftmenu_style'>{data.OperationLineName}</span>
                      <span className='leftmenu_style'>{data.StationName}</span> */}
                    </div>

                  </>
                ))}
              </nav>
              <a className="btn btn-primary add_btn" id='add_btn_id' onClick={() => clearField()}><i className="fa fa-plus" /></a>
              <div className='version_class'>
                <p>Version : 1.0.0 Build 20220511</p>
                <p>Copyright © 2022 | All Rights Reserved</p>
              </div>
            </div>
          </div>
          <div className="az-content-body pd-lg-l-40 d-flex flex-column" id='main'>

            <button className='wrapperrr_div_open' id="openNavi" onClick="openNav()">
              <i className='fa fa-chevron-right'></i>
            </button>

            <h2 className="az-content-title">Machine</h2>
            <h6 class={isActive == 1 ? "active_status" : "active_status text-danger"}>{statusName != '' ? statusName : ''}</h6>
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">Machine Name<span className="star_mark">*</span></label>
                <input className="form-control" placeholder="Enter Machine Name" value={machineName} onInput={e => setMachineName(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'machine name')} type="text" maxLength={100} />
                {errors.machine_name.length > 0 && <span className='error'>{errors.machine_name}</span>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">Machine No<span className="star_mark">*</span></label>
                <input className="form-control" placeholder="Enter Machine No (Max 10)" value={machineNo} onInput={e => setMachineNo(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'machine no')} type="text" maxLength={10} />
                {errors.machine_no.length > 0 && <span className='error'>{errors.machine_no}</span>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">Select the SPC Station/Terminal<span className="star_mark">*</span></label>
                <select className="form-control select2-no-search" value={stationId} onChange={e => onStationDropdownChange(e.currentTarget.value)}>
                  <option>Choose one</option>
                  {stationList.map(item => (
                    <option
                      key={item.ID}
                      value={item.ID}>
                      {item.NAME}
                    </option>
                  ))}
                </select>
                {errors.station.length > 0 && <span className='error'>{errors.station}</span>}
              </div>
            </div>
            {machinePalletList.map(item => (
              <div className="row">
                <div className="col-md-4 form-group">
                  <div class="row">
                    <div class="col-sm-5"><label className="custom_label">{item.NAME+' - '+item.OpType}<span className="star_mark"></span></label></div>
                    <div class="col-sm-7"><input className="form-control" placeholder="Enter Dots Count" min="1" onWheel={(e) => e.target.blur()} onKeyPress={preventMinus} value={item.dotsRequired} onInput={e => item.dotsRequired = e.currentTarget.value} onChange={(e) => inputValidate(e.currentTarget.value, 'pallets')} type="number"  />
                     </div>
                  </div>
                </div>
              </div>
            ))}
             {errors.pallet.length > 0 && <span className='error'>{errors.pallet}</span>}

            {/* <div className="row">
              <div className="col-md-4 form-group">
                <div class="row">
                  <div class="col-sm-5"><label className="custom_label">Select the SPC Station/Terminal<span className="star_mark">*</span></label></div>
                  <div class="col-sm-7"><input className="form-control" placeholder="Enter Machine No (Max 10)" value={machineNo} onInput={e => setMachineNo(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'machine no')} type="text" maxLength={10} />
                {errors.machine_no.length > 0 && <span className='error'>{errors.machine_no}</span>}</div>
                </div>
              </div>
            </div> */}

            {machineId != '' ? (
              <div className="row mt-3">
                <div className="col-12">
                  <div id="accordion">
                    <div className="card">
                      <div className="card-header">
                        <a href="#demo" data-toggle="collapse" aria-expanded="false">System Details <i className="fas fa-chevron-down" /></a>
                      </div>
                      <div id="demo" className="collapse ">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Entry User</label>
                              <input type="text" className="form-control" value={createdUser == NA ? "-" : createdUser} readonly='readonly' />
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Entry Date</label>
                              <div className="input-group">
                                <input type="text" className="form-control fc-datepicker" value={createdDate == NA ? "-" : createdDate} readonly='readonly' />

                              </div>
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Entry Version</label>
                              <input type="text" className="form-control" value={createdVersion == NA ? "-" : createdVersion} readonly='readonly' />
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Modified User</label>
                              <input type="text" className="form-control" value={modifiedUser == NA ? "-" : modifiedUser} readonly='readonly' />
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Modified Date</label>
                              <div className="input-group">
                                <input type="text" className="form-control fc-datepicker" value={modifiedDate == NA ? "-" : modifiedDate} readonly='readonly' />

                              </div>
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Modified Version</label>
                              <input type="text" className="form-control" value={modifiedVersion == NA ? "-" : modifiedVersion} readonly='readonly' />
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Deleted User</label>
                              <input type="text" className="form-control" value={deletedUser == NA ? "-" : deletedUser} readonly='readonly' />
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Deleted Date</label>
                              <div className="input-group">
                                <input type="text" className="form-control fc-datepicker" value={deletedDate == NA ? "-" : deletedDate} readonly='readonly' />

                              </div>
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Deleted Version</label>
                              <input type="text" className="form-control" value={deletedVersion == NA ? "-" : deletedVersion} readonly='readonly' />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (null)}
            <hr className="mg-y-15" />
            <div className="az-footer mg-t-auto" id="az_footer_id">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 text-right">
                    {machineId == '' && isWriteAccess ? (<button type="button" className="btn save_btn" onClick={onSaveClick}><i class='fa fa-save'></i>&nbsp; Save</button>) : (null)}
                    {machineId != '' && isWriteAccess && isActive == 1 ? (<button type="button" className="btn update_btn" onClick={onUpdateClick}><i class='fa fa-save'></i>&nbsp; Update</button>) : (null)}
                    {machineId != '' && isDeleteAccess && isActive == 1 ? (<button type="button" className="btn delete_btn" data-toggle="modal" data-target="#delete_pop_modal" onClick={() => toggleModal(machineId)}><i class="fa fa-trash-o"></i>&nbsp; Delete</button>) : (null)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Machine;