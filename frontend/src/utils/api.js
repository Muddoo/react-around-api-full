class Api {
    constructor({baseUrl,options}) {
        this._baseUrl = baseUrl;
        this._options = options;
    }

    async queryCards({query = '',method='GET',body = null}) {
        this._options = {...this._options,method,body: body && JSON.stringify(body)};
        const res = await fetch(`${this._baseUrl}/cards/${query}`,this._options);
        return res.ok ? res.json() : Promise.reject(`Error: ${res.status} - ${res.statusText} - ${res.url}`);
    }

    async getUser() {
        const res = await fetch(`${this._baseUrl}/users/me`,this._options);
        return res.ok ? res.json() : Promise.reject(`Error: ${res.status} - ${res.statusText} - ${res.url}`);
    }

    async updateProfile({avatar = '',method = 'PATCH',body}) {
        this._options = {...this._options,method,body: JSON.stringify(body)};
        const res = await fetch(`${this._baseUrl}/users/me/${avatar}`,this._options);
        return res.ok ? res.json() : Promise.reject(`Error: ${res.status} - ${res.statusText} - ${res.url}`);
    }
}

export default Api

// export default new Api({
//     // baseUrl:'https://around.nomoreparties.co/v1/group-7',
//     baseUrl:'http://localhost:3001',
//     options: {
//       headers: {
//         authorization: '53ef19e5-74f0-45cf-b7f3-6d5e1b396f52',
//         "Content-Type": "application/json",
//       }
//     }
//   })