import React from 'react';
import { useEffect, useState } from 'react';
import Notification from './Notification';
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";
import { loginPasswordValidator, confirmPasswordValidator } from '../../utils/Validator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { axiosPost } from '../framework/Axios';
import Loader from "../../utils/Loader";
import { changePasswordUrl, timeout, userManualDownloadUrl } from '../../utils/constants';
import Modal from "react-modal";
import "../../../azia.js";
// import "../../../jquery.sticky.js";
// import "../../../metisMenu-active.js";
// import "../../../main.js";

Modal.setAppElement("#root");


// {head,subHeader}
const Header = ({ activeId }) => {

  const errorMap = {
    confirm_password: '',
    password: '',

  };
  const history = useHistory();
  const [isRoleAccess, setRoleAccess] = useState(false);
  const [isUserAccess, setUserAccess] = useState(false);
  const [isOperationAccess, setOperationAccess] = useState(false);
  const [isStationAccess, setStationAccess] = useState(false);
  const [isMachineAccess, setMachineAccess] = useState(false);
  const [isTemplateAccess, setTemplateAccess] = useState(false);
  const [isEventAccess, setEventAccess] = useState(false);
  const [isShiftAccess, setShiftAccess] = useState(false);
  const [isChartAccess, setChartAccess] = useState(false);
  const [isModifyAccess, setModifyAccess] = useState(false);
  const [isManagementAccess, setManagementAccess] = useState(false);
  const [isMesAccess, setMesAccess] = useState(false);
  const [isBackupAccess, setBackupAccess] = useState(false);
  const [isActiveOperation, setIsActiveOperation] = useState(false);
  const [isActiveStation, setIsActiveStation] = useState(false);
  const [isActiveMachine, setIsActiveMachine] = useState(false);
  const [isActiveTemplate, setIsActiveTemplate] = useState(false);
  const [errors, setError] = useState(errorMap);
  const [isLoading, setLoader] = useState(false);
  const [userData, setUserData] = useState({});
  const [isChangePasswordAccess, setChangePasswordAccess] = useState(false);
  const [isActiveUser, setIsActiveUser] = useState(false);
  const [isActiveRole, setIsActiveRole] = useState(false);
  const [isActiveEvent, setIsActiveEvent] = useState(false);
  const [isActiveShift, setIsActiveShift] = useState(false);

  const [isActiveManagement, setIsActiveManagement] = useState(false);
  const [isActiveModify, setIsActiveModify] = useState(false);
  const [isActiveMes, setIsActiveMes] = useState(false);
  const [isActiveBackup, setIsActiveBackup] = useState(false);
  const [isActiveChart, setIsActiveChart] = useState(false);
  const [isActiveData, setIsActiveData] = useState(false);
  const [isActiveSecurity, setIsActiveSecurity] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const loadScripts = () => {
    // This array contains all the files/CDNs 
    const dynamicScripts = [
      // 'js/jquery.sticky.js',
      // 'js/metisMenu.min.js',
      // 'js/metisMenu-active.js',
      // 'js/main.js',
      // 'js/azia.js'
    ];
    // import("../../../azia.js");

    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }
  const location = useLocation();

  useEffect(() => {
    // loadScripts();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userName = JSON.parse(localStorage.getItem('userName'));
    if (userData != null) {
      setUserData(userData);
      setUserName(userName);
      if (userData['userAccess'].length > 0) {
        for (var i = 0; i < userData['userAccess'].length; i++) {
          if (userData['userAccess'][i]['ModuleID'] == 1) {
            setRoleAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 2) {
            setUserAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 3) {
            setOperationAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 4) {
            setStationAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 5) {
            setMachineAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 6) {
            setTemplateAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 7) {
            setEventAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 8) {
            setShiftAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 9) {
            setChartAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 10) {
            setModifyAccess(userData['userAccess'][i]['Read']);
            setManagementAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 11) {
            setMesAccess(userData['userAccess'][i]['Read']);
          } else if (userData['userAccess'][i]['ModuleID'] == 17) {
            setBackupAccess(userData['userAccess'][i]['Read']);
          }
        }
      }
    }
    if (activeId == "isOperartionActiveColor") {
      setIsActiveOperation(!isActiveOperation);
    }
    if (activeId == "isEventActiveColor") {
      setIsActiveEvent(!isActiveEvent);
    }
    if (activeId == "isShiftActiveColor") {
      setIsActiveShift(!isActiveShift);
    }
    if (activeId == "isMachineActiveColor") {
      setIsActiveMachine(!isActiveMachine);
    }
    if (activeId == "isRoleActiveColor") {
      setIsActiveRole(!isActiveRole);
      setIsActiveSecurity(!isActiveSecurity);
    }
    if (activeId == "isModifyActiveColor") {
      setIsActiveModify(!isActiveModify);
      setIsActiveData(!isActiveData);
    }
    if (activeId == "isManagementActiveColor") {
      setIsActiveManagement(!isActiveManagement);
      setIsActiveData(!isActiveData);
    }
    if (activeId == "isUserActiveColor") {
      setIsActiveUser(!isActiveUser);
      setIsActiveSecurity(!isActiveSecurity);
    }
    if (activeId == "isMesActiveColor") {
      setIsActiveMes(!isActiveMes);
    }
    if (activeId == "isBackupActiveColor") {
      setIsActiveBackup(!isActiveBackup);
    }
    if (activeId == "isStationActiveColor") {
      setIsActiveStation(!isActiveStation);
    }
    if (activeId == "isTemplateActiveColor") {
      setIsActiveTemplate(!isActiveTemplate);
    }
    if (activeId == "isChartActiveColor") {
      setIsActiveChart(!isActiveChart);
    }

    // your existing code ...

    window.dispatchEvent(new Event("load"));

    // 🔹 Reinitialize azia dropdown
    setTimeout(() => {
      $('.with-sub').off('click').on('click', function (e) {
        e.preventDefault();

        const parent = $(this).parent();

        if (parent.hasClass('show')) {
          parent.removeClass('show');
          parent.find('.az-menu-sub').slideUp();
        } else {
          $('.nav-item').removeClass('show');
          $('.az-menu-sub').slideUp();

          parent.addClass('show');
          parent.find('.az-menu-sub').slideDown();
        }
      });
    }, 100);
  }, [location]);

  const onHeaderClick = (value) => {
    if (value == 'Contact') {
      history.push('/contactList');
    } else if (value == 'Company') {
      history.push('/companyList');
    } else if (value == 'Enquiry') {
      history.push('/enquiryList');
    } else if (value == 'User') {
      history.push('/userList');
    } else if (value == 'Industry') {
      history.push('/industryList');
    } else if (value == 'Segment') {
      history.push('/segmentList');
    } else if (value == 'Enquiry Type') {
      history.push('/enquiryTypeList');
    } else if (value == 'Product Category') {
      history.push('/productCategoryList');
    } else if (value == 'Product Sub-Category') {
      history.push('/productSubCategoryList');
    } else if (value == 'Enquiry Status') {
      history.push('/enquiryStatusList');
    } else if (value == 'Enquiry Category') {
      history.push('/enquiryCategoryList');
    } else if (value == 'Material Status') {
      history.push('/materialStatusList');
    } else if (value == 'Nde Category') {
      history.push('/ndeCategoryList');
    } else if (value == 'Type Of Order') {
      history.push('/typeOfOrderList');
    } else if (value == 'Bill Status') {
      history.push('/billStatusList');
    } else if (value == 'Reason For Lost') {
      history.push('/reasonForLostList');
    } else if (value == 'Reason For Cancel') {
      history.push('/reasonForCancelList');
    }
  }

  const onLogoutClick = () => {
    localStorage.clear();
    history.push('/login');
  }

  const openPdf = () => {
    var URL = userManualDownloadUrl /* http://0.0.0.0:8000/ or http://127.0.0.1:8000/; */
    window.open(URL, null);
  }


  //input validation.................................................
  const inputValidate = (value, fieldName) => {
    var errorValue;

    if (fieldName == 'password') {
      errorValue = loginPasswordValidator(value, fieldName);
    } else if (fieldName == 'confirmPassword') {
      errorValue = confirmPasswordValidator(value, password);
    }

    if (errorValue !== '') {
      if (fieldName == 'password') {
        errorMap.password = errorValue;
      } else if (fieldName == 'confirmPassword') {
        errorMap.confirm_password = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (fieldName == 'password') {
        errorMap.password = errorValue;
      } else if (fieldName == 'confirmPassword') {
        errorMap.confirm_password = errorValue;
      }
      setError(errorMap);
      return true;
    }

  };

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  const clearField = () => {
    errorMap.password = '';
    errorMap.confirm_password = '';
    setPassword('');
    setConfirmPassword('');
  }

  const changePassword = async () => {
    inputValidate(password, 'password');
    inputValidate(confirmPassword, 'confirmPassword');
    if (!inputValidate(password, 'password')) {
      return;
    }
    if (!inputValidate(confirmPassword, 'confirmPassword')) {
      return;
    }
    var mapData = {
      "Login_Id": userData.ID,
      "password": password,
    };
    setLoader(true);
    var result = await axiosPost(changePasswordUrl, mapData);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      toggleModal();
      toast.success('Password changed successfully.Please login again.', {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true
      });
      await timeout(2000);
      clearField();
      onLogoutClick();
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
      {/* <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}>
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Change Password</h4>
              <button type="button" class="close" data-bs-dismiss="modal" onClick={toggleModal}>&times;</button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group" style={{position:"relative"}}>
                    <label class="custom_label">New Password</label>
                    <input id="password-field" type="password" value={password} onInput={e => setPassword(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, "password")} class="form-control" placeholder="Password" />
                    <span toggle="#password-field" class="fa fa-fw fa-eye field-icon toggle-password"></span>
                    {errors.password.length > 0 && <span className='error'>{errors.password}</span>}
                  </div>
                  <div class="form-group" style={{position:"relative"}}>
                    <label class="custom_label">Confirm Password</label>
                    <input id="password-field1" type="password" value={confirmPassword}  onInput={e => setConfirmPassword(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, "confirmPassword")} class="form-control" placeholder="Confirm Password" />
                    <span toggle="#password-field1" class="fa fa-fw fa-eye field-icon toggle-password1"></span>
                    {errors.confirm_password.length > 0 && <span className='error'>{errors.confirm_password}</span>}
                  </div>
                  <div class="form-group text-right mt-5">
                    <button type="button" class="btn update_btn"  onClick={() => changePassword()}><i class="fa fa-paper-plane"></i>&nbsp; Change Password</button>
                    <button type="button" class="btn cancel_btn" data-bs-dismiss="modal"><i class="fa fa-times" onClick={toggleModal}></i>&nbsp; Cancel</button>
                  </div>
                </div>            
            </div>           
          </div>
        </div>
      </div>
      </Modal> */}

      <div className="az-header ">
        <div className="container-fluid">
          <div className="az-header-left">
            {/* <a href="index.html" class="az-logo"><span></span> azia</a> */}
            <a href="/#/dashboard" className="az-logo"><span /> <img src="assets/spc_logo.png" className="img-responsive" /></a>
            <a href id="azMenuShow" className="az-header-menu-icon d-lg-none"><span /></a>
          </div>{/* az-header-left */}
          <div className="az-header-menu">
            <div className="az-header-menu-header">
              <a href="/#/dashboard" className="az-logo"><span /><img src="assets/spc_logo.png" className="img-responsive" /></a>
              <a href className="close">&times;</a>
            </div>{/* az-header-menu-header */}
            <ul className="nav">
              <li className="nav-item  ">
                <a href className={isRoleAccess ? "nav-link with-sub" : "nav-link_disable"} style={{ color: isRoleAccess ? (isActiveSecurity ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveSecurity(!isActiveSecurity)}><span class="material-icons-outlined">security</span><span>Security</span></a>
                <nav className="az-menu-sub">
                  <a href={isRoleAccess ? "/#/role" : null} className="nav-link" style={{ color: isRoleAccess ? (isActiveRole ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveRole(!isActiveRole)}><i class="far fa-user-circle"></i>&nbsp;&nbsp;&nbsp;Role</a>
                  <a href={isUserAccess ? "/#/user" : null} className="nav-link" style={{ color: isUserAccess ? (isActiveUser ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveUser(!isActiveUser)}><i class="fa fa-user-o"></i>&nbsp;&nbsp;&nbsp;User</a>
                </nav>
              </li>
              <li className="nav-item">
                <a href={isOperationAccess ? "/#/operationLine" : null} className={isOperationAccess ? "nav-link" : "nav-link_disable"} style={{ color: isOperationAccess ? (isActiveOperation ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveOperation(!isActiveOperation)} ><span class="material-icons-outlined">settings</span><span>Operation Line</span></a>
              </li>
              <li className="nav-item">
                <a href={isStationAccess ? "/#/station" : null} className={isStationAccess ? "nav-link" : "nav-link_disable"} style={{ color: isStationAccess ? (isActiveStation ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveStation(!isActiveStation)} ><span class="material-icons-outlined">account_balance</span><span>SPC Station</span></a>
              </li>
              <li className="nav-item">
                <a href={isMachineAccess ? "/#/machine" : null} className={isMachineAccess ? "nav-link" : "nav-link_disable"} style={{ color: isMachineAccess ? (isActiveMachine ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveMachine(!isActiveMachine)} ><span class="material-icons-outlined">desktop_windows</span><span>Machine</span></a>
              </li>
              <li className="nav-item">
                <a href={isTemplateAccess ? "/#/template" : null} className={isTemplateAccess ? "nav-link" : "nav-link_disable"} style={{ color: isTemplateAccess ? (isActiveTemplate ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveTemplate(!isActiveTemplate)} ><span class="material-icons-outlined">description</span><span>Template</span></a>
              </li>
              <li className="nav-item">
                <a href={isEventAccess ? "/#/event" : null} className={isEventAccess ? "nav-link" : "nav-link_disable"} style={{ color: isEventAccess ? (isActiveEvent ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveEvent(!isActiveEvent)}><span class="material-icons-outlined">date_range</span><span>Event</span></a>
              </li>
              <li className="nav-item">
                <a href={isShiftAccess ? "/#/shift" : null} className={isShiftAccess ? "nav-link" : "nav-link_disable"} style={{ color: isShiftAccess ? (isActiveShift ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveShift(!isActiveShift)}><span class="material-icons-outlined">watch_later</span><span>Shift</span></a>
              </li>
              <li className="nav-item">
                <a href={isChartAccess ? "/#/chart" : null} className={isChartAccess ? "nav-link" : "nav-link_disable"} style={{ color: isChartAccess ? (isActiveChart ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveChart(!isActiveChart)}><span class="material-icons-outlined">insert_chart_outlined</span><span>Chart</span></a>
              </li>
              <li className="nav-item">
                <a href className={isManagementAccess ? "nav-link with-sub" : "nav-link_disable"} style={{ color: isManagementAccess ? (isActiveData ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveData(!isActiveData)}><span class="material-icons-outlined">data_usage</span><span>Data</span></a>
                <nav className="az-menu-sub">
                  <a href={isManagementAccess ? "/#/management" : null} className="nav-link" style={{ color: isManagementAccess ? (isActiveManagement ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveManagement(!isActiveManagement)}>Data Management</a>
                  <a href={isModifyAccess ? "/#/modify" : null} className="nav-link" style={{ color: isModifyAccess ? (isActiveModify ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveModify(!isActiveModify)}>Modify</a>
                </nav>
              </li>
              <li className="nav-item">
                <a href={isMesAccess ? "/#/mes" : null} className={isMesAccess ? "nav-link" : "nav-link_disable"} style={{ color: isMesAccess ? (isActiveMes ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveMes(!isActiveMes)}><span class="material-icons-outlined">pages</span><span>MES</span></a>
              </li>

              <li className="nav-item">
                <a href={isBackupAccess ? "/#/backup" : null} className={isBackupAccess ? "nav-link" : "nav-link_disable"} style={{ color: isBackupAccess ? (isActiveBackup ? '#e12503' : '#1c273c') : '#b5b5b5' }} onClick={() => setIsActiveBackup(!isActiveBackup)}><span class="material-icons-outlined">backup</span><span>Backup</span></a>
              </li>
            </ul>
          </div>
          <div className="az-header-right">
            <div className=" az-header-notification mx-3">
              <a href={userManualDownloadUrl} onClick={openPdf} target="_blank" class="button"><i className="fas fa-question-circle" /></a>
            </div>
            <div className="dropdown az-profile-menu">
              {/* <a href className="az-img-user"><i className="fas fa-user-circle" /></a> */}
              {/* <a href className="user-profile-img az-img-user "><h6>{userName.slice(0, 1).toUpperCase()}</h6></a> */}
              <a
                href="#"
                className="user-profile-img az-img-user"
                onClick={(e) => {
                  e.preventDefault();
                  setIsProfileOpen(!isProfileOpen);
                }}
              >
                <h6>{userName.slice(0, 1).toUpperCase()}</h6>
              </a>
          

            <div className={`dropdown-menu ${isProfileOpen ? "show" : ""}`}>
              <div className="az-dropdown-header d-sm-none">
                <a
                  className="az-header-arrow"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <i className="icon ion-md-arrow-back" />
                </a>
              </div>

              <a href="/#/changepassword" className="dropdown-item">
                <i className="typcn typcn-lock-closed" /> Change Password
              </a>

              <a
                className="dropdown-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogoutClick();
                }}
              >
                <i className="typcn typcn-power" /> Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div >

      <div id="changepassword" class="modal fade" role="dialog">
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Change Password</h4>
              <button type="button" class="close" data-bs-dismiss="modal" onClick={() => clearField()}>&times;</button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group" style={{ position: "relative" }}>
                    <label class="custom_label">New Password</label>
                    <input id="password-field" type="password" value={password} onInput={e => setPassword(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, "password")} class="form-control" placeholder="Password" />
                    <span toggle="#password-field" class="fa fa-fw fa-eye field-icon toggle-password"></span>
                    {errors.password.length > 0 && <span className='error'>{errors.password}</span>}
                  </div>
                  <div class="form-group" style={{ position: "relative" }}>
                    <label class="custom_label">Confirm Password</label>
                    <input id="password-field1" type="password" value={confirmPassword} onInput={e => setConfirmPassword(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, "confirmPassword")} class="form-control" placeholder="Confirm Password" />
                    <span toggle="#password-field1" class="fa fa-fw fa-eye field-icon toggle-password1"></span>
                    {errors.confirm_password.length > 0 && <span className='error'>{errors.confirm_password}</span>}
                  </div>
                  <div class="form-group text-right mt-5">
                    <button type="button" class="btn update_btn" onClick={() => changePassword()}><i class="fa fa-paper-plane"></i>&nbsp; Change Password</button>
                    <button type="button" class="btn cancel_btn" data-bs-dismiss="modal"><i class="fa fa-times"></i>&nbsp; Cancel</button>
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
export default Header;

