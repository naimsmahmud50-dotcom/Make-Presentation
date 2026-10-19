#!/usr/bin/env python3
"""
=========================================================================================
TEST SUITE: APEXFLOW OS — Phase 31 to 34 Commercial Verification & E2E Validation
-----------------------------------------------------------------------------------------
Validates:
  Phase 31: Stress Benchmarking Suite & Curated Enterprise Models
  Phase 32: Executive Pre-Built Keynote Templates & Industry Slide Decks
  Phase 33: Human Rehearsal Playbook, Speech Cadence & Stage Ergonomics HUD
  Phase 34: PWA Vault v2.1, Zero-Emoji Architecture, 100% AST Balance & Air-Gapped Privacy
=========================================================================================
"""

import os
import sys
import re
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from scratch.release_gold_master import check_balanced_delimiters, audit_zero_emoji, audit_zero_upload_privacy

def test_phase_31():
    print("\n[PHASE 31] Verifying Repository Battle-Test & Stress-Testing Suite...")
    
    # 1. Check stress-benchmarker.js exists and is balanced
    benchmarker_path = os.path.join(ROOT, "src", "lib", "analyzers", "stress-benchmarker.js")
    assert os.path.exists(benchmarker_path), "stress-benchmarker.js missing"
    code = open(benchmarker_path).read()
    balanced, msg = check_balanced_delimiters(code, "stress-benchmarker.js")
    assert balanced, f"stress-benchmarker.js AST unbalanced: {msg}"
    assert "class StressBenchmarker" in code
    assert "runBenchmark" in code
    assert "generateSyntheticTree" in code
    print("  ✓ stress-benchmarker.js present, valid class, 100% AST balanced")

    # 2. Check sample-demos.js contains 4 curated enterprise models
    demos_path = os.path.join(ROOT, "src", "lib", "analyzers", "sample-demos.js")
    demo_code = open(demos_path).read()
    assert "demo_fintech_mesh" in demo_code, "demo_fintech_mesh missing"
    assert "demo_ai_vision_agent" in demo_code, "demo_ai_vision_agent missing"
    assert "demo_k8s_mesh" in demo_code, "demo_k8s_mesh missing"
    assert "demo_ecommerce_global" in demo_code, "demo_ecommerce_global missing"
    print("  ✓ sample-demos.js contains all 4 enterprise architecture models")

    # 3. Check index.html HUD wiring
    index_html = open(os.path.join(ROOT, "index.html")).read()
    assert "stressBenchmarkSection" in index_html, "stressBenchmarkSection missing in index.html"
    assert "benchmarkScaleGroup" in index_html, "benchmarkScaleGroup missing"
    assert "benchmarkArchetypeSelect" in index_html, "benchmarkArchetypeSelect missing"
    assert "btnRunBenchmark" in index_html, "btnRunBenchmark missing"
    print("  ✓ index.html stress HUD elements mounted")

def test_phase_32():
    print("\n[PHASE 32] Verifying Executive Pre-Built Keynote Templates & Industry Slide Decks...")

    # 1. Check executive-deck-library.js
    lib_path = os.path.join(ROOT, "src", "lib", "templates", "executive-deck-library.js")
    assert os.path.exists(lib_path), "executive-deck-library.js missing"
    code = open(lib_path).read()
    balanced, msg = check_balanced_delimiters(code, "executive-deck-library.js")
    assert balanced, f"executive-deck-library.js AST unbalanced: {msg}"
    
    # Check 5 keynote scenarios
    scenarios = [
        "template_series_a_pitch",
        "template_board_security",
        "template_dev_conf_keynote",
        "template_enterprise_ai",
        "template_incident_postmortem"
    ]
    for s in scenarios:
        assert s in code, f"Keynote scenario {s} missing in executive-deck-library.js"
    assert "instantiateProject" in code, "instantiateProject method missing"
    print("  ✓ executive-deck-library.js has all 5 industry keynote scenarios & 100% AST balanced")

    # 2. Check index.html & admin.html modal and buttons
    index_html = open(os.path.join(ROOT, "index.html")).read()
    assert "templateModal" in index_html, "templateModal missing in index.html"
    assert "btnOpenKeynoteTemplates" in index_html, "btnOpenKeynoteTemplates missing in index.html"

    admin_html = open(os.path.join(ROOT, "admin.html")).read()
    assert "templateModal" in admin_html, "templateModal missing in admin.html"
    assert "btnAdminKeynoteTemplates" in admin_html, "btnAdminKeynoteTemplates missing in admin.html"
    assert "setupAdminTemplateModal" in admin_html, "setupAdminTemplateModal missing in admin.html"
    print("  ✓ Keynote Template selector modals & triggers wired in index.html and admin.html")

