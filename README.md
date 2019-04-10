# Project365


## Set up

1. Install AWS cli: 

        $ pip install aws-cli

2. Install SAM cli:

        $ pip install aws-sam-cli

3. Edit the `PROJECT_NAME` variable in `Makefile` to be a unique name. eg. `{your initials}-project365`
4. Set parameters into AWS's SSM:

        aws ssm put-parameter --name "P365LiveWebsiteBucketName" --type "String" --value "{project name}-website"
        aws ssm put-parameter --name "P365LiveWebsiteDomain" --type "String" --value "{project's domain name. e.g. project365.example.com}"

        aws ssm put-parameter --name "P365LiveFlickrApiKey" --type "String" --value "{Flickr API Key}"
        aws ssm put-parameter --name "P365LiveFlickrUserId" --type "String" --value "{Flickr User id (e.g. 86569608@N00)}"


## Create application

    make deploy

## Run actions:

1. Upload static assets to bucket:

        make invoke-remote-upload-assets
    
2. Create 2019.html from Flickr data and upload to bucket:

        make invoke-remote-update
