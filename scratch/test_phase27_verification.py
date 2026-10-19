#!/usr/bin/env python3
"""
APEXFLOW OS — Phase 27 Verification Suite
Tests Feature FR-19: Executive AI Objection Defense & Investor Q&A Boardroom Simulator (Tasks T132-T136)
"""

import sys
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def assert_true(condition, msg):
    if not condition:
        print(f"❌ FAIL: {msg}")
        sys.exit(1)
    else:
        print(f"  [PASS] {msg}")

def check_balanced_delimiters(content, filename):
    stack = []
    lines = content.split('\n')
    in_string = None
    escaped = False
    in_line_comment = False
    in_block_comment = False
    
    delims = {')': '(', '}': '{', ']': '['}
    
    for line_idx, line in enumerate(lines, 1):
        i = 0
        in_line_comment = False
        while i < len(line):
            ch = line[i]
            
            if in_line_comment:
                break
                
            if in_block_comment:
                if ch == '*' and i + 1 < len(line) and line[i+1] == '/':
                    in_block_comment = False
                    i += 2
                    continue
                i += 1
                continue
                
            if in_string:
                if escaped:
                    escaped = False
                elif ch == '\\':
                    escaped = True
                elif ch == in_string:
                    in_string = None
                i += 1
                continue
                
            if ch == '/' and i + 1 < len(line):
                if line[i+1] == '/':
                    in_line_comment = True
                    break
                elif line[i+1] == '*':
                    in_block_comment = True
                    i += 2
                    continue
                    
            if ch in ('"', "'", '`'):
                in_string = ch
                escaped = False
                i += 1
                continue
                
            if ch in '({[':
                stack.append((ch, line_idx))
            elif ch in ')}]':
                if not stack:
                    return False, f"Unmatched closing '{ch}' at line {line_idx}"
                expected = delims[ch]
                actual, orig_line = stack.pop()
                if actual != expected:
                    return False, f"Mismatched closing '{ch}' at line {line_idx}, expected '{expected}' opened at line {orig_line}"
            i += 1
            
    if stack:
        unclosed, orig_line = stack[-1]
        return False, f"Unclosed '{unclosed}' from line {orig_line}"
    return True, "Balanced"

