from BeautifulSoup import BeautifulSoup
import Image
import requests
import cStringIO
import json
import re
import urllib

GOOGLE_IMAGES_URL = 'https://www.google.com/search?tbm=isch&q=%s'
IMAGES_FOLDER = "retrieved_images"

# given a word
word = 'rain'
num_requested = 5

# construct url for google images
images_url = GOOGLE_IMAGES_URL % word

# get the content of the page
print "Requesting %s..." % images_url
r = requests.get(images_url)

# scrape page for links to images
soup = BeautifulSoup(r.content)
results = soup.findAll('a', href=re.compile('imgurl'))

input_urls = []

p = re.compile('imgurl=(.*?)&')

print '\n'

for result in results:
	url = urllib.unquote(p.findall(str(result))[0])
	print url
	input_urls.append(url)

print '\n'

output_urls = []

size = 256, 256

q = re.compile('\.([^\.]*)$')

# TODO: make all of the requests for images happen at the same time
for i, url in enumerate( input_urls ):
	file_ext = q.findall(url)[0]
	print "Retrieving image %d (%s)..." % (i, file_ext)
	r = requests.get(url)
	try:
		im = Image.open(cStringIO.StringIO(r.content))
		img = im.resize(size)
	except IOError:
		print 'FAIL'
		continue

	filename = IMAGES_FOLDER + "/image%d.%s" % (i, file_ext)
	img.save( filename )
	output_urls.append( filename )

	if len(output_urls) >= num_requested:
		break
	
print json.dumps( output_urls )