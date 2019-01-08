# Project365

Source code for [project365.akrabat.com][1].

This static site displays my photo-a-day picture for each day of the year. It is hosted
on S3 behind CloudFront. A Lambda/PHP function fetches the photos from Flickr and generates
a static HTML file that it uploads to S3 & then invalidates the CloudFront cache.


## Set up

* Create `php` binary using info from [Serverless PHP on AWS Lambda][2] & store in `layer/php`
* Copy `settings.yml.dist` to `settings.yml` and fill in your own details
    * A [Flickr API Key][3] is required
    * AWS Certificate set up in us-east-1
* Set up [Serverless framework][4] with AWS provider credentials
* Edit `serverless.yml` if required

## Usage

* Upload: `sls deploy`
* Populate bucket with static files: `sls invoke -f update -l --data='{"upload_assets":"true"}'`
* Populate bucket with year file: `sls invoke -f update -l --data='{"year":"2018"}'`
* Populate bucket with this year's file: `sls invoke -f update -l`


[1]: https://project365.akrabat.com
[2]: https://akrabat.com/serverless-php-on-aws-lambda/
[3]: https://www.flickr.com/services/api/misc.api_keys.html
[4]: https://serverless.com/framework/docs/providers/aws/guide/quick-start/
