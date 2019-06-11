async function sendDate() {
    let date = new Date(document.getElementById("date").value).toLocaleDateString();
    let title = document.getElementById("title").value;
    let response = await fetch(`sendDate?date=${date}&title=${title}`);
    let responseBody = JSON.parse(await response.text());
    document.getElementById("response").innerHTML = responseBody.message;
}