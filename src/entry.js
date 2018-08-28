import './styles/styles.css';

import {Model} from './model';
import {Controller} from './controller';

const apiId = 6668882;
const permission = 2;

Model.login(apiId, permission)
    .then(() => {
        Model.loadFriends({order: 'random', fields: 'photo_100'})
            .then(() => {
                Controller.showFriend();

                const btnSave = document.querySelector('.btn.save');
                btnSave.addEventListener('click', Controller.saveFriends);

                document.addEventListener('click', Controller.selectFriend);

                document.addEventListener('keyup', Controller.filterFriends);

                Controller.makeDragAndDrop();
            })
    })
    .catch((err) => {
        console.error(err)
    });