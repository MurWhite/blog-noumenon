window.addEventListener('scroll', function () {
  var scrollTop = document.documentElement.scrollTop;
  var headerHeight = document.querySelector('#header-outer').offsetHeight;
  var topTool = document.querySelector('#tool-top');
  if (scrollTop >= headerHeight) {
    topTool.style.display = 'block';
  } else {
    topTool.style.display = null;
  }
});