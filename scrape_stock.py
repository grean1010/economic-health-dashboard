# Dependenceis
from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import requests
import time

# MAC user: 
#https://splinter.readthedocs.io/en/latest/drivers/chrome.html
#!which chromedriver
#executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
#browser = Browser('chrome', **executable_path, headless=False)

# Initialize browser
def init_browser():
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    return Browser('chrome', **executable_path, headless=True)

# Create a dictionary to store all scraped data
stock_info = {}

# Scraping function that exectutes the scraping of targeted webpages
def scrape_stock():
    browser = init_browser()
    # Identifying the website to be scrapped and establishing a connection
    url_stocks = 'https://www.google.com/search?q=finance&rlz=1C5CHFA_enUS840US848&oq=S%26P+live+ticker&aqs=chrome.0.0.6151j1j8&sourceid=chrome&ie=UTF-8&stick=H4sIAAAAAAAAAOPQeMSozC3w8sc9YSmpSWtOXmMU4RJyy8xLzEtO9UnMS8nMSw9ITE_lAQCCiJIYKAAAAA&tbm=fin&sa=X&ved=2ahUKEwjV7I6v65bkAhVnUd8KHSwCBZgQ6M8CMAB6BAgPEAI'
    browser.visit(url_stocks)
    time.sleep(1)

    # Creating a beautifulsoup object and parsing this object
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')

    # Extracting the exchange names, trading volumes, changes
    # tickers = soup.find_all('div', id = "kp-wp-tab-MARKET_SUMMARY")
    long_names = soup.find_all('span', class_ = "z4Fov")
    shares_traded = soup.find_all('span', class_ = "Z90tFb")
    changes = soup.find_all('span', class_ = "hO8Bcf")

    # Store data in stock_info dict{}
    stock_info['dow'] = f'{long_names[0].text}  trading volume: {shares_traded[0].text},  change: {changes[0].text}'
    stock_info['snp'] = f'{long_names[1].text}  trading volume: {shares_traded[1].text},  change: {changes[1].text}'
    stock_info['nasdaq'] = f'{long_names[5].text}  trading volume: {shares_traded[5].text},  change: {changes[5].text}'
    stock_info['russell'] = f'{long_names[6].text}  trading volume: {shares_traded[6].text},  change: {changes[6].text}'

    print("                                                                    ")
    print(stock_info['dow'])
    print("                                                                    ")
    print(stock_info['snp'])
    print("                                                                    ")
    print(stock_info['nasdaq'])
    print("                                                                    ")
    print(stock_info['russell'])
    print("                                                                    ")

    # Return results
    return stock_info

#scrape_stock()


