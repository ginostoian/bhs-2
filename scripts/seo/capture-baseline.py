#!/usr/bin/env python3
"""Capture public HTML and parsed SEO evidence into a new, never-overwritten directory."""
import argparse
import concurrent.futures
import csv
import datetime
import gzip
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, HTTPRedirectHandler, build_opener
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, url):
        super().__init__(convert_charrefs=True)
        self.url = url
        self.stack = []
        self.text = []
        self.main = []
        self.title = []
        self.h1 = []
        self.ids = []
        self.links = set()
        self.images = set()
        self.meta = {}
        self.canonical = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append(tag)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if tag == 'meta' and attrs.get('name'):
            self.meta[attrs['name'].lower()] = attrs.get('content', '')
        if tag == 'link' and 'canonical' in attrs.get('rel', '').split():
            self.canonical.append(urljoin(self.url, attrs.get('href', '')))
        if tag == 'a' and attrs.get('href'):
            link = urljoin(self.url, attrs['href'])
            if urlsplit(link).hostname in {'bhstudio.co.uk', 'www.bhstudio.co.uk', urlsplit(self.url).hostname}:
                self.links.add(link)
        if tag in {'img', 'source'}:
            for attr in ('src', 'srcset'):
                for candidate in attrs.get(attr, '').split(','):
                    if candidate.strip():
                        self.images.add(urljoin(self.url, candidate.strip().split()[0]))

    def handle_endtag(self, tag):
        if tag in self.stack:
            self.stack = self.stack[:len(self.stack) - 1 - self.stack[::-1].index(tag)]

    def handle_data(self, data):
        if any(t in self.stack for t in ('script', 'style', 'noscript')):
            return
        data = ' '.join(data.split())
        if not data:
            return
        self.text.append(data)
        if 'main' in self.stack or 'article' in self.stack:
            self.main.append(data)
        if 'title' in self.stack:
            self.title.append(data)
        if 'h1' in self.stack:
            self.h1.append(data)


class Redirects(HTTPRedirectHandler):
    # Python 3.9 does not follow permanent 308 redirects by default.
    def http_error_308(self, req, fp, code, msg, headers):
        return self.http_error_302(req, fp, 301, msg, headers)


def fetch(url):
    request = Request(url, headers={'User-Agent': 'BetterHomes-SEOBaseline/1.0'})
    try:
        response = build_opener(Redirects()).open(request, timeout=45)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.url, dict(response.headers), response.read()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--origin', default='https://bhstudio.co.uk')
    parser.add_argument('--gsc', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--source-commit', required=True)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=False)
    (args.output / 'html').mkdir()
    sitemap_urls = set()
    visited = set()

    def sitemap(url):
        if url in visited:
            return
        visited.add(url)
        status, final, headers, body = fetch(url)
        if status != 200:
            raise RuntimeError(f'Sitemap returned {status}: {url}')
        (args.output / f'sitemap-{len(visited)}.xml').write_bytes(body)
        root = ET.fromstring(body)
        locations = [el.text for el in root.iter() if el.tag.endswith('}loc')]
        if root.tag.endswith('sitemapindex'):
            for location in locations:
                sitemap(location)
        else:
            sitemap_urls.update(locations)

    sitemap(args.origin + '/sitemap.xml')
    with args.gsc.open(encoding='utf-8-sig', newline='') as file:
        historical = {row['Top pages'] for row in csv.DictReader(file)}
    urls = sorted(sitemap_urls | historical)

    def capture(url):
        key = hashlib.sha256(url.encode()).hexdigest()[:20]
        try:
            status, final, headers, body = fetch(url)
            (args.output / 'html' / f'{key}.html.gz').write_bytes(gzip.compress(body, mtime=0))
            page = Page(final)
            page.feed(body.decode('utf-8', errors='replace'))
            return dict(url=url, status=status, final_url=final,
                        in_sitemap=url in sitemap_urls, in_gsc=url in historical,
                        html=f'html/{key}.html.gz', sha256=hashlib.sha256(body).hexdigest(),
                        canonical=page.canonical, robots={k: v for k, v in page.meta.items() if 'robots' in k or k == 'googlebot'},
                        x_robots_tag=next((v for k, v in headers.items() if k.lower() == 'x-robots-tag'), None),
                        title=' '.join(page.title), description=page.meta.get('description'),
                        h1=page.h1, section_ids=page.ids, main_content='\n'.join(page.main),
                        text_content='\n'.join(page.text), images=sorted(page.images), internal_links=sorted(page.links))
        except Exception as error:
            return dict(url=url, error=str(error))

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        pages = list(pool.map(capture, urls))
    result = dict(captured_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                  origin=args.origin, source_commit=args.source_commit,
                  deployment_commit_verified=False,
                  note='Source commit is the main reference; live deployment commit is not exposed/verified. GSC inputs are the 8 September export. No backlink export supplied.',
                  sitemap_count=len(sitemap_urls), historical_count=len(historical), pages=pages)
    target = args.output / 'manifest.json'
    target.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    (args.output / 'manifest.sha256').write_text(hashlib.sha256(target.read_bytes()).hexdigest() + '  manifest.json\n')
    failures = [p for p in pages if 'error' in p]
    print(json.dumps(dict(pages=len(pages), sitemap=len(sitemap_urls), historical=len(historical), failures=failures)))
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
