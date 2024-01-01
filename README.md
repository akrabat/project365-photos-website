# Project365

Source code for [project365.akrabat.com](https://project365.akrabat.com).

This static site displays my photo-a-day picture for each day of the year. It is hosted on S3 behind CloudFront. A Lambda/PHP function fetches the photos from Flickr and generates a static HTML file that it uploads to S3 & then invalidates the CloudFront cache. This probject uses [bref.sh](https://bref.sh).

## Set up

1. Install [Serverless Framework](https://www.serverless.com) with `npm install -g serverless`.
2. Clone this repository.
3. Copy `config.dev.json.dist` to `config.dev.json` where `dev` is the Serverless `stage` and update with your data. Also create `config.prod.json` for the `prod` stage.
4. Run `composer install --no-dev --optimize-autoloader` to install dependencies.

## Stage

For `prod`, use the `--stage=prod` command line argument to `sls`.

## AWS profile

To use a different AWS profile add `--aws-profile project365` (or whatever the profile name is).

## Create application

To initially deploy, or if you change any files:

    sls deploy --aws-profile project365 --stage=prod

## Run actions:

1. Upload static assets to bucket:

        sls invoke --aws-profile project365 --stage=prod -f upload-assets --log 

2. Create this year's html page from Flickr data and upload to bucket:

        sls invoke --aws-profile project365 --stage=prod -f update --log

3. Create another year's html page from Flickr data and upload to bucket:

        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2021"}' --log

## Making changes (e.g. for new year)

1. Update `assets/year.html`, `assets/index.html` and possibly `templates/*.phtml`
2. Deploy: `sls deploy --aws-profile project365 --stage=prod`
3. Upload the new files to the bucket: `sls invoke --aws-profile project365 --stage=prod -f upload-assets`
4. Update each year file: 

        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2013"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2014"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2015"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2016"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2017"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2018"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2019"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2020"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2021"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2022"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2023"}' --log
        sls invoke --aws-profile project365 --stage=prod -f update --data '{ "year": "2024"}' --log
