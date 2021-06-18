exports.adminCreator = (req, res, next) => {
    req.check('firstName', 'first Name is required').notEmpty();
    req.check('lastName', 'last Name is required').notEmpty();
    req.check('middleName', 'middle Name is required').notEmpty();
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

exports.districtCreator = (req, res, next) => {
    req.check('code', 'District Code is required').notEmpty();
    req.check('names', 'District Name is required').notEmpty();
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
    //req.check('contact.fax', 'valid school fax number is required').notEmpty();
    //req.check('contact.mailBox', 'Mailing Address is missing').notEmpty();
    //minimum phone digit in fiji is 7
     //req.check('contact.phone','enter a phone number').notEmpty();
     //req.check('contact.phone')
     //   .isLength({min:7}).withMessage('phone number must be valid')
    //    .matches(/\d/).withMessage('phone number must be a plain number');
    //req.check('contact.province', 'province is required').notEmpty();

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

        //minimum phone digit in fiji is 7

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.studentCreator = (req, res, next) => {
    req.check('studentCode', 'valid student code is required').notEmpty();
    req.check('school', 'schoolis required').notEmpty();
    //req.check('parent', 'parent is required').notEmpty();
    //req.check('exam', 'exam is required').notEmpty();
    //req.check('result', 'result is required').notEmpty();
    //req.check('class', 'class is required').notEmpty();
    //req.check('history', 'history is required').notEmpty();
    req.check('firstName', 'First Name is required').notEmpty();
    req.check('middleName', 'Middle Name is required').notEmpty();
    req.check('lastName', 'Last Name is required').notEmpty();
    req.check('religion', 'Religion is required').notEmpty();
    req.check('gender', 'Gender is required').notEmpty();
    req.check('dob', 'Date of Birth is required').notEmpty();
    req.check('country', 'Country is required').notEmpty();
    req.check('ethnicity', 'Ethnicity is required').notEmpty();
    req.check('province', 'Province is required').notEmpty();
    req.check('address', 'Address is required').notEmpty();
    req.check('presentClass', 'Present Class is required').notEmpty();
    req.check('HadEce', 'Had ECE is required').notEmpty();
    req.check('status', 'Status is required').notEmpty();
    req.check('session', 'Session is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();

};

exports.sessionCreator = (req, res, next) => {
    req.check('name', 'Session name is required').notEmpty();
    req.check('slung', 'Session slongan is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

