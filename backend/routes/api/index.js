const router = require('express').Router();
const loginRouter = require('./login.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const logoutRouter = require('./logout.js')
const reviewsRouter = require('./reviews.js')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { validateSignup } = require('../../utils/validation');
const bcrypt = require('bcryptjs');
const { User } = require('../../db/models');


router.use(restoreUser);


router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);


router.get('/api/csrf/restore', (_req, _res) => {
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
  // try block
  try {
    // deconstruct req.body
    const defaultPassword = 'password'
    const { email, password, username, firstName, lastName } = req.body;
    // // create a hashed password for user
    let hashedPassword;
    if (password)
      hashedPassword = bcrypt.hashSync(password);
    else
      hashedPassword = bcrypt.hashSync(defaultPassword)
    // // create user record in Users table
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      hashedPassword: hashedPassword
    });
    console.log(newUser);
    // create safeUser object for setTokenCookie function
    const safeUser = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      username: newUser.username
    };
    // set token cookie
    await setTokenCookie(res, safeUser);

    return res.json({
      newUser: safeUser
    });
    // forward any errors not already sent
  } catch (error) {
    next(error);
  };
});

module.exports = router;
