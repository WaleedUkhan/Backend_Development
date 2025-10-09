// Authentication middleware
exports.isAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

// Admin middleware
exports.isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).render('error', { 
            message: 'Access Denied: Admin privileges required' 
        });
    }
    next();
};

// Manager middleware
exports.isManager = (req, res, next) => {
    if (!req.session.user || (req.session.user.role !== 'manager' && req.session.user.role !== 'admin')) {
        return res.status(403).render('error', { 
            message: 'Access Denied: Manager or Admin privileges required' 
        });
    }
    next();
};
