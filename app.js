// Set up the express server as shown in the lecture code
import express from 'express';
import session from 'express-session';
import exphbs from 'express-handlebars';

import configRoutesFunction from './routes/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({
  name: 'AuthState',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false
}))


app.use('/', async(req, res, next)=>{
  const currentPath = req.path.toLowerCase();
  if (!req.session.user){
    console.log(currentPath)
    const bypassRedirectionRoutes = ['/login', '/register', '/about'];
    if (bypassRedirectionRoutes.includes(currentPath)) {
      console.log("In List")
      return next();
    }
    return res.redirect("/about")
  }
  else{
    next()
  }
})



configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});