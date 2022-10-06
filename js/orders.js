// logout
document.getElementById('logOut').onclick = function logout() {
    localStorage.removeItem("token");
    window.location.href = './index.html'
}

const url = 'https://freddy.codesubmit.io/orders?page=1&q=';
const refreshUrl = 'https://freddy.codesubmit.io/refresh'
const access_token = localStorage.getItem('token');
const refresh_token = localStorage.getItem('refresh_token');

fetch(url, {
  method: "GET",
  headers: {
    "Content-type": "application/json;charset=UTF-8",
    "Authorization": "Bearer "+access_token
}
})
.then(response => response.json())
.then(json => {
    if (json.msg) {
        checkAndRquest()
    } else {
        console.log(json.orders);
}
})
.catch(err => console.log(err));

// check for token expiry and request new one
const checkAndRquest = () => {
    fetch(refreshUrl, {
        method: "POST",
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + refresh_token
        }
    }).then(response => response.json()).then(json => {
        console.log(json.access_token)
        localStorage.setItem('token', json.access_token)
        window.location.href = './orders.html'
    }).catch(err => console.log(err));
}


