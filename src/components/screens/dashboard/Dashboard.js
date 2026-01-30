import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { emailValidator, passwordValidator, confirmPasswordValidator } from '../../utils/Validator';
import { BASE_URL, HOST } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';

const url = `${BASE_URL}/user`;
const resetUrl = `${url}/reset`;
const resetSubmitUrl = `${url}/updatePasswordWithUserId`;

const Dashboard = (props) => {


    const errorMap = {
        email: '',
        password: '',
        resetPassword: '',
        resetCPassword: ''
    };
    const [resetUserId, setResetUserId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [resetPassword, setResetPassword] = useState('');
    const [resetCPassword, setResetCPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [isForgot, setForgot] = useState(false);
    const [isLoading, setLoader] = useState(false);
    const [errors, setError] = useState(errorMap);
    const history = useHistory();

    useEffect(async () => {

        var params = queryString.parse(props.location.search);
        setResetUserId(params.resetPass);

        $(document).ready(function () {
            $("#section2").hide();

            $("#show-password-screen").click(function () {
                $("#section2").fadeIn(1000);
                $("#section1").hide();
                $(".form-control").val("");
            });

            $("#show-login-screen").click(function () {
                $("#section1").fadeIn(1000);
                $("#section2").hide();
                $(".form-control").val("");
            });

            $("#reset-password-screen").click(function () {
                $("#section2").css("display", "none");
            });
        });

    }, []);

    const handleSubmit = async () => {
        emailValidate(username);
        passValidate(password);
        if (!emailValidate(username)) {
            return;
        }
        if (!passValidate(password)) {
            return;
        }

        var mapData = {
            "email": username,
            "pass": password
        };
        setLoader(true);
        //post call..............................
        var result = await axiosPost(url, mapData);
        setLoader(false);
        if (result != null) {
            localStorage.setItem('userData', JSON.stringify(result));
            history.push('/dashboard');
        }
    };

    const handleReset = async () => {


        if (!emailValidate(resetEmail)) {
            return;
        }


        var mapData = {
            "email": resetEmail,
        };
        setLoader(true);
        var result = await axiosPost(resetUrl, mapData);
        setLoader(false);
        if (result != null) {
            toast("Reset link send to your email id.", {
                autoClose: 3000,
                hideProgressBar: true
            });

        } else {
            toast('something went wrong!', {
                autoClose: 3000,
                hideProgressBar: true
            });
        }


    };

    const handleKeypress = e => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
    };

    const handleResetSubmit = () => {

        if (!resetPassValidate(resetPassword)) {
            return;
        }
        if (!resetCPassValidate(resetCPassword)) {
            return;
        }


        var mapData = {
            "user_id": resetUserId,
            "password": resetPassword
        };
        setLoader(true);
        var result = axiosPost(resetSubmitUrl, mapData);
        setLoader(false);
        if (result != null) {
            toast("password reset successfully. Please login again.", {
                autoClose: 3000,
                hideProgressBar: true
            });
            // props.location.search = '';
            history.push('/login');
        }

    };

    const emailValidate = (value) => {
        const errorValue = emailValidator(value);
        if (errorValue !== '') {
            errorMap.email = errorValue;
            setError(errorMap);
            return false;
        } else {
            errorMap.email = errorValue;
            setError(errorMap);
            return true;
        }

    };

    const passValidate = (value) => {
        const errorValue = passwordValidator(value);
        if (errorValue !== '') {
            errorMap.password = errorValue;
            setError(errorMap);
            return false;
        } else {
            errorMap.password = errorValue;
            setError(errorMap);
            return true;
        }
    };

    const resetPassValidate = (value) => {
        const errorValue = passwordValidator(value);
        if (errorValue !== '') {
            errorMap.resetPassword = errorValue;
            setError(errorMap);
            return false;
        } else {
            errorMap.resetPassword = errorValue;
            setError(errorMap);
            return true;
        }
    };
    const resetCPassValidate = (value) => {
        const errorValue = confirmPasswordValidator(value, resetPassword);
        if (errorValue !== '') {
            errorMap.resetCPassword = errorValue;
            setError(errorMap);
            return false;
        } else {
            errorMap.resetCPassword = errorValue;
            setError(errorMap);
            return true;
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

            <div>
                <Header />
                <div className="az-content az-content-dashboard" style={{paddingTop: "0"}}>
                    <div className="container-fluid">
                        <div className="az-content-body" style={{paddingTop: "0"}}>
                            <div className="az-dashboard-one-title" style={{ display: "block", textAlign: 'center' }}>
                                <div>
                                    <img src="assets/dashboard_spc.jpg" className='img-responsive'  style={{width: "100%", opacity:"0.8"}}/>
                                    <div id="overlay"></div>
                                    {/* <h2 className="az-dashboard-title">Hi, welcome back!</h2>
                                    <p className="az-dashboard-text">Your web analytics dashboard template.</p> */}
                                </div>

                            </div>{/* az-dashboard-one-title */}




                        </div>{/* az-content-body */}
                    </div>
                </div>{/* az-content */}
                {/* <div className="az-footer ht-40">
          <div className="container ht-100p pd-t-0-f">
            <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © bootstrapdash.com 2020</span>
            <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"> Free <a href="https://www.bootstrapdash.com/bootstrap-admin-template/" target="_blank">Bootstrap admin templates</a> from Bootstrapdash.com</span>
          </div>
        </div> */}
            </div>

        </>
    );
}
export default Dashboard;