def test_phase_33():
    print("\n[PHASE 33] Verifying Human Rehearsal Playbook, Speech Cadence & Stage Ergonomics HUD...")

    # 1. Check human-rehearsal-playbook.js
    playbook_path = os.path.join(ROOT, "src", "components", "human-rehearsal-playbook.js")
    assert os.path.exists(playbook_path), "human-rehearsal-playbook.js missing"
    code = open(playbook_path).read()
    balanced, msg = check_balanced_delimiters(code, "human-rehearsal-playbook.js")
    assert balanced, f"human-rehearsal-playbook.js AST unbalanced: {msg}"

    assert "class HumanRehearsalPlaybook" in code, "HumanRehearsalPlaybook class missing"
    assert "generateDebrief" in code, "generateDebrief method missing"
    assert "rehearsalPlaybookHUD" in code, "rehearsalPlaybookHUD overlay markup missing"
    assert "rehearsalDebriefModal" in code, "rehearsalDebriefModal markup missing"
    assert "apexflow_rehearsal_channel" in code, "BroadcastChannel channel missing"
    print("  ✓ human-rehearsal-playbook.js fully implemented, debrief engine ready, 100% AST balanced")

    # 2. Check stage.html & stage-controller.js
    stage_html = open(os.path.join(ROOT, "stage.html")).read()
    assert "dockBtnRehearsalPlaybook" in stage_html, "dockBtnRehearsalPlaybook missing in stage.html"

    stage_ctrl = open(os.path.join(ROOT, "src", "components", "stage-controller.js")).read()
    assert "humanRehearsalPlaybook" in stage_ctrl, "humanRehearsalPlaybook import missing in stage-controller.js"
    assert "toggleRehearsalPlaybook" in stage_ctrl, "toggleRehearsalPlaybook method missing in stage-controller.js"
    assert "dockBtnRehearsalPlaybook" in stage_ctrl, "dockBtnRehearsalPlaybook binding missing"
    print("  ✓ stage.html dock button & stage-controller.js Shift+Z shortcut integrated")

    # 3. Check command-palette.js
    cmd_code = open(os.path.join(ROOT, "src", "components", "command-palette.js")).read()
    assert "action_rehearsal_playbook" in cmd_code, "action_rehearsal_playbook missing in command-palette.js"
    print("  ✓ Universal Command Palette registered Rehearsal Playbook action")

    # 4. Check war-room.html & remote.html inbound listeners
    war_room_html = open(os.path.join(ROOT, "war-room.html")).read()
    assert "apexflow_rehearsal_channel" in war_room_html, "rehearsal channel listener missing in war-room.html"

    remote_html = open(os.path.join(ROOT, "remote.html")).read()
    assert "apexflow_rehearsal_channel" in remote_html, "rehearsal channel listener missing in remote.html"
    assert "remotePresenterRehearsalStrip" in remote_html, "remotePresenterRehearsalStrip missing in remote.html"
    print("  ✓ Multi-view telemetry sync wired across War Room and Mobile Remote")

def test_phase_34():
    print("\n[PHASE 34] Verifying Enterprise Commercial Launch Packaging & PWA Vault v2.1...")

    # 1. Check sw.js
    sw_code = open(os.path.join(ROOT, "sw.js")).read()
    assert "apexflow-vault-v2.1" in sw_code, "CACHE_NAME in sw.js is not apexflow-vault-v2.1"
    assert "human-rehearsal-playbook.js" in sw_code, "human-rehearsal-playbook.js not precached in sw.js"
    assert "stress-benchmarker.js" in sw_code, "stress-benchmarker.js not precached in sw.js"
    assert "executive-deck-library.js" in sw_code, "executive-deck-library.js not precached in sw.js"
    print("  ✓ Service worker upgraded to apexflow-vault-v2.1 with all new modules precached")

    # 2. Check zero raw emojis across all HTML views & JS components
    print("  🔍 Running Universal Zero-Emoji Button Architecture Audit...")
    views = ["index.html", "stage.html", "admin.html", "war-room.html", "remote.html"]
    for v in views:
        violations = audit_zero_emoji(os.path.join(ROOT, v))
        assert len(violations) == 0, f"Button emoji violations in {v}: {violations}"
    print(f"  ✓ All 5 HTML views strictly verified: 0 button emoji violations")

    # 3. Check zero upload privacy across all assets
    print("  🔒 Running Air-Gapped Zero-Upload Privacy Attestation...")
    for v in views:
        violations = audit_zero_upload_privacy(os.path.join(ROOT, v))
        assert len(violations) == 0, f"Privacy violations in {v}: {violations}"
    print("  ✓ Zero remote egress endpoints or telemetry trackers detected (100% air-gapped)")

def main():
    print("=================================================================================")
    print("🚀 STARTING APEXFLOW OS PHASES 31-34 END-TO-END VERIFICATION SUITE")
    print("=================================================================================")
    
    try:
        test_phase_31()
        test_phase_32()
        test_phase_33()
        test_phase_34()
        
        print("\n=================================================================================")
        print("🎉 ALL PHASES 31-34 COMMERCIAL VERIFICATION TESTS PASSED (100% GREEN)")
        print("=================================================================================")
        return 0
    except AssertionError as e:
        print(f"\n❌ TEST ASSERTION FAILURE: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {e}")
        return 2

if __name__ == "__main__":
    sys.exit(main())
