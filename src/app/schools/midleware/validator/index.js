exports.schoolCreator = (req, res, next) => {
    req.check('code', 'school code is required').notEmpty();
    req.check('code')
    .isLength({min:6}).withMessage('school code must be valid')
    .matches(/\d/).withMessage('school must be a plain number');
    req.check('district', 'school district is required').notEmpty();
    req.check('names', 'school Name is required').notEmpty();
    req.check('email', 'valid email address required')
        .matches(/.+\@.+\..+/)
        .withMessage('valid email address required')
        .isLength({
            min: 4,
            max: 32
        });

    req.check('fax', 'valid school fax number is required').notEmpty();
    req.check('mailBox', 'Mailing Address is missing').notEmpty();
    //minimum phone digit in fiji is 7
     req.check('phone','enter a phone number').notEmpty();
     req.check('phone')
        .isLength({min:7}).withMessage('phone number must be valid')
        .matches(/\d/).withMessage('phone number must be a plain number');
    req.check('address', 'school address is required').notEmpty();
    req.check('province', 'province is required').notEmpty();
    req.check('eduLevel', 'Education Level is required').notEmpty();
    req.check('ownership', 'ownership is required').notEmpty();
    req.check('estabYear', 'Establishment Year is missing').notEmpty();
    req.check('schoolCat', 'School Category is required').notEmpty();
    req.check('schoolType', 'School Type is required').notEmpty();
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