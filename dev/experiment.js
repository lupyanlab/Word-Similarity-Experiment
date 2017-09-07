// Function Call to Run the experiment
function runExperiment(trials, subjCode, workerId, assignmentId, hitId) {
    timeline = [];

    // Data that is collected for jsPsych
    let turkInfo = jsPsych.turk.turkInfo();
    let participantID = makeid() + 'iTi' + makeid()

    jsPsych.data.addProperties({
        subject: participantID,
        condition: 'explicit',
        group: 'shuffled',
        workerId: workerId,
        assginementId: assignmentId,
        hitId: hitId
    });

    let welcome_block = {
        type: "text",
        cont_key: ' ',
        text: `<h1>Image Simularity</h1>
        <p>Welcome to the experiment. Thank you for participating! Press SPACE to begin.</p>`
    };

    timeline.push(welcome_block);

    let continue_space = "<div class='right small'>(press SPACE to continue, or BACKSPACE to head back)</div>";

    let instructions = {
        type: "instructions",
        key_forward: ' ',
        key_backward: 8,
        pages: [
            `<p>In this experiment, you will see two drawings and rate their simularity from 1 to 7.
            </p> ${continue_space}`,

            `<p>Use the 1-7 number keys to select your choice.
            </p> ${continue_space}`,
        ]
    };

    timeline.push(instructions);

    let trial_number = 1;
    let images = [];
    let num_trials = trials.length;

    // Pushes each audio trial to timeline
    _.forEach(trials, (trial) => {

        images.push('stims/'+trial.pic1+'.jpg');
        images.push('stims/'+trial.pic2+'.jpg');
        
        // Empty Response Data to be sent to be collected
        let response = {
            subjCode: subjCode,
            workerId: workerId,
            assignmentId: assignmentId,
            hitId: hitId,
            pic1: trial.pic1,
            pic2: trial.pic2,
            country1: trial.country1 || 'unspecified',
            country2: trial.country2 || 'unspecified',
            expTimer : -1,
            response: -1,
            trial_number: trial_number,
            rt: -1,
        }	

        // Picture Trial
        let pictureTrial = {
            type: 'single-stim',
            stimulus: `<canvas width="800px" height="25px" id="bar"></canvas>
            <script>
                var barCanvas = document.getElementById('bar');
                var barCtx = barCanvas.getContext('2d');
                barCtx.roundRect(0, 0, barCanvas.width, barCanvas.height, 20).stroke();
                barCtx.roundRect(0, 0, barCanvas.width*${trial_number}/${num_trials}, barCanvas.height, 20).fill();
            </script>
            <h5 style="text-align:center;">Trial ${trial_number} of ${num_trials}</h5>
            <img src="stims/${trial.pic1}.jpg" alt="${trial.pic1}" height="200px" align="left" style="max-width:400px"/> 
            <img src="stims/${trial.pic2}.jpg" alt="${trial.pic2}" height="200px" align="right" style="max-width:400px" />`,
            is_html: true,
            prompt: `<div style="position:absolute;bottom:0;width:100%;">
            <h1 style="text-align:center;line-height:1.5;">How similar in appearance are these two drawings?</h1>
                <div id="container">
                    <img id="scale" src="img/scale.jpg" width="100%" />
                    <canvas id="canvas"></canvas>
                </div>
            </div>
            <script>var canvas = document.getElementById('canvas');
                canvas.width = 800;
                canvas.height = 138.97;
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = "red";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 3;
                var xCoords = [208,270,333,400,459,519,584];
                var yCoord = canvas.height/5;
                strokeCircle(xCoords[0], yCoord);
                strokeCircle(xCoords[1], yCoord);
                strokeCircle(xCoords[2], yCoord);
                strokeCircle(xCoords[3], yCoord);
                strokeCircle(xCoords[4], yCoord);
                strokeCircle(xCoords[5], yCoord);
                strokeCircle(xCoords[6], yCoord);
            </script>`
                    ,
            choices: ['1', '2', '3', '4', '5', '6', '7'],
            on_finish: function (data) {
                response.response = String.fromCharCode(data.key_press);
                response.rt = data.rt;
                response.expTimer = data.time_elapsed / 1000;

                // POST response data to server
                $.ajax({
                    url: 'http://'+document.domain+':7070/data',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(response),
                    success: function () {
                        console.log(response);
                    }
                })
            }
        }
        timeline.push(pictureTrial);

        // let subject view their choice
        let breakTrial = {
            type: 'single-stim',
            stimulus: `<canvas width="800px" height="25px" id="bar"></canvas>
            <script>
                var barCanvas = document.getElementById('bar');
                var barCtx = barCanvas.getContext('2d');
                barCtx.roundRect(0, 0, barCanvas.width, barCanvas.height, 20).stroke();
                barCtx.roundRect(0, 0, barCanvas.width*${trial_number}/${num_trials}, barCanvas.height, 20).fill();
            </script>
            <h5 style="text-align:center;">Trial ${trial_number} of ${num_trials}</h5>
            <img src="stims/${trial.pic1}.jpg" alt="${trial.pic1}" height="200px" align="left" style="max-width:400px"/> 
            <img src="stims/${trial.pic2}.jpg" alt="${trial.pic2}" height="200px" align="right" style="max-width:400px" />`,
            is_html: true,
            prompt: function () { 
                return `<div style="position:absolute;bottom:0;width:100%;">
                    <h1 style="text-align:center;line-height:1.5;">How similar in appearance are these two drawings?</h1>
                        <img id="scale" src="img/scale.jpg" width="100%" />
                         <canvas id="canvas"></canvas>
                    </div>
                    <script>

                        var canvas = document.getElementById('canvas');
                        canvas.width = 800;
                        canvas.height = 138.97;
                        var ctx = canvas.getContext('2d');
                        ctx.fillStyle = "red";
                        ctx.strokeStyle = "black";
                        ctx.lineWidth = 3;
                        
                        var xCoords = [208,270,333,400,459,519,584];
                        var yCoord = canvas.height/5;
                        strokeCircle(xCoords[0], yCoord);
                        strokeCircle(xCoords[1], yCoord);
                        strokeCircle(xCoords[2], yCoord);
                        strokeCircle(xCoords[3], yCoord);
                        strokeCircle(xCoords[4], yCoord);
                        strokeCircle(xCoords[5], yCoord);
                        strokeCircle(xCoords[6], yCoord);

                        ctx.beginPath();
                        ctx.arc(xCoords[${response.response-1}],yCoord,15,0,2*Math.PI);
                        ctx.stroke();
                        ctx.fill();
                    </script>`
            },
            choices: [],
            timing_response: 1000,
            response_ends_trial: false
        }
        timeline.push(breakTrial);

        trial_number++;
    })


    let endmessage = `Thank you for participating! Your completion code is ${participantID}. Copy and paste this in 
        MTurk to get paid. If you have any questions or comments, please email jsulik@wisc.edu.`

    // an array of paths to images that need to be loaded
    images.push('img/scale.png');
    images.push('img/scale1.jpg'), 
    images.push('img/scale2.jpg'), 
    images.push('img/scale3.jpg'), 
    images.push('img/scale4.jpg'), 
    images.push('img/scale5.jpg'), 
    images.push('img/scale6.jpg'), 
    images.push('img/scale7.jpg');

    jsPsych.pluginAPI.preloadImages(images, function(){ startExperiment(); });

    function startExperiment() {
        jsPsych.init({
            default_iti: 0,
            timeline: timeline,
            // fullscreen: true,
            show_progress_bar: true,
            on_finish: function (data) {
                jsPsych.endExperiment(endmessage);
            }
        });
    }
}