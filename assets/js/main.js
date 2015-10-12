
;(function() {

  var ghost = window.ghost = window.ghost || {};

  $.ghostSearch = function(options) {
    var opts = $.extend( {}, $.ghostSearch.defaults, options );

    var $search = $(opts.search);
    var $results = $(opts.results);

    $results.addClass('articles');

    $.get('/rss', function(data) {
      var posts = $(data).find('item');

      posts.each(function(i, post) {
        post = $(post);
        var data = {
          title: post.find('title').text(),
          description: post.find('description').text(),
          link: post.find('link').text(),
        };

        var article = $('<article>').appendTo($results);
        var p = $('<p>').appendTo(article);
        var anchor = $('<a>').appendTo(p);
        anchor.text(data.title);
        anchor.attr('href', data.link);
        anchor.attr('target', '_blank');

        article.data('data', data);

      });

      $search.on('input', function() {
        var v = this.value;
        console.log(v);
        $results.children().each(function(i, article) {
          article = $(article);
          var data = article.data('data');

          if (data.title.indexOf(v) !== -1) {
            article.show();
          }
          else {
            article.hide();
          }

          // console.log(data);
        });
      })

    });
  };

  $.ghostSearch.defaults = {
    search: '#search',
    results: '#results',
  };

  ghost.search = function(options) {
    options = options || {};
    options.search = options.search || '#search';
    options.results = options.results || '#results';

    var searchElement = document.querySelector(options.search);
    var resultsElement = document.querySelector(options.results);


  };

})();

;(function() {

  window.addEventListener("DOMContentLoaded", function() {
    hljs.initHighlightingOnLoad();
  }, false);


  window.addEventListener('load', function() {
    setupTOC();
  }, false);

  var setupTOC = function() {
    var tocElement = document.getElementById('toc');
    if (!tocElement) return ;

    var parent = tocElement.parentNode;
    var headers = parent.getElementsByTagName('h2');
    var list = document.createElement('ul');
    tocElement.appendChild(list);

    Array.prototype.forEach.call(headers, function(header, i) {
      var li = document.createElement('li');
      list.appendChild(li);
      var anchor = document.createElement('a');
      li.appendChild(anchor);
      anchor.innerHTML = header.innerHTML;

      header.id = 'post-header-id-' + i;
      anchor.href = '#' + header.id;
    });

  };

  document.addEventListener('keydown', function(e) {
    if (e.metaKey === false) return ;
    
    var ch = String.fromCharCode(e.keyCode);

    if (ch === 'G') {
      location.href = '/ghost';
    }
    if (ch === 'E') {
      location.href += '/edit';
    }
  });


})();
