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
    document.getElementById('sec-title').classList.add('hidden');
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
  function makeCloseButton() {
    // Generates a close button. This is added here as it is needed by every
    // control mechanism and cannot, for now, br overwritten
    // DRY
    const button = document.createElement('button');
    button.setAttribute('id', 'close-section');
    button.innerHTML = 'X'; 
    button.onclick = function hideArtSection() {
      hideAll();
      cleanControlPanel();
      document.getElementById('sec-title').classList.remove('hidden');
    };

    return button;
  }

  function createControlItem(params, active_id) {
    /**
     * Creates a DOM input element based on the parameters given (See readme for more details on format)
     * If the creation falis returns null, otherwise returns the dom element.
     * It does NOT add the element to the dom
     */
    const input = document.createElement('input');
    // @TODO add check that the ID does not yet exist
    for (let attr of ['id', 'type', 'min', 'max', 'value', 'class', 'step']) {
      if (params[attr] !== undefined) {
        input.setAttribute(attr, params[attr]);
      }
    }
    // Binding to variable if needed
    if (params['bind']) {
      input.onchange = function(evt) {
        if (evt.srcElement.valueAsNumber !== null) {
          window.Art[active_id][params['bind']] = evt.srcElement.valueAsNumber;
        } else {
          window.Art[active_id][params['bind']] = evt.srcElement.value;
        }
        window.Art[active_id].draw();
      }
      // Overwriting the value given by value
      input.setAttribute('value', window.Art[active_id][params['bind']]);
    }  
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

  function createControlPanel(controls, active_id) {
    /**
     * Using the controls config create the full set of control elements
     */
    const controls_container = document.getElementById('controls');  // Getting the controls container
    let elem;
    // Creating controls
    controls.forEach(function(control) {
      elem = createControlItem(control, active_id);
      controls_container.appendChild(elem);
    });
    controls_container.appendChild(makeCloseButton());
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
    const active_id = getActiveArtObjectId();
    const controls = window.Art[active_id].getControls();
    cleanControlPanel();
    createControlPanel(controls, active_id);
  }

  function getActiveArtObjectId() {
    // This wil probably change in the future. Encapsuling in its own
    // function make that change more managable
    return (document.getElementsByClassName('active')[0]).getElementsByTagName('canvas')[0].id;
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
