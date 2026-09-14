#!/usr/bin/env python3
"""Check same-site links with fragments against parsed response HTML, not scripts."""
import importlib.util
import json
import sys
from pathlib import Path
from urllib.parse import urldefrag, unquote, urljoin, urlsplit

spec = importlib.util.spec_from_file_location('baseline', Path(__file__).with_name('capture-baseline.py'))
baseline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(baseline)
cache = {}


def read(url):
    if url not in cache:
        status, final, _, body = baseline.fetch(url)
        page = baseline.Page(final)
        page.feed(body.decode('utf-8', errors='replace'))
        cache[url] = (status, page)
    return cache[url]


failures = []
checked = 0
for url in sys.argv[1:]:
    status, page = read(url)
    if status != 200:
        failures.append(dict(source=url, issue='source_http_status', status=status))
        continue
    for link in sorted(page.links):
        destination, fragment = urldefrag(urljoin(url, link))
        if not fragment or urlsplit(destination).netloc != urlsplit(url).netloc:
            continue
        checked += 1
        try:
            target_status, target = read(destination)
            if target_status != 200:
                failures.append(dict(source=url, link=link, issue='destination_http_status', status=target_status))
            elif unquote(fragment) not in target.ids:
                failures.append(dict(source=url, link=link, issue='missing_anchor'))
        except Exception as error:
            failures.append(dict(source=url, link=link, issue='request_error', detail=str(error)))
print(json.dumps(dict(checked=checked, failures=failures), indent=2))
raise SystemExit(1 if failures or not sys.argv[1:] else 0)
