var synth = window.speechSynthesis;
const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt");
const languageSelect = document.getElementById("Languages");
const reclanguageSelect = document.getElementById("Spoken");
const chatcontainer = document.getElementById("chat-container");

//const container = document.getElementById("containermain");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");
const polly = document.getElementById("PollyLanguages");

const messageInput = document.querySelector('#myTextarea');
const sendButton = document.querySelector('#send-button');
const blurButton = document.querySelector('#blur-button');
const audioButton = document.querySelector('#audiobutton');
const skipButton = document.querySelector('#skipbtn');
const micButton = document.querySelector('#mircbtn');
const chatHistory = document.querySelector('#chat-history');
//const voiceInputButton = document.getElementById('voice-input-button');
const playButtons = document.querySelectorAll('.play-button');
const cursor = document.querySelector('#cursor');
var CN_SPEECH_REC_SUPPORTED = false;
const key = Math.random().toString();
var isAllBlur = false;
const isstream = document.querySelector("#stream");
const apikeyInput = document.getElementById('apikey')
$(function () {
    document.getElementById('send-button').style.height = messageInput.offsetHeight + "px";
    console.log(key);
    isstream.checked = true;
    apikeyInput.value = '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';
    if ('webkitSpeechRecognition' in window) {
        console.log("Speech recognition API supported");
        CN_SPEECH_REC_SUPPORTED = true;
    } else {
        console.log("speech recognition API not supported.");
        CN_SPEECH_REC_SUPPORTED = false;
        warning = "\n\nWARNING: speech recognition (speech-to-text) is only available in Google Chrome desktop version at the moment. If you are using another browser, you will not be able to dictate text, but you can still listen to the bot's responses.";
    }
    recognitionLanguage();
    initPollySelect();

    populateVoiceList();
    sortOptions(languageSelect.options);
    sortOptions(child.options);

})



function isPalyAudio() {
    var audios = document.getElementsByClassName('play-audio');
    let isPlaying = false
    if (audios.length == 0) {
        return isPlaying
    }
    for (var i = 0; i < audios.length; i++) {
        var audio = audios[i];
        if (!audio.paused) {
            isPlaying = true;
            //audio.pause();
            //audio.currentTime = 0;
        }
    }
    return isPlaying
}

function stopPalyAudio() {
    var audios = document.getElementsByClassName('play-audio');

    for (var i = 0; i < audios.length; i++) {
        var audio = audios[i];
        if (!audio.paused) {
            //return isPlaying = true;
            audio.pause();
            audio.currentTime = 0;
        }
    }
}

function resizeInput() {
    var input = document.getElementById('myTextarea');
    var wrapper = document.getElementById('inputWrapper');
    //input.style.height = "auto"; /* 重置高度 */
    input.style.height = input.scrollHeight + "px"; /* 根据输入内容调整高度 */
    if (wrapper.scrollHeight > wrapper.clientHeight) {
        wrapper.style.height = wrapper.clientHeight + "px"; /* 固定高度 */
    } else if (input.scrollHeight < wrapper.clientHeight) {
        wrapper.style.height = input.scrollHeight + "px"; /* 自适应高度 */
    }
}

function resetHeight() {
    var input = document.getElementById('myTextarea');
    var wrapper = document.getElementById('inputWrapper');
    wrapper.style.height = 50 + "px"; /* 恢复默认高度 */
    if (input.scrollHeight > 50) {
        input.style.height = 45 + "px"; /* 宽的高度回落到默认高度 */
    }
}
messageInput.addEventListener('oninput', function (event) {
    resizewrapper();
})
function resizewrapper() {
    
    var input = document.getElementById('myTextarea');
    var wrapper = document.getElementById('inputWrapper');
    input.style.height = "auto"; /* 重置高度 */
    const scrollHeight = input.scrollHeight

    /* 重置高度 */
    //console.log("initialHeight:" + initialHeight + '----' + "cssheight:" + cssheight + '----' + "scrollHeight:" + scrollHeight + '----' + "clientHeight:" + clientHeight)


    input.style.height = input.scrollHeight + "px"; /* 根据输入内容调整高度 */

    if (scrollHeight > 50 && scrollHeight <= 100) {
        wrapper.style.height = scrollHeight + 2 + "px"
        input.style.overflow = 'hidden'
    }
    if (scrollHeight > 100) {
        input.style.overflow = 'auto';
        input.style.height = "100px"
        wrapper.style.height = 102 + "px"

    }
}

const bodyMain = document.querySelector("html");
//const bodyMain = document.querySelector('body');

//// 监听滚动事件
//bodyMain.addEventListener('scroll', function () {
//    // 判断当前是否滚动到底部
//    const isAtBottom = bodyMain.scrollHeight - bodyMain.scrollTop === bodyMain.clientHeight;
//    console.log(bodyMain.scrollHeight - bodyMain.scrollTop)
//    console.log(bodyMain.clientHeight)
//    console.log(window.outerHeight)
//    console.log(window.interHeight)
//    // 如果滚动到底部，则将滚动条滚动到最底部
//    if (isAtBottom) {
//        bodyMain.scrollTop = bodyMain.scrollHeight;
//    }
//});
// 监听父容器的滚动事件


function scrollToBottom(editor) {
    editor.scrollTop = editor.scrollHeight - editor.clientHeight;
    //const isAtBottom = editor.scrollHeight - editor.scrollTop === editor.clientHeight;

    //console.log(editor.scrollHeight - window.outerHeight)
}

function observeEditor(editor) {
    //console.log(editor)
    var observer = new MutationObserver(function (mutations) {
        scrollToBottom(editor);
    });
    observer.observe(editor, {
        childList: true,
        subtree: true
    });
}
observeEditor(bodyMain);

//const maxtoken = document.querySelector("#max_tokens");
//const top_p = document.querySelector("#Top-p");
const temperature = document.querySelector("#temperature");
const presence_penalty = document.querySelector("#presence_penalty");
const model = document.getElementById("Model");
const frequency_penalty = document.querySelector("#frequency_penalty");

const headisstream = document.querySelector("#headisstream")
const headmodel = document.querySelector("#headmodel")
//const headmaktoken = document.querySelector("#headmaktoken")
const headtemp = document.querySelector("#headtemp")
//const headtopp = document.querySelector("#headtopp")
const heapre = document.querySelector("#heapre")
const headfre = document.querySelector("#headfre")
const modalconfim = document.querySelector("#modalconfim")
modalconfim.addEventListener('click', () => {

    headisstream.innerHTML = "流模式: " + isstream.checked;
    headmodel.innerHTML = "模型: " + model.value;
    //headmaktoken.innerHTML = "最大Token: " + maxtoken.value;
    headtemp.innerHTML = "采样温度: " + temperature.value;

    //headtopp.innerHTML = "Top-p: " + top_p.value;
    heapre.innerHTML = " 存在惩罚: " + presence_penalty.value;
    headfre.innerHTML = "频率惩罚: " + frequency_penalty.value;
})

$('#configModal').on('shown.coreui.modal', function () {
    // 模态框已经展示出来，可以在这里执行您的操作
    console.log('模态框已打开');
    //const maxtokenvalue = document.querySelector(".max_tokens-value");
    // maxtoken.onchange = function () {
    //     maxtokenvalue.textContent = maxtoken.value;
    // };
    const temperaturevalue = document.querySelector(".temperature-value");

    temperature.onchange = function () {
        temperaturevalue.textContent = temperature.value;
    };

    //const top_pvalue = document.querySelector(".Top-p-value");

    //top_p.onchange = function () {
    //    top_pvalue.textContent = top_p.value;
    //};

    const presence_penaltyvalue = document.querySelector(".presence_penalty-value");

    presence_penalty.onchange = function () {
        presence_penaltyvalue.textContent = presence_penalty.value;
    };
    const frequency_penaltyvalue = document.querySelector(".frequency_penalty-value");

    frequency_penalty.onchange = function () {
        frequency_penaltyvalue.textContent = frequency_penalty.value;
    };
    const streamvalue = document.querySelector(".stream-value");
    //const stream = document.querySelector("#stream");

    isstream.onchange = function () {
        streamvalue.textContent = isstream.checked;
    };
})




sendButton.addEventListener('click', async () => {
    await sendMessage();
});
blurButton.addEventListener('click', initBlur);
let auEnabled = false;
audioButton.addEventListener('click', function (event) {

    if (!auEnabled) {
        audioButton.innerHTML = "🔊"
        audioButton.title = 'Speaker Off';
        // Remove current message
        CN_SPEAKING_DISABLED = false;
    } else {
        audioButton.title = 'Speaker On';
        audioButton.innerHTML = "🔇"

        CN_SPEAKING_DISABLED = true;
        // Stop current message (equivalent to 'skip')
        synth.pause(); // Pause, and then...
        synth.cancel(); // Cancel everything
        CN_CURRENT_MESSAGE = null;
    }
    auEnabled = !auEnabled
});
skipButton.addEventListener('click', function (event) {
    synth.pause(); // Pause, and then...
    synth.cancel(); // Cancel everything
    stopPalyAudio();
    CN_CURRENT_MESSAGE = null; // Remove current message
    // Restart listening maybe?
    CN_AfterSpeakOutLoudFinished();
});
let micEnabled = false;

micButton.addEventListener('click', function (event) {
    $('.alert').alert()
    if (!micEnabled) {

        micButton.innerHTML = "🎙️"
        micButton.title = 'Microphone Off';
        CN_FINISHED = false;
        CN_SPEECHREC_DISABLED = false;
        setTimeout(function () {
            // Start speech rec
            CN_StartSpeechRecognition();

        }, 100);

    } else {
        micButton.innerHTML = "🤫"
        micButton.title = 'Microphone On';
        // Disable speech rec

        CN_SPEECHREC_DISABLED = true;
        if (CN_SPEECHREC && CN_IS_LISTENING) CN_SPEECHREC.stop();
    }
    micEnabled = !micEnabled;
});
messageInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.stopPropagation();
        event.preventDefault();
        await sendMessage();
        resizewrapper()
        //console.log('Enter key was pressed');
    }
});

$('.play-audio').css('display', 'none');
function initBlur() {
    if (!isAllBlur) {
        $('.blur-div').css('filter', 'blur(10px)');
        $('.blur-div#User').css('filter', 'blur(0px)');
        //blurmessagecontent.style.filter = "blur(0)";
        blurButton.title = "Blur Off"
    } else {
        $('.blur-div').css('filter', 'blur(0)');
        blurButton.title = "Blur On"
        //blurmessagecontent.style.filter = "blur(10px)";

    }
    isAllBlur = !isAllBlur;
    console.log(isAllBlur);
}
const chatMessages = []
let outPutContent = "";


function parseEventSource(data) {
    //console.log(data)
    //console.log("%o",data);
    var result = '';
    //linux server
    // if (data.includes('\n\n')) {
    //     //result=data;

    //     result=data.replace(/\n\n/g, "\n")
    // }else{
    //     result=data.replace(/\n/g, "")
    // }
    if (data.includes('\n\n')) {
        // result=data;
        result = data.replace(/\n/g, "");
        result = result + "\n";
    } else {
        result = data.replace(/\n/g, "");
    }

    //windows server
    // if (data.includes('\n\n')) {
    //     result=data;
    // }else{
    //     result=data.replace(/\n\n/g, "")
    // }
    return result;


}

