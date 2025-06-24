
window.show_chatbot_dialog = function () {
    let dialog = new frappe.ui.Dialog({
        title: 'AI Assistant',
        fields: [
            {
                fieldname: 'chat_area',
                fieldtype: 'HTML',
                options: `
                    <div id="chat-messages" style="height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; background: #f9f9f9;">
                        <p><strong>Bot:</strong> Hello! How can I help you?</p>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <input type="text" id="user-input" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Type your message..." />
                        <button id="send-button" style="padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Send</button>
                    </div>
                `
            }
        ],
        primary_action_label: 'Close',
        primary_action: function() {
            dialog.hide();
        }
    });
    
    dialog.show();
    
    // Wait for dialog to render, then attach event listeners
    setTimeout(() => {
        // Get elements from within the dialog
        const sendButton = dialog.$wrapper.find('#send-button')[0];
        const userInput = dialog.$wrapper.find('#user-input')[0];
        const chatMessages = dialog.$wrapper.find('#chat-messages')[0];
        
        // Function to send message (defined within the dialog scope)
        function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;
            
            // Add user message to chat
            chatMessages.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
            userInput.value = '';
            
            // Add loading message
            chatMessages.innerHTML += `<p id="loading-msg"><strong>Bot:</strong> <em>Thinking...</em></p>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Call backend
            frappe.call({
                method: "chatbot_integration.api.chat.test_chatbot",
                args: {
                    user_input: message
                },
                callback: function(response) {
                    // Remove loading message
                    const loadingMsg = chatMessages.querySelector('#loading-msg');
                    if (loadingMsg) loadingMsg.remove();
                    
                    console.log("Full response:", response);
                    console.log("Response keys:", Object.keys(response));
                    console.log("Response.message:", response.message);
                    console.log("Response type:", typeof response);
                    
                    // Handle different response formats
                    let botMessage = "No response received";
                    
                    if (response && response.message) {
                        if (typeof response.message === 'string') {
                            botMessage = response.message;
                        } else if (typeof response.message === 'object') {
                            if (response.message.success && response.message.message) {
                                botMessage = response.message.message;
                            } else if (response.message.message) {
                                botMessage = response.message.message;
                            } else {
                                botMessage = JSON.stringify(response.message);
                            }
                        }
                    } else {
                        // Try to get any data from response
                        botMessage = `Debug: Response is empty. Keys: ${Object.keys(response).join(', ')}`;
                    }
                    
                    chatMessages.innerHTML += `<p><strong>Bot:</strong> ${botMessage}</p>`;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                },
                error: function(error) {
                    // Remove loading message
                    const loadingMsg = chatMessages.querySelector('#loading-msg');
                    if (loadingMsg) loadingMsg.remove();
                    
                    console.error("API Error:", error);
                    console.log("Error keys:", Object.keys(error));
                    chatMessages.innerHTML += `<p><strong>Bot:</strong> <em>Error occurred: ${JSON.stringify(error)}</em></p>`;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            });
        }
        
        // Attach event listeners
        if (sendButton) {
            sendButton.addEventListener('click', sendMessage);
        }
        
        if (userInput) {
            userInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            userInput.focus(); // Focus on input field
        }
        
    }, 200); // Increased timeout to ensure dialog is fully rendered
}