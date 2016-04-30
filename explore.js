

	var map;
	var overlayLayers;
	var overlaySelected;
	var baseLayers; // base layers include Google, Bing and OS maps, and OpenStreetMap
	var opacity = 1;

// The parameters for the British National Grid - EPSG:27700

	proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs");


// This code below converts the lat lon into a British National Grid Reference. With thanks from http://www.movable-type.co.uk/scripts/latlong-gridref.html NT261732

    function gridrefNumToLet(e, n, digits) {
        // get the 100km-grid indices
        var e100k = Math.floor(e / 100000),
        n100k = Math.floor(n / 100000);

        if (e100k < 0 || e100k > 6 || n100k < 0 || n100k > 12) return '';

        // translate those into numeric equivalents of the grid letters
        var l1 = (19 - n100k) - (19 - n100k) % 5 + Math.floor((e100k + 10) / 5);
        var l2 = (19 - n100k) * 5 % 25 + e100k % 5;

        // compensate for skipped 'I' and build grid letter-pairs
        if (l1 > 7) l1++;
        if (l2 > 7) l2++;
        var letPair = String.fromCharCode(l1 + 'A'.charCodeAt(0), l2 + 'A'.charCodeAt(0));

        // strip 100km-grid indices from easting & northing, and reduce precision
        e = Math.floor((e % 100000) / Math.pow(10, 5 - digits / 2));
        n = Math.floor((n % 100000) / Math.pow(10, 5 - digits / 2));

        Number.prototype.padLZ = function(w) {
            var n = this.toString();
            while (n.length < w) n = '0' + n;
            return n;
        }

        var gridRef = letPair + e.padLZ(digits / 2) + n.padLZ(digits / 2);

        return gridRef;
    }
	function gridrefLetToNum(gridref) {
	  // get numeric values of letter references, mapping A->0, B->1, C->2, etc:
	  var l1 = gridref.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
	  var l2 = gridref.toUpperCase().charCodeAt(1) - 'A'.charCodeAt(0);
	  // shuffle down letters after 'I' since 'I' is not used in grid:
	  if (l1 > 7) l1--;
	  if (l2 > 7) l2--;

	  // convert grid letters into 100km-square indexes from false origin (grid square SV):
	  var e = ((l1-2)%5)*5 + (l2%5);
	  var n = (19-Math.floor(l1/5)*5) - Math.floor(l2/5);

	  // skip grid letters to get numeric part of ref, stripping any spaces:
	  gridref = gridref.slice(2).replace(/ /g,'');

	  // append numeric part of references to grid index:
	  e += gridref.slice(0, gridref.length/2);
	  n += gridref.slice(gridref.length/2);

	  // normalise to 1m grid, rounding up to centre of grid square:
	  switch (gridref.length) {
		case 2: e += '5000'; n += '5000'; break;
	    case 4: e += '500'; n += '500'; break;
	    case 6: e += '50'; n += '50'; break;
	    case 8: e += '5'; n += '5'; break;
	    // 10-digit refs are already 1m
	  }

	  return [e, n];
	}



// OpenStreetMap
	var osm = new ol.layer.Tile({
	                        title: 'Background map - OpenStreetMap',
	  source: new ol.source.OSM({
	    // attributions: [ol.source.OSM.DATA_ATTRIBUTION],
	    url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	  })/*,
	  opacity: 0.7*/
	});


       var mapMQ = new ol.layer.Tile({
		title: 'Background map - MapQuest Map',
		type: 'base', 
                source: new ol.source.MapQuest({
                            layer: 'osm'
                })
        });

       var mapMQsat = new ol.layer.Tile({
		title: 'Background map - MapQuest Satellite',
		type: 'base', 
                source: new ol.source.MapQuest({
                            layer: 'sat'
                })
        });

       var mapMQhyb = new ol.layer.Tile({
		title: 'Background map - MapQuest Hybrid',
		type: 'base', 
                source: new ol.source.MapQuest({
                            layer: 'hyb'
                })
        });

// Bing API key - please generate your own

	var BingapiKey = "AgS4SIQqnI-GRV-wKAQLwnRJVcCXvDKiOzf9I1QpUQfFcnuV82wf1Aw6uw5GJPRz";

	var BingSatellite =   new ol.layer.Tile({
		title: 'Background map - Bing Satellite',
		type: 'base', 
	        source: new ol.source.BingMaps({
			key: BingapiKey,
			imagerySet: 'Aerial'
		    })
	});

