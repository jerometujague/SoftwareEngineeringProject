export function fixTime(oldTime) {
    // Get AM or PM
    let t = oldTime.slice(-2);

    // Cut off AM or PM
    let time = oldTime.slice(0, oldTime.length - 2);

    // Add 12 to hour if PM
    if (t == "PM") {
        let array = time.split(":");
        if (array[0] != 12) {
            let newHour = Number(array[0]) + 12;
            time = newHour + ":00";
        }
    }

    let array = time.split(":");

    // Check if hour is single digit
    if (array[0] < 10) {
        time = "0" + array[0] + ":00";
    }

    return time;
}