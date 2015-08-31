/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Poll = require('./poll.model');

exports.register = function(socket) {
  Poll.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Poll.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  Poll.populate(doc, {path:'author', select: 'name'}, function(err, poll) {
    socket.emit('poll:save', poll);
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('poll:remove', doc);
}