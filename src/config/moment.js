const moment = require("moment");

moment.locale("pt");

function getStartOfMonth() {
  return moment().startOf("month").format("YYYY-MM-DD");
}

function getEndOfMonth() {
  return moment().endOf("month").format("YYYY-MM-DD");
}

function convertSecondsToHours(secs) {
  return moment.utc(secs * 1000).format("HH:mm:ss");
}

function convertSeconds(secs) {
  return moment.utc(secs * 1000).format("HH:mm");
}

function formatDateToString(date) {
  return moment(date).format("YYYY-MM-DD");
}

function formatDateToISO(date) {
  return moment(date).toISOString();
}

function formatDateToReadble(date) {
  return moment(date).format("DD/MM/YYYY");
}

function formatStringToISODate(date) {
  return moment(date, "DD/MM/YYYY HH:mm").toISOString()
}

function isAfter(date, compare) {
  return moment(date).isAfter(compare);
}

function getCurrentAsISO() {
  return moment().add(1, 'h').toISOString()
}

function convertSecondsToHoursAndMinutes(secs) {
  return moment.utc(secs * 1000).format("HH:mm");
}

function convertToDate(date) {
  return moment(date).toDate();
}

module.exports = {
  getStartOfMonth,
  getEndOfMonth,
  convertSecondsToHours,
  formatDateToString,
  convertSeconds,
  formatDateToReadble,
  formatStringToISODate,
  isAfter,
  getCurrentAsISO,
  formatDateToISO,
  convertSecondsToHoursAndMinutes,
  convertToDate
};
