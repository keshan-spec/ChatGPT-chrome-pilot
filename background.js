// add custom menu item to context menu
chrome.contextMenus.create({
    "id": "openaiSearch",
    "title": "OpenAI Search",
    "contexts": ["selection"],
});

// Read emotion of text 
chrome.contextMenus.create({
    "id": "openaiSearchEmotion",
    "title": "Emotion",
    "contexts": ["selection"],
    "parentId": "openaiSearch",
});

// Summarize text
chrome.contextMenus.create({
    "id": "openaiSearchSummarize",
    "title": "Summarize",
    "contexts": ["selection"],
    "parentId": "openaiSearch",
});

// Define text
chrome.contextMenus.create({
    "id": "openaiSearchDefine",
    "title": "Define",
    "contexts": ["selection"],
    "parentId": "openaiSearch",
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "openaiSearchEmotion") {
        chrome.tabs.sendMessage(tab.id, {
            command: "openaiSearchEmotion",
            selectionText: info.selectionText,
        });
    }

    if (info.menuItemId === "openaiSearchSummarize") {
        chrome.tabs.create({
            url: "https://www.google.com/search?q=" + info.selectionText,
        });
    }

    if (info.menuItemId === "openaiSearchDefine") {
        chrome.tabs.create({
            url: "https://www.google.com/search?q=" + info.selectionText,
        });
    }
});