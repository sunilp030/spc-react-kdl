import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usernameValidator, loginPasswordValidator, confirmPasswordValidator } from '../../utils/Validator';
import { verifyEndPointUrl } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosPost } from '../framework/Axios';

const Login = (props) => {


    const errorMap = {
        email: '',
        password: '',
        resetPassword: '',
        resetCPassword: ''
    };
    const [resetUserId, setResetUserId] = useState('');
    const [resetPassword, setResetPassword] = useState('');
    const [resetCPassword, setResetCPassword] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
        loginPasswordValidate(password);
        if (!emailValidate(username)) {
            return;
        }
        if (!loginPasswordValidate(password)) {
            return;
        }

        var mapData = {
            "Username": username,
            "password": password
        };
        setLoader(true);
        //post call..............................
        var result = await axiosPost(verifyEndPointUrl, mapData);
        setLoader(false);
        if (result != null && result['error'] == 0) {
            localStorage.setItem('userData', JSON.stringify(result['data']));
            localStorage.setItem('userName', JSON.stringify(result['data']['UserName']));
            history.push('/dashboard');
        } else {
            toast.error(result['msg'], {
                theme: "colored",
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

    const emailValidate = (value) => {
        const errorValue = usernameValidator(value);
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

    const loginPasswordValidate = (value) => {
        const errorValue = loginPasswordValidator(value);
        // const errorValue = '';
        // if(value ==''){
        //      errorValue = 'Password can not be blank.';
        // }
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
        const errorValue = loginPasswordValidator(value);
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
            <div class="az-body">
                <div class="az-signin-wrapper">
                    <div class="az-card-signin">
                        <h1 class="az-logo"><img src="assets/spc_logo1.png" class=" " /><br /><br /> QA/S SPC</h1>

                        <div class="az-signin-header">
                            <h2>Welcome back!</h2>
                            <h4>Please sign in to continue</h4>

                            <form action="index.html">
                                <div class="form-group">
                                    <label>Username</label>
                                    <input type="text" class="form-control" placeholder="Enter your username" onInput={e => setUsername(e.target.value)} onChange={e => emailValidate(e.target.value)} />
                                    {errors.email.length > 0 && <div class="row"><div class="col-md-12 text-left"><span className='error'>{errors.email}</span></div></div>}
                                </div>
                                <div class="form-group">
                                    <label>Password</label>
                                    <input type="password" class="form-control" placeholder="Enter your password" onKeyDown={handleKeypress} onInput={e => setPassword(e.target.value)} onChange={e => loginPasswordValidate(e.target.value)} />
                                    {errors.password.length > 0 && <div class="row"><div class="col-md-12 text-left"><span className='error'>{errors.password}</span></div></div>}
                                </div>
                                <a class="btn btn-az-primary btn-block" onClick={() => handleSubmit()}>Sign In</a>
                                <p className='version_class_new'>V2.1 Build 202208</p>
                            </form>
                        </div>
                        <div class="az-signin-footer">
                            {/* <p><a href="">Forgot password?</a></p> */}
                            {/* <p>Don't have an account? <a href="SignUp.html">Create an Account</a></p> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login;