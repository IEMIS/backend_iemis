exports.teacherCreator = (req, res, next) => {
    req.check('teachercode', 'valid teacher code is required').notEmpty();
    req.check('school', 'school is required').notEmpty();
    req.check('firstName', 'First Name is required').notEmpty();
    req.check('middleName', 'Middle Name is required').notEmpty();
    req.check('lastName', 'Last Name is required').notEmpty();
    req.check('title', 'tittle is required').notEmpty();
    req.check('gender', 'Gender is required').notEmpty();
    req.check('dob', 'Date of Birth is required').notEmpty();
    req.check('nationality', 'Country is required').notEmpty();
    req.check('qualification', 'teacher qualification is required').notEmpty();
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
    req.check('subjectSpecialisation', 'Subject specialisation is required').notEmpty();
    req.check('typeOfstaff', 'Staff type is required').notEmpty();
    req.check('firstappt', 'Date of first appointment is required').notEmpty();
    req.check('lastPosting', 'Last Post Date is required').notEmpty();
    req.check('gradeLevel', 'Grade Level is required').notEmpty();
    req.check('designation', 'Designation is required').notEmpty();
    req.check('serviceStatus', 'Service Status is required').notEmpty();
    req.check('teachingPeriodWK', 'Teaching Period per Week is required').notEmpty();
    req.check('session', 'Special duty is required').notEmpty();
    req.check('engagement', 'Special duty is required').notEmpty();
    req.check('session', 'session is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();

};