// Bing layers

	var BingRoad = new ol.layer.Tile({
	         title: 'Background map - Bing Road',
	         type: 'base',
	         source: new ol.source.BingMaps({
		      key: BingapiKey,
		      imagerySet: 'Road'
		    })
	});

	var BingAerialWithLabels = new ol.layer.Tile({
	          title: 'Background map - Bing Hybrid',
	          type: 'base',
	          source: new ol.source.BingMaps({
			key: BingapiKey,
			imagerySet: 'AerialWithLabels'
		})
	});


// Stamen layers
	var StamenWatercolor =  new ol.layer.Tile({
	           title: 'Background map - Water color',
	           type: 'base',
	           source: new ol.source.Stamen({
	                  layer: 'watercolor'
	           })
	});


	var OS1920s =  	new ol.layer.Tile({
	            title: 'Background map - OS 1920s',
	            type: 'base',
		    source: new ol.source.XYZ({
			          attributions: [
			            new ol.Attribution({html: '<a href=\'http://maps.nls.uk/projects/api/\'>NLS Historic Maps API</a>'})
			          ],
				url: 'http://geo.nls.uk/maps/api/nls/{z}/{x}/{y}.jpg',
				// minZoom: 10,
				maxZoom: 13,
				tilePixelRatio: 1
		})
          });


	var OSOpendata = new ol.layer.Tile({
	              title: 'Background map - OS Opendata',
	              type: 'base',
		      source: new ol.source.XYZ({
				    url: 'http://geo.nls.uk/maps/opendata/{z}/{x}/{y}.png',
				    // minZoom: 10,
				    maxZoom: 16,
				    tilePixelRatio: 1
				  })
	                    });

// an array of the base layers listed above

	var baseLayers = [ BingAerialWithLabels, BingSatellite, BingRoad, osm, OSOpendata, OS1920s, mapMQ, mapMQsat ];


// sets up the base layers as a set of radio buttons

	    var layerSelect = document.getElementById('layerSelect');
	    for (var x = 0; x < baseLayers.length; x++) {
	        // if (!baseLayers[x].displayInLayerSwitcher) continue;
	        var option = document.createElement('option');
		option.appendChild(document.createTextNode(baseLayers[x].get('title')));
	        option.setAttribute('value', x);
	        option.setAttribute('id', 'baseOption' + baseLayers[x].get('title'));
	        layerSelect.appendChild(option);
	    }

// a generic attribution variable for NLS historic map tilesets
	
	var NLS_attribution = new ol.Attribution({
	  html: 'Historic Map Layer courtesy of the <a href="http://maps.nls.uk/">National Library of Scotland</a>' 
	});

// NLS historic map overlay layers

    var oneinch2nd = new ol.layer.Tile({
	title: "OS One Inch, 1885-1900 - Outline",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/maps/os/1inch_2nd_ed/{z}/{x}/{-y}.png",
				attributions: [NLS_attribution],
				minZoom: 8,
				maxZoom: 15
		  }),
        type: 'overlay', 
        visible: false
    });

    var oneinchseventh = new ol.layer.Tile({
	title: "OS One Inch 7th series, 1955-61",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/os/seventh/{z}/{x}/{-y}.png",
				attributions: [NLS_attribution],
				minZoom: 8,
				maxZoom: 16
		  }),
        type: 'overlay', 
        visible: false
    });

    var bartgreatbritain = new ol.layer.Tile({
	title: "Bartholomew Half Inch, 1897-1907",
	source: new ol.source.XYZ({
				url: "http://geo.nls.uk/mapdata2/bartholomew/great_britain/{z}/{x}/{-y}.png",
				attributions: [NLS_attribution],
				minZoom: 8,
				maxZoom: 14
		  }),
        type: 'overlay', 
        visible: false
    });


	overlayLayers = [oneinch2nd, oneinchseventh, bartgreatbritain];

// Change the layer in this line below to the initial overlay layer that is set to true

	oneinch2nd.setVisible(true);

