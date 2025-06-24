# import frappe
# import requests
# from frappe import _

# @frappe.whitelist()
# def call_chatbot(user_input):
#     """
#     Function to call FastAPI chatbot from ERPNext
#     """
#     try:
#         # Replace with your FastAPI URL
#         chatbot_url = "http://localhost:8000/chat"
        
#         # Make API call
#         response = requests.post(
#             chatbot_url, 
#             json={"query": user_input},
#             timeout=30
#         )
        
#         if response.status_code == 200:
#             result = response.json()
#             return {
#                 "success": True,
#                 "message": result.get("response", "No response from chatbot")
#             }
#         else:
#             return {
#                 "success": False,
#                 "message": f"Error: {response.status_code}"
#             }
            
#     except Exception as e:
#         return {
#             "success": False,
#             "message": f"Connection error: {str(e)}"
#         }