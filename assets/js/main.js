window.addEventListener("DOMContentLoaded", function() {
  hljs.initHighlightingOnLoad();
}, false);


document.addEventListener('keydown', function(e) {
  var ch = String.fromCharCode(e.keyCode);

  if (ch === 'G') {
    location.href = '/ghost';
  }
  if (ch === 'E') {
    location.href += '/edit';
  }
});
