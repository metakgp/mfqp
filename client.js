var fuse;
var nextQuery = null;
var processing = false;
var currentQuery = null;
var DEBUG = false;
var searchQuery = "";
var pageURL = $(location).attr("href");

var addItem = function(item) {
  item = item.toLowerCase();
  var searchbase = localStorage.getItem("searched")
  if(searchbase) {
    searchbase = searchbase.replace("," + item + ",", ",");
    searchbase = "," + item + searchbase;
    localStorage.setItem("searched", searchbase);
  } else {
    localStorage.setItem("searched", "," + item + ",");
  }

  $("ul.local-storage-list div > a:contains('"+item+"')").each(function() {
       if ($(this).text() === item) {
           $(this).parent().remove();
       }
  })
  $("ul.local-storage-list").prepend("<li><a href='' style='text-align: center'>" + item + "</a><br></li>");
};

$(function() {

  $('#query').focus();

  // populate the left side localStorage list
  // if the localStorage exists, else hide div
  if(localStorage.getItem("searched")) {
    var history = localStorage.getItem("searched");
    $.each(history.split(","), function(index, item) {
      if(item != '') {
        $("ul.local-storage-list").append("<li><a href='' style='text-align: center'>" + item + "</a><br></li>");
      }
    });
    $("ul.local-storage-list").append("<br/><br/>");
  }

  $(document).click(function(e) {
    if (DEBUG) console.log("Clicked somewhere in the doc");
    // figure out if this is a result click
    if(e.target.classList.contains("result-link")) {
      // this is a result link
      var query_value = $("#query").val().trim();
      addItem(query_value);
      $("div.local-storage-div").show();
      if (DEBUG) console.log("Local storage: " + localStorage.getItem("searched"));
    }
  });


  var worker = new Worker('resources/scripts/worker2.js');
  $.getJSON("data/data.json")
  .success(function(json) {
    worker.postMessage({type: 'data', data: json});
    var search_query = $.url("?") && $.url("?").search;
    if (search_query) {
      while (search_query[search_query.length-1] == "/"){
        search_query = search_query.slice(0, -1);
      }
      $("#query").val(search_query);
      search();
    }
  })
  .error(function(jqxhr, status, err) {
    if (DEBUG) console.log(jqxhr, status, err);
  });

  $("ul.local-storage-list li a").click(function(e) {
    $("#query").val($(this).text());
    search();
    e.preventDefault();
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
    var html = '';
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

  // function to update the query url
  $('#query').keyup(function () {
    searchQuery = $('#query').val().trim();
    $('.sharelink').html(searchQuery);
    // $('#sharelink').innerText = searchQuery;
  });
});

// opens (in new tab) dynamic generated facebook share link based on query
function shareFB() {
    var fbLink = "http://www.facebook.com/sharer.php?u=" + pageURL + "/?search=" + searchQuery;
    $("<a>").attr("href", fbLink).attr("target", "_blank")[0].click();
}

// opens (in new tab) dynamic generated twitter share link based on query
function shareTwit() {
    var twitLink = "https://twitter.com/share?url=" + pageURL + "/?search=" + searchQuery + "&amp;text=Past%20Papers&amp;hashtags=mfqp";
    $("<a>").attr("href", twitLink).attr("target", "_blank")[0].click();
}

// opens (in new tab) dynamic generated email share link based on query
function shareMail() {
    // var mailLink = "mailto:?Subject=Simple Share Buttons&amp;Body=I%20saw%20this%20and%20thought%20of%20you!%20 https://simplesharebuttons.com"
    var mailLink = "mailto:?subject=Past Papers From MFQP&body=I saw these papers and thought they might help you!%0D%0A%0D%0A" + pageURL + "/?search=" + searchQuery;
    $("<a>").attr("href", mailLink).attr("target", "_blank")[0].click();
}

// copies the dynamically generated query link to clipboard
function shareLink() {
    var temp = document.createElement('input');
    temp.style = "position: absolute; left: -1000px; top: -1000px";
    temp.value = pageURL+"/?search="+searchQuery;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    alert(pageURL+"/?search="+searchQuery+" copied!")
}