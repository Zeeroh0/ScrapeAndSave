const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
	noteText: {
		type: String
	},
	date: {
		type: String
	},
	_headlineId: {
		type: Schema.Types.ObjectId,
		ref: 'Headline'
	},
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
