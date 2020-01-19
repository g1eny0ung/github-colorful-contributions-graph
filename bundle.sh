echo "Move images --- "

if [ -d "bundle/images" ]; then
  rm -r bundle/images
  cp -r resources/public/images bundle
else
  cp -r resources/public/images bundle
fi

echo "Move css files --- "

if [ -d "bundle/css" ]; then
  rm -r bundle/css
  cp -r resources/public/css bundle
else
  cp -r resources/public/css bundle
fi

echo "Bundle js --- "

lein fig:min

echo "Move js files --- "

if [ -d "bundle/js" ]; then
  rm -r bundle/js
  cp -r resources/public/js bundle
else
  cp -r resources/public/js bundle
fi

cp resources/public/cljs-out/min-main.js bundle/js/github_colorful_contributions.js

cp resources/public/manifest.json bundle/

zip -r g-c-c.zip bundle
