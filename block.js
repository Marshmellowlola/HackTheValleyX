document.body.style.display = "none"

//add question onto site
const styleSheet = document.styleSheets[0]
styleSheet.insertRule('html::before { content:"!!"; } ', styleSheet.cssRules.length)


// while () {
// ask ai for question -> display
// answer box, give to ai, recieve answer
// }