$(document).ready(function () {

    $('#load_db').click(function () {
        Materialize.toast("Loading Configuration From Server", 3000, "rounded blue")
        var token = $('#api_key').val()
        loadDB(token, (err, data) => {
            if (err || data.error) return Materialize.toast("Invalid Token", 3000, "rounded red")
            setForm(data)
            Materialize.toast("Configuration Loaded", 3000, "rounded green")
        })

    })

    $("#submit_form").click(function () {
        Materialize.toast("Submitting Configuration", 3000, "rounded blue")
        var token = $('#api_key').val()
        let data = collectForm()
        submitDB(token, data, (err, data) => {
            if (err || data.error) return Materialize.toast("Invalid Token", 3000, "rounded red")
            Materialize.toast("Configuration Saved To Server", 3000, "rounded green")
        })
    })

})

function collectForm() {
    let obj = {
        prefix: $("#prefix").val()
    }
    return obj
}

function setForm(d) {
    if (d.prefix) $("#prefix").val(d.prefix)
}

function submitDB(token, data, cb) {
    $.ajax({
        url: "http://nitro.ws/database", //Change On Live
        method: "POST",
        headers: {
            Authorization: token,
            data: JSON.stringify(data)
        },
        dataType: "json",
        data: JSON.stringify(data),
        error: function (obj, err) {
            cb(err, null)
        },
        success: function (data) {
            cb(null, data)
        }
    })
}

function loadDB(token, cb) {
    $.ajax({
        url: "http://nitro.ws/database", //Change On Live
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