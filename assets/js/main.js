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
    var ch = String.fromCharCode(e.keyCode);

    if (ch === 'G') {
      location.href = '/ghost';
    }
    if (ch === 'E') {
      location.href += '/edit';
    }
  });


})();
