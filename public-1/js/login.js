/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// axios
//     .get('https://jsonplaceholder.typicode.com/todos/1')
//     .then(response => console.log(response.data))
//     .catch(error => console.log(error));

// const login = async (email, password) => {
//     try {
//         const res = await axios.post(
//             'http://127.0.0.1:5000/api/v1/users/login',
//             {
//                 email,
//                 password
//             }
//         );

//         if ((res.data.status = 'success')) {
//             alert('Logged in Successfully');
//             window.setTimeout(() => {
//                 location.assign('/');
//             }, 1500);
//         }
//         // console.log(res);
//     } catch (err) {
//         console.log(err);
//         alert(err);
//         // console.log('failed', err.response.data.message);
//     }
// };

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        // console.log(email, password);

        if ((res.data.status = 'success')) {
            showAlert('success', 'Logged in Successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
        // console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
        // console.log('failed', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if ((res.data.status = 'success')) {
            location.reload();
        }
    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error logging out! Try again.');
    }
};

export const signup = async (name, email, password, passwordConfirm, photo) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm,
                photo
            }
        });
        // console.log(email, password);

        if ((res.data.status = 'success')) {
            showAlert('success', 'Logged in Successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
        // console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
        // console.log('failed', err.response.data.message);
    }
};
