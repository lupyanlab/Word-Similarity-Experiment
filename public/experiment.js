// Function Call to Run the experiment
function runExperiment(trials, subjCode, workerId, assignmentId, hitId) {
    let timeline = [];

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

    // Pushes each audio trial to timeline
    _.forEach(trials, (trial) => {
        
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
            trial_number: trial_number++,
            rt: -1,
        }	

        // Picture Trial
        let pictureTrial = {
            type: 'single-stim',
            stimulus: `<img src="stims/${trial.pic1}.jpg" alt="${trial.pic1}" height="200px" align="left" style="max-width:400px;max-height:50%;"/> 
            <img src="stims/${trial.pic2}.jpg" alt="${trial.pic2}" height="200px" align="right" style="max-width:400px;max-height:50%;" />`,
            is_html: true,
            prompt: `<div style="position:absolute;bottom:0;width:100%;max-height:50%;">
            <h1 style="text-align:center;line-height:1.5;">How similar in appearance are these two drawings?</h1>
            <canvas id="canvas"></canvas>
            </div>
            <script>
            var canvas = document.getElementById('canvas');
            fitToContainer(canvas);

            function fitToContainer(canvas){
            // Make it visually fill the positioned parent
            canvas.style.width ='100%';
            canvas.style.height='30%';
            // ...then set the internal size to match
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            }
            var context = canvas.getContext('2d');

            var scaleImg = new Image();
            scaleImg.src = 'img/scale.png';
            scaleImg.onload = function () {
                context.drawImage(scaleImg, 0, 0,canvas.width,canvas.height);
            }
            </script>
            `,
            choices: ['1', '2', '3', '4', '5', '6', '7'],
            on_finish: function (data) {
                response.response = String.fromCharCode(data.key_press);
                response.rt = data.rt;
                response.expTimer = data.time_elapsed / 1000;

                // POST response data to server
                $.ajax({
                    url: '/data',
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
    })


    let endmessage = `Thank you for participating! Your completion code is ${participantID}. Copy and paste this in 
        MTurk to get paid. If you have any questions or comments, please email jsulik@wisc.edu.`


    jsPsych.init({
        default_iti: 0,
        timeline: timeline,
        // fullscreen: true,
        on_finish: function (data) {
            jsPsych.endExperiment(endmessage);
        }
    });
}