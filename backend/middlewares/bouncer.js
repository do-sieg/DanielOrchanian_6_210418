// A simple and standalone middleware for express routes which attempts to mitigate brute-force attacks.
// It works by increasing the delay with each failed request using a Fibonacci formula.
const MIN_WAIT_TIME_SEC = 15 * 60;
const MAX_WAIT_TIME_SEC = 24 * 60 * 60;
export const bouncer = require("express-bouncer")(MIN_WAIT_TIME_SEC * 1000, MAX_WAIT_TIME_SEC * 1000);

bouncer.blocked = function (req, res, next, remaining) {
    res.send(429, "Too many requests have been made, please wait " + remaining / 1000 + " seconds");
};