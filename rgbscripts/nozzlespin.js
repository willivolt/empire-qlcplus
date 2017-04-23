// Development tool access
var testAlgo;

(
  function()
  {
    var algo = new Object;
    algo.apiVersion = 2;
    algo.name = "NozzleSpin";
    algo.author = "willivolt";
    algo.acceptColors = 1;

    algo.rotation = 0;
    algo.properties = new Array();
    algo.properties.push("name:rotation|type:list|display:Rotation|values:CW,CCW|write:setRotation|read:getRotation");

    var util = new Object;
    util.initialized = false;
    util.color = 0xFF0000;
    util.ringCount = 5;
    util.ringPixelCounts = [423, 457, 480, 502, 513];
    util.rings = [new Array(), new Array(), new Array(), new Array(), new Array()];

    util.getRingPixelCount = function(_ringNum)
    {
        return util.ringPixelCounts[_ringNum];
    }

    util.getRing = function(_ringNum) 
    {
        return util.rings[_ringNum]
    }

    util.initialize = function(_rgb)
    {
        //alert("initilize");
        util.color = _rgb;
        for (var ringNum = 0; ringNum < util.ringCount; ringNum++) {
            var ring = util.getRing(ringNum);
            var ringSize = util.getRingPixelCount(ringNum);
            var pixelNum = 0;
            for (; pixelNum < ringSize/4; pixelNum++) {
                ring[pixelNum] = util.color;
            }
            for (; pixelNum < ringSize; pixelNum++) {
                ring[pixelNum] = 0;
            }
        }
        util.initialized = true;
    }

    util.getNextFrame = function( _width, _height, _step, _rotation) {
        //alert("getNextFrame");
        var result = new Array();
        for (var y = 0; y < _height; y++) {
            //alert("y=" + y);
            var row = new Array();
            if (y < util.ringCount) {
                // Fill first part of row with ring pixels
                row = row.concat(util.getRing(y));
            }
            // Pad row with black
            for (var x = row.length-1; x < _width; x++) {
               // alert("x=" + x);
                row[x] = 0;
            }
            result[y] = row;
        }

        // counter rotate rings
        for (var i = 0; i < 5; i++) {
            var dir = Boolean(_rotation);
            for (var j = 0; j < util.ringCount; j++) {
                var ring = util.getRing(j);
                if (dir) {
                    ring.push(ring.shift());
                } else {
                    ring.unshift(ring.pop());
                }
                dir = !dir;
            }
        }

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
            util.initialize(rgb);
        }
        return util.getNextFrame(width, height, step, algo.getRotation());
    }

    algo.rgbMapStepCount = function(width, height)
    {
        return util.getRingPixelCount(4);
    }

    // Development tool access
    testAlgo = algo;

    return algo;
  }
)()