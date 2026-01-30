import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, dropdownValidator, inputWithRangeValidator, inputWithValueValidator } from '../../utils/Validator';
import { stationListUrl, eventListUrl, eventAccessUrl, insertEventUrl, eventDetailsUrl, updateEventUrl, deleteEventUrl, appVersion, NA, inputMaxLength, statusActionId, fillListUrl } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal from "react-modal";

Modal.setAppElement("#root");
var selectedEventId = '';
const Event = (props) => {


  const errorMap = {
    event_no: '',
    event_name: '',
    no_of_reading: '',
  };
  const [userData, setUserData] = useState({});
  const [eventList, setEventList] = useState([]);
  const [tempEventList, setTempEventList] = useState([]);
  const [eventAccessList, setEventAccessList] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [eventId, setEventId] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [eventName, setEventName] = useState('');
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
  const [deleteEventId, setEventIdForDelete] = useState('');
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
  const [statusList, setStatusList] = useState([]);
  const [sEventCode, setSEventCode] = useState('');
  const [sEventName, setSEventName] = useState('');
  const [sNoOfReading, setSNoOfReading] = useState('');
  const [statusId, setStatusId] = useState('');
  const [isShowDeleteIcon, setIsShowDeleteIcon] = useState(false);
  const [isActiveEventList, setIsActiveEventList] = useState(false);

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
              history.goBack();
            }
          }
        }
      }
    } else {
      history.push('/login');
    }
    if (props.location.state != null) {
      setEventId(props.location.state.eventId);
    }
    getList(userData, '');
    getFillList(userData, statusActionId);

    // getEventAccess(userData);
  }, []);

  const getFillList = async (data, actionId) => {
    var result = await axiosGet(`${fillListUrl}?actionid=${actionId}&userid=${data.ID}`);
    if (result != null && result['error'] == 0) {
      if (actionId == statusActionId) {
        setStatusList(result['data']);
      }
    }
  };



  // api call for event list...........................
  const getList = async (data, search) => {
    setIsShowDeleteIcon(false);
    setSearch('');
    const eventListQueryParam = {
      'Login_Id': data.ID,
      'Search': search
    };
    setLoader(true);
    var result = await axiosGet(`${eventListUrl}`, eventListQueryParam);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      var data = result['data'];
      for (var i = 0; i < data.length; i++) {
        data[i]['isSelected'] = false;
      }
      setEventList(result['data']);
      setTempEventList(result['data']);
    }
  };

  // api call for event access list........................
  const getEventAccess = async (data) => {

    setLoader(true);
    var result = await axiosGet(`${eventAccessUrl}?Login_Id=${data.ID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      setEventAccessList(result['data']);
    }
  };
  // api call for event details........................
  const getEventDetails = async (data, eventID) => {
    setLoader(true);
    var result = await axiosGet(`${eventDetailsUrl}?Login_Id=${data.ID}&Event_id=${eventID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      if (result['data'] != null) {
        setEventDetails(result['data']);
        setEventCode(result['data'][0]['EventCode'] ?? NA);
        setEventName(result['data'][0]['Event_name'] ?? NA);
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
  //doing search function.................................
  const onSearch = async (searchField) => {
    setSearch(searchField);
    if (searchField.length > 0) {
      setIsShowDeleteIcon(true);

      const searchList = tempEventList.filter(data => {
        return (
          data
            .Event_name
            .toLowerCase()
            .includes(searchField.toLowerCase())
        );
      });
      setEventList(searchList);


    } else {
      setEventList([]);
      setTempEventList([]);
      getList(userData, '');
    }
  };

  //doing clear search function.................................
  const onSearchClear = () => {
    setSearch('');
    setEventList([]);
    setTempEventList([]);
    getList(userData, '');
  };

  //on event list item click...................................
  const onEventItemClick = (eventId, index) => {
    setIsShowDeleteIcon(false);
    setSearch('');
    selectedEventId = eventId;
    var data = eventList;
    for (var i = 0; i < data.length; i++) {
      if (i == index) {
        data[i]['isSelected'] = true;
      } else {
        data[i]['isSelected'] = false;
      }
    }


    setEventList([]);
    setTempEventList([]);
    setEventList(data);
    setTempEventList(data);
    setEventId(eventId);
    getEventDetails(userData, eventId);
  };


  //input validation.................................................
  const inputValidate = (value, fieldName, digit, isATA) => {
    var errorValue;
    if (fieldName == 'event code') {
      errorValue = inputWithRangeValidator(value, fieldName, digit);
    } else if (fieldName == 'number of consecutive readings') {
      errorValue = inputWithValueValidator(value, fieldName, 5, isATA);
    } else {
      errorValue = inputValidator(value, fieldName);
    }


    if (errorValue !== '') {
      if (fieldName == 'event code') {
        errorMap.event_no = errorValue;
      } else if (fieldName == 'event name') {
        errorMap.event_name = errorValue;
      } else if (fieldName == 'number of consecutive readings') {
        errorMap.no_of_reading = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (fieldName == 'event no') {
        errorMap.event_no = errorValue;
      } else if (fieldName == 'event name') {
        errorMap.event_name = errorValue;
      } else if (fieldName == 'number of consecutive readings') {
        errorMap.no_of_reading = errorValue;
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
    inputValidate(eventCode, 'event code', 3)
    inputValidate(eventName, 'event name', null)
    inputValidate(noOfReading, 'number of consecutive readings', null, isATA)

    if (!inputValidate(eventCode, 'event code', 3)) {
      return;
    }
    if (!inputValidate(eventName, 'event name', null)) {
      return;
    }
    if (!inputValidate(noOfReading, 'number of consecutive readings', null, isATA)) {
      return;
    }

    var mapData = {
      'Login_id': userData.ID,
      'Event_Code': eventCode,
      'Event_name': eventName,
      'NoOfReading': noOfReading,
      'ApplyToAll': isATA,
      'created_version': appVersion,
    };
    setLoader(true);
    var result = await axiosPost(insertEventUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('Event added successfully.', {
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
    inputValidate(eventCode, 'event code', 3)
    inputValidate(eventName, 'event name', null)
    inputValidate(noOfReading, 'number of consecutive readings', null, isATA)

    if (!inputValidate(eventCode, 'event code', 3)) {
      return;
    }
    if (!inputValidate(eventName, 'event name', null)) {
      return;
    }
    if (!inputValidate(noOfReading, 'number of consecutive readings', null, isATA)) {
      return;
    }

    var mapData = {
      'Login_id': userData.ID,
      'EventID': eventId,
      'Event_Code': eventCode,
      'Event_name': eventName,
      'NoOfReading': noOfReading,
      'ApplyToAll': isATA,
      'Modified_Version': appVersion,
    };
    setLoader(true);
    var result = await axiosPost(updateEventUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('Event updated successfully.', {
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

  //toggle model for delete.................................
  function toggleModal(eventId) {
    setIsOpen(!isOpen);
    if (eventId == '') {
      return;
    } else {
      setEventIdForDelete(eventId);
    }

  }

  //toggle model for filter .................................
  function toggleFilterModal(eventId) {
    setIsFilterOpen(!isFilterOpen);
    if (eventId == '') {
      return;
    } else {
      setEventIdForDelete(eventId);
    }
  }


  // on filter click
  const onFilterClick = async () => {
    // 'RoleName like ''%QA%'' and statusid=1'
    var searchString = '';
    if (sEventCode != '') {
      searchString = `Abbreviation like '%${sEventCode}%'`;
    }
    if (sEventName != '') {
      if (searchString != '') {
        searchString = searchString + ' and ';
      }
      searchString = `Name like '%${sEventName}%'`;
    }
    if (sNoOfReading != '') {
      if (searchString != '') {
        searchString = searchString + ' and ';
      }
      searchString = `NoOfReading=${sNoOfReading}`;
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
    setSEventCode('')
    setSEventName('')
    setSNoOfReading('')
    setStatusId('')
    toggleFilterModal()
    clearField()
    getList(userData, '');
  }

  //on delete button click............................................
  const onDeleteClick = async () => {
    setLoader(true);
    var result = await axiosGet(`${deleteEventUrl}?Login_id=${userData.ID}&event_id=${eventId}&Deleted_Version=${appVersion}`);
    setLoader(false);
    toggleModal();
    if (result != null && result['error'] == 0) {
      toast.success('Event deleted successfully.', {
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
    setATA(false);
    errorMap.event_no = '';
    errorMap.event_name = '';
    errorMap.no_of_reading = '';
    setError(errorMap);
    setEventId('');
    setEventCode('');
    setEventName('');
    setNoOfReading('');
    setStatusName('');
    setIsActive('');
    getList(userData, '');
  }

  //on back button click............................................
  const onBackClick = async () => {
    history.goBack();
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
        {/* <div class="modal fade" id="delete_pop_modal" event="dialog"> */}
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content" style={{ borderRadius: '0px' }}>
            <div class="modal-header">
              <h4 class="modal-title modal_title_text">Confirm Delete</h4>
              <button type="button" class="close" data-dismiss="modal" onClick={toggleModal}>&times;</button>

            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <h3 className='pop_label'>Do you really want to delete this event?</h3>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group text-right" style={{ marginTop: '25px' }}>
                    <a href="javascript:void(0);" class="btn save_btn" onClick={onDeleteClick}><i class='fa fa-check'></i>&nbsp; Yes</a>
                    <a href="javascript:void(0);" class="btn cancel_btn" data-dismiss="modal" style={{ marginLeft: '5px' }} onClick={toggleModal}><i class="fa fa-times"></i>&nbsp; No</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Modal>


      <Modal
        isOpen={isFilterOpen}
        onRequestClose={toggleFilterModal}>
        {     /*  <div id="user_filter" className="modal fade" role="dialog"> */}
        <div className="modal-dialog custom_modal_dialog">
          <div className="modal-content" style={{ borderRadius: '0px' }}>
            <div className="modal-header">
              <h4 className="modal-title">Event Filter</h4>
              <button className="close" data-dismiss="modal" onClick={toggleFilterModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="custom_label">Event Code</label>
                    <input type="text" className="form-control" placeholder="" value={sEventCode} onInput={e => setSEventCode(e.currentTarget.value)} />
                  </div>
                  <div className="form-group">
                    <label className="custom_label">Events Name/Description</label>
                    <input type="text" className="form-control" placeholder="" value={sEventName} onInput={e => setSEventName(e.currentTarget.value)} />
                  </div>
                  <div className="form-group">
                    <label className="custom_label">No of Consecutive Readings</label>
                    <input type="text" className="form-control" placeholder="" value={sNoOfReading} onInput={e => setSNoOfReading(e.currentTarget.value)} />
                  </div>
                  <div className="form-group">
                    <label className="custom_label">Status</label>
                    <select className="form-control" value={statusId} onChange={e => setStatusId(e.currentTarget.value)}>
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


                  <div className="form-group text-right mt-5">
                    <button type="button" className="btn search_btn" data-dismiss="modal" onClick={() => onFilterClick()}><i class="fa fa-search"></i>&nbsp; Search</button>
                    <button type="button" className="btn cancel_btn" data-dismiss="modal" onClick={() => onFilterCancel()}><i class="fa fa-times"></i>&nbsp; Cancel</button>
                  </div>


                </div>
              </div>
            </div>

          </div>
        </div>
        {/* </div> */}
      </Modal>

      <Header activeId={'isEventActiveColor'} />

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
                  </div> : <div className='p-0 m-0'><input name="type" type="radio" defaultValue="type-posts" id="type-posts" /></div>}

                  <div data-toggle="modal" data-target="#delete_pop_modal" onClick={() => toggleFilterModal(eventId)}>
                    <input name="type" type="radio" defaultValue="user_filter" id="user_filter" />
                    <label htmlFor="type-users">
                      <i className="fa fa-filter edit-pen-title" />
                      <span>Filter</span>
                    </label>
                  </div>
                </div>
              </div>
              <nav className="nav flex-column left_menu">
                {eventList.map((data, i) => (
                  <a className={data.StatusID != 1 ? "nav-link text-danger" : !data.isSelected ? "nav-link " : 'nav-link text-danger'} key={i} onClick={() => onEventItemClick(data.Event_id, i)} style={{ display: 'flex' }}><i class="material-icons-outlined">date_range</i><span className='leftmenu_style'>{data.Event_name}</span></a>
                ))}
              </nav>

              <a className="btn btn-primary add_btn" id='add_btn_id' onClick={() => clearField()}><i className="fa fa-plus" /></a>

              <div className='version_class'>
                <p>Version : 1.0.0 Build 20220511</p>
                <p>Copyright © 2022 | All Rights Reserved</p>
              </div>
            </div>
          </div>{/* az-content-left */}
          <div className="az-content-body pd-lg-l-40 d-flex flex-column" id='main'>

            <button className='wrapperrr_div_open' id="openNavi" onClick="openNav()">
              <i className='fa fa-chevron-right'></i>
            </button>


            {/* <div className="az-content-breadcrumb">
              <span>Dashboard</span>
              <span>Events</span>
            </div> */}
            <h2 className="az-content-title">Event</h2>
            <h6 class={isActive == 1 ? "active_status" : "active_status text-danger"}>{statusName != '' ? statusName : ''}</h6>
            {/* <div class="az-content-label mg-b-5">Form Input &amp; Textarea</div>
          <p class="mg-b-20">A basic form control input and textarea with disabled and readonly mode.</p> */}
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">Event Code<span className="star_mark">*</span></label>
                <input className="form-control" placeholder="Enter Events Code (Max 3)" value={eventCode} onInput={e => setEventCode(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'event code', 3)} type="text" />
                {errors.event_no.length > 0 && <span className='error'>{errors.event_no}</span>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">Event Name/Description<span className="star_mark">*</span></label>
                <input className="form-control" placeholder="Enter Events Name/Description" value={eventName} onInput={e => setEventName(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'event name', null)} type="text" maxLength={inputMaxLength} />
                {errors.event_name.length > 0 && <span className='error'>{errors.event_name}</span>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">No of Consecutive Readings<span className="star_mark">*</span></label>
                <input className="form-control" placeholder="No of Consecutive Readings" value={noOfReading} onWheel={(e) => e.target.blur()} onInput={e => setNoOfReading(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'number of consecutive readings', null)} type="number" />
                {errors.no_of_reading.length > 0 && <span className='error'>{errors.no_of_reading}</span>}
              </div>
              {/* <div className="col-md-4 form-group">
                <label className="custom_label">Select the SPC Event/Terminal</label>
                <select className="form-control select2-no-search" value={stationId} onChange={e => onStationDropdownChange(e.currentTarget.value)}>
                <option>Choose one</option>
                  {stationList.map(item => (
                            <option
                                key={item.station_id}
                                value={item.station_id}>
                                {item.StationName}
                            </option>
                        ))}
                </select>
              </div> */}
              {/* <div className="col-md-4 form-group">
                <label className="custom_label"> </label>
                <div style={{display: 'flex'}}>Apply to All (ATA) &nbsp;
                  <label className="ckbox" key={Math.random()}>
                    <input type="checkbox" key={Math.random()} defaultChecked={isATA} onChange={()=> setATA(!isATA)} /><span> </span>
                  </label>
                </div>
              </div> */}
            </div>
            <div className="row">
              <div className="col-md-12 form-group">
                <div className="Operator_check">
                  <div style={{ display: 'flex' }}>
                    Apply to All (ATA) &nbsp;
                    <label className="ckbox">
                      <input
                        type="checkbox"checked={isATA} onChange={() => setATA(!isATA)} />
                      <span> </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>


            {eventId != '' ? (
              <div className="row mt-3">
                <div className="col-12">
                  <div id="accordion">
                    <div className="card">
                      <div className="card-header">
                        <a href="#demo" data-toggle="collapse" aria-expanded="false">System Details <i className="fas fa-chevron-down" /></a>
                      </div>
                      <div id="demo" className="collapse "> {/* show */}
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
            {/* <Footer/> */}


            <div className="az-footer mg-t-auto" id="az_footer_id">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 text-right">
                    {eventId == '' && isWriteAccess ? (<button type="button" className="btn save_btn" onClick={onSaveClick}><i class='fa fa-save'></i>&nbsp; Save</button>) : (null)}
                    {eventId != '' && isWriteAccess && isActive == 1 ? (<button type="button" className="btn update_btn" onClick={onUpdateClick}><i class='fa fa-save'></i>&nbsp; Update</button>) : (null)}
                    {eventId != '' && isDeleteAccess && isActive == 1 ? (<button type="button" className="btn delete_btn" data-toggle="modal" data-target="#delete_pop_modal" onClick={() => toggleModal(eventId)}><i class="fa fa-trash-o"></i>&nbsp; Delete</button>) : (null)}
                    {/* <button type="button" className="btn" onClick={onBackClick}>Back</button> */}
                  </div>
                </div>

              </div>
            </div>



          </div>{/* az-content-body */}
        </div>{/* container */}
      </div>{/* az-content */}


    </>
  );
}
export default Event;