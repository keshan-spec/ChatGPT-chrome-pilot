export const showLoadingCursor = () => {
    const style = document.createElement("style");
    style.id = "cursor_wait";
    style.innerHTML = `* {cursor: wait;}`;
    document.head.insertBefore(style, null);
};

export const restoreCursor = () => {
    document.getElementById("cursor_wait").remove();
};