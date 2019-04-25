function test(){
    Plotly.setPlotConfig({
        mapboxAccessToken: 'pk.eyJ1Ijoic3Nzc3Nzc3Nzc3Nzc3NzIiwiYSI6ImNqbnM0bXNyNzBmZmEzcG50bTB1OHR1bGwifQ.QQep7DFbpADY7_Ar1PW0NA' 
    });
    var bandname = document.getElementById("bandname").value;
    var endpoint = "/events/" + bandname

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            
            var mapParams = getMapParams(this.response, bandname);
            var pieParams = getPieParams(this.response)

            Plotly.plot('test', mapParams.data, mapParams.layout);
            Plotly.newPlot('pie', pieParams.data, pieParams.layout);
        }
    };
    xhttp.open("GET", endpoint);
    xhttp.send();

};


  function listData(mylist){
  latlist=[];
  lonlist=[];
  desclist=[];
  for (var x of mylist){
      latlist.push(x[3]);
      lonlist.push(x[4]);
      var desc = x[0] + '<br>' + x[1];
      if (x[2] != "") {
          newdesc = desc + " , " + x[2] + '<br>' + x[5]
          desclist.push(newdesc);
      }
      else if (x[2]== "") { 
          newdesc = desc + '<br>' + x[5]
          desclist.push(newdesc);
         }
     }
  
  return {"lat":latlist,"lon":lonlist,"desc":desclist}
  }


  function makeData(mylist){
    var listdict = listData(mylist)
    var datamap = [{
      type: 'scattergeo',
        lat: listdict.lat,
        lon: listdict.lon,
        text: listdict.desc,
        mode: 'lines+markers',
        line:{
            width: 3,
            color: 'red'
        },
        marker: {
            symbol: "diamond"
        }
    }]
    return datamap
}


function findMax(alist){
    compare = Number.NEGATIVE_INFINITY
    for (var elem of alist){
        if (elem > compare){
            compare = elem
        }
    }
    return compare
}


function findMin(alist){
    compare = Number.POSITIVE_INFINITY;
    for (var elem of alist){
        if (elem<compare){
            compare = elem
        }
    }
    return compare
}


function findCenter(mylist){
    var listdict = listData(mylist);
    var latlist = listdict.lat;
    var lonlist = listdict.lon;

    var max_lat = findMax(latlist)
    var min_lat = findMin(latlist)
    var max_lon = findMax(lonlist)
    var min_lon = findMin(lonlist)
    
    var avg_lat = (max_lat + min_lat) / 2;
    var avg_lon = (max_lon + min_lon) / 2;

    return [avg_lat,avg_lon]
  }


function getRange(mylist, param){
    var listdict = listData(mylist);
    var paramlist = listdict[param]
    max = findMax(paramlist)
    min = findMin(paramlist)
    return [(min - 10), (max + 10)]
}


  function makeLayout(mylist, bandname){
      var listdict = listData(mylist)
      var center = findCenter(mylist)
      var layoutmap = {
        title: bandname,
        width: 1000,
        height: 700,
        showlegend: false,
        geo: {
            resolution: 50,
            showland: true,
            showlakes: true,
            showocean: true,
            showcountries: true,
            landcolor: 'rgb(202, 232, 95)',
            countrycolor: 'rgb(146, 208, 95)',
            oceancolor: 'rgb(113,113,214)',
            lakecolor: 'rgb(113,113,214)',
            projection: {
              type:  "natural earth"
            },
            coastlinewidth: 1,
            lataxis: {
              range: getRange(mylist,"lat"),
              showgrid: true,
              tickmode: 'array',
              //dtick: 10
              tickvals: listdict.lat
            },
            lonaxis:{
              range: getRange(mylist,"lon"),
              showgrid: true,
              tickmode: 'array',
              //dtick: 20
              tickvals: listdict.lon
            },
            center: {
                lat: center[0],
                lon:center[1]
            }
          }
      };
      return layoutmap
  }


  function getMapParams(jsonstring, bandname){
      var mylist = JSON.parse(jsonstring)
      getdata = makeData(mylist)
      getlayout = makeLayout(mylist,bandname)
      var mapParams = {
          data: getdata,
          layout: getlayout
      }
      return mapParams
  }

  
function makeDict(mylist){
    var countryDict = {};
    for (var elem of mylist){
      if (elem[5] in countryDict){
          countryDict[elem[5]] = countryDict[elem[5]] + 1;
      }
      else {
          countryDict[elem[5]] = 1;
      }
    }
    return countryDict;
}


function getPercent(mylist){
    var countryDict = makeDict(mylist)
    var total = 0;
    for (var country of Object.keys(countryDict)){
        total = total + countryDict[country];
}
    for (var country of Object.keys(countryDict)){
        var percent = (countryDict[country] / total) * 100;
        var round = Math.round(percent * 10) / 10;
        countryDict[country] = round
    }
    return countryDict;
}


function countryLister(mylist){
    cList = [];
    pList = [];
    var countryDict = getPercent(mylist);
    for (var country of Object.keys(countryDict)){
        cList.push(country);
    }
    for (var percent of Object.values(countryDict)){
        pList.push(percent);
    }
    return {country:cList,percent:pList};
}


function makePieData(mylist){
    var percentDict = countryLister(mylist);
    var data = [{
        values: percentDict.percent,
        labels: percentDict.country,
        type: "pie",
        hoverinfo: 'label+percent+name',
        name: ""
    }]
    return data
}


function getPieParams(jsonstring){
    var mylist = JSON.parse(jsonstring);
    var pieData = makePieData(mylist);
    var pieLayout = {
        title: "Countries",
        height: 550,
        width: 550
      };
    var pieParams = {
        data: pieData,
        layout: pieLayout
    }
    return pieParams;
}