async function getChatCompletionStream(apiKey, endPoint, messages) {
    const endpoint = endPoint; // 替换为实际的 API endpoint

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            messages: messages,
            model: model.value,
            temperature: parseFloat(temperature.value),
            presence_penalty: parseFloat(presence_penalty.value),
            top_p: 1,
            frequency_penalty: parseFloat(frequency_penalty.value),
            stream: isstream.checked,

        }),
    });

    if (!response.ok) {
        console.log(await response.text());
        throw new Error(await response.text());

    }

    return response.body;
}

async function sendMessage() {
    const message = messageInput.value;
    outPutContent = "";
    if (message.trim() !== '') {

        var role = "user";
        await addChatMessage("User", message);

        const chatmessage = {
            role: "user",
            content: message,
        };

        messageInput.value = "";

        chatMessages.push(chatmessage)
        //let requestMessage = JSON.stringify(chatMessages);

        console.log(chatMessages);


        //isstream.checked=true;
        if (isstream.checked) {
            try {
                //const apiEndpoint = "https://api.openai.com/v1/chat/completions";
                // 获取 messages 的值
                //const config = chats[currentChatIndex].config; // 获取 chats[currentChatIndex].config 的值
                var apikey = apikeyInput.value;
                stream = await getChatCompletionStream(apikey, "ChatGpt/ProxyToC", chatMessages);

                if (!stream) {
                    return;
                }

                if (stream.locked) {
                    throw new Error('Oops, the stream is locked right now. Please try again');
                }

                const reader = stream.getReader();
                await addChatMessage("Assistant", "");
                const preTags = document.querySelectorAll('pre');
                const lastPreTag = preTags[preTags.length - 1];
                try {
                    let done = false;
                    while (!done) {
                        const { value, done: d } = await reader.read();
                        if (d) {
                            done = true;
                        } else {
                            const result = parseEventSource(new TextDecoder().decode(value));
                            //if (content) output += result;
                            //return output;

                            outPutContent += result;
                            lastPreTag.innerText += result;
                            cursor.style.display = 'inline-block';
                            lastPreTag.appendChild(cursor);
                            //const output = document.querySelector('#output');

                        }
                    }

                } catch (error) {
                    console.log(error);
                } finally {
                    reader.releaseLock();
                    stream.cancel();
                    lastPreTag.removeChild(cursor);
                    const selectedVoice = polly.value;
                    //console.log(selectedVoice)
                    let Aichatmessage = {
                        role: "assistant",
                        content: outPutContent,

                    };
                    chatMessages.push(Aichatmessage)
                    let lowestAudio = getLowstAudio();
                    if (selectedVoice !== '请选择') {
                        const data = { content: outPutContent, polly: selectedVoice }
                        const base64 = await postFunc("ChatGpt/GetPollyBaseStr", data);


                        lowestAudio.setAttribute('src', base64);
                        console.log(lowestAudio);
                    }
                    if (auEnabled) {
                        // If speech recognition is active, disable it
                        if (CN_IS_LISTENING) CN_SPEECHREC.stop();
                        if (selectedVoice !== '请选择') {

                            stopPalyAudio();

                            // Set the "src" attribute to the URL of the audio file
                            //playAudio.setAttribute('src', base64);

                            // Play the audio file
                            lowestAudio.play();

                        } else {


                            CN_SayOutLoud(outPutContent);
                            CN_FINISHED = false;
                        }


                    }
                    if (!auEnabled && micEnabled) {
                        clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
                        CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 200);
                    };

                    outPutContent = "";
                }
            } catch (error) {
                console.log(error);
            }

        } else {
            var apikey = apikeyInput.value;
            //const content=  await getChatCompletionStream("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", " ChatGpt/ProxyToC", chatMessages);
            chatnormal(apikey);
        }
        //messageInput.value = '';
    }
}

function getLowstAudio() {
    //const container = document.getElementById('my-container');
    const allAudios = chatHistory.getElementsByTagName('audio');

    // Get the bottom position of the container
    const containerBottom = chatHistory.offsetTop + chatHistory.offsetHeight;

    let lowestAudio = null;
    let lowestPosition = 0;

    // Loop through all the audio elements in the container
    for (let i = 0; i < allAudios.length; i++) {
        const audioElem = allAudios[i];

        // Get the bottom position of the audio element
        const audioBottom = audioElem.offsetTop + audioElem.offsetHeight;

        // Check if the audio element is below the current lowest audio element
        if (audioBottom >= lowestPosition && audioBottom < containerBottom) {
            lowestAudio = audioElem;
            lowestPosition = audioBottom;
        }
    }

    return lowestAudio
}
async function initPollySelect() {

    try {
        const response = await new Promise((resolve, reject) => {
            $.post("ChatGpt/GetPollyVoice")
                .done(resolve)
                .fail(reject);
        });
        // 在此处处理返回结果
        const voiceLanguageDict = response;
        //console.log(voiceLanguageDict);
        for (var i = 0; i < voiceLanguageDict.length; i++) {
            const optionElem = document.createElement('option');

            optionElem.value = voiceLanguageDict[i].languageCode + '-' + voiceLanguageDict[i].voiceName;
            optionElem.textContent = voiceLanguageDict[i].languageName + '-' + voiceLanguageDict[i].voiceName;
            polly.add(optionElem);
        }
    } catch (error) {
        // 处理请求错误
        throw error;
    }
    //$.post("ChatGpt/GetPollyVoice").done(function (response) {
    //    //addChatMessage("Assistant", response.content);
    //const voiceLanguageDict = await postFunc("ChatGpt/GetPollyVoice", data)
    //    const voiceLanguageDict = response;
    //    //console.log(voiceLanguageDict);
    //    for (var i = 0; i < voiceLanguageDict.length; i++) {
    //        const optionElem = document.createElement('option');

    //        optionElem.value = voiceLanguageDict[i].languageCode+'-'+voiceLanguageDict[i].voiceName;
    //        optionElem.textContent = voiceLanguageDict[i].languageName + '-' + voiceLanguageDict[i].voiceName;
    //        polly.add(optionElem);
    //    }

    //    //return response.content;
    //    // 处理响应数据
    //}).fail(function (xhr) {
    //    //alert("出现异常，请重新输入或说话");
    //    console.log("出现异常，请重新输入或说话")

    //});


}

