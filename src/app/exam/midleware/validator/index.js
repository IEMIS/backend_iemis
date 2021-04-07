exports.examValidator = (req, res, next) => {
    req.check('subject', 'subject id is required').notEmpty();
    req.check('student', 'student id is required').notEmpty();
    
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};