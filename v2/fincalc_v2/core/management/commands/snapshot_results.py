"""
Write calculators/default_results.json: the real JS engine's output for each
tool's default inputs, so the server HTML contains results without JavaScript.

    python manage.py snapshot_results      (needs Node.js; run after engine or default-input changes)
"""
import json
import subprocess
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.template.loader import render_to_string

from calculators.models import CALCULATOR_CHOICES, HEALTH_TYPES, INR_TYPES, CalculatorPage

# Results that depend on today's date cannot be pre-rendered.
SKIP = {"pregnancy"}
SCRIPT = Path(settings.BASE_DIR) / "scripts" / "run_engine.mjs"


def render_tool(calc_type):
    """The calculator template for one tool, without any database page."""
    return render_to_string("calculators/calculator_page.html", {
        "page": CalculatorPage(title="Snapshot", slug="snapshot", calculator_type=calc_type),
        "health_types": HEALTH_TYPES,
        "currency": "₹" if calc_type in INR_TYPES else "$",
        "defaults": {},
    })


def run_engine(jobs):
    """jobs: [(calc_type, {input_id: value})] -> engine output per job."""
    payload = [{"name": t, "html": render_tool(t), "inputs": i} for t, i in jobs]
    proc = subprocess.run(["node", str(SCRIPT)], input=json.dumps(payload), capture_output=True, text=True, check=True)
    results = json.loads(proc.stdout)
    for res in results:
        if res["error"] or res["unknown"]:
            raise RuntimeError(f"{res['name']}: error={res['error']} unknown inputs={res['unknown']}")
    return results


def build_snapshot():
    types = [t for t, _ in CALCULATOR_CHOICES if t not in SKIP]
    out = {}
    for res in run_engine([(t, {}) for t in types]):
        out[res["type"]] = {
            **{k.replace("-", "_"): v for k, v in res["text"].items() if k.startswith("res-")},
            "schedule": res["html"].get("schedule-table-body", ""),
        }
    return out


class Command(BaseCommand):
    help = "Regenerate calculators/default_results.json from the JS engine."

    def handle(self, *args, **options):
        from calculators.models import _DEFAULTS_PATH
        data = build_snapshot()
        _DEFAULTS_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
        self.stdout.write(self.style.SUCCESS(f"Wrote {len(data)} tools to {_DEFAULTS_PATH}"))
