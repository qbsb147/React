## 단일 브랜치
해당 프로젝트는 단일 프로젝트이기 때문에 단일 브랜치로 작업합니다.  
단, 필수 요소들이 개발이 되었다고 판단했을 경우 개발 중인 브랜치랑 배포 가능한(?) 브랜치를 구분하기 위해  
main, develop 브랜치를 나누고 작업을 develop에서 진행합니다.  
- 원격 브랜치 생성은 `git push origin -u develop`  
- 로컬 브랜치 생성은 `git branch develop`  
- 로컬 브랜치가 바라볼 원격 브랜치 설정은  
- (로컬 develop 브랜치에서) `git branch --set-upstream-to origin/develop`  
를 입력해주면 됩니다.  

hotfix나 release, feature 브랜치는 개인 프로젝트에서는 과한 브랜치 전략이기 때문에 이는 생성하지 않습니다.  

- 브랜치 전환 `git checkout <브랜치>` 혹은 `git switch <브랜치>`  
- 브랜치 병합 (현재 브랜치로)`git merge <브랜치>`  
- 여러 분기에서 작업한 내용을 확인 :  `$ git log --graph --all --decorate`  