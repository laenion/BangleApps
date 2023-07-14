var route = [{"text":"Head west on Großweidenmühlstraße","direction":90,"x":49.4572,"y":11.06072},{"text":"Turn left onto Brückenstraße","direction":270,"x":49.45733,"y":11.05911},{"text":"Continue onto Johannisbrücke","direction":0,"x":49.45613,"y":11.05869},{"text":"Continue onto Willstraße","direction":0,"x":49.45512,"y":11.05836},{"text":"Turn left onto Fürther Straße","direction":270,"x":49.45132,"y":11.05481},{"text":"Turn right onto Obere Kanalstraße","direction":90,"x":49.44971,"y":11.05912},{"text":"Continue onto Rothenburger Straße","direction":0,"x":49.44682,"y":11.0574},{"text":"Turn left onto Frankenschnellweg","direction":270,"x":49.44455,"y":11.05483},{"text":"Take the ramp","direction":90,"x":49.41606,"y":11.06722},{"text":"Keep left towards A 3: München","direction":270,"x":49.41473,"y":11.06589},{"text":"Keep left towards München","direction":270,"x":49.41175,"y":11.06566},{"text":"Continue onto A 73","direction":0,"x":49.40866,"y":11.07015},{"text":"Take the ramp towards A 6","direction":90,"x":49.38143,"y":11.1307},{"text":"Keep right towards A 6: Heilbronn","direction":90,"x":49.38027,"y":11.13211},{"text":"Merge left onto A 6","direction":270,"x":49.37296,"y":11.12959},{"text":"Take the ramp","direction":90,"x":49.33353,"y":11.06082},{"text":"Continue onto B 2","direction":0,"x":49.33438,"y":11.06112},{"text":"Take the ramp","direction":90,"x":49.0941,"y":10.98601},{"text":"Turn left onto St 2222","direction":270,"x":49.0953,"y":10.98625},{"text":"Continue straight onto St 2222","direction":0,"x":49.09542,"y":10.98447},{"text":"Enter the traffic circle and take the 1st exit onto WUG 1","direction":90,"x":49.11737,"y":10.84749},{"text":"Exit the traffic circle onto WUG 1","direction":90,"x":49.11743,"y":10.84749},{"text":"Turn right","direction":90,"x":49.13691,"y":10.86715},{"text":"Turn left","direction":270,"x":49.13676,"y":10.86748},{"text":"You have arrived at your destination","x":49.13702,"y":10.86851}];

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
      var projg = Bangle.project({lat: gps.lat, lon: gps.lon});
      var projm = Bangle.project({lat: route[point].x, lon: route[point].y});
      distance[point] = Math.sqrt(Math.pow(projg.x - projm.x, 2) + Math.pow(projg.y - projm.y, 2));
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
    g.drawString(route[closest].text
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
