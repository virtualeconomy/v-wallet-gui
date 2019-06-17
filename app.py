# app.py
from urllib.parse import urlparse, urlunparse
from flask import Flask, redirect, jsonify, render_template, url_for, request, abort, Response
from requests import get

import json
import requests

app = Flask(__name__)

# Web Pages

NODE_API_URL = "http://wallet.v.systems:9922"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/<path:path>")
def index_rest(path):
    return render_template("index.html")

@app.route('/api/', defaults={'path': ''}, methods=["GET", "POST"])
@app.route('/api/<path:path>', methods=["GET", "POST"])
def proxy(path):
    resp = requests.request(
        method=request.method,
        url=SITE_NAME+path,
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False)

    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]

    response = Response(resp.content, resp.status_code, headers)
    return response


# include this for local dev
if __name__ == '__main__':
    app.run()
