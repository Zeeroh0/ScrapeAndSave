$(document).ready(()=>{
	
	// Store common jQuery selector in var to be used 
	let articleContainer = $('.article-container');
	
	// Event listeners
	$(document).on('click', '.btn.save', handleArticleSave);
	$(document).on('click', '.scrape-new', handleArticleScrape);

	// Load page
	initPage();

	function initPage () {
		articleContainer.empty();
		// This url will show any non-saved articles
		$.get('api/headlines?saved=false')
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
							'<a href="'+article.url+'" class="article-link">',
								article.headline,
							'</a>',
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
					"<h4>Uh Oh.  Looks like we don't have any new articles.</h4>",
				'</div>',
				'<div class="panel panel-default">',
					'<div class="panel panel-heading text-center">',
						'<h3>What would you like to do?</h3>',
					'</div>',
					'<div class="panel-body text-center">',
						'<h4><a class="scrape-new">Try Scraping New Articles</a></h4>',
						'<h4><a href="/saved">Go to Saved Articles</a></h4>',
					'</div>',
				'</div>'
			].join(""));

			articleContainer.append(emptyAlert);	
	};

	// Saving articles updates the DB for that article and reloads the non-saved articles on the page
	function handleArticleSave() {
		let articleToSave = $(this).parents('.panel').data();
		articleToSave.save = true;

		$.ajax({
			method: 'PATCH',
			url: '/api/headlines',
			data: articleToSave
		})
			.then((data) => {
				if (data.ok) {
					initPage();
				}
			});
	};

	// This scrapes for new articles, re-renders the articles on the site, and alerts w how many articles were scraped
	function handleArticleScrape() {
		$.get('/api/fetch')
			.then((data) => {
				initPage();
				bootbox.alert('<h3 class="text-center m-top-80">'+data.message+'<h3>');
			});
	};

});
