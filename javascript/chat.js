// Select necessary elements from the DOM
const form = document.querySelector(".typing-area");
const incomingId = form.querySelector(".incoming_id").value;
const inputField = form.querySelector(".input-field");
const sendBtn = form.querySelector("button");
const chatBox = document.querySelector(".chat-box");

// Prevent the form from submitting the default way
form.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Focus on the input field by default
inputField.focus();

// Add or remove the 'active' class from the send button based on input field value
inputField.addEventListener('keyup', () => {
    sendBtn.classList.toggle("active", inputField.value.trim() !== "");
});

// Handle the send button click
sendBtn.addEventListener('click', () => {
    if (inputField.value.trim() === "") return;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "php/insert-chat.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            inputField.value = ""; // Clear input field
            scrollToBottom(); // Scroll to the bottom of the chat box
        } else {
            console.error('Error sending message:', xhr.statusText);
        }
    };
    xhr.onerror = () => {
        console.error('Request failed');
    };
    const formData = new FormData(form);
    xhr.send(formData);
});

// Add or remove the 'active' class from chat box based on mouse events
chatBox.addEventListener('mouseenter', () => chatBox.classList.add("active"));
chatBox.addEventListener('mouseleave', () => chatBox.classList.remove("active"));

// Fetch new chat messages periodically
setInterval(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "php/get-chat.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            chatBox.innerHTML = xhr.response;
            if (!chatBox.classList.contains("active")) {
                scrollToBottom(); // Ensure the chat box is scrolled to the bottom if not active
            }
        } else {
            console.error('Error fetching chat:', xhr.statusText);
        }
    };
    xhr.onerror = () => {
        console.error('Request failed');
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(`incoming_id=${encodeURIComponent(incomingId)}`);
}, 500);

// Scroll to the bottom of the chat box
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}