// the main ol map class, with two layers and defaulting to a specific view

		var map = new ol.Map({
		  target: 'map',
		  renderer: 'canvas',
		  layers: [BingAerialWithLabels, oneinch2nd],
		  controls: ol.control.defaults({ attributionOptions: { collapsed: true, collapsible: true }}),
		  logo: false,
		  view: new ol.View({
		    center: ol.proj.transform([-4.0, 56.0], 'EPSG:4326', 'EPSG:3857'),
		    zoom: 5
		  })
		});



// Change base layer

	var changemap = function(index) {
	  map.getLayers().removeAt(0);
	  map.getLayers().insertAt(0,baseLayers[index]);
	}


// add the OL ZoomSlider and ScaleLine controls

    map.addControl(new ol.control.ZoomSlider());
    map.addControl(new ol.control.ScaleLine({ units:'metric' }));

    var mouseposition = new ol.control.MousePosition({
            projection: 'EPSG:4326',
            coordinateFormat: function(coordinate) {
	    // BNG: ol.extent.applyTransform([x, y], ol.proj.getTransform("EPSG:4326", "EPSG:27700"), 
		var coord27700 = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:27700');
		var templatex = '{x}';
		var outx = ol.coordinate.format(coord27700, templatex, 0);
		var templatey = '{y}';
		var outy = ol.coordinate.format(coord27700, templatey, 0);
		NGR = gridrefNumToLet(outx, outy, 6);
		var hdms = ol.coordinate.toStringHDMS(coordinate);
		if ((outx  < 0) || (outx > 700000 ) || (outy < 0) || (outy > 1300000 )) {
	        return '<strong>' + ol.coordinate.format(coordinate, '{x}, {y}', 4) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;'; 
		}
		else 
                { return '<strong>' + NGR + '</strong>&nbsp; <br/>' + ol.coordinate.format(coord27700, '{x}, {y}', 0) + 
			'&nbsp; <br/>' + ol.coordinate.format(coordinate, '{y}, {x}', 4) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;'; }
            	}
    });

    map.addControl(mouseposition);


   
// sets up the overlay layers as a set of radio buttons

       var overlaySelect = document.getElementById('overlaySelect');
           for (var x = 0; x < overlayLayers.length; x++) {
              var checked = (overlayLayers[x].getVisible()) ? "checked" : "";
              overlaySelect.innerHTML += '<p><input type="radio" name="overlay" id="overlayRadio'+ overlayLayers[x].get('title') + '" value="' + x + '" onClick="switchOverlay(this.value)" ' + checked + '><span>' + overlayLayers[x].get('title') + '</span></p>';
       }


// function to change the overlay layer

       function switchOverlay(index) {
		map.getLayers().getArray()[1].setVisible(false);
		map.getLayers().removeAt(1);
		map.getLayers().insertAt(1,overlayLayers[index]);
		overlaySelected = overlayLayers[index];
	    	overlaySelected.setVisible(true);
	}

// Sets up an opacity slider on the overlay layer

   jQuery( document ).ready(function() {
	jQuery('#mapslider').slider({
	  formater: function(value) {
	    opacity = value / 100;
	    map.getLayers().getArray()[1].setOpacity(opacity);
	    // overlay.layer.setOpacity(opacity);
	    return 'Opacity: ' + value + '%';
	  }
	});
    });


// Initialize the Gazetteer with autocomplete and County+Parish selector

	nlsgaz(function(minx,miny,maxx,maxy){

      // zoom to gridref
      if (miny == null) {
         var osgbnum = gridrefLetToNum(minx);
	 // console.log(osgbnum);
         // var osgb = new OpenLayers.LonLat(osgbnum[0], osgbnum[1]);
	 point27700 = [];
	 point27700.push(parseFloat(osgbnum[0]), parseFloat(osgbnum[1]));
	 // console.log(point27700);
	 point3857 = [];
	 point3857 = ol.proj.transform(point27700,"EPSG:27700", "EPSG:3857");
	 var a = map.getView().setCenter(point3857);
    	 var b = map.getView().setZoom(6+minx.length);

	 return a && b;

      }
      // zoom to bbox
      var extent = [minx, miny, maxx, maxy];
        extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
        map.getView().fitExtent(extent, map.getSize());
       
	if (map.getView().getZoom() > 16 )
	{map.getView().setZoom(16);}

     });


	


