import { GoogleGenAI } from "./genai.js";
import { key } from "./API_KEYS.js";

let time = Date.now();
const interval = 6000; // 5 secs
let message = "";
const ai = new GoogleGenAI({apiKey: key});


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

const cleanUp = async() =>{
	console.log("cleaning up")

	for (let i = 0; i < document.body.children.length; i++){ // still buggy
			document.body.children[i].style.display = ''
	}
	return;
}


const block = async(question) => {
	// generate question using ai
	// add question onto site

	for (let i = 0; i < document.body.children.length; i++){
		document.body.children[i].style.display = 'none'
	}
	document.body.style.display = "block"

	const pop = document.createElement("div")
	pop.innerHTML = "<p>"+question+"</p>"
	document.body.prepend(pop)
	pop.style.textAlign="center"

	const text = document.createElement("input")
	text.setAttribute("type", "text")
	text.setAttribute("name", "answer")
	text.style.backgroundColor = "#FCF5D8"
	text.style.color = "#000000"
	pop.append(text)


	const button = document.createElement("button")
	button.textContent = "Submit"
	pop.append(button)

	// const help = document.createElement("button")
	// help.textContent = "Help me"
	// document.body.append(help)
	// help.style.textAlign="center"


	const p = new Promise((resolve) => {
		button.addEventListener("click", function(){
			resolve(text.value) // brings smth back
			console.log("working")
		}, {once: true})//idk if needed
	})
	const result = await p
	console.log("button pressed")

	return p;
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
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: "Only give one question. It can from one of the following categories for grade 12 ontario high school levels: math, english, or science. Only give the necessary information to solve the problem, be concise and formal. NO SUBJECTIVE QUESTIONS", // ask a question about...
			config: {
			  systemInstruction: "You are a grade 12 ontario high school tutorer who poses questions that can be solved under a minute. You talk professtionally and concisely. Each question is written with only the necessary information YOU ARE NOT ALLOWED TO FORMAT YOUR QUESTIONS USING ANYTHING OTHER THAN PLAIN TEXT", // change
			},
		});
		console.log(response.text);

		getAnswer(response.text);
	}
}

async function getAnswer(response){
		//generative stuff
		const tab = await getTab()
		console.log(await getTab())

		const injectionResults = await chrome.scripting.executeScript({ //waiting for injectionresults to actually contain a value
			target: {"tabId":tab.id},
			function: block,
			args: [response]
			//files: ["block.js"],
		});
		for (const guess of injectionResults){
			const {result} = guess
			console.log(result)//
			message = result
		}

		const grade = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: "Given the question: " + response +  "is the answer: " + message + " a correct answer. You are only allowed to answer either yes or no",
			config: {
			  systemInstruction: "You are a simple answer checker STRICTLY responding with either yes or no.",
			},
		});
		console.log(grade.text);//
		verifyAnswer(grade.text, response);


}

async function verifyAnswer(grade, response){
		const tab = await getTab()
		console.log(await getTab())

		if (grade === "yes") {
			startTime();
			chrome.scripting.executeScript({ //waiting for injectionresults to actually contain a value
				target: {"tabId":tab.id},
				function: cleanUp
			})
		} else {
				getAnswer(response);
			// const explanation = await ai.models.generateContent({
				// model: "gemini-2.5-flash",
				// contents: "Given the question: " + response.text +  "the student gave the answer: " + message + ". In no more than 200 words, describe chiefly where the student went wrong and what the correct answer was.",
				// config: {
				// systemInstruction: "You are Mr.beast, tutoring student today. They got the question wrong and you must correct them and help them understand the question.",
				// },
			// });


			// also generate voice here, give text and make const here... after setting up text, return to play audio "button with do you understand will interupt??"
				//const = await chrome.scripting.executeScript({ //waiting for injectionresults to actually contain a value
					//target: {"tabId":tab.id},
					//function: watchVideo
			}// do you understand?, then yess
			// for (let i = 0; i < document.body.children.length; i++){
				// document.body.children[i].style.display = 'block'
			// }
	}

chrome.tabs.onActivated.addListener(()=>startTime())