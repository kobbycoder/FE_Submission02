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
        getTableRawData(json.orders)
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

// revenue amount formatter
function nFormatter(num) {
    if (num >= 1000000000) {
        return(num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
        return(num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return(num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}

const getTableRawData = (orders) => {
    let tableData = "";
    for (var k = 0; k < Object.keys(orders).length; k++){
        const str = orders[k].status;
        const status = str.charAt(0).toUpperCase() + str.slice(1)
           tableData+=`
            <tr>
                <td>${orders[k].product.name}</td>
                <td>${format(new Date(orders[k].created_at))}</td>
                <td>${(orders[k].total/orders[k].product.quantity).toFixed(2)}</td>
                <td>${status}</td>
            </tr>
           `
        }
        document.getElementById("table_body").innerHTML = tableData

        elements = document.getElementsByTagName("td")
        for (var i = elements.length; i--;) {
            if (elements[i].innerHTML === "Processing") {
            elements[i].style.color = "red";
        }
            if (elements[i].innerHTML === "Delivered") {
            elements[i].style.color = "#70D406";
        }
    }
}

function format(inputDate) {
    let date,
        month,
        year;

    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();

    date = date.toString().padStart(2, '0');

    month = month.toString().padStart(2, '0');

    return `${date}/${month}/${year}`;
}

