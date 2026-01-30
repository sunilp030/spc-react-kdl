

// export const BASE_URL = "http://localhost:9000";
export const BASE_URL = "http://103.25.126.207:8116/api";
// export const BASE_URL = "http://192.168.3.156:9000";

// export const BASE_URL = "http://192.168.3.59:9000";
// export const BASE_URL = "http://192.168.18.239:9000";

// export const BASE_URL = "http://192.168.1.103:9000";
// export const BASE_URL = "http://192.168.3.11:8101/api";
// export const BASE_URL = "http://202.189.254.89:8084/api";
// export const BASE_URL = "https://crm.benchmarksolution.com/api";
//dev url.......................................................
// export var BASE_URL = `http://${window.location.host}:9000`;
// prod url with HTTPS.....................................................
// export var BASE_URL = `https://${window.location.host}/api`;
// prod url with HTTP only.....................................................
// export var BASE_URL = `http://${window.location.host}/api`;





export const authUrl = `${BASE_URL}/auth`;
export const utilUrl = `${BASE_URL}/common`;
export const roleUrl = `${BASE_URL}/role`;
export const userUrl = `${BASE_URL}/user`;
export const operationUrl = `${BASE_URL}/operation`;
export const stationUrl = `${BASE_URL}/station`;
export const machineUrl = `${BASE_URL}/machine`;
export const eventUrl = `${BASE_URL}/event`;
export const templateUrl = `${BASE_URL}/template`;
export const shiftUrl = `${BASE_URL}/shift`;
export const chartUrl = `${BASE_URL}/chart`;
export const modifyUrl = `${BASE_URL}/modify`;
export const managementUrl = `${BASE_URL}/management`;
export const mesUrl = `${BASE_URL}/mes`;
export const backupUrl = `${BASE_URL}/backup`;






//get fill list for dropdown................
export const fillListUrl = `${utilUrl}/getFillList`;
//get user manual pdf download................
export const userManualDownloadUrl = `${utilUrl}/userManualDownload`;
//verify user........................................
export const verifyEndPointUrl = `${authUrl}/verify`;
export const changePasswordUrl = `${authUrl}/changePassword`;

//role module url....................................
export const roleListUrl = `${roleUrl}/getRoleList`;
export const roleAccessUrl = `${roleUrl}/getDefaultRole`;
export const insertRoleUrl = `${roleUrl}/insertRole`;
export const roleDetailsUrl = `${roleUrl}/getRoleDetails`;
export const updateRoleUrl = `${roleUrl}/updateRole`;
export const deleteRoleUrl = `${roleUrl}/deleteRole`;
//user module url.....................................
export const userListUrl = `${userUrl}/getUserList`;
export const userAccessUrl = `${userUrl}/getDefaultUser`;
export const insertUserUrl = `${userUrl}/insertUser`;
export const userDetailsUrl = `${userUrl}/getUserDetails`;
export const updateUserUrl = `${userUrl}/updateUser`;
export const deleteUserUrl = `${userUrl}/deleteUser`;
//operation line module url.....................................
export const operationListUrl = `${operationUrl}/getOperationList`;
export const operationAccessUrl = `${operationUrl}/getDefaultOperation`;
export const insertOperationUrl = `${operationUrl}/insertOperation`;
export const operationDetailsUrl = `${operationUrl}/getOperationDetails`;
export const updateOperationUrl = `${operationUrl}/updateOperation`;
export const deleteOperationUrl = `${operationUrl}/deleteOperation`;
//station module url.....................................
export const stationListUrl = `${stationUrl}/getStationList`;
export const stationAccessUrl = `${stationUrl}/getDefaultStation`;
export const insertStationUrl = `${stationUrl}/insertStation`;
export const stationDetailsUrl = `${stationUrl}/getStationDetails`;
export const updateStationUrl = `${stationUrl}/updateStation`;
export const deleteStationUrl = `${stationUrl}/deleteStation`;
//machine module url.....................................
export const machineListUrl = `${machineUrl}/getMachineList`;
export const machineAccessUrl = `${machineUrl}/getDefaultMachine`;
export const insertMachineUrl = `${machineUrl}/insertMachine`;
export const machineDetailsUrl = `${machineUrl}/getMachineDetails`;
export const updateMachineUrl = `${machineUrl}/updateMachine`;
export const deleteMachineUrl = `${machineUrl}/deleteMachine`;
//event module url.....................................
export const eventListUrl = `${eventUrl}/getEventList`;
export const eventAccessUrl = `${eventUrl}/getDefaultEvent`;
export const insertEventUrl = `${eventUrl}/insertEvent`;
export const eventDetailsUrl = `${eventUrl}/getEventDetails`;
export const updateEventUrl = `${eventUrl}/updateEvent`;
export const deleteEventUrl = `${eventUrl}/deleteEvent`;
//template module url.....................................
export const templateListUrl = `${templateUrl}/getTemplateList`;
export const templateAccessUrl = `${templateUrl}/getDefaultTemplate`;
export const insertTemplateUrl = `${templateUrl}/insertTemplate`;
export const templateDetailsUrl = `${templateUrl}/getTemplateDetails`;
export const updateTemplateUrl = `${templateUrl}/updateTemplate`;
export const deleteTemplateUrl = `${templateUrl}/deleteTemplate`;
export const insertGaugeUrl = `${templateUrl}/insertGauge`;
export const updateGaugeUrl = `${templateUrl}/updateGauge`;
export const deleteGaugeUrl = `${templateUrl}/deleteGaugeSource`;
export const gaugeDetailsUrl = `${templateUrl}/getGaugeSourceDetails`;
export const imgConfigUrl = `${templateUrl}/getImageConfig`;
export const goldenRuleListUrl = `${templateUrl}/getGoldenRuleList`;

