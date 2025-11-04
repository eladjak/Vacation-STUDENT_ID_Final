"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    const status = err.status || 500;
    const message = err.message || 'שגיאת שרת פנימית';
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
            status: 'error',
            message: 'הערך כבר קיים במערכת'
        });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'נתונים לא תקינים',
            errors: err.message
        });
    }
    if (err.name === 'MulterError') {
        return res.status(400).json({
            status: 'error',
            message: 'שגיאה בהעלאת הקובץ'
        });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            message: 'טוקן לא תקין'
        });
    }
    if (err.name === 'QueryFailedError') {
        return res.status(400).json({
            status: 'error',
            message: 'שגיאה ששאילתת מסד הנתונים'
        });
    }
    res.status(status).json({
        status: 'error',
        message
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map