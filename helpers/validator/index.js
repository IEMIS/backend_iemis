const { body,check, validationResult } = require('express-validator');

exports.adminSignUpValidator = (req, res, next) => {
    req.check('firstName', 'First Name is required').notEmpty();
    req.check('middleName', 'moddle Name is required').notEmpty();
    req.check('lastName', 'last Name is required').notEmpty();
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
    //const errors = req.validationResult(req)
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};