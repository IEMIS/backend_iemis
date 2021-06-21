exports.sessionValidator = (req, res, next) => {
    req.check('name', 'session name is required').notEmpty();
    req.check('slung', 'slung is required').notEmpty();
    
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};