'use strict';
 
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
 
var PollSchema = new Schema({
  content: Object,
	title: Object,
	voters: Array,
  date: { type: Date, default: Date.now },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
 
PollSchema.statics = {
  loadRecent: function(cb) {
    this.find({})
      .populate({path:'author', select: 'name'})
      .sort('-date')
      .limit(20)
      .exec(cb);
  },
	loadSingle: function(param, cb) {
    this.findById(param)
			.populate({path:'author', select: 'name'})
			.exec(cb);	
  }
};
 
module.exports = mongoose.model('Poll', PollSchema);
