// References to field elements
var dueDate = document.getElementById('dueDate');
var phoneNumber = document.getElementById('phoneNumber');
var conditionArea = document.getElementById('conditionArea');


var signUpBtn = document.getElementById('signup');
var result = document.getElementById('statusBox');
var reasonDiv = document.getElementById('reasonBox');
var answerState = document.getElementById("answerState");

// References to values stored in the plug-in parameters
var pPhoneNumber = getPluginParameter('phoneNumber');
var pDueDate = getPluginParameter('dueDate') || null;
var referenceMobileNumber = getPluginParameter('referenceMobileNumber') || null;
var state = getPluginParameter('state') || null;
var pLanguage = getPluginParameter('language');
var program = getPluginParameter('program');
var pConditionArea = getPluginParameter('conditionArea');
var callId = getPluginParameter('callId');
var apiUrl = getPluginParameter('apiUrl');
var countryName = getPluginParameter('country') || null;
var currentAnswer = fieldProperties.CURRENT_ANSWER;


phoneNumber.innerText = pPhoneNumber;
if (pDueDate === null) {
  dueDate.parentElement.style.display = 'none';
}
else {
  dueDate.innerText = formatDate(pDueDate);
}

if (pConditionArea === null) {
  conditionArea.parentElement.style.display = 'none';
}
else {
  conditionArea.innerText = pConditionArea;
}
setCurrentStatus();


function formatDate(date) {
  if(date){
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('-');
  }
  else{
    return null;
  }
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
  if (hours.length < 2)
    hours = '0' + hours;
  if (minutes.length < 2)
    minutes = '0' + minutes;

  return [day, month, year].join('-') + ' ' + strTime;
}


// Define the button press event
signUpBtn.onclick = function () {
  apiCall();
}

function processPayload(data) {
  var users = data['users'];
  for (var i = 0; i < users.length; i++) {
    var item = users[i];
    var status = item['success'] ? 'Success' : 'Failure'
    var statusClass = item['success'] ? 'success' : 'danger';
    if (status == "Success") {
      setResult(statusClass, status, "Sign up complete!")
      setAnswer("Yes");
    }
    else if (status == "Failure") {
      setResult(statusClass, status, item['errors'])
      setAnswer("No");
    }
  }
}

function makeHttpObject() {
  try {
    return new XMLHttpRequest()
  } catch (error) { }
  try {
    return new ActiveXObject('Msxml2.XMLHTTP')
  } catch (error) { }
  try {
    return new ActiveXObject('Microsoft.XMLHTTP')
  } catch (error) { }

  throw new Error('Could not create HTTP request object.')
}

function setResult(resultClass, resultText, reason = null) {
  t1 = result.classList.replace("danger", resultClass);
  t2 = result.classList.replace("success", resultClass);

  if ((t1 || t2) == false) {
    result.classList.add(resultClass);
  }
  result.innerText = resultText;
  if (reason != null) {
    reasonDiv.classList.add('reason');
    reasonDiv.innerText = reason;
    var metadata = {
      "reason": reason, "timestamp": new Date()
    }
    setMetaData(JSON.stringify(metadata));
  }
}

function setCurrentStatus() {
  var metadata = JSON.parse(getMetaData());
  if (metadata != null) {
    var last_response_time = formatDateTime(metadata['timestamp']);
  }
  if (currentAnswer == "Yes") {
    setResult("success", "Success", metadata['reason']);
    if (last_response_time != undefined) {
      answerState.innerHTML = "* Last recorded server response at " + last_response_time;
    }
  }
  else if (currentAnswer == "No") {
    setResult("danger", "Failure", metadata['reason']);
    if (last_response_time != undefined) {
      answerState.innerHTML = "* Last recorded server response at " + last_response_time;
    }
  }
}

function createPayload(data) {
  var conditionArea = data["condition_area"] || "anc";
  output = {
    "mobile_numbers": data["mobile_numbers"],
    "state": data["state"] || null,
    "program": data["program"] || "rch",
    "country": data["country"],
    "language": data["language"],
    "call_id": data["call_id"] || "12345",
    "condition_area": conditionArea
  }
  if (data["reference_mobile_number"] != null) {
    output["reference_mobile_number"] = data["reference_mobile_number"]
  }

  if (conditionArea.includes("anc") == true && data["expected_date_of_delivery"] != null) {
    output["expected_date_of_delivery"] = formatDate(data["expected_date_of_delivery"])
  }
  else if (conditionArea.includes("pnc") == true && data["expected_date_of_delivery"] != null) {
    output["baby_date_of_birth"] = formatDate(data["expected_date_of_delivery"])
  }
  return output
}


function apiCall() {
  try {
    request = makeHttpObject()
    payload = createPayload({
      mobile_numbers: [pPhoneNumber],
      expected_date_of_delivery: pDueDate,
      reference_mobile_number: referenceMobileNumber,
      program: program,
      state: state,
      language: pLanguage,
      condition_area: pConditionArea.toLowerCase(),
      call_id: callId,
      country: countryName
    })

    request.open('POST', apiUrl, true)
    request.setRequestHeader('Content-type', ' application/json')

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status == 200) {
          try {
            var response = JSON.parse(request.responseText);
            processPayload(response);
          }
          catch {
            setResult("danger", "Failure", "Error occured while parsing response")
            setAnswer("No")
          }
        }
        else if (request.status == 404) {
          setResult("danger", "Failure", "Server returned 404")
          setAnswer("No")
        }
        else if (request.status == 500) {
          setResult("danger", "Failure", "Server returned 500")
          setAnswer("No")
        }
      }
    }
    request.onerror = function () {
      setResult("danger", "Failure", "Network Error, please check your internet connection!")
      setAnswer("No")
    }

    request.send(JSON.stringify(payload));
  } catch (error) {
    setResult("danger", "Failure", error);
  }
}
