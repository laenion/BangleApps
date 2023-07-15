# Routing

This offline GPS navigation system tries to simulate a navigation system you
would find in a car or on your phone, showing you the distance and directions
to the next waypoint.
To do so a route will have to be prepared and uploaded to the watch, which can
be done using the included interface.

An alternative is the excellent **Gipy** application, which will make you
follow a path instead.

It is untested on Banglejs1. If you can try it, you would be welcome.

## Features

- Checks for the closest waypoint
- Shows a large arrow to show the direction at the next waypoint
- Shows directions in text form, usually the road name you have to turn into
- Shows distance to the next waypoint
- Buzzes before reaching the next waypoint; it will adjust to the current
  speed, so the app can be used for walking, cycling or travelling by car
- Upon reaching a waypoint, immediately show the next waypoint information

## Usage

### Uploading a route

First you have calculate a route; to do so click the floppy disk icon to open
the configuration dialog and enter both your start and end distination into
the two fields on the map. Confirm your input with the enter key.

Then just click upload to upload that route onto your watch. It's currently
using OSRM (OpenStreetMap Routing; https://project-osrm.org/).

## Limitations

- Currently only the distance to the next waypoint (i.e. air distance) is
  shown instead of the actual distance. This would require storing the actual
  path (which would be available from the routing data), but for longer routes
  this would exceed the storage capacity of the watch.
- Due to that the application will also switch back and forth between several
  waypoints if there are multiple street layers, such as ramps to or from a
  highway where you go in circles.
- The gps might take a long time to start initially; use the **Assisted GPS
  Updater (AGPS)** before use to significantly reduce the time to get a GPS
  fix.
- Sometimes the GPS signal isn't the best and reaching a checkpoint may not
  be detected in time. If the next checkpoint is further away you will see
  the (increasing) distance to the previous one instead until half of the
  distance is reached.

## TODO

- Add more routing proiders (e.g. GraphHopper)
