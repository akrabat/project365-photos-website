# vim: noexpandtab tabstop=4 filetype=make
.PHONY: deploy package clean invoke

REGION := us-east-1
PROJECT_NAME := project365-akrabat

BUCKET_NAME := $(PROJECT_NAME)-brefapp
STACK_NAME := $(PROJECT_NAME)-brefapp

invoke-local-update:
	sam local invoke Update --no-event

invoke-remote-update:
	vendor/bin/bref --region=$(REGION) invoke update --event '{"year": "2019"}'

invoke-local-upload-assets:
	sam local invoke UploadAssets --no-event

invoke-remote-upload-assets:
	aws lambda invoke --function-name uploadassets --payload '{}' \
	--invocation-type RequestResponse --log-type Tail \
	outfile.txt | jq '.LogResult' -r | base64 --decode && cat outfile.txt | jq '.result' \
	&& rm outfile.txt

deploy:
	sam package \
		--region $(REGION) \
		--template-file template.yaml \
		--output-template-file .stack-template.yaml \
		--s3-bucket $(BUCKET_NAME)
	sam deploy \
		--region $(REGION) \
		--template-file .stack-template.yaml \
		--stack-name $(STACK_NAME) \
		 --capabilities CAPABILITY_IAM

clean:
	aws --region $(REGION) cloudformation delete-stack --stack-name $(STACK_NAME)

clean-all: clean
	aws --region $(REGION) s3 rb s3://$(BUCKET_NAME) --force

setup:
	aws --region $(REGION) s3 mb s3://$(BUCKET_NAME)

geterror:
	aws cloudformation describe-stack-events --stack-name $(STACK_NAME) > error.txt
