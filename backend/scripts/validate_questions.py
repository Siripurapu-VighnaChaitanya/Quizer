"""
Question Bank Validation Script for ExamPrep Hub.
Validates structural schema, unique IDs, options, answer keys, explanations,
and difficulty distribution across all 10 starter topics (target: exactly 200 MCQs).
"""

import json
import os
import sys
from pathlib import Path
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "app" / "data"
MANIFEST_PATH = DATA_DIR / "manifest.json"

REQUIRED_TOPICS = [
    ("mathematics", "percentages"),
    ("mathematics", "ratio_and_proportion"),
    ("mathematics", "time_and_work"),
    ("reasoning", "number_series"),
    ("reasoning", "blood_relations"),
    ("reasoning", "direction_sense"),
    ("indian_polity", "fundamental_rights"),
    ("indian_polity", "parliament_and_lawmaking"),
    ("general_science", "physics_fundamentals"),
    ("general_science", "biology_fundamentals"),
]


def validate_question_bank(strict_distribution: bool = True):
    report = {
        "is_valid": True,
        "total_questions": 0,
        "topics_found": 0,
        "topic_counts": {},
        "difficulty_distribution": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
        "errors": [],
        "warnings": [],
        "verified_count": 0,
    }

    if not MANIFEST_PATH.exists():
        report["is_valid"] = False
        report["errors"].append(f"Manifest not found at {MANIFEST_PATH}")
        return report

    try:
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    except Exception as e:
        report["is_valid"] = False
        report["errors"].append(f"Failed to parse manifest.json: {e}")
        return report

    all_ids = set()
    normalized_questions = {}

    for subject_id, topic_id in REQUIRED_TOPICS:
        filename = f"{subject_id}/{topic_id}.json"
        filepath = DATA_DIR / filename
        if not filepath.exists():
            report["is_valid"] = False
            report["errors"].append(f"Missing file for starter topic: {filename}")
            continue

        report["topics_found"] += 1
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                questions = json.load(f)
        except Exception as e:
            report["is_valid"] = False
            report["errors"].append(f"JSON syntax error in {filename}: {e}")
            continue

        if not isinstance(questions, list):
            report["is_valid"] = False
            report["errors"].append(f"Expected list of questions in {filename}")
            continue

        topic_key = f"{subject_id}/{topic_id}"
        report["topic_counts"][topic_key] = len(questions)
        topic_diff_counts = Counter()

        for idx, q in enumerate(questions):
            q_ref = f"{filename} [index {idx}, id={q.get('id', 'MISSING')}]"
            report["total_questions"] += 1

            # ID validation
            qid = q.get("id")
            if not qid or not isinstance(qid, str):
                report["is_valid"] = False
                report["errors"].append(f"{q_ref}: Missing or non-string 'id'")
            elif qid in all_ids:
                report["is_valid"] = False
                report["errors"].append(f"{q_ref}: Duplicate ID '{qid}' found")
            else:
                all_ids.add(qid)

            # Subject & topic match
            if q.get("subject") != subject_id:
                report["is_valid"] = False
                report["errors"].append(f"{q_ref}: 'subject' expected '{subject_id}', got '{q.get('subject')}'")
            if q.get("topic") != topic_id:
                report["is_valid"] = False
                report["errors"].append(f"{q_ref}: 'topic' expected '{topic_id}', got '{q.get('topic')}'")

            # Difficulty validation
            diff = q.get("difficulty")
            if diff not in [1, 2, 3, 4, 5]:
                report["is_valid"] = False
                report["errors"].append(f"{q_ref}: Invalid difficulty '{diff}'. Must be 1-5.")
            else:
                topic_diff_counts[diff] += 1
                report["difficulty_distribution"][diff] += 1

            # Question text
            q_text = q.get("question")
            if not q_text or not isinstance(q_text, str) or len(q_text.strip()) < 5:
                report["is_valid"] = False
                report["errors"].append(f"{q_ref}: Invalid or empty 'question' text")
            else:
                # Check for duplicate questions
                norm_q = " ".join(q_text.strip().lower().split())
                if norm_q in normalized_questions:
                    report["warnings"].append(
                        f"Potential duplicate question: '{qid}' closely resembles '{normalized_questions[norm_q]}'"
                    )
                else:
                    normalized_questions[norm_q] = qid

            # Options validation
            options = q.get("options")
            if not isinstance(options, list) or len(options) != 4:
                report["is_valid"] = False
                report["errors"].append(f"{q_ref}: Must have exactly 4 options, found {len(options) if isinstance(options, list) else 0}")
            else:
                opt_ids = [opt.get("id") for opt in options if isinstance(opt, dict)]
                if opt_ids != ["A", "B", "C", "D"]:
                    report["is_valid"] = False
                    report["errors"].append(f"{q_ref}: Options IDs must be ['A', 'B', 'C', 'D'], got {opt_ids}")
                opt_texts = [opt.get("text", "").strip() for opt in options if isinstance(opt, dict)]
                if any(len(t) == 0 for t in opt_texts):
                    report["is_valid"] = False
                    report["errors"].append(f"{q_ref}: One or more options has empty text")
                if len(set(opt_texts)) != 4:
                    report["is_valid"] = False
                    report["errors"].append(f"{q_ref}: Duplicate option texts detected in {opt_texts}")

            # Correct option validation
            corr = q.get("correct_option")
            if corr not in ["A", "B", "C", "D"]:
                report["is_valid"] = False
                report["errors"].append(f"{q_ref}: Invalid 'correct_option' '{corr}'. Must be A, B, C, or D")

            # Explanation validation
            expl = q.get("explanation")
            if not isinstance(expl, dict):
                report["is_valid"] = False
                report["errors"].append(f"{q_ref}: 'explanation' must be an object")
            else:
                simple = expl.get("simple")
                if not simple or not isinstance(simple, str) or len(simple.strip()) < 5:
                    report["is_valid"] = False
                    report["errors"].append(f"{q_ref}: 'explanation.simple' is empty or too short")
                steps = expl.get("steps")
                if steps is not None and not isinstance(steps, list):
                    report["is_valid"] = False
                    report["errors"].append(f"{q_ref}: 'explanation.steps' must be a list of strings")
                methods = expl.get("methods")
                if methods is not None:
                    if not isinstance(methods, list):
                        report["is_valid"] = False
                        report["errors"].append(f"{q_ref}: 'explanation.methods' must be a list")
                    else:
                        for m in methods:
                            if not isinstance(m, dict) or not m.get("name") or not m.get("steps"):
                                report["is_valid"] = False
                                report["errors"].append(f"{q_ref}: method item missing 'name' or 'steps'")

            report["verified_count"] += 1

        # Check topic count requirement
        if strict_distribution:
            if len(questions) != 20:
                report["is_valid"] = False
                report["errors"].append(f"{filename}: Expected exactly 20 questions, got {len(questions)}")
            for d in [1, 2, 3, 4, 5]:
                if topic_diff_counts[d] != 4:
                    report["is_valid"] = False
                    report["errors"].append(
                        f"{filename}: Difficulty Level {d} expected 4 questions, got {topic_diff_counts[d]}"
                    )

    if strict_distribution and report["total_questions"] != 200:
        report["is_valid"] = False
        report["errors"].append(
            f"Overall question count is {report['total_questions']}, expected exactly 200"
        )

    return report


