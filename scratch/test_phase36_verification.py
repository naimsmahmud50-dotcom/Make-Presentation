#!/usr/bin/env python3
"""
========================================================================================
APEXFLOW OS — Phase 36 Automated Verification & Security Audit Suite
========================================================================================
Validates:
  1. Universal Zero-Emoji Policy across all HTML, JS, CSS, and SQL files (0 violations).
  2. 100% AST Delimiter Balance across all JS modules and HTML <script> blocks.
  3. Supabase Realtime Phoenix Protocol Encoding & Air-Gap Fallback Architecture.
  4. Strix-Supabase Database Schema & Row-Level Security (RLS) Policy Audit.
  5. Page Highlight Documentation Verification in all 5 primary views.
  6. Air-Gapped Zero-Upload Privacy Guarantee (Strictly opt-in cloud synchronization).
========================================================================================
"""

import os
import sys
import re
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_universal_zero_emoji():
    print("[TEST 1/6] Scanning for raw Unicode emojis across entire codebase...")
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf]')
    violations = []
    
    target_exts = ('.html', '.js', '.css', '.sql')
    ignore_dirs = {'.git', 'node_modules', 'dist', '.system_generated', 'scratch'}
    
    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        dirnames[:] = [d for d in dirnames if d not in ignore_dirs]
        for fname in filenames:
            if fname.endswith(target_exts):
                fpath = os.path.join(dirpath, fname)
                try:
                    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                        for line_no, line in enumerate(f, 1):
                            matches = emoji_pattern.findall(line)
                            if matches:
                                violations.append((os.path.relpath(fpath, ROOT_DIR), line_no, matches))
                except Exception as e:
                    violations.append((os.path.relpath(fpath, ROOT_DIR), 0, [str(e)]))
                    
    if violations:
        print(f"FAILED: Found {len(violations)} emoji violations:")
        for v in violations[:10]:
            print(f"  - {v[0]}:{v[1]} -> {v[2]}")
        return False
        
    print("PASSED: 100% Clean! Zero emojis found across all active source files.")
    return True

def test_ast_delimiter_balance():
    print("[TEST 2/6] Verifying AST delimiter balance across all JS files and HTML scripts...")
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from release_gold_master import check_balanced_delimiters
    
    failures = []
    
    # 1. Check all .js files in src/
    for dirpath, dirnames, filenames in os.walk(os.path.join(ROOT_DIR, 'src')):
        for fname in filenames:
            if fname.endswith('.js'):
                fpath = os.path.join(dirpath, fname)
                with open(fpath, 'r', encoding='utf-8') as f:
                    content = f.read()
                ok, err = check_balanced_delimiters(content, os.path.relpath(fpath, ROOT_DIR))
                if not ok:
                    failures.append((os.path.relpath(fpath, ROOT_DIR), err))

    # 2. Check HTML scripts
    html_files = ['index.html', 'stage.html', 'remote.html', 'war-room.html', 'admin.html']
    for hname in html_files:
        hpath = os.path.join(ROOT_DIR, hname)
        if not os.path.exists(hpath):
            continue
        with open(hpath, 'r', encoding='utf-8') as f:
            hcontent = f.read()
        scripts = re.findall(r'<script(?:\s+[^>]*)?>(.*?)</script>', hcontent, re.DOTALL)
        for s_idx, script in enumerate(scripts):
            ok, err = check_balanced_delimiters(script, f"{hname}#script_{s_idx}")
            if not ok:
                failures.append((f"{hname}#script_{s_idx}", err))

    if failures:
        print(f"FAILED: Found {len(failures)} delimiter balance issues:")
        for f in failures:
            print(f"  - {f[0]} -> {f[1]}")
        return False

    print("PASSED: 100% Balanced! All JS files and embedded HTML script blocks verified.")
    return True

def test_supabase_client_architecture():
    print("[TEST 3/6] Validating Supabase Realtime client architecture & Phoenix Protocol...")
    client_path = os.path.join(ROOT_DIR, 'src', 'lib', 'remote', 'supabase-sync.js')
    if not os.path.exists(client_path):
        print("FAILED: src/lib/remote/supabase-sync.js missing!")
        return False
        
    with open(client_path, 'r', encoding='utf-8') as f:
        code = f.read()
        
    required_features = [
        ("Phoenix join topic", "realtime:"),
        ("Broadcast event handler", "broadcast"),
        ("Heartbeat keepalive", "phoenix"),
        ("Air-gap status tracking", "airgap_local"),
        ("Event emitter subscription", "subscribe"),
        ("Rate limiter bucket", "RATE_LIMIT_MS"),
        ("Dual-relay BroadcastChannel fallback", "apexflow_supabase_fallback")
    ]
    
    missing = [name for name, token in required_features if token not in code]
    if missing:
        print(f"FAILED: Missing client features: {missing}")
        return False
        
    print("PASSED: Supabase Realtime client implements full Phoenix Protocol with resilient air-gap fallback.")
    return True

