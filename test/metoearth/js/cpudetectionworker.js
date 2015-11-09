self.addEventListener('message', function(e) {
  // run worker for 4 ms
  var st = Date.now();
  var et = st + 4;
  while(Date.now() < et);
  self.postMessage({st: st, et: et});
  self.close();
});