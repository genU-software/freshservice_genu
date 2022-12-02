function toDateWithOutTimeZone(date) {
  let tempTime = date.split(":");
  let dt = new Date();
  dt.setHours(tempTime[0]);
  dt.setMinutes(tempTime[1]);
  // console.log(tempTime[0]);
  // console.log(tempTime[1]);
  // console.log(dt.toTimeString());
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

const timeRegExLong = new RegExp(
  "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]s?-s?([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
); // Test for valid full string eg 09:00-10:00
const timeRegEx = new RegExp("([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]", "g"); // Match times from string
// const timePartRegEx - new RegExp("")
const testString = "09:22-22:11";
let timeArray = [];

if (timeRegExLong.test(testString)) {
  timeArray = [...testString.matchAll(timeRegEx)];
  startTime = toDateWithOutTimeZone(timeArray[0][0]);
  endTime = toDateWithOutTimeZone(timeArray[1][0]);
  timeDiff = (endTime - startTime) / 1000 / 60;
  console.log(toTimeString(timeDiff));
}
