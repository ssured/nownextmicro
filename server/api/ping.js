const { send } = require('micro');

// respond to specific methods by exposing their verbs
module.exports.GET = async function(req, res) {
  // fs-router decorates your req object with param and query hashes
  send(res, 200, { /*params: req.params,*/ query: req.query });
};
