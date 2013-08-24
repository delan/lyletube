#!/usr/bin/env python

import flask, os, sys, time, json, re, urlparse, urllib2, threading
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

if getattr(sys, 'frozen', None):
	basedir = sys._MEIPASS
else:
	basedir = os.path.dirname(__file__)

app = flask.Flask(__name__, static_folder=os.path.join(basedir, 'static'))
PORT = 13337

heap = []
queue = []
history = []
last_heap_serial = 0
last_queue_serial = 0

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
		'title':  None,
		'duration': None,
		'serial': None
	}
	if u.netloc == 'www.youtube.com':
		if q.has_key('v'):
			result['good'] = True
			result['id'] = q['v'][0]
	elif u.netloc == 'youtu.be':
		result['good'] = True
		result['id'] = u.path[1:]
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

def getytinfo(obj):
	good = False
	if obj['good']:
		info = urlparse.parse_qs(urllib2.urlopen(
			'http://www.youtube.com/get_video_info?video_id=' +
			obj['id']
		).read())
		if info.has_key('title') and info.has_key('length_seconds'):
			good = True
			obj['title'] = info['title'][0]
			obj['duration'] = info['length_seconds'][0]
	if good:
		result = obj
	else:
		result = None
	return result

def submiturl(url):
	obj = parseyt(url)
	obj = getytinfo(obj)
	if obj is not None:
		global last_heap_serial
		last_heap_serial += 1
		obj['serial'] = last_heap_serial
		heap.append(obj)

@app.route('/')
def p_hello():
	return flask.send_from_directory(app.static_folder, 'submit.html')

@app.route('/manager')
def p_manager():
	return flask.send_from_directory(app.static_folder, 'manager.html')

@app.route('/player')
def p_player():
	return flask.send_from_directory(app.static_folder, 'player.html')

@app.route('/heap', methods=['GET', 'POST'])
def p_heap():
	if flask.request.method == 'POST':
		urls = flask.request.form['urls'].split('\r\n')
		for url in urls:
			threading.Thread(target=submiturl, args=(url,)).start()
	if flask.request.args.has_key('after'):
		after = int(flask.request.args['after'])
		result = [obj for obj in heap if obj['serial'] > after]
	else:
		result = heap
	return flask.Response(json.dumps(result), mimetype='application/json')

@app.route('/queue', methods=['GET', 'POST'])
def p_queue():
	global last_queue_serial
	if flask.request.method == 'POST':
		serials = json.loads(flask.request.form['serials'])
		for serial in serials:
			for i, obj in enumerate(heap):
				if obj['serial'] == serial:
					obj = heap.pop(i)
					last_queue_serial += 1
					obj['serial'] = last_queue_serial
					queue.append(obj)
	if flask.request.args.has_key('after'):
		after = int(flask.request.args['after'])
		result = [obj for obj in queue if obj['serial'] > after]
	else:
		result = queue
	return flask.Response(json.dumps(result), mimetype='application/json')

if __name__ == '__main__':
	if len(sys.argv) > 1:
		PORT = sys.argv[1]
	server = HTTPServer(WSGIContainer(app))
	print 'Now listening on port ' + str(PORT)
	server.listen(PORT)
	IOLoop.instance().start()
