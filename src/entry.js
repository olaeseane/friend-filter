import './styles/styles.css';

import {Model} from './model';
import {View} from './view';

const apiId = 6668882;
const permission = 2;

Model.login(apiId, permission)
    .then(() => {
        Model.loadFriends({order: 'random', fields: 'photo_100'})
            .then(() => {
                const listFriends = document.querySelector('#list-friends');
                const listSelectedFriends = document.querySelector('#list-selected-friends');

                listFriends.innerHTML = View.renderFriends({
                    items: Model.getFriends(false)
                });
                listSelectedFriends.innerHTML = View.renderFriends({
                    items: Model.getFriends(true)
                });
                console.log(Model.getFriends());
            })
    })
    .catch((err) => {
        console.error(err)
    });
