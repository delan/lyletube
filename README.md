Lyletube
=======

A simple YouTube jukebox for ComSSA LANs.

Users submit recommendations as a dump of YouTube URLs, and they are approved by
Lyle (or whoever is running the projector computer), all while the playlist is
automatically being fed through to a player.

Running directly from source
----------------------------

To run Lyletube from source, install Python 2.7 and pip.

Then install dependencies with `pip install -r requirements.txt`.

Finally, run `lyletube.py` to start the server. You can optionally supply the
port to listen on as the first argument (e.g. `lyletube.py 8080`), but the
default is port 13337.

Skype users, please note that ports 80 and 443 are taken by default; you will
need to turn off "Use 80 and 443 for incoming connections" and restart Skype to
use those ports.

If you're using Debian, Ubuntu or relatives, setup might look like this:

	apt-get install git build-essential python python-dev python-pip
	git clone git://github.com/delan/lyletube.git
	cd lyletube
	pip install -r requirements.txt
	python lyletube.py

How to build a standalone executable
------------------------------------

Werkzeug does some crazy import magic that breaks PyInstaller's module
detection, so please edit werkzeug's `__init__.py` and remove everything after
the line where `__version__` is defined.

Download PyInstaller and in this directory, run
`path/to/pyinstaller.py -F lyletube.spec`.

The resulting executable will be found as `dist/lyletube.exe`.
