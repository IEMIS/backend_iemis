exports.createSchoolValidator = (req, res, next) => {
    req.check('names', 'first Name is required').notEmpty();
    req.check('email', 'valid emaill address required')
        .matches(/.+\@.+\..+/)
        .withMessage('valid emaill address required')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');
        //minimum phone digit in fiji is 7
     req.check('phone','enter a phone number').notEmpty();
     req.check('phone')
        .isLength({min:7}).withMessage('phone number must be valid')
        .matches(/\d/).withMessage('phone number must be a plain number');
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};