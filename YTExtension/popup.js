function displayBookmarks() {
    chrome.storage.sync.get(null, (items) => {
        const bookmarkList = document.getElementById('bookmark-list');
        bookmarkList.innerHTML = ''; // Clear the current list

        Object.keys(items).forEach((videoId, index) => {
            items[videoId].forEach((timestamp, idx) => {
                const bookmarkItem = document.createElement('div');
                bookmarkItem.classList.add('bookmark-item');

                const bookmarkName = document.createElement('span');
                bookmarkName.textContent = `Bookmark ${index + 1}-${idx + 1}`;

                // Play button with icon
                const playBtn = document.createElement('button');
                playBtn.classList.add('icon-btn');
                playBtn.innerHTML = '<i class="fas fa-play"></i>';

                playBtn.addEventListener('click', () => {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        const tabId = tabs[0].id;

                        chrome.tabs.sendMessage(tabId, {
                            type: "GO_TO_TIMESTAMP",
                            videoId: videoId,
                            timestamp: timestamp
                        });
                    });
                });

                // Delete button with icon
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('icon-btn', 'delete');
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

                deleteBtn.addEventListener('click', () => {
                    chrome.storage.sync.get([videoId], (data) => {
                        let bookmarks = data[videoId] || [];
                        bookmarks = bookmarks.filter((bm) => bm !== timestamp);

                        chrome.storage.sync.set({ [videoId]: bookmarks }, () => {
                            displayBookmarks(); // Refresh the list
                        });
                    });
                });

                // Append elements to bookmark item
                bookmarkItem.appendChild(bookmarkName);
                bookmarkItem.appendChild(playBtn);
                bookmarkItem.appendChild(deleteBtn);

                // Add bookmark item to the list
                bookmarkList.appendChild(bookmarkItem);
            });
        });
    });
}

// Add Bookmark Button Handler
document.getElementById('bookmark-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        chrome.tabs.sendMessage(tabId, { type: "BOOKMARK" }, (response) => {
            if (response) {
                const videoId = response.videoId;
                const timestamp = response.timestamp;

                chrome.storage.sync.get([videoId], (data) => {
                    let bookmarks = data[videoId] ? data[videoId] : [];
                    bookmarks.push(timestamp);

                    chrome.storage.sync.set({ [videoId]: bookmarks }, () => {
                        displayBookmarks(); // Refresh the list
                    });
                });
            }
        });
    });
});

// Load bookmarks when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    displayBookmarks();
});
