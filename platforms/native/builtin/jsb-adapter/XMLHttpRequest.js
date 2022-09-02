if (window.oh) {
    const ohHttp = window.oh.http;
    class XMLHttpRequestAdapter {
        constructor() {
            this._method = "";
            this._url = "";
            this._async = true;
            this._user = null;
            this._password = null;
            this.onreadystatechange = null;
            this._readyState = XMLHttpRequest.UNSENT;
            this._httpRequest = ohHttp.createHttp();
            this._responseText = "";
            this._requestHeader = {};
            this._status = 0;
            this._contentLength = 0;
            this._recvLength = 0;

            this._httpRequest.on('headersReceive', (function(header) {this._headersReceive(header)}).bind(this));
        }

        open(method, url, ...args) {
            this._method = method;
            this._url = url;
            if (args.length >= 1) {
                this._async = args[0];
            }
            if (args.length >= 2) {
                this._user = args[1];
            }
            if (args.length == 3) {
                this._password = args[2];
            }
            this._status = 0;
            this._contentLength = 0;
            this._recvLength = 0;
            this._readyState = XMLHttpRequest.OPENED;
        }

        send(body) {
            if (this._method == "GET") {
                this._httpRequest.request(this._url, {header : this._requestHeader, method : ohHttp.RequestMethod.GET}, (err, data) => {this._requestCallback(err, data)});
            } else if (this._method == "POST") {
                this._httpRequest.request(this._url, {header : this._requestHeader, method : ohHttp.RequestMethod.POST, extraData : {"data" : body}}, (err, data) => {this._requestCallback(err, data)});
            }
        }

        setRequestHeader(header, value) {
            if (header in this._requestHeader) {
                this._requestHeader[header] += (', ' + value);
            } else {
                this._requestHeader[header] = value;
            }
        }

        _requestCallback(err, data) {
            if (err) {
                this._readyState = XMLHttpRequest.UNSENT;
                return;
            }
            this._readyState = XMLHttpRequest.LOADING;
            this._responseText = data.result;
            this._recvLength += parseInt(data.header['content-length']);
            if (this._recvLength == this._contentLength) {
                this._readyState = XMLHttpRequest.DONE;
            }
            this._status = data.responseCode;
            if (typeof this.onreadystatechange === 'function') {
                this.onreadystatechange();
            }
        }

        _headersReceive(header) {
            this._readyState = XMLHttpRequest.HEADERS_RECEIVED;
            this._contentLength = parseInt(header['content-length']);
        }
    }

    class XMLHttpRequest {
        constructor() {
            this._xmlHttpRequest = new XMLHttpRequestAdapter();
            this._xmlHttpRequest.onreadystatechange = (function() {this.onreadystatechange()}).bind(this);
        }

        open(method, url, ...args) {
            this._xmlHttpRequest.open(method, url, ...args);
        }

        send(body) {
            this._xmlHttpRequest.send(body);
        }

        setRequestHeader(header, value) {
            this._xmlHttpRequest.setRequestHeader(header, value);
        }

        onreadystatechange() {
        }

        get responseText() {
            return this._xmlHttpRequest._responseText;
        }

        get readyState() {
            return this._xmlHttpRequest._readyState;
        }

        get status() {
            return this._xmlHttpRequest._status;
        }
    }

    XMLHttpRequest.UNSENT = 0;
    XMLHttpRequest.OPENED = 1;
    XMLHttpRequest.HEADERS_RECEIVED = 2;
    XMLHttpRequest.LOADING = 3;
    XMLHttpRequest.DONE = 4;

    window.XMLHttpRequest = XMLHttpRequest;
}