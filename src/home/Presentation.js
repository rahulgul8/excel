import moment from "moment";
const format = "YYYY-MM-DD HH:mm";

function formatExceedance(data) {
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
        "SL. No.": i,
        "Date": dateRange,
        "Exceedance Observed (hrs)": timeRange,
        "Total Exceedance in Hours": hours,
        "Range in ppm": valueRange,
        "No.of Occurance of Exceedance in 15mins average data": values.length
    }
}

function getValueRange(values) {
    values = values.map(v => v.value).sort();
    return `${values[0]} - ${values[values.length - 1]}`
}

function getHours(start, end) {
    start = moment(start, format);
    end = moment(end, format);

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
    return moment(date, format).format("HH.mm")
}

function getDateString(date) {
    return moment(date, format).format("DD.MM.YYYY")
}

export default { formatExceedance }