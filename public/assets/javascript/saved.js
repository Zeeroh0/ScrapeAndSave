$(document).ready(() => {

	// Store common jQuery selector in var to be used 
	let articleContainer = $('.article-container');

	// Event listeners
	$(document).on('click', '.btn.delete', handleArticleDelete);
	$(document).on('click', '.btn.notes', handleArticleNotes);
	$(document).on('click', '.btn.save', handleNoteSave);
	$(document).on('click', '.btn.note-delete', handleNoteDelete);

	// Load articles onto page
	initPage();

	function initPage() {
		articleContainer.empty();
		$.get('/api/headlines?saved=true')
			.then((data) => {
				if (data && data.length) {
					renderArticles(data);
				} else {
					renderEmpty();
				}
			});
	};

	function renderArticles(articles) {
		let articlePanels = [];

		for (let i = 0; i < articles.length; i++) {
			articlePanels.push(createPanel(articles[i]));
		}

		articleContainer.append(articlePanels);
	};

	// Creates the panel for each article
	function createPanel(article) {
		let panel = 
			$(['<div class="panel panel-default">',
					'<div class="panel-heading">',
						'<h3>',
							article.headline,
							'<a class="btn btn-success save">Save Article</a>',
						'</h3>',
					'</div>',
					'<div class-"panel-body">',
						article.summary,
					'</div>',
				'</div'
				].join(""));

		panel.data('_id', article._id);
		return panel
	};

	// This shows if there are no articles in the database
	function renderEmpty() {
		let emptyAlert = 
		$(['<div class="alert alert-warning text-center">',
					"<h4>Uh Oh.  Looks like we don't have any saved articles.</h4>",
				'</div>',
				'<div class="panel panel-default">',
					'<div class="panel panel-heading text-center">',
						'<h3>Would you like to browse available articles?</h3>',
					'</div>',
					'<div class="panel-body text-center">',
						'<h4><a href="/>Browse Articles</a></h4>',
					'</div>',
				'</div>'
			].join(""));

			articleContainer.append(emptyAlert);	
	};

	// Delete the article that was clicked for deletion by its _id
	function handleArticleDelete() {
		let articleToDelete = $(this).parents('.panel').data();

		$.ajax({
			method: 'DELTE',
			url: '/api/headlines' + articleToDelete._id
		})
			.then((data) => {
				if (data.ok) {
					initPage();
				}
			});
	};

	function handleArticleNotes() {
		let currentArticle = $(this).parents('.panel').data();

		$.get('/api/notes'+currentArticle._id)
			.then((data) => {
				let modalText = [
					'<div class="container-fluid text-center">',
						'<h4>Notes for Article: ',
						currentArticle._id,
						'</h4>',
						'<hr />',
						'<ul class="list-group note-container">',
						'</ul>',
						'<textarea placeholder="New Note" rows="4" cols="60"></textarea>',
						'<button class="btn btn-success save">Save Note</button>',
					'</div>'
				].join("");

				bootbox.dialog({
					message: modalText,
					closeButton: true
				});

				let noteData = {
					_id: currentArticle._id,
					notes: data || []
				};

				$('.btn.save').data('article', noteData);

				renderNotesList(noteData);
			});
	};

	function renderNotesList(data) {
		let notesToRender = [];
		let currentNote;
		if (!data.notes.length) {
			currentNote = [
				'<li class="list-group-item">',
				'No notes for this article yet.',
				'</li>'
			].join('');
			notesToRender.push(currentNote);
		} else {
			for (let i = 0; i < data.notes.length; i++) {
				currentNote = $([
					'<li class="list-group-item note">',
						data.notes[i].noteText,
						'<button class="btn btn-danger note-delete">x</button>',
					'</li>'
				].join(""));

				currentNote.children('button').data('_id', data.notes[i]._id);

				notesToRender.push(currentNote);
			}
		}
	};

	function handleNoteSave() {
		let noteData;
		let newNOte = $('.bootbox-body textarea').val().trim();

		if (newNote) {
			noteData = {
				_id: $(this).data('article')._id,
				noteText: newNote
			};

			$.post('/api/notes', noteData)
				.then(() => {
					bootbox.hideAll();
				});
		}
	};

	function handleNoteDelete() {
		let noteToDelete = $(this).data('_id');

		$.ajax({
			url: '/api/notes/'+noteToDelete,
			method: 'DELETE'
		}).then(() => {
			bootbox.hideAll();
		});
	};


});
