const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

function print(path, layer) {
    if (layer.route) {
        layer.route.stack.forEach(print.bind(null, path + layer.route.path));
    } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(null, path + (layer.regexp.source.replace('\\/?(?=\\/|$)', '').replace('^\\/', ''))));
    } else if (layer.method) {
        console.log('%s /%s', layer.method.toUpperCase(), path.replace(/\\/g, '/'));
    }
}

app._router.stack.forEach(print.bind(null, ''));
