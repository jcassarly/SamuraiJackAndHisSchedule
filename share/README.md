# Shared code
This folder is for code that can be shared between web and native code.  Web specific implementations for the non-shared components can be found in `/web/components`.  Due to the limitations of npm, this code is kept in a separate folder and can be automatically synced to the `/web/src/share` and `/native/src/share` folders using the scripts below.  Be careful when syncing using these scripts because they DO NOT do a merge, but simply overwrite all files in the directory being merged into.  The `/web/src/share` and `/native/src/share` directories are not tracked by git and should rather be kept up to date by syncing with the `/share` directory.

**Note:** When running these scripts, make sure to run them in the same directory they are in.  For example, do NOT run `./share/sync_share.sh`.  Instead, natigate to the share directory and run `./sync_share.sh` directly.  The scripts assume you are in the correct directory when running them.

### /share/sync_share.sh
this script copies the contents of the `/share` directory into `/web/src/share` and `/native/src/share`.  This overwrites ALL files in those directories, so make sure you do not have any changes in those directories before running this script.

### /web/set_share.sh
this script copies the contents of the `/web/src/share` directory into `/share` and `/native/src/share`.  This overwrites ALL files (excluding the `/share/sync_share.sh` script) in those directories, so make sure you do not have any changes in those directories before running this script.

### /native/set_share.sh
this script copies the contents of the `/native/src/share` directory into `/share` and `/web/src/share`.  This overwrites ALL files (excluding the `/share/sync_share.sh` script) in those directories, so make sure you do not have any changes in those directories before running this script.

### Workflow
Here is an example workflow when making changed to shared code.
- You can work in the `/web/src/share` or `/native/src/share` directories normally, then, when getting ready to make a commit, run `set_share.sh` in the corresponding directory before commiting.
- When you need to pull in new changes, first do git pull, then run `sync_share.sh` to update your platform specific directories.
- Finally, suppose you are making changes to the `/web/src/share` directory.  Someone else makes changes to the same branch and you want to pull them from upstream.
    1. Before doing the pull, go to `/web` and execute `set_share.sh`.
    2. You may then do the pull as normal (or stash the changes first, then pull, then apply, or commit your changes, then pull, etc.).
    3. If there are no merge conflicts, simply run `sync_share.sh` and skip to 7.
    4. If there are conflicts, you can choose to fix them while in the share directory or in the web/native share directory.
    5. If you choose to fix the changes in the share directory:
        1. make the fixes to the merged code
        2. run `sync_share.sh` in the share directory to update your web and native folders.
    6. If you choose to fix the changes in your web/native directory:
        1. run `sync_share.sh` to update the web/native directory with the new merged code
        2. make the fixes to the merged code in the web/native directory
        3. run `set_share.sh` in the corresponding directory.
    7. At this point, you may commit and push your code.
