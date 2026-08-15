"use strict";

/* =========================================
   ALISA — ISO'NING AI YORDAMCHISI
   APP.JS
========================================= */

const chat = document.getElementById("chat");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const micButton = document.getElementById("micButton");
const statusElement = document.getElementById("status");

let recognition = null;
let isListening = false;


/* =========================================
   XABAR QO'SHISH
========================================= */

function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className =
        sender === "user"
            ? "message user"
            : "message alisa";

    const bubble =
        document.createElement("div");

    bubble.className = "message-bubble";

    bubble.textContent = text;

    message.appendChild(bubble);

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;
}


/* =========================================
   YOZMOQDA ANIMATSIYASI
========================================= */

function showTyping() {

    const message =
        document.createElement("div");

    message.id = "typingMessage";

    message.className =
        "message alisa";

    message.innerHTML = `
        <div class="message-bubble">
            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    chat.appendChild(message);

    chat.scrollTop =
        chat.scrollHeight;
}


function hideTyping() {

    const typing =
        document.getElementById(
            "typingMessage"
        );

    if (typing) {
        typing.remove();
    }
}


/* =========================================
   ALISA JAVOBI
========================================= */

function getAlisaReply(text) {

    const message =
        text
            .toLowerCase()
            .trim();


    if (!message) {

        return "Xabar yozing 😊";
    }


    if (
        message.includes("salom") ||
        message.includes("assalom")
    ) {

        return "Salom! 😄 Men ALISA. Bugun kayfiyatingiz qanday?";
    }


    if (
        message.includes("qalaysan") ||
        message.includes("qalesan")
    ) {

        return "Zo‘rman! 😄 Siz bilan suhbatlashishga tayyorman.";
    }


    if (
        message.includes("isming") ||
        message.includes("ismi")
    ) {

        return "Mening ismim ALISA. Men ISO‘ning AI yordamchisiman. 🤖✨";
    }


    if (
        message.includes("kim") &&
        message.includes("sen")
    ) {

        return "Men ALISA — ISO‘ning quvnoq AI yordamchisiman. 😊";
    }


    if (
        message.includes("rahmat") ||
        message.includes("raxmat")
    ) {

        return "Arzimaydi! 😄 Yana nima qilamiz?";
    }


    if (
        message.includes("xayr") ||
        message.includes("hayr")
    ) {

        return "Xayr! 👋 Yana gaplashamiz.";
    }


    if (
        message.includes("vaqt") ||
        message.includes("soat")
    ) {

        return (
            "Hozirgi vaqt: " +
            new Date().toLocaleTimeString(
                "uz-UZ",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )
        );
    }


    if (
        message.includes("sana") ||
        message.includes("bugun")
    ) {

        return (
            "Bugungi sana: " +
            new Date().toLocaleDateString(
                "uz-UZ"
            )
        );
    }


    if (
        message.includes("hazil")
    ) {

        return "Mayli 😄 Kompyuter nega sovqotibdi? Chunki Windows ochiq qolibdi! 😂";
    }


    if (
        message.includes("yordam")
    ) {

        return "Albatta! 😊 Menga savolingizni yozing yoki mikrofon tugmasini bosib gapiring.";
    }


    return (
        "Qiziq savol ekan 😊 Men hozircha oddiy rejimda ishlayapman. " +
        "Keyingi bosqichda haqiqiy AI tizimini ulaymiz."
    );
}


/* =========================================
   ALISA JAVOB BERISHI
========================================= */

function answerUser(text) {

    if (!text.trim()) {
        return;
    }


    addMessage(
        text,
        "user"
    );


    messageInput.value = "";

    setStatus(
        "● O‘ylayapti..."
    );


    showTyping();


    const delay =
        600 +
        Math.random() * 700;


    setTimeout(
        () => {

            hideTyping();


            const reply =
                getAlisaReply(text);


            addMessage(
                reply,
                "alisa"
            );


            setStatus(
                "● Tayyor"
            );


            speak(reply);

        },
        delay
    );
}


/* =========================================
   MATN YUBORISH
========================================= */

messageForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const text =
            messageInput.value.trim();

        if (!text) {
            return;
        }

        answerUser(text);
    }
);


/* =========================================
   OVOZ CHIQARISH
========================================= */

function speak(text) {

    if (
        !("speechSynthesis" in window)
    ) {

        return;
    }


    window.speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(
            text
        );


    utterance.lang = "uz-UZ";

    utterance.rate = 0.95;

    utterance.pitch = 1.15;

    utterance.volume = 1;


    utterance.onstart = function() {

        setStatus(
            "🔊 Gapiryapti..."
        );
    };


    utterance.onend = function() {

        setStatus(
            "● Tayyor"
        );
    };


    utterance.onerror = function() {

        setStatus(
            "● Tayyor"
        );
    };


    window.speechSynthesis.speak(
        utterance
    );
}


/* =========================================
   MIKROFON
========================================= */

function setupSpeechRecognition() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        micButton.disabled = true;

        micButton.style.opacity =
            "0.45";

        micButton.title =
            "Bu brauzer ovozli kiritishni qo‘llamaydi";

        return;
    }


    recognition =
        new SpeechRecognition();


    recognition.lang =
        "uz-UZ";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    recognition.maxAlternatives =
        1;


    recognition.onstart =
        function() {

            isListening = true;

            setStatus(
                "🎤 Eshitmoqda..."
            );

            micButton.textContent =
                "⏹️";
        };


    recognition.onresult =
        function(event) {

            const result =
                event.results[0][0].transcript;

            messageInput.value =
                result;

            answerUser(result);
        };


    recognition.onerror =
        function(event) {

            console.error(
                "Microphone error:",
                event.error
            );

            setStatus(
                "● Tayyor"
            );
        };


    recognition.onend =
        function() {

            isListening = false;

            micButton.textContent =
                "🎤";

            setStatus(
                "● Tayyor"
            );
        };
}


/* =========================================
   MIKROFON TUGMASI
========================================= */

micButton.addEventListener(
    "click",
    function() {

        if (!recognition) {

            setStatus(
                "⚠️ Mikrofon qo‘llanmaydi"
            );

            return;
        }


        if (isListening) {

            recognition.stop();

            return;
        }


        try {

            recognition.start();

        } catch (error) {

            console.error(error);
        }
    }
);


/* =========================================
   STATUS
========================================= */

function setStatus(text) {

    if (statusElement) {

        statusElement.textContent =
            text;
    }
}


/* =========================================
   INPUT KLAVIATURA
========================================= */

messageInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            messageForm.requestSubmit();
        }
    }
);


/* =========================================
   BOSHLASH
========================================= */

function init() {

    setupSpeechRecognition();

    messageInput.focus();

    setStatus(
        "● Tayyor"
    );
}


init();
