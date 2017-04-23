// Development tool access
var testAlgo;

(
  function()
  {
    var algo = new Object;
    algo.apiVersion = 2;
    algo.name = "NeoSpin";
    algo.author = "willivolt";
    algo.acceptColors = 1;

    algo.rotation = 0;
    algo.properties = new Array();
    algo.properties.push("name:rotation|type:list|display:Rotation|values:CW,CCW|write:setRotation|read:getRotation");

    var util = new Object;
    util.initialized = false;
    util.color = 0xFF0000;
    util.outerRing = new Array(24);
    util.innerRing = new Array(12);

    util.initialize = function(rgb, width, height)
    {
        util.color = rgb;
        for (i = 0; i < 12; i++) {
            util.outerRing[i] = util.color;
        }
        for (i = 12; i < 24; i++) {
            util.outerRing[i] = 0;
        }
        for (i = 0; i < 6; i++) {
            util.innerRing[i] = util.color;
        }
        for (i = 6; i < 12; i++) {
            util.innerRing[i] = 0;
        }
        util.initialized = true;
    }

    util.getNextFrame = function(width, height, rotation) {
        fill = new Array();
        while (fill.length < width) {
            fill = fill.concat(util.outerRing);
            fill = fill.concat(util.innerRing);
        }
        result = new Array();
        for (i = 0; i < height; i++) {
            result[i] = fill;
        }
        if (rotation == 1) {
            util.outerRing.push(util.outerRing.shift());
            util.innerRing.unshift(util.innerRing.pop());
        } else {
            util.outerRing.unshift(util.outerRing.pop());
            util.innerRing.push(util.innerRing.shift());
        }
        //alert('outerRing=' + util.outerRing);
        return result;
    }

    algo.setRotation = function(_rotation)
    {
        if (_rotation == "CCW") {
            algo.rotation = 1;
        } else {
            algo.rotation = 0;
        }
    }

    algo.getRotation = function(_rotation)
    {
        if (algo.rotation == 0) {
            return "CW";
        } else {
            return "CCW";
        }
    }


    algo.rgbMap = function(width, height, rgb, step)
    {
        if (util.initialized == false || rgb != util.color) {
            util.initialize(rgb, width, height);
        }
        return util.getNextFrame(width, height, algo.rotation);
    }

    algo.rgbMapStepCount = function(width, height)
    {
        return 24;
    }

    // Development tool access
    testAlgo = algo;

    return algo;
  }
)()