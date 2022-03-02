if [ -z "$FLU_WEB_URL" ]; then
    echo "FLU_WEB_URL unset!"
    exit 1
fi  

PROTOCOL="https"

case $FLU_WEB_URL in localhost*)
  PROTOCOL="http"
esac

echo "@import url('$PROTOCOL://$FLU_WEB_URL/index.css')" > src/stub.css
