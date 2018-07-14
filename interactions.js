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
    updateControlPanel();

  }

  //======================================
  //        Control Panel
  //======================================
  function createControlItem(params) {
    /**
     * Creates a DOM input element based on the parameters given (See readme for more details on format)
     * If the creation falis returns null, otherwise returns the dom element.
     * It does NOT add the element to the dom
     */
    const input = document.createElement('input')
    // @TODO add check that the ID does not yet exist
    for (let attr of ['id', 'type', 'min_value', 'max_value', 'value', 'class']) {
      if (params[attr] !== undefined) {
        input.setAttribute(attr, params[attr]);
      }
    }
    input.setAttribute('data-param-name', params['object_parameter']);
    // Adding a label if available
    if (params['label'] !== undefined) {
      const label = document.createElement('label');
      label.setAttribute('for', params['id']);
      label.innerHTML = params['label'];
      label.appendChild(input);
      return label;
    }
    return input;
  }

  function createControlPanel(controls) {
    /**
     * Using the controls config create the full set of control elements
     */
    const controls_container = document.getElementById('controls');  // Getting the controls container
    let elem;
    // Creating controls
    controls.forEach(function(control) {
      elem = createControlItem(control);
      console.log(elem)
      controls_container.appendChild(elem);
    });
  }

  function cleanControlPanel() {
    /**
     * Clears the elements in the control panel
     */
    const controls = document.getElementById('controls');
    // Deleting all the elements below it
    // See https://jsperf.com/innerhtml-vs-removechild/15 for performace on cleaning
    while (controls.lastChild) {
      controls.removeChild(controls.lastChild);
    }
  }

  function updateControlPanel() {
    const active_id = (document.getElementsByClassName('active')[0]).getElementsByTagName('canvas')[0].id;
    console.log('Updating controls for ', active_id);
    const controls = window.Art[active_id].getControls()
    cleanControlPanel();
    createControlPanel(controls);
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
