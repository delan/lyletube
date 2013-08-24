#!/usr/bin/env python

import flask, os, sys, time, json
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

if getattr(sys, 'frozen', None):
	basedir = sys._MEIPASS
else:
	basedir = os.path.dirname(__file__)

app = flask.Flask(__name__, static_folder=os.path.join(basedir, 'static'))
PORT = 13337

@app.route('/')
def hello():
	return flask.send_from_directory(app.static_folder, 'submit.html')

@app.route('/manager')
def manager():
	return flask.send_from_directory(app.static_folder, 'manager.html')

@app.route('/player')
def player():
	return flask.send_from_directory(app.static_folder, 'player.html')

if __name__ == '__main__':
	if len(sys.argv) > 1:
		PORT = sys.argv[1]
	server = HTTPServer(WSGIContainer(app))
	print 'Now listening on port ' + str(PORT)
	server.listen(PORT)
	IOLoop.instance().start()
