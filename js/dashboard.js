document.documentElement.classList.remove('no-js')
document.getElementById('logOut').onclick = function logout() {
    localStorage.removeItem("token");
    window.location.href = './index.html'
}


const url = 'https://freddy.codesubmit.io/dashboard';
const refreshUrl = 'https://freddy.codesubmit.io/refresh'
const access_token = localStorage.getItem('token');
const refresh_token = localStorage.getItem('refresh_token');
console.log(`Bearer ${access_token}`);

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
        console.log(json);
    }
})
.catch(err => console.log(err));

const checkAndRquest = () => {
fetch(refreshUrl, {
    method: "POST",
    headers : {
    "Content-type": "application/json;charset=UTF-8",
    "Authorization": "Bearer " + refresh_token
    }
    })
        .then(response => response.json()) 
        .then(json => 
       {
         console.log(json.access_token)
        localStorage.setItem('token', json.access_token)
    }
    )
    .catch(err => console.log(err));
}

var weekCanvasElement = document.getElementById("weekChart");
var config = {
    type: "bar",
    data: {
        labels: ["day","day","day","day"], 
        datasets: [
            {
                label: "Number of cookies", 
                data: [5, 2, 12, 19, 3],
                backgroundColor: "#D8D8D8",
                borderColor: "#C3C3C3",
            }
        ],

    }
}

var weekChart = new Chart(weekCanvasElement, config)

