
export function emailValidator(value) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value == '') {
        return 'Please enter email.';
    } else if (!re.test(value)) {
        return 'Please enter proper email.';
    } else {
        return '';
    }
}

export function usernameValidator(value) {
    if (value == '') {
        return 'Please enter user name.';
    }
    else {
        return '';
    }
}

export function defaultEmailValidator(value) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value != '' && !re.test(value)) {
        return 'Please enter proper email.';
    } else {
        return '';
    }

}

export function loginPasswordValidator(value) {
    if (value == '') {
        return 'Password can not be blank.';
    }
    else {
        return '';
    }

}

export function passwordValidator(value) {
    if (value == '') {
        return 'Password can not be blank.';
    }
    else {
        return '';
    }
}

export function oldPasswordValidator(value, newPassword) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
    if (value == '') {
        return 'Password can not be blank.';
    } else if (!re.test(value)) {
        return 'Minimum 8 characters with one capital letter and one digit and one special characters. Maximum length 12 characters.';
    } else if (newPassword != null && value !== newPassword) {
        return 'Current password and new password must not be same.'
    } else {
        return '';
    }

}

export function confirmPasswordValidator(value, pass) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/;
    if (value == '') {
        return 'Please enter confirm password';
    }
    else if (value != pass) {
        return 'Password and confirm password should match'
    } else {
        return '';
    }
}




export function requiredValidator(value) {
    if (value == '') {
        return 'Please Enter Value.';
    } else {
        return '';
    }
}

export function companyNameValidator(value) {
    var RegEx = /\d/g;
    if (value == '') {
        return 'Please Enter Company Name.';
    } else if (value != '' && value.length > 100) {
        return 'Company name must not be greater than 100 characters';
    } else if (RegEx.test(value)) {
        return 'Company name does not contain number.';
    } else {
        return '';
    }
}

export function addressValidator(value, fieldName) {
    var RegEx = /\d/g;
    var regForSymbol = /[!@#$%^&*_+\=\[\]{};':"|<>?]+/;
    if (value != '' && value.length > 200) {
        return `${fieldName} must not be greater than 200 characters`;
    } else if (value != '' && regForSymbol.test(value)) {
        return `${fieldName} does not contain this special character.`;
    } else {
        return '';
    }
}

export function departmentValidator(value) {
    var RegEx = /\d/g;
    var regForSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (value != '' && value.length > 50) {
        return 'Designation must not be greater than 50 characters';
    } else if (value != '' && RegEx.test(value)) {
        return 'Department does not contain number.';
    } else if (regForSymbol.test(value)) {
        return 'Department does not contain special character.';
    } else {
        return '';
    }

}
export function designationValidator(value) {
    var RegEx = /\d/g;
    var regForSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (value != '' && value.length > 100) {
        return 'Designation must not be greater than 100 characters';
    } else if (value != '' && RegEx.test(value)) {
        return 'Designation does not contain number.';
    } else if (regForSymbol.test(value)) {
        return 'Designation does not contain special character.';
    } else {
        return '';
    }

}

export function dropdownValidator(value, fieldName) {
    if (value == '' || value == 'Select from list' || value == 'Choose one') {
        return `Please select ${fieldName.charAt(0).toLowerCase() + fieldName.slice(1)}`;
    } else {
        return '';
    }

}

export function dateValidator2(value, fieldName) {
    if (value == '' || value == null || value == 'null') {
        return `Please select ${fieldName.charAt(0).toLowerCase() + fieldName.slice(1)}`;
    } else {
        return '';
    }

}

export function dropdownValidatorForCustomDate(value, fieldName, fromDate, toDate) {
    if (value == 'Custom Period') {
        if (fromDate == '') {
            return `Please select From date`;
        }
        else if (toDate == '') {
            return `Please select To date`;
        } else {
            return '';
        }
    } else {
        return '';
    }

}
export function dateValidator(value, fieldName, compaireField) {
    if ((value == '' || value == null) && fieldName == 'from date') {
        return `Please select ${fieldName}`;
    } else if (value != '' && value != null && fieldName == 'to date') {
        if (new Date(value) < new Date(compaireField)) {
            return `To date must be greater than the from date.`;
        } else {
            return '';
        }
    } else {
        return '';
    }
}

export function inputValidator(value, fieldName) {
    if (value.toString() == '') {
        if (fieldName == 'chart type') {
            return `Please select the chart type`;
        }
        else {
            return `Please enter  ${fieldName}`;
        }
    }
    else if (fieldName == 'start date' && value == null) {
        return `Please enter  ${fieldName}`;

    }
    else {
        return '';
    }
}

export function palletValidator(value, fieldName) {
    if (value.length > 0 && value.toString() == '0') {
        return `Entered value must be greater then 0`;
    }
    else {
        return '';
    }
}


export function inputValidatorRoleName(value, fieldName) {
    if (value == '') {
        return `Please enter ${fieldName}`;
    } else if (value.length > 50) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not be greater than 50 characters`;
    } else {
        return '';
    }
}

export function inputValidatorOperationLine(value, fieldName) {
    if (value == '') {
        return `Please enter ${fieldName}`;
    } else if (value.length > 50) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not be greater than 50 characters`;
    } else {
        return '';
    }
}