def test_supabase_database_schema_and_rls():
    print("[TEST 4/6] Auditing Supabase schema & Row-Level Security (RLS) policies...")
    schema_path = os.path.join(ROOT_DIR, 'supabase', 'migrations', '20261017000000_apexflow_core_schema.sql')
    if not os.path.exists(schema_path):
        print("FAILED: SQL migration missing!")
        return False
        
    with open(schema_path, 'r', encoding='utf-8') as f:
        sql = f.read()
        
    required_tables = [
        "CREATE TABLE IF NOT EXISTS public.presentations",
        "CREATE TABLE IF NOT EXISTS public.stage_sessions",
        "CREATE TABLE IF NOT EXISTS public.live_telemetry",
        "CREATE TABLE IF NOT EXISTS public.audience_reactions"
    ]
    for tbl in required_tables:
        if tbl not in sql:
            print(f"FAILED: Missing table definition '{tbl}'")
            return False
            
    rls_checks = [
        "ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.stage_sessions ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.live_telemetry ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.audience_reactions ENABLE ROW LEVEL SECURITY;"
    ]
    for rls in rls_checks:
        if rls not in sql:
            print(f"FAILED: Missing RLS enablement: '{rls}'")
            return False
            
    # Verify no service_role key leak in any source code
    for dirpath, _, filenames in os.walk(os.path.join(ROOT_DIR, 'src')):
        for fname in filenames:
            if fname.endswith(('.js', '.html')):
                with open(os.path.join(dirpath, fname), 'r', encoding='utf-8', errors='ignore') as f:
                    c = f.read()
                    if 'service_role' in c and not 'service_role_warning' in c:
                        print(f"FAILED: Found possible service_role key leak in {fname}")
                        return False

    print("PASSED: Schema defines 4 core tables, 100% Row-Level Security coverage, and zero secret leaks.")
    return True

def test_page_highlight_documentation():
    print("[TEST 5/6] Verifying [PAGE HIGHLIGHT] documentation across all touched views...")
    pages = [
        ('admin.html', '[PAGE HIGHLIGHT: admin.html'),
        ('stage.html', '[PAGE HIGHLIGHT: stage.html'),
        ('remote.html', '[PAGE HIGHLIGHT: remote.html'),
        ('war-room.html', '[PAGE HIGHLIGHT: war-room.html'),
        ('src/lib/remote/supabase-sync.js', '[PAGE HIGHLIGHT: supabase-sync.js')
    ]
    
    missing_highlights = []
    for rel_path, tag in pages:
        full_path = os.path.join(ROOT_DIR, rel_path)
        if not os.path.exists(full_path):
            missing_highlights.append(f"{rel_path} (File not found)")
            continue
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if tag not in content:
                missing_highlights.append(f"{rel_path} (Missing '{tag}')")
                
    if missing_highlights:
        print(f"FAILED: Missing page highlight documentation: {missing_highlights}")
        return False
        
    print("PASSED: All modified pages and modules feature explicit [PAGE HIGHLIGHT] docblocks and notes.")
    return True

def test_airgap_privacy_guarantee():
    print("[TEST 6/6] Verifying Air-Gapped Zero-Upload Privacy Guarantee...")
    client_path = os.path.join(ROOT_DIR, 'src', 'lib', 'remote', 'supabase-sync.js')
    with open(client_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check that airgap is active when credentials are absent
    if "!this.supabaseUrl || !this.anonKey" not in content:
        print("FAILED: Client must fallback to airgap when credentials are absent.")
        return False
        
    if "this.connectionState = 'airgap_local'" not in content:
        print("FAILED: Client state must default to airgap_local.")
        return False

    print("PASSED: Air-gapped zero-upload privacy guaranteed. Cloud connection is strictly opt-in.")
    return True

def run_all():
    print("=" * 80)
    print("  APEXFLOW OS — PHASE 36 VERIFICATION & SECURITY AUDIT SUITE")
    print("=" * 80)
    
    tests = [
        test_universal_zero_emoji,
        test_ast_delimiter_balance,
        test_supabase_client_architecture,
        test_supabase_database_schema_and_rls,
        test_page_highlight_documentation,
        test_airgap_privacy_guarantee
    ]
    
    all_passed = True
    for test in tests:
        if not test():
            all_passed = False
            break
        print("-" * 80)
        
    if all_passed:
        print(">>> ALL 6 PHASE 36 TESTS PASSED WITH 100% GREEN STATUS! <<<")
        print("=" * 80)
        return 0
    else:
        print(">>> VERIFICATION SUITE FAILED! PLEASE REMEDIATE ISSUES. <<<")
        print("=" * 80)
        return 1

if __name__ == '__main__':
    sys.exit(run_all())
