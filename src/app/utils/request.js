import 'whatwg-fetch';


const SERVER = process.env.NODE_ENV === 'production' ?'https://us-central1-firebase-projectg2016.cloudfunctions.net': 'http://localhost:8010/firebase-projectg2016/asia-northeast1';



function parseJSON(response) {
  return Promise.resolve(response.json())
}


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 401) {
    location.href = '/login';
  }
  const error = new Error(response.statusText, response.status);
  error.response = response;
  return Promise.resolve({
    error,
  });
}

function getHeader() {
  const headers = new Headers();
  return headers;
}


export function getWithAuth(url) {
  return firebase.auth().currentUser.getToken(true)
    .then((idToken) => {
      console.log("GET WITH AUTH")
      return fetch(SERVER+ url, {
        headers: {
          'Content-type': 'application/json',
          'token': idToken
        },
        method: 'GET',
      })
    })
    .then(parseJSON)
    .catch(function (error) {
      // Handle error
      console.error(error);
    });
}
export function get(url) {
  return fetch(SERVER + url, {
    headers: {
      'Content-type': 'application/json',
    },
    method: 'GET',
  }).then(parseJSON);
}
export function post(url, data) {
  return fetch(SERVER + url, {
    headers: {
      'Content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  }).then(parseJSON);
}
export function postWithAuth(url, data) {
  return firebase.auth().currentUser.getToken(true)
    .then((idToken) => {
    console.log("POST WITH AUTH")
    return fetch(SERVER + url, {
      headers: {
        'Content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(Object.assign(data,{
        token: idToken
      })),
    })
  })
    .then(parseJSON)
    .catch(function (error) {
    // Handle error
      console.error(error);
  });
}
export function deleteWithAuth(url, data) {
  return firebase.auth().currentUser.getToken(true)
    .then((idToken) => {
      console.log("DELETE WITH AUTH")
      return fetch(SERVER + url, {
        headers: {
          'Content-type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify(Object.assign(data || {},{
          token: idToken
        })),
      })
    })
    .then(parseJSON)
    .catch(function (error) {
      // Handle error
      console.error(error);
    });
}

