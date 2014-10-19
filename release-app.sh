#!/bin/bash

configApk='config.xml'
prodFile='Redint.apk'

echo ''
echo 'Enter passphrase to sign prod apk (redint-android-key.keystore) :'
read -s password
echo ''


# build production apk
cordova platform remove android
cordova platform add android
cp -r app_icons/android/* platforms/android/res/
cordova build --release android
cp platforms/android/ant-build/CordovaApp-release-unsigned.apk .
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore redint-android-key.keystore -storepass $password CordovaApp-release-unsigned.apk alias_name
zipalign -v 4 CordovaApp-release-unsigned.apk $prodFile
rm CordovaApp-release-unsigned.apk


# Finish...
echo ''
echo 'Your apps are ready in project root folder : '$prodFile
echo ''
