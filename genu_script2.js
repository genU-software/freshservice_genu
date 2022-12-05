const timeRegExLong = new RegExp(
  "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]s?-s?([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
); // Test for valid full string eg 09:00-10:00
const timeRegEx = new RegExp("([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]", "g"); // Match times from string

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

function calcTime(e) {
  let timeArray = [];
  let timeInput = e.value;

  if (timeRegExLong.test(e.value)) {
    timeArray = [...testString.matchAll(timeRegEx)];
    startTime = toDateWithOutTimeZone(timeArray[0][0]);
    endTime = toDateWithOutTimeZone(timeArray[1][0]);
    timeDiff = (endTime - startTime) / 1000 / 60;
    console.log(toTimeString(timeDiff));
  }
  console.log(e.value);
}

window.onload = function () {
  /* Add event listner to all time input fields */
  document
    .querySelectorAll("#bundle-item-fields-222 .control-element input.text")
    .forEach((item) => {
      item.addEventListener("input", calcTime());
    });

  console.log("genu script added");
};
