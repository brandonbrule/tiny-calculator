(function() {
  var calc_array = [];
  var event_data = {};
  var total_display;
  var hidden_display;
  var calc_action;
  var interval;
  var container;
  var Draggable = {
    dragging: null,
    collision: {
      x: false,
      y: false
    },
    window:{
      width: window.innerWidth,
      height: window.innerHeight
    },
    container:{
      width: 0,
      height: 0,
      pos: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      offset: {
        x: 0,
        y: 0
      }
    },
    mouse:{
      x: 0,
      y: 0
    },
    update: function(e){
      // Mouse X Y
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      

      // Left Position
      this.container.pos.left = Draggable.mouse.x - this.container.width;

      // Right Position
      this.container.pos.right = this.mouse.x;
      
      // Top Position
      this.container.pos.top = Draggable.mouse.y;

      // Bottom Position
      this.container.pos.bottom = (this.window.height - this.container.height) - this.container.pos.top;
    },
    checkCollision: function(){
      this.collision.x = false;
      this.collision.y = false;
      
      if(this.container.pos.left < 0){
        this.collision.x = true;
      }

      if (this.container.pos.right + 20 > this.window.width){
        this.collision.x = true;
        
      }

      if (this.container.pos.top < 0){
        this.collision.y = true;
      }

      if (this.container.pos.bottom < 0){
        this.collision.y = true;
      }

      if (!Draggable.collision.x){
        container.style.left = (Draggable.container.pos.left) + 5 + 'px';
      }
      if (!Draggable.collision.y){
        container.style.top = (Draggable.mouse.y - 5) + 'px';
      }
    }
  };
  
  
  
  var createCalculatorUI = function() {
    var html = [
      '<style>',
      '.its-calc{',
      'background:rgba(0,0,0,0.95);',
      'position:fixed;',
      'top:13px;',
      'z-index:10000;',
      'width: 530px;',
      'border-radius:6px;',
      'padding-right: 10px;',
      '}',

      '.its-calc[data-calc-dragging="true"]{',
      'cursor:pointer;',
      'background:rgba(0,0,0,0.85);',
      '}',

      '.its-calc *{',
      'box-sizing: border-box',
      '}',

      '.its-calc button:focus,',
      '.its-calc input:focus{',
      'outline: none;',
      '}',

      '.its-calc input{',
      'font-size:30px;',
      'font-family:arial, helvetica;',
      'background: none;',
      'border:none;',
      'width: 214px;',
      'height: 40px;',
      'color:#fff;',
      'padding-left:10px;',
      '}',

      '.its-calc input::selection{',
      'background:#fff; color:#111;',
      '}',

      '.its-calc button[its-calc]{',
      'font-size:30px;',
      'padding: 0;',
      'margin: 0;',
      'vertical-align: top;',
      'font-family:arial;',
      'border-radius: 0;',
      'background:#5f5f5f;',
      'border: none;',
      'line-height: 1;',
      'border-right: 1px solid #484848;',
      'color:#fff;',
      'width:40px;',
      'height: 40px;',
      '}',

      '.its-calc button[its-calc]:hover{',
      'background: #4e4e4e;',
      'cursor: pointer',
      '}',

      '.its-calc button[its-calc]:focus{',
      'background: #5ea55d;',
      'cursor: pointer',
      '}',

      '.its-calc button[its-calc]:first-of-type{',
      'border-radius:6px 0 0 6px;',
      '}',

      '.its-calc button[its-calc].submit{',
      'border:1px solid #fff;',
      'height: auto;',
      'width: auto;',
      'background: none;',
      'font-size: 13px;',
      'padding: 5px 10px;',
      'border-radius:12px;',
      'margin: 0 0 0 10px;',
      '}',
      '.its-calc button[its-calc].submit:hover{',
      'background: rgba(255,255,255, 0.25);',
      '}',

      '.its-calc button[data-active]{',
      'background:#5ea55d;',
      'color:#fff;',
      '}',

      '.its-calc .its-calc-submit-container{',
      'float:right;',
      'width: 136px;',
      'padding: 7px 0 0 0;',
      'margin-right: 10px;',
      '}',
      '</style>',
      '<div id="its-calc" class="its-calc">',
      '<button its-calc="add"><svg width="20" height="20" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g stroke-width="3" stroke="#FFF" fill="none" fill-rule="evenodd"><path d="M8 20.5h25M20.5 33V8"/></g></svg></button>',
      '<button its-calc="subtract"><svg width="20" height="20" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M6 20h28" stroke-width="3" stroke="#FFF" fill="none" fill-rule="evenodd"/></svg></button>',
      '<button its-calc="multiply"><svg width="20" height="20" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g stroke-width="3" stroke="#FFF" fill="none" fill-rule="evenodd"><path d="M7.97 32.03L32.03 7.97M32.03 32.03L7.97 7.97"/></g></svg></button>',
      '<button its-calc="divide"><svg width="20" height="20" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g transform="translate(3 7.615)" stroke="#FFF" fill="none" fill-rule="evenodd"><path d="M0 12h34" stroke-width="3"/><ellipse fill="#FFF" fill-rule="nonzero" cx="16.925" cy="2.925" rx="2.925" ry="2.925"/><circle fill="#FFF" fill-rule="nonzero" cx="16.925" cy="20.925" r="2.925"/></g></svg></button>',
      '<input its-calc="total" value="0">',
      '<input type="hidden" its-calc="hidden">',
      '<div class="its-calc-submit-container">',
      '<button class="submit" its-calc="submit">Submit</button>',
      '<button its-calc="clear" class="submit">Clear</button>',
      '</div>',
      '</div>'
    ].join('');
    var ui = document.createElement('div');
    ui.innerHTML = html;
    document.body.appendChild(ui);
  };

  

  // On Release
  // Double Click but not really
  // It just checks to see if there's selected text on mouse up or ||
  // If it's one of the calculator buttons
  document.addEventListener('mouseup', function(e) {
    var t = (document.all) ? document.selection.createRange().text : document.getSelection();
    var cur_bal = parseFloat(total_display.value);
    
    // If Selected text or if its one of the calculator buttons.
    if (t && e.target.getAttribute('its-calc') !== 'total') {
      hidden_display.value = t;
      t = hidden_display.value.replace(/,/g, '');
      if (parseFloat(t)) {
        t = parseFloat(t);
        switch (calc_action) {
          case 'add':
            t = t + cur_bal;
            break;
          case 'subtract':
            t = cur_bal - t;
            break;
          case 'multiply':
            t = cur_bal * t;
            break;
          case 'divide':
            t = cur_bal / t;
            break;
          default:
            break;
        }

        total_display.value = t;
      }

    }

    // Dragging (Stop Dragging Timer)
    Draggable.dragging = false;
    container.setAttribute('data-calc-dragging', false);
    clearInterval(interval);

  });
  
  
  
  // On Click Down (Hold Mouse, Movement)
  // If Submit, Clear, And Start Moving Container on Mouse Down
  // Also Highlight Buttons
  document.body.addEventListener('mousedown', function(e) {
    var el = e.target;
    var val;


    // If it's on the svg part of the button.
    if (el.nodeName === 'svg'){
      el = el.parentNode;
    }

    if (el.nodeName === 'path'){
      el = el.parentNode.parentNode.parentNode;
    }

    // Calculator Controls
    if (el.hasAttribute('its-calc')) {
      var action = el.getAttribute('its-calc');
      

      // Highlight Buttons
      if (el.nodeName === 'BUTTON') {
        
        // First Remove the Active Style if there, and then re-apply active class
        // To button clicked.
        if (container.querySelector('button[data-active="true"]')) {
          container.querySelector('button[data-active="true"]').removeAttribute('data-active');
        }
        // Don't set active style for submit or clear
        if (
          el.getAttribute('its-calc') !== 'submit' &&
          el.getAttribute('its-calc') !== 'clear'
        ) {
          el.setAttribute('data-active', true);
        }
      }
      
      // Clear Clicked
      // Set input to 0
      if (action === 'clear') {
        total_display.value = 0;
        hidden_display.value = 0;
        window.getSelection().removeAllRanges();
      }
      
      
      // If submit pressed, there could be user BEDMAS
      // Eval the input (2 * 2 - 1)
      if (action === 'submit') {
        val = eval(total_display.value);
        total_display.value = val;
        hidden_display.value = val;
        window.getSelection().removeAllRanges();
      }
      
      // If it's a regular calulation button the user action has changed
      // Unhighlight text so it's not automatically executed until next double click
      if (el.getAttribute('its-calc') !== calc_action) {
        window.getSelection().removeAllRanges();
      }
      
      // Set global calc_action state (add, subtract, divide, multiply)
      calc_action = action;
    }

    // Start Dragging if the mouse down is on its-calc container
    if (el.id === 'its-calc') {
      Draggable.dragging = true;
      Draggable.update(e);
      container.setAttribute('data-calc-dragging', true);
      interval = setInterval(function() {
        Draggable.checkCollision();
      }, 10);
    }

  });



  // If Dragging
  // Update Mouse Position Draggable Data
  document.addEventListener('mousemove', function(e) {
    if (Draggable.dragging) {
      Draggable.update(e);
      e.preventDefault();
    }
  });
  
  // Resize
  window.addEventListener('resize', function(e){
    Draggable.window.width = window.innerWidth;
    Draggable.window.height = window.innerHeight;
    Draggable.container.offset.x = Draggable.window.width - Draggable.container.width;
    Draggable.container.offset.y = Draggable.window.height - Draggable.container.height;
  });



  // Setup Default Values.
  // Setup Calculator Values
    createCalculatorUI();
    container = document.getElementById('its-calc');
    total_display = container.querySelector('input[its-calc="total"]');
    hidden_display = container.querySelector('input[its-calc="hidden"]');

    // Update Draggable Container Positions
    Draggable.container.width = container.offsetWidth;
    Draggable.container.height = container.offsetHeight;
    Draggable.container.offset.x = Draggable.window.width - Draggable.container.width;
    Draggable.container.offset.y = Draggable.window.height - Draggable.container.height;
    Draggable.container.pos.left = 0;
    Draggable.container.pos.top = 0;

}());