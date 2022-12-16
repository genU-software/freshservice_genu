// Constants
const LUNCH_BREAK = 30;
const TIME_REGEX =
  /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9] *?- *?([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/;

// Initialization flag
let isInitComplete = false;

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

// Helper functions
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

const toTimePhrase = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} hours ${m} minutes`;
};

// Event handler for changing time
function calcTime(event) {
  // Ensure the initalization has occurred
  if (!isInitComplete) {
    genuCCInitit();
  }

  // Check parents to ensure we are calculating time only on the time elements
  const target = event.target;
  if (
    target.closest("#bundle-item-fields-222") == null ||
    target.closest(".control-element") == null
  ) {
    return;
  }

  // Calculate time if change occurred on checkbox or text update
  if (target.type === "checkbox") {
    // if checkbox change, find the textbox with the time values.
    target =
      target.parentElement.parentElement.previousElementSibling.querySelector(
        "input[type=text]"
      );
  }

  // if text calculate the time and update the time label
  if (target.type !== "text") {
    return;
  }

  const timeInput = target.value;
  const messageElement = target.nextElementSibling;
  const lunchCheckbox =
    target.parentElement.parentElement.nextElementSibling.querySelector(
      "input[type=checkbox]"
    );

  if (!TIME_REGEX.test(timeInput)) {
    if (timeInput.length === 0) {
      messageElement.classList.remove("error");
      messageElement.innerHTML = "";
    } else {
      messageElement.classList.add("error");
      messageElement.innerHTML = "Please enter a valid time range";
    }
    return;
  }

  // Calculate time and update message
  const [start, end] = timeInput.match(TIME_REGEX).slice(1);
  const startTime = toDateWithoutTimeZone(start);
  const endTime = toDateWithoutTimeZone(end);
  const timeDiff = (endTime - startTime) / 1000 / 60; // time difference in minutes

  let time = timeDiff;
  let message = "";
  if (lunchCheckbox.checked) {
    time -= LUNCH_BREAK;
    message = `<br>Minus lunch break of ${LUNCH_BREAK} minutes`;
  }

  messageElement.classList.remove("error");
  messageElement.innerHTML = `Total time: ${toTimePhrase(time)}${message}`;

  // Update total time
  const totalElement = getTotalElement();
  const week1Total = getWeek1Total();
  const week2Total = getWeek2Total();

  if (totalElement) {
    totalElement.value = toTimeString(time);
  }
  if (week1Total && week2Total) {
    const week1Value = parseInt(week1Total.value);
    const week2Value = parseInt(week2Total.value);
    week1Total.value = toTimeString(week1Value + time);
    week2Total.value = toTimeString(week2Value + time);
  }
}

// Initialization function
function genuCCInitit() {
  // Set initialization flag
  isInitComplete = true;

  // Add event listener for time calculation
  document.querySelectorAll("#page-main").forEach((item) => {
    item.addEventListener("change", calcTime);
  });

  // Initialize lunch checkboxes
  const lunchCheckboxes = getLunchCheckboxes();
  lunchCheckboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
}

window.onload = function () {
  /* Add event listner to all time input fields */
  document.querySelector("#page-main").addEventListener("change", calcTime);
};
