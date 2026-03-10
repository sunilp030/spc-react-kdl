import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmPasswordValidator, loginPasswordValidator, passwordValidator, oldPasswordValidator } from '../../utils/Validator';
import { BASE_URL, changePasswordTitle } from '../../utils/constants';
import Header from '../common_components/Header';
import Modal from "react-modal";
import Footer from '../common_components/Footer';
import { axiosPost } from '../framework/Axios';
import { changePasswordUrl, timeout } from '../../utils/constants';

const url = `${BASE_URL}/user/changePassword`;
// const resetUrl = `${BASE_URL}/reset`;

const ChangePassword = () => {
    const errorMap = {
        oldPassword: '',
        currentPassword: '',
        confirmPassword: '',
        confirm_password: '',
        password: '',
    };
    const [userData, setUserData] = useState({});
    const [oldPassword, setOldPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [isLoading, setLoader] = useState(false);
    const [errors, setError] = useState(errorMap);
    const history = useHistory();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isOpen, setIsOpen] = useState(true);






    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData != null) {
            setUserData(userData);
        } else {
            history.push('/login');
        }

    }, []);

    const passValidate = (value, newPass) => {
        const errorValue = oldPasswordValidator(value, newPass);
        if (errorValue !== '') {
            errorMap.oldPassword = errorValue;
            setError(errorMap);
            return false;
        } else {
            errorMap.oldPassword = errorValue;
            setError(errorMap);
            return true;
        }
    };

    const currentPassValidate = (value) => {
        passValidate(oldPassword, currentPassword);
        const errorValue = passwordValidator(value);
        if (errorValue !== '') {
            errorMap.currentPassword = errorValue;
            setError(errorMap);
            return false;
        } else {
            errorMap.currentPassword = errorValue;
            setError(errorMap);
            return true;
        }
    };
    const ConfirmPassValidate = (value) => {
        const errorValue = confirmPasswordValidator(value, currentPassword);
        if (errorValue !== '') {
            errorMap.confirmPassword = errorValue;
            setError(errorMap);
            return false;
        } else {
            errorMap.confirmPassword = errorValue;
            setError(errorMap);
            return true;
        }
    };

    const onLogoutClick = () => {
        localStorage.clear();
        history.push('/login');
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
        clearField();
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
                hideProgressBar={false}></ToastContainer>

            <Header />
            <Modal
                isOpen={isOpen}
                onRequestClose={() => toggleModal()}
            >

                <div class="modal-dialog custom_modal_dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Change Password</h4>
                            <button type="button" class="close" data-bs-dismiss="modal" onClick={() => onBackClick()}>&times;</button>
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
                                        <button type="button" class="btn cancel_btn" data-bs-dismiss="modal" onClick={() => onBackClick()}><i class="fa fa-times"></i>&nbsp; Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal>



        </>
    );
}
export default ChangePassword;