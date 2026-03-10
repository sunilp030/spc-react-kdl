import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, dropdownValidator } from '../../utils/Validator';
import { stationListUrl, spcFilterOperationActionId, stationAccessUrl, insertStationUrl, stationDetailsUrl, updateStationUrl, deleteStationUrl, appVersion, NA, inputSpcStationNoMaxLength, statusActionId, fillListUrl, operationActionId } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal from "react-modal";
var selectedStationId = '';
Modal.setAppElement("#root");
const Station = (props) => {


  const errorMap = {
    station_no: '',
    station_name: '',
    operation: '',
  };
  const [userData, setUserData] = useState({});
  const [stationList, setStationList] = useState([]);
  const [tempStationList, setTempStationList] = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [stationAccessList, setStationAccessList] = useState([]);
  const [stationDetails, setStationDetails] = useState({});
  const [stationId, setStationId] = useState('');
  const [stationNo, setStationNo] = useState('');
  const [stationName, setStationName] = useState('');
  const [operationId, setOperationId] = useState('');
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
  const [deleteStationId, setStationIdForDelete] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setError] = useState(errorMap);
  const history = useHistory();
  const [isWriteAccess, setWriteAccess] = useState(false);
  const [isDeleteAccess, setDeleteAccess] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [operationLineList, setOperationLineList] = useState([]);
  const [filterOperationLineList, setFilterOperationLineList] = useState([]);
  const [spcStationNo, setSpcStationNo] = useState('');
  const [spcStationName, setSpcStationNoUserFilterName] = useState('');
  const [statusId, setStatusId] = useState('');
  const [operationLineId, setOperationLineId] = useState('');
  const [filterOperationLineId, setFilterOperationLineId] = useState('');
  const [isShowDeleteIcon, setIsShowDeleteIcon] = useState(false);
  const [isActive, setIsActive] = useState('');
  const [statusName, setStatusName] = useState('');


  useEffect(async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData != null) {
      setUserData(userData);
      if (userData['userAccess'].length > 0) {
        for (var i = 0; i < userData['userAccess'].length; i++) {
          if (userData['userAccess'][i]['ModuleID'] == 4) {
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
      setStationId(props.location.state.stationId);
    }
    getList(userData, '');
    getOperationList(userData);
    getFillList(userData, statusActionId);
    getFillList(userData, operationActionId);
    getFillList(userData, spcFilterOperationActionId);
  }, []);

  const getFillList = async (data, actionId) => {

    var result = await axiosGet(`${fillListUrl}?actionid=${actionId}&userid=${data.ID}`);
    if (result != null && result['error'] == 0) {
      if (actionId == statusActionId) {
        setStatusList(result['data']);
      }
      else if (actionId == operationActionId) {
        setOperationLineList(result['data']);
      }
      else if (actionId == spcFilterOperationActionId) {
        setFilterOperationLineList(result['data']);
      }
    }
  };

  // api call for station list...........................
  const getList = async (data, search) => {
    const stationListQueryParam = {
      'Login_Id': data.ID,
      'Search': search
    };

    setLoader(true);
    var result = await axiosGet(`${stationListUrl}`, stationListQueryParam);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      var data = result['data'];
      for (var i = 0; i < data.length; i++) {
        data[i]['isSelected'] = false;
      }
      setStationList(result['data']);
      setTempStationList(result['data']);
      setIsShowDeleteIcon(false);
      setSearch('');

    }
  };
  // api call for station list...........................
  const getOperationList = async (data) => {
    setLoader(true);
    var result = await axiosGet(`${fillListUrl}?actionid=${operationActionId}&userid=${data.ID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      setOperationList(result['data']);
    }
  };

  // api call for station details........................
  const getStationDetails = async (data, stationID) => {
    setLoader(true);
    var result = await axiosGet(`${stationDetailsUrl}?Login_Id=${data.ID}&Station_Id=${stationID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      if (result['data'] != null) {
        setStationDetails(result['data']);
        setStationNo(result['data'][0]['StationNo'] ?? NA);
        setStationName(result['data'][0]['StationName'] ?? NA);
        setOperationId(result['data'][0]['OperationLineId'] ?? NA);
        setMacAddress(result['data'][0]['MacAddress']);
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
  //doing search function.................................
  const onSearch = async (searchField) => {
    setSearch(searchField);
    if (searchField.length > 0) {
      setIsShowDeleteIcon(true);
      const searchList = tempStationList.filter(data => {
        return (
          data
            .StationName
            .toLowerCase()
            .includes(searchField.toLowerCase())
        );
      });
      setStationList(searchList);
    } else {
      setStationList([]);
      setTempStationList([]);
      getList(userData, '');
    }
  };

  //doing clear search function.................................
  const onSearchClear = () => {
    setSearch('');
    setStationList([]);
    setTempStationList([]);
    getList(userData, '');
  };

  //on station list item click...................................
  const onStationItemClick = (stationId, index) => {
    setIsShowDeleteIcon(false);
    setSearch('');
    selectedStationId = stationId;
    var data = stationList;
    for (var i = 0; i < data.length; i++) {
      if (i == index) {
        data[i]['isSelected'] = true;
      } else {
        data[i]['isSelected'] = false;
      }
    }


    setStationList([]);
    setTempStationList([]);
    setStationList(data);
    setTempStationList(data);
    setStationId(stationId);
    getStationDetails(userData, stationId);
  };


  //input validation.................................................
  const inputValidate = (value, fieldName) => {
    var errorValue;
    errorValue = inputValidator(value, fieldName);

    if (errorValue !== '') {
      if (fieldName == 'station no') {
        errorMap.station_no = errorValue;
      } else if (fieldName == 'station name') {
        errorMap.station_name = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (fieldName == 'station no') {
        errorMap.station_no = errorValue;
      } else if (fieldName == 'station name') {
        errorMap.station_name = errorValue;
      }
      setError(errorMap);
      return true;
    }

  };

  //dropdown validation.................................................
  const dropdownValidate = (value, fieldName) => {
    const errorValue = dropdownValidator(value, fieldName.toLowerCase());
    if (errorValue !== '') {
      errorMap.operation = errorValue;
      setError(errorMap);
      return false;
    } else {
      errorMap.operation = errorValue;
      setError(errorMap);
      return true;
    }

  };

  //on save button click............................................
  const onSaveClick = async () => {
    inputValidate(stationNo, 'station no')
    inputValidate(stationName, 'station name')
    dropdownValidate(operationId, 'Operation line')
    if (!inputValidate(stationNo, 'station no')) {
      return;
    }
    if (!inputValidate(stationName, 'station name')) {
      return;
    }
    if (!dropdownValidate(operationId, 'Operation line')) {
      return;
    }

    var mapData = {
      'Login_id': userData.ID,
      'station_No': stationNo,
      'station_Name': stationName,
      'OperationLineID': operationId,
      'created_version': appVersion,
    };
    setLoader(true);
    var result = await axiosPost(insertStationUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('Station added successfully.', {
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
    inputValidate(stationNo, 'station no')
    inputValidate(stationName, 'station name')
    dropdownValidate(operationId, 'Operation')
    if (!inputValidate(stationNo, 'station no')) {
      return;
    }
    if (!inputValidate(stationName, 'station name')) {
      return;
    }
    if (!dropdownValidate(operationId, 'Operation')) {
      return;
    }

    var mapData = {
      'Login_id': userData.ID,
      'station_id': stationId,
      'station_No': stationNo,
      'station_Name': stationName,
      'OperationLineID': operationId,
      'MacAddress': macAddress,
      'Modified_Version': appVersion,
    };
    setLoader(true);
    var result = await axiosPost(updateStationUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('Station updated successfully.', {
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
    errorMap.station_no = '';
    errorMap.station_name = '';
    errorMap.operation = '';
    setError(errorMap);
    setStationId('');
    setStationNo('');
    setStationName('');
    setOperationId('');
    setStatusName('');
    setIsActive('');
    getList(userData, '');
  }

  //toggle model for delete.................................
  function toggleModal(stationId) {
    setIsOpen(!isOpen);
    if (stationId == '') {
      return;
    } else {
      setStationIdForDelete(stationId);
    }

  }


  //toggle model for filter .................................
  function toggleFilterModal(stationId) {
    setIsFilterOpen(!isFilterOpen);
    if (stationId == '') {
      return;
    } else {
      setStationIdForDelete(stationId);
    }

  }


  // on filter click
  const onFilterClick = async () => {
    var searchString = '';
    if (spcStationNo != '') {
      searchString = `StationNo like '%${spcStationNo}%'`;
    }
    if (spcStationName != '') {
      if (searchString != '') {
        searchString = searchString + ' and ';
      }
      searchString = `Name like '%${spcStationName}%'`;
    }
    if (operationLineId != '' && operationLineId != 'Choose one') {
      if (searchString != '') {
        searchString = searchString + ' and ';
      }
      searchString = searchString + `OperationLineID=${operationLineId}`;
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
    setSpcStationNo('')
    setSpcStationNoUserFilterName('')
    setFilterOperationLineId('')
    setStatusId('')
    toggleFilterModal()
    clearField()
    getList(userData, '');
  }


  //on delete button click............................................
  const onDeleteClick = async () => {
    setLoader(true);
    var result = await axiosGet(`${deleteStationUrl}?Login_Id=${userData.ID}&Station_Id=${stationId}&Deleted_Version=${appVersion}`);
    setLoader(false);
    toggleModal();
    if (result != null && result['error'] == 0) {
      toast.success('Station deleted successfully.', {
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

  //on back button click............................................
  const onBackClick = async () => {
    history.goBack();
  };

  // operation dropdown validate.........................................
  const onOperationDropdownChange = (value) => {
    setOperationId(value);
    dropdownValidate(value, 'Operation');
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
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content">
            <div class="modal-header header_bg_color_red">

              <h4 class="modal-title modal_title_text">Confirm Delete</h4>
              <button type="button" class="close" data-bs-dismiss="modal" onClick={toggleModal}>&times;</button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <h3 className='pop_label'>Do you really want to delete this station?</h3>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group text-right mt-5">
                    <a href="javascript:void(0);" class="btn save_btn" onClick={onDeleteClick}><i class="fa fa-check"></i>&nbsp; Yes</a>
                    <a href="javascript:void(0);" class="btn cancel_btn" data-bs-dismiss="modal" style={{ marginLeft: '5px' }} onClick={toggleModal}><i class="fa fa-times"></i>&nbsp; No</a>
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

              <h4 class="modal-title modal_title_text">SPC Station Filter</h4>
              <button type="button" class="close" data-bs-dismiss="modal" onClick={toggleFilterModal}>&times;</button>
            </div>
            <div class="modal-body border_bottom_blue">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="custom_label">SPC Station No.</label>
                    <input type="text" class="form-control" placeholder="" value={spcStationNo} onInput={e => setSpcStationNo(e.currentTarget.value)} />
                  </div>
                  <div class="form-group">
                    <label class="custom_label">SPC Station/Terminal Name</label>
                    <input type="text" class="form-control" placeholder="" value={spcStationName} onInput={e => setSpcStationNoUserFilterName(e.currentTarget.value)} />
                  </div>
                  <div class="form-group">
                    <label class="custom_label">Operation Line</label>
                    <select class="form-control" value={filterOperationLineId} onChange={e => setFilterOperationLineId(e.currentTarget.value)}>
                      <option>Choose one</option>
                      {filterOperationLineList.map(item => (
                        <option
                          key={item.ID}
                          value={item.ID}>
                          {item.Name}
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
                    <button type="button" class="btn search_btn" data-bs-dismiss="modal" onClick={() => onFilterClick()}><i class="fa fa-search"></i>&nbsp; Search</button>
                    <button type="button" class="btn cancel_btn" data-bs-dismiss="modal" onClick={() => onFilterCancel()}><i class="fa fa-times"></i>&nbsp; Cancel</button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </Modal>

      <Header activeId={'isStationActiveColor'} />

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
                <i className="fa fa-search search-button" style={{ top: 13 }} />
                <div className="search-option">
                  {isShowDeleteIcon ? <div>
                    <input name="type" type="radio" defaultValue="type-posts" id="type-posts" />
                    <label htmlFor="type-posts">
                      <i className="fa fa-times-circle edit-pen-title" onClick={onSearchClear} />
                      <span>Cancel</span>
                    </label>
                  </div> : <div className='p-0 m-0'>  <input name="type" type="radio" defaultValue="type-posts" id="type-posts" /></div>}

                  <div data-bs-toggle="modal" data-bs-target="#delete_pop_modal" onClick={() => toggleFilterModal(stationId)}>
                    <input name="type" type="radio" defaultValue="SPCStation_filter" id="SPCStation_filter" />
                    <label htmlFor="type-SPCStation">
                      <i className="fa fa-filter edit-pen-title" />
                      <span>Filter</span>
                    </label>
                  </div>
                </div>
              </div>
              <nav className="nav flex-column left_menu">
                {stationList.map((data, i) => (
                  <>
                  <div class="nav_menu_dv">
                    
                    <a className={data.StatusID != 1 ? "nav-link text-danger" : !data.isSelected ? "nav-link " : 'nav-link text-danger'} key={i} onClick={() => onStationItemClick(data.station_id, i)} >
                    {/* style={{ display: 'flex' }} */}
                      <p className='op_style'><i class="fas fa-cog"></i><span className='leftmenu_style'>{data.OperationLineName}</span></p>
                      <i class="fa fa-university"></i><span className='leftmenu_style'>{data.StationName}</span></a>
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

            <h2 className="az-content-title">SPC Station</h2>
            <h6 class={isActive == 1 ? "active_status" : "active_status text-danger"}>{statusName != '' ? statusName : ''}</h6>
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">Select the Operation Line<span className="star_mark">*</span></label>

                <select className="form-control select2-no-search" value={operationId} onChange={e => onOperationDropdownChange(e.currentTarget.value)}>
                  <option>Choose one</option>
                  {operationList.map(item => (
                    <option
                      key={item.ID}
                      value={item.ID}>
                      {item.Name}
                    </option>
                  ))}
                </select>
                {errors.operation.length > 0 && <span className='error'>{errors.operation}</span>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">SPC Station No</label>
                <input className="form-control" placeholder="Station No (Max 10)" value={stationNo} onInput={e => setStationNo(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'station no')} type="text" maxLength={inputSpcStationNoMaxLength} />
                {errors.station_no.length > 0 && <span className='error'>{errors.station_no}</span>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">SPC Station / Terminal Name<span className="star_mark">*</span></label>
                <input className="form-control" placeholder="Station Name" value={stationName} onInput={e => setStationName(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'station name')} type="text" maxLength={100} />
                {errors.station_name.length > 0 && <span className='error'>{errors.station_name}</span>}
              </div>

            </div>

            {stationId != '' ? (
              <div className="row mt-3">
                <div className="col-12">
                  <div id="accordion">
                    <div className="card">
                      <div className="card-header">
                        <a href="#demo" data-bs-toggle="collapse" aria-expanded="false">System Details <i className="fas fa-chevron-down" /></a>
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
                    {stationId == '' && isWriteAccess ? (<button type="button" className="btn save_btn" onClick={onSaveClick}><i class='fa fa-save'></i>&nbsp; Save</button>) : (null)}
                    {stationId != '' && isWriteAccess && isActive == 1 ? (<button type="button" className="btn update_btn" onClick={onUpdateClick}><i class='fa fa-save'></i>&nbsp; Update</button>) : (null)}
                    {stationId != '' && isDeleteAccess && isActive == 1 ? (<button type="button" className="btn delete_btn" data-bs-toggle="modal" data-bs-target="#delete_pop_modal" onClick={() => toggleModal(stationId)}><i class="fa fa-trash-o"></i>&nbsp; Delete</button>) : (null)}
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
export default Station;