import Bounds from './Bounds';

var getBounds = function(map) {
  var bounds = map.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  var bottom = sw.lat();
  var left = sw.lng();
  var top = ne.lat();
  var right = ne.lng();
  return {
    top: top,
    left: left,
    right: right,
    bottom: bottom
  }
};

var TileBounds = function(){};
TileBounds.world = new Bounds([-180, -90, 180, 90]);
TileBounds.tileParamsForRegion = function(args) {
    var bounds = args.bounds;
    var tilesPerScreen = args.tilesPerScreen;

    var origBounds = new Bounds(bounds);
    bounds = origBounds.unwrapDateLine(TileBounds.world);

    var res = {
      bounds: origBounds,
      unwrappedBounds: bounds,
      width: bounds.getWidth(),
      height: bounds.getHeight(),
      worldwidth: TileBounds.world.getWidth(),
      worldheight: TileBounds.world.getHeight(),

      toString: function () {
        return "\n" + Object.items(this
          ).filter(function (item) { return item.key != "toString" && item.key != "stack"; }
          ).map(function (item) { return "  " + item.key + "=" + item.value.toString(); }
          ).join("\n") + "\n";
      }
    };

    res.level = Math.ceil(Math.log(res.worldwidth / (res.width/Math.sqrt(tilesPerScreen)), 2));

    res.tilewidth = res.worldwidth / Math.pow(2, res.level);
    res.tileheight = res.worldheight / Math.pow(2, res.level);

    res.tileleft = res.tilewidth * Math.floor(bounds.left / res.tilewidth);
    res.tileright = res.tilewidth * Math.ceil(bounds.right / res.tilewidth);
    res.tilebottom = res.tileheight * Math.floor(bounds.bottom / res.tileheight);
    res.tiletop = res.tileheight * Math.ceil(bounds.top / res.tileheight);

    res.tilesx = (res.tileright - res.tileleft) / res.tilewidth;
    res.tilesy = (res.tiletop - res.tilebottom) / res.tileheight;

    return res;
  };

  TileBounds.tileBoundsForRegion = function(args) {
    /* Returns a list of tile bounds covering a region. */
    var bounds = args.bounds;
    var tilesPerScreen = args.tilesPerScreen;

    var params = TileBounds.tileParamsForRegion(args);

    var res = [];
    for (var x = 0; x < params.tilesx; x++) {
      for (var y = 0; y < params.tilesy; y++) {
        res.push(new Bounds([
          params.tileleft + x * params.tilewidth,
          params.tilebottom + y * params.tileheight,
          params.tileleft + (x+1) * params.tilewidth,
          params.tilebottom + (y+1) * params.tileheight
        ]).rewrapDateLine(TileBounds.world));
      }
    }

    return {
      set: res,
      tilesPerScreen: 1,
      params: params
    }
  };



var getTiles = function(bounds){
  var result = TileBounds.tileBoundsForRegion({bounds: bounds, tilesPerScreen: 32})
  return result;
}

var getUrls = function(map){
  let bounds = getBounds(map);  
  return getTiles(bounds).set;
}

export default getUrls;
