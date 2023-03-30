(() => {
    // listen for messages from the background script
    chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
        const { command, selectionText } = data;
        if (command === "openaiSearchEmotion") {
            sendRequest(selectionText, "What emotion does this text convey? :", command);
        }

        if (command === "openaiSearchSummarize") {
            sendRequest(selectionText, "Summarize this text:", command);

        }

        if (command === "openaiSearchDefine") {
            sendRequest(selectionText, "Define this text:", command);
        }

        if (command === "openaiSearchResponse") {
            sendRequest(selectionText, "Generate a response to this text:", command);
        }

    });
})();

// function to close modal
const closeModal = () => {
    const modal = document.querySelector(".openai-ext-modal");

    // remove the button from the dom
    modal.remove();
}

const addLoaderToDom = () => {
    const loaderContainer = document.createElement("div");
    loader.classList.add("openai-ext-loader-container");

    const loader = document.createElement("div");
    loader.classList.add("openai-ext-loader");

    loaderContainer.appendChild(loader);

    document.body.appendChild(loaderContainer);
}

const createModal = (selectText, data, command) => {
    // create a modal with the data
    const modal = document.createElement("div");
    modal.classList.add("openai-ext-modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("openai-ext-modal-content");

    // p tag to display the text
    const text = document.createElement("p");
    text.classList.add("openai-ext-modal-text-typing-animation");

    // add id
    text.id = "typed-text";

    // strip data of \n and \t
    data = data.replace(/(\r\n|\n|\r|\t)/gm, "");
    text.innerText = data;

    modalContent.appendChild(text);
    modal.appendChild(modalContent);

    // create a close button
    const closeButton = document.createElement("button");

    closeButton.innerHTML = "<span>&times;</span>";
    closeButton.classList.add("openai-ext-modal-close");

    closeButton.addEventListener("click", closeModal);

    modalContent.appendChild(closeButton);

    // add a copy to clipboard button
    const copyButton = document.createElement("button");
    copyButton.innerHTML = "<i class='fas far-copy'></i>";
    copyButton.classList.add("openai-ext-modal-copy");

    copyButton.addEventListener("click", () => {
        // copy the text to the clipboard
        navigator.clipboard.writeText(data);

        // change the button to a checkmark
        copyButton.innerHTML = "<i class='fas far-check'></i>";
    });

    modalContent.appendChild(copyButton);

    if (command !== "openaiSearchEmotion") {
        // add a row of buttons at the bottom of the modal to tune the results
        const buttonRow = document.createElement("div");
        buttonRow.classList.add("openai-ext-modal-button-row");

        // add a button to generate new results
        const generateButton = document.createElement("button");
        generateButton.classList.add("openai-ext-modal-action-button");
        generateButton.innerText = "Try Again";

        generateButton.addEventListener("click", () => {
            resultOptions(data, command, "new_gen");
        });

        buttonRow.appendChild(generateButton);

        // add a button to make the results shorter
        const shorterButton = document.createElement("button");
        shorterButton.classList.add("openai-ext-modal-action-button");
        shorterButton.innerText = "Shorter";

        shorterButton.addEventListener("click", () => {
            resultOptions(data, command, "shorter");
        });

        buttonRow.appendChild(shorterButton);

        // add a button to make the results longer
        const longerButton = document.createElement("button");
        longerButton.classList.add("openai-ext-modal-action-button");
        longerButton.innerText = "Longer";

        longerButton.addEventListener("click", () => {
            resultOptions(data, command, "longer");
        });

        buttonRow.appendChild(longerButton);

        // add a button to make the results funnier
        const funnierButton = document.createElement("button");
        funnierButton.classList.add("openai-ext-modal-action-button");
        funnierButton.innerText = "Funnier";

        funnierButton.addEventListener("click", () => {
            resultOptions(data, command, "funnier");
        });

        buttonRow.appendChild(funnierButton);

        // add buttin row to modal
        modalContent.appendChild(buttonRow);
    }

    return modal;
}

const resultOptions = (prompt, command, option) => {
    const options = {
        "openaiSearchSummarize": {
            "shorter": "Summarize this text, but make it within 1 or 2 sentences :",
            "longer": "Summarize this text, but make it longer:",
            "funnier": "Summarize this text, but make it funnier:",
            "new_gen": "Summarize this text again in a new style: "
        },
    }

    // send message to background script to log the option
    chrome.runtime.sendMessage({ option: option, command: command, prompt: prompt });

    if (!options[command][option]) return console.log("Invalid option");
    closeModal();

    let q = options[command][option]
    sendRequest(prompt, q, command);
}

const sendRequest = (prompt, prefix, command) => {
    const apiKey = "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"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    };

    const body = {
        model: "text-davinci-003",
        prompt: `${prefix} ${prompt} `,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    };

    const url = "https://api.openai.com/v1/completions"
    showLoadingCursor()
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    }).then((response) => {
        if (!response.ok) {
            chrome.runtime.sendMessage({ error: response });
            restoreCursor();
        }
        return response.json();
    }).then((data) => {
        // send the data back to the background script
        chrome.runtime.sendMessage({ data: data, command: command });
        let modal = createModal(prompt, data.choices[0].text, command);
        document.body.appendChild(modal);
        restoreCursor();
    }).catch(error => {
        restoreCursor();
        chrome.runtime.sendMessage(error);
    });
}

const showLoadingCursor = () => {
    const style = document.createElement("style");
    style.id = "cursor_wait";
    style.innerHTML = `* {cursor: wait;}`;
    document.head.insertBefore(style, null);
};

const restoreCursor = () => {
    document.getElementById("cursor_wait").remove();
};