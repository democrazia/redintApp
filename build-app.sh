#!/bin/bash

configApk='config.xml'
currentVersion=$(grep version=\" $configApk | sed -e 's/.*version="\([^"]*\)".*/\1/g')

echo ''
echo 'Hello '$USER'.'
echo 'You will generate apk with this script.'
echo 'Choose target app version (current: '$currentVersion') :'
read version
prodFile='Redint-v'$version'.apk'
debugFile='devRedint-v'$version'.apk'
echo ''
echo 'Enter passphrase to sign prod apk (redint-android-key.keystore) :'
read -s password
echo ''
echo 'Will generate app with version <'$version'> ('$prodFile' and '$debugFile')'
echo ''


# change version in config.xml and _config.js
sed -i 's/\(version="\)[^"]*\("\)/\1'$version'\2/' $configApk


# build production apk
sed -i 's/\(id="com.redint.android\).dev\("\)/\1\2/' $configApk
sed -i 's/\(<name>\)dev-\(Redint<\/name>\)/\1\2/' $configApk
cordova platform remove android
cordova platform add android
cp -r app_icons/android/* platforms/android/res/
cordova build --release android
cp platforms/android/ant-build/CordovaApp-release-unsigned.apk .
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore redint-android-key.keystore -storepass $password CordovaApp-release-unsigned.apk alias_name
zipalign -v 4 CordovaApp-release-unsigned.apk $prodFile
rm CordovaApp-release-unsigned.apk


# build debug apk
sed -i 's/\(id="com.redint.android\)\("\)/\1.dev\2/' $configApk
sed -i 's/\(<name>\)\(Redint<\/name>\)/\1dev-\2/' $configApk
cordova platform remove android
cordova platform add android
cp -r app_icons/android/* platforms/android/res/
ionic build
cp platforms/android/ant-build/CordovaApp-debug.apk .
mv CordovaApp-debug.apk $debugFile


# Finish...
echo ''
echo 'Your apps are ready in project root folder : '$prodFile' and '$debugFile
echo ''
