exports.parentCreator = (req, res, next) => {
    req.check('father.address', 'address is required').notEmpty();
req.check('father.email', 'valid email address required')
        .matches(/.+\@.+\..+/)
        .withMessage('valid email address required')
        .isLength({
            min: 4,
            max: 32
        });
    const errors = req.validationErrors();
        if (errors) {
            const firstError = errors.map(error => error.msg)[0];
            return res.status(400).json({ error: firstError });
        }
        next();
    };
    