(function(window) {
  'use strict'
  // create a csv or png export
  
  function Art(window, undefined) {
    // Constants for the whole app
    const golden_ration = 1.61803399,  // Proxemation of the golden ratio
        document = window.document;  // Making it easier to work with document
   
   function createColor(saturation = 0.5, luminance = 0.4) {
      // Create a random color
      // @TODO add parameter verification
     const h = Math.round(Math.random() * 360),
            s = Math.round(((Math.random() * (1.0 - saturation)) + saturation) * 100),
            l = Math.round(((Math.random() * 0.2) + luminance) * 100);
      return 'hsl(' + h + ',' + s + '%, ' + l + '%)';
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
      // Projection
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 2);
      // Setting up the location
      ctx.moveTo(size, 0);
      // Drawing the lines
      for (let i = 1;i < sides;i++) {
        ctx.lineTo(size * Math.cos(i * step), size * Math.sin(i * step));
      }
      // Filling
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      // Reversing the prjection
      ctx.rotate(-Math.PI / 2);
      ctx.translate(-x, -y);
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
        Math.round(Math.random() * (this.max_x + this.size)),
        Math.round(Math.random() * (this.max_y + this.size))
      ]
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
        color = createColor();
        drawPolygon(ctx, pos[0], pos[1], 6,this.size, color);
      }
    };
    Polygons.prototype.getControls = function controls() {
      return [
        {
          id: "poly_count",
          label: "Count",
          type: "range",
          min_value: 100,
          max_value: 10000,
          value: 1000
        },
        {
          id: "sides",
          label: "Sides",
          type: "range",
          min_value: 3,
          max_value: 12,
          value: 6
        }
      ]
    }
    /**
     * Dots
     */
    function drawDot(ctx, x, y, radius, color) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }
    
    function Dots(selector, count, radius) {
      this.canvas = new Canvas(selector);
      this.count = count;
      this.radius = radius;
    }
    Dots.prototype.draw = function draw() {
      const ctx = this.canvas.getContext();
      ctx.clearRect(0, 0, this.max_x, this.max_y);
      // Calculatin dots distribution
      const ratio = (this.canvas.elem.width * 1.0) /  this.canvas.elem.height;
      const y_count = Math.sqrt(this.count / ratio);
      const x_count = Math.round(ratio * y_count);
      // y_count = Math.round(y_count);
      // Updating the count
      let actual_count = Math.round(x_count) * Math.round(y_count);
      const step = this.canvas.elem.width / x_count;
      let x = (this.canvas.elem.width - step * x_count) / 2,
          y =  - (this.canvas.elem.height - step * y_count) / 2;
      while (actual_count > 0) {
        if ((actual_count % x_count) === 0) {
          x = step / 2;
          y += step;
        }
        drawDot(ctx, x, y, this.radius, createColor(0.5, 0.7));
        x += step;
        actual_count -= 1;
      }
    }
    /**
     * Draws a line by in the direction teta. After moving dis_from center
     * in direction teta draws a disance long line stroke wide.
     * At the head returning the drawing head back to the starting point
     */
    function drawLine(ctx, teta, length, dis_from_center, stroke) {
      const factor_x = Math.cos(teta),
            factor_y = Math.sin(teta),
            distance = length + dis_from_center;
      ctx.beginPath();
      ctx.moveTo(Math.round(dis_from_center * factor_x), Math.round(dis_from_center * factor_y));
      ctx.lineTo(Math.round(distance * factor_x), Math.round(distance * factor_y));
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
   
    function Lines(selector, count, length, distance_from_center, variaty, coloration) {
      /**
       * Draws a circle of lines around the center.
       * selector - The selector of the canvas, required
       * count - The number of lines to draw
       * Length - The length of the line to draw. px
       * distance_from the center - How far from the center to start drawing. px
       * variaty - How much random viarity to add to distance_from_center. px
       * coloration - type of coloration to use. See coloration info for more details
       */
      this.canvas = new Canvas(selector);
      this.count = (count)? count : 50;
      this.length = (length)? length : 200.0;
      this.distance_from_center = (distance_from_center)? distance_from_center : 30.0;
      this.variaty = (variaty)? variaty : 5;
      this.coloration = (coloration)? coloration : 'bw';
    }
    Lines.prototype.draw = function draw() {
      const ctx = this.canvas.getContext();
      const step = 2 * Math.PI / this.count;  // The angle for each line
      // Moving to the center of the canvas
      ctx.translate(this.canvas.elem.width / 2, this.canvas.elem.height / 2);
      let variation = 0;
      for (let i = 0;i < this.count; i++) {
        variation = Math.round(Math.random() * this.variaty - (this.variaty / 2));
        drawLine(ctx, i * step, this.length, this.distance_from_center + variation);
      }
    }

    return {
      // Setting up polygons
      polygons: new Polygons('#polygons', 2000, 30),
      dots: new Dots('#dots', 60, 10),
      lines: new Lines('#lines'),
      run: function run() {
        this.polygons.draw();
        this.dots.draw();
        this.lines.draw();
      }
    };
  }
  window.Art = Art(window);
})(window);

