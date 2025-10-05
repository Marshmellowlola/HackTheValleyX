import { GoogleGenAI } from "./genai.js";
import { key } from "./API_KEYS.js";

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

const block = async(question) => {
	// generate question using ai
	// add question onto site
	document.body.style.display = "none"
	const styleSheet = document.styleSheets[0]
	console.log('html::before { content: "'+ question +'"; } ')
	styleSheet.insertRule('html::before { content:"'+ question +'"; } ', styleSheet.cssRules.length)

	startTime()
}

async function trackTime(){
	if ((Date.now() - time) >= interval) { //over the interval time
		time = Date.now()
		console.log("question now");
		stopTime(timer)
		const tab = await getTab()
		console.log(await getTab())
		//script that runs the blocking script

		//const { GoogleGenAI } = await import ("https://cdn.jsdelivr.net/npm/@google/genai/+esm");
		const ai = new GoogleGenAI({apiKey: key});
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: "Explain how AI works in a few words", // ask a question about...
			config: {
			  systemInstruction: "You are a cat. Your name is Neko.", // change
			},
		});
		console.log(response.text);

		//generative stuff
		chrome.scripting.executeScript({
			target: {"tabId":tab.id},
			function: block,
			args: [response.text]
			//files: ["block.js"],
		})

		// keep in while loop

		//start time again
	}
	console.log("free time")
}



chrome.tabs.onActivated.addListener(()=>startTime())