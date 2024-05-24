const router = require('express').Router();
const loginRouter = require('./login.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const logoutRouter = require('./logout.js')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { validateSignup } = require('../../utils/validation');
const bcrypt = require('bcryptjs');
const { User } = require('../../db/models');


router.use(restoreUser);


router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);


router.get('/api/csrf/restore', (req,res)=>{
    if (process.env.NODE_ENV !== 'production') {
        router.get('/api/csrf/restore', (req, res) => {
          res.cookie('XSRF-TOKEN', req.csrfToken());
          return res.json({});
        });
      }
});

router.get('/require-auth', requireAuth, (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {
    next({
      message: 'Error in /require-auth'
    })
  }
});

router.post('/signup', validateSignup, async (req, res, next) => {
  try {
      const { firstName, lastName, email, password, username } = req.body; //Deconstructing req.body


      const hashedPassword = bcrypt.hashSync(password); //Hashed password for User

      const user = await User.create({ firstName, lastName, email, username, hashedPassword }); //Creating User Record in Users Table

      // console.log(user.firstName);
      const safeUser = { //This will be for the setTokenCookie functions
          id: user.id,
          email: user.email,
          username: user.username,
          //Adding First Name and Last Name to the Safe User
          firstName: user.firstName,
          lastName: user.lastName
      };

      await setTokenCookie(res, safeUser); //Set Token Cookie


      return res.json({
          user: safeUser
      });
  } catch (error) {
      next(error)
  }
});

module.exports = router;
