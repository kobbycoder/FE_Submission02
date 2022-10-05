document.documentElement.classList.remove('no-js')
const today = document.getElementById("today");
const lastWeek = document.getElementById("lastweek");
const lastMonth = document.getElementById("lastmonth");

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
        const weekData = json.dashboard.sales_over_time_week
        const monthsData = json.dashboard.sales_over_time_year
        console.log(weekData);
        var todayTotal, todayOrders;
        var lastWeekTotal = 0;
        var lastWeekOrders = 0;
        var lastMonthTotal = 0;
        var lastMonthOrders = 0;
        for ( var i in weekData) {
            todayTotal = weekData[i].total
            todayOrders = weekData[i].orders
            break;
        }
        today.innerHTML = `$${nFormatter(todayTotal)} / ${todayOrders} orders`
        
        for (var k = 1; k < Object.keys(weekData).length + 1; k++){
            lastWeekTotal += weekData[k].total
            lastWeekOrders += weekData[k].orders
        }
        lastWeek.innerHTML = `$${nFormatter(lastWeekTotal)} / ${lastWeekOrders} orders`

        var lastmonth = Object.keys(monthsData)[1]
        lastMonthTotal = monthsData[lastmonth].total
        lastMonthOrders = monthsData[lastmonth].orders
        lastMonth.innerHTML = `$${nFormatter(lastMonthTotal)} / ${lastMonthOrders} orders`
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

