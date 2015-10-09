#!/bin/bash

#To run go terminal type 'sh sendsms.sh'
curl https://secure.hoiio.com/open/sms/send \
    -d "app_id=Ts9Wbe2xk2HNFi4f" \
    -d "access_token=SbRiWZRTw7TVfudb" \
    -d "dest=+6591184135" \
    -d "msg=What are you doing"
