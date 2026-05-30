## Git 기본 명령어

- `git init`  
  저장소 초기화 (현재 폴더를 Git 관리 대상으로 변경, .git 생성)

- `git add <파일>`  
  커밋할 파일을 스테이징 영역에 추가

- `git add .`  
  현재 디렉토리의 모든 변경 파일을 스테이징

- `git status`  
  변경된 파일 상태 확인 (staged / unstaged / untracked 구분)

- `git commit -m "메시지"`  
  스테이징된 변경 내용을 하나의 버전으로 저장

- `git commit -am "메시지"`  
  수정된 파일을 자동 add 후 commit (새 파일 제외)

- `git log`  
  커밋 이력 확인

- `git diff`  
  변경된 내용 비교 (작업 파일 ↔ 커밋 / 스테이지 간 차이 확인)

- `git rm --cached <파일>`  
  Git 추적만 제거 (파일은 로컬에 유지)

- `.gitignore`  
  Git이 추적하지 않을 파일 목록 정의

## Github에 잘못 올라간 파일 삭제

- `git rm <파일명>`  
  로컬 + 원격 저장소에서 파일 삭제

- `git rm -r <폴더명>`  
  폴더 전체 삭제

- `git rm --cached <파일명>`  
  원격 저장소에서만 삭제 (로컬 파일은 유지)

- `git rm --cached -r <폴더명>`  
  원격 저장소에서 폴더만 삭제 (로컬 유지)

- `git commit -m "메시지"`  
  삭제 내용 커밋

- `git push origin <브랜치>`  
  삭제 내용을 원격 저장소에 반영

- `.gitignore`  
  앞으로 해당 파일이 다시 올라가지 않도록 제외 설정

---

## 핵심 흐름

git rm → git commit → git push

## git blame (수정 내역 확인)

- `git blame <파일명>`  
  파일의 각 라인을 마지막으로 수정한 사람, 커밋, 시간 확인

- `git blame -s <파일명>`  
  작성자와 시간 정보 숨기고 간단히 출력

- `git blame -L <start,end> <파일명>`  
  특정 라인 범위의 수정 이력만 확인

- `git show <커밋ID>`  
  해당 커밋의 상세 변경 내용 확인

- `git blame -w <파일명>`  
  공백 변경은 무시하고 실제 코드 변경만 추적

- `git blame --porcelain <파일명>`  
  파싱 가능한 상세 형식으로 출력 (스크립트/IDE용)
