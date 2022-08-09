function findExceedence(data, dates, threshold) {
    let exceedences = [];
    let result = null;
    for (var i = 0; i < data.length; i++) {
        let value = data[i];

        if ((!isNaN(value) || value > 0) && value > threshold) {
            if (!result) {
                result = {
                    iStart: i,
                    values: [{ value, date: dates[i] }],
                    threshold
                }
            } else {
                result.values.push({ value, date: dates[i] });
            }
        } else if (result) {
            finish(result, i);
            exceedences.push({ ...result });
            result = null;
        }
    }
    if (result) {
        finish(result, data.length);
        exceedences.push(result)
    }
    return exceedences;
}

function findStatic(data, dates, limit) {
    let result = [];
    let count = 0;
    let values = [];
    let current = data[0];
    for (let i = 0; i < data.length; i++) {
        let value = data[i];
        if (value == current) {
            count++;
            values.push({ value, date: dates[i] })
        }
        else {
            result.push({ current, count, values });
            count = 1;
            values = [];
        }
        current = value;
    }
    return result.filter(d => d.count > limit);
}

function finish(result, i) {
    result.iEnd = i - 1;
}

export default { findExceedence, findStatic };