export function inputLslValidator(value, fieldName, compaire_value, compaire_field) {
    if (value.toString() == '') {
        return `Please enter ${fieldName}`;
    } else if (+(value) >= +(compaire_value)) {
        return `${fieldName} must be less than the ${compaire_field}`;
    } else {
        return '';
    }
}

export function inputUslValidator(value, fieldName, compaire_value, compaire_field) {
    if (value.toString() == '') {
        return `Please enter ${fieldName}`;
    } else if (+(value) <= +(compaire_value)) {
        return `${fieldName} must be greater than the ${compaire_field}`;
    } else {
        return '';
    }
}

export function inputFrequencyValidator(value, fieldName) {
    if (value.toString() == '') {
        return `Please enter ${fieldName}`;
    } else if (value == 0) {
        return `The ${fieldName} can not be ${value}`;
    } else if (value.toString().length > 2) {
        return `The ${fieldName} can not be more than 2 digit.`;
    } else {
        return '';
    }
}

export function inputFileFormatValidator(value, fieldName) {
    var file = value.length > 0 ? value[0]['name'].toString().toLowerCase() : '';
    if (file == '') {
        return `Please upload only jpg and png  file`;
    }
    else if (!file.includes('.jpg') && !file.includes('.jpeg') && !file.includes('.png')) {
        return `Only jpg and png file allowed.`;
    }
    else {
        return '';
    }
}


export function inputValidatorFormula(value, fieldName) {
    if (value == '') {
        return `Please enter ${fieldName}`;
    }else {
        return '';
    }
}


export function inputUpclValidator(value, fieldName, compaire_value1, compaire_value2) {
    if (value == '') {
        return `Please enter ${fieldName}`;
    } else if (+(value) >= +(compaire_value1) || +(value) <= +(compaire_value2)) {
        return `${fieldName} must be between USL and Mean`;
    } else {
        return '';
    }
}

export function inputMasterSizeValidator(value, fieldName, compaire_value1, compaire_value2) {
    // if(value == ''){
    //     return `Please enter ${fieldName}`;
    // }else

    if (value != '' && (+(value) >= +(compaire_value1) || +(value) <= +(compaire_value2))) {
        return `${fieldName} must be between USL and LSL`;
    } else {
        return '';
    }
}

export function inputLpclValidator(value, fieldName, compaire_value1, compaire_value2) {
    if (value.toString() == '') {
        return `Please enter ${fieldName}`;
    } else if (+(value) <= +(compaire_value1) || +(value) >= +(compaire_value2)) {
        return `${fieldName} must be between LSL and Mean`;
    } else {
        return '';
    }
}

export function inputWithRangeValidator(value, fieldName, digit) {
    if (value == '') {
        return `Please enter ${fieldName}`;
    } else if (digit != null && value.length > digit) {
        return `Max ${digit} character are allowed.`;
    } else {
        return '';
    }

}

export function inputWithValueValidator(value, fieldName, digit, isATAValue) {
    if (value == '') {
        return `Please enter ${fieldName}`;
    } else if (digit != null && value > digit) {
        return `More than ${digit} not allowed.`;
    }
    else if (isATAValue && value == "0") {
        return `No of Consecutive Readings cannot be zero`;
    }
    else {
        return '';
    }
}


