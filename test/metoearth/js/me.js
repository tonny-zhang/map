
var me_isWebGLSupportedAndEnabled = function()
{
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl"],
            context = false;
 
        for(var i=0;i<names.length;i++) {
            try {
                context = canvas.getContext(names[i]);
                if (context && typeof context.getParameter == "function") {
                    return { isEnabled: true, isSupported: true };
                }
            } catch(e) {}
        }
 
        // WebGL is supported, but disabled
        return { isEnabled: false, isSupported: true };
    }
 
    // WebGL not supported
    return { isEnabled: false, isSupported: false };
};

// test whether blob urls are allowed for workers
var me_testBlobUrlsForWorkers = function(isLocal, callback) {
  if(isLocal) return callback(Worker !== undefined);
  var worker = null;
  var str = 'this.onmessage = function(){ this.postMessage(null); };';
  var blob = new Blob([str], { type: 'text/javascript' });
  var url = URL.createObjectURL(blob);
  try {
    worker = new Worker(url);
    if(worker == null) {
      URL.revokeObjectURL(url);
      callback(false);
      return;
    }
  } catch(err) {
    URL.revokeObjectURL(url);
    callback(false);
    return;
  }
  URL.revokeObjectURL(url);
  worker.onmessage = function(){
    callback(true);
  };
  worker.onerror = function(){
    callback(false);
  };
  worker.postMessage(null);
};

var me_isMobile = function() {
  // adapted js from detectmobilebrowsers.com (includes tablets)
  var isMobile = (function(a){return(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|android|ipad|playbook|silk|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)));})(navigator.userAgent||navigator.vendor||window.opera);
  return isMobile;
}

var me_testCompatibility = function(callback, isLocal) {

  var webgl = me_isWebGLSupportedAndEnabled();
  var isMobile = me_isMobile();

  if(navigator.userAgent) {
    var ffVersionStart = navigator.userAgent.indexOf("Firefox/");
    var ffVersion = parseFloat(navigator.userAgent.substring(ffVersionStart + 8));
    if(ffVersion <= 28.0) {
      webgl.isEnabled = false;
    }
  }

  me_testBlobUrlsForWorkers(isLocal, function(available) {
    var comp = {
      areBlobWorkersAvailable: available,
      webgl: webgl,
      isCompatible: available && webgl.isEnabled,
      isMobile: isMobile
    };
    callback(comp);
  });
};

var me_createView = function(meConfig) {

  if(meConfig.src === undefined) {
    // meConfig.src = "http://www.meteoearth.com/service/";
    meConfig.src = "./js/";
  }

  var meteoEarth = { config: meConfig };

  var loadScript = function(src, callback) {
    var s, r, t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function() {
      if ( !r && (!this.readyState || this.readyState == 'complete') )
      {
        r = true;
        callback();
      }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  };

  if(window.meEngine_CreateView) {
    meEngine_CreateView(meteoEarth);
  } else {
    // load big me_engine async to defer as much traffic as possible
    loadScript(meConfig.src + "me_engine.js", function() { meEngine_CreateView(meteoEarth); });
  }

  return meteoEarth;
};