export function convertTime12to24(oldTime) {
    // Get AM or PM
    let t = oldTime.slice(-2);

    // Cut off AM or PM
    let time = oldTime.slice(0, oldTime.length - 2);

    // Add 12 to hour if PM
    if (t.toLowerCase() == "pm") {
        let array = time.split(":");
        if (array[0] != 12) {
            let newHour = Number(array[0]) + 12;
            time = newHour + ":00";
        } else {
            time = "12:00";
        }
    }

    let array = time.split(":");

    // Check if hour is single digit
    if (array[0] < 10) {
        time = "0" + array[0] + ":00";
    } else {
        time = array[0] + ":00";
    }

    return time.replace(/\s+/g, '');
}

export function convertTime24to12(oldTime) {
    if (oldTime > 12) {
        return (oldTime - 12) + " PM";
    } else if (oldTime == 12) {
        return "12 PM"
    }

    return oldTime + " AM"
}

export function getTopResults(items) {
    const count = items.reduce((counts, curr) => (counts[curr] = ++counts[curr] || 1, counts), {});
    const countArray = Object.entries(count).map(([item, count]) => ({ item, count }));
    return countArray.sort((a, b) => b.count - a.count);
}