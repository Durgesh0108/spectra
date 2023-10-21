/* eslint-disable */
import '@babel/polyfill';
import { login, logout, signup } from './login';
import { updateSettings } from './updateSettings';
import { addGlass } from './glass';
import { bookGlass } from './stripe';
import { addReview } from './review';

const loginForm = document.querySelector('#form--login');
const signupForm = document.querySelector('#form--signup');
const logOutBtn = document.querySelector('.logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const addGlassForm = document.querySelector('#form--addGlass');
const bookBtn = document.querySelector('#book-glass');
const addReviewForm = document.querySelector('#form--addReview');

if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        // console.log(email, password);
        login(email, password);
    });

if (signupForm)
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm')
            .value;
        const photo = document.getElementById('photo').files;
        signup(name, email, password, passwordConfirm, photo);
    });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log(form);

        updateSettings(form, 'data');
    });

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';

        const passwordCurrent = document.getElementById('password-current')
            .value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm')
            .value;
        await updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password'
        );

        document.querySelector('.btn--save-password').textContent =
            'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });

// Glass Handler
if (addGlassForm)
    addGlassForm.addEventListener('submit', async e => {
        const images = [];

        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('price', document.getElementById('price').value);
        form.append('summary', document.getElementById('summary').value);
        form.append(
            'description',
            document.getElementById('description').value
        );
        form.append(
            'ratingsAverage',
            document.getElementById('ratingsAverage').value
        );
        form.append(
            'imageCover',
            document.getElementById('imageCover').files[0]
        );
        form.append(
            'imageHover',
            document.getElementById('imageHover').files[0]
        );
        form.append('images', document.getElementById('images').files[0]);

        // const image1 = document.querySelector('.#image1').files[0];
        // const image2 = document.querySelector('.#image2').files[1];
        // const image3 = document.querySelector('.#image3').files[2];
        // images.push(image1, image2, image3);
        form.append('images', images);
        // console.log(form);
        await addGlass(form);
    });

// Review Handler
if (addReviewForm)
    addGlassForm.addEventListener('submit', async e => {
        e.preventDefault();
        const reviewForm = new FormData();
        const { glassID } = e.target.dataset;
        const user = req.user;
        reviewForm.append('glassID', glassID);
        reviewForm.append('user', user);
        reviewForm.append('rating', document.getElementById('rating').value);
        reviewForm.append('review', document.getElementById('review').value);
        // const rating = document.getElementById('rating').value;
        // const review = document.getElementById('review').value;
        // console.log(reviewForm);
        // console.log(`Review Data:${(rating, review, glassID, user)}`);
        await addReview(reviewForm);
        // await addReview(rating, review, glassID, user);
    });

//Booking Handler
if (bookBtn)
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { glassId } = e.target.dataset;
        // console.log(glassId);
        // console.log(e.target.dataset);
        bookGlass(glassId);
    });
