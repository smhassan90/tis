$('#btnAddCLMIS').click(function(){
    var json = getJSON(this);
    var token = getCookie("token");
    var tablename = $(this).attr("data-tablename");
    var primarykey = $(this).attr("data-primarykeycolumn");
    $.ajax({
        type: "GET",
        url: AllConstant.baseURL+"/addCLMIS",
        data: {token:token, data:json},
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            const response = JSON.parse(data);
            if(response.status === "409"){
                toastr.error("Data for specified Month and Year Already exist.");
                toastr.options.timeOut = 2000; // 3s
            }else if(response.status === "200"){
                toastr.success("Data Entered Successfully!");
                toastr.options.timeOut = 2000; // 3s
                getData(tablename,primarykey);
            }
        },
        error: function (data) {
            swal("Error!", "Something went wrong!", "error").done();
        }
    });
});