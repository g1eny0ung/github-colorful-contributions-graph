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

lein do clean, cljsbuild once min

echo "Move js files --- "

if [ ! -d "bundle/js" ]; then
  mkdir bundle/js
fi

cp -r resources/public/js bundle
mv bundle/js/compiled/github_colors_contributions.js bundle/js
rm -r bundle/js/compiled
rm bundle/js/init.js

zip -r g-c-c.zip bundle
