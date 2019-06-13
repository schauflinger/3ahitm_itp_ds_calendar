async function sendDate() {
    let date = document.getElementById("date").value;
    let title = document.getElementById("title").value;
    let response = await fetch(`sendDate?date=${date}&title=${title}`);
    let responseBody = JSON.parse(await response.text());
    document.getElementById("response").innerHTML = responseBody.message;
}