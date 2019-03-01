package com.commercebank.util;

public class DateUtil {
    // Get the 12 hour time from a hour
    public static String hourToHumanString(int hour){
        String timeString = String.valueOf(hour) + ":00 AM";

        // Check for PM time
        if(hour > 12){
            timeString = String.valueOf(hour - 12) + ":00 PM";
        } else if(hour == 12){
            timeString = "12:00 PM";
        }

        return timeString;
    }

    // Get a number with the ordinal of that number
    public static String ordinal(int i) {
        String[] sufixes = new String[] { "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th" };
        switch (i % 100) {
            case 11:
            case 12:
            case 13:
                return i + "th";
            default:
                return i + sufixes[i % 10];
        }
    }

    // Capitalize a string
    public static String capitalize(String s){
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
