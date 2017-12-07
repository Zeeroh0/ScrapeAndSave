const Note = require('../models/Note'),
	makeDate = require('../scripts/date');



module.exports = {
	get: (data, cb) => {
		Note.find({_headlineId: data._id}, cb);
	},
	save: (data, cb) => {
		console.log('new note data', data);
		let newNote = {
			_headlineId: data._id,
			date: makeDate(),
			noteText: data.noteText
		};

		Note.create(newNote, (err, doc) => {
			if (err) {
				console.log(err);
			} else {
				console.log(doc);
				cb(doc);
			}
		});
	},
	delete: (data, cb) => {
		Note.remove({_id: data._id}, cb);
	}
}
