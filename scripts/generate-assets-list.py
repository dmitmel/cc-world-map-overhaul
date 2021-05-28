#!/usr/bin/env python3
import os
import json
import sys


__dir__ = os.path.dirname(__file__)


def main():
  assets_list = set()

  assets_dir = os.path.normpath(os.path.join(__dir__, '..', 'assets'))
  for parent, _dirs, files in os.walk(assets_dir):
    rel_parent = os.path.relpath(parent, assets_dir)
    for file_name in files:
      file_ext = os.path.splitext(file_name)[1]
      if file_ext != '.xcf' and file_ext != '.psd':
        assets_list.add(os.path.join(rel_parent, file_name).replace(os.path.sep, '/'))

  assets_list = sorted(assets_list)
  json.dump(assets_list, sys.stdout, indent=2, ensure_ascii=False)
  sys.stdout.write('\n')


if __name__ == '__main__':
  main()
