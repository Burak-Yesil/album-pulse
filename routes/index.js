// TODO: import routes from other routes files
import albumRoutes from './albums.js';
import userRoutes from './users.js';

const constructorMethod = (app) => {
    // TODO: app.use to all of our valid routes
    app.use('/', albumRoutes); // not sure if im allowed to do this lol
    app.use('/', userRoutes);

    app.use('*', (req, res) => {
        res.status(404).render('error', { title: 'Error', error: 'Route Not found', status: 404 });
    });
};
  
export default constructorMethod;