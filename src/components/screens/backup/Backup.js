import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, dropdownValidator, inputWithRangeValidator } from '../../utils/Validator';
import { backupDetailsUrl } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal from "react-modal";

Modal.setAppElement("#root");

const Backup = (props) => {


    const errorMap = {
        event_no: '',
        event_name: '',
        no_of_reading: '',
    };
    const [userData, setUserData] = useState({});
    const [backupDetails, setBackupDetails] = useState([]);
    const [isLoading, setLoader] = useState(false);
    const history = useHistory();
    const [backupID, setBackupId] = useState('');
    const [isWriteAccess, setWriteAccess] = useState(false);
    const [isDeleteAccess, setDeleteAccess] = useState(false);

    useEffect(async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData != null) {
            setUserData(userData);
            if (userData['userAccess'].length > 0) {
                for (var i = 0; i < userData['userAccess'].length; i++) {
                    if (userData['userAccess'][i]['ModuleID'] == 17) {
                        if (userData['userAccess'][i]['Read']) {
                            setWriteAccess(userData['userAccess'][i]['Write']);
                            setDeleteAccess(userData['userAccess'][i]['Delete']);
                        } else {
                            toast('You do not have access to view this page.', {
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
            setBackupId(props.location.state.backupId);
        }
        getBackupDetails();

    }, []);
    // api call for event details........................
    const getBackupDetails = async () => {
        setLoader(true);
        var result = await axiosGet(`${backupDetailsUrl}`);
        setLoader(false);
        if (result != null && result['error'] == 0) {
            if (result['data'] != null) {
                setBackupDetails(result['data']);
            }

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
                hideProgressBar={false} />

                 <Header activeId={'isBackupActiveColor'}/>


            <div className="az-content pd-y-0 pd-lg-y-0 pd-xl-y-0">
                <div className="container-fluid">
                    <div className="az-content-body d-flex flex-column" id="main">
                        {/* <div className="az-content-breadcrumb">
                            <span>Dashboard</span>
                            <span>Backup</span>
                        </div> */}
                        <h2 className="az-content-title">Backup</h2>
                        {/* <div class="az-content-label mg-b-5">Form Input &amp; Textarea</div>
          <p class="mg-b-20">A basic form control input and textarea with disabled and readonly mode.</p> */}
                        <div className="row" style={{ borderBottom: '1px solid #b7b7b7' }}>
                            <div className="col-md-4 text-left">
                                <a href="#" className="btn btn-danger" style={{ borderRadius: '20px', backgroundColor: '#07c750' }}><i className="typcn typcn-download" style={{ fontSize: '18px', lineHeight: 1 }} /> Backup Now</a>
                            </div>
                            <div className="col-md-4 text-center">
                                <h6 style={{ color: '#bbbbbb' }}>Last Backup Date</h6>
                                <h2 className="mg-b-5">23 May 11.10AM</h2>
                            </div>
                            {/* <div className="col-md-4 text-right">
                                <a href="#" className="btn btn-danger" style={{ borderRadius: '20px', backgroundColor: '#07c750' }}><i className="typcn typcn-download" style={{ fontSize: '18px', lineHeight: 1 }} /> Backup Now</a>
                            </div> */}
                        </div>
                        <div className="form-group" style={{ padding: '10px 10px' }}>
                            <div className="az-content-label mg-b-15">Backup Details</div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="table_wrapper">
                                        <div className="hack1">
                                            <div className="hack2">
                                                <table className="table table-bordered mg-b-15" style={{ width: '60%' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Date Time</th>
                                                            <th>Status</th>
                                                            <th>Note</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {backupDetails.map((data, i) => (
                                                            <tr key={Math.random()}>
                                                                <td>{data.datetime}</td>
                                                                <td className="text-suceess-color">{data.Status}</td>
                                                                <td className="text-suceess-color">{data.Note}</td>
                                                            </tr>
                                                        ))}

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <hr className="mg-y-15" />
                        <div className="az-footer mg-t-auto" id="az_footer_id" style={{left:'0px',width:'100%',padding:'15px 15px 15px 15px'}}>
                            <div className="container-fluid">
                                <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Version : 1.0.0 Build 20220511</span>
                                <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"> Copyright © 2022 | All Rights Reserved</span>
                            </div>{/* container */}
                        </div>{/* az-footer */}
                    </div>{/* az-content-body */}
                </div>{/* container */}
            </div>{/* az-content */}

        </>
    );
}
export default Backup;