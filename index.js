var config = require('config');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var moment = require('moment-timezone');
var send = require('send');
var resolve = require('path').resolve;

var accessLogFormat = '[:date] ":method :url" :status :res[content-length] :response-time :req[x-forwarded-for] :remote-addr';

// custom timestamp format for request logs
morgan.token('date', function () {
    return moment().tz("America/Los_Angeles").format('YYYY-MM-DDTHH:mm:ss.SSSZ');
});

var app = express();

app.use(morgan(accessLogFormat));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// specify static content directly
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/styles', express.static(__dirname + '/public/styles'));

// fix for safari 304 blank page bug
app.use(function(req, res, next) {
    var agent = req.headers['user-agent'];
    if (agent.indexOf('Safari') > -1 && agent.indexOf('Chrome') == -1 && agent.indexOf('OPR') == -1) {
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
        });
    }
    next();
});

var htmlRoot = resolve(__dirname + '/public/html');

app.route('/').get(function(req, res) {
    var opts = {root: htmlRoot};
    var stream = send(req, 'index.html', opts);
    stream.pipe(res);
});

app.use(function(req, res) {
    res.redirect('/');
});

app.listen(config.port, function () {
    console.log('app: running on port ' + config.port);
});
