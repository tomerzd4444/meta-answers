// jquery document ready
$(document).ready(function() {
    setTimeout(function() {
        console.log(window.location.href);
        let should_request = true;
        let unit_num = document.getElementById('hid_unit_id').value;
        let stud_id = document.getElementById('hid_student_id').value;
        let class_id = document.getElementById('hid_student_class_id').value;
        // qItem shade_down 
        let questions = document.querySelectorAll('.qItem');
        let questionsArr = []
        for (let i = 0; i < questions.length - 1; i++) {
            if (questions[i].id.slice(-1) == '1') {continue;}
            questionsArr.push(questions[i]);
        }
        // add event listener for buttons with class callForAction
        let callForAction = document.querySelectorAll('.callForAction');
        let buttons = [];
        for (let i = 0; i < questionsArr.length; i++) {
            buttons.push(callForAction[i]);
        }
        console.log(questionsArr);
        for (let i = 0; i < questionsArr.length; i++) {
            // {\"66002\":true,\"66003\":false,\"66004\":false,\"66005\":false}
            let q_id = document.getElementById(`hid_q_id_${i + 1}-0`).value;
            let question = questionsArr[i];
            // search for class opt_content inside question
            let opt_content = question.getElementsByClassName('opt_content');
            let answer_ids = [];
            let multi = {};
            for (let j = 0; j < opt_content.length; j++) {
                // get aria-label
                let aria_label = opt_content[j].getAttribute('aria-label');
                console.log(aria_label);
                if (aria_label == 'תשובה נכונה') {
                    should_request = false;
                    console.log('correct answer');
                }
                let opt = opt_content[j];
                let opt_id = opt.getAttribute('id');
                answer_ids.push(opt_id.split('-')[1]);
                multi[opt_id.split('-')[1]] = false;
            }
            multi[answer_ids[0]] = true;
            let body = `------WebKitFormBoundaryGmhwBVCF5l1EAD2H\r\nContent-Disposition: form-data; name=\"q_data\"\r\n\r\n{\"details\":{\"hint_displayed\":\"0\",\"reminder_shown\":\"0\",\"q_id\":\"${q_id}\",\"u_id\":\"${unit_num}\",\"q_num\":${i},\"q_type\":\"multi\",\"duration\":12,\"unit_type\":\"shortie\"},\"student_id\":\"34501\",\"class_id\":\"4231\",\"student_lang\":\"he\",\"multi\":${JSON.stringify(multi)},\"multi_type\":\"radio\",\"isAlt\":0}\r\n------WebKitFormBoundaryGmhwBVCF5l1EAD2H--\r\n`
            let a = fetch("https://www.mymeta.co.il/student/meta_question_check", {
                "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "en,en-GB;q=0.9,en-US;q=0.8,he;q=0.7",
                "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryGmhwBVCF5l1EAD2H",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://www.mymeta.co.il/student/meta_unit/1987",
                "referrerPolicy": "same-origin",
                "body": body,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
            a.then(res => res.json())
            .then(data => {
                let mul = data['multi'];
                let count = 1;
                let answers = {};
                Object.keys(mul).forEach(function(key) {
                    answers[count - 1] = false;
                    if (mul[key]['sys_checked'] == true) {
                        console.log(`ANSWER FOR QUESTION ${data['q_data'][0]['q_num']} IS ${count}`);
                        answers[count - 1] = true;
                        // multi_item-65559
                        let multi_item = document.getElementById(`multi_item-${key}`);
                        // change background color
                        multi_item.style.backgroundColor = '#00ff00';

                    }
                    count++;
                });
                if (!should_request) {
                    return;
                }
                multi = {};
                for (let j = 0; j < opt_content.length; j++) {
                    let opt = opt_content[j];
                    let opt_id = opt.getAttribute('id');
                    answer_ids.push(opt_id.split('-')[1]);
                    multi[opt_id.split('-')[1]] = answers[j];
                }
                body = `------WebKitFormBoundaryGmhwBVCF5l1EAD2H\r\nContent-Disposition: form-data; name=\"q_data\"\r\n\r\n{\"details\":{\"hint_displayed\":\"0\",\"reminder_shown\":\"0\",\"q_id\":\"${q_id}\",\"u_id\":\"${unit_num}\",\"q_num\":${i},\"q_type\":\"multi\",\"duration\":${Math.floor(Math.random() * (60 - 25 + 1)) + 25},\"unit_type\":\"shortie\"},\"student_id\":\"${stud_id}\",\"class_id\":\"${class_id}\",\"student_lang\":\"he\",\"multi\":${JSON.stringify(multi)},\"multi_type\":\"radio\",\"isAlt\":0}\r\n------WebKitFormBoundaryGmhwBVCF5l1EAD2H--\r\n`
                console.log(body);
                fetch("https://www.mymeta.co.il/student/meta_question_check", {
                    "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "en,en-GB;q=0.9,en-US;q=0.8,he;q=0.7",
                    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryGmhwBVCF5l1EAD2H",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                    },
                    "referrer": "https://www.mymeta.co.il/student/meta_unit/1987",
                    "referrerPolicy": "same-origin",
                    "body": body,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                });
            }).catch(err => {
                console.log(err);
                console.log("it's recommended to restart the page");
            }
            );
        }}, 1000);
})