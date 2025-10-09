const express = require('express');
const router = express.Router();
const { isAuth, isAdmin, isManager } = require('../middleware/auth');


router.get('/', isAuth, (req, res) => {
    res.redirect(`/dashboard/${req.session.user.role}`);
});


router.get('/user', isAuth, (req, res) => {
    if (req.session.user.role !== 'user') {
        return res.redirect(`/dashboard/${req.session.user.role}`);
    }
    res.render('dashboard/user', { 
        title: 'User Dashboard',
        user: req.session.user
    });
});


router.get('/manager', [isAuth, isManager], (req, res) => {
    res.render('dashboard/manager', { 
        title: 'Manager Dashboard',
        user: req.session.user
    });
});


router.get('/admin', [isAuth, isAdmin], (req, res) => {
    res.render('dashboard/admin', { 
        title: 'Admin Dashboard',
        user: req.session.user
    });
});


router.get('/:role', isAuth, (req, res) => {
    const { role } = req.params;
    const userRole = req.session.user.role;
    
    
    if (role === 'admin' && userRole === 'admin') {
        return res.redirect('/dashboard/admin');
    } else if (role === 'manager' && (userRole === 'manager' || userRole === 'admin')) {
        return res.redirect('/dashboard/manager');
    } else if (role === 'user') {
        return res.redirect('/dashboard/user');
    }
    
    // If role doesn't match or is invalid, redirect to appropriate dashboard
    res.redirect(`/dashboard/${userRole}`);
});

module.exports = router;
