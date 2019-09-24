#!/usr/bin/env python

import sys
import json

for line in sys.stdin:
    tweet_data = json.loads(line)
    print tweet_data.get('user').get('screen_name') + "-" + str(tweet_data.get('retweet_count')) + "-" + str(tweet_data.get('user').get('statuses_count')) + "-" + str(tweet_data.get('user').get('verified')) + "-" + str(tweet_data.get('user').get('followers_count'))