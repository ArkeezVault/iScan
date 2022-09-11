module.exports.UserException = function (code, message) {
  this.code = code;
  this.message = message;
  this.results = null;
};
