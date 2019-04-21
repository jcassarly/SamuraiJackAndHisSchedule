RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
printf "${RED}WARNING${NC}: running this script will remove all share files in the ${RED}SHARE${NC} directory!\n"
echo "deleted directory will be:"
printf "$GREEN$(readlink -f ../share)${NC}\n\n"
read -p "Are you sure you want to do this (y/N)? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cp ../share/sync_share.sh src/share
    rm -r ../share 2> /dev/null
    cp -r src/share ../share
    rm src/share/sync_share.sh
fi