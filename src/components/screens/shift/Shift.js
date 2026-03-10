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
  inputWithRangeValidator,
  dateValidator2,
} from "../../utils/Validator";
import {
  stationListUrl,
  shiftListUrl,
  shiftAccessUrl,
  insertShiftUrl,
  shiftDetailsUrl,
  shiftDefaultDetailsUrl,
  updateShiftUrl,
  deleteShiftUrl,
  appVersion,
  NA,
  inputMaxLength,
  statusActionId,
  fillListUrl,
} from "../../utils/constants";
import queryString from "query-string";
import $ from "jquery";
import { axiosGet, axiosPost } from "../framework/Axios";
import Header from "../common_components/Header";
import Footer from "../common_components/Footer";
import moment from "moment";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimeField from "react-simple-timefield";

Modal.setAppElement("#root");
var selectedShiftId = "";
const Shift = (props) => {
  const errorMap = {
    start_Date: "",
    shift_no: "",
    shift_date: "",
    shift_name: "",
    no_of_reading: "",
  };
  const [userData, setUserData] = useState({});
  const [shiftList, setShiftList] = useState([]);
  const [tempShiftList, setTempShiftList] = useState([]);
  const [shiftHeaderList, setShiftHeaderList] = useState([]);
  const [shiftAdvanceList, setShiftAdvanceList] = useState([]);
  const [shiftAdvanceByGroupList, setShiftAdvanceByGroupList] = useState([]);
  const [subGroupId, setSubGroupId] = useState(4);

  const [shiftAccessList, setShiftAccessList] = useState([]);
  const [shiftDetails, setShiftDetails] = useState({});
  const [shiftId, setShiftId] = useState("");
  const [shiftCode, setShiftCode] = useState("");
  const [shiftName, setShiftName] = useState("");
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
  const [deleteShiftId, setShiftIdForDelete] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setError] = useState(errorMap);
  const history = useHistory();
  const [isWriteAccess, setWriteAccess] = useState(false);
  const [isDeleteAccess, setDeleteAccess] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [sShiftSetNo, setSShiftSetNo] = useState("");
  const [sShiftDate, setSShiftDate] = useState("");
  const [statusId, setStatusId] = useState("");
  const [shiftSetNo, setShiftSetNo] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [firstShiftFrom, setFirstShiftFrom] = useState(new Date());
  const [firstShiftTo, setFirstShiftTo] = useState(new Date());
  const [secondShiftFrom, setSecondShiftFrom] = useState(new Date());
  const [secondShiftTo, setSecondShiftTo] = useState(new Date());
  const [thirdShiftFrom, setThirdShiftFrom] = useState(new Date());
  const [thirdShiftTo, setThirdShiftTo] = useState(new Date());

  const [lastShiftTo, setLastShiftTo] = useState(new Date());
  const [shiftFrom, setShiftFrom] = useState(new Date());

  const [shiftOneTo, setShiftOneTo] = useState(new Date());
  const [shiftOneFrom, setShiftOneFrom] = useState(new Date());

  const [currentId, setCurrentId] = useState(new Date());
  const [isActive, setIsActive] = useState("");
  const [statusName, setStatusName] = useState("");
  const [stationId, setStationId] = useState("");

  const [isShiftSetNoShow, setIsShiftSetNoShow] = useState(false);
  const [isShowDeleteIcon, setIsShowDeleteIcon] = useState(false);
  const [isActiveShiftList, setIsActiveShiftList] = useState(false);
  const [isAddAdvanceConfig, setIsAddAdvanceConfig] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedShiftAdvList, setSelectedShiftAdvList] = useState([]);
  const [selectedSubGroupList, setSelectedSubGroupList] = useState([]);

  useEffect(async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData != null) {
      setUserData(userData);
      if (userData["userAccess"].length > 0) {
        for (var i = 0; i < userData["userAccess"].length; i++) {
          if (userData["userAccess"][i]["ModuleID"] == 8) {
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
      setShiftId(props.location.state.shiftId);
    }
    getList(userData, "");
    getFillList(userData, statusActionId);
    getShiftDefaultDetails(userData);

    // getShiftAccess(userData);
  }, []);

  const getFillList = async (data, actionId) => {
    var result = await axiosGet(
      `${fillListUrl}?actionid=${actionId}&userid=${data.ID}`
    );
    if (result != null && result["error"] == 0) {
      if (actionId == statusActionId) {
        setStatusList(result["data"]);
      }
    }
  };

  // api call for shift list...........................
  const getList = async (data, search) => {
    setIsShowDeleteIcon(false);
    setSearch("");
    setIsAddAdvanceConfig(false);
    setIsReadOnly(true);
    const shiftListQueryParam = {
      Login_Id: data.ID,
      Search: search,
    };
    setLoader(true);
    var result = await axiosGet(`${shiftListUrl}`, shiftListQueryParam);
    setLoader(false);
    if (result != null && result["error"] == 0) {
      var data = result["data"];
      for (var i = 0; i < data.length; i++) {
        data[i]["isSelected"] = false;
      }
      setShiftList(result["data"]);
      setTempShiftList(result["data"]);
    }
  };

  // api call for shift access list........................
  const getShiftAccess = async (data) => {
    setLoader(true);
    var result = await axiosGet(`${shiftAccessUrl}?Login_Id=${data.ID}`);
    setLoader(false);
    if (result != null && result["error"] == 0) {
      setShiftAccessList(result["data"]);
    }
  };

  // api call for shift default details........................
  const getShiftDefaultDetails = async (data) => {
    setLoader(true);
    var result = await axiosGet(
      `${shiftDefaultDetailsUrl}?Login_Id=${data.ID}`
    );
    setLoader(false);
    if (result != null && result["error"] == 0) {
      if (result["data"] != null) {
        setShiftDetails(result["data"]);
        setShiftHeaderList(result["data"]["shift"]);
        setShiftSetNo(result["data"]["shift"][0]["ShiftID"]);

        var n = (await result["data"]["shift"].length) - 1;
        setThirdShiftTo(result["data"]["shift"][n]["ShiftEnd"]);
        setFirstShiftFrom(result["data"]["shift"][0]["ShiftStart"]);
        // setStationId(result['data'][0]['station_id'] ?? NA);

        setIsActive(result["data"]["shift"][0]["StatusID"]);
        setStatusName(result["data"]["shift"][0]["StatusName"]);
        var advanceList = result["data"]["shiftAdvance"];
        for (var i = 0; i < advanceList.length; i++) {
          advanceList[i]["isChanged"] = false;
        }
        setShiftAdvanceList(advanceList);
        const filterList = advanceList.filter((data) => {
          return data.SubGroup == subGroupId;
        });
        setShiftAdvanceByGroupList(filterList);
        setIsReadOnly(false);
      }
    }
  };

  // api call for shift details........................
  const getShiftDetails = async (data, shiftId) => {
    setLoader(true);
    var result = await axiosGet(
      `${shiftDetailsUrl}?Login_Id=${data.ID}&ShiftSetID=${shiftId}`
    );
    setLoader(false);
    if (result != null && result["error"] == 0) {
      if (result["data"] != null) {
        setShiftDetails(result["data"]);
        setShiftHeaderList(result["data"]["shift"]);
        setShiftSetNo(result["data"]["startDate"][0]["ShiftSetNo"]);
        setIsReadOnly(true);
        var n = (await result["data"]["shift"].length) - 1;
        setThirdShiftTo(result["data"]["shift"][n]["ShiftEnd"]);
        setFirstShiftFrom(result["data"]["shift"][0]["ShiftStart"]);

        setShiftAdvanceList(result["data"]["shiftAdvance"]);
        if (!result["data"]["shiftAdvance"].length > 0) {
          setIsAddAdvanceConfig(false);
        } else {
          setIsAddAdvanceConfig(true);
        }
        const filterList = result["data"]["shiftAdvance"].filter((data) => {
          return data.SubGroup == subGroupId;
        });
        setShiftAdvanceByGroupList(filterList);
        var selectedSGList = selectedSubGroupList;
        for (var i = 0; i < result["data"]["shiftAdvance"].length; i++) {
          if (
            !selectedSGList.includes(
              result["data"]["shiftAdvance"][i]["SubGroup"]
            )
          ) {
            if (result["data"]["shiftAdvance"][i]["is_added"] == 1) {
              selectedSGList.push(
                result["data"]["shiftAdvance"][i]["SubGroup"]
              );
            }
          }
        }
        setSelectedSubGroupList(selectedSGList);

        setStartDate(
          result["data"]["startDate"][0]["StartDate"] != null
            ? new Date(result["data"]["startDate"][0]["StartDate"])
            : NA
        );
        setIsActive(result["data"]["shift"][0]["Statusid"]);
        setStatusName(result["data"]["shift"][0]["StatusName"]);
        setCreatedUser(result["data"]["shift"][0]["CreatedUser"] ?? NA);
        setCreatedVersion(result["data"]["shift"][0]["CreatedVersion"] ?? NA);
        setCreatedDate(
          result["data"]["shift"][0]["CreatedDate"] != null
            ? moment(result["data"]["shift"][0]["CreatedDate"]).format(
                "DD-MM-YYYY"
              )
            : NA
        );

        setModifiedUser(result["data"]["shift"][0]["ModifiedUser"] ?? NA);
        setModifiedVersion(result["data"]["shift"][0]["ModifiedVersion"] ?? NA);
        setModifiedDate(
          result["data"]["shift"][0]["ModifiedDate"] != null
            ? moment(result["data"]["shift"][0]["ModifiedDate"]).format(
                "DD-MM-YYYY"
              )
            : NA
        );

        setDeletedUser(result["data"]["shift"][0]["DeletedUser"] ?? NA);
        setDeletedVersion(result["data"]["shift"][0]["DeletedVersion"] ?? NA);
        setDeletedDate(
          result["data"]["shift"][0]["DeletedDate"] != null
            ? moment(result["data"]["shift"][0]["DeletedDate"]).format(
                "DD-MM-YYYY"
              )
            : NA
        );
      }
    }
  };

  //doing search function.................................
  const onSearch = async (searchField) => {
    setSearch(searchField);
    if (searchField.length > 0) {
      setIsShowDeleteIcon(true);

      const searchList = tempShiftList.filter((data) => {
        return data.ShiftName.toLowerCase().includes(searchField.toLowerCase());
      });
      setShiftList(searchList);
    } else {
      setShiftList([]);
      setTempShiftList([]);
      getList(userData, "");
    }
  };

  //doing clear search function.................................
  const onSearchClear = () => {
    setSearch("");
    setShiftList([]);
    setTempShiftList([]);
    getList(userData, "");
  };

  //on shift list item click...................................
  const onShiftListItemClick = (data, shiftId, index) => {
    setIsShowDeleteIcon(false);
    setSearch("");
    selectedShiftId = shiftId;
    var data = shiftList;
    for (var i = 0; i < data.length; i++) {
      if (i == index) {
        data[i]["isSelected"] = true;
      } else {
        data[i]["isSelected"] = false;
      }
    }

    setShiftList([]);
    setTempShiftList([]);
    setSelectedSubGroupList([]);
    setShiftList(data);
    setTempShiftList(data);
    setShiftId(shiftId);
    getShiftDetails(userData, shiftId);
    setIsShiftSetNoShow(true);
    // history.push({pathname :'/shift',state : {'shiftId' : shiftId}});
  };

  //on add btn click...................................
  const onShiftAddClick = () => {
    clearField();
    setIsReadOnly(false);
    setIsAddAdvanceConfig(false);

    setStartDate(new Date());
    getShiftDefaultDetails(userData);

    // isShiftSetNoShow,
    setIsShiftSetNoShow(false);
    // history.push({pathname :'/shift',state : {'shiftId' : shiftId}});
  };

  //shift access checkbox changed...............................
  const onShiftAccessChanged = (index, isRead, isWrite, isDelete) => {
    const shiftAccList = shiftAccessList;
    shiftAccList[index]["Read"] = isRead;
    shiftAccList[index]["write"] = isWrite;
    shiftAccList[index]["Delete"] = isDelete;
    setShiftAccessList([]);
    setShiftAccessList(shiftAccList);
    // history.push({pathname :'/shift',state : {'shiftId' : shiftId}});
  };

  //input validation.................................................
  const inputValidate = (value, field) => {
    var errorValue;
    if (field == "shift start") {
      errorValue = dateValidator2(value, "shift start date");
    }

    if (errorValue !== "") {
      if (field == "shift start") {
        errorMap.shift_date = errorValue;
      }
      setError(errorMap);
      return false;
    } else {
      if (field == "shift start") {
        errorMap.shift_date = errorValue;
      }
      setError(errorMap);
      return true;
    }
  };

  //dropdown validation.................................................
  const dropdownValidate = (value, fieldName) => {
    const errorValue = dropdownValidator(value, fieldName);
    if (errorValue !== "") {
      errorMap.station = errorValue;
      setError(errorMap);
      return false;
    } else {
      errorMap.station = errorValue;
      setError(errorMap);
      return true;
    }
  };

  //on save button click............................................
  const onSaveClick = async () => {
    inputValidate(startDate, "shift start");
    if (!inputValidate(startDate, "shift start")) {
      return;
    }

    if (isAddAdvanceConfig && selectedShiftAdvList.length == 0) {
      toast.error("Please add atleast one subgroup.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } else {
      var mapData = {
        Login_id: userData.ID,
        StartDate: startDate,
        created_version: appVersion,
        udtshifts: shiftHeaderList,
        udtshiftAdvdetail: isAddAdvanceConfig ? selectedShiftAdvList : [],
      };

      setLoader(true);
      var result = await axiosPost(insertShiftUrl, mapData);
      setLoader(false);
      if (result != null && result["error"] == 0) {
        toast.success("Shift added successfully.", {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true,
        });
        clearField();
        setStartDate(new Date());
        getShiftDefaultDetails(userData);
      } else {
        toast.error(result["msg"], {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  };

  //on update button click............................................
  const onUpdateClick = async () => {
    if (isAddAdvanceConfig && selectedShiftAdvList.length == 0) {
      toast.error("Please add atleast one subgroup.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } else {
      var mapData = {
        Login_id: userData.ID,
        ShiftSetID: shiftId,
        Modified_Version: appVersion,
        udtshiftAdvdetail: isAddAdvanceConfig ? selectedShiftAdvList : [],
      };

      setLoader(true);
      var result = await axiosPost(updateShiftUrl, mapData);
      setLoader(false);
      if (result != null && result["error"] == 0) {
        toast.success("Shift updated successfully.", {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true,
        });
        clearField();
        setStartDate(new Date());
        getShiftDefaultDetails(userData);
      } else {
        toast.error(result["msg"], {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  };

  //toggle model for delete.................................
  function toggleModal(shiftId) {
    setIsOpen(!isOpen);
    if (shiftId == "") {
      return;
    } else {
      setShiftIdForDelete(shiftId);
    }
  }

  //toggle model for filter .................................
  function toggleFilterModal(shiftId) {
    setIsFilterOpen(!isFilterOpen);
    if (shiftId == "") {
      return;
    } else {
      setShiftIdForDelete(shiftId);
    }
  }

  // on filter click
  const onFilterClick = async () => {
    // 'RoleName like ''%QA%'' and statusid=1'
    var searchString = "";
    if (sShiftSetNo != "") {
      searchString = `ShiftSetNo like '%${sShiftSetNo}%'`;
    }
    if (sShiftDate != "") {
      if (searchString != "") {
        searchString = searchString + " and ";
      }
      searchString = `ShiftDate like '%${sShiftDate}%'`;
    }
    if (statusId != "" && statusId != "Choose one") {
      if (searchString != "") {
        searchString = searchString + " and ";
      }
      searchString = searchString + `StatusID=${statusId}`;
    }
    getList(userData, searchString);
    toggleFilterModal();
  };

  // on filter cancel
  const onFilterCancel = async () => {
    setSShiftSetNo("");
    setSShiftDate("");
    setStatusId("");
    toggleFilterModal();
    getList(userData, "");
  };

  //on delete button click............................................
  const onDeleteClick = async () => {
    setLoader(true);
    var result = await axiosGet(
      `${deleteShiftUrl}?Login_id=${userData.ID}&shift_id=${shiftId}&Deleted_Version=${appVersion}`
    );
    setLoader(false);
    toggleModal();
    if (result != null && result["error"] == 0) {
      toast.success("Shift deleted successfully.", {
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

  // for clear field
  const clearField = () => {
    setATA(false);
    errorMap.shift_no = "";
    errorMap.shift_name = "";
    errorMap.no_of_reading = "";
    setError(errorMap);
    setShiftId("");
    setShiftCode("");
    setShiftName("");
    setStartDate("");
    setStationId("");
    setStatusName("");
    setNoOfReading("");
    setSelectedSubGroupList([]);
    setSelectedShiftAdvList([]);
    getList(userData, "");
  };

  //on back button click............................................
  const onBackClick = async () => {
    history.goBack();
  };

  // on click shift start field
  const onShiftStartTimeChange = (value, index) => {
    const updatedList = [...shiftHeaderList];

    if (index === 0) {
      updatedList[index]["ShiftStart"] = value;
      updatedList[updatedList.length - 1]["ShiftEnd"] = value;
      setThirdShiftTo(value);
    } else {
      updatedList[index]["ShiftStart"] = value;
      updatedList[index - 1]["ShiftEnd"] = value;
      setLastShiftTo(value);
    }

    setShiftHeaderList(updatedList);
  };

  // on click shift end field
  const onShiftEndTimeChange = (value, index) => {
    const updatedList = [...shiftHeaderList];

    if (index === updatedList.length - 1) {
      updatedList[index]["ShiftEnd"] = value;
      updatedList[0]["ShiftStart"] = value;
      setFirstShiftTo(value);
    } else {
      updatedList[index]["ShiftEnd"] = value;
      updatedList[index + 1]["ShiftStart"] = value;
      setShiftFrom(value);
    }

    setShiftHeaderList(updatedList);
  };

  const onSubGroupChange = (value) => {
    const filterList = shiftAdvanceList.filter((data) => {
      return data.SubGroup == value;
    });
    setShiftAdvanceByGroupList(filterList);
    setSubGroupId(value);
  };

  // on click shift interval start field
  const onShiftIntervalStart = (value, index) => {
    // Clone lists (React immutability)
    const updatedByGroup = shiftAdvanceByGroupList.map((item) => ({ ...item }));
    const updatedAdvanceList = shiftAdvanceList.map((item) => ({ ...item }));

    if (index === 0) {
      updatedByGroup[index]["IntervalStart"] = value;
      updatedByGroup[updatedByGroup.length - 1]["IntervalEnd"] = value;
      setCurrentId(0);
      setShiftOneTo(updatedByGroup[updatedByGroup.length - 1]["IntervalEnd"]);
    } else {
      updatedByGroup[index]["IntervalStart"] = value;
      updatedByGroup[index - 1]["IntervalEnd"] = value;
      setCurrentId(index - 1);
      setShiftOneTo(updatedByGroup[index - 1]["IntervalEnd"]);
    }

    setShiftAdvanceByGroupList(updatedByGroup);

    // Sync to shiftAdvanceList
    let selectedSubgroup = "";

    for (let i = 0; i < updatedByGroup.length; i++) {
      for (let j = 0; j < updatedAdvanceList.length; j++) {
        if (
          updatedByGroup[i]["SubGroup"] === updatedAdvanceList[j]["SubGroup"] &&
          updatedByGroup[i]["Shift"] === updatedAdvanceList[j]["Shift"] &&
          updatedByGroup[i]["Interval"] === updatedAdvanceList[j]["Interval"]
        ) {
          selectedSubgroup = updatedAdvanceList[j]["SubGroup"];
          updatedAdvanceList[j]["IntervalStart"] =
            updatedByGroup[i]["IntervalStart"];
          updatedAdvanceList[j]["IntervalEnd"] =
            updatedByGroup[i]["IntervalEnd"];
        }
      }
    }

    if (selectedSubgroup !== "") {
      for (let i = 0; i < updatedAdvanceList.length; i++) {
        if (updatedAdvanceList[i]["SubGroup"] === selectedSubgroup) {
          updatedAdvanceList[i]["isChecked"] = true;
        }
      }
    }

    setShiftAdvanceList(updatedAdvanceList);
  };
  const onShiftIntervalEnd = (value, index) => {
    // Clone lists (React immutability)
    const updatedByGroup = shiftAdvanceByGroupList.map((item) => ({ ...item }));
    const updatedAdvanceList = shiftAdvanceList.map((item) => ({ ...item }));

    if (index === updatedByGroup.length - 1) {
      updatedByGroup[index]["IntervalEnd"] = value;
      updatedByGroup[0]["IntervalStart"] = value;
      setCurrentId(updatedByGroup.length - 1);
      setShiftOneFrom(updatedByGroup[0]["IntervalStart"]);
    } else {
      updatedByGroup[index]["IntervalEnd"] = value;
      updatedByGroup[index + 1]["IntervalStart"] = value;
      setCurrentId(index + 1);
      setShiftOneFrom(updatedByGroup[index + 1]["IntervalStart"]);
    }

    setShiftAdvanceByGroupList(updatedByGroup);

    // Sync to shiftAdvanceList
    let selectedSubgroup = "";

    for (let i = 0; i < updatedByGroup.length; i++) {
      for (let j = 0; j < updatedAdvanceList.length; j++) {
        if (
          updatedByGroup[i]["SubGroup"] === updatedAdvanceList[j]["SubGroup"] &&
          updatedByGroup[i]["Shift"] === updatedAdvanceList[j]["Shift"] &&
          updatedByGroup[i]["Interval"] === updatedAdvanceList[j]["Interval"]
        ) {
          selectedSubgroup = updatedAdvanceList[j]["SubGroup"];
          updatedAdvanceList[j]["IntervalStart"] =
            updatedByGroup[i]["IntervalStart"];
          updatedAdvanceList[j]["IntervalEnd"] =
            updatedByGroup[i]["IntervalEnd"];
        }
      }
    }

    if (selectedSubgroup !== "") {
      for (let i = 0; i < updatedAdvanceList.length; i++) {
        if (updatedAdvanceList[i]["SubGroup"] === selectedSubgroup) {
          updatedAdvanceList[i]["isChecked"] = true;
        }
      }
    }

    setShiftAdvanceList(updatedAdvanceList);
  };

  const onDoneClick = () => {
    var selectedSGList = selectedSubGroupList;
    var selectedAdvShift = [];
    var shiftFirstFrom = shiftHeaderList[0]["ShiftStart"];
    var shiftSecondFrom = shiftHeaderList[1]["ShiftStart"];
    var shiftThirdFrom = shiftHeaderList[2]["ShiftStart"];
    var firstAdv = "";
    var secondAdv = "";
    var thirdAdv = "";
    if (!selectedSGList.includes(parseInt(subGroupId))) {
      for (var i = 0; i < shiftAdvanceList.length; i++) {
        if (shiftAdvanceList[i]["SubGroup"] == subGroupId) {
          selectedAdvShift.push(shiftAdvanceList[i]);
          if (
            shiftAdvanceList[i]["Shift"] == 1 &&
            shiftAdvanceList[i]["Interval"] == 1
          ) {
            firstAdv = shiftAdvanceList[i]["IntervalStart"];
          }
          if (
            shiftAdvanceList[i]["Shift"] == 2 &&
            shiftAdvanceList[i]["Interval"] == 1
          ) {
            secondAdv = shiftAdvanceList[i]["IntervalStart"];
          }
          if (
            shiftAdvanceList[i]["Shift"] == 3 &&
            shiftAdvanceList[i]["Interval"] == 1
          ) {
            thirdAdv = shiftAdvanceList[i]["IntervalStart"];
          }
        }
      }

      if (
        shiftFirstFrom == firstAdv &&
        shiftSecondFrom == secondAdv &&
        shiftThirdFrom == thirdAdv
      ) {
        selectedSGList.push(parseInt(subGroupId));
        setSelectedSubGroupList(selectedSGList);
        setSelectedShiftAdvList(selectedAdvShift);
        toast.success("This subgroup added successfully.", {
          theme: "colored",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        toast.error(
          "You cannot proceed ahead as Shift time and Interval time does not match",
          {
            theme: "colored",
            autoClose: 3000,
            hideProgressBar: true,
          }
        );
      }
    } else {
      toast.error("This subgroup data already added.", {
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const onChangeStartDate = (date, e) => {
    setStartDate(date);
    inputValidate(e.currentTarget.value, "start date");
  };

  return (
    <>
      {isLoading ? <Loader></Loader> : null}
      <ToastContainer autoClose={5000} hideProgressBar={false} />

      <Modal isOpen={isOpen} onRequestClose={toggleModal}>
        {/* <div class="modal fade" id="delete_pop_modal" shift="dialog"> */}
        <div class="modal-dialog custom_modal_dialog">
          <div class="modal-content" style={{ borderRadius: "0px" }}>
            <div class="modal-header">
              <h4 class="modal-title modal_title_text">Confirm Delete</h4>
              <button
                type="button"
                class="close"
                data-bs-dismiss="modal"
                onClick={toggleModal}
              >
                &times;
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <h3 className="pop_label">
                    Do you really want to delete this shift?
                  </h3>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group text-right mt-5">
                    <a
                      href="javascript:void(0);"
                      class="btn save_btn"
                      onClick={onDeleteClick}
                    >
                      <i class="fa fa-check"></i>&nbsp; Yes
                    </a>
                    <a
                      href="javascript:void(0);"
                      class="btn cancel_btn"
                      data-bs-dismiss="modal"
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
        {/* </div> */}
      </Modal>

      <Modal isOpen={isFilterOpen} onRequestClose={toggleFilterModal}>
        {/*  <div id="user_filter" className="modal fade" role="dialog"> */}
        <div className="modal-dialog custom_modal_dialog">
          <div className="modal-content" style={{ borderRadius: "0px" }}>
            <div className="modal-header">
              <h4 className="modal-title">Shift Filter</h4>
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
                    <label className="custom_label">Shift Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={sShiftDate}
                      onInput={(e) => setSShiftDate(e.currentTarget.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="custom_label">Status</label>
                    <select
                      className="form-control"
                      value={statusId}
                      onChange={(e) => setStatusId(e.currentTarget.value)}
                    >
                      <option>Choose one</option>
                      {statusList.map((item) => (
                        <option key={item.ID} value={item.ID}>
                          {item.statusName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group text-right mt-5">
                    <button
                      type="button"
                      className="btn search_btn"
                      data-bs-dismiss="modal"
                      onClick={() => onFilterClick()}
                    >
                      <i class="fa fa-search"></i>&nbsp; Search
                    </button>
                    <button
                      type="button"
                      className="btn cancel_btn"
                      data-bs-dismiss="modal"
                      onClick={() => onFilterCancel()}
                    >
                      <i class="fa fa-times"></i>&nbsp; Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Modal>

      <Header activeId={"isShiftActiveColor"} />

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
              <div className="search-form">
                <input
                  type="search"
                  placeholder="Search"
                  className="search-input"
                  value={search}
                  onInput={(e) => onSearch(e.currentTarget.value)}
                />
                <i
                  className="fa fa-search search-button"
                  onClick={onSearchClear}
                />
                <div className="search-option">
                  {isShowDeleteIcon ? (
                    <div>
                      <input
                        name="type"
                        type="radio"
                        defaultValue="type-posts"
                        id="type-posts"
                      />
                      <label htmlFor="type-posts">
                        <i
                          className="fa fa-times-circle edit-pen-title"
                          onClick={onSearchClear}
                        />
                        <span>Cancel</span>
                      </label>
                    </div>
                  ) : (
                    <div className="p-0 m-0">
                      {" "}
                      <input
                        name="type"
                        type="radio"
                        defaultValue="type-posts"
                        id="type-posts"
                      />
                    </div>
                  )}

                  <div
                    data-bs-toggle="modal"
                    data-bs-target="#delete_pop_modal"
                    onClick={() => toggleFilterModal(shiftId)}
                  >
                    <input
                      name="type"
                      type="radio"
                      defaultValue="user_filter"
                      id="user_filter"
                    />
                    <label htmlFor="type-users">
                      <i className="fa fa-filter edit-pen-title" />
                      <span>Filter</span>
                    </label>
                  </div>
                </div>
              </div>
              <nav className="nav flex-column left_menu">
                {/* onClick={() => onShiftItemClick(data.id)} */}
                {shiftList.map((data, i) => (
                  <a
                    className={
                      data.Statusid != 1
                        ? !data.isSelected
                          ? "nav-link "
                          : "nav-link text-danger"
                        : "nav-link"
                    }
                    key={i}
                    onClick={() => onShiftListItemClick(data, data.id, i)}
                    style={{ display: "flex" }}
                  >
                    <i class="fa fa-clock-o"></i>
                    <span className="leftmenu_style">{data.ShiftName}</span>
                  </a>
                ))}
              </nav>
              <a
                className="btn btn-primary add_btn"
                id="add_btn_id"
                onClick={() => onShiftAddClick()}
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
                            <span>Shift</span>
                        </div> */}
            <h2 className="az-content-title">Shift</h2>
            {/* <h6 className="active_status">Active</h6> */}
            <h6
              class={
                isActive == 1 ? "active_status" : "active_status text-danger"
              }
            >
              {statusName != "" ? statusName : ""}
            </h6>

            <div className="row">
              {/* { isShiftSetNoShow ? (
                            <div className="col-md-4 form-group">
                                <label className="custom_label">Shift Set No<span className="star_mark">*</span></label>
                                <input className="form-control" placeholder="Enter Shift Set No" type="text" value={shiftSetNo} onInput={e => setShiftSetNo(e.currentTarget.value)} readOnly />
                           
                            </div>): (<div></div>)} */}
              {/* <div className="col-md-4 form-group">
                                <label className="custom_label">Shift Set No<span className="star_mark">*</span></label>
                                <input className="form-control" placeholder="Enter Shift Set No" type="text" value={shiftSetNo} onInput={e => setShiftSetNo(e.currentTarget.value)} readOnly />
                            </div> */}
              <div className="col-md-4 form-group" >
                <label className="custom_label">
                  {" "}
                  Start Date <span className="star_mark">*</span>
                </label>
                <DatePicker
                className="form-control"
                dateFormat="dd/MM/yyyy"
                disabled={shiftId !== ""}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                showDisabledMonthNavigation
              />
                {errors.shift_date.length > 0 && (
                  <span className="error">{errors.shift_date}</span>
                )}
              </div>
            </div>
            {/* <div className="row">
                            <div className="col-md-12">
                                <fieldset className="custm_fieldset">
                                    <legend>Shift Timing</legend>
                                    {shiftHeaderList.map((data, i) => (
                                        <div className="row" key={Math.random()}>
                                            <div className="col-md-2 form-group">
                                                <label className="custom_label">{i == 0 ? 'First Shift' : i == 1 ? 'Second Shift' : 'Third Shift'}</label>
                                            </div>
                                            <div className="col-md-5 form-group" style={{ display: 'flex' }}>

                                                <label htmlFor="fname" className='FromClass'>From&nbsp;</label>
                                                <TimeField key={Math.random()} className="form-control form_height_28 w-75" value={data.ShiftStart != null ? (i == 0 ? firstShiftFrom && data.ShiftStart : data.ShiftStart) : ''} onChange={(event, value) => onShiftStartTimeChange(value, i)} />

                                                <label htmlFor="fname" className='ToClass'>&nbsp;To&nbsp;</label>
                                                <TimeField key={Math.random()} className="form-control form_height_28 w-75" value={data.ShiftEnd != null ? (i == shiftHeaderList.length - 1 ? thirdShiftTo && data.ShiftEnd : data.ShiftEnd) : ''} onChange={(event, value) => onShiftEndTimeChange(value, i)} />

                                            </div>
                                        </div>
                                    ))}
                                </fieldset>
                            </div>
                        </div> */}

            <div className="row">
              <div className="col-md-12 mg-t-15 mg-b-15">
                <div
                  style={{ backgroundColor: "#f0f0f0", padding: "10px 10px" }}
                >
                  <h4 style={{ fontWeight: "600", marginBottom: "15px" }}>
                    Shift Timing
                  </h4>

                  {shiftHeaderList.map((data, i) => (
                    <div className="row"  key={data.ShiftID ?? i}>
                      <div className="col-md-2 form-group">
                        <label className="custom_label">
                          {i == 0
                            ? "First Shift"
                            : i == 1
                            ? "Second Shift"
                            : "Third Shift"}
                        </label>
                      </div>
                      <div
                        className="col-md-3 form-group"
                        style={{ display: "flex" }}
                      >
                        <label htmlFor="fname" className="FromClass">
                          From&nbsp;
                        </label>
                        <TimeField
                          className="form-control form_height_28 w-75"
                          disabled={"true"}
                          value={
                            data.ShiftStart != null
                              ? i == 0
                                ? firstShiftFrom && data.ShiftStart
                                : data.ShiftStart
                              : ""
                          }
                          onChange={(event, value) =>
                            onShiftStartTimeChange(value, i)
                          }
                        />

                        <label htmlFor="fname" className="ToClass">
                          &nbsp;To&nbsp;
                        </label>
                        <TimeField
                           
                          className="form-control form_height_28 w-75"
                          disabled={shiftId != "" ? "true" : null}
                          value={
                            data.ShiftEnd != null
                              ? i == shiftHeaderList.length - 1
                                ? thirdShiftTo && data.ShiftEnd
                                : data.ShiftEnd
                              : ""
                          }
                          onChange={(event, value) =>
                            onShiftEndTimeChange(value, i)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="mg-b-15">
                  <div className="row">
                    <div className="col-md-12">
                      <div style={{ display: "flex", marginBottom: "15px" }}>
                        <h4 style={{ marginRight: "5px" }}>
                          Do you want to add the advance configuration
                        </h4>
                        <label class="ckbox mg-b-5">
                           <input
                            type="checkbox"
                            disabled={isReadOnly}
                            checked={isAddAdvanceConfig}
                            onChange={() => setIsAddAdvanceConfig(!isAddAdvanceConfig)}
                          />
                          <span> </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {isAddAdvanceConfig ? (
                    <>
                      <div className="row">
                        <div className="col-md-2">
                          <h6
                            style={{
                              lineHeight: "2.5",
                              fontSize: "13px",
                              marginBottom: "0px",
                            }}
                          >
                            Sub Group Size
                          </h6>
                        </div>
                        <div className="col-md-2 nopadding">
                          <select
                            className="form-control select2-no-search"
                            value={subGroupId}
                            onChange={(e) =>
                              onSubGroupChange(e.currentTarget.value)
                            }
                          >
                            <option label="Choose one" />
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                          </select>
                        </div>
                        <div className="col-md-1 nopadding">
                          <a
                            className="btn save_btn"
                            onClick={() => onDoneClick()}
                          >
                            <i class="fa fa-check"></i>
                          </a>

                          {/* <label class="ckbox mg-b-5" style={{marginTop:'5px'}}>
                                                <input type="checkbox" /><span> </span>
                                            </label> */}
                        </div>
                        <div className="col-md-4 nopadding">
                          <div className="d-flex">
                            <h6
                              style={{
                                lineHeight: "2.5",
                                fontSize: "13px",
                                marginBottom: "0px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Selected Sub Group Size :{" "}
                            </h6>
                            {selectedSubGroupList.length > 0
                              ? selectedSubGroupList.map((data, index) => (
                                  <label className="SubgroupSizeSave">
                                    {data}
                                  </label>
                                ))
                              : null}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="shift_style">
                            <div className="row mg-b-5">
                              <div className="col-md-4">
                                <h6 style={{ marginBottom: "0px" }}>Shift 1</h6>
                              </div>
                              <div className="col-md-8">
                                <h6 style={{ marginBottom: "0px" }}>
                                  Pre Lunch
                                </h6>
                              </div>
                            </div>
                            {shiftAdvanceByGroupList.map((data, i) => (
                              <>
                                {data.Shift == 1 ? (
                                  <>
                                    <div
                                      className="row mg-b-5"
                                       
                                    >
                                      <div className="col-md-4 ">
                                        <h6
                                          className="interval_style"
                                           
                                        >
                                          {"Interval " +
                                            (data.Interval <= subGroupId
                                              ? data.Interval
                                              : data.Interval -
                                                subGroupId -
                                                (subGroupId == 5
                                                  ? 0
                                                  : subGroupId == 4
                                                  ? 1
                                                  : subGroupId == 3
                                                  ? 2
                                                  : 3))}
                                        </h6>
                                      </div>
                                      <div className="col-md-8">
                                        <div className="row">
                                          <div className="col-md-5">
                                            <TimeField
                                               
                                              className="form-control form_height_28  w-100 px-1"
                                              disabled={"true"}
                                              value={
                                                data.IntervalStart != null
                                                  ? currentId == i
                                                    ? shiftOneFrom &&
                                                      data.IntervalStart
                                                    : data.IntervalStart
                                                  : ""
                                              }
                                              onChange={(event, value) =>
                                                onShiftIntervalStart(value, i)
                                              }
                                            />
                                          </div>
                                          <div className="col-md-2">
                                            <h6 className="dash_class">-</h6>
                                          </div>
                                          <div className="col-md-5">
                                            <TimeField
                                              
                                              disabled={
                                                data.is_added == 1 &&
                                                shiftId != ""
                                                  ? "true"
                                                  : null
                                              }
                                              className="form-control form_height_28  w-100 px-1"
                                              value={
                                                data.IntervalEnd != null
                                                  ? currentId == i
                                                    ? shiftOneTo &&
                                                      data.IntervalEnd
                                                    : data.IntervalEnd
                                                  : ""
                                              }
                                              onChange={(event, value) =>
                                                onShiftIntervalEnd(value, i)
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {i == subGroupId - 1 ||
                                    i == subGroupId * 3 - 1 ||
                                    i == subGroupId * 5 - 1 ? (
                                      <div
                                        className="row mg-b-5"
                                         
                                      >
                                        <div className="col-md-4">
                                          <h6 />
                                        </div>
                                        <div className="col-md-8">
                                          <h6
                                            style={{
                                              marginBottom: "0px",
                                              marginTop: "15px",
                                            }}
                                          >
                                            Post Lunch
                                          </h6>
                                        </div>
                                      </div>
                                    ) : null}
                                  </>
                                ) : null}
                              </>
                            ))}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="shift_style">
                            <div className="row mg-b-5">
                              <div className="col-md-4">
                                <h6 style={{ marginBottom: "0px" }}>Shift 2</h6>
                              </div>
                              <div className="col-md-8">
                                <h6 style={{ marginBottom: "0px" }}>
                                  Pre Lunch
                                </h6>
                              </div>
                            </div>

                            {shiftAdvanceByGroupList.map((data, i) => (
                              // {'Interval ' + ( i < subGroupId ? (i + 1) : ( (i + 1)- subGroupId*3))}
                              <>
                                {data.Shift == 2 ? (
                                  <>
                                    <div
                                      className="row mg-b-5"
                                       
                                    >
                                      <div className="col-md-4 ">
                                        <h6
                                          className="interval_style"
                                          
                                        >
                                          {"Interval " +
                                            (data.Interval <= subGroupId
                                              ? data.Interval
                                              : data.Interval -
                                                subGroupId -
                                                (subGroupId == 5
                                                  ? 0
                                                  : subGroupId == 4
                                                  ? 1
                                                  : subGroupId == 3
                                                  ? 2
                                                  : 3))}
                                        </h6>
                                      </div>
                                      <div className="col-md-8">
                                        <div className="row">
                                          <div className="col-md-5">
                                            <TimeField
                                               
                                              className="form-control form_height_28  w-100 px-1"
                                              disabled={"true"}
                                              value={
                                                data.IntervalStart != null
                                                  ? currentId == i
                                                    ? shiftOneFrom &&
                                                      data.IntervalStart
                                                    : data.IntervalStart
                                                  : ""
                                              }
                                              onChange={(event, value) =>
                                                onShiftIntervalStart(value, i)
                                              }
                                            />
                                          </div>
                                          <div className="col-md-2">
                                            <h6 className="dash_class">-</h6>
                                          </div>
                                          <div className="col-md-5">
                                            <TimeField
                                               
                                              disabled={
                                                data.is_added == 1 &&
                                                shiftId != ""
                                                  ? "true"
                                                  : null
                                              }
                                              className="form-control form_height_28  w-100 px-1"
                                              value={
                                                data.IntervalEnd != null
                                                  ? currentId == i
                                                    ? shiftOneTo &&
                                                      data.IntervalEnd
                                                    : data.IntervalEnd
                                                  : ""
                                              }
                                              onChange={(event, value) =>
                                                onShiftIntervalEnd(value, i)
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {i == subGroupId - 1 ||
                                    i == subGroupId * 3 - 1 ||
                                    i == subGroupId * 5 - 1 ? (
                                      <div
                                        className="row mg-b-5"
                                         
                                      >
                                        <div className="col-md-4">
                                          <h6 />
                                        </div>
                                        <div className="col-md-8">
                                          <h6
                                            style={{
                                              marginBottom: "0px",
                                              marginTop: "15px",
                                            }}
                                          >
                                            Post Lunch
                                          </h6>
                                        </div>
                                      </div>
                                    ) : null}
                                  </>
                                ) : null}
                              </>
                            ))}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="shift_style">
                            <div className="row mg-b-5">
                              <div className="col-md-4">
                                <h6 style={{ marginBottom: "0px" }}>Shift 3</h6>
                              </div>
                              <div className="col-md-8">
                                <h6 style={{ marginBottom: "0px" }}>
                                  Pre Lunch
                                </h6>
                              </div>
                            </div>

                            {shiftAdvanceByGroupList.map((data, i) => (
                              <>
                                {data.Shift == 3 ? (
                                  <>
                                    <div
                                      className="row mg-b-5"
                                       
                                    >
                                      <div className="col-md-4 ">
                                        <h6
                                          className="interval_style"
                                           
                                        >
                                          {"Interval " +
                                            (data.Interval <= subGroupId
                                              ? data.Interval
                                              : data.Interval -
                                                subGroupId -
                                                (subGroupId == 5
                                                  ? 0
                                                  : subGroupId == 4
                                                  ? 1
                                                  : subGroupId == 3
                                                  ? 2
                                                  : 3))}
                                        </h6>
                                      </div>
                                      <div className="col-md-8">
                                        <div className="row">
                                          <div className="col-md-5">
                                            <TimeField
                                               
                                              className="form-control form_height_28  w-100 px-1"
                                              disabled={"true"}
                                              value={
                                                data.IntervalStart != null
                                                  ? currentId == i
                                                    ? shiftOneFrom &&
                                                      data.IntervalStart
                                                    : data.IntervalStart
                                                  : ""
                                              }
                                              onChange={(event, value) =>
                                                onShiftIntervalStart(value, i)
                                              }
                                            />
                                          </div>
                                          <div className="col-md-2">
                                            <h6 className="dash_class">-</h6>
                                          </div>
                                          <div className="col-md-5">
                                            <TimeField
                                               
                                              disabled={
                                                data.is_added == 1 &&
                                                shiftId != ""
                                                  ? "true"
                                                  : null
                                              }
                                              className="form-control form_height_28  w-100 px-1"
                                              value={
                                                data.IntervalEnd != null
                                                  ? currentId == i
                                                    ? shiftOneTo &&
                                                      data.IntervalEnd
                                                    : data.IntervalEnd
                                                  : ""
                                              }
                                              onChange={(event, value) =>
                                                onShiftIntervalEnd(value, i)
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {i == subGroupId - 1 ||
                                    i == subGroupId * 3 - 1 ||
                                    i == subGroupId * 5 - 1 ? (
                                      <div
                                        className="row mg-b-5"
                                         
                                      >
                                        <div className="col-md-4">
                                          <h6 />
                                        </div>
                                        <div className="col-md-8">
                                          <h6
                                            style={{
                                              marginBottom: "0px",
                                              marginTop: "15px",
                                            }}
                                          >
                                            Post Lunch
                                          </h6>
                                        </div>
                                      </div>
                                    ) : null}
                                  </>
                                ) : null}
                              </>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            {shiftId != "" ? (
              <div className="row mt-3">
                <div className="col-12">
                  <div id="accordion">
                    <div className="card">
                      <div className="card-header">
                        <a
                          href="#demo"
                          data-bs-toggle="collapse"
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
                    {shiftId == "" && isWriteAccess ? (
                      <button
                        type="button"
                        className="btn save_btn"
                        onClick={onSaveClick}
                      >
                        <i class="fa fa-save"></i>&nbsp; Save
                      </button>
                    ) : null}
                    {shiftId != "" && isWriteAccess ? (
                      <button
                        type="button"
                        className="btn update_btn"
                        onClick={onUpdateClick}
                      >
                        Update
                      </button>
                    ) : null}
                    {/*{shiftId != '' && isDeleteAccess ? (<button type="button" className="btn delete_btn" data-bs-toggle="modal" data-bs-target="#delete_pop_modal" onClick={() => toggleModal(shiftId)}>Delete</button>) : (null)} */}
                    {/* <button type="button" className="btn" onClick={onBackClick}>Back</button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* az-content-body */}
        </div>
        {/* container */}
      </div>
      {/* az-content */}
    </>
  );
};
export default Shift;
