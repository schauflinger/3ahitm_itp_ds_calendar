async function sendDate() {
    let date = document.getElementById("date").value;
    let response = await fetch(`sendDate?date=${date}`);
    let responseBody = await response.text();
    console.log(responseBody);
}