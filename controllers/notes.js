const Note = require('../models/Note'),
	makeDate = require('../scripts/date');



module.exports = {
	get: (data, cb) => {
		Note.find({_headlineId: data._id}, cb);
	},
	save: (data, cb) => {
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
				Note.collection.insert(newNote, {ordered: false}, (err, docs) => { cb(err, docs) })
				// cb(doc);
			}
		});
	},
	delete: (data, cb) => {
		Note.remove({_id: data._id}, cb);
	}
}
