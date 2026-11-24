import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

# Color Constants
COLOR_NAVY_HEX = "0F172A"       # Slate 900
COLOR_BLUE_HEX = "1D4ED8"       # Blue 700
COLOR_LIGHT_BG_HEX = "F8FAFC"   # Slate 50
COLOR_BORDER_HEX = "CBD5E1"     # Slate 300
COLOR_CODE_BG_HEX = "0F172A"    # Dark slate
COLOR_CODE_TEXT_HEX = "38BDF8"  # Light cyan

COLOR_NAVY = RGBColor(15, 23, 42)
COLOR_BLUE = RGBColor(29, 78, 216)
COLOR_DARK_GRAY = RGBColor(51, 65, 85)
COLOR_MUTED = RGBColor(100, 116, 139)
COLOR_WHITE = RGBColor(255, 255, 255)
COLOR_CODE = RGBColor(56, 189, 248)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_borders(cell, top=None, bottom=None, left=None, right=None):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    
    borders = {'w:top': top, 'w:bottom': bottom, 'w:left': left, 'w:right': right}
    for border_name, border_style in borders.items():
        if border_style:
            node = OxmlElement(border_name)
            node.set(qn('w:val'), border_style.get('val', 'single'))
            node.set(qn('w:sz'), str(border_style.get('sz', 4)))
            node.set(qn('w:space'), '0')
            node.set(qn('w:color'), border_style.get('color', 'CBD5E1'))
            tcBorders.append(node)
        else:
            node = OxmlElement(border_name)
            node.set(qn('w:val'), 'none')
            tcBorders.append(node)
    tcPr.append(tcBorders)

def create_document():
    doc = docx.Document()
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
    
    # Set default style font
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = COLOR_DARK_GRAY
    return doc

def add_title_block(doc, title, subtitle, author="Vivek Sahu", tag="FULL-STACK ARCHITECTURE & CODEBASE GUIDE"):
    # Decorative badge
    p_badge = doc.add_paragraph()
    p_badge.paragraph_format.space_before = Pt(12)
    p_badge.paragraph_format.space_after = Pt(4)
    run_badge = p_badge.add_run(f"★ {tag.upper()} ★")
    run_badge.font.name = 'Calibri'
    run_badge.font.size = Pt(9.5)
    run_badge.font.bold = True
    run_badge.font.color.rgb = COLOR_BLUE

    # Main Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(6)
    run_title = p_title.add_run(title)
    run_title.font.name = 'Calibri'
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_NAVY

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    run_sub = p_sub.add_run(subtitle)
    run_sub.font.name = 'Calibri'
    run_sub.font.size = Pt(12)
    run_sub.font.color.rgb = COLOR_MUTED

    # Metadata block
    table = doc.add_table(rows=1, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta = [("Author", author), ("Platform", "Job Executive Full-Stack"), ("Version", "Production v2.0 (Audited)")]
    for i, (k, v) in enumerate(meta):
        cell = table.cell(0, i)
        set_cell_background(cell, COLOR_LIGHT_BG_HEX)
        set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
        set_cell_borders(cell, 
                         top={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX},
                         bottom={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX},
                         left={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX},
                         right={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX})
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r1 = p.add_run(f"{k}: ")
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = COLOR_NAVY
        r2 = p.add_run(v)
        r2.font.size = Pt(9)
        r2.font.color.rgb = COLOR_DARK_GRAY

    doc.add_paragraph().paragraph_format.space_after = Pt(16)

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(20)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = COLOR_NAVY
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = COLOR_BLUE
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = COLOR_NAVY
    return p

def add_body_p(doc, text, bold_prefix=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = 'Calibri'
        r_bold.font.size = Pt(10.5)
        r_bold.font.bold = True
        r_bold.font.color.rgb = COLOR_NAVY
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(10.5)
    r.font.color.rgb = COLOR_DARK_GRAY
    return p

def add_bullet_p(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = 'Calibri'
        r_bold.font.size = Pt(10.5)
        r_bold.font.bold = True
        r_bold.font.color.rgb = COLOR_NAVY
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(10.5)
    r.font.color.rgb = COLOR_DARK_GRAY
    return p

def add_callout(doc, text, title="PRO-TIP / ARCHITECTURE NOTE"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, COLOR_LIGHT_BG_HEX)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=180)
    set_cell_borders(cell,
                     left={'val': 'single', 'sz': 24, 'color': COLOR_BLUE_HEX},
                     top={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX},
                     bottom={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX},
                     right={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX})
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r_title = p.add_run(f"📌 {title.upper()}\n")
    r_title.font.name = 'Calibri'
    r_title.font.bold = True
    r_title.font.size = Pt(9.5)
    r_title.font.color.rgb = COLOR_BLUE
    
    r_text = p.add_run(text)
    r_text.font.name = 'Calibri'
    r_text.font.size = Pt(10)
    r_text.font.color.rgb = COLOR_DARK_GRAY
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def add_code_block(doc, code_str, caption=None):
    if caption:
        p_cap = doc.add_paragraph()
        p_cap.paragraph_format.space_before = Pt(6)
        p_cap.paragraph_format.space_after = Pt(2)
        r_cap = p_cap.add_run(f"Source Reference: {caption}")
        r_cap.font.name = 'Consolas'
        r_cap.font.size = Pt(9)
        r_cap.font.bold = True
        r_cap.font.color.rgb = COLOR_MUTED

    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, COLOR_CODE_BG_HEX)
    set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
    set_cell_borders(cell)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.05
    run = p.add_run(code_str.strip())
    run.font.name = 'Consolas'
    run.font.size = Pt(9)
    run.font.color.rgb = COLOR_CODE
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def add_styled_table(doc, headers, rows, col_widths=None):
    tbl = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    # Header row
    hdr_row = tbl.rows[0]
    for i, header_text in enumerate(headers):
        cell = hdr_row.cells[i]
        set_cell_background(cell, COLOR_NAVY_HEX)
        set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
        set_cell_borders(cell,
                         top={'val': 'single', 'sz': 6, 'color': COLOR_NAVY_HEX},
                         bottom={'val': 'single', 'sz': 12, 'color': COLOR_BLUE_HEX},
                         left={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX},
                         right={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX})
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(header_text)
        run.font.name = 'Calibri'
        run.font.bold = True
        run.font.size = Pt(9.5)
        run.font.color.rgb = COLOR_WHITE

    # Data rows
    for r_idx, row_data in enumerate(rows):
        row = tbl.rows[r_idx + 1]
        bg = COLOR_LIGHT_BG_HEX if (r_idx % 2 == 1) else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=90, bottom=90, left=140, right=140)
            set_cell_borders(cell,
                             top={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX},
                             bottom={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX},
                             left={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX},
                             right={'val': 'single', 'sz': 4, 'color': COLOR_BORDER_HEX})
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(str(val))
            run.font.name = 'Calibri'
            run.font.size = Pt(9.5)
            run.font.color.rgb = COLOR_DARK_GRAY

    # Column widths if provided
    if col_widths:
        for row in tbl.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = Inches(width)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)
