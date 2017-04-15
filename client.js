var fuse;
var nextQuery = null;
var processing = false;
var currentQuery = null;

var addItem = function(item) {
  $("ul.local-storage-list").append("<li>" + item + "</li>");
};

$(function() {

  $('#query').focus();
  // populate the left side localStorage list
  // if the localStorage exists, else hide div
  if(!localStorage.getItem("searched")) {
    $("div.local-storage-div").hide();
  } else {
    var history = localStorage.getItem("searched");
    $.each(history.split(","), function(index, item) {
      addItem(item);
    });
  }

  $(document).click(function(e) {
    console.log("Clicked somewhere in the doc");
    // figure out if this is a result click
    if(e.target.classList.contains("result-link")) {
      // this is a result link
      var query_value = $("#query").val().trim();
      if(localStorage.getItem("searched")) {
        localStorage.setItem("searched", localStorage.getItem("searched") + "," + query_value);
      } else {
        localStorage.setItem("searched", query_value);
      }
      addItem(query_value);
      if(!$("div.local-storage-div").is(":visible")) {
        $("div.local-storage-div").show();
      }
      console.log("Local storage: " + localStorage.getItem("searched"));
    }
  });


  var worker = new Worker('resources/scripts/worker2.js');
  $.getJSON("data/data.json")
  .success(function(json) {
    worker.postMessage({type: 'data', data: json});
    var search_query = $.url("?").search;
    if (search_query) {
      while (search_query[search_query.length-1] == "/"){
        search_query = search_query.slice(0, -1);
      }
      $("#query").val(search_query);
      search();
    }
  })
  .error(function(jqxhr, status, err) {
    console.log(jqxhr, status, err);
  });

  worker.onmessage = function(results) {
    processing = false;
    $('.sk-folding-cube').addClass('hidden');
    displayResults(results.data);
    if (nextQuery !== null) {
      var query = nextQuery;
      nextQuery = null;
      search(query);
    }
  }

  function displayResults(results) {
    var html = ''
    for (var i = 0; i < 20; ++i) {
      html += '<li><a target="_blank" class="result-link" href="'+results[i].Link+'">' + results[i].Year + ' / ' + results[i].Department + ' / ' + results[i].Semester + ' / ' + results[i].Paper +'</a><li>';
    }
    $('.result-list').html(html);
    $('.result-link').click(function() {
      ga('send', 'event', 'Result', 'click', $('#query').val().trim());
    })
  }

  var search = _.debounce(function() {
    $('.ratings').addClass('hidden');
    var query = $('#query').val().trim();
    if (query === '') {
      $('.result-list').html('');
      $('.ratings').removeClass('hidden');
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
    $('.sk-folding-cube').removeClass('hidden');
    worker.postMessage({type: 'query', query: query});
    ga('send', 'event', 'Search', 'query', query);
  }, 200);

  $('#query').keydown(search);
});