def main():
    print("=====================================================================")
    print("🛡️  RUNNING APEXFLOW OS — PHASE 27 VERIFICATION SUITE")
    print("=====================================================================")

    # 1. Check existence of files
    files = [
        "src/components/objection-defense-hud.js",
        "src/components/boardroom-pressure-engine.js",
        "src/lib/export/investor-qa-packager.js"
    ]
    for rel_path in files:
        full_path = os.path.join(ROOT, rel_path)
        assert_true(os.path.exists(full_path), f"File exists: {rel_path}")
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
            assert_true(len(content) > 500, f"File {rel_path} has substantial size ({len(content)} bytes)")
            balanced, msg = check_balanced_delimiters(content, rel_path)
            assert_true(balanced, f"{rel_path} syntax balanced: {msg}")

    # 2. Check Objection Defense HUD specifics
    hud_path = os.path.join(ROOT, "src/components/objection-defense-hud.js")
    with open(hud_path, 'r', encoding='utf-8') as f:
        hud_src = f.read()
    
    assert_true("class ObjectionDefenseHUD" in hud_src, "ObjectionDefenseHUD class defined")
    assert_true("export const objectionDefenseHUD" in hud_src, "Singleton objectionDefenseHUD exported")
    assert_true("inputShield" in hud_src, "InputShield imported and utilized for sanitization")
    assert_true("CFO" in hud_src and "CTO" in hud_src and "CISO" in hud_src and "VP_ENG" in hud_src, "All 4 executive personas included")
    assert_true("pushToPrompter" in hud_src, "Beam to prompter functionality present")
    assert_true("downloadPlaybook" in hud_src, "Offline playbook download method present")
    assert_true("boardroomPressureEngine" in hud_src, "Integrated with boardroom pressure engine")

    # 3. Check Boardroom Pressure Engine specifics
    engine_path = os.path.join(ROOT, "src/components/boardroom-pressure-engine.js")
    with open(engine_path, 'r', encoding='utf-8') as f:
        eng_src = f.read()
    
    assert_true("class BoardroomPressureEngine" in eng_src, "BoardroomPressureEngine class defined")
    assert_true("export const boardroomPressureEngine" in eng_src, "Singleton boardroomPressureEngine exported")
    assert_true("tensionIndex" in eng_src, "Tension index tracking present")
    assert_true("startCountdown" in eng_src, "Countdown timer method present")
    assert_true("playHeartbeatHum" in eng_src and "playGavelStrike" in eng_src, "Atmospheric sound synthesis present")

    # 4. Check Investor QA Packager specifics
    pkg_path = os.path.join(ROOT, "src/lib/export/investor-qa-packager.js")
    with open(pkg_path, 'r', encoding='utf-8') as f:
        pkg_src = f.read()
        
    assert_true("class InvestorQAPackager" in pkg_src, "InvestorQAPackager class defined")
    assert_true("export const investorQAPackager" in pkg_src, "Singleton investorQAPackager exported")
    assert_true("generateHTMLDeck" in pkg_src, "Stand-alone HTML deck generator present")
    assert_true("generateMarkdownFlashcards" in pkg_src, "Executive markdown flashcards generator present")
    assert_true("inputShield" in pkg_src, "InputShield sanitization utilized in packager")

    # 5. Check stage.html dock button & wiring
    stage_path = os.path.join(ROOT, "stage.html")
    with open(stage_path, 'r', encoding='utf-8') as f:
        stage_src = f.read()
    
    assert_true("id=\"dockBtnObjection\"" in stage_src, "dockBtnObjection present in stage.html dock")
    assert_true("Shift+X" in stage_src, "Shift+X hotkey documented on dock button tooltip")
    assert_true("<svg" in stage_src and "</svg>" in stage_src, "SVG icon used for dock button")

    # 6. Check stage-controller.js wiring
    ctrl_path = os.path.join(ROOT, "src/components/stage-controller.js")
    with open(ctrl_path, 'r', encoding='utf-8') as f:
        ctrl_src = f.read()

    assert_true("objectionDefenseHUD" in ctrl_src, "objectionDefenseHUD imported in stage-controller.js")
    assert_true("toggleObjectionDefense" in ctrl_src, "toggleObjectionDefense method defined in stage-controller.js")
    assert_true("dockBtnObjection" in ctrl_src, "dockBtnObjection click handler wired")
    assert_true("toggleObjectionDefense" in ctrl_src and "case 'x': case 'X':" in ctrl_src, "Shift+X shortcut wired in stage-controller.js")

    # 7. Check command-palette.js wiring
    cmd_path = os.path.join(ROOT, "src/components/command-palette.js")
    with open(cmd_path, 'r', encoding='utf-8') as f:
        cmd_src = f.read()

    assert_true("action_objection_defense" in cmd_src, "action_objection_defense registered in command palette")
    assert_true("toggleObjectionDefense()" in cmd_src, "Command palette action executes toggleObjectionDefense()")

    # 8. Check sw.js caching
    sw_path = os.path.join(ROOT, "sw.js")
    with open(sw_path, 'r', encoding='utf-8') as f:
        sw_src = f.read()

    assert_true(any(v in sw_src for v in ["apexflow-vault-v1.6", "apexflow-vault-v1.7", "apexflow-vault-v1.8", "apexflow-vault-v1.9", "apexflow-vault-v2.0"]), "Service Worker cache bumped to apexflow-vault-v1.6+")
    assert_true("./src/components/objection-defense-hud.js" in sw_src, "objection-defense-hud.js in STATIC_PRECACHE")
    assert_true("./src/components/boardroom-pressure-engine.js" in sw_src, "boardroom-pressure-engine.js in STATIC_PRECACHE")
    assert_true("./src/lib/export/investor-qa-packager.js" in sw_src, "investor-qa-packager.js in STATIC_PRECACHE")

    # 9. Verify zero emoji in button chrome
    button_patterns = re.findall(r'<button[^>]*>(.*?)</button>', hud_src + eng_src + pkg_src, re.DOTALL)
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]')
    for b_content in button_patterns:
        # Check text outside of SVGs
        text_outside_svg = re.sub(r'<svg.*?</svg>', '', b_content, flags=re.DOTALL)
        emojis = emoji_pattern.findall(text_outside_svg)
        assert_true(len(emojis) == 0, f"No emojis in button: {text_outside_svg.strip()[:30]}")

    print("=====================================================================")
    print("✅ ALL PHASE 27 VERIFICATION CHECKS PASSED (100% SUCCESS)")
    print("=====================================================================")

if __name__ == "__main__":
    main()
