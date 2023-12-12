import express from 'express';
import session from 'express-session';
import exphbs from 'express-handlebars';

import configRoutesFunction from './routes/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(session({
  name: 'AuthState',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false
}));

// Global Logging and Conditional Redirection Middleware
app.use((req, res, next) => {
  const isAuthenticated = !!req.session.user;
  const currentPath = req.path.toLowerCase();

  console.log(`[${new Date().toUTCString()}]: ${req.method} ${currentPath} (${isAuthenticated ? 'Authenticated User' : 'Non-Authenticated User'})`);

  // Define the paths that do not require redirection
  const publicPaths = ['/login', '/register', '/about'];

  if (!isAuthenticated && !publicPaths.includes(currentPath)) {
    // Redirect non-authenticated users to /about by default
    return res.redirect('/about');
  } else if (isAuthenticated && currentPath === '/') {
    // Redirect authenticated users to /user/:username
    return res.redirect(`/user/${encodeURIComponent(req.session.user.username)}`);
  }

  // Proceed to next middleware or route
  next();
});

// Configure routes with the imported function
configRoutesFunction(app);

// Start the server
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
