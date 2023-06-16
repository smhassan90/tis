
$(document).ready(function(){
    populateForm();
    $('.btnAddUpdate').click(function(){
        var urlAddButton= AllConstant.baseURL + "/btnAddAdminPanel";
        var tablename = $(this).attr("data-tablename");
        var primarykey = $(this).attr("data-primarykeycolumn");
        if($('#form'+tablename).valid()){
            var json = getJSON(this);
            var dataJSON = {"tablename":tablename,"data":json};
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

    $('.menu-item').click(function(){
        $(".menu-item").parent().removeClass("active");
        $(this).parent().addClass("active");

        //In menu item data-tablename should be there. Table Name from Class name
        var tablename = $(this).attr("data-tablename");
        //Primary Key column name should be in data-primarykeycolumn in menu item
        var primarykey = $(this).attr("data-primarykeycolumn");

        //This is the id of section form.
        var selectorMainForm = getFormMainDivSelectorFromTableName(tablename);

        //Request to get Data for below table. In response it will populate table.
        if(tablename!=='Dataentry' && tablename!=='dashboard'){
            getData(tablename,primarykey);
        }


        show_hide_section_tab(selectorMainForm);

    });

    $('.dataentry-tab').click(function(){
        //In menu item data-tablename should be there. Table Name from Class name
        var tablename = $(this).attr("data-tablename");
        //Primary Key column name should be in data-primarykeycolumn in menu item
        var primarykey = $(this).attr("data-primarykeycolumn");

        getData(tablename,primarykey);


    });



    /*
    btnDel class should be assign to delete button
     */
    $(document).on("click", ".btnDel", function(){
        var id = $(this).attr("data-id");
        var tablename = $(this).attr("data-tablename");
        var primarykey = $(this).attr("data-primarykeycolumn");
        var selectorId = "#";
        selectorId+=$(this).attr("data-selectorid");

        //delete
        var url= AllConstant.baseURL + "/deleteAdminData";
        swal({
            title: 'Are you sure you want to delete?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0CC27E',
            cancelButtonColor: '#FF586B',
            confirmButtonText: 'Yes, Delete it!',
            cancelButtonText: "No, cancel"
        }).then(function (isConfirm) {
            if (isConfirm) {
                $('#pleaseWaitDialog').modal();
                $.ajax({
                    type: "GET",
                    url: url,
                    contentType: "application/json",
                    data:{tablename:tablename, id:id, primarykey:primarykey},
                    dataType: "text",
                    success: function (data) {
                        $('#pleaseWaitDialog').modal('hide');
                        var deleteResponse = JSON.parse(data);
                        if(deleteResponse.status==="200"){
                            getData(tablename,primarykey);
                            toastr.success("Successful!","Entry deleted!");
                        }else{
                            toastr.error("ERROR!","Unsuccessful request because of undefined error!");
                        }
                    },
                    error: function (data) {
                        $('#pleaseWaitDialog').modal('hide');
                        toastr.error("ERROR!","Unsuccessful request because of undefined error!");
                    }
                });
            }
        }).catch(swal.noop);



    });


    $('.mappingtable').click(function(){
        var tablename = $(this).attr("data-tablename");
        var primarykeycolumn = $(this).attr("data-primarykeycolumn");
        var dropdown1 = $(this).attr('data-dropdown1');
        var joiningtablename1 = $(this).attr('data-joiningtablename1');
        var joiningcolumnname1 = $(this).attr('data-joiningcolumnname1');
        var joiningcolumnvalue1 = $(this).attr('data-joiningcolumnvalue1');

        var dropdown2 = $(this).attr('data-dropdown2');
        var joiningtablename2 = $(this).attr('data-joiningtablename2');
        var joiningcolumnname2 = $(this).attr('data-joiningcolumnname2');
        var joiningcolumnvalue2 = $(this).attr('data-joiningcolumnvalue2');

        if(dropdown1!==undefined){
            getDropdownData(tablename,primarykeycolumn,dropdown1,joiningtablename1,joiningcolumnname1,joiningcolumnvalue1);
        }

        if(dropdown2!==undefined){
            getDropdownData(tablename,primarykeycolumn,dropdown2,joiningtablename2,joiningcolumnname2,joiningcolumnvalue2);
        }
    });
});



/*
It will generate HTML Table from data. It will dynamically create columns and rows according to json.
 */
function generateTable(tableData, primarykeyColumn, tablename){
    var tableHTML = "";
    var selectorid = getSelectorFromTableName(tablename);

    if(tableData === undefined || tableData===null){
        tableHTML = "<p>No data found</p>";
    }else{
        var tableHeader = tableData;
        var id = "";
        if(tableData.length>0){
            tableHTML = "<div class='table-responsive'><table class=\"table table-striped table-bordered zero-configuration dataTable\" id=\"\" role=\"grid\" aria-describedby=\"DataTables_Table_0_info\">\n" +
                "                                        <thead>\n" +
                "                                        <tr role=\"row\">\n";
            $.each(tableHeader, function(key, value){
                $.each(value, function(key, value){
                    tableHTML+= "<th class=\"sorting\" tabindex=\"0\" aria-controls=\"\" rowspan=\"1\" colspan=\"1\" aria-label=\"Name: activate to sort column ascending\" style=\"width: 171.875px;\" aria-sort=\"descending\">"+key+"</th>";
                });
                return false;
            });

            tableHTML+="                                        </tr>\n" +
                "                                        </thead>\n" +
                "                                        <tbody>\n";

            $.each(tableData, function(key, value){
                tableHTML +=  "<tr>\n";
                id = "";
                $.each(value, function(key, value){
                    if(id==="" && key.lowerCase===primarykeyColumn.lowerCase){
                        id=value;
                    }
                    tableHTML+= "<td>"+value+"</td>";
                });
                tableHTML +=  "                                          <td>\n" +
                    '                                            <a data-selectorid="'+selectorid+'" data-tablename="'+tablename+'" data-id="'+id+'" data-primarykeycolumn = "'+primarykeyColumn+'" class=\"btnDel danger p-0\" data-original-title=\"\" title=\"\">\n' +
                    "                                              <i class=\" fa fa-trash-o font-medium-3 mr-2\"></i>\n" +
                    "                                            </a>\n" +
                    "                                          </td>\n";
                tableHTML +=  "</tr>\n";
            });


            tableHTML+="                          </tbody>\n" +
                "                                      </table></div>";
        }else{
            tableHTML = "<p>No data found</p>";
        }
    }
    return tableHTML;
}
/*
It will generate HTML Table from data. It will dynamically create columns and rows according to json.
 */
function generateListForCoachee(tableData, primarykeyColumn, tablename){
    var tableHTML = "";
    var selectorid = getSelectorFromTableName(tablename);

    if(tableData === undefined || tableData===null){
        tableHTML = "<p>No data found</p>";
    }else{
        var tableHeader = tableData;
        var id = "";
        if(tableData.length>0){
            tableHTML = "<div class='table-responsive'><table class=\"table table-striped table-bordered zero-configuration dataTable\" id=\"\" role=\"grid\" aria-describedby=\"DataTables_Table_0_info\">\n" +
                "                                        <thead>\n" +
                "                                        <tr role=\"row\">\n";
            $.each(tableHeader, function(key, value){
                $.each(value, function(key, value){
                    tableHTML+= "<th class=\"sorting\" tabindex=\"0\" aria-controls=\"\" rowspan=\"1\" colspan=\"1\" aria-label=\"Name: activate to sort column ascending\" style=\"width: 171.875px;\" aria-sort=\"descending\">"+key+"</th>";
                });
                return false;
            });

            tableHTML+="                                        </tr>\n" +
                "                                        </thead>\n" +
                "                                        <tbody>\n";

            $.each(tableData, function(key, value){
                tableHTML +=  "<tr>\n";
                id = "";
                $.each(value, function(key, value){
                    if(id==="" && key.lowerCase===primarykeyColumn.lowerCase){
                        id=value;
                    }
                    tableHTML+= "<td>"+value+"</td>";
                });
                tableHTML +=  "                                          <td>\n" +
                    '                                            <a data-selectorid="'+selectorid+'" data-tablename="'+tablename+'" data-id="'+id+'" data-primarykeycolumn = "'+primarykeyColumn+'" class=\"btnDel danger p-0\" data-original-title=\"\" title=\"\">\n' +
                    "                                              <i class=\" fa fa-trash-o font-medium-3 mr-2\"></i>\n" +
                    "                                            </a>\n" +
                    "                                          </td>\n";
                tableHTML +=  "</tr>\n";
            });


            tableHTML+="                          </tbody>\n" +
                "                                      </table></div>";
        }else{
            tableHTML = "<p>No data found</p>";
        }
    }
    return tableHTML;
}


/*
selector to show data below form. HTML table
 */
function getSelectorFromTableName(tablename){
    var selectorid = "#";
    selectorid +=tablename.toLowerCase();
    selectorid +="_div_content";
    return selectorid;
}

/*
Selector of main div which is hidden initially. It contains form and below data HTML table
 */
function getFormMainDivSelectorFromTableName(tablename){
    var selectorid = "#";
    selectorid +=tablename.toLowerCase();
    selectorid +="_main_form";
    return selectorid;
}

/*
This will call an API and get the data.
 */
function getData(tableName, primarykey ){
    var url= AllConstant.baseURL + "/getAdminData";
    $('#pleaseWaitDialog').modal();
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        data:{token:getCookie("token"),tableName:tableName},
        dataType: "text",
        success: function (data) {
            $('#pleaseWaitDialog').modal('hide');
            adminData = JSON.parse(data);
            var generatedHTML = generateTable(adminData,primarykey,tableName);

            var selector = getSelectorFromTableName(tableName);

            $(selector).html(generatedHTML);
        },
        error: function (data) {
            $('#pleaseWaitDialog').modal('hide');
            toastr.error("ERROR!","Data cannot be populated because of undefined error!");
        }
    });
}

/*
Selected blue mark on side bar is due to this function.
 */
function show_hide_section_tab($class_name) {
    $(".main-content").removeClass("active_block");
    $(".main-content").addClass("hide_block");

    $($class_name).removeClass("hide_block");
    $($class_name).addClass("active_block");
}



function getDropdownData(tablename, primarykeycolumn, dropdown1, joiningtablename1, joiningcolumnname1, joiningcolumnvalue1) {
    var url= AllConstant.baseURL + "/getAdminDropDownData";
    $('#pleaseWaitDialog').modal();
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        data:{tableName:joiningtablename1, column1:joiningcolumnname1, column2: joiningcolumnvalue1},
        dataType: "text",
        success: function (data) {
            $('#pleaseWaitDialog').modal('hide');
            var response = JSON.parse(data);

            if(response.status==="200"){
                populateDropDown(tablename, dropdown1, response.keyValueList);
            }else{
                toastr.error("ERROR!","Unsuccessful request because of undefined error!");
            }
        },
        error: function (data) {
            $('#pleaseWaitDialog').modal('hide');
            toastr.error("ERROR!","Unsuccessful request because of undefined error!");
        }
    });
}

