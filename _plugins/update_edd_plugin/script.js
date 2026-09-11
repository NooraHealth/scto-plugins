// References to field elements
var new_edd = document.getElementById('new_edd');
var confirmBtn = document.getElementById('confirm');
var result = document.getElementById('statusBox');
var reasonDiv = document.getElementById('reasonBox');
var answerState = document.getElementById("answerState");

// References to values stored in the plug-in parameters
var pPhoneNumber = getPluginParameter('phoneNumber');
var apiUrl = getPluginParameter('apiUrl');
var apiToken = getPluginParameter('apiToken');
var currentAnswer = fieldProperties.CURRENT_ANSWER;
var dateValidationMessage = "New EDD cannot be earlier than today";
var isShowingDateValidationError = false;


function formatLocalDate(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');

  return year + '-' + month + '-' + day;
}

function getTodayDate() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return formatLocalDate(today);
}

function clearDateValidationError() {
  new_edd.setCustomValidity('');

  if (isShowingDateValidationError) {
    result.classList.remove("danger", "success");
    result.innerText = '';
    reasonDiv.classList.remove('reason');
    reasonDiv.innerText = '';
    isShowingDateValidationError = false;
  }
}

function validateNewEdd(showError) {
  if (!new_edd.value) {
    clearDateValidationError();
    return false;
  }

  if (new_edd.value < new_edd.min) {
    new_edd.setCustomValidity(dateValidationMessage);

    if (showError) {
      setResult("danger", "Invalid date", dateValidationMessage, false);
      isShowingDateValidationError = true;
      new_edd.reportValidity();
    }
    return false;
  }

  clearDateValidationError();
  return true;
}


function formatDateForInput(date) {
  if (!date) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  var parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString().slice(0, 10);
}

function formatDateForApi(date) {
  var formattedDate = formatDateForInput(date);
  return formattedDate ? formattedDate + 'T00:00:00Z' : null;
}

function normalizeMobileNumber(mobileNumber) {
  return String(mobileNumber)
    .trim()
    .replace(/^whatsapp:/i, '')
    .replace(/^0/, '');
}

function formatMobileNumber(mobileNumber) {
  return 'whatsapp:91' + normalizeMobileNumber(mobileNumber);
}


function formatDateTime(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hours = '' + d.getHours(),
    minutes = '' + d.getMinutes();

  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-') + ' ' + strTime;
}


// Define the button press event
confirmBtn.onclick = function () {
  if (!new_edd.value) {
    setResult("danger", "Failure", "New EDD cannot be blank");
    new_edd.focus();
    return;
  }

  if (!validateNewEdd(true)) {
    new_edd.focus();
    return;
  }

  if (!pPhoneNumber || !apiUrl || !apiToken) {
    setResult("danger", "Failure", "Required plugin parameters are missing");
    return;
  }

  if (!/^\d{10}$/.test(normalizeMobileNumber(pPhoneNumber))) {
    setResult("danger", "Failure", "Mobile number must contain exactly 10 digits");
    return;
  }

  apiCall();
}

new_edd.min = getTodayDate();
new_edd.addEventListener('input', function () {
  validateNewEdd(Boolean(new_edd.value));
});
new_edd.addEventListener('change', function () {
  validateNewEdd(Boolean(new_edd.value));
});

function setResult(resultClass, resultText, reason = null, persist = true) {
  result.classList.remove("danger", "success");
  result.classList.add(resultClass);
  result.innerText = resultText;
  if (reason != null) {
    reasonDiv.classList.add('reason');
    reasonDiv.innerText = reason;
    if (persist) {
      var metadata = {
        "resultClass": resultClass,
        "resultText": resultText,
        "reason": reason,
        "timestamp": new Date()
      }
      setMetaData(JSON.stringify(metadata));
    }
  }
}

function setCurrentStatus() {
  var metadata = JSON.parse(getMetaData());
  if (metadata == null) {
    return;
  }

  var last_response_time = formatDateTime(metadata['timestamp']);
  setResult(
    metadata['resultClass'] || "success",
    metadata['resultText'] || "Success",
    metadata['reason'],
    false
  );
  if (last_response_time != undefined) {
    answerState.innerHTML = "* Last recorded server response at " + last_response_time;
  }
}

function createPayload(date) {
  return {
    "mobile_number": [formatMobileNumber(pPhoneNumber)],
    "new_edd": formatDateForApi(date)
  };
}


function apiCall() {
  try {
    var request = new XMLHttpRequest();
    var payload = createPayload(new_edd.value);

    request.open('PUT', apiUrl, true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.setRequestHeader('Authorization', apiToken)

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
          setResult("success", "Success", "New EDD updated successfully!")
          setAnswer(new_edd.value);
        }
        else {
          setResult("danger", "Failure", "Server returned " + request.status)
        }
      }
    }
    request.onerror = function () {
      setResult("danger", "Failure", "Network Error, please check your internet connection!")
    }

    request.send(JSON.stringify(payload));
  } catch (error) {
    setResult("danger", "Failure", String(error));
  }
}

var savedNewEdd = formatDateForInput(currentAnswer);
if (savedNewEdd !== null) {
  new_edd.value = savedNewEdd;
}
setCurrentStatus();
validateNewEdd(Boolean(new_edd.value));
