const chatinput = document.querySelector("#text-input");
const sbutton = document.querySelector("#send-btn");
const chatcontainer = document.querySelector(".chat-container");
const deletebutton = document.querySelector("#delete_btn")
let usertext = null;
const API_KEY = "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";

const loaddatafromlocalstorage= () => {
chatcontainer.innerHTML=localStorage.getItem("all-chats")
chatcontainer.scrollTo(0 , chatcontainer.scrollHeight)

}
loaddatafromlocalstorage();
const createElement = (html, className) => {
    const Divchat = document.createElement("div");
    Divchat.classList.add("chat", className);
    Divchat.innerHTML = html;
    return Divchat;


}




//properties and data for the api request visit site https://platform.openai.com/docs/api-reference
const getchatresponse = async (incomingdivelement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions"
    const API_KEY = "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"
    const pElement = document.createElement("p");

    const requestoptions = {
        method: "POST",
        headers: {
            "content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": usertext }]
        })
    }

    try {
        const response = await (await fetch(API_URL, requestoptions)).json();
        console.log(response);
        pElement.textContent = response.choices[0].message.content.trim();
        // pElement.textContent = response.choices[0].text.trim();
    } catch (error) { // Add error class to the paragraph element and set error
        pElement.classList.add("error");
        pElement.textContent="OOPS!something went wrong while retrieving the message.Please try again"

       

    }

    

    incomingdivelement.querySelector(".typing-animation").remove();
    incomingdivelement.querySelector(".chat-details").appendChild(pElement)
    localStorage.setItem("all-chats" , chatcontainer.innerHTML)  //saving all chat HTML data as all-chats name in local storage,The setItem() method sets the value of the specified Storage Object item.localStorage.setItem(keyname, value)(syntax)


}


const copyresponse = (copybtn) => {
    const responsetextelement = copybtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responsetextelement.textContent);
    copybtn.textContent = "done";
    setTimeout(() => copybtn.textContent = "content_copy", 1000);
}


const ShowAnimationDots = () => {
    const html = ` <div class="chat-content">
<div class="chat-details">
<img src="images/chatbot.jpg" alt="chatbot">
<div class="typing-animation">
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
</div>
</div>
<span onclick="copyresponse(this)" class="material-symbols-outlined">
    content_copy
    </span>
</div>`


    const incomingdivelement = createElement(html, "incoming");
    chatcontainer.appendChild(incomingdivelement);

    getchatresponse(incomingdivelement);


}





const handleuserinput = () => {
    usertext = chatinput.value.trim();    /*to remove extra spaces*/

    chatinput.value = "";
    chatinput.style.height = `${initialheight}px`;

    const html = `<div class="chat-content">
<div class="chat-details">
<img src="images/m.jpg" alt="user-img">
<p>${usertext}<p>
</div>
</div>`

    const outgoingdivelement = createElement(html, "outgoing");
    chatcontainer.appendChild(outgoingdivelement);


    setTimeout(ShowAnimationDots, 500)

}


// deletebutton.addEventListener("click" , ()=>{



// })
const initialheight = chatinput.scrollHeight;

chatinput.addEventListener("input", () => {

    chatinput.style.height = `${initialheight}px`;
    chatinput.style.height = `${chatinput.scrollHeight}px`;
})



chatinput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {  //he event object (or e for short) will contain more than one property to help you determine which key the user pressed.
        e.preventDefault();
        handleuserinput();
    }
});

deletebutton.addEventListener("click" , ()=>{

if(confirm("are you sure you want to delete all the chats")){
localStorage.removeItem("all-chats");  //he confirm() method displays a dialog box with a message, an OK button, and a Cancel button. The confirm() method returns true if the user clicked "OK", otherwise false .
loaddatafromlocalstorage();

}

})

sbutton.addEventListener("click", handleuserinput);

