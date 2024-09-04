
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.includes("youtube.com/watch")) {
        const queryParameters = changeInfo.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const videoId = urlParameters.get("v");

        if (videoId) {
            chrome.tabs.sendMessage(tabId, {
                type: "NEW_VIDEO",
                videoId: videoId
            });
        }
    }
});
