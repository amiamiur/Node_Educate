chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    addImagesToConteiner(message)
    sendResponse("Ok!")
});

function addImagesToConteiner(urls){
    document.writeText(JSON.stringify(urls))
}