// const BASE_URL = 'https://register.nomoreparties.co'
const BASE_URL = 'http://localhost:3001'
// const BASE_URL = 'https://boiling-scrubland-25608.herokuapp.com'

export const register = (password, email) => {
    return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password, email })
    })
    .then(res => res.json())
    .then(res => res)
    .catch(err => console.log(err))
};
export const authorize = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password, email })
    })
    .then(res => res.json())
    .then(res => res)
    .catch(err => console.log(err))
};
export const checkToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log(err))
}