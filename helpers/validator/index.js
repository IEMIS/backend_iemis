const {check, validationResult } = require('express-validator');
//const { check, validationResult } = require('express-validator');

exports.adminSignUpValidator = (req, res, next) => {
 /*
    check('firstName', 'First Name is required').notEmpty();
    check('middleName', 'moddle Name is required').notEmpty();
    check('lastName', 'last Name is required').notEmpty();
    
    check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
        */
    //check('email', 'Email must be between 3 to 32 characters').isEmail();
    //check('password', 'Password is required').notEmpty();
    /*
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');
        */
    //const errors = req.validationErrors();
    console.log(req.body)
    console.log("access validator middle ware")
    /*
    const errors = validationResult(req)
    console.log({errors})
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(409).json({ error: firstError });
    }
    */
    next();
};