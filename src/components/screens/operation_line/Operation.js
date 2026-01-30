import React from 'react';
import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, inputValidatorOperationLine } from '../../utils/Validator';
import { operationListUrl, operationAccessUrl, insertOperationUrl, operationDetailsUrl, updateOperationUrl, deleteOperationUrl, appVersion, NA, inputMaxLength, fillListUrl, statusActionId } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal from "react-modal";

Modal.setAppElement("#root");
var selectedOperationId = '';

const Operation = (props) => {

  const linkRef = useRef(null);
  const errorMap = {
    operation: ''
  };
  const [userData, setUserData] = useState({});
  const [operationList, setOperationList] = useState([]);
  const [tempOperationList, setTempOperationList] = useState([]);
  const [operationAccessList, setOperationAccessList] = useState([]);
  const [operationDetails, setOperationDetails] = useState({});
  const [operationId, setOperationId] = useState('');
  const [operationName, setOperationName] = useState('');
  const [createdUser, setCreatedUser] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [createdVersion, setCreatedVersion] = useState('');
  const [modifiedUser, setModifiedUser] = useState('');
  const [modifiedDate, setModifiedDate] = useState('');
  const [modifiedVersion, setModifiedVersion] = useState('');
  const [deletedUser, setDeletedUser] = useState('');
  const [deletedDate, setDeletedDate] = useState('');
  const [deletedVersion, setDeletedVersion] = useState('');
  const [deleteOperationId, setOperationIdForDelete] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setError] = useState(errorMap);
  const history = useHistory();
  const [isWriteAccess, setWriteAccess] = useState(false);
  const [isDeleteAccess, setDeleteAccess] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [operationLine, setOperationLine] = useState('');
  const [statusId, setStatusId] = useState('');
  const [isActive, setIsActive] = useState('');
  const [statusName, setStatusName] = useState('');
  const [isShowDeleteIcon, setIsShowDeleteIcon] = useState(false);
  const [isActiveOperationList, setIsActiveOperationList] = useState(false);
  const [isMachine, setIsMachine] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [isEnableShiftInfo, setIsEnableShiftInfo] = useState(false);

  

  useEffect(async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData != null) {
      setUserData(userData);
      if (userData['userAccess'].length > 0) {
        for (var i = 0; i < userData['userAccess'].length; i++) {
          if (userData['userAccess'][i]['ModuleID'] == 3) {
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
      setOperationId(props.location.state.operationId);
    }
    getList(userData, '');
    getFillList(userData, statusActionId);


  }, []);

  const getFillList = async (data, actionId) => {
    var result = await axiosGet(`${fillListUrl}?actionid=${actionId}&userid=${data.ID}`);
    if (result != null && result['error'] == 0) {
      setStatusList(result['data']);
    }
  };


  // api call for operation list...........................
  const getList = async (data, search) => {
    const operationListQueryParam = {
      'Login_Id': data.ID,
      'Search': search
    };
    setLoader(true);
    var result = await axiosGet(`${operationListUrl}`, operationListQueryParam);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      var data = result['data'];
      for (var i = 0; i < data.length; i++) {
        data[i]['isSelected'] = false;
      }
      setOperationList(data);
      setTempOperationList(data);
      setIsShowDeleteIcon(false);
      setSearch('');

    }
  };

  // api call for operation details........................
  const getOperationDetails = async (data, operationID) => {
    setLoader(true);
    var result = await axiosGet(`${operationDetailsUrl}?Login_Id=${data.ID}&Operation_line_id=${operationID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      if (result['data'] != null) {
        setOperationDetails(result['data']);
        setOperationName(result['data'][0]['Operation_Line_Name'] ?? NA);
        setIsMachine(result['data'][0]['EnableMachinewisepalletmapping'] ?? false);
        setIsTemplate(result['data'][0]['EnableTemplatewisemodelmapping'] ?? false);
        setIsEnableShiftInfo(result['data'][0]['EnableShiftInfo'] ?? false);

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

      const searchList = tempOperationList.filter(data => {
        return (
          data
            .Operation_Name
            .toLowerCase()
            .includes(searchField.toLowerCase())
        );
      });
      setOperationList(searchList);
    } else {
      setOperationList([]);
      setTempOperationList([]);
      getList(userData, '');
    }
  };

  //doing clear search function.................................
  const onSearchClear = () => {
    setSearch('');
    setOperationList([]);
    setTempOperationList([]);
    getList(userData, '');
  };

  //on operation list item click...................................
  const onOperationItemClick = (operationId, index) => {
    setIsShowDeleteIcon(false);
    setSearch('');
    selectedOperationId = operationId;

    var data = operationList;
    for (var i = 0; i < data.length; i++) {
      if (i == index) {
        data[i]['isSelected'] = true;
      } else {
        data[i]['isSelected'] = false;
      }
    }

    setOperationList([]);
    setTempOperationList([]);
    setOperationList(data);
    setTempOperationList(data);
    setOperationName('');
    setOperationId(operationId);
    getOperationDetails(userData, operationId);
  };


  //input validation.................................................
  const inputValidate = (value, fieldName) => {
    var errorValue;
    errorValue = inputValidatorOperationLine(value, fieldName);

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
    if (!inputValidate(operationName, 'operation line')) {
      return;
    }

    var mapData = {
      'Login_Id': userData.ID,
      'Operation_Name': operationName,
      'EnableMachinewisepalletmapping' : isMachine,
      'EnableTemplatewisemodelmapping' : isTemplate,
      'EnableShiftInfo': isEnableShiftInfo,
      'CreatedVersion': appVersion,
    };
    setLoader(true);
    var result = await axiosPost(insertOperationUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('Operation line added successfully.', {
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

  //on update button click............................................
  const onUpdateClick = async () => {
    if (!inputValidate(operationName, 'operation name')) {
      return;
    }

    var mapData = {
      'Login_id': userData.ID,
      'Operation_line_id': operationId,
      'Operation_Name': operationName,
      'EnableMachinewisepalletmapping' : isMachine,
      'EnableTemplatewisemodelmapping' : isTemplate,
      'EnableShiftInfo': isEnableShiftInfo,
      'Modified_Version': appVersion,
    };
    setLoader(true);
    var result = await axiosPost(updateOperationUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('Operation Line updated successfully.', {
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
    errorMap.operation = '';
    setError(errorMap);
    setOperationId('');
    setOperationName('');
    setStatusName('');
    setIsActive('');
    setIsMachine(false);
    setIsTemplate(false);
    setIsEnableShiftInfo(false);
    getList(userData, '');
  }

  //toggle model for delete.................................
  function toggleModal(operationId) {
    setIsOpen(!isOpen);
    if (operationId == '') {
      return;
    } else {
      setOperationIdForDelete(operationId);
    }

  }

  //toggle model for filter .................................
  function toggleFilterModal(operationId) {
    setIsFilterOpen(!isFilterOpen);
    if (operationId == '') {
      return;
    } else {
      setOperationIdForDelete(operationId);
    }

  }


  // on filter click
  const onFilterClick = async () => {
    var searchString = '';
    if (operationLine != '') {
      searchString = `Name like '%${operationLine}%'`;
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
    setOperationLine('')
    setStatusId('')
    toggleFilterModal()
    clearField()
    getList(userData, '');
  }


  //on delete button click............................................
  const onDeleteClick = async () => {
    setLoader(true);
    var result = await axiosGet(`${deleteOperationUrl}?Login_id=${userData.ID}&Operation_line_id=${operationId}&Deleted_Version=${appVersion}`);
    setLoader(false);
    toggleModal();
    if (result != null && result['error'] == 0) {
      toast.success('Operation line deleted successfully.', {
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
                  <h3 className='pop_label'>Do you really want to delete this operation?</h3>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group text-right mt-5">
                    <a href="javascript:void(0);" class="btn save_btn" onClick={onDeleteClick}><i class='fa fa-check'></i>&nbsp; Yes</a>
                    <a href="javascript:void(0);" class="btn cancel_btn" data-dismiss="modal" style={{ marginLeft: '5px' }} onClick={toggleModal}><i class="fa fa-times"></i>&nbsp; No</a>
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
            <div class="modal-header header_bg_color_blue" >
              <h4 class="modal-title modal_title_text">Operation Line Filter</h4>
              <button type="button" class="close" data-dismiss="modal" onClick={toggleFilterModal}>&times;</button>
            </div>
            <div class="modal-body border_bottom_blue">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="custom_label">Operation Line</label>
                    <input type="text" class="form-control" placeholder="" value={operationLine} onInput={e => setOperationLine(e.currentTarget.value)} />
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
                      ))
                      }
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


      <Header activeId={'isOperartionActiveColor'} />
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

                  <div data-toggle="modal" data-target="#delete_pop_modal" onClick={() => toggleFilterModal(operationId)}>
                    <input name="type" type="radio" defaultValue="OperationLine_filter" id="OperationLine_filter" />
                    <label htmlFor="type-operation">
                      <i className="fa fa-filter edit-pen-title" />
                      <span>Filter</span>
                    </label>
                  </div>
                </div>
              </div>
              <nav className="nav flex-column left_menu">
                {operationList.map((data, i) => (
                  <a ref={linkRef} className={data.StatusID != 1 ? "nav-link text-danger" : !data.isSelected ? "nav-link " : 'nav-link text-danger'} key={i} onClick={() => onOperationItemClick(data.Operation_Id, i)} style={{ display: 'flex' }}><i class="fas fa-cog"></i><span className='leftmenu_style'>{data.Operation_Name}</span></a>
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


            <h2 className="az-content-title">Operation Line</h2>
            <h6 class={isActive == 1 ? "active_status" : "active_status text-danger"}>{statusName != '' ? statusName : ''}</h6>
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">Operation Line<span className="star_mark">*</span></label>
                <input className="form-control" placeholder="Operation Line" value={operationName} onInput={e => setOperationName(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'operation line')} type="text" />
                {errors.operation.length > 0 && <span className='error'>{errors.operation}</span>}
              </div>
              
            </div>
            <div className="row">
            <div className="col-lg-3 form-group">
                <label className="ckbox">
                  <input type="checkbox"  defaultChecked={isMachine} onChange={() => setIsMachine(!isMachine)} /><span class="ml-1">Machine wise pallet mapping</span>
                </label>
              </div>
              <div className="col-lg-3 form-group">
                <label className="ckbox">
                  <input type="checkbox"  defaultChecked={isTemplate} onChange={() => setIsTemplate(!isTemplate)} /><span class="ml-1">Template wise model mapping</span>
                </label>
              </div>
              <div className="col-lg-3 form-group">
                <label className="ckbox">
                  <input type="checkbox" defaultChecked={isEnableShiftInfo} onChange={() => setIsEnableShiftInfo(!isEnableShiftInfo)} /><span class="ml-1">Enable Shift Info</span>
                </label>
              </div>
            </div>
            {operationId != '' ? (
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
                    {operationId == '' && isWriteAccess ? (<button type="button" className="btn save_btn" onClick={onSaveClick}><i class='fa fa-save'></i>&nbsp; Save</button>) : (null)}
                    {operationId != '' && isWriteAccess && isActive == 1 ? (<button type="button" className="btn update_btn" onClick={onUpdateClick}><i class='fa fa-save'></i>&nbsp; Update</button>) : (null)}
                    {operationId != '' && isDeleteAccess && isActive == 1 ? (<button type="button" className="btn delete_btn" data-toggle="modal" data-target="#delete_pop_modal" onClick={() => toggleModal(operationId)}><i class="fa fa-trash-o"></i>&nbsp; Delete</button>) : (null)}
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
export default Operation;