import axios from 'axios';

export default function API(method, path, params) {
    const TOKEN = localStorage.getItem("@ACCESS_TOKEN");
    const api = process.env.REACT_APP_API_KEY;
    const HEADER = { headers: { Authorization: `Bearer ${TOKEN}` } }
    try {
        return new Promise(function (myResolve, myReject) {
            if (method === 'get' || method === 'delete') {
                axios[method](api + path, HEADER)
                    .then(response => {
                        myResolve(response);
                    }).catch(err => {
                        myReject(err);
                    })
                return
            }
            axios[method](api + path, params, HEADER)
                .then(response => {
                    myResolve(response);
                }).catch(err => {
                    myReject(err);
                })
        });
    }
    catch (err) {
        console.log("axios.js >> TOKEN_NOT_FOUND-----------", err);
    }
};