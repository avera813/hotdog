/*
 * Copyright (C) 2017 Tignis, Inc.
 */

"use strict";

let testcases = [
    {
        competitors: {
            /** @return {Number} */
            "Joey Chestnut": function (totalHotDogsEaten) {
                return Math.exp(0.0344 * totalHotDogsEaten) + 4;
            },
            /** @return {Number} */
            "Carmen Cincotti": function (totalHotDogsEaten) {
                return totalHotDogsEaten * 0.120 + 6;
            }
        },
        duration: 600,
        results: "testcases/2017.json"
    }
];

/*
 * TODO: Implement this function. It should return a list of Event
 * objects with the following properties, e.g.
 *
 * [
 *     {
 *         elapsedTime: {In seconds, to a precision of 3 decimal places},
 *         name: {Competitor name},
 *         totalHotDogsEaten: {In number of hot dogs, to a precision of 3 decimal places}
 *     },
 *     ...
 * ]
 *
 * Events should be sorted by elapsedTime first, then name if they
 * have the same elapsedTime. There should be an Event for every whole
 * hot dog that is eaten by a competitor, as well as an Event for each
 * competitor at the end of the competition. See the expected results
 * file for each testcase.
 */
function Competition(testcase) {
    // get string list of competitors
    let competitors = Object.keys(testcase.competitors);

    // declare array for new event objects to be returned
    let results = [];

    // iterate through each competitor
    for (let competitor of competitors) {
        // declare 0 for dogs eaten and elapsed time when starting
        let dogsEaten = 0;
        let elapsedTime = 0;

        // peform this loop while the elapsedTime is less than or equal to duration of test case
        do {
            // calculate when the next dog will be fully eaten
            let nextDog = testcase.competitors[competitor](dogsEaten);

            // check that the duration to eat the next dog and current elapsed time is less than or equal to test case duration to add a full dog
            if ((elapsedTime + nextDog) <= testcase.duration) {
                elapsedTime += nextDog;
                dogsEaten++;
            } else {
                // in the event that the next dog will not be eaten by the test case duration, add the percentage difference
                let timeDiff = testcase.duration - elapsedTime;

                elapsedTime = testcase.duration;
                dogsEaten += timeDiff / nextDog;
            }

            // create generic event object to be returned
            let eatEvent = {
                elapsedTime: parseDecimalNumber(elapsedTime, 3),
                name: competitor,
                totalHotDogsEaten: parseDecimalNumber(dogsEaten, 3)
            };

            // add event to results
            results.push(eatEvent);

            // when elapsed time is equal to the test case (last dog or difference), break the loop
            if (elapsedTime === testcase.duration) {
                break;
            }
        } while (elapsedTime <= testcase.duration);
    }

    // sort results by elapsed time
    results.sort(function (a, b) {
        return a.elapsedTime < b.elapsedTime ? -1 : 1;
    });

    return results;
}

/* This function removes trailing zeros  */
function parseDecimalNumber(number, maxDecimalPlaces) {
    // Round number to fixed position
    let roundedNumberString = Number(number).toFixed(maxDecimalPlaces);

    // Remove subsequent trailing zeros
    roundedNumberString = roundedNumberString.replace(/\.(0|\d+)(0+)$/g, '.$1');

    // Return number format of the string
    return Number(roundedNumberString);
}

/*
 * Do not change code below this line. Run this file with node.js, e.g.
 *
 * node test.js
 */

let allOk = true;

for (let testcase of testcases) {
    let fs = require("fs");
    let expectedEvents = JSON.parse(fs.readFileSync(testcase.results));
    let events = Competition(testcase);
    let i = 0;
    for (; i < events.length; i++) {
        let event = events[i];
        let expectedEvent = i < expectedEvents.length ? expectedEvents[i] : null;
        let result = (expectedEvent !== null &&
            event.elapsedTime === expectedEvent.elapsedTime &&
            event.name === expectedEvent.name &&
            event.totalHotDogsEaten === expectedEvent.totalHotDogsEaten);
        if (!result) {
            allOk = false;
            console.log(event, expectedEvent, "FAIL");
        }
    }
    for (; i < expectedEvents.length; i++) {
        let expectedEvent = expectedEvents[i];
        allOk = false;
        console.log(null, expectedEvent, "FAIL");
    }
}

if (allOk) {
    console.log("OK");
} else {
    throw "FAIL";
}
