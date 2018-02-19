for i in `jq -r '.[].Link' $1`; do
    REQ=`curl -s -w "%{http_code}\\n" $i -o /dev/null`
    if [ "`echo $REQ | grep 200`" ]; then
        echo "OK"
    else
        echo "NOT OK: $i - $REQ"
    fi
done;
