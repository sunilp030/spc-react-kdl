import React from 'react';
import axios from "axios";
import Loader from "../../utils/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function axiosPost(url, mapData, header) {
    var result;
    await axios
        .post(url, mapData, header != null ? { headers: header } : null)
        .then((res) => {
            result = res.data;
        })
        .catch((err) => {
            if (err.response.data != null) {
                toast(err.response.data.msg);
                result = null;
            } else {
                toast(err);
                result = null;
            }
        });
    return result;
}

export async function axiosGet(url, params) {
    var result;
    var header = {
        'Cache-Control': 'max-age=0'
    };

    await axios
        .get(url, params != null ? { params: params } : null, { headers: header })
        .then((res) => {
            result = res.data;
        })
        .catch((err) => {
            if (err.response.data != null) {
                alert(err.response.data.msg);
                result = null;
            } else {
                alert(err);
                result = null;
            }
        });
    return result;
}

export async function axiosGetFile(url) {
    var result;

    await axios({
        url: url,
        method: 'GET',
        responseType: 'blob' //important
    }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
        result = res.data;
    })
        .catch((err) => {
            if (err.response.data != null) {
                alert(err.response.data.msg);
                result = null;
            } else {
                alert(err);
                result = null;
            }
        });
    return result;
}