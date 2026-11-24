import doc_style
from docx.shared import Pt, RGBColor

def add_qa_item(doc, q_num, question, short_answer, explanation, code_example=None, code_caption=None, follow_up=None, key_points=None):
    # Question Heading
    doc_style.add_heading_2(doc, f"Q{q_num}. {question}")
    
    # 1. Short Answer
    doc_style.add_body_p(doc, short_answer, bold_prefix="Direct Answer: ")
    
    # 2. Detailed Technical Explanation
    doc_style.add_body_p(doc, explanation, bold_prefix="In-Depth Technical Explanation: ")
    
    # 3. Job Executive Code Example / Reference (if present)
    if code_example:
        doc_style.add_code_block(doc, code_example, caption=code_caption or "Job Executive Code Reference")
        
    # 4. Likely Follow-Up Question
    if follow_up:
        doc_style.add_callout(doc, follow_up, title="Likely Interviewer Follow-Up")
        
    # 5. Key Points to Remember
    if key_points:
        doc_style.add_body_p(doc, "Key Takeaways for Mental Recall:", bold_prefix="Takeaways: ")
        for pt in key_points:
            doc_style.add_bullet_p(doc, pt)
            
    doc.add_paragraph().paragraph_format.space_after = Pt(8)
