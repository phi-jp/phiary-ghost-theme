
Object.defineProperty(Date.prototype, 'format', {  
  value: function(pattern) {
    var MONTH = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    var WEEK = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    
    var year    = this.getFullYear();
    var month   = this.getMonth();
    var date    = this.getDate();
    var day     = this.getDay();
    var hours   = this.getHours();
    var minutes = this.getMinutes();
    var seconds = this.getSeconds();
    var millseconds = this.getMilliseconds();

    var patterns = {
      'yyyy': String('0000' + year).slice(-4),
      'yy': year.toString().substr(2, 2),
      'y': year,

      'MMMM': MONTH[month],
      'MMM': MONTH[month].substr(0, 3),
      'MM': String('00' + (month+1)).slice(-2),
      'M': (month+1),

      'dd': String('00' + date).slice(-2),
      'd': date,

      'EEEE': WEEK[day],
      'EEE': WEEK[day].substr(0, 3),

      'HH': String('00' + hours).slice(-2),
      'H': hours,

      'mm': String('00' + minutes).slice(-2),
      'm': minutes,

      'ss': String('00' + seconds).slice(-2),
      's': seconds,
    };
    
    var regstr = '(' + Object.keys(patterns).join('|') + ')';
    var re = new RegExp(regstr, 'g');

    return pattern.replace(re, function(str) {
      return patterns[str];
    });
  },
});

;(function() {
  // 存在チェック
  if (String.prototype.format == undefined) {  
    /**
     * フォーマット関数
     */
    String.prototype.format = function(arg)
    {
      // 置換ファンク
      var rep_fn = undefined;

      // オブジェクトの場合
      if (typeof arg == "object") {
        rep_fn = function(m, k) { return arg[k]; }
      }
      // 複数引数だった場合
      else {
        var args = arguments;
        rep_fn = function(m, k) { return args[ parseInt(k) ]; }
      }

      return this.replace( /\{(\w+)\}/g, rep_fn );
    }
  }
})();

;(function() {

  var ghost = window.ghost = window.ghost || {};

  ghost.getPosts = function(callback) {
    $.get('/rss/?limit=500', function(data) {
      var items = $(data).find('item');
      var posts = [];
      items.each(function(i, item) {
        item = $(item);
        var post = {
          id: i+1,
          title: item.find('title').text(),
          description: item.find('description').text(),
          category: item.find('category').text(),
          pubDate: item.find('pubDate').text(),
          link: item.find('link').text(),
        };

        posts.push(post);
      });

      callback && callback(posts);
    });
  };

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
        var date = new Date(data.pubDate);

        anchor.text(date.format('dd MMM yy - ') + ' ' + data.title);
        anchor.attr('href', data.link);
        anchor.attr('target', '_blank');

        article.data('data', data);
        article.data('data_str', JSON.stringify(data));
      });

      var filter = function(v) {
        if (!v) return ;

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
      };

      $search.on('input', function() {
        filter(this.value);
      });

      filter($search.val());
    });
  };

  $.ghostSearch.defaults = {
    search: '#search',
    results: '#results',
  };

})();

;(function() {

  window.addEventListener("DOMContentLoaded", function() {
    setupHighlight();
    setupTOC();
  }, false);


  window.addEventListener('load', function() {
    setupMario();
  }, false);

  var setupHighlight = function() {
    $('article.post pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
    // hljs.initHighlightingOnLoad();
  };

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

    var header2List = function(headers, id_prefix) {
      var ul = document.createElement('ul');

      headers.forEach(function(header, i) {
        var id = id_prefix + '_' + i;
        var li = document.createElement('li'); ul.appendChild(li);
        var anchor = document.createElement('a'); li.appendChild(anchor);
        anchor.innerHTML = header.innerHTML;
        anchor.href = '#' + id;
        header.id = id;

        $(anchor).click(function() {
          var offset = 20;
          var query = '#' + id;
          var v = $(query).offset().top - offset;
          $("html,body").animate({scrollTop:v},'easeOutExpo', function() {
            location.hash = id;
          });

          return false;
        });
      });

      return ul;
    };

    var toList = function(element, tagName, children) {
      var list = document.createElement('ul');

      var headers = element.getElementsByTagName('h2');

      Array.prototype.forEach.call(headers, function(header, i) {
        var li = document.createElement('li');
        list.appendChild(li);
        var anchor = document.createElement('a');
        li.appendChild(anchor);
        anchor.innerHTML = header.innerHTML;

        header.id = 'post-' + tagName + '-id-' + i;
        anchor.href = '#' + header.id;

        $(anchor).click(function() {
          var offset = 20;
          var query = '#' + header.id;
          var v = $(query).offset().top - offset;
          $("html,body").animate({scrollTop:v},'easeOutExpo', function() {
            location.hash = header.id;
          });

          return false;
        });

        var elm = header.nextElementSibling;
        var subHeaders = [];
        while(elm && elm.tagName !== 'H2') {
          if (elm.tagName === 'H3') {
            subHeaders.push(elm);
          }
          elm = elm.nextElementSibling;
        }

        if (subHeaders.length) {
          var subList = header2List(subHeaders, 'post-h3-id-' + i);
          li.appendChild(subList);
        }
      });

      return list;
    };

    // add list
    var listElement = toList(tocElement.parentNode, 'h2');
    tocElement.appendChild(listElement);

    // add header
    var header = document.createElement('h2');
    header.innerHTML = 'Table of contents';
    $(tocElement).prepend(header);
  };

  document.addEventListener('keydown', function(e) {
    if (e.metaKey === false) return ;
    
    var ch = String.fromCharCode(e.keyCode);

    if (ch === 'G') {
      location.href = '/ghost';
    }
    else if (ch === 'E') {
      location.href += '/edit';
    }
    else if (ch === 'S') {
      location.href = '/search';
    }
  });

  // fadeout
  window.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.content').classList.add('fadein');
  });
  // window.onlo
  window.addEventListener('beforeunload', function() {
    document.querySelector('.content').classList.add('fadeout');
  }, false);

  // lazy
  var iframes = $('iframe');
  iframes.attr('data-src', function() {
    var src = $(this).attr('src');
    $(this).removeAttr('src');
    return src;
  });
  window.addEventListener('DOMContentLoaded', function() {
    iframes.attr('src', function() {
      return $(this).data('src');
    });
  });

})();

