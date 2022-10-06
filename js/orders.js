// logout
document.getElementById('logOut').onclick = function logout() {
    localStorage.removeItem("token");
    window.location.href = './index.html'
}

const url = 'https://freddy.codesubmit.io/orders?page=1&q=';
const refreshUrl = 'https://freddy.codesubmit.io/refresh'
const access_token = localStorage.getItem('token');
const refresh_token = localStorage.getItem('refresh_token');
const prevButton = document.getElementById('previousButton')
const nextButton = document.getElementById('nextButton')
const searchBar = document.getElementById('search-input')

let pageSize = 10;
let currentPage = 1;
var dataSize = 0;

const getData = (page = 1) => {
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
        dataSize = Object.keys(json.orders).length
}
})
.catch(err => console.log(err));

 if (page == 1) {
    prevButton.style.visibility = "hidden";
  } else {
    prevButton.style.visibility = "visible";
  }

  if (page == numPages()) {
    nextButton.style.visibility = "hidden";
  } else {
    nextButton.style.visibility = "visible";
  }
}

getData()

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
    var allData = []

    console.log(orders);

    let tableData = "";
    for (var k = 0; k < Object.keys(orders).length; k++){
            allData.push(orders[k])
    }

    console.log(allData);

    allData.filter((row, index) => {
    let start = (currentPage - 1) * pageSize
    let end = currentPage * pageSize

    if (index >= start && index < end) return true;
    }).forEach(data => {
        const str = data.status;
        const status = str.charAt(0).toUpperCase() + str.slice(1)
           tableData+=`
            <tr>
                <td>${data.product.name}</td>
                <td>${format(new Date(data.created_at))}</td>
                <td>${(data.total/data.product.quantity).toFixed(2)}</td>
                <td>${status}</td>
            </tr>
           `
    })

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

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        getData(currentPage)
    }
}

function nextPage() {
    console.log(dataSize);
    if ((currentPage * pageSize) < dataSize) {
        currentPage++;
        getData(currentPage)
    }
}

function numPages() {
  return Math.ceil(dataSize.length / pageSize);
}


document.querySelector('#previousButton').addEventListener('click', previousPage, false)
document.querySelector('#nextButton').addEventListener('click', nextPage, false)


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


searchBar.addEventListener('keyup', function (e) {
    const currentword = e.target.value;
fetch(`https://freddy.codesubmit.io/orders?page=${currentPage}&q=${currentword}`, {
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
        dataSize = Object.keys(json.orders).length
}
})
.catch(err => console.log(err));

});

