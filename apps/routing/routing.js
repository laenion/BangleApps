var route = require('Storage').readJSON('route.json', false);

var w = g.getWidth();
var h = g.getHeight();
var prevClosDist = 0;
var prevBuzz = 0;
Bangle.loadWidgets();

Bangle.setGPSPower(true, "routing");
Bangle.on('GPS', function(gps) {
  if (gps.fix != 0) {
    var minDistance = 999999999;
    var closest;
    var distance = [];
    for (var point = 0; point < route.length; point++) {
      var dLat = route[point].x - gps.lat;
      var dLon = route[point].y - gps.lon;
      var a = Math.pow(Math.sin(dLat / 2.0), 2) + Math.pow(Math.sin(dLon / 2.0), 2) * Math.cos(gps.lat) * Math.cos(route[point].x);
      distance[point] = 6378.388 * 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a))
      if (distance[point] < minDistance) {
        minDistance = distance[point];
        closest = point;
      }
    }
    if (prevClosDist < distance[closest] && distance[closest] > 100 && closest < route.length) {
      prevClosDist = distance[closest];
      closest++;
    } else {
      prevClosDist = distance[closest];
    }

    g.setFont("Vector", 15);
    g.setFontAlign(-1, -1);
    g.setColor(0, 0, 0);
    g.clear();
    g.fillPoly(g.transformVertices([
        0, -20,
        20, 0,
        10, 0,
        10, 20,
        -10, 20,
        -10, 0,
        -20, 0
      ], {x:w/2, y:(h/4)+20, scale: 2, rotate:((-route[closest].direction) * Math.PI) / -180}));
    var diststring = Math.round(distance[closest]).toString();
    if (diststring.length > 3)
      diststring = diststring.slice(0, -3) + "." + diststring.slice(-3);
    g.drawString(g.wrapString(route[closest].text, g.getWidth()).join("\n")
      + "\nin " + diststring + "m\n"
      + gps.time.getHours().toString().padStart(2, "0") + ":" + gps.time.getMinutes().toString().padStart(2, "0"), 0, (h/2)+30);
    if (distance[closest] < 50*((gps.speed/10)+1) && prevBuzz != closest) {
      Bangle.buzz();
      prevBuzz = closest;
    }
  } else {
    const now = new Date();
    E.showMessage("No GPS fix. Waiting...\n\n" + now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0"));
  }
  Bangle.drawWidgets();
});
