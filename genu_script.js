// Constraints
const LUNCH_BREAK = 30; // lunch break is 30 mins
const WARNING_MESSAGE =
  "Time range must be in 24 hour format.</br> For example '09:00-17:06' using : and -";
// Test for valid full string eg 09:00-10:00
const TIME_REGEX =
  /^((?:[0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9])\s*-\s*((?:[0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9])/;
var isInitComplete = false;

// Query selectors
const getTotalElement = () =>
  document.querySelector(
    "#bundle-details-222 .custom_text .field.text[name='requested_item_values[222][requested_item_value_attributes][cf_total_hours_fortnight_387449]']"
  );
const getWeek1Total = () =>
  document.querySelector(
    "#bundle-details-222 .custom_text .field.text[name='requested_item_values[222][requested_item_value_attributes][cf_total_hours_week_11_387449]']"
  );
const getWeek2Total = () =>
  document.querySelector(
    "#bundle-details-222 .custom_text .field.text[name='requested_item_values[222][requested_item_value_attributes][cf_total_hours_week_2_387449]']"
  );
const getLunchCheckboxes = () =>
  document.querySelectorAll("#bundle-details-222 input[type=checkbox]");

// Helper Functions
const toDateWithoutTimeZone = (date) => {
  const [hours, minutes] = date.split(":");
  const dt = new Date();
  dt.setHours(hours);
  dt.setMinutes(minutes);
  return dt;
};

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

  return `${h} hours ${m} minutes`;
}

// Event Handler for changing time
function calcTime(event) {
  let timeArray = [];
  let target = event.target;

  // Ensure the initalisation has occurred
  if (!isInitComplete) genuCCInitit();
  // Check parents to ensure we are calculating time only on the time elements
  if (
    target.closest("#bundle-item-fields-222") == null ||
    target.closest(".control-element") == null
  )
    return;

  // Calculate time if change occured on checkbox or text update
  if (target.type == "checkbox") {
    // if checkbox change, find the textbox with the time values.
    target =
      target.parentElement.parentElement.previousElementSibling.querySelector(
        "input[type=text]"
      );
  }

  // if text calculate the time and update the time label
  if (target.type != "text") return;

  const timeInput = target.value;
  const messageElement = target.nextElementSibling;
  const lunchCheckBox =
    target.parentElement.parentElement.nextElementSibling.querySelector(
      "input[type=checkbox]"
    );

  if (!TIME_REGEX.test(timeInput)) {
    if (timeInput.length === 0) {
      messageElement.classList.remove("warning");
      messageElement.innerHTML = "";
      // Calculate totals
      calculateWeeks();
    } else {
      messageElement.classList.add("warning");
      messageElement.innerHTML = WARNING_MESSAGE;
    }
    return;
  }

  // Calculate time and update message
  const [start, end] = timeInput.match(TIME_REGEX).slice(1);
  const startTime = toDateWithoutTimeZone(start);
  const endTime = toDateWithoutTimeZone(end);

  let timeDiff = (endTime - startTime) / 1000 / 60; // time difference in minutes
  let message = "";

  // if time is backwards stop and show warning message
  if (timeDiff < 0) {
    ShowTimeFormatErrorMessage(messageElement);
    return;
  }

  if (lunchCheckBox.checked) {
    timeDiff -= LUNCH_BREAK;
    message = `<br>Minus lunch break {${LUNCH_BREAK} minutes}`;
  }

  messageElement.classList.remove("warning");
  messageElement.innerHTML = `${toTimePhrase(timeDiff)}${message}`;

  // Calculate totals
  calculateWeeks();
}

/* Create new element tohold time information */
function addTimeMessage() {
  let eleTotal = getTotalElement();
  let eleWeek1Total = getWeek1Total();
  let eleWeek2Total = getWeek2Total();
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
  let eleTotal = getTotalElement();
  let eleWeek1Total = getWeek1Total();
  let eleWeek2Total = getWeek2Total();
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

  if (week2TotalTime == 0) eleTotal.value = toTimePhrase(week1TotalTime * 2);
  else eleTotal.value = toTimePhrase(week1TotalTime + week2TotalTime);
}

function calculateWeek(inputs) {
  let totalTime = 0;
  inputs.forEach((item) => {
    let timeInput = item.value;
    let lunchCheckBox =
      item.parentElement.parentElement.nextElementSibling.querySelector(
        "input[type=checkbox]"
      );
    if (TIME_REGEX.test(timeInput)) {
      const [start, end] = timeInput.match(TIME_REGEX).slice(1);
      const startTime = toDateWithoutTimeZone(start);
      const endTime = toDateWithoutTimeZone(end);

      timeDiff = (endTime - startTime) / 1000 / 60;
      // if time is a negative ignore( This means the input is incorrect and the user needs to fix it )
      if (timeDiff <= 0) return;
      if (timeDiff > LUNCH_BREAK && lunchCheckBox.checked)
        timeDiff -= LUNCH_BREAK;
      totalTime += timeDiff;
    }
  });
  return totalTime;
}

function enableReadOnlyInputs() {
  getTotalElement.readOnly = true;
  getWeek1Total.readOnly = true;
  getWeek2Total.readOnly = true;
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
  document
    .querySelectorAll(
      "#page-main .field_placeholder_222_703d2c11-d469-4523-a431-60407e2a936a"
    )
    .forEach((item) => {
      item.addEventListener("change", calcTime);
    });
  console.log("genu script added");
};
