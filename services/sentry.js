const Sentry = require('@sentry/node');

if(!process.env.SENTRY_DSN) {
    throw new Error('Missing SENTRY_DSN environment var');
}

Sentry.init({ dsn: process.env.SENTRY_DSN });

const configureNoUserScope = () => {
    try {
        // Set user information, as well as tags and further extras
        Sentry.configureScope(scope => {
            scope.setTag('NODE_ENV', process.env.NODE_ENV);
        });
    } catch (err) {
        console.error('SENTRY ERROR configure scope!', err);
    }
};

const configureUserScope = (user) => {
    try {
        // Set user information, as well as tags and further extras
        Sentry.configureScope(scope => {
            scope.setTag('NODE_ENV', process.env.NODE_ENV);
            scope.setTag('user_mode', 'user');
            if(user && user.id) {
                scope.setUser({ id: user.id});
            }
        });
    } catch (err) {
        console.error('SENTRY ERROR configure scope!', err);
    }
};

const clearScope = () => {
    try {
        Sentry.configureScope(scope => {
            scope.clear();
        });
    } catch (err) {
        console.error('SENTRY ERROR clear scope!', err);
    }
};

module.exports = {
    Sentry,
    configureUserScope,
    configureNoUserScope,
    clearScope
};