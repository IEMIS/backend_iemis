exports.subjectValidator = (req, res, next) => {
    req.check('subject_code', 'Subject code is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};