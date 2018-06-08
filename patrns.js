(function(window) {
  'use strict'
  // create a csv or png export
  
  function Art(window, undefined) {
    // Constants for the whole app
    const golden_ration = 1.61803399,  // Proxemation of the golden ratio
        document = window.document;  // Making it easier to work with document
   
    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  String hex rgb color
     */
    function hslToRgb(h, s, l) {
      let r, g, b;

      if (s == 0) {
        r = g = b = 'ff'; // achromatic
      } else {
        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = (Math.round(hue2rgb(p, q, h + 1/3) * 255)).toString(16);
        g = (Math.round(hue2rgb(p, q, h) * 255)).toString(16);
        b = (Math.round(hue2rgb(p, q, h - 1/3) * 255)).toString(16);
      }
      
      const colors =  [r, g, b];
      let color = '#';
      for (let i = 0;i < 3;i++) {
        color += (colors[i].length === 1)? '0' + colors[i]: colors[i];
      }
      return color
    }

    function Canvas(selector) {
      function getCanvasElement(selector) {
        // Retrieving the canvas element
        //  Selector support .class_name or #id
        if (selector[0] === '.') {
          return document.getElementsByClassName(selector.substr(1))[0];
        } else if (selector[0] === '#') {
          return document.getElementById(selector.substr(1));
        }
        return null;
      }
      return {
        elem: getCanvasElement(selector),
        getContext: function() {
          try {
            return this.elem.getContext('2d');
          } catch {
            console.log('Falied to get context from', this.elem);
            return null;
          }
        }
      };
    }

    /**
     * Polygons
     */
    function drawPolygon(ctx, x, y, sides, size, color) {
      // Takes a drawing context and draws the poly on it
      const step = (2 * Math.PI) / sides;
      ctx.beginPath();
      ctx.rotate(Math.PI / 2);
      ctx.moveTo(size, 0);

      for (let i = 1;i < sides;i++) {
        ctx.lineTo(x + (size * Math.cos(i * step)), y + (size * Math.sin(i * step)));
      }
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();
      ctx.rotate(-Math.PI / 2);
    };
  
    function Polygons(selector, polyCount, size) {
      this.canvas = new Canvas(selector);
      this.polyCount = polyCount;
      this.size = size;
      // Saving function calls
      this.max_x = this.canvas.elem.width;
      this.max_y = this.canvas.elem.height;
    };
    Polygons.prototype._createLocation = function createLocation() {
      return [
        Math.round(Math.random() * (this.max_x + this.size * 2) - this.size),
        Math.round(Math.random() * (this.max_y + this.size* 2) - this.size)
      ]
    };
    Polygons.prototype._createColor = function createColor() {
      // Create a random color
      const h = Math.random(),
            s = (Math.random() * 0.5) + 0.5,
            l = (Math.random() * 0.2) + 0.5;
      return hslToRgb(h, s, l);
    };
    Polygons.prototype.draw = function draw() {
      // Getting the drawing context
      const ctx = this.canvas.getContext();
      // Clearing the context before drawing
      ctx.clearRect(0, 0, this.max_x, this.max_y);
      // Drawing
      let pos = null,
          color = null,
          poly = null;
      for (let i = 0;i < this.polyCount;i++) {
        pos = this._createLocation();
        color = this._createColor();
        drawPolygon(ctx, pos[0], pos[1], 6,this.size, color);
      }
    };

    function drawDot(ctx, x, y, size, color) {
      ctx.arc(x, y, size, 0, Math.PI * 2);
    }
    
    function Dots(selector, count, radius) {
      this.canvas = new Canvas(selector);
      this.count = count;
      this.radius = radius;
      
      // Calculatin dots distribution
      const max_x = this.canvas.elem.width;
      const max_y = this.canvas.elem.height;
      const vertical_fit = 0;
    }
    return {
      // Setting up polygons
      polygons: new Polygons('#polygons', 2000, 30),
      dots: new Dots('#dots', 40, 10),
      run: function run() {
        this.polygons.draw();
      }
    };
  }
  window.Art = Art(window);
})(window);

