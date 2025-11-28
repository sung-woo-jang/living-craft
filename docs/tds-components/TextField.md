# TextField

TextField 컴포넌트는 사용자가 텍스트를 입력할 수 있는 기본 입력 필드예요. 다양한 입력 타입과 검증 기능을 지원해요.

## 사용 예제

### 기본 사용

TextField를 사용하려면 value와 onChange를 지정하세요.

```tsx
import { TextField } from '@toss/tds-react-native';
import { useState } from 'react';

const [value, setValue] = useState('');

<TextField
  value={value}
  onChange={setValue}
  placeholder="텍스트를 입력하세요"
/>
```

### 레이블 추가

label 속성을 사용해 입력 필드의 레이블을 표시할 수 있어요.

```tsx
<TextField
  label="이름"
  value={value}
  onChange={setValue}
  placeholder="이름을 입력하세요"
/>
```

### 에러 상태

error 속성을 사용해 에러 메시지를 표시할 수 있어요.

```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const validateEmail = (value: string) => {
  if (!value.includes('@')) {
    setError('올바른 이메일 주소를 입력하세요');
  } else {
    setError('');
  }
  setEmail(value);
};

<TextField
  label="이메일"
  value={email}
  onChange={validateEmail}
  error={error}
  placeholder="email@example.com"
/>
```

### 도움말 텍스트

helperText 속성을 사용해 입력 필드 아래에 도움말을 표시할 수 있어요.

```tsx
<TextField
  label="비밀번호"
  value={password}
  onChange={setPassword}
  secureTextEntry
  helperText="8자 이상, 영문과 숫자를 포함해야 해요"
/>
```

### 필수 필드

required 속성을 사용해 필수 입력 필드임을 표시할 수 있어요.

```tsx
<TextField
  label="이름"
  required
  value={name}
  onChange={setName}
/>
```

### 비활성화 상태

disabled 속성을 사용해 입력 필드를 비활성화할 수 있어요.

```tsx
<TextField
  label="읽기 전용"
  value="수정할 수 없어요"
  disabled
/>
```

### 여러 줄 입력

multiline 속성을 사용해 여러 줄 텍스트를 입력받을 수 있어요.

```tsx
<TextField
  label="메모"
  value={memo}
  onChange={setMemo}
  multiline
  numberOfLines={4}
  placeholder="내용을 입력하세요"
/>
```

### 키보드 타입 설정

keyboardType을 사용해 입력 타입에 맞는 키보드를 표시할 수 있어요.

```tsx
<TextField
  label="전화번호"
  value={phone}
  onChange={setPhone}
  keyboardType="phone-pad"
  placeholder="010-0000-0000"
/>

<TextField
  label="이메일"
  value={email}
  onChange={setEmail}
  keyboardType="email-address"
  placeholder="email@example.com"
/>

<TextField
  label="숫자"
  value={number}
  onChange={setNumber}
  keyboardType="numeric"
  placeholder="숫자를 입력하세요"
/>
```

### 최대 길이 제한

maxLength를 사용해 입력 가능한 최대 문자 수를 제한할 수 있어요.

```tsx
<TextField
  label="이름"
  value={name}
  onChange={setName}
  maxLength={20}
  helperText={`${name.length}/20`}
/>
```

## 인터페이스

### TextFieldProps

| 속성 | 기본값 | 타입 | 설명 |
|------|--------|------|------|
| value* | - | string | 입력 필드의 현재 값을 지정해요 |
| onChange* | - | (value: string) => void | 값이 변경될 때 호출되는 함수예요 |
| label | - | string | 입력 필드의 레이블을 지정해요 |
| placeholder | - | string | 입력 전에 표시될 안내 텍스트를 지정해요 |
| error | - | string | 에러 메시지를 표시해요 |
| helperText | - | string | 도움말 텍스트를 표시해요 |
| required | false | boolean | 필수 입력 필드임을 표시해요 |
| disabled | false | boolean | 입력 필드를 비활성화해요 |
| multiline | false | boolean | 여러 줄 입력을 허용해요 |
| numberOfLines | 1 | number | 여러 줄 입력 시 표시할 줄 수를 지정해요 |
| secureTextEntry | false | boolean | 비밀번호 입력을 위해 텍스트를 마스킹해요 |
| keyboardType | 'default' | KeyboardTypeOptions | 키보드 타입을 지정해요 |
| maxLength | - | number | 입력 가능한 최대 문자 수를 제한해요 |
| autoFocus | false | boolean | 자동으로 포커스를 맞출지 여부를 지정해요 |
| editable | true | boolean | 입력 가능 여부를 지정해요 |
| style | - | StyleProp<ViewStyle> | 컴포넌트의 커스텀 스타일을 지정해요 |

*필수 속성

## 관련 컴포넌트

- SearchField: 검색 입력에 특화된 필드예요
- NumberKeypad: 숫자 입력을 위한 커스텀 키패드예요

---
*마지막 업데이트: 2025-11-28*
