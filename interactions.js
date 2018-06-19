(function(window, document, undefined) {
  // Adding click listeners to the buttons
  const menuItems = document.getElementsByClassName('js-sec-switch');
  for (let item of menuItems) {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      activateSection(item.getAttribute('href'));
    }, true);
  }

  function hideAll() {
    // Hides all the art sections
    for (let section of document.getElementsByClassName('art-section active')) {
      section.classList.remove('active');
      section.classList.add('hidden');
    }
  }
  function activateSection(sectionId) {
    // Deactivates the other sections and activates the section id
    hideAll();

    sectionId = sectionId.replace('#', '');  // Removing # if it is also given in the Id
    // Adding active to the selected item
    section = document.getElementById(sectionId);
    section.classList.add('active');
    section.classList.remove('hidden');
  }

  function createControlItem(control_id, params) {
    /**
     * Creates a DOM input element based on the parameters given (See readme for more details on format)
     * If the creation falis returns null, otherwise returns the dom element.
     * It does NOT add the element to the dom
     */
    const input = document.createElement('input')
    // @TODO add check that the ID does not yet exist
    for (let attr of ['type', 'min_value', 'max_value', 'value', 'class']) {
      if (params[attr] !== undefined) {
        input.setAttribute(attr, params[attr]);
      }
    }
    input.setAttribute('id', control_id);
    input.setAttribute('data-param-name', params['object_parameter']);
    return input;
  }
  function createControlPanel(controls) {
  }
  function cleanControlPanel() {
    const controls = document.getElementById('controls').getElementsByTagName('input');

  }
  // Making canvas click a redraw
  // This works by having the arts parameter and the canvas id be the same
  // @TODO make more robust by adding a data-parameter attribute
  for (let elem of document.getElementsByTagName('canvas')) {
    elem.addEventListener('click', function(event) {
      window.Art[elem.id].draw();
    });
  }
})(window, document);
