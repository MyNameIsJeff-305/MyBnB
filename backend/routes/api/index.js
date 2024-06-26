const router = require('express').Router();
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const spotImagesRouter = require('./spot-images.js');
const reviewImagesRouter = require('./review-images.js');
const sessionRouter = require('./session.js');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { validateSignup, handleValidationErrors } = require('../../utils/validations');
const bcrypt = require('bcryptjs');
const { User } = require('../../db/models');


router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);
router.use('/spot-images', spotImagesRouter);
router.use('/review-images', reviewImagesRouter);


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
      user: safeUser
    });
    // forward any errors not already sent
  } catch (error) {
    next(error);
  };
});

module.exports = router;
