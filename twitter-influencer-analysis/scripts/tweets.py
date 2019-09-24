import tweepy
import json
import sys

#API Config
ACCESS_TOKEN = '3231258780-nVYsy8jU7mQkd8pO0NvZQEAwtFxaM7KpFbknSU8'
ACCESS_SECRET = '8bzvje4KEfoMKXT6wDU945SlJnnFWkLXlZgG4VZw9MjV6'
CONSUMER_KEY = 'pohFCmgW7iEsOZs8kJO6QLz4p'
CONSUMER_SECRET = 'H17wzacLJTqZbyV8eX4HhptCmVVCHq4ZTKwOPWS2x4r5i1Qojx'
topic = sys.argv[1] 
location = sys.argv[2]
filename = sys.argv[3]
#Tweepy initialisation
auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)

api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True, compression=True)
f = open(filename , "a")
for t in  tweepy.Cursor(api.search, q=topic, geocode=location).items(200):
    f.write(json.dumps(t._json))
    f.write('\n')
f.close()
print "Tweets File Created with filename",filename