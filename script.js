const SPEED_LIMIT = 60;

let watchId = null;

function startTracking() {
    const speedElement = document.getElementById("speed");
    const statusElement = document.getElementById("status");
    const messageElement = document.getElementById("message");
    const startButton = document.getElementById("startBtn");
    const stopButton = document.getElementById("stopBtn");

    if (!navigator.geolocation) {
        statusElement.textContent = "GPS Not Supported";
        statusElement.className = "status error";
        messageElement.textContent = "Your browser does not support GPS.";
        return;
    }

    if (watchId !== null) {
        return;
    }

    messageElement.textContent = "Requesting GPS permission...";

    watchId = navigator.geolocation.watchPosition(
        function (position) {
            const gpsSpeed = position.coords.speed;

            if (gpsSpeed === null || !Number.isFinite(gpsSpeed)) {
                statusElement.textContent = "Waiting for GPS";
                statusElement.className = "status";
                messageElement.textContent =
                    "GPS speed unavailable. Try an open area.";
                return;
            }

            const speedKmh = gpsSpeed * 3.6;

            speedElement.textContent = Math.round(speedKmh);

            if (speedKmh > SPEED_LIMIT) {
                statusElement.textContent = "SPEED ALERT!";
                statusElement.className = "status alert";
                messageElement.textContent =
                    "Speed limit crossed! Slow down safely.";
            } else {
                statusElement.textContent = "SAFE";
                statusElement.className = "status safe";
                messageElement.textContent =
                    "Speed is within the 60 km/h limit.";
            }
        },
        function (error) {
            watchId = null;
            startButton.disabled = false;
            stopButton.disabled = true;

            statusElement.textContent = "GPS Error";
            statusElement.className = "status error";

            if (error.code === 1) {
                messageElement.textContent =
                    "Please allow location permission in your browser.";
            } else if (error.code === 2) {
                messageElement.textContent =
                    "GPS unavailable. Check your location settings.";
            } else {
                messageElement.textContent =
                    "GPS timed out. Please try again.";
            }
        },
        {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 20000
        }
    );

    startButton.disabled = true;
    stopButton.disabled = false;
}

function stopTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }

    document.getElementById("speed").textContent = "0";

    const statusElement = document.getElementById("status");
    statusElement.textContent = "Tracking Stopped";
    statusElement.className = "status";

    document.getElementById("message").textContent =
        "GPS tracking has stopped.";

    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
}