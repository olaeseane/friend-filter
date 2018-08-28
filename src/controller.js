import {Model} from './model';
import {View} from "./view";

export let Controller = {
    saveFriends: function () {
        localStorage.selectedFriends = JSON.stringify(Model.getFriends({selected: true}));
        alert('Список друзей в фильтре сохранен');
    },

    showFriend: function () {
        const listFriends = document.querySelector('#list-friends');
        const listSelectedFriends = document.querySelector('#list-selected-friends');

        listFriends.innerHTML = View.renderFriends({
            items: Model.getFriends({selected: false})
        });
        listSelectedFriends.innerHTML = View.renderFriends({
            items: Model.getFriends({selected: true})
        });
    },

    selectFriend: function (event) {
        if (event.target.classList.contains('fa-plus'))
            Model.friends[event.target.parentNode.id].selected = true;
        if (event.target.classList.contains('fa-times'))
            Model.friends[event.target.parentNode.id].selected = false;
        console.log(Model.friends[event.target.parentNode.id]);
        Controller.showFriend();
    },

    async filterFriends() {

    }
};