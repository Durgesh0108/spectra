/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const addReview = async (rating, review, glassID, user) => {
    // console.log(rating, review, glassID, user);
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/glasses/:glassID/review',
            data: {
                rating,
                review,
                glassID,
                user
            }
        });
        // console.log(email, password);

        if ((res.data.status = 'success')) {
            showAlert('success', 'Review Added Succesfully');
            window.setTimeout(() => {
                location.assign('/glass/:slug');
            }, 1500);
        }
        // console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
        // console.log('failed', err.response.data.message);
    }
};