export function inputValidatorForPallet(value, fieldName) {
    if (!value.length > 0) {
        return `Please select pallet`;
    } else {
        return '';
    }

}
export function enquiryDetailsValidator(value, fieldName) {
    var RegEx = /\d/g;
    var regForSymbol = /[!@#$%^&*_+\=\[\]{};':"|<>?]+/;
    if (value == '') {
        return `Please Enter ${fieldName}`;
    } else if (value.length > 500) {
        return `${fieldName} must not be greater than 500 characters`;
    } else {
        return '';
    }
}

export function enquiryRemarkValidator(value, fieldName) {
    var RegEx = /\d/g;
    var regForSymbol = /[!@#$%^&*_+\=\[\]{};':"|<>?]+/;
    if (value != '' && value.length > 500) {
        return `${fieldName} must not be greater than 500 characters`;

    } else if (value != '' && regForSymbol.test(value)) {
        return `${fieldName} does not contain this special character.`;
    } else {
        return '';
    }
}

export function gstNoValidator(value) {

    const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (value !== '' && !re.test(value)) {
        return 'Please enter proper GST No.';
    } else {
        return '';
    }
}
export function cinNoValidator(value) {

    const re = /^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/;
    if (value !== '' && !re.test(value)) {
        return 'Please enter proper CIN No.';
    } else {
        return '';
    }
}
export function panNoValidator(value) {

    const re = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (value !== '' && !re.test(value)) {
        return 'Please enter proper PAN No.';
    } else {
        return '';
    }
}
export function tanNoValidator(value) {

    const re = /^[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}$/;
    if (value !== '' && !re.test(value)) {
        return 'Please enter proper TAN No.';
    } else {
        return '';
    }
}

export function firstNameValidator(value) {
    var RegEx = /\d/g;
    var regForSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?]+/;
    if (value == '') {
        return 'Please Enter First Name.';
    } else if (value != '' && value.length > 100) {
        return 'First name must not be greater than 100 characters';

    } else if (RegEx.test(value)) {
        return 'First name does not contain number.';
    } else if (regForSymbol.test(value)) {
        return 'First name only contain , as special character.';
    } else {
        return '';
    }

}
export function lastNameValidator(value) {
    var RegEx = /\d/g;
    var regForSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?]+/;
    if (value != '' && value.length > 100) {
        return 'Last name must not be greater than 100 characters';

    } else if (value != '' && regForSymbol.test(value)) {
        return 'Last name only contain , as special character.';
    } else {
        return '';
    }

}

export function mobileNoValidator(value) {
    const regex = /^(?:\+91|91|0)?[789]\d{9}$/;
    if (value != '' && !regex.test(value)) {
        return 'Please Enter proper mobile number.';
    } else {
        return '';
    }

}

export function contactNoValidator(value) {
    const regex = /^(?:\+91|91|0)?[789]\d{9}$/;
    if (value != '' && !regex.test(value)) {
        return 'Please Enter proper contact number.';
    } else {
        return '';
    }

}

export function landlineNoValidator(value) {
    var regex = /\d{5}([- ]*)\d{6}$/;
    if (value != '' && !regex.test(value)) {
        return 'Please Enter proper landline number.';
    } else {
        return '';
    }

}

export function pincodeValidator(value) {
    var regex = /^[1-9][0-9]{5}$/;
    if (value != '' && !regex.test(value)) {
        return 'Please Enter proper pincode.';
    } else {
        return '';
    }

}

export function masterFieldValidator(value, fieldName) {
    var RegEx = /\d/g;
    var regForSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (value == '') {
        return `please enter ${fieldName}.`;
    } else if (RegEx.test(value)) {
        return `${fieldName} does not contain number.`;
    } else if (regForSymbol.test(value)) {
        return `${fieldName} does not contain special character.`;
    } else {
        return '';
    }

}

export function masterDateValidator(value, fieldName) {
    var RegEx = /\d/g;
    var regForSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (value != '' && regForSymbol.test(value)) {
        return `${fieldName} does not contain special character.`;
    } else {
        return '';
    }

}


