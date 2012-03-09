import Image
import requests
import cStringIO
import json

IMAGES_FOLDER = "retrieved_images"

input_urls = [
	"http://cdn-www.dailypuppy.com/images/widget_box_example.jpg",
	"http://www.makems.com/graphic/puppies-2.jpg"
]

output_urls = []

size = 256, 256

# TODO: make all of the requests for images happen at the same time
for i, url in enumerate( input_urls ):
	r = requests.get(url)
	im = Image.open(cStringIO.StringIO(r.content))
	img = im.resize(size)
	
	filename = IMAGES_FOLDER + "/image%d.jpg" % i
	img.save( filename )
	output_urls.append( filename )
	
print json.dumps( output_urls )