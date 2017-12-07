const scrape = require('../scripts/scrape'),
	headlinesController = require('../controllers/headlines'),
	notesController = require('../controllers/notes');



module.exports = (router) => {
	router.get('/', (req, res) => {
		res.render('home');
	});

	router.get('/saved', (req, res) => {
		res.render('saved');
	});

	router.get('/api/fetch', (req, res) => {
		headlinesController.fetch((err, docs) => {
			if (!docs || docs.insertedCount === 0) {
				res.json({
					message: "No new articles today. Check back tomorrow!"
				});
			} else {
				res.json({
					message: `Added ${docs.insertedCount} new articles!`
				});
			}
		});
	});

	router.get('/api/headlines', (req, res) => {
		let query = {};
		if (req.query.saved) {
			query = req.query
		} 

		headlinesController.get(query, (data) => {
			res.json(data);
		});
	});

	router.delete('/api/headlines/:id', (req, res) => {
		let query = {};
		query._id = req.params.id;

		headlinesController.delete(query, (err, data) => {
			res.json(data);
		});
	});

	router.patch('/api/headlines', (req, res) => {
		headlinesController.update(req.body, (err, data) => {
			res.json(data);
		});
	});

	router.get('/api/notes/:headline_id?', (req, res) => {
		let query = {};
		if (req.params.headline_id) {
			query._id = req.params.headline_id;
		}

		notesController.get(query, (err, data) => {
			res.json(data);
		});
	});

	router.delete('/api/notes/:_id', (req, res) => {
		let query = {};
		query._id = req.params._id;

		notesController.delete(query, (err, data) => {
			res.json(data);
		});
	});

	router.post('/api/notes', (req, res) => {
		notesController.save(req.body, (err, data) => {
			res.json(data);
		});
	});
}
