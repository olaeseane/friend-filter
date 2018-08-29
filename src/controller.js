import {Model} from './model';
import {View} from "./view";

export const Controller = {
    listFriends: document.querySelector('#list-friends'),
    listSelectedFriends: document.querySelector('#list-selected-friends'),

    currentFilter: '',
    currentSelectedFilter: '',

    saveFriends: function () {
        localStorage.selectedFriends = JSON.stringify(Model.getFriends({selected: true}));
        alert('Список друзей в фильтре сохранен');
    },

    showFriend: function () {
        this.listFriends.innerHTML = View.renderFriends({
            items: Model.getFriends({selected: false})
        });
        this.listSelectedFriends.innerHTML = View.renderFriends({
            items: Model.getFriends({selected: true})
        });
    },

    selectFriend: function (event) {
        if (event.target.classList.contains('fa-plus')) {
            const item = Model.friends[event.target.parentNode.id];
            item.selected = true;
            item.filtered = isMatching(item.first_name + ' ' + item.last_name, this.currentSelectedFilter);
        }
        if (event.target.classList.contains('fa-times')) {
            const item = Model.friends[event.target.parentNode.id];
            item.selected = false;
            item.filtered = isMatching(item.first_name + ' ' + item.last_name, this.currentFilter);

        }
        Controller.showFriend();
    },

    filterFriends: function (event) {
        if (event.target.name === 'filter-friends') {
            this.currentFilter = event.target.value;
            Model.friends.forEach((item) => {
                if (!item.selected) {
                    item.filtered = isMatching(item.first_name + ' ' + item.last_name, event.target.value);
                }
            })
        }
        if (event.target.name === 'filter-selected-friends') {
            this.currentSelectedFilter = event.target.value;
            Model.friends.forEach((item) => {
                if (item.selected) {
                    item.filtered = isMatching(item.first_name + ' ' + item.last_name, event.target.value);
                }
            })
        }
        Controller.showFriend();
    },

    makeDragAndDrop: function () {
        let currentDrag;

        [this.listFriends, this.listSelectedFriends].forEach(zone => {
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
                        Model.friends[currentDrag.index].selected = !Model.friends[currentDrag.index].selected;
                    }

                    currentDrag = null;
                    Controller.showFriend();
                }
            });
        })
    }
};

const isMatching = (full, chunk) => {
    let regex = new RegExp(chunk, 'i');

    return regex.test(full);
};
