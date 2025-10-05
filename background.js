let time = Date.now();
const interval = 3000; // 5 secs

//from docs
async function getTab(){
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;

}

let timer = setInterval(trackTime, interval)

function startTime(){
	console.log("Time Begun")
	time = Date.now()
	clearInterval(timer)
	timer = setInterval(trackTime, interval)
}

function stopTime(timer){
	console.log("Time Stopped")
	clearInterval(timer)
}

async function trackTime(){
	if ((Date.now() - time) >= interval) { //over the interval time
		time = Date.now()
		console.log("question now");
		stopTime(timer)
		const tab = await getTab()
		console.log(await getTab())
		//script that runs the blocking script
		chrome.scripting.executeScript({
			target: {"tabId":tab.id},
			files: ["block.js"],
		})
		.then(() => startTime())
		// keep in while loop

		//start time again
	}
	console.log("free time")
}



chrome.tabs.onActivated.addListener(()=>startTime())