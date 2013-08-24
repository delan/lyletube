#!/usr/bin/env python

import flask, os, sys, time, json, re, urlparse
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

if getattr(sys, 'frozen', None):
	basedir = sys._MEIPASS
else:
	basedir = os.path.dirname(__file__)

app = flask.Flask(__name__, static_folder=os.path.join(basedir, 'static'))
PORT = 13337

def parseyt(url):
	u = urlparse.urlparse(url)
	q = urlparse.parse_qs(u.query)
	f = urlparse.parse_qs(u.fragment)
	if u.scheme == '':
		return parseyt('http://' + url)
	result = {
		'good':   False,
		'id':     None,
		'start':  None,
		'end':    None,
		'title':  None
	}
	if u.netloc == 'www.youtube.com':
		if q.has_key('v'):
			result['good'] = True
			result['id'] = q['v'][0]
		elif u.netloc == 'youtu.be':
			pass
	if q.has_key('t'):
		result['start'] = parseytt(q['t'][0])
	if f.has_key('t'):
		result['start'] = parseytt(f['t'][0])
	return result

def parseytt(t):
	good = False
	result = 0
	for i in re.finditer('(\d+)([hms])', t):
		good = True
		if i.group(2) == 'h':
			result += int(i.group(1)) * 3600
		elif i.group(2) == 'm':
			result += int(i.group(1)) * 60
		else:
			result += int(i.group(1))
	if not good:
		result = None
	return result

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
