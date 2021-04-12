# This script will copy and strip all non-valid architectures from dynamic libraries.
#
# The following environment variables are required:
#
# FA_SDK_PATH
# TARGET_BUILD_DIR
# FRAMEWORKS_FOLDER_PATH

FRAMEWORK_APP_PATH="${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}"
# 1. Validate Framework folder.
if [ -d $FRAMEWORK_APP_PATH ]; then
    echo "Frameworks path valid"
else
    echo "Creating Frameworks folder on $FRAMEWORK_APP_PATH"
    mkdir $FRAMEWORK_APP_PATH
fi

# 2. Copying FRAMEWORK to FRAMEWORK_APP_PATH
find "$FA_SDK_PATH" -name '*.framework' -type d | while read -r FRAMEWORK
do
if [[ $FRAMEWORK == *"FollowAnalytics.framework" || $FRAMEWORK == *"FANotificationExtension.framework" ]]
then
    echo "Copying $FRAMEWORK into $FRAMEWORK_APP_PATH"
    cp -r $FRAMEWORK $FRAMEWORK_APP_PATH
fi
done

# 3. Loops through the frameworks embedded in the application and removes unused architectures.
find $FRAMEWORK_APP_PATH -name '*.framework' -type d | while read -r COPIED_FRAMEWORK
do
if [[ $COPIED_FRAMEWORK == *"FollowAnalytics.framework" || $COPIED_FRAMEWORK == *"FANotificationExtension.framework" ]]
then
    echo "Strip framework: $COPIED_FRAMEWORK"
    FRAMEWORK_EXECUTABLE_NAME=$(/usr/libexec/PlistBuddy -c "Print CFBundleExecutable" "$COPIED_FRAMEWORK/Info.plist")
    FRAMEWORK_EXECUTABLE_PATH="$COPIED_FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME"
    echo "Executable is $FRAMEWORK_EXECUTABLE_PATH"
    EXTRACTED_ARCHS=()
    for ARCH in $ARCHS
    do
    echo "Extracting $ARCH from $FRAMEWORK_EXECUTABLE_NAME"
    lipo -extract "$ARCH" "$FRAMEWORK_EXECUTABLE_PATH" -o "$FRAMEWORK_EXECUTABLE_PATH-$ARCH"
    EXTRACTED_ARCHS+=("$FRAMEWORK_EXECUTABLE_PATH-$ARCH")
    done
    echo "Merging extracted architectures: ${ARCHS}"
    lipo -o "$FRAMEWORK_EXECUTABLE_PATH-merged" -create "${EXTRACTED_ARCHS[@]}"
    rm "${EXTRACTED_ARCHS[@]}"
    echo "Replacing original executable with thinned version"
    rm "$FRAMEWORK_EXECUTABLE_PATH"
    mv "$FRAMEWORK_EXECUTABLE_PATH-merged" "$FRAMEWORK_EXECUTABLE_PATH"
    codesign --force --sign ${EXPANDED_CODE_SIGN_IDENTITY} ${OTHER_CODE_SIGN_FLAGS:-} --preserve-metadata=identifier,entitlements $FRAMEWORK_EXECUTABLE_PATH
else
    echo "Ignored strip on: $COPIED_FRAMEWORK"
fi
done
