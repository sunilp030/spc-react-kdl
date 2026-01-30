import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../utils/Loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  inputValidator,
  dropdownValidator,
  inputLslValidator,
  inputValidatorFormula,
  inputUslValidator,
  inputUpclValidator,
  inputMasterSizeValidator,
  inputLpclValidator,
  inputFileFormatValidator,
  inputFrequencyValidator,
} from "../../utils/Validator";
import {
  goldenRuleListUrl,
  stationListUrl,
  stationActionId,
  operationActionId,
  templateListUrl,
  fillListUrl,
  insertTemplateUrl,
  templateDetailsUrl,
  updateTemplateUrl,
  deleteTemplateUrl,
  insertGaugeUrl,
  imgConfigUrl,
  appVersion,
  NA,
  characterActionId,
  unitActionId,
  gaugeSourceActionId,
  optionActionId,
  comActionId,
  channelActionId,
  timeout,
  inputMaxLength,
  stationAccordingToOperationActionId,
  updateGaugeUrl,
  deleteGaugeUrl,
  gaugeDetailsUrl,
  operationTemplateActionId,
  formulaTemplateActionId,
} from "../../utils/constants";
import queryString from "query-string";
import $ from "jquery";
import { axiosGet, axiosPost } from "../framework/Axios";
import Header from "../common_components/Header";
import Footer from "../common_components/Footer";
import moment from "moment";
import Modal from "react-modal";
import { Treebeard } from "react-treebeard";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import Resizer from "react-image-file-resizer";
// import { Buffer } from "buffer";

// import {defaultTheme} from "react-treebeard/lib/themes/default";
import groupBy from "lodash/groupBy";

Modal.setAppElement("#root");

