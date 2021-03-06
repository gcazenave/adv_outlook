/*! adal-angular v1.0.12 2016-08-31 */
var AuthenticationContext = function() {
    "use strict";
    return AuthenticationContext = function(a) {
        if (this.REQUEST_TYPE = {
            LOGIN: "LOGIN",
            RENEW_TOKEN: "RENEW_TOKEN",
            UNKNOWN: "UNKNOWN"
        },
        this.CONSTANTS = {
            ACCESS_TOKEN: "access_token",
            EXPIRES_IN: "expires_in",
            ID_TOKEN: "id_token",
            ERROR_DESCRIPTION: "error_description",
            SESSION_STATE: "session_state",
            STORAGE: {
                TOKEN_KEYS: "adal.token.keys",
                ACCESS_TOKEN_KEY: "adal.access.token.key",
                EXPIRATION_KEY: "adal.expiration.key",
                STATE_LOGIN: "adal.state.login",
                STATE_RENEW: "adal.state.renew",
                NONCE_IDTOKEN: "adal.nonce.idtoken",
                SESSION_STATE: "adal.session.state",
                USERNAME: "adal.username",
                IDTOKEN: "adal.idtoken",
                ERROR: "adal.error",
                ERROR_DESCRIPTION: "adal.error.description",
                LOGIN_REQUEST: "adal.login.request",
                LOGIN_ERROR: "adal.login.error",
                RENEW_STATUS: "adal.token.renew.status"
            },
            RESOURCE_DELIMETER: "|",
            LOADFRAME_TIMEOUT: "6000",
            TOKEN_RENEW_STATUS_CANCELED: "Canceled",
            TOKEN_RENEW_STATUS_COMPLETED: "Completed",
            TOKEN_RENEW_STATUS_IN_PROGRESS: "In Progress",
            LOGGING_LEVEL: {
                ERROR: 0,
                WARN: 1,
                INFO: 2,
                VERBOSE: 3
            },
            LEVEL_STRING_MAP: {
                0: "ERROR:",
                1: "WARNING:",
                2: "INFO:",
                3: "VERBOSE:"
            },
            POPUP_WIDTH: 483,
            POPUP_HEIGHT: 600
        },
        AuthenticationContext.prototype._singletonInstance)
            return AuthenticationContext.prototype._singletonInstance;
        if (AuthenticationContext.prototype._singletonInstance = this,
        this.instance = "https://login.microsoftonline.com/",
        this.config = {},
        this.callback = null,
        this.popUp = !1,
        this.isAngular = !1,
        this._user = null,
        this._activeRenewals = {},
        this._loginInProgress = !1,
        this._renewStates = [],
        window.callBackMappedToRenewStates = {},
        window.callBacksMappedToRenewStates = {},
        a.displayCall && "function" != typeof a.displayCall)
            throw new Error("displayCall is not a function");
        if (!a.clientId)
            throw new Error("clientId is required");
        this.config = this._cloneConfig(a),
        this.config.popUp && (this.popUp = !0),
        this.config.callback && "function" == typeof this.config.callback && (this.callback = this.config.callback),
        this.config.instance && (this.instance = this.config.instance),
        this.config.loginResource || (this.config.loginResource = this.config.clientId),
        this.config.redirectUri || (this.config.redirectUri = window.location.href),
        this.config.anonymousEndpoints || (this.config.anonymousEndpoints = []),
        this.config.isAngular && (this.isAngular = this.config.isAngular)
    }
    ,
    window.Logging = {
        level: 0,
        log: function(a) {}
    },
    AuthenticationContext.prototype.login = function() {
        if (this._loginInProgress)
            return void this.info("Login in progress");
        var a = this._guid();
        this.config.state = a,
        this._idTokenNonce = this._guid(),
        this.verbose("Expected state: " + a + " startPage:" + window.location),
        this._saveItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST, window.location),
        this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR, ""),
        this._saveItem(this.CONSTANTS.STORAGE.STATE_LOGIN, a),
        this._saveItem(this.CONSTANTS.STORAGE.NONCE_IDTOKEN, this._idTokenNonce),
        this._saveItem(this.CONSTANTS.STORAGE.ERROR, ""),
        this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, "");
        var b = this._getNavigateUrl("id_token", null) + "&nonce=" + encodeURIComponent(this._idTokenNonce);
        return this._loginInProgress = !0,
        this.popUp ? void this._loginPopup(b) : void (this.config.displayCall ? this.config.displayCall(b) : this.promptUser(b))
    }
    ,
    AuthenticationContext.prototype._openPopup = function(a, b, c, d) {
        try {
            var e = window.screenLeft ? window.screenLeft : window.screenX
              , f = window.screenTop ? window.screenTop : window.screenY
              , g = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
              , h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
              , i = g / 2 - c / 2 + e
              , j = h / 2 - d / 2 + f
              , k = window.open(a, b, "width=" + c + ", height=" + d + ", top=" + j + ", left=" + i);
            return k.focus && k.focus(),
            k
        } catch (a) {
            return this.warn("Error opening popup, " + a.message),
            this._loginInProgress = !1,
            null
        }
    }
    ,
    AuthenticationContext.prototype._loginPopup = function(a) {
        var b = this._openPopup(a, "login", this.CONSTANTS.POPUP_WIDTH, this.CONSTANTS.POPUP_HEIGHT);
        if (null == b)
            return this.warn("Popup Window is null. This can happen if you are using IE"),
            this._saveItem(this.CONSTANTS.STORAGE.ERROR, "Error opening popup"),
            this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, "Popup Window is null. This can happen if you are using IE"),
            this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR, "Popup Window is null. This can happen if you are using IE"),
            void (this.callback && this.callback(this._getItem(this.CONSTANTS.STORAGE.LOGIN_ERROR), null));
        if (this.config.redirectUri.indexOf("#") != -1)
            var c = this.config.redirectUri.split("#")[0];
        else
            var c = this.config.redirectUri;
        var d = this
          , e = window.setInterval(function() {
            b && !b.closed && void 0 !== b.closed || (d._loginInProgress = !1,
            window.clearInterval(e));
            try {
                b.location.href.indexOf(c) != -1 && (d.isAngular ? window.location.hash = b.location.hash : d.handleWindowCallback(b.location.hash),
                window.clearInterval(e),
                d._loginInProgress = !1,
                d.info("Closing popup window"),
                b.close())
            } catch (a) {}
        }, 20)
    }
    ,
    AuthenticationContext.prototype.loginInProgress = function() {
        return this._loginInProgress
    }
    ,
    AuthenticationContext.prototype._hasResource = function(a) {
        var b = this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS);
        return b && !this._isEmpty(b) && b.indexOf(a + this.CONSTANTS.RESOURCE_DELIMETER) > -1
    }
    ,
    AuthenticationContext.prototype.getCachedToken = function(a) {
        if (!this._hasResource(a))
            return null;
        var b = this._getItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + a)
          , c = this._getItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + a)
          , d = this.config.expireOffsetSeconds || 120;
        return c && c > this._now() + d ? b : (this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + a, ""),
        this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + a, 0),
        null)
    }
    ,
    AuthenticationContext.prototype.getCachedUser = function() {
        if (this._user)
            return this._user;
        var a = this._getItem(this.CONSTANTS.STORAGE.IDTOKEN);
        return this._user = this._createUser(a),
        this._user
    }
    ,
    AuthenticationContext.prototype.registerCallback = function(a, b, c) {
        this._activeRenewals[b] = a,
        window.callBacksMappedToRenewStates[a] || (window.callBacksMappedToRenewStates[a] = []);
        var d = this;
        window.callBacksMappedToRenewStates[a].push(c),
        window.callBackMappedToRenewStates[a] || (window.callBackMappedToRenewStates[a] = function(c, e) {
            for (var f = 0; f < window.callBacksMappedToRenewStates[a].length; ++f)
                window.callBacksMappedToRenewStates[a][f](c, e);
            d._activeRenewals[b] = null,
            window.callBacksMappedToRenewStates[a] = null,
            window.callBackMappedToRenewStates[a] = null
        }
        )
    }
    ,
    AuthenticationContext.prototype._renewToken = function(a, b) {
        this.info("renewToken is called for resource:" + a);
        var c = this._addAdalFrame("adalRenewFrame" + a)
          , d = this._guid() + "|" + a;
        this.config.state = d,
        this._renewStates.push(d),
        this.verbose("Renew token Expected state: " + d);
        var e = this._getNavigateUrl("token", a) + "&prompt=none";
        e = this._addHintParameters(e),
        this.registerCallback(d, a, b),
        this.verbose("Navigate to:" + e),
        this._saveItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST, ""),
        c.src = "about:blank",
        this._loadFrameTimeout(e, "adalRenewFrame" + a, a)
    }
    ,
    AuthenticationContext.prototype._renewIdToken = function(a) {
        this.info("renewIdToken is called");
        var b = this._addAdalFrame("adalIdTokenFrame")
          , c = this._guid() + "|" + this.config.clientId;
        this._idTokenNonce = this._guid(),
        this._saveItem(this.CONSTANTS.STORAGE.NONCE_IDTOKEN, this._idTokenNonce),
        this.config.state = c,
        this._renewStates.push(c),
        this.verbose("Renew Idtoken Expected state: " + c);
        var d = this._getNavigateUrl("id_token", null) + "&prompt=none";
        d = this._addHintParameters(d),
        d += "&nonce=" + encodeURIComponent(this._idTokenNonce),
        this.registerCallback(c, this.config.clientId, a),
        this.idTokenNonce = null,
        this.verbose("Navigate to:" + d),
        this._saveItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST, ""),
        b.src = "about:blank",
        this._loadFrameTimeout(d, "adalIdTokenFrame", this.config.clientId)
    }
    ,
    AuthenticationContext.prototype._urlContainsQueryStringParameter = function(a, b) {
        var c = new RegExp("[\\?&]" + a + "=");
        return c.test(b)
    }
    ,
    AuthenticationContext.prototype._loadFrameTimeout = function(a, b, c) {
        this.verbose("Set loading state to pending for: " + c),
        this._saveItem(this.CONSTANTS.STORAGE.RENEW_STATUS + c, this.CONSTANTS.TOKEN_RENEW_STATUS_IN_PROGRESS),
        this._loadFrame(a, b);
        var d = this;
        setTimeout(function() {
            if (d._getItem(d.CONSTANTS.STORAGE.RENEW_STATUS + c) === d.CONSTANTS.TOKEN_RENEW_STATUS_IN_PROGRESS) {
                d.verbose("Loading frame has timed out after: " + d.CONSTANTS.LOADFRAME_TIMEOUT / 1e3 + " seconds for resource " + c);
                var a = d._activeRenewals[c];
                a && window.callBackMappedToRenewStates[a] && window.callBackMappedToRenewStates[a]("Token renewal operation failed due to timeout", null),
                d._saveItem(d.CONSTANTS.STORAGE.RENEW_STATUS + c, d.CONSTANTS.TOKEN_RENEW_STATUS_CANCELED)
            }
        }, d.CONSTANTS.LOADFRAME_TIMEOUT)
    }
    ,
    AuthenticationContext.prototype._loadFrame = function(a, b) {
        var c = this;
        c.info("LoadFrame: " + b);
        var d = b;
        setTimeout(function() {
            var b = c._addAdalFrame(d);
            "" !== b.src && "about:blank" !== b.src || (b.src = a,
            c._loadFrame(a, d))
        }, 500)
    }
    ,
    AuthenticationContext.prototype.acquireToken = function(a, b) {
        if (this._isEmpty(a))
            return this.warn("resource is required"),
            void b("resource is required", null);
        var c = this.getCachedToken(a);
        return c ? (this.info("Token is already in cache for resource:" + a),
        void b(null, c)) : this._user ? void (this._activeRenewals[a] ? this.registerCallback(this._activeRenewals[a], a, b) : a === this.config.clientId ? (this.verbose("renewing idtoken"),
        this._renewIdToken(b)) : this._renewToken(a, b)) : (this.warn("User login is required"),
        void b("User login is required", null))
    }
    ,
    AuthenticationContext.prototype.promptUser = function(a) {
        a ? (this.info("Navigate to:" + a),
        window.location.replace(a)) : this.info("Navigate url is empty")
    }
    ,
    AuthenticationContext.prototype.clearCache = function() {
        this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY, ""),
        this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY, 0),
        this._saveItem(this.CONSTANTS.STORAGE.SESSION_STATE, ""),
        this._saveItem(this.CONSTANTS.STORAGE.STATE_LOGIN, ""),
        this._renewStates = [],
        this._saveItem(this.CONSTANTS.STORAGE.USERNAME, ""),
        this._saveItem(this.CONSTANTS.STORAGE.IDTOKEN, ""),
        this._saveItem(this.CONSTANTS.STORAGE.ERROR, ""),
        this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, "");
        var a = this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS);
        if (!this._isEmpty(a)) {
            a = a.split(this.CONSTANTS.RESOURCE_DELIMETER);
            for (var b = 0; b < a.length; b++)
                this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + a[b], ""),
                this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + a[b], 0)
        }
        this._saveItem(this.CONSTANTS.STORAGE.TOKEN_KEYS, "")
    }
    ,
    AuthenticationContext.prototype.clearCacheForResource = function(a) {
        this._saveItem(this.CONSTANTS.STORAGE.STATE_RENEW, ""),
        this._saveItem(this.CONSTANTS.STORAGE.ERROR, ""),
        this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, ""),
        this._hasResource(a) && (this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + a, ""),
        this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + a, 0))
    }
    ,
    AuthenticationContext.prototype.logOut = function() {
        this.clearCache();
        var a = "common"
          , b = "";
        this._user = null,
        this.config.tenant && (a = this.config.tenant),
        this.config.postLogoutRedirectUri && (b = "post_logout_redirect_uri=" + encodeURIComponent(this.config.postLogoutRedirectUri));
        var c = this.instance + a + "/oauth2/logout?" + b;
        this.info("Logout navigate to: " + c),
        this.promptUser(c)
    }
    ,
    AuthenticationContext.prototype._isEmpty = function(a) {
        return "undefined" == typeof a || !a || 0 === a.length
    }
    ,
    AuthenticationContext.prototype.getUser = function(a) {
        if ("function" != typeof a)
            throw new Error("callback is not a function");
        if (this._user)
            return void a(null, this._user);
        var b = this._getItem(this.CONSTANTS.STORAGE.IDTOKEN);
        this._isEmpty(b) ? (this.warn("User information is not available"),
        a("User information is not available")) : (this.info("User exists in cache: "),
        this._user = this._createUser(b),
        a(null, this._user))
    }
    ,
    AuthenticationContext.prototype._addHintParameters = function(a) {
        if (this._user && this._user.profile && this._user.profile.hasOwnProperty("upn") && (a += "&login_hint=" + encodeURIComponent(this._user.profile.upn),
        !this._urlContainsQueryStringParameter("domain_hint", a) && this._user.profile.upn.indexOf("@") > -1)) {
            var b = this._user.profile.upn.split("@");
            a += "&domain_hint=" + encodeURIComponent(b[b.length - 1])
        }
        return a
    }
    ,
    AuthenticationContext.prototype._createUser = function(a) {
        var b = null
          , c = this._extractIdToken(a);
        return c && c.hasOwnProperty("aud") && (c.aud.toLowerCase() === this.config.clientId.toLowerCase() ? (b = {
            userName: "",
            profile: c
        },
        c.hasOwnProperty("upn") ? b.userName = c.upn : c.hasOwnProperty("email") && (b.userName = c.email)) : this.warn("IdToken has invalid aud field")),
        b
    }
    ,
    AuthenticationContext.prototype._getHash = function(a) {
        return a.indexOf("#/") > -1 ? a = a.substring(a.indexOf("#/") + 2) : a.indexOf("#") > -1 && (a = a.substring(1)),
        a
    }
    ,
    AuthenticationContext.prototype.isCallback = function(a) {
        a = this._getHash(a);
        var b = this._deserialize(a);
        return b.hasOwnProperty(this.CONSTANTS.ERROR_DESCRIPTION) || b.hasOwnProperty(this.CONSTANTS.ACCESS_TOKEN) || b.hasOwnProperty(this.CONSTANTS.ID_TOKEN)
    }
    ,
    AuthenticationContext.prototype.getLoginError = function() {
        return this._getItem(this.CONSTANTS.STORAGE.LOGIN_ERROR)
    }
    ,
    AuthenticationContext.prototype.getRequestInfo = function(a) {
        a = this._getHash(a);
        var b = this._deserialize(a)
          , c = {
            valid: !1,
            parameters: {},
            stateMatch: !1,
            stateResponse: "",
            requestType: this.REQUEST_TYPE.UNKNOWN
        };
        if (b && (c.parameters = b,
        b.hasOwnProperty(this.CONSTANTS.ERROR_DESCRIPTION) || b.hasOwnProperty(this.CONSTANTS.ACCESS_TOKEN) || b.hasOwnProperty(this.CONSTANTS.ID_TOKEN))) {
            c.valid = !0;
            var d = "";
            if (!b.hasOwnProperty("state"))
                return this.warn("No state returned"),
                c;
            if (this.verbose("State: " + b.state),
            d = b.state,
            c.stateResponse = d,
            d === this._getItem(this.CONSTANTS.STORAGE.STATE_LOGIN))
                return c.requestType = this.REQUEST_TYPE.LOGIN,
                c.stateMatch = !0,
                c;
            if (!c.stateMatch && window.parent && window.parent.AuthenticationContext())
                for (var e = window.parent.AuthenticationContext()._renewStates, f = 0; f < e.length; f++)
                    if (e[f] === c.stateResponse) {
                        c.requestType = this.REQUEST_TYPE.RENEW_TOKEN,
                        c.stateMatch = !0;
                        break
                    }
        }
        return c
    }
    ,
    AuthenticationContext.prototype._getResourceFromState = function(a) {
        if (a) {
            var b = a.indexOf("|");
            if (b > -1 && b + 1 < a.length)
                return a.substring(b + 1)
        }
        return ""
    }
    ,
    AuthenticationContext.prototype.saveTokenFromHash = function(a) {
        this.info("State status:" + a.stateMatch + "; Request type:" + a.requestType),
        this._saveItem(this.CONSTANTS.STORAGE.ERROR, ""),
        this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, "");
        var b = this._getResourceFromState(a.stateResponse);
        if (a.parameters.hasOwnProperty(this.CONSTANTS.ERROR_DESCRIPTION))
            this.info("Error :" + a.parameters.error + "; Error description:" + a.parameters[this.CONSTANTS.ERROR_DESCRIPTION]),
            this._saveItem(this.CONSTANTS.STORAGE.ERROR, a.parameters.error),
            this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, a.parameters[this.CONSTANTS.ERROR_DESCRIPTION]),
            a.requestType === this.REQUEST_TYPE.LOGIN && (this._loginInProgress = !1,
            this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR, a.parameters.error_description));
        else if (a.stateMatch) {
            this.info("State is right"),
            a.parameters.hasOwnProperty(this.CONSTANTS.SESSION_STATE) && this._saveItem(this.CONSTANTS.STORAGE.SESSION_STATE, a.parameters[this.CONSTANTS.SESSION_STATE]);
            var c;
            a.parameters.hasOwnProperty(this.CONSTANTS.ACCESS_TOKEN) && (this.info("Fragment has access token"),
            this._hasResource(b) || (c = this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS) || "",
            this._saveItem(this.CONSTANTS.STORAGE.TOKEN_KEYS, c + b + this.CONSTANTS.RESOURCE_DELIMETER)),
            this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + b, a.parameters[this.CONSTANTS.ACCESS_TOKEN]),
            this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + b, this._expiresIn(a.parameters[this.CONSTANTS.EXPIRES_IN]))),
            a.parameters.hasOwnProperty(this.CONSTANTS.ID_TOKEN) && (this.info("Fragment has id token"),
            this._loginInProgress = !1,
            this._user = this._createUser(a.parameters[this.CONSTANTS.ID_TOKEN]),
            this._user && this._user.profile ? this._user.profile.nonce !== this._getItem(this.CONSTANTS.STORAGE.NONCE_IDTOKEN) ? (this._user = null,
            this._saveItem(this.CONSTANTS.STORAGE.LOGIN_ERROR, "Nonce is not same as " + this._idTokenNonce)) : (this._saveItem(this.CONSTANTS.STORAGE.IDTOKEN, a.parameters[this.CONSTANTS.ID_TOKEN]),
            b = this.config.loginResource ? this.config.loginResource : this.config.clientId,
            this._hasResource(b) || (c = this._getItem(this.CONSTANTS.STORAGE.TOKEN_KEYS) || "",
            this._saveItem(this.CONSTANTS.STORAGE.TOKEN_KEYS, c + b + this.CONSTANTS.RESOURCE_DELIMETER)),
            this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY + b, a.parameters[this.CONSTANTS.ID_TOKEN]),
            this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY + b, this._user.profile.exp)) : (this._saveItem(this.CONSTANTS.STORAGE.ERROR, "invalid id_token"),
            this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, "Invalid id_token. id_token: " + a.parameters[this.CONSTANTS.ID_TOKEN])))
        } else
            this._saveItem(this.CONSTANTS.STORAGE.ERROR, "Invalid_state"),
            this._saveItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION, "Invalid_state. state: " + a.stateResponse);
        this._saveItem(this.CONSTANTS.STORAGE.RENEW_STATUS + b, this.CONSTANTS.TOKEN_RENEW_STATUS_COMPLETED)
    }
    ,
    AuthenticationContext.prototype.getResourceForEndpoint = function(a) {
        if (this.config && this.config.endpoints)
            for (var b in this.config.endpoints)
                if (a.indexOf(b) > -1)
                    return this.config.endpoints[b];
        if (!(a.indexOf("http://") > -1 || a.indexOf("https://") > -1)) {
            if (this.config && this.config.anonymousEndpoints)
                for (var c = 0; c < this.config.anonymousEndpoints.length; c++)
                    if (a.indexOf(this.config.anonymousEndpoints[c]) > -1)
                        return null;
            return this.config.loginResource
        }
        return this._getHostFromUri(a) === this._getHostFromUri(this.config.redirectUri) ? this.config.loginResource : null
    }
    ,
    AuthenticationContext.prototype._getHostFromUri = function(a) {
        var b = String(a).replace(/^(https?:)\/\//, "");
        return b = b.split("/")[0]
    }
    ,
    AuthenticationContext.prototype.handleWindowCallback = function(a) {
        if (null == a && (a = window.location.hash),
        this.isCallback(a)) {
            var b = this.getRequestInfo(a);
            this.info("Returned from redirect url"),
            this.saveTokenFromHash(b);
            var c = null;
            if (b.requestType === this.REQUEST_TYPE.RENEW_TOKEN && window.parent && window.parent !== window)
                return this.verbose("Window is in iframe"),
                c = window.parent.callBackMappedToRenewStates[b.stateResponse],
                void (c && c(this._getItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION), b.parameters[this.CONSTANTS.ACCESS_TOKEN] || b.parameters[this.CONSTANTS.ID_TOKEN]));
            b.requestType === this.REQUEST_TYPE.LOGIN && (c = this.callback,
            c && c(this._getItem(this.CONSTANTS.STORAGE.ERROR_DESCRIPTION), b.parameters[this.CONSTANTS.ID_TOKEN])),
            this.popUp || (window.location = this._getItem(this.CONSTANTS.STORAGE.LOGIN_REQUEST))
        }
    }
    ,
    AuthenticationContext.prototype._getNavigateUrl = function(a, b) {
        var c = "common";
        this.config.tenant && (c = this.config.tenant);
        var d = this.instance + c + "/oauth2/authorize" + this._serialize(a, this.config, b) + this._addLibMetadata();
        return this.info("Navigate url:" + d),
        d
    }
    ,
    AuthenticationContext.prototype._extractIdToken = function(a) {
        var b = this._decodeJwt(a);
        if (!b)
            return null;
        try {
            var c = b.JWSPayload
              , d = this._base64DecodeStringUrlSafe(c);
            return d ? JSON.parse(d) : (this.info("The returned id_token could not be base64 url safe decoded."),
            null)
        } catch (a) {
            this.error("The returned id_token could not be decoded", a)
        }
        return null
    }
    ,
    AuthenticationContext.prototype._base64DecodeStringUrlSafe = function(a) {
        return a = a.replace(/-/g, "+").replace(/_/g, "/"),
        window.atob ? decodeURIComponent(escape(window.atob(a))) : decodeURIComponent(escape(this._decode(a)))
    }
    ,
    AuthenticationContext.prototype._decode = function(a) {
        var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        a = String(a).replace(/=+$/, "");
        var c = a.length;
        if (c % 4 === 1)
            throw new Error("The token to be decoded is not correctly encoded.");
        for (var d, e, f, g, h, i, j, k, l = "", m = 0; m < c; m += 4) {
            if (d = b.indexOf(a.charAt(m)),
            e = b.indexOf(a.charAt(m + 1)),
            f = b.indexOf(a.charAt(m + 2)),
            g = b.indexOf(a.charAt(m + 3)),
            m + 2 === c - 1) {
                h = d << 18 | e << 12 | f << 6,
                i = h >> 16 & 255,
                j = h >> 8 & 255,
                l += String.fromCharCode(i, j);
                break
            }
            if (m + 1 === c - 1) {
                h = d << 18 | e << 12,
                i = h >> 16 & 255,
                l += String.fromCharCode(i);
                break
            }
            h = d << 18 | e << 12 | f << 6 | g,
            i = h >> 16 & 255,
            j = h >> 8 & 255,
            k = 255 & h,
            l += String.fromCharCode(i, j, k)
        }
        return l
    }
    ,
    AuthenticationContext.prototype._decodeJwt = function(a) {
        if (this._isEmpty(a))
            return null;
        var b = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/
          , c = b.exec(a);
        if (!c || c.length < 4)
            return this.warn("The returned id_token is not parseable."),
            null;
        var d = {
            header: c[1],
            JWSPayload: c[2],
            JWSSig: c[3]
        };
        return d
    }
    ,
    AuthenticationContext.prototype._convertUrlSafeToRegularBase64EncodedString = function(a) {
        return a.replace("-", "+").replace("_", "/")
    }
    ,
    AuthenticationContext.prototype._serialize = function(a, b, c) {
        var d = [];
        if (null !== b) {
            d.push("?response_type=" + a),
            d.push("client_id=" + encodeURIComponent(b.clientId)),
            c && d.push("resource=" + encodeURIComponent(c)),
            d.push("redirect_uri=" + encodeURIComponent(b.redirectUri)),
            d.push("state=" + encodeURIComponent(b.state)),
            b.hasOwnProperty("slice") && d.push("slice=" + encodeURIComponent(b.slice)),
            b.hasOwnProperty("extraQueryParameter") && d.push(b.extraQueryParameter);
            var e = b.correlationId ? b.correlationId : this._guid();
            d.push("client-request-id=" + encodeURIComponent(e))
        }
        return d.join("&")
    }
    ,
    AuthenticationContext.prototype._deserialize = function(a) {
        var b, c = /\+/g, d = /([^&=]+)=([^&]*)/g, e = function(a) {
            return decodeURIComponent(a.replace(c, " "))
        }, f = {};
        for (b = d.exec(a); b; )
            f[e(b[1])] = e(b[2]),
            b = d.exec(a);
        return f
    }
    ,
    AuthenticationContext.prototype._guid = function() {
        function a(a) {
            for (var b = a.toString(16); b.length < 2; )
                b = "0" + b;
            return b
        }
        var b = window.crypto || window.msCrypto;
        if (b && b.getRandomValues) {
            var c = new Uint8Array(16);
            return b.getRandomValues(c),
            c[6] |= 64,
            c[6] &= 79,
            c[8] |= 128,
            c[8] &= 191,
            a(c[0]) + a(c[1]) + a(c[2]) + a(c[3]) + "-" + a(c[4]) + a(c[5]) + "-" + a(c[6]) + a(c[7]) + "-" + a(c[8]) + a(c[9]) + "-" + a(c[10]) + a(c[11]) + a(c[12]) + a(c[13]) + a(c[14]) + a(c[15])
        }
        for (var d = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx", e = "0123456789abcdef", f = 0, g = "", h = 0; h < 36; h++)
            "-" !== d[h] && "4" !== d[h] && (f = 16 * Math.random() | 0),
            "x" === d[h] ? g += e[f] : "y" === d[h] ? (f &= 3,
            f |= 8,
            g += e[f]) : g += d[h];
        return g
    }
    ,
    AuthenticationContext.prototype._expiresIn = function(a) {
        return this._now() + parseInt(a, 10)
    }
    ,
    AuthenticationContext.prototype._now = function() {
        return Math.round((new Date).getTime() / 1e3)
    }
    ,
    AuthenticationContext.prototype._addAdalFrame = function(a) {
        if ("undefined" != typeof a) {
            this.info("Add adal frame to document:" + a);
            var b = document.getElementById(a);
            if (!b) {
                if (document.createElement && document.documentElement && (window.opera || window.navigator.userAgent.indexOf("MSIE 5.0") === -1)) {
                    var c = document.createElement("iframe");
                    c.setAttribute("id", a),
                    c.style.visibility = "hidden",
                    c.style.position = "absolute",
                    c.style.width = c.style.height = c.borderWidth = "0px",
                    b = document.getElementsByTagName("body")[0].appendChild(c)
                } else
                    document.body && document.body.insertAdjacentHTML && document.body.insertAdjacentHTML("beforeEnd", '<iframe name="' + a + '" id="' + a + '" style="display:none"></iframe>');
                window.frames && window.frames[a] && (b = window.frames[a])
            }
            return b
        }
    }
    ,
    AuthenticationContext.prototype._saveItem = function(a, b) {
        return this.config && this.config.cacheLocation && "localStorage" === this.config.cacheLocation ? this._supportsLocalStorage() ? (localStorage.setItem(a, b),
        !0) : (this.info("Local storage is not supported"),
        !1) : this._supportsSessionStorage() ? (sessionStorage.setItem(a, b),
        !0) : (this.info("Session storage is not supported"),
        !1)
    }
    ,
    AuthenticationContext.prototype._getItem = function(a) {
        return this.config && this.config.cacheLocation && "localStorage" === this.config.cacheLocation ? this._supportsLocalStorage() ? localStorage.getItem(a) : (this.info("Local storage is not supported"),
        null) : this._supportsSessionStorage() ? sessionStorage.getItem(a) : (this.info("Session storage is not supported"),
        null)
    }
    ,
    AuthenticationContext.prototype._supportsLocalStorage = function() {
        try {
            return "localStorage"in window && window.localStorage
        } catch (a) {
            return !1
        }
    }
    ,
    AuthenticationContext.prototype._supportsSessionStorage = function() {
        try {
            return "sessionStorage"in window && window.sessionStorage
        } catch (a) {
            return !1
        }
    }
    ,
    AuthenticationContext.prototype._cloneConfig = function(a) {
        if (null === a || "object" != typeof a)
            return a;
        var b = {};
        for (var c in a)
            a.hasOwnProperty(c) && (b[c] = a[c]);
        return b
    }
    ,
    AuthenticationContext.prototype._addLibMetadata = function() {
        return "&x-client-SKU=Js&x-client-Ver=" + this._libVersion()
    }
    ,
    AuthenticationContext.prototype.log = function(a, b, c) {
        if (a <= Logging.level) {
            var d = (new Date).toUTCString()
              , e = "";
            e = this.config.correlationId ? d + ":" + this.config.correlationId + "-" + this._libVersion() + "-" + this.CONSTANTS.LEVEL_STRING_MAP[a] + " " + b : d + ":" + this._libVersion() + "-" + this.CONSTANTS.LEVEL_STRING_MAP[a] + " " + b,
            c && (e += "\nstack:\n" + c.stack),
            Logging.log(e)
        }
    }
    ,
    AuthenticationContext.prototype.error = function(a, b) {
        this.log(this.CONSTANTS.LOGGING_LEVEL.ERROR, a, b)
    }
    ,
    AuthenticationContext.prototype.warn = function(a) {
        this.log(this.CONSTANTS.LOGGING_LEVEL.WARN, a, null)
    }
    ,
    AuthenticationContext.prototype.info = function(a) {
        this.log(this.CONSTANTS.LOGGING_LEVEL.INFO, a, null)
    }
    ,
    AuthenticationContext.prototype.verbose = function(a) {
        this.log(this.CONSTANTS.LOGGING_LEVEL.VERBOSE, a, null)
    }
    ,
    AuthenticationContext.prototype._libVersion = function() {
        return "1.0.12"
    }
    ,
    "undefined" != typeof module && module.exports && (module.exports = AuthenticationContext,
    module.exports.inject = function(a) {
        return new AuthenticationContext(a)
    }
    ),
    AuthenticationContext
}();


MOT DE PASSE : moipfpnkjPO32U3OLeFmq5M

CLE PRIVEE 1 : BBF15B919BCBB41240A57C388530C2B20D033BC4

CLE PRIVEE 2 : 2A2AE18516B305F6F4F62CE7B09C00BE2F571311