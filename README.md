# Project365

Source code for [project365.akrabat.com](https://project365.akrabat.com).

This static site displays my photo-a-day picture for each day of the year. It is hosted on S3 behind CloudFront. A Lambda/PHP function fetches the photos from Flickr and generates a static HTML file that it uploads to S3 & then invalidates the CloudFront cache. This probject uses [bref.sh](https://bref.sh).

## Set up

1. Install [Serverless Framework](https://www.serverless.com).
2. Clone this repository.
3. Copy `env.json.dist` to `env.json` and update with your data
4. Run `composer install --no-dev --optimize-autoloader` to install dependencies.


## Create application

    sls deploy

## Run actions:

1. Upload static assets to bucket:

        sls invoke -f upload-assets

2. Create this year's html page from Flickr data and upload to bucket:

        sls invoke -f update
