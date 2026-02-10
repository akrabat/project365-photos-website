.PHONY: *

list:
	@grep -E '^[a-zA-Z%_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

init:  ## Install serverless
	npm i serverless -g

refresh:  ## rebuild this months page
	sls invoke --aws-profile project365 --stage=prod -f update --log
