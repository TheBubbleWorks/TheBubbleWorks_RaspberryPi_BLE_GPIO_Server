#!/usr/bin/env python
import os
import BaseHTTPServer
import SimpleHTTPServer
import ssl


print
print "*** You will get an warning about the site being unsafe, for example:"
print
print "\tChrome: `Your connection is not private'"
print "\tSafari: `Can't verify the identiry of the website'"
print
print "This is expected and is ok, just click:"
print
print "\tChrome: `Proceed to localhost (unsafe)`"
print "\tSafari: `Continue`"
print
print "Open a browser at: https://localhost:9443/"
print
httpd = BaseHTTPServer.HTTPServer(('0.0.0.0', 9443), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket (httpd.socket, certfile='server.pem', server_side=True)

httpd.serve_forever()
