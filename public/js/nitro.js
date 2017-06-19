$(document).ready(function() {
    //Chips
    $('#adblock-users').material_chip({
        placeholder: "The ID of the user",
        secondaryPlaceholder: "The ID of the user"
    });
    $('#adblock-users').on('chip.add', function(e, chip) {
        if (chip.tag.match(/[^0123456789]/g)) Materialize.toast("ID's are numerical only", 3000, "rounded red")
    })
    $('#adblock-roles').material_chip({
        placeholder: "The ID of the role",
        secondaryPlaceholder: "The ID of the role"
    });
    $('#adblock-roles').on('chip.add', function(e, chip) {
        if (chip.tag.match(/[^0123456789]/g)) Materialize.toast("ID's are numerical only", 3000, "rounded red")
    })
    $('#filter-keywords').material_chip({
        placeholder: "The Keyword",
        secondaryPlaceholder: "The Keyword"
    });

	//Select
	$("#select-guild").material_select()

    //Tooltips
    $("#load_db").tooltip({
        delay: 50
    })
    $("#submit_form").tooltip({
        delay: 50
    })

    disableForm(true)

    //Access Token
    var nitroAccessToken = getCookie('nitroAccessToken')
    if (nitroAccessToken) {
        var date = new Date()
        var time = date.getTime()
        localStorage.setItem('accessToken', JSON.stringify({ token: nitroAccessToken, date: time }))
    }

    var checkAccessToken = localStorage.getItem('accessToken')
    if (checkAccessToken) {
        var parsed = JSON.parse(checkAccessToken)
        var keyTime = parsed.date
        var date = new Date()
        var time = date.getTime()

        if (keyTime - time > 518400000) {
            loginRedirect()
        }
    } else {
        loginRedirect()
    }

    if (checkAccessToken) {
        loadUserData()
    }

    //Submit Button
    //$("#submit_form").click(submitButton)

})

function loadUserData() {
    Materialize.toast("Fetching Guilds...", 3000, "rounded blue")
    fetchUserInfo(function(err, data) {
		data = JSON.parse(data)
		alert(data)
		if (err || data.error) return Materialize.toast("Request Failed, Try Again Later", 3000, "rounded red")
		
		if (data.guilds.length === 0) return Materialize.toast("You Do Not Own Any Servers", 3000, "rounded red")

		fillProfile(data.user)
		fillDropdown(data.guilds)

    })
}

function fillProfile(user) {
	$('#profile-img').attr('src', user.avatarURL)
	$('#profile-text').attr('class', 'brand-logo')
	if (user.username.length > 10) user.username = user.username.substring(0, 10)
	$('#profile-text').text(user.username)
}

function fillDropdown(guilds) {
	var opt = []
	var choose = `<option value="" disabled selected>Choose an option</option>`
	opt.push(choose)

	guilds.forEach((g, i) => {
		var text = g.name
		if (text.length > 25) text = text.substring(0, 25)
		var a = `<option value="${i}" data-icon="${g.iconURL}" class="circle">${text}</option>`
	})

	$('#select-guild').html(opt.join(" "))
	$('#select-guild').removeAttr('disabled')
}

function loginRedirect() {
    Materialize.toast('Logging In...', 3000, "rounded blue")
    auth(function(err, creds) {
        creds = JSON.parse(creds)
        if (err || creds.error) return Materialize.toast("Login Failed, Try Again Later", 3000, "rounded red")
        var decode = atob(creds.auth)
        var decode_split = decode.split(":")
        var API_TOKEN = decode_split[0]
        var API_SECRET = decode_split[1]
        login(creds, function(err, dataObj) {
            dataObj = JSON.parse(dataObj)
            if (err || dataObj.error) return Materialize.toast("Login Failed, Try Again Later", 3000, "rounded red")
            window.location.href = dataObj.url
        })

    })
}

