
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////      Initial Variables: Globals That Get Changed Based on User Interaction:  //////////////\\\
////////////////////////////////////////////////////////////////////////////////////////////////////////////
var userFilt = {};

//userFilt["selected_options"] = ["Borough","Level", "Type","Completed","Sex_susp","Age_vic","cluster","Place","Race_susp","Age_susp"];
userFilt["selected_options"] = ["Cluster","Borough", "Sex_susp","Level"];

//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////   Helper Functions  /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////////   replaces all examples of a certain character in a string
function findAndReplace(string, target, replacement) {
 var i = 0, length = string.length;
 for (i; i < length; i++) {
   string = string.replace(target, replacement);
 }
 return string;
}

///////////////// returns array of only unique items in the given array
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

//////// removes an item from array if present
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

///// removes an item from array if present
function popItemArray(array, item){
  for (each in array){
    if(array[each]===item){
      array.splice(each,1)
    }
  }
  return array
}




////  checks if selected dimension is in selected dimensions array. If it isn't, adds it.
function checkIfDimensionSelectedChange(dimension){
    var foundMatch = "no"
    for (each in userFilt["selected_options"]){
      if(userFilt["selected_options"][each]===dimension){
        foundMatch = "yes"
      }
    }
    if (foundMatch==="no"){
      userFilt["selected_options"].push(dimension)
    }
}

