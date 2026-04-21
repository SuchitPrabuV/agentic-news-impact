from __future__ import annotations

import json
import re
from json import JSONDecodeError


def _attempt_json_load(candidate: str) -> dict:
    try:
        parsed = json.loads(candidate)
    except JSONDecodeError:
        cleaned = re.sub(r",(\s*[}\]])", r"\1", candidate)
        try:
            parsed = json.loads(cleaned)
        except JSONDecodeError:
            return {}

    return parsed if isinstance(parsed, dict) else {}


def extract_json(text: str) -> dict:
    if not text:
        return {}

    direct = _attempt_json_load(text.strip())
    if direct:
        return direct

    decoder = json.JSONDecoder()
    for start_index, char in enumerate(text):
        if char != "{":
            continue

        try:
            parsed, _ = decoder.raw_decode(text[start_index:])
        except JSONDecodeError:
            continue

        if isinstance(parsed, dict):
            return parsed

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return {}

    return _attempt_json_load(match.group(0))
