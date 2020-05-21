#!/bin/sh

if [ "$NODE_ENV" = "development" ]; \
  then sh scripts/dev.sh;  \
	else sh scripts/prod.sh; \
	fi