import { backendDateToLocalTimeZone , localTimeZoneToBackEndTime, formatDateTime, currentDateBackend, currentDateFrontend } from '../util';
import "jest"


const isDayLightSavings = function () {
    const date = new Date();
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    const timezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

    return date.getTimezoneOffset() < timezoneOffset;
};


// NOTE jest-setup-global.js explicitly sets the timezone to New Zealand time.
describe("Timezone conversion functions", () => {

    describe("From Back End to Front End", () => {

        test("Back end date in UTC time", () => {
            const backEndDate = "1997-02-11T09:00:00+0000";
            expect(backendDateToLocalTimeZone(backEndDate)).toBe(isDayLightSavings() ? "1997-02-11T22:00" : "1997-02-11T21:00");
        });

        test("UTC date at one to midnight", () => {
            const backEndDate = "1997-02-11T23:59:00+0000";
            expect(backendDateToLocalTimeZone(backEndDate)).toBe(isDayLightSavings() ? "1997-02-12T12:59" : "1997-02-12T11:59");
        });

        test("UTC date at exactly midnight", () => {
            const backEndDate = "1997-02-11T24:00:00+0000";
            expect(backendDateToLocalTimeZone(backEndDate)).toBe(isDayLightSavings() ? "1997-02-12T13:00" : "1997-02-12T12:00");
        });

        /**
         * If a date is invalid, expect the current date and time
         */
        test("Invalid UTC date after midnight", () => {
            const backEndDate = "1997-02-11T24:01:00+0000";
            let actualDate = new Date(backendDateToLocalTimeZone(backEndDate));
            expect(actualDate > new Date('2020-01-01')).toBeTruthy();
        });
    });

    describe("From Front End to Back End", () => {

        test("Front end date 9pm", () => {
            const frontEndDate = "1997-02-11T21:00";
            expect(localTimeZoneToBackEndTime(frontEndDate)).toBe(isDayLightSavings() ? "1997-02-11T21:00:00+1300" : "1997-02-11T21:00:00+1200");
        });

        /**
         * If a date is invalid, expect the current date and time
         */
        test("Test invalid UTC date after midnight", () => {
            const frontEndDate = "1997-02-11T24:01";
            let actualDate = new Date(localTimeZoneToBackEndTime(frontEndDate));
            expect(actualDate > new Date('2020-01-01')).toBeTruthy();
        });
    });
});

describe("Convert ISO8601 into readable date and AM/PM time", () => {

    describe("Receive UTC time from back-end", () => {

        test("Test UTC date formatted with correct single digit AM time", () => {
            const backEndDate = "2020-07-15T09:00:00+0000";
            expect(formatDateTime(backEndDate)).toBe(isDayLightSavings() ? "Wed, 15 Jul 2020 10:00 PM" : "Wed, 15 Jul 2020 09:00 PM");
        });

        test("Test UTC date formatted with correct single digit PM time", () => {
            const backEndDate = "1997-02-11T21:00:00+0000";
            expect(formatDateTime(backEndDate)).toBe(isDayLightSavings() ? "Wed, 12 Feb 1997 10:00 AM" : "Wed, 12 Feb 1997 09:00 AM");
        });

        test("Test UTC date formatted with correct double digit 12:00 AM time", () => {
            const backEndDate = "1997-02-11T00:00:00+0000";
            expect(formatDateTime(backEndDate)).toBe(isDayLightSavings() ? "Tue, 11 Feb 1997 01:00 PM" : "Tue, 11 Feb 1997 12:00 PM");
        });

        test("Test UTC date formatted with correct double digit 12:00 PM time", () => {
            const backEndDate = "1997-02-11T12:00:00+0000";
            expect(formatDateTime(backEndDate)).toBe(isDayLightSavings() ? "Wed, 12 Feb 1997 01:00 AM" : "Wed, 12 Feb 1997 12:00 AM");
        });
    });
});

describe("Test current time functions", () => {

    test("currentDateBackend returns a valid date", () => {
        const dateStr = currentDateBackend();
        expect(dateStr).not.toBeNull();
        expect(dateStr).not.toBeUndefined();
        expect(isNaN((new Date(dateStr)).getTime())).toBeFalsy();
    });

    test("currentDateFrontend returns a valid date", () => {
        const dateStr = currentDateFrontend();
        expect(dateStr).not.toBeNull();
        expect(dateStr).not.toBeUndefined();
        expect(isNaN((new Date(dateStr)).getTime())).toBeFalsy();
    });

});
