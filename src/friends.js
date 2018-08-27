import './styles/styles.css';

import renderFriend from './friend.hbs';

VK.init({
    apiId: 6668882
});

let currentUser = {};

class Friend {
    constructor({id, first_name, last_name, photo_100, selected}, index) {
        this.id = id;
        this.firstName = first_name;
        this.lastName = last_name;
        this.photo_100 = photo_100;
        this.selected = selected;
        this.filtered = true;
        this.index = index;
    }

    render() {
        return renderFriend.call(null, this);
    }
}

let storeFriends = [];

const listAllFriends = document.querySelector('#list-all-friends');
const listSelectedFriends = document.querySelector('#list-selected-friends');
const btnSave = document.querySelector('.btn.save');

function authVK() {
    return new Promise((resolve, rejected) => {
        VK.Auth.login((r) => {
            if (r.session) {
                resolve(r.session);
            } else {
                rejected(new Error('VK auth error'));
            }
        }, 2)
    });
}


function callVKApi(method, params = {}) {
    params.v = '5.73';

    return new Promise((resolve, rejected) => {
        VK.Api.call(method, params, (r) => {
            if (r.error) {
                rejected(r.error)
            } else {
                resolve(r.response)
            }
        })
    })
}

function getFriends() {
    return new Promise(resolve => {
        callVKApi('friends.get', {order: 'random', fields: 'photo_100'})
            .then(response => {
                response.items.forEach((item, i) => {
                    if (localStorage.selectedFriends && localStorage.selectedFriends.indexOf(item.id) !== -1)
                        item.selected = true;
                    storeFriends.push(new Friend(item, i));
                });
                resolve();
            })
            .catch(() => new Error('VK friends.get error'))
    })

}

function renderFriends() {
    listAllFriends.innerHTML = '';
    listSelectedFriends.innerHTML = '';

    storeFriends.forEach((item) => {
        if (item.selected) {
            listSelectedFriends.innerHTML += item.render();
        }
        else {
            listAllFriends.innerHTML += item.render();
        }
    })
}

function isMatching(full, chunk) {
    let regex = new RegExp(chunk, 'i');

    return regex.test(full);
}

function setFilterHandler() {
    document.addEventListener('keyup', (event) => {
        if (event.target.name === 'filter-all-friends') {
            storeFriends.forEach((item) => {
                if (!item.selected) {
                    item.filtered = isMatching(item.firstName + ' ' + item.lastName, event.target.value);
                }
            })
        }
        if (event.target.name === 'filter-selected-friends') {
            storeFriends.forEach((item) => {
                if (item.selected) {
                    item.filtered = isMatching(item.firstName + ' ' + item.lastName, event.target.value);
                }
            })
        }
        renderFriends();
    });
}

function setSelectHandler() {
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('fa-plus')) {
            storeFriends[event.target.parentNode.id].selected = true;
        } else if (event.target.classList.contains('fa-times')) {
            storeFriends[event.target.parentNode.id].selected = false;
        }
        renderFriends();
    })
}

function makeDragAndDrop(zones) {
    let currentDrag;

    zones.forEach(zone => {
        zone.addEventListener('dragstart', (event) => {
            currentDrag = {source: zone, node: event.target, index: event.target.children[0].id};
        });

        zone.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        zone.addEventListener('drop', (event) => {
            if (currentDrag) {
                event.preventDefault();

                if (currentDrag.source !== zone) {
                    zone.insertBefore(currentDrag.node, zone.lastElementChild);
                    storeFriends[currentDrag.index].selected = !storeFriends[currentDrag.index].selected;
                    currentDrag.node.outerHTML = storeFriends[currentDrag.index].render();
                }

                currentDrag = null;
            }
        });
    })
}

function setSaveBtnHandler() {
    btnSave.addEventListener('click', () => {
        localStorage.selectedFriends = JSON.stringify(storeFriends.filter((item) => item.selected));
        alert('Список друзей в фильтре сохранен');
    })
}

(function () {
    authVK()
        .then(session => {
            currentUser.id = session.user.id;
            currentUser.firstName = session.user.first_name;
            currentUser.lastName = session.user.last_name;

            getFriends().then(() => renderFriends());

            setFilterHandler();
            setSelectHandler();
            setSaveBtnHandler();

            makeDragAndDrop([listAllFriends, listSelectedFriends]);
        })
        .catch(err => console.error(err));
}());