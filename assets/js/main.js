
;(function() {

  var ghost = window.ghost = window.ghost || {};

  $.ghostSearch = function(options) {
    var opts = $.extend( {}, $.ghostSearch.defaults, options );

    var $search = $(opts.search);
    var $results = $(opts.results);

    $results.addClass('articles');

    $.get('/rss/?limit=500', function(data) {
      var posts = $(data).find('item');

      posts.each(function(i, post) {
        post = $(post);
        var data = {
          id: i+1,
          title: post.find('title').text(),
          description: post.find('description').text(),
          category: post.find('category').text(),
          pubDate: post.find('pubDate').text(),
          link: post.find('link').text(),
        };

        var article = $('<article>').appendTo($results);
        var p = $('<p>').appendTo(article);
        var anchor = $('<a>').appendTo(p);
        anchor.text(data.title);
        anchor.attr('href', data.link);
        anchor.attr('target', '_blank');

        article.data('data', data);
        article.data('data_str', JSON.stringify(data));
      });

      $search.on('input', function() {
        var v = this.value;
        $results.children().each(function(i, article) {
          article = $(article);
          var data_str = article.data('data_str');

          var re = new RegExp(v, 'i');

          if (re.test(data_str)) {
            article.show();
          }
          else {
            article.hide();
          }
        });
      })

    });
  };

  $.ghostSearch.defaults = {
    search: '#search',
    results: '#results',
  };

})();

;(function() {

  window.addEventListener("DOMContentLoaded", function() {
    hljs.initHighlightingOnLoad();
  }, false);


  window.addEventListener('load', function() {
    setupTOC();
    setupMario();
  }, false);

  var setupMario = function() {
    Mario({
      x: window.innerWidth-100,
      floorHeight: 73,
      scale: 2,
      direction: "left",
    });
  };

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

  // fadeout
  window.addEventListener('load', function() {
    document.querySelector('.content').classList.add('fadein');
  });
  // window.onlo
  window.addEventListener('beforeunload', function() {
    document.querySelector('.content').classList.add('fadeout');
  }, false);



})();
