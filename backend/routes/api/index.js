const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser, requireAuth } = require('../../utils/auth.js');
const csrf = require('csurf');

router.use(restoreUser);


router.use('/session', sessionRouter);
router.use('/users', usersRouter);


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
})


module.exports = router;

//Phase 3 Done