// function to get tab id, cause script needs it, got it from deve docs
async function getTabId(){
	let queryOptions = {active:true, lastFocusedWindow:true};
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

const urls = [
	"*://*.instagram.com/"
]
//current time
let time = Date.now();
const interval = 60000;

const trackTime = async () => {
	if ((Date.now() - time) >= interval) { //over the interval time
		time = Date.now()
		//script that runs the blocking script
		//chrome.scripting.executeScript({target:{tabId:getTabId()}, files:["block.js"]})
		console.log("question now");
	}
	console.log("test")

}

//listens to tab, track time, run function to blocking script if time is over...
//chrome.tabs.onUpdated.addListener(() => {trackTime()})
	//chrome.tabs.query({active: true, currentWindow: true}, activeTab =>

//check if tab switched, reset track time, run function
//chrome.tabs.onActivated.addListener(function(activeInfo){
//	time = Date.now();
function activeInfo(){
	console.log("why")
}
//})

//focus lost, stop program
//chrome.windows.onFocusChanged.addListenter(window => {console.log(window)});



/*
Plan
- make a screen
- console everytime needed to screen
*/