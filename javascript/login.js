// Select necessary elements from the DOM
const form = document.querySelector(".login form");
const continueBtn = form.querySelector("button");
const errorText = form.querySelector(".error-text");

// Prevent the form from submitting the default way
form.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Handle the continue button click
continueBtn.addEventListener('click', () => {
    // Prepare the XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "php/login.php", true);

    // Define what to do when the response is loaded
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const responseData = xhr.responseText.trim();
                if (responseData === "success") {
                    window.location.href = "users.php"; // Redirect to users page
                } else {
                    // Display error message
                    errorText.style.display = "block";
                    errorText.textContent = responseData;
                }
            } else {
                console.error('Error response status:', xhr.status);
            }
        }
    };

    // Handle errors during the request
    xhr.onerror = () => {
        console.error('Request failed');
    };

    // Prepare and send form data
    const formData = new FormData(form);
    xhr.send(formData);
});
