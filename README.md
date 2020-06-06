#
# addressbook & sitebook for indexedDB
#

Browser에서 제공하는 기본 기능을 이용한 첫화면 구성.

처음 Browser를 실행시켰을때 화면을 아래와 같이 표시하여 사용의 효율성을 높이기 위해 만듬.
- 가장 자주 사용하는 사이트 표시 ( sitebook )
- 주소록 ( addressbook )

---

- DB : indexedDB
- Language : pure JavaScript,
- Browser : Chrome ( IE는 확인 중 )

---

** 구현된 기능
- Top 15 Favority Address listing
- 개별 주소에 대한 등록, 수정, 삭제 기능 제공
- 등록된 주소를 대상으로한 검색 기능 제공
- 등록된 주소록에 대해 백업할 수 있는 기능 제공 ( 부분 제공 )
- 백업 받아 놓은 파일을 읽어들여 주소록 구성 기능 제공
- 개인 사진 등록

** 구현해야할 기능
- 메인 페이지에 사용할 즐겨찾기 등록 및 관리 기능
