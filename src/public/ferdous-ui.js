// FERDOUS AI — micro-interactions + tiny component helpers (vanilla)
(function(){
  window.FERDOUS = window.FERDOUS || {};

  FERDOUS.selectOne = function(container, selector, onChange){
    const root = typeof container === 'string' ? document.querySelector(container) : container;
    if (!root) return;
    root.addEventListener('click', function(e){
      const card = e.target.closest(selector);
      if (!card || !root.contains(card)) return;
      root.querySelectorAll(selector).forEach(el => el.setAttribute('data-selected', 'false'));
      card.setAttribute('data-selected', 'true');
      if (onChange) onChange(card);
    });
  };
})();

