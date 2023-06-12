## **Application 실행 방법**

### 1. dev dependencies 설치

```bash
npm install
# or
yarn
```

### 2. 개발용 서버 구동

```bash
npm run dev
# or
yarn dev
```

### 3. 빌드 (배포용 파일 생성)

```bash
npm run build
# or
yarn build
```

---

> 사용 언어 및 기술 : vanilla, typescript, eslint, babel, webpack, scss
>
> 이유:
>
> 1.  올해 초에 Vanilla.js로 개발한 SPA 프레임웍의 부족한 부분 수정을 하면서 TODO 리스트를 만들어보기 위해 직접 구현한 SPA 프레임웍을 적용
> 2.  typescript를 나중에 도입한 이유는 초기화한 state 같은 컴포넌트 내에 인스턴스, 메소드들의 타입 추론을 위해 도입
> 3.  개발 환경에서 수정된 부분을 바로 바로 적용하여 확인 할 수 있도록 하고 빌드를 하였을때 번들링된 빌드 파일을 생성하기 위해 웹팩 사용
> 4.  중첩, 변수 선언, 스타일 소스의 가독성을 높이기 위해 scss 사용
> 5.  기본적인 code convention을 가져가고 개발 시 가독성을 위해 eslint 활용
> 6.  드래그앤드롭 기능은 나중에 따로 더 다듬어서 라이브러리로 다시 구현해볼 생각임