//shift module url.....................................
export const shiftListUrl = `${shiftUrl}/getShiftList`;
export const shiftAccessUrl = `${shiftUrl}/getDefaultShift`;
export const insertShiftUrl = `${shiftUrl}/insertShift`;
export const shiftDetailsUrl = `${shiftUrl}/getShiftDetails`;
export const shiftDefaultDetailsUrl = `${shiftUrl}/getShiftDefaultDetails`;
export const updateShiftUrl = `${shiftUrl}/updateShift`;
export const deleteShiftUrl = `${shiftUrl}/deleteShift`;
//chart module url.....................................
export const chartListUrl = `${chartUrl}/getChartList`;
export const chartDataUrl = `${chartUrl}/getChartData`;
export const getXlsUrl = `${chartUrl}/exportsToExcel`;
export const getMesUrl = `${chartUrl}/exportsToMes`;
//modify module url.....................................
export const modifyListUrl = `${modifyUrl}/getModifyList`;
export const modifyDataUrl = `${modifyUrl}/getModifyData`;
export const updateModifyUrl = `${modifyUrl}/updateModify`;
//management module url.....................................
export const managementListUrl = `${managementUrl}/getManagementList`;
export const managementAccessUrl = `${managementUrl}/getDefaultManagement`;
export const managementDetailsUrl = `${managementUrl}/getManagementDetails`;
export const deleteManagementUrl = `${managementUrl}/deleteManagement`;
//mes module url.....................................
export const mesDetailsUrl = `${mesUrl}/getMesDetails`;
//backup module url.....................................
export const backupDetailsUrl = `${backupUrl}/getBackupDetails`;



export const appVersion = '1.0.0';
export const buildNumber = '20220511';
export const NA = 'NA';
export const characterActionId = '8';
export const unitActionId = '9';
export const gaugeSourceActionId = '10';
export const optionActionId = '11';
export const comActionId = '12';
export const channelActionId = '13';
export const inputMaxLength = '50';
export const inputUserNameMaxLength = '50';
export const inputPasswordMaxLength = '15';
export const inputPasswordMinLength = '8';
export const inputSpcStationNoMaxLength = '10';
export const statusActionId = '15';
export const roleActionId = '16';
export const stationActionId = '22';
export const machineActionId = '23';
export const operationActionId = '17';
export const templateActionId = '5';
export const palletActionId = '3';
export const charactersticActionId = '18';
export const eventActionId = '26';
export const exportOptionActionId = '19';
export const managementActionId = '2'; //
export const spcFilterOperationActionId = '21';
export const spcFilterStationActionId = '20';
export const stationAccordingToOperationActionId = '24';
export const stationWithOperationActionId = '25';
export const machinePalletActionId = '27';
export const operationTemplateActionId = '28';
export const formulaTemplateActionId = '32';











