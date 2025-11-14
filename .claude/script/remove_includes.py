#!/usr/bin/env python3
import os
import re
import glob

# 교체 매핑
REPLACEMENTS = {
    r'@include container;': '''max-width: var(--container-content-max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding-desktop);

  @media (max-width: var(--breakpoint-tablet)) {
    padding: 0 var(--container-padding-tablet);
  }

  @media (max-width: var(--breakpoint-mobile)) {
    padding: 0 var(--container-padding-mobile);
  }''',

    r'@include flex-center;': '''display: flex;
  align-items: center;
  justify-content: center;''',

    r'@include flex-between;': '''display: flex;
  justify-content: space-between;
  align-items: center;''',

    r'@include flex-center-vertical;': '''display: flex;
  align-items: center;''',

    r'@include flex-center-horizontal;': '''display: flex;
  justify-content: center;''',

    r'@include heading-h1;': '''font-size: var(--font-size-h1);
  line-height: var(--line-height-h1);
  font-weight: var(--font-weight-bold);''',

    r'@include heading-h2;': '''font-size: var(--font-size-h2);
  line-height: var(--line-height-h2);
  font-weight: var(--font-weight-bold);''',

    r'@include heading-h3;': '''font-size: var(--font-size-h3);
  line-height: var(--line-height-h3);
  font-weight: var(--font-weight-bold);''',

    r'@include heading-h4;': '''font-size: var(--font-size-h4);
  line-height: var(--line-height-h4);
  font-weight: var(--font-weight-semibold);''',

    r'@include heading-h5;': '''font-size: var(--font-size-h5);
  line-height: var(--line-height-h5);
  font-weight: var(--font-weight-semibold);''',

    r'@include heading-h6;': '''font-size: var(--font-size-h6);
  line-height: var(--line-height-h6);
  font-weight: var(--font-weight-semibold);''',

    r'@include body-regular;': '''font-size: var(--font-size-body);
  line-height: var(--line-height-body);''',

    r'@include body-large;': '''font-size: var(--font-size-body-large);
  line-height: var(--line-height-body-large);''',

    r'@include body-small;': '''font-size: var(--font-size-body-small);
  line-height: var(--line-height-body-small);''',

    r'@include caption;': '''font-size: var(--font-size-caption);
  line-height: var(--line-height-caption);''',

    r'@include mobile \{': '@media (max-width: var(--breakpoint-mobile)) {',
    r'@include tablet \{': '@media (max-width: var(--breakpoint-tablet)) {',

    r'@include card;': '''background-color: var(--color-grey-00);
  border: 1px solid var(--color-grey-09);
  border-radius: var(--radius-medium);
  padding: var(--space-6);
  box-shadow: var(--shadow-small);''',

    r'@include card-small;': '''background-color: var(--color-grey-00);
  border: 1px solid var(--color-grey-09);
  border-radius: var(--radius-medium);
  padding: var(--space-4);
  box-shadow: var(--shadow-small);''',

    r'@include button-base;': '''display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-family: inherit;''',

    r'@include button-small;': '''padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-body-small);''',

    r'@include button-medium;': '''padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-body);''',

    r'@include button-large;': '''padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-body-large);''',

    r'@include button-primary;': '''background-color: var(--color-main-01);
  color: var(--color-grey-00);''',

    r'@include button-secondary;': '''background-color: var(--color-grey-02);
  color: var(--color-grey-08);''',

    r'@include button-outline;': '''background-color: transparent;
  border: 1px solid currentColor;''',

    r'@include button-ghost;': 'background-color: transparent;',

    r'@include input;': '''width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-grey-08);
  border-radius: var(--radius-small);
  font-size: var(--font-size-body);
  background-color: var(--color-grey-00);

  &:focus {
    outline: none;
    border-color: var(--color-main-01);
  }''',

    r'@include text-ellipsis;': '''overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;''',

    r'@include badge-success;': '''background-color: var(--color-badge-01);
  color: var(--color-grey-00);''',

    r'@include badge-info;': '''background-color: var(--color-badge-02);
  color: var(--color-grey-00);''',

    r'@include badge-warning;': '''background-color: var(--color-badge-03);
  color: var(--color-grey-00);''',

    r'@include badge-danger;': '''background-color: var(--color-badge-05);
  color: var(--color-grey-00);''',

    r'@include hover-lift;': 'transform: translateY(-2px);',

    r'@include scrollbar-thin;': '''&::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-10);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-07);
    border-radius: var(--radius-small);
  }'''
}

def process_file(filepath):
    """단일 파일 처리"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # 모든 교체 수행
        for pattern, replacement in REPLACEMENTS.items():
            content = re.sub(pattern, replacement, content)

        # 변경사항이 있으면 파일 저장
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Processed: {filepath}")
            return True
        else:
            print(f"- No changes: {filepath}")
            return False
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")
        return False

def main():
    admin_dir = "/Users/jangseong-u/Desktop/Project/reservation/reservation-frontend/src/pages/admin"

    # 모든 SCSS 파일 찾기
    scss_files = glob.glob(f"{admin_dir}/**/*.scss", recursive=True)

    print(f"Found {len(scss_files)} SCSS files to process\n")

    processed_count = 0
    for filepath in scss_files:
        if process_file(filepath):
            processed_count += 1

    print(f"\n{'='*50}")
    print(f"Total files processed: {processed_count}/{len(scss_files)}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
