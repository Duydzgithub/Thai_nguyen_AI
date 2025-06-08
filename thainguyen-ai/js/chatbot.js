document.addEventListener("DOMContentLoaded", function () {
    const chatForm = document.getElementById("chat-form");
    const chatWindow = document.getElementById("chat-window");
    const userInput = document.getElementById("user-input");

    chatForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        // Hiển thị câu hỏi của người dùng
        appendMessage("Bạn", message);

        // Gửi câu hỏi tới API và nhận phản hồi
        appendMessage("AI", "Đang trả lời...");

        try {
            const aiReply = await getAIReply(message);
            // Xóa "Đang trả lời..." và thay bằng câu trả lời thật
            chatWindow.lastChild.remove();
            appendMessage("AI", aiReply);
        } catch (err) {
            chatWindow.lastChild.remove();
            appendMessage("AI", "Xin lỗi, có lỗi xảy ra khi kết nối AI.");
        }

        userInput.value = "";
        chatWindow.scrollTop = chatWindow.scrollHeight;
    });

    function appendMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatWindow.appendChild(msgDiv);
    }

    // Hàm gọi API OpenRouter (bạn cần thay API_KEY và endpoint phù hợp)
    async function getAIReply(question) {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "HTTP-Referer": "https://duydzgithub.github.io/Thai_nguyen_AI/", // Đổi thành domain thật nếu deploy
                "X-Title": "Thainguyen-AImazing",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o",
                messages: [
                    { role: "system", content: "Bạn là trợ lý AI chuyên về du lịch Thái Nguyên, Việt Nam." },
                    { role: "user", content: question }
                ]
            })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "Không nhận được phản hồi từ AI.";
    }
});
