# Living Craft API 명세서

> 이 문서는 프론트엔드 페이지 분석을 기반으로 작성된 API 명세서입니다.
> 각 API에 `[사용 페이지]`를 표시하여 어디서 사용하는지 명시합니다.

---

## 목차

1. [인증 API](#1-인증-api)
2. [서비스 API](#2-서비스-api)
3. [포트폴리오 API](#3-포트폴리오-api)
4. [예약 API](#4-예약-api)
5. [리뷰 API](#5-리뷰-api)
6. [사용자 API](#6-사용자-api)
7. [백오피스 API](#7-백오피스-api)

---

## 공통 사항

### Base URL

```
개발: http://localhost:8000/api
운영: https://api.living-craft.com/api
```

### 인증 헤더

```
Authorization: Bearer {accessToken}
```

### 공통 응답 형식

```json
{
  "success": true,
  "data": {
    ...
  },
  "message": "요청이 성공적으로 처리되었습니다.",
  "statusCode": 200
}
```

### 에러 응답 형식

```json
{
  "success": false,
  "error": "BadRequestException",
  "message": "잘못된 요청입니다.",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/..."
}
```

---

## 1. 인증 API

> 나중에 개발 예정. Apps-in-Toss appLogin 사용.

### 1.1 토스 로그인

`[/unauthorized]`

토스 앱에서 받은 인가 코드로 로그인합니다.

```
POST /api/auth/login
```

**Request Body**

```json
{
  "authorizationCode": "string",
  "referrer": "DEFAULT"
  |
  "SANDBOX"
}
```

**Response**

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "number",
    "name": "string",
    "phone": "string",
    "createdAt": "string"
  }
}
```

### 1.2 토큰 갱신

```
POST /api/auth/refresh
```

**Request Body**

```json
{
  "refreshToken": "string"
}
```

**Response**

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

### 1.3 로그아웃

```
POST /api/auth/logout
```

**Headers**: `Authorization: Bearer {accessToken}`

**Response**

```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

---

## 2. 서비스 API

### 2.1 서비스 목록 조회

`[/, /reservation/service]`

서비스 목록, 지역 정보, 지역별 기본 비용을 함께 조회합니다.

```
GET /api/services
```

**Response**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "duration": "string",
      "requiresTimeSelection": "boolean",
      "serviceableRegions": [
        {
          "id": "string",
          "name": "string",
          "estimateFee": "number",
          "cities": [
            {
              "id": "string",
              "name": "string",
              "estimateFee": "number | null"
            }
          ]
        }
      ]
    }
  ]
}
```

**필드 설명**

| 필드                                 | 설명                                 |
|------------------------------------|------------------------------------|
| `duration`                         | 작업 소요 시간 (예: "하루 종일", "1-2시간")     |
| `requiresTimeSelection`            | 시공 시간 선택 필요 여부 (`false`면 하루 종일 작업) |
| `serviceableRegions`               | 서비스 가능 지역 목록                       |
| `serviceableRegions[].estimateFee` | 해당 지역 기본 출장 비용                     |
| `cities[].estimateFee`             | 도시별 출장 비용 (없으면 지역 기본 비용 적용)        |

**예시 응답**

```json
{
  "data": [
    {
      "id": "interior-film",
      "name": "인테리어 필름 시공",
      "description": "싱크대, 가구, 문틀 등에 필름 시공",
      "duration": "하루 종일",
      "requiresTimeSelection": false,
      "serviceableRegions": [
        {
          "id": "seoul",
          "name": "서울특별시",
          "estimateFee": 0,
          "cities": [
            {
              "id": "gangnam",
              "name": "강남구",
              "estimateFee": null
            },
            {
              "id": "gangbuk",
              "name": "강북구",
              "estimateFee": null
            }
          ]
        },
        {
          "id": "gyeonggi",
          "name": "경기도",
          "estimateFee": 10000,
          "cities": [
            {
              "id": "suwon",
              "name": "수원시",
              "estimateFee": null
            },
            {
              "id": "yongin",
              "name": "용인시",
              "estimateFee": 15000
            }
          ]
        }
      ]
    }
  ]
}
```

> **참고**: 도시의 `estimateFee`가 `null`이면 해당 지역(region)의 기본 `estimateFee`를 사용합니다.

### 2.2 예약 가능 시간 조회

`[/reservation/datetime]`

특정 날짜의 예약 가능한 시간대를 조회합니다.
운영 시간은 백오피스에서 유연하게 설정 가능합니다.

```
GET /api/services/:id/available-times?date=2024-01-15&type=estimate
```

**Query Parameters**

| 파라미터 | 타입     | 필수 | 설명                                         |
|------|--------|----|--------------------------------------------|
| date | string | O  | 조회할 날짜 (YYYY-MM-DD)                        |
| type | string | O  | 시간 유형 (`estimate`: 견적, `construction`: 시공) |

**Response**

```json
{
  "data": {
    "date": "2024-01-15",
    "dayOfWeek": "월",
    "isAvailable": true,
    "times": [
      {
        "time": "18:00",
        "available": true
      },
      {
        "time": "19:00",
        "available": true
      },
      {
        "time": "20:00",
        "available": false
      }
    ],
    "defaultTime": "09:00"
  }
}
```

**필드 설명**

| 필드            | 설명                             |
|---------------|--------------------------------|
| `isAvailable` | 해당 날짜 예약 가능 여부 (휴무일이면 `false`) |
| `times`       | 가능한 시간대 목록                     |
| `defaultTime` | 하루 종일 작업 시 기본 시작 시간            |

---

## 3. 포트폴리오 API

### 3.1 포트폴리오 목록 조회

`[/, /portfolio]`

```
GET /api/portfolios
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| category | string | X | 카테고리 필터 (인테리어필름, 유리청소 등) |
| limit | number | X | 조회 개수 (기본: 10) |
| offset | number | X | 오프셋 (페이지네이션) |

**Response**

```json
{
  "data": [
    {
      "id": "string",
      "thumbnail": "string",
      "category": "string",
      "projectName": "string",
      "description": "string",
      "duration": "string"
    }
  ],
  "total": "number"
}
```

### 3.2 포트폴리오 상세 조회

`[/portfolio/:id]`

```
GET /api/portfolios/:id
```

**Response**

```json
{
  "data": {
    "id": "string",
    "category": "string",
    "projectName": "string",
    "client": "string",
    "duration": "string",
    "detailedDescription": "string",
    "images": [
      "string"
    ],
    "tags": [
      "string"
    ],
    "relatedServiceId": "string"
  }
}
```

---

## 4. 예약 API

### 4.1 예약 생성

`[/reservation/confirmation]`

```
POST /api/reservations
```

**Headers**: `Authorization: Bearer {accessToken}`

**Request Body**

```json
{
  "serviceId": "string",
  "estimateDate": "string",
  "estimateTime": "string",
  "constructionDate": "string",
  "constructionTime": "string | null",
  "address": "string",
  "detailAddress": "string",
  "zipCode": "string",
  "customerName": "string",
  "customerPhone": "string",
  "memo": "string"
}
```

**필드 설명**
| 필드 | 설명 |
|------|------|
| `estimateDate` | 견적 희망 날짜 |
| `estimateTime` | 견적 희망 시간 |
| `constructionDate` | 시공 희망 날짜 |
| `constructionTime` | 시공 희망 시간 (하루 종일 작업이면 `null`) |

**Response**

```json
{
  "data": {
    "id": "string",
    "reservationNumber": "string",
    "status": "pending",
    "createdAt": "string"
  }
}
```

### 4.2 예약 상세 조회

`[/reviews/write/:reservationId]`

```
GET /api/reservations/:id
```

**Headers**: `Authorization: Bearer {accessToken}`

**Response**

```json
{
  "data": {
    "id": "string",
    "reservationNumber": "string",
    "service": {
      "id": "string",
      "name": "string"
    },
    "estimateDate": "string",
    "estimateTime": "string",
    "constructionDate": "string",
    "constructionTime": "string | null",
    "address": "string",
    "detailAddress": "string",
    "customerName": "string",
    "customerPhone": "string",
    "status": "pending"
    |
    "confirmed"
    |
    "completed"
    |
    "cancelled",
    "canCancel": "boolean",
    "canReview": "boolean",
    "createdAt": "string"
  }
}
```

### 4.3 예약 취소

`[/my/reservations]`

```
DELETE /api/reservations/:id
```

**Headers**: `Authorization: Bearer {accessToken}`

**Response**

```json
{
  "success": true,
  "message": "예약이 취소되었습니다."
}
```

---

## 5. 리뷰 API

### 5.1 리뷰 목록 조회

`[/, /reviews]`

```
GET /api/reviews
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| rating | number | X | 평점 필터 (1-5) |
| serviceId | string | X | 서비스 ID 필터 |
| limit | number | X | 조회 개수 (기본: 10) |
| offset | number | X | 오프셋 (페이지네이션) |

**Response**

```json
{
  "data": [
    {
      "id": "string",
      "serviceName": "string",
      "rating": "number",
      "comment": "string",
      "userName": "string",
      "createdAt": "string"
    }
  ],
  "total": "number"
}
```

### 5.2 리뷰 작성

`[/reviews/write/:reservationId]`

```
POST /api/reviews
```

**Headers**: `Authorization: Bearer {accessToken}`

**Request Body**

```json
{
  "reservationId": "string",
  "rating": "number",
  "comment": "string"
}
```

**Response**

```json
{
  "data": {
    "id": "string",
    "rating": "number",
    "comment": "string",
    "createdAt": "string"
  }
}
```

---

## 6. 사용자 API

### 6.1 내 정보 조회

`[/my]`

```
GET /api/users/me
```

**Headers**: `Authorization: Bearer {accessToken}`

**Response**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "email": "string",
    "createdAt": "string"
  }
}
```

### 6.2 내 예약 목록 조회

`[/my/reservations]`

```
GET /api/users/me/reservations
```

**Headers**: `Authorization: Bearer {accessToken}`

**Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| status | string | X | 상태 필터 (confirmed, completed, cancelled) |

**Response**

```json
{
  "data": [
    {
      "id": "string",
      "reservationNumber": "string",
      "serviceName": "string",
      "estimateDate": "string",
      "estimateTime": "string",
      "constructionDate": "string",
      "constructionTime": "string | null",
      "status": "string",
      "canCancel": "boolean",
      "canReview": "boolean"
    }
  ]
}
```

### 6.3 내 리뷰 목록 조회

`[/my/reviews]`

```
GET /api/users/me/reviews
```

**Headers**: `Authorization: Bearer {accessToken}`

**Response**

```json
{
  "data": [
    {
      "id": "string",
      "serviceName": "string",
      "rating": "number",
      "comment": "string",
      "createdAt": "string"
    }
  ]
}
```

---

## 7. 백오피스 API

> 백오피스 전용 API입니다. 관리자 인증이 필요합니다.

### 7.1 관리자 인증

#### 관리자 로그인

```
POST /api/admin/auth/login
```

**Request Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response**

```json
{
  "accessToken": "string"
}
```

---

### 7.2 운영 시간 설정

> 견적/시공 가능한 시간대를 유연하게 관리합니다.

#### 운영 시간 조회

```
GET /api/admin/settings/operating-hours
```

**Response**

```json
{
  "data": {
    "estimate": {
      "availableDays": [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri"
      ],
      "startTime": "18:00",
      "endTime": "22:00",
      "slotDuration": 60
    },
    "construction": {
      "availableDays": [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat"
      ],
      "startTime": "09:00",
      "endTime": "18:00",
      "slotDuration": 60
    },
    "holidays": [
      "2024-01-01",
      "2024-02-09",
      "2024-02-10"
    ]
  }
}
```

**필드 설명**
| 필드 | 설명 |
|------|------|
| `availableDays` | 가능한 요일 (mon~sun) |
| `startTime` | 시작 시간 |
| `endTime` | 종료 시간 |
| `slotDuration` | 시간 슬롯 간격 (분) |
| `holidays` | 휴무일 목록 |

#### 운영 시간 수정

```
PUT /api/admin/settings/operating-hours
```

**Request Body**

```json
{
  "estimate": {
    "availableDays": [
      "mon",
      "tue",
      "wed",
      "thu",
      "fri"
    ],
    "startTime": "18:00",
    "endTime": "22:00"
  },
  "construction": {
    "availableDays": [
      "mon",
      "tue",
      "wed",
      "thu",
      "fri",
      "sat"
    ],
    "startTime": "09:00",
    "endTime": "18:00"
  }
}
```

#### 휴무일 추가

```
POST /api/admin/settings/holidays
```

**Request Body**

```json
{
  "date": "2024-01-15",
  "reason": "개인 휴가"
}
```

#### 휴무일 삭제

```
DELETE /api/admin/settings/holidays/:date
```

---

### 7.3 예약 관리

#### 전체 예약 목록 조회

```
GET /api/admin/reservations
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| status | string | X | 상태 필터 |
| startDate | string | X | 시작 날짜 |
| endDate | string | X | 종료 날짜 |
| search | string | X | 검색어 (이름, 전화번호) |

**Response**

```json
{
  "data": [
    {
      "id": "string",
      "reservationNumber": "string",
      "customerName": "string",
      "customerPhone": "string",
      "serviceName": "string",
      "estimateDate": "string",
      "estimateTime": "string",
      "constructionDate": "string",
      "constructionTime": "string | null",
      "address": "string",
      "status": "string",
      "createdAt": "string"
    }
  ],
  "total": "number"
}
```

#### 예약 상태 변경

```
PATCH /api/admin/reservations/:id/status
```

**Request Body**

```json
{
  "status": "confirmed"
  |
  "completed"
  |
  "cancelled"
}
```

#### 예약 취소 (관리자)

```
DELETE /api/admin/reservations/:id
```

---

### 7.4 서비스 관리

#### 서비스 목록 조회

```
GET /api/admin/services
```

#### 서비스 생성

```
POST /api/admin/services
```

**Request Body**

```json
{
  "name": "string",
  "description": "string",
  "duration": "string",
  "requiresTimeSelection": "boolean",
  "serviceableRegions": [
    {
      "regionId": "string",
      "cityIds": [
        "string"
      ]
    }
  ]
}
```

#### 서비스 수정

```
PUT /api/admin/services/:id
```

#### 서비스 삭제

```
DELETE /api/admin/services/:id
```

---

### 7.5 포트폴리오 관리

#### 포트폴리오 목록 조회

```
GET /api/admin/portfolios
```

#### 포트폴리오 생성

```
POST /api/admin/portfolios
```

**Request Body**

```json
{
  "category": "string",
  "projectName": "string",
  "client": "string",
  "duration": "string",
  "description": "string",
  "detailedDescription": "string",
  "images": [
    "string"
  ],
  "tags": [
    "string"
  ],
  "relatedServiceId": "string"
}
```

#### 포트폴리오 수정

```
PUT /api/admin/portfolios/:id
```

#### 포트폴리오 삭제

```
DELETE /api/admin/portfolios/:id
```

---

### 7.6 리뷰 관리

#### 리뷰 목록 조회

```
GET /api/admin/reviews
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| rating | number | X | 평점 필터 |
| serviceId | string | X | 서비스 ID |

#### 리뷰 삭제

```
DELETE /api/admin/reviews/:id
```

---

### 7.7 고객 관리

#### 고객 목록 조회

```
GET /api/admin/customers
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| search | string | X | 검색어 (이름, 전화번호) |

**Response**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "phone": "string",
      "totalReservations": "number",
      "totalReviews": "number",
      "createdAt": "string"
    }
  ],
  "total": "number"
}
```

#### 고객 상세 조회

```
GET /api/admin/customers/:id
```

**Response**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "email": "string",
    "reservations": [
      ...
    ],
    "reviews": [
      ...
    ],
    "createdAt": "string"
  }
}
```

---

## 부록: 주소 검색 API

> 네이버 주소 API 또는 카카오 주소 API 사용 권장

### 주소 검색 (프록시)

`[/reservation/service]`

외부 API를 프록시하여 CORS 문제를 해결합니다.

```
GET /api/address/search?query=강남구
```

**Response**

```json
{
  "data": [
    {
      "roadAddress": "string",
      "jibunAddress": "string",
      "zipCode": "string"
    }
  ]
}
```
