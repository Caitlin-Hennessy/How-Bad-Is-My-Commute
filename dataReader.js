if (process.env.NODE_ENV !== "production") {
    require("dotenv").load();
}
var request = require("request"),
    fs = require("fs")
    MongoClient = require("mongodb").MongoClient;

var mongoUrl = process.env.MONGO_URL;
var urlLeg1 = getMapsApiUrl(process.env.HOME_ADDRESS, process.env.WORK_ADDRESS, process.env.API_KEY);
var urlLeg2 = getMapsApiUrl(process.env.WORK_ADDRESS, process.env.GYM_ADDRESS, process.env.API_KEY);
var urlLeg3 = getMapsApiUrl(process.env.GYM_ADDRESS, process.env.HOME_ADDRESS, process.env.API_KEY);

var dataFile = `data/${new Date().getTime()}.json`;
console.log(`Writing data to ${dataFile}`);

function getMapsApiUrl(src, dest, apiKey) {
    return "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" +
        src.split(" ").join("+") +
        "&destinations=" +
        dest.split(" ").join("+") +
        "&departure_time=now&key=" +
        apiKey;
}

function getTravelTimeFromBody(body) {
    return body.rows[0].elements[0].duration_in_traffic.value;
}

function d() {
    return new Date().toLocaleString();
}

var timer = setInterval(() => {

    var currentHour = new Date().getHours();

    if (8 <= currentHour && currentHour < 20) {
        console.log(`${d()} Time in range; going to update data`);

        var homeToWorkTime, workToGymTime, gymToHomeTime;
        request(urlLeg1, {json: true}, (err, res, body) => {
            try {
                homeToWorkTime = getTravelTimeFromBody(body);
            } catch (err) {
                console.log(`${d()} Error extracting travel time from body ${err}`);
                console.log(body);
            }
            request(urlLeg2, {json: true}, (err, res, body) => {
                try {
                    workToGymTime = getTravelTimeFromBody(body);
                } catch (err) {
                    console.log(`${d()} Error extracting travel time from body ${err}`);
                    console.log(body);
                }
                request(urlLeg3, {json: true}, (err, res, body) => {
                    try {
                        gymToHomeTime = getTravelTimeFromBody(body);
                        var dataObj = {
                            time: d(),
                            homeWorkTime: homeToWorkTime,
                            workGymTime: workToGymTime,
                            gymHomeTime: gymToHomeTime
                        };
                        fs.appendFile(dataFile, JSON.stringify(dataObj) + "\n", (err) => {
                            if (err) {
                                console.log(`${d()}: Error writing to file ${err}`);
                            } else {
                                console.log(`${d()}: Successfully updated data`);
                            }
                        });
                    } catch (err) {
                        console.log(`${d()} Error extracting travel time from body ${err}`);
                        console.log(body);
                    }
                });
            });
        });
    } else {
        console.log(`${d()}: Time not in range`);
    }
}, 300000);