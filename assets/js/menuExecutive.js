var TP_SALE_VALUE;
    var NET_SALE_VALUE;
    var DISCOUNT;
    var E_QTY;
var chart;
    $(document).ready(function(){
    
    var token = getCookie('token');
    if(token===null){
        self.location="index.html";
    }
    loginLog(token);
    $("#dashboard_menu").trigger('click');

    drawBarChart(token, "monthlyBarChart", "Team Wise Net Sales Value (MTD)");
    drawBarChart(token, "yearlyBarChart", "Team Wise Net Sales Value (YTD)");
    drawBarChart(token, "GSM", "GSM NET SALES");
    drawLineChart(token,'');

    setBio(token);

    setLastTransactionDate();

    setSubOrdinatePerformanceTable(token);

    $("#dashboard_menu").trigger('click');

    
    $(document).on("click", ".person", function(){
        var positioncode = $(this).attr("data-positioncode");
        var url = AllConstant.baseURL + "/getSPOProgressProductWise";

        $.ajax({
            type: "GET",
            url: url,
            data: {token:token, position_code:positioncode},
            contentType: "application/json",
            dataType: "text",
            success: function (data) {
                var response = JSON.parse(data);
                var html="";
                var name = "";
                if(response.length>0){

                    for(var i=0 ; i<response.length ; i++){
                        if(response[i].personName!==null && response[i].personName!=='undefined' && response[i].personName!==''){
                            name = response[i].personName ;
                        }
                        html += '<tr data-positionCode="'+response[i].position_code+'" >\n' +
                            '                                                                    <td class="text-truncate"><i class="fa fa-dot-circle-o font-medium-1 mr-1"></i> '+response[i].name+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].mtdTarget+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].mtdAch+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].mtdPerc+'%</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].ytdTarget+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].ytdAch+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].ytdPerc+'%</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].FYTarget+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].balance+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].CMA+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].RMA+'</td>\n' +
                            '                                                                </tr>';
                    }

                }else{
                    html+="<tr><p>No Sale found</p></tr>";
                }
                $('.modal').modal('show');
                $('.SPOProgressSKUWise').html(html);
                $('#modalHeading').html(name);
                //var table = $('.table').DataTable();
                // table.columns.adjust();
            },
            error: function (data) {

            },
            timeout: 10000
        });
    });


});

function setSubOrdinatePerformanceTable(token){
    var url = AllConstant.baseURL + "/getTeamProgress";

    $.ajax({
        type: "GET",
        url: url,
        data: {token:token},
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);
            var html="";
            if(response.length>0){

                for(var i=0 ; i<response.length ; i++){
                    if(response[i].FYTarget == "0" && response[i].ytdAch == "0"){
                        continue;
                    }
                    if(response[i].position_code.includes("ASM")){
                        html +='<tr data-positionCode="'+response[i].position_code+'" class="person font-weight-bold">\n';
                    }else{
                        html += '<tr data-positionCode="'+response[i].position_code+'" class="person">\n';
                    }

                    html+='                                                                    <td class="text-truncate"><i class="fa fa-dot-circle-o font-medium-1 mr-1"></i> '+response[i].name+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].mtdTarget+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].mtdAch+'</td>\n' +
                        '                                                                    <td class="text-truncate">'+response[i].mtdPerc+'%</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].ytdTarget+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].ytdAch+'</td>\n' +
                        '                                                                    <td class="text-truncate">'+response[i].ytdPerc+'%</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].FYTarget+'</td>\n' +
                        '                                                                    <td class="text-truncate">'+response[i].balance+'</td>\n' +
                        '                                                                    <td class="text-truncate">'+response[i].CMA+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].RMA+'</td>\n' +

                        '                                                                </tr>';
                }

            }else{
                html+="<tr><p>No Sale found</p></tr>";
            }

            $('.teamProgress').html(html);

        },
        error: function (data) {

        },
        timeout: 10000
    });
}

