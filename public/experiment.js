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
        text: `<h1>TYP_v2</h1>
        <p>Welcome to the experiment. Thank you for participating! Press SPACE to begin.</p>`
    };

    timeline.push(welcome_block);

    let continue_space = "<div class='right small'>(press SPACE to continue, or BACKSPACE to head back)</div>";

    let instructions = {
        type: "instructions",
        key_forward: ' ',
        key_backward: 8,
        pages: [
            `<p>In this experiment, you will hear various words or sounds - such as the word 'cat' or
            the sound of a cat meowing - and see pictures of those animals or objects. Sometimes the sound you hear will match the picture. For example, you'll hear a car honking 
            and then see a picture of a car. Other times, the picture you see will not match the sound.
            </p> ${continue_space}`,

            `<p>Your task is to decide as quickly as possible if the word or sound you hear matches the
            picture you see. For example, if you hear the word 'bird' and see a picture of a bird, you
            will press the button for 'Yes', but if you see a picture of a dog, you will press the button
            for 'No</p> ${continue_space}`,

            `<p>Please concentrate and see how quickly you can answer the questions. If you make a mistake,
            you will hear a buzzing sound. If you are making many mistakes, you might be rushing. Let the
            experimenter know when you have completed reading these instructions.
            </p> ${continue_space}`
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
            stimulus: `<img src="stims/${trial.pic1}.jpg" alt="${trial.pic1}" height="200px" align="left" style="max-width:400px"/> 
            <img src="stims/${trial.pic2}.jpg" alt="${trial.pic2}" height="200px" align="right" style="max-width:400px" />
            `,
            is_html: true,
            prompt: `<div style="position:absolute;bottom:0;width:100%;">
            <h1 style="text-align:center;">How similar in appearance are these two drawings?</h1>
            </div>`,
            choices: ['1', '2', '3', '4', '5', '6', '7'],
            on_finish: function (data) {
                
                // Check for match
                response.response = String.fromCharCode(data.key_press);   // Keeps only digits
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