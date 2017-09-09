## Running Locally

You must have nodjs installed: https://nodejs.org. Make sure Python 2 is installed.

```
git clone https://github.com/kmui2/Image-Similarity-Experiment
cd Image-Similarity-Experiment
sudo npm install -g nodemon
npm install
npm start
```

When making changes, the html and javascript is in the dev/ directory. To make sure the prod/ (production) directory is
updated while editing the dev/ directory, install gulp taskrunner globally and run the gulp watch command. 

```
sudo npm install -g gulp
gulp watch
```

Then, go to http://localhost:7070