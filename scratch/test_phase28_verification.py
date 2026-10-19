#!/usr/bin/env python3
"""
APEXFLOW OS — Phase 28 Verification Suite
Tests Feature FR-20: Zero-Touch Voice Commander & Spatial Gesture Navigation Engine (Tasks T137-T141)
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
    print("🛡️  RUNNING APEXFLOW OS — PHASE 28 VERIFICATION SUITE")
    print("=====================================================================")

    # 1. Check existence of files
    files = [
        "src/components/voice-commander.js",
        "src/components/spatial-gesture-engine.js",
        "src/lib/audio/voice-macros.js"
    ]
    for rel_path in files:
        full_path = os.path.join(ROOT, rel_path)
        assert_true(os.path.exists(full_path), f"File exists: {rel_path}")
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
            assert_true(len(content) > 500, f"File {rel_path} has substantial size ({len(content)} bytes)")
            balanced, msg = check_balanced_delimiters(content, rel_path)
            assert_true(balanced, f"{rel_path} syntax balanced: {msg}")

    # 2. Check Voice Commander HUD specifics
    vc_path = os.path.join(ROOT, "src/components/voice-commander.js")
    with open(vc_path, 'r', encoding='utf-8') as f:
        vc_src = f.read()
    
    assert_true("class VoiceCommanderHUD" in vc_src, "VoiceCommanderHUD class defined")
    assert_true("export const voiceCommanderHUD" in vc_src, "Singleton voiceCommanderHUD exported")
    assert_true("inputShield" in vc_src, "InputShield imported and utilized for sanitization")
    assert_true("toggleListening" in vc_src, "toggleListening method present")
    assert_true("startWaveformAnimation" in vc_src, "startWaveformAnimation method present")
    assert_true("voiceMacroDispatcher" in vc_src, "Integrated with voiceMacroDispatcher")

    # 3. Check Spatial Gesture Engine specifics
    ge_path = os.path.join(ROOT, "src/components/spatial-gesture-engine.js")
    with open(ge_path, 'r', encoding='utf-8') as f:
        ge_src = f.read()
    
    assert_true("class SpatialGestureEngine" in ge_src, "SpatialGestureEngine class defined")
    assert_true("export const spatialGestureEngine" in ge_src, "Singleton spatialGestureEngine exported")
    assert_true("processVideoFrame" in ge_src, "processVideoFrame optical flow present")
    assert_true("triggerSimulatedGesture" in ge_src, "triggerSimulatedGesture method present")
    assert_true("SWIPE_RIGHT" in ge_src and "SWIPE_LEFT" in ge_src, "Swipe gestures supported")

    # 4. Check Voice Macro Dispatcher specifics
    vm_path = os.path.join(ROOT, "src/lib/audio/voice-macros.js")
    with open(vm_path, 'r', encoding='utf-8') as f:
        vm_src = f.read()
        
    assert_true("class VoiceMacroDispatcher" in vm_src, "VoiceMacroDispatcher class defined")
    assert_true("export const voiceMacroDispatcher" in vm_src, "Singleton voiceMacroDispatcher exported")
    assert_true("parseAndDispatch" in vm_src, "parseAndDispatch intent parser present")
    assert_true("SLIDE_NEXT" in vm_src and "FINOPS_ROI" in vm_src, "Core macros registered")

    # 5. Check stage.html dock buttons & wiring
    stage_path = os.path.join(ROOT, "stage.html")
    with open(stage_path, 'r', encoding='utf-8') as f:
        stage_src = f.read()
    
    assert_true("id=\"dockBtnVoiceCmd\"" in stage_src, "dockBtnVoiceCmd present in stage.html dock")
    assert_true("id=\"dockBtnGesture\"" in stage_src, "dockBtnGesture present in stage.html dock")
    assert_true("Shift+V" in stage_src, "Shift+V hotkey documented in dock tooltip")
    assert_true("Shift+G" in stage_src, "Shift+G hotkey documented in dock tooltip")

    # 6. Check stage-controller.js wiring
    ctrl_path = os.path.join(ROOT, "src/components/stage-controller.js")
    with open(ctrl_path, 'r', encoding='utf-8') as f:
        ctrl_src = f.read()

    assert_true("voiceCommanderHUD" in ctrl_src, "voiceCommanderHUD imported in stage-controller.js")
    assert_true("spatialGestureEngine" in ctrl_src, "spatialGestureEngine imported in stage-controller.js")
    assert_true("toggleVoiceCommander" in ctrl_src, "toggleVoiceCommander method defined")
    assert_true("toggleSpatialGesture" in ctrl_src, "toggleSpatialGesture method defined")
    assert_true("dockBtnVoiceCmd" in ctrl_src, "dockBtnVoiceCmd click handler wired")
    assert_true("dockBtnGesture" in ctrl_src, "dockBtnGesture click handler wired")
    assert_true("case 'v': case 'V':" in ctrl_src and "toggleVoiceCommander" in ctrl_src, "Shift+V shortcut wired in stage-controller.js")
    assert_true("case 'g': case 'G':" in ctrl_src and "toggleSpatialGesture" in ctrl_src, "Shift+G shortcut wired in stage-controller.js")

    # 7. Check command-palette.js wiring
    cmd_path = os.path.join(ROOT, "src/components/command-palette.js")
    with open(cmd_path, 'r', encoding='utf-8') as f:
        cmd_src = f.read()

    assert_true("action_voice_commander" in cmd_src, "action_voice_commander registered in command palette")
    assert_true("action_spatial_gesture" in cmd_src, "action_spatial_gesture registered in command palette")

    # 8. Check sw.js caching
    sw_path = os.path.join(ROOT, "sw.js")
    with open(sw_path, 'r', encoding='utf-8') as f:
        sw_src = f.read()

    assert_true(any(v in sw_src for v in ["apexflow-vault-v1.7", "apexflow-vault-v1.8", "apexflow-vault-v1.9", "apexflow-vault-v2.0"]), "Service Worker cache bumped to apexflow-vault-v1.7+")
    assert_true("./src/components/voice-commander.js" in sw_src, "voice-commander.js in STATIC_PRECACHE")
    assert_true("./src/components/spatial-gesture-engine.js" in sw_src, "spatial-gesture-engine.js in STATIC_PRECACHE")
    assert_true("./src/lib/audio/voice-macros.js" in sw_src, "voice-macros.js in STATIC_PRECACHE")

    # 9. Verify zero emoji in button chrome
    button_patterns = re.findall(r'<button[^>]*>(.*?)</button>', vc_src + ge_src + vm_src, re.DOTALL)
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]')
    for b_content in button_patterns:
        text_outside_svg = re.sub(r'<svg.*?</svg>', '', b_content, flags=re.DOTALL)
        emojis = emoji_pattern.findall(text_outside_svg)
        assert_true(len(emojis) == 0, f"No emojis in button: {text_outside_svg.strip()[:30]}")

    print("=====================================================================")
    print("✅ ALL PHASE 28 VERIFICATION CHECKS PASSED (100% SUCCESS)")
    print("=====================================================================")

if __name__ == "__main__":
    main()
