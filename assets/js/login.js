

$(document).ready(function(){
    var token = getCookie('token');
    if(token!==null && token !== '' && token !== 'undefined'){
        self.location="side_menu.html";
    }

    $('#btnLogin').click(function(){

        var id = $('#inputID').val();
        var pass = $('#inputPass').val();
        var staffType = 3;
        var url = AllConstant.baseURL + "/loginServerAttempt";

        // var encrypted = CryptoJS.AES.encrypt(AllConstant.baseString, pass).toString();

        if(id !== "" && pass !== "" ){
            $.ajax({
                type: "GET",
                url: url,
                data: {username:id, password:pass},
                contentType: "application/json",
                dataType: "text",
                success: function (data) {
                    const loginResponse = JSON.parse(data);
                    if(loginResponse.statusCode !== undefined){
                        if(loginResponse.statusCode === "200"){
                            setCookie('token', loginResponse.token,365);
                            setCookie('city', loginResponse.user.city,365);
                            setCookie('role', loginResponse.user.role,365);
                            setCookie('type', loginResponse.user.userType,365);
                            setCookie('name', loginResponse.user.name,365);
                            setCookie('username', loginResponse.user.userName,365);
                            swal("Successfully!", loginResponse.user.NAME+", You are logged in", "success").done();
                            self.location="side_menu.html";
                        }else if(loginResponse.statusCode === "404"){
                            swal("Error!", "Invalid username or password!", "error").done();
                        }
                    }
                },
                error: function (data) {
                    swal("Error!", "Something went wrong!", "error").done();
                }
            });
        }


    });
});