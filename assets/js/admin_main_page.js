$(document).ready(function(){

    $('#btnAddChannel').click(function(){
        var tablename = $("#channel_menu").attr("data-tablename");
        var primarykeycolumn = $("#channel_menu").attr("data-primarykeycolumn");
        addChannel(tablename,primarykeycolumn);
    });



});



function addChannel(tablename, primarykey){
    var url= AllConstant.baseURL + "/addChannel";
    var id = $('#inpChannelID').val();
    var name = $('#inpChannelName').val();
    $.ajax({
        type: "GET",
        url: url,
        data:{id:id, name:name},
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var resp = JSON.parse(data);

            if(resp.status === "200"){
                getData(tablename,primarykey);
            }

        },
        error: function (data) {
            return "failed";
        }
    });
}