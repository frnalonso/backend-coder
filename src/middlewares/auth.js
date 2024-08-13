import { validateToken } from '../utils.js'
export function auth(req,res,next) {
    if(!req.session || !req.session.user) {
        return res.redirect('/api/views/login')
    }
    next()
}


export const authenticateJWT = (req, res, next) => {
    const token = req.cookies.KeyFrancisco || req.headers.authorization?.split(' ')[1]; 
    console.log(token)
    console.log("finDelTokokok")
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: No se proporcionó un token.' });
    }

    const decoded = validateToken(token);
    console.log(decoded)
    console.log(decoded.userId)
    console.log(decoded.role)

    if (decoded) {
        req.user = { userId: decoded.id, role: decoded.role }; //Decodifica el token y añade el userId a req.user
        next();
    } else {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

// Middleware de autenticación para admin
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        console.log(req.user)
        console.log(req.user.role)
        return res.status(403).json({ message: 'Acceso no autorizado. Solo administradores.' });
    }
};

// Middleware de autenticación para usuarios premium
export const isPremium = (req, res, next) => {
    if (req.user && req.user.role === 'premium') {
        return next();
    } else {
        return res.status(403).json({ message: 'Acceso no autorizado. Solo usuarios premium.' });
    }
};

// Middleware de autenticación para user
export const isUser = (req, res, next) => {
    if(req.user && req.user.role === 'user') {
        next();
    } 
    else {
        return res.status(403).json({ error: 'Acceso no autorizado. Solo usuarios.' });
    }
}

export const isUserOrPremium = (req, res, next) => {
    if(req.user && req.user.role === 'user' || req.user.role === 'premium') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado. Tiene que ser user o premium' });
    }
}

export const isPremiumOrAdmin = (req, res, next) => {
    console.log(req.user)
    if(req.user && req.user.role === 'premium' || req.user.role === 'admin') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado. Tiene que ser premium o admin' });
    }
}

export const isAll = (req, res, next) => {
    if(req.user && req.user.role === 'admin' || req.user.role === 'premium' || req.user.role === 'user') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}