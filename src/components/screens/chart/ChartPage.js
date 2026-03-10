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
  dropdownValidatorForCustomDate,
  inputWithRangeValidator,
  inputValidatorForPallet,
  dateValidator,
} from "../../utils/Validator";
import {
  templateListUrl,
  getXlsUrl,
  getMesUrl,
  templateDetailsUrl,
  chartDataUrl,
  appVersion,
  NA,
  statusActionId,
  fillListUrl,
  stationActionId,
  templateActionId,
  palletActionId,
  machineActionId,
  charactersticActionId,
  eventActionId,
  exportOptionActionId,
  stationWithOperationActionId,
} from "../../utils/constants";
import queryString from "query-string";
import $, { data } from "jquery";

import { axiosGet, axiosPost } from "../framework/Axios";
import Header from "../common_components/Header";
import Footer from "../common_components/Footer";
import moment from "moment";
import Modal from "react-modal";
// import Precontrol from './Precontrol/precontrol';
import MainChart from "./Precontrol/MainChart";
import XbarChart from "./Xbar/xbarChart";
// import RunChart from './run_chart/RunChart';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import groupBy from "lodash/groupBy";
// import CalendarIcon from "@material-ui/icons/Calendar";
import { FaCalendarAlt } from "react-icons/fa";
import ChartDetails from "./ChartDetails";

// const calendarIcon = <CalendarIcon />;

Modal.setAppElement("#root");

