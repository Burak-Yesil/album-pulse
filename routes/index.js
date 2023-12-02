// TODO: import routes from other routes files
import albumRoutes from './albums.js';
import userRoutes from './users.js';

const constructorMethod = (app) => {
    // TODO: app.use to all of our valid routes
    app.use('/', userRoutes);
   
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Route Not found'});
    });
  };
  
export default constructorMethod;