export const pagingPerPageSize = 10;
export const companyTitle = "Company";
export const addCompanyTitle = "Add Company";
export const editCompanyTitle = "Edit Company";


export const contactTitle = "Contact";
export const addContactTitle = "Add Contact";
export const editContactTitle = "Edit Contact";


export const enquiryTitle = "Enquiry";
export const addEnquiryTitle = "Add Enquiry";
export const editEnquiryTitle = "Edit Enquiry";


export const userTitle = "User";
export const addUserTitle = "Add User";
export const editUserTitle = "Edit User";

export const productCategoryTitle = "Product Category";
export const addProductCategoryTitle = "Add Product Category";
export const editProductCategoryTitle = "Edit Product Category";

export const productSubCategoryTitle = "Product Sub-Category";
export const addProductSubCategoryTitle = "Add Product Sub-Category";
export const editProductSubCategoryTitle = "Edit Product Sub-Category";

export const industryTitle = "Industry";
export const addIndustryTitle = "Add Industry";
export const editIndustryTitle = "Edit Industry";

export const segmentTitle = "Segment";
export const addSegmentTitle = "Add Segment";
export const editSegmentTitle = "Edit Segment";

export const enquiryTypeTitle = "Enquiry Type";
export const addEnquiryTypeTitle = "Add Enquiry Type";
export const editEnquiryTypeTitle = "Edit Enquiry Type";

export const enquiryStatusTitle = "Enquiry Status";
export const addEnquiryStatusTitle = "Add Enquiry Status";
export const editEnquiryStatusTitle = "Edit Enquiry Status";

export const enquiryCategoryTitle = "Enquiry Category";
export const addEnquiryCategoryTitle = "Add Enquiry Category";
export const editEnquiryCategoryTitle = "Edit Enquiry Category";

export const materialStatusTitle = "Material Status";
export const addMaterialStatusTitle = "Add Material Status";
export const editMaterialStatusTitle = "Edit Material Status";

export const ndeCategoryTitle = "Nde Category";
export const addNdeCategoryTitle = "Add Nde Category";
export const editNdeCategoryTitle = "Edit Nde Category";

export const typeOfOrderTitle = "Type Of Order";
export const addTypeOfOrderTitle = "Add Type Of Order";
export const editTypeOfOrderTitle = "Edit Type Of Order";

export const billStatusTitle = "Bill Status";
export const addBillStatusTitle = "Add Bill Status";
export const editBillStatusTitle = "Edit Bill Status";

export const reasonForLostTitle = "Reason For Lost";
export const addReasonForLostTitle = "Add Reason For Lost";
export const editReasonForLostTitle = "Edit Reason For Lost";

export const reasonForCancelTitle = "Reason For Cancel";
export const addReasonForCancelTitle = "Add Reason For Cancel";
export const editReasonForCancelTitle = "Edit Reason For Cancel";

export const changePasswordTitle = "Change password";

export const companyPageId = "6";
export const contactPageId = "7";
export const userPageId = "3";
export const enquiryPageId = "8";
export const productCategoryPageId = "12";
export const productSubCategoryPageId = "13";
export const industryPageId = "9";
export const segmentPageId = "10";
export const enquiryTypePageId = "11";
export const enquiryStatusPageId = "14";
export const enquiryCategoryPageId = "15";
export const materialStatusPageId = "16";
export const ndeCategoryPageId = "17";
export const typeOfOrderPageId = "18";
export const billStatusPageId = "19";
export const reasonForLostPageId = "20";
export const reasonForCancelPageId = "21";








export const comNameActionId = "3";
export const comNameAutoActionId = "1";
export const conNameAutoActionId = "2";
export const cityAutoActionId = "3";

export const conNameActionId = "5";
export const ndeCategoryActionId = "4";
export const industryActionId = "6";
export const segmentActionId = "7";
export const cityActionId = "9";
export const enquiryTypeActionId = "12";
export const enquiryCategoryActionId = "15";



export function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}