echo "Move images --- "

if [ -d "bundle/images" ]; then
  rm -r bundle/images
fi

cp -r resources/public/images bundle

echo "Move css files --- "

if [ -d "bundle/css" ]; then
  rm -r bundle/css
fi

cp -r resources/public/css bundle

echo "Bundle js --- "

lein fig:min

echo "Move js files --- "

if [ -d "bundle/js" ]; then
  rm -r bundle/js
fi

cp -r resources/public/js bundle

cp resources/public/cljs-out/min-main.js bundle/js/github_colorful_contributions.js

cp resources/public/manifest.json bundle/

rm -r bundle/js/closure.dev.js
rm -r bundle/js/goog.dev.js

if [ -f "g-c-c.zip" ]; then
  rm g-c-c.zip 
fi

zip -r g-c-c bundle
