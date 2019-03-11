import os
import datetime
from flask import Flask, render_template, redirect, jsonify, request, url_for, session
from flask_socketio import SocketIO, emit, send
from flask_session import Session
from channels import Channel

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"


socketio = SocketIO(app)
Session(app)
channels = []

@app.route("/")
def index():
    """display home page and check for user"""
    try:
        return render_template("index.html", name=session["name"], lastChannel=session["lastChannel"], channels=channels)
    except KeyError:
        try:
            return render_template("index.html", name=session["name"], channels=channels)
        except KeyError:
            return render_template("index.html", channels=channels)
