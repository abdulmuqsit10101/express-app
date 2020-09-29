const log = function(req, res, next){
    console.log('Loggin!');
    next();
}

module.exports = log;
