/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const addGlass = async data => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/glasses/',
            data
        });
        // console.log(email, password);

        if ((res.data.status = 'success')) {
            showAlert('success', 'Glass Added Succesfully');
            window.setTimeout(() => {
                location.assign('/me');
            }, 1500);
        }
        // console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
        // console.log('failed', err.response.data.message);
    }
};
