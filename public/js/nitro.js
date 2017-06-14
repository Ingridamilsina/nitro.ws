$(document).ready(function () {

    $('#load_db').click(function () {
        Materialize.toast("Loading Database", 3000, "rounded blue")
        var token = $('#api_key').val()
        loadDB(token, (err, data) => {
            if (err) return Materialize.toast("Invalid Token", 3000, "rounded red")
            alert(JSON.stringify(data))
        })

    })

})

function loadDB(token, cb) {
    $.ajax({
        url: "/database",
        method: "GET",
        headers: {
            Authorization: token
        },
        dataType: "json",
        error: function (obj, err) {
            cb(err, null)
        },
        success: function (data) {
            cb(null, data)
        }
    })

}