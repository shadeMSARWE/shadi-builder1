// Manus-inspired micro-interactions
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('[data-m-hover]').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty('--mx', x + '%');
        el.style.setProperty('--my', y + '%');
      });
    });
  });
})();

