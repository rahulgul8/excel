function findExceedence(data, dates, threshold) {
    let exceedences = [];
    let result = null;
    for (var i = 0; i < data.length; i++) {
        let value = data[i];
        if (isNaN(value)) {
            continue;
        }

        if (value > threshold) {
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

function finish(result, i) {
    result.iEnd = i - 1;
}

export default { findExceedence };