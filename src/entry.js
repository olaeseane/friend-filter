import './styles/styles.css';

import {Model} from './model';

const apiId = 6668882;

Model.login(apiId, 2)
    .then((response) => {
        document.getElementById('name').innerText = response.session.user.first_name;
        document.getElementById('last-name').innerText = response.session.user.last_name;
    })
    .catch((err) => {
        console.error(err)
    });
