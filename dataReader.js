if (process.env.NODE_ENV !== "production") {
    require("dotenv").load();
}
var request = require("request"),
    MongoClient = require("mongodb").MongoClient;

var mongoUrl = process.env.MONGO_URL;
var urlLeg1 = getMapsApiUrl(process.env.HOME_ADDRESS, process.env.WORK_ADDRESS, process.env.API_KEY);
var urlLeg2 = getMapsApiUrl(process.env.WORK_ADDRESS, process.env.GYM_ADDRESS, process.env.API_KEY);
var urlLeg3 = getMapsApiUrl(process.env.GYM_ADDRESS, process.env.HOME_ADDRESS, process.env.API_KEY);

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

MongoClient.connect(mongoUrl, (err, db) => {
    if (err) throw err;
    var dbo = db.db("travel_times");

    function updateData(collection, mapApiUrl) {
        console.log(`${new Date()} in updateData`);
        request(mapApiUrl, {json: true}, (err, res, body) => {
            if (!err) {
                try {
                    var travelTime = getTravelTimeFromBody(body);
                } catch (e) {
                    console.log(`Error extracting travel time from body ${e}`);
                    console.log(body);
                    return;
                }
                dbo.collection(collection).insertOne({
                    timestamp: new Date(),
                    travelTime: travelTime
                }, (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Updated collection ${collection}`);
                    }
                });
            } else {
                console.log(`Error in maps API request ${err}`);
            }
        })
    }

    var timer = setInterval(() => {
        var currentHour = new Date().getHours();
        if (8 <= currentHour && currentHour < 20) {
            console.log("About to update data");
            for (var pair of [["home_work", urlLeg1], ["work_gym", urlLeg2], ["gym_home", urlLeg3]]) {
                var collection = pair[0];
                var mapApiUrl = pair[1];
                updateData(collection, mapApiUrl);
            }
        } else {
            console.log(`Hour not in range ${currentHour}`);
        }
    }, 600000);
});