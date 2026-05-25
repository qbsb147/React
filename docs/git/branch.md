## 역할 별 브랜치 분할
해당 프로젝트는 개인 프로젝트이지만 팀원의 역할별로 브랜치를 나눠서 기능을 개발한다고 가정합니다.

개발 시 메인 브랜치 이름 : develop
배포 전 메인 브랜치 이름 : release
배포 후 메인 브랜치 이름 : master

- 개발 시에는 각 feature 별로 기능 구현 및 master로 PR 요청을 합니다.
- 개발 완료 시에는 배포 전 release 브랜치를 생성하고 여기서 품질 검사를 진행합니다, 해당 브랜치는 이후 계속 배포 전 품질 검사를 위한 브랜치로 사용됩니다.
- 품질 검사 진행 완료 후 배포 시에는 master 브랜치를 생성합니다. 해당 브랜치는 이후에도 운영에서 계속 쓰입니다.
- master 브랜치 배포 후 버그가 생겼을 때 긴급 수정하는 브랜치입니다.

역할(기능)별 feature 분리
- layout : 사이드바, 헤더와 같은 기본 구성을 개발하는 브랜치입니다.
- dashboard : overview, user, event와 통계 UI를 개발하는 브랜치입니다.
- shop : 쇼핑몰 페이지 UI를 개발하는 브랜치입니다.
- data : api 연동을 하고 데이터를 다루며 상태를 연결하는 브랜치입니다.



## 브랜치 명령어

브랜치 이름 변경
- 로컬 : `git branch -m 기존이름 새로운이름` 혹은 현재 브랜치에서 `git branch -m 새로운이름`
- 원격 : `git push origin 새로운이름`

브랜치 생성
- 로컬 : `git branch develop`
- 원격 : `git push origin -u develop`
- 로컬 브랜치가 바라볼 원격 브랜치 설정
    - (로컬 develop 브랜치에서) `git branch --set-upstream-to origin/develop`  

브랜치 삭제
- 로컬 : `git branch -d <브랜치>`
    - 강제 삭제 : `git branch -D <브랜치> (병합 안된 것도 삭제)`
- 원격 : `git push origin --delete <브랜치>`


브랜치 목록 확인
- 로컬 : `git branch`
- 원격 : `git branch -r`
- 전체 : `git branch -a`


브랜치 전환
    `git checkout <브랜치>` 혹은 `git switch <브랜치>`  

브랜치 병합
    (현재 브랜치로)`git merge <브랜치>`  

- 여러 분기에서 작업한 내용을 확인 :  `$ git log --graph --all --decorate`  