import os
import sys
sys.path.append(os.path.dirname(__file__))

import doc_style
from qa_section_a import add_section_a
from qa_section_b import add_section_b
from qa_section_c import add_section_c
from qa_section_d import add_section_d
from qa_section_e import add_section_e
from qa_section_f import add_section_f
from qa_section_g import add_section_g
from qa_section_h import add_section_h
from qa_section_i import add_section_i

def generate_document_2():
    doc = doc_style.create_document()

    # Title Block
    doc_style.add_title_block(
        doc,
        title="Job Executive — Full-Stack Technical Interview Master Question & Answer Bank",
        subtitle="120 In-Depth Technical, Architecture, Scenario, and Practical Coding Interview Questions & Answers based strictly on the production codebase.",
        author="Vivek Sahu",
        tag="120 PRODUCTION TECHNICAL INTERVIEW QUESTIONS & ANSWERS"
    )

    doc_style.add_body_p(
        doc,
        "This master interview preparation guide contains 120 rigorous, highly structured interview questions spanning 9 technical domains. Every single question reflects the actual architecture, code files, database schemas, security configurations, and genuine challenges of the Job Executive full-stack recruitment platform.\n\n"
        "Each question follows a standardized, interview-tested 5-part structure:\n"
        "1. Direct Answer: A crisp 2-4 sentence summary suitable for immediate delivery.\n"
        "2. In-Depth Technical Explanation: Detailed architectural mechanics, trade-offs, and design principles.\n"
        "3. Job Executive Code Reference: Concrete code snippets and file paths from the real codebase.\n"
        "4. Likely Interviewer Follow-Up: The exact follow-up question senior interviewers will ask next.\n"
        "5. Key Takeaways: High-impact bullet points for instant mental recall."
    )

    # ---------------------------------------------------------------------------
    # SECTION A
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "Section A: Project Overview & High-Level Architecture (Q1 – Q12)")
    add_section_a(doc)

    # ---------------------------------------------------------------------------
    # SECTION B
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "Section B: Frontend & React 19 Engineering (Q13 – Q27)")
    add_section_b(doc)

    # ---------------------------------------------------------------------------
    # SECTION C
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "Section C: Backend, Express 5 & Node.js Runtime (Q28 – Q43)")
    add_section_c(doc)

    # ---------------------------------------------------------------------------
    # SECTION D
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "Section D: Database Engineering & MongoDB / Mongoose (Q44 – Q59)")
    add_section_d(doc)

    # ---------------------------------------------------------------------------
    # SECTION E
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "Section E: Authentication, Authorization & Security Hardening (Q60 – Q75)")
    add_section_e(doc)

    # ---------------------------------------------------------------------------
    # SECTION F
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "Section F: Feature-Specific Engineering & AI Integration (Q76 – Q88)")
    add_section_f(doc)

    # ---------------------------------------------------------------------------
    # SECTION G
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "Section G: Realistic System Scenarios & Troubleshooting (Q89 – Q100)")
    add_section_g(doc)

    # ---------------------------------------------------------------------------
    # SECTION H
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "Section H: Practical Coding & Database Querying (Q101 – Q110)")
    add_section_h(doc)

    # ---------------------------------------------------------------------------
    # SECTION I
    # ---------------------------------------------------------------------------
    doc_style.add_heading_1(doc, "Section I: HR, Behavioral & Engineering Ownership (Q111 – Q120)")
    add_section_i(doc)

    # Save Document
    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs", "Job_Executive_Interview_Questions_and_Answers.docx"))
    doc.save(output_path)
    print(f"✅ Successfully generated Document 2: {output_path}")

if __name__ == "__main__":
    generate_document_2()