///////////// function that adds all unique items for a given dimension to its limitation object key:value pair
function popLimitObjForDim(dimension){
  // var dimension_id = String(dimension);
  //   console.log("zz z type = ", typeof(dimension_id))
  // console.log("zz z dimension_id=",dimension)
  //   dimension_id = findAndReplace(dimension_id," ","_")
  var arrayNumber = findArrayObjNumber(dimension, userFilt["uniqueValuesForEachDimensionArrayOfObj"]);
    // console.log("arrayNumber is, ",arrayNumber)
    var this_key =Object.keys(userFilt["uniqueValuesForEachDimensionArrayOfObj"][arrayNumber])
    // console.log("this_key =", this_key);
    var current_dim_array = userFilt["uniqueValuesForEachDimensionArrayOfObj"][arrayNumber][this_key]
    // console.log("! current_dim_array= ",current_dim_array)
    // var DimFormat = findAndReplace(String(dimension)," ","_")
    userFilt["limitations"][dimension] = [];
    for (eachUniqueDimValue in current_dim_array){
      var UniqueDimValue = current_dim_array[eachUniqueDimValue];
      //var DimUvalFormat = findAndReplace(String(UniqueDimValue)," ","_")
      // console.log("userFilt["limitations"],",userFilt["limitations"]);
      // console.log("DimUvalFormat,",UniqueDimValue);
      userFilt["limitations"][dimension].push(UniqueDimValue)
      }

    // console.log("zz print userFilt["limitations"],",userFilt["limitations"])
}

 //// function that takes the dimension unformatted and finds the array object number of the array of objects
    //// of all unique values for each dimension that matches it
    ///// returns the array object number to match....
    function findArrayObjNumber(dimension, array_unique_values_for_each_dimension){
      for (each in array_unique_values_for_each_dimension){

        if (Object.keys(array_unique_values_for_each_dimension[each])[0] === dimension || Object.keys(array_unique_values_for_each_dimension[each])[1] === dimension || Object.keys(array_unique_values_for_each_dimension[each]) === dimension){
          /// this is the array number of the input array that matches:
          // console.log("findArrayObjNumber() each =",each)
          // console.log("findArrayObjNumber() dimension =",dimension)
          return each
        }
      }
      console.log("did not find a match in findArrayObjNumber(): Dimension is ",dimension," array_unique_values_for_each_dimension is ",array_unique_values_for_each_dimension)
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////    Functions That Take Initial Data Load and Do Initial Data Processing    ///////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//// this function returns an array based on the d3 imported CSV where
//// the returned array is limited to a subset of rows where specific dimensions (aka columns) match a given value
function limitToSomeNew(arrayCSV, limitations){
  temp_array = [];
  // console.log("!! arrayCSV in limitToSomeNew() is",arrayCSV)
  var limitationsKeysArray = Object.keys(limitations)
  for (each in arrayCSV){
    row = arrayCSV[each]
    //// limitations is a variable that is an object of objects consisting of
    //// key:value pairs of diemension name:dimension value
    var foundMatchHelper = "no"
    var foundMatch = [];
    for (each2 in limitationsKeysArray){
      for (eachValue in limitations[limitationsKeysArray[each2]]){
          if (row[limitationsKeysArray[each2]] === limitations[limitationsKeysArray[each2]][eachValue]){
          foundMatch.push("yes")
        }
      }
    }
    // console.log("foundMatch array = ",foundMatch, "and length = ",foundMatch.length);
    for (tester in foundMatch){
      if (foundMatch[tester] === "yes"){
        foundMatchHelper = "yes";
      }
    }
    if (foundMatch.length === limitationsKeysArray.length){
        temp_array.push(row)
        // console.log("temp_array",temp_array)
    }
  }
   //console.log("!! * * temp_array",temp_array)
  arrayCSV = [];
  arrayCSV = temp_array;
  // console.log("!! * * result returned is ",arrayCSV);
  // console.log("!! * * * result returned is ",arrayCSV);
  return arrayCSV
}



///// builds array where a given dimension is the key and value is an array of unique values for that dimension:
///// assumes each row in input CSV has the same number and type of dimensions, which should be valid assumption.
///// also assuming the structure of the input stays the same, which I think will be true?
/////// this should be called once, then used to build drop-down to right of main one?
function build_uniqueValueForDimension(arrayCSV){
  var initialDimensionsObject = arrayCSV[0][0]["__data__"][0];
  // var dimensions_names_array = Object.keys(initialDimensionsObject)
  var dimensions_names_array = userFilt["dimension_options"]
  ///// creates an object of dimensions as keys, with an empty array as values
  var DimensionsArray = []
  for (eachDim in dimensions_names_array){
    var dim_obj_temp = {};
    dim_obj_temp[dimensions_names_array[eachDim]] = []
    DimensionsArray.push(dim_obj_temp);
  }
  // console.log("DimensionsArray =", DimensionsArray);
  ///// goes through each row of data & adds the value to the array value for each dimension key
  for (eachRow in arrayCSV[0][0]["__data__"]){
    for(eachDimension in dimensions_names_array){
      // console.log("DimensionsArray = ",DimensionsArray);
      // console.log("$ DimensionsArray[eachDimension][dimensions_names_array[eachDimension]] = ",DimensionsArray[eachDimension][dimensions_names_array[eachDimension]]);
      DimensionsArray[eachDimension][dimensions_names_array[eachDimension]].push(arrayCSV[0][0]["__data__"][eachRow][dimensions_names_array[eachDimension]])
    }
  }
  for (eachDimensionObject in dimensions_names_array){
    var array_of_a_dimension = DimensionsArray[dimensions_names_array[eachDimensionObject]]
    // console.log("% DimensionsArray =",DimensionsArray)
    // console.log("% dimensions_names_array[eachDimensionObject] =",dimensions_names_array[eachDimensionObject])
    // console.log("% DimensionsArray[eachDimensionObject][dimensions_names_array[eachDimensionObject]] =",DimensionsArray[eachDimensionObject][dimensions_names_array[eachDimensionObject]])
    DimensionsArray[eachDimensionObject][dimensions_names_array[eachDimensionObject]] = uniq(DimensionsArray[eachDimensionObject][dimensions_names_array[eachDimensionObject]])
    // DimensionsArray[eachDimensionObject][dimensions_names_array[eachDimensionObject]] = uniq(array_of_a_dimension)
  }
  userFilt["uniqueValuesForEachDimensionArrayOfObj"] = DimensionsArray
  // console.log("X userFilt["uniqueValuesForEachDimensionArrayOfObj"] = ",userFilt["uniqueValuesForEachDimensionArrayOfObj"])
//  return build_dd_list(userFilt["dimension_options"],userFilt["selected_options"])
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////  Builds SVGs for Visualization using d3.parasets.js and d3.js   /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////  builds the parallel sets visualization SVGs  //////////////////
function build_parallel_sets(data){

  var chart = d3.parsets()
      .dimensions(userFilt["selected_options"]);
  var vis = d3.select("#vis").append("svg")

 .attr("width", chart.width())
 .attr("height", chart.height());

  var partition = d3.layout.partition()
      .sort(null)
      .size([chart.width(), chart.height() * 5 / 4])
      .children(function(d) { return d.children ? d3.values(d.children) : null; })
      .value(function(d) { return d.count; });


    // resultArray = limitToOne(vis.datum(csv), userFilt["limitations"]);
    var resultArray2 = [];
    for(var i = 0; i <data.length; i++){
      resultArray2[i] = data[i].properties;

    }

    // console.log("* * vis.datum(resultArray2)= ",vis.datum(resultArray2));
    // build_dd_list(dimension_options,userFilt["selected_options"])
    vis.datum(resultArray2).call(chart);


  function ribbonPath(s, t, tension) {
    var sx = s.node.x0 + s.x0,
        tx = t.node.x0 + t.x0,
        sy = s.dimension.y0,
        ty = t.dimension.y0;
    return (tension === 1 ? [
        "M", [sx, sy],
        "L", [tx, ty],
        "h", t.dx,
        "L", [sx + s.dx, sy],
        "Z"]
     : ["M", [sx, sy],
        "C", [sx, m0 = tension * sy + (1 - tension) * ty], " ",
             [tx, m1 = tension * ty + (1 - tension) * sy], " ", [tx, ty],
        "h", t.dx,
        "C", [tx + t.dx, m1], " ", [sx + s.dx, m0], " ", [sx + s.dx, sy],
        "Z"]).join("");
  }

  function stopClick() { d3.event.stopPropagation(); }

  // Given a text function and width function, truncates the text if necessary to
  // fit within the given width.
  function truncateText(text, width) {
    return function(d, i) {
      var t = this.textContent = text(d, i),
          w = width(d, i);
      if (this.getComputedTextLength() < w) return t;
      this.textContent = "…" + t;
      var lo = 0,
          hi = t.length + 1,
          x;
      while (lo < hi) {
        var mid = lo + hi >> 1;
        if ((x = this.getSubStringLength(0, mid)) < w) lo = mid + 1;
        else hi = mid;
      }
      return lo > 1 ? t.substr(0, lo - 2) + "…" : "";
    };
  }
}
