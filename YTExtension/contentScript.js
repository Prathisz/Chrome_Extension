chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in content script:", request);

    if (request.type === "BOOKMARK") {
        const videoPlayer = document.querySelector("video");

        if (videoPlayer) {
            const currentTime = videoPlayer.currentTime;
            sendResponse({
                videoId: new URLSearchParams(window.location.search).get("v"),
                timestamp: currentTime
            });
        } else {
            sendResponse(null);
        }
    }

    if (request.type === "GO_TO_TIMESTAMP") {
        const videoPlayer = document.querySelector("video");

        if (videoPlayer) {
            // Seek to the specified timestamp and play the video
            videoPlayer.currentTime = request.timestamp;
            videoPlayer.play();
        }
    }

    return true;
});
