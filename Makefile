# vim: noexpandtab tabstop=4 filetype=make
.PHONY: list update upload-assets local-update local-upload-assets deploy clean clean-all setup geterror

REGION := us-east-1
PROJECT_NAME := project365-YOUR-NAME-HERE

BUCKET_NAME := $(PROJECT_NAME)-brefapp
STACK_NAME := $(PROJECT_NAME)-brefapp

list:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

update:
	vendor/bin/bref --region=$(REGION) invoke update --event '{"year": "2020"}'


upload-assets:
	aws lambda invoke --function-name uploadassets --payload '{}' \
	--invocation-type RequestResponse --log-type Tail \
	outfile.txt | jq '.LogResult' -r | base64 --decode && cat outfile.txt | jq '.result' \
	&& rm outfile.txt

local-update:
	sam local invoke Update --no-event

local-upload-assets:
	sam local invoke UploadAssets --no-event

deploy:
	rm -f error.txt
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
