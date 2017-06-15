$(document).ready(function () {
    //Chips
    $('#adblock-users').material_chip({
        placeholder: "The ID of the user",
        secondaryPlaceholder: "The ID of the user"
    });
    $('#adblock-users').on('chip.add', function (e, chip) {
        if (chip.tag.match(/[^0123456789]/g)) Materialize.toast("ID's are numerical only", 3000, "rounded red")
    })
    $('#adblock-roles').material_chip({
        placeholder: "The ID of the role",
        secondaryPlaceholder: "The ID of the role"
    });
    $('#adblock-roles').on('chip.add', function (e, chip) {
        if (chip.tag.match(/[^0123456789]/g)) Materialize.toast("ID's are numerical only", 3000, "rounded red")
    })
    $('#filter-keywords').material_chip({
        placeholder: "The Keyword",
        secondaryPlaceholder: "The Keyword"
    });

    //Tooltips
    $("#load_db").tooltip({delay: 50})
    $("#submit_form").tooltip({delay: 50})

    //Token in url
    var token = getOptionals("token")
    if (token) $("#api_key").val(token)

    //Load Button
    $('#load_db').click(function () {
        Materialize.toast("Loading Configuration From Server", 3000, "rounded blue")
        var token = $('#api_key').val()
        loadDB(token, function (err, data) {
            if (err || data.error) return Materialize.toast("Invalid Token", 3000, "rounded red")
            setForm(data)
            Materialize.toast("Configuration Loaded", 3000, "rounded green")
        })

    })

    //Submit Button
    $("#submit_form").click(function () {
        Materialize.toast("Submitting Configuration", 3000, "rounded blue")
        var token = $('#api_key').val()
        var data = collectForm()
        submitDB(token, data, function (err, data) {
            if (err || data.error) return Materialize.toast("Invalid Token", 3000, "rounded red")
            Materialize.toast("Configuration Saved To Server", 3000, "rounded green")
        })
    })

})

function collectForm() {
    var form = {}
    //Prefix
    A("#prefix") ? form.prefix = A("#prefix") : 0

    //Adlock
    var adblock = {}
    adblock.on = B("#adblock-toggle")
    adblock.strikes = B("#adblock-strikes")
    adblock.notify = B("#adblock-notify")
    adblock.ex = {}
    var userChips = $("#adblock-users").material_chip("data")
    var users = {}
    userChips.forEach(function (chip) {
        //Filter the chips
        if (!/[^0123456789]/g.test(chip.tag) && /\d{17,}/g.test(chip.tag)) users[chip.tag] = true
    })
    adblock.ex.users = users
    var roleChips = $("#adblock-roles").material_chip("data")
    var roles = {}
    roleChips.forEach(function (chip) {
        //Filter the chips
        if (!/[^0123456789]/g.test(chip.tag) && /\d{17,}/g.test(chip.tag)) roles[chip.tag] = true
    })
    adblock.ex.roles = roles
    form.adblock = adblock

    //Keyword Filters
    var filter = {}
    filter.strikes = B("#filter-strikes")
    var filterChips = $("#filter-keywords").material_chip("data")
    var keywords = {}
    filterChips.forEach(function (chip) {
        keywords[chip.tag] = true
    })
    filter.keywords = keywords
    form.filter = filter

    //Join DM
    A("#joindm") ? form.joindm = A("#joindm") : 0

    //Modules
    var modules = {}
    modules.music = !B("#module-fun")
    modules.social = !B("#module-fun")
    modules.fun = !B("#module-fun")
    form.modules = modules

    return form
}

function setForm(d) {
    (!d.prefix) || $("#prefix").val(d.prefix)

    if (d.adblock) {
        $('#adblock-toggle').prop('checked', d.adblock.on)
        $('#adblock-strikes').prop('checked', d.adblock.strikes)
        $('#adblock-notify').prop('checked', d.adblock.notify)
        if (d.adblock.ex && d.adblock.ex.users) {
            var data = []
            Object.keys(d.adblock.ex.users).forEach(function (chip) {
                data.push({
                    tag: chip
                })
            })
            $('#adblock-users').material_chip({
                data: data
            })
        }
        if (d.adblock.ex && d.adblock.ex.roles) {
            var data = []
            Object.keys(d.adblock.ex.roles).forEach(function (chip) {
                data.push({
                    tag: chip
                })
            })
            $('#adblock-roles').material_chip({
                data: data
            })
        }
    }

    if (d.filter) {
        $('#filter-strikes').prop('checked', d.filter.strikes)
        if (d.filter.keywords) {
            var data = []
            Object.keys(d.filter.keywords).forEach(function (chip) {
                data.push({
                    tag: chip
                })
            })
            $('#filter-keywords').material_chip({
                data: data
            })
        }
    }

    $("#joindm").val(d.joindm)

    $("#module-music").prop('checked', !d.modules.music)
    $("#module-social").prop('checked', !d.modules.social)
    $("#module-fun").prop('checked', !d.modules.fun)


}

function A(doc) {
    return $(doc).val().length !== 0 ? $(doc).val() : false
}

function B(doc) {
    return $(doc).prop("checked")
}

function getOptionals(field, url) {
    var href = window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};

function submitDB(token, data, cb) {
    $.ajax({
        url: "/database", //Change On Live
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
        url: "/database", //Change On Live
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

(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space