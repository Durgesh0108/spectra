/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
    'pk_test_51MiCnrSDQ8eFOcmyHdklKo0spfzOFDASDM9fcuWDv3LMR9kVumMeMJq2CmatvlwWZ5mbWCL60DHyenaFXO3AAWZx00qZ4XMmIh'
);
// const stripe = Stripe(
//     'pk_live_51MiCnrSDQ8eFOcmyrpaRyTS0PANwDaK9bgNQ1u8zij6Nw8naauB92qIiga430YKX2ob4TPirwAKHuLpTld1oKwSs00asOzeToo'
// );

export const bookGlass = async glassID => {
    try {
        // 1) Get checkout session from API
        const session = await axios(
            `/api/v1/bookings/checkout-session/${glassID}`
        );
        // console.log(session);
        // console.log(session.data.session.id);

        // 2) Create checkout form + chanre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
