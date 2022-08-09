import moment from "moment";
let format = "YYYY-MM-DD HH:mm";

function formatExceedance(data, dateFormat) {
    format = dateFormat;
    return data.map((d, i) => formatRecord(d, i))
}

function formatRecord(value, i) {
    let values = value.values;
    let startDate = values[0].date;
    let endDate = values[values.length - 1].date;
    let timeRange = `${getTimeString(startDate)} - ${getTimeString(endDate)}`
    let dateRange = getDateRange(startDate, endDate);
    let hours = getHours(startDate, endDate);
    let valueRange = getValueRange(values);
    return {
        i,
        dateRange,
        timeRange,
        hours,
        valueRange,
        count: values.length
    }
}

function getValueRange(values) {
    values = values.map(v => v.value).sort();
    let start = values[0]
    let end = values[values.length - 1];
    if (start == end) {
        return start;
    }
    return `${start} - ${end}`
}

function getHours(start, end) {
    start = getDate(start);
    end = getDate(end);

    let hours = end.diff(start, 'hours');
    start.add(hours, 'hours');

    let minutes = end.diff(start, 'minutes');
    if (hours) {
        return `${hours}hrs ${minutes}mins`
    } else {
        return `${minutes}mins`
    }

}

function getDateRange(startDate, endDate) {
    let start = getDateString(startDate);
    let end = getDateString(endDate);
    if (start == end) {
        return start;
    }
    return start + " - " + end;
}

function getTimeString(date) {
    return getDate(date).format("HH.mm")
}

function getDateString(date) {
    return getDate(date).format("DD.MM.YYYY")
}

function getDate(date) {
    if (!isNaN(date)) {
        return moment(excelNumberToDate(date))
    }
    return moment(date, format)
}

function excelNumberToDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

export default { formatExceedance }