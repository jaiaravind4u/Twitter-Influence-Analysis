#!/usr/bin/env python

import sys
result = {}
users = []

def extract_count(json):
    try:
        return float(json['average_retweet_count'])
    except KeyError:
        return 0

for line in sys.stdin:
    found = False
    foundIdx = 0
    (screen_name , retweet_count , statuses_count , verified , followers_count) =  line.strip().split('-')  
    retweet_count , statuses_count , followers_count  = int(retweet_count) , int(statuses_count), int(followers_count)
    for user in users:
        if screen_name == user.get('screen_name'):
            found = True
            break
        else:
            foundIdx+=1
    if found:
        users[foundIdx]["retweet_count"] = users[foundIdx]["retweet_count"] + retweet_count
        users[foundIdx]["total_tweets"]+=1
    else:
        obj = {
            "screen_name" : screen_name ,
            "retweet_count" : retweet_count,
            "statuses_count" : statuses_count,
            "verified": verified ,
            "followers_count": followers_count,
            "total_tweets" : 1
        }    
        users.append(obj)
for user in users:
    user["average_retweet_count"]  = float(user["retweet_count"] / user["total_tweets"])

users.sort(key=extract_count, reverse=True)

result = {
    "users" : users
}
print result