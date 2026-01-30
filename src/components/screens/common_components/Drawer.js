import React from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";



const Drawer = ({ head, userId }) => {
    const history = useHistory();

    const loadScripts = () => {
        // This array contains all the files/CDNs 
        const dynamicScripts = [
            'js/jquery.sticky.js',
            'js/metisMenu.min.js',
            'js/metisMenu-active.js',
            'js/main.js'
        ];

        for (let i = 0; i < dynamicScripts.length; i++) {
            const node = document.createElement('script');
            node.src = dynamicScripts[i];
            node.type = 'text/javascript';
            node.async = false;
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }

    useEffect(() => {
        loadScripts();
    }, []);

    const onRedirect = (path) => {
        history.push({ pathname: path, state: { 'isSearchClear': true } });
    }

    return (
        <>
            <div class="left-sidebar-pro">
                <nav id="sidebar" class="">
                    <div class="sidebar-header">
                        <a href="index.html"><img class="main-logo" src="assets/logo.png" alt="" /></a>
                        <strong><a href="index.html"><img src="assets/logosn.png" alt="" /></a></strong>
                    </div>
                    <div class="left-custom-menu-adp-wrap comment-scrollbar">
                        <nav class="sidebar-nav left-sidebar-menu-pro">
                            <ul class="metismenu" id="menu1">
                                <li>
                                    <a href="/#/dashboard" aria-expanded="false" title="Dashboard"><span class="material-icons sub-icon-mg" aria-hidden="true">dashboard</span> <span class="mini-click-non">Dashboard</span></a>
                                </li>
                                <li>
                                    <a onClick={() => onRedirect('/companyList')} aria-expanded="false" title="Company"><span class="material-icons sub-icon-mg" aria-hidden="true">business</span> <span class="mini-click-non">Company</span></a>
                                </li>
                                <li>
                                    <a onClick={() => onRedirect('/contactList')} aria-expanded="false" title="Contact"><span class="material-icons sub-icon-mg" aria-hidden="true">add_ic_call</span> <span class="mini-click-non">Contact</span></a>
                                </li>
                                <li>
                                    <a onClick={() => onRedirect('/enquiryList')} aria-expanded="false" title="Enquiry"><span class="material-icons sub-icon-mg" aria-hidden="true">record_voice_over</span> <span class="mini-click-non">Enquiry</span></a>
                                </li>
                                <li>
                                    <a onClick={() => onRedirect('/report')} aria-expanded="false" title="Report"><span class="material-icons sub-icon-mg" aria-hidden="true">receipt</span> <span class="mini-click-non">Report</span></a>
                                </li>
                                <li>
                                    <a class="has-arrow" href="#" aria-expanded="false" title="Masters"><span class="material-icons sub-icon-mg">border_color</span> <span class="mini-click-non">Masters</span></a>
                                    <ul class="submenu-angle" aria-expanded="false">

                                        <li><a onClick={() => onRedirect('/industryList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Industry</span></a></li>
                                        <li><a onClick={() => onRedirect('/segmentList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Segment</span></a></li>
                                        <li><a onClick={() => onRedirect('/enquiryTypeList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Enquiry Type</span></a></li>

                                        <li><a onClick={() => onRedirect('/productCategoryList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Product Category</span></a></li>
                                        <li><a onClick={() => onRedirect('/productSubCategoryList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Product Sub-Category</span></a></li>
                                        <li><a onClick={() => onRedirect('/enquiryStatusList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Enquiry Status</span></a></li>
                                        <li><a onClick={() => onRedirect('/enquiryCategoryList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Enquiry Category</span></a></li>
                                        <li><a onClick={() => onRedirect('/materialStatusList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Material Status</span></a></li>
                                        <li><a onClick={() => onRedirect('/ndeCategoryList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">NDE Category</span></a></li>
                                        <li><a onClick={() => onRedirect('/typeOfOrderList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Type of Order</span></a></li>
                                        <li><a onClick={() => onRedirect('/billStatusList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Bill Status</span></a></li>
                                        <li><a onClick={() => onRedirect('/reasonForLostList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Reason for Lost</span></a></li>
                                        <li><a onClick={() => onRedirect('/reasonForCancelList')} aria-expanded="false"><span class="material-icons sub-icon-mg" aria-hidden="true">keyboard_arrow_right</span> <span class="mini-click-non">Reason for Cancellation</span></a></li>
                                    </ul>
                                </li>
                                <li>
                                    <a class="has-arrow" href="#" aria-expanded="false" title="Security"><span class="material-icons sub-icon-mg">lock</span> <span class="mini-click-non">Security</span></a>
                                    <ul class="submenu-angle" aria-expanded="false">
                                        <li><a title="User" onClick={() => onRedirect('/userList')}><span class="mini-sub-pro">User</span></a></li>
                                        <li><a title="Change Password" href="/#/changePassword"><span class="mini-sub-pro">Change Password</span></a></li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </nav>
            </div>
        </>
    );
}
export default Drawer;