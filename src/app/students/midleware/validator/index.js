exports.studentCreator = (req, res, next) => {
    req.check('studentcode', 'valid student code is required').notEmpty();
    req.check('school', 'schoolis required').notEmpty();
    req.check('parent', 'parent is required').notEmpty();
    req.check('exam', 'exam is required').notEmpty();
    req.check('result', 'result is required').notEmpty();
    req.check('class', 'class is required').notEmpty();
    req.check('history', 'history is required').notEmpty();
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