def print_report(report):
    print("=" * 60)
    print("ExamPrep Hub — Question Bank Quality & Validation Report")
    print("=" * 60)
    print(f"Status:               {'PASSED (VALID)' if report['is_valid'] else 'FAILED'}")
    print(f"Total Questions:      {report['total_questions']} / 200 target")
    print(f"Starter Topics:       {report['topics_found']} / 10 required")
    print("-" * 60)
    print("Topic Breakdown (Expected: 20 per topic):")
    for topic, count in report["topic_counts"].items():
        status = "OK" if count == 20 else f"MISMATCH ({count})"
        print(f"  • {topic:<40} : {count:2d} questions [{status}]")
    print("-" * 60)
    print("Difficulty Level Distribution (Expected: 40 per level = 4 x 10 topics):")
    for lvl in range(1, 6):
        cnt = report["difficulty_distribution"].get(lvl, 0)
        status = "OK" if cnt == 40 else f"MISMATCH ({cnt})"
        print(f"  • Level {lvl}: {cnt:2d} questions [{status}]")
    print("-" * 60)

    if report["warnings"]:
        print(f"Warnings ({len(report['warnings'])}):")
        for w in report["warnings"][:10]:
            print(f"  ! {w}")
        if len(report["warnings"]) > 10:
            print(f"  ... and {len(report['warnings']) - 10} more warnings")

    if report["errors"]:
        print(f"\nErrors ({len(report['errors'])}):")
        for e in report["errors"][:20]:
            print(f"  X {e}")
        if len(report["errors"]) > 20:
            print(f"  ... and {len(report['errors']) - 20} more errors")
    else:
        print("\nAll structural schema, answer keys, options, and difficulty checks passed!")
    print("=" * 60)


if __name__ == "__main__":
    rep = validate_question_bank(strict_distribution=True)
    print_report(rep)
    sys.exit(0 if rep["is_valid"] else 1)
