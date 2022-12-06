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

function calcTime(event) {
  let timeArray = [];

  let target = event.target;
  console.log("in calcTime function");
  if (
    target.closest("#bundle-item-fields-222") != null &&
    target.closest(".control-element") != null &&
    target.type == "text"
  ) {
    let timeInput = target.value;
    let messageElement = target.nextElementSibling;
    if (timeRegExLong.test(timeInput)) {
      timeArray = [...timeInput.matchAll(timeRegEx)];
      startTime = toDateWithOutTimeZone(timeArray[0][0]);
      endTime = toDateWithOutTimeZone(timeArray[1][0]);
      timeDiff = (endTime - startTime) / 1000 / 60;
      messageElement.classList.remove("warning");
      messageElement.innerHTML = toTimePhrase(timeDiff);
      console.log(toTimeString(timeDiff));
    } else {
      messageElement.innerHTML = "Time format incorrect. '09:00-5:06'";
      messageElement.classList.add("warning");
    }
  }
}

window.onload = function () {
  /* Create new element tohold time information */
  document
    .querySelectorAll("#bundle-item-fields-222 .control-element input.text")
    .forEach((item) => {
      let newLabel = document.createElement("label");
      newLabel.classList.add("timeMessage");
      item.after(newLabel);
    });

  /* Add event listner to all time input fields */
  document.querySelectorAll("#page-main").forEach((item) => {
    item.addEventListener("change", calcTime);
  });
  console.log("genu script added");
};