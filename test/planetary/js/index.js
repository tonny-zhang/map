(function() {
  // http://www.jasondavies.com/maps/raster/
  // http://www.jasondavies.com/maps/gilbert/
  var canvas = document.getElementById('quakeCanvas');

  // Create our Planetary.js planet and set some initial values;
  // we use several custom plugins, defined at the bottom of the file
  var planet = planetaryjs.planet();
  window.planet = planet;
  planet.loadPlugin(autocenter({
    // extraHeight: -120
  }));
  planet.loadPlugin(autoscale({
    // extraHeight: -120
  }));
  planet.loadPlugin(planetaryjs.plugins.earth({
    topojson: {
      file: './world-110m.json'
    },
    oceans: {
      fill: '#001320'
    },
    land: {
      fill: '#06304e'
    },
    borders: {
      stroke: '#001320'
    }
  }));
  planet.loadPlugin(planetaryjs.plugins.pings());
  planet.loadPlugin(planetaryjs.plugins.zoom({
    scaleExtent: [50, 5000]
  }));
  planet.loadPlugin(planetaryjs.plugins.drag({
    onDragStart: function() {
      this.plugins.autorotate.pause();
    },
    onDragEnd: function() {
      this.plugins.autorotate.resume();
    }
  }));
  // planet.loadPlugin(hebei());
  planet.loadPlugin(micaps());
  // planet.loadPlugin(jumpZoom());

  planet.loadPlugin(autorotate(5));
  planet.projection.rotate([-100, -30, -5]);
  planet.draw(canvas);



  // Plugin to resize the canvas to fill the window and to
  // automatically center the planet when the window size changes
  function autocenter(options) {
    options = options || {};
    var needsCentering = false;
    var globe = null;

    var resize = function() {
      var width = window.innerWidth + (options.extraWidth || 0);
      var height = window.innerHeight + (options.extraHeight || 0);
      globe.canvas.width = width;
      globe.canvas.height = height;
      globe.projection.translate([width / 2, height / 2]);
    };

    return function(planet) {
      globe = planet;
      planet.onInit(function() {
        needsCentering = true;
        d3.select(window).on('resize', function() {
          needsCentering = true;
        });
      });

      planet.onDraw(function() {
        if (needsCentering) {
          resize();
          needsCentering = false;
        }
      });
    };
  };

  // Plugin to automatically scale the planet's projection based
  // on the window size when the planet is initialized
  var global_width, global_height;
  function autoscale(options) {
    options = options || {};
    return function(planet) {
      planet.onInit(function() {
        var width = window.innerWidth + (options.extraWidth || 0);
        var height = window.innerHeight + (options.extraHeight || 0);
        global_width = width;
        global_height = height;
        planet.projection.scale(Math.min(width, height) / 2);
      });
    };
  };

  // Plugin to automatically rotate the globe around its vertical
  // axis a configured number of degrees every second.
  function autorotate(degPerSec) {
    return function(planet) {
      var lastTick = null;
      var paused = false;
      planet.plugins.autorotate = {
        pause: function() {
          paused = true;
        },
        resume: function() {
          paused = false;
        }
      };
      planet.onDraw(function() {
        if (paused || !lastTick) {
          lastTick = new Date();
        } else {
          var now = new Date();
          var delta = now - lastTick;
          var rotation = planet.projection.rotate();
          rotation[0] += degPerSec * delta / 1000;
          if (rotation[0] >= 180) rotation[0] -= 360;
          planet.projection.rotate(rotation);
          lastTick = now;
        }
      });
    };
  };
  
  function getRandomC(){
    return Math.floor(Math.random()*255);
  }
  function getRandomColor(){
    return 'rgba('+getRandomC()+', '+getRandomC()+', '+getRandomC()+', 0.9)'
  }
  function hebei(){
    return function(planet){
      var data_loaded;
      planet.onInit(function() {
        d3.json('http://10.14.85.116/nodejs_project/GraphTool/core/data/hebei.json', function(err, data){
          data_loaded = data;
          // data_loaded = land;
          console.log('hebei', data_loaded);
        });
      });
      planet.onDraw(function(){
        planet.withSavedContext(function(context) {
          context.beginPath();
          planet.path.context(context)(data_loaded);
          context.fillStyle = 'rgba(255, 0, 0, 0.5)';
          context.fill();

          context.strokeStyle = '#ffffff';
          context.stroke();
        })
      })
    }
  }
  function micaps(){
    return function(){
      var data_loaded = []
      var url = 'http://10.14.85.116/nodejs_project/micaps/data/micaps/14/15071014.024.json';
      var url = 'http://10.14.85.116/nodejs_project/micaps/data/micaps/14/rr012608/rr012608.048.json';
      planet.onInit(function() {
        d3.json(url, function(err, data){
          console.log(data);
          data_loaded = []
          for(var i = 0, areas = data.areas, j = areas.length; i<j; i++){
            var area = areas[i];
            var items = area.items;
            var c = [];
            for(var i_item = 0, j_item = items.length; i_item<j_item; i_item++){
              var v = items[i_item];
              c.push([v.x, v.y]);
            }
            var last_item = c[c.length - 1];
            var first_item = c[0];
            if(last_item[0] != first_item[0] || last_item[1] != first_item[1]){
              c.push(first_item);
            }
            data_loaded.push({
              "type": "Feature",
              "geometry": {
                "type": "Polygon",
                "coordinates": [c]
              },"properties": {
                // color: getRandomColor()
                color: getColor(parseFloat(area.symbols.text), area.code)
              }
            });
          }
          console.log('data_loaded', data_loaded);
          // console.log(JSON.stringify(data_loaded))
        });
      });
      planet.onDraw(function(){
        for(var i = 0, j = data_loaded.length; i<j; i++){
          planet.withSavedContext(function(context) {
            var feature = data_loaded[i];
            context.beginPath();
            planet.path.context(context)(feature);
            context.fillStyle = feature.properties.color || 'rgba(0, 255, 0, 0.3)';
            context.fill();

            context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            context.stroke();
          })
        }
      })
    }
  }

  function micaps(){
    function getArea(points){
      var len = points.length;
      if(len > 0){
        var S = 0;
        for(var i = 0, j = len - 1; i<j; i++){
          var p_a = points[i],
            p_b = points[i + 1];
          S += p_a.x * p_b.y - p_b.x*p_a.y;
        }
        var p_a = points[j],
          p_b = points[0];
        S += p_a.x * p_b.y - p_b.x*p_a.y;
        return S/2;
      }
      return 0;
    }
    return function(){
      var data_loaded = [];
      var url = './data/1.json';
      // var url = './data/2.json';
      // var url = './data/3.json'
      planet.onInit(function() {
        d3.json(url, function(err, data){
          data.areas.forEach(function(v){
            var c = [];
            if(getArea(v.items) > 0){
              v.items.reverse();
            }
            v.items.forEach(function(item){
              c.push([item.x, item.y]);
            });
            data_loaded.push({
              "type": "Feature",
              "geometry": {
                "type": "Polygon",
                "coordinates": [c]
              },"properties": {
                // color: getRandomColor()
                color: v.c
              }
            });
          });
        })
      })
      planet.onDraw(function(){
        for(var i = 0, j = data_loaded.length; i<j; i++){
          planet.withSavedContext(function(context) {
            var feature = data_loaded[i];
            context.beginPath();
            planet.path.context(context)(feature);
            context.fillStyle = feature.properties.color || 'rgba(0, 255, 0, 0.3)';
            context.fill();

            context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            context.stroke();
          })
        }
      });
    }
  }

  // function jumpZoom(){
  //   return function(){
  //     planet.onInit(function() {
  //       function zoomTo(location, scale) {console.log(location, scale);
  //         var point = planet.projection(location);
  //         var zoom = d3.behavior.zoom()
  //         return zoom
  //             .translate([global_width / 2 - point[0] * scale, global_height / 2 - point[1] * scale])
  //             .scale(scale);
  //       }
  //       function jump() {
  //         var sf = [-122.417, 37.775],
  //           ny = [-74.0064, 40.7142];
  //         var t = d3.select(this);
  //         (function repeat() {console.log('repeat');
  //           t = t.transition()
  //               .call(zoomTo(ny, 6).event)
  //             .transition()
  //               .call(zoomTo(sf, 4).event)
  //               .each("end", repeat);
  //         })();
  //       }
  //       d3.select("canvas").each(jump);
  //     });
  //     planet.onDraw(function(){});
  //   }
  // }
  // var degrees = 180 / Math.PI,
  //   ratio = window.devicePixelRatio || 1,
  //   p = ratio;

  // var canvas = d3.select("canvas");
  // var c = canvas.node().getContext("2d");
  // var path = planet.path;
  // var projection = planet.projection;
  // var zoom = d3.geo.zoom()
  //     .projection(projection)
  //     .duration(function(S) { return 2000 * Math.sqrt(S); }) // assume ease="quad-in-out"
  //     .scaleExtent([global_height / 2 - 1, Infinity])
  //     .on("zoom", function() {
  //       projection.clipAngle(Math.asin(Math.min(1, .5 * Math.sqrt(global_width * global_width + global_height * global_height) / projection.scale())) * degrees);
  //       c.clearRect(0, 0, global_width * ratio, global_height * ratio);
  //       // c.strokeStyle = "#999", c.lineWidth = .25 * ratio, c.beginPath(), path(graticule), c.stroke();
  //       c.fillStyle = "#69d2e7", c.beginPath(), path(land), c.fill();
  //       // c.fillStyle = "#f00", c.beginPath(), path(countries[i0]), c.fill();
  //       // c.fillStyle = "#f00", c.beginPath(), path(countries[i]), c.fill();
  //       c.strokeStyle = "#fff", c.lineWidth = .5 * ratio, c.beginPath(), path(borders), c.stroke();
  //       c.strokeStyle = "#000", c.lineWidth = .5 * ratio, c.beginPath(), path(globe), c.stroke();
  //     })
  //     .on("zoomend", transition);
  // var countries = [[-122.417, 37.775], [-74.0064, 40.7142]];
  // var i = 0
  // function transition() {
  //   console.log(2, canvas);
  //   zoomBounds(projection, countries[(i = i++ % countries.length)]);
  //   canvas.transition()
  //       .ease("quad-in-out")
  //       .duration(2000) // see https://github.com/mbostock/d3/pull/2045
  //       .call(zoom.projection(projection).event);
  // }
  // function zoomBounds(projection, o) {
  //   var centroid = d3.geo.centroid(o),
  //       clip = projection.clipExtent();

  //   projection
  //       .rotate(zoom.rotateTo(centroid))
  //       .clipExtent(null)
  //       .scale(1)
  //       .translate([0, 0]);

  //   var b = path.bounds(o),
  //       k = Math.min(1000, .45 / Math.max(Math.max(Math.abs(b[1][0]), Math.abs(b[0][0])) / global_width, Math.max(Math.abs(b[1][1]), Math.abs(b[0][1])) / global_height));

  //   projection
  //       .clipExtent(clip)
  //       .scale(k)
  //       .translate([global_width / 2, global_height / 2]);
  // }   
  // canvas.call(zoom).call(zoom.event);
  // console.log(1, canvas);
})();