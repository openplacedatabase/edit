var path = require('path'),
    express = require('express'),
    app = express();

app.use(express.static(path.join(__dirname, '/assets')));

app.listen(8081);
console.log('listening on port 8081');