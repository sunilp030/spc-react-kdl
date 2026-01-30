import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, dropdownValidator, confirmPasswordValidator, passwordValidator } from '../../utils/Validator';
import { roleListUrl, userListUrl, userAccessUrl, insertUserUrl, userDetailsUrl, updateUserUrl, deleteUserUrl, appVersion, NA, inputMaxLength, statusActionId, fillListUrl, roleActionId, inputUserNameMaxLength, inputPasswordMaxLength, inputPasswordMinLength } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal from "react-modal";
import groupBy from 'lodash/groupBy';


Modal.setAppElement("#root");
var selectedUserId = '';

const User = (props) => {


  const errorMap = {
    user: '',
    user_name: '',
    pass: '',
    confPass: '',
    role_id: ''

  };
  const [userData, setUserData] = useState({});
  const [userList, setUserList] = useState([]);
  const [tempUserList, setTempUserList] = useState([]);
  const [userAccessList, setUserAccessList] = useState([]);
  const [userAccessGroup, setUserAccessGroup] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRoleId, setRoleId] = useState('');
  const [createdUser, setCreatedUser] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [createdVersion, setCreatedVersion] = useState('');
  const [modifiedUser, setModifiedUser] = useState('');
  const [modifiedDate, setModifiedDate] = useState('');
  const [modifiedVersion, setModifiedVersion] = useState('');
  const [deletedUser, setDeletedUser] = useState('');
  const [deletedDate, setDeletedDate] = useState('');
  const [deletedVersion, setDeletedVersion] = useState('');
  const [deleteUserId, setUserIdForDelete] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setError] = useState(errorMap);
  const history = useHistory();
  const [isWriteAccess, setWriteAccess] = useState(false);
  const [isDeleteAccess, setDeleteAccess] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [roleFilterList, setRoleFilterList] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [userFilterName, setUserFilterName] = useState('');
  const [statusId, setStatusId] = useState('');
  const [roleFilterId, setRoleFilterId] = useState('');
  const [isActive, setIsActive] = useState('');
  const [statusName, setStatusName] = useState('');
  const [isShowDeleteIcon, setIsShowDeleteIcon] = useState(false);
  const [isActiveUserList, setIsActiveUserList] = useState(false);
  const [isOperatorRoleUser, setIsOperatorRoleUser] = useState(false);


  useEffect(async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData != null) {
      setUserData(userData);
      if (userData['userAccess'].length > 0) {
        for (var i = 0; i < userData['userAccess'].length; i++) {
          if (userData['userAccess'][i]['ModuleID'] == 2) {
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
      setUserId(props.location.state.userId);
    }
    getList(userData, '');
    getUserAccess(userData);
    getRole(userData);
    getFillList(userData, statusActionId);
    getFillList(userData, roleActionId);

  }, []);

  const getFillList = async (data, actionId) => {
    var result = await axiosGet(`${fillListUrl}?actionid=${actionId}&userid=${data.ID}`);
    if (result != null && result['error'] == 0) {
      if (actionId == statusActionId) {
        setStatusList(result['data']);
      }
      else if (actionId == roleActionId) {
        setRoleFilterList(result['data']);
      }
    }
  };


  // api call for user list...........................
  const getList = async (data, search) => {
    setIsShowDeleteIcon(false);
    setSearch('');

    const userListQueryParam = {
      'Login_Id': data.ID,
      'Search': search
    };
    setLoader(true);
    var result = await axiosGet(`${userListUrl}`, userListQueryParam);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      var data = result['data'];
      for (var i = 0; i < data.length; i++) {
        data[i]['isSelected'] = false;
      }
      setUserList(result['data']);
      setTempUserList(result['data']);

    }
  };
  // api call for user access list........................
  const getUserAccess = async (data) => {

    setLoader(true);
    var result = await axiosGet(`${userAccessUrl}?Login_Id=${data.ID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      setUserAccessGroup(result['data']);
      grouping(result['data']);
    }
  };
  const grouping = (data) => {
    const a = groupBy(data, function (n) {
      return n.OperationLineName;
    });
    var groups = Object.keys(a).map(function (key) {
      return { OperationName: key, stations: a[key] };
    });
    setUserAccessList([]);
    setUserAccessList(groups);
  };
  //get role dropdown list...................
  const getRole = async (data) => {
    var result = await axiosGet(`${fillListUrl}?actionid=${roleActionId}`);
    if (result != null && result['error'] == 0) {
      setRoleList(result['data']);
    }
  };
  // api call for user details........................
  const getUserDetails = async (data, userID) => {
    setLoader(true);
    var result = await axiosGet(`${userDetailsUrl}?Login_Id=${data.ID}&user_id=${userID}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      if (result['data'] != null) {
        setUserDetails(result['data']);
        setName(result['data']['Name']);
        setUserName(result['data']['UserName']);
        setRoleId(result['data']['RoleId']);

        setIsActive(result['data']['StatusID']);
        setStatusName(result['data']['StatusName']);
        setCreatedUser(result['data']['CreatedUser'] ?? NA);
        setCreatedVersion(result['data']['CreatedVersion'] ?? NA);
        setCreatedDate(result['data']['CreatedDate'] != null ? moment(result['data']['CreatedDate']).format('DD-MM-YYYY') : NA);

        setModifiedUser(result['data']['ModifiedUser'] ?? NA);
        setModifiedVersion(result['data']['ModifiedVersion'] ?? NA);
        setModifiedDate(result['data']['ModifiedDate'] != null ? moment(result['data']['ModifiedDate']).format('DD-MM-YYYY') : NA);

        setDeletedUser(result['data']['DeletedUser'] != null ? result['data']['DeletedUser'] : NA);
        setDeletedVersion(result['data']['DeletedVersion'] ?? NA);
        setDeletedDate(result['data']['DeletedDate'] != null ? moment(result['data']['DeletedDate']).format('DD-MM-YYYY') : NA);

        setUserAccessGroup([]);
        setUserAccessGroup(result['data']['userAccess']);
        grouping(result['data']['userAccess']);
      }

    }
  };
  //doing search function.................................
  const onSearch = async (searchField) => {

    setSearch(searchField);
    if (searchField.length > 0) {
      setIsShowDeleteIcon(true);
      const searchList = tempUserList.filter(data => {
        return (
          data
            .User_Name
            .toLowerCase()
            .includes(searchField.toLowerCase())
        );
      });
      setUserList(searchList);


    } else {
      setUserList([]);
      setTempUserList([]);
      getList(userData, '');
    }
  };

  //doing clear search function.................................
  const onSearchClear = () => {
    setSearch('');
    setUserList([]);
    setTempUserList([]);
    getList(userData, '');
  };

  //on user list item click...................................
  const onUserItemClick = (userId, index) => {
    setIsShowDeleteIcon(false);
    setSearch('');
    selectedUserId = userId;
    setUserId(userId);
    if (userId == '') {
      setName('');
      setUserName('');
      setPassword('');
      setConfirmPassword('');
      setUserId('');
      setRoleId('');
      getList(userData, '');
      setUserAccessList([]);
      getUserAccess(userData);
    } else {
     userList.forEach((item, i) => {
      if (i === index) {
        setIsActiveUserList(!isActiveUserList);
      }
    });
      var data = userList;
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          data[i]['isSelected'] = true;
        } else {
          data[i]['isSelected'] = false;
        }
      }


      setUserList([]);
      setTempUserList([]);
      setUserList(data);
      setTempUserList(data);
      getUserDetails(userData, userId);
    }
    // history.push({pathname :'/user',state : {'userId' : userId}});
  };
  //user access checkbox changed...............................
  const onUserAccessChanged = (index, isRead, isWrite, isDelete) => {
    const userAccList = userAccessList;
    userAccList[index]['Read'] = isRead;
    userAccList[index]['write'] = isWrite;
    userAccList[index]['Delete'] = isDelete;
    setUserAccessList([]);
    setUserAccessList(userAccList);
    // history.push({pathname :'/user',state : {'userId' : userId}});
  };

  //input validation.................................................
  const inputValidate = (value, fieldName) => {
    var errorValue;

    errorValue = inputValidator(value, fieldName);
    if (fieldName == 'confirm password') {
      errorValue = confirmPassValidate(confirmPassword, value)
    }
    if (fieldName == 'password') {
      errorValue = passValidate(password, value)
    }


    if (errorValue !== '') {
      if (fieldName == 'name') {
        errorMap.user = errorValue;
      } else if (fieldName == 'username') {
        errorMap.user_name = errorValue;
      } else if (fieldName == 'password') {
        errorMap.pass = errorValue;
      } else if (fieldName == 'confirm password') {
        errorMap.confPass = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (fieldName == 'name') {
        errorMap.user = errorValue;
      } else if (fieldName == 'username') {
        errorMap.user_name = errorValue;
      } else if (fieldName == 'password') {
        errorMap.pass = errorValue;
      } else if (fieldName == 'confirm password') {
        errorMap.confPass = errorValue;
      }
      setError(errorMap);
      return true;
    }

  };

  const confirmPassValidate = (value, pass) => {
    var errorValue;

    errorValue = confirmPasswordValidator(value, pass);

    if (errorValue !== '') {
      errorMap.confPass = errorValue;
      setError(errorMap);
      return false;
    } else {
      errorMap.confPass = errorValue;
      setError(errorMap);
      return true;
    }

  };

  const passValidate = (value, pass) => {
    var errorValue;
    errorValue = passwordValidator(value, pass);
    if (errorValue !== '') {
      errorMap.pass = errorValue;
      setError(errorMap);
      return false;
    } else {
      errorMap.pass = errorValue;
      setError(errorMap);
      return true;
    }

  };
  //on save button click............................................
  const onSaveClick = async () => {
    inputValidate(name, 'name')
    inputValidate(userName, 'username')
    dropdownValidate(selectedRoleId, 'role')

    if (!inputValidate(name, 'name')) {
      return;
    }
    if (!inputValidate(userName, 'username')) {
      return;
    }
    if (!dropdownValidate(selectedRoleId, 'role')) {
      return;
    }

    if (!isOperatorRoleUser) {
      passValidate(password, 'password')
      confirmPassValidate(confirmPassword, password)
      if (!passValidate(password, 'password')) {
        return;
      }
      if (!confirmPassValidate(confirmPassword, password)) {
        return;
      }
    }

    //validate data access atleast one selected......................
    var checkList = [];
    for (var i = 0; i < userAccessGroup.length; i++) {
      if (userAccessGroup[i]['OFlag']) {
        checkList.push(userAccessGroup[i]);
      }
    }
    if (checkList.length == 0) {
      toast.error('Atleast one data rights is mandatory.', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      return;
    }

    var mapData = {
      'Login_Id': userData.ID,
      'Name': name,
      'UserName': userName,
      'password': !isOperatorRoleUser ? password : "",
      'RoleID': selectedRoleId,
      'CreatedVersion': appVersion,
      'userAccessData': userAccessGroup,
    };
    setLoader(true);
    var result = await axiosPost(insertUserUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('User added successfully.', {
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
    inputValidate(name, 'name')
    inputValidate(userName, 'username')
    dropdownValidate(selectedRoleId, 'role')
    if (!inputValidate(name, 'name')) {
      return;
    }
    if (!inputValidate(userName, 'username')) {
      return;
    }
    if (!dropdownValidate(selectedRoleId, 'role')) {
      return;
    }
    var checkList = [];
    for (var i = 0; i < userAccessGroup.length; i++) {
      if (userAccessGroup[i]['OFlag']) {
        checkList.push(userAccessGroup[i]);
      }
    }
    if (checkList.length == 0) {
      toast.error('Atleast one data rights is mandatory.', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      return;
    }

    var mapData = {
      'Login_Id': userData.ID,
      'user_id': userId,
      'Name': name,
      'UserName': userName,
      'RoleID': selectedRoleId,
      'ModifyVersion': appVersion,
      'userAccessData': userAccessGroup
    };
    setLoader(true);
    var result = await axiosPost(updateUserUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toast.success('User updated successfully.', {
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
  function toggleModal(userId) {
    setIsOpen(!isOpen);
    if (userId == '') {
      return;
    } else {
      setUserIdForDelete(userId);
    }

  }

  //toggle model for filter .................................
  function toggleFilterModal(userId) {
    setIsFilterOpen(!isFilterOpen);
    if (userId == '') {
      return;
    } else {
      setUserIdForDelete(userId);
    }
  }


  // on filter click
  const onFilterClick = async () => {
    // 'RoleName like ''%QA%'' and statusid=1'
    var searchString = '';
    if (filterName != '') {
      searchString = `Name like '%${filterName}%'`;
    }
    if (userFilterName != '') {
      if (searchString != '') {
        searchString = searchString + ' and ';
      }
      searchString = `UserName like '%${userFilterName}%'`;
    }
    if (roleFilterId != '' && roleFilterId != 'Choose one') {
      if (searchString != '') {
        searchString = searchString + ' and ';
      }
      searchString = searchString + `RoleID=${roleFilterId}`;
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

  // on filter cancel
  const onFilterCancel = async () => {
    setFilterName('')
    setUserFilterName('')
    setRoleFilterId('')
    setStatusId('')
    toggleFilterModal()
    clearField()
    getList(userData, '');
  }

  //on delete button click............................................
  const onDeleteClick = async () => {
    setLoader(true);
    var result = await axiosGet(`${deleteUserUrl}?Login_Id=${userData.ID}&user_id=${userId}&Deleted_Version=${appVersion}`);
    setLoader(false);
    toggleModal();
    if (result != null && result['error'] == 0) {
      toast.success('User deleted successfully.', {
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

  const clearField = () => {
    errorMap.user = '';
    errorMap.user_name = '';
    errorMap.pass = '';
    errorMap.confPass = '';
    errorMap.role_id = '';
    setError(errorMap);
    setName('');
    setUserName('');
    setPassword('');
    setConfirmPassword('');
    setUserId('');
    setRoleId('');
    setStatusName('');
    setIsActive('');
    setUserAccessList([]);
    setUserAccessGroup([]);
    getList(userData, '');
    getUserAccess(userData);
    setIsShowDeleteIcon(false)
    setIsOperatorRoleUser(false);
  }

  //on back button click............................................
  const onBackClick = async () => {
    history.goBack();
  };
  // role dropdown validate.........................................
  const onRoleDropdownChange = (value) => {
    setRoleId(value);
    for (var i = 0; i < roleList.length; i++) {

      if (value.toString() == roleList[i]['ID'].toString()) {
        if (roleList[i]['IsOperatorRole']) {
          setIsOperatorRoleUser(true);
        } else {
          setIsOperatorRoleUser(false);
        }
      }
    }
    dropdownValidate(value, 'Role');
  };

  //dropdown validation.................................................
  const dropdownValidate = (value, fieldName) => {
    const errorValue = dropdownValidator(value, fieldName);
    if (errorValue !== '') {
      errorMap.role_id = errorValue;
      setError(errorMap);
      return false;
    } else {
      errorMap.role_id = errorValue;
      setError(errorMap);
      return true;
    }

  };

  const onOperationCheckChanged = (op_name, flag) => {
    var userAccess = userAccessGroup;
    for (var i = 0; i < userAccess.length; i++) {
      if (userAccess[i]['OperationLineName'] === op_name) {
        if (flag) {
          userAccess[i]['OFlag'] = 1;
          userAccess[i]['STFlag'] = 1;
        } else {
          userAccess[i]['OFlag'] = 0;
          userAccess[i]['STFlag'] = 0;
        }
      }
    }
    grouping(userAccess);
  };

  const onStationCheckChanged = (op_name, stationID, flag) => {
    var userAccess = userAccessGroup;
    for (var i = 0; i < userAccess.length; i++) {
      if (userAccess[i]['OperationLineName'] === op_name && userAccess[i]['StationID'] == stationID) {
        if (flag) {
          userAccess[i]['OFlag'] = 1;
          userAccess[i]['STFlag'] = 1;
        } else {
          // userAccess[i]['OFlag'] = 0;
          userAccess[i]['STFlag'] = 0;
        }
      }

    }
    var isAnyChecked = false;
    for (var i = 0; i < userAccess.length; i++) {
      //check all station unselected or not......................
      if (userAccess[i]['OperationLineName'] === op_name && userAccess[i]['STFlag'] == 1) {
        isAnyChecked = true;
      }
    }
    if (!isAnyChecked) {
      for (var i = 0; i < userAccess.length; i++) {
        //check all station unselected or not......................
        if (userAccess[i]['OperationLineName'] === op_name) {
          userAccess[i]['OFlag'] = 0;
        }
      }
    } else {
      for (var i = 0; i < userAccess.length; i++) {
        //check all station unselected or not......................
        if (userAccess[i]['OperationLineName'] === op_name) {
          userAccess[i]['OFlag'] = 1;
        }
      }
    }
    grouping(userAccess);
  };
  const onAddClick = () => {
    clearField()
    onUserItemClick('')
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
        {/* <div class="modal fade" id="delete_pop_modal" user="dialog"> */}
        <div className="modal-dialog custom_modal_dialog">
          <div className="modal-content" style={{ borderRadius: '0px' }}>
            <div class="modal-header">
              <h4 class="modal-title modal_title_text">Confirm Delete</h4>
              <button type="button" class="close" data-dismiss="modal" onClick={toggleModal}>&times;</button>

            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <h3 class="pop_label">Do you really want to delete this user?</h3>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group text-right" style={{ marginTop: '25px' }}>
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
        {     /*  <div id="user_filter" className="modal fade" role="dialog"> */}
        <div className="modal-dialog custom_modal_dialog">
          <div className="modal-content" style={{ borderRadius: '0px' }}>
            <div className="modal-header">
              <h4 className="modal-title">User Filter</h4>
              <button type="button" className="close" data-dismiss="modal" onClick={toggleFilterModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="custom_label">Name</label>
                    <input type="text" className="form-control" placeholder="" value={filterName} onInput={e => setFilterName(e.currentTarget.value)} />
                  </div>
                  <div className="form-group">
                    <label className="custom_label">Username</label>
                    <input type="text" className="form-control" placeholder="" value={userFilterName} onInput={e => setUserFilterName(e.currentTarget.value)} />
                  </div>
                  <div className="form-group">
                    <label className="custom_label">Role</label>
                    <select className="form-control" value={roleFilterId} onChange={e => setRoleFilterId(e.currentTarget.value)}>
                      <option>Choose one</option>
                      {roleFilterList.map(item => (
                        <option
                          key={item.ID}
                          value={item.ID}>
                          {item.RoleName}
                        </option>
                      ))}
                    </select>
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
                  <div class="form-group text-right mt-5">
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


      <Header activeId={'isUserActiveColor'} />


      <div className="az-content pd-y-0 pd-lg-y-0 pd-xl-y-0">
        <div className="container-fluid">
          <div className="az-content-left az-content-left-components" id='mySidebar'>

            <button className='wrapperrr_div_close' id="closeNavi" onClick="closenNav()">
              <i className='fa fa-times'></i>
            </button>

            {/* <button className='wrapperrr_div_close' onClick="openNav()">
              <i className='fa fa-chevron-left'></i>
            </button> */}
            {/* <button className='wrapperrr_div_open' onclick="closeNav()">
              <i className='fa fa-chevron-right'></i>
            </button> */}

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

                  <div data-toggle="modal" data-target="#delete_pop_modal" onClick={() => toggleFilterModal(userId)}>
                    <input name="type" type="radio" defaultValue="user_filter" id="user_filter" />
                    <label htmlFor="type-users">
                      <i className="fa fa-filter edit-pen-title" />
                      <span>Filter</span>
                    </label>
                  </div>
                </div>
              </div>
              {/* <nav className="nav flex-column left_menu">
                {userList.map((data, i) => (
                  <a className={data.StatusID == 1 ? "nav-link" : "nav-link text-danger"} key={i} onClick={() => onUserItemClick(data.User_Id)}>{data.Name}</a>
                ))}
              </nav> */}
              <nav className="nav flex-column left_menu">
                {userList.map((data, i) => (
                  <a className={data.StatusID != 1 ? "nav-link text-danger" : !data.isSelected ? "nav-link " : 'nav-link text-danger'} key={i} onClick={() => onUserItemClick(data.User_Id, i)} style={{ display: 'flex' }}><i class="fa fa-user-o"></i><span className='leftmenu_style'>{data.Name}</span></a>
                ))}
              </nav>
              {/* <label>Forms</label>
            <nav class="nav flex-column">
              <a href="form-elements.html" class="nav-link">Form Elements</a>
            </nav>
            <label>Charts</label>
            <nav class="nav flex-column">
              <a href="chart-chartjs.html" class="nav-link">ChartJS</a>
            </nav>

            <label>Tables</label>
            <nav class="nav flex-column">
              <a href="table-basic.html" class="nav-link">Basic Tables</a>
            </nav> */}
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
              <span>User</span>
            </div> */}
            <h2 className="az-content-title">User</h2>
            <h6 class={isActive == 1 ? "active_status" : "active_status text-danger"}>{statusName != '' ? statusName : ''}</h6>
            {/* <div class="az-content-label mg-b-5">Form Input &amp; Textarea</div>
          <p class="mg-b-20">A basic form control input and textarea with disabled and readonly mode.</p> */}
            <div className="row">
              <div className="col-3 form-group">
                <label className="custom_label">Role<span className="star_mark">*</span></label>
                <select className="form-control select2-no-search" value={selectedRoleId} onChange={e => onRoleDropdownChange(e.currentTarget.value)}>
                  <option className='choose_one'>Choose one</option>
                  {roleList.map(item => (
                    <option
                      key={item.ID}
                      value={item.ID}>
                      {item.RoleName}
                    </option>
                  ))}
                </select>
                {errors.role_id.length > 0 && <span className='error'>{errors.role_id}</span>}
              </div>
              <div className="col-3 form-group">
                <label className="custom_label">Name<span className="star_mark">*</span></label>
                <input className="form-control" placeholder="Enter Name" value={name} onInput={e => setName(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'name')} type="text" maxLength={inputMaxLength} />
                {errors.user.length > 0 && <span className='error'>{errors.user}</span>}
              </div>
              <div className="col-3 form-group">
                <label className="custom_label">Username (use for login)<span className="star_mark">*</span></label>
                <input className="form-control" placeholder="Enter Username" value={userName} onInput={e => setUserName(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'username')} type="text" maxLength={inputUserNameMaxLength} />
                {errors.user_name.length > 0 && <span className='error'>{errors.user_name}</span>}
              </div>
            </div>
            <div className="row">
              {
                isOperatorRoleUser ? (null) : (userId == '' ? (
                  <>
                    <div className="col-3 form-group">
                      <label className="custom_label">Password<span className="star_mark">*</span></label>
                      <input className="form-control" type={'password'} placeholder="Enter Password" value={password} onInput={e => setPassword(e.currentTarget.value)} onChange={(e) => passValidate(e.currentTarget.value, 'password')} maxLength={inputPasswordMaxLength} minLength={inputPasswordMinLength}/*type="Password"*/ />
                      {errors.pass.length > 0 && <span className='error'>{errors.pass}</span>}
                    </div>
                    <div className="col-3 form-group">
                      <label className="custom_label">Confirm Password<span className="star_mark">*</span></label>
                      <input className="form-control" type={'password'} placeholder="Enter Confirm Password" value={confirmPassword} onInput={e => setConfirmPassword(e.currentTarget.value)} onChange={(e) => confirmPassValidate(e.currentTarget.value, password)} /*type="Password"*/ />
                      {errors.confPass.length > 0 && <span className='error'>{errors.confPass}</span>}
                    </div>
                  </>
                ) : (null))
              }


            </div>
            <div className="row">
              <div className="col-12">
                <div className="az-content-label mg-b-5 mt-4">Data Rights</div>
                {/* <p class="mg-b-20">Add borders on all sides of the table and cells.</p> */}
                <div className="table_wrapper">
                  <div className="hack1">
                    <div className="hack2">
                      <table className="table table-bordered table-striped mg-b-15" style={{ width: '65%' }}>
                        <thead>
                          <tr>
                            <th>Operation Line</th>
                            <th>SPC Station</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userAccessList.map((data, i) => (
                            <tr key={data.OperationName ?? i}>
                              <td>
                                <label className="ckbox mg-b-5">
                                  <input
                                    type="checkbox"
                                    checked={data.stations[0]['OFlag']}
                                    onChange={() =>
                                      onOperationCheckChanged(
                                        data.OperationName,
                                        !data.stations[0]['OFlag']
                                      )
                                    }
                                  />
                                  <span>{data.OperationName}</span>
                                </label>
                              </td>

                              <td>
                                <div className="row">
                                  <div className="col-md-12">
                                    {data.stations.map((station, si) =>
                                      station.StationName != null ? (
                                        <label
                                          className="ckbox mg-b-5"
                                          key={station.StationID ?? `${data.OperationName}_${si}`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={station.STFlag}
                                            onChange={() =>
                                              onStationCheckChanged(
                                                data.OperationName,
                                                station.StationID,
                                                !station.STFlag
                                              )
                                            }
                                          />
                                          <span>{station.StationName}</span>
                                        </label>
                                      ) : null
                                    )}
                                  </div>
                                </div>
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

            {userId != '' ? (
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
                    {userId == '' && isWriteAccess ? (<button type="button" className="btn save_btn" onClick={onSaveClick}><i class='fa fa-save'></i>&nbsp; Save</button>) : (null)}
                    {userId != '' && isWriteAccess && isActive == 1 ? (<button type="button" className="btn update_btn" onClick={onUpdateClick}><i class='fa fa-save'></i>&nbsp; Update</button>) : (null)}
                    {userId != '' && isDeleteAccess && isActive == 1 ? (<button type="button" className="btn delete_btn" data-toggle="modal" data-target="#delete_pop_modal" onClick={() => toggleModal(userId)}><i class="fa fa-trash-o"></i>&nbsp; Delete</button>) : (null)}
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
export default User;