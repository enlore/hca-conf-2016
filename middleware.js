module.exports = {
    setFirst: setFirst,
    setSecond: setSecond,
    setBanana: setBanana
}

function setFirst (req, res, next) {
    res.setHeader("x-first", Date.now());
    next();
}

function setSecond (req, res, next) {
    setTimeout(() => {
        res.setHeader("x-second", Date.now());
        next();
    }, 200);
}

function setBanana (req, res, next) {
    res.setHeader("x-bananas", "this is");
    next();
}
