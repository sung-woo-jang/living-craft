#!/bin/bash

# Admin 페이지의 모든 SCSS 파일에서 @include를 제거하는 스크립트

# 작업 디렉토리
ADMIN_DIR="/Users/jangseong-u/Desktop/Project/reservation/reservation-frontend/src/pages/admin"

# 교체 함수
replace_includes() {
  local file=$1

  # 백업 생성
  cp "$file" "$file.bak"

  # container
  sed -i '' 's/@include container;/max-width: var(--container-content-max-width);\
  margin: 0 auto;\
  padding: 0 var(--container-padding-desktop);\
\
  @media (max-width: var(--breakpoint-tablet)) {\
    padding: 0 var(--container-padding-tablet);\
  }\
\
  @media (max-width: var(--breakpoint-mobile)) {\
    padding: 0 var(--container-padding-mobile);\
  }/g' "$file"

  # flex mixins
  sed -i '' 's/@include flex-center;/display: flex;\
  align-items: center;\
  justify-content: center;/g' "$file"

  sed -i '' 's/@include flex-between;/display: flex;\
  justify-content: space-between;\
  align-items: center;/g' "$file"

  sed -i '' 's/@include flex-center-vertical;/display: flex;\
  align-items: center;/g' "$file"

  # typography mixins
  sed -i '' 's/@include heading-h1;/font-size: var(--font-size-h1);\
  line-height: var(--line-height-h1);\
  font-weight: var(--font-weight-bold);/g' "$file"

  sed -i '' 's/@include heading-h2;/font-size: var(--font-size-h2);\
  line-height: var(--line-height-h2);\
  font-weight: var(--font-weight-bold);/g' "$file"

  sed -i '' 's/@include heading-h3;/font-size: var(--font-size-h3);\
  line-height: var(--line-height-h3);\
  font-weight: var(--font-weight-bold);/g' "$file"

  sed -i '' 's/@include heading-h4;/font-size: var(--font-size-h4);\
  line-height: var(--line-height-h4);\
  font-weight: var(--font-weight-semibold);/g' "$file"

  sed -i '' 's/@include heading-h5;/font-size: var(--font-size-h5);\
  line-height: var(--line-height-h5);\
  font-weight: var(--font-weight-semibold);/g' "$file"

  sed -i '' 's/@include body-regular;/font-size: var(--font-size-body);\
  line-height: var(--line-height-body);/g' "$file"

  sed -i '' 's/@include body-large;/font-size: var(--font-size-body-large);\
  line-height: var(--line-height-body-large);/g' "$file"

  sed -i '' 's/@include body-small;/font-size: var(--font-size-body-small);\
  line-height: var(--line-height-body-small);/g' "$file"

  sed -i '' 's/@include caption;/font-size: var(--font-size-caption);\
  line-height: var(--line-height-caption);/g' "$file"

  # responsive mixins
  sed -i '' 's/@include mobile {/@media (max-width: var(--breakpoint-mobile)) {/g' "$file"
  sed -i '' 's/@include tablet {/@media (max-width: var(--breakpoint-tablet)) {/g' "$file"

  # card
  sed -i '' 's/@include card;/background-color: var(--color-grey-00);\
  border: 1px solid var(--color-grey-09);\
  border-radius: var(--radius-medium);\
  padding: var(--space-6);\
  box-shadow: var(--shadow-small);/g' "$file"

  sed -i '' 's/@include card-small;/background-color: var(--color-grey-00);\
  border: 1px solid var(--color-grey-09);\
  border-radius: var(--radius-medium);\
  padding: var(--space-4);\
  box-shadow: var(--shadow-small);/g' "$file"

  echo "Processed: $file"
}

# 모든 SCSS 파일 처리
find "$ADMIN_DIR" -name "*.scss" -type f | while read file; do
  replace_includes "$file"
done

echo "All files processed!"