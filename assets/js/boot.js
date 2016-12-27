var storage = new Storage();
var movies = null;
var postersFolder = "data/posters/";

$(window).load(function() {
	$("#error-storage").remove();
	$(".unused").remove();
	start();
});

function start()
{
	var me = this;
	var $contact_template = $('#contacts .data-list').clone();
	$('#contacts .data-list').remove();

	me.readFromCSV = function(callback)
	{
		var dataPath = "data/movies.csv";
		var jqxhr = $.get(dataPath, function(r) {
			var data = $.csv.toArrays(r);
			delete data[0];
			movies.autoIndex = data.length;
			movies.data = data;
		})
		.always(function() {
			if (typeof callback == 'function') {
				callback();
			}
		});
	}

	me.displayContacts = function()
	{
		for (var i in movies.getSortedData()) {
			var c = movies.get(i);
			$c = $contact_template.clone();
			$c.find('.title').html(c.Title);

			if(isMobile.any()) {
				$("#movie-detail").hide();
			}
			else {
				$c.find('.data-entry').removeClass("ui-btn-icon-right ui-icon-carat-r");

				if($("#movie-detail .poster img").attr("src") == "") {
					$("#movie-detail .poster img").attr("src", postersFolder + c.Poster);
					$("#movie-detail .info .title").html(c.Title);
					$("#movie-detail .info .genres").html(c.Genres);
				}
			}

			$('#contacts').append($c);

			delete c;
		}

		filtered_ids = movies.find('');
	}

	me.setDetailInformation = function(movie)
	{
		$("#movie-detail .info .title").html(movie.Title);
		$("#movie-detail .info .genres").html(movie.Genres);
		$("#movie-detail .poster img").attr("src", postersFolder + movie.Poster).load(function(){
			$("#movie-detail").css("margin-left", "0px");
		});
	}

	var last_filter = '';
	var filtered_ids = null;
	var filtered_index = 0;
	me.onFilter = function(event)
	{
		if (event.keyCode == 27 || event.which == 27) {
			$(this).val('');
		}
		else
		{
			if(isMobile.any()) {
				$("#detail_back").hide();
				$("#movie-detail").hide();
				$("#movies-list").show();
			}

			var filter = $(this).val();
			if (filter == last_filter) {
				return;
			}
			last_filter = filter;

			filtered_ids = movies.find(filter);
			filtered_index = 0;
			$(".data-list").hide();
			for (var i in filtered_ids) {
				var id = filtered_ids[i];
				$(".data-list").eq(id).show();
			}
		}
	}

	me.findIndexOf = function(id)
	{
		for (var i in filtered_ids) {
			if (filtered_ids[i] == id) {
				return i;
			}
		}
	}

	me.onDetail = function()
	{
		id = $(".data-list a").index(this);
		filtered_index = me.findIndexOf(id);
		var c = movies.get(id);
		me.setDetailInformation(c);

		if(isMobile.any()) {
			$("#movies-list").animate({"margin-right": "1600px"}, 800, function(){
				$("#movies-list").hide();
				$("#movies-list").css("margin-right", "0px");
				$("#detail_back").show();
				$("#movie-detail").show();
			});
		}
	}

	me.onNextDetail = function()
	{
		var max = filtered_ids.length;
		if (filtered_index < max - 1) {
			$(this).animate({"margin-left": "1600px"}, 400, function(){
				var c = movies.get(filtered_ids[++filtered_index]);
				me.setDetailInformation(c);
			});
		}
	}

	me.onPreviousDetail = function()
	{
		if (filtered_index > 0) {
			$(this).animate({"margin-left": "-1600px"}, 400, function(){
				var c = movies.get(filtered_ids[--filtered_index]);
				me.setDetailInformation(c);
			});
		}
	}

	me.init = function()
	{
		movies = new Movies(storage);
		me.readFromCSV(me.displayContacts);

		$("#filter").val('');
		$("#filter").bind('keyup change', me.onFilter);

		$(document).keyup(me.slide);

		$("body").on("click", ".data-entry", me.onDetail);
		$("#left").on("click", me.onPreviousDetail);
		$("#right").on("click", me.onNextDetail);

		$("#movie-detail").on('swipeleft', me.onPreviousDetail);
		$("#movie-detail").on('swiperight', me.onNextDetail);

		$("#detail_back").click(me.backToList);

		var contentHeight = $(window).height() - 102;
		$("body .main-content").css("height", contentHeight + "px");
	}

	me.slide = function(event)
	{
		if (!me.isOnDetailPage()) {
			return;
		}

		if (event.keyCode == 37 || event.which == 37) {
			me.onPreviousDetail();
		} else if (event.keyCode == 39 || event.which == 39) {
			me.onNextDetail();
		} else if (event.keyCode == 27 || event.which == 27) {
			me.backToList();
		}
		return false;
	}

	me.backToList = function()
	{
		$("#movie-detail").animate({"margin-left": "1600px"}, 600, function(){
			$("#movie-detail").hide();
			$("#movie-detail").css("margin-left", "0px");
			$("#detail_back").hide();
			$("#movies-list").show();
		});
	}

	me.isOnDetailPage = function()
	{
		return $("#movie-detail").is(':visible');
	}

	me.init();
}
