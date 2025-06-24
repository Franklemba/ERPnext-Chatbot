# chatbot_integration/chatbot_integration/api/chat.py

import frappe
import requests

@frappe.whitelist(allow_guest=True)  # allow_guest=True optional if logged in
def test_chatbot(user_input):
    try:
        response = requests.post("http://host.docker.internal:8000/chat", json={"query": user_input})
        data = response.json()
        return {
            "success": True,
            "message": data.get("answer", "No response from chatbot.")
        }
    except Exception as e:
        frappe.log_error(f"Chatbot Error: {e}", "Chatbot Integration")
        frappe.log_error("Calling chatbot at host.docker.internal", "Chatbot Call")
        return {
            "success": False,
            "message": "Error connecting to the AI assistant !!."
        }