const Template = (props) => {
  const errorMap = {
    template_name: "",
    template_desc: "",
    station: "",
    operation: "",
    model_no: "",
    option_id: "",
    option_name: "",
    reading: "",
    char_type_id: "",
    unit_id: "",
    gauge_id: "",
    char_name: "",
    usl_data: "",
    lsl_data: "",
    mean_data: "",
    upcl_data: "",
    lpcl_data: "",
    master_size: "",
    freq_data: "",
    attachment_format: "",
    gauge_name: "",
    uwaver_name: "",
    groupid_name: "",
    channel_name: "",
    make_id: "",
    com_id: "",
    channel_id: "",
    formula_id: "",
  };
  const [userData, setUserData] = useState({});
  const [charFillList, setCharFillList] = useState([]);
  const [optionFillList, setOptionFillList] = useState([]);
  const [gaugeSourceFillList, setGaugeSourceFillList] = useState([]);
  const [tempGaugeSourceFillList, setTempGaugeSourceFillList] = useState([]);
  const [unitFillList, setUnitFillList] = useState([]);
  const [comFillList, setComFillList] = useState([]);
  const [channelFillList, setChannelFillList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [tempTemplateList, setTempTemplateList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [templateCharacterList, setTemplateCharacterList] = useState([]);
  const [templateDetails, setTemplateDetails] = useState({});
  const [templateId, setTemplateId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [barcodeToUseS, setBarcodeToUseS] = useState(false);
  const [barcodeToUseM, setBarcodeToUseM] = useState(true);
  const [modelNo, setModelNo] = useState("");
  const [optionId, setControlOption] = useState("");
  const [controlOptionName, setControlOptionName] = useState("");
  const [isTemplate, setIsTemplate] = useState(true);
  const [isMachine, setIsMachine] = useState(false);
  const [isPallet, setIsPallet] = useState(false);
  const [monthOfReading, setMonthOfReading] = useState("");
  const [charTypeId, setCharTypeId] = useState("");
  const [charTypeName, setCharTypeName] = useState("");
  const [gaugeSourceId, setGaugeSourceId] = useState("");
  const [gaugeSourceName, setGaugeSourceName] = useState("");
  const [unitId, setUnitId] = useState("");
  const [unitName, setUnitName] = useState("");
  const [charName, setCharName] = useState("");
  const [usl, setUsl] = useState("");
  const [lsl, setLsl] = useState("");
  const [mean, setMean] = useState("");
  const [upcl, setUpcl] = useState("");
  const [lpcl, setLpcl] = useState("");
  const [masterSize, setMasterSize] = useState("");
  const [frequency, setFrequency] = useState("");
  const [file, setFile] = useState([]);
  const [fileBase64, setFileBase64] = useState("");
  const [stationId, setStationId] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [createdUser, setCreatedUser] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [createdVersion, setCreatedVersion] = useState("");
  const [modifiedUser, setModifiedUser] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [modifiedVersion, setModifiedVersion] = useState("");
  const [deletedUser, setDeletedUser] = useState("");
  const [deletedDate, setDeletedDate] = useState("");
  const [deletedVersion, setDeletedVersion] = useState("");
  const [deleteTemplateId, setTemplateIdForDelete] = useState("");
  const [deleteCharId, setCharIdForDelete] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCharDeleteOpen, setCharDeleteOpen] = useState(false);
  const [isEditChar, setIsEditChar] = useState(false);
  const [charIndexForEdit, setCharIndexForEdit] = useState("");
  const [createdGaugeId, setCreatedGaugeId] = useState("");
  const [isAddCharOpen, setIsAddCharOpen] = useState(false);
  const [isAddGaugeOpen, setIsAddGaugeOpen] = useState(false);
  const [errors, setError] = useState(errorMap);
  const history = useHistory();
  const [groupDataList, setGroupData] = useState({});
  const [dataa, setData] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [cursor, setCursor] = useState(false);
  const [gaugeNameAdd, setGaugeNameAdd] = useState("");
  const [makerId, setMakerId] = useState("");
  const [comId, setComId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [uWaveRNo, setUWaveRNo] = useState("");
  const [groupId, setGroupId] = useState("");
  const [channelNo, setChannelNo] = useState("");
  const [isWriteAccess, setWriteAccess] = useState(false);
  const [isDeleteAccess, setDeleteAccess] = useState(false);
  const [isShowReplicate, setIsShowReplicate] = useState(true);
  const [isActive, setIsActive] = useState("");
  const [statusName, setStatusName] = useState("");
  const [imageName, setImageName] = useState("");
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [operationId, setOperationActionId] = useState("");
  const [operationList, setOperationList] = useState([]);
  const [characteristicId, setCharacteristicId] = useState("");
  const [isUpdateGauge, setIsUpdateGauge] = useState(false);
  const [updateGaugeSourceId, setUpdateGaugeSourceId] = useState("");
  const [isSelectedCharTypeAttribute, setIsSelectedCharTypeAttribute] =
    useState(false);
  const [isFocusOpenOptionTab, setIsFocusOpenOptionTab] = useState(false);
  const [gaugeUpdateStationId, setGaugeUpdateStationId] = useState("");
  const [modelNoList, setModelNoList] = useState([]);

  const [imgMinWidth, setImgMinWidth] = useState(500);
  const [imgMaxWidth, setImgMaxWidth] = useState(1500);
  const [imgMinHeigth, setImgMinHeigth] = useState(800);
  const [imgMaxHeigth, setImgMaxHeigth] = useState(2000);
  const [imgFormat, setImgFormat] = useState("JPG");
  const [imgQuality, setImgQuality] = useState(80);

  const [formulaId, setFormulaId] = useState("");
  const [formulaFillList, setFormulaFillList] = useState([]);
  const [goldenList, setGoldenRuleList] = useState([]);
  const [isGoldenRuleSelected, setIsGoldenRuleSelected] = useState(false);
  const [selectedGoldenList, setSelectedGoldenRuleList] = useState([]);
  const [isOpenGoldenRuleModal, setIsOpenGoldenRuleModal] = useState(false);
  const [currentTemTableClickRowId, setCurrentTemTableClickRowId] =
    useState("");

  useEffect(async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData != null) {
      setUserData(userData);
      if (userData["userAccess"].length > 0) {
        for (var i = 0; i < userData["userAccess"].length; i++) {
          if (userData["userAccess"][i]["ModuleID"] == 6) {
            if (userData["userAccess"][i]["Read"]) {
              setWriteAccess(userData["userAccess"][i]["Write"]);
              setDeleteAccess(userData["userAccess"][i]["Delete"]);
            } else {
              toast.error("You do not have access to view this page.", {
                theme: "colored",
                autoClose: 3000,
                hideProgressBar: true,
              });
              // await timeout(1000);
              history.goBack();
            }
          }
        }
      }
    } else {
      history.push("/login");
    }
    if (props.location.state != null) {
      setTemplateId(props.location.state.templateId);
    }
    getList(userData);
    getImageConfig();
    getFillList(userData, characterActionId, "");
    // getFillList(userData, gaugeSourceActionId, '')
    getFillList(userData, optionActionId, "");
    getFillList(userData, unitActionId, "");
    getFillList(userData, comActionId, "");
    getFillList(userData, channelActionId, "");
    getFillList(userData, operationTemplateActionId, "");
    getFillList(userData, formulaTemplateActionId, "");
    getFillList(userData, stationActionId, "");
    // getTemplateAccess(userData);
    getGoldenRuleList(userData);
  }, []);

  // api call for template list...........................
  const getFillList = async (data, actionId, reference) => {
    var result = await axiosGet(
      `${fillListUrl}?actionid=${actionId}&userid=${data.ID}&String=${reference}`
    );
    if (result != null && result["error"] == 0) {
      if (actionId === characterActionId) {
        setCharFillList(result["data"]);
      } else if (actionId === gaugeSourceActionId) {
        setGaugeSourceFillList(result["data"]);
        setTempGaugeSourceFillList(result["data"]);
      } else if (actionId === optionActionId) {
        setOptionFillList(result["data"]);
      } else if (actionId === unitActionId) {
        setUnitFillList(result["data"]);
      } else if (actionId === comActionId) {
        setComFillList(result["data"]);
      } else if (actionId === channelActionId) {
        setChannelFillList(result["data"]);
      } else if (
        actionId == stationActionId ||
        actionId == stationAccordingToOperationActionId
      ) {
        setStationList(result["data"]);
      } else if (actionId === operationTemplateActionId) {
        setOperationList(result["data"]);
      } else if (actionId === formulaTemplateActionId) {
        setFormulaFillList(result["data"]);
      }
    }
  };
  // api call for template list...........................
  const getList = async (data) => {
    setLoader(true);
    var result = await axiosGet(`${templateListUrl}?Login_Id=${data.ID}`);
    setLoader(false);
    if (result != null && result["error"] == 0) {
      setTemplateList(result["data"]);
      setTempTemplateList(result["data"]);
      grouping(result["data"]);
    }
  };

  // api call for template list...........................
  const getImageConfig = async () => {
    var result = await axiosGet(`${imgConfigUrl}`);
    if (result != null && result["error"] == 0) {
      setImgMinWidth(result["data"][0]["MinWidth"]);
      setImgMaxWidth(result["data"][0]["MaxWidth"]);
      setImgMinHeigth(result["data"][0]["MinHeight"]);
      setImgMaxHeigth(result["data"][0]["MaxHeight"]);
      setImgFormat(result["data"][0]["Format"]);
      setImgQuality(result["data"][0]["Quality"]);
    }
  };

 const grouping = (data) => {
  const a = groupBy(data, function (n) {
    return n.OperationLineName;
  });
  //grouping by operational name.......................
  var groups = Object.keys(a).map(function (key) {
    //grouping by station name.......................
    const s = groupBy(a[key], function (n) {
      return n.StationName;
    });
    var groups_station = Object.keys(s).map(function (key) {
      var list = s[key];
      var newList = [];

      for (var i = 0; i < list.length; i++) {
        var map = {
          value: list[i]["TemplateID"],
          label: list[i]["TemplateName"],
          isToggle: false,
        };
        newList.push(map);
      }

      // ✅ FIX HERE
      return { label: key, value: key, children: newList };
    });

    // ✅ FIX HERE
    return { label: key, value: key, children: groups_station };
  });

  var mapData = {
    name: "operation",
    children: groups,
  };

  setData([]);
  setData(groups);
};


  // api call for template list...........................
  const getStationList = async (data) => {
    setLoader(true);
    var result = await axiosGet(`${stationListUrl}?Login_Id=${data.ID}`);
    setLoader(false);
    if (result != null && result["error"] == 0) {
      setStationList(result["data"]);
    }
  };

  // api call for golden rule list...........................
  const getGoldenRuleList = async (data) => {
    setLoader(true);
    var result = await axiosGet(`${goldenRuleListUrl}?Login_Id=${data.ID}`);
    setLoader(false);
    if (result != null && result["error"] == 0) {
      // Map through result['data'] to add isCheck property
      const modifiedData = result["data"].map((item) => ({
        ...item,
        isCheck: false,
        isApplied: false, // Set the default value for isCheck
      }));

      setGoldenRuleList(modifiedData);
    }
  };

  // api call for template details........................
  const getTemplateDetails = async (data, templateID) => {
    setLoader(true);

    var result = await axiosGet(
      `${templateDetailsUrl}?Login_Id=${data.ID}&Template_id=${templateID}`
    );
    setLoader(false);
    if (result != null && result["error"] == 0) {
      if (result["data"] != null) {
        setIsShowReplicate(true);
        setTemplateDetails(result["data"]);
        setTemplateDesc(result["data"]["TemplateDescription"] ?? NA);
        setTemplateName(result["data"]["TemplateName"] ?? NA);
        setStationId(result["data"]["StationID"] ?? NA);
        setModelNo(result["data"]["ModelNo"] ?? NA);
        setOperationActionId(result["data"]["OperationLineID"] ?? NA);
        setControlOption(result["data"]["ControlChartDisplayOptionID"] ?? NA);
        setControlOptionName(
          result["data"]["ControlChartDisplayOptionValue"] ?? NA
        );
        setMonthOfReading(result["data"]["NoOfMonthForCL"] ?? NA);
        setIsTemplate(result["data"]["IsTemplateFreq"] ?? NA);
        setIsMachine(result["data"]["IsMachineFreq"] ?? NA);
        setIsPallet(result["data"]["IsPalletFreq"] ?? NA);
        setIsActive(result["data"]["StatusID"] ?? "");
        setStatusName(result["data"]["StatusName"] ?? "");
        setCreatedUser(result["data"]["CreatedUser"] ?? NA);
        setCreatedVersion(result["data"]["CreatedVersion"] ?? NA);
        setCreatedDate(
          result["data"]["CreatedDate"] != null
            ? moment(result["data"]["CreatedDate"]).format("DD-MM-YYYY")
            : NA
        );
        setModifiedUser(result["data"]["ModifiedUser"] ?? NA);
        setModifiedVersion(result["data"]["ModifiedVersion"] ?? NA);
        setModifiedDate(
          result["data"]["ModifiedDate"] != null
            ? moment(result["data"]["ModifiedDate"]).format("DD-MM-YYYY")
            : NA
        );
        setDeletedUser(result["data"]["DeletedUser"] ?? NA);
        setDeletedVersion(result["data"]["DeletedVersion"] ?? NA);
        setDeletedDate(
          result["data"]["DeletedDate"] != null
            ? moment(result["data"]["DeletedDate"]).format("DD-MM-YYYY")
            : NA
        );
        setBarcodeToUseS(
          result["data"]["BarcodeToUsed"] != "" &&
            result["data"]["BarcodeToUsed"] != null &&
            result["data"]["BarcodeToUsed"] == "S"
            ? true
            : false
        );
        setBarcodeToUseM(
          result["data"]["BarcodeToUsed"] != "" &&
            result["data"]["BarcodeToUsed"] != null &&
            result["data"]["BarcodeToUsed"] == "M"
            ? true
            : false
        );
        var charList = result["data"]["character"];
        for (var i = 0; i < charList.length; i++) {
          charList[i]["isAttachmentChanged"] = false;
        }
        setTemplateCharacterList(charList);
        if (result["data"]["model"].length > 0) {
          var modelList = result["data"]["model"];
          var model = [];
          for (var i = 0; i < modelList.length; i++) {
            var map = {
              srNo: i + 1,
              modelNo: modelList[i]["Model"],
              barcode_s:
                modelList[i]["ModelType"] != null &&
                modelList[i]["ModelType"] != "" &&
                modelList[i]["ModelType"] == "S"
                  ? true
                  : false,
              barcode_m:
                modelList[i]["ModelType"] != null &&
                modelList[i]["ModelType"] != "" &&
                modelList[i]["ModelType"] == "M"
                  ? true
                  : false,
            };
            model.push(map);
          }
          setModelNoList(model);
        } else {
          for (var i = 0; i < operationList.length; i++) {
            if (
              operationList[i]["ID"] == result["data"]["OperationLineID"] &&
              operationList[i]["EnableTemplatewisemodelmapping"]
            ) {
              var list = [
                { srNo: 1, modelNo: "", barcode_s: false, barcode_m: true },
              ];
              setModelNoList(list);
              return;
            } else {
              setModelNoList([]);
            }
          }
        }
        getGoldenRuleList(data);

        // Check if is_golden_rule is true
        setTimeout(() => {
          for (const charListItem of charList) {
            if (charListItem["is_golden_rule"] == 1) {
              // const goldenRuleIds = charListItem['Golden_Rule'] == 1  ?.split(',').map(id => parseInt(id.trim())) || '';

              let goldenRuleIds;
              if (typeof charListItem["Golden_Rule"] === "string") {
                goldenRuleIds = charListItem["Golden_Rule"]
                  .split(",")
                  .map((id) => parseInt(id.trim()));
              } else if (typeof charListItem["Golden_Rule"] === "number") {
                goldenRuleIds = [charListItem["Golden_Rule"]];
              } else {
                // Handle other cases or set a default value
                goldenRuleIds = [];
              }

              const updatedGoldenRuleList = goldenList.map((item) => {
                if (goldenRuleIds.includes(item.id)) {
                  console.log("condition 1");
                  return { ...item, isCheck: true, isApplied: true };
                } else {
                  console.log("condition 2");
                  return { ...item, isCheck: false, isApplied: false };
                }
              });
              console.log("result['data']", result["data"]);

              console.log("updatedGoldenRuleList", updatedGoldenRuleList);
              setGoldenRuleList(updatedGoldenRuleList);
            }
          }
        }, 300); // 300 minutes in milliseconds
      }
    }
  };

  //doing search function.................................
  const onSearch = async (searchField) => {
    setSearch(searchField);
    if (searchField.length > 0) {
      const searchList = tempTemplateList.filter((data) => {
        return data.template_name
          .toLowerCase()
          .includes(searchField.toLowerCase());
      });
      setTemplateList(searchList);
    } else {
      setTemplateList([]);
      setTempTemplateList([]);
      getList(userData);
    }
  };

  //doing clear search function.................................
  const onSearchClear = () => {
    setSearch("");
    setTemplateList([]);
    setTempTemplateList([]);
    getList(userData);
  };

  //input validation.................................................
  const inputValidate = (value, fieldName) => {
    let errorValue;
    if (fieldName == "USL") {
      errorValue = meanCalculate(value, lsl);
    } else if (fieldName == "LSL") {
      errorValue = meanCalculate(usl, value);
    }

    if (fieldName == "USL") {
      errorValue = inputUslValidator(value, fieldName, lsl, "LSL");
    } else if (fieldName == "LSL") {
      errorValue = inputLslValidator(value, fieldName, usl, "USL");
    } else if (fieldName == "UPCL") {
      errorValue = inputUpclValidator(value, fieldName, usl, mean);
    } else if (fieldName == "LPCL") {
      errorValue = inputLpclValidator(value, fieldName, lsl, mean);
    } else if (fieldName == "attachment type") {
      errorValue = inputFileFormatValidator(value, fieldName);
    } else if (fieldName == "frequency") {
      errorValue = inputFrequencyValidator(value);
    } else if (fieldName == "master size") {
      errorValue = inputMasterSizeValidator(value, "Master size", usl, lsl);
    } else {
      errorValue = inputValidator(value, fieldName);
    }

    if (errorValue !== "") {
      if (fieldName == "template name") {
        errorMap.template_name = errorValue;
      } else if (fieldName == "template description") {
        errorMap.template_desc = errorValue;
      } else if (fieldName == "model no") {
        errorMap.model_no = errorValue;
      } else if (fieldName == "option") {
        errorMap.option_name = errorValue;
      } else if (fieldName == "value") {
        errorMap.reading = errorValue;
      } else if (fieldName == "characteristic name") {
        errorMap.char_name = errorValue;
      } else if (fieldName == "USL") {
        errorMap.usl_data = errorValue;
      } else if (fieldName == "LSL") {
        errorMap.lsl_data = errorValue;
      } else if (fieldName == "Mean") {
        errorMap.mean_data = errorValue;
      } else if (fieldName == "UPCL") {
        errorMap.upcl_data = errorValue;
      } else if (fieldName == "LPCL") {
        errorMap.lpcl_data = errorValue;
      } else if (fieldName == "master size") {
        errorMap.master_size = errorValue;
      } else if (fieldName == "frequency") {
        errorMap.freq_data = errorValue;
      } else if (fieldName == "gauge name") {
        errorMap.gauge_name = errorValue;
      } else if (fieldName == "uwaver no") {
        errorMap.uwaver_name = errorValue;
      } else if (fieldName == "group id") {
        errorMap.groupid_name = errorValue;
      } else if (fieldName == "channel") {
        errorMap.channel_name = errorValue;
      } else if (fieldName == "attachment type") {
        setFile("");
        errorMap.attachment_format = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (fieldName == "template name") {
        errorMap.template_name = errorValue;
      } else if (fieldName == "template description") {
        errorMap.template_desc = errorValue;
      } else if (fieldName == "model no") {
        errorMap.model_no = errorValue;
      } else if (fieldName == "option") {
        errorMap.option_name = errorValue;
      } else if (fieldName == "value") {
        errorMap.reading = errorValue;
      } else if (fieldName == "characteristic name") {
        errorMap.char_name = errorValue;
      } else if (fieldName == "USL") {
        errorMap.usl_data = errorValue;
      } else if (fieldName == "LSL") {
        errorMap.lsl_data = errorValue;
      } else if (fieldName == "Mean") {
        errorMap.mean_data = errorValue;
      } else if (fieldName == "UPCL") {
        errorMap.upcl_data = errorValue;
      } else if (fieldName == "LPCL") {
        errorMap.lpcl_data = errorValue;
      } else if (fieldName == "master size") {
        errorMap.master_size = errorValue;
      } else if (fieldName == "frequency") {
        errorMap.freq_data = errorValue;
      } else if (fieldName == "gauge name") {
        errorMap.gauge_name = errorValue;
      } else if (fieldName == "uwaver no") {
        errorMap.uwaver_name = errorValue;
      } else if (fieldName == "group id") {
        errorMap.groupid_name = errorValue;
      } else if (fieldName == "channel") {
        errorMap.channel_name = errorValue;
      } else if (fieldName == "attachment type") {
        setFile("");
        errorMap.attachment_format = errorValue;
      }
      setError(errorMap);
      return true;
    }
  };

  //dropdown validation.................................................
  const dropdownValidate = (value, fieldName) => {
    const errorValue = dropdownValidator(value, fieldName);
    if (errorValue !== "") {
      if (fieldName === "station") {
        errorMap.station = errorValue;
      } else if (fieldName === "operation line") {
        errorMap.operation = errorValue;
      } else if (fieldName === "control") {
        errorMap.option_id = errorValue;
      } else if (fieldName === "Characteristic Type") {
        errorMap.char_type_id = errorValue;
      } else if (fieldName === "Gauge Source") {
        errorMap.gauge_id = errorValue;
      } else if (fieldName === "Unit") {
        errorMap.unit_id = errorValue;
      } else if (fieldName === "make") {
        errorMap.make_id = errorValue;
      } else if (fieldName === "Com port") {
        errorMap.com_id = errorValue;
      } else if (fieldName === "Channel") {
        errorMap.channel_id = errorValue;
      } else if (fieldName === "formula") {
        errorMap.formula_id = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (fieldName === "station") {
        errorMap.station = errorValue;
      } else if (fieldName === "operation line") {
        errorMap.operation = errorValue;
      } else if (fieldName === "control") {
        errorMap.option_id = errorValue;
      } else if (fieldName === "Characteristic Type") {
        errorMap.char_type_id = errorValue;
      } else if (fieldName === "Gauge Source") {
        errorMap.gauge_id = errorValue;
      } else if (fieldName === "Unit") {
        errorMap.unit_id = errorValue;
      } else if (fieldName === "make") {
        errorMap.make_id = errorValue;
      } else if (fieldName === "Com port") {
        errorMap.com_id = errorValue;
      } else if (fieldName === "Channel") {
        errorMap.channel_id = errorValue;
      } else if (fieldName === "formula") {
        errorMap.formula_id = errorValue;
      }
      setError(errorMap);
      return true;
    }
  };

  //on save button click............................................
  const onSaveClick = async () => {
    setIsFocusOpenOptionTab(!isFocusOpenOptionTab);

    if (errorMap.option_name != "" && errorMap.reading != "") {
      // document.querySelector('#Options').tab('show');
      // setIsFocusOpenOptionTab(!isFocusOpenOptionTab);
    }
    inputValidate(templateName, "template name");
    inputValidate(templateDesc, "template description");
    // inputValidate(modelNo, 'model no')
    inputValidate(controlOptionName, "option");
    inputValidate(monthOfReading, "value");
    dropdownValidate(stationId, "station");
    dropdownValidate(operationId, "operation line");
    dropdownValidate(optionId, "control");

    if (!inputValidate(templateName, "template name")) {
      return;
    }
    if (!inputValidate(templateDesc, "template description")) {
      return;
    }
    // if (!inputValidate(modelNo, 'model no')) {
    //   return;
    // }
    if (!inputValidate(controlOptionName, "option")) {
      return;
    }
    if (!inputValidate(monthOfReading, "value")) {
      return;
    }
    if (!dropdownValidate(stationId, "station")) {
      return;
    }
    if (!dropdownValidate(operationId, "operation  line")) {
      return;
    }
    if (!dropdownValidate(optionId, "control")) {
      return;
    }

    if (templateCharacterList.length == 0) {
      toast.error("At least one characteristic is required.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    var isAllModelNoBlank = true;
    var modelList = [];
    for (var i = 0; i < modelNoList.length; i++) {
      if (modelNoList[i]["modelNo"] != "") {
        isAllModelNoBlank = false;
      }
      if (modelNoList[i]["modelNo"] != "") {
        var map = {
          Model: modelNoList[i]["modelNo"],
          ModelType: modelNoList[i]["barcode_s"] ? "S" : "M",
        };
        modelList.push(map);
      }
    }
    if (modelNoList.length > 0 && isAllModelNoBlank) {
      toast.error("Atleast one model Number required.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    var mapData = {
      Login_id: userData.ID,
      Template_Name: templateName,
      Template_Description: templateDesc,
      StationID: stationId,
      ModelNo: modelNo,
      ControlChartDisplayOptionID: optionId,
      ControlChartDisplayOptionValue: controlOptionName,
      IsTemplateFreq: isTemplate,
      IsMachineFreq: isMachine,
      IsPalletFreq: isPallet,
      NoOfMonthForCL: monthOfReading,
      charList: templateCharacterList,
      Model: modelList,
      created_version: appVersion,
      BarcodeToUsed: modelNoList.length > 0 ? (barcodeToUseS ? "S" : "M") : "",
    };
    setLoader(true);
    var result = await axiosPost(insertTemplateUrl, mapData);
    setLoader(false);
    if (result != null && result["error"] == 0) {
      toast.success("Template added successfully.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      clearField();
    } else {
      toast.error(result["msg"], {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  //on update button click............................................
  const onUpdateClick = async () => {
    inputValidate(templateName, "template name");
    inputValidate(templateDesc, "template description");
    // inputValidate(modelNo, 'model no')
    inputValidate(controlOptionName, "option");
    inputValidate(monthOfReading, "value");
    dropdownValidate(stationId, "station");
    dropdownValidate(operationId, "operation line");
    dropdownValidate(optionId, "control");

    if (!inputValidate(templateName, "template name")) {
      return;
    }
    if (!inputValidate(templateDesc, "template description")) {
      return;
    }
    // if (!inputValidate(modelNo, 'model no')) {
    //   return;
    // }
    if (!inputValidate(controlOptionName, "option")) {
      return;
    }
    if (!inputValidate(monthOfReading, "value")) {
      return;
    }
    if (!dropdownValidate(stationId, "station")) {
      return;
    }
    if (!dropdownValidate(operationId, "operation line")) {
      return;
    }
    if (!dropdownValidate(optionId, "control")) {
      return;
    }

    if (templateCharacterList.length == 0) {
      toast.error("At least one characteristics is required.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
    var charList = [];
    for (var i = 0; i < templateCharacterList.length; i++) {
      charList.push(templateCharacterList[i]);
    }

    for (var i = 0; i < charList.length; i++) {
      if (!charList[i]["isAttachmentChanged"]) {
        charList[i]["Attachement"] = "";
      }
    }

    var isAllModelNoBlank = true;
    var modelList = [];
    for (var i = 0; i < modelNoList.length; i++) {
      if (modelNoList[i]["modelNo"] != "") {
        isAllModelNoBlank = false;
      }
      if (modelNoList[i]["modelNo"] != "") {
        var map = {
          Model: modelNoList[i]["modelNo"],
          ModelType: modelNoList[i]["barcode_s"] ? "S" : "M",
        };
        modelList.push(map);
      }
    }
    if (modelNoList.length > 0 && isAllModelNoBlank) {
      toast.error("Atleast one model Number required.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    var mapData = {
      Login_id: userData.ID,
      Template_Code: templateId,
      Template_Name: templateName,
      Template_Description: templateDesc,
      StationID: stationId,
      ModelNo: modelNo,
      ControlChartDisplayOptionID: optionId,
      ControlChartDisplayOptionValue: controlOptionName,
      IsTemplateFreq: isTemplate,
      IsMachineFreq: isMachine,
      IsPalletFreq: isPallet,
      NoOfMonthForCL: monthOfReading,
      charList: charList,
      Model: modelList,
      modified_version: appVersion,
      BarcodeToUsed: modelNoList.length > 0 ? (barcodeToUseS ? "S" : "M") : "",
    };
    setLoader(true);
    console.log("999", mapData);
    var result = await axiosPost(updateTemplateUrl, mapData);
    setLoader(false);
    if (result != null && result["error"] == 0) {
      toast.success("Template updated successfully.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      clearField();
    } else {
      toast.error(result["msg"], {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  //on replicate button click............................................
  const onReplicateClick = async () => {
    setLoader(true);
    setIsShowReplicate(false);
    setTemplateId("");
    for (var i = 0; i < templateCharacterList.length; i++) {
      templateCharacterList[i]["GaugeSourceID"] = "";
      templateCharacterList[i]["GaugeSource"] = "";
    }
    setLoader(false);
    toast.success("Template replicated successfully.", {
      theme: "colored",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  //on save button click............................................
  const onGaugeSaveClick = async (value) => {
    if (stationId == "") {
      toast.error("Please select station first.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
    if (!inputValidate(gaugeNameAdd, "gauge name")) {
      return;
    }

    if (!dropdownValidate(makerId, "make")) {
      return;
    }
    // if (!dropdownValidate(comId, 'Com port')) {
    //   return;
    // }
    // if (!dropdownValidate(channelId, 'Channel')) {
    //   return;
    // }
    if (!inputValidate(uWaveRNo, "uwaver no")) {
      return;
    }
    if (!inputValidate(groupId, "group id")) {
      return;
    }
    if (!inputValidate(channelNo, "channel")) {
      return;
    }

    var mapData = {
      Login_id: userData.ID,
      Gauge_Name: gaugeNameAdd,
      Make: makerId,
      // 'PortNo': comId,
      // 'Channel_No': channelId,
      uwaver: uWaveRNo,
      group_id: groupId,
      Channel_No: channelNo,
      StationID: stationId,
      created_version: appVersion,
    };
    setLoader(true);
    var result = await axiosPost(insertGaugeUrl, mapData);

    if (result != null && result["error"] == 0) {
      toast.success("Gauge Source added successfully.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      setGaugeNameAdd("");
      setMakerId("");
      setComId("");
      setChannelId("");
      setUWaveRNo("");
      setGroupId("");
      setChannelNo("");
      toggleModalAddGauge();
      setGaugeSourceFillList([]);
      setTempGaugeSourceFillList([]);
      await getFillList(userData, gaugeSourceActionId, stationId);
      if (isAddCharOpen) {
        setCreatedGaugeId(result["data"][0]["Id"]);
        setGaugeSourceId(result["data"][0]["Id"]);
      }
    } else {
      toast.error(result["msg"], {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
    setLoader(false);
  };

  const clearField = () => {
    errorMap.template_name = "";
    errorMap.template_desc = "";
    errorMap.station = "";
    errorMap.operation = "";
    errorMap.model_no = "";
    errorMap.option_id = "";
    errorMap.option_name = "";
    errorMap.reading = "";
    errorMap.char_type_id = "";
    errorMap.unit_id = "";
    errorMap.gauge_id = "";
    errorMap.char_name = "";
    errorMap.usl_data = "";
    errorMap.lsl_data = "";
    errorMap.mean_data = "";
    errorMap.upcl_data = "";
    errorMap.lpcl_data = "";
    errorMap.master_size = "";
    errorMap.freq_data = "";
    errorMap.attachment_format = "";
    errorMap.gauge_name = "";
    errorMap.com_id = "";
    errorMap.channel_id = "";
    setError(errorMap);
    setTemplateId("");
    setTemplateDesc("");
    setTemplateName("");
    setStationId("");
    setModelNo("");
    setOperationActionId("");
    setControlOption("");
    setControlOptionName("");
    setMonthOfReading("");
    setIsTemplate(true);
    setIsMachine(false);
    setIsPallet(false);
    setStatusName("");
    setIsActive("");
    setTemplateCharacterList([]);
    setTemplateList([]);
    setTempTemplateList([]);
    setChecked([]);
    getList(userData);
    setGaugeNameAdd("");
    setUWaveRNo("");
    setGroupId("");
    setChannelNo("");
    setMakerId("");
    setComId("");
    setChannelId("");
    // setIsTemplate('');
    // setIsMachine('');
    // setIsPallet('');
    setCharName("");
    setCharTypeId("");
    setCharacteristicId("");

    setUnitId("");
    setUsl("");
    setLsl("");
    setMean("");
    setUpcl("");
    setLpcl("");
    setGaugeSourceId("");
    setMasterSize("");
    setFrequency("");
    setImageName("");
    setModelNoList([]);
    getFillList(userData, stationActionId, "");
  };

  //toggle model for delete.................................
  function toggleModal(templateId) {
    setIsOpen(!isOpen);
    if (templateId == "") {
      return;
    } else {
      setTemplateIdForDelete(templateId);
    }
  }

  //toggle model for open golden rule list.................................
  function toggleModalGoldenRuleModal(e, data) {
    if (e.target.checked) {
      setIsOpenGoldenRuleModal(true);
      var ruleList = "";

      const updatedList = templateCharacterList.map((listItem) => {
        // console.log("updatedList 999", listItem)
        ruleList = data.Golden_Rule;
        if (listItem.CharacteristicID === data.CharacteristicID) {
          setCurrentTemTableClickRowId(data.CharacteristicID);
          return { ...listItem, is_golden_rule: 1 };
        } else {
          return listItem;
        }
      });
      setTemplateCharacterList(updatedList);
      // console.log("templateCharacterList s1", updatedList);
      // take rule id base on it check rule list check box
      console.log("ruleList", ruleList);

      const ruleIds = ruleList.split(",").map((id) => parseInt(id.trim(), 10)); // Convert the comma-separated string to an array of integers
      const updatedGoldenList = goldenList.map((listItem) => {
        if (ruleIds.includes(listItem.id)) {
          return { ...listItem, isCheck: true, isApplied: true };
        } else {
          return { ...listItem, isCheck: false, isApplied: false };
        }
      });
      setGoldenRuleList(updatedGoldenList);
    } else {
      var ruleList = "";
      // set is_golden_rule false
      const updatedList = templateCharacterList.map((listItem) => {
        // console.log("updatedList 999", listItem)

        ruleList = data.Golden_Rule;
        if (listItem.CharacteristicID === data.CharacteristicID) {
          return { ...listItem, is_golden_rule: 0 };
        } else {
          return listItem;
        }
      });
      setTemplateCharacterList(updatedList);
      // console.log("templateCharacterList s13", updatedList);

      console.log("ruleList", ruleList);
      // if uncheck is_golden_rule then set goldenList check false
      // const ruleIds = ruleList.split(',').map(id => parseInt(id.trim(), 10)); // Convert the comma-separated string to an array of integers
      const updatedGoldenList = goldenList.map((listItem) => {
        // if (ruleIds.includes(listItem.id)) {
        return { ...listItem, isCheck: false, isApplied: false };
        // }
      });
      setGoldenRuleList(updatedGoldenList);
    }

    //   }
    //  else{
    // const updatedList = templateCharacterList.map((listItem) =>
    // // console.log("updatedList 999", listItem)
    //   listItem.CharacteristicID == data.CharacteristicID ? {
    //     ...listItem} : listItem
    // );
    // setTemplateCharacterList(updatedList);
    // console.log("updatedList s3431", updatedList);
    //  }
    // const updatedList = [];
    // for (let i = 0; i < templateCharacterList.length; i++) {
    //   const listItem = templateCharacterList[i];
    //   console.log("updatedList 999 listItem", listItem)

    //   if (listItem.CharacteristicID === data.CharacteristicID) {
    //     console.log("1", data.CharacteristicName)
    //     updatedList.push({ ...listItem, is_golden_rule: 1 });

    //     setTimeout(() => {
    //       setTemplateCharacterList(updatedList);
    //     }, 300);

    //   } else {
    //     console.log("2")
    //     console.log("2", data.CharacteristicName)
    //     updatedList.push(listItem);
    //     setTimeout(() => {
    //       setTemplateCharacterList(updatedList);
    //     }, 300);

    //   }
    // }

    // console.log("updatedList 999___", updatedList);
  }

  const onCheckedGoldenRuleCheck = (e, data) => {
    const updatedList = goldenList.map((listItem) =>
      listItem.id == data.id
        ? { ...listItem, isCheck: !listItem.isCheck, isApplied: false }
        : { ...listItem, isApplied: false }
    );
    setGoldenRuleList(updatedList);
    // console.log("goldenList s13", updatedList);
  };
  //
  const onClickGoldenRuleApply = (ClickedId) => {
    // to set applied true
    const updatedList = goldenList.map((listItem) =>
      listItem.isCheck
        ? { ...listItem, isApplied: true }
        : { ...listItem, isApplied: false }
    );
    setGoldenRuleList(updatedList);
    //
    setTimeout(() => {
      // for isApplied true
      const appliedGoldenRules = updatedList.filter((item) => item.isApplied);
      // Create a new array with the required properties from appliedGoldenRules
      const goldenRuleData = appliedGoldenRules.map((item) => ({
        Description: item.Description,
        ReadingRequired: item.ReadingRequired,
        WarnAndContinue: item.WarnAndContinue,
        WarnAndStop: item.WarnAndStop,
        id: item.id,
      }));

      // for isApplied false
      const appliedGoldenRules2 = updatedList.filter(
        (item) => item.isApplied == false
      );
      // Create a new array with the required properties from appliedGoldenRules
      const goldenRuleData2 = appliedGoldenRules2.map((item) => ({
        Description: item.Description,
        ReadingRequired: item.ReadingRequired,
        WarnAndContinue: item.WarnAndContinue,
        WarnAndStop: item.WarnAndStop,
        id: item.id,
      }));

      // insert into golden rule in template list
      const updatedTemplateList = templateCharacterList.map((listItem) => {
        if (listItem.is_golden_rule == 1) {
          // Create a comma-separated string of item ids
          const idsString = goldenRuleData.map((item) => item.id).join(", ");
          // set Golden_Rule which was clicked
          console.log("listItem.CharacteristicID", listItem.CharacteristicID);
          console.log("currentTemTableClickRowId", currentTemTableClickRowId);
          console.log("idsString", idsString);
          if (currentTemTableClickRowId == listItem.CharacteristicID) {
            return { ...listItem, Golden_Rule: idsString };
          } else {
            return { ...listItem };
          }
          //
        } else {
          const idsString = goldenRuleData2.map((item) => item.id).join(", ");
          return { ...listItem, Golden_Rule: "" };
        }
      });
      // console.log('templateCharacterList final with rule list', updatedTemplateList);
      setTemplateCharacterList(updatedTemplateList);
      console.log("templateCharacterList final ", updatedTemplateList);

      setIsOpenGoldenRuleModal(!isOpenGoldenRuleModal);
    }, 300);
  };

  //toggle model for delete.................................
  function toggleModalForDeleteChar(index) {
    setCharDeleteOpen(!isCharDeleteOpen);
    if (index == "") {
      return;
    } else {
      setCharIdForDelete(index);
    }
  }

  function clearCharValidate() {
    errorMap.char_type_id = "";
    errorMap.gauge_id = "";
    errorMap.char_name = "";
    errorMap.usl_data = "";
    errorMap.lsl_data = "";
    errorMap.mean_data = "";
    errorMap.upcl_data = "";
    errorMap.lpcl_data = "";
    errorMap.master_size = "";
    errorMap.freq_data = "";
    errorMap.attachment_format = "";
    setError(errorMap);
  }

  //toggle model for add characterstics.................................
  function toggleModalAddChar(templateId) {
    if (
      stationId == "" ||
      stationId == "Select from list" ||
      stationId == "Choose one"
    ) {
      toast.error("Please select station first.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
    setCharName("");
    setCharTypeId("");
    setCharacteristicId("");
    setUnitId("");
    setUsl("");
    setLsl("");
    setMean("");
    setUpcl("");
    setLpcl("");
    setGaugeSourceId("");
    setMasterSize("");
    setFrequency("");
    setCreatedGaugeId("");
    clearValidation();

    // var selectedGauge = [];
    // for (var i = 0; i < templateCharacterList.length; i++) {
    //   if (templateCharacterList[i]['GaugeSourceID'] != null && templateCharacterList[i]['GaugeSourceID'] != '-' && templateCharacterList[i]['GaugeSourceID'] != '') {
    //     selectedGauge.push(templateCharacterList[i]['GaugeSourceID'].toString());
    //   }
    // }
    // var filterGaugeList = [];
    // for (var i = 0; i < tempGaugeSourceFillList.length; i++) {
    //   if (!selectedGauge.includes(tempGaugeSourceFillList[i]['ID'].toString())) {
    //     filterGaugeList.push(tempGaugeSourceFillList[i]);
    //   }
    // }

    // setGaugeSourceFillList([]);
    // setGaugeSourceFillList(filterGaugeList);
    clearValidation();
    setIsAddCharOpen(!isAddCharOpen);
    setIsSelectedCharTypeAttribute(false);
    if (templateId == "") {
      return;
    } else {
      setIsEditChar(false);
    }
    getFillList(userData, gaugeSourceActionId, stationId);
  }

  //toggle model for add characterstics.................................
  function toggleModalEditChar(data, index) {
    if (
      stationId == "" ||
      stationId == "Select from list" ||
      stationId == "Choose one"
    ) {
      toast.error("Please select station first.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
    setCreatedGaugeId("");
    clearCharValidate();
    if (data != undefined) {
      //filter gauge........................................
      // var selectedGauge = [];
      // for (var i = 0; i < templateCharacterList.length; i++) {
      //   if (i != index) {
      //     if (templateCharacterList[i]['GaugeSourceID'] != null && templateCharacterList[i]['GaugeSourceID'] != '-' && templateCharacterList[i]['GaugeSourceID'] != '') {
      //       selectedGauge.push(templateCharacterList[i]['GaugeSourceID'].toString());
      //     }
      //   }
      // }
      // var filterGaugeList = [];
      // for (var i = 0; i < tempGaugeSourceFillList.length; i++) {
      //   if (!selectedGauge.includes(tempGaugeSourceFillList[i]['ID'].toString())) {
      //     filterGaugeList.push(tempGaugeSourceFillList[i]);
      //   }
      // }
      // setGaugeSourceFillList([]);
      // setGaugeSourceFillList(filterGaugeList);
      //.................................................
      setCharName(data.CharacteristicName);
      setCharTypeId(data.CharacteristicsTypeID);
      setCharacteristicId(data.CharacteristicID);
      setUnitId(data.UnitID);
      setUsl(data.USL);
      setLsl(data.LSL);
      setMean(data.Mean);
      setUpcl(data.UPCL);
      setLpcl(data.LPCL);
      setFormulaId(data.formula);
      setGaugeSourceId(data.GaugeSourceID);
      setMasterSize(data.MasterSize);
      setFrequency(data.Frequency);
      setIsSelectedCharTypeAttribute(
        data.CharacteristicsTypeID == 1 ? true : false
      );
      //set characteristic name...............................
      for (var i = 0; i < charFillList.length; i++) {
        if (charFillList[i]["ID"] == data.CharacteristicsTypeID) {
          setCharTypeName(charFillList[i]["CharacteristicsType"]);
        }
      }
      //set gauge source name...............................
      for (var i = 0; i < gaugeSourceFillList.length; i++) {
        if (gaugeSourceFillList[i]["ID"] == data.GaugeSourceID) {
          setGaugeSourceName(gaugeSourceFillList[i]["GaugeSource"]);
        }
      }
      //set unit name...............................
      for (var i = 0; i < unitFillList.length; i++) {
        if (unitFillList[i]["ID"] == data.UnitID) {
          setUnitName(unitFillList[i]["Unit"]);
        }
      }
    }
    setCharIndexForEdit(index);
    setIsEditChar(!isEditChar);
    setIsAddCharOpen(!isAddCharOpen);
    getFillList(userData, gaugeSourceActionId, stationId);
  }

  function onCharDialogClose(isEdit) {
    !isEdit ? toggleModalAddChar() : toggleModalEditChar();
    setCharName("");
    setCharTypeId("");
    setCharacteristicId("");
    setUnitId("");
    setUsl("");
    setLsl("");
    setMean("");
    setUpcl("");
    setLpcl("");
    setGaugeSourceId("");
    setMasterSize("");
    setFrequency("");
    clearValidation();
  }

  //toggle model for add gauge source.................................
  function toggleModalAddGauge(templateId) {
    if (
      stationId == "" ||
      stationId == "Select from list" ||
      stationId == "Choose one"
    ) {
      toast.error("Please select station first.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
    getFillList(userData, gaugeSourceActionId, stationId);
    setIsAddGaugeOpen(!isAddGaugeOpen);
    setGaugeNameAdd("");
    setMakerId("");
    setComId("");
    setChannelId("");
    setUWaveRNo("");
    setGroupId("");
    setChannelNo("");
    setUpdateGaugeSourceId("");
    setIsUpdateGauge(false);
    if (templateId == "") {
      return;
    } else {
      // setTemplateIdForDelete(templateId);
    }
  }

  //toggle model for add gauge source.................................
  function toggleModalDisplayImage(data) {
    setImageName(data);
    setImageModalOpen(!isImageModalOpen);
    if (imageName == "") {
      return;
    } else {
      // setTemplateIdForDelete(templateId);
    }
  }

  //on delete button click............................................
  const onDeleteClick = async () => {
    setLoader(true);
    var result = await axiosGet(
      `${deleteTemplateUrl}?Login_id=${userData.ID}&template_id=${templateId}&Deleted_Version=${appVersion}`
    );
    setLoader(false);
    toggleModal();
    if (result != null && result["error"] == 0) {
      toast.success("Template deleted successfully.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      clearField();
    } else {
      toast.error(result["msg"], {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  //on delete char button click............................................
  const onCharDeleteClick = async () => {
    if (templateCharacterList.length > 1) {
      setLoader(true);
      var index = parseInt(deleteCharId) - 1;
      var tempList = templateCharacterList.filter((item, i) => i != index);
      setTemplateCharacterList(tempList);
      setLoader(false);
      toggleModalForDeleteChar();
      toast.success("Characterstic deleted successfully.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } else {
      toggleModalForDeleteChar();
      toast.error("At least one characteristics is required.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const swipeItem = async (first, second) => {
    //swipe item inside list.....................
    setLoader(true);
    var tempList = templateCharacterList;
    var temp = tempList[first];
    tempList[first] = tempList[second];
    tempList[second] = temp;
    await timeout(500);
    setLoader(false);
    setTemplateCharacterList([]);
    setTemplateCharacterList(tempList);
  };

  //on back button click............................................
  const onBackClick = async () => {
    history.goBack();
  };

  // station dropdown validate.........................................
  const onStationDropdownChange = (value) => {
    setStationId(value);
    dropdownValidate(value, "station");
    if (value == "" && value == "Select from list" && value == "Choose one") {
      getFillList(userData, gaugeSourceActionId, value);
    }
  };

  // operation dropdown validate.........................................
  const onOperationDropdownChange = (value) => {
    setOperationActionId(value);
    dropdownValidate(value, "operation");
    getFillList(userData, stationAccordingToOperationActionId, value);

    for (var i = 0; i < operationList.length; i++) {
      if (
        operationList[i]["ID"] == value &&
        operationList[i]["EnableTemplatewisemodelmapping"]
      ) {
        var list = [
          { srNo: 1, modelNo: "", barcode_s: false, barcode_m: true },
        ];
        setModelNoList(list);
        return;
      } else {
        setModelNoList([]);
      }
    }
  };

  const onTreeChecked = (checked_node) => {
    if (checked.length > 0) {
      if (checked_node.includes(checked[0])) {
        var index = checked_node.indexOf(checked[0]);
        checked_node.splice(index, 1);
      }
    }
    setChecked(checked_node);
    if (checked_node.length > 0) {
      setTemplateId(checked_node[0]);
      getTemplateDetails(userData, checked_node[0]);
    } else {
      setTemplateId("");
      setTemplateDetails("");
      setTemplateDesc("");
      setTemplateName("");
      setStationId("");
      setModelNo("");
      setOperationActionId("");
      setTemplateCharacterList([]);
      getList(userData);
    }
  };

  const onTreeClicked = (checked_node) => {
    var exp = expanded;
    if (expanded.includes(checked_node["value"].toString())) {
      const arr = expanded.filter(
        (item) => item !== checked_node["value"].toString()
      );
      setExpanded(arr);
    } else {
      exp.push(checked_node["value"].toString());
      setExpanded(exp);
    }
    if (checked_node["value"] != "") {
      if (!checked_node["value"].toString().includes(".")) {
        setTemplateId(checked_node["value"]);
        getTemplateDetails(userData, checked_node["value"]);
      }
    }
    var idList = [];
    idList.push(checked_node["value"].toString());
    setChecked(idList);

    if (templateId == "" || templateId == null) {
      //set operation name...............................
      for (var i = 0; i < operationList.length; i++) {
        if (operationList[i]["Name"] == checked_node["label"]) {
          setOperationActionId(operationList[i]["ID"]);
          getFillList(
            userData,
            stationAccordingToOperationActionId,
            operationList[i]["ID"]
          );
        }
      }
      //set spc station name...............................
      for (var i = 0; i < stationList.length; i++) {
        if (stationList[i]["NAME"] == checked_node["label"]) {
          setStationId(stationList[i]["ID"]);
        }
      }
    }
  };

  const onExpand = (exp) => {
    setExpanded(exp);
  };

  // station dropdown validate.........................................
  const onControlOptionChange = (value) => {
    setControlOption(value);
    dropdownValidate(value, "control");
  };

  // gauge dropdown validate.........................................
  const onGaugeDropdownChange = (value) => {
    setGaugeSourceId(value);
    for (var i = 0; i < gaugeSourceFillList.length; i++) {
      if (gaugeSourceFillList[i]["ID"] == value) {
        setGaugeSourceName(gaugeSourceFillList[i]["GaugeSource"]);
      }
    }
    if (!isSelectedCharTypeAttribute) {
      dropdownValidate(value, "Gauge Source");
    }
  };

  // update gauge dropdown validate.........................................
  const onUpdateGaugeDropdownChange = (value) => {
    setUpdateGaugeSourceId(value);
    if (value == "Create New Gauge") {
      CreateNewGauge();
    } else {
      setIsUpdateGauge(true);
      getGaugeDetails(value);
    }
    dropdownValidate(value, "Gauge Source");
  };

  // character type dropdown validate.........................................
  const onCharTypeDropdownChange = (value) => {
    setCharTypeId(value);
    for (var i = 0; i < charFillList.length; i++) {
      if (charFillList[i]["ID"] == value) {
        setCharTypeName(charFillList[i]["CharacteristicsType"], value);
        if (charFillList[i]["ID"] == "1") {
          setIsSelectedCharTypeAttribute(true);
          setMasterSize(0);
          setUpcl(0);
          setLpcl(0);
        } else {
          setIsSelectedCharTypeAttribute(false);
        }
      }
    }
    dropdownValidate(value, "Characteristic Type");
  };
  // unit dropdown validate.........................................
  const onUnitDropdownChange = (value) => {
    setUnitId(value);
    for (var i = 0; i < unitFillList.length; i++) {
      if (unitFillList[i]["ID"] == value) {
        setUnitName(unitFillList[i]["Unit"]);
      }
    }
    dropdownValidate(value, "Unit");
  };
  // formula dropdown validate.........................................
  const onFormulaDropdownChange = (value) => {
    setFormulaId(value);
    for (var i = 0; i < formulaFillList.length; i++) {
      if (formulaFillList[i]["ID"] == value) {
        setFormulaId(formulaFillList[i]["Name"]);
      }
    }
    dropdownValidate(value, "formula");
  };
  // com port dropdown validate.........................................
  const onMakeDropdownChange = (value) => {
    setMakerId(value);
    dropdownValidate(value, "Make");
  };
  // com port dropdown validate.........................................
  const onComDropdownChange = (value) => {
    setComId(value);
    dropdownValidate(value, "Com Port");
  };
  // channel dropdown validate.........................................
  const onChannelDropdownChange = (value) => {
    setChannelId(value);
    dropdownValidate(value, "Channel");
  };

  const onFilePick = async (file, fieldName) => {
    inputValidate(file, "attachment type");
    setFile(file);
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        imgMaxWidth,
        imgMaxHeigth,
        imgFormat,
        imgQuality,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        imgMinWidth,
        imgMinHeigth
      );
    });

  const onCharSaveClick = async () => {
    if (!isEditChar) {
      for (var i = 0; i < templateCharacterList.length; i++) {
        if (templateCharacterList[i]["CharacteristicName"] == charName) {
          toast.error("Characterstic name can not be duplicate.", {
            theme: "colored",
            autoClose: 3000,
            hideProgressBar: true,
          });
          return;
        }
      }
    }

    if (file.length > 0) {
      inputValidate(file, "attachment type");
    }

    if (file.length > 0) {
      if (!inputValidate(file, "attachment type")) {
        return;
      }
    }

    inputValidate(charName, "characteristic name");
    inputValidate(usl, "USL");
    inputValidate(lsl, "LSL");
    inputValidate(mean, "Mean");
    inputValidate(frequency, "frequency");

    dropdownValidate(charTypeId, "Characteristic Type");

    dropdownValidate(unitId, "Unit");
    dropdownValidate(formulaId, "formula");

    if (!isSelectedCharTypeAttribute) {
      inputValidate(upcl, "UPCL");
      inputValidate(lpcl, "LPCL");
      // dropdownValidate(gaugeSourceId, 'Gauge Source');
      // if (!dropdownValidate(gaugeSourceId, 'Gauge Source')) {
      //   return;
      // }
    }

    if (masterSize != "" && masterSize != null) {
      inputValidate(masterSize, "master size");
      if (!inputValidate(masterSize, "master size")) {
        return;
      }
    }

    if (!inputValidate(charName, "characteristic name")) {
      return;
    }
    if (!inputValidate(usl, "USL")) {
      return;
    }
    if (!inputValidate(lsl, "LSL")) {
      return;
    }
    if (!inputValidate(mean, "Mean")) {
      return;
    }
    if (!isSelectedCharTypeAttribute) {
      if (!inputValidate(upcl, "UPCL")) {
        return;
      }
      if (!inputValidate(lpcl, "LPCL")) {
        return;
      }
    }
    if (!inputValidate(frequency, "frequency")) {
      return;
    }
    if (!dropdownValidate(charTypeId, "Characteristic Type")) {
      return;
    }

    if (!dropdownValidate(unitId, "Unit")) {
      return;
    }
    if (!dropdownValidate(formulaId, "formula")) {
      return;
    }
    var gaugeSourceName = "";
    for (var i = 0; i < gaugeSourceFillList.length; i++) {
      if (gaugeSourceFillList[i]["ID"] == gaugeSourceId) {
        gaugeSourceName = gaugeSourceFillList[i]["GaugeSource"];
        setGaugeSourceName(gaugeSourceFillList[i]["GaugeSource"]);
      }
    }

    if (!isEditChar) {
      var base64String = "";
      if (file.length > 0) {
        setLoader(true);
        const image = await resizeFile(file[0]);
        var splitList = [];
        splitList = image.split("base64,");
        base64String = splitList[splitList.length - 1];

        setFileBase64(image);

        var map = {
          CharacteristicID: 0,
          CFlag: 1,
          SrNo: templateCharacterList.length + 1,
          CharacteristicName: charName,
          CharacteristicsTypeID: charTypeId,
          CharacteristicType: charTypeName,
          UnitID: unitId,
          Unit: unitName,
          USL: usl,
          LSL: lsl,
          Mean: mean,
          UPCL: upcl,
          LPCL: lpcl,
          MasterSize: masterSize,
          GaugeSourceID: gaugeSourceId,
          GaugeSource: gaugeSourceName,
          Frequency: frequency,
          Attachement: base64String,
          isAttachmentChanged: true,
          formula: formulaId,
          is_golden_rule: isGoldenRuleSelected,
          Golden_Rule:
            selectedGoldenList.length > 0 ? selectedGoldenList.join(", ") : "",
        };
        templateCharacterList.push(map);
        setLoader(false);
        !isEditChar ? toggleModalAddChar() : toggleModalEditChar();
        setCharName("");
        setCharTypeId("");
        setCharacteristicId("");

        setUnitId("");
        setUsl("");
        setLsl("");
        setMean("");
        setUpcl("");
        setLpcl("");
        setGaugeSourceId("");
        setMasterSize("");
        setFrequency("");
        setImageName("");
        setFormulaId("");
        toast.success("Template characteristic added in the list.", {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true,
        });
        setIsSelectedCharTypeAttribute(false);
        // await getBase64(file[0], (result) => {
        // });
      } else {
        setLoader(true);
        var map = {
          CharacteristicID: 0,
          CFlag: 1,
          SrNo: templateCharacterList.length + 1,
          CharacteristicName: charName,
          CharacteristicsTypeID: charTypeId,
          CharacteristicType: charTypeName,
          UnitID: unitId,
          Unit: unitName,
          USL: usl,
          LSL: lsl,
          Mean: mean,
          UPCL: upcl,
          LPCL: lpcl,
          MasterSize: masterSize,
          GaugeSourceID: gaugeSourceId,
          GaugeSource: gaugeSourceName,
          Frequency: frequency,
          Attachement: "",
          isAttachmentChanged: false,
          formula: formulaId,
          is_golden_rule: isGoldenRuleSelected,
          Golden_Rule:
            selectedGoldenList.length > 0 ? selectedGoldenList.join(", ") : "",
        };
        templateCharacterList.push(map);
        setLoader(false);
        !isEditChar ? toggleModalAddChar() : toggleModalEditChar();
        setCharName("");
        setCharTypeId("");
        setCharacteristicId("");

        setUnitId("");
        setUsl("");
        setLsl("");
        setMean("");
        setUpcl("");
        setLpcl("");
        setGaugeSourceId("");
        setMasterSize("");
        setFrequency("");
        setImageName("");
        setFormulaId("");
        toast.success("Template characteristic added in the list.", {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true,
        });
        setIsSelectedCharTypeAttribute(false);
      }
    } else {
      //for edit characteristic...................
      var base64String = "";
      // if new file added............................
      if (file.length > 0) {
        setLoader(true);
        const image = await resizeFile(file[0]);
        var splitList = [];
        splitList = image.split("base64,");
        base64String = splitList[splitList.length - 1];
        // let your_bytes = Buffer.from(base64String, "base64");
        // console.log('byte array : ',your_bytes);
        setFileBase64(image);
        var index = charIndexForEdit;
        var tempCharList = [...templateCharacterList]; // also fixes React mutation issue
        tempCharList[index]["CFlag"] = 1;
        tempCharList[index]["CharacteristicName"] = charName;
        tempCharList[index]["CharacteristicsTypeID"] = charTypeId;
        tempCharList[index]["CharacteristicType"] = charTypeName;
        tempCharList[index]["UnitID"] = unitId;
        tempCharList[index]["Unit"] = unitName;
        tempCharList[index]["USL"] = usl;
        tempCharList[index]["LSL"] = lsl;
        tempCharList[index]["Mean"] = mean;
        tempCharList[index]["UPCL"] = upcl;
        tempCharList[index]["LPCL"] = lpcl;
        tempCharList[index]["formula"] = formulaId;
        tempCharList[index]["MasterSize"] = masterSize;
        tempCharList[index]["GaugeSourceID"] = gaugeSourceId;
        tempCharList[index]["GaugeSource"] = gaugeSourceName;
        tempCharList[index]["Frequency"] = frequency;
        // tempCharList[index]["CharacteristicID"] = charTypeId;
        tempCharList[index]["Attachement"] = base64String;
        tempCharList[index]["isAttachmentChanged"] = true;

        setTemplateCharacterList(tempCharList);
        setLoader(false);
        !isEditChar ? toggleModalAddChar() : toggleModalEditChar();
        toast.success("Template characteristic updated into list.", {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true,
        });
        setIsSelectedCharTypeAttribute(false);
        // await getBase64(file[0], (result) => {
        // });
      } else {
        // if old file as it is......................

        setLoader(true);
        var index = charIndexForEdit;
        var tempCharList = [...templateCharacterList];
        tempCharList[index]["CFlag"] = 1;
        tempCharList[index]["CharacteristicName"] = charName;
        tempCharList[index]["CharacteristicsTypeID"] = charTypeId;
        tempCharList[index]["CharacteristicType"] = charTypeName;
        tempCharList[index]["UnitID"] = unitId;
        tempCharList[index]["Unit"] = unitName;
        tempCharList[index]["USL"] = usl;
        tempCharList[index]["LSL"] = lsl;
        tempCharList[index]["Mean"] = mean;
        tempCharList[index]["UPCL"] = upcl;
        tempCharList[index]["LPCL"] = lpcl;
        tempCharList[index]["formula"] = formulaId;
        tempCharList[index]["MasterSize"] = masterSize;
        tempCharList[index]["GaugeSourceID"] = gaugeSourceId;
        tempCharList[index]["GaugeSource"] = gaugeSourceName;
        tempCharList[index]["Frequency"] = frequency;

        setTemplateCharacterList(tempCharList);

        !isEditChar ? toggleModalAddChar() : toggleModalEditChar();
        toast.success("Template characteristics updated successfully.", {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true,
        });
        setLoader(false);
        setIsSelectedCharTypeAttribute(false);
      }
    }
  };

  const getBase64 = async (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {};
  };

  const onImageClick = (url) => {
    downloadBase64File("image/jpeg", url, "image.jpeg");
  };

  function downloadBase64File(contentType, base64Data, fileName) {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const meanCalculate = (usl, lsl) => {
    var meanData = (+usl + +lsl) / 2;
    return setMean(meanData.toString());
  };

  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  //To Create new gauge
  const CreateNewGauge = async () => {
    setGaugeNameAdd("");
    setMakerId("");
    setComId("");
    setChannelId("");
    setUWaveRNo("");
    setGroupId("");
    setChannelNo("");
    setIsUpdateGauge(false);
  };

  //To get gauge details
  const getGaugeDetails = async (gaugeId) => {
    setLoader(true);
    var result = await axiosGet(
      `${gaugeDetailsUrl}?Login_id=${userData.ID}&GaugeSourceID=${gaugeId}`
    );
    if (result != null && result["error"] == 0) {
      setGaugeNameAdd("");
      setMakerId("");
      setComId("");
      setChannelId("");
      setUWaveRNo("");
      setGroupId("");
      setChannelNo("");
      setGaugeNameAdd(result["data"][0]["GaugeSourceName"]);
      setGaugeUpdateStationId(result["data"][0]["StationID"]);
      setMakerId(result["data"][0]["Make"]);
      setUWaveRNo(result["data"][0]["UwaveRNo"]);
      setGroupId(result["data"][0]["GroupID"]);
      setChannelNo(result["data"][0]["ChannelNo"]);
      // setComId(result['data'][0]['PortNo']);
      for (var i = 0; i < comFillList.length; i++) {
        if (comFillList[i]["ID"] == result["data"][0]["PortNo"]) {
          setComId(comFillList[i]["ID"]);
        }
      }
      for (var i = 0; i < channelFillList.length; i++) {
        if (channelFillList[i]["ID"] == result["data"][0]["Channel_No"]) {
          setChannelId(channelFillList[i]["ID"]);
        }
      }
      // setChannelId(result['data'][0]['Channel_No']);
      setLoader(false);
    }
  };

  //To update gauge
  const onGaugeUpdateClick = async (gaugeId) => {
    // if(stationId == '' && gaugeUpdateStationId == ''){
    //   toast.error('Please select station first.', {
    //     autoClose: 3000,
    //     hideProgressBar: true
    //   });
    //   return;
    // }
    if (!inputValidate(gaugeNameAdd, "gauge name")) {
      return;
    }

    if (!dropdownValidate(makerId, "make")) {
      return;
    }
    // if (!dropdownValidate(comId, 'Com port')) {
    //   return;
    // }
    // if (!dropdownValidate(channelId, 'Channel')) {
    //   return;
    // }
    if (!inputValidate(uWaveRNo, "uwaver no")) {
      return;
    }
    if (!inputValidate(groupId, "group id")) {
      return;
    }
    if (!inputValidate(channelNo, "channel")) {
      return;
    }

    setLoader(true);
    var mapData = {
      Login_id: userData.ID,
      GaugeSourceID: gaugeId,
      Gauge_Name: gaugeNameAdd,
      Make: makerId,
      // "PortNo": comId,
      // "Channel_No": channelId,
      uwaver: uWaveRNo,
      group_id: groupId,
      Channel_No: channelNo,
      StationID: gaugeUpdateStationId,
      Modified_version: appVersion,
    };

    var result = await axiosPost(`${updateGaugeUrl}`, mapData);
    if (result != null && result["error"] == 0) {
      setGaugeNameAdd("");
      setMakerId("");
      setComId("");
      setChannelId("");
      setUWaveRNo("");
      setGroupId("");
      setChannelNo("");
      setUpdateGaugeSourceId("");
      setGaugeSourceFillList([]);
      getFillList(userData, gaugeSourceActionId, stationId);
      toggleModalAddGauge();

      toast.success("Gauge updated successfully.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
      setLoader(false);
    } else {
      toast.error(result["msg"], {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  //To delete gauge
  const onGaugeDeleteClick = async (gaugeId) => {
    setLoader(true);
    var result = await axiosGet(
      `${deleteGaugeUrl}?Login_id=${userData.ID}&GaugeSourceID=${gaugeId}&Deleted_version=${appVersion}`
    );
    setLoader(false);
    if (result != null && result["error"] == 0) {
      setLoader(false);
      setGaugeNameAdd("");
      setMakerId("");
      setComId("");
      setChannelId("");
      toggleModalAddGauge();
      setUpdateGaugeSourceId("");
      setGaugeSourceFillList([]);
      setTempGaugeSourceFillList([]);
      getFillList(userData, gaugeSourceActionId, stationId);
      toast.success("Gauge deleted successfully.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } else {
      toast.error(result["msg"], {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const clearValidation = () => {
    errorMap.char_name = "";
    setError(errorMap);
    if (charName != "") {
      errorMap.char_name = "";
      setError(errorMap);
    }
  };

  const onFrequencyPalletSelected = () => {
    setIsPallet(!isPallet);
    if (!isPallet) {
      setIsMachine(true);
    } else {
      setIsMachine(false);
    }
  };

  const addModelNo = async (data) => {
    var list = data;
    var map = {
      srNo: list.length + 1,
      modelNo: "",
      barcode_s: false,
      barcode_m: true,
    };
    list.push(map);
    // await timeout(1000);
    setModelNoList([...list]);
    // inputValidate(e.currentTarget.value, 'model_no')
  };

  const onBarcodeToUseChanged = (value) => {
    if (value == 1) {
      setBarcodeToUseS(true);
      setBarcodeToUseM(false);
    } else {
      setBarcodeToUseS(false);
      setBarcodeToUseM(true);
    }
  };

  const onModelBarcodeChange = (i, value) => {
    var list = [...modelNoList];
    if (value == 1) {
      list[i].barcode_s = true;
      list[i].barcode_m = false;
    } else {
      list[i].barcode_s = false;
      list[i].barcode_m = true;
    }
    // await timeout(1000);
    setModelNoList([...list]);
  };

  return (
    <>
      {isLoading ? <Loader></Loader> : null}
      <ToastContainer autoClose={5000} hideProgressBar={false} />
      <Modal
        isOpen={isOpenGoldenRuleModal}
        onRequestClose={() => toggleModalGoldenRuleModal()}
      >
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content">
            <div class="modal-header header_bg_color_red">
              <h4 class="modal-title modal_title_text">
                Choose the Golden Rule to apply
              </h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                onClick={() => setIsOpenGoldenRuleModal(!isOpenGoldenRuleModal)}
              >
                &times;
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  {/* <h3 className='pop_label'>Choose the Golden Rule to apply</h3> */}
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <ul className="list-group">
                    {goldenList.map((item, index) => (
                      <li key={index} className="list-group-item">
                        {/* Checkbox with the item title */}
                        <div className="form-check">
                          <label className="mr-3">{++index}</label>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={item.isCheck}
                            onChange={(e) => onCheckedGoldenRuleCheck(e, item)}
                          />
                          <label className="form-check-label ml-5">
                            {item.Description}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 text-right">
                  <div class="form-group text-right mt-5">
                    <a
                      class="btn save_btn"
                      onClick={() => onClickGoldenRuleApply()}
                    >
                      <i class="fa fa-check"></i>&nbsp; Apply
                    </a>
                    {/* <a class="btn cancel_btn" data-dismiss="modal" onClick={toggleModal}><i class="fa fa-times"></i>&nbsp; Can</a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isOpen} onRequestClose={toggleModal}>
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content">
            <div class="modal-header header_bg_color_red">
              <h4 class="modal-title modal_title_text">Confirm Delete</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                onClick={toggleModal}
              >
                &times;
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <h3 className="pop_label">
                    Do you really want to delete this template?
                  </h3>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 text-right">
                  <div class="form-group text-right mt-5">
                    <a class="btn save_btn" onClick={onDeleteClick}>
                      <i class="fa fa-check"></i>&nbsp; Yes
                    </a>
                    <a
                      class="btn cancel_btn"
                      data-dismiss="modal"
                      onClick={toggleModal}
                    >
                      <i class="fa fa-times"></i>&nbsp; No
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isCharDeleteOpen}
        onRequestClose={toggleModalForDeleteChar}
      >
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content">
            <div class="modal-header header_bg_color_red">
              <h4 class="modal-title modal_title_text">Confirm Delete</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                onClick={toggleModalForDeleteChar}
              >
                &times;
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <h3 className="pop_label">
                    Do you really want to delete this characteristic?
                  </h3>
                </div>
                <div class="col-md-12">
                  <div class="form-group text-right mt-5">
                    <a class="btn save_btn" onClick={() => onCharDeleteClick()}>
                      <i class="fa fa-check"></i>&nbsp; Yes
                    </a>
                    <a
                      class="btn cancel_btn"
                      data-dismiss="modal"
                      onClick={toggleModalForDeleteChar}
                    >
                      <i class="fa fa-times"></i>&nbsp; No
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isAddCharOpen}
        onRequestClose={!isEditChar ? toggleModalAddChar : toggleModalEditChar}
      >
        <div className="modal-dialog custom_modal_dialog add_char_modal_width">
          <div className="modal-content">
            <div className="modal-header header_bg_color_blue">
              <h4 className="modal-title modal_title_text">
                {isEditChar ? "Update Characteristics" : "Add Characteristics"}
              </h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => onCharDialogClose(isEditChar)}
              >
                ×
              </button>
            </div>
            {/* Modal body */}
            <div
              className="modal-body border_bottom_blue"
              style={{ height: "410px", overflow: "auto" }}
            >
              <div className="row" style={{ margin: "0px" }}>
                <div className="col-md-6 mb-2">
                  <label className="custom_label">
                    Characteristic Name<span className="star_mark">*</span>
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter Characteristic Name"
                    value={charName}
                    onInput={(e) => setCharName(e.currentTarget.value)}
                    onChange={(e) =>
                      inputValidate(
                        e.currentTarget.value,
                        "characteristic name"
                      )
                    }
                    type="text"
                  />
                  {errors.char_name.length > 0 && (
                    <span className="error">{errors.char_name}</span>
                  )}
                </div>
                <div className="col-md-6 mb-2">
                  <label className="custom_label">
                    Characteristic Type<span className="star_mark">*</span>
                  </label>
                  <select
                    className="form-control select2-no-search"
                    value={charTypeId}
                    onChange={(e) =>
                      onCharTypeDropdownChange(e.currentTarget.value)
                    }
                  >
                    <option>Choose one</option>
                    {charFillList.map((item) => (
                      <option key={item.ID} value={item.ID}>
                        {item.CharacteristicsType}
                      </option>
                    ))}
                  </select>
                  {errors.char_type_id.length > 0 && (
                    <span className="error">{errors.char_type_id}</span>
                  )}
                </div>
                <div className="col-md-6 mb-2">
                  <label className="custom_label">
                    Unit<span className="star_mark">*</span>
                  </label>
                  <select
                    className="form-control select2-no-search"
                    value={unitId}
                    onChange={(e) =>
                      onUnitDropdownChange(e.currentTarget.value)
                    }
                  >
                    <option>Choose one</option>
                    {unitFillList.map((item) => (
                      <option key={item.ID} value={item.ID}>
                        {item.Unit}
                      </option>
                    ))}
                  </select>
                  {errors.unit_id.length > 0 && (
                    <span className="error">{errors.unit_id}</span>
                  )}
                </div>
                <div className="col-md-6 mb-2">
                  <label className="custom_label">
                    USL <span className="star_mark">*</span>
                  </label>
                  <input
                    className="form-control"
                    placeholder="USL"
                    onWheel={(e) => e.target.blur()}
                    onKeyPress={preventMinus}
                    min="0"
                    value={usl}
                    onInput={(e) => setUsl(e.currentTarget.value)}
                    onChange={(e) =>
                      inputValidate(e.currentTarget.value, "USL")
                    }
                    type="number"
                  />
                  {errors.usl_data.length > 0 && (
                    <span className="error">{errors.usl_data}</span>
                  )}
                </div>
                <div className="col-md-6 mb-2">
                  <label className="custom_label">
                    LSL<span className="star_mark">*</span>{" "}
                  </label>
                  <input
                    className="form-control"
                    placeholder="LSL"
                    onWheel={(e) => e.target.blur()}
                    onKeyPress={preventMinus}
                    min="0"
                    value={lsl}
                    onInput={(e) => setLsl(e.currentTarget.value)}
                    onChange={(e) =>
                      inputValidate(e.currentTarget.value, "LSL")
                    }
                    type="number"
                  />
                  {errors.lsl_data.length > 0 && (
                    <span className="error">{errors.lsl_data}</span>
                  )}
                </div>
                <div className="col-md-6 mb-2">
                  <label className="custom_label">
                    Mean / Target<span className="star_mark">*</span>
                  </label>

                  <input
                    className="form-control"
                    placeholder="Mean / Target"
                    onWheel={(e) => e.target.blur()}
                    onKeyPress={preventMinus}
                    min="0"
                    value={mean}
                    onInput={(e) => setMean(e.currentTarget.value)}
                    onChange={(e) =>
                      inputValidate(e.currentTarget.value, "mean")
                    }
                    type="number"
                    readOnly="readOnly"
                  />

                  {errors.mean_data.length > 0 && (
                    <span className="error">{errors.mean_data}</span>
                  )}
                </div>
                {isSelectedCharTypeAttribute ? (
                  ""
                ) : (
                  <div className="col-md-6 mb-2">
                    <label className="custom_label">
                      UPCL<span className="star_mark">*</span>
                    </label>
                    <input
                      className="form-control"
                      placeholder="UPCL"
                      onWheel={(e) => e.target.blur()}
                      onKeyPress={preventMinus}
                      min="0"
                      value={upcl}
                      onInput={(e) => setUpcl(e.currentTarget.value)}
                      onChange={(e) =>
                        inputValidate(e.currentTarget.value, "UPCL")
                      }
                      type="number"
                    />
                    {errors.upcl_data.length > 0 && (
                      <span className="error">{errors.upcl_data}</span>
                    )}
                  </div>
                )}
                {isSelectedCharTypeAttribute ? (
                  ""
                ) : (
                  <div className="col-md-6 mb-2">
                    <label className="custom_label">
                      LPCL<span className="star_mark">*</span>
                    </label>
                    <input
                      className="form-control"
                      placeholder="LPCL"
                      onWheel={(e) => e.target.blur()}
                      onKeyPress={preventMinus}
                      min="0"
                      value={lpcl}
                      onInput={(e) => setLpcl(e.currentTarget.value)}
                      onChange={(e) =>
                        inputValidate(e.currentTarget.value, "LPCL")
                      }
                      type="number"
                    />
                    {errors.lpcl_data.length > 0 && (
                      <span className="error">{errors.lpcl_data}</span>
                    )}
                  </div>
                )}
                {isSelectedCharTypeAttribute ? (
                  ""
                ) : (
                  <div className="col-md-6 mb-2">
                    <label className="custom_label">Master Size</label>
                    <input
                      className="form-control"
                      placeholder="Master Size"
                      onWheel={(e) => e.target.blur()}
                      value={masterSize}
                      onInput={(e) => setMasterSize(e.currentTarget.value)}
                      onChange={(e) =>
                        inputValidate(e.currentTarget.value, "master size")
                      }
                      type="number"
                    />
                    {errors.master_size.length > 0 && (
                      <span className="error">{errors.master_size}</span>
                    )}
                  </div>
                )}

                <div className="col-md-6 mb-2">
                  <label className="custom_label">
                    Formula<span className="star_mark">*</span>
                  </label>
                  <select
                    className="form-control select2-no-search"
                    value={formulaId}
                    onChange={(e) =>
                      onFormulaDropdownChange(e.currentTarget.value)
                    }
                  >
                    <option>Choose one</option>
                    {formulaFillList.map((item) => (
                      <option key={item.ID} value={item.ID}>
                        {item.Name}
                      </option>
                    ))}
                  </select>
                  {errors.formula_id.length > 0 && (
                    <span className="error">{errors.formula_id}</span>
                  )}
                </div>

                <div className="col-md-6 mb-2">
                  <label className="custom_label">
                    Gauge Source
                    {/* {!isSelectedCharTypeAttribute ? <span className="star_mark">*</span> : ""} */}
                  </label>
                  <i
                    class="fa fa-plus-circle char_add"
                    title="Add Gauge"
                    data-toggle="modal"
                    data-target="#Add_Gauge_Source"
                    onClick={() => toggleModalAddGauge(templateId)}
                  ></i>
                  <select
                    className="form-control select2-no-search"
                    value={gaugeSourceId}
                    onChange={(e) =>
                      onGaugeDropdownChange(e.currentTarget.value)
                    }
                  >
                    <option>Choose one</option>
                    {gaugeSourceFillList.map((item) => (
                      <option key={item.ID} value={item.ID}>
                        {item.GaugeSource}
                      </option>
                    ))}
                  </select>
                  {errors.gauge_id.length > 0 && (
                    <span className="error">{errors.gauge_id}</span>
                  )}
                </div>
                <div className="col-md-6 mb-2">
                  <label className="custom_label">
                    Frequency<span className="star_mark">*</span>
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter Frequency"
                    onKeyPress={preventMinus}
                    min="0"
                    onWheel={(e) => e.target.blur()}
                    value={frequency}
                    onInput={(e) => setFrequency(e.currentTarget.value)}
                    onChange={(e) =>
                      inputValidate(e.currentTarget.value, "frequency")
                    }
                    type="number"
                    maxLength={2}
                  />
                  {errors.freq_data.length > 0 && (
                    <span className="error">{errors.freq_data}</span>
                  )}
                </div>
                <div className="col-md-6 mb-2">
                  <label className="custom_label">
                    Attachment{" "}
                    <span className="text-danger" style={{ fontSize: "9px" }}>
                      (jpg / jpeg / png allowed)
                    </span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      onFilePick(e.target.files, "attachment type")
                    }
                    className="form-control"
                    id="customFile"
                    style={{ padding: "4px 4px" }}
                    accept={".jpg,.jpeg,.png"}
                  />
                  {errors.attachment_format.length > 0 && (
                    <span className="error">{errors.attachment_format}</span>
                  )}
                </div>
                <div className="col-md-12 text-right mt-5">
                  <button
                    type="button"
                    className="btn save_btn"
                    data-dismiss="modal"
                    onClick={onCharSaveClick}
                  >
                    {isEditChar ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isAddGaugeOpen} onRequestClose={toggleModalAddGauge}>
        <div className="modal-dialog custom_modal_dialog">
          <div className="modal-content" style={{ borderRadius: "0px" }}>
            {/* Modal Header */}
            <div className="modal-header header_bg_color_blue">
              <h4 className="modal-title modal_title_text">Gauge Source</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={toggleModalAddGauge}
              >
                ×
              </button>
            </div>
            {/* Modal body */}
            <div className="modal-body border_bottom_blue">
              <div className="row">
                <div className="col-md-12 mb-2">
                  <label className="custom_label">
                    Gauge Source<span className="star_mark">*</span>
                  </label>
                  <select
                    className="form-control select2-no-search"
                    value={updateGaugeSourceId}
                    onChange={(e) =>
                      onUpdateGaugeDropdownChange(e.currentTarget.value)
                    }
                  >
                    <option>Create New Gauge</option>
                    {gaugeSourceFillList.map((item) => (
                      <option key={item.ID} value={item.ID}>
                        {item.GaugeSource}
                      </option>
                    ))}
                  </select>
                  {errors.gauge_id.length > 0 && (
                    <span className="error">{errors.gauge_id}</span>
                  )}
                </div>
                <div className="col-md-12 mb-2">
                  <label className="custom_label">Gauge Source Name</label>
                  <input
                    className="form-control"
                    placeholder="Enter Gauge Source Name"
                    value={gaugeNameAdd}
                    onInput={(e) => setGaugeNameAdd(e.currentTarget.value)}
                    onChange={(e) =>
                      inputValidate(e.currentTarget.value, "gauge name")
                    }
                    type="text"
                  />
                  {errors.gauge_name.length > 0 && (
                    <span className="error">{errors.gauge_name}</span>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mb-2">
                  <label className="custom_label">Make</label>
                  <select
                    className="form-control select2-no-search"
                    value={makerId}
                    onChange={(e) =>
                      onMakeDropdownChange(e.currentTarget.value)
                    }
                  >
                    <option label="Choose one" />
                    <option value="Mitutoyo">Mitutoyo</option>
                    <option value="Sylvac">Sylvac</option>
                    <option value="Marposs">Marposs</option>
                  </select>
                  {errors.make_id.length > 0 && (
                    <span className="error">{errors.make_id}</span>
                  )}
                </div>
              </div>
              {/* <div className="row">
                <div className="col-md-12 mb-2">
                  <label className="custom_label">COM Port<span className="star_mark">*</span></label>
                  <select className="form-control select2-no-search" value={comId} onChange={e => onComDropdownChange(e.currentTarget.value)}>
                    <option>Choose one</option>
                    {comFillList.map(item => (
                      <option
                        key={item.ID}
                        value={item.ID}>
                        {item.Port}
                      </option>
                    ))}
                  </select>
                  {errors.com_id.length > 0 && <span className='error'>{errors.com_id}</span>}
                </div>
              </div> */}
              <div className="row">
                {/* <div className="col-md-12 mb-2">
                  <label className="custom_label">Channel No<span className="star_mark">*</span></label>
                  <select className="form-control select2-no-search" value={channelId} onChange={e => onChannelDropdownChange(e.currentTarget.value)}>
                    <option>Choose one</option>
                    {channelFillList.map(item => (
                      <option
                        key={item.ID}
                        value={item.ID}>
                        {item.Channel}
                      </option>
                    ))}
                  </select>
                  {errors.channel_id.length > 0 && <span className='error'>{errors.channel_id}</span>}
                </div> */}
                <div className="col-md-12 mb-2">
                  <label className="custom_label">UwaveR No</label>
                  <input
                    className="form-control"
                    placeholder="Enter UwaveR no"
                    value={uWaveRNo}
                    onInput={(e) => setUWaveRNo(e.currentTarget.value)}
                    onChange={(e) =>
                      inputValidate(e.currentTarget.value, "uwaver no")
                    }
                    type="text"
                  />
                  {errors.uwaver_name.length > 0 && (
                    <span className="error">{errors.uwaver_name}</span>
                  )}
                </div>
                <div className="col-md-12 mb-2">
                  <label className="custom_label">Group ID</label>
                  <input
                    className="form-control"
                    placeholder="Enter group id"
                    value={groupId}
                    onInput={(e) => setGroupId(e.currentTarget.value)}
                    onChange={(e) =>
                      inputValidate(e.currentTarget.value, "group id")
                    }
                    type="text"
                  />
                  {errors.groupid_name.length > 0 && (
                    <span className="error">{errors.groupid_name}</span>
                  )}
                </div>
                <div className="col-md-12 mb-2">
                  <label className="custom_label">Channel No</label>
                  <input
                    className="form-control"
                    placeholder="Enter channel no"
                    value={channelNo}
                    onInput={(e) => setChannelNo(e.currentTarget.value)}
                    onChange={(e) =>
                      inputValidate(e.currentTarget.value, "channel")
                    }
                    type="text"
                  />
                  {errors.channel_name.length > 0 && (
                    <span className="error">{errors.channel_name}</span>
                  )}
                </div>
              </div>
              <div className="row">
                {isUpdateGauge ? (
                  <div className="col-md-12 text-right mt-5">
                    <button
                      type="button"
                      className="btn update_btn"
                      data-dismiss="modal"
                      onClick={() => onGaugeUpdateClick(updateGaugeSourceId)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn delete_btn"
                      data-dismiss="modal"
                      onClick={() => onGaugeDeleteClick(updateGaugeSourceId)}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="col-md-12 text-right mt-5">
                    <button
                      type="button"
                      className="btn save_btn"
                      data-dismiss="modal"
                      onClick={() => onGaugeSaveClick()}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* //====  Modal for characteristics image*/}
      <Modal isOpen={isImageModalOpen} onRequestClose={toggleModalDisplayImage}>
        {/* <div id="attachment_link" className="modal fade" role="dialog"> */}

        <div
          className="modal-dialog custom_modal_dialog"
          style={{ width: "440px" }}
        >
          <div className="modal-content" style={{ borderRadius: "0px" }}>
            <div className="modal-body" style={{ padding: "0.5rem" }}>
              <div className="row">
                <div className="col-md-12">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    style={{
                      fontSize: "30px",
                      position: "absolute",
                      zIndex: "1",
                      right: "10px",
                      top: "-1px",
                      background: "white",
                      opacity: "1",
                      lineHeight: "20px",
                      height: "30px",
                      width: "30px",
                    }}
                    onClick={toggleModalDisplayImage}
                  >
                    ×
                  </button>
                  <img
                    src={`data:image/jpeg;base64,${imageName}`}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Modal>
      <Header activeId={"isTemplateActiveColor"} />

      <div className="az-content pd-y-0 pd-lg-y-0 pd-xl-y-0">
        <div className="container-fluid">
          <div
            className="az-content-left az-content-left-components"
            id="mySidebar"
          >
            <button
              className="wrapperrr_div_close"
              id="closeNavi"
              onClick="openNav()"
            >
              <i className="fa fa-times"></i>
            </button>

            <div className="component-item">
              <label className="list_name_class">List</label>

              <nav className="nav flex-column left_menu tree_part_padd_left">
                {/* <Treebeard style={Treebeard.defaultStyle} data={dataa} onToggle={onToggle}/> */}
                {/* <DropdownTreeSelect data={dataa} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} />, */}
                <CheckboxTree
                  nodes={dataa}
                  checked={checked}
                  expanded={expanded}
                  onClick={(value) => onTreeClicked(value)}
                  onCheck={(checked) => onTreeChecked(checked)}
                  onExpand={(exp) => onExpand(exp)}
                  onlyLeafCheckboxes={true}
                  showNodeIcon={false}
                />
              </nav>
              <a
                className="btn btn-primary add_btn"
                id="add_btn_id"
                onClick={() => clearField()}
              >
                <i className="fa fa-plus" />
              </a>

              <div className="version_class">
                <p>Version : 1.0.0 Build 20220511</p>
                <p>Copyright © 2022 | All Rights Reserved</p>
              </div>
            </div>
          </div>
          {/* az-content-left */}
          <div
            className="az-content-body pd-lg-l-40 d-flex flex-column"
            id="main"
          >
            <button
              className="wrapperrr_div_open"
              id="openNavi"
              onClick="openNav()"
            >
              <i className="fa fa-chevron-right"></i>
            </button>

            {/* <div className="az-content-breadcrumb">
            <span>Dashboard</span>
            <span>Template</span>
          </div> */}
            <h2 className="az-content-title">Template</h2>
            <h6
              class={
                isActive == 1 ? "active_status" : "active_status text-danger"
              }
            >
              {statusName != "" ? statusName : ""}
            </h6>
            {/* <div class="az-content-label mg-b-5">Form Input &amp; Textarea</div>
          <p class="mg-b-20">A basic form control input and textarea with disabled and readonly mode.</p> */}
            <div className="row">
              <div className="col-3 form-group">
                <label className="custom_label">
                  Select the Operation Line<span className="star_mark">*</span>
                </label>
                <select
                  className="form-control select2-no-search"
                  value={operationId}
                  onChange={(e) =>
                    onOperationDropdownChange(e.currentTarget.value)
                  }
                >
                  <option>Choose one</option>
                  {operationList.map((item) => (
                    <option key={item.ID} value={item.ID}>
                      {item.Name}
                    </option>
                  ))}
                </select>
                {errors.operation.length > 0 && (
                  <span className="error">{errors.operation}</span>
                )}
              </div>
              <div className="col-3 form-group">
                <label className="custom_label">
                  Select the SPC Station<span className="star_mark">*</span>
                </label>
                <select
                  className="form-control select2-no-search"
                  value={stationId}
                  onChange={(e) =>
                    onStationDropdownChange(e.currentTarget.value)
                  }
                >
                  <option>Choose one</option>
                  {stationList.map((item) => (
                    <option key={item.ID} value={item.ID}>
                      {item.NAME}
                    </option>
                  ))}
                </select>
                {errors.station.length > 0 && (
                  <span className="error">{errors.station}</span>
                )}
              </div>
              <div className="col-3 form-group">
                <label className="custom_label">
                  Template/Program Name<span className="star_mark">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Enter Template Name"
                  value={templateName}
                  onInput={(e) => setTemplateName(e.currentTarget.value)}
                  onChange={(e) =>
                    inputValidate(e.currentTarget.value, "template name")
                  }
                  type="text"
                  maxLength={inputMaxLength}
                />
                {errors.template_name.length > 0 && (
                  <span className="error">{errors.template_name}</span>
                )}
              </div>
            </div>

            {/* <div className="row">
              <div className="col-3 form-group">
                <label className="custom_label">Model No.</label>
                <input className="form-control" placeholder="Enter Model No." value={modelNo} onInput={e => setModelNo(e.currentTarget.value)} onChange={(e) => inputValidate(e.currentTarget.value, 'model no.')} type="text" />
                {errors.model_no.length > 0 && <span className='error'>{errors.model_no}</span>}
              </div>
            </div> */}
            <div className="row">
              <div className="col-6 form-group">
                <label className="custom_label">
                  Template Description<span className="star_mark">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Enter Template Description"
                  value={templateDesc}
                  onInput={(e) => setTemplateDesc(e.currentTarget.value)}
                  onChange={(e) =>
                    inputValidate(e.currentTarget.value, "template description")
                  }
                  type="text"
                />
                {errors.template_desc.length > 0 && (
                  <span className="error">{errors.template_desc}</span>
                )}
              </div>
              {modelNoList.length > 0 ? (
                <div className="col-6">
                  <div className="row">
                    <label
                      className="custom_label"
                      style={{ marginLeft: "14px", width: "100%" }}
                    >
                      Barcode To Use<span className="star_mark">*</span>
                    </label>
                    <div className="col-md-3 mt-3">
                      <label className="rdiobox">
                        <input
                          name="rdioo"
                          type="radio"
                          checked={barcodeToUseS}
                          onChange={(e) => onBarcodeToUseChanged(1)}
                        />
                        <span>Supplier</span>
                      </label>
                    </div>
                    <div className="col-md-5 mt-3">
                      <label className="rdiobox">
                        <input
                          name="rdioo"
                          type="radio"
                          checked={barcodeToUseM}
                          onChange={(e) => onBarcodeToUseChanged(2)}
                        />
                        <span>Mahindra</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            {/* {modelNoList.length > 0 ? (
              <div className="row">
                <div className="col-6 form-group">
                  <div className='d-flex justify-content-md-between'><label className="custom_label">Model No<span className="star_mark">*</span></label>
                    <a ><i className="fa fa-plus-circle add_characteristic_table mx-4" style={{ width: '5px', height: '5px' }} title="Add Model No" onClick={() => addModelNo(modelNoList)} /></a>
                  </div>
                  {modelNoList.map((item, i) => (
                    <>
                      <div className="row">
                        <input key={item.srNo} className="form-control" placeholder="Enter Model No" value={item.modelNo} onInput={e => item.modelNo = e.currentTarget.value} onChange={(e) => inputValidate(e.currentTarget.value, 'model_no')} maxLength='50' />
                        <div className="col-md-5">
                          <label className="rdiobox">
                            <input name={"rdio" + i} type="radio" checked={item.barcode_s} onChange={() => onModelBarcodeChange(i, 1)} />
                            <span>Supplier</span>
                          </label>
                        </div>
                        <div className="col-md-5">
                          <label className="rdiobox">
                            <input name={"rdio" + i} type="radio" checked={item.barcode_m} onChange={() => onModelBarcodeChange(i, 2)} />
                            <span>Mahindra</span>
                          </label>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            ) : (null)} */}

            <div className="row">
              <div className="col-md-12">
                <div
                  className="custom_tabs"
                  style={{ marginTop: "25px", position: "relative" }}
                >
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item active">
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#Characteristics"
                        role="tab"
                      >
                        Characteristics
                      </a>
                    </li>
                    <li className="nav-item active">
                      {/* {...isFocusOpenOptionTab ? `className="nav-link active show"`:  `className="nav-link "` } */}
                      <a
                        className="nav-link "
                        data-toggle="tab"
                        href="#Options"
                        role="tab"
                      >
                        Options
                      </a>
                    </li>
                  </ul>
                  {/* Tab panes */}
                  <div className="tab-content">
                    <div
                      className="tab-pane active"
                      id="Characteristics"
                      role="tabpanel"
                    >
                      <div
                        className="row"
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "15px",
                        }}
                      >
                        <div className="">{/* <h5>Characteristics</h5> */}</div>
                        <div className="">
                          <a
                            className="btn btn-secondary Add_Gauge_btn"
                            data-toggle="modal"
                            data-target="#Add_Gauge_Source"
                            onClick={() => toggleModalAddGauge(templateId)}
                          >
                            Gauge Source
                          </a>
                          <a>
                            <i
                              className="fa fa-plus-circle add_characteristic_table"
                              title="Add Characteristics"
                              data-toggle="modal"
                              data-target="#Add_in_table"
                              onClick={() => toggleModalAddChar(templateId)}
                            />
                          </a>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table_wrapper">
                            <div className="hack1">
                              <div className="hack2">
                                <table className="table table-striped table-bordered mg-b-15">
                                  <thead>
                                    <tr>
                                      {/* <th>
                                        <label className="ckbox">
                                          <inpeut type="checkbox" /><span> </span>
                                        </label>
                                      </th> */}
                                      <th
                                        className="text-center"
                                        style={{
                                          width: "100px",
                                          minWidth: "100px",
                                        }}
                                      >
                                        Action
                                      </th>
                                      <th>Sr.No</th>
                                      <th>Characteristics Name</th>
                                      <th>Characteristics Type</th>
                                      <th>Unit</th>
                                      <th>USL</th>
                                      <th>LSL</th>
                                      <th>Mean / Target</th>
                                      <th>UPCL</th>
                                      <th>LPCL</th>
                                      <th>Formula</th>
                                      <th>Master Size</th>
                                      <th>Gauge Source</th>
                                      <th>Freq</th>
                                      <th className="text-center">
                                        Attachments
                                      </th>
                                      <th>Golden Rule</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {templateCharacterList.length === 0 ? (
                                      <>
                                        <tr
                                           
                                          style={{ height: "40px" }}
                                        >
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td> </td>
                                          <td> </td>
                                        </tr>
                                        <tr
                                           
                                          style={{ height: "40px" }}
                                        >
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td> </td>
                                          <td> </td>
                                        </tr>
                                        <tr
                                           
                                          style={{ height: "40px" }}
                                        >
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td> </td>
                                          <td> </td>
                                        </tr>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {templateCharacterList.map((data, i) => (
                                      <tr key={data.CharacteristicID ?? data.SrNo ?? i}>
                                        {/* <td>
                                        <label className="ckbox">
                                          <input type="checkbox" defaultChecked /><span> </span>
                                        </label>
                                      </td> */}
                                        <td
                                          className="text-center"
                                          style={{ width: "110px" }}
                                        >
                                          {i != 0 ? (
                                            <i
                                              className="fa fa-arrow-up icon_font"
                                              title="Up"
                                              onClick={() =>
                                                swipeItem(i, i - 1)
                                              }
                                            />
                                          ) : null}
                                          {i !=
                                          templateCharacterList.length - 1 ? (
                                            <i
                                              className="fa fa-arrow-down icon_font"
                                              title="Down"
                                              onClick={() =>
                                                swipeItem(i, i + 1)
                                              }
                                            />
                                          ) : null}

                                          <i
                                            className="fa fa-edit icon_font"
                                            data-toggle="modal"
                                            data-target="#Add_in_table"
                                            title="Edit"
                                            onClick={() =>
                                              toggleModalEditChar(data, i)
                                            }
                                          />
                                          <i
                                            className="fa fa-trash icon_font"
                                            data-toggle="modal"
                                            data-target="#delete_pop_modal"
                                            title="Delete"
                                            onClick={() =>
                                              toggleModalForDeleteChar(i + 1)
                                            }
                                          />
                                        </td>
                                        <td>{i + 1}</td>
                                        <td>{data.CharacteristicName}</td>
                                        <td>{data.CharacteristicType}</td>
                                        <td>{data.Unit}</td>
                                        <td>{data.USL}</td>
                                        <td>{data.LSL}</td>
                                        <td>{data.Mean}</td>
                                        <td>
                                          {data.UPCL != null && data.UPCL != 0
                                            ? data.UPCL
                                            : "-"}
                                        </td>
                                        <td>
                                          {data.LPCL != null && data.LPCL != 0
                                            ? data.LPCL
                                            : "-"}
                                        </td>
                                        <td>
                                          {data.formula != null &&
                                          data.formula != 0
                                            ? data.formula
                                            : "-"}
                                        </td>
                                        <td>
                                          {data.MasterSize != null &&
                                          data.MasterSize != 0
                                            ? data.MasterSize
                                            : "-"}
                                        </td>
                                        <td>
                                          {data.GaugeSource != null &&
                                          data.GaugeSource != 0
                                            ? data.GaugeSource
                                            : "-"}
                                        </td>
                                        <td>{data.Frequency}</td>
                                        <td className="text-center">
                                          {data.Attachement != null &&
                                          data.Attachement != "" ? (
                                            <a
                                              href="#"
                                              data-toggle="modal"
                                              data-target="#attachment_link"
                                              title="View Attachment"
                                              style={{
                                                boxShadow: "none",
                                                padding: "0px 0px",
                                              }}
                                              className="btn"
                                              onClick={() =>
                                                toggleModalDisplayImage(
                                                  data.Attachement
                                                )
                                              }
                                            >
                                              <i
                                                class="fa fa-file icon_font attachment_icon"
                                                title="View Attachment"
                                              ></i>
                                            </a>
                                          ) : (
                                            "-"
                                          )}
                                        </td>
                                        <td>
                                          <div className="col-md-5">
                                            <input
                                              name="rdioo"
                                              type="checkbox"
                                              className="rdiobox"
                                              checked={data.is_golden_rule}
                                              onChange={(e) =>
                                                toggleModalGoldenRuleModal(
                                                  e,
                                                  data
                                                )
                                              }
                                            />
                                          </div>

                                          {/* <div className="col-md-5 ">
                                            <input name="rdioo" type="radio" className="rdiobox" checked={data.is_golden_rule } onChange={(e) => toggleModalGoldenRuleModal(e,data)} />

                                          </div> */}
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
                    </div>

                    <div className="tab-pane" id="Options" role="tabpanel">
                      <div className="row">
                        <div className="col-md-8">
                          <p
                            style={{
                              display: "flex",
                              lineHeight: 2,
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span style={{ margin: "0px 8px" }}>
                              Control chart display option
                              <span className="star_mark">*</span>
                            </span>
                            <div className="col-3 form-group">
                              <select
                                className="form-control select2-no-search"
                                value={optionId}
                                onChange={(e) =>
                                  onControlOptionChange(e.currentTarget.value)
                                }
                              >
                                <option>Choose one</option>
                                {optionFillList.map((item) => (
                                  <option key={item.ID} value={item.ID}>
                                    {item.FreqOption}
                                  </option>
                                ))}
                              </select>
                              {errors.option_id.length > 0 && (
                                <span className="error">
                                  {errors.option_id}
                                </span>
                              )}
                            </div>
                            <div className="col-3 form-group">
                              <input
                                type="text"
                                className="form-control"
                                style={{ lineHeight: 1, margin: "0px 8px" }}
                                value={controlOptionName}
                                onInput={(e) =>
                                  setControlOptionName(e.currentTarget.value)
                                }
                                onChange={(e) =>
                                  inputValidate(e.currentTarget.value, "option")
                                }
                              />
                              {errors.option_name.length > 0 && (
                                <span
                                  className="error"
                                  style={{ paddingLeft: "9px" }}
                                >
                                  {errors.option_name}
                                </span>
                              )}
                            </div>
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <h6>
                            Frequency to be controlled on the basis of
                            <span className="star_mark">*</span>
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-2 form-group">
                          <label className="ckbox">
                            <input
                              type="checkbox"
                               
                              defaultChecked={isTemplate}
                              onChange={() => setIsTemplate(!isTemplate)}
                            />
                            <span>Template</span>
                          </label>
                        </div>
                        <div className="col-lg-2 mg-t-20 mg-lg-t-0 form-group">
                          <label className="ckbox">
                            <input
                              type="checkbox"
                               
                              defaultChecked={isMachine}
                              onChange={() => setIsMachine(!isMachine)}
                            />
                            <span>Machine</span>
                          </label>
                        </div>
                        <div className="col-lg-2 mg-t-20 mg-lg-t-0 form-group">
                          <label className="ckbox">
                            <input
                              type="checkbox"
                               
                              defaultChecked={isPallet}
                              onChange={() => onFrequencyPalletSelected()}
                            />
                            <span>Pallet</span>
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 mt-3">
                          <p style={{ display: "flex", lineHeight: 2 }}>
                            Auto set Control limit on the basis of past
                            <span className="star_mark">*</span>
                            <div style={{ width: "13%" }}>
                              <input
                                type="number"
                                className="form-control"
                                style={{
                                  width: "86%",
                                  lineHeight: 1,
                                  margin: "0px 8px",
                                  height: "28px",
                                }}
                                value={monthOfReading}
                                onInput={(e) =>
                                  setMonthOfReading(e.currentTarget.value)
                                }
                                onChange={(e) =>
                                  inputValidate(e.currentTarget.value, "value")
                                }
                              />
                              {errors.reading.length > 0 && (
                                <span className="error">{errors.reading}</span>
                              )}
                            </div>{" "}
                            month(s) of readings.
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <p style={{ color: "red", marginBottom: "0px" }}>
                            Note : This will run on 1st of every month between
                            8AM to 10AM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {templateId != "" ? (
              <div className="row mt-3">
                <div className="col-12">
                  <div id="accordion">
                    <div className="card">
                      <div className="card-header">
                        <a
                          href="#demo"
                          data-toggle="collapse"
                          aria-expanded="false"
                        >
                          System Details <i className="fas fa-chevron-down" />
                        </a>
                      </div>
                      <div id="demo" className="collapse ">
                        {" "}
                        {/* show */}
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Entry User</label>
                              <input
                                type="text"
                                className="form-control"
                                value={createdUser == NA ? "-" : createdUser}
                                readonly="readonly"
                              />
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">Entry Date</label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control fc-datepicker"
                                  value={createdDate == NA ? "-" : createdDate}
                                  readonly="readonly"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">
                                Entry Version
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  createdVersion == NA ? "-" : createdVersion
                                }
                                readonly="readonly"
                              />
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">
                                Modified User
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={modifiedUser == NA ? "-" : modifiedUser}
                                readonly="readonly"
                              />
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">
                                Modified Date
                              </label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control fc-datepicker"
                                  value={
                                    modifiedDate == NA ? "-" : modifiedDate
                                  }
                                  readonly="readonly"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">
                                Modified Version
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  modifiedVersion == NA ? "-" : modifiedVersion
                                }
                                readonly="readonly"
                              />
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">
                                Deleted User
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={deletedUser == NA ? "-" : deletedUser}
                                readonly="readonly"
                              />
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">
                                Deleted Date
                              </label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control fc-datepicker"
                                  value={deletedDate == NA ? "-" : deletedDate}
                                  readonly="readonly"
                                />
                              </div>
                            </div>
                            <div className="col-md-4 form-group">
                              <label className="custom_label">
                                Deleted Version
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  deletedVersion == NA ? "-" : deletedVersion
                                }
                                readonly="readonly"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <hr className="mg-y-15" />
            {/* <Footer /> */}

            <div className="az-footer mg-t-auto" id="az_footer_id">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 text-right">
                    {templateId == "" && isWriteAccess ? (
                      <button
                        type="button"
                        className="btn save_btn"
                        onClick={onSaveClick}
                      >
                        <i class="fa fa-save"></i>&nbsp; Save
                      </button>
                    ) : null}
                    {templateId != "" && isWriteAccess && isActive == 1 ? (
                      <button
                        type="button"
                        className="btn update_btn"
                        onClick={onUpdateClick}
                      >
                        <i class="fa fa-save"></i>&nbsp; Update
                      </button>
                    ) : null}
                    {templateId != "" &&
                    isWriteAccess &&
                    isActive == 1 &&
                    isShowReplicate ? (
                      <button
                        type="button"
                        className="btn update_btn"
                        onClick={onReplicateClick}
                      >
                        <i class="fa fa-copy"></i>&nbsp; Replicate
                      </button>
                    ) : null}
                    {templateId != "" && isDeleteAccess && isActive == 1 ? (
                      <button
                        type="button"
                        className="btn delete_btn"
                        data-toggle="modal"
                        data-target="#delete_pop_modal"
                        onClick={() => toggleModal(templateId)}
                      >
                        <i class="fa fa-trash-o"></i>&nbsp; Delete
                      </button>
                    ) : null}
                    {/* <button type="button" className="btn" onClick={onBackClick}>Back</button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* container */}
      </div>
      {/* az-content */}
    </>
  );
};
export default Template;
