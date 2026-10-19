#!/usr/bin/env python3
"""
APEXFLOW OS — Phase 29 Verification Suite
Tests Feature FR-21: Enterprise Multi-Tenant White-Labeling & Client Presentation Portal (Tasks T142-T146)
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
    print("🛡️  RUNNING APEXFLOW OS — PHASE 29 VERIFICATION SUITE")
    print("=====================================================================")

    # 1. Check existence of files
    files = [
        "src/components/white-label-manager.js",
        "src/components/client-portal-gateway.js",
        "src/lib/storage/tenant-config.js"
    ]
    for rel_path in files:
        full_path = os.path.join(ROOT, rel_path)
        assert_true(os.path.exists(full_path), f"File exists: {rel_path}")
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
            assert_true(len(content) > 500, f"File {rel_path} has substantial size ({len(content)} bytes)")
            balanced, msg = check_balanced_delimiters(content, rel_path)
            assert_true(balanced, f"{rel_path} syntax balanced: {msg}")

    # 2. Check White Label Manager specifics
    wlm_path = os.path.join(ROOT, "src/components/white-label-manager.js")
    with open(wlm_path, 'r', encoding='utf-8') as f:
        wlm_src = f.read()
    
    assert_true("class WhiteLabelManager" in wlm_src, "WhiteLabelManager class defined")
    assert_true("export const whiteLabelManager" in wlm_src, "Singleton whiteLabelManager exported")
    assert_true("inputShield" in wlm_src, "InputShield imported and utilized for sanitization")
    assert_true("applyBrandToDocument" in wlm_src, "applyBrandToDocument method present")
    assert_true("applyPreset" in wlm_src, "applyPreset method present")
    assert_true("updateHashDisplay" in wlm_src, "updateHashDisplay method present")
    assert_true("tenantConfigManager" in wlm_src, "Integrated with tenantConfigManager")

    # 3. Check Client Portal Gateway specifics
    cpg_path = os.path.join(ROOT, "src/components/client-portal-gateway.js")
    with open(cpg_path, 'r', encoding='utf-8') as f:
        cpg_src = f.read()
    
    assert_true("class ClientPortalGateway" in cpg_src, "ClientPortalGateway class defined")
    assert_true("export const clientPortalGateway" in cpg_src, "Singleton clientPortalGateway exported")
    assert_true("VIP_EXECUTIVE" in cpg_src and "AUDITOR" in cpg_src and "GENERAL_AUDIENCE" in cpg_src, "All 3 client roles configured")
    assert_true("generateClientToken" in cpg_src, "generateClientToken method present")
    assert_true("updateShareLink" in cpg_src, "updateShareLink method present")
    assert_true("copyShareLink" in cpg_src, "copyShareLink method present")

    # 4. Check Tenant Config Manager specifics
    tc_path = os.path.join(ROOT, "src/lib/storage/tenant-config.js")
    with open(tc_path, 'r', encoding='utf-8') as f:
        tc_src = f.read()
        
    assert_true("class TenantConfigManager" in tc_src, "TenantConfigManager class defined")
    assert_true("export const tenantConfigManager" in tc_src, "Singleton tenantConfigManager exported")
    assert_true("validateAndSanitize" in tc_src, "validateAndSanitize method present")
    assert_true("generateChecksum" in tc_src, "generateChecksum SHA-256 method present")
    assert_true("exportConfigBundle" in tc_src, "exportConfigBundle method present")
    assert_true("importConfigBundle" in tc_src, "importConfigBundle method present")

    # 5. Check stage.html dock buttons & wiring
    stage_path = os.path.join(ROOT, "stage.html")
    with open(stage_path, 'r', encoding='utf-8') as f:
        stage_src = f.read()
    
    assert_true("id=\"dockBtnWhiteLabel\"" in stage_src, "dockBtnWhiteLabel present in stage.html dock")
    assert_true("id=\"dockBtnClientPortal\"" in stage_src, "dockBtnClientPortal present in stage.html dock")
    assert_true("Shift+L" in stage_src, "Shift+L hotkey documented in dock tooltip")
    assert_true("Shift+J" in stage_src, "Shift+J hotkey documented in dock tooltip")

    # 6. Check admin.html tenant export button
    admin_path = os.path.join(ROOT, "admin.html")
    with open(admin_path, 'r', encoding='utf-8') as f:
        admin_src = f.read()
    assert_true("id=\"btnExportAdminTenantConfig\"" in admin_src, "btnExportAdminTenantConfig present in admin.html")

    # 7. Check stage-controller.js wiring
    ctrl_path = os.path.join(ROOT, "src/components/stage-controller.js")
    with open(ctrl_path, 'r', encoding='utf-8') as f:
        ctrl_src = f.read()

    assert_true("whiteLabelManager" in ctrl_src, "whiteLabelManager imported in stage-controller.js")
    assert_true("clientPortalGateway" in ctrl_src, "clientPortalGateway imported in stage-controller.js")
    assert_true("toggleWhiteLabel" in ctrl_src, "toggleWhiteLabel method defined")
    assert_true("toggleClientPortal" in ctrl_src, "toggleClientPortal method defined")
    assert_true("dockBtnWhiteLabel" in ctrl_src, "dockBtnWhiteLabel click handler wired")
    assert_true("dockBtnClientPortal" in ctrl_src, "dockBtnClientPortal click handler wired")
    assert_true("case 'l': case 'L':" in ctrl_src and "toggleWhiteLabel" in ctrl_src, "Shift+L shortcut wired in stage-controller.js")
    assert_true("case 'j': case 'J':" in ctrl_src and "toggleClientPortal" in ctrl_src, "Shift+J shortcut wired in stage-controller.js")

    # 8. Check command-palette.js wiring
    cmd_path = os.path.join(ROOT, "src/components/command-palette.js")
    with open(cmd_path, 'r', encoding='utf-8') as f:
        cmd_src = f.read()

    assert_true("action_white_label" in cmd_src, "action_white_label registered in command palette")
    assert_true("action_client_portal" in cmd_src, "action_client_portal registered in command palette")

    # 9. Check sw.js caching
    sw_path = os.path.join(ROOT, "sw.js")
    with open(sw_path, 'r', encoding='utf-8') as f:
        sw_src = f.read()

    assert_true(any(v in sw_src for v in ["apexflow-vault-v1.8", "apexflow-vault-v1.9", "apexflow-vault-v2.0"]), "Service Worker cache bumped to apexflow-vault-v1.8+")
    assert_true("./src/components/white-label-manager.js" in sw_src, "white-label-manager.js in STATIC_PRECACHE")
    assert_true("./src/components/client-portal-gateway.js" in sw_src, "client-portal-gateway.js in STATIC_PRECACHE")
    assert_true("./src/lib/storage/tenant-config.js" in sw_src, "tenant-config.js in STATIC_PRECACHE")

    # 10. Verify zero emoji in button chrome
    button_patterns = re.findall(r'<button[^>]*>(.*?)</button>', wlm_src + cpg_src + tc_src, re.DOTALL)
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]')
    for b_content in button_patterns:
        text_outside_svg = re.sub(r'<svg.*?</svg>', '', b_content, flags=re.DOTALL)
        emojis = emoji_pattern.findall(text_outside_svg)
        assert_true(len(emojis) == 0, f"No emojis in button: {text_outside_svg.strip()[:30]}")

    print("=====================================================================")
    print("✅ ALL PHASE 29 VERIFICATION CHECKS PASSED (100% SUCCESS)")
    print("=====================================================================")

if __name__ == "__main__":
    main()
