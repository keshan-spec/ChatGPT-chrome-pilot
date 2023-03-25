(() => {
    // listen for messages from the background script
    chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
        const { command, selectionText } = data;
        if (command === "openaiSearchEmotion") {
            // create a modal to display the emotion
            const modal = document.createElement("div");
            modal.classList.add("openai-ext-modal");

            const modalContent = document.createElement("div");
            modalContent.style.padding = "20px";
            modalContent.style.borderRadius = "5px";

            const modalText = document.createElement("p");

            modalText.innerText = selectionText;

            modalContent.appendChild(modalText);
            modal.appendChild(modalContent);

            document.body.appendChild(modal);

            // add a close button to the modal
            const closeButton = document.createElement("button");
            closeButton.innerText = "Close";
            closeButton.style.padding = "10px";
            closeButton.style.borderRadius = "5px";
            closeButton.style.border = "none";

            closeButton.addEventListener("click", closeModal);

            modalContent.appendChild(closeButton);
        }

        if (command === "openaiSearchSummarize") {
            // do something with the selection text
        }
    });
})();

// function to close modal
const closeModal = () => {
    const modal = document.querySelector(".openai-ext-modal");
    modal.style.display = "none";
}