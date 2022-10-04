async function isLoggedIn () {
  const token = localStorage.getItem('token')
  console.log(token);
  if (token === null) {
    console.log('login');
  } else {
    window.location.href = './dashboard.html';
    }
}

isLoggedIn()

const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === '' || password === '') {
        alert('Field cannot be empty!')
    } else {

    fetch('https://freddy.codesubmit.io/login', {
	method: 'POST',
	body: JSON.stringify({
		username: username,
		password: password
	}),
	headers: {
		'Content-type': 'application/json'
	}
    }).then(function (response) {
	if (response.ok) {
		return response.json();
	}
	return Promise.reject(response);
    }).then(function (data) {
	console.log(data.access_token);

    localStorage.setItem('token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    window.location.href = './dashboard.html';

    }).catch(function (error) {
        alert('Wrong credentials....Check and try again!')
       location.reload()
    });
}
})
