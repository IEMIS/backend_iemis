exports.createAdmin =async (req, res, next) =>{
    req.check('firstName', 'Admin First Name is required').notEmpty();
    req.check('lastName', 'Admin last Name is required').notEmpty();
    req.check('email', 'Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('a valid email address is required')
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

exports.createDistrict =async (req, res, next) =>{
    req.check('names', 'District names is required').notEmpty();
    req.check('address', 'District address is required').notEmpty();
    req.check('email', 'Email must be between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('a valid email address is required')
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
    req.check('phone','enter a phone number').notEmpty();
    req.check('phone')
    // minimum phone number in fiji is 7digits
    .isLength({min:7}).withMessage('phone number must be valid')
    .matches(/\d/).withMessage('phone number must be a plain number');
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.adminSignIn = (req, res, next)=>{
    req.check('email', 'Admin email address is required').notEmpty();
    
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty();
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
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
