chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: "onboarding.html" //new html site
    });
  }
});


async function getTabId(){
	let queryOptions = {active:true, lastFocusedWindow:true};
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}