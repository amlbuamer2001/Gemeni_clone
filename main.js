let typingForm = document.querySelector(".typing-form");
let chatList = document.querySelector(".chat-list");

const API_Key='AIzaSyByK4MbpqADEYQSAo10_edWKYF5sP2QiVs'
const API_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_Key}`;

const showTypingEffect=(apiResponse,textElement)=>{
    const words= apiResponse.split(" ")
    let currentWordIndex=0;
    const typingInterval= setInterval(()=>{
        textElement.innerText += (currentWordIndex==0?"":" ") + words[currentWordIndex++]
        if(currentWordIndex==words.length){
            clearInterval(typingInterval)
        }
    },75)
}

const generateApiResponse= async(div)=>{
    const textElement = div.querySelector('.text')
    try{
        const response = await fetch(API_URL,{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                contents:[{
                    role:"user",
                    parts:[{text:userMessage}]
                }]
            })
        })
        const data= await response.json()
        const apiResponse= data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,'$1')
        console.log(apiResponse);
        showTypingEffect(apiResponse,textElement)
        // textElement.innerHTML=apiResponse
        
    }catch(error){
        console.error(error)
    }
    finally{
        div.classList.remove('loading')
    }
}

const copyMessage=(cpyBtn)=>{
    const messageText= cpyBtn.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText)

    // cpyBtn.innerText='check'
}

const showLoading = () => {
  const html = `
     <div class="message-content">
                    <img src="./images/gemini.svg" alt="icon">
                    <p class="text"></p>
                    <div class="loading-indecator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                    </div>
                </div>
                <span onClick="copyMessage(this)" class="material-symbols-outlined">
                    content_copy
                </span>
    `;

    const div = document.createElement('div');
    div.classList.add('message','incoming','loading')
    div.innerHTML=html;
    chatList.appendChild(div)

    generateApiResponse(div)
};

const handleOutGoingChat = () => {
  userMessage = document.querySelector(".typing-input").value;
  console.log(userMessage);
  if (!userMessage) return;

  html = `
    <div class="message-content">
        <p class="text"></p>
    </div>
    `;
  div = document.createElement("div");
  div.classList.add("message", "outgoing");
  div.innerHTML = html;
  div.querySelector(".text").innerHTML = userMessage;
  chatList.appendChild(div);
  typingForm.reset();
  setTimeout(showLoading, 500);
};

typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleOutGoingChat();
});