var c_chartConfig;
var c_charTableData;
var c_xyList;
var c_selectedCharNameList;
var c_chartTypeId;
var c_data_table;
var c_chartViewType;
var c_selectedData;
const ChartPage = (props) => {
  const errorMap = {
    chart_no: "",
    chart_name: "",
    no_of_reading: "",
    station: "",
    template: "",
    machine: "",
    pallet: "",
    customDate: "",
    chart_type: "",
    subgroup: "",
    from_Date: "",
    to_Date: "",
  };
  const [userData, setUserData] = useState({});
  const [chartList, setChartList] = useState([]);
  const [tempChartList, setTempChartList] = useState([]);
  const [chartAccessList, setChartAccessList] = useState([]);
  const [chartDetails, setChartDetails] = useState({});
  const [chartConfig, setChartConfig] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [xyPairData, setXYPairData] = useState([]);
  const [chartId, setChartId] = useState("");
  const [chartCode, setChartCode] = useState("");
  const [chartName, setChartName] = useState("");
  const [noOfReading, setNoOfReading] = useState("");
  const [isATA, setATA] = useState(false);
  const [createdUser, setCreatedUser] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [createdVersion, setCreatedVersion] = useState("");
  const [modifiedUser, setModifiedUser] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [modifiedVersion, setModifiedVersion] = useState("");
  const [deletedUser, setDeletedUser] = useState("");
  const [deletedDate, setDeletedDate] = useState("");
  const [deletedVersion, setDeletedVersion] = useState("");
  const [deleteChartId, setChartIdForDelete] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setError] = useState(errorMap);
  const history = useHistory();
  const [isWriteAccess, setWriteAccess] = useState(false);
  const [isDeleteAccess, setDeleteAccess] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [statusId, setStatusId] = useState("");
  const [stationId, setStationId] = useState("");
  const [sStationActionIdList, setSStationActionIdList] = useState([]);
  const [sStationActionId, setSStationActionId] = useState("");
  const [sMachineActionIdList, setSMachineActionIdList] = useState([]);
  const [sMachineActionId, setSMachineActionId] = useState("");
  const [sTemplateActionIdList, setTemplateActionIdList] = useState([]);
  const [sTemplateActionId, setTemplateActionId] = useState("");
  const [sPalletActionIdList, setPalletActionIdList] = useState([]);
  const [characteristicsIdList, setCharacteristicsIdList] = useState([]);
  const [characteristicsIdTempList, setCharacteristicsIdTempList] = useState(
    []
  );
  const [selectedCharNameList, setSelectedCharName] = useState([]);
  const [CharacteristicsId, setCharacteristicsId] = useState("");
  const [sPalletActionId, setPalletActionId] = useState("1,2");
  const [dateRangeTypeList, setDateRangeTypeList] = useState([]);
  const [dateRangeTypeName, setDateRangeTypeName] = useState("Previous month");
  const [isDisplayDate, setIsDisplayDate] = useState(false);
  const [chartFromDate, setChartFromDate] = useState("");
  const [chartToDate, setChartToDate] = useState("");
  const [firstShift, setFirstShift] = useState(true);
  const [secondShift, setSecondShift] = useState(true);
  const [thirdShift, setThirdShift] = useState(true);
  const [chartTypeId, setChartTypeId] = useState("");
  const [runChart, setRunChart] = useState(false);
  const [xBarRChart, setXBarRChart] = useState(false);
  const [pChart, setPChart] = useState(false);
  const [cChart, setCChart] = useState(false);
  const [npChart, setNPChart] = useState(false);
  const [subGroupId, setSubGroupId] = useState("4");
  const [eventIdList, setEventIdList] = useState([]);
  const [eventIdTempList, setEventIdTempList] = useState([]);
  const [eventIds, setEventIds] = useState("");
  const [controlLimitOption, setControlLimitOption] = useState("");
  const [pastControlLimitOption, setPastControlLimitOption] = useState(true);
  const [currentcontrolLimitOption, setCurrentControlLimitOption] =
    useState(false);
  const [timeBasedChart, setTimeBasedChart] = useState(true);
  const [pointBasedChart, setPointBasedChart] = useState(false);
  const [exportOptionList, setExportOptionList] = useState([]);
  const [exportOptionIds, setExportOptionIds] = useState("");
  const [charViewSelected, setCharViewSelected] = useState(false);
  const [charSelected, setCharSelected] = useState(false);
  const [eventViewSelected, setEventViewSelected] = useState(false);
  const [dataa, setData] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [templateDetails, setTemplateDetails] = useState({});
  const [templateId, setTemplateId] = useState("");
  // const [templateName, setTemplateName] = useState('');
  const [chartDesc, setChartDesc] = useState("");
  const [modelNo, setModelNo] = useState("");
  const [chartCharacterList, setChartCharacterList] = useState([]);
  const [isShowSubGroupAndControlLimit, setIsShowSubGroupAndControlLimit] =
    useState(false);
  const [isShowChartView, setIsShowChartView] = useState(false);
  const [isShowChart, setIsShowChart] = useState(false);
  const [isOperationSelected, setIsOperationSelected] = useState(true);
  const [isStationSelected, setIsStationSelected] = useState(true);

  useEffect(async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData != null) {
      setUserData(userData);
      if (userData["userAccess"].length > 0) {
        for (var i = 0; i < userData["userAccess"].length; i++) {
          if (userData["userAccess"][i]["ModuleID"] == 9) {
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
      setChartId(props.location.state.chartId);
    }
    getList(userData);
    getFillList(userData, stationWithOperationActionId, "");
    getFillList(userData, palletActionId, "");
    getFillList(userData, eventActionId, "");
    getFillList(userData, templateActionId, "");
    getFillList(userData, machineActionId, "");
    getFillList(userData, exportOptionActionId, "");

    // getChartAccess(userData);
  }, []);

  const getFillList = async (data, actionId, stationId) => {
    var result = await axiosGet(
      `${fillListUrl}?actionid=${actionId}&userid=${data.ID}&String=${stationId}`
    );
    if (result != null && result["error"] == 0) {
      if (actionId == stationWithOperationActionId) {
        setSStationActionIdList(result["data"]);
      } else if (actionId == machineActionId) {
        setSMachineActionIdList(result["data"]);
      } else if (actionId == templateActionId) {
        setTemplateActionIdList(result["data"]);
      } else if (actionId == palletActionId) {
        var palletList = result["data"];
        for (var i = 0; i < palletList.length; i++) {
          palletList[i]["isCheck"] = true;
        }
        setPalletActionIdList(palletList);
      } else if (actionId == charactersticActionId) {
        var charList = result["data"];
        for (var i = 0; i < charList.length; i++) {
          charList[i]["isCheck"] = false;
        }
        setCharacteristicsIdList(charList);
        setCharacteristicsIdTempList(charList);
      } else if (actionId == eventActionId) {
        var eventList = result["data"];
        for (var i = 0; i < eventList.length; i++) {
          eventList[i]["isCheck"] = false;
        }
        setEventIdList(eventList);
        setEventIdTempList(eventList);
      } else if (actionId == exportOptionActionId) {
        var exportList = result["data"];
        for (var i = 0; i < exportList.length; i++) {
          exportList[i]["isCheck"] = false;
        }
        setExportOptionList(exportList);
      }
    }
  };

  const setFieldData = () => {
    var data = localStorage.getItem("chartSearch");
    if (data != null && data != undefined) {
      setSStationActionId(data["StationId"]);
      setTemplateActionId(data["TemplateId"]);
      setSMachineActionId(data["MachineId"]);
      setPalletActionId(data["Pallete"]);
      setCharacteristicsId(data["CharacteristicsId"]);
      setDateRangeTypeName(data["DateRangeType"]);
      setChartFromDate(data["FromDate"]);
      setChartToDate(data["ToDate"]);
      setFirstShift(data["Shift1"]);
      setSecondShift(data["Shift2"]);
      setThirdShift(data["Shift3"]);
      setChartTypeId(data["ChartTypeID"]);
      setSubGroupId(data["Subgroup"]);
      setEventIds(data["EventIds"]);
      setControlLimitOption(data["ControlLimitOption"]);
      setExportOptionIds(data["ExportOptionIds"]);
    }
  };

  // api call for Chart data........................
  const getChartData = async () => {
    if (chartToDate == "" || chartToDate == null) {
      // modifyToDate = modifyFromDate;
      setChartToDate(chartFromDate);
    }
    dropdownValidate(sStationActionId, "Spc station");
    dropdownValidate(sTemplateActionId, "template");
    inputValidate(chartTypeId, "chart type");
    // dropdownValidate(dateRangeTypeName, 'customDate')

    if (!dropdownValidate(sStationActionId, "Spc station")) {
      return;
    }
    if (!dropdownValidate(sTemplateActionId, "template")) {
      return;
    }
    if (!inputValidate(chartTypeId, "chart type")) {
      return;
    }
    // if (!dropdownValidate(dateRangeTypeName, 'customDate')) {
    //   return;
    // }

    if (dateRangeTypeName == "Custom Period") {
      dateValidate(chartFromDate, "from date", chartToDate);
      if (chartToDate != null && chartToDate != "") {
        dateValidate(chartToDate, "to date", chartFromDate);
      }
      if (!dateValidate(chartFromDate, "from date", chartToDate)) {
        return;
      }
      if (chartToDate != null && chartToDate != "") {
        if (!dateValidate(chartToDate, "to date", chartFromDate)) {
          return;
        }
      }
    }

    if (isShowSubGroupAndControlLimit) {
      dropdownValidate(subGroupId, "subgroup size");
      if (!dropdownValidate(subGroupId, "subgroup size")) {
        return;
      }
    }

    setLoader(true);
    const chartQueryParam = {
      Login_id: userData.ID,
      StationId: sStationActionId != "" ? sStationActionId : null,
      TemplateId: sTemplateActionId != "" ? sTemplateActionId : null,
      MachineId:
        sMachineActionId != "" && sMachineActionId != "Choose one"
          ? sMachineActionId
          : null,
      Pallete: sPalletActionId != "" ? sPalletActionId : null,
      CharacteristicsId: CharacteristicsId != "" ? CharacteristicsId : null,
      DateRangeType: dateRangeTypeName != "" ? dateRangeTypeName : null,
      FromDate: moment(chartFromDate).format("YYYY-MM-DD").toString(),
      ToDate:
        chartToDate != null && chartToDate != ""
          ? moment(chartToDate).format("YYYY-MM-DD").toString()
          : moment(chartFromDate).format("YYYY-MM-DD").toString(),
      Shift1: firstShift != "" ? firstShift : null,
      Shift2: secondShift != "" ? secondShift : null,
      Shift3: thirdShift != "" ? thirdShift : null,
      ChartTypeID: chartTypeId != "" ? chartTypeId : null,
      Subgroup: subGroupId != "" ? subGroupId : null,
      EventIds: eventIds != "" ? eventIds : null,
      ControlLimitOption: controlLimitOption != "" ? controlLimitOption : null,
      ExportOptionIds: exportOptionIds != "" ? exportOptionIds : null,
    };

    console.log("url : ", chartDataUrl);
    console.log("query : ", chartQueryParam);
    var result = await axiosGet(`${chartDataUrl}`, chartQueryParam);
    setLoader(false);
    if (result != null && result["error"] == 0) {
      console.log("chart result data : ", result);
      if (result["data"] != null && result["data"]["chart_data"].length > 0) {
        var xyList = [];
        for (var i = 0; i < result["data"]["chart_data"].length; i++) {
          var xyMap = {
            x: moment(result["data"]["chart_data"][i]["DateTime"]).format(
              "yyyy-MM-DD HH:mm:ss"
            ),
            y: result["data"]["chart_data"][i]["Reading"],
          };
          xyList.push(xyMap);
        }
        var charTableData = result["data"]["chart_data"];

        for (var i = 0; i < charTableData.length; i++) {
          charTableData[i]["DateTime"] = moment(
            result["data"]["chart_data"][i]["DateTime"]
          ).format("yyyy-MM-DD HH:mm:ss");
          charTableData[i]["srNo"] = i + 1;
          charTableData[i]["isBackgroundColor"] = false;
        }
        setXYPairData(xyList);
        setChartConfig(result["data"]["chart_config"]);
        setChartData(charTableData);
        var data_table = result["data"]["data_table"];

        for (var i = 0; i < data_table.length; i++) {
          // data_table[i]['DateTime'] = moment(result['data']['data_table'][i]['DateTime']).format('yyyy-MM-DD HH:mm:ss');
          data_table[i]["srNo"] = i + 1;
          data_table[i]["isBackgroundColor"] = false;
        }
        setDataTable(data_table);

        var charList = characteristicsIdList;
        var allCharList = [];
        for (var i = 0; i < charList.length; i++) {
          // selectedChar.push(charList[i]['ID']);
          var map = {
            id: charList[i]["ID"],
            name: charList[i]["CharacteristicsName"],
          };
          allCharList.push(map);
        }
        //collect selected data..................
        var machineName = "";
        for (var i = 0; i < sMachineActionIdList.length; i++) {
          if (sMachineActionId == sMachineActionIdList[i]["ID"]) {
            machineName = sMachineActionIdList[i]["MachineName"];
          }
        }
        var pallet = "";
        if (sPalletActionId == "" || sPalletActionId == "1,2") {
          pallet = "All";
        } else if (sPalletActionId == "1") {
          pallet = "A";
        } else if (sPalletActionId == "2") {
          pallet = "B";
        }

        var dateRange =
          moment(chartFromDate).format("YYYY-MM-DD").toString() +
          (chartToDate != ""
            ? " - " + moment(chartToDate).format("YYYY-MM-DD").toString()
            : " - " + moment(chartFromDate).format("YYYY-MM-DD").toString());
        var subGrp = subGroupId;
        var eventName = "";
        if (eventIds != "") {
          var evntNameList = [];
          var evntlist = eventIds.split(",");
          for (var i = 0; i < eventIdList.length; i++) {
            if (evntlist.includes(eventIdList[i]["ID"].toString())) {
              evntNameList.push(eventIdList[i]["NAME"]);
            }
          }
          eventName = evntNameList.toString();
        } else {
          eventName = "-";
        }

        var selectedData = {
          machine: machineName,
          pallet: pallet,
          date:
            dateRangeTypeName == "Custom Period"
              ? dateRange
              : dateRangeTypeName,
          sub_group: subGrp,
          event: eventName,
        };

        //.......................................
        c_selectedData = selectedData;
        c_chartConfig = result["data"]["chart_config"];
        c_charTableData = charTableData;
        c_xyList = xyList;
        c_selectedCharNameList =
          selectedCharNameList.length > 0 ? selectedCharNameList : allCharList;
        c_chartTypeId = chartTypeId;
        c_data_table = data_table;
        c_chartViewType = timeBasedChart ? "1" : "2";
        localStorage.setItem("chartSearch", JSON.stringify(chartQueryParam));
        setIsShowChart(true);
        // history.push({ pathname: '/chartDetails', state: { 'chartConfig': result['data']['chart_config'], 'chartData': charTableData, 'xyPairList': xyList, 'charList': selectedCharNameList, 'chartType': chartTypeId, 'dataTable': data_table, 'chartViewType': timeBasedChart ? '1' : '2' } });
      } else {
        toast.error("Data not found.", {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } else {
      toast.error(result["msg"], {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  // api call for Chart list...........................
  const getList = async (data) => {
    setLoader(true);
    var result = await axiosGet(`${templateListUrl}?Login_Id=${data.ID}`);
    setLoader(false);
    if (result != null && result["error"] == 0) {
      setChartList(result["data"]);
      setTempChartList(result["data"]);
      grouping(result["data"]);
    }
  };

  const grouping = (data) => {
    const a = groupBy(data, function (n) {
      return n.OperationLineName;
    });
    //grouping by operational name.......................
    var groups = Object.keys(a).map(function (key) {
      // grouping by station name
      const s = groupBy(a[key], function (n) {
        return n.StationName;
      });

      var groups_station = Object.keys(s).map(function (stationKey) {
        var list = s[stationKey];
        var newList = [];

        for (var i = 0; i < list.length; i++) {
          var map = {
            value: list[i]["TemplateID"], // already stable
            label: list[i]["TemplateName"],
            isToggle: false,
          };
          newList.push(map);
        }

        // ✅ stable deterministic value
        return {
          label: stationKey,
          value: stationKey,
          children: newList,
        };
      });

      // ✅ stable deterministic value
      return {
        label: key,
        value: key,
        children: groups_station,
      };
    });
    var groups = Object.keys(a).map(function (key) {
      // grouping by station name
      const s = groupBy(a[key], function (n) {
        return n.StationName;
      });

      var groups_station = Object.keys(s).map(function (stationKey) {
        var list = s[stationKey];
        var newList = [];

        for (var i = 0; i < list.length; i++) {
          var map = {
            value: list[i]["TemplateID"], // already stable
            label: list[i]["TemplateName"],
            isToggle: false,
          };
          newList.push(map);
        }

        // ✅ stable deterministic value
        return {
          label: stationKey,
          value: stationKey,
          children: newList,
        };
      });

      // ✅ stable deterministic value
      return {
        label: key,
        value: key,
        children: groups_station,
      };
    });
    var groups = Object.keys(a).map(function (key) {
      // grouping by station name
      const s = groupBy(a[key], function (n) {
        return n.StationName;
      });

      var groups_station = Object.keys(s).map(function (stationKey) {
        var list = s[stationKey];
        var newList = [];

        for (var i = 0; i < list.length; i++) {
          var map = {
            value: list[i]["TemplateID"], // already stable
            label: list[i]["TemplateName"],
            isToggle: false,
          };
          newList.push(map);
        }

        // ✅ stable deterministic value
        return {
          label: stationKey,
          value: stationKey,
          children: newList,
        };
      });

      // ✅ stable deterministic value
      return {
        label: key,
        value: key,
        children: groups_station,
      };
    });
    var groups = Object.keys(a).map(function (key) {
      // grouping by station name
      const s = groupBy(a[key], function (n) {
        return n.StationName;
      });

      var groups_station = Object.keys(s).map(function (stationKey) {
        var list = s[stationKey];
        var newList = [];

        for (var i = 0; i < list.length; i++) {
          var map = {
            value: list[i]["TemplateID"], // already stable
            label: list[i]["TemplateName"],
            isToggle: false,
          };
          newList.push(map);
        }
        return {
          label: stationKey,
          value: stationKey,
          children: newList,
        };
      });
      return {
        label: key,
        value: key,
        children: groups_station,
      };
    });

    var mapData = {
      name: "operation",
      children: groups,
    };
    setData([]);
    setData(groups);
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
      setChartDetails(userData, checked_node[0]);
      setTemplateActionId(checked_node[0]);
      getFillList(userData, charactersticActionId, checked_node[0]);
      clearVlidation();
    } else {
      setTemplateId("");
      setChartDetails("");
      setChartDesc("");
      setChartName("");
      setStationId("");
      setModelNo("");
      setChartCharacterList([]);
      getList(userData);
    }
  };
  const onTreeClicked = (checked_node) => {
    var exp = expanded;
    if (expanded.includes(checked_node["value"].toString())) {
      const arr = expanded.filter(
        (item) => item !== checked_node["value"].toString()
      );
      // setExpanded([]);
      setExpanded(arr);
    } else {
      exp.push(checked_node["value"].toString());
      // setExpanded([]);
      setExpanded(exp);
    }
    if (checked_node["value"] != "") {
      if (!checked_node["value"].toString().includes(".")) {
        setTemplateActionId(checked_node["value"]);
        // getTemplateDetails(userData, checked_node['value'])
      }
    }
    var idList = [];
    idList.push(checked_node["value"].toString());
    setChecked(idList);
    //set spc station name...............................
    for (var i = 0; i < sStationActionIdList.length; i++) {
      if (
        sStationActionIdList[i]["NAME"]
          .toString()
          .includes(checked_node["parent"]["label"].toString())
      ) {
        setSStationActionId(sStationActionIdList[i]["ID"]);
        getFillList(userData, machineActionId, sStationActionIdList[i]["ID"]);
        getFillList(userData, templateActionId, sStationActionIdList[i]["ID"]);
        setIsStationSelected(false);
      }
    }
    //set Template name...............................
    for (var i = 0; i < sTemplateActionIdList.length; i++) {
      if (sTemplateActionIdList[i]["TemplateName"] == checked_node["label"]) {
        setTemplateActionId(sTemplateActionIdList[i]["ID"]);
        getFillList(
          userData,
          charactersticActionId,
          sTemplateActionIdList[i]["ID"]
        );
        var idList = [];
        idList.push(sTemplateActionIdList[i]["ID"].toString());
        setChecked(idList);
      }
    }
    clearVlidation();
  };

  const onExpand = (exp) => {
    setExpanded(exp);
  };

  //input validation.................................................
  const inputValidate = (value, fieldName, digit) => {
    var errorValue;
    if (fieldName == "chart code") {
      errorValue = inputWithRangeValidator(value, fieldName, digit);
    } else if (fieldName == "pallet") {
      errorValue = inputValidatorForPallet(value, fieldName);
    } else {
      errorValue = inputValidator(value, fieldName);
    }

    if (errorValue !== "") {
      if (fieldName == "chart code") {
        errorMap.chart_no = errorValue;
      } else if (fieldName == "chart name") {
        errorMap.chart_name = errorValue;
      } else if (fieldName == "number of reading") {
        errorMap.no_of_reading = errorValue;
      } else if (fieldName == "pallet") {
        errorMap.pallet = errorValue;
      } else if (fieldName == "chart type") {
        errorMap.chart_type = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (fieldName == "chart no") {
        errorMap.chart_no = errorValue;
      } else if (fieldName == "chart name") {
        errorMap.chart_name = errorValue;
      } else if (fieldName == "number of reading") {
        errorMap.no_of_reading = errorValue;
      } else if (fieldName == "pallet") {
        errorMap.pallet = errorValue;
      } else if (fieldName == "chart type") {
        errorMap.chart_type = errorValue;
      }
      setError(errorMap);
      return true;
    }
  };

  //dropdown validation.................................................
  const dropdownValidate = (value, fieldName) => {
    var errorValue;
    if (fieldName == "customDate") {
      errorValue = dropdownValidatorForCustomDate(
        value,
        fieldName,
        chartFromDate,
        chartToDate
      );
    } else {
      errorValue = dropdownValidator(value, fieldName);
    }
    if (errorValue !== "") {
      if (fieldName === "Spc station") {
        errorMap.station = errorValue;
      } else if (fieldName === "template") {
        errorMap.template = errorValue;
      } else if (fieldName === "machine") {
        errorMap.machine = errorValue;
      } else if (fieldName === "pallet") {
        errorMap.pallet = errorValue;
      } else if (fieldName === "customDate") {
        errorMap.customDate = errorValue;
      } else if (fieldName === "subgroup size") {
        errorMap.subgroup = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (fieldName === "Spc station") {
        errorMap.station = errorValue;
      } else if (fieldName === "template") {
        errorMap.template = errorValue;
      } else if (fieldName === "machine") {
        errorMap.machine = errorValue;
      } else if (fieldName === "pallet") {
        errorMap.pallet = errorValue;
      } else if (fieldName === "customDate") {
        errorMap.customDate = errorValue;
      } else if (fieldName === "subgroup size") {
        errorMap.subgroup = errorValue;
      }
      setError(errorMap);
      return true;
    }
  };

  //date validation.................................................
  const dateValidate = (value, fieldName, compaireField) => {
    var errorValue;
    errorValue = dateValidator(value, fieldName, compaireField);
    if (errorValue !== "") {
      if (fieldName == "from date") {
        errorMap.from_Date = errorValue;
      } else if (fieldName == "to date") {
        errorMap.to_Date = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (fieldName == "from date") {
        errorMap.from_Date = errorValue;
      } else if (fieldName == "to date") {
        errorMap.to_Date = errorValue;
      }
      setError(errorMap);
      return true;
    }
  };

  //toggle model for delete.................................
  function toggleModal(chartId) {
    setIsOpen(!isOpen);
    if (chartId == "") {
      return;
    } else {
      setChartIdForDelete(chartId);
    }
  }

  //toggle model for filter .................................
  function toggleFilterModal(chartId) {
    setIsFilterOpen(!isFilterOpen);
    if (chartId == "") {
      return;
    } else {
      setChartIdForDelete(chartId);
    }
  }

  const clearField = () => {
    setATA(false);
    errorMap.chart_no = "";
    errorMap.chart_name = "";
    errorMap.no_of_reading = "";
    errorMap.chart_type = "";
    setError(errorMap);
    setChartId("");
    setChartCode("");
    setChartName("");
    setNoOfReading("");
    getList(userData);
  };

  //on back button click............................................
  const onBackClick = async () => {
    history.goBack();
  };

  // station dropdown validate.........................................
  const onStationDropdownChange = (value) => {
    setSStationActionId(value);
    getFillList(userData, machineActionId, value);
    getFillList(userData, templateActionId, value);
    dropdownValidate(value, "Spc station");
    // clearVlidation();
    setIsStationSelected(false);
  };

  // template dropdown validate.........................................
  const onTemplateDropdownChange = (value) => {
    setTemplateActionId(value);
    getFillList(userData, charactersticActionId, value);
    dropdownValidate(value, "Template");
  };
  // machine dropdown validate.........................................
  const onMachineDropdownChange = (value) => {
    setSMachineActionId(value);
    dropdownValidate(value, "Machine");
  };

  const onPalletChecked = (data, index) => {
    var palletList = sPalletActionIdList;
    palletList[index]["isCheck"] = !palletList[index]["isCheck"];
    var selectedPallet = [];
    for (var i = 0; i < palletList.length; i++) {
      if (palletList[i]["isCheck"]) {
        selectedPallet.push(palletList[i]["ID"]);
      }
    }
    setPalletActionId("");
    setPalletActionId(selectedPallet.toString());
    setPalletActionIdList([]);
    setPalletActionIdList(palletList);
  };

  const onCharactersticChecked = (data, index) => {
    var charList = characteristicsIdList;
    charList[index]["isCheck"] = !charList[index]["isCheck"];
    var selectedChar = [];
    var selectedCharName = [];
    for (var i = 0; i < charList.length; i++) {
      if (charList[i]["isCheck"]) {
        selectedChar.push(charList[i]["ID"]);
        var map = {
          id: charList[i]["ID"],
          name: charList[i]["CharacteristicsName"],
        };
        selectedCharName.push(map);
        // setCharSelected(true);
      }
    }
    setCharacteristicsId("");
    setCharacteristicsId(selectedChar.toString());
    setCharacteristicsIdList([]);
    setCharacteristicsIdTempList([]);
    setSelectedCharName([]);
    setCharacteristicsIdList(charList);
    setCharacteristicsIdTempList(charList);
    setSelectedCharName(selectedCharName);
    //   for (var i = 0; i < charList.length; i++) {
    //   if(!charList[index]['isCheck']){
    //     setCharSelected(false);
    //   }
    // }
  };

  const onEventChecked = (data, index) => {
    var eventList = eventIdList;
    eventList[index]["isCheck"] = !eventList[index]["isCheck"];
    var selectedEvent = [];
    for (var i = 0; i < eventList.length; i++) {
      if (eventList[i]["isCheck"]) {
        selectedEvent.push(eventList[i]["ID"]);
      }
    }
    setEventIds("");
    setEventIds(selectedEvent.toString());
    setEventIdList([]);
    setEventIdTempList([]);
    setEventIdList(eventList);
    setEventIdTempList(eventList);
  };

  const onExportOptionChecked = (data, index) => {
    var exportList = exportOptionList;
    exportList[index]["isCheck"] = !exportList[index]["isCheck"];
    var selectedExport = [];
    for (var i = 0; i < exportList.length; i++) {
      if (exportList[i]["isCheck"]) {
        selectedExport.push(exportList[i]["ID"]);
      }
    }
    setExportOptionIds("");
    setExportOptionIds(selectedExport.toString());
    setExportOptionList([]);
    setExportOptionList(exportList);
  };

  const onCharViewSelectedCheck = (value) => {
    setCharViewSelected(value);
    if (value) {
      var charList = characteristicsIdTempList.filter(
        (item, i) => item["isCheck"]
      );
      if (charList.length > 0) {
        setCharacteristicsIdList([]);
        setCharacteristicsIdList(charList);
      }
    } else {
      setCharacteristicsIdList([]);
      setCharacteristicsIdList(characteristicsIdTempList);
    }
  };
  const onEventViewSelectedCheck = (value) => {
    setEventViewSelected(value);
    if (value) {
      var eventList = eventIdTempList.filter((item, i) => item["isCheck"]);
      if (eventList.length > 0) {
        setEventIdList([]);
        setEventIdList(eventList);
      }
    } else {
      setEventIdList([]);
      setEventIdList(eventIdTempList);
    }
  };

  const onDateRangeTypeChange = (value) => {
    setDateRangeTypeName(value);
    if (value == "Custom Period") {
      setIsDisplayDate(true);
    } else {
      setChartFromDate("");
      setChartToDate("");
      setIsDisplayDate(false);
    }
    clearVlidation();
  };

  const onChartCheck = (no, value) => {
    if (no == 1) {
      setChartTypeId("");
      setChartTypeId(1);
      setRunChart(value);
      setXBarRChart(false);
      setPChart(false);
      setCChart(false);
      setNPChart(false);
      setIsShowChartView(true);
      setIsShowSubGroupAndControlLimit(false);
      clearVlidation();
    } else if (no == 2) {
      setChartTypeId("");
      setChartTypeId(2);
      setRunChart(false);
      setXBarRChart(value);
      setPChart(false);
      setCChart(false);
      setNPChart(false);
      setIsShowChartView(false);
      setIsShowSubGroupAndControlLimit(!isShowSubGroupAndControlLimit);
      clearVlidation();
    } else if (no == 3) {
      setChartTypeId("");
      setChartTypeId(3);
      setRunChart(false);
      setXBarRChart(false);
      setPChart(value);
      setCChart(false);
      setNPChart(false);
      setIsShowChartView(false);
      setIsShowSubGroupAndControlLimit(false);
      clearVlidation();
    } else if (no == 4) {
      setChartTypeId("");
      setChartTypeId(4);
      setRunChart(false);
      setXBarRChart(false);
      setPChart(false);
      setCChart(value);
      setNPChart(false);
      setIsShowChartView(false);
      setIsShowSubGroupAndControlLimit(false);
      clearVlidation();
    } else if (no == 5) {
      setChartTypeId("");
      setChartTypeId(5);
      setRunChart(false);
      setXBarRChart(false);
      setPChart(false);
      setCChart(false);
      setNPChart(value);
      setIsShowChartView(false);
      setIsShowSubGroupAndControlLimit(false);
      clearVlidation();
    }
  };

  const onRadioChanged = (value) => {
    if (value == 1) {
      setPastControlLimitOption(true);
      setCurrentControlLimitOption(false);
    } else {
      setPastControlLimitOption(false);
      setCurrentControlLimitOption(true);
    }
  };

  const onChartViewChanged = (value) => {
    if (value == 1) {
      setTimeBasedChart(true);
      setPointBasedChart(false);
    } else {
      setTimeBasedChart(false);
      setPointBasedChart(true);
    }
  };

  const onViewChartClick = () => {
    getChartData();
  };

  // Export to Excel file
  const onExportXLS = async () => {
    if (chartToDate == "" || chartToDate == null) {
      // modifyToDate = modifyFromDate;
      setChartToDate(chartFromDate);
    }
    dropdownValidate(sStationActionId, "Spc station");
    dropdownValidate(sTemplateActionId, "template");
    inputValidate(chartTypeId, "chart type");
    // dropdownValidate(dateRangeTypeName, 'customDate')

    if (!dropdownValidate(sStationActionId, "Spc station")) {
      return;
    }
    if (!dropdownValidate(sTemplateActionId, "template")) {
      return;
    }
    if (!inputValidate(chartTypeId, "chart type")) {
      return;
    }
    // if (!dropdownValidate(dateRangeTypeName, 'customDate')) {
    //   return;
    // }

    if (dateRangeTypeName == "Custom Period") {
      dateValidate(chartFromDate, "from date", chartToDate);
      if (chartToDate != null && chartToDate != "") {
        dateValidate(chartToDate, "to date", chartFromDate);
      }
      if (!dateValidate(chartFromDate, "from date", chartToDate)) {
        return;
      }
      if (chartToDate != null && chartToDate != "") {
        if (!dateValidate(chartToDate, "to date", chartFromDate)) {
          return;
        }
      }
    }

    if (isShowSubGroupAndControlLimit) {
      dropdownValidate(subGroupId, "subgroup size");
      if (!dropdownValidate(subGroupId, "subgroup size")) {
        return;
      }
    }

    setLoader(true);
    const chartQueryParam = {
      Login_id: userData.ID,
      StationId: sStationActionId != "" ? sStationActionId : null,
      TemplateId: sTemplateActionId != "" ? sTemplateActionId : null,
      MachineId:
        sMachineActionId != "" && sMachineActionId != "Choose one"
          ? sMachineActionId
          : null,
      Pallete: sPalletActionId != "" ? sPalletActionId : null,
      CharacteristicsId: CharacteristicsId != "" ? CharacteristicsId : null,
      DateRangeType: dateRangeTypeName != "" ? dateRangeTypeName : null,
      FromDate: moment(chartFromDate).format("YYYY-MM-DD").toString(),
      ToDate:
        chartToDate != null && chartToDate != ""
          ? moment(chartToDate).format("YYYY-MM-DD").toString()
          : moment(chartFromDate).format("YYYY-MM-DD").toString(),
      Shift1: firstShift != "" ? firstShift : null,
      Shift2: secondShift != "" ? secondShift : null,
      Shift3: thirdShift != "" ? thirdShift : null,
      ChartTypeID: chartTypeId != "" ? chartTypeId : null,
      Subgroup: subGroupId != "" ? subGroupId : null,
      EventIds: eventIds != "" ? eventIds : null,
      ControlLimitOption: controlLimitOption != "" ? controlLimitOption : null,
      ExportOptionIds: exportOptionIds != "" ? exportOptionIds : null,
    };

    var url = `${getXlsUrl}?StationId=${sStationActionId}&TemplateId=${sTemplateActionId}&MachineId=${sMachineActionId}&Pallete=${sPalletActionId}&CharacteristicsId=${CharacteristicsId}&DateRangeType=${dateRangeTypeName}&FromDate=${moment(
      chartFromDate
    )
      .format("YYYY-MM-DD")
      .toString()}&ToDate=${moment(chartToDate)
      .format("YYYY-MM-DD")
      .toString()}&Shift1=${firstShift}&Shift2=${secondShift}&Shift3=${thirdShift}&ChartTypeID=${chartTypeId}&Subgroup=${subGroupId}&EventIds=${eventIds}&ControlLimitOption=${controlLimitOption}&ExportOptionIds=${exportOptionIds}`;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
    window.close();
    setLoader(false);
  };

  // Export to MES
  const onExportMES = async () => {
    if (chartToDate == "" || chartToDate == null) {
      // modifyToDate = modifyFromDate;
      setChartToDate(chartFromDate);
    }
    dropdownValidate(sStationActionId, "Spc station");
    dropdownValidate(sTemplateActionId, "template");
    inputValidate(chartTypeId, "chart type");
    // dropdownValidate(dateRangeTypeName, 'customDate')

    if (!dropdownValidate(sStationActionId, "Spc station")) {
      return;
    }
    if (!dropdownValidate(sTemplateActionId, "template")) {
      return;
    }
    if (!inputValidate(chartTypeId, "chart type")) {
      return;
    }
    // if (!dropdownValidate(dateRangeTypeName, 'customDate')) {
    //   return;
    // }

    if (dateRangeTypeName == "Custom Period") {
      dateValidate(chartFromDate, "from date", chartToDate);
      if (chartToDate != null && chartToDate != "") {
        dateValidate(chartToDate, "to date", chartFromDate);
      }
      if (!dateValidate(chartFromDate, "from date", chartToDate)) {
        return;
      }
      if (chartToDate != null && chartToDate != "") {
        if (!dateValidate(chartToDate, "to date", chartFromDate)) {
          return;
        }
      }
    }

    if (isShowSubGroupAndControlLimit) {
      dropdownValidate(subGroupId, "subgroup size");
      if (!dropdownValidate(subGroupId, "subgroup size")) {
        return;
      }
    }

    setLoader(true);
    const chartQueryParam = {
      Login_id: userData.ID,
      StationId: sStationActionId != "" ? sStationActionId : null,
      TemplateId: sTemplateActionId != "" ? sTemplateActionId : null,
      MachineId:
        sMachineActionId != "" && sMachineActionId != "Choose one"
          ? sMachineActionId
          : null,
      Pallete: sPalletActionId != "" ? sPalletActionId : null,
      CharacteristicsId: CharacteristicsId != "" ? CharacteristicsId : null,
      DateRangeType: dateRangeTypeName != "" ? dateRangeTypeName : null,
      FromDate: moment(chartFromDate).format("YYYY-MM-DD").toString(),
      ToDate:
        chartToDate != null && chartToDate != ""
          ? moment(chartToDate).format("YYYY-MM-DD").toString()
          : moment(chartFromDate).format("YYYY-MM-DD").toString(),
      Shift1: firstShift != "" ? firstShift : null,
      Shift2: secondShift != "" ? secondShift : null,
      Shift3: thirdShift != "" ? thirdShift : null,
      ChartTypeID: chartTypeId != "" ? chartTypeId : null,
      Subgroup: subGroupId != "" ? subGroupId : null,
      EventIds: eventIds != "" ? eventIds : null,
      ControlLimitOption: controlLimitOption != "" ? controlLimitOption : null,
      ExportOptionIds: exportOptionIds != "" ? exportOptionIds : null,
    };

    var url = `${getMesUrl}?StationId=${sStationActionId}&TemplateId=${sTemplateActionId}&MachineId=${sMachineActionId}&Pallete=${sPalletActionId}&CharacteristicsId=${CharacteristicsId}&DateRangeType=${dateRangeTypeName}&FromDate=${moment(
      chartFromDate
    )
      .format("YYYY-MM-DD")
      .toString()}&ToDate=${moment(chartToDate)
      .format("YYYY-MM-DD")
      .toString()}&Shift1=${firstShift}&Shift2=${secondShift}&Shift3=${thirdShift}&ChartTypeID=${chartTypeId}&Subgroup=${subGroupId}&EventIds=${eventIds}&ControlLimitOption=${controlLimitOption}&ExportOptionIds=${exportOptionIds}`;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
    window.close();
    setLoader(false);
  };

  const clearVlidation = () => {
    if (sStationActionId != "") {
      errorMap.station = "";
    }
    if (sTemplateActionId != "") {
      errorMap.template = "";
    }
    if (chartTypeId != "") {
      errorMap.chart_type = "";
    }
    if (chartFromDate != "") {
      errorMap.customDate = "";
    }
    if (chartToDate != "") {
      errorMap.customDate = "";
    }
    if (subGroupId != "") {
      errorMap.subgroup = "";
    }
    setError(errorMap);
  };

  const toDateValidation = (date) => {
    if (date >= chartFromDate) {
      errorMap.customDate = "";
      setError(errorMap);
      setChartToDate(date);
    } else {
      errorMap.customDate = "To date can not be less than from date";
      setError(errorMap);
    }
  };

  return (
    <>
      {isLoading ? <Loader></Loader> : null}
      <ToastContainer autoClose={5000} hideProgressBar={false} />

      {/* <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}>
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content" style={{ borderRadius: '0px' }}>
            <div class="modal-header">
              <button type="button" class="close" data-bs-dismiss="modal" onClick={toggleModal}>&times;</button>
              <h4 class="modal-title modal_title_text">Confirm Delete</h4>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <h5>Do you really want to delete this chart?</h5>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group text-right" style={{ marginTop: '25px' }}>
                    <a href="javascript:void(0);" class="btn save_btn" onClick={onDeleteClick}><i class='fa fa-check'></i>&nbsp; Yes</a>
                    <a href="javascript:void(0);" class="btn cancel_btn" data-bs-dismiss="modal" style={{ marginLeft: '5px' }} onClick={toggleModal}><i class="fa fa-times"></i>&nbsp; No</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal> */}

      <Modal isOpen={isFilterOpen} onRequestClose={toggleFilterModal}>
        {/*  <div id="user_filter" className="modal fade" role="dialog"> */}
        <div className="modal-dialog custom_modal_dialog">
          <div className="modal-content" style={{ borderRadius: "0px" }}>
            <div className="modal-header">
              <h4 className="modal-title">User Filter</h4>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                onClick={toggleFilterModal}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="custom_label">Name</label>
                    <input type="text" className="form-control" placeholder />
                  </div>
                  <div className="form-group">
                    <label className="custom_label">Username</label>
                    <input type="text" className="form-control" placeholder />
                  </div>
                  <div className="form-group">
                    <label className="custom_label">Role</label>
                    <select className="form-control">
                      <option />
                      <option />
                      <option />
                      <option />
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="custom_label">Status</label>
                    <select className="form-control">
                      <option />
                      <option />
                      <option />
                      <option />
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default search_btn"
                data-bs-dismiss="modal"
              >
                Search
              </button>
              <button
                type="button"
                className="btn btn-default"
                data-bs-dismiss="modal"
                onClick={toggleFilterModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Modal>

      <Header activeId={"isChartActiveColor"} />
      {isShowChart ? (
        <>
          <div class="row" style={{ margin: "0" }}>
            <div class="col-md-6 text-left">
              <div className="d-flex">
                <div className="chart_content_div">
                  <label className="chart_content_details">Machine :</label>
                  <p className="chart_content_details remove_bold">
                    {c_selectedData["machine"]}
                  </p>
                </div>
                <div className="chart_content_div">
                  <label className="chart_content_details">Pallet :</label>
                  <p className="chart_content_details remove_bold">
                    {c_selectedData["pallet"]}
                  </p>
                </div>
                <div className="chart_content_div">
                  <label className="chart_content_details">Date Range :</label>
                  <p className="chart_content_details remove_bold">
                    {c_selectedData["date"]}
                  </p>
                </div>
                {chartTypeId == "2" ? (
                  <div className="chart_content_div">
                    <label className="chart_content_details">Sub Group :</label>
                    <p className="chart_content_details remove_bold">
                      {c_selectedData["sub_group"]}
                    </p>
                  </div>
                ) : null}
                <div className="chart_content_div">
                  <label className="chart_content_details">Event :</label>
                  <p className="chart_content_details remove_bold">
                    {c_selectedData["event"]}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6 text-right">
              <button
                type="button"
                class="btn exportToXL_btn"
                onClick={() => onExportXLS()}
                style={{ margin: "10px 5px" }}
              >
                <i class="fa fa-file-excel-o"></i> Export To Excel
              </button>
              <button
                type="button"
                class="btn search_btn"
                onClick={() => setIsShowChart(false)}
                style={{ margin: "10px 5px" }}
              >
                <i class="fa fa-search"></i> Modify Search
              </button>
              {/* <button type="button" class="btn ViewChart_btn" onClick={() => setIsShowChart(false)} style={{ margin: '10px 5px', margin: '10px 5px', position: 'absolute', top: '10.5rem', right: '6.5rem', zIndex: '1' }}><i class="fa fa-eye" title='View Data'></i> </button> */}
            </div>
          </div>
          <ChartDetails
            mchartConfig={c_chartConfig}
            mchartData={c_charTableData}
            mxyPairList={c_xyList}
            mcharList={c_selectedCharNameList}
            mchartType={c_chartTypeId}
            mdataTable={c_data_table}
            mchartViewType={c_chartViewType}
            mselectedData={c_selectedData}
          />
        </>
      ) : (
        <>
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
                  <label className="list_name_class">Charts</label>
                  <nav className="nav flex-column left_menu tree_part_padd_left">
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
                  {/* <a href="#" className="btn btn-primary add_btn"><i className="fa fa-plus" /></a> */}

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
              <span>Charts</span>
            </div> */}
                <h2 className="az-content-title">Charts</h2>
                {/* <h6 className="active_status">Active</h6> */}

                <div className="row">
                  <div className="col-md-3 form-group mb-4">
                    <label className="custom_label">
                      SPC Station <span className="star_mark">*</span>
                    </label>
                    <select
                      className="form-control select2-no-search"
                      value={sStationActionId}
                      onChange={(e) =>
                        onStationDropdownChange(e.currentTarget.value)
                      }
                    >
                      <option>Choose one</option>
                      {sStationActionIdList.map((item) => (
                        <option key={item.ID} value={item.ID}>
                          {item.NAME}
                        </option>
                      ))}
                    </select>
                    {errors.station.length > 0 && (
                      <span className="error">{errors.station}</span>
                    )}
                  </div>
                  <div className="col-md-3 form-group mb-4">
                    <label className="custom_label">
                      Template <span className="star_mark">*</span>
                    </label>
                    <select
                      className="form-control select2-no-search"
                      value={sTemplateActionId}
                      disabled={isStationSelected}
                      onChange={(e) =>
                        onTemplateDropdownChange(e.currentTarget.value)
                      }
                    >
                      <option>Choose one</option>
                      {sTemplateActionIdList.map((item) => (
                        <option key={item.ID} value={item.ID}>
                          {item.TemplateName}
                        </option>
                      ))}
                    </select>
                    {errors.template.length > 0 && (
                      <span className="error">{errors.template}</span>
                    )}
                  </div>
                  <div className="col-md-3 form-group mb-4">
                    <label className="custom_label">Machine </label>
                    <select
                      className="form-control select2-no-search"
                      value={sMachineActionId}
                      disabled={isStationSelected}
                      onChange={(e) =>
                        onMachineDropdownChange(e.currentTarget.value)
                      }
                    >
                      <option>Choose one</option>
                      {sMachineActionIdList.map((item) => (
                        <option key={item.ID} value={item.ID}>
                          {item.MachineName}
                        </option>
                      ))}
                    </select>
                    {errors.machine.length > 0 && (
                      <span className="error">{errors.machine}</span>
                    )}
                  </div>
                  <div className="col-md-3 form-group mb-4">
                    <label className="custom_label">Pallet</label>
                    <div className="palletCSS">
                      {sPalletActionIdList.map((data, index) => (
                        <label
                          key={data.PalletNo}
                          className="ckbox mg-b-5"
                          style={{ marginRight: "25px", marginTop: "7px" }}
                        >
                          <input
                            type="checkbox"
                            checked={data.isCheck}
                            onChange={() => onPalletChecked(data, index)}
                          />
                          <span>{data.PalletNo}</span>
                        </label>
                      ))}
                    </div>

                    {errors.pallet.length > 0 && (
                      <span className="error">{errors.pallet}</span>
                    )}
                    {/* </div> */}
                  </div>

                  <div className="col-md-9 form-group">
                    <label className="custom_label">Characteristics</label>
                    <div
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "15px",
                        height: "130px",
                        overflow: "auto",
                        overflowX: "clip",
                      }}
                    >
                      <div className="row">
                        {characteristicsIdList.map((data, index) => (
                          <div
                            className="col-md-2 custom_width"
                            key={
                              data.CharacteristicsID ??
                              `${data.CharacteristicsName}_${index}`
                            }
                          >
                            <label className="ckbox mg-b-5 ckbox_custom">
                              <input
                                type="checkbox"
                                checked={data.isCheck}
                                onChange={() =>
                                  onCharactersticChecked(data, index)
                                }
                              />
                              <span
                                style={{
                                  fontSize: "12px",
                                  paddingLeft: "10px",
                                }}
                              >
                                {data.CharacteristicsName}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <label
                      class="ckbox mg-b-5"
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "15px",
                        fontSize: "13px",
                      }}
                    >
                      {selectedCharNameList.length > 0 ? (
                        <>
                          <input
                            type="checkbox"
                            defaultChecked={charViewSelected}
                            onChange={() =>
                              onCharViewSelectedCheck(!charViewSelected)
                            }
                          />
                          <span>View Selected</span>{" "}
                        </>
                      ) : (
                        ""
                      )}{" "}
                    </label>
                  </div>
                  <div className="col-md-3 form-group">
                    <label className="custom_label">Events</label>
                    <div
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "15px",
                        height: "130px",
                        overflow: "auto",
                        overflowX: "auto",
                      }}
                    >
                      <div className="row">
                        {/* <div className="col-md-12">
                      <label className="ckbox mg-b-5">
                        <input type="checkbox" defaultChecked /><span>USL</span>
                      </label>
                    </div> */}
                        {eventIdList.map((data, index) => (
                          <div
                            className="col-md-6"
                            key={data.ID ?? `${data.NAME}_${index}`}
                          >
                            <label
                              className="ckbox mg-b-5"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <input
                                type="checkbox"
                                checked={data.isCheck}
                                onChange={() => onEventChecked(data, index)}
                              />
                              <span>{data.NAME}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <label
                      class="ckbox mg-b-5"
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "15px",
                        fontSize: "13px",
                      }}
                    >
                      {eventIds.toString().length > 0 ? (
                        <>
                          {" "}
                          <input
                            type="checkbox"
                            defaultChecked={eventViewSelected}
                            onChange={() =>
                              onEventViewSelectedCheck(!eventViewSelected)
                            }
                          />
                          <span>View Selected</span>
                        </>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-group mt-3">
                  <div className="az-content-label mg-b-5 chart_head_text">
                    Date Range <span className="star_mark">*</span>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <select
                        className="form-control select2-no-search"
                        value={dateRangeTypeName}
                        onChange={(e) =>
                          onDateRangeTypeChange(e.currentTarget.value)
                        }
                      >
                        {/* <option label="Custom" /> */}
                        <option value={"Previous month"}>Previous Month</option>
                        <option value={"Current month"}>Current Month</option>
                        <option value={"Custom Period"}>Custom</option>
                      </select>
                    </div>

                    {isDisplayDate ? (
                      <>
                        <div className="col-md-3">
                          <div className="input-group">
                            <div className="daterangecss">
                              {/* <input type="text" className="form-control fc-datepicker" placeholder="From Date" /> */}
                              <label className="d-flex">
                                <DatePicker
                                  className="form-control"
                                  dateFormat="dd/MM/yyyy"
                                  selected={chartFromDate}
                                  onChange={(date) => setChartFromDate(date)}
                                  placeholderText="From Date"
                                />
                                <FaCalendarAlt
                                  className="form-control col-md-3 bg-light"
                                  style={{
                                    flex: "0 0 19%",
                                    maxWidth: "19%",
                                    color: "#bbbcbf",
                                  }}
                                />
                              </label>
                            </div>
                            {errors.from_Date.length > 0 && (
                              <span className="error">{errors.from_Date}</span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="input-group">
                            <div className="daterangecss">
                              {/* <input type="text" className="form-control fc-datepicker" placeholder="To Date" /> */}
                              <label className="d-flex">
                                <DatePicker
                                  className="form-control"
                                  dateFormat="dd/MM/yyyy"
                                  selected={chartToDate}
                                  minDate={chartFromDate}
                                  showDisabledMonthNavigation
                                  onChange={(date) => setChartToDate(date)}
                                  placeholderText={"To Date"}
                                />
                                <FaCalendarAlt
                                  className="form-control col-md-3 bg-light"
                                  style={{
                                    flex: "0 0 19%",
                                    maxWidth: "19%",
                                    color: "#bbbcbf",
                                  }}
                                />
                              </label>
                            </div>
                            {errors.to_Date.length > 0 && (
                              <span className="error">{errors.to_Date}</span>
                            )}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                {<span className="error">{errors.customDate}</span>}

                <div className="form-group mt-3">
                  <div className="az-content-label mg-b-5 chart_head_text">
                    Shift
                  </div>

                  <div className="row">
                    <div className="col-md-2 shift_custom_width mb-3">
                      <label className="ckbox mg-b-5">
                        <input
                          type="checkbox"
                          checked={firstShift}
                          onChange={() => setFirstShift(!firstShift)}
                        />
                        <span>First Shift</span>
                      </label>
                    </div>

                    <div className="col-md-2 shift_custom_width mb-3">
                      <label className="ckbox mg-b-5">
                        <input
                          type="checkbox"
                          checked={secondShift}
                          onChange={() => setSecondShift(!secondShift)}
                        />
                        <span>Second Shift</span>
                      </label>
                    </div>

                    <div className="col-md-2 shift_custom_width mb-3">
                      <label className="ckbox mg-b-5">
                        <input
                          type="checkbox"
                          checked={thirdShift}
                          onChange={() => setThirdShift(!thirdShift)}
                        />
                        <span>Third Shift</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* {chartConfig.length > 0 && chartData.length > 0 ? (<MainChart chartConfig={chartConfig} chartData={chartData} xyPairList={xyPairData}/>) : (null)} */}
                <div
                  className="form-group"
                  style={{ backgroundColor: "#f0f0f0", padding: "15px 15px" }}
                >
                  <div className="az-content-label mg-b-20 chart_head_text">
                    Chart Types
                  </div>
                  <div className="row">
                    <div className="col-md-2 custom_width_cartType mg-b-20">
                      <img
                        src="assets/Run_chart.png"
                        className="img-responsive mg-b-10"
                        style={{ width: "100%" }}
                      />
                      <div className="row">
                        <div className="col-md-12 text-cetner">
                          <label className="ckbox mg-b-5">
                            <input
                              type="checkbox"
                              defaultChecked={runChart}
                              onChange={() => onChartCheck(1, !runChart)}
                            />
                            <span>Run Chart</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 custom_width_cartType mg-b-20">
                      <img
                        src="assets/XbarR_chart.png"
                        className="img-responsive mg-b-10"
                        style={{ width: "100%" }}
                      />
                      <div className="row">
                        <div className="col-md-12 text-cetner">
                          <label className="ckbox mg-b-5">
                            <input
                              type="checkbox"
                              defaultChecked={xBarRChart}
                              onChange={() => onChartCheck(2, !xBarRChart)}
                            />
                            <span>Control Chart</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* <div className="col-md-2 custom_width_cartType mg-b-20">
                  <img src="assets/P_chart.png" className="img-responsive mg-b-10" style={{ width: '100%' }} />
                  <div className="row">
                    <div className="col-md-12 text-cetner">
                      <label className="ckbox mg-b-5">
                        <input type="checkbox" key={Math.random()} defaultChecked={pChart} onChange={() => onChartCheck(3, !pChart)} /><span>P Chart</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 custom_width_cartType mg-b-20">
                  <img src="assets/C_chart.png" className="img-responsive mg-b-10" style={{ width: '100%' }} />
                  <div className="row">
                    <div className="col-md-12 text-cetner">
                      <label className="ckbox mg-b-5">
                        <input type="checkbox" key={Math.random()} defaultChecked={cChart} onChange={() => onChartCheck(4, !cChart)} /><span>C Chart</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 custom_width_cartType mg-b-20">
                  <img src="assets/NP_chart.png" className="img-responsive mg-b-10" style={{ width: '100%' }} />
                  <div className="row">
                    <div className="col-md-12 text-cetner">
                      <label className="ckbox mg-b-5">
                        <input type="checkbox" key={Math.random()} defaultChecked={npChart} onChange={() => onChartCheck(5, !npChart)} /><span>NP Chart</span>
                      </label>
                    </div>
                  </div>
                </div> */}
                  </div>
                  {errors.chart_type.length > 0 && (
                    <span className="error">{errors.chart_type}</span>
                  )}
                </div>

                {isShowChartView ? (
                  <div
                    className="form-group"
                    style={{ backgroundColor: "#f0f0f0", padding: "15px 15px" }}
                  >
                    <div className="az-content-label mg-b-10">Chart View</div>
                    <div className="row">
                      <div className="col-md-5">
                        <label className="rdiobox">
                          <input
                            name="rdio"
                            type="radio"
                            checked={timeBasedChart}
                            onChange={() => onChartViewChanged(1)}
                          />
                          <span>Time Based Chart</span>
                        </label>
                      </div>
                      <div className="col-md-5">
                        <label className="rdiobox">
                          <input
                            name="rdio"
                            type="radio"
                            checked={pointBasedChart}
                            onChange={() => onChartViewChanged(2)}
                          />
                          <span>Point Based Chart</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}

                <div className="row">
                  {isShowSubGroupAndControlLimit ? (
                    <div className="col-md-3 form-group mt-3 mb-4">
                      <label className="custom_label">
                        Subgroup Size <span className="star_mark">*</span>
                      </label>
                      <select
                        className="form-control select2-no-search"
                        value={subGroupId}
                        onChange={(e) => setSubGroupId(e.currentTarget.value)}
                      >
                        <option label="Choose one" />
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      {errors.subgroup.length > 0 && (
                        <span className="error">{errors.subgroup}</span>
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div
                  className="form-group"
                  style={{ backgroundColor: "#f0f0f0", padding: "15px 15px" }}
                >
                  <div className="az-content-label" style={{ color: "blue" }}>
                    Options
                  </div>
                  <hr />
                  {isShowSubGroupAndControlLimit ? (
                    <div>
                      <div className="az-content-label mg-b-10">
                        Control Limit
                      </div>
                      <div className="row">
                        <div className="col-md-5">
                          <label className="rdiobox">
                            <input
                              name="rdio"
                              type="radio"
                              checked={pastControlLimitOption}
                              onChange={() => onRadioChanged(1)}
                            />
                            <span>
                              Use control limit as for the past period
                            </span>
                          </label>
                        </div>
                        <div className="col-md-5">
                          <label className="rdiobox">
                            <input
                              name="rdio"
                              type="radio"
                              checked={currentcontrolLimitOption}
                              onChange={() => onRadioChanged(2)}
                            />
                            <span>
                              Derive the control limit as per the current data
                            </span>
                          </label>
                        </div>
                      </div>{" "}
                      <hr />
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <div className="az-content-label mg-b-10">
                    Export Contents
                  </div>
                  <div className="row">
                    {exportOptionList.map((data, index) => (
                      <div
                        className="col-md-2 custom_width"
                        key={data.id ?? `${data.exportContent}_${index}`}
                      >
                        <label className="ckbox mg-b-5">
                          <input
                            type="checkbox"
                            checked={data.isCheck}
                            onChange={() => onExportOptionChecked(data, index)}
                          />
                          <span>{data.exportContent}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="mg-y-15" />

                <div className="az-footer mg-t-auto" id="az_footer_id">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-12 text-right">
                        <button
                          type="button"
                          className="btn ViewChart_btn"
                          onClick={() => onViewChartClick()}
                        >
                          <i class="fa fa-eye"></i> View Chart
                        </button>
                        <button
                          type="button"
                          className="btn exportToXL_btn"
                          onClick={() => onExportXLS()}
                        >
                          <i class="fa fa-file-excel-o"></i> Export To XLS
                        </button>
                        <button
                          type="button"
                          className="btn search_btn"
                          onClick={() => onExportMES()}
                        >
                          <i class="fa fa-file-pdf-o"></i> Export MES Format
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* az-content-body */}
            </div>
            {/* container */}
          </div>
        </>
      )}
    </>
  );
};
export default ChartPage;
