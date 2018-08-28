export const Model = {
    friends: [],

    login: function (apiId, perms) {
        return new Promise((resolve, rejected) => {
            VK.init({
                apiId
            });

            VK.Auth.login((r) => {
                if (r.session) {
                    resolve(r);
                } else {
                    rejected(new Error('VK.init error'));
                }
            }, perms)
        })
    },

    callApi: function (method, params = {}) {
        params.v = params.v || '5.73';

        return new Promise((resolve, rejected) => {
            VK.Api.call(method, params, (r) => {
                if (r.error) {
                    rejected(new Error(`VK.Api.call ${method} error`))
                } else {
                    resolve(r.response)
                }
            })
        })
    },

    loadFriends: function (params = {}) {
        return new Promise((resolve, rejected) => {
            this.callApi('friends.get', params)
                .then(response => {
                    response.items.forEach((item, i) => {
                        if (localStorage.selectedFriends && localStorage.selectedFriends.indexOf(item.id) !== -1)
                            item.selected = true;
                        else
                            item.selected = false;
                        item.index = i;
                        item.filtered = true;
                        this.friends.push(item);
                    });
                    resolve();
                })
                .catch(err => {
                    rejected(err);
                })
        })
    },

    getFriends: function (params) {
        return this.friends.filter(item => item.selected === params.selected);
    },

/*
    getUser: function (params = {}) {
        return this.callApi('users.get', params);
    },
*/

};