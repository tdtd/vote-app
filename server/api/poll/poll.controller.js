'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');

// Get list of polls
exports.index = function(req, res) {
  Poll.loadRecent(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.json(200, polls);
  });
};
// Get a single poll
exports.show = function(req, res) {
  Poll.loadSingle(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
		
    return res.status(200).json(poll);
  });
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  // don't include the date, if a user specified it
  delete req.body.date;
 
  var poll = new Poll(_.merge({ author: req.user._id }, req.body));
  poll.save(function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.json(201, poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {

	console.log('UPDATING');
  if(req.body._id) { delete req.body._id; }
  Poll.loadSingle(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found');}
    var updated = _.merge(poll, req.body);
		poll.markModified('voters');
		poll.markModified('content');
    updated.save(function (err) {
      if (err) {return handleError(res, err); } else {
      return res.status(200).json(poll); }
    });
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}