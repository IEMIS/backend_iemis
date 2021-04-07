exports.staffValidator = (req, res, next) => {
    req.check('staffCode', 'Staff Code is required').notEmpty();
    req.check('district', 'district is required').notEmpty();
    req.check('firstName', 'First Name is required').notEmpty();
    req.check('lastName', 'Last Name is required').notEmpty();
    req.check('title', 'tittle is required').notEmpty();
    req.check('gender', 'gender is required').notEmpty();
    req.check('dob', 'date of birth is required').notEmpty();
    req.check('nationality', 'designation is required').notEmpty();
    req.check('designation', 'designation is required').notEmpty();
    req.check('email', 'email is required').notEmpty();
    req.check('email', 'valid email address required')
        .matches(/.+\@.+\..+/)
        .withMessage('valid email address required')
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
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};