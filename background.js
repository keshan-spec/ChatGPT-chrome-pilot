// chrome.runtime.onInstalled.addListener(function () {
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

// make response to selection
chrome.contextMenus.create({
    "id": "openaiSearchResponse",
    "title": "Generate Response",
    "contexts": ["selection"],
    "parentId": "openaiSearch",
})

// log the context menu item id
console.log("context menu item added");
// });


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "openaiSearchEmotion") {
        console.log(info.selectionText);
        chrome.tabs.sendMessage(tab.id, {
            command: "openaiSearchEmotion",
            selectionText: info.selectionText,
        });
    }

    if (info.menuItemId === "openaiSearchSummarize") {
        console.log(info.selectionText);

        chrome.tabs.sendMessage(tab.id, {
            command: "openaiSearchSummarize",
            selectionText: info.selectionText,
        });
    }

    if (info.menuItemId === "openaiSearchDefine") {
        console.log(info.selectionText);

        chrome.tabs.sendMessage(tab.id, {
            command: "openaiSearchDefine",
            selectionText: info.selectionText,
        });
    }

    if (info.menuItemId === "openaiSearchResponse") {
        console.log(info.selectionText);

        chrome.tabs.sendMessage(tab.id, {
            command: "openaiSearchResponse",
            selectionText: info.selectionText,
        });
    }

});

// listen for the response from the content script
chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    console.log(data);
})