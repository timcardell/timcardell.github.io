
var world_map, dbscanner, chart



d3.csv("data/NYPD_Complaint_Data_Historic_new.csv", function(data){

    //-------parse Data------------
    data = parseData(data);
   console.log(data)


    dbscan_result = DBSCAN().eps(9).minPts(1000).data(data.features);
    var [ClusterAssignment,NumClusters] = dbscan_result();


    //console.log('Resulting DBSCAN output', ClusterAssignment);
    //console.log('Number of clusters', NumClusters);


    var numberOfClusters = [];
    ClusterAssignment.forEach(function (d, i) {
    			data.features[i].properties.Cluster = d;
  	});



    console.log("Number of clusters: " + NumClusters);

     world_map = new worldMap(data,NumClusters);
     chart = new build_parallel_sets(data.features,data.features);


    		});


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var rand =Math.floor(Math.random() * (max - min + 1)) + min;
    return rand;
}




function parseData(data){
    var d = [];
    var i = 0;
    var timeParse =  d3.time.format("%d-%b-%y");
    data.forEach(element => {


        d.push({geometry:{
            type:"Point",
            coordinates:[
             parseFloat(element.Latitude),
             parseFloat(element.Longitude)
            ]
        },type:"Feature", id: i++, properties:
            {
                Latitude: parseFloat(element.Latitude),
                Longitude: parseFloat(element.Longitude),
                Date_occurance: dateParse(element.CMPLNT_FR_DT ),
                Time_occurance: timeP(element.CMPLNT_FR_TM),
                Reported: reported(element.RPT_DT, element.CMPLNT_FR_DT ),
                Completed: element.CRM_ATPT_CPTD_CD,
                Level: element.LAW_CAT_CD,
                Type: element.OFNS_DESC,
                KeyCode: parseInt(element.KY_CD),
                Borough: element.BORO_NM,
                Place: element.PREM_TYP_DESC,
                Age_susp: ageGroupParse(element.SUSP_AGE_GROUP),
                Race_susp: element.SUSP_RACE,
                Sex_susp: sexParse(element.SUSP_SEX),
                Age_vic: ageGroupParse(element.VIC_AGE_GROUP),
                AgeSuspect: ageParse(element.VIC_AGE_GROUP),
                AgeVictim: ageParse(element.VIC_AGE_GROUP),
                Race_vic: element.VIC_RACE,
                Sex_vic: sexParse(element.VIC_SEX)
            }}
            );

    });

    var datany = {type: "FeatureCollection", features: d};
    return datany;

}
function dateParse(d){
    var v = d.split('/');

    return {string: d, date: parseInt(v[0]), month: parseInt(v[1]), year: parseInt(v[2])}
}
function ageParse(d){
  if(d == ""){
    var ans = Math.floor(Math.random() * 5) + 1  ;

    if(ans == 1)return 18
    if(ans == 2)return 21
    if(ans == 3)return 35
    if(ans == 4)return 55
    if(ans == 5)return 65
  }
    if(d == "<18")return 18
    if(d == "18-24")return 21
    if(d == "25-44")return 35
    if(d == "45-64")return 55
    if(d == "65+")return 65
}

function ageGroupParse(d){
  if(d == "" || d == "UNKNOWN"){
    var ans = Math.floor(Math.random() * 5) + 1  ;
    if(ans == 1 )return  "<18"
    if(ans == 3 || ans == 2)return "18-24"
    if(ans == 4)return "25-44"
    if(ans == 5)return "45-64"
  }
  return d;
}

function reported(rep, dateO){
    rep = dateParse(rep);
    dateO = dateParse(dateO);
    if(isNaN(dateO.date)){
      rep.days = 0;
      return rep
    } 
    var day = rep.date - dateO.date;
    var m = rep.month-   dateO.month;
    var y = rep.year - dateO.year;
    var total = y*365 + m*30 +day;
    if(total < 0){
        rep.days = 0;
    }
    else{
        rep.days = total;
    }
    return rep;
}

function timeP(d){
    var v = d.split(':');
    return {string: d, hour: parseInt(v[0]), min: parseInt(v[1]), sec: parseInt(v[2])}
}

function sexParse(d){
  if(d == "" || d === "D"|| d === "E"){

    var ans = Math.floor(Math.random() * 4) + 1  ;
    if(ans === 1 ) d =  "F"
    if(ans === 3 || ans === 2|| ans== 4)d =  "M"

  }
  return d;
}
