
$(document).ready(function(){
    populateBasicData();
    $('#training_menu').click(function(){
        $("#base-tabX1").trigger("click");
    });
});
$('#dashboard_menu').click(function(){
    populateBasicData();
});

function populateBasicData(){
    var dataJSON = {"token":getCookie("token")};
    var url= AllConstant.baseURL + "/getBasicData";
    $('#pleaseWaitDialog').modal();
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        data:dataJSON,
        dataType: "text",
        success: function (data) {
            $('#pleaseWaitDialog').modal('hide');
            var deleteResponse = JSON.parse(data);
            if(deleteResponse.status==="200"){
                var basicData = JSON.parse(deleteResponse.data);
                populateDashboard(basicData);
            }else{
                toastr.error("ERROR!","Something Went Wrong!");
            }
        },
        error: function (data) {
            $('#pleaseWaitDialog').modal('hide');
            toastr.error("ERROR!","Unsuccessful entry because of undefined error!");
        }
    });
}

function populateDashboard(basicData){
    $('#totalTrainings').html(basicData.totalTrainings);
    $('#totalParticipants').html(basicData.totalParticipants);
}

$('.btnAddParticipants').click(function(){
    var tablename = $(this).attr("data-tablename");
    var selectedOption = $('#inp'+tablename+'participantId  option:selected').text();
    var selectedId = $('#inp'+tablename+'participantId  option:selected').val();
    var preScore = $('#inp'+tablename+'ParticipantMappingpreScore').val();
    var postScore = $('#inp'+tablename+'ParticipantMappingpostScore').val();
    var alreadyExist = false;
    var listSelector = "#"+tablename+"participantList";
    $(listSelector+' li').each(function(i) {
        var id = $(this).attr('data-rowId');
        if($(this).attr('data-rowId')===selectedId){
            alreadyExist=true;
        }
    });
    if(!alreadyExist) {

        var html = "<li data-preScore='"+preScore+"' data-postScore='"+postScore+"' id='item" + selectedId + "' data-rowId='" + selectedId + "' href=\"#\" class=\"list-group-item \">" + selectedOption + "<i class=\"fa fa-remove fa-2x pull-right btnDelCoachee\" style=\"color: red;\"></i>\t" +
            "</li>";
        $(listSelector).append(html);
    }

});
$(document).on("click", ".btnDelCoachee", function() {
    $(this).parent().remove();

});

$('.btnAddForm').click(function(){
    var urlAddButton= AllConstant.baseURL + "/addFormCoachee";
    var tablename = $(this).attr("data-tablename");
    var primarykey = $(this).attr("data-primarykeycolumn");
    var id ="";

    $('#'+tablename+'participantList li').each(function(i) {
        if(id!==""){
            id +="&";
        }
        id += $(this).attr('data-rowId');
        id+="@";
        id+=$(this).attr('data-preScore');
        id+="@";
        id+=$(this).attr('data-postScore');

    });


    if($('#form'+tablename).valid()){
        var json = getJSON(this);
        var dataJSON = {"token":getCookie("token"),"data":json, "ids":id, "tableName":tablename};
        $('#pleaseWaitDialog').modal();
        $.ajax({
            type: "GET",
            url: urlAddButton,
            contentType: "application/json",
            data:dataJSON,
            dataType: "text",
            success: function (data) {
                $('#pleaseWaitDialog').modal('hide');
                var deleteResponse = JSON.parse(data);
                if(deleteResponse.status==="200"){
                    getData(tablename,primarykey);
                    toastr.success("Successful!","Entry completed!");
                    $('#form'+tablename)[0].reset();
                    $('#'+tablename+'participantList li').each(function(i) {

                        $(this).remove();
                    });
                    populateForm();

                }else{
                    toastr.error("ERROR!","Unsuccessful entry because of undefined error!");
                }
            },
            error: function (data) {
                $('#pleaseWaitDialog').modal('hide');
                toastr.error("ERROR!","Unsuccessful entry because of undefined error!");
            }
        });
    }
});

