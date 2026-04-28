document.addEventListener("DOMContentLoaded", function () {
  const sendBtn = document.getElementById("send-btn");
  const chatBotInput = document.getElementById("chatbot-input");
  const closeBtn = document.getElementById("close-btn");
  const chatbotContainer = document.getElementById("chatbot-container");

  // Evento botón enviar
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  // Evento tecla Enter
  if (chatBotInput) {
    chatBotInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  // Botón cerrar (opcional, no rompe si no existe)
  if (closeBtn && chatbotContainer) {
    closeBtn.addEventListener("click", () => {
      chatbotContainer.style.display = "none";
    });
  }
});

function sendMessage() {
  const input = document.getElementById("chatbot-input");

  if (!input) return;

  const userMessage = input.value.trim();

  if (userMessage !== "") {
    appendMessage("user", userMessage);
    input.value = ""; // limpiar input correctamente
    getBotResponse(userMessage);
  }
}

function appendMessage(sender, message) {
  const messageContainer = document.getElementById("chatbot-messages");

  if (!messageContainer) return;

  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;

  messageContainer.appendChild(messageElement);

  // Auto scroll
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

async function getBotResponse(userMessage) {
  const API_KEY = "AIzaSyC-AEeV5pYytvZZTdXyGG76UiqEKJ1RL-U";// Link del api
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
                  //Url del api que se va a usar para obtener la respuesta del bot, con la clave de API incluida
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from API");
    }

    const botMessage = data.candidates[0].content.parts[0].text;

    appendMessage("bot", botMessage);

  } catch (error) {
    console.error("Error:", error);
    appendMessage(
      "bot",
      "Error al responder. Intenta nuevamente."
    );
  }
}