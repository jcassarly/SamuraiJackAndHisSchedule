RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
printf "${RED}WARNING${NC}: running this script will remove all share files in the ${RED}WEB${NC} and ${RED}NATIVE${NC} directory!\n"
echo "deleted directories will be:"
printf "$GREEN$(readlink -f ../web/src/share)${NC}\n"
printf "$GREEN$(readlink -f ../native/src/share)${NC}\n\n"
read -p "Are you sure you want to do this (y/N)? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    rm -r ../web/src/share 2> /dev/null
    rm -r ../native/src/share 2> /dev/null
    cp -r . ../web/src/share
    rm ../web/src/share/sync_share.sh
    cp -r . ../native/src/share
    rm ../native/src/share/sync_share.sh
fi