function submitButton() {
    Materialize.toast("Submitting Configuration", 3000, "rounded blue")
    var token = $('#api_key').val()
    var data = collectForm()
    submitDB(token, data, function(err, data) {
        if (err || data.error) return Materialize.toast("Invalid Token", 3000, "rounded red")
        Materialize.toast("Configuration Saved To Server", 3000, "rounded green")
    })
}

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
    userChips.forEach(function(chip) {
        //Filter the chips
        if (!/[^0123456789]/g.test(chip.tag) && /\d{17,}/g.test(chip.tag)) users[chip.tag] = true
    })
    adblock.ex.users = users
    var roleChips = $("#adblock-roles").material_chip("data")
    var roles = {}
    roleChips.forEach(function(chip) {
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
    filterChips.forEach(function(chip) {
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
            Object.keys(d.adblock.ex.users).forEach(function(chip) {
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
            Object.keys(d.adblock.ex.roles).forEach(function(chip) {
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
            Object.keys(d.filter.keywords).forEach(function(chip) {
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

function disableForm(dis = false) {
    var formItems = [
		'submit_form',
        'prefix',
        'adblock-toggle',
        'adblock-strikes',
        'adblock-notify',
        'adblock-users',
        'adblock-roles',
        'filter-strikes',
        'filter-keywords',
        'joindm',
        'module-music',
        'module-fun',
        'module-social'
    ]
    if (dis) {
        for (i = 0; i < formItems.length; i++) {
            $("#" + formItems[i]).attr("disabled", "true")
        }
    } else {
        for (i = 0; i < formItems.length; i++) {
            $("#" + formItems[i]).removeAttr("disabled")
        }
    }
}

function fetchUserInfo(cb) {
    var token = getToken()
    $.ajax({
        url: "/api/userinfo",
        method: "GET",
        headers: {
            Authorization: "Basic " + token
        },
        error: function(obj, error) {
            cb(error, false)
        },
        success: function(data) {
            cb(false, data)
        }
    })
}

function auth(cb) {
    var DEFAULT = "ruojrb5enfktpkd2d6yg8vcmop5z12yl6lv3u4plwc"
    var df = btoa(DEFAULT)
    $.ajax({
        url: "/api/authorize",
        method: "GET",
        headers: {
            Authorization: "Basic " + df,
        },
        error: function(obj, error) {
            cb(error, false)
        },
        success: function(data) {
            cb(false, data)
        }
    })
}

function login(token, cb) {
    token = token.auth
    $.ajax({
        url: "/api/login",
        method: "GET",
        headers: {
            Authorization: "Basic " + token
        },
        error: function(obj, error) {
            cb(error, false)
        },
        success: function(data) {
            cb(false, data)
        }
    })
}

function submitDB(token, data, cb) {
    $.ajax({
        url: "/api/database",
        method: "POST",
        headers: {
            Authorization: token,
            data: JSON.stringify(data)
        },
        dataType: "json",
        data: JSON.stringify(data),
        error: function(obj, err) {
            cb(err, null)
        },
        success: function(data) {
            cb(null, data)
        }
    })
}

function loadDB(token, cb) {
    $.ajax({
        url: "/api/database",
        method: "GET",
        headers: {
            Authorization: token
        },
        dataType: "json",
        error: function(obj, err) {
            cb(err, null)
        },
        success: function(data) {
            cb(null, data)
        }
    })

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

function getToken() {
    var obj = localStorage.getItem('accessToken')
    if (!obj) return null
    var json = JSON.parse(obj)
    return json.token
}



















//Cookie Function
if (typeof String.prototype.trimLeft !== "function") {
    String.prototype.trimLeft = function() {
        return this.replace(/^\s+/, "");
    };
}
if (typeof String.prototype.trimRight !== "function") {
    String.prototype.trimRight = function() {
        return this.replace(/\s+$/, "");
    };
}
if (typeof Array.prototype.map !== "function") {
    Array.prototype.map = function(callback, thisArg) {
        for (var i = 0, n = this.length, a = []; i < n; i++) {
            if (i in this) a[i] = callback.call(thisArg, this[i]);
        }
        return a;
    };
}

function getCookies() {
    var c = document.cookie,
        v = 0,
        cookies = {};
    if (document.cookie.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
        c = RegExp.$1;
        v = 1;
    }
    if (v === 0) {
        c.split(/[,;]/).map(function(cookie) {
            var parts = cookie.split(/=/, 2),
                name = decodeURIComponent(parts[0].trimLeft()),
                value = parts.length > 1 ? decodeURIComponent(parts[1].trimRight()) : null;
            cookies[name] = value;
        });
    } else {
        c.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g).map(function($0, $1) {
            var name = $0,
                value = $1.charAt(0) === '"' ?
                $1.substr(1, -1).replace(/\\(.)/g, "$1") :
                $1;
            cookies[name] = value;
        });
    }
    return cookies;
}

function getCookie(name) {
    return getCookies()[name];
}