function getSelectSelectorID(tablename, dropdown1) {
    var selector = ".";
    selector += tablename +"_"+dropdown1+"_select";
    selector = selector.toLowerCase();
    return selector;
}

function populateDropDown(tablename, dropdown1, keyValueList) {
    var seletSelectorID = getSelectSelectorID(tablename,dropdown1);
    $('.div'+tablename+dropdown1).html('');
    var html = "<select id=\"inp"+tablename+dropdown1+"\" data-ispopulated='true' name=\"interested\" class=\"form-control "+tablename.lowerCase+"_"+dropdown1.lowerCase+"_select selectpicker search_select\" data-show-subtext=\"true\" data-live-search=\"true\">";

    // var html = "";
    for(var i=0; i<keyValueList.length; i++){
        html += "<option data-tokens='"+keyValueList[i].value+"' value='"+keyValueList[i].key+"'>"+keyValueList[i].key+" - "+keyValueList[i].value+"</option>";
    }
    html +="</select>";
    updateSelectPicker(tablename,dropdown1,html);



}

function updateSelectPicker(tablename,dropdown1,html){
    $('.div'+tablename+dropdown1).html(html);
    $('#inp'+tablename+dropdown1).selectpicker();
    $('#inp'+tablename+dropdown1).addClass('selectpicker');
    $('#inp'+tablename+dropdown1).selectpicker('refresh');
}

function getJSON(selector){
    var tablename = $(selector).attr("data-tablename");
    var columns = $(selector).attr("data-columns");
    var primarykey = $(selector).attr("data-primarykeycolumn");

    var columnJsonArr = columns.split('*');

    var json = {};
    var preJson = {};
    var isMandatory = "";
    for(var i =0; i<columnJsonArr.length;i++){
        preJson[columnJsonArr[i]] = $('#inp'+tablename+columnJsonArr[i]).val();
    }
    preJson['UPDATE_BY'] = getCookie('username');
    json = JSON.stringify(preJson);
    return json;
}

function populateForm(){
    if(getCookie("type")==="2"){
        $('.dataentry_form').addClass('d-none');
    }else if(getCookie("type")==="1"){
        $('.dataentry_form').removeClass('d-none');
    }

    $('.inpCity').val(getCookie("city"));

}