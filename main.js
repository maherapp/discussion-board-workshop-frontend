const url = "http://localhost:2020/";
const status = { 
  sections: {
    current: null
  },
  forms: { }
};

status.sections.messages = document.getElementById('messages-section');
status.sections.main = document.getElementById('main-section');
status.sections.signup = document.getElementById('signup-section');
status.sections.signin = document.getElementById('signin-section');
status.forms.messageForm = document.getElementById('message-form');

document.addEventListener('DOMContentLoaded', async () => {
  getMessages();
  status.sections.current = status.sections.main;
});

async function signupSubmit(event) {
  event.preventDefault();
  let data = {
    name: event.target["name"].value,
    email: event.target["email"].value,
    password: event.target["password"].value
  }
  const response = await fetch(url + 'users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  status.user = data;
  status.forms.messageForm.classList.remove('hidden');
  navto('main');
}

async function signinSubmit(event) {
  event.preventDefault();
  let data = {
    email: event.target["email"].value,
    password: event.target["password"].value
  }
  const response = await fetch(url + 'users/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  let user = await response.json();
  if(user == null) {
    window.alert('User not found!');
    return;
  }
  status.user = user;
  status.forms.messageForm.classList.remove('hidden');
  navto('main');
}

async function messageSubmit(event) {
  event.preventDefault();
  let data = {
    message: event.target["message"].value,
    user: status.user.name
  }
  const response = await fetch(url + 'posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  status.sections.messages.innerHTML += `
    <div class="card">
    <div class="card-content">
      <p class="title">
        ${data.message}
      </p>
      <p class="subtitle">
        ${data.user}
      </p>
    </div>
  </div><br>`;
}

async function getMessages() {
  const response = await fetch(url + 'posts');
  const messages = await response.json();
  status.sections.messages.innerHTML = '';
  messages.forEach(message => {
    status.sections.messages.innerHTML+= `
    <div class="card">
    <div class="card-content">
      <p class="title">
        ${message.message}
      </p>
      <p class="subtitle">
        ${message.user}
      </p>
    </div>
  </div>
  <br>`
  });
}

async function navto(section) {
  status.sections.current.classList.add('hidden');
  status.sections.current = status.sections[section];
  status.sections.current.classList.remove('hidden');
}