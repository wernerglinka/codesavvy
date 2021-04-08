# Code Savvy Website

## Installation
````
git clone https://github.com/wernerglinka/codesavvy.git
run npm install
gulp
````

After running `gulp` the site will be available on `http://localhost:3000`

All testing has been done on MacOS. If you use Window you are on your own.



``````````
to use the fork method notes:  https://opensource.com/article/19/7/create-pull-request-github

create fork (copy) on your github or go to that repository
clone copy
create branch
create new remote for upstream
delete npm-shrinkwrap.json file
create npm-shrinkwrap.json file using this code
      {
  "dependencies": {
    "graceful-fs": {
        "version": "4.2.2"
     }
  }
}


run npm install

make changes to the website