function chatnormal(apiKey) {
    const items = [
        {
            messages: chatMessages,
            model: model.value,
            temperature: parseFloat(temperature.value),
            presence_penalty: parseFloat(presence_penalty.value),
            top_p: 1,
            frequency_penalty: parseFloat(frequency_penalty.value),
            stream: isstream.checked
        }]

    const data = JSON.stringify(items);
    const url = "ChatGpt/GetChatNormal";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${apiKey}`,
        },
        body: data
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");

            }
            return response.json();
        })
        .then(result => {
            console.log("%o", result);
            const chatmessage = {
                role: "assistant",
                content: result,
            };
            addChatMessage("Assistant", result);
            chatMessages.push(chatmessage);
            const selectedVoice = polly.value;
            let lowestAudio = getLowstAudio();
            if (selectedVoice !== '请选择') {
                const data = { content: result, polly: selectedVoice }

                $.post("ChatGpt/GetPollyBaseStr", data).done(function (response) {

                    const base64 = response;
                    lowestAudio.setAttribute('src', base64);
                    console.log(lowestAudio);

                    // 处理响应数据
                }).fail(function (xhr) {
                    //alert("出现异常，请重新输入或说话");
                    console.log("出现异常，请重新输入或说话")

                });


            }
            if (auEnabled) {
                // If speech recognition is active, disable it
                if (CN_IS_LISTENING) CN_SPEECHREC.stop();

                if (selectedVoice !== '请选择') {

                    stopPalyAudio();

                    // Set the "src" attribute to the URL of the audio file
                    //playAudio.setAttribute('src', base64);

                    // Play the audio file
                    lowestAudio.play();

                } else {


                    // If speech recognition is active, disable it
                    if (CN_IS_LISTENING) CN_SPEECHREC.stop();
                    CN_SayOutLoud(result.trim());
                    CN_FINISHED = false;
                }


            }


            if (!auEnabled && micEnabled) {
                clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
                CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 200);
            };
        })
        .catch(error => {
            alert("出现异常，请重新输入或说话");
            if (micEnabled) {
                clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
                CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 200);
                //console.log(await response.text());
                //return;
            }
            console.error("There was a problem with the fetch operation:", error);
        });



}




async function postFunc(url, data) {
    try {
        const response = await new Promise((resolve, reject) => {
            $.post(url, data)
                .done(resolve)
                .fail(reject);
        });
        // 在此处处理返回结果
        return response;
    } catch (error) {
        // 处理请求错误
        throw error;
    }
}



function createChatMessage(role, content) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('chatmessage-container');
    if (role == "User") {
        //messageContainer.setAttribute("",);
        messageContainer.style.backgroundColor = '#444653';
    }
    const message = document.createElement('div');
    message.classList.add('chat-message');

    const messageContentRole = document.createElement('div');
    messageContentRole.classList.add('chat-message-role');
    //messageContentRole.textContent = role + ": ";
    if (role == "User") {
        var myImg = new Image();
        myImg.src = "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20enable-background%3D%22new%200%200%20386.212%20504%22%20viewBox%3D%220%200%20386.212%20504%22%3E%3Cpath%20d%3D%22M385.817%2C307.591l0.063-0.31c1.742-8.585-3.538-17.025-12.021-19.215l-14.58-3.764l3.518-4.414%0D%0A%09c2.587-3.248%2C3.729-7.467%2C3.134-11.576s-2.89-7.83-6.292-10.209c-5.842-4.084-13.592-3.574-18.849%2C1.238l-17.097%2C15.652%0D%0A%09c-2.294%2C2.1-5.27%2C3.257-8.38%2C3.257H211.026c-4.643%2C0-8.42-3.777-8.42-8.42v-6.67c6.248-1.841%2C12.477-5.332%2C16.276-10.678%0D%0A%09c5.838-8.215%2C11.748-40.868%2C7.269-56.169c-3.369-11.511-12.987-25.232-39.675-25.232c-22.631%2C0-42.117%2C15.057-45.326%2C35.024%0D%0A%09c-2.599%2C16.161%2C0.854%2C31.396%2C2.291%2C36.698c-2.574%2C3.86-8.064%2C13.282-6.587%2C21.537c0.686%2C3.829%2C2.811%2C6.992%2C6.146%2C9.148%0D%0A%09c2.4%2C1.551%2C4.896%2C2.205%2C7.398%2C2.204c4.875-0.001%2C9.773-2.483%2C14.031-5.634v7.698c0%2C3.671-2.692%2C6.837-6.264%2C7.364%0D%0A%09c-4.757%2C0.702-11.77%2C0.998-18.194-1.571c-12.985-5.194-41.198-35.962-51.165-55.798c-7.361-14.653-13.078-34.311-15.83-44.723%0D%0A%09c-1.103-4.176-3.308-7.888-6.336-10.848l9.987-3.185c3.982-1.271%2C6.765-4.638%2C7.261-8.788c0.497-4.15-1.412-8.08-4.981-10.254%0D%0A%09l-6.799-4.141l60.904-100.005c8.446-13.87%2C12.014-27.646%2C10.905-42.115c-0.099-1.283-0.809-2.441-1.907-3.111%0D%0A%09c-1.1-0.669-2.455-0.768-3.64-0.267c-13.365%2C5.655-23.969%2C15.146-32.414%2C29.015L45.053%2C129.336l-6.803-4.143%0D%0A%09c-3.57-2.173-7.938-2.068-11.396%2C0.279c-3.46%2C2.346-5.175%2C6.364-4.476%2C10.485l1.45%2C8.547c-4.994%2C1.262-9.774%2C4.695-12.919%2C9.86%0D%0A%09c-5.166%2C8.482-4.181%2C18.732%2C1.887%2C24.261L1.844%2C196.611c-1.75%2C2.874-2.277%2C6.256-1.482%2C9.526c0.794%2C3.27%2C2.814%2C6.034%2C5.688%2C7.784%0D%0A%09l8.803%2C5.36c2.041%2C1.243%2C4.299%2C1.834%2C6.53%2C1.834c4.253%2C0%2C8.409-2.15%2C10.778-6.041l4.038-6.63%0D%0A%09c12.067%2C40.033%2C33.936%2C73.722%2C66.612%2C102.685c-0.51%2C1.29-1.02%2C2.571-1.523%2C3.833c-4.802%2C12.042-8.949%2C22.441-8.949%2C31.111%0D%0A%09c0%2C17.052%2C15.907%2C31.945%2C20.435%2C35.839c1.093%2C5.102%2C2.971%2C9.389%2C4.702%2C13.327c2.253%2C5.124%2C4.199%2C9.549%2C4.199%2C14.915%0D%0A%09c0%2C5.585-2.933%2C11.783-6.329%2C18.959c-3.674%2C7.764-7.839%2C16.563-9.286%2C26.908c-2.828%2C20.226%2C8.249%2C44.62%2C8.723%2C45.648%0D%0A%09c0.662%2C1.44%2C2.095%2C2.33%2C3.633%2C2.33c0.262%2C0%2C0.527-0.026%2C0.793-0.08c1.818-0.367%2C3.146-1.937%2C3.206-3.791%0D%0A%09c0.63-19.359%2C6.152-35.915%2C16.413-49.206c1.351-1.749%2C1.027-4.261-0.722-5.611c-1.748-1.35-4.261-1.026-5.61%2C0.722%0D%0A%09c-7.992%2C10.353-13.374%2C22.436-16.085%2C36.071c-2.028-7.635-3.566-16.833-2.427-24.976c1.277-9.134%2C4.996-16.994%2C8.594-24.594%0D%0A%09c2.193-4.634%2C4.307-9.113%2C5.65-13.552c5.558%2C5.097%2C14.999%2C11.267%2C28.152%2C11.267c22.174%2C0%2C37.1-27.361%2C37.725-28.526%0D%0A%09c1.043-1.945%2C0.312-4.367-1.633-5.412c-1.942-1.044-4.369-0.315-5.416%2C1.628c-0.131%2C0.243-13.298%2C24.31-30.676%2C24.31%0D%0A%09c-15.206%2C0-24.318-10.308-26.735-13.44c-0.289-6.428-2.603-11.691-4.845-16.791c-2.553-5.803-4.963-11.284-4.963-18.911%0D%0A%09c0-15.276%2C13.422-56.083%2C13.558-56.493c0.693-2.098-0.445-4.36-2.543-5.053c-2.1-0.692-4.359%2C0.445-5.053%2C2.543%0D%0A%09c-0.537%2C1.623-12.424%2C37.773-13.826%2C55.829c-5.276-5.806-11.634-14.7-11.634-23.861c0-7.133%2C4.07-17.341%2C8.381-28.148%0D%0A%09c4.755-11.924%2C10.024-25.156%2C11.753-38.409c6.235%2C5.516%2C12.05%2C9.669%2C16.529%2C11.461c4.368%2C1.748%2C9.354%2C2.633%2C14.693%2C2.633%0D%0A%09c0.026%2C0%2C0.053-0.001%2C0.08-0.002c3.143%2C6.282%2C12.583%2C21.595%2C29.916%2C21.595c17.974%2C0%2C28.752-21.322%2C32.034-28.954h52.547%0D%0A%09c-3.314%2C10.419-4.047%2C21.481-2.188%2C33.012c-5.074-0.471-9.278-1.062-11.816-1.457c-1.839-7.859-4.436-14.522-4.96-15.829%0D%0A%09c-0.821-2.05-3.151-3.048-5.2-2.225c-2.051%2C0.821-3.047%2C3.15-2.226%2C5.201c2.456%2C6.129%2C8.251%2C23.861%2C5.623%2C32.206%0D%0A%09c-0.002%2C0.005-0.003%2C0.01-0.005%2C0.015c-1.537%2C4.865-4.711%2C8.501-7.498%2C10.922c-2.608-17.752-13.183-39.379-13.694-40.415%0D%0A%09c-0.976-1.98-3.372-2.798-5.355-1.82c-1.981%2C0.976-2.797%2C3.374-1.82%2C5.355c0.134%2C0.273%2C13.448%2C27.508%2C13.448%2C44.094%0D%0A%09c0%2C8.77-2.566%2C15.139-5.049%2C21.299c-2.228%2C5.527-4.53%2C11.242-4.53%2C18.041c0%2C6.814%2C3.388%2C12.483%2C7.31%2C19.047%0D%0A%09c4.627%2C7.743%2C9.871%2C16.519%2C11.051%2C29.818c2.123%2C23.947-10.94%2C54.595-11.072%2C54.902c-0.874%2C2.028%2C0.061%2C4.382%2C2.089%2C5.256%0D%0A%09c0.517%2C0.223%2C1.054%2C0.328%2C1.583%2C0.328c1.548%2C0%2C3.021-0.904%2C3.674-2.415c0.422-0.978%2C7.814-18.316%2C10.76-37.767%0D%0A%09c6.535%2C15.02%2C15.375%2C27.911%2C26.768%2C39.043c0.778%2C0.76%2C1.787%2C1.139%2C2.796%2C1.139c1.039%2C0%2C2.077-0.402%2C2.861-1.205%0D%0A%09c1.544-1.58%2C1.515-4.113-0.065-5.656c-14.968-14.624-25.262-32.543-31.472-54.767c-1.418-14.877-7.335-24.798-12.105-32.78%0D%0A%09c-3.451-5.775-6.177-10.337-6.177-14.943c0-3.757%2C0.946-7.155%2C2.256-10.711c5.004%2C2.95%2C13.591%2C8.362%2C18.584%2C13.484%0D%0A%09c3.495%2C3.586%2C5.889%2C9.12%2C8.202%2C14.471c2.458%2C5.683%2C5%2C11.559%2C9.074%2C15.84c3.734%2C3.923%2C9.935%2C6.131%2C17.132%2C6.131%0D%0A%09c0.357%2C0%2C0.719-0.006%2C1.08-0.017c9.234-0.279%2C17.854-4.132%2C23.057-10.306c9.278-11.01%2C7.407-32.217-5.134-58.184%0D%0A%09c-6.971-14.435-18.239-29.003-25.193-37.348c0.331%2C0.002%2C0.662%2C0.005%2C0.994%2C0.005c3.315%2C0%2C6.691-0.117%2C10.015-0.398%0D%0A%09c9.809-0.831%2C17.933-3.621%2C25.1-6.083c7.194-2.471%2C13.408-4.604%2C20.156-4.604c8.291%2C0%2C21.954%2C2.15%2C31.956%2C3.954%0D%0A%09C375.389%2C322.526%2C383.973%2C316.686%2C385.817%2C307.591z%20M112.789%2C33.492c6.354-10.432%2C14.014-18.066%2C23.302-23.19%0D%0A%09c-0.29%2C10.603-3.558%2C20.914-9.91%2C31.345L65.277%2C141.652l-13.391-8.156L112.789%2C33.492z%20M31.343%2C132.093%0D%0A%09c0.407-0.275%2C1.484-0.835%2C2.746-0.067l40.657%2C24.761c1.259%2C0.766%2C1.259%2C1.982%2C1.201%2C2.47c-0.059%2C0.488-0.346%2C1.669-1.749%2C2.117%0D%0A%09l-15.804%2C5.04l-5.477-3.336c-3.001-1.828-6.412-2.42-9.642-1.93c0.211-6.206-2.379-11.972-7.428-15.047%0D%0A%09c-1.237-0.753-2.555-1.278-3.912-1.632l-1.671-9.851C30.018%2C133.166%2C30.936%2C132.368%2C31.343%2C132.093z%20M17.741%2C158.525%0D%0A%09c2.528-4.151%2C6.563-6.607%2C10.208-6.607c1.328%2C0%2C2.605%2C0.326%2C3.738%2C1.016c4.238%2C2.582%2C4.881%2C9.291%2C1.431%2C14.956%0D%0A%09c-1.752%2C2.875-4.264%2C5.011-7.074%2C6.012c-2.515%2C0.897-4.955%2C0.746-6.872-0.421C14.933%2C170.9%2C14.291%2C164.191%2C17.741%2C158.525z%0D%0A%09%20M25.329%2C210.914c-1.319%2C2.163-4.15%2C2.853-6.316%2C1.535l-8.803-5.36c-1.048-0.638-1.785-1.647-2.075-2.84%0D%0A%09c-0.289-1.193-0.098-2.427%2C0.541-3.476l11.299-18.554c0.938%2C0.178%2C1.897%2C0.273%2C2.872%2C0.273c1.926%2C0%2C3.908-0.349%2C5.882-1.052%0D%0A%09c1.055-0.376%2C2.076-0.853%2C3.062-1.407c1.083%2C3.194%2C3.224%2C5.884%2C6.139%2C7.659l1.125%2C0.685L25.329%2C210.914z%20M41.872%2C199.129%0D%0A%09l4.015-6.592l3.681%2C2.242c1.885%2C1.148%2C4.348%2C0.55%2C5.496-1.336c1.149-1.887%2C0.552-4.348-1.336-5.497l-11.639-7.088%0D%0A%09c-1.461-0.89-2.489-2.296-2.894-3.959c-0.404-1.664-0.136-3.385%2C0.754-4.847c1.839-3.019%2C5.789-3.977%2C8.807-2.141l9.46%2C5.762%0D%0A%09c3.491%2C2.126%2C5.986%2C5.464%2C7.026%2C9.4c2.832%2C10.714%2C8.729%2C30.971%2C16.416%2C46.271c6.394%2C12.725%2C19.004%2C28.755%2C31.363%2C41.136%0D%0A%09c-0.303%2C10.049-3.434%2C20.59-7.144%2C30.656C73.728%2C273.956%2C52.754%2C239.862%2C41.872%2C199.129z%20M181.691%2C307.205%0D%0A%09c-10.766%2C0-17.78-8.727-21.202-14.395c6.883-1.575%2C11.941-7.843%2C11.941-15.052v-14.919c2.474-2.637%2C4.176-4.834%2C4.713-5.547%0D%0A%09c0.901-1.197%2C1.057-2.8%2C0.403-4.149c-3.163-6.537-6.798-17.701-4.976-22.056c2.013-4.814%2C9.661-3.32%2C9.72-3.309%0D%0A%09c2.082%2C0.443%2C4.156-0.827%2C4.701-2.89l6.066-22.954c0.564-2.136-0.709-4.325-2.845-4.889c-2.132-0.563-4.325%2C0.708-4.89%2C2.845%0D%0A%09l-5.193%2C19.651c-5.231-0.09-12.076%2C1.614-14.94%2C8.457c-3.259%2C7.789%2C1.596%2C20.643%2C4.095%2C26.324c-1.034%2C1.239-2.246%2C2.583-3.571%2C3.924%0D%0A%09c-0.07%2C0.065-0.138%2C0.132-0.203%2C0.203c-5.731%2C5.75-13.48%2C11.35-18.169%2C8.321c-1.483-0.959-2.313-2.176-2.611-3.831%0D%0A%09c-1.021-5.663%2C4.194-14.202%2C6.287-17.011c0.775-1.036%2C1.001-2.387%2C0.606-3.62c-0.055-0.17-5.418-17.257-2.576-34.933%0D%0A%09c2.593-16.13%2C18.683-28.294%2C37.428-28.294c17.694%2C0%2C28.16%2C6.372%2C31.997%2C19.479c3.841%2C13.123-2.003%2C43.506-6.112%2C49.288%0D%0A%09c-4.146%2C5.834-13.244%2C8.887-20.089%2C8.887c-2.209%2C0-4%2C1.791-4%2C4s1.791%2C4%2C4%2C4c0.752%2C0%2C1.537-0.04%2C2.334-0.099v5.194%0D%0A%09c0%2C7.086%2C4.52%2C13.12%2C10.822%2C15.416C201.36%2C293.877%2C192.726%2C307.205%2C181.691%2C307.205z%20M296.05%2C368.836%0D%0A%09c10.78%2C22.323%2C13.164%2C41.31%2C6.22%2C49.55c-3.761%2C4.462-10.184%2C7.253-17.182%2C7.465c-5.229%2C0.157-9.892-1.234-12.175-3.633%0D%0A%09c-3.093-3.249-5.246-8.229-7.526-13.5c-2.602-6.016-5.292-12.237-9.816-16.879c-6.073-6.231-16.238-12.483-21.348-15.439%0D%0A%09c1.644-4.24%2C3.214-8.939%2C3.938-14.563c9.475%2C5.609%2C16.438%2C12.181%2C21.17%2C19.986c0.752%2C1.241%2C2.071%2C1.927%2C3.424%2C1.927%0D%0A%09c0.706%2C0%2C1.422-0.187%2C2.07-0.58c1.889-1.146%2C2.491-3.605%2C1.346-5.494c-5.427-8.953-13.289-16.418-23.905-22.705%0D%0A%09c2.981-2.42%2C6.473-5.983%2C8.958-10.786c10.355%2C6.706%2C19.057%2C16.414%2C25.901%2C28.934c0.727%2C1.33%2C2.098%2C2.083%2C3.514%2C2.083%0D%0A%09c0.648%2C0%2C1.306-0.158%2C1.915-0.491c1.938-1.06%2C2.65-3.49%2C1.591-5.428c-7.867-14.391-18.052-25.447-30.303-32.908%0D%0A%09c0.462-3.145%2C0.364-6.672-0.066-10.246c3.373%2C0.478%2C8.034%2C1.044%2C13.344%2C1.431C271.37%2C332.351%2C287.465%2C351.059%2C296.05%2C368.836z%0D%0A%09%20M367.7%2C313.009c-10.323-1.862-24.493-4.081-33.376-4.081c-8.083%2C0-15.21%2C2.447-22.755%2C5.039%0D%0A%09c-7.057%2C2.423-14.354%2C4.929-23.177%2C5.677c-5.343%2C0.453-10.902%2C0.439-16.09%2C0.197c-2.213-11.86-1.402-23.134%2C2.42-33.589h40.591%0D%0A%09c5.115%2C0%2C10.01-1.902%2C13.782-5.356l17.097-15.652c2.473-2.262%2C6.115-2.502%2C8.862-0.582c1.624%2C1.135%2C2.674%2C2.84%2C2.958%2C4.8%0D%0A%09c0.284%2C1.96-0.238%2C3.894-1.474%2C5.443l-7.36%2C9.238c-0.844%2C1.06-1.095%2C2.476-0.665%2C3.761c0.431%2C1.286%2C1.481%2C2.266%2C2.794%2C2.604%0D%0A%09l20.552%2C5.305c4.361%2C1.126%2C7.076%2C5.465%2C6.181%2C9.875l-0.063%2C0.31C377.005%2C310.793%2C372.496%2C313.875%2C367.7%2C313.009z%20M163.441%2C449.76%0D%0A%09c-6.114%2C14.557-6.612%2C31.092-1.479%2C49.146c0.604%2C2.125-0.629%2C4.337-2.754%2C4.941c-0.365%2C0.104-0.733%2C0.153-1.096%2C0.153%0D%0A%09c-1.743%2C0-3.346-1.147-3.846-2.907c-5.643-19.845-5.037-38.158%2C1.799-54.432c0.855-2.036%2C3.201-2.993%2C5.236-2.139%0D%0A%09C163.34%2C445.378%2C164.297%2C447.723%2C163.441%2C449.76z%20M186.028%2C336.146L161.5%2C374.16c-0.766%2C1.186-2.052%2C1.832-3.365%2C1.832%0D%0A%09c-0.743%2C0-1.494-0.207-2.165-0.64c-1.856-1.198-2.39-3.673-1.192-5.529l24.528-38.015c1.199-1.855%2C3.674-2.39%2C5.53-1.192%0D%0A%09C186.692%2C331.814%2C187.225%2C334.29%2C186.028%2C336.146z%20M184.292%2C374.192c1.785%2C1.301%2C2.177%2C3.804%2C0.876%2C5.588l-19.905%2C27.3%0D%0A%09c-0.783%2C1.074-2.001%2C1.644-3.235%2C1.644c-0.817%2C0-1.643-0.25-2.354-0.769c-1.785-1.301-2.177-3.804-0.876-5.588l19.905-27.3%0D%0A%09C180.005%2C373.282%2C182.507%2C372.89%2C184.292%2C374.192z%22%2F%3E%3C%2Fsvg%3E";
        //myImg.alt = "我的图片";
        //style = "width: 2%; image-rendering: crisp-edges;"
        myImg.style.width = "40px";
        myImg.style.height = "40px";
        myImg.style.imageRendering = "crisp-edges";
        messageContentRole.appendChild(myImg);
    } else {
        var mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        mySvg.setAttribute("width", "40");
        mySvg.setAttribute("height", "40");
        mySvg.setAttribute("viewBox", "0 0 64 64");
        var myCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        myCircle.setAttribute("cx", "32");
        myCircle.setAttribute("cy", "32");
        myCircle.setAttribute("r", "5.6");
        myCircle.setAttribute("fill", "#ed4c5c");

        // 将子元素添加到 SVG 元素中
        mySvg.appendChild(myCircle);

        var myPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

        // 设置 path 元素的属性
        myPath.setAttribute("d", "m57.9 32c.2-.2.3-.4.5-.6 3.9-5.6 4.7-10.7 2.3-14.5-2.2-3.5-7-5.5-13.4-5.5-1.1 0-2.3.1-3.5.2-2.9-5.9-7.1-9.6-11.8-9.6s-8.9 3.7-11.8 9.6c-1.2-.1-2.4-.2-3.5-.2-6.4 0-11.2 1.9-13.4 5.5-2.4 3.8-1.6 9 2.3 14.5.2.2.4.4.5.6-.2.2-.3.4-.5.6-3.8 5.6-4.6 10.8-2.2 14.6 2.2 3.5 7 5.5 13.4 5.5 1.1 0 2.3-.1 3.5-.2 2.8 5.8 7 9.5 11.7 9.5s8.9-3.7 11.8-9.6c1.2.1 2.4.2 3.5.2 6.4 0 11.2-1.9 13.4-5.5 2.4-3.8 1.6-9-2.3-14.5-.2-.2-.4-.4-.5-.6m-10.7-18.9c5.7 0 9.9 1.6 11.8 4.6 2 3.2 1.2 7.7-2.3 12.7l-.1.1c-2.5-3-5.8-6-9.7-8.6-.6-3.2-1.4-6.1-2.5-8.7 1-.1 2-.1 2.8-.1m-7.4 31.3c-2.6 1.4-5.2 2.5-7.8 3.5-2.6-1-5.3-2.1-7.8-3.5-1.9-1-3.7-2.1-5.5-3.3-.5-2.9-.8-6-.8-9.2s.3-6.3.8-9.2c1.7-1.2 3.5-2.2 5.5-3.3 2.6-1.4 5.2-2.5 7.8-3.5 2.6 1 5.3 2.1 7.8 3.5 1.9 1 3.7 2.1 5.5 3.3.5 2.9.8 6 .8 9.2s-.3 6.3-.8 9.2c-1.7 1.2-3.6 2.3-5.5 3.3m5-.8c-.6 2.5-1.3 4.9-2.3 7-2.6-.3-5.2-.9-7.9-1.8 2.1-.8 4.1-1.8 6.1-2.8 1.5-.8 2.8-1.6 4.1-2.4m-15.4 5.2c-2.7.8-5.4 1.4-7.9 1.8-.9-2.1-1.7-4.4-2.3-7 1.3.8 2.6 1.6 4 2.3 2.1 1.1 4.1 2 6.2 2.9m-12.8-9.1c-3.2-2.4-6-5-8.1-7.7 2.1-2.7 4.9-5.3 8.1-7.7-.3 2.4-.5 5-.5 7.7s.1 5.2.5 7.7m2.6-19.3c.6-2.5 1.3-4.9 2.3-7 2.6.3 5.2.9 7.9 1.8-2.1.8-4.1 1.8-6.1 2.9-1.5.7-2.8 1.5-4.1 2.3m15.4-5.2c2.7-.8 5.4-1.4 7.9-1.8.9 2.1 1.7 4.4 2.3 7-1.3-.8-2.6-1.6-4-2.3-2.1-1.1-4.1-2-6.2-2.9m12.8 9.1c3.2 2.4 6 5 8.1 7.7-2.1 2.7-4.9 5.3-8.1 7.7.3-2.4.5-5 .5-7.7s-.1-5.2-.5-7.7m-15.4-20.4c3.8 0 7.2 3 9.8 7.9-3.1.5-6.4 1.3-9.8 2.5-3.3-1.2-6.6-2-9.8-2.5 2.6-4.9 6-7.9 9.8-7.9m-24.8 26.5c-3.5-5-4.3-9.5-2.3-12.7 1.9-3 6.1-4.6 11.8-4.6.9 0 1.8 0 2.7.1-1.1 2.6-1.9 5.5-2.5 8.7-3.8 2.6-7.1 5.6-9.7 8.5m9.6 20.5c-5.7 0-9.9-1.6-11.8-4.6-2-3.2-1.2-7.7 2.3-12.7 0 0 0-.1.1-.1 2.5 3 5.8 6 9.7 8.6.6 3.2 1.4 6.1 2.5 8.7-1 .1-1.9.1-2.8.1m15.2 9.2c-3.8 0-7.2-3-9.8-7.9 3.1-.5 6.4-1.3 9.8-2.5 3.3 1.2 6.6 2 9.8 2.5-2.6 4.9-6 7.9-9.8 7.9m27-13.8c-1.9 3-6.1 4.6-11.8 4.6-.9 0-1.8 0-2.7-.1 1.1-2.6 1.9-5.5 2.5-8.7 3.8-2.6 7.1-5.6 9.7-8.6 0 0 0 .1.1.1 3.5 5 4.3 9.5 2.2 12.7");
        myPath.setAttribute("fill", "#0071bc");
        mySvg.appendChild(myPath);
        messageContentRole.appendChild(mySvg);
    }


    const blurmessageContent = document.createElement('div');
    blurmessageContent.classList.add('blur-div');



    const messageContent = document.createElement('pre');
    messageContent.classList.add('chat-message-content');
    messageContent.textContent = content;
    blurmessageContent.appendChild(messageContent);


    const messageActions = document.createElement('div');
    messageActions.classList.add('chat-message-actions');
    const playButton = document.createElement('button');
    playButton.classList.add('play-button');
    playButton.title = 'Listen to message';

    //controls typeof="audio/mpeg"
    const playAudio = document.createElement('audio');
    playAudio.classList.add('play-audio');
    playAudio.setAttribute('controls', true);
    // Set the "type" attribute to "audio/mpeg"
    playAudio.setAttribute('type', 'audio/mpeg');
    playAudio.style.display = "none";
    // Set the "src" attribute to the URL of the audio file
    //playAudio.setAttribute('src', '');
    messageActions.appendChild(playButton);
    //
    messageActions.appendChild(playAudio);

    message.appendChild(messageContentRole);
    message.appendChild(blurmessageContent);
    message.appendChild(messageActions);

    //#444653

    messageContainer.appendChild(message);
    return messageContainer;
}

// 添加新聊天消息
async function addChatMessage(role, content) {
    const message = createChatMessage(role, content.trim());
    //const messageContainer = message.querySelector('.chatmessage-container');

    // 绑定播放按钮事件
    const playButton = message.querySelector('.play-button');
    const playAudio = message.querySelector('.play-audio')
    const messageContent = message.querySelector('.chat-message-content');
    const messageText = messageContent.textContent.trim();
    const selectedVoice = polly.value;
    console.log(selectedVoice)
    if (selectedVoice != '请选择') {


        //if (playAudio.src === '' && content.trim() !== '' && role == "Assistant" && isstream.checked==true) {
        //    const data = { content: content.trim(), polly: selectedVoice }
        //    //const data =  content.trim()+'~'+ selectedVoice 

        //    //const base64 = getPollyBase64Str(data);
        //    const base64 = await postFunc('ChatGpt/GetPollyBaseStr', data);
        //    // console.log(base64);
        //    // Set the "src" attribute to the URL of the audio file


        //    playAudio.setAttribute('src', base64);

        //    console.log(playAudio);

        //    // Play the audio file
        //    //audioElem.play();
        //}



    }
    const box = message.querySelector('.blur-div');
    if (role == 'User') {
        box.setAttribute('id', role);
    }
    if (role == "Assistant" && isAllBlur) {

        box.style.filter = "blur(10px)";
    }
    chatHistory.appendChild(message);


    playButton.addEventListener('click', async () => {
        const messageText = messageContent.textContent.trim();
        const selectedVoice = polly.value;
        //const selectedVoice = polly.value;
        // If speech recognition is active, disable it
        if (auEnabled) {
            if (CN_IS_LISTENING) CN_SPEECHREC.stop();
            if (selectedVoice != '请选择') {
                stopPalyAudio();
                if (playAudio.src === '') {
                    const data = { content: messageText, polly: selectedVoice }
                    //const base64 = getPollyBase64Str(data);
                    // Set the "src" attribute to the URL of the audio file
                    const base64 = await postFunc('ChatGpt/GetPollyBaseStr', data);
                    playAudio.setAttribute('src', base64);
                    console.log(playAudio);
                    // Play the audio file
                    playAudio.play();
                } else {
                    console.log(playAudio);
                    playAudio.play();

                }
            } else {

                CN_SayOutLoud(messageText);
                CN_FINISHED = false;
            }

        }
        console.log(messageText);
    });

    const blurmessagecontent = message.querySelector('.blur-div');
    let blurEnabled = false;
    blurmessagecontent.addEventListener('click', function () {

        console.log(isAllBlur);
        if (isAllBlur) {

            if (!blurEnabled) {
                blurmessagecontent.style.filter = "blur(0)";
            } else {

                blurmessagecontent.style.filter = "blur(10px)";
            }
            blurEnabled = !blurEnabled;
            console.log(blurEnabled);
        }

    });


}

let voices = [];
let parentOptions = [];
let childOptions = [];

function populateVoiceList() {
    voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.split("-")[1].toUpperCase();
        const bname = b.name.split("-")[1].toUpperCase();

        if (aname < bname) {
            return -1;
        } else if (aname == bname) {
            return 0;
        } else {
            return +1;
        }
    });
    const selectedIndex =
        languageSelect.selectedIndex < 0 ? 32 : languageSelect.selectedIndex;
    languageSelect.innerHTML = "";

    var childOption = [];
    for (let i = 1; i <= voices.length; i++) {
        //if (voices[i].lang == 'en-AU' || voices[i].lang == 'zh-CN' || voices[i].lang == 'en-US') {
        const option = document.createElement("option");

        var arr = voices[i - 1].name.split("-");
        if (arr[1] == undefined) {
            //option.textContent = `${name[1]} `;
            console.log(arr[0])

        } else {

            if (i == 1) {

                parentOptions.push(arr[1].trim());
                option.textContent = parentOptions[parentOptions.length - 1]
                if (voices[i - 1].default) {
                    option.textContent += " -- DEFAULT";
                }
                option.setAttribute("Value", parentOptions.length - 1);
                option.setAttribute("data-name", parentOptions[parentOptions.length - 1]);
                languageSelect.appendChild(option);
                childOption.push(arr[0]);
            } else {
                //.textContent = `${name[0]} - ${name[1]} `;
                if (parentOptions[parentOptions.length - 1] != arr[1].trim()) {
                    parentOptions.push(arr[1].trim());

                    option.textContent = parentOptions[parentOptions.length - 1]
                    if (voices[i - 1].default) {
                        option.textContent += " -- DEFAULT";
                    }
                    option.setAttribute("Value", parentOptions.length - 1);

                    //option.setAttribute("data-lang", voices[i].lang);
                    option.setAttribute("data-name", parentOptions[parentOptions.length - 1]);
                    languageSelect.appendChild(option);
                    childOptions.push(childOption);
                    childOption = [];
                    childOption.push(arr[0]);
                } else {
                    childOption.push(arr[0]);
                    if (i == voices.length) {


                        childOptions.push(childOption);
                        childOption = [];
                    }
                }

            }

        }

    }
    //console.log(parentOptions);
    languageSelect.selectedIndex = selectedIndex;

}



var child = document.getElementById("Voices");

//为父级下拉菜单添加事件监听 
languageSelect.addEventListener("click", function () { // 重置子下拉菜单的选项
    child.length = 1;
    //child.options.length = 0; 
    // 如果选择了默认选项，则返回 
    if (languageSelect.value == "0") return;
    // 根据所选的选项值加载子下拉菜单 
    var m = parseInt(languageSelect.value);
    var options = childOptions[m];
    var text = $('#Languages option:selected').text()
    addChildOptions(options, text);
});

function addChildOptions(options, parenttext) {
    // 为子下拉菜单添加新选项 
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");

        option.setAttribute("data-name", options[i] + "- " + parenttext);
        option.text = options[i];
        child.add(option);
    }
}



function sortOptions(options) {
    var options = options;
    var sorted = [];
    for (var i = 0; i < options.length; i++) {
        sorted.push(options[i]);
    }
    sorted.sort(function (a, b) {
        var textA = a.text.toUpperCase();
        var textB = b.text.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    for (var i = 0; i < sorted.length; i++) {
        languageSelect.appendChild(sorted[i]);
    }
}

function recognitionLanguage() {


    const selectedIndex =
        reclanguageSelect.selectedIndex < 0 ? 94 : reclanguageSelect.selectedIndex;
    reclanguageSelect.innerHTML = "";


    for (var i in CN_SPEECHREC_LANGS) {
        var languageName = CN_SPEECHREC_LANGS[i][0];

        for (var j in CN_SPEECHREC_LANGS[i]) {
            if (j == 0) continue;
            const option = document.createElement("option");
            var languageCode = CN_SPEECHREC_LANGS[i][j][0];
            option.textContent = languageName + " - " + languageCode
            option.setAttribute("value", languageCode);
            reclanguageSelect.appendChild(option);

        }
    }
    //console.log(reclanguageSelect);
    reclanguageSelect.selectedIndex = selectedIndex;

}


if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoiceList;
}

function speak(valueinput) {

    const isspeaking = synth.speaking;
    if (synth.speaking) {

        console.log("speechSynthesis.speaking");
        return;
    }

    if (valueinput !== "") {
        const utterThis = new SpeechSynthesisUtterance(valueinput);

        utterThis.onend = function (event) {
            console.log("SpeechSynthesisUtterance.onend");
        };

        utterThis.onerror = function (event) {
            console.log("SpeechSynthesisUtterance.onerror");
        };

        const selectedOption =
            child.selectedOptions[0].getAttribute("data-name");

        for (let i = 0; i < voices.length; i++) {
            if (voices[i].name === selectedOption) {
                utterThis.voice = voices[i];
                break;
            }
        }
        utterThis.pitch = pitch.value;
        utterThis.rate = rate.value;
        synth.speak(utterThis);
        utterThis.onend = () => {
            CN_AfterSpeakOutLoudFinished();
        }
    }
}



pitch.onchange = function () {
    pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
    rateValue.textContent = rate.value;
};

child.onchange = function () {
    //speak(inputTxt.value);
};

///Talk to ChatGpt extension

var CN_TEXT_TO_SPEECH_RATE = 1; // The higher the rate, the faster the bot will speak
var CN_TEXT_TO_SPEECH_PITCH = 1; // This will alter the pitch for the bot's voice

// Indicate a locale code such as 'fr-FR', 'en-US', to use a particular language for the speech recognition functionality (when you speak into the mic)
// If you leave this blank, the system's default language will be used
var CN_WANTED_LANGUAGE_SPEECH_REC = ""; //"fr-FR";

// Determine which word will cause this scrip to stop.
var CN_SAY_THIS_WORD_TO_STOP = "stop";

// Determine which word will cause this script to temporarily pause
var CN_SAY_THIS_WORD_TO_PAUSE = "pause";

// Determine whether messages are sent immediately after speaing
var CN_AUTO_SEND_AFTER_SPEAKING = false;

// Determine which word(s) will cause this script to send the current message (if auto-send disabled)
var CN_SAY_THIS_TO_SEND = "send message now";

// Indicate "locale-voice name" (the possible values are difficult to determine, you should just ignore this and use the settings menu instead)
var CN_WANTED_VOICE_NAME = "";

var CN_MESSAGE_COUNT = 0;
var CN_CURRENT_MESSAGE = null;
var CN_CURRENT_MESSAGE_SENTENCES = [];
var CN_CURRENT_MESSAGE_SENTENCES_NEXT_READ = 0;
var CN_SPEECHREC = null;
var CN_IS_READING = false;
var CN_IS_LISTENING = false;
var CN_FINISHED = false;
var CN_PAUSED = false;
var CN_WANTED_VOICE = null;
var CN_TIMEOUT_KEEP_SYNTHESIS_WORKING = null;
var CN_TIMEOUT_KEEP_SPEECHREC_WORKING = null;

var CN_SPEAKING_DISABLED = false;
var CN_SPEECHREC_DISABLED = false;


// This function will say the given text out loud using the browser's speech synthesis API
function CN_SayOutLoud(text) {
    if (!text || CN_SPEAKING_DISABLED) {
        if (CN_SPEECH_REC_SUPPORTED && CN_SPEECHREC && !CN_IS_LISTENING && !CN_PAUSED && !CN_SPEECHREC_DISABLED) CN_SPEECHREC.start();
        clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
        CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 4000);
        return;
    }

    // Are we speaking?
    if (CN_SPEECHREC) {
        clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
        CN_SPEECHREC.stop();
    }

    // Let's speak out loud
    console.log("Saying out loud: " + text);
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;


    const selectedOption =
        child.selectedOptions[0].getAttribute("data-name");

    for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
            msg.voice = voices[i];
            break;
        }
    }

    //if (CN_WANTED_VOICE) msg.voice = CN_WANTED_VOICE;

    msg.rate = rate.value; //CN_TEXT_TO_SPEECH_RATE;
    msg.pitch = pitch.value; //CN_TEXT_TO_SPEECH_PITCH;
    msg.onstart = () => {
        // Make border green
        $("#TTGPTSettings").css("border-bottom", "8px solid green");

        // If speech recognition is active, disable it
        if (CN_IS_LISTENING) CN_SPEECHREC.stop();

        //if (CN_FINISHED) return;
        CN_IS_READING = true;
        clearTimeout(CN_TIMEOUT_KEEP_SYNTHESIS_WORKING);
        CN_TIMEOUT_KEEP_SYNTHESIS_WORKING = setTimeout(CN_KeepSpeechSynthesisActive, 5000);
    };
    msg.onend = () => {
        CN_AfterSpeakOutLoudFinished();
    }
    CN_IS_READING = true;
    // const isspeaking = synth.speaking;
    synth.speak(msg);

}

// Occurs when speaking out loud is finished
function CN_AfterSpeakOutLoudFinished() {
    // Make border grey again
    $("#TTGPTSettings").css("border", "2px solid #888");

    //if (CN_FINISHED) return;

    // Finished speaking
    clearTimeout(CN_TIMEOUT_KEEP_SYNTHESIS_WORKING);
    console.log("Finished speaking out loud");
    let isPalying = isPalyAudio()
    // restart listening
    CN_IS_READING = false;
    console.log("CN_AfterSpeakOutLoudFinished:" + CN_IS_READING);
    if (micEnabled) {
        setTimeout(function () {
            if (!synth.speaking && !isPalying) {
                if (CN_SPEECH_REC_SUPPORTED && CN_SPEECHREC && !CN_IS_LISTENING && !CN_PAUSED && !CN_SPEECHREC_DISABLED) CN_SPEECHREC.start();
                clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
                CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 1000);
            }
        }, 1000);
    }

}

function CN_KeepSpeechSynthesisActive() {
    console.log("Keeping speech synthesis active...");
    //synth.pause();
    //synth.resume();
    CN_TIMEOUT_KEEP_SYNTHESIS_WORKING = setTimeout(CN_KeepSpeechSynthesisActive, 5000);
}

// Split the text into sentences so the speech synthesis can start speaking as soon as possible
function CN_SplitIntoSentences(text) {
    var sentences = [];
    var currentSentence = "";

    for (var i = 0; i < text.length; i++) {
        //
        var currentChar = text[i];

        // Add character to current sentence
        currentSentence += currentChar;

        // is the current character a delimiter? if so, add current part to array and clear
        if (
            // Latin punctuation
            //currentChar == ',' 
            //currentChar == ':'
            currentChar == '.'
            //|| currentChar == '!'
            ||
            currentChar == '?' ||
            currentChar == ';' ||
            currentChar == '…'
            // Chinese/japanese punctuation
            //|| currentChar == '、' 
            //|| currentChar == '，'
            ||
            currentChar == '。' ||
            currentChar == '．'
            //|| currentChar == '！'
            ||
            currentChar == '？' ||
            currentChar == '；'
            //|| currentChar == '：'
        ) {
            if (currentSentence.trim() != "") sentences.push(currentSentence.trim());
            currentSentence = "";
        }
    }

    return sentences;
}

// Check for new messages the bot has sent. If a new message is found, it will be read out loud
function CN_CheckNewMessages() {
    // Any new messages?
    var currentMessageCount = jQuery(".text-base").length;
    if (currentMessageCount > CN_MESSAGE_COUNT) {
        // New message!
        CN_MESSAGE_COUNT = currentMessageCount;
        CN_CURRENT_MESSAGE = jQuery(".text-base:last");
        CN_CURRENT_MESSAGE_SENTENCES = []; // Reset list of parts already spoken
        CN_CURRENT_MESSAGE_SENTENCES_NEXT_READ = 0;
    }

    // Split current message into parts
    if (CN_CURRENT_MESSAGE && CN_CURRENT_MESSAGE.length) {
        var currentText = CN_CURRENT_MESSAGE.text() + "";
        var newSentences = CN_SplitIntoSentences(currentText);
        if (newSentences != null && newSentences.length != CN_CURRENT_MESSAGE_SENTENCES.length) {
            // There is a new part of a sentence!
            var nextRead = CN_CURRENT_MESSAGE_SENTENCES_NEXT_READ;
            for (i = nextRead; i < newSentences.length; i++) {
                CN_CURRENT_MESSAGE_SENTENCES_NEXT_READ = i + 1;

                var lastPart = newSentences[i];
                CN_SayOutLoud(lastPart);
            }
            CN_CURRENT_MESSAGE_SENTENCES = newSentences;
        }
    }

    //setTimeout(CN_CheckNewMessages, 100);
}

// Send a message to the bot (will simply put text in the textarea and simulate a send button click)
function CN_SendMessage(text) {
    // Put message in textarea
    //jQuery("textarea:first").focus();
    //var existingText = jQuery("textarea:first").val();

    // Is there already existing text?
    //if (!existingText) jQuery("textarea").val(text);
    //else jQuery("textarea").val(existingText+" "+text);

    // Change height in case
    //var fullText = existingText+" "+text;
    //var rows = Math.ceil( fullText.length / 88);
    //var height = rows * 24;
    //jQuery("textarea").css("height", height+"px");
    messageInput.value = text;

    // Send the message, if autosend is enabled
    if (CN_AUTO_SEND_AFTER_SPEAKING) {
        //jQuery("textarea").closest("div").find("button").click();
        addChatMessage("User", text);
        const role = "user";
        $.post("ChatGpt/chat", {
            role: role,
            content: text,
            key: key
        }, function (response) {
            //var reuslt=  JSON.stringify(response);
            addChatMessage("Assistant", response.content);

            if (auEnabled) {
                // If speech recognition is active, disable it
                //if (CN_IS_LISTENING) CN_SPEECHREC.stop();
                CN_SayOutLoud(response.content.trim());
                CN_FINISHED = false;
            }
            if (!auEnabled && micEnabled) {
                clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);

                CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 200);
            }
            messageInput.value = "";
            //speak(response.content);
        }).fail(function (xhr, status, error) {
            alert("出现异常，请重新输入或说话");
            if (micEnabled) {
                clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
                CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 200);
            };
        });

        // Stop speech recognition until the answer is received
        if (CN_SPEECHREC) {
            clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
            CN_SPEECHREC.stop();
        }
    } else {
        // If speech recognition is active, disable it
        if (micEnabled) {
            //CN_SPEECHREC.stop();
            // No autosend, so continue recognizing
            clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
            CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 200);
        }
    }
}

// Start speech recognition using the browser's speech recognition API

function CN_StartSpeechRecognition() {
    console.log("CN_StartSpeechRecognition:" + CN_IS_READING);
    let isPlaying = isPalyAudio();
    console.log("polly是否正在说话" + isPlaying);
    if (!synth.speaking && !isPlaying) {
        if (CN_IS_READING) {
            clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
            CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 1000);
            return;
        }
        if (!CN_SPEECH_REC_SUPPORTED) return;
        CN_SPEECHREC = ('webkitSpeechRecognition' in window) ? new webkitSpeechRecognition() : new SpeechRecognition();
        CN_SPEECHREC.continuous = true;
        CN_WANTED_LANGUAGE_SPEECH_REC = reclanguageSelect.selectedOptions[0].getAttribute("value").trim();
        CN_SPEECHREC.lang = CN_WANTED_LANGUAGE_SPEECH_REC;
        CN_SPEECHREC.onstart = () => {
            // Make border red
            $("#TTGPTSettings").css("border-bottom", "8px solid red");
            CN_IS_LISTENING = true;
            console.log("I'm listening");
        };
        CN_SPEECHREC.onend = () => {
            // Make border grey again
            $("#TTGPTSettings").css("border", "2px solid #888");

            CN_IS_LISTENING = false;
            console.log("I've stopped listening");
        };
        CN_SPEECHREC.onerror = () => {
            CN_IS_LISTENING = false;
            console.log("Error while listening");
        };
        CN_SPEECHREC.onresult = (event) => {
            var final_transcript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal)
                    final_transcript += event.results[i][0].transcript;
            }
            console.log("You have said the following words: " + final_transcript);
            if (final_transcript.toLowerCase() == CN_SAY_THIS_WORD_TO_STOP) {
                console.log("You said '" + CN_SAY_THIS_WORD_TO_STOP + "'. Conversation ended");
                CN_FINISHED = true;
                CN_PAUSED = false;
                CN_SPEECHREC.stop();
                CN_SayOutLoud("Bye bye");
                alert("Conversation ended. Click the Start button to resume");

                // Show start button, hide action buttons
                jQuery(".CNStartZone").show();
                jQuery(".CNActionButtons").hide();

                return;
            } else if (final_transcript.toLowerCase() == CN_SAY_THIS_WORD_TO_PAUSE) {
                console.log("You said '" + CN_SAY_THIS_WORD_TO_PAUSE + "' Conversation paused");
                CN_PAUSED = true;
                if (CN_SPEECHREC) CN_SPEECHREC.stop();
                alert("Conversation paused, the browser is no longer listening. Click OK to resume");
                CN_PAUSED = false;
                console.log("Conversation resumed");
                return;
            } else if (final_transcript.toLowerCase().trim() == CN_SAY_THIS_TO_SEND.toLowerCase().trim() && !CN_AUTO_SEND_AFTER_SPEAKING) {
                console.log("You said '" + CN_SAY_THIS_TO_SEND + "' - the message will be sent");

                // Click button
                //jQuery("textarea").closest("div").find("button").click();
                // sendButton.click();
                // Stop speech recognition until the answer is received
                if (CN_SPEECHREC) {
                    clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
                    CN_SPEECHREC.stop();
                }

                return;
            }

            CN_SendMessage(final_transcript);
        };
        if (!CN_IS_LISTENING && CN_SPEECH_REC_SUPPORTED && !CN_SPEECHREC_DISABLED) CN_SPEECHREC.start();
        clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
        CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 5000);
    }


}


// Make sure the speech recognition is turned on when the bot is not speaking
function CN_KeepSpeechRecWorking() {
    //if (CN_FINISHED) return; // Conversation finished
    let isPlaying = isPalyAudio();
    console.log("polly是否正在说话" + isPlaying);
    clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
    CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 3000);
    if (!CN_IS_READING && !CN_IS_LISTENING && !CN_PAUSED) {
        if (!CN_SPEECHREC)
            CN_StartSpeechRecognition();
        else {
            if (!CN_IS_LISTENING) {
                try {
                    if (CN_SPEECH_REC_SUPPORTED && !synth.speaking && !CN_SPEECHREC_DISABLED && !isPlaying)
                        CN_SPEECHREC.start();
                } catch (e) { }
            }
        }
    }
}


function CN_ToggleButtonClick() {
    var action = $(this).data("cn");
    switch (action) {

        // Open settings menu
        case "settings":
            CN_OnSettingsIconClick();
            return;

        // The microphone is on. Turn it off
        case "micon":
            // Show other icon and hide this one
            $(this).css("display", "none");
            $(".CNToggle[data-cn=micoff]").css("display", "");

            // Disable speech rec
            CN_SPEECHREC_DISABLED = true;
            if (CN_SPEECHREC && CN_IS_LISTENING) CN_SPEECHREC.stop();

            return;

        // The microphone is off. Turn it on
        case "micoff":
            // Show other icon and hide this one
            $(this).css("display", "none");
            $(".CNToggle[data-cn=micon]").css("display", "");

            // Enable speech rec
            CN_SPEECHREC_DISABLED = false;
            if (CN_SPEECHREC && !CN_IS_LISTENING && !CN_IS_READING) {
                CN_SPEECHREC.stop();
                CN_SPEECHREC.start();
            };

            return;

        // The bot's voice is on. Turn it off
        case "speakon":
            // Show other icon and hide this one
            $(this).css("display", "none");
            $(".CNToggle[data-cn=speakoff]").css("display", "");
            CN_SPEAKING_DISABLED = true;

            // Stop current message (equivalent to 'skip')
            synth.pause(); // Pause, and then...
            synth.cancel(); // Cancel everything
            CN_CURRENT_MESSAGE = null; // Remove current message
            return;

        // The bot's voice is off. Turn it on
        case "speakoff":
            // Show other icon and hide this one
            $(this).css("display", "none");
            $(".CNToggle[data-cn=speakon]").css("display", "");
            CN_SPEAKING_DISABLED = false;

            return;

        // Skip current message being read
        case "skip":
            synth.pause(); // Pause, and then...
            synth.cancel(); // Cancel everything
            CN_CURRENT_MESSAGE = null; // Remove current message

            // Restart listening maybe?
            CN_AfterSpeakOutLoudFinished();
            return;
    }
}

function CN_StartTTGPT() {
    CN_SayOutLoud("OK");
    CN_FINISHED = false;

    // Hide start button, show action buttons
    jQuery(".CNStartZone").hide();
    jQuery(".CNActionButtons").show();

    setTimeout(function () {
        // Start speech rec
        CN_StartSpeechRecognition();

        // Check for new messages
        //CN_CheckNewMessages();
    }, 100);
}

// Perform initialization after jQuery is loaded
function CN_InitScript() {
    if (typeof $ === null || typeof $ === undefined) $ = jQuery;

    var warning = "";
    if ('webkitSpeechRecognition' in window) {
        console.log("Speech recognition API supported");
        CN_SPEECH_REC_SUPPORTED = true;
    } else {
        console.log("speech recognition API not supported.");
        CN_SPEECH_REC_SUPPORTED = false;
        warning = "\n\nWARNING: speech recognition (speech-to-text) is only available in Google Chrome desktop version at the moment. If you are using another browser, you will not be able to dictate text, but you can still listen to the bot's responses.";
    }

    // Restore settings
    CN_RestoreSettings();

    // Wait on voices to be loaded before fetching list
    synth.onvoiceschanged = function () {
        if (!CN_WANTED_VOICE_NAME) {
            console.log("Reading with default browser voice");
        } else {
            synth.getVoices().forEach(function (voice) {
                //console.log("Found possible voice: " + voice.name + " (" + voice.lang + ")");
                if (voice.lang + "-" + voice.name == CN_WANTED_VOICE_NAME) {
                    CN_WANTED_VOICE = voice;
                    console.log("I will read using voice " + voice.name + " (" + voice.lang + ")");
                    return false;
                }
            });
            if (!CN_WANTED_VOICE)
                console.log("No voice found for '" + CN_WANTED_VOICE_NAME + "', reading with default browser voice");
        }

        // Voice OK
        //setTimeout(function () {
        //CN_SayOutLoud("OK");
        //}, 100);
    };

    // Add icons on the top right corner
    jQuery("body").append("<span style='position: fixed; top: 150px; right:30%; display: inline-block; " +
        "background: #888; color: white; padding: 8px; font-size: 16px; border-radius: 4px; text-align: center;" +
        "font-weight: bold; z-index: 1111;' id='TTGPTSettings'><a href='https://github.com/C-Nedelcu/talk-to-chatgpt' target=_blank title='Visit project website'>Talk-to-ChatGPT v1.6.1</a><br />" +
        "<span style='font-size: 16px;' class='CNStartZone'>" +
        "<button style='border: 1px solid #CCC; padding: 4px; margin: 6px; background: #FFF; border-radius: 4px; color:black;' id='CNStartButton'>▶️ START</button>" +
        "</span>" +
        "<span style='font-size: 20px; display:none;' class='CNActionButtons'>" +
        "<span class='CNToggle' title='Voice recognition enabled. Click to disable' data-cn='micon'>🎙️ </span>  " + // Microphone enabled
        "<span class='CNToggle' title='Voice recognition disabled. Click to enable' style='display:none;' data-cn='micoff'>🤫 </span>  " + // Microphone disabled
        "<span class='CNToggle' title='Text-to-speech (bot voice) enabled. Click to disable. This will skip the current message entirely.' data-cn='speakon'>🔊 </span>  " + // Speak out loud
        "<span class='CNToggle' title='Text-to-speech (bot voice) disabled. Click to enable' style='display:none;' data-cn='speakoff'>🔇 </span>  " + // Mute
        "<span class='CNToggle' title='Skip the message currently being read by the bot.' data-cn='skip'>⏩ </span>  " + // Skip
        "<span class='CNToggle' title='Open settings menu to change bot voice, language, and other settings' data-cn='settings'>⚙️</span> " + // Settings
        "</span></span>");

    setTimeout(function () {
        // Try and get voices
        synth.getVoices();

        // Make icons clickable
        jQuery(".CNToggle").css("cursor", "pointer");
        jQuery(".CNToggle").on("click", CN_ToggleButtonClick);
        jQuery("#CNStartButton").on("click", CN_StartTTGPT);
        // Say OK to confirm it has started
        /*setTimeout(function() {
    	
        }, 100);*/
    }, 100);
}

// Open settings menu
function CN_OnSettingsIconClick() {
    console.log("Opening settings menu");

    // Stop listening
    CN_PAUSED = true;
    if (CN_SPEECHREC) CN_SPEECHREC.stop();

    // Prepare settings row
    var rows = "";

    // 1. Bot's voice
    var voices = "";
    var n = 0;
    synth.getVoices().forEach(function (voice) {
        var label = `${voice.name} (${voice.lang})`;
        if (voice.default) label += ' — DEFAULT';
        var SEL = (CN_WANTED_VOICE && CN_WANTED_VOICE.lang == voice.lang && CN_WANTED_VOICE.name == voice.name) ? "selected=selected" : "";
        voices += "<option value='" + n + "' " + SEL + ">" + label + "</option>";
        n++;
    });
    rows += "<tr><td>AI voice and language:</td><td><select id='TTGPTVoice' style='width: 300px; color: black'>" + voices + "</select></td></tr>";

    // 2. AI talking speed
    rows += "<tr><td>AI talking speed (speech rate):</td><td><input type=number step='.1' id='TTGPTRate' style='color: black; width: 100px;' value='" + CN_TEXT_TO_SPEECH_RATE + "' /></td></tr>";

    // 3. AI voice pitch
    rows += "<tr><td>AI voice pitch:</td><td><input type=number step='.1' id='TTGPTPitch' style='width: 100px; color: black;' value='" + CN_TEXT_TO_SPEECH_PITCH + "' /></td></tr>";

    // 4. Speech recognition language CN_WANTED_LANGUAGE_SPEECH_REC
    var languages = "<option value=''></option>";
    for (var i in CN_SPEECHREC_LANGS) {
        var languageName = CN_SPEECHREC_LANGS[i][0];
        for (var j in CN_SPEECHREC_LANGS[i]) {
            if (j == 0) continue;
            var languageCode = CN_SPEECHREC_LANGS[i][j][0];
            var SEL = languageCode == CN_WANTED_LANGUAGE_SPEECH_REC ? "selected='selected'" : "";
            languages += "<option value='" + languageCode + "' " + SEL + ">" + languageName + " - " + languageCode + "</option>";
        }
    }
    rows += "<tr><td>Speech recognition language:</td><td><select id='TTGPTRecLang' style='width: 300px; color: black;' >" + languages + "</select></td></tr>";

    // 5. 'Stop' word
    rows += "<tr><td>'Stop' word:</td><td><input type=text id='TTGPTStopWord' style='width: 100px; color: black;' value='" + CN_SAY_THIS_WORD_TO_STOP + "' /></td></tr>";

    // 6. 'Pause' word
    rows += "<tr><td>'Pause' word:</td><td><input type=text id='TTGPTPauseWord' style='width: 100px; color: black;' value='" + CN_SAY_THIS_WORD_TO_PAUSE + "' /></td></tr>";

    // 7. Autosend
    rows += "<tr><td>Automatic send:</td><td><input type=checkbox id='TTGPTAutosend' " + (CN_AUTO_SEND_AFTER_SPEAKING ? "checked=checked" : "") + " /> <label for='TTGPTAutosend'>Automatically send message to ChatGPT after speaking</label></td></tr>";

    // 8. Manual send word
    rows += "<tr><td>Manual send word(s):</td><td><input type=text id='TTGPTSendWord' style='width: 300px; color: black;' value='" + CN_SAY_THIS_TO_SEND + "' /> If 'automatic send' is disabled, you can trigger the sending of the message by saying this word (or sequence of words)</td></tr>";

    // Prepare save/close buttons
    var closeRow = "<tr><td colspan=2 style='text-align: center'><br /><button id='TTGPTSave' style='font-weight: bold;'>✓ Save</button>&nbsp;<button id='TTGPTCancel' style='margin-left: 20px;'>✗ Cancel</button></td></tr>";

    // Prepare settings table
    var table = "<table cellpadding=6 cellspacing=0 style='margin: 30px;'>" + rows + closeRow + "</table>";

    // A short text at the beginning
    var desc = "<div style='margin: 8px;'>Please note: some the voices and speech recognition languages do not appear to work. If the one you select doesn't work, try reloading the page. " +
        "If it still doesn't work after reloading the page, please try selecting another voice or language. " +
        "Also, sometimes the text-to-speech API takes time to kick in, give it a few seconds to hear the bot speak. <b>Remember this is an experimental extension created just for fun.</b> " +
        "Check out the <a href='https://github.com/C-Nedelcu/talk-to-chatgpt' target=_blank style='text-decoration: underline'>project page</a> to get the source code." +
        "</div>";

    // Open a whole screenful of settings
    jQuery("body").append("<div style='background: rgba(0,0,0,0.7); position: absolute; top: 0; right: 0; left: 0; bottom: 0; z-index: 999999; padding: 20px; color: white; font-size: 14px;' id='TTGPTSettingsArea'><h1>⚙️ Talk-to-GPT settings</h1>" + desc + table + "</div>");

    // Assign events
    setTimeout(function () {
        jQuery("#TTGPTSave").on("click", CN_SaveSettings);
        jQuery("#TTGPTCancel").on("click", CN_CloseSettingsDialog);
    }, 100);
}

// Save settings and close dialog box
function CN_SaveSettings() {

    // Save settings
    try {
        // AI voice settings: voice/language, rate, pitch
        var wantedVoiceIndex = jQuery("#TTGPTVoice").val();
        var allVoices = synth.getVoices();
        CN_WANTED_VOICE = allVoices[wantedVoiceIndex];
        CN_WANTED_VOICE_NAME = CN_WANTED_VOICE.lang + "-" + CN_WANTED_VOICE.name;
        CN_TEXT_TO_SPEECH_RATE = Number(jQuery("#TTGPTRate").val());
        CN_TEXT_TO_SPEECH_PITCH = Number(jQuery("#TTGPTPitch").val());

        // Speech recognition settings: language, stop, pause
        CN_WANTED_LANGUAGE_SPEECH_REC = jQuery("#TTGPTRecLang").val();
        CN_SAY_THIS_WORD_TO_STOP = jQuery("#TTGPTStopWord").val();
        CN_SAY_THIS_WORD_TO_PAUSE = jQuery("#TTGPTPauseWord").val();
        CN_AUTO_SEND_AFTER_SPEAKING = jQuery("#TTGPTAutosend").prop("checked");
        CN_SAY_THIS_TO_SEND = jQuery("#TTGPTSendWord").val();

        // Apply language to speech recognition instance
        if (CN_SPEECHREC) CN_SPEECHREC.lang = CN_WANTED_LANGUAGE_SPEECH_REC;

        // Save settings in cookie
        var settings = [
            CN_WANTED_VOICE_NAME,
            CN_TEXT_TO_SPEECH_RATE,
            CN_TEXT_TO_SPEECH_PITCH,
            CN_WANTED_LANGUAGE_SPEECH_REC,
            CN_SAY_THIS_WORD_TO_STOP,
            CN_SAY_THIS_WORD_TO_PAUSE,
            CN_AUTO_SEND_AFTER_SPEAKING ? 1 : 0,
            CN_SAY_THIS_TO_SEND
        ];
        CN_SetCookie("CN_TTGPT", JSON.stringify(settings));
    } catch (e) {
        alert('Invalid settings values');
        return;
    }

    // Close dialog
    console.log("Closing settings dialog");
    jQuery("#TTGPTSettingsArea").remove();

    // Resume listening
    CN_PAUSED = false;
}

// Restore settings from cookie
function CN_RestoreSettings() {
    var settingsRaw = CN_GetCookie("CN_TTGPT");
    try {
        var settings = JSON.parse(settingsRaw);
        if (typeof settings == "object" && settings != null) {
            console.log("Reloading settings from cookie: " + settings);
            CN_WANTED_VOICE_NAME = settings[0];
            CN_TEXT_TO_SPEECH_RATE = settings[1];
            CN_TEXT_TO_SPEECH_PITCH = settings[2];
            CN_WANTED_LANGUAGE_SPEECH_REC = settings[3];
            CN_SAY_THIS_WORD_TO_STOP = settings[4];
            CN_SAY_THIS_WORD_TO_PAUSE = settings[5];
            if (settings.hasOwnProperty(6)) CN_AUTO_SEND_AFTER_SPEAKING = settings[6] == 1;
            if (settings.hasOwnProperty(7)) CN_SAY_THIS_TO_SEND = settings[7];
        }
    } catch (ex) {
        console.error(ex);
    }
}

// Close dialog: remove area altogether
function CN_CloseSettingsDialog() {
    console.log("Closing settings dialog");
    jQuery("#TTGPTSettingsArea").remove();

    // Resume listening
    CN_PAUSED = false;
}

// Sets a cookie
function CN_SetCookie(name, value) {
    var days = 365;
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

// Reads a cookie
function CN_GetCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

// List of languages for speech recognition - Pulled from https://www.google.com/intl/en/chrome/demos/speech.html
var CN_SPEECHREC_LANGS = [
    ['Afrikaans', ['af-ZA']],
    ['አማርኛ', ['am-ET']],
    ['Azərbaycanca', ['az-AZ']],
    ['বাংলা', ['bn-BD', 'বাংলাদেশ'],
        ['bn-IN', 'ভারত']
    ],
    ['Bahasa Indonesia', ['id-ID']],
    ['Bahasa Melayu', ['ms-MY']],
    ['Català', ['ca-ES']],
    ['Čeština', ['cs-CZ']],
    ['Dansk', ['da-DK']],
    ['Deutsch', ['de-DE']],
    ['English', ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-KE', 'Kenya'],
        ['en-TZ', 'Tanzania'],
        ['en-GH', 'Ghana'],
        ['en-NZ', 'New Zealand'],
        ['en-NG', 'Nigeria'],
        ['en-ZA', 'South Africa'],
        ['en-PH', 'Philippines'],
        ['en-GB', 'United Kingdom'],
        ['en-US', 'United States']
    ],
    ['Español', ['es-AR', 'Argentina'],
        ['es-BO', 'Bolivia'],
        ['es-CL', 'Chile'],
        ['es-CO', 'Colombia'],
        ['es-CR', 'Costa Rica'],
        ['es-EC', 'Ecuador'],
        ['es-SV', 'El Salvador'],
        ['es-ES', 'España'],
        ['es-US', 'Estados Unidos'],
        ['es-GT', 'Guatemala'],
        ['es-HN', 'Honduras'],
        ['es-MX', 'México'],
        ['es-NI', 'Nicaragua'],
        ['es-PA', 'Panamá'],
        ['es-PY', 'Paraguay'],
        ['es-PE', 'Perú'],
        ['es-PR', 'Puerto Rico'],
        ['es-DO', 'República Dominicana'],
        ['es-UY', 'Uruguay'],
        ['es-VE', 'Venezuela']
    ],
    ['Euskara', ['eu-ES']],
    ['Filipino', ['fil-PH']],
    ['Français', ['fr-FR']],
    ['Basa Jawa', ['jv-ID']],
    ['Galego', ['gl-ES']],
    ['ગુજરાતી', ['gu-IN']],
    ['Hrvatski', ['hr-HR']],
    ['IsiZulu', ['zu-ZA']],
    ['Íslenska', ['is-IS']],
    ['Italiano', ['it-IT', 'Italia'],
        ['it-CH', 'Svizzera']
    ],
    ['ಕನ್ನಡ', ['kn-IN']],
    ['ភាសាខ្មែរ', ['km-KH']],
    ['Latviešu', ['lv-LV']],
    ['Lietuvių', ['lt-LT']],
    ['മലയാളം', ['ml-IN']],
    ['मराठी', ['mr-IN']],
    ['Magyar', ['hu-HU']],
    ['ລາວ', ['lo-LA']],
    ['Nederlands', ['nl-NL']],
    ['नेपाली भाषा', ['ne-NP']],
    ['Norsk bokmål', ['nb-NO']],
    ['Polski', ['pl-PL']],
    ['Português', ['pt-BR', 'Brasil'],
        ['pt-PT', 'Portugal']
    ],
    ['Română', ['ro-RO']],
    ['සිංහල', ['si-LK']],
    ['Slovenščina', ['sl-SI']],
    ['Basa Sunda', ['su-ID']],
    ['Slovenčina', ['sk-SK']],
    ['Suomi', ['fi-FI']],
    ['Svenska', ['sv-SE']],
    ['Kiswahili', ['sw-TZ', 'Tanzania'],
        ['sw-KE', 'Kenya']
    ],
    ['ქართული', ['ka-GE']],
    ['Հայերեն', ['hy-AM']],
    ['தமிழ்', ['ta-IN', 'இந்தியா'],
        ['ta-SG', 'சிங்கப்பூர்'],
        ['ta-LK', 'இலங்கை'],
        ['ta-MY', 'மலேசியா']
    ],
    ['తెలుగు', ['te-IN']],
    ['Tiếng Việt', ['vi-VN']],
    ['Türkçe', ['tr-TR']],
    ['اُردُو', ['ur-PK', 'پاکستان'],
        ['ur-IN', 'بھارت']
    ],
    ['Ελληνικά', ['el-GR']],
    ['български', ['bg-BG']],
    ['Pусский', ['ru-RU']],
    ['Српски', ['sr-RS']],
    ['Українська', ['uk-UA']],
    ['한국어', ['ko-KR']],
    ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
        ['cmn-Hans-HK', '普通话 (香港)'],
        ['cmn-Hant-TW', '中文 (台灣)'],
        ['yue-Hant-HK', '粵語 (香港)']
    ],
    ['日本語', ['ja-JP']],
    ['हिन्दी', ['hi-IN']],
    ['ภาษาไทย', ['th-TH']]
];