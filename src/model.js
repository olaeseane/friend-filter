export const Model = {
    login: function (apiId, perms) {
        return new Promise((resolve, rejected) => {
            debugger;
            VK.init({
                apiId
            });

            VK.Auth.login((r) => {
                if (r.session) {
                    resolve(r);
                } else {
                    rejected(new Error('VK auth error'));
                }
            }, perms)
        })
    },

    callApi: function (method, params = {}) {
        params.v = params.v || '5.73';

        return new Promise((resolve, rejected) => {
            VK.Api.call(method, params, (r) => {
                if (r.error) {
                    rejected(new Error('VK call method error'))
                } else {
                    resolve(r.response)
                }
            })
        })
    },

    getUser: function (params = {}) {
        return callApi('users.get', params);
    },

    getFriends: function (params = {}) {
        return callApi('friends.get', params);
    },
};