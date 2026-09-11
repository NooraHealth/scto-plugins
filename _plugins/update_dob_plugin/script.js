// References to field elements
var babyDob = document.getElementById('babyDob');
var confirmBtn = document.getElementById('confirm');
var result = document.getElementById('statusBox');
var reasonDiv = document.getElementById('reasonBox');
var answerState = document.getElementById("answerState");

// References to values stored in the plug-in parameters
var pPhoneNumber = getPluginParameter('phoneNumber');
var pConditionArea = getPluginParameter('conditionArea');
var apiUrl = getPluginParameter('apiUrl');
var apiToken = getPluginParameter('apiToken');
var currentAnswer = fieldProperties.CURRENT_ANSWER;


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

function formatLocalDate(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function isPastDate(date) {
  var formattedDate = formatDateForInput(date);
  if (formattedDate === null) {
    return false;
  }

  var parts = formattedDate.split('-');
  var parsedDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  var isValidDate = formatLocalDate(parsedDate) === formattedDate;
  return isValidDate && formattedDate < formatLocalDate(new Date());
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
  if (!babyDob.value) {
    setResult("danger", "Failure", "Baby DOB cannot be blank");
    babyDob.focus();
    return;
  }

  if (!isPastDate(babyDob.value)) {
    setResult("danger", "Failure", "DOB needs to be a past date");
    babyDob.focus();
    return;
  }

  if (!pPhoneNumber || !pConditionArea || !apiUrl || !apiToken) {
    setResult("danger", "Failure", "Required plugin parameters are missing");
    return;
  }

  if (!/^\d{10}$/.test(normalizeMobileNumber(pPhoneNumber))) {
    setResult("danger", "Failure", "Mobile number must contain exactly 10 digits");
    return;
  }

  apiCall();
}

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
    "condition_area": String(pConditionArea).trim().toLowerCase(),
    "baby_date_of_birth": formatDateForApi(date)
  };
}


function apiCall() {
  try {
    var request = new XMLHttpRequest();
    var payload = createPayload(babyDob.value);

    request.open('PUT', apiUrl, true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.setRequestHeader('Authorization', apiToken)

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
          setResult("success", "Success", "Baby date of birth and condition area updated successfully!")
          setAnswer(babyDob.value);
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

var savedDob = formatDateForInput(currentAnswer);
if (savedDob !== null) {
  babyDob.value = savedDob;
}
var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
babyDob.max = formatLocalDate(yesterday);
setCurrentStatus();
