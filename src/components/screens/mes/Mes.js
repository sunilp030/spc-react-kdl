import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { inputValidator, dropdownValidator, inputWithRangeValidator } from '../../utils/Validator';
import { stationListUrl, eventListUrl, eventAccessUrl, mesDetailsUrl, eventDetailsUrl, updateEventUrl, deleteEventUrl, appVersion, NA, inputMaxLength, statusActionId, fillListUrl } from '../../utils/constants';
import queryString from 'query-string';
import $ from "jquery";
import { axiosGet, axiosPost } from '../framework/Axios';
import Header from '../common_components/Header';
import Footer from '../common_components/Footer';
import moment from 'moment';
import Modal from "react-modal";

Modal.setAppElement("#root");

const Mes = (props) => {


  const errorMap = {

  };
  const [userData, setUserData] = useState({});
  const [mesId, setMesId] = useState({});
  const [mesDetails, setMesDetails] = useState([]);
  const [isLoading, setLoader] = useState(false);
  const [errors, setError] = useState(errorMap);
  const history = useHistory();
  const [isWriteAccess, setWriteAccess] = useState(false);
  const [isDeleteAccess, setDeleteAccess] = useState(false);
  const [isActive, setIsActive] = useState('');
  const [statusName, setStatusName] = useState('');


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
              toast('You do not have access to view this page.', {
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
      setMesId(props.location.state.mesId);
    }
    getMesDetails();
  }, []);

  // api call for mes details........................
  const getMesDetails = async () => {
    setLoader(true);
    var result = await axiosGet(`${mesDetailsUrl}`);
    setLoader(false);
    if (result != null && result['error'] == 0) {
      if (result['data'] != null) {
        setMesDetails(result['data']);
      }

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

      <Header activeId={'isMesActiveColor'} />


      <div className="az-content pd-y-0 pd-lg-y-0 pd-xl-y-0">
        <div className="container-fluid">
          <div className="az-content-body d-flex flex-column" id="main">
            <h2 className="az-content-title">MES</h2>
            <div className="row" style={{ borderBottom: '1px solid #b7b7b7' }}>
              <div className="col-md-4">
                <div className="row">
                  
                  <div className="col-md-5">
                    <a href="#" className="btn btn-success" style={{ borderRadius: '20px', backgroundColor: '#07c750' }}><i className="typcn typcn-arrow-sync" style={{ fontSize: '18px', lineHeight: 1 }} /> Sync Now</a>
                  </div>
                </div>
                <p style={{ display: 'flex', margin: '10px 0px' }}>Sync Frequency Every <input type="text" name className="form-control" defaultValue={10} style={{ width: '50px', margin: '0px 5px', height: '23px' }} /> mins.</p>
              </div>
              <div className="col-md-4 text-center">
                <h6 style={{ color: '#bbbbbb' }}>Last Sync Date</h6>
                <h2 className="mg-b-0">23 May 11.10AM</h2>
              </div>
              <div className="col-md-4 text-right typcn-arrow-sync_btn">
                <a href="#" className="btn btn-danger" style={{ borderRadius: '20px' }}><i className="typcn typcn-arrow-sync" style={{ fontSize: '18px', lineHeight: 1 }} /> Start / Stop Sync</a>
              </div>
              
            </div>
            <div className="form-group" style={{ padding: '10px 10px' }}>
              <div className="az-content-label mg-b-15">Log Details</div>
              <div className="row">
                <div className="col-md-12">
                  <div className="table_wrapper">
                    <div className="hack1">
                      <div className="hack2">
                        <table className="table table-bordered mg-b-15 table_width_60">
                          <thead>
                            <tr>
                              <th>Date Time</th>
                              <th>Status</th>
                              <th>Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mesDetails.map((data, i) => (
                              <tr key={data.datetime ?? i}>
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
            <div className="az-footer mg-t-auto" id="az_footer_id" style={{ left: '0px', width: '100%', padding: '15px 15px 15px 15px' }}>
              <div className="container-fluid">
                <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Version : 1.0.0 Build 20220511</span>
                <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"> Copyright © 2022 | All Rights Reserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Mes;