const hRoutes = require('./route/hRoutes');
const express = require('express');
const app = express();

const apiRoutes = require('./route/apiRoutes');
const PORT = process.env.PORT || 3003;


app.use(express.static("public"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/', hRoutes);


app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`);
});

module.exports = app;