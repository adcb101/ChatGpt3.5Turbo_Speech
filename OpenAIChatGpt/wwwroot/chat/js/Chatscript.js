var synth = window.speechSynthesis;
const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt");
const languageSelect = document.getElementById("Languages");
const reclanguageSelect = document.getElementById("Spoken");
const chatcontainer = document.getElementById("chat-container");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

const messageInput = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const blurButton = document.querySelector('#blur-button');
const audioButton = document.querySelector('#audiobutton');
const skipButton = document.querySelector('#skipbtn');
const micButton = document.querySelector('#mircbtn');
const chatHistory = document.querySelector('#chat-history');
//const voiceInputButton = document.getElementById('voice-input-button');
const playButtons = document.querySelectorAll('.play-button');
var CN_SPEECH_REC_SUPPORTED = false;
const key = Math.random().toString();
var isAllBlur = false;

(function () {

    console.log(key);
    if ('webkitSpeechRecognition' in window) {
        console.log("Speech recognition API supported");
        CN_SPEECH_REC_SUPPORTED = true;
    } else {
        console.log("speech recognition API not supported.");
        CN_SPEECH_REC_SUPPORTED = false;
        warning = "\n\nWARNING: speech recognition (speech-to-text) is only available in Google Chrome desktop version at the moment. If you are using another browser, you will not be able to dictate text, but you can still listen to the bot's responses.";
    }
})();


function scrollToBottom(editor) {
    editor.scrollTop = editor.scrollHeight - editor.clientHeight;
}

function observeEditor(editor) {
    var observer = new MutationObserver(function (mutations) {
        scrollToBottom(editor);
    });
    observer.observe(editor, {
        childList: true,
        subtree: true
    });
}
observeEditor(chatcontainer);

sendButton.addEventListener('click', sendMessage);
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
    CN_CURRENT_MESSAGE = null; // Remove current message
    // Restart listening maybe?
    CN_AfterSpeakOutLoudFinished();
});
let micEnabled = false;
micButton.addEventListener('click', function (event) {

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
messageInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
        //console.log('Enter key was pressed');
    }
});

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

function sendMessage() {
    const message = messageInput.value;

    if (message.trim() !== '') {

        var role = "user";
        addChatMessage("User", message);

        $.post("home/chat", {
            role: role,
            content: message,
            key: key
        }, function (response) {
            addChatMessage("Assistant", response.content);
            if (role != "Assistant" && isAllBlur) {
                $('.blur-div').css('filter', 'blur(10px)');
                $('.blur-div#User').css('filter', 'blur(0)');
                //message.querySelector('.blur-div').filter('blur(0)'); 
            }

            if (auEnabled) {
                // If speech recognition is active, disable it
                if (CN_IS_LISTENING) CN_SPEECHREC.stop();
                CN_SayOutLoud(response.content.trim());
                CN_FINISHED = false;
            }
            if (!auEnabled && micEnabled) {
                clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
                CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 200);
            };
            messageInput.value = "";
            // 处理响应数据
        }).error(function (jqxhr, status, error) {
            alert("出现异常，请重新输入或说话：" + status);
            if (micEnabled) {
                clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
                CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 200);
            };

        });

        messageInput.value = '';
    }
}



function createChatMessage(role, content) {
    const message = document.createElement('div');
    message.classList.add('chat-message');

    const messageContentRole = document.createElement('div');
    messageContentRole.classList.add('chat-message-role');
    messageContentRole.textContent = role + ": ";

    const blurmessageContent = document.createElement('div');
    blurmessageContent.classList.add('blur-div');



    const messageContent = document.createElement('div');
    messageContent.classList.add('chat-message-content');
    messageContent.textContent = content;
    blurmessageContent.appendChild(messageContent);


    const messageActions = document.createElement('div');
    messageActions.classList.add('chat-message-actions');
    const playButton = document.createElement('button');
    playButton.classList.add('play-button');
    playButton.title = 'Listen to message';
    messageActions.appendChild(playButton);

    message.appendChild(messageContentRole);
    message.appendChild(blurmessageContent);
    message.appendChild(messageActions);

    return message;
}

// 添加新聊天消息
function addChatMessage(role, content) {
    const message = createChatMessage(role, content);
    if (role == 'User') {
        const box = message.querySelector('.blur-div');
        box.setAttribute('id', role);
    }
    chatHistory.appendChild(message);

    // 绑定播放按钮事件
    const playButton = message.querySelector('.play-button');
    const messageContent = message.querySelector('.chat-message-content');
    playButton.addEventListener('click', () => {

        const messageText = messageContent.textContent.trim();
        // If speech recognition is active, disable it
        if (auEnabled) {
            if (CN_IS_LISTENING) CN_SPEECHREC.stop();
            CN_SayOutLoud(messageText);
            CN_FINISHED = false;
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

populateVoiceList();

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

window.onload = function () {

    sortOptions(languageSelect.options);
    sortOptions(child.options);
    recognitionLanguage();
};

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

    // restart listening
    CN_IS_READING = false;
    console.log("CN_AfterSpeakOutLoudFinished:" + CN_IS_READING);
    if (micEnabled) {
        setTimeout(function () {
            if (!synth.speaking) {
                if (CN_SPEECH_REC_SUPPORTED && CN_SPEECHREC && !CN_IS_LISTENING && !CN_PAUSED && !CN_SPEECHREC_DISABLED) CN_SPEECHREC.start();
                clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
                CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 1000);
            }
        }, 1000);
    }
    
}

function CN_KeepSpeechSynthesisActive() {
    console.log("Keeping speech synthesis active...");
    synth.pause();
    synth.resume();
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
        $.post("home/chat", {
            role: role,
            content: text,
            key: key
        }, function (response) {
            //var reuslt=  JSON.stringify(response);
            addChatMessage("Assistant", response.content);
            if (role != "Assistant" && isAllBlur) {

               
                $('.blur-div').css('filter', 'blur(10px)');
                $('.blur-div#User').css('filter', 'blur(0)');
                //message.querySelector('.blur-div').filter('blur(0)'); 
            }
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
        }).error(function (jqxhr, status, error) {
            alert("出现异常， 请刷新：" + status);
            // If speech recognition is active, disable it
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
    if (!synth.speaking) {
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
    clearTimeout(CN_TIMEOUT_KEEP_SPEECHREC_WORKING);
    CN_TIMEOUT_KEEP_SPEECHREC_WORKING = setTimeout(CN_KeepSpeechRecWorking, 3000);
    if (!CN_IS_READING && !CN_IS_LISTENING && !CN_PAUSED) {
        if (!CN_SPEECHREC)
            CN_StartSpeechRecognition();
        else {
            if (!CN_IS_LISTENING) {
                try {
                    if (CN_SPEECH_REC_SUPPORTED && !synth.speaking && !CN_SPEECHREC_DISABLED)
                        CN_SPEECHREC.start();
                } catch (e) {}
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