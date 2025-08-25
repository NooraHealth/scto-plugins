// References to field elements
var language = document.getElementById('language');
var phoneNumber = document.getElementById('phoneNumber');


var signUpBtn = document.getElementById('signup');
var result = document.getElementById('statusBox');
var reasonDiv = document.getElementById('reasonBox');
var answerState = document.getElementById("answerState");

// References to values stored in the plug-in parameters
var pPhoneNumber = getPluginParameter('phoneNumber');
var pNamespace = getPluginParameter('whatsappNamespaceId');
var pTemplateId = getPluginParameter('whatsappTemplateId');
var pLanguage = getPluginParameter('language');
var pCountryCode = getPluginParameter('countryCode');
var apiUrl = getPluginParameter('apiUrl');
var apiToken = getPluginParameter('apiToken');
var currentAnswer = fieldProperties.CURRENT_ANSWER;


phoneNumber.innerText = pCountryCode + pPhoneNumber;
language.innerText = pLanguage;
setCurrentStatus();

// Define the button press event
signUpBtn.onclick = function () {
    apiCall();
}

function processError(data) {
    var response = data;
    errorReason = response['errors'][0]['details'];
    var status = 'Failure';
    var statusClass = 'danger';
    setResult(statusClass, status, errorReason)
    setAnswer("No");
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
    var namespace = data["namespace"];
    var number = data["number"];
    var languageCode = data["languageCode"];
    var templateId = data["templateId"];

    output = {
        "to": number,
        "type": "template",
        "template": {
            "namespace": namespace,
            "name": templateId,
            "language": {
                "code": languageCode,
                "policy": "deterministic"
            }
        }

    }
    return output
}


function apiCall() {
    try {
        var request = makeHttpObject()
        var payload = createPayload({
            namespace: pNamespace,
            number: pCountryCode + pPhoneNumber,
            languageCode: pLanguage,
            templateId: pTemplateId
        })

        request.open('POST', apiUrl, true)
        request.setRequestHeader('Content-Type', 'application/json')
        request.setRequestHeader('Authorization', 'Bearer ' + apiToken)

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status == 200) {
                    try {
                        var response = JSON.parse(request.responseText);
                        setResult("success", "Success", "Whatsapp Message sent successfully");
                        setAnswer("Yes");
                    }
                    catch {
                        setResult("danger", "Failure", "Error occured while parsing response");
                        setAnswer("No");
                    }
                }
                else if (request.status == 400) {
                    var response = JSON.parse(request.responseText);
                    processError(response);
                }
                else if (request.status == 403) {
                    setResult("danger", "Failure", request.responseText);
                    setAnswer("No");
                }
                else if (request.status == 404) {
                    setResult("danger", "Failure", "Server returned 404");
                    setAnswer("No");
                }
                else if (request.status == 500) {
                    setResult("danger", "Failure", "Server returned 500");
                    setAnswer("No");
                }
            }
        }
        request.onerror = function () {
            setResult("danger", "Failure", "Network Error, please check your internet connection!");
            setAnswer("No");
        }

        request.send(JSON.stringify(payload));
    } catch (error) {
        setResult("danger", "Failure", error);
        setAnswer("No");
    }
}