$('#btnShow').click(function() {
    var urlAddButton = AllConstant.baseURL + "/getReportsData";
    var fromDate = $('#inpFromDate').val();
    var toDate = $('#inpToDate').val();
    var dataJSON = {"token":getCookie("token"), "fromDate":fromDate, "toDate":toDate};

    $('#pleaseWaitDialog').modal();
    $.ajax({
        type: "GET",
        url: urlAddButton,
        contentType: "application/json",
        data:dataJSON,
        dataType: "text",
        success: function (data) {
            $('#pleaseWaitDialog').modal('hide');
            var deleteResponse = JSON.parse(data);
            if(deleteResponse.status==="200"){
                var reportData = JSON.parse(deleteResponse.data);
                populateTable(reportData);

            }else{
                toastr.error("ERROR!","Unsuccessful entry because of undefined error!");
            }
        },
        error: function (data) {
            $('#pleaseWaitDialog').modal('hide');
            toastr.error("ERROR!","Unsuccessful entry because of undefined error!");
        }
    });

});
function populateTable(data){

    var html="<table class=\"table-responsive table table-hover table-xl mb-0\">\n" +
        "                                        <thead>\n" +
        "                                        <tr>\n" +
        "                                            <th class=\"border-top-0\">Trainer Type</th>\n" +
        "                                            <th class=\"border-top-0\">Trainer Theme</th>\n" +
        "                                            <th class=\"border-top-0\">Venue</th>\n" +
        "                                            <th class=\"border-top-0\">From</th>\n" +
        "                                            <th class=\"border-top-0\">To</th>\n" +
        "                                            <th class=\"border-top-0\">Participant Name</th>\n" +
        "                                            <th class=\"border-top-0\">Gender</th>\n" +
        "                                            <th class=\"border-top-0\">Designation</th>\n" +
        "                                            <th class=\"border-top-0\">District</th>\n" +
        "                                            <th class=\"border-top-0\">Tehsil</th>\n" +
        "                                            <th class=\"border-top-0\">Facility Name</th>\n" +
        "                                            <th class=\"border-top-0\">Contact Number</th>\n" +
        "                                            <th class=\"border-top-0\">National ID Card</th>\n" +
        "                                            <th class=\"border-top-0\">Pre-Score</th>\n" +
        "                                            <th class=\"border-top-0\">Post-Score</th>\n" +
        "                                            <th class=\"border-top-0\">%-Improvement</th>\n" +
        "                                            <th class=\"border-top-0\">Organized By</th>\n" +


        "                                        </tr>\n" +
        "                                        </thead>\n" +
        "                                        <tbody>\n";
    if(data.length>0){

        for(var i=0 ; i<data.length ; i++){
            var improvement =((data[i].postScore-data[i].preScore)/data[i].preScore)*100;
            improvement = improvement.toFixed(1);
                html += '<tr class="ucc_row">\n' +
                '                                                                    <td class="text-truncate"> '+data[i].trainerType+'</td>\n' +
                '                                                                    <td class="text-truncate"> '+data[i].trainingTheme+'</td>\n' +
                '                                                                    <td class="text-truncate"> '+data[i].trainingVenue+'</td>\n' +
                '                                                                    <td class="text-truncate">'+data[i].fromDate+'</td>\n' +
                                                                                    '<td class="text-truncate">'+data[i].toDate+'</td>' +
                '<td class="text-truncate">'+data[i].participantName+'</td>' +
                '<td class="text-truncate">'+data[i].gender+'</td>' +
                '<td class="text-truncate">'+data[i].designation+'</td>' +
                '<td class="text-truncate">'+data[i].district+'</td>' +
                '<td class="text-truncate">'+data[i].tehsil+'</td>' +
                '<td class="text-truncate">'+data[i].facilityName+'</td>' +
                '<td class="text-truncate">'+data[i].contactNumber+'</td>' +
                '<td class="text-truncate"> '+data[i].nationalIDCard+'</td>' +
                '<td class="text-truncate"> '+data[i].preScore+'</td>' +
                '<td class="text-truncate"> '+data[i].postScore+'</td>' +
                    '<td class="text-truncate"> '+improvement+'%</td>' +
                '<td class="text-truncate"> '+data[i].organizedBy+'</td>' +


                '                                                                </tr>';
        }

    }else{
        html+="<tr><p>No Record Found</p></tr>";
    }
    html+= "                                        </tbody>" +
        "                                    </table>";
    $('.reportData').html(html);

}