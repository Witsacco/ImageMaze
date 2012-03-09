import Image
import requests
import cStringIO
import os

IMAGES_FOLDER = "retrieved_images"

urls = [
	"http://cdn-www.dailypuppy.com/images/widget_box_example.jpg",
	"http://www.makems.com/graphic/puppies-2.jpg"
]

size = 256, 256

# TODO: make all of the requests for images happen at the same time
for i, url in enumerate(urls):
	r = requests.get(url)
	im = Image.open(cStringIO.StringIO(r.content))
	img = im.resize(size)
	img.save(os.path.join(IMAGES_FOLDER, "image%d.jpg" % i))