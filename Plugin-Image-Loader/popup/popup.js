const loadBtn = document.getElementById("load-btn")
  .addEventListener("click", () => {
    chrome.tabs.query({active: true}, (tabs) => {
      const tab = tabs[0];
      if(tab){
        chrome.scripting.executeScript({
          target: {tabID: tab.id, allFrames: true}, 
          func: selectImages
        },
        onResult
        );
      }
    });
  });

function selectImages(){
  const images = document.querySelectorAll("img");
  return Array.from(images).map(image => image.src);
}

function onResult(frames){
  const imagesUrl = frames.map(frame => frame.result)
  .reduce((r1,r2) => r1.concat(r2));

  window.navigator.clipboard.writeText(imagesUrl).then(window.close());
}

function toPageImages(){
    chrome.create({"url" : "pages/page.html"});
}