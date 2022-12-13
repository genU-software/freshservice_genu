const lunchBreak = 30; // lunch break is 30 mins
const timeRegExLong = new RegExp(
  "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]s?-s?([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
); // Test for valid full string eg 09:00-10:00
const timeRegEx = new RegExp("([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]", "g"); // Match times from string
var isInitComplete = false;

function returnTotalElement() {
  return document.querySelector(
    "#bundle-details-222 .custom_text .field.text[name='requested_item_values[222][requested_item_value_attributes][cf_total_hours_fortnight_387449]']"
  );
}

function returnWeek1Total() {
  return document.querySelector(
    "#bundle-details-222 .custom_text .field.text[name='requested_item_values[222][requested_item_value_attributes][cf_total_hours_week_11_387449]']"
  );
}

function returnWeek2Total() {
  return document.querySelector(
    "#bundle-details-222 .custom_text .field.text[name='requested_item_values[222][requested_item_value_attributes][cf_total_hours_week_2_387449]']"
  );
}

function returnLunchCheckboxes() {
  return document.querySelectorAll("#bundle-details-222 input[type=checkbox]");
}

function toDateWithOutTimeZone(date) {
  let tempTime = date.split(":");
  let dt = new Date();
  dt.setHours(tempTime[0]);
  dt.setMinutes(tempTime[1]);

  return dt;
}

function toTimeString(minutes) {
  const m = Math.round(minutes % 60);
  const h = Math.round((minutes - m) / 60);
  let time =
    (h < 10 ? "0" : "") +
    h.toString() +
    ":" +
    (m < 10 ? "0" : "") +
    m.toString();
  return time;
}

function toTimePhrase(minutes) {
  const m = Math.round(minutes % 60);
  const h = Math.round((minutes - m) / 60);

  let time = h + " hours " + m + " minutes";
  return time;
}

// Event Handler for changing time
function calcTime(event) {
  let timeArray = [];
  let target = event.target;

  // Ensure the initalisation has occurred
  if (!isInitComplete) genuCCInitit();
  // Check parents to ensure we are calculating time only on the time elements
  if (
    target.closest("#bundle-item-fields-222") == null &&
    target.closest(".control-element") == null
  )
    return;
  // Calculate time if change occured on checkbox or text update
  if (target.type == "checkbox")
    // if checkbox change, find the textbox with the time values.
    target =
      target.parentElement.parentElement.previousElementSibling.querySelector(
        "input[type=text]"
      );
  // if text calculate the time and update the time label
  if (target.type == "text") {
    let timeInput = target.value;
    let messageElement = target.nextElementSibling;
    let lunchCheckBox =
      target.parentElement.parentElement.nextElementSibling.querySelector(
        "input[type=checkbox]"
      );
    if (timeRegExLong.test(timeInput)) {
      timeArray = [...timeInput.matchAll(timeRegEx)];
      startTime = toDateWithOutTimeZone(timeArray[0][0]);
      endTime = toDateWithOutTimeZone(timeArray[1][0]);
      timeDiff = (endTime - startTime) / 1000 / 60;
      if (timeDiff > lunchBreak && lunchCheckBox.checked)
        timeDiff -= lunchBreak;
      messageElement.classList.remove("warning");
      messageElement.innerHTML = toTimePhrase(timeDiff);
      calculateWeeks();
    } else {
      messageElement.innerHTML = "Time format incorrect. '09:00-5:06'";
      messageElement.classList.add("warning");
    }
  }
}

/* Create new element tohold time information */
function addTimeMessage() {
  let eleTotal = returnTotalElement();
  let eleWeek1Total = returnWeek1Total();
  let eleWeek2Total = returnWeek2Total();
  if (!document.querySelectorAll(".timeMessage").length > 0) {
    document
      .querySelectorAll("#bundle-item-fields-222 .control-element input.text")
      .forEach((item) => {
        if (item == eleTotal || item == eleWeek1Total || item == eleWeek2Total)
          return;
        let newLabel = document.createElement("label");
        newLabel.classList.add("timeMessage");
        item.after(newLabel);
      });
  }
}

/* Calculate total time per week */
function calculateWeeks() {
  let week1TotalTime = 0;
  let week2TotalTime = 0;
  let eleTotal = returnTotalElement();
  let eleWeek1Total = returnWeek1Total();
  let eleWeek2Total = returnWeek2Total();
  // select all the inputs and group them into weeks
  let inputs = Array.from(
    document.querySelectorAll("#bundle-details-222 input.text:nth-child(1)")
  );
  let week1inputs = inputs.slice(0, 7);
  let week2inputs = inputs.slice(8, 15);

  week1TotalTime = calculateWeek(week1inputs);
  eleWeek1Total.value = toTimePhrase(week1TotalTime);
  week2TotalTime = calculateWeek(week2inputs);
  eleWeek2Total.value = toTimePhrase(week2TotalTime);

  eleTotal.value = toTimePhrase(week1TotalTime + week2TotalTime);
}

function calculateWeek(inputs) {
  let totalTime = 0;
  inputs.forEach((item) => {
    let timeInput = item.value;
    if (timeRegExLong.test(timeInput)) {
      timeArray = [...timeInput.matchAll(timeRegEx)];
      startTime = toDateWithOutTimeZone(timeArray[0][0]);
      endTime = toDateWithOutTimeZone(timeArray[1][0]);
      timeDiff = (endTime - startTime) / 1000 / 60;
      totalTime += timeDiff;
    }
  });
  return totalTime;
}

function enableReadOnlyInputs() {
  let eleTotal = returnTotalElement();
  let eleWeek1Total = returnWeek1Total();
  let eleWeek2Total = returnWeek2Total();

  returnTotalElement.readOnly = true;
  returnWeek1Total.readOnly = true;
  returnWeek2Total.readOnly = true;
}

function genuCCInitit() {
  // adds a label used to show the time under each input
  addTimeMessage();
  // makes the total fields read-only
  enableReadOnlyInputs();
  isInitComplete = true;
}

window.onload = function () {
  /* Add event listner to all time input fields */
  document.querySelectorAll("#page-main").forEach((item) => {
    item.addEventListener("change", calcTime);
  });
  console.log("genu script added");
};