function setLastTransactionDate(){
    var url = AllConstant.baseURL + "/getLastTransactionDate";
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            $('#last_transaction_date').html("Secondary sales till : "+data);
        },
        error: function (data) {

        },
        timeout: 10000
    });
}
function setBio(token) {
    var url = AllConstant.baseURL + "/getBIO";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            if(data.includes("|")){
                if(data.split("|")[0].trim()==="null"){
                    clearCookies();
                    self.location="index.html";
                }
            }
            $('#bio').html(data);
        },
        error: function (data) {

        },
        timeout: 10000
    });
}


function loginLog(token){
    var url = AllConstant.baseURL + "/loginLog";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
        },
        error: function (data) {
        },
        timeout: 10000
    });

    $(document).on("click", ".person", function(){
        var positioncode = $(this).attr("data-positioncode");
        var url = AllConstant.baseURL + "/getRegionProgress";

        $.ajax({
            type: "GET",
            url: url,
            data: {token:token, position_code:positioncode},
            contentType: "application/json",
            dataType: "text",
            success: function (data) {
                var response = JSON.parse(data);
                var html="";
                var name = "";
                if(response.length>0){

                    for(var i=0 ; i<response.length ; i++){
                        if(response[i].personName!==null && response[i].personName!=='undefined' && response[i].personName!==''){
                            name = response[i].personName ;
                        }
                        html += '<tr data-positionCode="'+response[i].position_code+'" >\n' +
                            '                                                                    <td class="text-truncate"><i class="fa fa-dot-circle-o font-medium-1 mr-1"></i> '+response[i].region+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].regionSupervisor+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].percent+'</td>\n' +
                            '                                                                    </tr>';
                    }

                }else{
                    html+="<tr><p>No Sale found</p></tr>";
                }
                $('.modal').modal('show');
                $('.ProgressRegionWise').html(html);
                $('#modalHeading').html(name);
            },
            error: function (data) {

            },
            timeout: 10000
        });
    });

    

}

//CHARTS

function drawBarChart(token, type, title){
    var url = AllConstant.baseURL + "/getExecutiveBarChart";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token , type:type },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);

            new Chart($("#chart_"+type), {
                type: 'bar',
                data: response,
                options: {
                  
                    plugins: {
                        title: {
                            display: true,
                            text: title
                        }
                    
                },
                  tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return "" + Number(tooltipItem.yLabel).toFixed(0).replace(/./g, function(c, i, a) {
                                return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                            });
                        }
                    }
                },
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                          if(parseInt(value) >= 1000){
                            return '' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                          } else {
                            return '' + value;
                          }
                        }
                      }
                    }]
                  },
                  
                }
            });
        },
        error: function (data) {
        },
        timeout: AllConstant.timeout
    });
}

$('input[type=radio][name=lineCharts]').change(function() {
  updateLinechart();
      drawLineChart();
    });

function updateLinechart(){
var data;
  if($('#netSale').is(":checked")){
    data = NET_SALE_VALUE;
  }

  else if($('#tpSale').is(":checked")){
    data = TP_SALE_VALUE;
  }

  else if($('#eachQty').is(":checked")){
data = E_QTY;
  }
    // see which option is selected

    //if tpsalevalue is selected then use tpSaleVal variable for the below chart data.
    if(chart!==undefined){
        chart.destroy();
    }

 chart = new Chart($("#chart_TWNSValYTDAch"), {
                type: 'line',
                fill: false,
                data: data,
                options: {
                  elements: {
                    line: {
                        tension: 0
                    }
                },
                  tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return "" + Number(tooltipItem.yLabel).toFixed(0).replace(/./g, function(c, i, a) {
                                return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                            });
                        }
                    }
                },
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                          if(parseInt(value) >= 1000){
                            return '' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                          } else {
                            return '' + value;
                          }
                        }
                      }
                    }]
                  }
                }

            });

}
function drawLineChart(token, type, title){
    var url = AllConstant.baseURL + "/getExecutiveLineChart";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token , type:type },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
          
           var response = JSON.parse(data);
                
            for(var i=0 ; i<response.length ; i++){
              if(response[i].unitType==='E_QTY'){
                E_QTY = response[i].barChartData;
              }else if (response[i].unitType==='TP_SALE_VALUE'){
                TP_SALE_VALUE = response[i].barChartData;
              }else if (response[i].unitType==='NET_SALE_VALUE'){
                NET_SALE_VALUE = response[i].barChartData;
              }
            }
            updateLinechart();
        },
        error: function (data) {
        },
        timeout: AllConstant.timeout
    });
}


