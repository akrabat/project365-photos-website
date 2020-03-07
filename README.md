# Project365

Source code for [project365.akrabat.com](https://project365.akrabat.com).

This static site displays my photo-a-day picture for each day of the year. It is hosted on S3 behind CloudFront. A Lambda/PHP function fetches the photos from Flickr and generates a static HTML file that it uploads to S3 & then invalidates the CloudFront cache. This probject uses [bref.sh](https://bref.sh).


## Set up

1. Install AWS cli: 

        $ pip install aws-cli

2. Install SAM cli:

        $ pip install aws-sam-cli

3. Edit the `PROJECT_NAME` variable in `Makefile` and replace `YOUR-NAME-HERE` with your name.

4. Set parameters into AWS's SSM:

        $ aws ssm put-parameter --name "P365LiveWebsiteBucketName" --type "String" --value "{project name}-website"
        $ aws ssm put-parameter --name "P365LiveWebsiteDomain" --type "String" --value "{project's domain name. e.g. project365.example.com}"

        $ aws ssm put-parameter --name "P365LiveFlickrApiKey" --type "String" --value "{Flickr API Key}"
        $ aws ssm put-parameter --name "P365LiveFlickrUserId" --type "String" --value "{Flickr User id (e.g. 86569608@N00)}"

5. Run Composer:

        $ composer install --no-dev  --optimize-autoloader

## Create application

    make deploy

## Run actions:

1. Upload static assets to bucket:

        make upload-assets
    
2. Create 2019.html from Flickr data and upload to bucket:

        make update
