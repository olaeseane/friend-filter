import renderFriends from './friends.hbs';

export let View = {
    renderFriends: function(model) {
        return renderFriends(model);
    }
};