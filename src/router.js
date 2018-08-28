export let Router = {
  handle: function(route) {
      const routeName = route + 'Route';
      Controller[routeName]();
  }
};