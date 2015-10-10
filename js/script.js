// Searchbar Handler
$(function(){
	var searchField = $('#query');
	var icon = $('#search-btn');
	
	// Focus Event Handler
	$(searchField).on('focus', function(){
		$(this).animate({
			width:'100%'
		},400);
		$(icon).animate({
			right: '10px'
		}, 400);
	});
	
	// Blur Event Handler
	$(searchField).on('blur', function(){
		if(searchField.val() == ''){
			$(searchField).animate({
				width:'45%'
			},400, function(){});
			$(icon).animate({
				right:'360px'
			},400, function(){});
		}
	});
	
	$('#search-form').submit(function(e){
		e.preventDefault();
	});
})

var firstPage;

function search(){
	// Clear Results
	$('#results').html('');
	$('#buttons').html('');
	
	// Get Form Input
	q = $('#query').val();
	// Run GET Request on API
	$.get(
		"https://www.reddit.com/search.json",{
		q: q},
		function(data){

			firstPage = data.data.children[0].data.name;

			var nextPage = data.data.after;
			var prevPage = data.data.before;

			console.log(data);

			$.each(data.data.children, function(i, item){
				// Get Output
				var output = getOutput(item);

				// Display Results
				$('#results').append(output);
			});

			var buttons = getButtons(prevPage, nextPage);
				
			// Display Buttons
			$('#buttons').append(buttons);
		}
	);
}

// Build Output
function getOutput(item){
	// console.log(item);
	var url = item.data.url;
	var title = item.data.title;
	var thumbnail = imageExist(item.data.thumbnail);
	var created = new Date(item.data.created);
	var num_comments = item.data.num_comments;
	// console.log(thumbnail);


	// Build Output String
	var output = '<li>' +
	'<div class="list-left">' +
	'<a href="'+url+'" target="_blank"><img src="'+thumbnail+'"></a>' +
	'</div>' +
	'<div class="list-right">' +
	'<h3><a href="'+url+'" target="_blank">'+title+'</a></h3>' +
	'<small>Created on '+created+'</small></br>'+
	'<small><strong>'+num_comments+' Comments</strong></small>'+
	'</div>' +
	'</li>' +
	'<div class="clearfix"></div>' +
	'';
	return output;
}

// Add default image if none exists
function imageExist(image) {
	if(new RegExp("[a-zA-Z0-9]+://([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(image)) {
	  return image;
	} else {
		return 'img/redditLogo.png'
	}
}

// Next Page Function
function nextPage(){
	var next_token = $('#next-button').data('token');
	var q = $('#next-button').data('query');

	// Clear Results
	$('#results').html('');
	$('#buttons').html('');
	
	// Get Form Input
	q = $('#query').val();
	
	// Run GET Request on API
	$.get(
		"https://www.reddit.com/search.json",{
		q: q,
		after: next_token,
		count: 25},
		function(data){
			var nextPage = data.data.after;
			var prevPage = data.data.before;

			console.log(data);

			$.each(data.data.children, function(i, item){
				// Get Output
				var output = getOutput(item);

				// Display Results
				$('#results').append(output);
			});

			var buttons = getButtons(prevPage, nextPage);
				
			// Display Buttons
			$('#buttons').append(buttons);
		}
	);
}

// Prev Page Function
function prevPage(){
	var prev_token = $('#prev-button').data('token');
	var q = $('#prev-button').data('query');

	// Clear Results
	$('#results').html('');
	$('#buttons').html('');
	
	// Get Form Input
	q = $('#query').val();
	
	// Run GET Request on API
	$.get(
		"https://www.reddit.com/search.json",{
		q: q,
		before: prev_token,
		count: 25},
		function(data){
			var nextPage = data.data.after;
			var prevPage = data.data.children[0].data.name;
	
			console.log(data);

			$.each(data.data.children, function(i, item){
				// Get Output
				var output = getOutput(item);

				// Display Results
				$('#results').append(output);
			});

			var buttons = getButtons(prevPage, nextPage);
				
			// Display Buttons
			$('#buttons').append(buttons);
		}
	);
}

// Build the buttons
function getButtons(prevPage, nextPage){
	if(!prevPage || prevPage == firstPage){
		var btnoutput = '<div class="button-container">'+'<button id="next-button" class="paging-button" data-token="'+nextPage+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	} 
	else {
		var btnoutput = '<div class="button-container">'+
		'<button id="prev-button" class="paging-button" data-token="'+prevPage+'" data-query="'+q+'"' +
		'onclick="prevPage();">Prev Page</button>' +
		'<button id="next-button" class="paging-button" data-token="'+nextPage+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	}
	
	return btnoutput;
}

