var fuse;
var nextQuery = null;
var processing = false;
var currentQuery = null;
var DEBUG = false;
var searchQuery = '';
var pageURL = $(location).attr('href');

var addItem = function(item) {
  item = item.toLowerCase();
  var searchbase = localStorage.getItem('searched');
  if (searchbase) {
    searchbase = searchbase.replace(',' + item + ',', ',');
    searchbase = ',' + item + searchbase;
    localStorage.setItem('searched', searchbase);
  } else {
    localStorage.setItem('searched', ',' + item + ',');
  }

  $("ul.local-storage-list > li > a:contains('" + item + "')").each(function() {
    if ($(this).text() === item) {
      $(this).parent().remove();
    }
  });
  $('ul.local-storage-list').prepend(
    "<li><a href='' style='text-align: center'>" + item + '</a><br></li>'
  );
};

$(function() {
  $('#query').focus();

  // populate the left side localStorage list
  // if the localStorage exists, else hide div
  if (localStorage.getItem('searched')) {
    var history = localStorage.getItem('searched');
    $.each(history.split(','), function(index, item) {
      if (item != '') {
        $('ul.local-storage-list').append(
          "<li><a href='' style='text-align: center'>" + item + '</a><br></li>'
        );
      }
    });
    $('ul.local-storage-list').append('<br/><br/>');
  }

  var worker = new Worker('resources/scripts/worker2.js');
  $.getJSON('data/data.json')
    .success(function(json) {
      worker.postMessage({ type: 'data', data: json });
      var search_query = $.url('?') && $.url('?').search;
      if (search_query) {
        while (search_query[search_query.length - 1] == '/') {
          search_query = search_query.slice(0, -1);
        }
        $('#query').val(search_query);
        search();
      }
    })
    .error(function(jqxhr, status, err) {
      if (DEBUG) console.log(jqxhr, status, err);
    });

  $('ul.local-storage-list li a').click(function(e) {
    $('#query').val($(this).text());
    search();
    e.preventDefault();
  });

  worker.onmessage = function(results) {
    processing = false;
    displayResults(results.data);
    if (nextQuery !== null) {
      var query = nextQuery;
      nextQuery = null;
      search(query);
    }
  };

  function displayResults(results) {
    var html = '';
    for (var i = 0; i < 20; ++i) {
      html +=
        '<li><a target="_blank" class="result-link" href="' +
        results[i].Link +
        '"> <div class="info">' +
        results[i].Year +
        ' &#8226; ' +
        results[i].Department +
        ' &#8226; ' +
        results[i].Semester +
        ' </div> <h1>' +
        results[i].Paper +
        '</h1></a><li>';
    }
    $('.result-list').html(html);
    /**
     * Bind a handler to a click on the result link to save the search in local storage
     *
     * Sample result HTML:
     * <a class="result-link">
     *    <div> ... </div>
     *    <h1> ... </h1>
     * </a>
     */
    $("a.result-link").click(function(e) {
      var query = $('#query').val().trim();
      addItem(query);
      $('div.local-storage-div').show();
      ga('send', 'event', 'Result', 'click', query);
    });
  }

  var search = _.debounce(function() {
    $('.ratings').addClass('hidden');
    $('.mobile-view').addClass('hidden');
    var query = $('#query')
      .val()
      .trim();
    if (query === '') {
      $('.result-list').html('');
      $('.ratings').removeClass('hidden');
      $('.mobile-view').removeClass('hidden');
      return;
    }
    if (processing) {
      nextQuery = query;
      return;
    }
    if (query === currentQuery) {
      return;
    }
    processing = true;
    currentQuery = query;
    worker.postMessage({ type: 'query', query: query });
    ga('send', 'event', 'Search', 'query', query);
  }, 200);

  $('#query').keydown(search);

  // function to update the query url
  $('#query').keyup(function() {
    searchQuery = $('#query')
      .val()
      .trim();
    window.history.replaceState(null, null, '?search=' + searchQuery);
  });
});
