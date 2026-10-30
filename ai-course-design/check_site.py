#!/usr/bin/env python3
"""Check static course resource links and ZIPs. No third-party packages required."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from zipfile import ZipFile, BadZipFile
import argparse
import re

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=set(); self.duplicates=[]; self.links=[]
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key=='id' and value:
                if value in self.ids: self.duplicates.append(value)
                self.ids.add(value)
            if key in ('href','src','poster') and value:
                self.links.append(value)

def check(root):
    root=root.resolve(); errors=[]; pages={}; count=0
    for path in root.rglob('*.html'):
        if any(part.startswith('.') for part in path.relative_to(root).parts): continue
        parser=Page(); parser.feed(path.read_text(encoding='utf-8')); pages[path]=parser
        errors.extend(f'{path.relative_to(root)}: duplicate id {i}' for i in parser.duplicates)
    def link(source, url):
        nonlocal count
        parts=urlsplit(url)
        if parts.scheme or parts.netloc: return
        count+=1
        if parts.path.startswith('/'):
            errors.append(f'{source.relative_to(root)}: root-relative link {url} breaks project-site portability'); return
        target=(source.parent/unquote(parts.path)).resolve() if parts.path else source
        if not target.is_relative_to(root):
            errors.append(f'{source.relative_to(root)}: link leaves site {url}'); return
        if target.is_dir(): target=target/'index.html'
        if not target.is_file():
            errors.append(f'{source.relative_to(root)}: missing {url}'); return
        if parts.fragment and target in pages and unquote(parts.fragment) not in pages[target].ids:
            errors.append(f'{source.relative_to(root)}: missing fragment {url}')
    for path, page in pages.items():
        for url in page.links: link(path,url)
    for path in root.rglob('*.css'):
        if any(part.startswith('.') for part in path.relative_to(root).parts): continue
        for url in re.findall(r'url\([\'\"]?([^\)\'\"]+)',path.read_text()): link(path,url)
    zips=0
    for path in root.rglob('*.zip'):
        if any(part.startswith('.') for part in path.relative_to(root).parts): continue
        zips+=1
        try:
            with ZipFile(path) as archive:
                bad=archive.testzip()
                if bad: errors.append(f'{path.relative_to(root)}: corrupt member {bad}')
        except BadZipFile: errors.append(f'{path.relative_to(root)}: invalid ZIP')
    return errors, len(pages), count, zips

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root',type=Path,nargs='?',default=Path('.'))
    args=parser.parse_args()
    errors,pages,links,zips=check(args.root)
    for error in errors: print('ERROR:',error)
    print(f'{pages} HTML pages; {links} local references; {zips} ZIP archives; {len(errors)} errors.')
    raise SystemExit(bool(errors))