function setMtdPerformanceTable(token){
  //var url = AllConstant.baseURL + "/getTeamMtdProgress";

  $.ajax({
      type: "GET",
      url: url,
      data: {token:token},
      contentType: "application/json",
      dataType: "text",
      success: function (data) {
          var response = JSON.parse(data);
          var html="";
          if(response.length>0){

              for(var i=0 ; i<response.length ; i++){
                  if(response[i].FYTarget == "0" && response[i].ytdAch == "0"){
                      continue;
                  }
                  if(response[i].position_code.includes("ASM")){
                      html +='<tr data-positionCode="'+response[i].position_code+'" class="person font-weight-bold">\n';
                  }else{
                      html += '<tr data-positionCode="'+response[i].position_code+'" class="person">\n';
                  }

                  html+='                                                                   <td class="text-truncate"> '+response[i].team+'</td>\n' +
                      '                                                                    <td class="text-truncate"> '+response[i].mtdCurrAvgSales+'</td>\n' +
                      '                                                                    <td class="text-truncate">'+response[i].mtdReqAnnPerDayNetVal+'%</td>\n' +
                      '                                                                    <td class="text-truncate"> '+response[i].mtdAch+'</td>\n' +
                      '                                                                    <td class="text-truncate"> '+response[i].mtdDiscTarget+'</td>\n' +
                      '                                                                    <td class="text-truncate">'+response[i].mtdActual+'%</td>\n' +
                      '                                                                    <td class="text-truncate"> '+response[i].mtdUccLm+'</td>\n' +
                      '                                                                    <td class="text-truncate">'+response[i].mtdUccCm+'</td>\n' +

                      '                                                                </tr>';
              }

          }else{
              html+="<tr><p>No Sale found</p></tr>";
          }

          $('.teamMtdProgress').html(html);

      },
      error: function (data) {

      },
      timeout: 10000
  });
}

function setYtdPerformanceTable(token){
  //var url = AllConstant.baseURL + "/getTeamMtdProgress";

  $.ajax({
      type: "GET",
      url: url,
      data: {token:token},
      contentType: "application/json",
      dataType: "text",
      success: function (data) {
          var response = JSON.parse(data);
          var html="";
          if(response.length>0){

              for(var i=0 ; i<response.length ; i++){
                  if(response[i].FYTarget == "0" && response[i].ytdAch == "0"){
                      continue;
                  }
                  if(response[i].position_code.includes("ASM")){
                      html +='<tr data-positionCode="'+response[i].position_code+'" class="person font-weight-bold">\n';
                  }else{
                      html += '<tr data-positionCode="'+response[i].position_code+'" class="person">\n';
                  }

                  html+='                                                                    <td class="text-truncate"> '+response[i].team+'</td>\n' +
                      '                                                                    <td class="text-truncate"> '+response[i].ytdTarget+'</td>\n' +
                      '                                                                    <td class="text-truncate">'+response[i].ytdSales+'%</td>\n' +
                      '                                                                    <td class="text-truncate"> '+response[i].ytdAch+'</td>\n' +
                      '                                                                    <td class="text-truncate"> '+response[i].ytdDiscTarget+'</td>\n' +
                      '                                                                    <td class="text-truncate">'+response[i].ytdActual+'%</td>\n' +
                      '                                                                    <td class="text-truncate"> '+response[i].ytdFYTarget+'</td>\n' +
                      '                                                                    <td class="text-truncate">'+response[i].ytdBalTarget+'</td>\n' +
                      '                                                                    <td class="text-truncate">'+response[i].ytdCurrMnthlyAvg+'</td>\n' +
                      '                                                                    <td class="text-truncate">'+response[i].ytdReqMnthlyAvg+'</td>\n' +
                      '                                                                    <td class="text-truncate">'+response[i].ytdBalTarget+'</td>\n' +

                      '                                                                </tr>';
              }

          }else{
              html+="<tr><p>No Sale found</p></tr>";
          }

          $('.teamYtdProgress').html(html);

      },
      error: function (data) {

      },
      timeout: 10000
  });
}
