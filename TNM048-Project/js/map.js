
function worldMap(data,numClusters) {
  //

  var leaflet_map = L.map('mapid', { zoomControl: false }).setView([40.730610, -73.935242], 10);
  L.tileLayer(map_link()).addTo(leaflet_map);

  var svg_map = d3.select(leaflet_map.getPanes()
  .overlayPane).append("svg");
  var g = svg_map.append("g")
  .attr("class", "leaflet-zoom-hide" )
  .attr("id", "svgId");




  var cValue = function(d) { return d;};
  var scaleQuantColor = d3.scale.quantile()
  .range(["#121212","#fddb86","#c7fd86","#fd86c7", "#e31a1c"])
  .domain([0,4]);




  //-------------choropleth to map -----------
  //Count the amount of crimes in each boro
  //place it in topoData
  var topoData = new getData();
  countCrime(data)

  function countCrime(data){
    topoData.features.forEach(boro => {
        boro.properties.amoutOfCrime = 0;
        boro.properties.men_susp = 0;
        boro.properties.women_susp = 0;
        boro.properties.U_susp = 0;
        boro.properties.men_vic = 0;
        boro.properties.women_vic = 0;
        boro.properties.E_vic = 0;
        boro.properties.reported = 0;
        boro.properties.ageSM = 0;
        boro.properties.ageVM = 0;
        var count = count2 = count3 = 0;
        data.features.forEach(element => {
          if(element.properties.Borough.toLowerCase() === boro.properties.BoroName.toLowerCase()){
            boro.properties.amoutOfCrime += 1;
            if(element.properties.Sex_susp === "M")boro.properties.men_susp +=1;
            if(element.properties.Sex_susp === "F")boro.properties.women_susp +=1;
            if(element.properties.Sex_susp === "U")boro.properties.U_susp +=1;
            if(element.properties.Sex_vic === "M")boro.properties.men_vic +=1;
            if(element.properties.Sex_vic === "F")boro.properties.women_vic +=1;
            if(element.properties.Sex_vic === "E")boro.properties.E_vic +=1;
            boro.properties.reported += element.properties.Reported.days;
            if(element.properties.AgeSuspect !== undefined){
              boro.properties.ageSM += element.properties.AgeSuspect;
              count2++;
            }
            if(element.properties.AgeVictim !== undefined){
              boro.properties.ageVM += element.properties.AgeVictim;
              count3++;
            }
          }
        });
        boro.properties.reported /= boro.properties.amoutOfCrime;
        boro.properties.ageSM /= count2;
        boro.properties.ageVM /= count3;
  })
}

  //color depending on crime
  var boroColor = d3.scale.linear()
  .domain([0, 3683])
  .range(['white', 'red']);
  //style of choropleth

  /*Legend specific*/
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(leaflet_map) {

      this._div = L.DomUtil.create("div", "legend");
      this._div.innerHTML += '<span> Crime rate</span><br>';
      topoData.features.forEach(d => {
        this._div.innerHTML += '<i style="background: '+boroColor(d.properties.amoutOfCrime)+'"></i><span>'+d.properties.amoutOfCrime+' Crimes</span><br>';
      })
      this.boroZoom();
      this.update();
  return this._div;

  };

  var buttons = L.control({ position: "bottomleft" });

  buttons.onAdd = function(leaflet_map) {

      this._div = L.DomUtil.create("div", "buttons");


        this._div.innerHTML += '<button id="switchButton1"  class="btn btn-outline-light mr-2">Scatter plot </button>';
        this._div.innerHTML += '<button id="switchButton2"  class="btn btn-outline-light">Heatmap </button>';


  return this._div;

  };


buttons.addTo(leaflet_map);

var infotext = L.control({ position: "topleft" });

infotext.onAdd = function(leaflet_map) {

    this._div = L.DomUtil.create("div", "infotext");
    this._div.innerHTML += '<h3 class="infotext" >Crimes comitted in New York between 2018-19</h3><br>';
    this._div.innerHTML += '<p style="font-size:15px;">Heat map/ scatter plot map </p>';

return this._div;
};

infotext.addTo(leaflet_map);


  legend.update = function(d){
      this._div.innerHTML = '<span> Crime rate</span><br>';
        if(d == undefined) d = {};
        topoData.features.forEach(element => {
          if(d.BoroName === element.properties.BoroName){
            this._div.innerHTML += '<i style="background: '+boroColor(element.properties.amoutOfCrime)+';  border: 2px solid white;'+element.properties.amoutOfCrime+'"></i><b style="color: black;">'+d.amoutOfCrime+' Crimes</b><br>';
          }
          else{
            this._div.innerHTML += '<i style="background: '+boroColor(element.properties.amoutOfCrime)+'"></i><span>'+element.properties.amoutOfCrime+' Crimes</span><br>';
          }
        })

  }

  legend.boroZoom = function(d){
        if(d == undefined) d ={};
        Activated = true;
        this._div.innerHTML = '<b> Crime info of '+ d.BoroName +'</b><br>';
        this._div.innerHTML += '<span> Nr of crimes commited: <b> '+d.amoutOfCrime+'</b></span><br>';
        this._div.innerHTML += '<span> Average nr of days to report:<b> '+Math.round(d.reported)+'</b></span><br>';
        this._div.innerHTML += '<span> Average age of suspect:<b> '+Math.round(d.ageSM)+'</b> </span><br>';
        this._div.innerHTML += '<span> Average age of victim: <b>'+Math.round(d.ageVM)+'</b> </span><br>';
        this._div.innerHTML += '<span> Crimes committed by males: <b>'+d.men_susp+'</b> </span><br>';
        this._div.innerHTML += '<span> Crimes committed by females: <b>'+d.women_susp+' </b></span><br>';
        this._div.innerHTML += '<span> Nr of male victims:<b> '+d.men_vic+' </b></span><br>';
        this._div.innerHTML += '<span> Nr of female victims:<b> '+d.women_vic+' </b></span><br>';
  }
legend.addTo(leaflet_map);
  function choroplethStyle(d) {
    return {

      fillColor: boroColor(d.properties.amoutOfCrime), //'#636363',
      weight: 1.5,
      opacity: 1,
      color: 'black',
      dashArray: '1',
      fillOpacity: 0.5,
      z:-1
    };
  };

    function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });
    legend.update(layer.feature.properties);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    //get textbox and print something?

  }
  function resetHighlight(e) {
    geoJ.resetStyle(e.target);
    //delet text
    legend.update();
  }
  function zoomToFeature(e) {
    legend.boroZoom(e.target.feature.properties);
    //leaflet_map.fitBounds(e.target.getBounds());

  }
  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

  //Add choropleth to map
  var geoJ = L.geoJson(topoData, {
              style: choroplethStyle,
              onEachFeature: onEachFeature
            }).addTo(leaflet_map)

  //-------------------------------------------

  function projectPointsOnMap(x, y){
    if( !isNaN(x) && !isNaN(y)){
      var points = leaflet_map.latLngToLayerPoint(new L.LatLng(x,y));
      this.stream.point(points.x, points.y);
    }
  }


  var transform = d3.geo.transform({point: projectPointsOnMap});
  var d3path = d3.geo.path().projection(transform);

  function applyLatLngToLayer(d) {
    var x = d.geometry.coordinates[0];
    var y = d.geometry.coordinates[1];
    if( !isNaN(x) && !isNaN(y)){
      return leaflet_map.latLngToLayerPoint(new L.LatLng(x, y));
    }
    else{
      return leaflet_map.latLngToLayerPoint(new L.LatLng(0, 0));

    }
  }



  var feature = g.selectAll("circle")
  .data(data.features)
  .enter()
  .append("circle")
  .attr("class", "mapcircle")
  .style("opacity", 0.8)
  .attr('r', 5)
  .style("fill", function(d) {

    return scaleQuantColor(cValue(d.properties.Cluster));
  })
  .on('mouseover', function(d){
    d3.select(this)
    .attr('r', 10)
    var select = d3.select('#infobox')
    select
    .select('#borough')
    .text('Borough: ' + d.properties.Borough.toLowerCase());
    select
    .select('#date')
    .text('Date: ' + d.properties.Date_occurance.string+
    " Time: "+ d.properties.Time_occurance.string);
    select
    .select('#Age')
    .text('Age of criminal: ' + d.properties.AgeSuspect + ' years');
    select
    .select('#report')
    .text(function () {return 'Reported after : ' +  d.properties.Reported.days  + " days";})
    select
    .select('#completed')
    .text('The crime was: ' + d.properties.Completed.toLowerCase());
    select
    .select('#place')
    .text('Place: ' + d.properties.Place. toLowerCase());
    select
    .select('#type')
    .text('Type of crime: ' + d.properties.Type.toLowerCase());
    select
    .select('#cluster')
    .text('Cluster: ' + d.properties.Cluster);
  })
  .on('mouseout', function(d){
    d3.select(this)
    .transition()
    .duration(300)
    .attr('r', 5);
  })


  leaflet_map.on("moveend", reset);
  reset();
  function reset() {
    var bounds = d3path.bounds(data)
    topLeft = [bounds[0][0] + 10, bounds[0][1] - 10]
    bottomRight = [bounds[1][0] + 10, bounds[1][1] + 10];
    svg_map
    .attr("width", bottomRight[0] - topLeft[0])
    .attr("height", bottomRight[1] - topLeft[1])
    .style("left", topLeft[0] + "px")
    .style("top", topLeft[1] + "px");

    g.attr("transform", "translate(" + (-topLeft[0]) + "," + (-topLeft[1]) + ")");

    feature.attr("transform",
    function (d) {
      return "translate(" +
      applyLatLngToLayer(d).x + "," +
      applyLatLngToLayer(d).y + ")";
    });

  }


  this.change_map_points = function (curr_view_erth) {

    map_points_change = d3.selectAll(".mapcircle")
    .filter(function (d) { return curr_view_erth.indexOf(d.id) != -1; })
    .attr('r', 7)
    .transition()
    .duration(800);


    d3.selectAll(".mapcircle")
    .filter(function (d) { return curr_view_erth.indexOf(d.id) == -1; })
    .transition()
    .duration(800)
    .attr('r', 0)
  }
  document.getElementById('switchButton1').onclick = function() {
    legend.remove();
    geoJ.remove();
    document.getElementById("info").style.display = "block";
    document.getElementById("svgId").style.display = "block";


  }

  document.getElementById('switchButton2').onclick = function() {
    legend.addTo(leaflet_map);
    geoJ.addTo(leaflet_map);
    document.getElementById("info").style.display = "none";
    document.getElementById("svgId").style.display = "none";

  }


  function map_link() {
    return "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png";
  }
}
