import os

from flask import Flask
from flask import render_template
from flask import request

from BeautifulSoup import BeautifulSoup
import Image
import requests
import cStringIO
import json
import re
import urllib
import random
import time


app = Flask(__name__)

GOOGLE_IMAGES_URL = 'https://www.google.com/search?tbm=isch&q=%s'
IMAGES_FOLDER = "static/retrieved_images"
WORD_LIST_FILE = "wordlist.txt"

@app.route('/')
def hello():
  return render_template('index.html')

@app.route('/getImageUrls')
def chooseWordAndGetImages():
  
  numberOfImagesRequested = int( request.args.get( "numberOfImagesRequested" ) )
  size = 256, 256

  # grab a random word from the list
  word_list_file_handle = open( WORD_LIST_FILE )
  word_list = word_list_file_handle.readlines()

  words = len( word_list ) - 1
  index = random.randint( 0, words )
  word = word_list[ index ].strip()

  app.logger.debug("Random word is '%s'" % word)

  # construct url for google images
  images_url = GOOGLE_IMAGES_URL % word

  # get the content of the page
  app.logger.debug("Requesting %s..." % images_url)
  r = requests.get(images_url)

  # scrape page for links to images
  soup = BeautifulSoup(r.content)
  results = soup.findAll('a', href=re.compile('imgurl'))

  input_urls = []
  p = re.compile('imgurl=(.*?)&')

  for result in results:
    url = urllib.unquote(p.findall(str(result))[0])
    input_urls.append(url)

  output_urls = []
  q = re.compile( 'image/([a-zA-Z]+)' )

  # TODO: make all of the requests for images happen at the same time
  for i, url in enumerate( input_urls ):
    r = requests.get(url)
    
    content_type = r.headers[ "Content-Type" ]
    extension = q.findall( content_type )[ 0 ]

    app.logger.debug("Retrieved image %d (%s) from [%s]..." % (i, extension, url))
    
    try:
      im = Image.open(cStringIO.StringIO(r.content))
      img = im.resize(size)
    except IOError:
      app.logger.warning('Something failed. Continuing...')
      continue
  
    filename = IMAGES_FOLDER + "/image%d.%s" % (i, extension)
    img.save( filename )
    
    # appending a timestamp to bust the browser's cache
    output_urls.append( "%s?%d" % (filename, int(time.time()+300)) )
  
    if len(output_urls) >= numberOfImagesRequested:
      break
  
  retval = { "urls": output_urls, "word": word }
  
  return json.dumps( retval )


if __name__ == '__main__':
  # Bind to PORT if defined, otherwise default to 5000.
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=True)
