import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, inputValidatorRoleName } from '../../utils/Validator';
import { roleListUrl, roleAccessUrl, insertRoleUrl, roleDetailsUrl, updateRoleUrl, deleteRoleUrl, appVersion, NA, inputMaxLength, statusActionId, fillListUrl } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal from "react-modal";

Modal.setAppElement("#root");
var selectedRoleId = '';

const Role = (props) => {


  const errorMap = {
    role: ''
  };
  const [userData, setUserData] = useState({});
  const [roleList, setRoleList] = useState([]);
  const [tempRoleList, setTempRoleList] = useState([]);
  const [roleAccessList, setRoleAccessList] = useState([]);
  const [roleDetails, setRoleDetails] = useState({});
  const [roleId, setRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [isOperatorRole, setOperatorRole] = useState(false);
  const [createdUser, setCreatedUser] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [createdVersion, setCreatedVersion] = useState('');
  const [modifiedUser, setModifiedUser] = useState('');
  const [modifiedDate, setModifiedDate] = useState('');
  const [modifiedVersion, setModifiedVersion] = useState('');
  const [deletedUser, setDeletedUser] = useState('');
  const [deletedDate, setDeletedDate] = useState('');
  const [deletedVersion, setDeletedVersion] = useState('');
  const [deleteRoleId, setRoleIdForDelete] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setError] = useState(errorMap);
  const history = useHistory();
  const [isActive, setIsActive] = useState('');
  const [statusName, setStatusName] = useState('');
  const [isWriteAccess, setWriteAccess] = useState(false);
  const [isDeleteAccess, setDeleteAccess] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [sRoleName, setSRoleName] = useState('');
  const [statusId, setStatusId] = useState('');
  const [isShowDeleteIcon, setIsShowDeleteIcon] = useState(false);
  const [isActiveRoleList, setIsActiveRoleList] = useState(false);
  const [isFullAccess, setIsFullAccess] = useState(false);
  const [isReadAll, setIsReadAll] = useState(false);
  const [isWriteAll, setIsWriteAll] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);

  useEffect(async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData != null) {
      setUserData(userData);
      if (userData['userAccess'].length > 0) {
        for (var i = 0; i < userData['userAccess'].length; i++) {
          if (userData['userAccess'][i]['ModuleID'] == 1) {
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
      setRoleId(props.location.state.roleId);
    }
    getList(userData, '');
    getRoleAccess(userData, isOperatorRole);
    getFillList(userData, statusActionId);
  }, []);

  const getFillList = async (data, actionId) => {
    var result = await axiosGet(`${fillListUrl}?actionid=${actionId}&userid=${data.ID}`);
    if (result != null && result['error'] == 0) {
      setStatusList(result['data']);
    }
  };

  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  // api call for role list...........................
  const getList = async (data, search) => {
    setIsShowDeleteIcon(false);
    setSearch('');
    const roleListQueryParam = {
      'Login_Id': data.ID,
      'Search': search
    };
    setLoader(true);
    var result = await axiosGet(`${roleListUrl}`, roleListQueryParam);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      var data = result['data'];
      for (var i = 0; i < data.length; i++) {
        data[i]['isSelected'] = false;
      }
      setRoleList(result['data']);
      setTempRoleList(result['data']);

    }
  };
  // api call for role access list........................
  const getRoleAccess = async (data, isOperator) => {

    setLoader(true);
    var result = await axiosGet(`${roleAccessUrl}?Login_Id=${data.ID}&IsOperatorRole=${isOperator}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      setRoleAccessList(result['data']);
    }
  };
  // api call for role details........................
  const getRoleDetails = async (data, roleID) => {
    setLoader(true);
    var result = await axiosGet(`${roleDetailsUrl}?Login_Id=${data.ID}&role_id=${roleID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      if (result['data'] != null) {
        setIsFullAccess(false);
        setIsReadAll(false);
        setIsWriteAll(false);
        setIsDeleteAll(false);

        setRoleDetails(result['data']);
        setRoleName(result['data']['RoleName']);
        setOperatorRole(result['data']['IsOperatorRole']);
        setIsActive(result['data']['StatusID']);
        setStatusName(result['data']['StatusName']);
        setCreatedUser(result['data']['CreatedUser'] ?? NA);
        setCreatedVersion(result['data']['CreatedVersion'] ?? NA);
        setCreatedDate(result['data']['CreatedDate'] != null ? moment(result['data']['CreatedDate']).format('DD-MM-YYYY') : NA);

        setModifiedUser(result['data']['ModifiedUser'] ?? NA);
        setModifiedVersion(result['data']['ModifiedVersion'] ?? NA);
        setModifiedDate(result['data']['ModifiedDate'] != null ? moment(result['data']['ModifiedDate']).format('DD-MM-YYYY') : NA);

        setDeletedUser(result['data']['DeletedUser'] ?? NA);
        setDeletedVersion(result['data']['DeletedVersion'] ?? NA);
        setDeletedDate(result['data']['DeletedDate'] != null ? moment(result['data']['DeletedDate']).format('DD-MM-YYYY') : NA);

        setRoleAccessList([]);
        var isReadFullCheck = true;
        var isWriteFullCheck = true;
        var isDeleteFullCheck = true;
        var roleAccess = result['data']['roleAccess'];
        for (var i = 0; i < roleAccess.length; i++) {
          if (!roleAccess[i]['Read']) {
            isReadFullCheck = false;
          }
          if (!roleAccess[i]['write']) {
            isWriteFullCheck = false;
          }
          if (!roleAccess[i]['Delete']) {
            isDeleteFullCheck = false;
          }
        }
        if (!isReadFullCheck) {
          setIsReadAll(false);
        } else {
          setIsReadAll(true);
        }
        if (!isWriteFullCheck) {
          setIsWriteAll(false);
        } else {
          setIsWriteAll(true);
        }
        if (!isDeleteFullCheck) {
          setIsDeleteAll(false);
        } else {
          setIsDeleteAll(true);
        }
        if (!isReadFullCheck || !isWriteFullCheck || !isDeleteFullCheck) {
          setIsFullAccess(false);
        } else {
          setIsFullAccess(true);
        }
        setRoleAccessList(result['data']['roleAccess']);

      }

    }
  };
  //doing search function.................................
  const onSearch = async (searchField) => {

    setSearch(searchField);

    if (searchField.length > 0) {
      setIsShowDeleteIcon(true);
      const searchList = tempRoleList.filter(data => {
        return (
          data
            .RoleName
            .toLowerCase()
            .includes(searchField.toLowerCase())
        );
      });
      setRoleList(searchList);


    } else {
      setRoleList([]);
      setTempRoleList([]);
      getList(userData, '');
      // setIsShowDeleteIcon(!isShowDeleteIcon);
    }
  };

  //doing clear search function.................................
  const onSearchClear = () => {
    setSearch('');
    setRoleList([]);
    setTempRoleList([]);
    getList(userData, '');
  };

  //on role list item click...................................
  const onRoleItemClick = (roleId, index) => {
    setIsFullAccess(false);
    setIsReadAll(false);
    setIsWriteAll(false);
    setIsDeleteAll(false);
    setIsShowDeleteIcon(false);
    setSearch('');
    setRoleId(roleId);
    if (roleId == '') {
      setRoleName('');
      getList(userData, '');
      setRoleAccessList([]);
      getRoleAccess(userData, isOperatorRole);
    } else {
     roleList.forEach((item, i) => {
    if (i === index) {
      setIsActiveRoleList(!isActiveRoleList);
      }
    });
      
      var data = roleList;
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          data[i]['isSelected'] = true;
        } else {
          data[i]['isSelected'] = false;
        }
      }


      setRoleList([]);
      setTempRoleList([]);
      setRoleList(data);
      setTempRoleList(data);
      getRoleDetails(userData, roleId);
    }
  };
  //role access checkbox changed...............................
  const onRoleAccessChanged = async (mode, index, fullControl, isRead, isWrite, isDelete) => {
    const roleAccList = roleAccessList;
    roleAccList[index]['FullControl'] = fullControl;
    if (fullControl) {
      roleAccList[index]['Read'] = true;
      roleAccList[index]['write'] = true;
      roleAccList[index]['Delete'] = true;
    } else {
      setIsFullAccess(false);
      roleAccList[index]['Read'] = isRead;
      roleAccList[index]['write'] = isWrite;
      roleAccList[index]['Delete'] = isDelete;
    }
    if ((mode == 3 || mode == 4) && (isWrite || isDelete)) {
      roleAccList[index]['Read'] = true;
    }
    if (mode == 3 || mode == 4) {
      var isAllWriteAndDelete = true;
      for (var i = 0; i < roleAccList.length; i++) {
        if (roleAccList[i]['write'] || roleAccList[i]['Delete']) {
          roleAccList[i]['Read'] = true;
        } else {
          isAllWriteAndDelete = false;
          roleAccList[i]['Read'] = false;
          setIsReadAll(false);
        }
      }
      if (isAllWriteAndDelete) {
        setIsReadAll(true);
      }
    }

    //check all full access granted then check full access checkbox otherwise uncheck that checkbox...............

    var isAllFullCheck = true;
    for (var i = 0; i < roleAccList.length; i++) {
      if (mode == 1 && !roleAccList[i]['FullControl']) {
        isAllFullCheck = false;
      } else if (mode == 2 && !roleAccList[i]['Read']) {
        isAllFullCheck = false;
      } else if (mode == 3 && !roleAccList[i]['write']) {
        isAllFullCheck = false;
      } else if (mode == 4 && !roleAccList[i]['Delete']) {
        isAllFullCheck = false;
      }
    }

    if (!isAllFullCheck) {
      if (mode == 1) {
        setIsFullAccess(false);
      } else if (mode == 2) {
        setIsReadAll(false);
      } else if (mode == 3) {
        setIsWriteAll(false);
      } else if (mode == 4) {
        setIsDeleteAll(false);
      }

    } else {
      if (mode == 1) {
        setIsFullAccess(true);
      } else if (mode == 2) {
        setIsReadAll(true);
      } else if (mode == 3) {
        setIsWriteAll(true);
      } else if (mode == 4) {
        setIsDeleteAll(true);
      }
    }

    //..............................................................
    await timeout(100);
    setRoleAccessList([]);
    setRoleAccessList(roleAccList);
  };

  //input validation.................................................
  const inputValidate = (value, fieldName) => {
    var errorValue;
    errorValue = inputValidatorRoleName(value, fieldName);

    if (errorValue !== '') {
      errorMap.role = errorValue;
      setError(errorMap);
      return false;
    } else {
      errorMap.role = errorValue;
      setError(errorMap);
      return true;
    }

  };

  //on save button click............................................
  const onSaveClick = async () => {
    if (!inputValidate(roleName, 'role name')) {
      return;
    }
    var checkList = [];
    for (var i = 0; i < roleAccessList.length; i++) {
      if (roleAccessList[i]['Read'] || roleAccessList[i]['write'] || roleAccessList[i]['Delete']) {
        checkList.push(roleAccessList[i]);
      }
    }
    if (checkList.length == 0) {
      toast.error('Atleast one role access is mandatory.', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      return;
    }

    var mapData = {
      'Login_Id': userData.ID,
      'RoleName': roleName,
      'IsOperatorRole': isOperatorRole,
      'CreatedVersion': appVersion,
      'roleAccessData': roleAccessList
    };
    setLoader(true);
    var result = await axiosPost(insertRoleUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('Role added successfully.', {
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
    if (!inputValidate(roleName, 'role name')) {
      return;
    }
    var checkList = [];
    for (var i = 0; i < roleAccessList.length; i++) {
      if (roleAccessList[i]['Read'] || roleAccessList[i]['write'] || roleAccessList[i]['Delete']) {
        checkList.push(roleAccessList[i]);
      }
    }
    if (checkList.length == 0) {
      toast.error('Atleast one role access is mandatory.', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      return;
    }

    var mapData = {
      'Login_Id': userData.ID,
      'role_id': roleId,
      'role_name': roleName,
      'IsOperatorRole': isOperatorRole,
      'ModifiedVersion': appVersion,
      'roleAccessData': roleAccessList
    };
    setLoader(true);
    var result = await axiosPost(updateRoleUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('Role updated successfully.', {
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

  //toggle model for delete.................................
  function toggleModal(roleId) {
    setIsOpen(!isOpen);
    if (roleId == '') {
      return;
    } else {
      setRoleIdForDelete(roleId);
    }

  }

  //toggle model for filter .................................
  function toggleFilterModal(roleId) {
    setIsFilterOpen(!isFilterOpen);
    if (roleId == '') {
      return;
    } else {
      setRoleIdForDelete(roleId);
    }

  }

  // on filter click
  const onFilterClick = async () => {
    // 'RoleName like ''%QA%'' and statusid=1'
    var searchString = '';
    if (sRoleName != '') {
      searchString = `RoleName like '%${sRoleName}%'`;
    }
    if (statusId != '' && statusId != 'Choose one') {
      if (searchString != '') {
        searchString = searchString + ' and ';
      }
      searchString = searchString + `statusid=${statusId}`;
    }
    getList(userData, searchString);
    toggleFilterModal()
  }

  const onFilterCancel = async () => {
    setSRoleName('')
    setStatusId('')
    toggleFilterModal()
    clearField()
    getList(userData, '');
  }



  //on delete button click............................................
  const onDeleteClick = async () => {
    setLoader(true);
    var result = await axiosGet(`${deleteRoleUrl}?Login_Id=${userData.ID}&role_id=${roleId}&Deleted_Version=${appVersion}`);
    setLoader(false);
    toggleModal();
    if (result != null && result['error'] == 0) {
      toast.success('Role deleted successfully.', {
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

  const clearField = async () => {
    errorMap.role = '';
    setError(errorMap);
    setRoleId('');
    setRoleName('');
    setStatusName('');
    setIsActive('');
    setOperatorRole(false);
    setRoleAccessList([]);
    getList(userData, '');
    getRoleAccess(userData, false);
    setIsFullAccess(false);
    setIsReadAll(false);
    setIsWriteAll(false);
    setIsDeleteAll(false);
  }

  const onOperatorChanged = (isOperator) => {
    setOperatorRole(isOperator)
    setRoleAccessList([])
    getRoleAccess(userData, isOperator);
    setIsReadAll(false);
    setIsWriteAll(false);
    setIsDeleteAll(false);
    setIsFullAccess(false);
  }

  const onAccessAllChanged = async (mode, value) => {
    const roleAccList = roleAccessList;
    var isAllFullCheck = true;
    for (var index = 0; index < roleAccList.length; index++) {
      if (mode == 1) {
        if (value) {
          roleAccList[index]['FullControl'] = value;
          roleAccList[index]['Read'] = true;
          roleAccList[index]['write'] = true;
          roleAccList[index]['Delete'] = true;
          setIsReadAll(true);
          setIsWriteAll(true);
          setIsDeleteAll(true);
        } else {
          roleAccList[index]['FullControl'] = value;
          roleAccList[index]['Read'] = false;
          roleAccList[index]['write'] = false;
          roleAccList[index]['Delete'] = false;
          setIsReadAll(false);
          setIsWriteAll(false);
          setIsDeleteAll(false);
        }
      } else if (mode == 2) {
        if (value) {
          // roleAccList[index]['FullControl'] = value;
          roleAccList[index]['Read'] = true;
        } else {
          roleAccList[index]['FullControl'] = value;
          roleAccList[index]['Read'] = false;
          setIsFullAccess(false);
        }
      } else if (mode == 3) {
        if (value) {
          // roleAccList[index]['FullControl'] = value;
          roleAccList[index]['write'] = true;
        } else {
          roleAccList[index]['FullControl'] = value;
          roleAccList[index]['write'] = false;
          setIsFullAccess(false);
        }
      } else if (mode == 4) {
        if (value) {
          // roleAccList[index]['FullControl'] = value;
          roleAccList[index]['Delete'] = true;
        } else {
          roleAccList[index]['FullControl'] = value;
          roleAccList[index]['Delete'] = false;
          setIsFullAccess(false);
        }
      }
      if (!roleAccList[index]['FullControl']) {
        isAllFullCheck = false;
      }
    }
    if (mode == 1) {
      setIsFullAccess(value);
    } else if (mode == 2) {
      if (value && isAllFullCheck) {
        setIsFullAccess(value);
      }
      setIsReadAll(value);
    } else if (mode == 3) {
      if (value && isAllFullCheck) {
        setIsFullAccess(value);
      }
      setIsWriteAll(value);
    } else if (mode == 4) {
      if (value && isAllFullCheck) {
        setIsFullAccess(value);
      }
      setIsDeleteAll(value);
    }
    var isWriteAndDeleteAllChecked = true;
    for (var index = 0; index < roleAccList.length; index++) {
      if (!roleAccList[index]['write'] && !roleAccList[index]['Delete']) {
        isWriteAndDeleteAllChecked = false;
      }
    }
    if (isWriteAndDeleteAllChecked) {
      setIsReadAll(true);
      for (var index = 0; index < roleAccList.length; index++) {
        roleAccList[index]['Read'] = true;
      }
    }
    await timeout(100);
    setRoleAccessList([]);
    setRoleAccessList(roleAccList);
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
        {/* <div class="modal fade" id="delete_pop_modal" role="dialog"> */}
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content">
            <div class="modal-header header_bg_color_red">
              <h4 class="modal-title modal_title_text">Confirm Delete</h4>
              <button type="button" class="close" data-dismiss="modal" onClick={toggleModal}>&times;</button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <h3 className='pop_label'>Do you really want to delete this role?</h3>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group text-right mt-5">
                    <a href="javascript:void(0);" class="btn save_btn" onClick={onDeleteClick}><i class="fa fa-check"></i>&nbsp; Yes</a>
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
        { /*  <div id="Role_filter" class="modal fade" role="dialog">*/}

        <div className="modal-dialog custom_modal_dialog">
          <div class="modal-content">
            <div class="modal-header header_bg_color_blue">

              <h4 class="modal-title modal_title_text">Role Filter</h4>
              <button type="button" class="close" data-dismiss="modal" onClick={toggleFilterModal}>&times;</button>
            </div>
            <div class="modal-body border_bottom_blue">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="custom_label">Role Name</label>
                    <input type="text" class="form-control" placeholder="" value={sRoleName} onInput={e => setSRoleName(e.currentTarget.value)} />
                  </div>
                  <div class="form-group">
                    <label class="custom_label">Status</label>
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
                  <div class="form-group text-right mt-5">
                    <button type="button" class="btn search_btn" data-dismiss="modal" onClick={() => onFilterClick()}><i class="fa fa-search"></i>&nbsp; Search</button>
                    <button type="button" class="btn cancel_btn" data-dismiss="modal" onClick={() => onFilterCancel()}><i class="fa fa-times"></i>&nbsp; Cancel</button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* </div> */}

      </Modal>


      <Header activeId={'isRoleActiveColor'} />

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
                      <span >Cancel</span>
                    </label>
                  </div> : <div className='p-0 m-0'>  <input name="type" type="radio" defaultValue="type-posts" id="type-posts" /></div>}
                  <div data-toggle="modal" data-target="#delete_pop_modal" onClick={() => toggleFilterModal(roleId)}>
                    <input name="type" type="radio" defaultValue="role_filter" id="role_filter" />
                    <label htmlFor="type-role">
                      <i className="fa fa-filter edit-pen-title" />
                      <span>Filter</span>
                    </label>
                  </div>
                </div>
              </div>
              <nav className="nav flex-column left_menu">
                {roleList.map((data, i) => (
                  <a className={data.StatusID != 1 ? "nav-link text-danger" : !data.isSelected ? "nav-link " : 'nav-link text-danger'} key={i} onClick={() => onRoleItemClick(data.id, i)} style={{ display: 'flex' }}><i class="far fa-user-circle"></i><span className='leftmenu_style'>{data.RoleName}</span></a>
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
              <span>Security</span>
              <span>Role</span>
            </div> */}
            <h2 className="az-content-title">Role</h2>
            <h6 class={isActive == 1 ? "active_status" : "active_status text-danger"}>{statusName != '' ? statusName : ''}</h6>

            {/* <div class="az-content-label mg-b-5">Form Input &amp; Textarea</div>
          <p class="mg-b-20">A basic form control input and textarea with disabled and readonly mode.</p> */}
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="custom_label">Role Name<span className="star_mark">*</span></label>
                <input className="form-control" placeholder="Role Name" value={roleName} onInput={e => setRoleName(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'role name')} type="text" />
                {errors.role.length > 0 && <span className='error'>{errors.role}</span>}
              </div>
              {/* <div className="col-md-4 form-group" style={{padding: '7px 0px'}}>
                <label className="custom_label"> </label>
                <label className="ckbox">
                  <input type="checkbox" defaultChecked={isOperatorRole} onChange={() => onOperatorChanged(!isOperatorRole)} /><span>Operator Role</span>
                </label>
              </div> */}
            </div>

           <div className="row">
            <div className="col-md-12 form-group">
              <div className="Operator_check">
                <label className="ckbox">
                  <input
                    type="checkbox" checked={isOperatorRole} onChange={() => onOperatorChanged(!isOperatorRole)}/>
                  <span>This role is for Operator users</span>
                </label>

                <p className="mb-0 mt-3">
                  If you mark this option, all users who are added with this role will be an Operator user.
                </p>
              </div>
            </div>
          </div>


            <div className="row">
              <div className="col-md-12">
                <div className="az-content-label mg-b-5 mt-4">Role Access : <span style={{ color: '#858585' }}>{isOperatorRole ? " Data Entry App" : " Central Enterprise App"}</span></div>

                {/* <p class="mg-b-20">Add borders on all sides of the table and cells.</p> */}
                <div className="table_wrapper">
                  <div className="hack1">
                    <div className="hack2">
                      <table className="table table-bordered table-striped mg-b-15">
                        <thead>
                          <tr>
                            {/* <th>Module</th> */}
                            <th style={{ width: '20%' }}>Module/Feature</th>
                            <th colSpan={5} className="text-center">Accessible</th>
                          </tr>
                          <tr>
                            <th />

                            <th style={{ 'textAlign': 'center', 'width': '15%' }}>Full Access <br />
                              <label className="ckbox" style={{ 'textAlign': 'center', 'display': 'inline-grid' }}>
                                <input  type="checkbox" defaultChecked={isFullAccess} onChange={() => onAccessAllChanged(1, !isFullAccess)} /><span> </span>
                              </label>
                            </th>
                            <th style={{ 'textAlign': 'center', 'width': '15%' }}>Read<br />
                              <label className="ckbox" style={{ 'textAlign': 'center', 'display': 'inline-grid' }}>
                                <input  type="checkbox" defaultChecked={isReadAll} onChange={() => onAccessAllChanged(2, !isReadAll)} /><span> </span>
                              </label>
                            </th>
                            <th style={{ 'textAlign': 'center', 'width': '15%' }}>Write<br />
                              <label className="ckbox" style={{ 'textAlign': 'center', 'display': 'inline-grid' }}>
                                <input  type="checkbox" defaultChecked={isWriteAll} onChange={() => onAccessAllChanged(3, !isWriteAll)} /><span> </span>
                              </label>
                            </th>
                            <th style={{ 'textAlign': 'center', 'width': '15%' }}>Delete<br />
                              <label className="ckbox" style={{ 'textAlign': 'center', 'display': 'inline-grid' }}>
                                <input  type="checkbox" defaultChecked={isDeleteAll} onChange={() => onAccessAllChanged(4, !isDeleteAll)} /><span> </span>
                              </label>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {roleAccessList.map((data, i) => (
                            <tr key={i}>
                              {/* <td>{data.Module}</td> */}
                              <td>{data.ModuleFeature}</td>
                              <td style={{ 'textAlign': 'center' }}>
                                <label className="ckbox" style={{ 'textAlign': 'center', 'display': 'inline-grid' }}>
                                  <input type="checkbox" defaultChecked={data.FullControl} onChange={() => onRoleAccessChanged(1, i, !data.FullControl, data.Read, data.write, data.Delete)} /><span> </span>
                                </label>
                              </td>
                              <td style={{ 'textAlign': 'center' }}>
                                <label className="ckbox" style={{ 'textAlign': 'center', 'display': 'inline-grid' }}>
                                  <input type="checkbox" defaultChecked={data.Read} onChange={() => onRoleAccessChanged(2, i, false, !data.Read, data.write, data.Delete)} /><span> </span>
                                </label>
                              </td>
                              <td style={{ 'textAlign': 'center' }}>
                                <label className="ckbox" style={{ 'textAlign': 'center', 'display': 'inline-grid' }}>
                                  <input type="checkbox" defaultChecked={data.write} onChange={() => onRoleAccessChanged(3, i, false, data.Read, !data.write, data.Delete)} /><span> </span>
                                </label>
                              </td>
                              <td style={{ 'textAlign': 'center' }}>
                                <label className="ckbox" style={{ 'textAlign': 'center', 'display': 'inline-grid' }}>
                                  <input type="checkbox" defaultChecked={data.Delete} onChange={() => onRoleAccessChanged(4, i, false, data.Read, data.write, !data.Delete)} /><span> </span>
                                </label>
                              </td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {roleId != '' ? (
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
            {/* <Footer /> */}


            <div className="az-footer mg-t-auto" id="az_footer_id">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 text-right">
                    {roleId == '' && isWriteAccess ? (<button type="button" className="btn save_btn" onClick={onSaveClick}><i class='fa fa-save'></i>&nbsp; Save</button>) : (null)}
                    {roleId != '' && isWriteAccess && isActive == 1 ? (<button type="button" className="btn update_btn" onClick={onUpdateClick}><i class='fa fa-save'></i>&nbsp; Update</button>) : (null)}
                    {roleId != '' && isDeleteAccess && isActive == 1 ? (<button type="button" className="btn delete_btn" data-toggle="modal" data-target="#delete_pop_modal" onClick={() => toggleModal(roleId)}><i class="fa fa-trash-o"></i>&nbsp; Delete</button>) : (null)}
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
export default Role;