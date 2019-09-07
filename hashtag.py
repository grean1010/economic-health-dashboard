#!/usr/bin/python
# -*- coding: utf-8 -*-

import tweepy
import csv
import json

# Twitter API credentials

with open('twitter_credentials.json') as cred_data:
    info = json.load(cred_data)
    consumer_key = info['CONSUMER_KEY']
    consumer_secret = info['CONSUMER_SECRET']
    access_key = info['ACCESS_KEY']
    access_secret = info['ACCESS_SECRET']

# Create the api endpoint

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
api = tweepy.API(auth)

# Mention the maximum number of tweets that you want to be extracted.
#maximum_number_of_tweets_to_be_extracted = \
#int(input('Enter the number of tweets that you want to extract- '))

# Mention the hashtag that you want to look out for
#hashtag = input('Enter the hashtag you want to scrape- ')

# @app.route(/tweets/{numberoftweets}/{hashtag})
def get_tweets(numberoftweets, hashtag):

    # Create a list for storage
    tweets = []

    try:
        with open('tweets_with_hashtag_' + hashtag + '.txt', 'a+') as the_file:
            for tweet in tweepy.Cursor(api.search, q='#' + hashtag, rpp=100).items(numberoftweets):
                the_file.write(str(tweet.text.encode('utf-8')) + '\n')
                tweets.append(tweet.text)
            print ('Extracted ' + str(numberoftweets) + ' tweets with hashtag #' + hashtag)
    except tweepy.error.TweepError as e:
        print(e)
        print(e.message)

    # Return results
    return tweets
    
    #print(tweets)

#result = get_tweets(maximum_number_of_tweets_to_be_extracted, hashtag)   

#print(result)

